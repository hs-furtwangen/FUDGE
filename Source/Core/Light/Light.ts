namespace FudgeCore {
  export type TypeOfLight = new () => Light;
  /**
   * Baseclass for different kinds of lights. 
   * @authors Jirka Dell'Oro-Friedl, HFU, 2019
   */
  export abstract class Light extends Mutable implements Serializable {
    public color: Color;
    public intensity: number;

    public constructor(_color: Color = new Color(1, 1, 1, 1), _intensity: number = 1) {
      super();
      this.color = _color;
      this.intensity = _intensity;
    }

    /**
     * Returns the {@link TypeOfLight} of this light.
     */
    public getType(): TypeOfLight {
      return <TypeOfLight>this.constructor;
    }

    public serialize(): Serialization {
      let serialization: Serialization = {
        color: this.color.serialize(),
        intensity: this.intensity
      };
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await this.color.deserialize(_serialization.color);
      if (_serialization.intensity != undefined)
        this.intensity = _serialization.intensity;
      return this;
    }

    protected reduceMutator(): void {/**/ }
  }

  /**
   * Ambient light, coming from all directions, illuminating everything with its color independent of position and orientation (like a foggy day or in the shades)  
   * Attached to a node by {@link ComponentLight}, the pivot matrix is ignored.
   * ```text
   * ~ ~ ~  
   *  ~ ~ ~  
   * ```
   */
  export class LightAmbient extends Light {
  }
  /**
   * Directional light, illuminating everything from a specified direction with its color (like standing in bright sunlight)  
   * Attached to a node by {@link ComponentLight}, the pivot matrix specifies the direction of the light only.
   * ```text
   * --->  
   * --->  
   * --->  
   * ```
   */
  export class LightDirectional extends Light {
  }
  /**
   * Omnidirectional light emitting from its position, illuminating objects depending on their position and distance with its color (like a colored light bulb)  
   * Attached to a node by {@link ComponentLight}, the pivot matrix specifies the position of the light, it's shape and rotation. 
   * So with uneven scaling, other shapes than a perfect sphere, such as an oval or a disc, are possible, which creates a visible effect of the rotation too. 
   * The intensity of the light drops linearly from 1 in the center to 0 at the perimeter of the shape.
   * ```text
   *         .\|/.
   *        -- o --
   *         ´/|\`
   * ```
   */
  export class LightPoint extends Light {
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
  export class LightSpot extends Light {
  }
}