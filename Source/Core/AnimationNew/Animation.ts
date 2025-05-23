namespace FudgeCore {
  export namespace AnimationSystem {
    Serializer.registerNamespace(AnimationSystem);

    export class AnimationEventTrack {
      public times: number[];
      public events: string[][];

      public constructor(_times: number[] = [], _events: string[][] = []) {
        this.times = _times;
        this.events = _events;
      }
    }

    /**
     * Represents an animation consisting of multiple channels. Each channel targets a specific property within a node hierarchy and contains keyframes that define the animation's behavior over time.
     */
    @SerializableResource.register
    export class Animation extends Mutable implements SerializableResource {
      public idResource: string;
      public name: string;
      public duration: number;
      public channels: AnimationChannel[];
      public eventTrack: AnimationEventTrack;

      public constructor(_name: string = Animation.name, _duration: number = -1, _channels: AnimationChannel[] = [], _eventTrack: AnimationEventTrack = new AnimationEventTrack()) {
        super();
        this.name = _name;
        this.duration = _duration;
        this.channels = _channels;
        this.eventTrack = _eventTrack;
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
