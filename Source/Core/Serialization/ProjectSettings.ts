namespace FudgeCore {

  export enum SHADOW_FILTER_QUALITY {
    OFF = "off",
    MIN = "min",
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    MAX = "max"
  }

  // default settings
  ProjectSettings.define("application/name", "", String);
  ProjectSettings.define("application/mainGraph", null, Graph);

  ProjectSettings.define("rendering/lightsAndShadows/shadowSize", 2048, Number);
  ProjectSettings.define("rendering/lightsAndShadows/shadowFilterQuality", SHADOW_FILTER_QUALITY.LOW, SHADOW_FILTER_QUALITY);
}