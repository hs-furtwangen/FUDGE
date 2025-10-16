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
     * Connects a mutable object to a DOM-Element and synchronizes that mutable with the mutator stored within.
     * Updates the mutable on interaction with the element and the element in time intervals.
     */
    class Controller {
        static { this.signatures = new WeakMap(); }
        constructor(_mutable, _domElement) {
            this.timeUpdate = 190;
            this.mutateOnInput = async (_event) => {
                let path = this.getMutatorPath(_event);
                // get current mutator and save for undo
                let mutator = ƒ.Mutable.getMutator(this.mutable);
                // ƒ.Debug.info(mutator);
                this.domElement.dispatchEvent(new CustomEvent("saveHistory" /* EVENT.SAVE_HISTORY */, { bubbles: true, detail: { history: 0, mutable: this.mutable, mutator: ƒ.Mutable.cloneMutatorFromPath(mutator, path) } }));
                // get current mutator from interface for mutation   
                mutator = this.getMutator();
                await ƒ.Mutable.mutate(this.mutable, ƒ.Mutable.cloneMutatorFromPath(mutator, path));
                _event.stopPropagation();
                this.domElement.dispatchEvent(new Event("mutate" /* EVENT.MUTATE */, { bubbles: true }));
            };
            this.rearrangeArray = async (_event) => {
                let sequence = _event.detail.sequence;
                let path = this.getMutatorPath(_event);
                let target = this.getTarget(path);
                // rearrange that mutable
                target.rearrange(sequence);
                await ƒ.Mutable.mutate(this.mutable, ƒ.Mutable.getMutator(this.mutable)); // TODO: rearrangement is not a mutation so dispatching this mutate is irritating...
            };
            this.resizeArray = async (_event) => {
                const target = _event.target;
                if (!(target instanceof FudgeUserInterface.DetailsArray))
                    return;
                const length = _event.detail.length;
                const path = this.getMutatorPath(_event);
                const current = this.getTarget(path);
                this.domElement.dispatchEvent(new CustomEvent("saveHistory" /* EVENT.SAVE_HISTORY */, { bubbles: true, detail: { history: 4, mutable: this.mutable, mutator: { path: path, value: current.concat() } } }));
                const incoming = current.concat();
                incoming.length = length;
                for (let i = current.length; i < length; i++)
                    incoming[i] = null;
                current.splice(0, current.length, ...incoming);
                await ƒ.Mutable.mutate(this.mutable, ƒ.Mutable.getMutator(this.mutable));
            };
            this.setValue = (_event) => {
                const path = this.getMutatorPath(_event);
                const mutable = this.getTarget(path.toSpliced(path.length - 1));
                const key = path[path.length - 1];
                const current = Reflect.get(mutable, key);
                this.domElement.dispatchEvent(new CustomEvent("saveHistory" /* EVENT.SAVE_HISTORY */, { bubbles: true, detail: { history: 3, mutable: this.mutable, mutator: { path: path, value: current } } }));
                const incoming = _event.detail.value;
                Reflect.set(mutable, key, incoming);
            };
            this.initializeValue = (_event) => {
                const path = this.getMutatorPath(_event);
                const mutable = this.getTarget(path.toSpliced(path.length - 1));
                const key = path[path.length - 1];
                let parent;
                let parentKey;
                if (!ƒ.isMutable(mutable)) { // must be a collection type, adjust to parent mutable
                    parent = this.getTarget(path.toSpliced(path.length - 2));
                    parentKey = path[path.length - 2];
                }
                const current = Reflect.get(mutable, key);
                this.domElement.dispatchEvent(new CustomEvent("saveHistory" /* EVENT.SAVE_HISTORY */, { bubbles: true, detail: { history: 3, mutable: this.mutable, mutator: { path: path, value: current } } }));
                const mutatorTypes = ƒ.Mutable.getTypes(parent ?? mutable, ƒ.Mutable.getMutator(parent ?? mutable));
                const mutatorCollectionTypes = ƒ.Metadata.collectionTypes(mutable);
                const type = mutatorCollectionTypes[key] ?? mutatorTypes[parentKey ?? key];
                Controller.initializeValue(mutable, key, type);
            };
            this.provideOptions = (_event) => {
                const target = _event.target;
                if (!(target instanceof FudgeUserInterface.CustomElementComboSelect))
                    return;
                const path = this.getMutatorPath(_event);
                let mutable = this.getTarget(path.toSpliced(path.length - 1));
                let key = path[path.length - 1];
                if (!ƒ.isMutable(mutable)) { // must be a collection type, adjust to parent mutable
                    mutable = this.getTarget(path.toSpliced(path.length - 2));
                    key = path[path.length - 2];
                }
                const mutatorOptions = ƒ.Metadata.options(mutable);
                const options = mutatorOptions[key].call(mutable, key);
                target.options = options;
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
            this.domElement.addEventListener("restructureArray" /* EVENT.RESTRUCTURE_ARRAY */, this.resizeArray);
            this.domElement.addEventListener("requestOptions" /* EVENT.REQUEST_OPTIONS */, this.provideOptions);
            this.domElement.addEventListener("setValue" /* EVENT.SET_VALUE */, this.setValue);
            this.domElement.addEventListener("initializeValue" /* EVENT.INITIALIZE_VALUE */, this.initializeValue);
        }
        /**
         * Recursive method taking an existing mutator as a template
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
         * Recursive method taking the a mutable as a template to create a mutator or update the given mutator.
         * with the values in the given UI-domElement
         */
        static getMutator(_mutable, _domElement, _mutator, _types) {
            let mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);
            for (let key in mutator) {
                let element = Controller.findChildElementByKey(_domElement, key);
                if (element == null)
                    continue;
                if (element instanceof FudgeUserInterface.CustomElement)
                    mutator[key] = element.getMutatorValue();
                else {
                    const mutant = Reflect.get(_mutable, key);
                    if (ƒ.isMutable(mutant) || Array.isArray(mutant))
                        mutator[key] = this.getMutator(mutant, element, mutator[key]);
                }
            }
            return mutator;
        }
        /**
         * Recursive method taking the mutator of a mutable and updating the UI-domElement accordingly.
         * If an additional mutator is passed, its values are used instead of those of the mutable.
         */
        static updateUserInterface(_mutable, _domElement, _mutator, _parentMutable, _parentKey) {
            const mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);
            if ((_domElement instanceof FudgeUserInterface.Details))
                Controller.updateUserInterfaceStructure(_mutable, _domElement, mutator, _parentMutable, _parentKey);
            for (const key in mutator) {
                const element = Controller.findChildElementByKey(_domElement, key);
                if (!element)
                    continue;
                const mutant = Reflect.get(_mutable, key);
                const value = mutator[key];
                if (element instanceof FudgeUserInterface.CustomElement && element != document.activeElement)
                    element.setMutatorValue(value);
                else {
                    if (ƒ.isMutable(mutant) || Array.isArray(mutant))
                        this.updateUserInterface(mutant, element, mutator[key], _mutable, key);
                }
            }
        }
        /**
         * Ensures that a {@link Details} element matches the structure of the given {@link FudgeCore.Mutator}.
         * Performs a shallow **structural integrity check** by comparing the element’s cached {@link Controller.createSignature signature} with the mutator’s signature.
         * If they differ, the element’s content is rebuilt to reflect the new structure.
         * @param _mutable - The original mutable object represented in the UI.
         * @param _details - The {@link Details} element displaying the data.
         * @param _mutator - The mutator object describing the current structure and values.
         * @param _parentMutable - *(Optional)* The parent mutable object if nested.
         * @param _parentKey - *(Optional)* The key referencing this mutable within its parent.
         */
        static updateUserInterfaceStructure(_mutable, _details, _mutator, _parentMutable, _parentKey) {
            const mutatorSignature = Controller.createSignature(_mutator);
            const elementSignature = Controller.signatures.get(_details);
            if (elementSignature == undefined) {
                Controller.signatures.set(_details, mutatorSignature);
            }
            else if (mutatorSignature !== elementSignature) {
                let content;
                if (Array.isArray(_mutable))
                    content = FudgeUserInterface.Generator.createInterfaceFromArray(_mutable, _mutator, ƒ.Metadata.types(_parentMutable)[_parentKey], ƒ.Metadata.options(_parentMutable)[_parentKey]);
                else
                    content = FudgeUserInterface.Generator.createInterfaceFromMutable(_mutable, _mutator);
                _details.setContent(content);
                Controller.signatures.set(_details, mutatorSignature);
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
        static initializeValue(_mutable, _key, _type) {
            const type = _type ?? ƒ.Metadata.types(_mutable)[_key];
            let value;
            if (type == Number)
                value = 0;
            else if (type == String)
                value = "";
            else if (type == Boolean)
                value = true;
            else if (typeof type == "object")
                value = type[Object.getOwnPropertyNames(type).find(_name => !/^\d+$/.test(_name))]; // for enum get the first non numeric key
            else if (typeof type == "function")
                value = Reflect.construct(type, []);
            Reflect.set(_mutable, _key, value);
        }
        /**
         * Creates a shallow **structural signature** string for the given object.
         * The signature encodes each {@link Object.getOwnPropertyNames own property name} and its corresponding `typeof value`.
         * Unlike the normal `typeof` behavior, when a property value is `null`, the signature will contain `undefined` instead of `object`.
         *
         * @example
         * ```ts
         * Controller.createSignature({ x: 1, y: 2 });
         * // → "x:number|y:number"
         *
         * Controller.createSignature({ color: { r: 1 } });
         * // → "color:object"
         *
         * Controller.createSignature({ ref: null });
         * // → "ref:undefined"
         * ```
         */
        static createSignature(_object) {
            const keys = Object.getOwnPropertyNames(_object);
            const signature = new Array(keys.length);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = _object[key];
                const type = value == null ? "undefined" : typeof value;
                signature[i] = `${key}:${type}`;
            }
            return signature.join("|");
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
     * Static class generating UI-domElements from the information found in mutables and mutators
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
            if (!ƒ.isMutable(_mutable))
                return null;
            let name = _name || _mutable.constructor.name;
            let details = new FudgeUserInterface.Details(name, _mutable.type);
            details.setContent(Generator.createInterfaceFromMutable(_mutable, _mutator));
            return details;
        }
        static createDetailsFromArray(_mutable, _name, _mutator, _type, _getOptions) {
            if (!Array.isArray(_mutable))
                return null;
            let details = new FudgeUserInterface.DetailsArray(_name);
            details.setContent(Generator.createInterfaceFromArray(_mutable, _mutator, _type, _getOptions));
            return details;
        }
        /**
         * Create a div-Elements containing the interface for the [[FudgeCore.Mutator]] or the [[FudgeCore.Mutable]]
         */
        static createInterfaceFromMutable(_mutable, _mutator) {
            const mutator = _mutator ?? ƒ.Mutable.getMutator(_mutable);
            const types = ƒ.Mutable.getTypes(_mutable, mutator);
            const options = ƒ.Metadata.options(_mutable);
            const div = document.createElement("div");
            for (const key in mutator) {
                const element = Generator.createInterfaceElement(_mutable, mutator, key, types[key], options[key]);
                if (!element)
                    continue;
                div.appendChild(element);
            }
            return div;
        }
        static createInterfaceFromArray(_mutable, _mutator, _type, _getOptions) {
            const div = document.createElement("div");
            for (const key in _mutator) {
                const element = Generator.createInterfaceElement(_mutable, _mutator, key, _type, _getOptions);
                if (!element)
                    continue;
                div.appendChild(element);
            }
            return div;
        }
        static createInterfaceElement(_mutable, _mutator, _key, _type, _getOptions) {
            const mutant = Reflect.get(_mutable, _key);
            const value = Reflect.get(_mutable, _key);
            let element;
            if (Array.isArray(mutant))
                element = Generator.createDetailsFromArray(mutant, _key, value, _type, _getOptions);
            if (!element)
                element = Generator.createMutatorElement(_key, _type, value);
            if (!element && _getOptions)
                element = new FudgeUserInterface.CustomElementComboSelect({ key: _key, label: _key, type: _type.name }, value, _getOptions.call(_mutable, _key));
            if (!element)
                element = Generator.createDetailsFromMutable(mutant, _key, value);
            if (!element)
                element = new FudgeUserInterface.CustomElementInitializer({ key: _key, label: _key });
            if (!element) { // undefined values without a type can't be displayed
                console.warn("No interface created for", _mutable.constructor.name, _key);
                return null;
            }
            return element;
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
            if (_value == null)
                return null;
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
        get isInitialized() {
            return this.initialized;
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
        constructor(_attributes, _value, _options) {
            super(_attributes);
            this.hndClick = (_event) => {
                this.input.value = "";
                this.button.hidden = true;
                this.dispatchEvent(new Event("change" /* EVENT.CHANGE */, { bubbles: true }));
            };
            this.hndFocus = (_event) => {
                this.datalist.innerHTML = ""; // clear previous entries
                const options = this.getOptions();
                for (const key in options) {
                    const entry = document.createElement("option");
                    entry.value = key;
                    this.datalist.appendChild(entry);
                }
            };
            this.hndInput = (_event) => {
                this.button.hidden = !_event.target.value;
                _event.stopPropagation();
            };
            this.hndChange = async (_event) => {
                const options = this.getOptions();
                if (this.input.value != "" && !Reflect.has(options, this.input.value)) {
                    this.setMutatorValue(this.value);
                    return;
                }
                this.value = options[this.input.value];
                this.dispatchEvent(new CustomEvent("setValue" /* EVENT.SET_VALUE */, { bubbles: true, detail: { value: this.value } }));
            };
            this.options = _options;
            this.value = _value;
        }
        /**
         * Creates the content of the element when connected the first time
         */
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            this.appendLabel();
            this.datalist = document.createElement("datalist");
            this.datalist.id = FudgeUserInterface.CustomElement.nextId.toString();
            this.appendChild(this.datalist);
            this.input = document.createElement("input");
            this.input.setAttribute("list", this.datalist.id);
            this.input.placeholder = `${this.getAttribute("type")}...`;
            this.input.spellcheck = false;
            this.input.addEventListener("focus" /* EVENT.FOCUS */, this.hndFocus);
            this.input.addEventListener("input" /* EVENT.INPUT */, this.hndInput);
            this.input.addEventListener("keyup" /* EVENT.KEY_UP */, this.hndKey);
            this.appendChild(this.input);
            this.button = document.createElement("button");
            this.button.addEventListener("click" /* EVENT.CLICK */, this.hndClick);
            this.button.hidden = true;
            this.appendChild(this.button);
            this.addEventListener("change" /* EVENT.CHANGE */, this.hndChange);
            if (this.value)
                this.setMutatorValue(this.value);
        }
        getMutatorValue() {
            const options = this.getOptions();
            return options[this.input.value];
        }
        setMutatorValue(_value) {
            if (this.input == document.activeElement)
                return;
            const value = _value ? _value.name ?? _value.toString() : "";
            const button = this.querySelector("button");
            button.hidden = !value;
            this.input.value = value;
        }
        hndKey(_event) {
            _event.stopPropagation();
        }
        ;
        getOptions() {
            this.dispatchEvent(new Event("requestOptions" /* EVENT.REQUEST_OPTIONS */, { bubbles: true }));
            return this.options;
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
var FudgeUserInterface;
(function (FudgeUserInterface) {
    /**
     * A standard checkbox with a label to it
     */
    class CustomElementInitializer extends FudgeUserInterface.CustomElement {
        // @ts-ignore
        static { this.customElement = FudgeUserInterface.CustomElement.register("fudge-initializer", CustomElementInitializer); }
        constructor(_attributes) {
            super(_attributes);
            this.hndClick = (_event) => {
                this.dispatchEvent(new Event("initializeValue" /* EVENT.INITIALIZE_VALUE */, { bubbles: true }));
            };
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
            this.appendLabel();
            this.output = document.createElement("output");
            this.output.value = "<null>";
            this.appendChild(this.output);
            this.button = document.createElement("button");
            this.button.innerText = "+";
            this.button.addEventListener("click" /* EVENT.CLICK */, this.hndClick);
            this.appendChild(this.button);
        }
        /**
         * Retrieves the status of the checkbox as boolean value
         */
        getMutatorValue() {
            return null;
        }
        /**
         * Sets the status of the checkbox
         */
        setMutatorValue(_value) {
            //
        }
    }
    FudgeUserInterface.CustomElementInitializer = CustomElementInitializer;
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
     * An interactive number stepper with exponential display and complex handling using keyboard and mouse
     */
    class CustomElementNumber extends FudgeUserInterface.CustomElement {
        // @ts-ignore
        static { this.customElement = FudgeUserInterface.CustomElement.register("fudge-number", CustomElementNumber); }
        constructor(_attributes) {
            super(_attributes);
            this.value = 0;
            this.startValue = 0;
            this.startDecimals = 0;
            this.delta = 0;
            this.pixels = 0;
            this.speed = 0.01;
            this.hndPointerdownInput = (_event) => {
                if (document.activeElement == this.input)
                    return;
                window.addEventListener("pointermove", this.hndPointermoveWindow);
                window.addEventListener("pointerup", this.hndPointerupWindow);
                _event.preventDefault();
            };
            this.hndPointermoveWindow = (_event) => {
                this.speed = this.step ?? 0.01;
                if (_event.ctrlKey)
                    this.speed *= 0.1;
                else if (_event.shiftKey)
                    this.speed *= 10;
                this.pixels += _event.movementX;
                const move = Math.trunc(this.pixels / 2);
                if (move != 0) {
                    if (!this.dragging) {
                        this.dragging = true;
                        this.delta = 0;
                        this.startValue = this.value;
                        this.startDecimals = this.decimals(this.input.value);
                        this.input.requestPointerLock();
                        this.input.classList.add("hide-carret");
                        this.input.focus();
                        return;
                    }
                    this.pixels -= move * 2;
                    this.delta += move * this.speed;
                    let value = this.startValue + this.delta;
                    this.setMutatorValue(value);
                }
                _event.preventDefault();
            };
            this.hndPointerupWindow = () => {
                if (this.dragging) {
                    this.dragging = false;
                    this.input.blur();
                    this.input.classList.remove("hide-carret");
                    if (this.startValue != this.value)
                        this.input.dispatchEvent(new Event("change", { bubbles: true }));
                }
                if (document.pointerLockElement == this.input)
                    document.exitPointerLock();
                window.removeEventListener("pointermove", this.hndPointermoveWindow);
                window.removeEventListener("pointerup", this.hndPointerupWindow);
            };
            this.hndPointerupInput = () => {
                if (!this.dragging)
                    this.input.focus();
            };
            this.hndFocus = () => {
                if (!this.dragging)
                    this.input.select();
            };
            this.hndChange = (_event) => {
                this.setMutatorValue(parseFloat(this.input.value));
            };
            this.hndInput = (_event) => {
                _event.stopPropagation(); // prevent bubbling of input event to controller;
            };
            this.hndKey = (_event) => {
                _event.stopPropagation();
            };
            if (_attributes && _attributes["value"])
                this.value = parseFloat(_attributes["value"]);
        }
        get min() {
            return this.input.min == "" ? undefined : parseFloat(this.input.min);
        }
        get max() {
            return this.input.max == "" ? undefined : parseFloat(this.input.max);
        }
        get step() {
            return this.input.step == "" ? undefined : parseFloat(this.input.step);
        }
        /**
         * Creates the content of the element when connected the first time
         */
        connectedCallback() {
            if (this.initialized)
                return;
            this.initialized = true;
            this.appendLabel();
            this.input = document.createElement("input");
            this.input.type = "text"; // use text to enforce decimal point notation
            this.input.min = this.getAttribute("min") ?? "";
            this.input.max = this.getAttribute("max") ?? "";
            this.input.step = this.getAttribute("step") ?? "";
            this.input.inputMode = "decimal";
            this.input.onchange = this.hndChange;
            this.input.oninput = this.hndInput;
            this.input.onkeydown = this.hndKey;
            this.input.onkeyup = this.hndKey;
            this.input.onfocus = this.hndFocus;
            this.input.onpointerdown = this.hndPointerdownInput;
            this.input.onpointerup = this.hndPointerupInput;
            this.appendChild(this.input);
            this.setMutatorValue(parseFloat(this.getAttribute("value")));
        }
        disconnectedCallback() {
            this.hndPointerupWindow();
        }
        getMutatorValue() {
            return this.value;
        }
        setMutatorValue(_value) {
            if (_value == undefined || isNaN(_value)) {
                this.input.value = this.value.toString();
                return;
            }
            const min = this.min;
            if (min != null)
                _value = Math.max(_value, min);
            const max = this.max;
            if (max != null)
                _value = Math.min(_value, max);
            const step = this.step;
            if (step != null) {
                const decimals = this.decimals(step);
                _value = FudgeCore.Calc.snap(_value, step);
                _value = parseFloat(_value.toFixed(decimals));
                this.input.value = _value.toFixed(decimals);
            }
            else if (this.dragging) {
                this.input.value = _value.toFixed(Math.max(this.startDecimals, this.decimals(this.speed)));
            }
            else {
                this.input.value = _value.toString();
            }
            this.value = _value;
        }
        decimals(_number) {
            const parts = _number.toString().toLowerCase().split('e');
            const mantissa = parts[0];
            const exp = parts.length > 1 ? parseInt(parts[1], 10) : 0;
            const frac = mantissa.split('.')[1] || '';
            const decimals = Math.max(0, frac.length - exp);
            return decimals;
        }
        ;
    }
    FudgeUserInterface.CustomElementNumber = CustomElementNumber;
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
            this.hndClickButton = (_event) => {
                this.input.setMutatorValue(this.input.getMutatorValue() + 1);
                this.dispatchEvent(new CustomEvent("restructureArray" /* EVENT.RESTRUCTURE_ARRAY */, { bubbles: true, detail: { length: this.input.value } }));
            };
            this.hndChangeInput = (_event) => {
                this.dispatchEvent(new CustomEvent("restructureArray" /* EVENT.RESTRUCTURE_ARRAY */, { bubbles: true, detail: { length: this.input.value } }));
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
            this.input = new FudgeUserInterface.CustomElementNumber({ key: "length", label: "length", value: "0", min: "0", step: "1" });
            this.input.addEventListener("change" /* EVENT.CHANGE */, this.hndChangeInput);
            this.querySelector("summary").after(this.input);
            this.button = document.createElement("button");
            this.button.innerText = "+";
            this.button.addEventListener("click" /* EVENT.CLICK */, this.hndClickButton);
            this.appendChild(this.button);
        }
        setContent(_content) {
            super.setContent(_content);
            for (let child of this.content.children)
                this.addEventListeners(child);
            if (this.input.isInitialized)
                this.input.setMutatorValue(this.content.children.length);
            else
                this.input.setAttribute("value", this.content.children.length.toString());
        }
        // public getMutator(): ƒ.Mutator {
        //   let mutator: ƒ.Mutator[] = [];
        //   for (let child of this.content.children as HTMLCollectionOf<CustomElement>)
        //     mutator.push(child.getMutatorValue());
        //   return mutator;
        // }
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
            for (let child of this.content.children)
                sequence.push(parseInt(child.getAttribute("label")));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VVc2VySW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ2xpcGJvYXJkLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvUmVmZXJlbmNlcy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvR2VuZXJhdG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Qm9vbGVhbi50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudENvbG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Q29tYm9TZWxlY3QudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnREaWdpdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudEluaXRpYWxpemVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50VGVtcGxhdGUudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRNYXRyaXgzeDMudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRNYXRyaXg0eDQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnROdW1iZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRPdXRwdXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRTZWxlY3QudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRTdGVwcGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50VGV4dElucHV0LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9EYXRhQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvRGV0YWlscy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvRGV0YWlsc0FycmF5LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9EaWFsb2cudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L011bHRpTGV2ZWxNZW51LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9XYXJuaW5nLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVGFibGUvVGFibGVDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZUl0ZW0udHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZUxpc3QudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlSXRlbS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0V2ZW50L0V2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLGtCQUFrQixDQTRCM0I7QUE1QkQsV0FBVSxrQkFBa0I7SUFDMUI7OztPQUdHO0lBS0gsTUFBYSxTQUFTO1FBQXRCO1lBR1MsWUFBTyxHQUFnQixFQUFFLENBQUM7UUFlbkMsQ0FBQztpQkFqQmUsYUFBUSxHQUFjLElBQUksU0FBUyxFQUFFLEFBQTdCLENBQThCO2lCQUN0QyxjQUFTLEdBQWMsSUFBSSxTQUFTLEVBQUUsQUFBN0IsQ0FBOEI7UUFJOUMsR0FBRztZQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDO1FBRU0sS0FBSztZQUNWLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLENBQUM7UUFFTSxHQUFHLENBQUMsUUFBa0IsRUFBRSxVQUEwQjtZQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztRQUM5QixDQUFDOztJQWpCVSw0QkFBUyxZQWtCckIsQ0FBQTtBQUNILENBQUMsRUE1QlMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQTRCM0I7QUM1QkQsNklBQTZJO0FDQTdJLElBQVUsa0JBQWtCLENBd1czQjtBQXhXRCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckI7OztPQUdHO0lBQ0gsTUFBYSxVQUFVO2lCQUNFLGVBQVUsR0FBaUMsSUFBSSxPQUFPLEVBQUUsQUFBOUMsQ0FBK0M7UUFTaEYsWUFBbUIsUUFBZ0IsRUFBRSxXQUF3QjtZQUxuRCxlQUFVLEdBQVcsR0FBRyxDQUFDO1lBc056QixrQkFBYSxHQUFHLEtBQUssRUFBRSxNQUFh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InNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIENvbW1vbiBjbGlwYm9hcmRzIGZvciBhbGwgZHJhZy1kcm9wIGFuZCBjb3B5LXBhc3RlIG9wZXJhdGlvbnMgaGFwcGVuaW5nIGluIHRoZSB1c2VyIGludGVyZmFjZVxyXG4gICAqIEBhdXRob3IgSmlya2EgRGVsbCdPcm8tRnJpZWRsLCBIRlUsIDIwMjRcclxuICAgKi9cclxuXHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIGV4cG9ydCB0eXBlIENsaXBPcGVyYXRpb24gPSBFVkVOVC5DT1BZIHwgRVZFTlQuQ1VUO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ2xpcGJvYXJkIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZHJhZ0Ryb3A6IENsaXBib2FyZCA9IG5ldyBDbGlwYm9hcmQoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgY29weVBhc3RlOiBDbGlwYm9hcmQgPSBuZXcgQ2xpcGJvYXJkKCk7XHJcbiAgICBwdWJsaWMgb2JqZWN0czogxpIuR2VuZXJhbFtdID0gW107XHJcbiAgICBwdWJsaWMgb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uO1xyXG5cclxuICAgIHB1YmxpYyBnZXQ8VD4oKTogVFtdIHtcclxuICAgICAgcmV0dXJuIHRoaXMub2JqZWN0cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMub2JqZWN0cyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQoX29iamVjdHM6IE9iamVjdFtdLCBfb3BlcmF0aW9uPzogQ2xpcE9wZXJhdGlvbik6IHZvaWQge1xyXG4gICAgICB0aGlzLm9iamVjdHMgPSBfb2JqZWN0cy5zbGljZSgpO1xyXG4gICAgICB0aGlzLm9wZXJhdGlvbiA9IF9vcGVyYXRpb247XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIi8vIC8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vRGlzdHJpYnV0aW9uL0Z1ZGdlQ29yZS5kLnRzXCIvPiAvLyBUT0RPOiBub3cgdGhhdCB3ZSB1c2UgcGFja2FnZSByZWZlcmVuY2VzIGluIHRoZSB0c2NvbmZpZywgdGhpcyBmaWxlIGlzIG9ic29sZXRlIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBDb25uZWN0cyBhIG11dGFibGUgb2JqZWN0IHRvIGEgRE9NLUVsZW1lbnQgYW5kIHN5bmNocm9uaXplcyB0aGF0IG11dGFibGUgd2l0aCB0aGUgbXV0YXRvciBzdG9yZWQgd2l0aGluLlxyXG4gICAqIFVwZGF0ZXMgdGhlIG11dGFibGUgb24gaW50ZXJhY3Rpb24gd2l0aCB0aGUgZWxlbWVudCBhbmQgdGhlIGVsZW1lbnQgaW4gdGltZSBpbnRlcnZhbHMuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIENvbnRyb2xsZXIge1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBzaWduYXR1cmVzOiBXZWFrTWFwPEhUTUxFbGVtZW50LCBzdHJpbmc+ID0gbmV3IFdlYWtNYXAoKTtcclxuXHJcbiAgICAvLyBUT0RPOiBleGFtaW5lIHRoZSB1c2Ugb2YgdGhlIGF0dHJpYnV0ZSBrZXkgdnMgbmFtZS4gS2V5IHNpZ25hbHMgdGhlIHVzZSBieSBGVURHRSB3aGlsZSBuYW1lIGlzIHN0YW5kYXJkIGFuZCBzdXBwb3J0ZWQgYnkgZm9ybXNcclxuICAgIHB1YmxpYyBkb21FbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIHByb3RlY3RlZCB0aW1lVXBkYXRlOiBudW1iZXIgPSAxOTA7XHJcbiAgICBwcm90ZWN0ZWQgbXV0YWJsZTogb2JqZWN0O1xyXG5cclxuICAgIHByaXZhdGUgaWRJbnRlcnZhbDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbXV0YWJsZTogb2JqZWN0LCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQpIHtcclxuICAgICAgdGhpcy5kb21FbGVtZW50ID0gX2RvbUVsZW1lbnQ7XHJcbiAgICAgIHRoaXMuc2V0TXV0YWJsZShfbXV0YWJsZSk7XHJcbiAgICAgIC8vIFRPRE86IGV4YW1pbmUsIGlmIHRoaXMgc2hvdWxkIHJlZ2lzdGVyIHRvIG9uZSBjb21tb24gaW50ZXJ2YWwsIGluc3RlYWQgb2YgZWFjaCBpbnN0YWxsaW5nIGl0cyBvd24uXHJcbiAgICAgIHRoaXMuc3RhcnRSZWZyZXNoKCk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOUFVULCB0aGlzLm11dGF0ZU9uSW5wdXQpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5SRUFSUkFOR0VfQVJSQVksIHRoaXMucmVhcnJhbmdlQXJyYXkpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5SRVNUUlVDVFVSRV9BUlJBWSwgdGhpcy5yZXNpemVBcnJheSk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlJFUVVFU1RfT1BUSU9OUywgdGhpcy5wcm92aWRlT3B0aW9ucyk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFVF9WQUxVRSwgdGhpcy5zZXRWYWx1ZSk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOSVRJQUxJWkVfVkFMVUUsIHRoaXMuaW5pdGlhbGl6ZVZhbHVlKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyBhbiBleGlzdGluZyBtdXRhdG9yIGFzIGEgdGVtcGxhdGUgXHJcbiAgICAgKiBhbmQgdXBkYXRpbmcgaXRzIHZhbHVlcyB3aXRoIHRob3NlIGZvdW5kIGluIHRoZSBnaXZlbiBVSS1kb21FbGVtZW50LiBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVNdXRhdG9yKF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX211dGF0b3I6IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgZm9yIChsZXQga2V5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBlbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICAgIGVsc2UgaWYgKF9tdXRhdG9yW2tleV0gaW5zdGFuY2VvZiBPYmplY3QpXHJcbiAgICAgICAgICBfbXV0YXRvcltrZXldID0gQ29udHJvbGxlci51cGRhdGVNdXRhdG9yKGVsZW1lbnQsIF9tdXRhdG9yW2tleV0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBlbGVtZW50LnZhbHVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gX211dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyB0aGUgYSBtdXRhYmxlIGFzIGEgdGVtcGxhdGUgdG8gY3JlYXRlIGEgbXV0YXRvciBvciB1cGRhdGUgdGhlIGdpdmVuIG11dGF0b3IuXHJcbiAgICAgKiB3aXRoIHRoZSB2YWx1ZXMgaW4gdGhlIGdpdmVuIFVJLWRvbUVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRNdXRhdG9yKF9tdXRhYmxlOiBvYmplY3QsIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX211dGF0b3I/OiDGki5NdXRhdG9yLCBfdHlwZXM/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gX211dGF0b3IgPz8gxpIuTXV0YWJsZS5nZXRNdXRhdG9yKF9tdXRhYmxlKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBtdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gQ29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgPT0gbnVsbClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQpXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSBlbGVtZW50LmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgbXV0YW50OiB1bmtub3duID0gUmVmbGVjdC5nZXQoX211dGFibGUsIGtleSk7XHJcbiAgICAgICAgICBpZiAoxpIuaXNNdXRhYmxlKG11dGFudCkgfHwgQXJyYXkuaXNBcnJheShtdXRhbnQpKVxyXG4gICAgICAgICAgICBtdXRhdG9yW2tleV0gPSB0aGlzLmdldE11dGF0b3IobXV0YW50LCBlbGVtZW50LCBtdXRhdG9yW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmUgbWV0aG9kIHRha2luZyB0aGUgbXV0YXRvciBvZiBhIG11dGFibGUgYW5kIHVwZGF0aW5nIHRoZSBVSS1kb21FbGVtZW50IGFjY29yZGluZ2x5LlxyXG4gICAgICogSWYgYW4gYWRkaXRpb25hbCBtdXRhdG9yIGlzIHBhc3NlZCwgaXRzIHZhbHVlcyBhcmUgdXNlZCBpbnN0ZWFkIG9mIHRob3NlIG9mIHRoZSBtdXRhYmxlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZVVzZXJJbnRlcmZhY2UoX211dGFibGU6IG9iamVjdCwgX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfbXV0YXRvcj86IMaSLk11dGF0b3IsIF9wYXJlbnRNdXRhYmxlPzogb2JqZWN0LCBfcGFyZW50S2V5Pzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciA/PyDGki5NdXRhYmxlLmdldE11dGF0b3IoX211dGFibGUpO1xyXG5cclxuICAgICAgaWYgKChfZG9tRWxlbWVudCBpbnN0YW5jZW9mIERldGFpbHMpKVxyXG4gICAgICAgIENvbnRyb2xsZXIudXBkYXRlVXNlckludGVyZmFjZVN0cnVjdHVyZShfbXV0YWJsZSwgX2RvbUVsZW1lbnQsIG11dGF0b3IsIF9wYXJlbnRNdXRhYmxlLCBfcGFyZW50S2V5KTtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIG11dGF0b3IpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50OiBDdXN0b21FbGVtZW50ID0gPEN1c3RvbUVsZW1lbnQ+Q29udHJvbGxlci5maW5kQ2hpbGRFbGVtZW50QnlLZXkoX2RvbUVsZW1lbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGNvbnN0IG11dGFudDogdW5rbm93biA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlOiDGki5HZW5lcmFsID0gbXV0YXRvcltrZXldO1xyXG5cclxuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnQgJiYgZWxlbWVudCAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgaWYgKMaSLmlzTXV0YWJsZShtdXRhbnQpIHx8IEFycmF5LmlzQXJyYXkobXV0YW50KSlcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVVc2VySW50ZXJmYWNlKG11dGFudCwgZWxlbWVudCwgbXV0YXRvcltrZXldLCBfbXV0YWJsZSwga2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEVuc3VyZXMgdGhhdCBhIHtAbGluayBEZXRhaWxzfSBlbGVtZW50IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ2l2ZW4ge0BsaW5rIEZ1ZGdlQ29yZS5NdXRhdG9yfS5cclxuICAgICAqIFBlcmZvcm1zIGEgc2hhbGxvdyAqKnN0cnVjdHVyYWwgaW50ZWdyaXR5IGNoZWNrKiogYnkgY29tcGFyaW5nIHRoZSBlbGVtZW504oCZcyBjYWNoZWQge0BsaW5rIENvbnRyb2xsZXIuY3JlYXRlU2lnbmF0dXJlIHNpZ25hdHVyZX0gd2l0aCB0aGUgbXV0YXRvcuKAmXMgc2lnbmF0dXJlLlxyXG4gICAgICogSWYgdGhleSBkaWZmZXIsIHRoZSBlbGVtZW504oCZcyBjb250ZW50IGlzIHJlYnVpbHQgdG8gcmVmbGVjdCB0aGUgbmV3IHN0cnVjdHVyZS5cclxuICAgICAqIEBwYXJhbSBfbXV0YWJsZSAtIFRoZSBvcmlnaW5hbCBtdXRhYmxlIG9iamVjdCByZXByZXNlbnRlZCBpbiB0aGUgVUkuXHJcbiAgICAgKiBAcGFyYW0gX2RldGFpbHMgLSBUaGUge0BsaW5rIERldGFpbHN9IGVsZW1lbnQgZGlzcGxheWluZyB0aGUgZGF0YS5cclxuICAgICAqIEBwYXJhbSBfbXV0YXRvciAtIFRoZSBtdXRhdG9yIG9iamVjdCBkZXNjcmliaW5nIHRoZSBjdXJyZW50IHN0cnVjdHVyZSBhbmQgdmFsdWVzLlxyXG4gICAgICogQHBhcmFtIF9wYXJlbnRNdXRhYmxlIC0gKihPcHRpb25hbCkqIFRoZSBwYXJlbnQgbXV0YWJsZSBvYmplY3QgaWYgbmVzdGVkLlxyXG4gICAgICogQHBhcmFtIF9wYXJlbnRLZXkgLSAqKE9wdGlvbmFsKSogVGhlIGtleSByZWZlcmVuY2luZyB0aGlzIG11dGFibGUgd2l0aGluIGl0cyBwYXJlbnQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlVXNlckludGVyZmFjZVN0cnVjdHVyZShfbXV0YWJsZTogb2JqZWN0LCBfZGV0YWlsczogRGV0YWlscywgX211dGF0b3I6IMaSLk11dGF0b3IsIF9wYXJlbnRNdXRhYmxlPzogb2JqZWN0LCBfcGFyZW50S2V5Pzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IG11dGF0b3JTaWduYXR1cmU6IHN0cmluZyA9IENvbnRyb2xsZXIuY3JlYXRlU2lnbmF0dXJlKF9tdXRhdG9yKTtcclxuICAgICAgY29uc3QgZWxlbWVudFNpZ25hdHVyZTogc3RyaW5nID0gQ29udHJvbGxlci5zaWduYXR1cmVzLmdldChfZGV0YWlscyk7XHJcblxyXG4gICAgICBpZiAoZWxlbWVudFNpZ25hdHVyZSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBDb250cm9sbGVyLnNpZ25hdHVyZXMuc2V0KF9kZXRhaWxzLCBtdXRhdG9yU2lnbmF0dXJlKTtcclxuICAgICAgfSBlbHNlIGlmIChtdXRhdG9yU2lnbmF0dXJlICE9PSBlbGVtZW50U2lnbmF0dXJlKSB7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShfbXV0YWJsZSkpXHJcbiAgICAgICAgICBjb250ZW50ID0gR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21BcnJheShfbXV0YWJsZSwgX211dGF0b3IsIMaSLk1ldGFkYXRhLnR5cGVzKF9wYXJlbnRNdXRhYmxlKVtfcGFyZW50S2V5XSwgxpIuTWV0YWRhdGEub3B0aW9ucyhfcGFyZW50TXV0YWJsZSlbX3BhcmVudEtleV0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGNvbnRlbnQgPSBHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGFibGUoX211dGFibGUsIF9tdXRhdG9yKTtcclxuXHJcbiAgICAgICAgX2RldGFpbHMuc2V0Q29udGVudChjb250ZW50KTtcclxuICAgICAgICBDb250cm9sbGVyLnNpZ25hdHVyZXMuc2V0KF9kZXRhaWxzLCBtdXRhdG9yU2lnbmF0dXJlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGVyZm9ybXMgYSBicmVhZHRoLWZpcnN0IHNlYXJjaCBvbiB0aGUgZ2l2ZW4gX2RvbUVsZW1lbnQgZm9yIGFuIGVsZW1lbnQgd2l0aCB0aGUgZ2l2ZW4ga2V5LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9rZXk6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IGVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PiA9IF9kb21FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtrZXk9XCIke19rZXl9XCJdYCk7XHJcbiAgICAgIGlmIChlbGVtZW50cy5sZW5ndGggPCAyKVxyXG4gICAgICAgIHJldHVybiBlbGVtZW50c1swXTtcclxuXHJcbiAgICAgIGxldCBzaG9ydGVzdFBhdGg6IG51bWJlciA9IEluZmluaXR5O1xyXG4gICAgICBsZXQgY2xvc2VzdEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xyXG4gICAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IgKGxldCBwYXJlbnRFbGVtZW50OiBIVE1MRWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDsgcGFyZW50RWxlbWVudCAhPSBfZG9tRWxlbWVudDsgcGFyZW50RWxlbWVudCA9IHBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudClcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgaWYgKGNvdW50IDwgc2hvcnRlc3RQYXRoKSB7XHJcbiAgICAgICAgICBjbG9zZXN0RWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICBzaG9ydGVzdFBhdGggPSBjb3VudDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjbG9zZXN0RWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXRpYWxpemVWYWx1ZShfbXV0YWJsZTogb2JqZWN0LCBfa2V5OiBzdHJpbmcgfCBudW1iZXIsIF90eXBlOiBGdW5jdGlvbiB8IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IHR5cGU6IEZ1bmN0aW9uIHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSBfdHlwZSA/PyDGki5NZXRhZGF0YS50eXBlcyhfbXV0YWJsZSlbX2tleV07XHJcbiAgICAgIGxldCB2YWx1ZTogdW5rbm93bjtcclxuXHJcbiAgICAgIGlmICh0eXBlID09IE51bWJlcilcclxuICAgICAgICB2YWx1ZSA9IDA7XHJcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gU3RyaW5nKVxyXG4gICAgICAgIHZhbHVlID0gXCJcIjtcclxuICAgICAgZWxzZSBpZiAodHlwZSA9PSBCb29sZWFuKVxyXG4gICAgICAgIHZhbHVlID0gdHJ1ZTtcclxuICAgICAgZWxzZSBpZiAodHlwZW9mIHR5cGUgPT0gXCJvYmplY3RcIilcclxuICAgICAgICB2YWx1ZSA9IHR5cGVbT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModHlwZSkuZmluZChfbmFtZSA9PiAhL15cXGQrJC8udGVzdChfbmFtZSkpXTsgLy8gZm9yIGVudW0gZ2V0IHRoZSBmaXJzdCBub24gbnVtZXJpYyBrZXlcclxuICAgICAgZWxzZSBpZiAodHlwZW9mIHR5cGUgPT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIHZhbHVlID0gUmVmbGVjdC5jb25zdHJ1Y3QodHlwZSwgW10pO1xyXG5cclxuICAgICAgUmVmbGVjdC5zZXQoX211dGFibGUsIF9rZXksIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBzaGFsbG93ICoqc3RydWN0dXJhbCBzaWduYXR1cmUqKiBzdHJpbmcgZm9yIHRoZSBnaXZlbiBvYmplY3QuXHJcbiAgICAgKiBUaGUgc2lnbmF0dXJlIGVuY29kZXMgZWFjaCB7QGxpbmsgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgb3duIHByb3BlcnR5IG5hbWV9IGFuZCBpdHMgY29ycmVzcG9uZGluZyBgdHlwZW9mIHZhbHVlYC5cclxuICAgICAqIFVubGlrZSB0aGUgbm9ybWFsIGB0eXBlb2ZgIGJlaGF2aW9yLCB3aGVuIGEgcHJvcGVydHkgdmFsdWUgaXMgYG51bGxgLCB0aGUgc2lnbmF0dXJlIHdpbGwgY29udGFpbiBgdW5kZWZpbmVkYCBpbnN0ZWFkIG9mIGBvYmplY3RgLlxyXG4gICAgICogXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIENvbnRyb2xsZXIuY3JlYXRlU2lnbmF0dXJlKHsgeDogMSwgeTogMiB9KTtcclxuICAgICAqIC8vIOKGkiBcIng6bnVtYmVyfHk6bnVtYmVyXCJcclxuICAgICAqIFxyXG4gICAgICogQ29udHJvbGxlci5jcmVhdGVTaWduYXR1cmUoeyBjb2xvcjogeyByOiAxIH0gfSk7XHJcbiAgICAgKiAvLyDihpIgXCJjb2xvcjpvYmplY3RcIlxyXG4gICAgICogXHJcbiAgICAgKiBDb250cm9sbGVyLmNyZWF0ZVNpZ25hdHVyZSh7IHJlZjogbnVsbCB9KTtcclxuICAgICAqIC8vIOKGkiBcInJlZjp1bmRlZmluZWRcIlxyXG4gICAgICogYGBgICAgIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVNpZ25hdHVyZShfb2JqZWN0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IHN0cmluZyB7XHJcbiAgICAgIGNvbnN0IGtleXM6IHN0cmluZ1tdID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoX29iamVjdCk7XHJcbiAgICAgIGNvbnN0IHNpZ25hdHVyZTogc3RyaW5nW10gPSBuZXcgQXJyYXkoa2V5cy5sZW5ndGgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBrZXk6IHN0cmluZyA9IGtleXNbaV07XHJcbiAgICAgICAgY29uc3QgdmFsdWU6IHVua25vd24gPSBfb2JqZWN0W2tleV07XHJcbiAgICAgICAgY29uc3QgdHlwZTogc3RyaW5nID0gdmFsdWUgPT0gbnVsbCA/IFwidW5kZWZpbmVkXCIgOiB0eXBlb2YgdmFsdWU7XHJcblxyXG4gICAgICAgIHNpZ25hdHVyZVtpXSA9IGAke2tleX06JHt0eXBlfWA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBzaWduYXR1cmUuam9pbihcInxcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3IoX211dGF0b3I/OiDGki5NdXRhdG9yLCBfdHlwZXM/OiDGki5NdXRhdG9yKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIHJldHVybiBDb250cm9sbGVyLmdldE11dGF0b3IodGhpcy5tdXRhYmxlLCB0aGlzLmRvbUVsZW1lbnQsIF9tdXRhdG9yLCBfdHlwZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVVc2VySW50ZXJmYWNlKCk6IHZvaWQge1xyXG4gICAgICBDb250cm9sbGVyLnVwZGF0ZVVzZXJJbnRlcmZhY2UodGhpcy5tdXRhYmxlLCB0aGlzLmRvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhYmxlKCk6IG9iamVjdCB7XHJcbiAgICAgIHJldHVybiB0aGlzLm11dGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGFibGUoX211dGFibGU6IG9iamVjdCk6IHZvaWQge1xyXG4gICAgICB0aGlzLm11dGFibGUgPSBfbXV0YWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnRSZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmlkSW50ZXJ2YWwpO1xyXG4gICAgICB0aGlzLmlkSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5yZWZyZXNoLCB0aGlzLnRpbWVVcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBtdXRhdGVPbklucHV0ID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHBhdGg6IHN0cmluZ1tdID0gdGhpcy5nZXRNdXRhdG9yUGF0aChfZXZlbnQpO1xyXG5cclxuICAgICAgLy8gZ2V0IGN1cnJlbnQgbXV0YXRvciBhbmQgc2F2ZSBmb3IgdW5kb1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IMaSLk11dGFibGUuZ2V0TXV0YXRvcih0aGlzLm11dGFibGUpO1xyXG4gICAgICAvLyDGki5EZWJ1Zy5pbmZvKG11dGF0b3IpO1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU0FWRV9ISVNUT1JZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBoaXN0b3J5OiAwLCBtdXRhYmxlOiB0aGlzLm11dGFibGUsIG11dGF0b3I6IMaSLk11dGFibGUuY2xvbmVNdXRhdG9yRnJvbVBhdGgobXV0YXRvciwgcGF0aCkgfSB9KSk7XHJcblxyXG4gICAgICAvLyBnZXQgY3VycmVudCBtdXRhdG9yIGZyb20gaW50ZXJmYWNlIGZvciBtdXRhdGlvbiAgIFxyXG4gICAgICBtdXRhdG9yID0gdGhpcy5nZXRNdXRhdG9yKCk7XHJcbiAgICAgIGF3YWl0IMaSLk11dGFibGUubXV0YXRlKHRoaXMubXV0YWJsZSwgxpIuTXV0YWJsZS5jbG9uZU11dGF0b3JGcm9tUGF0aChtdXRhdG9yLCBwYXRoKSk7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5NVVRBVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCByZWFycmFuZ2VBcnJheSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogbnVtYmVyW10gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsLnNlcXVlbmNlO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSB0aGlzLmdldE11dGF0b3JQYXRoKF9ldmVudCk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IMaSLk11dGFibGUgfCDGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4gPSB0aGlzLmdldFRhcmdldChwYXRoKTtcclxuXHJcbiAgICAgIC8vIHJlYXJyYW5nZSB0aGF0IG11dGFibGVcclxuICAgICAgKDzGki5NdXRhYmxlQXJyYXk8xpIuTXV0YWJsZT4+PHVua25vd24+dGFyZ2V0KS5yZWFycmFuZ2Uoc2VxdWVuY2UpO1xyXG4gICAgICBhd2FpdCDGki5NdXRhYmxlLm11dGF0ZSh0aGlzLm11dGFibGUsIMaSLk11dGFibGUuZ2V0TXV0YXRvcih0aGlzLm11dGFibGUpKTsgLy8gVE9ETzogcmVhcnJhbmdlbWVudCBpcyBub3QgYSBtdXRhdGlvbiBzbyBkaXNwYXRjaGluZyB0aGlzIG11dGF0ZSBpcyBpcnJpdGF0aW5nLi4uXHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCByZXNpemVBcnJheSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGNvbnN0IHRhcmdldDogRXZlbnRUYXJnZXQgPSBfZXZlbnQudGFyZ2V0O1xyXG4gICAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBEZXRhaWxzQXJyYXkpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IGxlbmd0aDogbnVtYmVyID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbC5sZW5ndGg7XHJcbiAgICAgIGNvbnN0IHBhdGg6IHN0cmluZ1tdID0gdGhpcy5nZXRNdXRhdG9yUGF0aChfZXZlbnQpO1xyXG4gICAgICBjb25zdCBjdXJyZW50OiB1bmtub3duW10gPSB0aGlzLmdldFRhcmdldChwYXRoKTtcclxuXHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5TQVZFX0hJU1RPUlksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGhpc3Rvcnk6IDQsIG11dGFibGU6IHRoaXMubXV0YWJsZSwgbXV0YXRvcjogPMaSLkF0b21pY011dGF0b3I+eyBwYXRoOiBwYXRoLCB2YWx1ZTogY3VycmVudC5jb25jYXQoKSB9IH0gfSkpO1xyXG5cclxuICAgICAgY29uc3QgaW5jb21pbmc6IHVua25vd25bXSA9IGN1cnJlbnQuY29uY2F0KCk7XHJcbiAgICAgIGluY29taW5nLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gY3VycmVudC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKylcclxuICAgICAgICBpbmNvbWluZ1tpXSA9IG51bGw7XHJcblxyXG4gICAgICBjdXJyZW50LnNwbGljZSgwLCBjdXJyZW50Lmxlbmd0aCwgLi4uaW5jb21pbmcpO1xyXG5cclxuICAgICAgYXdhaXQgxpIuTXV0YWJsZS5tdXRhdGUodGhpcy5tdXRhYmxlLCDGki5NdXRhYmxlLmdldE11dGF0b3IodGhpcy5tdXRhYmxlKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBzZXRWYWx1ZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHBhdGg6IHN0cmluZ1tdID0gdGhpcy5nZXRNdXRhdG9yUGF0aChfZXZlbnQpO1xyXG4gICAgICBjb25zdCBtdXRhYmxlOiBvYmplY3QgPSB0aGlzLmdldFRhcmdldChwYXRoLnRvU3BsaWNlZChwYXRoLmxlbmd0aCAtIDEpKTtcclxuICAgICAgY29uc3Qga2V5OiBzdHJpbmcgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICBjb25zdCBjdXJyZW50OiB1bmtub3duID0gUmVmbGVjdC5nZXQobXV0YWJsZSwga2V5KTtcclxuXHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5TQVZFX0hJU1RPUlksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGhpc3Rvcnk6IDMsIG11dGFibGU6IHRoaXMubXV0YWJsZSwgbXV0YXRvcjogPMaSLkF0b21pY011dGF0b3I+eyBwYXRoOiBwYXRoLCB2YWx1ZTogY3VycmVudCB9IH0gfSkpO1xyXG5cclxuICAgICAgY29uc3QgaW5jb21pbmc6IHVua25vd24gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsLnZhbHVlO1xyXG4gICAgICBSZWZsZWN0LnNldChtdXRhYmxlLCBrZXksIGluY29taW5nKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIGluaXRpYWxpemVWYWx1ZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHBhdGg6IHN0cmluZ1tdID0gdGhpcy5nZXRNdXRhdG9yUGF0aChfZXZlbnQpO1xyXG4gICAgICBjb25zdCBtdXRhYmxlOiBvYmplY3QgPSB0aGlzLmdldFRhcmdldChwYXRoLnRvU3BsaWNlZChwYXRoLmxlbmd0aCAtIDEpKTtcclxuICAgICAgY29uc3Qga2V5OiBzdHJpbmcgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XHJcblxyXG4gICAgICBsZXQgcGFyZW50OiBvYmplY3Q7XHJcbiAgICAgIGxldCBwYXJlbnRLZXk6IHN0cmluZztcclxuICAgICAgaWYgKCHGki5pc011dGFibGUobXV0YWJsZSkpIHsgLy8gbXVzdCBiZSBhIGNvbGxlY3Rpb24gdHlwZSwgYWRqdXN0IHRvIHBhcmVudCBtdXRhYmxlXHJcbiAgICAgICAgcGFyZW50ID0gdGhpcy5nZXRUYXJnZXQocGF0aC50b1NwbGljZWQocGF0aC5sZW5ndGggLSAyKSk7XHJcbiAgICAgICAgcGFyZW50S2V5ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDJdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBjdXJyZW50OiB1bmtub3duID0gUmVmbGVjdC5nZXQobXV0YWJsZSwga2V5KTtcclxuXHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5TQVZFX0hJU1RPUlksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGhpc3Rvcnk6IDMsIG11dGFibGU6IHRoaXMubXV0YWJsZSwgbXV0YXRvcjogPMaSLkF0b21pY011dGF0b3I+eyBwYXRoOiBwYXRoLCB2YWx1ZTogY3VycmVudCB9IH0gfSkpO1xyXG5cclxuICAgICAgY29uc3QgbXV0YXRvclR5cGVzOiDGki5NdXRhdG9yVHlwZXMgPSDGki5NdXRhYmxlLmdldFR5cGVzKHBhcmVudCA/PyBtdXRhYmxlLCDGki5NdXRhYmxlLmdldE11dGF0b3IocGFyZW50ID8/IG11dGFibGUpKTtcclxuICAgICAgY29uc3QgbXV0YXRvckNvbGxlY3Rpb25UeXBlczogxpIuTXV0YXRvckNvbGxlY3Rpb25UeXBlcyA9IMaSLk1ldGFkYXRhLmNvbGxlY3Rpb25UeXBlcyhtdXRhYmxlKTtcclxuICAgICAgY29uc3QgdHlwZTogRnVuY3Rpb24gfCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9bXV0YXRvckNvbGxlY3Rpb25UeXBlc1trZXldID8/IG11dGF0b3JUeXBlc1twYXJlbnRLZXkgPz8ga2V5XTtcclxuXHJcbiAgICAgIENvbnRyb2xsZXIuaW5pdGlhbGl6ZVZhbHVlKG11dGFibGUsIGtleSwgdHlwZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCBwcm92aWRlT3B0aW9ucyA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGNvbnN0IHRhcmdldDogRXZlbnRUYXJnZXQgPSBfZXZlbnQudGFyZ2V0O1xyXG4gICAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50Q29tYm9TZWxlY3QpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHBhdGg6IHN0cmluZ1tdID0gdGhpcy5nZXRNdXRhdG9yUGF0aChfZXZlbnQpO1xyXG4gICAgICBsZXQgbXV0YWJsZTogdW5rbm93biA9IHRoaXMuZ2V0VGFyZ2V0KHBhdGgudG9TcGxpY2VkKHBhdGgubGVuZ3RoIC0gMSkpO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XHJcbiAgICAgIGlmICghxpIuaXNNdXRhYmxlKG11dGFibGUpKSB7IC8vIG11c3QgYmUgYSBjb2xsZWN0aW9uIHR5cGUsIGFkanVzdCB0byBwYXJlbnQgbXV0YWJsZVxyXG4gICAgICAgIG11dGFibGUgPSB0aGlzLmdldFRhcmdldChwYXRoLnRvU3BsaWNlZChwYXRoLmxlbmd0aCAtIDIpKTtcclxuICAgICAgICBrZXkgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMl07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG11dGF0b3JPcHRpb25zOiDGki5NdXRhdG9yT3B0aW9ucyA9IMaSLk1ldGFkYXRhLm9wdGlvbnMobXV0YWJsZSk7XHJcblxyXG4gICAgICBjb25zdCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IG11dGF0b3JPcHRpb25zW2tleV0uY2FsbChtdXRhYmxlLCBrZXkpO1xyXG4gICAgICB0YXJnZXQub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICB9O1xyXG5cclxuICAgIHByb3RlY3RlZCByZWZyZXNoID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY29udGFpbnModGhpcy5kb21FbGVtZW50KSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVXNlckludGVyZmFjZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pZEludGVydmFsKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRNdXRhdG9yUGF0aChfZXZlbnQ6IEV2ZW50KTogc3RyaW5nW10ge1xyXG4gICAgICBjb25zdCBwYXRoOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICBmb3IgKGNvbnN0IHRhcmdldCBvZiBfZXZlbnQuY29tcG9zZWRQYXRoKCkpIHtcclxuICAgICAgICBpZiAodGFyZ2V0ID09IHRoaXMuZG9tRWxlbWVudClcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjb25zdCBrZXk6IHN0cmluZyA9ICg8SFRNTEVsZW1lbnQ+dGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgICAgaWYgKGtleSlcclxuICAgICAgICAgIHBhdGgucHVzaChrZXkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcGF0aC5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRUYXJnZXQ8VCA9IHVua25vd24+KF9wYXRoOiBzdHJpbmdbXSk6IFQge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBvYmplY3QgPSB0aGlzLm11dGFibGU7XHJcblxyXG4gICAgICBmb3IgKGxldCBrZXkgb2YgX3BhdGgpXHJcbiAgICAgICAgdGFyZ2V0ID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXkpO1xyXG5cclxuICAgICAgcmV0dXJuIDxUPnRhcmdldDtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0YXRpYyBjbGFzcyBnZW5lcmF0aW5nIFVJLWRvbUVsZW1lbnRzIGZyb20gdGhlIGluZm9ybWF0aW9uIGZvdW5kIGluIG11dGFibGVzIGFuZCBtdXRhdG9yc1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBHZW5lcmF0b3Ige1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgW1tDb250cm9sbGVyXV0gZnJvbSBhIFtbRnVkZ2VDb3JlLk11dGFibGVdXSB3aXRoIGV4cGFuZGFibGUgZGV0YWlscyBvciBhIGxpc3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVDb250cm9sbGVyKF9tdXRhYmxlOiBvYmplY3QsIF9uYW1lPzogc3RyaW5nKTogQ29udHJvbGxlciB7XHJcbiAgICAgIGxldCBjb250cm9sbGVyOiBDb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIoX211dGFibGUsIEdlbmVyYXRvci5jcmVhdGVEZXRhaWxzRnJvbU11dGFibGUoX211dGFibGUsIF9uYW1lKSk7XHJcbiAgICAgIGNvbnRyb2xsZXIudXBkYXRlVXNlckludGVyZmFjZSgpO1xyXG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBleHRlbmRhYmxlIGRldGFpbHMgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGFibGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShfbXV0YWJsZTogb2JqZWN0LCBfbmFtZT86IHN0cmluZywgX211dGF0b3I/OiDGki5NdXRhdG9yKTogRGV0YWlscyB7XHJcbiAgICAgIGlmICghxpIuaXNNdXRhYmxlKF9tdXRhYmxlKSlcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgIGxldCBuYW1lOiBzdHJpbmcgPSBfbmFtZSB8fCBfbXV0YWJsZS5jb25zdHJ1Y3Rvci5uYW1lO1xyXG4gICAgICBsZXQgZGV0YWlsczogRGV0YWlscyA9IG5ldyBEZXRhaWxzKG5hbWUsIF9tdXRhYmxlLnR5cGUpO1xyXG4gICAgICBkZXRhaWxzLnNldENvbnRlbnQoR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9tdXRhYmxlLCBfbXV0YXRvcikpO1xyXG4gICAgICByZXR1cm4gZGV0YWlscztcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVEZXRhaWxzRnJvbUFycmF5KF9tdXRhYmxlOiBvYmplY3QsIF9uYW1lOiBzdHJpbmcsIF9tdXRhdG9yOiDGki5NdXRhdG9yLCBfdHlwZTogRnVuY3Rpb24gfCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgX2dldE9wdGlvbnM6IMaSLk11dGF0b3JPcHRpb25zR2V0dGVyKTogRGV0YWlsc0FycmF5IHtcclxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KF9tdXRhYmxlKSlcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzQXJyYXkgPSBuZXcgRGV0YWlsc0FycmF5KF9uYW1lKTtcclxuICAgICAgZGV0YWlscy5zZXRDb250ZW50KEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tQXJyYXkoX211dGFibGUsIF9tdXRhdG9yLCBfdHlwZSwgX2dldE9wdGlvbnMpKTtcclxuICAgICAgcmV0dXJuIGRldGFpbHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBkaXYtRWxlbWVudHMgY29udGFpbmluZyB0aGUgaW50ZXJmYWNlIGZvciB0aGUgW1tGdWRnZUNvcmUuTXV0YXRvcl1dIG9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhYmxlXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVJbnRlcmZhY2VGcm9tTXV0YWJsZShfbXV0YWJsZTogb2JqZWN0LCBfbXV0YXRvcj86IMaSLk11dGF0b3IpOiBIVE1MRGl2RWxlbWVudCB7XHJcbiAgICAgIGNvbnN0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciA/PyDGki5NdXRhYmxlLmdldE11dGF0b3IoX211dGFibGUpXHJcbiAgICAgIGNvbnN0IHR5cGVzOiDGki5NdXRhdG9yVHlwZXMgPSDGki5NdXRhYmxlLmdldFR5cGVzKF9tdXRhYmxlLCBtdXRhdG9yKTtcclxuICAgICAgY29uc3Qgb3B0aW9uczogxpIuTXV0YXRvck9wdGlvbnMgPSDGki5NZXRhZGF0YS5vcHRpb25zKF9tdXRhYmxlKTtcclxuICAgICAgY29uc3QgZGl2OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBtdXRhdG9yKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRWxlbWVudChfbXV0YWJsZSwgbXV0YXRvciwga2V5LCB0eXBlc1trZXldLCBvcHRpb25zW2tleV0pO1xyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBkaXY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVJbnRlcmZhY2VGcm9tQXJyYXkoX211dGFibGU6IG9iamVjdCwgX211dGF0b3I6IMaSLk11dGF0b3IsIF90eXBlOiBGdW5jdGlvbiB8IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBfZ2V0T3B0aW9uczogxpIuTXV0YXRvck9wdGlvbnNHZXR0ZXIpOiBIVE1MRGl2RWxlbWVudCB7XHJcbiAgICAgIGNvbnN0IGRpdjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VFbGVtZW50KF9tdXRhYmxlLCBfbXV0YXRvciwga2V5LCBfdHlwZSwgX2dldE9wdGlvbnMpO1xyXG4gICAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUludGVyZmFjZUVsZW1lbnQoX211dGFibGU6IG9iamVjdCwgX211dGF0b3I6IMaSLk11dGF0b3IsIF9rZXk6IHN0cmluZywgX3R5cGU6IEZ1bmN0aW9uIHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIF9nZXRPcHRpb25zPzogxpIuTXV0YXRvck9wdGlvbnNHZXR0ZXIpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgIGNvbnN0IG11dGFudDogdW5rbm93biA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBfa2V5KTtcclxuICAgICAgY29uc3QgdmFsdWU6IHVua25vd24gPSBSZWZsZWN0LmdldChfbXV0YWJsZSwgX2tleSk7XHJcblxyXG4gICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShtdXRhbnQpKVxyXG4gICAgICAgIGVsZW1lbnQgPSBHZW5lcmF0b3IuY3JlYXRlRGV0YWlsc0Zyb21BcnJheSg8b2JqZWN0Pm11dGFudCwgX2tleSwgPMaSLk11dGF0b3I+dmFsdWUsIF90eXBlLCBfZ2V0T3B0aW9ucyk7XHJcblxyXG4gICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgZWxlbWVudCA9IEdlbmVyYXRvci5jcmVhdGVNdXRhdG9yRWxlbWVudChfa2V5LCBfdHlwZSwgdmFsdWUpO1xyXG5cclxuICAgICAgaWYgKCFlbGVtZW50ICYmIF9nZXRPcHRpb25zKVxyXG4gICAgICAgIGVsZW1lbnQgPSBuZXcgQ3VzdG9tRWxlbWVudENvbWJvU2VsZWN0KHsga2V5OiBfa2V5LCBsYWJlbDogX2tleSwgdHlwZTogKDxGdW5jdGlvbj5fdHlwZSkubmFtZSB9LCB2YWx1ZSwgX2dldE9wdGlvbnMuY2FsbChfbXV0YWJsZSwgX2tleSkpO1xyXG5cclxuICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgIGVsZW1lbnQgPSBHZW5lcmF0b3IuY3JlYXRlRGV0YWlsc0Zyb21NdXRhYmxlKDxvYmplY3Q+bXV0YW50LCBfa2V5LCA8xpIuTXV0YXRvcj52YWx1ZSk7XHJcblxyXG4gICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgZWxlbWVudCA9IG5ldyBDdXN0b21FbGVtZW50SW5pdGlhbGl6ZXIoeyBrZXk6IF9rZXksIGxhYmVsOiBfa2V5IH0pO1xyXG5cclxuICAgICAgaWYgKCFlbGVtZW50KSB7IC8vIHVuZGVmaW5lZCB2YWx1ZXMgd2l0aG91dCBhIHR5cGUgY2FuJ3QgYmUgZGlzcGxheWVkXHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiTm8gaW50ZXJmYWNlIGNyZWF0ZWQgZm9yXCIsIF9tdXRhYmxlLmNvbnN0cnVjdG9yLm5hbWUsIF9rZXkpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGRpdi1FbGVtZW50IGNvbnRhaW5pbmcgdGhlIGludGVyZmFjZSBmb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSBcclxuICAgICAqIERvZXMgbm90IHN1cHBvcnQgbmVzdGVkIG11dGF0b3JzIVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogSFRNTERpdkVsZW1lbnQge1xyXG4gICAgICBsZXQgZGl2OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgIGxldCB2YWx1ZTogdW5rbm93biA9IF9tdXRhdG9yW2tleV07XHJcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICBsZXQgZGV0YWlsczogRGV0YWlscyA9IG5ldyBEZXRhaWxzKGtleSwgXCJEZXRhaWxzXCIpO1xyXG4gICAgICAgICAgZGV0YWlscy5zZXRDb250ZW50KEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YXRvcih2YWx1ZSkpO1xyXG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGRldGFpbHMpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCB2YWx1ZS5jb25zdHJ1Y3RvciwgdmFsdWUpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIHNwZWNpZmljIEN1c3RvbUVsZW1lbnQgZm9yIHRoZSBnaXZlbiBkYXRhLiBSZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBlbGVtZW50IGlzIHtAbGluayBDdXN0b21FbGVtZW50LnJlZ2lzdGVyIHJlZ2lzdGVyZWR9IGZvciB0aGUgZ2l2ZW4gdHlwZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVNdXRhdG9yRWxlbWVudChfa2V5OiBzdHJpbmcsIF90eXBlOiBGdW5jdGlvbiB8IG9iamVjdCwgX3ZhbHVlOiB1bmtub3duKTogQ3VzdG9tRWxlbWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBDdXN0b21FbGVtZW50O1xyXG4gICAgICBsZXQgZWxlbWVudFR5cGU6IG5ldyAoLi4uX2FyZ3M6IENvbnN0cnVjdG9yUGFyYW1ldGVyczx0eXBlb2YgQ3VzdG9tRWxlbWVudD4pID0+IEN1c3RvbUVsZW1lbnQ7XHJcblxyXG4gICAgICBpZiAoX3ZhbHVlID09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgX3R5cGUgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICBlbGVtZW50VHlwZSA9IEN1c3RvbUVsZW1lbnQuZ2V0KF90eXBlKTtcclxuICAgICAgICAgIGlmIChlbGVtZW50VHlwZSlcclxuICAgICAgICAgICAgZWxlbWVudCA9IG5ldyBlbGVtZW50VHlwZSh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHZhbHVlOiBfdmFsdWU/LnRvU3RyaW5nKCkgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgX3R5cGUgPT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgZWxlbWVudFR5cGUgPSBDdXN0b21FbGVtZW50LmdldChPYmplY3QpO1xyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBlbGVtZW50VHlwZSh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHZhbHVlOiBfdmFsdWU/LnRvU3RyaW5nKCkgfSwgX3R5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcuZnVkZ2UoX2Vycm9yKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBTdHJ1Y3R1cmUgZm9yIHRoZSBhdHRyaWJ1dGVzIHRvIHNldCBpbiBhIEN1c3RvbUVsZW1lbnQuXHJcbiAgICoga2V5IChtYXliZSByZW5hbWUgdG8gYG5hbWVgKSBpcyBtYW5kYXRvcnkgYW5kIG11c3QgbWF0Y2ggdGhlIGtleSBvZiBhIG11dGF0b3IgaWYgdXNlZCBpbiBjb25qdW5jdGlvblxyXG4gICAqIGxhYmVsIGlzIHJlY29tbWVuZGVkIGZvciBsYWJlbGxlZCBlbGVtZW50cywga2V5IGlzIHVzZWQgaWYgbm90IGdpdmVuLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMge1xyXG4gICAgW25hbWU6IHN0cmluZ106IHN0cmluZztcclxuICAgIGtleTogc3RyaW5nO1xyXG4gICAgbGFiZWw/OiBzdHJpbmc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVzIHRoZSBtYXBwaW5nIG9mIEN1c3RvbUVsZW1lbnRzIHRvIHRoZWlyIEhUTUwtVGFncyB2aWEgY3VzdG9tRWxlbWVudC5kZWZpbmVcclxuICAgKiBhbmQgdG8gdGhlIGRhdGEgdHlwZXMgYW5kIFtbRnVkZ2VDb3JlLk11dGFibGVdXXMgdGhleSByZW5kZXIgYW4gaW50ZXJmYWNlIGZvci4gXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEN1c3RvbUVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHRhZzogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWFwVHlwZVRvQ3VzdG9tRWxlbWVudDogTWFwPEZ1bmN0aW9uLCB0eXBlb2YgQ3VzdG9tRWxlbWVudD4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaWRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMsIC4uLl9hcmdzOiB1bmtub3duW10pIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgaWYgKF9hdHRyaWJ1dGVzKVxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gX2F0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgIGlmIChfYXR0cmlidXRlc1tuYW1lXSAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIF9hdHRyaWJ1dGVzW25hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSBhbiBpZCB0byB1c2UgZm9yIGNoaWxkcmVuIG9mIHRoaXMgZWxlbWVudCwgbmVlZGVkIGUuZy4gZm9yIHN0YW5kYXJkIGludGVyYWN0aW9uIHdpdGggdGhlIGxhYmVsXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgZ2V0IG5leHRJZCgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCLGklwiICsgQ3VzdG9tRWxlbWVudC5pZENvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIG1hcCB0aGUgZ2l2ZW4gZWxlbWVudCB0eXBlIHRvIHRoZSBnaXZlbiB0YWcgYW5kIHRoZSBnaXZlbiB0eXBlIG9mIGRhdGFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlcihfdGFnOiBzdHJpbmcsIF90eXBlQ3VzdG9tRWxlbWVudDogdHlwZW9mIEN1c3RvbUVsZW1lbnQsIF90eXBlT2JqZWN0PzogdHlwZW9mIE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfdGFnLCBfY2xhc3MpO1xyXG4gICAgICBfdHlwZUN1c3RvbUVsZW1lbnQudGFnID0gX3RhZztcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoX3RhZywgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuXHJcbiAgICAgIGlmIChfdHlwZU9iamVjdClcclxuICAgICAgICBDdXN0b21FbGVtZW50Lm1hcChfdHlwZU9iamVjdCwgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIHRoZSBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgZ2l2ZW4gZGF0YSB0eXBlIChpZiByZWdpc3RlcmVkKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldChfdHlwZTogRnVuY3Rpb24pOiB0eXBlb2YgQ3VzdG9tRWxlbWVudCAmIChuZXcgKC4uLl9hcmdzOiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8dHlwZW9mIEN1c3RvbUVsZW1lbnQ+KSA9PiBDdXN0b21FbGVtZW50KSB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBzdHJpbmcgfCB0eXBlb2YgQ3VzdG9tRWxlbWVudCB8IEN1c3RvbUVsZW1lbnRDb25zdHJ1Y3RvciA9IEN1c3RvbUVsZW1lbnQubWFwVHlwZVRvQ3VzdG9tRWxlbWVudC5nZXQoX3R5cGUpO1xyXG4gICAgICByZXR1cm4gPHR5cGVvZiBDdXN0b21FbGVtZW50ICYgKG5ldyAoLi4uX2FyZ3M6IENvbnN0cnVjdG9yUGFyYW1ldGVyczx0eXBlb2YgQ3VzdG9tRWxlbWVudD4pID0+IEN1c3RvbUVsZW1lbnQpPmVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWFwKF90eXBlOiBGdW5jdGlvbiwgX3R5cGVDdXN0b21FbGVtZW50OiB0eXBlb2YgQ3VzdG9tRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShcIk1hcFwiLCBfdHlwZSwgX3R5cGVDdXN0b21FbGVtZW50Lm5hbWUpO1xyXG4gICAgICBDdXN0b21FbGVtZW50Lm1hcFR5cGVUb0N1c3RvbUVsZW1lbnQuc2V0KF90eXBlLCBfdHlwZUN1c3RvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBrZXkgKG5hbWUpIG9mIHRoZSBhdHRyaWJ1dGUgdGhpcyBlbGVtZW50IHJlcHJlc2VudHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBrZXkoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNJbml0aWFsaXplZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBsYWJlbC1lbGVtZW50IGFzIGNoaWxkIHRvIHRoaXMgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwZW5kTGFiZWwoKTogSFRNTExhYmVsRWxlbWVudCB7XHJcbiAgICAgIGxldCB0ZXh0OiBzdHJpbmcgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgICBpZiAoIXRleHQpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGxhYmVsKTtcclxuICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRMYWJlbChfbGFiZWw6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgaWYgKGxhYmVsKVxyXG4gICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gX2xhYmVsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgdmFsdWUgb2YgdGhpcyBlbGVtZW50IHVzaW5nIGEgZm9ybWF0IGNvbXBhdGlibGUgd2l0aCBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICBSZWZsZWN0LnNldCh0aGlzLCBcInZhbHVlXCIsIF92YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFdvcmthcm91bmQgcmVjb25uZWN0aW9uIG9mIGNsb25lICovXHJcbiAgICBwdWJsaWMgY2xvbmVOb2RlKF9kZWVwOiBib29sZWFuKTogTm9kZSB7XHJcbiAgICAgIGxldCBsYWJlbDogc3RyaW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIGxldCBjbG9uZTogQ3VzdG9tRWxlbWVudCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGxhYmVsID8geyBsYWJlbDogbGFiZWwgfSA6IG51bGwpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNsb25lKTtcclxuICAgICAgY2xvbmUuc2V0TXV0YXRvclZhbHVlKHRoaXMuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGUgb2YgdGhpcy5hdHRyaWJ1dGVzKVxyXG4gICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUubmFtZSwgYXR0cmlidXRlLnZhbHVlKTtcclxuICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgaW4gYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TXV0YXRvclZhbHVlKCk6IE9iamVjdDtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIGNoZWNrYm94IHdpdGggYSBsYWJlbCB0byBpdFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50Qm9vbGVhbiBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1ib29sZWFuXCIsIEN1c3RvbUVsZW1lbnRCb29sZWFuLCBCb29sZWFuKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIFRPRE86IGRlbGV0ZSB0YWJpbmRleCBmcm9tIGNoZWNrYm94IGFuZCBnZXQgc3BhY2Uta2V5IG9uIHRoaXNcclxuICAgICAgLy8gdGhpcy50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCI7XHJcbiAgICAgIGlucHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIGlucHV0LmNoZWNrZWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpID09IFwidHJ1ZVwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKS5odG1sRm9yID0gaW5wdXQuaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3ggYXMgYm9vbGVhbiB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikuY2hlY2tlZDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS5jaGVja2VkID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBBIGNvbG9yIHBpY2tlciB3aXRoIGEgbGFiZWwgdG8gaXQgYW5kIGEgc2xpZGVyIGZvciBvcGFjaXR5XHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRDb2xvciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1jb2xvclwiLCBDdXN0b21FbGVtZW50Q29sb3IsIMaSLkNvbG9yKTtcclxuICAgIHB1YmxpYyBjb2xvcjogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IHBpY2tlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgcGlja2VyLnR5cGUgPSBcImNvbG9yXCI7XHJcblxyXG4gICAgICBwaWNrZXIudGFiSW5kZXggPSAwO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHBpY2tlcik7XHJcblxyXG4gICAgICBsZXQgc2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBzbGlkZXIudHlwZSA9IFwicmFuZ2VcIjtcclxuICAgICAgc2xpZGVyLm1pbiA9IFwiMFwiO1xyXG4gICAgICBzbGlkZXIubWF4ID0gXCIxXCI7XHJcbiAgICAgIHNsaWRlci5zdGVwID0gXCIwLjAxXCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcclxuICAgICAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuV0hFRUwsIHRoaXMuaG5kV2hlZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSB2YWx1ZXMgb2YgcGlja2VyIGFuZCBzbGlkZXIgYXMgxpIuTXV0YXRvclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgaGV4OiBzdHJpbmcgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1jb2xvclwiKSkudmFsdWU7XHJcbiAgICAgIGxldCBhbHBoYTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9cmFuZ2VcIikpLnZhbHVlO1xyXG4gICAgICB0aGlzLmNvbG9yLnNldEhleChoZXguc3Vic3RyKDEsIDYpICsgXCJmZlwiKTtcclxuICAgICAgdGhpcy5jb2xvci5hID0gcGFyc2VGbG9hdChhbHBoYSk7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yLmdldE11dGF0b3IodHJ1ZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHZhbHVlcyBvZiBjb2xvciBwaWNrZXIgYW5kIHNsaWRlclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbG9yLm11dGF0ZShfdmFsdWUpO1xyXG4gICAgICBsZXQgaGV4OiBzdHJpbmcgPSB0aGlzLmNvbG9yLnRvSGV4KCk7XHJcbiAgICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPWNvbG9yXCIpKS52YWx1ZSA9IFwiI1wiICsgaGV4LnNsaWNlKDAsIDYpO1xyXG4gICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1yYW5nZVwiKSkudmFsdWUgPSB0aGlzLmNvbG9yLmEudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleShfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBobmRXaGVlbChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IHNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KTtcclxuICAgICAgaWYgKHNsaWRlciAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coX2V2ZW50LmRlbHRhWSAvIDEwMDApO1xyXG4gICAgICBsZXQgY3VycmVudFZhbHVlOiBudW1iZXIgPSBOdW1iZXIoc2xpZGVyLnZhbHVlKTtcclxuICAgICAgc2xpZGVyLnZhbHVlID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSAtIF9ldmVudC5kZWx0YVkgLyAxMDAwKTtcclxuICAgICAgc2xpZGVyLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudENvbWJvU2VsZWN0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLWNvbWJvc2VsZWN0XCIsIEN1c3RvbUVsZW1lbnRDb21ib1NlbGVjdCk7XHJcblxyXG4gICAgcHVibGljIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xyXG4gICAgcHVibGljIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHVibGljIGRhdGFsaXN0OiBIVE1MRGF0YUxpc3RFbGVtZW50O1xyXG4gICAgcHVibGljIGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBwdWJsaWMgdmFsdWU6IHVua25vd247XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcywgX3ZhbHVlPzogdW5rbm93biwgX29wdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIHRoaXMub3B0aW9ucyA9IF9vcHRpb25zO1xyXG4gICAgICB0aGlzLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICB0aGlzLmRhdGFsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRhdGFsaXN0XCIpO1xyXG4gICAgICB0aGlzLmRhdGFsaXN0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQudG9TdHJpbmcoKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmRhdGFsaXN0KTtcclxuXHJcbiAgICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKFwibGlzdFwiLCB0aGlzLmRhdGFsaXN0LmlkKTtcclxuICAgICAgdGhpcy5pbnB1dC5wbGFjZWhvbGRlciA9IGAke3RoaXMuZ2V0QXR0cmlidXRlKFwidHlwZVwiKX0uLi5gO1xyXG4gICAgICB0aGlzLmlucHV0LnNwZWxsY2hlY2sgPSBmYWxzZTtcclxuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTLCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOUFVULCB0aGlzLmhuZElucHV0KTtcclxuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9VUCwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuaW5wdXQpO1xyXG5cclxuICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNMSUNLLCB0aGlzLmhuZENsaWNrKTtcclxuICAgICAgdGhpcy5idXR0b24uaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbik7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgICBpZiAodGhpcy52YWx1ZSlcclxuICAgICAgICB0aGlzLnNldE11dGF0b3JWYWx1ZSh0aGlzLnZhbHVlKVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogdW5rbm93biB7XHJcbiAgICAgIGNvbnN0IG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0gdGhpcy5nZXRPcHRpb25zKCk7XHJcbiAgICAgIHJldHVybiBvcHRpb25zW3RoaXMuaW5wdXQudmFsdWVdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiB7IG5hbWU/OiBzdHJpbmcgfSk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbnB1dCA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgPSBfdmFsdWUgPyBfdmFsdWUubmFtZSA/PyBfdmFsdWUudG9TdHJpbmcoKSA6IFwiXCI7XHJcbiAgICAgIGNvbnN0IGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIik7XHJcbiAgICAgIGJ1dHRvbi5oaWRkZW4gPSAhdmFsdWU7XHJcbiAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZENsaWNrID0gKF9ldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmlucHV0LnZhbHVlID0gXCJcIjtcclxuICAgICAgdGhpcy5idXR0b24uaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5DSEFOR0UsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBGb2N1c0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuZGF0YWxpc3QuaW5uZXJIVE1MID0gXCJcIjsgLy8gY2xlYXIgcHJldmlvdXMgZW50cmllc1xyXG4gICAgICBjb25zdCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHRoaXMuZ2V0T3B0aW9ucygpO1xyXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICBlbnRyeS52YWx1ZSA9IGtleTtcclxuICAgICAgICB0aGlzLmRhdGFsaXN0LmFwcGVuZENoaWxkKGVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZElucHV0ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5idXR0b24uaGlkZGVuID0gIShfZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5KF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ2hhbmdlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc3Qgb3B0aW9uczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB0aGlzLmdldE9wdGlvbnMoKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmlucHV0LnZhbHVlICE9IFwiXCIgJiYgIVJlZmxlY3QuaGFzKG9wdGlvbnMsIHRoaXMuaW5wdXQudmFsdWUpKSB7XHJcbiAgICAgICAgdGhpcy5zZXRNdXRhdG9yVmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnZhbHVlID0gb3B0aW9uc1t0aGlzLmlucHV0LnZhbHVlXTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5TRVRfVkFMVUUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IHZhbHVlOiB0aGlzLnZhbHVlIH0gfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGdldE9wdGlvbnMoKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlJFUVVFU1RfT1BUSU9OUywgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucztcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBSZXByZXNlbnRzIGEgc2luZ2xlIGRpZ2l0IG51bWJlciB0byBiZSB1c2VkIGluIGdyb3VwcyB0byByZXByZXNlbnQgYSBtdWx0aWRpZ2l0IHZhbHVlLlxyXG4gICAqIElzIHRhYmJhYmxlIGFuZCBpbi0vZGVjcmVhc2VzIHByZXZpb3VzIHNpYmxpbmcgd2hlbiBmbG93aW5nIG92ZXIvdW5kZXIuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnREaWdpdCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2UtZGlnaXRcIiwgQ3VzdG9tRWxlbWVudERpZ2l0KTtcclxuICAgIHByb3RlY3RlZCBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKF92YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgIF92YWx1ZSA9IE1hdGgudHJ1bmMoX3ZhbHVlKTtcclxuICAgICAgaWYgKF92YWx1ZSA+IDkgfHwgX3ZhbHVlIDwgMClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMudGV4dENvbnRlbnQgPSBfdmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLnRleHRDb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLnZhbHVlID0gMDtcclxuICAgICAgdGhpcy50YWJJbmRleCA9IC0xO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgYWRkKF9hZGRlbmQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBfYWRkZW5kID0gTWF0aC50cnVuYyhfYWRkZW5kKTtcclxuICAgICAgaWYgKF9hZGRlbmQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX2FkZGVuZCA+IDApIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSA8IDkpXHJcbiAgICAgICAgICB0aGlzLnZhbHVlKys7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBsZXQgcHJldjogQ3VzdG9tRWxlbWVudERpZ2l0ID0gPEN1c3RvbUVsZW1lbnREaWdpdD50aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoIShwcmV2ICYmIHByZXYgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50RGlnaXQpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICBwcmV2LmFkZCgxKTtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSA+IDApXHJcbiAgICAgICAgICB0aGlzLnZhbHVlLS07XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBsZXQgcHJldjogQ3VzdG9tRWxlbWVudERpZ2l0ID0gPEN1c3RvbUVsZW1lbnREaWdpdD50aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBpZiAoIShwcmV2ICYmIHByZXYgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50RGlnaXQpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICBwcmV2LmFkZCgtMSk7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gOTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQSBzdGFuZGFyZCBjaGVja2JveCB3aXRoIGEgbGFiZWwgdG8gaXRcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudEluaXRpYWxpemVyIGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLWluaXRpYWxpemVyXCIsIEN1c3RvbUVsZW1lbnRJbml0aWFsaXplcik7XHJcblxyXG4gICAgcHVibGljIGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBwdWJsaWMgb3V0cHV0OiBIVE1MT3V0cHV0RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIHRoaXMub3V0cHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm91dHB1dFwiKTtcclxuICAgICAgdGhpcy5vdXRwdXQudmFsdWUgPSBcIjxudWxsPlwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMub3V0cHV0KTtcclxuXHJcbiAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgdGhpcy5idXR0b24uaW5uZXJUZXh0ID0gXCIrXCI7XHJcbiAgICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0xJQ0ssIHRoaXMuaG5kQ2xpY2spO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveCBhcyBib29sZWFuIHZhbHVlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogbnVsbCk6IHZvaWQge1xyXG4gICAgICAvL1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kQ2xpY2sgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5JVElBTElaRV9WQUxVRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiQ3VzdG9tRWxlbWVudC50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBDdXN0b21FbGVtZW50IGZyb20gYW4gSFRNTC1UZW1wbGF0ZS1UYWdcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQ3VzdG9tRWxlbWVudFRlbXBsYXRlIGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBmcmFnbWVudDogTWFwPHN0cmluZywgRG9jdW1lbnRGcmFnbWVudD4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnJvd3NlcyB0aHJvdWdoIHRoZSB0ZW1wbGF0ZXMgaW4gdGhlIGN1cnJlbnQgZG9jdW1lbnQgYW5kIHJlZ2lzdGVycyB0aGUgb25lIGRlZmluaW5nIHRoZSBnaXZlbiB0YWduYW1lLlxyXG4gICAgICogVG8gYmUgY2FsbGVkIGZyb20gYSBzY3JpcHQgdGFnIGltcGxlbWVudGVkIHdpdGggdGhlIHRlbXBsYXRlIGluIEhUTUwuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXIoX3RhZ05hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCB0ZW1wbGF0ZSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwidGVtcGxhdGVcIikpIHtcclxuICAgICAgICBpZiAodGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZC5sb2NhbE5hbWUgPT0gX3RhZ05hbWUpIHtcclxuICAgICAgICAgIMaSLkRlYnVnLmZ1ZGdlKFwiUmVnaXN0ZXJcIiwgdGVtcGxhdGUuY29udGVudC5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgICBDdXN0b21FbGVtZW50VGVtcGxhdGUuZnJhZ21lbnQuc2V0KF90YWdOYW1lLCB0ZW1wbGF0ZS5jb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgdmFsdWUgb2YgdGhpcyBlbGVtZW50IGluIGEgZm9ybWF0IGNvbXBhdGlibGUgd2l0aCBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB7fTtcclxuICAgICAgbGV0IGVsZW1lbnRzOiBOb2RlTGlzdE9mPEhUTUxJbnB1dEVsZW1lbnQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiW2tleVwiKTtcclxuICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiBlbGVtZW50cykge1xyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbXV0YXRvcltrZXldID0gZWxlbWVudC52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgIGxldCBlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKGBba2V5PVwiJHtrZXl9XCJdYCk7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgxpIuRGVidWcubG9nKGBDb3VsZG4ndCBmaW5kICR7a2V5fSBpbmAsIHRoaXMpO1xyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIGVsZW1lbnQuc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yW2tleV0pO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGVsZW1lbnQudmFsdWUgPSBfbXV0YXRvcltrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBXaGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZSwgdGhlIGVsZW1lbnQgZ2V0cyBjb25zdHJ1Y3RlZCBhcyBhIGRlZXAgY2xvbmUgb2YgdGhlIHRlbXBsYXRlLlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICBsZXQgZnJhZ21lbnQ6IERvY3VtZW50RnJhZ21lbnQgPSBDdXN0b21FbGVtZW50VGVtcGxhdGUuZnJhZ21lbnQuZ2V0KFJlZmxlY3QuZ2V0KHRoaXMuY29uc3RydWN0b3IsIFwidGFnXCIpKTtcclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmZyYWdtZW50LmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuICAgICAgbGV0IHN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gdGhpcy5zdHlsZTtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgY29udGVudC5zdHlsZSkge1xyXG4gICAgICAgIHN0eWxlLnNldFByb3BlcnR5KGVudHJ5LCBSZWZsZWN0LmdldChjb250ZW50LnN0eWxlLCBlbnRyeSkpO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNvbnRlbnQuY2hpbGROb2Rlcykge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoY2hpbGQuY2xvbmVOb2RlKHRydWUpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGlmIChsYWJlbClcclxuICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiQ3VzdG9tRWxlbWVudFRlbXBsYXRlLnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50TWF0cml4M3gzIGV4dGVuZHMgQ3VzdG9tRWxlbWVudFRlbXBsYXRlIHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB7IHRyYW5zbGF0aW9uOiB7fSwgc2NhbGluZzoge30sIHJvdGF0aW9uOiAwIH07XHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgdmVjdG9yIG9mIFtcInRyYW5zbGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIl0pXHJcbiAgICAgICAgICAoPMaSLk11dGF0b3I+bXV0YXRvclt2ZWN0b3JdKVtkaW1lbnNpb25dID0gc3RlcHBlcnNbY291bnQrK10uZ2V0TXV0YXRvclZhbHVlKCk7XHJcblxyXG4gICAgICBtdXRhdG9yW1wicm90YXRpb25cIl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiXSlcclxuICAgICAgICAgIHN0ZXBwZXJzW2NvdW50KytdLnNldE11dGF0b3JWYWx1ZShOdW1iZXIoKDzGki5NdXRhdG9yPl9tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0pKTtcclxuICAgICAgc3RlcHBlcnNbY291bnQrK10uc2V0TXV0YXRvclZhbHVlKE51bWJlcihfbXV0YXRvcltcInJvdGF0aW9uXCJdKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBzdXBlci5jb25uZWN0ZWRDYWxsYmFjaygpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhcIk1hdHJpeCBDYWxsYmFja1wiKTtcclxuICAgICAgbGV0IGxhYmVsOiBIVE1MTGFiZWxFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwibGFiZWxcIik7XHJcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21FbGVtZW50VGVtcGxhdGUudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRNYXRyaXg0eDQgZXh0ZW5kcyBDdXN0b21FbGVtZW50VGVtcGxhdGUge1xyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogT2JqZWN0IHtcclxuICAgICAgbGV0IHN0ZXBwZXJzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnRTdGVwcGVyPiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLXN0ZXBwZXJcIik7XHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0geyB0cmFuc2xhdGlvbjoge30sIHJvdGF0aW9uOiB7fSwgc2NhbGluZzoge30gfTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJyb3RhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCIsIFwielwiXSlcclxuICAgICAgICAgICg8xpIuTXV0YXRvcj5tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfbXV0YXRvcjogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJyb3RhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCIsIFwielwiXSlcclxuICAgICAgICAgIHN0ZXBwZXJzW2NvdW50KytdLnNldE11dGF0b3JWYWx1ZShOdW1iZXIoKDzGki5NdXRhdG9yPl9tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiTWF0cml4IENhbGxiYWNrXCIpO1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvKipcclxuICAgKiBBbiBpbnRlcmFjdGl2ZSBudW1iZXIgc3RlcHBlciB3aXRoIGV4cG9uZW50aWFsIGRpc3BsYXkgYW5kIGNvbXBsZXggaGFuZGxpbmcgdXNpbmcga2V5Ym9hcmQgYW5kIG1vdXNlXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnROdW1iZXIgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2UtbnVtYmVyXCIsIEN1c3RvbUVsZW1lbnROdW1iZXIpO1xyXG4gICAgcHVibGljIHZhbHVlOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBkcmFnZ2luZzogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgc3RhcnRWYWx1ZTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3RhcnREZWNpbWFsczogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgZGVsdGE6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHBpeGVsczogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgc3BlZWQ6IG51bWJlciA9IDAuMDE7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoX2F0dHJpYnV0ZXMgJiYgX2F0dHJpYnV0ZXNbXCJ2YWx1ZVwiXSlcclxuICAgICAgICB0aGlzLnZhbHVlID0gcGFyc2VGbG9hdChfYXR0cmlidXRlc1tcInZhbHVlXCJdKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1pbigpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbnB1dC5taW4gPT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlRmxvYXQodGhpcy5pbnB1dC5taW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbWF4KCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlucHV0Lm1heCA9PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VGbG9hdCh0aGlzLmlucHV0Lm1heCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzdGVwKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlucHV0LnN0ZXAgPT0gXCJcIiA/IHVuZGVmaW5lZCA6IHBhcnNlRmxvYXQodGhpcy5pbnB1dC5zdGVwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgdGhpcy5pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGhpcy5pbnB1dC50eXBlID0gXCJ0ZXh0XCI7IC8vIHVzZSB0ZXh0IHRvIGVuZm9yY2UgZGVjaW1hbCBwb2ludCBub3RhdGlvblxyXG4gICAgICB0aGlzLmlucHV0Lm1pbiA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibWluXCIpID8/IFwiXCI7XHJcbiAgICAgIHRoaXMuaW5wdXQubWF4ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJtYXhcIikgPz8gXCJcIjtcclxuICAgICAgdGhpcy5pbnB1dC5zdGVwID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJzdGVwXCIpID8/IFwiXCI7XHJcbiAgICAgIHRoaXMuaW5wdXQuaW5wdXRNb2RlID0gXCJkZWNpbWFsXCI7XHJcblxyXG4gICAgICB0aGlzLmlucHV0Lm9uY2hhbmdlID0gdGhpcy5obmRDaGFuZ2U7XHJcbiAgICAgIHRoaXMuaW5wdXQub25pbnB1dCA9IHRoaXMuaG5kSW5wdXQ7XHJcbiAgICAgIHRoaXMuaW5wdXQub25rZXlkb3duID0gdGhpcy5obmRLZXk7XHJcbiAgICAgIHRoaXMuaW5wdXQub25rZXl1cCA9IHRoaXMuaG5kS2V5O1xyXG4gICAgICB0aGlzLmlucHV0Lm9uZm9jdXMgPSB0aGlzLmhuZEZvY3VzO1xyXG4gICAgICB0aGlzLmlucHV0Lm9ucG9pbnRlcmRvd24gPSB0aGlzLmhuZFBvaW50ZXJkb3duSW5wdXQ7XHJcbiAgICAgIHRoaXMuaW5wdXQub25wb2ludGVydXAgPSB0aGlzLmhuZFBvaW50ZXJ1cElucHV0O1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmlucHV0KTtcclxuXHJcbiAgICAgIHRoaXMuc2V0TXV0YXRvclZhbHVlKHBhcnNlRmxvYXQodGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkaXNjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgdGhpcy5obmRQb2ludGVydXBXaW5kb3coKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgaWYgKF92YWx1ZSA9PSB1bmRlZmluZWQgfHwgaXNOYU4oX3ZhbHVlKSkge1xyXG4gICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBtaW46IG51bWJlciA9IHRoaXMubWluO1xyXG4gICAgICBpZiAobWluICE9IG51bGwpXHJcbiAgICAgICAgX3ZhbHVlID0gTWF0aC5tYXgoX3ZhbHVlLCBtaW4pO1xyXG5cclxuICAgICAgY29uc3QgbWF4OiBudW1iZXIgPSB0aGlzLm1heDtcclxuICAgICAgaWYgKG1heCAhPSBudWxsKVxyXG4gICAgICAgIF92YWx1ZSA9IE1hdGgubWluKF92YWx1ZSwgbWF4KTtcclxuXHJcbiAgICAgIGNvbnN0IHN0ZXA6IG51bWJlciA9IHRoaXMuc3RlcDtcclxuICAgICAgaWYgKHN0ZXAgIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGRlY2ltYWxzOiBudW1iZXIgPSB0aGlzLmRlY2ltYWxzKHN0ZXApO1xyXG4gICAgICAgIF92YWx1ZSA9IEZ1ZGdlQ29yZS5DYWxjLnNuYXAoX3ZhbHVlLCBzdGVwKTtcclxuICAgICAgICBfdmFsdWUgPSBwYXJzZUZsb2F0KF92YWx1ZS50b0ZpeGVkKGRlY2ltYWxzKSk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IF92YWx1ZS50b0ZpeGVkKGRlY2ltYWxzKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmRyYWdnaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IF92YWx1ZS50b0ZpeGVkKE1hdGgubWF4KHRoaXMuc3RhcnREZWNpbWFscywgdGhpcy5kZWNpbWFscyh0aGlzLnNwZWVkKSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSBfdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy52YWx1ZSA9IF92YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJkb3duSW5wdXQgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT0gdGhpcy5pbnB1dClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMuaG5kUG9pbnRlcm1vdmVXaW5kb3cpO1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCB0aGlzLmhuZFBvaW50ZXJ1cFdpbmRvdyk7XHJcblxyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVybW92ZVdpbmRvdyA9IChfZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5zcGVlZCA9IHRoaXMuc3RlcCA/PyAwLjAxO1xyXG4gICAgICBpZiAoX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5zcGVlZCAqPSAwLjE7XHJcbiAgICAgIGVsc2UgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICB0aGlzLnNwZWVkICo9IDEwO1xyXG5cclxuICAgICAgdGhpcy5waXhlbHMgKz0gX2V2ZW50Lm1vdmVtZW50WDtcclxuXHJcbiAgICAgIGNvbnN0IG1vdmU6IG51bWJlciA9IE1hdGgudHJ1bmModGhpcy5waXhlbHMgLyAyKTtcclxuXHJcbiAgICAgIGlmIChtb3ZlICE9IDApIHtcclxuICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5kZWx0YSA9IDA7XHJcbiAgICAgICAgICB0aGlzLnN0YXJ0VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5zdGFydERlY2ltYWxzID0gdGhpcy5kZWNpbWFscyh0aGlzLmlucHV0LnZhbHVlKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmlucHV0LnJlcXVlc3RQb2ludGVyTG9jaygpO1xyXG4gICAgICAgICAgdGhpcy5pbnB1dC5jbGFzc0xpc3QuYWRkKFwiaGlkZS1jYXJyZXRcIik7XHJcbiAgICAgICAgICB0aGlzLmlucHV0LmZvY3VzKCk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnBpeGVscyAtPSBtb3ZlICogMjtcclxuICAgICAgICB0aGlzLmRlbHRhICs9IG1vdmUgKiB0aGlzLnNwZWVkO1xyXG5cclxuICAgICAgICBsZXQgdmFsdWU6IG51bWJlciA9IHRoaXMuc3RhcnRWYWx1ZSArIHRoaXMuZGVsdGE7XHJcbiAgICAgICAgdGhpcy5zZXRNdXRhdG9yVmFsdWUodmFsdWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVydXBXaW5kb3cgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuYmx1cigpO1xyXG4gICAgICAgIHRoaXMuaW5wdXQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGUtY2FycmV0XCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGFydFZhbHVlICE9IHRoaXMudmFsdWUpXHJcbiAgICAgICAgICB0aGlzLmlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiY2hhbmdlXCIsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkb2N1bWVudC5wb2ludGVyTG9ja0VsZW1lbnQgPT0gdGhpcy5pbnB1dClcclxuICAgICAgICBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcclxuXHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5obmRQb2ludGVybW92ZVdpbmRvdyk7XHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMuaG5kUG9pbnRlcnVwV2luZG93KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVydXBJbnB1dCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKVxyXG4gICAgICAgIHRoaXMuaW5wdXQuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmRyYWdnaW5nKVxyXG4gICAgICAgIHRoaXMuaW5wdXQuc2VsZWN0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ2hhbmdlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5zZXRNdXRhdG9yVmFsdWUocGFyc2VGbG9hdCh0aGlzLmlucHV0LnZhbHVlKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kSW5wdXQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IC8vIHByZXZlbnQgYnViYmxpbmcgb2YgaW5wdXQgZXZlbnQgdG8gY29udHJvbGxlcjtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBkZWNpbWFscyhfbnVtYmVyOiBudW1iZXIgfCBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBfbnVtYmVyLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5zcGxpdCgnZScpO1xyXG4gICAgICBjb25zdCBtYW50aXNzYTogc3RyaW5nID0gcGFydHNbMF07XHJcbiAgICAgIGNvbnN0IGV4cDogbnVtYmVyID0gcGFydHMubGVuZ3RoID4gMSA/IHBhcnNlSW50KHBhcnRzWzFdLCAxMCkgOiAwO1xyXG4gICAgICBjb25zdCBmcmFjOiBzdHJpbmcgPSBtYW50aXNzYS5zcGxpdCgnLicpWzFdIHx8ICcnO1xyXG4gICAgICBjb25zdCBkZWNpbWFsczogbnVtYmVyID0gTWF0aC5tYXgoMCwgZnJhYy5sZW5ndGggLSBleHApO1xyXG4gICAgICByZXR1cm4gZGVjaW1hbHM7XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIHRleHQgaW5wdXQgZmllbGQgd2l0aCBhIGxhYmVsIHRvIGl0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50T3V0cHV0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLW91dHB1dFwiLCBDdXN0b21FbGVtZW50T3V0cHV0KTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IG91dHB1dDogSFRNTE91dHB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3V0cHV0XCIpO1xyXG4gICAgICBvdXRwdXQuaWQgPSBDdXN0b21FbGVtZW50Lm5leHRJZDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChvdXRwdXQpO1xyXG4gICAgICB0aGlzLnNldE11dGF0b3JWYWx1ZSh0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBjb250ZW50IG9mIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBGdWRnZUNvcmUuR2VuZXJhbCk6IHZvaWQge1xyXG4gICAgICBsZXQgb3V0cHV0OiBIVE1MT3V0cHV0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcIm91dHB1dFwiKTtcclxuICAgICAgb3V0cHV0LnZhbHVlID0gX3ZhbHVlID8/IHRoaXMuZ2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIik7XHJcbiAgICAgIGlmIChfdmFsdWUpXHJcbiAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZWhvbGRlclwiKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG91dHB1dC5jbGFzc0xpc3QuYWRkKFwicGxhY2Vob2xkZXJcIik7XHJcblxyXG4gICAgICAvLyB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJvdXRwdXRcIikudmFsdWUgPSBfdmFsdWUgPz8gdGhpcy5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIGRyb3Bkb3duIG1lbnUgdG8gZGlzcGxheSBlbnVtc1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50U2VsZWN0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLXNlbGVjdFwiLCBDdXN0b21FbGVtZW50U2VsZWN0LCBPYmplY3QpO1xyXG4gICAgcHVibGljIGNvbnRlbnQ6IE9iamVjdDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzLCBfY29udGVudDogT2JqZWN0ID0ge30pIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoIV9hdHRyaWJ1dGVzLmxhYmVsKVxyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2F0dHJpYnV0ZXMua2V5KTtcclxuICAgICAgdGhpcy5jb250ZW50ID0gX2NvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBzZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMuY29udGVudCkge1xyXG4gICAgICAgIGxldCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyID0gUmVmbGVjdC5nZXQodGhpcy5jb250ZW50LCBrZXkpO1xyXG4gICAgICAgIGlmIChSZWZsZWN0Lmhhcyh0aGlzLmNvbnRlbnQsIHZhbHVlKSAmJiBSZWZsZWN0LmdldCh0aGlzLmNvbnRlbnQsIHZhbHVlKSAhPT0ga2V5KSAvLyBmaWx0ZXIgbnVtYmVyIGtleXMgb3V0IG9mIHNpbXBsZSBlbnVtIFxyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgbGV0IGVudHJ5OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgZW50cnkudGV4dCA9IGtleTtcclxuICAgICAgICBlbnRyeS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIHR5cGVvZiB2YWx1ZSk7XHJcbiAgICAgICAgZW50cnkudmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpO1xyXG4gICAgICAgIGlmIChlbnRyeS52YWx1ZSA9PSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKSB7XHJcbiAgICAgICAgICBlbnRyeS5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGVjdC5hZGQoZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICAgIHNlbGVjdC50YWJJbmRleCA9IDA7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2VsZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveCBhcyBib29sZWFuIHZhbHVlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogc3RyaW5nIHwgbnVtYmVyIHtcclxuICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJzZWxlY3RcIik7XHJcbiAgICAgIGxldCB0eXBlOiBzdHJpbmcgPSBzZWxlY3Qub3B0aW9uc1tzZWxlY3Quc2VsZWN0ZWRJbmRleF0/LmdldEF0dHJpYnV0ZShcInR5cGVcIikgfHwgXCJzdHJpbmdcIjtcclxuICAgICAgcmV0dXJuIHR5cGUgPT0gXCJudW1iZXJcIiA/IHBhcnNlRmxvYXQoc2VsZWN0LnZhbHVlKSA6IHNlbGVjdC52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKS52YWx1ZSA9IF92YWx1ZTtcclxuICAgICAgLy8gdGhpcy52YWx1ZSA9IF92YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuIGludGVyYWN0aXZlIG51bWJlciBzdGVwcGVyIHdpdGggZXhwb25lbnRpYWwgZGlzcGxheSBhbmQgY29tcGxleCBoYW5kbGluZyB1c2luZyBrZXlib2FyZCBhbmQgbW91c2VcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudFN0ZXBwZXIgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2Utc3RlcHBlclwiLCBDdXN0b21FbGVtZW50U3RlcHBlciwgTnVtYmVyKTtcclxuICAgIHB1YmxpYyB2YWx1ZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM/OiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmIChfYXR0cmlidXRlcyAmJiBfYXR0cmlidXRlc1tcInZhbHVlXCJdKVxyXG4gICAgICAgIHRoaXMudmFsdWUgPSBwYXJzZUZsb2F0KF9hdHRyaWJ1dGVzW1widmFsdWVcIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQudHlwZSA9IFwibnVtYmVyXCI7XHJcbiAgICAgIGlucHV0LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSU5QVVQsIChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7IF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgfSk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cclxuXHJcbiAgICAgIGxldCBzaWduOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgc2lnbi50ZXh0Q29udGVudCA9IFwiK1wiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHNpZ24pO1xyXG4gICAgICBmb3IgKGxldCBleHA6IG51bWJlciA9IDI7IGV4cCA+IC00OyBleHAtLSkge1xyXG4gICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gbmV3IEN1c3RvbUVsZW1lbnREaWdpdCgpO1xyXG4gICAgICAgIGRpZ2l0LnNldEF0dHJpYnV0ZShcImV4cFwiLCBleHAudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChkaWdpdCk7XHJcbiAgICAgICAgaWYgKGV4cCA9PSAwKVxyXG4gICAgICAgICAgdGhpcy5pbm5lckhUTUwgKz0gXCIuXCI7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5pbm5lckhUTUwgKz0gXCJlXCI7XHJcblxyXG4gICAgICBsZXQgZXhwOiBIVE1MU3BhbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgZXhwLnRleHRDb250ZW50ID0gXCIrMFwiO1xyXG4gICAgICBleHAudGFiSW5kZXggPSAtMTtcclxuICAgICAgZXhwLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJleHBcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoZXhwKTtcclxuXHJcblxyXG4gICAgICAvLyBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRJbnB1dCk7XHJcbiAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQkxVUiwgdGhpcy5obmRJbnB1dCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5CTFVSLCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5XSEVFTCwgdGhpcy5obmRXaGVlbCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGUtL0FjdGl2YXRlcyB0YWJiaW5nIGZvciB0aGUgaW5uZXIgZGlnaXRzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmF0ZUlubmVyVGFicyhfb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBfb24gPyAwIDogLTE7XHJcblxyXG4gICAgICBsZXQgc3BhbnM6IE5vZGVMaXN0T2Y8SFRNTFNwYW5FbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XHJcbiAgICAgIHNwYW5zWzFdLnRhYkluZGV4ID0gaW5kZXg7XHJcblxyXG4gICAgICBsZXQgZGlnaXRzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnREaWdpdD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKTtcclxuICAgICAgZm9yIChsZXQgZGlnaXQgb2YgZGlnaXRzKVxyXG4gICAgICAgIGRpZ2l0LnRhYkluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPcGVucy9DbG9zZXMgYSBzdGFuZGFyZCBudW1iZXIgaW5wdXQgZm9yIHR5cGluZyB0aGUgdmFsdWUgYXQgb25jZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb3BlbklucHV0KF9vcGVuOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xyXG4gICAgICBpZiAoX29wZW4pIHtcclxuICAgICAgICBpbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmUgdGhlIHZhbHVlIG9mIHRoaXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBpdHMgdmFsdWUgYW5kIGRpc3BsYXlzIGl0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgaWYgKF92YWx1ZSA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBcclxuICAgICAgdGhpcy52YWx1ZSA9IF92YWx1ZTtcclxuICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSBtYW50aXNzYSBhbmQgZXhwb25lbnQgc2VwYXJhdGVseSBhcyBhbiBhcnJheSBvZiB0d28gbWVtYmVyc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TWFudGlzc2FBbmRFeHBvbmVudCgpOiBudW1iZXJbXSB7XHJcbiAgICAgIGxldCBwcmVjOiBzdHJpbmcgPSB0aGlzLnZhbHVlLnRvRXhwb25lbnRpYWwoNik7XHJcbiAgICAgIGxldCBleHA6IG51bWJlciA9IHBhcnNlSW50KHByZWMuc3BsaXQoXCJlXCIpWzFdKTtcclxuICAgICAgbGV0IGV4cDM6IG51bWJlciA9IE1hdGgudHJ1bmMoZXhwIC8gMyk7XHJcbiAgICAgIGxldCBtYW50aXNzYTogbnVtYmVyID0gdGhpcy52YWx1ZSAvIE1hdGgucG93KDEwLCBleHAzICogMyk7XHJcbiAgICAgIG1hbnRpc3NhID0gTWF0aC5yb3VuZChtYW50aXNzYSAqIDEwMDApIC8gMTAwMDtcclxuICAgICAgcmV0dXJuIFttYW50aXNzYSwgZXhwMyAqIDNdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoaXMgdmFsdWUgYXMgYSBzdHJpbmdcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cF06IG51bWJlcltdID0gdGhpcy5nZXRNYW50aXNzYUFuZEV4cG9uZW50KCk7XHJcbiAgICAgIGxldCBwcmVmaXhNYW50aXNzYTogc3RyaW5nID0gKG1hbnRpc3NhIDwgMCkgPyBcIlwiIDogXCIrXCI7XHJcbiAgICAgIGxldCBwcmVmaXhFeHA6IHN0cmluZyA9IChleHAgPCAwKSA/IFwiXCIgOiBcIitcIjtcclxuICAgICAgcmV0dXJuIHByZWZpeE1hbnRpc3NhICsgbWFudGlzc2EudG9GaXhlZCgzKSArIFwiZVwiICsgcHJlZml4RXhwICsgZXhwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheXMgdGhpcyB2YWx1ZSBieSBzZXR0aW5nIHRoZSBjb250ZW50cyBvZiB0aGUgZGlnaXRzIGFuZCB0aGUgZXhwb25lbnRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBkaXNwbGF5KCk6IHZvaWQge1xyXG4gICAgICBsZXQgZGlnaXRzOiBOb2RlTGlzdE9mPEN1c3RvbUVsZW1lbnREaWdpdD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKTtcclxuICAgICAgbGV0IHNwYW5zOiBOb2RlTGlzdE9mPEhUTUxTcGFuRWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJzcGFuXCIpO1xyXG5cclxuICAgICAgaWYgKCFpc0Zpbml0ZSh0aGlzLnZhbHVlKSkge1xyXG4gICAgICAgIGZvciAobGV0IHBvczogbnVtYmVyID0gMDsgcG9zIDwgZGlnaXRzLmxlbmd0aDsgcG9zKyspIHtcclxuICAgICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gZGlnaXRzWzUgLSBwb3NdO1xyXG4gICAgICAgICAgZGlnaXQuaW5uZXJIVE1MID0gXCIgIOKIniAgIFwiWzUgLSBwb3NdO1xyXG4gICAgICAgICAgc3BhbnNbMV0udGV4dENvbnRlbnQgPSBcIiAgXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgbGV0IFttYW50aXNzYSwgZXhwXTogc3RyaW5nW10gPSB0aGlzLnRvU3RyaW5nKCkuc3BsaXQoXCJlXCIpO1xyXG4gICAgICBzcGFuc1swXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWUgPCAwID8gXCItXCIgOiBcIitcIjtcclxuICAgICAgc3BhbnNbMV0udGV4dENvbnRlbnQgPSBleHA7XHJcblxyXG4gICAgICBtYW50aXNzYSA9IG1hbnRpc3NhLnN1YnN0cmluZygxKTtcclxuICAgICAgbWFudGlzc2EgPSBtYW50aXNzYS5yZXBsYWNlKFwiLlwiLCBcIlwiKTtcclxuICAgICAgZm9yIChsZXQgcG9zOiBudW1iZXIgPSAwOyBwb3MgPCBkaWdpdHMubGVuZ3RoOyBwb3MrKykge1xyXG4gICAgICAgIGxldCBkaWdpdDogQ3VzdG9tRWxlbWVudERpZ2l0ID0gZGlnaXRzWzUgLSBwb3NdO1xyXG4gICAgICAgIGlmIChwb3MgPCBtYW50aXNzYS5sZW5ndGgpIHtcclxuICAgICAgICAgIGxldCBjaGFyOiBzdHJpbmcgPSBtYW50aXNzYS5jaGFyQXQobWFudGlzc2EubGVuZ3RoIC0gMSAtIHBvcyk7XHJcbiAgICAgICAgICBkaWdpdC50ZXh0Q29udGVudCA9IGNoYXI7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBkaWdpdC5pbm5lckhUTUwgPSBcIiZuYnNwO1wiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIYW5kbGUga2V5Ym9hcmQgaW5wdXQgb24gdGhpcyBlbGVtZW50IGFuZCBpdHMgZGlnaXRzXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgYWN0aXZlOiBFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgbGV0IG51bUVudGVyZWQ6IG51bWJlciA9IF9ldmVudC5rZXkuY2hhckNvZGVBdCgwKSAtIDQ4O1xyXG5cclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgLy8gaWYgZm9jdXMgaXMgb24gc3RlcHBlciwgZW50ZXIgaXQgYW5kIGZvY3VzIGRpZ2l0XHJcbiAgICAgIGlmIChhY3RpdmUgPT0gdGhpcykge1xyXG4gICAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FTlRFUjpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5OVU1QQURfRU5URVI6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZUlubmVyVGFicyh0cnVlKTtcclxuICAgICAgICAgICAgKDxIVE1MRWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1kaWdpdFwiKVsyXSkuZm9jdXMoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRjI6XHJcbiAgICAgICAgICAgIHRoaXMub3BlbklucHV0KHRydWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChudW1FbnRlcmVkID49IDAgJiYgbnVtRW50ZXJlZCA8PSA5KSB8fCBfZXZlbnQua2V5ID09IFwiLVwiIHx8IF9ldmVudC5rZXkgPT0gXCIrXCIpIHtcclxuICAgICAgICAgIHRoaXMub3BlbklucHV0KHRydWUpO1xyXG4gICAgICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgLy8gX2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlucHV0IGZpZWxkIG92ZXJsYXkgaXMgYWN0aXZlXHJcbiAgICAgIGlmIChhY3RpdmUuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgaWYgKF9ldmVudC5rZXkgPT0gxpIuS0VZQk9BUkRfQ09ERS5FTlRFUiB8fCBfZXZlbnQua2V5ID09IMaSLktFWUJPQVJEX0NPREUuTlVNUEFEX0VOVEVSIHx8IF9ldmVudC5rZXkgPT0gxpIuS0VZQk9BUkRfQ09ERS5UQUJVTEFUT1IpIHtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSBOdW1iZXIoKDxIVE1MSW5wdXRFbGVtZW50PmFjdGl2ZSkudmFsdWUpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICAgICAgICB0aGlzLm9wZW5JbnB1dChmYWxzZSk7XHJcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChudW1FbnRlcmVkID49IDAgJiYgbnVtRW50ZXJlZCA8PSA5KSB7XHJcbiAgICAgICAgbGV0IGRpZmZlcmVuY2U6IG51bWJlciA9IG51bUVudGVyZWQgLSBOdW1iZXIoYWN0aXZlLnRleHRDb250ZW50KSAqICh0aGlzLnZhbHVlIDwgMCA/IC0xIDogMSk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKGRpZmZlcmVuY2UpO1xyXG5cclxuICAgICAgICBsZXQgbmV4dDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+YWN0aXZlLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICBpZiAobmV4dClcclxuICAgICAgICAgIG5leHQuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQua2V5ID09IFwiLVwiIHx8IF9ldmVudC5rZXkgPT0gXCIrXCIpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gKF9ldmVudC5rZXkgPT0gXCItXCIgPyAtMSA6IDEpICogTWF0aC5hYnModGhpcy52YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLlRBQlVMQVRPUilcclxuICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIHRoaXMuY2hhbmdlRGlnaXRGb2N1c3NlZCgtMSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKCsxKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfTEVGVDpcclxuICAgICAgICAgICg8SFRNTEVsZW1lbnQ+YWN0aXZlLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfUklHSFQ6XHJcbiAgICAgICAgICBsZXQgbmV4dDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+YWN0aXZlLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRU5URVI6XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLk5VTVBBRF9FTlRFUjpcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRVNDOlxyXG4gICAgICAgICAgdGhpcy5hY3RpdmF0ZUlubmVyVGFicyhmYWxzZSk7XHJcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRjI6XHJcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMub3BlbklucHV0KHRydWUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kV2hlZWwgPSAoX2V2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGxldCBjaGFuZ2U6IG51bWJlciA9IF9ldmVudC5kZWx0YVkgPCAwID8gKzEgOiAtMTtcclxuICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKGNoYW5nZSk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kSW5wdXQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLm9wZW5JbnB1dChmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAodGhpcy5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VEaWdpdEZvY3Vzc2VkKF9hbW91bnQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgZGlnaXQ6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICBpZiAoZGlnaXQgPT0gdGhpcyB8fCAhdGhpcy5jb250YWlucyhkaWdpdCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgX2Ftb3VudCA9IE1hdGgucm91bmQoX2Ftb3VudCk7XHJcbiAgICAgIGlmIChfYW1vdW50ID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKGRpZ2l0ID09IHRoaXMucXVlcnlTZWxlY3RvcihcIltuYW1lPWV4cF1cIikpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnZhbHVlKTtcclxuICAgICAgICBsZXQgdmFsdWU6IG51bWJlciA9IHRoaXMudmFsdWUgKiBNYXRoLnBvdygxMCwgX2Ftb3VudCk7XHJcbiAgICAgICAgxpIuRGVidWcubG9nKHZhbHVlLCB0aGlzLnZhbHVlKTtcclxuICAgICAgICBpZiAoaXNGaW5pdGUodmFsdWUpKVxyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlOyBcclxuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBleHBEaWdpdDogbnVtYmVyID0gcGFyc2VJbnQoZGlnaXQuZ2V0QXR0cmlidXRlKFwiZXhwXCIpKTtcclxuICAgICAgLy8gQHRzLWlnbm9yZSAobWFudGlzc2Egbm90IHVzZWQpXHJcbiAgICAgIGxldCBbbWFudGlzc2EsIGV4cFZhbHVlXTogbnVtYmVyW10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuXHJcbiAgICAgIGxldCBwcmV2OiBudW1iZXIgPSB0aGlzLnZhbHVlO1xyXG4gICAgICB0aGlzLnZhbHVlICs9IF9hbW91bnQgKiBNYXRoLnBvdygxMCwgZXhwRGlnaXQgKyBleHBWYWx1ZSk7XHJcbiAgICAgIC8vIHdvcmthcm91bmQgcHJlY2lzaW9uIHByb2JsZW1zIG9mIGphdmFzY3JpcHRcclxuICAgICAgaWYgKE1hdGguYWJzKHByZXYgLyB0aGlzLnZhbHVlKSA+IDEwMDApXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcblxyXG5cclxuICAgICAgbGV0IGV4cE5ldzogbnVtYmVyO1xyXG4gICAgICBbbWFudGlzc2EsIGV4cE5ld10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2cobWFudGlzc2EpO1xyXG4gICAgICB0aGlzLnNoaWZ0Rm9jdXMoZXhwTmV3IC0gZXhwVmFsdWUpO1xyXG4gICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNoaWZ0Rm9jdXMoX25EaWdpdHM6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgc2hpZnRGb2N1czogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIGlmIChfbkRpZ2l0cykge1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCAzOyBpKyspXHJcbiAgICAgICAgICBpZiAoX25EaWdpdHMgPiAwKVxyXG4gICAgICAgICAgICBzaGlmdEZvY3VzID0gc2hpZnRGb2N1cy5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNoaWZ0Rm9jdXMgPSBzaGlmdEZvY3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcblxyXG4gICAgICAgICg8SFRNTEVsZW1lbnQ+c2hpZnRGb2N1cykuZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIHRleHQgaW5wdXQgZmllbGQgd2l0aCBhIGxhYmVsIHRvIGl0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50VGV4dElucHV0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLXRleHRpbnB1dFwiLCBDdXN0b21FbGVtZW50VGV4dElucHV0LCBTdHJpbmcpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcbiAgICAgIFxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIGlucHV0LnZhbHVlID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZSA9IF92YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBCYXNlY2xhc3MgZm9yIGNvbXBsZXggdWktY29udHJvbGxlcnMgaGFuZGxpbmcgZGF0YSBpbiB0YWJsZXMsIHRyZWVzIG9yIG90aGVyIHN0cnVjdHVyZXMgICBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgRGF0YUNvbnRyb2xsZXI8VD4ge1xyXG4gICAgLyoqIFN0b3JlcyByZWZlcmVuY2VzIHRvIHNlbGVjdGVkIG9iamVjdHMuIE92ZXJyaWRlIHdpdGggYSByZWZlcmVuY2UgaW4gb3V0ZXIgc2NvcGUsIGlmIHNlbGVjdGlvbiBzaG91bGQgYWxzbyBvcGVyYXRlIG91dHNpZGUgb2YgdGFibGUgKi9cclxuICAgIHB1YmxpYyBzZWxlY3Rpb246IFRbXSA9IFtdO1xyXG4gICAgXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZW1vdmUgdGhlIG9iamVjdHMgdG8gYmUgZGVsZXRlZCwgZS5nLiB0aGUgY3VycmVudCBzZWxlY3Rpb24sIGZyb20gdGhlIGRhdGEgc3RydWN0dXJlIHRoZSB0YWJsZSByZWZlcnMgdG8gYW5kIFxyXG4gICAgICogcmV0dXJuIGEgbGlzdCBvZiB0aG9zZSBvYmplY3RzIGluIG9yZGVyIGZvciB0aGUgYWNjb3JkaW5nIHtAbGluayBUYWJsZUl0ZW1zfSB0byBiZSBkZWxldGVkIGFsc28gICBcclxuICAgICAqIEBwYXJhbSBfZXhwZW5kYWJsZXMgVGhlIGV4cGVuZGFibGUgb2JqZWN0cyBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZShfZXhwZW5kYWJsZXM6IFRbXSk6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIHJldHVybiBfZXhwZW5kYWJsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVmZXIgaXRlbXMgdG8gdGhlIGNsaXBib2FyZCBmb3IgY29weSAmIHBhc3RlICAgXHJcbiAgICAgKiBAcGFyYW0gX2ZvY3VzIFRoZSBpdGVtIGhhcyB0aGUgZm9jdXMgYW5kIHRoYXQgd2lsbCBiZSBjb3BpZWQgaWYgdGhlIHNlbGVjdGlvbiBpcyBlbXB0eSxcclxuICAgICAqIG90aGVyd2lzZSB0aGUgY3VycmVudCBzZWxlY3Rpb24gaXMgcmVmZXJyZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvcHkoX2ZvY3VzOiBULCBfb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uKTogVFtdIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLnNlbGVjdGlvbi5sZW5ndGggPyB0aGlzLnNlbGVjdGlvbiA6IFtfZm9jdXNdO1xyXG4gICAgICBDbGlwYm9hcmQuY29weVBhc3RlLnNldChpdGVtcywgX29wZXJhdGlvbik7XHJcbiAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZWZlciBvYmplY3RzIHRvIHRoZSBjbGlwYm9hcmQgZm9yIGNvcHkgJiBwYXN0ZSBhbmQgZGVsZXRlIHRoZW0gZnJvbSB0aGlzIGNvbnRyb2xsZXIgICBcclxuICAgICAqIEBwYXJhbSBfZm9jdXMgVGhlIGl0ZW0gdGhhdCBoYXMgdGhlIGZvY3VzIGFuZCB0aGF0IHdpbGwgYmUgY3V0IGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksXHJcbiAgICAgKiBvdGhlcndpc2UgdGhlIHdob2xlIHNlbGVjdGlvbiBnZXRzIHJlZmVycmVkIGFuZCBkZWxldGVkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBjdXQoX2ZvY3VzOiBULCBfb3BlcmF0aW9uOiBDbGlwT3BlcmF0aW9uKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLmNvcHkoX2ZvY3VzLCBfb3BlcmF0aW9uKTtcclxuICAgICAgaXRlbXMgPSBhd2FpdCB0aGlzLmRlbGV0ZShpdGVtcyk7XHJcbiAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXRyaWV2ZSBvYmplY3RzIGZyb20gdGhlIGNsaXBib2FyZCwgcHJvY2VzcyBhbmQgcmV0dXJuIHRoZW0gdG8gYWRkIHRvIHRoZSB0YWJsZSAgIFxyXG4gICAgICogU3RhbmRhcmQgYmVoYXZpb3VyOiBpZiB0aGUgY29weVBhc3RlIGNsaXBib2FyZCB3YXMgZmlsbGVkIHVzaW5nIGNvcHksIHJldHVybiBhbiBhcnJheSBvZiBjbG9uZXMsXHJcbiAgICAgKiBvdGhlcndpc2UgdGhlIGNvbnRlbnQgb2YgdGhlIGNsaXBib2FyZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgcGFzdGUoKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IENsaXBib2FyZC5jb3B5UGFzdGUuZ2V0KCk7XHJcbiAgICAgIGlmIChDbGlwYm9hcmQuY29weVBhc3RlLm9wZXJhdGlvbiA9PSBcImNvcHlcIilcclxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbG9uZShvYmplY3RzKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBvYmplY3RzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJlZmVyIG9iamVjdHMgdG8gdGhlIGNsaXBib2FyZCBmb3IgZHJhZyAmIGRyb3AgICBcclxuICAgICAqIEBwYXJhbSBfZm9jdXMgVGhlIGl0ZW0gdGhhdCBoYXMgdGhlIGZvY3VzIGFuZCB0aGF0IHdpbGwgYmUgZHJhZ2dlZCBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LFxyXG4gICAgICogb3RoZXJ3aXNlIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyByZWZlcnJlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ1N0YXJ0KF9mb2N1czogVCk6IHZvaWQge1xyXG4gICAgICAvLyBpZiB0aGUgZm9jdXNzZWQgaXRlbSBpcyBpbiB0aGUgc2VsZWN0aW9uLCBkcmFnIHRoZSB3aG9sZSBzZWxlY3Rpb25cclxuICAgICAgbGV0IGl0ZW1zOiBUW10gPSB0aGlzLnNlbGVjdGlvbi5pbmRleE9mKF9mb2N1cykgPCAwID8gW19mb2N1c10gOiB0aGlzLnNlbGVjdGlvbjtcclxuICAgICAgQ2xpcGJvYXJkLmRyYWdEcm9wLnNldChpdGVtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGFsbG93ZWQgZHJhZ0Ryb3AtZWZmZWN0ICBcclxuICAgICAqIFN0YW5kYXJkIGJlaGF2aW91cjogY2hlY2sgdGhlIGN0cmxLZXkgZm9yIFwiY29weVwiIGFuZCBzaGlmdEtleSBmb3IgXCJsaW5rXCIsIG90aGVyd2lzZSByZXR1cm4gXCJtb3ZlXCIgIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ092ZXIoX2V2ZW50OiBEcmFnRXZlbnQpOiBEUk9QRUZGRUNUIHtcclxuICAgICAgbGV0IGRyb3BFZmZlY3Q6IERST1BFRkZFQ1QgPSBcIm1vdmVcIjtcclxuICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIGRyb3BFZmZlY3QgPSBcImNvcHlcIjtcclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICBkcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgIHJldHVybiBkcm9wRWZmZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHJpZXZlIG9iamVjdHMgZnJvbSB0aGUgY2xpcGJvYXJkLCBwcm9jZXNzIGFuZCByZXR1cm4gdGhlbSB0byBhZGQgdG8gdGhlIHRyZWUuXHJcbiAgICAgKiBTdGFuZGFyZCBiZWhhdmlvdXI6IGlmIHtAbGluazogZHJhZ092ZXJ9IHlpZWxkcyBcImNvcHlcIiwgcmV0dXJuIGFuIGFycmF5IG9mIGNsb25lcyBvZiB0aGUgb2JqZWN0cyBpbixcclxuICAgICAqIG90aGVyd2lzZSB0aGUgY29udGVudCBvZiB0aGUgZHJhZ0Ryb3AtY2xpcGJvYXJkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgZHJvcChfZXZlbnQ6IERyYWdFdmVudCk6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIGxldCBvYmplY3RzOiBUW10gPSBDbGlwYm9hcmQuZHJhZ0Ryb3AuZ2V0KCk7XHJcbiAgICAgIGlmICh0aGlzLmRyYWdPdmVyKF9ldmVudCkgPT0gXCJjb3B5XCIpXHJcbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2xvbmUob2JqZWN0cyk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gb2JqZWN0cztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBDbG9uZSBvYmplY3RzIGFuZCByZXR1cm4gYW4gYXJyYXkgd2l0aCByZWZlcmVuY2VzIHRvIHRoZSBjbG9uZXNcclxuICAgICAqIFN0YW5kYXJkIGJlaGF2aW91cjogdXNlIE9iamVjdC5jcmVhdGUgdG8gY2xvbmUgdGhlIG9iamVjdHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGNsb25lKF9vYmplY3RzOiBUW10pOiBQcm9taXNlPFRbXT4ge1xyXG4gICAgICByZXR1cm4gX29iamVjdHMubWFwKF9vYmplY3QgPT4gT2JqZWN0LmNyZWF0ZSg8T2JqZWN0Pl9vYmplY3QpKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgRGV0YWlscyBleHRlbmRzIEhUTUxEZXRhaWxzRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY29udGVudDogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9sZWdlbmQ6IHN0cmluZyA9IFwiXCIsIF90eXBlOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgLy8gVE9ETzogY2hlY2sgaWYgdGhpcyBzaG91bGQgYmUgcmVtb3ZlZCBhZnRlciBjaGFuZ2luZyBhbmltYXRpb24gc3RydWN0dXJlIHRvIGxvb2sgbW9yZSBsaWtlIGEgbXV0YXRvclxyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImtleVwiLCBfbGVnZW5kKTtcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfbGVnZW5kKTtcclxuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIF90eXBlKTtcclxuICAgICAgdGhpcy5vcGVuID0gdHJ1ZTtcclxuICAgICAgbGV0IGxibFN1bW1hcnk6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN1bW1hcnlcIik7XHJcbiAgICAgIGxibFN1bW1hcnkudGV4dENvbnRlbnQgPSBfbGVnZW5kO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGxibFN1bW1hcnkpO1xyXG5cclxuICAgICAgdGhpcy5jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQpO1xyXG5cclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfTkVYVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19TRVQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVE9HR0xFLCB0aGlzLmhuZFRvZ2dsZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNFeHBhbmRlZCgpOiBib29sZWFuIHtcclxuICAgICAgLy8gcmV0dXJuIHRoaXMuZXhwYW5kZXIuY2hlY2tlZDtcclxuICAgICAgcmV0dXJuIHRoaXMub3BlbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29udGVudChfY29udGVudDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZXBsYWNlQ2hpbGQoX2NvbnRlbnQsIHRoaXMuY29udGVudCk7XHJcbiAgICAgIHRoaXMuY29udGVudCA9IF9jb250ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBleHBhbmQoX2V4cGFuZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAvLyB0aGlzLmV4cGFuZGVyLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLm9wZW4gPSBfZXhwYW5kO1xyXG4gICAgICB0aGlzLmhuZFRvZ2dsZShudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFRvZ2dsZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChfZXZlbnQpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KHRoaXMuaXNFeHBhbmRlZCA/IEVWRU5ULkVYUEFORCA6IEVWRU5ULkNPTExBUFNFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfTkVYVDpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQudGFiSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfUFJFVklPVVM6XHJcbiAgICAgICAgICBsZXQgcHJldmlvdXM6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChwcmV2aW91cyAmJiBwcmV2aW91cy50YWJJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIGxldCBzZXRzOiBOb2RlTGlzdE9mPEhUTUxEZXRhaWxzRWxlbWVudD4gPSBwcmV2aW91cy5xdWVyeVNlbGVjdG9yQWxsKFwiZGV0YWlsc1wiKTtcclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciA9IHNldHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAoaSlcclxuICAgICAgICAgICAgICBkbyB7IC8vIGZvY3VzIHRoZSBsYXN0IHZpc2libGUgc2V0XHJcbiAgICAgICAgICAgICAgICBzZXRzWy0taV0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICB9IHdoaWxlICghc2V0c1tpXS5vZmZzZXRQYXJlbnQpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgcHJldmlvdXMuZm9jdXMoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkZPQ1VTX1NFVDpcclxuICAgICAgICAgIGlmIChfZXZlbnQudGFyZ2V0ICE9IHRoaXMpIHtcclxuICAgICAgICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHBhc3NFdmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAvLyBsZXQgdGFyZ2V0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5JTlNFUlQ6XHJcbiAgICAgICAgICDGki5EZWJ1Zy5sb2coXCJJTlNFUlQgYXQgRGV0YWlsc1wiKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuSU5TRVJULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogdGhpcyB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgcGFzc0V2ZW50ID0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICghdGhpcy5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0V4cGFuZGVkKVxyXG4gICAgICAgICAgICBuZXh0ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiZGV0YWlsc1wiKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgIG5leHQgPSA8SFRNTEVsZW1lbnQ+bmV4dC5uZXh0RWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKG5leHQgJiYgbmV4dC50YWJJbmRleCA+IC0xKTtcclxuXHJcbiAgICAgICAgICBpZiAobmV4dClcclxuICAgICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG4gICAgICAgICAgLy8gbmV4dC5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5UX1RSRUUuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgaWYgKHRoaXMuaXNFeHBhbmRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIGxldCBwcmV2aW91czogSFRNTEVsZW1lbnQgPSB0aGlzO1xyXG4gICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBwcmV2aW91cyA9IDxIVE1MRWxlbWVudD5wcmV2aW91cy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgfSB3aGlsZSAocHJldmlvdXMgJiYgIShwcmV2aW91cyBpbnN0YW5jZW9mIERldGFpbHMpKTtcclxuXHJcbiAgICAgICAgICBpZiAocHJldmlvdXMpXHJcbiAgICAgICAgICAgIGlmICgoPERldGFpbHM+cHJldmlvdXMpLmlzRXhwYW5kZWQpXHJcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgIHByZXZpb3VzLmZvY3VzKCk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1NFVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFwYXNzRXZlbnQpXHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcbiAgLy8gVE9ETzogdXNlIEN1c3RvbUVsZW1lbnQucmVnaXN0ZXI/XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWktZGV0YWlsc1wiLCBEZXRhaWxzLCB7IGV4dGVuZHM6IFwiZGV0YWlsc1wiIH0pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIERldGFpbHNBcnJheSBleHRlbmRzIERldGFpbHMge1xyXG4gICAgcHVibGljIGlucHV0OiBDdXN0b21FbGVtZW50TnVtYmVyO1xyXG4gICAgcHVibGljIGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9sZWdlbmQ6IHN0cmluZykge1xyXG4gICAgICBzdXBlcihfbGVnZW5kLCBcIkFycmF5XCIpO1xyXG5cclxuICAgICAgdGhpcy5pbnB1dCA9IG5ldyBDdXN0b21FbGVtZW50TnVtYmVyKHsga2V5OiBcImxlbmd0aFwiLCBsYWJlbDogXCJsZW5ndGhcIiwgdmFsdWU6IFwiMFwiLCBtaW46IFwiMFwiLCBzdGVwOiBcIjFcIiB9KTtcclxuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2VJbnB1dCk7XHJcbiAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcInN1bW1hcnlcIikuYWZ0ZXIodGhpcy5pbnB1dCk7XHJcblxyXG4gICAgICB0aGlzLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIHRoaXMuYnV0dG9uLmlubmVyVGV4dCA9IFwiK1wiO1xyXG4gICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNMSUNLLCB0aGlzLmhuZENsaWNrQnV0dG9uKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldENvbnRlbnQoX2NvbnRlbnQ6IEhUTUxEaXZFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIHN1cGVyLnNldENvbnRlbnQoX2NvbnRlbnQpO1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNvbnRlbnQuY2hpbGRyZW4gYXMgSFRNTENvbGxlY3Rpb25PZjxIVE1MRWxlbWVudD4pXHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhjaGlsZCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5pbnB1dC5pc0luaXRpYWxpemVkKVxyXG4gICAgICAgIHRoaXMuaW5wdXQuc2V0TXV0YXRvclZhbHVlKHRoaXMuY29udGVudC5jaGlsZHJlbi5sZW5ndGgpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0aGlzLmNvbnRlbnQuY2hpbGRyZW4ubGVuZ3RoLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHB1YmxpYyBnZXRNdXRhdG9yKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgLy8gICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvcltdID0gW107XHJcblxyXG4gICAgLy8gICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmNvbnRlbnQuY2hpbGRyZW4gYXMgSFRNTENvbGxlY3Rpb25PZjxDdXN0b21FbGVtZW50PilcclxuICAgIC8vICAgICBtdXRhdG9yLnB1c2goY2hpbGQuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG5cclxuICAgIC8vICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRFdmVudExpc3RlbmVycyhfY2hpbGQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgIF9jaGlsZC5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICBfY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdTdGFydCk7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRST1AsIHRoaXMuaG5kRHJvcCk7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleVNwZWNpYWwpO1xyXG4gICAgICBfY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5JTlNFUlQsIHRoaXMuaG5kSW5zZXJ0KTtcclxuICAgICAgX2NoaWxkLnRhYkluZGV4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlYXJyYW5nZShfZm9jdXM6IG51bWJlciA9IHVuZGVmaW5lZCk6IHZvaWQge1xyXG4gICAgICBsZXQgc2VxdWVuY2U6IG51bWJlcltdID0gW107XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbilcclxuICAgICAgICBzZXF1ZW5jZS5wdXNoKHBhcnNlSW50KGNoaWxkLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKSk7XHJcblxyXG4gICAgICB0aGlzLnNldEZvY3VzKF9mb2N1cyk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVBUlJBTkdFX0FSUkFZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBrZXk6IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpLCBzZXF1ZW5jZTogc2VxdWVuY2UgfSB9KSk7XHJcblxyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEN1c3RvbUVsZW1lbnQ+KSB7XHJcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFwia2V5XCIsIGNvdW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIGlmIChjaGlsZC5zZXRMYWJlbClcclxuICAgICAgICAgIGNoaWxkLnNldExhYmVsKGNvdW50LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIMaSLkRlYnVnLmZ1ZGdlKGNoaWxkLnRhYkluZGV4KTtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULk1VVEFURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEZvY3VzKF9mb2N1czogbnVtYmVyID0gdW5kZWZpbmVkKTogdm9pZCB7XHJcbiAgICAgIGlmIChfZm9jdXMgPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX2ZvY3VzID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oX2ZvY3VzLCB0aGlzLmNvbnRlbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMSkpO1xyXG4gICAgICBsZXQgY2hpbGQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRoaXMuY29udGVudC5jaGlsZHJlbltfZm9jdXNdO1xyXG4gICAgICBjaGlsZD8uZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdTdGFydCA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBfZXZlbnQucHJldmVudERlZmF1bHQ7IFxyXG4gICAgICBsZXQga2V5RHJhZzogc3RyaW5nID0gKDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldCkuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJpbmRleFwiLCBrZXlEcmFnKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwia2V5OlwiICsgdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIiksIFwia2V5XCIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2V2ZW50LmRhdGFUcmFuc2Zlci5pdGVtcykge1xyXG4gICAgICAgIGxldCBrZXk6IHN0cmluZztcclxuICAgICAgICBsZXQgbGFiZWw6IHN0cmluZztcclxuICAgICAgICBba2V5LCBsYWJlbF0gPSBpdGVtLnR5cGUuc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgIGlmIChrZXkgPT0gXCJrZXlcIiAmJiBsYWJlbCA9PSB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKSkge1xyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwiY29weVwiO1xyXG4gICAgICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJsaW5rXCI7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhsYWJlbCA9PSB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJvcCA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfZXZlbnQpO1xyXG4gICAgICBsZXQgZHJvcDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+X2V2ZW50LmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgIGxldCBrZXlEcm9wOiBzdHJpbmcgPSBkcm9wLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgbGV0IGtleURyYWc6IHN0cmluZyA9IF9ldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImluZGV4XCIpO1xyXG4gICAgICBsZXQgZHJhZzogSFRNTEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoYFtrZXk9XCIke2tleURyYWd9XCJdYCk7XHJcbiAgICAgIGxldCBsYWJlbERyYWc6IHN0cmluZyA9IGRyYWcuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcblxyXG4gICAgICBsZXQgcG9zaXRpb246IEluc2VydFBvc2l0aW9uID0ga2V5RHJhZyA+IGtleURyb3AgPyBcImJlZm9yZWJlZ2luXCIgOiBcImFmdGVyZW5kXCI7XHJcbiAgICAgIGlmIChfZXZlbnQuY3RybEtleSlcclxuICAgICAgICBkcmFnID0gPEhUTUxFbGVtZW50PmRyYWcuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICBkcmFnLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGxhYmVsRHJhZyk7XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgIGRyYWcucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkcmFnKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGRyb3AuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KHBvc2l0aW9uLCBkcmFnKTtcclxuXHJcbiAgICAgIHRoaXMucmVhcnJhbmdlKCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoZHJhZyk7XHJcbiAgICAgIGRyYWcuZm9jdXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDbGlja0J1dHRvbiA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuaW5wdXQuc2V0TXV0YXRvclZhbHVlKHRoaXMuaW5wdXQuZ2V0TXV0YXRvclZhbHVlKCkgKyAxKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRVNUUlVDVFVSRV9BUlJBWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgbGVuZ3RoOiB0aGlzLmlucHV0LnZhbHVlIH0gfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENoYW5nZUlucHV0ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRVNUUlVDVFVSRV9BUlJBWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgbGVuZ3RoOiB0aGlzLmlucHV0LnZhbHVlIH0gfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEluc2VydCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKFwiaG5kSW5zZXJ0XCIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleVNwZWNpYWwgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldDtcclxuXHJcbiAgICAgIC8vIG9ubHkgd29yayBvbiBpdGVtcyBvZiBsaXN0LCBub3QgdGhlaXIgY2hpbGRyZW5cclxuICAgICAgaWYgKCg8SFRNTEVsZW1lbnQ+X2V2ZW50LnRhcmdldCkgIT0gaXRlbSAmJiBfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgZm9jdXM6IG51bWJlciA9IHBhcnNlSW50KGl0ZW0uZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpO1xyXG4gICAgICBsZXQgc2libGluZzogSFRNTEVsZW1lbnQgPSBpdGVtO1xyXG4gICAgICBsZXQgaW5zZXJ0OiBIVE1MRWxlbWVudCA9IGl0ZW07XHJcbiAgICAgIGxldCBwYXNzRXZlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuREVMRVRFOlxyXG4gICAgICAgICAgaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgdGhpcy5yZWFycmFuZ2UoZm9jdXMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgLy8gY2FzZSDGki5LRVlCT0FSRF9DT0RFLklOU0VSVDpcclxuICAgICAgICAvLyAgIHBhc3NFdmVudCA9IHRydWU7XHJcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcIklOU0VSVCBhdCBEZXRhaWxzQXJyYXlcIik7XHJcbiAgICAgICAgLy8gICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICBpZiAoIV9ldmVudC5hbHRLZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRGb2N1cygtLWZvY3VzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgIGluc2VydCA9IDxIVE1MRWxlbWVudD5pdGVtLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICAgICAgaW5zZXJ0LnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGl0ZW0uZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKGluc2VydCk7XHJcbiAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgc2libGluZyA9IDxIVE1MRWxlbWVudD5pdGVtLnByZXZpb3VzU2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nKVxyXG4gICAgICAgICAgICBzaWJsaW5nLmluc2VydEFkamFjZW50RWxlbWVudChcImJlZm9yZWJlZ2luXCIsIGluc2VydCk7XHJcbiAgICAgICAgICB0aGlzLnJlYXJyYW5nZSgtLWZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgaWYgKCFfZXZlbnQuYWx0S2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Rm9jdXMoKytmb2N1cyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICBpbnNlcnQgPSA8SFRNTEVsZW1lbnQ+aXRlbS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIGluc2VydC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBpdGVtLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhpbnNlcnQpO1xyXG4gICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHNpYmxpbmcgPSA8SFRNTEVsZW1lbnQ+aXRlbS5uZXh0U2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nKVxyXG4gICAgICAgICAgICBzaWJsaW5nLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIGluc2VydCk7XHJcbiAgICAgICAgICB0aGlzLnJlYXJyYW5nZSgrK2ZvY3VzKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXBhc3NFdmVudCkge1xyXG4gICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVpLWxpc3RcIiwgRGV0YWlsc0FycmF5LCB7IGV4dGVuZHM6IFwiZGV0YWlsc1wiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBTdGF0aWMgY2xhc3MgdG8gZGlzcGxheSBhIG1vZGFsIG9yIG5vbi1tb2RhbCBkaWFsb2cgd2l0aCBhbiBpbnRlcmZhY2UgZm9yIHRoZSBnaXZlbiBtdXRhdG9yLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBEaWFsb2cge1xyXG4gICAgcHVibGljIHN0YXRpYyBkb206IEhUTUxEaWFsb2dFbGVtZW50O1xyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9tcHQgdGhlIGRpYWxvZyB0byB0aGUgdXNlciB3aXRoIHRoZSBnaXZlbiBoZWFkbGluZSwgY2FsbCB0byBhY3Rpb24gYW5kIGxhYmVscyBmb3IgdGhlIGNhbmNlbC0gYW5kIG9rLWJ1dHRvblxyXG4gICAgICogVXNlIGBhd2FpdGAgb24gY2FsbCwgdG8gY29udGludWUgYWZ0ZXIgdGhlIHVzZXIgaGFzIHByZXNzZWQgb25lIG9mIHRoZSBidXR0b25zLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIHByb21wdChfZGF0YTogxpIuTXV0YWJsZSB8IMaSLk11dGF0b3IgfCBPYmplY3QsIF9tb2RhbDogYm9vbGVhbiA9IHRydWUsIF9oZWFkOiBzdHJpbmcgPSBcIkhlYWRsaW5lXCIsIF9jYWxsVG9BY3Rpb246IHN0cmluZyA9IFwiSW5zdHJ1Y3Rpb25cIiwgX29rOiBzdHJpbmcgPSBcIk9LXCIsIF9jYW5jZWw6IHN0cmluZyA9IFwiQ2FuY2VsXCIpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgRGlhbG9nLmRvbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaWFsb2dcIik7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoRGlhbG9nLmRvbSk7XHJcbiAgICAgIERpYWxvZy5kb20uaW5uZXJIVE1MID0gXCI8aDE+XCIgKyBfaGVhZCArIFwiPC9oMT5cIjtcclxuXHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgICAgaWYgKF9kYXRhIGluc3RhbmNlb2YgxpIuTXV0YWJsZSlcclxuICAgICAgICBjb250ZW50ID0gR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9kYXRhKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGNvbnRlbnQgPSBHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGF0b3IoX2RhdGEpO1xyXG4gICAgICBjb250ZW50LmlkID0gXCJjb250ZW50XCI7XHJcbiAgICAgIERpYWxvZy5kb20uYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcblxyXG4gICAgICBsZXQgZm9vdGVyOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIik7XHJcbiAgICAgIGZvb3Rlci5pbm5lckhUTUwgPSBcIjxwPlwiICsgX2NhbGxUb0FjdGlvbiArIFwiPC9wPlwiO1xyXG4gICAgICBsZXQgYnRuQ2FuY2VsOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIGJ0bkNhbmNlbC5pbm5lckhUTUwgPSBfY2FuY2VsO1xyXG4gICAgICBpZiAoX2NhbmNlbCAhPSBcIlwiKVxyXG4gICAgICAgIGZvb3Rlci5hcHBlbmRDaGlsZChidG5DYW5jZWwpO1xyXG4gICAgICBsZXQgYnRuT2s6IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnRuT2suaW5uZXJIVE1MID0gX29rO1xyXG4gICAgICBmb290ZXIuYXBwZW5kQ2hpbGQoYnRuT2spO1xyXG4gICAgICBEaWFsb2cuZG9tLmFwcGVuZENoaWxkKGZvb3Rlcik7XHJcbiAgICAgIGlmIChfbW9kYWwpXHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgRGlhbG9nLmRvbS5zaG93TW9kYWwoKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIERpYWxvZy5kb20uc2hvdygpO1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChfcmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIGxldCBobmRCdXR0b246IChfZXZlbnQ6IEV2ZW50KSA9PiB2b2lkID0gKF9ldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgIGJ0bkNhbmNlbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaG5kQnV0dG9uKTtcclxuICAgICAgICAgIGJ0bk9rLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBobmRCdXR0b24pO1xyXG4gICAgICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gYnRuT2spXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgQ29udHJvbGxlci51cGRhdGVNdXRhdG9yKGNvbnRlbnQsIF9kYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoX2UpIHtcclxuICAgICAgICAgICAgICDGki5EZWJ1Zy53YXJuKF9lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICBEaWFsb2cuZG9tLmNsb3NlKCk7XHJcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKERpYWxvZy5kb20pO1xyXG4gICAgICAgICAgX3Jlc29sdmUoX2V2ZW50LnRhcmdldCA9PSBidG5Payk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBidG5DYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DTElDSywgaG5kQnV0dG9uKTtcclxuICAgICAgICBidG5Pay5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNMSUNLLCBobmRCdXR0b24pO1xyXG4gICAgICAgIGJ0bk9rLmZvY3VzKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIDxzZWxlY3Q+PG9wdGlvbj5IYWxsbzwvb3B0aW9uPjwvc2VsZWN0PlxyXG4gICAqL1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIE11bHRpTGV2ZWxNZW51TWFuYWdlciB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBidWlsZEZyb21TaWduYXR1cmUoX3NpZ25hdHVyZTogc3RyaW5nLCBfbXV0YXRvcj86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciB8fCB7fTtcclxuICAgICAgbGV0IHNpZ25hdHVyZUxldmVsczogc3RyaW5nW10gPSBfc2lnbmF0dXJlLnNwbGl0KFwiLlwiKTtcclxuICAgICAgaWYgKHNpZ25hdHVyZUxldmVscy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgbGV0IHN1YlNpZ25hdHVyZTogc3RyaW5nID0gc2lnbmF0dXJlTGV2ZWxzWzFdO1xyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDI7IGkgPCBzaWduYXR1cmVMZXZlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHN1YlNpZ25hdHVyZSA9IHN1YlNpZ25hdHVyZSArIFwiLlwiICsgc2lnbmF0dXJlTGV2ZWxzW2ldO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICBtdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0gPSB0aGlzLmJ1aWxkRnJvbVNpZ25hdHVyZShzdWJTaWduYXR1cmUsIDzGki5NdXRhdG9yPm11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgbXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dID0gdGhpcy5idWlsZEZyb21TaWduYXR1cmUoc3ViU2lnbmF0dXJlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dID0gc2lnbmF0dXJlTGV2ZWxzWzBdO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvKipcclxuICAgKiBTdGF0aWMgY2xhc3MgdG8gZGlzcGxheSBhIG1vZGFsIHdhcm5pbmcuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFdhcm5pbmcge1xyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwbGF5IGEgd2FybmluZyB0byB0aGUgdXNlciB3aXRoIHRoZSBnaXZlbiBoZWFkbGluZSwgd2FybmluZyB0ZXh0IGFuZCBvayBidXR0ZW4gdGV4dC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBkaXNwbGF5KF9lcnJvcnM6IHN0cmluZ1tdID0gW10sIF9oZWFkbGluZTogc3RyaW5nID0gXCJIZWFkbGluZVwiLCBfd2FybmluZzogc3RyaW5nID0gXCJXYXJuaW5nXCIsIF9vazogc3RyaW5nID0gXCJPS1wiKTogdm9pZCB7XHJcbiAgICAgIGxldCB3YXJuaW5nOiBIVE1MRGlhbG9nRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaWFsb2dcIik7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQod2FybmluZyk7XHJcbiAgICAgIHdhcm5pbmcuaW5uZXJIVE1MID0gXCI8aDE+XCIgKyBfaGVhZGxpbmUgKyBcIjwvaDE+XCI7XHJcblxyXG4gICAgICBsZXQgY29udGVudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICBjb250ZW50LmlkID0gXCJjb250ZW50XCI7XHJcbiAgICAgIGNvbnRlbnQuaW5uZXJUZXh0ID0gX2Vycm9ycy5qb2luKFwiXFxuXCIpO1xyXG4gICAgICB3YXJuaW5nLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xyXG5cclxuICAgICAgbGV0IGZvb3RlcjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9vdGVyXCIpO1xyXG4gICAgICBmb290ZXIuaW5uZXJIVE1MID0gXCI8cD5cIiArIF93YXJuaW5nICsgXCI8L3A+XCI7XHJcbiAgICAgIGxldCBidG5PazogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICBidG5Pay5pbm5lckhUTUwgPSBfb2s7XHJcbiAgICAgIGJ0bk9rLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgd2FybmluZy5jbG9zZSgpO1xyXG4gICAgICAgIHdhcm5pbmcucmVtb3ZlKCk7XHJcbiAgICAgIH07XHJcbiAgICAgIGZvb3Rlci5hcHBlbmRDaGlsZChidG5Payk7XHJcbiAgICAgIHdhcm5pbmcuYXBwZW5kQ2hpbGQoZm9vdGVyKTtcclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIHdhcm5pbmcuc2hvd01vZGFsKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvLyBUT0RPOiBkdXBsaWNhdGVkIGNvZGUgaW4gVGFibGUgYW5kIFRyZWUsIG1heSBiZSBvcHRpbWl6ZWQuLi5cclxuXHJcbiAgZXhwb3J0IGludGVyZmFjZSBUQUJMRSB7XHJcbiAgICBsYWJlbDogc3RyaW5nO1xyXG4gICAga2V5OiBzdHJpbmc7XHJcbiAgICBlZGl0YWJsZTogYm9vbGVhbjtcclxuICAgIHNvcnRhYmxlOiBib29sZWFuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFuYWdlcyBhIHNvcnRhYmxlIHRhYmxlIG9mIGRhdGEgZ2l2ZW4gYXMgc2ltcGxlIGFycmF5IG9mIGZsYXQgb2JqZWN0cyAgIFxyXG4gICAqIGBgYHRleHRcclxuICAgKiBLZXkwICBLZXkxIEtleTJcclxuICAgKiBgYGBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVGFibGU8VCBleHRlbmRzIE9iamVjdD4gZXh0ZW5kcyBIVE1MVGFibGVFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUYWJsZUNvbnRyb2xsZXI8VD47XHJcbiAgICBwdWJsaWMgZGF0YTogVFtdO1xyXG4gICAgcHVibGljIGF0dEljb246IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPiwgX2RhdGE6IFRbXSwgX2F0dEljb24/OiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICB0aGlzLmF0dEljb24gPSBfYXR0SWNvbjtcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInNvcnRhYmxlXCI7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU09SVCwgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRTb3J0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlNFTEVDVCwgdGhpcy5obmRTZWxlY3QpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU0VMRUNUX0FMTCwgdGhpcy5zZWxlY3RBbGwpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfTkVYVCwgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgPEV2ZW50TGlzdGVuZXI+dGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5FU0NBUEUsIHRoaXMuaG5kRXNjYXBlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNPUFksIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNVVCwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUEFTVEUsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSB0aGUgdGFibGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICBsZXQgaGVhZDogVEFCTEVbXSA9IHRoaXMuY29udHJvbGxlci5nZXRIZWFkKCk7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSGVhZChoZWFkKSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIHRoaXMuZGF0YSkge1xyXG4gICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgZGF0YSwgdGhpcy5hdHRJY29uKTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG9iamVjdCBpbiBmb2N1c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Rm9jdXNzZWQoKTogVCB7XHJcbiAgICAgIGxldCBpdGVtczogVGFibGVJdGVtPFQ+W10gPSA8VGFibGVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSk7XHJcbiAgICAgIGxldCBmb3VuZDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZig8VGFibGVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICBpZiAoZm91bmQgPiAtMSlcclxuICAgICAgICByZXR1cm4gaXRlbXNbZm91bmRdLmRhdGE7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0QWxsKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnNlbGVjdEludGVydmFsKHRoaXMuZGF0YVswXSwgdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGgtMV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RJbnRlcnZhbChfZGF0YVN0YXJ0OiBULCBfZGF0YUVuZDogVCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIik7XHJcbiAgICAgIGxldCBzZWxlY3Rpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgbGV0IGVuZDogVCA9IG51bGw7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGluZykge1xyXG4gICAgICAgICAgc2VsZWN0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgIGlmIChpdGVtLmRhdGEgPT0gX2RhdGFTdGFydClcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFFbmQ7XHJcbiAgICAgICAgICBlbHNlIGlmIChpdGVtLmRhdGEgPT0gX2RhdGFFbmQpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhU3RhcnQ7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNlbGVjdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBpdGVtLnNlbGVjdCh0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgICBpZiAoaXRlbS5kYXRhID09IGVuZClcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BsYXlTZWxlY3Rpb24oX2RhdGE6IFRbXSk6IHZvaWQge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfZGF0YSk7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpdGVtLnNlbGVjdGVkID0gKF9kYXRhICE9IG51bGwgJiYgX2RhdGEuaW5kZXhPZihpdGVtLmRhdGEpID4gLTEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlSGVhZChfaGVhZEluZm86IFRBQkxFW10pOiBIVE1MVGFibGVSb3dFbGVtZW50IHtcclxuICAgICAgbGV0IHRyOiBIVE1MVGFibGVSb3dFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBfaGVhZEluZm8pIHtcclxuICAgICAgICBsZXQgdGg6IEhUTUxUYWJsZUNlbGxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRoXCIpO1xyXG4gICAgICAgIHRoLnRleHRDb250ZW50ID0gZW50cnkubGFiZWw7XHJcbiAgICAgICAgdGguc2V0QXR0cmlidXRlKFwia2V5XCIsIGVudHJ5LmtleSk7XHJcblxyXG4gICAgICAgIGlmIChlbnRyeS5zb3J0YWJsZSkge1xyXG4gICAgICAgICAgdGguYXBwZW5kQ2hpbGQodGhpcy5nZXRTb3J0QnV0dG9ucygpKTtcclxuICAgICAgICAgIHRoLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICAgIEVWRU5ULkNIQU5HRSxcclxuICAgICAgICAgICAgKF9ldmVudDogRXZlbnQpID0+IHRoLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNPUlQsIHsgZGV0YWlsOiBfZXZlbnQudGFyZ2V0LCBidWJibGVzOiB0cnVlIH0pKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdHIuYXBwZW5kQ2hpbGQodGgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0cjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFNvcnRCdXR0b25zKCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgbGV0IHJlc3VsdDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgZm9yIChsZXQgZGlyZWN0aW9uIG9mIFtcInVwXCIsIFwiZG93blwiXSkge1xyXG4gICAgICAgIGxldCBidXR0b246IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgYnV0dG9uLnR5cGUgPSBcInJhZGlvXCI7XHJcbiAgICAgICAgYnV0dG9uLm5hbWUgPSBcInNvcnRcIjtcclxuICAgICAgICBidXR0b24udmFsdWUgPSBkaXJlY3Rpb247XHJcbiAgICAgICAgcmVzdWx0LmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFNvcnQoX2V2ZW50OiBDdXN0b21FdmVudCk6IHZvaWQge1xyXG4gICAgICBsZXQgdmFsdWU6IHN0cmluZyA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQuZGV0YWlsKS52YWx1ZTtcclxuICAgICAgbGV0IGtleTogc3RyaW5nID0gKDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIGxldCBkaXJlY3Rpb246IG51bWJlciA9ICh2YWx1ZSA9PSBcInVwXCIpID8gMSA6IC0xO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc29ydCh0aGlzLmRhdGEsIGtleSwgZGlyZWN0aW9uKTtcclxuICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFNlbGVjdChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRldGFpbDogeyBkYXRhOiBPYmplY3Q7IGludGVydmFsOiBib29sZWFuOyBhZGRpdGl2ZTogYm9vbGVhbiB9ID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmluZGV4T2YoPFQ+ZGV0YWlsLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGRldGFpbC5pbnRlcnZhbCkge1xyXG4gICAgICAgIGxldCBkYXRhU3RhcnQ6IFQgPSA8VD50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uWzBdO1xyXG4gICAgICAgIGxldCBkYXRhRW5kOiBUID0gPFQ+ZGV0YWlsLmRhdGE7XHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoZGF0YVN0YXJ0LCBkYXRhRW5kKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24ucHVzaCg8VD5kZXRhaWwuZGF0YSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbig8VFtdPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRGVsZXRlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogVGFibGVJdGVtPFQ+ID0gPFRhYmxlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBkZWxldGVkOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKFt0YXJnZXQuZGF0YV0pO1xyXG4gICAgICBpZiAoZGVsZXRlZC5sZW5ndGgpXHJcbiAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IENsaXBib2FyZEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKF9ldmVudCk7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LnR5cGUpIHtcclxuICAgICAgICBjYXNlIEVWRU5ULkNPUFk6XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuY29weSh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ1VUOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgbGV0IGN1dDogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmN1dCh0aGlzLmdldEZvY3Vzc2VkKCksIF9ldmVudC50eXBlKTtcclxuICAgICAgICAgIGlmIChjdXQubGVuZ3RoKVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlJFTU9WRV9DSElMRCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuUEFTVEU6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBsZXQgb2JqZWN0czogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLnBhc3RlKCk7XHJcbiAgICAgICAgICBmb3IgKGxldCBvYmplY3Qgb2Ygb2JqZWN0cykge1xyXG4gICAgICAgICAgICBsZXQgaXRlbTogVGFibGVJdGVtPFQ+ID0gbmV3IFRhYmxlSXRlbTxUPih0aGlzLmNvbnRyb2xsZXIsIG9iamVjdCwgdGhpcy5hdHRJY29uKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlBBU1RFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnRHJvcCA9IGFzeW5jIChfZXZlbnQ6IERyYWdFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgaXRlbTogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+UmVmbGVjdC5nZXQoX2V2ZW50LCBcIml0ZW1cIik7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJBR19TVEFSVDpcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9IFwiYWxsXCI7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ1N0YXJ0KGl0ZW0uZGF0YSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkRSQUdfT1ZFUjpcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IHRoaXMuY29udHJvbGxlci5kcmFnT3ZlcihfZXZlbnQpO1xyXG4gICAgICAgICAgLy8gX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkRST1A6XHJcbiAgICAgICAgICBsZXQgb2JqZWN0czogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRyb3AoX2V2ZW50KTtcclxuICAgICAgICAgIGZvciAobGV0IG9iamVjdCBvZiBvYmplY3RzKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgb2JqZWN0LCB0aGlzLmF0dEljb24pO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IFRhYmxlSXRlbTxUPltdID0gPFRhYmxlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwidHJcIikpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBUYWJsZUl0ZW08VD4gPSA8VGFibGVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGxldCBpbmRleDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZih0YXJnZXQpO1xyXG4gICAgICBpZiAoaW5kZXggPCAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkgJiYgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5sZW5ndGggPT0gMClcclxuICAgICAgICB0YXJnZXQuc2VsZWN0KHRydWUpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfTkVYVDpcclxuICAgICAgICAgIGlmICgrK2luZGV4IDwgaXRlbXMubGVuZ3RoKVxyXG4gICAgICAgICAgICBpdGVtc1tpbmRleF0uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfUFJFVklPVVM6XHJcbiAgICAgICAgICBpZiAoLS1pbmRleCA+PSAwKVxyXG4gICAgICAgICAgICBpdGVtc1tpbmRleF0uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICAoPFRyZWVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLnNlbGVjdCh0cnVlKTtcclxuICAgICAgZWxzZSBpZiAoIV9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ0YWJsZS1zb3J0YWJsZVwiLCBUYWJsZSwgeyBleHRlbmRzOiBcInRhYmxlXCIgfSk7XHJcbn1cclxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vRGF0YUNvbnRyb2xsZXIudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIFN1YmNsYXNzIHRoaXMgdG8gY3JlYXRlIGEgYnJva2VyIGJldHdlZW4geW91ciBkYXRhIGFuZCBhIFtbVGFibGVdXSB0byBkaXNwbGF5IGFuZCBtYW5pcHVsYXRlIGl0LlxyXG4gICAqIFRoZSBbW1RhYmxlXV0gZG9lc24ndCBrbm93IGhvdyB5b3VyIGRhdGEgaXMgc3RydWN0dXJlZCBhbmQgaG93IHRvIGhhbmRsZSBpdCwgdGhlIGNvbnRyb2xsZXIgaW1wbGVtZW50cyB0aGUgbWV0aG9kcyBuZWVkZWRcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgVGFibGVDb250cm9sbGVyPFQ+IGV4dGVuZHMgRGF0YUNvbnRyb2xsZXI8VD4ge1xyXG4gICAgXHJcbiAgICAvKiogUmV0cmlldmUgYSBzdHJpbmcgdG8gY3JlYXRlIGEgbGFiZWwgZm9yIHRoZSB0YWJsZSBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IChhcHBlYXJzIG5vdCB0byBiZSBjYWxsZWQgeWV0KSAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRMYWJlbChfb2JqZWN0OiBUKTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBSZXR1cm4gZmFsc2UgaWYgcmVuYW1pbmcgb2Ygb2JqZWN0IGlzIG5vdCBwb3NzaWJpbGUsIG9yIHRydWUgaWYgdGhlIG9iamVjdCB3YXMgcmVuYW1lZCAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHJlbmFtZShfb2JqZWN0OiBULCBfbmV3OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+O1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHVybiBhIGxpc3Qgb2YgVEFCTEUtb2JqZWN0cyBkZXNjcmliaW5nIHRoZSBoZWFkLXRpdGxlcyBhbmQgYWNjb3JkaW5nIHByb3BlcnRpZXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldEhlYWQoKTogVEFCTEVbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNvcnQgZGF0YSBieSBnaXZlbiBrZXkgYW5kIGRpcmVjdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc29ydChfZGF0YTogVFtdLCBfa2V5OiBzdHJpbmcsIF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQ7XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgdHItZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgYW4gb2JqZWN0IGluIGEgW1tUYWJsZV1dXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRhYmxlSXRlbTxUIGV4dGVuZHMgT2JqZWN0PiBleHRlbmRzIEhUTUxUYWJsZVJvd0VsZW1lbnQge1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPiwgX2RhdGE6IFQsIF9hdHRJY29uOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICAvLyB0aGlzLmRpc3BsYXkgPSB0aGlzLmNvbnRyb2xsZXIuZ2V0TGFiZWwoX2RhdGEpO1xyXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgY3NzQ2xhc3Nlc1xyXG4gICAgICB0aGlzLmNyZWF0ZSh0aGlzLmNvbnRyb2xsZXIuZ2V0SGVhZCgpLCBfYXR0SWNvbik7XHJcbiAgICAgIHRoaXMuY2xhc3NOYW1lID0gXCJ0YWJsZVwiO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlBPSU5URVJfVVAsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuXHJcbiAgICAgIHRoaXMuZHJhZ2dhYmxlID0gdHJ1ZTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRST1AsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG5cclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlVQREFURSwgdGhpcy5obmRVcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhdHRhY2hlcyBvciBkZXRhY2hlcyB0aGUgW1tDU1NfQ0xBU1MuU0VMRUNURURdXSB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCBzZWxlY3RlZChfb246IGJvb2xlYW4pIHtcclxuICAgICAgaWYgKF9vbilcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBbW1RSRUVfQ0xBU1NFUy5TRUxFQ1RFRF1dIGlzIGF0dGFjaGVkIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERpc3BhdGNoZXMgdGhlIFtbRVZFTlQuU0VMRUNUXV0gZXZlbnRcclxuICAgICAqIEBwYXJhbSBfYWRkaXRpdmUgRm9yIG11bHRpcGxlIHNlbGVjdGlvbiAoK0N0cmwpIFxyXG4gICAgICogQHBhcmFtIF9pbnRlcnZhbCBGb3Igc2VsZWN0aW9uIG92ZXIgaW50ZXJ2YWwgKCtTaGlmdClcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNlbGVjdChfYWRkaXRpdmU6IGJvb2xlYW4sIF9pbnRlcnZhbDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIGxldCBldmVudDogQ3VzdG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEsIGFkZGl0aXZlOiBfYWRkaXRpdmUsIGludGVydmFsOiBfaW50ZXJ2YWwgfSB9KTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZShfZmlsdGVyOiBUQUJMRVtdLCBfYXR0SWNvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIF9maWx0ZXIpIHtcclxuICAgICAgICBsZXQgdmFsdWU6IHN0cmluZyA9IDxzdHJpbmc+UmVmbGVjdC5nZXQodGhpcy5kYXRhLCBlbnRyeS5rZXkpO1xyXG4gICAgICAgIGxldCBpY29uOiBzdHJpbmcgPSA8c3RyaW5nPlJlZmxlY3QuZ2V0KHRoaXMuZGF0YSwgX2F0dEljb24pO1xyXG4gICAgICAgIGxldCB0ZDogSFRNTFRhYmxlQ2VsbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XHJcbiAgICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGlucHV0LnR5cGUgPSBcInRleHRcIjtcclxuICAgICAgICBpbnB1dC5kaXNhYmxlZCA9ICFlbnRyeS5lZGl0YWJsZTtcclxuICAgICAgICBpbnB1dC5yZWFkT25seSA9IHRydWU7XHJcbiAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgZW50cnkua2V5KTtcclxuXHJcbiAgICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRJbnB1dEV2ZW50KTtcclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRPVUJMRV9DTElDSywgdGhpcy5obmRJbnB1dEV2ZW50KTtcclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX09VVCwgdGhpcy5obmRDaGFuZ2UpO1xyXG5cclxuICAgICAgICB0ZC5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0ZCk7XHJcbiAgICAgICAgaWYgKGljb24pXHJcbiAgICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImljb25cIiwgaWNvbik7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnB1dEV2ZW50ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCB8IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQgJiYgX2V2ZW50LmNvZGUgIT0gxpIuS0VZQk9BUkRfQ09ERS5GMilcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSA8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBpbnB1dC5yZWFkT25seSA9IGZhbHNlO1xyXG4gICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENoYW5nZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIHRhcmdldC5yZWFkT25seSA9IHRydWU7XHJcbiAgICAgIC8vIGxldCBrZXk6IHN0cmluZyA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIC8vIGxldCBwcmV2aW91c1ZhbHVlOiDGki5HZW5lcmFsID0gUmVmbGVjdC5nZXQodGhpcy5kYXRhLCBrZXkpO1xyXG5cclxuICAgICAgaWYgKGF3YWl0IHRoaXMuY29udHJvbGxlci5yZW5hbWUodGhpcy5kYXRhLCB0YXJnZXQudmFsdWUpKSB7XHJcbiAgICAgICAgLy8gUmVmbGVjdC5zZXQodGhpcy5kYXRhLCBrZXksIHRhcmdldC52YWx1ZSk7IC8vIHdoeSBzaG91bGRuJ3QgdGhlIGNvbnRyb2xsZXIgZG8gdGhpcz9cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIkRpc3BhdGNoIFJlbmFtZVwiKTtcclxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEgfSB9KSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCAhPSB0aGlzKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHN3aXRjaCAoX2V2ZW50LmNvZGUpIHtcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19QUkVWSU9VUywgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVTQ0FQRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5DOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNPUFksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuVjpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5YOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0Ryb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gc3RvcmUgdGhlIGRyYWdnZWQgaXRlbSBpbiB0aGUgZXZlbnQgZm9yIGZ1cnRoZXIgcHJvY2Vzc2luZyBpbiB0YWJsZVxyXG4gICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiaXRlbVwiLCB0aGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgIHRoaXMuc2VsZWN0KF9ldmVudC5jdHJsS2V5LCBfZXZlbnQuc2hpZnRLZXkpO1xyXG4gICAgfTtcclxuICB9XHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidGFibGUtaXRlbVwiLCA8Q3VzdG9tRWxlbWVudENvbnN0cnVjdG9yPjx1bmtub3duPlRhYmxlSXRlbSwgeyBleHRlbmRzOiBcInRyXCIgfSk7XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5zaW9uIG9mIHVsLWVsZW1lbnQgdGhhdCBrZWVwcyBhIGxpc3Qgb2Yge0BsaW5rIFRyZWVJdGVtfXMgdG8gcmVwcmVzZW50IGEgYnJhbmNoIGluIGEgdHJlZVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmVlTGlzdDxUPiBleHRlbmRzIEhUTUxVTGlzdEVsZW1lbnQge1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD4sIF9pdGVtczogVHJlZUl0ZW08VD5bXSA9IFtdKSB7XHJcbiAgICAgIHN1cGVyKCk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlciA9IF9jb250cm9sbGVyO1xyXG4gICAgICB0aGlzLmFkZEl0ZW1zKF9pdGVtcyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInRyZWVcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4cGFuZHMgdGhlIHRyZWUgYWxvbmcgdGhlIGdpdmVuIHBhdGhzIHRvIHNob3cgdGhlIG9iamVjdHMgdGhlIHBhdGhzIGluY2x1ZGUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBleHBhbmQoX3BhdGhzOiBUW11bXSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBwYXRoIG9mIF9wYXRocylcclxuICAgICAgICB0aGlzLnNob3cocGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFeHBhbmRzIHRoZSB0cmVlIGFsb25nIHRoZSBnaXZlbiBwYXRoIHRvIHNob3cgdGhlIG9iamVjdHMgdGhlIHBhdGggaW5jbHVkZXMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93KF9wYXRoOiBUW10pOiB2b2lkIHtcclxuICAgICAgbGV0IGN1cnJlbnRUcmVlOiBUcmVlTGlzdDxUPiA9IHRoaXM7XHJcblxyXG4gICAgICBmb3IgKGxldCBkYXRhIG9mIF9wYXRoKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gY3VycmVudFRyZWUuZmluZEl0ZW0oZGF0YSk7XHJcbiAgICAgICAgaWYgKCFpdGVtKVxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGlmICghaXRlbS5leHBhbmRlZClcclxuICAgICAgICAgIGl0ZW0uZXhwYW5kKHRydWUpO1xyXG5cclxuICAgICAgICBjdXJyZW50VHJlZSA9IGl0ZW0uZ2V0QnJhbmNoKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc3RydWN0dXJlcyB0aGUgbGlzdCB0byBzeW5jIHdpdGggdGhlIGdpdmVuIGxpc3QuIFxyXG4gICAgICoge0BsaW5rIFRyZWVJdGVtfXMgcmVmZXJlbmNpbmcgdGhlIHNhbWUgb2JqZWN0IHJlbWFpbiBpbiB0aGUgbGlzdCwgbmV3IGl0ZW1zIGdldCBhZGRlZCBpbiB0aGUgb3JkZXIgb2YgYXBwZWFyYW5jZSwgb2Jzb2xldGUgb25lcyBhcmUgZGVsZXRlZC5cclxuICAgICAqIEBwYXJhbSBfdHJlZSBBIGxpc3QgdG8gc3luYyB0aGlzIHdpdGhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc3RydWN0dXJlKF90cmVlOiBUcmVlTGlzdDxUPik6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBfdHJlZS5nZXRJdGVtcygpKSB7XHJcbiAgICAgICAgbGV0IGZvdW5kOiBUcmVlSXRlbTxUPiA9IHRoaXMuZmluZEl0ZW0oaXRlbS5kYXRhKTtcclxuICAgICAgICBpZiAoZm91bmQpIHtcclxuICAgICAgICAgIGZvdW5kLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgICAgICBmb3VuZC5oYXNDaGlsZHJlbiA9IGl0ZW0uaGFzQ2hpbGRyZW47XHJcbiAgICAgICAgICBpZiAoIWZvdW5kLmhhc0NoaWxkcmVuKVxyXG4gICAgICAgICAgICBmb3VuZC5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgaXRlbXMucHVzaChmb3VuZCk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHRoaXMuYWRkSXRlbXMoaXRlbXMpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24odGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgVHJlZUl0ZW19IG9mIHRoaXMgbGlzdCByZWZlcmVuY2luZyB0aGUgZ2l2ZW4gb2JqZWN0IG9yIG51bGwsIGlmIG5vdCBmb3VuZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZmluZEl0ZW0oX2RhdGE6IFQpOiBUcmVlSXRlbTxUPiB7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5jaGlsZHJlbilcclxuICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscygoPFRyZWVJdGVtPFQ+Pml0ZW0pLmRhdGEsIF9kYXRhKSlcclxuICAgICAgICAgIHJldHVybiA8VHJlZUl0ZW08VD4+aXRlbTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkcyB0aGUgZ2l2ZW4ge0BsaW5rIFRyZWVJdGVtfXMgYXQgdGhlIGVuZCBvZiB0aGlzIGxpc3RcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEl0ZW1zKF9pdGVtczogVHJlZUl0ZW08VD5bXSk6IHZvaWQge1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF9pdGVtcykge1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgb2YgdGhpcyBsaXN0IGFzIGFycmF5IG9mIHtAbGluayBUcmVlSXRlbX1zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRJdGVtcygpOiBUcmVlSXRlbTxUPltdIHtcclxuICAgICAgcmV0dXJuIDxUcmVlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5jaGlsZHJlbikuZmlsdGVyKF9jaGlsZCA9PiBfY2hpbGQgaW5zdGFuY2VvZiBUcmVlSXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc3BsYXlTZWxlY3Rpb24oX2RhdGE6IFRbXSk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSAoX2RhdGEgIT0gbnVsbCAmJiBfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdEludGVydmFsKF9kYXRhU3RhcnQ6IFQsIF9kYXRhRW5kOiBUKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBzZWxlY3Rpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgbGV0IGVuZDogVCA9IG51bGw7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpIHtcclxuICAgICAgICBpZiAoIXNlbGVjdGluZykge1xyXG4gICAgICAgICAgc2VsZWN0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgX2RhdGFTdGFydCkpXHJcbiAgICAgICAgICAgIGVuZCA9IF9kYXRhRW5kO1xyXG4gICAgICAgICAgZWxzZSBpZiAodGhpcy5jb250cm9sbGVyLmVxdWFscyhpdGVtLmRhdGEsIF9kYXRhRW5kKSlcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFTdGFydDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIGl0ZW0uc2VsZWN0KHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgZW5kKSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2VsZWN0QWxsKCk6IHZvaWQge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICB0aGlzLnNlbGVjdEludGVydmFsKGl0ZW1zWzBdLmRhdGEsIGl0ZW1zW2l0ZW1zLmxlbmd0aCAtIDFdLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWxldGUoX2RhdGE6IFRbXSk6IFRyZWVJdGVtPFQ+W10ge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgZGVsZXRlZDogVHJlZUl0ZW08VD5bXSA9IFtdO1xyXG5cclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcylcclxuICAgICAgICBpZiAoX2RhdGEuaW5kZXhPZihpdGVtLmRhdGEpID4gLTEpIHtcclxuICAgICAgICAgIGl0ZW0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUkVNT1ZFX0NISUxELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgZGVsZXRlZC5wdXNoKGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpdGVtKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGRlbGV0ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZpbmRWaXNpYmxlKF9kYXRhOiBUKTogVHJlZUl0ZW08VD4ge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKF9kYXRhLCBpdGVtLmRhdGEpKVxyXG4gICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhbGwgZXhwYW5kZWQge0BsaW5rIFRyZWVJdGVtfXMgdGhhdCBhcmUgYSBkZXNjZW5kYW50IG9mIHRoaXMgbGlzdC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEV4cGFuZGVkKCk6IFRyZWVJdGVtPFQ+W10ge1xyXG4gICAgICByZXR1cm4gWy4uLnRoaXNdLmZpbHRlcihfaXRlbSA9PiBfaXRlbS5leHBhbmRlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICpbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYXRvcjxUcmVlSXRlbTxUPj4ge1xyXG4gICAgICBsZXQgaXRlbXM6IE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VHJlZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgeWllbGQgaXRlbXNbaV07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChSZWZsZWN0LmhhcyhfZXZlbnQsIFwiaW5kZXhcIikpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IHRhcmdldDogVCA9ICg8VHJlZUl0ZW08VD4+dGhpcy5wYXJlbnRFbGVtZW50KS5kYXRhO1xyXG4gICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiaW5kZXhcIiwgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLmlzQ29ubmVjdGVkID9cclxuICAgICAgICBBcnJheS5mcm9tKHRoaXMuY2hpbGRyZW4pLmluZGV4T2YodGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKSA6XHJcbiAgICAgICAgbnVsbCk7XHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJwYXJlbnRcIiwgdGFyZ2V0KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnT3ZlciA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoUmVmbGVjdC5nZXQoX2V2ZW50LCBcImRyYWdQcm9jZXNzZWRcIikpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgUmVmbGVjdC5zZXQoX2V2ZW50LCBcImRyYWdQcm9jZXNzZWRcIiwgdHJ1ZSk7XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0OiBUID0gKDxUcmVlSXRlbTxUPj50aGlzLnBhcmVudEVsZW1lbnQpLmRhdGE7XHJcbiAgICAgIGlmICh0YXJnZXQgPT0gbnVsbCB8fCAhdGhpcy5jb250cm9sbGVyLmNhbkFkZENoaWxkcmVuKENsaXBib2FyZC5kcmFnRHJvcC5nZXQoKSwgdGFyZ2V0KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzKVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5yZW1vdmUoKTtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IHRhcmdldEl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC5jb21wb3NlZFBhdGgoKS5maW5kKF90YXJnZXQgPT4gX3RhcmdldCBpbnN0YW5jZW9mIFRyZWVJdGVtKTtcclxuICAgICAgICBpZiAodGhpcy5nZXRJdGVtcygpLmluY2x1ZGVzKHRhcmdldEl0ZW0pKSB7XHJcbiAgICAgICAgICBsZXQgcmVjdDogRE9NUmVjdCA9IHRhcmdldEl0ZW0uY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgIGxldCBhZGRCZWZvcmU6IGJvb2xlYW4gPSBfZXZlbnQuY2xpZW50WSA8IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgbGV0IHNpYmxpbmc6IEVsZW1lbnQgPSBhZGRCZWZvcmUgPyB0YXJnZXRJdGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgOiB0YXJnZXRJdGVtLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmIChzaWJsaW5nICE9IHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcilcclxuICAgICAgICAgICAgaWYgKGFkZEJlZm9yZSlcclxuICAgICAgICAgICAgICB0YXJnZXRJdGVtLmJlZm9yZSh0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgdGFyZ2V0SXRlbS5hZnRlcih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVsLXRyZWUtbGlzdFwiLCBUcmVlTGlzdCwgeyBleHRlbmRzOiBcInVsXCIgfSk7XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJUcmVlTGlzdC50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIFxyXG4gIGV4cG9ydCBlbnVtIENTU19DTEFTUyB7XHJcbiAgICBTRUxFQ1RFRCA9IFwic2VsZWN0ZWRcIixcclxuICAgIElOQUNUSVZFID0gXCJpbmFjdGl2ZVwiXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2Yge0BsaW5rIFRyZWVMaXN0fSB0aGF0IHJlcHJlc2VudHMgdGhlIHJvb3Qgb2YgYSB0cmVlIGNvbnRyb2wgIFxyXG4gICAqIGBgYHRleHRcclxuICAgKiB0cmVlIDx1bD5cclxuICAgKiDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSCIOKUlCB0cmVlTGlzdCA8dWw+XHJcbiAgICog4pSCICAg4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilIIgICDilJQgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUlCB0cmVlSXRlbSA8bGk+XHJcbiAgICogYGBgXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRyZWU8VD4gZXh0ZW5kcyBUcmVlTGlzdDxUPiB7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBUcmVlQ29udHJvbGxlcjxUPiwgX3Jvb3Q6IFQpIHtcclxuICAgICAgc3VwZXIoX2NvbnRyb2xsZXIsIFtdKTtcclxuICAgICAgbGV0IHJvb3Q6IFRyZWVJdGVtPFQ+ID0gbmV3IFRyZWVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgX3Jvb3QpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHJvb3QpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkVYUEFORCwgdGhpcy5obmRFeHBhbmQpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU0VMRUNULCB0aGlzLmhuZFNlbGVjdCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5ERUxFVEUsIHRoaXMuaG5kRGVsZXRlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkVTQ0FQRSwgdGhpcy5obmRFc2NhcGUpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNPUFksIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlBBU1RFLCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DVVQsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfTEVBVkUsIHRoaXMuaG5kRHJhZ0xlYXZlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuXHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX05FWFQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19QUkVWSU9VUywgdGhpcy5obmRGb2N1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY3VycmVudCBzZWxlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnNwbGljZSgwKTtcclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIG9iamVjdCBpbiBmb2N1cyBvciBudWxsIGlmIG5vbmUgaXMgZm9jdXNzZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEZvY3Vzc2VkKCk6IFQge1xyXG4gICAgICBsZXQgaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSA8VHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IGZvdW5kOiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKDxUcmVlSXRlbTxUPj5kb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcclxuICAgICAgaWYgKGZvdW5kID4gLTEpXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zW2ZvdW5kXS5kYXRhO1xyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWZyZXNoIHRoZSB3aG9sZSB0cmVlIHRvIHN5bmNocm9uaXplIHdpdGggdGhlIGRhdGEgdGhlIHRyZWUgaXMgYmFzZWQgb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzKSB7XHJcbiAgICAgICAgaWYgKCFpdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2godGhpcy5jb250cm9sbGVyLmdldENoaWxkcmVuKGl0ZW0uZGF0YSkpO1xyXG4gICAgICAgIGl0ZW0uZ2V0QnJhbmNoKCkucmVzdHJ1Y3R1cmUoYnJhbmNoKTtcclxuICAgICAgICBpZiAoIXRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbihpdGVtLmRhdGEpKVxyXG4gICAgICAgICAgaXRlbS5leHBhbmQoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBnaXZlbiBjaGlsZHJlbiB0byB0aGUgZ2l2ZW4gdGFyZ2V0IGF0IHRoZSBnaXZlbiBpbmRleC4gSWYgbm8gaW5kZXggaXMgZ2l2ZW4sIHRoZSBjaGlsZHJlbiBhcmUgYXBwZW5kZWQgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZENoaWxkcmVuKF9jaGlsZHJlbjogVFtdLCBfdGFyZ2V0OiBULCBfaW5kZXg/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgLy8gaWYgZHJvcCB0YXJnZXQgaW5jbHVkZWQgaW4gY2hpbGRyZW4gLT4gcmVmdXNlXHJcbiAgICAgIGlmIChfY2hpbGRyZW4uaW5kZXhPZihfdGFyZ2V0KSA+IC0xKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIC8vIGFkZCBvbmx5IHRoZSBvYmplY3RzIHRoZSBhZGRDaGlsZHJlbi1tZXRob2Qgb2YgdGhlIGNvbnRyb2xsZXIgcmV0dXJuc1xyXG4gICAgICBsZXQgbW92ZTogVFtdID0gdGhpcy5jb250cm9sbGVyLmFkZENoaWxkcmVuKF9jaGlsZHJlbiwgX3RhcmdldCwgX2luZGV4KTtcclxuICAgICAgaWYgKCFtb3ZlIHx8IG1vdmUubGVuZ3RoID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGZvY3VzOiBUID0gdGhpcy5nZXRGb2N1c3NlZCgpO1xyXG4gICAgICAvLyBUT0RPOiBkb24ndCwgd2hlbiBjb3B5aW5nIG9yIGNvbWluZyBmcm9tIGFub3RoZXIgc291cmNlXHJcbiAgICAgIHRoaXMuZGVsZXRlKG1vdmUpO1xyXG5cclxuICAgICAgbGV0IHRhcmdldERhdGE6IFQgPSA8VD5fdGFyZ2V0O1xyXG4gICAgICBsZXQgdGFyZ2V0SXRlbTogVHJlZUl0ZW08VD4gPSB0aGlzLmZpbmRWaXNpYmxlKHRhcmdldERhdGEpO1xyXG5cclxuICAgICAgbGV0IGJyYW5jaDogVHJlZUxpc3Q8VD4gPSB0aGlzLmNyZWF0ZUJyYW5jaCh0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hpbGRyZW4odGFyZ2V0RGF0YSkpO1xyXG4gICAgICBsZXQgb2xkOiBUcmVlTGlzdDxUPiA9IHRhcmdldEl0ZW0uZ2V0QnJhbmNoKCk7XHJcbiAgICAgIHRhcmdldEl0ZW0uaGFzQ2hpbGRyZW4gPSB0cnVlO1xyXG4gICAgICBpZiAob2xkKVxyXG4gICAgICAgIG9sZC5yZXN0cnVjdHVyZShicmFuY2gpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGFyZ2V0SXRlbS5leHBhbmQodHJ1ZSk7XHJcblxyXG4gICAgICB0aGlzLmZpbmRWaXNpYmxlKGZvY3VzKT8uZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEV4cGFuZChfZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBsZXQgY2hpbGRyZW46IHJlYWRvbmx5IFRbXSA9IHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbihpdGVtLmRhdGEpO1xyXG4gICAgICBpZiAoIWNoaWxkcmVuIHx8IGNoaWxkcmVuLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBicmFuY2g6IFRyZWVMaXN0PFQ+ID0gdGhpcy5jcmVhdGVCcmFuY2goY2hpbGRyZW4pO1xyXG4gICAgICBpdGVtLnNldEJyYW5jaChicmFuY2gpO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24odGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVCcmFuY2goX2RhdGE6IHJlYWRvbmx5IFRbXSk6IFRyZWVMaXN0PFQ+IHtcclxuICAgICAgbGV0IGJyYW5jaDogVHJlZUxpc3Q8VD4gPSBuZXcgVHJlZUxpc3Q8VD4odGhpcy5jb250cm9sbGVyLCBbXSk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIF9kYXRhKSB7XHJcbiAgICAgICAgYnJhbmNoLmFkZEl0ZW1zKFtuZXcgVHJlZUl0ZW0odGhpcy5jb250cm9sbGVyLCBjaGlsZCldKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYnJhbmNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbGxiYWNrIC8gRXZlbnRoYW5kbGVyIGluIFRyZWVcclxuICAgIHByaXZhdGUgaG5kU2VsZWN0KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgZGV0YWlsOiB7IGRhdGE6IE9iamVjdDsgaW50ZXJ2YWw6IGJvb2xlYW47IGFkZGl0aXZlOiBib29sZWFuIH0gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsO1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uaW5kZXhPZig8VD5kZXRhaWwuZGF0YSk7XHJcblxyXG4gICAgICBpZiAoZGV0YWlsLmludGVydmFsKSB7XHJcbiAgICAgICAgbGV0IGRhdGFTdGFydDogVCA9IDxUPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25bMF07XHJcbiAgICAgICAgbGV0IGRhdGFFbmQ6IFQgPSA8VD5kZXRhaWwuZGF0YTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RJbnRlcnZhbChkYXRhU3RhcnQsIGRhdGFFbmQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGluZGV4ID49IDAgJiYgZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKCFkZXRhaWwuYWRkaXRpdmUpXHJcbiAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5wdXNoKDxUPmRldGFpbC5kYXRhKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnRHJvcCA9IGFzeW5jIChfZXZlbnQ6IERyYWdFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgaXRlbTogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+UmVmbGVjdC5nZXQoX2V2ZW50LCBcIml0ZW1cIik7XHJcbiAgICAgIC8vIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJBR19TVEFSVDpcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9IFwiYWxsXCI7XHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ1N0YXJ0KGl0ZW0uZGF0YSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkRSQUdfT1ZFUjpcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IHRoaXMuY29udHJvbGxlci5kcmFnT3ZlcihfZXZlbnQpO1xyXG4gICAgICAgICAgLy8gX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkRST1A6XHJcbiAgICAgICAgICBsZXQgb2JqZWN0czogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRyb3AoX2V2ZW50KTtcclxuICAgICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gUmVmbGVjdC5nZXQoX2V2ZW50LCBcImluZGV4XCIpO1xyXG4gICAgICAgICAgbGV0IHBhcmVudDogVCA9IFJlZmxlY3QuZ2V0KF9ldmVudCwgXCJwYXJlbnRcIik7XHJcbiAgICAgICAgICB0aGlzLmFkZENoaWxkcmVuKG9iamVjdHMsIGluZGV4ID09IG51bGwgPyBpdGVtLmRhdGEgOiBwYXJlbnQsIGluZGV4KTtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5yZW1vdmUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0xlYXZlID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCByZWxhdGVkVGFyZ2V0OiBFdmVudFRhcmdldCA9IF9ldmVudC5yZWxhdGVkVGFyZ2V0O1xyXG4gICAgICBpZiAocmVsYXRlZFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50ICYmICF0aGlzLmNvbnRhaW5zKHJlbGF0ZWRUYXJnZXQpICYmICF0aGlzLmNvbnRhaW5zKHJlbGF0ZWRUYXJnZXQub2Zmc2V0UGFyZW50KSkgLy8gb2Zmc2V0IHBhcmVudCBpcyBmb3Igd2VpcmQgKGludmlzaWJsZSkgZGl2cyB3aGljaCBhcmUgcGxhY2VkIG92ZXIgaW5wdXQgZWxlbWVudHMgYW5kIHRyaWdnZXIgbGVhdmUgZXZlbnRzLi4uIFxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvci5yZW1vdmUoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREZWxldGUgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCByZW1vdmU6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUoW3RhcmdldC5kYXRhXSk7XHJcbiAgICAgIHRoaXMuZGVsZXRlKHJlbW92ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRXNjYXBlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENvcHlQYXN0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIMaSLkRlYnVnLmZ1ZGdlKF9ldmVudCk7XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ09QWTpcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jb3B5KHRoaXMuZ2V0Rm9jdXNzZWQoKSwgX2V2ZW50LnR5cGUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5DVVQ6XHJcbiAgICAgICAgICBsZXQgY3V0OiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuY3V0KHRoaXMuZ2V0Rm9jdXNzZWQoKSwgX2V2ZW50LnR5cGUpO1xyXG4gICAgICAgICAgLy8gbGV0IGN1dDogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZSh0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgICAgICAgIHRoaXMuZGVsZXRlKGN1dCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULlBBU1RFOlxyXG4gICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5wYXN0ZSgpO1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5jYW5BZGRDaGlsZHJlbihvYmplY3RzLCB0YXJnZXQuZGF0YSkpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZHJlbihvYmplY3RzLCB0YXJnZXQuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGl0ZW1zOiBUcmVlSXRlbTxUPltdID0gPFRyZWVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKSk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGxldCBpbmRleDogbnVtYmVyID0gaXRlbXMuaW5kZXhPZih0YXJnZXQpO1xyXG4gICAgICBpZiAoaW5kZXggPCAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkgJiYgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5sZW5ndGggPT0gMClcclxuICAgICAgICB0YXJnZXQuc2VsZWN0KHRydWUpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfTkVYVDpcclxuICAgICAgICAgIGlmICgrK2luZGV4IDwgaXRlbXMubGVuZ3RoKVxyXG4gICAgICAgICAgICBpdGVtc1tpbmRleF0uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfUFJFVklPVVM6XHJcbiAgICAgICAgICBpZiAoLS1pbmRleCA+PSAwKVxyXG4gICAgICAgICAgICBpdGVtc1tpbmRleF0uZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSlcclxuICAgICAgICAoPFRyZWVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLnNlbGVjdCh0cnVlKTtcclxuICAgICAgZWxzZSBpZiAoIV9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1bC10cmVlXCIsIFRyZWUsIHsgZXh0ZW5kczogXCJ1bFwiIH0pO1xyXG59XHJcbiIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL0RhdGFDb250cm9sbGVyLnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBTdWJjbGFzcyB0aGlzIHRvIGNyZWF0ZSBhIGJyb2tlciBiZXR3ZWVuIHlvdXIgZGF0YSBhbmQgYSB7QGxpbmsgVHJlZX0gdG8gZGlzcGxheSBhbmQgbWFuaXB1bGF0ZSBpdC5cclxuICAgKiBUaGUge0BsaW5rIFRyZWV9IGRvZXNuJ3Qga25vdyBob3cgeW91ciBkYXRhIGlzIHN0cnVjdHVyZWQgYW5kIGhvdyB0byBoYW5kbGUgaXQsIHRoZSBjb250cm9sbGVyIGltcGxlbWVudHMgdGhlIG1ldGhvZHMgbmVlZGVkXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIFRyZWVDb250cm9sbGVyPFQ+IGV4dGVuZHMgRGF0YUNvbnRyb2xsZXI8VD4ge1xyXG4gICAgLyoqIFVzZWQgYnkgdGhlIHRyZWUgdG8gaW5kaWNhdGUgdGhlIGRyb3AgcG9zaXRpb24gd2hpbGUgZHJhZ2dpbmcgKi9cclxuICAgIHB1YmxpYyBkcmFnRHJvcEluZGljYXRvcjogSFRNTEhSRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoclwiKTtcclxuXHJcbiAgICAvKiogT3ZlcnJpZGUgdG8gZW5hYmxlIHRyZWUgaXRlbXMgdG8gYmUgc29ydGFibGUgYnkgdGhlIHVzZXIgdmlhIGRyYWctYW5kLWRyb3AuIERlZmF1bHQgaXMgdHJ1ZS4gKi9cclxuICAgIHB1YmxpYyBzb3J0YWJsZTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPdmVycmlkZSBpZiBzb21lIG9iamVjdHMgc2hvdWxkIG5vdCBiZSBkcmFnZ2FibGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRyYWdnYWJsZShfb2JqZWN0OiBUKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIHR3byBvYmplY3RzIG9mIGFyZSBlcXVhbC4gRGVmYXVsdCBpcyBfYSA9PSBfYi4gT3ZlcnJpZGUgZm9yIG1vcmUgY29tcGxleCBjb21wYXJpc29ucy4gXHJcbiAgICAgKiBVc2VmdWwgd2hlbiB0aGUgdW5kZXJseWluZyBkYXRhIGlzIHZvbGF0aWxlIGFuZCBjaGFuZ2VzIGlkZW50aXR5IHdoaWxlIHN0YXlpbmcgdGhlIHNhbWUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlcXVhbHMoX2E6IFQsIF9iOiBUKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiBfYSA9PSBfYjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE92ZXJyaWRlIGlmIHNvbWUgb2JqZWN0cyBzaG91bGQgbm90IGJlIGFkZGFibGUgdG8gb3RoZXJzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjYW5BZGRDaGlsZHJlbihfc291cmNlczogVFtdLCBfdGFyZ2V0OiBUKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICBcclxuICAgIC8qKiBDcmVhdGUgYW4gSFRNTEVsZW1lbnQgZm9yIHRoZSB0cmVlIGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QuIGUuZy4gYW4gSFRNTElucHV0RWxlbWVudCAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNyZWF0ZUNvbnRlbnQoX29iamVjdDogVCk6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8qKiBSZXRyaWV2ZSBhIHNwYWNlIHNlcGFyYXRlZCBzdHJpbmcgb2YgYXR0cmlidXRlcyB0byBhZGQgdG8gdGhlIGxpc3QgaXRlbSByZXByZXNlbnRpbmcgdGhlIG9iamVjdCBmb3IgZnVydGhlciBzdHlsaW5nICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldEF0dHJpYnV0ZXMoX29iamVjdDogVCk6IHN0cmluZztcclxuXHJcbiAgICAvKiogUHJvY2VzcyB0aGUgcHJvcG9zZWQgbmV3IHZhbHVlLiBUaGUgaWQgb2YgdGhlIGh0bWwgZWxlbWVudCBvbiB3aGljaCB0aGUgY2hhbmdlIG9jY3VyZWQgaXMgcGFzc2VkICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc2V0VmFsdWUoX29iamVjdDogVCwgX2VsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCk6IFByb21pc2U8Ym9vbGVhbj47XHJcblxyXG4gICAgLyoqIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgaGFzIGNoaWxkcmVuIHRoYXQgbXVzdCBiZSBzaG93biB3aGVuIHVuZm9sZGluZyB0aGUgdHJlZSBpdGVtICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaGFzQ2hpbGRyZW4oX29iamVjdDogVCk6IGJvb2xlYW47XHJcblxyXG4gICAgLyoqIFJldHVybiB0aGUgb2JqZWN0J3MgY2hpbGRyZW4gdG8gc2hvdyB3aGVuIHVuZm9sZGluZyB0aGUgdHJlZSBpdGVtICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0Q2hpbGRyZW4oX29iamVjdDogVCk6IHJlYWRvbmx5IFRbXTtcclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBQcm9jZXNzIHRoZSBsaXN0IG9mIHNvdXJjZSBvYmplY3RzIHRvIGJlIGFkZGVkQXNDaGlsZHJlbiB3aGVuIGRyb3BwaW5nIG9yIHBhc3Rpbmcgb250byB0aGUgdGFyZ2V0IGl0ZW0vb2JqZWN0LCBcclxuICAgICAqIHJldHVybiB0aGUgbGlzdCBvZiBvYmplY3RzIHRoYXQgc2hvdWxkIHZpc2libHkgYmVjb21lIHRoZSBjaGlsZHJlbiBvZiB0aGUgdGFyZ2V0IGl0ZW0vb2JqZWN0IFxyXG4gICAgICogQHBhcmFtIF9jaGlsZHJlbiBBIGxpc3Qgb2Ygb2JqZWN0cyB0aGUgdHJlZSB0cmllcyB0byBhZGQgdG8gdGhlIF90YXJnZXRcclxuICAgICAqIEBwYXJhbSBfdGFyZ2V0IFRoZSBvYmplY3QgcmVmZXJlbmNlZCBieSB0aGUgaXRlbSB0aGUgZHJvcCBvY2N1cnMgb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGFkZENoaWxkcmVuKF9zb3VyY2VzOiBUW10sIF90YXJnZXQ6IFQsIF9pbmRleD86IG51bWJlcik6IFRbXTtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgbGktZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgYW4gb2JqZWN0IGluIGEge0BsaW5rIFRyZWVMaXN0fSB3aXRoIGEgY2hlY2tib3ggYW5kIHVzZXIgZGVmaW5lZCBpbnB1dCBlbGVtZW50cyBhcyBjb250ZW50LlxyXG4gICAqIEFkZGl0aW9uYWxseSwgbWF5IGhvbGQgYW4gaW5zdGFuY2Ugb2Yge0BsaW5rIFRyZWVMaXN0fSBhcyBicmFuY2ggdG8gZGlzcGxheSBjaGlsZHJlbiBvZiB0aGUgY29ycmVzcG9uZGluZyBvYmplY3QuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRyZWVJdGVtPFQ+IGV4dGVuZHMgSFRNTExJRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY2xhc3NlczogQ1NTX0NMQVNTW10gPSBbXTtcclxuICAgIHB1YmxpYyBkYXRhOiBUID0gbnVsbDtcclxuICAgIHB1YmxpYyBjb250cm9sbGVyOiBUcmVlQ29udHJvbGxlcjxUPjtcclxuXHJcbiAgICBwcml2YXRlIGNoZWNrYm94OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgI2NvbnRlbnQ6IEhUTUxGaWVsZFNldEVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBUcmVlQ29udHJvbGxlcjxUPiwgX2RhdGE6IFQpIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuZGF0YSA9IF9kYXRhO1xyXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgY3NzQ2xhc3Nlc1xyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgICB0aGlzLmhhc0NoaWxkcmVuID0gdGhpcy5jb250cm9sbGVyLmhhc0NoaWxkcmVuKF9kYXRhKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DSEFOR0UsIHRoaXMuaG5kQ2hhbmdlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRPVUJMRV9DTElDSywgdGhpcy5obmREYmxDbGljayk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19PVVQsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRk9DVVNfTkVYVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVF9UUkVFLkZPQ1VTX1BSRVZJT1VTLCB0aGlzLmhuZEZvY3VzKTtcclxuXHJcbiAgICAgIHRoaXMuZHJhZ2dhYmxlID0gdGhpcy5jb250cm9sbGVyLmRyYWdnYWJsZShfZGF0YSk7XHJcbiAgICAgIC8vIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdTdGFydCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX1NUQVJULCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfRU5URVIsIHRoaXMuaG5kRHJhZ092ZXIpOyAvLyB0aGlzIHByZXZlbnRzIGN1cnNvciBmcm9tIGZsaWNrZXJpbmdcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfRU5URVIsIHRoaXMuaG5kRHJhZ0Ryb3ApOyAvLyB0aGlzIHByZXZlbnRzIGN1cnNvciBmcm9tIGZsaWNrZXJpbmdcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ092ZXIpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRST1AsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlBPSU5URVJfVVAsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlJFTU9WRV9DSElMRCwgdGhpcy5obmRSZW1vdmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlLCB3aGVuIHRoaXMgaXRlbSBoYXMgYSB2aXNpYmxlIGNoZWNrYm94IGluIGZyb250IHRvIGV4cGFuZCB0aGUgc3Vic2VxdWVudCBicmFuY2ggXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgaGFzQ2hpbGRyZW4oKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNoZWNrYm94LnN0eWxlLnZpc2liaWxpdHkgIT0gXCJoaWRkZW5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3dzIG9yIGhpZGVzIHRoZSBjaGVja2JveCBmb3IgZXhwYW5kaW5nIHRoZSBzdWJzZXF1ZW50IGJyYW5jaFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IGhhc0NoaWxkcmVuKF9oYXM6IGJvb2xlYW4pIHtcclxuICAgICAgdGhpcy5jaGVja2JveC5zdHlsZS52aXNpYmlsaXR5ID0gX2hhcyA/IFwidmlzaWJsZVwiIDogXCJoaWRkZW5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUge0BsaW5rIENTU19DTEFTUy5TRUxFQ1RFRH0gaXMgYXR0YWNoZWQgdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXR0YWNoZXMgb3IgZGV0YWNoZXMgdGhlIHtAbGluayBDU1NfQ0xBU1MuU0VMRUNURUR9IHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKF9vbjogYm9vbGVhbikge1xyXG4gICAgICBpZiAoX29uKVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBjb250ZW50IHJlcHJlc2VudGluZyB0aGUgYXR0YWNoZWQge0BsaW5rIGRhdGF9XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgY29udGVudCgpOiBIVE1MRmllbGRTZXRFbGVtZW50IHtcclxuICAgICAgcmV0dXJuIHRoaXMuI2NvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhpcyBpdGVtIGlzIGV4cGFuZGVkLCBzaG93aW5nIGl0J3MgY2hpbGRyZW4sIG9yIGNsb3NlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGV4cGFuZGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRCcmFuY2goKSAmJiB0aGlzLmNoZWNrYm94LmNoZWNrZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZnJlc2hBdHRyaWJ1dGVzKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImF0dHJpYnV0ZXNcIiwgdGhpcy5jb250cm9sbGVyLmdldEF0dHJpYnV0ZXModGhpcy5kYXRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlZnJlc2hDb250ZW50KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLiNjb250ZW50LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sbGVyLmNyZWF0ZUNvbnRlbnQodGhpcy5kYXRhKSk7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICBmb3IgKGNvbnN0IGRlc2NlbmRhbnQgb2YgPE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+PnRoaXMuI2NvbnRlbnQucXVlcnlTZWxlY3RvckFsbChcIlt0aXRsZV1cIikpIFxyXG4gICAgICAgIHRoaXMudGl0bGUgKz0gZGVzY2VuZGFudC50aXRsZSArIFwiXFxuXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmllcyB0byBleHBhbmRpbmcgdGhlIHtAbGluayBUcmVlTGlzdH0gb2YgY2hpbGRyZW4sIGJ5IGRpc3BhdGNoaW5nIHtAbGluayBFVkVOVC5FWFBBTkR9LlxyXG4gICAgICogVGhlIHVzZXIgb2YgdGhlIHRyZWUgbmVlZHMgdG8gYWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSB0cmVlIFxyXG4gICAgICogaW4gb3JkZXIgdG8gY3JlYXRlIHRoYXQge0BsaW5rIFRyZWVMaXN0fSBhbmQgYWRkIGl0IGFzIGJyYW5jaCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGV4cGFuZChfZXhwYW5kOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQnJhbmNoKCk7XHJcblxyXG4gICAgICBpZiAoX2V4cGFuZClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVYUEFORCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuXHJcbiAgICAgIHRoaXMuY2hlY2tib3guY2hlY2tlZCA9IF9leHBhbmQ7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4odGhpcy5kYXRhKTtcclxuICAgICAgLy8gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9J2NoZWNrYm94J11cIikpLmNoZWNrZWQgPSBfZXhwYW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIGRhdGEgcmVmZXJlbmNlZCBieSB0aGUgaXRlbXMgc3VjY2VlZGluZyB0aGlzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaXNpYmxlRGF0YSgpOiBUW10ge1xyXG4gICAgICBsZXQgbGlzdDogTm9kZUxpc3RPZjxIVE1MTElFbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpO1xyXG4gICAgICBsZXQgZGF0YTogVFtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgbGlzdClcclxuICAgICAgICBkYXRhLnB1c2goKDxUcmVlSXRlbTxUPj5pdGVtKS5kYXRhKTtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLiBUaGUgYnJhbmNoIG11c3QgYmUgYSBwcmV2aW91c2x5IGNvbXBpbGVkIHtAbGluayBUcmVlTGlzdH1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEJyYW5jaChfYnJhbmNoOiBUcmVlTGlzdDxUPik6IHZvaWQge1xyXG4gICAgICB0aGlzLnJlbW92ZUJyYW5jaCgpO1xyXG4gICAgICBpZiAoX2JyYW5jaClcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKF9icmFuY2gpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgYnJhbmNoIG9mIGNoaWxkcmVuIG9mIHRoaXMgaXRlbS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJyYW5jaCgpOiBUcmVlTGlzdDxUPiB7XHJcbiAgICAgIHJldHVybiA8VHJlZUxpc3Q8VD4+dGhpcy5xdWVyeVNlbGVjdG9yKFwidWxcIik7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGF0Y2hlcyB0aGUge0BsaW5rIEVWRU5ULlNFTEVDVH0gZXZlbnRcclxuICAgICAqIEBwYXJhbSBfYWRkaXRpdmUgRm9yIG11bHRpcGxlIHNlbGVjdGlvbiAoK0N0cmwpIFxyXG4gICAgICogQHBhcmFtIF9pbnRlcnZhbCBGb3Igc2VsZWN0aW9uIG92ZXIgaW50ZXJ2YWwgKCtTaGlmdClcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNlbGVjdChfYWRkaXRpdmU6IGJvb2xlYW4sIF9pbnRlcnZhbDogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAgIGxldCBldmVudDogQ3VzdG9tRXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU0VMRUNULCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEsIGFkZGl0aXZlOiBfYWRkaXRpdmUsIGludGVydmFsOiBfaW50ZXJ2YWwgfSB9KTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgdGhlIGJyYW5jaCBvZiBjaGlsZHJlbiBmcm9tIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlbW92ZUJyYW5jaCgpOiB2b2lkIHtcclxuICAgICAgbGV0IGJyYW5jaDogVHJlZUxpc3Q8VD4gPSB0aGlzLmdldEJyYW5jaCgpO1xyXG4gICAgICBpZiAoIWJyYW5jaClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMucmVtb3ZlQ2hpbGQoYnJhbmNoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZSgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5jaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgdGhpcy5jaGVja2JveC50eXBlID0gXCJjaGVja2JveFwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY2hlY2tib3gpO1xyXG4gICAgICB0aGlzLiNjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuI2NvbnRlbnQpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuICAgICAgdGhpcy50YWJJbmRleCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEZvY3VzRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLiNjb250ZW50LmRpc2FibGVkKSB7XHJcbiAgICAgICAgaWYgKF9ldmVudC5jb2RlID09IMaSLktFWUJPQVJEX0NPREUuRVNDIHx8IF9ldmVudC5jb2RlID09IMaSLktFWUJPQVJEX0NPREUuRU5URVIpXHJcbiAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGlmICh0aGlzLmhhc0NoaWxkcmVuICYmICF0aGlzLmV4cGFuZGVkKVxyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZCh0cnVlKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAodGhpcy5leHBhbmRlZClcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQoZmFsc2UpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkYyOlxyXG4gICAgICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy4jY29udGVudC5lbGVtZW50cy5pdGVtKDApO1xyXG4gICAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuU1BBQ0U6XHJcbiAgICAgICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkVTQ0FQRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkRFTEVURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5DOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNPUFksIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuVjpcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQubWV0YUtleSkge1xyXG4gICAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5QQVNURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5YOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRGJsQ2xpY2sgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLiNjb250ZW50LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PmRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoX2V2ZW50LnBhZ2VYLCBfZXZlbnQucGFnZVkpOyAvLyBkaXNhYmxlZCBlbGVtZW50cyBkb24ndCBkaXNwYXRjaCBjbGljayBldmVudHMsIGdldCB0aGUgZWxlbWVudCBtYW51YWxseVxyXG4gICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgZWxlbWVudC5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENoYW5nZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgdGFyZ2V0LnR5cGUgPT0gXCJjaGVja2JveFwiKSB7XHJcbiAgICAgICAgdGhpcy5leHBhbmQodGFyZ2V0LmNoZWNrZWQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHJlbmFtZWQ6IGJvb2xlYW4gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuc2V0VmFsdWUodGhpcy5kYXRhLCB0YXJnZXQpO1xyXG5cclxuICAgICAgdGhpcy5yZWZyZXNoQ29udGVudCgpO1xyXG4gICAgICB0aGlzLnJlZnJlc2hBdHRyaWJ1dGVzKCk7XHJcblxyXG4gICAgICBpZiAocmVuYW1lZClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlJFTkFNRSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgZGF0YTogdGhpcy5kYXRhIH0gfSkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdEcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGlmIChfZXZlbnQudHlwZSA9PSBFVkVOVC5EUk9QKVxyXG4gICAgICAvLyAgIGRlYnVnZ2VyO1xyXG4gICAgICBpZiAoUmVmbGVjdC5nZXQoX2V2ZW50LCBcIml0ZW1cIikpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICAvLyBzdG9yZSB0aGUgZHJhZ2dlZCBpdGVtIGluIHRoZSBldmVudCBmb3IgZnVydGhlciBwcm9jZXNzaW5nIGluIHRhYmxlXHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJpdGVtXCIsIHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgcmVjdDogRE9NUmVjdCA9IHRoaXMuI2NvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgIGxldCB1cHBlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgxIC8gNCk7XHJcbiAgICAgIGxldCBsb3dlcjogbnVtYmVyID0gcmVjdC50b3AgKyByZWN0LmhlaWdodCAqICgzIC8gNCk7XHJcbiAgICAgIGxldCBvZmZzZXQ6IG51bWJlciA9IF9ldmVudC5jbGllbnRZO1xyXG4gICAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgVHJlZSB8fCAob2Zmc2V0ID4gdXBwZXIgJiYgKG9mZnNldCA8IGxvd2VyIHx8IHRoaXMuY2hlY2tib3guY2hlY2tlZCkpIHx8ICF0aGlzLmNvbnRyb2xsZXIuc29ydGFibGUpIHtcclxuICAgICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiLCB0cnVlKTtcclxuICAgICAgICBpZiAoX2V2ZW50LnR5cGUgPT0gRVZFTlQuRFJBR19PVkVSKVxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuY2FuQWRkQ2hpbGRyZW4oQ2xpcGJvYXJkLmRyYWdEcm9wLmdldCgpLCB0aGlzLmRhdGEpKSB7XHJcbiAgICAgICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibW92ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMuY2hlY2tib3gpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLnNlbGVjdChfZXZlbnQuY3RybEtleSwgX2V2ZW50LnNoaWZ0S2V5KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW1vdmUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyB0aGUgdmlld3MgbWlnaHQgbmVlZCB0byBrbm93IGFib3V0IHRoaXMgZXZlbnRcclxuICAgICAgLy8gaWYgKF9ldmVudC5jdXJyZW50VGFyZ2V0ID09IF9ldmVudC50YXJnZXQpXHJcbiAgICAgIC8vICAgcmV0dXJuO1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4odGhpcy5kYXRhKTtcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJsaS10cmVlLWl0ZW1cIiwgVHJlZUl0ZW0sIHsgZXh0ZW5kczogXCJsaVwiIH0pO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIGV4cG9ydCB0eXBlIERST1BFRkZFQ1QgPSBcIm5vbmVcIiB8IFwiY29weVwiIHwgXCJsaW5rXCIgfCBcIm1vdmVcIjtcclxuXHJcbiAgZXhwb3J0IGNvbnN0IGVudW0gRVZFTlQge1xyXG4gICAgQ0xJQ0sgPSBcImNsaWNrXCIsXHJcbiAgICBET1VCTEVfQ0xJQ0sgPSBcImRibGNsaWNrXCIsXHJcbiAgICBLRVlfRE9XTiA9IFwia2V5ZG93blwiLFxyXG4gICAgS0VZX1VQID0gXCJrZXl1cFwiLFxyXG4gICAgRFJBR19TVEFSVCA9IFwiZHJhZ3N0YXJ0XCIsXHJcbiAgICBEUkFHX0VOVEVSID0gXCJkcmFnZW50ZXJcIixcclxuICAgIERSQUdfT1ZFUiA9IFwiZHJhZ292ZXJcIixcclxuICAgIERSQUdfTEVBVkUgPSBcImRyYWdsZWF2ZVwiLFxyXG4gICAgRFJPUCA9IFwiZHJvcFwiLFxyXG4gICAgUE9JTlRFUl9VUCA9IFwicG9pbnRlcnVwXCIsXHJcbiAgICBXSEVFTCA9IFwid2hlZWxcIixcclxuICAgIEZPQ1VTX05FWFQgPSBcImZvY3VzTmV4dFwiLFxyXG4gICAgRk9DVVNfUFJFVklPVVMgPSBcImZvY3VzUHJldmlvdXNcIixcclxuICAgIEZPQ1VTX0lOID0gXCJmb2N1c2luXCIsXHJcbiAgICBGT0NVU19PVVQgPSBcImZvY3Vzb3V0XCIsXHJcbiAgICBGT0NVU19TRVQgPSBcImZvY3VzU2V0XCIsXHJcbiAgICBGT0NVUyA9IFwiZm9jdXNcIixcclxuICAgIEJMVVIgPSBcImJsdXJcIixcclxuICAgIENIQU5HRSA9IFwiY2hhbmdlXCIsXHJcbiAgICBERUxFVEUgPSBcImRlbGV0ZVwiLFxyXG4gICAgUkVOQU1FID0gXCJyZW5hbWVcIixcclxuICAgIFNFTEVDVCA9IFwiaXRlbXNlbGVjdFwiLFxyXG4gICAgRVNDQVBFID0gXCJlc2NhcGVcIixcclxuICAgIENPUFkgPSBcImNvcHlcIixcclxuICAgIENVVCA9IFwiY3V0XCIsXHJcbiAgICBQQVNURSA9IFwicGFzdGVcIixcclxuICAgIFNPUlQgPSBcInNvcnRcIixcclxuICAgIENPTlRFWFRNRU5VID0gXCJjb250ZXh0bWVudVwiLFxyXG4gICAgTVVUQVRFID0gXCJtdXRhdGVcIixcclxuICAgIFJFTU9WRV9DSElMRCA9IFwicmVtb3ZlQ2hpbGRcIixcclxuICAgIENPTExBUFNFID0gXCJjb2xsYXBzZVwiLFxyXG4gICAgRVhQQU5EID0gXCJleHBhbmRcIixcclxuICAgIElOUFVUID0gXCJpbnB1dFwiLFxyXG4gICAgUkVBUlJBTkdFX0FSUkFZID0gXCJyZWFycmFuZ2VBcnJheVwiLFxyXG4gICAgUkVTVFJVQ1RVUkVfQVJSQVkgPSBcInJlc3RydWN0dXJlQXJyYXlcIixcclxuICAgIFRPR0dMRSA9IFwidG9nZ2xlXCIsXHJcbiAgICBQT0lOVEVSX01PVkUgPSBcInBvaW50ZXJtb3ZlXCIsXHJcbiAgICBJTlNFUlQgPSBcImluc2VydFwiLFxyXG4gICAgU0VMRUNUX0FMTCA9IFwic2VsZWN0QWxsXCIsXHJcbiAgICBTQVZFX0hJU1RPUlkgPSBcInNhdmVIaXN0b3J5XCIsXHJcbiAgICBSRVFVRVNUX09QVElPTlMgPSBcInJlcXVlc3RPcHRpb25zXCIsXHJcbiAgICBTRVRfVkFMVUUgPSBcInNldFZhbHVlXCIsXHJcbiAgICBJTklUSUFMSVpFX1ZBTFVFID0gXCJpbml0aWFsaXplVmFsdWVcIlxyXG4gIH1cclxufSJdfQ==