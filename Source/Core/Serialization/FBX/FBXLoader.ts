namespace FudgeCore {
  // TODO: remove this and replace it with a more generic approach
  interface AnimationSequenceVector3 extends AnimationStructure {
    x?: AnimationSequence<number>;
    y?: AnimationSequence<number>;
    z?: AnimationSequence<number>;
  }

  interface AnimationSequenceVector4 extends AnimationStructure {
    x?: AnimationSequence<number>;
    y?: AnimationSequence<number>;
    z?: AnimationSequence<number>;
    w?: AnimationSequence<number>;
  }

  interface AnimationSequenceMatrix4x4 extends AnimationStructure {
    rotation?: AnimationSequenceVector3 | AnimationSequenceVector4;
    scale?: AnimationSequenceVector3;
    translation?: AnimationSequenceVector3;
  }

  /**
   * Asset loader for Filmbox files.
   * @author Matthias Roming, HFU, 2023
   */
  export class FBXLoader {
    private static loaders: { [uri: string]: FBXLoader };

    static #defaultMaterial: Material;
    static #defaultSkinMaterial: Material;

    public readonly fbx: FBX.FBX;
    public readonly nodes: FBX.Node[];
    public readonly uri: string;

    #scenes: Graph[];
    #nodes: Node[];
    #meshes: MeshFBX[];
    #materials: Material[];
    #skinMaterials: Material[] = [];
    #textures: Texture[];
    #skeletons: ComponentSkeleton[];
    #animations: Animation[];

    public constructor(_buffer: ArrayBuffer, _uri: string) {
      this.uri = _uri;
      this.nodes = FBX.parseNodesFromBinary(_buffer);
      Debug.log(this.nodes);
      this.fbx = FBX.loadFromNodes(this.nodes);
      Debug.log(this.fbx);
    }

    private static get defaultMaterial(): Material {
      return this.#defaultMaterial || (this.#defaultMaterial =
        new Material("FBXDefaultMaterial", ShaderGouraud, new CoatRemissive(Color.CSS("white")))
      );
    }

    private static get defaultSkinMaterial(): Material {
      return this.#defaultSkinMaterial || (this.#defaultSkinMaterial =
        new Material("FBXDefaultSkinMaterial", ShaderGouraudSkin, new CoatRemissive(Color.CSS("white")))
      );
    }

    public static async LOAD(_uri: string): Promise<FBXLoader> {
      if (!this.loaders)
        this.loaders = {};
      if (!this.loaders[_uri]) {
        const response: Response = await fetch(_uri);
        const binary: ArrayBuffer = await response.arrayBuffer();
        this.loaders[_uri] = new FBXLoader(binary, _uri);
      }
      return this.loaders[_uri];
    }

    public async getScene(_index: number = 0): Promise<Graph> {
      if (!this.#scenes)
        this.#scenes = [];
      if (!this.#scenes[_index]) {
        const documentFBX: FBX.Document = this.fbx.documents[_index].load();
        const scene: Graph = new Graph(documentFBX.name);
        for (const childFBX of documentFBX.children) {
          if (childFBX.type == "Model") {
            scene.addChild(await this.getNode(this.fbx.objects.models.indexOf(childFBX)));
          }
        }

        if (this.fbx.objects.animStacks && this.fbx.objects.animStacks.length > 0) {
          const animation: Animation = await this.getAnimation(documentFBX.ActiveAnimStackName.length > 0 ?
            this.fbx.objects.animStacks.findIndex(_animStack => _animStack.name == documentFBX.ActiveAnimStackName) : 0);
          if (animation)
            scene.addComponent(new ComponentAnimation(animation));
        }

        for (const skeleton of this.#skeletons)
          scene.addComponent(skeleton);

        Project.register(scene);
        this.#scenes[_index] = scene;
      }
      return this.#scenes[_index];
    }

    public async getNode(_index: number): Promise<Node> {
      if (!this.#nodes)
        this.#nodes = [];
      if (!this.#nodes[_index]) {
        // create node with transform
        const modelFBX: FBX.Model = this.fbx.objects.models[_index].load();
        const node: Node = new Node(modelFBX.name);
        await this.generateTransform(modelFBX, node);
        this.#nodes[_index] = node;

        // attach children and components
        if (modelFBX.children) for (const childFBX of modelFBX.children) {
          if (childFBX.type == "Model") {
            node.addChild(await this.getNode(this.fbx.objects.models.indexOf(childFBX)));
          } else if (childFBX.type == "Geometry") {
            const mesh: MeshFBX = await this.getMesh(this.fbx.objects.geometries.indexOf(childFBX));
            const cmpMesh: ComponentMesh = new ComponentMesh(mesh);
            node.addComponent(new ComponentMaterial(FBXLoader.defaultMaterial));
            if (mesh.renderMesh.bones) {
              cmpMesh.skeleton = await this.getSkeleton(childFBX.children[0].children[0].children[0]);
              // for (const subDeformerFBX of childFBX.children[0].children as FBX.SubDeformer[]) {
              //   const bone: Node = cmpMesh.skeleton.bones[subDeformerFBX.children[0].name];
              //   bone.mtxLocal.set(subDeformerFBX.TransformLink);
              //   if (bone.getParent())
              //     bone.mtxLocal.multiply(bone.getParent().mtxWorldInverse);
              // }
              node.getComponent(ComponentMaterial).material = FBXLoader.defaultSkinMaterial;
            }
            node.addComponent(cmpMesh);
          } else if (childFBX.type == "Material") {
            // TODO: additional skin materials get created here, check if the original material is still needed
            const iMaterial: number = this.fbx.objects.materials.indexOf(childFBX);
            const material: Material = await this.getMaterial(iMaterial);
            node.getComponent(ComponentMaterial).material = node.getComponent(ComponentMesh).mesh.renderMesh.bones ?
              this.#skinMaterials[iMaterial] || (this.#skinMaterials[iMaterial] = new Material(
                material.name,
                material.getShader() == ShaderPhong ?
                  ShaderPhongSkin :
                  ShaderPhongTexturedSkin,
                material.coat
              )) :
              material;
          }
        }
      }
      return this.#nodes[_index];
    }

    public async getMesh(_index: number): Promise<MeshFBX> {
      if (!this.#meshes)
        this.#meshes = [];
      if (!this.#meshes[_index])
        this.#meshes[_index] = await new MeshFBX().load(this.uri, _index);
      return this.#meshes[_index];
    }

    public async getMaterial(_index: number): Promise<Material> {
      if (!this.#materials)
        this.#materials = [];
      if (!this.#materials[_index]) {
        const materialFBX: FBX.Material = this.fbx.objects.materials[_index].load();
        if (!(materialFBX.DiffuseColor instanceof Vector3))
          materialFBX.DiffuseColor?.children[0].load();
        // FBX supports lambert and phong shading, either way fudge has no lambert shader so we always use phong.
        // In DiffuseColor the texture of the material color is stored, if it's defined we use a texture shader.
        // TODO: materialFBX also contains additional values like shininess and reflectivity (and others) which are not suppported.
        this.#materials[_index] = new Material(
          materialFBX.name,
          materialFBX.DiffuseColor && !(materialFBX.DiffuseColor instanceof Vector3) ?
            ShaderPhongTextured :
            ShaderPhong,
          materialFBX.DiffuseColor && !(materialFBX.DiffuseColor instanceof Vector3) ?
            new CoatRemissiveTextured(
              new Color(...materialFBX.Diffuse.toArray([])),
              await this.getTexture(this.fbx.objects.textures.indexOf(materialFBX.DiffuseColor)),
              materialFBX.DiffuseFactor ?? 1,
              materialFBX.SpecularFactor ?? average(materialFBX.Specular?.toArray(new Float32Array(3))) ?? 0
            ) :
            new CoatRemissive(
              new Color(...(materialFBX.DiffuseColor as Vector3 ?? materialFBX.Diffuse).toArray(new Float32Array(3))),
              materialFBX.DiffuseFactor ?? 1,
              materialFBX.SpecularFactor ?? average(materialFBX.Specular?.toArray(new Float32Array(3))) ?? 0
            )
        );
      }
      return this.#materials[_index];

      function average(_array: Float32Array): number { // TODO: specular factor vector (together with specular color texture) is not supported so we use the average of the vector to approximate a singular specular factor.
        if (_array)
          return _array.reduce((_a, _b) => _a + _b) / _array.length;
        else
          return undefined;
      }
    }

    public async getTexture(_index: number): Promise<Texture> {
      return new Promise((_resolve, _reject) => {
        if (!this.#textures)
          this.#textures = [];
        if (this.#textures[_index])
          return _resolve(this.#textures[_index]);

        const videoFBX: FBX.Video = this.fbx.objects.textures[_index].children[0];
        const texture: TextureImage = new TextureImage();
        texture.image = new Image();
        texture.image.onload = () => _resolve(texture);
        texture.image.onerror = _reject;
        texture.image.src = URL.createObjectURL(new Blob([videoFBX.Content], { type: "image/png" }));
        this.#textures[_index] = texture;
        // TODO: get and set mipmap information ???
      });
    }

    // Problem: mehrere Deformer verweisen auf das selbe Skelett aber nutzen dabei nicht immer alle Knochen
    // => Problem besteht auch im GLTFLoader
    /**
     * Retriefs the skeleton containing the given limb node.
     */
    public async getSkeleton(_fbxLimbNode: FBX.Model): Promise<ComponentSkeleton> {
      if (!this.#skeletons)
        this.#skeletons = [];
      return this.#skeletons.find(_skeleton => _fbxLimbNode.name in _skeleton.bones) || await (async () => {
        const skeleton: ComponentSkeleton = new ComponentSkeleton(); // new Skeleton(`Skeleton${this.#skeletons.length}`);
        let rootNode: FBX.Model = _fbxLimbNode;
        while (rootNode.parents && rootNode.parents.some(_parent => _parent.subtype == "LimbNode"))
          rootNode = rootNode.parents.find(_parent => _parent.subtype == "LimbNode");
        const iRootNode: number = this.fbx.objects.models.findIndex(_model => _model.name == rootNode.name);

        for (const node of await this.getNode(iRootNode)) {
          // TODO: maybe move this into the component, as this is probably needed in gltf import aswell
          if (this.fbx.objects.models[this.#nodes.indexOf(node)].subtype == "LimbNode") {
            const parent: Node = node.getParent();
            if (parent)
              node.mtxWorld.copy(
                node.cmpTransform ?
                  Matrix4x4.PRODUCT(parent.mtxWorld, node.mtxLocal) :
                  parent.mtxWorld
              );
            node.mtxWorldInverse.copy(Matrix4x4.INVERSE(node.mtxWorld));
            skeleton.addBone(node);
          }
        }

        this.#skeletons.push(skeleton);
        return skeleton;
      })();
    }

    public async getAnimation(_index: number): Promise<Animation> {
      if (!this.#animations)
        this.#animations = [];
      if (!this.#animations[_index]) {
        const animStack: FBX.Object = this.fbx.objects.animStacks[_index];
        const animNodesFBX: FBX.AnimCurveNode[] = animStack.children[0].children;

        let fbxAnimNodeGrouped: Map<FBX.Model, FBX.AnimCurveNode[]> = new Map();
        for (const fbxAnimNode of animNodesFBX) {
          const key: FBX.Model = fbxAnimNode.parents.find(_parent => _parent.type == "Model");
          if (key == undefined)
            continue;
          if (!fbxAnimNodeGrouped.has(key))
            fbxAnimNodeGrouped.set(key, []);
          fbxAnimNodeGrouped.get(key).push(fbxAnimNode);
        }

        const animationStructure: AnimationStructure = {};

        for (const [fbxModel, fbxAnimNodes] of fbxAnimNodeGrouped) {
          let currentStructure: AnimationStructure = animationStructure;

          let parent: FBX.Model = fbxModel.parents.find(_parent => _parent.type == "Model");
          let path: FBX.Model[] = [];
          path.push(fbxModel);
          while (parent != undefined) {
            path.push(parent);
            parent = parent.parents.find(_parent => _parent.type == "Model");
          }

          for (const fbxPathModel of path.reverse()) {
            if (currentStructure.children == undefined)
              currentStructure.children = {};

            if ((currentStructure.children as AnimationStructure)[fbxPathModel.name] == undefined)
              (currentStructure.children as AnimationStructure)[fbxPathModel.name] = {};
            currentStructure = (currentStructure.children as AnimationStructure)[fbxPathModel.name] as AnimationStructure;

            if (fbxPathModel == fbxModel) {
              const mtxLocal: AnimationSequenceMatrix4x4 = {};
              for (const fbxAnimNode of fbxAnimNodes)
                mtxLocal[{
                  T: "translation",
                  R: "rotation",
                  S: "scale"
                }[fbxAnimNode.name]] = this.getAnimationVector3(fbxAnimNode, fbxPathModel);
              currentStructure.components = {
                ComponentTransform: [
                  { mtxLocal: mtxLocal }
                ]
              };
            }
          }
        }

        this.#animations[_index] = new Animation(animStack.name, animationStructure);
      }
      return this.#animations[_index];
    }

    /**
     * fetched from three.js, adapted to FUDGE and optimized
     * https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/FBXLoader.js
     * line 3950
     */
    private async generateTransform(_modelFBX: FBX.Model, _node: Node): Promise<void> {
      const parentIndex: number = this.fbx.objects.models.indexOf(_modelFBX.parents.find(_parent => _parent.type == "Model"));
      const parent: Node = parentIndex >= 0 ? await this.getNode(parentIndex) : undefined;

      const mtxLocalRotation: Matrix4x4 = _modelFBX.PreRotation || _modelFBX.LclRotation || _modelFBX.PostRotation ?
        Matrix4x4.IDENTITY() :
        undefined;
      if (_modelFBX.PreRotation) {
        mtxLocalRotation.rotate(this.getOrdered(_modelFBX.PreRotation, _modelFBX));
      }
      if (_modelFBX.LclRotation) {
        mtxLocalRotation.rotate(this.getOrdered(this.getTransformVector(_modelFBX.LclRotation, Vector3.ZERO), _modelFBX));
      }
      if (_modelFBX.PostRotation) {
        let mtxPostRotationInverse: Matrix4x4 = Matrix4x4.ROTATION(this.getOrdered(_modelFBX.PostRotation, _modelFBX));
        mtxPostRotationInverse = Matrix4x4.INVERSE(mtxPostRotationInverse);
        mtxLocalRotation.multiply(mtxPostRotationInverse);
      }

      const mtxLocalScaling: Matrix4x4 = _modelFBX.LclScaling ?
        Matrix4x4.SCALING(this.getTransformVector(_modelFBX.LclScaling, Vector3.ONE)) :
        undefined;

      const mtxParentWorldRotation: Matrix4x4 = parent ? Matrix4x4.ROTATION(parent.mtxWorld.rotation) : undefined;

      const mtxParentWorldScale: Matrix4x4 = parent ? (() => {
        const mtxParentWorldScale: Matrix4x4 = Matrix4x4.INVERSE(mtxParentWorldRotation);
        mtxParentWorldScale.translate(Vector3.SCALE(parent.mtxWorld.translation, -1));
        mtxParentWorldScale.multiply(parent.mtxWorld);
        return mtxParentWorldScale;
      })() : undefined;

      const mtxWorldRotationScale: Matrix4x4 = parent || mtxLocalRotation || mtxLocalScaling ? Matrix4x4.IDENTITY() : undefined;
      if (parent || mtxLocalRotation || mtxLocalScaling) {
        const inheritType: number = _modelFBX.InheritType || 0;
        if (inheritType == 0) {
          if (parent)
            mtxWorldRotationScale.multiply(mtxParentWorldRotation);
          if (mtxLocalRotation)
            mtxWorldRotationScale.multiply(mtxLocalRotation);
          if (parent)
            mtxWorldRotationScale.multiply(mtxParentWorldScale);
          if (mtxLocalScaling)
            mtxWorldRotationScale.multiply(mtxLocalScaling);
        } else if (inheritType == 1) {
          if (parent) {
            mtxWorldRotationScale.multiply(mtxParentWorldRotation);
            mtxWorldRotationScale.multiply(mtxParentWorldScale);
          }
          if (mtxLocalRotation)
            mtxWorldRotationScale.multiply(mtxLocalRotation);
          if (mtxLocalScaling)
            mtxWorldRotationScale.multiply(mtxLocalScaling);
        } else {
          if (parent)
            mtxWorldRotationScale.multiply(mtxParentWorldRotation);
          if (mtxLocalRotation)
            mtxWorldRotationScale.multiply(mtxLocalRotation);
          if (parent) {
            mtxWorldRotationScale.multiply(mtxParentWorldScale);
            let mtxParentLocalScalingInverse: Matrix4x4 = Matrix4x4.SCALING(parent.mtxLocal.scaling);
            mtxParentLocalScalingInverse = Matrix4x4.INVERSE(mtxParentLocalScalingInverse);
            mtxWorldRotationScale.multiply(mtxParentLocalScalingInverse);
          }
          if (mtxLocalScaling)
            mtxWorldRotationScale.multiply(mtxLocalScaling);
        }
      }

      // Calculate the local transform matrix
      let translation: Vector3;
      translation = Vector3.ZERO();
      if (_modelFBX.LclTranslation)
        translation.add(this.getTransformVector(_modelFBX.LclTranslation, Vector3.ZERO));
      if (_modelFBX.RotationOffset)
        translation.add(_modelFBX.RotationOffset);
      if (_modelFBX.RotationPivot)
        translation.add(_modelFBX.RotationPivot);

      const mtxTransform: Matrix4x4 = Matrix4x4.TRANSLATION(translation);
      if (mtxLocalRotation)
        mtxTransform.multiply(mtxLocalRotation);

      translation = Vector3.ZERO();
      if (_modelFBX.RotationPivot)
        translation.subtract(_modelFBX.RotationPivot);
      if (_modelFBX.ScalingOffset)
        translation.add(_modelFBX.ScalingOffset);
      if (_modelFBX.ScalingPivot)
        translation.add(_modelFBX.ScalingPivot);
      mtxTransform.translate(translation);

      if (mtxLocalScaling)
        mtxTransform.multiply(mtxLocalScaling);
      if (_modelFBX.ScalingPivot)
        mtxTransform.translate(Vector3.SCALE(_modelFBX.ScalingPivot, -1));

      const mtxWorldTranslation: Matrix4x4 = parent ?
        Matrix4x4.TRANSLATION(Matrix4x4.PRODUCT(
          parent.mtxWorld,
          Matrix4x4.TRANSLATION(mtxTransform.translation)
        ).translation) :
        Matrix4x4.TRANSLATION(mtxTransform.translation);

      mtxTransform.copy(mtxWorldTranslation);
      mtxTransform.multiply(mtxWorldRotationScale);
      _node.mtxWorld.copy(mtxTransform);

      if (parent)
        mtxTransform.multiply(Matrix4x4.INVERSE(parent.mtxWorld), true);
      _node.addComponent(new ComponentTransform(mtxTransform));
    }

    private getTransformVector(_vector: Vector3 | FBX.AnimCurveNode, _default: () => Vector3): Vector3 {
      return (
        _vector == undefined ?
          _default() :
          _vector instanceof Vector3 ?
            _vector :
            new Vector3(
              typeof (_vector = _vector.load()).dX == "number" ?
                _vector.dX :
                (_vector.dX.load() as FBX.AnimCurve).Default,
              typeof _vector.dY == "number" ?
                _vector.dY :
                (_vector.dY.load() as FBX.AnimCurve).Default,
              typeof _vector.dZ == "number" ?
                _vector.dZ :
                (_vector.dZ.load() as FBX.AnimCurve).Default
            )
      );
    }

    private getAnimationVector3(_animNode: FBX.AnimCurveNode, _target: FBX.Model): AnimationSequenceVector3 {
      const vectorSequence: AnimationSequenceVector3 = {};
      for (const valueName in _animNode) if (valueName == "dX" || valueName == "dY" || valueName == "dZ") {
        const value: FBX.AnimCurve | number = _animNode[valueName];
        if (typeof value != "number") {
          const sequence: AnimationSequence = new AnimationSequence<number>([], Number);
          for (let i: number = 0; i < value.KeyTime.length; ++i) {
            // According to the reference time is defined as a signed int64, unit being 1/46186158000 seconds
            // ref: https://archive.blender.org/wiki/index.php/User:Mont29/Foundation/FBX_File_Structure/#Some_Specific_Property_Types
            sequence.addKey(new AnimationKey(
              Number((value.KeyTime[i] - value.KeyTime.reduce((_min, _v) => _v < _min ? _v : _min)) / BigInt("46186158")),
              value.KeyValueFloat[i]
            ));
          }
          vectorSequence[valueName[1].toLowerCase()] = sequence;
        }
      }

      if (_animNode.name == "R" && (_target.PreRotation || _target.PostRotation)) {
        let preRototation: Matrix4x4;
        if (_target.PreRotation)
          preRototation = Matrix4x4.ROTATION(_target.PreRotation);
        let postRotation: Matrix4x4;
        if (_target.PostRotation)
          postRotation = Matrix4x4.ROTATION(_target.PostRotation);

        [vectorSequence.x, vectorSequence.y, vectorSequence.z]
          .flatMap(_seq => _seq?.getKeys())
          .map(_key => _key?.time)
          .sort((_timeA, _timeB) => _timeA - _timeB) // sort times
          .filter((_time, _index, _times) => _time != _times[_index + 1]) // remove duplicates
          .map(_time => { // find keys for all axes at time
            return { x: findKey(vectorSequence.x), y: findKey(vectorSequence.y), z: findKey(vectorSequence.z) };
            function findKey(_sequence: AnimationSequence<number>): AnimationKey<number> {
              return _sequence?.getKeys().find(_key => _key.time == _time);
            }
          })
          .forEach(_frame => {
            let vctEulerAngles: Vector3 = Recycler.get(Vector3);
            vctEulerAngles.set(
              _frame.x?.value ?? 0,
              _frame.y?.value ?? 0,
              _frame.z?.value ?? 0
            );
            const mtxRotation: Matrix4x4 = Matrix4x4.ROTATION(vctEulerAngles);
            if (preRototation)
              mtxRotation.multiply(preRototation, true);
            if (postRotation)
              mtxRotation.multiply(postRotation);
            vctEulerAngles = mtxRotation.rotation;
            if (_frame.x)
              _frame.x.value = vctEulerAngles.x;
            if (_frame.y)
              _frame.y.value = vctEulerAngles.y;
            if (_frame.z)
              _frame.z.value = vctEulerAngles.z;
          });
      }

      return vectorSequence;
    }

    private getOrdered(_rotation: Vector3, _modelFBX: FBX.Model): Vector3 {
      if (!_modelFBX.EulerOrder)
        return _rotation;

      const data: Float32Array = _rotation.toArray(new Float32Array(3));
      const result: Vector3 = Recycler.get(Vector3);
      result.set(
        data[_modelFBX.EulerOrder.indexOf("Z")],
        data[_modelFBX.EulerOrder.indexOf("Y")],
        data[_modelFBX.EulerOrder.indexOf("X")]
      );
      return result;
    }

  }
}