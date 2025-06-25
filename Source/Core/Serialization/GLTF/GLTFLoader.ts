namespace FudgeCore {

  /**
   * Stores nodes and skeletons used within a glTF scene.
   */
  interface GLTFLoadingCache {
    nodes: Node[];
    skeletons: ComponentSkeleton[];
  }

  /**
   * Asset loader for gl Transfer Format files.
   * @authors Matthias Roming, HFU, 2022 | Jonas Plotzky, HFU, 2023-2025
   */
  export class GLTFLoader {
    private static loaders: { [url: string]: GLTFLoader };

    static #defaultMaterial: Material;
    static #defaultSkinMaterial: Material;

    readonly #url: string;
    readonly #gltf: GLTF.GlTf;

    #resources: Resources = {};

    #buffers: ArrayBuffer[];

    private constructor(_gltf: GLTF.GlTf, _url: string, _bufferChunk?: ArrayBuffer) {
      this.#gltf = _gltf;
      this.#url = _url;
      if (_bufferChunk)
        this.#buffers = [_bufferChunk];
    }

    private static get defaultMaterial(): Material {
      if (!this.#defaultMaterial) {
        this.#defaultMaterial = new Material("GLTFDefaultMaterial", ShaderPhong, new CoatRemissive(Color.CSS("white"), 1, 0.5));
        Project.deregister(this.#defaultMaterial);
      }
      return this.#defaultMaterial;
    }

    private static get defaultSkinMaterial(): Material {
      if (!this.#defaultSkinMaterial) {
        this.#defaultSkinMaterial = new Material("GLTFDefaultSkinMaterial", ShaderPhongSkin, new CoatRemissive(Color.CSS("white"), 1, 0.5));
        Project.deregister(this.#defaultSkinMaterial);
      }
      return this.#defaultSkinMaterial;
    }

    /**
     * Handles the loading of an external resource from a glTF file. Used by the {@link SerializableResourceExternal}GLTF specializations to load themselves.
     * @internal
     */
    public static async loadResource<T extends GraphGLTF | MeshGLTF | MaterialGLTF | AnimationGLTF | GraphInstance>(_resource: T, _url?: RequestInfo): Promise<T> {
      const loader: GLTFLoader = await GLTFLoader.LOAD(((<SerializableResourceExternal>_resource).url ?? _url).toString());

      if (!loader) {
        if (!(_resource instanceof GraphInstance))
          _resource.status = RESOURCE_STATUS.ERROR;
        return _resource;
      }

      let loaded: T;

      if (_resource instanceof GraphInstance)
        loaded = await loader.getGraph(_resource.get().name, _resource);
      else if (_resource instanceof GraphGLTF)
        loaded = await loader.getGraph(_resource.name, _resource);
      else if (_resource instanceof MeshGLTF)
        loaded = await loader.getMesh(_resource.name, _resource.iPrimitive, _resource);
      else if (_resource instanceof MaterialGLTF)
        loaded = await loader.getMaterial(_resource.name, _resource);
      else if (_resource instanceof AnimationGLTF)
        loaded = await loader.getAnimation(_resource.name, _resource);

      if (!loaded) {
        Debug.error(`${_resource.constructor.name} | ${_resource instanceof GraphInstance ? _resource.idSource : _resource.idResource}: Failed to load resource.`);
        if (!(_resource instanceof GraphInstance))
          _resource.status = RESOURCE_STATUS.ERROR;

        return _resource;
      }

      if (!(loaded instanceof GraphInstance)) {
        loaded.status = RESOURCE_STATUS.READY;
      }

      // if (cached && !(_resource instanceof GraphInstance)) {

      //   if (!Project.resources[cached.idResource])
      //     cached.idResource = _resource.idResource; // change the id of the cached resource to the id of the resource that requested it

      //   if (cached.idResource != _resource.idResource) {
      //     // two different resources have requested the same cached resource
      //     Debug.error(`${_resource.idResource}: Failed to load resource. ${_resource.type} with name '${_resource.name}' from '${loader.name}' has already been loaded by '${cached.idResource}'. Please delete the duplicate '${_resource.idResource}' from the project.`);
      //     return _resource;
      //   }

      // }

      return loaded;
    }

    /**
     * Returns a {@link GLTFLoader} instance for the given url or null if the url can't be resolved.
     */
    public static async LOAD(_url: string, _registerResources: boolean = false): Promise<GLTFLoader> {
      if (!this.loaders)
        GLTFLoader.loaders = {};

      if (!this.loaders[_url]) {
        let gltf: GLTF.GlTf;
        let buffer: ArrayBuffer;
        try {
          const response: Response = await fetch(new URL(_url, Project.baseURL));
          const fileExtension: string = _url.split('.').pop()?.toLowerCase();

          if (fileExtension == "gltf")
            gltf = await response.json();

          if (fileExtension == "glb") {
            const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
            const dataView: DataView = new DataView(arrayBuffer);

            const magic: number = dataView.getUint32(0, true);
            if (magic !== 0x46546C67)
              throw new Error(`${GLTFLoader.name} | ${_url}: Invalid magic number in GLB file.`);

            const version: number = dataView.getUint32(4, true);
            if (version != 2)
              throw new Error(`${GLTFLoader.name} | ${_url}: Unsupported version in GLB file.`);

            const jsonLength: number = dataView.getUint32(12, true);
            const jsonFormat: number = dataView.getUint32(16, true);

            if (jsonFormat !== 0x4E4F534A)
              throw new Error('Invalid format. The first chunk of the file is not in JSON format.');

            const decoder: TextDecoder = new TextDecoder();
            const jsonChunk: string = decoder.decode(new Uint8Array(arrayBuffer, 20, jsonLength));
            gltf = JSON.parse(jsonChunk);

            if (arrayBuffer.byteLength >= 20 + jsonLength) {
              const binaryLength: number = dataView.getUint32(20 + jsonLength, true);
              const binaryFormat: number = dataView.getUint32(24 + jsonLength, true);

              if (binaryFormat !== 0x004E4942)
                throw new Error('Invalid format. The second chunk of the file is not in binary format.');

              buffer = arrayBuffer.slice(28 + jsonLength, 28 + jsonLength + binaryLength);
            }
          }
        } catch (error: unknown) {
          Debug.error(`${GLTFLoader.name} | ${_url}: Failed to load file. ${error}`);
          return null;
        }

        GLTFLoader.checkCompatibility(gltf, _url);
        GLTFLoader.preProcess(gltf, _url);

        GLTFLoader.loaders[_url] = new GLTFLoader(gltf, _url, buffer);
      }

      return GLTFLoader.loaders[_url];
    }

    private static checkCompatibility(_gltf: GLTF.GlTf, _url: string): void {
      if (_gltf.asset.version != "2.0")
        Debug.warn(`${GLTFLoader.name} | ${_url}: This loader was developed for glTF 2.0. It may not work as intended with version ${_gltf.asset.version}.`);
      if (_gltf.asset.minVersion != undefined && _gltf.asset.minVersion != "2.0")
        throw new Error(`${GLTFLoader.name} | ${_url}: This loader was developed for glTF 2.0. It does not work with required min version ${_gltf.asset.minVersion}.`);
      if (_gltf.extensionsUsed?.length > 0)
        Debug.warn(`${GLTFLoader.name} | ${_url}: This loader does not support glTF extensions. It may not work as intended with extensions ${_gltf.extensionsUsed.toString()}.`);
      if (_gltf.extensionsRequired?.length > 0)
        throw new Error(`${GLTFLoader.name} | ${_url}: This loader does not support glTF extensions. It does not work with required extensions ${_gltf.extensionsRequired.toString()}.`);
    }

    private static preProcess(_gltf: GLTF.GlTf, _url: string): void {
      // add a name to each scene
      if (_gltf.scenes) {
        _gltf.scene = _gltf.scene ?? 0;
        addNames("Scene", _gltf.scenes);
      }

      if (_gltf.nodes) {
        // mark all nodes that are animated
        _gltf.animations?.forEach(_animation => {
          _animation.channels.forEach(_channel => {
            const iNode: number = _channel.target.node;
            if (iNode != undefined)
              _gltf.nodes[iNode].isAnimated = true;
          });
        });

        // mark parent of each node
        _gltf.nodes.forEach((_node, _iNode) => _node.children?.forEach(_iChild => _gltf.nodes[_iChild].parent = _iNode));

        _gltf.nodes.forEach((_node, _iNode) => {
          // add names to nodes that don't have one
          if (_node.name == undefined)
            _node.name = `Node${_iNode}`;

          if (_node.isAnimated) {
            // add path to each animated node
            let iParent: number = _node.parent;
            let path: number[] = [];
            path.push(_iNode);
            while (iParent != undefined) {
              path.push(iParent);
              iParent = _gltf.nodes[iParent].parent;
            }
            _node.path = path.reverse();
          }

        });
      }

      if (_gltf.materials)
        addNames("Material", _gltf.materials);

      if (_gltf.meshes)
        addNames("Mesh", _gltf.meshes);

      if (_gltf.animations)
        addNames("Animation", _gltf.animations);

      function addNames(_template: string, _target: { name?: string }[]): void {
        _target.forEach((_item, _index) => {
          if (_item.name == undefined)
            _item.name = `${_template}${_index}`;
        });
      }
    }

    /**
     * Returns the glTF file name.
     */
    public get name(): string {
      return this.#url.split("\\").pop();
    }

    /**
     * Returns new instances of all resources of the given type.
     */
    public async loadResources<T extends SerializableResourceExternal>(_class: new () => T): Promise<T[]> {
      let resources: SerializableResourceExternal[] = [];
      switch (_class.name) {
        case Graph.name:
          for (let iScene: number = 0; iScene < this.#gltf.scenes?.length; iScene++)
            resources.push(await this.getGraph(iScene, new GraphGLTF()));
          break;
        case Mesh.name:
          for (let iMesh: number = 0; iMesh < this.#gltf.meshes?.length; iMesh++)
            for (let iPrimitive: number = 0; iPrimitive < this.#gltf.meshes[iMesh].primitives.length; iPrimitive++)
              resources.push(await this.getMesh(iMesh, iPrimitive, new MeshGLTF()));
          break;
        case Material.name:
          for (let iMaterial: number = 0; iMaterial < this.#gltf.materials?.length; iMaterial++)
            resources.push(await this.getMaterial(iMaterial, new MaterialGLTF("Hi :)")));
          break;
        case Animation.name:
          for (let iAnimation: number = 0; iAnimation < this.#gltf.animations?.length; iAnimation++)
            resources.push(await this.getAnimation(iAnimation, new AnimationGLTF()));
          break;
      }

      for (const resource of resources) {
        if (!Project.resources[resource.idResource])
          Project.register(resource);

        resource.status = RESOURCE_STATUS.READY;
      }

      return <T[]>resources;
    }

    /**
     * Returns a {@link Graph} for the given scene name or the default scene if no name is given.
     */
    public async getGraph(_name?: string): Promise<Graph>;
    /**
     * Returns a {@link Graph} for the given scene index or the default scene if no index is given.
     */
    public async getGraph(_iScene?: number): Promise<Graph>;
    /**
     * Loads a scene from the glTF file into the given {@link Graph}.
     * @internal
     */
    public async getGraph<T extends Node>(_iScene: number | string, _graphOut: T): Promise<T>;
    public async getGraph(_iScene: number | string = this.#gltf.scene, _graphOut?: Node): Promise<Node> {
      _iScene = this.getIndex(_iScene, this.#gltf.scenes);

      if (_iScene == -1)
        return null;

      const id: string = `${GraphGLTF.name}|${_iScene}`;

      if (!_graphOut && this.#resources[id])
        return <Node><unknown>this.#resources[id];

      let cache: GLTFLoadingCache = {
        nodes: [],
        skeletons: []
      };

      const gltfScene: GLTF.Scene = this.#gltf.scenes[_iScene];
      const graph: Node = _graphOut ?? new GraphGLTF();
      graph.name = gltfScene.name;
      if (graph instanceof GraphGLTF)
        graph.url = this.#url;
      if (_graphOut) {
        _graphOut.removeAllChildren();
        _graphOut.removeComponents(ComponentSkeleton);
      }

      for (const iNode of gltfScene.nodes)
        graph.addChild(await this.getNodeByIndex(iNode, cache));

      // if (this.#gltf.animations?.length > 0 && !graph.getComponent(ComponentAnimation)) {
      //   let animation: Animation = await this.getAnimation(0);
      //   Project.register(animation);
      //   graph.addComponent(new ComponentAnimation(animation));
      // }

      for (const skeleton of cache.skeletons)
        graph.addComponent(skeleton);

      if (!_graphOut)
        this.#resources[id] = <GraphGLTF>graph;

      return graph;
    }

    /**
     * Returns the first {@link Animation} with the given animation name.
     */
    public async getAnimation(_name: string): Promise<Animation>;
    /**
     * Returns the {@link Animation} for the given animation index.
     */
    public async getAnimation(_iAnimation: number): Promise<Animation>;
    /**
     * Loads an animation from the glTF file into the given {@link Animation}.
     * @internal
     */
    public async getAnimation<T extends Animation>(_iAnimation: number | string, _animationOut: T): Promise<T>;
    public async getAnimation(_iAnimation: number | string, _animationOut?: Animation): Promise<Animation> {
      _iAnimation = this.getIndex(_iAnimation, this.#gltf.animations);

      if (_iAnimation == -1)
        return null;

      const id: string = `${Animation.name}|${_iAnimation}`;

      if (!_animationOut && this.#resources[id])
        return <Animation>this.#resources[id];

      const gltfAnimation: GLTF.Animation = this.#gltf.animations?.[_iAnimation];

      if (!gltfAnimation)
        throw new Error(`${this}: Couldn't find animation with index ${_iAnimation}.`);

      const animationStructure: AnimationStructure = {};
      for (const gltfChannel of gltfAnimation.channels) {
        if (gltfChannel.target.path == "weights") {
          Debug.warn(`${this}: Animation with index ${_iAnimation} has a target path of 'weights'. FUDGE does not support morph targets.`);
          continue;
        }

        const gltfNode: GLTF.Node = this.#gltf.nodes[gltfChannel.target.node];
        if (!gltfNode)
          continue;

        let node: General = animationStructure;
        for (const iNode of gltfNode.path) {
          const childName: string = this.#gltf.nodes[iNode].name;
          // node.children[childName]
          node = (node.children ??= {})[childName] ??= {};
        }

        // node.components.ComponentTransform[0].mtxLocal
        type AnimationSequenceMatrix4x4 = { translation?: AnimationSequence<Vector3>; rotation?: AnimationSequence<Quaternion>; scaling?: AnimationSequence<Vector3> };
        let mtxLocal: AnimationSequenceMatrix4x4 = ((((node.components ??= {}).ComponentTransform ??= [])[0] ??= {}).mtxLocal ??= {});
        mtxLocal[toInternTransformation[gltfChannel.target.path]] =
          <General>await this.getAnimationSequence(gltfAnimation.samplers[gltfChannel.sampler], gltfChannel.target.path);
      }

      const animation: Animation = _animationOut ?? new AnimationGLTF();
      animation.animationStructure = animationStructure;
      animation.clearCache();
      animation.name = gltfAnimation.name;
      animation.calculateTotalTime();
      if (animation instanceof AnimationGLTF)
        animation.url = this.#url;
      if (!_animationOut) {
        Project.deregister(animation);
        this.#resources[id] = animation;
      }

      return animation;
    }

    public async getAnimationNew(_iAnimation: number | string, _animationOut?: AnimationSystem.Animation): Promise<AnimationSystem.Animation> {
      _iAnimation = this.getIndex(_iAnimation, this.#gltf.animations);

      if (_iAnimation == -1)
        return null;

      const id: string = `${Animation.name}|${_iAnimation}`;

      if (!_animationOut && this.#resources[id])
        return <AnimationSystem.Animation>this.#resources[id];

      const gltfAnimation: GLTF.Animation = this.#gltf.animations?.[_iAnimation];

      if (!gltfAnimation)
        throw new Error(`${this}: Couldn't find animation with index ${_iAnimation}.`);

      const gltfChannels: GLTF.AnimationChannel[] = gltfAnimation.channels;
      const channels: AnimationSystem.AnimationChannel[] = new Array<AnimationSystem.AnimationChannel>(gltfChannels.length);
      let duration: number = 0;
      for (let i: number = 0; i < gltfChannels.length; i++) {
        const gltfChannel: GLTF.AnimationChannel = gltfChannels[i];
        const gltfTarget: GLTF.AnimationChannelTarget = gltfChannel.target;
        const gltfPath: GLTF.AnimationChannelTarget["path"] = gltfTarget.path;
        if (gltfPath == "weights") {
          Debug.warn(`${this}: Animation with index ${_iAnimation} has a target path of 'weights'. FUDGE does not support morph targets.`);
          continue;
        }

        const gltfNode: GLTF.Node = this.#gltf.nodes[gltfTarget.node];
        if (!gltfNode)
          continue;

        const path: string = `${gltfNode.path.map((_iNode: number) => `${this.#gltf.nodes[_iNode].name}`).join("/")}/components/ComponentTransform/0/mtxLocal/${toInternTransformationNew[gltfPath]}`;
        const sampler: GLTF.AnimationSampler = gltfAnimation.samplers[gltfChannel.sampler];
        const interpolation: ANIMATION_INTERPOLATION = this.toInternInterpolation(sampler.interpolation);

        const input: Float32Array = (await this.getFloat32Array(sampler.input)).map((_time: number) => _time * 1000);
        duration = Math.max(duration, input[input.length - 1]);

        const output: Float32Array = await this.getFloat32Array(sampler.output);
        if (gltfPath == "rotation")
          channels[i] = new AnimationSystem.AnimationChannelQuaternion(path, input, output, interpolation);
        else
          channels[i] = new AnimationSystem.AnimationChannelVector(path, input, output, interpolation);
      }

      const animation: AnimationSystem.Animation = new AnimationSystem.Animation();
      animation.name = gltfAnimation.name;
      animation.channels = channels;
      animation.duration = duration;

      return animation;
    }



    /**
     * Returns the first {@link MeshGLTF} with the given name.
     */
    public async getMesh(_name: string, _iPrimitive?: number): Promise<Mesh>;
    /**
     * Returns the {@link MeshGLTF} for the given mesh index and primitive index.
     */
    public async getMesh(_iMesh: number, _iPrimitive?: number): Promise<Mesh>;
    /**
     * Loads a mesh from the glTF file into the given {@link Mesh}.
     * @internal
    */
    public async getMesh<T extends Mesh>(_iMesh: number | string, _iPrimitive: number, _meshOut: T): Promise<T>;
    public async getMesh(_iMesh: number | string, _iPrimitive: number = 0, _meshOut?: Mesh): Promise<Mesh> {
      _iMesh = this.getIndex(_iMesh, this.#gltf.meshes);

      if (_iMesh == -1)
        return null;

      const id: string = `${MeshGLTF.name}|${_iMesh}|${_iPrimitive}`;

      if (!_meshOut && this.#resources[id])
        return <MeshGLTF>this.#resources[id];

      const gltfMesh: GLTF.Mesh = this.#gltf.meshes[_iMesh];
      const gltfPrimitive: GLTF.MeshPrimitive = gltfMesh.primitives[_iPrimitive];

      if (gltfPrimitive.indices == undefined)
        Debug.warn(`${this}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has no indices. FUDGE does not support non-indexed meshes.`);

      if (gltfPrimitive.attributes.POSITION == undefined)
        Debug.warn(`${this}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has no position attribute. Primitive will be ignored.`);

      if (gltfPrimitive.mode != undefined && gltfPrimitive.mode != GLTF.MESH_PRIMITIVE_MODE.TRIANGLES)
        Debug.warn(`${this}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has topology type mode ${GLTF.MESH_PRIMITIVE_MODE[gltfPrimitive.mode]}. FUDGE only supports ${GLTF.MESH_PRIMITIVE_MODE[4]}.`);

      checkMaxSupport(this, "TEXCOORD", 2);
      checkMaxSupport(this, "COLOR", 1);
      checkMaxSupport(this, "JOINTS", 1);
      checkMaxSupport(this, "WEIGHTS", 1);

      let positions: Float32Array, indices: Uint16Array;
      let normals: Float32Array, tangents: Float32Array;
      let colors: Float32Array, textureUVs: Float32Array;
      let bones: Uint8Array, weights: Float32Array;

      if (gltfPrimitive.indices != undefined) {
        indices = await this.getVertexIndices(gltfPrimitive.indices);
        for (let i: number = 0; i < indices.length; i += 3) {
          const temp: number = indices[i + 2];
          indices[i + 2] = indices[i + 0];
          indices[i + 0] = indices[i + 1];
          indices[i + 1] = temp;
        }
      } else {
        Debug.warn(`${this}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has no indices. FUDGE does not support non-indexed meshes.`);
      }

      if (gltfPrimitive.attributes.POSITION != undefined)
        positions = await this.getFloat32Array(gltfPrimitive.attributes.POSITION);
      else
        Debug.warn(`${this}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has no position attribute. Primitive will be ignored.`);

      if (gltfPrimitive.attributes.NORMAL != undefined)
        normals = await this.getFloat32Array(gltfPrimitive.attributes.NORMAL);
      // TODO: calculate flat normals if not provided, fudge will calculate smooth normals if not provided

      if (gltfPrimitive.attributes.TANGENT != undefined)
        tangents = await this.getFloat32Array(gltfPrimitive.attributes.TANGENT);

      if (gltfPrimitive.attributes.TEXCOORD_1 != undefined)
        textureUVs = await this.getFloat32Array(gltfPrimitive.attributes.TEXCOORD_1);
      else if (gltfPrimitive.attributes.TEXCOORD_0 != undefined)
        textureUVs = await this.getFloat32Array(gltfPrimitive.attributes.TEXCOORD_0);

      if (gltfPrimitive.attributes.COLOR_0 != undefined)
        colors = await this.getVertexColors(gltfPrimitive.attributes.COLOR_0);

      if (gltfPrimitive.attributes.JOINTS_0 != undefined && gltfPrimitive.attributes.WEIGHTS_0 != undefined) {
        bones = await this.getBoneIndices(gltfPrimitive.attributes.JOINTS_0);
        weights = await this.getFloat32Array(gltfPrimitive.attributes.WEIGHTS_0);
      }

      const mesh: Mesh = _meshOut ?? new MeshGLTF();
      mesh.name = gltfMesh.name;
      if (mesh instanceof MeshGLTF) {
        mesh.iPrimitive = _iPrimitive;
        mesh.url = this.#url;
      }
      if (_meshOut) {
        _meshOut.clear();
        _meshOut.faces = [];
        _meshOut.vertices = new Vertices();
      }

      if (!normals || !tangents) {
        // Create mesh vertices and faces so that normals and tangents can be calculated if either is missing.
        for (let iVector2: number = 0, iVector3: number = 0, iVector4: number = 0; iVector3 < positions?.length; iVector2 += 2, iVector3 += 3, iVector4 += 4) {
          mesh.vertices.push(
            new Vertex(
              new Vector3(positions[iVector3 + 0], positions[iVector3 + 1], positions[iVector3 + 2]),
              textureUVs && new Vector2(textureUVs[iVector2 + 0], textureUVs[iVector2 + 1]),
              normals && new Vector3(normals[iVector3 + 0], normals[iVector3 + 1], normals[iVector3 + 2]),
              tangents && new Vector4(tangents[iVector4 + 0], tangents[iVector4 + 1], tangents[iVector4 + 2], tangents[iVector4 + 3]),
              colors && new Color(colors[iVector4 + 0], colors[iVector4 + 1], colors[iVector4 + 2], colors[iVector4 + 3]),
              bones && weights && [
                { index: bones[iVector4 + 0], weight: weights[iVector4 + 0] },
                { index: bones[iVector4 + 1], weight: weights[iVector4 + 1] },
                { index: bones[iVector4 + 2], weight: weights[iVector4 + 2] },
                { index: bones[iVector4 + 3], weight: weights[iVector4 + 3] }
              ]
            )
          );
        }

        for (let iFaceVertexIndex: number = 0; iFaceVertexIndex < indices?.length; iFaceVertexIndex += 3) {
          try {
            mesh.faces.push(new Face(
              mesh.vertices,
              indices[iFaceVertexIndex + 0],
              indices[iFaceVertexIndex + 1],
              indices[iFaceVertexIndex + 2]
            ));
          } catch (_e: unknown) {
            Debug.fudge("Face excluded", (<Error>_e).message);
          }
        }
      }

      const renderMesh: RenderMesh = mesh.renderMesh;
      renderMesh.positions = positions;
      renderMesh.indices = indices;
      renderMesh.normals = normals;
      renderMesh.tangents = tangents;
      renderMesh.textureUVs = textureUVs;
      renderMesh.colors = colors;
      renderMesh.bones = bones;
      renderMesh.weights = weights;

      if (!_meshOut) {
        Project.deregister(mesh);
        // mesh.idResource = id;
        this.#resources[id] = mesh;
      }

      return mesh;

      function checkMaxSupport(_loader: GLTFLoader, _check: string, _max: number): void {
        if (Object.keys(gltfPrimitive.attributes).filter((_key: string) => _key.startsWith(_check)).length > _max)
          Debug.warn(`${_loader}: Mesh with index ${_iMesh} primitive ${_iPrimitive} has more than ${_max} sets of '${_check}' associated with it. FUGDE only supports up to ${_max} ${_check} sets per primitive.`);
      }
    }

    /**
     * Returns the first {@link MaterialGLTF} with the given material name.
     */
    public async getMaterial(_name: string): Promise<Material>;
    /**
     * Returns the {@link Material} for the given material index.
     */
    public async getMaterial(_iMaterial: number): Promise<Material>;
    /**
     * Loads a material from the glTF file into the given {@link Material}.
     * @internal
     */
    public async getMaterial<T extends Material>(_iMaterial: number | string, _materialOut?: T, _skin?: boolean): Promise<T>;
    public async getMaterial(_iMaterial: number | string, _materialOut?: Material, _skin: boolean = false): Promise<Material> {
      _iMaterial = this.getIndex(_iMaterial, this.#gltf.materials);

      if (_iMaterial == -1)
        return null;

      const id: string = `${Material.name}|${_iMaterial}`;

      if (this.#resources[id] && !_materialOut)
        return <Material>this.#resources[id];

      // TODO: in the future create an appropriate shader based on the glTF material properties
      const gltfMaterial: GLTF.Material = this.#gltf.materials[_iMaterial];

      if (!gltfMaterial)
        throw new Error(`${this}: Couldn't find material with index ${_iMaterial}.`);

      // TODO: add support for other glTF material properties: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-material
      // e.g. occlusion and emissive textures; doubleSided
      const gltfBaseColorFactor: number[] = gltfMaterial.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1];
      const gltfMetallicFactor: number = gltfMaterial.pbrMetallicRoughness?.metallicFactor ?? 1;
      const gltfRoughnessFactor: number = gltfMaterial.pbrMetallicRoughness?.roughnessFactor ?? 1;
      const gltfEmissiveFactor: number[] = gltfMaterial.emissiveFactor ?? [0, 0, 0];

      const gltfBaseColorTexture: GLTF.TextureInfo = gltfMaterial.pbrMetallicRoughness?.baseColorTexture;
      const gltfNormalTexture: GLTF.MaterialNormalTextureInfo = gltfMaterial.normalTexture;

      // The diffuse contribution in the Phong shading model. Represents how much light is scattered in different directions due to the material's surface properties.
      const diffuse: number = 1;
      // The shininess of the material. Influences the sharpness or broadness of the specular highlight. Higher specular values result in a sharper and more concentrated specular highlight.
      const specular: number = 1.8 * (1 - gltfRoughnessFactor) + 0.6 * gltfMetallicFactor;
      // The strength/intensity of the specular reflection
      const intensity: number = 0.7 * (1 - gltfRoughnessFactor) + gltfMetallicFactor;
      // Influences how much the material's color affects the specular reflection. When metallic is higher, the specular reflection takes on the color of the material, creating a metallic appearance. Range from 0.0 to 1.0.
      const metallic: number = gltfMetallicFactor;

      const isLit: boolean = gltfEmissiveFactor[0] > 0 || gltfEmissiveFactor[1] > 0 || gltfEmissiveFactor[2] > 0;
      const color: Color = new Color(...gltfBaseColorFactor);
      if (isLit)
        color.add(new Color(...gltfEmissiveFactor, 0));
      const coat: Coat = gltfBaseColorTexture ?
        isLit ? new CoatTextured(color, await this.getTexture(gltfBaseColorTexture.index)) :
          gltfNormalTexture ?
            new CoatRemissiveTexturedNormals(color, await this.getTexture(gltfBaseColorTexture.index), await this.getTexture(gltfNormalTexture.index), diffuse, specular, intensity, metallic) :
            new CoatRemissiveTextured(color, await this.getTexture(gltfBaseColorTexture.index), diffuse, specular, intensity, metallic) :
        isLit ? new CoatColored(color) : new CoatRemissive(color, diffuse, specular, intensity, metallic);

      if (gltfMaterial.alphaCutoff != undefined)
        coat.alphaClip = gltfMaterial.alphaCutoff;

      let shader: typeof Shader;
      if (isLit) {
        shader = gltfBaseColorTexture ?
          (_skin ? ShaderLitTexturedSkin : ShaderLitTextured) :
          (_skin ? ShaderLitSkin : ShaderLit);
      } else {
        shader = gltfBaseColorTexture ?
          gltfNormalTexture ?
            (_skin ? ShaderPhongTexturedNormalsSkin : ShaderPhongTexturedNormals) :
            (_skin ? ShaderPhongTexturedSkin : ShaderPhongTextured) :
          (_skin ? ShaderPhongSkin : ShaderPhong);
      }

      const material: Material = _materialOut ?? new MaterialGLTF(gltfMaterial.name);
      material.name = gltfMaterial.name;
      material.coat = coat;

      Reflect.set(material, "shaderType", shader);
      // material.setShader(shader);
      if (material instanceof MaterialGLTF)
        material.url = this.#url;

      if (!_materialOut) {
        Project.deregister(material);
        this.#resources[id] = material;
      }

      return material;
    }

    /**
     * Returns the {@link Texture} for the given texture index.
     */
    public async getTexture(_iTexture: number): Promise<Texture> {
      const id: string = `${Texture.name}|${_iTexture}`;

      if (this.#resources[id])
        return <Texture>this.#resources[id];

      const gltfTexture: GLTF.Texture = this.#gltf.textures[_iTexture];
      const gltfSampler: GLTF.Sampler = this.#gltf.samplers?.[gltfTexture.sampler];
      const gltfImage: GLTF.Image = this.#gltf.images?.[gltfTexture.source];

      if (gltfImage == undefined) {
        Debug.warn(`${this}: Texture with index ${_iTexture} has no image.`);
        return TextureDefault.color;
      }

      let url: string = new URL(gltfImage.uri, new URL(this.#url, Project.baseURL)).toString();

      if (!gltfImage.uri && gltfImage.bufferView) {
        // TODO: this is duplicate code from getBufferData, maybe refactor getBufferData to handle bufferViewIndex input
        const gltfBufferView: GLTF.BufferView = this.#gltf.bufferViews[gltfImage.bufferView];

        const buffer: ArrayBuffer = await this.getBuffer(gltfBufferView.buffer);
        const byteOffset: number = gltfBufferView.byteOffset || 0;
        const byteLength: number = gltfBufferView.byteLength || 0;

        url = URL.createObjectURL(new Blob(
          [new Uint8Array(buffer, byteOffset, byteLength / Uint8Array.BYTES_PER_ELEMENT)],
          { type: gltfImage.mimeType }
        ));
      }

      const texture: TextureImage = new TextureImage();
      await texture.load(url);

      if (gltfSampler) {
        gltfSampler.magFilter = gltfSampler.magFilter ?? WebGL2RenderingContext.NEAREST; // default value
        gltfSampler.minFilter = gltfSampler.minFilter ?? WebGL2RenderingContext.NEAREST; // default value

        if (gltfSampler.magFilter == WebGL2RenderingContext.NEAREST && gltfSampler.minFilter == WebGL2RenderingContext.NEAREST)
          texture.mipmap = MIPMAP.CRISP;
        else if (gltfSampler.magFilter == WebGL2RenderingContext.NEAREST && gltfSampler.minFilter == WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR)
          texture.mipmap = MIPMAP.MEDIUM;
        else if (gltfSampler.magFilter == WebGL2RenderingContext.LINEAR && gltfSampler.minFilter == WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR)
          texture.mipmap = MIPMAP.BLURRY;
        else
          Debug.warn(`${this}: Texture with index ${_iTexture} has a magFilter and minFilter of '${getWebGLParameterName(gltfSampler.magFilter)}' and '${getWebGLParameterName(gltfSampler.minFilter)}' respectively. FUDGE only supports the following combinations: NEAREST and NEAREST | NEAREST and NEAREST_MIPMAP_LINEAR | LINEAR and LINEAR_MIPMAP_LINEAR.`);

        gltfSampler.wrapS = gltfSampler.wrapS ?? WebGL2RenderingContext.REPEAT; // default value
        gltfSampler.wrapT = gltfSampler.wrapT ?? WebGL2RenderingContext.REPEAT; // default value

        if (gltfSampler.wrapS == WebGL2RenderingContext.REPEAT && gltfSampler.wrapT == WebGL2RenderingContext.REPEAT)
          texture.wrap = WRAP.REPEAT;
        else if (gltfSampler.wrapS == WebGL2RenderingContext.CLAMP_TO_EDGE && gltfSampler.wrapT == WebGL2RenderingContext.CLAMP_TO_EDGE)
          texture.wrap = WRAP.CLAMP;
        else if (gltfSampler.wrapS == WebGL2RenderingContext.MIRRORED_REPEAT && gltfSampler.wrapT == WebGL2RenderingContext.MIRRORED_REPEAT)
          texture.wrap = WRAP.MIRROR;
        else
          Debug.warn(`${this}: Texture with index ${_iTexture} has a wrapS and wrapT of '${getWebGLParameterName(gltfSampler.wrapS)}' and '${getWebGLParameterName(gltfSampler.wrapT)}' respectively. FUDGE only supports the following combinations: REPEAT and REPEAT | CLAMP_TO_EDGE and CLAMP_TO_EDGE | MIRRORED_REPEAT and MIRRORED_REPEAT.`);
      }

      Project.deregister(texture);
      this.#resources[id] = texture;

      return texture;
    }

    public toString(): string {
      return `${GLTFLoader.name} | ${this.#url}`;
    }

    /**
     * Returns the {@link Node} for the given index.
     */
    private async getNodeByIndex(_iNode: number, _cache: GLTFLoadingCache): Promise<Node> {
      if (!_cache.nodes[_iNode]) {
        const gltfNode: GLTF.Node = this.#gltf.nodes[_iNode];
        const node: Node = new Node(gltfNode.name);

        _cache.nodes[_iNode] = node;

        // check for children
        if (gltfNode.children)
          for (const iNode of gltfNode.children)
            node.addChild(await this.getNodeByIndex(iNode, _cache));

        // check for transformation
        if (gltfNode.matrix || gltfNode.rotation || gltfNode.scale || gltfNode.translation || gltfNode.isAnimated) {
          node.addComponent(new ComponentTransform());
          if (gltfNode.matrix) {
            node.mtxLocal.fromArray(gltfNode.matrix);
          } else {
            if (gltfNode.translation) {
              const translation: Vector3 = Recycler.get(Vector3);
              translation.fromArray(gltfNode.translation);
              node.mtxLocal.translation = translation;
              Recycler.store(translation);
            }
            if (gltfNode.rotation) {
              const rotation: Quaternion = Recycler.get(Quaternion);
              rotation.fromArray(gltfNode.rotation);
              node.mtxLocal.rotation = rotation;
              Recycler.store(rotation);
            }
            if (gltfNode.scale) {
              const scale: Vector3 = Recycler.get(Vector3);
              scale.fromArray(gltfNode.scale);
              node.mtxLocal.scaling = scale;
              Recycler.store(scale);
            }
          }
        }

        // check for camera
        if (gltfNode.camera != undefined) {
          node.addComponent(await this.getCameraByIndex(gltfNode.camera));
        }

        // check for mesh and material
        if (gltfNode.mesh != undefined) {
          const gltfMesh: GLTF.Mesh = this.#gltf.meshes?.[gltfNode.mesh];
          // TODO: review this
          const subComponents: [ComponentMesh, ComponentMaterial][] = [];
          for (let iPrimitive: number = 0; iPrimitive < gltfMesh.primitives.length; iPrimitive++) {
            const cmpMesh: ComponentMesh = new ComponentMesh(await this.getMesh(gltfNode.mesh, iPrimitive));
            const isSkin: boolean = gltfNode.skin != undefined;

            if (isSkin)
              cmpMesh.skeleton = await this.getSkeletonByIndex(gltfNode.skin, _cache);

            let cmpMaterial: ComponentMaterial;
            const iMaterial: number = gltfMesh.primitives?.[iPrimitive]?.material;
            if (iMaterial == undefined) {
              cmpMaterial = new ComponentMaterial(isSkin ?
                GLTFLoader.defaultSkinMaterial :
                GLTFLoader.defaultMaterial);
            } else {
              cmpMaterial = new ComponentMaterial(await this.getMaterial(iMaterial, null, isSkin));

              // TODO: maybe this should be a fudge material property
              const gltfMaterial: GLTF.Material = this.#gltf.materials[iMaterial];
              if (gltfMaterial)
                cmpMaterial.sortForAlpha = gltfMaterial.alphaMode == "BLEND";

            }

            subComponents.push([cmpMesh, cmpMaterial]);
          }

          if (subComponents.length == 1) {
            node.addComponent(subComponents[0][0]);
            node.addComponent(subComponents[0][1]);
          } else {
            subComponents.forEach(([_cmpMesh, _cmpMaterial], _i) => {
              const nodePart: Node = new Node(`${node.name}_Primitive${_i}`);
              nodePart.addComponent(_cmpMesh);
              nodePart.addComponent(_cmpMaterial);
              node.addChild(nodePart);
            });
          }
        }
      }

      return _cache.nodes[_iNode];
    }

    /**
    * Returns the {@link ComponentSkeleton} for the given skeleton index.
    */
    private async getSkeletonByIndex(_iSkeleton: number, _cache: GLTFLoadingCache): Promise<ComponentSkeleton> {
      if (!_cache.skeletons[_iSkeleton]) {
        const gltfSkin: GLTF.Skin = this.#gltf.skins[_iSkeleton];
        const bones: Node[] = [];

        // convert float array to array of matrices and register bones
        let mtxData: Float32Array;
        if (gltfSkin.inverseBindMatrices != undefined)
          mtxData = await this.getFloat32Array(gltfSkin.inverseBindMatrices);
        const mtxDataSpan: number = 16; // size of matrix

        const mtxBindInverses: Matrix4x4[] = [];
        // iterate over joints and get corresponding matrix from float array
        for (let iBone: number = 0; iBone < gltfSkin.joints.length; iBone++) {
          let mtxBindInverse: Matrix4x4;
          if (mtxData)
            mtxBindInverse = new Matrix4x4(mtxData.slice(iBone * mtxDataSpan, (iBone + 1) * mtxDataSpan));

          bones.push(await this.getNodeByIndex(gltfSkin.joints[iBone], _cache));
          mtxBindInverses.push(mtxBindInverse);
        }

        _cache.skeletons[_iSkeleton] = new ComponentSkeleton(bones, mtxBindInverses);
      }

      return _cache.skeletons[_iSkeleton];
    }

    /**
     * Returns the {@link ComponentCamera} for the given camera index.
     */
    private async getCameraByIndex(_iCamera: number): Promise<ComponentCamera> {
      const gltfCamera: GLTF.Camera = this.#gltf.cameras[_iCamera];
      const camera: ComponentCamera = new ComponentCamera();

      if (gltfCamera.perspective)
        camera.projectCentral(
          gltfCamera.perspective.aspectRatio,
          gltfCamera.perspective.yfov * Calc.rad2deg,
          null,
          gltfCamera.perspective.znear,
          gltfCamera.perspective.zfar
        );
      else
        camera.projectOrthographic(
          -gltfCamera.orthographic.xmag,
          gltfCamera.orthographic.xmag,
          -gltfCamera.orthographic.ymag,
          gltfCamera.orthographic.ymag
        );

      return camera;
    }

    private getIndex(_nameOrIndex: string | number, _array: { name?: string }[]): number {
      let index: number =
        typeof _nameOrIndex == "number" ?
          _nameOrIndex :
          _array.findIndex(_object => _object.name == _nameOrIndex);
      if (index == -1) {
        let arrayName: string = Object.entries(this.#gltf).find(([_key, _value]) => _value == _array)?.[0];
        Debug.error(`${this}: Couldn't find name '${_nameOrIndex}' in glTF ${arrayName}.`);
      }
      return index;
    }

    /**
     * Returns a {@link Uint8Array} for the given accessor index.
     * @internal
     */
    private async getBoneIndices(_iAccessor: number): Promise<Uint8Array> {
      const array: TypedArray = await this.getBufferData(_iAccessor);
      const componentType: GLTF.COMPONENT_TYPE = this.#gltf.accessors[_iAccessor]?.componentType;

      if (componentType == GLTF.COMPONENT_TYPE.UNSIGNED_BYTE)
        return array as Uint8Array;

      if (componentType == GLTF.COMPONENT_TYPE.UNSIGNED_SHORT) {
        Debug.log(`${this}: Bone indices are stored as '${GLTF.COMPONENT_TYPE[GLTF.COMPONENT_TYPE.UNSIGNED_SHORT]}'. FUDGE will convert them to '${GLTF.COMPONENT_TYPE[GLTF.COMPONENT_TYPE.UNSIGNED_BYTE]}'. FUDGE only supports skeletons with up to 256 bones, so make sure your skeleton has no more than 256 bones.`);
        return Uint8Array.from(array);
      }

      throw new Error(`${this}: Invalid component type '${GLTF.COMPONENT_TYPE[componentType]}' for bone indices. Expected '${GLTF.COMPONENT_TYPE[GLTF.COMPONENT_TYPE.UNSIGNED_BYTE]}' or '${GLTF.COMPONENT_TYPE[GLTF.COMPONENT_TYPE.UNSIGNED_SHORT]}'.`);
    }

    /**
     * Returns a {@link Float32Array} for the given accessor index.
     * @internal
     */
    private async getFloat32Array(_iAccessor: number): Promise<Float32Array> {
      const array: TypedArray = await this.getBufferData(_iAccessor);
      const gltfAccessor: GLTF.Accessor = this.#gltf.accessors[_iAccessor];

      if (gltfAccessor.componentType == GLTF.COMPONENT_TYPE.FLOAT)
        return array as Float32Array;

      if (gltfAccessor.normalized) {
        switch (gltfAccessor.componentType) {
          case GLTF.COMPONENT_TYPE.BYTE:
            return Float32Array.from(array, _value => Math.max(_value / 127, -1));
          case GLTF.COMPONENT_TYPE.UNSIGNED_BYTE:
            return Float32Array.from(array, _value => _value / 255);
          case GLTF.COMPONENT_TYPE.SHORT:
            return Float32Array.from(array, _value => Math.max(_value / 32767, -1));
          case GLTF.COMPONENT_TYPE.UNSIGNED_SHORT:
            return Float32Array.from(array, _value => _value / 65535);
          default:
            throw new Error(`${this}: Invalid component type '${GLTF.COMPONENT_TYPE[gltfAccessor.componentType]}' for normalized accessor.`);
          // https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#_accessor_normalized
        }
      }

      Debug.warn(`${this}: Expected component type '${GLTF.COMPONENT_TYPE[GLTF.COMPONENT_TYPE.FLOAT]}' but was '${GLTF.COMPONENT_TYPE[gltfAccessor?.componentType]}'.`);
      return Float32Array.from(array);
    }

    /**
     * Returns a {@link Uint16Array} for the given accessor index. Only used to get the vertex indices.
     * @internal
     */
    private async getVertexIndices(_iAccessor: number): Promise<Uint16Array> {
      const array: TypedArray = await this.getBufferData(_iAccessor);
      const gltfAccessor: GLTF.Accessor = this.#gltf.accessors[_iAccessor];

      if (gltfAccessor.componentType == GLTF.COMPONENT_TYPE.UNSIGNED_SHORT)
        return array as Uint16Array;

      if (gltfAccessor.count > 65535 && gltfAccessor.type == "SCALAR")
        throw new Error(`${this}: File includes a mesh with more than 65535 vertices. FUDGE does not support meshes with more than 65535 vertices.`);

      if (gltfAccessor.componentType == GLTF.COMPONENT_TYPE.UNSIGNED_BYTE || gltfAccessor.componentType == GLTF.COMPONENT_TYPE.UNSIGNED_INT)
        return Uint16Array.from(array);

      Debug.warn(`${this}: Expected an unsigned integer component type but was '${GLTF.COMPONENT_TYPE[this.#gltf.accessors[_iAccessor]?.componentType]}'.`);
      return Uint16Array.from(array);
    }

    /**
     * Return a {@link Float32Array} for the given accessor index. The array contains the vertex colors in RGBA format.
     * @internal
     */
    private async getVertexColors(_iAccessor: number): Promise<Float32Array> {
      const array: Float32Array = await this.getFloat32Array(_iAccessor);
      const gltfAccessor: GLTF.Accessor = this.#gltf.accessors[_iAccessor];

      if (gltfAccessor.type == GLTF.ACCESSOR_TYPE.VEC3) {
        const rgbaArray: Float32Array = new Float32Array(array.length * 4 / 3);
        for (let iVec3: number = 0, iVec4: number = 0; iVec3 < array.length; iVec3 += 3, iVec4 += 4) {
          rgbaArray[iVec4] = array[iVec3];
          rgbaArray[iVec4 + 1] = array[iVec3 + 1];
          rgbaArray[iVec4 + 2] = array[iVec3 + 2];
          rgbaArray[iVec4 + 3] = 1;
        }
        return rgbaArray;
      }

      return array;
    }

    private async getBufferData(_iAccessor: number): Promise<TypedArray> {
      const gltfAccessor: GLTF.Accessor = this.#gltf.accessors[_iAccessor];
      if (!gltfAccessor)
        throw new Error(`${this}: Couldn't find accessor with index ${_iAccessor}.`);

      let array: TypedArray;
      const componentType: GLTF.COMPONENT_TYPE = gltfAccessor.componentType;
      const accessorType: GLTF.ACCESSOR_TYPE = gltfAccessor.type;

      if (gltfAccessor.bufferView != undefined)
        array = await this.getBufferViewData(this.#gltf.bufferViews[gltfAccessor.bufferView], gltfAccessor.byteOffset, componentType, accessorType);

      if (gltfAccessor.sparse) {
        const gltfBufferViewIndices: GLTF.BufferView = this.#gltf.bufferViews[gltfAccessor.sparse.indices.bufferView];
        const gltfBufferViewValues: GLTF.BufferView = this.#gltf.bufferViews[gltfAccessor.sparse.values.bufferView];

        if (!gltfBufferViewIndices || !gltfBufferViewValues)
          throw new Error(`${this}: Couldn't find buffer views for sparse indices or values of accessor with index ${_iAccessor}.`);

        const arrayIndices: TypedArray = await this.getBufferViewData(gltfBufferViewIndices, gltfAccessor.sparse.indices.byteOffset, gltfAccessor.sparse.indices.componentType, GLTF.ACCESSOR_TYPE.SCALAR);
        const arrayValues: TypedArray = await this.getBufferViewData(gltfBufferViewValues, gltfAccessor.sparse.values.byteOffset, componentType, accessorType);

        const accessorTypeLength: number = toAccessorTypeLength[gltfAccessor.type];
        if (gltfAccessor.bufferView == undefined)
          array = new toArrayConstructor[gltfAccessor.componentType](gltfAccessor.count * accessorTypeLength);

        for (let i: number = 0; i < gltfAccessor.sparse.count; i++) {
          array.set(arrayValues.slice(i * accessorTypeLength, (i + 1) * accessorTypeLength), arrayIndices[i] * accessorTypeLength);
        }
      }

      return array;
    }

    private async getBufferViewData(_bufferView: GLTF.BufferView, _byteOffset: number, _componentType: GLTF.COMPONENT_TYPE, _accessorType: GLTF.ACCESSOR_TYPE): Promise<TypedArray> {
      const buffer: ArrayBuffer = await this.getBuffer(_bufferView.buffer);
      const byteOffset: number = (_bufferView.byteOffset ?? 0) + (_byteOffset ?? 0);
      const byteLength: number = _bufferView.byteLength ?? 0;
      const byteStride: number = _bufferView.byteStride;

      const arrayConstructor: TypedArrayConstructor = toArrayConstructor[_componentType];
      //@ts-ignore because the TypedArrayConstructor type is not assignable to the TypedArray type
      const array: TypedArray = new arrayConstructor(buffer, byteOffset, byteLength / arrayConstructor.BYTES_PER_ELEMENT);

      if (byteStride != undefined) {
        // TODO: instead of creating new buffers maybe rather pass stride into the render mesh? and set it when data is passed to the gpu?
        const nComponentsPerElement: number = toAccessorTypeLength[_accessorType]; // amount of components per element of the accessor type, e.g. 3 for VEC3
        const nElements: number = byteLength / byteStride; // amount of elements, e.g. n*VEC3 
        const stride: number = byteStride / arrayConstructor.BYTES_PER_ELEMENT;
        const newArray: TypedArray = new arrayConstructor(nElements * nComponentsPerElement);
        for (let iNewElement: number = 0; iNewElement < nElements; iNewElement++) {
          const iElement: number = iNewElement * stride;
          // TODO: check if loop is faster than set + slice
          for (let iComponent: number = 0; iComponent < nComponentsPerElement; iComponent++)
            newArray[iNewElement * nComponentsPerElement + iComponent] = array[iElement + iComponent];
          // newArray.set(array.slice(iElement, iElement + nComponentsPerElement), iNewElement * nComponentsPerElement);
        }

        return newArray;
      }

      return array;
    }

    private async getBuffer(_iBuffer: number): Promise<ArrayBuffer> {
      const gltfBuffer: GLTF.Buffer = this.#gltf.buffers[_iBuffer];
      if (!gltfBuffer)
        throw new Error(`${this}: Couldn't find buffer with index ${_iBuffer}.`);

      if (!this.#buffers)
        this.#buffers = [];
      if (!this.#buffers[_iBuffer]) {
        const response: Response = await fetch(new URL(gltfBuffer.uri, new URL(this.#url, Project.baseURL)));
        this.#buffers[_iBuffer] = await response.arrayBuffer();
      }

      return this.#buffers[_iBuffer];
    }

    private async getAnimationSequence(_sampler: GLTF.AnimationSampler, _transformationType: GLTF.AnimationChannelTarget["path"]): Promise<AnimationSequence<Quaternion | Vector3>> {
      const input: Float32Array = await this.getFloat32Array(_sampler.input);
      const output: Float32Array = await this.getFloat32Array(_sampler.output);

      const millisPerSecond: number = 1000;
      const isRotation: boolean = _transformationType == "rotation";
      const vectorLength: number = isRotation ? 4 : 3; // rotation is stored as quaternion
      const propertyType: typeof Vector3 | typeof Quaternion = isRotation ? Quaternion : Vector3;
      const interpolation: ANIMATION_INTERPOLATION = this.toInternInterpolation(_sampler.interpolation);
      const isCubic: boolean = interpolation == ANIMATION_INTERPOLATION.CUBIC;
      const vectorsPerInput: number = isCubic ? 3 : 1; // cubic interpolation uses 3 values per input: in-tangent, property value and out-tangent. https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#interpolation-cubic
      const sequence: AnimationKey<Quaternion | Vector3>[] = [];

      for (let iInput: number = 0; iInput < input.length; iInput++) {
        const iOutput: number = iInput * vectorsPerInput * vectorLength + (isCubic ? vectorLength : 0);
        const iOutputInTangent: number = iOutput - vectorLength;
        const iOutputOutTangent: number = iOutput + vectorLength;
        const time: number = millisPerSecond * input[iInput];

        let value: Vector3 | Quaternion = new propertyType(output[iOutput + 0], output[iOutput + 1], output[iOutput + 2], output[iOutput + 3]);
        let slopeIn: Vector3 | Quaternion;
        let slopeOut: Vector3 | Quaternion;

        if (isCubic) {
          slopeIn = new propertyType(output[iOutputInTangent + 0], output[iOutputInTangent + 1], output[iOutputInTangent + 2], output[iOutputInTangent + 3]);
          slopeOut = new propertyType(output[iOutputOutTangent + 0], output[iOutputOutTangent + 1], output[iOutputOutTangent + 2], output[iOutputOutTangent + 3]);
        }

        sequence.push(new AnimationKey(time, value, interpolation, slopeIn, slopeOut));
      }

      return new AnimationSequence(sequence, isRotation ? Quaternion : Vector3);
    }

    private toInternInterpolation(_interpolation: GLTF.AnimationSampler["interpolation"]): ANIMATION_INTERPOLATION {
      switch (_interpolation) {
        case "LINEAR":
          return ANIMATION_INTERPOLATION.LINEAR;
        case "STEP":
          return ANIMATION_INTERPOLATION.CONSTANT;
        case "CUBICSPLINE":
          return ANIMATION_INTERPOLATION.CUBIC;
        default:
          if (_interpolation != undefined)
            Debug.warn(`${this}: Unknown interpolation type ${_interpolation}.`);
          return ANIMATION_INTERPOLATION.LINEAR;
      }
    }
  }

  function getWebGLParameterName(_value: number): string {
    return Object.keys(WebGL2RenderingContext).find(_key => Reflect.get(WebGL2RenderingContext, _key) == _value);
  }

  type TypedArray = Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Float32Array;
  type TypedArrayConstructor = Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor | Int8ArrayConstructor | Int16ArrayConstructor | Float32ArrayConstructor;

  const toInternTransformation: Record<Exclude<GLTF.AnimationChannelTarget["path"], "weights">, "translation" | "rotation" | "scaling"> = {
    "translation": "translation",
    "rotation": "rotation",
    "scale": "scaling"
  };

  const toInternTransformationNew: Record<Exclude<GLTF.AnimationChannelTarget["path"], "weights">, "translation" | "quaternion" | "scaling"> = {
    "translation": "translation",
    "rotation": "quaternion",
    "scale": "scaling"
  };


  // number of components defined by 'type'
  const toAccessorTypeLength: Record<GLTF.ACCESSOR_TYPE, number> = {
    "SCALAR": 1,
    "VEC2": 2,
    "VEC3": 3,
    "VEC4": 4,
    "MAT2": 4,
    "MAT3": 9,
    "MAT4": 16
  };

  const toArrayConstructor: Record<GLTF.COMPONENT_TYPE, TypedArrayConstructor> = {
    [GLTF.COMPONENT_TYPE.UNSIGNED_BYTE]: Uint8Array,
    [GLTF.COMPONENT_TYPE.BYTE]: Int8Array,
    [GLTF.COMPONENT_TYPE.UNSIGNED_SHORT]: Uint16Array,
    [GLTF.COMPONENT_TYPE.SHORT]: Int16Array,
    [GLTF.COMPONENT_TYPE.UNSIGNED_INT]: Uint32Array,
    [GLTF.COMPONENT_TYPE.FLOAT]: Float32Array
  };
}