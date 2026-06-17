namespace FudgeCore {

  interface Settings {
    [key: string]: General;
  }

  export abstract class ProjectSettings extends EventTargetStatic {
    static #settings: Settings;

    static {
      this.#settings = new Proxy({}, {
        set(_target: Settings, _key: string, _value: unknown): boolean {
          const value: General = _target[_key];
          _target[_key] = _value;
          if (value !== _value) 
            RecyclableEvent.dispatchTo(ProjectSettings, EVENT.SETTINGS_CHANGED);
          
          return true;
        }
      });
      
      Metadata.defineMetadata(this.#settings);
    }

    public static define(_key: string, _value: General, _type: Function | Record<string, unknown>): void {
      if (_key in this.#settings)
        throw new Error(`The project setting "${_key}" is already defined.`);

      Metadata.defineEditProperty(getMetadata(this.#settings), _key, _type);
      this.#settings[_key] = _value;
    }

    public static set(_key: string, _value: General): void {
      this.#settings[_key] = _value;
    }

    public static get<T extends General>(_key: string): T {
      return this.#settings[_key] as T;
    }

    public static has(_key: string): boolean {
      return _key in this.#settings;
    }

    public static getSettings(): Readonly<Settings> {
      return this.#settings;
    }
  }

  export enum SHADOW_FILTER_QUALITY {
    OFF = "off",
    MIN = "min",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    MAX = "max"
  }

  // default settings
  ProjectSettings.define("rendering/lightsAndShadows/shadowSize", 1024, Number);
  ProjectSettings.define("rendering/lightsAndShadows/shadowFilterQuality", SHADOW_FILTER_QUALITY.LOW, SHADOW_FILTER_QUALITY);
}