namespace FudgeCore {

  export class Settings extends EventTarget implements Serializable {
    #mutable: Record<string, General>;

    public constructor() {
      super();
      this.#mutable = new Proxy({}, {
        set: this.#setDataProperty
      });

      Metadata.defineMetadata(this.#mutable);
    }

    /**
     * Define a new setting.
     */
    public define(_key: string, _value: General, _type: Function | Record<string, unknown>, _options?: { clearable?: boolean }): void {
      if (_key in this.#mutable)
        throw new Error(`The project setting "${_key}" is already defined.`);

      const metadata: Metadata = getMetadata(this.#mutable);

      Metadata.definePropertyEditable(metadata, _key, _type);

      if (_options?.clearable)
        Metadata.definePropertyClearable(metadata, _key);

      this.#mutable[_key] = _value;
    }

    /**
     * Set an existing setting to the given value.
     */
    public set(_key: string, _value: General): void {
      if (!this.has(_key))
        throw new Error(`The project setting "${_key}" does not exist.`);

      this.#mutable[_key] = _value;
    }

    /**
     * Get the value of the given setting.
     */
    public get<T extends General>(_key: string): T {
      return this.#mutable[_key] as T;
    }

    /**
     * Returns a boolean indicating whether the specified setting exists or not.
     */
    public has(_key: string): boolean {
      return _key in this.#mutable;
    }

    /**
     * Returns the internal map-like object. Used by the editor.
     * Use {@link define}, {@link set}, {@link get}, and {@link has}
     * to access and modify settings safely.
     */
    public getMutable(): Record<string, General> {
      return this.#mutable;
    }

    /**
     * Loads the settings from the given url.
     */
    public async load(_url: RequestInfo): Promise<Settings> {
      const response: Response = await fetch(_url);
      const content: string = await response.text();
      const serialization: Serialization = Serializer.parse(content);

      return <Promise<Settings>>this.deserialize(serialization);
    }

    public serialize(): Serialization {
      return serializeDecorations(this.#mutable);
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await deserializeDecorations(this.#mutable, _serialization);
      return this;
    }

    #setDataProperty = (_target: Record<string, General>, _key: string, _value: unknown): boolean => {
      const value: General = _target[_key];
      _target[_key] = _value;
      if (value !== _value)
        RecyclableEvent.dispatchTo(this, EVENT.SETTINGS_CHANGED);

      return true;
    };
  }

  // eslint-disable-next-line
  export const ProjectSettings: Settings = new Settings();

  export enum SHADOW_FILTER_QUALITY {
    OFF = "off",
    MIN = "min",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    MAX = "max"
  }

  // default settings
  ProjectSettings.define("rendering/lightsAndShadows/shadowSize", 2048, Number);
  ProjectSettings.define("rendering/lightsAndShadows/shadowFilterQuality", SHADOW_FILTER_QUALITY.LOW, SHADOW_FILTER_QUALITY);
}