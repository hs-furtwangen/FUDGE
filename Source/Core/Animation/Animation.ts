namespace FudgeCore {
  /**
   * Holds information about the AnimationStructure that the Animation uses to map the Sequences to the Attributes.
   * Built out of a {@link Node}'s serialsation, it swaps the values with {@link AnimationSequence}s.
   */
  export interface AnimationStructure {
    [attribute: string]: AnimationStructure[] | AnimationStructure | AnimationSequence;
  }

  /**
  * An associative array mapping names of lables to timestamps.
  * Labels need to be unique per Animation.
  * @author Lukas Scheuerle, HFU, 2019
  */
  export interface AnimationLabel {
    [name: string]: number;
  }

  /**
  * Holds information about Animation Event Triggers
  * @author Lukas Scheuerle, HFU, 2019
  */
  export interface AnimationEventTrigger {
    [name: string]: number;
  }

  /**
   * Internally used to differentiate between the various generated structures and events.
   * @author Lukas Scheuerle, HFU, 2019
   */
  enum ANIMATION_STRUCTURE_TYPE {
    /**Default: forward, continous */
    NORMAL,
    /**backward, continous */
    REVERSE,
    /**forward, rastered */
    RASTERED,
    /**backward, rastered */
    RASTEREDREVERSE
  }

  /**
   * Holds different playmodes the animation uses to play back its animation.
   * @author Lukas Scheuerle, HFU, 2019
   */
  export enum ANIMATION_PLAYMODE {
    /**Plays animation in a loop: it restarts once it hit the end.*/
    LOOP = "loop",
    /**Plays animation once and stops at the last key/frame*/
    PLAY_ONCE = "playOnce",
    /**Plays animation once and stops on the first key/frame */
    PLAY_ONCE_RESET = "playOnceReset",
    /**Plays animation like LOOP, but backwards.*/
    REVERSE_LOOP = "reverseLoop",
    /**Causes the animation not to play at all. Useful for jumping to various positions in the animation without proceeding in the animation.*/
    STOP = "stop"
    //TODO: add an INHERIT and a PINGPONG mode
  }

  export enum ANIMATION_QUANTIZATION {
    //TODO: add an in-depth description of what happens to the animation (and events) depending on the quantization. Use Graphs to explain.
    /**Calculates the state of the animation at the exact position of time. Ignores FPS value of animation.*/
    CONTINOUS = "continous",
    /**Limits the calculation of the state of the animation to the FPS value of the animation. Skips frames if needed.*/
    DISCRETE = "discrete",
    /** Advances the time each frame according to the FPS value of the animation, ignoring the actual duration of the frames. Doesn't skip any frames.*/
    FRAMES = "frames"
  }

  /**
   * Describes and controls and animation by yielding mutators 
   * according to the stored {@link AnimationStructure} and {@link AnimationSequence}s
   * Applied to a {@link Node} directly via script or {@link ComponentAnimation}.
   * @authors Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2021-2023 | Jonas Plotzky, HFU, 2025
   */
  export class Animation extends Mutable implements SerializableResource {
    // /** refers back to this class from any subclass e.g. in order to find compatible other resources*/
    // public static readonly baseClass: typeof Animation = Animation;
    // /** list of all the subclasses derived from this class, if they registered properly*/
    public static readonly subclasses: typeof Animation[] = [];
    public static readonly iSubclass: number = Animation.registerSubclass(Animation);
    public idResource: string = undefined;
    public name: string;
    public totalTime: number = 0; // Why isn't this called duration or length?
    public labels: AnimationLabel = {}; // a label marks a specific time to conveniently jump to using a text identifier
    public animationStructure: AnimationStructure; // TODO: if set the cache needs to be adjusted (animationStructuresProcessed)
    public events: AnimationEventTrigger = {};
    protected framesPerSecond: number = 60; // TODO: change this and its accessors to #framesPerSecond?

    // processed eventlist and animation strucutres for playback.
    private eventsProcessed: Map<ANIMATION_STRUCTURE_TYPE, AnimationEventTrigger> = new Map<ANIMATION_STRUCTURE_TYPE, AnimationEventTrigger>();
    #animationStructuresProcessed: Map<ANIMATION_STRUCTURE_TYPE, AnimationStructure> = new Map<ANIMATION_STRUCTURE_TYPE, AnimationStructure>();

    public constructor(_name: string = Animation.name, _animStructure: AnimationStructure = {}, _fps: number = 60) {
      super();
      this.name = _name;
      this.animationStructure = _animStructure;
      this.#animationStructuresProcessed.set(ANIMATION_STRUCTURE_TYPE.NORMAL, _animStructure);
      this.framesPerSecond = _fps;
      this.calculateTotalTime();
      Project.register(this);
    }

    /** 
     * Override the given base mutator with the given override mutator using linear interpolation between the values with the given weight.
     * Set the intersect flag to only include properties in the result that exist in both of the given mutators.
     */
    public static blendOverride(_base: Mutator, _override: Mutator, _weight: number, _intersect: boolean = false): Mutator {
      return Animation.blendRecursive(_base, _override, 1 - _weight, _weight, _intersect);
    }

    /**
     * Add the given additive mutator to the given base mutator. The values of the additive mutator will be multiplied by the given weight.
     */
    public static blendAdditive(_base: Mutator, _add: Mutator, _weight: number): Mutator {
      return Animation.blendRecursive(_base, _add, 1, _weight);
    }

    /**
     * Blend the two given mutators together, using the given weights to determine the influence of each. 
     * The resulting mutator will contain all properties of the base mutator, with the properties of the blend mutator blended in.
     * Blend mutator properties that don't exist in the base mutator will be added to the result mutator.
     * Set the intersect flag to only include properties in the result that exist in both of the given mutators.
     */
    public static blendRecursive(_base: Mutator, _blend: Mutator, _weightBase: number, _weightBlend: number, _intersect: boolean = false): Mutator {
      let mutator: Mutator = _intersect ? {} : { ..._base };

      for (const key in _blend) {
        if (_intersect && _base[key] == undefined)
          continue;

        if (typeof _blend[key] == "number") {
          mutator[key] = (_base[key] ?? 0) * _weightBase + _blend[key] * _weightBlend;
          continue;
        }

        if (typeof _base[key] == "object") {
          let base: Mutator = _base[key];
          let blend: Mutator = _blend[key];
          if (base.x != undefined && base.y != undefined && base.z != undefined && base.w != undefined && Quaternion.DOT(<Quaternion>base, <Quaternion>blend) < 0)
            Quaternion.negate(<Quaternion>base); // TODO: eliminate this side effect
          mutator[key] = this.blendRecursive(base, blend, _weightBase, _weightBlend, _intersect);
          continue;
        }

        if (typeof _blend[key] === "object") {
          mutator[key] = this.blendRecursive({}, _blend[key], _weightBase, _weightBlend, _intersect);
          continue;
        }
      }

      return mutator;
    }

    protected static registerSubclass(_subClass: typeof Animation): number { return Animation.subclasses.push(_subClass) - 1; }

    public get isSerializableResource(): true {
      return true;
    }

    public get getLabels(): Enumerator {
      //TODO: this actually needs testing
      let en: Enumerator = new Enumerator(this.labels);
      return en;
    }

    public get fps(): number {
      return this.framesPerSecond;
    }

    public set fps(_fps: number) {
      this.framesPerSecond = _fps;
      this.eventsProcessed.clear();
      this.clearCache();
    }

    /**
     * Clear this animations cache.
     */
    public clearCache(): void {
      this.#animationStructuresProcessed.clear();
    }

    /**
     * Generates and returns a {@link Mutator} with the information to apply to the {@link Node} to animate
     * in the state the animation is in at the given time, direction and quantization
     */
    public getState(_time: number, _direction: number, _quantization: ANIMATION_QUANTIZATION, _mutatorOut: Mutator = {}): Mutator {
      return this.traverseStructureForMutator(this.getAnimationStructure(_direction, _quantization), _time, _mutatorOut);
    }

    /**
     * Returns a list of the names of the events the {@link ComponentAnimation} needs to fire between _min and _max input values.
     * @param _direction The direction the animation is supposed to run in. >0 == forward, 0 == stop, <0 == backwards
     * @returns a list of strings with the names of the custom events to fire.
     */
    public getEventsToFire(_min: number, _max: number, _quantization: ANIMATION_QUANTIZATION, _direction: number): string[] | null {
      let events: string[] = [];
      let minSection: number = Math.floor(_min / this.totalTime);
      let maxSection: number = Math.floor(_max / this.totalTime);
      _min = _min % this.totalTime;
      _max = _max % this.totalTime;

      while (minSection <= maxSection) {
        let eventTriggers: AnimationEventTrigger = this.getCorrectEventList(_direction, _quantization);
        if (minSection == maxSection) {
          this.addEventsBetween(eventTriggers, _min, _max, events);
        } else {
          this.addEventsBetween(eventTriggers, _min, _max, events);
          _min = 0;
        }
        minSection++;
      }

      return events;
    }

    /**
     * Adds an Event to the List of events.
     * @param _name The name of the event (needs to be unique per Animation).
     * @param _time The timestamp of the event (in milliseconds).
     */
    public setEvent(_name: string, _time: number): void {
      this.events[_name] = _time;
      this.eventsProcessed.clear();
    }

    /**
     * Removes the event with the given name from the list of events.
     * @param _name name of the event to remove.
     */
    public removeEvent(_name: string): void {
      delete this.events[_name];
      this.eventsProcessed.clear();
    }

    /**
     * (Re-)Calculate the total time of the Animation. Calculation-heavy, use only if actually needed.
     */
    public calculateTotalTime(): void {
      this.totalTime = 0;
      this.traverseStructureForTime(this.animationStructure);
      // if (this.totalTime == 0) // animations with one keyframe need a total time != 0 to work
      //   this.totalTime = 1;
    }

    /**
     * Returns the time to use for animation sampling when applying a playmode
     */
    public getModalTime(_time: number, _playmode: ANIMATION_PLAYMODE, _timeStop: number = _time): number {
      switch (_playmode) {
        case ANIMATION_PLAYMODE.STOP:
          // return this.localTime.getOffset();
          return _timeStop;
        case ANIMATION_PLAYMODE.PLAY_ONCE:
          if (_time >= this.totalTime)
            return this.totalTime - 0.01;     //TODO: this might cause some issues
        case ANIMATION_PLAYMODE.PLAY_ONCE_RESET:
          if (_time >= this.totalTime)
            // TODO: return _timeStop instead?
            return this.totalTime + 0.01;     //TODO: this might cause some issues
      }
      return _time;
    }

    /**
     * Calculates and returns the direction the animation should currently be playing in.
     * @param _time the time at which to calculate the direction
     * @returns 1 if forward, 0 if stop, -1 if backwards
     */
    public calculateDirection(_time: number, _playmode: ANIMATION_PLAYMODE): number {
      switch (_playmode) {
        case ANIMATION_PLAYMODE.STOP:
          return 0;
        // case ANIMATION_PLAYMODE.PINGPONG:
        //   if (Math.floor(_time / this.animation.totalTime) % 2 == 0)
        //     return 1;
        //   else
        //     return -1;
        case ANIMATION_PLAYMODE.REVERSE_LOOP:
          return -1;
        case ANIMATION_PLAYMODE.PLAY_ONCE:
        case ANIMATION_PLAYMODE.PLAY_ONCE_RESET:
          if (_time >= this.totalTime) {
            return 0;
          }
        default:
          return 1;
      }
    }

    //#region transfer
    public serialize(): Serialization {
      let s: Serialization = {
        idResource: this.idResource,
        name: this.name,
        labels: {},
        events: {},
        framesPerSecond: this.framesPerSecond
        // sps: this.stepsPerSecond
      };
      for (let name in this.labels) {
        s.labels[name] = this.labels[name];
      }
      for (let name in this.events) {
        s.events[name] = this.events[name];
      }
      s.animationStructure = this.traverseStructureForSerialization(this.animationStructure);
      return s;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      Project.register(this, _serialization.idResource);
      this.name = _serialization.name;
      this.framesPerSecond = _serialization.framesPerSecond;
      // this.stepsPerSecond = _serialization.sps;
      this.labels = {};
      for (let name in _serialization.labels) {
        this.labels[name] = _serialization.labels[name];
      }
      this.events = {};
      for (let name in _serialization.events) {
        this.events[name] = _serialization.events[name];
      }
      this.eventsProcessed = new Map<ANIMATION_STRUCTURE_TYPE, AnimationEventTrigger>();

      this.animationStructure = await this.traverseStructureForDeserialization(_serialization.animationStructure);

      this.#animationStructuresProcessed = new Map<ANIMATION_STRUCTURE_TYPE, AnimationStructure>();

      this.calculateTotalTime();
      return this;
    }

    // public getMutator(): Mutator {
    //   return this.serialize();
    // }

    protected reduceMutator(_mutator: Mutator): void {
      delete _mutator.totalTime;
    }
    /**
     * Traverses an AnimationStructure and returns the Serialization of said Structure.
     * @param _structure The Animation Structure at the current level to transform into the Serialization.
     * @returns the filled Serialization.
     */
    private traverseStructureForSerialization(_structure: Object): Serialization {
      let serialization: Serialization = {};
      for (const property in _structure) {
        let structureOrSequence: Object = (<General>_structure)[property];
        if (structureOrSequence instanceof AnimationSequence)
          serialization[property] = structureOrSequence.serialize();
        else
          serialization[property] = this.traverseStructureForSerialization(structureOrSequence);
      }
      return serialization;
    }
    /**
     * Traverses a Serialization to create a new AnimationStructure.
     * @param _serialization The serialization to transfer into an AnimationStructure
     * @returns the newly created AnimationStructure.
     */
    private async traverseStructureForDeserialization(_serialization: Serialization): Promise<AnimationStructure> {
      let structure: AnimationStructure = {};
      for (let n in _serialization) {
        if (_serialization[n].animationSequence) {
          let animSeq: AnimationSequence = new AnimationSequence([], null);
          structure[n] = <AnimationSequence>(await animSeq.deserialize(_serialization[n]));
        } else {
          structure[n] = await this.traverseStructureForDeserialization(_serialization[n]);
        }
      }
      return structure;
    }
    //#endregion

    /**
     * Finds and returns the list of events to be used with these settings.
     */
    private getCorrectEventList(_direction: number, _quantization: ANIMATION_QUANTIZATION): AnimationEventTrigger {
      if (_quantization != ANIMATION_QUANTIZATION.FRAMES) {
        if (_direction >= 0) {
          return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.NORMAL);
        } else {
          return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.REVERSE);
        }
      } else {
        if (_direction >= 0) {
          return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.RASTERED);
        } else {
          return this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE);
        }
      }
    }

    /**
     * Traverses an {@link AnimationStructure} and returns a {@link Mutator} describing the state at the given time.
     */
    private traverseStructureForMutator(_structure: AnimationStructure, _time: number, _mutatorOut: Mutator = {}): Mutator {
      if (Array.isArray(_structure))
        for (let n: number = 0; n < _structure.length; n++) {
          if (_structure[n] instanceof AnimationSequence)
            _mutatorOut[n] = (<AnimationSequence>_structure[n]).evaluate(_time, _mutatorOut[n]);
          else
            _mutatorOut[n] = this.traverseStructureForMutator(<AnimationStructure>_structure[n], _time, _mutatorOut[n]);
        }
      else
        for (let n in _structure) {
          if (_structure[n] instanceof AnimationSequence)
            _mutatorOut[n] = (<AnimationSequence>_structure[n]).evaluate(_time, _mutatorOut[n]);
          else
            _mutatorOut[n] = this.traverseStructureForMutator(<AnimationStructure>_structure[n], _time, _mutatorOut[n]);
        }

      return _mutatorOut;
    }

    /**
     * Traverses the current AnimationStrcuture to find the totalTime of this animation.
     * @param _structure The structure to traverse
     */
    private traverseStructureForTime(_structure: AnimationStructure): void {
      for (let n in _structure) {
        if (_structure[n] instanceof AnimationSequence) {
          let sequence: AnimationSequence = <AnimationSequence>_structure[n];
          if (sequence.length > 0) {
            let sequenceTime: number = sequence.getKey(sequence.length - 1).time;
            this.totalTime = Math.max(sequenceTime, this.totalTime);
          }
        } else {
          this.traverseStructureForTime(<AnimationStructure>_structure[n]);
        }
      }
    }

    private getAnimationStructure(_direction: number, _quantization: ANIMATION_QUANTIZATION): AnimationStructure {
      let animationStructure: ANIMATION_STRUCTURE_TYPE;

      if (_quantization == ANIMATION_QUANTIZATION.CONTINOUS)
        animationStructure = _direction < 0 ? ANIMATION_STRUCTURE_TYPE.REVERSE : ANIMATION_STRUCTURE_TYPE.NORMAL;
      else
        animationStructure = _direction < 0 ? ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE : ANIMATION_STRUCTURE_TYPE.RASTERED;

      return this.getProcessedAnimationStructure(animationStructure);
    }

    /**
     * Ensures the existance of the requested {@link AnimationStructure} and returns it.
     * @param _type the type of the structure to get
     * @returns the requested [[@link AnimationStructure]]
     */
    private getProcessedAnimationStructure(_type: ANIMATION_STRUCTURE_TYPE): AnimationStructure {
      let processed: AnimationStructure = this.#animationStructuresProcessed.get(_type);
      if (processed)
        return processed;

      this.calculateTotalTime();
      processed = {};
      switch (_type) {
        case ANIMATION_STRUCTURE_TYPE.NORMAL:
          processed = this.animationStructure;
          break;
        case ANIMATION_STRUCTURE_TYPE.REVERSE:
          processed = this.traverseStructureForNewStructure(this.animationStructure, this.calculateReverseSequence.bind(this));
          break;
        case ANIMATION_STRUCTURE_TYPE.RASTERED:
          processed = this.traverseStructureForNewStructure(this.animationStructure, this.calculateRasteredSequence.bind(this));
          break;
        case ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE:
          processed = this.traverseStructureForNewStructure(this.getProcessedAnimationStructure(ANIMATION_STRUCTURE_TYPE.REVERSE), this.calculateRasteredSequence.bind(this));
          break;
        default:
          return undefined;
      }

      this.#animationStructuresProcessed.set(_type, processed);
      return processed;
    }

    /**
     * Ensures the existance of the requested {@link AnimationEventTrigger} and returns it.
     * @param _type The type of AnimationEventTrigger to get
     * @returns the requested {@link AnimationEventTrigger}
     */
    private getProcessedEventTrigger(_type: ANIMATION_STRUCTURE_TYPE): AnimationEventTrigger {
      let processed: AnimationEventTrigger = this.eventsProcessed.get(_type);
      if (processed)
        return processed;

      this.calculateTotalTime();
      processed = {};
      switch (_type) {
        case ANIMATION_STRUCTURE_TYPE.NORMAL:
          processed = this.events;
          break;
        case ANIMATION_STRUCTURE_TYPE.REVERSE:
          processed = this.calculateReverseEventTriggers(this.events);
          break;
        case ANIMATION_STRUCTURE_TYPE.RASTERED:
          processed = this.calculateRasteredEventTriggers(this.events);
          break;
        case ANIMATION_STRUCTURE_TYPE.RASTEREDREVERSE:
          processed = this.calculateRasteredEventTriggers(this.getProcessedEventTrigger(ANIMATION_STRUCTURE_TYPE.REVERSE));
          break;
        default:
          return undefined;
      }

      this.eventsProcessed.set(_type, processed);

      return processed;
    }

    /**
     * Traverses an existing structure to apply a recalculation function to the AnimationStructure to store in a new Structure.
     * @param _oldStructure The old structure to traverse
     * @param _functionToUse The function to use to recalculated the structure.
     * @returns A new Animation Structure with the recalulated Animation Sequences.
     */
    private traverseStructureForNewStructure(_oldStructure: AnimationStructure, _functionToUse: Function): AnimationStructure {
      let newStructure: AnimationStructure = {};
      for (let n in _oldStructure) {
        if (_oldStructure[n] instanceof AnimationSequence) {
          newStructure[n] = _functionToUse(_oldStructure[n]);
        } else {
          newStructure[n] = this.traverseStructureForNewStructure(<AnimationStructure>_oldStructure[n], _functionToUse);
        }
      }
      return newStructure;
    }

    /**
     * Creates a reversed Animation Sequence out of a given Sequence.
     * @param _sequence The sequence to calculate the new sequence out of
     * @returns The reversed Sequence
     */
    private calculateReverseSequence(_sequence: AnimationSequence): AnimationSequence {
      let keys: AnimationKey[] = new Array(_sequence.length);
      for (let i: number = 0; i < _sequence.length; i++) {
        let oldKey: AnimationKey = _sequence.getKey(i);
        keys[i] = new AnimationKey(this.totalTime - oldKey.time, oldKey.value, oldKey.interpolation, oldKey.slopeOut, oldKey.slopeIn);
      }
      return new AnimationSequence(keys, _sequence.classType);
    }

    /**
     * Creates a rastered {@link AnimationSequence} out of a given sequence.
     * @param _sequence The sequence to calculate the new sequence out of
     * @returns the rastered sequence.
     */
    private calculateRasteredSequence(_sequence: AnimationSequence): AnimationSequence {
      let keys: AnimationKey[] = [];
      let frameTime: number = 1000 / this.framesPerSecond;
      for (let i: number = 0; i < this.totalTime; i += frameTime)
        keys.push(new AnimationKey(i, _sequence.evaluate(i), ANIMATION_INTERPOLATION.CONSTANT));

      return new AnimationSequence(keys, _sequence.classType);
    }

    /**
     * Creates a new reversed {@link AnimationEventTrigger} object based on the given one.  
     * @param _events the event object to calculate the new one out of
     * @returns the reversed event object
     */
    private calculateReverseEventTriggers(_events: AnimationEventTrigger): AnimationEventTrigger {
      let ae: AnimationEventTrigger = {};
      for (let name in _events) {
        ae[name] = this.totalTime - _events[name];
      }
      return ae;
    }

    /**
     * Creates a rastered {@link AnimationEventTrigger} object based on the given one.  
     * @param _events the event object to calculate the new one out of
     * @returns the rastered event object
     */
    private calculateRasteredEventTriggers(_events: AnimationEventTrigger): AnimationEventTrigger {
      let ae: AnimationEventTrigger = {};
      let frameTime: number = 1000 / this.framesPerSecond;
      for (let name in _events) {
        ae[name] = _events[name] - (_events[name] % frameTime);
      }
      return ae;
    }

    /**
     * Checks which events lay between two given times and returns the names of the ones that do.
     * @param _eventTriggers The event object to check the events inside of.
     * @param _min the minimum of the range to check between (inclusive).
     * @param _max the maximum of the range to check between (exclusive).
     * @param _events the array to add the names of the events to.
     * @returns an given array of the events appended with the events in the given range. 
     */
    private addEventsBetween(_eventTriggers: AnimationEventTrigger, _min: number, _max: number, _events: string[]): string[] {
      for (let name in _eventTriggers) {
        if (_min <= _eventTriggers[name] && _eventTriggers[name] < _max) {
          _events.push(name);
        }
      }
      return _events;
    }
  }
}