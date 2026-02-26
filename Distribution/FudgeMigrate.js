"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var FudgeMigrate;
(function (FudgeMigrate) {
    var ƒ = FudgeCore;
    function register(_class, _migrate) {
        const originalDeserialize = _class.prototype.deserialize;
        _class.prototype.deserialize = function (_serialization) {
            // Run migration before deserialization
            _serialization = _migrate.call(this, _serialization);
            // Call the original deserialize (like super)
            return originalDeserialize.call(this, _serialization);
        };
    }
    FudgeMigrate.register = register;
    register(ƒ.Component, (_serialization) => {
        if (_serialization.Component?.active != undefined && _serialization.active == undefined)
            _serialization.active = _serialization.Component.active;
        delete _serialization.Component;
        return _serialization;
    });
    register(ƒ.ComponentMesh, (_serialization) => {
        if (_serialization.idMesh != undefined && _serialization.mesh == undefined)
            _serialization.mesh = _serialization.idMesh;
        if (_serialization.pivot != undefined && _serialization.mtxPivot == undefined)
            _serialization.mtxPivot = _serialization.pivot;
        delete _serialization.idMesh;
        delete _serialization.pivot;
        return _serialization;
    });
    register(ƒ.ComponentAnimation, (_serialization) => {
        if (_serialization.idAnimation != undefined && _serialization.animation == undefined)
            _serialization.animation = _serialization.idAnimation;
        delete _serialization.idAnimation;
        return _serialization;
    });
    register(ƒ.ComponentAudio, (_serialization) => {
        if (_serialization.idResource != undefined && _serialization.audio == undefined)
            _serialization.audio = _serialization.idResource;
        delete _serialization.idResource;
        return _serialization;
    });
    register(ƒ.ComponentParticleSystem, (_serialization) => {
        if (_serialization.idParticleSystem != undefined && _serialization.particleSystem == undefined)
            _serialization.particleSystem = _serialization.idParticleSystem;
        delete _serialization.idParticleSystem;
        return _serialization;
    });
    register(ƒ.ComponentCamera, (_serialization) => {
        if (_serialization.pivot != undefined && _serialization.mtxPivot == undefined)
            _serialization.mtxPivot = _serialization.pivot;
        if (_serialization.backgroundColor != undefined && _serialization.clrBackground == undefined)
            _serialization.clrBackground = _serialization.backgroundColor;
        delete _serialization.pivot;
        delete _serialization.backgroundColor;
        return _serialization;
    });
    register(ƒ.ComponentLight, (_serialization) => {
        if (_serialization.pivot != undefined && _serialization.mtxPivot == undefined)
            _serialization.mtxPivot = _serialization.pivot;
        const light = _serialization.light;
        if (light != undefined) {
            for (const path in light) {
                const lightSerialization = light[path];
                if (_serialization.lightType == undefined)
                    _serialization.lightType = path.substring(path.lastIndexOf(".") + 1);
                if (_serialization.color == undefined && lightSerialization.color != undefined)
                    _serialization.color = lightSerialization.color;
                if (_serialization.intensity == undefined && lightSerialization.intensity != undefined)
                    _serialization.intensity = lightSerialization.intensity;
            }
        }
        delete _serialization.pivot;
        delete _serialization.light;
        return _serialization;
    });
    register(ƒ.ComponentMaterial, (_serialization) => {
        if (_serialization.idMaterial != undefined && _serialization.material == undefined)
            _serialization.material = _serialization.idMaterial;
        if (_serialization.clrPrimary != undefined && _serialization.color == undefined)
            _serialization.color = _serialization.clrPrimary;
        if (_serialization.pivot != undefined && _serialization.mtxPivot == undefined)
            _serialization.mtxPivot = _serialization.pivot;
        delete _serialization.idMaterial;
        delete _serialization.clrPrimary;
        delete _serialization.pivot;
        return _serialization;
    });
    register(ƒ.ComponentTransform, (_serialization) => {
        if (_serialization.local != undefined && _serialization.mtxLocal == undefined)
            _serialization.mtxLocal = _serialization.local;
        delete _serialization.local;
        return _serialization;
    });
    register(ƒ.ComponentRigidbody, (_serialization) => {
        if (_serialization.pivot != undefined && _serialization.mtxPivot == undefined)
            _serialization.mtxPivot = _serialization.pivot;
        delete _serialization.pivot;
        if (typeof _serialization.initialization == "string")
            _serialization.initialization = ƒ.BODY_INIT[_serialization.initialization];
        if (typeof _serialization.typeBody == "string")
            _serialization.typeBody = ƒ.BODY_TYPE[_serialization.typeBody];
        if (typeof _serialization.typeCollider == "string")
            _serialization.typeCollider = ƒ.COLLIDER_TYPE[_serialization.typeCollider];
        return _serialization;
    });
    register(ƒ.Animation, (_serialization) => {
        if (_serialization.framesPerSecond != undefined && _serialization.fps == undefined)
            _serialization.fps = _serialization.framesPerSecond;
        delete _serialization.framesPerSecond;
        return _serialization;
    });
    register(ƒ.AnimationSprite, (_serialization) => {
        if (_serialization.Animation != undefined) {
            for (const key in _serialization.Animation)
                _serialization[key] = _serialization.Animation[key];
            delete _serialization.Animation;
        }
        if (_serialization.idTexture != undefined && _serialization.texture == undefined)
            _serialization.texture = _serialization.idTexture;
        delete _serialization.idTexture;
        return _serialization;
    });
    register(ƒ.CoatTextured, (_serialization) => {
        if (_serialization.idTexture != undefined && _serialization.texture == undefined)
            _serialization.texture = _serialization.idTexture;
        delete _serialization.idTexture;
        return _serialization;
    });
    register(ƒ.CoatRemissiveTexturedNormals, (_serialization) => {
        if (_serialization.idNormalMap != undefined && _serialization.normalMap == undefined)
            _serialization.normalMap = _serialization.idNormalMap;
        delete _serialization.idNormalMap;
        return _serialization;
    });
    function migrateCoatToon(_serialization) {
        if (_serialization.idTexToon != undefined && _serialization.texToon == undefined)
            _serialization.texToon = _serialization.idTexToon;
        delete _serialization.idTexToon;
        return _serialization;
    }
    register(ƒ.CoatToon, migrateCoatToon);
    register(ƒ.CoatToonTextured, migrateCoatToon);
    register(ƒ.Material, (_serialization) => {
        const coat = _serialization.coat;
        if (coat != undefined) {
            const keys = Object.keys(coat);
            const type = keys[0];
            if (keys.length == 1 && type.startsWith("ƒ.")) {
                _serialization.coat = coat[type];
                _serialization.coat["@type"] = type;
            }
        }
        return _serialization;
    });
    register(ƒ.MeshRelief, (_serialization) => {
        if (_serialization.idTexture != undefined && _serialization.texture == undefined)
            _serialization.texture = _serialization.idTexture;
        delete _serialization.idTexture;
        return _serialization;
    });
    register(ƒ.Texture, (_serialization) => {
        if (_serialization.Texture != undefined) {
            for (const key in _serialization.Texture)
                _serialization[key] = _serialization.Texture[key];
            delete _serialization.Texture;
        }
        if (typeof _serialization.mipmap == "string")
            _serialization.mipmap = ƒ.MIPMAP[_serialization.mipmap];
        if (typeof _serialization.wrap == "string")
            _serialization.wrap = ƒ.WRAP[_serialization.wrap];
        return _serialization;
    });
    register(ƒ.TextureImage, function (_serialization) {
        if (_serialization.Texture != undefined)
            ƒ.Project.register(this, _serialization.Texture.idResource);
        return _serialization;
    });
    register(ƒ.TextureText, function (_serialization) {
        if (_serialization.Texture != undefined)
            ƒ.Project.register(this, _serialization.Texture.idResource);
        return _serialization;
    });
})(FudgeMigrate || (FudgeMigrate = {}));
var FudgeCore;
(function (FudgeCore) {
    /**
     * @deprecated Use ComponentAnimation instead of ComponentAnimator. Exists only for backwards compatibility. Will be removed in future versions.
     */
    let ComponentAnimator = (() => {
        let _classDecorators = [((_value) => FudgeCore.ComponentAnimation)];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = FudgeCore.ComponentAnimation;
        var ComponentAnimator = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                ComponentAnimator = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
        };
        return ComponentAnimator = _classThis;
    })();
    FudgeCore.ComponentAnimator = ComponentAnimator;
})(FudgeCore || (FudgeCore = {}));
