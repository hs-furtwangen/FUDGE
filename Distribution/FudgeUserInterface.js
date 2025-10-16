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
            // if (mutant == undefined && _getOptions == undefined) { // try initialize value
            //   try {
            //     Controller.initializeValue(_mutable, _key, _type);
            //   } catch {
            //     console.warn("No initial value set for", _mutable.constructor.name, _key);
            //   }
            // }
            let element;
            if (Array.isArray(mutant))
                element = Generator.createDetailsFromArray(mutant, _key, value, _type, _getOptions);
            if (!element)
                element = Generator.createMutatorElement(_key, _type, value);
            if (!element && _getOptions)
                element = new FudgeUserInterface.CustomElementComboSelect({ key: _key, label: _key, type: _type.name }, value);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VVc2VySW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ2xpcGJvYXJkLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvUmVmZXJlbmNlcy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0NvbnRyb2xsZXIvR2VuZXJhdG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Qm9vbGVhbi50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudENvbG9yLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50Q29tYm9TZWxlY3QudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnREaWdpdC50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvQ3VzdG9tRWxlbWVudEluaXRpYWxpemVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50VGVtcGxhdGUudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRNYXRyaXgzeDMudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRNYXRyaXg0eDQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnROdW1iZXIudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRPdXRwdXQudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRTZWxlY3QudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L0N1c3RvbUVsZW1lbnRTdGVwcGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9DdXN0b21FbGVtZW50VGV4dElucHV0LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9EYXRhQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvRGV0YWlscy50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvRGV0YWlsc0FycmF5LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9EaWFsb2cudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L011bHRpTGV2ZWxNZW51LnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9XYXJuaW5nLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVGFibGUvVGFibGVDb250cm9sbGVyLnRzIiwiLi4vU291cmNlL1VzZXJJbnRlcmZhY2UvQ3VzdG9tRWxlbWVudC9UYWJsZS9UYWJsZUl0ZW0udHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZUxpc3QudHMiLCIuLi9Tb3VyY2UvVXNlckludGVyZmFjZS9DdXN0b21FbGVtZW50L1RyZWUvVHJlZS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlQ29udHJvbGxlci50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0N1c3RvbUVsZW1lbnQvVHJlZS9UcmVlSXRlbS50cyIsIi4uL1NvdXJjZS9Vc2VySW50ZXJmYWNlL0V2ZW50L0V2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLGtCQUFrQixDQTRCM0I7QUE1QkQsV0FBVSxrQkFBa0I7SUFDMUI7OztPQUdHO0lBS0gsTUFBYSxTQUFTO1FBQXRCO1lBR1MsWUFBTyxHQUFnQixFQUFFLENBQUM7UUFlbkMsQ0FBQztpQkFqQmUsYUFBUSxHQUFjLElBQUksU0FBUyxFQUFFLEFBQTdCLENBQThCO2lCQUN0QyxjQUFTLEdBQWMsSUFBSSxTQUFTLEVBQUUsQUFBN0IsQ0FBOEI7UUFJOUMsR0FBRztZQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDO1FBRU0sS0FBSztZQUNWLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLENBQUM7UUFFTSxHQUFHLENBQUMsUUFBa0IsRUFBRSxVQUEwQjtZQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztRQUM5QixDQUFDOztJQWpCVSw0QkFBUyxZQWtCckIsQ0FBQTtBQUNILENBQUMsRUE1QlMsa0JBQWtCLEtBQWxCLGtCQUFrQixRQTRCM0I7QUM1QkQsNklBQTZJO0FDQTdJLElBQVUsa0JBQWtCLENBd1czQjtBQXhXRCxXQUFVLGtCQUFrQjtJQUMxQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckI7OztPQUdHO0lBQ0gsTUFBYSxVQUFVO2lCQUNFLGVBQVUsR0FBaUMsSUFBSSxPQUFPLEVBQUUsQUFBOUMsQ0FBK0M7UUFTaEYsWUFBbUIsUUFBZ0IsRUFBRSxXQUF3QjtZQUxuRCxlQUFVLEdBQVcsR0FBRyxDQUFDO1lBc056QixrQkFBYSxHQUFHLEtBQUssRUFBRSxNQUFh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ZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogQ29tbW9uIGNsaXBib2FyZHMgZm9yIGFsbCBkcmFnLWRyb3AgYW5kIGNvcHktcGFzdGUgb3BlcmF0aW9ucyBoYXBwZW5pbmcgaW4gdGhlIHVzZXIgaW50ZXJmYWNlXHJcbiAgICogQGF1dGhvciBKaXJrYSBEZWxsJ09yby1GcmllZGwsIEhGVSwgMjAyNFxyXG4gICAqL1xyXG5cclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgZXhwb3J0IHR5cGUgQ2xpcE9wZXJhdGlvbiA9IEVWRU5ULkNPUFkgfCBFVkVOVC5DVVQ7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDbGlwYm9hcmQge1xyXG4gICAgcHVibGljIHN0YXRpYyBkcmFnRHJvcDogQ2xpcGJvYXJkID0gbmV3IENsaXBib2FyZCgpO1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5UGFzdGU6IENsaXBib2FyZCA9IG5ldyBDbGlwYm9hcmQoKTtcclxuICAgIHB1YmxpYyBvYmplY3RzOiDGki5HZW5lcmFsW10gPSBbXTtcclxuICAgIHB1YmxpYyBvcGVyYXRpb246IENsaXBPcGVyYXRpb247XHJcblxyXG4gICAgcHVibGljIGdldDxUPigpOiBUW10ge1xyXG4gICAgICByZXR1cm4gdGhpcy5vYmplY3RzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhcigpOiB2b2lkIHtcclxuICAgICAgdGhpcy5vYmplY3RzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldChfb2JqZWN0czogT2JqZWN0W10sIF9vcGVyYXRpb24/OiBDbGlwT3BlcmF0aW9uKTogdm9pZCB7XHJcbiAgICAgIHRoaXMub2JqZWN0cyA9IF9vYmplY3RzLnNsaWNlKCk7XHJcbiAgICAgIHRoaXMub3BlcmF0aW9uID0gX29wZXJhdGlvbjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9EaXN0cmlidXRpb24vRnVkZ2VDb3JlLmQudHNcIi8+IC8vIFRPRE86IG5vdyB0aGF0IHdlIHVzZSBwYWNrYWdlIHJlZmVyZW5jZXMgaW4gdGhlIHRzY29uZmlnLCB0aGlzIGZpbGUgaXMgb2Jzb2xldGUiLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbm5lY3RzIGEgbXV0YWJsZSBvYmplY3QgdG8gYSBET00tRWxlbWVudCBhbmQgc3luY2hyb25pemVzIHRoYXQgbXV0YWJsZSB3aXRoIHRoZSBtdXRhdG9yIHN0b3JlZCB3aXRoaW4uXHJcbiAgICogVXBkYXRlcyB0aGUgbXV0YWJsZSBvbiBpbnRlcmFjdGlvbiB3aXRoIHRoZSBlbGVtZW50IGFuZCB0aGUgZWxlbWVudCBpbiB0aW1lIGludGVydmFscy5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ29udHJvbGxlciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHNpZ25hdHVyZXM6IFdlYWtNYXA8SFRNTEVsZW1lbnQsIHN0cmluZz4gPSBuZXcgV2Vha01hcCgpO1xyXG5cclxuICAgIC8vIFRPRE86IGV4YW1pbmUgdGhlIHVzZSBvZiB0aGUgYXR0cmlidXRlIGtleSB2cyBuYW1lLiBLZXkgc2lnbmFscyB0aGUgdXNlIGJ5IEZVREdFIHdoaWxlIG5hbWUgaXMgc3RhbmRhcmQgYW5kIHN1cHBvcnRlZCBieSBmb3Jtc1xyXG4gICAgcHVibGljIGRvbUVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJvdGVjdGVkIHRpbWVVcGRhdGU6IG51bWJlciA9IDE5MDtcclxuICAgIHByb3RlY3RlZCBtdXRhYmxlOiBvYmplY3Q7XHJcblxyXG4gICAgcHJpdmF0ZSBpZEludGVydmFsOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9tdXRhYmxlOiBvYmplY3QsIF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICB0aGlzLmRvbUVsZW1lbnQgPSBfZG9tRWxlbWVudDtcclxuICAgICAgdGhpcy5zZXRNdXRhYmxlKF9tdXRhYmxlKTtcclxuICAgICAgLy8gVE9ETzogZXhhbWluZSwgaWYgdGhpcyBzaG91bGQgcmVnaXN0ZXIgdG8gb25lIGNvbW1vbiBpbnRlcnZhbCwgaW5zdGVhZCBvZiBlYWNoIGluc3RhbGxpbmcgaXRzIG93bi5cclxuICAgICAgdGhpcy5zdGFydFJlZnJlc2goKTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSU5QVVQsIHRoaXMubXV0YXRlT25JbnB1dCk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlJFQVJSQU5HRV9BUlJBWSwgdGhpcy5yZWFycmFuZ2VBcnJheSk7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULlJFU1RSVUNUVVJFX0FSUkFZLCB0aGlzLnJlc2l6ZUFycmF5KTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUkVRVUVTVF9PUFRJT05TLCB0aGlzLnByb3ZpZGVPcHRpb25zKTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU0VUX1ZBTFVFLCB0aGlzLnNldFZhbHVlKTtcclxuICAgICAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuSU5JVElBTElaRV9WQUxVRSwgdGhpcy5pbml0aWFsaXplVmFsdWUpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIGFuIGV4aXN0aW5nIG11dGF0b3IgYXMgYSB0ZW1wbGF0ZSBcclxuICAgICAqIGFuZCB1cGRhdGluZyBpdHMgdmFsdWVzIHdpdGggdGhvc2UgZm91bmQgaW4gdGhlIGdpdmVuIFVJLWRvbUVsZW1lbnQuIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZU11dGF0b3IoX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfbXV0YXRvcjogxpIuTXV0YXRvcik6IMaSLk11dGF0b3Ige1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gX211dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50PkNvbnRyb2xsZXIuZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50LCBrZXkpO1xyXG4gICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50KVxyXG4gICAgICAgICAgX211dGF0b3Jba2V5XSA9IGVsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZSBpZiAoX211dGF0b3Jba2V5XSBpbnN0YW5jZW9mIE9iamVjdClcclxuICAgICAgICAgIF9tdXRhdG9yW2tleV0gPSBDb250cm9sbGVyLnVwZGF0ZU11dGF0b3IoZWxlbWVudCwgX211dGF0b3Jba2V5XSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgX211dGF0b3Jba2V5XSA9IGVsZW1lbnQudmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBfbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIHRoZSBhIG11dGFibGUgYXMgYSB0ZW1wbGF0ZSB0byBjcmVhdGUgYSBtdXRhdG9yIG9yIHVwZGF0ZSB0aGUgZ2l2ZW4gbXV0YXRvci5cclxuICAgICAqIHdpdGggdGhlIHZhbHVlcyBpbiB0aGUgZ2l2ZW4gVUktZG9tRWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldE11dGF0b3IoX211dGFibGU6IG9iamVjdCwgX2RvbUVsZW1lbnQ6IEhUTUxFbGVtZW50LCBfbXV0YXRvcj86IMaSLk11dGF0b3IsIF90eXBlcz86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSBfbXV0YXRvciA/PyDGki5NdXRhYmxlLmdldE11dGF0b3IoX211dGFibGUpO1xyXG5cclxuICAgICAgZm9yIChsZXQga2V5IGluIG11dGF0b3IpIHtcclxuICAgICAgICBsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBDb250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoZWxlbWVudCA9PSBudWxsKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudClcclxuICAgICAgICAgIG11dGF0b3Jba2V5XSA9IGVsZW1lbnQuZ2V0TXV0YXRvclZhbHVlKCk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBtdXRhbnQ6IHVua25vd24gPSBSZWZsZWN0LmdldChfbXV0YWJsZSwga2V5KTtcclxuICAgICAgICAgIGlmICjGki5pc011dGFibGUobXV0YW50KSB8fCBBcnJheS5pc0FycmF5KG11dGFudCkpXHJcbiAgICAgICAgICAgIG11dGF0b3Jba2V5XSA9IHRoaXMuZ2V0TXV0YXRvcihtdXRhbnQsIGVsZW1lbnQsIG11dGF0b3Jba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlY3Vyc2l2ZSBtZXRob2QgdGFraW5nIHRoZSBtdXRhdG9yIG9mIGEgbXV0YWJsZSBhbmQgdXBkYXRpbmcgdGhlIFVJLWRvbUVsZW1lbnQgYWNjb3JkaW5nbHkuXHJcbiAgICAgKiBJZiBhbiBhZGRpdGlvbmFsIG11dGF0b3IgaXMgcGFzc2VkLCBpdHMgdmFsdWVzIGFyZSB1c2VkIGluc3RlYWQgb2YgdGhvc2Ugb2YgdGhlIG11dGFibGUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlVXNlckludGVyZmFjZShfbXV0YWJsZTogb2JqZWN0LCBfZG9tRWxlbWVudDogSFRNTEVsZW1lbnQsIF9tdXRhdG9yPzogxpIuTXV0YXRvciwgX3BhcmVudE11dGFibGU/OiBvYmplY3QsIF9wYXJlbnRLZXk/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgY29uc3QgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9tdXRhdG9yID8/IMaSLk11dGFibGUuZ2V0TXV0YXRvcihfbXV0YWJsZSk7XHJcblxyXG4gICAgICBpZiAoKF9kb21FbGVtZW50IGluc3RhbmNlb2YgRGV0YWlscykpXHJcbiAgICAgICAgQ29udHJvbGxlci51cGRhdGVVc2VySW50ZXJmYWNlU3RydWN0dXJlKF9tdXRhYmxlLCBfZG9tRWxlbWVudCwgbXV0YXRvciwgX3BhcmVudE11dGFibGUsIF9wYXJlbnRLZXkpO1xyXG5cclxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gbXV0YXRvcikge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQ6IEN1c3RvbUVsZW1lbnQgPSA8Q3VzdG9tRWxlbWVudD5Db250cm9sbGVyLmZpbmRDaGlsZEVsZW1lbnRCeUtleShfZG9tRWxlbWVudCwga2V5KTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgY29uc3QgbXV0YW50OiB1bmtub3duID0gUmVmbGVjdC5nZXQoX211dGFibGUsIGtleSk7XHJcbiAgICAgICAgY29uc3QgdmFsdWU6IMaSLkdlbmVyYWwgPSBtdXRhdG9yW2tleV07XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgQ3VzdG9tRWxlbWVudCAmJiBlbGVtZW50ICE9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXHJcbiAgICAgICAgICBlbGVtZW50LnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBpZiAoxpIuaXNNdXRhYmxlKG11dGFudCkgfHwgQXJyYXkuaXNBcnJheShtdXRhbnQpKVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVVzZXJJbnRlcmZhY2UobXV0YW50LCBlbGVtZW50LCBtdXRhdG9yW2tleV0sIF9tdXRhYmxlLCBrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRW5zdXJlcyB0aGF0IGEge0BsaW5rIERldGFpbHN9IGVsZW1lbnQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBnaXZlbiB7QGxpbmsgRnVkZ2VDb3JlLk11dGF0b3J9LlxyXG4gICAgICogUGVyZm9ybXMgYSBzaGFsbG93ICoqc3RydWN0dXJhbCBpbnRlZ3JpdHkgY2hlY2sqKiBieSBjb21wYXJpbmcgdGhlIGVsZW1lbnTigJlzIGNhY2hlZCB7QGxpbmsgQ29udHJvbGxlci5jcmVhdGVTaWduYXR1cmUgc2lnbmF0dXJlfSB3aXRoIHRoZSBtdXRhdG9y4oCZcyBzaWduYXR1cmUuXHJcbiAgICAgKiBJZiB0aGV5IGRpZmZlciwgdGhlIGVsZW1lbnTigJlzIGNvbnRlbnQgaXMgcmVidWlsdCB0byByZWZsZWN0IHRoZSBuZXcgc3RydWN0dXJlLlxyXG4gICAgICogQHBhcmFtIF9tdXRhYmxlIC0gVGhlIG9yaWdpbmFsIG11dGFibGUgb2JqZWN0IHJlcHJlc2VudGVkIGluIHRoZSBVSS5cclxuICAgICAqIEBwYXJhbSBfZGV0YWlscyAtIFRoZSB7QGxpbmsgRGV0YWlsc30gZWxlbWVudCBkaXNwbGF5aW5nIHRoZSBkYXRhLlxyXG4gICAgICogQHBhcmFtIF9tdXRhdG9yIC0gVGhlIG11dGF0b3Igb2JqZWN0IGRlc2NyaWJpbmcgdGhlIGN1cnJlbnQgc3RydWN0dXJlIGFuZCB2YWx1ZXMuXHJcbiAgICAgKiBAcGFyYW0gX3BhcmVudE11dGFibGUgLSAqKE9wdGlvbmFsKSogVGhlIHBhcmVudCBtdXRhYmxlIG9iamVjdCBpZiBuZXN0ZWQuXHJcbiAgICAgKiBAcGFyYW0gX3BhcmVudEtleSAtICooT3B0aW9uYWwpKiBUaGUga2V5IHJlZmVyZW5jaW5nIHRoaXMgbXV0YWJsZSB3aXRoaW4gaXRzIHBhcmVudC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB1cGRhdGVVc2VySW50ZXJmYWNlU3RydWN0dXJlKF9tdXRhYmxlOiBvYmplY3QsIF9kZXRhaWxzOiBEZXRhaWxzLCBfbXV0YXRvcjogxpIuTXV0YXRvciwgX3BhcmVudE11dGFibGU/OiBvYmplY3QsIF9wYXJlbnRLZXk/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgY29uc3QgbXV0YXRvclNpZ25hdHVyZTogc3RyaW5nID0gQ29udHJvbGxlci5jcmVhdGVTaWduYXR1cmUoX211dGF0b3IpO1xyXG4gICAgICBjb25zdCBlbGVtZW50U2lnbmF0dXJlOiBzdHJpbmcgPSBDb250cm9sbGVyLnNpZ25hdHVyZXMuZ2V0KF9kZXRhaWxzKTtcclxuXHJcbiAgICAgIGlmIChlbGVtZW50U2lnbmF0dXJlID09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIENvbnRyb2xsZXIuc2lnbmF0dXJlcy5zZXQoX2RldGFpbHMsIG11dGF0b3JTaWduYXR1cmUpO1xyXG4gICAgICB9IGVsc2UgaWYgKG11dGF0b3JTaWduYXR1cmUgIT09IGVsZW1lbnRTaWduYXR1cmUpIHtcclxuICAgICAgICBsZXQgY29udGVudDogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KF9tdXRhYmxlKSlcclxuICAgICAgICAgIGNvbnRlbnQgPSBHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbUFycmF5KF9tdXRhYmxlLCBfbXV0YXRvciwgxpIuTWV0YWRhdGEudHlwZXMoX3BhcmVudE11dGFibGUpW19wYXJlbnRLZXldLCDGki5NZXRhZGF0YS5vcHRpb25zKF9wYXJlbnRNdXRhYmxlKVtfcGFyZW50S2V5XSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgY29udGVudCA9IEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YWJsZShfbXV0YWJsZSwgX211dGF0b3IpO1xyXG5cclxuICAgICAgICBfZGV0YWlscy5zZXRDb250ZW50KGNvbnRlbnQpO1xyXG4gICAgICAgIENvbnRyb2xsZXIuc2lnbmF0dXJlcy5zZXQoX2RldGFpbHMsIG11dGF0b3JTaWduYXR1cmUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQZXJmb3JtcyBhIGJyZWFkdGgtZmlyc3Qgc2VhcmNoIG9uIHRoZSBnaXZlbiBfZG9tRWxlbWVudCBmb3IgYW4gZWxlbWVudCB3aXRoIHRoZSBnaXZlbiBrZXkuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZmluZENoaWxkRWxlbWVudEJ5S2V5KF9kb21FbGVtZW50OiBIVE1MRWxlbWVudCwgX2tleTogc3RyaW5nKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgZWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+ID0gX2RvbUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2tleT1cIiR7X2tleX1cIl1gKTtcclxuICAgICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA8IDIpXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzWzBdO1xyXG5cclxuICAgICAgbGV0IHNob3J0ZXN0UGF0aDogbnVtYmVyID0gSW5maW5pdHk7XHJcbiAgICAgIGxldCBjbG9zZXN0RWxlbWVudDogSFRNTEVsZW1lbnQgPSBudWxsO1xyXG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XHJcbiAgICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IHBhcmVudEVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50OyBwYXJlbnRFbGVtZW50ICE9IF9kb21FbGVtZW50OyBwYXJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50KVxyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICBpZiAoY291bnQgPCBzaG9ydGVzdFBhdGgpIHtcclxuICAgICAgICAgIGNsb3Nlc3RFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgIHNob3J0ZXN0UGF0aCA9IGNvdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNsb3Nlc3RFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdGlhbGl6ZVZhbHVlKF9tdXRhYmxlOiBvYmplY3QsIF9rZXk6IHN0cmluZyB8IG51bWJlciwgX3R5cGU6IEZ1bmN0aW9uIHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcclxuICAgICAgY29uc3QgdHlwZTogRnVuY3Rpb24gfCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IF90eXBlID8/IMaSLk1ldGFkYXRhLnR5cGVzKF9tdXRhYmxlKVtfa2V5XTtcclxuICAgICAgbGV0IHZhbHVlOiB1bmtub3duO1xyXG5cclxuICAgICAgaWYgKHR5cGUgPT0gTnVtYmVyKVxyXG4gICAgICAgIHZhbHVlID0gMDtcclxuICAgICAgZWxzZSBpZiAodHlwZSA9PSBTdHJpbmcpXHJcbiAgICAgICAgdmFsdWUgPSBcIlwiO1xyXG4gICAgICBlbHNlIGlmICh0eXBlID09IEJvb2xlYW4pXHJcbiAgICAgICAgdmFsdWUgPSB0cnVlO1xyXG4gICAgICBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PSBcIm9iamVjdFwiKVxyXG4gICAgICAgIHZhbHVlID0gdHlwZVtPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0eXBlKS5maW5kKF9uYW1lID0+ICEvXlxcZCskLy50ZXN0KF9uYW1lKSldOyAvLyBmb3IgZW51bSBnZXQgdGhlIGZpcnN0IG5vbiBudW1lcmljIGtleVxyXG4gICAgICBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgdmFsdWUgPSBSZWZsZWN0LmNvbnN0cnVjdCh0eXBlLCBbXSk7XHJcblxyXG4gICAgICBSZWZsZWN0LnNldChfbXV0YWJsZSwgX2tleSwgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIHNoYWxsb3cgKipzdHJ1Y3R1cmFsIHNpZ25hdHVyZSoqIHN0cmluZyBmb3IgdGhlIGdpdmVuIG9iamVjdC5cclxuICAgICAqIFRoZSBzaWduYXR1cmUgZW5jb2RlcyBlYWNoIHtAbGluayBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyBvd24gcHJvcGVydHkgbmFtZX0gYW5kIGl0cyBjb3JyZXNwb25kaW5nIGB0eXBlb2YgdmFsdWVgLlxyXG4gICAgICogVW5saWtlIHRoZSBub3JtYWwgYHR5cGVvZmAgYmVoYXZpb3IsIHdoZW4gYSBwcm9wZXJ0eSB2YWx1ZSBpcyBgbnVsbGAsIHRoZSBzaWduYXR1cmUgd2lsbCBjb250YWluIGB1bmRlZmluZWRgIGluc3RlYWQgb2YgYG9iamVjdGAuXHJcbiAgICAgKiBcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogQ29udHJvbGxlci5jcmVhdGVTaWduYXR1cmUoeyB4OiAxLCB5OiAyIH0pO1xyXG4gICAgICogLy8g4oaSIFwieDpudW1iZXJ8eTpudW1iZXJcIlxyXG4gICAgICogXHJcbiAgICAgKiBDb250cm9sbGVyLmNyZWF0ZVNpZ25hdHVyZSh7IGNvbG9yOiB7IHI6IDEgfSB9KTtcclxuICAgICAqIC8vIOKGkiBcImNvbG9yOm9iamVjdFwiXHJcbiAgICAgKiBcclxuICAgICAqIENvbnRyb2xsZXIuY3JlYXRlU2lnbmF0dXJlKHsgcmVmOiBudWxsIH0pO1xyXG4gICAgICogLy8g4oaSIFwicmVmOnVuZGVmaW5lZFwiXHJcbiAgICAgKiBgYGAgICAgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlU2lnbmF0dXJlKF9vYmplY3Q6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogc3RyaW5nIHtcclxuICAgICAgY29uc3Qga2V5czogc3RyaW5nW10gPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhfb2JqZWN0KTtcclxuICAgICAgY29uc3Qgc2lnbmF0dXJlOiBzdHJpbmdbXSA9IG5ldyBBcnJheShrZXlzLmxlbmd0aCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGtleTogc3RyaW5nID0ga2V5c1tpXTtcclxuICAgICAgICBjb25zdCB2YWx1ZTogdW5rbm93biA9IF9vYmplY3Rba2V5XTtcclxuICAgICAgICBjb25zdCB0eXBlOiBzdHJpbmcgPSB2YWx1ZSA9PSBudWxsID8gXCJ1bmRlZmluZWRcIiA6IHR5cGVvZiB2YWx1ZTtcclxuXHJcbiAgICAgICAgc2lnbmF0dXJlW2ldID0gYCR7a2V5fToke3R5cGV9YDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHNpZ25hdHVyZS5qb2luKFwifFwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvcihfbXV0YXRvcj86IMaSLk11dGF0b3IsIF90eXBlcz86IMaSLk11dGF0b3IpOiDGki5NdXRhdG9yIHtcclxuICAgICAgcmV0dXJuIENvbnRyb2xsZXIuZ2V0TXV0YXRvcih0aGlzLm11dGFibGUsIHRoaXMuZG9tRWxlbWVudCwgX211dGF0b3IsIF90eXBlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVVzZXJJbnRlcmZhY2UoKTogdm9pZCB7XHJcbiAgICAgIENvbnRyb2xsZXIudXBkYXRlVXNlckludGVyZmFjZSh0aGlzLm11dGFibGUsIHRoaXMuZG9tRWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGFibGUoKTogb2JqZWN0IHtcclxuICAgICAgcmV0dXJuIHRoaXMubXV0YWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YWJsZShfbXV0YWJsZTogb2JqZWN0KTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXV0YWJsZSA9IF9tdXRhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFydFJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuaWRJbnRlcnZhbCk7XHJcbiAgICAgIHRoaXMuaWRJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLnJlZnJlc2gsIHRoaXMudGltZVVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG11dGF0ZU9uSW5wdXQgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nW10gPSB0aGlzLmdldE11dGF0b3JQYXRoKF9ldmVudCk7XHJcblxyXG4gICAgICAvLyBnZXQgY3VycmVudCBtdXRhdG9yIGFuZCBzYXZlIGZvciB1bmRvXHJcbiAgICAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yID0gxpIuTXV0YWJsZS5nZXRNdXRhdG9yKHRoaXMubXV0YWJsZSk7XHJcbiAgICAgIC8vIMaSLkRlYnVnLmluZm8obXV0YXRvcik7XHJcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5TQVZFX0hJU1RPUlksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGhpc3Rvcnk6IDAsIG11dGFibGU6IHRoaXMubXV0YWJsZSwgbXV0YXRvcjogxpIuTXV0YWJsZS5jbG9uZU11dGF0b3JGcm9tUGF0aChtdXRhdG9yLCBwYXRoKSB9IH0pKTtcclxuXHJcbiAgICAgIC8vIGdldCBjdXJyZW50IG11dGF0b3IgZnJvbSBpbnRlcmZhY2UgZm9yIG11dGF0aW9uICAgXHJcbiAgICAgIG11dGF0b3IgPSB0aGlzLmdldE11dGF0b3IoKTtcclxuICAgICAgYXdhaXQgxpIuTXV0YWJsZS5tdXRhdGUodGhpcy5tdXRhYmxlLCDGki5NdXRhYmxlLmNsb25lTXV0YXRvckZyb21QYXRoKG11dGF0b3IsIHBhdGgpKTtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULk1VVEFURSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlYXJyYW5nZUFycmF5ID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHNlcXVlbmNlOiBudW1iZXJbXSA9ICg8Q3VzdG9tRXZlbnQ+X2V2ZW50KS5kZXRhaWwuc2VxdWVuY2U7XHJcbiAgICAgIGxldCBwYXRoOiBzdHJpbmdbXSA9IHRoaXMuZ2V0TXV0YXRvclBhdGgoX2V2ZW50KTtcclxuICAgICAgbGV0IHRhcmdldDogxpIuTXV0YWJsZSB8IMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPiA9IHRoaXMuZ2V0VGFyZ2V0KHBhdGgpO1xyXG5cclxuICAgICAgLy8gcmVhcnJhbmdlIHRoYXQgbXV0YWJsZVxyXG4gICAgICAoPMaSLk11dGFibGVBcnJheTzGki5NdXRhYmxlPj48dW5rbm93bj50YXJnZXQpLnJlYXJyYW5nZShzZXF1ZW5jZSk7XHJcbiAgICAgIGF3YWl0IMaSLk11dGFibGUubXV0YXRlKHRoaXMubXV0YWJsZSwgxpIuTXV0YWJsZS5nZXRNdXRhdG9yKHRoaXMubXV0YWJsZSkpOyAvLyBUT0RPOiByZWFycmFuZ2VtZW50IGlzIG5vdCBhIG11dGF0aW9uIHNvIGRpc3BhdGNoaW5nIHRoaXMgbXV0YXRlIGlzIGlycml0YXRpbmcuLi5cclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlc2l6ZUFycmF5ID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc3QgdGFyZ2V0OiBFdmVudFRhcmdldCA9IF9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIERldGFpbHNBcnJheSkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgY29uc3QgbGVuZ3RoOiBudW1iZXIgPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsLmxlbmd0aDtcclxuICAgICAgY29uc3QgcGF0aDogc3RyaW5nW10gPSB0aGlzLmdldE11dGF0b3JQYXRoKF9ldmVudCk7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnQ6IHVua25vd25bXSA9IHRoaXMuZ2V0VGFyZ2V0KHBhdGgpO1xyXG5cclxuICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNBVkVfSElTVE9SWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgaGlzdG9yeTogNCwgbXV0YWJsZTogdGhpcy5tdXRhYmxlLCBtdXRhdG9yOiA8xpIuQXRvbWljTXV0YXRvcj57IHBhdGg6IHBhdGgsIHZhbHVlOiBjdXJyZW50LmNvbmNhdCgpIH0gfSB9KSk7XHJcblxyXG4gICAgICBjb25zdCBpbmNvbWluZzogdW5rbm93bltdID0gY3VycmVudC5jb25jYXQoKTtcclxuICAgICAgaW5jb21pbmcubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSBjdXJyZW50Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGluY29taW5nW2ldID0gbnVsbDtcclxuXHJcbiAgICAgIGN1cnJlbnQuc3BsaWNlKDAsIGN1cnJlbnQubGVuZ3RoLCAuLi5pbmNvbWluZyk7XHJcblxyXG4gICAgICBhd2FpdCDGki5NdXRhYmxlLm11dGF0ZSh0aGlzLm11dGFibGUsIMaSLk11dGFibGUuZ2V0TXV0YXRvcih0aGlzLm11dGFibGUpKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldFZhbHVlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgcGF0aDogc3RyaW5nW10gPSB0aGlzLmdldE11dGF0b3JQYXRoKF9ldmVudCk7XHJcbiAgICAgIGNvbnN0IG11dGFibGU6IG9iamVjdCA9IHRoaXMuZ2V0VGFyZ2V0KHBhdGgudG9TcGxpY2VkKHBhdGgubGVuZ3RoIC0gMSkpO1xyXG4gICAgICBjb25zdCBrZXk6IHN0cmluZyA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgIGNvbnN0IGN1cnJlbnQ6IHVua25vd24gPSBSZWZsZWN0LmdldChtdXRhYmxlLCBrZXkpO1xyXG5cclxuICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNBVkVfSElTVE9SWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgaGlzdG9yeTogMywgbXV0YWJsZTogdGhpcy5tdXRhYmxlLCBtdXRhdG9yOiA8xpIuQXRvbWljTXV0YXRvcj57IHBhdGg6IHBhdGgsIHZhbHVlOiBjdXJyZW50IH0gfSB9KSk7XHJcblxyXG4gICAgICBjb25zdCBpbmNvbWluZzogdW5rbm93biA9ICg8Q3VzdG9tRXZlbnQ+X2V2ZW50KS5kZXRhaWwudmFsdWU7XHJcbiAgICAgIFJlZmxlY3Quc2V0KG11dGFibGUsIGtleSwgaW5jb21pbmcpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZVZhbHVlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgcGF0aDogc3RyaW5nW10gPSB0aGlzLmdldE11dGF0b3JQYXRoKF9ldmVudCk7XHJcbiAgICAgIGNvbnN0IG11dGFibGU6IG9iamVjdCA9IHRoaXMuZ2V0VGFyZ2V0KHBhdGgudG9TcGxpY2VkKHBhdGgubGVuZ3RoIC0gMSkpO1xyXG4gICAgICBjb25zdCBrZXk6IHN0cmluZyA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgIGxldCBwYXJlbnQ6IG9iamVjdDtcclxuICAgICAgbGV0IHBhcmVudEtleTogc3RyaW5nO1xyXG4gICAgICBpZiAoIcaSLmlzTXV0YWJsZShtdXRhYmxlKSkgeyAvLyBtdXN0IGJlIGEgY29sbGVjdGlvbiB0eXBlLCBhZGp1c3QgdG8gcGFyZW50IG11dGFibGVcclxuICAgICAgICBwYXJlbnQgPSB0aGlzLmdldFRhcmdldChwYXRoLnRvU3BsaWNlZChwYXRoLmxlbmd0aCAtIDIpKTtcclxuICAgICAgICBwYXJlbnRLZXkgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMl07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGN1cnJlbnQ6IHVua25vd24gPSBSZWZsZWN0LmdldChtdXRhYmxlLCBrZXkpO1xyXG5cclxuICAgICAgdGhpcy5kb21FbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNBVkVfSElTVE9SWSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgaGlzdG9yeTogMywgbXV0YWJsZTogdGhpcy5tdXRhYmxlLCBtdXRhdG9yOiA8xpIuQXRvbWljTXV0YXRvcj57IHBhdGg6IHBhdGgsIHZhbHVlOiBjdXJyZW50IH0gfSB9KSk7XHJcblxyXG4gICAgICBjb25zdCBtdXRhdG9yVHlwZXM6IMaSLk11dGF0b3JUeXBlcyA9IMaSLk11dGFibGUuZ2V0VHlwZXMocGFyZW50ID8/IG11dGFibGUsIMaSLk11dGFibGUuZ2V0TXV0YXRvcihwYXJlbnQgPz8gbXV0YWJsZSkpO1xyXG4gICAgICBjb25zdCBtdXRhdG9yQ29sbGVjdGlvblR5cGVzOiDGki5NdXRhdG9yQ29sbGVjdGlvblR5cGVzID0gxpIuTWV0YWRhdGEuY29sbGVjdGlvblR5cGVzKG11dGFibGUpO1xyXG4gICAgICBjb25zdCB0eXBlOiBGdW5jdGlvbiB8IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID1tdXRhdG9yQ29sbGVjdGlvblR5cGVzW2tleV0gPz8gbXV0YXRvclR5cGVzW3BhcmVudEtleSA/PyBrZXldO1xyXG5cclxuICAgICAgQ29udHJvbGxlci5pbml0aWFsaXplVmFsdWUobXV0YWJsZSwga2V5LCB0eXBlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIHByb3ZpZGVPcHRpb25zID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgY29uc3QgdGFyZ2V0OiBFdmVudFRhcmdldCA9IF9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnRDb21ib1NlbGVjdCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgY29uc3QgcGF0aDogc3RyaW5nW10gPSB0aGlzLmdldE11dGF0b3JQYXRoKF9ldmVudCk7XHJcbiAgICAgIGxldCBtdXRhYmxlOiB1bmtub3duID0gdGhpcy5nZXRUYXJnZXQocGF0aC50b1NwbGljZWQocGF0aC5sZW5ndGggLSAxKSk7XHJcbiAgICAgIGxldCBrZXk6IHN0cmluZyA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcclxuICAgICAgaWYgKCHGki5pc011dGFibGUobXV0YWJsZSkpIHsgLy8gbXVzdCBiZSBhIGNvbGxlY3Rpb24gdHlwZSwgYWRqdXN0IHRvIHBhcmVudCBtdXRhYmxlXHJcbiAgICAgICAgbXV0YWJsZSA9IHRoaXMuZ2V0VGFyZ2V0KHBhdGgudG9TcGxpY2VkKHBhdGgubGVuZ3RoIC0gMikpO1xyXG4gICAgICAgIGtleSA9IHBhdGhbcGF0aC5sZW5ndGggLSAyXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbXV0YXRvck9wdGlvbnM6IMaSLk11dGF0b3JPcHRpb25zID0gxpIuTWV0YWRhdGEub3B0aW9ucyhtdXRhYmxlKTtcclxuXHJcbiAgICAgIGNvbnN0IG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0gbXV0YXRvck9wdGlvbnNba2V5XS5jYWxsKG11dGFibGUsIGtleSk7XHJcbiAgICAgIHRhcmdldC5vcHRpb25zID0gb3B0aW9ucztcclxuICAgIH07XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlZnJlc2ggPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYm9keS5jb250YWlucyh0aGlzLmRvbUVsZW1lbnQpKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmlkSW50ZXJ2YWwpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGdldE11dGF0b3JQYXRoKF9ldmVudDogRXZlbnQpOiBzdHJpbmdbXSB7XHJcbiAgICAgIGNvbnN0IHBhdGg6IHN0cmluZ1tdID0gW107XHJcbiAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIF9ldmVudC5jb21wb3NlZFBhdGgoKSkge1xyXG4gICAgICAgIGlmICh0YXJnZXQgPT0gdGhpcy5kb21FbGVtZW50KVxyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNvbnN0IGtleTogc3RyaW5nID0gKDxIVE1MRWxlbWVudD50YXJnZXQpLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgICBpZiAoa2V5KVxyXG4gICAgICAgICAgcGF0aC5wdXNoKGtleSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBwYXRoLnJldmVyc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFRhcmdldDxUID0gdW5rbm93bj4oX3BhdGg6IHN0cmluZ1tdKTogVCB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IG9iamVjdCA9IHRoaXMubXV0YWJsZTtcclxuXHJcbiAgICAgIGZvciAobGV0IGtleSBvZiBfcGF0aClcclxuICAgICAgICB0YXJnZXQgPSBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSk7XHJcblxyXG4gICAgICByZXR1cm4gPFQ+dGFyZ2V0O1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdGljIGNsYXNzIGdlbmVyYXRpbmcgVUktZG9tRWxlbWVudHMgZnJvbSB0aGUgaW5mb3JtYXRpb24gZm91bmQgaW4gbXV0YWJsZXMgYW5kIG11dGF0b3JzXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEdlbmVyYXRvciB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBbW0NvbnRyb2xsZXJdXSBmcm9tIGEgW1tGdWRnZUNvcmUuTXV0YWJsZV1dIHdpdGggZXhwYW5kYWJsZSBkZXRhaWxzIG9yIGEgbGlzdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUNvbnRyb2xsZXIoX211dGFibGU6IG9iamVjdCwgX25hbWU/OiBzdHJpbmcpOiBDb250cm9sbGVyIHtcclxuICAgICAgbGV0IGNvbnRyb2xsZXI6IENvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcihfbXV0YWJsZSwgR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tTXV0YWJsZShfbXV0YWJsZSwgX25hbWUpKTtcclxuICAgICAgY29udHJvbGxlci51cGRhdGVVc2VySW50ZXJmYWNlKCk7XHJcbiAgICAgIHJldHVybiBjb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGV4dGVuZGFibGUgZGV0YWlscyBmb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSBvciB0aGUgW1tGdWRnZUNvcmUuTXV0YWJsZV1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRGV0YWlsc0Zyb21NdXRhYmxlKF9tdXRhYmxlOiBvYmplY3QsIF9uYW1lPzogc3RyaW5nLCBfbXV0YXRvcj86IMaSLk11dGF0b3IpOiBEZXRhaWxzIHtcclxuICAgICAgaWYgKCHGki5pc011dGFibGUoX211dGFibGUpKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgbGV0IG5hbWU6IHN0cmluZyA9IF9uYW1lIHx8IF9tdXRhYmxlLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICAgIGxldCBkZXRhaWxzOiBEZXRhaWxzID0gbmV3IERldGFpbHMobmFtZSwgX211dGFibGUudHlwZSk7XHJcbiAgICAgIGRldGFpbHMuc2V0Q29udGVudChHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGFibGUoX211dGFibGUsIF9tdXRhdG9yKSk7XHJcbiAgICAgIHJldHVybiBkZXRhaWxzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZURldGFpbHNGcm9tQXJyYXkoX211dGFibGU6IG9iamVjdCwgX25hbWU6IHN0cmluZywgX211dGF0b3I6IMaSLk11dGF0b3IsIF90eXBlOiBGdW5jdGlvbiB8IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBfZ2V0T3B0aW9uczogxpIuTXV0YXRvck9wdGlvbnNHZXR0ZXIpOiBEZXRhaWxzQXJyYXkge1xyXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoX211dGFibGUpKVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgbGV0IGRldGFpbHM6IERldGFpbHNBcnJheSA9IG5ldyBEZXRhaWxzQXJyYXkoX25hbWUpO1xyXG4gICAgICBkZXRhaWxzLnNldENvbnRlbnQoR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUZyb21BcnJheShfbXV0YWJsZSwgX211dGF0b3IsIF90eXBlLCBfZ2V0T3B0aW9ucykpO1xyXG4gICAgICByZXR1cm4gZGV0YWlscztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGRpdi1FbGVtZW50cyBjb250YWluaW5nIHRoZSBpbnRlcmZhY2UgZm9yIHRoZSBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV0gb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGFibGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUludGVyZmFjZUZyb21NdXRhYmxlKF9tdXRhYmxlOiBvYmplY3QsIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgY29uc3QgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9tdXRhdG9yID8/IMaSLk11dGFibGUuZ2V0TXV0YXRvcihfbXV0YWJsZSlcclxuICAgICAgY29uc3QgdHlwZXM6IMaSLk11dGF0b3JUeXBlcyA9IMaSLk11dGFibGUuZ2V0VHlwZXMoX211dGFibGUsIG11dGF0b3IpO1xyXG4gICAgICBjb25zdCBvcHRpb25zOiDGki5NdXRhdG9yT3B0aW9ucyA9IMaSLk1ldGFkYXRhLm9wdGlvbnMoX211dGFibGUpO1xyXG4gICAgICBjb25zdCBkaXY6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIG11dGF0b3IpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VFbGVtZW50KF9tdXRhYmxlLCBtdXRhdG9yLCBrZXksIHR5cGVzW2tleV0sIG9wdGlvbnNba2V5XSk7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUludGVyZmFjZUZyb21BcnJheShfbXV0YWJsZTogb2JqZWN0LCBfbXV0YXRvcjogxpIuTXV0YXRvciwgX3R5cGU6IEZ1bmN0aW9uIHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIF9nZXRPcHRpb25zOiDGki5NdXRhdG9yT3B0aW9uc0dldHRlcik6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgY29uc3QgZGl2OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gR2VuZXJhdG9yLmNyZWF0ZUludGVyZmFjZUVsZW1lbnQoX211dGFibGUsIF9tdXRhdG9yLCBrZXksIF90eXBlLCBfZ2V0T3B0aW9ucyk7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGl2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlSW50ZXJmYWNlRWxlbWVudChfbXV0YWJsZTogb2JqZWN0LCBfbXV0YXRvcjogxpIuTXV0YXRvciwgX2tleTogc3RyaW5nLCBfdHlwZTogRnVuY3Rpb24gfCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgX2dldE9wdGlvbnM/OiDGki5NdXRhdG9yT3B0aW9uc0dldHRlcik6IEhUTUxFbGVtZW50IHtcclxuICAgICAgY29uc3QgbXV0YW50OiB1bmtub3duID0gUmVmbGVjdC5nZXQoX211dGFibGUsIF9rZXkpO1xyXG4gICAgICBjb25zdCB2YWx1ZTogdW5rbm93biA9IFJlZmxlY3QuZ2V0KF9tdXRhYmxlLCBfa2V5KTtcclxuXHJcbiAgICAgIC8vIGlmIChtdXRhbnQgPT0gdW5kZWZpbmVkICYmIF9nZXRPcHRpb25zID09IHVuZGVmaW5lZCkgeyAvLyB0cnkgaW5pdGlhbGl6ZSB2YWx1ZVxyXG4gICAgICAvLyAgIHRyeSB7XHJcbiAgICAgIC8vICAgICBDb250cm9sbGVyLmluaXRpYWxpemVWYWx1ZShfbXV0YWJsZSwgX2tleSwgX3R5cGUpO1xyXG4gICAgICAvLyAgIH0gY2F0Y2gge1xyXG4gICAgICAvLyAgICAgY29uc29sZS53YXJuKFwiTm8gaW5pdGlhbCB2YWx1ZSBzZXQgZm9yXCIsIF9tdXRhYmxlLmNvbnN0cnVjdG9yLm5hbWUsIF9rZXkpO1xyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfVxyXG5cclxuICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobXV0YW50KSlcclxuICAgICAgICBlbGVtZW50ID0gR2VuZXJhdG9yLmNyZWF0ZURldGFpbHNGcm9tQXJyYXkoPG9iamVjdD5tdXRhbnQsIF9rZXksIDzGki5NdXRhdG9yPnZhbHVlLCBfdHlwZSwgX2dldE9wdGlvbnMpO1xyXG5cclxuICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgIGVsZW1lbnQgPSBHZW5lcmF0b3IuY3JlYXRlTXV0YXRvckVsZW1lbnQoX2tleSwgX3R5cGUsIHZhbHVlKTtcclxuXHJcbiAgICAgIGlmICghZWxlbWVudCAmJiBfZ2V0T3B0aW9ucylcclxuICAgICAgICBlbGVtZW50ID0gbmV3IEN1c3RvbUVsZW1lbnRDb21ib1NlbGVjdCh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHR5cGU6ICg8RnVuY3Rpb24+X3R5cGUpLm5hbWUgfSwgdmFsdWUpO1xyXG5cclxuICAgICAgaWYgKCFlbGVtZW50KVxyXG4gICAgICAgIGVsZW1lbnQgPSBHZW5lcmF0b3IuY3JlYXRlRGV0YWlsc0Zyb21NdXRhYmxlKDxvYmplY3Q+bXV0YW50LCBfa2V5LCA8xpIuTXV0YXRvcj52YWx1ZSk7XHJcblxyXG4gICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgZWxlbWVudCA9IG5ldyBDdXN0b21FbGVtZW50SW5pdGlhbGl6ZXIoeyBrZXk6IF9rZXksIGxhYmVsOiBfa2V5IH0pO1xyXG5cclxuICAgICAgaWYgKCFlbGVtZW50KSB7IC8vIHVuZGVmaW5lZCB2YWx1ZXMgd2l0aG91dCBhIHR5cGUgY2FuJ3QgYmUgZGlzcGxheWVkXHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiTm8gaW50ZXJmYWNlIGNyZWF0ZWQgZm9yXCIsIF9tdXRhYmxlLmNvbnN0cnVjdG9yLm5hbWUsIF9rZXkpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIGRpdi1FbGVtZW50IGNvbnRhaW5pbmcgdGhlIGludGVyZmFjZSBmb3IgdGhlIFtbRnVkZ2VDb3JlLk11dGF0b3JdXSBcclxuICAgICAqIERvZXMgbm90IHN1cHBvcnQgbmVzdGVkIG11dGF0b3JzIVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUludGVyZmFjZUZyb21NdXRhdG9yKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogSFRNTERpdkVsZW1lbnQge1xyXG4gICAgICBsZXQgZGl2OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGZvciAobGV0IGtleSBpbiBfbXV0YXRvcikge1xyXG4gICAgICAgIGxldCB2YWx1ZTogdW5rbm93biA9IF9tdXRhdG9yW2tleV07XHJcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICBsZXQgZGV0YWlsczogRGV0YWlscyA9IG5ldyBEZXRhaWxzKGtleSwgXCJEZXRhaWxzXCIpO1xyXG4gICAgICAgICAgZGV0YWlscy5zZXRDb250ZW50KEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YXRvcih2YWx1ZSkpO1xyXG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGRldGFpbHMpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlTXV0YXRvckVsZW1lbnQoa2V5LCB2YWx1ZS5jb25zdHJ1Y3RvciwgdmFsdWUpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGRpdjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIHNwZWNpZmljIEN1c3RvbUVsZW1lbnQgZm9yIHRoZSBnaXZlbiBkYXRhLiBSZXR1cm5zIHVuZGVmaW5lZCBpZiBubyBlbGVtZW50IGlzIHtAbGluayBDdXN0b21FbGVtZW50LnJlZ2lzdGVyIHJlZ2lzdGVyZWR9IGZvciB0aGUgZ2l2ZW4gdHlwZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVNdXRhdG9yRWxlbWVudChfa2V5OiBzdHJpbmcsIF90eXBlOiBGdW5jdGlvbiB8IG9iamVjdCwgX3ZhbHVlOiB1bmtub3duKTogQ3VzdG9tRWxlbWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBDdXN0b21FbGVtZW50O1xyXG4gICAgICBsZXQgZWxlbWVudFR5cGU6IG5ldyAoLi4uX2FyZ3M6IENvbnN0cnVjdG9yUGFyYW1ldGVyczx0eXBlb2YgQ3VzdG9tRWxlbWVudD4pID0+IEN1c3RvbUVsZW1lbnQ7XHJcblxyXG4gICAgICBpZiAoX3ZhbHVlID09IG51bGwpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgX3R5cGUgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICBlbGVtZW50VHlwZSA9IEN1c3RvbUVsZW1lbnQuZ2V0KF90eXBlKTtcclxuICAgICAgICAgIGlmIChlbGVtZW50VHlwZSlcclxuICAgICAgICAgICAgZWxlbWVudCA9IG5ldyBlbGVtZW50VHlwZSh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHZhbHVlOiBfdmFsdWU/LnRvU3RyaW5nKCkgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgX3R5cGUgPT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgZWxlbWVudFR5cGUgPSBDdXN0b21FbGVtZW50LmdldChPYmplY3QpO1xyXG4gICAgICAgICAgZWxlbWVudCA9IG5ldyBlbGVtZW50VHlwZSh7IGtleTogX2tleSwgbGFiZWw6IF9rZXksIHZhbHVlOiBfdmFsdWU/LnRvU3RyaW5nKCkgfSwgX3R5cGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgxpIuRGVidWcuZnVkZ2UoX2Vycm9yKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBTdHJ1Y3R1cmUgZm9yIHRoZSBhdHRyaWJ1dGVzIHRvIHNldCBpbiBhIEN1c3RvbUVsZW1lbnQuXHJcbiAgICoga2V5IChtYXliZSByZW5hbWUgdG8gYG5hbWVgKSBpcyBtYW5kYXRvcnkgYW5kIG11c3QgbWF0Y2ggdGhlIGtleSBvZiBhIG11dGF0b3IgaWYgdXNlZCBpbiBjb25qdW5jdGlvblxyXG4gICAqIGxhYmVsIGlzIHJlY29tbWVuZGVkIGZvciBsYWJlbGxlZCBlbGVtZW50cywga2V5IGlzIHVzZWQgaWYgbm90IGdpdmVuLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMge1xyXG4gICAgW25hbWU6IHN0cmluZ106IHN0cmluZztcclxuICAgIGtleTogc3RyaW5nO1xyXG4gICAgbGFiZWw/OiBzdHJpbmc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVzIHRoZSBtYXBwaW5nIG9mIEN1c3RvbUVsZW1lbnRzIHRvIHRoZWlyIEhUTUwtVGFncyB2aWEgY3VzdG9tRWxlbWVudC5kZWZpbmVcclxuICAgKiBhbmQgdG8gdGhlIGRhdGEgdHlwZXMgYW5kIFtbRnVkZ2VDb3JlLk11dGFibGVdXXMgdGhleSByZW5kZXIgYW4gaW50ZXJmYWNlIGZvci4gXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEN1c3RvbUVsZW1lbnQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHRhZzogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWFwVHlwZVRvQ3VzdG9tRWxlbWVudDogTWFwPEZ1bmN0aW9uLCB0eXBlb2YgQ3VzdG9tRWxlbWVudD4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaWRDb3VudGVyOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzPzogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMsIC4uLl9hcmdzOiB1bmtub3duW10pIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgaWYgKF9hdHRyaWJ1dGVzKVxyXG4gICAgICAgIGZvciAobGV0IG5hbWUgaW4gX2F0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgIGlmIChfYXR0cmlidXRlc1tuYW1lXSAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIF9hdHRyaWJ1dGVzW25hbWVdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSBhbiBpZCB0byB1c2UgZm9yIGNoaWxkcmVuIG9mIHRoaXMgZWxlbWVudCwgbmVlZGVkIGUuZy4gZm9yIHN0YW5kYXJkIGludGVyYWN0aW9uIHdpdGggdGhlIGxhYmVsXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgZ2V0IG5leHRJZCgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCLGklwiICsgQ3VzdG9tRWxlbWVudC5pZENvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIG1hcCB0aGUgZ2l2ZW4gZWxlbWVudCB0eXBlIHRvIHRoZSBnaXZlbiB0YWcgYW5kIHRoZSBnaXZlbiB0eXBlIG9mIGRhdGFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlcihfdGFnOiBzdHJpbmcsIF90eXBlQ3VzdG9tRWxlbWVudDogdHlwZW9mIEN1c3RvbUVsZW1lbnQsIF90eXBlT2JqZWN0PzogdHlwZW9mIE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhfdGFnLCBfY2xhc3MpO1xyXG4gICAgICBfdHlwZUN1c3RvbUVsZW1lbnQudGFnID0gX3RhZztcclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUoX3RhZywgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuXHJcbiAgICAgIGlmIChfdHlwZU9iamVjdClcclxuICAgICAgICBDdXN0b21FbGVtZW50Lm1hcChfdHlwZU9iamVjdCwgX3R5cGVDdXN0b21FbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIHRoZSBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgZ2l2ZW4gZGF0YSB0eXBlIChpZiByZWdpc3RlcmVkKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldChfdHlwZTogRnVuY3Rpb24pOiB0eXBlb2YgQ3VzdG9tRWxlbWVudCAmIChuZXcgKC4uLl9hcmdzOiBDb25zdHJ1Y3RvclBhcmFtZXRlcnM8dHlwZW9mIEN1c3RvbUVsZW1lbnQ+KSA9PiBDdXN0b21FbGVtZW50KSB7XHJcbiAgICAgIGxldCBlbGVtZW50OiBzdHJpbmcgfCB0eXBlb2YgQ3VzdG9tRWxlbWVudCB8IEN1c3RvbUVsZW1lbnRDb25zdHJ1Y3RvciA9IEN1c3RvbUVsZW1lbnQubWFwVHlwZVRvQ3VzdG9tRWxlbWVudC5nZXQoX3R5cGUpO1xyXG4gICAgICByZXR1cm4gPHR5cGVvZiBDdXN0b21FbGVtZW50ICYgKG5ldyAoLi4uX2FyZ3M6IENvbnN0cnVjdG9yUGFyYW1ldGVyczx0eXBlb2YgQ3VzdG9tRWxlbWVudD4pID0+IEN1c3RvbUVsZW1lbnQpPmVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWFwKF90eXBlOiBGdW5jdGlvbiwgX3R5cGVDdXN0b21FbGVtZW50OiB0eXBlb2YgQ3VzdG9tRWxlbWVudCk6IHZvaWQge1xyXG4gICAgICDGki5EZWJ1Zy5mdWRnZShcIk1hcFwiLCBfdHlwZSwgX3R5cGVDdXN0b21FbGVtZW50Lm5hbWUpO1xyXG4gICAgICBDdXN0b21FbGVtZW50Lm1hcFR5cGVUb0N1c3RvbUVsZW1lbnQuc2V0KF90eXBlLCBfdHlwZUN1c3RvbUVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSBrZXkgKG5hbWUpIG9mIHRoZSBhdHRyaWJ1dGUgdGhpcyBlbGVtZW50IHJlcHJlc2VudHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBrZXkoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNJbml0aWFsaXplZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBsYWJlbC1lbGVtZW50IGFzIGNoaWxkIHRvIHRoaXMgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwZW5kTGFiZWwoKTogSFRNTExhYmVsRWxlbWVudCB7XHJcbiAgICAgIGxldCB0ZXh0OiBzdHJpbmcgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgICBpZiAoIXRleHQpXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0ZXh0O1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGxhYmVsKTtcclxuICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRMYWJlbChfbGFiZWw6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgaWYgKGxhYmVsKVxyXG4gICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gX2xhYmVsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgdmFsdWUgb2YgdGhpcyBlbGVtZW50IHVzaW5nIGEgZm9ybWF0IGNvbXBhdGlibGUgd2l0aCBbW0Z1ZGdlQ29yZS5NdXRhdG9yXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IE9iamVjdCk6IHZvaWQge1xyXG4gICAgICBSZWZsZWN0LnNldCh0aGlzLCBcInZhbHVlXCIsIF92YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFdvcmthcm91bmQgcmVjb25uZWN0aW9uIG9mIGNsb25lICovXHJcbiAgICBwdWJsaWMgY2xvbmVOb2RlKF9kZWVwOiBib29sZWFuKTogTm9kZSB7XHJcbiAgICAgIGxldCBsYWJlbDogc3RyaW5nID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgIGxldCBjbG9uZTogQ3VzdG9tRWxlbWVudCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKGxhYmVsID8geyBsYWJlbDogbGFiZWwgfSA6IG51bGwpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNsb25lKTtcclxuICAgICAgY2xvbmUuc2V0TXV0YXRvclZhbHVlKHRoaXMuZ2V0TXV0YXRvclZhbHVlKCkpO1xyXG4gICAgICBmb3IgKGxldCBhdHRyaWJ1dGUgb2YgdGhpcy5hdHRyaWJ1dGVzKVxyXG4gICAgICAgIGNsb25lLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUubmFtZSwgYXR0cmlidXRlLnZhbHVlKTtcclxuICAgICAgcmV0dXJuIGNsb25lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgaW4gYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0TXV0YXRvclZhbHVlKCk6IE9iamVjdDtcclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIGNoZWNrYm94IHdpdGggYSBsYWJlbCB0byBpdFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50Qm9vbGVhbiBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1ib29sZWFuXCIsIEN1c3RvbUVsZW1lbnRCb29sZWFuLCBCb29sZWFuKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIFRPRE86IGRlbGV0ZSB0YWJpbmRleCBmcm9tIGNoZWNrYm94IGFuZCBnZXQgc3BhY2Uta2V5IG9uIHRoaXNcclxuICAgICAgLy8gdGhpcy50YWJJbmRleCA9IDA7XHJcblxyXG4gICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIGlucHV0LnR5cGUgPSBcImNoZWNrYm94XCI7XHJcbiAgICAgIGlucHV0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQ7XHJcbiAgICAgIGlucHV0LmNoZWNrZWQgPSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpID09IFwidHJ1ZVwiO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKS5odG1sRm9yID0gaW5wdXQuaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIHN0YXR1cyBvZiB0aGUgY2hlY2tib3ggYXMgYm9vbGVhbiB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIikuY2hlY2tlZDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgc3RhdHVzIG9mIHRoZSBjaGVja2JveFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS5jaGVja2VkID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBBIGNvbG9yIHBpY2tlciB3aXRoIGEgbGFiZWwgdG8gaXQgYW5kIGEgc2xpZGVyIGZvciBvcGFjaXR5XHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRDb2xvciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1jb2xvclwiLCBDdXN0b21FbGVtZW50Q29sb3IsIMaSLkNvbG9yKTtcclxuICAgIHB1YmxpYyBjb2xvcjogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM6IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKCFfYXR0cmlidXRlcy5sYWJlbClcclxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9hdHRyaWJ1dGVzLmtleSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IHBpY2tlcjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgcGlja2VyLnR5cGUgPSBcImNvbG9yXCI7XHJcblxyXG4gICAgICBwaWNrZXIudGFiSW5kZXggPSAwO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHBpY2tlcik7XHJcblxyXG4gICAgICBsZXQgc2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBzbGlkZXIudHlwZSA9IFwicmFuZ2VcIjtcclxuICAgICAgc2xpZGVyLm1pbiA9IFwiMFwiO1xyXG4gICAgICBzbGlkZXIubWF4ID0gXCIxXCI7XHJcbiAgICAgIHNsaWRlci5zdGVwID0gXCIwLjAxXCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcclxuICAgICAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuV0hFRUwsIHRoaXMuaG5kV2hlZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSB2YWx1ZXMgb2YgcGlja2VyIGFuZCBzbGlkZXIgYXMgxpIuTXV0YXRvclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgaGV4OiBzdHJpbmcgPSAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1jb2xvclwiKSkudmFsdWU7XHJcbiAgICAgIGxldCBhbHBoYTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0W3R5cGU9cmFuZ2VcIikpLnZhbHVlO1xyXG4gICAgICB0aGlzLmNvbG9yLnNldEhleChoZXguc3Vic3RyKDEsIDYpICsgXCJmZlwiKTtcclxuICAgICAgdGhpcy5jb2xvci5hID0gcGFyc2VGbG9hdChhbHBoYSk7XHJcbiAgICAgIHJldHVybiB0aGlzLmNvbG9yLmdldE11dGF0b3IodHJ1ZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIHZhbHVlcyBvZiBjb2xvciBwaWNrZXIgYW5kIHNsaWRlclxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogxpIuTXV0YXRvcik6IHZvaWQge1xyXG4gICAgICB0aGlzLmNvbG9yLm11dGF0ZShfdmFsdWUpO1xyXG4gICAgICBsZXQgaGV4OiBzdHJpbmcgPSB0aGlzLmNvbG9yLnRvSGV4KCk7XHJcbiAgICAgICg8SFRNTElucHV0RWxlbWVudD50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFt0eXBlPWNvbG9yXCIpKS52YWx1ZSA9IFwiI1wiICsgaGV4LnNsaWNlKDAsIDYpO1xyXG4gICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT1yYW5nZVwiKSkudmFsdWUgPSB0aGlzLmNvbG9yLmEudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEtleShfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBobmRXaGVlbChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IHNsaWRlcjogSFRNTElucHV0RWxlbWVudCA9ICg8SFRNTElucHV0RWxlbWVudD5fZXZlbnQudGFyZ2V0KTtcclxuICAgICAgaWYgKHNsaWRlciAhPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coX2V2ZW50LmRlbHRhWSAvIDEwMDApO1xyXG4gICAgICBsZXQgY3VycmVudFZhbHVlOiBudW1iZXIgPSBOdW1iZXIoc2xpZGVyLnZhbHVlKTtcclxuICAgICAgc2xpZGVyLnZhbHVlID0gU3RyaW5nKGN1cnJlbnRWYWx1ZSAtIF9ldmVudC5kZWx0YVkgLyAxMDAwKTtcclxuICAgICAgc2xpZGVyLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudENvbWJvU2VsZWN0IGV4dGVuZHMgQ3VzdG9tRWxlbWVudCB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21FbGVtZW50OiB2b2lkID0gQ3VzdG9tRWxlbWVudC5yZWdpc3RlcihcImZ1ZGdlLWNvbWJvc2VsZWN0XCIsIEN1c3RvbUVsZW1lbnRDb21ib1NlbGVjdCk7XHJcblxyXG4gICAgcHVibGljIG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xyXG4gICAgcHVibGljIGlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHVibGljIGRhdGFsaXN0OiBIVE1MRGF0YUxpc3RFbGVtZW50O1xyXG4gICAgcHVibGljIGJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBwdWJsaWMgdmFsdWU6IHVua25vd247XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcywgX3ZhbHVlPzogdW5rbm93biwgX29wdGlvbnM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIHRoaXMub3B0aW9ucyA9IF9vcHRpb25zO1xyXG4gICAgICB0aGlzLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICB0aGlzLmRhdGFsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRhdGFsaXN0XCIpO1xyXG4gICAgICB0aGlzLmRhdGFsaXN0LmlkID0gQ3VzdG9tRWxlbWVudC5uZXh0SWQudG9TdHJpbmcoKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmRhdGFsaXN0KTtcclxuXHJcbiAgICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgIHRoaXMuaW5wdXQuc2V0QXR0cmlidXRlKFwibGlzdFwiLCB0aGlzLmRhdGFsaXN0LmlkKTtcclxuICAgICAgdGhpcy5pbnB1dC5wbGFjZWhvbGRlciA9IGAke3RoaXMuZ2V0QXR0cmlidXRlKFwidHlwZVwiKX0uLi5gO1xyXG4gICAgICB0aGlzLmlucHV0LnNwZWxsY2hlY2sgPSBmYWxzZTtcclxuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTLCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOUFVULCB0aGlzLmhuZElucHV0KTtcclxuICAgICAgdGhpcy5pbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9VUCwgdGhpcy5obmRLZXkpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuaW5wdXQpO1xyXG5cclxuICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICB0aGlzLmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNMSUNLLCB0aGlzLmhuZENsaWNrKTtcclxuICAgICAgdGhpcy5idXR0b24uaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbik7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiB1bmtub3duIHtcclxuICAgICAgY29uc3Qgb3B0aW9uczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB0aGlzLmdldE9wdGlvbnMoKTtcclxuICAgICAgcmV0dXJuIG9wdGlvbnNbdGhpcy5pbnB1dC52YWx1ZV07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IHsgbmFtZT86IHN0cmluZyB9KTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmlucHV0ID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgY29uc3QgdmFsdWU6IHN0cmluZyA9IF92YWx1ZSA/IF92YWx1ZS5uYW1lID8/IF92YWx1ZS50b1N0cmluZygpIDogXCJcIjtcclxuICAgICAgY29uc3QgYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcclxuICAgICAgYnV0dG9uLmhpZGRlbiA9ICF2YWx1ZTtcclxuICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kQ2xpY2sgPSAoX2V2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuaW5wdXQudmFsdWUgPSBcIlwiO1xyXG4gICAgICB0aGlzLmJ1dHRvbi5oaWRkZW4gPSB0cnVlO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULkNIQU5HRSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEZvY3VzRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5kYXRhbGlzdC5pbm5lckhUTUwgPSBcIlwiOyAvLyBjbGVhciBwcmV2aW91cyBlbnRyaWVzXHJcbiAgICAgIGNvbnN0IG9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0gdGhpcy5nZXRPcHRpb25zKCk7XHJcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcclxuICAgICAgICBjb25zdCBlbnRyeTogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgIGVudHJ5LnZhbHVlID0ga2V5O1xyXG4gICAgICAgIHRoaXMuZGF0YWxpc3QuYXBwZW5kQ2hpbGQoZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kSW5wdXQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmJ1dHRvbi5oaWRkZW4gPSAhKF9ldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRLZXkoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBjb25zdCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHRoaXMuZ2V0T3B0aW9ucygpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuaW5wdXQudmFsdWUgIT0gXCJcIiAmJiAhUmVmbGVjdC5oYXMob3B0aW9ucywgdGhpcy5pbnB1dC52YWx1ZSkpIHtcclxuICAgICAgICB0aGlzLnNldE11dGF0b3JWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHRoaXMudmFsdWUgPSBvcHRpb25zW3RoaXMuaW5wdXQudmFsdWVdO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlNFVF9WQUxVRSwgeyBidWJibGVzOiB0cnVlLCBkZXRhaWw6IHsgdmFsdWU6IHRoaXMudmFsdWUgfSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZ2V0T3B0aW9ucygpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUkVRVUVTVF9PUFRJT05TLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIFJlcHJlc2VudHMgYSBzaW5nbGUgZGlnaXQgbnVtYmVyIHRvIGJlIHVzZWQgaW4gZ3JvdXBzIHRvIHJlcHJlc2VudCBhIG11bHRpZGlnaXQgdmFsdWUuXHJcbiAgICogSXMgdGFiYmFibGUgYW5kIGluLS9kZWNyZWFzZXMgcHJldmlvdXMgc2libGluZyB3aGVuIGZsb3dpbmcgb3Zlci91bmRlci5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudERpZ2l0IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1kaWdpdFwiLCBDdXN0b21FbGVtZW50RGlnaXQpO1xyXG4gICAgcHJvdGVjdGVkIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdmFsdWUoX3ZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgX3ZhbHVlID0gTWF0aC50cnVuYyhfdmFsdWUpO1xyXG4gICAgICBpZiAoX3ZhbHVlID4gOSB8fCBfdmFsdWUgPCAwKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy50ZXh0Q29udGVudCA9IF92YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMudGV4dENvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMudmFsdWUgPSAwO1xyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gLTE7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBhZGQoX2FkZGVuZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIF9hZGRlbmQgPSBNYXRoLnRydW5jKF9hZGRlbmQpO1xyXG4gICAgICBpZiAoX2FkZGVuZCA9PSAwKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfYWRkZW5kID4gMCkge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlIDwgOSlcclxuICAgICAgICAgIHRoaXMudmFsdWUrKztcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGxldCBwcmV2OiBDdXN0b21FbGVtZW50RGlnaXQgPSA8Q3VzdG9tRWxlbWVudERpZ2l0PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmICghKHByZXYgJiYgcHJldiBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnREaWdpdCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIHByZXYuYWRkKDEpO1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlID4gMClcclxuICAgICAgICAgIHRoaXMudmFsdWUtLTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGxldCBwcmV2OiBDdXN0b21FbGVtZW50RGlnaXQgPSA8Q3VzdG9tRWxlbWVudERpZ2l0PnRoaXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGlmICghKHByZXYgJiYgcHJldiBpbnN0YW5jZW9mIEN1c3RvbUVsZW1lbnREaWdpdCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIHByZXYuYWRkKC0xKTtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSA5O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICAvKipcclxuICAgKiBBIHN0YW5kYXJkIGNoZWNrYm94IHdpdGggYSBsYWJlbCB0byBpdFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50SW5pdGlhbGl6ZXIgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2UtaW5pdGlhbGl6ZXJcIiwgQ3VzdG9tRWxlbWVudEluaXRpYWxpemVyKTtcclxuXHJcbiAgICBwdWJsaWMgYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHB1YmxpYyBvdXRwdXQ6IEhUTUxPdXRwdXRFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgICBpZiAoIV9hdHRyaWJ1dGVzLmxhYmVsKVxyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgX2F0dHJpYnV0ZXMua2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgdGhpcy5vdXRwdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3V0cHV0XCIpO1xyXG4gICAgICB0aGlzLm91dHB1dC52YWx1ZSA9IFwiPG51bGw+XCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5vdXRwdXQpO1xyXG5cclxuICAgICAgdGhpcy5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICB0aGlzLmJ1dHRvbi5pbm5lclRleHQgPSBcIitcIjtcclxuICAgICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5DTElDSywgdGhpcy5obmRDbGljayk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5idXR0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94IGFzIGJvb2xlYW4gdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBudWxsKTogdm9pZCB7XHJcbiAgICAgIC8vXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDbGljayA9IChfZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTklUSUFMSVpFX1ZBTFVFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfTtcclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21FbGVtZW50LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIEN1c3RvbUVsZW1lbnQgZnJvbSBhbiBIVE1MLVRlbXBsYXRlLVRhZ1xyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDdXN0b21FbGVtZW50VGVtcGxhdGUgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIHByaXZhdGUgc3RhdGljIGZyYWdtZW50OiBNYXA8c3RyaW5nLCBEb2N1bWVudEZyYWdtZW50PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM/OiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCcm93c2VzIHRocm91Z2ggdGhlIHRlbXBsYXRlcyBpbiB0aGUgY3VycmVudCBkb2N1bWVudCBhbmQgcmVnaXN0ZXJzIHRoZSBvbmUgZGVmaW5pbmcgdGhlIGdpdmVuIHRhZ25hbWUuXHJcbiAgICAgKiBUbyBiZSBjYWxsZWQgZnJvbSBhIHNjcmlwdCB0YWcgaW1wbGVtZW50ZWQgd2l0aCB0aGUgdGVtcGxhdGUgaW4gSFRNTC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlcihfdGFnTmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IHRlbXBsYXRlIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZW1wbGF0ZVwiKSkge1xyXG4gICAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLmxvY2FsTmFtZSA9PSBfdGFnTmFtZSkge1xyXG4gICAgICAgICAgxpIuRGVidWcuZnVkZ2UoXCJSZWdpc3RlclwiLCB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkcmVuWzBdKTtcclxuICAgICAgICAgIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZS5mcmFnbWVudC5zZXQoX3RhZ05hbWUsIHRlbXBsYXRlLmNvbnRlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGlzIGVsZW1lbnQgaW4gYSBmb3JtYXQgY29tcGF0aWJsZSB3aXRoIFtbRnVkZ2VDb3JlLk11dGF0b3JdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHt9O1xyXG4gICAgICBsZXQgZWxlbWVudHM6IE5vZGVMaXN0T2Y8SFRNTElucHV0RWxlbWVudD4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJba2V5XCIpO1xyXG4gICAgICBmb3IgKGxldCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50KVxyXG4gICAgICAgICAgbXV0YXRvcltrZXldID0gZWxlbWVudC5nZXRNdXRhdG9yVmFsdWUoKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBtdXRhdG9yW2tleV0gPSBlbGVtZW50LnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBtdXRhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX211dGF0b3I6IMaSLk11dGF0b3IpOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQga2V5IGluIF9tdXRhdG9yKSB7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoYFtrZXk9XCIke2tleX1cIl1gKTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICDGki5EZWJ1Zy5sb2coYENvdWxkbid0IGZpbmQgJHtrZXl9IGluYCwgdGhpcyk7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBDdXN0b21FbGVtZW50KVxyXG4gICAgICAgICAgZWxlbWVudC5zZXRNdXRhdG9yVmFsdWUoX211dGF0b3Jba2V5XSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZWxlbWVudC52YWx1ZSA9IF9tdXRhdG9yW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lLCB0aGUgZWxlbWVudCBnZXRzIGNvbnN0cnVjdGVkIGFzIGEgZGVlcCBjbG9uZSBvZiB0aGUgdGVtcGxhdGUuXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIGxldCBmcmFnbWVudDogRG9jdW1lbnRGcmFnbWVudCA9IEN1c3RvbUVsZW1lbnRUZW1wbGF0ZS5mcmFnbWVudC5nZXQoUmVmbGVjdC5nZXQodGhpcy5jb25zdHJ1Y3RvciwgXCJ0YWdcIikpO1xyXG4gICAgICBsZXQgY29udGVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZnJhZ21lbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblxyXG4gICAgICBsZXQgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSB0aGlzLnN0eWxlO1xyXG4gICAgICBmb3IgKGxldCBlbnRyeSBvZiBjb250ZW50LnN0eWxlKSB7XHJcbiAgICAgICAgc3R5bGUuc2V0UHJvcGVydHkoZW50cnksIFJlZmxlY3QuZ2V0KGNvbnRlbnQuc3R5bGUsIGVudHJ5KSk7XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY29udGVudC5jaGlsZE5vZGVzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChjaGlsZC5jbG9uZU5vZGUodHJ1ZSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgaWYgKGxhYmVsKVxyXG4gICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCJDdXN0b21FbGVtZW50VGVtcGxhdGUudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRNYXRyaXgzeDMgZXh0ZW5kcyBDdXN0b21FbGVtZW50VGVtcGxhdGUge1xyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogxpIuTXV0YXRvciB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IHsgdHJhbnNsYXRpb246IHt9LCBzY2FsaW5nOiB7fSwgcm90YXRpb246IDAgfTtcclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCB2ZWN0b3Igb2YgW1widHJhbnNsYXRpb25cIiwgXCJzY2FsaW5nXCJdKVxyXG4gICAgICAgIGZvciAobGV0IGRpbWVuc2lvbiBvZiBbXCJ4XCIsIFwieVwiXSlcclxuICAgICAgICAgICg8xpIuTXV0YXRvcj5tdXRhdG9yW3ZlY3Rvcl0pW2RpbWVuc2lvbl0gPSBzdGVwcGVyc1tjb3VudCsrXS5nZXRNdXRhdG9yVmFsdWUoKTtcclxuXHJcbiAgICAgIG11dGF0b3JbXCJyb3RhdGlvblwiXSA9IHN0ZXBwZXJzW2NvdW50KytdLmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInNjYWxpbmdcIl0pXHJcbiAgICAgICAgZm9yIChsZXQgZGltZW5zaW9uIG9mIFtcInhcIiwgXCJ5XCJdKVxyXG4gICAgICAgICAgc3RlcHBlcnNbY291bnQrK10uc2V0TXV0YXRvclZhbHVlKE51bWJlcigoPMaSLk11dGF0b3I+X211dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSkpO1xyXG4gICAgICBzdGVwcGVyc1tjb3VudCsrXS5zZXRNdXRhdG9yVmFsdWUoTnVtYmVyKF9tdXRhdG9yW1wicm90YXRpb25cIl0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIHN1cGVyLmNvbm5lY3RlZENhbGxiYWNrKCk7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKFwiTWF0cml4IENhbGxiYWNrXCIpO1xyXG4gICAgICBsZXQgbGFiZWw6IEhUTUxMYWJlbEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJsYWJlbFwiKTtcclxuICAgICAgbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLmdldEF0dHJpYnV0ZShcImxhYmVsXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIkN1c3RvbUVsZW1lbnRUZW1wbGF0ZS50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudE1hdHJpeDR4NCBleHRlbmRzIEN1c3RvbUVsZW1lbnRUZW1wbGF0ZSB7XHJcblxyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBPYmplY3Qge1xyXG4gICAgICBsZXQgc3RlcHBlcnM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudFN0ZXBwZXI+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwiZnVkZ2Utc3RlcHBlclwiKTtcclxuICAgICAgbGV0IG11dGF0b3I6IMaSLk11dGF0b3IgPSB7IHRyYW5zbGF0aW9uOiB7fSwgcm90YXRpb246IHt9LCBzY2FsaW5nOiB7fSB9O1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInJvdGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIiwgXCJ6XCJdKVxyXG4gICAgICAgICAgKDzGki5NdXRhdG9yPm11dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSA9IHN0ZXBwZXJzW2NvdW50KytdLmdldE11dGF0b3JWYWx1ZSgpO1xyXG4gICAgICByZXR1cm4gbXV0YXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF9tdXRhdG9yOiDGki5NdXRhdG9yKTogdm9pZCB7XHJcbiAgICAgIGxldCBzdGVwcGVyczogTm9kZUxpc3RPZjxDdXN0b21FbGVtZW50U3RlcHBlcj4gPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJmdWRnZS1zdGVwcGVyXCIpO1xyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHZlY3RvciBvZiBbXCJ0cmFuc2xhdGlvblwiLCBcInJvdGF0aW9uXCIsIFwic2NhbGluZ1wiXSlcclxuICAgICAgICBmb3IgKGxldCBkaW1lbnNpb24gb2YgW1wieFwiLCBcInlcIiwgXCJ6XCJdKVxyXG4gICAgICAgICAgc3RlcHBlcnNbY291bnQrK10uc2V0TXV0YXRvclZhbHVlKE51bWJlcigoPMaSLk11dGF0b3I+X211dGF0b3JbdmVjdG9yXSlbZGltZW5zaW9uXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuY29ubmVjdGVkQ2FsbGJhY2soKTtcclxuICAgICAgLy8gY29uc29sZS5sb2coXCJNYXRyaXggQ2FsbGJhY2tcIik7XHJcbiAgICAgIGxldCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcImxhYmVsXCIpO1xyXG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwibGFiZWxcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEFuIGludGVyYWN0aXZlIG51bWJlciBzdGVwcGVyIHdpdGggZXhwb25lbnRpYWwgZGlzcGxheSBhbmQgY29tcGxleCBoYW5kbGluZyB1c2luZyBrZXlib2FyZCBhbmQgbW91c2VcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ3VzdG9tRWxlbWVudE51bWJlciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1udW1iZXJcIiwgQ3VzdG9tRWxlbWVudE51bWJlcik7XHJcbiAgICBwdWJsaWMgdmFsdWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBpbnB1dDogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIGRyYWdnaW5nOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBzdGFydFZhbHVlOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzdGFydERlY2ltYWxzOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBkZWx0YTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgcGl4ZWxzOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzcGVlZDogbnVtYmVyID0gMC4wMTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2F0dHJpYnV0ZXM/OiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmIChfYXR0cmlidXRlcyAmJiBfYXR0cmlidXRlc1tcInZhbHVlXCJdKVxyXG4gICAgICAgIHRoaXMudmFsdWUgPSBwYXJzZUZsb2F0KF9hdHRyaWJ1dGVzW1widmFsdWVcIl0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbWluKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlucHV0Lm1pbiA9PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VGbG9hdCh0aGlzLmlucHV0Lm1pbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtYXgoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5wdXQubWF4ID09IFwiXCIgPyB1bmRlZmluZWQgOiBwYXJzZUZsb2F0KHRoaXMuaW5wdXQubWF4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHN0ZXAoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaW5wdXQuc3RlcCA9PSBcIlwiID8gdW5kZWZpbmVkIDogcGFyc2VGbG9hdCh0aGlzLmlucHV0LnN0ZXApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICB0aGlzLmlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICB0aGlzLmlucHV0LnR5cGUgPSBcInRleHRcIjsgLy8gdXNlIHRleHQgdG8gZW5mb3JjZSBkZWNpbWFsIHBvaW50IG5vdGF0aW9uXHJcbiAgICAgIHRoaXMuaW5wdXQubWluID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJtaW5cIikgPz8gXCJcIjtcclxuICAgICAgdGhpcy5pbnB1dC5tYXggPSB0aGlzLmdldEF0dHJpYnV0ZShcIm1heFwiKSA/PyBcIlwiO1xyXG4gICAgICB0aGlzLmlucHV0LnN0ZXAgPSB0aGlzLmdldEF0dHJpYnV0ZShcInN0ZXBcIikgPz8gXCJcIjtcclxuICAgICAgdGhpcy5pbnB1dC5pbnB1dE1vZGUgPSBcImRlY2ltYWxcIjtcclxuXHJcbiAgICAgIHRoaXMuaW5wdXQub25jaGFuZ2UgPSB0aGlzLmhuZENoYW5nZTtcclxuICAgICAgdGhpcy5pbnB1dC5vbmlucHV0ID0gdGhpcy5obmRJbnB1dDtcclxuICAgICAgdGhpcy5pbnB1dC5vbmtleWRvd24gPSB0aGlzLmhuZEtleTtcclxuICAgICAgdGhpcy5pbnB1dC5vbmtleXVwID0gdGhpcy5obmRLZXk7XHJcbiAgICAgIHRoaXMuaW5wdXQub25mb2N1cyA9IHRoaXMuaG5kRm9jdXM7XHJcbiAgICAgIHRoaXMuaW5wdXQub25wb2ludGVyZG93biA9IHRoaXMuaG5kUG9pbnRlcmRvd25JbnB1dDtcclxuICAgICAgdGhpcy5pbnB1dC5vbnBvaW50ZXJ1cCA9IHRoaXMuaG5kUG9pbnRlcnVwSW5wdXQ7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuaW5wdXQpO1xyXG5cclxuICAgICAgdGhpcy5zZXRNdXRhdG9yVmFsdWUocGFyc2VGbG9hdCh0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmhuZFBvaW50ZXJ1cFdpbmRvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBpZiAoX3ZhbHVlID09IHVuZGVmaW5lZCB8fCBpc05hTihfdmFsdWUpKSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG1pbjogbnVtYmVyID0gdGhpcy5taW47XHJcbiAgICAgIGlmIChtaW4gIT0gbnVsbClcclxuICAgICAgICBfdmFsdWUgPSBNYXRoLm1heChfdmFsdWUsIG1pbik7XHJcblxyXG4gICAgICBjb25zdCBtYXg6IG51bWJlciA9IHRoaXMubWF4O1xyXG4gICAgICBpZiAobWF4ICE9IG51bGwpXHJcbiAgICAgICAgX3ZhbHVlID0gTWF0aC5taW4oX3ZhbHVlLCBtYXgpO1xyXG5cclxuICAgICAgY29uc3Qgc3RlcDogbnVtYmVyID0gdGhpcy5zdGVwO1xyXG4gICAgICBpZiAoc3RlcCAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgZGVjaW1hbHM6IG51bWJlciA9IHRoaXMuZGVjaW1hbHMoc3RlcCk7XHJcbiAgICAgICAgX3ZhbHVlID0gRnVkZ2VDb3JlLkNhbGMuc25hcChfdmFsdWUsIHN0ZXApO1xyXG4gICAgICAgIF92YWx1ZSA9IHBhcnNlRmxvYXQoX3ZhbHVlLnRvRml4ZWQoZGVjaW1hbHMpKTtcclxuICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gX3ZhbHVlLnRvRml4ZWQoZGVjaW1hbHMpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgICB0aGlzLmlucHV0LnZhbHVlID0gX3ZhbHVlLnRvRml4ZWQoTWF0aC5tYXgodGhpcy5zdGFydERlY2ltYWxzLCB0aGlzLmRlY2ltYWxzKHRoaXMuc3BlZWQpKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5pbnB1dC52YWx1ZSA9IF92YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlcmRvd25JbnB1dCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PSB0aGlzLmlucHV0KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5obmRQb2ludGVybW92ZVdpbmRvdyk7XHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMuaG5kUG9pbnRlcnVwV2luZG93KTtcclxuXHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJtb3ZlV2luZG93ID0gKF9ldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLnNwZWVkID0gdGhpcy5zdGVwID8/IDAuMDE7XHJcbiAgICAgIGlmIChfZXZlbnQuY3RybEtleSlcclxuICAgICAgICB0aGlzLnNwZWVkICo9IDAuMTtcclxuICAgICAgZWxzZSBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgIHRoaXMuc3BlZWQgKj0gMTA7XHJcblxyXG4gICAgICB0aGlzLnBpeGVscyArPSBfZXZlbnQubW92ZW1lbnRYO1xyXG5cclxuICAgICAgY29uc3QgbW92ZTogbnVtYmVyID0gTWF0aC50cnVuYyh0aGlzLnBpeGVscyAvIDIpO1xyXG5cclxuICAgICAgaWYgKG1vdmUgIT0gMCkge1xyXG4gICAgICAgIGlmICghdGhpcy5kcmFnZ2luZykge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmRlbHRhID0gMDtcclxuICAgICAgICAgIHRoaXMuc3RhcnRWYWx1ZSA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICB0aGlzLnN0YXJ0RGVjaW1hbHMgPSB0aGlzLmRlY2ltYWxzKHRoaXMuaW5wdXQudmFsdWUpO1xyXG5cclxuICAgICAgICAgIHRoaXMuaW5wdXQucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgICAgICB0aGlzLmlucHV0LmNsYXNzTGlzdC5hZGQoXCJoaWRlLWNhcnJldFwiKTtcclxuICAgICAgICAgIHRoaXMuaW5wdXQuZm9jdXMoKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucGl4ZWxzIC09IG1vdmUgKiAyO1xyXG4gICAgICAgIHRoaXMuZGVsdGEgKz0gbW92ZSAqIHRoaXMuc3BlZWQ7XHJcblxyXG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gdGhpcy5zdGFydFZhbHVlICsgdGhpcy5kZWx0YTtcclxuICAgICAgICB0aGlzLnNldE11dGF0b3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJ1cFdpbmRvdyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5ibHVyKCk7XHJcbiAgICAgICAgdGhpcy5pbnB1dC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZS1jYXJyZXRcIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0VmFsdWUgIT0gdGhpcy52YWx1ZSlcclxuICAgICAgICAgIHRoaXMuaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJjaGFuZ2VcIiwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCA9PSB0aGlzLmlucHV0KVxyXG4gICAgICAgIGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xyXG5cclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCB0aGlzLmhuZFBvaW50ZXJtb3ZlV2luZG93KTtcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgdGhpcy5obmRQb2ludGVydXBXaW5kb3cpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJ1cElucHV0ID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpXHJcbiAgICAgICAgdGhpcy5pbnB1dC5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpXHJcbiAgICAgICAgdGhpcy5pbnB1dC5zZWxlY3QoKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRDaGFuZ2UgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLnNldE11dGF0b3JWYWx1ZShwYXJzZUZsb2F0KHRoaXMuaW5wdXQudmFsdWUpKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnB1dCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgLy8gcHJldmVudCBidWJibGluZyBvZiBpbnB1dCBldmVudCB0byBjb250cm9sbGVyO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEtleSA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGRlY2ltYWxzKF9udW1iZXI6IG51bWJlciB8IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IF9udW1iZXIudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCdlJyk7XHJcbiAgICAgIGNvbnN0IG1hbnRpc3NhOiBzdHJpbmcgPSBwYXJ0c1swXTtcclxuICAgICAgY29uc3QgZXhwOiBudW1iZXIgPSBwYXJ0cy5sZW5ndGggPiAxID8gcGFyc2VJbnQocGFydHNbMV0sIDEwKSA6IDA7XHJcbiAgICAgIGNvbnN0IGZyYWM6IHN0cmluZyA9IG1hbnRpc3NhLnNwbGl0KCcuJylbMV0gfHwgJyc7XHJcbiAgICAgIGNvbnN0IGRlY2ltYWxzOiBudW1iZXIgPSBNYXRoLm1heCgwLCBmcmFjLmxlbmd0aCAtIGV4cCk7XHJcbiAgICAgIHJldHVybiBkZWNpbWFscztcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgc3RhbmRhcmQgdGV4dCBpbnB1dCBmaWVsZCB3aXRoIGEgbGFiZWwgdG8gaXQuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRPdXRwdXQgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2Utb3V0cHV0XCIsIEN1c3RvbUVsZW1lbnRPdXRwdXQpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMpIHtcclxuICAgICAgc3VwZXIoX2F0dHJpYnV0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudCB3aGVuIGNvbm5lY3RlZCB0aGUgZmlyc3QgdGltZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29ubmVjdGVkQ2FsbGJhY2soKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmFwcGVuZExhYmVsKCk7XHJcblxyXG4gICAgICBsZXQgb3V0cHV0OiBIVE1MT3V0cHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvdXRwdXRcIik7XHJcbiAgICAgIG91dHB1dC5pZCA9IEN1c3RvbUVsZW1lbnQubmV4dElkO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKG91dHB1dCk7XHJcbiAgICAgIHRoaXMuc2V0TXV0YXRvclZhbHVlKHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBjb250ZW50IG9mIHRoZSBpbnB1dCBlbGVtZW50XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNdXRhdG9yVmFsdWUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGNvbnRlbnQgb2YgdGhlIGlucHV0IGVsZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IEZ1ZGdlQ29yZS5HZW5lcmFsKTogdm9pZCB7XHJcbiAgICAgIGxldCBvdXRwdXQ6IEhUTUxPdXRwdXRFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKFwib3V0cHV0XCIpO1xyXG4gICAgICBvdXRwdXQudmFsdWUgPSBfdmFsdWUgPz8gdGhpcy5nZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiKTtcclxuICAgICAgaWYgKF92YWx1ZSlcclxuICAgICAgICBvdXRwdXQuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlaG9sZGVyXCIpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgb3V0cHV0LmNsYXNzTGlzdC5hZGQoXCJwbGFjZWhvbGRlclwiKTtcclxuXHJcbiAgICAgIC8vIHRoaXMucXVlcnlTZWxlY3RvcihcIm91dHB1dFwiKS52YWx1ZSA9IF92YWx1ZSA/PyB0aGlzLmdldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgZHJvcGRvd24gbWVudSB0byBkaXNwbGF5IGVudW1zXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRTZWxlY3QgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2Utc2VsZWN0XCIsIEN1c3RvbUVsZW1lbnRTZWxlY3QsIE9iamVjdCk7XHJcbiAgICBwdWJsaWMgY29udGVudDogT2JqZWN0O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlczogQ3VzdG9tRWxlbWVudEF0dHJpYnV0ZXMsIF9jb250ZW50OiBPYmplY3QgPSB7fSkge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICAgIGlmICghX2F0dHJpYnV0ZXMubGFiZWwpXHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBfYXR0cmlidXRlcy5rZXkpO1xyXG4gICAgICB0aGlzLmNvbnRlbnQgPSBfY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQgd2hlbiBjb25uZWN0ZWQgdGhlIGZpcnN0IHRpbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy5pbml0aWFsaXplZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IHNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIpO1xyXG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5jb250ZW50KSB7XHJcbiAgICAgICAgbGV0IHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgPSBSZWZsZWN0LmdldCh0aGlzLmNvbnRlbnQsIGtleSk7XHJcbiAgICAgICAgaWYgKFJlZmxlY3QuaGFzKHRoaXMuY29udGVudCwgdmFsdWUpICYmIFJlZmxlY3QuZ2V0KHRoaXMuY29udGVudCwgdmFsdWUpICE9PSBrZXkpIC8vIGZpbHRlciBudW1iZXIga2V5cyBvdXQgb2Ygc2ltcGxlIGVudW0gXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICBsZXQgZW50cnk6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICBlbnRyeS50ZXh0ID0ga2V5O1xyXG4gICAgICAgIGVudHJ5LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgdHlwZW9mIHZhbHVlKTtcclxuICAgICAgICBlbnRyeS52YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKSk7XHJcbiAgICAgICAgaWYgKGVudHJ5LnZhbHVlID09IHRoaXMuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikpIHtcclxuICAgICAgICAgIGVudHJ5LnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZWN0LmFkZChlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgICAgc2VsZWN0LnRhYkluZGV4ID0gMDtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChzZWxlY3QpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0cmlldmVzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94IGFzIGJvb2xlYW4gdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE11dGF0b3JWYWx1ZSgpOiBzdHJpbmcgfCBudW1iZXIge1xyXG4gICAgICBsZXQgc2VsZWN0OiBIVE1MU2VsZWN0RWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihcInNlbGVjdFwiKTtcclxuICAgICAgbGV0IHR5cGU6IHN0cmluZyA9IHNlbGVjdC5vcHRpb25zW3NlbGVjdC5zZWxlY3RlZEluZGV4XT8uZ2V0QXR0cmlidXRlKFwidHlwZVwiKSB8fCBcInN0cmluZ1wiO1xyXG4gICAgICByZXR1cm4gdHlwZSA9PSBcIm51bWJlclwiID8gcGFyc2VGbG9hdChzZWxlY3QudmFsdWUpIDogc2VsZWN0LnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBzdGF0dXMgb2YgdGhlIGNoZWNrYm94XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRNdXRhdG9yVmFsdWUoX3ZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwic2VsZWN0XCIpLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgICAvLyB0aGlzLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQW4gaW50ZXJhY3RpdmUgbnVtYmVyIHN0ZXBwZXIgd2l0aCBleHBvbmVudGlhbCBkaXNwbGF5IGFuZCBjb21wbGV4IGhhbmRsaW5nIHVzaW5nIGtleWJvYXJkIGFuZCBtb3VzZVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDdXN0b21FbGVtZW50U3RlcHBlciBleHRlbmRzIEN1c3RvbUVsZW1lbnQge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tRWxlbWVudDogdm9pZCA9IEN1c3RvbUVsZW1lbnQucmVnaXN0ZXIoXCJmdWRnZS1zdGVwcGVyXCIsIEN1c3RvbUVsZW1lbnRTdGVwcGVyLCBOdW1iZXIpO1xyXG4gICAgcHVibGljIHZhbHVlOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfYXR0cmlidXRlcz86IEN1c3RvbUVsZW1lbnRBdHRyaWJ1dGVzKSB7XHJcbiAgICAgIHN1cGVyKF9hdHRyaWJ1dGVzKTtcclxuICAgICAgaWYgKF9hdHRyaWJ1dGVzICYmIF9hdHRyaWJ1dGVzW1widmFsdWVcIl0pXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHBhcnNlRmxvYXQoX2F0dHJpYnV0ZXNbXCJ2YWx1ZVwiXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMudGFiSW5kZXggPSAwO1xyXG5cclxuICAgICAgdGhpcy5hcHBlbmRMYWJlbCgpO1xyXG5cclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICBpbnB1dC50eXBlID0gXCJudW1iZXJcIjtcclxuICAgICAgaW5wdXQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5JTlBVVCwgKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHsgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyB9KTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChpbnB1dCk7XHJcblxyXG5cclxuICAgICAgbGV0IHNpZ246IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBzaWduLnRleHRDb250ZW50ID0gXCIrXCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoc2lnbik7XHJcbiAgICAgIGZvciAobGV0IGV4cDogbnVtYmVyID0gMjsgZXhwID4gLTQ7IGV4cC0tKSB7XHJcbiAgICAgICAgbGV0IGRpZ2l0OiBDdXN0b21FbGVtZW50RGlnaXQgPSBuZXcgQ3VzdG9tRWxlbWVudERpZ2l0KCk7XHJcbiAgICAgICAgZGlnaXQuc2V0QXR0cmlidXRlKFwiZXhwXCIsIGV4cC50b1N0cmluZygpKTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGRpZ2l0KTtcclxuICAgICAgICBpZiAoZXhwID09IDApXHJcbiAgICAgICAgICB0aGlzLmlubmVySFRNTCArPSBcIi5cIjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmlubmVySFRNTCArPSBcImVcIjtcclxuXHJcbiAgICAgIGxldCBleHA6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBleHAudGV4dENvbnRlbnQgPSBcIiswXCI7XHJcbiAgICAgIGV4cC50YWJJbmRleCA9IC0xO1xyXG4gICAgICBleHAuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImV4cFwiKTtcclxuICAgICAgdGhpcy5hcHBlbmRDaGlsZChleHApO1xyXG5cclxuXHJcbiAgICAgIC8vIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZElucHV0KTtcclxuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5CTFVSLCB0aGlzLmhuZElucHV0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkJMVVIsIHRoaXMuaG5kRm9jdXMpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULldIRUVMLCB0aGlzLmhuZFdoZWVsKTtcclxuICAgICAgdGhpcy5kaXNwbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZS0vQWN0aXZhdGVzIHRhYmJpbmcgZm9yIHRoZSBpbm5lciBkaWdpdHNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFjdGl2YXRlSW5uZXJUYWJzKF9vbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IF9vbiA/IDAgOiAtMTtcclxuXHJcbiAgICAgIGxldCBzcGFuczogTm9kZUxpc3RPZjxIVE1MU3BhbkVsZW1lbnQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwic3BhblwiKTtcclxuICAgICAgc3BhbnNbMV0udGFiSW5kZXggPSBpbmRleDtcclxuXHJcbiAgICAgIGxldCBkaWdpdHM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudERpZ2l0PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLWRpZ2l0XCIpO1xyXG4gICAgICBmb3IgKGxldCBkaWdpdCBvZiBkaWdpdHMpXHJcbiAgICAgICAgZGlnaXQudGFiSW5kZXggPSBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE9wZW5zL0Nsb3NlcyBhIHN0YW5kYXJkIG51bWJlciBpbnB1dCBmb3IgdHlwaW5nIHRoZSB2YWx1ZSBhdCBvbmNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvcGVuSW5wdXQoX29wZW46IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcbiAgICAgIGlmIChfb3Blbikge1xyXG4gICAgICAgIGlucHV0LnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgICAgIGlucHV0LnZhbHVlID0gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdmFsdWUgb2YgdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIGl0cyB2YWx1ZSBhbmQgZGlzcGxheXMgaXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE11dGF0b3JWYWx1ZShfdmFsdWU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBpZiAoX3ZhbHVlID09IHVuZGVmaW5lZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlIG1hbnRpc3NhIGFuZCBleHBvbmVudCBzZXBhcmF0ZWx5IGFzIGFuIGFycmF5IG9mIHR3byBtZW1iZXJzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNYW50aXNzYUFuZEV4cG9uZW50KCk6IG51bWJlcltdIHtcclxuICAgICAgbGV0IHByZWM6IHN0cmluZyA9IHRoaXMudmFsdWUudG9FeHBvbmVudGlhbCg2KTtcclxuICAgICAgbGV0IGV4cDogbnVtYmVyID0gcGFyc2VJbnQocHJlYy5zcGxpdChcImVcIilbMV0pO1xyXG4gICAgICBsZXQgZXhwMzogbnVtYmVyID0gTWF0aC50cnVuYyhleHAgLyAzKTtcclxuICAgICAgbGV0IG1hbnRpc3NhOiBudW1iZXIgPSB0aGlzLnZhbHVlIC8gTWF0aC5wb3coMTAsIGV4cDMgKiAzKTtcclxuICAgICAgbWFudGlzc2EgPSBNYXRoLnJvdW5kKG1hbnRpc3NhICogMTAwMCkgLyAxMDAwO1xyXG4gICAgICByZXR1cm4gW21hbnRpc3NhLCBleHAzICogM107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXRyaWV2ZXMgdGhpcyB2YWx1ZSBhcyBhIHN0cmluZ1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IFttYW50aXNzYSwgZXhwXTogbnVtYmVyW10gPSB0aGlzLmdldE1hbnRpc3NhQW5kRXhwb25lbnQoKTtcclxuICAgICAgbGV0IHByZWZpeE1hbnRpc3NhOiBzdHJpbmcgPSAobWFudGlzc2EgPCAwKSA/IFwiXCIgOiBcIitcIjtcclxuICAgICAgbGV0IHByZWZpeEV4cDogc3RyaW5nID0gKGV4cCA8IDApID8gXCJcIiA6IFwiK1wiO1xyXG4gICAgICByZXR1cm4gcHJlZml4TWFudGlzc2EgKyBtYW50aXNzYS50b0ZpeGVkKDMpICsgXCJlXCIgKyBwcmVmaXhFeHAgKyBleHA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwbGF5cyB0aGlzIHZhbHVlIGJ5IHNldHRpbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBkaWdpdHMgYW5kIHRoZSBleHBvbmVudFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGRpc3BsYXkoKTogdm9pZCB7XHJcbiAgICAgIGxldCBkaWdpdHM6IE5vZGVMaXN0T2Y8Q3VzdG9tRWxlbWVudERpZ2l0PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLWRpZ2l0XCIpO1xyXG4gICAgICBsZXQgc3BhbnM6IE5vZGVMaXN0T2Y8SFRNTFNwYW5FbGVtZW50PiA9IHRoaXMucXVlcnlTZWxlY3RvckFsbChcInNwYW5cIik7XHJcblxyXG4gICAgICBpZiAoIWlzRmluaXRlKHRoaXMudmFsdWUpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcG9zOiBudW1iZXIgPSAwOyBwb3MgPCBkaWdpdHMubGVuZ3RoOyBwb3MrKykge1xyXG4gICAgICAgICAgbGV0IGRpZ2l0OiBDdXN0b21FbGVtZW50RGlnaXQgPSBkaWdpdHNbNSAtIHBvc107XHJcbiAgICAgICAgICBkaWdpdC5pbm5lckhUTUwgPSBcIiAg4oieICAgXCJbNSAtIHBvc107XHJcbiAgICAgICAgICBzcGFuc1sxXS50ZXh0Q29udGVudCA9IFwiICBcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICBsZXQgW21hbnRpc3NhLCBleHBdOiBzdHJpbmdbXSA9IHRoaXMudG9TdHJpbmcoKS5zcGxpdChcImVcIik7XHJcbiAgICAgIHNwYW5zWzBdLnRleHRDb250ZW50ID0gdGhpcy52YWx1ZSA8IDAgPyBcIi1cIiA6IFwiK1wiO1xyXG4gICAgICBzcGFuc1sxXS50ZXh0Q29udGVudCA9IGV4cDtcclxuXHJcbiAgICAgIG1hbnRpc3NhID0gbWFudGlzc2Euc3Vic3RyaW5nKDEpO1xyXG4gICAgICBtYW50aXNzYSA9IG1hbnRpc3NhLnJlcGxhY2UoXCIuXCIsIFwiXCIpO1xyXG4gICAgICBmb3IgKGxldCBwb3M6IG51bWJlciA9IDA7IHBvcyA8IGRpZ2l0cy5sZW5ndGg7IHBvcysrKSB7XHJcbiAgICAgICAgbGV0IGRpZ2l0OiBDdXN0b21FbGVtZW50RGlnaXQgPSBkaWdpdHNbNSAtIHBvc107XHJcbiAgICAgICAgaWYgKHBvcyA8IG1hbnRpc3NhLmxlbmd0aCkge1xyXG4gICAgICAgICAgbGV0IGNoYXI6IHN0cmluZyA9IG1hbnRpc3NhLmNoYXJBdChtYW50aXNzYS5sZW5ndGggLSAxIC0gcG9zKTtcclxuICAgICAgICAgIGRpZ2l0LnRleHRDb250ZW50ID0gY2hhcjtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIGRpZ2l0LmlubmVySFRNTCA9IFwiJm5ic3A7XCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhhbmRsZSBrZXlib2FyZCBpbnB1dCBvbiB0aGlzIGVsZW1lbnQgYW5kIGl0cyBkaWdpdHNcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBobmRLZXkgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBhY3RpdmU6IEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG4gICAgICBsZXQgbnVtRW50ZXJlZDogbnVtYmVyID0gX2V2ZW50LmtleS5jaGFyQ29kZUF0KDApIC0gNDg7XHJcblxyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAvLyBpZiBmb2N1cyBpcyBvbiBzdGVwcGVyLCBlbnRlciBpdCBhbmQgZm9jdXMgZGlnaXRcclxuICAgICAgaWYgKGFjdGl2ZSA9PSB0aGlzKSB7XHJcbiAgICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSOlxyXG4gICAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLk5VTVBBRF9FTlRFUjpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5TUEFDRTpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKHRydWUpO1xyXG4gICAgICAgICAgICAoPEhUTUxFbGVtZW50PnRoaXMucXVlcnlTZWxlY3RvckFsbChcImZ1ZGdlLWRpZ2l0XCIpWzJdKS5mb2N1cygpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5GMjpcclxuICAgICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKG51bUVudGVyZWQgPj0gMCAmJiBudW1FbnRlcmVkIDw9IDkpIHx8IF9ldmVudC5rZXkgPT0gXCItXCIgfHwgX2V2ZW50LmtleSA9PSBcIitcIikge1xyXG4gICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAvLyBfZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gaW5wdXQgZmllbGQgb3ZlcmxheSBpcyBhY3RpdmVcclxuICAgICAgaWYgKGFjdGl2ZS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICBpZiAoX2V2ZW50LmtleSA9PSDGki5LRVlCT0FSRF9DT0RFLkVOVEVSIHx8IF9ldmVudC5rZXkgPT0gxpIuS0VZQk9BUkRfQ09ERS5OVU1QQURfRU5URVIgfHwgX2V2ZW50LmtleSA9PSDGki5LRVlCT0FSRF9DT0RFLlRBQlVMQVRPUikge1xyXG4gICAgICAgICAgdGhpcy52YWx1ZSA9IE51bWJlcigoPEhUTUxJbnB1dEVsZW1lbnQ+YWN0aXZlKS52YWx1ZSk7XHJcbiAgICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICAgIHRoaXMub3BlbklucHV0KGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG51bUVudGVyZWQgPj0gMCAmJiBudW1FbnRlcmVkIDw9IDkpIHtcclxuICAgICAgICBsZXQgZGlmZmVyZW5jZTogbnVtYmVyID0gbnVtRW50ZXJlZCAtIE51bWJlcihhY3RpdmUudGV4dENvbnRlbnQpICogKHRoaXMudmFsdWUgPCAwID8gLTEgOiAxKTtcclxuICAgICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoZGlmZmVyZW5jZSk7XHJcblxyXG4gICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hY3RpdmUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgbmV4dC5mb2N1cygpO1xyXG5cclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5rZXkgPT0gXCItXCIgfHwgX2V2ZW50LmtleSA9PSBcIitcIikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSAoX2V2ZW50LmtleSA9PSBcIi1cIiA/IC0xIDogMSkgKiBNYXRoLmFicyh0aGlzLnZhbHVlKTtcclxuICAgICAgICB0aGlzLmRpc3BsYXkoKTtcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULklOUFVULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF9ldmVudC5jb2RlICE9IMaSLktFWUJPQVJEX0NPREUuVEFCVUxBVE9SKVxyXG4gICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgdGhpcy5jaGFuZ2VEaWdpdEZvY3Vzc2VkKC0xKTtcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuSU5QVVQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfVVA6XHJcbiAgICAgICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoKzEpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19MRUZUOlxyXG4gICAgICAgICAgKDxIVE1MRWxlbWVudD5hY3RpdmUucHJldmlvdXNFbGVtZW50U2libGluZykuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19SSUdIVDpcclxuICAgICAgICAgIGxldCBuZXh0OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5hY3RpdmUubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKG5leHQpXHJcbiAgICAgICAgICAgIG5leHQuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FTlRFUjpcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuTlVNUEFEX0VOVEVSOlxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5FU0M6XHJcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlSW5uZXJUYWJzKGZhbHNlKTtcclxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5GMjpcclxuICAgICAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnMoZmFsc2UpO1xyXG4gICAgICAgICAgdGhpcy5vcGVuSW5wdXQodHJ1ZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRXaGVlbCA9IChfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgbGV0IGNoYW5nZTogbnVtYmVyID0gX2V2ZW50LmRlbHRhWSA8IDAgPyArMSA6IC0xO1xyXG4gICAgICB0aGlzLmNoYW5nZURpZ2l0Rm9jdXNzZWQoY2hhbmdlKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5JTlBVVCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRJbnB1dCA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMub3BlbklucHV0KGZhbHNlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuYWN0aXZhdGVJbm5lclRhYnMoZmFsc2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGNoYW5nZURpZ2l0Rm9jdXNzZWQoX2Ftb3VudDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGxldCBkaWdpdDogRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIGlmIChkaWdpdCA9PSB0aGlzIHx8ICF0aGlzLmNvbnRhaW5zKGRpZ2l0KSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBfYW1vdW50ID0gTWF0aC5yb3VuZChfYW1vdW50KTtcclxuICAgICAgaWYgKF9hbW91bnQgPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAoZGlnaXQgPT0gdGhpcy5xdWVyeVNlbGVjdG9yKFwiW25hbWU9ZXhwXVwiKSkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIGxldCB2YWx1ZTogbnVtYmVyID0gdGhpcy52YWx1ZSAqIE1hdGgucG93KDEwLCBfYW1vdW50KTtcclxuICAgICAgICDGki5EZWJ1Zy5sb2codmFsdWUsIHRoaXMudmFsdWUpO1xyXG4gICAgICAgIGlmIChpc0Zpbml0ZSh2YWx1ZSkpXHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7IFxyXG4gICAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGV4cERpZ2l0OiBudW1iZXIgPSBwYXJzZUludChkaWdpdC5nZXRBdHRyaWJ1dGUoXCJleHBcIikpO1xyXG4gICAgICAvLyBAdHMtaWdub3JlIChtYW50aXNzYSBub3QgdXNlZClcclxuICAgICAgbGV0IFttYW50aXNzYSwgZXhwVmFsdWVdOiBudW1iZXJbXSA9IHRoaXMuZ2V0TWFudGlzc2FBbmRFeHBvbmVudCgpO1xyXG5cclxuICAgICAgbGV0IHByZXY6IG51bWJlciA9IHRoaXMudmFsdWU7XHJcbiAgICAgIHRoaXMudmFsdWUgKz0gX2Ftb3VudCAqIE1hdGgucG93KDEwLCBleHBEaWdpdCArIGV4cFZhbHVlKTtcclxuICAgICAgLy8gd29ya2Fyb3VuZCBwcmVjaXNpb24gcHJvYmxlbXMgb2YgamF2YXNjcmlwdFxyXG4gICAgICBpZiAoTWF0aC5hYnMocHJldiAvIHRoaXMudmFsdWUpID4gMTAwMClcclxuICAgICAgICB0aGlzLnZhbHVlID0gMDtcclxuXHJcblxyXG4gICAgICBsZXQgZXhwTmV3OiBudW1iZXI7XHJcbiAgICAgIFttYW50aXNzYSwgZXhwTmV3XSA9IHRoaXMuZ2V0TWFudGlzc2FBbmRFeHBvbmVudCgpO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhtYW50aXNzYSk7XHJcbiAgICAgIHRoaXMuc2hpZnRGb2N1cyhleHBOZXcgLSBleHBWYWx1ZSk7XHJcbiAgICAgIHRoaXMuZGlzcGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hpZnRGb2N1cyhfbkRpZ2l0czogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGxldCBzaGlmdEZvY3VzOiBFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcclxuICAgICAgaWYgKF9uRGlnaXRzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IDM7IGkrKylcclxuICAgICAgICAgIGlmIChfbkRpZ2l0cyA+IDApXHJcbiAgICAgICAgICAgIHNoaWZ0Rm9jdXMgPSBzaGlmdEZvY3VzLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2hpZnRGb2N1cyA9IHNoaWZ0Rm9jdXMucHJldmlvdXNFbGVtZW50U2libGluZztcclxuXHJcbiAgICAgICAgKDxIVE1MRWxlbWVudD5zaGlmdEZvY3VzKS5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEEgc3RhbmRhcmQgdGV4dCBpbnB1dCBmaWVsZCB3aXRoIGEgbGFiZWwgdG8gaXQuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEN1c3RvbUVsZW1lbnRUZXh0SW5wdXQgZXh0ZW5kcyBDdXN0b21FbGVtZW50IHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUVsZW1lbnQ6IHZvaWQgPSBDdXN0b21FbGVtZW50LnJlZ2lzdGVyKFwiZnVkZ2UtdGV4dGlucHV0XCIsIEN1c3RvbUVsZW1lbnRUZXh0SW5wdXQsIFN0cmluZyk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9hdHRyaWJ1dGVzOiBDdXN0b21FbGVtZW50QXR0cmlidXRlcykge1xyXG4gICAgICBzdXBlcihfYXR0cmlidXRlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50IHdoZW4gY29ubmVjdGVkIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25uZWN0ZWRDYWxsYmFjaygpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kTGFiZWwoKTtcclxuICAgICAgXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaW5wdXQuaWQgPSBDdXN0b21FbGVtZW50Lm5leHRJZDtcclxuICAgICAgaW5wdXQudmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHJpZXZlcyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TXV0YXRvclZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKS52YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgY29udGVudCBvZiB0aGUgaW5wdXQgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TXV0YXRvclZhbHVlKF92YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucXVlcnlTZWxlY3RvcihcImlucHV0XCIpLnZhbHVlID0gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIEJhc2VjbGFzcyBmb3IgY29tcGxleCB1aS1jb250cm9sbGVycyBoYW5kbGluZyBkYXRhIGluIHRhYmxlcywgdHJlZXMgb3Igb3RoZXIgc3RydWN0dXJlcyAgIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBEYXRhQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogU3RvcmVzIHJlZmVyZW5jZXMgdG8gc2VsZWN0ZWQgb2JqZWN0cy4gT3ZlcnJpZGUgd2l0aCBhIHJlZmVyZW5jZSBpbiBvdXRlciBzY29wZSwgaWYgc2VsZWN0aW9uIHNob3VsZCBhbHNvIG9wZXJhdGUgb3V0c2lkZSBvZiB0YWJsZSAqL1xyXG4gICAgcHVibGljIHNlbGVjdGlvbjogVFtdID0gW107XHJcbiAgICBcclxuICAgIC8qKiBcclxuICAgICAqIFJlbW92ZSB0aGUgb2JqZWN0cyB0byBiZSBkZWxldGVkLCBlLmcuIHRoZSBjdXJyZW50IHNlbGVjdGlvbiwgZnJvbSB0aGUgZGF0YSBzdHJ1Y3R1cmUgdGhlIHRhYmxlIHJlZmVycyB0byBhbmQgXHJcbiAgICAgKiByZXR1cm4gYSBsaXN0IG9mIHRob3NlIG9iamVjdHMgaW4gb3JkZXIgZm9yIHRoZSBhY2NvcmRpbmcge0BsaW5rIFRhYmxlSXRlbXN9IHRvIGJlIGRlbGV0ZWQgYWxzbyAgIFxyXG4gICAgICogQHBhcmFtIF9leHBlbmRhYmxlcyBUaGUgZXhwZW5kYWJsZSBvYmplY3RzIFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVsZXRlKF9leHBlbmRhYmxlczogVFtdKTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgcmV0dXJuIF9leHBlbmRhYmxlcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZWZlciBpdGVtcyB0byB0aGUgY2xpcGJvYXJkIGZvciBjb3B5ICYgcGFzdGUgICBcclxuICAgICAqIEBwYXJhbSBfZm9jdXMgVGhlIGl0ZW0gaGFzIHRoZSBmb2N1cyBhbmQgdGhhdCB3aWxsIGJlIGNvcGllZCBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LFxyXG4gICAgICogb3RoZXJ3aXNlIHRoZSBjdXJyZW50IHNlbGVjdGlvbiBpcyByZWZlcnJlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29weShfZm9jdXM6IFQsIF9vcGVyYXRpb246IENsaXBPcGVyYXRpb24pOiBUW10ge1xyXG4gICAgICBsZXQgaXRlbXM6IFRbXSA9IHRoaXMuc2VsZWN0aW9uLmxlbmd0aCA/IHRoaXMuc2VsZWN0aW9uIDogW19mb2N1c107XHJcbiAgICAgIENsaXBib2FyZC5jb3B5UGFzdGUuc2V0KGl0ZW1zLCBfb3BlcmF0aW9uKTtcclxuICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJlZmVyIG9iamVjdHMgdG8gdGhlIGNsaXBib2FyZCBmb3IgY29weSAmIHBhc3RlIGFuZCBkZWxldGUgdGhlbSBmcm9tIHRoaXMgY29udHJvbGxlciAgIFxyXG4gICAgICogQHBhcmFtIF9mb2N1cyBUaGUgaXRlbSB0aGF0IGhhcyB0aGUgZm9jdXMgYW5kIHRoYXQgd2lsbCBiZSBjdXQgaWYgdGhlIHNlbGVjdGlvbiBpcyBlbXB0eSxcclxuICAgICAqIG90aGVyd2lzZSB0aGUgd2hvbGUgc2VsZWN0aW9uIGdldHMgcmVmZXJyZWQgYW5kIGRlbGV0ZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFzeW5jIGN1dChfZm9jdXM6IFQsIF9vcGVyYXRpb246IENsaXBPcGVyYXRpb24pOiBQcm9taXNlPFRbXT4ge1xyXG4gICAgICBsZXQgaXRlbXM6IFRbXSA9IHRoaXMuY29weShfZm9jdXMsIF9vcGVyYXRpb24pO1xyXG4gICAgICBpdGVtcyA9IGF3YWl0IHRoaXMuZGVsZXRlKGl0ZW1zKTtcclxuICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFJldHJpZXZlIG9iamVjdHMgZnJvbSB0aGUgY2xpcGJvYXJkLCBwcm9jZXNzIGFuZCByZXR1cm4gdGhlbSB0byBhZGQgdG8gdGhlIHRhYmxlICAgXHJcbiAgICAgKiBTdGFuZGFyZCBiZWhhdmlvdXI6IGlmIHRoZSBjb3B5UGFzdGUgY2xpcGJvYXJkIHdhcyBmaWxsZWQgdXNpbmcgY29weSwgcmV0dXJuIGFuIGFycmF5IG9mIGNsb25lcyxcclxuICAgICAqIG90aGVyd2lzZSB0aGUgY29udGVudCBvZiB0aGUgY2xpcGJvYXJkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBwYXN0ZSgpOiBQcm9taXNlPFRbXT4ge1xyXG4gICAgICBsZXQgb2JqZWN0czogVFtdID0gQ2xpcGJvYXJkLmNvcHlQYXN0ZS5nZXQoKTtcclxuICAgICAgaWYgKENsaXBib2FyZC5jb3B5UGFzdGUub3BlcmF0aW9uID09IFwiY29weVwiKVxyXG4gICAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNsb25lKG9iamVjdHMpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIG9iamVjdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmVmZXIgb2JqZWN0cyB0byB0aGUgY2xpcGJvYXJkIGZvciBkcmFnICYgZHJvcCAgIFxyXG4gICAgICogQHBhcmFtIF9mb2N1cyBUaGUgaXRlbSB0aGF0IGhhcyB0aGUgZm9jdXMgYW5kIHRoYXQgd2lsbCBiZSBkcmFnZ2VkIGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksXHJcbiAgICAgKiBvdGhlcndpc2UgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGlzIHJlZmVycmVkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkcmFnU3RhcnQoX2ZvY3VzOiBUKTogdm9pZCB7XHJcbiAgICAgIC8vIGlmIHRoZSBmb2N1c3NlZCBpdGVtIGlzIGluIHRoZSBzZWxlY3Rpb24sIGRyYWcgdGhlIHdob2xlIHNlbGVjdGlvblxyXG4gICAgICBsZXQgaXRlbXM6IFRbXSA9IHRoaXMuc2VsZWN0aW9uLmluZGV4T2YoX2ZvY3VzKSA8IDAgPyBbX2ZvY3VzXSA6IHRoaXMuc2VsZWN0aW9uO1xyXG4gICAgICBDbGlwYm9hcmQuZHJhZ0Ryb3Auc2V0KGl0ZW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogXHJcbiAgICAgKiBSZXR1cm4gYWxsb3dlZCBkcmFnRHJvcC1lZmZlY3QgIFxyXG4gICAgICogU3RhbmRhcmQgYmVoYXZpb3VyOiBjaGVjayB0aGUgY3RybEtleSBmb3IgXCJjb3B5XCIgYW5kIHNoaWZ0S2V5IGZvciBcImxpbmtcIiwgb3RoZXJ3aXNlIHJldHVybiBcIm1vdmVcIiAgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkcmFnT3ZlcihfZXZlbnQ6IERyYWdFdmVudCk6IERST1BFRkZFQ1Qge1xyXG4gICAgICBsZXQgZHJvcEVmZmVjdDogRFJPUEVGRkVDVCA9IFwibW92ZVwiO1xyXG4gICAgICBpZiAoX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgZHJvcEVmZmVjdCA9IFwiY29weVwiO1xyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgIGRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgcmV0dXJuIGRyb3BFZmZlY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0cmlldmUgb2JqZWN0cyBmcm9tIHRoZSBjbGlwYm9hcmQsIHByb2Nlc3MgYW5kIHJldHVybiB0aGVtIHRvIGFkZCB0byB0aGUgdHJlZS5cclxuICAgICAqIFN0YW5kYXJkIGJlaGF2aW91cjogaWYge0BsaW5rOiBkcmFnT3Zlcn0geWllbGRzIFwiY29weVwiLCByZXR1cm4gYW4gYXJyYXkgb2YgY2xvbmVzIG9mIHRoZSBvYmplY3RzIGluLFxyXG4gICAgICogb3RoZXJ3aXNlIHRoZSBjb250ZW50IG9mIHRoZSBkcmFnRHJvcC1jbGlwYm9hcmQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhc3luYyBkcm9wKF9ldmVudDogRHJhZ0V2ZW50KTogUHJvbWlzZTxUW10+IHtcclxuICAgICAgbGV0IG9iamVjdHM6IFRbXSA9IENsaXBib2FyZC5kcmFnRHJvcC5nZXQoKTtcclxuICAgICAgaWYgKHRoaXMuZHJhZ092ZXIoX2V2ZW50KSA9PSBcImNvcHlcIilcclxuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5jbG9uZShvYmplY3RzKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBvYmplY3RzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBcclxuICAgICAqIENsb25lIG9iamVjdHMgYW5kIHJldHVybiBhbiBhcnJheSB3aXRoIHJlZmVyZW5jZXMgdG8gdGhlIGNsb25lc1xyXG4gICAgICogU3RhbmRhcmQgYmVoYXZpb3VyOiB1c2UgT2JqZWN0LmNyZWF0ZSB0byBjbG9uZSB0aGUgb2JqZWN0c1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXN5bmMgY2xvbmUoX29iamVjdHM6IFRbXSk6IFByb21pc2U8VFtdPiB7XHJcbiAgICAgIHJldHVybiBfb2JqZWN0cy5tYXAoX29iamVjdCA9PiBPYmplY3QuY3JlYXRlKDxPYmplY3Q+X29iamVjdCkpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBEZXRhaWxzIGV4dGVuZHMgSFRNTERldGFpbHNFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjb250ZW50OiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2xlZ2VuZDogc3RyaW5nID0gXCJcIiwgX3R5cGU6IHN0cmluZykge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICAvLyBUT0RPOiBjaGVjayBpZiB0aGlzIHNob3VsZCBiZSByZW1vdmVkIGFmdGVyIGNoYW5naW5nIGFuaW1hdGlvbiBzdHJ1Y3R1cmUgdG8gbG9vayBtb3JlIGxpa2UgYSBtdXRhdG9yXHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwia2V5XCIsIF9sZWdlbmQpO1xyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIF9sZWdlbmQpO1xyXG4gICAgICB0aGlzLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgX3R5cGUpO1xyXG4gICAgICB0aGlzLm9wZW4gPSB0cnVlO1xyXG4gICAgICBsZXQgbGJsU3VtbWFyeTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3VtbWFyeVwiKTtcclxuICAgICAgbGJsU3VtbWFyeS50ZXh0Q29udGVudCA9IF9sZWdlbmQ7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQobGJsU3VtbWFyeSk7XHJcblxyXG4gICAgICB0aGlzLmNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY29udGVudCk7XHJcblxyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZEtleSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX1NFVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5UT0dHTEUsIHRoaXMuaG5kVG9nZ2xlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIGdldCBpc0V4cGFuZGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAvLyByZXR1cm4gdGhpcy5leHBhbmRlci5jaGVja2VkO1xyXG4gICAgICByZXR1cm4gdGhpcy5vcGVuO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRDb250ZW50KF9jb250ZW50OiBIVE1MRGl2RWxlbWVudCk6IHZvaWQge1xyXG4gICAgICB0aGlzLnJlcGxhY2VDaGlsZChfY29udGVudCwgdGhpcy5jb250ZW50KTtcclxuICAgICAgdGhpcy5jb250ZW50ID0gX2NvbnRlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGV4cGFuZChfZXhwYW5kOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIC8vIHRoaXMuZXhwYW5kZXIuY2hlY2tlZCA9IF9leHBhbmQ7XHJcbiAgICAgIHRoaXMub3BlbiA9IF9leHBhbmQ7XHJcbiAgICAgIHRoaXMuaG5kVG9nZ2xlKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kVG9nZ2xlID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKF9ldmVudClcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQodGhpcy5pc0V4cGFuZGVkID8gRVZFTlQuRVhQQU5EIDogRVZFTlQuQ09MTEFQU0UsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRm9jdXMgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgbGV0IG5leHQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PnRoaXMubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKG5leHQgJiYgbmV4dC50YWJJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIG5leHQuZm9jdXMoKTtcclxuICAgICAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGxldCBwcmV2aW91czogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKHByZXZpb3VzICYmIHByZXZpb3VzLnRhYkluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgbGV0IHNldHM6IE5vZGVMaXN0T2Y8SFRNTERldGFpbHNFbGVtZW50PiA9IHByZXZpb3VzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkZXRhaWxzXCIpO1xyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyID0gc2V0cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmIChpKVxyXG4gICAgICAgICAgICAgIGRvIHsgLy8gZm9jdXMgdGhlIGxhc3QgdmlzaWJsZSBzZXRcclxuICAgICAgICAgICAgICAgIHNldHNbLS1pXS5mb2N1cygpO1xyXG4gICAgICAgICAgICAgIH0gd2hpbGUgKCFzZXRzW2ldLm9mZnNldFBhcmVudCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICBwcmV2aW91cy5mb2N1cygpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRk9DVVNfU0VUOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC50YXJnZXQgIT0gdGhpcykge1xyXG4gICAgICAgICAgICB0aGlzLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgcGFzc0V2ZW50OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIC8vIGxldCB0YXJnZXQ6IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLklOU0VSVDpcclxuICAgICAgICAgIMaSLkRlYnVnLmxvZyhcIklOU0VSVCBhdCBEZXRhaWxzXCIpO1xyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5JTlNFUlQsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB0aGlzIH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICBwYXNzRXZlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgICAgaWYgKCF0aGlzLmlzRXhwYW5kZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmQodHJ1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgbGV0IG5leHQ6IEhUTUxFbGVtZW50ID0gdGhpcztcclxuICAgICAgICAgIGlmICh0aGlzLmlzRXhwYW5kZWQpXHJcbiAgICAgICAgICAgIG5leHQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoXCJkZXRhaWxzXCIpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgbmV4dCA9IDxIVE1MRWxlbWVudD5uZXh0Lm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgICAgfSB3aGlsZSAobmV4dCAmJiBuZXh0LnRhYkluZGV4ID4gLTEpO1xyXG5cclxuICAgICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgICBuZXh0LmZvY3VzKCk7XHJcbiAgICAgICAgICAvLyBuZXh0LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlRfVFJFRS5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0xFRlQ6XHJcbiAgICAgICAgICBpZiAodGhpcy5pc0V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKGZhbHNlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgbGV0IHByZXZpb3VzOiBIVE1MRWxlbWVudCA9IHRoaXM7XHJcbiAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHByZXZpb3VzID0gPEhUTUxFbGVtZW50PnByZXZpb3VzLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XHJcbiAgICAgICAgICB9IHdoaWxlIChwcmV2aW91cyAmJiAhKHByZXZpb3VzIGluc3RhbmNlb2YgRGV0YWlscykpO1xyXG5cclxuICAgICAgICAgIGlmIChwcmV2aW91cylcclxuICAgICAgICAgICAgaWYgKCg8RGV0YWlscz5wcmV2aW91cykuaXNFeHBhbmRlZClcclxuICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfUFJFVklPVVMsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgcHJldmlvdXMuZm9jdXMoKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfU0VULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXBhc3NFdmVudClcclxuICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9O1xyXG4gIH1cclxuICAvLyBUT0RPOiB1c2UgQ3VzdG9tRWxlbWVudC5yZWdpc3Rlcj9cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ1aS1kZXRhaWxzXCIsIERldGFpbHMsIHsgZXh0ZW5kczogXCJkZXRhaWxzXCIgfSk7XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgRGV0YWlsc0FycmF5IGV4dGVuZHMgRGV0YWlscyB7XHJcbiAgICBwdWJsaWMgaW5wdXQ6IEN1c3RvbUVsZW1lbnROdW1iZXI7XHJcbiAgICBwdWJsaWMgYnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2xlZ2VuZDogc3RyaW5nKSB7XHJcbiAgICAgIHN1cGVyKF9sZWdlbmQsIFwiQXJyYXlcIik7XHJcblxyXG4gICAgICB0aGlzLmlucHV0ID0gbmV3IEN1c3RvbUVsZW1lbnROdW1iZXIoeyBrZXk6IFwibGVuZ3RoXCIsIGxhYmVsOiBcImxlbmd0aFwiLCB2YWx1ZTogXCIwXCIsIG1pbjogXCIwXCIsIHN0ZXA6IFwiMVwiIH0pO1xyXG4gICAgICB0aGlzLmlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0hBTkdFLCB0aGlzLmhuZENoYW5nZUlucHV0KTtcclxuICAgICAgdGhpcy5xdWVyeVNlbGVjdG9yKFwic3VtbWFyeVwiKS5hZnRlcih0aGlzLmlucHV0KTtcclxuXHJcbiAgICAgIHRoaXMuYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgdGhpcy5idXR0b24uaW5uZXJUZXh0ID0gXCIrXCI7XHJcbiAgICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0xJQ0ssIHRoaXMuaG5kQ2xpY2tCdXR0b24pO1xyXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0Q29udGVudChfY29udGVudDogSFRNTERpdkVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgc3VwZXIuc2V0Q29udGVudChfY29udGVudCk7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEhUTUxFbGVtZW50PilcclxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKGNoaWxkKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmlucHV0LmlzSW5pdGlhbGl6ZWQpXHJcbiAgICAgICAgdGhpcy5pbnB1dC5zZXRNdXRhdG9yVmFsdWUodGhpcy5jb250ZW50LmNoaWxkcmVuLmxlbmd0aCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmlucHV0LnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHRoaXMuY29udGVudC5jaGlsZHJlbi5sZW5ndGgudG9TdHJpbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGdldE11dGF0b3IoKTogxpIuTXV0YXRvciB7XHJcbiAgICAvLyAgIGxldCBtdXRhdG9yOiDGki5NdXRhdG9yW10gPSBbXTtcclxuXHJcbiAgICAvLyAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuY29udGVudC5jaGlsZHJlbiBhcyBIVE1MQ29sbGVjdGlvbk9mPEN1c3RvbUVsZW1lbnQ+KVxyXG4gICAgLy8gICAgIG11dGF0b3IucHVzaChjaGlsZC5nZXRNdXRhdG9yVmFsdWUoKSk7XHJcblxyXG4gICAgLy8gICByZXR1cm4gbXV0YXRvcjtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZEV2ZW50TGlzdGVuZXJzKF9jaGlsZDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcclxuICAgICAgX2NoaWxkLmRyYWdnYWJsZSA9IHRydWU7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcm9wKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdPdmVyKTtcclxuICAgICAgX2NoaWxkLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5U3BlY2lhbCk7XHJcbiAgICAgIF9jaGlsZC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULklOU0VSVCwgdGhpcy5obmRJbnNlcnQpO1xyXG4gICAgICBfY2hpbGQudGFiSW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVhcnJhbmdlKF9mb2N1czogbnVtYmVyID0gdW5kZWZpbmVkKTogdm9pZCB7XHJcbiAgICAgIGxldCBzZXF1ZW5jZTogbnVtYmVyW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuKVxyXG4gICAgICAgIHNlcXVlbmNlLnB1c2gocGFyc2VJbnQoY2hpbGQuZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpKTtcclxuXHJcbiAgICAgIHRoaXMuc2V0Rm9jdXMoX2ZvY3VzKTtcclxuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRUFSUkFOR0VfQVJSQVksIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGtleTogdGhpcy5nZXRBdHRyaWJ1dGUoXCJrZXlcIiksIHNlcXVlbmNlOiBzZXF1ZW5jZSB9IH0pKTtcclxuXHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5jb250ZW50LmNoaWxkcmVuIGFzIEhUTUxDb2xsZWN0aW9uT2Y8Q3VzdG9tRWxlbWVudD4pIHtcclxuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoXCJsYWJlbFwiLCBjb3VudC50b1N0cmluZygpKTtcclxuICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgaWYgKGNoaWxkLnNldExhYmVsKVxyXG4gICAgICAgICAgY2hpbGQuc2V0TGFiZWwoY291bnQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgxpIuRGVidWcuZnVkZ2UoY2hpbGQudGFiSW5kZXgpO1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuTVVUQVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0Rm9jdXMoX2ZvY3VzOiBudW1iZXIgPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuICAgICAgaWYgKF9mb2N1cyA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBfZm9jdXMgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihfZm9jdXMsIHRoaXMuY29udGVudC5jaGlsZHJlbi5sZW5ndGggLSAxKSk7XHJcbiAgICAgIGxldCBjaGlsZDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy5jb250ZW50LmNoaWxkcmVuW19mb2N1c107XHJcbiAgICAgIGNoaWxkPy5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ1N0YXJ0ID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIF9ldmVudC5wcmV2ZW50RGVmYXVsdDsgXHJcbiAgICAgIGxldCBrZXlEcmFnOiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50Pl9ldmVudC5jdXJyZW50VGFyZ2V0KS5nZXRBdHRyaWJ1dGUoXCJrZXlcIik7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImluZGV4XCIsIGtleURyYWcpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJrZXk6XCIgKyB0aGlzLmdldEF0dHJpYnV0ZShcImtleVwiKSwgXCJrZXlcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIF9ldmVudC5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBfZXZlbnQuZGF0YVRyYW5zZmVyLml0ZW1zKSB7XHJcbiAgICAgICAgbGV0IGtleTogc3RyaW5nO1xyXG4gICAgICAgIGxldCBsYWJlbDogc3RyaW5nO1xyXG4gICAgICAgIFtrZXksIGxhYmVsXSA9IGl0ZW0udHlwZS5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgaWYgKGtleSA9PSBcImtleVwiICYmIGxhYmVsID09IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpKSB7XHJcbiAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuICAgICAgICAgIGlmIChfZXZlbnQuY3RybEtleSlcclxuICAgICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJjb3B5XCI7XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcImxpbmtcIjtcclxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGxhYmVsID09IHRoaXMuZ2V0QXR0cmlidXRlKFwia2V5XCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcm9wID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9ldmVudCk7XHJcbiAgICAgIGxldCBkcm9wOiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD5fZXZlbnQuY3VycmVudFRhcmdldDtcclxuICAgICAgbGV0IGtleURyb3A6IHN0cmluZyA9IGRyb3AuZ2V0QXR0cmlidXRlKFwia2V5XCIpO1xyXG4gICAgICBsZXQga2V5RHJhZzogc3RyaW5nID0gX2V2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiaW5kZXhcIik7XHJcbiAgICAgIGxldCBkcmFnOiBIVE1MRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcihgW2tleT1cIiR7a2V5RHJhZ31cIl1gKTtcclxuICAgICAgbGV0IGxhYmVsRHJhZzogc3RyaW5nID0gZHJhZy5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKTtcclxuXHJcbiAgICAgIGxldCBwb3NpdGlvbjogSW5zZXJ0UG9zaXRpb24gPSBrZXlEcmFnID4ga2V5RHJvcCA/IFwiYmVmb3JlYmVnaW5cIiA6IFwiYWZ0ZXJlbmRcIjtcclxuICAgICAgaWYgKF9ldmVudC5jdHJsS2V5KVxyXG4gICAgICAgIGRyYWcgPSA8SFRNTEVsZW1lbnQ+ZHJhZy5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgIGRyYWcuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgbGFiZWxEcmFnKTtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpXHJcbiAgICAgICAgZHJhZy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRyYWcpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZHJvcC5pbnNlcnRBZGphY2VudEVsZW1lbnQocG9zaXRpb24sIGRyYWcpO1xyXG5cclxuICAgICAgdGhpcy5yZWFycmFuZ2UoKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycyhkcmFnKTtcclxuICAgICAgZHJhZy5mb2N1cygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZENsaWNrQnV0dG9uID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5pbnB1dC5zZXRNdXRhdG9yVmFsdWUodGhpcy5pbnB1dC5nZXRNdXRhdG9yVmFsdWUoKSArIDEpO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlJFU1RSVUNUVVJFX0FSUkFZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBsZW5ndGg6IHRoaXMuaW5wdXQudmFsdWUgfSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ2hhbmdlSW5wdXQgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KEVWRU5ULlJFU1RSVUNUVVJFX0FSUkFZLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBsZW5ndGg6IHRoaXMuaW5wdXQudmFsdWUgfSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kSW5zZXJ0ID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoXCJobmRJbnNlcnRcIik7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5U3BlY2lhbCA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IGl0ZW06IEhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50Pl9ldmVudC5jdXJyZW50VGFyZ2V0O1xyXG5cclxuICAgICAgLy8gb25seSB3b3JrIG9uIGl0ZW1zIG9mIGxpc3QsIG5vdCB0aGVpciBjaGlsZHJlblxyXG4gICAgICBpZiAoKDxIVE1MRWxlbWVudD5fZXZlbnQudGFyZ2V0KSAhPSBpdGVtICYmIF9ldmVudC5jb2RlICE9IMaSLktFWUJPQVJEX0NPREUuREVMRVRFKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBmb2N1czogbnVtYmVyID0gcGFyc2VJbnQoaXRlbS5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSk7XHJcbiAgICAgIGxldCBzaWJsaW5nOiBIVE1MRWxlbWVudCA9IGl0ZW07XHJcbiAgICAgIGxldCBpbnNlcnQ6IEhUTUxFbGVtZW50ID0gaXRlbTtcclxuICAgICAgbGV0IHBhc3NFdmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5ERUxFVEU6XHJcbiAgICAgICAgICBpdGVtLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaXRlbSk7XHJcbiAgICAgICAgICB0aGlzLnJlYXJyYW5nZShmb2N1cyk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICAvLyBjYXNlIMaSLktFWUJPQVJEX0NPREUuSU5TRVJUOlxyXG4gICAgICAgIC8vICAgcGFzc0V2ZW50ID0gdHJ1ZTtcclxuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwiSU5TRVJUIGF0IERldGFpbHNBcnJheVwiKTtcclxuICAgICAgICAvLyAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIGlmICghX2V2ZW50LmFsdEtleSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEZvY3VzKC0tZm9jdXMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChfZXZlbnQuc2hpZnRLZXkpIHtcclxuICAgICAgICAgICAgaW5zZXJ0ID0gPEhUTUxFbGVtZW50Pml0ZW0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICBpbnNlcnQuc2V0QXR0cmlidXRlKFwibGFiZWxcIiwgaXRlbS5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcnMoaW5zZXJ0KTtcclxuICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBzaWJsaW5nID0gPEhUTUxFbGVtZW50Pml0ZW0ucHJldmlvdXNTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKHNpYmxpbmcpXHJcbiAgICAgICAgICAgIHNpYmxpbmcuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYmVmb3JlYmVnaW5cIiwgaW5zZXJ0KTtcclxuICAgICAgICAgIHRoaXMucmVhcnJhbmdlKC0tZm9jdXMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX0RPV046XHJcbiAgICAgICAgICBpZiAoIV9ldmVudC5hbHRLZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRGb2N1cygrK2ZvY3VzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgIGluc2VydCA9IDxIVE1MRWxlbWVudD5pdGVtLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICAgICAgaW5zZXJ0LnNldEF0dHJpYnV0ZShcImxhYmVsXCIsIGl0ZW0uZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKGluc2VydCk7XHJcbiAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgc2libGluZyA9IDxIVE1MRWxlbWVudD5pdGVtLm5leHRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKHNpYmxpbmcpXHJcbiAgICAgICAgICAgIHNpYmxpbmcuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJlbmRcIiwgaW5zZXJ0KTtcclxuICAgICAgICAgIHRoaXMucmVhcnJhbmdlKCsrZm9jdXMpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIHBhc3NFdmVudCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghcGFzc0V2ZW50KSB7XHJcbiAgICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWktbGlzdFwiLCBEZXRhaWxzQXJyYXksIHsgZXh0ZW5kczogXCJkZXRhaWxzXCIgfSk7XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0YXRpYyBjbGFzcyB0byBkaXNwbGF5IGEgbW9kYWwgb3Igbm9uLW1vZGFsIGRpYWxvZyB3aXRoIGFuIGludGVyZmFjZSBmb3IgdGhlIGdpdmVuIG11dGF0b3IuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIERpYWxvZyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGRvbTogSFRNTERpYWxvZ0VsZW1lbnQ7XHJcbiAgICAvKipcclxuICAgICAqIFByb21wdCB0aGUgZGlhbG9nIHRvIHRoZSB1c2VyIHdpdGggdGhlIGdpdmVuIGhlYWRsaW5lLCBjYWxsIHRvIGFjdGlvbiBhbmQgbGFiZWxzIGZvciB0aGUgY2FuY2VsLSBhbmQgb2stYnV0dG9uXHJcbiAgICAgKiBVc2UgYGF3YWl0YCBvbiBjYWxsLCB0byBjb250aW51ZSBhZnRlciB0aGUgdXNlciBoYXMgcHJlc3NlZCBvbmUgb2YgdGhlIGJ1dHRvbnMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgcHJvbXB0KF9kYXRhOiDGki5NdXRhYmxlIHwgxpIuTXV0YXRvciB8IE9iamVjdCwgX21vZGFsOiBib29sZWFuID0gdHJ1ZSwgX2hlYWQ6IHN0cmluZyA9IFwiSGVhZGxpbmVcIiwgX2NhbGxUb0FjdGlvbjogc3RyaW5nID0gXCJJbnN0cnVjdGlvblwiLCBfb2s6IHN0cmluZyA9IFwiT0tcIiwgX2NhbmNlbDogc3RyaW5nID0gXCJDYW5jZWxcIik6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICBEaWFsb2cuZG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpYWxvZ1wiKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChEaWFsb2cuZG9tKTtcclxuICAgICAgRGlhbG9nLmRvbS5pbm5lckhUTUwgPSBcIjxoMT5cIiArIF9oZWFkICsgXCI8L2gxPlwiO1xyXG5cclxuICAgICAgbGV0IGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgICBpZiAoX2RhdGEgaW5zdGFuY2VvZiDGki5NdXRhYmxlKVxyXG4gICAgICAgIGNvbnRlbnQgPSBHZW5lcmF0b3IuY3JlYXRlSW50ZXJmYWNlRnJvbU11dGFibGUoX2RhdGEpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgY29udGVudCA9IEdlbmVyYXRvci5jcmVhdGVJbnRlcmZhY2VGcm9tTXV0YXRvcihfZGF0YSk7XHJcbiAgICAgIGNvbnRlbnQuaWQgPSBcImNvbnRlbnRcIjtcclxuICAgICAgRGlhbG9nLmRvbS5hcHBlbmRDaGlsZChjb250ZW50KTtcclxuXHJcbiAgICAgIGxldCBmb290ZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvb3RlclwiKTtcclxuICAgICAgZm9vdGVyLmlubmVySFRNTCA9IFwiPHA+XCIgKyBfY2FsbFRvQWN0aW9uICsgXCI8L3A+XCI7XHJcbiAgICAgIGxldCBidG5DYW5jZWw6IEhUTUxCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuICAgICAgYnRuQ2FuY2VsLmlubmVySFRNTCA9IF9jYW5jZWw7XHJcbiAgICAgIGlmIChfY2FuY2VsICE9IFwiXCIpXHJcbiAgICAgICAgZm9vdGVyLmFwcGVuZENoaWxkKGJ0bkNhbmNlbCk7XHJcbiAgICAgIGxldCBidG5PazogSFRNTEJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICBidG5Pay5pbm5lckhUTUwgPSBfb2s7XHJcbiAgICAgIGZvb3Rlci5hcHBlbmRDaGlsZChidG5Payk7XHJcbiAgICAgIERpYWxvZy5kb20uYXBwZW5kQ2hpbGQoZm9vdGVyKTtcclxuICAgICAgaWYgKF9tb2RhbClcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBEaWFsb2cuZG9tLnNob3dNb2RhbCgpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgRGlhbG9nLmRvbS5zaG93KCk7XHJcblxyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKF9yZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgbGV0IGhuZEJ1dHRvbjogKF9ldmVudDogRXZlbnQpID0+IHZvaWQgPSAoX2V2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgYnRuQ2FuY2VsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBobmRCdXR0b24pO1xyXG4gICAgICAgICAgYnRuT2sucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhuZEJ1dHRvbik7XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSBidG5PaylcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBDb250cm9sbGVyLnVwZGF0ZU11dGF0b3IoY29udGVudCwgX2RhdGEpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChfZSkge1xyXG4gICAgICAgICAgICAgIMaSLkRlYnVnLndhcm4oX2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgIERpYWxvZy5kb20uY2xvc2UoKTtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoRGlhbG9nLmRvbSk7XHJcbiAgICAgICAgICBfcmVzb2x2ZShfZXZlbnQudGFyZ2V0ID09IGJ0bk9rKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGJ0bkNhbmNlbC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNMSUNLLCBobmRCdXR0b24pO1xyXG4gICAgICAgIGJ0bk9rLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ0xJQ0ssIGhuZEJ1dHRvbik7XHJcbiAgICAgICAgYnRuT2suZm9jdXMoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogPHNlbGVjdD48b3B0aW9uPkhhbGxvPC9vcHRpb24+PC9zZWxlY3Q+XHJcbiAgICovXHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgTXVsdGlMZXZlbE1lbnVNYW5hZ2VyIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGJ1aWxkRnJvbVNpZ25hdHVyZShfc2lnbmF0dXJlOiBzdHJpbmcsIF9tdXRhdG9yPzogxpIuTXV0YXRvcik6IMaSLk11dGF0b3Ige1xyXG4gICAgICBsZXQgbXV0YXRvcjogxpIuTXV0YXRvciA9IF9tdXRhdG9yIHx8IHt9O1xyXG4gICAgICBsZXQgc2lnbmF0dXJlTGV2ZWxzOiBzdHJpbmdbXSA9IF9zaWduYXR1cmUuc3BsaXQoXCIuXCIpO1xyXG4gICAgICBpZiAoc2lnbmF0dXJlTGV2ZWxzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBsZXQgc3ViU2lnbmF0dXJlOiBzdHJpbmcgPSBzaWduYXR1cmVMZXZlbHNbMV07XHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMjsgaSA8IHNpZ25hdHVyZUxldmVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgc3ViU2lnbmF0dXJlID0gc3ViU2lnbmF0dXJlICsgXCIuXCIgKyBzaWduYXR1cmVMZXZlbHNbaV07XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dICE9IG51bGwpIHtcclxuICAgICAgICAgIG11dGF0b3Jbc2lnbmF0dXJlTGV2ZWxzWzBdXSA9IHRoaXMuYnVpbGRGcm9tU2lnbmF0dXJlKHN1YlNpZ25hdHVyZSwgPMaSLk11dGF0b3I+bXV0YXRvcltzaWduYXR1cmVMZXZlbHNbMF1dKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICBtdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0gPSB0aGlzLmJ1aWxkRnJvbVNpZ25hdHVyZShzdWJTaWduYXR1cmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBtdXRhdG9yW3NpZ25hdHVyZUxldmVsc1swXV0gPSBzaWduYXR1cmVMZXZlbHNbMF07XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG11dGF0b3I7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0YXRpYyBjbGFzcyB0byBkaXNwbGF5IGEgbW9kYWwgd2FybmluZy5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgV2FybmluZyB7XHJcbiAgICAvKipcclxuICAgICAqIERpc3BsYXkgYSB3YXJuaW5nIHRvIHRoZSB1c2VyIHdpdGggdGhlIGdpdmVuIGhlYWRsaW5lLCB3YXJuaW5nIHRleHQgYW5kIG9rIGJ1dHRlbiB0ZXh0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3BsYXkoX2Vycm9yczogc3RyaW5nW10gPSBbXSwgX2hlYWRsaW5lOiBzdHJpbmcgPSBcIkhlYWRsaW5lXCIsIF93YXJuaW5nOiBzdHJpbmcgPSBcIldhcm5pbmdcIiwgX29rOiBzdHJpbmcgPSBcIk9LXCIpOiB2b2lkIHtcclxuICAgICAgbGV0IHdhcm5pbmc6IEhUTUxEaWFsb2dFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpYWxvZ1wiKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3YXJuaW5nKTtcclxuICAgICAgd2FybmluZy5pbm5lckhUTUwgPSBcIjxoMT5cIiArIF9oZWFkbGluZSArIFwiPC9oMT5cIjtcclxuXHJcbiAgICAgIGxldCBjb250ZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGNvbnRlbnQuaWQgPSBcImNvbnRlbnRcIjtcclxuICAgICAgY29udGVudC5pbm5lclRleHQgPSBfZXJyb3JzLmpvaW4oXCJcXG5cIik7XHJcbiAgICAgIHdhcm5pbmcuYXBwZW5kQ2hpbGQoY29udGVudCk7XHJcblxyXG4gICAgICBsZXQgZm9vdGVyOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb290ZXJcIik7XHJcbiAgICAgIGZvb3Rlci5pbm5lckhUTUwgPSBcIjxwPlwiICsgX3dhcm5pbmcgKyBcIjwvcD5cIjtcclxuICAgICAgbGV0IGJ0bk9rOiBIVE1MQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgICAgIGJ0bk9rLmlubmVySFRNTCA9IF9vaztcclxuICAgICAgYnRuT2sub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICB3YXJuaW5nLmNsb3NlKCk7XHJcbiAgICAgICAgd2FybmluZy5yZW1vdmUoKTtcclxuICAgICAgfTtcclxuICAgICAgZm9vdGVyLmFwcGVuZENoaWxkKGJ0bk9rKTtcclxuICAgICAgd2FybmluZy5hcHBlbmRDaGlsZChmb290ZXIpO1xyXG4gICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgd2FybmluZy5zaG93TW9kYWwoKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8vIFRPRE86IGR1cGxpY2F0ZWQgY29kZSBpbiBUYWJsZSBhbmQgVHJlZSwgbWF5IGJlIG9wdGltaXplZC4uLlxyXG5cclxuICBleHBvcnQgaW50ZXJmYWNlIFRBQkxFIHtcclxuICAgIGxhYmVsOiBzdHJpbmc7XHJcbiAgICBrZXk6IHN0cmluZztcclxuICAgIGVkaXRhYmxlOiBib29sZWFuO1xyXG4gICAgc29ydGFibGU6IGJvb2xlYW47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYW5hZ2VzIGEgc29ydGFibGUgdGFibGUgb2YgZGF0YSBnaXZlbiBhcyBzaW1wbGUgYXJyYXkgb2YgZmxhdCBvYmplY3RzICAgXHJcbiAgICogYGBgdGV4dFxyXG4gICAqIEtleTAgIEtleTEgS2V5MlxyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUYWJsZTxUIGV4dGVuZHMgT2JqZWN0PiBleHRlbmRzIEhUTUxUYWJsZUVsZW1lbnQge1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRhYmxlQ29udHJvbGxlcjxUPjtcclxuICAgIHB1YmxpYyBkYXRhOiBUW107XHJcbiAgICBwdWJsaWMgYXR0SWNvbjogc3RyaW5nO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVGFibGVDb250cm9sbGVyPFQ+LCBfZGF0YTogVFtdLCBfYXR0SWNvbj86IHN0cmluZykge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIHRoaXMuYXR0SWNvbiA9IF9hdHRJY29uO1xyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFwic29ydGFibGVcIjtcclxuXHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5TT1JULCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZFNvcnQpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuU0VMRUNULCB0aGlzLmhuZFNlbGVjdCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5TRUxFQ1RfQUxMLCB0aGlzLnNlbGVjdEFsbCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5GT0NVU19ORVhULCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCA8RXZlbnRMaXN0ZW5lcj50aGlzLmhuZEZvY3VzKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkVTQ0FQRSwgdGhpcy5obmRFc2NhcGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuREVMRVRFLCB0aGlzLmhuZERlbGV0ZSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ09QWSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ1VULCB0aGlzLmhuZENvcHlQYXN0ZSk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5QQVNURSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRST1AsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHRoZSB0YWJsZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3JlYXRlKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgIGxldCBoZWFkOiBUQUJMRVtdID0gdGhpcy5jb250cm9sbGVyLmdldEhlYWQoKTtcclxuXHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVIZWFkKGhlYWQpKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGRhdGEgb2YgdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgbGV0IGl0ZW06IFRhYmxlSXRlbTxUPiA9IG5ldyBUYWJsZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBkYXRhLCB0aGlzLmF0dEljb24pO1xyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFyIHRoZSBjdXJyZW50IHNlbGVjdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXJTZWxlY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24oPFRbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUgb2JqZWN0IGluIGZvY3VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRGb2N1c3NlZCgpOiBUIHtcclxuICAgICAgbGV0IGl0ZW1zOiBUYWJsZUl0ZW08VD5bXSA9IDxUYWJsZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpKTtcclxuICAgICAgbGV0IGZvdW5kOiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKDxUYWJsZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XHJcbiAgICAgIGlmIChmb3VuZCA+IC0xKVxyXG4gICAgICAgIHJldHVybiBpdGVtc1tmb3VuZF0uZGF0YTtcclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWxlY3RBbGwoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwodGhpcy5kYXRhWzBdLCB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aC0xXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlbGVjdEludGVydmFsKF9kYXRhU3RhcnQ6IFQsIF9kYXRhRW5kOiBUKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+ID0gPE5vZGVMaXN0T2Y8VGFibGVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKTtcclxuICAgICAgbGV0IHNlbGVjdGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICBsZXQgZW5kOiBUID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgIGlmICghc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBzZWxlY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKGl0ZW0uZGF0YSA9PSBfZGF0YVN0YXJ0KVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YUVuZDtcclxuICAgICAgICAgIGVsc2UgaWYgKGl0ZW0uZGF0YSA9PSBfZGF0YUVuZClcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFTdGFydDtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZWN0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxlY3RpbmcpIHtcclxuICAgICAgICAgIGl0ZW0uc2VsZWN0KHRydWUsIGZhbHNlKTtcclxuICAgICAgICAgIGlmIChpdGVtLmRhdGEgPT0gZW5kKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGxheVNlbGVjdGlvbihfZGF0YTogVFtdKTogdm9pZCB7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKF9kYXRhKTtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRhYmxlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUYWJsZUl0ZW08VD4+PnRoaXMucXVlcnlTZWxlY3RvckFsbChcInRyXCIpO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSAoX2RhdGEgIT0gbnVsbCAmJiBfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVIZWFkKF9oZWFkSW5mbzogVEFCTEVbXSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xyXG4gICAgICBsZXQgdHI6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XHJcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIF9oZWFkSW5mbykge1xyXG4gICAgICAgIGxldCB0aDogSFRNTFRhYmxlQ2VsbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGhcIik7XHJcbiAgICAgICAgdGgudGV4dENvbnRlbnQgPSBlbnRyeS5sYWJlbDtcclxuICAgICAgICB0aC5zZXRBdHRyaWJ1dGUoXCJrZXlcIiwgZW50cnkua2V5KTtcclxuXHJcbiAgICAgICAgaWYgKGVudHJ5LnNvcnRhYmxlKSB7XHJcbiAgICAgICAgICB0aC5hcHBlbmRDaGlsZCh0aGlzLmdldFNvcnRCdXR0b25zKCkpO1xyXG4gICAgICAgICAgdGguYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAgICAgRVZFTlQuQ0hBTkdFLFxyXG4gICAgICAgICAgICAoX2V2ZW50OiBFdmVudCkgPT4gdGguZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuU09SVCwgeyBkZXRhaWw6IF9ldmVudC50YXJnZXQsIGJ1YmJsZXM6IHRydWUgfSkpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ci5hcHBlbmRDaGlsZCh0aCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0U29ydEJ1dHRvbnMoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgICBsZXQgcmVzdWx0OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICBmb3IgKGxldCBkaXJlY3Rpb24gb2YgW1widXBcIiwgXCJkb3duXCJdKSB7XHJcbiAgICAgICAgbGV0IGJ1dHRvbjogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBidXR0b24udHlwZSA9IFwicmFkaW9cIjtcclxuICAgICAgICBidXR0b24ubmFtZSA9IFwic29ydFwiO1xyXG4gICAgICAgIGJ1dHRvbi52YWx1ZSA9IGRpcmVjdGlvbjtcclxuICAgICAgICByZXN1bHQuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kU29ydChfZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCB7XHJcbiAgICAgIGxldCB2YWx1ZTogc3RyaW5nID0gKDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC5kZXRhaWwpLnZhbHVlO1xyXG4gICAgICBsZXQga2V5OiBzdHJpbmcgPSAoPEhUTUxFbGVtZW50Pl9ldmVudC50YXJnZXQpLmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgbGV0IGRpcmVjdGlvbjogbnVtYmVyID0gKHZhbHVlID09IFwidXBcIikgPyAxIDogLTE7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5zb3J0KHRoaXMuZGF0YSwga2V5LCBkaXJlY3Rpb24pO1xyXG4gICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kU2VsZWN0KF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgZGV0YWlsOiB7IGRhdGE6IE9iamVjdDsgaW50ZXJ2YWw6IGJvb2xlYW47IGFkZGl0aXZlOiBib29sZWFuIH0gPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsO1xyXG4gICAgICBsZXQgaW5kZXg6IG51bWJlciA9IHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uaW5kZXhPZig8VD5kZXRhaWwuZGF0YSk7XHJcblxyXG4gICAgICBpZiAoZGV0YWlsLmludGVydmFsKSB7XHJcbiAgICAgICAgbGV0IGRhdGFTdGFydDogVCA9IDxUPnRoaXMuY29udHJvbGxlci5zZWxlY3Rpb25bMF07XHJcbiAgICAgICAgbGV0IGRhdGFFbmQ6IFQgPSA8VD5kZXRhaWwuZGF0YTtcclxuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RJbnRlcnZhbChkYXRhU3RhcnQsIGRhdGFFbmQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGluZGV4ID49IDAgJiYgZGV0YWlsLmFkZGl0aXZlKVxyXG4gICAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKCFkZXRhaWwuYWRkaXRpdmUpXHJcbiAgICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5wdXNoKDxUPmRldGFpbC5kYXRhKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kaXNwbGF5U2VsZWN0aW9uKDxUW10+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBobmREZWxldGUgPSBhc3luYyAoX2V2ZW50OiBFdmVudCk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgICBsZXQgdGFyZ2V0OiBUYWJsZUl0ZW08VD4gPSA8VGFibGVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IGRlbGV0ZWQ6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5kZWxldGUoW3RhcmdldC5kYXRhXSk7XHJcbiAgICAgIGlmIChkZWxldGVkLmxlbmd0aClcclxuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlJFTU9WRV9DSElMRCwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFc2NhcGUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ29weVBhc3RlID0gYXN5bmMgKF9ldmVudDogQ2xpcGJvYXJkRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoX2V2ZW50KTtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQudHlwZSkge1xyXG4gICAgICAgIGNhc2UgRVZFTlQuQ09QWTpcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5jb3B5KHRoaXMuZ2V0Rm9jdXNzZWQoKSwgX2V2ZW50LnR5cGUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5DVVQ6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBsZXQgY3V0OiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuY3V0KHRoaXMuZ2V0Rm9jdXNzZWQoKSwgX2V2ZW50LnR5cGUpO1xyXG4gICAgICAgICAgaWYgKGN1dC5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUkVNT1ZFX0NISUxELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5QQVNURTpcclxuICAgICAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIucGFzdGUoKTtcclxuICAgICAgICAgIGZvciAobGV0IG9iamVjdCBvZiBvYmplY3RzKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtOiBUYWJsZUl0ZW08VD4gPSBuZXcgVGFibGVJdGVtPFQ+KHRoaXMuY29udHJvbGxlciwgb2JqZWN0LCB0aGlzLmF0dEljb24pO1xyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuUEFTVEUsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdEcm9wID0gYXN5bmMgKF9ldmVudDogRHJhZ0V2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5SZWZsZWN0LmdldChfZXZlbnQsIFwiaXRlbVwiKTtcclxuICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUkFHX1NUQVJUOlxyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJhbGxcIjtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnU3RhcnQoaXRlbS5kYXRhKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJBR19PVkVSOlxyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gdGhpcy5jb250cm9sbGVyLmRyYWdPdmVyKF9ldmVudCk7XHJcbiAgICAgICAgICAvLyBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJPUDpcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZHJvcChfZXZlbnQpO1xyXG4gICAgICAgICAgZm9yIChsZXQgb2JqZWN0IG9mIG9iamVjdHMpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW06IFRhYmxlSXRlbTxUPiA9IG5ldyBUYWJsZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBvYmplY3QsIHRoaXMuYXR0SWNvbik7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoaXRlbSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBpdGVtczogVGFibGVJdGVtPFQ+W10gPSA8VGFibGVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0clwiKSk7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRhYmxlSXRlbTxUPiA9IDxUYWJsZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInRhYmxlLXNvcnRhYmxlXCIsIFRhYmxlLCB7IGV4dGVuZHM6IFwidGFibGVcIiB9KTtcclxufVxyXG4iLCIvLy88cmVmZXJlbmNlIHBhdGg9XCIuLi9EYXRhQ29udHJvbGxlci50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgLyoqXHJcbiAgICogU3ViY2xhc3MgdGhpcyB0byBjcmVhdGUgYSBicm9rZXIgYmV0d2VlbiB5b3VyIGRhdGEgYW5kIGEgW1tUYWJsZV1dIHRvIGRpc3BsYXkgYW5kIG1hbmlwdWxhdGUgaXQuXHJcbiAgICogVGhlIFtbVGFibGVdXSBkb2Vzbid0IGtub3cgaG93IHlvdXIgZGF0YSBpcyBzdHJ1Y3R1cmVkIGFuZCBob3cgdG8gaGFuZGxlIGl0LCB0aGUgY29udHJvbGxlciBpbXBsZW1lbnRzIHRoZSBtZXRob2RzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUYWJsZUNvbnRyb2xsZXI8VD4gZXh0ZW5kcyBEYXRhQ29udHJvbGxlcjxUPiB7XHJcbiAgICBcclxuICAgIC8qKiBSZXRyaWV2ZSBhIHN0cmluZyB0byBjcmVhdGUgYSBsYWJlbCBmb3IgdGhlIHRhYmxlIGl0ZW0gcmVwcmVzZW50aW5nIHRoZSBvYmplY3QgKGFwcGVhcnMgbm90IHRvIGJlIGNhbGxlZCB5ZXQpICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGdldExhYmVsKF9vYmplY3Q6IFQpOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFJldHVybiBmYWxzZSBpZiByZW5hbWluZyBvZiBvYmplY3QgaXMgbm90IHBvc3NpYmlsZSwgb3IgdHJ1ZSBpZiB0aGUgb2JqZWN0IHdhcyByZW5hbWVkICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVuYW1lKF9vYmplY3Q6IFQsIF9uZXc6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj47XHJcblxyXG4gICAgLyoqIFxyXG4gICAgICogUmV0dXJuIGEgbGlzdCBvZiBUQUJMRS1vYmplY3RzIGRlc2NyaWJpbmcgdGhlIGhlYWQtdGl0bGVzIGFuZCBhY2NvcmRpbmcgcHJvcGVydGllc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0SGVhZCgpOiBUQUJMRVtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU29ydCBkYXRhIGJ5IGdpdmVuIGtleSBhbmQgZGlyZWN0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBzb3J0KF9kYXRhOiBUW10sIF9rZXk6IHN0cmluZywgX2RpcmVjdGlvbjogbnVtYmVyKTogdm9pZDtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlVXNlckludGVyZmFjZSB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiB0ci1lbGVtZW50IHRoYXQgcmVwcmVzZW50cyBhbiBvYmplY3QgaW4gYSBbW1RhYmxlXV1cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVGFibGVJdGVtPFQgZXh0ZW5kcyBPYmplY3Q+IGV4dGVuZHMgSFRNTFRhYmxlUm93RWxlbWVudCB7XHJcbiAgICBwdWJsaWMgZGF0YTogVCA9IG51bGw7XHJcbiAgICBwdWJsaWMgY29udHJvbGxlcjogVGFibGVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY29udHJvbGxlcjogVGFibGVDb250cm9sbGVyPFQ+LCBfZGF0YTogVCwgX2F0dEljb246IHN0cmluZykge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIC8vIHRoaXMuZGlzcGxheSA9IHRoaXMuY29udHJvbGxlci5nZXRMYWJlbChfZGF0YSk7XHJcbiAgICAgIC8vIFRPRE86IGhhbmRsZSBjc3NDbGFzc2VzXHJcbiAgICAgIHRoaXMuY3JlYXRlKHRoaXMuY29udHJvbGxlci5nZXRIZWFkKCksIF9hdHRJY29uKTtcclxuICAgICAgdGhpcy5jbGFzc05hbWUgPSBcInRhYmxlXCI7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUE9JTlRFUl9VUCwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuS0VZX0RPV04sIHRoaXMuaG5kS2V5KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG5cclxuICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0cnVlO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19TVEFSVCwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcmFnRHJvcCk7XHJcblxyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuVVBEQVRFLCB0aGlzLmhuZFVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGF0dGFjaGVzIG9yIGRldGFjaGVzIHRoZSBbW0NTU19DTEFTUy5TRUxFQ1RFRF1dIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkKF9vbjogYm9vbGVhbikge1xyXG4gICAgICBpZiAoX29uKVxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIFtbVFJFRV9DTEFTU0VTLlNFTEVDVEVEXV0gaXMgYXR0YWNoZWQgdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNsYXNzTGlzdC5jb250YWlucyhDU1NfQ0xBU1MuU0VMRUNURUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGF0Y2hlcyB0aGUgW1tFVkVOVC5TRUxFQ1RdXSBldmVudFxyXG4gICAgICogQHBhcmFtIF9hZGRpdGl2ZSBGb3IgbXVsdGlwbGUgc2VsZWN0aW9uICgrQ3RybCkgXHJcbiAgICAgKiBAcGFyYW0gX2ludGVydmFsIEZvciBzZWxlY3Rpb24gb3ZlciBpbnRlcnZhbCAoK1NoaWZ0KVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2VsZWN0KF9hZGRpdGl2ZTogYm9vbGVhbiwgX2ludGVydmFsOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgbGV0IGV2ZW50OiBDdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudChFVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSwgYWRkaXRpdmU6IF9hZGRpdGl2ZSwgaW50ZXJ2YWw6IF9pbnRlcnZhbCB9IH0pO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKF9maWx0ZXI6IFRBQkxFW10sIF9hdHRJY29uOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgZW50cnkgb2YgX2ZpbHRlcikge1xyXG4gICAgICAgIGxldCB2YWx1ZTogc3RyaW5nID0gPHN0cmluZz5SZWZsZWN0LmdldCh0aGlzLmRhdGEsIGVudHJ5LmtleSk7XHJcbiAgICAgICAgbGV0IGljb246IHN0cmluZyA9IDxzdHJpbmc+UmVmbGVjdC5nZXQodGhpcy5kYXRhLCBfYXR0SWNvbik7XHJcbiAgICAgICAgbGV0IHRkOiBIVE1MVGFibGVDZWxsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZFwiKTtcclxuICAgICAgICBsZXQgaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQudHlwZSA9IFwidGV4dFwiO1xyXG4gICAgICAgIGlucHV0LmRpc2FibGVkID0gIWVudHJ5LmVkaXRhYmxlO1xyXG4gICAgICAgIGlucHV0LnJlYWRPbmx5ID0gdHJ1ZTtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImtleVwiLCBlbnRyeS5rZXkpO1xyXG5cclxuICAgICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKEVWRU5ULktFWV9ET1dOLCB0aGlzLmhuZElucHV0RXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZElucHV0RXZlbnQpO1xyXG4gICAgICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfT1VULCB0aGlzLmhuZENoYW5nZSk7XHJcblxyXG4gICAgICAgIHRkLmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgICBpZiAoaWNvbilcclxuICAgICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiaWNvblwiLCBpY29uKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZElucHV0RXZlbnQgPSAoX2V2ZW50OiBLZXlib2FyZEV2ZW50IHwgTW91c2VFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAoX2V2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCAmJiBfZXZlbnQuY29kZSAhPSDGki5LRVlCT0FSRF9DT0RFLkYyKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IDxIVE1MSW5wdXRFbGVtZW50Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGlucHV0LnJlYWRPbmx5ID0gZmFsc2U7XHJcbiAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ2hhbmdlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgdGhpcy5mb2N1cygpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBIVE1MSW5wdXRFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQ+X2V2ZW50LnRhcmdldDtcclxuICAgICAgdGFyZ2V0LnJlYWRPbmx5ID0gdHJ1ZTtcclxuICAgICAgLy8gbGV0IGtleTogc3RyaW5nID0gdGFyZ2V0LmdldEF0dHJpYnV0ZShcImtleVwiKTtcclxuICAgICAgLy8gbGV0IHByZXZpb3VzVmFsdWU6IMaSLkdlbmVyYWwgPSBSZWZsZWN0LmdldCh0aGlzLmRhdGEsIGtleSk7XHJcblxyXG4gICAgICBpZiAoYXdhaXQgdGhpcy5jb250cm9sbGVyLnJlbmFtZSh0aGlzLmRhdGEsIHRhcmdldC52YWx1ZSkpIHtcclxuICAgICAgICAvLyBSZWZsZWN0LnNldCh0aGlzLmRhdGEsIGtleSwgdGFyZ2V0LnZhbHVlKTsgLy8gd2h5IHNob3VsZG4ndCB0aGUgY29udHJvbGxlciBkbyB0aGlzP1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGlzcGF0Y2ggUmVuYW1lXCIpO1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChFVkVOVC5SRU5BTUUsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSB9IH0pKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ICE9IHRoaXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgc3dpdGNoIChfZXZlbnQuY29kZSkge1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19ET1dOOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX05FWFQsIHsgYnViYmxlczogdHJ1ZSwgc2hpZnRLZXk6IF9ldmVudC5zaGlmdEtleSwgY3RybEtleTogX2V2ZW50LmN0cmxLZXkgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1VQOlxyXG4gICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KG5ldyBLZXlib2FyZEV2ZW50KEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5TUEFDRTpcclxuICAgICAgICAgIHRoaXMuc2VsZWN0KF9ldmVudC5jdHJsS2V5LCBfZXZlbnQuc2hpZnRLZXkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVTQzpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuRVNDQVBFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkM6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuQ09QWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5WOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlBBU1RFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlg6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuQ1VULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnRHJvcCA9IChfZXZlbnQ6IERyYWdFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAvLyBzdG9yZSB0aGUgZHJhZ2dlZCBpdGVtIGluIHRoZSBldmVudCBmb3IgZnVydGhlciBwcm9jZXNzaW5nIGluIHRhYmxlXHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJpdGVtXCIsIHRoaXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMuZm9jdXMoKTtcclxuICAgICAgdGhpcy5zZWxlY3QoX2V2ZW50LmN0cmxLZXksIF9ldmVudC5zaGlmdEtleSk7XHJcbiAgICB9O1xyXG4gIH1cclxuICBjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJ0YWJsZS1pdGVtXCIsIDxDdXN0b21FbGVtZW50Q29uc3RydWN0b3I+PHVua25vd24+VGFibGVJdGVtLCB7IGV4dGVuZHM6IFwidHJcIiB9KTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG5cclxuICAvKipcclxuICAgKiBFeHRlbnNpb24gb2YgdWwtZWxlbWVudCB0aGF0IGtlZXBzIGEgbGlzdCBvZiB7QGxpbmsgVHJlZUl0ZW19cyB0byByZXByZXNlbnQgYSBicmFuY2ggaW4gYSB0cmVlXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRyZWVMaXN0PFQ+IGV4dGVuZHMgSFRNTFVMaXN0RWxlbWVudCB7XHJcbiAgICBwdWJsaWMgY29udHJvbGxlcjogVHJlZUNvbnRyb2xsZXI8VD47XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jb250cm9sbGVyOiBUcmVlQ29udHJvbGxlcjxUPiwgX2l0ZW1zOiBUcmVlSXRlbTxUPltdID0gW10pIHtcclxuICAgICAgc3VwZXIoKTtcclxuICAgICAgdGhpcy5jb250cm9sbGVyID0gX2NvbnRyb2xsZXI7XHJcbiAgICAgIHRoaXMuYWRkSXRlbXMoX2l0ZW1zKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUk9QLCB0aGlzLmhuZERyb3ApO1xyXG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFwidHJlZVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwYW5kcyB0aGUgdHJlZSBhbG9uZyB0aGUgZ2l2ZW4gcGF0aHMgdG8gc2hvdyB0aGUgb2JqZWN0cyB0aGUgcGF0aHMgaW5jbHVkZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGV4cGFuZChfcGF0aHM6IFRbXVtdKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IHBhdGggb2YgX3BhdGhzKVxyXG4gICAgICAgIHRoaXMuc2hvdyhwYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4cGFuZHMgdGhlIHRyZWUgYWxvbmcgdGhlIGdpdmVuIHBhdGggdG8gc2hvdyB0aGUgb2JqZWN0cyB0aGUgcGF0aCBpbmNsdWRlcy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3coX3BhdGg6IFRbXSk6IHZvaWQge1xyXG4gICAgICBsZXQgY3VycmVudFRyZWU6IFRyZWVMaXN0PFQ+ID0gdGhpcztcclxuXHJcbiAgICAgIGZvciAobGV0IGRhdGEgb2YgX3BhdGgpIHtcclxuICAgICAgICBsZXQgaXRlbTogVHJlZUl0ZW08VD4gPSBjdXJyZW50VHJlZS5maW5kSXRlbShkYXRhKTtcclxuICAgICAgICBpZiAoIWl0ZW0pXHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgaWYgKCFpdGVtLmV4cGFuZGVkKVxyXG4gICAgICAgICAgaXRlbS5leHBhbmQodHJ1ZSk7XHJcblxyXG4gICAgICAgIGN1cnJlbnRUcmVlID0gaXRlbS5nZXRCcmFuY2goKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzdHJ1Y3R1cmVzIHRoZSBsaXN0IHRvIHN5bmMgd2l0aCB0aGUgZ2l2ZW4gbGlzdC4gXHJcbiAgICAgKiB7QGxpbmsgVHJlZUl0ZW19cyByZWZlcmVuY2luZyB0aGUgc2FtZSBvYmplY3QgcmVtYWluIGluIHRoZSBsaXN0LCBuZXcgaXRlbXMgZ2V0IGFkZGVkIGluIHRoZSBvcmRlciBvZiBhcHBlYXJhbmNlLCBvYnNvbGV0ZSBvbmVzIGFyZSBkZWxldGVkLlxyXG4gICAgICogQHBhcmFtIF90cmVlIEEgbGlzdCB0byBzeW5jIHRoaXMgd2l0aFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzdHJ1Y3R1cmUoX3RyZWU6IFRyZWVMaXN0PFQ+KTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogVHJlZUl0ZW08VD5bXSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIF90cmVlLmdldEl0ZW1zKCkpIHtcclxuICAgICAgICBsZXQgZm91bmQ6IFRyZWVJdGVtPFQ+ID0gdGhpcy5maW5kSXRlbShpdGVtLmRhdGEpO1xyXG4gICAgICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAgICAgZm91bmQucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgICAgIGZvdW5kLmhhc0NoaWxkcmVuID0gaXRlbS5oYXNDaGlsZHJlbjtcclxuICAgICAgICAgIGlmICghZm91bmQuaGFzQ2hpbGRyZW4pXHJcbiAgICAgICAgICAgIGZvdW5kLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICBpdGVtcy5wdXNoKGZvdW5kKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy5hZGRJdGVtcyhpdGVtcyk7XHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbih0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHtAbGluayBUcmVlSXRlbX0gb2YgdGhpcyBsaXN0IHJlZmVyZW5jaW5nIHRoZSBnaXZlbiBvYmplY3Qgb3IgbnVsbCwgaWYgbm90IGZvdW5kXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmaW5kSXRlbShfZGF0YTogVCk6IFRyZWVJdGVtPFQ+IHtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLmNoaWxkcmVuKVxyXG4gICAgICAgIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKCg8VHJlZUl0ZW08VD4+aXRlbSkuZGF0YSwgX2RhdGEpKVxyXG4gICAgICAgICAgcmV0dXJuIDxUcmVlSXRlbTxUPj5pdGVtO1xyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBnaXZlbiB7QGxpbmsgVHJlZUl0ZW19cyBhdCB0aGUgZW5kIG9mIHRoaXMgbGlzdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkSXRlbXMoX2l0ZW1zOiBUcmVlSXRlbTxUPltdKTogdm9pZCB7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgX2l0ZW1zKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgY29udGVudCBvZiB0aGlzIGxpc3QgYXMgYXJyYXkgb2Yge0BsaW5rIFRyZWVJdGVtfXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEl0ZW1zKCk6IFRyZWVJdGVtPFQ+W10ge1xyXG4gICAgICByZXR1cm4gPFRyZWVJdGVtPFQ+W10+QXJyYXkuZnJvbSh0aGlzLmNoaWxkcmVuKS5maWx0ZXIoX2NoaWxkID0+IF9jaGlsZCBpbnN0YW5jZW9mIFRyZWVJdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGlzcGxheVNlbGVjdGlvbihfZGF0YTogVFtdKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaXRlbS5zZWxlY3RlZCA9IChfZGF0YSAhPSBudWxsICYmIF9kYXRhLmluZGV4T2YoaXRlbS5kYXRhKSA+IC0xKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2VsZWN0SW50ZXJ2YWwoX2RhdGFTdGFydDogVCwgX2RhdGFFbmQ6IFQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW1zOiBOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+PiA9IDxOb2RlTGlzdE9mPFRyZWVJdGVtPFQ+Pj50aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKTtcclxuICAgICAgbGV0IHNlbGVjdGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICBsZXQgZW5kOiBUID0gbnVsbDtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBpdGVtcykge1xyXG4gICAgICAgIGlmICghc2VsZWN0aW5nKSB7XHJcbiAgICAgICAgICBzZWxlY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoaXRlbS5kYXRhLCBfZGF0YVN0YXJ0KSlcclxuICAgICAgICAgICAgZW5kID0gX2RhdGFFbmQ7XHJcbiAgICAgICAgICBlbHNlIGlmICh0aGlzLmNvbnRyb2xsZXIuZXF1YWxzKGl0ZW0uZGF0YSwgX2RhdGFFbmQpKVxyXG4gICAgICAgICAgICBlbmQgPSBfZGF0YVN0YXJ0O1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3RpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGVjdGluZykge1xyXG4gICAgICAgICAgaXRlbS5zZWxlY3QodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoaXRlbS5kYXRhLCBlbmQpKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZWxlY3RBbGwoKTogdm9pZCB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIHRoaXMuc2VsZWN0SW50ZXJ2YWwoaXRlbXNbMF0uZGF0YSwgaXRlbXNbaXRlbXMubGVuZ3RoIC0gMV0uZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZShfZGF0YTogVFtdKTogVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBkZWxldGVkOiBUcmVlSXRlbTxUPltdID0gW107XHJcblxyXG4gICAgICBmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKVxyXG4gICAgICAgIGlmIChfZGF0YS5pbmRleE9mKGl0ZW0uZGF0YSkgPiAtMSkge1xyXG4gICAgICAgICAgaXRlbS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChFVkVOVC5SRU1PVkVfQ0hJTEQsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICBkZWxldGVkLnB1c2goaXRlbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGl0ZW0pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZGVsZXRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZFZpc2libGUoX2RhdGE6IFQpOiBUcmVlSXRlbTxUPiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGl0ZW0gb2YgaXRlbXMpXHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5lcXVhbHMoX2RhdGEsIGl0ZW0uZGF0YSkpXHJcbiAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFsbCBleHBhbmRlZCB7QGxpbmsgVHJlZUl0ZW19cyB0aGF0IGFyZSBhIGRlc2NlbmRhbnQgb2YgdGhpcyBsaXN0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RXhwYW5kZWQoKTogVHJlZUl0ZW08VD5bXSB7XHJcbiAgICAgIHJldHVybiBbLi4udGhpc10uZmlsdGVyKF9pdGVtID0+IF9pdGVtLmV4cGFuZGVkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgKltTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPFRyZWVJdGVtPFQ+PiB7XHJcbiAgICAgIGxldCBpdGVtczogTm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4gPSA8Tm9kZUxpc3RPZjxUcmVlSXRlbTxUPj4+dGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKylcclxuICAgICAgICB5aWVsZCBpdGVtc1tpXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERyb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKFJlZmxlY3QuaGFzKF9ldmVudCwgXCJpbmRleFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0OiBUID0gKDxUcmVlSXRlbTxUPj50aGlzLnBhcmVudEVsZW1lbnQpLmRhdGE7XHJcbiAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJpbmRleFwiLCB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IuaXNDb25uZWN0ZWQgP1xyXG4gICAgICAgIEFycmF5LmZyb20odGhpcy5jaGlsZHJlbikuaW5kZXhPZih0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IpIDpcclxuICAgICAgICBudWxsKTtcclxuICAgICAgUmVmbGVjdC5zZXQoX2V2ZW50LCBcInBhcmVudFwiLCB0YXJnZXQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdPdmVyID0gKF9ldmVudDogRHJhZ0V2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBSZWZsZWN0LnNldChfZXZlbnQsIFwiZHJhZ1Byb2Nlc3NlZFwiLCB0cnVlKTtcclxuXHJcbiAgICAgIGxldCB0YXJnZXQ6IFQgPSAoPFRyZWVJdGVtPFQ+PnRoaXMucGFyZW50RWxlbWVudCkuZGF0YTtcclxuICAgICAgaWYgKHRhcmdldCA9PSBudWxsIHx8ICF0aGlzLmNvbnRyb2xsZXIuY2FuQWRkQ2hpbGRyZW4oQ2xpcGJvYXJkLmRyYWdEcm9wLmdldCgpLCB0YXJnZXQpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBfZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSBcIm1vdmVcIjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMpXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBsZXQgdGFyZ2V0SXRlbTogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LmNvbXBvc2VkUGF0aCgpLmZpbmQoX3RhcmdldCA9PiBfdGFyZ2V0IGluc3RhbmNlb2YgVHJlZUl0ZW0pO1xyXG4gICAgICAgIGlmICh0aGlzLmdldEl0ZW1zKCkuaW5jbHVkZXModGFyZ2V0SXRlbSkpIHtcclxuICAgICAgICAgIGxldCByZWN0OiBET01SZWN0ID0gdGFyZ2V0SXRlbS5jb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgbGV0IGFkZEJlZm9yZTogYm9vbGVhbiA9IF9ldmVudC5jbGllbnRZIDwgcmVjdC50b3AgKyByZWN0LmhlaWdodCAvIDI7XHJcbiAgICAgICAgICBsZXQgc2libGluZzogRWxlbWVudCA9IGFkZEJlZm9yZSA/IHRhcmdldEl0ZW0ucHJldmlvdXNFbGVtZW50U2libGluZyA6IHRhcmdldEl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgaWYgKHNpYmxpbmcgIT0gdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yKVxyXG4gICAgICAgICAgICBpZiAoYWRkQmVmb3JlKVxyXG4gICAgICAgICAgICAgIHRhcmdldEl0ZW0uYmVmb3JlKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICB0YXJnZXRJdGVtLmFmdGVyKHRoaXMuY29udHJvbGxlci5kcmFnRHJvcEluZGljYXRvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKFwidWwtdHJlZS1saXN0XCIsIFRyZWVMaXN0LCB7IGV4dGVuZHM6IFwidWxcIiB9KTtcclxufSIsIi8vLzxyZWZlcmVuY2UgcGF0aD1cIlRyZWVMaXN0LnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgXHJcbiAgZXhwb3J0IGVudW0gQ1NTX0NMQVNTIHtcclxuICAgIFNFTEVDVEVEID0gXCJzZWxlY3RlZFwiLFxyXG4gICAgSU5BQ1RJVkUgPSBcImluYWN0aXZlXCJcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiB7QGxpbmsgVHJlZUxpc3R9IHRoYXQgcmVwcmVzZW50cyB0aGUgcm9vdCBvZiBhIHRyZWUgY29udHJvbCAgXHJcbiAgICogYGBgdGV4dFxyXG4gICAqIHRyZWUgPHVsPlxyXG4gICAqIOKUnCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pScIHRyZWVJdGVtIDxsaT5cclxuICAgKiDilIIg4pSUIHRyZWVMaXN0IDx1bD5cclxuICAgKiDilIIgICDilJwgdHJlZUl0ZW0gPGxpPlxyXG4gICAqIOKUgiAgIOKUlCB0cmVlSXRlbSA8bGk+XHJcbiAgICog4pSUIHRyZWVJdGVtIDxsaT5cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVHJlZTxUPiBleHRlbmRzIFRyZWVMaXN0PFQ+IHtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+LCBfcm9vdDogVCkge1xyXG4gICAgICBzdXBlcihfY29udHJvbGxlciwgW10pO1xyXG4gICAgICBsZXQgcm9vdDogVHJlZUl0ZW08VD4gPSBuZXcgVHJlZUl0ZW08VD4odGhpcy5jb250cm9sbGVyLCBfcm9vdCk7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQocm9vdCk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVhQQU5ELCB0aGlzLmhuZEV4cGFuZCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5TRUxFQ1QsIHRoaXMuaG5kU2VsZWN0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRFTEVURSwgdGhpcy5obmREZWxldGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRVNDQVBFLCB0aGlzLmhuZEVzY2FwZSk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuQ09QWSwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUEFTVEUsIHRoaXMuaG5kQ29weVBhc3RlKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNVVCwgdGhpcy5obmRDb3B5UGFzdGUpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRST1AsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19MRUFWRSwgdGhpcy5obmREcmFnTGVhdmUpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19TVEFSVCwgdGhpcy5obmREcmFnRHJvcCk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5EUkFHX09WRVIsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG5cclxuICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRk9DVVNfTkVYVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX1BSRVZJT1VTLCB0aGlzLmhuZEZvY3VzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENsZWFyIHRoZSBjdXJyZW50IHNlbGVjdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXJTZWxlY3Rpb24oKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24uc3BsaWNlKDApO1xyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24oPFRbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiB0aGUgb2JqZWN0IGluIGZvY3VzIG9yIG51bGwgaWYgbm9uZSBpcyBmb2N1c3NlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Rm9jdXNzZWQoKTogVCB7XHJcbiAgICAgIGxldCBpdGVtczogVHJlZUl0ZW08VD5bXSA9IDxUcmVlSXRlbTxUPltdPkFycmF5LmZyb20odGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIikpO1xyXG4gICAgICBsZXQgZm91bmQ6IG51bWJlciA9IGl0ZW1zLmluZGV4T2YoPFRyZWVJdGVtPFQ+PmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpO1xyXG4gICAgICBpZiAoZm91bmQgPiAtMSlcclxuICAgICAgICByZXR1cm4gaXRlbXNbZm91bmRdLmRhdGE7XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZnJlc2ggdGhlIHdob2xlIHRyZWUgdG8gc3luY2hyb25pemUgd2l0aCB0aGUgZGF0YSB0aGUgdHJlZSBpcyBiYXNlZCBvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMpIHtcclxuICAgICAgICBpZiAoIWl0ZW0uZXhwYW5kZWQpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgbGV0IGJyYW5jaDogVHJlZUxpc3Q8VD4gPSB0aGlzLmNyZWF0ZUJyYW5jaCh0aGlzLmNvbnRyb2xsZXIuZ2V0Q2hpbGRyZW4oaXRlbS5kYXRhKSk7XHJcbiAgICAgICAgaXRlbS5nZXRCcmFuY2goKS5yZXN0cnVjdHVyZShicmFuY2gpO1xyXG4gICAgICAgIGlmICghdGhpcy5jb250cm9sbGVyLmhhc0NoaWxkcmVuKGl0ZW0uZGF0YSkpXHJcbiAgICAgICAgICBpdGVtLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgdGhlIGdpdmVuIGNoaWxkcmVuIHRvIHRoZSBnaXZlbiB0YXJnZXQgYXQgdGhlIGdpdmVuIGluZGV4LiBJZiBubyBpbmRleCBpcyBnaXZlbiwgdGhlIGNoaWxkcmVuIGFyZSBhcHBlbmRlZCBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkQ2hpbGRyZW4oX2NoaWxkcmVuOiBUW10sIF90YXJnZXQ6IFQsIF9pbmRleD86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAvLyBpZiBkcm9wIHRhcmdldCBpbmNsdWRlZCBpbiBjaGlsZHJlbiAtPiByZWZ1c2VcclxuICAgICAgaWYgKF9jaGlsZHJlbi5pbmRleE9mKF90YXJnZXQpID4gLTEpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgLy8gYWRkIG9ubHkgdGhlIG9iamVjdHMgdGhlIGFkZENoaWxkcmVuLW1ldGhvZCBvZiB0aGUgY29udHJvbGxlciByZXR1cm5zXHJcbiAgICAgIGxldCBtb3ZlOiBUW10gPSB0aGlzLmNvbnRyb2xsZXIuYWRkQ2hpbGRyZW4oX2NoaWxkcmVuLCBfdGFyZ2V0LCBfaW5kZXgpO1xyXG4gICAgICBpZiAoIW1vdmUgfHwgbW92ZS5sZW5ndGggPT0gMClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBsZXQgZm9jdXM6IFQgPSB0aGlzLmdldEZvY3Vzc2VkKCk7XHJcbiAgICAgIC8vIFRPRE86IGRvbid0LCB3aGVuIGNvcHlpbmcgb3IgY29taW5nIGZyb20gYW5vdGhlciBzb3VyY2VcclxuICAgICAgdGhpcy5kZWxldGUobW92ZSk7XHJcblxyXG4gICAgICBsZXQgdGFyZ2V0RGF0YTogVCA9IDxUPl90YXJnZXQ7XHJcbiAgICAgIGxldCB0YXJnZXRJdGVtOiBUcmVlSXRlbTxUPiA9IHRoaXMuZmluZFZpc2libGUodGFyZ2V0RGF0YSk7XHJcblxyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuY3JlYXRlQnJhbmNoKHRoaXMuY29udHJvbGxlci5nZXRDaGlsZHJlbih0YXJnZXREYXRhKSk7XHJcbiAgICAgIGxldCBvbGQ6IFRyZWVMaXN0PFQ+ID0gdGFyZ2V0SXRlbS5nZXRCcmFuY2goKTtcclxuICAgICAgdGFyZ2V0SXRlbS5oYXNDaGlsZHJlbiA9IHRydWU7XHJcbiAgICAgIGlmIChvbGQpXHJcbiAgICAgICAgb2xkLnJlc3RydWN0dXJlKGJyYW5jaCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0YXJnZXRJdGVtLmV4cGFuZCh0cnVlKTtcclxuXHJcbiAgICAgIHRoaXMuZmluZFZpc2libGUoZm9jdXMpPy5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kRXhwYW5kKF9ldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgbGV0IGl0ZW06IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIGxldCBjaGlsZHJlbjogcmVhZG9ubHkgVFtdID0gdGhpcy5jb250cm9sbGVyLmdldENoaWxkcmVuKGl0ZW0uZGF0YSk7XHJcbiAgICAgIGlmICghY2hpbGRyZW4gfHwgY2hpbGRyZW4ubGVuZ3RoID09IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgbGV0IGJyYW5jaDogVHJlZUxpc3Q8VD4gPSB0aGlzLmNyZWF0ZUJyYW5jaChjaGlsZHJlbik7XHJcbiAgICAgIGl0ZW0uc2V0QnJhbmNoKGJyYW5jaCk7XHJcbiAgICAgIHRoaXMuZGlzcGxheVNlbGVjdGlvbih0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUJyYW5jaChfZGF0YTogcmVhZG9ubHkgVFtdKTogVHJlZUxpc3Q8VD4ge1xyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IG5ldyBUcmVlTGlzdDxUPih0aGlzLmNvbnRyb2xsZXIsIFtdKTtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgX2RhdGEpIHtcclxuICAgICAgICBicmFuY2guYWRkSXRlbXMoW25ldyBUcmVlSXRlbSh0aGlzLmNvbnRyb2xsZXIsIGNoaWxkKV0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBicmFuY2g7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FsbGJhY2sgLyBFdmVudGhhbmRsZXIgaW4gVHJlZVxyXG4gICAgcHJpdmF0ZSBobmRTZWxlY3QoX2V2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAvLyBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGxldCBkZXRhaWw6IHsgZGF0YTogT2JqZWN0OyBpbnRlcnZhbDogYm9vbGVhbjsgYWRkaXRpdmU6IGJvb2xlYW4gfSA9ICg8Q3VzdG9tRXZlbnQ+X2V2ZW50KS5kZXRhaWw7XHJcbiAgICAgIGxldCBpbmRleDogbnVtYmVyID0gdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5pbmRleE9mKDxUPmRldGFpbC5kYXRhKTtcclxuXHJcbiAgICAgIGlmIChkZXRhaWwuaW50ZXJ2YWwpIHtcclxuICAgICAgICBsZXQgZGF0YVN0YXJ0OiBUID0gPFQ+dGhpcy5jb250cm9sbGVyLnNlbGVjdGlvblswXTtcclxuICAgICAgICBsZXQgZGF0YUVuZDogVCA9IDxUPmRldGFpbC5kYXRhO1xyXG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICB0aGlzLnNlbGVjdEludGVydmFsKGRhdGFTdGFydCwgZGF0YUVuZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaW5kZXggPj0gMCAmJiBkZXRhaWwuYWRkaXRpdmUpXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLnNlbGVjdGlvbi5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBpZiAoIWRldGFpbC5hZGRpdGl2ZSlcclxuICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLnB1c2goPFQ+ZGV0YWlsLmRhdGEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmRpc3BsYXlTZWxlY3Rpb24oPFRbXT50aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZERyYWdEcm9wID0gYXN5bmMgKF9ldmVudDogRHJhZ0V2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCBpdGVtOiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5SZWZsZWN0LmdldChfZXZlbnQsIFwiaXRlbVwiKTtcclxuICAgICAgLy8gX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJub25lXCI7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5EUkFHX1NUQVJUOlxyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJhbGxcIjtcclxuICAgICAgICAgIHRoaXMuY29udHJvbGxlci5kcmFnU3RhcnQoaXRlbS5kYXRhKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJBR19PVkVSOlxyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gdGhpcy5jb250cm9sbGVyLmRyYWdPdmVyKF9ldmVudCk7XHJcbiAgICAgICAgICAvLyBfZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuRFJPUDpcclxuICAgICAgICAgIGxldCBvYmplY3RzOiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZHJvcChfZXZlbnQpO1xyXG4gICAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBSZWZsZWN0LmdldChfZXZlbnQsIFwiaW5kZXhcIik7XHJcbiAgICAgICAgICBsZXQgcGFyZW50OiBUID0gUmVmbGVjdC5nZXQoX2V2ZW50LCBcInBhcmVudFwiKTtcclxuICAgICAgICAgIHRoaXMuYWRkQ2hpbGRyZW4ob2JqZWN0cywgaW5kZXggPT0gbnVsbCA/IGl0ZW0uZGF0YSA6IHBhcmVudCwgaW5kZXgpO1xyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREcmFnTGVhdmUgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IHJlbGF0ZWRUYXJnZXQ6IEV2ZW50VGFyZ2V0ID0gX2V2ZW50LnJlbGF0ZWRUYXJnZXQ7XHJcbiAgICAgIGlmIChyZWxhdGVkVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiYgIXRoaXMuY29udGFpbnMocmVsYXRlZFRhcmdldCkgJiYgIXRoaXMuY29udGFpbnMocmVsYXRlZFRhcmdldC5vZmZzZXRQYXJlbnQpKSAvLyBvZmZzZXQgcGFyZW50IGlzIGZvciB3ZWlyZCAoaW52aXNpYmxlKSBkaXZzIHdoaWNoIGFyZSBwbGFjZWQgb3ZlciBpbnB1dCBlbGVtZW50cyBhbmQgdHJpZ2dlciBsZWF2ZSBldmVudHMuLi4gXHJcbiAgICAgICAgdGhpcy5jb250cm9sbGVyLmRyYWdEcm9wSW5kaWNhdG9yLnJlbW92ZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZERlbGV0ZSA9IGFzeW5jIChfZXZlbnQ6IEV2ZW50KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgIGxldCB0YXJnZXQ6IFRyZWVJdGVtPFQ+ID0gPFRyZWVJdGVtPFQ+Pl9ldmVudC50YXJnZXQ7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgbGV0IHJlbW92ZTogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLmRlbGV0ZShbdGFyZ2V0LmRhdGFdKTtcclxuICAgICAgdGhpcy5kZWxldGUocmVtb3ZlKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRFc2NhcGUgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ29weVBhc3RlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoX2V2ZW50KTtcclxuICAgICAgLy8gX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgdGFyZ2V0OiBUcmVlSXRlbTxUPiA9IDxUcmVlSXRlbTxUPj5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5DT1BZOlxyXG4gICAgICAgICAgdGhpcy5jb250cm9sbGVyLmNvcHkodGhpcy5nZXRGb2N1c3NlZCgpLCBfZXZlbnQudHlwZSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVWRU5ULkNVVDpcclxuICAgICAgICAgIGxldCBjdXQ6IFRbXSA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5jdXQodGhpcy5nZXRGb2N1c3NlZCgpLCBfZXZlbnQudHlwZSk7XHJcbiAgICAgICAgICAvLyBsZXQgY3V0OiBUW10gPSBhd2FpdCB0aGlzLmNvbnRyb2xsZXIuZGVsZXRlKHRoaXMuY29udHJvbGxlci5zZWxlY3Rpb24pO1xyXG4gICAgICAgICAgdGhpcy5kZWxldGUoY3V0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRVZFTlQuUEFTVEU6XHJcbiAgICAgICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICBsZXQgb2JqZWN0czogVFtdID0gYXdhaXQgdGhpcy5jb250cm9sbGVyLnBhc3RlKCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5jb250cm9sbGVyLmNhbkFkZENoaWxkcmVuKG9iamVjdHMsIHRhcmdldC5kYXRhKSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkcmVuKG9iamVjdHMsIHRhcmdldC5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlBBU1RFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRGb2N1cyA9IChfZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgaXRlbXM6IFRyZWVJdGVtPFQ+W10gPSA8VHJlZUl0ZW08VD5bXT5BcnJheS5mcm9tKHRoaXMucXVlcnlTZWxlY3RvckFsbChcImxpXCIpKTtcclxuICAgICAgbGV0IHRhcmdldDogVHJlZUl0ZW08VD4gPSA8VHJlZUl0ZW08VD4+X2V2ZW50LnRhcmdldDtcclxuICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSBpdGVtcy5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgIGlmIChpbmRleCA8IDApXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKF9ldmVudC5zaGlmdEtleSAmJiB0aGlzLmNvbnRyb2xsZXIuc2VsZWN0aW9uLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgIHRhcmdldC5zZWxlY3QodHJ1ZSk7XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19ORVhUOlxyXG4gICAgICAgICAgaWYgKCsraW5kZXggPCBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFVkVOVC5GT0NVU19QUkVWSU9VUzpcclxuICAgICAgICAgIGlmICgtLWluZGV4ID49IDApXHJcbiAgICAgICAgICAgIGl0ZW1zW2luZGV4XS5mb2N1cygpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnNoaWZ0S2V5KVxyXG4gICAgICAgICg8VHJlZUl0ZW08VD4+ZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuc2VsZWN0KHRydWUpO1xyXG4gICAgICBlbHNlIGlmICghX2V2ZW50LmN0cmxLZXkpXHJcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVsLXRyZWVcIiwgVHJlZSwgeyBleHRlbmRzOiBcInVsXCIgfSk7XHJcbn1cclxuIiwiLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vRGF0YUNvbnRyb2xsZXIudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZVVzZXJJbnRlcmZhY2Uge1xyXG4gIC8qKlxyXG4gICAqIFN1YmNsYXNzIHRoaXMgdG8gY3JlYXRlIGEgYnJva2VyIGJldHdlZW4geW91ciBkYXRhIGFuZCBhIHtAbGluayBUcmVlfSB0byBkaXNwbGF5IGFuZCBtYW5pcHVsYXRlIGl0LlxyXG4gICAqIFRoZSB7QGxpbmsgVHJlZX0gZG9lc24ndCBrbm93IGhvdyB5b3VyIGRhdGEgaXMgc3RydWN0dXJlZCBhbmQgaG93IHRvIGhhbmRsZSBpdCwgdGhlIGNvbnRyb2xsZXIgaW1wbGVtZW50cyB0aGUgbWV0aG9kcyBuZWVkZWRcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgVHJlZUNvbnRyb2xsZXI8VD4gZXh0ZW5kcyBEYXRhQ29udHJvbGxlcjxUPiB7XHJcbiAgICAvKiogVXNlZCBieSB0aGUgdHJlZSB0byBpbmRpY2F0ZSB0aGUgZHJvcCBwb3NpdGlvbiB3aGlsZSBkcmFnZ2luZyAqL1xyXG4gICAgcHVibGljIGRyYWdEcm9wSW5kaWNhdG9yOiBIVE1MSFJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhyXCIpO1xyXG5cclxuICAgIC8qKiBPdmVycmlkZSB0byBlbmFibGUgdHJlZSBpdGVtcyB0byBiZSBzb3J0YWJsZSBieSB0aGUgdXNlciB2aWEgZHJhZy1hbmQtZHJvcC4gRGVmYXVsdCBpcyB0cnVlLiAqL1xyXG4gICAgcHVibGljIHNvcnRhYmxlOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE92ZXJyaWRlIGlmIHNvbWUgb2JqZWN0cyBzaG91bGQgbm90IGJlIGRyYWdnYWJsZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZHJhZ2dhYmxlKF9vYmplY3Q6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgdHdvIG9iamVjdHMgb2YgYXJlIGVxdWFsLiBEZWZhdWx0IGlzIF9hID09IF9iLiBPdmVycmlkZSBmb3IgbW9yZSBjb21wbGV4IGNvbXBhcmlzb25zLiBcclxuICAgICAqIFVzZWZ1bCB3aGVuIHRoZSB1bmRlcmx5aW5nIGRhdGEgaXMgdm9sYXRpbGUgYW5kIGNoYW5nZXMgaWRlbnRpdHkgd2hpbGUgc3RheWluZyB0aGUgc2FtZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGVxdWFscyhfYTogVCwgX2I6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIF9hID09IF9iO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3ZlcnJpZGUgaWYgc29tZSBvYmplY3RzIHNob3VsZCBub3QgYmUgYWRkYWJsZSB0byBvdGhlcnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNhbkFkZENoaWxkcmVuKF9zb3VyY2VzOiBUW10sIF90YXJnZXQ6IFQpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgIFxyXG4gICAgLyoqIENyZWF0ZSBhbiBIVE1MRWxlbWVudCBmb3IgdGhlIHRyZWUgaXRlbSByZXByZXNlbnRpbmcgdGhlIG9iamVjdC4gZS5nLiBhbiBIVE1MSW5wdXRFbGVtZW50ICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgY3JlYXRlQ29udGVudChfb2JqZWN0OiBUKTogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLyoqIFJldHJpZXZlIGEgc3BhY2Ugc2VwYXJhdGVkIHN0cmluZyBvZiBhdHRyaWJ1dGVzIHRvIGFkZCB0byB0aGUgbGlzdCBpdGVtIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IGZvciBmdXJ0aGVyIHN0eWxpbmcgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZ2V0QXR0cmlidXRlcyhfb2JqZWN0OiBUKTogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBQcm9jZXNzIHRoZSBwcm9wb3NlZCBuZXcgdmFsdWUuIFRoZSBpZCBvZiB0aGUgaHRtbCBlbGVtZW50IG9uIHdoaWNoIHRoZSBjaGFuZ2Ugb2NjdXJlZCBpcyBwYXNzZWQgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBzZXRWYWx1ZShfb2JqZWN0OiBULCBfZWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50KTogUHJvbWlzZTxib29sZWFuPjtcclxuXHJcbiAgICAvKiogUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBoYXMgY2hpbGRyZW4gdGhhdCBtdXN0IGJlIHNob3duIHdoZW4gdW5mb2xkaW5nIHRoZSB0cmVlIGl0ZW0gKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBoYXNDaGlsZHJlbihfb2JqZWN0OiBUKTogYm9vbGVhbjtcclxuXHJcbiAgICAvKiogUmV0dXJuIHRoZSBvYmplY3QncyBjaGlsZHJlbiB0byBzaG93IHdoZW4gdW5mb2xkaW5nIHRoZSB0cmVlIGl0ZW0gKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBnZXRDaGlsZHJlbihfb2JqZWN0OiBUKTogcmVhZG9ubHkgVFtdO1xyXG5cclxuICAgIC8qKiBcclxuICAgICAqIFByb2Nlc3MgdGhlIGxpc3Qgb2Ygc291cmNlIG9iamVjdHMgdG8gYmUgYWRkZWRBc0NoaWxkcmVuIHdoZW4gZHJvcHBpbmcgb3IgcGFzdGluZyBvbnRvIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QsIFxyXG4gICAgICogcmV0dXJuIHRoZSBsaXN0IG9mIG9iamVjdHMgdGhhdCBzaG91bGQgdmlzaWJseSBiZWNvbWUgdGhlIGNoaWxkcmVuIG9mIHRoZSB0YXJnZXQgaXRlbS9vYmplY3QgXHJcbiAgICAgKiBAcGFyYW0gX2NoaWxkcmVuIEEgbGlzdCBvZiBvYmplY3RzIHRoZSB0cmVlIHRyaWVzIHRvIGFkZCB0byB0aGUgX3RhcmdldFxyXG4gICAgICogQHBhcmFtIF90YXJnZXQgVGhlIG9iamVjdCByZWZlcmVuY2VkIGJ5IHRoZSBpdGVtIHRoZSBkcm9wIG9jY3VycyBvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgYWRkQ2hpbGRyZW4oX3NvdXJjZXM6IFRbXSwgX3RhcmdldDogVCwgX2luZGV4PzogbnVtYmVyKTogVFtdO1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuc2lvbiBvZiBsaS1lbGVtZW50IHRoYXQgcmVwcmVzZW50cyBhbiBvYmplY3QgaW4gYSB7QGxpbmsgVHJlZUxpc3R9IHdpdGggYSBjaGVja2JveCBhbmQgdXNlciBkZWZpbmVkIGlucHV0IGVsZW1lbnRzIGFzIGNvbnRlbnQuXHJcbiAgICogQWRkaXRpb25hbGx5LCBtYXkgaG9sZCBhbiBpbnN0YW5jZSBvZiB7QGxpbmsgVHJlZUxpc3R9IGFzIGJyYW5jaCB0byBkaXNwbGF5IGNoaWxkcmVuIG9mIHRoZSBjb3JyZXNwb25kaW5nIG9iamVjdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgVHJlZUl0ZW08VD4gZXh0ZW5kcyBIVE1MTElFbGVtZW50IHtcclxuICAgIHB1YmxpYyBjbGFzc2VzOiBDU1NfQ0xBU1NbXSA9IFtdO1xyXG4gICAgcHVibGljIGRhdGE6IFQgPSBudWxsO1xyXG4gICAgcHVibGljIGNvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+O1xyXG5cclxuICAgIHByaXZhdGUgY2hlY2tib3g6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAjY29udGVudDogSFRNTEZpZWxkU2V0RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NvbnRyb2xsZXI6IFRyZWVDb250cm9sbGVyPFQ+LCBfZGF0YTogVCkge1xyXG4gICAgICBzdXBlcigpO1xyXG4gICAgICB0aGlzLmNvbnRyb2xsZXIgPSBfY29udHJvbGxlcjtcclxuICAgICAgdGhpcy5kYXRhID0gX2RhdGE7XHJcbiAgICAgIC8vIFRPRE86IGhhbmRsZSBjc3NDbGFzc2VzXHJcbiAgICAgIHRoaXMuY3JlYXRlKCk7XHJcbiAgICAgIHRoaXMuaGFzQ2hpbGRyZW4gPSB0aGlzLmNvbnRyb2xsZXIuaGFzQ2hpbGRyZW4oX2RhdGEpO1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkNIQU5HRSwgdGhpcy5obmRDaGFuZ2UpO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRE9VQkxFX0NMSUNLLCB0aGlzLmhuZERibENsaWNrKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkZPQ1VTX09VVCwgdGhpcy5obmRGb2N1cyk7XHJcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihFVkVOVC5LRVlfRE9XTiwgdGhpcy5obmRLZXkpO1xyXG4gICAgICAvLyB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlRfVFJFRS5GT0NVU19ORVhULCB0aGlzLmhuZEZvY3VzKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5UX1RSRUUuRk9DVVNfUFJFVklPVVMsIHRoaXMuaG5kRm9jdXMpO1xyXG5cclxuICAgICAgdGhpcy5kcmFnZ2FibGUgPSB0aGlzLmNvbnRyb2xsZXIuZHJhZ2dhYmxlKF9kYXRhKTtcclxuICAgICAgLy8gdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ1N0YXJ0KTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfU1RBUlQsIHRoaXMuaG5kRHJhZ0Ryb3ApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19FTlRFUiwgdGhpcy5obmREcmFnT3Zlcik7IC8vIHRoaXMgcHJldmVudHMgY3Vyc29yIGZyb20gZmxpY2tlcmluZ1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19FTlRFUiwgdGhpcy5obmREcmFnRHJvcCk7IC8vIHRoaXMgcHJldmVudHMgY3Vyc29yIGZyb20gZmxpY2tlcmluZ1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJBR19PVkVSLCB0aGlzLmhuZERyYWdEcm9wKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKEVWRU5ULkRSQUdfT1ZFUiwgdGhpcy5obmREcmFnT3Zlcik7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuRFJPUCwgdGhpcy5obmREcmFnRHJvcCk7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUE9JTlRFUl9VUCwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoRVZFTlQuUkVNT1ZFX0NISUxELCB0aGlzLmhuZFJlbW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRydWUsIHdoZW4gdGhpcyBpdGVtIGhhcyBhIHZpc2libGUgY2hlY2tib3ggaW4gZnJvbnQgdG8gZXhwYW5kIHRoZSBzdWJzZXF1ZW50IGJyYW5jaCBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBoYXNDaGlsZHJlbigpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2hlY2tib3guc3R5bGUudmlzaWJpbGl0eSAhPSBcImhpZGRlblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvd3Mgb3IgaGlkZXMgdGhlIGNoZWNrYm94IGZvciBleHBhbmRpbmcgdGhlIHN1YnNlcXVlbnQgYnJhbmNoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgaGFzQ2hpbGRyZW4oX2hhczogYm9vbGVhbikge1xyXG4gICAgICB0aGlzLmNoZWNrYm94LnN0eWxlLnZpc2liaWxpdHkgPSBfaGFzID8gXCJ2aXNpYmxlXCIgOiBcImhpZGRlblwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB7QGxpbmsgQ1NTX0NMQVNTLlNFTEVDVEVEfSBpcyBhdHRhY2hlZCB0byB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuIHRoaXMuY2xhc3NMaXN0LmNvbnRhaW5zKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2hlcyBvciBkZXRhY2hlcyB0aGUge0BsaW5rIENTU19DTEFTUy5TRUxFQ1RFRH0gdG8gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWQoX29uOiBib29sZWFuKSB7XHJcbiAgICAgIGlmIChfb24pXHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKENTU19DTEFTUy5TRUxFQ1RFRCk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoQ1NTX0NMQVNTLlNFTEVDVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIGNvbnRlbnQgcmVwcmVzZW50aW5nIHRoZSBhdHRhY2hlZCB7QGxpbmsgZGF0YX1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBjb250ZW50KCk6IEhUTUxGaWVsZFNldEVsZW1lbnQge1xyXG4gICAgICByZXR1cm4gdGhpcy4jY29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGlzIGl0ZW0gaXMgZXhwYW5kZWQsIHNob3dpbmcgaXQncyBjaGlsZHJlbiwgb3IgY2xvc2VkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgZXhwYW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldEJyYW5jaCgpICYmIHRoaXMuY2hlY2tib3guY2hlY2tlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVmcmVzaEF0dHJpYnV0ZXMoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiYXR0cmlidXRlc1wiLCB0aGlzLmNvbnRyb2xsZXIuZ2V0QXR0cmlidXRlcyh0aGlzLmRhdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVmcmVzaENvbnRlbnQoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgdGhpcy4jY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xsZXIuY3JlYXRlQ29udGVudCh0aGlzLmRhdGEpKTtcclxuICAgICAgdGhpcy4jY29udGVudC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgIGZvciAoY29uc3QgZGVzY2VuZGFudCBvZiA8Tm9kZUxpc3RPZjxIVE1MRWxlbWVudD4+dGhpcy4jY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW3RpdGxlXVwiKSkgXHJcbiAgICAgICAgdGhpcy50aXRsZSArPSBkZXNjZW5kYW50LnRpdGxlICsgXCJcXG5cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyaWVzIHRvIGV4cGFuZGluZyB0aGUge0BsaW5rIFRyZWVMaXN0fSBvZiBjaGlsZHJlbiwgYnkgZGlzcGF0Y2hpbmcge0BsaW5rIEVWRU5ULkVYUEFORH0uXHJcbiAgICAgKiBUaGUgdXNlciBvZiB0aGUgdHJlZSBuZWVkcyB0byBhZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHRyZWUgXHJcbiAgICAgKiBpbiBvcmRlciB0byBjcmVhdGUgdGhhdCB7QGxpbmsgVHJlZUxpc3R9IGFuZCBhZGQgaXQgYXMgYnJhbmNoIHRvIHRoaXMgaXRlbVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXhwYW5kKF9leHBhbmQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgdGhpcy5yZW1vdmVCcmFuY2goKTtcclxuXHJcbiAgICAgIGlmIChfZXhwYW5kKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuRVhQQU5ELCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG5cclxuICAgICAgdGhpcy5jaGVja2JveC5jaGVja2VkID0gX2V4cGFuZDtcclxuICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IHRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbih0aGlzLmRhdGEpO1xyXG4gICAgICAvLyAoPEhUTUxJbnB1dEVsZW1lbnQ+dGhpcy5xdWVyeVNlbGVjdG9yKFwiaW5wdXRbdHlwZT0nY2hlY2tib3gnXVwiKSkuY2hlY2tlZCA9IF9leHBhbmQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBhbGwgZGF0YSByZWZlcmVuY2VkIGJ5IHRoZSBpdGVtcyBzdWNjZWVkaW5nIHRoaXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFZpc2libGVEYXRhKCk6IFRbXSB7XHJcbiAgICAgIGxldCBsaXN0OiBOb2RlTGlzdE9mPEhUTUxMSUVsZW1lbnQ+ID0gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKFwibGlcIik7XHJcbiAgICAgIGxldCBkYXRhOiBUW10gPSBbXTtcclxuICAgICAgZm9yIChsZXQgaXRlbSBvZiBsaXN0KVxyXG4gICAgICAgIGRhdGEucHVzaCgoPFRyZWVJdGVtPFQ+Pml0ZW0pLmRhdGEpO1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGJyYW5jaCBvZiBjaGlsZHJlbiBvZiB0aGlzIGl0ZW0uIFRoZSBicmFuY2ggbXVzdCBiZSBhIHByZXZpb3VzbHkgY29tcGlsZWQge0BsaW5rIFRyZWVMaXN0fVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0QnJhbmNoKF9icmFuY2g6IFRyZWVMaXN0PFQ+KTogdm9pZCB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQnJhbmNoKCk7XHJcbiAgICAgIGlmIChfYnJhbmNoKVxyXG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoX2JyYW5jaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBicmFuY2ggb2YgY2hpbGRyZW4gb2YgdGhpcyBpdGVtLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0QnJhbmNoKCk6IFRyZWVMaXN0PFQ+IHtcclxuICAgICAgcmV0dXJuIDxUcmVlTGlzdDxUPj50aGlzLnF1ZXJ5U2VsZWN0b3IoXCJ1bFwiKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXNwYXRjaGVzIHRoZSB7QGxpbmsgRVZFTlQuU0VMRUNUfSBldmVudFxyXG4gICAgICogQHBhcmFtIF9hZGRpdGl2ZSBGb3IgbXVsdGlwbGUgc2VsZWN0aW9uICgrQ3RybCkgXHJcbiAgICAgKiBAcGFyYW0gX2ludGVydmFsIEZvciBzZWxlY3Rpb24gb3ZlciBpbnRlcnZhbCAoK1NoaWZ0KVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2VsZWN0KF9hZGRpdGl2ZTogYm9vbGVhbiwgX2ludGVydmFsOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcclxuICAgICAgbGV0IGV2ZW50OiBDdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudChFVkVOVC5TRUxFQ1QsIHsgYnViYmxlczogdHJ1ZSwgZGV0YWlsOiB7IGRhdGE6IHRoaXMuZGF0YSwgYWRkaXRpdmU6IF9hZGRpdGl2ZSwgaW50ZXJ2YWw6IF9pbnRlcnZhbCB9IH0pO1xyXG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyB0aGUgYnJhbmNoIG9mIGNoaWxkcmVuIGZyb20gdGhpcyBpdGVtXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVtb3ZlQnJhbmNoKCk6IHZvaWQge1xyXG4gICAgICBsZXQgYnJhbmNoOiBUcmVlTGlzdDxUPiA9IHRoaXMuZ2V0QnJhbmNoKCk7XHJcbiAgICAgIGlmICghYnJhbmNoKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgdGhpcy5yZW1vdmVDaGlsZChicmFuY2gpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICB0aGlzLmNoZWNrYm94LnR5cGUgPSBcImNoZWNrYm94XCI7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jaGVja2JveCk7XHJcbiAgICAgIHRoaXMuI2NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmllbGRzZXRcIik7XHJcbiAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy4jY29udGVudCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaENvbnRlbnQoKTtcclxuICAgICAgdGhpcy5yZWZyZXNoQXR0cmlidXRlcygpO1xyXG4gICAgICB0aGlzLnRhYkluZGV4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZEZvY3VzID0gKF9ldmVudDogRm9jdXNFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzLmNoZWNrYm94KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQudGFyZ2V0ID09IHRoaXMpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy4jY29udGVudC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kS2V5ID0gKF9ldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuI2NvbnRlbnQuZGlzYWJsZWQpIHtcclxuICAgICAgICBpZiAoX2V2ZW50LmNvZGUgPT0gxpIuS0VZQk9BUkRfQ09ERS5FU0MgfHwgX2V2ZW50LmNvZGUgPT0gxpIuS0VZQk9BUkRfQ09ERS5FTlRFUilcclxuICAgICAgICAgIHRoaXMuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzd2l0Y2ggKF9ldmVudC5jb2RlKSB7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkFSUk9XX1JJR0hUOlxyXG4gICAgICAgICAgaWYgKHRoaXMuaGFzQ2hpbGRyZW4gJiYgIXRoaXMuZXhwYW5kZWQpXHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kKHRydWUpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoRVZFTlQuRk9DVVNfTkVYVCwgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfTEVGVDpcclxuICAgICAgICAgIGlmICh0aGlzLmV4cGFuZGVkKVxyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZChmYWxzZSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19QUkVWSU9VUywgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuQVJST1dfRE9XTjpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19ORVhULCB7IGJ1YmJsZXM6IHRydWUsIHNoaWZ0S2V5OiBfZXZlbnQuc2hpZnRLZXksIGN0cmxLZXk6IF9ldmVudC5jdHJsS2V5IH0pKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5BUlJPV19VUDpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChFVkVOVC5GT0NVU19QUkVWSU9VUywgeyBidWJibGVzOiB0cnVlLCBzaGlmdEtleTogX2V2ZW50LnNoaWZ0S2V5LCBjdHJsS2V5OiBfZXZlbnQuY3RybEtleSB9KSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIMaSLktFWUJPQVJEX0NPREUuRjI6XHJcbiAgICAgICAgICBjb25zdCBlbGVtZW50OiBIVE1MRWxlbWVudCA9IDxIVE1MRWxlbWVudD50aGlzLiNjb250ZW50LmVsZW1lbnRzLml0ZW0oMCk7XHJcbiAgICAgICAgICBpZiAoIWVsZW1lbnQpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5TUEFDRTpcclxuICAgICAgICAgIHRoaXMuc2VsZWN0KF9ldmVudC5jdHJsS2V5LCBfZXZlbnQuc2hpZnRLZXkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkVTQzpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuRVNDQVBFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkRFTEVURTpcclxuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuREVMRVRFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLkM6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuQ09QWSwgeyBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgxpIuS0VZQk9BUkRfQ09ERS5WOlxyXG4gICAgICAgICAgaWYgKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5tZXRhS2V5KSB7XHJcbiAgICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KEVWRU5ULlBBU1RFLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSDGki5LRVlCT0FSRF9DT0RFLlg6XHJcbiAgICAgICAgICBpZiAoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50Lm1ldGFLZXkpIHtcclxuICAgICAgICAgICAgX2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoRVZFTlQuQ1VULCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmREYmxDbGljayA9IChfZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgX2V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBpZiAoX2V2ZW50LnRhcmdldCA9PSB0aGlzLmNoZWNrYm94KVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuI2NvbnRlbnQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgY29uc3QgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChfZXZlbnQucGFnZVgsIF9ldmVudC5wYWdlWSk7IC8vIGRpc2FibGVkIGVsZW1lbnRzIGRvbid0IGRpc3BhdGNoIGNsaWNrIGV2ZW50cywgZ2V0IHRoZSBlbGVtZW50IG1hbnVhbGx5XHJcbiAgICAgIGlmICghZWxlbWVudClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBlbGVtZW50LmZvY3VzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kQ2hhbmdlID0gYXN5bmMgKF9ldmVudDogRXZlbnQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgbGV0IHRhcmdldDogSFRNTElucHV0RWxlbWVudCB8IEhUTUxTZWxlY3RFbGVtZW50ID0gPEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudD5fZXZlbnQudGFyZ2V0O1xyXG4gICAgICBfZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiB0YXJnZXQudHlwZSA9PSBcImNoZWNrYm94XCIpIHtcclxuICAgICAgICB0aGlzLmV4cGFuZCh0YXJnZXQuY2hlY2tlZCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgcmVuYW1lZDogYm9vbGVhbiA9IGF3YWl0IHRoaXMuY29udHJvbGxlci5zZXRWYWx1ZSh0aGlzLmRhdGEsIHRhcmdldCk7XHJcblxyXG4gICAgICB0aGlzLnJlZnJlc2hDb250ZW50KCk7XHJcbiAgICAgIHRoaXMucmVmcmVzaEF0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICAgIGlmIChyZW5hbWVkKVxyXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoRVZFTlQuUkVOQU1FLCB7IGJ1YmJsZXM6IHRydWUsIGRldGFpbDogeyBkYXRhOiB0aGlzLmRhdGEgfSB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ0Ryb3AgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgLy8gaWYgKF9ldmVudC50eXBlID09IEVWRU5ULkRST1ApXHJcbiAgICAgIC8vICAgZGVidWdnZXI7XHJcbiAgICAgIGlmIChSZWZsZWN0LmdldChfZXZlbnQsIFwiaXRlbVwiKSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIC8vIHN0b3JlIHRoZSBkcmFnZ2VkIGl0ZW0gaW4gdGhlIGV2ZW50IGZvciBmdXJ0aGVyIHByb2Nlc3NpbmcgaW4gdGFibGVcclxuICAgICAgUmVmbGVjdC5zZXQoX2V2ZW50LCBcIml0ZW1cIiwgdGhpcyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kRHJhZ092ZXIgPSAoX2V2ZW50OiBEcmFnRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKFJlZmxlY3QuZ2V0KF9ldmVudCwgXCJkcmFnUHJvY2Vzc2VkXCIpKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGxldCByZWN0OiBET01SZWN0ID0gdGhpcy4jY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgbGV0IHVwcGVyOiBudW1iZXIgPSByZWN0LnRvcCArIHJlY3QuaGVpZ2h0ICogKDEgLyA0KTtcclxuICAgICAgbGV0IGxvd2VyOiBudW1iZXIgPSByZWN0LnRvcCArIHJlY3QuaGVpZ2h0ICogKDMgLyA0KTtcclxuICAgICAgbGV0IG9mZnNldDogbnVtYmVyID0gX2V2ZW50LmNsaWVudFk7XHJcbiAgICAgIGlmICh0aGlzLnBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBUcmVlIHx8IChvZmZzZXQgPiB1cHBlciAmJiAob2Zmc2V0IDwgbG93ZXIgfHwgdGhpcy5jaGVja2JveC5jaGVja2VkKSkgfHwgIXRoaXMuY29udHJvbGxlci5zb3J0YWJsZSkge1xyXG4gICAgICAgIFJlZmxlY3Quc2V0KF9ldmVudCwgXCJkcmFnUHJvY2Vzc2VkXCIsIHRydWUpO1xyXG4gICAgICAgIGlmIChfZXZlbnQudHlwZSA9PSBFVkVOVC5EUkFHX09WRVIpXHJcbiAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIuZHJhZ0Ryb3BJbmRpY2F0b3IucmVtb3ZlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udHJvbGxlci5jYW5BZGRDaGlsZHJlbihDbGlwYm9hcmQuZHJhZ0Ryb3AuZ2V0KCksIHRoaXMuZGF0YSkpIHtcclxuICAgICAgICAgIF9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgX2V2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gXCJtb3ZlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlclVwID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgaWYgKF9ldmVudC50YXJnZXQgPT0gdGhpcy5jaGVja2JveClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIHRoaXMuc2VsZWN0KF9ldmVudC5jdHJsS2V5LCBfZXZlbnQuc2hpZnRLZXkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFJlbW92ZSA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIC8vIHRoZSB2aWV3cyBtaWdodCBuZWVkIHRvIGtub3cgYWJvdXQgdGhpcyBldmVudFxyXG4gICAgICAvLyBpZiAoX2V2ZW50LmN1cnJlbnRUYXJnZXQgPT0gX2V2ZW50LnRhcmdldClcclxuICAgICAgLy8gICByZXR1cm47XHJcbiAgICAgIC8vIF9ldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgdGhpcy5oYXNDaGlsZHJlbiA9IHRoaXMuY29udHJvbGxlci5oYXNDaGlsZHJlbih0aGlzLmRhdGEpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGN1c3RvbUVsZW1lbnRzLmRlZmluZShcImxpLXRyZWUtaXRlbVwiLCBUcmVlSXRlbSwgeyBleHRlbmRzOiBcImxpXCIgfSk7XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VVc2VySW50ZXJmYWNlIHtcclxuXHJcbiAgZXhwb3J0IHR5cGUgRFJPUEVGRkVDVCA9IFwibm9uZVwiIHwgXCJjb3B5XCIgfCBcImxpbmtcIiB8IFwibW92ZVwiO1xyXG5cclxuICBleHBvcnQgY29uc3QgZW51bSBFVkVOVCB7XHJcbiAgICBDTElDSyA9IFwiY2xpY2tcIixcclxuICAgIERPVUJMRV9DTElDSyA9IFwiZGJsY2xpY2tcIixcclxuICAgIEtFWV9ET1dOID0gXCJrZXlkb3duXCIsXHJcbiAgICBLRVlfVVAgPSBcImtleXVwXCIsXHJcbiAgICBEUkFHX1NUQVJUID0gXCJkcmFnc3RhcnRcIixcclxuICAgIERSQUdfRU5URVIgPSBcImRyYWdlbnRlclwiLFxyXG4gICAgRFJBR19PVkVSID0gXCJkcmFnb3ZlclwiLFxyXG4gICAgRFJBR19MRUFWRSA9IFwiZHJhZ2xlYXZlXCIsXHJcbiAgICBEUk9QID0gXCJkcm9wXCIsXHJcbiAgICBQT0lOVEVSX1VQID0gXCJwb2ludGVydXBcIixcclxuICAgIFdIRUVMID0gXCJ3aGVlbFwiLFxyXG4gICAgRk9DVVNfTkVYVCA9IFwiZm9jdXNOZXh0XCIsXHJcbiAgICBGT0NVU19QUkVWSU9VUyA9IFwiZm9jdXNQcmV2aW91c1wiLFxyXG4gICAgRk9DVVNfSU4gPSBcImZvY3VzaW5cIixcclxuICAgIEZPQ1VTX09VVCA9IFwiZm9jdXNvdXRcIixcclxuICAgIEZPQ1VTX1NFVCA9IFwiZm9jdXNTZXRcIixcclxuICAgIEZPQ1VTID0gXCJmb2N1c1wiLFxyXG4gICAgQkxVUiA9IFwiYmx1clwiLFxyXG4gICAgQ0hBTkdFID0gXCJjaGFuZ2VcIixcclxuICAgIERFTEVURSA9IFwiZGVsZXRlXCIsXHJcbiAgICBSRU5BTUUgPSBcInJlbmFtZVwiLFxyXG4gICAgU0VMRUNUID0gXCJpdGVtc2VsZWN0XCIsXHJcbiAgICBFU0NBUEUgPSBcImVzY2FwZVwiLFxyXG4gICAgQ09QWSA9IFwiY29weVwiLFxyXG4gICAgQ1VUID0gXCJjdXRcIixcclxuICAgIFBBU1RFID0gXCJwYXN0ZVwiLFxyXG4gICAgU09SVCA9IFwic29ydFwiLFxyXG4gICAgQ09OVEVYVE1FTlUgPSBcImNvbnRleHRtZW51XCIsXHJcbiAgICBNVVRBVEUgPSBcIm11dGF0ZVwiLFxyXG4gICAgUkVNT1ZFX0NISUxEID0gXCJyZW1vdmVDaGlsZFwiLFxyXG4gICAgQ09MTEFQU0UgPSBcImNvbGxhcHNlXCIsXHJcbiAgICBFWFBBTkQgPSBcImV4cGFuZFwiLFxyXG4gICAgSU5QVVQgPSBcImlucHV0XCIsXHJcbiAgICBSRUFSUkFOR0VfQVJSQVkgPSBcInJlYXJyYW5nZUFycmF5XCIsXHJcbiAgICBSRVNUUlVDVFVSRV9BUlJBWSA9IFwicmVzdHJ1Y3R1cmVBcnJheVwiLFxyXG4gICAgVE9HR0xFID0gXCJ0b2dnbGVcIixcclxuICAgIFBPSU5URVJfTU9WRSA9IFwicG9pbnRlcm1vdmVcIixcclxuICAgIElOU0VSVCA9IFwiaW5zZXJ0XCIsXHJcbiAgICBTRUxFQ1RfQUxMID0gXCJzZWxlY3RBbGxcIixcclxuICAgIFNBVkVfSElTVE9SWSA9IFwic2F2ZUhpc3RvcnlcIixcclxuICAgIFJFUVVFU1RfT1BUSU9OUyA9IFwicmVxdWVzdE9wdGlvbnNcIixcclxuICAgIFNFVF9WQUxVRSA9IFwic2V0VmFsdWVcIixcclxuICAgIElOSVRJQUxJWkVfVkFMVUUgPSBcImluaXRpYWxpemVWYWx1ZVwiXHJcbiAgfVxyXG59Il19