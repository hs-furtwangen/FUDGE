///<reference path="MeshTerrain.ts"/>
namespace FudgeCore {
  /**
   * Generates a planar Grid and applies a Heightmap-Function to it.
   * @authors Jirka Dell'Oro-Friedl, HFU, 2021 | Moritz Beaugrand, HFU, 2020
   */
  export class MeshRelief extends MeshTerrain {
    public static readonly iSubclass: number = Mesh.registerSubclass(MeshRelief);

    #texture: TextureImage;

    public constructor(_name: string = "MeshRelief", _texture?: TextureImage) {
      super(_name, Vector2.ONE(2), undefined, (_x: number, _z: number) => 0);
      this.texture = _texture;
    }

    private static createHeightMapFunction(_texture: TextureImage): HeightMapFunction {
      let array: Uint8ClampedArray = MeshRelief.textureToClampedArray(_texture);
      let heightMapFunction: HeightMapFunction = (_x: number, _z: number) => {
        let pixel: number = Math.round(_z * _texture.image.width + _x);
        return array[pixel * 4] / 255;
      };
      return heightMapFunction;
    }

    private static textureToClampedArray(_texture: TextureImage): Uint8ClampedArray {
      let canvas: HTMLCanvasElement = document.createElement("canvas");
      canvas.width = _texture.image.width;
      canvas.height = _texture.image.height;

      let crc: CanvasRenderingContext2D = canvas.getContext("2d");
      crc.imageSmoothingEnabled = false;
      crc.drawImage(_texture.image, 0, 0);

      return crc.getImageData(0, 0, _texture.image.width, _texture.image.height).data;
    }

    /** 
     * The texture to be used as the heightmap.
     * **Caution!** Setting this causes the mesh to be recreated which can be an expensive operation.
     */
    @editReference(TextureImage)
    public get texture(): TextureImage {
      return this.#texture;
    }

    public set texture(_texture: TextureImage) {
      this.#texture = _texture;
      if (!_texture)
        return;
      let resolution: Vector2 = _texture ? new Vector2(_texture.image.width - 1, _texture.image.height - 1) : undefined;
      super.create(resolution, resolution, MeshRelief.createHeightMapFunction(_texture));
    }

    public serialize(): Serialization {
      let serialization: Serialization = super.serialize();
      delete serialization.seed;
      delete serialization.scale;
      delete serialization.resolution;
      return serialization;
    }

    // TODO: Backward compatibility, remove in future version
    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization);

      if (_serialization.idTexture)
        this.texture = <TextureImage>await Project.getResource(_serialization.idTexture);

      return this;
    }

    public async mutate(_mutator: Mutator): Promise<void> {
      return <Promise<void>><unknown>Mutator.mutateDecorations(this, _mutator);
    }

    public getMutator(_extendable?: boolean): Mutator {
      let mutator: Mutator = super.getMutator(_extendable);
      delete mutator.seed;
      delete mutator.scale;
      delete mutator.resolution;
      return mutator;
    }
  }
}