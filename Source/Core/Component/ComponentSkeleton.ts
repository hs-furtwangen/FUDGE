///<reference path="../Render/RenderWebGLComponentSkeleton.ts"/>
namespace FudgeCore {

  /**
   * Holds an array of bones ({@link Node}s within a {@link Graph}). Referenced from a {@link ComponentMesh} it can be associated with a {@link Mesh} and enable skinning for the mesh.
   * @authors Matthias Roming, HFU, 2022-2023 | Jonas Plotzky, HFU, 2023-2025
   */
  @RenderWebGLComponentSkeleton.decorate
  export class ComponentSkeleton extends Component {
    /** The bones used for skinning */
    public bones: Node[];
    /** When applied to vertices, it moves them from object/model space to bone-local space as if the bone were at its initial pose */
    public mtxBindInverses: Matrix4x4[]; // TODO: think about serializing this separately to make it shareable between skeleton serializations

    protected singleton: boolean = false;
    
    // TODO: this pattern of having class properties that are only used by the render system is not ideal as it mixes the concerns of the component and the render system. This undermines the whole point of the render injector being replaceable for different render systems (e.g. WebGL, WebGPU, etc.). 
    // Consider refactoring this to a more modular approach where the render system can handle its own state without relying on the component to provide it. Could use symbol keyed properties or weak maps to store render-specific data without cluttering the component class.
    protected renderBuffer: unknown;
    /** Contains the bone transformations applicable to the vertices of a {@link Mesh} */
    protected mtxBones: Matrix4x4[];
    protected mtxBonesData: Float32Array;
    protected bonesDirty: boolean = true;

    public constructor(_bones: Node[] = [], _mtxBoneInverses: Matrix4x4[] = []) {
      super();
      this.bones = _bones;
      this.mtxBindInverses = _mtxBoneInverses;

      for (let i: number = 0; i < this.bones.length; i++) {
        if (this.mtxBindInverses[i] == null)
          this.mtxBindInverses[i] = this.bones[i].mtxWorldInverse.clone;
      }
    }

    /** @internal Injected by {@link RenderWebGLComponentSkeleton}. */
    public useRenderBuffer(): void { /**/ };

    /** @internal Injected by {@link RenderWebGLComponentSkeleton}. */
    public updateRenderBuffer(): void { /**/ }

    /** @internal Injected by {@link RenderWebGLComponentSkeleton}. */
    public deleteRenderBuffer(): void { /**/ }

    /**
     * Adds a node as a bone with its bind inverse matrix
     */
    public addBone(_bone: Node, _mtxBindInverse: Matrix4x4 = _bone.mtxWorldInverse.clone): void {
      this.bones.push(_bone);
      this.mtxBindInverses.push(_mtxBindInverse);

      this.bonesDirty = true;
    }

    /**
     * Return the index of the first bone in the bones array which has the given name, and -1 otherwise.
     */
    public indexOf(_name: string): number;
    /**
     * Return the index of the first occurrence of the given bone node in the bone array, or -1 if it is not present.
     */
    public indexOf(_node: Node): number;
    public indexOf(_name: string | Node): number {
      if (typeof (_name) == "string")
        return this.bones.findIndex((_bone: Node) => _bone.name == _name);
      else
        return this.bones.indexOf(_name);
    }

    /**
     * Resets the pose of this skeleton to the default pose
     */
    public resetPose(): void { // TODO: test this
      for (let i: number = 0; i < this.bones.length; i++)
        this.bones[i].mtxLocal.copy(Matrix4x4.INVERSE(this.mtxBindInverses[i]));
    }

    public serialize(): Serialization {
      const serialization: Serialization = {};
      serialization[super.constructor.name] = super.serialize();
      serialization.bones = this.bones.map(_bone => Node.PATH_FROM_TO(this, _bone));
      serialization.mtxBindInverses = Serializer.serializeArray(this.mtxBindInverses, Matrix4x4);
      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<ComponentSkeleton> {
      await super.deserialize(_serialization[super.constructor.name]);

      const hndNodeDeserialized: EventListenerUnified = () => {
        this.bones = _serialization.bones.map((_path: string) => {
          let bone: Node = Node.FIND(this, _path);
          if (!bone)
            throw new Error(`${Node.name} "${this.node.name}" ${ComponentSkeleton.name}: Could not find bone ${_path}`);
          return bone;
        });
        this.removeEventListener(EVENT.NODE_DESERIALIZED, hndNodeDeserialized);
      };
      this.addEventListener(EVENT.NODE_DESERIALIZED, hndNodeDeserialized);

      this.mtxBindInverses = await Serializer.deserializeArray(_serialization.mtxBindInverses, Matrix4x4);
      return this;
    }
  }

}