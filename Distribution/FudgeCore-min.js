"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function")
        throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn)
            context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access)
            context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done)
            throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0)
                continue;
            if (result === null || typeof result !== "object")
                throw new TypeError("Object expected");
            if (_ = accept(result.get))
                descriptor.get = _;
            if (_ = accept(result.set))
                descriptor.set = _;
            if (_ = accept(result.init))
                initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field")
                initializers.unshift(_);
            else
                descriptor[key] = _;
        }
    }
    if (target)
        Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var FudgeCore;
(function (FudgeCore) {
    class DebugTarget {
        static mergeArguments(_message, ..._args) {
            let out = _message.toString();
            for (let arg of _args)
                if (arg instanceof Number)
                    out += ", " + arg.toPrecision(2).toString();
                else
                    out += ", " + arg.toString();
            return out;
        }
    }
    FudgeCore.DebugTarget = DebugTarget;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let DEBUG_FILTER;
    (function (DEBUG_FILTER) {
        DEBUG_FILTER[DEBUG_FILTER["NONE"] = 0] = "NONE";
        DEBUG_FILTER[DEBUG_FILTER["INFO"] = 1] = "INFO";
        DEBUG_FILTER[DEBUG_FILTER["LOG"] = 2] = "LOG";
        DEBUG_FILTER[DEBUG_FILTER["WARN"] = 4] = "WARN";
        DEBUG_FILTER[DEBUG_FILTER["ERROR"] = 8] = "ERROR";
        DEBUG_FILTER[DEBUG_FILTER["FUDGE"] = 16] = "FUDGE";
        DEBUG_FILTER[DEBUG_FILTER["CLEAR"] = 256] = "CLEAR";
        DEBUG_FILTER[DEBUG_FILTER["GROUP"] = 257] = "GROUP";
        DEBUG_FILTER[DEBUG_FILTER["GROUPCOLLAPSED"] = 258] = "GROUPCOLLAPSED";
        DEBUG_FILTER[DEBUG_FILTER["GROUPEND"] = 260] = "GROUPEND";
        DEBUG_FILTER[DEBUG_FILTER["SOURCE"] = 512] = "SOURCE";
        DEBUG_FILTER[DEBUG_FILTER["MESSAGES"] = 31] = "MESSAGES";
        DEBUG_FILTER[DEBUG_FILTER["FORMAT"] = 263] = "FORMAT";
        DEBUG_FILTER[DEBUG_FILTER["ALL"] = 287] = "ALL";
    })(DEBUG_FILTER = FudgeCore.DEBUG_FILTER || (FudgeCore.DEBUG_FILTER = {}));
    FudgeCore.DEBUG_SYMBOL = {
        [DEBUG_FILTER.INFO]: "✓",
        [DEBUG_FILTER.LOG]: "✎",
        [DEBUG_FILTER.WARN]: "⚠",
        [DEBUG_FILTER.ERROR]: "❌",
        [DEBUG_FILTER.FUDGE]: "🎲",
        [DEBUG_FILTER.SOURCE]: "🔗"
    };
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class DebugConsole extends FudgeCore.DebugTarget {
        static {
            this.delegates = {
                [FudgeCore.DEBUG_FILTER.INFO]: console.info,
                [FudgeCore.DEBUG_FILTER.LOG]: console.log,
                [FudgeCore.DEBUG_FILTER.WARN]: console.warn,
                [FudgeCore.DEBUG_FILTER.ERROR]: console.error,
                [FudgeCore.DEBUG_FILTER.FUDGE]: DebugConsole.fudge,
                [FudgeCore.DEBUG_FILTER.CLEAR]: console.clear,
                [FudgeCore.DEBUG_FILTER.GROUP]: console.group,
                [FudgeCore.DEBUG_FILTER.GROUPCOLLAPSED]: console.groupCollapsed,
                [FudgeCore.DEBUG_FILTER.GROUPEND]: console.groupEnd,
                [FudgeCore.DEBUG_FILTER.SOURCE]: DebugConsole.source
            };
        }
        static fudge(_message, ..._args) {
            console.debug(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.FUDGE], _message, ..._args);
        }
        static source(_message, ..._args) {
            console.log(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.SOURCE], _message, ..._args);
        }
    }
    FudgeCore.DebugConsole = DebugConsole;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Debug {
        static { this.delegates = Debug.setupConsole(); }
        static setFilter(_target, _filter) {
            for (let filter in Debug.delegates)
                Debug.delegates[filter].delete(_target);
            for (let filter in FudgeCore.DEBUG_FILTER) {
                let parsed = parseInt(filter);
                if (isNaN(parsed))
                    break;
                if ([FudgeCore.DEBUG_FILTER.MESSAGES, FudgeCore.DEBUG_FILTER.FORMAT, FudgeCore.DEBUG_FILTER.ALL].indexOf(parsed) != -1)
                    continue;
                if (_filter & parsed)
                    Debug.delegates[parsed].set(_target, _target.delegates[parsed]);
            }
        }
        static getFilter(_target) {
            let result = 0;
            for (let filter in _target.delegates)
                result |= parseInt(filter);
            return result;
        }
        static addFilter(_target, _filter) {
            let current = Debug.getFilter(_target);
            Debug.setFilter(_target, current | _filter);
        }
        static removeFilter(_target, _filter) {
            let current = Debug.getFilter(_target);
            Debug.setFilter(_target, current ^ _filter);
        }
        static info(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.INFO, _message, _args);
        }
        static log(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.LOG, _message, _args);
        }
        static warn(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.WARN, _message, _args);
        }
        static error(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.ERROR, _message, _args);
        }
        static fudge(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.FUDGE, _message, _args);
        }
        static clear() {
            Debug.delegate(FudgeCore.DEBUG_FILTER.CLEAR, null, null);
        }
        static group(_name) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.GROUP, _name, null);
        }
        static groupCollapsed(_name) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.GROUPCOLLAPSED, _name, null);
        }
        static groupEnd() {
            Debug.delegate(FudgeCore.DEBUG_FILTER.GROUPEND, null, null);
        }
        static branch(_branch) {
            if (_branch.nChildren > 0)
                Debug.group(_branch.name);
            else
                Debug.fudge(_branch.name);
            for (let child of _branch.getChildren())
                Debug.branch(child);
            if (_branch.nChildren > 0)
                Debug.groupEnd();
        }
        static source(_message, ..._args) {
            Debug.delegate(FudgeCore.DEBUG_FILTER.SOURCE, _message, _args);
        }
        static delegate(_filter, _message, _args) {
            if (_filter == FudgeCore.DEBUG_FILTER.LOG || _filter == FudgeCore.DEBUG_FILTER.WARN || _filter == FudgeCore.DEBUG_FILTER.ERROR) {
                if (Debug.delegates[FudgeCore.DEBUG_FILTER.SOURCE])
                    for (let delegate of Debug.delegates[FudgeCore.DEBUG_FILTER.SOURCE].values())
                        if (delegate) {
                            let trace = new Error("Test").stack.split("\n");
                            delegate(trace[3]);
                        }
            }
            let delegates = Debug.delegates[_filter];
            for (let delegate of delegates.values())
                if (delegate)
                    if (_args && _args.length > 0)
                        delegate(_message, ..._args);
                    else
                        delegate(_message);
        }
        static setupConsole() {
            let result = {};
            let filters = [
                FudgeCore.DEBUG_FILTER.INFO, FudgeCore.DEBUG_FILTER.LOG, FudgeCore.DEBUG_FILTER.WARN, FudgeCore.DEBUG_FILTER.ERROR, FudgeCore.DEBUG_FILTER.FUDGE,
                FudgeCore.DEBUG_FILTER.CLEAR, FudgeCore.DEBUG_FILTER.GROUP, FudgeCore.DEBUG_FILTER.GROUPCOLLAPSED, FudgeCore.DEBUG_FILTER.GROUPEND,
                FudgeCore.DEBUG_FILTER.SOURCE
            ];
            for (let filter of filters)
                result[filter] = new Map([[FudgeCore.DebugConsole, FudgeCore.DebugConsole.delegates[filter]]]);
            result[FudgeCore.DEBUG_FILTER.SOURCE].delete(FudgeCore.DebugConsole);
            return result;
        }
    }
    FudgeCore.Debug = Debug;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class EventTargetUnified extends EventTarget {
        addEventListener(_type, _handler, _options) {
            super.addEventListener(_type, _handler, _options);
        }
        removeEventListener(_type, _handler, _options) {
            super.removeEventListener(_type, _handler, _options);
        }
        dispatchEvent(_event) {
            return super.dispatchEvent(_event);
        }
    }
    FudgeCore.EventTargetUnified = EventTargetUnified;
    class EventTargetStatic extends EventTargetUnified {
        static { this.targetStatic = new EventTargetStatic(); }
        constructor() {
            super();
        }
        static addEventListener(_type, _handler, _options) {
            EventTargetStatic.targetStatic.addEventListener(_type, _handler);
        }
        static removeEventListener(_type, _handler, _options) {
            EventTargetStatic.targetStatic.removeEventListener(_type, _handler);
        }
        static dispatchEvent(_event) {
            EventTargetStatic.targetStatic.dispatchEvent(_event);
            return true;
        }
    }
    FudgeCore.EventTargetStatic = EventTargetStatic;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RecyclableEvent extends Event {
        static #depot = {};
        static #init = {};
        #target;
        #currentTarget;
        #eventPhase;
        constructor(_type, _bubbles = false, _cancelable = false) {
            RecyclableEvent.#init.bubbles = _bubbles;
            RecyclableEvent.#init.cancelable = _cancelable;
            super(_type, RecyclableEvent.#init);
            this.path = [];
        }
        static get(_type, _bubbles = false, _cancelable = false) {
            return RecyclableEvent.#depot[`${_type}${_bubbles}${_cancelable}`]?.pop()?.recycle() ?? new RecyclableEvent(_type, _bubbles, _cancelable);
        }
        static store(_event) {
            (RecyclableEvent.#depot[`${_event.type}${_event.bubbles}${_event.cancelable}`] ??= new FudgeCore.RecycableArray()).push(_event);
        }
        static dump(_type, _bubbles = false, _cancelable = false) {
            delete RecyclableEvent.#depot[`${_type}${_bubbles}${_cancelable}`];
        }
        static dumpAll() {
            RecyclableEvent.#depot = {};
        }
        static [Symbol.hasInstance](_instance) {
            return _instance.isRecyclableEvent;
        }
        get isRecyclableEvent() {
            return true;
        }
        get target() {
            return this.#target ?? super.target;
        }
        get currentTarget() {
            return this.#currentTarget ?? super.currentTarget;
        }
        get eventPhase() {
            return this.#eventPhase ?? super.eventPhase;
        }
        setTarget(_target) {
            this.#target = _target;
            return this;
        }
        setCurrentTarget(_currentTarget) {
            this.#currentTarget = _currentTarget;
            return this;
        }
        setEventPhase(_eventPhase) {
            this.#eventPhase = _eventPhase;
            return this;
        }
        recycle() {
            this.#target = null;
            this.#currentTarget = null;
            this.#eventPhase = null;
            this.path.length = 0;
            return this;
        }
    }
    FudgeCore.RecyclableEvent = RecyclableEvent;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    function getMutatorOfArbitrary(_object) {
        let mutator = {};
        let attributes = Reflect.ownKeys(Reflect.getPrototypeOf(_object));
        for (let attribute of attributes) {
            let value = Reflect.get(_object, attribute);
            if (value instanceof Function)
                continue;
            mutator[attribute.toString()] = value;
        }
        return mutator;
    }
    FudgeCore.getMutatorOfArbitrary = getMutatorOfArbitrary;
    Symbol.metadata ??= Symbol("Symbol.metadata");
    function type(_constructor) {
        return (_value, _context) => {
            let meta = _context.metadata;
            if (!Object.hasOwn(meta, "attributeTypes"))
                meta.attributeTypes = { ...meta.attributeTypes };
            meta.attributeTypes[_context.name] = _constructor;
        };
    }
    FudgeCore.type = type;
    function enumerate(_value, _context) {
        let metadata = _context.metadata;
        if (_context.kind == "getter" || _context.kind == "accessor") {
            if (typeof _context.name != "string")
                return;
            if (!Object.hasOwn(metadata, "enumerateKeys"))
                metadata.enumerateKeys = [];
            metadata.enumerateKeys.push(_context.name);
            return;
        }
        if (_context.kind == "class") {
            if (metadata.enumerateKeys) {
                const descriptor = { enumerable: true };
                for (const key of metadata.enumerateKeys)
                    Object.defineProperty(_value.prototype, key, descriptor);
            }
            return;
        }
    }
    FudgeCore.enumerate = enumerate;
    class Mutable extends FudgeCore.EventTargetUnified {
        static getMutatorFromPath(_mutator, _path) {
            let key = _path[0];
            let mutator = {};
            if (_mutator[key] == undefined)
                return _mutator;
            mutator[key] = _mutator[key];
            if (_path.length > 1)
                mutator[key] = Mutable.getMutatorFromPath(mutator[key], _path.slice(1, _path.length));
            return mutator;
        }
        get type() {
            return this.constructor.name;
        }
        getMutator(_extendable = false) {
            let mutator = {};
            for (let attribute in this) {
                let value = this[attribute];
                if (value instanceof Function)
                    continue;
                if (value instanceof Object && !(value instanceof Mutable) && !(value instanceof FudgeCore.MutableArray) && !(value.hasOwnProperty("idResource")) && this.getMetaAttributeTypes()[attribute] == undefined)
                    continue;
                mutator[attribute] = value;
            }
            if (!_extendable)
                Object.preventExtensions(mutator);
            this.reduceMutator(mutator);
            for (let attribute in mutator) {
                let value = mutator[attribute];
                if (value instanceof Mutable)
                    mutator[attribute] = value.getMutator();
                if (value instanceof FudgeCore.MutableArray)
                    mutator[attribute] = value.map((_value) => _value.getMutator());
            }
            return mutator;
        }
        getMutatorForAnimation(_extendable = false) {
            return this.getMutator(_extendable);
        }
        getMutatorForUserInterface(_extendable = false) {
            return this.getMutator(_extendable);
        }
        getMutatorAttributeTypes(_mutator) {
            let types = {};
            let metaTypes = this.getMetaAttributeTypes();
            for (let attribute in _mutator) {
                let metaType = metaTypes[attribute];
                let type;
                if (typeof metaType == "function")
                    type = metaType.name;
                else if (typeof metaType == "object")
                    type = metaType;
                let value = _mutator[attribute];
                if (value != undefined && type == undefined)
                    if (typeof value == "object")
                        type = this[attribute].constructor.name;
                    else if (typeof value == "function")
                        type = value.name;
                    else
                        type = value.constructor.name;
                types[attribute] = type;
            }
            return types;
        }
        getMetaAttributeTypes() {
            return this.getMetadata().attributeTypes ??= {};
        }
        getMetadata() {
            return this.constructor[Symbol.metadata] ??= {};
        }
        updateMutator(_mutator) {
            for (let attribute in _mutator) {
                let value = Reflect.get(this, attribute);
                if (value instanceof Mutable)
                    value.updateMutator(_mutator[attribute]);
                else
                    _mutator[attribute] = value;
            }
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            await this.mutateBase(_mutator, _selection);
            if (_dispatchMutate)
                this.dispatchEvent(new CustomEvent("mutate", { bubbles: true, detail: { mutator: _mutator } }));
        }
        animate(_mutator) {
            for (let key in _mutator) {
                const valueArray = _mutator[key];
                if (valueArray.length == 1)
                    this[key] = valueArray[0];
                else
                    this[key].setArray(valueArray);
            }
        }
        mutateSync(_mutator, _dispatchMutate = true) {
            let mutator = _mutator;
            for (let attribute in mutator) {
                let mutant = Reflect.get(this, attribute);
                if (mutant instanceof FudgeCore.MutableArray || mutant instanceof Mutable)
                    mutant.mutate(mutator[attribute], null, false);
                else
                    Reflect.set(this, attribute, mutator[attribute]);
            }
            if (_dispatchMutate)
                this.dispatchEvent(new CustomEvent("mutate", { bubbles: true, detail: { mutator: _mutator } }));
        }
        ;
        async mutateBase(_mutator, _selection) {
            let mutator = _mutator;
            if (_selection) {
                mutator = {};
                for (let attribute of _selection)
                    if (typeof (_mutator[attribute]) !== "undefined")
                        mutator[attribute] = _mutator[attribute];
            }
            for (let attribute in mutator) {
                if (!Reflect.has(this, attribute))
                    continue;
                let mutant = Reflect.get(this, attribute);
                let value = mutator[attribute];
                if (mutant instanceof FudgeCore.MutableArray || mutant instanceof Mutable)
                    await mutant.mutate(value, null, false);
                else
                    Reflect.set(this, attribute, value);
            }
        }
    }
    FudgeCore.Mutable = Mutable;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Serializer {
        static { this.namespaces = { "ƒ": FudgeCore }; }
        static registerNamespace(_namespace) {
            for (let name in Serializer.namespaces)
                if (Serializer.namespaces[name] == _namespace)
                    return name;
            let name = Serializer.findNamespaceIn(_namespace, window);
            if (!name)
                for (let parentName in Serializer.namespaces) {
                    name = Serializer.findNamespaceIn(_namespace, Serializer.namespaces[parentName]);
                    if (name) {
                        name = parentName + "." + name;
                        break;
                    }
                }
            if (!name)
                throw new Error("Namespace not found. Maybe parent namespace hasn't been registered before?");
            Serializer.namespaces[name] = _namespace;
            return name;
        }
        static serialize(_object) {
            let path = this.getFullPath(_object);
            if (!path)
                throw new Error(`Namespace of serializable object of type ${_object.constructor.name} not found. Maybe the namespace hasn't been registered or the class not exported?`);
            return { [path]: _object.serialize() };
        }
        static async deserialize(_serialization) {
            let reconstruct;
            let path;
            try {
                for (path in _serialization) {
                    reconstruct = Serializer.reconstruct(path);
                    reconstruct = await reconstruct.deserialize(_serialization[path]);
                    return reconstruct;
                }
            }
            catch (_error) {
                let message = `Deserialization of ${path}, ${reconstruct ? Reflect.get(reconstruct, "idResource") : ""} failed: ` + _error;
                throw new Error(message);
            }
            return null;
        }
        static serializeArray(_type, _objects) {
            let serializations = [];
            let path = this.getFullPath(new _type());
            if (!path)
                throw new Error(`Namespace of serializable object of type ${_type.name} not found. Maybe the namespace hasn't been registered or the class not exported?`);
            for (let object of _objects)
                serializations.push(object.serialize());
            let serialization = {};
            serialization[path] = serializations;
            return serialization;
        }
        static async deserializeArray(_serialization) {
            let serializables = [];
            let construct;
            let serializations = [];
            try {
                for (let path in _serialization) {
                    construct = Serializer.getConstructor(path);
                    serializations = _serialization[path];
                    break;
                }
            }
            catch (_error) {
                throw new Error("Deserialization failed: " + _error);
            }
            for (let serialization of serializations) {
                let serializable = new construct();
                await serializable.deserialize(serialization);
                serializables.push(serializable);
            }
            return serializables;
        }
        static prettify(_json) { return _json; }
        static stringify(_serialization) {
            let json = JSON.stringify(_serialization, null, 2);
            let pretty = Serializer.prettify(json);
            return pretty;
        }
        static parse(_json) {
            return JSON.parse(_json);
        }
        static reconstruct(_path) {
            let constructor = Serializer.getConstructor(_path);
            let reconstruction = new constructor();
            return reconstruction;
        }
        static getConstructor(_path) {
            let typeName = _path.substring(_path.lastIndexOf(".") + 1);
            let namespace = Serializer.getNamespace(_path);
            if (!namespace)
                throw new Error(`Constructor of serializable object of type ${_path} not found. Maybe the namespace hasn't been registered?`);
            return namespace[typeName];
        }
        static getFullPath(_object) {
            let typeName = _object.constructor.name;
            for (let namespaceName in Serializer.namespaces) {
                let found = Serializer.namespaces[namespaceName][typeName];
                if (found && _object instanceof found)
                    return namespaceName + "." + typeName;
            }
            return null;
        }
        static getNamespace(_path) {
            let namespaceName = _path.substr(0, _path.lastIndexOf("."));
            return Serializer.namespaces[namespaceName] || FudgeCore;
        }
        static findNamespaceIn(_namespace, _parent) {
            for (let prop in _parent)
                if (_parent[prop] == _namespace)
                    return prop;
            return null;
        }
    }
    FudgeCore.Serializer = Serializer;
    function mixinSerializableResourceExternal(_base) {
        class SerializableResourceExternalMixin extends _base {
            constructor() {
                super(...arguments);
                this.status = FudgeCore.RESOURCE_STATUS.PENDING;
            }
            serialize() {
                const serialization = {
                    idResource: this.idResource,
                    name: this.name,
                    type: this.type,
                    url: this.url.toString()
                };
                return serialization;
            }
            async deserialize(_serialization) {
                FudgeCore.Project.register(this, _serialization.idResource);
                this.url = _serialization.url;
                this.name = _serialization.name;
                return this.load();
            }
        }
        ;
        if (_base.prototype instanceof FudgeCore.Mutable) {
            function mixinMutableSerializableResourceExternal(_base) {
                class MutableSerializableResourceExternal extends _base {
                    async mutate(_mutator, _selection = null) {
                        await super.mutate(_mutator, _selection);
                        if (_mutator.url != undefined || _mutator.name != undefined)
                            await this.load();
                    }
                    reduceMutator(_mutator) {
                        delete _mutator.status;
                    }
                }
                return MutableSerializableResourceExternal;
            }
            return mixinMutableSerializableResourceExternal(SerializableResourceExternalMixin);
        }
        return SerializableResourceExternalMixin;
    }
    FudgeCore.mixinSerializableResourceExternal = mixinSerializableResourceExternal;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderBufferManager {
        static { this.mapObjectToOffset = new WeakMap(); }
        static decorate(_method, _context) {
            return Reflect.get(this, _context.name).bind(this);
        }
        static initialize(_renderWebGL, _blockBinding, _blockSize, _maxObjects) {
            this.blockSize = _blockSize;
            this.blockBinding = _blockBinding;
            const crc3 = _renderWebGL.getRenderingContext();
            const alignment = crc3.getParameter(WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT);
            this.spaceBuffer = Math.ceil(this.blockSize / alignment) * alignment;
            this.spaceData = this.spaceBuffer / Float32Array.BYTES_PER_ELEMENT;
            this.data = new Float32Array(this.spaceData * _maxObjects);
            this.dataUInt = new Uint32Array(this.data.buffer);
            this.count = 0;
            this.buffer = _renderWebGL.assert(crc3.createBuffer());
            crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
            crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
        }
        static resetRenderData() {
            this.count = 0;
        }
        static updateRenderbuffer() {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
            crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, this.data, 0, this.count * this.spaceData);
        }
        static useRenderData(_object) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, this.mapObjectToOffset.get(_object), this.blockSize);
        }
        static store(_object) {
            const offsetData = this.count * this.spaceData;
            this.mapObjectToOffset.set(_object, this.count * this.spaceBuffer);
            this.count++;
            if (offsetData + this.spaceData > this.data.length)
                this.grow();
            return offsetData;
        }
        static updateRenderData(_object, ..._data) {
        }
        ;
        static grow() {
            const data = new Float32Array(this.data.length * 1.5);
            data.set(this.data);
            this.data = data;
            this.dataUInt = new Uint32Array(this.data.buffer);
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.buffer);
            crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, this.data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
        }
    }
    FudgeCore.RenderBufferManager = RenderBufferManager;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderManagerCoat extends FudgeCore.RenderBufferManager {
        static initialize(_renderWebGL) {
            const maxMaterials = 128;
            const blockSize = (4 + 1 + 1 + 1 + 1 + 1) * 4;
            super.initialize(_renderWebGL, FudgeCore.UNIFORM_BLOCK.MATERIAL.BINDING, blockSize, maxMaterials);
        }
        static updateRenderData(_coat) {
            const offset = this.store(_coat);
            const data = this.data;
            if (_coat instanceof FudgeCore.CoatColored) {
                const color = _coat.color;
                data[offset] = color.r;
                data[offset + 1] = color.g;
                data[offset + 2] = color.b;
                data[offset + 3] = color.a;
            }
            if (_coat instanceof FudgeCore.CoatRemissive || _coat instanceof FudgeCore.CoatRemissiveTextured) {
                data[offset + 4] = _coat.diffuse;
                data[offset + 5] = _coat.specular;
                data[offset + 6] = _coat.intensity;
                data[offset + 7] = _coat.metallic;
            }
            data[offset + 8] = _coat.alphaClip;
        }
        static useRenderData(_coat) {
            super.useRenderData(_coat);
            if (_coat instanceof FudgeCore.CoatTextured)
                _coat.texture.useRenderData(FudgeCore.TEXTURE_LOCATION.COLOR.UNIT);
            if (_coat instanceof FudgeCore.CoatRemissiveTexturedNormals)
                _coat.normalMap.useRenderData(FudgeCore.TEXTURE_LOCATION.NORMAL.UNIT);
            if (_coat instanceof FudgeCore.CoatToon)
                _coat.texToon.useRenderData(FudgeCore.TEXTURE_LOCATION.TOON.UNIT);
        }
    }
    FudgeCore.RenderManagerCoat = RenderManagerCoat;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderManagerNode extends FudgeCore.RenderBufferManager {
        static initialize(_renderWebGL) {
            const maxNodes = 256;
            const blockSize = (16 + 12 + 4 + 1 + 1 + 1 + 1 + 1 + 1) * 4;
            super.initialize(_renderWebGL, FudgeCore.UNIFORM_BLOCK.NODE.BINDING, blockSize, maxNodes);
        }
        static updateRenderData(_node, _cmpMesh, _cmpMaterial, _cmpFaceCamera, _cmpParticleSystem) {
            const offset = this.store(_node);
            const data = this.data;
            data.set(_cmpMesh.mtxWorld.getArray(), offset);
            let dataPivot = _cmpMaterial.mtxPivot.getArray();
            data[offset + 16] = dataPivot[0];
            data[offset + 17] = dataPivot[1];
            data[offset + 18] = dataPivot[2];
            data[offset + 20] = dataPivot[3];
            data[offset + 21] = dataPivot[4];
            data[offset + 22] = dataPivot[5];
            data[offset + 24] = dataPivot[6];
            data[offset + 25] = dataPivot[7];
            data[offset + 26] = dataPivot[8];
            let color = _cmpMaterial.clrPrimary;
            data[offset + 28] = color.r;
            data[offset + 29] = color.g;
            data[offset + 30] = color.b;
            data[offset + 31] = color.a;
            if (_cmpParticleSystem) {
                const dataUint = this.dataUInt;
                dataUint[offset + 32] = _cmpParticleSystem.blendMode;
                data[offset + 33] = _cmpParticleSystem.duration;
                data[offset + 34] = _cmpParticleSystem.size;
                data[offset + 35] = _cmpParticleSystem.time;
                dataUint[offset + 36] = _cmpFaceCamera?.isActive ? 1 : 0;
                dataUint[offset + 37] = _cmpFaceCamera?.restrict ? 1 : 0;
            }
        }
        static useRenderData(_node, _mtxWorldOverride) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            let offset = this.mapObjectToOffset.get(_node);
            crc3.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, this.blockBinding, this.buffer, offset, this.blockSize);
            if (_mtxWorldOverride)
                crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, offset, _mtxWorldOverride.getArray());
        }
    }
    FudgeCore.RenderManagerNode = RenderManagerNode;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderWebGLPicking {
        static #sizeMax;
        static #data;
        static #dataClearColor = [0, 0, 0, 0];
        static initialize(_renderWebGL) {
            const crc3 = _renderWebGL.getRenderingContext();
            RenderWebGLPicking.fboPick = _renderWebGL.assert(crc3.createFramebuffer());
            RenderWebGLPicking.texPick = _renderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
            RenderWebGLPicking.texDepth = _renderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLPicking.fboPick);
            crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texPick, 0);
            crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texDepth, 0);
            RenderWebGLPicking.resize(_renderWebGL, 10);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
        }
        static pickFrom(_from, _cmpCamera, _pick) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            const size = Math.ceil(Math.sqrt(_from.length));
            if (size > RenderWebGLPicking.#sizeMax)
                RenderWebGLPicking.resize(FudgeCore.RenderWebGL, size);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLPicking.fboPick);
            crc3.viewport(0, 0, size, size);
            crc3.clearBufferiv(WebGL2RenderingContext.COLOR, 0, RenderWebGLPicking.#dataClearColor);
            crc3.clearBufferfi(WebGL2RenderingContext.DEPTH_STENCIL, 0, 1, 0);
            FudgeCore.RenderWebGLComponentCamera.useRenderbuffer(_cmpCamera);
            FudgeCore.ShaderPick.useProgram();
            crc3.uniform1i(FudgeCore.ShaderPick.uniforms["u_size"], size);
            FudgeCore.ShaderPickTextured.useProgram();
            crc3.uniform1i(FudgeCore.ShaderPickTextured.uniforms["u_size"], size);
            FudgeCore.RenderWebGL.setBlendMode(FudgeCore.BLEND.OPAQUE);
            const picks = _pick(_from, _cmpCamera);
            FudgeCore.RenderWebGL.setBlendMode(FudgeCore.BLEND.TRANSPARENT);
            const data = RenderWebGLPicking.#data;
            crc3.readPixels(0, 0, size, size, WebGL2RenderingContext.RGBA_INTEGER, WebGL2RenderingContext.INT, data);
            const picked = [];
            const mtxViewToWorld = FudgeCore.Matrix4x4.INVERSE(_cmpCamera.mtxWorldToView);
            for (let i = 0; i < picks.length; i++) {
                let zBuffer = data[4 * i + 0] + data[4 * i + 1] / 256;
                if (zBuffer == 0)
                    continue;
                let pick = picks[i];
                pick.zBuffer = RenderWebGLPicking.convertInt32toFloat32(data, 4 * i + 0) * 2 - 1;
                pick.color = RenderWebGLPicking.convertInt32toColor(data, 4 * i + 1);
                pick.textureUV = FudgeCore.Recycler.reuse(FudgeCore.Vector2);
                pick.textureUV.set(RenderWebGLPicking.convertInt32toFloat32(data, 4 * i + 2), RenderWebGLPicking.convertInt32toFloat32(data, 4 * i + 3));
                pick.mtxViewToWorld = mtxViewToWorld;
                picked.push(pick);
            }
            FudgeCore.Recycler.store(mtxViewToWorld);
            FudgeCore.RenderWebGL.resetFramebuffer();
            const canvasRectangle = FudgeCore.RenderWebGL.getCanvasRectangle();
            crc3.viewport(0, 0, canvasRectangle.width, canvasRectangle.height);
            return picked;
        }
        static convertInt32toFloat32(_int32Array, _index) {
            let buffer = new ArrayBuffer(4);
            let view = new DataView(buffer);
            view.setInt32(0, _int32Array[_index]);
            return view.getFloat32(0);
        }
        static convertInt32toColor(_int32Array, _index) {
            let buffer = new ArrayBuffer(4);
            let view = new DataView(buffer);
            view.setInt32(0, _int32Array[_index]);
            let color = FudgeCore.Color.CSS(`rgb(${view.getUint8(0)}, ${view.getUint8(1)}, ${view.getUint8(2)})`, view.getUint8(3) / 255);
            return color;
        }
        static resize(_renderWebGL, _size) {
            const crc3 = _renderWebGL.getRenderingContext();
            RenderWebGLPicking.#sizeMax = _size;
            RenderWebGLPicking.#data = new Int32Array(_size * _size * 4);
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texPick);
            crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA32I, _size, _size, 0, WebGL2RenderingContext.RGBA_INTEGER, WebGL2RenderingContext.INT, null);
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLPicking.texDepth);
            crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.DEPTH_COMPONENT24, _size, _size, 0, WebGL2RenderingContext.DEPTH_COMPONENT, WebGL2RenderingContext.UNSIGNED_INT, null);
        }
    }
    FudgeCore.RenderWebGLPicking = RenderWebGLPicking;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderWebGLComponentLight {
        static #buffer;
        static #data;
        static #dataHeader;
        static #dataAmbient;
        static #dataPoint;
        static #dataSpot;
        static #dataDirectional;
        static initialize(_renderWebGL) {
            const MAX_LIGHTS_DIRECTIONAL = 15;
            const MAX_LIGHTS_POINT = 100;
            const MAX_LIGHTS_SPOT = 100;
            const HEADER_UINTS = 4;
            const COLOR_FLOATS = 4;
            const MATRIX_FLOATS = 16;
            const LIGHT_FLOATS = COLOR_FLOATS + MATRIX_FLOATS + MATRIX_FLOATS;
            RenderWebGLComponentLight.#data = new Float32Array(HEADER_UINTS + COLOR_FLOATS + (MAX_LIGHTS_DIRECTIONAL + MAX_LIGHTS_POINT + MAX_LIGHTS_SPOT) * LIGHT_FLOATS);
            RenderWebGLComponentLight.#dataHeader = new Uint32Array(RenderWebGLComponentLight.#data.buffer, 0, HEADER_UINTS);
            RenderWebGLComponentLight.#dataAmbient = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataHeader.byteOffset + RenderWebGLComponentLight.#dataHeader.byteLength, COLOR_FLOATS);
            RenderWebGLComponentLight.#dataDirectional = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataAmbient.byteOffset + RenderWebGLComponentLight.#dataAmbient.byteLength, MAX_LIGHTS_DIRECTIONAL * LIGHT_FLOATS);
            RenderWebGLComponentLight.#dataPoint = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataDirectional.byteOffset + RenderWebGLComponentLight.#dataDirectional.byteLength, MAX_LIGHTS_POINT * LIGHT_FLOATS);
            RenderWebGLComponentLight.#dataSpot = new Float32Array(RenderWebGLComponentLight.#data.buffer, RenderWebGLComponentLight.#dataPoint.byteOffset + RenderWebGLComponentLight.#dataPoint.byteLength, MAX_LIGHTS_SPOT * LIGHT_FLOATS);
            const crc3 = _renderWebGL.getRenderingContext();
            RenderWebGLComponentLight.#buffer = _renderWebGL.assert(crc3.createBuffer());
            crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#buffer);
            crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
            crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, FudgeCore.UNIFORM_BLOCK.LIGHTS.BINDING, RenderWebGLComponentLight.#buffer);
        }
        static decorate(_method, _context) {
            return Reflect.get(this, _context.name);
        }
        static updateRenderbuffer(_lights) {
            let cmpLights = _lights.get(FudgeCore.LIGHT_TYPE.AMBIENT);
            if (cmpLights?.length > 0) {
                let clrSum = FudgeCore.Recycler.get(FudgeCore.Color).set(0, 0, 0, 0);
                let clrLight = FudgeCore.Recycler.get(FudgeCore.Color);
                for (let cmpLight of cmpLights)
                    clrSum.add(FudgeCore.Color.SCALE(cmpLight.color, cmpLight.intensity, clrLight));
                FudgeCore.Recycler.store(clrSum);
                FudgeCore.Recycler.store(clrLight);
                clrSum.toArray(RenderWebGLComponentLight.#dataAmbient);
            }
            const cmpLightsDirectional = _lights.get(FudgeCore.LIGHT_TYPE.DIRECTIONAL);
            const cmpLightsPoint = _lights.get(FudgeCore.LIGHT_TYPE.POINT);
            const cmpLightsSpot = _lights.get(FudgeCore.LIGHT_TYPE.SPOT);
            RenderWebGLComponentLight.#dataHeader[0] = cmpLightsDirectional?.length ?? 0;
            RenderWebGLComponentLight.#dataHeader[1] = cmpLightsPoint?.length ?? 0;
            RenderWebGLComponentLight.#dataHeader[2] = cmpLightsSpot?.length ?? 0;
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentLight.#buffer);
            crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentLight.#data, 0, RenderWebGLComponentLight.#dataHeader.length + RenderWebGLComponentLight.#dataAmbient.length);
            const clrOut = FudgeCore.Recycler.get(FudgeCore.Color);
            const mtxOut = FudgeCore.Matrix4x4.IDENTITY();
            RenderWebGLComponentLight.bufferLights(crc3, cmpLightsDirectional, RenderWebGLComponentLight.#dataDirectional, clrOut, mtxOut);
            RenderWebGLComponentLight.bufferLights(crc3, cmpLightsPoint, RenderWebGLComponentLight.#dataPoint, clrOut, mtxOut);
            RenderWebGLComponentLight.bufferLights(crc3, cmpLightsSpot, RenderWebGLComponentLight.#dataSpot, clrOut, mtxOut);
            FudgeCore.Recycler.store(clrOut);
            FudgeCore.Recycler.store(mtxOut);
        }
        static bufferLights(_crc3, _cmpLights, _data, _clrOut, _mtxOut) {
            if (!_cmpLights)
                return;
            let iLight = 0;
            for (let cmpLight of _cmpLights) {
                FudgeCore.Color.SCALE(cmpLight.color, cmpLight.intensity, _clrOut).toArray(_data, iLight);
                FudgeCore.Matrix4x4.PRODUCT(cmpLight.node.mtxWorld, cmpLight.mtxPivot, _mtxOut);
                if (cmpLight.lightType == FudgeCore.LIGHT_TYPE.DIRECTIONAL)
                    _mtxOut.translation = _mtxOut.translation.set(0, 0, 0);
                _mtxOut.toArray(_data, iLight + 4);
                if (cmpLight.lightType != FudgeCore.LIGHT_TYPE.DIRECTIONAL)
                    FudgeCore.Matrix4x4.INVERSE(_mtxOut, _mtxOut).toArray(_data, iLight + 20);
                iLight += 36;
            }
            _crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, _data.byteOffset, _data, 0, iLight);
        }
    }
    FudgeCore.RenderWebGLComponentLight = RenderWebGLComponentLight;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderWebGLComponentFog {
        static #buffer;
        static #data;
        static initialize(_renderWebGL) {
            const crc3 = _renderWebGL.getRenderingContext();
            RenderWebGLComponentFog.#buffer = _renderWebGL.assert(crc3.createBuffer());
            RenderWebGLComponentFog.#data = new Float32Array(8);
            crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentFog.#buffer);
            crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentFog.#data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
            crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, FudgeCore.UNIFORM_BLOCK.FOG.BINDING, RenderWebGLComponentFog.#buffer);
        }
        static useRenderbuffer(_cmpFog) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            const data = RenderWebGLComponentFog.#data;
            data[0] = _cmpFog?.isActive ? 1 : 0;
            if (_cmpFog) {
                data[1] = _cmpFog.near;
                data[2] = _cmpFog.far;
                _cmpFog.color.toArray(data, 4);
            }
            crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentFog.#buffer);
            crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentFog.#data);
        }
    }
    FudgeCore.RenderWebGLComponentFog = RenderWebGLComponentFog;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderWebGLComponentCamera {
        static #buffer;
        static #data;
        static initialize(_renderWebGL) {
            const crc3 = _renderWebGL.getRenderingContext();
            RenderWebGLComponentCamera.#buffer = _renderWebGL.assert(crc3.createBuffer());
            RenderWebGLComponentCamera.#data = new Float32Array(16 + 16 + 16 + 3);
            crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentCamera.#buffer);
            crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentCamera.#data.byteLength, WebGL2RenderingContext.DYNAMIC_DRAW);
            crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, FudgeCore.UNIFORM_BLOCK.CAMERA.BINDING, RenderWebGLComponentCamera.#buffer);
        }
        static useRenderbuffer(_cmpCamera) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            const data = RenderWebGLComponentCamera.#data;
            const mtxView = _cmpCamera.mtxCameraInverse;
            const mtxProjection = _cmpCamera.mtxProjection;
            const mtxViewProjection = _cmpCamera.mtxWorldToView;
            const vctPosition = _cmpCamera.mtxWorld.translation;
            data.set(mtxView.getArray(), 0);
            data.set(mtxProjection.getArray(), 16);
            data.set(mtxViewProjection.getArray(), 32);
            vctPosition.toArray(data, 48);
            crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, RenderWebGLComponentCamera.#buffer);
            crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, RenderWebGLComponentCamera.#data);
        }
    }
    FudgeCore.RenderWebGLComponentCamera = RenderWebGLComponentCamera;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderWebGLComponentAmbientOcclusion {
        static #dataCamera = new Float32Array(3);
        static initialize(_renderWebGL) {
            const crc3 = _renderWebGL.getRenderingContext();
            RenderWebGLComponentAmbientOcclusion.texOut = _renderWebGL.texColor;
            RenderWebGLComponentAmbientOcclusion.texNoise = _renderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
            RenderWebGLComponentAmbientOcclusion.fboOut = _renderWebGL.assert(crc3.createFramebuffer());
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentAmbientOcclusion.fboOut);
            crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentAmbientOcclusion.texOut, 0);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
        }
        static draw(_cmpCamera, _cmpAmbientOcclusion) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            FudgeCore.ShaderAmbientOcclusion.useProgram();
            FudgeCore.RenderWebGL.bindTexture(FudgeCore.ShaderAmbientOcclusion, FudgeCore.RenderWebGL.texPosition, WebGL2RenderingContext.TEXTURE0, "u_texPosition");
            FudgeCore.RenderWebGL.bindTexture(FudgeCore.ShaderAmbientOcclusion, FudgeCore.RenderWebGL.texNormal, WebGL2RenderingContext.TEXTURE1, "u_texNormal");
            FudgeCore.RenderWebGL.bindTexture(FudgeCore.ShaderAmbientOcclusion, RenderWebGLComponentAmbientOcclusion.texNoise, WebGL2RenderingContext.TEXTURE2, "u_texNoise");
            crc3.uniform1f(FudgeCore.ShaderAmbientOcclusion.uniforms["u_fNear"], _cmpCamera.near);
            crc3.uniform1f(FudgeCore.ShaderAmbientOcclusion.uniforms["u_fFar"], _cmpCamera.far);
            crc3.uniform1f(FudgeCore.ShaderAmbientOcclusion.uniforms["u_fBias"], _cmpAmbientOcclusion.bias);
            crc3.uniform1f(FudgeCore.ShaderAmbientOcclusion.uniforms["u_fSampleRadius"], _cmpAmbientOcclusion.sampleRadius);
            crc3.uniform1f(FudgeCore.ShaderAmbientOcclusion.uniforms["u_fAttenuationConstant"], _cmpAmbientOcclusion.attenuationConstant);
            crc3.uniform1f(FudgeCore.ShaderAmbientOcclusion.uniforms["u_fAttenuationLinear"], _cmpAmbientOcclusion.attenuationLinear);
            crc3.uniform1f(FudgeCore.ShaderAmbientOcclusion.uniforms["u_fAttenuationQuadratic"], _cmpAmbientOcclusion.attenuationQuadratic);
            crc3.uniform2f(FudgeCore.ShaderAmbientOcclusion.uniforms["u_vctResolution"], FudgeCore.RenderWebGL.getCanvasRectangle().width, FudgeCore.RenderWebGL.getCanvasRectangle().height);
            crc3.uniform3fv(FudgeCore.ShaderAmbientOcclusion.uniforms["u_vctCamera"], _cmpCamera.mtxWorld.translation.toArray(RenderWebGLComponentAmbientOcclusion.#dataCamera));
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentAmbientOcclusion.fboOut);
            FudgeCore.RenderWebGL.setBlendMode(FudgeCore.BLEND.SUBTRACTIVE);
            crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
            FudgeCore.RenderWebGL.setBlendMode(FudgeCore.BLEND.TRANSPARENT);
        }
        static resize(_renderWebGL, _width, _height) {
            const crc3 = _renderWebGL.getRenderingContext();
            const canvasWidth = _width || 1;
            const canvasHeight = _height || 1;
            crc3.activeTexture(crc3.TEXTURE0);
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentAmbientOcclusion.texOut);
            crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, null);
            const nValues = canvasWidth * canvasHeight * 4;
            const noiseData = new Uint8Array(nValues);
            for (let i = 0; i < nValues; i += 4) {
                noiseData[i] = Math.floor(Math.random() * 256);
                noiseData[i + 1] = Math.floor(Math.random() * 256);
                noiseData[i + 2] = Math.floor(Math.random() * 256);
                noiseData[i + 3] = Math.floor(Math.random() * 256);
            }
            crc3.bindTexture(crc3.TEXTURE_2D, RenderWebGLComponentAmbientOcclusion.texNoise);
            crc3.texImage2D(crc3.TEXTURE_2D, 0, crc3.RGBA, canvasWidth, canvasHeight, 0, crc3.RGBA, crc3.UNSIGNED_BYTE, noiseData);
            crc3.bindTexture(crc3.TEXTURE_2D, null);
        }
    }
    FudgeCore.RenderWebGLComponentAmbientOcclusion = RenderWebGLComponentAmbientOcclusion;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderWebGLComponentBloom {
        static initialize(_renderWebGL) {
            const crc3 = _renderWebGL.getRenderingContext();
            RenderWebGLComponentBloom.textures = new Array(6);
            RenderWebGLComponentBloom.fbos = new Array(6);
            for (let i = 0; i < RenderWebGLComponentBloom.textures.length; i++) {
                RenderWebGLComponentBloom.textures[i] = _renderWebGL.createTexture(WebGL2RenderingContext.LINEAR, WebGL2RenderingContext.CLAMP_TO_EDGE);
                RenderWebGLComponentBloom.fbos[i] = _renderWebGL.assert(crc3.createFramebuffer());
                crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fbos[i]);
                crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentBloom.textures[i], 0);
            }
            RenderWebGLComponentBloom.fboOut = _renderWebGL.assert(crc3.createFramebuffer());
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fboOut);
            crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, _renderWebGL.texColor, 0);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
        }
        static draw(_cmpBloom) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            FudgeCore.ShaderBloom.useProgram();
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fbos[0]);
            FudgeCore.RenderWebGL.clear();
            FudgeCore.RenderWebGL.bindTexture(FudgeCore.ShaderBloom, FudgeCore.RenderWebGL.texColor, WebGL2RenderingContext.TEXTURE0, "u_texSource");
            crc3.uniform1f(FudgeCore.ShaderBloom.uniforms["u_fThreshold"], _cmpBloom.threshold);
            crc3.uniform1i(FudgeCore.ShaderBloom.uniforms["u_iMode"], 0);
            crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
            const canvasRectangle = FudgeCore.RenderWebGL.getCanvasRectangle();
            const canvasWidth = canvasRectangle.width;
            const canvasHeight = canvasRectangle.height;
            const iterations = RenderWebGLComponentBloom.textures.length;
            for (let i = 1, divisor = 2; i < iterations; i++, divisor *= 2) {
                let width = Math.max(Math.round(canvasWidth / divisor), 1);
                let height = Math.max(Math.round(canvasHeight / divisor), 1);
                crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fbos[i]);
                crc3.viewport(0, 0, width, height);
                FudgeCore.RenderWebGL.clear();
                FudgeCore.RenderWebGL.bindTexture(FudgeCore.ShaderBloom, RenderWebGLComponentBloom.textures[i - 1], WebGL2RenderingContext.TEXTURE0, "u_texSource");
                crc3.uniform1i(FudgeCore.ShaderBloom.uniforms["u_iMode"], 1);
                crc3.uniform2f(FudgeCore.ShaderBloom.uniforms["u_vctTexel"], 0.5 / width, 0.5 / height);
                crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
            }
            FudgeCore.RenderWebGL.setBlendMode(FudgeCore.BLEND.ADDITIVE);
            for (let i = iterations - 1, divisor = 2 ** (iterations - 2); i > 0; i--, divisor /= 2) {
                let width = Math.max(Math.round(canvasWidth / divisor), 1);
                let height = Math.max(Math.round(canvasHeight / divisor), 1);
                crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fbos[i - 1]);
                crc3.viewport(0, 0, Math.round(width), Math.round(height));
                FudgeCore.RenderWebGL.bindTexture(FudgeCore.ShaderBloom, RenderWebGLComponentBloom.textures[i], WebGL2RenderingContext.TEXTURE0, "u_texSource");
                crc3.uniform1i(FudgeCore.ShaderBloom.uniforms["u_iMode"], 2);
                crc3.uniform2f(FudgeCore.ShaderBloom.uniforms["u_vctTexel"], 0.5 / width, 0.5 / height);
                crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
            }
            crc3.viewport(0, 0, canvasWidth, canvasHeight);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentBloom.fboOut);
            FudgeCore.RenderWebGL.bindTexture(FudgeCore.ShaderBloom, RenderWebGLComponentBloom.textures[0], WebGL2RenderingContext.TEXTURE0, "u_texSource");
            crc3.uniform1i(FudgeCore.ShaderBloom.uniforms["u_iMode"], 3);
            crc3.uniform1f(FudgeCore.ShaderBloom.uniforms["u_fIntensity"], _cmpBloom.intensity);
            crc3.uniform1f(FudgeCore.ShaderBloom.uniforms["u_fHighlightDesaturation"], _cmpBloom.highlightDesaturation);
            crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
            FudgeCore.RenderWebGL.setBlendMode(FudgeCore.BLEND.TRANSPARENT);
        }
        static resize(_renderWebGL, _width, _height) {
            const crc3 = _renderWebGL.getRenderingContext();
            const canvasWidth = _width || 1;
            const canvasHeight = _height || 1;
            for (let i = 0, divisor = 1; i < RenderWebGLComponentBloom.textures.length; i++, divisor *= 2) {
                let width = Math.max(Math.round(canvasWidth / divisor), 1);
                let height = Math.max(Math.round(canvasHeight / divisor), 1);
                crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentBloom.textures[i]);
                crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, width, height, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, null);
            }
            crc3.bindTexture(crc3.TEXTURE_2D, null);
        }
    }
    FudgeCore.RenderWebGLComponentBloom = RenderWebGLComponentBloom;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderWebGLComponentOutline {
        static #dataColor;
        static #dataColorOccluded;
        static initialize(_renderWebGL) {
            const crc3 = _renderWebGL.getRenderingContext();
            RenderWebGLComponentOutline.#dataColor = new Float32Array(4);
            RenderWebGLComponentOutline.#dataColorOccluded = new Float32Array(4);
            RenderWebGLComponentOutline.texDepthStencil = _renderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
            RenderWebGLComponentOutline.fboDepthPass = _renderWebGL.assert(crc3.createFramebuffer());
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentOutline.fboDepthPass);
            crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentOutline.texDepthStencil, 0);
            RenderWebGLComponentOutline.texOut = _renderWebGL.texColor;
            RenderWebGLComponentOutline.fboOut = _renderWebGL.assert(crc3.createFramebuffer());
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentOutline.fboOut);
            crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentOutline.texOut, 0);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
        }
        static draw(_nodes, _cmpCamera, _cmpOutline) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentOutline.fboDepthPass);
            FudgeCore.RenderWebGL.clear();
            crc3.disable(WebGL2RenderingContext.BLEND);
            for (let selected of _nodes)
                for (const node of selected) {
                    if (node.getComponent(FudgeCore.ComponentMesh)?.isActive && node.getComponent(FudgeCore.ComponentMaterial)?.isActive)
                        FudgeCore.RenderWebGL.drawNode(node, _cmpCamera);
                }
            crc3.enable(WebGL2RenderingContext.BLEND);
            FudgeCore.ShaderOutline.useProgram();
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGLComponentOutline.fboOut);
            FudgeCore.RenderWebGL.bindTexture(FudgeCore.ShaderOutline, RenderWebGLComponentOutline.texDepthStencil, WebGL2RenderingContext.TEXTURE0, "u_texDepthOutline");
            FudgeCore.RenderWebGL.bindTexture(FudgeCore.ShaderOutline, FudgeCore.RenderWebGL.texDepthStencil, WebGL2RenderingContext.TEXTURE1, "u_texDepthScene");
            crc3.uniform4fv(FudgeCore.ShaderOutline.uniforms["u_vctColor"], _cmpOutline.color.toArray(RenderWebGLComponentOutline.#dataColor));
            crc3.uniform4fv(FudgeCore.ShaderOutline.uniforms["u_vctColorOccluded"], _cmpOutline.colorOccluded.toArray(RenderWebGLComponentOutline.#dataColorOccluded));
            const rectCanvas = FudgeCore.RenderWebGL.getCanvasRectangle();
            crc3.uniform2f(FudgeCore.ShaderOutline.uniforms["u_vctTexel"], 1 / Math.round(rectCanvas.width), 1 / Math.round(rectCanvas.height));
            crc3.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, 3);
        }
        static resize(_renderWebGL, _width, _height) {
            const crc3 = _renderWebGL.getRenderingContext();
            const canvasWidth = _width || 1;
            const canvasHeight = _height || 1;
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGLComponentOutline.texDepthStencil);
            crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.DEPTH24_STENCIL8, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.DEPTH_STENCIL, WebGL2RenderingContext.UNSIGNED_INT_24_8, null);
        }
    }
    FudgeCore.RenderWebGLComponentOutline = RenderWebGLComponentOutline;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderInjectorShader {
        static decorate(_constructor, _context) {
            Object.defineProperty(_constructor, _constructor.useProgram.name, {
                value: RenderInjectorShader.useProgram
            });
            Object.defineProperty(_constructor, _constructor.createProgram.name, {
                value: RenderInjectorShader.createProgram
            });
            Object.defineProperty(_constructor, _constructor.deleteProgram.name, {
                value: RenderInjectorShader.deleteProgram
            });
        }
        static useProgram() {
            if (!this.program)
                this.createProgram();
            let crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.useProgram(this.program);
        }
        static deleteProgram() {
            let crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            if (this.program) {
                crc3.deleteProgram(this.program);
                delete this.uniforms;
                delete this.program;
            }
        }
        static createProgram() {
            FudgeCore.Debug.fudge("Create shader program", this.name);
            let crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            let program = crc3.createProgram();
            try {
                let shdVertex = compileShader(this.getVertexShaderSource(), WebGL2RenderingContext.VERTEX_SHADER);
                let shdFragment = compileShader(this.getFragmentShaderSource(), WebGL2RenderingContext.FRAGMENT_SHADER);
                crc3.attachShader(program, FudgeCore.RenderWebGL.assert(shdVertex));
                crc3.attachShader(program, FudgeCore.RenderWebGL.assert(shdFragment));
                crc3.linkProgram(program);
                let error = FudgeCore.RenderWebGL.assert(crc3.getProgramInfoLog(program));
                if (error !== "") {
                    throw new Error("Error linking Shader: " + error);
                }
                this.program = program;
                this.uniforms = detectUniforms();
                bindUniformBlock(program, FudgeCore.UNIFORM_BLOCK.LIGHTS.NAME, FudgeCore.UNIFORM_BLOCK.LIGHTS.BINDING);
                bindUniformBlock(program, FudgeCore.UNIFORM_BLOCK.CAMERA.NAME, FudgeCore.UNIFORM_BLOCK.CAMERA.BINDING);
                bindUniformBlock(program, FudgeCore.UNIFORM_BLOCK.MATERIAL.NAME, FudgeCore.UNIFORM_BLOCK.MATERIAL.BINDING);
                bindUniformBlock(program, FudgeCore.UNIFORM_BLOCK.NODE.NAME, FudgeCore.UNIFORM_BLOCK.NODE.BINDING);
                bindUniformBlock(program, FudgeCore.UNIFORM_BLOCK.SKIN.NAME, FudgeCore.UNIFORM_BLOCK.SKIN.BINDING);
                bindUniformBlock(program, FudgeCore.UNIFORM_BLOCK.FOG.NAME, FudgeCore.UNIFORM_BLOCK.FOG.BINDING);
                crc3.useProgram(this.program);
                let uniform = this.uniforms[FudgeCore.TEXTURE_LOCATION.COLOR.UNIFORM];
                if (uniform)
                    crc3.uniform1i(uniform, FudgeCore.TEXTURE_LOCATION.COLOR.INDEX);
                uniform = this.uniforms[FudgeCore.TEXTURE_LOCATION.NORMAL.UNIFORM];
                if (uniform)
                    crc3.uniform1i(uniform, FudgeCore.TEXTURE_LOCATION.NORMAL.INDEX);
                uniform = this.uniforms[FudgeCore.TEXTURE_LOCATION.TOON.UNIFORM];
                if (uniform)
                    crc3.uniform1i(uniform, FudgeCore.TEXTURE_LOCATION.TOON.INDEX);
                uniform = this.uniforms[FudgeCore.TEXTURE_LOCATION.PARTICLE.UNIFORM];
                if (uniform)
                    crc3.uniform1i(uniform, FudgeCore.TEXTURE_LOCATION.PARTICLE.INDEX);
            }
            catch (_error) {
                FudgeCore.Debug.error(_error);
                debugger;
            }
            function compileShader(_shaderCode, _shaderType) {
                let webGLShader = crc3.createShader(_shaderType);
                crc3.shaderSource(webGLShader, _shaderCode);
                crc3.compileShader(webGLShader);
                let error = FudgeCore.RenderWebGL.assert(crc3.getShaderInfoLog(webGLShader));
                if (error !== "") {
                    FudgeCore.Debug.log(_shaderCode);
                    throw new Error("Error compiling shader: " + error);
                }
                if (!crc3.getShaderParameter(webGLShader, WebGL2RenderingContext.COMPILE_STATUS)) {
                    alert(crc3.getShaderInfoLog(webGLShader));
                    return null;
                }
                return webGLShader;
            }
            function detectUniforms() {
                let detectedUniforms = {};
                let uniformCount = crc3.getProgramParameter(program, WebGL2RenderingContext.ACTIVE_UNIFORMS);
                for (let i = 0; i < uniformCount; i++) {
                    let info = FudgeCore.RenderWebGL.assert(crc3.getActiveUniform(program, i));
                    if (!info) {
                        break;
                    }
                    let location = crc3.getUniformLocation(program, info.name);
                    if (location)
                        detectedUniforms[info.name] = FudgeCore.RenderWebGL.assert(location);
                }
                return detectedUniforms;
            }
            function bindUniformBlock(_program, _uniformBlockName, _uniformBlockBinding) {
                let blockIndex = crc3.getUniformBlockIndex(_program, _uniformBlockName);
                if (blockIndex == WebGL2RenderingContext.INVALID_INDEX)
                    return;
                let referencedByVertexShader = crc3.getActiveUniformBlockParameter(_program, blockIndex, WebGL2RenderingContext.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER);
                let referencedByFragmentShader = crc3.getActiveUniformBlockParameter(_program, blockIndex, WebGL2RenderingContext.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER);
                if (!referencedByVertexShader && !referencedByFragmentShader)
                    return;
                crc3.uniformBlockBinding(_program, blockIndex, _uniformBlockBinding);
            }
        }
    }
    FudgeCore.RenderInjectorShader = RenderInjectorShader;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderInjectorMesh {
        static decorate(_constructor, _context) {
            Object.defineProperty(_constructor.prototype, _constructor.prototype.useRenderBuffers.name, {
                value: RenderInjectorMesh.useRenderBuffers
            });
            Object.defineProperty(_constructor.prototype, _constructor.prototype.getRenderBuffers.name, {
                value: RenderInjectorMesh.getRenderBuffers
            });
            Object.defineProperty(_constructor.prototype, _constructor.prototype.deleteRenderBuffers.name, {
                value: RenderInjectorMesh.deleteRenderBuffers
            });
        }
        static getRenderBuffers() {
            let buffers = this.renderMesh.buffers;
            if (buffers)
                return buffers;
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            const vao = FudgeCore.RenderWebGL.assert(crc3.createVertexArray());
            crc3.bindVertexArray(vao);
            buffers = {
                indices: createBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, this.renderMesh.indices),
                positions: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.positions),
                normals: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.normals),
                textureUVs: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.textureUVs),
                colors: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.colors),
                tangents: createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.tangents),
                nIndices: this.renderMesh.indices.length,
                vao: vao
            };
            if (this.renderMesh.bones)
                buffers.bones = createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.bones);
            if (this.renderMesh.weights)
                buffers.weights = createBuffer(WebGL2RenderingContext.ARRAY_BUFFER, this.renderMesh.weights);
            setAttributeBuffer(buffers.positions, FudgeCore.SHADER_ATTRIBUTE.POSITION, 3, WebGL2RenderingContext.FLOAT);
            setAttributeBuffer(buffers.normals, FudgeCore.SHADER_ATTRIBUTE.NORMAL, 3, WebGL2RenderingContext.FLOAT);
            setAttributeBuffer(buffers.textureUVs, FudgeCore.SHADER_ATTRIBUTE.TEXCOORDS, 2, WebGL2RenderingContext.FLOAT);
            setAttributeBuffer(buffers.colors, FudgeCore.SHADER_ATTRIBUTE.COLOR, 4, WebGL2RenderingContext.FLOAT);
            setAttributeBuffer(buffers.tangents, FudgeCore.SHADER_ATTRIBUTE.TANGENT, 4, WebGL2RenderingContext.FLOAT);
            if (buffers.bones)
                setAttributeBuffer(buffers.bones, FudgeCore.SHADER_ATTRIBUTE.BONES, 4, WebGL2RenderingContext.UNSIGNED_BYTE);
            if (buffers.weights)
                setAttributeBuffer(buffers.weights, FudgeCore.SHADER_ATTRIBUTE.WEIGHTS, 4, WebGL2RenderingContext.FLOAT);
            return this.renderMesh.buffers = buffers;
            function createBuffer(_type, _array) {
                let buffer = FudgeCore.RenderWebGL.assert(crc3.createBuffer());
                crc3.bindBuffer(_type, buffer);
                crc3.bufferData(_type, _array, WebGL2RenderingContext.STATIC_DRAW);
                return buffer;
            }
            function setAttributeBuffer(_buffer, _location, _size, _type) {
                crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, _buffer);
                crc3.enableVertexAttribArray(_location);
                if (_type == WebGL2RenderingContext.FLOAT)
                    crc3.vertexAttribPointer(_location, _size, _type, false, 0, 0);
                if (_type == WebGL2RenderingContext.UNSIGNED_BYTE)
                    crc3.vertexAttribIPointer(_location, _size, _type, 0, 0);
            }
        }
        static useRenderBuffers() {
            const buffers = this.getRenderBuffers();
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.bindVertexArray(buffers.vao);
            return buffers;
        }
        static deleteRenderBuffers(_renderBuffers) {
            let crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            if (_renderBuffers) {
                crc3.deleteVertexArray(_renderBuffers.vao);
                crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, null);
                crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, null);
                Object.values(_renderBuffers)
                    .filter(_value => _value instanceof WebGLBuffer)
                    .forEach(_buffer => crc3.deleteBuffer(_buffer));
            }
        }
    }
    FudgeCore.RenderInjectorMesh = RenderInjectorMesh;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let ParticleData;
    (function (ParticleData) {
        let FUNCTION;
        (function (FUNCTION) {
            FUNCTION["ADDITION"] = "addition";
            FUNCTION["SUBTRACTION"] = "subtraction";
            FUNCTION["MULTIPLICATION"] = "multiplication";
            FUNCTION["DIVISION"] = "division";
            FUNCTION["MODULO"] = "modulo";
            FUNCTION["POWER"] = "power";
            FUNCTION["POLYNOMIAL3"] = "polynomial3";
            FUNCTION["SQUARE_ROOT"] = "squareRoot";
            FUNCTION["RANDOM"] = "random";
            FUNCTION["RANDOM_RANGE"] = "randomRange";
        })(FUNCTION = ParticleData.FUNCTION || (ParticleData.FUNCTION = {}));
        ParticleData.FUNCTION_MINIMUM_PARAMETERS = {
            [ParticleData.FUNCTION.ADDITION]: 2,
            [ParticleData.FUNCTION.SUBTRACTION]: 2,
            [ParticleData.FUNCTION.MULTIPLICATION]: 2,
            [ParticleData.FUNCTION.DIVISION]: 2,
            [ParticleData.FUNCTION.MODULO]: 2,
            [ParticleData.FUNCTION.POWER]: 2,
            [ParticleData.FUNCTION.POLYNOMIAL3]: 5,
            [ParticleData.FUNCTION.SQUARE_ROOT]: 1,
            [ParticleData.FUNCTION.RANDOM]: 0,
            [ParticleData.FUNCTION.RANDOM_RANGE]: 2
        };
        ParticleData.PREDEFINED_VARIABLES = {
            systemDuration: "u_fParticleSystemDuration",
            systemSize: "u_fParticleSystemSize",
            systemTime: "u_fParticleSystemTime",
            particleId: "fParticleId"
        };
    })(ParticleData = FudgeCore.ParticleData || (FudgeCore.ParticleData = {}));
    class RenderInjectorShaderParticleSystem {
        static {
            this.FUNCTIONS = {
                [ParticleData.FUNCTION.ADDITION]: (_parameters) => {
                    return `(${_parameters.reduce((_accumulator, _value) => `${_accumulator} + ${_value}`)})`;
                },
                [ParticleData.FUNCTION.SUBTRACTION]: (_parameters) => {
                    return `(${_parameters.reduce((_accumulator, _value) => `${_accumulator} - ${_value}`)})`;
                },
                [ParticleData.FUNCTION.MULTIPLICATION]: (_parameters) => {
                    return `(${_parameters.reduce((_accumulator, _value) => `${_accumulator} * ${_value}`)})`;
                },
                [ParticleData.FUNCTION.DIVISION]: (_parameters) => {
                    return `(${_parameters[0]} / ${_parameters[1]})`;
                },
                [ParticleData.FUNCTION.MODULO]: (_parameters) => {
                    return `(${_parameters.reduce((_accumulator, _value) => `mod(${_accumulator}, ${_value})`)})`;
                },
                [ParticleData.FUNCTION.POWER]: (_parameters) => {
                    return `pow(${_parameters[0]}, ${_parameters[1]})`;
                },
                [ParticleData.FUNCTION.POLYNOMIAL3]: (_parameters) => {
                    let x = _parameters[0];
                    let a = _parameters[1];
                    let b = _parameters[2];
                    let c = _parameters[3];
                    let d = _parameters[4];
                    return `(${a} * pow(${x}, 3.0) + ${b} * pow(${x}, 2.0) + ${c} * ${x} + ${d})`;
                },
                [ParticleData.FUNCTION.SQUARE_ROOT]: (_parameters) => {
                    let x = _parameters[0];
                    return `sqrt(${x})`;
                },
                [ParticleData.FUNCTION.RANDOM]: (_parameters) => {
                    return `fetchRandomNumber(${(RenderInjectorShaderParticleSystem.randomNumberIndexOffset++).toFixed(0)}, iParticleSystemRandomNumbersSize, iParticleSystemRandomNumbersLength)`;
                },
                [ParticleData.FUNCTION.RANDOM_RANGE]: (_parameters) => {
                    return `(${RenderInjectorShaderParticleSystem.FUNCTIONS["random"]()} * (${_parameters[1]} - ${_parameters[0]}) + ${_parameters[0]})`;
                }
            };
        }
        static { this.randomNumberIndexOffset = 0; }
        static decorate(_constructor, _context) {
            FudgeCore.RenderInjectorShader.decorate(_constructor.prototype, _context);
            Object.defineProperty(_constructor.prototype, _constructor.prototype.getVertexShaderSource.name, {
                value: RenderInjectorShaderParticleSystem.getVertexShaderSource
            });
            Object.defineProperty(_constructor.prototype, _constructor.prototype.getFragmentShaderSource.name, {
                value: RenderInjectorShaderParticleSystem.getFragmentShaderSource
            });
        }
        static getVertexShaderSource() {
            let data = this.data;
            let mtxLocal = data?.mtxLocal;
            let mtxWorld = data?.mtxWorld;
            RenderInjectorShaderParticleSystem.randomNumberIndexOffset = 0;
            let source = this.vertexShaderSource
                .replace("#version 300 es", `#version 300 es\n#define ${this.define[0]}${data.color ? "\n#define PARTICLE_COLOR" : ""}`)
                .replace("/*$variables*/", RenderInjectorShaderParticleSystem.generateVariables(data?.variables, data?.variableNames))
                .replace("/*$mtxLocal*/", RenderInjectorShaderParticleSystem.generateTransformations(mtxLocal, "Local"))
                .replace("/*$mtxLocal*/", mtxLocal && mtxLocal.length > 0 ? "* mtxLocal" : "")
                .replace("/*$mtxWorld*/", RenderInjectorShaderParticleSystem.generateTransformations(mtxWorld, "World"))
                .replace("/*$mtxWorld*/", mtxWorld && mtxWorld.length > 0 ? "mtxWorld *" : "")
                .replaceAll("/*$color*/", RenderInjectorShaderParticleSystem.generateColor(data?.color));
            return source;
        }
        static getFragmentShaderSource() {
            return this.fragmentShaderSource.replace("#version 300 es", `#version 300 es\n#define ${this.define[0]}${this.data.color ? "\n#define PARTICLE_COLOR" : ""}`);
        }
        static generateVariables(_variables, _variableNames) {
            if (!_variables)
                return "";
            return _variables
                .map((_variable, _index) => ({ name: "fParticleSystemVariable_" + _variableNames[_index], value: RenderInjectorShaderParticleSystem.generateExpression(_variable) }))
                .map(_variable => `float ${_variable.name} = ${_variable.value};`)
                .reduce((_accumulator, _code) => `${_accumulator}\n${_code}`, "");
        }
        static generateTransformations(_transformations, _localOrWorld) {
            if (!_transformations || _transformations.length == 0)
                return "";
            let transformations = _transformations
                .map(_data => {
                let isScale = _data.transformation === "scale";
                let [x, y, z] = [_data.parameters[0], _data.parameters[1], _data.parameters[2]]
                    .map((_value) => _value ? RenderInjectorShaderParticleSystem.generateExpression(_value) : (isScale ? "1.0" : "0.0"));
                return [_data.transformation, x, y, z];
            });
            let code = "";
            code += transformations
                .map(([_transformation, _x, _y, _z], _index) => {
                let rotateId = _index + _localOrWorld;
                if (_transformation == "rotate") {
                    let toRadians = (_value) => `${_value} * ${FudgeCore.Calc.deg2rad}`;
                    return `float fXRadians${rotateId} = ${toRadians(_x)};
              float fYRadians${rotateId} = ${toRadians(_y)};
              float fZRadians${rotateId} = ${toRadians(_z)};
              float fSinX${rotateId} = sin(fXRadians${rotateId});
              float fCosX${rotateId} = cos(fXRadians${rotateId}); 
              float fSinY${rotateId} = sin(fYRadians${rotateId});
              float fCosY${rotateId} = cos(fYRadians${rotateId});
              float fSinZ${rotateId} = sin(fZRadians${rotateId});
              float fCosZ${rotateId} = cos(fZRadians${rotateId});\n`;
                }
                else
                    return "";
            })
                .filter((_transformation) => _transformation != "")
                .reduce((_accumulator, _code) => `${_accumulator}\n${_code}`, "");
            code += "\n";
            code += `mat4 mtx${_localOrWorld} = `;
            code += transformations
                .map(([_transformation, _x, _y, _z], _index) => {
                let rotateId = _index + _localOrWorld;
                switch (_transformation) {
                    case "translate":
                        return `mat4(
              1.0, 0.0, 0.0, 0.0,
              0.0, 1.0, 0.0, 0.0,
              0.0, 0.0, 1.0, 0.0,
              ${_x}, ${_y}, ${_z}, 1.0)`;
                    case "rotate":
                        return `mat4(
              fCosZ${rotateId} * fCosY${rotateId}, fSinZ${rotateId} * fCosY${rotateId}, -fSinY${rotateId}, 0.0,
              fCosZ${rotateId} * fSinY${rotateId} * fSinX${rotateId} - fSinZ${rotateId} * fCosX${rotateId}, fSinZ${rotateId} * fSinY${rotateId} * fSinX${rotateId} + fCosZ${rotateId} * fCosX${rotateId}, fCosY${rotateId} * fSinX${rotateId}, 0.0,
              fCosZ${rotateId} * fSinY${rotateId} * fCosX${rotateId} + fSinZ${rotateId} * fSinX${rotateId}, fSinZ${rotateId} * fSinY${rotateId} * fCosX${rotateId} - fCosZ${rotateId} * fSinX${rotateId}, fCosY${rotateId} * fCosX${rotateId}, 0.0,
              0.0, 0.0, 0.0, 1.0
              )`;
                    case "scale":
                        return `mat4(
              ${_x}, 0.0, 0.0, 0.0,
              0.0, ${_y}, 0.0, 0.0,
              0.0, 0.0, ${_z}, 0.0,
              0.0, 0.0, 0.0, 1.0
              )`;
                    default:
                        throw `Error in ${FudgeCore.ParticleSystem.name}: "${_transformation}" is not a transformation`;
                }
            })
                .reduce((_accumulator, _code) => `${_accumulator} * \n${_code}`);
            code += ";\n";
            return code;
        }
        static generateColor(_color) {
            if (!_color)
                return "";
            let rgba = [_color[0], _color[1], _color[2], _color[3]]
                .map((_value) => _value ? RenderInjectorShaderParticleSystem.generateExpression(_value) : "1.0")
                .join(", ");
            return `vec4(${rgba});`;
        }
        static generateExpression(_expression) {
            if (ParticleData.isFunction(_expression)) {
                let parameters = [];
                for (let param of _expression.parameters) {
                    parameters.push(RenderInjectorShaderParticleSystem.generateExpression(param));
                }
                return RenderInjectorShaderParticleSystem.generateFunction(_expression.function, parameters);
            }
            if (ParticleData.isVariable(_expression)) {
                return ParticleData.PREDEFINED_VARIABLES[_expression.value] || "fParticleSystemVariable_" + _expression.value;
            }
            if (ParticleData.isConstant(_expression)) {
                let value = _expression.value.toString();
                return `${value}${value.includes(".") ? "" : ".0"}`;
            }
            if (ParticleData.isCode(_expression)) {
                let code = _expression.code
                    .replaceAll(/\b[a-zA-z]+\w*(?!\()\b/g, (_match) => ParticleData.PREDEFINED_VARIABLES[_match] || "fParticleSystemVariable_" + _match)
                    .replaceAll(/(?<!\.)\b\d+\b(?!\.)/g, (_match) => _match + ".0");
                code = RenderInjectorShaderParticleSystem.replaceFunctions(code);
                return code;
            }
            throw `Error in ${FudgeCore.ParticleSystem.name}: invalid node structure in particle system serialization`;
        }
        static generateFunction(_function, _parameters) {
            if (_parameters.length < ParticleData.FUNCTION_MINIMUM_PARAMETERS[_function])
                throw `Error in ${FudgeCore.ParticleSystem.name}: "${_function}" needs at least ${ParticleData.FUNCTION_MINIMUM_PARAMETERS[_function]} parameters`;
            if (Object.values(ParticleData.FUNCTION).includes(_function))
                return RenderInjectorShaderParticleSystem.FUNCTIONS[_function](_parameters);
            else
                throw `Error in ${FudgeCore.ParticleSystem.name}: "${_function}" is not an operation`;
        }
        static replaceFunctions(_code) {
            let functionRegex = /\b[a-zA-z_]+\w*\(/g;
            let match;
            while ((match = functionRegex.exec(_code)) != null) {
                let functionGenerator = RenderInjectorShaderParticleSystem.FUNCTIONS[match[0].slice(0, -1)];
                if (!functionGenerator)
                    continue;
                let commaIndices = [];
                let openBrackets = 1;
                let argumentsLastIndex = functionRegex.lastIndex;
                while (openBrackets > 0) {
                    switch (_code[argumentsLastIndex]) {
                        case "(":
                            openBrackets++;
                            break;
                        case ")":
                            openBrackets--;
                            break;
                        case ",":
                            if (openBrackets == 1)
                                commaIndices.push(argumentsLastIndex);
                            break;
                    }
                    argumentsLastIndex++;
                }
                let args = [functionRegex.lastIndex - 1, ...commaIndices, argumentsLastIndex - 1].reduce((_accumulator, _position, _index, _positions) => {
                    return _index == _positions.length - 1 ?
                        _accumulator :
                        _accumulator.concat(_code.slice(_position + 1, _positions[_index + 1]).trim());
                }, []);
                functionRegex.lastIndex = match.index;
                _code = `${_code.slice(0, match.index)}(${functionGenerator(args)})${_code.slice(argumentsLastIndex)}`;
            }
            return _code;
        }
    }
    FudgeCore.RenderInjectorShaderParticleSystem = RenderInjectorShaderParticleSystem;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderInjectorComponentParticleSystem {
        static decorate(_method, _context) {
            return Reflect.get(this, _context.name);
        }
        static useRenderData() {
            let crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            if (this.renderData) {
                crc3.activeTexture(FudgeCore.TEXTURE_LOCATION.PARTICLE.UNIT);
                crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, this.renderData);
                return;
            }
            const texture = FudgeCore.Render.assert(crc3.createTexture());
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, texture);
            let textureSize = Math.ceil(Math.sqrt(this.size));
            textureSize = Math.min(textureSize, crc3.getParameter(crc3.MAX_TEXTURE_SIZE));
            let randomNumbers = [];
            for (let i = 0; i < textureSize * textureSize; i++)
                randomNumbers.push(Math.random());
            try {
                crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.R32F, textureSize, textureSize, 0, WebGL2RenderingContext.RED, WebGL2RenderingContext.FLOAT, Float32Array.from(randomNumbers));
            }
            catch (_error) {
                FudgeCore.Debug.error(_error);
            }
            crc3.texParameteri(crc3.TEXTURE_2D, crc3.TEXTURE_MIN_FILTER, crc3.NEAREST);
            crc3.texParameteri(crc3.TEXTURE_2D, crc3.TEXTURE_MAG_FILTER, crc3.NEAREST);
            this.renderData = texture;
            this.useRenderData();
        }
        static deleteRenderData() {
            if (!this.renderData)
                return;
            let crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
            crc3.deleteTexture(this.renderData);
            delete this.renderData;
        }
    }
    FudgeCore.RenderInjectorComponentParticleSystem = RenderInjectorComponentParticleSystem;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Recycler {
        static { this.depot = {}; }
        static get(_t) {
            let instances = Recycler.depot[_t.name];
            if (instances?.length > 0) {
                let instance = instances.pop();
                instance.recycle?.();
                return instance;
            }
            else
                return new _t();
        }
        static reuse(_t) {
            return Recycler.depot[_t.name]?.pop() ?? new _t();
        }
        static store(_instance) {
            (Recycler.depot[_instance.constructor.name] ??= new FudgeCore.RecycableArray()).push(_instance);
        }
        static dump(_t) {
            Recycler.depot[_t.name] = new FudgeCore.RecycableArray();
        }
        static dumpAll() {
            Recycler.depot = {};
        }
    }
    FudgeCore.Recycler = Recycler;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Vector2 extends FudgeCore.Mutable {
        constructor(_x = 0, _y = 0) {
            super();
            this.set(_x, _y);
        }
        static ZERO() {
            return FudgeCore.Recycler.get(Vector2);
        }
        static ONE(_scale = 1) {
            return FudgeCore.Recycler.reuse(Vector2).set(_scale, _scale);
        }
        static X(_scale = 1) {
            return FudgeCore.Recycler.reuse(Vector2).set(_scale, 0);
        }
        static Y(_scale = 1) {
            return FudgeCore.Recycler.reuse(Vector2).set(0, _scale);
        }
        static TRANSFORMATION(_vector, _mtxTransform, _includeTranslation = true, _out = FudgeCore.Recycler.reuse(Vector2)) {
            let m = _mtxTransform.getArray();
            _out.set(m[0] * _vector.x + m[3] * _vector.y, m[1] * _vector.x + m[4] * _vector.y);
            if (_includeTranslation)
                _out.add(_mtxTransform.translation);
            return _out;
        }
        static NORMALIZATION(_vector, _length = 1, _out = FudgeCore.Recycler.reuse(Vector2)) {
            return _out.copy(_vector).normalize(_length);
        }
        static SCALE(_vector, _scale, _out = FudgeCore.Recycler.reuse(Vector2)) {
            return _out.set(_vector.x * _scale, _vector.y * _scale);
        }
        static SUM(_a, _b, _out = FudgeCore.Recycler.reuse(Vector2)) {
            return _out.set(_a.x + _b.x, _a.y + _b.y);
        }
        static DIFFERENCE(_minuend, _subtrahend, _out = FudgeCore.Recycler.reuse(Vector2)) {
            return _out.set(_minuend.x - _subtrahend.x, _minuend.y - _subtrahend.y);
        }
        static NEGATION(_vector, _out = FudgeCore.Recycler.reuse(Vector2)) {
            return _out.set(-_vector.x, -_vector.y);
        }
        static CROSS(_a, _b) {
            return _a.x * _b.y - _a.y * _b.x;
        }
        static DOT(_a, _b) {
            return _a.x * _b.x + _a.y * _b.y;
        }
        static ORTHOGONAL(_vector, _clockwise = false, _out = FudgeCore.Recycler.reuse(Vector2)) {
            if (_clockwise)
                return _out.set(_vector.y, -_vector.x);
            else
                return _out.set(-_vector.y, _vector.x);
        }
        static GEO(_angle = 0, _magnitude = 1, _out = FudgeCore.Recycler.reuse(Vector2)) {
            const geo = FudgeCore.Recycler.reuse(FudgeCore.Geo2).set(_angle, _magnitude);
            _out.geo = geo;
            FudgeCore.Recycler.store(geo);
            return _out;
        }
        get isArrayConvertible() {
            return true;
        }
        get magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        get magnitudeSquared() {
            return this.x * this.x + this.y * this.y;
        }
        get geo() {
            let geo = FudgeCore.Recycler.get(FudgeCore.Geo2);
            geo.magnitude = this.magnitude;
            if (geo.magnitude === 0)
                return geo;
            geo.angle = 180 * Math.atan2(this.y / geo.magnitude, this.x / geo.magnitude) / Math.PI;
            return geo;
        }
        set geo(_geo) {
            this.set(_geo.magnitude, 0);
            const rotation = FudgeCore.Matrix3x3.ROTATION(_geo.angle);
            this.transform(rotation);
            FudgeCore.Recycler.store(rotation);
        }
        get clone() {
            return FudgeCore.Recycler.reuse(Vector2).copy(this);
        }
        copy(_original) {
            this.x = _original.x;
            this.y = _original.y;
            return this;
        }
        set(_x = 0, _y = 0) {
            this.x = _x;
            this.y = _y;
            return this;
        }
        recycle() {
            this.set(0, 0);
        }
        equals(_compare, _tolerance = Number.EPSILON) {
            if (Math.abs(this.x - _compare.x) > _tolerance)
                return false;
            if (Math.abs(this.y - _compare.y) > _tolerance)
                return false;
            return true;
        }
        getDistance(_to) {
            let difference = Vector2.DIFFERENCE(this, _to);
            FudgeCore.Recycler.store(difference);
            return difference.magnitude;
        }
        add(_addend) {
            this.x += _addend.x;
            this.y += _addend.y;
            return this;
        }
        subtract(_subtrahend) {
            this.x -= _subtrahend.x;
            this.y -= _subtrahend.y;
            return this;
        }
        scale(_scalar) {
            this.x *= _scalar;
            this.y *= _scalar;
            return this;
        }
        negate() {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        }
        normalize(_length = 1) {
            let magnitudeSquared = this.magnitudeSquared;
            if (magnitudeSquared == 0)
                throw (new RangeError("Impossible normalization"));
            this.scale(_length / Math.sqrt(magnitudeSquared));
            return this;
        }
        transform(_mtxTransform, _includeTranslation = true) {
            return Vector2.TRANSFORMATION(this, _mtxTransform, _includeTranslation, this);
        }
        min(_compare) {
            this.x = Math.min(this.x, _compare.x);
            this.y = Math.min(this.y, _compare.y);
            return this;
        }
        max(_compare) {
            this.x = Math.max(this.x, _compare.x);
            this.y = Math.max(this.y, _compare.y);
            return this;
        }
        map(_function, _out = FudgeCore.Recycler.reuse(Vector2)) {
            _out.x = _function(this.x, 0, "x", this);
            _out.y = _function(this.y, 1, "y", this);
            return _out;
        }
        apply(_function) {
            this.x = _function(this.x, 0, "x", this);
            this.y = _function(this.y, 1, "y", this);
            return this;
        }
        fromArray(_array, _offset = 0) {
            this.x = _array[_offset];
            this.y = _array[_offset + 1];
            return this;
        }
        toArray(_out = new Array(2), _offset = 0) {
            _out[_offset] = this.x;
            _out[_offset + 1] = this.y;
            return _out;
        }
        toVector3(_z = 0, _out = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
            return _out.set(this.x, this.y, _z);
        }
        toString() {
            let result = `(${this.x.toPrecision(5)}, ${this.y.toPrecision(5)})`;
            return result;
        }
        serialize() {
            let serialization = this.getMutator();
            serialization.toJSON = () => { return `[${this.x}, ${this.y}]`; };
            return serialization;
        }
        async deserialize(_serialization) {
            if (typeof (_serialization) == "string") {
                [this.x, this.y] = JSON.parse(_serialization);
            }
            else
                this.mutate(_serialization);
            return this;
        }
        getMutator() {
            let mutator = {
                x: this.x, y: this.y
            };
            return mutator;
        }
        mutate(_mutator) {
            if (_mutator.x != undefined)
                this.x = _mutator.x;
            if (_mutator.y != undefined)
                this.y = _mutator.y;
        }
        reduceMutator(_mutator) { }
    }
    FudgeCore.Vector2 = Vector2;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let ORIGIN2D;
    (function (ORIGIN2D) {
        ORIGIN2D[ORIGIN2D["TOPLEFT"] = 0] = "TOPLEFT";
        ORIGIN2D[ORIGIN2D["TOPCENTER"] = 1] = "TOPCENTER";
        ORIGIN2D[ORIGIN2D["TOPRIGHT"] = 2] = "TOPRIGHT";
        ORIGIN2D[ORIGIN2D["CENTERLEFT"] = 16] = "CENTERLEFT";
        ORIGIN2D[ORIGIN2D["CENTER"] = 17] = "CENTER";
        ORIGIN2D[ORIGIN2D["CENTERRIGHT"] = 18] = "CENTERRIGHT";
        ORIGIN2D[ORIGIN2D["BOTTOMLEFT"] = 32] = "BOTTOMLEFT";
        ORIGIN2D[ORIGIN2D["BOTTOMCENTER"] = 33] = "BOTTOMCENTER";
        ORIGIN2D[ORIGIN2D["BOTTOMRIGHT"] = 34] = "BOTTOMRIGHT";
    })(ORIGIN2D = FudgeCore.ORIGIN2D || (FudgeCore.ORIGIN2D = {}));
    class Rectangle extends FudgeCore.Mutable {
        constructor(_x = 0, _y = 0, _width = 1, _height = 1, _origin = ORIGIN2D.TOPLEFT) {
            super();
            this.position = FudgeCore.Recycler.get(FudgeCore.Vector2);
            this.size = FudgeCore.Recycler.get(FudgeCore.Vector2);
            this.setPositionAndSize(_x, _y, _width, _height, _origin);
        }
        static GET(_x = 0, _y = 0, _width = 1, _height = 1, _origin = ORIGIN2D.TOPLEFT, _out = FudgeCore.Recycler.reuse(Rectangle)) {
            return _out.setPositionAndSize(_x, _y, _width, _height, _origin);
        }
        get x() {
            return this.position.x;
        }
        set x(_x) {
            this.position.x = _x;
        }
        get y() {
            return this.position.y;
        }
        set y(_y) {
            this.position.y = _y;
        }
        get width() {
            return this.size.x;
        }
        set width(_width) {
            this.size.x = _width;
        }
        get height() {
            return this.size.y;
        }
        set height(_height) {
            this.size.y = _height;
        }
        get left() {
            if (this.size.x > 0)
                return this.position.x;
            return (this.position.x + this.size.x);
        }
        set left(_value) {
            this.size.x = this.right - _value;
            this.position.x = _value;
        }
        get top() {
            if (this.size.y > 0)
                return this.position.y;
            return (this.position.y + this.size.y);
        }
        set top(_value) {
            this.size.y = this.bottom - _value;
            this.position.y = _value;
        }
        get right() {
            if (this.size.x > 0)
                return (this.position.x + this.size.x);
            return this.position.x;
        }
        set right(_value) {
            this.size.x = this.position.x + _value;
        }
        get bottom() {
            if (this.size.y > 0)
                return (this.position.y + this.size.y);
            return this.position.y;
        }
        set bottom(_value) {
            this.size.y = this.position.y + _value;
        }
        get clone() {
            return FudgeCore.Recycler.reuse(Rectangle).copy(this);
        }
        recycle() {
            this.setPositionAndSize();
        }
        equals(_compare, _tolerance = Number.EPSILON) {
            return Math.abs(this.x - _compare.x) <= _tolerance &&
                Math.abs(this.y - _compare.y) <= _tolerance &&
                Math.abs(this.width - _compare.width) <= _tolerance &&
                Math.abs(this.height - _compare.height) <= _tolerance;
        }
        copy(_rect) {
            return this.setPositionAndSize(_rect.x, _rect.y, _rect.width, _rect.height);
        }
        setPositionAndSize(_x = 0, _y = 0, _width = 1, _height = 1, _origin = ORIGIN2D.TOPLEFT) {
            return this.set(_x, _y, _width, _height, _origin);
        }
        set(_x = 0, _y = 0, _width = 1, _height = 1, _origin = ORIGIN2D.TOPLEFT) {
            this.size.set(_width, _height);
            switch (_origin & 0x03) {
                case 0x00:
                    this.position.x = _x;
                    break;
                case 0x01:
                    this.position.x = _x - _width / 2;
                    break;
                case 0x02:
                    this.position.x = _x - _width;
                    break;
            }
            switch (_origin & 0x30) {
                case 0x00:
                    this.position.y = _y;
                    break;
                case 0x10:
                    this.position.y = _y - _height / 2;
                    break;
                case 0x20:
                    this.position.y = _y - _height;
                    break;
            }
            return this;
        }
        pointToRect(_point, _target, _out = FudgeCore.Recycler.reuse(FudgeCore.Vector2)) {
            _out.copy(_point);
            _out.subtract(this.position);
            _out.x *= _target.width / this.width;
            _out.y *= _target.height / this.height;
            _out.add(_target.position);
            return _out;
        }
        isInside(_point) {
            return (_point.x >= this.left && _point.x <= this.right && _point.y >= this.top && _point.y <= this.bottom);
        }
        collides(_rect) {
            if (this.left > _rect.right)
                return false;
            if (this.right < _rect.left)
                return false;
            if (this.top > _rect.bottom)
                return false;
            if (this.bottom < _rect.top)
                return false;
            return true;
        }
        covers(_rect) {
            if (this.left > _rect.left)
                return false;
            if (this.right < _rect.right)
                return false;
            if (this.top > _rect.top)
                return false;
            if (this.bottom < _rect.bottom)
                return false;
            return true;
        }
        getIntersection(_rect, _out = FudgeCore.Recycler.reuse(Rectangle)) {
            if (!this.collides(_rect))
                return null;
            _out.x = Math.max(this.left, _rect.left);
            _out.y = Math.max(this.top, _rect.top);
            _out.width = Math.min(this.right, _rect.right) - _out.x;
            _out.height = Math.min(this.bottom, _rect.bottom) - _out.y;
            return _out;
        }
        toString() {
            return `ƒ.Rectangle(position:${this.position.toString()}, size:${this.size.toString()}, left:${this.left.toPrecision(5)}, top:${this.top.toPrecision(5)}, right:${this.right.toPrecision(5)}, bottom:${this.bottom.toPrecision(5)})`;
        }
        reduceMutator(_mutator) { }
    }
    FudgeCore.Rectangle = Rectangle;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let BLEND;
    (function (BLEND) {
        BLEND[BLEND["OPAQUE"] = 0] = "OPAQUE";
        BLEND[BLEND["TRANSPARENT"] = 1] = "TRANSPARENT";
        BLEND[BLEND["ADDITIVE"] = 2] = "ADDITIVE";
        BLEND[BLEND["SUBTRACTIVE"] = 3] = "SUBTRACTIVE";
        BLEND[BLEND["MODULATE"] = 4] = "MODULATE";
    })(BLEND = FudgeCore.BLEND || (FudgeCore.BLEND = {}));
    let DEPTH_FUNCTION;
    (function (DEPTH_FUNCTION) {
        DEPTH_FUNCTION[DEPTH_FUNCTION["NEVER"] = 0] = "NEVER";
        DEPTH_FUNCTION[DEPTH_FUNCTION["LESS"] = 1] = "LESS";
        DEPTH_FUNCTION[DEPTH_FUNCTION["EQUAL"] = 2] = "EQUAL";
        DEPTH_FUNCTION[DEPTH_FUNCTION["LESS_EQUAL"] = 3] = "LESS_EQUAL";
        DEPTH_FUNCTION[DEPTH_FUNCTION["GREATER"] = 4] = "GREATER";
        DEPTH_FUNCTION[DEPTH_FUNCTION["NOT_EQUAL"] = 5] = "NOT_EQUAL";
        DEPTH_FUNCTION[DEPTH_FUNCTION["GREATER_EQUAL"] = 6] = "GREATER_EQUAL";
        DEPTH_FUNCTION[DEPTH_FUNCTION["ALWAYS"] = 7] = "ALWAYS";
    })(DEPTH_FUNCTION = FudgeCore.DEPTH_FUNCTION || (FudgeCore.DEPTH_FUNCTION = {}));
    let SHADER_ATTRIBUTE;
    (function (SHADER_ATTRIBUTE) {
        SHADER_ATTRIBUTE[SHADER_ATTRIBUTE["POSITION"] = 0] = "POSITION";
        SHADER_ATTRIBUTE[SHADER_ATTRIBUTE["NORMAL"] = 1] = "NORMAL";
        SHADER_ATTRIBUTE[SHADER_ATTRIBUTE["TEXCOORDS"] = 2] = "TEXCOORDS";
        SHADER_ATTRIBUTE[SHADER_ATTRIBUTE["COLOR"] = 3] = "COLOR";
        SHADER_ATTRIBUTE[SHADER_ATTRIBUTE["TANGENT"] = 4] = "TANGENT";
        SHADER_ATTRIBUTE[SHADER_ATTRIBUTE["BONES"] = 5] = "BONES";
        SHADER_ATTRIBUTE[SHADER_ATTRIBUTE["WEIGHTS"] = 6] = "WEIGHTS";
    })(SHADER_ATTRIBUTE = FudgeCore.SHADER_ATTRIBUTE || (FudgeCore.SHADER_ATTRIBUTE = {}));
    FudgeCore.UNIFORM_BLOCK = {
        LIGHTS: {
            NAME: "Lights",
            BINDING: 0
        },
        CAMERA: {
            NAME: "Camera",
            BINDING: 1
        },
        MATERIAL: {
            NAME: "Material",
            BINDING: 2
        },
        NODE: {
            NAME: "Node",
            BINDING: 3
        },
        SKIN: {
            NAME: "Skin",
            BINDING: 4
        },
        FOG: {
            NAME: "Fog",
            BINDING: 5
        }
    };
    FudgeCore.TEXTURE_LOCATION = {
        COLOR: {
            UNIFORM: "u_texColor",
            UNIT: WebGL2RenderingContext.TEXTURE0,
            INDEX: 0
        },
        NORMAL: {
            UNIFORM: "u_texNormal",
            UNIT: WebGL2RenderingContext.TEXTURE1,
            INDEX: 1
        },
        PARTICLE: {
            UNIFORM: "u_particleSystemRandomNumbers",
            UNIT: WebGL2RenderingContext.TEXTURE2,
            INDEX: 2
        },
        TEXT: {
            UNIFORM: "u_texText",
            UNIT: WebGL2RenderingContext.TEXTURE3,
            INDEX: 3
        },
        TOON: {
            UNIFORM: "u_texToon",
            UNIT: WebGL2RenderingContext.TEXTURE4,
            INDEX: 4
        }
    };
    class RenderWebGL extends FudgeCore.EventTargetStatic {
        static { this.crc3 = RenderWebGL.initialize(); }
        static { this.attachmentsColorPositionNormal = [WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.COLOR_ATTACHMENT1, WebGL2RenderingContext.COLOR_ATTACHMENT2]; }
        static { this.attachmentsColor = [WebGL2RenderingContext.COLOR_ATTACHMENT0]; }
        static initialize(_antialias, _alpha) {
            let fudgeConfig = Reflect.get(globalThis, "fudgeConfig") || {};
            const antialias = (_antialias != undefined) ? _antialias : fudgeConfig.antialias || false;
            if (antialias)
                FudgeCore.Debug.error("The default antialiasing is not compatible with the current post-processing effects and will therefore be disabled.");
            let contextAttributes = {
                alpha: (_alpha != undefined) ? _alpha : fudgeConfig.alpha || false,
                antialias: false,
                premultipliedAlpha: false,
                stencil: true
            };
            FudgeCore.Debug.fudge("Initialize RenderWebGL", contextAttributes);
            let canvas = document.createElement("canvas");
            let crc3;
            crc3 = RenderWebGL.assert(canvas.getContext("webgl2", contextAttributes), "WebGL-context couldn't be created");
            RenderWebGL.crc3 = crc3;
            crc3.enable(WebGL2RenderingContext.CULL_FACE);
            crc3.enable(WebGL2RenderingContext.DEPTH_TEST);
            crc3.enable(WebGL2RenderingContext.BLEND);
            RenderWebGL.setBlendMode(BLEND.TRANSPARENT);
            RenderWebGL.rectCanvas = FudgeCore.Rectangle.GET(0, 0, RenderWebGL.crc3.canvas.width, RenderWebGL.crc3.canvas.height);
            RenderWebGL.rectRender = RenderWebGL.getCanvasRectangle().clone;
            RenderWebGL.initializeAttachments();
            RenderWebGL.adjustAttachments();
            FudgeCore.RenderWebGLComponentCamera.initialize(RenderWebGL);
            FudgeCore.RenderWebGLComponentFog.initialize(RenderWebGL);
            FudgeCore.RenderWebGLComponentLight.initialize(RenderWebGL);
            FudgeCore.RenderManagerNode.initialize(RenderWebGL);
            FudgeCore.RenderManagerCoat.initialize(RenderWebGL);
            return crc3;
        }
        static assert(_value, _message = "") {
            if (_value === null)
                throw new Error(`Assertion failed. ${_message}, WebGL-Error: ${RenderWebGL.crc3 ? RenderWebGL.crc3.getError() : ""}`);
            return _value;
        }
        static getCanvas() {
            return RenderWebGL.crc3.canvas;
        }
        static getRenderingContext() {
            return RenderWebGL.crc3;
        }
        static getCanvasRectangle() {
            return RenderWebGL.rectCanvas;
        }
        static setCanvasSize(_width, _height) {
            let sizeChanged = false;
            if (RenderWebGL.rectCanvas.width != _width) {
                RenderWebGL.rectCanvas.width = _width;
                RenderWebGL.crc3.canvas.width = _width;
                sizeChanged = true;
            }
            if (RenderWebGL.rectCanvas.height != _height) {
                RenderWebGL.rectCanvas.height = _height;
                RenderWebGL.crc3.canvas.height = _height;
                sizeChanged = true;
            }
            if (sizeChanged)
                RenderWebGL.adjustAttachments();
        }
        static getRenderRectangle() {
            return RenderWebGL.rectRender;
        }
        static setRenderRectangle(_rect) {
            if (RenderWebGL.rectRender.equals(_rect))
                return;
            RenderWebGL.rectRender.copy(_rect);
            RenderWebGL.crc3.viewport(_rect.x, _rect.y, _rect.width, _rect.height);
        }
        static clear(_color, _colors = true, _depth = true, _stencil = true) {
            RenderWebGL.crc3.clearColor(_color?.r ?? 0, _color?.g ?? 0, _color?.b ?? 0, _color?.a ?? 1);
            let mask = 0;
            if (_colors)
                mask |= WebGL2RenderingContext.COLOR_BUFFER_BIT;
            if (_depth)
                mask |= WebGL2RenderingContext.DEPTH_BUFFER_BIT;
            if (_stencil)
                mask |= WebGL2RenderingContext.STENCIL_BUFFER_BIT;
            RenderWebGL.crc3.clear(mask);
        }
        static setFramebufferTarget(_buffer) {
            RenderWebGL.fboOut = _buffer;
        }
        static resetFramebuffer() {
            RenderWebGL.crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboScene);
        }
        static setDepthTest(_test) {
            if (_test)
                RenderWebGL.crc3.enable(WebGL2RenderingContext.DEPTH_TEST);
            else
                RenderWebGL.crc3.disable(WebGL2RenderingContext.DEPTH_TEST);
        }
        static setDepthFunction(_function = DEPTH_FUNCTION.LESS) {
            RenderWebGL.crc3.depthFunc(_function + WebGL2RenderingContext.NEVER);
        }
        static setScissorTest(_test, _x, _y, _width, _height) {
            if (_test)
                RenderWebGL.crc3.enable(WebGL2RenderingContext.SCISSOR_TEST);
            else
                RenderWebGL.crc3.disable(WebGL2RenderingContext.SCISSOR_TEST);
            RenderWebGL.crc3.scissor(_x, _y, _width, _height);
        }
        static setColorWriteMask(_r, _g, _b, _a) {
            RenderWebGL.crc3.colorMask(_r, _g, _b, _a);
        }
        static setViewport(_x, _y, _width, _height) {
            RenderWebGL.crc3.viewport(_x, _y, _width, _height);
        }
        static setBlendMode(_mode) {
            switch (_mode) {
                case BLEND.OPAQUE:
                    RenderWebGL.crc3.blendEquation(WebGL2RenderingContext.FUNC_ADD);
                    RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.ONE, WebGL2RenderingContext.ZERO);
                    break;
                case BLEND.TRANSPARENT:
                    RenderWebGL.crc3.blendEquation(WebGL2RenderingContext.FUNC_ADD);
                    RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA);
                    break;
                case BLEND.ADDITIVE:
                    RenderWebGL.crc3.blendEquation(WebGL2RenderingContext.FUNC_ADD);
                    RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE);
                    break;
                case BLEND.SUBTRACTIVE:
                    RenderWebGL.crc3.blendEquation(WebGL2RenderingContext.FUNC_REVERSE_SUBTRACT);
                    RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE);
                    break;
                case BLEND.MODULATE:
                    RenderWebGL.crc3.blendEquation(WebGL2RenderingContext.FUNC_ADD);
                    RenderWebGL.crc3.blendFunc(WebGL2RenderingContext.DST_COLOR, WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA);
                default:
                    break;
            }
        }
        static pointRenderToWorld(_render) {
            const crc3 = RenderWebGL.getRenderingContext();
            const data = new Float32Array(4);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboScene);
            crc3.readBuffer(WebGL2RenderingContext.COLOR_ATTACHMENT1);
            crc3.readPixels(_render.x, RenderWebGL.rectRender.height - _render.y, 1, 1, crc3.RGBA, crc3.FLOAT, data);
            crc3.readBuffer(WebGL2RenderingContext.COLOR_ATTACHMENT0);
            let position = FudgeCore.Recycler.get(FudgeCore.Vector3);
            position.set(data[0], data[1], data[2]);
            return position;
        }
        static initializeAttachments() {
            const crc3 = RenderWebGL.crc3;
            crc3.getExtension("EXT_color_buffer_float");
            RenderWebGL.fboScene = RenderWebGL.assert(crc3.createFramebuffer());
            RenderWebGL.fboOut = null;
            RenderWebGL.texColor = RenderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
            RenderWebGL.texPosition = RenderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
            RenderWebGL.texNormal = RenderWebGL.createTexture(WebGL2RenderingContext.LINEAR, WebGL2RenderingContext.CLAMP_TO_EDGE);
            RenderWebGL.texDepthStencil = RenderWebGL.createTexture(WebGL2RenderingContext.NEAREST, WebGL2RenderingContext.CLAMP_TO_EDGE);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboScene);
            crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT0, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texColor, 0);
            crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT1, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texPosition, 0);
            crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.COLOR_ATTACHMENT2, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texNormal, 0);
            crc3.framebufferTexture2D(WebGL2RenderingContext.FRAMEBUFFER, WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT, WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texDepthStencil, 0);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, null);
            FudgeCore.RenderWebGLComponentAmbientOcclusion.initialize(RenderWebGL);
            FudgeCore.RenderWebGLComponentBloom.initialize(RenderWebGL);
            FudgeCore.RenderWebGLComponentOutline.initialize(RenderWebGL);
            FudgeCore.RenderWebGLPicking.initialize(RenderWebGL);
        }
        static adjustAttachments() {
            const crc3 = RenderWebGL.getRenderingContext();
            const canvasWidth = RenderWebGL.rectCanvas.width || 1;
            const canvasHeight = RenderWebGL.rectCanvas.height || 1;
            crc3.activeTexture(crc3.TEXTURE0);
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texColor);
            crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, null);
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texPosition);
            crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA32F, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.FLOAT, null);
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texNormal);
            crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA16F, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.FLOAT, null);
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, RenderWebGL.texDepthStencil);
            crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.DEPTH24_STENCIL8, canvasWidth, canvasHeight, 0, WebGL2RenderingContext.DEPTH_STENCIL, WebGL2RenderingContext.UNSIGNED_INT_24_8, null);
            crc3.bindTexture(crc3.TEXTURE_2D, null);
            FudgeCore.RenderWebGLComponentAmbientOcclusion.resize(RenderWebGL, canvasWidth, canvasHeight);
            FudgeCore.RenderWebGLComponentBloom.resize(RenderWebGL, canvasWidth, canvasHeight);
            FudgeCore.RenderWebGLComponentOutline.resize(RenderWebGL, canvasWidth, canvasHeight);
        }
        static createTexture(_filter, _wrap) {
            const crc3 = RenderWebGL.getRenderingContext();
            const texture = RenderWebGL.assert(crc3.createTexture());
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, texture);
            crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, _filter);
            crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, _filter);
            crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_S, _wrap);
            crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_T, _wrap);
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
            return texture;
        }
        static bindTexture(_shader, _texture, _unit, _uniform) {
            const crc3 = RenderWebGL.getRenderingContext();
            crc3.activeTexture(_unit);
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, _texture);
            crc3.uniform1i(_shader.uniforms[_uniform], _unit - WebGL2RenderingContext.TEXTURE0);
        }
        static useNodeUniforms(_shader, _mtxWorld, _mtxPivot, _color, _id) {
            const crc3 = RenderWebGL.crc3;
            let uniform = _shader.uniforms["u_mtxMeshToWorld"];
            if (uniform && _mtxWorld)
                crc3.uniformMatrix4fv(uniform, false, _mtxWorld.getArray());
            uniform = _shader.uniforms["u_mtxPivot"];
            if (uniform && _mtxPivot)
                crc3.uniformMatrix3fv(_shader.uniforms["u_mtxPivot"], false, _mtxPivot.getArray());
            uniform = _shader.uniforms["u_vctColor"];
            if (uniform && _color)
                crc3.uniform4fv(uniform, _color.toArray(new Float32Array(4)));
            uniform = _shader.uniforms["u_id"];
            if (uniform)
                RenderWebGL.crc3.uniform1i(uniform, _id);
        }
        static drawNode(_node, _cmpCamera) {
            const cmpMesh = _node.getComponent(FudgeCore.ComponentMesh);
            const cmpMaterial = _node.getComponent(FudgeCore.ComponentMaterial);
            const cmpParticleSystem = _node.getComponent(FudgeCore.ComponentParticleSystem);
            if (cmpParticleSystem?.isActive) {
                RenderWebGL.drawParticles(_node, cmpParticleSystem, cmpMesh, cmpMaterial);
                return;
            }
            const cmpText = _node.getComponent(FudgeCore.ComponentText);
            const cmpFaceCamera = _node.getComponent(FudgeCore.ComponentFaceCamera);
            const material = cmpMaterial.material;
            material.getShader().useProgram();
            material.coat.useRenderData();
            const cmpSkeleton = cmpMesh.skeleton;
            if (cmpSkeleton?.isActive)
                cmpSkeleton.useRenderBuffer();
            let mtxWorldOverride;
            if (cmpText?.isActive)
                mtxWorldOverride = cmpText.useRenderData(cmpMesh.mtxWorld, _cmpCamera);
            if (cmpFaceCamera?.isActive)
                mtxWorldOverride = RenderWebGL.faceCamera(_node, mtxWorldOverride ?? cmpMesh.mtxWorld, _cmpCamera.mtxWorld);
            _node.useRenderData(mtxWorldOverride);
            const renderBuffers = cmpMesh.mesh.useRenderBuffers();
            RenderWebGL.crc3.drawElements(WebGL2RenderingContext.TRIANGLES, renderBuffers.nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
        }
        static pick(_nodes, _cmpCamera) {
            return FudgeCore.RenderWebGLPicking.pickFrom(_nodes, _cmpCamera, RenderWebGL.pickNodes);
        }
        static pickNodes(_nodes, _cmpCamera) {
            let picks = [];
            for (const node of _nodes) {
                let cmpMesh = node.getComponent(FudgeCore.ComponentMesh);
                let cmpMaterial = node.getComponent(FudgeCore.ComponentMaterial);
                if (!(cmpMesh && cmpMesh.isActive && cmpMaterial && cmpMaterial.isActive))
                    continue;
                let coat = cmpMaterial.material.coat;
                let shader = coat instanceof FudgeCore.CoatTextured ? FudgeCore.ShaderPickTextured : FudgeCore.ShaderPick;
                shader.useProgram();
                coat.useRenderData();
                let mtxMeshToWorld = RenderWebGL.faceCamera(node, cmpMesh.mtxWorld, _cmpCamera.mtxWorld);
                RenderWebGL.useNodeUniforms(shader, mtxMeshToWorld, cmpMaterial.mtxPivot, cmpMaterial.clrPrimary, picks.length);
                const renderBuffers = cmpMesh.mesh.useRenderBuffers();
                RenderWebGL.crc3.drawElements(WebGL2RenderingContext.TRIANGLES, renderBuffers.nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
                picks.push(new FudgeCore.Pick(node));
            }
            return picks;
        }
        static drawNodes(_nodesOpaque, _nodesAlpha, _cmpCamera) {
            const crc3 = RenderWebGL.getRenderingContext();
            const node = _cmpCamera.node;
            const cmpFog = node?.getComponent(FudgeCore.ComponentFog);
            const cmpAmbientOcclusion = node?.getComponent(FudgeCore.ComponentAmbientOcclusion);
            const cmpBloom = node?.getComponent(FudgeCore.ComponentBloom);
            const cmpOutline = node?.getComponent(FudgeCore.ComponentOutline);
            FudgeCore.RenderWebGLComponentFog.useRenderbuffer(cmpFog);
            FudgeCore.RenderWebGLComponentCamera.useRenderbuffer(_cmpCamera);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboScene);
            crc3.drawBuffers(cmpAmbientOcclusion?.isActive ? RenderWebGL.attachmentsColorPositionNormal : RenderWebGL.attachmentsColor);
            crc3.disable(WebGL2RenderingContext.BLEND);
            for (let node of _nodesOpaque)
                RenderWebGL.drawNode(node, _cmpCamera);
            crc3.enable(WebGL2RenderingContext.BLEND);
            if (cmpAmbientOcclusion?.isActive)
                FudgeCore.RenderWebGLComponentAmbientOcclusion.draw(_cmpCamera, cmpAmbientOcclusion);
            crc3.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, RenderWebGL.fboScene);
            crc3.drawBuffers(RenderWebGL.attachmentsColor);
            for (let node of _nodesAlpha)
                RenderWebGL.drawNode(node, _cmpCamera);
            if (cmpBloom?.isActive)
                FudgeCore.RenderWebGLComponentBloom.draw(cmpBloom);
            if (cmpOutline?.isActive && cmpOutline.selection)
                FudgeCore.RenderWebGLComponentOutline.draw(cmpOutline.selection, _cmpCamera, cmpOutline);
            crc3.bindFramebuffer(WebGL2RenderingContext.READ_FRAMEBUFFER, RenderWebGL.fboScene);
            crc3.bindFramebuffer(WebGL2RenderingContext.DRAW_FRAMEBUFFER, RenderWebGL.fboOut);
            crc3.blitFramebuffer(0, 0, RenderWebGL.rectCanvas.width, RenderWebGL.rectCanvas.height, 0, 0, RenderWebGL.rectCanvas.width, RenderWebGL.rectCanvas.height, WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT, WebGL2RenderingContext.NEAREST);
        }
        static drawParticles(_node, _cmpParticleSystem, _cmpMesh, _cmpMaterial) {
            const crc3 = RenderWebGL.getRenderingContext();
            const renderBuffers = _cmpMesh.mesh.useRenderBuffers();
            const material = _cmpMaterial.material;
            material.coat.useRenderData();
            _cmpParticleSystem.particleSystem.getShaderFrom(material.getShader()).useProgram();
            _cmpParticleSystem.useRenderData();
            _node.useRenderData();
            crc3.depthMask(_cmpParticleSystem.depthMask);
            RenderWebGL.setBlendMode(_cmpParticleSystem.blendMode);
            crc3.drawElementsInstanced(WebGL2RenderingContext.TRIANGLES, renderBuffers.nIndices, WebGL2RenderingContext.UNSIGNED_SHORT, 0, _cmpParticleSystem.size);
            crc3.depthMask(true);
            RenderWebGL.setBlendMode(BLEND.TRANSPARENT);
        }
        static faceCamera(_node, _mtxMeshToWorld, _mtxCamera) {
            let cmpFaceCamera = _node.getComponent(FudgeCore.ComponentFaceCamera);
            if (cmpFaceCamera?.isActive)
                return _mtxMeshToWorld.clone.lookAt(_mtxCamera.translation, cmpFaceCamera.upLocal ? null : cmpFaceCamera.up, cmpFaceCamera.restrict);
            return _mtxMeshToWorld;
        }
    }
    FudgeCore.RenderWebGL = RenderWebGL;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderInjectorTexture {
        static decorate(_constructor, _context) {
            Object.defineProperty(_constructor.prototype, _constructor.prototype.useRenderData.name, {
                value: RenderInjectorTexture.useRenderData
            });
            Object.defineProperty(_constructor.prototype, _constructor.prototype.deleteRenderData.name, {
                value: RenderInjectorTexture.deleteRenderData
            });
        }
        static useRenderData(_textureUnit = WebGL2RenderingContext.TEXTURE0) {
            let crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            if (!this.renderData)
                this.renderData = FudgeCore.RenderWebGL.assert(crc3.createTexture());
            crc3.activeTexture(_textureUnit);
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, this.renderData);
            if (this.textureDirty) {
                try {
                    crc3.pixelStorei(crc3.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
                    crc3.texImage2D(WebGL2RenderingContext.TEXTURE_2D, 0, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, this.texImageSource);
                    crc3.pixelStorei(crc3.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                    this.mipmapDirty = true;
                    this.textureDirty = false;
                }
                catch (_error) {
                    FudgeCore.Debug.error(_error);
                }
            }
            if (this.mipmapDirty) {
                switch (this.mipmap) {
                    case FudgeCore.MIPMAP.CRISP:
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.NEAREST);
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.NEAREST);
                        break;
                    case FudgeCore.MIPMAP.MEDIUM:
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.NEAREST);
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR);
                        crc3.generateMipmap(WebGL2RenderingContext.TEXTURE_2D);
                        break;
                    case FudgeCore.MIPMAP.BLURRY:
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.LINEAR);
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR);
                        crc3.generateMipmap(WebGL2RenderingContext.TEXTURE_2D);
                        break;
                    case FudgeCore.MIPMAP.SMOOTH:
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.LINEAR);
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR);
                }
                this.mipmapDirty = false;
            }
            if (this.wrapDirty) {
                switch (this.wrap) {
                    case FudgeCore.WRAP.REPEAT:
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_S, WebGL2RenderingContext.REPEAT);
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_T, WebGL2RenderingContext.REPEAT);
                        break;
                    case FudgeCore.WRAP.CLAMP:
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_S, WebGL2RenderingContext.CLAMP_TO_EDGE);
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_T, WebGL2RenderingContext.CLAMP_TO_EDGE);
                        break;
                    case FudgeCore.WRAP.MIRROR:
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_S, WebGL2RenderingContext.MIRRORED_REPEAT);
                        crc3.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_WRAP_T, WebGL2RenderingContext.MIRRORED_REPEAT);
                        break;
                }
                this.wrapDirty = false;
            }
        }
        static deleteRenderData() {
            if (!this.renderData)
                return;
            let crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
            crc3.deleteTexture(this.renderData);
            this.renderData = null;
            this.textureDirty = true;
            this.mipmapDirty = true;
            this.wrapDirty = true;
        }
    }
    FudgeCore.RenderInjectorTexture = RenderInjectorTexture;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let Node = (() => {
        var _a, _b, _c, _d;
        let _classSuper = FudgeCore.EventTargetUnified;
        let _staticExtraInitializers = [];
        let _static_resetRenderData_decorators;
        let _static_updateRenderbuffer_decorators;
        let _static_updateRenderData_decorators;
        let _static_useRenderData_decorators;
        return class Node extends _classSuper {
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                __esDecorate(this, null, _static_resetRenderData_decorators, { kind: "method", name: "resetRenderData", static: true, private: false, access: { has: obj => "resetRenderData" in obj, get: obj => obj.resetRenderData }, metadata: _metadata }, null, _staticExtraInitializers);
                __esDecorate(this, null, _static_updateRenderbuffer_decorators, { kind: "method", name: "updateRenderbuffer", static: true, private: false, access: { has: obj => "updateRenderbuffer" in obj, get: obj => obj.updateRenderbuffer }, metadata: _metadata }, null, _staticExtraInitializers);
                __esDecorate(this, null, _static_updateRenderData_decorators, { kind: "method", name: "updateRenderData", static: true, private: false, access: { has: obj => "updateRenderData" in obj, get: obj => obj.updateRenderData }, metadata: _metadata }, null, _staticExtraInitializers);
                __esDecorate(this, null, _static_useRenderData_decorators, { kind: "method", name: "useRenderData", static: true, private: false, access: { has: obj => "useRenderData" in obj, get: obj => obj.useRenderData }, metadata: _metadata }, null, _staticExtraInitializers);
                if (_metadata)
                    Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(this, _staticExtraInitializers);
            }
            #listeners;
            #captures;
            #mtxWorldInverseUpdated;
            #mtxWorldInverse;
            constructor(_name) {
                super();
                this.mtxWorld = FudgeCore.Matrix4x4.IDENTITY();
                this.timestampUpdate = 0;
                this.nNodesInBranch = 0;
                this.radius = 0;
                this.parent = null;
                this.children = [];
                this.components = {};
                this.active = true;
                this.#listeners = {};
                this.#captures = {};
                this.appendChild = this.addChild;
                this.name = _name;
            }
            static PATH_FROM_TO(_from, _to) {
                const from = _from instanceof FudgeCore.Component ? _from.node : _from;
                const to = _to instanceof FudgeCore.Component ? _to.node : _to;
                if (!from || !to)
                    return null;
                let pathFrom = from.getPath();
                let pathTo = to.getPath();
                let ancestor = null;
                while (pathFrom.length && pathTo.length && pathFrom[0] == pathTo[0]) {
                    ancestor = pathFrom.shift();
                    pathTo.shift();
                }
                pathTo.unshift(ancestor);
                if (!ancestor)
                    return null;
                let pathToAncestor = pathFrom.map(_node => "parent");
                let pathFromAncestor = pathTo
                    .flatMap((_node, _index, _array) => ["children", _node.findChild(_array[_index + 1]).toString()])
                    .slice(0, -2);
                if (_from instanceof FudgeCore.Component)
                    pathToAncestor.unshift("node");
                if (_to instanceof FudgeCore.Component)
                    pathFromAncestor.push("components", _to.type, to.components[_to.type].indexOf(_to).toString());
                return pathToAncestor.concat(pathFromAncestor).join("/");
            }
            static FIND(_from, _path) {
                if (_path == "")
                    return _from;
                let path = _path.split("/");
                let to = _from;
                while (path.length && to)
                    to = Reflect.get(to, path.shift());
                return to;
            }
            static resetRenderData() { }
            ;
            static updateRenderbuffer() { }
            ;
            static updateRenderData(_node, _cmpMesh, _cmpMaterial, _cmpFaceCamera, _cmpParticleSystem) { }
            ;
            static useRenderData(_node, _mtxWorldOverride) { }
            ;
            get isActive() {
                return this.active;
            }
            get cmpTransform() {
                return this.getComponent(FudgeCore.ComponentTransform);
            }
            get mtxLocal() {
                return this.cmpTransform?.mtxLocal;
            }
            get mtxWorldInverse() {
                if (this.#mtxWorldInverseUpdated != this.timestampUpdate)
                    this.#mtxWorldInverse = FudgeCore.Matrix4x4.INVERSE(this.mtxWorld);
                this.#mtxWorldInverseUpdated = this.timestampUpdate;
                return this.#mtxWorldInverse;
            }
            get nChildren() {
                return this.children.length;
            }
            *getIterator(_active = false) {
                if (!_active || this.isActive) {
                    yield this;
                    for (let child of this.children)
                        yield* child.getIterator(_active);
                }
            }
            [(_static_resetRenderData_decorators = [(_a = FudgeCore.RenderManagerNode).decorate.bind(_a)], _static_updateRenderbuffer_decorators = [(_b = FudgeCore.RenderManagerNode).decorate.bind(_b)], _static_updateRenderData_decorators = [(_c = FudgeCore.RenderManagerNode).decorate.bind(_c)], _static_useRenderData_decorators = [(_d = FudgeCore.RenderManagerNode).decorate.bind(_d)], Symbol.iterator)]() {
                return this.getIterator();
            }
            updateRenderData(_cmpMesh, _cmpMaterial, _cmpFaceCamera, _cmpParticleSystem) {
                Node.updateRenderData(this, _cmpMesh, _cmpMaterial, _cmpFaceCamera, _cmpParticleSystem);
            }
            ;
            useRenderData(_mtxWorldOverride) {
                Node.useRenderData(this, _mtxWorldOverride);
            }
            ;
            activate(_on) {
                this.active = _on;
                this.dispatchEvent(new Event(_on ? "nodeActivate" : "nodeDeactivate", { bubbles: true }));
                this.broadcastEvent(new Event(_on ? "nodeActivate" : "nodeDeactivate"));
            }
            getParent() {
                return this.parent;
            }
            getAncestor() {
                let ancestor = this;
                while (ancestor.getParent())
                    ancestor = ancestor.getParent();
                return ancestor;
            }
            getPath(_out = [], _offset = 0) {
                let ancestor = this;
                _out[_offset] = ancestor;
                while ((ancestor = ancestor.getParent()))
                    _out[++_offset] = ancestor;
                return _out.reverse();
            }
            getChild(_index) {
                return this.children[_index];
            }
            getChildren() {
                return this.children;
            }
            getChildByName(_name) {
                for (let i = 0; i < this.children.length; i++) {
                    if (this.children[i].name == _name)
                        return this.children[i];
                }
                return null;
            }
            getChildrenByName(_name) {
                let found = [];
                found = this.children.filter((_node) => _node.name == _name);
                return found;
            }
            getDescendantByName(_name) {
                for (let i = 0; i < this.children.length; i++) {
                    let child = this.children[i];
                    if (child.name == _name)
                        return child;
                    let descendant = child.getDescendantByName(_name);
                    if (descendant)
                        return descendant;
                }
                return null;
            }
            addChild(_child, _index) {
                if (this.children.includes(_child) && _index == undefined)
                    return;
                let inAudioGraph = false;
                let graphListened = FudgeCore.AudioManager.default.getGraphListeningTo();
                let ancestor = this;
                while (ancestor) {
                    ancestor.timestampUpdate = 0;
                    inAudioGraph = inAudioGraph || (ancestor == graphListened);
                    if (ancestor == _child)
                        throw (new Error("Cyclic reference prohibited in node hierarchy, ancestors must not be added as children"));
                    else
                        ancestor = ancestor.parent;
                }
                let previousParent = _child.parent;
                if (previousParent == this && _index > previousParent.findChild(_child))
                    _index--;
                if (previousParent)
                    previousParent.removeChild(_child);
                this.children.splice(_index ?? this.children.length, 0, _child);
                _child.parent = this;
                _child.dispatchEvent(new Event("childAppend", { bubbles: true }));
                if (inAudioGraph)
                    _child.broadcastEvent(new Event("childAppendToAudioGraph"));
            }
            removeChild(_child) {
                let found = this.findChild(_child);
                if (found < 0)
                    return;
                _child.dispatchEvent(new Event("childRemove", { bubbles: true }));
                _child.broadcastEvent(new Event("nodeDeactivate"));
                if (this.isDescendantOf(FudgeCore.AudioManager.default.getGraphListeningTo()))
                    _child.broadcastEvent(new Event("childRemoveFromAudioGraph"));
                this.children.splice(found, 1);
                _child.parent = null;
            }
            removeAllChildren() {
                while (this.children.length)
                    this.removeChild(this.children[0]);
            }
            findChild(_search) {
                return this.children.indexOf(_search);
            }
            replaceChild(_replace, _with) {
                let found = this.findChild(_replace);
                if (found < 0)
                    return false;
                _with.getParent()?.removeChild(_with);
                this.removeChild(_replace);
                this.addChild(_with, found);
                return true;
            }
            isUpdated(_timestampUpdate) {
                return (this.timestampUpdate == _timestampUpdate);
            }
            isDescendantOf(_ancestor) {
                let node = this;
                while (node && node != _ancestor)
                    node = node.parent;
                return (node != null);
            }
            applyAnimation(_mutator) {
                if (_mutator.components) {
                    for (const componentType in _mutator.components) {
                        let componentsOfType = this.components[componentType];
                        let mutatorsForType = _mutator.components[componentType];
                        for (let i = 0; i < componentsOfType.length; i++)
                            componentsOfType[i].mutate(mutatorsForType[i], null, false);
                    }
                }
                if (_mutator.children)
                    for (const childName in _mutator.children)
                        this.getChildByName(childName).applyAnimation(_mutator.children[childName]);
            }
            getAllComponents() {
                let all = [];
                for (let type in this.components) {
                    all = all.concat(this.components[type]);
                }
                return all;
            }
            getComponents(_class) {
                return (this.components[_class.name] ??= []);
            }
            getComponent(_class) {
                return this.components[_class.name]?.[0];
            }
            attach(_component) {
                this.addComponent(_component);
            }
            addComponent(_component) {
                if (_component.node == this)
                    return;
                let cmpList = this.components[_component.type];
                if (cmpList === undefined)
                    this.components[_component.type] = [_component];
                else if (cmpList.length && _component.isSingleton)
                    throw new Error(`Component ${_component.type} is marked singleton and can't be attached, no more than one allowed`);
                else
                    cmpList.push(_component);
                _component.attachToNode(this);
                _component.dispatchEvent(new Event("componentAdd"));
                this.dispatchEventToTargetOnly(new CustomEvent("componentAdd", { detail: _component }));
            }
            detach(_component) {
                this.removeComponent(_component);
            }
            removeComponents(_class) {
                for (const component of this.getComponents(_class))
                    this.removeComponent(component);
            }
            removeComponent(_component) {
                try {
                    let componentsOfType = this.components[_component.type];
                    let foundAt = componentsOfType.indexOf(_component);
                    if (foundAt < 0)
                        return;
                    _component.dispatchEvent(new Event("componentRemove"));
                    this.dispatchEventToTargetOnly(new CustomEvent("componentRemove", { detail: _component }));
                    componentsOfType.splice(foundAt, 1);
                    _component.attachToNode(null);
                }
                catch (_error) {
                    throw new Error(`Unable to remove component '${_component}'in node named '${this.name}'`);
                }
            }
            serialize() {
                let serialization = {
                    name: this.name,
                    active: this.active
                };
                let components = {};
                for (let type in this.components) {
                    if (this.components[type].length == 0)
                        continue;
                    components[type] = [];
                    for (let component of this.components[type]) {
                        components[type].push(FudgeCore.Serializer.serialize(component));
                    }
                }
                serialization["components"] = components;
                let children = [];
                for (let child of this.children) {
                    children.push(FudgeCore.Serializer.serialize(child));
                }
                serialization["children"] = children;
                this.dispatchEvent(new Event("nodeSerialized"));
                return serialization;
            }
            async deserialize(_serialization) {
                this.name = _serialization.name;
                for (let type in _serialization.components) {
                    for (let serializedComponent of _serialization.components[type]) {
                        let deserializedComponent = await FudgeCore.Serializer.deserialize(serializedComponent);
                        this.addComponent(deserializedComponent);
                    }
                }
                if (_serialization.children)
                    for (let serializedChild of _serialization.children) {
                        let deserializedChild = await FudgeCore.Serializer.deserialize(serializedChild);
                        this.appendChild(deserializedChild);
                    }
                this.dispatchEvent(new Event("nodeDeserialized"));
                for (let component of this.getAllComponents())
                    component.dispatchEvent(new Event("nodeDeserialized"));
                this.activate(_serialization.active);
                return this;
            }
            toString() {
                return this.name;
            }
            toHierarchyString(_node = null, _level = 0) {
                if (!_node)
                    _node = this;
                let prefix = "+".repeat(_level);
                let output = prefix + " " + _node.name + " | ";
                for (let type in _node.components)
                    output += _node.components[type].length + " " + type.split("Component").pop() + ", ";
                output = output.slice(0, -2) + "</br>";
                for (let child of _node.children) {
                    output += this.toHierarchyString(child, _level + 1);
                }
                return output;
            }
            addEventListener(_type, _handler, _capture = false) {
                const listListeners = _capture ? this.#captures : this.#listeners;
                const listenersForType = listListeners[_type] ??= new Set();
                listenersForType.add(_handler);
            }
            removeEventListener(_type, _handler, _capture = false) {
                const listenersForType = _capture ? this.#captures[_type] : this.#listeners[_type];
                if (!listenersForType)
                    return;
                listenersForType.delete(_handler);
            }
            dispatchEvent(_event) {
                if (_event instanceof FudgeCore.RecyclableEvent) {
                    _event.setTarget(this);
                    const path = _event.path;
                    path.length = 0;
                    this.getPath(path).reverse();
                    _event.setEventPhase(Event.CAPTURING_PHASE);
                    for (let i = path.length - 1; i >= 1; i--) {
                        let ancestor = path[i];
                        _event.setCurrentTarget(ancestor);
                        this.callListeners(ancestor.#captures[_event.type], _event);
                    }
                    _event.setEventPhase(Event.AT_TARGET);
                    _event.setCurrentTarget(this);
                    this.callListeners(this.#captures[_event.type], _event);
                    this.callListeners(this.#listeners[_event.type], _event);
                    if (!_event.bubbles)
                        return true;
                    _event.setEventPhase(Event.BUBBLING_PHASE);
                    for (let i = 1; i < path.length; i++) {
                        let ancestor = path[i];
                        _event.setCurrentTarget(ancestor);
                        this.callListeners(ancestor.#listeners[_event.type], _event);
                    }
                }
                else {
                    let ancestors = [];
                    let upcoming = this;
                    Object.defineProperty(_event, "target", { writable: true, value: this });
                    while (upcoming.parent)
                        ancestors.push(upcoming = upcoming.parent);
                    Object.defineProperty(_event, "path", { writable: true, value: new Array(this, ...ancestors) });
                    Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.CAPTURING_PHASE });
                    for (let i = ancestors.length - 1; i >= 0; i--) {
                        let ancestor = ancestors[i];
                        Object.defineProperty(_event, "currentTarget", { writable: true, value: ancestor });
                        this.callListeners(ancestor.#captures[_event.type], _event);
                    }
                    Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.AT_TARGET });
                    Object.defineProperty(_event, "currentTarget", { writable: true, value: this });
                    this.callListeners(this.#captures[_event.type], _event);
                    this.callListeners(this.#listeners[_event.type], _event);
                    if (!_event.bubbles)
                        return true;
                    Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.BUBBLING_PHASE });
                    for (let i = 0; i < ancestors.length; i++) {
                        let ancestor = ancestors[i];
                        Object.defineProperty(_event, "currentTarget", { writable: true, value: ancestor });
                        this.callListeners(ancestor.#listeners[_event.type], _event);
                    }
                }
                return true;
            }
            dispatchEventToTargetOnly(_event) {
                if (_event instanceof FudgeCore.RecyclableEvent) {
                    _event.setCurrentTarget(this);
                    _event.setEventPhase(Event.AT_TARGET);
                }
                else {
                    Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.AT_TARGET });
                    Object.defineProperty(_event, "currentTarget", { writable: true, value: this });
                }
                this.callListeners(this.#listeners[_event.type], _event);
                return true;
            }
            broadcastEvent(_event) {
                if (_event instanceof FudgeCore.RecyclableEvent) {
                    _event.setCurrentTarget(this);
                    _event.setEventPhase(Event.CAPTURING_PHASE);
                }
                else {
                    Object.defineProperty(_event, "eventPhase", { writable: true, value: Event.CAPTURING_PHASE });
                    Object.defineProperty(_event, "target", { writable: true, value: this });
                }
                this.broadcastEventRecursive(_event);
            }
            broadcastEventRecursive(_event) {
                if (_event instanceof FudgeCore.RecyclableEvent)
                    _event.setEventPhase(Event.CAPTURING_PHASE);
                else
                    Object.defineProperty(_event, "currentTarget", { writable: true, value: this });
                this.callListeners(this.#captures[_event.type], _event);
                for (let child of this.children) {
                    child.broadcastEventRecursive(_event);
                }
            }
            callListeners(_listeners, _event) {
                if (!_listeners || _listeners.size == 0)
                    return;
                for (const handler of _listeners) {
                    handler(_event);
                }
            }
        };
    })();
    FudgeCore.Node = Node;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Component extends FudgeCore.Mutable {
        static { this.baseClass = Component; }
        static { this.subclasses = []; }
        #node;
        constructor() {
            super();
            this.singleton = true;
            this.active = true;
            this.#node = null;
            this.addEventListener("mutate", (_event) => {
                if (this.#node) {
                    _event.detail.component = this;
                    _event.detail.componentIndex = this.node.getComponents(this.constructor).indexOf(this);
                    this.#node.dispatchEvent(_event);
                }
            });
        }
        static registerSubclass(_subclass) { return Component.subclasses.push(_subclass) - 1; }
        get isActive() {
            return this.active;
        }
        get isSingleton() {
            return this.singleton;
        }
        get node() {
            return this.#node;
        }
        activate(_on) {
            this.active = _on;
            const event = FudgeCore.RecyclableEvent.get(_on ? "componentActivate" : "componentDeactivate");
            this.dispatchEvent(event);
            FudgeCore.RecyclableEvent.store(event);
        }
        attachToNode(_container) {
            if (this.#node == _container)
                return;
            let previousContainer = this.#node;
            try {
                if (previousContainer)
                    previousContainer.removeComponent(this);
                this.#node = _container;
                if (this.#node)
                    this.#node.addComponent(this);
            }
            catch (_error) {
                this.#node = previousContainer;
            }
        }
        serialize() {
            let serialization = {
                active: this.active
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.activate(_serialization.active);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            await super.mutate(_mutator, _selection, _dispatchMutate);
            if (_mutator.active != undefined)
                this.activate(_mutator.active);
        }
        mutateSync(_mutator, _dispatchMutate = true) {
            super.mutateSync(_mutator, _dispatchMutate);
            if (_mutator.active != undefined)
                this.activate(_mutator.active);
        }
        reduceMutator(_mutator) {
            delete _mutator.singleton;
            delete _mutator.mtxWorld;
        }
    }
    FudgeCore.Component = Component;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RecycableArray {
        #length = 0;
        #array = new Array();
        get length() {
            return this.#length;
        }
        reset() {
            this.#length = 0;
        }
        recycle() {
            this.reset();
        }
        push(_entry) {
            this.#array[this.#length] = _entry;
            this.#length++;
            return this.#length;
        }
        pop() {
            if (this.#length == 0)
                return undefined;
            this.#length--;
            return this.#array[this.#length];
        }
        *[Symbol.iterator]() {
            for (let i = 0; i < this.#length; i++)
                yield this.#array[i];
        }
        getSorted(_sort) {
            let sorted = this.#array.slice(0, this.#length);
            sorted.sort(_sort);
            return sorted;
        }
    }
    FudgeCore.RecycableArray = RecycableArray;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class EventPhysics extends Event {
        constructor(_type, _hitRigidbody, _normalImpulse, _tangentImpulse, _binormalImpulse, _collisionPoint = null, _collisionNormal = null) {
            super(_type);
            this.cmpRigidbody = _hitRigidbody;
            this.normalImpulse = _normalImpulse;
            this.tangentImpulse = _tangentImpulse;
            this.binomalImpulse = _binormalImpulse;
            this.collisionPoint = _collisionPoint;
            this.collisionNormal = _collisionNormal;
        }
    }
    FudgeCore.EventPhysics = EventPhysics;
    let COLLISION_GROUP;
    (function (COLLISION_GROUP) {
        COLLISION_GROUP[COLLISION_GROUP["DEFAULT"] = 1] = "DEFAULT";
        COLLISION_GROUP[COLLISION_GROUP["GROUP_1"] = 2] = "GROUP_1";
        COLLISION_GROUP[COLLISION_GROUP["GROUP_2"] = 4] = "GROUP_2";
        COLLISION_GROUP[COLLISION_GROUP["GROUP_3"] = 8] = "GROUP_3";
        COLLISION_GROUP[COLLISION_GROUP["GROUP_4"] = 16] = "GROUP_4";
        COLLISION_GROUP[COLLISION_GROUP["GROUP_5"] = 32] = "GROUP_5";
    })(COLLISION_GROUP = FudgeCore.COLLISION_GROUP || (FudgeCore.COLLISION_GROUP = {}));
    let BODY_TYPE;
    (function (BODY_TYPE) {
        BODY_TYPE[BODY_TYPE["DYNAMIC"] = 0] = "DYNAMIC";
        BODY_TYPE[BODY_TYPE["STATIC"] = 1] = "STATIC";
        BODY_TYPE[BODY_TYPE["KINEMATIC"] = 2] = "KINEMATIC";
    })(BODY_TYPE = FudgeCore.BODY_TYPE || (FudgeCore.BODY_TYPE = {}));
    let COLLIDER_TYPE;
    (function (COLLIDER_TYPE) {
        COLLIDER_TYPE[COLLIDER_TYPE["CUBE"] = 0] = "CUBE";
        COLLIDER_TYPE[COLLIDER_TYPE["SPHERE"] = 1] = "SPHERE";
        COLLIDER_TYPE[COLLIDER_TYPE["CAPSULE"] = 2] = "CAPSULE";
        COLLIDER_TYPE[COLLIDER_TYPE["CYLINDER"] = 3] = "CYLINDER";
        COLLIDER_TYPE[COLLIDER_TYPE["CONE"] = 4] = "CONE";
        COLLIDER_TYPE[COLLIDER_TYPE["PYRAMID"] = 5] = "PYRAMID";
        COLLIDER_TYPE[COLLIDER_TYPE["CONVEX"] = 6] = "CONVEX";
    })(COLLIDER_TYPE = FudgeCore.COLLIDER_TYPE || (FudgeCore.COLLIDER_TYPE = {}));
    let PHYSICS_DEBUGMODE;
    (function (PHYSICS_DEBUGMODE) {
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["NONE"] = 0] = "NONE";
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["COLLIDERS"] = 1] = "COLLIDERS";
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["JOINTS_AND_COLLIDER"] = 2] = "JOINTS_AND_COLLIDER";
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["BOUNDING_BOXES"] = 3] = "BOUNDING_BOXES";
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["CONTACTS"] = 4] = "CONTACTS";
        PHYSICS_DEBUGMODE[PHYSICS_DEBUGMODE["PHYSIC_OBJECTS_ONLY"] = 5] = "PHYSIC_OBJECTS_ONLY";
    })(PHYSICS_DEBUGMODE = FudgeCore.PHYSICS_DEBUGMODE || (FudgeCore.PHYSICS_DEBUGMODE = {}));
    class RayHitInfo {
        constructor() {
            this.hitPoint = FudgeCore.Vector3.ZERO();
            this.hitNormal = FudgeCore.Vector3.ZERO();
            this.rayEnd = FudgeCore.Vector3.ZERO();
            this.rayOrigin = FudgeCore.Vector3.ZERO();
            this.recycle();
        }
        recycle() {
            this.hit = false;
            this.hitDistance = 0;
            this.hitPoint.recycle();
            this.rigidbodyComponent = null;
            this.hitNormal.recycle();
            this.rayOrigin.recycle();
            this.rayEnd.recycle();
        }
    }
    FudgeCore.RayHitInfo = RayHitInfo;
    class PhysicsSettings {
        constructor(_defaultCollisionGroup, _defaultCollisionMask) {
            if (typeof OIMO == "undefined")
                return;
            this.defaultCollisionGroup = _defaultCollisionGroup;
            this.defaultCollisionMask = _defaultCollisionMask;
        }
        get disableSleeping() {
            return OIMO.Setting.disableSleeping;
        }
        set disableSleeping(_value) {
            OIMO.Setting.disableSleeping = _value;
        }
        get sleepingVelocityThreshold() {
            return OIMO.Setting.sleepingVelocityThreshold;
        }
        set sleepingVelocityThreshold(_value) {
            OIMO.Setting.sleepingVelocityThreshold = _value;
        }
        get sleepingAngularVelocityThreshold() {
            return OIMO.Setting.sleepingAngularVelocityThreshold;
        }
        set sleepingAngularVelocityThreshold(_value) {
            OIMO.Setting.sleepingAngularVelocityThreshold = _value;
        }
        get sleepingTimeThreshold() {
            return OIMO.Setting.sleepingTimeThreshold;
        }
        set sleepingTimeThreshold(_value) {
            OIMO.Setting.sleepingTimeThreshold = _value;
        }
        get defaultCollisionMargin() {
            return OIMO.Setting.defaultGJKMargin;
        }
        set defaultCollisionMargin(_thickness) {
            OIMO.Setting.defaultGJKMargin = _thickness;
        }
        get defaultFriction() {
            return OIMO.Setting.defaultFriction;
        }
        set defaultFriction(_value) {
            OIMO.Setting.defaultFriction = _value;
        }
        get defaultRestitution() {
            return OIMO.Setting.defaultRestitution;
        }
        set defaultRestitution(_value) {
            OIMO.Setting.defaultRestitution = _value;
        }
        get defaultCollisionMask() {
            return OIMO.Setting.defaultCollisionMask;
        }
        set defaultCollisionMask(_value) {
            OIMO.Setting.defaultCollisionMask = _value;
        }
        get defaultCollisionGroup() {
            return OIMO.Setting.defaultCollisionGroup;
        }
        set defaultCollisionGroup(_value) {
            OIMO.Setting.defaultCollisionGroup = _value;
        }
        get defaultConstraintSolverType() {
            return OIMO.Setting.defaultJointConstraintSolverType;
        }
        set defaultConstraintSolverType(_value) {
            OIMO.Setting.defaultJointConstraintSolverType = _value;
        }
        get defaultCorrectionAlgorithm() {
            return OIMO.Setting.defaultJointPositionCorrectionAlgorithm;
        }
        set defaultCorrectionAlgorithm(_value) {
            OIMO.Setting.defaultJointPositionCorrectionAlgorithm = _value;
        }
        get solverIterations() {
            return FudgeCore.Physics.activeInstance.getOimoWorld().getNumPositionIterations();
        }
        set solverIterations(_value) {
            FudgeCore.Physics.activeInstance.getOimoWorld().setNumPositionIterations(_value);
            FudgeCore.Physics.activeInstance.getOimoWorld().setNumVelocityIterations(_value);
        }
    }
    FudgeCore.PhysicsSettings = PhysicsSettings;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Joint extends FudgeCore.Component {
        static { this.baseClass = Joint; }
        static { this.subclasses = []; }
        #idBodyAnchor;
        #idBodyTied;
        #bodyAnchor;
        #bodyTied;
        #connected;
        #anchor;
        #internalCollision;
        #breakForce;
        #breakTorque;
        #nameChildToConnect;
        constructor(_bodyAnchor = null, _bodyTied = null) {
            super();
            this.singleton = false;
            this.#idBodyAnchor = 0;
            this.#idBodyTied = 0;
            this.#connected = false;
            this.#internalCollision = false;
            this.#breakForce = 0;
            this.#breakTorque = 0;
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd":
                        this.node.addEventListener("disconnectJoint", () => { this.disconnect(); this.dirtyStatus(); }, true);
                        this.dirtyStatus();
                        break;
                    case "componentRemove":
                        this.node.removeEventListener("disconnectJoint", () => { this.disconnect(); this.dirtyStatus(); }, true);
                        this.removeJoint();
                        break;
                }
            };
            this.#getMutator = () => {
                let mutator = {
                    nameChildToConnect: this.#nameChildToConnect,
                    internalCollision: this.#internalCollision,
                    breakForce: this.#breakForce,
                    breakTorque: this.#breakTorque
                };
                return mutator;
            };
            this.#mutate = (_mutator) => {
                this.mutateBase(_mutator, ["internalCollision", "breakForce", "breakTorque"]);
            };
            this.bodyAnchor = _bodyAnchor;
            this.bodyTied = _bodyTied;
            this.addEventListener("componentAdd", this.hndEvent);
            this.addEventListener("componentRemove", this.hndEvent);
        }
        static registerSubclass(_subclass) { return Joint.subclasses.push(_subclass) - 1; }
        get bodyAnchor() {
            return this.#bodyAnchor;
        }
        set bodyAnchor(_cmpRB) {
            this.#idBodyAnchor = _cmpRB != null ? _cmpRB.id : -1;
            this.#bodyAnchor = _cmpRB;
            this.disconnect();
            this.dirtyStatus();
        }
        get bodyTied() {
            return this.#bodyTied;
        }
        set bodyTied(_cmpRB) {
            this.#idBodyTied = _cmpRB != null ? _cmpRB.id : -1;
            this.#bodyTied = _cmpRB;
            this.disconnect();
            this.dirtyStatus();
        }
        get anchor() {
            return new FudgeCore.Vector3(this.#anchor.x, this.#anchor.y, this.#anchor.z);
        }
        set anchor(_value) {
            this.#anchor = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        get breakTorque() {
            return this.#breakTorque;
        }
        set breakTorque(_value) {
            this.#breakTorque = _value;
            if (this.joint != null)
                this.joint.setBreakTorque(this.#breakTorque);
        }
        get breakForce() {
            return this.#breakForce;
        }
        set breakForce(_value) {
            this.#breakForce = _value;
            if (this.joint != null)
                this.joint.setBreakForce(this.#breakForce);
        }
        get internalCollision() {
            return this.#internalCollision;
        }
        set internalCollision(_value) {
            this.#internalCollision = _value;
            if (this.joint != null)
                this.joint.setAllowCollision(this.#internalCollision);
        }
        connectChild(_name) {
            this.#nameChildToConnect = _name;
            if (!this.node)
                return;
            let children = this.node.getChildrenByName(_name);
            if (children.length == 1)
                this.connectNode(children.pop());
            else
                FudgeCore.Debug.warn(`${this.constructor.name} at ${this.node.name} fails to connect child with non existent or ambigous name ${_name}`);
        }
        connectNode(_node) {
            if (!_node || !this.node)
                return;
            FudgeCore.Debug.fudge(`${this.constructor.name} connected ${this.node.name} and ${_node.name}`);
            let connectBody = _node.getComponent(FudgeCore.ComponentRigidbody);
            let thisBody = this.node.getComponent(FudgeCore.ComponentRigidbody);
            if (!connectBody || !thisBody) {
                FudgeCore.Debug.warn(`${this.constructor.name} at ${this.node.name} fails due to missing rigidbodies on ${this.node.name} or ${_node.name}`);
                return;
            }
            this.bodyAnchor = thisBody;
            this.bodyTied = connectBody;
        }
        isConnected() {
            return this.#connected;
        }
        connect() {
            if (this.#connected == false) {
                if (this.#idBodyAnchor == -1 || this.#idBodyTied == -1) {
                    if (this.#nameChildToConnect)
                        this.connectChild(this.#nameChildToConnect);
                    return;
                }
                this.constructJoint();
                this.#connected = true;
                this.addJoint();
            }
        }
        disconnect() {
            if (this.#connected == true) {
                this.removeJoint();
                this.#connected = false;
            }
        }
        getOimoJoint() {
            return this.joint;
        }
        serialize() {
            let serialization = this.#getMutator();
            serialization.anchor = this.anchor.serialize();
            serialization[super.constructor.name] = super.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            this.anchor = await new FudgeCore.Vector3().deserialize(_serialization.anchor);
            this.#mutate(_serialization);
            await super.deserialize(_serialization[super.constructor.name]);
            this.connectChild(_serialization.nameChildToConnect);
            return this;
        }
        getMutator() {
            let mutator = super.getMutator(true);
            Object.assign(mutator, this.#getMutator());
            mutator.anchor = this.anchor.getMutator();
            return mutator;
        }
        getMutatorAttributeTypes(_mutator) {
            let types = super.getMutatorAttributeTypes(_mutator);
            types.nameChildToConnect = "String";
            return types;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            if (typeof (_mutator.anchor) !== "undefined")
                this.anchor = new FudgeCore.Vector3(...(Object.values(_mutator.anchor)));
            delete _mutator.anchor;
            if (typeof (_mutator.nameChildToConnect) !== "undefined")
                this.connectChild(_mutator.nameChildToConnect);
            this.#mutate(_mutator);
            this.deleteFromMutator(_mutator, this.#getMutator());
            await super.mutate(_mutator, _selection, _dispatchMutate);
        }
        reduceMutator(_mutator) {
            delete _mutator.springDamper;
            delete _mutator.joint;
            delete _mutator.motor;
            super.reduceMutator(_mutator);
        }
        dirtyStatus() {
            FudgeCore.Physics.changeJointStatus(this);
        }
        addJoint() {
            FudgeCore.Physics.addJoint(this);
        }
        removeJoint() {
            FudgeCore.Physics.removeJoint(this);
        }
        constructJoint(..._configParams) {
            let posBodyAnchor = this.bodyAnchor.node.mtxWorld.translation;
            let worldAnchor = new OIMO.Vec3(posBodyAnchor.x + this.#anchor.x, posBodyAnchor.y + this.#anchor.y, posBodyAnchor.z + this.#anchor.z);
            this.config.init(this.#bodyAnchor.getOimoRigidbody(), this.#bodyTied.getOimoRigidbody(), worldAnchor, ..._configParams);
        }
        configureJoint() {
            this.joint.setBreakForce(this.breakForce);
            this.joint.setBreakTorque(this.breakTorque);
            this.joint.setAllowCollision(this.#internalCollision);
        }
        deleteFromMutator(_mutator, _delete) {
            for (let key in _delete)
                delete _mutator[key];
        }
        #getMutator;
        #mutate;
    }
    FudgeCore.Joint = Joint;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class JointAxial extends FudgeCore.Joint {
        #maxMotor = 10;
        #minMotor = -10;
        #motorSpeed = 0;
        #axis;
        #springFrequency = 0;
        #springDamping = 0;
        constructor(_bodyAnchor = null, _bodyTied = null, _axis = new FudgeCore.Vector3(0, 1, 0), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_bodyAnchor, _bodyTied);
            this.axis = _axis;
            this.anchor = _localAnchor;
            this.minMotor = -10;
            this.maxMotor = 10;
        }
        get axis() {
            return new FudgeCore.Vector3(this.#axis.x, this.#axis.y, this.#axis.z);
        }
        set axis(_value) {
            this.#axis = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        get maxMotor() {
            return this.#maxMotor;
        }
        set maxMotor(_value) {
            this.#maxMotor = _value;
            try {
                this.joint.getLimitMotor().upperLimit = _value;
            }
            catch (_e) { }
        }
        get minMotor() {
            return this.#minMotor;
        }
        set minMotor(_value) {
            this.#minMotor = _value;
            try {
                this.joint.getLimitMotor().lowerLimit = _value;
            }
            catch (_e) { }
        }
        get springDamping() {
            return this.#springDamping;
        }
        set springDamping(_value) {
            this.#springDamping = _value;
            try {
                this.joint.getSpringDamper().dampingRatio = _value;
            }
            catch (_e) { }
        }
        get motorSpeed() {
            return this.#motorSpeed;
        }
        set motorSpeed(_value) {
            this.#motorSpeed = _value;
            try {
                this.joint.getLimitMotor().motorSpeed = _value;
            }
            catch (_e) { }
        }
        get springFrequency() {
            return this.#springFrequency;
        }
        set springFrequency(_value) {
            this.#springFrequency = _value;
            try {
                this.joint.getSpringDamper().frequency = _value;
            }
            catch (_e) { }
        }
        serialize() {
            let serialization = this.#getMutator();
            serialization.axis = this.axis.serialize();
            serialization[super.constructor.name] = super.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            this.axis = await new FudgeCore.Vector3().deserialize(_serialization.axis);
            this.#mutate(_serialization);
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            if (typeof (_mutator.axis) !== "undefined")
                this.axis = new FudgeCore.Vector3(...(Object.values(_mutator.axis)));
            delete _mutator.axis;
            this.#mutate(_mutator);
            this.deleteFromMutator(_mutator, this.#getMutator());
            await super.mutate(_mutator, _selection, _dispatchMutate);
        }
        getMutator() {
            let mutator = super.getMutator();
            mutator.axis = this.axis.getMutator();
            Object.assign(mutator, this.#getMutator());
            return mutator;
        }
        constructJoint() {
            this.springDamper = new OIMO.SpringDamper().setSpring(this.#springFrequency, this.#springDamping);
            super.constructJoint(this.#axis);
        }
        #getMutator = () => {
            let mutator = {
                springDamping: this.#springDamping,
                springFrequency: this.#springFrequency,
                maxMotor: this.#maxMotor,
                minMotor: this.#minMotor,
                motorSpeed: this.#motorSpeed
            };
            return mutator;
        };
        #mutate = (_mutator) => {
            this.mutateBase(_mutator, ["springDamping", "springFrequency", "maxMotor", "minMotor", "motorSpeed"]);
        };
    }
    FudgeCore.JointAxial = JointAxial;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let MODE;
    (function (MODE) {
        MODE[MODE["EDITOR"] = 0] = "EDITOR";
        MODE[MODE["RUNTIME"] = 1] = "RUNTIME";
    })(MODE = FudgeCore.MODE || (FudgeCore.MODE = {}));
    let RESOURCE_STATUS;
    (function (RESOURCE_STATUS) {
        RESOURCE_STATUS[RESOURCE_STATUS["PENDING"] = 0] = "PENDING";
        RESOURCE_STATUS[RESOURCE_STATUS["READY"] = 1] = "READY";
        RESOURCE_STATUS[RESOURCE_STATUS["ERROR"] = 2] = "ERROR";
    })(RESOURCE_STATUS = FudgeCore.RESOURCE_STATUS || (FudgeCore.RESOURCE_STATUS = {}));
    class Project extends FudgeCore.EventTargetStatic {
        static { this.resources = {}; }
        static { this.serialization = {}; }
        static { this.scriptNamespaces = {}; }
        static { this.baseURL = new URL(location.toString()); }
        static { this.mode = MODE.RUNTIME; }
        static { this.graphInstancesToResync = {}; }
        static register(_resource, _idResource) {
            if (_resource.idResource && _resource.idResource == _idResource)
                return;
            if (_resource.idResource)
                this.deregister(_resource);
            if (_idResource) {
                _resource.idResource = _idResource;
                this.deregister(_resource);
            }
            if (!_resource.idResource)
                _resource.idResource = Project.generateId(_resource);
            Project.resources[_resource.idResource] = _resource;
            if (_resource instanceof FudgeCore.Graph)
                _resource.addEventListener("graphMutated", (_event) => this.dispatchEvent(new CustomEvent("graphMutated", { detail: _resource })));
        }
        static deregister(_resource) {
            delete (Project.resources[_resource.idResource]);
            delete (Project.serialization[_resource.idResource]);
        }
        static clear() {
            Project.resources = {};
            Project.serialization = {};
            Project.clearScriptNamespaces();
        }
        static getResourcesByType(_type) {
            let found = [];
            for (let resourceId in Project.resources) {
                let resource = Project.resources[resourceId];
                if (resource instanceof _type)
                    found.push(resource);
            }
            return found;
        }
        static getResourcesByName(_name) {
            let found = [];
            for (let resourceId in Project.resources) {
                let resource = Project.resources[resourceId];
                if (resource.name == _name)
                    found.push(resource);
            }
            return found;
        }
        static generateId(_resource) {
            let idResource;
            do
                idResource = _resource.constructor.name + "|" + new Date().toISOString() + "|" + Math.random().toPrecision(5).substr(2, 5);
            while (Project.resources[idResource]);
            return idResource;
        }
        static isResource(_object) {
            return (Reflect.has(_object, "idResource"));
        }
        static async getResource(_idResource) {
            let resource = Project.resources[_idResource];
            if (!resource) {
                let serialization = Project.serialization[_idResource];
                if (!serialization) {
                    FudgeCore.Debug.error("Resource not found", _idResource);
                    return null;
                }
                resource = await Project.deserializeResource(serialization);
            }
            return resource;
        }
        static async cloneResource(_resource) {
            if (!_resource)
                return null;
            let serialization = FudgeCore.Serializer.serialize(_resource);
            let type = Reflect.ownKeys(serialization)[0];
            delete (serialization[type].idResource);
            let clone = await Project.deserializeResource(serialization);
            Project.register(clone);
            clone.name += "_clone";
            return clone;
        }
        static async registerAsGraph(_node, _replaceWithInstance = true) {
            let serialization = _node.serialize();
            let graph = new FudgeCore.Graph(_node.name);
            await graph.deserialize(serialization);
            Project.register(graph);
            if (_replaceWithInstance && _node.getParent()) {
                let instance = await Project.createGraphInstance(graph);
                _node.getParent().replaceChild(_node, instance);
            }
            return graph;
        }
        static async createGraphInstance(_graph) {
            let instance = new FudgeCore.GraphInstance(_graph);
            await instance.connectToGraph();
            return instance;
        }
        static registerGraphInstanceForResync(_instance) {
            let instances = Project.graphInstancesToResync[_instance.idSource] || [];
            instances.push(_instance);
            Project.graphInstancesToResync[_instance.idSource] = instances;
        }
        static async resyncGraphInstances(_graph) {
            let instances = Project.graphInstancesToResync[_graph.idResource];
            if (!instances)
                return;
            for (let instance of instances)
                await instance.connectToGraph();
            delete (Project.graphInstancesToResync[_graph.idResource]);
        }
        static registerScriptNamespace(_namespace) {
            let name = FudgeCore.Serializer.registerNamespace(_namespace);
            if (!Project.scriptNamespaces[name])
                Project.scriptNamespaces[name] = _namespace;
        }
        static clearScriptNamespaces() {
            for (let name in Project.scriptNamespaces) {
                Reflect.set(window, name, undefined);
                Project.scriptNamespaces[name] = undefined;
                delete Project.scriptNamespaces[name];
            }
        }
        static getComponentScripts() {
            let compoments = {};
            for (let namespace in Project.scriptNamespaces) {
                compoments[namespace] = [];
                for (let name in Project.scriptNamespaces[namespace]) {
                    let script = Reflect.get(Project.scriptNamespaces[namespace], name);
                    try {
                        let o = Object.create(script);
                        if (o.prototype instanceof FudgeCore.ComponentScript)
                            compoments[namespace].push(script);
                    }
                    catch (_e) { }
                }
            }
            return compoments;
        }
        static async loadScript(_url) {
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.async = false;
            let head = document.head;
            head.appendChild(script);
            FudgeCore.Debug.log("Loading: ", _url);
            return new Promise((_resolve, _reject) => {
                script.addEventListener("load", () => _resolve());
                script.addEventListener("error", () => {
                    FudgeCore.Debug.error("Loading script", _url);
                    _reject();
                });
                script.src = _url.toString();
            });
        }
        static async loadResources(_url) {
            const response = await fetch(_url);
            const resourceFileContent = await response.text();
            let serialization = FudgeCore.Serializer.parse(resourceFileContent);
            let reconstruction = await Project.deserialize(serialization);
            Project.dispatchEvent(new CustomEvent("resourcesLoaded", { detail: { url: _url, resources: reconstruction } }));
            return reconstruction;
        }
        static async loadResourcesFromHTML() {
            const head = document.head;
            let links = head.querySelectorAll("link[type=resources]");
            for (let link of links) {
                let url = link.getAttribute("src");
                await Project.loadResources(url);
            }
        }
        static serialize() {
            let serialization = {};
            for (let idResource in Project.resources) {
                let resource = Project.resources[idResource];
                if (idResource != resource.idResource)
                    FudgeCore.Debug.error("Resource-id mismatch", resource);
                serialization[idResource] = FudgeCore.Serializer.serialize(resource);
            }
            return serialization;
        }
        static async deserialize(_serialization) {
            Project.serialization = _serialization;
            Project.resources = {};
            for (let idResource in _serialization) {
                let serialization = _serialization[idResource];
                let resource = await Project.deserializeResource(serialization);
                if (resource)
                    Project.resources[idResource] = resource;
            }
            return Project.resources;
        }
        static async deserializeResource(_serialization) {
            return FudgeCore.Serializer.deserialize(_serialization);
        }
    }
    FudgeCore.Project = Project;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let MIPMAP;
    (function (MIPMAP) {
        MIPMAP[MIPMAP["CRISP"] = 0] = "CRISP";
        MIPMAP[MIPMAP["MEDIUM"] = 1] = "MEDIUM";
        MIPMAP[MIPMAP["BLURRY"] = 2] = "BLURRY";
        MIPMAP[MIPMAP["SMOOTH"] = 3] = "SMOOTH";
    })(MIPMAP = FudgeCore.MIPMAP || (FudgeCore.MIPMAP = {}));
    let WRAP;
    (function (WRAP) {
        WRAP[WRAP["REPEAT"] = 0] = "REPEAT";
        WRAP[WRAP["CLAMP"] = 1] = "CLAMP";
        WRAP[WRAP["MIRROR"] = 2] = "MIRROR";
    })(WRAP = FudgeCore.WRAP || (FudgeCore.WRAP = {}));
    let Texture = (() => {
        var _a;
        let _classDecorators = [(_a = FudgeCore.RenderInjectorTexture).decorate.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.Mutable;
        var Texture = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                Texture = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            #mipmap;
            #wrap;
            constructor(_name = "Texture") {
                super();
                this.idResource = undefined;
                this.textureDirty = true;
                this.mipmapDirty = true;
                this.wrapDirty = true;
                this.#mipmap = MIPMAP.CRISP;
                this.#wrap = WRAP.REPEAT;
                this.name = _name;
            }
            get isSerializableResource() {
                return true;
            }
            set mipmap(_mipmap) {
                this.#mipmap = _mipmap;
                this.mipmapDirty = true;
            }
            get mipmap() {
                return this.#mipmap;
            }
            set wrap(_wrap) {
                this.#wrap = _wrap;
                this.wrapDirty = true;
            }
            get wrap() {
                return this.#wrap;
            }
            useRenderData(_textureUnit = 0) { }
            deleteRenderData() { }
            refresh() {
                this.textureDirty = true;
            }
            serialize() {
                let serialization = {
                    idResource: this.idResource,
                    name: this.name,
                    mipmap: MIPMAP[this.#mipmap],
                    wrap: WRAP[this.#wrap]
                };
                return serialization;
            }
            async deserialize(_serialization) {
                FudgeCore.Project.register(this, _serialization.idResource);
                this.name = _serialization.name;
                this.#mipmap = MIPMAP[_serialization.mipmap];
                this.#wrap = WRAP[_serialization.wrap];
                return this;
            }
            getMutator(_extendable) {
                let mutator = super.getMutator(true);
                mutator.mipmap = this.#mipmap;
                mutator.wrap = this.#wrap;
                return mutator;
            }
            getMutatorAttributeTypes(_mutator) {
                let types = super.getMutatorAttributeTypes(_mutator);
                if (types.mipmap)
                    types.mipmap = MIPMAP;
                if (types.wrap)
                    types.wrap = WRAP;
                return types;
            }
            reduceMutator(_mutator) {
                delete _mutator.idResource;
                delete _mutator.renderData;
                delete _mutator.textureDirty;
                delete _mutator.mipmapDirty;
                delete _mutator.mipmapGenerated;
                delete _mutator.wrapDirty;
            }
        };
        return Texture = _classThis;
    })();
    FudgeCore.Texture = Texture;
    class TextureImage extends Texture {
        constructor(_url) {
            super();
            this.image = null;
            if (_url) {
                this.load(_url);
                this.name = _url.toString().split("/").pop();
            }
            FudgeCore.Project.register(this);
        }
        get texImageSource() {
            return this.image;
        }
        async load(_url) {
            this.url = _url;
            this.image = new Image();
            return new Promise((_resolve, _reject) => {
                this.image.addEventListener("load", () => {
                    this.renderData = null;
                    _resolve();
                });
                this.image.addEventListener("error", () => _reject());
                this.image.src = new URL(this.url.toString(), FudgeCore.Project.baseURL).toString();
            });
        }
        serialize() {
            return {
                url: this.url,
                type: this.type,
                [super.constructor.name]: super.serialize()
            };
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization[super.constructor.name]);
            await this.load(_serialization.url);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            if (_mutator.url && _mutator.url != this.url.toString())
                await this.load(_mutator.url);
            delete (_mutator.url);
            await super.mutate(_mutator, _selection, _dispatchMutate);
        }
    }
    FudgeCore.TextureImage = TextureImage;
    class TextureBase64 extends Texture {
        constructor(_name, _base64, _mipmap = MIPMAP.CRISP, _wrap = WRAP.REPEAT, _width, _height) {
            super(_name);
            this.image = new Image();
            this.image.src = _base64;
            this.mipmap = _mipmap;
            this.wrap = _wrap;
            if (_width)
                this.image.width = _width;
            if (_height)
                this.image.height = _height;
        }
        get texImageSource() {
            return this.image;
        }
    }
    FudgeCore.TextureBase64 = TextureBase64;
    class TextureCanvas extends Texture {
        constructor(_name, _crc2) {
            super(_name);
            this.crc2 = _crc2;
        }
        get texImageSource() {
            return this.crc2.canvas;
        }
    }
    FudgeCore.TextureCanvas = TextureCanvas;
    class TextureText extends Texture {
        #text;
        #font;
        constructor(_name, _text = "Text", _font = "20px monospace") {
            super(_name);
            this.crc2 = document.createElement("canvas").getContext("2d");
            this.text = _text;
            this.font = _font;
        }
        set text(_text) {
            this.#text = _text;
            this.textureDirty = true;
        }
        get text() {
            return this.#text;
        }
        set font(_font) {
            this.#font = _font;
            document.fonts.load(this.#font)
                .catch((_error) => FudgeCore.Debug.error(`${TextureText.name}: ${_error}`))
                .finally(() => this.textureDirty = true);
        }
        get font() {
            return this.#font;
        }
        get texImageSource() {
            return this.canvas;
        }
        get width() {
            return this.canvas.width;
        }
        get height() {
            return this.canvas.height;
        }
        get hasTransparency() {
            return true;
        }
        get canvas() {
            return this.crc2.canvas;
        }
        useRenderData(_textureUnit) {
            if (this.textureDirty) {
                this.crc2.font = this.font;
                let metrics = this.crc2.measureText(this.text);
                let width = metrics.width;
                let height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
                this.canvas.width = width + this.crc2.measureText("  ").width;
                this.canvas.height = height * 1.1;
                if (this.canvas.width == 0)
                    return;
                this.crc2.font = this.font;
                this.crc2.textAlign = "center";
                this.crc2.textBaseline = "middle";
                this.crc2.fillStyle = "white";
                this.crc2.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.crc2.fillText(this.#text, this.canvas.width / 2, this.canvas.height / 2);
            }
            super.useRenderData(_textureUnit);
        }
        serialize() {
            return {
                [super.constructor.name]: super.serialize(),
                text: this.text,
                font: this.font
            };
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization[super.constructor.name]);
            this.text = _serialization.text;
            this.font = _serialization.font;
            return this;
        }
        getMutator(_extendable) {
            let mutator = super.getMutator(true);
            mutator.text = this.text;
            mutator.font = this.font;
            return mutator;
        }
    }
    FudgeCore.TextureText = TextureText;
    class TextureSketch extends TextureCanvas {
        get texImageSource() {
            return null;
        }
    }
    FudgeCore.TextureSketch = TextureSketch;
    class TextureHTML extends TextureCanvas {
        get texImageSource() {
            return null;
        }
    }
    FudgeCore.TextureHTML = TextureHTML;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let Mesh = (() => {
        var _a;
        let _classDecorators = [(_a = FudgeCore.RenderInjectorMesh).decorate.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.Mutable;
        var Mesh = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                Mesh = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.baseClass = Mesh; }
            static { this.subclasses = []; }
            #renderMesh;
            constructor(_name = "Mesh") {
                super();
                this.idResource = undefined;
                this.name = "Mesh";
                this.vertices = new FudgeCore.Vertices();
                this.faces = [];
                this.name = _name;
                this.clear();
                FudgeCore.Project.register(this);
            }
            static registerSubclass(_subClass) { return Mesh.subclasses.push(_subClass) - 1; }
            get isSerializableResource() {
                return true;
            }
            get renderMesh() {
                if (this.#renderMesh == null)
                    this.#renderMesh = new FudgeCore.RenderMesh(this);
                return this.#renderMesh;
            }
            get boundingBox() {
                if (this.ƒbox == null)
                    this.ƒbox = this.createBoundingBox();
                return this.ƒbox;
            }
            get radius() {
                if (this.ƒradius == null)
                    this.ƒradius = this.createRadius();
                return this.ƒradius;
            }
            useRenderBuffers() { return null; }
            getRenderBuffers() { return null; }
            deleteRenderBuffers(_renderBuffers) { }
            clear() {
                this.ƒbox = undefined;
                this.ƒradius = undefined;
                this.deleteRenderBuffers(this.renderMesh.buffers);
                this.renderMesh.clear();
            }
            serialize() {
                let serialization = {
                    idResource: this.idResource,
                    name: this.name,
                    type: this.type
                };
                return serialization;
            }
            async deserialize(_serialization) {
                FudgeCore.Project.register(this, _serialization.idResource);
                this.name = _serialization.name;
                return this;
            }
            reduceMutator(_mutator) {
                delete _mutator.ƒbox;
                delete _mutator.ƒradius;
                delete _mutator.renderBuffers;
            }
            createRadius() {
                let radius = 0;
                for (let i = 0; i < this.vertices.length; i++) {
                    radius = Math.max(radius, this.vertices.position(i).magnitudeSquared);
                }
                return Math.sqrt(radius);
            }
            createBoundingBox() {
                let box = FudgeCore.Recycler.get(FudgeCore.Box);
                box.set();
                for (let i = 0; i < this.vertices.length; i++) {
                    let point = this.vertices.position(i);
                    box.expand(point);
                }
                return box;
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return Mesh = _classThis;
    })();
    FudgeCore.Mesh = Mesh;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let Material = (() => {
        let _classDecorators = [FudgeCore.enumerate];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.Mutable;
        let _instanceExtraInitializers = [];
        let _get_coat_decorators;
        var Material = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _get_coat_decorators = [FudgeCore.type(FudgeCore.Coat), FudgeCore.enumerate];
                __esDecorate(this, null, _get_coat_decorators, { kind: "getter", name: "coat", static: false, private: false, access: { has: obj => "coat" in obj, get: obj => obj.coat }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                Material = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            #coat;
            constructor(_name, _shader, _coat) {
                super();
                this.name = __runInitializers(this, _instanceExtraInitializers);
                this.idResource = undefined;
                this.timestampUpdate = 0;
                this.name = _name;
                this.shaderType = _shader;
                if (_shader) {
                    if (_coat)
                        this.coat = _coat;
                    else
                        this.coat = this.createCoatMatchingShader();
                }
                FudgeCore.Project.register(this);
            }
            get isSerializableResource() {
                return true;
            }
            get coat() {
                return this.#coat;
            }
            set coat(_coat) {
                if (this.shaderType)
                    if (_coat.constructor != this.shaderType.getCoat())
                        if (_coat instanceof this.shaderType.getCoat())
                            FudgeCore.Debug.fudge("Coat is extension of Coat required by shader");
                        else
                            throw (new Error("Shader and coat don't match"));
                this.#coat = _coat;
            }
            createCoatMatchingShader() {
                let coat = new (this.shaderType.getCoat())();
                return coat;
            }
            setShader(_shaderType) {
                this.shaderType = _shaderType;
                let coat = this.createCoatMatchingShader();
                coat.mutate(this.#coat?.getMutator());
                this.coat = coat;
            }
            getShader() {
                return this.shaderType;
            }
            serialize() {
                let serialization = {
                    name: this.name,
                    idResource: this.idResource,
                    shader: this.shaderType.name,
                    coat: FudgeCore.Serializer.serialize(this.#coat),
                };
                return serialization;
            }
            async deserialize(_serialization) {
                this.name = _serialization.name;
                FudgeCore.Project.register(this, _serialization.idResource);
                this.shaderType = FudgeCore[_serialization.shader];
                let coat = await FudgeCore.Serializer.deserialize(_serialization.coat);
                this.coat = coat;
                return this;
            }
            reduceMutator(_mutator) {
                delete _mutator.timestampUpdate;
            }
        };
        return Material = _classThis;
    })();
    FudgeCore.Material = Material;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let ParticleData;
    (function (ParticleData) {
        function isExpression(_data) {
            return isFunction(_data) || isVariable(_data) || isConstant(_data) || isCode(_data);
        }
        ParticleData.isExpression = isExpression;
        function isFunction(_data) {
            return typeof _data == "object" && "function" in _data;
        }
        ParticleData.isFunction = isFunction;
        function isVariable(_data) {
            return typeof _data == "object" && "value" in _data && typeof _data.value == "string";
        }
        ParticleData.isVariable = isVariable;
        function isConstant(_data) {
            return typeof _data == "object" && "value" in _data && typeof _data.value == "number";
        }
        ParticleData.isConstant = isConstant;
        function isCode(_data) {
            return typeof _data == "object" && "code" in _data;
        }
        ParticleData.isCode = isCode;
        function isTransformation(_data) {
            return typeof _data == "object" && "transformation" in _data;
        }
        ParticleData.isTransformation = isTransformation;
    })(ParticleData = FudgeCore.ParticleData || (FudgeCore.ParticleData = {}));
    class ParticleSystem extends FudgeCore.Mutable {
        #data;
        #mapShaderToShaderParticleSystem;
        constructor(_name = ParticleSystem.name, _data = {}) {
            super();
            this.idResource = undefined;
            this.#mapShaderToShaderParticleSystem = new Map();
            this.name = _name;
            this.data = _data;
            FudgeCore.Project.register(this);
        }
        get isSerializableResource() {
            return true;
        }
        get data() {
            return this.#data;
        }
        set data(_data) {
            this.#data = _data;
            this.#mapShaderToShaderParticleSystem.forEach(_shader => _shader.deleteProgram());
            this.#mapShaderToShaderParticleSystem.clear();
        }
        getShaderFrom(_source) {
            if (!this.#mapShaderToShaderParticleSystem.has(_source)) {
                let particleShader = new FudgeCore.ShaderParticleSystem();
                particleShader.data = this.data;
                particleShader.define = [...particleShader.define, ..._source.define];
                particleShader.vertexShaderSource = _source.getVertexShaderSource();
                particleShader.fragmentShaderSource = _source.getFragmentShaderSource();
                this.#mapShaderToShaderParticleSystem.set(_source, particleShader);
            }
            return this.#mapShaderToShaderParticleSystem.get(_source);
        }
        serialize() {
            let serialization = {
                idResource: this.idResource,
                name: this.name,
                data: this.data
            };
            return serialization;
        }
        async deserialize(_serialization) {
            FudgeCore.Project.register(this, _serialization.idResource);
            this.name = _serialization.name;
            this.data = _serialization.data;
            return this;
        }
        reduceMutator(_mutator) {
            delete _mutator.cachedMutators;
            delete _mutator.shaderMap;
        }
    }
    FudgeCore.ParticleSystem = ParticleSystem;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderInjectorComponentSkeleton {
        static decorate(_constructor, _context) {
            Object.defineProperty(_constructor.prototype, _constructor.prototype.useRenderBuffer.name, {
                value: RenderInjectorComponentSkeleton.useRenderBuffer
            });
            Object.defineProperty(_constructor.prototype, _constructor.prototype.updateRenderBuffer.name, {
                value: RenderInjectorComponentSkeleton.updateRenderBuffer
            });
            Object.defineProperty(_constructor.prototype, _constructor.prototype.deleteRenderBuffer.name, {
                value: RenderInjectorComponentSkeleton.deleteRenderBuffer
            });
        }
        static useRenderBuffer() {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            const renderBuffer = this.renderBuffer;
            if (renderBuffer)
                crc3.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, FudgeCore.UNIFORM_BLOCK.SKIN.BINDING, renderBuffer);
        }
        static updateRenderBuffer() {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            if (!this.renderBuffer) {
                const bonesByteSize = 256 * 16 * 4;
                this.renderBuffer = FudgeCore.RenderWebGL.assert(crc3.createBuffer());
                crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.renderBuffer);
                crc3.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, bonesByteSize, WebGL2RenderingContext.DYNAMIC_DRAW);
            }
            if (this.bonesDirty) {
                this.mtxBones = new Array(this.bones.length);
                this.mtxBonesData = new Float32Array(this.bones.length * 16);
                for (let i = 0; i < this.bones.length; i++)
                    this.mtxBones[i] = new FudgeCore.Matrix4x4(this.mtxBonesData.subarray(i * 16, i * 16 + 16));
                this.bonesDirty = false;
            }
            const bones = this.bones;
            const mtxBones = this.mtxBones;
            const mtxBindInverses = this.mtxBindInverses;
            for (let i = 0; i < this.bones.length; i++)
                FudgeCore.Matrix4x4.PRODUCT(bones[i].mtxWorld, mtxBindInverses[i], mtxBones[i]);
            crc3.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, this.renderBuffer);
            crc3.bufferSubData(WebGL2RenderingContext.UNIFORM_BUFFER, 0, this.mtxBonesData);
        }
        static deleteRenderBuffer() {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.deleteBuffer(this.renderBuffer);
        }
    }
    FudgeCore.RenderInjectorComponentSkeleton = RenderInjectorComponentSkeleton;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let ComponentSkeleton = (() => {
        var _a;
        let _classDecorators = [(_a = FudgeCore.RenderInjectorComponentSkeleton).decorate.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.Component;
        var ComponentSkeleton = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ComponentSkeleton = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            constructor(_bones = [], _mtxBoneInverses = []) {
                super();
                this.singleton = false;
                this.bonesDirty = true;
                this.bones = _bones;
                this.mtxBindInverses = _mtxBoneInverses;
                for (let i = 0; i < this.bones.length; i++) {
                    if (this.mtxBindInverses[i] == null)
                        this.mtxBindInverses[i] = this.bones[i].mtxWorldInverse.clone;
                }
            }
            useRenderBuffer() { }
            ;
            updateRenderBuffer() { }
            deleteRenderBuffer() { }
            addBone(_bone, _mtxBindInverse = _bone.mtxWorldInverse.clone) {
                this.bones.push(_bone);
                this.mtxBindInverses.push(_mtxBindInverse);
                this.bonesDirty = true;
            }
            indexOf(_name) {
                if (typeof (_name) == "string")
                    return this.bones.findIndex((_bone) => _bone.name == _name);
                else
                    return this.bones.indexOf(_name);
            }
            resetPose() {
                for (let i = 0; i < this.bones.length; i++)
                    this.bones[i].mtxLocal.copy(FudgeCore.Matrix4x4.INVERSE(this.mtxBindInverses[i]));
            }
            serialize() {
                const serialization = {};
                serialization[super.constructor.name] = super.serialize();
                serialization.bones = this.bones.map(_bone => FudgeCore.Node.PATH_FROM_TO(this, _bone));
                serialization.mtxBindInverses = FudgeCore.Serializer.serializeArray(FudgeCore.Matrix4x4, this.mtxBindInverses);
                return serialization;
            }
            async deserialize(_serialization) {
                await super.deserialize(_serialization[super.constructor.name]);
                const hndNodeDeserialized = () => {
                    this.bones = _serialization.bones.map((_path) => {
                        let bone = FudgeCore.Node.FIND(this, _path);
                        if (!bone)
                            throw new Error(`${FudgeCore.Node.name} "${this.node.name}" ${ComponentSkeleton.name}: Could not find bone ${_path}`);
                        return bone;
                    });
                    this.removeEventListener("nodeDeserialized", hndNodeDeserialized);
                };
                this.addEventListener("nodeDeserialized", hndNodeDeserialized);
                this.mtxBindInverses = await FudgeCore.Serializer.deserializeArray(_serialization.mtxBindInverses);
                return this;
            }
        };
        return ComponentSkeleton = _classThis;
    })();
    FudgeCore.ComponentSkeleton = ComponentSkeleton;
})(FudgeCore || (FudgeCore = {}));
function ifNumber(_check, _default) {
    return typeof _check == "undefined" ? _default : _check;
}
var FudgeCore;
(function (FudgeCore) {
    let ANIMATION_STRUCTURE_TYPE;
    (function (ANIMATION_STRUCTURE_TYPE) {
        ANIMATION_STRUCTURE_TYPE[ANIMATION_STRUCTURE_TYPE["NORMAL"] = 0] = "NORMAL";
        ANIMATION_STRUCTURE_TYPE[ANIMATION_STRUCTURE_TYPE["REVERSE"] = 1] = "REVERSE";
        ANIMATION_STRUCTURE_TYPE[ANIMATION_STRUCTURE_TYPE["RASTERED"] = 2] = "RASTERED";
        ANIMATION_STRUCTURE_TYPE[ANIMATION_STRUCTURE_TYPE["RASTEREDREVERSE"] = 3] = "RASTEREDREVERSE";
    })(ANIMATION_STRUCTURE_TYPE || (ANIMATION_STRUCTURE_TYPE = {}));
    let ANIMATION_PLAYMODE;
    (function (ANIMATION_PLAYMODE) {
        ANIMATION_PLAYMODE["LOOP"] = "loop";
        ANIMATION_PLAYMODE["PLAY_ONCE"] = "playOnce";
        ANIMATION_PLAYMODE["PLAY_ONCE_RESET"] = "playOnceReset";
        ANIMATION_PLAYMODE["REVERSE_LOOP"] = "reverseLoop";
        ANIMATION_PLAYMODE["STOP"] = "stop";
    })(ANIMATION_PLAYMODE = FudgeCore.ANIMATION_PLAYMODE || (FudgeCore.ANIMATION_PLAYMODE = {}));
    let ANIMATION_QUANTIZATION;
    (function (ANIMATION_QUANTIZATION) {
        ANIMATION_QUANTIZATION["CONTINOUS"] = "continous";
        ANIMATION_QUANTIZATION["DISCRETE"] = "discrete";
        ANIMATION_QUANTIZATION["FRAMES"] = "frames";
    })(ANIMATION_QUANTIZATION = FudgeCore.ANIMATION_QUANTIZATION || (FudgeCore.ANIMATION_QUANTIZATION = {}));
    class Animation extends FudgeCore.Mutable {
        static { this.subclasses = []; }
        static { this.iSubclass = Animation.registerSubclass(Animation); }
        #animationStructuresProcessed;
        constructor(_name = Animation.name, _animStructure = {}, _fps = 60) {
            super();
            this.idResource = undefined;
            this.totalTime = 0;
            this.labels = {};
            this.events = {};
            this.framesPerSecond = 60;
            this.eventsProcessed = new Map();
            this.#animationStructuresProcessed = new Map();
            this.name = _name;
            this.animationStructure = _animStructure;
            this.#animationStructuresProcessed.set(ANIMATION_STRUCTURE_TYPE.NORMAL, _animStructure);
            this.framesPerSecond = _fps;
            this.calculateTotalTime();
            FudgeCore.Project.register(this);
        }
        static blendOverride(_base, _override, _weight, _intersect = false) {
            return Animation.blendRecursive(_base, _override, 1 - _weight, _weight, _intersect);
        }
        static blendAdditive(_base, _add, _weight) {
            return Animation.blendRecursive(_base, _add, 1, _weight);
        }
        static blendRecursive(_base, _blend, _weightBase, _weightBlend, _intersect = false) {
            let mutator = _intersect ? {} : { ..._base };
            for (const key in _blend) {
                if (_intersect && _base[key] == undefined)
                    continue;
                if (typeof _blend[key] == "number") {
                    mutator[key] = (_base[key] ?? 0) * _weightBase + _blend[key] * _weightBlend;
                    continue;
                }
                if (typeof _base[key] == "object") {
                    let base = _base[key];
                    let blend = _blend[key];
                    if (base.x != undefined && base.y != undefined && base.z != undefined && base.w != undefined && FudgeCore.Quaternion.DOT(base, blend) < 0)
                        FudgeCore.Quaternion.negate(base);
                    mutator[key] = this.blendRecursive(base, blend, _weightBase, _weightBlend, _intersect);
                    continue;
                }
                if (typeof _blend[key] === "object") {
                    mutator[key] = this.blendRecursive({}, _blend[key], _weightBase, _weightBlend, _intersect);
                    continue;
                }
            }
            return mutator;
        }
        static registerSubclass(_subClass) { return Animation.subclasses.push(_subClass) - 1; }
        get isSerializableResource() {
            return true;
        }
        get getLabels() {
            let en = new Enumerator(this.labels);
            return en;
        }
        get fps() {
            return this.framesPerSecond;
        }
        set fps(_fps) {
            this.framesPerSecond = _fps;
            this.eventsProcessed.clear();
            this.clearCache();
        }
        clearCache() {
            this.#animationStructuresProcessed.clear();
        }
        getState(_time, _direction, _quantization, _mutatorOut = {}) {
            return this.traverseStructureForMutator(this.getAnimationStructure(_direction, _quantization), _time, _mutatorOut);
        }
        getEventsToFire(_min, _max, _quantization, _direction) {
            let events = [];
            let minSection = Math.floor(_min / this.totalTime);
            let maxSection = Math.floor(_max / this.totalTime);
            _min = _min % this.totalTime;
            _max = _max % this.totalTime;
            while (minSection <= maxSection) {
                let eventTriggers = this.getCorrectEventList(_direction, _quantization);
                if (minSection == maxSection) {
                    this.addEventsBetween(eventTriggers, _min, _max, events);
                }
                else {
                    this.addEventsBetween(eventTriggers, _min, _max, events);
                    _min = 0;
                }
                minSection++;
            }
            return events;
        }
        setEvent(_name, _time) {
            this.events[_name] = _time;
            this.eventsProcessed.clear();
        }
        removeEvent(_name) {
            delete this.events[_name];
            this.eventsProcessed.clear();
        }
        calculateTotalTime() {
            this.totalTime = 0;
            this.traverseStructureForTime(this.animationStructure);
        }
        getModalTime(_time, _playmode, _timeStop = _time) {
            switch (_playmode) {
                case ANIMATION_PLAYMODE.STOP:
                    return _timeStop;
                case ANIMATION_PLAYMODE.PLAY_ONCE:
                    if (_time >= this.totalTime)
                        return this.totalTime - 0.01;
                case ANIMATION_PLAYMODE.PLAY_ONCE_RESET:
                    if (_time >= this.totalTime)
                        return this.totalTime + 0.01;
            }
            return _time;
        }
        calculateDirection(_time, _playmode) {
            switch (_playmode) {
                case ANIMATION_PLAYMODE.STOP:
                    return 0;
                case ANIMATION_PLAYMODE.REVERSE_LOOP:
                    return -1;
                case ANIMATION_PLAYMODE.PLAY_ONCE:
                case ANIMATION_PLAYMODE.PLAY_ONCE_RESET:
                    if (_time >= this.totalTime) {
                        return 0;
                    }
                default:
                    return 1;
            }
        }
        serialize() {
            let s = {
                idResource: this.idResource,
                name: this.name,
                labels: {},
                events: {},
                framesPerSecond: this.framesPerSecond
            };
            for (let name in this.labels) {
                s.labels[name] = this.labels[name];
            }
            for (let name in this.events) {
                s.events[name] = this.events[name];
            }
            s.animationStructure = this.traverseStructureForSerialization(this.animationStructure);
            return s;
        }
        async deserialize(_serialization) {
            FudgeCore.Project.register(this, _serialization.idResource);
            this.name = _serialization.name;
            this.framesPerSecond = _serialization.framesPerSecond;
            this.labels = {};
            for (let name in _serialization.labels) {
                this.labels[name] = _serialization.labels[name];
            }
            this.events = {};
            for (let name in _serialization.events) {
                this.events[name] = _serialization.events[name];
            }
            this.eventsProcessed = new Map();
            this.animationStructure = await this.traverseStructureForDeserialization(_serialization.animationStructure);
            this.#animationStructuresProcessed = new Map();
            this.calculateTotalTime();
            return this;
        }
        reduceMutator(_mutator) {
            delete _mutator.totalTime;
        }
        traverseStructureForSerialization(_structure) {
            let serialization = {};
            for (const property in _structure) {
                let structureOrSequence = _structure[property];
                if (structureOrSequence instanceof FudgeCore.AnimationSequence)
                    serialization[property] = structureOrSequence.serialize();
                else
                    serialization[property] = this.traverseStructureForSerialization(structureOrSequence);
            }
            return serialization;
        }
        async traverseStructureForDeserialization(_serialization) {
            let structure = {};
            for (let n in _serialization) {
                if (_serialization[n].animationSequence) {
                    let animSeq = new FudgeCore.AnimationSequence([], null);
                    structure[n] = (await animSeq.deserialize(_serialization[n]));
                }
                else {
                    structure[n] = await this.traverseStructureForDeserialization(_serialization[n]);
                }
            }
            return structure;
        }
        getCorrectEventList(_direction, _quantization) {
            if (_quantization != ANIMATION_QUANTIZATION.FRAMES) {
                if (_direction >= 0) {
                    return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.NORMAL);
                }
                else {
                    return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.REVERSE);
                }
            }
            else {
                if (_direction >= 0) {
                    return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.RASTERED);
                }
                else {
                    return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE);
                }
            }
        }
        traverseStructureForMutator(_structure, _time, _mutatorOut = {}) {
            if (Array.isArray(_structure))
                for (let n = 0; n < _structure.length; n++) {
                    if (_structure[n] instanceof FudgeCore.AnimationSequence)
                        _mutatorOut[n] = _structure[n].evaluate(_time, _mutatorOut[n]);
                    else
                        _mutatorOut[n] = this.traverseStructureForMutator(_structure[n], _time, _mutatorOut[n]);
                }
            else
                for (let n in _structure) {
                    if (_structure[n] instanceof FudgeCore.AnimationSequence)
                        _mutatorOut[n] = _structure[n].evaluate(_time, _mutatorOut[n]);
                    else
                        _mutatorOut[n] = this.traverseStructureForMutator(_structure[n], _time, _mutatorOut[n]);
                }
            return _mutatorOut;
        }
        traverseStructureForTime(_structure) {
            for (let n in _structure) {
                if (_structure[n] instanceof FudgeCore.AnimationSequence) {
                    let sequence = _structure[n];
                    if (sequence.length > 0) {
                        let sequenceTime = sequence.getKey(sequence.length - 1).time;
                        this.totalTime = Math.max(sequenceTime, this.totalTime);
                    }
                }
                else {
                    this.traverseStructureForTime(_structure[n]);
                }
            }
        }
        getAnimationStructure(_direction, _quantization) {
            let animationStructure;
            if (_quantization == ANIMATION_QUANTIZATION.CONTINOUS)
                animationStructure = _direction < 0 ? ANIMATION_STRUCTURE_TYPE.REVERSE : ANIMATION_STRUCTURE_TYPE.NORMAL;
            else
                animationStructure = _direction < 0 ? ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE : ANIMATION_STRUCTURE_TYPE.RASTERED;
            return this.getProcessedAnimationStructure(animationStructure);
        }
        getProcessedAnimationStructure(_type) {
            let processed = this.#animationStructuresProcessed.get(_type);
            if (processed)
                return processed;
            this.calculateTotalTime();
            processed = {};
            switch (_type) {
                case ANIMATION_STRUCTURE_TYPE.NORMAL:
                    processed = this.animationStructure;
                    break;
                case ANIMATION_STRUCTURE_TYPE.REVERSE:
                    processed = this.traverseStructureForNewStructure(this.animationStructure, this.calculateReverseSequence.bind(this));
                    break;
                case ANIMATION_STRUCTURE_TYPE.RASTERED:
                    processed = this.traverseStructureForNewStructure(this.animationStructure, this.calculateRasteredSequence.bind(this));
                    break;
                case ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE:
                    processed = this.traverseStructureForNewStructure(this.getProcessedAnimationStructure(ANIMATION_STRUCTURE_TYPE.REVERSE), this.calculateRasteredSequence.bind(this));
                    break;
                default:
                    return undefined;
            }
            this.#animationStructuresProcessed.set(_type, processed);
            return processed;
        }
        getProcessedEventTrigger(_type) {
            let processed = this.eventsProcessed.get(_type);
            if (processed)
                return processed;
            this.calculateTotalTime();
            processed = {};
            switch (_type) {
                case ANIMATION_STRUCTURE_TYPE.NORMAL:
                    processed = this.events;
                    break;
                case ANIMATION_STRUCTURE_TYPE.REVERSE:
                    processed = this.calculateReverseEventTriggers(this.events);
                    break;
                case ANIMATION_STRUCTURE_TYPE.RASTERED:
                    processed = this.calculateRasteredEventTriggers(this.events);
                    break;
                case ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE:
                    processed = this.calculateRasteredEventTriggers(this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.REVERSE));
                    break;
                default:
                    return undefined;
            }
            this.eventsProcessed.set(_type, processed);
            return processed;
        }
        traverseStructureForNewStructure(_oldStructure, _functionToUse) {
            let newStructure = {};
            for (let n in _oldStructure) {
                if (_oldStructure[n] instanceof FudgeCore.AnimationSequence) {
                    newStructure[n] = _functionToUse(_oldStructure[n]);
                }
                else {
                    newStructure[n] = this.traverseStructureForNewStructure(_oldStructure[n], _functionToUse);
                }
            }
            return newStructure;
        }
        calculateReverseSequence(_sequence) {
            let keys = new Array(_sequence.length);
            for (let i = 0; i < _sequence.length; i++) {
                let oldKey = _sequence.getKey(i);
                keys[i] = new FudgeCore.AnimationKey(this.totalTime - oldKey.time, oldKey.value, oldKey.interpolation, oldKey.slopeOut, oldKey.slopeIn);
            }
            return new FudgeCore.AnimationSequence(keys, _sequence.classType);
        }
        calculateRasteredSequence(_sequence) {
            let keys = [];
            let frameTime = 1000 / this.framesPerSecond;
            for (let i = 0; i < this.totalTime; i += frameTime)
                keys.push(new FudgeCore.AnimationKey(i, _sequence.evaluate(i), FudgeCore.ANIMATION_INTERPOLATION.CONSTANT));
            return new FudgeCore.AnimationSequence(keys, _sequence.classType);
        }
        calculateReverseEventTriggers(_events) {
            let ae = {};
            for (let name in _events) {
                ae[name] = this.totalTime - _events[name];
            }
            return ae;
        }
        calculateRasteredEventTriggers(_events) {
            let ae = {};
            let frameTime = 1000 / this.framesPerSecond;
            for (let name in _events) {
                ae[name] = _events[name] - (_events[name] % frameTime);
            }
            return ae;
        }
        addEventsBetween(_eventTriggers, _min, _max, _events) {
            for (let name in _eventTriggers) {
                if (_min <= _eventTriggers[name] && _eventTriggers[name] < _max) {
                    _events.push(name);
                }
            }
            return _events;
        }
    }
    FudgeCore.Animation = Animation;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class AnimationFunction {
        constructor(_keyIn, _keyOut = null) {
            this.keyIn = _keyIn;
            this.keyOut = _keyOut;
            this.calculate();
        }
        getParameters() {
            return { a: this.a, b: this.b, c: this.c, d: this.d };
        }
    }
    FudgeCore.AnimationFunction = AnimationFunction;
    class AnimationFunctionNumber extends AnimationFunction {
        evaluate(_time) {
            _time -= this.keyIn.time;
            let time2 = _time * _time;
            let time3 = time2 * _time;
            return this.a * time3 + this.b * time2 + this.c * _time + this.d;
        }
        calculate() {
            this.d = this.c = this.b = this.a = 0;
            if (!this.keyIn)
                return;
            this.d = this.keyIn.value;
            if (!this.keyOut || this.keyIn.interpolation == FudgeCore.ANIMATION_INTERPOLATION.CONSTANT)
                return;
            let x1 = this.keyOut.time - this.keyIn.time;
            if (this.keyIn.interpolation == FudgeCore.ANIMATION_INTERPOLATION.LINEAR) {
                this.c = (this.keyOut.value - this.keyIn.value) / x1;
                return;
            }
            this.c = this.keyIn.slopeOut;
            this.a = (-x1 * (this.keyIn.slopeOut + this.keyOut.slopeIn) - 2 * this.keyIn.value + 2 * this.keyOut.value) / -Math.pow(x1, 3);
            this.b = (this.keyOut.slopeIn - this.keyIn.slopeOut - 3 * this.a * Math.pow(x1, 2)) / (2 * x1);
        }
    }
    FudgeCore.AnimationFunctionNumber = AnimationFunctionNumber;
    class AnimationFunctionVector3 extends AnimationFunction {
        evaluate(_time, _out = {}) {
            _time -= this.keyIn.time;
            let time2 = _time * _time;
            let time3 = time2 * _time;
            _out.x = this.a.x * time3 + this.b.x * time2 + this.c.x * _time + this.d.x;
            _out.y = this.a.y * time3 + this.b.y * time2 + this.c.y * _time + this.d.y;
            _out.z = this.a.z * time3 + this.b.z * time2 + this.c.z * _time + this.d.z;
            return _out;
        }
        calculate() {
            this.a = { x: 0, y: 0, z: 0 };
            this.b = { x: 0, y: 0, z: 0 };
            this.c = { x: 0, y: 0, z: 0 };
            this.d = { x: 0, y: 0, z: 0 };
            if (!this.keyIn)
                return;
            Object.assign(this.d, this.keyIn.value);
            if (!this.keyOut || this.keyIn.interpolation == FudgeCore.ANIMATION_INTERPOLATION.CONSTANT)
                return;
            let x1 = this.keyOut.time - this.keyIn.time;
            if (this.keyIn.interpolation == FudgeCore.ANIMATION_INTERPOLATION.LINEAR) {
                this.c.x = (this.keyOut.value.x - this.keyIn.value.x) / x1;
                this.c.y = (this.keyOut.value.y - this.keyIn.value.y) / x1;
                this.c.z = (this.keyOut.value.z - this.keyIn.value.z) / x1;
                return;
            }
            Object.assign(this.c, this.keyIn.slopeOut);
            this.a.x = (-x1 * (this.keyIn.slopeOut.x + this.keyOut.slopeIn.x) - 2 * this.keyIn.value.x + 2 * this.keyOut.value.x) / -Math.pow(x1, 3);
            this.a.y = (-x1 * (this.keyIn.slopeOut.y + this.keyOut.slopeIn.y) - 2 * this.keyIn.value.y + 2 * this.keyOut.value.y) / -Math.pow(x1, 3);
            this.a.z = (-x1 * (this.keyIn.slopeOut.z + this.keyOut.slopeIn.z) - 2 * this.keyIn.value.z + 2 * this.keyOut.value.z) / -Math.pow(x1, 3);
            this.b.x = (this.keyOut.slopeIn.x - this.keyIn.slopeOut.x - 3 * this.a.x * Math.pow(x1, 2)) / (2 * x1);
            this.b.y = (this.keyOut.slopeIn.y - this.keyIn.slopeOut.y - 3 * this.a.y * Math.pow(x1, 2)) / (2 * x1);
            this.b.z = (this.keyOut.slopeIn.z - this.keyIn.slopeOut.z - 3 * this.a.z * Math.pow(x1, 2)) / (2 * x1);
        }
    }
    FudgeCore.AnimationFunctionVector3 = AnimationFunctionVector3;
    class AnimationFunctionQuaternion extends AnimationFunction {
        evaluate(_time, _out = {}) {
            const keyIn = this.keyIn;
            switch (keyIn.interpolation) {
                case FudgeCore.ANIMATION_INTERPOLATION.CONSTANT:
                    Object.assign(_out, keyIn.value);
                    return _out;
                case FudgeCore.ANIMATION_INTERPOLATION.LINEAR:
                    const keyOut = this.keyOut;
                    const timeStart = keyIn.time;
                    _time = (_time - timeStart) / (keyOut.time - timeStart);
                    return FudgeCore.Quaternion.SLERP(keyIn.value, keyOut.value, _time, _out);
                case FudgeCore.ANIMATION_INTERPOLATION.CUBIC:
                    _time -= keyIn.time;
                    const time2 = _time * _time;
                    const time3 = time2 * _time;
                    _out.x = this.a.x * time3 + this.b.x * time2 + this.c.x * _time + this.d.x;
                    _out.y = this.a.y * time3 + this.b.y * time2 + this.c.y * _time + this.d.y;
                    _out.z = this.a.z * time3 + this.b.z * time2 + this.c.z * _time + this.d.z;
                    _out.w = this.a.w * time3 + this.b.w * time2 + this.c.w * _time + this.d.w;
                    return _out;
            }
        }
        calculate() {
            this.a = { x: 0, y: 0, z: 0, w: 0 };
            this.b = { x: 0, y: 0, z: 0, w: 0 };
            this.c = { x: 0, y: 0, z: 0, w: 0 };
            this.d = { x: 0, y: 0, z: 0, w: 0 };
            if (!this.keyIn)
                return;
            Object.assign(this.d, this.keyIn.value);
            if (!this.keyOut || this.keyIn.interpolation == FudgeCore.ANIMATION_INTERPOLATION.CONSTANT)
                return;
            let x1 = this.keyOut.time - this.keyIn.time;
            if (this.keyIn.interpolation == FudgeCore.ANIMATION_INTERPOLATION.LINEAR) {
                this.c.x = (this.keyOut.value.x - this.keyIn.value.x) / x1;
                this.c.y = (this.keyOut.value.y - this.keyIn.value.y) / x1;
                this.c.z = (this.keyOut.value.z - this.keyIn.value.z) / x1;
                this.c.w = (this.keyOut.value.w - this.keyIn.value.w) / x1;
                return;
            }
            Object.assign(this.c, this.keyIn.slopeOut);
            this.a.x = (-x1 * (this.keyIn.slopeOut.x + this.keyOut.slopeIn.x) - 2 * this.keyIn.value.x + 2 * this.keyOut.value.x) / -Math.pow(x1, 3);
            this.a.y = (-x1 * (this.keyIn.slopeOut.y + this.keyOut.slopeIn.y) - 2 * this.keyIn.value.y + 2 * this.keyOut.value.y) / -Math.pow(x1, 3);
            this.a.z = (-x1 * (this.keyIn.slopeOut.z + this.keyOut.slopeIn.z) - 2 * this.keyIn.value.z + 2 * this.keyOut.value.z) / -Math.pow(x1, 3);
            this.a.w = (-x1 * (this.keyIn.slopeOut.w + this.keyOut.slopeIn.w) - 2 * this.keyIn.value.w + 2 * this.keyOut.value.w) / -Math.pow(x1, 3);
            this.b.x = (this.keyOut.slopeIn.x - this.keyIn.slopeOut.x - 3 * this.a.x * Math.pow(x1, 2)) / (2 * x1);
            this.b.y = (this.keyOut.slopeIn.y - this.keyIn.slopeOut.y - 3 * this.a.y * Math.pow(x1, 2)) / (2 * x1);
            this.b.z = (this.keyOut.slopeIn.z - this.keyIn.slopeOut.z - 3 * this.a.z * Math.pow(x1, 2)) / (2 * x1);
            this.b.w = (this.keyOut.slopeIn.w - this.keyIn.slopeOut.w - 3 * this.a.w * Math.pow(x1, 2)) / (2 * x1);
        }
    }
    FudgeCore.AnimationFunctionQuaternion = AnimationFunctionQuaternion;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class AnimationGLTF extends FudgeCore.mixinSerializableResourceExternal(FudgeCore.Animation) {
        async load(_url = this.url, _name = this.name) {
            this.url = _url;
            this.name = _name;
            return FudgeCore.GLTFLoader.loadResource(this);
        }
        serialize() {
            const serialization = super.serialize();
            serialization.events = { ...this.events };
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            this.events = { ..._serialization.events };
            return this;
        }
    }
    FudgeCore.AnimationGLTF = AnimationGLTF;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let ANIMATION_INTERPOLATION;
    (function (ANIMATION_INTERPOLATION) {
        ANIMATION_INTERPOLATION[ANIMATION_INTERPOLATION["CONSTANT"] = 0] = "CONSTANT";
        ANIMATION_INTERPOLATION[ANIMATION_INTERPOLATION["LINEAR"] = 1] = "LINEAR";
        ANIMATION_INTERPOLATION[ANIMATION_INTERPOLATION["CUBIC"] = 2] = "CUBIC";
    })(ANIMATION_INTERPOLATION = FudgeCore.ANIMATION_INTERPOLATION || (FudgeCore.ANIMATION_INTERPOLATION = {}));
    class AnimationKey extends FudgeCore.Mutable {
        #interpolation;
        #time;
        #value;
        #slopeIn;
        #slopeOut;
        constructor(_time = 0, _value, _interpolation = ANIMATION_INTERPOLATION.CUBIC, _slopeIn, _slopeOut) {
            super();
            this.#time = _time;
            this.#value = _value;
            this.#interpolation = _interpolation;
            this.#slopeIn = _slopeIn;
            this.#slopeOut = _slopeOut;
            if (typeof this.#value == "object") {
                this.#slopeIn ??= {};
                this.#slopeOut ??= {};
                for (const key of Object.keys(this.#value)) {
                    Reflect.set(this.#slopeIn, key, 0);
                    Reflect.set(this.#slopeOut, key, 0);
                }
            }
            else if (typeof this.#value == "number") {
                this.#slopeIn ??= 0;
                this.#slopeOut ??= 0;
            }
        }
        static compare(_a, _b) {
            return _a.time - _b.time;
        }
        get time() {
            return this.#time;
        }
        set time(_time) {
            this.#time = _time;
            this.functionOut.calculate();
        }
        get value() {
            return this.#value;
        }
        set value(_value) {
            this.#value = _value;
            this.functionOut.calculate();
        }
        get interpolation() {
            return this.#interpolation;
        }
        set interpolation(_interpolation) {
            this.#interpolation = _interpolation;
            this.functionOut.calculate();
        }
        get slopeIn() {
            return this.#slopeIn;
        }
        set slopeIn(_slope) {
            this.#slopeIn = _slope;
        }
        get slopeOut() {
            return this.#slopeOut;
        }
        set slopeOut(_slope) {
            this.#slopeOut = _slope;
            this.functionOut.calculate();
        }
        serialize() {
            let serialization = {};
            serialization.time = this.#time;
            serialization.value = this.#value;
            serialization.interpolation = this.#interpolation;
            serialization.slopeIn = this.#slopeIn;
            serialization.slopeOut = this.#slopeOut;
            return serialization;
        }
        async deserialize(_serialization) {
            this.#time = _serialization.time;
            this.#value = _serialization.value;
            this.#interpolation = _serialization.interpolation;
            this.#slopeIn = _serialization.slopeIn;
            this.#slopeOut = _serialization.slopeOut;
            return this;
        }
        getMutator() {
            return this.serialize();
        }
        reduceMutator(_mutator) {
        }
    }
    FudgeCore.AnimationKey = AnimationKey;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let ANIMATION_BLENDING;
    (function (ANIMATION_BLENDING) {
        ANIMATION_BLENDING["ADDITIVE"] = "Additive";
        ANIMATION_BLENDING["OVERRIDE"] = "Override";
    })(ANIMATION_BLENDING = FudgeCore.ANIMATION_BLENDING || (FudgeCore.ANIMATION_BLENDING = {}));
    class AnimationNode {
        constructor(_options) {
            this.speed = _options?.speed ?? 1;
            this.weight = _options?.weight ?? 1;
            this.blending = _options?.blending ?? ANIMATION_BLENDING.OVERRIDE;
        }
    }
    FudgeCore.AnimationNode = AnimationNode;
    class AnimationNodeAnimation extends AnimationNode {
        constructor(_animation, _options) {
            super(_options);
            if (!_animation)
                return;
            if (!(_animation instanceof FudgeCore.Animation)) {
                this.mutator = _animation;
                return;
            }
            this.animation = _animation;
            this.offset = _options?.offset ?? 0;
            this.playmode = _options?.playmode;
            this.time = 0;
        }
        reset() {
            this.time = this.offset;
        }
        update(_deltaTime) {
            if (!this.animation)
                return;
            _deltaTime *= this.speed;
            let updatedTime = this.time + _deltaTime;
            if (this.animation.totalTime == 0)
                return;
            updatedTime = this.animation.getModalTime(updatedTime, this.playmode);
            let direction = this.animation.calculateDirection(updatedTime, this.playmode);
            this.events = this.animation.getEventsToFire(this.time, updatedTime, FudgeCore.ANIMATION_QUANTIZATION.CONTINOUS, direction);
            this.mutator = this.animation.getState(updatedTime % this.animation.totalTime, direction, FudgeCore.ANIMATION_QUANTIZATION.CONTINOUS);
            this.time = updatedTime;
            return;
        }
    }
    FudgeCore.AnimationNodeAnimation = AnimationNodeAnimation;
    class AnimationNodeBlend extends AnimationNode {
        constructor(_nodes, _options) {
            super(_options);
            this.nodes = _nodes;
        }
        reset() {
            for (const node of this.nodes)
                node.reset();
        }
        update(_deltaTime) {
            if (this.nodes.length == 0) {
                this.mutator = null;
                this.events = [];
                return;
            }
            _deltaTime *= this.speed;
            this.nodes[0].update(_deltaTime, {});
            let mutator = this.nodes[0].mutator ?? {};
            let events = this.nodes[0].events ?? [];
            for (let i = 1; i < this.nodes.length; i++) {
                const node = this.nodes[i];
                node.update(_deltaTime, mutator);
                if (!node.mutator)
                    continue;
                switch (node.blending) {
                    case ANIMATION_BLENDING.ADDITIVE:
                        mutator = FudgeCore.Animation.blendAdditive(mutator, node.mutator, node.weight);
                        break;
                    case ANIMATION_BLENDING.OVERRIDE:
                        mutator = FudgeCore.Animation.blendOverride(mutator, node.mutator, node.weight);
                        break;
                }
                events = events.concat(node.events);
            }
            this.mutator = mutator;
            this.events = events;
        }
    }
    FudgeCore.AnimationNodeBlend = AnimationNodeBlend;
    class AnimationNodeTransition extends AnimationNode {
        constructor(_animation, _options) {
            super(_options);
            this.from = _animation;
        }
        reset() {
            this.from.reset();
            this.to?.reset();
        }
        transit(_to, _duration) {
            _to.reset();
            if (this.to)
                this.from = new AnimationNodeAnimation(this.mutator);
            this.to = _to;
            this.duration = _duration;
            this.time = 0;
        }
        update(_deltaTime, _pose) {
            _deltaTime *= this.speed;
            this.time += _deltaTime;
            this.from.update(_deltaTime);
            if (!this.to) {
                this.mutator = this.from.mutator;
                this.events = this.from.events;
                return;
            }
            this.to.update(_deltaTime);
            let progress = Math.min(this.time / this.duration, 1);
            let from = this.from.mutator ?? _pose;
            let to = this.to.mutator ?? _pose;
            if (from == to) {
                this.mutator = null;
                return;
            }
            this.mutator = FudgeCore.Animation.blendOverride(from, to, progress, from == _pose || to == _pose);
            this.events = this.to.events;
            if (progress >= 1) {
                this.from = this.to;
                this.to = null;
                this.duration = null;
                this.time = null;
            }
        }
    }
    FudgeCore.AnimationNodeTransition = AnimationNodeTransition;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class AnimationSequence extends FudgeCore.Mutable {
        #classType;
        constructor(_keys = [], _valueType) {
            super();
            this.keys = _keys;
            this.keys.sort(FudgeCore.AnimationKey.compare);
            this.classType = _valueType;
            this.regenerateFunctions();
        }
        get length() {
            return this.keys.length;
        }
        get classType() {
            return this.#classType;
        }
        set classType(_type) {
            this.#classType = _type;
        }
        evaluate(_time, _out) {
            const keys = this.keys;
            if (keys.length == 1)
                return keys[0].functionOut.evaluate(_time, _out);
            let iNext = 0, iRight = keys.length - 1, iMid;
            while (iNext < iRight) {
                iMid = (iNext + iRight) >>> 1;
                if (_time < keys[iMid].time)
                    iRight = iMid;
                else
                    iNext = iMid + 1;
            }
            const key = keys[iNext - 1];
            return key.functionOut.evaluate(_time, _out);
        }
        addKey(_key) {
            this.keys.push(_key);
            this.keys.sort(FudgeCore.AnimationKey.compare);
            this.regenerateFunctions();
        }
        modifyKey(_key, _time, _value) {
            if (_time != null)
                _key.time = _time;
            if (_value != null)
                _key.value = _value;
            this.keys.sort(FudgeCore.AnimationKey.compare);
            this.regenerateFunctions();
        }
        removeKey(_key) {
            for (let i = 0; i < this.keys.length; i++) {
                if (this.keys[i] == _key) {
                    this.keys.splice(i, 1);
                    this.regenerateFunctions();
                    return;
                }
            }
        }
        findKey(_time) {
            for (let key of this.keys)
                if (key.time == _time)
                    return key;
            return null;
        }
        removeKeyAtIndex(_index) {
            if (_index < 0 || _index >= this.keys.length) {
                return null;
            }
            let ak = this.keys[_index];
            this.keys.splice(_index, 1);
            this.regenerateFunctions();
            return ak;
        }
        getKey(_index) {
            if (_index < 0 || _index >= this.keys.length)
                return null;
            return this.keys[_index];
        }
        getKeys() {
            return this.keys;
        }
        serialize() {
            let s = {
                keys: [],
                classType: this.classType.name,
                animationSequence: true
            };
            for (let i = 0; i < this.keys.length; i++) {
                s.keys[i] = this.keys[i].serialize();
            }
            return s;
        }
        async deserialize(_serialization) {
            if (_serialization.classType != null)
                this.classType = Reflect.get(FudgeCore, _serialization.classType);
            this.classType ??= Number;
            for (let i = 0; i < _serialization.keys.length; i++) {
                let k = new FudgeCore.AnimationKey();
                await k.deserialize(_serialization.keys[i]);
                this.keys[i] = k;
            }
            this.regenerateFunctions();
            return this;
        }
        regenerateFunctions(_keys = this.keys) {
            if (_keys.length == 0)
                return;
            if (!this.classType)
                throw new Error(`${this.constructor.name}: No key type specified. Cannot generate animation functions.`);
            const functionType = Reflect.get(FudgeCore, FudgeCore.AnimationFunction.name + this.classType.name);
            for (let i = 0; i < _keys.length; i++) {
                const key = _keys[i];
                const keyNext = _keys[i + 1];
                key.functionOut = new functionType(key, keyNext);
            }
        }
        reduceMutator(_mutator) { }
    }
    FudgeCore.AnimationSequence = AnimationSequence;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let AnimationSprite = (() => {
        let _classDecorators = [FudgeCore.enumerate];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.Animation;
        let _instanceExtraInitializers = [];
        let _get_texture_decorators;
        var AnimationSprite = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _get_texture_decorators = [FudgeCore.enumerate, FudgeCore.type(FudgeCore.Texture)];
                __esDecorate(this, null, _get_texture_decorators, { kind: "getter", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                AnimationSprite = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = FudgeCore.Animation.registerSubclass(AnimationSprite); }
            #texture;
            constructor(_name = "AnimationSprite") {
                super(_name, {}, 1);
                this.frames = (__runInitializers(this, _instanceExtraInitializers), 25);
                this.wrapAfter = 5;
                this.start = new FudgeCore.Vector2(0, 0);
                this.size = new FudgeCore.Vector2(80, 80);
                this.next = new FudgeCore.Vector2(80, 0);
                this.wrap = new FudgeCore.Vector2(0, 80);
                this.#texture = FudgeCore.TextureDefault.color;
                this.framesPerSecond = this.frames;
                this.create(this.texture, this.frames, this.wrapAfter, this.start, this.size, this.next, this.wrap, this.framesPerSecond);
            }
            get texture() {
                return this.#texture;
            }
            set texture(_texture) {
                this.#texture = _texture;
                this.create(this.texture, this.frames, this.wrapAfter, this.start, this.size, this.next, this.wrap, this.framesPerSecond);
            }
            create(_texture, _frames, _wrapAfter, _start, _size, _next, _wrap, _framesPerSecond) {
                this.#texture = _texture;
                this.frames = _frames;
                this.wrapAfter = _wrapAfter;
                this.start = _start;
                this.size = _size;
                this.next = _next;
                this.wrap = _wrap;
                this.framesPerSecond = _framesPerSecond;
                let scale = this.getScale();
                let positions = this.getPositions();
                let xTranslationKeys = new Array(this.frames + 1);
                let yTranslationKeys = new Array(this.frames + 1);
                for (let frame = 0; frame <= this.frames; frame++) {
                    let time = 1000 * frame / this.framesPerSecond;
                    let position = positions[Math.min(frame, this.frames - 1)];
                    xTranslationKeys[frame] = new FudgeCore.AnimationKey(time, position.x / this.#texture.texImageSource.width, FudgeCore.ANIMATION_INTERPOLATION.CONSTANT);
                    yTranslationKeys[frame] = new FudgeCore.AnimationKey(time, position.y / this.#texture.texImageSource.height, FudgeCore.ANIMATION_INTERPOLATION.CONSTANT);
                }
                let xTranslation = new FudgeCore.AnimationSequence(xTranslationKeys, Number);
                let yTranslation = new FudgeCore.AnimationSequence(yTranslationKeys, Number);
                let xScale = new FudgeCore.AnimationSequence([new FudgeCore.AnimationKey(0, scale.x, FudgeCore.ANIMATION_INTERPOLATION.CONSTANT)], Number);
                let yScale = new FudgeCore.AnimationSequence([new FudgeCore.AnimationKey(0, scale.y, FudgeCore.ANIMATION_INTERPOLATION.CONSTANT)], Number);
                this.animationStructure = {
                    "components": {
                        "ComponentMaterial": [{
                                "mtxPivot": {
                                    "translation": {
                                        x: xTranslation,
                                        y: yTranslation
                                    },
                                    "scaling": {
                                        x: xScale,
                                        y: yScale
                                    }
                                }
                            }]
                    }
                };
                this.calculateTotalTime();
            }
            getScale() {
                return new FudgeCore.Vector2(this.size.x / this.#texture.texImageSource.width, this.size.y / this.#texture.texImageSource.height);
            }
            getPositions() {
                let iNext = 0;
                let iWrap = 0;
                let positions = [];
                for (let frame = 0; frame < this.frames; frame++) {
                    positions.push(new FudgeCore.Vector2(this.start.x + iNext * this.next.x + iWrap * this.wrap.x, this.start.y + iNext * this.next.y + iWrap * this.wrap.y));
                    iNext++;
                    if (iNext >= this.wrapAfter) {
                        iNext = 0;
                        iWrap++;
                    }
                }
                return positions;
            }
            async mutate(_mutator, _selection, _dispatchMutate) {
                super.mutate(_mutator, _selection, _dispatchMutate);
                this.create(this.texture, this.frames, this.wrapAfter, this.start, this.size, this.next, this.wrap, this.framesPerSecond);
            }
            serialize() {
                let serialization = {};
                serialization.idResource = this.idResource;
                serialization.idTexture = this.#texture.idResource;
                serialization.frames = this.frames;
                serialization.wrapAfter = this.wrapAfter;
                for (let name of ["start", "size", "next", "wrap"])
                    serialization[name] = Reflect.get(this, name).serialize();
                let animationsStructure = this.animationStructure;
                this.animationStructure = {};
                serialization[super.constructor.name] = super.serialize();
                this.animationStructure = animationsStructure;
                return serialization;
            }
            async deserialize(_serialization) {
                await super.deserialize(_serialization[super.constructor.name]);
                if (_serialization.idTexture)
                    this.#texture = await FudgeCore.Project.getResource(_serialization.idTexture);
                for (let name of ["start", "size", "next", "wrap"])
                    Reflect.get(this, name).deserialize(_serialization[name]);
                this.create(this.texture, _serialization.frames, _serialization.wrapAfter, this.start, this.size, this.next, this.wrap, this.framesPerSecond);
                return this;
            }
            convertToAnimation() {
                let animation = new FudgeCore.Animation(this.name, this.animationStructure, this.framesPerSecond);
                return animation;
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return AnimationSprite = _classThis;
    })();
    FudgeCore.AnimationSprite = AnimationSprite;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let AnimationSystem;
    (function (AnimationSystem) {
        FudgeCore.Serializer.registerNamespace(AnimationSystem);
        class AnimationEventTrack {
            constructor(_times = [], _events = []) {
                this.times = _times;
                this.events = _events;
            }
        }
        AnimationSystem.AnimationEventTrack = AnimationEventTrack;
        class Animation extends FudgeCore.Mutable {
            constructor(_name = Animation.name, _duration = -1, _channels = [], _eventTrack = new AnimationEventTrack()) {
                super();
                this.name = _name;
                this.duration = _duration;
                this.channels = _channels;
                this.eventTrack = _eventTrack;
                FudgeCore.Project.register(this);
            }
            get isSerializableResource() {
                return true;
            }
            serialize() {
                const serialization = {
                    idResource: this.idResource,
                    name: this.name,
                    duration: this.duration,
                    eventTrack: {
                        times: this.eventTrack.times,
                        events: this.eventTrack.events
                    }
                };
                const channelType = this.channels[0]?.constructor;
                if (channelType)
                    serialization.channels = FudgeCore.Serializer.serializeArray(channelType, this.channels);
                return serialization;
            }
            async deserialize(_serialization) {
                this.idResource = _serialization.idResource;
                this.name = _serialization.name;
                this.duration = _serialization.duration;
                this.channels = await FudgeCore.Serializer.deserializeArray(_serialization.channels);
                this.eventTrack.times = _serialization.eventTrack.times;
                this.eventTrack.events = _serialization.eventTrack.events;
                return this;
            }
            reduceMutator(_mutator) {
                throw new Error("Method not implemented.");
            }
        }
        AnimationSystem.Animation = Animation;
    })(AnimationSystem = FudgeCore.AnimationSystem || (FudgeCore.AnimationSystem = {}));
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let AnimationSystem;
    (function (AnimationSystem) {
        class AnimationChannel {
            constructor(_targetPath, _input, _output, _interpolation) {
                this.targetPath = _targetPath;
                this.input = _input;
                this.output = _output;
                this.interpolation = _interpolation;
            }
            getElementSize() {
                let size = this.output.length / this.input.length;
                switch (this.interpolation) {
                    case FudgeCore.ANIMATION_INTERPOLATION.CUBIC:
                        size /= 3;
                        break;
                }
                return size;
            }
            createInterpolant(_result) {
                switch (this.interpolation) {
                    case FudgeCore.ANIMATION_INTERPOLATION.CONSTANT:
                        return this.createInterpolantConstant(_result);
                    case FudgeCore.ANIMATION_INTERPOLATION.LINEAR:
                        return this.createInterpolantLinear(_result);
                    case FudgeCore.ANIMATION_INTERPOLATION.CUBIC:
                        return this.createInterpolantCubic(_result);
                    default:
                        throw new Error("Unknown interpolation type: " + this.interpolation);
                }
            }
            serialize() {
                const serialization = {
                    targetPath: this.targetPath,
                    input: Array.from(this.input),
                    output: Array.from(this.output),
                    interpolation: this.interpolation
                };
                return serialization;
            }
            async deserialize(_serialization) {
                this.targetPath = _serialization.targetPath;
                this.input = new Float32Array(_serialization.input);
                this.output = new Float32Array(_serialization.output);
                this.interpolation = _serialization.interpolation;
                return this;
            }
            interpolate(_i1, _t, _out) {
                return null;
            }
            createInterpolantConstant(_result) {
                return new AnimationSystem.AnimationInterpolantConstant(this.input, this.output, this.getElementSize(), _result);
            }
            createInterpolantLinear(_result) {
                return new AnimationSystem.AnimationInterpolantLinear(this.input, this.output, this.getElementSize(), _result);
            }
            createInterpolantCubic(_result) {
                return new AnimationSystem.AnimationInterpolantCubic(this.input, this.output, this.getElementSize(), _result);
            }
        }
        AnimationSystem.AnimationChannel = AnimationChannel;
        class AnimationChannelNumber extends AnimationChannel {
        }
        AnimationSystem.AnimationChannelNumber = AnimationChannelNumber;
        class AnimationChannelVector extends AnimationChannel {
        }
        AnimationSystem.AnimationChannelVector = AnimationChannelVector;
        class AnimationChannelColor extends AnimationChannel {
        }
        AnimationSystem.AnimationChannelColor = AnimationChannelColor;
        class AnimationChannelQuaternion extends AnimationChannel {
            createInterpolantLinear(_result) {
                return new AnimationSystem.AnimationInterpolantQuaternionLinear(this.input, this.output, this.getElementSize(), _result);
            }
            createInterpolantCubic(_result) {
                return new AnimationSystem.AnimationInterpolantQuaternionCubic(this.input, this.output, this.getElementSize(), _result);
            }
        }
        AnimationSystem.AnimationChannelQuaternion = AnimationChannelQuaternion;
    })(AnimationSystem = FudgeCore.AnimationSystem || (FudgeCore.AnimationSystem = {}));
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let AnimationSystem;
    (function (AnimationSystem) {
        class AnimationInterpolant {
            constructor(_input, _output, _elementSize, _result) {
                this.input = _input;
                this.output = _output;
                this.elementSize = _elementSize;
                this.result = _result ?? new Float32Array(this.elementSize);
            }
            evaluate(_t) {
                const input = this.input;
                let i1 = 0;
                let iRight = input.length - 1;
                let iMid;
                while (i1 < iRight) {
                    iMid = (i1 + iRight) >>> 1;
                    if (_t < input[iMid])
                        iRight = iMid;
                    else
                        i1 = iMid + 1;
                }
                return this.interpolate(i1, input[i1 - 1], _t, input[i1]);
            }
        }
        AnimationSystem.AnimationInterpolant = AnimationInterpolant;
        class AnimationInterpolantConstant extends AnimationInterpolant {
            interpolate(_i1, _t0, _t, _t1) {
                const stride = this.elementSize;
                const output = this.output;
                const result = this.result;
                const offset0 = (_i1 - 1) * stride;
                for (let i = 0; i < stride; i++)
                    result[i] = output[offset0 + i];
                return result;
            }
        }
        AnimationSystem.AnimationInterpolantConstant = AnimationInterpolantConstant;
        class AnimationInterpolantLinear extends AnimationInterpolant {
            interpolate(_i1, _t0, _t, _t1) {
                const stride = this.elementSize;
                const output = this.output;
                const result = this.result;
                const offset1 = _i1 * stride;
                const offset0 = offset1 - stride;
                const weight1 = (_t - _t0) / (_t1 - _t0);
                const weight0 = 1 - weight1;
                for (let i = 0; i < stride; i++)
                    result[i] = output[offset0 + i] * weight0 + output[offset1 + i] * weight1;
                return result;
            }
        }
        AnimationSystem.AnimationInterpolantLinear = AnimationInterpolantLinear;
        class AnimationInterpolantQuaternionLinear extends AnimationInterpolant {
            interpolate(_i1, _t0, _t, _t1) {
                const stride = this.elementSize;
                const output = this.output;
                const result = this.result;
                const offset1 = _i1 * stride;
                const offset0 = offset1 - stride;
                return FudgeCore.Quaternion.SLERP_ARRAY(output, offset0, output, offset1, (_t - _t0) / (_t1 - _t0), result, 0);
            }
        }
        AnimationSystem.AnimationInterpolantQuaternionLinear = AnimationInterpolantQuaternionLinear;
        class AnimationInterpolantCubic extends AnimationInterpolant {
            constructor(_times, _output, _elementSize, _result) {
                super(_times, _output, _elementSize, _result);
                this.elementStride = _elementSize * 3;
            }
            interpolate(_i1, _t0, _t, _t1) {
                const elementStride = this.elementStride;
                const stride = this.elementSize;
                const output = this.output;
                const result = this.result;
                const t = (_t - _t0) / (_t1 - _t0);
                const t2 = t * t;
                const t3 = t2 * t;
                const h00 = 2 * t3 - 3 * t2 + 1;
                const h10 = t3 - 2 * t2 + t;
                const h01 = -2 * t3 + 3 * t2;
                const h11 = t3 - t2;
                const offsetV1 = _i1 * elementStride + stride;
                const offsetV0 = offsetV1 - elementStride;
                const offsetM0 = offsetV0 + stride;
                const offsetM1 = offsetV1 - stride;
                for (let i = 0; i < stride; i++) {
                    const v0 = output[offsetV0 + i];
                    const m0 = output[offsetM0 + i];
                    const v1 = output[offsetV1 + i];
                    const m1 = output[offsetM1 + i];
                    result[i] = h00 * v0 + h10 * m0 + h01 * v1 + h11 * m1;
                }
                return result;
            }
        }
        AnimationSystem.AnimationInterpolantCubic = AnimationInterpolantCubic;
        class AnimationInterpolantQuaternionCubic extends AnimationInterpolantCubic {
            interpolate(_i1, _t0, _t, _t1) {
                const result = super.interpolate(_i1, _t0, _t, _t1);
                return FudgeCore.Quaternion.NORMALIZE_ARRAY(result, 0, result, 0);
            }
        }
        AnimationSystem.AnimationInterpolantQuaternionCubic = AnimationInterpolantQuaternionCubic;
    })(AnimationSystem = FudgeCore.AnimationSystem || (FudgeCore.AnimationSystem = {}));
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let AnimationSystem;
    (function (AnimationSystem) {
        let ANIMATION_BLENDING;
        (function (ANIMATION_BLENDING) {
            ANIMATION_BLENDING["ADDITIVE"] = "Additive";
            ANIMATION_BLENDING["OVERRIDE"] = "Override";
        })(ANIMATION_BLENDING = AnimationSystem.ANIMATION_BLENDING || (AnimationSystem.ANIMATION_BLENDING = {}));
        class AnimationNode {
            constructor(_speed = 1, _weight = 1, _blending = ANIMATION_BLENDING.OVERRIDE) {
                this.speed = _speed;
                this.weight = _weight;
                this.blending = _blending;
            }
        }
        AnimationSystem.AnimationNode = AnimationNode;
        class AnimationNodeAnimation extends AnimationNode {
            #previousTime;
            constructor(_animation, _playmode = FudgeCore.ANIMATION_PLAYMODE.LOOP, _speed, _offset = 0, _weight, _blending) {
                super(_speed, _weight, _blending);
                this.animation = _animation;
                this.playmode = _playmode;
                this.time = 0;
                this.offset = _offset;
                this.#previousTime = 0;
                const channels = this.animation.channels;
                const nChannels = channels.length;
                const values = new Map();
                const interpolants = new Array(nChannels);
                for (let i = 0; i < nChannels; i++) {
                    const channel = channels[i];
                    const value = new Float32Array(channel.getElementSize());
                    values.set(channel.targetPath, value);
                    interpolants[i] = channel.createInterpolant(value);
                }
                this.values = values;
                this.interpolants = interpolants;
            }
            reset() {
                this.time = this.offset;
            }
            update(_deltaTime, _valuesCurrent, _valuesOriginal, _dispatchEvent) {
                const animation = this.animation;
                const duration = animation.duration;
                const time = (this.time += _deltaTime * this.speed) % duration;
                const interpolants = this.interpolants;
                const length = interpolants.length;
                for (let i = 0; i < length; i++)
                    interpolants[i].evaluate(time);
                const eventTrack = animation.eventTrack;
                const eventTrackTimes = eventTrack.times;
                if (eventTrackTimes.length == 0)
                    return;
                let min = this.#previousTime;
                let max = time;
                let minSection = Math.floor(min / duration);
                let maxSection = Math.floor(max / duration);
                min = min % duration;
                max = max % duration;
                const eventTrackEvents = eventTrack.events;
                while (minSection <= maxSection) {
                    for (let i = 0; i < eventTrackTimes.length; i++) {
                        const time = eventTrackTimes[i];
                        if (min <= time && time < max) {
                            const events = eventTrackEvents[i];
                            for (let j = 0; j < events.length; j++) {
                                const event = FudgeCore.RecyclableEvent.get(events[j]);
                                _dispatchEvent(event);
                                FudgeCore.RecyclableEvent.store(event);
                            }
                        }
                    }
                    if (minSection != maxSection)
                        min = 0;
                    minSection++;
                }
                this.#previousTime = time;
            }
        }
        AnimationSystem.AnimationNodeAnimation = AnimationNodeAnimation;
        class AnimationNodeBlend extends AnimationNode {
            constructor(_nodes, _speed = 1, _weight = 1, _blending = ANIMATION_BLENDING.OVERRIDE) {
                super(_speed, _weight, _blending);
                this.nodes = _nodes;
                const values = new Map();
                for (const node of _nodes) {
                    for (const path of node.values.keys()) {
                        if (!values.has(path))
                            values.set(path, new Float32Array(node.values.get(path).length));
                    }
                }
                this.values = values;
            }
            reset() {
                for (const node of this.nodes)
                    node.reset();
            }
            update(_deltaTime, _valuesCurrent, _valuesOriginal, _dispatchEvent) {
                _deltaTime *= this.speed;
                const valuesBlended = this.values;
                for (const path of valuesBlended.keys()) {
                    const valueOriginal = _valuesOriginal.get(path);
                    const valueBlended = valuesBlended.get(path);
                    valueBlended.set(valueOriginal);
                }
                for (let i = 0; i < this.nodes.length; i++) {
                    const node = this.nodes[i];
                    node.update(_deltaTime, valuesBlended, _valuesOriginal, _dispatchEvent);
                    const valuesNode = node.values;
                    const t = node.weight;
                    if (t == 0)
                        continue;
                    switch (node.blending) {
                        case ANIMATION_BLENDING.ADDITIVE:
                            for (const path of valuesNode.keys()) {
                                const valueBlended = valuesBlended.get(path);
                                const valueNode = valuesNode.get(path);
                                for (let j = 0; j < valueBlended.length; j++)
                                    valueBlended[j] += valueNode[j] * t;
                            }
                            break;
                        case ANIMATION_BLENDING.OVERRIDE:
                            for (const path of valuesNode.keys()) {
                                const valueBlended = valuesBlended.get(path);
                                const valueNode = valuesNode.get(path);
                                const s = 1 - t;
                                for (let j = 0; j < valueBlended.length; j++)
                                    valueBlended[j] = valueBlended[j] * s + valueNode[j] * t;
                            }
                            break;
                    }
                    ;
                }
            }
        }
        AnimationSystem.AnimationNodeBlend = AnimationNodeBlend;
        class AnimationNodeTransition extends AnimationNode {
            #valuesCached;
            constructor(_nodes, _animation, _speed = 1, _weight = 1, _blending = ANIMATION_BLENDING.OVERRIDE) {
                super(_speed, _weight, _blending);
                this.nodes = _nodes;
                this.current = _animation;
                const values = new Map();
                const valuesCached = new Map();
                for (const node of _nodes) {
                    for (const path of node.values.keys()) {
                        if (!values.has(path))
                            values.set(path, new Float32Array(node.values.get(path).length));
                        if (!valuesCached.has(path))
                            valuesCached.set(path, new Float32Array(node.values.get(path).length));
                    }
                }
                this.values = values;
                this.#valuesCached = valuesCached;
            }
            reset() {
                this.current.reset();
                this.target?.reset();
            }
            transit(_target, _duration) {
                _target?.reset();
                if (this.transition) {
                    const valuesCurrent = this.values;
                    const valuesCached = this.#valuesCached;
                    for (const path of valuesCurrent.keys())
                        valuesCached.get(path).set(valuesCurrent.get(path));
                    this.canceled = true;
                }
                this.target = _target;
                this.duration = _duration;
                this.time = 0;
                this.transition = true;
            }
            update(_deltaTime, _valuesCurrent, _valuesOriginal, _dispatchEvent) {
                _deltaTime *= this.speed;
                const current = this.current;
                const target = this.target;
                const valuesOut = this.values;
                let valuesFrom;
                let valuesTo;
                if (this.canceled) {
                    valuesFrom = this.#valuesCached;
                }
                else if (current) {
                    current.update(_deltaTime, _valuesCurrent, _valuesOriginal, _dispatchEvent);
                    valuesFrom = current.values;
                }
                else {
                    valuesFrom = _valuesCurrent;
                }
                if (target) {
                    target.update(_deltaTime, _valuesCurrent, _valuesOriginal, _dispatchEvent);
                    valuesTo = target.values;
                }
                else {
                    valuesTo = _valuesCurrent;
                }
                if (!this.transition) {
                    for (const path of valuesFrom.keys())
                        valuesOut.get(path).set(valuesFrom.get(path));
                    return;
                }
                this.time += _deltaTime;
                let progress = Math.min(this.time / this.duration, 1);
                for (const path of valuesTo.keys()) {
                    const valueFrom = valuesFrom.get(path);
                    const valueTo = valuesTo.get(path);
                    const valueOut = valuesOut.get(path);
                    if (valueOut.length == 4) {
                        FudgeCore.Quaternion.SLERP_ARRAY(valueFrom, 0, valueTo, 0, progress, valueOut, 0);
                        continue;
                    }
                    const t = progress;
                    const s = 1 - t;
                    for (let j = 0; j < valueFrom.length; j++)
                        valueOut[j] = valueFrom[j] * s + valueTo[j] * t;
                }
                if (progress >= 1) {
                    this.current = this.target;
                    this.target = null;
                    this.duration = null;
                    this.time = null;
                    this.canceled = false;
                    this.transition = false;
                }
            }
        }
        AnimationSystem.AnimationNodeTransition = AnimationNodeTransition;
    })(AnimationSystem = FudgeCore.AnimationSystem || (FudgeCore.AnimationSystem = {}));
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let AnimationSystem;
    (function (AnimationSystem) {
        class AnimationPropertyBinding {
            static #regex = /^((?:[^/]*?\/)*)?components\/([^/]+)\/(\d+)(?:\/)(.*)$/;
            constructor(_root, _path, _output) {
                this.root = _root;
                this.path = _path;
                this.output = _output;
                this.pathParsed = AnimationPropertyBinding.parsePath(_path);
            }
            static parsePath(_path) {
                const match = AnimationPropertyBinding.#regex.exec(_path);
                if (!match)
                    throw new Error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.parsePath.name}: Invalid path: ${_path}`);
                const nodePath = match[1]?.slice(0, -1).split("/");
                const componentType = match[2];
                const componentIndex = match[3];
                const targetPath = match[4].split("/");
                return { nodePath, componentType, componentIndex, targetPath };
            }
            static findNode(_rootNode, _parsedPath) {
                let node = _rootNode;
                if (_parsedPath)
                    for (let i = 0; i < _parsedPath.length; i++) {
                        node = node.getChildByName(_parsedPath[i]);
                    }
                return node;
            }
            static findTarget(_component, _parsedPath) {
                let target = _component;
                if (_parsedPath)
                    for (let i = 0; i < _parsedPath.length - 1; i++)
                        target = Reflect.get(target, _parsedPath[i]);
                return target;
            }
            bind() {
                this.get = this.#getUnbound;
                this.set = this.#setUnbound;
                this.node = AnimationPropertyBinding.findNode(this.root, this.pathParsed.nodePath);
                if (!this.node)
                    FudgeCore.Debug.error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.bind.name}: Node not found: ${this.pathParsed.nodePath}`);
                this.component = Reflect.get(this.node, "components")[this.pathParsed.componentType]?.[this.pathParsed.componentIndex];
                if (!this.component)
                    FudgeCore.Debug.error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.bind.name}: Component not found: ${this.pathParsed.componentType} at index ${this.pathParsed.componentIndex}`);
                this.target = AnimationPropertyBinding.findTarget(this.component, this.pathParsed.targetPath);
                if (!this.target)
                    FudgeCore.Debug.error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.bind.name}: Target not found: ${this.pathParsed.targetPath}`);
                this.key = this.pathParsed.targetPath[this.pathParsed.targetPath.length - 1];
                if (!(this.key in this.target))
                    FudgeCore.Debug.error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.bind.name}: Key not found: ${this.key}`);
                this.property = Reflect.get(this.target, this.key);
                if (this.property == undefined)
                    FudgeCore.Debug.error(`${AnimationPropertyBinding.name}.${AnimationPropertyBinding.bind.name}: Property is undefined: ${this.key}`);
                if (typeof this.property == "string" || typeof this.property == "number" || typeof this.property == "boolean") {
                    this.get = this.#getDirect;
                    this.set = this.#setDirect;
                }
                else if ((this.property.isArrayConvertible)) {
                    this.get = this.#getToArray;
                    this.set = this.#setFromArray;
                }
            }
            unbind() {
                this.root = null;
                this.path = null;
                this.pathParsed = null;
                this.node = null;
                this.component = null;
                this.target = null;
                this.key = null;
                this.property = null;
                this.output = null;
            }
            apply() {
                this.set(this.output, 0);
            }
            set(_source, _offset) { }
            get(_target, _offset) { }
            #getUnbound(_target, _offset) { }
            #setUnbound(_source, _offset) { }
            #getDirect(_target, _offset) {
                _target[_offset] = Reflect.get(this.target, this.key);
            }
            #setDirect(_source, _offset) {
                Reflect.set(this.target, this.key, _source[_offset]);
            }
            #getToArray(_target, _offset) {
                this.property.toArray(_target, _offset);
            }
            #setFromArray(_source, _offset) {
                this.property.fromArray(_source, _offset);
            }
        }
        AnimationSystem.AnimationPropertyBinding = AnimationPropertyBinding;
    })(AnimationSystem = FudgeCore.AnimationSystem || (FudgeCore.AnimationSystem = {}));
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let AnimationSystem;
    (function (AnimationSystem) {
        class AnimationTargetBinding {
            constructor(_target, _propertyBindings) {
                this.target = _target;
                this.propertyBindings = _propertyBindings;
                const animationMutator = {};
                for (const binding of _propertyBindings)
                    animationMutator[binding.key] = binding.output;
                this.animationMutator = animationMutator;
            }
            apply() {
                this.target.animate(this.animationMutator);
            }
        }
        AnimationSystem.AnimationTargetBinding = AnimationTargetBinding;
    })(AnimationSystem = FudgeCore.AnimationSystem || (FudgeCore.AnimationSystem = {}));
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let AnimationSystem;
    (function (AnimationSystem) {
        class ComponentAnimationGraph extends FudgeCore.Component {
            #valuesOriginal;
            #propertyBindings;
            #targetBindings;
            #dispatchEvent;
            constructor(_root) {
                super();
                this.#dispatchEvent = this.dispatchEvent.bind(this);
                this.hndRenderPrepare = () => {
                    this.update(FudgeCore.Loop.timeFrameGame);
                };
                this.onComponentAdd = () => {
                    this.node.addEventListener("renderPrepare", this.hndRenderPrepare);
                    this.bind();
                };
                this.onComponentRemove = () => {
                    this.node.removeEventListener("renderPrepare", this.hndRenderPrepare);
                    this.unbind();
                };
                this.root = _root;
                if (FudgeCore.Project.mode == FudgeCore.MODE.EDITOR)
                    return;
                this.addEventListener("componentAdd", this.onComponentAdd);
                this.addEventListener("componentRemove", this.onComponentRemove);
            }
            bind() {
                if (!this.node || !this.root)
                    return;
                const valuesRoot = this.root.values;
                const valuesOriginal = new Map();
                const propertyBindings = [];
                const targetBindings = [];
                const targetsGrouped = new Map();
                for (const path of valuesRoot.keys()) {
                    const valueRoot = valuesRoot.get(path);
                    const binding = new AnimationSystem.AnimationPropertyBinding(this.node, path, valueRoot);
                    binding.bind();
                    propertyBindings.push(binding);
                    const valueOriginal = new Float32Array(valueRoot.length);
                    valuesOriginal.set(path, valueOriginal);
                    binding.get(valueOriginal, 0);
                    let bindings = targetsGrouped.get(binding.target);
                    if (!bindings)
                        targetsGrouped.set(binding.target, bindings = []);
                    bindings.push(binding);
                }
                for (const [target, bindings] of targetsGrouped) {
                    const targetBinding = new AnimationSystem.AnimationTargetBinding(target, bindings);
                    targetBindings.push(targetBinding);
                }
                this.#valuesOriginal = valuesOriginal;
                this.#propertyBindings = propertyBindings;
                this.#targetBindings = targetBindings;
            }
            ;
            unbind() {
                const bindings = this.#propertyBindings;
                for (let i = 0; i < bindings.length; i++)
                    bindings[i].unbind();
                this.#valuesOriginal = null;
                this.#propertyBindings = null;
                this.#targetBindings = null;
            }
            update(_deltaTime) {
                if (!this.root || !this.node || !this.active)
                    return;
                const root = this.root;
                root.update(FudgeCore.Loop.timeFrameGame, this.#valuesOriginal, this.#valuesOriginal, this.#dispatchEvent);
                const targetBindings = this.#targetBindings;
                for (let i = 0; i < targetBindings.length; i++)
                    targetBindings[i].apply();
            }
        }
        AnimationSystem.ComponentAnimationGraph = ComponentAnimationGraph;
    })(AnimationSystem = FudgeCore.AnimationSystem || (FudgeCore.AnimationSystem = {}));
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Audio extends FudgeCore.Mutable {
        constructor(_url) {
            super();
            this.name = "Audio";
            this.idResource = undefined;
            this.buffer = undefined;
            this.path = undefined;
            this.url = undefined;
            this.ready = false;
            if (_url) {
                this.load(_url);
                this.name = _url.toString().split("/").pop();
            }
            FudgeCore.Project.register(this);
        }
        get isSerializableResource() {
            return true;
        }
        get isReady() {
            return this.ready;
        }
        async load(_url) {
            FudgeCore.Debug.fudge("AudioLoad", _url);
            this.url = _url;
            this.ready = false;
            this.path = new URL(this.url.toString(), FudgeCore.Project.baseURL);
            const response = await window.fetch(this.path.toString());
            const arrayBuffer = await response.arrayBuffer();
            let buffer = await FudgeCore.AudioManager.default.decodeAudioData(arrayBuffer);
            this.buffer = buffer;
            this.ready = true;
            this.dispatchEvent(new Event("ready"));
        }
        serialize() {
            return {
                url: this.url,
                idResource: this.idResource,
                name: this.name,
                type: this.type
            };
        }
        async deserialize(_serialization) {
            FudgeCore.Project.register(this, _serialization.idResource);
            await this.load(_serialization.url);
            this.name = _serialization.name;
            return this;
        }
        async mutate(_mutator, _selection, _dispatchMutate) {
            let url = _mutator.url;
            if (_mutator.url != this.url.toString())
                this.load(_mutator.url);
            delete (_mutator.url);
            super.mutate(_mutator, _selection, _dispatchMutate);
            Reflect.set(_mutator, "url", url);
        }
        reduceMutator(_mutator) {
            delete _mutator.ready;
        }
    }
    FudgeCore.Audio = Audio;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class AudioManager extends AudioContext {
        static { this.default = new AudioManager({ latencyHint: "interactive", sampleRate: 44100 }); }
        static { this.eventUpdate = new Event("updateAudioGraph"); }
        constructor(_contextOptions) {
            super(_contextOptions);
            this.graph = null;
            this.cmpListener = null;
            this.listenTo = (_graph) => {
                if (this.graph)
                    this.graph.broadcastEvent(new Event("childRemoveFromAudioGraph"));
                if (!_graph)
                    return;
                this.graph = _graph;
                this.graph.broadcastEvent(new Event("childAppendToAudioGraph"));
            };
            this.getGraphListeningTo = () => {
                return this.graph;
            };
            this.listenWith = (_cmpListener) => {
                this.cmpListener = _cmpListener;
            };
            this.update = () => {
                if (this.state != "running")
                    return;
                this.graph.broadcastEvent(AudioManager.eventUpdate);
                if (this.cmpListener)
                    this.cmpListener.update(this.listener);
            };
            this.gain = this.createGain();
            this.gain.connect(this.destination);
        }
        set volume(_value) {
            this.gain.gain.value = _value;
        }
        get volume() {
            return this.gain.gain.value;
        }
    }
    FudgeCore.AudioManager = AudioManager;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentAmbientOcclusion extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentAmbientOcclusion); }
        constructor(_sampleRadius = 16, _bias = 0.07, _attenuationConstant = 2.5, _attenuationLinear = 1, _attenuationQuadratic = 1) {
            super();
            this.sampleRadius = _sampleRadius;
            this.bias = _bias;
            this.attenuationConstant = _attenuationConstant;
            this.attenuationLinear = _attenuationLinear;
            this.attenuationQuadratic = _attenuationQuadratic;
        }
        serialize() {
            let serialization = {
                sampleRadius: this.sampleRadius,
                bias: this.bias,
                attenuationConstant: this.attenuationConstant,
                attenuationLinear: this.attenuationLinear,
                attenuationQuadratic: this.attenuationQuadratic
            };
            serialization[super.constructor.name] = super.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            this.sampleRadius = _serialization.sampleRadius;
            this.bias = _serialization.bias;
            this.attenuationConstant = _serialization.attenuationConstant;
            this.attenuationLinear = _serialization.attenuationLinear;
            this.attenuationQuadratic = _serialization.attenuationQuadratic;
            await super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
    }
    FudgeCore.ComponentAmbientOcclusion = ComponentAmbientOcclusion;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let ComponentAnimation = (() => {
        let _classDecorators = [FudgeCore.enumerate];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.Component;
        let _instanceExtraInitializers = [];
        let _get_animation_decorators;
        var ComponentAnimation = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _get_animation_decorators = [FudgeCore.enumerate, FudgeCore.type(FudgeCore.Animation)];
                __esDecorate(this, null, _get_animation_decorators, { kind: "getter", name: "animation", static: false, private: false, access: { has: obj => "animation" in obj, get: obj => obj.animation }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ComponentAnimation = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentAnimation); }
            #animation;
            #mutator;
            #scale;
            #timeLocal;
            #previous;
            constructor(_animation, _playmode = FudgeCore.ANIMATION_PLAYMODE.LOOP, _quantization = FudgeCore.ANIMATION_QUANTIZATION.CONTINOUS) {
                super();
                this.playmode = __runInitializers(this, _instanceExtraInitializers);
                this.scaleWithGameTime = true;
                this.animateInEditor = false;
                this.#scale = 1;
                this.#previous = 0;
                this.updateAnimationLoop = (_e, _time) => {
                    if (this.animation.totalTime == 0)
                        return null;
                    let time = _time || _time === 0 ? _time : this.#timeLocal.get();
                    if (this.quantization == FudgeCore.ANIMATION_QUANTIZATION.FRAMES) {
                        time = this.#previous + (1000 / this.animation.fps);
                    }
                    let direction = this.animation.calculateDirection(time, this.playmode);
                    time = this.animation.getModalTime(time, this.playmode, this.#timeLocal.getOffset());
                    this.executeEvents(this.animation.getEventsToFire(this.#previous, time, this.quantization, direction));
                    if (this.#previous != time) {
                        this.#previous = time;
                        time = time % this.animation.totalTime;
                        this.#mutator = this.animation.getState(time, direction, this.quantization, this.#mutator);
                        if (this.node)
                            this.node.applyAnimation(this.#mutator);
                        return this.#mutator;
                    }
                    return null;
                };
                this.updateScale = () => {
                    let newScale = this.#scale;
                    if (this.scaleWithGameTime)
                        newScale *= FudgeCore.Time.game.getScale();
                    this.#timeLocal.setScale(newScale);
                };
                this.playmode = _playmode;
                this.quantization = _quantization;
                this.#animation = _animation;
                this.#timeLocal = new FudgeCore.Time();
                this.#animation?.calculateTotalTime();
                this.addEventListener("componentRemove", () => this.activate(false));
                this.addEventListener("componentAdd", () => {
                    this.node.addEventListener("childRemove", () => this.activate(false));
                    this.activate(true);
                });
            }
            get animation() {
                return this.#animation;
            }
            set animation(_animation) {
                this.#animation = _animation;
                this.#mutator = undefined;
            }
            set scale(_scale) {
                this.#scale = _scale;
                this.updateScale();
            }
            get scale() {
                return this.#scale;
            }
            get time() {
                return this.#timeLocal.get() % this.animation.totalTime;
            }
            set time(_time) {
                this.jumpTo(_time);
            }
            activate(_on) {
                super.activate(_on);
                if (!this.node)
                    return;
                this.activateListeners(_on);
            }
            jumpTo(_time) {
                this.#timeLocal.set(_time);
                this.#previous = _time;
                _time = _time % this.animation.totalTime;
                let mutator = this.animation.getState(_time, this.animation.calculateDirection(_time, this.playmode), this.quantization);
                this.node.applyAnimation(mutator);
            }
            jumpToLabel(_label) {
                let time = this.animation.labels[_label];
                if (time)
                    this.jumpTo(time);
            }
            updateAnimation(_time) {
                this.#previous = undefined;
                return this.updateAnimationLoop(null, _time);
            }
            serialize() {
                let serialization = {};
                serialization[super.constructor.name] = super.serialize();
                serialization.idAnimation = this.animation.idResource;
                serialization.playmode = this.playmode;
                serialization.quantization = this.quantization;
                serialization.scale = this.scale;
                serialization.scaleWithGameTime = this.scaleWithGameTime;
                serialization.animateInEditor = this.animateInEditor;
                return serialization;
            }
            async deserialize(_serialization) {
                await super.deserialize(_serialization[super.constructor.name]);
                this.animation = await FudgeCore.Project.getResource(_serialization.idAnimation);
                this.playmode = _serialization.playmode;
                this.quantization = _serialization.quantization;
                this.scale = _serialization.scale;
                this.scaleWithGameTime = _serialization.scaleWithGameTime;
                this.animateInEditor = _serialization.animateInEditor;
                return this;
            }
            async mutate(_mutator, _selection = null, _dispatchMutate = true) {
                await super.mutate(_mutator, _selection, _dispatchMutate);
                if (typeof (_mutator.animateInEditor) !== "undefined") {
                    this.updateAnimation(0);
                    this.activateListeners(this.active);
                }
            }
            getMutatorAttributeTypes(_mutator) {
                let types = super.getMutatorAttributeTypes(_mutator);
                if (types.playmode)
                    types.playmode = FudgeCore.ANIMATION_PLAYMODE;
                if (types.quantization)
                    types.quantization = FudgeCore.ANIMATION_QUANTIZATION;
                return types;
            }
            activateListeners(_on) {
                if (_on && (FudgeCore.Project.mode != FudgeCore.MODE.EDITOR || FudgeCore.Project.mode == FudgeCore.MODE.EDITOR && this.animateInEditor)) {
                    FudgeCore.Time.game.addEventListener("timeScaled", this.updateScale);
                    this.node.addEventListener("renderPrepare", this.updateAnimationLoop);
                }
                else {
                    FudgeCore.Time.game.removeEventListener("timeScaled", this.updateScale);
                    this.node.removeEventListener("renderPrepare", this.updateAnimationLoop);
                }
            }
            executeEvents(_events) {
                for (let i = 0; i < _events.length; i++) {
                    this.dispatchEvent(new Event(_events[i]));
                }
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return ComponentAnimation = _classThis;
    })();
    FudgeCore.ComponentAnimation = ComponentAnimation;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentAnimationGraph extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentAnimationGraph); }
        constructor(_root) {
            super();
            this.update = () => {
                if (!this.root || !this.node || !this.active)
                    return;
                this.root.update(FudgeCore.Loop.timeFrameGame);
                this.root.events?.forEach(_event => this.dispatchEvent(new Event(_event)));
                this.node.applyAnimation(this.root.mutator);
            };
            this.root = _root;
            if (FudgeCore.Project.mode == FudgeCore.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd", () => this.node.addEventListener("renderPrepare", this.update));
            this.addEventListener("componentRemove", () => this.node.removeEventListener("renderPrepare", this.update));
        }
    }
    FudgeCore.ComponentAnimationGraph = ComponentAnimationGraph;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let AUDIO_PANNER;
    (function (AUDIO_PANNER) {
        AUDIO_PANNER["CONE_INNER_ANGLE"] = "coneInnerAngle";
        AUDIO_PANNER["CONE_OUTER_ANGLE"] = "coneOuterAngle";
        AUDIO_PANNER["CONE_OUTER_GAIN"] = "coneOuterGain";
        AUDIO_PANNER["DISTANCE_MODEL"] = "distanceModel";
        AUDIO_PANNER["MAX_DISTANCE"] = "maxDistance";
        AUDIO_PANNER["PANNING_MODEL"] = "panningModel";
        AUDIO_PANNER["REF_DISTANCE"] = "refDistance";
        AUDIO_PANNER["ROLLOFF_FACTOR"] = "rolloffFactor";
    })(AUDIO_PANNER = FudgeCore.AUDIO_PANNER || (FudgeCore.AUDIO_PANNER = {}));
    let AUDIO_NODE_TYPE;
    (function (AUDIO_NODE_TYPE) {
        AUDIO_NODE_TYPE[AUDIO_NODE_TYPE["SOURCE"] = 0] = "SOURCE";
        AUDIO_NODE_TYPE[AUDIO_NODE_TYPE["PANNER"] = 1] = "PANNER";
        AUDIO_NODE_TYPE[AUDIO_NODE_TYPE["GAIN"] = 2] = "GAIN";
    })(AUDIO_NODE_TYPE = FudgeCore.AUDIO_NODE_TYPE || (FudgeCore.AUDIO_NODE_TYPE = {}));
    let ComponentAudio = (() => {
        let _classSuper = FudgeCore.Component;
        let _audio_decorators;
        let _audio_initializers = [];
        let _audio_extraInitializers = [];
        return class ComponentAudio extends _classSuper {
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _audio_decorators = [FudgeCore.type(FudgeCore.Audio)];
                __esDecorate(null, null, _audio_decorators, { kind: "field", name: "audio", static: false, private: false, access: { has: obj => "audio" in obj, get: obj => obj.audio, set: (obj, value) => { obj.audio = value; } }, metadata: _metadata }, _audio_initializers, _audio_extraInitializers);
                if (_metadata)
                    Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentAudio); }
            constructor(_audio = null, _loop = false, _start = false, _audioManager = FudgeCore.AudioManager.default) {
                super();
                this.mtxPivot = FudgeCore.Matrix4x4.IDENTITY();
                this.singleton = false;
                this.audio = __runInitializers(this, _audio_initializers, void 0);
                this.gain = __runInitializers(this, _audio_extraInitializers);
                this.playing = false;
                this.listened = false;
                this.hndAudioReady = (_event) => {
                    FudgeCore.Debug.fudge("Audio start", Reflect.get(_event.target, "url"));
                    if (this.playing)
                        this.play(true);
                };
                this.hndAudioEnded = (_event) => {
                    this.playing = false;
                };
                this.handleAttach = (_event) => {
                    if (_event.type == "componentAdd") {
                        this.node.addEventListener("childAppendToAudioGraph", this.handleGraph, true);
                        this.node.addEventListener("childRemoveFromAudioGraph", this.handleGraph, true);
                        this.node.addEventListener("updateAudioGraph", this.update, true);
                        this.listened = this.node.isDescendantOf(FudgeCore.AudioManager.default.getGraphListeningTo());
                    }
                    else {
                        this.node.removeEventListener("childAppendToAudioGraph", this.handleGraph, true);
                        this.node.removeEventListener("childRemoveFromAudioGraph", this.handleGraph, true);
                        this.node.removeEventListener("updateAudioGraph", this.update, true);
                        this.listened = false;
                    }
                    this.updateConnection();
                };
                this.handleGraph = (_event) => {
                    this.listened = (_event.type == "childAppendToAudioGraph");
                    this.updateConnection();
                };
                this.update = (_event) => {
                    let mtxResult = this.mtxPivot;
                    if (this.node)
                        mtxResult = FudgeCore.Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);
                    let position = mtxResult.translation;
                    let forward = FudgeCore.Vector3.TRANSFORMATION(FudgeCore.Vector3.Z(1), mtxResult, false);
                    this.panner.positionX.value = position.x;
                    this.panner.positionY.value = position.y;
                    this.panner.positionZ.value = position.z;
                    this.panner.orientationX.value = forward.x;
                    this.panner.orientationY.value = forward.y;
                    this.panner.orientationZ.value = forward.z;
                    FudgeCore.Recycler.store(forward);
                    if (this.node)
                        FudgeCore.Recycler.store(mtxResult);
                };
                this.install(_audioManager);
                this.createSource(_audio, _loop);
                this.addEventListener("componentAdd", this.handleAttach);
                this.addEventListener("componentRemove", this.handleAttach);
                if (_start)
                    this.play(_start);
            }
            set volume(_value) {
                this.gain.gain.value = _value;
            }
            get volume() {
                return this.gain.gain.value;
            }
            set loop(_on) {
                this.source.loop = _on;
            }
            get loop() {
                return this.source.loop;
            }
            set playbackRate(_value) {
                this.source.playbackRate.value = _value;
            }
            get playbackRate() {
                return this.source.playbackRate.value;
            }
            get isPlaying() {
                return this.playing;
            }
            get isAttached() {
                return this.node != null;
            }
            get isListened() {
                return this.listened;
            }
            setAudio(_audio) {
                this.createSource(_audio, this.source.loop);
            }
            getAudio() {
                return this.audio;
            }
            setPanner(_property, _value) {
                Reflect.set(this.panner, _property, _value);
            }
            getMutatorOfNode(_type) {
                let node = this.getAudioNode(_type);
                let mutator = FudgeCore.getMutatorOfArbitrary(node);
                return mutator;
            }
            getAudioNode(_type) {
                switch (_type) {
                    case AUDIO_NODE_TYPE.SOURCE: return this.source;
                    case AUDIO_NODE_TYPE.PANNER: return this.panner;
                    case AUDIO_NODE_TYPE.GAIN: return this.gain;
                }
            }
            play(_on) {
                if (_on) {
                    if (this.audio.isReady) {
                        this.createSource(this.audio, this.source.loop, this.playbackRate);
                        this.source.start(0, 0);
                    }
                    else {
                        this.audio.addEventListener("ready", this.hndAudioReady);
                    }
                    this.source.addEventListener("ended", this.hndAudioEnded);
                }
                else
                    try {
                        this.source.stop();
                    }
                    catch (_error) { }
                this.playing = _on;
            }
            insertAudioNodes(_input, _output) {
                this.panner.disconnect(0);
                if (!_input && !_output) {
                    this.panner.connect(this.gain);
                    return;
                }
                this.panner.connect(_input);
                _output.connect(this.gain);
            }
            activate(_on) {
                super.activate(_on);
                this.updateConnection();
            }
            connect(_on) {
                if (_on)
                    this.gain.connect(this.audioManager.gain);
                else
                    this.gain.disconnect(this.audioManager.gain);
            }
            drawGizmos() {
                let mtxShape = FudgeCore.Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);
                mtxShape.scaling = new FudgeCore.Vector3(0.5, 0.5, 0.5);
                let color = FudgeCore.Color.CSS("cornflowerblue");
                FudgeCore.Gizmos.drawIcon(FudgeCore.TextureDefault.iconAudio, mtxShape, color);
                FudgeCore.Recycler.store(mtxShape);
                FudgeCore.Recycler.store(color);
            }
            ;
            serialize() {
                let serialization = super.serialize();
                serialization.idResource = this.audio?.idResource;
                serialization.playing = this.playing;
                serialization.loop = this.loop;
                serialization.volume = this.volume;
                return serialization;
            }
            async deserialize(_serialization) {
                await super.deserialize(_serialization);
                let audio = await FudgeCore.Project.getResource(_serialization.idResource);
                this.createSource(audio, _serialization.loop);
                this.volume = _serialization.volume;
                this.play(_serialization.playing);
                return this;
            }
            getMutator() {
                let mutator = super.getMutator(true);
                let audio = mutator.audio;
                delete mutator.audio;
                mutator.loop = this.loop;
                mutator.volume = this.volume;
                mutator.audio = audio;
                return mutator;
            }
            reduceMutator(_mutator) {
                super.reduceMutator(_mutator);
                delete _mutator.listened;
            }
            install(_audioManager = FudgeCore.AudioManager.default) {
                let active = this.isActive;
                this.activate(false);
                this.audioManager = _audioManager;
                this.panner = _audioManager.createPanner();
                this.gain = _audioManager.createGain();
                this.panner.connect(this.gain);
                this.gain.connect(_audioManager.gain);
                this.activate(active);
            }
            createSource(_audio, _loop, _playbackRate = 1.0) {
                if (this.source) {
                    this.source.disconnect();
                    this.source.buffer = null;
                }
                this.source = this.audioManager.createBufferSource();
                this.source.connect(this.panner);
                if (_audio) {
                    this.audio = _audio;
                    this.source.buffer = _audio.buffer;
                }
                this.source.loop = _loop;
                this.playbackRate = _playbackRate;
            }
            updateConnection() {
                try {
                    this.connect(this.isActive && this.isAttached && this.listened);
                }
                catch (_error) {
                }
            }
        };
    })();
    FudgeCore.ComponentAudio = ComponentAudio;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentAudioListener extends FudgeCore.Component {
        constructor() {
            super(...arguments);
            this.mtxPivot = FudgeCore.Matrix4x4.IDENTITY();
        }
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentAudioListener); }
        update(_listener) {
            let mtxResult = this.mtxPivot;
            if (this.node)
                mtxResult = FudgeCore.Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);
            let position = mtxResult.translation;
            let forward = FudgeCore.Vector3.TRANSFORMATION(FudgeCore.Vector3.Z(1), mtxResult, false);
            let up = FudgeCore.Vector3.TRANSFORMATION(FudgeCore.Vector3.Y(), mtxResult, false);
            if (_listener.positionX != undefined) {
                _listener.positionX.value = position.x;
                _listener.positionY.value = position.y;
                _listener.positionZ.value = position.z;
                _listener.forwardX.value = forward.x;
                _listener.forwardY.value = forward.y;
                _listener.forwardZ.value = forward.z;
                _listener.upX.value = up.x;
                _listener.upY.value = up.y;
                _listener.upZ.value = up.z;
            }
            else {
                _listener.setPosition(position.x, position.y, position.z);
                _listener.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
            }
            FudgeCore.Recycler.store(forward);
            FudgeCore.Recycler.store(up);
            if (this.node)
                FudgeCore.Recycler.store(mtxResult);
        }
    }
    FudgeCore.ComponentAudioListener = ComponentAudioListener;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentBloom extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentBloom); }
        #threshold;
        #intensity;
        #highlightDesaturation;
        constructor(_threshold = 0.95, _intensity = 1.0, _desaturateHighlights = 0.5) {
            super();
            this.#threshold = _threshold;
            this.#intensity = _intensity;
            this.#highlightDesaturation = _desaturateHighlights;
        }
        get threshold() {
            return this.#threshold;
        }
        set threshold(_value) {
            this.#threshold = FudgeCore.Calc.clamp(_value, 0, 1);
        }
        get intensity() {
            return this.#intensity;
        }
        set intensity(_value) {
            this.#intensity = Math.max(0, _value);
        }
        get highlightDesaturation() {
            return this.#highlightDesaturation;
        }
        set highlightDesaturation(_value) {
            this.#highlightDesaturation = FudgeCore.Calc.clamp(_value, 0, 1);
        }
        serialize() {
            let serialization = {
                threshold: this.#threshold,
                intensity: this.#intensity,
                desaturateHighlights: this.#highlightDesaturation,
            };
            serialization[super.constructor.name] = super.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            this.#threshold = _serialization.threshold;
            this.#intensity = _serialization.intensity;
            this.#highlightDesaturation = _serialization.desaturateHighlights;
            await super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        getMutator() {
            let mutator = super.getMutator(true);
            mutator.threshold = this.threshold;
            mutator.intensity = this.intensity;
            mutator.highlightDesaturation = this.highlightDesaturation;
            return mutator;
        }
    }
    FudgeCore.ComponentBloom = ComponentBloom;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let FIELD_OF_VIEW;
    (function (FIELD_OF_VIEW) {
        FIELD_OF_VIEW["HORIZONTAL"] = "horizontal";
        FIELD_OF_VIEW["VERTICAL"] = "vertical";
        FIELD_OF_VIEW["DIAGONAL"] = "diagonal";
    })(FIELD_OF_VIEW = FudgeCore.FIELD_OF_VIEW || (FudgeCore.FIELD_OF_VIEW = {}));
    let PROJECTION;
    (function (PROJECTION) {
        PROJECTION["CENTRAL"] = "central";
        PROJECTION["ORTHOGRAPHIC"] = "orthographic";
        PROJECTION["DIMETRIC"] = "dimetric";
        PROJECTION["STEREO"] = "stereo";
    })(PROJECTION = FudgeCore.PROJECTION || (FudgeCore.PROJECTION = {}));
    let ComponentCamera = (() => {
        let _classDecorators = [FudgeCore.enumerate];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.Component;
        let _instanceExtraInitializers = [];
        let _get_backgroundEnabled_decorators;
        let _get_projection_decorators;
        let _get_aspectRatio_decorators;
        let _get_fieldOfView_decorators;
        let _get_direction_decorators;
        let _get_near_decorators;
        let _get_far_decorators;
        var ComponentCamera = class extends _classSuper {
            static { _classThis = this; }
            constructor() {
                super(...arguments);
                this.mtxPivot = (__runInitializers(this, _instanceExtraInitializers), FudgeCore.Matrix4x4.IDENTITY());
                this.mtxWorld = FudgeCore.Matrix4x4.IDENTITY();
                this.clrBackground = new FudgeCore.Color(0, 0, 0, 1);
                this.#projection = PROJECTION.CENTRAL;
                this.#fieldOfView = 45;
                this.#aspectRatio = 1.0;
                this.#direction = FIELD_OF_VIEW.DIAGONAL;
                this.#near = 1;
                this.#far = 2000;
                this.#backgroundEnabled = true;
                this.#mtxWorldToView = FudgeCore.Matrix4x4.IDENTITY();
                this.#mtxCameraInverse = FudgeCore.Matrix4x4.IDENTITY();
                this.#mtxProjection = FudgeCore.Matrix4x4.IDENTITY();
            }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _get_backgroundEnabled_decorators = [FudgeCore.enumerate];
                _get_projection_decorators = [FudgeCore.enumerate, FudgeCore.type(PROJECTION)];
                _get_aspectRatio_decorators = [FudgeCore.enumerate];
                _get_fieldOfView_decorators = [FudgeCore.enumerate];
                _get_direction_decorators = [FudgeCore.enumerate, FudgeCore.type(FIELD_OF_VIEW)];
                _get_near_decorators = [FudgeCore.enumerate];
                _get_far_decorators = [FudgeCore.enumerate];
                __esDecorate(this, null, _get_backgroundEnabled_decorators, { kind: "getter", name: "backgroundEnabled", static: false, private: false, access: { has: obj => "backgroundEnabled" in obj, get: obj => obj.backgroundEnabled }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(this, null, _get_projection_decorators, { kind: "getter", name: "projection", static: false, private: false, access: { has: obj => "projection" in obj, get: obj => obj.projection }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(this, null, _get_aspectRatio_decorators, { kind: "getter", name: "aspectRatio", static: false, private: false, access: { has: obj => "aspectRatio" in obj, get: obj => obj.aspectRatio }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(this, null, _get_fieldOfView_decorators, { kind: "getter", name: "fieldOfView", static: false, private: false, access: { has: obj => "fieldOfView" in obj, get: obj => obj.fieldOfView }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(this, null, _get_direction_decorators, { kind: "getter", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(this, null, _get_near_decorators, { kind: "getter", name: "near", static: false, private: false, access: { has: obj => "near" in obj, get: obj => obj.near }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(this, null, _get_far_decorators, { kind: "getter", name: "far", static: false, private: false, access: { has: obj => "far" in obj, get: obj => obj.far }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ComponentCamera = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentCamera); }
            #projection;
            #fieldOfView;
            #aspectRatio;
            #direction;
            #near;
            #far;
            #backgroundEnabled;
            #mtxWorldToView;
            #mtxCameraInverse;
            #mtxProjection;
            get mtxWorldToView() {
                if (this.#mtxProjection.modified || this.mtxCameraInverse.modified) {
                    FudgeCore.Matrix4x4.PRODUCT(this.#mtxProjection, this.mtxCameraInverse, this.#mtxWorldToView);
                    this.#mtxProjection.modified = false;
                    this.mtxCameraInverse.modified = false;
                }
                return this.#mtxWorldToView;
            }
            get mtxCameraInverse() {
                if (this.mtxWorld.modified) {
                    FudgeCore.Matrix4x4.INVERSE(this.mtxWorld, this.#mtxCameraInverse);
                    this.mtxWorld.modified = false;
                }
                return this.#mtxCameraInverse;
            }
            get mtxProjection() {
                return this.#mtxProjection;
            }
            get backgroundEnabled() {
                return this.#backgroundEnabled;
            }
            get projection() {
                return this.#projection;
            }
            get aspectRatio() {
                return this.#aspectRatio;
            }
            get fieldOfView() {
                return this.#fieldOfView;
            }
            get direction() {
                return this.#direction;
            }
            get near() {
                return this.#near;
            }
            get far() {
                return this.#far;
            }
            getProjection() {
                return this.#projection;
            }
            getBackgroundEnabled() {
                return this.#backgroundEnabled;
            }
            getAspect() {
                return this.#aspectRatio;
            }
            getFieldOfView() {
                return this.#fieldOfView;
            }
            getDirection() {
                return this.#direction;
            }
            getNear() {
                return this.#near;
            }
            getFar() {
                return this.#far;
            }
            projectCentral(_aspect = this.#aspectRatio, _fieldOfView = this.#fieldOfView, _direction = this.#direction, _near = this.#near, _far = this.#far) {
                this.#aspectRatio = _aspect;
                this.#fieldOfView = _fieldOfView;
                this.#direction = _direction;
                this.#projection = PROJECTION.CENTRAL;
                this.#near = _near;
                this.#far = _far;
                FudgeCore.Matrix4x4.PROJECTION_CENTRAL(_aspect, this.#fieldOfView, _near, _far, this.#direction, this.#mtxProjection);
            }
            projectOrthographic(_left, _right, _bottom, _top) {
                const rectCanvas = FudgeCore.Render.getCanvasRectangle();
                const width = rectCanvas.width;
                const height = rectCanvas.height;
                _left = -width / 2;
                _right = width / 2;
                _bottom = height / 2;
                _top = -height / 2;
                this.#projection = PROJECTION.ORTHOGRAPHIC;
                FudgeCore.Matrix4x4.PROJECTION_ORTHOGRAPHIC(_left, _right, _bottom, _top, 400, -400, this.#mtxProjection);
            }
            getProjectionRectangle(_out = FudgeCore.Recycler.reuse(FudgeCore.Rectangle)) {
                let tanFov = Math.tan(Math.PI * this.#fieldOfView / 360);
                let tanHorizontal = 0;
                let tanVertical = 0;
                if (this.#direction == FIELD_OF_VIEW.DIAGONAL) {
                    let aspect = Math.sqrt(this.#aspectRatio);
                    tanHorizontal = tanFov * aspect;
                    tanVertical = tanFov / aspect;
                }
                else if (this.#direction == FIELD_OF_VIEW.VERTICAL) {
                    tanVertical = tanFov;
                    tanHorizontal = tanVertical * this.#aspectRatio;
                }
                else {
                    tanHorizontal = tanFov;
                    tanVertical = tanHorizontal / this.#aspectRatio;
                }
                return _out.set(0, 0, tanHorizontal * 2, tanVertical * 2);
            }
            pointWorldToClip(_pointInWorldSpace, _out = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
                const m = this.mtxWorldToView.getArray();
                const w = m[3] * _pointInWorldSpace.x + m[7] * _pointInWorldSpace.y + m[11] * _pointInWorldSpace.z + m[15];
                return FudgeCore.Vector3.TRANSFORMATION(_pointInWorldSpace, this.mtxWorldToView, true, _out).scale(1 / w);
            }
            pointClipToWorld(_pointInClipSpace, _out = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
                const mtxViewToWorld = FudgeCore.Matrix4x4.INVERSE(this.mtxWorldToView);
                const m = mtxViewToWorld.getArray();
                const w = m[3] * _pointInClipSpace.x + m[7] * _pointInClipSpace.y + m[11] * _pointInClipSpace.z + m[15];
                FudgeCore.Recycler.store(mtxViewToWorld);
                return FudgeCore.Vector3.TRANSFORMATION(_pointInClipSpace, mtxViewToWorld, true, _out).scale(1 / w);
            }
            getWorldToPixelScale(_posWorld) {
                let distance = this.mtxWorld.translation.getDistance(_posWorld);
                let scale;
                let rect = FudgeCore.Render.getRenderRectangle();
                switch (this.#direction) {
                    case FIELD_OF_VIEW.VERTICAL:
                        scale = 1 / rect.height * window.devicePixelRatio;
                        break;
                    case FIELD_OF_VIEW.HORIZONTAL:
                        scale = 1 / rect.width * window.devicePixelRatio;
                        break;
                    case FIELD_OF_VIEW.DIAGONAL:
                        scale = 1 / Math.sqrt((rect.width * rect.height) * window.devicePixelRatio);
                        break;
                }
                return scale * distance;
            }
            serialize() {
                let serialization = {
                    backgroundColor: this.clrBackground,
                    backgroundEnabled: this.#backgroundEnabled,
                    projection: this.#projection,
                    fieldOfView: this.#fieldOfView,
                    direction: this.#direction,
                    near: this.#near,
                    far: this.#far,
                    aspect: this.#aspectRatio,
                    pivot: this.mtxPivot.serialize(),
                    [super.constructor.name]: super.serialize()
                };
                return serialization;
            }
            async deserialize(_serialization) {
                await this.clrBackground.deserialize(_serialization.backgroundColor);
                this.#backgroundEnabled = _serialization.backgroundEnabled;
                this.#projection = _serialization.projection;
                this.#fieldOfView = _serialization.fieldOfView;
                this.#aspectRatio = _serialization.aspect;
                this.#direction = _serialization.direction;
                this.#near = _serialization.near ?? this.#near;
                this.#far = _serialization.far ?? this.#far;
                await this.mtxPivot.deserialize(_serialization.pivot);
                await super.deserialize(_serialization[super.constructor.name]);
                switch (this.#projection) {
                    case PROJECTION.ORTHOGRAPHIC:
                        this.projectOrthographic();
                        break;
                    case PROJECTION.CENTRAL:
                        this.projectCentral();
                        break;
                }
                return this;
            }
            async mutate(_mutator, _selection = null, _dispatchMutate = true) {
                await super.mutate(_mutator, _selection, _dispatchMutate);
                switch (this.#projection) {
                    case PROJECTION.CENTRAL:
                        this.projectCentral(this.#aspectRatio, this.#fieldOfView, this.#direction, this.#near, this.#far);
                        break;
                }
            }
            drawGizmos() {
                const mtxWorld = this.mtxWorld.clone;
                mtxWorld.scaling = mtxWorld.scaling.set(0.5, 0.5, 0.5);
                const color = FudgeCore.Color.CSS("lightgrey");
                FudgeCore.Gizmos.drawIcon(FudgeCore.TextureDefault.iconCamera, mtxWorld, color);
                FudgeCore.Recycler.store(mtxWorld);
                FudgeCore.Recycler.store(color);
            }
            drawGizmosSelected() {
                FudgeCore.Gizmos.drawWireFrustum(this.#aspectRatio, this.#fieldOfView, this.#near, this.#far, this.#direction, this.mtxWorld, FudgeCore.Color.CSS("lightgrey"));
            }
            ;
            reduceMutator(_mutator) {
                delete _mutator.transform;
                super.reduceMutator(_mutator);
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return ComponentCamera = _classThis;
    })();
    FudgeCore.ComponentCamera = ComponentCamera;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentFaceCamera extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentFaceCamera); }
        constructor() {
            super();
            this.upLocal = true;
            this.up = FudgeCore.Vector3.Y(1);
            this.restrict = false;
            this.singleton = true;
        }
    }
    FudgeCore.ComponentFaceCamera = ComponentFaceCamera;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentFog extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentFog); }
        constructor(_color = new FudgeCore.Color(1, 1, 1, 1), _near = 1, _far = 50) {
            super();
            this.color = _color;
            this.near = _near;
            this.far = _far;
        }
        serialize() {
            let serialization = {
                color: this.color.serialize(),
                near: this.near,
                far: this.far
            };
            serialization[super.constructor.name] = super.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            await this.color.deserialize(_serialization.color);
            this.near = _serialization.near ?? this.near;
            this.far = _serialization.far ?? this.far;
            await super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
    }
    FudgeCore.ComponentFog = ComponentFog;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentGraphFilter extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentGraphFilter); }
        constructor() {
            super();
            this.singleton = true;
        }
        serialize() {
            return this.getMutator();
        }
        async deserialize(_serialization) {
            this.mutate(_serialization);
            return this;
        }
    }
    FudgeCore.ComponentGraphFilter = ComponentGraphFilter;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let LIGHT_TYPE;
    (function (LIGHT_TYPE) {
        LIGHT_TYPE["AMBIENT"] = "LightAmbient";
        LIGHT_TYPE["DIRECTIONAL"] = "LightDirectional";
        LIGHT_TYPE["POINT"] = "LightPoint";
        LIGHT_TYPE["SPOT"] = "LightSpot";
    })(LIGHT_TYPE = FudgeCore.LIGHT_TYPE || (FudgeCore.LIGHT_TYPE = {}));
    let ComponentLight = (() => {
        var _a;
        let _classSuper = FudgeCore.Component;
        let _staticExtraInitializers = [];
        let _static_updateRenderbuffer_decorators;
        let _lightType_decorators;
        let _lightType_initializers = [];
        let _lightType_extraInitializers = [];
        return class ComponentLight extends _classSuper {
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _lightType_decorators = [FudgeCore.type(LIGHT_TYPE)];
                _static_updateRenderbuffer_decorators = [(_a = FudgeCore.RenderWebGLComponentLight).decorate.bind(_a)];
                __esDecorate(this, null, _static_updateRenderbuffer_decorators, { kind: "method", name: "updateRenderbuffer", static: true, private: false, access: { has: obj => "updateRenderbuffer" in obj, get: obj => obj.updateRenderbuffer }, metadata: _metadata }, null, _staticExtraInitializers);
                __esDecorate(null, null, _lightType_decorators, { kind: "field", name: "lightType", static: false, private: false, access: { has: obj => "lightType" in obj, get: obj => obj.lightType, set: (obj, value) => { obj.lightType = value; } }, metadata: _metadata }, _lightType_initializers, _lightType_extraInitializers);
                if (_metadata)
                    Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = (__runInitializers(this, _staticExtraInitializers), FudgeCore.Component.registerSubclass(ComponentLight)); }
            constructor(_lightType = LIGHT_TYPE.AMBIENT, _color = new FudgeCore.Color(1, 1, 1, 1), _intensity = 1) {
                super();
                this.lightType = __runInitializers(this, _lightType_initializers, void 0);
                this.mtxPivot = (__runInitializers(this, _lightType_extraInitializers), FudgeCore.Matrix4x4.IDENTITY());
                this.singleton = false;
                this.lightType = _lightType;
                this.color = _color;
                this.intensity = _intensity;
            }
            static updateRenderbuffer(_lights) { }
            ;
            serialize() {
                let serialization = {
                    lightType: this.lightType,
                    pivot: this.mtxPivot.serialize(),
                    color: this.color.serialize(),
                    intensity: this.intensity
                };
                serialization[super.constructor.name] = super.serialize();
                return serialization;
            }
            async deserialize(_serialization) {
                await super.deserialize(_serialization[super.constructor.name]);
                if (_serialization.lightType != undefined)
                    this.lightType = _serialization.lightType;
                await this.mtxPivot.deserialize(_serialization.pivot);
                if (_serialization.color != undefined)
                    await this.color.deserialize(_serialization.color);
                if (_serialization.intensity != undefined)
                    this.intensity = _serialization.intensity;
                let light = _serialization.light;
                if (light != undefined) {
                    for (const path in light) {
                        this.lightType = FudgeCore.Serializer.getConstructor(path).name;
                        light = light[path];
                        if (light.color != undefined)
                            await this.color.deserialize(light.color);
                        if (light.intensity != undefined)
                            this.intensity = light.intensity;
                    }
                }
                return this;
            }
            drawGizmos() {
                let mtxShape = FudgeCore.Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);
                mtxShape.scaling = new FudgeCore.Vector3(0.5, 0.5, 0.5);
                FudgeCore.Gizmos.drawIcon(FudgeCore.TextureDefault.iconLight, mtxShape, this.color);
                FudgeCore.Recycler.store(mtxShape);
            }
            ;
            drawGizmosSelected() {
                let mtxShape = FudgeCore.Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);
                let color = FudgeCore.Color.CSS("yellow");
                switch (this.lightType) {
                    case LIGHT_TYPE.DIRECTIONAL:
                        const radius = 0.5;
                        FudgeCore.Gizmos.drawWireCircle(mtxShape, color);
                        const lines = new Array(10).fill(null).map(() => FudgeCore.Recycler.get(FudgeCore.Vector3));
                        lines[0].set(0, 0, 0);
                        lines[1].set(0, 0, 1);
                        lines[2].set(0, radius, 0);
                        lines[3].set(0, radius, 1);
                        lines[6].set(0, -radius, 0);
                        lines[7].set(0, -radius, 1);
                        lines[4].set(radius, 0, 0);
                        lines[5].set(radius, 0, 1);
                        lines[8].set(-radius, 0, 0);
                        lines[9].set(-radius, 0, 1);
                        FudgeCore.Gizmos.drawLines(lines, mtxShape, color);
                        FudgeCore.Recycler.store(lines);
                        break;
                    case LIGHT_TYPE.POINT:
                        mtxShape.scale(new FudgeCore.Vector3(2, 2, 2));
                        FudgeCore.Gizmos.drawWireSphere(mtxShape, color);
                        break;
                    case LIGHT_TYPE.SPOT:
                        FudgeCore.Gizmos.drawWireCone(mtxShape, color);
                        break;
                }
                FudgeCore.Recycler.store(mtxShape);
                FudgeCore.Recycler.store(color);
            }
        };
    })();
    FudgeCore.ComponentLight = ComponentLight;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let ComponentMaterial = (() => {
        let _classSuper = FudgeCore.Component;
        let _material_decorators;
        let _material_initializers = [];
        let _material_extraInitializers = [];
        return class ComponentMaterial extends _classSuper {
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _material_decorators = [FudgeCore.type(FudgeCore.Material)];
                __esDecorate(null, null, _material_decorators, { kind: "field", name: "material", static: false, private: false, access: { has: obj => "material" in obj, get: obj => obj.material, set: (obj, value) => { obj.material = value; } }, metadata: _metadata }, _material_initializers, _material_extraInitializers);
                if (_metadata)
                    Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentMaterial); }
            constructor(_material = null) {
                super();
                this.clrPrimary = FudgeCore.Color.CSS("white");
                this.clrSecondary = FudgeCore.Color.CSS("white");
                this.mtxPivot = FudgeCore.Matrix3x3.IDENTITY();
                this.material = __runInitializers(this, _material_initializers, void 0);
                this.sortForAlpha = (__runInitializers(this, _material_extraInitializers), false);
                this.material = _material;
            }
            serialize() {
                let serialization = {
                    sortForAlpha: this.sortForAlpha,
                    clrPrimary: this.clrPrimary.serialize(),
                    clrSecondary: this.clrSecondary.serialize(),
                    pivot: this.mtxPivot.serialize(),
                    [super.constructor.name]: super.serialize(),
                    idMaterial: this.material.idResource
                };
                return serialization;
            }
            async deserialize(_serialization) {
                this.material = await FudgeCore.Project.getResource(_serialization.idMaterial);
                await this.clrPrimary.deserialize(_serialization.clrPrimary);
                await this.clrSecondary.deserialize(_serialization.clrSecondary);
                this.sortForAlpha = _serialization.sortForAlpha;
                await this.mtxPivot.deserialize(_serialization.pivot);
                await super.deserialize(_serialization[super.constructor.name]);
                return this;
            }
        };
    })();
    FudgeCore.ComponentMaterial = ComponentMaterial;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let ComponentMesh = (() => {
        let _classDecorators = [FudgeCore.enumerate];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.Component;
        let _instanceExtraInitializers = [];
        let _mesh_decorators;
        let _mesh_initializers = [];
        let _mesh_extraInitializers = [];
        let _get_mtxPivot_decorators;
        var ComponentMesh = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _mesh_decorators = [FudgeCore.type(FudgeCore.Mesh)];
                _get_mtxPivot_decorators = [FudgeCore.enumerate];
                __esDecorate(this, null, _get_mtxPivot_decorators, { kind: "getter", name: "mtxPivot", static: false, private: false, access: { has: obj => "mtxPivot" in obj, get: obj => obj.mtxPivot }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, null, _mesh_decorators, { kind: "field", name: "mesh", static: false, private: false, access: { has: obj => "mesh" in obj, get: obj => obj.mesh, set: (obj, value) => { obj.mesh = value; } }, metadata: _metadata }, _mesh_initializers, _mesh_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ComponentMesh = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentMesh); }
            #mtxPivot;
            constructor(_mesh, _skeleton) {
                super();
                this.mtxWorld = (__runInitializers(this, _instanceExtraInitializers), FudgeCore.Matrix4x4.IDENTITY());
                this.mesh = __runInitializers(this, _mesh_initializers, void 0);
                this.skeleton = __runInitializers(this, _mesh_extraInitializers);
                this.#mtxPivot = FudgeCore.Matrix4x4.IDENTITY();
                this.mesh = _mesh;
                this.skeleton = _skeleton;
            }
            get mtxPivot() {
                return this.#mtxPivot;
            }
            set mtxPivot(_mtx) {
                this.#mtxPivot = _mtx;
                this.#mtxPivot.modified = true;
            }
            get radius() {
                let scaling = this.mtxWorld.scaling;
                let scale = Math.max(Math.abs(scaling.x), Math.abs(scaling.y), Math.abs(scaling.z));
                return this.mesh.radius * scale;
            }
            serialize() {
                let serialization;
                let idMesh = this.mesh.idResource;
                if (idMesh)
                    serialization = { idMesh: idMesh };
                else
                    serialization = { mesh: FudgeCore.Serializer.serialize(this.mesh) };
                if (this.skeleton)
                    serialization.skeleton = FudgeCore.Node.PATH_FROM_TO(this, this.skeleton);
                serialization.pivot = this.mtxPivot.serialize();
                serialization[super.constructor.name] = super.serialize();
                return serialization;
            }
            async deserialize(_serialization) {
                let mesh;
                if (_serialization.idMesh)
                    mesh = await FudgeCore.Project.getResource(_serialization.idMesh);
                else
                    mesh = await FudgeCore.Serializer.deserialize(_serialization.mesh);
                this.mesh = mesh;
                if (_serialization.skeleton) {
                    const hndNodeDeserialized = () => {
                        const hndGraphDeserialized = () => {
                            this.skeleton = FudgeCore.Node.FIND(this, _serialization.skeleton);
                            this.node.removeEventListener("graphDeserialized", hndGraphDeserialized, true);
                            this.removeEventListener("nodeDeserialized", hndNodeDeserialized);
                        };
                        this.node.addEventListener("graphDeserialized", hndGraphDeserialized, true);
                    };
                    this.addEventListener("nodeDeserialized", hndNodeDeserialized);
                }
                await this.mtxPivot.deserialize(_serialization.pivot);
                await super.deserialize(_serialization[super.constructor.name]);
                return this;
            }
            drawGizmosSelected() {
                if (!this.mesh)
                    return;
                let color = FudgeCore.Color.CSS("salmon");
                FudgeCore.Gizmos.drawWireMesh(this.mesh, this.mtxWorld, color, 0.1);
                FudgeCore.Recycler.store(color);
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return ComponentMesh = _classThis;
    })();
    FudgeCore.ComponentMesh = ComponentMesh;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentOutline extends FudgeCore.Component {
        constructor(_selection = [], _color = new FudgeCore.Color(0, 0, 0, 1), _colorOccluded = new FudgeCore.Color(0, 0, 0, 0)) {
            super();
            this.selection = _selection;
            this.color = _color;
            this.colorOccluded = _colorOccluded;
        }
    }
    FudgeCore.ComponentOutline = ComponentOutline;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let PARTICLE_SYSTEM_PLAYMODE;
    (function (PARTICLE_SYSTEM_PLAYMODE) {
        PARTICLE_SYSTEM_PLAYMODE[PARTICLE_SYSTEM_PLAYMODE["LOOP"] = 0] = "LOOP";
        PARTICLE_SYSTEM_PLAYMODE[PARTICLE_SYSTEM_PLAYMODE["PLAY_ONCE"] = 1] = "PLAY_ONCE";
    })(PARTICLE_SYSTEM_PLAYMODE = FudgeCore.PARTICLE_SYSTEM_PLAYMODE || (FudgeCore.PARTICLE_SYSTEM_PLAYMODE = {}));
    let ComponentParticleSystem = (() => {
        var _a, _b;
        let _classDecorators = [FudgeCore.enumerate];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.Component;
        let _instanceExtraInitializers = [];
        let _particleSystem_decorators;
        let _particleSystem_initializers = [];
        let _particleSystem_extraInitializers = [];
        let _get_size_decorators;
        let _useRenderData_decorators;
        let _deleteRenderData_decorators;
        var ComponentParticleSystem = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _particleSystem_decorators = [FudgeCore.type(FudgeCore.ParticleSystem)];
                _get_size_decorators = [FudgeCore.enumerate];
                _useRenderData_decorators = [(_a = FudgeCore.RenderInjectorComponentParticleSystem).decorate.bind(_a)];
                _deleteRenderData_decorators = [(_b = FudgeCore.RenderInjectorComponentParticleSystem).decorate.bind(_b)];
                __esDecorate(this, null, _get_size_decorators, { kind: "getter", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(this, null, _useRenderData_decorators, { kind: "method", name: "useRenderData", static: false, private: false, access: { has: obj => "useRenderData" in obj, get: obj => obj.useRenderData }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(this, null, _deleteRenderData_decorators, { kind: "method", name: "deleteRenderData", static: false, private: false, access: { has: obj => "deleteRenderData" in obj, get: obj => obj.deleteRenderData }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, null, _particleSystem_decorators, { kind: "field", name: "particleSystem", static: false, private: false, access: { has: obj => "particleSystem" in obj, get: obj => obj.particleSystem, set: (obj, value) => { obj.particleSystem = value; } }, metadata: _metadata }, _particleSystem_initializers, _particleSystem_extraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ComponentParticleSystem = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentParticleSystem); }
            #size;
            #timeScale;
            #time;
            constructor(_particleSystem = null) {
                super();
                this.particleSystem = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _particleSystem_initializers, void 0));
                this.depthMask = __runInitializers(this, _particleSystem_extraInitializers);
                this.#timeScale = 1;
                this.hndEvent = (_event) => {
                    switch (_event.type) {
                        case "nodeDeserialized":
                        case "componentAdd":
                            FudgeCore.Time.game.addEventListener("timeScaled", this.updateTimeScale);
                            this.node.addEventListener("renderPrepare", this.update);
                            break;
                        case "componentRemove":
                            FudgeCore.Time.game.removeEventListener("timeScaled", this.updateTimeScale);
                            this.node.removeEventListener("renderPrepare", this.update);
                    }
                };
                this.update = () => {
                    if (this.time > this.duration)
                        switch (this.playMode) {
                            default:
                            case PARTICLE_SYSTEM_PLAYMODE.LOOP:
                                this.time = 0;
                                break;
                            case PARTICLE_SYSTEM_PLAYMODE.PLAY_ONCE:
                                this.time = this.duration;
                                this.timeScale = 0;
                                break;
                        }
                };
                this.updateTimeScale = () => {
                    let timeScale = this.#timeScale * FudgeCore.Time.game.getScale();
                    this.#time.setScale(timeScale);
                };
                this.particleSystem = _particleSystem;
                this.depthMask = true;
                this.blendMode = FudgeCore.BLEND.ADDITIVE;
                this.playMode = PARTICLE_SYSTEM_PLAYMODE.LOOP;
                this.duration = 1000;
                this.size = 10;
                this.#time = new FudgeCore.Time();
                this.addEventListener("componentAdd", this.hndEvent);
                this.addEventListener("componentRemove", this.hndEvent);
                this.addEventListener("nodeDeserialized", this.hndEvent);
            }
            get size() {
                return this.#size;
            }
            set size(_size) {
                this.#size = _size;
                this.deleteRenderData();
            }
            get time() {
                return this.#time.get();
            }
            set time(_time) {
                this.#time.set(_time);
            }
            get timeScale() {
                return this.#timeScale;
            }
            set timeScale(_scale) {
                this.#timeScale = _scale;
                this.updateTimeScale();
            }
            useRenderData() { }
            deleteRenderData() { }
            serialize() {
                let serialization = {
                    [super.constructor.name]: super.serialize(),
                    idParticleSystem: this.particleSystem?.idResource,
                    depthMask: this.depthMask,
                    blendMode: this.blendMode,
                    playMode: this.playMode,
                    duration: this.duration,
                    size: this.size
                };
                return serialization;
            }
            async deserialize(_serialization) {
                await super.deserialize(_serialization[super.constructor.name]);
                if (_serialization.idParticleSystem)
                    this.particleSystem = await FudgeCore.Project.getResource(_serialization.idParticleSystem);
                this.depthMask = _serialization.depthMask;
                this.blendMode = _serialization.blendMode;
                this.playMode = _serialization.playMode;
                this.duration = _serialization.duration;
                this.size = _serialization.size;
                return this;
            }
            getMutatorForAnimation() {
                let mutator = this.getMutator();
                delete mutator.particleSystem;
                delete mutator.size;
                return mutator;
            }
            getMutatorAttributeTypes(_mutator) {
                let types = super.getMutatorAttributeTypes(_mutator);
                if (types.blendMode)
                    types.blendMode = FudgeCore.BLEND;
                if (types.playMode)
                    types.playMode = PARTICLE_SYSTEM_PLAYMODE;
                return types;
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return ComponentParticleSystem = _classThis;
    })();
    FudgeCore.ComponentParticleSystem = ComponentParticleSystem;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let PICK;
    (function (PICK) {
        PICK["RADIUS"] = "radius";
        PICK["CAMERA"] = "camera";
        PICK["PHYSICS"] = "physics";
    })(PICK = FudgeCore.PICK || (FudgeCore.PICK = {}));
    class ComponentPick extends FudgeCore.Component {
        constructor() {
            super(...arguments);
            this.pick = PICK.RADIUS;
        }
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentPick); }
        pickAndDispatch(_ray, _event) {
            let cmpMesh = this.node.getComponent(FudgeCore.ComponentMesh);
            let position = cmpMesh ? cmpMesh.mtxWorld.translation : this.node.mtxWorld.translation;
            switch (this.pick) {
                case PICK.RADIUS:
                    if (_ray.getDistance(position).magnitude < this.node.radius) {
                        this.node.dispatchEvent(_event);
                    }
                    break;
                case PICK.PHYSICS:
                    let hitInfo = FudgeCore.Physics.raycast(_ray.origin, _ray.direction, FudgeCore.Vector3.DIFFERENCE(position, _ray.origin).magnitudeSquared);
                    if (hitInfo.hit)
                        this.node.dispatchEvent(_event);
                    break;
            }
        }
        serialize() {
            return this.getMutator();
        }
        async deserialize(_serialization) {
            this.mutate(_serialization);
            return this;
        }
        getMutatorAttributeTypes(_mutator) {
            let types = super.getMutatorAttributeTypes(_mutator);
            if (types.pick)
                types.pick = PICK;
            return types;
        }
        drawGizmosSelected(_cmpCamera) {
            if (this.pick != PICK.RADIUS)
                return;
            let translation = (this.node.getComponent(FudgeCore.ComponentMesh)?.mtxWorld ?? this.node.mtxWorld).translation;
            let color = FudgeCore.Color.CSS("white", 0.5);
            let scaling = FudgeCore.Recycler.get(FudgeCore.Vector3).set(this.node.radius * 2, this.node.radius * 2, this.node.radius * 2);
            let mtxWorld = FudgeCore.Matrix4x4.COMPOSITION(translation, undefined, scaling);
            FudgeCore.Gizmos.drawSphere(mtxWorld, color);
            FudgeCore.Recycler.store(mtxWorld);
            FudgeCore.Recycler.store(scaling);
            FudgeCore.Recycler.store(color);
        }
    }
    FudgeCore.ComponentPick = ComponentPick;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentScript extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentScript); }
        constructor() {
            super();
            this.singleton = false;
        }
        serialize() {
            return this.getMutator(true);
        }
        async deserialize(_serialization) {
            this.mutate(_serialization);
            return this;
        }
    }
    FudgeCore.ComponentScript = ComponentScript;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentText extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentText); }
        constructor(_text, _font) {
            super();
            this.texture = new FudgeCore.TextureText(ComponentText.name, _text, _font);
            this.mtxWorld = FudgeCore.Matrix4x4.IDENTITY();
            this.fixedSize = false;
        }
        serialize() {
            return this.getMutator();
        }
        async deserialize(_serialization) {
            this.mutate(_serialization);
            return this;
        }
        useRenderData(_mtxMeshToWorld, _cmpCamera) {
            this.texture.useRenderData(FudgeCore.TEXTURE_LOCATION.COLOR.UNIT);
            this.mtxWorld.copy(_mtxMeshToWorld);
            let scaling = FudgeCore.Recycler.get(FudgeCore.Vector3);
            if (this.fixedSize) {
                let scale = _cmpCamera.getWorldToPixelScale(_mtxMeshToWorld.translation);
                this.mtxWorld.scaling = scaling.set(this.texture.width * scale, this.texture.height * scale, 1);
                ;
            }
            else {
                let pixelsToUnits = 1 / this.texture.height;
                scaling.set(this.texture.width * pixelsToUnits, this.texture.height * pixelsToUnits, 1);
                this.mtxWorld.scale(scaling);
            }
            FudgeCore.Recycler.store(scaling);
            return this.mtxWorld;
        }
        drawGizmosSelected() {
            let mesh = this.node.getComponent(FudgeCore.ComponentMesh)?.mesh;
            let cmpMaterial = this.node.getComponent(FudgeCore.ComponentMaterial);
            if (mesh == null || cmpMaterial == null)
                return;
            FudgeCore.Gizmos.drawWireMesh(mesh, this.mtxWorld, cmpMaterial.clrPrimary);
        }
        reduceMutator(_mutator) {
            super.reduceMutator(_mutator);
            delete _mutator.texture.name;
        }
    }
    FudgeCore.ComponentText = ComponentText;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let BASE;
    (function (BASE) {
        BASE[BASE["SELF"] = 0] = "SELF";
        BASE[BASE["PARENT"] = 1] = "PARENT";
        BASE[BASE["WORLD"] = 2] = "WORLD";
        BASE[BASE["NODE"] = 3] = "NODE";
    })(BASE = FudgeCore.BASE || (FudgeCore.BASE = {}));
    class ComponentTransform extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentTransform); }
        constructor(_mtxInit = FudgeCore.Matrix4x4.IDENTITY()) {
            super();
            this.mtxLocal = _mtxInit;
        }
        rebase(_node = null) {
            let mtxResult = this.mtxLocal;
            let container = this.node;
            if (container)
                mtxResult = container.mtxWorld;
            if (_node)
                mtxResult = FudgeCore.Matrix4x4.RELATIVE(mtxResult, null, _node.mtxWorldInverse);
            this.mtxLocal = mtxResult;
        }
        transform(_mtxTransform, _base = BASE.SELF, _node = null) {
            switch (_base) {
                case BASE.SELF:
                    this.mtxLocal.multiply(_mtxTransform);
                    break;
                case BASE.PARENT:
                    this.mtxLocal.multiply(_mtxTransform, true);
                    break;
                case BASE.NODE:
                    if (!_node)
                        throw new Error("BASE.NODE requires a node given as base");
                case BASE.WORLD:
                    this.rebase(_node);
                    this.mtxLocal.multiply(_mtxTransform, true);
                    let node = this.node;
                    if (node) {
                        let mtxTemp;
                        if (_base == BASE.NODE) {
                            mtxTemp = FudgeCore.Matrix4x4.PRODUCT(_node.mtxWorld, node.mtxLocal);
                            node.mtxWorld.copy(mtxTemp);
                            FudgeCore.Recycler.store(mtxTemp);
                        }
                        let parent = node.getParent();
                        if (parent) {
                            this.rebase(node.getParent());
                            mtxTemp = FudgeCore.Matrix4x4.PRODUCT(node.getParent().mtxWorld, node.mtxLocal);
                            node.mtxWorld.copy(mtxTemp);
                            FudgeCore.Recycler.store(mtxTemp);
                        }
                    }
                    break;
            }
        }
        serialize() {
            let serialization = {
                local: this.mtxLocal.serialize(),
                [super.constructor.name]: super.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization[super.constructor.name]);
            await this.mtxLocal.deserialize(_serialization.local);
            return this;
        }
        mutate(_mutator, _selection, _dispatchMutate = true) {
            if (_mutator.active != undefined)
                this.activate(_mutator.active);
            if (_mutator.mtxLocal != undefined)
                this.mtxLocal.mutate(_mutator.mtxLocal);
            if (_dispatchMutate)
                this.dispatchEvent(new CustomEvent("mutate", { bubbles: true, detail: { mutator: _mutator } }));
        }
        reduceMutator(_mutator) {
            delete _mutator.world;
            super.reduceMutator(_mutator);
        }
    }
    FudgeCore.ComponentTransform = ComponentTransform;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class VRController {
        constructor() {
            this.cmpTransform = null;
            this.gamePad = null;
            this.thumbstickX = null;
            this.thumbstickY = null;
        }
    }
    FudgeCore.VRController = VRController;
    class ComponentVRDevice extends FudgeCore.ComponentCamera {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentVRDevice); }
        #mtxLocal;
        constructor() {
            super();
            this.rightCntrl = new VRController();
            this.leftCntrl = new VRController();
            this.addEventListener("componentAdd", this.getMtxLocalFromCmpTransform);
        }
        get mtxLocal() {
            return this.#mtxLocal;
        }
        set translation(_translation) {
            let translation = _translation.clone;
            translation.subtract(this.#mtxLocal.translation);
            translation.negate();
            FudgeCore.XRViewport.default.referenceSpace = FudgeCore.XRViewport.default.referenceSpace.getOffsetReferenceSpace(new XRRigidTransform(translation));
            this.#mtxLocal.translation = _translation;
            FudgeCore.Recycler.store(translation);
        }
        set rotation(_rotation) {
            let rotation = _rotation.clone;
            rotation.subtract(this.#mtxLocal.rotation);
            rotation.negate();
            let orientation = new FudgeCore.Quaternion();
            orientation.eulerAngles = rotation;
            FudgeCore.XRViewport.default.referenceSpace = FudgeCore.XRViewport.default.referenceSpace.getOffsetReferenceSpace(new XRRigidTransform(FudgeCore.Vector3.DIFFERENCE(this.#mtxLocal.translation, FudgeCore.Vector3.ZERO())));
            FudgeCore.XRViewport.default.referenceSpace = FudgeCore.XRViewport.default.referenceSpace.getOffsetReferenceSpace(new XRRigidTransform(FudgeCore.Vector3.ZERO(), orientation));
            FudgeCore.XRViewport.default.referenceSpace = FudgeCore.XRViewport.default.referenceSpace.getOffsetReferenceSpace(new XRRigidTransform(FudgeCore.Vector3.DIFFERENCE(FudgeCore.Vector3.ZERO(), this.#mtxLocal.translation)));
            this.#mtxLocal.rotation = _rotation;
            FudgeCore.Recycler.store(rotation);
        }
        translate(_by) {
            let translation = _by.clone;
            translation.transform(this.#mtxLocal.quaternion);
            translation.negate();
            FudgeCore.XRViewport.default.referenceSpace = FudgeCore.XRViewport.default.referenceSpace.getOffsetReferenceSpace(new XRRigidTransform(translation));
            this.#mtxLocal.translate(_by);
            FudgeCore.Recycler.store(translation);
        }
        rotate(_by) {
            let rotation = _by.clone.negate();
            let orientation = new FudgeCore.Quaternion();
            orientation.eulerAngles = rotation;
            FudgeCore.XRViewport.default.referenceSpace = FudgeCore.XRViewport.default.referenceSpace.getOffsetReferenceSpace(new XRRigidTransform(FudgeCore.Vector3.DIFFERENCE(this.#mtxLocal.translation, FudgeCore.Vector3.ZERO())));
            FudgeCore.XRViewport.default.referenceSpace = FudgeCore.XRViewport.default.referenceSpace.getOffsetReferenceSpace(new XRRigidTransform(FudgeCore.Vector3.ZERO(), orientation));
            FudgeCore.XRViewport.default.referenceSpace = FudgeCore.XRViewport.default.referenceSpace.getOffsetReferenceSpace(new XRRigidTransform(FudgeCore.Vector3.DIFFERENCE(FudgeCore.Vector3.ZERO(), this.#mtxLocal.translation)));
            this.#mtxLocal.rotate(_by);
            FudgeCore.Recycler.store(rotation);
        }
        getMtxLocalFromCmpTransform() {
            this.#mtxLocal = this.node.mtxLocal;
        }
    }
    FudgeCore.ComponentVRDevice = ComponentVRDevice;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Control extends EventTarget {
        constructor(_name, _factor = 1, _type = 0, _delay = 0) {
            super();
            this.rateDispatchOutput = 0;
            this.valuePrevious = 0;
            this.outputBase = 0;
            this.outputTarget = 0;
            this.outputPrevious = 0;
            this.outputTargetPrevious = 0;
            this.factor = 0;
            this.time = FudgeCore.Time.game;
            this.timeValueDelay = 0;
            this.timeOutputTargetSet = 0;
            this.idTimer = undefined;
            this.dispatchOutput = (_eventOrValue) => {
                if (!this.active)
                    return;
                let timer = this.time.getTimer(this.idTimer);
                let output;
                if (typeof (_eventOrValue) == "number")
                    output = _eventOrValue;
                else
                    output = this.calculateOutput();
                let outputChanged = (output != this.outputPrevious);
                if (timer) {
                    timer.active = outputChanged;
                    if (!outputChanged)
                        return;
                }
                this.outputPrevious = output;
                let event = new CustomEvent("output", {
                    detail: {
                        output: output
                    }
                });
                this.dispatchEvent(event);
            };
            this.factor = _factor;
            this.type = _type;
            this.active = true;
            this.name = _name;
            this.setDelay(_delay);
        }
        setTimebase(_time) {
            this.time = _time;
            this.calculateOutput();
        }
        setInput(_input) {
            if (!this.active)
                return;
            this.outputBase = this.calculateOutput();
            this.valuePrevious = this.getValueDelayed();
            this.outputTarget = this.factor * _input;
            this.timeOutputTargetSet = this.time.get();
            if (this.type == 2) {
                this.valuePrevious = this.outputTarget - this.outputTargetPrevious;
                this.outputTargetPrevious = this.outputTarget;
                this.outputTarget = 0;
            }
            this.dispatchEvent(new Event("input"));
            if (this.type == 2)
                this.dispatchOutput(this.valuePrevious);
            else
                this.dispatchOutput(null);
        }
        pulse(_input) {
            this.setInput(_input);
            this.setInput(0);
        }
        setDelay(_time) {
            this.timeValueDelay = Math.max(0, _time);
        }
        setRateDispatchOutput(_rateDispatchOutput = 0) {
            this.rateDispatchOutput = _rateDispatchOutput;
            this.time.deleteTimer(this.idTimer);
            this.idTimer = undefined;
            if (this.rateDispatchOutput)
                this.idTimer = this.time.setTimer(1000 / this.rateDispatchOutput, 0, this.dispatchOutput);
        }
        setFactor(_factor) {
            this.factor = _factor;
        }
        getOutput() {
            return this.calculateOutput();
        }
        calculateOutput() {
            let output = 0;
            let value = this.getValueDelayed();
            switch (this.type) {
                case 1:
                    let timeCurrent = this.time.get();
                    let timeElapsedSinceInput = timeCurrent - this.timeOutputTargetSet;
                    output = this.outputBase;
                    if (this.timeValueDelay > 0) {
                        if (timeElapsedSinceInput < this.timeValueDelay) {
                            output += 0.5 * (this.valuePrevious + value) * timeElapsedSinceInput;
                            break;
                        }
                        else {
                            output += 0.5 * (this.valuePrevious + value) * this.timeValueDelay;
                            timeElapsedSinceInput -= this.timeValueDelay;
                        }
                    }
                    output += value * timeElapsedSinceInput;
                    break;
                case 2:
                case 0:
                default:
                    output = value;
                    break;
            }
            return output;
        }
        getValueDelayed() {
            if (this.timeValueDelay > 0) {
                let timeElapsedSinceInput = this.time.get() - this.timeOutputTargetSet;
                if (timeElapsedSinceInput < this.timeValueDelay)
                    return this.valuePrevious + (this.outputTarget - this.valuePrevious) * timeElapsedSinceInput / this.timeValueDelay;
            }
            return this.outputTarget;
        }
    }
    FudgeCore.Control = Control;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Axis extends FudgeCore.Control {
        constructor() {
            super(...arguments);
            this.controls = new Map();
            this.sumPrevious = 0;
            this.hndOutputEvent = (_event) => {
                if (!this.active)
                    return;
                let control = _event.target;
                let event = new CustomEvent("output", {
                    detail: {
                        control: control,
                        input: _event.detail.output,
                        output: this.getOutput()
                    }
                });
                this.dispatchEvent(event);
            };
            this.hndInputEvent = (_event) => {
                if (!this.active)
                    return;
                let event = new Event("input", _event);
                this.dispatchEvent(event);
            };
        }
        addControl(_control) {
            this.controls.set(_control.name, _control);
            _control.addEventListener("input", this.hndInputEvent);
            _control.addEventListener("output", this.hndOutputEvent);
        }
        getControl(_name) {
            return this.controls.get(_name);
        }
        removeControl(_name) {
            let control = this.getControl(_name);
            if (control) {
                control.removeEventListener("input", this.hndInputEvent);
                control.removeEventListener("output", this.hndOutputEvent);
                this.controls.delete(_name);
            }
        }
        getOutput() {
            let sumInput = 0;
            for (let control of this.controls) {
                if (control[1].active)
                    sumInput += control[1].getOutput();
            }
            if (sumInput != this.sumPrevious)
                super.setInput(sumInput);
            this.sumPrevious = sumInput;
            return super.getOutput();
        }
    }
    FudgeCore.Axis = Axis;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Keyboard {
        static { this.keysPressed = Keyboard.initialize(); }
        static isPressedOne(_keys) {
            for (let code of _keys) {
                if (Keyboard.keysPressed[code])
                    return true;
            }
            return false;
        }
        static isPressedCombo(_keys) {
            for (let code of _keys) {
                if (!Keyboard.keysPressed[code])
                    return false;
            }
            return true;
        }
        static mapToValue(_active, _inactive, _keys, _combo = false) {
            if (!_combo && Keyboard.isPressedOne(_keys))
                return _active;
            if (Keyboard.isPressedCombo(_keys))
                return _active;
            return _inactive;
        }
        static mapToTrit(_positive, _negative) {
            return Keyboard.mapToValue(-1, 0, _negative) + Keyboard.mapToValue(1, 0, _positive);
        }
        static initialize() {
            let store = {};
            document.addEventListener("keydown", Keyboard.hndKeyInteraction);
            document.addEventListener("keyup", Keyboard.hndKeyInteraction);
            return store;
        }
        static hndKeyInteraction(_event) {
            Keyboard.keysPressed[_event.code] = (_event.type == "keydown");
        }
    }
    FudgeCore.Keyboard = Keyboard;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class DebugAlert extends FudgeCore.DebugTarget {
        static {
            this.delegates = {
                [FudgeCore.DEBUG_FILTER.INFO]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.INFO]),
                [FudgeCore.DEBUG_FILTER.LOG]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.LOG]),
                [FudgeCore.DEBUG_FILTER.WARN]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.WARN]),
                [FudgeCore.DEBUG_FILTER.ERROR]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.ERROR]),
                [FudgeCore.DEBUG_FILTER.FUDGE]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.FUDGE]),
                [FudgeCore.DEBUG_FILTER.SOURCE]: DebugAlert.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.SOURCE])
            };
        }
        static createDelegate(_headline) {
            let delegate = function (_message, ..._args) {
                let args = _args.map(_arg => _arg.toString());
                let out = _headline + " " + FudgeCore.DebugTarget.mergeArguments(_message, args);
                alert(out);
            };
            return delegate;
        }
    }
    FudgeCore.DebugAlert = DebugAlert;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class DebugDialog extends FudgeCore.DebugTarget {
    }
    FudgeCore.DebugDialog = DebugDialog;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class DebugTextArea extends FudgeCore.DebugTarget {
        static { this.textArea = document.createElement("textarea"); }
        static { this.autoScroll = true; }
        static {
            this.delegates = {
                [FudgeCore.DEBUG_FILTER.INFO]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.INFO]),
                [FudgeCore.DEBUG_FILTER.LOG]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.LOG]),
                [FudgeCore.DEBUG_FILTER.WARN]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.WARN]),
                [FudgeCore.DEBUG_FILTER.ERROR]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.ERROR]),
                [FudgeCore.DEBUG_FILTER.FUDGE]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.FUDGE]),
                [FudgeCore.DEBUG_FILTER.CLEAR]: DebugTextArea.clear,
                [FudgeCore.DEBUG_FILTER.GROUP]: DebugTextArea.group,
                [FudgeCore.DEBUG_FILTER.GROUPCOLLAPSED]: DebugTextArea.group,
                [FudgeCore.DEBUG_FILTER.GROUPEND]: DebugTextArea.groupEnd,
                [FudgeCore.DEBUG_FILTER.SOURCE]: DebugTextArea.createDelegate(FudgeCore.DEBUG_SYMBOL[FudgeCore.DEBUG_FILTER.SOURCE])
            };
        }
        static { this.groups = []; }
        static clear() {
            DebugTextArea.textArea.textContent = "";
            DebugTextArea.groups = [];
        }
        static group(_name) {
            DebugTextArea.print("▼ " + _name);
            DebugTextArea.groups.push(_name);
        }
        static groupEnd() {
            DebugTextArea.groups.pop();
        }
        static createDelegate(_headline) {
            let delegate = function (_message, ..._args) {
                DebugTextArea.print(_headline + " " + FudgeCore.DebugTarget.mergeArguments(_message, _args));
            };
            return delegate;
        }
        static getIndentation(_level) {
            let result = "";
            for (let i = 0; i < _level; i++)
                result += "| ";
            return result;
        }
        static print(_text) {
            DebugTextArea.textArea.textContent += DebugTextArea.getIndentation(DebugTextArea.groups.length) + _text + "\n";
            if (DebugTextArea.autoScroll)
                DebugTextArea.textArea.scrollTop = DebugTextArea.textArea.scrollHeight;
        }
    }
    FudgeCore.DebugTextArea = DebugTextArea;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let KEYBOARD_CODE;
    (function (KEYBOARD_CODE) {
        KEYBOARD_CODE["A"] = "KeyA";
        KEYBOARD_CODE["B"] = "KeyB";
        KEYBOARD_CODE["C"] = "KeyC";
        KEYBOARD_CODE["D"] = "KeyD";
        KEYBOARD_CODE["E"] = "KeyE";
        KEYBOARD_CODE["F"] = "KeyF";
        KEYBOARD_CODE["G"] = "KeyG";
        KEYBOARD_CODE["H"] = "KeyH";
        KEYBOARD_CODE["I"] = "KeyI";
        KEYBOARD_CODE["J"] = "KeyJ";
        KEYBOARD_CODE["K"] = "KeyK";
        KEYBOARD_CODE["L"] = "KeyL";
        KEYBOARD_CODE["M"] = "KeyM";
        KEYBOARD_CODE["N"] = "KeyN";
        KEYBOARD_CODE["O"] = "KeyO";
        KEYBOARD_CODE["P"] = "KeyP";
        KEYBOARD_CODE["Q"] = "KeyQ";
        KEYBOARD_CODE["R"] = "KeyR";
        KEYBOARD_CODE["S"] = "KeyS";
        KEYBOARD_CODE["T"] = "KeyT";
        KEYBOARD_CODE["U"] = "KeyU";
        KEYBOARD_CODE["V"] = "KeyV";
        KEYBOARD_CODE["W"] = "KeyW";
        KEYBOARD_CODE["X"] = "KeyX";
        KEYBOARD_CODE["Y"] = "KeyY";
        KEYBOARD_CODE["Z"] = "KeyZ";
        KEYBOARD_CODE["ESC"] = "Escape";
        KEYBOARD_CODE["ZERO"] = "Digit0";
        KEYBOARD_CODE["ONE"] = "Digit1";
        KEYBOARD_CODE["TWO"] = "Digit2";
        KEYBOARD_CODE["THREE"] = "Digit3";
        KEYBOARD_CODE["FOUR"] = "Digit4";
        KEYBOARD_CODE["FIVE"] = "Digit5";
        KEYBOARD_CODE["SIX"] = "Digit6";
        KEYBOARD_CODE["SEVEN"] = "Digit7";
        KEYBOARD_CODE["EIGHT"] = "Digit8";
        KEYBOARD_CODE["NINE"] = "Digit9";
        KEYBOARD_CODE["MINUS"] = "Minus";
        KEYBOARD_CODE["EQUAL"] = "Equal";
        KEYBOARD_CODE["BACKSPACE"] = "Backspace";
        KEYBOARD_CODE["TABULATOR"] = "Tab";
        KEYBOARD_CODE["BRACKET_LEFT"] = "BracketLeft";
        KEYBOARD_CODE["BRACKET_RIGHT"] = "BracketRight";
        KEYBOARD_CODE["ENTER"] = "Enter";
        KEYBOARD_CODE["CTRL_LEFT"] = "ControlLeft";
        KEYBOARD_CODE["SEMICOLON"] = "Semicolon";
        KEYBOARD_CODE["QUOTE"] = "Quote";
        KEYBOARD_CODE["BACK_QUOTE"] = "Backquote";
        KEYBOARD_CODE["SHIFT_LEFT"] = "ShiftLeft";
        KEYBOARD_CODE["BACKSLASH"] = "Backslash";
        KEYBOARD_CODE["COMMA"] = "Comma";
        KEYBOARD_CODE["PERIOD"] = "Period";
        KEYBOARD_CODE["SLASH"] = "Slash";
        KEYBOARD_CODE["SHIFT_RIGHT"] = "ShiftRight";
        KEYBOARD_CODE["NUMPAD_MULTIPLY"] = "NumpadMultiply";
        KEYBOARD_CODE["ALT_LEFT"] = "AltLeft";
        KEYBOARD_CODE["SPACE"] = "Space";
        KEYBOARD_CODE["CAPS_LOCK"] = "CapsLock";
        KEYBOARD_CODE["F1"] = "F1";
        KEYBOARD_CODE["F2"] = "F2";
        KEYBOARD_CODE["F3"] = "F3";
        KEYBOARD_CODE["F4"] = "F4";
        KEYBOARD_CODE["F5"] = "F5";
        KEYBOARD_CODE["F6"] = "F6";
        KEYBOARD_CODE["F7"] = "F7";
        KEYBOARD_CODE["F8"] = "F8";
        KEYBOARD_CODE["F9"] = "F9";
        KEYBOARD_CODE["F10"] = "F10";
        KEYBOARD_CODE["PAUSE"] = "Pause";
        KEYBOARD_CODE["SCROLL_LOCK"] = "ScrollLock";
        KEYBOARD_CODE["NUMPAD7"] = "Numpad7";
        KEYBOARD_CODE["NUMPAD8"] = "Numpad8";
        KEYBOARD_CODE["NUMPAD9"] = "Numpad9";
        KEYBOARD_CODE["NUMPAD_SUBTRACT"] = "NumpadSubtract";
        KEYBOARD_CODE["NUMPAD4"] = "Numpad4";
        KEYBOARD_CODE["NUMPAD5"] = "Numpad5";
        KEYBOARD_CODE["NUMPAD6"] = "Numpad6";
        KEYBOARD_CODE["NUMPAD_ADD"] = "NumpadAdd";
        KEYBOARD_CODE["NUMPAD1"] = "Numpad1";
        KEYBOARD_CODE["NUMPAD2"] = "Numpad2";
        KEYBOARD_CODE["NUMPAD3"] = "Numpad3";
        KEYBOARD_CODE["NUMPAD0"] = "Numpad0";
        KEYBOARD_CODE["NUMPAD_DECIMAL"] = "NumpadDecimal";
        KEYBOARD_CODE["PRINT_SCREEN"] = "PrintScreen";
        KEYBOARD_CODE["INTL_BACK_SLASH"] = "IntlBackSlash";
        KEYBOARD_CODE["F11"] = "F11";
        KEYBOARD_CODE["F12"] = "F12";
        KEYBOARD_CODE["NUMPAD_EQUAL"] = "NumpadEqual";
        KEYBOARD_CODE["F13"] = "F13";
        KEYBOARD_CODE["F14"] = "F14";
        KEYBOARD_CODE["F15"] = "F15";
        KEYBOARD_CODE["F16"] = "F16";
        KEYBOARD_CODE["F17"] = "F17";
        KEYBOARD_CODE["F18"] = "F18";
        KEYBOARD_CODE["F19"] = "F19";
        KEYBOARD_CODE["F20"] = "F20";
        KEYBOARD_CODE["F21"] = "F21";
        KEYBOARD_CODE["F22"] = "F22";
        KEYBOARD_CODE["F23"] = "F23";
        KEYBOARD_CODE["F24"] = "F24";
        KEYBOARD_CODE["KANA_MODE"] = "KanaMode";
        KEYBOARD_CODE["LANG2"] = "Lang2";
        KEYBOARD_CODE["LANG1"] = "Lang1";
        KEYBOARD_CODE["INTL_RO"] = "IntlRo";
        KEYBOARD_CODE["CONVERT"] = "Convert";
        KEYBOARD_CODE["NON_CONVERT"] = "NonConvert";
        KEYBOARD_CODE["INTL_YEN"] = "IntlYen";
        KEYBOARD_CODE["NUMPAD_COMMA"] = "NumpadComma";
        KEYBOARD_CODE["UNDO"] = "Undo";
        KEYBOARD_CODE["PASTE"] = "Paste";
        KEYBOARD_CODE["MEDIA_TRACK_PREVIOUS"] = "MediaTrackPrevious";
        KEYBOARD_CODE["CUT"] = "Cut";
        KEYBOARD_CODE["COPY"] = "Copy";
        KEYBOARD_CODE["MEDIA_TRACK_NEXT"] = "MediaTrackNext";
        KEYBOARD_CODE["NUMPAD_ENTER"] = "NumpadEnter";
        KEYBOARD_CODE["CTRL_RIGHT"] = "ControlRight";
        KEYBOARD_CODE["AUDIO_VOLUME_MUTE"] = "AudioVolumeMute";
        KEYBOARD_CODE["LAUNCH_APP2"] = "LaunchApp2";
        KEYBOARD_CODE["MEDIA_PLAY_PAUSE"] = "MediaPlayPause";
        KEYBOARD_CODE["MEDIA_STOP"] = "MediaStop";
        KEYBOARD_CODE["EJECT"] = "Eject";
        KEYBOARD_CODE["AUDIO_VOLUME_DOWN"] = "AudioVolumeDown";
        KEYBOARD_CODE["VOLUME_DOWN"] = "VolumeDown";
        KEYBOARD_CODE["AUDIO_VOLUME_UP"] = "AudioVolumeUp";
        KEYBOARD_CODE["VOLUME_UP"] = "VolumeUp";
        KEYBOARD_CODE["BROWSER_HOME"] = "BrowserHome";
        KEYBOARD_CODE["NUMPAD_DIVIDE"] = "NumpadDivide";
        KEYBOARD_CODE["ALT_RIGHT"] = "AltRight";
        KEYBOARD_CODE["HELP"] = "Help";
        KEYBOARD_CODE["NUM_LOCK"] = "NumLock";
        KEYBOARD_CODE["HOME"] = "Home";
        KEYBOARD_CODE["ARROW_UP"] = "ArrowUp";
        KEYBOARD_CODE["ARROW_RIGHT"] = "ArrowRight";
        KEYBOARD_CODE["ARROW_DOWN"] = "ArrowDown";
        KEYBOARD_CODE["ARROW_LEFT"] = "ArrowLeft";
        KEYBOARD_CODE["END"] = "End";
        KEYBOARD_CODE["PAGE_UP"] = "PageUp";
        KEYBOARD_CODE["PAGE_DOWN"] = "PageDown";
        KEYBOARD_CODE["INSERT"] = "Insert";
        KEYBOARD_CODE["DELETE"] = "Delete";
        KEYBOARD_CODE["META_LEFT"] = "Meta_Left";
        KEYBOARD_CODE["OS_LEFT"] = "OSLeft";
        KEYBOARD_CODE["META_RIGHT"] = "MetaRight";
        KEYBOARD_CODE["OS_RIGHT"] = "OSRight";
        KEYBOARD_CODE["CONTEXT_MENU"] = "ContextMenu";
        KEYBOARD_CODE["POWER"] = "Power";
        KEYBOARD_CODE["BROWSER_SEARCH"] = "BrowserSearch";
        KEYBOARD_CODE["BROWSER_FAVORITES"] = "BrowserFavorites";
        KEYBOARD_CODE["BROWSER_REFRESH"] = "BrowserRefresh";
        KEYBOARD_CODE["BROWSER_STOP"] = "BrowserStop";
        KEYBOARD_CODE["BROWSER_FORWARD"] = "BrowserForward";
        KEYBOARD_CODE["BROWSER_BACK"] = "BrowserBack";
        KEYBOARD_CODE["LAUNCH_APP1"] = "LaunchApp1";
        KEYBOARD_CODE["LAUNCH_MAIL"] = "LaunchMail";
        KEYBOARD_CODE["LAUNCH_MEDIA_PLAYER"] = "LaunchMediaPlayer";
        KEYBOARD_CODE["FN"] = "Fn";
        KEYBOARD_CODE["AGAIN"] = "Again";
        KEYBOARD_CODE["PROPS"] = "Props";
        KEYBOARD_CODE["SELECT"] = "Select";
        KEYBOARD_CODE["OPEN"] = "Open";
        KEYBOARD_CODE["FIND"] = "Find";
        KEYBOARD_CODE["WAKE_UP"] = "WakeUp";
        KEYBOARD_CODE["NUMPAD_PARENT_LEFT"] = "NumpadParentLeft";
        KEYBOARD_CODE["NUMPAD_PARENT_RIGHT"] = "NumpadParentRight";
        KEYBOARD_CODE["SLEEP"] = "Sleep";
    })(KEYBOARD_CODE = FudgeCore.KEYBOARD_CODE || (FudgeCore.KEYBOARD_CODE = {}));
    let KEYBOARD_CODE_DE;
    (function (KEYBOARD_CODE_DE) {
        KEYBOARD_CODE_DE["Z"] = "KeyY";
        KEYBOARD_CODE_DE["Y"] = "KeyZ";
        KEYBOARD_CODE_DE["\u00D6"] = "Semicolon";
        KEYBOARD_CODE_DE["\u00C4"] = "Quote";
        KEYBOARD_CODE_DE["\u00DC"] = "BracketLeft";
        KEYBOARD_CODE_DE["HASH"] = "Backslash";
        KEYBOARD_CODE_DE["PLUS"] = "BracketRight";
        KEYBOARD_CODE_DE["\u00DF"] = "Minus";
        KEYBOARD_CODE_DE["ACUTE"] = "Equal";
        KEYBOARD_CODE_DE["LESS_THAN"] = "IntlBackSlash";
        KEYBOARD_CODE_DE["MINUS"] = "Slash";
    })(KEYBOARD_CODE_DE = FudgeCore.KEYBOARD_CODE_DE || (FudgeCore.KEYBOARD_CODE_DE = {}));
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class EventTimer {
        constructor(_timer, ..._arguments) {
            this.type = "\u0192lapse";
            this.firstCall = true;
            this.lastCall = false;
            this.target = _timer;
            this.arguments = _arguments;
            this.firstCall = true;
        }
    }
    FudgeCore.EventTimer = EventTimer;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let EVENT_TOUCH;
    (function (EVENT_TOUCH) {
        EVENT_TOUCH["MOVE"] = "touchMove";
        EVENT_TOUCH["TAP"] = "touchTap";
        EVENT_TOUCH["NOTCH"] = "touchNotch";
        EVENT_TOUCH["LONG"] = "touchLong";
        EVENT_TOUCH["DOUBLE"] = "touchDouble";
        EVENT_TOUCH["PINCH"] = "touchPinch";
        EVENT_TOUCH["ROTATE"] = "touchRotate";
    })(EVENT_TOUCH = FudgeCore.EVENT_TOUCH || (FudgeCore.EVENT_TOUCH = {}));
    class TouchEventDispatcher {
        constructor(_target, _radiusTap = 5, _radiusNotch = 50, _timeDouble = 200, _timerLong = 1000) {
            this.posStart = FudgeCore.Vector2.ZERO();
            this.posNotch = FudgeCore.Vector2.ZERO();
            this.posPrev = FudgeCore.Vector2.ZERO();
            this.moved = false;
            this.time = new FudgeCore.Time();
            this.pinchDistance = 0;
            this.pinchTolerance = 1;
            this.hndEvent = (_event) => {
                _event.preventDefault();
                let touchFirst = _event.touches[0];
                let position = _event.touches.length == 0 ? this.posPrev : this.calcAveragePosition(_event.touches);
                let offset;
                switch (_event.type) {
                    case "touchstart":
                        this.moved = false;
                        this.startGesture(position);
                        if (_event.touches.length == 2) {
                            let pinch = new FudgeCore.Vector2(_event.touches[1].clientX - touchFirst.clientX, _event.touches[1].clientY - touchFirst.clientY);
                            this.pinchDistance = pinch.magnitude;
                        }
                        let dispatchLong = (_eventTimer) => {
                            if (this.moved)
                                return;
                            this.moved = true;
                            this.target.dispatchEvent(new CustomEvent(EVENT_TOUCH.LONG, {
                                bubbles: true, detail: { position: position, touches: _event.touches }
                            }));
                        };
                        this.timerLong?.clear();
                        this.timerLong = new FudgeCore.Timer(this.time, this.timeLong, 1, dispatchLong);
                        break;
                    case "touchend":
                        this.timerLong?.clear();
                        if (_event.touches.length > 0) {
                            this.startGesture(position);
                            break;
                        }
                        let dispatchTap = (_eventTimer) => {
                            this.target.dispatchEvent(new CustomEvent(EVENT_TOUCH.TAP, {
                                bubbles: true, detail: { position: position, touches: _event.touches }
                            }));
                        };
                        if (this.timerDouble?.active) {
                            this.timerDouble.clear();
                            this.target.dispatchEvent(new CustomEvent(EVENT_TOUCH.DOUBLE, {
                                bubbles: true, detail: { position: position, touches: _event.touches }
                            }));
                        }
                        else if (!this.moved)
                            this.timerDouble = new FudgeCore.Timer(this.time, this.timeDouble, 1, dispatchTap);
                        break;
                    case "touchmove":
                        this.detectPinch(_event, position);
                        offset = FudgeCore.Vector2.DIFFERENCE(this.posPrev, this.posStart);
                        this.moved ||= (offset.magnitude > this.radiusTap);
                        let movement = FudgeCore.Vector2.DIFFERENCE(position, this.posPrev);
                        this.target.dispatchEvent(new CustomEvent(EVENT_TOUCH.MOVE, {
                            bubbles: true, detail: { position: position, touches: _event.touches, offset: offset, movement: movement }
                        }));
                        offset = FudgeCore.Vector2.DIFFERENCE(position, this.posNotch);
                        if (offset.magnitude > this.radiusNotch) {
                            let cardinal = Math.abs(offset.x) > Math.abs(offset.y) ?
                                FudgeCore.Vector2.X(offset.x < 0 ? -1 : 1) :
                                FudgeCore.Vector2.Y(offset.y < 0 ? -1 : 1);
                            this.target.dispatchEvent(new CustomEvent(EVENT_TOUCH.NOTCH, {
                                bubbles: true, detail: { position: position, touches: _event.touches, offset: offset, cardinal: cardinal, movement: movement }
                            }));
                            this.posNotch = position;
                        }
                        break;
                    default:
                        break;
                }
                this.posPrev.set(position.x, position.y);
            };
            this.detectPinch = (_event, _position) => {
                if (_event.touches.length != 2)
                    return;
                let t = _event.touches;
                let pinch = new FudgeCore.Vector2(t[1].clientX - t[0].clientX, t[1].clientY - t[0].clientY);
                let pinchDistance = pinch.magnitude;
                let pinchDelta = pinchDistance - this.pinchDistance;
                if (Math.abs(pinchDelta) > this.pinchTolerance)
                    this.target.dispatchEvent(new CustomEvent(EVENT_TOUCH.PINCH, {
                        bubbles: true, detail: { position: _position, touches: _event.touches, pinch: pinch, pinchDelta: pinchDelta }
                    }));
                this.pinchDistance = pinchDistance;
            };
            this.target = _target;
            this.radiusTap = _radiusTap;
            this.radiusNotch = _radiusNotch;
            this.timeDouble = _timeDouble;
            this.timeLong = _timerLong;
            this.activate(true);
        }
        activate(_on) {
            if (_on) {
                this.target.addEventListener("touchstart", this.hndEvent);
                this.target.addEventListener("touchend", this.hndEvent);
                this.target.addEventListener("touchmove", this.hndEvent);
                return;
            }
            this.target.removeEventListener("touchstart", this.hndEvent);
            this.target.removeEventListener("touchend", this.hndEvent);
            this.target.removeEventListener("touchmove", this.hndEvent);
        }
        startGesture(_position) {
            this.posNotch.set(_position.x, _position.y);
            this.posStart.set(_position.x, _position.y);
        }
        calcAveragePosition(_touches) {
            let average = FudgeCore.Vector2.ZERO();
            for (let touch of _touches) {
                average.x += touch.clientX;
                average.y += touch.clientY;
            }
            average.scale(1 / _touches.length);
            return average;
        }
    }
    FudgeCore.TouchEventDispatcher = TouchEventDispatcher;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Graph extends FudgeCore.Node {
        constructor(_name = "Graph") {
            super(_name);
            this.idResource = undefined;
            this.hndMutate = async (_event) => {
                _event.detail.path = Reflect.get(_event, "path");
                this.dispatchEvent(new CustomEvent("mutateGraph", { detail: _event.detail }));
                this.dispatchEvent(new CustomEvent("graphMutated", { detail: _event.detail }));
            };
            this.addEventListener("mutate", this.hndMutate);
        }
        get isSerializableResource() {
            return true;
        }
        get type() {
            return this.constructor.name;
        }
        serialize() {
            let serialization = super.serialize();
            serialization.idResource = this.idResource;
            serialization.type = this.type;
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            FudgeCore.Project.register(this, _serialization.idResource);
            await FudgeCore.Project.resyncGraphInstances(this);
            this.broadcastEvent(new Event("graphDeserialized"));
            FudgeCore.Debug.log("Deserialized", this.name);
            return this;
        }
    }
    FudgeCore.Graph = Graph;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class GraphGLTF extends FudgeCore.mixinSerializableResourceExternal(FudgeCore.Graph) {
        async load(_url = this.url, _name = this.name) {
            this.url = _url;
            this.name = _name;
            return FudgeCore.GLTFLoader.loadResource(this);
        }
        serialize() {
            const serializationExternal = super.serialize();
            const serializationNode = FudgeCore.Node.prototype.serialize.call(this);
            delete serializationNode.components[FudgeCore.ComponentSkeleton.name];
            delete serializationNode.children;
            return { ...serializationNode, ...serializationExternal };
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            await FudgeCore.Graph.prototype.deserialize.call(this, _serialization);
            return this;
        }
    }
    FudgeCore.GraphGLTF = GraphGLTF;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class GraphInstance extends FudgeCore.Node {
        static { this.count = 0; }
        #idSource;
        #deserializeFromSource;
        constructor(_graph) {
            super("GraphInstance");
            this.#idSource = undefined;
            this.#deserializeFromSource = true;
            this.hndMutationGraph = async (_event) => {
                if (this.isFiltered())
                    return;
                await this.reflectMutation(_event, _event.currentTarget, this, _event.detail.path);
                this.dispatchEvent(new Event("mutateGraphDone", { bubbles: true }));
            };
            this.hndMutationInstance = async (_event) => {
                if (this.isFiltered())
                    return;
                await this.reflectMutation(_event, this, this.get(), Reflect.get(_event, "path"));
                this.get().dispatchEvent(new CustomEvent("mutate", { detail: _event.detail }));
            };
            this.addEventListener("mutate", this.hndMutationInstance);
            if (!_graph)
                return;
            this.#idSource = _graph.idResource;
        }
        get idSource() {
            return this.#idSource;
        }
        async reset() {
            let resource = await FudgeCore.Project.getResource(this.#idSource);
            await this.set(resource);
        }
        serialize() {
            let filter = this.getComponent(FudgeCore.ComponentGraphFilter);
            let serialization = {};
            if (filter && filter.isActive) {
                serialization = super.serialize();
                let graph = this.get();
                if (graph instanceof FudgeCore.GraphGLTF) {
                    delete serialization.components[FudgeCore.ComponentSkeleton.name];
                    delete serialization.children;
                    serialization.url = graph.url;
                }
            }
            else {
                serialization.deserializeFromSource = true;
            }
            serialization.idSource = this.#idSource;
            return serialization;
        }
        async deserialize(_serialization) {
            this.#idSource = _serialization.idSource ?? _serialization.idResource;
            if (!_serialization.deserializeFromSource) {
                let graph = await FudgeCore.Project.getResource(this.#idSource);
                if (graph instanceof FudgeCore.GraphGLTF)
                    await FudgeCore.GLTFLoader.loadResource(this, _serialization.url);
                await super.deserialize(_serialization);
                this.#deserializeFromSource = false;
            }
            let graph = this.get();
            if (graph)
                await this.connectToGraph();
            else {
                FudgeCore.Debug.log("Register for resync", _serialization.name, this.name);
                FudgeCore.Project.registerGraphInstanceForResync(this);
            }
            return this;
        }
        async connectToGraph() {
            let graph = this.get();
            if (this.#deserializeFromSource)
                await this.set(graph);
        }
        async set(_graph) {
            this.#idSource = _graph.idResource;
            let currentGraph = this.get();
            if (currentGraph) {
                currentGraph.removeEventListener("mutateGraph", this.hndMutationGraph);
            }
            let serialization = FudgeCore.Serializer.serialize(_graph);
            for (let path in serialization) {
                await this.deserialize(serialization[path]);
                break;
            }
            FudgeCore.Debug.fudge("GraphInstance set to " + this.name + " | " + "Instance count: " + GraphInstance.count++);
            _graph.addEventListener("mutateGraph", this.hndMutationGraph);
            this.broadcastEvent(new Event("graphInstantiated"));
        }
        get() {
            return FudgeCore.Project.resources[this.#idSource];
        }
        async reflectMutation(_event, _source, _destination, _path) {
            for (let node of _path)
                if (node instanceof GraphInstance)
                    if (node == this)
                        break;
                    else {
                        console.log("Sync aborted, target already synced");
                        return;
                    }
            let index = _path.indexOf(_source);
            for (let i = index - 1; i >= 0; i--) {
                let childIndex = _path[i].getParent().findChild(_path[i]);
                _destination = _destination.getChild(childIndex);
            }
            let cmpMutate = _destination.getComponent(_event.detail.component.constructor);
            if (cmpMutate)
                await cmpMutate.mutate(_event.detail.mutator, null, false);
        }
        isFiltered() {
            let cmpFilter = this.getComponent(FudgeCore.ComponentGraphFilter);
            return (cmpFilter && cmpFilter.isActive);
        }
    }
    FudgeCore.GraphInstance = GraphInstance;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let Coat = (() => {
        var _a, _b, _c, _d;
        let _classSuper = FudgeCore.Mutable;
        let _staticExtraInitializers = [];
        let _static_resetRenderData_decorators;
        let _static_updateRenderbuffer_decorators;
        let _static_updateRenderData_decorators;
        let _static_useRenderData_decorators;
        return class Coat extends _classSuper {
            constructor() {
                super(...arguments);
                this.alphaClip = 0.01;
            }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _static_resetRenderData_decorators = [(_a = FudgeCore.RenderManagerCoat).decorate.bind(_a)];
                _static_updateRenderbuffer_decorators = [(_b = FudgeCore.RenderManagerCoat).decorate.bind(_b)];
                _static_updateRenderData_decorators = [(_c = FudgeCore.RenderManagerCoat).decorate.bind(_c)];
                _static_useRenderData_decorators = [(_d = FudgeCore.RenderManagerCoat).decorate.bind(_d)];
                __esDecorate(this, null, _static_resetRenderData_decorators, { kind: "method", name: "resetRenderData", static: true, private: false, access: { has: obj => "resetRenderData" in obj, get: obj => obj.resetRenderData }, metadata: _metadata }, null, _staticExtraInitializers);
                __esDecorate(this, null, _static_updateRenderbuffer_decorators, { kind: "method", name: "updateRenderbuffer", static: true, private: false, access: { has: obj => "updateRenderbuffer" in obj, get: obj => obj.updateRenderbuffer }, metadata: _metadata }, null, _staticExtraInitializers);
                __esDecorate(this, null, _static_updateRenderData_decorators, { kind: "method", name: "updateRenderData", static: true, private: false, access: { has: obj => "updateRenderData" in obj, get: obj => obj.updateRenderData }, metadata: _metadata }, null, _staticExtraInitializers);
                __esDecorate(this, null, _static_useRenderData_decorators, { kind: "method", name: "useRenderData", static: true, private: false, access: { has: obj => "useRenderData" in obj, get: obj => obj.useRenderData }, metadata: _metadata }, null, _staticExtraInitializers);
                if (_metadata)
                    Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(this, _staticExtraInitializers);
            }
            static resetRenderData() { }
            ;
            static updateRenderbuffer() { }
            ;
            static updateRenderData(_coat) { }
            ;
            static useRenderData(_coat) { }
            ;
            updateRenderData() {
                Coat.updateRenderData(this);
            }
            ;
            useRenderData() {
                Coat.useRenderData(this);
            }
            ;
            serialize() {
                return {
                    alphaClip: this.alphaClip
                };
            }
            async deserialize(_serialization) {
                if (_serialization.alphaClip !== undefined)
                    this.alphaClip = _serialization.alphaClip;
                return this;
            }
            reduceMutator(_mutator) {
                delete _mutator.renderData;
            }
        };
    })();
    FudgeCore.Coat = Coat;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class CoatColored extends FudgeCore.Coat {
        constructor(_color = new FudgeCore.Color()) {
            super();
            this.color = _color;
        }
        serialize() {
            let serialization = super.serialize();
            serialization.color = this.color.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            await this.color.deserialize(_serialization.color);
            return this;
        }
    }
    FudgeCore.CoatColored = CoatColored;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class CoatRemissive extends FudgeCore.CoatColored {
        #metallic;
        constructor(_color = new FudgeCore.Color(), _diffuse = 1, _specular = 0.5, _intensity = 0.7, _metallic = 0.0) {
            super(_color);
            this.diffuse = _diffuse;
            this.specular = _specular;
            this.intensity = _intensity;
            this.metallic = _metallic;
        }
        get metallic() {
            return this.#metallic;
        }
        set metallic(_value) {
            this.#metallic = FudgeCore.Calc.clamp(_value, 0, 1);
        }
        serialize() {
            let serialization = super.serialize();
            serialization.diffuse = this.diffuse;
            serialization.specular = this.specular;
            serialization.intensity = this.intensity;
            serialization.metallic = this.metallic;
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            this.diffuse = _serialization.diffuse;
            this.specular = _serialization.specular;
            this.intensity = _serialization.intensity ?? this.intensity;
            this.metallic = _serialization.metallic ?? this.metallic;
            return this;
        }
        getMutator() {
            let mutator = super.getMutator(true);
            delete mutator.diffuse;
            delete mutator.specular;
            delete mutator.intensity;
            mutator.diffuse = this.diffuse;
            mutator.specular = this.specular;
            mutator.intensity = this.intensity;
            mutator.metallic = this.metallic;
            return mutator;
        }
    }
    FudgeCore.CoatRemissive = CoatRemissive;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let CoatTextured = (() => {
        let _classSuper = FudgeCore.CoatColored;
        let _texture_decorators;
        let _texture_initializers = [];
        let _texture_extraInitializers = [];
        return class CoatTextured extends _classSuper {
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _texture_decorators = [FudgeCore.type(FudgeCore.Texture)];
                __esDecorate(null, null, _texture_decorators, { kind: "field", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture, set: (obj, value) => { obj.texture = value; } }, metadata: _metadata }, _texture_initializers, _texture_extraInitializers);
                if (_metadata)
                    Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            constructor(_color = new FudgeCore.Color(), _texture = FudgeCore.TextureDefault.color) {
                super(_color);
                this.texture = __runInitializers(this, _texture_initializers, void 0);
                __runInitializers(this, _texture_extraInitializers);
                this.texture = _texture;
            }
            serialize() {
                let serialization = super.serialize();
                serialization.idTexture = this.texture.idResource;
                return serialization;
            }
            async deserialize(_serialization) {
                await super.deserialize(_serialization);
                if (_serialization.idTexture)
                    this.texture = await FudgeCore.Project.getResource(_serialization.idTexture);
                return this;
            }
        };
    })();
    FudgeCore.CoatTextured = CoatTextured;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class CoatRemissiveTextured extends FudgeCore.CoatTextured {
        #metallic;
        constructor(_color = new FudgeCore.Color(), _texture = FudgeCore.TextureDefault.color, _diffuse = 1, _specular = 0.5, _intensity = 0.7, _metallic = 0.0) {
            super(_color, _texture);
            this.diffuse = _diffuse;
            this.specular = _specular;
            this.intensity = _intensity;
            this.metallic = _metallic;
        }
        get metallic() {
            return this.#metallic;
        }
        set metallic(_value) {
            this.#metallic = FudgeCore.Calc.clamp(_value, 0, 1);
        }
        serialize() {
            let serialization = super.serialize();
            serialization.diffuse = this.diffuse;
            serialization.specular = this.specular;
            serialization.intensity = this.intensity;
            serialization.metallic = this.metallic;
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            this.diffuse = _serialization.diffuse;
            this.specular = _serialization.specular;
            this.intensity = _serialization.intensity ?? this.intensity;
            this.metallic = _serialization.metallic ?? this.metallic;
            return this;
        }
        getMutator() {
            let mutator = super.getMutator(true);
            delete mutator.diffuse;
            delete mutator.specular;
            delete mutator.intensity;
            mutator.diffuse = this.diffuse;
            mutator.specular = this.specular;
            mutator.intensity = this.intensity;
            mutator.metallic = this.metallic;
            return mutator;
        }
    }
    FudgeCore.CoatRemissiveTextured = CoatRemissiveTextured;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let CoatRemissiveTexturedNormals = (() => {
        let _classSuper = FudgeCore.CoatRemissiveTextured;
        let _normalMap_decorators;
        let _normalMap_initializers = [];
        let _normalMap_extraInitializers = [];
        return class CoatRemissiveTexturedNormals extends _classSuper {
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _normalMap_decorators = [FudgeCore.type(FudgeCore.Texture)];
                __esDecorate(null, null, _normalMap_decorators, { kind: "field", name: "normalMap", static: false, private: false, access: { has: obj => "normalMap" in obj, get: obj => obj.normalMap, set: (obj, value) => { obj.normalMap = value; } }, metadata: _metadata }, _normalMap_initializers, _normalMap_extraInitializers);
                if (_metadata)
                    Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            constructor(_color = new FudgeCore.Color(), _texture = FudgeCore.TextureDefault.color, _normalMap = FudgeCore.TextureDefault.normal, _diffuse, _specular = undefined, _intensity = undefined, _metallic = undefined) {
                super(_color, _texture, _diffuse, _specular, _intensity, _metallic);
                this.normalMap = __runInitializers(this, _normalMap_initializers, void 0);
                __runInitializers(this, _normalMap_extraInitializers);
                this.normalMap = _normalMap;
            }
            serialize() {
                let serialization = super.serialize();
                serialization.idNormalMap = this.normalMap.idResource;
                return serialization;
            }
            async deserialize(_serialization) {
                await super.deserialize(_serialization);
                if (_serialization.idNormalMap)
                    this.normalMap = await FudgeCore.Project.getResource(_serialization.idNormalMap);
                return this;
            }
        };
    })();
    FudgeCore.CoatRemissiveTexturedNormals = CoatRemissiveTexturedNormals;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class CoatToon extends mixinCoatToon(FudgeCore.CoatRemissive) {
        constructor(_color = new FudgeCore.Color(), _texToon = FudgeCore.TextureDefault.toon, _diffuse, _specular = 1.2, _intensity, _metallic) {
            super(_color, _diffuse, _specular, _intensity, _metallic);
            this.texToon = _texToon;
        }
    }
    FudgeCore.CoatToon = CoatToon;
    class CoatToonTextured extends mixinCoatToon(FudgeCore.CoatRemissiveTextured) {
        constructor(_color = new FudgeCore.Color(), _texture = FudgeCore.TextureDefault.color, _texToon = FudgeCore.TextureDefault.toon, _diffuse, _specular = 1.2, _intensity, _metallic) {
            super(_color, _texture, _diffuse, _specular, _intensity, _metallic);
            this.texToon = _texToon;
        }
    }
    FudgeCore.CoatToonTextured = CoatToonTextured;
    function mixinCoatToon(_base) {
        let CoatToon = (() => {
            let _classSuper = _base;
            let _texToon_decorators;
            let _texToon_initializers = [];
            let _texToon_extraInitializers = [];
            return class CoatToon extends _classSuper {
                static {
                    const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                    _texToon_decorators = [FudgeCore.type(FudgeCore.Texture)];
                    __esDecorate(null, null, _texToon_decorators, { kind: "field", name: "texToon", static: false, private: false, access: { has: obj => "texToon" in obj, get: obj => obj.texToon, set: (obj, value) => { obj.texToon = value; } }, metadata: _metadata }, _texToon_initializers, _texToon_extraInitializers);
                    if (_metadata)
                        Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                }
                serialize() {
                    let serialization = super.serialize();
                    serialization.idTexToon = this.texToon.idResource;
                    return serialization;
                }
                async deserialize(_serialization) {
                    await super.deserialize(_serialization);
                    if (_serialization.idTexToon)
                        this.texToon = await FudgeCore.Project.getResource(_serialization.idTexToon);
                    return this;
                }
                constructor() {
                    super(...arguments);
                    this.texToon = __runInitializers(this, _texToon_initializers, void 0);
                    __runInitializers(this, _texToon_extraInitializers);
                }
            };
        })();
        return CoatToon;
    }
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Color extends FudgeCore.Mutable {
        static {
            this.crc2 = (() => {
                const canvas = document.createElement("canvas");
                canvas.width = 1;
                canvas.height = 1;
                const crc2 = canvas.getContext("2d", { willReadFrequently: true });
                crc2.globalCompositeOperation = "copy";
                return crc2;
            })();
        }
        constructor(_r = 1, _g = 1, _b = 1, _a = 1) {
            super();
            this.set(_r, _g, _b, _a);
        }
        static hsl2rgb(_hue, _saturation, _lightness, _out) {
            _hue = _hue % 360;
            if (_hue < 0)
                _hue += 360;
            _out.r = Color.#f(0, _hue, _saturation, _lightness);
            _out.g = Color.#f(8, _hue, _saturation, _lightness);
            _out.b = Color.#f(4, _hue, _saturation, _lightness);
            return _out;
        }
        static rgb2hsl(_red, _green, _blue, _out) {
            let max = Math.max(_red, _green, _blue);
            let min = Math.min(_red, _green, _blue);
            let hue = NaN;
            let saturation = 0;
            let lightness = (min + max) / 2;
            let d = max - min;
            if (d !== 0) {
                saturation = (lightness === 0 || lightness === 1)
                    ? 0
                    : (max - lightness) / Math.min(lightness, 1 - lightness);
                switch (max) {
                    case _red:
                        hue = (_green - _blue) / d + (_green < _blue ? 6 : 0);
                        break;
                    case _green:
                        hue = (_blue - _red) / d + 2;
                        break;
                    case _blue: hue = (_red - _green) / d + 4;
                }
                hue = hue * 60;
            }
            if (saturation < 0) {
                hue += 180;
                saturation = Math.abs(saturation);
            }
            if (hue >= 360)
                hue -= 360;
            _out.h = hue;
            _out.s = saturation;
            _out.l = lightness;
            return _out;
        }
        static CSS(_keyword, _alpha, _out = FudgeCore.Recycler.reuse(Color)) {
            Color.crc2.fillStyle = _keyword;
            const value = Color.crc2.fillStyle;
            if (value.startsWith("#")) {
                return _out.set(parseInt(value.slice(1, 3), 16) / 255, parseInt(value.slice(3, 5), 16) / 255, parseInt(value.slice(5, 7), 16) / 255, _alpha ?? 1);
            }
            if (value.startsWith("rgba")) {
                const iOpenParenthesis = value.indexOf("(");
                const iComma0 = value.indexOf(",", iOpenParenthesis);
                const iComma1 = value.indexOf(",", iComma0 + 1);
                const iComma2 = value.indexOf(",", iComma1 + 1);
                const iCloseParenthesis = value.indexOf(")", iOpenParenthesis);
                return _out.set(parseFloat(value.slice(iOpenParenthesis + 1, iComma0)) / 255, parseFloat(value.slice(iComma0 + 2, iComma1)) / 255, parseFloat(value.slice(iComma1 + 2, iComma2)) / 255, _alpha ?? parseFloat(value.slice(iComma2 + 2, iCloseParenthesis)));
            }
            if (value.startsWith("color(srgb")) {
                const iOpenParenthesis = value.indexOf("(");
                const iSpace0 = value.indexOf(" ", iOpenParenthesis);
                const iSpace1 = value.indexOf(" ", iSpace0 + 1);
                const iSpace2 = value.indexOf(" ", iSpace1 + 1);
                const iSpace3 = value.indexOf(" ", iSpace2 + 1);
                const iCloseParenthesis = value.indexOf(")", iOpenParenthesis);
                const hasAlpha = iSpace3 != -1;
                return _out.set(parseFloat(value.slice(iSpace0 + 1, iSpace1)), parseFloat(value.slice(iSpace1 + 1, iSpace2)), parseFloat(value.slice(iSpace2 + 1, hasAlpha ? iSpace3 : iCloseParenthesis)), _alpha ?? (hasAlpha ? parseFloat(value.slice(iSpace3 + 3, iCloseParenthesis)) : 1));
            }
            throw new Error(`${Color.name}.${Color.CSS.name}: Unrecognized color format: "${_keyword}"`);
        }
        static SUM(_clrA, _clrB, _out = FudgeCore.Recycler.reuse(Color)) {
            return _out.set(_clrA.r + _clrB.r, _clrA.g + _clrB.g, _clrA.b + _clrB.b, _clrA.a + _clrB.a);
        }
        static DIFFERENCE(_clrA, _clrB, _out = FudgeCore.Recycler.reuse(Color)) {
            return _out.set(Math.max(0, _clrA.r - _clrB.r), Math.max(0, _clrA.g - _clrB.g), Math.max(0, _clrA.b - _clrB.b), Math.max(0, _clrA.a - _clrB.a));
        }
        static PRODUCT(_clrA, _clrB, _out = FudgeCore.Recycler.reuse(Color)) {
            return _out.set(_clrA.r * _clrB.r, _clrA.g * _clrB.g, _clrA.b * _clrB.b, _clrA.a * _clrB.a);
        }
        static SCALE(_vector, _scaling, _out = FudgeCore.Recycler.reuse(Color)) {
            return _out.set(_vector.r * _scaling, _vector.g * _scaling, _vector.b * _scaling, _vector.a * _scaling);
        }
        static #f(_n, _hue, _saturation, _light) {
            let k = (_n + _hue / 30) % 12;
            let a = _saturation * Math.min(_light, 1 - _light);
            return _light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        }
        get isArrayConvertible() {
            return true;
        }
        get clone() {
            return FudgeCore.Recycler.reuse(Color).copy(this);
        }
        copy(_color) {
            this.r = _color.r;
            this.g = _color.g;
            this.b = _color.b;
            this.a = _color.a;
            return this;
        }
        set(_r, _g, _b, _a) {
            this.r = _r;
            this.g = _g;
            this.b = _b;
            this.a = _a;
            return this;
        }
        recycle() {
            this.r = 1;
            this.g = 1;
            this.b = 1;
            this.a = 1;
        }
        equals(_compare, _tolerance = Number.EPSILON) {
            return Math.abs(this.r - _compare.r) <= _tolerance &&
                Math.abs(this.g - _compare.g) <= _tolerance &&
                Math.abs(this.b - _compare.b) <= _tolerance &&
                Math.abs(this.a - _compare.a) <= _tolerance;
        }
        setCSS(_keyword, _alpha) {
            return Color.CSS(_keyword, _alpha ?? this.a, this);
        }
        setClamped(_r, _g, _b, _a) {
            return this.set(FudgeCore.Calc.clamp(_r, 0, 1), FudgeCore.Calc.clamp(_g, 0, 1), FudgeCore.Calc.clamp(_b, 0, 1), FudgeCore.Calc.clamp(_a, 0, 1));
            ;
        }
        setHSL(_hue, _saturation, _lightness, _alpha) {
            if (_alpha != undefined)
                this.a = _alpha;
            return Color.hsl2rgb(_hue, _saturation, _lightness, this);
        }
        setBytes(_r, _g, _b, _a) {
            return this.set(_r / 255, _g / 255, _b / 255, _a / 255);
        }
        setHex(_hex) {
            if (_hex.startsWith("#"))
                _hex = _hex.slice(1);
            this.r = parseInt(_hex.slice(0, 2), 16) / 255;
            this.g = parseInt(_hex.slice(2, 4), 16) / 255;
            this.b = parseInt(_hex.slice(4, 6), 16) / 255;
            if (_hex.length >= 8)
                this.a = parseInt(_hex.slice(6, 8), 16) / 255;
            return this;
        }
        getCSS() {
            return this.toCSS();
        }
        getHex() {
            return this.toHex();
        }
        add(_color) {
            this.r += _color.r;
            this.g += _color.g;
            this.b += _color.b;
            this.a += _color.a;
            return this;
        }
        subtract(_color) {
            this.r = Math.max(0, this.r - _color.r);
            this.g = Math.max(0, this.g - _color.g);
            this.b = Math.max(0, this.b - _color.b);
            this.a = Math.max(0, this.a - _color.a);
            return this;
        }
        multiply(_color) {
            this.r *= _color.r;
            this.g *= _color.g;
            this.b *= _color.b;
            this.a *= _color.a;
            return this;
        }
        scale(_scaling) {
            this.r *= _scaling;
            this.g *= _scaling;
            this.b *= _scaling;
            this.a *= _scaling;
            return this;
        }
        map(_function, _out = FudgeCore.Recycler.reuse(Color)) {
            _out.r = _function(this.r, 0, "r", this);
            _out.g = _function(this.g, 1, "g", this);
            _out.b = _function(this.b, 2, "b", this);
            _out.a = _function(this.a, 3, "a", this);
            return _out;
        }
        apply(_function) {
            this.r = _function(this.r, 0, "r", this);
            this.g = _function(this.g, 1, "g", this);
            this.b = _function(this.b, 2, "b", this);
            this.a = _function(this.a, 3, "a", this);
            return this;
        }
        fromArray(_array, _offset = 0) {
            this.r = _array[_offset];
            this.g = _array[_offset + 1];
            this.b = _array[_offset + 2];
            this.a = _array[_offset + 3];
            return this;
        }
        toArray(_out = new Array(4), _offset = 0) {
            _out[_offset] = this.r;
            _out[_offset + 1] = this.g;
            _out[_offset + 2] = this.b;
            _out[_offset + 3] = this.a;
            return _out;
        }
        toString() {
            return `(r: ${this.r.toFixed(3)}, g: ${this.g.toFixed(3)}, b: ${this.b.toFixed(3)}, a: ${this.a.toFixed(3)})`;
        }
        toHex() {
            return `${(this.r * 255).toString(16).padStart(2, "0")}${(this.g * 255).toString(16).padStart(2, "0")}${(this.b * 255).toString(16).padStart(2, "0")}${(this.a * 255).toString(16).padStart(2, "0")}`;
        }
        toCSS() {
            return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
        }
        serialize() {
            let serialization = this.getMutator(true);
            serialization.toJSON = () => { return `[${this.r}, ${this.g}, ${this.b}, ${this.a}]`; };
            return serialization;
        }
        async deserialize(_serialization) {
            if (typeof (_serialization) == "string") {
                [this.r, this.g, this.b, this.a] = JSON.parse(_serialization);
            }
            else
                this.mutate(_serialization);
            return this;
        }
        mutate(_mutator) {
            if (_mutator.r != undefined)
                this.r = _mutator.r;
            if (_mutator.g != undefined)
                this.g = _mutator.g;
            if (_mutator.b != undefined)
                this.b = _mutator.b;
            if (_mutator.a != undefined)
                this.a = _mutator.a;
        }
        reduceMutator(_mutator) { }
    }
    FudgeCore.Color = Color;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MaterialGLTF extends FudgeCore.mixinSerializableResourceExternal(FudgeCore.Material) {
        async load(_url = this.url, _name = this.name) {
            this.url = _url;
            this.name = _name;
            return FudgeCore.GLTFLoader.loadResource(this);
        }
    }
    FudgeCore.MaterialGLTF = MaterialGLTF;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Calc {
        static { this.deg2rad = Math.PI / 180; }
        static { this.rad2deg = 1 / Calc.deg2rad; }
        static clamp(_value, _min, _max, _isSmaller = (Calc.isSmaller)) {
            if (_isSmaller(_value, _min))
                return _min;
            if (_isSmaller(_max, _value))
                return _max;
            return _value;
        }
        static lerp(_a, _b, _t) {
            return _a + Calc.clamp(_t, 0, 1) * (_b - _a);
        }
        static snap(_value, _increment, _round = Math.round) {
            return _round(_value / _increment) * _increment;
        }
        static isSmaller(_value1, _value2) {
            return _value1 < _value2;
        }
    }
    FudgeCore.Calc = Calc;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Framing extends FudgeCore.Mutable {
        reduceMutator(_mutator) { }
    }
    FudgeCore.Framing = Framing;
    class FramingFixed extends Framing {
        constructor(_width = 300, _height = 150) {
            super();
            this.width = 300;
            this.height = 150;
            this.setSize(_width, _height);
        }
        setSize(_width, _height) {
            this.width = _width;
            this.height = _height;
        }
        getPoint(_pointInFrame, _rectFrame) {
            let result = new FudgeCore.Vector2(this.width * (_pointInFrame.x - _rectFrame.x) / _rectFrame.width, this.height * (_pointInFrame.y - _rectFrame.y) / _rectFrame.height);
            return result;
        }
        getPointInverse(_point, _rect) {
            let result = new FudgeCore.Vector2(_point.x * _rect.width / this.width + _rect.x, _point.y * _rect.height / this.height + _rect.y);
            return result;
        }
        getRect(_rectFrame, _rectOut = FudgeCore.Recycler.reuse(FudgeCore.Rectangle)) {
            return FudgeCore.Rectangle.GET(0, 0, this.width, this.height, undefined, _rectOut);
        }
    }
    FudgeCore.FramingFixed = FramingFixed;
    class FramingScaled extends Framing {
        constructor() {
            super(...arguments);
            this.normWidth = 1.0;
            this.normHeight = 1.0;
        }
        setScale(_normWidth, _normHeight) {
            this.normWidth = _normWidth;
            this.normHeight = _normHeight;
        }
        getPoint(_pointInFrame, _rectFrame) {
            let result = new FudgeCore.Vector2(this.normWidth * (_pointInFrame.x - _rectFrame.x), this.normHeight * (_pointInFrame.y - _rectFrame.y));
            return result;
        }
        getPointInverse(_point, _rect) {
            let result = new FudgeCore.Vector2(_point.x / this.normWidth + _rect.x, _point.y / this.normHeight + _rect.y);
            return result;
        }
        getRect(_rectFrame, _rectOut = FudgeCore.Recycler.reuse(FudgeCore.Rectangle)) {
            return FudgeCore.Rectangle.GET(0, 0, this.normWidth * _rectFrame.width, this.normHeight * _rectFrame.height, undefined, _rectOut);
        }
    }
    FudgeCore.FramingScaled = FramingScaled;
    class FramingComplex extends Framing {
        constructor() {
            super(...arguments);
            this.margin = { left: 0, top: 0, right: 0, bottom: 0 };
            this.padding = { left: 0, top: 0, right: 0, bottom: 0 };
        }
        getPoint(_pointInFrame, _rectFrame) {
            let result = new FudgeCore.Vector2(_pointInFrame.x - this.padding.left - this.margin.left * _rectFrame.width, _pointInFrame.y - this.padding.top - this.margin.top * _rectFrame.height);
            return result;
        }
        getPointInverse(_point, _rect) {
            let result = new FudgeCore.Vector2(_point.x + this.padding.left + this.margin.left * _rect.width, _point.y + this.padding.top + this.margin.top * _rect.height);
            return result;
        }
        getRect(_rectFrame, _rectOut = FudgeCore.Recycler.reuse(FudgeCore.Rectangle)) {
            if (!_rectFrame)
                return null;
            let minX = _rectFrame.x + this.margin.left * _rectFrame.width + this.padding.left;
            let minY = _rectFrame.y + this.margin.top * _rectFrame.height + this.padding.top;
            let maxX = _rectFrame.x + (1 - this.margin.right) * _rectFrame.width - this.padding.right;
            let maxY = _rectFrame.y + (1 - this.margin.bottom) * _rectFrame.height - this.padding.bottom;
            return FudgeCore.Rectangle.GET(minX, minY, maxX - minX, maxY - minY, undefined, _rectOut);
        }
        getMutator() {
            return { margin: this.margin, padding: this.padding };
        }
    }
    FudgeCore.FramingComplex = FramingComplex;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Geo2 {
        constructor(_angle = 0, _magnitude = 1) {
            this.magnitude = 0;
            this.angle = 0;
            this.set(_angle, _magnitude);
        }
        set(_angle = 0, _magnitude = 1) {
            this.magnitude = _magnitude;
            this.angle = _angle;
            return this;
        }
        recycle() {
            this.set();
        }
        toString() {
            return `angle: ${this.angle.toPrecision(5)},  magnitude: ${this.magnitude.toPrecision(5)}`;
        }
    }
    FudgeCore.Geo2 = Geo2;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Geo3 {
        constructor(_longitude = 0, _latitude = 0, _magnitude = 1) {
            this.magnitude = 0;
            this.latitude = 0;
            this.longitude = 0;
            this.set(_longitude, _latitude, _magnitude);
        }
        set(_longitude = 0, _latitude = 0, _magnitude = 1) {
            this.magnitude = _magnitude;
            this.latitude = _latitude;
            this.longitude = _longitude;
            return this;
        }
        recycle() {
            this.set();
        }
        toString() {
            return `longitude: ${this.longitude.toPrecision(5)}, latitude: ${this.latitude.toPrecision(5)}, magnitude: ${this.magnitude.toPrecision(5)}`;
        }
    }
    FudgeCore.Geo3 = Geo3;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    function Mash() {
        let n = 0xefc8249d;
        let mash = function (_data) {
            _data = _data.toString();
            for (let i = 0; i < _data.length; i++) {
                n += _data.charCodeAt(i);
                let h = 0.02519603282416938 * n;
                n = h >>> 0;
                h -= n;
                h *= n;
                n = h >>> 0;
                h -= n;
                n += h * 0x100000000;
            }
            return (n >>> 0) * 2.3283064365386963e-10;
        };
        return mash;
    }
    FudgeCore.Mash = Mash;
    function LFIB4() {
        let args = Array.prototype.slice.call(arguments);
        let k0 = 0, k1 = 58, k2 = 119, k3 = 178;
        let s = [];
        let mash = Mash();
        if (args.length === 0) {
            args = [+new Date()];
        }
        for (let j = 0; j < 256; j++) {
            s[j] = mash(" ");
            s[j] -= mash(" ") * 4.76837158203125e-7;
            if (s[j] < 0) {
                s[j] += 1;
            }
        }
        for (let i = 0; i < args.length; i++) {
            for (let j = 0; j < 256; j++) {
                s[j] -= mash(args[i]);
                s[j] -= mash(args[i]) * 4.76837158203125e-7;
                if (s[j] < 0) {
                    s[j] += 1;
                }
            }
        }
        mash = null;
        let random = function () {
            let x;
            k0 = (k0 + 1) & 255;
            k1 = (k1 + 1) & 255;
            k2 = (k2 + 1) & 255;
            k3 = (k3 + 1) & 255;
            x = s[k0] - s[k1];
            if (x < 0) {
                x += 1;
            }
            x -= s[k2];
            if (x < 0) {
                x += 1;
            }
            x -= s[k3];
            if (x < 0) {
                x += 1;
            }
            return s[k0] = x;
        };
        return random;
    }
    FudgeCore.LFIB4 = LFIB4;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Matrix3x3 extends FudgeCore.Mutable {
        #translation;
        #scaling;
        #rotation;
        #translationDirty;
        #rotationDirty;
        #scalingDirty;
        constructor() {
            super();
            this.data = new Float32Array(9);
            this.mutator = null;
            this.#translation = FudgeCore.Vector2.ZERO();
            this.#scaling = FudgeCore.Vector2.ONE();
            this.#rotation = 0;
            this.#translationDirty = false;
            this.#rotationDirty = false;
            this.#scalingDirty = false;
            this.recycle();
        }
        static PROJECTION(_width, _height, _mtxOut = FudgeCore.Recycler.reuse(Matrix3x3)) {
            return _mtxOut.set(2 / _width, 0, 0, 0, -2 / _height, 0, -1, 1, 1);
        }
        static IDENTITY() {
            return FudgeCore.Recycler.get(Matrix3x3);
        }
        static COMPOSITION(_translation, _rotation, _scaling, _mtxOut = FudgeCore.Recycler.get(Matrix3x3)) {
            return _mtxOut.compose(_translation, _rotation, _scaling);
        }
        static TRANSLATION(_translate, _mtxOut = FudgeCore.Recycler.reuse(Matrix3x3)) {
            return _mtxOut.set(1, 0, 0, 0, 1, 0, _translate.x, _translate.y, 1);
        }
        static ROTATION(_angleInDegrees, _mtxOut = FudgeCore.Recycler.reuse(Matrix3x3)) {
            let angleInRadians = _angleInDegrees * FudgeCore.Calc.deg2rad;
            let sin = Math.sin(angleInRadians);
            let cos = Math.cos(angleInRadians);
            return _mtxOut.set(cos, sin, 0, -sin, cos, 0, 0, 0, 1);
        }
        static SCALING(_scalar, _mtxOut = FudgeCore.Recycler.reuse(Matrix3x3)) {
            return _mtxOut.set(_scalar.x, 0, 0, 0, _scalar.y, 0, 0, 0, 1);
        }
        static PRODUCT(_mtxLeft, _mtxRight, _mtxOut = FudgeCore.Recycler.reuse(Matrix3x3)) {
            const left = _mtxLeft.data;
            const right = _mtxRight.data;
            const a00 = left[0], a01 = left[1], a02 = left[2];
            const a10 = left[3], a11 = left[4], a12 = left[5];
            const a20 = left[6], a21 = left[7], a22 = left[8];
            const b00 = right[0], b01 = right[1], b02 = right[2];
            const b10 = right[3], b11 = right[4], b12 = right[5];
            const b20 = right[6], b21 = right[7], b22 = right[8];
            return _mtxOut.set(b00 * a00 + b01 * a10 + b02 * a20, b00 * a01 + b01 * a11 + b02 * a21, b00 * a02 + b01 * a12 + b02 * a22, b10 * a00 + b11 * a10 + b12 * a20, b10 * a01 + b11 * a11 + b12 * a21, b10 * a02 + b11 * a12 + b12 * a22, b20 * a00 + b21 * a10 + b22 * a20, b20 * a01 + b21 * a11 + b22 * a21, b20 * a02 + b21 * a12 + b22 * a22);
        }
        static INVERSE(_mtx, _mtxOut = FudgeCore.Recycler.reuse(Matrix3x3)) {
            const m = _mtx.data;
            const m00 = m[0], m01 = m[1], m02 = m[2];
            const m10 = m[3], m11 = m[4], m12 = m[5];
            const m20 = m[6], m21 = m[7], m22 = m[8];
            let d = 1 /
                (m00 * (m11 * m22 - m21 * m12) -
                    m01 * (m10 * m22 - m12 * m20) +
                    m02 * (m10 * m21 - m11 * m20));
            return _mtxOut.set(d * (m11 * m22 - m21 * m12), d * (m02 * m21 - m01 * m22), d * (m01 * m12 - m02 * m11), d * (m12 * m20 - m10 * m22), d * (m00 * m22 - m02 * m20), d * (m10 * m02 - m00 * m12), d * (m10 * m21 - m20 * m11), d * (m20 * m01 - m00 * m21), d * (m00 * m11 - m10 * m01));
        }
        get isArrayConvertible() {
            return true;
        }
        get translation() {
            if (this.#translationDirty) {
                this.#translationDirty = false;
                this.#translation.set(this.data[6], this.data[7]);
            }
            return this.#translation;
        }
        set translation(_translation) {
            this.compose(_translation, undefined, undefined);
        }
        get rotation() {
            if (this.#rotationDirty) {
                let scaling = this.scaling;
                let s0 = this.data[0] / scaling.x;
                let s1 = this.data[1] / scaling.x;
                let s3 = this.data[3] / scaling.y;
                let s4 = this.data[4] / scaling.y;
                let xSkew = Math.atan2(-s3, s4);
                let ySkew = Math.atan2(s0, s1);
                let sy = Math.sqrt(s0 * s0 + s1 * s1);
                let rotation;
                if (!(sy > 1e-6))
                    rotation = ySkew;
                else
                    rotation = xSkew;
                rotation *= FudgeCore.Calc.rad2deg;
                this.#rotation = rotation;
                this.#rotationDirty = false;
            }
            return this.#rotation;
        }
        set rotation(_rotation) {
            this.compose(undefined, _rotation, undefined);
        }
        get scaling() {
            if (this.#scalingDirty) {
                this.#scaling.set(Math.sqrt(this.data[0] * this.data[0] + this.data[1] * this.data[1]) * (this.data[0] < 0 ? -1 : 1), Math.sqrt(this.data[3] * this.data[3] + this.data[4] * this.data[4]) * (this.data[4] < 0 ? -1 : 1));
                this.#scalingDirty = false;
            }
            return this.#scaling;
        }
        set scaling(_scaling) {
            this.compose(undefined, undefined, _scaling);
        }
        get clone() {
            return FudgeCore.Recycler.reuse(Matrix3x3).copy(this);
        }
        recycle() {
            this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        }
        reset() {
            this.recycle();
        }
        translate(_by) {
            const mtxTranslation = Matrix3x3.TRANSLATION(_by);
            Matrix3x3.PRODUCT(this, mtxTranslation, this);
            FudgeCore.Recycler.store(mtxTranslation);
            return this;
        }
        translateX(_by) {
            const translation = FudgeCore.Recycler.reuse(FudgeCore.Vector2).set(_by, 0);
            this.translate(translation);
            FudgeCore.Recycler.store(translation);
            return this;
        }
        translateY(_by) {
            const translation = FudgeCore.Recycler.reuse(FudgeCore.Vector2).set(0, _by);
            this.translate(translation);
            FudgeCore.Recycler.store(translation);
            return this;
        }
        rotate(_angleInDegrees) {
            const mtxRotation = Matrix3x3.ROTATION(_angleInDegrees);
            Matrix3x3.PRODUCT(this, mtxRotation, this);
            FudgeCore.Recycler.store(mtxRotation);
            return this;
        }
        scale(_by) {
            const mtxScaling = Matrix3x3.SCALING(_by);
            Matrix3x3.PRODUCT(this, mtxScaling, this);
            FudgeCore.Recycler.store(mtxScaling);
            return this;
        }
        scaleX(_by) {
            const scaling = FudgeCore.Recycler.reuse(FudgeCore.Vector2).set(_by, 1);
            this.scale(scaling);
            FudgeCore.Recycler.store(scaling);
            return this;
        }
        scaleY(_by) {
            const scaling = FudgeCore.Recycler.reuse(FudgeCore.Vector2).set(1, _by);
            this.scale(scaling);
            FudgeCore.Recycler.store(scaling);
            return this;
        }
        multiply(_mtxRight) {
            return Matrix3x3.PRODUCT(this, _mtxRight, this);
        }
        premultiply(_mtxLeft) {
            return Matrix3x3.PRODUCT(_mtxLeft, this, this);
        }
        compose(_translation, _rotation, _scaling) {
            const m = this.data;
            if (_translation) {
                const translation = this.translation;
                translation.mutate(_translation);
                m[6] = translation.x;
                m[7] = translation.y;
                this.#translationDirty = false;
            }
            if (_rotation || _scaling) {
                const rotation = _rotation ?? this.rotation;
                if (_rotation != undefined)
                    this.#rotation = rotation;
                const scaling = this.scaling;
                if (_scaling)
                    scaling.mutate(_scaling);
                const angleInRadians = rotation * FudgeCore.Calc.deg2rad;
                const sin = Math.sin(angleInRadians);
                const cos = Math.cos(angleInRadians);
                m[0] = cos * scaling.x;
                m[1] = sin * scaling.x;
                m[3] = -sin * scaling.y;
                m[4] = cos * scaling.y;
                this.#rotationDirty = false;
                this.#scalingDirty = false;
            }
            this.mutator = null;
            return this;
        }
        set(_m00, _m01, _m02, _m10, _m11, _m12, _m20, _m21, _m22) {
            const m = this.data;
            m[0] = _m00;
            m[1] = _m01;
            m[2] = _m02;
            m[3] = _m10;
            m[4] = _m11;
            m[5] = _m12;
            m[6] = _m20;
            m[7] = _m21;
            m[8] = _m22;
            this.resetCache();
            return this;
        }
        copy(_original) {
            this.data.set(_original.data);
            this.mutator = null;
            this.#translationDirty = _original.#translationDirty;
            this.#rotationDirty = _original.#rotationDirty;
            this.#scalingDirty = _original.#scalingDirty;
            if (!this.#translationDirty)
                this.#translation.copy(_original.#translation);
            if (!this.#rotationDirty)
                this.#rotation = _original.#rotation;
            if (!this.#scalingDirty)
                this.#scaling.copy(_original.#scaling);
            return this;
        }
        toString() {
            return `ƒ.Matrix3x3(translation: ${this.translation.toString()}, rotation: ${this.rotation.toString()}, scaling: ${this.scaling.toString()}`;
        }
        fromArray(_array, _offset = 0) {
            this.data.set(_array, _offset);
            this.resetCache();
            return this;
        }
        toArray(_out = new Array(9), _offset = 0) {
            const m = this.data;
            _out[_offset + 0] = m[0];
            _out[_offset + 1] = m[1];
            _out[_offset + 2] = m[2];
            _out[_offset + 3] = m[3];
            _out[_offset + 4] = m[4];
            _out[_offset + 5] = m[5];
            _out[_offset + 6] = m[6];
            _out[_offset + 7] = m[7];
            _out[_offset + 8] = m[8];
            return _out;
        }
        getArray() {
            return this.data;
        }
        serialize() {
            let serialization = {
                translation: this.translation.serialize(),
                rotation: this.rotation,
                scaling: this.scaling.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            let mutator = {
                translation: await this.translation.deserialize(_serialization.translation),
                rotation: _serialization.rotation,
                scaling: await this.scaling.deserialize(_serialization.scaling)
            };
            this.mutate(mutator);
            return this;
        }
        getMutator() {
            if (this.mutator)
                return this.mutator;
            let mutator = {
                translation: this.translation.getMutator(),
                rotation: this.rotation,
                scaling: this.scaling.getMutator()
            };
            this.mutator = mutator;
            return mutator;
        }
        mutate(_mutator) {
            this.compose(_mutator.translation, _mutator.rotation, _mutator.scaling);
        }
        getMutatorAttributeTypes(_mutator) {
            let types = {};
            if (_mutator.translation)
                types.translation = "Vector2";
            if (_mutator.rotation != undefined)
                types.rotation = "number";
            if (_mutator.scaling)
                types.scaling = "Vector2";
            return types;
        }
        reduceMutator(_mutator) { }
        resetCache() {
            this.#translationDirty = true;
            this.#rotationDirty = true;
            this.#scalingDirty = true;
            this.mutator = null;
        }
    }
    FudgeCore.Matrix3x3 = Matrix3x3;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Matrix4x4 extends FudgeCore.Mutable {
        #translation;
        #scaling;
        #rotation;
        #quaternion;
        #translationDirty;
        #scalingDirty;
        #rotationDirty;
        #quaternionDirty;
        constructor(_data) {
            super();
            this.data = new Float32Array(16);
            this.mutator = null;
            this.#translation = FudgeCore.Vector3.ZERO();
            this.#scaling = FudgeCore.Vector3.ZERO();
            this.#rotation = FudgeCore.Vector3.ONE();
            this.#quaternion = FudgeCore.Quaternion.IDENTITY();
            if (!_data) {
                this.recycle();
                return;
            }
            this.data = _data;
            this.resetCache();
        }
        static IDENTITY() {
            return FudgeCore.Recycler.get(Matrix4x4);
        }
        static COMPOSITION(_translation, _rotation, _scaling, _mtxOut = FudgeCore.Recycler.get(Matrix4x4)) {
            return _mtxOut.compose(_translation, _rotation, _scaling);
        }
        static PRODUCT(_a, _b, _out = FudgeCore.Recycler.reuse(Matrix4x4)) {
            const a = _a.data;
            const b = _b.data;
            const out = _out.data;
            const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
            const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
            const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
            let b0 = b[0];
            let b1 = b[1];
            let b2 = b[2];
            let b3 = b[3];
            out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[4];
            b1 = b[5];
            b2 = b[6];
            b3 = b[7];
            out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[8];
            b1 = b[9];
            b2 = b[10];
            b3 = b[11];
            out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            b0 = b[12];
            b1 = b[13];
            b2 = b[14];
            b3 = b[15];
            out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            _out.resetCache();
            return _out;
        }
        static TRANSPOSE(_mtx, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            const m = _mtx.data;
            return _mtxOut.set(m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]);
            ;
        }
        static INVERSE(_mtx, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            const m = _mtx.data;
            const m00 = m[0], m01 = m[1], m02 = m[2], m03 = m[3];
            const m10 = m[4], m11 = m[5], m12 = m[6], m13 = m[7];
            const m20 = m[8], m21 = m[9], m22 = m[10], m23 = m[11];
            const m30 = m[12], m31 = m[13], m32 = m[14], m33 = m[15];
            const tmp0 = m22 * m33;
            const tmp1 = m32 * m23;
            const tmp2 = m12 * m33;
            const tmp3 = m32 * m13;
            const tmp4 = m12 * m23;
            const tmp5 = m22 * m13;
            const tmp6 = m02 * m33;
            const tmp7 = m32 * m03;
            const tmp8 = m02 * m23;
            const tmp9 = m22 * m03;
            const tmp10 = m02 * m13;
            const tmp11 = m12 * m03;
            const tmp12 = m20 * m31;
            const tmp13 = m30 * m21;
            const tmp14 = m10 * m31;
            const tmp15 = m30 * m11;
            const tmp16 = m10 * m21;
            const tmp17 = m20 * m11;
            const tmp18 = m00 * m31;
            const tmp19 = m30 * m01;
            const tmp20 = m00 * m21;
            const tmp21 = m20 * m01;
            const tmp22 = m00 * m11;
            const tmp23 = m10 * m01;
            const t0 = (tmp0 * m11 + tmp3 * m21 + tmp4 * m31) -
                (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
            const t1 = (tmp1 * m01 + tmp6 * m21 + tmp9 * m31) -
                (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
            const t2 = (tmp2 * m01 + tmp7 * m11 + tmp10 * m31) -
                (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
            const t3 = (tmp5 * m01 + tmp8 * m11 + tmp11 * m21) -
                (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
            const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
            return _mtxOut.set(d * t0, d * t1, d * t2, d * t3, d * ((tmp1 * m10 + tmp2 * m20 + tmp5 * m30) - (tmp0 * m10 + tmp3 * m20 + tmp4 * m30)), d * ((tmp0 * m00 + tmp7 * m20 + tmp8 * m30) - (tmp1 * m00 + tmp6 * m20 + tmp9 * m30)), d * ((tmp3 * m00 + tmp6 * m10 + tmp11 * m30) - (tmp2 * m00 + tmp7 * m10 + tmp10 * m30)), d * ((tmp4 * m00 + tmp9 * m10 + tmp10 * m20) - (tmp5 * m00 + tmp8 * m10 + tmp11 * m20)), d * ((tmp12 * m13 + tmp15 * m23 + tmp16 * m33) - (tmp13 * m13 + tmp14 * m23 + tmp17 * m33)), d * ((tmp13 * m03 + tmp18 * m23 + tmp21 * m33) - (tmp12 * m03 + tmp19 * m23 + tmp20 * m33)), d * ((tmp14 * m03 + tmp19 * m13 + tmp22 * m33) - (tmp15 * m03 + tmp18 * m13 + tmp23 * m33)), d * ((tmp17 * m03 + tmp20 * m13 + tmp23 * m23) - (tmp16 * m03 + tmp21 * m13 + tmp22 * m23)), d * ((tmp14 * m22 + tmp17 * m32 + tmp13 * m12) - (tmp16 * m32 + tmp12 * m12 + tmp15 * m22)), d * ((tmp20 * m32 + tmp12 * m02 + tmp19 * m22) - (tmp18 * m22 + tmp21 * m32 + tmp13 * m02)), d * ((tmp18 * m12 + tmp23 * m32 + tmp15 * m02) - (tmp22 * m32 + tmp14 * m02 + tmp19 * m12)), d * ((tmp22 * m22 + tmp16 * m02 + tmp21 * m12) - (tmp20 * m12 + tmp23 * m22 + tmp17 * m02)));
        }
        static LOOK_AT(_translation, _target, _up, _restrict = false, _scaling, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            const forward = FudgeCore.Vector3.DIFFERENCE(_target, _translation);
            forward.normalize();
            Matrix4x4.LOOK_IN(forward, _up, _restrict, _translation, _scaling, _mtxOut);
            FudgeCore.Recycler.store(forward);
            return _mtxOut;
        }
        static LOOK_IN(_forward, _up, _restrict = false, _translation, _scaling, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            const zAxis = _forward.clone;
            const yAxis = _up ? _up.clone : FudgeCore.Vector3.Y();
            const xAxis = FudgeCore.Vector3.CROSS(yAxis, zAxis);
            if (xAxis.magnitudeSquared == 0) {
                if (Math.abs(yAxis.z) === 1)
                    zAxis.x += 0.0001;
                else
                    zAxis.z += 0.0001;
                zAxis.normalize();
                FudgeCore.Vector3.CROSS(yAxis, zAxis, xAxis);
            }
            xAxis.normalize();
            if (_restrict)
                FudgeCore.Vector3.CROSS(xAxis, yAxis, zAxis);
            else
                FudgeCore.Vector3.CROSS(zAxis, xAxis, yAxis);
            const scaling = _mtxOut.#scaling;
            if (_scaling) {
                scaling.copy(_scaling);
                xAxis.scale(scaling.x);
                yAxis.scale(scaling.y);
                zAxis.scale(scaling.z);
            }
            else {
                scaling.set(1, 1, 1);
            }
            const translation = _mtxOut.#translation;
            if (_translation)
                translation.copy(_translation);
            else
                translation.set(0, 0, 0);
            _mtxOut.set(xAxis.x, xAxis.y, xAxis.z, 0, yAxis.x, yAxis.y, yAxis.z, 0, zAxis.x, zAxis.y, zAxis.z, 0, translation.x, translation.y, translation.z, 1);
            FudgeCore.Recycler.store(xAxis);
            FudgeCore.Recycler.store(yAxis);
            FudgeCore.Recycler.store(zAxis);
            _mtxOut.#translationDirty = false;
            _mtxOut.#scalingDirty = false;
            return _mtxOut;
        }
        static TRANSLATION(_translate, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            return _mtxOut.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, _translate.x, _translate.y, _translate.z, 1);
        }
        static ROTATION_X(_angleInDegrees, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            let angleInRadians = _angleInDegrees * FudgeCore.Calc.deg2rad;
            let sin = Math.sin(angleInRadians);
            let cos = Math.cos(angleInRadians);
            return _mtxOut.set(1, 0, 0, 0, 0, cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1);
        }
        static ROTATION_Y(_angleInDegrees, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            let angleInRadians = _angleInDegrees * FudgeCore.Calc.deg2rad;
            let sin = Math.sin(angleInRadians);
            let cos = Math.cos(angleInRadians);
            return _mtxOut.set(cos, 0, -sin, 0, 0, 1, 0, 0, sin, 0, cos, 0, 0, 0, 0, 1);
        }
        static ROTATION_Z(_angleInDegrees, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            let angleInRadians = _angleInDegrees * FudgeCore.Calc.deg2rad;
            let sin = Math.sin(angleInRadians);
            let cos = Math.cos(angleInRadians);
            return _mtxOut.set(cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        static ROTATION(_rotation, _mtxOut = FudgeCore.Recycler.get(Matrix4x4)) {
            _mtxOut.#scaling.set(1, 1, 1);
            _mtxOut.#scalingDirty = false;
            if (_rotation instanceof FudgeCore.Quaternion) {
                _mtxOut.#quaternion.copy(_rotation);
                _mtxOut.#quaternionDirty = false;
                _mtxOut.#rotationDirty = true;
            }
            else {
                _mtxOut.#rotation.copy(_rotation);
                _mtxOut.#rotationDirty = false;
                _mtxOut.#quaternionDirty = true;
            }
            _mtxOut.rotation = _rotation;
            return _mtxOut;
        }
        static ROTATION_AXIS_ANGLE(_axis, _angle, _mtxOut = FudgeCore.Recycler.get(Matrix4x4)) {
            _angle *= FudgeCore.Calc.deg2rad;
            const c = Math.cos(_angle);
            const s = Math.sin(_angle);
            const t = 1 - c;
            const x = _axis.x, y = _axis.y, z = _axis.z;
            const tx = t * x, ty = t * y;
            _mtxOut.set(tx * x + c, tx * y + s * z, tx * z - s * y, 0, tx * y - s * z, ty * y + c, ty * z + s * x, 0, tx * z + s * y, ty * z - s * x, t * z * z + c, 0, 0, 0, 0, 1);
            return _mtxOut;
        }
        static SCALING(_scalar, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            return _mtxOut.set(_scalar.x, 0, 0, 0, 0, _scalar.y, 0, 0, 0, 0, _scalar.z, 0, 0, 0, 0, 1);
        }
        static RELATIVE(_mtx, _mtxBase, _mtxInverse, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            if (_mtxInverse)
                return Matrix4x4.PRODUCT(_mtxInverse, _mtx, _mtxOut);
            let mtxInverse = Matrix4x4.INVERSE(_mtxBase);
            Matrix4x4.PRODUCT(mtxInverse, _mtx, _mtxOut);
            FudgeCore.Recycler.store(mtxInverse);
            return _mtxOut;
        }
        static PROJECTION_CENTRAL(_aspect, _fieldOfViewInDegrees, _near, _far, _direction, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            let fieldOfViewInRadians = _fieldOfViewInDegrees * FudgeCore.Calc.deg2rad;
            let f = Math.tan(0.5 * (Math.PI - fieldOfViewInRadians));
            let rangeInv = 1.0 / (_near - _far);
            _mtxOut.set(f, 0, 0, 0, 0, f, 0, 0, 0, 0, (_near + _far) * rangeInv, -1, 0, 0, _near * _far * rangeInv * 2, 0);
            if (_direction == FudgeCore.FIELD_OF_VIEW.DIAGONAL) {
                _aspect = Math.sqrt(_aspect);
                _mtxOut.data[0] = f / _aspect;
                _mtxOut.data[5] = f * _aspect;
            }
            else if (_direction == FudgeCore.FIELD_OF_VIEW.VERTICAL)
                _mtxOut.data[0] = f / _aspect;
            else
                _mtxOut.data[5] = f * _aspect;
            _mtxOut.rotateY(180);
            return _mtxOut;
        }
        static PROJECTION_ORTHOGRAPHIC(_left, _right, _bottom, _top, _near = -400, _far = 400, _mtxOut = FudgeCore.Recycler.reuse(Matrix4x4)) {
            _mtxOut.set(2 / (_right - _left), 0, 0, 0, 0, -2 / (_top - _bottom), 0, 0, 0, 0, 2 / (_far - _near), 0, (_left + _right) / (_left - _right), (_bottom + _top) / (_bottom - _top), (_near + _far) / (_near - _far), 1);
            return _mtxOut;
        }
        get isArrayConvertible() {
            return true;
        }
        get translation() {
            if (this.#translationDirty) {
                this.#translation.set(this.data[12], this.data[13], this.data[14]);
                this.#translationDirty = false;
            }
            return this.#translation;
        }
        set translation(_translation) {
            this.compose(_translation);
        }
        get rotation() {
            if (this.#rotationDirty) {
                let scaling = this.scaling;
                let s0 = this.data[0] / scaling.x;
                let s1 = this.data[1] / scaling.x;
                let s2 = this.data[2] / scaling.x;
                let s6 = this.data[6] / scaling.y;
                let s10 = this.data[10] / scaling.z;
                let sy = Math.sqrt(s0 * s0 + s1 * s1);
                let singular = sy < 1e-6;
                let x1, y1, z1;
                let x2, y2, z2;
                if (!singular) {
                    x1 = Math.atan2(s6, s10);
                    y1 = Math.atan2(-s2, sy);
                    z1 = Math.atan2(s1, s0);
                    x2 = Math.atan2(-s6, -s10);
                    y2 = Math.atan2(-s2, -sy);
                    z2 = Math.atan2(-s1, -s0);
                    if (Math.abs(x2) + Math.abs(y2) + Math.abs(z2) < Math.abs(x1) + Math.abs(y1) + Math.abs(z1)) {
                        x1 = x2;
                        y1 = y2;
                        z1 = z2;
                    }
                }
                else {
                    x1 = Math.atan2(-this.data[9] / scaling.z, this.data[5] / scaling.y);
                    y1 = Math.atan2(-this.data[2] / scaling.x, sy);
                    z1 = 0;
                }
                this.#rotation.set(x1, y1, z1);
                this.#rotation.scale(FudgeCore.Calc.rad2deg);
                this.#rotationDirty = false;
            }
            return this.#rotation;
        }
        set rotation(_rotation) {
            this.compose(undefined, _rotation);
        }
        get scaling() {
            if (this.#scalingDirty) {
                this.#scaling.set(Math.sqrt(this.data[0] * this.data[0] + this.data[1] * this.data[1] + this.data[2] * this.data[2]), Math.sqrt(this.data[4] * this.data[4] + this.data[5] * this.data[5] + this.data[6] * this.data[6]), Math.sqrt(this.data[8] * this.data[8] + this.data[9] * this.data[9] + this.data[10] * this.data[10]));
                this.#scalingDirty = false;
            }
            return this.#scaling;
        }
        set scaling(_scaling) {
            this.compose(undefined, undefined, _scaling);
        }
        get quaternion() {
            if (this.#quaternionDirty) {
                this.#quaternion.eulerAngles = this.rotation;
                this.#quaternionDirty = false;
            }
            return this.#quaternion;
        }
        set quaternion(_quaternion) {
            this.compose(undefined, _quaternion);
        }
        get determinant() {
            const m = this.data;
            const det00 = m[10] * m[15] - m[11] * m[14];
            const det01 = m[9] * m[15] - m[11] * m[13];
            const det02 = m[9] * m[14] - m[10] * m[13];
            const det03 = m[8] * m[15] - m[11] * m[12];
            const det04 = m[8] * m[14] - m[10] * m[12];
            const det05 = m[8] * m[13] - m[9] * m[12];
            const det = m[0] * (m[5] * det00 - m[6] * det01 + m[7] * det02) -
                m[1] * (m[4] * det00 - m[6] * det03 + m[7] * det04) +
                m[2] * (m[4] * det01 - m[5] * det03 + m[7] * det05) -
                m[3] * (m[4] * det02 - m[5] * det04 + m[6] * det05);
            return det;
        }
        get right() {
            let right = this.getX();
            right.normalize();
            return right;
        }
        get up() {
            let up = this.getY();
            up.normalize();
            return up;
        }
        get forward() {
            let forward = this.getZ();
            forward.normalize();
            return forward;
        }
        get clone() {
            return FudgeCore.Recycler.reuse(Matrix4x4).copy(this);
        }
        recycle() {
            this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        reset() {
            this.recycle();
            return this;
        }
        transpose() {
            return Matrix4x4.TRANSPOSE(this, this);
        }
        invert() {
            return Matrix4x4.INVERSE(this, this);
        }
        translate(_by, _local = true) {
            if (_local) {
                let mtxTranslation = Matrix4x4.TRANSLATION(_by);
                this.multiply(mtxTranslation);
                FudgeCore.Recycler.store(mtxTranslation);
            }
            else {
                this.data[12] += _by.x;
                this.data[13] += _by.y;
                this.data[14] += _by.z;
                this.mutator = null;
                this.#translationDirty = true;
                this.modified = true;
            }
            return this;
        }
        translateX(_x, _local = true) {
            let translation = FudgeCore.Vector3.X(_x);
            this.translate(translation, _local);
            FudgeCore.Recycler.store(translation);
            return this;
        }
        translateY(_y, _local = true) {
            let translation = FudgeCore.Vector3.Y(_y);
            this.translate(translation, _local);
            FudgeCore.Recycler.store(translation);
            return this;
        }
        translateZ(_z, _local = true) {
            let translation = FudgeCore.Vector3.Z(_z);
            this.translate(translation, _local);
            FudgeCore.Recycler.store(translation);
            return this;
        }
        rotate(_by, _fromLeft = false) {
            let mtxRotation = Matrix4x4.ROTATION(_by);
            this.multiply(mtxRotation, _fromLeft);
            FudgeCore.Recycler.store(mtxRotation);
            return this;
        }
        rotateX(_angleInDegrees, _fromLeft = false) {
            let mtxRotation = Matrix4x4.ROTATION_X(_angleInDegrees);
            this.multiply(mtxRotation, _fromLeft);
            FudgeCore.Recycler.store(mtxRotation);
            return this;
        }
        rotateY(_angleInDegrees, _fromLeft = false) {
            let mtxRotation = Matrix4x4.ROTATION_Y(_angleInDegrees);
            this.multiply(mtxRotation, _fromLeft);
            FudgeCore.Recycler.store(mtxRotation);
            return this;
        }
        rotateZ(_angleInDegrees, _fromLeft = false) {
            let mtxRotation = Matrix4x4.ROTATION_Z(_angleInDegrees);
            this.multiply(mtxRotation, _fromLeft);
            FudgeCore.Recycler.store(mtxRotation);
            return this;
        }
        lookAt(_target, _up, _restrict = false) {
            const up = _up ? _up : this.getUp();
            Matrix4x4.LOOK_AT(this.translation, _target, up, _restrict, this.scaling, this);
            if (!_up)
                FudgeCore.Recycler.store(up);
            return this;
        }
        lookIn(_forward, _up, _restrict = false) {
            const up = _up ? _up : this.getUp();
            Matrix4x4.LOOK_IN(_forward, up, _restrict, this.translation, this.scaling, this);
            if (!_up)
                FudgeCore.Recycler.store(up);
            return this;
        }
        scale(_by, _fromLeft = false) {
            const mtxScaling = Matrix4x4.SCALING(_by);
            this.multiply(mtxScaling, _fromLeft);
            FudgeCore.Recycler.store(mtxScaling);
            return this;
        }
        scaleX(_by) {
            let vector = FudgeCore.Recycler.reuse(FudgeCore.Vector3);
            vector.set(_by, 1, 1);
            this.scale(vector);
            FudgeCore.Recycler.store(vector);
            return this;
        }
        scaleY(_by) {
            let vector = FudgeCore.Recycler.reuse(FudgeCore.Vector3);
            vector.set(1, _by, 1);
            this.scale(vector);
            FudgeCore.Recycler.store(vector);
            return this;
        }
        scaleZ(_by) {
            let vector = FudgeCore.Recycler.reuse(FudgeCore.Vector3);
            vector.set(1, 1, _by);
            this.scale(vector);
            FudgeCore.Recycler.store(vector);
            return this;
        }
        multiply(_matrix, _fromLeft = false) {
            if (_fromLeft)
                return Matrix4x4.PRODUCT(_matrix, this, this);
            else
                return Matrix4x4.PRODUCT(this, _matrix, this);
        }
        premultiply(_mtxLeft) {
            return Matrix4x4.PRODUCT(_mtxLeft, this, this);
        }
        compose(_translation, _rotation, _scaling) {
            const m = this.data;
            if (_translation) {
                const translation = this.translation;
                translation.mutate(_translation);
                m[12] = translation.x;
                m[13] = translation.y;
                m[14] = translation.z;
                this.#translationDirty = false;
            }
            if (_rotation || _scaling) {
                const isQuaternion = _rotation?.w != undefined;
                const rotation = isQuaternion ? this.quaternion : this.rotation;
                if (_rotation) {
                    rotation.mutate(_rotation);
                    if (isQuaternion)
                        rotation.normalize();
                }
                const scaling = this.scaling;
                if (_scaling)
                    scaling.mutate(_scaling);
                const sx = scaling.x, sy = scaling.y, sz = scaling.z;
                if (isQuaternion) {
                    const x = rotation.x, y = rotation.y, z = rotation.z, w = rotation.w;
                    const x2 = x + x, y2 = y + y, z2 = z + z;
                    const xx = x * x2, xy = x * y2, xz = x * z2;
                    const yy = y * y2, yz = y * z2, zz = z * z2;
                    const wx = w * x2, wy = w * y2, wz = w * z2;
                    m[0] = (1 - (yy + zz)) * sx;
                    m[1] = (xy + wz) * sx;
                    m[2] = (xz - wy) * sx;
                    m[4] = (xy - wz) * sy;
                    m[5] = (1 - (xx + zz)) * sy;
                    m[6] = (yz + wx) * sy;
                    m[8] = (xz + wy) * sz;
                    m[9] = (yz - wx) * sz;
                    m[10] = (1 - (xx + yy)) * sz;
                }
                else {
                    const radX = rotation.x * FudgeCore.Calc.deg2rad;
                    const radY = rotation.y * FudgeCore.Calc.deg2rad;
                    const radZ = rotation.z * FudgeCore.Calc.deg2rad;
                    const sinX = Math.sin(radX);
                    const cosX = Math.cos(radX);
                    const sinY = Math.sin(radY);
                    const cosY = Math.cos(radY);
                    const sinZ = Math.sin(radZ);
                    const cosZ = Math.cos(radZ);
                    m[0] = (cosZ * cosY) * sx;
                    m[1] = (sinZ * cosY) * sx;
                    m[2] = -sinY * sx;
                    m[4] = (cosZ * sinY * sinX - sinZ * cosX) * sy;
                    m[5] = (sinZ * sinY * sinX + cosZ * cosX) * sy;
                    m[6] = (cosY * sinX) * sy;
                    m[8] = (cosZ * sinY * cosX + sinZ * sinX) * sz;
                    m[9] = (sinZ * sinY * cosX - cosZ * sinX) * sz;
                    m[10] = (cosY * cosX) * sz;
                }
                this.#rotationDirty = isQuaternion;
                this.#quaternionDirty = !isQuaternion;
                this.#scalingDirty = false;
            }
            this.mutator = null;
            this.modified = true;
            return this;
        }
        animate(_mutator) {
            const m = this.data;
            const translationArray = _mutator.translation;
            const rotationArray = _mutator.quaternion ?? _mutator.rotation;
            const scalingArray = _mutator.scaling;
            if (translationArray) {
                const translation = this.translation;
                translation.fromArray(translationArray);
                m[12] = translation.x;
                m[13] = translation.y;
                m[14] = translation.z;
                this.#translationDirty = false;
            }
            if (rotationArray || scalingArray) {
                const isQuaternion = rotationArray?.length == 4;
                const rotation = isQuaternion ? this.quaternion : this.rotation;
                if (rotationArray)
                    rotation.fromArray(rotationArray);
                const scaling = this.scaling;
                if (scalingArray)
                    scaling.fromArray(scalingArray);
                const sx = scaling.x, sy = scaling.y, sz = scaling.z;
                if (isQuaternion) {
                    const x = rotation.x, y = rotation.y, z = rotation.z, w = rotation.w;
                    const x2 = x + x, y2 = y + y, z2 = z + z;
                    const xx = x * x2, xy = x * y2, xz = x * z2;
                    const yy = y * y2, yz = y * z2, zz = z * z2;
                    const wx = w * x2, wy = w * y2, wz = w * z2;
                    m[0] = (1 - (yy + zz)) * sx;
                    m[1] = (xy + wz) * sx;
                    m[2] = (xz - wy) * sx;
                    m[4] = (xy - wz) * sy;
                    m[5] = (1 - (xx + zz)) * sy;
                    m[6] = (yz + wx) * sy;
                    m[8] = (xz + wy) * sz;
                    m[9] = (yz - wx) * sz;
                    m[10] = (1 - (xx + yy)) * sz;
                }
                else {
                    const radX = rotation.x * FudgeCore.Calc.deg2rad;
                    const radY = rotation.y * FudgeCore.Calc.deg2rad;
                    const radZ = rotation.z * FudgeCore.Calc.deg2rad;
                    const sinX = Math.sin(radX);
                    const cosX = Math.cos(radX);
                    const sinY = Math.sin(radY);
                    const cosY = Math.cos(radY);
                    const sinZ = Math.sin(radZ);
                    const cosZ = Math.cos(radZ);
                    m[0] = (cosZ * cosY) * sx;
                    m[1] = (sinZ * cosY) * sx;
                    m[2] = -sinY * sx;
                    m[4] = (cosZ * sinY * sinX - sinZ * cosX) * sy;
                    m[5] = (sinZ * sinY * sinX + cosZ * cosX) * sy;
                    m[6] = (cosY * sinX) * sy;
                    m[8] = (cosZ * sinY * cosX + sinZ * sinX) * sz;
                    m[9] = (sinZ * sinY * cosX - cosZ * sinX) * sz;
                    m[10] = (cosY * cosX) * sz;
                }
                this.#rotationDirty = isQuaternion;
                this.#quaternionDirty = !isQuaternion;
                this.#scalingDirty = false;
            }
            this.mutator = null;
            this.modified = true;
            return this;
        }
        set(_m00, _m01, _m02, _m03, _m10, _m11, _m12, _m13, _m20, _m21, _m22, _m23, _m30, _m31, _m32, _m33) {
            const m = this.data;
            m[0] = _m00;
            m[1] = _m01;
            m[2] = _m02;
            m[3] = _m03;
            m[4] = _m10;
            m[5] = _m11;
            m[6] = _m12;
            m[7] = _m13;
            m[8] = _m20;
            m[9] = _m21;
            m[10] = _m22;
            m[11] = _m23;
            m[12] = _m30;
            m[13] = _m31;
            m[14] = _m32;
            m[15] = _m33;
            this.resetCache();
            return this;
        }
        copy(_original) {
            this.data.set(_original.data);
            this.mutator = null;
            this.modified = true;
            this.#translationDirty = _original.#translationDirty;
            this.#rotationDirty = _original.#rotationDirty;
            this.#scalingDirty = _original.#scalingDirty;
            this.#quaternionDirty = _original.#quaternionDirty;
            if (!this.#translationDirty)
                this.#translation.copy(_original.#translation);
            if (!this.#rotationDirty)
                this.#rotation.copy(_original.#rotation);
            if (!this.#scalingDirty)
                this.#scaling.copy(_original.#scaling);
            if (!this.#quaternionDirty)
                this.#quaternion.copy(_original.#quaternion);
            return this;
        }
        toString() {
            return `ƒ.Matrix4x4(translation: ${this.translation.toString()}, rotation: ${this.rotation.toString()}, scaling: ${this.scaling.toString()}`;
        }
        fromArray(_array, _offset = 0) {
            this.data.set(_array, _offset);
            this.resetCache();
            return this;
        }
        toArray(_out = new Array(16), _offset = 0) {
            const m = this.data;
            _out[_offset + 0] = m[0];
            _out[_offset + 1] = m[1];
            _out[_offset + 2] = m[2];
            _out[_offset + 3] = m[3];
            _out[_offset + 4] = m[4];
            _out[_offset + 5] = m[5];
            _out[_offset + 6] = m[6];
            _out[_offset + 7] = m[7];
            _out[_offset + 8] = m[8];
            _out[_offset + 9] = m[9];
            _out[_offset + 10] = m[10];
            _out[_offset + 11] = m[11];
            _out[_offset + 12] = m[12];
            _out[_offset + 13] = m[13];
            _out[_offset + 14] = m[14];
            _out[_offset + 15] = m[15];
            return _out;
        }
        getArray() {
            return this.data;
        }
        getDeterminant() {
            const m = this.data;
            const det00 = m[10] * m[15] - m[11] * m[14];
            const det01 = m[9] * m[15] - m[11] * m[13];
            const det02 = m[9] * m[14] - m[10] * m[13];
            const det03 = m[8] * m[15] - m[11] * m[12];
            const det04 = m[8] * m[14] - m[10] * m[12];
            const det05 = m[8] * m[13] - m[9] * m[12];
            const det = m[0] * (m[5] * det00 - m[6] * det01 + m[7] * det02) -
                m[1] * (m[4] * det00 - m[6] * det03 + m[7] * det04) +
                m[2] * (m[4] * det01 - m[5] * det03 + m[7] * det05) -
                m[3] * (m[4] * det02 - m[5] * det04 + m[6] * det05);
            return det;
        }
        getX(_vctOut = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
            return _vctOut.set(this.data[0], this.data[1], this.data[2]);
            ;
        }
        getY(_vctOut = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
            return _vctOut.set(this.data[4], this.data[5], this.data[6]);
        }
        getZ(_vctOut = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
            return _vctOut.set(this.data[8], this.data[9], this.data[10]);
        }
        getRight(_vctOut = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
            return _vctOut.set(this.data[0], this.data[1], this.data[2]).normalize();
        }
        getUp(_vctOut = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
            return _vctOut.set(this.data[4], this.data[5], this.data[6]).normalize();
        }
        getForward(_vctOut = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
            return _vctOut.set(this.data[8], this.data[9], this.data[10]).normalize();
        }
        swapXY() {
            const m = this.data;
            const xAxis = this.getX();
            m[4] = xAxis.x;
            m[5] = xAxis.y;
            m[6] = xAxis.z;
            m[0] = m[4];
            m[1] = m[5];
            m[2] = m[6];
            m[8] = -m[8];
            m[9] = -m[9];
            m[10] = -m[10];
            FudgeCore.Recycler.store(xAxis);
            this.resetCache();
        }
        swapXZ() {
            const m = this.data;
            const xAxis = this.getX();
            m[4] = -m[4];
            m[5] = -m[5];
            m[6] = -m[6];
            m[0] = m[8];
            m[1] = m[9];
            m[2] = m[10];
            m[8] = xAxis.x;
            m[9] = xAxis.y;
            m[10] = xAxis.z;
            FudgeCore.Recycler.store(xAxis);
            this.resetCache();
        }
        swapYZ() {
            const m = this.data;
            const yAxis = this.getY();
            m[0] = -m[0];
            m[1] = -m[1];
            m[2] = -m[2];
            m[4] = m[8];
            m[5] = m[9];
            m[6] = m[10];
            m[8] = yAxis.x;
            m[9] = yAxis.y;
            m[10] = yAxis.z;
            FudgeCore.Recycler.store(yAxis);
            this.resetCache();
        }
        getTranslationTo(_mtxTarget, _vctOut = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
            return _vctOut.set(_mtxTarget.data[12] - this.data[12], _mtxTarget.data[13] - this.data[13], _mtxTarget.data[14] - this.data[14]);
            ;
        }
        serialize() {
            let serialization = {
                translation: this.translation.serialize(),
                rotation: this.rotation.serialize(),
                scaling: this.scaling.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            let mutator = {
                translation: await this.translation.deserialize(_serialization.translation),
                rotation: await this.rotation.deserialize(_serialization.rotation),
                scaling: await this.scaling.deserialize(_serialization.scaling)
            };
            this.mutate(mutator);
            return this;
        }
        getMutator() {
            if (this.mutator)
                return this.mutator;
            let mutator = {
                translation: this.translation.getMutator(),
                rotation: this.rotation.getMutator(),
                scaling: this.scaling.getMutator()
            };
            this.mutator = mutator;
            return mutator;
        }
        mutate(_mutator) {
            this.compose(_mutator.translation, _mutator.rotation ?? _mutator.quaternion, _mutator.scaling);
        }
        getMutatorAttributeTypes(_mutator) {
            let types = {};
            if (_mutator.translation)
                types.translation = "Vector3";
            if (_mutator.rotation)
                types.rotation = "Vector3";
            if (_mutator.scaling)
                types.scaling = "Vector3";
            return types;
        }
        reduceMutator(_mutator) { }
        resetCache() {
            this.#translationDirty = true;
            this.#rotationDirty = true;
            this.#quaternionDirty = true;
            this.#scalingDirty = true;
            this.modified = true;
            this.mutator = null;
        }
    }
    FudgeCore.Matrix4x4 = Matrix4x4;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Noise {
        constructor(_random = Math.random) {
            this.perm = new Uint8Array(512);
            this.permMod12 = new Uint8Array(512);
            const p = new Uint8Array(256);
            for (let i = 0; i < 256; i++)
                p[i] = i;
            let n;
            let q;
            for (let i = 255; i > 0; i--) {
                n = Math.floor((i + 1) * _random());
                q = p[i];
                p[i] = p[n];
                p[n] = q;
            }
            for (let i = 0; i < 512; i++) {
                this.perm[i] = p[i & 255];
                this.permMod12[i] = this.perm[i] % 12;
            }
        }
    }
    FudgeCore.Noise = Noise;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Noise2 extends FudgeCore.Noise {
        static { this.offset = (3.0 - Math.sqrt(3.0)) / 6.0; }
        static { this.gradient = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [0, 1], [0, -1]]; }
        #sample;
        constructor(_random = Math.random) {
            super(_random);
            this.#sample = null;
            this.sample = (_x, _y) => {
                return this.#sample(_x, _y);
            };
            this.#sample = (_x, _y) => {
                const s = (_x + _y) * 0.5 * (Math.sqrt(3.0) - 1.0);
                const i = Math.floor(_x + s);
                const j = Math.floor(_y + s);
                const t = (i + j) * Noise2.offset;
                const X0 = i - t;
                const Y0 = j - t;
                const x0 = _x - X0;
                const y0 = _y - Y0;
                const i1 = x0 > y0 ? 1 : 0;
                const j1 = x0 > y0 ? 0 : 1;
                const x1 = x0 - i1 + Noise2.offset;
                const y1 = y0 - j1 + Noise2.offset;
                const x2 = x0 - 1.0 + 2.0 * Noise2.offset;
                const y2 = y0 - 1.0 + 2.0 * Noise2.offset;
                const ii = i & 255;
                const jj = j & 255;
                const g0 = Noise2.gradient[this.permMod12[ii + this.perm[jj]]];
                const g1 = Noise2.gradient[this.permMod12[ii + i1 + this.perm[jj + j1]]];
                const g2 = Noise2.gradient[this.permMod12[ii + 1 + this.perm[jj + 1]]];
                const t0 = 0.5 - x0 * x0 - y0 * y0;
                const n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * (g0[0] * x0 + g0[1] * y0);
                const t1 = 0.5 - x1 * x1 - y1 * y1;
                const n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * (g1[0] * x1 + g1[1] * y1);
                const t2 = 0.5 - x2 * x2 - y2 * y2;
                const n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * (g2[0] * x2 + g2[1] * y2);
                return 70.14805770653952 * (n0 + n1 + n2);
            };
        }
    }
    FudgeCore.Noise2 = Noise2;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Noise3 extends FudgeCore.Noise {
        static { this.offset = 1.0 / 6.0; }
        static {
            this.gradient = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, -1], [0, 1, -1], [0, -1, -1]
            ];
        }
        #sample;
        constructor(_random = Math.random) {
            super(_random);
            this.#sample = null;
            this.sample = (_x, _y, _z) => {
                return this.#sample(_x, _y, _z);
            };
            this.#sample = (_x, _y, _z) => {
                const s = (_x + _y + _z) / 3.0;
                const i = Math.floor(_x + s);
                const j = Math.floor(_y + s);
                const k = Math.floor(_z + s);
                const t = (i + j + k) * Noise3.offset;
                const X0 = i - t;
                const Y0 = j - t;
                const Z0 = k - t;
                const x0 = _x - X0;
                const y0 = _y - Y0;
                const z0 = _z - Z0;
                let i1, j1, k1;
                let i2, j2, k2;
                if (x0 >= y0) {
                    if (y0 >= z0) {
                        i1 = i2 = j2 = 1;
                        j1 = k1 = k2 = 0;
                    }
                    else if (x0 >= z0) {
                        i1 = i2 = k2 = 1;
                        j1 = k1 = j2 = 0;
                    }
                    else {
                        k1 = i2 = k2 = 1;
                        i1 = j1 = j2 = 0;
                    }
                }
                else {
                    if (y0 < z0) {
                        k1 = j2 = k2 = 1;
                        i1 = j1 = i2 = 0;
                    }
                    else if (x0 < z0) {
                        j1 = j2 = k2 = 1;
                        i1 = k1 = i2 = 0;
                    }
                    else {
                        j1 = i2 = j2 = 1;
                        i1 = k1 = k2 = 0;
                    }
                }
                const x1 = x0 - i1 + Noise3.offset;
                const y1 = y0 - j1 + Noise3.offset;
                const z1 = z0 - k1 + Noise3.offset;
                const x2 = x0 - i2 + 2.0 * Noise3.offset;
                const y2 = y0 - j2 + 2.0 * Noise3.offset;
                const z2 = z0 - k2 + 2.0 * Noise3.offset;
                const x3 = x0 - 1.0 + 3.0 * Noise3.offset;
                const y3 = y0 - 1.0 + 3.0 * Noise3.offset;
                const z3 = z0 - 1.0 + 3.0 * Noise3.offset;
                const ii = i & 255;
                const jj = j & 255;
                const kk = k & 255;
                const g0 = Noise3.gradient[this.permMod12[ii + this.perm[jj + this.perm[kk]]]];
                const g1 = Noise3.gradient[this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]]];
                const g2 = Noise3.gradient[this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]]];
                const g3 = Noise3.gradient[this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]]];
                const t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0;
                const n0 = t0 < 0
                    ? 0.0
                    : Math.pow(t0, 4) * (g0[0] * x0 + g0[1] * y0 + g0[2] * z0);
                const t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1;
                const n1 = t1 < 0
                    ? 0.0
                    : Math.pow(t1, 4) * (g1[0] * x1 + g1[1] * y1 + g1[2] * z1);
                const t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2;
                const n2 = t2 < 0
                    ? 0.0
                    : Math.pow(t2, 4) * (g2[0] * x2 + g2[1] * y2 + g2[2] * z2);
                const t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3;
                const n3 = t3 < 0
                    ? 0.0
                    : Math.pow(t3, 4) * (g3[0] * x3 + g3[1] * y3 + g3[2] * z3);
                return 94.68493150681972 * (n0 + n1 + n2 + n3);
            };
        }
    }
    FudgeCore.Noise3 = Noise3;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Noise4 extends FudgeCore.Noise {
        static { this.offset = (5.0 - Math.sqrt(5.0)) / 20.0; }
        static { this.gradient = [[0, 1, 1, 1], [0, 1, 1, -1], [0, 1, -1, 1], [0, 1, -1, -1], [0, -1, 1, 1], [0, -1, 1, -1], [0, -1, -1, 1], [0, -1, -1, -1], [1, 0, 1, 1], [1, 0, 1, -1], [1, 0, -1, 1], [1, 0, -1, -1], [-1, 0, 1, 1], [-1, 0, 1, -1], [-1, 0, -1, 1], [-1, 0, -1, -1], [1, 1, 0, 1], [1, 1, 0, -1], [1, -1, 0, 1], [1, -1, 0, -1], [-1, 1, 0, 1], [-1, 1, 0, -1], [-1, -1, 0, 1], [-1, -1, 0, -1], [1, 1, 1, 0], [1, 1, -1, 0], [1, -1, 1, 0], [1, -1, -1, 0], [-1, 1, 1, 0], [-1, 1, -1, 0], [-1, -1, 1, 0], [-1, -1, -1, 0]]; }
        #sample;
        constructor(_random = Math.random) {
            super(_random);
            this.#sample = null;
            this.sample = (_x, _y, _z, _w) => {
                return this.#sample(_x, _y, _z, _w);
            };
            this.#sample = (_x, _y, _z, _w) => {
                const s = (_x + _y + _z + _w) * (Math.sqrt(5.0) - 1.0) / 4.0;
                const i = Math.floor(_x + s);
                const j = Math.floor(_y + s);
                const k = Math.floor(_z + s);
                const l = Math.floor(_w + s);
                const t = (i + j + k + l) * Noise4.offset;
                const X0 = i - t;
                const Y0 = j - t;
                const Z0 = k - t;
                const W0 = l - t;
                const x0 = _x - X0;
                const y0 = _y - Y0;
                const z0 = _z - Z0;
                const w0 = _w - W0;
                let rankx = 0;
                let ranky = 0;
                let rankz = 0;
                let rankw = 0;
                if (x0 > y0)
                    rankx++;
                else
                    ranky++;
                if (x0 > z0)
                    rankx++;
                else
                    rankz++;
                if (x0 > w0)
                    rankx++;
                else
                    rankw++;
                if (y0 > z0)
                    ranky++;
                else
                    rankz++;
                if (y0 > w0)
                    ranky++;
                else
                    rankw++;
                if (z0 > w0)
                    rankz++;
                else
                    rankw++;
                const i1 = rankx >= 3 ? 1 : 0;
                const j1 = ranky >= 3 ? 1 : 0;
                const k1 = rankz >= 3 ? 1 : 0;
                const l1 = rankw >= 3 ? 1 : 0;
                const i2 = rankx >= 2 ? 1 : 0;
                const j2 = ranky >= 2 ? 1 : 0;
                const k2 = rankz >= 2 ? 1 : 0;
                const l2 = rankw >= 2 ? 1 : 0;
                const i3 = rankx >= 1 ? 1 : 0;
                const j3 = ranky >= 1 ? 1 : 0;
                const k3 = rankz >= 1 ? 1 : 0;
                const l3 = rankw >= 1 ? 1 : 0;
                const x1 = x0 - i1 + Noise4.offset;
                const y1 = y0 - j1 + Noise4.offset;
                const z1 = z0 - k1 + Noise4.offset;
                const w1 = w0 - l1 + Noise4.offset;
                const x2 = x0 - i2 + 2.0 * Noise4.offset;
                const y2 = y0 - j2 + 2.0 * Noise4.offset;
                const z2 = z0 - k2 + 2.0 * Noise4.offset;
                const w2 = w0 - l2 + 2.0 * Noise4.offset;
                const x3 = x0 - i3 + 3.0 * Noise4.offset;
                const y3 = y0 - j3 + 3.0 * Noise4.offset;
                const z3 = z0 - k3 + 3.0 * Noise4.offset;
                const w3 = w0 - l3 + 3.0 * Noise4.offset;
                const x4 = x0 - 1.0 + 4.0 * Noise4.offset;
                const y4 = y0 - 1.0 + 4.0 * Noise4.offset;
                const z4 = z0 - 1.0 + 4.0 * Noise4.offset;
                const w4 = w0 - 1.0 + 4.0 * Noise4.offset;
                const ii = i & 255;
                const jj = j & 255;
                const kk = k & 255;
                const ll = l & 255;
                const g0 = Noise4.gradient[this.perm[ii + this.perm[jj + this.perm[kk + this.perm[ll]]]] %
                    32];
                const g1 = Noise4.gradient[this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1 + this.perm[ll + l1]]]] % 32];
                const g2 = Noise4.gradient[this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2 + this.perm[ll + l2]]]] % 32];
                const g3 = Noise4.gradient[this.perm[ii + i3 + this.perm[jj + j3 + this.perm[kk + k3 + this.perm[ll + l3]]]] % 32];
                const g4 = Noise4.gradient[this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1 + this.perm[ll + 1]]]] % 32];
                const t0 = 0.5 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
                const n0 = t0 < 0
                    ? 0.0
                    : Math.pow(t0, 4) * (g0[0] * x0 + g0[1] * y0 + g0[2] * z0 + g0[3] * w0);
                const t1 = 0.5 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
                const n1 = t1 < 0
                    ? 0.0
                    : Math.pow(t1, 4) * (g1[0] * x1 + g1[1] * y1 + g1[2] * z1 + g1[3] * w1);
                const t2 = 0.5 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
                const n2 = t2 < 0
                    ? 0.0
                    : Math.pow(t2, 4) * (g2[0] * x2 + g2[1] * y2 + g2[2] * z2 + g2[3] * w2);
                const t3 = 0.5 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
                const n3 = t3 < 0
                    ? 0.0
                    : Math.pow(t3, 4) * (g3[0] * x3 + g3[1] * y3 + g3[2] * z3 + g3[3] * w3);
                const t4 = 0.5 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
                const n4 = t4 < 0
                    ? 0.0
                    : Math.pow(t4, 4) * (g4[0] * x4 + g4[1] * y4 + g4[2] * z4 + g4[3] * w4);
                return 72.37855765153665 * (n0 + n1 + n2 + n3 + n4);
            };
        }
    }
    FudgeCore.Noise4 = Noise4;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Quaternion extends FudgeCore.Mutable {
        #eulerAngles = FudgeCore.Vector3.ZERO();
        #eulerAnglesDirty;
        constructor(_x = 0, _y = 0, _z = 0, _w = 1) {
            super();
            this.set(_x, _y, _z, _w);
        }
        static IDENTITY() {
            return FudgeCore.Recycler.get(Quaternion);
        }
        static NORMALIZATION(_q, _out = FudgeCore.Recycler.reuse(Quaternion)) {
            const x = _q.x;
            const y = _q.y;
            const z = _q.z;
            const w = _q.w;
            let length = x * x + y * y + z * z + w * w;
            if (length > 0)
                length = 1 / Math.sqrt(length);
            _out.x = x * length;
            _out.y = y * length;
            _out.z = z * length;
            _out.w = w * length;
            return _out;
        }
        static ROTATION_EULER_ANGLES(_eulerAngles, _out = FudgeCore.Recycler.reuse(Quaternion)) {
            _out.eulerAngles = _eulerAngles;
            return _out;
        }
        static ROTATION_AXIS_ANGLE(_axis, _angle, _out = FudgeCore.Recycler.reuse(Quaternion)) {
            const halfAngle = _angle * FudgeCore.Calc.deg2rad / 2;
            const sinHalfAngle = Math.sin(halfAngle);
            return _out.set(_axis.x * sinHalfAngle, _axis.y * sinHalfAngle, _axis.z * sinHalfAngle, Math.cos(halfAngle));
        }
        static ROTATION_LOOK_IN(_forward, _up, _out = FudgeCore.Recycler.reuse(Quaternion)) {
            const right = FudgeCore.Vector3.CROSS(_up, _forward);
            const matrix = FudgeCore.Recycler.reuse(FudgeCore.Matrix4x4);
            matrix.set(right.x, right.y, right.z, 0, _up.x, _up.y, _up.z, 0, _forward.x, _forward.y, _forward.z, 0, 0, 0, 0, 1);
            _out.copy(matrix.quaternion);
            FudgeCore.Recycler.store(right);
            FudgeCore.Recycler.store(matrix);
            return _out;
        }
        static ROTATION_FROM_TO(_from, _to, _out = FudgeCore.Recycler.reuse(Quaternion)) {
            const angle = Math.acos(FudgeCore.Vector3.DOT(_from, _to)) * FudgeCore.Calc.rad2deg;
            const axis = FudgeCore.Vector3.CROSS(_from, _to).normalize();
            Quaternion.ROTATION_AXIS_ANGLE(axis, angle, _out);
            FudgeCore.Recycler.store(axis);
            return _out;
        }
        static ROTATION(_vector, _angleOrUp) {
            const result = FudgeCore.Recycler.get(Quaternion);
            if (_angleOrUp == undefined) {
                result.eulerAngles = _vector;
            }
            else if (typeof _angleOrUp == "number") {
                let halfAngle = _angleOrUp * FudgeCore.Calc.deg2rad / 2;
                let sinHalfAngle = Math.sin(halfAngle);
                result.set(_vector.x * sinHalfAngle, _vector.y * sinHalfAngle, _vector.z * sinHalfAngle, Math.cos(halfAngle));
            }
            else {
                const right = FudgeCore.Vector3.CROSS(_angleOrUp, _vector);
                const matrix = FudgeCore.Recycler.reuse(FudgeCore.Matrix4x4);
                matrix.set(right.x, right.y, right.z, 0, _angleOrUp.x, _angleOrUp.y, _angleOrUp.z, 0, _vector.x, _vector.y, _vector.z, 0, 0, 0, 0, 1);
                result.copy(matrix.quaternion);
                FudgeCore.Recycler.store(right);
                FudgeCore.Recycler.store(matrix);
            }
            return result;
        }
        static PRODUCT(_left, _right, _out = FudgeCore.Recycler.reuse(Quaternion)) {
            const ax = _left.x;
            const ay = _left.y;
            const az = _left.z;
            const aw = _left.w;
            const bx = _right.x;
            const by = _right.y;
            const bz = _right.z;
            const bw = _right.w;
            _out.set(ax * bw + ay * bz - az * by + aw * bx, -ax * bz + ay * bw + az * bx + aw * by, ax * by - ay * bx + az * bw + aw * bz, -ax * bx - ay * by - az * bz + aw * bw);
            return _out;
        }
        static INVERSE(_quaternion, _out = FudgeCore.Recycler.reuse(Quaternion)) {
            return Quaternion.CONJUGATE(_quaternion, _out);
        }
        static CONJUGATE(_quaternion, _out = FudgeCore.Recycler.reuse(Quaternion)) {
            return _out.set(-_quaternion.x, -_quaternion.y, -_quaternion.z, _quaternion.w);
        }
        static DOT(_a, _b) {
            return _a.x * _b.x + _a.y * _b.y + _a.z * _b.z + _a.w * _b.w;
        }
        static LERP(_a, _b, _t, _out = FudgeCore.Recycler.reuse(Quaternion)) {
            const ax = _a.x;
            const ay = _a.y;
            const az = _a.z;
            const aw = _a.w;
            _out.x = ax + _t * (_b.x - ax);
            _out.y = ay + _t * (_b.y - ay);
            _out.z = az + _t * (_b.z - az);
            _out.w = aw + _t * (_b.w - aw);
            return _out;
        }
        static SLERP(_a, _b, _t, _out = FudgeCore.Recycler.reuse(Quaternion)) {
            const ax = _a.x, ay = _a.y, az = _a.z, aw = _a.w;
            let bx = _b.x, by = _b.y, bz = _b.z, bw = _b.w;
            let scale0;
            let scale1;
            let cosom = ax * bx + ay * by + az * bz + aw * bw;
            if (cosom < 0.0) {
                cosom = -cosom;
                bx = -bx;
                by = -by;
                bz = -bz;
                bw = -bw;
            }
            if (1.0 - cosom > Number.EPSILON) {
                const omega = Math.acos(cosom);
                const sinom = Math.sin(omega);
                scale0 = Math.sin((1.0 - _t) * omega) / sinom;
                scale1 = Math.sin(_t * omega) / sinom;
            }
            else {
                scale0 = 1.0 - _t;
                scale1 = _t;
            }
            _out.x = scale0 * ax + scale1 * bx;
            _out.y = scale0 * ay + scale1 * by;
            _out.z = scale0 * az + scale1 * bz;
            _out.w = scale0 * aw + scale1 * bw;
            return _out;
        }
        static ANGLE(_from, _to) {
            return 2 * Math.acos(Math.abs(FudgeCore.Calc.clamp(Quaternion.DOT(_from, _to), -1, 1))) * FudgeCore.Calc.rad2deg;
        }
        static SLERP_ARRAY(_a, _aOffset, _b, _bOffset, _t, _out, _outOffset) {
            const ax = _a[0], ay = _a[_aOffset + 1], az = _a[_aOffset + 2], aw = _a[_aOffset + 3];
            let bx = _b[0], by = _b[_bOffset + 1], bz = _b[_bOffset + 2], bw = _b[_bOffset + 3];
            let scale0;
            let scale1;
            let cosom = ax * bx + ay * by + az * bz + aw * bw;
            if (cosom < 0.0) {
                cosom = -cosom;
                bx = -bx;
                by = -by;
                bz = -bz;
                bw = -bw;
            }
            if (1.0 - cosom > Number.EPSILON) {
                const omega = Math.acos(cosom);
                const sinom = Math.sin(omega);
                scale0 = Math.sin((1.0 - _t) * omega) / sinom;
                scale1 = Math.sin(_t * omega) / sinom;
            }
            else {
                scale0 = 1.0 - _t;
                scale1 = _t;
            }
            _out[0] = scale0 * ax + scale1 * bx;
            _out[_outOffset + 1] = scale0 * ay + scale1 * by;
            _out[_outOffset + 2] = scale0 * az + scale1 * bz;
            _out[_outOffset + 3] = scale0 * aw + scale1 * bw;
            return _out;
        }
        static NORMALIZE_ARRAY(_a, _aOffset, _out, _outOffset) {
            const x = _a[0];
            const y = _a[_aOffset + 1];
            const z = _a[_aOffset + 2];
            const w = _a[_aOffset + 3];
            let len = x * x + y * y + z * z + w * w;
            if (len > 0)
                len = 1 / Math.sqrt(len);
            _out[0] = x * len;
            _out[_outOffset + 1] = y * len;
            _out[_outOffset + 2] = z * len;
            _out[_outOffset + 3] = w * len;
            return _out;
        }
        static negate(_q) {
            _q.x = -_q.x;
            _q.y = -_q.y;
            _q.z = -_q.z;
            _q.w = -_q.w;
        }
        get isArrayConvertible() {
            return true;
        }
        get clone() {
            return FudgeCore.Recycler.reuse(Quaternion).copy(this);
        }
        get eulerAngles() {
            if (this.#eulerAnglesDirty) {
                this.#eulerAnglesDirty = false;
                let sinrcosp = 2 * (this.w * this.x + this.y * this.z);
                let cosrcosp = 1 - 2 * (this.x * this.x + this.y * this.y);
                this.#eulerAngles.x = Math.atan2(sinrcosp, cosrcosp);
                let sinp = 2 * (this.w * this.y - this.z * this.x);
                if (Math.abs(sinp) >= 1)
                    this.#eulerAngles.y = sinp < 0 ? -Math.abs(Math.PI / 2) : Math.abs(Math.PI / 2);
                else
                    this.#eulerAngles.y = Math.asin(sinp);
                let sinycosp = 2 * (this.w * this.z + this.x * this.y);
                let cosycosp = 1 - 2 * (this.y * this.y + this.z * this.z);
                this.#eulerAngles.z = Math.atan2(sinycosp, cosycosp);
                this.#eulerAngles.scale(FudgeCore.Calc.rad2deg);
            }
            return this.#eulerAngles;
        }
        set eulerAngles(_eulerAngles) {
            const halfdeg2rad = FudgeCore.Calc.deg2rad / 2;
            const x = _eulerAngles.x * halfdeg2rad, y = _eulerAngles.y * halfdeg2rad, z = _eulerAngles.z * halfdeg2rad;
            const cosX = Math.cos(x);
            const cosY = Math.cos(y);
            const cosZ = Math.cos(z);
            const sinX = Math.sin(x);
            const sinY = Math.sin(y);
            const sinZ = Math.sin(z);
            this.x = sinX * cosY * cosZ - cosX * sinY * sinZ;
            this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
            this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
            this.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
            this.#eulerAngles.copy(_eulerAngles);
            this.#eulerAnglesDirty = false;
        }
        copy(_original) {
            this.x = _original.x;
            this.y = _original.y;
            this.z = _original.z;
            this.w = _original.w;
            this.#eulerAnglesDirty = _original.#eulerAnglesDirty;
            if (!this.#eulerAnglesDirty)
                this.#eulerAngles.copy(_original.#eulerAngles);
            return this;
        }
        recycle() {
            this.set(0, 0, 0, 1);
        }
        set(_x, _y, _z, _w) {
            this.x = _x;
            this.y = _y;
            this.z = _z;
            this.w = _w;
            this.resetCache();
            return this;
        }
        equals(_compare, _tolerance = Number.EPSILON) {
            return Math.abs(this.x - _compare.x) <= _tolerance &&
                Math.abs(this.y - _compare.y) <= _tolerance &&
                Math.abs(this.z - _compare.z) <= _tolerance &&
                Math.abs(this.w - _compare.w) <= _tolerance;
        }
        normalize() {
            let length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
            if (length === 0) {
                this.set(0, 0, 0, 1);
            }
            else {
                length = 1 / length;
                this.x *= length;
                this.y *= length;
                this.z *= length;
                this.w *= length;
            }
            this.resetCache();
            return this;
        }
        negate() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.w = -this.w;
            this.resetCache();
            return this;
        }
        invert() {
            return this.conjugate();
        }
        conjugate() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.resetCache();
            return this;
        }
        multiply(_quaternion, _fromLeft = false) {
            return Quaternion.PRODUCT(this, _quaternion, this);
        }
        premultiply(_quaternion) {
            return Quaternion.PRODUCT(_quaternion, this, this);
        }
        toString() {
            return `ƒ.Quaternion(x: ${this.x}, y: ${this.y}, z: ${this.z}, w: ${this.w})`;
        }
        fromArray(_array, _offset = 0) {
            this.x = _array[_offset];
            this.y = _array[_offset + 1];
            this.z = _array[_offset + 2];
            this.w = _array[_offset + 3];
            return this;
        }
        toArray(_out = new Array(4), _offset = 0) {
            _out[_offset] = this.x;
            _out[_offset + 1] = this.y;
            _out[_offset + 2] = this.z;
            _out[_offset + 3] = this.w;
            return _out;
        }
        serialize() {
            let serialization = this.getMutator();
            serialization.toJSON = () => { return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`; };
            return serialization;
        }
        async deserialize(_serialization) {
            if (typeof (_serialization) == "string") {
                [this.x, this.y, this.z, this.w] = JSON.parse(_serialization);
            }
            else
                this.mutate(_serialization);
            return this;
        }
        mutate(_mutator) {
            if (_mutator.x != undefined)
                this.x = _mutator.x;
            if (_mutator.y != undefined)
                this.y = _mutator.y;
            if (_mutator.z != undefined)
                this.z = _mutator.z;
            if (_mutator.w != undefined)
                this.w = _mutator.w;
            this.resetCache();
        }
        reduceMutator(_mutator) { }
        resetCache() {
            this.#eulerAnglesDirty = true;
        }
    }
    FudgeCore.Quaternion = Quaternion;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Random {
        static { this.default = new Random(); }
        constructor(_seedOrFunction) {
            this.generate = Math.random;
            if (_seedOrFunction instanceof Function)
                this.generate = _seedOrFunction;
            else if (_seedOrFunction == undefined)
                this.generate = Math.random;
            else
                this.generate = new FudgeCore.LFIB4(_seedOrFunction);
        }
        getNorm() {
            return this.generate();
        }
        getRange(_min, _max) {
            return _min + this.generate() * (_max - _min);
        }
        getRangeFloored(_min, _max) {
            return Math.floor(this.getRange(_min, _max));
        }
        getBoolean() {
            return this.generate() < 0.5;
        }
        getSign() {
            return this.getBoolean() ? 1 : -1;
        }
        getIndex(_array) {
            if (_array.length > 0)
                return this.getRangeFloored(0, _array.length);
            return -1;
        }
        getElement(_array) {
            if (_array.length > 0)
                return _array[this.getIndex(_array)];
            return null;
        }
        splice(_array) {
            return _array.splice(this.getIndex(_array), 1)[0];
        }
        getKey(_map) {
            let keys = Array.from(_map.keys());
            return keys[this.getIndex(keys)];
        }
        getPropertyName(_object) {
            let keys = Object.getOwnPropertyNames(_object);
            return keys[this.getIndex(keys)];
        }
        getPropertySymbol(_object) {
            let keys = Object.getOwnPropertySymbols(_object);
            return keys[this.getIndex(keys)];
        }
        getVector3(_corner0, _corner1) {
            return new FudgeCore.Vector3(this.getRange(_corner0.x, _corner1.x), this.getRange(_corner0.y, _corner1.y), this.getRange(_corner0.z, _corner1.z));
        }
        getVector2(_corner0, _corner1) {
            return new FudgeCore.Vector2(this.getRange(_corner0.x, _corner1.x), this.getRange(_corner0.y, _corner1.y));
        }
        getColor() {
            return new FudgeCore.Color(this.getNorm(), this.getNorm(), this.getNorm(), 1);
        }
    }
    FudgeCore.Random = Random;
    FudgeCore.random = new Random();
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Vector3 extends FudgeCore.Mutable {
        static { this.keys = ["x", "y", "z"]; }
        constructor(_x = 0, _y = 0, _z = 0) {
            super();
            this.set(_x, _y, _z);
        }
        static X(_scale = 1) {
            return FudgeCore.Recycler.reuse(Vector3).set(_scale, 0, 0);
        }
        static Y(_scale = 1) {
            return FudgeCore.Recycler.reuse(Vector3).set(0, _scale, 0);
        }
        static Z(_scale = 1) {
            return FudgeCore.Recycler.reuse(Vector3).set(0, 0, _scale);
        }
        static ZERO() {
            return FudgeCore.Recycler.get(Vector3);
        }
        static ONE(_scale = 1) {
            return FudgeCore.Recycler.reuse(Vector3).set(_scale, _scale, _scale);
        }
        static TRANSFORMATION(_vector, _transform, _includeTranslation = true, _out = FudgeCore.Recycler.reuse(Vector3)) {
            if (_transform instanceof FudgeCore.Matrix4x4) {
                const m = _transform.getArray();
                _out.set(m[0] * _vector.x + m[4] * _vector.y + m[8] * _vector.z, m[1] * _vector.x + m[5] * _vector.y + m[9] * _vector.z, m[2] * _vector.x + m[6] * _vector.y + m[10] * _vector.z);
                if (_includeTranslation)
                    _out.add(_transform.translation);
                return _out;
            }
            const qx = _transform.w * _vector.x + _transform.y * _vector.z - _transform.z * _vector.y;
            const qy = _transform.w * _vector.y + _transform.z * _vector.x - _transform.x * _vector.z;
            const qz = _transform.w * _vector.z + _transform.x * _vector.y - _transform.y * _vector.x;
            const qw = -_transform.x * _vector.x - _transform.y * _vector.y - _transform.z * _vector.z;
            return _out.set(qx * _transform.w + qw * -_transform.x + qy * -_transform.z - qz * -_transform.y, qy * _transform.w + qw * -_transform.y + qz * -_transform.x - qx * -_transform.z, qz * _transform.w + qw * -_transform.z + qx * -_transform.y - qy * -_transform.x);
        }
        static NORMALIZATION(_vector, _length = 1, _out = FudgeCore.Recycler.reuse(Vector3)) {
            return _out.copy(_vector).normalize(_length);
        }
        static SUM(_a, _b, _out = FudgeCore.Recycler.reuse(Vector3)) {
            _out.x = _a.x + _b.x;
            _out.y = _a.y + _b.y;
            _out.z = _a.z + _b.z;
            return _out;
        }
        static DIFFERENCE(_minuend, _subtrahend, _out = FudgeCore.Recycler.reuse(Vector3)) {
            _out.x = _minuend.x - _subtrahend.x;
            _out.y = _minuend.y - _subtrahend.y;
            _out.z = _minuend.z - _subtrahend.z;
            return _out;
        }
        static SCALE(_vector, _scaling, _out = FudgeCore.Recycler.reuse(Vector3)) {
            _out.x = _vector.x * _scaling;
            _out.y = _vector.y * _scaling;
            _out.z = _vector.z * _scaling;
            return _out;
        }
        static NEGATION(_vector, _out = FudgeCore.Recycler.reuse(Vector3)) {
            _out.x = -_vector.x;
            _out.y = -_vector.y;
            _out.z = -_vector.z;
            return _out;
        }
        static RATIO(_dividend, _divisor, _out = FudgeCore.Recycler.reuse(Vector3)) {
            _out.x = _dividend.x / _divisor.x;
            _out.y = _dividend.y / _divisor.y;
            _out.z = _dividend.z / _divisor.z;
            return _out;
        }
        static CROSS(_a, _b, _out = FudgeCore.Recycler.reuse(Vector3)) {
            const ax = _a.x;
            const ay = _a.y;
            const az = _a.z;
            const bx = _b.x;
            const by = _b.y;
            const bz = _b.z;
            _out.x = ay * bz - az * by;
            _out.y = az * bx - ax * bz;
            _out.z = ax * by - ay * bx;
            return _out;
        }
        static DOT(_a, _b) {
            return _a.x * _b.x + _a.y * _b.y + _a.z * _b.z;
        }
        static REFLECTION(_incoming, _normal, _out = FudgeCore.Recycler.reuse(Vector3)) {
            if (_out == _incoming)
                FudgeCore.Recycler.store(_incoming = _incoming.clone);
            return Vector3.SUM(_incoming, Vector3.SCALE(_normal, 2 * -Vector3.DOT(_incoming, _normal), _out), _out);
        }
        static GEO(_longitude = 0, _latitude = 0, _magnitude = 1, _out = FudgeCore.Recycler.reuse(Vector3)) {
            const geo = FudgeCore.Recycler.reuse(FudgeCore.Geo3).set(_longitude, _latitude, _magnitude);
            _out.geo = geo;
            FudgeCore.Recycler.store(geo);
            return _out;
        }
        static ANGLE(_from, _to) {
            const ax = _from.x;
            const ay = _from.y;
            const az = _from.z;
            const bx = _to.x;
            const by = _to.y;
            const bz = _to.z;
            const mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz));
            const cosine = mag && Vector3.DOT(_from, _to) / mag;
            return Math.acos(Math.min(Math.max(cosine, -1), 1)) * FudgeCore.Calc.rad2deg;
        }
        static PROJECTION(_a, _b, _out = FudgeCore.Recycler.reuse(Vector3)) {
            return _out.copy(_a).project(_b);
        }
        static LERP(_a, _b, _t, _out = FudgeCore.Recycler.reuse(Vector3)) {
            const ax = _a.x;
            const ay = _a.y;
            const az = _a.z;
            _out.x = ax + _t * (_b.x - ax);
            _out.y = ay + _t * (_b.y - ay);
            _out.z = az + _t * (_b.z - az);
            return _out;
        }
        static SLERP(_a, _b, _t, _out = FudgeCore.Recycler.reuse(Vector3)) {
            const angle = Math.acos(Math.min(Math.max(Vector3.DOT(_a, _b), -1), 1));
            const sinTotal = Math.sin(angle);
            const ratioA = Math.sin((1 - _t) * angle) / sinTotal;
            const ratioB = Math.sin(_t * angle) / sinTotal;
            _out.x = ratioA * _a.x + ratioB * _b.x;
            _out.y = ratioA * _a.y + ratioB * _b.y;
            _out.z = ratioA * _a.z + ratioB * _b.z;
            return _out;
        }
        static SMOOTHDAMP(_current, _target, _velocity, _smoothTime, _timeFrame, _maxSpeed = Infinity, _out = FudgeCore.Recycler.reuse(Vector3)) {
            const omega = 2 / _smoothTime;
            const x = omega * _timeFrame;
            const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
            let changeX = _current.x - _target.x;
            let changeY = _current.y - _target.y;
            let changeZ = _current.z - _target.z;
            const maxChange = _maxSpeed * _smoothTime;
            const magnitudeSquared = changeX * changeX + changeY * changeY + changeZ * changeZ;
            let targetX;
            let targetY;
            let targetZ;
            if (magnitudeSquared > maxChange * maxChange) {
                let scalar = maxChange / Math.sqrt(magnitudeSquared);
                changeX *= scalar;
                changeY *= scalar;
                changeZ *= scalar;
                targetX = _current.x - changeX;
                targetY = _current.y - changeY;
                targetZ = _current.z - changeZ;
            }
            else {
                targetX = _target.x;
                targetY = _target.y;
                targetZ = _target.z;
            }
            let tempX = (_velocity.x + omega * changeX) * _timeFrame;
            let tempY = (_velocity.y + omega * changeY) * _timeFrame;
            let tempZ = (_velocity.z + omega * changeZ) * _timeFrame;
            _velocity.x = (_velocity.x - omega * tempX) * exp;
            _velocity.y = (_velocity.y - omega * tempY) * exp;
            _velocity.z = (_velocity.z - omega * tempZ) * exp;
            _out.x = targetX + (changeX + tempX) * exp;
            _out.y = targetY + (changeY + tempY) * exp;
            _out.z = targetZ + (changeZ + tempZ) * exp;
            return _out;
        }
        get isArrayConvertible() {
            return true;
        }
        get magnitude() {
            const x = this.x;
            const y = this.y;
            const z = this.z;
            return Math.sqrt(x * x + y * y + z * z);
        }
        get magnitudeSquared() {
            const x = this.x;
            const y = this.y;
            const z = this.z;
            return x * x + y * y + z * z;
        }
        get geo() {
            let geo = FudgeCore.Recycler.get(FudgeCore.Geo3);
            geo.magnitude = this.magnitude;
            if (geo.magnitude === 0)
                return geo;
            geo.longitude = 180 * Math.atan2(this.x / geo.magnitude, this.z / geo.magnitude) / Math.PI;
            geo.latitude = 180 * Math.asin(this.y / geo.magnitude) / Math.PI;
            return geo;
        }
        set geo(_geo) {
            this.set(0, 0, _geo.magnitude);
            const mtxRotationX = FudgeCore.Matrix4x4.ROTATION_X(_geo.latitude);
            const mtxRotationY = FudgeCore.Matrix4x4.ROTATION_Y(_geo.longitude);
            this.transform(mtxRotationX);
            this.transform(mtxRotationY);
            FudgeCore.Recycler.store(mtxRotationX);
            FudgeCore.Recycler.store(mtxRotationY);
        }
        get clone() {
            return FudgeCore.Recycler.reuse(Vector3).copy(this);
        }
        copy(_original) {
            this.x = _original.x;
            this.y = _original.y;
            this.z = _original.z;
            return this;
        }
        set(_x = 0, _y = 0, _z = 0) {
            this.x = _x;
            this.y = _y;
            this.z = _z;
            return this;
        }
        recycle() {
            this.set(0, 0, 0);
        }
        equals(_compare, _tolerance = Number.EPSILON) {
            if (Math.abs(this.x - _compare.x) > _tolerance)
                return false;
            if (Math.abs(this.y - _compare.y) > _tolerance)
                return false;
            if (Math.abs(this.z - _compare.z) > _tolerance)
                return false;
            return true;
        }
        isInsideCube(_corner1, _corner2) {
            const diagonal = Vector3.DIFFERENCE(_corner2, _corner1);
            const relative = Vector3.DIFFERENCE(this, _corner1);
            const ratio = Vector3.RATIO(relative, diagonal);
            FudgeCore.Recycler.store(diagonal);
            FudgeCore.Recycler.store(relative);
            FudgeCore.Recycler.store(ratio);
            if (ratio.x > 1 || ratio.x < 0)
                return false;
            if (ratio.y > 1 || ratio.y < 0)
                return false;
            if (ratio.z > 1 || ratio.z < 0)
                return false;
            return true;
        }
        isInsideSphere(_center, _radius) {
            const difference = Vector3.DIFFERENCE(this, _center);
            FudgeCore.Recycler.store(difference);
            return difference.magnitudeSquared < (_radius * _radius);
        }
        getDistance(_to) {
            const x = _to.x - this.x;
            const y = _to.y - this.y;
            const z = _to.z - this.z;
            return Math.sqrt(x * x + y * y + z * z);
        }
        add(_addend) {
            this.x += _addend.x;
            this.y += _addend.y;
            this.z += _addend.z;
            return this;
        }
        subtract(_subtrahend) {
            this.x -= _subtrahend.x;
            this.y -= _subtrahend.y;
            this.z -= _subtrahend.z;
            return this;
        }
        scale(_scalar) {
            this.x *= _scalar;
            this.y *= _scalar;
            this.z *= _scalar;
            return this;
        }
        negate() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        }
        normalize(_length = 1) {
            let magnitudeSquared = this.magnitudeSquared;
            if (magnitudeSquared == 0)
                throw (new RangeError("Impossible normalization"));
            this.scale(_length / Math.sqrt(magnitudeSquared));
            return this;
        }
        reflect(_normal) {
            return Vector3.REFLECTION(this, _normal, this);
        }
        project(_on) {
            let scalar = Vector3.DOT(this, _on) / _on.magnitudeSquared;
            this.x = _on.x * scalar;
            this.y = _on.y * scalar;
            this.z = _on.z * scalar;
            return this;
        }
        transform(_transform, _includeTranslation = true) {
            return Vector3.TRANSFORMATION(this, _transform, _includeTranslation, this);
        }
        shuffle() {
            for (let i = Vector3.keys.length - 1, j; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                const temp = this[Vector3.keys[i]];
                this[Vector3.keys[i]] = this[Vector3.keys[j]];
                this[Vector3.keys[j]] = temp;
            }
            return this;
        }
        min(_compare) {
            this.x = Math.min(this.x, _compare.x);
            this.y = Math.min(this.y, _compare.y);
            this.z = Math.min(this.z, _compare.z);
            return this;
        }
        max(_compare) {
            this.x = Math.max(this.x, _compare.x);
            this.y = Math.max(this.y, _compare.y);
            this.z = Math.max(this.z, _compare.z);
            return this;
        }
        map(_function, _out = FudgeCore.Recycler.reuse(Vector3)) {
            _out.x = _function(this.x, 0, "x", this);
            _out.y = _function(this.y, 1, "y", this);
            _out.z = _function(this.z, 2, "z", this);
            return _out;
        }
        apply(_function) {
            this.x = _function(this.x, 0, "x", this);
            this.y = _function(this.y, 1, "y", this);
            this.z = _function(this.z, 2, "z", this);
            return this;
        }
        fromArray(_array, _offset = 0) {
            this.x = _array[_offset];
            this.y = _array[_offset + 1];
            this.z = _array[_offset + 2];
            return this;
        }
        toArray(_out = new Array(3), _offset = 0) {
            _out[_offset] = this.x;
            _out[_offset + 1] = this.y;
            _out[_offset + 2] = this.z;
            return _out;
        }
        toVector2(_out = FudgeCore.Recycler.reuse(FudgeCore.Vector2)) {
            return _out.set(this.x, this.y);
        }
        toString() {
            let result = `(${this.x.toPrecision(5)}, ${this.y.toPrecision(5)}, ${this.z.toPrecision(5)})`;
            return result;
        }
        serialize() {
            let serialization = this.getMutator();
            serialization.toJSON = () => { return `[${this.x}, ${this.y}, ${this.z}]`; };
            return serialization;
        }
        async deserialize(_serialization) {
            if (typeof (_serialization) == "string") {
                [this.x, this.y, this.z] = JSON.parse(_serialization);
            }
            else
                this.mutate(_serialization);
            return this;
        }
        mutate(_mutator) {
            if (_mutator.x != undefined)
                this.x = _mutator.x;
            if (_mutator.y != undefined)
                this.y = _mutator.y;
            if (_mutator.z != undefined)
                this.z = _mutator.z;
        }
        getMutator() {
            let mutator = { x: this.x, y: this.y, z: this.z };
            return mutator;
        }
        reduceMutator(_mutator) { }
    }
    FudgeCore.Vector3 = Vector3;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Vector4 extends FudgeCore.Mutable {
        constructor(_x = 0, _y = 0, _z = 0, _w = 0) {
            super();
            this.set(_x, _y, _z, _w);
        }
        static NORMALIZATION(_vector, _length = 1, _out = FudgeCore.Recycler.reuse(Vector4)) {
            return _out.copy(_vector).normalize(_length);
        }
        static SUM(_a, _b, _out = FudgeCore.Recycler.reuse(Vector4)) {
            return _out.set(_a.x + _b.x, _a.y + _b.y, _a.z + _b.z, _a.w + _b.w);
        }
        static DIFFERENCE(_minuend, _subtrahend, _out = FudgeCore.Recycler.reuse(Vector4)) {
            return _out.set(_minuend.x - _subtrahend.x, _minuend.y - _subtrahend.y, _minuend.z - _subtrahend.z, _minuend.w - _subtrahend.w);
        }
        static SCALE(_vector, _scaling, _out = FudgeCore.Recycler.reuse(Vector4)) {
            return _out.set(_vector.x * _scaling, _vector.y * _scaling, _vector.z * _scaling, _vector.w * _scaling);
        }
        static NEGATION(_vector, _out = FudgeCore.Recycler.reuse(Vector4)) {
            return _out.set(-_vector.x, -_vector.y, -_vector.z, -_vector.w);
        }
        static DOT(_a, _b) {
            return _a.x * _b.x + _a.y * _b.y + _a.z * _b.z + _a.w * _b.w;
        }
        get isArrayConvertible() {
            return true;
        }
        get magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        }
        get magnitudeSquared() {
            return Vector4.DOT(this, this);
        }
        get clone() {
            return FudgeCore.Recycler.reuse(Vector4).copy(this);
        }
        copy(_original) {
            this.x = _original.x;
            this.y = _original.y;
            this.z = _original.z;
            this.w = _original.w;
            return this;
        }
        set(_x, _y, _z, _w) {
            this.x = _x;
            this.y = _y;
            this.z = _z;
            this.w = _w;
            return this;
        }
        recycle() {
            this.set(0, 0, 0, 0);
        }
        equals(_compare, _tolerance = Number.EPSILON) {
            return Math.abs(this.x - _compare.x) <= _tolerance &&
                Math.abs(this.y - _compare.y) <= _tolerance &&
                Math.abs(this.z - _compare.z) <= _tolerance &&
                Math.abs(this.w - _compare.w) <= _tolerance;
        }
        add(_addend) {
            this.x += _addend.x;
            this.y += _addend.y;
            this.z += _addend.z;
            this.w += _addend.w;
            return this;
        }
        subtract(_subtrahend) {
            this.x -= _subtrahend.x;
            this.y -= _subtrahend.y;
            this.z -= _subtrahend.z;
            this.w -= _subtrahend.w;
            return this;
        }
        scale(_scalar) {
            this.x *= _scalar;
            this.y *= _scalar;
            this.z *= _scalar;
            this.w *= _scalar;
            return this;
        }
        negate() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.w = -this.w;
            return this;
        }
        normalize(_length = 1) {
            let magnitudeSquared = this.magnitudeSquared;
            if (magnitudeSquared == 0)
                throw (new RangeError("Impossible normalization"));
            this.scale(_length / Math.sqrt(magnitudeSquared));
            return this;
        }
        min(_compare) {
            this.x = Math.min(this.x, _compare.x);
            this.y = Math.min(this.y, _compare.y);
            this.z = Math.min(this.z, _compare.z);
            this.w = Math.min(this.w, _compare.w);
            return this;
        }
        max(_compare) {
            this.x = Math.max(this.x, _compare.x);
            this.y = Math.max(this.y, _compare.y);
            this.z = Math.max(this.z, _compare.z);
            this.w = Math.max(this.w, _compare.w);
            return this;
        }
        map(_function, _out = FudgeCore.Recycler.reuse(Vector4)) {
            _out.x = _function(this.x, 0, "x", this);
            _out.y = _function(this.y, 1, "y", this);
            _out.z = _function(this.z, 2, "z", this);
            _out.w = _function(this.w, 3, "w", this);
            return _out;
        }
        apply(_function) {
            this.x = _function(this.x, 0, "x", this);
            this.y = _function(this.y, 1, "y", this);
            this.z = _function(this.z, 2, "z", this);
            this.w = _function(this.w, 3, "w", this);
            return this;
        }
        fromArray(_array, _offset = 0) {
            this.x = _array[_offset];
            this.y = _array[_offset + 1];
            this.z = _array[_offset + 2];
            this.w = _array[_offset + 3];
            return this;
        }
        toArray(_out = new Array(4), _offset = 0) {
            _out[_offset] = this.x;
            _out[_offset + 1] = this.y;
            _out[_offset + 2] = this.z;
            _out[_offset + 3] = this.w;
            return _out;
        }
        toVector2(_out = FudgeCore.Recycler.reuse(FudgeCore.Vector2)) {
            return _out.set(this.x, this.y);
        }
        toVector3(_out = FudgeCore.Recycler.reuse(FudgeCore.Vector3)) {
            return _out.set(this.x, this.y, this.z);
        }
        toString() {
            let result = `(${this.x.toPrecision(5)}, ${this.y.toPrecision(5)}, ${this.z.toPrecision(5)}, ${this.w.toPrecision(5)})`;
            return result;
        }
        serialize() {
            return { toJSON: () => `[${this.x}, ${this.y}, ${this.z}, ${this.w}]` };
        }
        async deserialize(_serialization) {
            [this.x, this.y, this.z, this.w] = JSON.parse(_serialization);
            return this;
        }
        mutate(_mutator) {
            if (_mutator.x != undefined)
                this.x = _mutator.x;
            if (_mutator.y != undefined)
                this.y = _mutator.y;
            if (_mutator.z != undefined)
                this.z = _mutator.z;
            if (_mutator.w != undefined)
                this.w = _mutator.w;
        }
        reduceMutator(_mutator) { }
        ;
    }
    FudgeCore.Vector4 = Vector4;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Face {
        constructor(_vertices, _index0, _index1, _index2) {
            this.indices = [];
            this.angles = [];
            this.indices = [_index0, _index1, _index2];
            this.vertices = _vertices;
            this.calculateNormals();
        }
        getPosition(_index) {
            return this.vertices.position(this.indices[_index]);
        }
        isInside(_point) {
            let diffs = [];
            for (let index of this.indices) {
                let diff = FudgeCore.Vector3.DIFFERENCE(this.vertices.position(index), _point);
                diffs.push(diff);
            }
            let n0 = FudgeCore.Vector3.CROSS(diffs[1], diffs[0]);
            let n1 = FudgeCore.Vector3.CROSS(diffs[2], diffs[1]);
            let n2 = FudgeCore.Vector3.CROSS(diffs[0], diffs[2]);
            let dot1 = FudgeCore.Vector3.DOT(n0, n1);
            let dot2 = FudgeCore.Vector3.DOT(n0, n2);
            return !(dot1 < 0 || dot2 < 0);
        }
        calculateNormals() {
            let trigon = this.indices.map((_index) => this.vertices.position(_index));
            let v1 = FudgeCore.Vector3.DIFFERENCE(trigon[1], trigon[0]);
            let v2 = FudgeCore.Vector3.DIFFERENCE(trigon[2], trigon[0]);
            this.normalUnscaled = FudgeCore.Vector3.CROSS(v1, v2);
            this.normal = FudgeCore.Vector3.NORMALIZATION(this.normalUnscaled);
            this.angles.push(FudgeCore.Vector3.ANGLE(v1, v2), FudgeCore.Vector3.ANGLE(FudgeCore.Vector3.DIFFERENCE(trigon[2], trigon[1]), FudgeCore.Vector3.DIFFERENCE(trigon[0], trigon[1])), FudgeCore.Vector3.ANGLE(FudgeCore.Vector3.DIFFERENCE(trigon[0], trigon[2]), FudgeCore.Vector3.DIFFERENCE(trigon[1], trigon[2])));
        }
    }
    FudgeCore.Face = Face;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshCube extends FudgeCore.Mesh {
        static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshCube); }
        constructor(_name = "MeshCube") {
            super(_name);
            this.vertices = new FudgeCore.Vertices(new FudgeCore.Vertex(new FudgeCore.Vector3(-0.5, 0.5, 0.5), new FudgeCore.Vector2(0, 0)), new FudgeCore.Vertex(new FudgeCore.Vector3(-0.5, -0.5, 0.5), new FudgeCore.Vector2(0, 1)), new FudgeCore.Vertex(new FudgeCore.Vector3(0.5, -0.5, 0.5), new FudgeCore.Vector2(1, 1)), new FudgeCore.Vertex(new FudgeCore.Vector3(0.5, 0.5, 0.5), new FudgeCore.Vector2(1, 0)));
            for (let angle = 90; angle < 360; angle += 90) {
                let transform = FudgeCore.Matrix4x4.ROTATION(FudgeCore.Vector3.Y(angle));
                let side = this.vertices.slice(0, 4).map((_v) => new FudgeCore.Vertex(FudgeCore.Vector3.TRANSFORMATION(_v.position, transform), _v.uv));
                this.vertices.push(...side);
            }
            for (let angle = 90; angle < 360; angle += 180) {
                let transform = FudgeCore.Matrix4x4.ROTATION(FudgeCore.Vector3.X(angle));
                let side = this.vertices.slice(0, 4).map((_v) => new FudgeCore.Vertex(FudgeCore.Vector3.TRANSFORMATION(_v.position, transform), _v.uv));
                this.vertices.push(...side);
            }
            this.faces = [];
            for (let i = 0; i < 24; i += 4)
                this.faces.push(...new FudgeCore.Quad(this.vertices, i + 0, i + 1, i + 2, i + 3).faces);
        }
    }
    FudgeCore.MeshCube = MeshCube;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshPolygon extends FudgeCore.Mesh {
        static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshPolygon); }
        static {
            this.shapeDefault = [
                new FudgeCore.Vector2(-1, -1),
                new FudgeCore.Vector2(1, -1),
                new FudgeCore.Vector2(0, 1)
            ];
        }
        constructor(_name = "MeshPolygon", _shape = MeshPolygon.shapeDefault, _fitTexture = true) {
            super(_name);
            this.shape = new FudgeCore.MutableArray(FudgeCore.Vector2);
            this.create(_shape, _fitTexture);
        }
        get minVertices() {
            return 3;
        }
        create(_shape = [], _fitTexture = true) {
            this.shape = FudgeCore.MutableArray.from(_shape.map(_vertex => _vertex.clone));
            this.clear();
            this.fitTexture = _fitTexture;
            if (_shape.length < this.minVertices) {
                FudgeCore.Debug.warn(`At least ${this.minVertices} vertices needed to construct MeshPolygon, default trigon used`);
                this.create(MeshPolygon.shapeDefault, true);
                return;
            }
            let shape = _shape;
            let min = FudgeCore.Vector2.ZERO();
            let max = FudgeCore.Vector2.ZERO();
            this.vertices = new FudgeCore.Vertices();
            for (let vertex of shape) {
                this.vertices.push(new FudgeCore.Vertex(vertex.toVector3()));
                min.x = Math.min(min.x, vertex.x);
                max.x = Math.max(max.x, vertex.x);
                min.y = Math.min(min.y, vertex.y);
                max.y = Math.max(max.y, vertex.y);
            }
            let size = new FudgeCore.Vector2(max.x - min.x, max.y - min.y);
            if (this.fitTexture) {
                for (let i = 0; i < shape.length; i++) {
                    let textureUV = FudgeCore.Vector2.DIFFERENCE(shape[i], min);
                    this.vertices[i].uv = new FudgeCore.Vector2(textureUV.x / size.x, 1 - textureUV.y / size.y);
                }
            }
            else {
                _shape.forEach((_vertex, _i) => this.vertices[_i].uv = new FudgeCore.Vector2(_vertex.x, -_vertex.y));
            }
            this.faces = [];
            for (let i = 2; i < this.vertices.length; i++)
                this.faces.push(new FudgeCore.Face(this.vertices, i - 1, i, 0));
        }
        serialize() {
            let serialization = super.serialize();
            serialization.shape = FudgeCore.Serializer.serializeArray(FudgeCore.Vector2, this.shape);
            serialization.fitTexture = this.fitTexture;
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            let vectors = await FudgeCore.Serializer.deserializeArray(_serialization.shape);
            this.create(vectors, _serialization.fitTexture);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            await super.mutate(_mutator, _selection, _dispatchMutate);
            this.create(this.shape, this.fitTexture);
            this.dispatchEvent(new Event("mutate"));
        }
        reduceMutator(_mutator) {
            super.reduceMutator(_mutator);
        }
    }
    FudgeCore.MeshPolygon = MeshPolygon;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshExtrusion extends FudgeCore.MeshPolygon {
        static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshExtrusion); }
        static {
            this.mtxDefaults = [
                FudgeCore.Matrix4x4.TRANSLATION(FudgeCore.Vector3.Z(0.5)),
                FudgeCore.Matrix4x4.TRANSLATION(FudgeCore.Vector3.Z(-0.5))
            ];
        }
        constructor(_name = "MeshExtrusion", _vertices = FudgeCore.MeshPolygon.shapeDefault, _mtxTransforms = MeshExtrusion.mtxDefaults, _fitTexture = true) {
            super(_name, _vertices, _fitTexture);
            this.mtxTransforms = new FudgeCore.MutableArray(FudgeCore.Matrix4x4);
            this.extrude(_mtxTransforms);
        }
        serialize() {
            let serialization = super.serialize();
            serialization.transforms = FudgeCore.Serializer.serializeArray(FudgeCore.Matrix4x4, this.mtxTransforms);
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            let mtxTransforms;
            if (_serialization.transforms)
                mtxTransforms = await FudgeCore.Serializer.deserializeArray(_serialization.transforms);
            this.extrude(mtxTransforms);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            await super.mutate(_mutator, _selection, _dispatchMutate);
            this.extrude(this.mtxTransforms);
            this.dispatchEvent(new Event("mutate"));
        }
        reduceMutator(_mutator) {
            super.reduceMutator(_mutator);
        }
        extrude(_mtxTransforms = MeshExtrusion.mtxDefaults) {
            this.mtxTransforms = FudgeCore.MutableArray.from(_mtxTransforms);
            let nTransforms = _mtxTransforms.length;
            let nVerticesShape = this.vertices.length;
            let vertices = new FudgeCore.Vertices();
            let base = this.vertices.map((_v) => new FudgeCore.Vertex(FudgeCore.Vector3.TRANSFORMATION(_v.position, _mtxTransforms[0], true), _v.uv));
            vertices.push(...base);
            let lid = this.vertices.map((_v) => new FudgeCore.Vertex(FudgeCore.Vector3.TRANSFORMATION(_v.position, _mtxTransforms[nTransforms - 1], true), _v.uv));
            vertices.push(...lid);
            this.faces = this.faces.map((_face) => new FudgeCore.Face(vertices, _face.indices[0], _face.indices[1], _face.indices[2]));
            this.faces.push(...this.faces.map(_face => new FudgeCore.Face(vertices, _face.indices[2] + nVerticesShape, _face.indices[1] + nVerticesShape, _face.indices[0] + nVerticesShape)));
            for (let t = 0; t < nTransforms; t++) {
                let mtxTransform = _mtxTransforms[t];
                let referToClose = vertices.length;
                let wrap = this.vertices.map((_v, _i) => new FudgeCore.Vertex(FudgeCore.Vector3.TRANSFORMATION(_v.position, mtxTransform, true), new FudgeCore.Vector2(_i / nVerticesShape, t / nTransforms)));
                vertices.push(...wrap);
                vertices.push(new FudgeCore.Vertex(referToClose, new FudgeCore.Vector2(1, t / nTransforms)));
            }
            for (let t = 0; t < nTransforms - 1; t++)
                for (let i = 0; i < nVerticesShape; i++) {
                    let index = +2 * nVerticesShape
                        + t * (nVerticesShape + 1)
                        + i;
                    let quad = new FudgeCore.Quad(vertices, index, index + nVerticesShape + 1, index + nVerticesShape + 2, index + 1, FudgeCore.QUADSPLIT.AT_0);
                    this.faces.push(...quad.faces);
                }
            this.vertices = vertices;
            return;
        }
    }
    FudgeCore.MeshExtrusion = MeshExtrusion;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshFBX extends FudgeCore.mixinSerializableResourceExternal(FudgeCore.Mesh) {
        async load(_url = this.url, _iMesh = this.iMesh) {
            this.clear();
            this.url = _url;
            this.iMesh = _iMesh;
            const loader = await FudgeCore.FBXLoader.LOAD(this.url.toString());
            const geometryFBX = (loader.fbx.objects.geometries[_iMesh] ||
                loader.fbx.objects.geometries.find(_object => _object.name == this.name) ||
                loader.fbx.objects.models.find(_object => _object.name == this.name && _object.subtype == "Mesh").children[0]).load();
            if (geometryFBX)
                this.name = geometryFBX.name.length > 0 ? geometryFBX.name : geometryFBX.parents[0].name;
            let positions = [];
            let vertexBuffer = geometryFBX.Vertices;
            for (let iVertex = 0; iVertex < vertexBuffer.length; iVertex += 3) {
                positions.push(new FudgeCore.Vector3(vertexBuffer[iVertex + 0], vertexBuffer[iVertex + 1], vertexBuffer[iVertex + 2]));
            }
            let uvs = [];
            if (geometryFBX.LayerElementUV) {
                let uvBuffer = geometryFBX.LayerElementUV.UV;
                for (let iuv = 0; iuv < uvBuffer.length; iuv += 2) {
                    uvs.push(new FudgeCore.Vector2(uvBuffer[iuv], 1 - uvBuffer[iuv + 1]));
                }
            }
            let normals = [];
            if (geometryFBX.LayerElementNormal) {
                let normalBuffer = geometryFBX.LayerElementNormal.Normals;
                for (let iNormal = 0; iNormal < normalBuffer.length; iNormal += 3) {
                    normals.push(new FudgeCore.Vector3(normalBuffer[iNormal], normalBuffer[iNormal + 1], normalBuffer[iNormal + 2]));
                }
            }
            let mapVertexToIndex = new Map();
            let newVertexIndices = [];
            let iPolygon = 0;
            let isEndOfPolygon = false;
            let polygon = [];
            geometryFBX.PolygonVertexIndex.forEach((_iVertex, _iPolygonVertex) => {
                if (_iVertex < 0) {
                    _iVertex = _iVertex ^ -1;
                    isEndOfPolygon = true;
                }
                let position = positions[_iVertex];
                let uv = uvs[this.getDataIndex(geometryFBX.LayerElementUV, _iVertex, iPolygon, _iPolygonVertex)];
                let vertexKey = position.toString() + uv.toString();
                if (!mapVertexToIndex.has(vertexKey)) {
                    let normal = normals[this.getDataIndex(geometryFBX.LayerElementNormal, _iVertex, iPolygon, _iPolygonVertex)];
                    this.vertices.push(new FudgeCore.Vertex(position, uv, normal));
                    mapVertexToIndex.set(vertexKey, this.vertices.length - 1);
                    if (!newVertexIndices[_iVertex])
                        newVertexIndices[_iVertex] = [];
                    newVertexIndices[_iVertex].push(this.vertices.length - 1);
                }
                polygon.push(mapVertexToIndex.get(vertexKey));
                if (isEndOfPolygon) {
                    if (polygon.length == 3) {
                        this.faces.push(new FudgeCore.Face(this.vertices, polygon[0], polygon[1], polygon[2]));
                    }
                    else if (polygon.length == 4) {
                        let quad = new FudgeCore.Quad(this.vertices, polygon[0], polygon[1], polygon[2], polygon[3]);
                        this.faces.push(...quad.faces);
                    }
                    else {
                        for (let i = 2; i < polygon.length; i++)
                            this.faces.push(new FudgeCore.Face(this.vertices, polygon[0], polygon[i - 1], polygon[i - 0]));
                    }
                    polygon = [];
                    isEndOfPolygon = false;
                    iPolygon++;
                }
            });
            if (geometryFBX.children?.[0].type == "Deformer") {
                const fbxDeformer = geometryFBX.children[0];
                const skeleton = await loader.getSkeleton(fbxDeformer.children[0].children[0]);
                this.createBones(fbxDeformer, skeleton, this.vertices, newVertexIndices);
            }
            return this;
        }
        serialize() {
            const serialization = super.serialize();
            serialization.iMesh = this.iMesh;
            return serialization;
        }
        async deserialize(_serialization) {
            this.iMesh = _serialization.iMesh;
            return super.deserialize(_serialization);
        }
        getDataIndex(_layerElement, _iVertex, _iPolygon, _iPolygonVertex) {
            let index = _layerElement.MappingInformationType == "ByVertex" ?
                _iVertex :
                _layerElement.MappingInformationType == "ByPolygon" ?
                    _iPolygon :
                    _iPolygonVertex;
            if (_layerElement.ReferenceInformationType === 'IndexToDirect') {
                let indices = _layerElement.UVIndex || _layerElement.NormalsIndex;
                index = indices[index];
            }
            return index;
        }
        createBones(_deformerFBX, _skeleton, _vertices, _newVertexIndices) {
            for (const fbxSubDeformer of _deformerFBX.children) {
                fbxSubDeformer.load();
                if (fbxSubDeformer.Indexes)
                    for (let iBoneInfluence = 0; iBoneInfluence < fbxSubDeformer.Indexes.length; iBoneInfluence++) {
                        const iVertex = fbxSubDeformer.Indexes[iBoneInfluence];
                        for (const iVertexNew of _newVertexIndices ? _newVertexIndices[iVertex] : [iVertex]) {
                            (_vertices[iVertexNew].bones || (_vertices[iVertexNew].bones = [])).push({
                                index: _skeleton.indexOf(fbxSubDeformer.children[0].name),
                                weight: fbxSubDeformer.Weights[iBoneInfluence] || 1
                            });
                        }
                    }
            }
        }
    }
    FudgeCore.MeshFBX = MeshFBX;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshFromData extends FudgeCore.Mesh {
        constructor(_vertices, _textureUVs, _indices, _faceNormals) {
            super();
            this.verticesToSet = _vertices;
            this.textureUVsToSet = _textureUVs;
            this.indicesToSet = _indices;
            this.faceNormalsToSet = _faceNormals;
        }
        createVertices() {
            return this.verticesToSet;
        }
        createTextureUVs() {
            return this.textureUVsToSet;
        }
        createIndices() {
            return this.indicesToSet;
        }
        createFlatNormals() {
            return this.faceNormalsToSet;
        }
    }
    FudgeCore.MeshFromData = MeshFromData;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshGLTF extends FudgeCore.mixinSerializableResourceExternal(FudgeCore.Mesh) {
        async load(_url = this.url, _name = this.name, _iPrimitive = this.iPrimitive) {
            this.url = _url;
            this.name = _name;
            this.iPrimitive = _iPrimitive;
            return FudgeCore.GLTFLoader.loadResource(this);
        }
        serialize() {
            const serialization = super.serialize();
            serialization.iPrimitive = this.iPrimitive;
            return serialization;
        }
        deserialize(_serialization) {
            this.iPrimitive = _serialization.iPrimitive;
            return super.deserialize(_serialization);
        }
    }
    FudgeCore.MeshGLTF = MeshGLTF;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshOBJ extends FudgeCore.mixinSerializableResourceExternal(FudgeCore.Mesh) {
        async load(_url = this.url) {
            const url = new URL(_url.toString(), FudgeCore.Project.baseURL).toString();
            const data = await (await fetch(url)).text();
            this.name = url.split("/").pop();
            this.url = _url;
            const lines = data.split("\n");
            const indices = [];
            const positions = [];
            const uvs = [];
            const normals = [];
            const norms = [];
            const vertices = new FudgeCore.Vertices();
            const faces = [];
            const mapPositionUVNormalToIndex = {};
            const mapPositionNormalToIndex = {};
            for (let line of lines) {
                const parts = line.trim().split(" ");
                switch (parts.shift()) {
                    case "v":
                        positions.push(new FudgeCore.Vector3(...parts.map(_value => +_value)));
                        break;
                    case "vn":
                        normals.push(new FudgeCore.Vector3(...parts.map(_value => +_value)));
                        break;
                    case "vt":
                        uvs.push(new FudgeCore.Vector2(...parts.map((_value, _index) => +_value * (_index == 1 ? -1 : 1))));
                        break;
                    case "f":
                        for (let i = 0; i < 3; i++) {
                            let key = parts[i];
                            let index = mapPositionUVNormalToIndex[key];
                            if (index === undefined) {
                                index = vertices.length;
                                const vertexInfo = parts[i].split("/");
                                let position = positions[+vertexInfo[0] - 1];
                                let uv = uvs[+vertexInfo[1] - 1] ?? undefined;
                                let normal = normals[+vertexInfo[2] - 1] ?? undefined;
                                if (normal)
                                    norms.push(normal.x, normal.y, normal.z);
                                let keyPosNorm = `${vertexInfo[0]}/${vertexInfo[2]}`;
                                vertices.push(new FudgeCore.Vertex(mapPositionNormalToIndex[keyPosNorm] ?? position, uv, normal));
                                mapPositionUVNormalToIndex[key] = index;
                                if (mapPositionNormalToIndex[keyPosNorm] == undefined)
                                    mapPositionNormalToIndex[keyPosNorm] = index;
                            }
                            indices.push(index);
                        }
                        try {
                            faces.push(new FudgeCore.Face(vertices, indices[indices.length - 2], indices[indices.length - 1], indices[indices.length - 3]));
                        }
                        catch (_e) {
                            FudgeCore.Debug.fudge("Face excluded", _e.message);
                        }
                        break;
                }
            }
            this.clear();
            this.vertices = vertices;
            this.faces = faces;
            if (norms.length > 0)
                this.renderMesh.normals = new Float32Array(norms);
            return this;
        }
    }
    FudgeCore.MeshOBJ = MeshOBJ;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshPyramid extends FudgeCore.Mesh {
        static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshPyramid); }
        constructor(_name = "MeshPyramid") {
            super(_name);
            this.vertices = new FudgeCore.Vertices(new FudgeCore.Vertex(new FudgeCore.Vector3(-0.5, 0.0, 0.5), new FudgeCore.Vector2(0, 1)), new FudgeCore.Vertex(new FudgeCore.Vector3(0.5, 0.0, 0.5), new FudgeCore.Vector2(1, 1)), new FudgeCore.Vertex(new FudgeCore.Vector3(0.5, 0.0, -0.5), new FudgeCore.Vector2(1, 0)), new FudgeCore.Vertex(new FudgeCore.Vector3(-0.5, 0.0, -0.5), new FudgeCore.Vector2(0, 0)), new FudgeCore.Vertex(new FudgeCore.Vector3(0.0, 1.0, 0.0), new FudgeCore.Vector2(0.5, 0.5)), new FudgeCore.Vertex(0, new FudgeCore.Vector2(0, 0)), new FudgeCore.Vertex(1, new FudgeCore.Vector2(1, 0)), new FudgeCore.Vertex(2, new FudgeCore.Vector2(1, 1)), new FudgeCore.Vertex(3, new FudgeCore.Vector2(0, 1)));
            this.faces = [
                new FudgeCore.Face(this.vertices, 4, 0, 1),
                new FudgeCore.Face(this.vertices, 4, 1, 2),
                new FudgeCore.Face(this.vertices, 4, 2, 3),
                new FudgeCore.Face(this.vertices, 4, 3, 0),
                new FudgeCore.Face(this.vertices, 5 + 0, 5 + 2, 5 + 1),
                new FudgeCore.Face(this.vertices, 5 + 0, 5 + 3, 5 + 2)
            ];
        }
    }
    FudgeCore.MeshPyramid = MeshPyramid;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshQuad extends FudgeCore.MeshPolygon {
        static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshQuad); }
        static {
            this.shape = [
                new FudgeCore.Vector2(-0.5, 0.5), new FudgeCore.Vector2(-0.5, -0.5), new FudgeCore.Vector2(0.5, -0.5), new FudgeCore.Vector2(0.5, 0.5)
            ];
        }
        constructor(_name = "MeshQuad") {
            super(_name, MeshQuad.shape);
        }
        serialize() {
            let serialization = this.getMutator();
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            this.create(MeshQuad.shape, true);
            return this;
        }
        reduceMutator(_mutator) {
            super.reduceMutator(_mutator);
            delete _mutator.shape;
            delete _mutator.fitTexture;
        }
    }
    FudgeCore.MeshQuad = MeshQuad;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class TerrainInfo {
    }
    FudgeCore.TerrainInfo = TerrainInfo;
    class MeshTerrain extends FudgeCore.Mesh {
        static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshTerrain); }
        constructor(_name = "MeshTerrain", _resolution = FudgeCore.Vector2.ONE(2), _scaleInput = FudgeCore.Vector2.ONE(), _functionOrSeed = 0) {
            super(_name);
            this.heightMapFunction = null;
            this.create(_resolution, _scaleInput, _functionOrSeed);
        }
        create(_resolution = FudgeCore.Vector2.ONE(2), _scaleInput = FudgeCore.Vector2.ONE(), _functionOrSeed = 0) {
            this.clear();
            this.seed = undefined;
            this.resolution = new FudgeCore.Vector2(Math.round(_resolution.x), Math.round(_resolution.y));
            this.scale = _scaleInput.clone;
            if (_functionOrSeed instanceof Function)
                this.heightMapFunction = _functionOrSeed;
            else if (typeof (_functionOrSeed) == "number") {
                this.seed = _functionOrSeed;
                let prng = new FudgeCore.Random(this.seed);
                this.heightMapFunction = new FudgeCore.Noise2(() => prng.getNorm()).sample;
            }
            else
                this.heightMapFunction = new FudgeCore.Noise2().sample;
            this.vertices = new FudgeCore.Vertices();
            for (let z = 0; z <= this.resolution.y; z++) {
                for (let x = 0; x <= this.resolution.x; x++) {
                    let xNorm = x / this.resolution.x;
                    let zNorm = z / this.resolution.y;
                    this.vertices.push(new FudgeCore.Vertex(new FudgeCore.Vector3(xNorm - 0.5, this.heightMapFunction(xNorm * this.scale.x, zNorm * this.scale.y), zNorm - 0.5), new FudgeCore.Vector2(xNorm, zNorm)));
                }
            }
            let quads = [];
            let split = FudgeCore.QUADSPLIT.AT_0;
            for (let z = 0; z < this.resolution.y; z++) {
                for (let x = 0; x < this.resolution.x; x++) {
                    quads.push(new FudgeCore.Quad(this.vertices, (x + 0) + (z + 0) * (this.resolution.x + 1), (x + 0) + (z + 1) * (this.resolution.x + 1), (x + 1) + (z + 1) * (this.resolution.x + 1), (x + 1) + (z + 0) * (this.resolution.x + 1), split));
                    split = (split == FudgeCore.QUADSPLIT.AT_0) ? FudgeCore.QUADSPLIT.AT_1 : FudgeCore.QUADSPLIT.AT_0;
                }
                if (this.resolution.x % 2 == 0)
                    split = (split == FudgeCore.QUADSPLIT.AT_0) ? FudgeCore.QUADSPLIT.AT_1 : FudgeCore.QUADSPLIT.AT_0;
            }
            this.faces = quads.flatMap((_quad) => _quad.faces);
        }
        getTerrainInfo(_position, _mtxWorld = FudgeCore.Matrix4x4.IDENTITY(), _mtxInverse) {
            if (!_mtxInverse)
                _mtxInverse = FudgeCore.Matrix4x4.INVERSE(_mtxWorld);
            let terrainInfo = new TerrainInfo;
            let posLocal = FudgeCore.Vector3.TRANSFORMATION(_position, _mtxInverse, true);
            let z = Math.floor((posLocal.z + 0.5) * this.resolution.y);
            let x = Math.floor((posLocal.x + 0.5) * this.resolution.x);
            if (z < 0 || z > this.resolution.y - 1 || x < 0 || x > this.resolution.x - 1)
                return null;
            let index = (z * this.resolution.x + x) * 2;
            let face = this.faces[index];
            let ray = new FudgeCore.Ray(FudgeCore.Vector3.Y(), posLocal);
            let point = ray.intersectFacePlane(face);
            if (!face.isInside(point)) {
                index++;
                face = this.faces[index];
                point = ray.intersectFacePlane(face);
            }
            terrainInfo.index = index;
            terrainInfo.positionFace = point;
            terrainInfo.position = FudgeCore.Vector3.TRANSFORMATION(point, _mtxWorld, true);
            terrainInfo.normal = FudgeCore.Vector3.TRANSFORMATION(face.normal, FudgeCore.Matrix4x4.TRANSPOSE(_mtxInverse), false);
            terrainInfo.distance = _position.y - terrainInfo.position.y;
            terrainInfo.grid = this.getGridFromFaceIndex(index);
            return terrainInfo;
        }
        getGridFromFaceIndex(_index) {
            let result = FudgeCore.Recycler.get(FudgeCore.Vector2);
            let iQuad = Math.floor(_index / 2);
            result.set(iQuad % this.resolution.y, Math.floor(iQuad / this.resolution.x));
            return result;
        }
        getFaceIndicesFromGrid(_grid) {
            let iQuad = _grid.y * 2 * this.resolution.x + _grid.x * 2;
            return [iQuad, iQuad + 1];
        }
        serialize() {
            let serialization = super.serialize();
            serialization.seed = this.seed;
            serialization.scale = this.scale.serialize();
            serialization.resolution = this.resolution.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            await this.resolution.deserialize(_serialization.resolution);
            await this.scale.deserialize(_serialization.scale);
            this.seed = _serialization.seed;
            this.create(this.resolution, this.scale, this.seed);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            super.mutate(_mutator, _selection, _dispatchMutate);
            this.create(this.resolution, this.scale, this.seed);
        }
    }
    FudgeCore.MeshTerrain = MeshTerrain;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let MeshRelief = (() => {
        let _classDecorators = [FudgeCore.enumerate];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.MeshTerrain;
        let _instanceExtraInitializers = [];
        let _get_texture_decorators;
        var MeshRelief = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _get_texture_decorators = [FudgeCore.enumerate, FudgeCore.type(FudgeCore.TextureImage)];
                __esDecorate(this, null, _get_texture_decorators, { kind: "getter", name: "texture", static: false, private: false, access: { has: obj => "texture" in obj, get: obj => obj.texture }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                MeshRelief = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshRelief); }
            #texture = __runInitializers(this, _instanceExtraInitializers);
            constructor(_name = "MeshRelief", _texture) {
                super(_name, FudgeCore.Vector2.ONE(2), undefined, (_x, _z) => 0);
                this.texture = _texture;
            }
            static createHeightMapFunction(_texture) {
                let array = MeshRelief.textureToClampedArray(_texture);
                let heightMapFunction = (_x, _z) => {
                    let pixel = Math.round(_z * _texture.image.width + _x);
                    return array[pixel * 4] / 255;
                };
                return heightMapFunction;
            }
            static textureToClampedArray(_texture) {
                let canvas = document.createElement("canvas");
                canvas.width = _texture.image.width;
                canvas.height = _texture.image.height;
                let crc = canvas.getContext("2d");
                crc.imageSmoothingEnabled = false;
                crc.drawImage(_texture.image, 0, 0);
                return crc.getImageData(0, 0, _texture.image.width, _texture.image.height).data;
            }
            get texture() {
                return this.#texture;
            }
            set texture(_texture) {
                this.#texture = _texture;
                if (!_texture)
                    return;
                let resolution = _texture ? new FudgeCore.Vector2(_texture.image.width - 1, _texture.image.height - 1) : undefined;
                super.create(resolution, resolution, MeshRelief.createHeightMapFunction(_texture));
            }
            serialize() {
                let serialization = super.serialize();
                delete serialization.seed;
                delete serialization.scale;
                delete serialization.resolution;
                if (this.#texture)
                    serialization.idTexture = this.texture.idResource;
                return serialization;
            }
            async deserialize(_serialization) {
                await super.deserialize(_serialization);
                if (_serialization.idTexture)
                    this.texture = await FudgeCore.Project.getResource(_serialization.idTexture);
                return this;
            }
            reduceMutator(_mutator) {
                super.reduceMutator(_mutator);
                delete _mutator.seed;
                delete _mutator.scale;
                delete _mutator.resolution;
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return MeshRelief = _classThis;
    })();
    FudgeCore.MeshRelief = MeshRelief;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshRotation extends FudgeCore.Mesh {
        static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshRotation); }
        static {
            this.verticesDefault = [
                new FudgeCore.Vector2(0.5, 0.5),
                new FudgeCore.Vector2(0.5, -0.5)
            ];
        }
        constructor(_name = "MeshRotation", _shape = MeshRotation.verticesDefault, _longitudes = 3) {
            super(_name);
            this.shape = new FudgeCore.MutableArray(FudgeCore.Vector2);
            this.rotate(_shape, _longitudes);
        }
        get minVertices() {
            return 2;
        }
        serialize() {
            let serialization = super.serialize();
            serialization.shape = FudgeCore.Serializer.serializeArray(FudgeCore.Vector2, this.shape);
            serialization.longitudes = this.longitudes;
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            let shape = await FudgeCore.Serializer.deserializeArray(_serialization.shape);
            this.longitudes = _serialization.longitudes;
            this.rotate(shape, this.longitudes);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            await super.mutate(_mutator, _selection, _dispatchMutate);
            this.rotate(this.shape, this.longitudes);
            this.dispatchEvent(new Event("mutate"));
        }
        rotate(_shape, _longitudes) {
            this.clear();
            this.shape = FudgeCore.MutableArray.from(_shape.map(_vertex => _vertex.clone));
            this.longitudes = Math.round(_longitudes);
            let angle = 360 / this.longitudes;
            let mtxRotate = FudgeCore.Matrix4x4.ROTATION_Y(angle);
            let polygon = [];
            let distances = [0];
            let total = 0;
            for (let i = 0; i < this.shape.length; i++) {
                polygon.push(this.shape[i].toVector3());
                if (i > 0) {
                    let distance = FudgeCore.Vector2.DIFFERENCE(this.shape[i], this.shape[i - 1]).magnitude;
                    total += distance;
                    distances.push(total);
                }
            }
            distances.forEach((_entry, _index) => { distances[_index] = _entry / total; });
            let nVerticesPolygon = polygon.length;
            let cloud = new FudgeCore.Vertices();
            for (let longitude = 0; longitude <= this.longitudes; longitude++) {
                for (let i = 0; i < nVerticesPolygon; i++) {
                    let uv = new FudgeCore.Vector2(longitude / this.longitudes, distances[i]);
                    if (longitude == this.longitudes)
                        cloud.push(new FudgeCore.Vertex(i, uv));
                    else {
                        if (longitude > 0 && this.shape[i].x == 0)
                            cloud.push(new FudgeCore.Vertex(i, uv));
                        else
                            cloud.push(new FudgeCore.Vertex(polygon[i].clone, uv));
                    }
                }
                polygon.forEach((_vector) => _vector.transform(mtxRotate));
            }
            let faces = [];
            for (let longitude = 0; longitude < this.longitudes; longitude++) {
                for (let latitude = 0; latitude < nVerticesPolygon - 1; latitude++) {
                    let start = longitude * nVerticesPolygon + latitude;
                    let quad = new FudgeCore.Quad(cloud, start + 1, start + 1 + nVerticesPolygon, start + nVerticesPolygon, start);
                    faces.push(...quad.faces);
                }
            }
            this.vertices = cloud;
            this.faces = faces;
        }
    }
    FudgeCore.MeshRotation = MeshRotation;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshSphere extends FudgeCore.MeshRotation {
        static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshSphere); }
        constructor(_name = "MeshSphere", _longitudes = 8, _latitudes = 8) {
            super(_name);
            this.create(_longitudes, _latitudes);
        }
        create(_longitudes = 3, _latitudes = 2) {
            this.clear();
            this.longitudes = Math.min(Math.round(_longitudes), 128);
            this.latitudes = Math.min(Math.round(_latitudes), 128);
            if (_longitudes < 3 || _latitudes < 2) {
                FudgeCore.Debug.warn("UV Sphere must have at least 3 longitudes and 2 latitudes to form a 3-dimensional shape.");
                this.longitudes = Math.max(3, _longitudes);
                this.latitudes = Math.max(2, _latitudes);
            }
            let shape = [];
            let step = Math.PI / this.latitudes;
            for (let i = 0; i <= this.latitudes; ++i) {
                let angle = Math.PI / 2 - i * step;
                let x = Math.cos(angle);
                let y = Math.sin(angle);
                shape.push(new FudgeCore.Vector2(x / 2, y / 2));
            }
            shape[0].x = 0;
            shape[shape.length - 1].x = 0;
            super.rotate(shape, _longitudes);
        }
        serialize() {
            let serialization = super.serialize();
            delete serialization.shape;
            serialization.latitudes = this.latitudes;
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            this.create(_serialization.longitudes, _serialization.latitudes);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            super.mutate(_mutator, _selection, _dispatchMutate);
            this.create(this.longitudes, this.latitudes);
        }
        reduceMutator(_mutator) {
            super.reduceMutator(_mutator);
            delete _mutator.shape;
        }
    }
    FudgeCore.MeshSphere = MeshSphere;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshSprite extends FudgeCore.Mesh {
        static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshSprite); }
        constructor(_name = "MeshSprite") {
            super(_name);
            this.vertices = new FudgeCore.Vertices(new FudgeCore.Vertex(new FudgeCore.Vector3(-0.5, 0.5, 0), new FudgeCore.Vector2(0, 0)), new FudgeCore.Vertex(new FudgeCore.Vector3(-0.5, -0.5, 0), new FudgeCore.Vector2(0, 1)), new FudgeCore.Vertex(new FudgeCore.Vector3(0.5, -0.5, 0), new FudgeCore.Vector2(1, 1)), new FudgeCore.Vertex(new FudgeCore.Vector3(0.5, 0.5, 0), new FudgeCore.Vector2(1, 0)));
            this.faces = [
                new FudgeCore.Face(this.vertices, 1, 2, 0),
                new FudgeCore.Face(this.vertices, 2, 3, 0),
                new FudgeCore.Face(this.vertices, 0, 3, 1),
                new FudgeCore.Face(this.vertices, 3, 2, 1)
            ];
        }
        get verticesFlat() { return this.renderMesh.positions; }
        get indicesFlat() { return this.renderMesh.indices; }
    }
    FudgeCore.MeshSprite = MeshSprite;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MeshTorus extends FudgeCore.MeshRotation {
        static { this.iSubclass = FudgeCore.Mesh.registerSubclass(MeshTorus); }
        constructor(_name = "MeshTorus", _radiusRing = 0.5 - 0.125, _radiusTube = 0.125, _longitudes = 8, _latitudes = 6) {
            super(_name, MeshTorus.getShape(_radiusRing, _radiusTube, Math.max(3, _latitudes)), _longitudes);
            this.latitudes = 12;
            this.radiusRing = 0.5 - 0.125;
            this.radiusTube = 0.125;
            this.radiusTube = _radiusTube;
            this.radiusRing = _radiusRing;
            this.longitudes = _longitudes;
            this.latitudes = Math.max(3, _latitudes);
        }
        static getShape(_radiusRing, _radiusTube, _latitudes) {
            let shape = [];
            let center = new FudgeCore.Vector2(_radiusRing, 0);
            for (let latitude = 0; latitude <= _latitudes; latitude++) {
                let angle = 2 * Math.PI * latitude / _latitudes;
                shape.push(FudgeCore.Vector2.SUM(center, new FudgeCore.Vector2(_radiusTube * -Math.cos(angle), _radiusTube * Math.sin(angle))));
            }
            return shape;
        }
        create(_radiusRing = 0.5 - 0.125, _radiusTube = 0.125, _longitudes = 8, _latitudes = 6) {
            this.radiusTube = _radiusTube;
            this.latitudes = Math.max(3, _latitudes);
            this.radiusRing = _radiusRing;
            super.rotate(MeshTorus.getShape(_radiusRing, _radiusTube, _latitudes), _longitudes);
        }
        serialize() {
            let serialization = super.serialize();
            serialization.latitudes = this.latitudes;
            serialization.radiusRing = this.radiusRing;
            serialization.radiusTube = this.radiusTube;
            return serialization;
        }
        async deserialize(_serialization) {
            await super.deserialize(_serialization);
            this.create(_serialization.radiusRing, _serialization.radiusTube, _serialization.longitudes, _serialization.latitudes);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            super.mutate(_mutator, _selection, _dispatchMutate);
            this.create(this.radiusRing, this.radiusTube, this.longitudes, this.latitudes);
        }
        reduceMutator(_mutator) {
            super.reduceMutator(_mutator);
            delete _mutator.shape;
        }
    }
    FudgeCore.MeshTorus = MeshTorus;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let QUADSPLIT;
    (function (QUADSPLIT) {
        QUADSPLIT[QUADSPLIT["PLANAR"] = 0] = "PLANAR";
        QUADSPLIT[QUADSPLIT["AT_0"] = 1] = "AT_0";
        QUADSPLIT[QUADSPLIT["AT_1"] = 2] = "AT_1";
    })(QUADSPLIT = FudgeCore.QUADSPLIT || (FudgeCore.QUADSPLIT = {}));
    class Quad {
        #split;
        constructor(_vertices, _index0, _index1, _index2, _index3, _split = QUADSPLIT.PLANAR) {
            this.faces = [];
            this.#split = _split;
            try {
                if (_split != QUADSPLIT.AT_1)
                    this.faces.push(new FudgeCore.Face(_vertices, _index0, _index1, _index2));
                else
                    this.faces.push(new FudgeCore.Face(_vertices, _index1, _index2, _index3));
            }
            catch (_e) {
                FudgeCore.Debug.fudge("Face excluded", _e.message);
            }
            try {
                if (_split == QUADSPLIT.PLANAR)
                    this.faces.push(new FudgeCore.Face(_vertices, _index3, _index0, _index2));
                else if (_split == QUADSPLIT.AT_0)
                    this.faces.push(new FudgeCore.Face(_vertices, _index0, _index2, _index3));
                else
                    this.faces.push(new FudgeCore.Face(_vertices, _index1, _index3, _index0));
            }
            catch (_e) {
                FudgeCore.Debug.fudge("Face excluded", _e.message);
            }
        }
        get split() {
            return this.#split;
        }
    }
    FudgeCore.Quad = Quad;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Vertex {
        constructor(_positionOrIndex, _uv = null, _normal = FudgeCore.Vector3.ZERO(), _tangent = null, _color = null, _bones = null) {
            if (_positionOrIndex instanceof FudgeCore.Vector3)
                this.position = _positionOrIndex;
            else
                this.referTo = _positionOrIndex;
            this.uv = _uv;
            this.normal = _normal;
            this.tangent = _tangent;
            this.color = _color;
            this.bones = _bones;
        }
    }
    FudgeCore.Vertex = Vertex;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Vertices extends Array {
        get originals() {
            return this.filter(_vertex => _vertex.referTo == undefined);
        }
        position(_index) {
            let vertex = this[_index];
            return (vertex.referTo == undefined) ? vertex.position : this[vertex.referTo].position;
        }
        normal(_index) {
            let vertex = this[_index];
            return (vertex.referTo == undefined) ? vertex.normal : this[vertex.referTo].normal;
        }
        tangent(_index) {
            return this[_index].tangent;
        }
        uv(_index) {
            return this[_index].uv;
        }
        color(_index) {
            return this[_index].color;
        }
        bones(_index) {
            let vertex = this[_index];
            return (vertex.referTo == undefined) ? vertex.bones : this[vertex.referTo].bones;
        }
    }
    FudgeCore.Vertices = Vertices;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let ShaderParticleSystem = (() => {
        var _a;
        let _classDecorators = [(_a = FudgeCore.RenderInjectorShaderParticleSystem).decorate.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var ShaderParticleSystem = class {
            static { _classThis = this; }
            constructor() {
                this.define = ["PARTICLE"];
            }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ShaderParticleSystem = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            getVertexShaderSource() { return ""; }
            getFragmentShaderSource() { return ""; }
            deleteProgram() { }
            useProgram() { }
            createProgram() { }
        };
        return ShaderParticleSystem = _classThis;
    })();
    FudgeCore.ShaderParticleSystem = ShaderParticleSystem;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ComponentWalker extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentWalker); }
        #walkData;
        #promiseResolverOnWalkFinished;
        #rotateInWalkDirection;
        constructor() {
            super();
            this.speed = 1;
            this.#walkData = { path: [], totalProgress: -1 };
            this.#rotateInWalkDirection = false;
            if (FudgeCore.Project.mode == FudgeCore.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd", this.#handleAttach.bind(this));
            this.addEventListener("componentRemove", this.#handleDetach.bind(this));
        }
        serialize() {
            let serialization = {
                [super.constructor.name]: super.serialize(),
                speed: this.speed
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.speed = _serialization.speed;
            await super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        async moveTo(_start, _end, _rotate = false) {
            if (!_start)
                return;
            let translate = FudgeCore.Vector3.DIFFERENCE(_start.mtxWorld.translation, this.node.mtxWorld.translation);
            this.node.mtxLocal.translate(translate);
            if (!_end || _start === _end) {
                this.#walkData = { path: [], totalProgress: -1 };
                return;
            }
            this.#rotateInWalkDirection = _rotate;
            return new Promise((_resolve, _reject) => {
                let path = this.getPath(_start, _end);
                if (!path || path.length === 0) {
                    _reject();
                    return;
                }
                this.#walkData = { path, totalProgress: 0 };
                this.#promiseResolverOnWalkFinished = _resolve;
                if (this.#rotateInWalkDirection && this.#walkData.path.length >= 1) {
                    this.rotateTowards(this.#walkData.path[0].waypoint);
                }
            });
        }
        moving() {
            if (this.#walkData.totalProgress < 0 || this.#walkData.path.length == 0)
                return;
            let currentPath = this.#walkData.path[this.#walkData.totalProgress];
            if (!currentPath)
                return;
            let delta = this.speed * currentPath.previousConnection.speedModifier * FudgeCore.Loop.timeFrameGame / 1000;
            let step = FudgeCore.Vector3.DIFFERENCE(currentPath.waypoint.mtxWorld.translation, this.node.mtxWorld.translation);
            let scale = FudgeCore.Vector3.DIFFERENCE(currentPath.waypoint.mtxWorld.scaling, this.node.mtxWorld.scaling);
            if (delta * delta < step.magnitudeSquared) {
                step.normalize(delta);
                this.node.mtxLocal.translate(step, false);
                if (scale.magnitudeSquared > 0) {
                    scale.normalize(delta);
                }
                this.node.mtxLocal.scaling = FudgeCore.Vector3.SUM(scale, this.node.mtxLocal.scaling);
                return;
            }
            this.dispatchEvent(new CustomEvent("waypointReached", { bubbles: true, detail: currentPath.waypoint }));
            currentPath.waypoint.dispatchEvent(new CustomEvent("waypointReached", { bubbles: true, detail: this }));
            let translate = FudgeCore.Vector3.DIFFERENCE(currentPath.waypoint.mtxWorld.translation, this.node.mtxWorld.translation);
            this.node.mtxLocal.translate(translate, false);
            this.node.mtxLocal.scaling = currentPath.waypoint.mtxWorld.scaling;
            this.#walkData.totalProgress++;
            if (this.#walkData.totalProgress >= this.#walkData.path.length) {
                if (this.#promiseResolverOnWalkFinished)
                    this.#promiseResolverOnWalkFinished();
                this.dispatchEvent(new CustomEvent("pathingConcluded", { bubbles: true, detail: currentPath.waypoint }));
                return;
            }
            if (this.#rotateInWalkDirection) {
                this.rotateTowards(this.#walkData.path[this.#walkData.totalProgress].waypoint);
            }
        }
        getPath(_start, _end) {
            let unvisitedNodes = [];
            let processedWaypoints = [_start];
            let waypointsToSearchThrough = [_start];
            do {
                let waypoint = waypointsToSearchThrough.pop();
                for (let connection of waypoint.connections) {
                    if (!processedWaypoints.includes(connection.end) && connection.start.isActive && connection.end.isActive) {
                        waypointsToSearchThrough.push(connection.end);
                        processedWaypoints.push(connection.end);
                    }
                }
                unvisitedNodes.push({ waypoint, distance: waypoint === _start ? 0 : Infinity, previous: null, previousConnection: null });
            } while (waypointsToSearchThrough.length > 0);
            while (unvisitedNodes.length > 0) {
                unvisitedNodes.sort((_a, _b) => _a.distance - _b.distance);
                let currentNode = unvisitedNodes.shift();
                if (currentNode.waypoint === _end)
                    return this.pathingNodeToPath(currentNode);
                for (let con of currentNode.waypoint.connections) {
                    if (!this.isConnectionUsable(con))
                        continue;
                    let endNode = unvisitedNodes.find(_n => _n.waypoint === con.end);
                    if (!endNode)
                        continue;
                    let newDistance = currentNode.distance + this.calculateConnectionCost(con);
                    if (newDistance >= endNode.distance)
                        continue;
                    endNode.distance = newDistance;
                    endNode.previous = currentNode;
                    endNode.previousConnection = con;
                }
            }
            return null;
        }
        isConnectionUsable(_connection) {
            return true;
        }
        calculateConnectionCost(_connection) {
            if (_connection.cost >= 0)
                return _connection.cost;
            return 0;
        }
        pathingNodeToPath(_node) {
            let path = [];
            if (!_node)
                return path;
            do {
                path.push(_node);
                _node = _node.previous;
            } while (_node?.previous);
            return path.reverse();
        }
        rotateTowards(_waypoint) {
            let mtxLook = FudgeCore.Matrix4x4.LOOK_AT(this.node.mtxWorld.translation, _waypoint.mtxWorld.translation);
            this.node.mtxLocal.rotation = mtxLook.rotation;
        }
        #handleAttach() {
            FudgeCore.Loop.addEventListener("loopFrame", this.moving.bind(this));
        }
        #handleDetach() {
            FudgeCore.Loop.removeEventListener("loopFrame", this.moving.bind(this));
        }
    }
    FudgeCore.ComponentWalker = ComponentWalker;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    var _a;
    class ComponentWaypoint extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(this); }
        static #waypoints = [];
        #connections;
        constructor(_mtxInit = FudgeCore.Matrix4x4.IDENTITY(), _connections = []) {
            super();
            this.#connections = _connections;
            this.mtxLocal = _mtxInit;
            this.singleton = false;
            if (FudgeCore.Project.mode == FudgeCore.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd", this.#handleAttach.bind(this));
            this.addEventListener("componentRemove", this.#handleDetach.bind(this));
        }
        static get waypoints() {
            return _a.#waypoints;
        }
        static addConnection(_start, _end, _cost, _speedModifier = 1, _bothWays = false) {
            _start.addConnection({ cost: _cost, end: _end, start: _start, speedModifier: _speedModifier });
            if (_bothWays)
                _end.addConnection({ cost: _cost, end: _start, start: _end, speedModifier: _speedModifier });
        }
        get isActive() {
            return this.active;
        }
        get connections() {
            return this.#connections;
        }
        get mtxWorld() {
            return FudgeCore.Matrix4x4.PRODUCT(this.mtxLocal, this.node.mtxWorld);
        }
        addConnection(_connection) {
            this.#connections.push(_connection);
        }
        removeConnection(_connection) {
            let index = this.#connections.indexOf(_connection);
            if (index < 0)
                return;
            this.#connections.splice(index, 1);
        }
        serialize() {
            let serialization = {
                [super.constructor.name]: super.serialize(),
                matrix: this.mtxLocal.serialize(),
                connections: this.#connections.map(_con => {
                    let connection = { cost: _con.cost, end: _con.end, speedModifier: _con.speedModifier };
                    if (connection.end instanceof _a) {
                        connection.end = FudgeCore.Node.PATH_FROM_TO(this, connection.end);
                    }
                    return connection;
                })
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.mtxLocal.deserialize(_serialization.matrix);
            const hndNodeDeserialized = () => {
                this.#connections = _serialization.connections.map((_con) => {
                    let connection = { cost: _con.cost, end: this.serializedWaypointToWaypoint(_con.end), speedModifier: _con.speedModifier, start: this };
                    return connection;
                });
                this.removeEventListener("nodeDeserialized", hndNodeDeserialized);
            };
            this.addEventListener("nodeDeserialized", hndNodeDeserialized);
            await super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        drawGizmos() {
            let scaleVector = FudgeCore.Vector3.SCALE(FudgeCore.Vector3.ONE(), 0.1);
            let mtx = this.mtxWorld;
            FudgeCore.Gizmos.drawSphere(FudgeCore.Matrix4x4.COMPOSITION(mtx.translation, FudgeCore.Vector3.ZERO(), scaleVector), FudgeCore.Color.CSS("orange"));
            let lines = [];
            for (let connection of this.connections) {
                let tmpMtx = connection.end.mtxWorld.clone;
                let directionVector = FudgeCore.Vector3.DIFFERENCE(mtx.translation, tmpMtx.translation);
                if (directionVector.magnitudeSquared === 0)
                    continue;
                directionVector.normalize();
                if (!connection.end.isActive || !connection.start.isActive)
                    continue;
                lines.push(mtx.translation);
                lines.push(tmpMtx.translation);
                let directionMtx = FudgeCore.Matrix4x4.LOOK_IN(directionVector, undefined, false, tmpMtx.translation);
                directionMtx.scale(scaleVector);
                FudgeCore.Gizmos.drawWireCone(directionMtx, FudgeCore.Color.CSS("orange"));
            }
            FudgeCore.Gizmos.drawLines(lines, FudgeCore.Matrix4x4.IDENTITY(), FudgeCore.Color.CSS("orange"));
        }
        serializedWaypointToWaypoint(_point) {
            if (typeof _point !== "string")
                return _point;
            return FudgeCore.Node.FIND(this, _point);
        }
        #handleAttach() {
            _a.#waypoints.push(this);
        }
        #handleDetach() {
            let index = _a.#waypoints.indexOf(this);
            if (index >= 0) {
                _a.#waypoints.splice(index, 1);
            }
        }
    }
    _a = ComponentWaypoint;
    FudgeCore.ComponentWaypoint = ComponentWaypoint;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let BODY_INIT;
    (function (BODY_INIT) {
        BODY_INIT[BODY_INIT["TO_MESH"] = 0] = "TO_MESH";
        BODY_INIT[BODY_INIT["TO_NODE"] = 1] = "TO_NODE";
        BODY_INIT[BODY_INIT["TO_PIVOT"] = 2] = "TO_PIVOT";
    })(BODY_INIT = FudgeCore.BODY_INIT || (FudgeCore.BODY_INIT = {}));
    class ComponentRigidbody extends FudgeCore.Component {
        static { this.iSubclass = FudgeCore.Component.registerSubclass(ComponentRigidbody); }
        static {
            this.mapBodyType = (typeof OIMO == "undefined") ?
                {
                    [FudgeCore.BODY_TYPE.DYNAMIC]: FudgeCore.BODY_TYPE.DYNAMIC, [FudgeCore.BODY_TYPE.STATIC]: FudgeCore.BODY_TYPE.STATIC, [FudgeCore.BODY_TYPE.KINEMATIC]: FudgeCore.BODY_TYPE.KINEMATIC
                } : {
                [FudgeCore.BODY_TYPE.DYNAMIC]: OIMO.RigidBodyType.DYNAMIC, [FudgeCore.BODY_TYPE.STATIC]: OIMO.RigidBodyType.STATIC, [FudgeCore.BODY_TYPE.KINEMATIC]: OIMO.RigidBodyType.KINEMATIC
            };
        }
        #id;
        #collider;
        #colliderInfo;
        #collisionGroup;
        #typeCollider;
        #rigidbody;
        #rigidbodyInfo;
        #typeBody;
        #massData;
        #restitution;
        #friction;
        #dampingLinear;
        #dampingAngular;
        #effectRotation;
        #effectGravity;
        #isTrigger;
        #mtxPivotUnscaled;
        #mtxPivotInverse;
        #callbacks;
        constructor(_mass = 1, _type = FudgeCore.BODY_TYPE.DYNAMIC, _colliderType = FudgeCore.COLLIDER_TYPE.CUBE, _group = FudgeCore.Physics.settings.defaultCollisionGroup, _mtxTransform = null, _convexMesh = null) {
            super();
            this.mtxPivot = FudgeCore.Matrix4x4.IDENTITY();
            this.convexMesh = null;
            this.collisions = new Array();
            this.triggerings = new Array();
            this.initialization = BODY_INIT.TO_PIVOT;
            this.isInitialized = false;
            this.#id = 0;
            this.#collisionGroup = FudgeCore.COLLISION_GROUP.DEFAULT;
            this.#typeCollider = FudgeCore.COLLIDER_TYPE.CUBE;
            this.#rigidbodyInfo = new OIMO.RigidBodyConfig();
            this.#typeBody = FudgeCore.BODY_TYPE.DYNAMIC;
            this.#massData = new OIMO.MassData();
            this.#dampingLinear = 0.1;
            this.#dampingAngular = 0.1;
            this.#effectRotation = FudgeCore.Vector3.ONE();
            this.#effectGravity = 1;
            this.#isTrigger = false;
            this.#mtxPivotUnscaled = FudgeCore.Matrix4x4.IDENTITY();
            this.#mtxPivotInverse = FudgeCore.Matrix4x4.IDENTITY();
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd":
                        this.addEventListener("componentDeactivate", this.removeRigidbodyFromWorld);
                        this.node.addEventListener("nodeDeactivate", this.hndNodeDeactivate, true);
                        if (!this.node.cmpTransform)
                            FudgeCore.Debug.warn("ComponentRigidbody attached to node missing ComponentTransform", this.node);
                        break;
                    case "componentRemove":
                        this.removeEventListener("componentRemove", this.removeRigidbodyFromWorld);
                        this.node.removeEventListener("nodeDeactivate", this.hndNodeDeactivate, true);
                        this.removeRigidbodyFromWorld();
                        break;
                    case "nodeDeserialized":
                        if (!this.node.cmpTransform)
                            FudgeCore.Debug.error("ComponentRigidbody attached to node missing ComponentTransform", this.node);
                        break;
                }
            };
            this.addRigidbodyToWorld = () => {
                if (!this.#rigidbody._world)
                    FudgeCore.Physics.addRigidbody(this);
            };
            this.hndNodeDeactivate = (_event) => {
                let path = this.node.getPath();
                if (!path.includes(_event.target))
                    return;
                this.removeRigidbodyFromWorld();
            };
            this.removeRigidbodyFromWorld = () => {
                FudgeCore.Physics.removeRigidbody(this);
                this.isInitialized = false;
            };
            this.create(_mass, _type, _colliderType, _group, _mtxTransform, _convexMesh);
            this.addEventListener("componentAdd", this.hndEvent);
            this.addEventListener("componentRemove", this.hndEvent);
        }
        get id() {
            return this.#id;
        }
        get mtxPivotInverse() {
            return this.#mtxPivotInverse;
        }
        get mtxPivotUnscaled() {
            return this.#mtxPivotUnscaled;
        }
        get typeBody() {
            return this.#typeBody;
        }
        set typeBody(_value) {
            this.#typeBody = _value;
            this.#rigidbody.setType(ComponentRigidbody.mapBodyType[this.#typeBody]);
            this.#rigidbody.setMassData(this.#massData);
        }
        get typeCollider() {
            return this.#typeCollider;
        }
        set typeCollider(_value) {
            if (_value != this.#typeCollider && this.#rigidbody != null) {
                this.#typeCollider = _value;
                this.initialize();
            }
        }
        get collisionGroup() {
            return this.#collisionGroup;
        }
        set collisionGroup(_value) {
            this.#collisionGroup = _value;
            if (this.#rigidbody != null)
                this.#rigidbody.getShapeList().setCollisionGroup(this.#collisionGroup);
        }
        get isTrigger() {
            return this.#isTrigger;
        }
        set isTrigger(_value) {
            this.#isTrigger = _value;
            if (this.getOimoRigidbody() != null) {
                this.getOimoRigidbody()._isTrigger = this.#isTrigger;
            }
        }
        get mass() {
            return this.#rigidbody.getMass();
        }
        set mass(_value) {
            this.#massData.mass = _value;
            if (this.node != null)
                if (this.#rigidbody != null)
                    this.#rigidbody.setMassData(this.#massData);
        }
        get dampTranslation() {
            return this.#rigidbody.getLinearDamping();
        }
        set dampTranslation(_value) {
            this.#dampingLinear = _value;
            this.#rigidbody.setLinearDamping(_value);
        }
        get dampRotation() {
            return this.#rigidbody.getAngularDamping();
        }
        set dampRotation(_value) {
            this.#dampingAngular = _value;
            this.#rigidbody.setAngularDamping(_value);
        }
        get effectRotation() {
            return this.#effectRotation;
        }
        set effectRotation(_effect) {
            this.#effectRotation = _effect;
            this.#rigidbody.setRotationFactor(new OIMO.Vec3(this.#effectRotation.x, this.#effectRotation.y, this.#effectRotation.z));
        }
        get effectGravity() {
            return this.#effectGravity;
        }
        set effectGravity(_effect) {
            this.#effectGravity = _effect;
            if (this.#rigidbody != null)
                this.#rigidbody.setGravityScale(this.#effectGravity);
        }
        get friction() {
            return this.#friction;
        }
        set friction(_friction) {
            this.#friction = _friction;
            if (this.#rigidbody.getShapeList() != null)
                this.#rigidbody.getShapeList().setFriction(this.#friction);
        }
        get restitution() {
            return this.#restitution;
        }
        set restitution(_restitution) {
            this.#restitution = _restitution;
            if (this.#rigidbody.getShapeList() != null)
                this.#rigidbody.getShapeList().setRestitution(this.#restitution);
        }
        getOimoRigidbody() {
            return this.#rigidbody;
        }
        rotateBody(_rotationChange) {
            this.#rigidbody.rotateXyz(new OIMO.Vec3(_rotationChange.x * FudgeCore.Calc.deg2rad, _rotationChange.y * FudgeCore.Calc.deg2rad, _rotationChange.z * FudgeCore.Calc.deg2rad));
        }
        translateBody(_translationChange) {
            this.#rigidbody.translate(new OIMO.Vec3(_translationChange.x, _translationChange.y, _translationChange.z));
        }
        getPosition() {
            let tmpPos = this.#rigidbody.getPosition();
            return new FudgeCore.Vector3(tmpPos.x, tmpPos.y, tmpPos.z);
        }
        setPosition(_value) {
            this.#rigidbody.setPosition(new OIMO.Vec3(_value.x, _value.y, _value.z));
        }
        getRotation() {
            let orientation = this.#rigidbody.getOrientation();
            let tmpQuat = FudgeCore.Recycler.get(FudgeCore.Quaternion);
            tmpQuat.set(orientation.x, orientation.y, orientation.z, orientation.w);
            let eulerAngles = tmpQuat.eulerAngles.clone;
            FudgeCore.Recycler.store(tmpQuat);
            return eulerAngles;
        }
        setRotation(_value) {
            let quaternion = _value instanceof FudgeCore.Vector3 ? FudgeCore.Quaternion.ROTATION(_value) : _value;
            let quat = new OIMO.Quat(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            if (_value instanceof FudgeCore.Vector3)
                FudgeCore.Recycler.store(quaternion);
            this.#rigidbody.setOrientation(quat);
        }
        getScaling() {
            let scaling = this.node.mtxWorld.scaling.clone;
            scaling.x *= this.mtxPivot.scaling.x;
            scaling.y *= this.mtxPivot.scaling.y;
            scaling.z *= this.mtxPivot.scaling.z;
            return scaling;
        }
        setScaling(_value) {
            this.createCollider(new OIMO.Vec3(_value.x / 2, _value.y / 2, _value.z / 2), this.#typeCollider);
            this.#collider = new OIMO.Shape(this.#colliderInfo);
            let oldCollider = this.#rigidbody.getShapeList();
            this.#rigidbody.addShape(this.#collider);
            this.#rigidbody.removeShape(oldCollider);
            this.#collider.userData = this;
            this.#collider.setCollisionGroup(this.collisionGroup);
            this.#collider.setCollisionMask(this.collisionMask);
            this.#collider.setRestitution(this.#restitution);
            this.#collider.setFriction(this.#friction);
            this.#collider.setContactCallback(this.#callbacks);
        }
        initialize() {
            if (!this.node)
                return;
            switch (Number(this.initialization)) {
                case BODY_INIT.TO_NODE:
                    this.mtxPivot = FudgeCore.Matrix4x4.IDENTITY();
                    break;
                case BODY_INIT.TO_MESH:
                    let cmpMesh = this.node.getComponent(FudgeCore.ComponentMesh);
                    if (cmpMesh)
                        this.mtxPivot = cmpMesh.mtxPivot.clone;
                    break;
                case BODY_INIT.TO_PIVOT:
                    break;
            }
            let mtxWorld = FudgeCore.Matrix4x4.PRODUCT(this.node.mtxWorld, this.mtxPivot);
            let position = mtxWorld.translation;
            let rotation = mtxWorld.rotation;
            let scaling = mtxWorld.scaling;
            this.setScaling(scaling);
            this.#rigidbody.setMassData(this.#massData);
            this.setPosition(position);
            this.setRotation(rotation);
            let scalingInverse = this.node.mtxWorld.scaling.map(_i => 1 / _i);
            this.#mtxPivotUnscaled = FudgeCore.Matrix4x4.COMPOSITION(this.mtxPivot.translation, this.mtxPivot.rotation, scalingInverse);
            this.#mtxPivotInverse = FudgeCore.Matrix4x4.INVERSE(this.#mtxPivotUnscaled);
            this.addRigidbodyToWorld();
            this.isInitialized = true;
        }
        getVelocity() {
            let velocity = this.#rigidbody.getLinearVelocity();
            return new FudgeCore.Vector3(velocity.x, velocity.y, velocity.z);
        }
        setVelocity(_value) {
            let velocity = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.#rigidbody.setLinearVelocity(velocity);
        }
        getAngularVelocity() {
            let velocity = this.#rigidbody.getAngularVelocity();
            return new FudgeCore.Vector3(velocity.x, velocity.y, velocity.z);
        }
        setAngularVelocity(_value) {
            let velocity = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.#rigidbody.setAngularVelocity(velocity);
        }
        applyForce(_force) {
            this.#rigidbody.applyForceToCenter(new OIMO.Vec3(_force.x, _force.y, _force.z));
        }
        applyForceAtPoint(_force, _worldPoint) {
            this.#rigidbody.applyForce(new OIMO.Vec3(_force.x, _force.y, _force.z), new OIMO.Vec3(_worldPoint.x, _worldPoint.y, _worldPoint.z));
        }
        applyTorque(_rotationalForce) {
            this.#rigidbody.applyTorque(new OIMO.Vec3(_rotationalForce.x, _rotationalForce.y, _rotationalForce.z));
        }
        applyImpulseAtPoint(_impulse, _worldPoint = null) {
            _worldPoint = _worldPoint != null ? _worldPoint : this.getPosition();
            this.#rigidbody.applyImpulse(new OIMO.Vec3(_impulse.x, _impulse.y, _impulse.z), new OIMO.Vec3(_worldPoint.x, _worldPoint.y, _worldPoint.z));
        }
        applyLinearImpulse(_impulse) {
            this.#rigidbody.applyLinearImpulse(new OIMO.Vec3(_impulse.x, _impulse.y, _impulse.z));
        }
        applyAngularImpulse(_rotationalImpulse) {
            this.#rigidbody.applyAngularImpulse(new OIMO.Vec3(_rotationalImpulse.x, _rotationalImpulse.y, _rotationalImpulse.z));
        }
        addVelocity(_value) {
            this.#rigidbody.addLinearVelocity(new OIMO.Vec3(_value.x, _value.y, _value.z));
        }
        addAngularVelocity(_value) {
            this.#rigidbody.addAngularVelocity(new OIMO.Vec3(_value.x, _value.y, _value.z));
        }
        activateAutoSleep(_on) {
            this.#rigidbody.setAutoSleep(_on);
        }
        raycastThisBody(_origin, _direction, _length, _debugDraw = false) {
            let hitInfo = new FudgeCore.RayHitInfo();
            let geometry = this.#rigidbody.getShapeList().getGeometry();
            let transform = this.#rigidbody.getTransform();
            let scaledDirection = _direction.clone;
            scaledDirection.scale(_length);
            let endpoint = FudgeCore.Vector3.SUM(scaledDirection, _origin.clone);
            let oimoRay = new OIMO.RayCastHit();
            let hit = geometry.rayCast(new OIMO.Vec3(_origin.x, _origin.y, _origin.z), new OIMO.Vec3(endpoint.x, endpoint.y, endpoint.z), transform, oimoRay);
            if (hit) {
                hitInfo.hit = true;
                hitInfo.hitPoint = new FudgeCore.Vector3(oimoRay.position.x, oimoRay.position.y, oimoRay.position.z);
                hitInfo.hitNormal = new FudgeCore.Vector3(oimoRay.normal.x, oimoRay.normal.y, oimoRay.normal.z);
                let dx = _origin.x - hitInfo.hitPoint.x;
                let dy = _origin.y - hitInfo.hitPoint.y;
                let dz = _origin.z - hitInfo.hitPoint.z;
                hitInfo.hitDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                hitInfo.rigidbodyComponent = this;
                hitInfo.rayOrigin = _origin;
                hitInfo.rayEnd = endpoint;
            }
            else {
                hitInfo.rayOrigin = _origin;
                hitInfo.hitPoint = new FudgeCore.Vector3(endpoint.x, endpoint.y, endpoint.z);
            }
            if (_debugDraw) {
                FudgeCore.Physics.debugDraw.debugRay(hitInfo.rayOrigin, hitInfo.hitPoint, new FudgeCore.Color(0, 1, 0, 1));
            }
            return hitInfo;
        }
        serialize() {
            let serialization = this.getMutator();
            delete serialization.mtxPivot;
            delete serialization.active;
            serialization.typeBody = FudgeCore.BODY_TYPE[this.#typeBody];
            serialization.typeCollider = FudgeCore.COLLIDER_TYPE[this.#typeCollider];
            serialization.initialization = BODY_INIT[this.initialization];
            serialization.id = this.#id;
            serialization.pivot = this.mtxPivot.serialize();
            serialization[super.constructor.name] = super.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            super.deserialize(_serialization[super.constructor.name]);
            this.mtxPivot.deserialize(_serialization.pivot);
            this.#id = _serialization.id;
            this.mass = ifNumber(_serialization.mass, this.mass);
            this.dampTranslation = ifNumber(_serialization.dampTranslation, this.dampTranslation);
            this.dampRotation = ifNumber(_serialization.dampRotation, this.dampRotation);
            this.collisionGroup = ifNumber(_serialization.collisionGroup, this.collisionGroup);
            this.effectRotation = _serialization.effectRotation || this.effectRotation;
            this.effectGravity = ifNumber(_serialization.effectGravity, this.effectGravity);
            this.friction = ifNumber(_serialization.friction, this.friction);
            this.restitution = ifNumber(_serialization.restitution, this.restitution);
            this.isTrigger = _serialization.isTrigger || this.isTrigger;
            this.initialization = _serialization.initialization;
            this.initialization = BODY_INIT[_serialization.initialization];
            this.typeBody = FudgeCore.BODY_TYPE[_serialization.typeBody];
            this.typeCollider = FudgeCore.COLLIDER_TYPE[_serialization.typeCollider];
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            if (_mutator.typeBody != undefined)
                _mutator.typeBody = parseInt(_mutator.typeBody);
            if (_mutator.typeCollider != undefined)
                _mutator.typeCollider = parseInt(_mutator.typeCollider);
            if (_mutator.initialization != undefined)
                _mutator.initialization = parseInt(_mutator.initialization);
            await super.mutate(_mutator, _selection, _dispatchMutate);
            if (_mutator.initialization != undefined && this.isActive)
                this.initialize();
        }
        getMutator() {
            let mutator = super.getMutator(true);
            mutator.friction = this.friction;
            mutator.restitution = this.restitution;
            mutator.mass = this.mass;
            mutator.dampTranslation = this.dampTranslation;
            mutator.dampRotation = this.dampRotation;
            mutator.effectGravity = this.effectGravity;
            mutator.typeBody = this.#typeBody;
            mutator.typeCollider = this.#typeCollider;
            mutator.isTrigger = this.#isTrigger;
            return mutator;
        }
        getMutatorAttributeTypes(_mutator) {
            let types = super.getMutatorAttributeTypes(_mutator);
            if (types.typeBody)
                types.typeBody = FudgeCore.BODY_TYPE;
            if (types.typeCollider)
                types.typeCollider = FudgeCore.COLLIDER_TYPE;
            if (types.initialization)
                types.initialization = BODY_INIT;
            return types;
        }
        reduceMutator(_mutator) {
            super.reduceMutator(_mutator);
            delete _mutator.convexMesh;
            delete _mutator.collisionMask;
            delete _mutator.isInitialized;
        }
        create(_mass = 1, _type = FudgeCore.BODY_TYPE.DYNAMIC, _colliderType = FudgeCore.COLLIDER_TYPE.CUBE, _group = FudgeCore.Physics.settings.defaultCollisionGroup, _mtxTransform = null, _convexMesh = null) {
            this.convexMesh = _convexMesh;
            this.#typeBody = _type;
            this.#collisionGroup = _group;
            this.#typeCollider = _colliderType;
            this.mass = _mass;
            this.#restitution = FudgeCore.Physics.settings.defaultRestitution;
            this.#friction = FudgeCore.Physics.settings.defaultFriction;
            this.collisionMask = FudgeCore.Physics.settings.defaultCollisionMask;
            this.createRigidbody(_mass, _type, this.#typeCollider, _mtxTransform, this.#collisionGroup);
            this.#id = FudgeCore.Physics.distributeBodyID();
            this.#callbacks = new OIMO.ContactCallback();
            this.#callbacks.beginTriggerContact = this.triggerEnter;
            this.#callbacks.endTriggerContact = this.triggerExit;
            this.#callbacks.postSolve = this.collisionEnter;
            this.#callbacks.endContact = this.collisionExit;
        }
        createRigidbody(_mass, _type, _colliderType, _mtxTransform, _collisionGroup = FudgeCore.COLLISION_GROUP.DEFAULT) {
            let oimoType;
            switch (_type) {
                case FudgeCore.BODY_TYPE.DYNAMIC:
                    oimoType = OIMO.RigidBodyType.DYNAMIC;
                    break;
                case FudgeCore.BODY_TYPE.STATIC:
                    oimoType = OIMO.RigidBodyType.STATIC;
                    break;
                case FudgeCore.BODY_TYPE.KINEMATIC:
                    oimoType = OIMO.RigidBodyType.KINEMATIC;
                    break;
                default:
                    oimoType = OIMO.RigidBodyType.DYNAMIC;
                    break;
            }
            let tmpTransform = _mtxTransform == null ? super.node != null ? super.node.mtxWorld : FudgeCore.Matrix4x4.IDENTITY() : _mtxTransform;
            let scale = new OIMO.Vec3((tmpTransform.scaling.x * this.mtxPivot.scaling.x) / 2, (tmpTransform.scaling.y * this.mtxPivot.scaling.y) / 2, (tmpTransform.scaling.z * this.mtxPivot.scaling.z) / 2);
            let position = new OIMO.Vec3(tmpTransform.translation.x + this.mtxPivot.translation.x, tmpTransform.translation.y + this.mtxPivot.translation.y, tmpTransform.translation.z + this.mtxPivot.translation.z);
            let rotation = new OIMO.Vec3(tmpTransform.rotation.x + this.mtxPivot.rotation.x, tmpTransform.rotation.y + this.mtxPivot.rotation.y, tmpTransform.rotation.z + this.mtxPivot.rotation.z);
            this.createCollider(scale, _colliderType);
            this.#massData.mass = _mass;
            this.#rigidbodyInfo.type = oimoType;
            this.#rigidbodyInfo.position = position;
            this.#rigidbodyInfo.rotation.fromEulerXyz(new OIMO.Vec3(rotation.x, rotation.y, rotation.z));
            this.#rigidbody = new OIMO.RigidBody(this.#rigidbodyInfo);
            this.#collider = new OIMO.Shape(this.#colliderInfo);
            this.#collider.userData = this;
            this.#collider.setCollisionGroup(_collisionGroup);
            this.#collider.setCollisionMask(this.collisionMask);
            this.#rigidbody.addShape(this.#collider);
            this.#rigidbody.setMassData(this.#massData);
            this.#rigidbody.getShapeList().setRestitution(this.#restitution);
            this.#rigidbody.getShapeList().setFriction(this.#friction);
            this.#rigidbody.getShapeList().setContactCallback(this.#callbacks);
            this.#rigidbody.setLinearDamping(this.#dampingLinear);
            this.#rigidbody.setAngularDamping(this.#dampingAngular);
            this.#rigidbody.setGravityScale(this.#effectGravity);
            this.#rigidbody.setRotationFactor(new OIMO.Vec3(this.#effectRotation.x, this.#effectRotation.y, this.#effectRotation.z));
        }
        createCollider(_scale, _colliderType) {
            let shapeConf = new OIMO.ShapeConfig();
            let geometry;
            if (this.typeCollider != _colliderType)
                this.typeCollider = _colliderType;
            switch (_colliderType) {
                case FudgeCore.COLLIDER_TYPE.CUBE:
                    geometry = new OIMO.BoxGeometry(_scale);
                    break;
                case FudgeCore.COLLIDER_TYPE.SPHERE:
                    geometry = new OIMO.SphereGeometry(_scale.x);
                    break;
                case FudgeCore.COLLIDER_TYPE.CAPSULE:
                    geometry = new OIMO.CapsuleGeometry(_scale.x, _scale.y);
                    break;
                case FudgeCore.COLLIDER_TYPE.CYLINDER:
                    geometry = new OIMO.CylinderGeometry(_scale.x, _scale.y);
                    break;
                case FudgeCore.COLLIDER_TYPE.CONE:
                    geometry = new OIMO.ConeGeometry(_scale.x, _scale.y);
                    break;
                case FudgeCore.COLLIDER_TYPE.PYRAMID:
                    geometry = this.createConvexGeometryCollider(this.createPyramidVertices(), _scale);
                    break;
                case FudgeCore.COLLIDER_TYPE.CONVEX:
                    geometry = this.createConvexGeometryCollider(this.convexMesh, _scale);
                    break;
            }
            shapeConf.geometry = geometry;
            this.#colliderInfo = shapeConf;
        }
        createConvexGeometryCollider(_vertices, _scale) {
            let verticesAsVec3 = new Array();
            for (let i = 0; i < _vertices.length; i += 3) {
                verticesAsVec3.push(new OIMO.Vec3(_vertices[i] * _scale.x, _vertices[i + 1] * _scale.y, _vertices[i + 2] * _scale.z));
            }
            return new OIMO.ConvexHullGeometry(verticesAsVec3);
        }
        createPyramidVertices() {
            let vertices = new Float32Array([
                -1, 0, 1, 1, 0, 1, 1, 0, -1, -1, 0, -1,
                0, 2, 0
            ]);
            return vertices;
        }
        collisionCenterPoint(_colPoints, _numPoints) {
            let totalPoints = 0;
            let totalX = 0;
            let totalY = 0;
            let totalZ = 0;
            _colPoints.forEach((_value) => {
                if (totalPoints < _numPoints) {
                    totalPoints++;
                    totalX += _value.getPosition2().x;
                    totalY += _value.getPosition2().y;
                    totalZ += _value.getPosition2().z;
                }
            });
            return new FudgeCore.Vector3(totalX / _numPoints, totalY / _numPoints, totalZ / _numPoints);
            ;
        }
        collisionEnter(_contact) {
            let bodyA = _contact.getShape1()?.userData;
            let bodyB = _contact.getShape2()?.userData;
            if (!bodyA || !bodyB || bodyA.collisions.includes(bodyB))
                return;
            bodyA.collisions.push(bodyB);
            bodyB.collisions.push(bodyA);
            let manifold = _contact.getManifold();
            let points = manifold.getPoints();
            let normalImpulse = 0;
            let tangentImpulse = 0;
            let binormalImpulse = 0;
            for (let manifoldPoint of points) {
                normalImpulse += manifoldPoint.getNormalImpulse();
                tangentImpulse += manifoldPoint.getTangentImpulse();
                binormalImpulse += manifoldPoint.getBinormalImpulse();
            }
            let normal = manifold.getNormal();
            let collisionNormal = new FudgeCore.Vector3(normal.x, normal.y, normal.z);
            let collisionCenterPoint = bodyA.collisionCenterPoint(points, manifold.getNumPoints());
            bodyA.dispatchEvent(new FudgeCore.EventPhysics("ColliderEnteredCollision", bodyB, normalImpulse, tangentImpulse, binormalImpulse, collisionCenterPoint, collisionNormal));
            bodyB.dispatchEvent(new FudgeCore.EventPhysics("ColliderEnteredCollision", bodyA, normalImpulse, tangentImpulse, binormalImpulse, collisionCenterPoint, collisionNormal));
        }
        collisionExit(_contact) {
            let bodyA = _contact.getShape1()?.userData;
            let bodyB = _contact.getShape2()?.userData;
            if (!bodyA || !bodyB || !bodyA.collisions.includes(bodyB))
                return;
            bodyA.collisions.splice(bodyA.collisions.indexOf(bodyB), 1);
            bodyB.collisions.splice(bodyB.collisions.indexOf(bodyA), 1);
            bodyA.dispatchEvent(new FudgeCore.EventPhysics("ColliderLeftCollision", bodyB, 0, 0, 0));
            bodyB.dispatchEvent(new FudgeCore.EventPhysics("ColliderLeftCollision", bodyA, 0, 0, 0));
        }
        triggerEnter(_contact) {
            let bodyA = _contact.getShape1()?.userData;
            let bodyB = _contact.getShape2()?.userData;
            if (!bodyA || !bodyB || bodyA.triggerings.includes(bodyB))
                return;
            bodyA.triggerings.push(bodyB);
            bodyB.triggerings.push(bodyA);
            let manifold = _contact.getManifold();
            let points = manifold.getPoints();
            let normal = manifold.getNormal();
            let collisionNormal = new FudgeCore.Vector3(normal.x, normal.y, normal.z);
            let collisionCenterPoint = bodyA.collisionCenterPoint(points, manifold.getNumPoints());
            bodyA.dispatchEvent(new FudgeCore.EventPhysics("TriggerEnteredCollision", bodyB, 0, 0, 0, collisionCenterPoint, collisionNormal));
            bodyB.dispatchEvent(new FudgeCore.EventPhysics("TriggerEnteredCollision", bodyA, 0, 0, 0, collisionCenterPoint, collisionNormal));
        }
        triggerExit(_contact) {
            let bodyA = _contact.getShape1()?.userData;
            let bodyB = _contact.getShape2()?.userData;
            if (!bodyA || !bodyB || !bodyA.triggerings.includes(bodyB))
                return;
            bodyA.triggerings.splice(bodyA.collisions.indexOf(bodyB), 1);
            bodyB.triggerings.splice(bodyB.collisions.indexOf(bodyA), 1);
            bodyA.dispatchEvent(new FudgeCore.EventPhysics("TriggerLeftCollision", bodyB, 0, 0, 0));
            bodyB.dispatchEvent(new FudgeCore.EventPhysics("TriggerLeftCollision", bodyA, 0, 0, 0));
        }
    }
    FudgeCore.ComponentRigidbody = ComponentRigidbody;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class PhysicsDebugVertexBuffer {
        constructor(_renderingContext) {
            this.numVertices = 0;
            this.gl = _renderingContext;
            this.buffer = this.gl.createBuffer();
        }
        setData(_array) {
            if (this.attribs == null)
                throw "set attributes first";
            this.numVertices = _array.length / (this.stride / 4);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(_array), this.gl.DYNAMIC_DRAW);
        }
        setAttribs(_attribs) {
            this.attribs = _attribs;
            this.offsets = [];
            this.stride = 0;
            let n = _attribs.length;
            for (let i = 0; i < n; i++) {
                this.offsets.push(this.stride);
                this.stride += _attribs[i].float32Count * Float32Array.BYTES_PER_ELEMENT;
            }
        }
        loadAttribIndices(_program) {
            this.indices = _program.getAttribIndices(this.attribs);
        }
        bindAttribs() {
            if (this.indices == null)
                throw "indices are not loaded";
            let n = this.attribs.length;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
            for (let i = 0; i < n; i++) {
                this.gl.enableVertexAttribArray(this.indices[i]);
                this.gl.vertexAttribPointer(this.indices[i], this.attribs[i].float32Count, this.gl.FLOAT, false, this.stride, this.offsets[i]);
            }
        }
    }
    FudgeCore.PhysicsDebugVertexBuffer = PhysicsDebugVertexBuffer;
    class PhysicsDebugIndexBuffer {
        constructor(_renderingContext) {
            this.gl = _renderingContext;
            this.buffer = this.gl.createBuffer();
        }
        setData(_array) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(_array), this.gl.DYNAMIC_DRAW);
            this.count = _array.length;
        }
        draw(_mode = this.gl.TRIANGLES, _count = -1) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
            this.gl.drawElements(_mode, _count >= 0 ? _count : this.count, this.gl.UNSIGNED_SHORT, 0);
        }
    }
    FudgeCore.PhysicsDebugIndexBuffer = PhysicsDebugIndexBuffer;
    class PhysicsDebugVertexAttribute {
        constructor(_float32Count, _name) {
            this.name = _name;
            this.float32Count = _float32Count;
        }
    }
    FudgeCore.PhysicsDebugVertexAttribute = PhysicsDebugVertexAttribute;
    class PhysicsDebugShader {
        constructor(_renderingContext) {
            this.gl = _renderingContext;
            this.program = this.gl.createProgram();
            this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
            this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        }
        compile(_vertexSource, _fragmentSource) {
            this.uniformLocationMap = new Map();
            this.compileShader(this.vertexShader, _vertexSource);
            this.compileShader(this.fragmentShader, _fragmentSource);
            this.gl.attachShader(this.program, this.vertexShader);
            this.gl.attachShader(this.program, this.fragmentShader);
            this.gl.linkProgram(this.program);
            if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
                FudgeCore.Debug.log(this.gl.getProgramInfoLog(this.program));
            }
            this.gl.validateProgram(this.program);
            if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
                console.error("ERROR validating program!", this.gl.getProgramInfoLog(this.program));
                return;
            }
        }
        getAttribIndex(_name) {
            return this.gl.getAttribLocation(this.program, _name);
        }
        getUniformLocation(_name) {
            if (this.uniformLocationMap.has(_name))
                return this.uniformLocationMap.get(_name);
            let location = this.gl.getUniformLocation(this.program, _name);
            this.uniformLocationMap.set(_name, location);
            return location;
        }
        getAttribIndices(_attribs) {
            let indices = [];
            _attribs.forEach(_value => {
                indices.push(this.getAttribIndex(_value.name));
            });
            return indices;
        }
        use() {
            this.gl.useProgram(this.program);
        }
        compileShader(_shader, _source) {
            this.gl.shaderSource(_shader, _source);
            this.gl.compileShader(_shader);
            if (!this.gl.getShaderParameter(_shader, this.gl.COMPILE_STATUS)) {
                FudgeCore.Debug.log(this.gl.getShaderInfoLog(_shader));
            }
        }
    }
    FudgeCore.PhysicsDebugShader = PhysicsDebugShader;
    class PhysicsDebugDraw extends FudgeCore.RenderWebGL {
        constructor() {
            super();
            this.style = new OIMO.DebugDrawStyle();
            this.oimoDebugDraw = new OIMO.DebugDraw();
            this.oimoDebugDraw.wireframe = true;
            this.gl = FudgeCore.RenderWebGL.getRenderingContext();
            this.initializeOverride();
            this.shader = new PhysicsDebugShader(this.gl);
            this.shader.compile(this.vertexShaderSource(), this.fragmentShaderSource());
            this.initializeBuffers();
        }
        setDebugMode(_mode = FudgeCore.PHYSICS_DEBUGMODE.NONE) {
            let draw = { drawAabbs: false, drawBases: false, drawBvh: false, drawContactBases: false, drawContacts: false, drawJointLimits: false, drawJoints: false, drawPairs: false, drawShapes: false };
            switch (_mode) {
                case FudgeCore.PHYSICS_DEBUGMODE.COLLIDERS:
                    draw.drawBases = draw.drawShapes = true;
                    break;
                case FudgeCore.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER:
                    draw.drawJoints = draw.drawJointLimits = draw.drawShapes = true;
                    break;
                case FudgeCore.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY:
                    draw.drawBases = draw.drawJointLimits = draw.drawJoints = draw.drawShapes = true;
                    break;
                case FudgeCore.PHYSICS_DEBUGMODE.CONTACTS:
                    draw.drawBases = draw.drawContactBases = draw.drawContacts = draw.drawPairs = draw.drawShapes = true;
                    break;
                case FudgeCore.PHYSICS_DEBUGMODE.BOUNDING_BOXES:
                    draw.drawAabbs = draw.drawBases = draw.drawBvh = true;
                    break;
            }
            Object.assign(this.oimoDebugDraw, draw);
        }
        initializeBuffers() {
            let attribs = [
                new PhysicsDebugVertexAttribute(3, "aPosition"),
                new PhysicsDebugVertexAttribute(3, "aNormal"),
                new PhysicsDebugVertexAttribute(3, "aColor")
            ];
            this.pointVBO = new PhysicsDebugVertexBuffer(this.gl);
            this.pointIBO = new PhysicsDebugIndexBuffer(this.gl);
            this.pointVBO.setAttribs(attribs);
            this.pointVBO.loadAttribIndices(this.shader);
            this.lineVBO = new PhysicsDebugVertexBuffer(this.gl);
            this.lineIBO = new PhysicsDebugIndexBuffer(this.gl);
            this.lineVBO.setAttribs(attribs);
            this.lineVBO.loadAttribIndices(this.shader);
            this.triVBO = new PhysicsDebugVertexBuffer(this.gl);
            this.triIBO = new PhysicsDebugIndexBuffer(this.gl);
            this.triVBO.setAttribs(attribs);
            this.triVBO.loadAttribIndices(this.shader);
            this.clearBuffers();
        }
        clearBuffers() {
            this.gl.lineWidth(2.0);
            this.pointData = [];
            this.lineData = [];
            this.triData = [];
            this.numPointData = 0;
            this.numLineData = 0;
            this.numTriData = 0;
        }
        drawBuffers() {
            this.shader.use();
            this.gl.uniformMatrix4fv(this.shader.getUniformLocation("u_mtxWorldToView"), false, FudgeCore.Physics.mainCam.mtxWorldToView.getArray());
            this.gl.bindVertexArray(null);
            if (this.numPointData > 0) {
                this.pointIboData = [];
                for (let i = 0; i < this.numPointData; i++) {
                    this.pointIboData.push(i);
                }
                this.pointIBO.setData(this.pointIboData);
                this.pointVBO.setData(this.pointData);
                this.pointVBO.bindAttribs();
                this.pointIBO.draw(this.gl.POINTS, this.numPointData);
                this.numPointData = 0;
            }
            if (this.numLineData > 0) {
                this.lineIboData = [];
                for (let i = 0; i < this.numLineData; i++) {
                    this.lineIboData.push(i * 2);
                    this.lineIboData.push(i * 2 + 1);
                }
                this.lineIBO.setData(this.lineIboData);
                this.lineVBO.setData(this.lineData);
                this.lineVBO.bindAttribs();
                this.lineIBO.draw(this.gl.LINES, this.numLineData * 2);
                this.numLineData = 0;
            }
            if (this.numTriData > 0) {
                this.triIboData = [];
                for (let i = 0; i < this.numTriData; i++) {
                    this.triIboData.push(i * 3);
                    this.triIboData.push(i * 3 + 1);
                    this.triIboData.push(i * 3 + 2);
                }
                this.triIBO.setData(this.triIboData);
                this.triVBO.setData(this.triData);
                this.triVBO.bindAttribs();
                this.triIBO.draw(this.gl.TRIANGLES, this.numTriData * 3);
                this.numTriData = 0;
            }
        }
        debugRay(_origin, _end, _color) {
            this.oimoDebugDraw.line(new OIMO.Vec3(_origin.x, _origin.y, _origin.z), new OIMO.Vec3(_end.x, _end.y, _end.z), new OIMO.Vec3(_color.r, _color.g, _color.b));
            this.oimoDebugDraw.point(new OIMO.Vec3(_end.x, _end.y, _end.z), new OIMO.Vec3(_color.r, _color.g, _color.b));
        }
        initializeOverride() {
            OIMO.DebugDraw.prototype.point = function (_v, _color) {
                let debugWrapper = FudgeCore.Physics.debugDraw;
                if (FudgeCore.Physics.mainCam != null) {
                    let data = debugWrapper.pointData;
                    data.push(_v.x, _v.y, _v.z);
                    data.push(0, 0, 0);
                    data.push(_color.x, _color.y, _color.z);
                    debugWrapper.numPointData++;
                }
            };
            OIMO.DebugDraw.prototype.line = function (_v1, _v2, _color) {
                let debugWrapper = FudgeCore.Physics.debugDraw;
                if (FudgeCore.Physics.mainCam != null) {
                    let data = debugWrapper.lineData;
                    data.push(_v1.x, _v1.y, _v1.z);
                    data.push(0, 0, 0);
                    data.push(_color.x, _color.y, _color.z);
                    data.push(_v2.x, _v2.y, _v2.z);
                    data.push(0, 0, 0);
                    data.push(_color.x, _color.y, _color.z);
                    debugWrapper.numLineData++;
                }
            };
            OIMO.DebugDraw.prototype.triangle = function (_v1, _v2, _v3, _n1, _n2, _n3, _color) {
                let debugWrapper = FudgeCore.Physics.debugDraw;
                if (FudgeCore.Physics.mainCam != null) {
                    let data = debugWrapper.triData;
                    data.push(_v1.x, _v1.y, _v1.z);
                    data.push(_n1.x, _n1.y, _n1.z);
                    data.push(_color.x, _color.y, _color.z);
                    data.push(_v2.x, _v2.y, _v2.z);
                    data.push(_n2.x, _n2.y, _n2.z);
                    data.push(_color.x, _color.y, _color.z);
                    data.push(_v3.x, _v3.y, _v3.z);
                    data.push(_n3.x, _n3.y, _n3.z);
                    data.push(_color.x, _color.y, _color.z);
                    debugWrapper.numTriData++;
                }
            };
        }
        vertexShaderSource() {
            return `
			precision mediump float;
			attribute vec3 aPosition;
			attribute vec3 aColor;
			attribute vec3 aNormal;
			varying vec3 vPosition;
			varying vec3 vNormal;
			varying vec3 vColor;
			uniform mat4 u_mtxWorldToView;

			void main() {
				vPosition = aPosition;
				vColor = aColor;
				vNormal = aNormal;
				gl_Position = u_mtxWorldToView * vec4(aPosition,1.0);
				gl_PointSize = 6.0;
			}`;
        }
        fragmentShaderSource() {
            return `
      precision mediump float;
			varying vec3 vPosition;
			varying vec3 vNormal;
			varying vec3 vColor;

			void main() {
				gl_FragColor = vec4(vColor, 1.0);
			}`;
        }
    }
    FudgeCore.PhysicsDebugDraw = PhysicsDebugDraw;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class JointCylindrical extends FudgeCore.JointAxial {
        static { this.iSubclass = FudgeCore.Joint.registerSubclass(JointCylindrical); }
        #springDampingRotation;
        #springFrequencyRotation;
        #motorForce;
        #maxRotor;
        #minRotor;
        #rotorTorque;
        #rotorSpeed;
        #rotor;
        #rotorSpringDamper;
        constructor(_bodyAnchor = null, _bodyTied = null, _axis = new FudgeCore.Vector3(0, 1, 0), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_bodyAnchor, _bodyTied, _axis, _localAnchor);
            this.config = new OIMO.CylindricalJointConfig();
            this.#springDampingRotation = 0;
            this.#springFrequencyRotation = 0;
            this.#motorForce = 0;
            this.#maxRotor = 360;
            this.#minRotor = 0;
            this.#rotorTorque = 0;
            this.#rotorSpeed = 0;
            this.#getMutator = () => {
                let mutator = {
                    motorForce: this.motorForce,
                    springDampingRotation: this.springDampingRotation,
                    springFrequencyRotation: this.springFrequencyRotation,
                    maxRotor: this.maxRotor,
                    minRotor: this.minRotor,
                    rotorTorque: this.rotorTorque,
                    rotorSpeed: this.rotorSpeed
                };
                return mutator;
            };
            this.#mutate = (_mutator) => {
                this.mutateBase(_mutator, ["motorForce", "rotorTorque", "rotorSpeed", "maxRotor", "minRotor", "springDampingRotation", "springFrequencyRotation", "springFrequency"]);
            };
        }
        set springDamping(_value) {
            super.springDamping = _value;
            if (this.joint != null)
                this.joint.getTranslationalSpringDamper().dampingRatio = _value;
        }
        set springFrequency(_value) {
            super.springFrequency = _value;
            if (this.joint != null)
                this.joint.getTranslationalSpringDamper().frequency = _value;
        }
        get springDampingRotation() {
            return this.#springDampingRotation;
        }
        set springDampingRotation(_value) {
            this.#springDampingRotation = _value;
            if (this.joint != null)
                this.joint.getRotationalSpringDamper().dampingRatio = _value;
        }
        get springFrequencyRotation() {
            return this.#springFrequencyRotation;
        }
        set springFrequencyRotation(_value) {
            this.#springFrequencyRotation = _value;
            if (this.joint != null)
                this.joint.getRotationalSpringDamper().frequency = _value;
        }
        get maxRotor() {
            return this.#maxRotor;
        }
        set maxRotor(_value) {
            this.#maxRotor = _value;
            if (this.joint != null)
                this.joint.getRotationalLimitMotor().upperLimit = _value * FudgeCore.Calc.deg2rad;
        }
        get minRotor() {
            return this.#minRotor;
        }
        set minRotor(_value) {
            this.#minRotor = _value;
            if (this.joint != null)
                this.joint.getRotationalLimitMotor().lowerLimit = _value * FudgeCore.Calc.deg2rad;
        }
        get rotorSpeed() {
            return this.#rotorSpeed;
        }
        set rotorSpeed(_value) {
            this.#rotorSpeed = _value;
            if (this.joint != null)
                this.joint.getRotationalLimitMotor().motorSpeed = _value;
        }
        get rotorTorque() {
            return this.#rotorTorque;
        }
        set rotorTorque(_value) {
            this.#rotorTorque = _value;
            if (this.joint != null)
                this.joint.getRotationalLimitMotor().motorTorque = _value;
        }
        set maxMotor(_value) {
            super.maxMotor = _value;
            if (this.joint != null)
                this.joint.getTranslationalLimitMotor().upperLimit = _value;
        }
        set minMotor(_value) {
            super.minMotor = _value;
            if (this.joint != null)
                this.joint.getTranslationalLimitMotor().lowerLimit = _value;
        }
        set motorSpeed(_value) {
            super.motorSpeed = _value;
            if (this.joint != null)
                this.joint.getTranslationalLimitMotor().motorSpeed = _value;
        }
        get motorForce() {
            return this.#motorForce;
        }
        set motorForce(_value) {
            this.#motorForce = _value;
            if (this.joint != null)
                this.joint.getTranslationalLimitMotor().motorForce = _value;
        }
        serialize() {
            let serialization = this.#getMutator();
            serialization[super.constructor.name] = super.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            this.#mutate(_serialization);
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            this.#mutate(_mutator);
            this.deleteFromMutator(_mutator, this.#getMutator());
            await super.mutate(_mutator, _selection, _dispatchMutate);
        }
        getMutator() {
            let mutator = super.getMutator();
            Object.assign(mutator, this.#getMutator());
            return mutator;
        }
        constructJoint() {
            this.#rotorSpringDamper = new OIMO.SpringDamper().setSpring(this.springFrequencyRotation, this.springDampingRotation);
            this.motor = new OIMO.TranslationalLimitMotor().setLimits(super.minMotor, super.maxMotor);
            this.motor.setMotor(super.motorSpeed, this.motorForce);
            this.#rotor = new OIMO.RotationalLimitMotor().setLimits(this.minRotor * FudgeCore.Calc.deg2rad, this.maxRotor * FudgeCore.Calc.deg2rad);
            this.#rotor.setMotor(this.rotorSpeed, this.rotorTorque);
            this.config = new OIMO.CylindricalJointConfig();
            super.constructJoint();
            this.config.translationalSpringDamper = this.springDamper;
            this.config.translationalLimitMotor = this.motor;
            this.config.rotationalLimitMotor = this.#rotor;
            this.config.rotationalSpringDamper = this.#rotorSpringDamper;
            this.joint = new OIMO.CylindricalJoint(this.config);
            this.configureJoint();
        }
        #getMutator;
        #mutate;
    }
    FudgeCore.JointCylindrical = JointCylindrical;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class JointPrismatic extends FudgeCore.JointAxial {
        static { this.iSubclass = FudgeCore.Joint.registerSubclass(JointPrismatic); }
        #motorForce;
        constructor(_bodyAnchor = null, _bodyTied = null, _axis = new FudgeCore.Vector3(0, 1, 0), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_bodyAnchor, _bodyTied, _axis, _localAnchor);
            this.config = new OIMO.PrismaticJointConfig();
            this.#motorForce = 0;
            this.maxMotor = 10;
            this.minMotor = -10;
        }
        get motorForce() {
            return this.#motorForce;
        }
        set motorForce(_value) {
            this.#motorForce = _value;
            if (this.joint != null)
                this.joint.getLimitMotor().motorForce = _value;
        }
        serialize() {
            let serialization = {
                motorForce: this.motorForce,
                [super.constructor.name]: super.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.motorForce = _serialization.motorForce;
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        getMutator() {
            let mutator = super.getMutator();
            mutator.motorForce = this.motorForce;
            return mutator;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            if (typeof (_mutator.motorForce) !== "undefined")
                this.motorForce = _mutator.motorForce;
            delete _mutator.motorForce;
            await super.mutate(_mutator, _selection, _dispatchMutate);
        }
        constructJoint() {
            this.motor = new OIMO.TranslationalLimitMotor().setLimits(this.minMotor, this.maxMotor);
            this.motor.setMotor(this.motorSpeed, this.motorForce);
            this.config = new OIMO.PrismaticJointConfig();
            super.constructJoint();
            this.config.springDamper = this.springDamper;
            this.config.limitMotor = this.motor;
            this.joint = new OIMO.PrismaticJoint(this.config);
            this.configureJoint();
        }
    }
    FudgeCore.JointPrismatic = JointPrismatic;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class JointRagdoll extends FudgeCore.Joint {
        static { this.iSubclass = FudgeCore.Joint.registerSubclass(JointRagdoll); }
        #springDampingTwist;
        #springFrequencyTwist;
        #springDampingSwing;
        #springFrequencySwing;
        #maxMotorTwist;
        #minMotorTwist;
        #motorTorqueTwist;
        #motorSpeedTwist;
        #motorTwist;
        #springDamperTwist;
        #springDamperSwing;
        #axisFirst;
        #axisSecond;
        #maxAngleFirst;
        #maxAngleSecond;
        constructor(_bodyAnchor = null, _bodyTied = null, _axisFirst = new FudgeCore.Vector3(1, 0, 0), _axisSecond = new FudgeCore.Vector3(0, 0, 1), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_bodyAnchor, _bodyTied);
            this.config = new OIMO.RagdollJointConfig();
            this.#springDampingTwist = 0;
            this.#springFrequencyTwist = 0;
            this.#springDampingSwing = 0;
            this.#springFrequencySwing = 0;
            this.#maxMotorTwist = 360;
            this.#minMotorTwist = 0;
            this.#motorTorqueTwist = 0;
            this.#motorSpeedTwist = 0;
            this.#maxAngleFirst = 0;
            this.#maxAngleSecond = 0;
            this.#getMutator = () => {
                let mutator = {
                    maxAngleFirst: this.#maxAngleFirst,
                    maxAngleSecond: this.#maxAngleSecond,
                    springDampingTwist: this.springDampingTwist,
                    springFrequencyTwist: this.springFrequencyTwist,
                    springDampingSwing: this.springDampingSwing,
                    springFrequencySwing: this.springFrequencySwing,
                    maxMotorTwist: this.#maxMotorTwist,
                    minMotorTwist: this.#minMotorTwist,
                    motorSpeedTwist: this.motorSpeedTwist,
                    motorTorqueTwist: this.motorTorqueTwist
                };
                return mutator;
            };
            this.#mutate = (_mutator) => {
                if (typeof (_mutator.maxAngleFirst) !== "undefined")
                    this.#maxAngleFirst = _mutator.maxAngleFirst;
                if (typeof (_mutator.maxAngleSecond) !== "undefined")
                    this.#maxAngleSecond = _mutator.maxAngleSecond;
                this.mutateBase(_mutator, [
                    "springDampingTwist", "springFrequencyTwist", "springDampingSwing", "springFrequencySwing", "maxMotorTwist", "minMotorTwist", "motorSpeedTwist", "motorTorqueTwist"
                ]);
            };
            this.axisFirst = _axisFirst;
            this.axisSecond = _axisSecond;
            this.anchor = _localAnchor;
        }
        get axisFirst() {
            return new FudgeCore.Vector3(this.#axisFirst.x, this.#axisFirst.y, this.#axisFirst.z);
        }
        set axisFirst(_value) {
            this.#axisFirst = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        get axisSecond() {
            return new FudgeCore.Vector3(this.#axisSecond.x, this.#axisSecond.y, this.#axisSecond.z);
        }
        set axisSecond(_value) {
            this.#axisSecond = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        get maxAngleFirstAxis() {
            return this.#maxAngleFirst * FudgeCore.Calc.rad2deg;
        }
        set maxAngleFirstAxis(_value) {
            this.#maxAngleFirst = _value * FudgeCore.Calc.deg2rad;
            this.disconnect();
            this.dirtyStatus();
        }
        get maxAngleSecondAxis() {
            return this.#maxAngleSecond * FudgeCore.Calc.rad2deg;
        }
        set maxAngleSecondAxis(_value) {
            this.#maxAngleSecond = _value * FudgeCore.Calc.deg2rad;
            this.disconnect();
            this.dirtyStatus();
        }
        get springDampingTwist() {
            return this.#springDampingTwist;
        }
        set springDampingTwist(_value) {
            this.#springDampingTwist = _value;
            if (this.joint != null)
                this.joint.getTwistSpringDamper().dampingRatio = _value;
        }
        get springFrequencyTwist() {
            return this.#springFrequencyTwist;
        }
        set springFrequencyTwist(_value) {
            this.#springFrequencyTwist = _value;
            if (this.joint != null)
                this.joint.getTwistSpringDamper().frequency = _value;
        }
        get springDampingSwing() {
            return this.#springDampingSwing;
        }
        set springDampingSwing(_value) {
            this.#springDampingSwing = _value;
            if (this.joint != null)
                this.joint.getSwingSpringDamper().dampingRatio = _value;
        }
        get springFrequencySwing() {
            return this.#springFrequencySwing;
        }
        set springFrequencySwing(_value) {
            this.#springFrequencySwing = _value;
            if (this.joint != null)
                this.joint.getSwingSpringDamper().frequency = _value;
        }
        get maxMotorTwist() {
            return this.#maxMotorTwist * FudgeCore.Calc.rad2deg;
        }
        set maxMotorTwist(_value) {
            _value *= FudgeCore.Calc.deg2rad;
            this.#maxMotorTwist = _value;
            if (this.joint != null)
                this.joint.getTwistLimitMotor().upperLimit = _value;
        }
        get minMotorTwist() {
            return this.#minMotorTwist * FudgeCore.Calc.rad2deg;
        }
        set minMotorTwist(_value) {
            _value *= FudgeCore.Calc.deg2rad;
            this.#minMotorTwist = _value;
            if (this.joint != null)
                this.joint.getTwistLimitMotor().lowerLimit = _value;
        }
        get motorSpeedTwist() {
            return this.#motorSpeedTwist;
        }
        set motorSpeedTwist(_value) {
            this.#motorSpeedTwist = _value;
            if (this.joint != null)
                this.joint.getTwistLimitMotor().motorSpeed = _value;
        }
        get motorTorqueTwist() {
            return this.#motorTorqueTwist;
        }
        set motorTorqueTwist(_value) {
            this.#motorTorqueTwist = _value;
            if (this.joint != null)
                this.joint.getTwistLimitMotor().motorTorque = _value;
        }
        serialize() {
            let serialization = this.#getMutator();
            serialization.axisFirst = this.axisFirst.serialize();
            serialization.axisSecond = this.axisSecond.serialize();
            serialization[super.constructor.name] = super.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            await this.axisFirst.deserialize(_serialization.axisFirst);
            await this.axisSecond.deserialize(_serialization.axisSecond);
            this.#mutate(_serialization);
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            if (typeof (_mutator.axisFirst) !== "undefined")
                this.axisFirst = new FudgeCore.Vector3(...(Object.values(_mutator.axisFirst)));
            if (typeof (_mutator.axisSecond) !== "undefined")
                this.axisSecond = new FudgeCore.Vector3(...(Object.values(_mutator.axisSecond)));
            delete _mutator.axisFirst;
            delete _mutator.axisSecond;
            this.#mutate(_mutator);
            this.deleteFromMutator(_mutator, this.#getMutator());
            await super.mutate(_mutator, _selection, _dispatchMutate);
        }
        getMutator() {
            let mutator = super.getMutator();
            Object.assign(mutator, this.#getMutator());
            mutator.axisFirst = this.axisFirst.getMutator();
            mutator.axisSecond = this.axisSecond.getMutator();
            return mutator;
        }
        constructJoint() {
            this.#springDamperTwist = new OIMO.SpringDamper().setSpring(this.springFrequencyTwist, this.springDampingTwist);
            this.#springDamperSwing = new OIMO.SpringDamper().setSpring(this.springFrequencySwing, this.springDampingSwing);
            this.#motorTwist = new OIMO.RotationalLimitMotor().setLimits(this.minMotorTwist, this.maxMotorTwist);
            this.#motorTwist.setMotor(this.motorSpeedTwist, this.motorTorqueTwist);
            this.config = new OIMO.RagdollJointConfig();
            super.constructJoint(this.axisFirst, this.axisSecond);
            this.config.swingSpringDamper = this.#springDamperSwing;
            this.config.twistSpringDamper = this.#springDamperTwist;
            this.config.twistLimitMotor = this.#motorTwist;
            this.config.maxSwingAngle1 = this.#maxAngleFirst;
            this.config.maxSwingAngle2 = this.#maxAngleSecond;
            this.joint = new OIMO.RagdollJoint(this.config);
            super.configureJoint();
        }
        #getMutator;
        #mutate;
    }
    FudgeCore.JointRagdoll = JointRagdoll;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class JointRevolute extends FudgeCore.JointAxial {
        static { this.iSubclass = FudgeCore.Joint.registerSubclass(JointRevolute); }
        #motorTorque;
        #rotor;
        constructor(_bodyAnchor = null, _bodyTied = null, _axis = new FudgeCore.Vector3(0, 1, 0), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_bodyAnchor, _bodyTied, _axis, _localAnchor);
            this.config = new OIMO.RevoluteJointConfig();
            this.#motorTorque = 0;
            this.maxMotor = 360;
            this.minMotor = 0;
        }
        set maxMotor(_value) {
            super.maxMotor = _value;
            _value *= FudgeCore.Calc.deg2rad;
            if (this.joint)
                this.joint.getLimitMotor().upperLimit = _value;
        }
        set minMotor(_value) {
            super.minMotor = _value;
            if (this.joint)
                this.joint.getLimitMotor().lowerLimit = _value * FudgeCore.Calc.deg2rad;
        }
        get motorTorque() {
            return this.#motorTorque;
        }
        set motorTorque(_value) {
            this.#motorTorque = _value;
            if (this.joint != null)
                this.joint.getLimitMotor().motorTorque = _value;
        }
        serialize() {
            let serialization = {
                motorTorque: this.motorTorque,
                [super.constructor.name]: super.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.motorTorque = _serialization.motorTorque;
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        getMutator() {
            let mutator = super.getMutator();
            mutator.motorTorque = this.motorTorque;
            return mutator;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            if (typeof (_mutator.motorTorque) !== "undefined")
                this.motorTorque = _mutator.motorTorque;
            delete _mutator.motorTorque;
            await super.mutate(_mutator, _selection, _dispatchMutate);
        }
        constructJoint() {
            this.#rotor = new OIMO.RotationalLimitMotor().setLimits(super.minMotor * FudgeCore.Calc.deg2rad, super.maxMotor * FudgeCore.Calc.deg2rad);
            this.#rotor.setMotor(this.motorSpeed, this.motorTorque);
            this.config = new OIMO.RevoluteJointConfig();
            super.constructJoint();
            this.config.springDamper = this.springDamper;
            this.config.limitMotor = this.#rotor;
            this.joint = new OIMO.RevoluteJoint(this.config);
            this.configureJoint();
        }
    }
    FudgeCore.JointRevolute = JointRevolute;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class JointSpherical extends FudgeCore.Joint {
        static { this.iSubclass = FudgeCore.Joint.registerSubclass(JointSpherical); }
        #springDamping;
        #springFrequency;
        #springDamper;
        constructor(_bodyAnchor = null, _bodyTied = null, _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_bodyAnchor, _bodyTied);
            this.config = new OIMO.SphericalJointConfig();
            this.#springDamping = 0;
            this.#springFrequency = 0;
            this.anchor = new FudgeCore.Vector3(_localAnchor.x, _localAnchor.y, _localAnchor.z);
        }
        get springDamping() {
            return this.#springDamping;
        }
        set springDamping(_value) {
            this.#springDamping = _value;
            if (this.joint != null)
                this.joint.getSpringDamper().dampingRatio = _value;
        }
        get springFrequency() {
            return this.#springFrequency;
        }
        set springFrequency(_value) {
            this.#springFrequency = _value;
            if (this.joint != null)
                this.joint.getSpringDamper().frequency = _value;
        }
        serialize() {
            let serialization = {
                springDamping: this.springDamping,
                springFrequency: this.springFrequency,
                [super.constructor.name]: super.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            this.springDamping = _serialization.springDamping;
            this.springFrequency = _serialization.springFrequency;
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        getMutator() {
            let mutator = super.getMutator();
            mutator.springDamping = this.springDamping;
            mutator.springFrequency = this.springFrequency;
            return mutator;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            this.mutateBase(_mutator, ["springDamping", "springFrequency"]);
            delete _mutator.springDamping;
            delete _mutator.springFrequency;
            await super.mutate(_mutator, _selection, _dispatchMutate);
        }
        constructJoint() {
            this.#springDamper = new OIMO.SpringDamper().setSpring(this.springFrequency, this.springDamping);
            this.config = new OIMO.SphericalJointConfig();
            super.constructJoint();
            this.config.springDamper = this.#springDamper;
            this.joint = new OIMO.SphericalJoint(this.config);
            super.configureJoint();
        }
    }
    FudgeCore.JointSpherical = JointSpherical;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class JointUniversal extends FudgeCore.Joint {
        static { this.iSubclass = FudgeCore.Joint.registerSubclass(JointUniversal); }
        #springDampingFirst;
        #springFrequencyFirst;
        #springDampingSecond;
        #springFrequencySecond;
        #maxRotorFirst;
        #minRotorFirst;
        #rotorTorqueFirst;
        #rotorSpeedFirst;
        #maxRotorSecond;
        #minRotorSecond;
        #rotorTorqueSecond;
        #rotorSpeedSecond;
        #motorFirst;
        #motorSecond;
        #axisSpringDamperFirst;
        #axisSpringDamperSecond;
        #axisFirst;
        #axisSecond;
        constructor(_bodyAnchor = null, _bodyTied = null, _axisFirst = new FudgeCore.Vector3(1, 0, 0), _axisSecond = new FudgeCore.Vector3(0, 0, 1), _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_bodyAnchor, _bodyTied);
            this.config = new OIMO.UniversalJointConfig();
            this.#springDampingFirst = 0;
            this.#springFrequencyFirst = 0;
            this.#springDampingSecond = 0;
            this.#springFrequencySecond = 0;
            this.#maxRotorFirst = 360;
            this.#minRotorFirst = 0;
            this.#rotorTorqueFirst = 0;
            this.#rotorSpeedFirst = 0;
            this.#maxRotorSecond = 360;
            this.#minRotorSecond = 0;
            this.#rotorTorqueSecond = 0;
            this.#rotorSpeedSecond = 0;
            this.#getMutator = () => {
                let mutator = {
                    springDampingFirst: this.#springDampingFirst,
                    springFrequencyFirst: this.#springFrequencyFirst,
                    springDampingSecond: this.#springDampingSecond,
                    springFrequencySecond: this.#springFrequencySecond,
                    maxRotorFirst: this.#maxRotorFirst,
                    minRotorFirst: this.#minRotorFirst,
                    rotorSpeedFirst: this.#rotorSpeedFirst,
                    rotorTorqueFirst: this.#rotorTorqueFirst,
                    maxRotorSecond: this.#maxRotorSecond,
                    minRotorSecond: this.#minRotorSecond,
                    rotorSpeedSecond: this.#rotorSpeedSecond,
                    rotorTorqueSecond: this.#rotorTorqueSecond
                };
                return mutator;
            };
            this.#mutate = (_mutator) => {
                this.mutateBase(_mutator, [
                    "springDampingFirst", "springFrequencyFirst", "springDampingSecond", "springFrequencySecond",
                    "maxRotorFirst", "minRotorFirst", "rotorSpeedFirst", "rotorTorqueFirst",
                    "maxRotorSecond", "minRotorSecond", "rotorSpeedSecond", ".rotorTorqueSecond"
                ]);
            };
            this.axisFirst = _axisFirst;
            this.axisSecond = _axisSecond;
            this.anchor = _localAnchor;
        }
        get axisFirst() {
            return new FudgeCore.Vector3(this.#axisFirst.x, this.#axisFirst.y, this.#axisFirst.z);
        }
        set axisFirst(_value) {
            this.#axisFirst = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        get axisSecond() {
            return new FudgeCore.Vector3(this.#axisSecond.x, this.#axisSecond.y, this.#axisSecond.z);
        }
        set axisSecond(_value) {
            this.#axisSecond = new OIMO.Vec3(_value.x, _value.y, _value.z);
            this.disconnect();
            this.dirtyStatus();
        }
        get springDampingFirst() {
            return this.#springDampingFirst;
        }
        set springDampingFirst(_value) {
            this.#springDampingFirst = _value;
            if (this.joint != null)
                this.joint.getSpringDamper1().dampingRatio = _value;
        }
        get springFrequencyFirst() {
            return this.#springFrequencyFirst;
        }
        set springFrequencyFirst(_value) {
            this.#springFrequencyFirst = _value;
            if (this.joint != null)
                this.joint.getSpringDamper1().frequency = _value;
        }
        get springDampingSecond() {
            return this.#springDampingSecond;
        }
        set springDampingSecond(_value) {
            this.#springDampingSecond = _value;
            if (this.joint != null)
                this.joint.getSpringDamper2().dampingRatio = _value;
        }
        get springFrequencySecond() {
            return this.#springFrequencySecond;
        }
        set springFrequencySecond(_value) {
            this.#springFrequencySecond = _value;
            if (this.joint != null)
                this.joint.getSpringDamper2().frequency = _value;
        }
        get maxRotorFirst() {
            return this.#maxRotorFirst;
        }
        set maxRotorFirst(_value) {
            this.#maxRotorFirst = _value;
            if (this.joint != null)
                this.joint.getLimitMotor1().upperLimit = _value * FudgeCore.Calc.deg2rad;
        }
        get minRotorFirst() {
            return this.#minRotorFirst;
        }
        set minRotorFirst(_value) {
            this.#minRotorFirst = _value;
            if (this.joint != null)
                this.joint.getLimitMotor1().lowerLimit = _value * FudgeCore.Calc.deg2rad;
        }
        get rotorSpeedFirst() {
            return this.#rotorSpeedFirst;
        }
        set rotorSpeedFirst(_value) {
            this.#rotorSpeedFirst = _value;
            if (this.joint != null)
                this.joint.getLimitMotor1().motorSpeed = _value;
        }
        get rotorTorqueFirst() {
            return this.#rotorTorqueFirst;
        }
        set rotorTorqueFirst(_value) {
            this.#rotorTorqueFirst = _value;
            if (this.joint != null)
                this.joint.getLimitMotor1().motorTorque = _value;
        }
        get maxRotorSecond() {
            return this.#maxRotorSecond;
        }
        set maxRotorSecond(_value) {
            this.#maxRotorSecond = _value;
            if (this.joint != null)
                this.joint.getLimitMotor2().upperLimit = _value * FudgeCore.Calc.deg2rad;
        }
        get minRotorSecond() {
            return this.#minRotorSecond;
        }
        set minRotorSecond(_value) {
            this.#minRotorSecond = _value;
            if (this.joint != null)
                this.joint.getLimitMotor2().lowerLimit = _value * FudgeCore.Calc.deg2rad;
        }
        get rotorSpeedSecond() {
            return this.#rotorSpeedSecond;
        }
        set rotorSpeedSecond(_value) {
            this.#rotorSpeedSecond = _value;
            if (this.joint != null)
                this.joint.getLimitMotor2().motorSpeed = _value;
        }
        get rotorTorqueSecond() {
            return this.#rotorTorqueSecond;
        }
        set rotorTorqueSecond(_value) {
            this.#rotorTorqueSecond = _value;
            if (this.joint != null)
                this.joint.getLimitMotor2().motorTorque = _value;
        }
        serialize() {
            let serialization = this.#getMutator();
            serialization.firstAxis = this.axisFirst.serialize();
            serialization.secondAxis = this.axisSecond.serialize();
            serialization[super.constructor.name] = super.serialize();
            return serialization;
        }
        async deserialize(_serialization) {
            this.axisFirst = await new FudgeCore.Vector3().deserialize(_serialization.axisFirst);
            this.axisSecond = await new FudgeCore.Vector3().deserialize(_serialization.axisSecond);
            this.#mutate(_serialization);
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        async mutate(_mutator, _selection = null, _dispatchMutate = true) {
            if (typeof (_mutator.axisFirst) !== "undefined")
                this.axisFirst = new FudgeCore.Vector3(...(Object.values(_mutator.axisFirst)));
            if (typeof (_mutator.axisSecond) !== "undefined")
                this.axisSecond = new FudgeCore.Vector3(...(Object.values(_mutator.axisSecond)));
            delete _mutator.axisFirst;
            delete _mutator.axisSecond;
            this.#mutate(_mutator);
            this.deleteFromMutator(_mutator, this.#getMutator());
            await super.mutate(_mutator, _selection, _dispatchMutate);
        }
        getMutator() {
            let mutator = super.getMutator();
            Object.assign(mutator, this.#getMutator());
            mutator.axisFirst = this.axisFirst.getMutator();
            mutator.axisSecond = this.axisSecond.getMutator();
            return mutator;
        }
        constructJoint() {
            this.#axisSpringDamperFirst = new OIMO.SpringDamper().setSpring(this.#springFrequencyFirst, this.#springDampingFirst);
            this.#axisSpringDamperSecond = new OIMO.SpringDamper().setSpring(this.#springFrequencySecond, this.#springDampingSecond);
            this.#motorFirst = new OIMO.RotationalLimitMotor().setLimits(this.#minRotorFirst * FudgeCore.Calc.deg2rad, this.#maxRotorFirst * FudgeCore.Calc.deg2rad);
            this.#motorFirst.setMotor(this.#rotorSpeedFirst, this.#rotorTorqueFirst);
            this.#motorSecond = new OIMO.RotationalLimitMotor().setLimits(this.#minRotorFirst * FudgeCore.Calc.deg2rad, this.#maxRotorFirst * FudgeCore.Calc.deg2rad);
            this.#motorSecond.setMotor(this.#rotorSpeedFirst, this.#rotorTorqueFirst);
            this.config = new OIMO.UniversalJointConfig();
            super.constructJoint(this.#axisFirst, this.#axisSecond);
            this.config.limitMotor1 = this.#motorFirst;
            this.config.limitMotor2 = this.#motorSecond;
            this.config.springDamper1 = this.#axisSpringDamperFirst;
            this.config.springDamper2 = this.#axisSpringDamperSecond;
            this.joint = new OIMO.UniversalJoint(this.config);
            super.configureJoint();
        }
        #getMutator;
        #mutate;
    }
    FudgeCore.JointUniversal = JointUniversal;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class JointWelding extends FudgeCore.Joint {
        static { this.iSubclass = FudgeCore.Joint.registerSubclass(JointWelding); }
        constructor(_bodyAnchor = null, _bodyTied = null, _localAnchor = new FudgeCore.Vector3(0, 0, 0)) {
            super(_bodyAnchor, _bodyTied);
            this.config = new OIMO.GenericJointConfig();
            this.anchor = new FudgeCore.Vector3(_localAnchor.x, _localAnchor.y, _localAnchor.z);
        }
        serialize() {
            let serialization = {
                [super.constructor.name]: super.serialize()
            };
            return serialization;
        }
        async deserialize(_serialization) {
            super.deserialize(_serialization[super.constructor.name]);
            return this;
        }
        constructJoint() {
            this.config = new OIMO.GenericJointConfig();
            super.constructJoint(new OIMO.Mat3(), new OIMO.Mat3());
            this.joint = new OIMO.GenericJoint(this.config);
            this.joint.setAllowCollision(this.internalCollision);
        }
    }
    FudgeCore.JointWelding = JointWelding;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Physics {
        static { this.settings = new FudgeCore.PhysicsSettings(FudgeCore.COLLISION_GROUP.DEFAULT, (FudgeCore.COLLISION_GROUP.DEFAULT | FudgeCore.COLLISION_GROUP.GROUP_1 | FudgeCore.COLLISION_GROUP.GROUP_2 | FudgeCore.COLLISION_GROUP.GROUP_3 | FudgeCore.COLLISION_GROUP.GROUP_4)); }
        static { this.ƒactive = new Physics(); }
        #debugDraw;
        #mainCam;
        constructor() {
            this.bodyList = new Array();
            this.jointList = new Array();
            if (typeof OIMO == "undefined") {
                FudgeCore.Debug.error("OIMO physics engine not connected!");
                return null;
            }
            this.oimoWorld = new OIMO.World();
            this.#debugDraw = new FudgeCore.PhysicsDebugDraw();
            this.oimoWorld.setDebugDraw(this.#debugDraw.oimoDebugDraw);
        }
        static set activeInstance(_physics) {
            Physics.ƒactive = _physics;
        }
        static get activeInstance() {
            return Physics.ƒactive;
        }
        static get debugDraw() {
            return Physics.ƒactive.#debugDraw;
        }
        static get mainCam() {
            return Physics.ƒactive.#mainCam;
        }
        static raycast(_origin, _direction, _length = 1, _debugDraw = false, _group = FudgeCore.COLLISION_GROUP.DEFAULT) {
            let hitInfo = new FudgeCore.RayHitInfo();
            let ray = new OIMO.RayCastClosest();
            let begin = new OIMO.Vec3(_origin.x, _origin.y, _origin.z);
            let end = this.getRayEndPoint(begin, new FudgeCore.Vector3(_direction.x, _direction.y, _direction.z), _length);
            ray.clear();
            if (_group == FudgeCore.COLLISION_GROUP.DEFAULT) {
                Physics.ƒactive.oimoWorld.rayCast(begin, end, ray);
            }
            else {
                let allHits = new Array();
                Physics.ƒactive.bodyList.forEach(function (_value) {
                    if (_value.collisionGroup == _group) {
                        hitInfo = _value.raycastThisBody(_origin, _direction, _length);
                        if (hitInfo.hit == true) {
                            allHits.push(hitInfo);
                        }
                    }
                });
                allHits.forEach(function (_value) {
                    if (_value.hitDistance < hitInfo.hitDistance || hitInfo.hit == false) {
                        hitInfo = _value;
                    }
                });
            }
            if (ray.hit) {
                hitInfo.hit = true;
                hitInfo.hitPoint = new FudgeCore.Vector3(ray.position.x, ray.position.y, ray.position.z);
                hitInfo.hitNormal = new FudgeCore.Vector3(ray.normal.x, ray.normal.y, ray.normal.z);
                hitInfo.hitDistance = this.getRayDistance(_origin, hitInfo.hitPoint);
                hitInfo.rigidbodyComponent = ray.shape.userData;
                hitInfo.rayEnd = new FudgeCore.Vector3(end.x, end.y, end.z);
                hitInfo.rayOrigin = _origin;
            }
            else {
                hitInfo.rayOrigin = _origin;
                hitInfo.hitPoint = new FudgeCore.Vector3(end.x, end.y, end.z);
            }
            if (_debugDraw) {
                Physics.ƒactive.#debugDraw.debugRay(hitInfo.rayOrigin, hitInfo.hitPoint, new FudgeCore.Color(0, 1, 0, 1));
            }
            return hitInfo;
        }
        static simulate(_deltaTime = FudgeCore.Loop.timeFrameGame / 1000) {
            if (Physics.ƒactive.jointList.length > 0)
                Physics.connectJoints();
            if (_deltaTime == 0)
                return;
            _deltaTime = _deltaTime > 1 / 30 ? 1 / 30 : _deltaTime;
            Physics.ƒactive.oimoWorld.step(_deltaTime);
        }
        static draw(_cmpCamera, _mode) {
            Physics.ƒactive.#debugDraw.setDebugMode(_mode);
            Physics.ƒactive.#mainCam = _cmpCamera;
            Physics.ƒactive.oimoWorld.debugDraw();
            Physics.ƒactive.#debugDraw.drawBuffers();
            Physics.ƒactive.#debugDraw.clearBuffers();
        }
        static adjustTransforms(_branch, _toMesh = false) {
            FudgeCore.Render.prepare(_branch, { ignorePhysics: true });
            for (let node of FudgeCore.Render.nodesPhysics)
                node.getComponent(FudgeCore.ComponentRigidbody).initialize();
        }
        static getGravity() {
            let tmpVec = Physics.ƒactive.oimoWorld.getGravity();
            return new FudgeCore.Vector3(tmpVec.x, tmpVec.y, tmpVec.z);
        }
        static setGravity(_value) {
            let tmpVec = new OIMO.Vec3(_value.x, _value.y, _value.z);
            Physics.ƒactive.oimoWorld.setGravity(tmpVec);
        }
        static addRigidbody(_cmpRB) {
            Physics.ƒactive.bodyList.push(_cmpRB);
            Physics.ƒactive.oimoWorld.addRigidBody(_cmpRB.getOimoRigidbody());
        }
        static removeRigidbody(_cmpRB) {
            let oimoRigidBody = _cmpRB.getOimoRigidbody();
            if (oimoRigidBody._world)
                oimoRigidBody._world.removeRigidBody(oimoRigidBody);
            let id = Physics.ƒactive.bodyList.indexOf(_cmpRB);
            if (id > -1)
                Physics.ƒactive.bodyList.splice(id, 1);
        }
        static addJoint(_cmpJoint) {
            Physics.ƒactive.oimoWorld.addJoint(_cmpJoint.getOimoJoint());
        }
        static changeJointStatus(_cmpJoint) {
            if (Physics.ƒactive.jointList.indexOf(_cmpJoint) < 0)
                Physics.ƒactive.jointList.push(_cmpJoint);
        }
        static removeJoint(_cmpJoint) {
            try {
                Physics.ƒactive.oimoWorld.removeJoint(_cmpJoint.getOimoJoint());
            }
            catch (_error) {
                FudgeCore.Debug.fudge(_error);
            }
        }
        static getBodyList() {
            return Physics.ƒactive.bodyList;
        }
        static distributeBodyID() {
            let freeId = 0;
            let free = false;
            Physics.ƒactive.bodyList.forEach((_value) => {
                if (_value.id != freeId) {
                    free = true;
                }
                else {
                    free = false;
                }
                if (!free) {
                    freeId++;
                }
            });
            return freeId;
        }
        static connectJoints() {
            let jointsToConnect = Physics.ƒactive.jointList;
            Physics.ƒactive.jointList = [];
            jointsToConnect.forEach((_joint) => {
                if (_joint.isConnected() == false)
                    if (_joint.isActive)
                        _joint.connect();
                    else
                        Physics.ƒactive.jointList.push(_joint);
            });
        }
        static cleanup() {
            let oimoWorld = Physics.ƒactive.oimoWorld;
            if (oimoWorld != null) {
                let jointsWorld = oimoWorld.getNumJoints();
                let bodiesWorld = oimoWorld.getNumRigidBodies();
                for (let body of Physics.ƒactive.bodyList)
                    body.isInitialized = false;
                Physics.ƒactive.jointList = new Array();
                for (let i = 0; i < jointsWorld; i++) {
                    let oimoJoint = Physics.ƒactive.oimoWorld.getJointList();
                    oimoWorld.removeJoint(oimoJoint);
                }
                for (let i = 0; i < bodiesWorld; i++) {
                    let oimoBody = oimoWorld.getRigidBodyList();
                    oimoWorld.removeRigidBody(oimoBody);
                }
            }
        }
        static getRayEndPoint(_start, _direction, _length) {
            let origin = FudgeCore.Recycler.get(FudgeCore.Vector3);
            origin.set(_start.x, _start.y, _start.z);
            let scaledDirection = _direction.clone;
            scaledDirection.scale(_length);
            let endpoint = FudgeCore.Vector3.SUM(scaledDirection, origin);
            FudgeCore.Recycler.store(scaledDirection);
            FudgeCore.Recycler.store(endpoint);
            FudgeCore.Recycler.store(origin);
            return new OIMO.Vec3(endpoint.x, endpoint.y, endpoint.z);
        }
        static getRayDistance(_origin, _hitPoint) {
            let dx = _origin.x - _hitPoint.x;
            let dy = _origin.y - _hitPoint.y;
            let dz = _origin.z - _hitPoint.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        }
        getOimoWorld() {
            return Physics.ƒactive.oimoWorld;
        }
    }
    FudgeCore.Physics = Physics;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Box {
        constructor(_min = FudgeCore.Vector3.ONE(Infinity), _max = FudgeCore.Vector3.ONE(-Infinity)) {
            this.set(_min, _max);
        }
        set(_min = FudgeCore.Vector3.ONE(Infinity), _max = FudgeCore.Vector3.ONE(-Infinity)) {
            this.min = _min;
            this.max = _max;
        }
        expand(_include) {
            this.min.min(_include);
            this.max.max(_include);
        }
        recycle() {
            this.min.set(Infinity, Infinity, Infinity);
            this.max.set(-Infinity, -Infinity, -Infinity);
        }
    }
    FudgeCore.Box = Box;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Pick {
        #mtxViewToWorld;
        #posWorld;
        #posMesh;
        constructor(_node) {
            this.node = _node;
        }
        get posWorld() {
            if (this.#posWorld)
                return this.#posWorld;
            let pointInClipSpace = FudgeCore.Vector3.Z(this.zBuffer);
            let m = this.#mtxViewToWorld.getArray();
            let result = FudgeCore.Vector3.TRANSFORMATION(pointInClipSpace, this.#mtxViewToWorld, true);
            let w = m[3] * pointInClipSpace.x + m[7] * pointInClipSpace.y + m[11] * pointInClipSpace.z + m[15];
            result.scale(1 / w);
            this.#posWorld = result;
            return result;
        }
        get posMesh() {
            if (this.#posMesh)
                return this.#posMesh;
            let mtxWorldToMesh = FudgeCore.Matrix4x4.INVERSE(this.node.getComponent(FudgeCore.ComponentMesh).mtxWorld);
            let posMesh = FudgeCore.Vector3.TRANSFORMATION(this.posWorld, mtxWorldToMesh);
            this.#posMesh = posMesh;
            return posMesh;
        }
        get normal() {
            let cmpMesh = this.node.getComponent(FudgeCore.ComponentMesh);
            let result;
            for (let face of cmpMesh.mesh.faces) {
                if (face.isInside(this.posMesh)) {
                    result = face.normal.clone;
                    break;
                }
            }
            result.transform(cmpMesh.mtxWorld, false);
            result.normalize();
            return result;
        }
        set mtxViewToWorld(_mtxViewToWorld) {
            this.#mtxViewToWorld = _mtxViewToWorld;
        }
    }
    FudgeCore.Pick = Pick;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Picker {
        static pickRay(_from, _ray, _min, _max) {
            if (_from.length == 0)
                return [];
            let cmpCameraPick = FudgeCore.Recycler.reuse(FudgeCore.ComponentCamera);
            cmpCameraPick.mtxWorld.translation = _ray.origin;
            cmpCameraPick.mtxWorld.lookAt(FudgeCore.Vector3.SUM(_ray.origin, _ray.direction));
            cmpCameraPick.projectCentral(1, 0.001, FudgeCore.FIELD_OF_VIEW.DIAGONAL, _min, _max);
            let picks;
            if (_from[0] instanceof FudgeCore.Node)
                picks = FudgeCore.Render.pick(_from, cmpCameraPick);
            else
                picks = FudgeCore.Gizmos.pick(_from, cmpCameraPick);
            FudgeCore.Recycler.store(cmpCameraPick);
            return picks;
        }
        static pickCamera(_from, _cmpCamera, _posProjection) {
            let ray = new FudgeCore.Ray(new FudgeCore.Vector3(-_posProjection.x, _posProjection.y, 1));
            let length = ray.direction.magnitude;
            if (_cmpCamera.node) {
                let mtxCamera = FudgeCore.Matrix4x4.PRODUCT(_cmpCamera.node.mtxWorld, _cmpCamera.mtxPivot);
                ray.transform(mtxCamera);
                FudgeCore.Recycler.store(mtxCamera);
            }
            else
                ray.transform(_cmpCamera.mtxPivot);
            let picks = Picker.pickRay(_from, ray, length * _cmpCamera.near, length * _cmpCamera.far);
            return picks;
        }
        static pickViewport(_viewport, _posClient) {
            let posProjection = _viewport.pointClientToProjection(_posClient);
            let nodes = Array.from(_viewport.getBranch().getIterator(true));
            let picks = Picker.pickCamera(nodes, _viewport.camera, posProjection);
            if (_viewport.gizmosEnabled)
                picks = picks.concat(Picker.pickCamera(_viewport.getGizmos(nodes), _viewport.camera, posProjection));
            return picks;
        }
    }
    FudgeCore.Picker = Picker;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Ray {
        constructor(_direction = FudgeCore.Vector3.Z(1), _origin = FudgeCore.Vector3.ZERO(), _length = 1) {
            this.origin = _origin;
            this.direction = _direction;
            this.length = _length;
        }
        intersectPlane(_origin, _normal) {
            let difference = FudgeCore.Vector3.DIFFERENCE(_origin, this.origin);
            let factor = FudgeCore.Vector3.DOT(difference, _normal) / FudgeCore.Vector3.DOT(this.direction, _normal);
            let intersect = FudgeCore.Vector3.SUM(this.origin, FudgeCore.Vector3.SCALE(this.direction, factor));
            return intersect;
        }
        intersectFacePlane(_face) {
            return this.intersectPlane(_face.getPosition(0), _face.normal);
        }
        getDistance(_target) {
            let originToTarget = FudgeCore.Vector3.DIFFERENCE(_target, this.origin);
            let raySection = FudgeCore.Vector3.NORMALIZATION(this.direction, 1);
            let projectedLength = FudgeCore.Vector3.DOT(originToTarget, raySection);
            raySection.scale(projectedLength);
            raySection.add(this.origin);
            let distance = FudgeCore.Vector3.DIFFERENCE(_target, raySection);
            return distance;
        }
        transform(_mtxTransform) {
            this.origin.transform(_mtxTransform);
            this.direction.transform(_mtxTransform, false);
        }
        toString() {
            return `origin: ${this.origin.toString()}, direction: ${this.direction.toString()}, length: ${this.length.toPrecision(5)}`;
        }
    }
    FudgeCore.Ray = Ray;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Gizmos {
        static { this.alphaOccluded = 0.3; }
        static { this.arrayBuffer = FudgeCore.RenderWebGL.assert(FudgeCore.RenderWebGL.getRenderingContext().createBuffer()); }
        static { this.posIcons = new Set(); }
        static #camera;
        static #meshes = {};
        static #mapMeshToWireBuffers = new WeakMap();
        static #colorData = new Float32Array(4);
        static get wireCircle() {
            const radius = 0.5;
            const segments = 45;
            const circle = new Array(segments).fill(null).map(() => FudgeCore.Recycler.get(FudgeCore.Vector3));
            for (let i = 0; i < segments; i++) {
                const angle = (i / segments) * 2 * Math.PI;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                circle[i].set(x, y, 0);
            }
            const lines = [];
            for (let i = 0; i < segments; i++)
                lines.push(circle[i], circle[(i + 1) % segments]);
            Reflect.defineProperty(Gizmos, "wireCircle", { value: lines });
            return Gizmos.wireCircle;
        }
        static get wireSphere() {
            let lines = Gizmos.wireCircle.concat();
            let mtxRotation = FudgeCore.Matrix4x4.ROTATION_X(90);
            lines.push(...Gizmos.wireCircle.map((_point) => FudgeCore.Vector3.TRANSFORMATION(_point, mtxRotation)));
            mtxRotation.rotateY(90);
            lines.push(...Gizmos.wireCircle.map((_point) => FudgeCore.Vector3.TRANSFORMATION(_point, mtxRotation)));
            Reflect.defineProperty(Gizmos, "wireSphere", { value: lines });
            return Gizmos.wireSphere;
        }
        static get wireCone() {
            const radius = 0.5;
            const height = 1;
            const apex = FudgeCore.Vector3.ZERO();
            const quad = [
                new FudgeCore.Vector3(radius, 0, height),
                new FudgeCore.Vector3(-radius, 0, height),
                new FudgeCore.Vector3(0, radius, height),
                new FudgeCore.Vector3(0, -radius, height)
            ];
            let lines = Gizmos.wireCircle.map((_point) => FudgeCore.Vector3.TRANSFORMATION(_point, FudgeCore.Matrix4x4.TRANSLATION(FudgeCore.Vector3.Z(1))));
            lines.push(...[apex, quad[0], apex, quad[1], apex, quad[2], apex, quad[3]]);
            Reflect.defineProperty(Gizmos, "wireCone", { value: lines });
            return Gizmos.wireCone;
        }
        static get wireCube() {
            const halfSize = 0.5;
            const cube = [
                new FudgeCore.Vector3(halfSize, halfSize, halfSize), new FudgeCore.Vector3(-halfSize, halfSize, halfSize),
                new FudgeCore.Vector3(-halfSize, -halfSize, halfSize), new FudgeCore.Vector3(halfSize, -halfSize, halfSize),
                new FudgeCore.Vector3(halfSize, halfSize, -halfSize), new FudgeCore.Vector3(-halfSize, halfSize, -halfSize),
                new FudgeCore.Vector3(-halfSize, -halfSize, -halfSize), new FudgeCore.Vector3(halfSize, -halfSize, -halfSize)
            ];
            const lines = [
                cube[0], cube[1], cube[1], cube[2], cube[2], cube[3], cube[3], cube[0],
                cube[4], cube[5], cube[5], cube[6], cube[6], cube[7], cube[7], cube[4],
                cube[0], cube[4], cube[1], cube[5], cube[2], cube[6], cube[3], cube[7]
            ];
            Reflect.defineProperty(Gizmos, "wireCube", { value: lines });
            return Gizmos.wireCube;
        }
        static get #picking() {
            return this.pickId != null;
        }
        static draw(_gizmos, _cmpCamera, _selected) {
            for (const gizmo of _gizmos)
                if (gizmo.node)
                    Reflect.set(gizmo.node, "zCamera", _cmpCamera.pointWorldToClip(gizmo.node.mtxWorld.translation).z);
            _gizmos = _gizmos.sort((_a, _b) => (_b.node ? Reflect.get(_b.node, "zCamera") : 2) -
                (_a.node ? Reflect.get(_a.node, "zCamera") : 2));
            Gizmos.#camera = _cmpCamera;
            Gizmos.posIcons.clear();
            FudgeCore.RenderWebGLComponentCamera.useRenderbuffer(_cmpCamera);
            for (const gizmo of _gizmos) {
                gizmo.drawGizmos?.(_cmpCamera, Gizmos.#picking);
                if (_selected?.includes(gizmo.node))
                    gizmo.drawGizmosSelected?.(_cmpCamera);
            }
        }
        static pick(_gizmos, _cmpCamera) {
            return FudgeCore.RenderWebGLPicking.pickFrom(_gizmos, _cmpCamera, Gizmos.pickGizmos);
        }
        static drawWireFrustum(_aspect, _fov, _near, _far, _direction, _mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            const f = Math.tan(FudgeCore.Calc.deg2rad * _fov / 2);
            let scaleX = f;
            let scaleY = f;
            switch (_direction) {
                case FudgeCore.FIELD_OF_VIEW.HORIZONTAL:
                    scaleY = f / _aspect;
                    break;
                case FudgeCore.FIELD_OF_VIEW.VERTICAL:
                    scaleX = f * _aspect;
                    break;
                case FudgeCore.FIELD_OF_VIEW.DIAGONAL:
                    const diagonalAspect = Math.sqrt(_aspect);
                    scaleX = f * diagonalAspect;
                    scaleY = f / diagonalAspect;
                    break;
            }
            const nearX = _near * scaleX;
            const nearY = _near * scaleY;
            const farX = _far * scaleX;
            const farY = _far * scaleY;
            const frustum = new Array(8).fill(null).map(() => FudgeCore.Recycler.get(FudgeCore.Vector3));
            frustum[0].set(-nearX, nearY, _near);
            frustum[1].set(nearX, nearY, _near);
            frustum[2].set(nearX, -nearY, _near);
            frustum[3].set(-nearX, -nearY, _near);
            frustum[4].set(-farX, farY, _far);
            frustum[5].set(farX, farY, _far);
            frustum[6].set(farX, -farY, _far);
            frustum[7].set(-farX, -farY, _far);
            Gizmos.drawLines([
                frustum[0], frustum[1], frustum[1], frustum[2], frustum[2], frustum[3], frustum[3], frustum[0],
                frustum[4], frustum[5], frustum[5], frustum[6], frustum[6], frustum[7], frustum[7], frustum[4],
                frustum[0], frustum[4], frustum[1], frustum[5], frustum[2], frustum[6], frustum[3], frustum[7]
            ], _mtxWorld, _color, _alphaOccluded);
            FudgeCore.Recycler.store(frustum);
        }
        static drawWireCube(_mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            Gizmos.drawLines(Gizmos.wireCube, _mtxWorld, _color, _alphaOccluded);
        }
        static drawWireSphere(_mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            let mtxWorld = _mtxWorld.clone;
            Gizmos.drawLines(Gizmos.wireSphere, mtxWorld, _color, _alphaOccluded);
            mtxWorld.lookAt(Gizmos.#camera.mtxWorld.translation);
            Gizmos.drawWireCircle(mtxWorld, _color, _alphaOccluded);
            FudgeCore.Recycler.store(mtxWorld);
        }
        static drawWireCone(_mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            Gizmos.drawLines(Gizmos.wireCone, _mtxWorld, _color, _alphaOccluded);
        }
        static drawWireCircle(_mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            Gizmos.drawLines(Gizmos.wireCircle, _mtxWorld, _color, _alphaOccluded);
        }
        static drawLines(_vertices, _mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            const shader = Gizmos.#picking ? FudgeCore.ShaderPick : FudgeCore.ShaderGizmo;
            shader.useProgram();
            const lineData = new Float32Array(_vertices.length * 3);
            for (let i = 0; i < _vertices.length; i++) {
                const point = _vertices[i];
                point.toArray(lineData, i * 3);
            }
            crc3.bindVertexArray(null);
            crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, Gizmos.arrayBuffer);
            crc3.enableVertexAttribArray(FudgeCore.SHADER_ATTRIBUTE.POSITION);
            crc3.vertexAttribPointer(FudgeCore.SHADER_ATTRIBUTE.POSITION, 3, WebGL2RenderingContext.FLOAT, false, 0, 0);
            Gizmos.bufferMatrix(shader, _mtxWorld);
            crc3.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, lineData, WebGL2RenderingContext.DYNAMIC_DRAW);
            Gizmos.drawGizmos(shader, Gizmos.drawArrays, _vertices.length, _color, _alphaOccluded);
        }
        static drawWireMesh(_mesh, _mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            const shader = Gizmos.#picking ? FudgeCore.ShaderPick : FudgeCore.ShaderGizmo;
            shader.useProgram();
            const wireBuffers = Gizmos.#mapMeshToWireBuffers.get(_mesh) ?? {};
            if (!Gizmos.#mapMeshToWireBuffers.has(_mesh)) {
                const indices = [];
                const renderBuffers = _mesh.getRenderBuffers();
                const renderMesh = _mesh.renderMesh;
                for (let i = 0; i < renderMesh.indices.length; i += 3) {
                    const a = renderMesh.indices[i];
                    const b = renderMesh.indices[i + 1];
                    const c = renderMesh.indices[i + 2];
                    indices.push(a, b, b, c, c, a);
                }
                wireBuffers.vao = FudgeCore.RenderWebGL.assert(crc3.createVertexArray());
                wireBuffers.indices = FudgeCore.RenderWebGL.assert(FudgeCore.RenderWebGL.getRenderingContext().createBuffer());
                wireBuffers.positions = renderBuffers.positions;
                wireBuffers.nIndices = indices.length;
                Gizmos.#mapMeshToWireBuffers.set(_mesh, wireBuffers);
                crc3.bindVertexArray(wireBuffers.vao);
                crc3.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, wireBuffers.indices);
                crc3.bufferData(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), WebGL2RenderingContext.STATIC_DRAW);
                crc3.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, renderBuffers.positions);
                crc3.enableVertexAttribArray(FudgeCore.SHADER_ATTRIBUTE.POSITION);
                crc3.vertexAttribPointer(FudgeCore.SHADER_ATTRIBUTE.POSITION, 3, WebGL2RenderingContext.FLOAT, false, 0, 0);
            }
            Gizmos.bufferMatrix(shader, _mtxWorld);
            crc3.bindVertexArray(wireBuffers.vao);
            Gizmos.drawGizmos(shader, Gizmos.drawElementsLines, wireBuffers.nIndices, _color, _alphaOccluded);
        }
        static drawArrow(_position, _color, _forward, _up, _length, _width, _size, _head = FudgeCore.MeshPyramid, _alphaOccluded = Gizmos.alphaOccluded) {
            const scaling = FudgeCore.Recycler.reuse(FudgeCore.Vector3).set(_width, _width, _length - _size);
            const mtxWorld = FudgeCore.Matrix4x4.COMPOSITION(_position);
            mtxWorld.scaling = scaling;
            mtxWorld.lookIn(_forward, _up);
            mtxWorld.translateZ(0.5);
            Gizmos.drawCube(mtxWorld, _color, _alphaOccluded);
            mtxWorld.translateZ(0.5);
            if (_head == FudgeCore.MeshPyramid) {
                const widthHead = _size / 2;
                mtxWorld.scaling = scaling.set(widthHead, widthHead, _size);
                mtxWorld.rotateX(90);
            }
            else {
                mtxWorld.scaling = scaling.set(_size, _size, _size);
                mtxWorld.translateZ(0.5);
            }
            Gizmos.drawMesh(Gizmos.getMesh(_head), mtxWorld, _color, _alphaOccluded);
            FudgeCore.Recycler.store(mtxWorld);
            FudgeCore.Recycler.store(scaling);
        }
        static drawCube(_mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            Gizmos.drawMesh(Gizmos.getMesh(FudgeCore.MeshCube), _mtxWorld, _color, _alphaOccluded);
        }
        static drawSphere(_mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            Gizmos.drawMesh(Gizmos.getMesh(FudgeCore.MeshSphere), _mtxWorld, _color, _alphaOccluded);
        }
        static drawQuad(_mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            Gizmos.drawMesh(Gizmos.getMesh(FudgeCore.MeshQuad), _mtxWorld, _color, _alphaOccluded);
        }
        static drawSprite(_mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            Gizmos.drawMesh(Gizmos.getMesh(FudgeCore.MeshSprite), _mtxWorld, _color, _alphaOccluded);
        }
        static drawPyramid(_mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            Gizmos.drawMesh(Gizmos.getMesh(FudgeCore.MeshPyramid), _mtxWorld, _color, _alphaOccluded);
        }
        static drawMesh(_mesh, _mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            const shader = Gizmos.#picking ? FudgeCore.ShaderPick : FudgeCore.ShaderGizmo;
            shader.useProgram();
            FudgeCore.RenderWebGL.useNodeUniforms(shader, _mtxWorld, null, null, Gizmos.pickId);
            const renderBuffers = _mesh.useRenderBuffers();
            Gizmos.drawGizmos(shader, Gizmos.drawElementsTrianlges, renderBuffers.nIndices, _color, _alphaOccluded);
        }
        static drawIcon(_texture, _mtxWorld, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            let position = _mtxWorld.translation.toString();
            if (Gizmos.posIcons.has(position))
                return;
            Gizmos.posIcons.add(position);
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            const shader = Gizmos.#picking ? FudgeCore.ShaderPickTextured : FudgeCore.ShaderGizmoTextured;
            shader.useProgram();
            let mtxWorld = _mtxWorld.clone;
            let color = _color.clone;
            let back = Gizmos.#camera.mtxWorld.getForward().negate();
            let up = Gizmos.#camera.mtxWorld.getUp();
            mtxWorld.lookIn(back, up);
            let distance = FudgeCore.Vector3.DIFFERENCE(Gizmos.#camera.mtxWorld.translation, mtxWorld.translation).magnitude;
            let fadeFar = 4;
            let fadeNear = 1.5;
            if (distance > 0 && distance < fadeFar) {
                distance = (distance - fadeNear) / (fadeFar - fadeNear);
                color.a = FudgeCore.Calc.lerp(0, color.a, distance);
            }
            _texture.useRenderData(FudgeCore.TEXTURE_LOCATION.COLOR.UNIT);
            crc3.uniform1i(shader.uniforms[FudgeCore.TEXTURE_LOCATION.COLOR.UNIFORM], FudgeCore.TEXTURE_LOCATION.COLOR.INDEX);
            FudgeCore.RenderWebGL.useNodeUniforms(shader, mtxWorld, null, null, Gizmos.pickId);
            const renderBuffers = Gizmos.getMesh(FudgeCore.MeshQuad).useRenderBuffers();
            Gizmos.drawGizmos(shader, Gizmos.drawElementsTrianlges, renderBuffers.nIndices, color, _alphaOccluded);
            FudgeCore.Recycler.store(mtxWorld);
            FudgeCore.Recycler.store(back);
            FudgeCore.Recycler.store(up);
            FudgeCore.Recycler.store(color);
        }
        static bufferColor(_shader, _color) {
            FudgeCore.RenderWebGL.getRenderingContext().uniform4fv(_shader.uniforms["u_vctColor"], _color.toArray(Gizmos.#colorData));
        }
        static bufferMatrix(_shader, _mtxWorld) {
            FudgeCore.RenderWebGL.getRenderingContext().uniformMatrix4fv(_shader.uniforms["u_mtxMeshToWorld"], false, _mtxWorld.getArray());
        }
        static drawGizmos(_shader, _draw, _count, _color, _alphaOccluded = Gizmos.alphaOccluded) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            if (_alphaOccluded > 0) {
                let color = _color.clone;
                color.a *= _alphaOccluded;
                crc3.depthFunc(WebGL2RenderingContext.GEQUAL);
                crc3.depthMask(false);
                Gizmos.bufferColor(_shader, color);
                _draw(_count);
                crc3.depthFunc(WebGL2RenderingContext.LESS);
                crc3.depthMask(true);
                FudgeCore.Recycler.store(color);
            }
            Gizmos.bufferColor(_shader, _color);
            _draw(_count);
        }
        static drawElementsTrianlges(_count) {
            FudgeCore.RenderWebGL.getRenderingContext().drawElements(WebGL2RenderingContext.TRIANGLES, _count, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
        }
        static drawElementsLines(_count) {
            FudgeCore.RenderWebGL.getRenderingContext().drawElements(WebGL2RenderingContext.LINES, _count, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
        }
        static drawArrays(_count) {
            FudgeCore.RenderWebGL.getRenderingContext().drawArrays(WebGL2RenderingContext.LINES, 0, _count);
        }
        static getMesh(_constructor) {
            let key = _constructor.name;
            let mesh = Gizmos.#meshes[key];
            if (mesh)
                return mesh;
            mesh = new _constructor(key);
            FudgeCore.Project.deregister(mesh);
            Gizmos.#meshes[key] = mesh;
            return mesh;
        }
        static pickGizmos(_gizmos, _cmpCamera) {
            const crc3 = FudgeCore.RenderWebGL.getRenderingContext();
            crc3.uniformMatrix3fv(FudgeCore.ShaderPickTextured.uniforms["u_mtxPivot"], false, FudgeCore.Matrix3x3.IDENTITY().getArray());
            Gizmos.#camera = _cmpCamera;
            Gizmos.posIcons.clear();
            let picks = [];
            for (let gizmo of _gizmos) {
                if (!gizmo.drawGizmos)
                    continue;
                Gizmos.pickId = picks.length;
                gizmo.drawGizmos(_cmpCamera, Gizmos.#picking);
                let pick = new FudgeCore.Pick(gizmo.node);
                pick.gizmo = gizmo;
                picks.push(pick);
            }
            Gizmos.pickId = null;
            return picks;
        }
    }
    FudgeCore.Gizmos = Gizmos;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Render extends FudgeCore.RenderWebGL {
        static { this.rectClip = new FudgeCore.Rectangle(-1, 1, 2, -2); }
        static { this.nodesPhysics = new FudgeCore.RecycableArray(); }
        static { this.componentsPick = new FudgeCore.RecycableArray(); }
        static { this.lights = new Map(); }
        static { this.nodesSimple = new FudgeCore.RecycableArray(); }
        static { this.nodesAlpha = new FudgeCore.RecycableArray(); }
        static { this.componentsSkeleton = new FudgeCore.RecycableArray(); }
        static #eventPrepare = FudgeCore.RecyclableEvent.get("renderPrepare");
        static #eventPrepareStart = FudgeCore.RecyclableEvent.get("renderPrepareStart");
        static #eventPrepareEnd = FudgeCore.RecyclableEvent.get("renderPrepareEnd");
        static #defaultRootNode = new FudgeCore.Node("Root");
        static #defaultOptions = {};
        static #mapNodeToParent = new WeakMap();
        static prepare(_branch, _options = Render.#defaultOptions, _recalculate = false) {
            Render.timestampUpdate = performance.now();
            Render.nodesSimple.reset();
            Render.nodesAlpha.reset();
            Render.nodesPhysics.reset();
            Render.componentsPick.reset();
            Render.componentsSkeleton.reset();
            for (const cmpLights of Render.lights.values())
                cmpLights.reset();
            FudgeCore.Node.resetRenderData();
            FudgeCore.Coat.resetRenderData();
            _branch.dispatchEvent(Render.#eventPrepareStart);
            this.prepareBranch(_branch, _options, _branch.getParent() ?? Render.#defaultRootNode, _recalculate);
            _branch.dispatchEvent(Render.#eventPrepareEnd);
            for (const cmpSkeleton of Render.componentsSkeleton)
                cmpSkeleton.updateRenderBuffer();
            FudgeCore.Node.updateRenderbuffer();
            FudgeCore.Coat.updateRenderbuffer();
            FudgeCore.ComponentLight.updateRenderbuffer(Render.lights);
        }
        static addLights(_cmpLights) {
            for (let cmpLight of _cmpLights) {
                if (!cmpLight.isActive)
                    continue;
                let type = cmpLight.lightType;
                let lightsOfType = Render.lights.get(type);
                if (!lightsOfType) {
                    lightsOfType = new FudgeCore.RecycableArray();
                    Render.lights.set(type, lightsOfType);
                }
                lightsOfType.push(cmpLight);
            }
        }
        static draw(_cmpCamera) {
            let nodesAlpha;
            if (Render.nodesAlpha.length > 0) {
                for (let node of Render.nodesAlpha)
                    Reflect.set(node, "zCamera", _cmpCamera.pointWorldToClip(node.getComponent(FudgeCore.ComponentMesh).mtxWorld.translation).z);
                nodesAlpha = Render.nodesAlpha.getSorted((_a, _b) => Reflect.get(_b, "zCamera") - Reflect.get(_a, "zCamera"));
            }
            Render.drawNodes(Render.nodesSimple, nodesAlpha ?? Render.nodesAlpha, _cmpCamera);
        }
        static prepareBranch(_branch, _options, _parent, _recalculate) {
            if (!_branch.isActive)
                return;
            _branch.nNodesInBranch = 1;
            _branch.radius = 0;
            _branch.timestampUpdate = Render.timestampUpdate;
            _branch.dispatchEventToTargetOnly(Render.#eventPrepare);
            const mtxWorldParent = _parent.mtxWorld;
            const mtxWorldBranch = _branch.mtxWorld;
            let previousParent = Render.#mapNodeToParent.get(_branch);
            if (_parent != previousParent) {
                Render.#mapNodeToParent.set(_branch, _parent);
                _recalculate = true;
            }
            const cmpTransform = _branch.getComponent(FudgeCore.ComponentTransform);
            if (cmpTransform?.isActive) {
                const mtxLocal = cmpTransform.mtxLocal;
                if ((_recalculate ||= mtxLocal.modified)) {
                    FudgeCore.Matrix4x4.PRODUCT(mtxWorldParent, mtxLocal, mtxWorldBranch);
                    mtxLocal.modified = false;
                }
            }
            else
                mtxWorldBranch.copy(mtxWorldParent);
            const cmpRigidbody = _branch.getComponent(FudgeCore.ComponentRigidbody);
            if (cmpRigidbody?.isActive) {
                Render.nodesPhysics.push(_branch);
                if (!_options?.ignorePhysics)
                    this.transformByPhysics(_branch, cmpRigidbody);
            }
            const cmpPick = _branch.getComponent(FudgeCore.ComponentPick);
            if (cmpPick?.isActive) {
                Render.componentsPick.push(cmpPick);
            }
            const cmpLights = _branch.getComponents(FudgeCore.ComponentLight);
            Render.addLights(cmpLights);
            const cmpMesh = _branch.getComponent(FudgeCore.ComponentMesh);
            const cmpMaterial = _branch.getComponent(FudgeCore.ComponentMaterial);
            if (cmpMesh?.isActive && cmpMaterial?.isActive) {
                if (cmpMesh.mtxPivot.modified || _recalculate) {
                    FudgeCore.Matrix4x4.PRODUCT(mtxWorldBranch, cmpMesh.mtxPivot, cmpMesh.mtxWorld);
                    cmpMesh.mtxPivot.modified = false;
                }
                const cmpFaceCamera = _branch.getComponent(FudgeCore.ComponentFaceCamera);
                const cmpParticleSystem = _branch.getComponent(FudgeCore.ComponentParticleSystem);
                _branch.updateRenderData(cmpMesh, cmpMaterial, cmpFaceCamera, cmpParticleSystem);
                _branch.radius = cmpMesh.radius;
                if (cmpMaterial.sortForAlpha || _branch.getComponent(FudgeCore.ComponentText))
                    Render.nodesAlpha.push(_branch);
                else
                    Render.nodesSimple.push(_branch);
                const material = cmpMaterial.material;
                if (material?.timestampUpdate < Render.timestampUpdate) {
                    material.timestampUpdate = Render.timestampUpdate;
                    material.coat.updateRenderData();
                }
            }
            const cmpCamera = _branch.getComponent(FudgeCore.ComponentCamera) ?? _branch.getComponent(FudgeCore.ComponentVRDevice);
            if (cmpCamera && cmpCamera.isActive && (cmpCamera.mtxPivot.modified || _recalculate)) {
                FudgeCore.Matrix4x4.PRODUCT(mtxWorldBranch, cmpCamera.mtxPivot, cmpCamera.mtxWorld);
                cmpCamera.mtxPivot.modified = false;
            }
            const cmpSkeletons = _branch.getComponents(FudgeCore.ComponentSkeleton);
            for (let cmpSkeleton of cmpSkeletons)
                if (cmpSkeleton?.isActive)
                    Render.componentsSkeleton.push(cmpSkeleton);
            for (let child of _branch.getChildren()) {
                Render.prepareBranch(child, _options, _branch, _recalculate);
                _branch.nNodesInBranch += child.nNodesInBranch;
                _branch.radius = Math.max(_branch.radius, (child.getComponent(FudgeCore.ComponentMesh)?.mtxWorld.translation ?? child.mtxWorld.translation).getDistance(mtxWorldBranch.translation) + child.radius);
            }
        }
        static transformByPhysics(_node, _cmpRigidbody) {
            if (!_cmpRigidbody.isInitialized)
                _cmpRigidbody.initialize();
            if (!FudgeCore.Physics.getBodyList().length)
                return;
            if (!_node.mtxLocal) {
                throw (new Error("ComponentRigidbody requires ComponentTransform at the same Node"));
            }
            if (_cmpRigidbody.typeBody == FudgeCore.BODY_TYPE.KINEMATIC || FudgeCore.Project.mode == FudgeCore.MODE.EDITOR) {
                let mtxPivotWorld = FudgeCore.Matrix4x4.PRODUCT(_node.mtxWorld, _cmpRigidbody.mtxPivotUnscaled);
                _cmpRigidbody.setPosition(mtxPivotWorld.translation);
                _cmpRigidbody.setRotation(mtxPivotWorld.rotation);
                FudgeCore.Recycler.store(mtxPivotWorld);
                return;
            }
            let mtxWorld = FudgeCore.Matrix4x4.COMPOSITION(_cmpRigidbody.getPosition(), _cmpRigidbody.getRotation());
            mtxWorld.multiply(_cmpRigidbody.mtxPivotInverse);
            _node.mtxWorld.translation = mtxWorld.translation;
            _node.mtxWorld.rotation = mtxWorld.rotation;
            let parent = _node.getParent();
            let mtxLocal = parent ?
                FudgeCore.Matrix4x4.RELATIVE(_node.mtxWorld, parent.mtxWorld, parent.mtxWorldInverse) :
                _node.mtxWorld.clone;
            _node.mtxLocal.copy(mtxLocal);
            FudgeCore.Recycler.store(mtxWorld);
            FudgeCore.Recycler.store(mtxLocal);
        }
    }
    FudgeCore.Render = Render;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class RenderMesh {
        #indices;
        #positions;
        #normals;
        #textureUVs;
        #colors;
        #tangents;
        #bones;
        #weights;
        constructor(_mesh) {
            this.mesh = _mesh;
        }
        get positions() {
            if (this.#positions == null) {
                const vertices = this.mesh.vertices;
                const positions = new Float32Array(vertices.length * 3);
                for (let i = 0; i < vertices.length; i++)
                    vertices.position(i).toArray(positions, i * 3);
                this.#positions = positions;
            }
            return this.#positions;
        }
        set positions(_vertices) {
            this.#positions = _vertices;
        }
        get indices() {
            return this.#indices || (this.#indices = new Uint16Array(this.mesh.faces.flatMap((_face) => _face.indices)));
        }
        set indices(_indices) {
            this.#indices = _indices;
        }
        get normals() {
            if (this.#normals == null) {
                const vertices = this.mesh.vertices;
                vertices.forEach(_vertex => _vertex.normal.set(0, 0, 0));
                for (let face of this.mesh.faces)
                    face.indices.forEach((_iVertex, _iFaceVertex) => {
                        vertices.normal(_iVertex).add(FudgeCore.Vector3.SCALE(face.normalUnscaled, face.angles[_iFaceVertex]));
                    });
                vertices.forEach(_vertex => {
                    if (_vertex.normal.magnitudeSquared > 0)
                        _vertex.normal.normalize();
                });
                const normals = new Float32Array(vertices.length * 3);
                for (let i = 0; i < vertices.length; i++)
                    vertices.normal(i).toArray(normals, i * 3);
                this.#normals = normals;
            }
            return this.#normals;
        }
        set normals(_normals) {
            this.#normals = _normals;
        }
        get tangents() {
            const vertices = this.mesh.vertices;
            if (this.#tangents == null) {
                if (vertices.some(_vertex => !_vertex.uv)) {
                    this.#tangents = new Float32Array();
                    return this.#tangents;
                }
                if (vertices.some(_vertex => !_vertex.tangent)) {
                    const tangents = new Array(vertices.length);
                    const bitangents = new Array(vertices.length);
                    for (let i = 0; i < tangents.length; i++) {
                        tangents[i] = FudgeCore.Vector3.ZERO();
                        bitangents[i] = FudgeCore.Vector3.ZERO();
                    }
                    for (let face of this.mesh.faces) {
                        let i0 = face.indices[0];
                        let i1 = face.indices[1];
                        let i2 = face.indices[2];
                        let v0 = vertices.position(i0);
                        let v1 = vertices.position(i1);
                        let v2 = vertices.position(i2);
                        let uv0 = vertices.uv(i0);
                        let uv1 = vertices.uv(i1);
                        let uv2 = vertices.uv(i2);
                        let deltaPos0 = FudgeCore.Vector3.DIFFERENCE(v1, v0);
                        let deltaPos1 = FudgeCore.Vector3.DIFFERENCE(v2, v0);
                        let deltaUV0 = FudgeCore.Vector2.DIFFERENCE(uv1, uv0);
                        let deltaUV1 = FudgeCore.Vector2.DIFFERENCE(uv2, uv0);
                        let r = 1 / FudgeCore.Vector2.CROSS(deltaUV0, deltaUV1);
                        let faceTangent = FudgeCore.Vector3.SCALE(FudgeCore.Vector3.DIFFERENCE(FudgeCore.Vector3.SCALE(deltaPos0, deltaUV1.y), FudgeCore.Vector3.SCALE(deltaPos1, deltaUV0.y)), r);
                        let faceBitangent = FudgeCore.Vector3.SCALE(FudgeCore.Vector3.DIFFERENCE(FudgeCore.Vector3.SCALE(deltaPos1, -deltaUV0.x), FudgeCore.Vector3.SCALE(deltaPos0, -deltaUV1.x)), r);
                        tangents[i0].add(FudgeCore.Vector3.SCALE(faceTangent, face.angles[0]));
                        tangents[i1].add(FudgeCore.Vector3.SCALE(faceTangent, face.angles[1]));
                        tangents[i2].add(FudgeCore.Vector3.SCALE(faceTangent, face.angles[2]));
                        bitangents[i0].add(FudgeCore.Vector3.SCALE(faceBitangent, face.angles[0]));
                        bitangents[i1].add(FudgeCore.Vector3.SCALE(faceBitangent, face.angles[1]));
                        bitangents[i2].add(FudgeCore.Vector3.SCALE(faceBitangent, face.angles[2]));
                    }
                    vertices.forEach((_vertex, _index) => {
                        let normal = vertices.normal(_index);
                        let tangent = tangents[_index];
                        let bitangent = bitangents[_index];
                        tangent.add(FudgeCore.Vector3.SCALE(normal, -FudgeCore.Vector3.DOT(normal, tangent)));
                        if (tangent.magnitudeSquared > 0)
                            tangent.normalize();
                        let handedness = (FudgeCore.Vector3.DOT(FudgeCore.Vector3.CROSS(normal, tangent), bitangent) < 0) ? -1 : 1;
                        _vertex.tangent = new FudgeCore.Vector4(tangent.x, tangent.y, tangent.z, handedness);
                    });
                }
                const tangents = new Float32Array(vertices.length * 4);
                for (let i = 0; i < vertices.length; i++)
                    vertices.tangent(i).toArray(tangents, i * 4);
                this.#tangents = tangents;
            }
            return this.#tangents;
        }
        set tangents(_tangents) {
            this.#tangents = _tangents;
        }
        get textureUVs() {
            if (this.#textureUVs == null) {
                const vertices = this.mesh.vertices;
                if (vertices.some(_vertex => !_vertex.uv)) {
                    this.#textureUVs = new Float32Array();
                    return this.#textureUVs;
                }
                const textureUVs = new Float32Array(vertices.length * 2);
                for (let i = 0; i < vertices.length; i++)
                    vertices.uv(i).toArray(textureUVs, i * 2);
                this.#textureUVs = textureUVs;
            }
            return this.#textureUVs;
        }
        set textureUVs(_textureUVs) {
            this.#textureUVs = _textureUVs;
        }
        get colors() {
            if (this.#colors == null) {
                const vertices = this.mesh.vertices;
                const colors = new Float32Array(vertices.length * 4);
                if (vertices.some(_vertex => !_vertex.color))
                    colors.fill(1);
                else
                    for (let i = 0; i < vertices.length; i++)
                        vertices.color(i).toArray(colors, i * 4);
                this.#colors = colors;
            }
            return this.#colors;
        }
        set colors(_colors) {
            this.#colors = _colors;
        }
        get bones() {
            return this.#bones || (this.#bones = this.mesh.vertices.some(_vertex => _vertex.bones) ?
                new Uint8Array(this.mesh.vertices.flatMap((_vertex, _index) => {
                    const bones = this.mesh.vertices.bones(_index);
                    return [bones?.[0]?.index || 0, bones?.[1]?.index || 0, bones?.[2]?.index || 0, bones?.[3]?.index || 0];
                })) :
                undefined);
        }
        set bones(_iBones) {
            this.#bones = _iBones;
        }
        get weights() {
            return this.#weights || (this.#weights = this.mesh.vertices.some(_vertex => _vertex.bones) ?
                new Float32Array(this.mesh.vertices.flatMap((_vertex, _index) => {
                    const bones = this.mesh.vertices.bones(_index);
                    return [bones?.[0]?.weight || 0, bones?.[1]?.weight || 0, bones?.[2]?.weight || 0, bones?.[3]?.weight || 0];
                })) :
                undefined);
        }
        set weights(_weights) {
            this.#weights = _weights;
        }
        clear() {
            this.#positions = null;
            this.#indices = null;
            this.#textureUVs = null;
            this.#normals = null;
            this.#colors = null;
            this.#tangents = null;
            this.#bones = null;
            this.#weights = null;
        }
    }
    FudgeCore.RenderMesh = RenderMesh;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Viewport extends FudgeCore.EventTargetUnified {
        constructor() {
            super(...arguments);
            this.name = "Viewport";
            this.camera = null;
            this.frameClientToCanvas = new FudgeCore.FramingScaled();
            this.frameCanvasToDestination = new FudgeCore.FramingComplex();
            this.frameDestinationToSource = new FudgeCore.FramingScaled();
            this.frameSourceToRender = new FudgeCore.FramingScaled();
            this.adjustingFrames = true;
            this.adjustingCamera = true;
            this.physicsDebugMode = FudgeCore.PHYSICS_DEBUGMODE.NONE;
            this.gizmosEnabled = false;
            this.gizmosFilter = Object.fromEntries(FudgeCore.Component.subclasses
                .filter((_class) => (_class.prototype).drawGizmos || (_class.prototype).drawGizmosSelected)
                .map((_class) => [_class.name, true]));
            this.componentsPick = new FudgeCore.RecycableArray();
            this.#branch = null;
            this.#crc2 = null;
            this.#canvas = null;
            this.#rectCanvas = FudgeCore.Rectangle.GET(0, 0, 0, 0);
            this.#rectClient = FudgeCore.Rectangle.GET(0, 0, 0, 0);
            this.#canvasResizeObserver = new ResizeObserver(() => {
                this.#rectClient.width = this.#canvas.clientWidth;
                this.#rectClient.height = this.#canvas.clientHeight;
            });
        }
        #branch;
        #crc2;
        #canvas;
        #rectCanvas;
        #rectClient;
        #canvasResizeObserver;
        get hasFocus() {
            return (Viewport.focus == this);
        }
        get canvas() {
            return this.#canvas;
        }
        get context() {
            return this.#crc2;
        }
        get rectCanvas() {
            return this.#rectCanvas;
        }
        get rectClient() {
            return this.#rectClient;
        }
        initialize(_name, _branch, _camera, _canvas) {
            this.name = _name;
            this.camera = _camera;
            this.#canvas = _canvas;
            this.#crc2 = _canvas.getContext("2d");
            this.#crc2.imageSmoothingEnabled = false;
            this.#canvas.tabIndex = 0;
            this.#rectCanvas.width = _canvas.width;
            this.#rectCanvas.height = _canvas.height;
            this.#rectClient.width = _canvas.clientWidth;
            this.#rectClient.height = _canvas.clientHeight;
            this.rectSource = FudgeCore.Render.getCanvasRectangle().clone;
            this.rectDestination = FudgeCore.Rectangle.GET(0, 0, this.#canvas.clientWidth, this.#canvas.clientHeight);
            this.#canvasResizeObserver.disconnect();
            this.#canvasResizeObserver.observe(this.#canvas);
            this.setBranch(_branch);
        }
        disconnect() {
            this.#canvasResizeObserver.disconnect();
        }
        getCanvasRectangle() {
            return FudgeCore.Rectangle.GET(0, 0, this.#canvas.width, this.#canvas.height);
        }
        getClientRectangle() {
            return FudgeCore.Rectangle.GET(0, 0, this.#canvas.clientWidth, this.#canvas.clientHeight);
        }
        setBranch(_branch) {
            if (_branch) {
                const event = FudgeCore.RecyclableEvent.get("attachBranch");
                _branch.broadcastEvent(event);
                FudgeCore.Recycler.store(event);
            }
            this.#branch = _branch;
        }
        getBranch() {
            return this.#branch;
        }
        draw(_prepareBranch = true) {
            this.prepare(_prepareBranch);
            FudgeCore.Render.resetFramebuffer();
            FudgeCore.Render.clear(this.camera.clrBackground);
            if (this.physicsDebugMode != FudgeCore.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY) {
                FudgeCore.Render.draw(this.camera);
                if (this.gizmosEnabled)
                    FudgeCore.Gizmos.draw(this.getGizmos(), this.camera, this.gizmosSelected);
            }
            if (this.physicsDebugMode != FudgeCore.PHYSICS_DEBUGMODE.NONE) {
                FudgeCore.Physics.draw(this.camera, this.physicsDebugMode);
            }
            const eventRenderEnd = FudgeCore.RecyclableEvent.get("renderEnd");
            this.dispatchEvent(eventRenderEnd);
            FudgeCore.RecyclableEvent.store(eventRenderEnd);
            this.#crc2.drawImage(FudgeCore.Render.getCanvas(), this.rectSource.x, this.rectSource.y, this.rectSource.width, this.rectSource.height, this.rectDestination.x, this.rectDestination.y, this.rectDestination.width, this.rectDestination.height);
        }
        prepare(_prepareBranch = true) {
            if (!this.#branch)
                return;
            if (!this.camera.isActive)
                return;
            if (!this.camera.node)
                this.camera.mtxWorld.copy(this.camera.mtxPivot);
            if (this.adjustingFrames)
                this.adjustFrames();
            if (this.adjustingCamera)
                this.adjustCamera();
            if (_prepareBranch)
                this.prepareBranch();
        }
        prepareBranch() {
            const eventPrepareStart = FudgeCore.RecyclableEvent.get("renderPrepareStart");
            this.dispatchEvent(eventPrepareStart);
            FudgeCore.RecyclableEvent.store(eventPrepareStart);
            FudgeCore.Render.prepare(this.#branch);
            const eventPrepareEnd = FudgeCore.RecyclableEvent.get("renderPrepareEnd");
            this.dispatchEvent(eventPrepareEnd);
            FudgeCore.RecyclableEvent.store(eventPrepareEnd);
            this.componentsPick = FudgeCore.Render.componentsPick;
        }
        dispatchPointerEvent(_event) {
            let posClient = new FudgeCore.Vector2(_event.clientX, _event.clientY);
            let ray = this.getRayFromClient(posClient);
            let cameraPicks = [];
            let otherPicks = [];
            for (let cmpPick of this.componentsPick)
                if (cmpPick.pick == FudgeCore.PICK.CAMERA)
                    cameraPicks.push(cmpPick.node);
                else
                    otherPicks.push(cmpPick);
            if (cameraPicks.length) {
                let picks = FudgeCore.Picker.pickCamera(cameraPicks, this.camera, this.pointClientToProjection(posClient));
                for (let pick of picks) {
                    Reflect.set(_event, "pick", pick);
                    pick.node.dispatchEvent(_event);
                }
            }
            for (let cmpPick of otherPicks) {
                cmpPick.pickAndDispatch(ray, _event);
            }
        }
        adjustFrames() {
            const rectCanvas = this.frameClientToCanvas.getRect(this.#rectClient);
            if (this.#rectClient.width != this.#rectCanvas.width) {
                this.#rectCanvas.width = rectCanvas.width;
                this.#canvas.width = rectCanvas.width;
            }
            if (this.#rectClient.height != this.#rectCanvas.height) {
                this.#rectCanvas.height = rectCanvas.height;
                this.#canvas.height = rectCanvas.height;
            }
            this.frameCanvasToDestination.getRect(rectCanvas, this.rectDestination);
            this.frameDestinationToSource.getRect(this.rectDestination, this.rectSource);
            this.rectSource.x = this.rectSource.y = 0;
            const rectRender = this.frameSourceToRender.getRect(this.rectSource);
            FudgeCore.Render.setRenderRectangle(rectRender);
            FudgeCore.Render.setCanvasSize(rectRender.width, rectRender.height);
            FudgeCore.Recycler.store(rectCanvas);
            FudgeCore.Recycler.store(rectRender);
        }
        adjustCamera() {
            const rectRender = FudgeCore.Render.getRenderRectangle();
            this.camera.projectCentral(rectRender.width / rectRender.height, this.camera.fieldOfView, this.camera.direction, this.camera.near, this.camera.far);
        }
        getRayFromClient(_point) {
            let posProjection = this.pointClientToProjection(_point);
            let ray = new FudgeCore.Ray(new FudgeCore.Vector3(-posProjection.x, posProjection.y, 1));
            ray.transform(this.camera.mtxPivot);
            let cameraNode = this.camera.node;
            if (cameraNode)
                ray.transform(cameraNode.mtxWorld);
            return ray;
        }
        pointWorldToClient(_position) {
            let projection = this.camera.pointWorldToClip(_position);
            let posClient = this.pointClipToClient(projection.toVector2());
            return posClient;
        }
        pointClientToSource(_client) {
            let result = this.frameClientToCanvas.getPoint(_client, this.#rectClient);
            result = this.frameCanvasToDestination.getPoint(result, this.#rectCanvas);
            result = this.frameDestinationToSource.getPoint(result, this.rectSource);
            return result;
        }
        pointSourceToRender(_source) {
            let projectionRectangle = this.camera.getProjectionRectangle();
            let point = this.frameSourceToRender.getPoint(_source, projectionRectangle);
            return point;
        }
        pointClientToRender(_client) {
            let point = this.pointClientToSource(_client);
            point = this.pointSourceToRender(point);
            return point;
        }
        pointClientToProjection(_client) {
            let posRender = this.pointClientToRender(_client);
            let rectRender = this.frameSourceToRender.getRect(this.rectSource);
            let rectProjection = this.camera.getProjectionRectangle();
            let posProjection = new FudgeCore.Vector2(rectProjection.width * posRender.x / rectRender.width, rectProjection.height * posRender.y / rectRender.height);
            posProjection.subtract(new FudgeCore.Vector2(rectProjection.width / 2, rectProjection.height / 2));
            posProjection.y *= -1;
            return posProjection;
        }
        pointClipToClient(_normed) {
            let pointClient = FudgeCore.Render.rectClip.pointToRect(_normed, this.rectDestination);
            return pointClient;
        }
        pointClipToCanvas(_normed) {
            let pointCanvas = FudgeCore.Render.rectClip.pointToRect(_normed, this.#rectCanvas);
            return pointCanvas;
        }
        pointClientToScreen(_client) {
            let screen = new FudgeCore.Vector2(this.#canvas.offsetLeft + _client.x, this.#canvas.offsetTop + _client.y);
            return screen;
        }
        getGizmos(_nodes = Array.from(this.#branch.getIterator(true))) {
            return _nodes
                .flatMap(_node => _node.getAllComponents())
                .filter(_component => _component.isActive && (_component.drawGizmos || _component.drawGizmosSelected) && this.gizmosFilter[_component.type]);
        }
    }
    FudgeCore.Viewport = Viewport;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let XR_SESSION_MODE;
    (function (XR_SESSION_MODE) {
        XR_SESSION_MODE["IMMERSIVE_VR"] = "immersive-vr";
    })(XR_SESSION_MODE = FudgeCore.XR_SESSION_MODE || (FudgeCore.XR_SESSION_MODE = {}));
    let XR_REFERENCE_SPACE;
    (function (XR_REFERENCE_SPACE) {
        XR_REFERENCE_SPACE["VIEWER"] = "viewer";
        XR_REFERENCE_SPACE["LOCAL"] = "local";
    })(XR_REFERENCE_SPACE = FudgeCore.XR_REFERENCE_SPACE || (FudgeCore.XR_REFERENCE_SPACE = {}));
    class XRViewport extends FudgeCore.Viewport {
        static { this.xrViewportInstance = null; }
        constructor() {
            super();
            this.vrDevice = null;
            this.session = null;
            this.referenceSpace = null;
            this.useVRController = false;
            XRViewport.xrViewportInstance = this;
        }
        static get default() {
            return this.xrViewportInstance;
        }
        initialize(_name, _branch, _cameraXR, _canvas) {
            super.initialize(_name, _branch, _cameraXR, _canvas);
        }
        async initializeVR(_vrSessionMode = XR_SESSION_MODE.IMMERSIVE_VR, _vrReferenceSpaceType = XR_REFERENCE_SPACE.LOCAL, _vrController = false) {
            let session = await navigator.xr.requestSession(_vrSessionMode);
            this.referenceSpace = await session.requestReferenceSpace(_vrReferenceSpaceType);
            await FudgeCore.Render.getRenderingContext().makeXRCompatible();
            let nativeScaleFactor = XRWebGLLayer.getNativeFramebufferScaleFactor(session);
            let baseLayer = new XRWebGLLayer(session, FudgeCore.Render.getRenderingContext(), { framebufferScaleFactor: nativeScaleFactor });
            await session.updateRenderState({ baseLayer: baseLayer });
            FudgeCore.Render.setFramebufferTarget(baseLayer.framebuffer);
            FudgeCore.Render.setCanvasSize(baseLayer.framebufferWidth, baseLayer.framebufferHeight);
            FudgeCore.Render.setRenderRectangle(FudgeCore.Rectangle.GET(0, 0, baseLayer.framebufferWidth, baseLayer.framebufferHeight));
            FudgeCore.Render.adjustAttachments();
            this.adjustingFrames = false;
            this.vrDevice = this.camera;
            this.initializeReferenceSpace();
            this.useVRController = _vrController;
            if (_vrController) {
                this.vrDevice.rightCntrl.cmpTransform = new FudgeCore.ComponentTransform();
                this.vrDevice.leftCntrl.cmpTransform = new FudgeCore.ComponentTransform();
            }
            this.session = session;
            this.prepareBranch();
        }
        async initializeAR(_arSessionMode = null, _arReferenceSpaceType = null) {
            FudgeCore.Debug.error("NOT IMPLEMENTED YET! Check out initializeVR!");
        }
        draw(_prepareBranch = true, _xrFrame = null) {
            if (!this.session) {
                super.draw(_prepareBranch);
                return;
            }
            let pose = _xrFrame?.getViewerPose(this.referenceSpace);
            if (!pose)
                return;
            this.vrDevice.mtxLocal.fromArray(pose.transform.matrix);
            this.vrDevice.mtxLocal.rotateY(180);
            super.prepare(_prepareBranch);
            FudgeCore.Render.resetFramebuffer();
            FudgeCore.Render.clear(this.camera.clrBackground);
            let glLayer = this.session.renderState.baseLayer;
            for (let view of pose.views) {
                let viewport = glLayer.getViewport(view);
                FudgeCore.Render.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
                FudgeCore.Render.setScissorTest(true, viewport.x, viewport.y, viewport.width, viewport.height);
                if (this.useVRController)
                    this.setControllerConfigs(_xrFrame);
                this.camera.mtxProjection.fromArray(view.projectionMatrix);
                this.camera.mtxCameraInverse.fromArray(view.transform.inverse.matrix);
                if (this.physicsDebugMode != FudgeCore.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY)
                    FudgeCore.Render.draw(this.camera);
                if (this.physicsDebugMode != FudgeCore.PHYSICS_DEBUGMODE.NONE)
                    FudgeCore.Physics.draw(this.camera, this.physicsDebugMode);
            }
            FudgeCore.Render.setScissorTest(false);
            FudgeCore.Render.setRenderRectangle(FudgeCore.Render.getRenderRectangle());
        }
        initializeReferenceSpace() {
            let mtxWorld = this.vrDevice.node?.getComponent(FudgeCore.ComponentVRDevice)?.mtxWorld;
            if (!mtxWorld)
                return;
            mtxWorld = mtxWorld.clone;
            mtxWorld.rotateY(180);
            let invMtxTransfom = FudgeCore.Matrix4x4.INVERSE(mtxWorld);
            XRViewport.default.referenceSpace = XRViewport.default.referenceSpace.getOffsetReferenceSpace(new XRRigidTransform(invMtxTransfom.translation, invMtxTransfom.quaternion));
        }
        setControllerConfigs(_xrFrame) {
            if (_xrFrame) {
                if (XRViewport.default.session.inputSources.length > 0) {
                    XRViewport.default.session.inputSources.forEach(_controller => {
                        try {
                            switch (_controller.handedness) {
                                case ("right"):
                                    this.vrDevice.rightCntrl.cmpTransform.mtxLocal.fromArray(_xrFrame.getPose(_controller.targetRaySpace, XRViewport.default.referenceSpace).transform.matrix);
                                    if (!this.vrDevice.rightCntrl.gamePad)
                                        this.vrDevice.rightCntrl.gamePad = _controller.gamepad;
                                    else {
                                        this.vrDevice.rightCntrl.thumbstickX = _controller.gamepad.axes[2];
                                        this.vrDevice.rightCntrl.thumbstickY = _controller.gamepad.axes[3];
                                    }
                                    break;
                                case ("left"):
                                    this.vrDevice.leftCntrl.cmpTransform.mtxLocal.fromArray(_xrFrame.getPose(_controller.targetRaySpace, XRViewport.default.referenceSpace).transform.matrix);
                                    if (!this.vrDevice.leftCntrl.gamePad)
                                        this.vrDevice.leftCntrl.gamePad = _controller.gamepad;
                                    else {
                                        this.vrDevice.leftCntrl.thumbstickX = _controller.gamepad.axes[2];
                                        this.vrDevice.leftCntrl.thumbstickY = _controller.gamepad.axes[3];
                                    }
                                    break;
                            }
                        }
                        catch (e) {
                            FudgeCore.Debug.error("Input Sources Error: " + e);
                        }
                    });
                }
            }
        }
    }
    FudgeCore.XRViewport = XRViewport;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class FileIoBrowserLocal extends FudgeCore.EventTargetStatic {
        static async load(_multiple = false) {
            FileIoBrowserLocal.selector = document.createElement("input");
            FileIoBrowserLocal.selector.type = "file";
            FileIoBrowserLocal.selector.multiple = _multiple;
            FileIoBrowserLocal.selector.hidden = true;
            FileIoBrowserLocal.selector.addEventListener("change", FileIoBrowserLocal.handleFileSelect);
            document.body.appendChild(FileIoBrowserLocal.selector);
            return new Promise(_resolve => {
                function hndLoaded(_event) {
                    FileIoBrowserLocal.removeEventListener("fileLoaded", hndLoaded);
                    _resolve(_event.detail.mapFilenameToContent);
                }
                FileIoBrowserLocal.addEventListener("fileLoaded", hndLoaded);
                FileIoBrowserLocal.selector.click();
            });
        }
        static save(_toSave, _type = "text/plain") {
            for (let filename in _toSave) {
                let content = _toSave[filename];
                let blob = new Blob([content], { type: _type });
                let url = window.URL.createObjectURL(blob);
                let downloader;
                downloader = document.createElement("a");
                downloader.setAttribute("href", url);
                downloader.setAttribute("download", filename);
                document.body.appendChild(downloader);
                downloader.click();
                document.body.removeChild(downloader);
                window.URL.revokeObjectURL(url);
            }
            return new Promise(_resolve => {
                _resolve(_toSave);
            });
        }
        static async loadFiles(_fileList, _loaded) {
            for (let file of _fileList) {
                const content = await new Response(file).text();
                _loaded[file.name] = content;
            }
        }
        static async handleFileSelect(_event) {
            FudgeCore.Debug.fudge("-------------------------------- handleFileSelect");
            document.body.removeChild(FileIoBrowserLocal.selector);
            let fileList = _event.target.files;
            FudgeCore.Debug.fudge(fileList, fileList.length);
            if (fileList.length == 0)
                return;
            let loaded = {};
            await FileIoBrowserLocal.loadFiles(fileList, loaded);
            let event = new CustomEvent("fileLoaded", { detail: { mapFilenameToContent: loaded } });
            FileIoBrowserLocal.targetStatic.dispatchEvent(event);
        }
    }
    FudgeCore.FileIoBrowserLocal = FileIoBrowserLocal;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class MutableArray extends Array {
        #type;
        constructor(_type, ..._args) {
            super(..._args);
            this.#type = _type;
        }
        get type() {
            return this.#type;
        }
        rearrange(_sequence) {
            let length = this.length;
            for (let index of _sequence) {
                let original = this[index];
                let copy = new original.constructor();
                copy.mutate(original.getMutator());
                this.push(copy);
            }
            this.splice(0, length);
        }
        getMutatorAttributeTypes(_mutator) {
            let types = {};
            for (let entry in this)
                types[entry] = this[entry].constructor.name;
            return types;
        }
        getMutator() {
            return this.map((_value) => _value.getMutator());
        }
        getMutatorForUserInterface() {
            return this.getMutator();
        }
        async mutate(_mutator) {
            for (let entry in _mutator)
                await this[entry].mutate(_mutator[entry]);
        }
        updateMutator(_mutator) {
            for (let entry in this) {
                let mutatorValue = _mutator[entry];
                if (!mutatorValue)
                    continue;
                if (this[entry] instanceof FudgeCore.Mutable)
                    _mutator[entry] = this[entry].getMutator();
                else
                    _mutator[entry] = this[entry];
            }
        }
    }
    FudgeCore.MutableArray = MutableArray;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    function serialize(_constructor, _context) {
        if (_context) {
            let meta = _context.metadata;
            const prototype = _constructor.prototype;
            if (meta.enumerateKeys) {
                const descriptor = { enumerable: true };
                for (const key of meta.enumerateKeys)
                    Object.defineProperty(prototype, key, descriptor);
            }
            const originalSerialize = prototype.serialize;
            const originalDeserialize = prototype.deserialize;
            const serializables = meta.serializables;
            prototype.serialize = function () {
                const serialization = originalSerialize?.call(this) ?? {};
                for (const key in serializables) {
                    let value = Reflect.get(this, key);
                    if (value == null)
                        continue;
                    switch (serializables[key]) {
                        case "primitive":
                            serialization[key] = value;
                            break;
                        case "serializable":
                            serialization[key] = value.serialize();
                            break;
                        case "resource":
                            serialization[key] = value.idResource;
                            break;
                        case "node":
                            serialization[key] = FudgeCore.Node.PATH_FROM_TO(this, value);
                            break;
                    }
                }
                return serialization;
            };
            prototype.deserialize = async function (_serialization) {
                if (originalDeserialize)
                    await originalDeserialize.call(this, _serialization);
                for (const key in serializables) {
                    let value = _serialization[key];
                    if (value == null)
                        continue;
                    switch (serializables[key]) {
                        case "primitive":
                            Reflect.set(this, key, value);
                            break;
                        case "serializable":
                            await Reflect.get(this, key).deserialize(value);
                            break;
                        case "resource":
                            Reflect.set(this, key, FudgeCore.Project.resources[value] ?? await FudgeCore.Project.getResource(value));
                            break;
                        case "node":
                            let instance = this;
                            const hndNodeDeserialized = () => {
                                const hndGraphDeserialized = (_event) => {
                                    Reflect.set(this, key, FudgeCore.Node.FIND(instance, value));
                                    instance.node.removeEventListener("graphDeserialized", hndGraphDeserialized, true);
                                    instance.node.removeEventListener("graphInstantiated", hndGraphDeserialized, true);
                                    instance.removeEventListener("nodeDeserialized", hndNodeDeserialized);
                                };
                                instance.node.addEventListener("graphDeserialized", hndGraphDeserialized, true);
                                instance.node.addEventListener("graphInstantiated", hndGraphDeserialized, true);
                            };
                            instance.addEventListener("nodeDeserialized", hndNodeDeserialized);
                    }
                }
                return this;
            };
            return;
        }
        return (_value, _context) => {
            if (typeof _context.name != "string")
                return;
            let meta = _context.metadata;
            if (!Object.hasOwn(meta, "attributeTypes"))
                meta.attributeTypes = { ...meta.attributeTypes };
            meta.attributeTypes[_context.name] = _constructor;
            let type;
            if (_constructor == String || _constructor == Number || _constructor == Boolean || typeof _constructor == "object")
                type = "primitive";
            else if (_constructor == FudgeCore.Node)
                type = "node";
            else if (_constructor.prototype.isSerializableResource)
                type = "resource";
            else if (_constructor.prototype.serialize && _constructor.prototype.deserialize)
                type = "serializable";
            if (!type)
                return;
            if (!Object.hasOwn(meta, "serializables"))
                meta.serializables = { ...meta.serializables };
            meta.serializables[_context.name] = type;
            if (_context.kind != "getter")
                return;
            if (!Object.hasOwn(meta, "enumerateKeys"))
                meta.enumerateKeys = [];
            meta.enumerateKeys.push(_context.name);
        };
    }
    FudgeCore.serialize = serialize;
})(FudgeCore || (FudgeCore = {}));
var FBX;
(function (FBX) {
    class BufferReader {
        constructor(_buffer) {
            this.view = new DataView(_buffer);
            this.offset = 0;
        }
        getChar(_offset = this.offset) {
            return String.fromCharCode(this.getUint8(_offset));
        }
        getBool(_offset = this.offset) {
            return this.getUint8(_offset) != 0;
        }
        getUint8(_offset = this.offset) {
            this.offset = _offset + 1;
            return this.view.getUint8(_offset);
        }
        getUint32(_offset = this.offset) {
            this.offset = _offset + 4;
            return this.view.getUint32(_offset, true);
        }
        getUint64(_offset = this.offset) {
            this.offset = _offset + 8;
            return this.view.getBigUint64(_offset, true);
        }
        getInt16(_offset = this.offset) {
            this.offset = _offset + 2;
            return this.view.getInt16(_offset, true);
        }
        getInt32(_offset = this.offset) {
            this.offset = _offset + 4;
            return this.view.getInt32(_offset, true);
        }
        getInt64(_offset = this.offset) {
            this.offset = _offset + 8;
            return this.view.getBigInt64(_offset, true);
        }
        getFloat32(_offset = this.offset) {
            this.offset = _offset + 4;
            return this.view.getFloat32(_offset, true);
        }
        getFloat64(_offset = this.offset) {
            this.offset = _offset + 8;
            return this.view.getFloat64(_offset, true);
        }
        getString(_length, _offset = this.offset) {
            return String.fromCharCode(...this.getSequence(this.getUint8, _length, _offset));
        }
        *getSequence(_getter, _length, _offset = this.offset) {
            this.offset = _offset;
            for (let i = 0; i < _length; i++) {
                yield _getter.call(this);
            }
        }
    }
    FBX.BufferReader = BufferReader;
})(FBX || (FBX = {}));
var FBX;
(function (FBX) {
    let MAPPING_INFORMATION_TYPE;
    (function (MAPPING_INFORMATION_TYPE) {
        MAPPING_INFORMATION_TYPE[MAPPING_INFORMATION_TYPE["BY_VERTEX"] = 0] = "BY_VERTEX";
        MAPPING_INFORMATION_TYPE[MAPPING_INFORMATION_TYPE["BY_POLYGON"] = 1] = "BY_POLYGON";
        MAPPING_INFORMATION_TYPE[MAPPING_INFORMATION_TYPE["BY_POLYGON_VERTEX"] = 2] = "BY_POLYGON_VERTEX";
        MAPPING_INFORMATION_TYPE[MAPPING_INFORMATION_TYPE["BY_EDGE"] = 3] = "BY_EDGE";
        MAPPING_INFORMATION_TYPE[MAPPING_INFORMATION_TYPE["ALL_SAME"] = 4] = "ALL_SAME";
    })(MAPPING_INFORMATION_TYPE = FBX.MAPPING_INFORMATION_TYPE || (FBX.MAPPING_INFORMATION_TYPE = {}));
    let REFERENCE_INFORMATION_TYPE;
    (function (REFERENCE_INFORMATION_TYPE) {
        REFERENCE_INFORMATION_TYPE[REFERENCE_INFORMATION_TYPE["DIRECT"] = 0] = "DIRECT";
        REFERENCE_INFORMATION_TYPE[REFERENCE_INFORMATION_TYPE["INDEX_TO_DIRECT"] = 1] = "INDEX_TO_DIRECT";
    })(REFERENCE_INFORMATION_TYPE = FBX.REFERENCE_INFORMATION_TYPE || (FBX.REFERENCE_INFORMATION_TYPE = {}));
})(FBX || (FBX = {}));
var FudgeCore;
(function (FudgeCore) {
    class FBXLoader {
        static #defaultMaterial;
        static #defaultSkinMaterial;
        #scenes;
        #nodes;
        #meshes;
        #materials;
        #skinMaterials = [];
        #textures;
        #skeletons;
        #animations;
        constructor(_buffer, _uri) {
            this.uri = _uri;
            this.nodes = FBX.parseNodesFromBinary(_buffer);
            FudgeCore.Debug.log(this.nodes);
            this.fbx = FBX.loadFromNodes(this.nodes);
            FudgeCore.Debug.log(this.fbx);
        }
        static get defaultMaterial() {
            return this.#defaultMaterial || (this.#defaultMaterial =
                new FudgeCore.Material("FBXDefaultMaterial", FudgeCore.ShaderGouraud, new FudgeCore.CoatRemissive(FudgeCore.Color.CSS("white"))));
        }
        static get defaultSkinMaterial() {
            return this.#defaultSkinMaterial || (this.#defaultSkinMaterial =
                new FudgeCore.Material("FBXDefaultSkinMaterial", FudgeCore.ShaderGouraudSkin, new FudgeCore.CoatRemissive(FudgeCore.Color.CSS("white"))));
        }
        static async LOAD(_uri) {
            if (!this.loaders)
                this.loaders = {};
            if (!this.loaders[_uri]) {
                const response = await fetch(_uri);
                const binary = await response.arrayBuffer();
                this.loaders[_uri] = new FBXLoader(binary, _uri);
            }
            return this.loaders[_uri];
        }
        async getScene(_index = 0) {
            if (!this.#scenes)
                this.#scenes = [];
            if (!this.#scenes[_index]) {
                const documentFBX = this.fbx.documents[_index].load();
                const scene = new FudgeCore.Graph(documentFBX.name);
                for (const childFBX of documentFBX.children) {
                    if (childFBX.type == "Model") {
                        scene.addChild(await this.getNode(this.fbx.objects.models.indexOf(childFBX)));
                    }
                }
                if (this.fbx.objects.animStacks && this.fbx.objects.animStacks.length > 0) {
                    const animation = await this.getAnimation(documentFBX.ActiveAnimStackName.length > 0 ?
                        this.fbx.objects.animStacks.findIndex(_animStack => _animStack.name == documentFBX.ActiveAnimStackName) : 0);
                    if (animation)
                        scene.addComponent(new FudgeCore.ComponentAnimation(animation));
                }
                for (const skeleton of this.#skeletons)
                    scene.addComponent(skeleton);
                FudgeCore.Project.register(scene);
                this.#scenes[_index] = scene;
            }
            return this.#scenes[_index];
        }
        async getNode(_index) {
            if (!this.#nodes)
                this.#nodes = [];
            if (!this.#nodes[_index]) {
                const modelFBX = this.fbx.objects.models[_index].load();
                const node = new FudgeCore.Node(modelFBX.name);
                await this.generateTransform(modelFBX, node);
                this.#nodes[_index] = node;
                if (modelFBX.children)
                    for (const childFBX of modelFBX.children) {
                        if (childFBX.type == "Model") {
                            node.addChild(await this.getNode(this.fbx.objects.models.indexOf(childFBX)));
                        }
                        else if (childFBX.type == "Geometry") {
                            const mesh = await this.getMesh(this.fbx.objects.geometries.indexOf(childFBX));
                            const cmpMesh = new FudgeCore.ComponentMesh(mesh);
                            node.addComponent(new FudgeCore.ComponentMaterial(FBXLoader.defaultMaterial));
                            if (mesh.renderMesh.bones) {
                                cmpMesh.skeleton = await this.getSkeleton(childFBX.children[0].children[0].children[0]);
                                node.getComponent(FudgeCore.ComponentMaterial).material = FBXLoader.defaultSkinMaterial;
                            }
                            node.addComponent(cmpMesh);
                        }
                        else if (childFBX.type == "Material") {
                            const iMaterial = this.fbx.objects.materials.indexOf(childFBX);
                            const material = await this.getMaterial(iMaterial);
                            node.getComponent(FudgeCore.ComponentMaterial).material = node.getComponent(FudgeCore.ComponentMesh).mesh.renderMesh.bones ?
                                this.#skinMaterials[iMaterial] || (this.#skinMaterials[iMaterial] = new FudgeCore.Material(material.name, material.getShader() == FudgeCore.ShaderPhong ?
                                    FudgeCore.ShaderPhongSkin :
                                    FudgeCore.ShaderPhongTexturedSkin, material.coat)) :
                                material;
                        }
                    }
            }
            return this.#nodes[_index];
        }
        async getMesh(_index) {
            if (!this.#meshes)
                this.#meshes = [];
            if (!this.#meshes[_index])
                this.#meshes[_index] = await new FudgeCore.MeshFBX().load(this.uri, _index);
            return this.#meshes[_index];
        }
        async getMaterial(_index) {
            if (!this.#materials)
                this.#materials = [];
            if (!this.#materials[_index]) {
                const materialFBX = this.fbx.objects.materials[_index].load();
                if (!(materialFBX.DiffuseColor instanceof FudgeCore.Vector3))
                    materialFBX.DiffuseColor?.children[0].load();
                this.#materials[_index] = new FudgeCore.Material(materialFBX.name, materialFBX.DiffuseColor && !(materialFBX.DiffuseColor instanceof FudgeCore.Vector3) ?
                    FudgeCore.ShaderPhongTextured :
                    FudgeCore.ShaderPhong, materialFBX.DiffuseColor && !(materialFBX.DiffuseColor instanceof FudgeCore.Vector3) ?
                    new FudgeCore.CoatRemissiveTextured(new FudgeCore.Color(...materialFBX.Diffuse.toArray([])), await this.getTexture(this.fbx.objects.textures.indexOf(materialFBX.DiffuseColor)), materialFBX.DiffuseFactor ?? 1, materialFBX.SpecularFactor ?? average(materialFBX.Specular?.toArray(new Float32Array(3))) ?? 0) :
                    new FudgeCore.CoatRemissive(new FudgeCore.Color(...(materialFBX.DiffuseColor ?? materialFBX.Diffuse).toArray(new Float32Array(3))), materialFBX.DiffuseFactor ?? 1, materialFBX.SpecularFactor ?? average(materialFBX.Specular?.toArray(new Float32Array(3))) ?? 0));
            }
            return this.#materials[_index];
            function average(_array) {
                if (_array)
                    return _array.reduce((_a, _b) => _a + _b) / _array.length;
                else
                    return undefined;
            }
        }
        async getTexture(_index) {
            return new Promise((_resolve, _reject) => {
                if (!this.#textures)
                    this.#textures = [];
                if (this.#textures[_index])
                    return _resolve(this.#textures[_index]);
                const videoFBX = this.fbx.objects.textures[_index].children[0];
                const texture = new FudgeCore.TextureImage();
                texture.image = new Image();
                texture.image.onload = () => _resolve(texture);
                texture.image.onerror = _reject;
                texture.image.src = URL.createObjectURL(new Blob([videoFBX.Content], { type: "image/png" }));
                this.#textures[_index] = texture;
            });
        }
        async getSkeleton(_fbxLimbNode) {
            if (!this.#skeletons)
                this.#skeletons = [];
            return this.#skeletons.find(_skeleton => _fbxLimbNode.name in _skeleton.bones) || await (async () => {
                const skeleton = new FudgeCore.ComponentSkeleton();
                let rootNode = _fbxLimbNode;
                while (rootNode.parents && rootNode.parents.some(_parent => _parent.subtype == "LimbNode"))
                    rootNode = rootNode.parents.find(_parent => _parent.subtype == "LimbNode");
                const iRootNode = this.fbx.objects.models.findIndex(_model => _model.name == rootNode.name);
                for (const node of await this.getNode(iRootNode)) {
                    if (this.fbx.objects.models[this.#nodes.indexOf(node)].subtype == "LimbNode") {
                        const parent = node.getParent();
                        if (parent)
                            node.mtxWorld.copy(node.cmpTransform ?
                                FudgeCore.Matrix4x4.PRODUCT(parent.mtxWorld, node.mtxLocal) :
                                parent.mtxWorld);
                        node.mtxWorldInverse.copy(FudgeCore.Matrix4x4.INVERSE(node.mtxWorld));
                        skeleton.addBone(node);
                    }
                }
                this.#skeletons.push(skeleton);
                return skeleton;
            })();
        }
        async getAnimation(_index) {
            if (!this.#animations)
                this.#animations = [];
            if (!this.#animations[_index]) {
                const animStack = this.fbx.objects.animStacks[_index];
                const animNodesFBX = animStack.children[0].children;
                let fbxAnimNodeGrouped = new Map();
                for (const fbxAnimNode of animNodesFBX) {
                    const key = fbxAnimNode.parents.find(_parent => _parent.type == "Model");
                    if (key == undefined)
                        continue;
                    if (!fbxAnimNodeGrouped.has(key))
                        fbxAnimNodeGrouped.set(key, []);
                    fbxAnimNodeGrouped.get(key).push(fbxAnimNode);
                }
                const animationStructure = {};
                for (const [fbxModel, fbxAnimNodes] of fbxAnimNodeGrouped) {
                    let currentStructure = animationStructure;
                    let parent = fbxModel.parents.find(_parent => _parent.type == "Model");
                    let path = [];
                    path.push(fbxModel);
                    while (parent != undefined) {
                        path.push(parent);
                        parent = parent.parents.find(_parent => _parent.type == "Model");
                    }
                    for (const fbxPathModel of path.reverse()) {
                        if (currentStructure.children == undefined)
                            currentStructure.children = {};
                        if (currentStructure.children[fbxPathModel.name] == undefined)
                            currentStructure.children[fbxPathModel.name] = {};
                        currentStructure = currentStructure.children[fbxPathModel.name];
                        if (fbxPathModel == fbxModel) {
                            const mtxLocal = {};
                            for (const fbxAnimNode of fbxAnimNodes)
                                mtxLocal[{
                                    T: "translation",
                                    R: "rotation",
                                    S: "scale"
                                }[fbxAnimNode.name]] = this.getAnimationVector3(fbxAnimNode, fbxPathModel);
                            currentStructure.components = {
                                ComponentTransform: [
                                    { mtxLocal: mtxLocal }
                                ]
                            };
                        }
                    }
                }
                this.#animations[_index] = new FudgeCore.Animation(animStack.name, animationStructure);
            }
            return this.#animations[_index];
        }
        async generateTransform(_modelFBX, _node) {
            const parentIndex = this.fbx.objects.models.indexOf(_modelFBX.parents.find(_parent => _parent.type == "Model"));
            const parent = parentIndex >= 0 ? await this.getNode(parentIndex) : undefined;
            const mtxLocalRotation = _modelFBX.PreRotation || _modelFBX.LclRotation || _modelFBX.PostRotation ?
                FudgeCore.Matrix4x4.IDENTITY() :
                undefined;
            if (_modelFBX.PreRotation) {
                mtxLocalRotation.rotate(this.getOrdered(_modelFBX.PreRotation, _modelFBX));
            }
            if (_modelFBX.LclRotation) {
                mtxLocalRotation.rotate(this.getOrdered(this.getTransformVector(_modelFBX.LclRotation, FudgeCore.Vector3.ZERO), _modelFBX));
            }
            if (_modelFBX.PostRotation) {
                let mtxPostRotationInverse = FudgeCore.Matrix4x4.ROTATION(this.getOrdered(_modelFBX.PostRotation, _modelFBX));
                mtxPostRotationInverse = FudgeCore.Matrix4x4.INVERSE(mtxPostRotationInverse);
                mtxLocalRotation.multiply(mtxPostRotationInverse);
            }
            const mtxLocalScaling = _modelFBX.LclScaling ?
                FudgeCore.Matrix4x4.SCALING(this.getTransformVector(_modelFBX.LclScaling, FudgeCore.Vector3.ONE)) :
                undefined;
            const mtxParentWorldRotation = parent ? FudgeCore.Matrix4x4.ROTATION(parent.mtxWorld.rotation) : undefined;
            const mtxParentWorldScale = parent ? (() => {
                const mtxParentWorldScale = FudgeCore.Matrix4x4.INVERSE(mtxParentWorldRotation);
                mtxParentWorldScale.translate(FudgeCore.Vector3.SCALE(parent.mtxWorld.translation, -1));
                mtxParentWorldScale.multiply(parent.mtxWorld);
                return mtxParentWorldScale;
            })() : undefined;
            const mtxWorldRotationScale = parent || mtxLocalRotation || mtxLocalScaling ? FudgeCore.Matrix4x4.IDENTITY() : undefined;
            if (parent || mtxLocalRotation || mtxLocalScaling) {
                const inheritType = _modelFBX.InheritType || 0;
                if (inheritType == 0) {
                    if (parent)
                        mtxWorldRotationScale.multiply(mtxParentWorldRotation);
                    if (mtxLocalRotation)
                        mtxWorldRotationScale.multiply(mtxLocalRotation);
                    if (parent)
                        mtxWorldRotationScale.multiply(mtxParentWorldScale);
                    if (mtxLocalScaling)
                        mtxWorldRotationScale.multiply(mtxLocalScaling);
                }
                else if (inheritType == 1) {
                    if (parent) {
                        mtxWorldRotationScale.multiply(mtxParentWorldRotation);
                        mtxWorldRotationScale.multiply(mtxParentWorldScale);
                    }
                    if (mtxLocalRotation)
                        mtxWorldRotationScale.multiply(mtxLocalRotation);
                    if (mtxLocalScaling)
                        mtxWorldRotationScale.multiply(mtxLocalScaling);
                }
                else {
                    if (parent)
                        mtxWorldRotationScale.multiply(mtxParentWorldRotation);
                    if (mtxLocalRotation)
                        mtxWorldRotationScale.multiply(mtxLocalRotation);
                    if (parent) {
                        mtxWorldRotationScale.multiply(mtxParentWorldScale);
                        let mtxParentLocalScalingInverse = FudgeCore.Matrix4x4.SCALING(parent.mtxLocal.scaling);
                        mtxParentLocalScalingInverse = FudgeCore.Matrix4x4.INVERSE(mtxParentLocalScalingInverse);
                        mtxWorldRotationScale.multiply(mtxParentLocalScalingInverse);
                    }
                    if (mtxLocalScaling)
                        mtxWorldRotationScale.multiply(mtxLocalScaling);
                }
            }
            let translation;
            translation = FudgeCore.Vector3.ZERO();
            if (_modelFBX.LclTranslation)
                translation.add(this.getTransformVector(_modelFBX.LclTranslation, FudgeCore.Vector3.ZERO));
            if (_modelFBX.RotationOffset)
                translation.add(_modelFBX.RotationOffset);
            if (_modelFBX.RotationPivot)
                translation.add(_modelFBX.RotationPivot);
            const mtxTransform = FudgeCore.Matrix4x4.TRANSLATION(translation);
            if (mtxLocalRotation)
                mtxTransform.multiply(mtxLocalRotation);
            translation = FudgeCore.Vector3.ZERO();
            if (_modelFBX.RotationPivot)
                translation.subtract(_modelFBX.RotationPivot);
            if (_modelFBX.ScalingOffset)
                translation.add(_modelFBX.ScalingOffset);
            if (_modelFBX.ScalingPivot)
                translation.add(_modelFBX.ScalingPivot);
            mtxTransform.translate(translation);
            if (mtxLocalScaling)
                mtxTransform.multiply(mtxLocalScaling);
            if (_modelFBX.ScalingPivot)
                mtxTransform.translate(FudgeCore.Vector3.SCALE(_modelFBX.ScalingPivot, -1));
            const mtxWorldTranslation = parent ?
                FudgeCore.Matrix4x4.TRANSLATION(FudgeCore.Matrix4x4.PRODUCT(parent.mtxWorld, FudgeCore.Matrix4x4.TRANSLATION(mtxTransform.translation)).translation) :
                FudgeCore.Matrix4x4.TRANSLATION(mtxTransform.translation);
            mtxTransform.copy(mtxWorldTranslation);
            mtxTransform.multiply(mtxWorldRotationScale);
            _node.mtxWorld.copy(mtxTransform);
            if (parent)
                mtxTransform.multiply(FudgeCore.Matrix4x4.INVERSE(parent.mtxWorld), true);
            _node.addComponent(new FudgeCore.ComponentTransform(mtxTransform));
        }
        getTransformVector(_vector, _default) {
            return (_vector == undefined ?
                _default() :
                _vector instanceof FudgeCore.Vector3 ?
                    _vector :
                    new FudgeCore.Vector3(typeof (_vector = _vector.load()).dX == "number" ?
                        _vector.dX :
                        _vector.dX.load().Default, typeof _vector.dY == "number" ?
                        _vector.dY :
                        _vector.dY.load().Default, typeof _vector.dZ == "number" ?
                        _vector.dZ :
                        _vector.dZ.load().Default));
        }
        getAnimationVector3(_animNode, _target) {
            const vectorSequence = {};
            for (const valueName in _animNode)
                if (valueName == "dX" || valueName == "dY" || valueName == "dZ") {
                    const value = _animNode[valueName];
                    if (typeof value != "number") {
                        const sequence = new FudgeCore.AnimationSequence([], Number);
                        for (let i = 0; i < value.KeyTime.length; ++i) {
                            sequence.addKey(new FudgeCore.AnimationKey(Number((value.KeyTime[i] - value.KeyTime.reduce((_min, _v) => _v < _min ? _v : _min)) / BigInt("46186158")), value.KeyValueFloat[i]));
                        }
                        vectorSequence[valueName[1].toLowerCase()] = sequence;
                    }
                }
            if (_animNode.name == "R" && (_target.PreRotation || _target.PostRotation)) {
                let preRototation;
                if (_target.PreRotation)
                    preRototation = FudgeCore.Matrix4x4.ROTATION(_target.PreRotation);
                let postRotation;
                if (_target.PostRotation)
                    postRotation = FudgeCore.Matrix4x4.ROTATION(_target.PostRotation);
                [vectorSequence.x, vectorSequence.y, vectorSequence.z]
                    .flatMap(_seq => _seq?.getKeys())
                    .map(_key => _key?.time)
                    .sort((_timeA, _timeB) => _timeA - _timeB)
                    .filter((_time, _index, _times) => _time != _times[_index + 1])
                    .map(_time => {
                    return { x: findKey(vectorSequence.x), y: findKey(vectorSequence.y), z: findKey(vectorSequence.z) };
                    function findKey(_sequence) {
                        return _sequence?.getKeys().find(_key => _key.time == _time);
                    }
                })
                    .forEach(_frame => {
                    let vctEulerAngles = FudgeCore.Recycler.get(FudgeCore.Vector3);
                    vctEulerAngles.set(_frame.x?.value ?? 0, _frame.y?.value ?? 0, _frame.z?.value ?? 0);
                    const mtxRotation = FudgeCore.Matrix4x4.ROTATION(vctEulerAngles);
                    if (preRototation)
                        mtxRotation.multiply(preRototation, true);
                    if (postRotation)
                        mtxRotation.multiply(postRotation);
                    vctEulerAngles = mtxRotation.rotation;
                    if (_frame.x)
                        _frame.x.value = vctEulerAngles.x;
                    if (_frame.y)
                        _frame.y.value = vctEulerAngles.y;
                    if (_frame.z)
                        _frame.z.value = vctEulerAngles.z;
                });
            }
            return vectorSequence;
        }
        getOrdered(_rotation, _modelFBX) {
            if (!_modelFBX.EulerOrder)
                return _rotation;
            const data = _rotation.toArray(new Float32Array(3));
            const result = FudgeCore.Recycler.get(FudgeCore.Vector3);
            result.set(data[_modelFBX.EulerOrder.indexOf("Z")], data[_modelFBX.EulerOrder.indexOf("Y")], data[_modelFBX.EulerOrder.indexOf("X")]);
            return result;
        }
    }
    FudgeCore.FBXLoader = FBXLoader;
})(FudgeCore || (FudgeCore = {}));
var FBX;
(function (FBX) {
    class Node {
        #children;
        #properties;
        constructor(_name, _loadProperties, _loadChildren) {
            this.name = _name;
            this.loadProperties = _loadProperties;
            this.loadChildren = _loadChildren;
        }
        get properties() {
            return this.#properties || (this.#properties = this.loadProperties());
        }
        get children() {
            return this.#children || (this.#children = this.loadChildren());
        }
    }
    FBX.Node = Node;
    let ARRAY_ENCODING;
    (function (ARRAY_ENCODING) {
        ARRAY_ENCODING[ARRAY_ENCODING["UNCOMPRESSED"] = 0] = "UNCOMPRESSED";
        ARRAY_ENCODING[ARRAY_ENCODING["COMPRESSED"] = 1] = "COMPRESSED";
    })(ARRAY_ENCODING = FBX.ARRAY_ENCODING || (FBX.ARRAY_ENCODING = {}));
})(FBX || (FBX = {}));
var FBX;
(function (FBX) {
    function loadFromNodes(_nodes) {
        const fbx = {
            documents: undefined,
            objects: {
                all: undefined,
                models: [],
                geometries: [],
                materials: [],
                poses: [],
                textures: [],
                animStacks: []
            },
            connections: undefined
        };
        for (const node of _nodes) {
            if (node.name == "Documents")
                fbx.documents = node.children
                    .filter(_documentNode => _documentNode.name == "Document")
                    .map(_documentNode => getDocument(_documentNode));
            else if (node.name == "Objects")
                fbx.objects.all = node.children.map(_objectNode => getObject(_objectNode, fbx));
            else if (node.name == "Connections")
                fbx.connections = node.children.map(_connectionNode => getConnection(_connectionNode));
            if (fbx.documents && fbx.objects.all && fbx.connections)
                break;
        }
        groupObjects(fbx);
        applyConnections(fbx.connections, fbx.documents, fbx.objects.all);
        return fbx;
    }
    FBX.loadFromNodes = loadFromNodes;
    function getDocument(_node) {
        const document = {
            uid: _node.properties[0],
            name: _node.properties[2],
            loaded: false,
            load: () => loadObjectProperties(_node, document)
        };
        return document;
    }
    function getObject(_node, _fbx) {
        const nameAndType = _node.properties[1].split("::");
        const object = {
            uid: _node.properties[0],
            name: nameAndType[0],
            type: nameAndType[1],
            subtype: _node.properties[2],
            loaded: false,
            load: () => loadObjectProperties(_node, object)
        };
        return object;
    }
    function groupObjects(_fbx) {
        for (const object of _fbx.objects.all) {
            if (object.type == "Model")
                _fbx.objects.models.push(object);
            else if (object.type == "Geometry")
                _fbx.objects.geometries.push(object);
            else if (object.type == "Material")
                _fbx.objects.materials.push(object);
            else if (object.type == "Pose")
                _fbx.objects.poses.push(object);
            else if (object.type == "Texture")
                _fbx.objects.textures.push(object);
            else if (object.type == "AnimStack")
                _fbx.objects.animStacks.push(object);
        }
    }
    function getConnection(_node) {
        if (!(_node.properties[0] == "OO" || _node.properties[0] == "OP")) {
            console.warn(`Connection type ${_node.properties[0]} is not supported`);
            return null;
        }
        return {
            childUID: _node.properties[1],
            parentUID: _node.properties[2],
            propertyName: _node.properties[0] == "OP" ? _node.properties[3] : null
        };
    }
    function applyConnections(_connections, _documents, _objects) {
        for (const connection of _connections) {
            let parent = _documents.find(_document => _document.load().RootNode == connection.parentUID);
            let child;
            for (const object of _objects) {
                if (parent == undefined && object.uid == connection.parentUID)
                    parent = object;
                if (child == undefined && object.uid == connection.childUID)
                    child = object;
                if (parent != undefined && child != undefined)
                    break;
            }
            if (child)
                (child.parents || (child.parents = [])).push(parent);
            if (connection.propertyName == null)
                (parent.children || (parent.children = [])).push(child);
            else
                parent[formatPropertyName(connection.propertyName)] = child;
        }
    }
    function loadObjectProperties(_node, _object) {
        if (_object.loaded)
            return _object;
        for (const child of _node.children) {
            if (child.name == "Properties70")
                for (const property70 of child.children) {
                    const name = formatPropertyName(property70.properties[0]);
                    if (!_object[name])
                        _object[name] = getProperty70Value(property70);
                }
            else {
                const name = formatPropertyName(child.name);
                if (!_object[name])
                    _object[name] = getPropertyValue(child);
            }
        }
        _object.loaded = true;
        return _object;
    }
    function getPropertyValue(_node) {
        return _node.children.length > 0
            ? _node.children.reduce((_subProperties, _subProperty) => {
                const name = formatPropertyName(_subProperty.name);
                if (_subProperties[name] == undefined)
                    _subProperties[name] = getPropertyValue(_subProperty);
                else {
                    if (!(_subProperties[name] instanceof Array))
                        _subProperties[name] = [_subProperties[name]];
                    _subProperties[name].push(getPropertyValue(_subProperty));
                }
                return _subProperties;
            }, {})
            : _node.properties[0];
    }
    function getProperty70Value(_node) {
        switch (_node.properties[1]) {
            case "bool":
                return _node.properties[4];
            case "int":
            case "enum":
            case "ULongLong":
            case "double":
            case "Number":
            case "FieldOfView":
                return _node.properties[4];
            case "Color":
            case "ColorRGB":
            case "Vector3D":
            case "Lcl Translation":
            case "Lcl Rotation":
            case "Lcl Scaling":
                return new FudgeCore.Vector3(..._node.properties.slice(4, 7));
            case "KString":
            default:
                return _node.properties[4];
        }
    }
    function formatPropertyName(_name) {
        return _name.replace(/[^a-zA-Z]/, "");
    }
})(FBX || (FBX = {}));
var FBX;
(function (FBX) {
    function parseNodesFromBinary(_buffer) {
        if (_buffer.byteLength < binaryStartChars.length)
            throw "Not a binary FBX file";
        const data = new FBX.BufferReader(_buffer);
        const firstChars = new Uint8Array(data.getSequence(data.getUint8, binaryStartChars.length));
        const matchesFBXBinaryFirstChars = firstChars.every((_value, _index) => _value == binaryStartChars[_index]);
        if (!matchesFBXBinaryFirstChars)
            throw "Not a binary FBX file";
        const version = data.getUint32();
        const nodeAttributesAsUInt64 = version >= 7500;
        const nodes = [];
        while (true) {
            const node = readNode(data, nodeAttributesAsUInt64);
            if (node == null)
                break;
            nodes.push(node);
        }
        return nodes;
    }
    FBX.parseNodesFromBinary = parseNodesFromBinary;
    function readNode(_data, _attributesAsUint64) {
        const endOffset = _attributesAsUint64 ? Number(_data.getUint64()) : _data.getUint32();
        if (endOffset == 0)
            return null;
        const propertiesLength = _attributesAsUint64 ? Number(_data.getUint64()) : _data.getUint32();
        const propertiesByteLength = _attributesAsUint64 ? Number(_data.getUint64()) : _data.getUint32();
        const nameLength = _data.getUint8();
        const name = _data.getString(nameLength);
        const propertiesOffset = _data.offset;
        const childrenOffset = propertiesOffset + propertiesByteLength;
        const node = new FBX.Node(name, () => {
            _data.offset = propertiesOffset;
            const properties = [];
            for (let iProperty = 0; iProperty < propertiesLength; iProperty++) {
                properties.push(readProperty(_data));
            }
            return properties;
        }, () => {
            _data.offset = childrenOffset;
            const children = [];
            while (endOffset - _data.offset > nullCountAtNodeEnd) {
                const child = readNode(_data, _attributesAsUint64);
                if (child)
                    children.push(child);
            }
            return children;
        });
        _data.offset = endOffset;
        return node;
    }
    function readProperty(_data) {
        const typeCode = _data.getChar();
        const value = {
            C: _data.getBool,
            Y: _data.getInt16,
            I: _data.getInt32,
            L: _data.getInt64,
            F: _data.getFloat32,
            D: _data.getFloat64,
            S: () => _data.getString(_data.getUint32()).replace("\x00\x01", "::"),
            s: () => _data.getString(_data.getUint32()).replace("\x00\x01", "::"),
            R: () => new Uint8Array(readRaw(_data, _data.getUint8)),
            r: () => new Uint8Array(readArray(_data, _data.getUint8)),
            b: () => new Uint8Array(readArray(_data, _data.getUint8)),
            i: () => new Int32Array(readArray(_data, _data.getInt32)),
            l: () => new BigInt64Array(readArray(_data, _data.getInt64)),
            f: () => new Float32Array(readArray(_data, _data.getFloat32)),
            d: () => new Float32Array(readArray(_data, _data.getFloat64))
        }[typeCode]?.call(_data);
        if (value == null)
            FudgeCore.Debug.warn(`Unknown property type ${typeCode.charCodeAt(0)}`);
        return value;
    }
    function readArray(_data, _getter) {
        const length = _data.getUint32();
        const encoding = _data.getUint32();
        const byteLength = _data.getUint32();
        const endOffset = _data.offset + byteLength;
        const iterable = encoding == FBX.ARRAY_ENCODING.COMPRESSED ?
            (() => {
                const arrayData = new Uint8Array(_data.view.buffer, _data.offset, byteLength);
                const inflatedData = (Reflect.get(globalThis, "pako") ? pako.inflate : fflate.inflateSync)(arrayData);
                return new FBX.BufferReader(inflatedData.buffer).getSequence(_getter, length);
            })() :
            _data.getSequence(_getter, length);
        _data.offset = endOffset;
        return iterable;
    }
    function readRaw(_data, _getter) {
        const length = _data.getUint32();
        return _data.getSequence(_getter, length);
        ;
    }
    const binaryStartChars = Uint8Array.from("Kaydara FBX Binary\x20\x20\x00\x1a\x00".split(""), _v => _v.charCodeAt(0));
    const nullCountAtNodeEnd = 13;
})(FBX || (FBX = {}));
var GLTF;
(function (GLTF) {
    let COMPONENT_TYPE;
    (function (COMPONENT_TYPE) {
        COMPONENT_TYPE[COMPONENT_TYPE["BYTE"] = 5120] = "BYTE";
        COMPONENT_TYPE[COMPONENT_TYPE["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
        COMPONENT_TYPE[COMPONENT_TYPE["SHORT"] = 5122] = "SHORT";
        COMPONENT_TYPE[COMPONENT_TYPE["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        COMPONENT_TYPE[COMPONENT_TYPE["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
        COMPONENT_TYPE[COMPONENT_TYPE["FLOAT"] = 5126] = "FLOAT";
    })(COMPONENT_TYPE = GLTF.COMPONENT_TYPE || (GLTF.COMPONENT_TYPE = {}));
    let ACCESSOR_TYPE;
    (function (ACCESSOR_TYPE) {
        ACCESSOR_TYPE["SCALAR"] = "SCALAR";
        ACCESSOR_TYPE["VEC2"] = "VEC2";
        ACCESSOR_TYPE["VEC3"] = "VEC3";
        ACCESSOR_TYPE["VEC4"] = "VEC4";
        ACCESSOR_TYPE["MAT2"] = "MAT2";
        ACCESSOR_TYPE["MAT3"] = "MAT3";
        ACCESSOR_TYPE["MAT4"] = "MAT4";
    })(ACCESSOR_TYPE = GLTF.ACCESSOR_TYPE || (GLTF.ACCESSOR_TYPE = {}));
    let MESH_PRIMITIVE_MODE;
    (function (MESH_PRIMITIVE_MODE) {
        MESH_PRIMITIVE_MODE[MESH_PRIMITIVE_MODE["POINTS"] = 0] = "POINTS";
        MESH_PRIMITIVE_MODE[MESH_PRIMITIVE_MODE["LINES"] = 1] = "LINES";
        MESH_PRIMITIVE_MODE[MESH_PRIMITIVE_MODE["LINE_LOOP"] = 2] = "LINE_LOOP";
        MESH_PRIMITIVE_MODE[MESH_PRIMITIVE_MODE["LINE_STRIP"] = 3] = "LINE_STRIP";
        MESH_PRIMITIVE_MODE[MESH_PRIMITIVE_MODE["TRIANGLES"] = 4] = "TRIANGLES";
        MESH_PRIMITIVE_MODE[MESH_PRIMITIVE_MODE["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        MESH_PRIMITIVE_MODE[MESH_PRIMITIVE_MODE["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
    })(MESH_PRIMITIVE_MODE = GLTF.MESH_PRIMITIVE_MODE || (GLTF.MESH_PRIMITIVE_MODE = {}));
})(GLTF || (GLTF = {}));
var FudgeCore;
(function (FudgeCore) {
    class GLTFLoader {
        static #defaultMaterial;
        static #defaultSkinMaterial;
        #url;
        #gltf;
        #resources = {};
        #buffers;
        constructor(_gltf, _url, _bufferChunk) {
            this.#gltf = _gltf;
            this.#url = _url;
            if (_bufferChunk)
                this.#buffers = [_bufferChunk];
        }
        static get defaultMaterial() {
            if (!this.#defaultMaterial) {
                this.#defaultMaterial = new FudgeCore.Material("GLTFDefaultMaterial", FudgeCore.ShaderPhong, new FudgeCore.CoatRemissive(FudgeCore.Color.CSS("white"), 1, 0.5));
                FudgeCore.Project.deregister(this.#defaultMaterial);
            }
            return this.#defaultMaterial;
        }
        static get defaultSkinMaterial() {
            if (!this.#defaultSkinMaterial) {
                this.#defaultSkinMaterial = new FudgeCore.Material("GLTFDefaultSkinMaterial", FudgeCore.ShaderPhongSkin, new FudgeCore.CoatRemissive(FudgeCore.Color.CSS("white"), 1, 0.5));
                FudgeCore.Project.deregister(this.#defaultSkinMaterial);
            }
            return this.#defaultSkinMaterial;
        }
        static async loadResource(_resource, _url) {
            const loader = await GLTFLoader.LOAD((_resource.url ?? _url).toString());
            if (!loader) {
                if (!(_resource instanceof FudgeCore.GraphInstance))
                    _resource.status = FudgeCore.RESOURCE_STATUS.ERROR;
                return _resource;
            }
            let loaded;
            if (_resource instanceof FudgeCore.GraphInstance)
                loaded = await loader.getGraph(_resource.get().name, _resource);
            else if (_resource instanceof FudgeCore.GraphGLTF)
                loaded = await loader.getGraph(_resource.name, _resource);
            else if (_resource instanceof FudgeCore.MeshGLTF)
                loaded = await loader.getMesh(_resource.name, _resource.iPrimitive, _resource);
            else if (_resource instanceof FudgeCore.MaterialGLTF)
                loaded = await loader.getMaterial(_resource.name, _resource);
            else if (_resource instanceof FudgeCore.AnimationGLTF)
                loaded = await loader.getAnimation(_resource.name, _resource);
            if (!loaded) {
                FudgeCore.Debug.error(`${_resource.constructor.name} | ${_resource instanceof FudgeCore.GraphInstance ? _resource.idSource : _resource.idResource}: Failed to load resource.`);
                if (!(_resource instanceof FudgeCore.GraphInstance))
                    _resource.status = FudgeCore.RESOURCE_STATUS.ERROR;
                return _resource;
            }
            if (!(loaded instanceof FudgeCore.GraphInstance)) {
                loaded.status = FudgeCore.RESOURCE_STATUS.READY;
            }
            return loaded;
        }
        static async LOAD(_url, _registerResources = false) {
            if (!this.loaders)
                GLTFLoader.loaders = {};
            if (!this.loaders[_url]) {
                let gltf;
                let buffer;
                try {
                    const response = await fetch(new URL(_url, FudgeCore.Project.baseURL));
                    const fileExtension = _url.split('.').pop()?.toLowerCase();
                    if (fileExtension == "gltf")
                        gltf = await response.json();
                    if (fileExtension == "glb") {
                        const arrayBuffer = await response.arrayBuffer();
                        const dataView = new DataView(arrayBuffer);
                        const magic = dataView.getUint32(0, true);
                        if (magic !== 0x46546C67)
                            throw new Error(`${GLTFLoader.name} | ${_url}: Invalid magic number in GLB file.`);
                        const version = dataView.getUint32(4, true);
                        if (version != 2)
                            throw new Error(`${GLTFLoader.name} | ${_url}: Unsupported version in GLB file.`);
                        const jsonLength = dataView.getUint32(12, true);
                        const jsonFormat = dataView.getUint32(16, true);
                        if (jsonFormat !== 0x4E4F534A)
                            throw new Error('Invalid format. The first chunk of the file is not in JSON format.');
                        const decoder = new TextDecoder();
                        const jsonChunk = decoder.decode(new Uint8Array(arrayBuffer, 20, jsonLength));
                        gltf = JSON.parse(jsonChunk);
                        if (arrayBuffer.byteLength >= 20 + jsonLength) {
                            const binaryLength = dataView.getUint32(20 + jsonLength, true);
                            const binaryFormat = dataView.getUint32(24 + jsonLength, true);
                            if (binaryFormat !== 0x004E4942)
                                throw new Error('Invalid format. The second chunk of the file is not in binary format.');
                            buffer = arrayBuffer.slice(28 + jsonLength, 28 + jsonLength + binaryLength);
                        }
                    }
                }
                catch (error) {
                    FudgeCore.Debug.error(`${GLTFLoader.name} | ${_url}: Failed to load file. ${error}`);
                    return null;
                }
                GLTFLoader.checkCompatibility(gltf, _url);
                GLTFLoader.preProcess(gltf, _url);
                GLTFLoader.loaders[_url] = new GLTFLoader(gltf, _url, buffer);
            }
            return GLTFLoader.loaders[_url];
        }
        static checkCompatibility(_gltf, _url) {
            if (_gltf.asset.version != "2.0")
                FudgeCore.Debug.warn(`${GLTFLoader.name} | ${_url}: This loader was developed for glTF 2.0. It may not work as intended with version ${_gltf.asset.version}.`);
            if (_gltf.asset.minVersion != undefined && _gltf.asset.minVersion != "2.0")
                throw new Error(`${GLTFLoader.name} | ${_url}: This loader was developed for glTF 2.0. It does not work with required min version ${_gltf.asset.minVersion}.`);
            if (_gltf.extensionsUsed?.length > 0)
                FudgeCore.Debug.warn(`${GLTFLoader.name} | ${_url}: This loader does not support glTF extensions. It may not work as intended with extensions ${_gltf.extensionsUsed.toString()}.`);
            if (_gltf.extensionsRequired?.length > 0)
                throw new Error(`${GLTFLoader.name} | ${_url}: This loader does not support glTF extensions. It does not work with required extensions ${_gltf.extensionsRequired.toString()}.`);
        }
        static preProcess(_gltf, _url) {
            if (_gltf.scenes) {
                _gltf.scene = _gltf.scene ?? 0;
                addNames("Scene", _gltf.scenes);
            }
            if (_gltf.nodes) {
                _gltf.animations?.forEach(_animation => {
                    _animation.channels.forEach(_channel => {
                        const iNode = _channel.target.node;
                        if (iNode != undefined)
                            _gltf.nodes[iNode].isAnimated = true;
                    });
                });
                _gltf.nodes.forEach((_node, _iNode) => _node.children?.forEach(_iChild => _gltf.nodes[_iChild].parent = _iNode));
                _gltf.nodes.forEach((_node, _iNode) => {
                    if (_node.name == undefined)
                        _node.name = `Node${_iNode}`;
                    if (_node.isAnimated) {
                        let iParent = _node.parent;
                        let path = [];
                        path.push(_iNode);
                        while (iParent != undefined) {
                            path.push(iParent);
                            iParent = _gltf.nodes[iParent].parent;
                        }
                        _node.path = path.reverse();
                    }
                });
            }
            if (_gltf.materials)
                addNames("Material", _gltf.materials);
            if (_gltf.meshes)
                addNames("Mesh", _gltf.meshes);
            if (_gltf.animations)
                addNames("Animation", _gltf.animations);
            function addNames(_template, _target) {
                _target.forEach((_item, _index) => {
                    if (_item.name == undefined)
                        _item.name = `${_template}${_index}`;
                });
            }
        }
        get name() {
            return this.#url.split("\\").pop();
        }
        async loadResources(_class) {
            let resources = [];
            switch (_class.name) {
                case FudgeCore.Graph.name:
                    for (let iScene = 0; iScene < this.#gltf.scenes?.length; iScene++)
                        resources.push(await this.getGraph(iScene, new FudgeCore.GraphGLTF()));
                    break;
                case FudgeCore.Mesh.name:
                    for (let iMesh = 0; iMesh < this.#gltf.meshes?.length; iMesh++)
                        for (let iPrimitive = 0; iPrimitive < this.#gltf.meshes[iMesh].primitives.length; iPrimitive++)
                            resources.push(await this.getMesh(iMesh, iPrimitive, new FudgeCore.MeshGLTF()));
                    break;
                case FudgeCore.Material.name:
                    for (let iMaterial = 0; iMaterial < this.#gltf.materials?.length; iMaterial++)
                        resources.push(await this.getMaterial(iMaterial, new FudgeCore.MaterialGLTF("Hi :)")));
                    break;
                case FudgeCore.Animation.name:
                    for (let iAnimation = 0; iAnimation < this.#gltf.animations?.length; iAnimation++)
                        resources.push(await this.getAnimation(iAnimation, new FudgeCore.AnimationGLTF()));
                    break;
            }
            for (const resource of resources) {
                if (!FudgeCore.Project.resources[resource.idResource])
                    FudgeCore.Project.register(resource);
                resource.status = FudgeCore.RESOURCE_STATUS.READY;
            }
            return resources;
        }
        async getGraph(_iScene = this.#gltf.scene, _graphOut) {
            _iScene = this.getIndex(_iScene, this.#gltf.scenes);
            if (_iScene == -1)
                return null;
            const id = `${FudgeCore.GraphGLTF.name}|${_iScene}`;
            if (!_graphOut && this.#resources[id])
                return this.#resources[id];
            let cache = {
                nodes: [],
                skeletons: []
            };
            const gltfScene = this.#gltf.scenes[_iScene];
            const graph = _graphOut ?? new FudgeCore.GraphGLTF();
            graph.name = gltfScene.name;
            if (graph instanceof FudgeCore.GraphGLTF)
                graph.url = this.#url;
            if (_graphOut) {
                _graphOut.removeAllChildren();
                _graphOut.removeComponents(FudgeCore.ComponentSkeleton);
            }
            for (const iNode of gltfScene.nodes)
                graph.addChild(await this.getNodeByIndex(iNode, cache));
            for (const skeleton of cache.skeletons)
                graph.addComponent(skeleton);
            if (!_graphOut)
                this.#resources[id] = graph;
            return graph;
        }
        async getAnimation(_iAnimation, _animationOut) {
            _iAnimation = this.getIndex(_iAnimation, this.#gltf.animations);
            if (_iAnimation == -1)
                return null;
            const id = `${FudgeCore.Animation.name}|${_iAnimation}`;
            if (!_animationOut && this.#resources[id])
                return this.#resources[id];
            const gltfAnimation = this.#gltf.animations?.[_iAnimation];
            if (!gltfAnimation)
                throw new Error(`${this}: Couldn't find animation with index ${_iAnimation}.`);
            const animationStructure = {};
            for (const gltfChannel of gltfAnimation.channels) {
                if (gltfChannel.target.path == "weights") {
                    FudgeCore.Debug.warn(`${this}: Animation with index ${_iAnimation} has a target path of 'weights'. FUDGE does not support morph targets.`);
                    continue;
                }
                const gltfNode = this.#gltf.nodes[gltfChannel.target.node];
                if (!gltfNode)
                    continue;
                let node = animationStructure;
                for (const iNode of gltfNode.path) {
                    const childName = this.#gltf.nodes[iNode].name;
                    node = (node.children ??= {})[childName] ??= {};
                }
                let mtxLocal = ((((node.components ??= {}).ComponentTransform ??= [])[0] ??= {}).mtxLocal ??= {});
                mtxLocal[toInternTransformation[gltfChannel.target.path]] =
                    await this.getAnimationSequence(gltfAnimation.samplers[gltfChannel.sampler], gltfChannel.target.path);
            }
            const animation = _animationOut ?? new FudgeCore.AnimationGLTF();
            animation.animationStructure = animationStructure;
            animation.clearCache();
            animation.name = gltfAnimation.name;
            animation.calculateTotalTime();
            if (animation instanceof FudgeCore.AnimationGLTF)
                animation.url = this.#url;
            if (!_animationOut) {
                FudgeCore.Project.deregister(animation);
                this.#resources[id] = animation;
            }
            return animation;
        }
        async getAnimationNew(_iAnimation, _animationOut) {
            _iAnimation = this.getIndex(_iAnimation, this.#gltf.animations);
            if (_iAnimation == -1)
                return null;
            const id = `${FudgeCore.Animation.name}|${_iAnimation}`;
            if (!_animationOut && this.#resources[id])
                return this.#resources[id];
            const gltfAnimation = this.#gltf.animations?.[_iAnimation];
            if (!gltfAnimation)
                throw new Error(`${this}: Couldn't find animation with index ${_iAnimation}.`);
            const gltfChannels = gltfAnimation.channels;
            const channels = new Array(gltfChannels.length);
            let duration = 0;
            for (let i = 0; i < gltfChannels.length; i++) {
                const gltfChannel = gltfChannels[i];
                const gltfTarget = gltfChannel.target;
                const gltfPath = gltfTarget.path;
                if (gltfPath == "weights") {
                    FudgeCore.Debug.warn(`${this}: Animation with index ${_iAnimation} has a target path of 'weights'. FUDGE does not support morph targets.`);
                    continue;
                }
                const gltfNode = this.#gltf.nodes[gltfTarget.node];
                if (!gltfNode)
                    continue;
                const path = `${gltfNode.path.map((_iNode) => `${this.#gltf.nodes[_iNode].name}`).join("/")}/components/ComponentTransform/0/mtxLocal/${toInternTransformationNew[gltfPath]}`;
                const sampler = gltfAnimation.samplers[gltfChannel.sampler];
                const interpolation = this.toInternInterpolation(sampler.interpolation);
                const input = (await this.getFloat32Array(sampler.input)).map((_time) => _time * 1000);
                duration = Math.max(duration, input[input.length - 1]);
                const output = await this.getFloat32Array(sampler.output);
                if (gltfPath == "rotation")
                    channels[i] = new FudgeCore.AnimationSystem.AnimationChannelQuaternion(path, input, output, interpolation);
                else
                    channels[i] = new FudgeCore.AnimationSystem.AnimationChannelVector(path, input, output, interpolation);
            }
            const animation = new FudgeCore.AnimationSystem.Animation();
            animation.name = gltfAnimation.name;
            animation.channels = channels;
            animation.duration = duration;
            return animation;
        }
        async getMesh(_iMesh, _iPrimitive = 0, _meshOut) {
            _iMesh = this.getIndex(_iMesh, this.#gltf.meshes);
            if (_iMesh == -1)
                return null;
            const id = `${FudgeCore.MeshGLTF.name}|${_iMesh}|${_iPrimitive}`;
            if (!_meshOut && this.#resources[id])
                return this.#resources[id];
            const gltfMesh = this.#gltf.meshes[_iMesh];
            const gltfPrimitive = gltfMesh.primitives[_iPrimitive];
            if (gltfPrimitive.indices == undefined)
                FudgeCore.Debug.warn(`${this}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has no indices. FUDGE does not support non-indexed meshes.`);
            if (gltfPrimitive.attributes.POSITION == undefined)
                FudgeCore.Debug.warn(`${this}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has no position attribute. Primitive will be ignored.`);
            if (gltfPrimitive.mode != undefined && gltfPrimitive.mode != GLTF.MESH_PRIMITIVE_MODE.TRIANGLES)
                FudgeCore.Debug.warn(`${this}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has topology type mode ${GLTF.MESH_PRIMITIVE_MODE[gltfPrimitive.mode]}. FUDGE only supports ${GLTF.MESH_PRIMITIVE_MODE[4]}.`);
            checkMaxSupport(this, "TEXCOORD", 2);
            checkMaxSupport(this, "COLOR", 1);
            checkMaxSupport(this, "JOINTS", 1);
            checkMaxSupport(this, "WEIGHTS", 1);
            let positions, indices;
            let normals, tangents;
            let colors, textureUVs;
            let bones, weights;
            if (gltfPrimitive.indices != undefined) {
                indices = await this.getVertexIndices(gltfPrimitive.indices);
                for (let i = 0; i < indices.length; i += 3) {
                    const temp = indices[i + 2];
                    indices[i + 2] = indices[i + 0];
                    indices[i + 0] = indices[i + 1];
                    indices[i + 1] = temp;
                }
            }
            else {
                FudgeCore.Debug.warn(`${this}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has no indices. FUDGE does not support non-indexed meshes.`);
            }
            if (gltfPrimitive.attributes.POSITION != undefined)
                positions = await this.getFloat32Array(gltfPrimitive.attributes.POSITION);
            else
                FudgeCore.Debug.warn(`${this}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has no position attribute. Primitive will be ignored.`);
            if (gltfPrimitive.attributes.NORMAL != undefined)
                normals = await this.getFloat32Array(gltfPrimitive.attributes.NORMAL);
            if (gltfPrimitive.attributes.TANGENT != undefined)
                tangents = await this.getFloat32Array(gltfPrimitive.attributes.TANGENT);
            if (gltfPrimitive.attributes.TEXCOORD_1 != undefined)
                textureUVs = await this.getFloat32Array(gltfPrimitive.attributes.TEXCOORD_1);
            else if (gltfPrimitive.attributes.TEXCOORD_0 != undefined)
                textureUVs = await this.getFloat32Array(gltfPrimitive.attributes.TEXCOORD_0);
            if (gltfPrimitive.attributes.COLOR_0 != undefined)
                colors = await this.getVertexColors(gltfPrimitive.attributes.COLOR_0);
            if (gltfPrimitive.attributes.JOINTS_0 != undefined && gltfPrimitive.attributes.WEIGHTS_0 != undefined) {
                bones = await this.getBoneIndices(gltfPrimitive.attributes.JOINTS_0);
                weights = await this.getFloat32Array(gltfPrimitive.attributes.WEIGHTS_0);
            }
            const mesh = _meshOut ?? new FudgeCore.MeshGLTF();
            mesh.name = gltfMesh.name;
            if (mesh instanceof FudgeCore.MeshGLTF) {
                mesh.iPrimitive = _iPrimitive;
                mesh.url = this.#url;
            }
            if (_meshOut) {
                _meshOut.clear();
                _meshOut.faces = [];
                _meshOut.vertices = new FudgeCore.Vertices();
            }
            if (!normals || !tangents) {
                for (let iVector2 = 0, iVector3 = 0, iVector4 = 0; iVector3 < positions?.length; iVector2 += 2, iVector3 += 3, iVector4 += 4) {
                    mesh.vertices.push(new FudgeCore.Vertex(new FudgeCore.Vector3(positions[iVector3 + 0], positions[iVector3 + 1], positions[iVector3 + 2]), textureUVs && new FudgeCore.Vector2(textureUVs[iVector2 + 0], textureUVs[iVector2 + 1]), normals && new FudgeCore.Vector3(normals[iVector3 + 0], normals[iVector3 + 1], normals[iVector3 + 2]), tangents && new FudgeCore.Vector4(tangents[iVector4 + 0], tangents[iVector4 + 1], tangents[iVector4 + 2], tangents[iVector4 + 3]), colors && new FudgeCore.Color(colors[iVector4 + 0], colors[iVector4 + 1], colors[iVector4 + 2], colors[iVector4 + 3]), bones && weights && [
                        { index: bones[iVector4 + 0], weight: weights[iVector4 + 0] },
                        { index: bones[iVector4 + 1], weight: weights[iVector4 + 1] },
                        { index: bones[iVector4 + 2], weight: weights[iVector4 + 2] },
                        { index: bones[iVector4 + 3], weight: weights[iVector4 + 3] }
                    ]));
                }
                for (let iFaceVertexIndex = 0; iFaceVertexIndex < indices?.length; iFaceVertexIndex += 3) {
                    try {
                        mesh.faces.push(new FudgeCore.Face(mesh.vertices, indices[iFaceVertexIndex + 0], indices[iFaceVertexIndex + 1], indices[iFaceVertexIndex + 2]));
                    }
                    catch (_e) {
                        FudgeCore.Debug.fudge("Face excluded", _e.message);
                    }
                }
            }
            const renderMesh = mesh.renderMesh;
            renderMesh.positions = positions;
            renderMesh.indices = indices;
            renderMesh.normals = normals;
            renderMesh.tangents = tangents;
            renderMesh.textureUVs = textureUVs;
            renderMesh.colors = colors;
            renderMesh.bones = bones;
            renderMesh.weights = weights;
            if (!_meshOut) {
                FudgeCore.Project.deregister(mesh);
                this.#resources[id] = mesh;
            }
            return mesh;
            function checkMaxSupport(_loader, _check, _max) {
                if (Object.keys(gltfPrimitive.attributes).filter((_key) => _key.startsWith(_check)).length > _max)
                    FudgeCore.Debug.warn(`${_loader}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has more than ${_max} sets of '${_check}' associated with it. FUGDE only supports up to ${_max} ${_check} sets per primitive.`);
            }
        }
        async getMaterial(_iMaterial, _materialOut, _skin = false) {
            _iMaterial = this.getIndex(_iMaterial, this.#gltf.materials);
            if (_iMaterial == -1)
                return null;
            const id = `${FudgeCore.Material.name}|${_iMaterial}`;
            if (this.#resources[id] && !_materialOut)
                return this.#resources[id];
            const gltfMaterial = this.#gltf.materials[_iMaterial];
            if (!gltfMaterial)
                throw new Error(`${this}: Couldn't find material with index ${_iMaterial}.`);
            const gltfBaseColorFactor = gltfMaterial.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1];
            const gltfMetallicFactor = gltfMaterial.pbrMetallicRoughness?.metallicFactor ?? 1;
            const gltfRoughnessFactor = gltfMaterial.pbrMetallicRoughness?.roughnessFactor ?? 1;
            const gltfEmissiveFactor = gltfMaterial.emissiveFactor ?? [0, 0, 0];
            const gltfBaseColorTexture = gltfMaterial.pbrMetallicRoughness?.baseColorTexture;
            const gltfNormalTexture = gltfMaterial.normalTexture;
            const diffuse = 1;
            const specular = 1.8 * (1 - gltfRoughnessFactor) + 0.6 * gltfMetallicFactor;
            const intensity = 0.7 * (1 - gltfRoughnessFactor) + gltfMetallicFactor;
            const metallic = gltfMetallicFactor;
            const isLit = gltfEmissiveFactor[0] > 0 || gltfEmissiveFactor[1] > 0 || gltfEmissiveFactor[2] > 0;
            const color = new FudgeCore.Color(...gltfBaseColorFactor);
            if (isLit)
                color.add(new FudgeCore.Color(...gltfEmissiveFactor, 0));
            const coat = gltfBaseColorTexture ?
                isLit ? new FudgeCore.CoatTextured(color, await this.getTexture(gltfBaseColorTexture.index)) :
                    gltfNormalTexture ?
                        new FudgeCore.CoatRemissiveTexturedNormals(color, await this.getTexture(gltfBaseColorTexture.index), await this.getTexture(gltfNormalTexture.index), diffuse, specular, intensity, metallic) :
                        new FudgeCore.CoatRemissiveTextured(color, await this.getTexture(gltfBaseColorTexture.index), diffuse, specular, intensity, metallic) :
                isLit ? new FudgeCore.CoatColored(color) : new FudgeCore.CoatRemissive(color, diffuse, specular, intensity, metallic);
            if (gltfMaterial.alphaCutoff != undefined)
                coat.alphaClip = gltfMaterial.alphaCutoff;
            let shader;
            if (isLit) {
                shader = gltfBaseColorTexture ?
                    (_skin ? FudgeCore.ShaderLitTexturedSkin : FudgeCore.ShaderLitTextured) :
                    (_skin ? FudgeCore.ShaderLitSkin : FudgeCore.ShaderLit);
            }
            else {
                shader = gltfBaseColorTexture ?
                    gltfNormalTexture ?
                        (_skin ? FudgeCore.ShaderPhongTexturedNormalsSkin : FudgeCore.ShaderPhongTexturedNormals) :
                        (_skin ? FudgeCore.ShaderPhongTexturedSkin : FudgeCore.ShaderPhongTextured) :
                    (_skin ? FudgeCore.ShaderPhongSkin : FudgeCore.ShaderPhong);
            }
            const material = _materialOut ?? new FudgeCore.MaterialGLTF(gltfMaterial.name);
            material.name = gltfMaterial.name;
            material.coat = coat;
            Reflect.set(material, "shaderType", shader);
            if (material instanceof FudgeCore.MaterialGLTF)
                material.url = this.#url;
            if (!_materialOut) {
                FudgeCore.Project.deregister(material);
                this.#resources[id] = material;
            }
            return material;
        }
        async getTexture(_iTexture) {
            const id = `${FudgeCore.Texture.name}|${_iTexture}`;
            if (this.#resources[id])
                return this.#resources[id];
            const gltfTexture = this.#gltf.textures[_iTexture];
            const gltfSampler = this.#gltf.samplers?.[gltfTexture.sampler];
            const gltfImage = this.#gltf.images?.[gltfTexture.source];
            if (gltfImage == undefined) {
                FudgeCore.Debug.warn(`${this}: Texture with index ${_iTexture} has no image.`);
                return FudgeCore.TextureDefault.color;
            }
            let url = new URL(gltfImage.uri, new URL(this.#url, FudgeCore.Project.baseURL)).toString();
            if (!gltfImage.uri && gltfImage.bufferView) {
                const gltfBufferView = this.#gltf.bufferViews[gltfImage.bufferView];
                const buffer = await this.getBuffer(gltfBufferView.buffer);
                const byteOffset = gltfBufferView.byteOffset || 0;
                const byteLength = gltfBufferView.byteLength || 0;
                url = URL.createObjectURL(new Blob([new Uint8Array(buffer, byteOffset, byteLength / Uint8Array.BYTES_PER_ELEMENT)], { type: gltfImage.mimeType }));
            }
            const texture = new FudgeCore.TextureImage();
            await texture.load(url);
            if (gltfSampler) {
                gltfSampler.magFilter = gltfSampler.magFilter ?? WebGL2RenderingContext.NEAREST;
                gltfSampler.minFilter = gltfSampler.minFilter ?? WebGL2RenderingContext.NEAREST;
                if (gltfSampler.magFilter == WebGL2RenderingContext.NEAREST && gltfSampler.minFilter == WebGL2RenderingContext.NEAREST)
                    texture.mipmap = FudgeCore.MIPMAP.CRISP;
                else if (gltfSampler.magFilter == WebGL2RenderingContext.NEAREST && gltfSampler.minFilter == WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR)
                    texture.mipmap = FudgeCore.MIPMAP.MEDIUM;
                else if (gltfSampler.magFilter == WebGL2RenderingContext.LINEAR && gltfSampler.minFilter == WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR)
                    texture.mipmap = FudgeCore.MIPMAP.BLURRY;
                else
                    FudgeCore.Debug.warn(`${this}: Texture with index ${_iTexture} has a magFilter and minFilter of '${getWebGLParameterName(gltfSampler.magFilter)}' and '${getWebGLParameterName(gltfSampler.minFilter)}' respectively. FUDGE only supports the following combinations: NEAREST and NEAREST | NEAREST and NEAREST_MIPMAP_LINEAR | LINEAR and LINEAR_MIPMAP_LINEAR.`);
                gltfSampler.wrapS = gltfSampler.wrapS ?? WebGL2RenderingContext.REPEAT;
                gltfSampler.wrapT = gltfSampler.wrapT ?? WebGL2RenderingContext.REPEAT;
                if (gltfSampler.wrapS == WebGL2RenderingContext.REPEAT && gltfSampler.wrapT == WebGL2RenderingContext.REPEAT)
                    texture.wrap = FudgeCore.WRAP.REPEAT;
                else if (gltfSampler.wrapS == WebGL2RenderingContext.CLAMP_TO_EDGE && gltfSampler.wrapT == WebGL2RenderingContext.CLAMP_TO_EDGE)
                    texture.wrap = FudgeCore.WRAP.CLAMP;
                else if (gltfSampler.wrapS == WebGL2RenderingContext.MIRRORED_REPEAT && gltfSampler.wrapT == WebGL2RenderingContext.MIRRORED_REPEAT)
                    texture.wrap = FudgeCore.WRAP.MIRROR;
                else
                    FudgeCore.Debug.warn(`${this}: Texture with index ${_iTexture} has a wrapS and wrapT of '${getWebGLParameterName(gltfSampler.wrapS)}' and '${getWebGLParameterName(gltfSampler.wrapT)}' respectively. FUDGE only supports the following combinations: REPEAT and REPEAT | CLAMP_TO_EDGE and CLAMP_TO_EDGE | MIRRORED_REPEAT and MIRRORED_REPEAT.`);
            }
            FudgeCore.Project.deregister(texture);
            this.#resources[id] = texture;
            return texture;
        }
        toString() {
            return `${GLTFLoader.name} | ${this.#url}`;
        }
        async getNodeByIndex(_iNode, _cache) {
            if (!_cache.nodes[_iNode]) {
                const gltfNode = this.#gltf.nodes[_iNode];
                const node = new FudgeCore.Node(gltfNode.name);
                _cache.nodes[_iNode] = node;
                if (gltfNode.children)
                    for (const iNode of gltfNode.children)
                        node.addChild(await this.getNodeByIndex(iNode, _cache));
                if (gltfNode.matrix || gltfNode.rotation || gltfNode.scale || gltfNode.translation || gltfNode.isAnimated) {
                    node.addComponent(new FudgeCore.ComponentTransform());
                    if (gltfNode.matrix) {
                        node.mtxLocal.fromArray(gltfNode.matrix);
                    }
                    else {
                        if (gltfNode.translation) {
                            const translation = FudgeCore.Recycler.get(FudgeCore.Vector3);
                            translation.fromArray(gltfNode.translation);
                            node.mtxLocal.translation = translation;
                            FudgeCore.Recycler.store(translation);
                        }
                        if (gltfNode.rotation) {
                            const rotation = FudgeCore.Recycler.get(FudgeCore.Quaternion);
                            rotation.fromArray(gltfNode.rotation);
                            node.mtxLocal.rotation = rotation;
                            FudgeCore.Recycler.store(rotation);
                        }
                        if (gltfNode.scale) {
                            const scale = FudgeCore.Recycler.get(FudgeCore.Vector3);
                            scale.fromArray(gltfNode.scale);
                            node.mtxLocal.scaling = scale;
                            FudgeCore.Recycler.store(scale);
                        }
                    }
                }
                if (gltfNode.camera != undefined) {
                    node.addComponent(await this.getCameraByIndex(gltfNode.camera));
                }
                if (gltfNode.mesh != undefined) {
                    const gltfMesh = this.#gltf.meshes?.[gltfNode.mesh];
                    const subComponents = [];
                    for (let iPrimitive = 0; iPrimitive < gltfMesh.primitives.length; iPrimitive++) {
                        const cmpMesh = new FudgeCore.ComponentMesh(await this.getMesh(gltfNode.mesh, iPrimitive));
                        const isSkin = gltfNode.skin != undefined;
                        if (isSkin)
                            cmpMesh.skeleton = await this.getSkeletonByIndex(gltfNode.skin, _cache);
                        let cmpMaterial;
                        const iMaterial = gltfMesh.primitives?.[iPrimitive]?.material;
                        if (iMaterial == undefined) {
                            cmpMaterial = new FudgeCore.ComponentMaterial(isSkin ?
                                GLTFLoader.defaultSkinMaterial :
                                GLTFLoader.defaultMaterial);
                        }
                        else {
                            cmpMaterial = new FudgeCore.ComponentMaterial(await this.getMaterial(iMaterial, null, isSkin));
                            const gltfMaterial = this.#gltf.materials[iMaterial];
                            if (gltfMaterial)
                                cmpMaterial.sortForAlpha = gltfMaterial.alphaMode == "BLEND";
                        }
                        subComponents.push([cmpMesh, cmpMaterial]);
                    }
                    if (subComponents.length == 1) {
                        node.addComponent(subComponents[0][0]);
                        node.addComponent(subComponents[0][1]);
                    }
                    else {
                        subComponents.forEach(([_cmpMesh, _cmpMaterial], _i) => {
                            const nodePart = new FudgeCore.Node(`${node.name}_Primitive${_i}`);
                            nodePart.addComponent(_cmpMesh);
                            nodePart.addComponent(_cmpMaterial);
                            node.addChild(nodePart);
                        });
                    }
                }
            }
            return _cache.nodes[_iNode];
        }
        async getSkeletonByIndex(_iSkeleton, _cache) {
            if (!_cache.skeletons[_iSkeleton]) {
                const gltfSkin = this.#gltf.skins[_iSkeleton];
                const bones = [];
                let mtxData;
                if (gltfSkin.inverseBindMatrices != undefined)
                    mtxData = await this.getFloat32Array(gltfSkin.inverseBindMatrices);
                const mtxDataSpan = 16;
                const mtxBindInverses = [];
                for (let iBone = 0; iBone < gltfSkin.joints.length; iBone++) {
                    let mtxBindInverse;
                    if (mtxData)
                        mtxBindInverse = new FudgeCore.Matrix4x4(mtxData.slice(iBone * mtxDataSpan, (iBone + 1) * mtxDataSpan));
                    bones.push(await this.getNodeByIndex(gltfSkin.joints[iBone], _cache));
                    mtxBindInverses.push(mtxBindInverse);
                }
                _cache.skeletons[_iSkeleton] = new FudgeCore.ComponentSkeleton(bones, mtxBindInverses);
            }
            return _cache.skeletons[_iSkeleton];
        }
        async getCameraByIndex(_iCamera) {
            const gltfCamera = this.#gltf.cameras[_iCamera];
            const camera = new FudgeCore.ComponentCamera();
            if (gltfCamera.perspective)
                camera.projectCentral(gltfCamera.perspective.aspectRatio, gltfCamera.perspective.yfov * FudgeCore.Calc.rad2deg, null, gltfCamera.perspective.znear, gltfCamera.perspective.zfar);
            else
                camera.projectOrthographic(-gltfCamera.orthographic.xmag, gltfCamera.orthographic.xmag, -gltfCamera.orthographic.ymag, gltfCamera.orthographic.ymag);
            return camera;
        }
        getIndex(_nameOrIndex, _array) {
            let index = typeof _nameOrIndex == "number" ?
                _nameOrIndex :
                _array.findIndex(_object => _object.name == _nameOrIndex);
            if (index == -1) {
                let arrayName = Object.entries(this.#gltf).find(([_key, _value]) => _value == _array)?.[0];
                FudgeCore.Debug.error(`${this}: Couldn't find name '${_nameOrIndex}' in glTF ${arrayName}.`);
            }
            return index;
        }
        async getBoneIndices(_iAccessor) {
            const array = await this.getBufferData(_iAccessor);
            const componentType = this.#gltf.accessors[_iAccessor]?.componentType;
            if (componentType == GLTF.COMPONENT_TYPE.UNSIGNED_BYTE)
                return array;
            if (componentType == GLTF.COMPONENT_TYPE.UNSIGNED_SHORT) {
                FudgeCore.Debug.log(`${this}: Bone indices are stored as '${GLTF.COMPONENT_TYPE[GLTF.COMPONENT_TYPE.UNSIGNED_SHORT]}'. FUDGE will convert them to '${GLTF.COMPONENT_TYPE[GLTF.COMPONENT_TYPE.UNSIGNED_BYTE]}'. FUDGE only supports skeletons with up to 256 bones, so make sure your skeleton has no more than 256 bones.`);
                return Uint8Array.from(array);
            }
            throw new Error(`${this}: Invalid component type '${GLTF.COMPONENT_TYPE[componentType]}' for bone indices. Expected '${GLTF.COMPONENT_TYPE[GLTF.COMPONENT_TYPE.UNSIGNED_BYTE]}' or '${GLTF.COMPONENT_TYPE[GLTF.COMPONENT_TYPE.UNSIGNED_SHORT]}'.`);
        }
        async getFloat32Array(_iAccessor) {
            const array = await this.getBufferData(_iAccessor);
            const gltfAccessor = this.#gltf.accessors[_iAccessor];
            if (gltfAccessor.componentType == GLTF.COMPONENT_TYPE.FLOAT)
                return array;
            if (gltfAccessor.normalized) {
                switch (gltfAccessor.componentType) {
                    case GLTF.COMPONENT_TYPE.BYTE:
                        return Float32Array.from(array, _value => Math.max(_value / 127, -1));
                    case GLTF.COMPONENT_TYPE.UNSIGNED_BYTE:
                        return Float32Array.from(array, _value => _value / 255);
                    case GLTF.COMPONENT_TYPE.SHORT:
                        return Float32Array.from(array, _value => Math.max(_value / 32767, -1));
                    case GLTF.COMPONENT_TYPE.UNSIGNED_SHORT:
                        return Float32Array.from(array, _value => _value / 65535);
                    default:
                        throw new Error(`${this}: Invalid component type '${GLTF.COMPONENT_TYPE[gltfAccessor.componentType]}' for normalized accessor.`);
                }
            }
            FudgeCore.Debug.warn(`${this}: Expected component type '${GLTF.COMPONENT_TYPE[GLTF.COMPONENT_TYPE.FLOAT]}' but was '${GLTF.COMPONENT_TYPE[gltfAccessor?.componentType]}'.`);
            return Float32Array.from(array);
        }
        async getVertexIndices(_iAccessor) {
            const array = await this.getBufferData(_iAccessor);
            const gltfAccessor = this.#gltf.accessors[_iAccessor];
            if (gltfAccessor.componentType == GLTF.COMPONENT_TYPE.UNSIGNED_SHORT)
                return array;
            if (gltfAccessor.count > 65535 && gltfAccessor.type == "SCALAR")
                throw new Error(`${this}: File includes a mesh with more than 65535 vertices. FUDGE does not support meshes with more than 65535 vertices.`);
            if (gltfAccessor.componentType == GLTF.COMPONENT_TYPE.UNSIGNED_BYTE || gltfAccessor.componentType == GLTF.COMPONENT_TYPE.UNSIGNED_INT)
                return Uint16Array.from(array);
            FudgeCore.Debug.warn(`${this}: Expected an unsigned integer component type but was '${GLTF.COMPONENT_TYPE[this.#gltf.accessors[_iAccessor]?.componentType]}'.`);
            return Uint16Array.from(array);
        }
        async getVertexColors(_iAccessor) {
            const array = await this.getFloat32Array(_iAccessor);
            const gltfAccessor = this.#gltf.accessors[_iAccessor];
            if (gltfAccessor.type == GLTF.ACCESSOR_TYPE.VEC3) {
                const rgbaArray = new Float32Array(array.length * 4 / 3);
                for (let iVec3 = 0, iVec4 = 0; iVec3 < array.length; iVec3 += 3, iVec4 += 4) {
                    rgbaArray[iVec4] = array[iVec3];
                    rgbaArray[iVec4 + 1] = array[iVec3 + 1];
                    rgbaArray[iVec4 + 2] = array[iVec3 + 2];
                    rgbaArray[iVec4 + 3] = 1;
                }
                return rgbaArray;
            }
            return array;
        }
        async getBufferData(_iAccessor) {
            const gltfAccessor = this.#gltf.accessors[_iAccessor];
            if (!gltfAccessor)
                throw new Error(`${this}: Couldn't find accessor with index ${_iAccessor}.`);
            let array;
            const componentType = gltfAccessor.componentType;
            const accessorType = gltfAccessor.type;
            if (gltfAccessor.bufferView != undefined)
                array = await this.getBufferViewData(this.#gltf.bufferViews[gltfAccessor.bufferView], gltfAccessor.byteOffset, componentType, accessorType);
            if (gltfAccessor.sparse) {
                const gltfBufferViewIndices = this.#gltf.bufferViews[gltfAccessor.sparse.indices.bufferView];
                const gltfBufferViewValues = this.#gltf.bufferViews[gltfAccessor.sparse.values.bufferView];
                if (!gltfBufferViewIndices || !gltfBufferViewValues)
                    throw new Error(`${this}: Couldn't find buffer views for sparse indices or values of accessor with index ${_iAccessor}.`);
                const arrayIndices = await this.getBufferViewData(gltfBufferViewIndices, gltfAccessor.sparse.indices.byteOffset, gltfAccessor.sparse.indices.componentType, GLTF.ACCESSOR_TYPE.SCALAR);
                const arrayValues = await this.getBufferViewData(gltfBufferViewValues, gltfAccessor.sparse.values.byteOffset, componentType, accessorType);
                const accessorTypeLength = toAccessorTypeLength[gltfAccessor.type];
                if (gltfAccessor.bufferView == undefined)
                    array = new toArrayConstructor[gltfAccessor.componentType](gltfAccessor.count * accessorTypeLength);
                for (let i = 0; i < gltfAccessor.sparse.count; i++) {
                    array.set(arrayValues.slice(i * accessorTypeLength, (i + 1) * accessorTypeLength), arrayIndices[i] * accessorTypeLength);
                }
            }
            return array;
        }
        async getBufferViewData(_bufferView, _byteOffset, _componentType, _accessorType) {
            const buffer = await this.getBuffer(_bufferView.buffer);
            const byteOffset = (_bufferView.byteOffset ?? 0) + (_byteOffset ?? 0);
            const byteLength = _bufferView.byteLength ?? 0;
            const byteStride = _bufferView.byteStride;
            const arrayConstructor = toArrayConstructor[_componentType];
            const array = new arrayConstructor(buffer, byteOffset, byteLength / arrayConstructor.BYTES_PER_ELEMENT);
            if (byteStride != undefined) {
                const nComponentsPerElement = toAccessorTypeLength[_accessorType];
                const nElements = byteLength / byteStride;
                const stride = byteStride / arrayConstructor.BYTES_PER_ELEMENT;
                const newArray = new arrayConstructor(nElements * nComponentsPerElement);
                for (let iNewElement = 0; iNewElement < nElements; iNewElement++) {
                    const iElement = iNewElement * stride;
                    for (let iComponent = 0; iComponent < nComponentsPerElement; iComponent++)
                        newArray[iNewElement * nComponentsPerElement + iComponent] = array[iElement + iComponent];
                }
                return newArray;
            }
            return array;
        }
        async getBuffer(_iBuffer) {
            const gltfBuffer = this.#gltf.buffers[_iBuffer];
            if (!gltfBuffer)
                throw new Error(`${this}: Couldn't find buffer with index ${_iBuffer}.`);
            if (!this.#buffers)
                this.#buffers = [];
            if (!this.#buffers[_iBuffer]) {
                const response = await fetch(new URL(gltfBuffer.uri, new URL(this.#url, FudgeCore.Project.baseURL)));
                this.#buffers[_iBuffer] = await response.arrayBuffer();
            }
            return this.#buffers[_iBuffer];
        }
        async getAnimationSequence(_sampler, _transformationType) {
            const input = await this.getFloat32Array(_sampler.input);
            const output = await this.getFloat32Array(_sampler.output);
            const millisPerSecond = 1000;
            const isRotation = _transformationType == "rotation";
            const vectorLength = isRotation ? 4 : 3;
            const propertyType = isRotation ? FudgeCore.Quaternion : FudgeCore.Vector3;
            const interpolation = this.toInternInterpolation(_sampler.interpolation);
            const isCubic = interpolation == FudgeCore.ANIMATION_INTERPOLATION.CUBIC;
            const vectorsPerInput = isCubic ? 3 : 1;
            const sequence = [];
            for (let iInput = 0; iInput < input.length; iInput++) {
                const iOutput = iInput * vectorsPerInput * vectorLength + (isCubic ? vectorLength : 0);
                const iOutputInTangent = iOutput - vectorLength;
                const iOutputOutTangent = iOutput + vectorLength;
                const time = millisPerSecond * input[iInput];
                let value = new propertyType(output[iOutput + 0], output[iOutput + 1], output[iOutput + 2], output[iOutput + 3]);
                let slopeIn;
                let slopeOut;
                if (isCubic) {
                    slopeIn = new propertyType(output[iOutputInTangent + 0], output[iOutputInTangent + 1], output[iOutputInTangent + 2], output[iOutputInTangent + 3]);
                    slopeOut = new propertyType(output[iOutputOutTangent + 0], output[iOutputOutTangent + 1], output[iOutputOutTangent + 2], output[iOutputOutTangent + 3]);
                }
                sequence.push(new FudgeCore.AnimationKey(time, value, interpolation, slopeIn, slopeOut));
            }
            return new FudgeCore.AnimationSequence(sequence, isRotation ? FudgeCore.Quaternion : FudgeCore.Vector3);
        }
        toInternInterpolation(_interpolation) {
            switch (_interpolation) {
                case "LINEAR":
                    return FudgeCore.ANIMATION_INTERPOLATION.LINEAR;
                case "STEP":
                    return FudgeCore.ANIMATION_INTERPOLATION.CONSTANT;
                case "CUBICSPLINE":
                    return FudgeCore.ANIMATION_INTERPOLATION.CUBIC;
                default:
                    if (_interpolation != undefined)
                        FudgeCore.Debug.warn(`${this}: Unknown interpolation type ${_interpolation}.`);
                    return FudgeCore.ANIMATION_INTERPOLATION.LINEAR;
            }
        }
    }
    FudgeCore.GLTFLoader = GLTFLoader;
    function getWebGLParameterName(_value) {
        return Object.keys(WebGL2RenderingContext).find(_key => Reflect.get(WebGL2RenderingContext, _key) == _value);
    }
    const toInternTransformation = {
        "translation": "translation",
        "rotation": "rotation",
        "scale": "scaling"
    };
    const toInternTransformationNew = {
        "translation": "translation",
        "rotation": "quaternion",
        "scale": "scaling"
    };
    const toAccessorTypeLength = {
        "SCALAR": 1,
        "VEC2": 2,
        "VEC3": 3,
        "VEC4": 4,
        "MAT2": 4,
        "MAT3": 9,
        "MAT4": 16
    };
    const toArrayConstructor = {
        [GLTF.COMPONENT_TYPE.UNSIGNED_BYTE]: Uint8Array,
        [GLTF.COMPONENT_TYPE.BYTE]: Int8Array,
        [GLTF.COMPONENT_TYPE.UNSIGNED_SHORT]: Uint16Array,
        [GLTF.COMPONENT_TYPE.SHORT]: Int16Array,
        [GLTF.COMPONENT_TYPE.UNSIGNED_INT]: Uint32Array,
        [GLTF.COMPONENT_TYPE.FLOAT]: Float32Array
    };
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    FudgeCore.shaderSources = {};
    FudgeCore.shaderSources["ShaderAmbientOcclusion.frag"] = `#version 300 es
/**
 * Calculates ambient occlusion for a given fragment
 * @authors Roland Heer, HFU, 2023 | Jonas Plotzky, HFU, 2023
 * adaption of https://github.com/tsherif/webgl2examples/blob/da1153a15ebc09bb13498e5f732ef2036507740c/ssao.html
 * see here for an in depth explanation: 
*/
precision mediump float;
precision highp int;

const float sin45 = 0.707107; // 45 degrees in radians
const vec2 kernel[4] = vec2[4](vec2(0.0, 1.0), vec2(1.0, 0.0), vec2(0.0, -1.0), vec2(-1.0, 0.0));

uniform float u_fNear;
uniform float u_fFar;
uniform float u_fSampleRadius;
uniform float u_fBias;
uniform float u_fAttenuationConstant;
uniform float u_fAttenuationLinear;
uniform float u_fAttenuationQuadratic;
uniform vec2 u_vctResolution;
uniform vec3 u_vctCamera;
// uniform mat4 u_mtxViewProjectionInverse;

uniform sampler2D u_texPosition;
uniform sampler2D u_texNormal;
uniform sampler2D u_texNoise;
// uniform sampler2D u_texDepth;

in vec2 v_vctTexture;
out vec4 vctFrag;

layout(std140) uniform Fog {
  bool u_bFogActive;
  float u_fFogNear;
  float u_fFogFar;
  float pading;
  vec4 u_vctFogColor;
};

// This function could be used to calculate the position from the depth texture, but mobile devices seems to lack in precision to do this
// vec3 getPosition(vec2 _vctTexture) {
//   float fDepth = texture(u_texDepth, _vctTexture).r;
//   vec4 clipSpacePosition = vec4(_vctTexture * 2.0 - 1.0, fDepth * 2.0 - 1.0, 1.0);
//   vec4 worldSpacePosition = u_mtxViewProjectionInverse * clipSpacePosition;
//   return worldSpacePosition.xyz / worldSpacePosition.w;
// }

float getOcclusion(vec3 _vctPosition, vec3 _vctNormal, vec2 _vctTexture) {
  vec3 vctOccluder = texture(u_texPosition, _vctTexture).xyz;

  if (vctOccluder.x == 0.0 && vctOccluder.y == 0.0 && vctOccluder.z == 0.0) // no occluder at this position
    return 0.0;

  vec3 vctDistance = vctOccluder - _vctPosition;
  float fIntensity = max(dot(_vctNormal, normalize(vctDistance)) - u_fBias, 0.0);

  float fDistance = length(vctDistance);
  float fAttenuation = 1.0 / (u_fAttenuationConstant + u_fAttenuationLinear * fDistance + u_fAttenuationQuadratic * fDistance * fDistance);

  return fIntensity * fAttenuation;
}

float getFog(vec3 _vctPosition) {
  float fDistance = length(_vctPosition - u_vctCamera); // maybe use z-depth instead of euclidean depth
  float fFog = clamp((fDistance - u_fFogNear) / (u_fFogFar - u_fFogNear), 0.0, 1.0);
  fFog = -pow(fFog, 2.0) + (2.0 * fFog); // lets fog appear quicker and fall off slower results in a more gradual falloff
  return fFog * u_vctFogColor.a;
}

void main() {
  vec3 vctPosition = texture(u_texPosition, v_vctTexture).xyz;
  vec3 vctNormal = texture(u_texNormal, v_vctTexture).xyz;
  vec2 vctRandom = normalize(texture(u_texNoise, v_vctTexture).xy * 2.0 - 1.0);
  float fDepth = (length(vctPosition - u_vctCamera) - u_fNear) / (u_fFar - u_fNear); // linear euclidean depth in range [0,1], when changing to view space, don't subtract camera position
  float fKernelRadius = u_fSampleRadius * (1.0 - fDepth);

  float fOcclusion = 0.0;
  for (int i = 0; i < 4; ++i) {
    vec2 vctK1 = reflect(kernel[i], vctRandom);
    vec2 vctK2 = vec2(vctK1.x * sin45 - vctK1.y * sin45, vctK1.x * sin45 + vctK1.y * sin45);

    vctK1 /= u_vctResolution;
    vctK2 /= u_vctResolution;

    vctK1 *= fKernelRadius;
    vctK2 *= fKernelRadius;

    fOcclusion += getOcclusion(vctPosition, vctNormal, v_vctTexture + vctK1);
    fOcclusion += getOcclusion(vctPosition, vctNormal, v_vctTexture + vctK2 * 0.75);
    fOcclusion += getOcclusion(vctPosition, vctNormal, v_vctTexture + vctK1 * 0.5);
    fOcclusion += getOcclusion(vctPosition, vctNormal, v_vctTexture + vctK2 * 0.25);
  }

  fOcclusion = clamp(fOcclusion / 16.0, 0.0, 1.0);

  if (u_bFogActive && fOcclusion > 0.0) // correct occlusion by fog factor
    fOcclusion = mix(fOcclusion, 0.0, getFog(vctPosition));
  
  vctFrag.rgb = vec3(fOcclusion);
  vctFrag.a = 1.0;
}`;
    FudgeCore.shaderSources["ShaderBloom.frag"] = `#version 300 es
/**
 * Extracts colors, downsamples and upsamples a texture
 * Adaption of the "dual filtering kawase" method described in SIGGRAPH 2015 by Marius Bjørge
 * https://community.arm.com/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-20-66/siggraph2015_2D00_mmg_2D00_marius_2D00_notes.pdf
 * @authors Roland Heer, HFU, 2023 | Jirka Dell'Oro-Friedl, HFU, 2023 | Jonas Plotzky, HFU, 2023
 */
precision mediump float;
precision highp int;

uniform int u_iMode; // 0: extract, 1: downsample, 2: upsample, 3: apply
uniform float u_fThreshold;
uniform float u_fIntensity;
uniform float u_fHighlightDesaturation;
uniform vec2 u_vctTexel;

uniform sampler2D u_texSource;

in vec2 v_vctTexture;
out vec4 vctFrag;

// old gaussian blur
// flat in vec2[9] v_vctOffsets;
// const float gaussianKernel[9] = float[](0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045);
// vec4 downsample(vec2 _vctTexture) {
//   vec4 vctColor = vec4(0.0);
//   for (int i = 0; i < 9; i++) 
//     vctColor += texture(u_texSource, v_vctTexture + v_vctOffsets[i]) * gaussianKernel[i];
//   return vctColor;
// }
// vec4 upsample(vec2 _vctTexture) {
//   vec4 vctColor = vec4(0.0);
//   for (int i = 0; i < 9; i++) 
//     vctColor += texture(u_texSource, _vctTexture + v_vctOffsets[i]) * gaussianKernel[i];
//   return vctColor;
// }

// vec3 extract(vec2 _vctTexture) {
//   vec3 vctColor = texture(u_texSource, _vctTexture).rgb;
//   if(any(greaterThan(vctColor, vec3(u_fThreshold))))
//     return vctColor;
//   discard;
// }

// vec3 extract(vec2 _vctTexture) {
//   vec3 vctColor = texture(u_texSource, _vctTexture).rgb;
//   float luminance = dot(vctColor, vec3(0.299, 0.587, 0.114));
//   if(luminance > u_fThreshold)
//     return vctColor;
//   discard;
// }

// old extraction with average brightness
vec3 extract(vec2 _vctTexture) {
  vec3 vctColor = texture(u_texSource, _vctTexture).rgb;
  float fThreshold = u_fThreshold;
  if(fThreshold >= 1.0)
    fThreshold = 0.999999;

  vctColor = vctColor - fThreshold;
  vctColor = vctColor / (1.0 - fThreshold); // negative values might receive values above 1.0...
  
  float averageBrightness = (((vctColor.r + vctColor.g + vctColor.b) / 3.0) * 0.2) + 0.8; //the effect is reduced by first setting it to a 0.0-0.2 range and then adding 0.8
  vctColor = clamp(vctColor, 0.0, 1.0) * clamp(averageBrightness, 0.0, 1.0);
  return vctColor;
}

vec4 downsample(vec2 _vctTexture) {
  vec4 sum = texture(u_texSource, _vctTexture) * 4.0;
  sum += texture(u_texSource, _vctTexture - u_vctTexel.xy);
  sum += texture(u_texSource, _vctTexture + u_vctTexel.xy);
  sum += texture(u_texSource, _vctTexture + vec2(u_vctTexel.x, -u_vctTexel.y));
  sum += texture(u_texSource, _vctTexture - vec2(u_vctTexel.x, -u_vctTexel.y));

  return sum / 8.0;
}

vec4 upsample(vec2 _vctTexture) {
  vec4 sum = texture(u_texSource, _vctTexture + vec2(-u_vctTexel.x * 2.0, 0.0));
  sum += texture(u_texSource, _vctTexture + vec2(-u_vctTexel.x, u_vctTexel.y)) * 2.0;
  sum += texture(u_texSource, _vctTexture + vec2(0.0, u_vctTexel.y * 2.0));
  sum += texture(u_texSource, _vctTexture + vec2(u_vctTexel.x, u_vctTexel.y)) * 2.0;
  sum += texture(u_texSource, _vctTexture + vec2(u_vctTexel.x * 2.0, 0.0));
  sum += texture(u_texSource, _vctTexture + vec2(u_vctTexel.x, -u_vctTexel.y)) * 2.0;
  sum += texture(u_texSource, _vctTexture + vec2(0.0, -u_vctTexel.y * 2.0));
  sum += texture(u_texSource, _vctTexture + vec2(-u_vctTexel.x, -u_vctTexel.y)) * 2.0;
  return sum / 12.0;
}

vec3 apply(vec2 _vctTexture) {
  vec3 vctBloom = texture(u_texSource, _vctTexture).rgb;
  if (vctBloom.r >= 1.0 || vctBloom.g >= 1.0 || vctBloom.b >= 1.0) // maybe use threshold instead of 1.0?
    vctBloom = mix(vctBloom, vec3(1.0), u_fHighlightDesaturation);
  vctBloom = clamp(vctBloom * u_fIntensity, 0.0, 1.0);
  return vctBloom;
}

void main() {
  switch(u_iMode) {
    case 0:
      vctFrag.rgb = extract(v_vctTexture);
      vctFrag.a = 1.0;
      return;
    case 1:
      vctFrag = downsample(v_vctTexture);
      return;
    case 2:
      vctFrag = upsample(v_vctTexture);
      return;
    case 3:
      vctFrag.rgb = apply(v_vctTexture);
      vctFrag.a = 1.0;
      return;
    default:
      vctFrag = texture(u_texSource, v_vctTexture);
      return;
  }
}`;
    FudgeCore.shaderSources["ShaderGizmo.frag"] = `#version 300 es
/**
* ...
* @authors Jonas Plotzky, HFU, 2023
*/
precision mediump float;
precision highp int;

uniform vec4 u_vctColor;

out vec4 vctFrag;

// uniform sampler2D u_texDepthStencil;
#if defined(TEXTURE)

  uniform sampler2D u_texColor;
  in vec2 v_vctTexture;
  
#endif

// // 4x4 Bayer matrix for dithering
// const float mtxDither[16] = float[](
//   1.0 / 17.0,  9.0 / 17.0,  3.0 / 17.0, 11.0 / 17.0,
//   13.0 / 17.0,  5.0 / 17.0, 15.0 / 17.0,  7.0 / 17.0,
//   4.0 / 17.0, 12.0 / 17.0,  2.0 / 17.0, 10.0 / 17.0,
//   16.0 / 17.0,  8.0 / 17.0, 14.0 / 17.0,  6.0 / 17.0
// );

void main() {
  vctFrag = u_vctColor;

  #if defined(TEXTURE)

      vctFrag *= texture(u_texColor, v_vctTexture);

  #endif

  // int x = int(gl_FragCoord.x) % 4;
  // int y = int(gl_FragCoord.y) % 4;
  // int index = y * 4 + x;
  // // Discard the fragment if its alpha is less than the corresponding value in the dithering matrix
  // if (vctFrag.a < mtxDither[index]) 
  //   discard;

  // // Discard the fragment if its alpha is 0
  // if (vctFrag.a == 0.0)
  //   discard;

  // // Create a checkerboard pattern for alpha values less than 0.5
  // else if (vctFrag.a < 0.5 && ((x + y) % 2 == 0))
  //   discard;

  // vctFrag.a = 1.0;

  if (vctFrag.a < 0.01)
    discard;
}`;
    FudgeCore.shaderSources["ShaderGizmo.vert"] = `#version 300 es
/**
* ...
* @authors Jonas Plotzky, HFU, 2023
*/
precision mediump float;
precision highp int;

uniform mat4 u_mtxMeshToWorld; // u_mtxModel

layout(std140) uniform Camera {
  mat4 u_mtxWorldToCamera; // u_mtxView
  mat4 u_mtxProjection; 
  mat4 u_mtxWorldToView; // u_mtxViewProjection
  vec3 u_vctCamera;
};

layout(location = 0) in vec3 a_vctPosition;

#if defined(TEXTURE)

  layout(location = 2) in vec2 a_vctTexture;
  out vec2 v_vctTexture;

#endif

void main() {
  gl_Position = u_mtxWorldToView * u_mtxMeshToWorld * vec4(a_vctPosition, 1.0);

  #if defined(TEXTURE)

    v_vctTexture = a_vctTexture;

  #endif
}`;
    FudgeCore.shaderSources["ShaderOutline.frag"] = `#version 300 es
/**
 * @authors Jonas Plotzky, HFU, 2025
 */
precision mediump float;
precision highp int;

uniform vec2 u_vctTexel;
uniform vec4 u_vctColor;
uniform vec4 u_vctColorOccluded;

uniform sampler2D u_texDepthOutline;
uniform sampler2D u_texDepthScene;

in vec2 v_vctTexture;
out vec4 vctFrag;

float getDepth(vec2 _vctTexture) {
  return texture(u_texDepthOutline, _vctTexture).r;
}

void main() {
  float fDepth = getDepth(v_vctTexture);

  if (fDepth != 1.0)
    discard;

  float fDepthTop = getDepth(v_vctTexture + vec2(0, u_vctTexel.y));
  float fDepthRight = getDepth(v_vctTexture + vec2(u_vctTexel.x, 0));
  float fDepthBottom = getDepth(v_vctTexture + vec2(0, -u_vctTexel.y));
  float fDepthLeft = getDepth(v_vctTexture + vec2(-u_vctTexel.x, 0));

  float fDepthMin = min(min(fDepthTop, fDepthRight), min(fDepthBottom, fDepthLeft));
  float fDepthDelta = abs(fDepth - fDepthMin);

  if (fDepthDelta == 0.0)
    discard;

  float fDepthScene = texture(u_texDepthScene, v_vctTexture).r;
  if (fDepthMin < fDepthScene)
    vctFrag = u_vctColor;
  else
    vctFrag = u_vctColorOccluded;
}`;
    FudgeCore.shaderSources["ShaderPhong.frag"] = `#version 300 es
/**
* Phong shading
* @authors Jirka Dell'Oro-Friedl, HFU, 2022 | Roland Heer, HFU, 2023 | Jonas Plotzky, HFU, 2023
*/

precision mediump float;
precision highp int;

uniform vec4 u_vctColor;
uniform float u_fDiffuse;
uniform float u_fSpecular;
uniform float u_fIntensity;
uniform float u_fMetallic;
uniform vec3 u_vctCamera;

uniform bool u_bFog;
uniform vec4 u_vctFogColor;
uniform float u_fFogNear;
uniform float u_fFogFar;

in vec4 v_vctColor;
in vec3 v_vctPosition;

layout(location = 0) out vec4 vctFrag;
layout(location = 1) out vec4 vctFragPosition;
layout(location = 2) out vec4 vctFragNormal;

#ifdef PHONG

  in vec3 v_vctNormal;

#endif

#ifdef FLAT

  flat in vec3 v_vctPositionFlat;

#endif

struct Light {
  vec4 vctColor;
  mat4 mtxShape;
  mat4 mtxShapeInverse;
};

const uint MAX_LIGHTS_DIRECTIONAL = 15u;
const uint MAX_LIGHTS_POINT = 100u;
const uint MAX_LIGHTS_SPOT = 100u;

layout(std140) uniform Lights {
  uint u_nLightsDirectional;
  uint u_nLightsPoint;
  uint u_nLightsSpot;
  uint padding; // Add padding to align to 16 bytes
  Light u_ambient;
  Light u_directional[MAX_LIGHTS_DIRECTIONAL];
  Light u_point[MAX_LIGHTS_POINT];
  Light u_spot[MAX_LIGHTS_SPOT];
};

// TEXTURE: input UVs and texture
#ifdef TEXTURE

  in vec2 v_vctTexture;
  uniform sampler2D u_texColor;

#endif

// NORMALMAP: input UVs and texture
#ifdef NORMALMAP

  in vec3 v_vctTangent;
  in vec3 v_vctBitangent;
  uniform sampler2D u_texNormal;

#endif

// Returns a vector for visualizing on model. Great for debugging
vec4 showVectorAsColor(vec3 _vector, bool _clamp) {
  if(_clamp) {
    _vector *= 0.5;
    _vector += 0.5;
  }
  return vec4(_vector.x, _vector.y, _vector.z, 1);
}

void illuminateDirected(vec3 _vctDirection, vec3 _vctView, vec3 _vctNormal, vec3 _vctColor, inout vec3 _vctDiffuse, inout vec3 _vctSpecular) {
  vec3 vctDirection = normalize(_vctDirection);
  float fIllumination = -dot(_vctNormal, vctDirection);
  if(fIllumination > 0.0) {
    _vctDiffuse += u_fDiffuse * fIllumination * _vctColor;

    if(u_fSpecular <= 0.0)
      return;
      
    //BLINN-Phong Shading
    vec3 halfwayDir = normalize(-vctDirection - _vctView);
    float factor = max(dot(-vctDirection, _vctNormal), 0.0); //Factor for smoothing out transition from surface facing the lightsource to surface facing away from the lightsource
    factor = 1.0 - (pow(factor - 1.0, 8.0));                 //The factor is altered in order to clearly see the specular highlight even at steep angles, while still preventing artifacts

    _vctSpecular += pow(max(dot(_vctNormal, halfwayDir), 0.0), exp2(u_fSpecular * 5.0)) * u_fSpecular * u_fIntensity * factor * _vctColor;
  }
}

float getFog(vec3 _vctPosition) {
  float fDistance = length(_vctPosition - u_vctCamera); // maybe use z-depth instead of euclidean depth
  float fFog = clamp((fDistance - u_fFogNear) / (u_fFogFar - u_fFogNear), 0.0, 1.0);
  fFog = -pow(fFog, 2.0) + (2.0 * fFog); // lets fog appear quicker and fall off slower results in a more gradual falloff
  return fFog;
}

void main() {
  #if defined(PHONG) && !defined(FLAT)

    #ifdef NORMALMAP

      mat3 mtxTBN = mat3(normalize(v_vctTangent), normalize(v_vctBitangent), normalize(v_vctNormal));
      vec3 vctNormal = texture(u_texNormal, v_vctTexture).xyz * 2.0 - 1.0;
      vctNormal = normalize(mtxTBN * vctNormal);

    #else

      vec3 vctNormal = normalize(v_vctNormal);

    #endif

    vec3 vctView = normalize(v_vctPosition - u_vctCamera);
    vec3 vctPosition = v_vctPosition;

  #endif

  #ifdef FLAT

    vec3 vctFdx = dFdx(v_vctPosition);
    vec3 vctFdy = dFdy(v_vctPosition);
    vec3 vctNormal = normalize(cross(vctFdx, vctFdy));
    vec3 vctView = normalize(v_vctPositionFlat - u_vctCamera);
    vec3 vctPosition = v_vctPositionFlat;

  #endif

  vec3 vctDiffuse = u_fDiffuse * u_ambient.vctColor.rgb;
  vec3 vctSpecular = vec3(0, 0, 0);

  // calculate directional light effect
  for(uint i = 0u; i < u_nLightsDirectional; i++) {
    vec3 vctDirection = vec3(u_directional[i].mtxShape * vec4(0.0, 0.0, 1.0, 1.0));
    illuminateDirected(vctDirection, vctView, vctNormal, u_directional[i].vctColor.rgb, vctDiffuse, vctSpecular);
  }

  // calculate point light effect
  for(uint i = 0u; i < u_nLightsPoint; i++) {
    vec3 vctPositionLight = vec3(u_point[i].mtxShape * vec4(0.0, 0.0, 0.0, 1.0));
    vec3 vctDirection = vctPosition - vctPositionLight;
    float fIntensity = 1.0 - length(mat3(u_point[i].mtxShapeInverse) * vctDirection);
    if(fIntensity < 0.0)
      continue;

    illuminateDirected(vctDirection, vctView, vctNormal, u_point[i].vctColor.rgb * fIntensity, vctDiffuse, vctSpecular);
  }

  // calculate spot light effect
  for(uint i = 0u; i < u_nLightsSpot; i++) {
    vec3 vctPositionLight = vec3(u_spot[i].mtxShape * vec4(0.0, 0.0, 0.0, 1.0));
    vec3 vctDirection = vctPosition - vctPositionLight;
    vec3 vctDirectionInverted = mat3(u_spot[i].mtxShapeInverse) * vctDirection;
    if(vctDirectionInverted.z <= 0.0)
      continue;

    float fIntensity = 1.0 - min(1.0, 2.0 * length(vctDirectionInverted.xy) / vctDirectionInverted.z);    //Coneshape that is brightest in the center. Possible TODO: "Variable Spotlightsoftness"
    fIntensity *= 1.0 - pow(vctDirectionInverted.z, 2.0);                                                 //Prevents harsh lighting artifacts at boundary of the given spotlight
    if(fIntensity < 0.0)
      continue;

    illuminateDirected(vctDirection, vctView, vctNormal, u_spot[i].vctColor.rgb * fIntensity, vctDiffuse, vctSpecular);
  }

  vctFrag.rgb = vctDiffuse + vctSpecular * u_fMetallic;
  vctFrag.a = 1.0;

  #ifdef TEXTURE

    vec4 vctColorTexture = texture(u_texColor, v_vctTexture);
    vctFrag *= vctColorTexture;

  #endif

  vctFrag *= u_vctColor * v_vctColor;
  vctFrag.rgb += vctSpecular * (1.0 - u_fMetallic);

  vctFragPosition = vec4(v_vctPosition, 1.0); // don't use flat here, because we want to interpolate the position
  vctFragNormal = vec4(vctNormal, 1.0);

  if (u_bFog) 
    vctFrag.rgb = mix(vctFrag.rgb, u_vctFogColor.rgb, getFog(vctPosition) * u_vctFogColor.a);

  vctFrag.rgb *= vctFrag.a;

  if(vctFrag.a < 0.01)
    discard;
}`;
    FudgeCore.shaderSources["ShaderPick.frag"] = `#version 300 es
/**
* Renders for Raycasting
* @authors Jirka Dell'Oro-Friedl, HFU, 2019
*/
precision mediump float;
precision highp int;

uniform int u_id;
uniform int u_size;
uniform vec4 u_vctColor;
out ivec4 vctFrag;

#if defined(TEXTURE)

  uniform sampler2D u_texColor;
  in vec2 v_vctTexture;

#endif

void main() {
  int pixel = int(gl_FragCoord.x) + u_size * int(gl_FragCoord.y);

  if (pixel != u_id)
    discard;
  
  vec4 vctColor = u_vctColor;
  
  #if defined(TEXTURE)

    vctColor *= texture(u_texColor, v_vctTexture);

  #endif

  uint icolor = uint(vctColor.r * 255.0) << 24 | uint(vctColor.g * 255.0) << 16 | uint(vctColor.b * 255.0) << 8 | uint(vctColor.a * 255.0);
  
  vctFrag = ivec4(floatBitsToInt(gl_FragCoord.z), icolor, 0, 0);

  #if defined(TEXTURE)

    vctFrag.b = floatBitsToInt(v_vctTexture.x);
    vctFrag.a = floatBitsToInt(v_vctTexture.y);

  #endif
}`;
    FudgeCore.shaderSources["ShaderPick.vert"] = `#version 300 es
/**
* Renders for Raycasting
* @authors Jirka Dell'Oro-Friedl, HFU, 2019
*/
uniform mat4 u_mtxMeshToWorld; // u_mtxModel

layout(std140) uniform Camera {
  mat4 u_mtxWorldToCamera; // u_mtxView
  mat4 u_mtxProjection; 
  mat4 u_mtxWorldToView; // u_mtxViewProjection
  vec3 u_vctCamera;
};

layout(location = 0) in vec3 a_vctPosition;

#if defined(TEXTURE)

  layout(location = 2) in vec2 a_vctTexture;
  out vec2 v_vctTexture;

#endif

void main() {
  gl_Position = u_mtxWorldToView * u_mtxMeshToWorld * vec4(a_vctPosition, 1.0);

  #if defined(TEXTURE)

    v_vctTexture = a_vctTexture;

  #endif
}`;
    FudgeCore.shaderSources["ShaderScreen.vert"] = `#version 300 es
precision mediump float;
precision highp int;
/**
 * Creates a fullscreen triangle which cotains the screen quad and sets the texture coordinates accordingly.
 * @authors Roland Heer, HFU, 2023 | Jirka Dell'Oro-Friedl, HFU, 2023 | Jonas Plotzky, HFU, 2023
 *
 *  2  3 .
 *       .  .
 *       .     .  
 *       .        .
 *  1  1 ..........  .
 *       . screen .     .
 *       .  quad  .        .
 *  0 -1 ..........  .  .  .  .
 *    p -1        1           3
 *  t    0        1           2
 *  
 *  p == postion
 *  t == texture coordinate
 */

// uniform vec2 u_vctResolution;

out vec2 v_vctTexture;

// #ifdef SAMPLE

//   flat out vec2[9] v_vctOffsets;

// #endif

void main() {
  float x = float((gl_VertexID % 2) * 4); // 0, 4, 0
  float y = float((gl_VertexID / 2) * 4); // 0, 0, 4
  gl_Position = vec4(x - 1.0, y - 1.0, 0.0, 1.0); // (-1, -1), (3, -1), (-1, 3)
  v_vctTexture = vec2(x / 2.0, y / 2.0);  // (0, 0), (2, 0), (0, 2) -> interpolation will yield (0, 0), (1, 0), (0, 1) as the positions are double the size of the screen

  // #ifdef SAMPLE

  //   vec2 offset = vec2(1.0 / u_vctResolution.x, 1.0 / u_vctResolution.y);
  //   v_vctOffsets = vec2[](
  //     vec2(-offset.x, offset.y),  vec2(0.0, offset.y),  vec2(offset.x, offset.y),
  //     vec2(-offset.x, 0.0),       vec2(0.0, 0.0),       vec2(offset.x, 0.0),
  //     vec2(-offset.x, -offset.y), vec2(0.0, -offset.y),  vec2(offset.x, -offset.y)
  //   );

  // #endif
}`;
    FudgeCore.shaderSources["ShaderUniversal.frag"] = `#version 300 es
/**
* Universal Shader as base for many others. Controlled by compiler directives
* @authors Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2023
*/
precision mediump float;
precision highp int;

layout(std140) uniform Node {
  uniform mat4 u_mtxMeshToWorld; // u_mtxModel
  uniform mat3 u_mtxPivot; // texture pivot matrix
  uniform vec4 u_vctColorPrimary; // component material color

  uniform uint u_iBlendMode;
  uniform float u_fParticleSystemDuration;
  uniform float u_fParticleSystemSize;
  uniform float u_fParticleSystemTime;

  uniform bool u_bFaceCameraActive;
  uniform bool u_bFaceCameraRestrict;
};

layout(std140) uniform Camera {
  mat4 u_mtxWorldToCamera; // u_mtxView
  mat4 u_mtxProjection; 
  mat4 u_mtxWorldToView; // u_mtxViewProjection
  vec3 u_vctCamera;
};

layout(std140) uniform Material {
  uniform vec4 u_vctColor;

  uniform float u_fDiffuse;
  uniform float u_fSpecular;
  uniform float u_fIntensity;
  uniform float u_fMetallic;

  uniform float u_fAlphaClip;
};

layout(std140) uniform Fog {
  bool u_bFogActive;
  float u_fFogNear;
  float u_fFogFar;
  float fogPadding; // add padding to align to 16 bytes
  vec4 u_vctFogColor;
};

in vec3 v_vctPosition;
in vec4 v_vctColor;

layout(location = 0) out vec4 vctFrag;
layout(location = 1) out vec4 vctFragPosition; // TODO: make these optional?
layout(location = 2) out vec4 vctFragNormal;

#if defined(FLAT) || defined(GOURAUD) || defined(PHONG)

  in vec3 v_vctNormal;

#endif

#if defined(FLAT)

  flat in vec3 v_vctPositionFlat;

#endif

#if defined(GOURAUD)

  in vec3 v_vctDiffuse;
  in vec3 v_vctSpecular;

#endif

#if defined(TOON)

  uniform sampler2D u_texToon;

#endif

#if defined(PHONG) || defined(FLAT)

  struct Light {
    vec4 vctColor;
    mat4 mtxShape;
    mat4 mtxShapeInverse;
  };

  #define MAX_LIGHTS_DIRECTIONAL 15u
  #define MAX_LIGHTS_POINT 100u
  #define MAX_LIGHTS_SPOT 100u

  layout(std140) uniform Lights { // TODO: put ambient color in header
    uint u_nLightsDirectional;
    uint u_nLightsPoint;
    uint u_nLightsSpot;
    vec4 u_vctAmbientColor; 

    Light u_directional[MAX_LIGHTS_DIRECTIONAL];
    Light u_point[MAX_LIGHTS_POINT];
    Light u_spot[MAX_LIGHTS_SPOT];
  };

  /**
   * _vctLight: direction from position to light
   * _vctView: direction from position to camera
   * _vctNormal: surface normal at position
   * _vctColor: color of the light
   */
  void illuminateDirected(vec3 _vctLightDirection, vec3 _vctViewDirection, vec3 _vctNormal, vec3 _vctColor, inout vec3 _vctDiffuse, inout vec3 _vctSpecular) {
    vec3 vctLightDirection = normalize(_vctLightDirection);

    float fDiffuse = dot(_vctNormal, vctLightDirection);

    if(fDiffuse > 0.0) {

      #if defined(TOON)
      
        fDiffuse = texture(u_texToon, vec2(fDiffuse, 0)).r;

      #endif

      _vctDiffuse += u_fDiffuse * fDiffuse * _vctColor;

      if(u_fSpecular <= 0.0 || u_fIntensity <= 0.0)
        return;
      
      //BLINN-Phong Shading
      vec3 halfwayDir = normalize(vctLightDirection + _vctViewDirection);
      float factor = fDiffuse;                  // Factor for smoothing out transition from surface facing the lightsource to surface facing away from the lightsource
      factor = 1.0 - (pow(factor - 1.0, 8.0));  // The factor is altered in order to clearly see the specular highlight even at steep angles, while still preventing artifacts

      float fSpecular = pow(max(dot(_vctNormal, halfwayDir), 0.0), exp2(u_fSpecular * 5.0)) * factor; // TODO: remove magic numbers?

      #if defined(TOON)
        
        fSpecular = texture(u_texToon, vec2(fSpecular, 0.0)).g * fDiffuse;

      #endif

      _vctSpecular += fSpecular * u_fIntensity * _vctColor;
    }
  }

#endif

#if defined(TEXTURE) || defined(MATCAP)

  uniform sampler2D u_texColor;
  in vec2 v_vctTexture;

#endif

#if defined(NORMALMAP)

  uniform sampler2D u_texNormal;
  in vec3 v_vctTangent;
  in vec3 v_vctBitangent;

#endif

float getFog(vec3 _vctPosition) {
  float fDistance = length(_vctPosition - u_vctCamera); // maybe use z-depth instead of euclidean depth
  float fFog = clamp((fDistance - u_fFogNear) / (u_fFogFar - u_fFogNear), 0.0, 1.0);
  fFog = -pow(fFog, 2.0) + (2.0 * fFog); // lets fog appear quicker and fall off slower results in a more gradual falloff
  return fFog * u_vctFogColor.a;
}

void main() {

  #if defined(FLAT)

    vec3 vctFdx = dFdx(v_vctPosition);
    vec3 vctFdy = dFdy(v_vctPosition);
    vec3 vctNormal = normalize(cross(vctFdx, vctFdy));
    vec3 vctViewDirection = normalize(u_vctCamera - v_vctPositionFlat);
    vec3 vctPosition = v_vctPositionFlat;

  #endif

  #if (defined(PHONG) || defined(GOURAUD)) && !defined(NORMALMAP)

    vec3 vctNormal = normalize(v_vctNormal);

  #endif

  #if defined(PHONG)

    vec3 vctViewDirection = normalize(u_vctCamera - v_vctPosition);
    vec3 vctPosition = v_vctPosition;

  #endif

  #if defined(NORMALMAP)

    mat3 mtxTBN = mat3(normalize(v_vctTangent), normalize(v_vctBitangent), normalize(v_vctNormal));
    vec3 vctNormal = texture(u_texNormal, v_vctTexture).xyz * 2.0 - 1.0;
    vctNormal = normalize(mtxTBN * vctNormal);

  #endif
  
  #if defined(FLAT) || defined(PHONG)

    vec3 vctDiffuse = u_fDiffuse * u_vctAmbientColor.rgb;
    vec3 vctSpecular = vec3(0, 0, 0);

    // directional lights
    for(uint i = 0u; i < u_nLightsDirectional; i++) {
      vec3 vctLightDirection = vec3(u_directional[i].mtxShape * vec4(0.0, 0.0, -1.0, 1.0));
      illuminateDirected(vctLightDirection, vctViewDirection, vctNormal, u_directional[i].vctColor.rgb, vctDiffuse, vctSpecular);
    }

    // point lights
    for(uint i = 0u; i < u_nLightsPoint; i++) {
      vec3 vctLightPosition = vec3(u_point[i].mtxShape * vec4(0.0, 0.0, 0.0, 1.0));
      vec3 vctLightDirection = vctLightPosition - vctPosition;
      float fIntensity = 1.0 - length(mat3(u_point[i].mtxShapeInverse) * vctLightDirection);
      if(fIntensity < 0.0)
        continue;

      illuminateDirected(vctLightDirection, vctViewDirection, vctNormal, u_point[i].vctColor.rgb * fIntensity, vctDiffuse, vctSpecular);
    }

    // spot lights
    for(uint i = 0u; i < u_nLightsSpot; i++) {
      vec3 vctLightPosition = vec3(u_spot[i].mtxShape * vec4(0.0, 0.0, 0.0, 1.0));
      vec3 vctLightDirection = vctLightPosition - vctPosition;
      vec3 vctLightDirectionInverted = mat3(u_spot[i].mtxShapeInverse) * -vctLightDirection;
      if(vctLightDirectionInverted.z <= 0.0)
        continue;

      float fIntensity = 1.0 - min(1.0, 2.0 * length(vctLightDirectionInverted.xy) / vctLightDirectionInverted.z);    // Coneshape that is brightest in the center. Possible TODO: "Variable Spotlightsoftness"
      fIntensity *= 1.0 - pow(vctLightDirectionInverted.z, 2.0);                                                      // Prevents harsh lighting artifacts at boundary of the given spotlight
      if(fIntensity < 0.0)
        continue;

      illuminateDirected(vctLightDirection, vctViewDirection, vctNormal, u_spot[i].vctColor.rgb * fIntensity, vctDiffuse, vctSpecular);
    }

  #endif

  vec4 vctColor = u_vctColor * u_vctColorPrimary * v_vctColor;

  #if defined(GOURAUD)

    vec3 vctDiffuse = v_vctDiffuse;
    vec3 vctSpecular = v_vctSpecular;

  #endif

  #if defined(FLAT) || defined(GOURAUD) || defined(PHONG)

    vctFrag.rgb = vctDiffuse + vctSpecular * u_fMetallic;
    vctFrag.a = 1.0;

  #else

    // MINIMAL: set the base color
    vctFrag = vctColor;

  #endif

  #if defined(TEXTURE) || defined(MATCAP)
    
    // TEXTURE: multiply with texel color
    vec4 vctColorTexture = texture(u_texColor, v_vctTexture); // has premultiplied alpha by webgl for correct filtering
    if (vctColorTexture.a > 0.0) // unpremultiply alpha
      vctColorTexture.rgb /= vctColorTexture.a; 
    vctFrag *= vctColorTexture;

  #endif

  #if defined(FLAT) || defined(GOURAUD) || defined(PHONG)

    vctFrag *= vctColor;
    vctFrag.rgb += vctSpecular * (1.0 - u_fMetallic);

    vctFragPosition = vec4(v_vctPosition, 1.0);
    vctFragNormal = vec4(vctNormal, 1.0);
  
  #endif

  #if !defined(PHONG) && !defined(FLAT) && !defined(GOURAUD) // MINIMAL

    vctFragPosition = vec4(0.0, 0.0, 0.0, 1.0); // (0, 0, 0) will treat occluders as non existing in ssao
    vctFragNormal = vec4(0.0, 0.0, 0.0, 1.0); // (0, 0, 0) normal will yield not occlusion in ssao
  
  #endif

  // discard pixel alltogether when transparent: don't show in Z-Buffer
  if(vctFrag.a < u_fAlphaClip)
    discard;

  if (u_bFogActive) {
    float fFog = getFog(v_vctPosition);
    vctFrag.rgb = mix(vctFrag.rgb, u_vctFogColor.rgb, fFog);

    #if defined(PARTICLE)

      if (u_iBlendMode == 2u || u_iBlendMode == 3u || u_iBlendMode == 4u)  // for blend additive, subtractive, modulate
        vctFrag.a = mix(vctFrag.a, 0.0, fFog);                          // fade out particle when in fog to make it disappear completely

    #endif
  }
}`;
    FudgeCore.shaderSources["ShaderUniversal.vert"] = `#version 300 es
/**
* Universal Shader as base for many others. Controlled by compiler directives
* @authors 2021, Luis Keck, HFU, 2021 | Jirka Dell'Oro-Friedl, HFU, 2021 | Jonas Plotzky, HFU, 2023
*/
precision mediump float;
precision highp int;

layout(std140) uniform Node {
  uniform mat4 u_mtxMeshToWorld; // u_mtxModel
  uniform mat3 u_mtxPivot; // texture pivot matrix
  uniform vec4 u_vctColorPrimary; // component material color

  uniform uint u_iBlendMode;
  uniform float u_fParticleSystemDuration;
  uniform float u_fParticleSystemSize;
  uniform float u_fParticleSystemTime;

  uniform bool u_bFaceCameraActive;
  uniform bool u_bFaceCameraRestrict;
};

layout(std140) uniform Camera {
  mat4 u_mtxWorldToCamera; // u_mtxView
  mat4 u_mtxProjection; 
  mat4 u_mtxWorldToView; // u_mtxViewProjection
  vec3 u_vctCamera;
};

layout(std140) uniform Material {
  uniform vec4 u_vctColor;

  uniform float u_fDiffuse;
  uniform float u_fSpecular;
  uniform float u_fIntensity;
  uniform float u_fMetallic;

  uniform float u_fAlphaClip;
};

layout(location = 0) in vec3 a_vctPosition;
layout(location = 3) in vec4 a_vctColor; // TODO: think about making vertex color optional

out vec3 v_vctPosition;
out vec4 v_vctColor;

#if defined(FLAT) || defined(GOURAUD) || defined(PHONG)

  layout(location = 1) in vec3 a_vctNormal;
  out vec3 v_vctNormal;

#endif

#if defined(FLAT)

  flat out vec3 v_vctPositionFlat;

#endif

#if defined(GOURAUD)

  out vec3 v_vctDiffuse;
  out vec3 v_vctSpecular;

  struct Light {
    vec4 vctColor;
    mat4 mtxShape;
    mat4 mtxShapeInverse;
  };

  #define MAX_LIGHTS_DIRECTIONAL 15u
  #define MAX_LIGHTS_POINT 100u
  #define MAX_LIGHTS_SPOT 100u

  layout(std140) uniform Lights { // TODO: put ambient color in header
    uint u_nLightsDirectional;
    uint u_nLightsPoint;
    uint u_nLightsSpot;
    vec4 u_vctAmbientColor;

    Light u_directional[MAX_LIGHTS_DIRECTIONAL];
    Light u_point[MAX_LIGHTS_POINT];
    Light u_spot[MAX_LIGHTS_SPOT];
  };

  void illuminateDirected(vec3 _vctDirection, vec3 _vctView, vec3 _vctNormal, vec3 _vctColor, inout vec3 _vctDiffuse, inout vec3 _vctSpecular) {
    vec3 vctDirection = normalize(_vctDirection);
    float fIllumination = -dot(_vctNormal, vctDirection);
    if(fIllumination > 0.0) {
      _vctDiffuse += u_fDiffuse * fIllumination * _vctColor;

      if(u_fSpecular <= 0.0)
        return;

      //BLINN
      vec3 halfwayDir = normalize(-vctDirection - _vctView);
      float factor = max(dot(-vctDirection, _vctNormal), 0.0); //Factor for smoothing out transition from surface facing the lightsource to surface facing away from the lightsource
      factor = 1.0 - (pow(factor - 1.0, 8.0));                 //The factor is altered in order to clearly see the specular highlight even at steep angles, while still preventing artifacts

      _vctSpecular += pow(max(dot(_vctNormal, halfwayDir), 0.0), exp2(u_fSpecular * 5.0)) * u_fSpecular * u_fIntensity * factor * _vctColor;

      //PHONG (old)
      // vec3 vctReflection = normalize(reflect(-vctDirection, _vctNormal));
      // float fHitCamera = dot(vctReflection, _vctView);
      // _vctSpecular += pow(max(fHitCamera, 0.0), u_fSpecular * 10.0) * u_fSpecular * _vctColor; // 10.0 = magic number, looks good... 
    }
  }

#endif

#if defined(TEXTURE) || defined(NORMALMAP)

  layout(location = 2) in vec2 a_vctTexture;
  out vec2 v_vctTexture;

#endif

#if defined(NORMALMAP)

  layout(location = 4) in vec4 a_vctTangent;
  out vec3 v_vctTangent;
  out vec3 v_vctBitangent;

#endif

// MATCAP: offer buffers for UVs and pivot matrix
#if defined(MATCAP) // MatCap-shader generates texture coordinates from surface normals

  layout(location = 1) in vec3 a_vctNormal;
  out vec2 v_vctTexture;

#endif

#if defined(SKIN)

  // Bones https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/skinning_pars_vertex.glsl.js
  layout(location = 5) in uvec4 a_vctBones;
  layout(location = 6) in vec4 a_vctWeights;

  const uint MAX_BONES = 256u; // CAUTION: this number must be the same as in RenderInjectorSkeletonInstance where the corresponding buffers are created
  layout(std140) uniform Skin {
    mat4 u_mtxBones[MAX_BONES];
  };

#endif

#if defined(PARTICLE)

  uniform sampler2D u_particleSystemRandomNumbers;

  float fetchRandomNumber(int _iOffset, int _iParticleSystemRandomNumbersSize, int _iParticleSystemRandomNumbersLength) {
    _iOffset = gl_InstanceID + _iOffset % _iParticleSystemRandomNumbersLength;
    return texelFetch(u_particleSystemRandomNumbers, ivec2(_iOffset % _iParticleSystemRandomNumbersSize, _iOffset / _iParticleSystemRandomNumbersSize), 0).r;
  }

#endif

mat4 lookAtCamera(mat4 _mtxWorld, bool _bRestrict) {
  vec3 vctUp = vec3(0.0, 1.0, 0.0);

  vec3 vctPosition = _mtxWorld[3].xyz;

  // vec3 zAxis = normalize(u_vctCamera - vctPosition); // look at camera position
  vec3 zAxis = normalize(-vec3(u_mtxWorldToCamera[0].z, u_mtxWorldToCamera[1].z, u_mtxWorldToCamera[2].z)); // look in camera direction

  vec3 xAxis = normalize(cross(vctUp, zAxis));
  vec3 yAxis = _bRestrict ? vctUp : normalize(cross(zAxis, xAxis));
  zAxis = _bRestrict ? normalize(cross(xAxis, vctUp)) : zAxis;

  vec3 vctScale = vec3(length(_mtxWorld[0].xyz), length(_mtxWorld[1].xyz), length(_mtxWorld[2].xyz));

  mat4 billboardMatrix = mat4(
    vec4(xAxis * vctScale.x, 0.0),
    vec4(yAxis * vctScale.y, 0.0),
    vec4(zAxis * vctScale.z, 0.0),
    vec4(vctPosition, 1.0)
  );

  return billboardMatrix;
}

void main() {

  vec4 vctPosition = vec4(a_vctPosition, 1.0);
  mat4 mtxMeshToWorld = u_mtxMeshToWorld;

  // if (u_bBillboardActive) 
  //   mtxMeshToWorld = lookAtCamera(mtxMeshToWorld, u_bBillboardRestrict);

  #if defined(PARTICLE)
  
    float fParticleId = float(gl_InstanceID);
    int iParticleSystemRandomNumbersSize = textureSize(u_particleSystemRandomNumbers, 0).x; // the dimension of the quadratic texture
    int iParticleSystemRandomNumbersLength = iParticleSystemRandomNumbersSize * iParticleSystemRandomNumbersSize; // the total number of texels in the texture
    /*$variables*/
    /*$mtxLocal*/
    /*$mtxWorld*/
    mtxMeshToWorld = /*$mtxWorld*/ mtxMeshToWorld /*$mtxLocal*/;
    if(u_bFaceCameraActive) 
      mtxMeshToWorld = lookAtCamera(mtxMeshToWorld, u_bFaceCameraRestrict);

  #endif

  #if defined(SKIN)

    mtxMeshToWorld = a_vctWeights.x * u_mtxBones[a_vctBones.x] +
      a_vctWeights.y * u_mtxBones[a_vctBones.y] +
      a_vctWeights.z * u_mtxBones[a_vctBones.z] +
      a_vctWeights.w * u_mtxBones[a_vctBones.w];

  #endif

  mat4 mtxMeshToView = u_mtxWorldToView * mtxMeshToWorld;

  #if defined(FLAT) || defined(GOURAUD) || defined(PHONG) || defined(MATCAP) // only these work with particle and skinning

    mat4 mtxNormalMeshToWorld = transpose(inverse(mtxMeshToWorld));

  #endif

  gl_Position = mtxMeshToView * vctPosition; 
  vctPosition = mtxMeshToWorld * vctPosition;

  v_vctColor = a_vctColor;
  v_vctPosition = vctPosition.xyz;

  #if defined(PARTICLE_COLOR)

    v_vctColor *= /*$color*/;

  #endif

  #if defined(FLAT)

    v_vctPositionFlat = v_vctPosition;
    
  #endif

  #if defined(FLAT) || defined(GOURAUD) || defined(PHONG)

    v_vctNormal = mat3(mtxNormalMeshToWorld) * a_vctNormal; // unnormalized as it must be normalized in the fragment shader anyway

  #endif 

  #if defined(NORMALMAP)

    v_vctTangent = mat3(mtxNormalMeshToWorld) * a_vctTangent.xyz;
    v_vctBitangent = cross(v_vctNormal, v_vctTangent) * a_vctTangent.w;

  #endif

  #if defined(GOURAUD)
  
    vec3 vctView = normalize(vctPosition.xyz - u_vctCamera);
    vec3 vctNormal = normalize(v_vctNormal);
    v_vctDiffuse = u_fDiffuse * u_vctAmbientColor.rgb;
    v_vctSpecular = vec3(0, 0, 0);

    // calculate directional light effect
    for(uint i = 0u; i < u_nLightsDirectional; i ++) {
      vec3 vctDirection = vec3(u_directional[i].mtxShape * vec4(0.0, 0.0, 1.0, 1.0));
      illuminateDirected(vctDirection, vctView, vctNormal, u_directional[i].vctColor.rgb, v_vctDiffuse, v_vctSpecular);
    }

    // calculate point light effect
    for(uint i = 0u;i < u_nLightsPoint;i ++) {
      vec3 vctPositionLight = vec3(u_point[i].mtxShape * vec4(0.0, 0.0, 0.0, 1.0));
      vec3 vctDirection = vctPosition.xyz - vctPositionLight;
      float fIntensity = 1.0 - length(mat3(u_point[i].mtxShapeInverse) * vctDirection);
      if(fIntensity < 0.0) continue;

      illuminateDirected(vctDirection, vctView, vctNormal, u_point[i].vctColor.rgb * fIntensity, v_vctDiffuse, v_vctSpecular);
    }

    // calculate spot light effect
    for(uint i = 0u;i < u_nLightsSpot;i ++) {
      vec3 vctPositionLight = vec3(u_spot[i].mtxShape * vec4(0.0, 0.0, 0.0, 1.0));
      vec3 vctDirection = vctPosition.xyz - vctPositionLight;
      vec3 vctDirectionInverted = mat3(u_spot[i].mtxShapeInverse) * vctDirection;
      if(vctDirectionInverted.z <= 0.0) continue;

      float fIntensity = 1.0 - min(1.0, 2.0 * length(vctDirectionInverted.xy) / vctDirectionInverted.z);    //Coneshape that is brightest in the center. Possible TODO: "Variable Spotlightsoftness"
      fIntensity *= 1.0 - pow(vctDirectionInverted.z, 2.0);                                                 //Prevents harsh lighting artifacts at boundary of the given spotlight
      if(fIntensity < 0.0) continue;

      illuminateDirected(vctDirection, vctView, vctNormal, u_spot[i].vctColor.rgb * fIntensity, v_vctDiffuse, v_vctSpecular);
    }

  #endif

    // TEXTURE: transform UVs
  #if defined(TEXTURE) || defined(NORMALMAP)

    v_vctTexture = vec2(u_mtxPivot * vec3(a_vctTexture, 1.0)).xy;

  #endif

  #if defined(MATCAP)

    vec4 vctVertexInCamera = normalize(u_mtxWorldToCamera * vctPosition);
    vctVertexInCamera.xy *= - 1.0;
    mat4 mtx_RotX = mat4(1, 0, 0, 0, 0, vctVertexInCamera.z, vctVertexInCamera.y, 0, 0, - vctVertexInCamera.y, vctVertexInCamera.z, 0, 0, 0, 0, 1);
    mat4 mtx_RotY = mat4(vctVertexInCamera.z, 0, - vctVertexInCamera.x, 0, 0, 1, 0, 0, vctVertexInCamera.x, 0, vctVertexInCamera.z, 0, 0, 0, 0, 1);

    vec3 vctNormal = mat3(mtxNormalMeshToWorld) * a_vctNormal;

    // adds correction for things being far and to the side, but distortion for things being close
    vctNormal = mat3(mtx_RotX * mtx_RotY) * vctNormal;

    vec3 vctReflection = normalize(mat3(u_mtxWorldToCamera) * normalize(vctNormal));
    vctReflection.y = - vctReflection.y;

    v_vctTexture = 0.5 * vctReflection.xy + 0.5;

  #endif
}`;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let Shader = (() => {
        var _a;
        let _classDecorators = [(_a = FudgeCore.RenderInjectorShader).decorate.bind(_a)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        var Shader = class {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                Shader = _classThis = _classDescriptor.value;
                if (_metadata)
                    Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            static { this.baseClass = Shader; }
            static { this.subclasses = []; }
            static getCoat() { return FudgeCore.CoatColored; }
            static getVertexShaderSource() {
                return this.insertDefines(FudgeCore.shaderSources["ShaderUniversal.vert"], this.define);
            }
            static getFragmentShaderSource() {
                return this.insertDefines(FudgeCore.shaderSources["ShaderUniversal.frag"], this.define);
            }
            static deleteProgram() { }
            static useProgram() { }
            static createProgram() { }
            static registerSubclass(_subclass) { return Shader.subclasses.push(_subclass) - 1; }
            static insertDefines(_shader, _defines) {
                if (!_defines)
                    return _shader;
                let code = "#version 300 es\n";
                for (let define of _defines)
                    code += `#define ${define}\n`;
                return _shader.replace("#version 300 es", code);
            }
            static {
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return Shader = _classThis;
    })();
    FudgeCore.Shader = Shader;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderAmbientOcclusion extends FudgeCore.Shader {
        static { this.define = []; }
        static getVertexShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderScreen.vert"], this.define);
        }
        static getFragmentShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderAmbientOcclusion.frag"], this.define);
        }
    }
    FudgeCore.ShaderAmbientOcclusion = ShaderAmbientOcclusion;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderBloom extends FudgeCore.Shader {
        static { this.define = []; }
        static getVertexShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderScreen.vert"], this.define);
        }
        static getFragmentShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderBloom.frag"], this.define);
        }
    }
    FudgeCore.ShaderBloom = ShaderBloom;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderFlat extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderFlat); }
        static {
            this.define = [
                "FLAT"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissive; }
    }
    FudgeCore.ShaderFlat = ShaderFlat;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderFlatSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderFlatSkin); }
        static {
            this.define = [
                "FLAT",
                "SKIN"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissive; }
    }
    FudgeCore.ShaderFlatSkin = ShaderFlatSkin;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderFlatTextured extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderFlatTextured); }
        static {
            this.define = [
                "FLAT",
                "TEXTURE"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissiveTextured; }
    }
    FudgeCore.ShaderFlatTextured = ShaderFlatTextured;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderFlatTexturedSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderFlatTexturedSkin); }
        static {
            this.define = [
                "FLAT",
                "TEXTURE",
                "SKIN"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissiveTextured; }
    }
    FudgeCore.ShaderFlatTexturedSkin = ShaderFlatTexturedSkin;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderGizmo extends FudgeCore.Shader {
        static { this.define = []; }
        static getVertexShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderGizmo.vert"], this.define);
        }
        static getFragmentShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderGizmo.frag"], this.define);
        }
    }
    FudgeCore.ShaderGizmo = ShaderGizmo;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderGizmoTextured extends FudgeCore.Shader {
        static { this.define = ["TEXTURE"]; }
        static getVertexShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderGizmo.vert"], this.define);
        }
        static getFragmentShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderGizmo.frag"], this.define);
        }
    }
    FudgeCore.ShaderGizmoTextured = ShaderGizmoTextured;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderGouraud extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderGouraud); }
        static {
            this.define = [
                "GOURAUD"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissive; }
    }
    FudgeCore.ShaderGouraud = ShaderGouraud;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderGouraudSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderGouraudSkin); }
        static {
            this.define = [
                "GOURAUD",
                "SKIN"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissive; }
    }
    FudgeCore.ShaderGouraudSkin = ShaderGouraudSkin;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderGouraudTextured extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderGouraudTextured); }
        static {
            this.define = [
                "GOURAUD",
                "TEXTURE"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissiveTextured; }
    }
    FudgeCore.ShaderGouraudTextured = ShaderGouraudTextured;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderGouraudTexturedSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderGouraudTexturedSkin); }
        static {
            this.define = [
                "GOURAUD",
                "TEXTURE",
                "SKIN"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissiveTextured; }
    }
    FudgeCore.ShaderGouraudTexturedSkin = ShaderGouraudTexturedSkin;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderLit extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderLit); }
        static { this.define = []; }
    }
    FudgeCore.ShaderLit = ShaderLit;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderLitSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderLitSkin); }
        static {
            this.define = [
                "SKIN"
            ];
        }
    }
    FudgeCore.ShaderLitSkin = ShaderLitSkin;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderLitTextured extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderLitTextured); }
        static {
            this.define = [
                "TEXTURE"
            ];
        }
        static getCoat() { return FudgeCore.CoatTextured; }
    }
    FudgeCore.ShaderLitTextured = ShaderLitTextured;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderLitTexturedSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderLitTexturedSkin); }
        static {
            this.define = [
                "TEXTURE",
                "SKIN"
            ];
        }
        static getCoat() { return FudgeCore.CoatTextured; }
    }
    FudgeCore.ShaderLitTexturedSkin = ShaderLitTexturedSkin;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderMatCap extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderMatCap); }
        static {
            this.define = [
                "MATCAP"
            ];
        }
        static getCoat() { return FudgeCore.CoatTextured; }
    }
    FudgeCore.ShaderMatCap = ShaderMatCap;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderOutline extends FudgeCore.Shader {
        static { this.define = []; }
        static getVertexShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderScreen.vert"], this.define);
        }
        static getFragmentShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderOutline.frag"], this.define);
        }
    }
    FudgeCore.ShaderOutline = ShaderOutline;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderPhong extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderPhong); }
        static {
            this.define = [
                "PHONG"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissive; }
    }
    FudgeCore.ShaderPhong = ShaderPhong;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderPhongSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderPhongSkin); }
        static {
            this.define = [
                "PHONG",
                "SKIN"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissive; }
    }
    FudgeCore.ShaderPhongSkin = ShaderPhongSkin;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderPhongTextured extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderPhongTextured); }
        static {
            this.define = [
                "PHONG",
                "TEXTURE"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissiveTextured; }
    }
    FudgeCore.ShaderPhongTextured = ShaderPhongTextured;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderPhongTexturedNormals extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderPhongTexturedNormals); }
        static {
            this.define = [
                "PHONG",
                "TEXTURE",
                "NORMALMAP"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissiveTexturedNormals; }
    }
    FudgeCore.ShaderPhongTexturedNormals = ShaderPhongTexturedNormals;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderPhongTexturedNormalsSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderPhongTexturedNormalsSkin); }
        static {
            this.define = [
                "PHONG",
                "TEXTURE",
                "NORMALMAP",
                "SKIN"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissiveTexturedNormals; }
    }
    FudgeCore.ShaderPhongTexturedNormalsSkin = ShaderPhongTexturedNormalsSkin;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderPhongTexturedSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderPhongTexturedSkin); }
        static {
            this.define = [
                "PHONG",
                "TEXTURE",
                "SKIN"
            ];
        }
        static getCoat() { return FudgeCore.CoatRemissiveTextured; }
    }
    FudgeCore.ShaderPhongTexturedSkin = ShaderPhongTexturedSkin;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderPick extends FudgeCore.Shader {
        static { this.define = []; }
        static getVertexShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderPick.vert"], this.define);
        }
        static getFragmentShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderPick.frag"], this.define);
        }
    }
    FudgeCore.ShaderPick = ShaderPick;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderPickTextured extends FudgeCore.Shader {
        static { this.define = ["TEXTURE"]; }
        static getVertexShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderPick.vert"], this.define);
        }
        static getFragmentShaderSource() {
            return this.insertDefines(FudgeCore.shaderSources["ShaderPick.frag"], this.define);
        }
    }
    FudgeCore.ShaderPickTextured = ShaderPickTextured;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class ShaderToon extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderToon); }
        static {
            this.define = [
                "PHONG",
                "TOON"
            ];
        }
        static getCoat() { return FudgeCore.CoatToon; }
    }
    FudgeCore.ShaderToon = ShaderToon;
    class ShaderToonSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderToonSkin); }
        static {
            this.define = [
                "PHONG",
                "TOON",
                "SKIN"
            ];
        }
        static getCoat() { return FudgeCore.CoatToon; }
    }
    FudgeCore.ShaderToonSkin = ShaderToonSkin;
    class ShaderToonTextured extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderToonTextured); }
        static {
            this.define = [
                "PHONG",
                "TOON",
                "TEXTURE"
            ];
        }
        static getCoat() { return FudgeCore.CoatToonTextured; }
    }
    FudgeCore.ShaderToonTextured = ShaderToonTextured;
    class ShaderToonTexturedSkin extends FudgeCore.Shader {
        static { this.iSubclass = FudgeCore.Shader.registerSubclass(ShaderToonTexturedSkin); }
        static {
            this.define = [
                "PHONG",
                "TOON",
                "TEXTURE",
                "SKIN"
            ];
        }
        static getCoat() { return FudgeCore.CoatToonTextured; }
    }
    FudgeCore.ShaderToonTexturedSkin = ShaderToonTexturedSkin;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class TextureDefault extends FudgeCore.TextureBase64 {
        static { this.color = new TextureDefault("TextureDefault", TextureDefault.getColor(), FudgeCore.MIPMAP.MEDIUM); }
        static { this.normal = new TextureDefault("TextureNormalDefault", TextureDefault.getNormal(), FudgeCore.MIPMAP.MEDIUM); }
        static { this.toon = new TextureDefault("TextureToonDefault", TextureDefault.getToon(), FudgeCore.MIPMAP.SMOOTH, FudgeCore.WRAP.CLAMP); }
        static { this.iconLight = new TextureDefault("IconDefaultLight", TextureDefault.getIconLight(), FudgeCore.MIPMAP.BLURRY, FudgeCore.WRAP.CLAMP, 256, 256); }
        static { this.iconCamera = new TextureDefault("IconDefaultCamera", TextureDefault.getIconCamera(), FudgeCore.MIPMAP.BLURRY, FudgeCore.WRAP.CLAMP, 256, 256); }
        static { this.iconAudio = new TextureDefault("IconDefaultAudio", TextureDefault.getIconAudio(), FudgeCore.MIPMAP.BLURRY, FudgeCore.WRAP.CLAMP, 256, 256); }
        static getColor() {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAADWLSURBVHhe7d0HnFTlvf/xH9uXZYGl9yrSRJpEUexYsJIba8Re498WNcZEb+41epOIsWs0Niyxm2g0duwaewO7oqJCAGnSt7H/8304B4dldpk5Z3b3zO7nzeu85pwzM8vMs7PPb35PO61qPBZjrVq18vfiKebFR/lFRPlFQ/lFE/fyy/FvAQBICwEEABAKAQQAEAp9IBHRhhoN5RcN5RdNSyg//YzCwkJr3bq1O169erXbMoEAEhF/wNFQftFQftE09/LLzc21Ll262E9+8hMbP368VVdX2+uvv27Tp093QSTq+yeARMQfcDSUXzSUXzTNtfxycnKspKTEBg0aZEceeaQdeuihtmLFCvvss89s3rx59vjjj9vDDz8cOROJHECqqqps9uzZtmzZMlu5cqVLldq1a2d9+/Z1+1HxAYyG8ouG8ouG8osmTPnl5+db9+7dbffdd7dTTz3V1cXvvvuuvfzyyy4DkVWrVtmNN95oS5YsccdhhQ4g5eXl9uyzz9qMGTNszZo1/tkfKQIq+u29995WWlrqn00fH8BoKL9oKL9oKL9o0ik/PbZNmza2xRZb2HHHHWeTJ0+2hQsX2pNPPmmLFy/2H7XOf/7zH7v11ltdPR5FqACyYMECu+eee1KKXmvXrrX99tvPRo8e7YJKuvgARkP5RROUnz67+iKUl5dnlZWVtnz58li8dj5/0TSn8lOT1b777msXXHCBde7c2V577TV78803k77Hb7/91u644w6rqKjwz4STdgBRtqHUJ4hoChCffPKJffXVV649rX379jZgwAC3BZQuTZo0ybbbbjuXXqWDD2A0lF80Qfl17NjRjjnmGOvUqZN988039sADD7gvUk39+vn8RdOcyq9r1642depU23rrre3RRx91X3JEdbSasIqLi23YsGHuXKYCSNopgXrvg+Ch/o/77rvPvVi9+J///Od29NFH29ChQ90LDGj4mNIlBZm4/8LQssycOdM1xb766qtJm2JF2UfPnj3t17/+tU2YMMF23XVXO/bYY11QQfM1f/58u+mmm1zfgfp44071sV6zPstB8FA9rC/8Tz31lOsXybS0MpAffvjBrr766vUdMUEfiFKm/fff38rKytan+MpGVPjBY/XHqezjrLPOcp3sqeIbTDSUX/3+8Ic/uM+r6EvQT3/6UzfsMSg33SqAqF35mWeesWuvvdadl4ceesjee+89/6hp8PmLpr7y06ilK6+80lXM0r9/fxs5cqT7glxQUODONbR0yi/4onPEEUe4Y420euedd9xgpqOOOsp23HFHNwpLmiQD+eCDDzboxX/77bddxnHggQdanz59rG3bti7bUIDo1q2b60APFBUV2XPPPReLtB9IRn9QL730Usodi7U7JtG8qEN6l1128Y/Mvv76a/vnP/9pf/7zn+3BBx+0L7/8MlZ1mZqq5s6d6z7H+qKjZivR+1DgCyYSZlJaAeSLL77w98w+//xz98IU7fTNLVmkHDFixAYd53q83lTUnn+gISjD1lD0VCuF4MsUmi/1J6hzWp+JYFPGqqZPVdSXXnqpy0w12ikO9JlUdrF06dL1n2NNJmyojCnlAKIX89133/lH5iKd2oPVrpYYJBKpOUujAQLqgHzrrbfqbGsGgDhR3TZu3LiN6rigctYXjldeecV947/++uvtjTfecK0zTSl4bY0h5QCib2dBW6BoCK+G5qpnvz7KTgJq2vr000/JQABkDTX/1FcpB/epA1v9Dmriuvvuu+3jjz9u9llqygGk9pwPRVkN1d3UsFwN6w2oj0RDIINOSwCIO9Vh6UyGVkBRE/+9995rF198cSz7SzIl5QBSOy1T770KVu1r9UkMMNpXlKbtGEA26d27d51N9ckoWKhfWF+WP/zwQ9dfctVVV7lBGmrNaS5SHsar4YoagRC4/PLL3WJc2267revrqItWfnziiSf8I7MrrrjCDS3TkLhU1O6cV2eQRnzFxWOPPebvxdNee+3l78VTU5Wfvsz06tXLTbwKMmLNadKowj333HP9Om4qP1Ucm2++ud12221uGHtA4+s18kWdrE2Fz180qZafRpxqCGzULCKoz3r06OG6ADQ8vL41A9MZxlsXDUvXcHX1QQfDzjM1jDflAKIp8YmFrXa+F154wUaNGlVvZFaweOSRR/yjdYFHHU36g0xF7QJUn8ovfvEL/wgIp0OHDi5Y6FthEEDU5DB8+HAbPHjwBpmzPoP6I5wyZYobdRO45ZZb3ECSVD/LQG2a3vCrX/2qzjq02QSQ2oHgsssuczMeNammvjdZO/Bccsklbo0WRd5U1P7ZajZLnF/S1PRtNc4Ss784aqryU3/cbrvt5r7QBAFE67tp3P/YsWPXD3tU+emPWxO0zj33XJdBBzRRdrPNNnP3NRU+f9GkWn6LFi1yQ2MzSavkaoSXvrTUpdkEEM04V2dQQDM0lYEoENT3JhVkNI1e1PehAKI3oW95qchEATakFIuvyVB+9Uucif73v//drZRw0EEHrR9dqPJTP5+aG1QZXnPNNe68qAlrzpw5/lHT4PMXTarlp+Z61Vthy1ufIdV/Wq1jzJgxtuWWW7ovMZuSifJryACScq9Q7YkomtWoP7xNFWjikN1gOZPE5gGgKSX236kvQ0PVEz/T+gPW8HNlJel0oqJ50UWY1N+VjqDyVx+HgoaWWD/ttNNcs2cqwSMbpPwXUXsYm2aVa8GuTRVq4iJkWvpBP2dTI7eAxpLYgakAohEyiaME9Y1RF+ZR81VcZhujcelLhQJIOtmAHjtw4EC3zJP6ODSYoCmbOhtKygEkcT6H6Pj777/fYHJhMonrBWkuiUa+1DdqC2hMiSvqqj9DQSLxM63mrD/96U8u+0hswkXLoTkdm2ppCYKLVuZQsFDQOOyww9zy6c35C3PKAURtwomLcamgtLRJfQFETVxa8iSg9mINwaUJC3GhjsyAPtMaqpk45+mPf/yja4ZVB3vU60cjO2kqQrLsI2jSVL2ozvCTTjrJTjjhBLe/qRU6GotedzqZU7pSDiAqrMS5G5qFrqn69a1rpdmXQQelaDVLdR5p6BoQB1qmIpFGxGg+iBbL0wSwp59+en3wUIdjpkfiIN70JXn27NnrM5CgQlYrihaL1WKyZ599trtgXuKyTU1Br0tdC5r0qC/qwaams2RzldSvrfv0eHWwh5FyAJEhQ4b4e+uGQeoCUXUtHKYC1yJjAf0S1L48fvz42ERnQJ/jbbbZxj9a90VJ/Xb/+Mc/3FUHP/roI/dZ1qJ5t99+e1ZcWAiZof5djb5KpC/Rutb4Oeec42513JDf8NOhTEiXtL3zzjvdnKZgu+GGG2yHHXbY4HUGCYEWgNTjzz//fLfwbbrvJa0Aojkfif0XmkSoIbq1U3v9wWmJYw0VC2juhx6vSVc0YSFOJk6c6EZaJcumVYkoG9HwXV3LRkMiAyzJ07xp3T7182rSqT4jv/zlL+3www93rShxrMPUsqM6Vv3TGq6rS2do/p4mbmsVEV16PKBgoStrqpVI13lSP83JJ5+c9qoKaV2RUPSCFJWDSKUmKnU+brXVVi4CqqNcLz5x6Xcdawy9Jh8q5UvnRcYlutclzeJrdJRfanT1Oa2gqm9sCgz6oqSMWX90weVBdU7zl9RMoM93U88BET5/0dRXfrpP9ZkCSFNJp/xUryor0kTr4MqD6dI8PWXbqUo7gIjWvldkTuXNaQSDLv25xx57uFm/am9Lp1CoAKOh/FKnIKLhmlo9YdasWa65Skv2JL5Gpf4qU51Ld15AQ+DzF01zKz99uTn44IPdaFf12aXz/jRiVs1d6QgVQNTvoWwiSO+SUWej/hC1CJkWXNTjNWs93SFtfACjofzSpyZZZdYKEJoHEmd8/qJpbuWnxysTUXNW7TlNm6KySLc8QgUQ0bezJ5980i0opzRPzVd68foWp0imFF/XRT/kkEPconUatRVm/gcfwGgov2gov2gov2jiXn6hA4jom5qChYbz6kqDSv81L0STszR8TB066nTUSJdgzHS6+ABGQ/lFQ/lFQ/lF06wDSEDpvtrbFDz049RMpVEKWiYiagHwAYyG8ouG8ouG8osm7uWXkQDSkPgARkP5RUP5RUP5RRP38gvXrgQAaPEIIACAUAggAIBQ1MAW70bAda8RIY0dOzbuv99Ye+vtt/09hNEq5n0McRf30iMDAQCEQgABAIRCAAEAhEIAAQCEQgABAIRCAAEAhJKRAKKrDOpKXVtvvbV/BgDQ3GUkgOhyoAMHDgx9YXYAQPahCQsAEEpGAkjcV7QEAGQeGQgAIBQCCAAgFAIIACCUjAaQuF89CwCQOWQgAIBQCCAAgFAyEkAYxgsALQ8ZCAAgFAIIACCUjAYQRmEBQMtBBgIACIUAAgAIhQACAAglIwGEYbwA0PKQgQAAQiGAAABCyWgAYRgvALQcZCAAgFAIIACAUAggAIBQMhJAGMYLAC0PGQgAIBQCCAAglIwGEIbxAkDLQQYCAAiFAAIACIUAAgAIJSMBhGG8ANDykIEAAELJUfYQdZs2bZr7YUcddVTS+6NsANBSaWRrnLeMZCD6QQCAloUmLABAKAQQAEAoGQ0g9FkAQMtBBgIACIUAAgAIhQACAAglIwGEYbwA0PKQgQAAQiGAAABCyWgAYRgvALQcZCAAgFAIIACAUAggAIBQMhJAGMYLAC0PGQgAIBQCCAAglIwGEIbxAkDLQQYCAAiFAAIACIUAAgAIJSMBhGG8ANDykIEAAEIhgAAAQsloAGEYLwC0HGQgAIBQCCAAgFAyEkAYhQUALQ8ZCAAgFAIIACAUAggAIJSMBhCG8QJAy0EGAgAIhQACAAglIwGEYbwA0PKQgQAAQiGAAABCIYAAAELJaABhGC8AtBzq/Y5c6w8bNswOOugg+/DDD+3+++/3z2aGF5R29ncRwoknnvicv4sQbvjrDf4ewqhpxZfKSGJefDRhAQBCyUgACZquGM4LAC0HGQgAIBQCCAAgFAIIACAUAggAIBQCCAAgFAIIACCUjAQQhvECQMtDBgIACIUAAgAIhQACAAiFAAIACIUAAgAIhQACAAglIwGEYbwA0PKQgQAAQiGAAABCIYAAAEIhgAAAQiGAAABCIYAAAELJSABhGC8AtDxkIACAUAggAIBQCCAAgFAIIACAUAggAIBQMhJAGIUFAC0PGQgAIBQCCAAgFAIIACAUAggAIBQCCAAgFAIIACCUjAQQhvECQMtDBgIACIUAAgAIhQACAAglR/0XUbfHH3/c/bA999wz6f1RNgBoqdSvHOeNDAQAEAoBBAAQCgEEABAKAQQAEAoBBAAQCgEEABBKRgKIhnMJw24BoOUgAwEAhEIAAQCEQgABAIRCAAEAhEIAAQCEkpEAwigsAGh5yEAAAKEQQAAAoRBAAAChEEAAAKEQQAAAoRBAAAChZCSAMIwXAFoeMhAAQCgEEABAKAQQAEAoBBAAQCgEEABAKAQQAEAoGQkgDOMFgJaHDAQAEEpGAkhubq67ra6udrcAgOYv5QCyYsUKu+OOO+zGG2+0e+65x5YvX+7fU7833njDpk2bZjfffLN9/PHH/lkAQLZLOYAoy5g9e7bNnTvXPv30U7vwwgvt888/t7Vr1/qP2Jgykmeffda++eYb++677+yqq67y7wEAZLuUA0hxcbH179/fPzJbvXq13X///S4zCQSd6YEvvvjCysvL3b6CycMPP+z2AQDZL60+kFGjRvl7Zp06dbLnnnuu3qasmTNn+ntmX375pS1btsw/AgBku7QCyODBg9d3mIv2P/vsM6uqqvLP/EjnlIEEPvroIxs3bpx/BADIdmkFkLy8PBsyZIh/tC6gPPPMM7Zq1Sr/zI/UPxI0X1VUVLhgMmnSJHcMAMh+aQUQGTNmjL9n1qFDB3vttdfWB5DEPpAPP/zQ3zPX6V5QUGATJ070zwAAsl3aAaRfv35WWFjoH5nbnzVrluskV5CQyspK17QVUDDZfvvtrUePHv4ZAEC2SzuA5OTk2JZbbukfmWvSevHFF12fh5q4RMFDQUQ0SkvDePfee28rLS115wAA2S/tACJjx47198zatm1rM2bMcPNB2rRp484lNl+p87ysrMy22247NxQYANA8qNMirRUQ27dvb6eccooLHEHfx5tvvmm9evWynXbayXbffXe77rrr1o/MuuGGG2z+/Pmhlzmpqam5wN9FCF75/4+/ixBOPPEEfw9h1NRsODcM6Yr3ArVpZyBqkpo+fboNHz7cP2M2dOhQN0u9T58+br5HEDy+//57N3OdNbIAoPlJO4AoOGhZksQlTNR0tWTJEmvXrp0bcRXQRMLas9MBAM1DqD4QzSh/6qmn3Gz0QPfu3e2DDz6wr7/+2h3r2iDqGwEANE+hAoiasTTyatCgQf4Zs80339ytvBs0X6lJa+nSpVxkCgCaqVABRM1XCxYssIULF65vomrdurXl5+e7fVE2krjsCQCgeQkVQCRoxurZs6d/Zt2KvaIsREN5yT4AoPkKHUA0hFfNWImz0gOaSKjl3uu7VggAILuFDiDKLtTPcdFFF7nFEoNgof4R9YVoxnoydZ0HAGSXtCcS1qZ+jhEjRriAoiG8a9as8e9JTo9PZ16I93OZSBgBEwmjYSJhNEwkjKqZTSSsTcFAo600A32fffbxz9aNSYUA0DykFEDUz6HOci1X0rVr1/WLJgYUFEpKStxEwoCaqrTcu56jVXg1SgsA0HykFEB0Yag5c+a4Geha1yqY61Ef9YksXrzYPUfLmSS76BQAIHvRow0ACCUjAYT5HgDQ8pCBAABCIYAAAEIhgAAAQsloAOHaHwDQcpCBAABCIYAAAELJSABhGC8AtDxkIACAUAggAIBQCCAAgFAyGkAYxgsALQcZCAAgFAIIACCUjAQQhvECQMtDBgIACIUAAgAIhQACAAglowGEYbwA0HKQgQAAQiGAAABCyUgAYRgvALQ8ZCAAgFAIIACAUDLahMUoLABoOchAAACh5Ch7iLq988477oeNHj066f1RNgBoqdSqE+eNDAQAEEpGAogikZAxAEDLQQYCAAiFAAIACIUAAgAIhQACAAiFAAIACIUAAgAIJSMBhGG8ANDykIEAAEIhgAAAQiGAAABCIYAAAEIhgAAAQiGAAABCyUgAYRgvALQ8ZCAAgFAIIACAUAggAIBQCCAAgFAIIACAUDISQBiFBQAtDxkIACAUAggAIBQCCAAglIz2gQAAWg4yEABAKAQQAEAoGQ0gDOMFgJaDDAQAEAoBBAAQCgEEABBKRgIIw3gBoOUhAwEAhEIAAQCEktEAwjBeAGg5yEAAAKEQQAAAoWQkgDAKCwBaHtX8kTsuOnbsaKeeeqotWrTIrr76av9sZtTU1Lzg7yKEt99+e0d/FyGMHTvW31un9pel2v1+TX1/bbUfX1tDPx/NG01YAIBQCCAAWhxlTm5bu3b9PtKXkQBC4QOIM9VRVZWVtmDed3bjn86xvYYUeFu+7TXUv/W2sw/byT5691WrqCi3tV5gwaaRgQD1UB9A4hZ8Ww22pr4fdVMQWLJogb3y9EN20j4jbd8tiu3IHfvZP6Zd5t27cdl9+NbLdtYh29v+I0rsoK272D9vv8YWzZ9r1dVV/iNQGwEEQLOhoPH15x/avX+92AWBn2/bwy465QD75ouP/EekZuWypXb9/51hU3boYz8b29Funvobm/Xxe14wqfYfAcloE5a+IQFAY1I/xgde9nDnNRfZz8aU2S+8bOPWy85zQSATylevtAduvsROmbyV+/l/u/r39sGbL/n3tmxkIACyRtB0t3Zttc1880Wbdul5tt+IEvvVYTt5Ffv/2hqvsm9I5WtWeYHq9/arKTvbvt7/e+c1F9pnM99ymU9LbFJUyhD5XZeVldnpp59uixcvtquuuso/mxneL4V5IBEwDySauM8D2ZTaz69tUz+voZ+fKv2c6qoqm/3FRzb9wdvtyQem2eqVy/x7m15Zp2626+TDbe9DT7DO3XtbTk5u2r+rbEQGAiCWgqAx5+vP7doLTrVjdx9ip0weaw/ddmWsgocsWTjPHrjpEjt610F2+s+2sTuvvcgWfz/P1lZXZyyIxhEBBECsqKP6hyUL7b4bptrpB4y34/YYao/efb0tmDvbf0S8qbP9zqsvsCN26mfnHrW7Pf+ve2zl8h+aZSAhgACIhVUrltkLj91nZx26g03ZvrfrCJ/18bv+vQ0nJ6eV5eXluvb8TFL2NPONF2zq2Ye7zOSCX0y2T99/w8rXrPYfkf1UZpHDIn0g8UUfSDRbbbWVv7dO7W+R6fZZNPT9tdV+fG1N/XzNsVgw5xu769qL7M0XHnOZR0MoLCiwfn172E4TxllJSZE7p5deXFxsnTuVWV5urpVXVNisr761Bx6abvMXLHKPyTSVl/pIdvuvo23Pg46xjl16bLIM40yvvP7fcArat29vZ5xxhi1ZssSuvPJK/2xmeB9AAkgEBJBoCCAN8/zKinI39Pa6C0+3ObM/d30FDaV3z67227OPd4FiU69X1IQ248PP7fJr77CVKxsuW8gvKLS+g4bbKf97rW02bLTl5uX592QPmrAANCr1ZRyz22D77dF72LdfftKgwSM/P8/O+eUx1qVzh5SCh+R62cioEYPt7FOP9M80DAXRLz58x844cFs7Yuf+9vF7r/n3ZA8CCIBGNfPZh2zN93P8o4bVyvtXVVW1yUyqNgWbFStX+UcNrcbWLJpnj175G/84exBAgHqo4kncVLEkbnG7v/ZW+/G1t2TPSdySPSdxS/acxC2ZZQvnWY82hda3pMCKc1PLCsKqqKy0s357qd121yP23sxPbekPyze5UKJe98LFS+3O+x71zzQcvf9+JfnWyysPVcZ1lVlc6bcX+RXTBxJf9IFEwwWloj0/mQcuOcteuv+v/pHZmqpqW7imylZVp/+zwiguKrRRWw62zp06WNvSEisoyHfnSloXu85zBZr3P/jMf3TDKMlrZZ0K86wwL9c/Y9ZryGg769YXLCcne77Xk4EAaFRVlRX+3jpFXiWqb+B9vW/ipV7F2tBWrym3V9+YYQ8/9rz97d5H7ZY7HrJrb7zXpl55q9129yMNGjza5udYvzYF1rOkcIPgITVa9TdEQG5KBBAAjaq6stLf25Aq1O5exdrfq2A7FGxYuWYzhcROhbk2oLTAurUusILc5NWuRn+FyeiaUkYDyKbSXSDb6DOduOkPPHFr6vuzUe0MpLZ8r4LtWJRnA0sLrYt3m60UArsVe++jbaGVFeZZ3iaaprJx2RMyEACNqrqq/gAiCpa5Oa2svVfxbuZVwD1b51t+lnw/LfZed+/WeTbAe91tC/Isxw/+m1KzVsOZCSAAUKdWrdKrdlQBl+TnWj8vI1H/QZu8HNcsFCd6R2X5Oda/tMB6e6+zOD8vpaCxgSxswMlIAMnWVBpA48vNz/f30qMKWf0H3b1sRBV1p4Jca4Q+93oVeDVo9+I87/UUWufWBZYfYQRVuoE1DrLvFQONKLG/QZsqscStqe/f1Fb7+bW3ZM9J3JI9J3FL9pzELZncvHABJKCfq/6EsqI8l5X09gJK61zv//Pvb2iqNNt6WZA6+/u2KbTSgjzX3BZVK+9n1FVmcUUAAdCoogaQgCpbNW8V5+daz5ICf/RWToP1lRR5FXxXL2gp++mqPhkvG8pkhb8uAyGAAECdkgWQbj262ennnW7Hn36cjdl6tBUUFPj3pMZlJW70Vr6XFRRYL6+Cb5MXPStRE1l7Lyip76W3t7UtyPWyjcwGjoALINkVPzIbQLIt/QLQ+JL1gRxw+M+8INLVBmw+wNs/wM6fep5tv+v2/r2pc1mJV8G39rKS7q0L3NyLLkW5VpTmkima8KcgpMDR2QtK6nvRz27IOq6VAhMZCNB8BJVGsG2qD6Cx789GyTKQ7j27+3vryjzfCzKTfrqn/fzYQ/2z6dPPUbbQvjDfevtNXJrQp47vZNp5QaNbUZ5t5k/4UxBSMNLPiapzt8625+Q9XYCsSyb+n8ZGAAHQqJIFkEULN76AkyrULUZvYWPHb7geWRguKHlZRAcvm+hXWmQDvSDRozjfunmbOuEVNLp6QaNtYV7G16KafMhkO+O8M2zH3XawY089xr2nZFrl5GZdEMlISWXrNyEAjS9ZAPlk5if+3oZUoU7ca1f/KHOUmbQpyHV9GuqEb4gFDPPy8uyYU462n0wY5/38dYFB/89BRx7o7qvNXVCqJQYQAEhVsgDyzOPPurWgkmlX1s7alLbxj7JDUXGRnfk/v7RBQwdtlFWoea5n357+UaJ1zZTZhAAC1KN2n4P+wBO3uN1fe6v9+Npbsuckbsmek7gle07ilkxOkgBSvqbc3nzlraTP0f/Ttn1b/yg7HHb8YVbWocw/2pDe4/IflvtH2Y0AAqBRFRS19vc29M97/2mzZ83eKIjoeFWjXR0wOmVLAwfV3Vm+cvlKW7xwsX+U3TLaB6JvCgBQn6KSUn9vY3+9/Aab/uh0W7li5fp6ZfaX39jSxUvdfjYYssVgN6s8GV0N8ZEH/uUfZT8yEACNqqik/uaoZx9/zi769f/Zf5/+O/vdL//H/nrZj1cvjD0vboz6ySj/YGPPPfG8zXh7hn+U/QggQD0S2/u16Vtx4tbU92ej0larrX1BlbdX/7XJ1aleWZH84lNxlZuTu8GcloB+V7O/nO2yq42ttTKvPIa3L/ePswcBBECjqlw616ssK214uworzMm+a2DUp3pttc35dq5/tC5wqNnqqUeetusvrZ1J1VhpXrWN9ALHMK88cltlXzkQQAA0qvJl6yYNti+ssTEdK2xASYXlumykGQQS7y1oMMCyH5a5wLFw/kKbdu2t9vyTz/sPkBor8gLn0LblNqKswtqkt+xXrBBAADSqtQmXtFVfc/eStbZVp3Lr07rSWjWDQLJowSK75HeX2MX/PdUuu+hy++KTL/x7aiy/1VobVFphoztUWIciNVH6d/myrVkyJ2hLjbLNmTPH/bAePXokvT/KBjSl4DOY+FlUX0Rw29T3B7Sf7FjPS3xu7eNAQz0/mbXVG1/SNs/7Ktu7TbVt1bHcuhVVeYFk4/8jm1RVVduypcu8AtNRjZdh1diANhU21nt/XYrXWrKJ7zVexuI/Yb2gHOO6ZSQD0Q8CmiN9tlVhxvU2G62tqrtjvCDXbGDbKu8b+hprl6eO9uwOJDne6+/tZVZjO66xbl7gyK2nxl1bWe4HkexBExZQj1Qq8aa8DTYdJ56Ly3EyNQlNWHUpzjMbXlZpo8vWWElu9nW0eyVgXQvXBY7eJdWW7wVGr1jqVbPWe591lFlcEUCAegSVYVxvs9Ha6tSG5npv0Vrnm43sUGFjvIxEHc95+XnWqUsn69Cpg/+oONHvo8ba51fZOC9wKJNSRqX3kYqamuzKPiSjASRbP9BAXeqrvONyG+zH8TiZ+pqwktGPUUaiEVtn/uo4O/N3v7Sz//csO/a0Y9O+cmHDqbE2edW2dac1bkhuKhlHbWq+8krPP8oOZCBAPYJKMa632Wht1aabsJJpXdbBynr2ce9d22aDB9qvLzrHiloX+Y9oCmvdXI6xXoY0skOlGwzgvbRwamjCApqVVCrxprwNNh0nnovLcTKpNmHVVrlqpZtbkah1SWs74oTD/aPGFEwCrLAtO1RY0caX90hbtnWgCwEEqEdQGcb1Nhul24QVqKootzkz3vKPftS5Y6kNbRd0tje0GmubX2Vbtl/jAkebgsz9DlwAybLfKQEEqEcqlXhT3wb7cTxOpiZkBiIzHrnXls3/cakQZSTvPXSXdSiscZ3tw7xA0rqBAomGFY9oX25btK+00gbpesm+LwQpBZA1a9bYypUr/aPwFi1aVOdVx4A4CirFuN5mo5y88LWvvqX/e9rVNv/zj6xizWp7+/5bbem3X7n7vCKxMi+QjNogkEQtIzVVrcs4NKy4rZdx6P9pCLomeoP98AaSUgB59tln7YorrrBXXnllozbIVKxatcoeeughu+aaa+yTT5Jf+xiIo1Qq8aa8DTYdJ56Ly3EyOfnROr2rytfYm3fdaE9d/Fub/8lM/+yPvP9+fSBRxtBm/YTEVIPJuse2dYFD61Up49B7W3dvQ8nJzXdll01SCiADBw60qqoqmz59ugskL7/8sq1YscK/d923NKn9gVHG8cQTT7jnvP/+++5x/fv39+8F4i+oDON6m41yCxpn1JRXRC5j2NILACPLyq19frW/REpd5eaVq7dpHsco7/FbNFLgCLTKVU98dgWQVt6HcJOfQmUdl1xyiWvKkuDD26lTJ+vbt68VFRW57KSwsNDGjx9vixcvtq+++sqWL19uOTk57vm63WyzzezQQw91PyMNL/i3COHtt9/e0d9FCGPHjt2o0o7brWhf4nqc6M2rTrCvnrrZP2o8eilrqs3mrc6179fkWWWNXqM2LXJYY52LqqxbcbUVNVFLUrv+I223K970MhHvBfiCcoyrlDIQVf5bbrml5fpvLPhQLFy40N5991179dVX3bECzIsvvmgzZ850wUOCJi/1fYwcOdLtA9lCf8D6vMf1NhtFbcIKyysyNyGxf2m1jelYbsPalVvXokp3q+N+bard/XpcU8j1yqVVslUWYyzlVztq1KikHeAKEEGQ0Ida+8k+2MpOBg8e7B8B2aG+yjsOt8Gm48RzcTlOprBtR3+v6WjCn/pJNmtb5W4jTQDMFO//V9llk5QDSPfu3a1jx/R/8foQKXNJzGCAbBFUhnG9zUYdNh/n7yFR6859/L3skVa+NHr0aPfBTYceT/MVslUqlXhT3wb7cTxOptuY3a3X9gf6R9mhbbee1nv01tZ3q+0stwHW32o/YLSNO+1G/yh7pBVAlEXow5EOPb5du3bWs2dP/wyQPYJKMa632SgnN8/Gn3O3bXH4RV4Bp1UFNbqi0nY27ufH24Tjz7SR+x1iI/Y+wHb6f7/1782Mntv9zHb988uW37rUP5M90vrtlZaWumG4+vCmSh3wYTIXIA5SqcSb8jbYdJx4Li7HddFjhh38G9vpD89YbnFmK8784hJrlYHmcmUdO53yG+s6aJirxwKFrUsyFviGT7nAtv313Y02tDnT0i4FBYOg0zwV+hApcwGyUVAZxvU223UZsYPtfdNn1mXURP9MNNsc/gvb45yLbNJvp9r4o06xjgM29+9Jj5qpfnLYCZZXUOif+VH5qpVexZb+hOpEuUUltvPFL9jwQ85fNwM9S6UdQIYOHZrWGvy9evWysrIy/wjILqlU4k19G+zH8TgVRe262I6/f9zGnPJX/0w4HfoMsE5+wFDG0LHvQNtmykleFvFbKyhJL8vpPXq8FdbxnMry1f5eOF1GTrR9b/3GOg+f4J/JXmkHkLy8PBs+fLj7BemDsinKWIBsFVSKcb1tLjT/YbM9j7P97phrecVt/bPp6Tly49FdKqc2HTvb1lNOTPmbvh43eOc93XOTKS5t5++lb9wZt9iOFz5uBW3a+2eyW6iGPM0JUTNWXQUcUJAZNmyYfwRkn1Qq8aa8DTYdJ56Ly3G6isq62uS7F9jQg8/zjtLrN61vdFTbrj1s2G77+Uf1K+3aPWnT1Y/S788t7TXE9r1jjvWfeKQLls1FqHfSp08fN7KqPvoQDRkyxC1zAmSroDKM621zlJOXb1tMucAm3fipFXVIffTm3Jnv+nsbU3l17L9ZSpV3aefu7vHJVJavsVduvtw/2rRWufmuo3yPa963ovZd/bPNR6gAosLVvI66Cln04WbuB7JdfZV3XG6D/Tgeh6Xntuk2wPa+ZZYNmHSif7Z+S7772tbWc7mIVJdLX7FovnsPibSM/PdffW5PX/LftmLhAv9s/Up7D7VJf/3EhnnZVE5eXqTyiKvQuZSCQ+1CTqTMQ4snAtksqBTjetuc6T3metnI2JOvtYlXvGGtu9W/knflqhX29n3T6iyXvMJCy0mhH+SHOd/YdzPesuqqSvezlsz51p658vf2+u1/8QKUloavn7KOQfuf7mUd73lBsJ97H81VSqvx1uXGG2+0uXN/vDpYQEuWjBs3zvbYYw//TCSsxhsBq/FGE/fVeAM6luBcXI4zqWZttb138zn2+b+uMa92989urPuwUTZ8z8luEmCilYsX2gvXXWxrqzYdBETLq+cXFlmFF5hS1W7AKNv67DusnZd9BGURRSZ+RkOK1JszZswYf29DWrqEuR9oDvQHrMowrrctiZqgRh33Z5t46WvWtt8W/tmN/eej92z6Fb+3L15+1qor110+V01bs/79XMrBQ2q8IJVq8NAKwyOO/pPtfuVb1r7PMPf7aQkiZSDl5eU2derUjSYWdujQwU499VT/KDIykAjIQKLheiCZOc40NSV99tAVNuO287yDuoNCbkGhte3ey8qX/2CrvAykIXQctp1tfeZt1mYTTWxhBOUYV5EyEC3RromFiW9S+3VlJkC20edZlWBcb1sqrac1+L/Oskk3fGxlm431z26suqLclsye1SDBQ9d23+acu2yXi59vkOCRDSIFEKm9wKL2R4wY4R8B2S1ZpR2n22DTceK5uBw3JP0/pd0G2K6X/tu2Ofce13ndWHptf5Dt+7e51meHg73XEbkazVqR37lGWiXO9RgwYIC1bRtuJikQN0FlGNdbrMtG+kw40Pa/a4H12ekw70zDNfvkFZfaxCvfsvFe5lHYhiWaIgcQzTbXzHR9oLUx9wPNSSqVeFPfBvtxPG5MBSVtbZuzb7c9/jLT8ks7+GczQ81VY065zibf/b11GMjq4oGM5F7BnBAFE80+B5qLoFKM6y021q7PUNv/znk2+IBfu4o/Eq+c2w8ca/vfvdAG7nG8myWPH2UkgHTr1s26du3q+j7SWakXiLtUKvGmvA02HSeei8txU9GEwZFH/cH28wJJx2ETXCBIly4xu8slL9tuV7y+7hojIX5GcxdpGG8iDenVSr0NcN1zhvFGwDDeaLbaaqv1FWNcb0X7ErfjuJj33jP29jUn2cp5X/pn6pbXuq1bv2rzfU/x3k/TdpAH5RlXGSsdDeltgOABNClVhPojjvNtsB/H47joNmpXm3T9R15g+L3lFrXxz9bivd5+E4+2/f82zwbvd5p32LTBIxtQQkA9gkoxrrdInfovhh9ynrvmyKD9z/DPrrPZ3ifb5HsW2U/OuMlNPkRqMtaE1YBowoqAJqxoWAsr2nGcVa5ebnNe/af1mnCA5cX0muRBecYVGQhQD/0BqzKM6y3Cyy8utX67TIlt8MgGCm+x/hTG/Y9Ef8hxRvlFQ/lFQ/lFE/fyIwMBAIRCAAGAFkDZzIoVK9xWn4qKClu6dKlVpbD0PU1YEZECR0P5RUP5RdOcyu/xxx+3N954wzp37mwnn3yyf3adjz76yJ588klbtmyZO9YlN/bZZx/r3//HVYRXrVpl//rXv+yTTz5x/6+mZWiZqkmTJtU5RYMMBACy3H/+8x978803rayszGUQiWbPnm0PPPCA9e3b10488UQ7/PDD3aTvu+++23744Qf/UWb33Xefe+yBBx5oJ510kk2YMEGjOG369On+IzYWOYAoMnXs2NH69OnjNr0BAEDjULbw6KOP2rBhw6xXr17+2R+9+OKL1q5dO5s8ebJbdkorpv/0pz+1yspKe+edd9xjvv76axc8dt99d3eNJy1NtdNOO9mgQYPsrbfeqrM5K3QAUepXUlJiW2yxhZ1zzjl2zz332J133mmnnHKKS4/inhoCQHPw/vvv24IFC1zlX5uuFqvgMHDgQLfYbUCBRJfd+O6779zxl1+uW+JFASPR5ptv7oKHfn4yoQKI0p8ePXq4iHbDDTe4tEjR7IMPPnAZyHHHHeciHgCg4WgNQjUx7bDDDkmvw6QOcwURtRLVprp65cqVbl99I8XFxda6dWt3HAhalOrqeE8rgCiC6UXqkrXnn3++XXHFFa7DRm1pzz33nM2fP9+9EL2p6upq/1kAgIagelfrEI4fP94/s6EgQOgxtemcOs5Fj6vrMbJ69Wp3W1vKAUTBQ2nPlClTbNq0aXbwwQfbu+++65qtFDgS6UUpiAAAGsb333/vOs733HPPTS5kqywkmcTn1felP/IoLGUeRx55pF144YUumNx2223273//2/2n6sRZs2aN/8h1nTrpDD8DAKRHw3LV2d2mTRs3CkubMgXVydpXnRw0SSXWzwGdUz+2qPmqrsdI8LjaUg4gulCUrn/+4Ycf2r333rt++NeiRYtcE5bOAwAax7x581ygUD90sH3xxReuv0L7r732mgsgGtC0cOFC/1nr6Au+zrVv394dKwipHzuYJxJQ/S519WmnHEAUiTRJZcaMGe5YTVRPP/20/eUvf7Hly5fbtttu684DABqe5mqcdtppG2yDBw+20tJSt695HPn5+dazZ08XWBKH4s6aNct1NWiUlWiOiHz66afuVhRkVN936tTJjaxNJuUAosikobqa0fjtt9+6wPHKK6+4Tpbjjz/eZScAgMahrEGjpBI3tRSpi0H7Gi0r22+/veskD1qKXn/9dXvwwQddn7amYYgCiY41ouvVV191j9PEwrlz59rEiRPdY5LRZI2UOyuUCgWpTtBJruFhF110kXXv3t11qovGFquPRI+LKu59Kc1pKYSmQPlFQ/lF09zKTwFAlf4RRxzhn1lHUyxeeukl1yRVVFTkAoYCQ+KwXTV9PfXUUy5bUd3dpUsXF3yGDBniP2JjaQWQZPSfqGNd0YsAEj+UXzSUXzSUXzRxL7+Um7AAAEhEAAGAZk7NUpdffrnrelBWc8stt2Rk5CwBBACaOQ1yUj/1888/7xZQVEe7Fl+MigACAC3AXnvtZe+9955b/mS//fbLSP8PAQQAWgAN8dWmmerBEN+oCCAA0AJoiO6IESNs5MiR7uqFmUAAAYBmTtcE0exzLfu+8847u6kWunRtVAQQAGjmtBjuUUcd5ZqwtHrI0Ucf7S7FERUBBACaAfVtLFmyZP01PhJpLSvNOtcyVNq0Xlayi0yJlon/6quvbPHixf6ZuqkbPtJUR2aiM5M1CsovGsovmuZUflolXc1SWgdLiykm0qU3NPoqWFBRmcg+++zj+kQCChj333+/W+U3oEvhHnjggUkvNiVkIACQ5TRRUCvp6gt97aCjBXC1cvo222xj5557rp166qnukuQPPfTQ+mXedcEpLZZbUVHhLlH+m9/8xl2yXNdKf+KJJ9xjkkk7gGgCSrDpKlW6rSuKb+p+AEA0arpSJT9u3DgXQGpT9qH+jl122cVlEmrO2nfffV3QCFqNPv/8c9d0tfvuu7vWJGUoGq2lyYZa0l2BJZmUA4gCgdaFHzVq1AablgNO1pamK1gNHz7cvQilQXo+ACCzdOEoXYlQo6tqU5PVnDlzXB2c+EVeQUQXk9IFqWT27Nnu/n79+rnjwIABA1ygUXBJJuVaXb34xx57rEuFHnvssfXbXXfdZTvuuKOLggFNUhk6dKjdfvvt9sgjj7irY2kqPUEEADJH12l64YUX3NLsWqa9Ni3RLsGVBxPpnK4TInqcOtlr93UEVyIMHldbWhmIsor333/frr/+erddd9117sJS11xzzforFYpSoD322MO1sd1000324osv2pQpU1zPPwAgM/SFXs1Wag1KJqj4k3WC62qFylxEj1OzVW3B84LH1ZZyAFGEUsbx8ccf+2fSozQouAgVACCab775xq2oO2nSpA2apxIFrT6Jl7MNqLNdQUT0uLoeI8Hjaks5gKgTRR0uDzzwgC1YsMBmzpzpjlPdNIRM11UHAESnpUm6du1qP/zwgxtppU37qqu1v3Tp0vVXHExW9yqrUKuSFBcXJ31MMKdEV6JNRmErrYHaSnPU1pZuNqEMJMy8EMaRR0P5RUP5RUP5RVNf+V122WW2fPly/2hju+66qxu6+8c//tH1SR9wwAH+Pevq46lTp7rL1Wq4ri6F+8orr7j5I5pHEtBlcJ999lk788wzk3ZBpB1AGhsfwGgov2gov2gov2jSLb+///3vbiL36aef7p8xN6lbkwN1LuhoV5/1gw8+aIcccogNHjzYzTzXoCcFnQkTJrjHaGCU+riVnRx33HHuXG0MiwKAZkzzP9SsNW3aNJdlaCXehx9+2A3t3Xzzzd1jNHy3f//+rqtB97/88st28803uyYxDYiqCxlIRHwDjIbyi4byi6a5ld+rr77q5mzoglGJ1OGuCYWLFi1yWYgCx7bbbusmewfUxaAmK63aq32N7tpuu+3clQzrQgCJiD/gaCi/aCi/aCi/aGjCAgCEQgABAIRg9v8B4hMOpI+XltsAAAAASUVORK5CYII=";
        }
        static getNormal() {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAFDmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDUtMDZUMjI6Mjg6MDYrMDIwMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDUtMDZUMjI6MzA6MjErMDI6MDAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDUtMDZUMjI6MzA6MjErMDI6MDAiCiAgIHBob3Rvc2hvcDpEYXRlQ3JlYXRlZD0iMjAyMy0wNS0wNlQyMjoyODowNiswMjAwIgogICBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIgogICBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIxIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMSIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICB0aWZmOkltYWdlV2lkdGg9IjEiCiAgIHRpZmY6SW1hZ2VMZW5ndGg9IjEiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJwcm9kdWNlZCIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWZmaW5pdHkgUGhvdG8gMiAyLjAuNCIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMy0wNS0wNlQyMjozMDoyMSswMjowMCIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+0IgVxAAAAYBpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZHPK0RRFMc/M37mR6NYKBYvDauhQYmNxcivwmKMMtjMvPml5o3Xe2/SZKtsFSU2fi34C9gqa6WIlGxZExv0nOepkcy5nXs+93vvOd17LngjWVUzy4Og5SwjPBpSZqNzStUjFVTSRAu+mGrqk9MjEUra2w0eJ151OrVKn/vXahNJUwVPtfCgqhuW8JjwxLKlO7wp3KRmYgnhY+GAIRcUvnb0uMtPDqdd/nDYiISHwNsgrKR/cfwXqxlDE5aX49eyefXnPs5L6pK5mWmJbeKtmIQZJYTCOMMM0Uc3AzL30UkPXbKiRH7wO3+KJclVZdYpYLBImgwWAVHzUj0pMSV6UkaWgtP/v301U709bvW6EFQ82PZLO1RtwOe6bb/v2/bnAZTdw1mumL+0B/2voq8XNf8u+Fbh5LyoxbfgdA2a7/SYEfuWysS9qRQ8H0F9FBovoWbe7dnPPoe3EFmRr7qA7R3okPO+hS824WfQgxGCcgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxJREFUCJljaGj4DwADgwIAVbjWPwAAAABJRU5ErkJggg==";
        }
        static getToon() {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP8AAAABCAYAAAARkHijAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV/TSotUBO0g4pChOtlFRRxLFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi7OCk6CIl/i8ptIjx4Lgf7+497t4BQqvGVDMQB1TNMjLJhJgvrIrBVwQRQBghDEnM1FPZxRw8x9c9fHy9i/Es73N/jgGlaDLAJxLHmW5YxBvEs5uWznmfOMIqkkJ8Tjxp0AWJH7kuu/zGueywwDMjRi4zTxwhFss9LPcwqxgq8QxxVFE1yhfyLiuctzirtQbr3JO/MFzUVrJcpzmGJJaQQhoiZDRQRQ0WYrRqpJjI0H7Cwz/q+NPkkslVBSPHAupQITl+8D/43a1Zmp5yk8IJoO/Ftj/GgeAu0G7a9vexbbdPAP8zcKV1/fUWMPdJerOrRY+AwW3g4rqryXvA5Q4w8qRLhuRIfppCqQS8n9E3FYDhW6B/ze2ts4/TByBHXS3fAAeHwESZstc93h3q7e3fM53+fgA4OXKPt/7K/gAAAAZiS0dEAP8AAAAAMyd88wAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+gHBAwdJ1j9WBsAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAVUlEQVQoz2NkYGD4zzAKhh5gZWBg4GBgYOBEo2FsKJ+Xk4FBipOBQZoDQktxMjCIsDEwSHFAMReE5sVmDhcWO1gYGBgYGMlINvj0MI7wZEis/6kbhgC04Qj/w7/HZgAAAABJRU5ErkJggg==";
        }
        static getIconLight() {
            return "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg viewBox='0 0 16 16' version='1.1' width='16' height='16' id='Light' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E .s%7Bfill:%23fff;stroke:%23000;stroke-width:.1px;%7D %3C/style%3E%3Crect class='s' x='0.17039293' y='10.002448' width='3.9000568' height='0.90009934' id='NNE' transform='rotate(-67.5)' /%3E%3Crect x='8.8295078' y='10.002447' width='3.9000568' height='0.90009934' id='ENE' transform='rotate(-22.5)' class='s' /%3E%3Crect x='14.952469' y='3.8795717' width='3.9000139' height='0.90009987' id='ESE' transform='rotate(22.5)' class='s' /%3E%3Crect x='14.95247' y='-4.7795429' width='3.9000139' height='0.90009987' id='SSE' transform='rotate(67.5)' class='s' /%3E%3Crect x='-12.729565' y='10.002447' width='3.9000139' height='0.90009987' id='SSW' transform='rotate(-67.5)' class='s' /%3E%3Crect x='-4.0704498' y='10.002447' width='3.9000139' height='0.90009987' id='WSW' transform='rotate(-22.5)' class='s' /%3E%3Crect x='2.0524685' y='3.8795717' width='3.9000139' height='0.90009987' id='WNW' transform='rotate(22.5)' class='s' /%3E%3Crect x='2.0524685' y='-4.7795429' width='3.9000139' height='0.90009987' id='NNW' transform='rotate(67.5)' class='s' /%3E%3Cellipse id='CENTER' cx='8.000082' cy='8.0002575' rx='3.4500823' ry='3.4502573' class='s' /%3E%3C/svg%3E";
        }
        static getIconCamera() {
            return "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg id='Camera' viewBox='0 0 16 16' version='1.1' width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle id='style1'%3E.s%7Bfill:%23fff;stroke:%23000;stroke-width:.1px;%7D %3C/style%3E%3Cpath class='s' d='M 13.857322,8.8755297 H 12.413424 L 12.413,6.787 h -1.425311 c 0.227026,-0.4494693 0.363243,-0.9453919 0.363243,-1.4885008 0,-1.7978775 -1.4075727,-3.2492893 -3.1511466,-3.2492893 -1.7435746,0 -3.1511479,1.4514118 -3.1511479,3.2492893 v 0.028093 C 4.5764194,5.0363118 4.0315524,4.8583968 3.4503606,4.8583968 1.7067863,4.8677567 0.29921298,6.3191723 0.29921298,8.107686 c 0,1.7885135 1.66538582,3.311789 3.42458512,3.249289 L 3.732,13.976 h 8.681 v -2.113368 h 1.444322 z' id='path1' /%3E%3Crect class='s' x='12.80391' y='8.3979683' width='2.8968766' height='3.8860376' rx='0' ry='0' id='rect1' /%3E%3C/svg%3E%0A";
        }
        static getIconAudio() {
            return "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg id='Audio' viewBox='0 0 16 16' version='1.1' width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.s%7Bfill:%23fff;stroke:%23000;stroke-width:.1px;%7D %3C/style%3E%3Cpath class='s' d='M 9.1563588,1.0804006 3.6729341,4.642017 H 0.54364971 v 6.784031 H 3.7590612 l 5.3972976,3.493776 z' id='path1' /%3E%3Cpath class='s' d='m 13.347518,13.676645 -0.765157,-0.563566 c 4.227485,-5.5605241 0.210418,-9.881202 0.03825,-10.0596648 l 0.698204,-0.6481019 c 0.04782,0.046964 4.75353,5.0627076 0.03825,11.2713327 z' id='path2' /%3E%3Cpath class='s' d='m 11.321868,11.79809 -0.822541,-0.479032 c 2.142434,-3.5786474 0.114773,-6.35891 0.02869,-6.4716232 l 0.765156,-0.5635666 c 0.105208,0.1408915 2.505883,3.3814001 0.02869,7.5048298 z' id='path3' /%3E%3C/svg%3E%0A";
        }
    }
    FudgeCore.TextureDefault = TextureDefault;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    let LOOP_MODE;
    (function (LOOP_MODE) {
        LOOP_MODE["FRAME_REQUEST"] = "frameRequest";
        LOOP_MODE["FRAME_REQUEST_XR"] = "frameRequestXR";
        LOOP_MODE["TIME_GAME"] = "timeGame";
        LOOP_MODE["TIME_REAL"] = "timeReal";
    })(LOOP_MODE = FudgeCore.LOOP_MODE || (FudgeCore.LOOP_MODE = {}));
    class Loop extends FudgeCore.EventTargetStatic {
        static { this.ƒTimeStartGame = 0; }
        static { this.ƒTimeStartReal = 0; }
        static { this.ƒTimeFrameGame = 0; }
        static { this.ƒTimeFrameReal = 0; }
        static { this.ƒTimeFrameStartGame = 0; }
        static { this.ƒTimeFrameStartReal = 0; }
        static { this.ƒTimeLastFrameGameAvg = 0; }
        static { this.ƒTimeLastFrameRealAvg = 0; }
        static { this.ƒFrames = 0; }
        static { this.running = false; }
        static { this.mode = LOOP_MODE.FRAME_REQUEST; }
        static { this.idIntervall = 0; }
        static { this.idRequest = 0; }
        static { this.fpsDesired = 30; }
        static { this.framesToAverage = 30; }
        static { this.syncWithAnimationFrame = false; }
        static get timeStartGame() { return Loop.ƒTimeStartGame; }
        static get timeStartReal() { return Loop.ƒTimeStartReal; }
        static get timeFrameGame() { return Loop.ƒTimeFrameGame; }
        static get timeFrameReal() { return Loop.ƒTimeFrameReal; }
        static get timeFrameStartGame() { return Loop.ƒTimeFrameStartGame; }
        static get timeFrameStartReal() { return Loop.ƒTimeFrameStartReal; }
        static get fpsGameAverage() { return 1000 / Loop.ƒTimeLastFrameGameAvg; }
        static get fpsRealAverage() { return 1000 / Loop.ƒTimeLastFrameRealAvg; }
        static get frames() { return Loop.ƒFrames; }
        static start(_mode = LOOP_MODE.FRAME_REQUEST, _fps = 60, _syncWithAnimationFrame = false) {
            Loop.stop();
            Loop.ƒTimeStartGame = FudgeCore.Time.game.get();
            Loop.ƒTimeStartReal = performance.now();
            Loop.ƒTimeFrameStartGame = Loop.ƒTimeStartGame;
            Loop.ƒTimeFrameStartReal = Loop.ƒTimeStartReal;
            Loop.fpsDesired = (_mode == LOOP_MODE.FRAME_REQUEST) ? 60 : _fps;
            Loop.framesToAverage = Loop.fpsDesired;
            Loop.ƒTimeLastFrameGameAvg = Loop.ƒTimeLastFrameRealAvg = 1000 / Loop.fpsDesired;
            Loop.mode = _mode;
            Loop.syncWithAnimationFrame = _syncWithAnimationFrame;
            let log = `Loop starting in mode ${Loop.mode}`;
            if (Loop.mode != LOOP_MODE.FRAME_REQUEST)
                log += ` with attempted ${_fps} fps`;
            FudgeCore.Debug.fudge(log);
            switch (_mode) {
                case LOOP_MODE.FRAME_REQUEST:
                    Loop.loopFrame();
                    break;
                case LOOP_MODE.FRAME_REQUEST_XR:
                    Loop.loopFrameXR();
                    break;
                case LOOP_MODE.TIME_REAL:
                    Loop.idIntervall = window.setInterval(Loop.loopTime, 1000 / Loop.fpsDesired);
                    Loop.loopTime();
                    break;
                case LOOP_MODE.TIME_GAME:
                    Loop.idIntervall = FudgeCore.Time.game.setTimer(1000 / Loop.fpsDesired, 0, Loop.loopTime);
                    Loop.loopTime();
                    break;
                default:
                    break;
            }
            Loop.running = true;
        }
        static stop() {
            if (!Loop.running)
                return;
            switch (Loop.mode) {
                case LOOP_MODE.FRAME_REQUEST:
                    window.cancelAnimationFrame(Loop.idRequest);
                    break;
                case LOOP_MODE.FRAME_REQUEST_XR:
                    FudgeCore.XRViewport.default.session.cancelAnimationFrame(Loop.idRequest);
                    FudgeCore.XRViewport.default.session = null;
                    break;
                case LOOP_MODE.TIME_REAL:
                    window.clearInterval(Loop.idIntervall);
                    window.cancelAnimationFrame(Loop.idRequest);
                    break;
                case LOOP_MODE.TIME_GAME:
                    FudgeCore.Time.game.deleteTimer(Loop.idIntervall);
                    window.cancelAnimationFrame(Loop.idRequest);
                    break;
                default:
                    break;
            }
            Loop.running = false;
            FudgeCore.Debug.fudge("Loop stopped!");
        }
        static continue() {
            if (Loop.running)
                return;
            Loop.start(Loop.mode, Loop.fpsDesired, Loop.syncWithAnimationFrame);
        }
        static loop() {
            let time;
            time = performance.now();
            Loop.ƒTimeFrameReal = time - Loop.ƒTimeFrameStartReal;
            Loop.ƒTimeFrameStartReal = time;
            time = FudgeCore.Time.game.get();
            Loop.ƒTimeFrameGame = time - Loop.ƒTimeFrameStartGame;
            Loop.ƒTimeFrameStartGame = time;
            Loop.ƒTimeLastFrameGameAvg = ((Loop.framesToAverage - 1) * Loop.ƒTimeLastFrameGameAvg + Loop.ƒTimeFrameGame) / Loop.framesToAverage;
            Loop.ƒTimeLastFrameRealAvg = ((Loop.framesToAverage - 1) * Loop.ƒTimeLastFrameRealAvg + Loop.ƒTimeFrameReal) / Loop.framesToAverage;
            Loop.ƒFrames++;
            const event = FudgeCore.RecyclableEvent.get("loopFrame");
            Loop.dispatchEvent(event);
            FudgeCore.RecyclableEvent.store(event);
        }
        static loopFrame() {
            Loop.loop();
            Loop.idRequest = window.requestAnimationFrame(Loop.loopFrame);
        }
        static loopFrameXR(_time = null, _xrFrame = null) {
            Loop.loop();
            FudgeCore.XRViewport.default.draw(true, _xrFrame);
            Loop.idRequest = FudgeCore.XRViewport.default.session.requestAnimationFrame(Loop.loopFrameXR);
        }
        static loopTime() {
            if (Loop.syncWithAnimationFrame)
                Loop.idRequest = window.requestAnimationFrame(Loop.loop);
            else
                Loop.loop();
        }
    }
    FudgeCore.Loop = Loop;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Time extends FudgeCore.EventTargetUnified {
        static { this.game = new Time(); }
        constructor() {
            super();
            this.timers = {};
            this.idTimerAddedLast = 0;
            this.start = performance.now();
            this.scale = 1.0;
            this.offset = 0.0;
            this.lastCallToElapsed = 0.0;
        }
        static getUnits(_milliseconds) {
            let units = {};
            units.asSeconds = _milliseconds / 1000;
            units.asMinutes = units.asSeconds / 60;
            units.asHours = units.asMinutes / 60;
            units.hours = Math.floor(units.asHours);
            units.minutes = Math.floor(units.asMinutes) % 60;
            units.seconds = Math.floor(units.asSeconds) % 60;
            units.fraction = _milliseconds % 1000;
            units.thousands = _milliseconds % 10;
            units.hundreds = _milliseconds % 100 - units.thousands;
            units.tenths = units.fraction - units.hundreds - units.thousands;
            return units;
        }
        get() {
            return this.offset + this.scale * (performance.now() - this.start);
        }
        getRemainder(_to) {
            return _to - this.get();
        }
        set(_time = 0) {
            this.offset = _time;
            this.start = performance.now();
            this.getElapsedSincePreviousCall();
        }
        setScale(_scale = 1.0) {
            this.set(this.get());
            this.scale = _scale;
            this.rescaleAllTimers();
            this.getElapsedSincePreviousCall();
            this.dispatchEvent(new Event("timeScaled"));
        }
        getScale() {
            return this.scale;
        }
        getOffset() {
            return this.offset;
        }
        getElapsedSincePreviousCall() {
            let current = this.get();
            let elapsed = current - this.lastCallToElapsed;
            this.lastCallToElapsed = current;
            return elapsed;
        }
        delay(_lapse) {
            return new Promise(_resolve => this.setTimer(_lapse, 1, () => _resolve()));
        }
        clearAllTimers() {
            for (let id in this.timers) {
                this.deleteTimer(Number(id));
            }
        }
        deleteTimerByItsInternalId(_id) {
            for (let id in this.timers) {
                let timer = this.timers[id];
                if (timer.id == _id) {
                    timer.clear();
                    delete this.timers[id];
                }
            }
        }
        setTimer(_lapse, _count, _handler, ..._arguments) {
            new FudgeCore.Timer(this, _lapse, _count, _handler, ..._arguments);
            return this.idTimerAddedLast;
        }
        addTimer(_timer) {
            this.timers[++this.idTimerAddedLast] = _timer;
            return this.idTimerAddedLast;
        }
        deleteTimer(_id) {
            let timer = this.timers[_id];
            if (!timer)
                return;
            timer.clear();
            delete this.timers[_id];
        }
        getTimer(_id) {
            return this.timers[_id];
        }
        getTimers() {
            let result = {};
            return Object.assign(result, this.timers);
        }
        hasTimers() {
            return (Object.keys(this.timers).length > 0);
        }
        rescaleAllTimers() {
            for (let id in this.timers) {
                let timer = this.timers[id];
                timer.clear();
                delete this.timers[id];
                if (!this.scale)
                    continue;
                timer = timer.installCopy();
                delete this.timers[this.idTimerAddedLast];
                this.timers[id] = timer;
            }
        }
    }
    FudgeCore.Time = Time;
})(FudgeCore || (FudgeCore = {}));
var FudgeCore;
(function (FudgeCore) {
    class Timer {
        constructor(_time, _elapse, _count, _handler, ..._arguments) {
            this.time = _time;
            this.elapse = _elapse;
            this.event = new FudgeCore.EventTimer(this, ..._arguments);
            this.handler = _handler;
            this.count = _count;
            let scale = Math.abs(_time.getScale());
            if (!scale) {
                this.active = false;
                return;
            }
            this.timeoutReal = this.elapse / scale;
            let callback = () => {
                if (!this.active)
                    return;
                this.event.count = this.count;
                this.event.lastCall = (this.count == 1);
                _handler(this.event);
                this.event.firstCall = false;
                if (this.count > 0)
                    if (--this.count == 0)
                        _time.deleteTimerByItsInternalId(this.idWindow);
            };
            this.idWindow = window.setInterval(callback, this.timeoutReal, ..._arguments);
            this.active = true;
            _time.addTimer(this);
        }
        get id() {
            return this.idWindow;
        }
        get lapse() {
            return this.elapse;
        }
        installCopy() {
            return new Timer(this.time, this.elapse, this.count, this.handler, this.event.arguments);
        }
        clear() {
            window.clearInterval(this.idWindow);
            this.active = false;
        }
    }
    FudgeCore.Timer = Timer;
})(FudgeCore || (FudgeCore = {}));
