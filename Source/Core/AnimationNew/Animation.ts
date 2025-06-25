namespace FudgeCore {
  export namespace AnimationSystem {
    Serializer.registerNamespace(AnimationSystem);
 
    /**
     * A track of events trigerred at specific times during an animation.
     */
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

      public get isSerializableResource(): true {
        return true;
      }

      public serialize(): SerializationOf<Animation> {
        const serialization: SerializationOf<Animation> = {
          idResource: this.idResource,
          name: this.name,
          duration: this.duration,
          eventTrack: {
            times: this.eventTrack.times,
            events: this.eventTrack.events
          }
        };

        const channelType: new () => Serializable = <new () => Serializable>this.channels[0]?.constructor;
        if (channelType)
          serialization.channels = Serializer.serializeArray(channelType, this.channels);

        return serialization;
      }

      public async deserialize(_serialization: Serialization): Promise<Animation> {
        this.idResource = _serialization.idResource;
        this.name = _serialization.name;
        this.duration = _serialization.duration;
        this.channels = await Serializer.deserializeArray(_serialization.channels);
        this.eventTrack.times = _serialization.eventTrack.times;
        this.eventTrack.events = _serialization.eventTrack.events;

        return this;
      }

      protected reduceMutator(_mutator: Mutator): void {
        throw new Error("Method not implemented.");
      }
    }
  }
}
