namespace FudgeCore {
  export type TypeOfLight = new () => Light;
  /**
   * Baseclass for different kinds of lights. 
   * @authors Jirka Dell'Oro-Friedl, HFU, 2019
   */
  export abstract class Light extends Mutable implements Serializable {

    /** List of all the subclasses derived from this class, if they registered properly. */
    public static readonly subclasses: typeof Light[] = [];

    /** 
     * The color of the light. 
     */
    @edit(Color)
    public color: Color;

    /** 
     * The brightness of the light. The light {@link color} is multiplied by this value. 
     */
    @edit(Number)
    public intensity: number;

    public constructor(_color: Color = new Color(1, 1, 1, 1), _intensity: number = 1) {
      super();
      this.color = _color;
      this.intensity = _intensity;
    }

    protected static registerSubclass(_subClass: typeof Light): number { return this.subclasses.push(_subClass) - 1; }

    /**
     * Returns the {@link TypeOfLight} of this light.
     */
    public getType(): TypeOfLight {
      return <TypeOfLight>this.constructor;
    }

    public serialize(): Serialization {
      return serializeDecorations(this);
    }
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      return deserializeDecorations(this, _serialization);
    }
  }

  export class LightShadowCasting extends Light {

    /** 
     * Enable real-time shadows for the {@link Light}. 
     */
    @edit(Boolean)
    public shadowEnabled: boolean;

    /** 
     * Used to adjust shadow appearance. 
     * Too small a value results in self-shadowing ("shadow acne"), while too large a value causes shadows to separate from casters ("peter-panning"). 
     */
    @edit(Number)
    public shadowBias: number;

    /** 
     * Offsets the lookup into the shadow map by the object's normal. 
     * This can be used to reduce self-shadowing artifacts without using {@link bias}. 
     */
    @edit(Number)
    public shadowNormalBias: number;

    /** 
     * Blurs the edges of the shadow. Can be used to hide pixel artifacts in low-resolution shadow maps. 
     * A high value can impact performance, make shadows appear grainy and can cause other unwanted artifacts. 
    */
    @edit(Number)
    public shadowBlur: number;

    public constructor(_color: Color = new Color(1, 1, 1, 1), _intensity: number = 1, _shadowEnabled: boolean = false, _shadowBias: number = 0.1, _shadowNormalBias: number = 2, _shadowBlur: number = 1) {
      super(_color, _intensity);
      this.shadowEnabled = _shadowEnabled;
      this.shadowBias = _shadowBias;
      this.shadowNormalBias = _shadowNormalBias;
      this.shadowBlur = _shadowBlur;
    }
  }

  /**
   * Ambient light, coming from all directions, illuminating everything with its color independent of position and orientation (like a foggy day or in the shades).
   * Attached to a node by {@link ComponentLight}, the pivot matrix is ignored.
   * ```text
   * ~ ~ ~  
   *  ~ ~ ~  
   * ```
   */
  export class LightAmbient extends Light {
    public static readonly iSubclass: number = this.registerSubclass(this);
  }

  /**
   * Directional light, illuminating everything from a specified direction with its color (like standing in bright sunlight).
   * Attached to a node by {@link ComponentLight}, the pivot matrix specifies the direction of the light only.
   * ```text
   * --->  
   * --->  
   * --->  
   * ```
   */
  export class LightDirectional extends LightShadowCasting {
    public static readonly iSubclass: number = this.registerSubclass(this);

    /**
     * Maximum distance from the camera at which directional shadows are displayed. 
     * Increasing this value will make shadows visible from further away, at the cost of lower overall shadow detail and performance.
     */
    @edit(Number)
    public shadowMaxDistance: number;

    /**
     * Distance from the camera at which the shadow starts to fade linearly. At {@link shadowMaxDistance}, the shadow will disappear. 
     * Set to 1.0 to prevent the shadow from fading in the distance (it will suddenly cut off instead).
     */
    @edit(Number)
    public shadowFadeDistance: number;

    /**
     * Pulls back the light-space near plane, increasing the depth range covered by the shadow map.
     * Use this to reduce artifacts induced by shadow pancaking.
     *
     * During shadow map rendering, any shadow-caster vertex that would go beyond the light frustum near plane is not clipped away.
     * Instead, its depth is clamped to the near plane, so part of the geometry gets squashed flat onto that plane (like a pancake).
     * This avoids losing shadow casters beyond the near boundary while allowing a tighter light-space depth range, increasing depth precision and reducing shadow acne.
     *
     * However, pancaking can introduce artifacts when large triangles intersect the near plane, since they are incorrectly deformed, which may result in visible shadow errors.
     *
     * Keep this value as low as possible to avoid shadow acne, but high enough to prevent pancaking artifacts.
     */
    @edit(Number)
    public shadowPancakeOffset: number;

    public constructor(_color: Color = new Color(1, 1, 1, 1), _intensity: number = 1, _shadowEnabled: boolean = false, _shadowBias: number = 0.1, _shadowNormalBias: number = 2, _shadowBlur: number = 1, _shadowMaxDistance: number = 50, _shadowFadeDistance: number = 45, _shadowPancakeOffset: number = 10) {
      super(_color, _intensity, _shadowEnabled, _shadowBias, _shadowNormalBias, _shadowBlur);
      this.shadowMaxDistance = _shadowMaxDistance;
      this.shadowFadeDistance = _shadowFadeDistance;
      this.shadowPancakeOffset = _shadowPancakeOffset;
    }
  }

  /**
   * Omnidirectional light emitting from its position, illuminating objects depending on their position and distance with its color (like a colored light bulb).
   * Attached to a node by {@link ComponentLight}, the pivot matrix specifies the position of the light, it's shape and rotation. 
   * So with uneven scaling, other shapes than a perfect sphere, such as an oval or a disc, are possible, which creates a visible effect of the rotation too. 
   * The intensity of the light drops linearly from 1 in the center to 0 at the perimeter of the shape.
   * ```text
   *         .\|/.
   *        -- o --
   *         ´/|\`
   * ```
   */
  export class LightPoint extends LightShadowCasting {
    public static readonly iSubclass: number = this.registerSubclass(this);
  }

  /**
   * Spot light emitting within a specified angle from its position, illuminating objects depending on their position and distance with its color  
   * Attached to a node by {@link ComponentLight}, the pivot matrix specifies the position of the light, the direction and the size and angles of the cone.
   * The intensity of the light drops linearly from 1 in the center to 0 at the outer limits of the cone.
   * ```text
   *          o  
   *         /|\  
   *        / | \ 
   * ```   
   */
  export class LightSpot extends LightShadowCasting {
    public static readonly iSubclass: number = this.registerSubclass(this);
  }
}