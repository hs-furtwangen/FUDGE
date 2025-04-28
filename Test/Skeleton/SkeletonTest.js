var SkeletonTest;
(function (SkeletonTest) {
    var ƒ = FudgeCore;
    window.addEventListener("load", init);
    async function init() {
        const canvas = document.querySelector("canvas");
        // setup scene
        const scene = new ƒ.Node("Scene");
        const rotatorX = new ƒ.Node("RotatorX");
        rotatorX.addComponent(new ƒ.ComponentTransform());
        const rotatorY = new ƒ.Node("RotatorY");
        rotatorY.addComponent(new ƒ.ComponentTransform());
        const cylinder = await createAnimatedCylinder();
        console.log(cylinder);
        scene.addChild(rotatorX);
        rotatorX.addChild(rotatorY);
        rotatorY.addChild(cylinder);
        // setup camera
        const camera = new ƒ.Node("Camera");
        camera.addComponent(new ƒ.ComponentCamera());
        camera.addComponent(new ƒ.ComponentTransform());
        camera.getComponent(ƒ.ComponentCamera).clrBackground.setHex("4472C4FF");
        camera.mtxLocal.translateZ(10);
        camera.mtxLocal.lookAt(ƒ.Vector3.ZERO(), camera.mtxLocal.getY());
        scene.addChild(camera);
        // setup light
        const cmpLightDirectional = new ƒ.ComponentLight(ƒ.LIGHT_TYPE.DIRECTIONAL, new ƒ.Color(0.5, 0.5, 0.5));
        cmpLightDirectional.mtxPivot.rotateY(180);
        scene.addComponent(cmpLightDirectional);
        const cmpLightAmbient = new ƒ.ComponentLight(ƒ.LIGHT_TYPE.AMBIENT, new ƒ.Color(0.5, 0.5, 0.5));
        scene.addComponent(cmpLightAmbient);
        // setup viewport
        const viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", scene, camera.getComponent(ƒ.ComponentCamera), canvas);
        viewport.draw();
        console.log(viewport);
        // run loop
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, () => update(viewport, rotatorX.mtxLocal, rotatorY.mtxLocal, cylinder.getComponent(ƒ.ComponentMaterial).material));
        ƒ.Loop.start();
    }
    class MeshSkinCylinder extends ƒ.Mesh {
        static #skeleton;
        constructor() {
            super();
            const meshSource = new ƒ.MeshRotation("MeshRotation", [
                new ƒ.Vector2(0, 4),
                new ƒ.Vector2(1, 4),
                new ƒ.Vector2(1, 3),
                new ƒ.Vector2(1, 2),
                new ƒ.Vector2(1, 1),
                new ƒ.Vector2(1, 0),
                new ƒ.Vector2(0, 0)
            ], 6);
            this.vertices = Reflect.get(meshSource, "vertices");
            this.faces = Reflect.get(meshSource, "faces");
            for (let vertex of this.vertices.originals) {
                let cmpSkeleton = MeshSkinCylinder.skeleton.getComponent(ƒ.ComponentSkeleton);
                vertex.bones = [
                    { index: cmpSkeleton.indexOf("LowerBone"), weight: 1 - vertex.position.y / 4 },
                    { index: cmpSkeleton.indexOf("UpperBone"), weight: vertex.position.y / 4 },
                    { index: 0, weight: 0 },
                    { index: 0, weight: 0 }
                ];
            }
        }
        static get skeleton() {
            if (!this.#skeleton) {
                // setup skeleton with a skeleton transform test
                this.#skeleton = new ƒ.Node("SkeletonCylinder");
                this.#skeleton.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(2))));
                let upperBone = new ƒ.Node("UpperBone");
                upperBone.addComponent(new ƒ.ComponentTransform());
                let lowerBone = new ƒ.Node("LowerBone");
                lowerBone.addComponent(new ƒ.ComponentTransform());
                this.#skeleton.addChild(lowerBone);
                lowerBone.addChild(upperBone);
                let cmpSkeleton = new ƒ.ComponentSkeleton();
                cmpSkeleton.addBone(lowerBone, ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0)));
                cmpSkeleton.addBone(upperBone, ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(-1)));
                this.#skeleton.addComponent(cmpSkeleton);
            }
            return this.#skeleton;
        }
    }
    async function createAnimatedCylinder() {
        const cylinder = new ƒ.Node("CylinderAnimated");
        // skeleton serialization test
        const serialization = ƒ.Serializer.serialize(MeshSkinCylinder.skeleton);
        console.log(serialization);
        const skeleton = await ƒ.Serializer.deserialize(serialization);
        // const skeletonInstance: ƒ.SkeletonInstance = await ƒ.SkeletonInstance.CREATE(skeleton);
        // setup skeleton animator
        const sequenceRotation = new ƒ.AnimationSequence([new ƒ.AnimationKey(0, 0), new ƒ.AnimationKey(1000, 90), new ƒ.AnimationKey(2000, 0)], Number);
        const sequenceScaling = new ƒ.AnimationSequence([new ƒ.AnimationKey(0, 1), new ƒ.AnimationKey(1000, 1.25), new ƒ.AnimationKey(2000, 1)], Number);
        const sequenceTranslation = new ƒ.AnimationSequence([new ƒ.AnimationKey(0, -0.5), new ƒ.AnimationKey(1000, 0.5), new ƒ.AnimationKey(2000, -0.5)], Number);
        const animation = new ƒ.Animation("AnimationSkeletonCylinder", {
            children: {
                LowerBone: {
                    components: {
                        ComponentTransform: {
                            0: {
                                mtxLocal: {
                                    scaling: {
                                        x: sequenceScaling,
                                        y: sequenceScaling,
                                        z: sequenceScaling
                                    },
                                    translation: {
                                        y: sequenceTranslation
                                    }
                                }
                            }
                        }
                    },
                    children: {
                        UpperBone: {
                            components: {
                                ComponentTransform: {
                                    0: {
                                        mtxLocal: {
                                            rotation: {
                                                z: sequenceRotation
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            // mtxBoneLocals: {
            //   UpperBone: {
            //     rotation: {
            //       z: sequenceRotation
            //     }
            //   }
            // },
            // bones: {
            //   LowerBone: {
            //     components: {
            //       ComponentTransform: [
            //         {
            //           mtxLocal: {
            //             scaling: {
            //               x: sequenceScaling,
            //               y: sequenceScaling,
            //               z: sequenceScaling
            //             },
            //             translation: {
            //               y: sequenceTranslation
            //             }
            //           }
            //         }
            //       ]
            //     }
            //   }
            // }
        });
        const cmpAnimation = new ƒ.ComponentAnimation(animation, ƒ.ANIMATION_PLAYMODE.LOOP);
        skeleton.addComponent(cmpAnimation);
        cmpAnimation.activate(true);
        cylinder.addChild(skeleton);
        // setup component mesh
        const mesh = new MeshSkinCylinder();
        const cmpMesh = new ƒ.ComponentMesh(mesh);
        cmpMesh.mtxPivot.translateY(-2);
        cmpMesh.skeleton = skeleton.getComponent(ƒ.ComponentSkeleton);
        cylinder.addComponent(cmpMesh);
        // setup component material 
        const material = new ƒ.Material("MaterialCylinder", ƒ.ShaderFlatSkin, new ƒ.CoatRemissive(ƒ.Color.CSS("White")));
        const cmpMaterial = new ƒ.ComponentMaterial(material);
        cylinder.addComponent(cmpMaterial);
        return cylinder;
    }
    function update(_viewport, _mtxRotatorX, _mtxRotatorY, _material) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            _mtxRotatorY.rotateY(3);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP]))
            _mtxRotatorX.rotateX(-3);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT]))
            _mtxRotatorY.rotateY(-3);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN]))
            _mtxRotatorX.rotateX(3);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            _mtxRotatorX.copy(ƒ.Matrix4x4.IDENTITY());
            _mtxRotatorY.copy(ƒ.Matrix4x4.IDENTITY());
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.F]))
            _material.setShader(ƒ.ShaderFlatSkin);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.G]))
            _material.setShader(ƒ.ShaderGouraudSkin);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.H]))
            _material.setShader(ƒ.ShaderPhongSkin);
        _viewport.draw();
    }
})(SkeletonTest || (SkeletonTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2tlbGV0b25UZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2tlbGV0b25UZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsWUFBWSxDQTROckI7QUE1TkQsV0FBVSxZQUFZO0lBQ3BCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXRDLEtBQUssVUFBVSxJQUFJO1FBQ2pCLE1BQU0sTUFBTSxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRW5FLGNBQWM7UUFDZCxNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFMUMsTUFBTSxRQUFRLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1FBRWxELE1BQU0sUUFBUSxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRCxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztRQUVsRCxNQUFNLFFBQVEsR0FBVyxNQUFNLHNCQUFzQixFQUFFLENBQUM7UUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QixLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pCLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU1QixlQUFlO1FBQ2YsTUFBTSxNQUFNLEdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxD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