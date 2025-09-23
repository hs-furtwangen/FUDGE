namespace FudgeCore {

  export enum PARTICLE_SYSTEM_PLAYMODE {
    /**Plays particle system in a loop: it restarts once it hit the end.*/
    LOOP,
    /**Plays particle system once and stops at the last point in time.*/
    PLAY_ONCE
  }

  /**
   * Attaches a {@link ParticleSystem} to the node. 
   * Works in conjunction with {@link ComponentMesh} and {@link ComponentMaterial} to create a shader particle system.
   * Additionally a {@link ComponentFaceCamera} can be attached to make the particles face the camera.
   * @author Jonas Plotzky, HFU, 2022
   */
  export class ComponentParticleSystem extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentParticleSystem);
    @mutate(ParticleSystem)
    public particleSystem: ParticleSystem;
    /** When disabled try enabling {@link ComponentMaterial.sortForAlpha} */
    public depthMask: boolean;

    @mutate(BLEND)
    public blendMode: BLEND;

    @mutate(PARTICLE_SYSTEM_PLAYMODE)
    public playMode: PARTICLE_SYSTEM_PLAYMODE;
    
    public duration: number;

    /** @internal A texture filed with random numbers. Used by the render engine */
    protected renderData: unknown;

    /** The number of particles */
    #size: number;
    #timeScale: number = 1;
    readonly #time: Time;

    public constructor(_particleSystem: ParticleSystem = null) {
      super();
      this.particleSystem = _particleSystem;
      this.depthMask = true;
      this.blendMode = BLEND.ADDITIVE;
      this.playMode = PARTICLE_SYSTEM_PLAYMODE.LOOP;
      this.duration = 1000;
      this.size = 10;
      this.#time = new Time();

      this.addEventListener(EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    /**
     * Get the number of particles
     */
    @mutate(Number)
    public get size(): number {
      return this.#size;
    }

    /**
     * Set the number of particles. Caution: Setting this will reinitialize the random numbers array(texture) used in the shader.
     */
    public set size(_size: number) {
      this.#size = _size;
      this.deleteRenderData();
    }

    public get time(): number {
      return this.#time.get();
    }

    public set time(_time: number) {
      this.#time.set(_time);
    }

    public get timeScale(): number {
      return this.#timeScale;
    }

    public set timeScale(_scale: number) {
      this.#timeScale = _scale;
      this.updateTimeScale();
    }

    /** 
     * Generates and binds the random numbers texture in WebGL
     * Injected by {@link RenderInjectorComponentParticleSystem}. Used by the render system.
     * @internal 
     */
    @RenderInjectorComponentParticleSystem.decorate
    public useRenderData(): void {/* injected by RenderInjector*/ }

    /** 
     * Deletes the random numbers texture in WebGL freeing the allocated gpu memory.
     * Injected by {@link RenderInjectorComponentParticleSystem}. 
     * @internal
     */
    @RenderInjectorComponentParticleSystem.decorate
    public deleteRenderData(): void {/* injected by RenderInjector*/ }

    //#region transfer
    public serialize(): Serialization {
      let serialization: Serialization = {
        [super.constructor.name]: super.serialize(),
        idParticleSystem: this.particleSystem?.idResource,
        depthMask: this.depthMask,
        blendMode: this.blendMode,
        playMode: this.playMode,
        duration: this.duration,
        size: this.size
      };

      return serialization;
    }

    public async deserialize(_serialization: Serialization): Promise<Serializable> {
      await super.deserialize(_serialization[super.constructor.name]);
      if (_serialization.idParticleSystem) this.particleSystem = <ParticleSystem>await Project.getResource(_serialization.idParticleSystem);
      this.depthMask = _serialization.depthMask;
      this.blendMode = _serialization.blendMode;
      this.playMode = _serialization.playMode;
      this.duration = _serialization.duration;
      this.size = _serialization.size;

      return this;
    }

    public getMutatorForAnimation(): MutatorForAnimation {
      let mutator: MutatorForAnimation = <MutatorForAnimation>this.getMutator();
      delete mutator.particleSystem;
      delete mutator.size;
      return mutator;
    }
    //#endregion

    private hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case EVENT.NODE_DESERIALIZED:
        case EVENT.COMPONENT_ADD:
          Time.game.addEventListener(EVENT.TIME_SCALED, this.updateTimeScale);
          this.node.addEventListener(EVENT.RENDER_PREPARE, this.update);
          break;
        case EVENT.COMPONENT_REMOVE:
          Time.game.removeEventListener(EVENT.TIME_SCALED, this.updateTimeScale);
          this.node.removeEventListener(EVENT.RENDER_PREPARE, this.update);
      }
    };

    private update = (): void => {
      if (this.time > this.duration)
        switch (this.playMode) {
          default:
          case PARTICLE_SYSTEM_PLAYMODE.LOOP:
            this.time = 0;
            break;
          case PARTICLE_SYSTEM_PLAYMODE.PLAY_ONCE:
            this.time = this.duration;
            this.timeScale = 0;
            break;
        }
    };

    private updateTimeScale = (): void => {
      let timeScale: number = this.#timeScale * Time.game.getScale();
      this.#time.setScale(timeScale);
    };
  }
}