namespace FudgeCore {
  export namespace AnimationSystem {
    Serializer.registerNamespace(AnimationSystem);

    /**
     * Represents an animation consisting of multiple tracks. Each track targets a specific property within a node hierarchy and contains keyframes that define the animation's behavior over time.
     */
    @SerializableResource.register
    export class Animation extends Mutable implements SerializableResource {
      public idResource: string;
      public name: string;
      public duration: number;
      public tracks: AnimationTrack[];

      public constructor(_name: string = Animation.name, _duration: number = -1, _tracks: AnimationTrack[] = []) {
        super();
        this.name = _name;
        this.duration = _duration;
        this.tracks = _tracks;
        Project.register(this);
      }

      public serialize(): Serialization {
        throw new Error("Method not implemented.");
      }

      public deserialize(_serialization: Serialization): Promise<Serializable> {
        throw new Error("Method not implemented.");
      }

      protected reduceMutator(_mutator: Mutator): void {
        throw new Error("Method not implemented.");
      }
    }
  }
}
