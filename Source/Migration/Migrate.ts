namespace FudgeMigrate {
  import ƒ = FudgeCore;
  import Serialization = ƒ.Serialization;
  import Serializable = ƒ.Serializable;
  import General = ƒ.General;

  export type MigrateFunction = (this: Serializable, _serialization: ƒ.Serialization) => Serialization;

  export function register(_class: abstract new (..._params: General[]) => Serializable, _migrate: MigrateFunction): void {
    const originalDeserialize: Serializable["deserialize"] = (<Serializable>_class.prototype).deserialize;

    _class.prototype.deserialize = function (this: Serializable, _serialization: Serialization) {
      // Run migration before deserialization
      _serialization = _migrate.call(this, _serialization);

      // Call the original deserialize (like super)
      return originalDeserialize.call(this, _serialization);
    };
  }

  register(ƒ.Component, (_serialization: Serialization): Serialization => {
    if (_serialization.Component?.active != undefined && _serialization.active == undefined)
      _serialization.active = _serialization.Component.active;

    delete _serialization.Component;
    return _serialization;
  });

  register(ƒ.ComponentMesh, (_serialization: Serialization): Serialization => {
    if (_serialization.idMesh != undefined && _serialization.mesh == undefined)
      _serialization.mesh = _serialization.idMesh;

    if (_serialization.pivot != undefined && _serialization.mtxPivot == undefined)
      _serialization.mtxPivot = _serialization.pivot;

    delete _serialization.idMesh;
    delete _serialization.pivot;
    return _serialization;
  });

  register(ƒ.ComponentAnimation, (_serialization: Serialization): Serialization => {
    if (_serialization.idAnimation != undefined && _serialization.animation == undefined)
      _serialization.animation = _serialization.idAnimation;

    delete _serialization.idAnimation;
    return _serialization;
  });

  register(ƒ.ComponentAudio, (_serialization: Serialization): Serialization => {
    if (_serialization.idResource != undefined && _serialization.audio == undefined)
      _serialization.audio = _serialization.idResource;

    delete _serialization.idResource;
    return _serialization;
  });

  register(ƒ.ComponentParticleSystem, (_serialization: Serialization): Serialization => {
    if (_serialization.idParticleSystem != undefined && _serialization.particleSystem == undefined)
      _serialization.particleSystem = _serialization.idParticleSystem;

    delete _serialization.idParticleSystem;
    return _serialization;
  });

  register(ƒ.ComponentCamera, (_serialization: Serialization): Serialization => {
    if (_serialization.pivot != undefined && _serialization.mtxPivot == undefined)
      _serialization.mtxPivot = _serialization.pivot;

    if (_serialization.backgroundColor != undefined && _serialization.clrBackground == undefined)
      _serialization.clrBackground = _serialization.backgroundColor;

    delete _serialization.pivot;
    delete _serialization.backgroundColor;
    return _serialization;
  });

  register(ƒ.ComponentLight, (_serialization: Serialization): Serialization => {
    if (_serialization.pivot != undefined && _serialization.mtxPivot == undefined)
      _serialization.mtxPivot = _serialization.pivot;

    const light: Serialization = _serialization.light;
    if (light != undefined) {
      for (const path in light) {
        const lightSerialization: Serialization = light[path];
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

  register(ƒ.ComponentMaterial, (_serialization: Serialization): Serialization => {
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

  register(ƒ.ComponentTransform, (_serialization: Serialization): Serialization => {
    if (_serialization.local != undefined && _serialization.mtxLocal == undefined)
      _serialization.mtxLocal = _serialization.local;

    delete _serialization.local;
    return _serialization;
  });

  register(ƒ.ComponentRigidbody, (_serialization: Serialization): Serialization => {
    if (_serialization.pivot != undefined && _serialization.mtxPivot == undefined)
      _serialization.mtxPivot = _serialization.pivot;

    delete _serialization.pivot;

    if (typeof _serialization.initialization == "string")
      _serialization.initialization = <number>(<General>ƒ.BODY_INIT)[_serialization.initialization];

    if (typeof _serialization.typeBody == "string")
      _serialization.typeBody = <number>(<General>ƒ.BODY_TYPE)[_serialization.typeBody];

    if (typeof _serialization.typeCollider == "string")
      _serialization.typeCollider = <number>(<General>ƒ.COLLIDER_TYPE)[_serialization.typeCollider];
    return _serialization;
  });

  register(ƒ.Animation, (_serialization: Serialization): Serialization => {
    if (_serialization.framesPerSecond != undefined && _serialization.fps == undefined)
      _serialization.fps = _serialization.framesPerSecond;

    delete _serialization.framesPerSecond;
    return _serialization;
  });

  register(ƒ.AnimationSprite, (_serialization: Serialization): Serialization => {
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


  register(ƒ.CoatTextured, (_serialization: Serialization): Serialization => {
    if (_serialization.idTexture != undefined && _serialization.texture == undefined)
      _serialization.texture = _serialization.idTexture;

    delete _serialization.idTexture;
    return _serialization;
  });

  register(ƒ.CoatRemissiveTexturedNormals, (_serialization: Serialization): Serialization => {
    if (_serialization.idNormalMap != undefined && _serialization.normalMap == undefined)
      _serialization.normalMap = _serialization.idNormalMap;

    delete _serialization.idNormalMap;
    return _serialization;
  });

  function migrateCoatToon(_serialization: Serialization): Serialization {
    if (_serialization.idTexToon != undefined && _serialization.texToon == undefined)
      _serialization.texToon = _serialization.idTexToon;

    delete _serialization.idTexToon;
    return _serialization;
  }

  register(ƒ.CoatToon, migrateCoatToon);

  register(ƒ.CoatToonTextured, migrateCoatToon);

  register(ƒ.Material, (_serialization: Serialization): Serialization => {
    const coat: Serialization = _serialization.coat;
    if (coat != undefined) {
      const keys: string[] = Object.keys(coat);
      const type: string = keys[0];
      if (keys.length == 1 && type.startsWith("ƒ.")) {
        _serialization.coat = coat[type];
        _serialization.coat["@type"] = type;
      }
    }

    return _serialization;
  });

  register(ƒ.MeshRelief, (_serialization: Serialization): Serialization => {
    if (_serialization.idTexture != undefined && _serialization.texture == undefined)
      _serialization.texture = _serialization.idTexture;

    delete _serialization.idTexture;
    return _serialization;
  });

  register(ƒ.Texture, (_serialization: Serialization): Serialization => {
    if (_serialization.Texture != undefined) {
      for (const key in _serialization.Texture)
        _serialization[key] = _serialization.Texture[key];

      delete _serialization.Texture;
    }

    if (typeof _serialization.mipmap == "string")
      _serialization.mipmap = <number><unknown>ƒ.MIPMAP[<General>_serialization.mipmap];

    if (typeof _serialization.wrap == "string")
      _serialization.wrap = <number><unknown>ƒ.WRAP[<General>_serialization.wrap];

    return _serialization;
  });

  register(ƒ.TextureImage, function (this: ƒ.Serializable, _serialization: Serialization): Serialization {
    if (_serialization.Texture != undefined) 
      ƒ.Project.register(<ƒ.SerializableResource>this, _serialization.Texture.idResource);

    return _serialization;
  });

  register(ƒ.TextureText, function (this: ƒ.Serializable, _serialization: Serialization): Serialization {
    if (_serialization.Texture != undefined) 
      ƒ.Project.register(<ƒ.SerializableResource>this, _serialization.Texture.idResource);

    return _serialization;
  });
}

namespace FudgeCore {
  /**
   * @deprecated Use ComponentAnimation instead of ComponentAnimator. Exists only for backwards compatibility. Will be removed in future versions.
   */
  @((_value: Function) => ComponentAnimation) // a decorator that replaces the class/constructor with the new one
  export class ComponentAnimator extends ComponentAnimation {

  }
}
