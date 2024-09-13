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
        set(_objects, _operation, _source) {
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
                        let objects = await this.controller.drop();
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
            //#region Replace with Clipboard
            /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of table */
            this.dragDrop = { sources: [], target: null };
            /** Stores references to objects being copied or cut, and objects to paste to. Override with references in outer scope, if copy&paste should operate outside of tree */
            this.copyPaste = { sources: [], target: null };
        }
        //#endregion
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
         * @param _focus The that has the focus and that will be copied if the selection is empty
         */
        copy(_focus, _operation) {
            let items = this.selection.length ? this.selection : [_focus];
            FudgeUserInterface.Clipboard.copyPaste.set(items, _operation, null);
            return items;
        }
        /**
         * Refer objects to the clipboard for copy & paste and delete them from this controller
         * @param _focus The item that has the focus and that will be cut if the selection is empty
         */
        async cut(_focus, _operation) {
            let items = this.copy(_focus, _operation);
            items = await this.delete(items);
            return items;
        }
        /**
         * Retrieve objects from the clipboard, process and return them to add to the table
         */
        async paste(_class = null) {
            let objects = FudgeUserInterface.Clipboard.copyPaste.get(_class, true); // possible to filter for only objects of specific type
            return objects;
        }
        /**
         * Refer objects to the clipboard for drag & drop
         * @param _focus The item that has the focus and that will be dragged if the selection is empty
         */
        dragStart(_focus) {
            // if the focussed item is in the selection, drag the whole selection
            let items = this.selection.indexOf(_focus) < 0 ? [_focus] : this.selection;
            FudgeUserInterface.Clipboard.dragDrop.set(items);
        }
        /**
         * Return allowed dragDrop-effect
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
         * Retrieve objects from the clipboard, and process and return them to add to the table
         */
        async drop(_class = null) {
            let objects = FudgeUserInterface.Clipboard.dragDrop.get(_class, true); // possible to filter for only objects of specific type
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
            this.hndDragOver = (_event) => {
                if (Reflect.get(_event, "dragProcessed"))
                    return;
                Reflect.set(_event, "dragProcessed", true);
                let target = this.parentElement.data;
                if (target == null || !this.controller.canAddChildren(this.controller.dragDrop.sources, target))
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
                _event.dataTransfer.dropEffect = "none";
                switch (_event.type) {
                    case "dragstart" /* EVENT.DRAG_START */:
                        _event.dataTransfer.effectAllowed = "all";
                        this.controller.dragStart(item.data);
                        break;
                    case "dragover" /* EVENT.DRAG_OVER */:
                        // _event.dataTransfer.dropEffect = this.controller.dragOver(_event);
                        // _event.preventDefault();
                        break;
                    case "drop" /* EVENT.DROP */:
                        // let objects: T[] = await this.controller.drop();
                        // for (let object of objects) {
                        //   let item: TableItem<T> = new TableItem<T>(this.controller, object, this.attIcon);
                        //   this.appendChild(item);
                        // }
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
            this.addEventListener("drop" /* EVENT.DROP */, this.hndDrop, true);
            this.addEventListener("dragleave" /* EVENT.DRAG_LEAVE */, this.hndDragLeave);
            this.addEventListener("dragstart" /* EVENT.DRAG_START */, this.hndDragDrop);
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
        hndDrop(_event) {
            this.addChildren(this.controller.dragDrop.sources, this.controller.dragDrop.target, this.controller.dragDrop.at);
            this.controller.dragDrop.sources = [];
            this.controller.dragDropIndicator.remove();
        }
    }
    FudgeUserInterface.Tree = Tree;
    customElements.define("ul-tree", Tree, { extends: "ul" });
})(FudgeUserInterface || (FudgeUserInterface = {}));
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * Subclass this to create a broker between your data and a {@link Tree} to display and manipulate it.
     * The {@link Tree} doesn't know how your data is structured and how to handle it, the controller implements the methods needed
     */
    class TreeController {
        constructor() {
            /** Stores references to selected objects. Override with a reference in outer scope, if selection should also operate outside of tree */
            this.selection = [];
            /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
            this.dragDrop = { sources: [], target: null };
            /** Stores references to objects being dragged, and objects to drop on. Override with a reference in outer scope, if drag&drop should operate outside of tree */
            this.copyPaste = { sources: [], target: null };
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
        /**
         * Remove the objects to be deleted, e.g. the current selection, from the data structure the table refers to and
         * return a list of those objects in order for the according {@link TreeItems} to be deleted also
         * @param _expendables The expendable objects
         */
        async delete(_expendables) {
            return _expendables;
        }
        /**
         * Refer items to the clipboard for copy & paste
         * @param _focus The that has the focus and that will be copied if the selection is empty
         */
        copy(_focus, _operation) {
            let items = this.selection.length ? this.selection : [_focus];
            FudgeUserInterface.Clipboard.copyPaste.set(items, _operation, null);
            return items;
        }
        /**
         * Refer objects to the clipboard for copy & paste and delete them from this controller
         * @param _focus The item that has the focus and that will be cut if the selection is empty
         */
        async cut(_focus, _operation) {
            let items = this.copy(_focus, _operation);
            items = await this.delete(items);
            return items;
        }
        /**
         * Retrieve objects from the clipboard, process and return them to add to the table
         */
        async paste(_class = null) {
            let objects = FudgeUserInterface.Clipboard.copyPaste.get(_class, true); // possible to filter for only objects of specific type
            return objects;
        }
        /**
         * Refer objects to the clipboard for drag & drop
         * @param _focus The item that has the focus and that will be dragged if the selection is empty
         */
        dragStart(_focus) {
            // if the focussed item is in the selection, drag the whole selection
            let items = this.selection.indexOf(_focus) < 0 ? [_focus] : this.selection;
            FudgeUserInterface.Clipboard.dragDrop.set(items);
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
                if (_event.dataTransfer.getData("dragstart"))
                    return;
                // store the dragged item in the event for further processing in table
                Reflect.set(_event, "item", this);
                _event.dataTransfer.setData("dragstart", "dragstart");
            };
            // private hndDragStart = (_event: DragEvent): void => {
            //   // _event.stopPropagation();
            //   // if (_event.dataTransfer.getData("dragstart"))
            //   //   return;
            //   this.controller.dragDrop.sources = [];
            //   if (this.selected)
            //     this.controller.dragDrop.sources = this.controller.selection;
            //   else
            //     this.controller.dragDrop.sources = [this.data];
            //   _event.dataTransfer.effectAllowed = "all";
            //   // _event.dataTransfer.setDragImage(document.createElement("img"), 0, 0);
            //   this.controller.dragDrop.target = null;
            //   // mark as already processed by this tree item to ignore it in further propagation through the tree
            //   // _event.dataTransfer.setData("dragstart", "dragstart");
            // };
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
            // this.addEventListener(EVENT.DRAG_START, this.hndDragStart);
            this.addEventListener("dragenter" /* EVENT.DRAG_ENTER */, this.hndDragOver); // this prevents cursor from flickering
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragOver);
            this.addEventListener("dragstart" /* EVENT.DRAG_START */, this.hndDragDrop);
            this.addEventListener("dragenter" /* EVENT.DRAG_ENTER */, this.hndDragDrop); // this prevents cursor from flickering
            this.addEventListener("dragover" /* EVENT.DRAG_OVER */, this.hndDragDrop);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VVc2VySW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ2xpcGJvYXJkLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvUmVmZXJlbmNlcy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvR2VuZXJhdG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Qm9vbGVhbi50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudENvbG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50RGlnaXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZW1wbGF0ZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDN4My50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE1hdHJpeDR4NC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudE91dHB1dC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFNlbGVjdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudFN0ZXBwZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRUZXh0SW5wdXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RldGFpbHMudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0RldGFpbHNBcnJheS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvRGlhbG9nLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9NdWx0aUxldmVsTWVudS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvV2FybmluZy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVGFibGUvVGFibGUudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RhYmxlL1RhYmxlQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVGFibGUvVGFibGVJdGVtLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UcmVlL1RyZWVMaXN0LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UcmVlL1RyZWUudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZUNvbnRyb2xsZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZUl0ZW0udHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9FdmVudC9FdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxrQkFBa0IsQ0FrQzNCO0FBbENELFdBQVUsa0JBQWtCO0lBQzFCOzs7T0FHRztJQUtILE1BQWEsU0FBUztRQUF0QjtZQUdTLFlBQU8sR0FBZ0IsRUFBRSxDQUFDO1lBRTFCLFdB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QUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDcEIsQ0FBQztLQTZLRjtJQS9VWSwyQkFBUSxXQStVcEIsQ0FBQTtJQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3JFLENBQUMsRUF6VlMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQXlWM0IiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBDb21tb24gY2xpcGJvYXJkcyBmb3IgYWxsIGRyYWctZHJvcCBhbmQgY29weS1wYXN0ZSBvcGVyYXRpb25zIGhhcHBlbmluZyBpbiB0aGUgdXNlciBpbnRlcmZhY2VcclxuICAgKiBAYXV0aG9yIEppcmthIERlbGwnT3JvLUZyaWVkbCwgSEZVLCAyMDI0XHJcbiAgICovXHJcblxyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBleHBvcnQgdHlwZSBDbGlwT3BlcmF0aW9uID0gRVZFTlQuQ09QWSB8IEVWRU5ULkNVVDtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENsaXBib2FyZCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGRyYWdEcm9wOiBDbGlwYm9hcmQgPSBuZXcgQ2xpcGJvYXJkKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNvcHlQYXN0ZTogQ2xpcGJvYXJkID0gbmV3IENsaXBib2FyZCgpO1xyXG4gICAgcHVibGljIG9iamVjdHM6IMaSLkdlbmVyYWxbXSA9IFtdO1xyXG4gICAgcHVibGljIG9wZXJhdGlvbjogQ2xpcE9wZXJhdGlvbjtcclxuICAgIHB1YmxpYyBzb3VyY2U6IE9iamVjdCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGdldDxUPihfY2xhc3M6IG5ldyAoKSA9PiBUIHwgT2JqZWN0ID0gT2JqZWN0LCBfZmlsdGVyOiBib29sZWFuID0gdHJ1ZSk6IFRbXSB7XHJcbiAgICAgIGlmIChfY2xhc3MpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0cy5maWx0ZXIoX29iamVjdCA9PiBfb2JqZWN0IGluc3RhbmNlb2YgX2NsYXNzKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLm9iamVjdHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0KF9vYmplY3RzOiBPYmplY3RbXSwgX29wZXJhdGlvbj86IENsaXBPcGVyYXRpb24sIF9zb3VyY2U/OiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgdGhpcy5vYmplY3RzID0gX29iamVjdHMuc2xpY2UoKTtcclxuICAgICAgdGhpcy5zb3VyY2UgPSBfc291cmNlO1xyXG4gICAgICB0aGlzLm9wZXJhdGlvbiA9IF9vcGVyYXRpb247XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyAvIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0Rpc3RyaWJ1dGlvbi9GdWRnZUNvcmUuZC50c1wiLz4gLy8gVE9ETzogbm93IHRoYXQgd2UgdXNlIHBhY2thZ2UgcmVmZXJlbmNlcyBpbiB0aGUgdHNjb25maWcsIHRoaXMgZmlsZSBpcyBvYnNvbGV0ZSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ29ubmVjdHMgYSBbW011dGFibGVdXSB0byBhIERPTS1FbGVtZW50IGFuZCBzeW5jaHJvbml6ZXMgdGhhdCBtdXRhYmxlIHdpdGggdGhlIG11dGF0b3Igc3RvcmVkIHdpdGhpbi5cclxuICAgKiBVcGRhdGVzIHRoZSBtdXRhYmxlIG9uIGludGVyYWN0aW9uIHdpdGggdGhlIGVsZW1lbnQgYW5kIHRoZSBlbGVtZW50IGluIHRpbWUgaW50ZXJ2YWxzLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDb250cm9sbGVyIHtcclxuICAgIC8vIFRPRE86IGV4YW1pbmUgdGhlIHVzZSBvZiB0aGUgYXR0cmlidXRlIGtleSB2cyBuYW1lLiBLZXkgc2lnbmFscyB0aGUgdXNlIGJ5IEZVREdFIHdoaWxlIG5hbWUgaXMgc3RhbmRhcmQgYW5kIHN1cHBvcnRlZCBieSBmb3Jtc1xyXG4gICAgcHVibGljIGRvbUVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJvdGVjdGVkIHRpbWVVcGRhdGU6IG51bWJlciA9IDE5MDtcclxuICAgIC8qKiBSZWZlcmVyZW5jZSB0byB0aGUgW1tGdWRnZUNvcmUuTXV0YWJsZV1dIHRoaXMgdWkgcmVmZXJzIHRvICovXHJcbiAgICBwcm90ZWN0ZWQgbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPjtcclxuICAgIC8qKiBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gdXNlZCB0byBjb252ZXkgZGF0YSB0byBhbmQgZnJvbSB0aGUgbXV0YWJsZSovXHJcbiAgICBwcm90ZWN0ZWQgbXV0YXRvcjogxpIuTXV0YXRvcjtcclxuICAgIC8qKiBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gdXNlZCB0byBzdG9yZSB0aGUgZGF0YSB0eXBlcyBvZiB0aGUgbXV0YXRvciBhdHRyaWJ1dGVzKi9cclxuICAgIHByb3RlY3RlZCBtdXRhdG9yVHlwZXM6IMaSLk11dGF0b3IgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgaWRJbnRlcnZhbDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiwgX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudCA9IF9kb21FbGVtZW50O1xyXG4gICAgICB0aGlzLnNldE11dGFibGUoX211dGFibGUpO1xyXG4gICAgICAvLyBUT0RPOiBleGFtaW5lLCBpZiB0aGlzIHNob3VsZCByZWdpc3RlciB0byBvbmUgY29tbW9uIGludGVydmFsLCBpbnN0ZWFkIG9mIGVhY2ggaW5zdGFsbGluZyBpdHMgb3duLlxyXG4gICAgICB0aGlzLnN0YXJ0UmVmcmVzaCgpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5JTlBVVCwgdGhpcy5tdXRhdGVPbklucHV0KTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUkVBUlJBTkdFX0FSUkFZLCB0aGlzLnJlYXJyYW5nZUFycmF5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIGFuIGV4aXN0aW5nIFtbxpIuTXV0YXRvcl1dIGFzIGEgdGVtcGxhdGUgXHJcbiAgICAgKiBhbmQgdXBkYXRpbmcgaXRzIHZhbHVlcyB3aXRoIHRob3NlIGZvdW5kIGluIHRoZSBnaXZlbiBVSS1kb21FbGVtZW50LiBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVNdXRhdG9yKF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX211dGF0b3I6IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgZm9yIChsZXQga2V5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBlbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICAgIGVsc2UgaWYgKF9tdXRhdG9yW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpXHJcbiAgICAgICAgICBfbXV0YXRvcltrZXldID0gQ29udHJvbGxlci51cGRhdGVNdXRhdG9yKGVsZW1lbnQsIF9tdXRhdG9yW2tleV0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBlbGVtZW50LnZhbHVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gX211dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyB0aGUgYSBbW8aSLk11dGFibGVdXSBhcyBhIHRlbXBsYXRlIHRvIGNyZWF0ZSBhIFtbxpIuTXV0YXRvcl1dIG9yIHVwZGF0ZSB0aGUgZ2l2ZW4gW1vGki5NdXRhdG9yXV0gXHJcbiAgICAgKiB3aXRoIHRoZSB2YWx1ZXMgaW4gdGhlIGdpdmVuIFVJLWRvbUVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRNdXRhdG9yKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9tdXRhdG9yPzogxpIuTXV0YXRvciwgX3R5cGVzPzogxpIuTXV0YXRvcik6IMaSLk11dGF0b3Ige1xyXG4gICAgICAvLyBUT0RPOiBleGFtaW5lIGlmIHRoaXMubXV0YXRvciBzaG91bGQgYWxzbyBiZSBhZGRyZXNzZWQgaW4gc29tZSB3YXkuLi5cclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCBfbXV0YWJsZS5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgICAvLyBUT0RPOiBNdXRhdG9yIHR5cGUgbm93IG9ubHkgdXNlZCBmb3IgZW51bXMuIEV4YW1pbmUgaWYgdGhlcmUgaXMgYW5vdGhlciB3YXlcclxuICAgICAgbGV0IG11dGF0b3JUeXBlczogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzID0gX3R5cGVzIHx8IF9tdXRhYmxlLmdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyhtdXRhdG9yKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gQ29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPT0gbnVsbClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSAoPEN1c3RvbUVsZW1lbnQ+ZWxlbWVudCkuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSBlbGVtZW50LnZhbHVlO1xyXG4gICAgICAgIGVsc2UgaWYgKG11dGF0b3JUeXBlc1trZXldIGluc3RhbmNlb2YgT2JqZWN0KVxyXG4gICAgICAgICAgLy8gVE9ETzogc2V0dGluZyBhIHZhbHVlIG9mIHRoZSBkb20gZWxlbWVudCBkb2Vzbid0IG1ha2Ugc2Vuc2UuLi4gZXhhbWluZSB3aGF0IHRoaXMgbGluZSB3YXMgc3VwcG9zZWQgdG8gZG8uIEFzc3VtYWJseSBlbnVtc1xyXG4gICAgICAgICAgbXV0YXRvcltrZXldID0gKDxIVE1MU2VsZWN0RWxlbWVudD5lbGVtZW50KS52YWx1ZTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGxldCBzdWJNdXRhdG9yOiDGki5NdXRhdG9yID0gUmVmbGVjdC5nZXQobXV0YXRvciwga2V5KTtcclxuICAgICAgICAgIGxldCBzdWJNdXRhYmxlOiDGki5NdXRhYmxlO1xyXG4gICAgICAgICAgc3ViTXV0YWJsZSA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgICAgaWYgKHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkgfHwgc3ViTXV0YWJsZSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgICAgIG11dGF0b3Jba2V5XSA9IHRoaXMuZ2V0TXV0YXRvcihzdWJNdXRhYmxlLCBlbGVtZW50LCBzdWJNdXRhdG9yKTsgLy8sIHN1YlR5cGVzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyB0aGUgW1vGki5NdXRhdG9yXV0gb2YgYSBbW8aSLk11dGFibGVdXSBhbmQgdXBkYXRpbmcgdGhlIFVJLWRvbUVsZW1lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICAgKiBJZiBhbiBhZGRpdGlvbmFsIFtbxpIuTXV0YXRvcl1dIGlzIHBhc3NlZCwgaXRzIHZhbHVlcyBhcmUgdXNlZCBpbnN0ZWFkIG9mIHRob3NlIG9mIHRoZSBbW8aSLk11dGFibGVdXS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVVc2VySW50ZXJmYWNlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9tdXRhdG9yIHx8IF9tdXRhYmxlLmdldE11dGF0b3JGb3JVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIGxldCBtdXRhdG9yVHlwZXM6IMaSLk11dGF0b3JBdHRyaWJ1dGVUeXBlcyA9IF9tdXRhYmxlLmdldE11dGF0b3JBdHRyaWJ1dGVUeXBlcyhtdXRhdG9yKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEN1c3RvbUVsZW1lbnQgPSA8Q3VzdG9tRWxlbWVudD5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlOiDGki5HZW5lcmFsID0gbXV0YXRvcltrZXldO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQgJiYgZWxlbWVudCAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIGVsc2UgaWYgKG11dGF0b3JUeXBlc1trZXldIGluc3RhbmNlb2YgT2JqZWN0KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbGV0IHN1Yk11dGFibGU6IMaSLk11dGFibGUgPSBSZWZsZWN0LmdldChfbXV0YWJsZSwga2V5KTtcclxuICAgICAgICAgIGlmIChzdWJNdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZUFycmF5IHx8IHN1Yk11dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVVzZXJJbnRlcmZhY2Uoc3ViTXV0YWJsZSwgZWxlbWVudCwgbXV0YXRvcltrZXldKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgLy9lbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGVsZW1lbnQsIFwidmFsdWVcIiwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgYSBicmVhZHRoLWZpcnN0IHNlYXJjaCBvbiB0aGUgZ2l2ZW4gX2RvbUVsZW1lbnQgZm9yIGFuIGVsZW1lbnQgd2l0aCB0aGUgZ2l2ZW4ga2V5LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9rZXk6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PiA9IF9kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtrZXk9XCIke19rZXl9XCJdYCk7XHJcbiAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPCAyKVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50c1swXTtcclxuXHJcbiAgICAgIGxldCBzaG9ydGVzdFBhdGg6IG51bWJlciA9IEluZmluaXR5O1xyXG4gICAgICBsZXQgY2xvc2VzdEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xyXG4gICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IgKGxldCBwYXJlbnRFbGVtZW50OiBIVE1MRWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDsgcGFyZW50RWxlbWVudCAhPSBfZG9tRWxlbWVudDsgcGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudClcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgaWYgKGNvdW50IDwgc2hvcnRlc3RQYXRoKSB7XHJcbiAgICAgICAgICBjbG9zZXN0RWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBzaG9ydGVzdFBhdGggPSBjb3VudDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjbG9zZXN0RWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9rZXk6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgIC8vICAgcmV0dXJuIF9kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYDpzY29wZSA+IFtrZXk9XCIke19rZXl9XCJdYCkgPz8gX2RvbUVsZW1lbnQucXVlcnlTZWxlY3RvcihgOnNjb3BlID4gKiA+IFtrZXk9XCIke19rZXl9XCJdYCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtcyBhIGJyZWFkdGgtZmlyc3Qgc2VhcmNoIG9uIHRoZSBnaXZlbiBfZG9tRWxlbWVudCBmb3IgYW4gZWxlbWVudCB3aXRoIHRoZSBnaXZlbiBrZXkuXHJcbiAgICAgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX2tleTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgLy8gICBsZXQgcXVldWU6IEhUTUxFbGVtZW50W10gPSBbX2RvbUVsZW1lbnRdO1xyXG4gICAgLy8gICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xyXG4gICAgLy8gICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IHF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAvLyAgICAgaWYgKGVsZW1lbnQubWF0Y2hlcyhgW2tleT1cIiR7X2tleX1cIl1gKSlcclxuICAgIC8vICAgICAgIHJldHVybiBlbGVtZW50O1xyXG5cclxuICAgIC8vICAgICBxdWV1ZS5wdXNoKC4uLjxIVE1MRWxlbWVudFtdPkFycmF5LmZyb20oZWxlbWVudC5jaGlsZHJlbikpO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIHJldHVybiBudWxsO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yKF9tdXRhdG9yPzogxpIuTXV0YXRvciwgX3R5cGVzPzogxpIuTXV0YXRvcik6IMaSLk11dGF0b3Ige1xyXG4gICAgICAvLyBUT0RPOiBzaG91bGQgZ2V0IE11dGF0b3IgZm9yIFVJIG9yIHdvcmsgd2l0aCB0aGlzLm11dGF0b3IgKGV4YW1pbmUpXHJcbiAgICAgIHRoaXMubXV0YWJsZS51cGRhdGVNdXRhdG9yKHRoaXMubXV0YXRvcik7XHJcbiAgICAgIHJldHVybiBDb250cm9sbGVyLmdldE11dGF0b3IodGhpcy5tdXRhYmxlLCB0aGlzLmRvbUVsZW1lbnQsIF9tdXRhdG9yLCBfdHlwZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVVc2VySW50ZXJmYWNlKCk6IHZvaWQge1xyXG4gICAgICBDb250cm9sbGVyLnVwZGF0ZVVzZXJJbnRlcmZhY2UodGhpcy5tdXRhYmxlLCB0aGlzLmRvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNdXRhYmxlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+KTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXV0YWJsZSA9IF9tdXRhYmxlO1xyXG4gICAgICB0aGlzLm11dGF0b3IgPSBfbXV0YWJsZS5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgICBpZiAoX211dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgIHRoaXMubXV0YXRvclR5cGVzID0gX211dGFibGUuZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKHRoaXMubXV0YXRvcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGFibGUoKTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11dGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0UmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pZEludGVydmFsKTtcclxuICAgICAgdGhpcy5pZEludGVydmFsID0gd2luZG93LnNldEludGVydmFsKHRoaXMucmVmcmVzaCwgdGhpcy50aW1lVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgbXV0YXRlT25JbnB1dCA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCB0YXJnZXQgb2YgX2V2ZW50LmNvbXBvc2VkUGF0aCgpKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldCA9PSB0aGlzLmRvbUVsZW1lbnQpXHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nID0gKDxIVE1MRWxlbWVudD50YXJnZXQpLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgICBpZiAoa2V5KVxyXG4gICAgICAgICAgcGF0aC5wdXNoKGtleSk7XHJcbiAgICAgIH1cclxuICAgICAgcGF0aC5yZXZlcnNlKCk7XHJcbiAgICAgIHRoaXMubXV0YXRvciA9IHRoaXMuZ2V0TXV0YXRvcigpO1xyXG4gICAgICBhd2FpdCB0aGlzLm11dGFibGUubXV0YXRlKMaSLk11dGFibGUuZ2V0TXV0YXRvckZyb21QYXRoKHRoaXMubXV0YXRvciwgcGF0aCkpO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuTVVUQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhcnJhbmdlQXJyYXkgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgc2VxdWVuY2U6IG51bWJlcltdID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbC5zZXF1ZW5jZTtcclxuICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzQXJyYXkgPSA8RGV0YWlsc0FycmF5Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGxldCBtdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+O1xyXG5cclxuICAgICAgeyAvLyBmaW5kIHRoZSBNdXRhYmxlQXJyYXkgY29ubmVjdGVkIHRvIHRoaXMgRGV0YWlsc0FycmF5XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZGV0YWlscztcclxuICAgICAgICB3aGlsZSAoZWxlbWVudCAhPSB0aGlzLmRvbUVsZW1lbnQpIHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImtleVwiKSlcclxuICAgICAgICAgICAgcGF0aC5wdXNoKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpKTtcclxuICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBhdGgpO1xyXG4gICAgICAgIG11dGFibGUgPSB0aGlzLm11dGFibGU7XHJcbiAgICAgICAgZm9yIChsZXQga2V5IG9mIHBhdGgpXHJcbiAgICAgICAgICBtdXRhYmxlID0gUmVmbGVjdC5nZXQobXV0YWJsZSwga2V5KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gcmVhcnJhbmdlIHRoYXQgbXV0YWJsZVxyXG4gICAgICAoPMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPj48dW5rbm93bj5tdXRhYmxlKS5yZWFycmFuZ2Uoc2VxdWVuY2UpO1xyXG4gICAgICBhd2FpdCB0aGlzLm11dGFibGUubXV0YXRlKHRoaXMubXV0YWJsZS5nZXRNdXRhdG9yKCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVmcmVzaCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRoaXMuZG9tRWxlbWVudCkpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVVzZXJJbnRlcmZhY2UoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaWRJbnRlcnZhbCk7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0YXRpYyBjbGFzcyBnZW5lcmF0aW5nIFVJLWRvbUVsZW1lbnRzIGZyb20gdGhlIGluZm9ybWF0aW9uIGZvdW5kIGluIFtbxpIuTXV0YWJsZV1dcyBhbmQgW1vGki5NdXRhdG9yXV1zXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEdlbmVyYXRvciB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBbW0NvbnRyb2xsZXJdXSBmcm9tIGEgW1tGdWRnZUNvcmUuTXV0YWJsZV1dIHdpdGggZXhwYW5kYWJsZSBkZXRhaWxzIG9yIGEgbGlzdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUNvbnRyb2xsZXIoX211dGFibGU6IMaSLk11dGFibGUsIF9uYW1lPzogc3RyaW5nKTogQ29udHJvbGxlciB7XHJcbiAgICAgIGxldCBjb250cm9sbGVyOiBDb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIoX211dGFibGUsIEdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoX211dGFibGUsIF9uYW1lKSk7XHJcbiAgICAgIGNvbnRyb2xsZXIudXBkYXRlVXNlckludGVyZmFjZSgpO1xyXG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBleHRlbmRhYmxlIGRldGFpbHMgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGFibGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShfbXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiwgX25hbWU/OiBzdHJpbmcsIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IERldGFpbHMgfCBEZXRhaWxzQXJyYXkge1xyXG4gICAgICBsZXQgbmFtZTogc3RyaW5nID0gX25hbWUgfHwgX211dGFibGUuY29uc3RydWN0b3IubmFtZTtcclxuXHJcbiAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzIHwgRGV0YWlsc0FycmF5O1xyXG4gICAgICBpZiAoX211dGFibGUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkpXHJcbiAgICAgICAgZGV0YWlscyA9IG5ldyBEZXRhaWxzQXJyYXkobmFtZSk7XHJcbiAgICAgIGVsc2UgaWYgKF9tdXRhYmxlIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICBkZXRhaWxzID0gbmV3IERldGFpbHMobmFtZSwgX211dGFibGUudHlwZSk7XHJcbiAgICAgIGVsc2UgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICBkZXRhaWxzLnNldENvbnRlbnQoR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9tdXRhYmxlLCBfbXV0YXRvcikpO1xyXG4gICAgICByZXR1cm4gZGV0YWlscztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGRpdi1FbGVtZW50cyBjb250YWluaW5nIHRoZSBpbnRlcmZhY2UgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGFibGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9tdXRhYmxlOiDGki5NdXRhYmxlIHwgxpIuTXV0YWJsZUFycmF5PMaSLk11dGFibGU+LCBfbXV0YXRvcj86IMaSLk11dGF0b3IpOiBIVE1MRGl2RWxlbWVudCB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwgX211dGFibGUuZ2V0TXV0YXRvckZvclVzZXJJbnRlcmZhY2UoKTtcclxuICAgICAgbGV0IG11dGF0b3JUeXBlczogxpIuTXV0YXRvckF0dHJpYnV0ZVR5cGVzID0gX211dGFibGUuZ2V0TXV0YXRvckF0dHJpYnV0ZVR5cGVzKG11dGF0b3IpO1xyXG4gICAgICBsZXQgZGl2OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gbXV0YXRvclR5cGVzKSB7XHJcbiAgICAgICAgbGV0IHR5cGU6IE9iamVjdCA9IG11dGF0b3JUeXBlc1trZXldO1xyXG4gICAgICAgIGxldCB2YWx1ZTogT2JqZWN0ID0gbXV0YXRvcltrZXldO1xyXG4gICAgICAgIGxldCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IEdlbmVyYXRvci5jcmVhdGVNdXRhdG9yRWxlbWVudChrZXksIHR5cGUsIHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XHJcbiAgICAgICAgICBsZXQgc3ViTXV0YWJsZTogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgICAgZWxlbWVudCA9IEdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoc3ViTXV0YWJsZSwga2V5LCA8xpIuTXV0YXRvcj52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnQgJiYgdHlwZSlcclxuICAgICAgICAgIGVsZW1lbnQgPSBuZXcgQ3VzdG9tRWxlbWVudE91dHB1dCh7IGtleToga2V5LCBsYWJlbDoga2V5LCB0eXBlOiB0eXBlLnRvU3RyaW5nKCksIHZhbHVlOiB2YWx1ZT8udG9TdHJpbmcoKSwgcGxhY2Vob2xkZXI6IGBEcm9wIHlvdXIgJHt0eXBlfSBoZXJlLi4uYCB9KTtcclxuXHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7IC8vIHVuZGVmaW5lZCB2YWx1ZXMgd2l0aG91dCBhIHR5cGUgY2FuJ3QgYmUgZGlzcGxheWVkXHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJObyBpbnRlcmZhY2UgY3JlYXRlZCBmb3IgXCIsIF9tdXRhYmxlLmNvbnN0cnVjdG9yLm5hbWUsIGtleSk7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgZGl2LUVsZW1lbnQgY29udGFpbmluZyB0aGUgaW50ZXJmYWNlIGZvciB0aGUgW1tGdWRnZUNvcmUuTXV0YXRvcl1dIFxyXG4gICAgICogRG9lcyBub3Qgc3VwcG9ydCBuZXN0ZWQgbXV0YXRvcnMhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlSW50ZXJmYWNlRnJvbU11dGF0b3IoX211dGF0b3I6IMaSLk11dGF0b3IgfCBPYmplY3QpOiBIVE1MRGl2RWxlbWVudCB7XHJcbiAgICAgIGxldCBkaXY6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgZm9yIChsZXQga2V5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBPYmplY3QgPSBSZWZsZWN0LmdldChfbXV0YXRvciwga2V5KTtcclxuICAgICAgICAvLyBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgLy8gYXQgdGhpcyB0aW1lICgxLzIzKSBhZGRpbmcgYSBwcm9wZXJ0eSB0byBhbiBhbmltYXRpb24gaW4gdGhlIGVkaXRvciBjcmVhdGVzIGFuIGVtcHR5IGtleXMgbGlzdC4uLlxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgIGRpdi5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZU11dGF0b3JFbGVtZW50KGtleSwgT2JqZWN0LCB7fSkpOyBcclxuICAgICAgICAvLyAgIGNvbnRpbnVlO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgIC8vIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gR2VuZXJhdG9yLmNyZWF0ZURldGFpbHMoa2V5LCBcIkRldGFpbHNcIik7XHJcbiAgICAgICAgICBsZXQgZGV0YWlsczogRGV0YWlscyA9IG5ldyBEZXRhaWxzKGtleSwgXCJEZXRhaWxzXCIpO1xyXG4gICAgICAgICAgZGV0YWlscy5zZXRDb250ZW50KEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YXRvcih2YWx1ZSkpO1xyXG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGRldGFpbHMpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCAoPE9iamVjdD52YWx1ZSkuY29uc3RydWN0b3IubmFtZSwgdmFsdWUpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgc3BlY2lmaWMgQ3VzdG9tRWxlbWVudCBmb3IgdGhlIGdpdmVuIGRhdGEsIHVzaW5nIF9rZXkgYXMgaWRlbnRpZmljYXRpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVNdXRhdG9yRWxlbWVudChfa2V5OiBzdHJpbmcsIF90eXBlOiBPYmplY3QgfCBzdHJpbmcsIF92YWx1ZTogT2JqZWN0KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKF90eXBlIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICBsZXQgZWxlbWVudFR5cGU6IHR5cGVvZiBDdXN0b21FbGVtZW50ID0gQ3VzdG9tRWxlbWVudC5nZXQoXCJPYmplY3RcIik7XHJcbiAgICAgICAgICAvLyBAdHMtaWdub3JlOiBpbnN0YW50aWF0ZSBhYnN0cmFjdCBjbGFzc1xyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBlbGVtZW50VHlwZSh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHZhbHVlOiBfdmFsdWUudG9TdHJpbmcoKSB9LCBfdHlwZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfdmFsdWUgaW5zdGFuY2VvZiDGki5NdXRhYmxlQXJyYXkpIHsgLy8gVE9ETzogZGVsZXRlP1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJNdXRhYmxlQXJyYXlcIik7XHJcbiAgICAgICAgICAvLyBpbnNlcnQgQXJyYXktQ29udHJvbGxlciFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGV0IGVsZW1lbnRUeXBlOiB0eXBlb2YgQ3VzdG9tRWxlbWVudCA9IEN1c3RvbUVsZW1lbnQuZ2V0KF90eXBlKTtcclxuICAgICAgICAgIGlmICghZWxlbWVudFR5cGUpXHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZTogaW5zdGFudGlhdGUgYWJzdHJhY3QgY2xhc3NcclxuICAgICAgICAgIGVsZW1lbnQgPSBuZXcgZWxlbWVudFR5cGUoeyBrZXk6IF9rZXksIGxhYmVsOiBfa2V5LCB2YWx1ZTogX3ZhbHVlPy50b1N0cmluZygpIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcuZnVkZ2UoX2Vycm9yKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRPRE86IHJlZmFjdG9yIGZvciBlbnVtcyBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVEcm9wZG93bihfbmFtZTogc3RyaW5nLCBfY29udGVudDogT2JqZWN0LCBfdmFsdWU6IHN0cmluZywgX3BhcmVudDogSFRNTEVsZW1lbnQsIF9jc3NDbGFzcz86IHN0cmluZyk6IEhUTUxTZWxlY3RFbGVtZW50IHtcclxuICAgICAgbGV0IGRyb3Bkb3duOiBIVE1MU2VsZWN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XHJcbiAgICAgIGRyb3Bkb3duLm5hbWUgPSBfbmFtZTtcclxuICAgICAgZm9yIChsZXQgdmFsdWUgaW4gX2NvbnRlbnQpIHtcclxuICAgICAgICBsZXQgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICBlbnRyeS50ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgZW50cnkudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodmFsdWUudG9VcHBlckNhc2UoKSA9PSBfdmFsdWUudG9VcHBlckNhc2UoKSkge1xyXG4gICAgICAgICAgZW50cnkuc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkcm9wZG93bi5hZGQoZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICAgIF9wYXJlbnQuYXBwZW5kQ2hpbGQoZHJvcGRvd24pO1xyXG4gICAgICByZXR1cm4gZHJvcGRvd247XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIHN0YXRpYyBjcmVhdGVEZXRhaWxzKF9rZXk6IHN0cmluZywgX3R5cGU6IHN0cmluZyk6IERldGFpbHMge1xyXG4gICAgLy8gICBsZXQgZGV0YWlsczogRGV0YWlscyA9IG5ldyBEZXRhaWxzKF9rZXkpO1xyXG4gICAgLy8gICAvLyBkZXRhaWxzLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgX3R5cGUpO1xyXG4gICAgLy8gICByZXR1cm4gZGV0YWlscztcclxuICAgIC8vIH1cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgY3JlYXRlRGV0YWlsc0FycmF5KF9rZXk6IHN0cmluZywgX3R5cGU6IHN0cmluZyk6IERldGFpbHMge1xyXG4gICAgLy8gICBsZXQgZGV0YWlsczogRGV0YWlscyA9IG5ldyBEZXRhaWxzQXJyYXkoX2tleSk7XHJcbiAgICAvLyAgIGRldGFpbHMuc2V0QXR0cmlidXRlKFwia2V5XCIsIF9rZXkpO1xyXG4gICAgLy8gICBkZXRhaWxzLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgX3R5cGUpO1xyXG4gICAgLy8gICByZXR1cm4gZGV0YWlscztcclxuICAgIC8vIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0cnVjdHVyZSBmb3IgdGhlIGF0dHJpYnV0ZXMgdG8gc2V0IGluIGEgQ3VzdG9tRWxlbWVudC5cclxuICAgKiBrZXkgKG1heWJlIHJlbmFtZSB0byBgbmFtZWApIGlzIG1hbmRhdG9yeSBhbmQgbXVzdCBtYXRjaCB0aGUga2V5IG9mIGEgbXV0YXRvciBpZiB1c2VkIGluIGNvbmp1bmN0aW9uXHJcbiAgICogbGFiZWwgaXMgcmVjb21tZW5kZWQgZm9yIGxhYmVsbGVkIGVsZW1lbnRzLCBrZXkgaXMgdXNlZCBpZiBub3QgZ2l2ZW4uXHJcbiAgICovXHJcbiAgZXhwb3J0IGludGVyZmFjZSBDdXN0b21FbGVtZW50QXR0cmlidXRlcyB7XHJcbiAgICBbbmFtZTogc3RyaW5nXTogc3RyaW5nO1xyXG4gICAga2V5OiBzdHJpbmc7XHJcbiAgICBsYWJlbD86IHN0cmluZztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXMgdGhlIG1hcHBpbmcgb2YgQ3VzdG9tRWxlbWVudHMgdG8gdGhlaXIgSFRNTC1UYWdzIHZpYSBjdXN0b21FbGVtZW50LmRlZmluZVxyXG4gICAqIGFuZCB0byB0aGUgZGF0YSB0eXBlcyBhbmQgW1tGdWRnZUNvcmUuTXV0YWJsZV1dcyB0aGV5IHJlbmRlciBhbiBpbnRlcmZhY2UgZm9yLiBcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQ3VzdG9tRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgdGFnOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtYXBPYmplY3RUb0N1c3RvbUVsZW1lbnQ6IE1hcDxzdHJpbmcsIHR5cGVvZiBDdXN0b21FbGVtZW50PiA9IG5ldyBNYXAoKTtcclxuICAgIHByaXZhdGUgc3RhdGljIGlkQ291bnRlcjogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIGlmIChfYXR0cmlidXRlcylcclxuICAgICAgICBmb3IgKGxldCBuYW1lIGluIF9hdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgICBpZiAoX2F0dHJpYnV0ZXNbbmFtZV0gIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShuYW1lLCBfYXR0cmlidXRlc1tuYW1lXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgYW4gaWQgdG8gdXNlIGZvciBjaGlsZHJlbiBvZiB0aGlzIGVsZW1lbnQsIG5lZWRlZCBlLmcuIGZvciBzdGFuZGFyZCBpbnRlcmFjdGlvbiB3aXRoIHRoZSBsYWJlbFxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGdldCBuZXh0SWQoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIFwixpJcIiArIEN1c3RvbUVsZW1lbnQuaWRDb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWdpc3RlciBtYXAgdGhlIGdpdmVuIGVsZW1lbnQgdHlwZSB0byB0aGUgZ2l2ZW4gdGFnIGFuZCB0aGUgZ2l2ZW4gdHlwZSBvZiBkYXRhXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXIoX3RhZzogc3RyaW5nLCBfdHlwZUN1c3RvbUVsZW1lbnQ6IHR5cGVvZiBDdXN0b21FbGVtZW50LCBfdHlwZU9iamVjdD86IHR5cGVvZiBPYmplY3QpOiB2b2lkIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coX3RhZywgX2NsYXNzKTtcclxuICAgICAgX3R5cGVDdXN0b21FbGVtZW50LnRhZyA9IF90YWc7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKF90YWcsIF90eXBlQ3VzdG9tRWxlbWVudCk7XHJcblxyXG4gICAgICBpZiAoX3R5cGVPYmplY3QpXHJcbiAgICAgICAgQ3VzdG9tRWxlbWVudC5tYXAoX3R5cGVPYmplY3QubmFtZSwgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIHRoZSBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgZ2l2ZW4gZGF0YSB0eXBlIChpZiByZWdpc3RlcmVkKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldChfdHlwZTogc3RyaW5nKTogdHlwZW9mIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgICBsZXQgZWxlbWVudDogc3RyaW5nIHwgdHlwZW9mIEN1c3RvbUVsZW1lbnQgfCBDdXN0b21FbGVtZW50Q29uc3RydWN0b3IgPSBDdXN0b21FbGVtZW50Lm1hcE9iamVjdFRvQ3VzdG9tRWxlbWVudC5nZXQoX3R5cGUpO1xyXG4gICAgICBpZiAodHlwZW9mIChlbGVtZW50KSA9PSBcInN0cmluZ1wiKVxyXG4gICAgICAgIGVsZW1lbnQgPSBjdXN0b21FbGVtZW50cy5nZXQoZWxlbWVudCk7XHJcbiAgICAgIHJldHVybiA8dHlwZW9mIEN1c3RvbUVsZW1lbnQ+ZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBtYXAoX3R5cGU6IHN0cmluZywgX3R5cGVDdXN0b21FbGVtZW50OiB0eXBlb2YgQ3VzdG9tRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShcIk1hcFwiLCBfdHlwZSwgX3R5cGVDdXN0b21FbGVtZW50Lm5hbWUpO1xyXG4gICAgICBDdXN0b21FbGVtZW50Lm1hcE9iamVjdFRvQ3VzdG9tRWxlbWVudC5zZXQoX3R5cGUsIF90eXBlQ3VzdG9tRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIGtleSAobmFtZSkgb2YgdGhlIGF0dHJpYnV0ZSB0aGlzIGVsZW1lbnQgcmVwcmVzZW50c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGtleSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBsYWJlbC1lbGVtZW50IGFzIGNoaWxkIHRvIHRoaXMgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwZW5kTGFiZWwoKTogSFRNTExhYmVsRWxlbWVudCB7XHJcbiAgICAgIGxldCB0ZXh0OiBzdHJpbmcgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgICBpZiAoIXRleHQpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGxhYmVsKTtcclxuICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRMYWJlbChfbGFiZWw6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgaWYgKGxhYmVsKVxyXG4gICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gX2xhYmVsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgdmFsdWUgb2YgdGhpcyBlbGVtZW50IHVzaW5nIGEgZm9ybWF0IGNvbXBhdGlibGUgd2l0aCBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICBSZWZsZWN0LnNldCh0aGlzLCBcInZhbHVlXCIsIF92YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFdvcmthcm91bmQgcmVjb25uZWN0aW9uIG9mIGNsb25lICovXHJcbiAgICBwdWJsaWMgY2xvbmVOb2RlKF9kZWVwOiBib29sZWFuKTogTm9kZSB7XHJcbiAgICAgIGxldCBsYWJlbDogc3RyaW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIGxldCBjbG9uZTogQ3VzdG9tRWxlbWVudCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGxhYmVsID8geyBsYWJlbDogbGFiZWwgfSA6IG51bGwpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNsb25lKTtcclxuICAgICAgY2xvbmUuc2V0TXV0YXRvclZhbHVlKHRoaXMuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGUgb2YgdGhpcy5hdHRyaWJ1dGVzKVxyXG4gICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUubmFtZSwgYXR0cmlidXRlLnZhbHVlKTtcclxuICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgdGhpcyBlbGVtZW50IGluIGEgZm9ybWF0IGNvbXBhdGlibGUgd2l0aCBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldE11dGF0b3JWYWx1ZSgpOiBPYmplY3Q7XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQSBzdGFuZGFyZCBjaGVja2JveCB3aXRoIGEgbGFiZWwgdG8gaXRcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudEJvb2xlYW4gZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2UtYm9vbGVhblwiLCBDdXN0b21FbGVtZW50Qm9vbGVhbiwgQm9vbGVhbik7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmICghX2F0dHJpYnV0ZXMubGFiZWwpXHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfYXR0cmlidXRlcy5rZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICAvLyBUT0RPOiBkZWxldGUgdGFiaW5kZXggZnJvbSBjaGVja2JveCBhbmQgZ2V0IHNwYWNlLWtleSBvbiB0aGlzXHJcbiAgICAgIC8vIHRoaXMudGFiSW5kZXggPSAwO1xyXG5cclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC50eXBlID0gXCJjaGVja2JveFwiO1xyXG4gICAgICBpbnB1dC5pZCA9IEN1c3RvbUVsZW1lbnQubmV4dElkO1xyXG4gICAgICBpbnB1dC5jaGVja2VkID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSA9PSBcInRydWVcIjtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChpbnB1dCk7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCkuaHRtbEZvciA9IGlucHV0LmlkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94IGFzIGJvb2xlYW4gdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLmNoZWNrZWQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3hcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikuY2hlY2tlZCA9IF92YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLyoqXHJcbiAgICogQSBjb2xvciBwaWNrZXIgd2l0aCBhIGxhYmVsIHRvIGl0IGFuZCBhIHNsaWRlciBmb3Igb3BhY2l0eVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50Q29sb3IgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2UtY29sb3JcIiwgQ3VzdG9tRWxlbWVudENvbG9yLCDGki5Db2xvcik7XHJcbiAgICBwdWJsaWMgY29sb3I6IMaSLkNvbG9yID0gbmV3IMaSLkNvbG9yKCk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmICghX2F0dHJpYnV0ZXMubGFiZWwpXHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfYXR0cmlidXRlcy5rZXkpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBwaWNrZXI6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHBpY2tlci50eXBlID0gXCJjb2xvclwiO1xyXG5cclxuICAgICAgcGlja2VyLnRhYkluZGV4ID0gMDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChwaWNrZXIpO1xyXG5cclxuICAgICAgbGV0IHNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgc2xpZGVyLnR5cGUgPSBcInJhbmdlXCI7XHJcbiAgICAgIHNsaWRlci5taW4gPSBcIjBcIjtcclxuICAgICAgc2xpZGVyLm1heCA9IFwiMVwiO1xyXG4gICAgICBzbGlkZXIuc3RlcCA9IFwiMC4wMVwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHNsaWRlcik7XHJcbiAgICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKEVWRU5ULldIRUVMLCB0aGlzLmhuZFdoZWVsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgdmFsdWVzIG9mIHBpY2tlciBhbmQgc2xpZGVyIGFzIMaSLk11dGF0b3JcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IGhleDogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9Y29sb3JcIikpLnZhbHVlO1xyXG4gICAgICBsZXQgYWxwaGE6IHN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPXJhbmdlXCIpKS52YWx1ZTtcclxuICAgICAgdGhpcy5jb2xvci5zZXRIZXgoaGV4LnN1YnN0cigxLCA2KSArIFwiZmZcIik7XHJcbiAgICAgIHRoaXMuY29sb3IuYSA9IHBhcnNlRmxvYXQoYWxwaGEpO1xyXG4gICAgICByZXR1cm4gdGhpcy5jb2xvci5nZXRNdXRhdG9yRm9yVXNlckludGVyZmFjZSgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZXMgb2YgY29sb3IgcGlja2VyIGFuZCBzbGlkZXJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IMaSLk11dGF0b3IpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jb2xvci5tdXRhdGUoX3ZhbHVlKTtcclxuICAgICAgbGV0IGhleDogc3RyaW5nID0gdGhpcy5jb2xvci5nZXRIZXgoKTtcclxuICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9Y29sb3JcIikpLnZhbHVlID0gXCIjXCIgKyBoZXguc3Vic3RyKDAsIDYpO1xyXG4gICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1yYW5nZVwiKSkudmFsdWUgPSB0aGlzLmNvbG9yLmEudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleShfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBobmRXaGVlbChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IHNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KTtcclxuICAgICAgaWYgKHNsaWRlciAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coX2V2ZW50LmRlbHRhWSAvIDEwMDApO1xyXG4gICAgICBsZXQgY3VycmVudFZhbHVlOiBudW1iZXIgPSBOdW1iZXIoc2xpZGVyLnZhbHVlKTtcclxuICAgICAgc2xpZGVyLnZhbHVlID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSAtIF9ldmVudC5kZWx0YVkgLyAxMDAwKTtcclxuICAgICAgc2xpZGVyLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIFJlcHJlc2VudHMgYSBzaW5nbGUgZGlnaXQgbnVtYmVyIHRvIGJlIHVzZWQgaW4gZ3JvdXBzIHRvIHJlcHJlc2VudCBhIG11bHRpZGlnaXQgdmFsdWUuXHJcbiAgICogSXMgdGFiYmFibGUgYW5kIGluLS9kZWNyZWFzZXMgcHJldmlvdXMgc2libGluZyB3aGVuIGZsb3dpbmcgb3Zlci91bmRlci5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudERpZ2l0IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1kaWdpdFwiLCBDdXN0b21FbGVtZW50RGlnaXQpO1xyXG4gICAgcHJvdGVjdGVkIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdmFsdWUoX3ZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgX3ZhbHVlID0gTWF0aC50cnVuYyhfdmFsdWUpO1xyXG4gICAgICBpZiAoX3ZhbHVlID4gOSB8fCBfdmFsdWUgPCAwKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy50ZXh0Q29udGVudCA9IF92YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMudGV4dENvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMudmFsdWUgPSAwO1xyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gLTE7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBhZGQoX2FkZGVuZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIF9hZGRlbmQgPSBNYXRoLnRydW5jKF9hZGRlbmQpO1xyXG4gICAgICBpZiAoX2FkZGVuZCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfYWRkZW5kID4gMCkge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlIDwgOSlcclxuICAgICAgICAgIHRoaXMudmFsdWUrKztcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGxldCBwcmV2OiBDdXN0b21FbGVtZW50RGlnaXQgPSA8Q3VzdG9tRWxlbWVudERpZ2l0PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmICghKHByZXYgJiYgcHJldiBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnREaWdpdCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIHByZXYuYWRkKDEpO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlID4gMClcclxuICAgICAgICAgIHRoaXMudmFsdWUtLTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGxldCBwcmV2OiBDdXN0b21FbGVtZW50RGlnaXQgPSA8Q3VzdG9tRWxlbWVudERpZ2l0PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmICghKHByZXYgJiYgcHJldiBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnREaWdpdCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIHByZXYuYWRkKC0xKTtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSA5O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21FbGVtZW50LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIEN1c3RvbUVsZW1lbnQgZnJvbSBhbiBIVE1MLVRlbXBsYXRlLVRhZ1xyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDdXN0b21FbGVtZW50VGVtcGxhdGUgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGZyYWdtZW50OiBNYXA8c3RyaW5nLCBEb2N1bWVudEZyYWdtZW50PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM/OiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCcm93c2VzIHRocm91Z2ggdGhlIHRlbXBsYXRlcyBpbiB0aGUgY3VycmVudCBkb2N1bWVudCBhbmQgcmVnaXN0ZXJzIHRoZSBvbmUgZGVmaW5pbmcgdGhlIGdpdmVuIHRhZ25hbWUuXHJcbiAgICAgKiBUbyBiZSBjYWxsZWQgZnJvbSBhIHNjcmlwdCB0YWcgaW1wbGVtZW50ZWQgd2l0aCB0aGUgdGVtcGxhdGUgaW4gSFRNTC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlcihfdGFnTmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IHRlbXBsYXRlIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZW1wbGF0ZVwiKSkge1xyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLmxvY2FsTmFtZSA9PSBfdGFnTmFtZSkge1xyXG4gICAgICAgICAgxpIuRGVidWcuZnVkZ2UoXCJSZWdpc3RlclwiLCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuWzBdKTtcclxuICAgICAgICAgIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZS5mcmFnbWVudC5zZXQoX3RhZ05hbWUsIHRlbXBsYXRlLmNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgaW4gYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHt9O1xyXG4gICAgICBsZXQgZWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTElucHV0RWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJba2V5XCIpO1xyXG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50KVxyXG4gICAgICAgICAgbXV0YXRvcltrZXldID0gZWxlbWVudC5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSBlbGVtZW50LnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX211dGF0b3I6IMaSLk11dGF0b3IpOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQga2V5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoYFtrZXk9XCIke2tleX1cIl1gKTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhgQ291bGRuJ3QgZmluZCAke2tleX0gaW5gLCB0aGlzKTtcclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBlbGVtZW50LnNldE11dGF0b3JWYWx1ZShfbXV0YXRvcltrZXldKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBlbGVtZW50LnZhbHVlID0gX211dGF0b3Jba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWUsIHRoZSBlbGVtZW50IGdldHMgY29uc3RydWN0ZWQgYXMgYSBkZWVwIGNsb25lIG9mIHRoZSB0ZW1wbGF0ZS5cclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgbGV0IGZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50ID0gQ3VzdG9tRWxlbWVudFRlbXBsYXRlLmZyYWdtZW50LmdldChSZWZsZWN0LmdldCh0aGlzLmNvbnN0cnVjdG9yLCBcInRhZ1wiKSk7XHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5mcmFnbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHJcbiAgICAgIGxldCBzdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbiA9IHRoaXMuc3R5bGU7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIGNvbnRlbnQuc3R5bGUpIHtcclxuICAgICAgICBzdHlsZS5zZXRQcm9wZXJ0eShlbnRyeSwgUmVmbGVjdC5nZXQoY29udGVudC5zdHlsZSwgZW50cnkpKTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBjb250ZW50LmNoaWxkTm9kZXMpIHtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGNoaWxkLmNsb25lTm9kZSh0cnVlKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xyXG4gICAgICBpZiAobGFiZWwpXHJcbiAgICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbUVsZW1lbnRUZW1wbGF0ZS50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudE1hdHJpeDN4MyBleHRlbmRzIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZSB7XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IHN0ZXBwZXJzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnRTdGVwcGVyPiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLXN0ZXBwZXJcIik7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0geyB0cmFuc2xhdGlvbjoge30sIHNjYWxpbmc6IHt9LCByb3RhdGlvbjogMCB9O1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCJdKVxyXG4gICAgICAgICAgKDzGki5NdXRhdG9yPm11dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSA9IHN0ZXBwZXJzW2NvdW50KytdLmdldE11dGF0b3JWYWx1ZSgpO1xyXG5cclxuICAgICAgbXV0YXRvcltcInJvdGF0aW9uXCJdID0gc3RlcHBlcnNbY291bnQrK10uZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX211dGF0b3I6IMaSLk11dGF0b3IpOiB2b2lkIHtcclxuICAgICAgbGV0IHN0ZXBwZXJzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnRTdGVwcGVyPiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLXN0ZXBwZXJcIik7XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgdmVjdG9yIG9mIFtcInRyYW5zbGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIl0pXHJcbiAgICAgICAgICBzdGVwcGVyc1tjb3VudCsrXS5zZXRNdXRhdG9yVmFsdWUoTnVtYmVyKCg8xpIuTXV0YXRvcj5fbXV0YXRvclt2ZWN0b3JdKVtkaW1lbnNpb25dKSk7XHJcbiAgICAgIHN0ZXBwZXJzW2NvdW50KytdLnNldE11dGF0b3JWYWx1ZShOdW1iZXIoX211dGF0b3JbXCJyb3RhdGlvblwiXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJNYXRyaXggQ2FsbGJhY2tcIik7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xyXG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiQ3VzdG9tRWxlbWVudFRlbXBsYXRlLnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50TWF0cml4NHg0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudFRlbXBsYXRlIHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IE9iamVjdCB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHsgdHJhbnNsYXRpb246IHt9LCByb3RhdGlvbjoge30sIHNjYWxpbmc6IHt9IH07XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgdmVjdG9yIG9mIFtcInRyYW5zbGF0aW9uXCIsIFwicm90YXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiLCBcInpcIl0pXHJcbiAgICAgICAgICAoPMaSLk11dGF0b3I+bXV0YXRvclt2ZWN0b3JdKVtkaW1lbnNpb25dID0gc3RlcHBlcnNbY291bnQrK10uZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX211dGF0b3I6IMaSLk11dGF0b3IpOiB2b2lkIHtcclxuICAgICAgbGV0IHN0ZXBwZXJzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnRTdGVwcGVyPiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLXN0ZXBwZXJcIik7XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgdmVjdG9yIG9mIFtcInRyYW5zbGF0aW9uXCIsIFwicm90YXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiLCBcInpcIl0pXHJcbiAgICAgICAgICBzdGVwcGVyc1tjb3VudCsrXS5zZXRNdXRhdG9yVmFsdWUoTnVtYmVyKCg8xpIuTXV0YXRvcj5fbXV0YXRvclt2ZWN0b3JdKVtkaW1lbnNpb25dKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIk1hdHJpeCBDYWxsYmFja1wiKTtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIHRleHQgaW5wdXQgZmllbGQgd2l0aCBhIGxhYmVsIHRvIGl0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50T3V0cHV0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLW91dHB1dFwiLCBDdXN0b21FbGVtZW50T3V0cHV0KTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IG91dHB1dDogSFRNTE91dHB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3V0cHV0XCIpO1xyXG4gICAgICBvdXRwdXQuaWQgPSBDdXN0b21FbGVtZW50Lm5leHRJZDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChvdXRwdXQpO1xyXG4gICAgICB0aGlzLnNldE11dGF0b3JWYWx1ZSh0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjb250ZW50IG9mIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBGdWRnZUNvcmUuR2VuZXJhbCk6IHZvaWQge1xyXG4gICAgICBsZXQgb3V0cHV0OiBIVE1MT3V0cHV0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcIm91dHB1dFwiKTtcclxuICAgICAgb3V0cHV0LnZhbHVlID0gX3ZhbHVlID8/IHRoaXMuZ2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIik7XHJcbiAgICAgIGlmIChfdmFsdWUpXHJcbiAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZWhvbGRlclwiKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG91dHB1dC5jbGFzc0xpc3QuYWRkKFwicGxhY2Vob2xkZXJcIik7XHJcblxyXG4gICAgICAvLyB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJvdXRwdXRcIikudmFsdWUgPSBfdmFsdWUgPz8gdGhpcy5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIGRyb3Bkb3duIG1lbnUgdG8gZGlzcGxheSBlbnVtc1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50U2VsZWN0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLXNlbGVjdFwiLCBDdXN0b21FbGVtZW50U2VsZWN0LCBPYmplY3QpO1xyXG4gICAgcHVibGljIGNvbnRlbnQ6IE9iamVjdDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzLCBfY29udGVudDogT2JqZWN0ID0ge30pIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoIV9hdHRyaWJ1dGVzLmxhYmVsKVxyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2F0dHJpYnV0ZXMua2V5KTtcclxuICAgICAgdGhpcy5jb250ZW50ID0gX2NvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuY29udGVudCkge1xyXG4gICAgICAgIGxldCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyID0gUmVmbGVjdC5nZXQodGhpcy5jb250ZW50LCBrZXkpO1xyXG4gICAgICAgIGlmIChSZWZsZWN0Lmhhcyh0aGlzLmNvbnRlbnQsIHZhbHVlKSAmJiBSZWZsZWN0LmdldCh0aGlzLmNvbnRlbnQsIHZhbHVlKSAhPT0ga2V5KSAvLyBmaWx0ZXIgbnVtYmVyIGtleXMgb3V0IG9mIHNpbXBsZSBlbnVtIFxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgbGV0IGVudHJ5OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgZW50cnkudGV4dCA9IGtleTtcclxuICAgICAgICBlbnRyeS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIHR5cGVvZiB2YWx1ZSk7XHJcbiAgICAgICAgZW50cnkudmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpO1xyXG4gICAgICAgIGlmIChlbnRyeS52YWx1ZSA9PSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKSB7XHJcbiAgICAgICAgICBlbnRyeS5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGVjdC5hZGQoZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICAgIHNlbGVjdC50YWJJbmRleCA9IDA7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2VsZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveCBhcyBib29sZWFuIHZhbHVlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogc3RyaW5nIHwgbnVtYmVyIHtcclxuICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJzZWxlY3RcIik7XHJcbiAgICAgIGxldCB0eXBlOiBzdHJpbmcgPSBzZWxlY3Qub3B0aW9uc1tzZWxlY3Quc2VsZWN0ZWRJbmRleF0/LmdldEF0dHJpYnV0ZShcInR5cGVcIikgfHwgXCJzdHJpbmdcIjtcclxuICAgICAgcmV0dXJuIHR5cGUgPT0gXCJudW1iZXJcIiA/IHBhcnNlRmxvYXQoc2VsZWN0LnZhbHVlKSA6IHNlbGVjdC52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKS52YWx1ZSA9IF92YWx1ZTtcclxuICAgICAgLy8gdGhpcy52YWx1ZSA9IF92YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuIGludGVyYWN0aXZlIG51bWJlciBzdGVwcGVyIHdpdGggZXhwb25lbnRpYWwgZGlzcGxheSBhbmQgY29tcGxleCBoYW5kbGluZyB1c2luZyBrZXlib2FyZCBhbmQgbW91c2VcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudFN0ZXBwZXIgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2Utc3RlcHBlclwiLCBDdXN0b21FbGVtZW50U3RlcHBlciwgTnVtYmVyKTtcclxuICAgIHB1YmxpYyB2YWx1ZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM/OiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmIChfYXR0cmlidXRlcyAmJiBfYXR0cmlidXRlc1tcInZhbHVlXCJdKVxyXG4gICAgICAgIHRoaXMudmFsdWUgPSBwYXJzZUZsb2F0KF9hdHRyaWJ1dGVzW1widmFsdWVcIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudHlwZSA9IFwibnVtYmVyXCI7XHJcbiAgICAgIGlucHV0LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSU5QVVQsIChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7IF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgfSk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cclxuXHJcbiAgICAgIGxldCBzaWduOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgc2lnbi50ZXh0Q29udGVudCA9IFwiK1wiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHNpZ24pO1xyXG4gICAgICBmb3IgKGxldCBleHA6IG51bWJlciA9IDI7IGV4cCA+IC00OyBleHAtLSkge1xyXG4gICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gbmV3IEN1c3RvbUVsZW1lbnREaWdpdCgpO1xyXG4gICAgICAgIGRpZ2l0LnNldEF0dHJpYnV0ZShcImV4cFwiLCBleHAudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChkaWdpdCk7XHJcbiAgICAgICAgaWYgKGV4cCA9PSAwKVxyXG4gICAgICAgICAgdGhpcy5pbm5lckhUTUwgKz0gXCIuXCI7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pbm5lckhUTUwgKz0gXCJlXCI7XHJcblxyXG4gICAgICBsZXQgZXhwOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgZXhwLnRleHRDb250ZW50ID0gXCIrMFwiO1xyXG4gICAgICBleHAudGFiSW5kZXggPSAtMTtcclxuICAgICAgZXhwLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJleHBcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZXhwKTtcclxuXHJcblxyXG4gICAgICAvLyBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRJbnB1dCk7XHJcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQkxVUiwgdGhpcy5obmRJbnB1dCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5CTFVSLCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5XSEVFTCwgdGhpcy5obmRXaGVlbCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGUtL0FjdGl2YXRlcyB0YWJiaW5nIGZvciB0aGUgaW5uZXIgZGlnaXRzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmF0ZUlubmVyVGFicyhfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBfb24gPyAwIDogLTE7XHJcblxyXG4gICAgICBsZXQgc3BhbnM6IE5vZGVMaXN0T2Y8SFRNTFNwYW5FbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XHJcbiAgICAgIHNwYW5zWzFdLnRhYkluZGV4ID0gaW5kZXg7XHJcblxyXG4gICAgICBsZXQgZGlnaXRzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnREaWdpdD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKTtcclxuICAgICAgZm9yIChsZXQgZGlnaXQgb2YgZGlnaXRzKVxyXG4gICAgICAgIGRpZ2l0LnRhYkluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPcGVucy9DbG9zZXMgYSBzdGFuZGFyZCBudW1iZXIgaW5wdXQgZm9yIHR5cGluZyB0aGUgdmFsdWUgYXQgb25jZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb3BlbklucHV0KF9vcGVuOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBpZiAoX29wZW4pIHtcclxuICAgICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgdGhlIHZhbHVlIG9mIHRoaXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBpdHMgdmFsdWUgYW5kIGRpc3BsYXlzIGl0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgaWYgKF92YWx1ZSA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBcclxuICAgICAgdGhpcy52YWx1ZSA9IF92YWx1ZTtcclxuICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSBtYW50aXNzYSBhbmQgZXhwb25lbnQgc2VwYXJhdGVseSBhcyBhbiBhcnJheSBvZiB0d28gbWVtYmVyc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TWFudGlzc2FBbmRFeHBvbmVudCgpOiBudW1iZXJbXSB7XHJcbiAgICAgIGxldCBwcmVjOiBzdHJpbmcgPSB0aGlzLnZhbHVlLnRvRXhwb25lbnRpYWwoNik7XHJcbiAgICAgIGxldCBleHA6IG51bWJlciA9IHBhcnNlSW50KHByZWMuc3BsaXQoXCJlXCIpWzFdKTtcclxuICAgICAgbGV0IGV4cDM6IG51bWJlciA9IE1hdGgudHJ1bmMoZXhwIC8gMyk7XHJcbiAgICAgIGxldCBtYW50aXNzYTogbnVtYmVyID0gdGhpcy52YWx1ZSAvIE1hdGgucG93KDEwLCBleHAzICogMyk7XHJcbiAgICAgIG1hbnRpc3NhID0gTWF0aC5yb3VuZChtYW50aXNzYSAqIDEwMDApIC8gMTAwMDtcclxuICAgICAgcmV0dXJuIFttYW50aXNzYSwgZXhwMyAqIDNdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoaXMgdmFsdWUgYXMgYSBzdHJpbmdcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cF06IG51bWJlcltdID0gdGhpcy5nZXRNYW50aXNzYUFuZEV4cG9uZW50KCk7XHJcbiAgICAgIGxldCBwcmVmaXhNYW50aXNzYTogc3RyaW5nID0gKG1hbnRpc3NhIDwgMCkgPyBcIlwiIDogXCIrXCI7XHJcbiAgICAgIGxldCBwcmVmaXhFeHA6IHN0cmluZyA9IChleHAgPCAwKSA/IFwiXCIgOiBcIitcIjtcclxuICAgICAgcmV0dXJuIHByZWZpeE1hbnRpc3NhICsgbWFudGlzc2EudG9GaXhlZCgzKSArIFwiZVwiICsgcHJlZml4RXhwICsgZXhwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheXMgdGhpcyB2YWx1ZSBieSBzZXR0aW5nIHRoZSBjb250ZW50cyBvZiB0aGUgZGlnaXRzIGFuZCB0aGUgZXhwb25lbnRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkaXNwbGF5KCk6IHZvaWQge1xyXG4gICAgICBsZXQgZGlnaXRzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnREaWdpdD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKTtcclxuICAgICAgbGV0IHNwYW5zOiBOb2RlTGlzdE9mPEhUTUxTcGFuRWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xyXG5cclxuICAgICAgaWYgKCFpc0Zpbml0ZSh0aGlzLnZhbHVlKSkge1xyXG4gICAgICAgIGZvciAobGV0IHBvczogbnVtYmVyID0gMDsgcG9zIDwgZGlnaXRzLmxlbmd0aDsgcG9zKyspIHtcclxuICAgICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gZGlnaXRzWzUgLSBwb3NdO1xyXG4gICAgICAgICAgZGlnaXQuaW5uZXJIVE1MID0gXCIgIOKIniAgIFwiWzUgLSBwb3NdO1xyXG4gICAgICAgICAgc3BhbnNbMV0udGV4dENvbnRlbnQgPSBcIiAgXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgbGV0IFttYW50aXNzYSwgZXhwXTogc3RyaW5nW10gPSB0aGlzLnRvU3RyaW5nKCkuc3BsaXQoXCJlXCIpO1xyXG4gICAgICBzcGFuc1swXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWUgPCAwID8gXCItXCIgOiBcIitcIjtcclxuICAgICAgc3BhbnNbMV0udGV4dENvbnRlbnQgPSBleHA7XHJcblxyXG4gICAgICBtYW50aXNzYSA9IG1hbnRpc3NhLnN1YnN0cmluZygxKTtcclxuICAgICAgbWFudGlzc2EgPSBtYW50aXNzYS5yZXBsYWNlKFwiLlwiLCBcIlwiKTtcclxuICAgICAgZm9yIChsZXQgcG9zOiBudW1iZXIgPSAwOyBwb3MgPCBkaWdpdHMubGVuZ3RoOyBwb3MrKykge1xyXG4gICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gZGlnaXRzWzUgLSBwb3NdO1xyXG4gICAgICAgIGlmIChwb3MgPCBtYW50aXNzYS5sZW5ndGgpIHtcclxuICAgICAgICAgIGxldCBjaGFyOiBzdHJpbmcgPSBtYW50aXNzYS5jaGFyQXQobWFudGlzc2EubGVuZ3RoIC0gMSAtIHBvcyk7XHJcbiAgICAgICAgICBkaWdpdC50ZXh0Q29udGVudCA9IGNoYXI7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBkaWdpdC5pbm5lckhUTUwgPSBcIiZuYnNwO1wiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGUga2V5Ym9hcmQgaW5wdXQgb24gdGhpcyBlbGVtZW50IGFuZCBpdHMgZGlnaXRzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgYWN0aXZlOiBFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgbGV0IG51bUVudGVyZWQ6IG51bWJlciA9IF9ldmVudC5rZXkuY2hhckNvZGVBdCgwKSAtIDQ4O1xyXG5cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgLy8gaWYgZm9jdXMgaXMgb24gc3RlcHBlciwgZW50ZXIgaXQgYW5kIGZvY3VzIGRpZ2l0XHJcbiAgICAgIGlmIChhY3RpdmUgPT0gdGhpcykge1xyXG4gICAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FTlRFUjpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5OVU1QQURfRU5URVI6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZUlubmVyVGFicyh0cnVlKTtcclxuICAgICAgICAgICAgKDxIVE1MRWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKVsyXSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRjI6XHJcbiAgICAgICAgICAgIHRoaXMub3BlbklucHV0KHRydWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChudW1FbnRlcmVkID49IDAgJiYgbnVtRW50ZXJlZCA8PSA5KSB8fCBfZXZlbnQua2V5ID09IFwiLVwiIHx8IF9ldmVudC5rZXkgPT0gXCIrXCIpIHtcclxuICAgICAgICAgIHRoaXMub3BlbklucHV0KHRydWUpO1xyXG4gICAgICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgLy8gX2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlucHV0IGZpZWxkIG92ZXJsYXkgaXMgYWN0aXZlXHJcbiAgICAgIGlmIChhY3RpdmUuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgaWYgKF9ldmVudC5rZXkgPT0gxpIuS0VZQk9BUkRfQ09ERS5FTlRFUiB8fCBfZXZlbnQua2V5ID09IMaSLktFWUJPQVJEX0NPREUuTlVNUEFEX0VOVEVSIHx8IF9ldmVudC5rZXkgPT0gxpIuS0VZQk9BUkRfQ09ERS5UQUJVTEFUT1IpIHtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSBOdW1iZXIoKDxIVE1MSW5wdXRFbGVtZW50PmFjdGl2ZSkudmFsdWUpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICAgICAgICB0aGlzLm9wZW5JbnB1dChmYWxzZSk7XHJcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChudW1FbnRlcmVkID49IDAgJiYgbnVtRW50ZXJlZCA8PSA5KSB7XHJcbiAgICAgICAgbGV0IGRpZmZlcmVuY2U6IG51bWJlciA9IG51bUVudGVyZWQgLSBOdW1iZXIoYWN0aXZlLnRleHRDb250ZW50KSAqICh0aGlzLnZhbHVlIDwgMCA/IC0xIDogMSk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKGRpZmZlcmVuY2UpO1xyXG5cclxuICAgICAgICBsZXQgbmV4dDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+YWN0aXZlLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBpZiAobmV4dClcclxuICAgICAgICAgIG5leHQuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQua2V5ID09IFwiLVwiIHx8IF9ldmVudC5rZXkgPT0gXCIrXCIpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gKF9ldmVudC5rZXkgPT0gXCItXCIgPyAtMSA6IDEpICogTWF0aC5hYnModGhpcy52YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLlRBQlVMQVRPUilcclxuICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIHRoaXMuY2hhbmdlRGlnaXRGb2N1c3NlZCgtMSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKCsxKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfTEVGVDpcclxuICAgICAgICAgICg8SFRNTEVsZW1lbnQ+YWN0aXZlLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfUklHSFQ6XHJcbiAgICAgICAgICBsZXQgbmV4dDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+YWN0aXZlLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRU5URVI6XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLk5VTVBBRF9FTlRFUjpcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5hY3RpdmF0ZUlubmVyVGFicyhmYWxzZSk7XHJcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRjI6XHJcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMub3BlbklucHV0KHRydWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kV2hlZWwgPSAoX2V2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCBjaGFuZ2U6IG51bWJlciA9IF9ldmVudC5kZWx0YVkgPCAwID8gKzEgOiAtMTtcclxuICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKGNoYW5nZSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kSW5wdXQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLm9wZW5JbnB1dChmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAodGhpcy5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VEaWdpdEZvY3Vzc2VkKF9hbW91bnQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgZGlnaXQ6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICBpZiAoZGlnaXQgPT0gdGhpcyB8fCAhdGhpcy5jb250YWlucyhkaWdpdCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2Ftb3VudCA9IE1hdGgucm91bmQoX2Ftb3VudCk7XHJcbiAgICAgIGlmIChfYW1vdW50ID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKGRpZ2l0ID09IHRoaXMucXVlcnlTZWxlY3RvcihcIltuYW1lPWV4cF1cIikpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnZhbHVlKTtcclxuICAgICAgICBsZXQgdmFsdWU6IG51bWJlciA9IHRoaXMudmFsdWUgKiBNYXRoLnBvdygxMCwgX2Ftb3VudCk7XHJcbiAgICAgICAgY29uc29sZS5sb2codmFsdWUsIHRoaXMudmFsdWUpO1xyXG4gICAgICAgIGlmIChpc0Zpbml0ZSh2YWx1ZSkpXHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7IFxyXG4gICAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGV4cERpZ2l0OiBudW1iZXIgPSBwYXJzZUludChkaWdpdC5nZXRBdHRyaWJ1dGUoXCJleHBcIikpO1xyXG4gICAgICAvLyBAdHMtaWdub3JlIChtYW50aXNzYSBub3QgdXNlZClcclxuICAgICAgbGV0IFttYW50aXNzYSwgZXhwVmFsdWVdOiBudW1iZXJbXSA9IHRoaXMuZ2V0TWFudGlzc2FBbmRFeHBvbmVudCgpO1xyXG5cclxuICAgICAgbGV0IHByZXY6IG51bWJlciA9IHRoaXMudmFsdWU7XHJcbiAgICAgIHRoaXMudmFsdWUgKz0gX2Ftb3VudCAqIE1hdGgucG93KDEwLCBleHBEaWdpdCArIGV4cFZhbHVlKTtcclxuICAgICAgLy8gd29ya2Fyb3VuZCBwcmVjaXNpb24gcHJvYmxlbXMgb2YgamF2YXNjcmlwdFxyXG4gICAgICBpZiAoTWF0aC5hYnMocHJldiAvIHRoaXMudmFsdWUpID4gMTAwMClcclxuICAgICAgICB0aGlzLnZhbHVlID0gMDtcclxuXHJcblxyXG4gICAgICBsZXQgZXhwTmV3OiBudW1iZXI7XHJcbiAgICAgIFttYW50aXNzYSwgZXhwTmV3XSA9IHRoaXMuZ2V0TWFudGlzc2FBbmRFeHBvbmVudCgpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhtYW50aXNzYSk7XHJcbiAgICAgIHRoaXMuc2hpZnRGb2N1cyhleHBOZXcgLSBleHBWYWx1ZSk7XHJcbiAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hpZnRGb2N1cyhfbkRpZ2l0czogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGxldCBzaGlmdEZvY3VzOiBFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgaWYgKF9uRGlnaXRzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDM7IGkrKylcclxuICAgICAgICAgIGlmIChfbkRpZ2l0cyA+IDApXHJcbiAgICAgICAgICAgIHNoaWZ0Rm9jdXMgPSBzaGlmdEZvY3VzLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2hpZnRGb2N1cyA9IHNoaWZ0Rm9jdXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHJcbiAgICAgICAgKDxIVE1MRWxlbWVudD5zaGlmdEZvY3VzKS5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgc3RhbmRhcmQgdGV4dCBpbnB1dCBmaWVsZCB3aXRoIGEgbGFiZWwgdG8gaXQuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRUZXh0SW5wdXQgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2UtdGV4dGlucHV0XCIsIEN1c3RvbUVsZW1lbnRUZXh0SW5wdXQsIFN0cmluZyk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuICAgICAgXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQuaWQgPSBDdXN0b21FbGVtZW50Lm5leHRJZDtcclxuICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIERldGFpbHMgZXh0ZW5kcyBIVE1MRGV0YWlsc0VsZW1lbnQge1xyXG4gICAgcHVibGljIGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbGVnZW5kOiBzdHJpbmcgPSBcIlwiLCBfdHlwZTogc3RyaW5nKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoaXMgc2hvdWxkIGJlIHJlbW92ZWQgYWZ0ZXIgY2hhbmdpbmcgYW5pbWF0aW9uIHN0cnVjdHVyZSB0byBsb29rIG1vcmUgbGlrZSBhIG11dGF0b3JcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgX2xlZ2VuZCk7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2xlZ2VuZCk7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBfdHlwZSk7XHJcbiAgICAgIHRoaXMub3BlbiA9IHRydWU7XHJcbiAgICAgIGxldCBsYmxTdW1tYXJ5OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xyXG4gICAgICBsYmxTdW1tYXJ5LnRleHRDb250ZW50ID0gX2xlZ2VuZDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChsYmxTdW1tYXJ5KTtcclxuXHJcbiAgICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50KTtcclxuXHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfU0VULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlRPR0dMRSwgdGhpcy5obmRUb2dnbGUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIC8vIHJldHVybiB0aGlzLmV4cGFuZGVyLmNoZWNrZWQ7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wZW47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbnRlbnQoX2NvbnRlbnQ6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVwbGFjZUNoaWxkKF9jb250ZW50LCB0aGlzLmNvbnRlbnQpO1xyXG4gICAgICB0aGlzLmNvbnRlbnQgPSBfY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9leHBhbmQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgLy8gdGhpcy5leHBhbmRlci5jaGVja2VkID0gX2V4cGFuZDtcclxuICAgICAgdGhpcy5vcGVuID0gX2V4cGFuZDtcclxuICAgICAgdGhpcy5obmRUb2dnbGUobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRUb2dnbGUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50KVxyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCh0aGlzLmlzRXhwYW5kZWQgPyBFVkVOVC5FWFBBTkQgOiBFVkVOVC5DT0xMQVBTRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX05FWFQ6XHJcbiAgICAgICAgICBsZXQgbmV4dDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0LnRhYkluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1BSRVZJT1VTOlxyXG4gICAgICAgICAgbGV0IHByZXZpb3VzOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAocHJldmlvdXMgJiYgcHJldmlvdXMudGFiSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBsZXQgc2V0czogTm9kZUxpc3RPZjxIVE1MRGV0YWlsc0VsZW1lbnQ+ID0gcHJldmlvdXMucXVlcnlTZWxlY3RvckFsbChcImRldGFpbHNcIik7XHJcbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIgPSBzZXRzLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGkpXHJcbiAgICAgICAgICAgICAgZG8geyAvLyBmb2N1cyB0aGUgbGFzdCB2aXNpYmxlIHNldFxyXG4gICAgICAgICAgICAgICAgc2V0c1stLWldLmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgfSB3aGlsZSAoIXNldHNbaV0ub2Zmc2V0UGFyZW50KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHByZXZpb3VzLmZvY3VzKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19TRVQ6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnRhcmdldCAhPSB0aGlzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBwYXNzRXZlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgLy8gbGV0IHRhcmdldDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuSU5TRVJUOlxyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJJTlNFUlQgYXQgRGV0YWlsc1wiKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuSU5TRVJULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogdGhpcyB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgcGFzc0V2ZW50ID0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICghdGhpcy5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0V4cGFuZGVkKVxyXG4gICAgICAgICAgICBuZXh0ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiZGV0YWlsc1wiKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgIG5leHQgPSA8SFRNTEVsZW1lbnQ+bmV4dC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKG5leHQgJiYgbmV4dC50YWJJbmRleCA+IC0xKTtcclxuXHJcbiAgICAgICAgICBpZiAobmV4dClcclxuICAgICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgLy8gbmV4dC5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5UX1RSRUUuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgaWYgKHRoaXMuaXNFeHBhbmRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIGxldCBwcmV2aW91czogSFRNTEVsZW1lbnQgPSB0aGlzO1xyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBwcmV2aW91cyA9IDxIVE1MRWxlbWVudD5wcmV2aW91cy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgfSB3aGlsZSAocHJldmlvdXMgJiYgIShwcmV2aW91cyBpbnN0YW5jZW9mIERldGFpbHMpKTtcclxuXHJcbiAgICAgICAgICBpZiAocHJldmlvdXMpXHJcbiAgICAgICAgICAgIGlmICgoPERldGFpbHM+cHJldmlvdXMpLmlzRXhwYW5kZWQpXHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHByZXZpb3VzLmZvY3VzKCk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1NFVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFwYXNzRXZlbnQpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbiAgLy8gVE9ETzogdXNlIEN1c3RvbUVsZW1lbnQucmVnaXN0ZXI/XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWktZGV0YWlsc1wiLCBEZXRhaWxzLCB7IGV4dGVuZHM6IFwiZGV0YWlsc1wiIH0pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIERldGFpbHNBcnJheSBleHRlbmRzIERldGFpbHMge1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbGVnZW5kOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoX2xlZ2VuZCwgXCJBcnJheVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29udGVudChfY29udGVudDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuc2V0Q29udGVudChfY29udGVudCk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50Pikge1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoY2hpbGQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3IoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yW10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEN1c3RvbUVsZW1lbnQ+KSB7XHJcbiAgICAgICAgbXV0YXRvci5wdXNoKGNoaWxkLmdldE11dGF0b3JWYWx1ZSgpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZEV2ZW50TGlzdGVuZXJzKF9jaGlsZDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgX2NoaWxkLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdPdmVyKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5U3BlY2lhbCk7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOU0VSVCwgdGhpcy5obmRJbnNlcnQpO1xyXG4gICAgICBfY2hpbGQudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhcnJhbmdlKF9mb2N1czogbnVtYmVyID0gdW5kZWZpbmVkKTogdm9pZCB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogbnVtYmVyW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgc2VxdWVuY2UucHVzaChwYXJzZUludChjaGlsZC5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0Rm9jdXMoX2ZvY3VzKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRUFSUkFOR0VfQVJSQVksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGtleTogdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIiksIHNlcXVlbmNlOiBzZXF1ZW5jZSB9IH0pKTtcclxuXHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8Q3VzdG9tRWxlbWVudD4pIHtcclxuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBjb3VudC50b1N0cmluZygpKTtcclxuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgaWYgKGNoaWxkLnNldExhYmVsKVxyXG4gICAgICAgICAgY2hpbGQuc2V0TGFiZWwoY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY2hpbGQudGFiSW5kZXgpO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuTVVUQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Rm9jdXMoX2ZvY3VzOiBudW1iZXIgPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuICAgICAgaWYgKF9mb2N1cyA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBfZm9jdXMgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihfZm9jdXMsIHRoaXMuY29udGVudC5jaGlsZHJlbi5sZW5ndGggLSAxKSk7XHJcbiAgICAgIGxldCBjaGlsZDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy5jb250ZW50LmNoaWxkcmVuW19mb2N1c107XHJcbiAgICAgIGNoaWxkPy5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5wcmV2ZW50RGVmYXVsdDsgXHJcbiAgICAgIGxldCBrZXlEcmFnOiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50Pl9ldmVudC5jdXJyZW50VGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImluZGV4XCIsIGtleURyYWcpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJrZXk6XCIgKyB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKSwgXCJrZXlcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZXZlbnQuZGF0YVRyYW5zZmVyLml0ZW1zKSB7XHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xyXG4gICAgICAgIGxldCBsYWJlbDogc3RyaW5nO1xyXG4gICAgICAgIFtrZXksIGxhYmVsXSA9IGl0ZW0udHlwZS5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgaWYgKGtleSA9PSBcImtleVwiICYmIGxhYmVsID09IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpKSB7XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSlcclxuICAgICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJjb3B5XCI7XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxhYmVsID09IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIGxldCBkcm9wOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldDtcclxuICAgICAgbGV0IGtleURyb3A6IHN0cmluZyA9IGRyb3AuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBsZXQga2V5RHJhZzogc3RyaW5nID0gX2V2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5kZXhcIik7XHJcbiAgICAgIGxldCBkcmFnOiBIVE1MRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihgW2tleT1cIiR7a2V5RHJhZ31cIl1gKTtcclxuICAgICAgbGV0IGxhYmVsRHJhZzogc3RyaW5nID0gZHJhZy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuXHJcbiAgICAgIGxldCBwb3NpdGlvbjogSW5zZXJ0UG9zaXRpb24gPSBrZXlEcmFnID4ga2V5RHJvcCA/IFwiYmVmb3JlYmVnaW5cIiA6IFwiYWZ0ZXJlbmRcIjtcclxuICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIGRyYWcgPSA8SFRNTEVsZW1lbnQ+ZHJhZy5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgIGRyYWcuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgbGFiZWxEcmFnKTtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgZHJhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRyYWcpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZHJvcC5pbnNlcnRBZGphY2VudEVsZW1lbnQocG9zaXRpb24sIGRyYWcpO1xyXG5cclxuICAgICAgdGhpcy5yZWFycmFuZ2UoKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhkcmFnKTtcclxuICAgICAgZHJhZy5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnNlcnQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcImhuZEluc2VydFwiKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXlTcGVjaWFsID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgaXRlbTogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcblxyXG4gICAgICAvLyBvbmx5IHdvcmsgb24gaXRlbXMgb2YgbGlzdCwgbm90IHRoZWlyIGNoaWxkcmVuXHJcbiAgICAgIGlmICgoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpICE9IGl0ZW0gJiYgX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEUpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGZvY3VzOiBudW1iZXIgPSBwYXJzZUludChpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgbGV0IHNpYmxpbmc6IEhUTUxFbGVtZW50ID0gaXRlbTtcclxuICAgICAgbGV0IGluc2VydDogSFRNTEVsZW1lbnQgPSBpdGVtO1xyXG4gICAgICBsZXQgcGFzc0V2ZW50OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtKTtcclxuICAgICAgICAgIHRoaXMucmVhcnJhbmdlKGZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIC8vIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5JTlNFUlQ6XHJcbiAgICAgICAgLy8gICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICAgIC8vICAgY29uc29sZS5sb2coXCJJTlNFUlQgYXQgRGV0YWlsc0FycmF5XCIpO1xyXG4gICAgICAgIC8vICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuYWx0S2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rm9jdXMoLS1mb2N1cyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICBpbnNlcnQgPSA8SFRNTEVsZW1lbnQ+aXRlbS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGluc2VydC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhpbnNlcnQpO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHNpYmxpbmcgPSA8SFRNTEVsZW1lbnQ+aXRlbS5wcmV2aW91c1NpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoc2libGluZylcclxuICAgICAgICAgICAgc2libGluZy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJiZWZvcmViZWdpblwiLCBpbnNlcnQpO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoLS1mb2N1cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIGlmICghX2V2ZW50LmFsdEtleSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEZvY3VzKCsrZm9jdXMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpIHtcclxuICAgICAgICAgICAgaW5zZXJ0ID0gPEhUTUxFbGVtZW50Pml0ZW0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICBpbnNlcnQuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgaXRlbS5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoaW5zZXJ0KTtcclxuICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBzaWJsaW5nID0gPEhUTUxFbGVtZW50Pml0ZW0ubmV4dFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoc2libGluZylcclxuICAgICAgICAgICAgc2libGluZy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBpbnNlcnQpO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoKytmb2N1cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgcGFzc0V2ZW50ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFwYXNzRXZlbnQpIHtcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1aS1saXN0XCIsIERldGFpbHNBcnJheSwgeyBleHRlbmRzOiBcImRldGFpbHNcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIHRvIGRpc3BsYXkgYSBtb2RhbCBvciBub24tbW9kYWwgZGlhbG9nIHdpdGggYW4gaW50ZXJmYWNlIGZvciB0aGUgZ2l2ZW4gbXV0YXRvci5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgRGlhbG9nIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZG9tOiBIVE1MRGlhbG9nRWxlbWVudDtcclxuICAgIC8qKlxyXG4gICAgICogUHJvbXB0IHRoZSBkaWFsb2cgdG8gdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gaGVhZGxpbmUsIGNhbGwgdG8gYWN0aW9uIGFuZCBsYWJlbHMgZm9yIHRoZSBjYW5jZWwtIGFuZCBvay1idXR0b25cclxuICAgICAqIFVzZSBgYXdhaXRgIG9uIGNhbGwsIHRvIGNvbnRpbnVlIGFmdGVyIHRoZSB1c2VyIGhhcyBwcmVzc2VkIG9uZSBvZiB0aGUgYnV0dG9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwcm9tcHQoX2RhdGE6IMaSLk11dGFibGUgfCDGki5NdXRhdG9yIHwgT2JqZWN0LCBfbW9kYWw6IGJvb2xlYW4gPSB0cnVlLCBfaGVhZDogc3RyaW5nID0gXCJIZWFkbGluZVwiLCBfY2FsbFRvQWN0aW9uOiBzdHJpbmcgPSBcIkluc3RydWN0aW9uXCIsIF9vazogc3RyaW5nID0gXCJPS1wiLCBfY2FuY2VsOiBzdHJpbmcgPSBcIkNhbmNlbFwiKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgIERpYWxvZy5kb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKERpYWxvZy5kb20pO1xyXG4gICAgICBEaWFsb2cuZG9tLmlubmVySFRNTCA9IFwiPGgxPlwiICsgX2hlYWQgKyBcIjwvaDE+XCI7XHJcblxyXG4gICAgICBsZXQgY29udGVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgIGlmIChfZGF0YSBpbnN0YW5jZW9mIMaSLk11dGFibGUpXHJcbiAgICAgICAgY29udGVudCA9IEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YWJsZShfZGF0YSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBjb250ZW50ID0gR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKF9kYXRhKTtcclxuICAgICAgY29udGVudC5pZCA9IFwiY29udGVudFwiO1xyXG4gICAgICBEaWFsb2cuZG9tLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG5cclxuICAgICAgbGV0IGZvb3RlcjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIpO1xyXG4gICAgICBmb290ZXIuaW5uZXJIVE1MID0gXCI8cD5cIiArIF9jYWxsVG9BY3Rpb24gKyBcIjwvcD5cIjtcclxuICAgICAgbGV0IGJ0bkNhbmNlbDogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICBidG5DYW5jZWwuaW5uZXJIVE1MID0gX2NhbmNlbDtcclxuICAgICAgaWYgKF9jYW5jZWwgIT0gXCJcIilcclxuICAgICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuQ2FuY2VsKTtcclxuICAgICAgbGV0IGJ0bk9rOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIGJ0bk9rLmlubmVySFRNTCA9IF9vaztcclxuICAgICAgZm9vdGVyLmFwcGVuZENoaWxkKGJ0bk9rKTtcclxuICAgICAgRGlhbG9nLmRvbS5hcHBlbmRDaGlsZChmb290ZXIpO1xyXG4gICAgICBpZiAoX21vZGFsKVxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIERpYWxvZy5kb20uc2hvd01vZGFsKCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBEaWFsb2cuZG9tLnNob3coKTtcclxuXHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoX3Jlc29sdmUpID0+IHtcclxuICAgICAgICBsZXQgaG5kQnV0dG9uOiAoX2V2ZW50OiBFdmVudCkgPT4gdm9pZCA9IChfZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBidG5DYW5jZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhuZEJ1dHRvbik7XHJcbiAgICAgICAgICBidG5Pay5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaG5kQnV0dG9uKTtcclxuICAgICAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IGJ0bk9rKVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIENvbnRyb2xsZXIudXBkYXRlTXV0YXRvcihjb250ZW50LCBfZGF0YSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKF9lKSB7XHJcbiAgICAgICAgICAgICAgxpIuRGVidWcuaW5mbyhfZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgRGlhbG9nLmRvbS5jbG9zZSgpO1xyXG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChEaWFsb2cuZG9tKTtcclxuICAgICAgICAgIF9yZXNvbHZlKF9ldmVudC50YXJnZXQgPT0gYnRuT2spO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgYnRuQ2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0xJQ0ssIGhuZEJ1dHRvbik7XHJcbiAgICAgICAgYnRuT2suYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DTElDSywgaG5kQnV0dG9uKTtcclxuICAgICAgICBidG5Pay5mb2N1cygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiA8c2VsZWN0PjxvcHRpb24+SGFsbG88L29wdGlvbj48L3NlbGVjdD5cclxuICAgKi9cclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBNdWx0aUxldmVsTWVudU1hbmFnZXIge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYnVpbGRGcm9tU2lnbmF0dXJlKF9zaWduYXR1cmU6IHN0cmluZywgX211dGF0b3I/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgfHwge307XHJcbiAgICAgIGxldCBzaWduYXR1cmVMZXZlbHM6IHN0cmluZ1tdID0gX3NpZ25hdHVyZS5zcGxpdChcIi5cIik7XHJcbiAgICAgIGlmIChzaWduYXR1cmVMZXZlbHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgIGxldCBzdWJTaWduYXR1cmU6IHN0cmluZyA9IHNpZ25hdHVyZUxldmVsc1sxXTtcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAyOyBpIDwgc2lnbmF0dXJlTGV2ZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBzdWJTaWduYXR1cmUgPSBzdWJTaWduYXR1cmUgKyBcIi5cIiArIHNpZ25hdHVyZUxldmVsc1tpXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgbXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dID0gdGhpcy5idWlsZEZyb21TaWduYXR1cmUoc3ViU2lnbmF0dXJlLCA8xpIuTXV0YXRvcj5tdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHRoaXMuYnVpbGRGcm9tU2lnbmF0dXJlKHN1YlNpZ25hdHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHNpZ25hdHVyZUxldmVsc1swXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIHRvIGRpc3BsYXkgYSBtb2RhbCB3YXJuaW5nLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBXYXJuaW5nIHtcclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSBhIHdhcm5pbmcgdG8gdGhlIHVzZXIgd2l0aCB0aGUgZ2l2ZW4gaGVhZGxpbmUsIHdhcm5pbmcgdGV4dCBhbmQgb2sgYnV0dGVuIHRleHQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzcGxheShfZXJyb3JzOiBzdHJpbmdbXSA9IFtdLCBfaGVhZGxpbmU6IHN0cmluZyA9IFwiSGVhZGxpbmVcIiwgX3dhcm5pbmc6IHN0cmluZyA9IFwiV2FybmluZ1wiLCBfb2s6IHN0cmluZyA9IFwiT0tcIik6IHZvaWQge1xyXG4gICAgICBsZXQgd2FybmluZzogSFRNTERpYWxvZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGlhbG9nXCIpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdhcm5pbmcpO1xyXG4gICAgICB3YXJuaW5nLmlubmVySFRNTCA9IFwiPGgxPlwiICsgX2hlYWRsaW5lICsgXCI8L2gxPlwiO1xyXG5cclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgY29udGVudC5pZCA9IFwiY29udGVudFwiO1xyXG4gICAgICBjb250ZW50LmlubmVyVGV4dCA9IF9lcnJvcnMuam9pbihcIlxcblwiKTtcclxuICAgICAgd2FybmluZy5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuXHJcbiAgICAgIGxldCBmb290ZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvb3RlclwiKTtcclxuICAgICAgZm9vdGVyLmlubmVySFRNTCA9IFwiPHA+XCIgKyBfd2FybmluZyArIFwiPC9wPlwiO1xyXG4gICAgICBsZXQgYnRuT2s6IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnRuT2suaW5uZXJIVE1MID0gX29rO1xyXG4gICAgICBidG5Pay5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHdhcm5pbmcuY2xvc2UoKTtcclxuICAgICAgICB3YXJuaW5nLnJlbW92ZSgpO1xyXG4gICAgICB9O1xyXG4gICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuT2spO1xyXG4gICAgICB3YXJuaW5nLmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcbiAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICB3YXJuaW5nLnNob3dNb2RhbCgpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvLyBUT0RPOiBkdXBsaWNhdGVkIGNvZGUgaW4gVGFibGUgYW5kIFRyZWUsIG1heSBiZSBvcHRpbWl6ZWQuLi5cclxuXHJcbiAgZXhwb3J0IGludGVyZmFjZSBUQUJMRSB7XHJcbiAgICBsYWJlbDogc3RyaW5nO1xyXG4gICAga2V5OiBzdHJpbmc7XHJcbiAgICBlZGl0YWJsZTogYm9vbGVhbjtcclxuICAgIHNvcnRhYmxlOiBib29sZWFuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFuYWdlcyBhIHNvcnRhYmxlIHRhYmxlIG9mIGRhdGEgZ2l2ZW4gYXMgc2ltcGxlIGFycmF5IG9mIGZsYXQgb2JqZWN0cyAgIFxyXG4gICAqIGBgYHRleHRcclxuICAgKiBLZXkwICBLZXkxIEtleTJcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVGFibGU8VCBleHRlbmRzIE9iamVjdD4gZXh0ZW5kcyBIVE1MVGFibGVFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD47XHJcbiAgICBwdWJsaWMgZGF0YTogVFtdO1xyXG4gICAgcHVibGljIGF0dEljb246IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPiwgX2RhdGE6IFRbXSwgX2F0dEljb24/OiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICB0aGlzLmF0dEljb24gPSBfYXR0SWNvbjtcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInNvcnRhYmxlXCI7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU09SVCwgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRTb3J0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfTkVYVCwgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FU0NBUEUsIHRoaXMuaG5kRXNjYXBlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNPUFksIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNVVCwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUEFTVEUsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgdGFibGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBsZXQgaGVhZDogVEFCTEVbXSA9IHRoaXMuY29udHJvbGxlci5nZXRIZWFkKCk7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSGVhZChoZWFkKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIHRoaXMuZGF0YSkge1xyXG4gICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgZGF0YSwgdGhpcy5hdHRJY29uKTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG9iamVjdCBpbiBmb2N1c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Rm9jdXNzZWQoKTogVCB7XHJcbiAgICAgIGxldCBpdGVtczogVGFibGVJdGVtPFQ+W10gPSA8VGFibGVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSk7XHJcbiAgICAgIGxldCBmb3VuZDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZig8VGFibGVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICBpZiAoZm91bmQgPiAtMSlcclxuICAgICAgICByZXR1cm4gaXRlbXNbZm91bmRdLmRhdGE7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0SW50ZXJ2YWwoX2RhdGFTdGFydDogVCwgX2RhdGFFbmQ6IFQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpO1xyXG4gICAgICBsZXQgc2VsZWN0aW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGxldCBlbmQ6IFQgPSBudWxsO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XHJcbiAgICAgICAgaWYgKCFzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIHNlbGVjdGluZyA9IHRydWU7XHJcbiAgICAgICAgICBpZiAoaXRlbS5kYXRhID09IF9kYXRhU3RhcnQpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhRW5kO1xyXG4gICAgICAgICAgZWxzZSBpZiAoaXRlbS5kYXRhID09IF9kYXRhRW5kKVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YVN0YXJ0O1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGVjdGluZykge1xyXG4gICAgICAgICAgaXRlbS5zZWxlY3QodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgaWYgKGl0ZW0uZGF0YSA9PSBlbmQpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfZGF0YVN0YXJ0LCBfZGF0YUVuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BsYXlTZWxlY3Rpb24oX2RhdGE6IFRbXSk6IHZvaWQge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfZGF0YSk7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpdGVtLnNlbGVjdGVkID0gKF9kYXRhICE9IG51bGwgJiYgX2RhdGEuaW5kZXhPZihpdGVtLmRhdGEpID4gLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlSGVhZChfaGVhZEluZm86IFRBQkxFW10pOiBIVE1MVGFibGVSb3dFbGVtZW50IHtcclxuICAgICAgbGV0IHRyOiBIVE1MVGFibGVSb3dFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBfaGVhZEluZm8pIHtcclxuICAgICAgICBsZXQgdGg6IEhUTUxUYWJsZUNlbGxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRoXCIpO1xyXG4gICAgICAgIHRoLnRleHRDb250ZW50ID0gZW50cnkubGFiZWw7XHJcbiAgICAgICAgdGguc2V0QXR0cmlidXRlKFwia2V5XCIsIGVudHJ5LmtleSk7XHJcblxyXG4gICAgICAgIGlmIChlbnRyeS5zb3J0YWJsZSkge1xyXG4gICAgICAgICAgdGguYXBwZW5kQ2hpbGQodGhpcy5nZXRTb3J0QnV0dG9ucygpKTtcclxuICAgICAgICAgIHRoLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICAgIEVWRU5ULkNIQU5HRSxcclxuICAgICAgICAgICAgKF9ldmVudDogRXZlbnQpID0+IHRoLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNPUlQsIHsgZGV0YWlsOiBfZXZlbnQudGFyZ2V0LCBidWJibGVzOiB0cnVlIH0pKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHIuYXBwZW5kQ2hpbGQodGgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFNvcnRCdXR0b25zKCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IHJlc3VsdDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgZm9yIChsZXQgZGlyZWN0aW9uIG9mIFtcInVwXCIsIFwiZG93blwiXSkge1xyXG4gICAgICAgIGxldCBidXR0b246IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgYnV0dG9uLnR5cGUgPSBcInJhZGlvXCI7XHJcbiAgICAgICAgYnV0dG9uLm5hbWUgPSBcInNvcnRcIjtcclxuICAgICAgICBidXR0b24udmFsdWUgPSBkaXJlY3Rpb247XHJcbiAgICAgICAgcmVzdWx0LmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFNvcnQoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgdmFsdWU6IHN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQuZGV0YWlsKS52YWx1ZTtcclxuICAgICAgbGV0IGtleTogc3RyaW5nID0gKDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGxldCBkaXJlY3Rpb246IG51bWJlciA9ICh2YWx1ZSA9PSBcInVwXCIpID8gMSA6IC0xO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc29ydCh0aGlzLmRhdGEsIGtleSwgZGlyZWN0aW9uKTtcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHByaXZhdGUgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgLy8gICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAvLyAgIC8vIHRoaXMuYWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMsIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC50YXJnZXQpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogVGFibGVJdGVtPFQ+ID0gPFRhYmxlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBkZWxldGVkOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFt0YXJnZXQuZGF0YV0pO1xyXG4gICAgICBpZiAoZGVsZXRlZC5sZW5ndGgpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IENsaXBib2FyZEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkNPUFk6XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY29weSh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyAgXHJcbiAgICAgICAgICBsZXQgY3V0OiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuY3V0KHRoaXMuZ2V0Rm9jdXNzZWQoKSwgX2V2ZW50LnR5cGUpO1xyXG4gICAgICAgICAgaWYgKGN1dC5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUkVNT1ZFX0NISUxELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5QQVNURTpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIucGFzdGUoKTtcclxuICAgICAgICAgIGZvciAobGV0IG9iamVjdCBvZiBvYmplY3RzKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgb2JqZWN0LCB0aGlzLmF0dEljb24pO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdEcm9wID0gYXN5bmMgKF9ldmVudDogRHJhZ0V2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5SZWZsZWN0LmdldChfZXZlbnQsIFwiaXRlbVwiKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUkFHX1NUQVJUOlxyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJhbGxcIjtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnU3RhcnQoaXRlbS5kYXRhKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJBR19PVkVSOlxyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gdGhpcy5jb250cm9sbGVyLmRyYWdPdmVyKF9ldmVudCk7XHJcbiAgICAgICAgICAvLyBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJPUDpcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZHJvcCgpO1xyXG4gICAgICAgICAgZm9yIChsZXQgb2JqZWN0IG9mIG9iamVjdHMpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW06IFRhYmxlSXRlbTxUPiA9IG5ldyBUYWJsZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBvYmplY3QsIHRoaXMuYXR0SWNvbik7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBpdGVtczogVGFibGVJdGVtPFQ+W10gPSA8VGFibGVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRhYmxlSXRlbTxUPiA9IDxUYWJsZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInRhYmxlLXNvcnRhYmxlXCIsIFRhYmxlLCB7IGV4dGVuZHM6IFwidGFibGVcIiB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBTdWJjbGFzcyB0aGlzIHRvIGNyZWF0ZSBhIGJyb2tlciBiZXR3ZWVuIHlvdXIgZGF0YSBhbmQgYSBbW1RhYmxlXV0gdG8gZGlzcGxheSBhbmQgbWFuaXB1bGF0ZSBpdC5cclxuICAgKiBUaGUgW1tUYWJsZV1dIGRvZXNuJ3Qga25vdyBob3cgeW91ciBkYXRhIGlzIHN0cnVjdHVyZWQgYW5kIGhvdyB0byBoYW5kbGUgaXQsIHRoZSBjb250cm9sbGVyIGltcGxlbWVudHMgdGhlIG1ldGhvZHMgbmVlZGVkXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRhYmxlQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gc2VsZWN0ZWQgb2JqZWN0cy4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgc2VsZWN0aW9uIHNob3VsZCBhbHNvIG9wZXJhdGUgb3V0c2lkZSBvZiB0YWJsZSAqL1xyXG4gICAgcHVibGljIHNlbGVjdGlvbjogVFtdID0gW107XHJcblxyXG4gICAgLy8jcmVnaW9uIFJlcGxhY2Ugd2l0aCBDbGlwYm9hcmRcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGJlaW5nIGRyYWdnZWQsIGFuZCBvYmplY3RzIHRvIGRyb3Agb24uIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIGRyYWcmZHJvcCBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRhYmxlICovXHJcbiAgICBwdWJsaWMgZHJhZ0Ryb3A6IHsgc291cmNlczogVFtdOyB0YXJnZXQ6IFQgfSA9IHsgc291cmNlczogW10sIHRhcmdldDogbnVsbCB9O1xyXG4gICAgLyoqIFN0b3JlcyByZWZlcmVuY2VzIHRvIG9iamVjdHMgYmVpbmcgY29waWVkIG9yIGN1dCwgYW5kIG9iamVjdHMgdG8gcGFzdGUgdG8uIE92ZXJyaWRlIHdpdGggcmVmZXJlbmNlcyBpbiBvdXRlciBzY29wZSwgaWYgY29weSZwYXN0ZSBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRyZWUgKi9cclxuICAgIHB1YmxpYyBjb3B5UGFzdGU6IHsgc291cmNlczogVFtdOyB0YXJnZXQ6IFQgfSA9IHsgc291cmNlczogW10sIHRhcmdldDogbnVsbCB9O1xyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVtb3ZlIHRoZSBvYmplY3RzIHRvIGJlIGRlbGV0ZWQsIGUuZy4gdGhlIGN1cnJlbnQgc2VsZWN0aW9uLCBmcm9tIHRoZSBkYXRhIHN0cnVjdHVyZSB0aGUgdGFibGUgcmVmZXJzIHRvIGFuZCBcclxuICAgICAqIHJldHVybiBhIGxpc3Qgb2YgdGhvc2Ugb2JqZWN0cyBpbiBvcmRlciBmb3IgdGhlIGFjY29yZGluZyB7QGxpbmsgVGFibGVJdGVtc30gdG8gYmUgZGVsZXRlZCBhbHNvICAgXHJcbiAgICAgKiBAcGFyYW0gX2V4cGVuZGFibGVzIFRoZSBleHBlbmRhYmxlIG9iamVjdHMgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBkZWxldGUoX2V4cGVuZGFibGVzOiBUW10pOiBQcm9taXNlPFRbXT4ge1xyXG4gICAgICByZXR1cm4gX2V4cGVuZGFibGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJlZmVyIGl0ZW1zIHRvIHRoZSBjbGlwYm9hcmQgZm9yIGNvcHkgJiBwYXN0ZSAgIFxyXG4gICAgICogQHBhcmFtIF9mb2N1cyBUaGUgdGhhdCBoYXMgdGhlIGZvY3VzIGFuZCB0aGF0IHdpbGwgYmUgY29waWVkIGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvcHkoX2ZvY3VzOiBULCBfb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uKTogVFtdIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPyB0aGlzLnNlbGVjdGlvbiA6IFtfZm9jdXNdO1xyXG4gICAgICBDbGlwYm9hcmQuY29weVBhc3RlLnNldChpdGVtcywgX29wZXJhdGlvbiwgbnVsbCk7XHJcbiAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuICAgIC8qKiBcclxuICAgICAqIFJlZmVyIG9iamVjdHMgdG8gdGhlIGNsaXBib2FyZCBmb3IgY29weSAmIHBhc3RlIGFuZCBkZWxldGUgdGhlbSBmcm9tIHRoaXMgY29udHJvbGxlciAgIFxyXG4gICAgICogQHBhcmFtIF9mb2N1cyBUaGUgaXRlbSB0aGF0IGhhcyB0aGUgZm9jdXMgYW5kIHRoYXQgd2lsbCBiZSBjdXQgaWYgdGhlIHNlbGVjdGlvbiBpcyBlbXB0eVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgY3V0KF9mb2N1czogVCwgX29wZXJhdGlvbjogQ2xpcE9wZXJhdGlvbik6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIGxldCBpdGVtczogVFtdID0gdGhpcy5jb3B5KF9mb2N1cywgX29wZXJhdGlvbik7XHJcbiAgICAgIGl0ZW1zID0gYXdhaXQgdGhpcy5kZWxldGUoaXRlbXMpO1xyXG4gICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0cmlldmUgb2JqZWN0cyBmcm9tIHRoZSBjbGlwYm9hcmQsIHByb2Nlc3MgYW5kIHJldHVybiB0aGVtIHRvIGFkZCB0byB0aGUgdGFibGUgICBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIHBhc3RlKF9jbGFzczogbmV3ICgpID0+IFQgPSBudWxsKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IENsaXBib2FyZC5jb3B5UGFzdGUuZ2V0KF9jbGFzcywgdHJ1ZSk7IC8vIHBvc3NpYmxlIHRvIGZpbHRlciBmb3Igb25seSBvYmplY3RzIG9mIHNwZWNpZmljIHR5cGVcclxuICAgICAgcmV0dXJuIG9iamVjdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVmZXIgb2JqZWN0cyB0byB0aGUgY2xpcGJvYXJkIGZvciBkcmFnICYgZHJvcCAgIFxyXG4gICAgICogQHBhcmFtIF9mb2N1cyBUaGUgaXRlbSB0aGF0IGhhcyB0aGUgZm9jdXMgYW5kIHRoYXQgd2lsbCBiZSBkcmFnZ2VkIGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRyYWdTdGFydChfZm9jdXM6IFQpOiB2b2lkIHtcclxuICAgICAgLy8gaWYgdGhlIGZvY3Vzc2VkIGl0ZW0gaXMgaW4gdGhlIHNlbGVjdGlvbiwgZHJhZyB0aGUgd2hvbGUgc2VsZWN0aW9uXHJcbiAgICAgIGxldCBpdGVtczogVFtdID0gdGhpcy5zZWxlY3Rpb24uaW5kZXhPZihfZm9jdXMpIDwgMCA/IFtfZm9jdXNdIDogdGhpcy5zZWxlY3Rpb247XHJcbiAgICAgIENsaXBib2FyZC5kcmFnRHJvcC5zZXQoaXRlbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHVybiBhbGxvd2VkIGRyYWdEcm9wLWVmZmVjdCAgIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQpOiBEUk9QRUZGRUNUIHtcclxuICAgICAgbGV0IGRyb3BFZmZlY3Q6IERST1BFRkZFQ1QgPSBcIm1vdmVcIjtcclxuICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIGRyb3BFZmZlY3QgPSBcImNvcHlcIjtcclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICBkcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIHJldHVybiBkcm9wRWZmZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHJpZXZlIG9iamVjdHMgZnJvbSB0aGUgY2xpcGJvYXJkLCBhbmQgcHJvY2VzcyBhbmQgcmV0dXJuIHRoZW0gdG8gYWRkIHRvIHRoZSB0YWJsZSAgIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgZHJvcChfY2xhc3M6IG5ldyAoKSA9PiBUID0gbnVsbCk6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIGxldCBvYmplY3RzOiBUW10gPSBDbGlwYm9hcmQuZHJhZ0Ryb3AuZ2V0KF9jbGFzcywgdHJ1ZSk7IC8vIHBvc3NpYmxlIHRvIGZpbHRlciBmb3Igb25seSBvYmplY3RzIG9mIHNwZWNpZmljIHR5cGVcclxuICAgICAgcmV0dXJuIG9iamVjdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFJldHJpZXZlIGEgc3RyaW5nIHRvIGNyZWF0ZSBhIGxhYmVsIGZvciB0aGUgdGFibGUgaXRlbSByZXByZXNlbnRpbmcgdGhlIG9iamVjdCAoYXBwZWFycyBub3QgdG8gYmUgY2FsbGVkIHlldCkgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TGFiZWwoX29iamVjdDogVCk6IHN0cmluZztcclxuXHJcbiAgICAvKiogUmV0dXJuIGZhbHNlIGlmIHJlbmFtaW5nIG9mIG9iamVjdCBpcyBub3QgcG9zc2liaWxlLCBvciB0cnVlIGlmIHRoZSBvYmplY3Qgd2FzIHJlbmFtZWQgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCByZW5hbWUoX29iamVjdDogVCwgX25ldzogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPjtcclxuXHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGEgbGlzdCBvZiBjbG9uZXMgb2YgdGhlIG9iamVjdHMgZ2l2ZW4gZm9yIGNvcHkgJiBwYXN0ZSBvciBkcmFnICYgZHJvcFxyXG4gICAgICogQHBhcmFtIF9vcmlnaW5hbHMgVGhlIG9iamVjdHMgdG8gY2xvbmVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IC8qIGFzeW5jICovIGNsb25lKF9vcmlnaW5hbHM6IFRbXSk6IFByb21pc2U8VFtdPjtcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXR1cm4gYSBsaXN0IG9mIFRBQkxFLW9iamVjdHMgZGVzY3JpYmluZyB0aGUgaGVhZC10aXRsZXMgYW5kIGFjY29yZGluZyBwcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRIZWFkKCk6IFRBQkxFW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTb3J0IGRhdGEgYnkgZ2l2ZW4ga2V5IGFuZCBkaXJlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNvcnQoX2RhdGE6IFRbXSwgX2tleTogc3RyaW5nLCBfZGlyZWN0aW9uOiBudW1iZXIpOiB2b2lkO1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHRyLWVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGFuIG9iamVjdCBpbiBhIFtbVGFibGVdXVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUYWJsZUl0ZW08VCBleHRlbmRzIE9iamVjdD4gZXh0ZW5kcyBIVE1MVGFibGVSb3dFbGVtZW50IHtcclxuICAgIHB1YmxpYyBkYXRhOiBUID0gbnVsbDtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD4sIF9kYXRhOiBULCBfYXR0SWNvbjogc3RyaW5nKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmRhdGEgPSBfZGF0YTtcclxuICAgICAgLy8gdGhpcy5kaXNwbGF5ID0gdGhpcy5jb250cm9sbGVyLmdldExhYmVsKF9kYXRhKTtcclxuICAgICAgLy8gVE9ETzogaGFuZGxlIGNzc0NsYXNzZXNcclxuICAgICAgdGhpcy5jcmVhdGUodGhpcy5jb250cm9sbGVyLmdldEhlYWQoKSwgX2F0dEljb24pO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFwidGFibGVcIjtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QT0lOVEVSX1VQLCB0aGlzLmhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgICB0aGlzLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuXHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5VUERBVEUsIHRoaXMuaG5kVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYXR0YWNoZXMgb3IgZGV0YWNoZXMgdGhlIFtbQ1NTX0NMQVNTLlNFTEVDVEVEXV0gdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWQoX29uOiBib29sZWFuKSB7XHJcbiAgICAgIGlmIChfb24pXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgW1tUUkVFX0NMQVNTRVMuU0VMRUNURURdXSBpcyBhdHRhY2hlZCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIHRoZSBbW0VWRU5ULlNFTEVDVF1dIGV2ZW50XHJcbiAgICAgKiBAcGFyYW0gX2FkZGl0aXZlIEZvciBtdWx0aXBsZSBzZWxlY3Rpb24gKCtDdHJsKSBcclxuICAgICAqIEBwYXJhbSBfaW50ZXJ2YWwgRm9yIHNlbGVjdGlvbiBvdmVyIGludGVydmFsICgrU2hpZnQpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZWxlY3QoX2FkZGl0aXZlOiBib29sZWFuLCBfaW50ZXJ2YWw6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgICBsZXQgZXZlbnQ6IEN1c3RvbUV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNFTEVDVCwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhLCBhZGRpdGl2ZTogX2FkZGl0aXZlLCBpbnRlcnZhbDogX2ludGVydmFsIH0gfSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoX2ZpbHRlcjogVEFCTEVbXSwgX2F0dEljb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBfZmlsdGVyKSB7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmcgPSA8c3RyaW5nPlJlZmxlY3QuZ2V0KHRoaXMuZGF0YSwgZW50cnkua2V5KTtcclxuICAgICAgICBsZXQgaWNvbjogc3RyaW5nID0gPHN0cmluZz5SZWZsZWN0LmdldCh0aGlzLmRhdGEsIF9hdHRJY29uKTtcclxuICAgICAgICBsZXQgdGQ6IEhUTUxUYWJsZUNlbGxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xyXG4gICAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC50eXBlID0gXCJ0ZXh0XCI7XHJcbiAgICAgICAgaW5wdXQuZGlzYWJsZWQgPSAhZW50cnkuZWRpdGFibGU7XHJcbiAgICAgICAgaW5wdXQucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwia2V5XCIsIGVudHJ5LmtleSk7XHJcblxyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kSW5wdXRFdmVudCk7XHJcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ET1VCTEVfQ0xJQ0ssIHRoaXMuaG5kSW5wdXRFdmVudCk7XHJcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19PVVQsIHRoaXMuaG5kQ2hhbmdlKTtcclxuXHJcbiAgICAgICAgdGQuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGQpO1xyXG4gICAgICAgIGlmIChpY29uKVxyXG4gICAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJpY29uXCIsIGljb24pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kSW5wdXRFdmVudCA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQgfCBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQgaW5zdGFuY2VvZiBLZXlib2FyZEV2ZW50ICYmIF9ldmVudC5jb2RlICE9IMaSLktFWUJPQVJEX0NPREUuRjIpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgaW5wdXQucmVhZE9ubHkgPSBmYWxzZTtcclxuICAgICAgaW5wdXQuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICB0YXJnZXQucmVhZE9ubHkgPSB0cnVlO1xyXG4gICAgICAvLyBsZXQga2V5OiBzdHJpbmcgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICAvLyBsZXQgcHJldmlvdXNWYWx1ZTogxpIuR2VuZXJhbCA9IFJlZmxlY3QuZ2V0KHRoaXMuZGF0YSwga2V5KTtcclxuXHJcbiAgICAgIGlmIChhd2FpdCB0aGlzLmNvbnRyb2xsZXIucmVuYW1lKHRoaXMuZGF0YSwgdGFyZ2V0LnZhbHVlKSkge1xyXG4gICAgICAgIC8vIFJlZmxlY3Quc2V0KHRoaXMuZGF0YSwga2V5LCB0YXJnZXQudmFsdWUpOyAvLyB3aHkgc2hvdWxkbid0IHRoZSBjb250cm9sbGVyIGRvIHRoaXM/XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJEaXNwYXRjaCBSZW5hbWVcIik7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlJFTkFNRSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhIH0gfSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybjtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgIT0gdGhpcylcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlNQQUNFOlxyXG4gICAgICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5FU0NBUEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5ERUxFVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQzpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DT1BZLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlY6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuWDpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdEcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHN0b3JlIHRoZSBkcmFnZ2VkIGl0ZW0gaW4gdGhlIGV2ZW50IGZvciBmdXJ0aGVyIHByb2Nlc3NpbmcgaW4gdGFibGVcclxuICAgICAgUmVmbGVjdC5zZXQoX2V2ZW50LCBcIml0ZW1cIiwgdGhpcyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlclVwID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH07XHJcbiAgfVxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInRhYmxlLWl0ZW1cIiwgPEN1c3RvbUVsZW1lbnRDb25zdHJ1Y3Rvcj48dW5rbm93bj5UYWJsZUl0ZW0sIHsgZXh0ZW5kczogXCJ0clwiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiB1bC1lbGVtZW50IHRoYXQga2VlcHMgYSBsaXN0IG9mIHtAbGluayBUcmVlSXRlbX1zIHRvIHJlcHJlc2VudCBhIGJyYW5jaCBpbiBhIHRyZWVcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVHJlZUxpc3Q8VD4gZXh0ZW5kcyBIVE1MVUxpc3RFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUcmVlQ29udHJvbGxlcjxUPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+LCBfaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSBbXSkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5hZGRJdGVtcyhfaXRlbXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdPdmVyKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInRyZWVcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4cGFuZHMgdGhlIHRyZWUgYWxvbmcgdGhlIGdpdmVuIHBhdGhzIHRvIHNob3cgdGhlIG9iamVjdHMgdGhlIHBhdGhzIGluY2x1ZGUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBleHBhbmQoX3BhdGhzOiBUW11bXSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBwYXRoIG9mIF9wYXRocylcclxuICAgICAgICB0aGlzLnNob3cocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHBhbmRzIHRoZSB0cmVlIGFsb25nIHRoZSBnaXZlbiBwYXRoIHRvIHNob3cgdGhlIG9iamVjdHMgdGhlIHBhdGggaW5jbHVkZXMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93KF9wYXRoOiBUW10pOiB2b2lkIHtcclxuICAgICAgbGV0IGN1cnJlbnRUcmVlOiBUcmVlTGlzdDxUPiA9IHRoaXM7XHJcblxyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIF9wYXRoKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gY3VycmVudFRyZWUuZmluZEl0ZW0oZGF0YSk7XHJcbiAgICAgICAgaWYgKCFpdGVtKVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFpdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgICAgaXRlbS5leHBhbmQodHJ1ZSk7XHJcblxyXG4gICAgICAgIGN1cnJlbnRUcmVlID0gaXRlbS5nZXRCcmFuY2goKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzdHJ1Y3R1cmVzIHRoZSBsaXN0IHRvIHN5bmMgd2l0aCB0aGUgZ2l2ZW4gbGlzdC4gXHJcbiAgICAgKiB7QGxpbmsgVHJlZUl0ZW19cyByZWZlcmVuY2luZyB0aGUgc2FtZSBvYmplY3QgcmVtYWluIGluIHRoZSBsaXN0LCBuZXcgaXRlbXMgZ2V0IGFkZGVkIGluIHRoZSBvcmRlciBvZiBhcHBlYXJhbmNlLCBvYnNvbGV0ZSBvbmVzIGFyZSBkZWxldGVkLlxyXG4gICAgICogQHBhcmFtIF90cmVlIEEgbGlzdCB0byBzeW5jIHRoaXMgd2l0aFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzdHJ1Y3R1cmUoX3RyZWU6IFRyZWVMaXN0PFQ+KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogVHJlZUl0ZW08VD5bXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF90cmVlLmdldEl0ZW1zKCkpIHtcclxuICAgICAgICBsZXQgZm91bmQ6IFRyZWVJdGVtPFQ+ID0gdGhpcy5maW5kSXRlbShpdGVtLmRhdGEpO1xyXG4gICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgZm91bmQucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgICAgIGZvdW5kLmhhc0NoaWxkcmVuID0gaXRlbS5oYXNDaGlsZHJlbjtcclxuICAgICAgICAgIGlmICghZm91bmQuaGFzQ2hpbGRyZW4pXHJcbiAgICAgICAgICAgIGZvdW5kLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICBpdGVtcy5wdXNoKGZvdW5kKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy5hZGRJdGVtcyhpdGVtcyk7XHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbih0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHtAbGluayBUcmVlSXRlbX0gb2YgdGhpcyBsaXN0IHJlZmVyZW5jaW5nIHRoZSBnaXZlbiBvYmplY3Qgb3IgbnVsbCwgaWYgbm90IGZvdW5kXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmaW5kSXRlbShfZGF0YTogVCk6IFRyZWVJdGVtPFQ+IHtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLmNoaWxkcmVuKVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKCg8VHJlZUl0ZW08VD4+aXRlbSkuZGF0YSwgX2RhdGEpKVxyXG4gICAgICAgICAgcmV0dXJuIDxUcmVlSXRlbTxUPj5pdGVtO1xyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBnaXZlbiB7QGxpbmsgVHJlZUl0ZW19cyBhdCB0aGUgZW5kIG9mIHRoaXMgbGlzdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkSXRlbXMoX2l0ZW1zOiBUcmVlSXRlbTxUPltdKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2l0ZW1zKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY29udGVudCBvZiB0aGlzIGxpc3QgYXMgYXJyYXkgb2Yge0BsaW5rIFRyZWVJdGVtfXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEl0ZW1zKCk6IFRyZWVJdGVtPFQ+W10ge1xyXG4gICAgICByZXR1cm4gPFRyZWVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLmNoaWxkcmVuKS5maWx0ZXIoX2NoaWxkID0+IF9jaGlsZCBpbnN0YW5jZW9mIFRyZWVJdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGxheVNlbGVjdGlvbihfZGF0YTogVFtdKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaXRlbS5zZWxlY3RlZCA9IChfZGF0YSAhPSBudWxsICYmIF9kYXRhLmluZGV4T2YoaXRlbS5kYXRhKSA+IC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0SW50ZXJ2YWwoX2RhdGFTdGFydDogVCwgX2RhdGFFbmQ6IFQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IHNlbGVjdGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICBsZXQgZW5kOiBUID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgIGlmICghc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBzZWxlY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoaXRlbS5kYXRhLCBfZGF0YVN0YXJ0KSlcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFFbmQ7XHJcbiAgICAgICAgICBlbHNlIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgX2RhdGFFbmQpKVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YVN0YXJ0O1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGVjdGluZykge1xyXG4gICAgICAgICAgaXRlbS5zZWxlY3QodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoaXRlbS5kYXRhLCBlbmQpKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlKF9kYXRhOiBUW10pOiBUcmVlSXRlbTxUPltdIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IGRlbGV0ZWQ6IFRyZWVJdGVtPFQ+W10gPSBbXTtcclxuXHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaWYgKF9kYXRhLmluZGV4T2YoaXRlbS5kYXRhKSA+IC0xKSB7XHJcbiAgICAgICAgICBpdGVtLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlJFTU9WRV9DSElMRCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGRlbGV0ZWQucHVzaChpdGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaXRlbSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBkZWxldGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmaW5kVmlzaWJsZShfZGF0YTogVCk6IFRyZWVJdGVtPFQ+IHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscyhfZGF0YSwgaXRlbS5kYXRhKSlcclxuICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYWxsIGV4cGFuZGVkIHtAbGluayBUcmVlSXRlbX1zIHRoYXQgYXJlIGEgZGVzY2VuZGFudCBvZiB0aGlzIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRFeHBhbmRlZCgpOiBUcmVlSXRlbTxUPltdIHtcclxuICAgICAgcmV0dXJuIFsuLi50aGlzXS5maWx0ZXIoX2l0ZW0gPT4gX2l0ZW0uZXhwYW5kZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAqW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8VHJlZUl0ZW08VD4+IHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIHlpZWxkIGl0ZW1zW2ldO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKFJlZmxlY3QuZ2V0KF9ldmVudCwgXCJkcmFnUHJvY2Vzc2VkXCIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJkcmFnUHJvY2Vzc2VkXCIsIHRydWUpO1xyXG5cclxuICAgICAgbGV0IHRhcmdldDogVCA9ICg8VHJlZUl0ZW08VD4+dGhpcy5wYXJlbnRFbGVtZW50KS5kYXRhO1xyXG4gICAgICBpZiAodGFyZ2V0ID09IG51bGwgfHwgIXRoaXMuY29udHJvbGxlci5jYW5BZGRDaGlsZHJlbih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcywgdGFyZ2V0KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzKVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5yZW1vdmUoKTtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IHRhcmdldEl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC5jb21wb3NlZFBhdGgoKS5maW5kKF90YXJnZXQgPT4gX3RhcmdldCBpbnN0YW5jZW9mIFRyZWVJdGVtKTtcclxuICAgICAgICBpZiAodGhpcy5nZXRJdGVtcygpLmluY2x1ZGVzKHRhcmdldEl0ZW0pKSB7XHJcbiAgICAgICAgICBsZXQgcmVjdDogRE9NUmVjdCA9IHRhcmdldEl0ZW0uY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgIGxldCBhZGRCZWZvcmU6IGJvb2xlYW4gPSBfZXZlbnQuY2xpZW50WSA8IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgbGV0IHNpYmxpbmc6IEVsZW1lbnQgPSBhZGRCZWZvcmUgPyB0YXJnZXRJdGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgOiB0YXJnZXRJdGVtLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nICE9IHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcilcclxuICAgICAgICAgICAgaWYgKGFkZEJlZm9yZSlcclxuICAgICAgICAgICAgICB0YXJnZXRJdGVtLmJlZm9yZSh0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgdGFyZ2V0SXRlbS5hZnRlcih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLmF0ID0gdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLmlzQ29ubmVjdGVkID9cclxuICAgICAgICBBcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pLmluZGV4T2YodGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKSA6XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLmF0ID0gbnVsbDtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnRhcmdldCA9IHRhcmdldDtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1bC10cmVlLWxpc3RcIiwgVHJlZUxpc3QsIHsgZXh0ZW5kczogXCJ1bFwiIH0pO1xyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiVHJlZUxpc3QudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGV4cG9ydCBlbnVtIENTU19DTEFTUyB7XHJcbiAgICBTRUxFQ1RFRCA9IFwic2VsZWN0ZWRcIixcclxuICAgIElOQUNUSVZFID0gXCJpbmFjdGl2ZVwiXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2Yge0BsaW5rIFRyZWVMaXN0fSB0aGF0IHJlcHJlc2VudHMgdGhlIHJvb3Qgb2YgYSB0cmVlIGNvbnRyb2wgIFxyXG4gICAqIGBgYHRleHRcclxuICAgKiB0cmVlIDx1bD5cclxuICAgKiDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSCIOKUlCB0cmVlTGlzdCA8dWw+XHJcbiAgICog4pSCICAg4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilIIgICDilJQgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUlCB0cmVlSXRlbSA8bGk+XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRyZWU8VD4gZXh0ZW5kcyBUcmVlTGlzdDxUPiB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBUcmVlQ29udHJvbGxlcjxUPiwgX3Jvb3Q6IFQpIHtcclxuICAgICAgc3VwZXIoX2NvbnRyb2xsZXIsIFtdKTtcclxuICAgICAgbGV0IHJvb3Q6IFRyZWVJdGVtPFQ+ID0gbmV3IFRyZWVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgX3Jvb3QpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHJvb3QpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkVYUEFORCwgdGhpcy5obmRFeHBhbmQpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU0VMRUNULCB0aGlzLmhuZFNlbGVjdCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ERUxFVEUsIHRoaXMuaG5kRGVsZXRlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkVTQ0FQRSwgdGhpcy5obmRFc2NhcGUpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNPUFksIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlBBU1RFLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DVVQsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyb3AsIHRydWUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19MRUFWRSwgdGhpcy5obmREcmFnTGVhdmUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19TVEFSVCwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIFxyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYXIgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5zcGxpY2UoMCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBvYmplY3QgaW4gZm9jdXMgb3IgbnVsbCBpZiBub25lIGlzIGZvY3Vzc2VkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRGb2N1c3NlZCgpOiBUIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUcmVlSXRlbTxUPltdID0gPFRyZWVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKSk7XHJcbiAgICAgIGxldCBmb3VuZDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZig8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcbiAgICAgIGlmIChmb3VuZCA+IC0xKVxyXG4gICAgICAgIHJldHVybiBpdGVtc1tmb3VuZF0uZGF0YTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVmcmVzaCB0aGUgd2hvbGUgdHJlZSB0byBzeW5jaHJvbml6ZSB3aXRoIHRoZSBkYXRhIHRoZSB0cmVlIGlzIGJhc2VkIG9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcykge1xyXG4gICAgICAgIGlmICghaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpKTtcclxuICAgICAgICBpdGVtLmdldEJyYW5jaCgpLnJlc3RydWN0dXJlKGJyYW5jaCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oaXRlbS5kYXRhKSlcclxuICAgICAgICAgIGl0ZW0uZXhwYW5kKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4gY2hpbGRyZW4gdG8gdGhlIGdpdmVuIHRhcmdldCBhdCB0aGUgZ2l2ZW4gaW5kZXguIElmIG5vIGluZGV4IGlzIGdpdmVuLCB0aGUgY2hpbGRyZW4gYXJlIGFwcGVuZGVkIGF0IHRoZSBlbmQgb2YgdGhlIGxpc3QuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRDaGlsZHJlbihfY2hpbGRyZW46IFRbXSwgX3RhcmdldDogVCwgX2luZGV4PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIC8vIGlmIGRyb3AgdGFyZ2V0IGluY2x1ZGVkIGluIGNoaWxkcmVuIC0+IHJlZnVzZVxyXG4gICAgICBpZiAoX2NoaWxkcmVuLmluZGV4T2YoX3RhcmdldCkgPiAtMSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAvLyBhZGQgb25seSB0aGUgb2JqZWN0cyB0aGUgYWRkQ2hpbGRyZW4tbWV0aG9kIG9mIHRoZSBjb250cm9sbGVyIHJldHVybnNcclxuICAgICAgbGV0IG1vdmU6IFRbXSA9IHRoaXMuY29udHJvbGxlci5hZGRDaGlsZHJlbihfY2hpbGRyZW4sIF90YXJnZXQsIF9pbmRleCk7XHJcbiAgICAgIGlmICghbW92ZSB8fCBtb3ZlLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBmb2N1czogVCA9IHRoaXMuZ2V0Rm9jdXNzZWQoKTtcclxuICAgICAgLy8gVE9ETzogZG9uJ3QsIHdoZW4gY29weWluZyBvciBjb21pbmcgZnJvbSBhbm90aGVyIHNvdXJjZVxyXG4gICAgICB0aGlzLmRlbGV0ZShtb3ZlKTtcclxuXHJcbiAgICAgIGxldCB0YXJnZXREYXRhOiBUID0gPFQ+X3RhcmdldDtcclxuICAgICAgbGV0IHRhcmdldEl0ZW06IFRyZWVJdGVtPFQ+ID0gdGhpcy5maW5kVmlzaWJsZSh0YXJnZXREYXRhKTtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2godGhpcy5jb250cm9sbGVyLmdldENoaWxkcmVuKHRhcmdldERhdGEpKTtcclxuICAgICAgbGV0IG9sZDogVHJlZUxpc3Q8VD4gPSB0YXJnZXRJdGVtLmdldEJyYW5jaCgpO1xyXG4gICAgICB0YXJnZXRJdGVtLmhhc0NoaWxkcmVuID0gdHJ1ZTtcclxuICAgICAgaWYgKG9sZClcclxuICAgICAgICBvbGQucmVzdHJ1Y3R1cmUoYnJhbmNoKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRhcmdldEl0ZW0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgdGhpcy5maW5kVmlzaWJsZShmb2N1cyk/LmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFeHBhbmQoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbTogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGNoaWxkcmVuOiBUW10gPSB0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hpbGRyZW4oaXRlbS5kYXRhKTtcclxuICAgICAgaWYgKCFjaGlsZHJlbiB8fCBjaGlsZHJlbi5sZW5ndGggPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKGNoaWxkcmVuKTtcclxuICAgICAgaXRlbS5zZXRCcmFuY2goYnJhbmNoKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlQnJhbmNoKF9kYXRhOiBUW10pOiBUcmVlTGlzdDxUPiB7XHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gbmV3IFRyZWVMaXN0PFQ+KHRoaXMuY29udHJvbGxlciwgW10pO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiBfZGF0YSkge1xyXG4gICAgICAgIGJyYW5jaC5hZGRJdGVtcyhbbmV3IFRyZWVJdGVtKHRoaXMuY29udHJvbGxlciwgY2hpbGQpXSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGJyYW5jaDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDYWxsYmFjayAvIEV2ZW50aGFuZGxlciBpbiBUcmVlXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0Ryb3AgPSBhc3luYyAoX2V2ZW50OiBEcmFnRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+PlJlZmxlY3QuZ2V0KF9ldmVudCwgXCJpdGVtXCIpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkRSQUdfU1RBUlQ6XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdTdGFydChpdGVtLmRhdGEpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUkFHX09WRVI6XHJcbiAgICAgICAgICAvLyBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ092ZXIoX2V2ZW50KTtcclxuICAgICAgICAgIC8vIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUk9QOlxyXG4gICAgICAgICAgLy8gbGV0IG9iamVjdHM6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kcm9wKCk7XHJcbiAgICAgICAgICAvLyBmb3IgKGxldCBvYmplY3Qgb2Ygb2JqZWN0cykge1xyXG4gICAgICAgICAgLy8gICBsZXQgaXRlbTogVGFibGVJdGVtPFQ+ID0gbmV3IFRhYmxlSXRlbTxUPih0aGlzLmNvbnRyb2xsZXIsIG9iamVjdCwgdGhpcy5hdHRJY29uKTtcclxuICAgICAgICAgIC8vICAgdGhpcy5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgICAgIC8vIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmFkZENoaWxkcmVuKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcC5zb3VyY2VzLCB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AudGFyZ2V0LCB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AuYXQpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFtdO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnTGVhdmUgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHJlbGF0ZWRUYXJnZXQ6IEV2ZW50VGFyZ2V0ID0gX2V2ZW50LnJlbGF0ZWRUYXJnZXQ7XHJcbiAgICAgIGlmIChyZWxhdGVkVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgIXRoaXMuY29udGFpbnMocmVsYXRlZFRhcmdldCkgJiYgIXRoaXMuY29udGFpbnMocmVsYXRlZFRhcmdldC5vZmZzZXRQYXJlbnQpKSAvLyBvZmZzZXQgcGFyZW50IGlzIGZvciB3ZWlyZCAoaW52aXNpYmxlKSBkaXZzIHdoaWNoIGFyZSBwbGFjZWQgb3ZlciBpbnB1dCBlbGVtZW50cyBhbmQgdHJpZ2dlciBsZWF2ZSBldmVudHMuLi4gXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERlbGV0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHJlbW92ZTogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbdGFyZ2V0LmRhdGFdKTtcclxuICAgICAgdGhpcy5kZWxldGUocmVtb3ZlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFc2NhcGUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ29weVBhc3RlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc29sZS5sb2coX2V2ZW50KTtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5DT1BZOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHkodGhpcy5nZXRGb2N1c3NlZCgpLCBfZXZlbnQudHlwZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkNVVDpcclxuICAgICAgICAgIGxldCBjdXQ6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5jdXQodGhpcy5nZXRGb2N1c3NlZCgpLCBfZXZlbnQudHlwZSk7XHJcbiAgICAgICAgICAvLyBsZXQgY3V0OiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgICAgICAgdGhpcy5kZWxldGUoY3V0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuUEFTVEU6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBsZXQgb2JqZWN0czogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLnBhc3RlKCk7XHJcbiAgICAgICAgICB0aGlzLmFkZENoaWxkcmVuKG9iamVjdHMsIHRhcmdldC5kYXRhKTtcclxuICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGl0ZW1zOiBUcmVlSXRlbTxUPltdID0gPFRyZWVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKSk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGxldCBpbmRleDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZih0YXJnZXQpO1xyXG4gICAgICBpZiAoaW5kZXggPCAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkgJiYgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5sZW5ndGggPT0gMClcclxuICAgICAgICB0YXJnZXQuc2VsZWN0KHRydWUpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfTkVYVDpcclxuICAgICAgICAgIGlmICgrK2luZGV4IDwgaXRlbXMubGVuZ3RoKVxyXG4gICAgICAgICAgICBpdGVtc1tpbmRleF0uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfUFJFVklPVVM6XHJcbiAgICAgICAgICBpZiAoLS1pbmRleCA+PSAwKVxyXG4gICAgICAgICAgICBpdGVtc1tpbmRleF0uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICAoPFRyZWVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLnNlbGVjdCh0cnVlKTtcclxuICAgICAgZWxzZSBpZiAoIV9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1bC10cmVlXCIsIFRyZWUsIHsgZXh0ZW5kczogXCJ1bFwiIH0pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIFN1YmNsYXNzIHRoaXMgdG8gY3JlYXRlIGEgYnJva2VyIGJldHdlZW4geW91ciBkYXRhIGFuZCBhIHtAbGluayBUcmVlfSB0byBkaXNwbGF5IGFuZCBtYW5pcHVsYXRlIGl0LlxyXG4gICAqIFRoZSB7QGxpbmsgVHJlZX0gZG9lc24ndCBrbm93IGhvdyB5b3VyIGRhdGEgaXMgc3RydWN0dXJlZCBhbmQgaG93IHRvIGhhbmRsZSBpdCwgdGhlIGNvbnRyb2xsZXIgaW1wbGVtZW50cyB0aGUgbWV0aG9kcyBuZWVkZWRcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgVHJlZUNvbnRyb2xsZXI8VD4ge1xyXG4gICAgLyoqIFN0b3JlcyByZWZlcmVuY2VzIHRvIHNlbGVjdGVkIG9iamVjdHMuIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIHNlbGVjdGlvbiBzaG91bGQgYWxzbyBvcGVyYXRlIG91dHNpZGUgb2YgdHJlZSAqL1xyXG4gICAgcHVibGljIHNlbGVjdGlvbjogVFtdID0gW107XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gb2JqZWN0cyBiZWluZyBkcmFnZ2VkLCBhbmQgb2JqZWN0cyB0byBkcm9wIG9uLiBPdmVycmlkZSB3aXRoIGEgcmVmZXJlbmNlIGluIG91dGVyIHNjb3BlLCBpZiBkcmFnJmRyb3Agc2hvdWxkIG9wZXJhdGUgb3V0c2lkZSBvZiB0cmVlICovXHJcbiAgICBwdWJsaWMgZHJhZ0Ryb3A6IHsgc291cmNlczogVFtdOyB0YXJnZXQ6IFQ7IGF0PzogbnVtYmVyIH0gPSB7IHNvdXJjZXM6IFtdLCB0YXJnZXQ6IG51bGwgfTtcclxuICAgIC8qKiBTdG9yZXMgcmVmZXJlbmNlcyB0byBvYmplY3RzIGJlaW5nIGRyYWdnZWQsIGFuZCBvYmplY3RzIHRvIGRyb3Agb24uIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIGRyYWcmZHJvcCBzaG91bGQgb3BlcmF0ZSBvdXRzaWRlIG9mIHRyZWUgKi9cclxuICAgIHB1YmxpYyBjb3B5UGFzdGU6IHsgc291cmNlczogVFtdOyB0YXJnZXQ6IFQgfSA9IHsgc291cmNlczogW10sIHRhcmdldDogbnVsbCB9O1xyXG5cclxuICAgIC8qKiBVc2VkIGJ5IHRoZSB0cmVlIHRvIGluZGljYXRlIHRoZSBkcm9wIHBvc2l0aW9uIHdoaWxlIGRyYWdnaW5nICovXHJcbiAgICBwdWJsaWMgZHJhZ0Ryb3BJbmRpY2F0b3I6IEhUTUxIUkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHJcIik7XHJcblxyXG4gICAgLyoqIE92ZXJyaWRlIHRvIGVuYWJsZSB0cmVlIGl0ZW1zIHRvIGJlIHNvcnRhYmxlIGJ5IHRoZSB1c2VyIHZpYSBkcmFnLWFuZC1kcm9wLiBEZWZhdWx0IGlzIHRydWUuICovXHJcbiAgICBwdWJsaWMgc29ydGFibGU6IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3ZlcnJpZGUgaWYgc29tZSBvYmplY3RzIHNob3VsZCBub3QgYmUgZHJhZ2dhYmxlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkcmFnZ2FibGUoX29iamVjdDogVCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiB0d28gb2JqZWN0cyBvZiBhcmUgZXF1YWwuIERlZmF1bHQgaXMgX2EgPT0gX2IuIE92ZXJyaWRlIGZvciBtb3JlIGNvbXBsZXggY29tcGFyaXNvbnMuIFxyXG4gICAgICogVXNlZnVsIHdoZW4gdGhlIHVuZGVybHlpbmcgZGF0YSBpcyB2b2xhdGlsZSBhbmQgY2hhbmdlcyBpZGVudGl0eSB3aGlsZSBzdGF5aW5nIHRoZSBzYW1lLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXF1YWxzKF9hOiBULCBfYjogVCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gX2EgPT0gX2I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPdmVycmlkZSBpZiBzb21lIG9iamVjdHMgc2hvdWxkIG5vdCBiZSBhZGRhYmxlIHRvIG90aGVyc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2FuQWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFRbXSwgX3RhcmdldDogVCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZW1vdmUgdGhlIG9iamVjdHMgdG8gYmUgZGVsZXRlZCwgZS5nLiB0aGUgY3VycmVudCBzZWxlY3Rpb24sIGZyb20gdGhlIGRhdGEgc3RydWN0dXJlIHRoZSB0YWJsZSByZWZlcnMgdG8gYW5kIFxyXG4gICAgICogcmV0dXJuIGEgbGlzdCBvZiB0aG9zZSBvYmplY3RzIGluIG9yZGVyIGZvciB0aGUgYWNjb3JkaW5nIHtAbGluayBUcmVlSXRlbXN9IHRvIGJlIGRlbGV0ZWQgYWxzbyAgIFxyXG4gICAgICogQHBhcmFtIF9leHBlbmRhYmxlcyBUaGUgZXhwZW5kYWJsZSBvYmplY3RzIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9leHBlbmRhYmxlczogVFtdKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgcmV0dXJuIF9leHBlbmRhYmxlcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZWZlciBpdGVtcyB0byB0aGUgY2xpcGJvYXJkIGZvciBjb3B5ICYgcGFzdGUgICBcclxuICAgICAqIEBwYXJhbSBfZm9jdXMgVGhlIHRoYXQgaGFzIHRoZSBmb2N1cyBhbmQgdGhhdCB3aWxsIGJlIGNvcGllZCBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb3B5KF9mb2N1czogVCwgX29wZXJhdGlvbjogQ2xpcE9wZXJhdGlvbik6IFRbXSB7XHJcbiAgICAgIGxldCBpdGVtczogVFtdID0gdGhpcy5zZWxlY3Rpb24ubGVuZ3RoID8gdGhpcy5zZWxlY3Rpb24gOiBbX2ZvY3VzXTtcclxuICAgICAgQ2xpcGJvYXJkLmNvcHlQYXN0ZS5zZXQoaXRlbXMsIF9vcGVyYXRpb24sIG51bGwpO1xyXG4gICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVmZXIgb2JqZWN0cyB0byB0aGUgY2xpcGJvYXJkIGZvciBjb3B5ICYgcGFzdGUgYW5kIGRlbGV0ZSB0aGVtIGZyb20gdGhpcyBjb250cm9sbGVyICAgXHJcbiAgICAgKiBAcGFyYW0gX2ZvY3VzIFRoZSBpdGVtIHRoYXQgaGFzIHRoZSBmb2N1cyBhbmQgdGhhdCB3aWxsIGJlIGN1dCBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBjdXQoX2ZvY3VzOiBULCBfb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLmNvcHkoX2ZvY3VzLCBfb3BlcmF0aW9uKTtcclxuICAgICAgaXRlbXMgPSBhd2FpdCB0aGlzLmRlbGV0ZShpdGVtcyk7XHJcbiAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXRyaWV2ZSBvYmplY3RzIGZyb20gdGhlIGNsaXBib2FyZCwgcHJvY2VzcyBhbmQgcmV0dXJuIHRoZW0gdG8gYWRkIHRvIHRoZSB0YWJsZSAgIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgcGFzdGUoX2NsYXNzOiBuZXcgKCkgPT4gVCA9IG51bGwpOiBQcm9taXNlPFRbXT4ge1xyXG4gICAgICBsZXQgb2JqZWN0czogVFtdID0gQ2xpcGJvYXJkLmNvcHlQYXN0ZS5nZXQoX2NsYXNzLCB0cnVlKTsgLy8gcG9zc2libGUgdG8gZmlsdGVyIGZvciBvbmx5IG9iamVjdHMgb2Ygc3BlY2lmaWMgdHlwZVxyXG4gICAgICByZXR1cm4gb2JqZWN0cztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZWZlciBvYmplY3RzIHRvIHRoZSBjbGlwYm9hcmQgZm9yIGRyYWcgJiBkcm9wICAgXHJcbiAgICAgKiBAcGFyYW0gX2ZvY3VzIFRoZSBpdGVtIHRoYXQgaGFzIHRoZSBmb2N1cyBhbmQgdGhhdCB3aWxsIGJlIGRyYWdnZWQgaWYgdGhlIHNlbGVjdGlvbiBpcyBlbXB0eVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ1N0YXJ0KF9mb2N1czogVCk6IHZvaWQge1xyXG4gICAgICAvLyBpZiB0aGUgZm9jdXNzZWQgaXRlbSBpcyBpbiB0aGUgc2VsZWN0aW9uLCBkcmFnIHRoZSB3aG9sZSBzZWxlY3Rpb25cclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLnNlbGVjdGlvbi5pbmRleE9mKF9mb2N1cykgPCAwID8gW19mb2N1c10gOiB0aGlzLnNlbGVjdGlvbjtcclxuICAgICAgQ2xpcGJvYXJkLmRyYWdEcm9wLnNldChpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIENyZWF0ZSBhbiBIVE1MRWxlbWVudCBmb3IgdGhlIHRyZWUgaXRlbSByZXByZXNlbnRpbmcgdGhlIG9iamVjdC4gZS5nLiBhbiBIVE1MSW5wdXRFbGVtZW50ICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY3JlYXRlQ29udGVudChfb2JqZWN0OiBUKTogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLyoqIFJldHJpZXZlIGEgc3BhY2Ugc2VwYXJhdGVkIHN0cmluZyBvZiBhdHRyaWJ1dGVzIHRvIGFkZCB0byB0aGUgbGlzdCBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IGZvciBmdXJ0aGVyIHN0eWxpbmcgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0QXR0cmlidXRlcyhfb2JqZWN0OiBUKTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBQcm9jZXNzIHRoZSBwcm9wb3NlZCBuZXcgdmFsdWUuIFRoZSBpZCBvZiB0aGUgaHRtbCBlbGVtZW50IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugb2NjdXJlZCBpcyBwYXNzZWQgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBzZXRWYWx1ZShfb2JqZWN0OiBULCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPjtcclxuXHJcbiAgICAvKiogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBoYXMgY2hpbGRyZW4gdGhhdCBtdXN0IGJlIHNob3duIHdoZW4gdW5mb2xkaW5nIHRoZSB0cmVlIGl0ZW0gKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBoYXNDaGlsZHJlbihfb2JqZWN0OiBUKTogYm9vbGVhbjtcclxuXHJcbiAgICAvKiogUmV0dXJuIHRoZSBvYmplY3QncyBjaGlsZHJlbiB0byBzaG93IHdoZW4gdW5mb2xkaW5nIHRoZSB0cmVlIGl0ZW0gKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRDaGlsZHJlbihfb2JqZWN0OiBUKTogVFtdO1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFByb2Nlc3MgdGhlIGxpc3Qgb2Ygc291cmNlIG9iamVjdHMgdG8gYmUgYWRkZWRBc0NoaWxkcmVuIHdoZW4gZHJvcHBpbmcgb3IgcGFzdGluZyBvbnRvIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QsIFxyXG4gICAgICogcmV0dXJuIHRoZSBsaXN0IG9mIG9iamVjdHMgdGhhdCBzaG91bGQgdmlzaWJseSBiZWNvbWUgdGhlIGNoaWxkcmVuIG9mIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QgXHJcbiAgICAgKiBAcGFyYW0gX2NoaWxkcmVuIEEgbGlzdCBvZiBvYmplY3RzIHRoZSB0cmVlIHRyaWVzIHRvIGFkZCB0byB0aGUgX3RhcmdldFxyXG4gICAgICogQHBhcmFtIF90YXJnZXQgVGhlIG9iamVjdCByZWZlcmVuY2VkIGJ5IHRoZSBpdGVtIHRoZSBkcm9wIG9jY3VycyBvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFRbXSwgX3RhcmdldDogVCwgX2luZGV4PzogbnVtYmVyKTogVFtdO1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiBsaS1lbGVtZW50IHRoYXQgcmVwcmVzZW50cyBhbiBvYmplY3QgaW4gYSB7QGxpbmsgVHJlZUxpc3R9IHdpdGggYSBjaGVja2JveCBhbmQgdXNlciBkZWZpbmVkIGlucHV0IGVsZW1lbnRzIGFzIGNvbnRlbnQuXHJcbiAgICogQWRkaXRpb25hbGx5LCBtYXkgaG9sZCBhbiBpbnN0YW5jZSBvZiB7QGxpbmsgVHJlZUxpc3R9IGFzIGJyYW5jaCB0byBkaXNwbGF5IGNoaWxkcmVuIG9mIHRoZSBjb3JyZXNwb25kaW5nIG9iamVjdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MTElFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjbGFzc2VzOiBDU1NfQ0xBU1NbXSA9IFtdO1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHByaXZhdGUgY2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAjY29udGVudDogSFRNTEZpZWxkU2V0RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+LCBfZGF0YTogVCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIC8vIFRPRE86IGhhbmRsZSBjc3NDbGFzc2VzXHJcbiAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oX2RhdGEpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZERibENsaWNrKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX09VVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG5cclxuICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ2dhYmxlKF9kYXRhKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfRU5URVIsIHRoaXMuaG5kRHJhZ092ZXIpOyAvLyB0aGlzIHByZXZlbnRzIGN1cnNvciBmcm9tIGZsaWNrZXJpbmdcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfRU5URVIsIHRoaXMuaG5kRHJhZ0Ryb3ApOyAvLyB0aGlzIHByZXZlbnRzIGN1cnNvciBmcm9tIGZsaWNrZXJpbmdcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QT0lOVEVSX1VQLCB0aGlzLmhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5SRU1PVkVfQ0hJTEQsIHRoaXMuaG5kUmVtb3ZlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSwgd2hlbiB0aGlzIGl0ZW0gaGFzIGEgdmlzaWJsZSBjaGVja2JveCBpbiBmcm9udCB0byBleHBhbmQgdGhlIHN1YnNlcXVlbnQgYnJhbmNoIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGhhc0NoaWxkcmVuKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5jaGVja2JveC5zdHlsZS52aXNpYmlsaXR5ICE9IFwiaGlkZGVuXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG93cyBvciBoaWRlcyB0aGUgY2hlY2tib3ggZm9yIGV4cGFuZGluZyB0aGUgc3Vic2VxdWVudCBicmFuY2hcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCBoYXNDaGlsZHJlbihfaGFzOiBib29sZWFuKSB7XHJcbiAgICAgIHRoaXMuY2hlY2tib3guc3R5bGUudmlzaWJpbGl0eSA9IF9oYXMgPyBcInZpc2libGVcIiA6IFwiaGlkZGVuXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHtAbGluayBDU1NfQ0xBU1MuU0VMRUNURUR9IGlzIGF0dGFjaGVkIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEF0dGFjaGVzIG9yIGRldGFjaGVzIHRoZSB7QGxpbmsgQ1NTX0NMQVNTLlNFTEVDVEVEfSB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCBzZWxlY3RlZChfb246IGJvb2xlYW4pIHtcclxuICAgICAgaWYgKF9vbilcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY29udGVudCByZXByZXNlbnRpbmcgdGhlIGF0dGFjaGVkIHtAbGluayBkYXRhfVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGNvbnRlbnQoKTogSFRNTEZpZWxkU2V0RWxlbWVudCB7XHJcbiAgICAgIHJldHVybiB0aGlzLiNjb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoaXMgaXRlbSBpcyBleHBhbmRlZCwgc2hvd2luZyBpdCdzIGNoaWxkcmVuLCBvciBjbG9zZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBleHBhbmRlZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0QnJhbmNoKCkgJiYgdGhpcy5jaGVja2JveC5jaGVja2VkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWZyZXNoQXR0cmlidXRlcygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJhdHRyaWJ1dGVzXCIsIHRoaXMuY29udHJvbGxlci5nZXRBdHRyaWJ1dGVzKHRoaXMuZGF0YSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWZyZXNoQ29udGVudCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy4jY29udGVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICB0aGlzLiNjb250ZW50LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbGxlci5jcmVhdGVDb250ZW50KHRoaXMuZGF0YSkpO1xyXG4gICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaWVzIHRvIGV4cGFuZGluZyB0aGUge0BsaW5rIFRyZWVMaXN0fSBvZiBjaGlsZHJlbiwgYnkgZGlzcGF0Y2hpbmcge0BsaW5rIEVWRU5ULkVYUEFORH0uXHJcbiAgICAgKiBUaGUgdXNlciBvZiB0aGUgdHJlZSBuZWVkcyB0byBhZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHRyZWUgXHJcbiAgICAgKiBpbiBvcmRlciB0byBjcmVhdGUgdGhhdCB7QGxpbmsgVHJlZUxpc3R9IGFuZCBhZGQgaXQgYXMgYnJhbmNoIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9leHBhbmQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZW1vdmVCcmFuY2goKTtcclxuXHJcbiAgICAgIGlmIChfZXhwYW5kKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuRVhQQU5ELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG5cclxuICAgICAgdGhpcy5jaGVja2JveC5jaGVja2VkID0gX2V4cGFuZDtcclxuICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IHRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbih0aGlzLmRhdGEpO1xyXG4gICAgICAvLyAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT0nY2hlY2tib3gnXVwiKSkuY2hlY2tlZCA9IF9leHBhbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBhbGwgZGF0YSByZWZlcmVuY2VkIGJ5IHRoZSBpdGVtcyBzdWNjZWVkaW5nIHRoaXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFZpc2libGVEYXRhKCk6IFRbXSB7XHJcbiAgICAgIGxldCBsaXN0OiBOb2RlTGlzdE9mPEhUTUxMSUVsZW1lbnQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBkYXRhOiBUW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBsaXN0KVxyXG4gICAgICAgIGRhdGEucHVzaCgoPFRyZWVJdGVtPFQ+Pml0ZW0pLmRhdGEpO1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGJyYW5jaCBvZiBjaGlsZHJlbiBvZiB0aGlzIGl0ZW0uIFRoZSBicmFuY2ggbXVzdCBiZSBhIHByZXZpb3VzbHkgY29tcGlsZWQge0BsaW5rIFRyZWVMaXN0fVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0QnJhbmNoKF9icmFuY2g6IFRyZWVMaXN0PFQ+KTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQnJhbmNoKCk7XHJcbiAgICAgIGlmIChfYnJhbmNoKVxyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoX2JyYW5jaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0QnJhbmNoKCk6IFRyZWVMaXN0PFQ+IHtcclxuICAgICAgcmV0dXJuIDxUcmVlTGlzdDxUPj50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIHRoZSB7QGxpbmsgRVZFTlQuU0VMRUNUfSBldmVudFxyXG4gICAgICogQHBhcmFtIF9hZGRpdGl2ZSBGb3IgbXVsdGlwbGUgc2VsZWN0aW9uICgrQ3RybCkgXHJcbiAgICAgKiBAcGFyYW0gX2ludGVydmFsIEZvciBzZWxlY3Rpb24gb3ZlciBpbnRlcnZhbCAoK1NoaWZ0KVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2VsZWN0KF9hZGRpdGl2ZTogYm9vbGVhbiwgX2ludGVydmFsOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgbGV0IGV2ZW50OiBDdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudChFVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSwgYWRkaXRpdmU6IF9hZGRpdGl2ZSwgaW50ZXJ2YWw6IF9pbnRlcnZhbCB9IH0pO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgYnJhbmNoIG9mIGNoaWxkcmVuIGZyb20gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVtb3ZlQnJhbmNoKCk6IHZvaWQge1xyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuZ2V0QnJhbmNoKCk7XHJcbiAgICAgIGlmICghYnJhbmNoKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5yZW1vdmVDaGlsZChicmFuY2gpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICB0aGlzLmNoZWNrYm94LnR5cGUgPSBcImNoZWNrYm94XCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jaGVja2JveCk7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy4jY29udGVudCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgdGhpcy5yZWZyZXNoQXR0cmlidXRlcygpO1xyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRm9jdXNFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzLmNoZWNrYm94KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy4jY29udGVudC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuI2NvbnRlbnQuZGlzYWJsZWQpIHtcclxuICAgICAgICBpZiAoX2V2ZW50LmNvZGUgPT0gxpIuS0VZQk9BUkRfQ09ERS5FU0MgfHwgX2V2ZW50LmNvZGUgPT0gxpIuS0VZQk9BUkRfQ09ERS5FTlRFUilcclxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgICAgaWYgKHRoaXMuaGFzQ2hpbGRyZW4gJiYgIXRoaXMuZXhwYW5kZWQpXHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfTEVGVDpcclxuICAgICAgICAgIGlmICh0aGlzLmV4cGFuZGVkKVxyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19QUkVWSU9VUywgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19QUkVWSU9VUywgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRjI6XHJcbiAgICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLiNjb250ZW50LmVsZW1lbnRzLml0ZW0oMCk7XHJcbiAgICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5TUEFDRTpcclxuICAgICAgICAgIHRoaXMuc2VsZWN0KF9ldmVudC5jdHJsS2V5LCBfZXZlbnQuc2hpZnRLZXkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVTQzpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuRVNDQVBFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkM6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuQ09QWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5WOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlBBU1RFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlg6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuQ1VULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREYmxDbGljayA9IChfZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzLmNoZWNrYm94KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChfZXZlbnQucGFnZVgsIF9ldmVudC5wYWdlWSk7IC8vIGRpc2FibGVkIGVsZW1lbnRzIGRvbid0IGRpc3BhdGNoIGNsaWNrIGV2ZW50cywgZ2V0IHRoZSBlbGVtZW50IG1hbnVhbGx5XHJcbiAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBlbGVtZW50LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ2hhbmdlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiB0YXJnZXQudHlwZSA9PSBcImNoZWNrYm94XCIpIHtcclxuICAgICAgICB0aGlzLmV4cGFuZCh0YXJnZXQuY2hlY2tlZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgcmVuYW1lZDogYm9vbGVhbiA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5zZXRWYWx1ZSh0aGlzLmRhdGEsIHRhcmdldCk7XHJcblxyXG4gICAgICB0aGlzLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICAgIGlmIChyZW5hbWVkKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEgfSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0Ryb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdzdGFydFwiKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIC8vIHN0b3JlIHRoZSBkcmFnZ2VkIGl0ZW0gaW4gdGhlIGV2ZW50IGZvciBmdXJ0aGVyIHByb2Nlc3NpbmcgaW4gdGFibGVcclxuICAgICAgUmVmbGVjdC5zZXQoX2V2ZW50LCBcIml0ZW1cIiwgdGhpcyk7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImRyYWdzdGFydFwiLCBcImRyYWdzdGFydFwiKTtcclxuICB9O1xyXG5cclxuICAgIC8vIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAvLyAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIC8vICAgLy8gaWYgKF9ldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdzdGFydFwiKSlcclxuICAgIC8vICAgLy8gICByZXR1cm47XHJcblxyXG4gICAgLy8gICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFtdO1xyXG4gICAgLy8gICBpZiAodGhpcy5zZWxlY3RlZClcclxuICAgIC8vICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb247XHJcbiAgICAvLyAgIGVsc2VcclxuICAgIC8vICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3Auc291cmNlcyA9IFt0aGlzLmRhdGFdO1xyXG4gICAgLy8gICBfZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImFsbFwiO1xyXG4gICAgLy8gICAvLyBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERyYWdJbWFnZShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpLCAwLCAwKTtcclxuICAgIC8vICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnRhcmdldCA9IG51bGw7XHJcblxyXG4gICAgLy8gICAvLyBtYXJrIGFzIGFscmVhZHkgcHJvY2Vzc2VkIGJ5IHRoaXMgdHJlZSBpdGVtIHRvIGlnbm9yZSBpdCBpbiBmdXJ0aGVyIHByb3BhZ2F0aW9uIHRocm91Z2ggdGhlIHRyZWVcclxuICAgIC8vICAgLy8gX2V2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiZHJhZ3N0YXJ0XCIsIFwiZHJhZ3N0YXJ0XCIpO1xyXG4gICAgLy8gfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcmVjdDogRE9NUmVjdCA9IHRoaXMuI2NvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIGxldCB1cHBlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgxIC8gNCk7XHJcbiAgICAgIGxldCBsb3dlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgzIC8gNCk7XHJcbiAgICAgIGxldCBvZmZzZXQ6IG51bWJlciA9IF9ldmVudC5jbGllbnRZO1xyXG4gICAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgVHJlZSB8fCAob2Zmc2V0ID4gdXBwZXIgJiYgKG9mZnNldCA8IGxvd2VyIHx8IHRoaXMuY2hlY2tib3guY2hlY2tlZCkpIHx8ICF0aGlzLmNvbnRyb2xsZXIuc29ydGFibGUpIHtcclxuICAgICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiLCB0cnVlKTtcclxuICAgICAgICBpZiAoX2V2ZW50LnR5cGUgPT0gRVZFTlQuRFJBR19PVkVSKVxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuY2FuQWRkQ2hpbGRyZW4odGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnNvdXJjZXMsIHRoaXMuZGF0YSkpIHtcclxuICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3AuYXQgPSBudWxsO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wLnRhcmdldCA9IHRoaXMuZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzLmNoZWNrYm94KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUmVtb3ZlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gdGhlIHZpZXdzIG1pZ2h0IG5lZWQgdG8ga25vdyBhYm91dCB0aGlzIGV2ZW50XHJcbiAgICAgIC8vIGlmIChfZXZlbnQuY3VycmVudFRhcmdldCA9PSBfZXZlbnQudGFyZ2V0KVxyXG4gICAgICAvLyAgIHJldHVybjtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLmhhc0NoaWxkcmVuID0gdGhpcy5jb250cm9sbGVyLmhhc0NoaWxkcmVuKHRoaXMuZGF0YSk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwibGktdHJlZS1pdGVtXCIsIFRyZWVJdGVtLCB7IGV4dGVuZHM6IFwibGlcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICBleHBvcnQgdHlwZSBEUk9QRUZGRUNUID0gXCJub25lXCIgfCBcImNvcHlcIiB8IFwibGlua1wiIHwgXCJtb3ZlXCI7XHJcblxyXG4gIGV4cG9ydCBjb25zdCBlbnVtIEVWRU5UIHtcclxuICAgIENMSUNLID0gXCJjbGlja1wiLFxyXG4gICAgRE9VQkxFX0NMSUNLID0gXCJkYmxjbGlja1wiLFxyXG4gICAgS0VZX0RPV04gPSBcImtleWRvd25cIixcclxuICAgIERSQUdfU1RBUlQgPSBcImRyYWdzdGFydFwiLFxyXG4gICAgRFJBR19FTlRFUiA9IFwiZHJhZ2VudGVyXCIsXHJcbiAgICBEUkFHX09WRVIgPSBcImRyYWdvdmVyXCIsXHJcbiAgICBEUkFHX0xFQVZFID0gXCJkcmFnbGVhdmVcIixcclxuICAgIERST1AgPSBcImRyb3BcIixcclxuICAgIFBPSU5URVJfVVAgPSBcInBvaW50ZXJ1cFwiLFxyXG4gICAgV0hFRUwgPSBcIndoZWVsXCIsXHJcbiAgICBGT0NVU19ORVhUID0gXCJmb2N1c05leHRcIixcclxuICAgIEZPQ1VTX1BSRVZJT1VTID0gXCJmb2N1c1ByZXZpb3VzXCIsXHJcbiAgICBGT0NVU19JTiA9IFwiZm9jdXNpblwiLFxyXG4gICAgRk9DVVNfT1VUID0gXCJmb2N1c291dFwiLFxyXG4gICAgRk9DVVNfU0VUID0gXCJmb2N1c1NldFwiLFxyXG4gICAgQkxVUiA9IFwiYmx1clwiLFxyXG4gICAgQ0hBTkdFID0gXCJjaGFuZ2VcIixcclxuICAgIERFTEVURSA9IFwiZGVsZXRlXCIsXHJcbiAgICBSRU5BTUUgPSBcInJlbmFtZVwiLFxyXG4gICAgU0VMRUNUID0gXCJpdGVtc2VsZWN0XCIsXHJcbiAgICBFU0NBUEUgPSBcImVzY2FwZVwiLFxyXG4gICAgQ09QWSA9IFwiY29weVwiLFxyXG4gICAgQ1VUID0gXCJjdXRcIixcclxuICAgIFBBU1RFID0gXCJwYXN0ZVwiLFxyXG4gICAgU09SVCA9IFwic29ydFwiLFxyXG4gICAgQ09OVEVYVE1FTlUgPSBcImNvbnRleHRtZW51XCIsXHJcbiAgICBNVVRBVEUgPSBcIm11dGF0ZVwiLFxyXG4gICAgUkVNT1ZFX0NISUxEID0gXCJyZW1vdmVDaGlsZFwiLFxyXG4gICAgQ09MTEFQU0UgPSBcImNvbGxhcHNlXCIsXHJcbiAgICBFWFBBTkQgPSBcImV4cGFuZFwiLFxyXG4gICAgSU5QVVQgPSBcImlucHV0XCIsXHJcbiAgICBSRUFSUkFOR0VfQVJSQVkgPSBcInJlYXJyYW5nZUFycmF5XCIsXHJcbiAgICBUT0dHTEUgPSBcInRvZ2dsZVwiLFxyXG4gICAgUE9JTlRFUl9NT1ZFID0gXCJwb2ludGVybW92ZVwiLFxyXG4gICAgSU5TRVJUID0gXCJpbnNlcnRcIlxyXG4gIH1cclxufSJdfQ==