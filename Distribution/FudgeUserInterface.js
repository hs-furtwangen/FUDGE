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
            this.source = null;
        }
        static { this.dragDrop = new Clipboard(); }
        static { this.copyPaste = new Clipboard(); }
        get(_class = Object, _filter = true) {
            if (_class)
                return this.objects.filter(_object => _object instanceof _class);
            else
                return this.objects;
        }
        clear() {
            this.objects = [];
        }
        set(_objects, _source, _operation) {
            this.objects = _objects.slice();
            this.source = _source;
            this.operation = _operation;
            console.log(this);
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
                        this.controller.copyPaste.sources = await this.controller.copy(this.controller.copyPaste.sources);
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
            /** Stores references to objects being copied or cut, and objects to paste to. Override with references in outer scope, if copy&paste should operate outside of tree */
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
        constructor(_controller, _data, _attIcon) {
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
            this.hndCopyPaste = async (_event) => {
                console.log(_event);
                // _event.stopPropagation();
                // let item: TreeItem<T> = <TreeItem<T>>Reflect.get(_event, "item");
                switch (_event.type) {
                    case "copy" /* EVENT.COPY */:
                        this.controller.copy(this.controller.selection, _event.type);
                        break;
                    case "cut" /* EVENT.CUT */:
                        this.controller.copy(this.controller.selection, _event.type);
                        break;
                    case "paste" /* EVENT.PASTE */:
                        let objects = await this.controller.paste();
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
            this.addEventListener("focusNext" /* EVENT.FOCUS_NEXT */, this.hndFocus);
            this.addEventListener("focusPrevious" /* EVENT.FOCUS_PREVIOUS */, this.hndFocus);
            this.addEventListener("escape" /* EVENT.ESCAPE */, this.hndEscape);
            this.addEventListener("delete" /* EVENT.DELETE */, this.hndDelete);
            this.addEventListener("copy" /* EVENT.COPY */, this.hndCopyPaste);
            this.addEventListener("cut" /* EVENT.CUT */, this.hndCopyPaste);
            this.addEventListener("paste" /* EVENT.PASTE */, this.hndCopyPaste);
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
            /** Stores references to objects being copied or cut, and objects to paste to. Override with references in outer scope, if copy&paste should operate outside of tree */
            this.copyPaste = { sources: [], target: null };
        }
        /**
         * Remove the objects to be deleted, e.g. the current selection, from the data structure the table refers to and
         * return a list of those objects in order for the according [[TableItems]] to be deleted also
         * @param _expendables The expendable objects
         */
        async delete(_expendables) { return _expendables; }
        /**
         * Refer objects to the clipboard for copy & paste
         * @param _objects The objects to refer
         */
        copy(_objects, _operation) {
            FudgeUserInterface.Clipboard.copyPaste.set(_objects, null, _operation);
        }
        /**
         * Retrieve objects from the clipboard, and process and return them to add to the table
         */
        async paste(_class = null) {
            let objects = FudgeUserInterface.Clipboard.copyPaste.get(_class, true); // possible to filter for only objects of specific type
            return objects;
        }
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
                }
            };
            this.hndCopyPaste = (_event) => {
                Reflect.set(_event, "item", this);
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
            this.create(this.controller.getHead(), _attIcon);
            this.className = "table";
            this.addEventListener("pointerup" /* EVENT.POINTER_UP */, this.hndPointerUp);
            this.addEventListener("keydown" /* EVENT.KEY_DOWN */, this.hndKey);
            this.addEventListener("change" /* EVENT.CHANGE */, this.hndChange);
            this.addEventListener("copy" /* EVENT.COPY */, this.hndCopyPaste, true);
            this.addEventListener("cut" /* EVENT.CUT */, this.hndCopyPaste, true);
            this.addEventListener("paste" /* EVENT.PASTE */, this.hndCopyPaste, true);
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
            /** Stores references to objects being copied or cut, and objects to paste to. Override with references in outer scope, if copy&paste should operate outside of tree */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VVc2VySW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ2xpcGJvYXJkLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvUmVmZXJlbmNlcy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvR2VuZXJhdG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Qm9vbGVhbi50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudENvbG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50RGlnaXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZW1wbGF0ZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDN4My50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDR4NC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE91dHB1dC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFNlbGVjdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFN0ZXBwZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZXh0SW5wdXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RldGFpbHMudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RldGFpbHNBcnJheS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvRGlhbG9nLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9NdWx0aUxldmVsTWVudS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvV2FybmluZy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tVHJlZS9DdXN0b21UcmVlTGlzdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tVHJlZS9DdXN0b21UcmVlLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21UcmVlL0N1c3RvbVRyZWVDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21UcmVlL0N1c3RvbVRyZWVJdGVtLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVGFibGUvVGFibGVDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZUl0ZW0udHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZUxpc3QudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlSXRlbS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0V2ZW50L0V2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLGtCQUFrQixDQWtDM0I7QUFsQ0QsV0FBVSxrQkFBa0I7SUFDMUI7OztPQUdHO0lBS0gsTUFBYSxTQUFTO1FBQXRCO1lBR1MsWUFBTyxHQUFnQixFQUFFLENBQUM7WUFFMUIsV0FBTSxHQUFXLElBQUksQ0FBQztRQW1CL0IsQ0FBQztpQkF2QmUsYUFBUSxHQUFjLElBQUksU0FBUyxFQUFFLEFBQTdCLENBQThCO2lCQUN0QyxjQUFTLEdBQWMsSUFBSSxTQUFTLEVBQUUsQUFBN0IsQ0FBOEI7UUFLOUMsR0FBRyxDQUFJLFNBQStCLE1BQU0sRUFBRSxVQUFtQixJQUFJO1lBQzFFLElBQUksTUFBTTtnQkFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxZQUFZLE1BQU0sQ0FBQyxDQUFDOztnQkFFakUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3hCLENBQUM7UUFFTSxLQUFLO1lBQ1YsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDcEIsQ0FBQztRQUVNLEdBQUcsQ0FBQyxRQUFrQixFQUFFLE9BQWUsRUFBRSxVQUF5QjtZQUN2RSxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztZQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLENBQUM7O0lBdkJVLDRCQUFTLFlBd0JyQixDQUFBO0FBQ0gsQ0FBQyxFQWxDUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBa0MzQjtBQ2xDRCw2SUFBNkk7QUNBN0ksSUFBVSxrQkFBa0IsQ0F3TzNCO0FBeE9ELFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQjs7O09BR0c7SUFDSCxNQUFhLFVBQVU7UUFhckIsWUFBbUIsUUFBK0MsRUFBRSxXQUF3QjtZQVZsRixlQUFVLEdBQVcsR0FBRyxDQUFDO1lBS25DLGtGQUFrRjtZQUN4RSxpQkFBWSxHQUFjLElBQUksQ0FBQztZQXFLL0Isa0JBQWEsR0FBRyxLQUFLLEVBQUUsTUFBYSxFQUFpQixFQUFFO2dCQUMvRCxJQUFJLElBQUksR0FBYSxFQUFFLENBQUM7Z0JBQ3hCLEtBQUssSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7b0JBQ3pDLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVO3dCQUMzQixNQUFNO29CQUVSLElBQUksR0FBRyxHQUF5QixNQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM1RCxJQUFJLEdBQUc7d0JBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkIsQ0FBQztnQkFDRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2pDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzVFLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFFekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1RSxDQUFDLENBQUM7WUFFUSxtQkFBYyxHQUFHLEtBQUssRUFBRSxNQUFhLEVBQWlCLEVBQUU7Z0JBQ2hFLElBQUksUUFBUSxHQUEyQixNQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztnQkFDL0QsSUFBSSxJQUFJLEdBQWEsRUFBRSxDQUFDO2dCQUN4QixJQUFJLE9BQU8sR0FBK0IsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDeEQsSUFBSSxPQUE4QyxDQUFDO2dCQUVuRCxDQUFDLENBQUMsdURBQXVEO29CQUN2RCxJQUFJLE9BQU8sR0FBZ0IsT0FBTyxDQUFDO29CQUNuQyxPQUFPLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7d0JBQ2xDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7NEJBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUN6QyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztvQkFDbEMsQ0FBQztvQkFDRCxxQkFBcUI7b0JBQ3JCLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO29CQUN2QixLQUFLLElBQUksR0FBRyxJQUFJLElBQUk7d0JBQ2xCLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztnQkFFRCx5QkFBeUI7Z0JBQ1ksT0FBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbEUsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDO1lBRVEsWUFBTyxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQzFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7b0JBQzVDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO29CQUMzQixPQUFPO2dCQUNULENBQUM7Z0JBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDO1lBak5BLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO1lBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUIscUdBQXFHO1lBQ3JHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQiw0QkFBYyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsK0NBQXdCLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvRSxDQUFDO1FBRUQ7OztXQUdHO1FBQ0ksTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUF3QixFQUFFLFFBQW1CO1lBQ3ZFLEtBQUssSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksT0FBTyxHQUF1QyxVQUFVLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNyRyxJQUFJLE9BQU8sSUFBSSxJQUFJO29CQUNqQixTQUFTO2dCQUVYLElBQUksT0FBTyxZQUFZLG1CQUFBLGFBQWE7b0JBQ2xDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7cUJBQ3ZDLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLE1BQU07b0JBQ3RDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7b0JBRWpFLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ2xDLENBQUM7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDO1FBRUQ7OztXQUdHO1FBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUErQyxFQUFFLFdBQXdCLEVBQUUsUUFBb0IsRUFBRSxNQUFrQjtZQUMxSSx3RUFBd0U7WUFDeEUsSUFBSSxPQUFPLEdBQWMsUUFBUSxJQUFJLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1lBQzNFLDhFQUE4RTtZQUM5RSxJQUFJLFlBQVksR0FBNEIsTUFBTSxJQUFJLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVqRyxLQUFLLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO2dCQUN4QixJQUFJLE9BQU8sR0FBZ0IsVUFBVSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDOUUsSUFBSSxPQUFPLElBQUksSUFBSTtvQkFDakIsU0FBUztnQkFFWCxJQUFJLE9BQU8sWUFBWSxtQkFBQSxhQUFhO29CQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQW1CLE9BQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQztxQkFDdkQsSUFBSSxPQUFPLFlBQVksZ0JBQWdCO29CQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztxQkFDMUIsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLFlBQVksTUFBTTtvQkFDMUMsNEhBQTRIO29CQUM1SCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQXVCLE9BQVEsQ0FBQyxLQUFLLENBQUM7cUJBQy9DLENBQUM7b0JBQ0osSUFBSSxVQUFVLEdBQWMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3RELElBQUksVUFBcUIsQ0FBQztvQkFDMUIsVUFBVSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLFVBQVUsWUFBWSxDQUFDLENBQUMsWUFBWSxJQUFJLFVBQVUsWUFBWSxDQUFDLENBQUMsT0FBTzt3QkFDekUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLGNBQWM7Z0JBQ25GLENBQUM7WUFDSCxDQUFDO1lBQ0QsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUVEOzs7V0FHRztRQUNJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUErQyxFQUFFLFdBQXdCLEVBQUUsUUFBb0I7WUFDL0gsSUFBSSxPQUFPLEdBQWMsUUFBUSxJQUFJLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1lBQzNFLElBQUksWUFBWSxHQUE0QixRQUFRLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdkYsS0FBSyxJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxPQUFPLEdBQWlDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQy9GLElBQUksQ0FBQyxPQUFPO29CQUNWLFNBQVM7Z0JBRVgsSUFBSSxLQUFLLEdBQWMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVwQyxJQUFJLE9BQU8sWUFBWSxtQkFBQSxhQUFhLElBQUksT0FBTyxJQUFJLFFBQVEsQ0FBQyxhQUFhO29CQUN2RSxPQUFPLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUM1QixJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsWUFBWSxNQUFNO29CQUMxQyxPQUFPLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO3FCQUM1QixDQUFDO29CQUNKLElBQUksVUFBVSxHQUFjLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUN2RCxJQUFJLFVBQVUsWUFBWSxDQUFDLENBQUMsWUFBWSxJQUFJLFVBQVUsWUFBWSxDQUFDLENBQUMsT0FBTzt3QkFDekUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O3dCQUU1RCxpQ0FBaUM7d0JBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDekMsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsV0FBd0IsRUFBRSxJQUFZO1lBQ3hFLElBQUksUUFBUSxHQUE0QixXQUFXLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ3hGLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDO2dCQUNyQixPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVyQixJQUFJLFlBQVksR0FBVyxRQUFRLENBQUM7WUFDcEMsSUFBSSxjQUFjLEdBQWdCLElBQUksQ0FBQztZQUN2QyxLQUFLLElBQUksT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUM3QixJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7Z0JBQ3RCLEtBQUssSUFBSSxhQUFhLEdBQWdCLE9BQU8sQ0FBQyxhQUFhLEVBQUUsYUFBYSxJQUFJLFdBQVcsRUFBRSxhQUFhLEdBQUcsYUFBYSxDQUFDLGFBQWE7b0JBQ3BJLEtBQUssRUFBRSxDQUFDO2dCQUNWLElBQUksS0FBSyxHQUFHLFlBQVksRUFBRSxDQUFDO29CQUN6QixjQUFjLEdBQUcsT0FBTyxDQUFDO29CQUN6QixZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixDQUFDO1lBQ0gsQ0FBQztZQUVELE9BQU8sY0FBYyxDQUFDO1FBQ3hCLENBQUM7UUFFRCw2RkFBNkY7UUFDN0YsK0hBQStIO1FBQy9ILElBQUk7UUFFSjs7V0FFRztRQUNILDZGQUE2RjtRQUM3Riw4Q0FBOEM7UUFDOUMsK0JBQStCO1FBQy9CLGdEQUFnRDtRQUNoRCw4Q0FBOEM7UUFDOUMsd0JBQXdCO1FBRXhCLGtFQUFrRTtRQUNsRSxNQUFNO1FBQ04saUJBQWlCO1FBQ2pCLElBQUk7UUFFRyxVQUFVLENBQUMsUUFBb0IsRUFBRSxNQUFrQjtZQUN4RCxzRUFBc0U7WUFDdEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2hGLENBQUM7UUFFTSxtQkFBbUI7WUFDeEIsVUFBVSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFFTSxVQUFVLENBQUMsUUFBK0M7WUFDL0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7WUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztZQUNyRCxJQUFJLFFBQVEsWUFBWSxDQUFDLENBQUMsT0FBTztnQkFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hFLENBQUM7UUFFTSxVQUFVO1lBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7UUFFTSxZQUFZO1lBQ2pCLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RSxDQUFDO0tBb0RGO0lBaE9ZLDZCQUFVLGFBZ090QixDQUFBO0FBQ0gsQ0FBQyxFQXhPUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBd08zQjtBQ3hPRCxJQUFVLGtCQUFrQixDQStJM0I7QUEvSUQsV0FBVSxrQkFBa0I7SUFDMUIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBRXJCOztPQUVHO0lBQ0gsTUFBYSxTQUFTO1FBQ3BCOztXQUVHO1FBQ0ksTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQW1CLEVBQUUsS0FBYztZQUNoRSxJQUFJLFVBQVUsR0FBZSxJQUFJLG1CQUFBLFVBQVUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNHLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQ2pDLE9BQU8sVUFBVSxDQUFDO1FBQ3BCLENBQUM7UUFFRDs7V0FFRztRQUNJLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxRQUErQyxFQUFFLEtBQWMsRUFBRSxRQUFvQjtZQUMxSCxJQUFJLElBQUksR0FBVyxLQUFLLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFFdEQsSUFBSSxPQUErQixDQUFDO1lBQ3BDLElBQUksUUFBUSxZQUFZLENBQUMsQ0FBQyxZQUFZO2dCQUNwQyxPQUFPLEdBQUcsSUFBSSxtQkFBQSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzlCLElBQUksUUFBUSxZQUFZLENBQUMsQ0FBQyxPQUFPO2dCQUNwQyxPQUFPLEdBQUcsSUFBSSxtQkFBQSxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Z0JBQ3hDLE9BQU8sSUFBSSxDQUFDO1lBRWpCLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzdFLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFFRDs7V0FFRztRQUNJLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxRQUErQyxFQUFFLFFBQW9CO1lBQzVHLElBQUksT0FBTyxHQUFjLFFBQVEsSUFBSSxRQUFRLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztZQUMzRSxJQUFJLFlBQVksR0FBNEIsUUFBUSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3ZGLElBQUksR0FBRyxHQUFtQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXhELEtBQUssSUFBSSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7Z0JBQzdCLElBQUksSUFBSSxHQUFXLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckMsSUFBSSxLQUFLLEdBQVcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLE9BQU8sR0FBZ0IsU0FBUyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBRTVFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDYixJQUFJLFVBQVUsR0FBMEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ25GLE9BQU8sR0FBRyxTQUFTLENBQUMsd0JBQXdCLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBYSxLQUFLLENBQUMsQ0FBQztnQkFDbEYsQ0FBQztnQkFFRCxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUk7b0JBQ2xCLE9BQU8sR0FBRyxJQUFJLG1CQUFBLG1CQUFtQixDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxXQUFXLEVBQUUsYUFBYSxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUM7Z0JBRXpKLElBQUksQ0FBQyxPQUFPLEVBQUUscURBQXFEO29CQUNqRSxTQUFTO2dCQUVYLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0IsQ0FBQztZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUVEOzs7V0FHRztRQUNJLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQyxRQUE0QjtZQUNuRSxJQUFJLEdBQUcsR0FBbUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4RCxLQUFLLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUN6QixJQUFJLEtBQUssR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDL0MsZ0lBQWdJO2dCQUNoSSxJQUFJO2dCQUNKLGtFQUFrRTtnQkFDbEUsY0FBYztnQkFDZCxJQUFJO2dCQUNKLElBQUksS0FBSyxZQUFZLE1BQU0sRUFBRSxDQUFDO29CQUM1QixrRUFBa0U7b0JBQ2xFLElBQUksT0FBTyxHQUFZLElBQUksbUJBQUEsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztvQkFDbkQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDaEUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDM0IsQ0FBQzs7b0JBQ0MsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFXLEtBQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDN0YsQ0FBQztZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUVEOztXQUVHO1FBQ0ksTUFBTSxDQUFDLG9CQUFvQixDQUFDLElBQVksRUFBRSxLQUFzQixFQUFFLE1BQWM7WUFDckYsSUFBSSxPQUFvQixDQUFDO1lBQ3pCLElBQUksQ0FBQztnQkFDSCxJQUFJLEtBQUssWUFBWSxNQUFNLEVBQUUsQ0FBQztvQkFDNUIsSUFBSSxXQUFXLEdBQXlCLG1CQUFBLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3BFLHlDQUF5QztvQkFDekMsT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDekYsQ0FBQztxQkFBTSxJQUFJLE1BQU0sWUFBWSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0I7b0JBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7b0JBQzVCLDJCQUEyQjtnQkFDN0IsQ0FBQztxQkFBTSxDQUFDO29CQUNOLElBQUksV0FBVyxHQUF5QixtQkFBQSxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNqRSxJQUFJLENBQUMsV0FBVzt3QkFDZCxPQUFPLE9BQU8sQ0FBQztvQkFDakIseUNBQXlDO29CQUN6QyxPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ25GLENBQUM7WUFDSCxDQUFDO1lBQUMsT0FBTyxNQUFNLEVBQUUsQ0FBQztnQkFDaEIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFFRDs7V0FFRztRQUNJLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBYSxFQUFFLFFBQWdCLEVBQUUsTUFBYyxFQUFFLE9BQW9CLEVBQUUsU0FBa0I7WUFDcEgsSUFBSSxRQUFRLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbkUsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDdEIsS0FBSyxJQUFJLEtBQUssSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxLQUFLLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hFLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO2dCQUNuQixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDcEIsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7b0JBQ2hELEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixDQUFDO2dCQUNELFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEIsQ0FBQztZQUNELE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUIsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQztLQWFGO0lBeElZLDRCQUFTLFlBd0lyQixDQUFBO0FBQ0gsQ0FBQyxFQS9JUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBK0kzQjtBQy9JRCxJQUFVLGtCQUFrQixDQXVIM0I7QUF2SEQsV0FBVSxrQkFBa0I7SUFDMUIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBYXJCOzs7T0FHRztJQUNILE1BQXNCLGFBQWMsU0FBUSxXQUFXO2lCQUV0Qyw2QkFBd0IsR0FBc0MsSUFBSSxHQUFHLEVBQUUsQUFBL0MsQ0FBZ0Q7aUJBQ3hFLGNBQVMsR0FBVyxDQUFDLEFBQVosQ0FBYTtRQUdyQyxZQUFtQixXQUFxQztZQUN0RCxLQUFLLEVBQUUsQ0FBQztZQUhBLGdCQUFXLEdBQVksS0FBSyxDQUFDO1lBSXJDLElBQUksV0FBVztnQkFDYixLQUFLLElBQUksSUFBSSxJQUFJLFdBQVcsRUFBRSxDQUFDO29CQUM3QixJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTO3dCQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDL0MsQ0FBQztRQUNMLENBQUM7UUFFRDs7V0FFRztRQUNPLE1BQU0sS0FBSyxNQUFNO1lBQ3pCLE9BQU8sR0FBRyxHQUFHLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN6QyxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQVksRUFBRSxrQkFBd0MsRUFBRSxXQUEyQjtZQUN4Ryw2QkFBNkI7WUFDN0Isa0JBQWtCLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztZQUM5QixhQUFhO1lBQ2IsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUVoRCxJQUFJLFdBQVc7Z0JBQ2IsYUFBYSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVEOztXQUVHO1FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFhO1lBQzdCLElBQUksT0FBTyxHQUE2RCxhQUFhLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFILElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFFBQVE7Z0JBQzlCLE9BQU8sR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3hDLE9BQTZCLE9BQU8sQ0FBQztRQUN2QyxDQUFDO1FBRU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFhLEVBQUUsa0JBQXdDO1lBQ3hFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckQsYUFBYSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUN4RSxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLEdBQUc7WUFDWixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVEOztXQUVHO1FBQ0ksV0FBVztZQUNoQixJQUFJLElBQUksR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxJQUFJO2dCQUNQLE9BQU8sSUFBSSxDQUFDO1lBQ2QsSUFBSSxLQUFLLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUQsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDekIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFTSxRQUFRLENBQUMsTUFBYztZQUM1QixJQUFJLEtBQUssR0FBcUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxRCxJQUFJLEtBQUs7Z0JBQ1AsS0FBSyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7UUFDL0IsQ0FBQztRQUdEOztXQUVHO1FBQ0ksZUFBZSxDQUFDLE1BQWM7WUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFFRCx1Q0FBdUM7UUFDaEMsU0FBUyxDQUFDLEtBQWM7WUFDN0IsSUFBSSxLQUFLLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQyxZQUFZO1lBQ1osSUFBSSxLQUFLLEdBQWtCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNqQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLEtBQUssSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLFVBQVU7Z0JBQ25DLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEQsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDOztJQTlGbUIsZ0NBQWEsZ0JBb0dsQyxDQUFBO0FBQ0gsQ0FBQyxFQXZIUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBdUgzQjtBQ3ZIRCxJQUFVLGtCQUFrQixDQStDM0I7QUEvQ0QsV0FBVSxrQkFBa0I7SUFDMUI7O09BRUc7SUFDSCxNQUFhLG9CQUFxQixTQUFRLG1CQUFBLGFBQWE7UUFDckQsYUFBYTtpQkFDRSxrQkFBYSxHQUFTLG1CQUFBLGFBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTVHLFlBQW1CLFdBQW9DO1lBQ3JELEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUs7Z0JBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxpQkFBaUI7WUFDdEIsSUFBSSxJQUFJLENBQUMsV0FBVztnQkFDbEIsT0FBTztZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBRXhCLGdFQUFnRTtZQUNoRSxxQkFBcUI7WUFFckIsSUFBSSxLQUFLLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUQsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7WUFDeEIsS0FBSyxDQUFDLEVBQUUsR0FBRyxtQkFBQSxhQUFhLENBQUMsTUFBTSxDQUFDO1lBQ2hDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUM7WUFDckQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV4QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDeEMsQ0FBQztRQUVEOztXQUVHO1FBQ0ksZUFBZTtZQUNwQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzdDLENBQUM7UUFDRDs7V0FFRztRQUNJLGVBQWUsQ0FBQyxNQUFlO1lBQ3BDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUMvQyxDQUFDOztJQXpDVSx1Q0FBb0IsdUJBMENoQyxDQUFBO0FBQ0gsQ0FBQyxFQS9DUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBK0MzQjtBQy9DRCxJQUFVLGtCQUFrQixDQThFM0I7QUE5RUQsV0FBVSxrQkFBa0I7SUFDMUIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCOztPQUVHO0lBQ0gsTUFBYSxrQkFBbUIsU0FBUSxtQkFBQSxhQUFhO1FBQ25ELGFBQWE7aUJBQ0Usa0JBQWEsR0FBUyxtQkFBQSxhQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEFBQTNFLENBQTRFO1FBR3hHLFlBQW1CLFdBQW9DO1lBQ3JELEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUhkLFVBQUssR0FBWSxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUlwQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUs7Z0JBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUU5QyxJQUFJLENBQUMsZ0JBQWdCLGlDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVEOztXQUVHO1FBQ0ksaUJBQWlCO1lBQ3RCLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQ2xCLE9BQU87WUFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUV4QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFbkIsSUFBSSxNQUFNLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0QsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7WUFFdEIsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUV6QixJQUFJLE1BQU0sR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvRCxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUN0QixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUNqQixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUNqQixNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztZQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxnQkFBZ0IsNEJBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFFRDs7V0FFRztRQUNJLGVBQWU7WUFDcEIsSUFBSSxHQUFHLEdBQThCLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUUsQ0FBQyxLQUFLLENBQUM7WUFDbkYsSUFBSSxLQUFLLEdBQThCLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUUsQ0FBQyxLQUFLLENBQUM7WUFDckYsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQ2pELENBQUM7UUFDRDs7V0FFRztRQUNJLGVBQWUsQ0FBQyxNQUFpQjtZQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxQixJQUFJLEdBQUcsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDN0YsQ0FBQztRQUVPLE1BQU0sQ0FBQyxNQUFxQjtZQUNsQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUNPLFFBQVEsQ0FBQyxNQUFrQjtZQUNqQyxJQUFJLE1BQU0sR0FBd0MsTUFBTSxDQUFDLE1BQU8sQ0FBQztZQUNqRSxJQUFJLE1BQU0sSUFBSSxRQUFRLENBQUMsYUFBYTtnQkFDbEMsT0FBTztZQUNULE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN6QixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDeEIscUNBQXFDO1lBQ3JDLElBQUksWUFBWSxHQUFXLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssNEJBQWMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7O0lBdkVVLHFDQUFrQixxQkF3RTlCLENBQUE7QUFDSCxDQUFDLEVBOUVTLGtCQUFrQixLQUFsQixrQkFBa0IsUUE4RTNCO0FDOUVELElBQVUsa0JBQWtCLENBK0QzQjtBQS9ERCxXQUFVLGtCQUFrQjtJQUMxQjs7O09BR0c7SUFDSCxNQUFhLGtCQUFtQixTQUFRLFdBQVc7UUFDakQsYUFBYTtpQkFDRSxrQkFBYSxHQUFTLG1CQUFBLGFBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLEFBQWxFLENBQW1FO1FBRy9GO1lBQ0UsS0FBSyxFQUFFLENBQUM7WUFIQSxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUl2QyxDQUFDO1FBRUQsSUFBVyxLQUFLLENBQUMsTUFBYztZQUM3QixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixJQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksTUFBTSxHQUFHLENBQUM7Z0JBQzFCLE9BQU87WUFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN2QyxDQUFDO1FBRUQsSUFBVyxLQUFLO1lBQ2QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFTSxpQkFBaUI7WUFDdEIsSUFBSSxJQUFJLENBQUMsV0FBVztnQkFDbEIsT0FBTztZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBRXhCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQixDQUFDO1FBR00sR0FBRyxDQUFDLE9BQWU7WUFDeEIsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUIsSUFBSSxPQUFPLElBQUksQ0FBQztnQkFDZCxPQUFPO1lBRVQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQ2hCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDO29CQUNoQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ1YsQ0FBQztvQkFDSixJQUFJLElBQUksR0FBMkMsSUFBSSxDQUFDLHNCQUFzQixDQUFDO29CQUMvRSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxZQUFZLGtCQUFrQixDQUFDO3dCQUMvQyxPQUFPO29CQUNULElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7WUFDSCxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDVixDQUFDO29CQUNKLElBQUksSUFBSSxHQUEyQyxJQUFJLENBQUMsc0JBQXNCLENBQUM7b0JBQy9FLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLFlBQVksa0JBQWtCLENBQUM7d0JBQy9DLE9BQU87b0JBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7O0lBeERVLHFDQUFrQixxQkF5RDlCLENBQUE7QUFDSCxDQUFDLEVBL0RTLGtCQUFrQixLQUFsQixrQkFBa0IsUUErRDNCO0FDL0RELHVDQUF1QztBQUN2QyxJQUFVLGtCQUFrQixDQTZFM0I7QUE5RUQsdUNBQXVDO0FBQ3ZDLFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQjs7T0FFRztJQUNILE1BQXNCLHFCQUFzQixTQUFRLG1CQUFBLGFBQWE7aUJBQ2hELGFBQVEsR0FBa0MsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVuRSxZQUFtQixXQUFxQztZQUN0RCxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUVEOzs7V0FHRztRQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBZ0I7WUFDckMsS0FBSyxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDM0QsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsSUFBSSxRQUFRLEVBQUUsQ0FBQztvQkFDN0QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hELHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDakUsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxlQUFlO1lBQ3BCLElBQUksT0FBTyxHQUFjLEVBQUUsQ0FBQztZQUM1QixJQUFJLFFBQVEsR0FBaUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNFLEtBQUssSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQzdCLElBQUksR0FBRyxHQUFXLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlDLElBQUksT0FBTyxZQUFZLG1CQUFBLGFBQWE7b0JBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7O29CQUV6QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUNqQyxDQUFDO1lBQ0QsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUVNLGVBQWUsQ0FBQyxRQUFtQjtZQUN4QyxLQUFLLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE9BQU8sR0FBcUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0JBQ3JFLElBQUksQ0FBQyxPQUFPO29CQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLE9BQU8sWUFBWSxtQkFBQSxhQUFhO29CQUNsQyxPQUFPLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOztvQkFFdkMsT0FBTyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQztRQUNILENBQUM7UUFFRDs7V0FFRztRQUNPLGlCQUFpQjtZQUN6QixJQUFJLElBQUksQ0FBQyxXQUFXO2dCQUNsQixPQUFPO1lBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFFeEIsSUFBSSxRQUFRLEdBQXFCLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDMUcsSUFBSSxPQUFPLEdBQTZCLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztZQUVuRSxJQUFJLEtBQUssR0FBd0IsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM1QyxLQUFLLElBQUksS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDaEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUNELEtBQUssSUFBSSxLQUFLLElBQUksT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQyxDQUFDO1lBRUQsSUFBSSxLQUFLLEdBQXFCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUQsSUFBSSxLQUFLO2dCQUNQLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuRCxDQUFDOztJQXRFbUIsd0NBQXFCLHdCQXVFMUMsQ0FBQTtBQUNILENBQUMsRUE3RVMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQTZFM0I7QUM5RUQsK0NBQStDO0FBQy9DLElBQVUsa0JBQWtCLENBaUMzQjtBQWxDRCwrQ0FBK0M7QUFDL0MsV0FBVSxrQkFBa0I7SUFHMUIsTUFBYSxzQkFBdUIsU0FBUSxtQkFBQSxxQkFBcUI7UUFFeEQsZUFBZTtZQUNwQixJQUFJLFFBQVEsR0FBcUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3hGLElBQUksT0FBTyxHQUFjLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUN2RSxJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7WUFDdEIsS0FBSyxJQUFJLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUM7Z0JBQzNDLEtBQUssSUFBSSxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO29CQUNsQixPQUFPLENBQUMsTUFBTSxDQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFbEYsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzFELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFFTSxlQUFlLENBQUMsUUFBbUI7WUFDeEMsSUFBSSxRQUFRLEdBQXFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN4RixJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7WUFDdEIsS0FBSyxJQUFJLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUM7Z0JBQzNDLEtBQUssSUFBSSxTQUFTLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO29CQUM5QixRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFhLFFBQVEsQ0FBQyxNQUFNLENBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEYsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7UUFFUyxpQkFBaUI7WUFDekIsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDMUIsa0NBQWtDO1lBQ2xDLElBQUksS0FBSyxHQUFxQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFELEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxDQUFDO0tBQ0Y7SUE3QlkseUNBQXNCLHlCQTZCbEMsQ0FBQTtBQUNILENBQUMsRUFqQ1Msa0JBQWtCLEtBQWxCLGtCQUFrQixRQWlDM0I7QUNsQ0QsK0NBQStDO0FBQy9DLElBQVUsa0JBQWtCLENBOEIzQjtBQS9CRCwrQ0FBK0M7QUFDL0MsV0FBVSxrQkFBa0I7SUFHMUIsTUFBYSxzQkFBdUIsU0FBUSxtQkFBQSxxQkFBcUI7UUFFeEQsZUFBZTtZQUNwQixJQUFJLFFBQVEsR0FBcUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3hGLElBQUksT0FBTyxHQUFjLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN4RSxJQUFJLEtBQUssR0FBVyxDQUFDLENBQUM7WUFDdEIsS0FBSyxJQUFJLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDO2dCQUN2RCxLQUFLLElBQUksU0FBUyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7b0JBQ3ZCLE9BQU8sQ0FBQyxNQUFNLENBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUNsRixPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO1FBRU0sZUFBZSxDQUFDLFFBQW1CO1lBQ3hDLElBQUksUUFBUSxHQUFxQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDeEYsSUFBSSxLQUFLLEdBQVcsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssSUFBSSxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQztnQkFDdkQsS0FBSyxJQUFJLFNBQVMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO29CQUNuQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFhLFFBQVEsQ0FBQyxNQUFNLENBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUYsQ0FBQztRQUVTLGlCQUFpQjtZQUN6QixLQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUMxQixrQ0FBa0M7WUFDbEMsSUFBSSxLQUFLLEdBQXFCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUQsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELENBQUM7S0FDRjtJQTFCWSx5Q0FBc0IseUJBMEJsQyxDQUFBO0FBQ0gsQ0FBQyxFQTlCUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBOEIzQjtBQy9CRCxJQUFVLGtCQUFrQixDQWdEM0I7QUFoREQsV0FBVSxrQkFBa0I7SUFDMUI7O09BRUc7SUFDSCxNQUFhLG1CQUFvQixTQUFRLG1CQUFBLGFBQWE7UUFDcEQsYUFBYTtpQkFDRSxrQkFBYSxHQUFTLG1CQUFBLGFBQWEsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFakcsWUFBbUIsV0FBb0M7WUFDckQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JCLENBQUM7UUFFRDs7V0FFRztRQUNJLGlCQUFpQjtZQUN0QixJQUFJLElBQUksQ0FBQyxXQUFXO2dCQUNsQixPQUFPO1lBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFFeEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRW5CLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pFLE1BQU0sQ0FBQyxFQUFFLEdBQUcsbUJBQUEsYUFBYSxDQUFDLE1BQU0sQ0FBQztZQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFRDs7V0FFRztRQUNJLGVBQWU7WUFDcEIsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0Q7O1dBRUc7UUFDSSxlQUFlLENBQUMsTUFBeUI7WUFDOUMsSUFBSSxNQUFNLEdBQXNCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0QsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMxRCxJQUFJLE1BQU07Z0JBQ1IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7O2dCQUV2QyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUV0QyxtRkFBbUY7UUFDckYsQ0FBQzs7SUExQ1Usc0NBQW1CLHNCQTJDL0IsQ0FBQTtBQUNILENBQUMsRUFoRFMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQWdEM0I7QUNoREQsSUFBVSxrQkFBa0IsQ0E2RDNCO0FBN0RELFdBQVUsa0JBQWtCO0lBQzFCOztPQUVHO0lBQ0gsTUFBYSxtQkFBb0IsU0FBUSxtQkFBQSxhQUFhO1FBQ3BELGFBQWE7aUJBQ0Usa0JBQWEsR0FBUyxtQkFBQSxhQUFhLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUd6RyxZQUFtQixXQUFvQyxFQUFFLFdBQW1CLEVBQUU7WUFDNUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSztnQkFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO1FBQzFCLENBQUM7UUFFRDs7V0FFRztRQUNJLGlCQUFpQjtZQUN0QixJQUFJLElBQUksQ0FBQyxXQUFXO2dCQUNsQixPQUFPO1lBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFFeEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRW5CLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pFLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUM3QixJQUFJLEtBQUssR0FBb0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLHlDQUF5QztvQkFDekgsU0FBUztnQkFDWCxJQUFJLEtBQUssR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEUsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7Z0JBQ2pCLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sS0FBSyxDQUFDLENBQUM7Z0JBQ3pDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUMvQiwyQ0FBMkM7Z0JBQzNDLElBQUksS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7b0JBQzlDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixDQUFDO2dCQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsQ0FBQztZQUNELE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUVEOztXQUVHO1FBQ0ksZUFBZTtZQUNwQixJQUFJLE1BQU0sR0FBc0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM3RCxJQUFJLElBQUksR0FBVyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksUUFBUSxDQUFDO1lBQzFGLE9BQU8sSUFBSSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNwRSxDQUFDO1FBQ0Q7O1dBRUc7UUFDSSxlQUFlLENBQUMsTUFBYztZQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7WUFDNUMsdUJBQXVCO1FBQ3pCLENBQUM7O0lBdkRVLHNDQUFtQixzQkF3RC9CLENBQUE7QUFDSCxDQUFDLEVBN0RTLGtCQUFrQixLQUFsQixrQkFBa0IsUUE2RDNCO0FDN0RELElBQVUsa0JBQWtCLENBMFUzQjtBQTFVRCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckI7O09BRUc7SUFDSCxNQUFhLG9CQUFxQixTQUFRLG1CQUFBLGFBQWE7UUFDckQsYUFBYTtpQkFDRSxrQkFBYSxHQUFTLG1CQUFBLGFBQWEsQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxBQUE5RSxDQUErRTtRQUczRyxZQUFtQixXQUFxQztZQUN0RCxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFIZCxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBMEp6Qjs7ZUFFRztZQUNLLFdBQU0sR0FBRyxDQUFDLE1BQXFCLEVBQVEsRUFBRTtnQkFDL0MsSUFBSSxNQUFNLEdBQVksUUFBUSxDQUFDLGFBQWEsQ0FBQztnQkFDN0MsSUFBSSxVQUFVLEdBQVcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUV2RCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBRXpCLG1EQUFtRDtnQkFDbkQsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFLENBQUM7b0JBQ25CLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNwQixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO3dCQUMzQixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO3dCQUNsQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO3dCQUMzQixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO3dCQUM5QixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVTs0QkFDN0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNmLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs0QkFDL0QsTUFBTTt3QkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRTs0QkFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDckIsTUFBTTtvQkFDVixDQUFDO29CQUNELElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLFVBQVUsSUFBSSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO3dCQUNuRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7d0JBQ3ZDLHFDQUFxQztvQkFDdkMsQ0FBQztvQkFDRCxPQUFPO2dCQUNULENBQUM7Z0JBRUQsZ0NBQWdDO2dCQUNoQyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksUUFBUSxFQUFFLENBQUM7b0JBQzVDLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3QkFDakksSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQW9CLE1BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDdEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO3dCQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3RCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDYixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw0QkFBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLENBQUM7b0JBQ0QsT0FBTztnQkFDVCxDQUFDO2dCQUVELElBQUksVUFBVSxJQUFJLENBQUMsSUFBSSxVQUFVLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ3ZDLElBQUksVUFBVSxHQUFXLFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0YsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUVyQyxJQUFJLElBQUksR0FBNkIsTUFBTSxDQUFDLGtCQUFrQixDQUFDO29CQUMvRCxJQUFJLElBQUk7d0JBQ04sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUVmLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDRCQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDOUQsT0FBTztnQkFDVCxDQUFDO2dCQUVELElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2pFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDZixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw0QkFBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzlELE9BQU87Z0JBQ1QsQ0FBQztnQkFFRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTO29CQUMxQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBRTFCLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVTt3QkFDN0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDRCQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDOUQsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUTt3QkFDM0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDRCQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDOUQsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVTt3QkFDZixNQUFNLENBQUMsc0JBQXVCLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3JELE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFdBQVc7d0JBQzlCLElBQUksSUFBSSxHQUE2QixNQUFNLENBQUMsa0JBQWtCLENBQUM7d0JBQy9ELElBQUksSUFBSTs0QkFDTixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2YsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO29CQUMzQixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO29CQUNsQyxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRzt3QkFDdEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUM5QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2IsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRTt3QkFDckIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNyQixNQUFNO29CQUNSO3dCQUNFLE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUMsQ0FBQztZQUVNLGFBQVEsR0FBRyxDQUFDLE1BQWtCLEVBQVEsRUFBRTtnQkFDOUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssNEJBQWMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLENBQUMsQ0FBQztZQUVNLGFBQVEsR0FBRyxDQUFDLE1BQWEsRUFBUSxFQUFFO2dCQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQztZQUVNLGFBQVEsR0FBRyxDQUFDLE1BQWEsRUFBUSxFQUFFO2dCQUN6QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztvQkFDdkMsT0FBTztnQkFFVCxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsQ0FBQyxDQUFDO1lBelFBLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFFRDs7V0FFRztRQUNJLGlCQUFpQjtZQUN0QixJQUFJLElBQUksQ0FBQyxXQUFXO2dCQUNsQixPQUFPO1lBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFFeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFFbEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRW5CLElBQUksS0FBSyxHQUFxQixRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlELEtBQUssQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztZQUNsQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDN0IsS0FBSyxDQUFDLGdCQUFnQiw0QkFBYyxDQUFDLE1BQWEsRUFBUSxFQUFFLEdBQUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUd4QixJQUFJLElBQUksR0FBb0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLEtBQUssSUFBSSxHQUFHLEdBQVcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO2dCQUMxQyxJQUFJLEtBQUssR0FBdUIsSUFBSSxtQkFBQSxrQkFBa0IsRUFBRSxDQUFDO2dCQUN6RCxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDVixJQUFJLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQztZQUMxQixDQUFDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUM7WUFFdEIsSUFBSSxHQUFHLEdBQW9CLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUQsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDdkIsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQixHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBR3RCLHVEQUF1RDtZQUN2RCxLQUFLLENBQUMsZ0JBQWdCLDBCQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsZ0JBQWdCLDBCQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsZ0JBQWdCLGlDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLGdCQUFnQiw0QkFBYyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFFRDs7V0FFRztRQUNJLGlCQUFpQixDQUFDLEdBQVk7WUFDbkMsSUFBSSxLQUFLLEdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWpDLElBQUksS0FBSyxHQUFnQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFFMUIsSUFBSSxNQUFNLEdBQW1DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNsRixLQUFLLElBQUksS0FBSyxJQUFJLE1BQU07Z0JBQ3RCLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQzNCLENBQUM7UUFFRDs7V0FFRztRQUNJLFNBQVMsQ0FBQyxLQUFjO1lBQzdCLElBQUksS0FBSyxHQUF1QyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVFLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ1YsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO2dCQUMvQixLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNoQixDQUFDO2lCQUFNLENBQUM7Z0JBQ04sS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQy9CLENBQUM7UUFDSCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxlQUFlO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDO1FBQ0Q7O1dBRUc7UUFDSSxlQUFlLENBQUMsTUFBYztZQUNuQyxJQUFJLE1BQU0sSUFBSSxTQUFTO2dCQUNyQixPQUFPO1lBRVQsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7WUFDcEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFFRDs7V0FFRztRQUNJLHNCQUFzQjtZQUMzQixJQUFJLElBQUksR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLEdBQUcsR0FBVyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9DLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksUUFBUSxHQUFXLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNELFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDOUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksUUFBUTtZQUNiLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEdBQWEsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDOUQsSUFBSSxjQUFjLEdBQVcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ3ZELElBQUksU0FBUyxHQUFXLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUM3QyxPQUFPLGNBQWMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3RFLENBQUM7UUFFRDs7V0FFRztRQUNLLE9BQU87WUFDYixJQUFJLE1BQU0sR0FBbUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2xGLElBQUksS0FBSyxHQUFnQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdkUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDMUIsS0FBSyxJQUFJLEdBQUcsR0FBVyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztvQkFDckQsSUFBSSxLQUFLLEdBQXVCLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQ2hELEtBQUssQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDcEMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Z0JBQzlCLENBQUM7Z0JBQ0QsT0FBTztZQUNULENBQUM7WUFFRCxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxHQUFhLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0QsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDbEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7WUFFM0IsUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLEtBQUssSUFBSSxHQUFHLEdBQVcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7Z0JBQ3JELElBQUksS0FBSyxHQUF1QixNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQzFCLElBQUksSUFBSSxHQUFXLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7b0JBQzlELEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixDQUFDOztvQkFDQyxLQUFLLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUMvQixDQUFDO1FBQ0gsQ0FBQztRQXVITyxtQkFBbUIsQ0FBQyxPQUFlO1lBQ3pDLElBQUksS0FBSyxHQUFZLFFBQVEsQ0FBQyxhQUFhLENBQUM7WUFDNUMsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ3hDLE9BQU87WUFFVCxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5QixJQUFJLE9BQU8sSUFBSSxDQUFDO2dCQUNkLE9BQU87WUFFVCxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7Z0JBQzlDLDJCQUEyQjtnQkFDM0IsSUFBSSxLQUFLLEdBQVcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMvQixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUM7b0JBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNyQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2YsT0FBTztZQUNULENBQUM7WUFFRCxJQUFJLFFBQVEsR0FBVyxRQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNELGlDQUFpQztZQUNqQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFhLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBRW5FLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDOUIsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQzFELDhDQUE4QztZQUM5QyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJO2dCQUNwQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUdqQixJQUFJLE1BQWMsQ0FBQztZQUNuQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUNuRCx5QkFBeUI7WUFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFFTyxVQUFVLENBQUMsUUFBZ0I7WUFDakMsSUFBSSxVQUFVLEdBQVksUUFBUSxDQUFDLGFBQWEsQ0FBQztZQUNqRCxJQUFJLFFBQVEsRUFBRSxDQUFDO2dCQUNiLEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUNoQyxJQUFJLFFBQVEsR0FBRyxDQUFDO3dCQUNkLFVBQVUsR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUM7O3dCQUUzQyxVQUFVLEdBQUcsVUFBVSxDQUFDLHNCQUFzQixDQUFDO2dCQUVyQyxVQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDcEMsQ0FBQztRQUNILENBQUM7O0lBbFVVLHVDQUFvQix1QkFtVWhDLENBQUE7QUFDSCxDQUFDLEVBMVVTLGtCQUFrQixLQUFsQixrQkFBa0IsUUEwVTNCO0FDMVVELElBQVUsa0JBQWtCLENBeUMzQjtBQXpDRCxXQUFVLGtCQUFrQjtJQUMxQjs7T0FFRztJQUNILE1BQWEsc0JBQXVCLFNBQVEsbUJBQUEsYUFBYTtRQUN2RCxhQUFhO2lCQUNFLGtCQUFhLEdBQVMsbUJBQUEsYUFBYSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUUvRyxZQUFtQixXQUFvQztZQUNyRCxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDckIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksaUJBQWlCO1lBQ3RCLElBQUksSUFBSSxDQUFDLFdBQVc7Z0JBQ2xCLE9BQU87WUFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUV4QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFbkIsSUFBSSxLQUFLLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUQsS0FBSyxDQUFDLEVBQUUsR0FBRyxtQkFBQSxhQUFhLENBQUMsTUFBTSxDQUFDO1lBQ2hDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFFRDs7V0FFRztRQUNJLGVBQWU7WUFDcEIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMzQyxDQUFDO1FBQ0Q7O1dBRUc7UUFDSSxlQUFlLENBQUMsTUFBYztZQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDN0MsQ0FBQzs7SUFuQ1UseUNBQXNCLHlCQW9DbEMsQ0FBQTtBQUNILENBQUMsRUF6Q1Msa0JBQWtCLEtBQWxCLGtCQUFrQixRQXlDM0I7QUN6Q0QsSUFBVSxrQkFBa0IsQ0FnSjNCO0FBaEpELFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQixNQUFhLE9BQVEsU0FBUSxrQkFBa0I7UUFHN0MsWUFBbUIsVUFBa0IsRUFBRSxFQUFFLEtBQWE7WUFDcEQsS0FBSyxFQUFFLENBQUM7WUFzQ0YsY0FBUyxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQzFDLElBQUksTUFBTTtvQkFDUixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLDZCQUFjLENBQUMsZ0NBQWUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEcsQ0FBQyxDQUFDO1lBRU0sYUFBUSxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQ3pDLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQjt3QkFDRSxJQUFJLElBQUksR0FBNkIsSUFBSSxDQUFDLGtCQUFrQixDQUFDO3dCQUM3RCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7NEJBQy9CLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs0QkFDYixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7d0JBQzNCLENBQUM7d0JBQ0QsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLFFBQVEsR0FBNkIsSUFBSSxDQUFDLHNCQUFzQixDQUFDO3dCQUNyRSxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7NEJBQ3ZDLElBQUksSUFBSSxHQUFtQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7NEJBQ2hGLElBQUksQ0FBQyxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUM7NEJBQzVCLElBQUksQ0FBQztnQ0FDSCxHQUFHLENBQUMsQ0FBQyw2QkFBNkI7b0NBQ2hDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO2dDQUNwQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFOztnQ0FFaEMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDOzRCQUduQixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7d0JBQzNCLENBQUM7d0JBQ0QsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxFQUFFLENBQUM7NEJBQzFCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzs0QkFDYixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7d0JBQzNCLENBQUM7d0JBQ0QsTUFBTTtnQkFDVixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRU0sV0FBTSxHQUFHLENBQUMsTUFBcUIsRUFBUSxFQUFFO2dCQUMvQyxJQUFJLFNBQVMsR0FBWSxLQUFLLENBQUM7Z0JBQy9CLHdEQUF3RDtnQkFFeEQsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BCLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNO3dCQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7d0JBQ2pDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxXQUFXLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNuRixNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNO3dCQUN6QixTQUFTLEdBQUcsSUFBSSxDQUFDO3dCQUNqQixNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxXQUFXO3dCQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDOzRCQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNsQixNQUFNO3dCQUNSLENBQUM7b0JBQ0gsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVU7d0JBQzdCLElBQUksSUFBSSxHQUFnQixJQUFJLENBQUM7d0JBQzdCLElBQUksSUFBSSxDQUFDLFVBQVU7NEJBQ2pCLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs0QkFFckMsR0FBRyxDQUFDO2dDQUNGLElBQUksR0FBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDOzRCQUM5QyxDQUFDLFFBQVEsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUU7d0JBRXZDLElBQUksSUFBSTs0QkFDTixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2YsdUlBQXVJOzs0QkFFckksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEscUNBQW1CLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDakksTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVTt3QkFDN0IsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7NEJBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ25CLE1BQU07d0JBQ1IsQ0FBQztvQkFDSCxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUTt3QkFDM0IsSUFBSSxRQUFRLEdBQWdCLElBQUksQ0FBQzt3QkFDakMsR0FBRyxDQUFDOzRCQUNGLFFBQVEsR0FBZ0IsUUFBUSxDQUFDLHNCQUFzQixDQUFDO3dCQUMxRCxDQUFDLFFBQVEsUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLFlBQVksT0FBTyxDQUFDLEVBQUU7d0JBRXJELElBQUksUUFBUTs0QkFDVixJQUFjLFFBQVMsQ0FBQyxVQUFVO2dDQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSw2Q0FBdUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDOztnQ0FFbkksUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDOzs0QkFFbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLG1DQUFrQixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzlJLE1BQU07Z0JBQ1YsQ0FBQztnQkFFRCxJQUFJLENBQUMsU0FBUztvQkFDWixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDN0IsQ0FBQyxDQUFDO1lBcElBLHVHQUF1RztZQUN2RyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLFVBQVUsR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoRSxVQUFVLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztZQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTdCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUUvQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsZ0JBQWdCLGlDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLGdCQUFnQixxQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsNkNBQXVCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLG1DQUFrQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUdELElBQVcsVUFBVTtZQUNuQixnQ0FBZ0M7WUFDaEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUM7UUFFTSxVQUFVLENBQUMsUUFBd0I7WUFDeEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFDLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO1FBQzFCLENBQUM7UUFFTSxNQUFNLENBQUMsT0FBZ0I7WUFDNUIsbUNBQW1DO1lBQ25DLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQztLQWtHRjtJQTFJWSwwQkFBTyxVQTBJbkIsQ0FBQTtJQUNELG9DQUFvQztJQUNwQyxjQUFjLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUN2RSxDQUFDLEVBaEpTLGtCQUFrQixLQUFsQixrQkFBa0IsUUFnSjNCO0FDaEpELElBQVUsa0JBQWtCLENBb0wzQjtBQXBMRCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckIsTUFBYSxZQUFhLFNBQVEsbUJBQUEsT0FBTztRQUV2QyxZQUFtQixPQUFlO1lBQ2hDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUEwRGxCLGlCQUFZLEdBQUcsQ0FBQyxNQUFpQixFQUFRLEVBQUU7Z0JBQ2pELDBCQUEwQjtnQkFDMUIsSUFBSSxPQUFPLEdBQXlCLE1BQU0sQ0FBQyxhQUFjLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM5RSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3hFLENBQUMsQ0FBQztZQUVNLGdCQUFXLEdBQUcsQ0FBQyxNQUFpQixFQUFRLEVBQUU7Z0JBQ2hELE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO2dCQUV4QyxLQUFLLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQzNDLElBQUksR0FBVyxDQUFDO29CQUNoQixJQUFJLEtBQWEsQ0FBQztvQkFDbEIsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3BDLElBQUksR0FBRyxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO3dCQUN0RCxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7d0JBQ3hDLElBQUksTUFBTSxDQUFDLE9BQU87NEJBQ2hCLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQzt3QkFDMUMsSUFBSSxNQUFNLENBQUMsUUFBUTs0QkFDakIsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO3dCQUMxQyxrREFBa0Q7b0JBQ3BELENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUMsQ0FBQztZQUVNLFlBQU8sR0FBRyxDQUFDLE1BQWlCLEVBQVEsRUFBRTtnQkFDNUMsdUJBQXVCO2dCQUN2QixJQUFJLElBQUksR0FBNkIsTUFBTSxDQUFDLGFBQWEsQ0FBQztnQkFDMUQsSUFBSSxPQUFPLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxPQUFPLEdBQVcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzNELElBQUksSUFBSSxHQUFnQixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsT0FBTyxJQUFJLENBQUMsQ0FBQztnQkFDakUsSUFBSSxTQUFTLEdBQVcsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFbkQsSUFBSSxRQUFRLEdBQW1CLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO2dCQUM5RSxJQUFJLE1BQU0sQ0FBQyxPQUFPO29CQUNoQixJQUFJLEdBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUV0QyxJQUFJLE1BQU0sQ0FBQyxRQUFRO29CQUNqQixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7b0JBRWxDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRTdDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDakIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixDQUFDLENBQUM7WUFHTSxjQUFTLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUM7WUFFTSxrQkFBYSxHQUFHLENBQUMsTUFBcUIsRUFBUSxFQUFFO2dCQUN0RCxJQUFJLElBQUksR0FBNkIsTUFBTSxDQUFDLGFBQWEsQ0FBQztnQkFFMUQsaURBQWlEO2dCQUNqRCxJQUFrQixNQUFNLENBQUMsTUFBTyxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTTtvQkFDL0UsT0FBTztnQkFFVCxJQUFJLEtBQUssR0FBVyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLE9BQU8sR0FBZ0IsSUFBSSxDQUFDO2dCQUNoQyxJQUFJLE1BQU0sR0FBZ0IsSUFBSSxDQUFDO2dCQUMvQixJQUFJLFNBQVMsR0FBWSxLQUFLLENBQUM7Z0JBRS9CLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTTt3QkFDekIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQ3RCLE1BQU07b0JBQ1IsK0JBQStCO29CQUMvQixzQkFBc0I7b0JBQ3RCLDJDQUEyQztvQkFDM0MsV0FBVztvQkFDWCxLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUTt3QkFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0QkFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDOzRCQUN2QixNQUFNO3dCQUNSLENBQUM7d0JBQ0QsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7NEJBQ3BCLE1BQU0sR0FBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDM0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzRCQUN6RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ2pDLENBQUM7OzRCQUNDLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLGVBQWUsQ0FBQzt3QkFDOUMsSUFBSSxPQUFPOzRCQUNULE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQ3ZELElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDeEIsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVTt3QkFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0QkFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDOzRCQUN2QixNQUFNO3dCQUNSLENBQUM7d0JBQ0QsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7NEJBQ3BCLE1BQU0sR0FBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDM0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzRCQUN6RCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ2pDLENBQUM7OzRCQUNDLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLFdBQVcsQ0FBQzt3QkFDMUMsSUFBSSxPQUFPOzRCQUNULE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDeEIsTUFBTTtvQkFDUjt3QkFDRSxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixDQUFDO2dCQUVELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDZixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQzNCLENBQUM7WUFDSCxDQUFDLENBQUM7UUF6S0YsQ0FBQztRQUVNLFVBQVUsQ0FBQyxRQUF3QjtZQUN4QyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNCLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUF5QyxFQUFFLENBQUM7Z0JBQ3pFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxDQUFDO1FBQ0gsQ0FBQztRQUVNLFVBQVU7WUFDZixJQUFJLE9BQU8sR0FBZ0IsRUFBRSxDQUFDO1lBRTlCLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUEyQyxFQUFFLENBQUM7Z0JBQzNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFDeEMsQ0FBQztZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFFTyxpQkFBaUIsQ0FBQyxNQUFtQjtZQUMzQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN4QixNQUFNLENBQUMsZ0JBQWdCLHFDQUFtQixJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDN0QsTUFBTSxDQUFDLGdCQUFnQiwwQkFBYSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLGdCQUFnQixtQ0FBa0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxnQkFBZ0IsaUNBQWlCLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1RCxNQUFNLENBQUMsZ0JBQWdCLDhCQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0RCxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUN0QixDQUFDO1FBRU8sU0FBUyxDQUFDLFNBQWlCLFNBQVM7WUFDMUMsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO1lBQzVCLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDeEMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsQ0FBQztZQUNELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFdBQVcsK0NBQXdCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFN0ksSUFBSSxLQUFLLEdBQVcsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUEyQyxFQUFFLENBQUM7Z0JBQzNFLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDNUMsSUFBSSxLQUFLLENBQUMsUUFBUTtvQkFDaEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzVCLEtBQUssRUFBRSxDQUFDO1lBQ1YsQ0FBQztZQUVELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBRU8sUUFBUSxDQUFDLFNBQWlCLFNBQVM7WUFDekMsSUFBSSxNQUFNLElBQUksU0FBUztnQkFDckIsT0FBTztZQUNULE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RSxJQUFJLEtBQUssR0FBNkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ2pCLENBQUM7S0FtSEY7SUE5S1ksK0JBQVksZUE4S3hCLENBQUE7SUFFRCxjQUFjLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUN6RSxDQUFDLEVBcExTLGtCQUFrQixLQUFsQixrQkFBa0IsUUFvTDNCO0FDcExELElBQVUsa0JBQWtCLENBOEQzQjtBQTlERCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckI7O09BRUc7SUFDSCxNQUFhLE1BQU07UUFFakI7OztXQUdHO1FBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBcUMsRUFBRSxTQUFrQixJQUFJLEVBQUUsUUFBZ0IsVUFBVSxFQUFFLGdCQUF3QixhQUFhLEVBQUUsTUFBYyxJQUFJLEVBQUUsVUFBa0IsUUFBUTtZQUN6TSxNQUFNLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLE1BQU0sR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO1lBRWhELElBQUksT0FBdUIsQ0FBQztZQUM1QixJQUFJLEtBQUssWUFBWSxDQUFDLENBQUMsT0FBTztnQkFDNUIsT0FBTyxHQUFHLG1CQUFBLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Z0JBRXRELE9BQU8sR0FBRyxtQkFBQSxTQUFTLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEQsT0FBTyxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUM7WUFDdkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFaEMsSUFBSSxNQUFNLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0QsTUFBTSxDQUFDLFNBQVMsR0FBRyxLQUFLLEdBQUcsYUFBYSxHQUFHLE1BQU0sQ0FBQztZQUNsRCxJQUFJLFNBQVMsR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwRSxTQUFTLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztZQUM5QixJQUFJLE9BQU8sSUFBSSxFQUFFO2dCQUNmLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDaEMsSUFBSSxLQUFLLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEUsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFDdEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvQixJQUFJLE1BQU07Z0JBQ1IsWUFBWTtnQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDOztnQkFFdkIsWUFBWTtnQkFDWixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRXBCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDOUIsSUFBSSxTQUFTLEdBQTRCLENBQUMsTUFBYSxFQUFFLEVBQUU7b0JBQ3pELFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ2xELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQzlDLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxLQUFLO3dCQUN4QixJQUFJLENBQUM7NEJBQ0gsbUJBQUEsVUFBVSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7d0JBQzNDLENBQUM7d0JBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQzs0QkFDWixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDbkIsQ0FBQztvQkFDSCxZQUFZO29CQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLENBQUM7Z0JBQ25DLENBQUMsQ0FBQztnQkFDRixTQUFTLENBQUMsZ0JBQWdCLDRCQUFjLFNBQVMsQ0FBQyxDQUFDO2dCQUNuRCxLQUFLLENBQUMsZ0JBQWdCLDRCQUFjLFNBQVMsQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztLQUNGO0lBdkRZLHlCQUFNLFNBdURsQixDQUFBO0FBQ0gsQ0FBQyxFQTlEUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBOEQzQjtBQzlERCxJQUFVLGtCQUFrQixDQThCM0I7QUE5QkQsV0FBVSxrQkFBa0I7SUFNMUIsTUFBYSxxQkFBcUI7UUFFekIsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQWtCLEVBQUUsUUFBb0I7WUFDdkUsSUFBSSxPQUFPLEdBQWMsUUFBUSxJQUFJLEVBQUUsQ0FBQztZQUN4QyxJQUFJLGVBQWUsR0FBYSxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RELElBQUksZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsSUFBSSxZQUFZLEdBQVcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN4RCxZQUFZLEdBQUcsWUFBWSxHQUFHLEdBQUcsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRXpELENBQUM7Z0JBQ0QsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7b0JBQ3hDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFhLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RyxDQUFDO3FCQUNJLENBQUM7b0JBQ0osT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDdEUsQ0FBQztZQUNILENBQUM7aUJBQ0ksQ0FBQztnQkFDSixPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFDRCxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDO0tBQ0Y7SUF2Qlksd0NBQXFCLHdCQXVCakMsQ0FBQTtBQUNILENBQUMsRUE5QlMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQThCM0I7QUM5QkQsSUFBVSxrQkFBa0IsQ0FrQzNCO0FBbENELFdBQVUsa0JBQWtCO0lBRTFCOztPQUVHO0lBQ0gsTUFBYSxPQUFPO1FBQ2xCOztXQUVHO1FBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFvQixFQUFFLEVBQUUsWUFBb0IsVUFBVSxFQUFFLFdBQW1CLFNBQVMsRUFBRSxNQUFjLElBQUk7WUFDNUgsSUFBSSxPQUFPLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDbEUsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkMsT0FBTyxDQUFDLFNBQVMsR0FBRyxNQUFNLEdBQUcsU0FBUyxHQUFHLE9BQU8sQ0FBQztZQUVqRCxJQUFJLE9BQU8sR0FBbUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1RCxPQUFPLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQztZQUN2QixPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU3QixJQUFJLE1BQU0sR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDO1lBQzdDLElBQUksS0FBSyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hFLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO2dCQUNuQixZQUFZO2dCQUNaLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDaEIsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ25CLENBQUMsQ0FBQztZQUNGLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM1QixZQUFZO1lBQ1osT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLENBQUM7S0FDRjtJQTVCWSwwQkFBTyxVQTRCbkIsQ0FBQTtBQUNILENBQUMsRUFsQ1Msa0JBQWtCLEtBQWxCLGtCQUFrQixRQWtDM0I7QUNsQ0QsSUFBVSxrQkFBa0IsQ0E0TDNCO0FBNUxELFdBQVUsa0JBQWtCO0lBRTFCOztPQUVHO0lBQ0gsTUFBYSxjQUFrQixTQUFRLGdCQUFnQjtRQUdyRCxZQUFtQixXQUFvQyxFQUFFLFNBQThCLEVBQUU7WUFDdkYsS0FBSyxFQUFFLENBQUM7WUFrSkYsZ0JBQVcsR0FBRyxDQUFDLE1BQWlCLEVBQVEsRUFBRTtnQkFDaEQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sR0FBMEIsSUFBSSxDQUFDLGFBQWMsQ0FBQyxJQUFJLENBQUM7Z0JBQzdELElBQUksTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUM7b0JBQzdGLE9BQU87Z0JBRVQsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN4QixNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7Z0JBRXhDLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJO29CQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDO3FCQUN4QyxDQUFDO29CQUNKLElBQUksVUFBVSxHQUF5QyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxZQUFZLG1CQUFBLGNBQWMsQ0FBQyxDQUFDO29CQUNoSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQzt3QkFDekMsSUFBSSxJQUFJLEdBQVksVUFBVSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO3dCQUMvRCxJQUFJLFNBQVMsR0FBWSxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7d0JBQ3JFLElBQUksT0FBTyxHQUFZLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUM7d0JBQ3JHLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCOzRCQUM5QyxJQUFJLFNBQVM7Z0NBQ1gsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O2dDQUVyRCxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDMUQsQ0FBQztnQkFDSCxDQUFDO2dCQUVELElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUMzRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7b0JBQ3RFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDM0MsQ0FBQyxDQUFDO1lBOUtBLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLGdCQUFnQixtQ0FBa0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1FBQzFCLENBQUM7UUFFRDs7V0FFRztRQUNJLE1BQU0sQ0FBQyxNQUFhO1lBQ3pCLEtBQUssSUFBSSxJQUFJLElBQUksTUFBTTtnQkFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQixDQUFDO1FBRUQ7O1dBRUc7UUFDSSxJQUFJLENBQUMsS0FBVTtZQUNwQixJQUFJLFdBQVcsR0FBc0IsSUFBSSxDQUFDO1lBRTFDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksSUFBSSxHQUFzQixXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLENBQUMsSUFBSTtvQkFDUCxNQUFNO2dCQUVSLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtvQkFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFcEIsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNqQyxDQUFDO1FBQ0gsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSSxXQUFXLENBQUMsS0FBd0I7WUFDekMsSUFBSSxLQUFLLEdBQXdCLEVBQUUsQ0FBQztZQUNwQyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO2dCQUNsQyxJQUFJLEtBQUssR0FBc0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hELElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ1YsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixLQUFLLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVzt3QkFDcEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEIsQ0FBQzs7b0JBQ0MsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQixDQUFDO1lBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxRQUFRLENBQUMsS0FBUTtZQUN0QixLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRO2dCQUM1QixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFxQixJQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztvQkFDL0QsT0FBMEIsSUFBSSxDQUFDO1lBRW5DLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVEOztXQUVHO1FBQ0ksUUFBUSxDQUFDLE1BQTJCO1lBQ3pDLEtBQUssSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekIsQ0FBQztRQUNILENBQUM7UUFFRDs7V0FFRztRQUNJLFFBQVE7WUFDYixPQUE0QixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLFlBQVksbUJBQUEsY0FBYyxDQUFDLENBQUM7UUFDM0csQ0FBQztRQUVNLGdCQUFnQixDQUFDLEtBQVU7WUFDaEMsSUFBSSxLQUFLLEdBQWlFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUs7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckUsQ0FBQztRQUVNLGNBQWMsQ0FBQyxVQUFhLEVBQUUsUUFBVztZQUM5QyxJQUFJLEtBQUssR0FBaUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RHLElBQUksU0FBUyxHQUFZLEtBQUssQ0FBQztZQUMvQixJQUFJLEdBQUcsR0FBTSxJQUFJLENBQUM7WUFDbEIsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNmLFNBQVMsR0FBRyxJQUFJLENBQUM7b0JBQ2pCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUM7d0JBQy9DLEdBQUcsR0FBRyxRQUFRLENBQUM7eUJBQ1osSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQzt3QkFDbEQsR0FBRyxHQUFHLFVBQVUsQ0FBQzs7d0JBRWpCLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3RCLENBQUM7Z0JBQ0QsSUFBSSxTQUFTLEVBQUUsQ0FBQztvQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDekIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQzt3QkFDeEMsTUFBTTtnQkFDVixDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7UUFFTSxNQUFNLENBQUMsS0FBVTtZQUN0QixJQUFJLEtBQUssR0FBaUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RHLElBQUksT0FBTyxHQUF3QixFQUFFLENBQUM7WUFFdEMsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLO2dCQUNwQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLHlDQUFxQixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3JFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQztZQUVILE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFFTSxXQUFXLENBQUMsS0FBUTtZQUN6QixJQUFJLEtBQUssR0FBaUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RHLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSztnQkFDcEIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDMUMsT0FBTyxJQUFJLENBQUM7WUFDaEIsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxXQUFXO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDdkIsSUFBSSxLQUFLLEdBQWlFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0RyxLQUFLLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7Z0JBQzNDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLENBQUM7S0FnQ0Y7SUFwTFksaUNBQWMsaUJBb0wxQixDQUFBO0lBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxjQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNsRixDQUFDLEVBNUxTLGtCQUFrQixLQUFsQixrQkFBa0IsUUE0TDNCO0FDNUxELHdDQUF3QztBQUN4QyxJQUFVLGtCQUFrQixDQThOM0I7QUEvTkQsd0NBQXdDO0FBQ3hDLFdBQVUsa0JBQWtCO0lBRTFCOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsTUFBYSxVQUFjLFNBQVEsbUJBQUEsY0FBaUI7UUFFbEQsWUFBbUIsV0FBb0MsRUFBRSxLQUFRO1lBQy9ELEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7WUF3SWpCLGlCQUFZLEdBQUcsQ0FBQyxNQUFpQixFQUFRLEVBQUU7Z0JBQ2pELElBQUksYUFBYSxHQUFnQixNQUFNLENBQUMsYUFBYSxDQUFDO2dCQUN0RCxJQUFJLGFBQWEsWUFBWSxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEVBQUUsZ0hBQWdIO29CQUN2TyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQy9DLENBQUMsQ0FBQztZQUVNLGNBQVMsR0FBRyxLQUFLLEVBQUUsTUFBYSxFQUFpQixFQUFFO2dCQUN6RCxJQUFJLE1BQU0sR0FBeUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDakUsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sR0FBUSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzlELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEIsQ0FBQyxDQUFDO1lBRU0sY0FBUyxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUM7WUFFTSxpQkFBWSxHQUFHLEtBQUssRUFBRSxNQUFhLEVBQWlCLEVBQUU7Z0JBQzVELHVCQUF1QjtnQkFDdkIsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sR0FBeUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDakUsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BCO3dCQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQy9GLE1BQU07b0JBQ1I7d0JBQ0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNqRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDbEcsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUMvRixJQUFJLEdBQUcsR0FBUSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2pCLE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUMsQ0FBQztZQUVNLGFBQVEsR0FBRyxDQUFDLE1BQXFCLEVBQVEsRUFBRTtnQkFDakQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLEtBQUssR0FBNkMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDOUYsSUFBSSxNQUFNLEdBQXlDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2pFLElBQUksS0FBSyxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFDLElBQUksS0FBSyxHQUFHLENBQUM7b0JBQ1gsT0FBTztnQkFFVCxJQUFJLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUM7b0JBQzFELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRXRCLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQjt3QkFDRSxJQUFJLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNOzRCQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3ZCLE1BQU07b0JBQ1I7d0JBQ0UsSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDOzRCQUNkLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDdkIsTUFBTTtvQkFDUjt3QkFDRSxNQUFNO2dCQUNWLENBQUM7Z0JBRUQsSUFBSSxNQUFNLENBQUMsUUFBUTtvQkFDRyxRQUFRLENBQUMsYUFBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO29CQUN0QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBeE1BLElBQUksSUFBSSxHQUFzQixJQUFJLG1CQUFBLGNBQWMsQ0FBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdkIsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQixrQ0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQiwwQkFBYSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLDhCQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsZ0JBQWdCLDhCQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsZ0JBQWdCLDBCQUFhLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsZ0JBQWdCLDRCQUFjLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsZ0JBQWdCLHdCQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNwRCxhQUFhO1lBQ2IsSUFBSSxDQUFDLGdCQUFnQixxQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELGFBQWE7WUFDYixJQUFJLENBQUMsZ0JBQWdCLDZDQUF1QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUVEOztXQUVHO1FBQ0ksY0FBYztZQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLGdCQUFnQixDQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVEOztXQUVHO1FBQ0ksV0FBVztZQUNoQixJQUFJLEtBQUssR0FBNkMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM5RixJQUFJLEtBQUssR0FBVyxLQUFLLENBQUMsT0FBTyxDQUFvQixRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDN0UsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztZQUUzQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRDs7V0FFRztRQUNJLE9BQU87WUFDWixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7b0JBQ2hCLFNBQVM7Z0JBRVgsSUFBSSxNQUFNLEdBQXNCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzFGLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7UUFDSCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxXQUFXLENBQUMsU0FBYyxFQUFFLE9BQVUsRUFBRSxNQUFlO1lBQzVELGdEQUFnRDtZQUNoRCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQyxPQUFPO1lBRVQsd0VBQXdFO1lBQ3hFLElBQUksSUFBSSxHQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDeEUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUM7Z0JBQzNCLE9BQU87WUFFVCxJQUFJLEtBQUssR0FBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEMsMERBQTBEO1lBQzFELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEIsSUFBSSxVQUFVLEdBQVMsT0FBTyxDQUFDO1lBQy9CLElBQUksVUFBVSxHQUFzQixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRWpFLElBQUksTUFBTSxHQUFzQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDM0YsSUFBSSxHQUFHLEdBQXNCLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNwRCxVQUFVLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUM5QixJQUFJLEdBQUc7Z0JBQ0wsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Z0JBRXhCLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNuQyxDQUFDO1FBRU8sU0FBUyxDQUFDLE1BQWE7WUFDN0IsSUFBSSxJQUFJLEdBQXlDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDL0QsSUFBSSxRQUFRLEdBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNuQyxPQUFPO1lBRVQsSUFBSSxNQUFNLEdBQXNCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBRU8sWUFBWSxDQUFDLEtBQVU7WUFDN0IsSUFBSSxNQUFNLEdBQXNCLElBQUksbUJBQUEsY0FBYyxDQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0UsS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksbUJBQUEsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLENBQUM7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO1FBRUQsa0NBQWtDO1FBQzFCLFNBQVMsQ0FBQyxNQUFhO1lBQzdCLDRCQUE0QjtZQUM1QixJQUFJLE1BQU0sR0FBeUUsTUFBTyxDQUFDLE1BQU0sQ0FBQztZQUNsRyxJQUFJLEtBQUssR0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRXRFLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNwQixJQUFJLFNBQVMsR0FBUyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxPQUFPLEdBQVMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDeEMsT0FBTztZQUNULENBQUM7WUFFRCxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVE7Z0JBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3hDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO29CQUNsQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakQsQ0FBQztZQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFFTyxPQUFPLENBQUMsTUFBaUI7WUFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pILElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU3QyxDQUFDO0tBb0VGO0lBN01ZLDZCQUFVLGFBNk10QixDQUFBO0lBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBcUMsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDNUcsQ0FBQyxFQTlOUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBOE4zQjtBQy9ORCxJQUFVLGtCQUFrQixDQTBFM0I7QUExRUQsV0FBVSxrQkFBa0I7SUFDMUI7OztPQUdHO0lBQ0gsTUFBc0Isb0JBQW9CO1FBQTFDO1lBQ0Usd0lBQXdJO1lBQ2pJLGNBQVMsR0FBUSxFQUFFLENBQUM7WUFDM0IsZ0tBQWdLO1lBQ3pKLGFBQVEsR0FBNkMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUMxRix1S0FBdUs7WUFDaEssY0FBUyxHQUFnQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1lBRTlFLG9FQUFvRTtZQUM3RCxzQkFBaUIsR0FBa0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQTJEekUsQ0FBQztRQXpEQzs7V0FFRztRQUNJLFNBQVMsQ0FBQyxPQUFVO1lBQ3pCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVEOzs7V0FHRztRQUNJLE1BQU0sQ0FBQyxFQUFLLEVBQUUsRUFBSztZQUN4QixPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksY0FBYyxDQUFDLFFBQWEsRUFBRSxPQUFVO1lBQzdDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQXFDRjtJQXBFcUIsdUNBQW9CLHVCQW9FekMsQ0FBQTtBQUNILENBQUMsRUExRVMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQTBFM0I7QUMxRUQsSUFBVSxrQkFBa0IsQ0F5VTNCO0FBelVELFdBQVUsa0JBQWtCO0lBQzFCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQjs7O09BR0c7SUFDSCxNQUFhLGNBQWtCLFNBQVEsYUFBYTtRQU1sRCxRQUFRLENBQXNCO1FBRTlCLFlBQW1CLFdBQW9DLEVBQUUsS0FBUTtZQUMvRCxLQUFLLEVBQUUsQ0FBQztZQVJILFlBQU8sR0FBZ0IsRUFBRSxDQUFDO1lBQzFCLFNBQUksR0FBTSxJQUFJLENBQUM7WUErSmQsYUFBUSxHQUFHLENBQUMsTUFBa0IsRUFBUSxFQUFFO2dCQUM5QyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBRXpCLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUTtvQkFDaEMsT0FBTztnQkFFVCxJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSTtvQkFDdkIsT0FBTztnQkFFVCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEMsQ0FBQyxDQUFDO1lBRU0sV0FBTSxHQUFHLENBQUMsTUFBcUIsRUFBUSxFQUFFO2dCQUMvQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVE7b0JBQ3pCLE9BQU87Z0JBRVQsSUFBSSxPQUFPLEdBQXlDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRTdFLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQixvQ0FBb0M7b0JBQ3BDLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxXQUFXO3dCQUM5QixJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxPQUFPOzRCQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOzs0QkFFbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEscUNBQW1CLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDakksTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVTt3QkFDN0IsSUFBSSxPQUFPOzRCQUNULElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7OzRCQUVuQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSw2Q0FBdUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNySSxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVO3dCQUM3QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSxxQ0FBbUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMvSCxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRO3dCQUMzQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSw2Q0FBdUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNuSSxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFO3dCQUNyQixNQUFNLE9BQU8sR0FBNkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN6RSxJQUFJLENBQUMsT0FBTzs0QkFDVixNQUFNO3dCQUVSLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzt3QkFDL0IsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO3dCQUNqQixNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLO3dCQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUM3QyxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHO3dCQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw4QkFBZSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQy9ELE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU07d0JBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSywwQkFBYSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQy9ELENBQUM7d0JBQ0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw0QkFBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ2hFLENBQUM7d0JBQ0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyx3QkFBWSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzlELENBQUM7d0JBQ0QsTUFBTTtnQkFDVixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRU0sZ0JBQVcsR0FBRyxDQUFDLE1BQWtCLEVBQVEsRUFBRTtnQkFDakQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVE7b0JBQ2hDLE9BQU87Z0JBRVQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUMvQixNQUFNLE9BQU8sR0FBNkIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsMEVBQTBFO2dCQUMzSyxJQUFJLENBQUMsT0FBTztvQkFDVixPQUFPO2dCQUVULE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNsQixDQUFDLENBQUM7WUFFTSxjQUFTLEdBQUcsS0FBSyxFQUFFLE1BQWEsRUFBaUIsRUFBRTtnQkFDekQsSUFBSSxNQUFNLEdBQStFLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZHLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFFekIsSUFBSSxNQUFNLFlBQVksZ0JBQWdCLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUUsQ0FBQztvQkFDcEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzVCLE9BQU87Z0JBQ1QsQ0FBQztnQkFFRCxJQUFJLE9BQU8sR0FBWSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRXpFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBRXpCLElBQUksT0FBTztvQkFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksV0FBVyw4QkFBZSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0RyxDQUFDLENBQUM7WUFFTSxpQkFBWSxHQUFHLENBQUMsTUFBaUIsRUFBUSxFQUFFO2dCQUNqRCw0QkFBNEI7Z0JBQzVCLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO29CQUMxQyxPQUFPO2dCQUVULElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVE7b0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDOztvQkFFN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqRCxNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN0RSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUV2QyxtR0FBbUc7Z0JBQ25HLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQUM7WUFFTSxZQUFPLEdBQUcsQ0FBQyxNQUFpQixFQUFRLEVBQUU7Z0JBQzVDLElBQUksSUFBSSxHQUFZLElBQUksQ0FBQyxRQUFRLENBQUMscUJBQXFCLEVBQUUsQ0FBQztnQkFDMUQsSUFBSSxLQUFLLEdBQVcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLEtBQUssR0FBVyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELElBQUksTUFBTSxHQUFXLE1BQU0sQ0FBQyxPQUFPLENBQUM7Z0JBQ3BDLElBQUksSUFBSSxDQUFDLGFBQWEsWUFBWSxtQkFBQSxVQUFVLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDOUcsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO29CQUN6QixJQUFJLE1BQU0sQ0FBQyxJQUFJLG9DQUFtQjt3QkFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDN0MsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7d0JBQ2hGLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDeEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO3dCQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO3dCQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztvQkFDOUMsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRU0saUJBQVksR0FBRyxDQUFDLE1BQW9CLEVBQVEsRUFBRTtnQkFDcEQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVE7b0JBQ2hDLE9BQU87Z0JBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUM7WUFFTSxjQUFTLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDMUMsZ0RBQWdEO2dCQUNoRCw2Q0FBNkM7Z0JBQzdDLFlBQVk7Z0JBQ1osNEJBQTRCO2dCQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUM7WUFwVEEsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7WUFDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsMEJBQTBCO1lBQzFCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFdEQsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQixzQ0FBcUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxnQkFBZ0IsbUNBQWtCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsZ0JBQWdCLGlDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkQsK0RBQStEO1lBQy9ELG1FQUFtRTtZQUVuRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLHFDQUFtQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyx1Q0FBdUM7WUFDOUYsSUFBSSxDQUFDLGdCQUFnQixtQ0FBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLHlDQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVEOztXQUVHO1FBQ0gsSUFBVyxXQUFXO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQztRQUNwRCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLFdBQVcsQ0FBQyxJQUFhO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQy9ELENBQUM7UUFFRDs7V0FFRztRQUNILElBQVcsUUFBUTtZQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLFFBQVEsQ0FBQyxHQUFZO1lBQzlCLElBQUksR0FBRztnQkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7O2dCQUV2QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxtQkFBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUVEOztXQUVHO1FBQ0gsSUFBVyxPQUFPO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLFFBQVE7WUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDbkQsQ0FBQztRQUVNLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBRU0sY0FBYztZQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLENBQUM7UUFFRDs7OztXQUlHO1FBQ0ksTUFBTSxDQUFDLE9BQWdCO1lBQzVCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixJQUFJLE9BQU87Z0JBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssOEJBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRWpFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxRCxzRkFBc0Y7UUFDeEYsQ0FBQztRQUVEOztXQUVHO1FBQ0ksY0FBYztZQUNuQixJQUFJLElBQUksR0FBOEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xFLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQztZQUNuQixLQUFLLElBQUksSUFBSSxJQUFJLElBQUk7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLENBQXFCLElBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRDs7V0FFRztRQUNJLFNBQVMsQ0FBQyxPQUEwQjtZQUN6QyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsSUFBSSxPQUFPO2dCQUNULElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUVEOztXQUVHO1FBQ0ksU0FBUztZQUNkLE9BQTBCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUdEOzs7O1dBSUc7UUFDSSxNQUFNLENBQUMsU0FBa0IsRUFBRSxZQUFxQixLQUFLO1lBQzFELElBQUksS0FBSyxHQUFnQixJQUFJLFdBQVcsa0NBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNqSixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRDs7V0FFRztRQUNLLFlBQVk7WUFDbEIsSUFBSSxPQUFPLEdBQXNCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsT0FBTztnQkFDVixPQUFPO1lBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRU8sTUFBTTtZQUNaLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7WUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNwQixDQUFDO0tBZ0tGO0lBL1RZLGlDQUFjLGlCQStUMUIsQ0FBQTtJQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQXFDLGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILENBQUMsRUF6VVMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQXlVM0I7QUN6VUQsSUFBVSxrQkFBa0IsQ0FpUDNCO0FBalBELFdBQVUsa0JBQWtCO0lBRTFCLCtEQUErRDtJQVMvRDs7Ozs7T0FLRztJQUNILE1BQWEsS0FBd0IsU0FBUSxnQkFBZ0I7UUFLM0QsWUFBbUIsV0FBK0IsRUFBRSxLQUFVLEVBQUUsUUFBaUI7WUFDL0UsS0FBSyxFQUFFLENBQUM7WUFtSlYsNkNBQTZDO1lBQzdDLGlDQUFpQztZQUNqQyw0RkFBNEY7WUFDNUYsSUFBSTtZQUVJLGNBQVMsR0FBRyxLQUFLLEVBQUUsTUFBYSxFQUFpQixFQUFFO2dCQUN6RCxJQUFJLE1BQU0sR0FBK0IsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDdkQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE9BQU8sR0FBUSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQy9ELElBQUksT0FBTyxDQUFDLE1BQU07b0JBQ2hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLHlDQUFxQixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFDO1lBRU0sY0FBUyxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUM7WUFFTSxpQkFBWSxHQUFHLEtBQUssRUFBRSxNQUFhLEVBQWlCLEVBQUU7Z0JBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BCLDRCQUE0QjtnQkFDNUIsb0VBQW9FO2dCQUVwRSxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEI7d0JBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUM3RCxNQUFNO29CQUNSO3dCQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDN0QsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLE9BQU8sR0FBUSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2pELEtBQUssSUFBSSxNQUFNLElBQUksT0FBTyxFQUFFLENBQUM7NEJBQzNCLElBQUksSUFBSSxHQUFpQixJQUFJLG1CQUFBLFNBQVMsQ0FBSSxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7NEJBQ2pGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3pCLENBQUM7d0JBQ0QsTUFBTTtnQkFDVixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBRU0sYUFBUSxHQUFHLENBQUMsTUFBcUIsRUFBUSxFQUFFO2dCQUNqRCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksS0FBSyxHQUFtQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwRixJQUFJLE1BQU0sR0FBK0IsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDdkQsSUFBSSxLQUFLLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxLQUFLLEdBQUcsQ0FBQztvQkFDWCxPQUFPO2dCQUVULElBQUksTUFBTSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQztvQkFDMUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFdEIsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BCO3dCQUNFLElBQUksRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU07NEJBQ3hCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDdkIsTUFBTTtvQkFDUjt3QkFDRSxJQUFJLEVBQUUsS0FBSyxJQUFJLENBQUM7NEJBQ2QsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUN2QixNQUFNO29CQUNSO3dCQUNFLE1BQU07Z0JBQ1YsQ0FBQztnQkFFRCxJQUFJLE1BQU0sQ0FBQyxRQUFRO29CQUNILFFBQVEsQ0FBQyxhQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87b0JBQ3RCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUMxQixDQUFDLENBQUM7WUFyTkEsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7WUFDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7WUFFNUIsSUFBSSxDQUFDLGdCQUFnQiwwQkFBNEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxnQkFBZ0Isa0NBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxnQkFBZ0IscUNBQWtDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RSxJQUFJLENBQUMsZ0JBQWdCLDZDQUFzQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFcEQsSUFBSSxDQUFDLGdCQUFnQiwwQkFBYSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDLGdCQUFnQix3QkFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQiw0QkFBYyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVEOztXQUVHO1FBQ0ksTUFBTTtZQUNYLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksSUFBSSxHQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFeEMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQzNCLElBQUksSUFBSSxHQUFpQixJQUFJLG1CQUFBLFNBQVMsQ0FBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQy9FLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekIsQ0FBQztRQUNILENBQUM7UUFFRDs7V0FFRztRQUNJLGNBQWM7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFFRDs7V0FFRztRQUNJLFdBQVc7WUFDaEIsSUFBSSxLQUFLLEdBQW1DLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDcEYsSUFBSSxLQUFLLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBZSxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDeEUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztZQUUzQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFTSxjQUFjLENBQUMsVUFBYSxFQUFFLFFBQVc7WUFDOUMsSUFBSSxLQUFLLEdBQXVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1RixJQUFJLFNBQVMsR0FBWSxLQUFLLENBQUM7WUFDL0IsSUFBSSxHQUFHLEdBQU0sSUFBSSxDQUFDO1lBQ2xCLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDZixTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNqQixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksVUFBVTt3QkFDekIsR0FBRyxHQUFHLFFBQVEsQ0FBQzt5QkFDWixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUTt3QkFDNUIsR0FBRyxHQUFHLFVBQVUsQ0FBQzs7d0JBRWpCLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3RCLENBQUM7Z0JBQ0QsSUFBSSxTQUFTLEVBQUUsQ0FBQztvQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDekIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUc7d0JBQ2xCLE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUM7WUFDRCxxQ0FBcUM7UUFDdkMsQ0FBQztRQUVNLGdCQUFnQixDQUFDLEtBQVU7WUFDaEMsc0JBQXNCO1lBQ3RCLElBQUksS0FBSyxHQUF1RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUYsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLO2dCQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFTyxVQUFVLENBQUMsU0FBa0I7WUFDbkMsSUFBSSxFQUFFLEdBQXdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0QsS0FBSyxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxFQUFFLEdBQXlCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVELEVBQUUsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDN0IsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVsQyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDbkIsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztvQkFDdEMsRUFBRSxDQUFDLGdCQUFnQiw4QkFFakIsQ0FBQyxNQUFhLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxXQUFXLDBCQUFhLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FDM0csQ0FBQztnQkFDSixDQUFDO2dCQUNELEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUNELE9BQU8sRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUVPLGNBQWM7WUFDcEIsSUFBSSxNQUFNLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDekQsS0FBSyxJQUFJLFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUNyQyxJQUFJLE1BQU0sR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDL0QsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO2dCQUNyQixNQUFNLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztnQkFDekIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBQ0QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUVPLE9BQU8sQ0FBQyxNQUFtQjtZQUNqQyxJQUFJLEtBQUssR0FBOEIsTUFBTSxDQUFDLE1BQU8sQ0FBQyxLQUFLLENBQUM7WUFDNUQsSUFBSSxHQUFHLEdBQXlCLE1BQU0sQ0FBQyxNQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25FLElBQUksU0FBUyxHQUFXLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixDQUFDO1FBRU8sU0FBUyxDQUFDLE1BQWE7WUFDN0IsNEJBQTRCO1lBQzVCLElBQUksTUFBTSxHQUF5RSxNQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2xHLElBQUksS0FBSyxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdEUsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3BCLElBQUksU0FBUyxHQUFTLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLE9BQU8sR0FBUyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN4QyxPQUFPO1lBQ1QsQ0FBQztZQUVELElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUTtnQkFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDeEMsQ0FBQztnQkFDSixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7b0JBQ2xCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxDQUFDO1lBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQztLQXNFRjtJQTdOWSx3QkFBSyxRQTZOakIsQ0FBQTtJQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDdkUsQ0FBQyxFQWpQUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBaVAzQjtBQ2pQRCxJQUFVLGtCQUFrQixDQTREM0I7QUE1REQsV0FBVSxrQkFBa0I7SUFDMUI7OztPQUdHO0lBQ0gsTUFBc0IsZUFBZTtRQUFyQztZQUNFLHlJQUF5STtZQUNsSSxjQUFTLEdBQVEsRUFBRSxDQUFDO1lBRTNCLGlLQUFpSztZQUMxSixhQUFRLEdBQWdDLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDN0UsdUtBQXVLO1lBQ2hLLGNBQVMsR0FBZ0MsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztRQStDaEYsQ0FBQztRQTdDQzs7OztXQUlHO1FBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFpQixJQUFrQixPQUFPLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFFN0U7OztXQUdHO1FBQ0ksSUFBSSxDQUFDLFFBQWEsRUFBRSxVQUF5QjtZQUNsRCxtQkFBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFFRDs7V0FFRztRQUNJLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBc0IsSUFBSTtZQUMzQyxJQUFJLE9BQU8sR0FBUSxtQkFBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyx1REFBdUQ7WUFDakgsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztLQXdCRjtJQXREcUIsa0NBQWUsa0JBc0RwQyxDQUFBO0FBQ0gsQ0FBQyxFQTVEUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBNEQzQjtBQzVERCxJQUFVLGtCQUFrQixDQThKM0I7QUE5SkQsV0FBVSxrQkFBa0I7SUFDMUIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCOztPQUVHO0lBQ0gsTUFBYSxTQUE0QixTQUFRLG1CQUFtQjtRQUlsRSxZQUFtQixXQUErQixFQUFFLEtBQVEsRUFBRSxRQUFnQjtZQUM1RSxLQUFLLEVBQUUsQ0FBQztZQUpILFNBQUksR0FBTSxJQUFJLENBQUM7WUE4RWQsa0JBQWEsR0FBRyxDQUFDLE1BQWtDLEVBQVEsRUFBRTtnQkFDbkUsSUFBSSxNQUFNLFlBQVksYUFBYSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFO29CQUN0RSxPQUFPO2dCQUVULElBQUksS0FBSyxHQUF1QyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUM5RCxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDdkIsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hCLENBQUMsQ0FBQztZQUVNLGNBQVMsR0FBRyxLQUFLLEVBQUUsTUFBYSxFQUFpQixFQUFFO2dCQUN6RCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxNQUFNLEdBQXVDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQy9ELE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixnREFBZ0Q7Z0JBQ2hELDhEQUE4RDtnQkFFOUQsSUFBSSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7b0JBQzFELHNGQUFzRjtvQkFDdEYsa0NBQWtDO29CQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLFdBQVcsOEJBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xILENBQUM7Z0JBQ0QsT0FBTztZQUNULENBQUMsQ0FBQztZQUVNLFdBQU0sR0FBRyxDQUFDLE1BQXFCLEVBQVEsRUFBRTtnQkFDL0MsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSTtvQkFDdkIsT0FBTztnQkFFVCxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEIsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVU7d0JBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLHFDQUFtQixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQy9ILE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVE7d0JBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLDZDQUF1QixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ25JLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUs7d0JBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzdDLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEdBQUc7d0JBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTTt3QkFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssOEJBQWUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUMvRCxNQUFNO2dCQUNWLENBQUM7WUFDSCxDQUFDLENBQUM7WUFFTSxpQkFBWSxHQUFHLENBQUMsTUFBc0IsRUFBUSxFQUFFO2dCQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDO1lBQ00saUJBQVksR0FBRyxDQUFDLE1BQWlCLEVBQVEsRUFBRTtnQkFDakQsNEJBQTRCO2dCQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUN0QyxJQUFJLElBQUksQ0FBQyxRQUFRO29CQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQzs7b0JBRTdELElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakQsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1lBQzVDLENBQUMsQ0FBQztZQUVNLGdCQUFXLEdBQUcsQ0FBQyxNQUFpQixFQUFRLEVBQUU7Z0JBQ2hELDRCQUE0QjtnQkFDNUIsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDNUMsMkNBQTJDO1lBQzdDLENBQUMsQ0FBQztZQUNNLGlCQUFZLEdBQUcsQ0FBQyxNQUFvQixFQUFRLEVBQUU7Z0JBQ3BELE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDO1lBaEpBLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO1lBQzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLGtEQUFrRDtZQUNsRCwwQkFBMEI7WUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1lBRXpCLElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLGlDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFcEQsSUFBSSxDQUFDLGdCQUFnQiwwQkFBYSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxnQkFBZ0Isd0JBQVksSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsZ0JBQWdCLDRCQUFjLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFNUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLGdCQUFnQixxQ0FBbUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxnQkFBZ0IsbUNBQWtCLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV6RCx1REFBdUQ7UUFDekQsQ0FBQztRQUVEOztXQUVHO1FBQ0gsSUFBVyxRQUFRLENBQUMsR0FBWTtZQUM5QixJQUFJLEdBQUc7Z0JBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsbUJBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztnQkFFdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsbUJBQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFRDs7V0FFRztRQUNILElBQVcsUUFBUTtZQUNqQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNJLE1BQU0sQ0FBQyxTQUFrQixFQUFFLFlBQXFCLEtBQUs7WUFDMUQsSUFBSSxLQUFLLEdBQWdCLElBQUksV0FBVyxrQ0FBZSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pKLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVPLE1BQU0sQ0FBQyxPQUFnQixFQUFFLFFBQWdCO1lBQy9DLEtBQUssSUFBSSxLQUFLLElBQUksT0FBTyxFQUFFLENBQUM7Z0JBQzFCLElBQUksS0FBSyxHQUFtQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLElBQUksR0FBbUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLEVBQUUsR0FBeUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxLQUFLLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlELEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO2dCQUNwQixLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztnQkFDakMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNwQixLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXJDLEtBQUssQ0FBQyxnQkFBZ0IsaUNBQWlCLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDM0QsS0FBSyxDQUFDLGdCQUFnQixzQ0FBcUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMvRCxLQUFLLENBQUMsZ0JBQWdCLG1DQUFrQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXhELEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3JCLElBQUksSUFBSTtvQkFDTixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDcEIsQ0FBQztLQTBFRjtJQXZKWSw0QkFBUyxZQXVKckIsQ0FBQTtJQUNELGNBQWMsQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFxQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN2RyxDQUFDLEVBOUpTLGtCQUFrQixLQUFsQixrQkFBa0IsUUE4SjNCO0FDOUpELElBQVUsa0JBQWtCLENBd0kzQjtBQXhJRCxXQUFVLGtCQUFrQjtJQUUxQjs7TUFFRTtJQUNGLE1BQWEsUUFBWSxTQUFRLGdCQUFnQjtRQUUvQyxZQUFtQixTQUF3QixFQUFFO1lBQzNDLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUMxQixDQUFDO1FBRUQ7Ozs7V0FJRztRQUNJLElBQUksQ0FBQyxLQUFVLEVBQUUsU0FBa0IsSUFBSTtZQUM1QyxJQUFJLFdBQVcsR0FBZ0IsSUFBSSxDQUFDO1lBRXBDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksSUFBSSxHQUFnQixXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxPQUFPLEdBQWdCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2xCLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQzdCLENBQUM7Z0JBQ0QsV0FBVyxHQUFHLE9BQU8sQ0FBQztZQUN4QixDQUFDO1FBQ0gsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSSxXQUFXLENBQUMsS0FBa0I7WUFDbkMsSUFBSSxLQUFLLEdBQWtCLEVBQUUsQ0FBQztZQUM5QixLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO2dCQUNsQyxJQUFJLEtBQUssR0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xELElBQUksS0FBSyxFQUFFLENBQUM7b0JBQ1YsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzdCLEtBQUssQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXO3dCQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwQixDQUFDOztvQkFDQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLENBQUM7WUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFFRDs7V0FFRztRQUNJLFFBQVEsQ0FBQyxLQUFRO1lBQ3RCLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVE7Z0JBQzVCLElBQWtCLElBQUssQ0FBQyxJQUFJLElBQUksS0FBSztvQkFDbkMsT0FBb0IsSUFBSSxDQUFDO1lBRTdCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVEOztXQUVHO1FBQ0ksUUFBUSxDQUFDLE1BQXFCO1lBQ25DLEtBQUssSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekIsQ0FBQztRQUNILENBQUM7UUFFRDs7V0FFRztRQUNJLFFBQVE7WUFDYixPQUErQixJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9DLENBQUM7UUFFTSxnQkFBZ0IsQ0FBQyxLQUFVO1lBQ2hDLElBQUksS0FBSyxHQUFxRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUYsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLO2dCQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFTSxjQUFjLENBQUMsVUFBYSxFQUFFLFFBQVc7WUFDOUMsSUFBSSxLQUFLLEdBQXFELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxRixJQUFJLFNBQVMsR0FBWSxLQUFLLENBQUM7WUFDL0IsSUFBSSxHQUFHLEdBQU0sSUFBSSxDQUFDO1lBQ2xCLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDZixTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNqQixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksVUFBVTt3QkFDekIsR0FBRyxHQUFHLFFBQVEsQ0FBQzt5QkFDWixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUTt3QkFDNUIsR0FBRyxHQUFHLFVBQVUsQ0FBQzs7d0JBRWpCLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3RCLENBQUM7Z0JBQ0QsSUFBSSxTQUFTLEVBQUUsQ0FBQztvQkFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDekIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUc7d0JBQ2xCLE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBRU0sTUFBTSxDQUFDLEtBQVU7WUFDdEIsSUFBSSxLQUFLLEdBQXFELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxRixJQUFJLE9BQU8sR0FBa0IsRUFBRSxDQUFDO1lBRWhDLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSztnQkFDcEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO29CQUNsQyxrRUFBa0U7b0JBQ2xFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLHlDQUFxQixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3JFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEQsQ0FBQztZQUVILE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7UUFFTSxXQUFXLENBQUMsS0FBUTtZQUN6QixJQUFJLEtBQUssR0FBcUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFGLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSztnQkFDcEIsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUk7b0JBQ3BCLE9BQU8sSUFBSSxDQUFDO1lBQ2hCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUNGO0lBL0hZLDJCQUFRLFdBK0hwQixDQUFBO0lBR0QsY0FBYyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDckUsQ0FBQyxFQXhJUyxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBd0kzQjtBQ3hJRCxrQ0FBa0M7QUFDbEMsSUFBVSxrQkFBa0IsQ0FrTjNCO0FBbk5ELGtDQUFrQztBQUNsQyxXQUFVLGtCQUFrQjtJQUMxQixJQUFZLFNBR1g7SUFIRCxXQUFZLFNBQVM7UUFDbkIsa0NBQXFCLENBQUE7UUFDckIsa0NBQXFCLENBQUE7SUFDdkIsQ0FBQyxFQUhXLFNBQVMsR0FBVCw0QkFBUyxLQUFULDRCQUFTLFFBR3BCO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxNQUFhLElBQVEsU0FBUSxtQkFBQSxRQUFXO1FBR3RDLFlBQW1CLFdBQThCLEVBQUUsS0FBUTtZQUN6RCxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7WUE2SEosY0FBUyxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQzFDLElBQUksTUFBTSxHQUE2QixNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNyRCxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksTUFBTSxHQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBRXhELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEIsQ0FBQyxDQUFDO1lBRU0sY0FBUyxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUM7WUFFTSxpQkFBWSxHQUFHLEtBQUssRUFBRSxNQUFhLEVBQWlCLEVBQUU7Z0JBQzVELHVCQUF1QjtnQkFDdkIsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sR0FBNkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDckQsUUFBUSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3BCO3dCQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQy9GLE1BQU07b0JBQ1I7d0JBQ0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNqRSxNQUFNO29CQUNSO3dCQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQy9GLElBQUksR0FBRyxHQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQ2pFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2pCLE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUMsQ0FBQztZQUVNLGFBQVEsR0FBRyxDQUFDLE1BQXFCLEVBQVEsRUFBRTtnQkFDakQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLEtBQUssR0FBaUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbEYsSUFBSSxNQUFNLEdBQTZCLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3JELElBQUksS0FBSyxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFDLElBQUksS0FBSyxHQUFHLENBQUM7b0JBQ1gsT0FBTztnQkFFVCxJQUFJLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUM7b0JBQzFELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRXRCLFFBQVEsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQjt3QkFDRSxJQUFJLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNOzRCQUN4QixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3ZCLE1BQU07b0JBQ1I7d0JBQ0UsSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDOzRCQUNkLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDdkIsTUFBTTtvQkFDUjt3QkFDRSxNQUFNO2dCQUNWLENBQUM7Z0JBRUQsSUFBSSxNQUFNLENBQUMsUUFBUTtvQkFDSCxRQUFRLENBQUMsYUFBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO29CQUN0QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDMUIsQ0FBQyxDQUFDO1lBdkxBLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO1lBQzlCLElBQUksSUFBSSxHQUFnQixJQUFJLG1CQUFBLFFBQVEsQ0FBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdkIsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQixrQ0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQiwwQkFBYSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxnQkFBZ0IsOEJBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxnQkFBZ0IsOEJBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxnQkFBZ0IsMEJBQWEsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxnQkFBZ0IsNEJBQWMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxnQkFBZ0Isd0JBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BELGFBQWE7WUFDYixJQUFJLENBQUMsZ0JBQWdCLHFDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkQsYUFBYTtZQUNiLElBQUksQ0FBQyxnQkFBZ0IsNkNBQXVCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxjQUFjO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsZ0JBQWdCLENBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxXQUFXO1lBQ2hCLElBQUksS0FBSyxHQUFpQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksS0FBSyxHQUFXLEtBQUssQ0FBQyxPQUFPLENBQWMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDWixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFFM0IsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRU8sU0FBUyxDQUFDLE1BQWE7WUFDN0IsSUFBSSxJQUFJLEdBQTZCLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDbkQsSUFBSSxRQUFRLEdBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNuQyxPQUFPO1lBRVQsSUFBSSxNQUFNLEdBQWdCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsZ0JBQWdCLENBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBRU8sWUFBWSxDQUFDLEtBQVU7WUFDN0IsSUFBSSxNQUFNLEdBQWdCLElBQUksbUJBQUEsUUFBUSxDQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLG1CQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRCxDQUFDO1lBQ0QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztRQUVPLFNBQVMsQ0FBQyxNQUFhO1lBQzdCLElBQUksSUFBSSxHQUFnRCxNQUFNLENBQUMsTUFBTyxDQUFDLFVBQVUsQ0FBQztZQUNsRixJQUFJLE9BQU8sR0FBWSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzFFLElBQUksT0FBTztnQkFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFFRCxrQ0FBa0M7UUFDMUIsU0FBUyxDQUFDLE1BQWE7WUFDN0IsNEJBQTRCO1lBQzVCLElBQUksTUFBTSxHQUF5RSxNQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2xHLElBQUksS0FBSyxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdEUsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3BCLElBQUksU0FBUyxHQUFTLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLE9BQU8sR0FBUyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN4QyxPQUFPO1lBQ1QsQ0FBQztZQUVELElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUTtnQkFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDeEMsQ0FBQztnQkFDSixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7b0JBQ2xCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqRCxDQUFDO1lBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVPLE9BQU8sQ0FBQyxNQUFpQjtZQUMvQiw0QkFBNEI7WUFDNUIsb0NBQW9DO1lBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RGLENBQUM7UUFFTyxXQUFXLENBQUMsU0FBYyxFQUFFLE9BQVU7WUFDNUMsZ0RBQWdEO1lBQ2hELElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pDLE9BQU87WUFFVCx3RUFBd0U7WUFDeEUsSUFBSSxJQUFJLEdBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQU0sU0FBUyxFQUFLLE9BQU8sQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUMzQixPQUFPO1lBRVQsMERBQTBEO1lBQzFELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEIsSUFBSSxVQUFVLEdBQVMsT0FBTyxDQUFDO1lBQy9CLElBQUksVUFBVSxHQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRTNELElBQUksTUFBTSxHQUFnQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDckYsSUFBSSxHQUFHLEdBQWdCLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM5QyxVQUFVLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUM5QixJQUFJLEdBQUc7Z0JBQ0wsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Z0JBRXhCLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFMUIsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNmLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDakIsQ0FBQztLQThERjtJQTdMWSx1QkFBSSxPQTZMaEIsQ0FBQTtJQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFxQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMvRixDQUFDLEVBbE5TLGtCQUFrQixLQUFsQixrQkFBa0IsUUFrTjNCO0FDbk5ELElBQVUsa0JBQWtCLENBd0QzQjtBQXhERCxXQUFVLGtCQUFrQjtJQUMxQjs7O09BR0c7SUFDSCxNQUFzQixjQUFjO1FBQXBDO1lBQ0Usd0lBQXdJO1lBQ2pJLGNBQVMsR0FBUSxFQUFFLENBQUM7WUFDM0IsZ0tBQWdLO1lBQ3pKLGFBQVEsR0FBZ0MsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUM3RSx1S0FBdUs7WUFDaEssY0FBUyxHQUFnQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1lBcUM5RSwrREFBK0Q7WUFDL0QsOEJBQThCO1lBQzlCLDZCQUE2QjtZQUM3QixxRUFBcUU7WUFDckUsdUNBQXVDO1lBQ3ZDLDZDQUE2QztZQUM3QyxJQUFJO1FBQ04sQ0FBQztLQUFBO0lBbERxQixpQ0FBYyxpQkFrRG5DLENBQUE7QUFDSCxDQUFDLEVBeERTLGtCQUFrQixLQUFsQixrQkFBa0IsUUF3RDNCO0FDeERELElBQVUsa0JBQWtCLENBc1QzQjtBQXRURCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckI7OztPQUdHO0lBQ0gsTUFBYSxRQUFZLFNBQVEsYUFBYTtRQVM1QyxZQUFtQixXQUE4QixFQUFFLEtBQVE7WUFDekQsS0FBSyxFQUFFLENBQUM7WUFUSCxZQUFPLEdBQVcsVUFBVSxDQUFDO1lBQzdCLFlBQU8sR0FBZ0IsRUFBRSxDQUFDO1lBQzFCLFNBQUksR0FBTSxJQUFJLENBQUM7WUFpS2QsYUFBUSxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQ3pDLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSztvQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQy9CLENBQUMsQ0FBQztZQUVNLFdBQU0sR0FBRyxDQUFDLE1BQXFCLEVBQVEsRUFBRTtnQkFDL0MsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO29CQUN0QixPQUFPO2dCQUNULElBQUksT0FBTyxHQUE2QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUVqRSxRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEIsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFdBQVc7d0JBQzlCLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLE9BQU87NEJBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7OzRCQUVsQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksYUFBYSxxQ0FBbUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNqSSxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxVQUFVO3dCQUM3QixJQUFJLE9BQU87NEJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7NEJBRW5CLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLDZDQUF1QixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3JJLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVU7d0JBQzdCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLHFDQUFtQixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQy9ILE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVE7d0JBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLDZDQUF1QixFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ25JLE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUU7d0JBQ3JCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO3dCQUN4QixNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLO3dCQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUM3QyxNQUFNO29CQUNSLEtBQUssQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFHO3dCQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw4QkFBZSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQy9ELE1BQU07b0JBQ1IsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU07d0JBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDL0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSywwQkFBYSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQy9ELENBQUM7d0JBQ0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyw0QkFBYyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ2hFLENBQUM7d0JBQ0QsTUFBTTtvQkFDUixLQUFLLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzt3QkFDcEIsSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs0QkFDckMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyx3QkFBWSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzlELENBQUM7d0JBQ0QsTUFBTTtnQkFDVixDQUFDO1lBQ0gsQ0FBQyxDQUFDO1lBT00sZ0JBQVcsR0FBRyxDQUFDLE1BQWEsRUFBUSxFQUFFO2dCQUM1QyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUTtvQkFDaEMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDNUIsQ0FBQyxDQUFDO1lBRU0sY0FBUyxHQUFHLENBQUMsTUFBYSxFQUFRLEVBQUU7Z0JBQzFDLElBQUksTUFBTSxHQUF1QyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUMvRCxJQUFJLElBQUksR0FBaUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztnQkFDOUQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUV6QixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEIsS0FBSyxVQUFVO3dCQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUM1QixNQUFNO29CQUNSLEtBQUssTUFBTTt3QkFDVCxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDdkIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUNiLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxXQUFXLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNwRyxNQUFNO29CQUNSLEtBQUssU0FBUzt3QkFDWix1QkFBdUI7d0JBQ3ZCLE1BQU07Z0JBQ1YsQ0FBQztZQUNILENBQUMsQ0FBQztZQUVNLGlCQUFZLEdBQUcsQ0FBQyxNQUFpQixFQUFRLEVBQUU7Z0JBQ2pELDRCQUE0QjtnQkFDNUIsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7b0JBQzFDLE9BQU87Z0JBRVQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxJQUFJLENBQUMsUUFBUTtvQkFDZixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7O29CQUU3RCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztnQkFDMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFFdkMsbUdBQW1HO2dCQUNuRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3RCxDQUFDLENBQUM7WUFFTSxnQkFBVyxHQUFHLENBQUMsTUFBaUIsRUFBUSxFQUFFO2dCQUNoRCx1Q0FBdUM7Z0JBQ3ZDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDO29CQUNyQyxPQUFPO2dCQUVULE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDMUMsNEJBQTRCO2dCQUM1QixNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM1QyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7WUFDMUMsQ0FBQyxDQUFDO1lBRU0saUJBQVksR0FBRyxDQUFDLE1BQW9CLEVBQVEsRUFBRTtnQkFDcEQsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN6QixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVE7b0JBQ2hDLE9BQU87Z0JBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxDQUFDLENBQUM7WUFFTSxjQUFTLEdBQUcsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDMUMsSUFBSSxNQUFNLENBQUMsYUFBYSxJQUFJLE1BQU0sQ0FBQyxNQUFNO29CQUN2QyxPQUFPO2dCQUNULE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDO1lBaFNBLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO1lBQzlCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0MsMEJBQTBCO1lBQzFCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFdEQsSUFBSSxDQUFDLGdCQUFnQiw4QkFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLGdCQUFnQixzQ0FBcUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxnQkFBZ0IsbUNBQWtCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0RCxJQUFJLENBQUMsZ0JBQWdCLGlDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkQsK0RBQStEO1lBQy9ELG1FQUFtRTtZQUVuRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsZ0JBQWdCLHFDQUFtQixJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0QsSUFBSSxDQUFDLGdCQUFnQixtQ0FBa0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRXpELElBQUksQ0FBQyxnQkFBZ0IscUNBQW1CLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLHlDQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVEOztXQUVHO1FBQ0gsSUFBVyxXQUFXO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQztRQUNwRCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLFdBQVcsQ0FBQyxJQUFhO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQy9ELENBQUM7UUFFRDs7V0FFRztRQUNILElBQVcsUUFBUSxDQUFDLEdBQVk7WUFDOUIsSUFBSSxHQUFHO2dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Z0JBRXZDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLG1CQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLFFBQVE7WUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxtQkFBQSxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVEOztXQUVHO1FBQ0ksUUFBUSxDQUFDLEtBQWE7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQzNCLENBQUM7UUFFRDs7V0FFRztRQUNJLFFBQVE7WUFDYixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzFCLENBQUM7UUFFRDs7V0FFRztRQUNJLGlCQUFpQjtZQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNJLE1BQU0sQ0FBQyxPQUFnQjtZQUM1QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFcEIsSUFBSSxPQUFPO2dCQUNULElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLDhCQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUU5QyxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFFLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUNyRixDQUFDO1FBRUQ7O1dBRUc7UUFDSSxjQUFjO1lBQ25CLElBQUksSUFBSSxHQUE4QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEUsSUFBSSxJQUFJLEdBQVEsRUFBRSxDQUFDO1lBQ25CLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSTtnQkFDbkIsSUFBSSxDQUFDLElBQUksQ0FBZSxJQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQ7O1dBRUc7UUFDSSxTQUFTLENBQUMsT0FBb0I7WUFDbkMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLElBQUksT0FBTztnQkFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFFRDs7V0FFRztRQUNJLFNBQVM7WUFDZCxPQUFvQixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFHRDs7OztXQUlHO1FBQ0ksTUFBTSxDQUFDLFNBQWtCLEVBQUUsWUFBcUIsS0FBSztZQUMxRCxJQUFJLEtBQUssR0FBZ0IsSUFBSSxXQUFXLGtDQUFlLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDakosSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRUQ7O1dBRUc7UUFDSyxZQUFZO1lBQ2xCLElBQUksT0FBTyxHQUFnQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDNUMsSUFBSSxDQUFDLE9BQU87Z0JBQ1YsT0FBTztZQUNULElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVPLE1BQU07WUFDWixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWhDLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFN0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFFekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQWtFTyxnQkFBZ0I7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckIsQ0FBQztLQXNFRjtJQTVTWSwyQkFBUSxXQTRTcEIsQ0FBQTtJQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFxQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN4RyxDQUFDLEVBdFRTLGtCQUFrQixLQUFsQixrQkFBa0IsUUFzVDNCIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQ29tbW9uIGNsaXBib2FyZHMgZm9yIGFsbCBkcmFnLWRyb3AgYW5kIGNvcHktcGFzdGUgb3BlcmF0aW9ucyBoYXBwZW5pbmcgaW4gdGhlIHVzZXIgaW50ZXJmYWNlXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyNFxyXG4gICAqL1xyXG5cclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgZXhwb3J0IHR5cGUgQ2xpcE9wZXJhdGlvbiA9IEVWRU5ULkNPUFkgfCBFVkVOVC5DVVQ7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDbGlwYm9hcmQge1xyXG4gICAgcHVibGljIHN0YXRpYyBkcmFnRHJvcDogQ2xpcGJvYXJkID0gbmV3IENsaXBib2FyZCgpO1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5UGFzdGU6IENsaXBib2FyZCA9IG5ldyBDbGlwYm9hcmQoKTtcclxuICAgIHB1YmxpYyBvYmplY3RzOiDGki5HZW5lcmFsW10gPSBbXTtcclxuICAgIHB1YmxpYyBvcGVyYXRpb246IENsaXBPcGVyYXRpb247XHJcbiAgICBwdWJsaWMgc291cmNlOiBPYmplY3QgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBnZXQ8VD4oX2NsYXNzOiBuZXcgKCkgPT4gVCB8IE9iamVjdCA9IE9iamVjdCwgX2ZpbHRlcjogYm9vbGVhbiA9IHRydWUpOiBUW10ge1xyXG4gICAgICBpZiAoX2NsYXNzKVxyXG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdHMuZmlsdGVyKF9vYmplY3QgPT4gX29iamVjdCBpbnN0YW5jZW9mIF9jbGFzcyk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuICAgICAgdGhpcy5vYmplY3RzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldChfb2JqZWN0czogT2JqZWN0W10sIF9zb3VyY2U6IE9iamVjdCwgX29wZXJhdGlvbjogQ2xpcE9wZXJhdGlvbik6IHZvaWQge1xyXG4gICAgICB0aGlzLm9iamVjdHMgPSBfb2JqZWN0cy5zbGljZSgpO1xyXG4gICAgICB0aGlzLnNvdXJjZSA9IF9zb3VyY2U7XHJcbiAgICAgIHRoaXMub3BlcmF0aW9uID0gX29wZXJhdGlvbjtcclxuICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIC8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vRGlzdHJpYnV0aW9uL0Z1ZGdlQ29yZS5kLnRzXCIvPiAvLyBUT0RPOiBub3cgdGhhdCB3ZSB1c2UgcGFja2FnZSByZWZlcmVuY2VzIGluIHRoZSB0c2NvbmZpZywgdGhpcyBmaWxlIGlzIG9ic29sZXRlIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBDb25uZWN0cyBhIFtbTXV0YWJsZV1dIHRvIGEgRE9NLUVsZW1lbnQgYW5kIHN5bmNocm9uaXplcyB0aGF0IG11dGFibGUgd2l0aCB0aGUgbXV0YXRvciBzdG9yZWQgd2l0aGluLlxyXG4gICAqIFVwZGF0ZXMgdGhlIG11dGFibGUgb24gaW50ZXJhY3Rpb24gd2l0aCB0aGUgZWxlbWVudCBhbmQgdGhlIGVsZW1lbnQgaW4gdGltZSBpbnRlcnZhbHMuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXIge1xyXG4gICAgLy8gVE9ETzogZXhhbWluZSB0aGUgdXNlIG9mIHRoZSBhdHRyaWJ1dGUga2V5IHZzIG5hbWUuIEtleSBzaWduYWxzIHRoZSB1c2UgYnkgRlVER0Ugd2hpbGUgbmFtZSBpcyBzdGFuZGFyZCBhbmQgc3VwcG9ydGVkIGJ5IGZvcm1zXHJcbiAgICBwdWJsaWMgZG9tRWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcm90ZWN0ZWQgdGltZVVwZGF0ZTogbnVtYmVyID0gMTkwO1xyXG4gICAgLyoqIFJlZmVyZXJlbmNlIHRvIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV0gdGhpcyB1aSByZWZlcnMgdG8gKi9cclxuICAgIHByb3RlY3RlZCBtdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+O1xyXG4gICAgLyoqIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSB1c2VkIHRvIGNvbnZleSBkYXRhIHRvIGFuZCBmcm9tIHRoZSBtdXRhYmxlKi9cclxuICAgIHByb3RlY3RlZCBtdXRhdG9yOiDGki5NdXRhdG9yO1xyXG4gICAgLyoqIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSB1c2VkIHRvIHN0b3JlIHRoZSBkYXRhIHR5cGVzIG9mIHRoZSBtdXRhdG9yIGF0dHJpYnV0ZXMqL1xyXG4gICAgcHJvdGVjdGVkIG11dGF0b3JUeXBlczogxpIuTXV0YXRvciA9IG51bGw7XHJcblxyXG4gICAgcHJpdmF0ZSBpZEludGVydmFsOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5kb21FbGVtZW50ID0gX2RvbUVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuc2V0TXV0YWJsZShfbXV0YWJsZSk7XHJcbiAgICAgIC8vIFRPRE86IGV4YW1pbmUsIGlmIHRoaXMgc2hvdWxkIHJlZ2lzdGVyIHRvIG9uZSBjb21tb24gaW50ZXJ2YWwsIGluc3RlYWQgb2YgZWFjaCBpbnN0YWxsaW5nIGl0cyBvd24uXHJcbiAgICAgIHRoaXMuc3RhcnRSZWZyZXNoKCk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOUFVULCB0aGlzLm11dGF0ZU9uSW5wdXQpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5SRUFSUkFOR0VfQVJSQVksIHRoaXMucmVhcnJhbmdlQXJyYXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVjdXJzaXZlIG1ldGhvZCB0YWtpbmcgYW4gZXhpc3RpbmcgW1vGki5NdXRhdG9yXV0gYXMgYSB0ZW1wbGF0ZSBcclxuICAgICAqIGFuZCB1cGRhdGluZyBpdHMgdmFsdWVzIHdpdGggdGhvc2UgZm91bmQgaW4gdGhlIGdpdmVuIFVJLWRvbUVsZW1lbnQuIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZU11dGF0b3IoX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfbXV0YXRvcjogxpIuTXV0YXRvcik6IMaSLk11dGF0b3Ige1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PkNvbnRyb2xsZXIuZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50LCBrZXkpO1xyXG4gICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50KVxyXG4gICAgICAgICAgX211dGF0b3Jba2V5XSA9IGVsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZSBpZiAoX211dGF0b3Jba2V5XSBpbnN0YW5jZW9mIE9iamVjdClcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBDb250cm9sbGVyLnVwZGF0ZU11dGF0b3IoZWxlbWVudCwgX211dGF0b3Jba2V5XSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgX211dGF0b3Jba2V5XSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBfbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIHRoZSBhIFtbxpIuTXV0YWJsZV1dIGFzIGEgdGVtcGxhdGUgdG8gY3JlYXRlIGEgW1vGki5NdXRhdG9yXV0gb3IgdXBkYXRlIHRoZSBnaXZlbiBbW8aSLk11dGF0b3JdXSBcclxuICAgICAqIHdpdGggdGhlIHZhbHVlcyBpbiB0aGUgZ2l2ZW4gVUktZG9tRWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE11dGF0b3IoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX211dGF0b3I/OiDGki5NdXRhdG9yLCBfdHlwZXM/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIC8vIFRPRE86IGV4YW1pbmUgaWYgdGhpcy5tdXRhdG9yIHNob3VsZCBhbHNvIGJlIGFkZHJlc3NlZCBpbiBzb21lIHdheS4uLlxyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9tdXRhdG9yIHx8IF9tdXRhYmxlLmdldE11dGF0b3JGb3JVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIC8vIFRPRE86IE11dGF0b3IgdHlwZSBub3cgb25seSB1c2VkIGZvciBlbnVtcy4gRXhhbWluZSBpZiB0aGVyZSBpcyBhbm90aGVyIHdheVxyXG4gICAgICBsZXQgbXV0YXRvclR5cGVzOiDGki5NdXRhdG9yQXR0cmlidXRlVHlwZXMgPSBfdHlwZXMgfHwgX211dGFibGUuZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKG11dGF0b3IpO1xyXG5cclxuICAgICAgZm9yIChsZXQga2V5IGluIG11dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBDb250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9ICg8Q3VzdG9tRWxlbWVudD5lbGVtZW50KS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgICBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudClcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgICAgICAgZWxzZSBpZiAobXV0YXRvclR5cGVzW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpXHJcbiAgICAgICAgICAvLyBUT0RPOiBzZXR0aW5nIGEgdmFsdWUgb2YgdGhlIGRvbSBlbGVtZW50IGRvZXNuJ3QgbWFrZSBzZW5zZS4uLiBleGFtaW5lIHdoYXQgdGhpcyBsaW5lIHdhcyBzdXBwb3NlZCB0byBkby4gQXNzdW1hYmx5IGVudW1zXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSAoPEhUTUxTZWxlY3RFbGVtZW50PmVsZW1lbnQpLnZhbHVlO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHN1Yk11dGF0b3I6IMaSLk11dGF0b3IgPSBSZWZsZWN0LmdldChtdXRhdG9yLCBrZXkpO1xyXG4gICAgICAgICAgbGV0IHN1Yk11dGFibGU6IMaSLk11dGFibGU7XHJcbiAgICAgICAgICBzdWJNdXRhYmxlID0gUmVmbGVjdC5nZXQoX211dGFibGUsIGtleSk7XHJcbiAgICAgICAgICBpZiAoc3ViTXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSB8fCBzdWJNdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICAgICAgbXV0YXRvcltrZXldID0gdGhpcy5nZXRNdXRhdG9yKHN1Yk11dGFibGUsIGVsZW1lbnQsIHN1Yk11dGF0b3IpOyAvLywgc3ViVHlwZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIHRoZSBbW8aSLk11dGF0b3JdXSBvZiBhIFtbxpIuTXV0YWJsZV1dIGFuZCB1cGRhdGluZyB0aGUgVUktZG9tRWxlbWVudCBhY2NvcmRpbmdseS5cclxuICAgICAqIElmIGFuIGFkZGl0aW9uYWwgW1vGki5NdXRhdG9yXV0gaXMgcGFzc2VkLCBpdHMgdmFsdWVzIGFyZSB1c2VkIGluc3RlYWQgb2YgdGhvc2Ugb2YgdGhlIFtbxpIuTXV0YWJsZV1dLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZVVzZXJJbnRlcmZhY2UoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX211dGF0b3I/OiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwgX211dGFibGUuZ2V0TXV0YXRvckZvclVzZXJJbnRlcmZhY2UoKTtcclxuICAgICAgbGV0IG11dGF0b3JUeXBlczogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzID0gX211dGFibGUuZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKG11dGF0b3IpO1xyXG5cclxuICAgICAgZm9yIChsZXQga2V5IGluIG11dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogQ3VzdG9tRWxlbWVudCA9IDxDdXN0b21FbGVtZW50PkNvbnRyb2xsZXIuZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50LCBrZXkpO1xyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBsZXQgdmFsdWU6IMaSLkdlbmVyYWwgPSBtdXRhdG9yW2tleV07XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudCAmJiBlbGVtZW50ICE9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXHJcbiAgICAgICAgICBlbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgZWxzZSBpZiAobXV0YXRvclR5cGVzW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpXHJcbiAgICAgICAgICBlbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBsZXQgc3ViTXV0YWJsZTogxpIuTXV0YWJsZSA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgICAgaWYgKHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkgfHwgc3ViTXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVXNlckludGVyZmFjZShzdWJNdXRhYmxlLCBlbGVtZW50LCBtdXRhdG9yW2tleV0pO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAvL2VsZW1lbnQuc2V0TXV0YXRvclZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgUmVmbGVjdC5zZXQoZWxlbWVudCwgXCJ2YWx1ZVwiLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtcyBhIGJyZWFkdGgtZmlyc3Qgc2VhcmNoIG9uIHRoZSBnaXZlbiBfZG9tRWxlbWVudCBmb3IgYW4gZWxlbWVudCB3aXRoIHRoZSBnaXZlbiBrZXkuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX2tleTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgZWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+ID0gX2RvbUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2tleT1cIiR7X2tleX1cIl1gKTtcclxuICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA8IDIpXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzWzBdO1xyXG5cclxuICAgICAgbGV0IHNob3J0ZXN0UGF0aDogbnVtYmVyID0gSW5maW5pdHk7XHJcbiAgICAgIGxldCBjbG9zZXN0RWxlbWVudDogSFRNTEVsZW1lbnQgPSBudWxsO1xyXG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XHJcbiAgICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IHBhcmVudEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50OyBwYXJlbnRFbGVtZW50ICE9IF9kb21FbGVtZW50OyBwYXJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50KVxyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICBpZiAoY291bnQgPCBzaG9ydGVzdFBhdGgpIHtcclxuICAgICAgICAgIGNsb3Nlc3RFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgIHNob3J0ZXN0UGF0aCA9IGNvdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNsb3Nlc3RFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX2tleTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgLy8gICByZXR1cm4gX2RvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihgOnNjb3BlID4gW2tleT1cIiR7X2tleX1cIl1gKSA/PyBfZG9tRWxlbWVudC5xdWVyeVNlbGVjdG9yKGA6c2NvcGUgPiAqID4gW2tleT1cIiR7X2tleX1cIl1gKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFBlcmZvcm1zIGEgYnJlYWR0aC1maXJzdCBzZWFyY2ggb24gdGhlIGdpdmVuIF9kb21FbGVtZW50IGZvciBhbiBlbGVtZW50IHdpdGggdGhlIGdpdmVuIGtleS5cclxuICAgICAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBmaW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfa2V5OiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAvLyAgIGxldCBxdWV1ZTogSFRNTEVsZW1lbnRbXSA9IFtfZG9tRWxlbWVudF07XHJcbiAgICAvLyAgIHdoaWxlIChxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAvLyAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gcXVldWUuc2hpZnQoKTtcclxuICAgIC8vICAgICBpZiAoZWxlbWVudC5tYXRjaGVzKGBba2V5PVwiJHtfa2V5fVwiXWApKVxyXG4gICAgLy8gICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcblxyXG4gICAgLy8gICAgIHF1ZXVlLnB1c2goLi4uPEhUTUxFbGVtZW50W10+QXJyYXkuZnJvbShlbGVtZW50LmNoaWxkcmVuKSk7XHJcbiAgICAvLyAgIH1cclxuICAgIC8vICAgcmV0dXJuIG51bGw7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3IoX211dGF0b3I/OiDGki5NdXRhdG9yLCBfdHlwZXM/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIC8vIFRPRE86IHNob3VsZCBnZXQgTXV0YXRvciBmb3IgVUkgb3Igd29yayB3aXRoIHRoaXMubXV0YXRvciAoZXhhbWluZSlcclxuICAgICAgdGhpcy5tdXRhYmxlLnVwZGF0ZU11dGF0b3IodGhpcy5tdXRhdG9yKTtcclxuICAgICAgcmV0dXJuIENvbnRyb2xsZXIuZ2V0TXV0YXRvcih0aGlzLm11dGFibGUsIHRoaXMuZG9tRWxlbWVudCwgX211dGF0b3IsIF90eXBlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVVzZXJJbnRlcmZhY2UoKTogdm9pZCB7XHJcbiAgICAgIENvbnRyb2xsZXIudXBkYXRlVXNlckludGVyZmFjZSh0aGlzLm11dGFibGUsIHRoaXMuZG9tRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGFibGUoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5tdXRhYmxlID0gX211dGFibGU7XHJcbiAgICAgIHRoaXMubXV0YXRvciA9IF9tdXRhYmxlLmdldE11dGF0b3JGb3JVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIGlmIChfbXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgdGhpcy5tdXRhdG9yVHlwZXMgPSBfbXV0YWJsZS5nZXRNdXRhdG9yQXR0cmlidXRlVHlwZXModGhpcy5tdXRhdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YWJsZSgpOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+IHtcclxuICAgICAgcmV0dXJuIHRoaXMubXV0YWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnRSZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmlkSW50ZXJ2YWwpO1xyXG4gICAgICB0aGlzLmlkSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5yZWZyZXNoLCB0aGlzLnRpbWVVcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBtdXRhdGVPbklucHV0ID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGZvciAobGV0IHRhcmdldCBvZiBfZXZlbnQuY29tcG9zZWRQYXRoKCkpIHtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IHRoaXMuZG9tRWxlbWVudClcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50PnRhcmdldCkuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICAgIGlmIChrZXkpXHJcbiAgICAgICAgICBwYXRoLnB1c2goa2V5KTtcclxuICAgICAgfVxyXG4gICAgICBwYXRoLnJldmVyc2UoKTtcclxuICAgICAgdGhpcy5tdXRhdG9yID0gdGhpcy5nZXRNdXRhdG9yKCk7XHJcbiAgICAgIGF3YWl0IHRoaXMubXV0YWJsZS5tdXRhdGUoxpIuTXV0YWJsZS5nZXRNdXRhdG9yRnJvbVBhdGgodGhpcy5tdXRhdG9yLCBwYXRoKSk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5NVVRBVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCByZWFycmFuZ2VBcnJheSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogbnVtYmVyW10gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsLnNlcXVlbmNlO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgbGV0IGRldGFpbHM6IERldGFpbHNBcnJheSA9IDxEZXRhaWxzQXJyYXk+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IG11dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT47XHJcblxyXG4gICAgICB7IC8vIGZpbmQgdGhlIE11dGFibGVBcnJheSBjb25uZWN0ZWQgdG8gdGhpcyBEZXRhaWxzQXJyYXlcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkZXRhaWxzO1xyXG4gICAgICAgIHdoaWxlIChlbGVtZW50ICE9IHRoaXMuZG9tRWxlbWVudCkge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpKVxyXG4gICAgICAgICAgICBwYXRoLnB1c2goZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpO1xyXG4gICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocGF0aCk7XHJcbiAgICAgICAgbXV0YWJsZSA9IHRoaXMubXV0YWJsZTtcclxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgcGF0aClcclxuICAgICAgICAgIG11dGFibGUgPSBSZWZsZWN0LmdldChtdXRhYmxlLCBrZXkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyByZWFycmFuZ2UgdGhhdCBtdXRhYmxlXHJcbiAgICAgICg8xpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+Pjx1bmtub3duPm11dGFibGUpLnJlYXJyYW5nZShzZXF1ZW5jZSk7XHJcbiAgICAgIGF3YWl0IHRoaXMubXV0YWJsZS5tdXRhdGUodGhpcy5tdXRhYmxlLmdldE11dGF0b3IoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCByZWZyZXNoID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY29udGFpbnModGhpcy5kb21FbGVtZW50KSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVXNlckludGVyZmFjZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pZEludGVydmFsKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIGdlbmVyYXRpbmcgVUktZG9tRWxlbWVudHMgZnJvbSB0aGUgaW5mb3JtYXRpb24gZm91bmQgaW4gW1vGki5NdXRhYmxlXV1zIGFuZCBbW8aSLk11dGF0b3JdXXNcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgR2VuZXJhdG9yIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIFtbQ29udHJvbGxlcl1dIGZyb20gYSBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV0gd2l0aCBleHBhbmRhYmxlIGRldGFpbHMgb3IgYSBsaXN0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlQ29udHJvbGxlcihfbXV0YWJsZTogxpIuTXV0YWJsZSwgX25hbWU/OiBzdHJpbmcpOiBDb250cm9sbGVyIHtcclxuICAgICAgbGV0IGNvbnRyb2xsZXI6IENvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcihfbXV0YWJsZSwgR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShfbXV0YWJsZSwgX25hbWUpKTtcclxuICAgICAgY29udHJvbGxlci51cGRhdGVVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGV4dGVuZGFibGUgZGV0YWlscyBmb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSBvciB0aGUgW1tGdWRnZUNvcmUuTXV0YWJsZV1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRGV0YWlsc0Zyb21NdXRhYmxlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfbmFtZT86IHN0cmluZywgX211dGF0b3I/OiDGki5NdXRhdG9yKTogRGV0YWlscyB8IERldGFpbHNBcnJheSB7XHJcbiAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSBfbmFtZSB8fCBfbXV0YWJsZS5jb25zdHJ1Y3Rvci5uYW1lO1xyXG5cclxuICAgICAgbGV0IGRldGFpbHM6IERldGFpbHMgfCBEZXRhaWxzQXJyYXk7XHJcbiAgICAgIGlmIChfbXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSlcclxuICAgICAgICBkZXRhaWxzID0gbmV3IERldGFpbHNBcnJheShuYW1lKTtcclxuICAgICAgZWxzZSBpZiAoX211dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgIGRldGFpbHMgPSBuZXcgRGV0YWlscyhuYW1lLCBfbXV0YWJsZS50eXBlKTtcclxuICAgICAgZWxzZSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgIGRldGFpbHMuc2V0Q29udGVudChHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGFibGUoX211dGFibGUsIF9tdXRhdG9yKSk7XHJcbiAgICAgIHJldHVybiBkZXRhaWxzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgZGl2LUVsZW1lbnRzIGNvbnRhaW5pbmcgdGhlIGludGVyZmFjZSBmb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSBvciB0aGUgW1tGdWRnZUNvcmUuTXV0YWJsZV1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlSW50ZXJmYWNlRnJvbU11dGFibGUoX211dGFibGU6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4sIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCBfbXV0YWJsZS5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgICBsZXQgbXV0YXRvclR5cGVzOiDGki5NdXRhdG9yQXR0cmlidXRlVHlwZXMgPSBfbXV0YWJsZS5nZXRNdXRhdG9yQXR0cmlidXRlVHlwZXMobXV0YXRvcik7XHJcbiAgICAgIGxldCBkaXY6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yVHlwZXMpIHtcclxuICAgICAgICBsZXQgdHlwZTogT2JqZWN0ID0gbXV0YXRvclR5cGVzW2tleV07XHJcbiAgICAgICAgbGV0IHZhbHVlOiBPYmplY3QgPSBtdXRhdG9yW2tleV07XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gR2VuZXJhdG9yLmNyZWF0ZU11dGF0b3JFbGVtZW50KGtleSwgdHlwZSwgdmFsdWUpO1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcclxuICAgICAgICAgIGxldCBzdWJNdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+ID0gUmVmbGVjdC5nZXQoX211dGFibGUsIGtleSk7XHJcbiAgICAgICAgICBlbGVtZW50ID0gR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShzdWJNdXRhYmxlLCBrZXksIDzGki5NdXRhdG9yPnZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudCAmJiB0eXBlKVxyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBDdXN0b21FbGVtZW50T3V0cHV0KHsga2V5OiBrZXksIGxhYmVsOiBrZXksIHR5cGU6IHR5cGUudG9TdHJpbmcoKSwgdmFsdWU6IHZhbHVlPy50b1N0cmluZygpLCBwbGFjZWhvbGRlcjogYERyb3AgeW91ciAke3R5cGV9IGhlcmUuLi5gIH0pO1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQpIC8vIHVuZGVmaW5lZCB2YWx1ZXMgd2l0aG91dCBhIHR5cGUgY2FuJ3QgYmUgZGlzcGxheWVkXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkaXYtRWxlbWVudCBjb250YWluaW5nIHRoZSBpbnRlcmZhY2UgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gXHJcbiAgICAgKiBEb2VzIG5vdCBzdXBwb3J0IG5lc3RlZCBtdXRhdG9ycyFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVJbnRlcmZhY2VGcm9tTXV0YXRvcihfbXV0YXRvcjogxpIuTXV0YXRvciB8IE9iamVjdCk6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgbGV0IGRpdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgdmFsdWU6IE9iamVjdCA9IFJlZmxlY3QuZ2V0KF9tdXRhdG9yLCBrZXkpO1xyXG4gICAgICAgIC8vIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSAvLyBhdCB0aGlzIHRpbWUgKDEvMjMpIGFkZGluZyBhIHByb3BlcnR5IHRvIGFuIGFuaW1hdGlvbiBpbiB0aGUgZWRpdG9yIGNyZWF0ZXMgYW4gZW1wdHkga2V5cyBsaXN0Li4uXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCBPYmplY3QsIHt9KSk7IFxyXG4gICAgICAgIC8vICAgY29udGludWU7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgLy8gbGV0IGRldGFpbHM6IERldGFpbHMgPSBHZW5lcmF0b3IuY3JlYXRlRGV0YWlscyhrZXksIFwiRGV0YWlsc1wiKTtcclxuICAgICAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHMoa2V5LCBcIkRldGFpbHNcIik7XHJcbiAgICAgICAgICBkZXRhaWxzLnNldENvbnRlbnQoR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKHZhbHVlKSk7XHJcbiAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVNdXRhdG9yRWxlbWVudChrZXksICg8T2JqZWN0PnZhbHVlKS5jb25zdHJ1Y3Rvci5uYW1lLCB2YWx1ZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBzcGVjaWZpYyBDdXN0b21FbGVtZW50IGZvciB0aGUgZ2l2ZW4gZGF0YSwgdXNpbmcgX2tleSBhcyBpZGVudGlmaWNhdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZU11dGF0b3JFbGVtZW50KF9rZXk6IHN0cmluZywgX3R5cGU6IE9iamVjdCB8IHN0cmluZywgX3ZhbHVlOiBPYmplY3QpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBpZiAoX3R5cGUgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgIGxldCBlbGVtZW50VHlwZTogdHlwZW9mIEN1c3RvbUVsZW1lbnQgPSBDdXN0b21FbGVtZW50LmdldChcIk9iamVjdFwiKTtcclxuICAgICAgICAgIC8vIEB0cy1pZ25vcmU6IGluc3RhbnRpYXRlIGFic3RyYWN0IGNsYXNzXHJcbiAgICAgICAgICBlbGVtZW50ID0gbmV3IGVsZW1lbnRUeXBlKHsga2V5OiBfa2V5LCBsYWJlbDogX2tleSwgdmFsdWU6IF92YWx1ZS50b1N0cmluZygpIH0sIF90eXBlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKF92YWx1ZSBpbnN0YW5jZW9mIMaSLk11dGFibGVBcnJheSkgeyAvLyBUT0RPOiBkZWxldGU/XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk11dGFibGVBcnJheVwiKTtcclxuICAgICAgICAgIC8vIGluc2VydCBBcnJheS1Db250cm9sbGVyIVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgZWxlbWVudFR5cGU6IHR5cGVvZiBDdXN0b21FbGVtZW50ID0gQ3VzdG9tRWxlbWVudC5nZXQoX3R5cGUpO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50VHlwZSlcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgICAvLyBAdHMtaWdub3JlOiBpbnN0YW50aWF0ZSBhYnN0cmFjdCBjbGFzc1xyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBlbGVtZW50VHlwZSh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHZhbHVlOiBfdmFsdWU/LnRvU3RyaW5nKCkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICDGki5EZWJ1Zy5mdWRnZShfZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVE9ETzogcmVmYWN0b3IgZm9yIGVudW1zIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZURyb3Bkb3duKF9uYW1lOiBzdHJpbmcsIF9jb250ZW50OiBPYmplY3QsIF92YWx1ZTogc3RyaW5nLCBfcGFyZW50OiBIVE1MRWxlbWVudCwgX2Nzc0NsYXNzPzogc3RyaW5nKTogSFRNTFNlbGVjdEVsZW1lbnQge1xyXG4gICAgICBsZXQgZHJvcGRvd246IEhUTUxTZWxlY3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuICAgICAgZHJvcGRvd24ubmFtZSA9IF9uYW1lO1xyXG4gICAgICBmb3IgKGxldCB2YWx1ZSBpbiBfY29udGVudCkge1xyXG4gICAgICAgIGxldCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgIGVudHJ5LnRleHQgPSB2YWx1ZTtcclxuICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh2YWx1ZS50b1VwcGVyQ2FzZSgpID09IF92YWx1ZS50b1VwcGVyQ2FzZSgpKSB7XHJcbiAgICAgICAgICBlbnRyeS5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRyb3Bkb3duLmFkZChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgX3BhcmVudC5hcHBlbmRDaGlsZChkcm9wZG93bik7XHJcbiAgICAgIHJldHVybiBkcm9wZG93bjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGNyZWF0ZURldGFpbHMoX2tleTogc3RyaW5nLCBfdHlwZTogc3RyaW5nKTogRGV0YWlscyB7XHJcbiAgICAvLyAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHMoX2tleSk7XHJcbiAgICAvLyAgIC8vIGRldGFpbHMuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBfdHlwZSk7XHJcbiAgICAvLyAgIHJldHVybiBkZXRhaWxzO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBjcmVhdGVEZXRhaWxzQXJyYXkoX2tleTogc3RyaW5nLCBfdHlwZTogc3RyaW5nKTogRGV0YWlscyB7XHJcbiAgICAvLyAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHNBcnJheShfa2V5KTtcclxuICAgIC8vICAgZGV0YWlscy5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgX2tleSk7XHJcbiAgICAvLyAgIGRldGFpbHMuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBfdHlwZSk7XHJcbiAgICAvLyAgIHJldHVybiBkZXRhaWxzO1xyXG4gICAgLy8gfVxyXG4gIH1cclxufVxyXG5cclxuXHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RydWN0dXJlIGZvciB0aGUgYXR0cmlidXRlcyB0byBzZXQgaW4gYSBDdXN0b21FbGVtZW50LlxyXG4gICAqIGtleSAobWF5YmUgcmVuYW1lIHRvIGBuYW1lYCkgaXMgbWFuZGF0b3J5IGFuZCBtdXN0IG1hdGNoIHRoZSBrZXkgb2YgYSBtdXRhdG9yIGlmIHVzZWQgaW4gY29uanVuY3Rpb25cclxuICAgKiBsYWJlbCBpcyByZWNvbW1lbmRlZCBmb3IgbGFiZWxsZWQgZWxlbWVudHMsIGtleSBpcyB1c2VkIGlmIG5vdCBnaXZlbi5cclxuICAgKi9cclxuICBleHBvcnQgaW50ZXJmYWNlIEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzIHtcclxuICAgIFtuYW1lOiBzdHJpbmddOiBzdHJpbmc7XHJcbiAgICBrZXk6IHN0cmluZztcclxuICAgIGxhYmVsPzogc3RyaW5nO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyB0aGUgbWFwcGluZyBvZiBDdXN0b21FbGVtZW50cyB0byB0aGVpciBIVE1MLVRhZ3MgdmlhIGN1c3RvbUVsZW1lbnQuZGVmaW5lXHJcbiAgICogYW5kIHRvIHRoZSBkYXRhIHR5cGVzIGFuZCBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV1zIHRoZXkgcmVuZGVyIGFuIGludGVyZmFjZSBmb3IuIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDdXN0b21FbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgcHVibGljIHN0YXRpYyB0YWc6IHN0cmluZztcclxuICAgIHByaXZhdGUgc3RhdGljIG1hcE9iamVjdFRvQ3VzdG9tRWxlbWVudDogTWFwPHN0cmluZywgdHlwZW9mIEN1c3RvbUVsZW1lbnQ+ID0gbmV3IE1hcCgpO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaWRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgaWYgKF9hdHRyaWJ1dGVzKVxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gX2F0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgIGlmIChfYXR0cmlidXRlc1tuYW1lXSAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIF9hdHRyaWJ1dGVzW25hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSBhbiBpZCB0byB1c2UgZm9yIGNoaWxkcmVuIG9mIHRoaXMgZWxlbWVudCwgbmVlZGVkIGUuZy4gZm9yIHN0YW5kYXJkIGludGVyYWN0aW9uIHdpdGggdGhlIGxhYmVsXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgZ2V0IG5leHRJZCgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCLGklwiICsgQ3VzdG9tRWxlbWVudC5pZENvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIG1hcCB0aGUgZ2l2ZW4gZWxlbWVudCB0eXBlIHRvIHRoZSBnaXZlbiB0YWcgYW5kIHRoZSBnaXZlbiB0eXBlIG9mIGRhdGFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlcihfdGFnOiBzdHJpbmcsIF90eXBlQ3VzdG9tRWxlbWVudDogdHlwZW9mIEN1c3RvbUVsZW1lbnQsIF90eXBlT2JqZWN0PzogdHlwZW9mIE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfdGFnLCBfY2xhc3MpO1xyXG4gICAgICBfdHlwZUN1c3RvbUVsZW1lbnQudGFnID0gX3RhZztcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoX3RhZywgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuXHJcbiAgICAgIGlmIChfdHlwZU9iamVjdClcclxuICAgICAgICBDdXN0b21FbGVtZW50Lm1hcChfdHlwZU9iamVjdC5uYW1lLCBfdHlwZUN1c3RvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgdGhlIGVsZW1lbnQgcmVwcmVzZW50aW5nIHRoZSBnaXZlbiBkYXRhIHR5cGUgKGlmIHJlZ2lzdGVyZWQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0KF90eXBlOiBzdHJpbmcpOiB0eXBlb2YgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBzdHJpbmcgfCB0eXBlb2YgQ3VzdG9tRWxlbWVudCB8IEN1c3RvbUVsZW1lbnRDb25zdHJ1Y3RvciA9IEN1c3RvbUVsZW1lbnQubWFwT2JqZWN0VG9DdXN0b21FbGVtZW50LmdldChfdHlwZSk7XHJcbiAgICAgIGlmICh0eXBlb2YgKGVsZW1lbnQpID09IFwic3RyaW5nXCIpXHJcbiAgICAgICAgZWxlbWVudCA9IGN1c3RvbUVsZW1lbnRzLmdldChlbGVtZW50KTtcclxuICAgICAgcmV0dXJuIDx0eXBlb2YgQ3VzdG9tRWxlbWVudD5lbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIG1hcChfdHlwZTogc3RyaW5nLCBfdHlwZUN1c3RvbUVsZW1lbnQ6IHR5cGVvZiBDdXN0b21FbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKFwiTWFwXCIsIF90eXBlLCBfdHlwZUN1c3RvbUVsZW1lbnQubmFtZSk7XHJcbiAgICAgIEN1c3RvbUVsZW1lbnQubWFwT2JqZWN0VG9DdXN0b21FbGVtZW50LnNldChfdHlwZSwgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUga2V5IChuYW1lKSBvZiB0aGUgYXR0cmlidXRlIHRoaXMgZWxlbWVudCByZXByZXNlbnRzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQga2V5KCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIGxhYmVsLWVsZW1lbnQgYXMgY2hpbGQgdG8gdGhpcyBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBlbmRMYWJlbCgpOiBIVE1MTGFiZWxFbGVtZW50IHtcclxuICAgICAgbGV0IHRleHQ6IHN0cmluZyA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICAgIGlmICghdGV4dClcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xyXG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQobGFiZWwpO1xyXG4gICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldExhYmVsKF9sYWJlbDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xyXG4gICAgICBpZiAobGFiZWwpXHJcbiAgICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSBfbGFiZWw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgdXNpbmcgYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogT2JqZWN0KTogdm9pZCB7XHJcbiAgICAgIFJlZmxlY3Quc2V0KHRoaXMsIFwidmFsdWVcIiwgX3ZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogV29ya2Fyb3VuZCByZWNvbm5lY3Rpb24gb2YgY2xvbmUgKi9cclxuICAgIHB1YmxpYyBjbG9uZU5vZGUoX2RlZXA6IGJvb2xlYW4pOiBOb2RlIHtcclxuICAgICAgbGV0IGxhYmVsOiBzdHJpbmcgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgbGV0IGNsb25lOiBDdXN0b21FbGVtZW50ID0gbmV3IHRoaXMuY29uc3RydWN0b3IobGFiZWwgPyB7IGxhYmVsOiBsYWJlbCB9IDogbnVsbCk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2xvbmUpO1xyXG4gICAgICBjbG9uZS5zZXRNdXRhdG9yVmFsdWUodGhpcy5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcbiAgICAgIGZvciAobGV0IGF0dHJpYnV0ZSBvZiB0aGlzLmF0dHJpYnV0ZXMpXHJcbiAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZS5uYW1lLCBhdHRyaWJ1dGUudmFsdWUpO1xyXG4gICAgICByZXR1cm4gY2xvbmU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgaW4gYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TXV0YXRvclZhbHVlKCk6IE9iamVjdDtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIGNoZWNrYm94IHdpdGggYSBsYWJlbCB0byBpdFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50Qm9vbGVhbiBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1ib29sZWFuXCIsIEN1c3RvbUVsZW1lbnRCb29sZWFuLCBCb29sZWFuKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIFRPRE86IGRlbGV0ZSB0YWJpbmRleCBmcm9tIGNoZWNrYm94IGFuZCBnZXQgc3BhY2Uta2V5IG9uIHRoaXNcclxuICAgICAgLy8gdGhpcy50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCI7XHJcbiAgICAgIGlucHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIGlucHV0LmNoZWNrZWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpID09IFwidHJ1ZVwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKS5odG1sRm9yID0gaW5wdXQuaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3ggYXMgYm9vbGVhbiB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikuY2hlY2tlZDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS5jaGVja2VkID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBBIGNvbG9yIHBpY2tlciB3aXRoIGEgbGFiZWwgdG8gaXQgYW5kIGEgc2xpZGVyIGZvciBvcGFjaXR5XHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRDb2xvciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1jb2xvclwiLCBDdXN0b21FbGVtZW50Q29sb3IsIMaSLkNvbG9yKTtcclxuICAgIHB1YmxpYyBjb2xvcjogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IHBpY2tlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgcGlja2VyLnR5cGUgPSBcImNvbG9yXCI7XHJcblxyXG4gICAgICBwaWNrZXIudGFiSW5kZXggPSAwO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHBpY2tlcik7XHJcblxyXG4gICAgICBsZXQgc2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBzbGlkZXIudHlwZSA9IFwicmFuZ2VcIjtcclxuICAgICAgc2xpZGVyLm1pbiA9IFwiMFwiO1xyXG4gICAgICBzbGlkZXIubWF4ID0gXCIxXCI7XHJcbiAgICAgIHNsaWRlci5zdGVwID0gXCIwLjAxXCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcclxuICAgICAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuV0hFRUwsIHRoaXMuaG5kV2hlZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSB2YWx1ZXMgb2YgcGlja2VyIGFuZCBzbGlkZXIgYXMgxpIuTXV0YXRvclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgaGV4OiBzdHJpbmcgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1jb2xvclwiKSkudmFsdWU7XHJcbiAgICAgIGxldCBhbHBoYTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9cmFuZ2VcIikpLnZhbHVlO1xyXG4gICAgICB0aGlzLmNvbG9yLnNldEhleChoZXguc3Vic3RyKDEsIDYpICsgXCJmZlwiKTtcclxuICAgICAgdGhpcy5jb2xvci5hID0gcGFyc2VGbG9hdChhbHBoYSk7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yLmdldE11dGF0b3JGb3JVc2VySW50ZXJmYWNlKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHZhbHVlcyBvZiBjb2xvciBwaWNrZXIgYW5kIHNsaWRlclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbG9yLm11dGF0ZShfdmFsdWUpO1xyXG4gICAgICBsZXQgaGV4OiBzdHJpbmcgPSB0aGlzLmNvbG9yLmdldEhleCgpO1xyXG4gICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1jb2xvclwiKSkudmFsdWUgPSBcIiNcIiArIGhleC5zdWJzdHIoMCwgNik7XHJcbiAgICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPXJhbmdlXCIpKS52YWx1ZSA9IHRoaXMuY29sb3IuYS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5KF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGhuZFdoZWVsKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgc2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50ID0gKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQpO1xyXG4gICAgICBpZiAoc2xpZGVyICE9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfZXZlbnQuZGVsdGFZIC8gMTAwMCk7XHJcbiAgICAgIGxldCBjdXJyZW50VmFsdWU6IG51bWJlciA9IE51bWJlcihzbGlkZXIudmFsdWUpO1xyXG4gICAgICBzbGlkZXIudmFsdWUgPSBTdHJpbmcoY3VycmVudFZhbHVlIC0gX2V2ZW50LmRlbHRhWSAvIDEwMDApO1xyXG4gICAgICBzbGlkZXIuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogUmVwcmVzZW50cyBhIHNpbmdsZSBkaWdpdCBudW1iZXIgdG8gYmUgdXNlZCBpbiBncm91cHMgdG8gcmVwcmVzZW50IGEgbXVsdGlkaWdpdCB2YWx1ZS5cclxuICAgKiBJcyB0YWJiYWJsZSBhbmQgaW4tL2RlY3JlYXNlcyBwcmV2aW91cyBzaWJsaW5nIHdoZW4gZmxvd2luZyBvdmVyL3VuZGVyLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50RGlnaXQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLWRpZ2l0XCIsIEN1c3RvbUVsZW1lbnREaWdpdCk7XHJcbiAgICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB2YWx1ZShfdmFsdWU6IG51bWJlcikge1xyXG4gICAgICBfdmFsdWUgPSBNYXRoLnRydW5jKF92YWx1ZSk7XHJcbiAgICAgIGlmIChfdmFsdWUgPiA5IHx8IF92YWx1ZSA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnRleHRDb250ZW50ID0gX3ZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy50ZXh0Q29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAtMTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIGFkZChfYWRkZW5kOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgX2FkZGVuZCA9IE1hdGgudHJ1bmMoX2FkZGVuZCk7XHJcbiAgICAgIGlmIChfYWRkZW5kID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9hZGRlbmQgPiAwKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPCA5KVxyXG4gICAgICAgICAgdGhpcy52YWx1ZSsrO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHByZXY6IEN1c3RvbUVsZW1lbnREaWdpdCA9IDxDdXN0b21FbGVtZW50RGlnaXQ+dGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKCEocHJldiAmJiBwcmV2IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudERpZ2l0KSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgcHJldi5hZGQoMSk7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPiAwKVxyXG4gICAgICAgICAgdGhpcy52YWx1ZS0tO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHByZXY6IEN1c3RvbUVsZW1lbnREaWdpdCA9IDxDdXN0b21FbGVtZW50RGlnaXQ+dGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKCEocHJldiAmJiBwcmV2IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudERpZ2l0KSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgcHJldi5hZGQoLTEpO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IDk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbUVsZW1lbnQudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgQ3VzdG9tRWxlbWVudCBmcm9tIGFuIEhUTUwtVGVtcGxhdGUtVGFnXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZSBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZnJhZ21lbnQ6IE1hcDxzdHJpbmcsIERvY3VtZW50RnJhZ21lbnQ+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJyb3dzZXMgdGhyb3VnaCB0aGUgdGVtcGxhdGVzIGluIHRoZSBjdXJyZW50IGRvY3VtZW50IGFuZCByZWdpc3RlcnMgdGhlIG9uZSBkZWZpbmluZyB0aGUgZ2l2ZW4gdGFnbmFtZS5cclxuICAgICAqIFRvIGJlIGNhbGxlZCBmcm9tIGEgc2NyaXB0IHRhZyBpbXBsZW1lbnRlZCB3aXRoIHRoZSB0ZW1wbGF0ZSBpbiBIVE1MLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyKF90YWdOYW1lOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgdGVtcGxhdGUgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcInRlbXBsYXRlXCIpKSB7XHJcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQubG9jYWxOYW1lID09IF90YWdOYW1lKSB7XHJcbiAgICAgICAgICDGki5EZWJ1Zy5mdWRnZShcIlJlZ2lzdGVyXCIsIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgICAgQ3VzdG9tRWxlbWVudFRlbXBsYXRlLmZyYWdtZW50LnNldChfdGFnTmFtZSwgdGVtcGxhdGUuY29udGVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIHRoaXMgZWxlbWVudCBpbiBhIGZvcm1hdCBjb21wYXRpYmxlIHdpdGggW1tGdWRnZUNvcmUuTXV0YXRvcl1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0ge307XHJcbiAgICAgIGxldCBlbGVtZW50czogTm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcIltrZXlcIik7XHJcbiAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHtcclxuICAgICAgICBsZXQga2V5OiBzdHJpbmcgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSBlbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihgW2tleT1cIiR7a2V5fVwiXWApO1xyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGBDb3VsZG4ndCBmaW5kICR7a2V5fSBpbmAsIHRoaXMpO1xyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIGVsZW1lbnQuc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yW2tleV0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSBfbXV0YXRvcltrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZSwgdGhlIGVsZW1lbnQgZ2V0cyBjb25zdHJ1Y3RlZCBhcyBhIGRlZXAgY2xvbmUgb2YgdGhlIHRlbXBsYXRlLlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICBsZXQgZnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQgPSBDdXN0b21FbGVtZW50VGVtcGxhdGUuZnJhZ21lbnQuZ2V0KFJlZmxlY3QuZ2V0KHRoaXMuY29uc3RydWN0b3IsIFwidGFnXCIpKTtcclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmZyYWdtZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuICAgICAgbGV0IHN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gdGhpcy5zdHlsZTtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgY29udGVudC5zdHlsZSkge1xyXG4gICAgICAgIHN0eWxlLnNldFByb3BlcnR5KGVudHJ5LCBSZWZsZWN0LmdldChjb250ZW50LnN0eWxlLCBlbnRyeSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNvbnRlbnQuY2hpbGROb2Rlcykge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoY2hpbGQuY2xvbmVOb2RlKHRydWUpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGlmIChsYWJlbClcclxuICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiQ3VzdG9tRWxlbWVudFRlbXBsYXRlLnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50TWF0cml4M3gzIGV4dGVuZHMgQ3VzdG9tRWxlbWVudFRlbXBsYXRlIHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB7IHRyYW5zbGF0aW9uOiB7fSwgc2NhbGluZzoge30sIHJvdGF0aW9uOiAwIH07XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgdmVjdG9yIG9mIFtcInRyYW5zbGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIl0pXHJcbiAgICAgICAgICAoPMaSLk11dGF0b3I+bXV0YXRvclt2ZWN0b3JdKVtkaW1lbnNpb25dID0gc3RlcHBlcnNbY291bnQrK10uZ2V0TXV0YXRvclZhbHVlKCk7XHJcblxyXG4gICAgICBtdXRhdG9yW1wicm90YXRpb25cIl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiXSlcclxuICAgICAgICAgIHN0ZXBwZXJzW2NvdW50KytdLnNldE11dGF0b3JWYWx1ZShOdW1iZXIoKDzGki5NdXRhdG9yPl9tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0pKTtcclxuICAgICAgc3RlcHBlcnNbY291bnQrK10uc2V0TXV0YXRvclZhbHVlKE51bWJlcihfbXV0YXRvcltcInJvdGF0aW9uXCJdKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIk1hdHJpeCBDYWxsYmFja1wiKTtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21FbGVtZW50VGVtcGxhdGUudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRNYXRyaXg0eDQgZXh0ZW5kcyBDdXN0b21FbGVtZW50VGVtcGxhdGUge1xyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogT2JqZWN0IHtcclxuICAgICAgbGV0IHN0ZXBwZXJzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnRTdGVwcGVyPiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLXN0ZXBwZXJcIik7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0geyB0cmFuc2xhdGlvbjoge30sIHJvdGF0aW9uOiB7fSwgc2NhbGluZzoge30gfTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJyb3RhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCIsIFwielwiXSlcclxuICAgICAgICAgICg8xpIuTXV0YXRvcj5tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJyb3RhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCIsIFwielwiXSlcclxuICAgICAgICAgIHN0ZXBwZXJzW2NvdW50KytdLnNldE11dGF0b3JWYWx1ZShOdW1iZXIoKDzGki5NdXRhdG9yPl9tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiTWF0cml4IENhbGxiYWNrXCIpO1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgc3RhbmRhcmQgdGV4dCBpbnB1dCBmaWVsZCB3aXRoIGEgbGFiZWwgdG8gaXQuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRPdXRwdXQgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2Utb3V0cHV0XCIsIEN1c3RvbUVsZW1lbnRPdXRwdXQpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICBsZXQgb3V0cHV0OiBIVE1MT3V0cHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvdXRwdXRcIik7XHJcbiAgICAgIG91dHB1dC5pZCA9IEN1c3RvbUVsZW1lbnQubmV4dElkO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKG91dHB1dCk7XHJcbiAgICAgIHRoaXMuc2V0TXV0YXRvclZhbHVlKHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBjb250ZW50IG9mIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IEZ1ZGdlQ29yZS5HZW5lcmFsKTogdm9pZCB7XHJcbiAgICAgIGxldCBvdXRwdXQ6IEhUTUxPdXRwdXRFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwib3V0cHV0XCIpO1xyXG4gICAgICBvdXRwdXQudmFsdWUgPSBfdmFsdWUgPz8gdGhpcy5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcclxuICAgICAgaWYgKF92YWx1ZSlcclxuICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlaG9sZGVyXCIpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC5hZGQoXCJwbGFjZWhvbGRlclwiKTtcclxuXHJcbiAgICAgIC8vIHRoaXMucXVlcnlTZWxlY3RvcihcIm91dHB1dFwiKS52YWx1ZSA9IF92YWx1ZSA/PyB0aGlzLmdldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgZHJvcGRvd24gbWVudSB0byBkaXNwbGF5IGVudW1zXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRTZWxlY3QgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2Utc2VsZWN0XCIsIEN1c3RvbUVsZW1lbnRTZWxlY3QsIE9iamVjdCk7XHJcbiAgICBwdWJsaWMgY29udGVudDogT2JqZWN0O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMsIF9jb250ZW50OiBPYmplY3QgPSB7fSkge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmICghX2F0dHJpYnV0ZXMubGFiZWwpXHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfYXR0cmlidXRlcy5rZXkpO1xyXG4gICAgICB0aGlzLmNvbnRlbnQgPSBfY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5jb250ZW50KSB7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgPSBSZWZsZWN0LmdldCh0aGlzLmNvbnRlbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKFJlZmxlY3QuaGFzKHRoaXMuY29udGVudCwgdmFsdWUpICYmIFJlZmxlY3QuZ2V0KHRoaXMuY29udGVudCwgdmFsdWUpICE9PSBrZXkpIC8vIGZpbHRlciBudW1iZXIga2V5cyBvdXQgb2Ygc2ltcGxlIGVudW0gXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICBsZXQgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICBlbnRyeS50ZXh0ID0ga2V5O1xyXG4gICAgICAgIGVudHJ5LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgdHlwZW9mIHZhbHVlKTtcclxuICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSk7XHJcbiAgICAgICAgaWYgKGVudHJ5LnZhbHVlID09IHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpIHtcclxuICAgICAgICAgIGVudHJ5LnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZWN0LmFkZChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgc2VsZWN0LnRhYkluZGV4ID0gMDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94IGFzIGJvb2xlYW4gdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBzdHJpbmcgfCBudW1iZXIge1xyXG4gICAgICBsZXQgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKTtcclxuICAgICAgbGV0IHR5cGU6IHN0cmluZyA9IHNlbGVjdC5vcHRpb25zW3NlbGVjdC5zZWxlY3RlZEluZGV4XT8uZ2V0QXR0cmlidXRlKFwidHlwZVwiKSB8fCBcInN0cmluZ1wiO1xyXG4gICAgICByZXR1cm4gdHlwZSA9PSBcIm51bWJlclwiID8gcGFyc2VGbG9hdChzZWxlY3QudmFsdWUpIDogc2VsZWN0LnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwic2VsZWN0XCIpLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgICAvLyB0aGlzLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gaW50ZXJhY3RpdmUgbnVtYmVyIHN0ZXBwZXIgd2l0aCBleHBvbmVudGlhbCBkaXNwbGF5IGFuZCBjb21wbGV4IGhhbmRsaW5nIHVzaW5nIGtleWJvYXJkIGFuZCBtb3VzZVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50U3RlcHBlciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1zdGVwcGVyXCIsIEN1c3RvbUVsZW1lbnRTdGVwcGVyLCBOdW1iZXIpO1xyXG4gICAgcHVibGljIHZhbHVlOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKF9hdHRyaWJ1dGVzICYmIF9hdHRyaWJ1dGVzW1widmFsdWVcIl0pXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHBhcnNlRmxvYXQoX2F0dHJpYnV0ZXNbXCJ2YWx1ZVwiXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC50eXBlID0gXCJudW1iZXJcIjtcclxuICAgICAgaW5wdXQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5JTlBVVCwgKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHsgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyB9KTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChpbnB1dCk7XHJcblxyXG5cclxuICAgICAgbGV0IHNpZ246IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBzaWduLnRleHRDb250ZW50ID0gXCIrXCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2lnbik7XHJcbiAgICAgIGZvciAobGV0IGV4cDogbnVtYmVyID0gMjsgZXhwID4gLTQ7IGV4cC0tKSB7XHJcbiAgICAgICAgbGV0IGRpZ2l0OiBDdXN0b21FbGVtZW50RGlnaXQgPSBuZXcgQ3VzdG9tRWxlbWVudERpZ2l0KCk7XHJcbiAgICAgICAgZGlnaXQuc2V0QXR0cmlidXRlKFwiZXhwXCIsIGV4cC50b1N0cmluZygpKTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGRpZ2l0KTtcclxuICAgICAgICBpZiAoZXhwID09IDApXHJcbiAgICAgICAgICB0aGlzLmlubmVySFRNTCArPSBcIi5cIjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmlubmVySFRNTCArPSBcImVcIjtcclxuXHJcbiAgICAgIGxldCBleHA6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBleHAudGV4dENvbnRlbnQgPSBcIiswXCI7XHJcbiAgICAgIGV4cC50YWJJbmRleCA9IC0xO1xyXG4gICAgICBleHAuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImV4cFwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChleHApO1xyXG5cclxuXHJcbiAgICAgIC8vIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZElucHV0KTtcclxuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5CTFVSLCB0aGlzLmhuZElucHV0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkJMVVIsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULldIRUVMLCB0aGlzLmhuZFdoZWVsKTtcclxuICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZS0vQWN0aXZhdGVzIHRhYmJpbmcgZm9yIHRoZSBpbm5lciBkaWdpdHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFjdGl2YXRlSW5uZXJUYWJzKF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IF9vbiA/IDAgOiAtMTtcclxuXHJcbiAgICAgIGxldCBzcGFuczogTm9kZUxpc3RPZjxIVE1MU3BhbkVsZW1lbnQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcclxuICAgICAgc3BhbnNbMV0udGFiSW5kZXggPSBpbmRleDtcclxuXHJcbiAgICAgIGxldCBkaWdpdHM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudERpZ2l0PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLWRpZ2l0XCIpO1xyXG4gICAgICBmb3IgKGxldCBkaWdpdCBvZiBkaWdpdHMpXHJcbiAgICAgICAgZGlnaXQudGFiSW5kZXggPSBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE9wZW5zL0Nsb3NlcyBhIHN0YW5kYXJkIG51bWJlciBpbnB1dCBmb3IgdHlwaW5nIHRoZSB2YWx1ZSBhdCBvbmNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvcGVuSW5wdXQoX29wZW46IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcbiAgICAgIGlmIChfb3Blbikge1xyXG4gICAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgICAgIGlucHV0LnZhbHVlID0gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdmFsdWUgb2YgdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGl0cyB2YWx1ZSBhbmQgZGlzcGxheXMgaXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBpZiAoX3ZhbHVlID09IHVuZGVmaW5lZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIG1hbnRpc3NhIGFuZCBleHBvbmVudCBzZXBhcmF0ZWx5IGFzIGFuIGFycmF5IG9mIHR3byBtZW1iZXJzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNYW50aXNzYUFuZEV4cG9uZW50KCk6IG51bWJlcltdIHtcclxuICAgICAgbGV0IHByZWM6IHN0cmluZyA9IHRoaXMudmFsdWUudG9FeHBvbmVudGlhbCg2KTtcclxuICAgICAgbGV0IGV4cDogbnVtYmVyID0gcGFyc2VJbnQocHJlYy5zcGxpdChcImVcIilbMV0pO1xyXG4gICAgICBsZXQgZXhwMzogbnVtYmVyID0gTWF0aC50cnVuYyhleHAgLyAzKTtcclxuICAgICAgbGV0IG1hbnRpc3NhOiBudW1iZXIgPSB0aGlzLnZhbHVlIC8gTWF0aC5wb3coMTAsIGV4cDMgKiAzKTtcclxuICAgICAgbWFudGlzc2EgPSBNYXRoLnJvdW5kKG1hbnRpc3NhICogMTAwMCkgLyAxMDAwO1xyXG4gICAgICByZXR1cm4gW21hbnRpc3NhLCBleHAzICogM107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhpcyB2YWx1ZSBhcyBhIHN0cmluZ1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IFttYW50aXNzYSwgZXhwXTogbnVtYmVyW10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuICAgICAgbGV0IHByZWZpeE1hbnRpc3NhOiBzdHJpbmcgPSAobWFudGlzc2EgPCAwKSA/IFwiXCIgOiBcIitcIjtcclxuICAgICAgbGV0IHByZWZpeEV4cDogc3RyaW5nID0gKGV4cCA8IDApID8gXCJcIiA6IFwiK1wiO1xyXG4gICAgICByZXR1cm4gcHJlZml4TWFudGlzc2EgKyBtYW50aXNzYS50b0ZpeGVkKDMpICsgXCJlXCIgKyBwcmVmaXhFeHAgKyBleHA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwbGF5cyB0aGlzIHZhbHVlIGJ5IHNldHRpbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBkaWdpdHMgYW5kIHRoZSBleHBvbmVudFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICAgIGxldCBkaWdpdHM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudERpZ2l0PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLWRpZ2l0XCIpO1xyXG4gICAgICBsZXQgc3BhbnM6IE5vZGVMaXN0T2Y8SFRNTFNwYW5FbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XHJcblxyXG4gICAgICBpZiAoIWlzRmluaXRlKHRoaXMudmFsdWUpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcG9zOiBudW1iZXIgPSAwOyBwb3MgPCBkaWdpdHMubGVuZ3RoOyBwb3MrKykge1xyXG4gICAgICAgICAgbGV0IGRpZ2l0OiBDdXN0b21FbGVtZW50RGlnaXQgPSBkaWdpdHNbNSAtIHBvc107XHJcbiAgICAgICAgICBkaWdpdC5pbm5lckhUTUwgPSBcIiAg4oieICAgXCJbNSAtIHBvc107XHJcbiAgICAgICAgICBzcGFuc1sxXS50ZXh0Q29udGVudCA9IFwiICBcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBsZXQgW21hbnRpc3NhLCBleHBdOiBzdHJpbmdbXSA9IHRoaXMudG9TdHJpbmcoKS5zcGxpdChcImVcIik7XHJcbiAgICAgIHNwYW5zWzBdLnRleHRDb250ZW50ID0gdGhpcy52YWx1ZSA8IDAgPyBcIi1cIiA6IFwiK1wiO1xyXG4gICAgICBzcGFuc1sxXS50ZXh0Q29udGVudCA9IGV4cDtcclxuXHJcbiAgICAgIG1hbnRpc3NhID0gbWFudGlzc2Euc3Vic3RyaW5nKDEpO1xyXG4gICAgICBtYW50aXNzYSA9IG1hbnRpc3NhLnJlcGxhY2UoXCIuXCIsIFwiXCIpO1xyXG4gICAgICBmb3IgKGxldCBwb3M6IG51bWJlciA9IDA7IHBvcyA8IGRpZ2l0cy5sZW5ndGg7IHBvcysrKSB7XHJcbiAgICAgICAgbGV0IGRpZ2l0OiBDdXN0b21FbGVtZW50RGlnaXQgPSBkaWdpdHNbNSAtIHBvc107XHJcbiAgICAgICAgaWYgKHBvcyA8IG1hbnRpc3NhLmxlbmd0aCkge1xyXG4gICAgICAgICAgbGV0IGNoYXI6IHN0cmluZyA9IG1hbnRpc3NhLmNoYXJBdChtYW50aXNzYS5sZW5ndGggLSAxIC0gcG9zKTtcclxuICAgICAgICAgIGRpZ2l0LnRleHRDb250ZW50ID0gY2hhcjtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIGRpZ2l0LmlubmVySFRNTCA9IFwiJm5ic3A7XCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZSBrZXlib2FyZCBpbnB1dCBvbiB0aGlzIGVsZW1lbnQgYW5kIGl0cyBkaWdpdHNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBhY3RpdmU6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICBsZXQgbnVtRW50ZXJlZDogbnVtYmVyID0gX2V2ZW50LmtleS5jaGFyQ29kZUF0KDApIC0gNDg7XHJcblxyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAvLyBpZiBmb2N1cyBpcyBvbiBzdGVwcGVyLCBlbnRlciBpdCBhbmQgZm9jdXMgZGlnaXRcclxuICAgICAgaWYgKGFjdGl2ZSA9PSB0aGlzKSB7XHJcbiAgICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSOlxyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLk5VTVBBRF9FTlRFUjpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5TUEFDRTpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKHRydWUpO1xyXG4gICAgICAgICAgICAoPEhUTUxFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLWRpZ2l0XCIpWzJdKS5mb2N1cygpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5GMjpcclxuICAgICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKG51bUVudGVyZWQgPj0gMCAmJiBudW1FbnRlcmVkIDw9IDkpIHx8IF9ldmVudC5rZXkgPT0gXCItXCIgfHwgX2V2ZW50LmtleSA9PSBcIitcIikge1xyXG4gICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAvLyBfZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaW5wdXQgZmllbGQgb3ZlcmxheSBpcyBhY3RpdmVcclxuICAgICAgaWYgKGFjdGl2ZS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICBpZiAoX2V2ZW50LmtleSA9PSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSIHx8IF9ldmVudC5rZXkgPT0gxpIuS0VZQk9BUkRfQ09ERS5OVU1QQURfRU5URVIgfHwgX2V2ZW50LmtleSA9PSDGki5LRVlCT0FSRF9DT0RFLlRBQlVMQVRPUikge1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IE51bWJlcigoPEhUTUxJbnB1dEVsZW1lbnQ+YWN0aXZlKS52YWx1ZSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICAgIHRoaXMub3BlbklucHV0KGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG51bUVudGVyZWQgPj0gMCAmJiBudW1FbnRlcmVkIDw9IDkpIHtcclxuICAgICAgICBsZXQgZGlmZmVyZW5jZTogbnVtYmVyID0gbnVtRW50ZXJlZCAtIE51bWJlcihhY3RpdmUudGV4dENvbnRlbnQpICogKHRoaXMudmFsdWUgPCAwID8gLTEgOiAxKTtcclxuICAgICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoZGlmZmVyZW5jZSk7XHJcblxyXG4gICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hY3RpdmUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5rZXkgPT0gXCItXCIgfHwgX2V2ZW50LmtleSA9PSBcIitcIikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSAoX2V2ZW50LmtleSA9PSBcIi1cIiA/IC0xIDogMSkgKiBNYXRoLmFicyh0aGlzLnZhbHVlKTtcclxuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5jb2RlICE9IMaSLktFWUJPQVJEX0NPREUuVEFCVUxBVE9SKVxyXG4gICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKC0xKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoKzEpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgKDxIVE1MRWxlbWVudD5hY3RpdmUucHJldmlvdXNFbGVtZW50U2libGluZykuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hY3RpdmUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKG5leHQpXHJcbiAgICAgICAgICAgIG5leHQuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FTlRFUjpcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuTlVNUEFEX0VOVEVSOlxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5GMjpcclxuICAgICAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnMoZmFsc2UpO1xyXG4gICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRXaGVlbCA9IChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGNoYW5nZTogbnVtYmVyID0gX2V2ZW50LmRlbHRhWSA8IDAgPyArMSA6IC0xO1xyXG4gICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoY2hhbmdlKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnB1dCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMub3BlbklucHV0KGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnMoZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGNoYW5nZURpZ2l0Rm9jdXNzZWQoX2Ftb3VudDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGxldCBkaWdpdDogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIGlmIChkaWdpdCA9PSB0aGlzIHx8ICF0aGlzLmNvbnRhaW5zKGRpZ2l0KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfYW1vdW50ID0gTWF0aC5yb3VuZChfYW1vdW50KTtcclxuICAgICAgaWYgKF9hbW91bnQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoZGlnaXQgPT0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiW25hbWU9ZXhwXVwiKSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gdGhpcy52YWx1ZSAqIE1hdGgucG93KDEwLCBfYW1vdW50KTtcclxuICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSwgdGhpcy52YWx1ZSk7XHJcbiAgICAgICAgaWYgKGlzRmluaXRlKHZhbHVlKSlcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTsgXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgZXhwRGlnaXQ6IG51bWJlciA9IHBhcnNlSW50KGRpZ2l0LmdldEF0dHJpYnV0ZShcImV4cFwiKSk7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmUgKG1hbnRpc3NhIG5vdCB1c2VkKVxyXG4gICAgICBsZXQgW21hbnRpc3NhLCBleHBWYWx1ZV06IG51bWJlcltdID0gdGhpcy5nZXRNYW50aXNzYUFuZEV4cG9uZW50KCk7XHJcblxyXG4gICAgICBsZXQgcHJldjogbnVtYmVyID0gdGhpcy52YWx1ZTtcclxuICAgICAgdGhpcy52YWx1ZSArPSBfYW1vdW50ICogTWF0aC5wb3coMTAsIGV4cERpZ2l0ICsgZXhwVmFsdWUpO1xyXG4gICAgICAvLyB3b3JrYXJvdW5kIHByZWNpc2lvbiBwcm9ibGVtcyBvZiBqYXZhc2NyaXB0XHJcbiAgICAgIGlmIChNYXRoLmFicyhwcmV2IC8gdGhpcy52YWx1ZSkgPiAxMDAwKVxyXG4gICAgICAgIHRoaXMudmFsdWUgPSAwO1xyXG5cclxuXHJcbiAgICAgIGxldCBleHBOZXc6IG51bWJlcjtcclxuICAgICAgW21hbnRpc3NhLCBleHBOZXddID0gdGhpcy5nZXRNYW50aXNzYUFuZEV4cG9uZW50KCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKG1hbnRpc3NhKTtcclxuICAgICAgdGhpcy5zaGlmdEZvY3VzKGV4cE5ldyAtIGV4cFZhbHVlKTtcclxuICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaGlmdEZvY3VzKF9uRGlnaXRzOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgbGV0IHNoaWZ0Rm9jdXM6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICBpZiAoX25EaWdpdHMpIHtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgMzsgaSsrKVxyXG4gICAgICAgICAgaWYgKF9uRGlnaXRzID4gMClcclxuICAgICAgICAgICAgc2hpZnRGb2N1cyA9IHNoaWZ0Rm9jdXMubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzaGlmdEZvY3VzID0gc2hpZnRGb2N1cy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG5cclxuICAgICAgICAoPEhUTUxFbGVtZW50PnNoaWZ0Rm9jdXMpLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQSBzdGFuZGFyZCB0ZXh0IGlucHV0IGZpZWxkIHdpdGggYSBsYWJlbCB0byBpdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudFRleHRJbnB1dCBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS10ZXh0aW5wdXRcIiwgQ3VzdG9tRWxlbWVudFRleHRJbnB1dCwgU3RyaW5nKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG4gICAgICBcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC5pZCA9IEN1c3RvbUVsZW1lbnQubmV4dElkO1xyXG4gICAgICBpbnB1dC52YWx1ZSA9IHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBjb250ZW50IG9mIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjb250ZW50IG9mIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWUgPSBfdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgRGV0YWlscyBleHRlbmRzIEhUTUxEZXRhaWxzRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY29udGVudDogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9sZWdlbmQ6IHN0cmluZyA9IFwiXCIsIF90eXBlOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgLy8gVE9ETzogY2hlY2sgaWYgdGhpcyBzaG91bGQgYmUgcmVtb3ZlZCBhZnRlciBjaGFuZ2luZyBhbmltYXRpb24gc3RydWN0dXJlIHRvIGxvb2sgbW9yZSBsaWtlIGEgbXV0YXRvclxyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImtleVwiLCBfbGVnZW5kKTtcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfbGVnZW5kKTtcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIF90eXBlKTtcclxuICAgICAgdGhpcy5vcGVuID0gdHJ1ZTtcclxuICAgICAgbGV0IGxibFN1bW1hcnk6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XHJcbiAgICAgIGxibFN1bW1hcnkudGV4dENvbnRlbnQgPSBfbGVnZW5kO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGxibFN1bW1hcnkpO1xyXG5cclxuICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQpO1xyXG5cclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfTkVYVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19TRVQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVE9HR0xFLCB0aGlzLmhuZFRvZ2dsZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNFeHBhbmRlZCgpOiBib29sZWFuIHtcclxuICAgICAgLy8gcmV0dXJuIHRoaXMuZXhwYW5kZXIuY2hlY2tlZDtcclxuICAgICAgcmV0dXJuIHRoaXMub3BlbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29udGVudChfY29udGVudDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZXBsYWNlQ2hpbGQoX2NvbnRlbnQsIHRoaXMuY29udGVudCk7XHJcbiAgICAgIHRoaXMuY29udGVudCA9IF9jb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBleHBhbmQoX2V4cGFuZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAvLyB0aGlzLmV4cGFuZGVyLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLm9wZW4gPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLmhuZFRvZ2dsZShudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFRvZ2dsZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KHRoaXMuaXNFeHBhbmRlZCA/IEVWRU5ULkVYUEFORCA6IEVWRU5ULkNPTExBUFNFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfTkVYVDpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQudGFiSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfUFJFVklPVVM6XHJcbiAgICAgICAgICBsZXQgcHJldmlvdXM6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChwcmV2aW91cyAmJiBwcmV2aW91cy50YWJJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIGxldCBzZXRzOiBOb2RlTGlzdE9mPEhUTUxEZXRhaWxzRWxlbWVudD4gPSBwcmV2aW91cy5xdWVyeVNlbGVjdG9yQWxsKFwiZGV0YWlsc1wiKTtcclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IHNldHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAoaSlcclxuICAgICAgICAgICAgICBkbyB7IC8vIGZvY3VzIHRoZSBsYXN0IHZpc2libGUgc2V0XHJcbiAgICAgICAgICAgICAgICBzZXRzWy0taV0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICB9IHdoaWxlICghc2V0c1tpXS5vZmZzZXRQYXJlbnQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgcHJldmlvdXMuZm9jdXMoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1NFVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQudGFyZ2V0ICE9IHRoaXMpIHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHBhc3NFdmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAvLyBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5JTlNFUlQ6XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIklOU0VSVCBhdCBEZXRhaWxzXCIpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5JTlNFUlQsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB0aGlzIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgICAgaWYgKCF0aGlzLmlzRXhwYW5kZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgbGV0IG5leHQ6IEhUTUxFbGVtZW50ID0gdGhpcztcclxuICAgICAgICAgIGlmICh0aGlzLmlzRXhwYW5kZWQpXHJcbiAgICAgICAgICAgIG5leHQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJkZXRhaWxzXCIpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgbmV4dCA9IDxIVE1MRWxlbWVudD5uZXh0Lm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgICAgfSB3aGlsZSAobmV4dCAmJiBuZXh0LnRhYkluZGV4ID4gLTEpO1xyXG5cclxuICAgICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAvLyBuZXh0LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlRfVFJFRS5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKGZhbHNlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgbGV0IHByZXZpb3VzOiBIVE1MRWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHByZXZpb3VzID0gPEhUTUxFbGVtZW50PnByZXZpb3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICB9IHdoaWxlIChwcmV2aW91cyAmJiAhKHByZXZpb3VzIGluc3RhbmNlb2YgRGV0YWlscykpO1xyXG5cclxuICAgICAgICAgIGlmIChwcmV2aW91cylcclxuICAgICAgICAgICAgaWYgKCg8RGV0YWlscz5wcmV2aW91cykuaXNFeHBhbmRlZClcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgcHJldmlvdXMuZm9jdXMoKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfU0VULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXBhc3NFdmVudClcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9O1xyXG4gIH1cclxuICAvLyBUT0RPOiB1c2UgQ3VzdG9tRWxlbWVudC5yZWdpc3Rlcj9cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1aS1kZXRhaWxzXCIsIERldGFpbHMsIHsgZXh0ZW5kczogXCJkZXRhaWxzXCIgfSk7XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgRGV0YWlsc0FycmF5IGV4dGVuZHMgRGV0YWlscyB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9sZWdlbmQ6IHN0cmluZykge1xyXG4gICAgICBzdXBlcihfbGVnZW5kLCBcIkFycmF5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb250ZW50KF9jb250ZW50OiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xyXG4gICAgICBzdXBlci5zZXRDb250ZW50KF9jb250ZW50KTtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8SFRNTEVsZW1lbnQ+KSB7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhjaGlsZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvcigpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3JbXSA9IFtdO1xyXG5cclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8Q3VzdG9tRWxlbWVudD4pIHtcclxuICAgICAgICBtdXRhdG9yLnB1c2goY2hpbGQuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkRXZlbnRMaXN0ZW5lcnMoX2NoaWxkOiBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICBfY2hpbGQuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19TVEFSVCwgdGhpcy5obmREcmFnU3RhcnQpO1xyXG4gICAgICBfY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyb3ApO1xyXG4gICAgICBfY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG4gICAgICBfY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXlTcGVjaWFsKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSU5TRVJULCB0aGlzLmhuZEluc2VydCk7XHJcbiAgICAgIF9jaGlsZC50YWJJbmRleCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFycmFuZ2UoX2ZvY3VzOiBudW1iZXIgPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuICAgICAgbGV0IHNlcXVlbmNlOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNvbnRlbnQuY2hpbGRyZW4pIHtcclxuICAgICAgICBzZXF1ZW5jZS5wdXNoKHBhcnNlSW50KGNoaWxkLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5zZXRGb2N1cyhfZm9jdXMpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlJFQVJSQU5HRV9BUlJBWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsga2V5OiB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKSwgc2VxdWVuY2U6IHNlcXVlbmNlIH0gfSkpO1xyXG5cclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNvbnRlbnQuY2hpbGRyZW4gYXMgSFRNTENvbGxlY3Rpb25PZjxDdXN0b21FbGVtZW50Pikge1xyXG4gICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGNvdW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZShcImtleVwiLCBjb3VudC50b1N0cmluZygpKTtcclxuICAgICAgICBpZiAoY2hpbGQuc2V0TGFiZWwpXHJcbiAgICAgICAgICBjaGlsZC5zZXRMYWJlbChjb3VudC50b1N0cmluZygpKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhjaGlsZC50YWJJbmRleCk7XHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5NVVRBVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRGb2N1cyhfZm9jdXM6IG51bWJlciA9IHVuZGVmaW5lZCk6IHZvaWQge1xyXG4gICAgICBpZiAoX2ZvY3VzID09IHVuZGVmaW5lZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF9mb2N1cyA9IE1hdGgubWF4KDAsIE1hdGgubWluKF9mb2N1cywgdGhpcy5jb250ZW50LmNoaWxkcmVuLmxlbmd0aCAtIDEpKTtcclxuICAgICAgbGV0IGNoaWxkOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLmNvbnRlbnQuY2hpbGRyZW5bX2ZvY3VzXTtcclxuICAgICAgY2hpbGQ/LmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnU3RhcnQgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gX2V2ZW50LnByZXZlbnREZWZhdWx0OyBcclxuICAgICAgbGV0IGtleURyYWc6IHN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+X2V2ZW50LmN1cnJlbnRUYXJnZXQpLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiaW5kZXhcIiwga2V5RHJhZyk7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImtleTpcIiArIHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpLCBcImtleVwiKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF9ldmVudC5kYXRhVHJhbnNmZXIuaXRlbXMpIHtcclxuICAgICAgICBsZXQga2V5OiBzdHJpbmc7XHJcbiAgICAgICAgbGV0IGxhYmVsOiBzdHJpbmc7XHJcbiAgICAgICAgW2tleSwgbGFiZWxdID0gaXRlbS50eXBlLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICBpZiAoa2V5ID09IFwia2V5XCIgJiYgbGFiZWwgPT0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpIHtcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImNvcHlcIjtcclxuICAgICAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibGlua1wiO1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2cobGFiZWwgPT0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coX2V2ZW50KTtcclxuICAgICAgbGV0IGRyb3A6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50Pl9ldmVudC5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICBsZXQga2V5RHJvcDogc3RyaW5nID0gZHJvcC5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGxldCBrZXlEcmFnOiBzdHJpbmcgPSBfZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJpbmRleFwiKTtcclxuICAgICAgbGV0IGRyYWc6IEhUTUxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKGBba2V5PVwiJHtrZXlEcmFnfVwiXWApO1xyXG4gICAgICBsZXQgbGFiZWxEcmFnOiBzdHJpbmcgPSBkcmFnLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG5cclxuICAgICAgbGV0IHBvc2l0aW9uOiBJbnNlcnRQb3NpdGlvbiA9IGtleURyYWcgPiBrZXlEcm9wID8gXCJiZWZvcmViZWdpblwiIDogXCJhZnRlcmVuZFwiO1xyXG4gICAgICBpZiAoX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgZHJhZyA9IDxIVE1MRWxlbWVudD5kcmFnLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgZHJhZy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBsYWJlbERyYWcpO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICBkcmFnLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZHJhZyk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBkcm9wLmluc2VydEFkamFjZW50RWxlbWVudChwb3NpdGlvbiwgZHJhZyk7XHJcblxyXG4gICAgICB0aGlzLnJlYXJyYW5nZSgpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKGRyYWcpO1xyXG4gICAgICBkcmFnLmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGhuZEluc2VydCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiaG5kSW5zZXJ0XCIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleVNwZWNpYWwgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldDtcclxuXHJcbiAgICAgIC8vIG9ubHkgd29yayBvbiBpdGVtcyBvZiBsaXN0LCBub3QgdGhlaXIgY2hpbGRyZW5cclxuICAgICAgaWYgKCg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkgIT0gaXRlbSAmJiBfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgZm9jdXM6IG51bWJlciA9IHBhcnNlSW50KGl0ZW0uZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpO1xyXG4gICAgICBsZXQgc2libGluZzogSFRNTEVsZW1lbnQgPSBpdGVtO1xyXG4gICAgICBsZXQgaW5zZXJ0OiBIVE1MRWxlbWVudCA9IGl0ZW07XHJcbiAgICAgIGxldCBwYXNzRXZlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoZm9jdXMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgLy8gY2FzZSDGki5LRVlCT0FSRF9DT0RFLklOU0VSVDpcclxuICAgICAgICAvLyAgIHBhc3NFdmVudCA9IHRydWU7XHJcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcIklOU0VSVCBhdCBEZXRhaWxzQXJyYXlcIik7XHJcbiAgICAgICAgLy8gICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICBpZiAoIV9ldmVudC5hbHRLZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRGb2N1cygtLWZvY3VzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgIGluc2VydCA9IDxIVE1MRWxlbWVudD5pdGVtLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICAgICAgaW5zZXJ0LnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGl0ZW0uZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKGluc2VydCk7XHJcbiAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgc2libGluZyA9IDxIVE1MRWxlbWVudD5pdGVtLnByZXZpb3VzU2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nKVxyXG4gICAgICAgICAgICBzaWJsaW5nLmluc2VydEFkamFjZW50RWxlbWVudChcImJlZm9yZWJlZ2luXCIsIGluc2VydCk7XHJcbiAgICAgICAgICB0aGlzLnJlYXJyYW5nZSgtLWZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuYWx0S2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rm9jdXMoKytmb2N1cyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICBpbnNlcnQgPSA8SFRNTEVsZW1lbnQ+aXRlbS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGluc2VydC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhpbnNlcnQpO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHNpYmxpbmcgPSA8SFRNTEVsZW1lbnQ+aXRlbS5uZXh0U2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nKVxyXG4gICAgICAgICAgICBzaWJsaW5nLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIGluc2VydCk7XHJcbiAgICAgICAgICB0aGlzLnJlYXJyYW5nZSgrK2ZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXBhc3NFdmVudCkge1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVpLWxpc3RcIiwgRGV0YWlsc0FycmF5LCB7IGV4dGVuZHM6IFwiZGV0YWlsc1wiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBTdGF0aWMgY2xhc3MgdG8gZGlzcGxheSBhIG1vZGFsIG9yIG5vbi1tb2RhbCBkaWFsb2cgd2l0aCBhbiBpbnRlcmZhY2UgZm9yIHRoZSBnaXZlbiBtdXRhdG9yLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBEaWFsb2cge1xyXG4gICAgcHVibGljIHN0YXRpYyBkb206IEhUTUxEaWFsb2dFbGVtZW50O1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9tcHQgdGhlIGRpYWxvZyB0byB0aGUgdXNlciB3aXRoIHRoZSBnaXZlbiBoZWFkbGluZSwgY2FsbCB0byBhY3Rpb24gYW5kIGxhYmVscyBmb3IgdGhlIGNhbmNlbC0gYW5kIG9rLWJ1dHRvblxyXG4gICAgICogVXNlIGBhd2FpdGAgb24gY2FsbCwgdG8gY29udGludWUgYWZ0ZXIgdGhlIHVzZXIgaGFzIHByZXNzZWQgb25lIG9mIHRoZSBidXR0b25zLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHByb21wdChfZGF0YTogxpIuTXV0YWJsZSB8IMaSLk11dGF0b3IgfCBPYmplY3QsIF9tb2RhbDogYm9vbGVhbiA9IHRydWUsIF9oZWFkOiBzdHJpbmcgPSBcIkhlYWRsaW5lXCIsIF9jYWxsVG9BY3Rpb246IHN0cmluZyA9IFwiSW5zdHJ1Y3Rpb25cIiwgX29rOiBzdHJpbmcgPSBcIk9LXCIsIF9jYW5jZWw6IHN0cmluZyA9IFwiQ2FuY2VsXCIpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgRGlhbG9nLmRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaWFsb2dcIik7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoRGlhbG9nLmRvbSk7XHJcbiAgICAgIERpYWxvZy5kb20uaW5uZXJIVE1MID0gXCI8aDE+XCIgKyBfaGVhZCArIFwiPC9oMT5cIjtcclxuXHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgICAgaWYgKF9kYXRhIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICBjb250ZW50ID0gR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9kYXRhKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGNvbnRlbnQgPSBHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGF0b3IoX2RhdGEpO1xyXG4gICAgICBjb250ZW50LmlkID0gXCJjb250ZW50XCI7XHJcbiAgICAgIERpYWxvZy5kb20uYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcblxyXG4gICAgICBsZXQgZm9vdGVyOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIik7XHJcbiAgICAgIGZvb3Rlci5pbm5lckhUTUwgPSBcIjxwPlwiICsgX2NhbGxUb0FjdGlvbiArIFwiPC9wPlwiO1xyXG4gICAgICBsZXQgYnRuQ2FuY2VsOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIGJ0bkNhbmNlbC5pbm5lckhUTUwgPSBfY2FuY2VsO1xyXG4gICAgICBpZiAoX2NhbmNlbCAhPSBcIlwiKVxyXG4gICAgICAgIGZvb3Rlci5hcHBlbmRDaGlsZChidG5DYW5jZWwpO1xyXG4gICAgICBsZXQgYnRuT2s6IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnRuT2suaW5uZXJIVE1MID0gX29rO1xyXG4gICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuT2spO1xyXG4gICAgICBEaWFsb2cuZG9tLmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcbiAgICAgIGlmIChfbW9kYWwpXHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgRGlhbG9nLmRvbS5zaG93TW9kYWwoKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIERpYWxvZy5kb20uc2hvdygpO1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChfcmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGxldCBobmRCdXR0b246IChfZXZlbnQ6IEV2ZW50KSA9PiB2b2lkID0gKF9ldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgIGJ0bkNhbmNlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaG5kQnV0dG9uKTtcclxuICAgICAgICAgIGJ0bk9rLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBobmRCdXR0b24pO1xyXG4gICAgICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gYnRuT2spXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgQ29udHJvbGxlci51cGRhdGVNdXRhdG9yKGNvbnRlbnQsIF9kYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoX2UpIHtcclxuICAgICAgICAgICAgICDGki5EZWJ1Zy5pbmZvKF9lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICBEaWFsb2cuZG9tLmNsb3NlKCk7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKERpYWxvZy5kb20pO1xyXG4gICAgICAgICAgX3Jlc29sdmUoX2V2ZW50LnRhcmdldCA9PSBidG5Payk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBidG5DYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DTElDSywgaG5kQnV0dG9uKTtcclxuICAgICAgICBidG5Pay5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNMSUNLLCBobmRCdXR0b24pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiA8c2VsZWN0PjxvcHRpb24+SGFsbG88L29wdGlvbj48L3NlbGVjdD5cclxuICAgKi9cclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBNdWx0aUxldmVsTWVudU1hbmFnZXIge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYnVpbGRGcm9tU2lnbmF0dXJlKF9zaWduYXR1cmU6IHN0cmluZywgX211dGF0b3I/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwge307XHJcbiAgICAgIGxldCBzaWduYXR1cmVMZXZlbHM6IHN0cmluZ1tdID0gX3NpZ25hdHVyZS5zcGxpdChcIi5cIik7XHJcbiAgICAgIGlmIChzaWduYXR1cmVMZXZlbHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGxldCBzdWJTaWduYXR1cmU6IHN0cmluZyA9IHNpZ25hdHVyZUxldmVsc1sxXTtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAyOyBpIDwgc2lnbmF0dXJlTGV2ZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBzdWJTaWduYXR1cmUgPSBzdWJTaWduYXR1cmUgKyBcIi5cIiArIHNpZ25hdHVyZUxldmVsc1tpXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgbXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dID0gdGhpcy5idWlsZEZyb21TaWduYXR1cmUoc3ViU2lnbmF0dXJlLCA8xpIuTXV0YXRvcj5tdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHRoaXMuYnVpbGRGcm9tU2lnbmF0dXJlKHN1YlNpZ25hdHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHNpZ25hdHVyZUxldmVsc1swXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIHRvIGRpc3BsYXkgYSBtb2RhbCB3YXJuaW5nLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBXYXJuaW5nIHtcclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSBhIHdhcm5pbmcgdG8gdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gaGVhZGxpbmUsIHdhcm5pbmcgdGV4dCBhbmQgb2sgYnV0dGVuIHRleHQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzcGxheShfZXJyb3JzOiBzdHJpbmdbXSA9IFtdLCBfaGVhZGxpbmU6IHN0cmluZyA9IFwiSGVhZGxpbmVcIiwgX3dhcm5pbmc6IHN0cmluZyA9IFwiV2FybmluZ1wiLCBfb2s6IHN0cmluZyA9IFwiT0tcIik6IHZvaWQge1xyXG4gICAgICBsZXQgd2FybmluZzogSFRNTERpYWxvZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdhcm5pbmcpO1xyXG4gICAgICB3YXJuaW5nLmlubmVySFRNTCA9IFwiPGgxPlwiICsgX2hlYWRsaW5lICsgXCI8L2gxPlwiO1xyXG5cclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgY29udGVudC5pZCA9IFwiY29udGVudFwiO1xyXG4gICAgICBjb250ZW50LmlubmVyVGV4dCA9IF9lcnJvcnMuam9pbihcIlxcblwiKTtcclxuICAgICAgd2FybmluZy5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuXHJcbiAgICAgIGxldCBmb290ZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvb3RlclwiKTtcclxuICAgICAgZm9vdGVyLmlubmVySFRNTCA9IFwiPHA+XCIgKyBfd2FybmluZyArIFwiPC9wPlwiO1xyXG4gICAgICBsZXQgYnRuT2s6IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnRuT2suaW5uZXJIVE1MID0gX29rO1xyXG4gICAgICBidG5Pay5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHdhcm5pbmcuY2xvc2UoKTtcclxuICAgICAgICB3YXJuaW5nLnJlbW92ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuT2spO1xyXG4gICAgICB3YXJuaW5nLmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICB3YXJuaW5nLnNob3dNb2RhbCgpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgdWwtZWxlbWVudCB0aGF0IGtlZXBzIGEgbGlzdCBvZiB7QGxpbmsgQ3VzdG9tVHJlZUl0ZW19cyB0byByZXByZXNlbnQgYSBicmFuY2ggaW4gYSB0cmVlXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbVRyZWVMaXN0PFQ+IGV4dGVuZHMgSFRNTFVMaXN0RWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY29udHJvbGxlcjogQ3VzdG9tVHJlZUNvbnRyb2xsZXI8VD47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBDdXN0b21UcmVlQ29udHJvbGxlcjxUPiwgX2l0ZW1zOiBDdXN0b21UcmVlSXRlbTxUPltdID0gW10pIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuYWRkSXRlbXMoX2l0ZW1zKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJ0cmVlXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHBhbmRzIHRoZSB0cmVlIGFsb25nIHRoZSBnaXZlbiBwYXRocyB0byBzaG93IHRoZSBvYmplY3RzIHRoZSBwYXRocyBpbmNsdWRlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9wYXRoczogVFtdW10pOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgcGF0aCBvZiBfcGF0aHMpXHJcbiAgICAgICAgdGhpcy5zaG93KHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwYW5kcyB0aGUgdHJlZSBhbG9uZyB0aGUgZ2l2ZW4gcGF0aCB0byBzaG93IHRoZSBvYmplY3RzIHRoZSBwYXRoIGluY2x1ZGVzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvdyhfcGF0aDogVFtdKTogdm9pZCB7XHJcbiAgICAgIGxldCBjdXJyZW50VHJlZTogQ3VzdG9tVHJlZUxpc3Q8VD4gPSB0aGlzO1xyXG5cclxuICAgICAgZm9yIChsZXQgZGF0YSBvZiBfcGF0aCkge1xyXG4gICAgICAgIGxldCBpdGVtOiBDdXN0b21UcmVlSXRlbTxUPiA9IGN1cnJlbnRUcmVlLmZpbmRJdGVtKGRhdGEpO1xyXG4gICAgICAgIGlmICghaXRlbSlcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGl0ZW0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgICBjdXJyZW50VHJlZSA9IGl0ZW0uZ2V0QnJhbmNoKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3RydWN0dXJlcyB0aGUgbGlzdCB0byBzeW5jIHdpdGggdGhlIGdpdmVuIGxpc3QuIFxyXG4gICAgICoge0BsaW5rIEN1c3RvbVRyZWVJdGVtfXMgcmVmZXJlbmNpbmcgdGhlIHNhbWUgb2JqZWN0IHJlbWFpbiBpbiB0aGUgbGlzdCwgbmV3IGl0ZW1zIGdldCBhZGRlZCBpbiB0aGUgb3JkZXIgb2YgYXBwZWFyYW5jZSwgb2Jzb2xldGUgb25lcyBhcmUgZGVsZXRlZC5cclxuICAgICAqIEBwYXJhbSBfdHJlZSBBIGxpc3QgdG8gc3luYyB0aGlzIHdpdGhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc3RydWN0dXJlKF90cmVlOiBDdXN0b21UcmVlTGlzdDxUPik6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IEN1c3RvbVRyZWVJdGVtPFQ+W10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBfdHJlZS5nZXRJdGVtcygpKSB7XHJcbiAgICAgICAgbGV0IGZvdW5kOiBDdXN0b21UcmVlSXRlbTxUPiA9IHRoaXMuZmluZEl0ZW0oaXRlbS5kYXRhKTtcclxuICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgIGZvdW5kLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgICAgICBmb3VuZC5oYXNDaGlsZHJlbiA9IGl0ZW0uaGFzQ2hpbGRyZW47XHJcbiAgICAgICAgICBpZiAoIWZvdW5kLmhhc0NoaWxkcmVuKVxyXG4gICAgICAgICAgICBmb3VuZC5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgaXRlbXMucHVzaChmb3VuZCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHRoaXMuYWRkSXRlbXMoaXRlbXMpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24odGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgQ3VzdG9tVHJlZUl0ZW19IG9mIHRoaXMgbGlzdCByZWZlcmVuY2luZyB0aGUgZ2l2ZW4gb2JqZWN0IG9yIG51bGwsIGlmIG5vdCBmb3VuZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZmluZEl0ZW0oX2RhdGE6IFQpOiBDdXN0b21UcmVlSXRlbTxUPiB7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5jaGlsZHJlbilcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscygoPEN1c3RvbVRyZWVJdGVtPFQ+Pml0ZW0pLmRhdGEsIF9kYXRhKSlcclxuICAgICAgICAgIHJldHVybiA8Q3VzdG9tVHJlZUl0ZW08VD4+aXRlbTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4ge0BsaW5rIEN1c3RvbVRyZWVJdGVtfXMgYXQgdGhlIGVuZCBvZiB0aGlzIGxpc3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEl0ZW1zKF9pdGVtczogQ3VzdG9tVHJlZUl0ZW08VD5bXSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF9pdGVtcykge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgb2YgdGhpcyBsaXN0IGFzIGFycmF5IG9mIHtAbGluayBDdXN0b21UcmVlSXRlbX1zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRJdGVtcygpOiBDdXN0b21UcmVlSXRlbTxUPltdIHtcclxuICAgICAgcmV0dXJuIDxDdXN0b21UcmVlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5jaGlsZHJlbikuZmlsdGVyKF9jaGlsZCA9PiBfY2hpbGQgaW5zdGFuY2VvZiBDdXN0b21UcmVlSXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BsYXlTZWxlY3Rpb24oX2RhdGE6IFRbXSk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8Q3VzdG9tVHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSAoX2RhdGEgIT0gbnVsbCAmJiBfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdEludGVydmFsKF9kYXRhU3RhcnQ6IFQsIF9kYXRhRW5kOiBUKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBzZWxlY3Rpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgbGV0IGVuZDogVCA9IG51bGw7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGluZykge1xyXG4gICAgICAgICAgc2VsZWN0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgX2RhdGFTdGFydCkpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhRW5kO1xyXG4gICAgICAgICAgZWxzZSBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscyhpdGVtLmRhdGEsIF9kYXRhRW5kKSlcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFTdGFydDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIGl0ZW0uc2VsZWN0KHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgZW5kKSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZShfZGF0YTogVFtdKTogQ3VzdG9tVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBkZWxldGVkOiBDdXN0b21UcmVlSXRlbTxUPltdID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGlmIChfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSkge1xyXG4gICAgICAgICAgaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBkZWxldGVkLnB1c2goaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZFZpc2libGUoX2RhdGE6IFQpOiBDdXN0b21UcmVlSXRlbTxUPiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoX2RhdGEsIGl0ZW0uZGF0YSkpXHJcbiAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFsbCBleHBhbmRlZCB7QGxpbmsgQ3VzdG9tVHJlZUl0ZW19cyB0aGF0IGFyZSBhIGRlc2NlbmRhbnQgb2YgdGhpcyBsaXN0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RXhwYW5kZWQoKTogQ3VzdG9tVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIHJldHVybiBbLi4udGhpc10uZmlsdGVyKF9pdGVtID0+IF9pdGVtLmV4cGFuZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgKltTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPEN1c3RvbVRyZWVJdGVtPFQ+PiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxDdXN0b21UcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB5aWVsZCBpdGVtc1tpXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHRhcmdldDogVCA9ICg8Q3VzdG9tVHJlZUl0ZW08VD4+dGhpcy5wYXJlbnRFbGVtZW50KS5kYXRhO1xyXG4gICAgICBpZiAodGFyZ2V0ID09IG51bGwgfHwgIXRoaXMuY29udHJvbGxlci5jYW5BZGRDaGlsZHJlbih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcywgdGFyZ2V0KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzKVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5yZW1vdmUoKTtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IHRhcmdldEl0ZW06IEN1c3RvbVRyZWVJdGVtPFQ+ID0gPEN1c3RvbVRyZWVJdGVtPFQ+Pl9ldmVudC5jb21wb3NlZFBhdGgoKS5maW5kKF90YXJnZXQgPT4gX3RhcmdldCBpbnN0YW5jZW9mIEN1c3RvbVRyZWVJdGVtKTtcclxuICAgICAgICBpZiAodGhpcy5nZXRJdGVtcygpLmluY2x1ZGVzKHRhcmdldEl0ZW0pKSB7XHJcbiAgICAgICAgICBsZXQgcmVjdDogRE9NUmVjdCA9IHRhcmdldEl0ZW0uY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgIGxldCBhZGRCZWZvcmU6IGJvb2xlYW4gPSBfZXZlbnQuY2xpZW50WSA8IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgbGV0IHNpYmxpbmc6IEVsZW1lbnQgPSBhZGRCZWZvcmUgPyB0YXJnZXRJdGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgOiB0YXJnZXRJdGVtLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nICE9IHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcilcclxuICAgICAgICAgICAgaWYgKGFkZEJlZm9yZSlcclxuICAgICAgICAgICAgICB0YXJnZXRJdGVtLmJlZm9yZSh0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgdGFyZ2V0SXRlbS5hZnRlcih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLmF0ID0gdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLmlzQ29ubmVjdGVkID9cclxuICAgICAgICBBcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pLmluZGV4T2YodGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKSA6XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLmF0ID0gbnVsbDtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnRhcmdldCA9IHRhcmdldDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1bC1jdXN0b20tdHJlZS1saXN0XCIsIEN1c3RvbVRyZWVMaXN0LCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbVRyZWVMaXN0LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHtAbGluayBDdXN0b21UcmVlTGlzdH0gdGhhdCByZXByZXNlbnRzIHRoZSByb290IG9mIGEgdHJlZSBjb250cm9sICBcclxuICAgKiBgYGB0ZXh0XHJcbiAgICogdHJlZSA8dWw+XHJcbiAgICog4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUgiDilJQgdHJlZUxpc3QgPHVsPlxyXG4gICAqIOKUgiAgIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSCICAg4pSUIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilJQgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21UcmVlPFQ+IGV4dGVuZHMgQ3VzdG9tVHJlZUxpc3Q8VD4ge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogQ3VzdG9tVHJlZUNvbnRyb2xsZXI8VD4sIF9yb290OiBUKSB7XHJcbiAgICAgIHN1cGVyKF9jb250cm9sbGVyLCBbXSk7XHJcbiAgICAgIGxldCByb290OiBDdXN0b21UcmVlSXRlbTxUPiA9IG5ldyBDdXN0b21UcmVlSXRlbTxUPih0aGlzLmNvbnRyb2xsZXIsIF9yb290KTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChyb290KTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FWFBBTkQsIHRoaXMuaG5kRXhwYW5kKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wLCB0cnVlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfTEVBVkUsIHRoaXMuaG5kRHJhZ0xlYXZlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVNDQVBFLCB0aGlzLmhuZEVzY2FwZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DT1BZLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG9iamVjdCBpbiBmb2N1cyBvciBudWxsIGlmIG5vbmUgaXMgZm9jdXNzZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEZvY3Vzc2VkKCk6IFQge1xyXG4gICAgICBsZXQgaXRlbXM6IEN1c3RvbVRyZWVJdGVtPFQ+W10gPSA8Q3VzdG9tVHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IGZvdW5kOiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKDxDdXN0b21UcmVlSXRlbTxUPj5kb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuICAgICAgaWYgKGZvdW5kID4gLTEpXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zW2ZvdW5kXS5kYXRhO1xyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZyZXNoIHRoZSB3aG9sZSB0cmVlIHRvIHN5bmNocm9uaXplIHdpdGggdGhlIGRhdGEgdGhlIHRyZWUgaXMgYmFzZWQgb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzKSB7XHJcbiAgICAgICAgaWYgKCFpdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGxldCBicmFuY2g6IEN1c3RvbVRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2godGhpcy5jb250cm9sbGVyLmdldENoaWxkcmVuKGl0ZW0uZGF0YSkpO1xyXG4gICAgICAgIGl0ZW0uZ2V0QnJhbmNoKCkucmVzdHJ1Y3R1cmUoYnJhbmNoKTtcclxuICAgICAgICBpZiAoIXRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbihpdGVtLmRhdGEpKVxyXG4gICAgICAgICAgaXRlbS5leHBhbmQoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBnaXZlbiBjaGlsZHJlbiB0byB0aGUgZ2l2ZW4gdGFyZ2V0IGF0IHRoZSBnaXZlbiBpbmRleC4gSWYgbm8gaW5kZXggaXMgZ2l2ZW4sIHRoZSBjaGlsZHJlbiBhcmUgYXBwZW5kZWQgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogVFtdLCBfdGFyZ2V0OiBULCBfaW5kZXg/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgLy8gaWYgZHJvcCB0YXJnZXQgaW5jbHVkZWQgaW4gY2hpbGRyZW4gLT4gcmVmdXNlXHJcbiAgICAgIGlmIChfY2hpbGRyZW4uaW5kZXhPZihfdGFyZ2V0KSA+IC0xKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIGFkZCBvbmx5IHRoZSBvYmplY3RzIHRoZSBhZGRDaGlsZHJlbi1tZXRob2Qgb2YgdGhlIGNvbnRyb2xsZXIgcmV0dXJuc1xyXG4gICAgICBsZXQgbW92ZTogVFtdID0gdGhpcy5jb250cm9sbGVyLmFkZENoaWxkcmVuKF9jaGlsZHJlbiwgX3RhcmdldCwgX2luZGV4KTtcclxuICAgICAgaWYgKCFtb3ZlIHx8IG1vdmUubGVuZ3RoID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGZvY3VzOiBUID0gdGhpcy5nZXRGb2N1c3NlZCgpO1xyXG4gICAgICAvLyBUT0RPOiBkb24ndCwgd2hlbiBjb3B5aW5nIG9yIGNvbWluZyBmcm9tIGFub3RoZXIgc291cmNlXHJcbiAgICAgIHRoaXMuZGVsZXRlKG1vdmUpO1xyXG5cclxuICAgICAgbGV0IHRhcmdldERhdGE6IFQgPSA8VD5fdGFyZ2V0O1xyXG4gICAgICBsZXQgdGFyZ2V0SXRlbTogQ3VzdG9tVHJlZUl0ZW08VD4gPSB0aGlzLmZpbmRWaXNpYmxlKHRhcmdldERhdGEpO1xyXG5cclxuICAgICAgbGV0IGJyYW5jaDogQ3VzdG9tVHJlZUxpc3Q8VD4gPSB0aGlzLmNyZWF0ZUJyYW5jaCh0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hpbGRyZW4odGFyZ2V0RGF0YSkpO1xyXG4gICAgICBsZXQgb2xkOiBDdXN0b21UcmVlTGlzdDxUPiA9IHRhcmdldEl0ZW0uZ2V0QnJhbmNoKCk7XHJcbiAgICAgIHRhcmdldEl0ZW0uaGFzQ2hpbGRyZW4gPSB0cnVlO1xyXG4gICAgICBpZiAob2xkKVxyXG4gICAgICAgIG9sZC5yZXN0cnVjdHVyZShicmFuY2gpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGFyZ2V0SXRlbS5leHBhbmQodHJ1ZSk7XHJcblxyXG4gICAgICB0aGlzLmZpbmRWaXNpYmxlKGZvY3VzKT8uZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV4cGFuZChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtOiBDdXN0b21UcmVlSXRlbTxUPiA9IDxDdXN0b21UcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgY2hpbGRyZW46IFRbXSA9IHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpO1xyXG4gICAgICBpZiAoIWNoaWxkcmVuIHx8IGNoaWxkcmVuLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IEN1c3RvbVRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2goY2hpbGRyZW4pO1xyXG4gICAgICBpdGVtLnNldEJyYW5jaChicmFuY2gpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24odGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVCcmFuY2goX2RhdGE6IFRbXSk6IEN1c3RvbVRyZWVMaXN0PFQ+IHtcclxuICAgICAgbGV0IGJyYW5jaDogQ3VzdG9tVHJlZUxpc3Q8VD4gPSBuZXcgQ3VzdG9tVHJlZUxpc3Q8VD4odGhpcy5jb250cm9sbGVyLCBbXSk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIF9kYXRhKSB7XHJcbiAgICAgICAgYnJhbmNoLmFkZEl0ZW1zKFtuZXcgQ3VzdG9tVHJlZUl0ZW0odGhpcy5jb250cm9sbGVyLCBjaGlsZCldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYnJhbmNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGxiYWNrIC8gRXZlbnRoYW5kbGVyIGluIFRyZWVcclxuICAgIHByaXZhdGUgaG5kU2VsZWN0KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgZGV0YWlsOiB7IGRhdGE6IE9iamVjdDsgaW50ZXJ2YWw6IGJvb2xlYW47IGFkZGl0aXZlOiBib29sZWFuIH0gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsO1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uaW5kZXhPZig8VD5kZXRhaWwuZGF0YSk7XHJcblxyXG4gICAgICBpZiAoZGV0YWlsLmludGVydmFsKSB7XHJcbiAgICAgICAgbGV0IGRhdGFTdGFydDogVCA9IDxUPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25bMF07XHJcbiAgICAgICAgbGV0IGRhdGFFbmQ6IFQgPSA8VD5kZXRhaWwuZGF0YTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RJbnRlcnZhbChkYXRhU3RhcnQsIGRhdGFFbmQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGluZGV4ID49IDAgJiYgZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKCFkZXRhaWwuYWRkaXRpdmUpXHJcbiAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5wdXNoKDxUPmRldGFpbC5kYXRhKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcm9wKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCB7XHJcbiAgICAgIHRoaXMuYWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMsIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQsIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5hdCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzID0gW107XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5yZW1vdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnTGVhdmUgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHJlbGF0ZWRUYXJnZXQ6IEV2ZW50VGFyZ2V0ID0gX2V2ZW50LnJlbGF0ZWRUYXJnZXQ7XHJcbiAgICAgIGlmIChyZWxhdGVkVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgIXRoaXMuY29udGFpbnMocmVsYXRlZFRhcmdldCkgJiYgIXRoaXMuY29udGFpbnMocmVsYXRlZFRhcmdldC5vZmZzZXRQYXJlbnQpKSAvLyBvZmZzZXQgcGFyZW50IGlzIGZvciB3ZWlyZCAoaW52aXNpYmxlKSBkaXZzIHdoaWNoIGFyZSBwbGFjZWQgb3ZlciBpbnB1dCBlbGVtZW50cyBhbmQgdHJpZ2dlciBsZWF2ZSBldmVudHMuLi4gXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERlbGV0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEN1c3RvbVRyZWVJdGVtPFQ+ID0gPEN1c3RvbVRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHJlbW92ZTogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbdGFyZ2V0LmRhdGFdKTtcclxuICAgICAgdGhpcy5kZWxldGUocmVtb3ZlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFc2NhcGUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ29weVBhc3RlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgLy8gY29uc29sZS5sb2coX2V2ZW50KTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBDdXN0b21UcmVlSXRlbTxUPiA9IDxDdXN0b21UcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5DT1BZOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuUEFTVEU6XHJcbiAgICAgICAgICB0aGlzLmFkZENoaWxkcmVuKHRoaXMuY29udHJvbGxlci5jb3B5UGFzdGUuc291cmNlcywgdGFyZ2V0LmRhdGEpO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkodGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgICAgICAgIGxldCBjdXQ6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZShjdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IEN1c3RvbVRyZWVJdGVtPFQ+W10gPSA8Q3VzdG9tVHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IHRhcmdldDogQ3VzdG9tVHJlZUl0ZW08VD4gPSA8Q3VzdG9tVHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8Q3VzdG9tVHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVsLWN1c3RvbS10cmVlXCIsIDxDdXN0b21FbGVtZW50Q29uc3RydWN0b3I+PHVua25vd24+Q3VzdG9tVHJlZSwgeyBleHRlbmRzOiBcInVsXCIgfSk7XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogU3ViY2xhc3MgdGhpcyB0byBjcmVhdGUgYSBicm9rZXIgYmV0d2VlbiB5b3VyIGRhdGEgYW5kIGEge0BsaW5rIEN1c3RvbVRyZWV9IHRvIGRpc3BsYXkgYW5kIG1hbmlwdWxhdGUgaXQuXHJcbiAgICogVGhlIHtAbGluayBDdXN0b21UcmVlfSBkb2Vzbid0IGtub3cgaG93IHlvdXIgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFuZCBob3cgdG8gaGFuZGxlIGl0LCB0aGUgY29udHJvbGxlciBpbXBsZW1lbnRzIHRoZSBtZXRob2RzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDdXN0b21UcmVlQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gc2VsZWN0ZWQgb2JqZWN0cy4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgc2VsZWN0aW9uIHNob3VsZCBhbHNvIG9wZXJhdGUgb3V0c2lkZSBvZiB0cmVlICovXHJcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBUW10gPSBbXTtcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGJlaW5nIGRyYWdnZWQsIGFuZCBvYmplY3RzIHRvIGRyb3Agb24uIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIGRyYWcmZHJvcCBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRyZWUgKi9cclxuICAgIHB1YmxpYyBkcmFnRHJvcDogeyBzb3VyY2VzOiBUW107IHRhcmdldDogVDsgYXQ/OiBudW1iZXIgfSA9IHsgc291cmNlczogW10sIHRhcmdldDogbnVsbCB9O1xyXG4gICAgLyoqIFN0b3JlcyByZWZlcmVuY2VzIHRvIG9iamVjdHMgYmVpbmcgY29waWVkIG9yIGN1dCwgYW5kIG9iamVjdHMgdG8gcGFzdGUgdG8uIE92ZXJyaWRlIHdpdGggcmVmZXJlbmNlcyBpbiBvdXRlciBzY29wZSwgaWYgY29weSZwYXN0ZSBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRyZWUgKi9cclxuICAgIHB1YmxpYyBjb3B5UGFzdGU6IHsgc291cmNlczogVFtdOyB0YXJnZXQ6IFQgfSA9IHsgc291cmNlczogW10sIHRhcmdldDogbnVsbCB9O1xyXG5cclxuICAgIC8qKiBVc2VkIGJ5IHRoZSB0cmVlIHRvIGluZGljYXRlIHRoZSBkcm9wIHBvc2l0aW9uIHdoaWxlIGRyYWdnaW5nICovXHJcbiAgICBwdWJsaWMgZHJhZ0Ryb3BJbmRpY2F0b3I6IEhUTUxIUkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPdmVycmlkZSBpZiBzb21lIG9iamVjdHMgc2hvdWxkIG5vdCBiZSBkcmFnZ2FibGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRyYWdnYWJsZShfb2JqZWN0OiBUKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIHR3byBvYmplY3RzIG9mIGFyZSBlcXVhbC4gRGVmYXVsdCBpcyBfYSA9PSBfYi4gT3ZlcnJpZGUgZm9yIG1vcmUgY29tcGxleCBjb21wYXJpc29ucy4gXHJcbiAgICAgKiBVc2VmdWwgd2hlbiB0aGUgdW5kZXJseWluZyBkYXRhIGlzIHZvbGF0aWxlIGFuZCBjaGFuZ2VzIGlkZW50aXR5IHdoaWxlIHN0YXlpbmcgdGhlIHNhbWUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlcXVhbHMoX2E6IFQsIF9iOiBUKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBfYSA9PSBfYjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE92ZXJyaWRlIGlmIHNvbWUgb2JqZWN0cyBzaG91bGQgbm90IGJlIGFkZGFibGUgdG8gb3RoZXJzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjYW5BZGRDaGlsZHJlbihfc291cmNlczogVFtdLCBfdGFyZ2V0OiBUKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBDcmVhdGUgYW4gSFRNTEVsZW1lbnQgZm9yIHRoZSB0cmVlIGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QuIGUuZy4gYW4gSFRNTElucHV0RWxlbWVudCAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNyZWF0ZUNvbnRlbnQoX29iamVjdDogVCk6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8qKiBSZXRyaWV2ZSBhIHNwYWNlIHNlcGFyYXRlZCBzdHJpbmcgb2YgYXR0cmlidXRlcyB0byBhZGQgdG8gdGhlIGxpc3QgaXRlbSByZXByZXNlbnRpbmcgdGhlIG9iamVjdCBmb3IgZnVydGhlciBzdHlsaW5nICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldEF0dHJpYnV0ZXMoX29iamVjdDogVCk6IHN0cmluZztcclxuXHJcbiAgICAvKiogUHJvY2VzcyB0aGUgcHJvcG9zZWQgbmV3IHZhbHVlLiBUaGUgaWQgb2YgdGhlIGh0bWwgZWxlbWVudCBvbiB3aGljaCB0aGUgY2hhbmdlIG9jY3VyZWQgaXMgcGFzc2VkICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc2V0VmFsdWUoX29iamVjdDogVCwgX2VsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCk6IFByb21pc2U8Ym9vbGVhbj47XHJcblxyXG4gICAgLyoqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgaGFzIGNoaWxkcmVuIHRoYXQgbXVzdCBiZSBzaG93biB3aGVuIHVuZm9sZGluZyB0aGUgdHJlZSBpdGVtICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaGFzQ2hpbGRyZW4oX29iamVjdDogVCk6IGJvb2xlYW47XHJcblxyXG4gICAgLyoqIFJldHVybiB0aGUgb2JqZWN0J3MgY2hpbGRyZW4gdG8gc2hvdyB3aGVuIHVuZm9sZGluZyB0aGUgdHJlZSBpdGVtICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0Q2hpbGRyZW4oX29iamVjdDogVCk6IFRbXTtcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBQcm9jZXNzIHRoZSBsaXN0IG9mIHNvdXJjZSBvYmplY3RzIHRvIGJlIGFkZGVkQXNDaGlsZHJlbiB3aGVuIGRyb3BwaW5nIG9yIHBhc3Rpbmcgb250byB0aGUgdGFyZ2V0IGl0ZW0vb2JqZWN0LCBcclxuICAgICAqIHJldHVybiB0aGUgbGlzdCBvZiBvYmplY3RzIHRoYXQgc2hvdWxkIHZpc2libHkgYmVjb21lIHRoZSBjaGlsZHJlbiBvZiB0aGUgdGFyZ2V0IGl0ZW0vb2JqZWN0IFxyXG4gICAgICogQHBhcmFtIF9jaGlsZHJlbiBBIGxpc3Qgb2Ygb2JqZWN0cyB0aGUgdHJlZSB0cmllcyB0byBhZGQgdG8gdGhlIF90YXJnZXRcclxuICAgICAqIEBwYXJhbSBfdGFyZ2V0IFRoZSBvYmplY3QgcmVmZXJlbmNlZCBieSB0aGUgaXRlbSB0aGUgZHJvcCBvY2N1cnMgb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGFkZENoaWxkcmVuKF9zb3VyY2VzOiBUW10sIF90YXJnZXQ6IFQsIF9pbmRleD86IG51bWJlcik6IFRbXTtcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZW1vdmUgdGhlIG9iamVjdHMgdG8gYmUgZGVsZXRlZCwgZS5nLiB0aGUgY3VycmVudCBzZWxlY3Rpb24sIGZyb20gdGhlIGRhdGEgc3RydWN0dXJlIHRoZSB0cmVlIHJlZmVycyB0byBhbmQgXHJcbiAgICAgKiByZXR1cm4gYSBsaXN0IG9mIHRob3NlIG9iamVjdHMgaW4gb3JkZXIgZm9yIHRoZSBhY2NvcmRpbmcge0BsaW5rIEN1c3RvbVRyZWVJdGVtfSB0byBiZSBkZWxldGVkIGFsc28gICBcclxuICAgICAqIEBwYXJhbSBfZXhwZW5kYWJsZXMgVGhlIGV4cGVuZGFibGUgb2JqZWN0cyBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGRlbGV0ZShfZXhwZW5kYWJsZXM6IFRbXSk6IFByb21pc2U8VFtdPjtcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXR1cm4gYSBsaXN0IG9mIGNvcGllcyBvZiB0aGUgb2JqZWN0cyBnaXZlbiBmb3IgY29weSAmIHBhc3RlXHJcbiAgICAgKiBAcGFyYW0gX2ZvY3Vzc2VkIFRoZSBvYmplY3QgY3VycmVudGx5IGhhdmluZyBmb2N1c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgLyogYXN5bmMgKi8gY29weShfb3JpZ2luYWxzOiBUW10pOiBQcm9taXNlPFRbXT47XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIGxpLWVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGFuIG9iamVjdCBpbiBhIHtAbGluayBDdXN0b21UcmVlTGlzdH0gd2l0aCBhIGNoZWNrYm94IGFuZCBhbiBIVE1MRWxlbWVudCBhcyBjb250ZW50LlxyXG4gICAqIEFkZGl0aW9uYWxseSwgbWF5IGhvbGQgYW4gaW5zdGFuY2Ugb2Yge0BsaW5rIEN1c3RvbVRyZWVMaXN0fSBhcyBicmFuY2ggdG8gZGlzcGxheSBjaGlsZHJlbiBvZiB0aGUgY29ycmVzcG9uZGluZyBvYmplY3QuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbVRyZWVJdGVtPFQ+IGV4dGVuZHMgSFRNTExJRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY2xhc3NlczogQ1NTX0NMQVNTW10gPSBbXTtcclxuICAgIHB1YmxpYyBkYXRhOiBUID0gbnVsbDtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBDdXN0b21UcmVlQ29udHJvbGxlcjxUPjtcclxuXHJcbiAgICBwcml2YXRlIGNoZWNrYm94OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgI2NvbnRlbnQ6IEhUTUxGaWVsZFNldEVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBDdXN0b21UcmVlQ29udHJvbGxlcjxUPiwgX2RhdGE6IFQpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgY3NzQ2xhc3Nlc1xyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgICB0aGlzLmhhc0NoaWxkcmVuID0gdGhpcy5jb250cm9sbGVyLmhhc0NoaWxkcmVuKF9kYXRhKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRPVUJMRV9DTElDSywgdGhpcy5obmREYmxDbGljayk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19PVVQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRk9DVVNfTkVYVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9UUkVFLkZPQ1VTX1BSRVZJT1VTLCB0aGlzLmhuZEZvY3VzKTtcclxuXHJcbiAgICAgIHRoaXMuZHJhZ2dhYmxlID0gdGhpcy5jb250cm9sbGVyLmRyYWdnYWJsZShfZGF0YSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdTdGFydCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX0VOVEVSLCB0aGlzLmhuZERyYWcpOyAvLyB0aGlzIHByZXZlbnRzIGN1cnNvciBmcm9tIGZsaWNrZXJpbmdcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlBPSU5URVJfVVAsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlJFTU9WRV9DSElMRCwgdGhpcy5obmRSZW1vdmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlLCB3aGVuIHRoaXMgaXRlbSBoYXMgYSB2aXNpYmxlIGNoZWNrYm94IGluIGZyb250IHRvIGV4cGFuZCB0aGUgc3Vic2VxdWVudCBicmFuY2ggXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNoZWNrYm94LnN0eWxlLnZpc2liaWxpdHkgIT0gXCJoaWRkZW5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3dzIG9yIGhpZGVzIHRoZSBjaGVja2JveCBmb3IgZXhwYW5kaW5nIHRoZSBzdWJzZXF1ZW50IGJyYW5jaFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IGhhc0NoaWxkcmVuKF9oYXM6IGJvb2xlYW4pIHtcclxuICAgICAgdGhpcy5jaGVja2JveC5zdHlsZS52aXNpYmlsaXR5ID0gX2hhcyA/IFwidmlzaWJsZVwiIDogXCJoaWRkZW5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUge0BsaW5rIENTU19DTEFTUy5TRUxFQ1RFRH0gaXMgYXR0YWNoZWQgdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0YWNoZXMgb3IgZGV0YWNoZXMgdGhlIHtAbGluayBDU1NfQ0xBU1MuU0VMRUNURUR9IHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKF9vbjogYm9vbGVhbikge1xyXG4gICAgICBpZiAoX29uKVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBjb250ZW50IHJlcHJlc2VudGluZyB0aGUgYXR0YWNoZWQge0BsaW5rIGRhdGF9XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgY29udGVudCgpOiBIVE1MRmllbGRTZXRFbGVtZW50IHtcclxuICAgICAgcmV0dXJuIHRoaXMuI2NvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhpcyBpdGVtIGlzIGV4cGFuZGVkLCBzaG93aW5nIGl0J3MgY2hpbGRyZW4sIG9yIGNsb3NlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGV4cGFuZGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRCcmFuY2goKSAmJiB0aGlzLmNoZWNrYm94LmNoZWNrZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZnJlc2hBdHRyaWJ1dGVzKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImF0dHJpYnV0ZXNcIiwgdGhpcy5jb250cm9sbGVyLmdldEF0dHJpYnV0ZXModGhpcy5kYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZnJlc2hDb250ZW50KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLiNjb250ZW50LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLmNyZWF0ZUNvbnRlbnQodGhpcy5kYXRhKSk7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJpZXMgdG8gZXhwYW5kaW5nIHRoZSB7QGxpbmsgQ3VzdG9tVHJlZUxpc3R9IG9mIGNoaWxkcmVuLCBieSBkaXNwYXRjaGluZyB7QGxpbmsgRVZFTlQuRVhQQU5EfS5cclxuICAgICAqIFRoZSB1c2VyIG9mIHRoZSB0cmVlIG5lZWRzIHRvIGFkZCBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgdHJlZSBcclxuICAgICAqIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGF0IHtAbGluayBDdXN0b21UcmVlTGlzdH0gYW5kIGFkZCBpdCBhcyBicmFuY2ggdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBleHBhbmQoX2V4cGFuZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICB0aGlzLnJlbW92ZUJyYW5jaCgpO1xyXG5cclxuICAgICAgaWYgKF9leHBhbmQpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FWFBBTkQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcblxyXG4gICAgICB0aGlzLmNoZWNrYm94LmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLmhhc0NoaWxkcmVuID0gdGhpcy5jb250cm9sbGVyLmhhc0NoaWxkcmVuKHRoaXMuZGF0YSk7XHJcbiAgICAgIC8vICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPSdjaGVja2JveCddXCIpKS5jaGVja2VkID0gX2V4cGFuZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBsaXN0IG9mIGFsbCBkYXRhIHJlZmVyZW5jZWQgYnkgdGhlIGl0ZW1zIHN1Y2NlZWRpbmcgdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0VmlzaWJsZURhdGEoKTogVFtdIHtcclxuICAgICAgbGV0IGxpc3Q6IE5vZGVMaXN0T2Y8SFRNTExJRWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IGRhdGE6IFRbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGxpc3QpXHJcbiAgICAgICAgZGF0YS5wdXNoKCg8Q3VzdG9tVHJlZUl0ZW08VD4+aXRlbSkuZGF0YSk7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgYnJhbmNoIG9mIGNoaWxkcmVuIG9mIHRoaXMgaXRlbS4gVGhlIGJyYW5jaCBtdXN0IGJlIGEgcHJldmlvdXNseSBjb21waWxlZCB7QGxpbmsgQ3VzdG9tVHJlZUxpc3R9XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRCcmFuY2goX2JyYW5jaDogQ3VzdG9tVHJlZUxpc3Q8VD4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZW1vdmVCcmFuY2goKTtcclxuICAgICAgaWYgKF9icmFuY2gpXHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChfYnJhbmNoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGJyYW5jaCBvZiBjaGlsZHJlbiBvZiB0aGlzIGl0ZW0uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRCcmFuY2goKTogQ3VzdG9tVHJlZUxpc3Q8VD4ge1xyXG4gICAgICByZXR1cm4gPEN1c3RvbVRyZWVMaXN0PFQ+PnRoaXMucXVlcnlTZWxlY3RvcihcInVsXCIpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BhdGNoZXMgdGhlIHtAbGluayBFVkVOVC5TRUxFQ1R9IGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gX2FkZGl0aXZlIEZvciBtdWx0aXBsZSBzZWxlY3Rpb24gKCtDdHJsKSBcclxuICAgICAqIEBwYXJhbSBfaW50ZXJ2YWwgRm9yIHNlbGVjdGlvbiBvdmVyIGludGVydmFsICgrU2hpZnQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3QoX2FkZGl0aXZlOiBib29sZWFuLCBfaW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhLCBhZGRpdGl2ZTogX2FkZGl0aXZlLCBpbnRlcnZhbDogX2ludGVydmFsIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gZnJvbSB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZW1vdmVCcmFuY2goKTogdm9pZCB7XHJcbiAgICAgIGxldCBjb250ZW50OiBDdXN0b21UcmVlTGlzdDxUPiA9IHRoaXMuZ2V0QnJhbmNoKCk7XHJcbiAgICAgIGlmICghY29udGVudClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuY2hlY2tib3gudHlwZSA9IFwiY2hlY2tib3hcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNoZWNrYm94KTtcclxuICAgICAgdGhpcy4jY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmaWVsZHNldFwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLiNjb250ZW50KTtcclxuICAgICAgdGhpcy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hBdHRyaWJ1dGVzKCk7XHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBGb2N1c0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcylcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKCF0aGlzLiNjb250ZW50LmRpc2FibGVkKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBjb250ZW50OiBDdXN0b21UcmVlTGlzdDxUPiA9IDxDdXN0b21UcmVlTGlzdDxUPj50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICAvLyBUT0RPOiByZXBhaXIgYXJyb3cga2V5IG5hdmlnYXRpb25cclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfUklHSFQ6XHJcbiAgICAgICAgICBpZiAodGhpcy5oYXNDaGlsZHJlbiAmJiAhY29udGVudClcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgaWYgKGNvbnRlbnQpXHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKGZhbHNlKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5GMjpcclxuICAgICAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRoaXMuI2NvbnRlbnQuZWxlbWVudHMuaXRlbSgwKTtcclxuICAgICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgdGhpcy4jY29udGVudC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgZWxlbWVudD8uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5TUEFDRTpcclxuICAgICAgICAgIHRoaXMuc2VsZWN0KF9ldmVudC5jdHJsS2V5LCBfZXZlbnQuc2hpZnRLZXkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVTQzpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuRVNDQVBFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkM6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuQ09QWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5WOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlBBU1RFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlg6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuQ1VULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREYmxDbGljayA9IChfZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzLmNoZWNrYm94KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChfZXZlbnQucGFnZVgsIF9ldmVudC5wYWdlWSk7IC8vIGRpc2FibGVkIGVsZW1lbnRzIGRvbid0IGRpc3BhdGNoIGNsaWNrIGV2ZW50cywgZ2V0IHRoZSBlbGVtZW50IG1hbnVhbGx5XHJcbiAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBlbGVtZW50LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ2hhbmdlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiB0YXJnZXQudHlwZSA9PSBcImNoZWNrYm94XCIpIHtcclxuICAgICAgICB0aGlzLmV4cGFuZCh0YXJnZXQuY2hlY2tlZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgcmVuYW1lZDogYm9vbGVhbiA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5zZXRWYWx1ZSh0aGlzLmRhdGEsIHRhcmdldCk7XHJcblxyXG4gICAgICB0aGlzLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICAgIGlmIChyZW5hbWVkKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEgfSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdzdGFydFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFtdO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZClcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFt0aGlzLmRhdGFdO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpLCAwLCAwKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnRhcmdldCA9IG51bGw7XHJcblxyXG4gICAgICAvLyBtYXJrIGFzIGFscmVhZHkgcHJvY2Vzc2VkIGJ5IHRoaXMgdHJlZSBpdGVtIHRvIGlnbm9yZSBpdCBpbiBmdXJ0aGVyIHByb3BhZ2F0aW9uIHRocm91Z2ggdGhlIHRyZWVcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiZHJhZ3N0YXJ0XCIsIFwiZHJhZ3N0YXJ0XCIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWcgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHJlY3Q6IERPTVJlY3QgPSB0aGlzLiNjb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICBsZXQgdXBwZXI6IG51bWJlciA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgKiAoMSAvIDQpO1xyXG4gICAgICBsZXQgbG93ZXI6IG51bWJlciA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgKiAoMyAvIDQpO1xyXG4gICAgICBsZXQgb2Zmc2V0OiBudW1iZXIgPSBfZXZlbnQuY2xpZW50WTtcclxuICAgICAgaWYgKHRoaXMucGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbVRyZWUgfHwgKG9mZnNldCA+IHVwcGVyICYmIChvZmZzZXQgPCBsb3dlciB8fCB0aGlzLmNoZWNrYm94LmNoZWNrZWQpKSkge1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBpZiAoX2V2ZW50LnR5cGUgPT0gRVZFTlQuRFJBR19PVkVSKVxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuY2FuQWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMsIHRoaXMuZGF0YSkpIHtcclxuICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AuYXQgPSBudWxsO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnRhcmdldCA9IHRoaXMuZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzLmNoZWNrYm94KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUmVtb3ZlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gdGhlIHZpZXdzIG1pZ2h0IG5lZWQgdG8ga25vdyBhYm91dCB0aGlzIGV2ZW50XHJcbiAgICAgIC8vIGlmIChfZXZlbnQuY3VycmVudFRhcmdldCA9PSBfZXZlbnQudGFyZ2V0KVxyXG4gICAgICAvLyAgIHJldHVybjtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLmhhc0NoaWxkcmVuID0gdGhpcy5jb250cm9sbGVyLmhhc0NoaWxkcmVuKHRoaXMuZGF0YSk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwibGktY3VzdG9tLXRyZWUtaXRlbVwiLCA8Q3VzdG9tRWxlbWVudENvbnN0cnVjdG9yPjx1bmtub3duPkN1c3RvbVRyZWVJdGVtLCB7IGV4dGVuZHM6IFwibGlcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvLyBUT0RPOiBkdXBsaWNhdGVkIGNvZGUgaW4gVGFibGUgYW5kIFRyZWUsIG1heSBiZSBvcHRpbWl6ZWQuLi5cclxuXHJcbiAgZXhwb3J0IGludGVyZmFjZSBUQUJMRSB7XHJcbiAgICBsYWJlbDogc3RyaW5nO1xyXG4gICAga2V5OiBzdHJpbmc7XHJcbiAgICBlZGl0YWJsZTogYm9vbGVhbjtcclxuICAgIHNvcnRhYmxlOiBib29sZWFuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFuYWdlcyBhIHNvcnRhYmxlIHRhYmxlIG9mIGRhdGEgZ2l2ZW4gYXMgc2ltcGxlIGFycmF5IG9mIGZsYXQgb2JqZWN0cyAgIFxyXG4gICAqIGBgYHRleHRcclxuICAgKiBLZXkwICBLZXkxIEtleTJcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVGFibGU8VCBleHRlbmRzIE9iamVjdD4gZXh0ZW5kcyBIVE1MVGFibGVFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD47XHJcbiAgICBwdWJsaWMgZGF0YTogVFtdO1xyXG4gICAgcHVibGljIGF0dEljb246IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPiwgX2RhdGE6IFRbXSwgX2F0dEljb24/OiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICB0aGlzLmF0dEljb24gPSBfYXR0SWNvbjtcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInNvcnRhYmxlXCI7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU09SVCwgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRTb3J0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfTkVYVCwgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FU0NBUEUsIHRoaXMuaG5kRXNjYXBlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNPUFksIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNVVCwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUEFTVEUsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgdGFibGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBsZXQgaGVhZDogVEFCTEVbXSA9IHRoaXMuY29udHJvbGxlci5nZXRIZWFkKCk7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSGVhZChoZWFkKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIHRoaXMuZGF0YSkge1xyXG4gICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgZGF0YSwgdGhpcy5hdHRJY29uKTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG9iamVjdCBpbiBmb2N1c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Rm9jdXNzZWQoKTogVCB7XHJcbiAgICAgIGxldCBpdGVtczogVGFibGVJdGVtPFQ+W10gPSA8VGFibGVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSk7XHJcbiAgICAgIGxldCBmb3VuZDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZig8VGFibGVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICBpZiAoZm91bmQgPiAtMSlcclxuICAgICAgICByZXR1cm4gaXRlbXNbZm91bmRdLmRhdGE7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0SW50ZXJ2YWwoX2RhdGFTdGFydDogVCwgX2RhdGFFbmQ6IFQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpO1xyXG4gICAgICBsZXQgc2VsZWN0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGxldCBlbmQ6IFQgPSBudWxsO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgaWYgKCFzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIHNlbGVjdGluZyA9IHRydWU7XHJcbiAgICAgICAgICBpZiAoaXRlbS5kYXRhID09IF9kYXRhU3RhcnQpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhRW5kO1xyXG4gICAgICAgICAgZWxzZSBpZiAoaXRlbS5kYXRhID09IF9kYXRhRW5kKVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YVN0YXJ0O1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGVjdGluZykge1xyXG4gICAgICAgICAgaXRlbS5zZWxlY3QodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgaWYgKGl0ZW0uZGF0YSA9PSBlbmQpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfZGF0YVN0YXJ0LCBfZGF0YUVuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BsYXlTZWxlY3Rpb24oX2RhdGE6IFRbXSk6IHZvaWQge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfZGF0YSk7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpdGVtLnNlbGVjdGVkID0gKF9kYXRhICE9IG51bGwgJiYgX2RhdGEuaW5kZXhPZihpdGVtLmRhdGEpID4gLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlSGVhZChfaGVhZEluZm86IFRBQkxFW10pOiBIVE1MVGFibGVSb3dFbGVtZW50IHtcclxuICAgICAgbGV0IHRyOiBIVE1MVGFibGVSb3dFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBfaGVhZEluZm8pIHtcclxuICAgICAgICBsZXQgdGg6IEhUTUxUYWJsZUNlbGxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRoXCIpO1xyXG4gICAgICAgIHRoLnRleHRDb250ZW50ID0gZW50cnkubGFiZWw7XHJcbiAgICAgICAgdGguc2V0QXR0cmlidXRlKFwia2V5XCIsIGVudHJ5LmtleSk7XHJcblxyXG4gICAgICAgIGlmIChlbnRyeS5zb3J0YWJsZSkge1xyXG4gICAgICAgICAgdGguYXBwZW5kQ2hpbGQodGhpcy5nZXRTb3J0QnV0dG9ucygpKTtcclxuICAgICAgICAgIHRoLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICAgIEVWRU5ULkNIQU5HRSxcclxuICAgICAgICAgICAgKF9ldmVudDogRXZlbnQpID0+IHRoLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNPUlQsIHsgZGV0YWlsOiBfZXZlbnQudGFyZ2V0LCBidWJibGVzOiB0cnVlIH0pKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHIuYXBwZW5kQ2hpbGQodGgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFNvcnRCdXR0b25zKCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IHJlc3VsdDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgZm9yIChsZXQgZGlyZWN0aW9uIG9mIFtcInVwXCIsIFwiZG93blwiXSkge1xyXG4gICAgICAgIGxldCBidXR0b246IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgYnV0dG9uLnR5cGUgPSBcInJhZGlvXCI7XHJcbiAgICAgICAgYnV0dG9uLm5hbWUgPSBcInNvcnRcIjtcclxuICAgICAgICBidXR0b24udmFsdWUgPSBkaXJlY3Rpb247XHJcbiAgICAgICAgcmVzdWx0LmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFNvcnQoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgdmFsdWU6IHN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQuZGV0YWlsKS52YWx1ZTtcclxuICAgICAgbGV0IGtleTogc3RyaW5nID0gKDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGxldCBkaXJlY3Rpb246IG51bWJlciA9ICh2YWx1ZSA9PSBcInVwXCIpID8gMSA6IC0xO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc29ydCh0aGlzLmRhdGEsIGtleSwgZGlyZWN0aW9uKTtcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAvLyAgIC8vIHRoaXMuYWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMsIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogVGFibGVJdGVtPFQ+ID0gPFRhYmxlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBkZWxldGVkOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFt0YXJnZXQuZGF0YV0pO1xyXG4gICAgICBpZiAoZGVsZXRlZC5sZW5ndGgpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgLy8gbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+PlJlZmxlY3QuZ2V0KF9ldmVudCwgXCJpdGVtXCIpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ09QWTpcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jb3B5KHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24sIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHkodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbiwgX2V2ZW50LnR5cGUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5QQVNURTpcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIucGFzdGUoKTtcclxuICAgICAgICAgIGZvciAobGV0IG9iamVjdCBvZiBvYmplY3RzKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgb2JqZWN0LCB0aGlzLmF0dEljb24pO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IFRhYmxlSXRlbTxUPltdID0gPFRhYmxlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIikpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBUYWJsZUl0ZW08VD4gPSA8VGFibGVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGxldCBpbmRleDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZih0YXJnZXQpO1xyXG4gICAgICBpZiAoaW5kZXggPCAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkgJiYgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5sZW5ndGggPT0gMClcclxuICAgICAgICB0YXJnZXQuc2VsZWN0KHRydWUpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfTkVYVDpcclxuICAgICAgICAgIGlmICgrK2luZGV4IDwgaXRlbXMubGVuZ3RoKVxyXG4gICAgICAgICAgICBpdGVtc1tpbmRleF0uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfUFJFVklPVVM6XHJcbiAgICAgICAgICBpZiAoLS1pbmRleCA+PSAwKVxyXG4gICAgICAgICAgICBpdGVtc1tpbmRleF0uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICAoPFRyZWVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLnNlbGVjdCh0cnVlKTtcclxuICAgICAgZWxzZSBpZiAoIV9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ0YWJsZS1zb3J0YWJsZVwiLCBUYWJsZSwgeyBleHRlbmRzOiBcInRhYmxlXCIgfSk7XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogU3ViY2xhc3MgdGhpcyB0byBjcmVhdGUgYSBicm9rZXIgYmV0d2VlbiB5b3VyIGRhdGEgYW5kIGEgW1tUYWJsZV1dIHRvIGRpc3BsYXkgYW5kIG1hbmlwdWxhdGUgaXQuXHJcbiAgICogVGhlIFtbVGFibGVdXSBkb2Vzbid0IGtub3cgaG93IHlvdXIgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFuZCBob3cgdG8gaGFuZGxlIGl0LCB0aGUgY29udHJvbGxlciBpbXBsZW1lbnRzIHRoZSBtZXRob2RzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUYWJsZUNvbnRyb2xsZXI8VD4ge1xyXG4gICAgLyoqIFN0b3JlcyByZWZlcmVuY2VzIHRvIHNlbGVjdGVkIG9iamVjdHMuIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIHNlbGVjdGlvbiBzaG91bGQgYWxzbyBvcGVyYXRlIG91dHNpZGUgb2YgdGFibGUgKi9cclxuICAgIHB1YmxpYyBzZWxlY3Rpb246IFRbXSA9IFtdO1xyXG5cclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGJlaW5nIGRyYWdnZWQsIGFuZCBvYmplY3RzIHRvIGRyb3Agb24uIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIGRyYWcmZHJvcCBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRhYmxlICovXHJcbiAgICBwdWJsaWMgZHJhZ0Ryb3A6IHsgc291cmNlczogVFtdOyB0YXJnZXQ6IFQgfSA9IHsgc291cmNlczogW10sIHRhcmdldDogbnVsbCB9O1xyXG4gICAgLyoqIFN0b3JlcyByZWZlcmVuY2VzIHRvIG9iamVjdHMgYmVpbmcgY29waWVkIG9yIGN1dCwgYW5kIG9iamVjdHMgdG8gcGFzdGUgdG8uIE92ZXJyaWRlIHdpdGggcmVmZXJlbmNlcyBpbiBvdXRlciBzY29wZSwgaWYgY29weSZwYXN0ZSBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRyZWUgKi9cclxuICAgIHB1YmxpYyBjb3B5UGFzdGU6IHsgc291cmNlczogVFtdOyB0YXJnZXQ6IFQgfSA9IHsgc291cmNlczogW10sIHRhcmdldDogbnVsbCB9O1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJlbW92ZSB0aGUgb2JqZWN0cyB0byBiZSBkZWxldGVkLCBlLmcuIHRoZSBjdXJyZW50IHNlbGVjdGlvbiwgZnJvbSB0aGUgZGF0YSBzdHJ1Y3R1cmUgdGhlIHRhYmxlIHJlZmVycyB0byBhbmQgXHJcbiAgICAgKiByZXR1cm4gYSBsaXN0IG9mIHRob3NlIG9iamVjdHMgaW4gb3JkZXIgZm9yIHRoZSBhY2NvcmRpbmcgW1tUYWJsZUl0ZW1zXV0gdG8gYmUgZGVsZXRlZCBhbHNvICAgXHJcbiAgICAgKiBAcGFyYW0gX2V4cGVuZGFibGVzIFRoZSBleHBlbmRhYmxlIG9iamVjdHMgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2V4cGVuZGFibGVzOiBUW10pOiBQcm9taXNlPFRbXT4geyByZXR1cm4gX2V4cGVuZGFibGVzOyB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVmZXIgb2JqZWN0cyB0byB0aGUgY2xpcGJvYXJkIGZvciBjb3B5ICYgcGFzdGUgICBcclxuICAgICAqIEBwYXJhbSBfb2JqZWN0cyBUaGUgb2JqZWN0cyB0byByZWZlclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29weShfb2JqZWN0czogVFtdLCBfb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uKTogdm9pZCB7XHJcbiAgICAgIENsaXBib2FyZC5jb3B5UGFzdGUuc2V0KF9vYmplY3RzLCBudWxsLCBfb3BlcmF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXRyaWV2ZSBvYmplY3RzIGZyb20gdGhlIGNsaXBib2FyZCwgYW5kIHByb2Nlc3MgYW5kIHJldHVybiB0aGVtIHRvIGFkZCB0byB0aGUgdGFibGUgICBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIHBhc3RlKF9jbGFzczogbmV3ICgpID0+IFQgPSBudWxsKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IENsaXBib2FyZC5jb3B5UGFzdGUuZ2V0KF9jbGFzcywgdHJ1ZSk7IC8vIHBvc3NpYmxlIHRvIGZpbHRlciBmb3Igb25seSBvYmplY3RzIG9mIHNwZWNpZmljIHR5cGVcclxuICAgICAgcmV0dXJuIG9iamVjdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFJldHJpZXZlIGEgc3RyaW5nIHRvIGNyZWF0ZSBhIGxhYmVsIGZvciB0aGUgdGFibGUgaXRlbSByZXByZXNlbnRpbmcgdGhlIG9iamVjdCAoYXBwZWFycyBub3QgdG8gYmUgY2FsbGVkIHlldCkgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TGFiZWwoX29iamVjdDogVCk6IHN0cmluZztcclxuXHJcbiAgICAvKiogUmV0dXJuIGZhbHNlIGlmIHJlbmFtaW5nIG9mIG9iamVjdCBpcyBub3QgcG9zc2liaWxlLCBvciB0cnVlIGlmIHRoZSBvYmplY3Qgd2FzIHJlbmFtZWQgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZW5hbWUoX29iamVjdDogVCwgX25ldzogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPjtcclxuXHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGEgbGlzdCBvZiBjbG9uZXMgb2YgdGhlIG9iamVjdHMgZ2l2ZW4gZm9yIGNvcHkgJiBwYXN0ZSBvciBkcmFnICYgZHJvcFxyXG4gICAgICogQHBhcmFtIF9vcmlnaW5hbHMgVGhlIG9iamVjdHMgdG8gY2xvbmVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IC8qIGFzeW5jICovIGNsb25lKF9vcmlnaW5hbHM6IFRbXSk6IFByb21pc2U8VFtdPjtcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXR1cm4gYSBsaXN0IG9mIFRBQkxFLW9iamVjdHMgZGVzY3JpYmluZyB0aGUgaGVhZC10aXRsZXMgYW5kIGFjY29yZGluZyBwcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRIZWFkKCk6IFRBQkxFW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTb3J0IGRhdGEgYnkgZ2l2ZW4ga2V5IGFuZCBkaXJlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNvcnQoX2RhdGE6IFRbXSwgX2tleTogc3RyaW5nLCBfZGlyZWN0aW9uOiBudW1iZXIpOiB2b2lkO1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHRyLWVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGFuIG9iamVjdCBpbiBhIFtbVGFibGVdXVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUYWJsZUl0ZW08VCBleHRlbmRzIE9iamVjdD4gZXh0ZW5kcyBIVE1MVGFibGVSb3dFbGVtZW50IHtcclxuICAgIHB1YmxpYyBkYXRhOiBUID0gbnVsbDtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD4sIF9kYXRhOiBULCBfYXR0SWNvbjogc3RyaW5nKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgLy8gdGhpcy5kaXNwbGF5ID0gdGhpcy5jb250cm9sbGVyLmdldExhYmVsKF9kYXRhKTtcclxuICAgICAgLy8gVE9ETzogaGFuZGxlIGNzc0NsYXNzZXNcclxuICAgICAgdGhpcy5jcmVhdGUodGhpcy5jb250cm9sbGVyLmdldEhlYWQoKSwgX2F0dEljb24pO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFwidGFibGVcIjtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QT0lOVEVSX1VQLCB0aGlzLmhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ09QWSwgdGhpcy5obmRDb3B5UGFzdGUsIHRydWUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUsIHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19TVEFSVCwgdGhpcy5obmREcmFnU3RhcnQpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdPdmVyKTtcclxuXHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5VUERBVEUsIHRoaXMuaG5kVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYXR0YWNoZXMgb3IgZGV0YWNoZXMgdGhlIFtbQ1NTX0NMQVNTLlNFTEVDVEVEXV0gdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWQoX29uOiBib29sZWFuKSB7XHJcbiAgICAgIGlmIChfb24pXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgW1tUUkVFX0NMQVNTRVMuU0VMRUNURURdXSBpcyBhdHRhY2hlZCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIHRoZSBbW0VWRU5ULlNFTEVDVF1dIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gX2FkZGl0aXZlIEZvciBtdWx0aXBsZSBzZWxlY3Rpb24gKCtDdHJsKSBcclxuICAgICAqIEBwYXJhbSBfaW50ZXJ2YWwgRm9yIHNlbGVjdGlvbiBvdmVyIGludGVydmFsICgrU2hpZnQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3QoX2FkZGl0aXZlOiBib29sZWFuLCBfaW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhLCBhZGRpdGl2ZTogX2FkZGl0aXZlLCBpbnRlcnZhbDogX2ludGVydmFsIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoX2ZpbHRlcjogVEFCTEVbXSwgX2F0dEljb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBfZmlsdGVyKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmcgPSA8c3RyaW5nPlJlZmxlY3QuZ2V0KHRoaXMuZGF0YSwgZW50cnkua2V5KTtcclxuICAgICAgICBsZXQgaWNvbjogc3RyaW5nID0gPHN0cmluZz5SZWZsZWN0LmdldCh0aGlzLmRhdGEsIF9hdHRJY29uKTtcclxuICAgICAgICBsZXQgdGQ6IEhUTUxUYWJsZUNlbGxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xyXG4gICAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgaW5wdXQuZGlzYWJsZWQgPSAhZW50cnkuZWRpdGFibGU7XHJcbiAgICAgICAgaW5wdXQucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwia2V5XCIsIGVudHJ5LmtleSk7XHJcblxyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kSW5wdXRFdmVudCk7XHJcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ET1VCTEVfQ0xJQ0ssIHRoaXMuaG5kSW5wdXRFdmVudCk7XHJcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19PVVQsIHRoaXMuaG5kQ2hhbmdlKTtcclxuXHJcbiAgICAgICAgdGQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGQpO1xyXG4gICAgICAgIGlmIChpY29uKVxyXG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJpY29uXCIsIGljb24pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kSW5wdXRFdmVudCA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQgfCBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50ICYmIF9ldmVudC5jb2RlICE9IMaSLktFWUJPQVJEX0NPREUuRjIpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgaW5wdXQucmVhZE9ubHkgPSBmYWxzZTtcclxuICAgICAgaW5wdXQuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICB0YXJnZXQucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAvLyBsZXQga2V5OiBzdHJpbmcgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICAvLyBsZXQgcHJldmlvdXNWYWx1ZTogxpIuR2VuZXJhbCA9IFJlZmxlY3QuZ2V0KHRoaXMuZGF0YSwga2V5KTtcclxuXHJcbiAgICAgIGlmIChhd2FpdCB0aGlzLmNvbnRyb2xsZXIucmVuYW1lKHRoaXMuZGF0YSwgdGFyZ2V0LnZhbHVlKSkge1xyXG4gICAgICAgIC8vIFJlZmxlY3Quc2V0KHRoaXMuZGF0YSwga2V5LCB0YXJnZXQudmFsdWUpOyAvLyB3aHkgc2hvdWxkbid0IHRoZSBjb250cm9sbGVyIGRvIHRoaXM/XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJEaXNwYXRjaCBSZW5hbWVcIik7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlJFTkFNRSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhIH0gfSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybjtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgIT0gdGhpcylcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFOlxyXG4gICAgICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FU0NBUEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IChfZXZlbnQ6IENsaXBib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJpdGVtXCIsIHRoaXMpO1xyXG4gICAgfTtcclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSBbXTtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMgPSBbdGhpcy5kYXRhXTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJhbGxcIjtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0ID0gdGhpcy5kYXRhO1xyXG4gICAgICAvLyBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgIH07XHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICB9O1xyXG4gIH1cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ0YWJsZS1pdGVtXCIsIDxDdXN0b21FbGVtZW50Q29uc3RydWN0b3I+PHVua25vd24+VGFibGVJdGVtLCB7IGV4dGVuZHM6IFwidHJcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvKipcclxuICAqIEV4dGVuc2lvbiBvZiB1bC1lbGVtZW50IHRoYXQga2VlcHMgYSBsaXN0IG9mIFtbVHJlZUl0ZW1dXXMgdG8gcmVwcmVzZW50IGEgYnJhbmNoIGluIGEgdHJlZVxyXG4gICovXHJcbiAgZXhwb3J0IGNsYXNzIFRyZWVMaXN0PFQ+IGV4dGVuZHMgSFRNTFVMaXN0RWxlbWVudCB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9pdGVtczogVHJlZUl0ZW08VD5bXSA9IFtdKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuYWRkSXRlbXMoX2l0ZW1zKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInRyZWVcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4cGFuZHMgdGhlIHRyZWUgYWxvbmcgdGhlIGdpdmVuIHBhdGggdG8gc2hvdyB0aGUgb2JqZWN0cyB0aGUgcGF0aCBpbmNsdWRlc1xyXG4gICAgICogQHBhcmFtIF9wYXRoIEFuIGFycmF5IG9mIG9iamVjdHMgc3RhcnRpbmcgd2l0aCBvbmUgYmVpbmcgY29udGFpbmVkIGluIHRoaXMgdHJlZWxpc3QgYW5kIGZvbGxvd2luZyB0aGUgY29ycmVjdCBoaWVyYXJjaHkgb2Ygc3VjY2Vzc29yc1xyXG4gICAgICogQHBhcmFtIF9mb2N1cyBJZiB0cnVlIChkZWZhdWx0KSB0aGUgbGFzdCBvYmplY3QgZm91bmQgaW4gdGhlIHRyZWUgZ2V0cyB0aGUgZm9jdXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3coX3BhdGg6IFRbXSwgX2ZvY3VzOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICBsZXQgY3VycmVudFRyZWU6IFRyZWVMaXN0PFQ+ID0gdGhpcztcclxuXHJcbiAgICAgIGZvciAobGV0IGRhdGEgb2YgX3BhdGgpIHtcclxuICAgICAgICBsZXQgaXRlbTogVHJlZUl0ZW08VD4gPSBjdXJyZW50VHJlZS5maW5kSXRlbShkYXRhKTtcclxuICAgICAgICBpdGVtLmZvY3VzKCk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQ6IFRyZWVMaXN0PFQ+ID0gaXRlbS5nZXRCcmFuY2goKTtcclxuICAgICAgICBpZiAoIWNvbnRlbnQpIHtcclxuICAgICAgICAgIGl0ZW0uZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgY29udGVudCA9IGl0ZW0uZ2V0QnJhbmNoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRUcmVlID0gY29udGVudDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzdHJ1Y3R1cmVzIHRoZSBsaXN0IHRvIHN5bmMgd2l0aCB0aGUgZ2l2ZW4gbGlzdC4gXHJcbiAgICAgKiBbW1RyZWVJdGVtXV1zIHJlZmVyZW5jaW5nIHRoZSBzYW1lIG9iamVjdCByZW1haW4gaW4gdGhlIGxpc3QsIG5ldyBpdGVtcyBnZXQgYWRkZWQgaW4gdGhlIG9yZGVyIG9mIGFwcGVhcmFuY2UsIG9ic29sZXRlIG9uZXMgYXJlIGRlbGV0ZWQuXHJcbiAgICAgKiBAcGFyYW0gX3RyZWUgQSBsaXN0IHRvIHN5bmMgdGhpcyB3aXRoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXN0cnVjdHVyZShfdHJlZTogVHJlZUxpc3Q8VD4pOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUcmVlSXRlbTxUPltdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgX3RyZWUuZ2V0SXRlbXMoKSkge1xyXG4gICAgICAgIGxldCBmb3VuZDogVHJlZUl0ZW08VD4gPSB0aGlzLmZpbmRJdGVtKGl0ZW0uZGF0YSk7XHJcbiAgICAgICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgICAgICBmb3VuZC5zZXRMYWJlbChpdGVtLmRpc3BsYXkpO1xyXG4gICAgICAgICAgZm91bmQuaGFzQ2hpbGRyZW4gPSBpdGVtLmhhc0NoaWxkcmVuO1xyXG4gICAgICAgICAgaWYgKCFmb3VuZC5oYXNDaGlsZHJlbilcclxuICAgICAgICAgICAgZm91bmQuZXhwYW5kKGZhbHNlKTtcclxuICAgICAgICAgIGl0ZW1zLnB1c2goZm91bmQpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB0aGlzLmFkZEl0ZW1zKGl0ZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIFtbVHJlZUl0ZW1dXSBvZiB0aGlzIGxpc3QgcmVmZXJlbmNpbmcgdGhlIGdpdmVuIG9iamVjdCBvciBudWxsLCBpZiBub3QgZm91bmRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGZpbmRJdGVtKF9kYXRhOiBUKTogVHJlZUl0ZW08VD4ge1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIHRoaXMuY2hpbGRyZW4pXHJcbiAgICAgICAgaWYgKCg8VHJlZUl0ZW08VD4+aXRlbSkuZGF0YSA9PSBfZGF0YSlcclxuICAgICAgICAgIHJldHVybiA8VHJlZUl0ZW08VD4+aXRlbTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4gW1tUcmVlSXRlbV1dcyBhdCB0aGUgZW5kIG9mIHRoaXMgbGlzdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkSXRlbXMoX2l0ZW1zOiBUcmVlSXRlbTxUPltdKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2l0ZW1zKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY29udGVudCBvZiB0aGlzIGxpc3QgYXMgYXJyYXkgb2YgW1tUcmVlSXRlbV1dc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0SXRlbXMoKTogVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIHJldHVybiA8VHJlZUl0ZW08VD5bXT48dW5rbm93bj50aGlzLmNoaWxkcmVuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNwbGF5U2VsZWN0aW9uKF9kYXRhOiBUW10pOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpdGVtLnNlbGVjdGVkID0gKF9kYXRhICE9IG51bGwgJiYgX2RhdGEuaW5kZXhPZihpdGVtLmRhdGEpID4gLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RJbnRlcnZhbChfZGF0YVN0YXJ0OiBULCBfZGF0YUVuZDogVCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgc2VsZWN0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGxldCBlbmQ6IFQgPSBudWxsO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgaWYgKCFzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIHNlbGVjdGluZyA9IHRydWU7XHJcbiAgICAgICAgICBpZiAoaXRlbS5kYXRhID09IF9kYXRhU3RhcnQpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhRW5kO1xyXG4gICAgICAgICAgZWxzZSBpZiAoaXRlbS5kYXRhID09IF9kYXRhRW5kKVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YVN0YXJ0O1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGVjdGluZykge1xyXG4gICAgICAgICAgaXRlbS5zZWxlY3QodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgaWYgKGl0ZW0uZGF0YSA9PSBlbmQpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGUoX2RhdGE6IFRbXSk6IFRyZWVJdGVtPFQ+W10ge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgZGVsZXRlZDogVHJlZUl0ZW08VD5bXSA9IFtdO1xyXG5cclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpZiAoX2RhdGEuaW5kZXhPZihpdGVtLmRhdGEpID4gLTEpIHtcclxuICAgICAgICAgIC8vIGl0ZW0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuVVBEQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBkZWxldGVkLnB1c2goaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZFZpc2libGUoX2RhdGE6IFQpOiBUcmVlSXRlbTxUPiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaWYgKF9kYXRhID09IGl0ZW0uZGF0YSlcclxuICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1bC10cmVlLWxpc3RcIiwgVHJlZUxpc3QsIHsgZXh0ZW5kczogXCJ1bFwiIH0pO1xyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiVHJlZUxpc3QudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGV4cG9ydCBlbnVtIENTU19DTEFTUyB7XHJcbiAgICBTRUxFQ1RFRCA9IFwic2VsZWN0ZWRcIixcclxuICAgIElOQUNUSVZFID0gXCJpbmFjdGl2ZVwiXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgW1tUcmVlTGlzdF1dIHRoYXQgcmVwcmVzZW50cyB0aGUgcm9vdCBvZiBhIHRyZWUgY29udHJvbCAgXHJcbiAgICogYGBgdGV4dFxyXG4gICAqIHRyZWUgPHVsPlxyXG4gICAqIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilIIg4pSUIHRyZWVMaXN0IDx1bD5cclxuICAgKiDilIIgICDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUgiAgIOKUlCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSUIHRyZWVJdGVtIDxsaT5cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVHJlZTxUPiBleHRlbmRzIFRyZWVMaXN0PFQ+IHtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUcmVlQ29udHJvbGxlcjxUPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+LCBfcm9vdDogVCkge1xyXG4gICAgICBzdXBlcihbXSk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICBsZXQgcm9vdDogVHJlZUl0ZW08VD4gPSBuZXcgVHJlZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBfcm9vdCk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocm9vdCk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVhQQU5ELCB0aGlzLmhuZEV4cGFuZCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5SRU5BTUUsIHRoaXMuaG5kUmVuYW1lKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wLCB0cnVlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVNDQVBFLCB0aGlzLmhuZEVzY2FwZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DT1BZLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG9iamVjdCBpbiBmb2N1c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Rm9jdXNzZWQoKTogVCB7XHJcbiAgICAgIGxldCBpdGVtczogVHJlZUl0ZW08VD5bXSA9IDxUcmVlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIikpO1xyXG4gICAgICBsZXQgZm91bmQ6IG51bWJlciA9IGl0ZW1zLmluZGV4T2YoPFRyZWVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICBpZiAoZm91bmQgPiAtMSlcclxuICAgICAgICByZXR1cm4gaXRlbXNbZm91bmRdLmRhdGE7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV4cGFuZChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgY2hpbGRyZW46IFRbXSA9IHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpO1xyXG4gICAgICBpZiAoIWNoaWxkcmVuIHx8IGNoaWxkcmVuLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2goY2hpbGRyZW4pO1xyXG4gICAgICBpdGVtLnNldEJyYW5jaChicmFuY2gpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24oPFRbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUJyYW5jaChfZGF0YTogVFtdKTogVHJlZUxpc3Q8VD4ge1xyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IG5ldyBUcmVlTGlzdDxUPihbXSk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIF9kYXRhKSB7XHJcbiAgICAgICAgYnJhbmNoLmFkZEl0ZW1zKFtuZXcgVHJlZUl0ZW0odGhpcy5jb250cm9sbGVyLCBjaGlsZCldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYnJhbmNoO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUmVuYW1lKF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pig8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KS5wYXJlbnROb2RlO1xyXG4gICAgICBsZXQgcmVuYW1lZDogYm9vbGVhbiA9IHRoaXMuY29udHJvbGxlci5yZW5hbWUoaXRlbS5kYXRhLCBpdGVtLmdldExhYmVsKCkpO1xyXG4gICAgICBpZiAocmVuYW1lZClcclxuICAgICAgICBpdGVtLnNldExhYmVsKHRoaXMuY29udHJvbGxlci5nZXRMYWJlbChpdGVtLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsYmFjayAvIEV2ZW50aGFuZGxlciBpbiBUcmVlXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudC5kYXRhVHJhbnNmZXIpO1xyXG4gICAgICB0aGlzLmFkZENoaWxkcmVuKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzLCB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogVFtdLCBfdGFyZ2V0OiBUKTogdm9pZCB7XHJcbiAgICAgIC8vIGlmIGRyb3AgdGFyZ2V0IGluY2x1ZGVkIGluIGNoaWxkcmVuIC0+IHJlZnVzZVxyXG4gICAgICBpZiAoX2NoaWxkcmVuLmluZGV4T2YoX3RhcmdldCkgPiAtMSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBhZGQgb25seSB0aGUgb2JqZWN0cyB0aGUgYWRkQ2hpbGRyZW4tbWV0aG9kIG9mIHRoZSBjb250cm9sbGVyIHJldHVybnNcclxuICAgICAgbGV0IG1vdmU6IFRbXSA9IHRoaXMuY29udHJvbGxlci5hZGRDaGlsZHJlbig8VFtdPl9jaGlsZHJlbiwgPFQ+X3RhcmdldCk7XHJcbiAgICAgIGlmICghbW92ZSB8fCBtb3ZlLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIFRPRE86IGRvbid0LCB3aGVuIGNvcHlpbmcgb3IgY29taW5nIGZyb20gYW5vdGhlciBzb3VyY2VcclxuICAgICAgdGhpcy5kZWxldGUobW92ZSk7XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0RGF0YTogVCA9IDxUPl90YXJnZXQ7XHJcbiAgICAgIGxldCB0YXJnZXRJdGVtOiBUcmVlSXRlbTxUPiA9IHRoaXMuZmluZFZpc2libGUodGFyZ2V0RGF0YSk7XHJcblxyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbih0YXJnZXREYXRhKSk7XHJcbiAgICAgIGxldCBvbGQ6IFRyZWVMaXN0PFQ+ID0gdGFyZ2V0SXRlbS5nZXRCcmFuY2goKTtcclxuICAgICAgdGFyZ2V0SXRlbS5oYXNDaGlsZHJlbiA9IHRydWU7XHJcbiAgICAgIGlmIChvbGQpXHJcbiAgICAgICAgb2xkLnJlc3RydWN0dXJlKGJyYW5jaCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0YXJnZXRJdGVtLmV4cGFuZCh0cnVlKTtcclxuXHJcbiAgICAgIF9jaGlsZHJlbiA9IFtdO1xyXG4gICAgICBfdGFyZ2V0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERlbGV0ZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHJlbW92ZTogVFtdID0gdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbdGFyZ2V0LmRhdGFdKTtcclxuXHJcbiAgICAgIHRoaXMuZGVsZXRlKHJlbW92ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ09QWTpcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jb3B5UGFzdGUuc291cmNlcyA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5jb3B5KFsuLi50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULlBBU1RFOlxyXG4gICAgICAgICAgdGhpcy5hZGRDaGlsZHJlbih0aGlzLmNvbnRyb2xsZXIuY29weVBhc3RlLnNvdXJjZXMsIHRhcmdldC5kYXRhKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHlQYXN0ZS5zb3VyY2VzID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmNvcHkoWy4uLnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25dKTtcclxuICAgICAgICAgIGxldCBjdXQ6IFRbXSA9IHRoaXMuY29udHJvbGxlci5kZWxldGUodGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICAgICAgICB0aGlzLmRlbGV0ZShjdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSA8VHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVsLXRyZWVcIiwgPEN1c3RvbUVsZW1lbnRDb25zdHJ1Y3Rvcj48dW5rbm93bj5UcmVlLCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBTdWJjbGFzcyB0aGlzIHRvIGNyZWF0ZSBhIGJyb2tlciBiZXR3ZWVuIHlvdXIgZGF0YSBhbmQgYSBbW1RyZWVdXSB0byBkaXNwbGF5IGFuZCBtYW5pcHVsYXRlIGl0LlxyXG4gICAqIFRoZSBbW1RyZWVdXSBkb2Vzbid0IGtub3cgaG93IHlvdXIgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFuZCBob3cgdG8gaGFuZGxlIGl0LCB0aGUgY29udHJvbGxlciBpbXBsZW1lbnRzIHRoZSBtZXRob2RzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUcmVlQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gc2VsZWN0ZWQgb2JqZWN0cy4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgc2VsZWN0aW9uIHNob3VsZCBhbHNvIG9wZXJhdGUgb3V0c2lkZSBvZiB0cmVlICovXHJcbiAgICBwdWJsaWMgc2VsZWN0aW9uOiBUW10gPSBbXTtcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGJlaW5nIGRyYWdnZWQsIGFuZCBvYmplY3RzIHRvIGRyb3Agb24uIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIGRyYWcmZHJvcCBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRyZWUgKi9cclxuICAgIHB1YmxpYyBkcmFnRHJvcDogeyBzb3VyY2VzOiBUW107IHRhcmdldDogVCB9ID0geyBzb3VyY2VzOiBbXSwgdGFyZ2V0OiBudWxsIH07XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gb2JqZWN0cyBiZWluZyBjb3BpZWQgb3IgY3V0LCBhbmQgb2JqZWN0cyB0byBwYXN0ZSB0by4gT3ZlcnJpZGUgd2l0aCByZWZlcmVuY2VzIGluIG91dGVyIHNjb3BlLCBpZiBjb3B5JnBhc3RlIHNob3VsZCBvcGVyYXRlIG91dHNpZGUgb2YgdHJlZSAqL1xyXG4gICAgcHVibGljIGNvcHlQYXN0ZTogeyBzb3VyY2VzOiBUW107IHRhcmdldDogVCB9ID0geyBzb3VyY2VzOiBbXSwgdGFyZ2V0OiBudWxsIH07XHJcblxyXG4gICAgLyoqIFJldHJpZXZlIGEgc3RyaW5nIHRvIGNyZWF0ZSBhIGxhYmVsIGZvciB0aGUgdHJlZSBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0ICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldExhYmVsKF9vYmplY3Q6IFQpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFJldHJpZXZlIGEgc3BhY2Ugc2VwYXJhdGVkIHN0cmluZyBvZiBhdHRyaWJ1dGVzIHRvIGFkZCB0byB0aGUgbGlzdCBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IGZvciBmdXJ0aGVyIHN0eWxpbmcgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0QXR0cmlidXRlcyhfb2JqZWN0OiBUKTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBSZXR1cm4gZmFsc2UgdG8gZGlzYWxsb3cgcmVuYW1pbmcgdGhlIGl0ZW0vb2JqZWN0LCBvciBwcm9jZXNzZXMgdGhlIHByb3Bvc2VkIG5ldyBsYWJlbCAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHJlbmFtZShfb2JqZWN0OiBULCBfbmV3OiBzdHJpbmcpOiBib29sZWFuO1xyXG5cclxuICAgIC8qKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IGhhcyBjaGlsZHJlbiB0aGF0IG11c3QgYmUgc2hvd24gd2hlbiB1bmZvbGRpbmcgdGhlIHRyZWUgaXRlbSAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGhhc0NoaWxkcmVuKF9vYmplY3Q6IFQpOiBib29sZWFuO1xyXG5cclxuICAgIC8qKiBSZXR1cm4gdGhlIG9iamVjdCdzIGNoaWxkcmVuIHRvIHNob3cgd2hlbiB1bmZvbGRpbmcgdGhlIHRyZWUgaXRlbSAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldENoaWxkcmVuKF9vYmplY3Q6IFQpOiBUW107XHJcbiAgICAvKiogXHJcbiAgICAgKiBQcm9jZXNzIHRoZSBsaXN0IG9mIHNvdXJjZSBvYmplY3RzIHRvIGJlIGFkZGVkQXNDaGlsZHJlbiB3aGVuIGRyb3BwaW5nIG9yIHBhc3Rpbmcgb250byB0aGUgdGFyZ2V0IGl0ZW0vb2JqZWN0LCBcclxuICAgICAqIHJldHVybiB0aGUgbGlzdCBvZiBvYmplY3RzIHRoYXQgc2hvdWxkIHZpc2libHkgYmVjb21lIHRoZSBjaGlsZHJlbiBvZiB0aGUgdGFyZ2V0IGl0ZW0vb2JqZWN0IFxyXG4gICAgICogQHBhcmFtIF9jaGlsZHJlbiBBIGxpc3Qgb2Ygb2JqZWN0cyB0aGUgdHJlZSB0cmllcyB0byBhZGQgdG8gdGhlIF90YXJnZXRcclxuICAgICAqIEBwYXJhbSBfdGFyZ2V0IFRoZSBvYmplY3QgcmVmZXJlbmNlZCBieSB0aGUgaXRlbSB0aGUgZHJvcCBvY2N1cnMgb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGFkZENoaWxkcmVuKF9zb3VyY2VzOiBUW10sIF90YXJnZXQ6IFQpOiBUW107XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVtb3ZlIHRoZSBvYmplY3RzIHRvIGJlIGRlbGV0ZWQsIGUuZy4gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLCBmcm9tIHRoZSBkYXRhIHN0cnVjdHVyZSB0aGUgdHJlZSByZWZlcnMgdG8gYW5kIFxyXG4gICAgICogcmV0dXJuIGEgbGlzdCBvZiB0aG9zZSBvYmplY3RzIGluIG9yZGVyIGZvciB0aGUgYWNjb3JkaW5nIFtbVHJlZUl0ZW1zXV0gdG8gYmUgZGVsZXRlZCBhbHNvICAgXHJcbiAgICAgKiBAcGFyYW0gX2V4cGVuZGFibGVzIFRoZSBleHBlbmRhYmxlIG9iamVjdHMgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZWxldGUoX2V4cGVuZGFibGVzOiBUW10pOiBUW107XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGEgbGlzdCBvZiBjb3BpZXMgb2YgdGhlIG9iamVjdHMgZ2l2ZW4gZm9yIGNvcHkgJiBwYXN0ZVxyXG4gICAgICogQHBhcmFtIF9mb2N1c3NlZCBUaGUgb2JqZWN0IGN1cnJlbnRseSBoYXZpbmcgZm9jdXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IC8qIGFzeW5jICovIGNvcHkoX29yaWdpbmFsczogVFtdKTogUHJvbWlzZTxUW10+O1xyXG5cclxuICAgIC8vIHB1YmxpYyBhYnN0cmFjdCBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgLy8gICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAvLyAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8gICB0aGlzLmRyYWdEcm9wLnRhcmdldCA9ICg8VHJlZUl0ZW08VD4+X2V2ZW50LmN1cnJlbnRUYXJnZXQpLmRhdGE7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKF9ldmVudC5jdXJyZW50VGFyZ2V0KTtcclxuICAgIC8vICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIGxpLWVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGFuIG9iamVjdCBpbiBhIFtbVHJlZUxpc3RdXSB3aXRoIGEgY2hlY2tib3ggYW5kIGEgdGV4dGlucHV0IGFzIGNvbnRlbnQuXHJcbiAgICogQWRkaXRpb25hbGx5LCBtYXkgaG9sZCBhbiBpbnN0YW5jZSBvZiBbW1RyZWVMaXN0XV0gYXMgYnJhbmNoIHRvIGRpc3BsYXkgY2hpbGRyZW4gb2YgdGhlIGNvcnJlc3BvbmRpbmcgb2JqZWN0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlSXRlbTxUPiBleHRlbmRzIEhUTUxMSUVsZW1lbnQge1xyXG4gICAgcHVibGljIGRpc3BsYXk6IHN0cmluZyA9IFwiVHJlZUl0ZW1cIjtcclxuICAgIHB1YmxpYyBjbGFzc2VzOiBDU1NfQ0xBU1NbXSA9IFtdO1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHByaXZhdGUgY2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGxhYmVsOiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD4sIF9kYXRhOiBUKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgdGhpcy5kaXNwbGF5ID0gdGhpcy5jb250cm9sbGVyLmdldExhYmVsKF9kYXRhKTtcclxuICAgICAgLy8gVE9ETzogaGFuZGxlIGNzc0NsYXNzZXNcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IHRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbihfZGF0YSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ET1VCTEVfQ0xJQ0ssIHRoaXMuaG5kRGJsQ2xpY2spO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9UUkVFLkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcblxyXG4gICAgICB0aGlzLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdTdGFydCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlBPSU5URVJfVVAsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlJFTU9WRV9DSElMRCwgdGhpcy5obmRSZW1vdmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlLCB3aGVuIHRoaXMgaXRlbSBoYXMgYSB2aXNpYmxlIGNoZWNrYm94IGluIGZyb250IHRvIGV4cGFuZCB0aGUgc3Vic2VxdWVudCBicmFuY2ggXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNoZWNrYm94LnN0eWxlLnZpc2liaWxpdHkgIT0gXCJoaWRkZW5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3dzIG9yIGhpZGVzIHRoZSBjaGVja2JveCBmb3IgZXhwYW5kaW5nIHRoZSBzdWJzZXF1ZW50IGJyYW5jaFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IGhhc0NoaWxkcmVuKF9oYXM6IGJvb2xlYW4pIHtcclxuICAgICAgdGhpcy5jaGVja2JveC5zdHlsZS52aXNpYmlsaXR5ID0gX2hhcyA/IFwidmlzaWJsZVwiIDogXCJoaWRkZW5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYXR0YWNoZXMgb3IgZGV0YWNoZXMgdGhlIFtbVFJFRV9DTEFTUy5TRUxFQ1RFRF1dIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKF9vbjogYm9vbGVhbikge1xyXG4gICAgICBpZiAoX29uKVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIFtbVFJFRV9DTEFTU0VTLlNFTEVDVEVEXV0gaXMgYXR0YWNoZWQgdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBsYWJlbCB0ZXh0IHRvIHNob3dcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldExhYmVsKF90ZXh0OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5sYWJlbC52YWx1ZSA9IF90ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBsYWJlbCB0ZXh0IHNob3duXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRMYWJlbCgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5sYWJlbC52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgbGFiZWwgdGV4dCBzaG93blxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVmcmVzaEF0dHJpYnV0ZXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiYXR0cmlidXRlc1wiLCB0aGlzLmNvbnRyb2xsZXIuZ2V0QXR0cmlidXRlcyh0aGlzLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaWVzIHRvIGV4cGFuZGluZyB0aGUgW1tUcmVlTGlzdF1dIG9mIGNoaWxkcmVuLCBieSBkaXNwYXRjaGluZyBbW0VWRU5ULkVYUEFORF1dLlxyXG4gICAgICogVGhlIHVzZXIgb2YgdGhlIHRyZWUgbmVlZHMgdG8gYWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSB0cmVlIFxyXG4gICAgICogaW4gb3JkZXIgdG8gY3JlYXRlIHRoYXQgW1tUcmVlTGlzdF1dIGFuZCBhZGQgaXQgYXMgYnJhbmNoIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9leHBhbmQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZW1vdmVCcmFuY2goKTtcclxuXHJcbiAgICAgIGlmIChfZXhwYW5kKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuRVhQQU5ELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG5cclxuICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9J2NoZWNrYm94J11cIikpLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGRhdGEgcmVmZXJlbmNlZCBieSB0aGUgaXRlbXMgc3VjY2VlZGluZyB0aGlzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaXNpYmxlRGF0YSgpOiBUW10ge1xyXG4gICAgICBsZXQgbGlzdDogTm9kZUxpc3RPZjxIVE1MTElFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgZGF0YTogVFtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbGlzdClcclxuICAgICAgICBkYXRhLnB1c2goKDxUcmVlSXRlbTxUPj5pdGVtKS5kYXRhKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLiBUaGUgYnJhbmNoIG11c3QgYmUgYSBwcmV2aW91c2x5IGNvbXBpbGVkIFtbVHJlZUxpc3RdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0QnJhbmNoKF9icmFuY2g6IFRyZWVMaXN0PFQ+KTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQnJhbmNoKCk7XHJcbiAgICAgIGlmIChfYnJhbmNoKVxyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoX2JyYW5jaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0QnJhbmNoKCk6IFRyZWVMaXN0PFQ+IHtcclxuICAgICAgcmV0dXJuIDxUcmVlTGlzdDxUPj50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIHRoZSBbW0VWRU5ULlNFTEVDVF1dIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gX2FkZGl0aXZlIEZvciBtdWx0aXBsZSBzZWxlY3Rpb24gKCtDdHJsKSBcclxuICAgICAqIEBwYXJhbSBfaW50ZXJ2YWwgRm9yIHNlbGVjdGlvbiBvdmVyIGludGVydmFsICgrU2hpZnQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3QoX2FkZGl0aXZlOiBib29sZWFuLCBfaW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhLCBhZGRpdGl2ZTogX2FkZGl0aXZlLCBpbnRlcnZhbDogX2ludGVydmFsIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gZnJvbSB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZW1vdmVCcmFuY2goKTogdm9pZCB7XHJcbiAgICAgIGxldCBjb250ZW50OiBUcmVlTGlzdDxUPiA9IHRoaXMuZ2V0QnJhbmNoKCk7XHJcbiAgICAgIGlmICghY29udGVudClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoY29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuY2hlY2tib3gudHlwZSA9IFwiY2hlY2tib3hcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNoZWNrYm94KTtcclxuXHJcbiAgICAgIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMubGFiZWwudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICB0aGlzLmxhYmVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgdGhpcy5sYWJlbC52YWx1ZSA9IHRoaXMuZGlzcGxheTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcclxuXHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5sYWJlbClcclxuICAgICAgICB0aGlzLmxhYmVsLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKCF0aGlzLmxhYmVsLmRpc2FibGVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgbGV0IGNvbnRlbnQ6IFRyZWVMaXN0PFQ+ID0gPFRyZWVMaXN0PFQ+PnRoaXMucXVlcnlTZWxlY3RvcihcInVsXCIpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICh0aGlzLmhhc0NoaWxkcmVuICYmICFjb250ZW50KVxyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAoY29udGVudClcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgdGhpcy5zdGFydFR5cGluZ0xhYmVsKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVTQ0FQRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5DOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNPUFksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuVjpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5YOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgc3RhcnRUeXBpbmdMYWJlbCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5sYWJlbC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmxhYmVsLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREYmxDbGljayA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgIT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICB0aGlzLnN0YXJ0VHlwaW5nTGFiZWwoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGl0ZW06IEhUTUxMSUVsZW1lbnQgPSA8SFRNTExJRWxlbWVudD50YXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgc3dpdGNoICh0YXJnZXQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgXCJjaGVja2JveFwiOlxyXG4gICAgICAgICAgdGhpcy5leHBhbmQodGFyZ2V0LmNoZWNrZWQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInRleHRcIjpcclxuICAgICAgICAgIHRhcmdldC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICBpdGVtLmZvY3VzKCk7XHJcbiAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEgfSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiZGVmYXVsdFwiOlxyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2codGFyZ2V0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdzdGFydFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFtdO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZClcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFt0aGlzLmRhdGFdO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0ID0gbnVsbDtcclxuXHJcbiAgICAgIC8vIG1hcmsgYXMgYWxyZWFkeSBwcm9jZXNzZWQgYnkgdGhpcyB0cmVlIGl0ZW0gdG8gaWdub3JlIGl0IGluIGZ1cnRoZXIgcHJvcGFnYXRpb24gdGhyb3VnaCB0aGUgdHJlZVxyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJkcmFnc3RhcnRcIiwgdGhpcy5sYWJlbC52YWx1ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gdGhpcy5jb250cm9sbGVyLmhuZERyYWdPdmVyKF9ldmVudCk7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiZHJhZ292ZXJEb25lXCIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJkcmFnb3ZlckRvbmVcIiwgdHJ1ZSk7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQgPSB0aGlzLmRhdGE7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW1vdmUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50LmN1cnJlbnRUYXJnZXQgPT0gX2V2ZW50LnRhcmdldClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IHRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbih0aGlzLmRhdGEpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcImxpLXRyZWUtaXRlbVwiLCA8Q3VzdG9tRWxlbWVudENvbnN0cnVjdG9yPjx1bmtub3duPlRyZWVJdGVtLCB7IGV4dGVuZHM6IFwibGlcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGV4cG9ydCBjb25zdCBlbnVtIEVWRU5UIHtcclxuICAgIENMSUNLID0gXCJjbGlja1wiLFxyXG4gICAgRE9VQkxFX0NMSUNLID0gXCJkYmxjbGlja1wiLFxyXG4gICAgS0VZX0RPV04gPSBcImtleWRvd25cIixcclxuICAgIERSQUdfU1RBUlQgPSBcImRyYWdzdGFydFwiLFxyXG4gICAgRFJBR19FTlRFUiA9IFwiZHJhZ2VudGVyXCIsXHJcbiAgICBEUkFHX09WRVIgPSBcImRyYWdvdmVyXCIsXHJcbiAgICBEUkFHX0xFQVZFID0gXCJkcmFnbGVhdmVcIixcclxuICAgIERST1AgPSBcImRyb3BcIixcclxuICAgIFBPSU5URVJfVVAgPSBcInBvaW50ZXJ1cFwiLFxyXG4gICAgV0hFRUwgPSBcIndoZWVsXCIsXHJcbiAgICBGT0NVU19ORVhUID0gXCJmb2N1c05leHRcIixcclxuICAgIEZPQ1VTX1BSRVZJT1VTID0gXCJmb2N1c1ByZXZpb3VzXCIsXHJcbiAgICBGT0NVU19JTiA9IFwiZm9jdXNpblwiLFxyXG4gICAgRk9DVVNfT1VUID0gXCJmb2N1c291dFwiLFxyXG4gICAgRk9DVVNfU0VUID0gXCJmb2N1c1NldFwiLFxyXG4gICAgQkxVUiA9IFwiYmx1clwiLFxyXG4gICAgQ0hBTkdFID0gXCJjaGFuZ2VcIixcclxuICAgIERFTEVURSA9IFwiZGVsZXRlXCIsXHJcbiAgICBSRU5BTUUgPSBcInJlbmFtZVwiLFxyXG4gICAgU0VMRUNUID0gXCJpdGVtc2VsZWN0XCIsXHJcbiAgICBFU0NBUEUgPSBcImVzY2FwZVwiLFxyXG4gICAgQ09QWSA9IFwiY29weVwiLFxyXG4gICAgQ1VUID0gXCJjdXRcIixcclxuICAgIFBBU1RFID0gXCJwYXN0ZVwiLFxyXG4gICAgU09SVCA9IFwic29ydFwiLFxyXG4gICAgQ09OVEVYVE1FTlUgPSBcImNvbnRleHRtZW51XCIsXHJcbiAgICBNVVRBVEUgPSBcIm11dGF0ZVwiLFxyXG4gICAgUkVNT1ZFX0NISUxEID0gXCJyZW1vdmVDaGlsZFwiLFxyXG4gICAgQ09MTEFQU0UgPSBcImNvbGxhcHNlXCIsXHJcbiAgICBFWFBBTkQgPSBcImV4cGFuZFwiLFxyXG4gICAgSU5QVVQgPSBcImlucHV0XCIsXHJcbiAgICBSRUFSUkFOR0VfQVJSQVkgPSBcInJlYXJyYW5nZUFycmF5XCIsXHJcbiAgICBUT0dHTEUgPSBcInRvZ2dsZVwiLFxyXG4gICAgUE9JTlRFUl9NT1ZFID0gXCJwb2ludGVybW92ZVwiLFxyXG4gICAgSU5TRVJUID0gXCJpbnNlcnRcIlxyXG4gIH1cclxufSJdfQ==