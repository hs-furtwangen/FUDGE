"use strict";
// / <reference path="../../Distribution/FudgeCore.d.ts"/>
var FudgeAid;
// / <reference path="../../Distribution/FudgeCore.d.ts"/>
(function (FudgeAid) {
    FudgeCore.Serializer.registerNamespace(FudgeAid);
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    /**
     * Abstract class supporting versious arithmetical helper functions
     */
    class Arith {
        /**
         * Returns one of the values passed in, either _value if within _min and _max or the boundary being exceeded by _value
         */
        static clamp(_value, _min, _max, _isSmaller = (_value1, _value2) => { return _value1 < _value2; }) {
            if (_isSmaller(_value, _min))
                return _min;
            if (_isSmaller(_max, _value))
                return _max;
            return _value;
        }
    }
    FudgeAid.Arith = Arith;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    /**
     * Within a given precision, an object of this class finds the parameter value at which a given function
     * switches its boolean return value using interval splitting (bisection).
     * Pass the type of the parameter and the type the precision is measured in.
     */
    class ArithBisection {
        /**
         * Creates a new Solver
         * @param _function A function that takes an argument of the generic type <Parameter> and returns a boolean value.
         * @param _divide A function splitting the interval to find a parameter for the next iteration, may simply be the arithmetic mean
         * @param _isSmaller A function that determines a difference between the borders of the current interval and compares this to the given precision
         */
        constructor(_function, _divide, _isSmaller) {
            this.function = _function;
            this.divide = _divide;
            this.isSmaller = _isSmaller;
        }
        /**
         * Finds a solution with the given precision in the given interval using the functions this Solver was constructed with.
         * After the method returns, find the data in this objects properties.
         * @param _left The parameter on one side of the interval.
         * @param _right The parameter on the other side, may be "smaller" than [[_left]].
         * @param _epsilon The desired precision of the solution.
         * @param _leftValue The value on the left side of the interval, omit if yet unknown or pass in if known for better performance.
         * @param _rightValue The value on the right side of the interval, omit if yet unknown or pass in if known for better performance.
         * @throws Error if both sides of the interval return the same value.
         */
        solve(_left, _right, _epsilon, _leftValue = undefined, _rightValue = undefined) {
            this.left = _left;
            this.leftValue = _leftValue || this.function(_left);
            this.right = _right;
            this.rightValue = _rightValue || this.function(_right);
            if (this.isSmaller(_left, _right, _epsilon))
                return;
            if (this.leftValue == this.rightValue)
                throw (new Error("Interval solver can't operate with identical function values on both sides of the interval"));
            let between = this.divide(_left, _right);
            let betweenValue = this.function(between);
            if (betweenValue == this.leftValue)
                this.solve(between, this.right, _epsilon, betweenValue, this.rightValue);
            else
                this.solve(this.left, between, _epsilon, this.leftValue, betweenValue);
        }
        toString() {
            let out = "";
            out += `left: ${this.left.toString()} -> ${this.leftValue}`;
            out += "\n";
            out += `right: ${this.right.toString()} -> ${this.rightValue}`;
            return out;
        }
    }
    FudgeAid.ArithBisection = ArithBisection;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class CameraOrbit extends ƒ.Node {
        constructor(_cmpCamera, _distanceStart = 2, _maxRotX = 75, _minDistance = 1, _maxDistance = 10) {
            super("CameraOrbit");
            this.axisRotateX = new ƒ.Axis("RotateX", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
            this.axisRotateY = new ƒ.Axis("RotateY", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
            this.axisDistance = new ƒ.Axis("Distance", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
            this.hndAxisOutput = (_event) => {
                let output = _event.detail.output;
                switch (_event.target.name) {
                    case "RotateX":
                        this.rotateX(output);
                        break;
                    case "RotateY":
                        this.rotateY(output);
                        break;
                    case "Distance":
                        this.distance += output;
                }
            };
            this.maxRotX = Math.min(_maxRotX, 89);
            this.minDistance = _minDistance;
            this.maxDistance = _maxDistance;
            let cmpTransform = new ƒ.ComponentTransform();
            this.addComponent(cmpTransform);
            this.rotatorX = new ƒ.Node("CameraRotationX");
            this.rotatorX.addComponent(new ƒ.ComponentTransform());
            this.addChild(this.rotatorX);
            this.translator = new ƒ.Node("CameraTranslate");
            this.translator.addComponent(new ƒ.ComponentTransform());
            this.translator.mtxLocal.rotateY(180);
            this.rotatorX.addChild(this.translator);
            this.translator.addComponent(_cmpCamera);
            this.distance = _distanceStart;
            this.axisRotateX.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, this.hndAxisOutput);
            this.axisRotateY.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, this.hndAxisOutput);
            this.axisDistance.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, this.hndAxisOutput);
        }
        get cmpCamera() {
            return this.translator.getComponent(ƒ.ComponentCamera);
        }
        get nodeCamera() {
            return this.translator;
        }
        set distance(_distance) {
            let newDistance = Math.min(this.maxDistance, Math.max(this.minDistance, _distance));
            this.translator.mtxLocal.translation = ƒ.Vector3.Z(newDistance);
        }
        get distance() {
            return this.translator.mtxLocal.translation.z;
        }
        set rotationY(_angle) {
            this.mtxLocal.rotation = ƒ.Vector3.Y(_angle);
        }
        get rotationY() {
            return this.mtxLocal.rotation.y;
        }
        set rotationX(_angle) {
            _angle = Math.min(Math.max(-this.maxRotX, _angle), this.maxRotX);
            this.rotatorX.mtxLocal.rotation = ƒ.Vector3.X(_angle);
        }
        get rotationX() {
            return this.rotatorX.mtxLocal.rotation.x;
        }
        rotateY(_delta) {
            this.mtxLocal.rotateY(_delta);
        }
        rotateX(_delta) {
            this.rotationX = this.rotatorX.mtxLocal.rotation.x + _delta;
        }
        // set position of camera component relative to the center of orbit
        positionCamera(_posWorld) {
            let difference = ƒ.Vector3.DIFFERENCE(_posWorld, this.mtxWorld.translation);
            let geo = difference.geo;
            this.rotationY = geo.longitude;
            this.rotationX = -geo.latitude;
            this.distance = geo.magnitude;
        }
    }
    FudgeAid.CameraOrbit = CameraOrbit;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class CameraOrbitMovingFocus extends FudgeAid.CameraOrbit {
        constructor(_cmpCamera, _distanceStart = 5, _maxRotX = 85, _minDistance = 0, _maxDistance = Infinity) {
            super(_cmpCamera, _distanceStart, _maxRotX, _minDistance, _maxDistance);
            this.axisTranslateX = new ƒ.Axis("TranslateX", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
            this.axisTranslateY = new ƒ.Axis("TranslateY", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
            this.axisTranslateZ = new ƒ.Axis("TranslateZ", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
            this.hndAxisOutput = (_event) => {
                let output = _event.detail.output;
                switch (_event.target.name) {
                    case "TranslateX":
                        this.translateX(output);
                        break;
                    case "TranslateY":
                        this.translateY(output);
                        break;
                    case "TranslateZ":
                        this.translateZ(output);
                }
            };
            this.name = "CameraOrbitMovingFocus";
            this.axisTranslateX.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, this.hndAxisOutput);
            this.axisTranslateY.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, this.hndAxisOutput);
            this.axisTranslateZ.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, this.hndAxisOutput);
        }
        translateX(_delta) {
            this.mtxLocal.translateX(_delta);
        }
        translateY(_delta) {
            let translation = this.rotatorX.mtxWorld.getY();
            translation.normalize(_delta);
            this.mtxLocal.translate(translation, false);
        }
        translateZ(_delta) {
            // this.mtxLocal.translateZ(_delta);
            let translation = this.rotatorX.mtxWorld.getZ();
            translation.normalize(_delta);
            this.mtxLocal.translate(translation, false);
        }
    }
    FudgeAid.CameraOrbitMovingFocus = CameraOrbitMovingFocus;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    let IMAGE_RENDERING;
    (function (IMAGE_RENDERING) {
        IMAGE_RENDERING["AUTO"] = "auto";
        IMAGE_RENDERING["SMOOTH"] = "smooth";
        IMAGE_RENDERING["HIGH_QUALITY"] = "high-quality";
        IMAGE_RENDERING["CRISP_EDGES"] = "crisp-edges";
        IMAGE_RENDERING["PIXELATED"] = "pixelated";
    })(IMAGE_RENDERING = FudgeAid.IMAGE_RENDERING || (FudgeAid.IMAGE_RENDERING = {}));
    /**
     * Adds comfort methods to create a render canvas
     */
    class Canvas {
        static create(_fillParent = true, _imageRendering = IMAGE_RENDERING.AUTO, _width = 800, _height = 600) {
            let canvas = document.createElement("canvas");
            canvas.id = "FUDGE";
            let style = canvas.style;
            style.imageRendering = _imageRendering;
            style.width = _width + "px";
            style.height = _height + "px";
            style.marginBottom = "-0.25em";
            if (_fillParent) {
                style.width = "100%";
                style.height = "100%";
            }
            return canvas;
        }
    }
    FudgeAid.Canvas = Canvas;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class Node extends ƒ.Node {
        static { this.count = 0; }
        constructor(_name = Node.getNextName(), _transform, _material, _mesh) {
            super(_name);
            if (_transform)
                this.addComponent(new ƒ.ComponentTransform(_transform));
            if (_material)
                this.addComponent(new ƒ.ComponentMaterial(_material));
            if (_mesh)
                this.addComponent(new ƒ.ComponentMesh(_mesh));
        }
        static getNextName() {
            return "ƒAidNode_" + Node.count++;
        }
        get mtxMeshPivot() {
            let cmpMesh = this.getComponent(ƒ.ComponentMesh);
            return cmpMesh ? cmpMesh.mtxPivot : null;
        }
        async deserialize(_serialization) {
            // Quick and maybe hacky solution. Created node is completely dismissed and a recreation of the baseclass gets return. Otherwise, components will be doubled...
            let node = new ƒ.Node(_serialization.name);
            await node.deserialize(_serialization);
            // console.log(node);
            return node;
        }
    }
    FudgeAid.Node = Node;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class NodeArrow extends FudgeAid.Node {
        static { this.internalResources = NodeArrow.createInternalResources(); }
        constructor(_name, _color) {
            super(_name, ƒ.Matrix4x4.IDENTITY());
            let shaft = new FudgeAid.Node(_name + "Shaft", ƒ.Matrix4x4.IDENTITY(), NodeArrow.internalResources.get("Material"), NodeArrow.internalResources.get("Shaft"));
            let head = new FudgeAid.Node(_name + "Head", ƒ.Matrix4x4.IDENTITY(), NodeArrow.internalResources.get("Material"), NodeArrow.internalResources.get("Head"));
            shaft.mtxLocal.scale(new ƒ.Vector3(0.01, 0.01, 1));
            head.mtxLocal.translateZ(0.5);
            head.mtxLocal.scale(new ƒ.Vector3(0.05, 0.05, 0.1));
            head.mtxLocal.rotateX(90);
            shaft.getComponent(ƒ.ComponentMaterial).clrPrimary = _color;
            head.getComponent(ƒ.ComponentMaterial).clrPrimary = _color;
            this.addChild(shaft);
            this.addChild(head);
        }
        static createInternalResources() {
            let map = new Map();
            map.set("Shaft", new ƒ.MeshCube("ArrowShaft"));
            map.set("Head", new ƒ.MeshPyramid("ArrowHead"));
            let coat = new ƒ.CoatColored(ƒ.Color.CSS("white"));
            map.set("Material", new ƒ.Material("Arrow", ƒ.ShaderLit, coat));
            map.forEach((_resource) => ƒ.Project.deregister(_resource));
            return map;
        }
        set color(_color) {
            for (let child of this.getChildren()) {
                child.getComponent(ƒ.ComponentMaterial).clrPrimary.copy(_color);
            }
        }
    }
    FudgeAid.NodeArrow = NodeArrow;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class NodeCoordinateSystem extends FudgeAid.Node {
        constructor(_name = "CoordinateSystem", _transform) {
            super(_name, _transform);
            let arrowRed = new FudgeAid.NodeArrow("ArrowRed", new ƒ.Color(1, 0, 0, 1));
            let arrowGreen = new FudgeAid.NodeArrow("ArrowGreen", new ƒ.Color(0, 1, 0, 1));
            let arrowBlue = new FudgeAid.NodeArrow("ArrowBlue", new ƒ.Color(0, 0, 1, 1));
            arrowRed.mtxLocal.rotateY(90);
            arrowGreen.mtxLocal.rotateX(-90);
            this.addChild(arrowRed);
            this.addChild(arrowGreen);
            this.addChild(arrowBlue);
        }
    }
    FudgeAid.NodeCoordinateSystem = NodeCoordinateSystem;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    /**
     * Adds a light setup to the node given, consisting of an ambient light, a directional key light and a directional back light.
     * Exept of the node to become the container, all parameters are optional and provided default values for general purpose.
     */
    function addStandardLightComponents(_node, _clrAmbient = new ƒ.Color(0.2, 0.2, 0.2), _clrKey = new ƒ.Color(0.9, 0.9, 0.9), _clrBack = new ƒ.Color(0.6, 0.6, 0.6), _posKey = new ƒ.Vector3(4, 12, 8), _posBack = new ƒ.Vector3(-1, -0.5, -3)) {
        let key = new ƒ.ComponentLight(new ƒ.LightDirectional(_clrKey));
        key.mtxPivot.translate(_posKey);
        key.mtxPivot.lookAt(ƒ.Vector3.ZERO());
        let back = new ƒ.ComponentLight(new ƒ.LightDirectional(_clrBack));
        back.mtxPivot.translate(_posBack);
        back.mtxPivot.lookAt(ƒ.Vector3.ZERO());
        let ambient = new ƒ.ComponentLight(new ƒ.LightAmbient(_clrAmbient));
        _node.addComponent(key);
        _node.addComponent(back);
        _node.addComponent(ambient);
    }
    FudgeAid.addStandardLightComponents = addStandardLightComponents;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    /**
     * Handles the animation cycle of a sprite on a [[Node]]
     */
    class NodeSprite extends ƒ.Node {
        static { this.mesh = NodeSprite.createInternalResource(); }
        constructor(_name) {
            super(_name);
            this.framerate = 12; // animation frames per second, single frames can be shorter or longer based on their timescale
            this.frameCurrent = 0;
            this.direction = 1;
            /**
             * Show the next frame of the sequence or start anew when the end or the start was reached, according to the direction of playing
             */
            this.showFrameNext = (_event) => {
                this.frameCurrent = (this.frameCurrent + this.direction + this.animation.frames.length) % this.animation.frames.length;
                this.showFrame(this.frameCurrent);
            };
            this.cmpMesh = new ƒ.ComponentMesh(NodeSprite.mesh);
            // Define coat from the SpriteSheet to use when rendering
            this.cmpMaterial = new ƒ.ComponentMaterial(new ƒ.Material(_name, ƒ.ShaderLitTextured, null));
            this.addComponent(this.cmpMesh);
            this.addComponent(this.cmpMaterial);
        }
        static createInternalResource() {
            let mesh = new ƒ.MeshSprite("Sprite");
            ƒ.Project.deregister(mesh);
            return mesh;
        }
        /**
         * @returns the number of the current frame
         */
        get getCurrentFrame() { return this.frameCurrent; } //ToDo: see if getframeCurrent is problematic
        setAnimation(_animation) {
            this.animation = _animation;
            this.stopAnimation();
            this.showFrame(0);
        }
        stopAnimation() {
            if (this.timer)
                ƒ.Time.game.deleteTimer(this.timer);
        }
        /**
         * Show a specific frame of the sequence
         */
        showFrame(_index) {
            this.stopAnimation();
            let spriteFrame = this.animation.frames[_index];
            this.cmpMesh.mtxPivot = spriteFrame.mtxPivot;
            this.cmpMaterial.mtxPivot = spriteFrame.mtxTexture;
            this.cmpMaterial.material.coat = this.animation.spritesheet;
            this.frameCurrent = _index;
            this.timer = ƒ.Time.game.setTimer(spriteFrame.timeScale * 1000 / this.framerate, 1, this.showFrameNext);
        }
        /**
         * Sets the direction for animation playback, negativ numbers make it play backwards.
         */
        setFrameDirection(_direction) {
            this.direction = Math.floor(_direction);
        }
    }
    FudgeAid.NodeSprite = NodeSprite;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    /**
     * Describes a single frame of a sprite animation
     */
    class SpriteFrame {
    }
    FudgeAid.SpriteFrame = SpriteFrame;
    /**
     * Convenience for creating a [[CoatTexture]] to use as spritesheet
     */
    function createSpriteSheet(_name, _image) {
        let coat = new ƒ.CoatTextured();
        let texture = new ƒ.TextureImage();
        texture.image = _image;
        coat.texture = texture;
        return coat;
    }
    FudgeAid.createSpriteSheet = createSpriteSheet;
    /**
     * Handles a series of [[SpriteFrame]]s to be mapped onto a [[MeshSprite]]
     * Contains the [[MeshSprite]], the [[Material]] and the spritesheet-texture
     */
    class SpriteSheetAnimation {
        constructor(_name, _spritesheet) {
            this.frames = [];
            this.name = _name;
            this.spritesheet = _spritesheet;
        }
        /**
         * Stores a series of frames in this [[Sprite]], calculating the matrices to use in the components of a [[NodeSprite]]
         */
        generate(_rects, _resolutionQuad, _origin) {
            let img = this.spritesheet.texture.texImageSource;
            this.frames = [];
            let framing = new ƒ.FramingScaled();
            framing.setScale(1 / img.width, 1 / img.height);
            let count = 0;
            for (let rect of _rects) {
                let frame = this.createFrame(this.name + `${count}`, framing, rect, _resolutionQuad, _origin);
                frame.timeScale = 1;
                this.frames.push(frame);
                count++;
            }
        }
        /**
         * Add sprite frames using a grid on the spritesheet defined by a rectangle to start with, the number of frames,
         * the resolution which determines the size of the sprites mesh based on the number of pixels of the texture frame,
         * the offset from one cell of the grid to the next in the sequence and, in case the sequence spans over more than one row or column,
         * the offset to move the start rectangle when the margin of the texture is reached and wrapping occurs.
         */
        generateByGrid(_startRect, _frames, _resolutionQuad, _origin, _offsetNext, _offsetWrap = ƒ.Vector2.ZERO()) {
            let img = this.spritesheet.texture.texImageSource;
            let rectImage = new ƒ.Rectangle(0, 0, img.width, img.height);
            let rect = _startRect.clone;
            let rects = [];
            while (_frames--) {
                rects.push(rect.clone);
                rect.position.add(_offsetNext);
                if (rectImage.covers(rect))
                    continue;
                _startRect.position.add(_offsetWrap);
                rect = _startRect.clone;
                if (!rectImage.covers(rect))
                    break;
            }
            rects.forEach((_rect) => ƒ.Debug.log(_rect.toString()));
            this.generate(rects, _resolutionQuad, _origin);
        }
        createFrame(_name, _framing, _rect, _resolutionQuad, _origin) {
            let img = this.spritesheet.texture.texImageSource;
            let rectTexture = new ƒ.Rectangle(0, 0, img.width, img.height);
            let frame = new SpriteFrame();
            frame.rectTexture = _framing.getRect(_rect);
            frame.rectTexture.position = _framing.getPoint(_rect.position, rectTexture);
            let rectQuad = new ƒ.Rectangle(0, 0, _rect.width / _resolutionQuad, _rect.height / _resolutionQuad, _origin);
            frame.mtxPivot = ƒ.Matrix4x4.IDENTITY();
            frame.mtxPivot.translate(new ƒ.Vector3(rectQuad.position.x + rectQuad.size.x / 2, -rectQuad.position.y - rectQuad.size.y / 2, 0));
            frame.mtxPivot.scaleX(rectQuad.size.x);
            frame.mtxPivot.scaleY(rectQuad.size.y);
            // ƒ.Debug.log(rectQuad.toString());
            frame.mtxTexture = ƒ.Matrix3x3.IDENTITY();
            frame.mtxTexture.translate(frame.rectTexture.position);
            frame.mtxTexture.scale(frame.rectTexture.size);
            return frame;
        }
    }
    FudgeAid.SpriteSheetAnimation = SpriteSheetAnimation;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class ComponentStateMachine extends ƒ.ComponentScript {
        transit(_next) {
            this.instructions.transit(this.stateCurrent, _next, this);
        }
        act() {
            this.instructions.act(this.stateCurrent, this);
        }
    }
    FudgeAid.ComponentStateMachine = ComponentStateMachine;
})(FudgeAid || (FudgeAid = {}));
/**
 * State machine offers a structure and fundamental functionality for state machines
 * <State> should be an enum defining the various states of the machine
 */
var FudgeAid;
/**
 * State machine offers a structure and fundamental functionality for state machines
 * <State> should be an enum defining the various states of the machine
 */
(function (FudgeAid) {
    /**
     * Core functionality of the state machine, holding solely the current state and, while in transition, the next state,
     * the instructions for the machine and comfort methods to transit and act.
     */
    class StateMachine {
        transit(_next) {
            this.instructions.transit(this.stateCurrent, _next, this);
        }
        act() {
            this.instructions.act(this.stateCurrent, this);
        }
    }
    FudgeAid.StateMachine = StateMachine;
    /**
     * Set of instructions for a state machine. The set keeps all methods for dedicated actions defined for the states
     * and all dedicated methods defined for transitions to other states, as well as default methods.
     * Instructions exist independently from StateMachines. A statemachine instance is passed as parameter to the instruction set.
     * Multiple statemachine-instances can thus use the same instruction set and different instruction sets could operate on the same statemachine.
     */
    class StateMachineInstructions extends Map {
        /** Define dedicated transition method to transit from one state to another*/
        setTransition(_current, _next, _transition) {
            let active = this.getStateMethods(_current);
            active.transitions.set(_next, _transition);
        }
        /** Define dedicated action method for a state */
        setAction(_current, _action) {
            let active = this.getStateMethods(_current);
            active.action = _action;
        }
        /** Default transition method to invoke if no dedicated transition exists, should be overriden in subclass */
        transitDefault(_machine) {
            //
        }
        /** Default action method to invoke if no dedicated action exists, should be overriden in subclass */
        actDefault(_machine) {
            //
        }
        /** Invoke a dedicated transition method if found for the current and the next state, or the default method */
        transit(_current, _next, _machine) {
            _machine.stateNext = _next;
            try {
                let active = this.get(_current);
                let transition = active.transitions.get(_next);
                transition(_machine);
            }
            catch (_error) {
                // console.info(_error.message);
                this.transitDefault(_machine);
            }
            finally {
                _machine.stateCurrent = _next;
                _machine.stateNext = undefined;
            }
        }
        /** Invoke the dedicated action method if found for the current state, or the default method */
        act(_current, _machine) {
            try {
                let active = this.get(_current);
                active.action(_machine);
            }
            catch (_error) {
                // console.info(_error.message);
                this.actDefault(_machine);
            }
        }
        /** Find the instructions dedicated for the current state or create an empty set for it */
        getStateMethods(_current) {
            let active = this.get(_current);
            if (!active) {
                active = { action: null, transitions: new Map() };
                this.set(_current, active);
            }
            return active;
        }
    }
    FudgeAid.StateMachineInstructions = StateMachineInstructions;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    /**
     * Allows to translate, rotate and scale matrices visually by dragging with a pointer.
     * Installs pointer event listeners on the given {@link ƒ.Viewport}s canvas on construction.
     * Use {@link addListeners}/{@link removeListeners} to handle the installation manually.
     */
    class Transformator {
        #undo; // stack of functions to undo the last transformation
        #mtxLocal; // local matrix of the object to be transformed
        #mtxWorld; // world matrix of the object to be transformed
        #mtxLocalBase; // local matrix in a state before a transformation starts
        #mtxWorldBase; // world matrix in a state before a transformation starts
        #normal; // the normal of the plane with which the mouse ray collides
        #offset; // offest vector pointing from the world position of the object to where the mouse ray collided with the plane on pointer down
        #direction; // direction vector pointing from the world position of the object to where the mouse ray collides with the plane on pointer move
        #isTransforming;
        #torus;
        #torusPick;
        constructor(_viewport) {
            this.mode = "translate";
            this.space = "world";
            this.snapAngle = 15; // 15 degree
            this.snapDistance = 0.1; // 0.1 units
            this.snapScale = 0.1; // 10%
            this.colors = {
                base: {
                    x: ƒ.Color.CSS("red"),
                    y: ƒ.Color.CSS("limegreen"),
                    z: ƒ.Color.CSS("blue"),
                    xyz: ƒ.Color.CSS("gainsboro")
                },
                lite: {
                    x: ƒ.Color.CSS("salmon"),
                    y: ƒ.Color.CSS("lightgreen"),
                    z: ƒ.Color.CSS("cornflowerblue"),
                    xyz: ƒ.Color.CSS("ghostwhite")
                },
                transparent: {
                    x: ƒ.Color.CSS("salmon", 0.66),
                    y: ƒ.Color.CSS("lightgreen", 0.66),
                    z: ƒ.Color.CSS("cornflowerblue", 0.66)
                },
                plane: {
                    xy: ƒ.Color.CSS("blue", 0.5),
                    xz: ƒ.Color.CSS("limegreen", 0.5),
                    yz: ƒ.Color.CSS("red", 0.5)
                },
                planeLite: {
                    xy: ƒ.Color.CSS("cornflowerblue", 0.5),
                    xz: ƒ.Color.CSS("lightgreen", 0.5),
                    yz: ƒ.Color.CSS("salmon", 0.5)
                }
            };
            this.#undo = []; // stack of functions to undo the last transformation
            this.#mtxLocalBase = ƒ.Matrix4x4.IDENTITY(); // local matrix in a state before a transformation starts
            this.#mtxWorldBase = ƒ.Matrix4x4.IDENTITY(); // world matrix in a state before a transformation starts
            this.#normal = ƒ.Vector3.ZERO(); // the normal of the plane with which the mouse ray collides
            this.#offset = ƒ.Vector3.ZERO(); // offest vector pointing from the world position of the object to where the mouse ray collided with the plane on pointer down
            this.#direction = ƒ.Vector3.ZERO(); // direction vector pointing from the world position of the object to where the mouse ray collides with the plane on pointer move
            this.#isTransforming = false;
            /**
             * Add pointer event listeners to the viewport canvas
             */
            this.addListeners = () => {
                this.viewport.canvas.addEventListener("pointerdown", this.hndPointerDown);
                this.viewport.canvas.addEventListener("pointermove", this.hndPointerMove);
                this.viewport.canvas.addEventListener("pointerup", this.hndPointerUp);
                this.viewport.canvas.addEventListener("pointerleave", this.hndPointerUp);
                this.viewport.canvas.addEventListener("pointercancel", this.hndPointerUp);
                this.viewport.addEventListener("renderEnd" /* ƒ.EVENT.RENDER_END */, this.hndRenderEnd);
            };
            /**
             * Remove pointer event listeners from the viewport canvas
             */
            this.removeListeners = () => {
                this.viewport.canvas.removeEventListener("pointerdown", this.hndPointerDown);
                this.viewport.canvas.removeEventListener("pointermove", this.hndPointerMove);
                this.viewport.canvas.removeEventListener("pointerup", this.hndPointerUp);
                this.viewport.canvas.removeEventListener("pointerleave", this.hndPointerUp);
                this.viewport.canvas.removeEventListener("pointercancel", this.hndPointerUp);
                this.viewport.removeEventListener("renderEnd" /* ƒ.EVENT.RENDER_END */, this.hndRenderEnd);
            };
            this.hndPointerDown = (_event) => {
                if (!this.camera || !this.viewport || !this.selected || !this.#mtxLocal || !this.#mtxWorld)
                    return;
                this.#mtxLocalBase.copy(this.#mtxLocal);
                this.#mtxWorldBase.copy(this.#mtxWorld);
                if (this.selected == "x" || this.selected == "y" || this.selected == "z") {
                    if (this.mode == "rotate") {
                        this.#normal.copy(this.getAxis(this.selected));
                    }
                    else {
                        const mtxNormal = ƒ.Matrix4x4.LOOK_AT(this.#mtxWorld.translation, this.camera.mtxWorld.translation, this.getAxis(this.selected), true);
                        this.#normal.copy(mtxNormal.forward); // normal of the plane the mouse ray will collide with
                        ƒ.Recycler.store(mtxNormal);
                    }
                }
                else if (this.selected == "xyz") {
                    this.#normal.copy(this.camera.mtxWorld.forward.negate());
                }
                else {
                    const axis = "xyz".replace(this.selected[0], "").replace(this.selected[1], "");
                    this.#normal.copy(this.getAxis(axis));
                }
                const point = this.getPoint3D(_event);
                this.#offset.copy(point.subtract(this.#mtxWorld.translation));
                ƒ.Recycler.store(point);
                // create undo function
                const mtxLocal = this.#mtxLocal;
                const mutatorLocal = mtxLocal.getMutator();
                let undo = () => {
                    mtxLocal.mutate(mutatorLocal);
                    if (this.#mtxLocal == mtxLocal)
                        this.#mtxLocalBase.copy(mtxLocal);
                };
                this.#undo.push(undo);
            };
            this.hndPointerMove = (_event) => {
                this.#isTransforming = false;
                // this.viewport.canvas.style.cursor = "default";
                if (_event.buttons != 1) {
                    const point = new ƒ.Vector2(_event.offsetX, _event.offsetY);
                    const pick = ƒ.Picker.pickCamera([this], this.camera, this.viewport.pointClientToProjection(point))[0];
                    if (pick?.color.r > 0.8 && pick?.color.g > 0.8 && pick?.color.b > 0.8)
                        this.selected = "xyz";
                    else if (pick?.color.b > 0.8 && pick?.color.a < 1)
                        this.selected = "xy";
                    else if (pick?.color.g > 0.8 && pick?.color.a < 1)
                        this.selected = "xz";
                    else if (pick?.color.r > 0.8 && pick?.color.a < 1)
                        this.selected = "yz";
                    else if (pick?.color.r > 0.8)
                        this.selected = "x";
                    else if (pick?.color.g > 0.8)
                        this.selected = "y";
                    else if (pick?.color.b > 0.8)
                        this.selected = "z";
                    else
                        this.selected = null;
                    ƒ.Recycler.store(point);
                    return;
                }
                if (!this.camera || !this.viewport || !this.selected || !this.#mtxLocal || !this.#mtxWorld)
                    return;
                const isSnapping = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.CTRL_LEFT, ƒ.KEYBOARD_CODE.CTRL_RIGHT]);
                this.#isTransforming = true;
                this.#direction.copy(this.getPoint3D(_event).subtract(this.#mtxWorldBase.translation));
                this.#mtxLocal.copy(this.#mtxLocalBase); // reset
                let axis;
                if (this.selected == "x" || this.selected == "y" || this.selected == "z")
                    axis = this.getAxis(this.selected);
                switch (this.mode) {
                    case "translate":
                        const mtxWorldInverse = this.#mtxWorldBase.clone.invert();
                        const translation = this.selected.length == 1 ? ƒ.Vector3.PROJECTION(this.#direction, axis) : this.#direction.clone;
                        const translationOffset = this.selected.length == 1 ? ƒ.Vector3.PROJECTION(this.#offset, axis) : this.#offset.clone;
                        translation.subtract(translationOffset);
                        if (isSnapping)
                            translation.apply((_value) => ƒ.Calc.snap(_value, this.snapDistance));
                        translation.transform(mtxWorldInverse, false);
                        this.#mtxLocal.translate(translation);
                        ƒ.Recycler.storeMultiple(mtxWorldInverse, translation, translationOffset);
                        break;
                    case "rotate":
                        let angle = ƒ.Vector3.ANGLE(this.#offset, this.#direction);
                        if (isSnapping)
                            angle = ƒ.Calc.snap(angle, this.snapAngle);
                        const cross = ƒ.Vector3.CROSS(this.#offset, this.#direction);
                        if (ƒ.Vector3.DOT(axis, cross) < 0)
                            angle = -angle;
                        const qRotation = ƒ.Quaternion.ROTATION(axis, angle);
                        if (isSnapping) { // rotate offset into snapped direction
                            this.#direction.copy(this.#offset);
                            this.#direction.transform(qRotation);
                        }
                        const mtxLocalInverse = ƒ.Matrix4x4.INVERSE(this.#mtxLocalBase);
                        const mtxParentWorld = ƒ.Matrix4x4.PRODUCT(this.#mtxWorldBase, mtxLocalInverse);
                        const qParentWorld = mtxParentWorld.quaternion;
                        const qParentWorldInverse = ƒ.Quaternion.INVERSE(mtxParentWorld.quaternion);
                        qRotation.multiply(qParentWorldInverse, true);
                        qRotation.multiply(qParentWorld);
                        qRotation.multiply(this.#mtxLocalBase.quaternion);
                        this.#mtxLocal.quaternion = qRotation;
                        // const mtxLocal: ƒ.Matrix4x4 = this.#mtxLocalBase.clone;
                        // const mtxRotation: ƒ.Matrix4x4 = ƒ.Matrix4x4.ROTATION(qRotation);
                        // // localRotation = worldInverse * worldRotation * world
                        // mtxRotation.multiply(ƒ.Matrix4x4.INVERSE(this.#mtxWorldBase), true);
                        // mtxRotation.multiply(this.#mtxWorldBase);
                        // mtxLocal.multiply(mtxRotation);
                        // // restore scaling directions
                        // mtxLocal.scaling = mtxLocal.scaling.apply((_value, _index, _component) => _value * Math.sign(this.#mtxLocalBase.scaling[_component]));
                        // this.#mtxLocal.quaternion = mtxLocal.quaternion;
                        break;
                    case "scale":
                        let scale = this.camera.getWorldToPixelScale(this.#mtxWorld.translation);
                        let lengthArrow = scale * 80; // TODO: save this somewhere
                        if (this.selected == "xyz")
                            axis = this.camera.mtxWorld.right.negate();
                        let offset = ƒ.Vector3.PROJECTION(this.#offset, axis);
                        let direction = ƒ.Vector3.PROJECTION(this.#direction, axis);
                        let signOffset = Math.sign(ƒ.Vector3.DOT(axis, offset));
                        let signDirection = Math.sign(ƒ.Vector3.DOT(axis, direction));
                        let factor = (((signDirection * direction.magnitude) - (signOffset * offset.magnitude)) / lengthArrow) + 1;
                        if (isSnapping)
                            factor = ƒ.Calc.snap(factor, this.snapScale);
                        const mtxScaling = ƒ.Matrix4x4.IDENTITY();
                        for (const selected of this.selected)
                            mtxScaling.scaling[selected] = factor;
                        mtxScaling.scaling = mtxScaling.scaling;
                        if (this.space == "world") { // rotationInverse * scaling * rotation
                            const rotationInverse = this.#mtxWorldBase.quaternion.clone.invert();
                            mtxScaling.rotate(rotationInverse, true);
                            mtxScaling.rotate(this.#mtxWorldBase.quaternion);
                            ƒ.Recycler.store(rotationInverse);
                        }
                        mtxScaling.multiply(this.#mtxLocal, true);
                        // restore scaling directions
                        mtxScaling.scaling.apply((_value, _index, _component) => _value * Math.sign(this.#mtxLocal.scaling[_component]));
                        for (const selected of this.selected)
                            mtxScaling.scaling[selected] *= Math.sign(factor);
                        this.#mtxLocal.scaling = mtxScaling.scaling;
                        ƒ.Recycler.storeMultiple(mtxScaling);
                        break;
                }
                if (axis)
                    ƒ.Recycler.store(axis);
            };
            this.hndPointerUp = () => {
                if (this.#mtxLocal)
                    this.#mtxLocalBase.copy(this.#mtxLocal);
                if (this.#mtxWorld)
                    this.#mtxWorldBase.copy(this.#mtxWorld);
                if (this.selected)
                    this.selected = null;
                if (this.#isTransforming)
                    this.#isTransforming = false;
            };
            this.hndRenderEnd = () => {
                ƒ.Render.clear(undefined, false, true); // clear depth buffer
                ƒ.Gizmos.draw([this], this.viewport.camera);
            };
            this.viewport = _viewport;
            this.addListeners();
            this.#torus = new ƒ.MeshTorus("Torus", 80, 0.75, 60, 8); // 80 logical pixel ring radius, 0.75 logical pixel tube radius
            this.#torusPick = new ƒ.MeshTorus("TorusPick", 80, 5, 60, 8);
            ƒ.Project.deregister(this.#torus);
            ƒ.Project.deregister(this.#torusPick);
        }
        set mtxLocal(_mtx) {
            this.#mtxLocal = _mtx;
            if (this.#mtxLocal)
                this.#mtxLocalBase.copy(_mtx);
        }
        set mtxWorld(_mtx) {
            this.#mtxWorld = _mtx;
            if (this.#mtxWorld)
                this.#mtxWorldBase.copy(_mtx);
        }
        get camera() {
            return this.viewport.camera;
        }
        /**
         * Undo the last transformation
         */
        undo() {
            if (this.#isTransforming)
                return;
            this.#undo.pop()?.();
        }
        /**
         * Clear the undo stack
         */
        clearUndo() {
            this.#undo.length = 0;
        }
        drawGizmos(_cmpCamera, _picking) {
            if (!this.#mtxLocal || !this.#mtxWorld)
                return;
            if (this.space == "local" && (this.#mtxWorld.scaling.x == 0 || this.#mtxWorld.scaling.y == 0 || this.#mtxWorld.scaling.z == 0))
                return;
            const world2Pixel = _cmpCamera.getWorldToPixelScale(this.#mtxWorld.translation);
            const translateArrowWidth = world2Pixel * (_picking ? 10 : 1);
            const translateArrowLength = world2Pixel * (_picking ? 90 : 80);
            const translateArrowSize = world2Pixel * 14;
            const scaleArrowWidth = world2Pixel * (_picking ? 10 : 1);
            const scaleArrowLength = world2Pixel * (_picking ? 83 : 73);
            const scaleArrowSize = world2Pixel * 7;
            const scaleCubeSize = world2Pixel * (_picking ? 20 : 10);
            const clrAxes = {
                x: this.selected == "x" && !this.#isTransforming ? this.colors.lite.x : this.colors.base.x,
                y: this.selected == "y" && !this.#isTransforming ? this.colors.lite.y : this.colors.base.y,
                z: this.selected == "z" && !this.#isTransforming ? this.colors.lite.z : this.colors.base.z
            };
            const clrPlanes = {
                xy: this.selected == "xy" && !this.#isTransforming ? this.colors.planeLite.xy : this.colors.plane.xy,
                xz: this.selected == "xz" && !this.#isTransforming ? this.colors.planeLite.xz : this.colors.plane.xz,
                yz: this.selected == "yz" && !this.#isTransforming ? this.colors.planeLite.yz : this.colors.plane.yz
            };
            const axes = {
                x: this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorld.right,
                y: this.space == "world" ? ƒ.Vector3.Y() : this.#mtxWorld.up,
                z: this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorld.forward
            };
            const normals = {
                x: this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorld.forward,
                y: this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorld.right,
                z: this.space == "world" ? ƒ.Vector3.Y() : this.#mtxWorld.up
            };
            const mtxWorldNormalized = this.space == "world" ? ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation) : this.#mtxWorld.clone;
            mtxWorldNormalized.scale(mtxWorldNormalized.scaling.map(_value => 1 / _value));
            switch (this.mode) {
                case "translate":
                    // draw the axes
                    for (const axis of ["x", "y", "z"])
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrAxes[axis], axes[axis], normals[axis], translateArrowLength, translateArrowWidth, translateArrowSize, ƒ.MeshPyramid, 0);
                    // draw the planes
                    for (const [axis, plane] of [["z", "xy"], ["y", "xz"], ["x", "yz"]]) {
                        if (this.#isTransforming && this.selected != plane)
                            continue;
                        const mtxQuad = mtxWorldNormalized.clone;
                        if (axis == "x")
                            mtxQuad.rotateY(-90);
                        if (axis == "y")
                            mtxQuad.rotateX(90);
                        mtxQuad.translate(new ƒ.Vector3(world2Pixel * 20, world2Pixel * 20, 0)); // move 20 px
                        mtxQuad.scale(ƒ.Vector3.ONE(world2Pixel * (_picking ? 20 : 10))); // scale to size of 20 or 10 px
                        ƒ.Gizmos.drawSprite(mtxQuad, clrPlanes[plane], _picking ? 0 : undefined);
                    }
                    // draw afterimages
                    if (this.#isTransforming) {
                        const world2PixelBase = _cmpCamera.getWorldToPixelScale(this.#mtxWorldBase.translation);
                        for (const selected of this.selected) //@ts-ignore
                            ƒ.Gizmos.drawArrow(this.#mtxWorldBase.translation, this.colors.transparent[selected], axes[selected], normals[selected], world2PixelBase * 80, world2PixelBase * 1, world2PixelBase * 14, ƒ.MeshPyramid, 0);
                    }
                    break;
                case "rotate":
                    if (this.#isTransforming && (this.selected == "x" || this.selected == "y" || this.selected == "z")) {
                        this.drawCircle(this.#torus, this.colors.base[this.selected], axes[this.selected], normals[this.selected], world2Pixel, 0);
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.colors.base[this.selected], this.#direction, axes[this.selected], translateArrowLength, translateArrowWidth, translateArrowSize, ƒ.MeshPyramid, 0);
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.colors.transparent[this.selected], this.#offset, axes[this.selected], translateArrowLength, translateArrowWidth, translateArrowSize, ƒ.MeshPyramid, 0);
                        break;
                    }
                    // draw an invisible quad to occlude the tori
                    const mtxQuad = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
                    const direction = _cmpCamera.mtxWorld.forward.negate();
                    mtxQuad.scaling = ƒ.Vector3.ONE(translateArrowLength * 2);
                    mtxQuad.lookIn(direction);
                    ƒ.Render.setColorWriteMask(false, false, false, false);
                    ƒ.Gizmos.drawQuad(mtxQuad, this.colors.base.x, 0); // color doesn't matter
                    ƒ.Render.setColorWriteMask(true, true, true, true);
                    // draw the tori
                    let torus = _picking ? this.#torusPick : this.#torus;
                    for (const axis of ["x", "y", "z"])
                        this.drawCircle(torus, clrAxes[axis], axes[axis], normals[axis], world2Pixel, 0);
                    ƒ.Recycler.storeMultiple(mtxQuad, direction);
                    break;
                case "scale":
                    for (const axis of ["x", "y", "z"]) {
                        let factor = this.#mtxLocal.scaling[axis] / this.#mtxLocalBase.scaling[axis];
                        if (this.space == "local")
                            factor = Math.abs(factor);
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrAxes[axis], axes[axis], normals[axis], scaleArrowLength * factor, scaleArrowWidth, scaleArrowSize, ƒ.MeshCube, 0);
                    }
                    const mtxCube = mtxWorldNormalized.clone;
                    mtxCube.scale(mtxCube.scaling.set(scaleCubeSize, scaleCubeSize, scaleCubeSize));
                    ƒ.Gizmos.drawCube(mtxCube, this.selected == "xyz" ? this.colors.lite.xyz : this.colors.base.xyz, 1);
                    ƒ.Recycler.store(mtxCube);
                    break;
            }
            ƒ.Recycler.store(mtxWorldNormalized);
        }
        drawCircle(_torus, _color, _direction, _up, _world2Pixel, _alphaOccluded) {
            const mtxWorld = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
            mtxWorld.scaling.set(_world2Pixel, _world2Pixel, _world2Pixel);
            mtxWorld.scaling = mtxWorld.scaling;
            mtxWorld.lookIn(_direction, _up); // lookIn orientates the z-axis but the toruse lays on the xz-plane (facing in y-direction),
            mtxWorld.rotateX(90); // thus we rotate the torus so the circle faces in _direction
            ƒ.Gizmos.drawMesh(_torus, mtxWorld, _color, _alphaOccluded);
            ƒ.Recycler.storeMultiple(mtxWorld);
        }
        getPoint3D(_event) {
            const point2D = ƒ.Recycler.reuse(ƒ.Vector2).set(_event.offsetX, _event.offsetY);
            const ray = this.viewport.getRayFromClient(point2D);
            ƒ.Recycler.store(point2D);
            return ray.intersectPlane(this.#mtxWorldBase.translation, this.#normal);
        }
        getAxis(_axis) {
            if (this.space == "world") {
                switch (_axis) {
                    case "x": return ƒ.Vector3.X();
                    case "y": return ƒ.Vector3.Y();
                    case "z": return ƒ.Vector3.Z();
                }
            }
            else {
                switch (_axis) {
                    case "x": return this.#mtxWorldBase.right;
                    case "y": return this.#mtxWorldBase.up;
                    case "z": return this.#mtxWorldBase.forward;
                }
            }
        }
    }
    FudgeAid.Transformator = Transformator;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class Viewport {
        static create(_branch) {
            let cmpCamera = new ƒ.ComponentCamera();
            cmpCamera.mtxPivot.translate(ƒ.Vector3.Z(4));
            cmpCamera.mtxPivot.rotateY(180);
            let canvas = FudgeAid.Canvas.create();
            document.body.appendChild(canvas);
            let viewport = new ƒ.Viewport();
            viewport.initialize("ƒAid-Viewport", _branch, cmpCamera, canvas);
            return viewport;
        }
        static expandCameraToInteractiveOrbit(_viewport, _showFocus = true, _speedCameraRotation = 1, _speedCameraTranslation = 0.01, _speedCameraDistance = 0.001, _redraw = () => _viewport.draw(), _translateOnPick = () => true) {
            // _viewport.setFocus(true);
            // _viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
            // _viewport.activatePointerEvent(ƒ.EVENT_POINTER.UP, true);
            // _viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
            // _viewport.activateWheelEvent(ƒ.EVENT_WHEEL.WHEEL, true);
            _viewport.canvas.addEventListener("pointerup", hndPointerUp);
            _viewport.canvas.addEventListener("pointerdown", hndPointerDown);
            _viewport.canvas.addEventListener("pointermove", hndPointerMove);
            _viewport.canvas.addEventListener("pointerleave", hndPointerUp);
            _viewport.canvas.addEventListener("pointercancel", hndPointerUp);
            _viewport.canvas.addEventListener("wheel", hndWheelMove);
            const factorPan = 1 / 500;
            const factorFly = 1 / 20;
            const factorZoom = 1 / 3;
            const factorZoomTouch = 2.5;
            const doubleTapThreshold = { time: 300, distance: 30 ** 2 }; // eslint-disable-line
            const pinchThreshold = 70; // max horizontal distance between two touches to be recognized as pinch
            let flySpeed = 0.3;
            let flyAccelerated = 10;
            let timer = new ƒ.Timer(ƒ.Time.game, 20, 0, hndTimer);
            let cntFly = new ƒ.Control("Fly", flySpeed);
            cntFly.setDelay(500);
            let flying = false;
            console.log(timer);
            let touchState;
            let cntMouseHorizontal = new ƒ.Control("MouseHorizontal", -1);
            let cntMouseVertical = new ƒ.Control("MouseVertical", -1);
            // camera setup
            let camera;
            camera = new FudgeAid.CameraOrbitMovingFocus(_viewport.camera, 5, 85, 0.01, 1000);
            //TODO: remove the following line, camera must not be manipulated but should already be set up when calling this method
            _viewport.camera.projectCentral(_viewport.camera.getAspect(), _viewport.camera.getFieldOfView(), _viewport.camera.getDirection(), 0.01, 1000);
            // yset up axis to control
            camera.axisRotateX.addControl(cntMouseVertical);
            camera.axisRotateX.setFactor(_speedCameraRotation);
            camera.axisRotateY.addControl(cntMouseHorizontal);
            camera.axisRotateY.setFactor(_speedCameraRotation);
            // _viewport.getBranch().addChild(camera);
            let focus;
            if (_showFocus) {
                focus = new FudgeAid.NodeCoordinateSystem("Focus");
                focus.addComponent(new ƒ.ComponentTransform());
                _viewport.getBranch().addChild(focus);
            }
            const activePointers = new Map();
            let prevPointer;
            let prevDistance;
            redraw();
            return camera;
            function hndPointerMove(_event) {
                if (!_event.buttons)
                    return;
                activePointers.set(_event.pointerId, _event);
                let posCamera = camera.nodeCamera.mtxWorld.translation.clone;
                // orbit
                if ((_event.buttons == 4 && !(_event.ctrlKey || _event.altKey || _event.shiftKey)) || (_event.buttons == 1 && _event.altKey) || touchState == "orbit") {
                    cntMouseHorizontal.setInput(_event.movementX);
                    cntMouseVertical.setInput(_event.movementY);
                }
                // fly
                if ((_event.buttons == 2 && !_event.altKey) || touchState == "fly") {
                    cntMouseHorizontal.setInput(_event.movementX * factorFly);
                    cntMouseVertical.setInput(_event.movementY * factorFly);
                    ƒ.Render.prepare(camera);
                    let offset = ƒ.Vector3.DIFFERENCE(posCamera, camera.nodeCamera.mtxWorld.translation);
                    camera.mtxLocal.translate(offset, false);
                }
                // zoom
                if ((_event.buttons == 4 && _event.ctrlKey) || (_event.buttons == 2 && _event.altKey))
                    zoom(_event.movementX * factorZoom);
                // pinch zoom
                if (touchState == "zoom") {
                    const iterator = activePointers.values();
                    const distance = Math.abs(iterator.next().value.offsetY - iterator.next().value.offsetY);
                    if (prevDistance)
                        zoom((prevDistance - distance) * factorZoomTouch);
                    prevDistance = distance;
                }
                // pan 
                if (_event.buttons == 4 && (_event.altKey || _event.shiftKey)) {
                    camera.translateX(-_event.movementX * camera.distance * factorPan);
                    camera.translateY(_event.movementY * camera.distance * factorPan);
                }
                redraw();
            }
            function hndTimer(_event) {
                if (!flying)
                    return;
                cntFly.setFactor(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) ? flyAccelerated : flySpeed);
                cntFly.setInput(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.Q, ƒ.KEYBOARD_CODE.E]) ? 1 : 0);
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W]))
                    camera.translateZ(-cntFly.getOutput());
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S]))
                    camera.translateZ(cntFly.getOutput());
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A]))
                    camera.translateX(-cntFly.getOutput());
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]))
                    camera.translateX(cntFly.getOutput());
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.Q]))
                    camera.translateY(-cntFly.getOutput());
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E]))
                    camera.translateY(cntFly.getOutput());
                else
                    return;
                redraw();
            }
            function hndPointerDown(_event) {
                activePointers.set(_event.pointerId, _event);
                flying = (_event.buttons == 2 && !_event.altKey);
                if (_event.pointerType == "touch") {
                    touchState = "orbit";
                    if (activePointers.size == 2) {
                        const iterator = activePointers.values();
                        const distance = Math.abs(iterator.next().value.offsetX - iterator.next().value.offsetX);
                        touchState = distance < pinchThreshold ? "zoom" : "fly";
                    }
                }
                const doubleTap = activePointers.size == 1 &&
                    (_event.timeStamp - (prevPointer?.timeStamp ?? 0) < doubleTapThreshold.time) &&
                    (prevPointer?.offsetX - _event.offsetX ?? 0) ** 2 + (prevPointer?.offsetY - _event.offsetY ?? 0) ** 2 < doubleTapThreshold.distance;
                prevPointer = doubleTap ? null : _event;
                if (_event.button != 0 || _event.ctrlKey || _event.altKey || _event.shiftKey || (_event.pointerType == "touch" && !doubleTap))
                    return;
                touchState = null;
                let pos = new ƒ.Vector2(_event.offsetX, _event.offsetY);
                let picks = ƒ.Picker.pickViewport(_viewport, pos);
                if (picks.length == 0)
                    return;
                // picks.sort((_a: ƒ.Pick, _b: ƒ.Pick) => (_a.zBuffer < _b.zBuffer && _a.gizmo) ? -1 : 1);
                picks.sort((_a, _b) => {
                    if (_a.gizmo && !_b.gizmo)
                        return -1;
                    if (!_a.gizmo && _b.gizmo)
                        return 1;
                    // If both picks have a gizmo property or if neither does, prioritize based on zBuffer value
                    return _a.zBuffer - _b.zBuffer;
                });
                // let posCamera: ƒ.Vector3 = camera.nodeCamera.mtxWorld.translation;
                // camera.mtxLocal.translation = picks[0].posWorld;
                // // ƒ.Render.prepare(camera);
                // camera.positionCamera(posCamera);
                // if (!(picks[0].gizmo instanceof ComponentTranslator))
                if (_translateOnPick())
                    camera.mtxLocal.translation = picks[0].posWorld;
                redraw();
                _viewport.canvas.dispatchEvent(new CustomEvent("pick", { detail: picks[0], bubbles: true }));
            }
            function hndPointerUp(_event) {
                activePointers.delete(_event.pointerId);
                if (activePointers.size < 2)
                    prevDistance = 0;
                touchState = null;
                flying = false;
            }
            function hndWheelMove(_event) {
                zoom(_event.deltaY);
                redraw();
            }
            function zoom(_delta) {
                camera.distance *= 1 + _delta * _speedCameraDistance;
            }
            function redraw() {
                if (focus)
                    focus.mtxLocal.translation = camera.mtxLocal.translation;
                ƒ.Render.prepare(camera);
                _redraw();
                // _viewport.draw();
            }
        }
    }
    FudgeAid.Viewport = Viewport;
})(FudgeAid || (FudgeAid = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VBaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9Tb3VyY2UvQWlkL1JlZmVyZW5jZXMudHMiLCIuLi9Tb3VyY2UvQWlkL0FyaXRobWV0aWMvQXJpdGgudHMiLCIuLi9Tb3VyY2UvQWlkL0FyaXRobWV0aWMvQXJpdGhCaXNlY3Rpb24udHMiLCIuLi9Tb3VyY2UvQWlkL0NhbWVyYS9DYW1lcmFPcmJpdC50cyIsIi4uL1NvdXJjZS9BaWQvQ2FtZXJhL0NhbWVyYU9yYml0TW92aW5nRm9jdXMudHMiLCIuLi9Tb3VyY2UvQWlkL0NhbnZhcy9DYW52YXMudHMiLCIuLi9Tb3VyY2UvQWlkL0dlb21ldHJ5L05vZGUudHMiLCIuLi9Tb3VyY2UvQWlkL0dlb21ldHJ5L05vZGVBcnJvdy50cyIsIi4uL1NvdXJjZS9BaWQvR2VvbWV0cnkvTm9kZUNvb3JkaW5hdGVTeXN0ZW0udHMiLCIuLi9Tb3VyY2UvQWlkL0xpZ2h0L05vZGVMaWdodFNldHVwLnRzIiwiLi4vU291cmNlL0FpZC9TcHJpdGUvTm9kZVNwcml0ZS50cyIsIi4uL1NvdXJjZS9BaWQvU3ByaXRlL1Nwcml0ZVNoZWV0QW5pbWF0aW9uLnRzIiwiLi4vU291cmNlL0FpZC9TdGF0ZU1hY2hpbmUvQ29tcG9uZW50U3RhdGVNYWNoaW5lLnRzIiwiLi4vU291cmNlL0FpZC9TdGF0ZU1hY2hpbmUvU3RhdGVNYWNoaW5lLnRzIiwiLi4vU291cmNlL0FpZC9UcmFuc2Zvcm0vVHJhbnNmb3JtYXRvci50cyIsIi4uL1NvdXJjZS9BaWQvVmlld3BvcnQvVmlld3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDtBQUMxRCxJQUFVLFFBQVEsQ0FFakI7QUFIRCwwREFBMEQ7QUFDMUQsV0FBVSxRQUFRO0lBQ2hCLFNBQVMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkQsQ0FBQyxFQUZTLFFBQVEsS0FBUixRQUFRLFFBRWpCO0FDSEQsSUFB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QUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUUsSUFBSSxLQUFLLEdBQWdCLElBQUksV0FBVyxFQUFFLENBQUM7WUFFM0MsS0FBSyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUU1RSxJQUFJLFFBQVEsR0FBZ0IsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssR0FBRyxlQUFlLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDMUgsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3hDLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsb0NBQW9DO1lBRXBDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFNB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ZGdlQ29yZS5kLnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIEZ1ZGdlQ29yZS5TZXJpYWxpemVyLnJlZ2lzdGVyTmFtZXNwYWNlKEZ1ZGdlQWlkKTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgLyoqXHJcbiAgICogQWJzdHJhY3QgY2xhc3Mgc3VwcG9ydGluZyB2ZXJzaW91cyBhcml0aG1ldGljYWwgaGVscGVyIGZ1bmN0aW9uc1xyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBcml0aCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIG9uZSBvZiB0aGUgdmFsdWVzIHBhc3NlZCBpbiwgZWl0aGVyIF92YWx1ZSBpZiB3aXRoaW4gX21pbiBhbmQgX21heCBvciB0aGUgYm91bmRhcnkgYmVpbmcgZXhjZWVkZWQgYnkgX3ZhbHVlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhbXA8VD4oX3ZhbHVlOiBULCBfbWluOiBULCBfbWF4OiBULCBfaXNTbWFsbGVyOiAoX3ZhbHVlMTogVCwgX3ZhbHVlMjogVCkgPT4gYm9vbGVhbiA9IChfdmFsdWUxOiBULCBfdmFsdWUyOiBUKSA9PiB7IHJldHVybiBfdmFsdWUxIDwgX3ZhbHVlMjsgfSk6IFQge1xyXG4gICAgICBpZiAoX2lzU21hbGxlcihfdmFsdWUsIF9taW4pKSByZXR1cm4gX21pbjtcclxuICAgICAgaWYgKF9pc1NtYWxsZXIoX21heCwgX3ZhbHVlKSkgcmV0dXJuIF9tYXg7XHJcbiAgICAgIHJldHVybiBfdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICAvKipcclxuICAgKiBXaXRoaW4gYSBnaXZlbiBwcmVjaXNpb24sIGFuIG9iamVjdCBvZiB0aGlzIGNsYXNzIGZpbmRzIHRoZSBwYXJhbWV0ZXIgdmFsdWUgYXQgd2hpY2ggYSBnaXZlbiBmdW5jdGlvbiBcclxuICAgKiBzd2l0Y2hlcyBpdHMgYm9vbGVhbiByZXR1cm4gdmFsdWUgdXNpbmcgaW50ZXJ2YWwgc3BsaXR0aW5nIChiaXNlY3Rpb24pLiBcclxuICAgKiBQYXNzIHRoZSB0eXBlIG9mIHRoZSBwYXJhbWV0ZXIgYW5kIHRoZSB0eXBlIHRoZSBwcmVjaXNpb24gaXMgbWVhc3VyZWQgaW4uXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEFyaXRoQmlzZWN0aW9uPFBhcmFtZXRlciwgRXBzaWxvbj4ge1xyXG4gICAgLyoqIFRoZSBsZWZ0IGJvcmRlciBvZiB0aGUgaW50ZXJ2YWwgZm91bmQgKi9cclxuICAgIHB1YmxpYyBsZWZ0OiBQYXJhbWV0ZXI7XHJcbiAgICAvKiogVGhlIHJpZ2h0IGJvcmRlciBvZiB0aGUgaW50ZXJ2YWwgZm91bmQgKi9cclxuICAgIHB1YmxpYyByaWdodDogUGFyYW1ldGVyO1xyXG4gICAgLyoqIFRoZSBmdW5jdGlvbiB2YWx1ZSBhdCB0aGUgbGVmdCBib3JkZXIgb2YgdGhlIGludGVydmFsIGZvdW5kICovXHJcbiAgICBwdWJsaWMgbGVmdFZhbHVlOiBib29sZWFuO1xyXG4gICAgLyoqIFRoZSBmdW5jdGlvbiB2YWx1ZSBhdCB0aGUgcmlnaHQgYm9yZGVyIG9mIHRoZSBpbnRlcnZhbCBmb3VuZCAqL1xyXG4gICAgcHVibGljIHJpZ2h0VmFsdWU6IGJvb2xlYW47XHJcblxyXG4gICAgcHJpdmF0ZSBmdW5jdGlvbjogKF90OiBQYXJhbWV0ZXIpID0+IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIGRpdmlkZTogKF9sZWZ0OiBQYXJhbWV0ZXIsIF9yaWdodDogUGFyYW1ldGVyKSA9PiBQYXJhbWV0ZXI7XHJcbiAgICBwcml2YXRlIGlzU21hbGxlcjogKF9sZWZ0OiBQYXJhbWV0ZXIsIF9yaWdodDogUGFyYW1ldGVyLCBfZXBzaWxvbjogRXBzaWxvbikgPT4gYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBuZXcgU29sdmVyXHJcbiAgICAgKiBAcGFyYW0gX2Z1bmN0aW9uIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhbiBhcmd1bWVudCBvZiB0aGUgZ2VuZXJpYyB0eXBlIDxQYXJhbWV0ZXI+IGFuZCByZXR1cm5zIGEgYm9vbGVhbiB2YWx1ZS5cclxuICAgICAqIEBwYXJhbSBfZGl2aWRlIEEgZnVuY3Rpb24gc3BsaXR0aW5nIHRoZSBpbnRlcnZhbCB0byBmaW5kIGEgcGFyYW1ldGVyIGZvciB0aGUgbmV4dCBpdGVyYXRpb24sIG1heSBzaW1wbHkgYmUgdGhlIGFyaXRobWV0aWMgbWVhblxyXG4gICAgICogQHBhcmFtIF9pc1NtYWxsZXIgQSBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgYSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIGN1cnJlbnQgaW50ZXJ2YWwgYW5kIGNvbXBhcmVzIHRoaXMgdG8gdGhlIGdpdmVuIHByZWNpc2lvbiBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgIF9mdW5jdGlvbjogKF90OiBQYXJhbWV0ZXIpID0+IGJvb2xlYW4sXHJcbiAgICAgIF9kaXZpZGU6IChfbGVmdDogUGFyYW1ldGVyLCBfcmlnaHQ6IFBhcmFtZXRlcikgPT4gUGFyYW1ldGVyLFxyXG4gICAgICBfaXNTbWFsbGVyOiAoX2xlZnQ6IFBhcmFtZXRlciwgX3JpZ2h0OiBQYXJhbWV0ZXIsIF9lcHNpbG9uOiBFcHNpbG9uKSA9PiBib29sZWFuKSB7XHJcbiAgICAgIHRoaXMuZnVuY3Rpb24gPSBfZnVuY3Rpb247XHJcbiAgICAgIHRoaXMuZGl2aWRlID0gX2RpdmlkZTtcclxuICAgICAgdGhpcy5pc1NtYWxsZXIgPSBfaXNTbWFsbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZHMgYSBzb2x1dGlvbiB3aXRoIHRoZSBnaXZlbiBwcmVjaXNpb24gaW4gdGhlIGdpdmVuIGludGVydmFsIHVzaW5nIHRoZSBmdW5jdGlvbnMgdGhpcyBTb2x2ZXIgd2FzIGNvbnN0cnVjdGVkIHdpdGguXHJcbiAgICAgKiBBZnRlciB0aGUgbWV0aG9kIHJldHVybnMsIGZpbmQgdGhlIGRhdGEgaW4gdGhpcyBvYmplY3RzIHByb3BlcnRpZXMuXHJcbiAgICAgKiBAcGFyYW0gX2xlZnQgVGhlIHBhcmFtZXRlciBvbiBvbmUgc2lkZSBvZiB0aGUgaW50ZXJ2YWwuXHJcbiAgICAgKiBAcGFyYW0gX3JpZ2h0IFRoZSBwYXJhbWV0ZXIgb24gdGhlIG90aGVyIHNpZGUsIG1heSBiZSBcInNtYWxsZXJcIiB0aGFuIFtbX2xlZnRdXS5cclxuICAgICAqIEBwYXJhbSBfZXBzaWxvbiBUaGUgZGVzaXJlZCBwcmVjaXNpb24gb2YgdGhlIHNvbHV0aW9uLlxyXG4gICAgICogQHBhcmFtIF9sZWZ0VmFsdWUgVGhlIHZhbHVlIG9uIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIGludGVydmFsLCBvbWl0IGlmIHlldCB1bmtub3duIG9yIHBhc3MgaW4gaWYga25vd24gZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cclxuICAgICAqIEBwYXJhbSBfcmlnaHRWYWx1ZSBUaGUgdmFsdWUgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGludGVydmFsLCBvbWl0IGlmIHlldCB1bmtub3duIG9yIHBhc3MgaW4gaWYga25vd24gZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cclxuICAgICAqIEB0aHJvd3MgRXJyb3IgaWYgYm90aCBzaWRlcyBvZiB0aGUgaW50ZXJ2YWwgcmV0dXJuIHRoZSBzYW1lIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc29sdmUoX2xlZnQ6IFBhcmFtZXRlciwgX3JpZ2h0OiBQYXJhbWV0ZXIsIF9lcHNpbG9uOiBFcHNpbG9uLCBfbGVmdFZhbHVlOiBib29sZWFuID0gdW5kZWZpbmVkLCBfcmlnaHRWYWx1ZTogYm9vbGVhbiA9IHVuZGVmaW5lZCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmxlZnQgPSBfbGVmdDtcclxuICAgICAgdGhpcy5sZWZ0VmFsdWUgPSBfbGVmdFZhbHVlIHx8IHRoaXMuZnVuY3Rpb24oX2xlZnQpO1xyXG4gICAgICB0aGlzLnJpZ2h0ID0gX3JpZ2h0O1xyXG4gICAgICB0aGlzLnJpZ2h0VmFsdWUgPSBfcmlnaHRWYWx1ZSB8fCB0aGlzLmZ1bmN0aW9uKF9yaWdodCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5pc1NtYWxsZXIoX2xlZnQsIF9yaWdodCwgX2Vwc2lsb24pKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmICh0aGlzLmxlZnRWYWx1ZSA9PSB0aGlzLnJpZ2h0VmFsdWUpXHJcbiAgICAgICAgdGhyb3cobmV3IEVycm9yKFwiSW50ZXJ2YWwgc29sdmVyIGNhbid0IG9wZXJhdGUgd2l0aCBpZGVudGljYWwgZnVuY3Rpb24gdmFsdWVzIG9uIGJvdGggc2lkZXMgb2YgdGhlIGludGVydmFsXCIpKTtcclxuXHJcbiAgICAgIGxldCBiZXR3ZWVuOiBQYXJhbWV0ZXIgPSB0aGlzLmRpdmlkZShfbGVmdCwgX3JpZ2h0KTtcclxuICAgICAgbGV0IGJldHdlZW5WYWx1ZTogYm9vbGVhbiA9IHRoaXMuZnVuY3Rpb24oYmV0d2Vlbik7XHJcbiAgICAgIGlmIChiZXR3ZWVuVmFsdWUgPT0gdGhpcy5sZWZ0VmFsdWUpXHJcbiAgICAgICAgdGhpcy5zb2x2ZShiZXR3ZWVuLCB0aGlzLnJpZ2h0LCBfZXBzaWxvbiwgYmV0d2VlblZhbHVlLCB0aGlzLnJpZ2h0VmFsdWUpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zb2x2ZSh0aGlzLmxlZnQsIGJldHdlZW4sIF9lcHNpbG9uLCB0aGlzLmxlZnRWYWx1ZSwgYmV0d2VlblZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IG91dDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgb3V0ICs9IGBsZWZ0OiAke3RoaXMubGVmdC50b1N0cmluZygpfSAtPiAke3RoaXMubGVmdFZhbHVlfWA7XHJcbiAgICAgIG91dCArPSBcIlxcblwiO1xyXG4gICAgICBvdXQgKz0gYHJpZ2h0OiAke3RoaXMucmlnaHQudG9TdHJpbmcoKX0gLT4gJHt0aGlzLnJpZ2h0VmFsdWV9YDtcclxuICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENhbWVyYU9yYml0IGV4dGVuZHMgxpIuTm9kZSB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXhpc1JvdGF0ZVg6IMaSLkF4aXMgPSBuZXcgxpIuQXhpcyhcIlJvdGF0ZVhcIiwgMSwgxpIuQ09OVFJPTF9UWVBFLlBST1BPUlRJT05BTCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXhpc1JvdGF0ZVk6IMaSLkF4aXMgPSBuZXcgxpIuQXhpcyhcIlJvdGF0ZVlcIiwgMSwgxpIuQ09OVFJPTF9UWVBFLlBST1BPUlRJT05BTCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXhpc0Rpc3RhbmNlOiDGki5BeGlzID0gbmV3IMaSLkF4aXMoXCJEaXN0YW5jZVwiLCAxLCDGki5DT05UUk9MX1RZUEUuUFJPUE9SVElPTkFMKTtcclxuXHJcbiAgICBwdWJsaWMgbWluRGlzdGFuY2U6IG51bWJlcjtcclxuICAgIHB1YmxpYyBtYXhEaXN0YW5jZTogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIHRyYW5zbGF0b3I6IMaSLk5vZGU7XHJcbiAgICBwcm90ZWN0ZWQgcm90YXRvclg6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIG1heFJvdFg6IG51bWJlcjtcclxuXHJcblxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEsIF9kaXN0YW5jZVN0YXJ0OiBudW1iZXIgPSAyLCBfbWF4Um90WDogbnVtYmVyID0gNzUsIF9taW5EaXN0YW5jZTogbnVtYmVyID0gMSwgX21heERpc3RhbmNlOiBudW1iZXIgPSAxMCkge1xyXG4gICAgICBzdXBlcihcIkNhbWVyYU9yYml0XCIpO1xyXG5cclxuICAgICAgdGhpcy5tYXhSb3RYID0gTWF0aC5taW4oX21heFJvdFgsIDg5KTtcclxuICAgICAgdGhpcy5taW5EaXN0YW5jZSA9IF9taW5EaXN0YW5jZTtcclxuICAgICAgdGhpcy5tYXhEaXN0YW5jZSA9IF9tYXhEaXN0YW5jZTtcclxuXHJcbiAgICAgIGxldCBjbXBUcmFuc2Zvcm06IMaSLkNvbXBvbmVudFRyYW5zZm9ybSA9IG5ldyDGki5Db21wb25lbnRUcmFuc2Zvcm0oKTtcclxuICAgICAgdGhpcy5hZGRDb21wb25lbnQoY21wVHJhbnNmb3JtKTtcclxuXHJcbiAgICAgIHRoaXMucm90YXRvclggPSBuZXcgxpIuTm9kZShcIkNhbWVyYVJvdGF0aW9uWFwiKTtcclxuICAgICAgdGhpcy5yb3RhdG9yWC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudFRyYW5zZm9ybSgpKTtcclxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLnJvdGF0b3JYKTtcclxuICAgICAgdGhpcy50cmFuc2xhdG9yID0gbmV3IMaSLk5vZGUoXCJDYW1lcmFUcmFuc2xhdGVcIik7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRvci5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudFRyYW5zZm9ybSgpKTtcclxuICAgICAgdGhpcy50cmFuc2xhdG9yLm10eExvY2FsLnJvdGF0ZVkoMTgwKTtcclxuICAgICAgdGhpcy5yb3RhdG9yWC5hZGRDaGlsZCh0aGlzLnRyYW5zbGF0b3IpO1xyXG5cclxuICAgICAgdGhpcy50cmFuc2xhdG9yLmFkZENvbXBvbmVudChfY21wQ2FtZXJhKTtcclxuICAgICAgdGhpcy5kaXN0YW5jZSA9IF9kaXN0YW5jZVN0YXJ0O1xyXG5cclxuICAgICAgdGhpcy5heGlzUm90YXRlWC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5UX0NPTlRST0wuT1VUUFVULCB0aGlzLmhuZEF4aXNPdXRwdXQpO1xyXG4gICAgICB0aGlzLmF4aXNSb3RhdGVZLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlRfQ09OVFJPTC5PVVRQVVQsIHRoaXMuaG5kQXhpc091dHB1dCk7XHJcbiAgICAgIHRoaXMuYXhpc0Rpc3RhbmNlLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlRfQ09OVFJPTC5PVVRQVVQsIHRoaXMuaG5kQXhpc091dHB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjbXBDYW1lcmEoKTogxpIuQ29tcG9uZW50Q2FtZXJhIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRvci5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50Q2FtZXJhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG5vZGVDYW1lcmEoKTogxpIuTm9kZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBkaXN0YW5jZShfZGlzdGFuY2U6IG51bWJlcikge1xyXG4gICAgICBsZXQgbmV3RGlzdGFuY2U6IG51bWJlciA9IE1hdGgubWluKHRoaXMubWF4RGlzdGFuY2UsIE1hdGgubWF4KHRoaXMubWluRGlzdGFuY2UsIF9kaXN0YW5jZSkpO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0b3IubXR4TG9jYWwudHJhbnNsYXRpb24gPSDGki5WZWN0b3IzLloobmV3RGlzdGFuY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZGlzdGFuY2UoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRvci5tdHhMb2NhbC50cmFuc2xhdGlvbi56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb25ZKF9hbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgIHRoaXMubXR4TG9jYWwucm90YXRpb24gPSDGki5WZWN0b3IzLlkoX2FuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJvdGF0aW9uWSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5tdHhMb2NhbC5yb3RhdGlvbi55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb25YKF9hbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgIF9hbmdsZSA9IE1hdGgubWluKE1hdGgubWF4KC10aGlzLm1heFJvdFgsIF9hbmdsZSksIHRoaXMubWF4Um90WCk7XHJcbiAgICAgIHRoaXMucm90YXRvclgubXR4TG9jYWwucm90YXRpb24gPSDGki5WZWN0b3IzLlgoX2FuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJvdGF0aW9uWCgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3RhdG9yWC5tdHhMb2NhbC5yb3RhdGlvbi54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGVZKF9kZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXR4TG9jYWwucm90YXRlWShfZGVsdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGVYKF9kZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucm90YXRpb25YID0gdGhpcy5yb3RhdG9yWC5tdHhMb2NhbC5yb3RhdGlvbi54ICsgX2RlbHRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNldCBwb3NpdGlvbiBvZiBjYW1lcmEgY29tcG9uZW50IHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIgb2Ygb3JiaXRcclxuICAgIHB1YmxpYyBwb3NpdGlvbkNhbWVyYShfcG9zV29ybGQ6IMaSLlZlY3RvcjMpOiB2b2lkIHtcclxuICAgICAgbGV0IGRpZmZlcmVuY2U6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLkRJRkZFUkVOQ0UoX3Bvc1dvcmxkLCB0aGlzLm10eFdvcmxkLnRyYW5zbGF0aW9uKTtcclxuICAgICAgbGV0IGdlbzogxpIuR2VvMyA9IGRpZmZlcmVuY2UuZ2VvO1xyXG4gICAgICB0aGlzLnJvdGF0aW9uWSA9IGdlby5sb25naXR1ZGU7XHJcbiAgICAgIHRoaXMucm90YXRpb25YID0gLWdlby5sYXRpdHVkZTtcclxuICAgICAgdGhpcy5kaXN0YW5jZSA9IGdlby5tYWduaXR1ZGU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBobmRBeGlzT3V0cHV0OiBFdmVudExpc3RlbmVyID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IG91dHB1dDogbnVtYmVyID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbC5vdXRwdXQ7XHJcbiAgICAgIHN3aXRjaCAoKDzGki5BeGlzPl9ldmVudC50YXJnZXQpLm5hbWUpIHtcclxuICAgICAgICBjYXNlIFwiUm90YXRlWFwiOlxyXG4gICAgICAgICAgdGhpcy5yb3RhdGVYKG91dHB1dCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiUm90YXRlWVwiOlxyXG4gICAgICAgICAgdGhpcy5yb3RhdGVZKG91dHB1dCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiRGlzdGFuY2VcIjpcclxuICAgICAgICAgIHRoaXMuZGlzdGFuY2UgKz0gb3V0cHV0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDYW1lcmFPcmJpdE1vdmluZ0ZvY3VzIGV4dGVuZHMgQ2FtZXJhT3JiaXQge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF4aXNUcmFuc2xhdGVYOiDGki5BeGlzID0gbmV3IMaSLkF4aXMoXCJUcmFuc2xhdGVYXCIsIDEsIMaSLkNPTlRST0xfVFlQRS5QUk9QT1JUSU9OQUwpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF4aXNUcmFuc2xhdGVZOiDGki5BeGlzID0gbmV3IMaSLkF4aXMoXCJUcmFuc2xhdGVZXCIsIDEsIMaSLkNPTlRST0xfVFlQRS5QUk9QT1JUSU9OQUwpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF4aXNUcmFuc2xhdGVaOiDGki5BeGlzID0gbmV3IMaSLkF4aXMoXCJUcmFuc2xhdGVaXCIsIDEsIMaSLkNPTlRST0xfVFlQRS5QUk9QT1JUSU9OQUwpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEsIF9kaXN0YW5jZVN0YXJ0OiBudW1iZXIgPSA1LCBfbWF4Um90WDogbnVtYmVyID0gODUsIF9taW5EaXN0YW5jZTogbnVtYmVyID0gMCwgX21heERpc3RhbmNlOiBudW1iZXIgPSBJbmZpbml0eSkge1xyXG4gICAgICBzdXBlcihfY21wQ2FtZXJhLCBfZGlzdGFuY2VTdGFydCwgX21heFJvdFgsIF9taW5EaXN0YW5jZSwgX21heERpc3RhbmNlKTtcclxuICAgICAgdGhpcy5uYW1lID0gXCJDYW1lcmFPcmJpdE1vdmluZ0ZvY3VzXCI7XHJcblxyXG4gICAgICB0aGlzLmF4aXNUcmFuc2xhdGVYLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlRfQ09OVFJPTC5PVVRQVVQsIHRoaXMuaG5kQXhpc091dHB1dCk7XHJcbiAgICAgIHRoaXMuYXhpc1RyYW5zbGF0ZVkuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVF9DT05UUk9MLk9VVFBVVCwgdGhpcy5obmRBeGlzT3V0cHV0KTtcclxuICAgICAgdGhpcy5heGlzVHJhbnNsYXRlWi5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5UX0NPTlRST0wuT1VUUFVULCB0aGlzLmhuZEF4aXNPdXRwdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2xhdGVYKF9kZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXR4TG9jYWwudHJhbnNsYXRlWChfZGVsdGEpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlWShfZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjMgPSB0aGlzLnJvdGF0b3JYLm10eFdvcmxkLmdldFkoKTtcclxuICAgICAgdHJhbnNsYXRpb24ubm9ybWFsaXplKF9kZWx0YSk7XHJcbiAgICAgIHRoaXMubXR4TG9jYWwudHJhbnNsYXRlKHRyYW5zbGF0aW9uLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zbGF0ZVooX2RlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgLy8gdGhpcy5tdHhMb2NhbC50cmFuc2xhdGVaKF9kZWx0YSk7XHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMyA9IHRoaXMucm90YXRvclgubXR4V29ybGQuZ2V0WigpO1xyXG4gICAgICB0cmFuc2xhdGlvbi5ub3JtYWxpemUoX2RlbHRhKTtcclxuICAgICAgdGhpcy5tdHhMb2NhbC50cmFuc2xhdGUodHJhbnNsYXRpb24sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaG5kQXhpc091dHB1dDogRXZlbnRMaXN0ZW5lciA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBvdXRwdXQ6IG51bWJlciA9ICg8Q3VzdG9tRXZlbnQ+X2V2ZW50KS5kZXRhaWwub3V0cHV0O1xyXG4gICAgICBzd2l0Y2ggKCg8xpIuQXhpcz5fZXZlbnQudGFyZ2V0KS5uYW1lKSB7XHJcbiAgICAgICAgY2FzZSBcIlRyYW5zbGF0ZVhcIjpcclxuICAgICAgICAgIHRoaXMudHJhbnNsYXRlWChvdXRwdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIlRyYW5zbGF0ZVlcIjpcclxuICAgICAgICAgIHRoaXMudHJhbnNsYXRlWShvdXRwdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIlRyYW5zbGF0ZVpcIjpcclxuICAgICAgICAgIHRoaXMudHJhbnNsYXRlWihvdXRwdXQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBleHBvcnQgZW51bSBJTUFHRV9SRU5ERVJJTkcge1xyXG4gICAgQVVUTyA9IFwiYXV0b1wiLFxyXG4gICAgU01PT1RIID0gXCJzbW9vdGhcIixcclxuICAgIEhJR0hfUVVBTElUWSA9IFwiaGlnaC1xdWFsaXR5XCIsXHJcbiAgICBDUklTUF9FREdFUyA9IFwiY3Jpc3AtZWRnZXNcIixcclxuICAgIFBJWEVMQVRFRCA9IFwicGl4ZWxhdGVkXCJcclxuICB9XHJcbiAgLyoqXHJcbiAgICogQWRkcyBjb21mb3J0IG1ldGhvZHMgdG8gY3JlYXRlIGEgcmVuZGVyIGNhbnZhc1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDYW52YXMge1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoX2ZpbGxQYXJlbnQ6IGJvb2xlYW4gPSB0cnVlLCBfaW1hZ2VSZW5kZXJpbmc6IElNQUdFX1JFTkRFUklORyA9IElNQUdFX1JFTkRFUklORy5BVVRPLCBfd2lkdGg6IG51bWJlciA9IDgwMCwgX2hlaWdodDogbnVtYmVyID0gNjAwKTogSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgICBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICBjYW52YXMuaWQgPSBcIkZVREdFXCI7XHJcbiAgICAgIGxldCBzdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbiA9IGNhbnZhcy5zdHlsZTtcclxuICAgICAgc3R5bGUuaW1hZ2VSZW5kZXJpbmcgPSBfaW1hZ2VSZW5kZXJpbmc7XHJcbiAgICAgIHN0eWxlLndpZHRoID0gX3dpZHRoICsgXCJweFwiO1xyXG4gICAgICBzdHlsZS5oZWlnaHQgPSBfaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICBzdHlsZS5tYXJnaW5Cb3R0b20gPSBcIi0wLjI1ZW1cIjtcclxuICAgICAgXHJcbiAgICAgIGlmIChfZmlsbFBhcmVudCkge1xyXG4gICAgICAgIHN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNhbnZhcztcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIE5vZGUgZXh0ZW5kcyDGki5Ob2RlIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGNvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcgPSBOb2RlLmdldE5leHROYW1lKCksIF90cmFuc2Zvcm0/OiDGki5NYXRyaXg0eDQsIF9tYXRlcmlhbD86IMaSLk1hdGVyaWFsLCBfbWVzaD86IMaSLk1lc2gpIHtcclxuICAgICAgc3VwZXIoX25hbWUpO1xyXG4gICAgICBpZiAoX3RyYW5zZm9ybSlcclxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50VHJhbnNmb3JtKF90cmFuc2Zvcm0pKTtcclxuICAgICAgaWYgKF9tYXRlcmlhbClcclxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50TWF0ZXJpYWwoX21hdGVyaWFsKSk7XHJcbiAgICAgIGlmIChfbWVzaClcclxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50TWVzaChfbWVzaCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldE5leHROYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBcIsaSQWlkTm9kZV9cIiArIE5vZGUuY291bnQrKztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG10eE1lc2hQaXZvdCgpOiDGki5NYXRyaXg0eDQge1xyXG4gICAgICBsZXQgY21wTWVzaDogxpIuQ29tcG9uZW50TWVzaCA9IHRoaXMuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudE1lc2gpO1xyXG4gICAgICByZXR1cm4gY21wTWVzaCA/IGNtcE1lc2gubXR4UGl2b3QgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZXNlcmlhbGl6ZShfc2VyaWFsaXphdGlvbjogxpIuU2VyaWFsaXphdGlvbik6IFByb21pc2U8xpIuU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgIC8vIFF1aWNrIGFuZCBtYXliZSBoYWNreSBzb2x1dGlvbi4gQ3JlYXRlZCBub2RlIGlzIGNvbXBsZXRlbHkgZGlzbWlzc2VkIGFuZCBhIHJlY3JlYXRpb24gb2YgdGhlIGJhc2VjbGFzcyBnZXRzIHJldHVybi4gT3RoZXJ3aXNlLCBjb21wb25lbnRzIHdpbGwgYmUgZG91YmxlZC4uLlxyXG4gICAgICBsZXQgbm9kZTogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKF9zZXJpYWxpemF0aW9uLm5hbWUpO1xyXG4gICAgICBhd2FpdCBub2RlLmRlc2VyaWFsaXplKF9zZXJpYWxpemF0aW9uKTtcclxuICAgICAgLy8gY29uc29sZS5sb2cobm9kZSk7XHJcbiAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuXHJcbiAgZXhwb3J0IGNsYXNzIE5vZGVBcnJvdyBleHRlbmRzIE5vZGUge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW50ZXJuYWxSZXNvdXJjZXM6IE1hcDxzdHJpbmcsIMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPiA9IE5vZGVBcnJvdy5jcmVhdGVJbnRlcm5hbFJlc291cmNlcygpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcsIF9jb2xvcjogxpIuQ29sb3IpIHtcclxuICAgICAgc3VwZXIoX25hbWUsIMaSLk1hdHJpeDR4NC5JREVOVElUWSgpKTtcclxuXHJcbiAgICAgIGxldCBzaGFmdDogTm9kZSA9IG5ldyBOb2RlKF9uYW1lICsgXCJTaGFmdFwiLCDGki5NYXRyaXg0eDQuSURFTlRJVFkoKSwgPMaSLk1hdGVyaWFsPk5vZGVBcnJvdy5pbnRlcm5hbFJlc291cmNlcy5nZXQoXCJNYXRlcmlhbFwiKSwgPMaSLk1lc2g+Tm9kZUFycm93LmludGVybmFsUmVzb3VyY2VzLmdldChcIlNoYWZ0XCIpKTtcclxuICAgICAgbGV0IGhlYWQ6IE5vZGUgPSBuZXcgTm9kZShfbmFtZSArIFwiSGVhZFwiLCDGki5NYXRyaXg0eDQuSURFTlRJVFkoKSwgPMaSLk1hdGVyaWFsPk5vZGVBcnJvdy5pbnRlcm5hbFJlc291cmNlcy5nZXQoXCJNYXRlcmlhbFwiKSwgPMaSLk1lc2g+Tm9kZUFycm93LmludGVybmFsUmVzb3VyY2VzLmdldChcIkhlYWRcIikpO1xyXG4gICAgICBzaGFmdC5tdHhMb2NhbC5zY2FsZShuZXcgxpIuVmVjdG9yMygwLjAxLCAwLjAxLCAxKSk7XHJcbiAgICAgIGhlYWQubXR4TG9jYWwudHJhbnNsYXRlWigwLjUpO1xyXG4gICAgICBoZWFkLm10eExvY2FsLnNjYWxlKG5ldyDGki5WZWN0b3IzKDAuMDUsIDAuMDUsIDAuMSkpO1xyXG4gICAgICBoZWFkLm10eExvY2FsLnJvdGF0ZVgoOTApO1xyXG5cclxuICAgICAgc2hhZnQuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudE1hdGVyaWFsKS5jbHJQcmltYXJ5ID0gX2NvbG9yO1xyXG4gICAgICBoZWFkLmdldENvbXBvbmVudCjGki5Db21wb25lbnRNYXRlcmlhbCkuY2xyUHJpbWFyeSA9IF9jb2xvcjtcclxuXHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQoc2hhZnQpO1xyXG4gICAgICB0aGlzLmFkZENoaWxkKGhlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZUludGVybmFsUmVzb3VyY2VzKCk6IE1hcDxzdHJpbmcsIMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPiB7XHJcbiAgICAgIGxldCBtYXA6IE1hcDxzdHJpbmcsIMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPiA9IG5ldyBNYXAoKTtcclxuICAgICAgbWFwLnNldChcIlNoYWZ0XCIsIG5ldyDGki5NZXNoQ3ViZShcIkFycm93U2hhZnRcIikpO1xyXG4gICAgICBtYXAuc2V0KFwiSGVhZFwiLCBuZXcgxpIuTWVzaFB5cmFtaWQoXCJBcnJvd0hlYWRcIikpO1xyXG4gICAgICBsZXQgY29hdDogxpIuQ29hdENvbG9yZWQgPSBuZXcgxpIuQ29hdENvbG9yZWQoxpIuQ29sb3IuQ1NTKFwid2hpdGVcIikpO1xyXG4gICAgICBtYXAuc2V0KFwiTWF0ZXJpYWxcIiwgbmV3IMaSLk1hdGVyaWFsKFwiQXJyb3dcIiwgxpIuU2hhZGVyTGl0LCBjb2F0KSk7XHJcblxyXG4gICAgICBtYXAuZm9yRWFjaCgoX3Jlc291cmNlKSA9PiDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIoX3Jlc291cmNlKSk7XHJcbiAgICAgIHJldHVybiBtYXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjb2xvcihfY29sb3I6IMaSLkNvbG9yKSB7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuZ2V0Q2hpbGRyZW4oKSkge1xyXG4gICAgICAgIGNoaWxkLmdldENvbXBvbmVudCjGki5Db21wb25lbnRNYXRlcmlhbCkuY2xyUHJpbWFyeS5jb3B5KF9jb2xvcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIE5vZGVDb29yZGluYXRlU3lzdGVtIGV4dGVuZHMgTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihfbmFtZTogc3RyaW5nID0gXCJDb29yZGluYXRlU3lzdGVtXCIsIF90cmFuc2Zvcm0/OiDGki5NYXRyaXg0eDQpIHtcclxuICAgICAgc3VwZXIoX25hbWUsIF90cmFuc2Zvcm0pO1xyXG4gICAgICBsZXQgYXJyb3dSZWQ6IMaSLk5vZGUgPSBuZXcgTm9kZUFycm93KFwiQXJyb3dSZWRcIiwgbmV3IMaSLkNvbG9yKDEsIDAsIDAsIDEpKTtcclxuICAgICAgbGV0IGFycm93R3JlZW46IMaSLk5vZGUgPSBuZXcgTm9kZUFycm93KFwiQXJyb3dHcmVlblwiLCBuZXcgxpIuQ29sb3IoMCwgMSwgMCwgMSkpO1xyXG4gICAgICBsZXQgYXJyb3dCbHVlOiDGki5Ob2RlID0gbmV3IE5vZGVBcnJvdyhcIkFycm93Qmx1ZVwiLCBuZXcgxpIuQ29sb3IoMCwgMCwgMSwgMSkpO1xyXG5cclxuICAgICAgYXJyb3dSZWQubXR4TG9jYWwucm90YXRlWSg5MCk7XHJcbiAgICAgIGFycm93R3JlZW4ubXR4TG9jYWwucm90YXRlWCgtOTApO1xyXG5cclxuICAgICAgdGhpcy5hZGRDaGlsZChhcnJvd1JlZCk7XHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQoYXJyb3dHcmVlbik7XHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQoYXJyb3dCbHVlKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhIGxpZ2h0IHNldHVwIHRvIHRoZSBub2RlIGdpdmVuLCBjb25zaXN0aW5nIG9mIGFuIGFtYmllbnQgbGlnaHQsIGEgZGlyZWN0aW9uYWwga2V5IGxpZ2h0IGFuZCBhIGRpcmVjdGlvbmFsIGJhY2sgbGlnaHQuXHJcbiAgICogRXhlcHQgb2YgdGhlIG5vZGUgdG8gYmVjb21lIHRoZSBjb250YWluZXIsIGFsbCBwYXJhbWV0ZXJzIGFyZSBvcHRpb25hbCBhbmQgcHJvdmlkZWQgZGVmYXVsdCB2YWx1ZXMgZm9yIGdlbmVyYWwgcHVycG9zZS4gXHJcbiAgICovXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIGFkZFN0YW5kYXJkTGlnaHRDb21wb25lbnRzKFxyXG4gICAgX25vZGU6IMaSLk5vZGUsXHJcbiAgICBfY2xyQW1iaWVudDogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoMC4yLCAwLjIsIDAuMiksIF9jbHJLZXk6IMaSLkNvbG9yID0gbmV3IMaSLkNvbG9yKDAuOSwgMC45LCAwLjkpLCBfY2xyQmFjazogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoMC42LCAwLjYsIDAuNiksXHJcbiAgICBfcG9zS2V5OiDGki5WZWN0b3IzID0gbmV3IMaSLlZlY3RvcjMoNCwgMTIsIDgpLCBfcG9zQmFjazogxpIuVmVjdG9yMyA9IG5ldyDGki5WZWN0b3IzKC0xLCAtMC41LCAtMylcclxuICApOiB2b2lkIHtcclxuICAgIGxldCBrZXk6IMaSLkNvbXBvbmVudExpZ2h0ID0gbmV3IMaSLkNvbXBvbmVudExpZ2h0KG5ldyDGki5MaWdodERpcmVjdGlvbmFsKF9jbHJLZXkpKTtcclxuICAgIGtleS5tdHhQaXZvdC50cmFuc2xhdGUoX3Bvc0tleSk7XHJcbiAgICBrZXkubXR4UGl2b3QubG9va0F0KMaSLlZlY3RvcjMuWkVSTygpKTtcclxuXHJcbiAgICBsZXQgYmFjazogxpIuQ29tcG9uZW50TGlnaHQgPSBuZXcgxpIuQ29tcG9uZW50TGlnaHQobmV3IMaSLkxpZ2h0RGlyZWN0aW9uYWwoX2NsckJhY2spKTtcclxuICAgIGJhY2subXR4UGl2b3QudHJhbnNsYXRlKF9wb3NCYWNrKTtcclxuICAgIGJhY2subXR4UGl2b3QubG9va0F0KMaSLlZlY3RvcjMuWkVSTygpKTtcclxuXHJcbiAgICBsZXQgYW1iaWVudDogxpIuQ29tcG9uZW50TGlnaHQgPSBuZXcgxpIuQ29tcG9uZW50TGlnaHQobmV3IMaSLkxpZ2h0QW1iaWVudChfY2xyQW1iaWVudCkpO1xyXG5cclxuICAgIF9ub2RlLmFkZENvbXBvbmVudChrZXkpO1xyXG4gICAgX25vZGUuYWRkQ29tcG9uZW50KGJhY2spO1xyXG4gICAgX25vZGUuYWRkQ29tcG9uZW50KGFtYmllbnQpO1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBIYW5kbGVzIHRoZSBhbmltYXRpb24gY3ljbGUgb2YgYSBzcHJpdGUgb24gYSBbW05vZGVdXVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBOb2RlU3ByaXRlIGV4dGVuZHMgxpIuTm9kZSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtZXNoOiDGki5NZXNoU3ByaXRlID0gTm9kZVNwcml0ZS5jcmVhdGVJbnRlcm5hbFJlc291cmNlKCk7XHJcbiAgICBwdWJsaWMgZnJhbWVyYXRlOiBudW1iZXIgPSAxMjsgLy8gYW5pbWF0aW9uIGZyYW1lcyBwZXIgc2Vjb25kLCBzaW5nbGUgZnJhbWVzIGNhbiBiZSBzaG9ydGVyIG9yIGxvbmdlciBiYXNlZCBvbiB0aGVpciB0aW1lc2NhbGVcclxuXHJcbiAgICBwcml2YXRlIGNtcE1lc2g6IMaSLkNvbXBvbmVudE1lc2g7XHJcbiAgICBwcml2YXRlIGNtcE1hdGVyaWFsOiDGki5Db21wb25lbnRNYXRlcmlhbDtcclxuICAgIHByaXZhdGUgYW5pbWF0aW9uOiBTcHJpdGVTaGVldEFuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgZnJhbWVDdXJyZW50OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBkaXJlY3Rpb246IG51bWJlciA9IDE7XHJcbiAgICBwcml2YXRlIHRpbWVyOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoX25hbWUpO1xyXG5cclxuICAgICAgdGhpcy5jbXBNZXNoID0gbmV3IMaSLkNvbXBvbmVudE1lc2goTm9kZVNwcml0ZS5tZXNoKTtcclxuICAgICAgLy8gRGVmaW5lIGNvYXQgZnJvbSB0aGUgU3ByaXRlU2hlZXQgdG8gdXNlIHdoZW4gcmVuZGVyaW5nXHJcbiAgICAgIHRoaXMuY21wTWF0ZXJpYWwgPSBuZXcgxpIuQ29tcG9uZW50TWF0ZXJpYWwobmV3IMaSLk1hdGVyaWFsKF9uYW1lLCDGki5TaGFkZXJMaXRUZXh0dXJlZCwgbnVsbCkpO1xyXG4gICAgICB0aGlzLmFkZENvbXBvbmVudCh0aGlzLmNtcE1lc2gpO1xyXG4gICAgICB0aGlzLmFkZENvbXBvbmVudCh0aGlzLmNtcE1hdGVyaWFsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVJbnRlcm5hbFJlc291cmNlKCk6IMaSLk1lc2hTcHJpdGUge1xyXG4gICAgICBsZXQgbWVzaDogxpIuTWVzaFNwcml0ZSA9IG5ldyDGki5NZXNoU3ByaXRlKFwiU3ByaXRlXCIpO1xyXG4gICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIobWVzaCk7XHJcbiAgICAgIHJldHVybiBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMgdGhlIG51bWJlciBvZiB0aGUgY3VycmVudCBmcmFtZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGdldEN1cnJlbnRGcmFtZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5mcmFtZUN1cnJlbnQ7IH0gLy9Ub0RvOiBzZWUgaWYgZ2V0ZnJhbWVDdXJyZW50IGlzIHByb2JsZW1hdGljXHJcblxyXG4gICAgcHVibGljIHNldEFuaW1hdGlvbihfYW5pbWF0aW9uOiBTcHJpdGVTaGVldEFuaW1hdGlvbik6IHZvaWQge1xyXG4gICAgICB0aGlzLmFuaW1hdGlvbiA9IF9hbmltYXRpb247XHJcbiAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbigpO1xyXG4gICAgICB0aGlzLnNob3dGcmFtZSgwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RvcEFuaW1hdGlvbigpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMudGltZXIpXHJcbiAgICAgICAgxpIuVGltZS5nYW1lLmRlbGV0ZVRpbWVyKHRoaXMudGltZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvdyBhIHNwZWNpZmljIGZyYW1lIG9mIHRoZSBzZXF1ZW5jZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvd0ZyYW1lKF9pbmRleDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbigpO1xyXG4gICAgICBsZXQgc3ByaXRlRnJhbWU6IFNwcml0ZUZyYW1lID0gdGhpcy5hbmltYXRpb24uZnJhbWVzW19pbmRleF07XHJcbiAgICAgIHRoaXMuY21wTWVzaC5tdHhQaXZvdCA9IHNwcml0ZUZyYW1lLm10eFBpdm90O1xyXG4gICAgICB0aGlzLmNtcE1hdGVyaWFsLm10eFBpdm90ID0gc3ByaXRlRnJhbWUubXR4VGV4dHVyZTtcclxuICAgICAgdGhpcy5jbXBNYXRlcmlhbC5tYXRlcmlhbC5jb2F0ID0gdGhpcy5hbmltYXRpb24uc3ByaXRlc2hlZXQ7XHJcbiAgICAgIHRoaXMuZnJhbWVDdXJyZW50ID0gX2luZGV4O1xyXG4gICAgICB0aGlzLnRpbWVyID0gxpIuVGltZS5nYW1lLnNldFRpbWVyKHNwcml0ZUZyYW1lLnRpbWVTY2FsZSAqIDEwMDAgLyB0aGlzLmZyYW1lcmF0ZSwgMSwgdGhpcy5zaG93RnJhbWVOZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgdGhlIG5leHQgZnJhbWUgb2YgdGhlIHNlcXVlbmNlIG9yIHN0YXJ0IGFuZXcgd2hlbiB0aGUgZW5kIG9yIHRoZSBzdGFydCB3YXMgcmVhY2hlZCwgYWNjb3JkaW5nIHRvIHRoZSBkaXJlY3Rpb24gb2YgcGxheWluZ1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvd0ZyYW1lTmV4dCA9IChfZXZlbnQ6IMaSLkV2ZW50VGltZXIpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5mcmFtZUN1cnJlbnQgPSAodGhpcy5mcmFtZUN1cnJlbnQgKyB0aGlzLmRpcmVjdGlvbiArIHRoaXMuYW5pbWF0aW9uLmZyYW1lcy5sZW5ndGgpICUgdGhpcy5hbmltYXRpb24uZnJhbWVzLmxlbmd0aDtcclxuICAgICAgdGhpcy5zaG93RnJhbWUodGhpcy5mcmFtZUN1cnJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGRpcmVjdGlvbiBmb3IgYW5pbWF0aW9uIHBsYXliYWNrLCBuZWdhdGl2IG51bWJlcnMgbWFrZSBpdCBwbGF5IGJhY2t3YXJkcy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEZyYW1lRGlyZWN0aW9uKF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IE1hdGguZmxvb3IoX2RpcmVjdGlvbik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIERlc2NyaWJlcyBhIHNpbmdsZSBmcmFtZSBvZiBhIHNwcml0ZSBhbmltYXRpb25cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgU3ByaXRlRnJhbWUge1xyXG4gICAgcHVibGljIHJlY3RUZXh0dXJlOiDGki5SZWN0YW5nbGU7XHJcbiAgICBwdWJsaWMgbXR4UGl2b3Q6IMaSLk1hdHJpeDR4NDtcclxuICAgIHB1YmxpYyBtdHhUZXh0dXJlOiDGki5NYXRyaXgzeDM7XHJcbiAgICBwdWJsaWMgdGltZVNjYWxlOiBudW1iZXI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb252ZW5pZW5jZSBmb3IgY3JlYXRpbmcgYSBbW0NvYXRUZXh0dXJlXV0gdG8gdXNlIGFzIHNwcml0ZXNoZWV0XHJcbiAgICovXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNwcml0ZVNoZWV0KF9uYW1lOiBzdHJpbmcsIF9pbWFnZTogSFRNTEltYWdlRWxlbWVudCk6IMaSLkNvYXRUZXh0dXJlZCB7XHJcbiAgICBsZXQgY29hdDogxpIuQ29hdFRleHR1cmVkID0gbmV3IMaSLkNvYXRUZXh0dXJlZCgpO1xyXG4gICAgbGV0IHRleHR1cmU6IMaSLlRleHR1cmVJbWFnZSA9IG5ldyDGki5UZXh0dXJlSW1hZ2UoKTtcclxuICAgIHRleHR1cmUuaW1hZ2UgPSBfaW1hZ2U7XHJcbiAgICBjb2F0LnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gICAgcmV0dXJuIGNvYXQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIb2xkcyBTcHJpdGVTaGVldEFuaW1hdGlvbnMgaW4gYW4gYXNzb2NpYXRpdmUgaGllcmFyY2hpY2FsIGFycmF5XHJcbiAgICovXHJcbiAgZXhwb3J0IGludGVyZmFjZSBTcHJpdGVTaGVldEFuaW1hdGlvbnMge1xyXG4gICAgW2tleTogc3RyaW5nXTogU3ByaXRlU2hlZXRBbmltYXRpb24gfCBTcHJpdGVTaGVldEFuaW1hdGlvbnM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVzIGEgc2VyaWVzIG9mIFtbU3ByaXRlRnJhbWVdXXMgdG8gYmUgbWFwcGVkIG9udG8gYSBbW01lc2hTcHJpdGVdXVxyXG4gICAqIENvbnRhaW5zIHRoZSBbW01lc2hTcHJpdGVdXSwgdGhlIFtbTWF0ZXJpYWxdXSBhbmQgdGhlIHNwcml0ZXNoZWV0LXRleHR1cmVcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgU3ByaXRlU2hlZXRBbmltYXRpb24ge1xyXG4gICAgcHVibGljIGZyYW1lczogU3ByaXRlRnJhbWVbXSA9IFtdO1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBzcHJpdGVzaGVldDogxpIuQ29hdFRleHR1cmVkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbmFtZTogc3RyaW5nLCBfc3ByaXRlc2hlZXQ6IMaSLkNvYXRUZXh0dXJlZCkge1xyXG4gICAgICB0aGlzLm5hbWUgPSBfbmFtZTtcclxuICAgICAgdGhpcy5zcHJpdGVzaGVldCA9IF9zcHJpdGVzaGVldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhIHNlcmllcyBvZiBmcmFtZXMgaW4gdGhpcyBbW1Nwcml0ZV1dLCBjYWxjdWxhdGluZyB0aGUgbWF0cmljZXMgdG8gdXNlIGluIHRoZSBjb21wb25lbnRzIG9mIGEgW1tOb2RlU3ByaXRlXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdlbmVyYXRlKF9yZWN0czogxpIuUmVjdGFuZ2xlW10sIF9yZXNvbHV0aW9uUXVhZDogbnVtYmVyLCBfb3JpZ2luOiDGki5PUklHSU4yRCk6IHZvaWQge1xyXG4gICAgICBsZXQgaW1nOiBUZXhJbWFnZVNvdXJjZSA9IHRoaXMuc3ByaXRlc2hlZXQudGV4dHVyZS50ZXhJbWFnZVNvdXJjZTtcclxuICAgICAgdGhpcy5mcmFtZXMgPSBbXTtcclxuICAgICAgbGV0IGZyYW1pbmc6IMaSLkZyYW1pbmdTY2FsZWQgPSBuZXcgxpIuRnJhbWluZ1NjYWxlZCgpO1xyXG4gICAgICBmcmFtaW5nLnNldFNjYWxlKDEgLyBpbWcud2lkdGgsIDEgLyBpbWcuaGVpZ2h0KTtcclxuXHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgcmVjdCBvZiBfcmVjdHMpIHtcclxuICAgICAgICBsZXQgZnJhbWU6IFNwcml0ZUZyYW1lID0gdGhpcy5jcmVhdGVGcmFtZSh0aGlzLm5hbWUgKyBgJHtjb3VudH1gLCBmcmFtaW5nLCByZWN0LCBfcmVzb2x1dGlvblF1YWQsIF9vcmlnaW4pO1xyXG4gICAgICAgIGZyYW1lLnRpbWVTY2FsZSA9IDE7XHJcbiAgICAgICAgdGhpcy5mcmFtZXMucHVzaChmcmFtZSk7XHJcblxyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBzcHJpdGUgZnJhbWVzIHVzaW5nIGEgZ3JpZCBvbiB0aGUgc3ByaXRlc2hlZXQgZGVmaW5lZCBieSBhIHJlY3RhbmdsZSB0byBzdGFydCB3aXRoLCB0aGUgbnVtYmVyIG9mIGZyYW1lcywgXHJcbiAgICAgKiB0aGUgcmVzb2x1dGlvbiB3aGljaCBkZXRlcm1pbmVzIHRoZSBzaXplIG9mIHRoZSBzcHJpdGVzIG1lc2ggYmFzZWQgb24gdGhlIG51bWJlciBvZiBwaXhlbHMgb2YgdGhlIHRleHR1cmUgZnJhbWUsXHJcbiAgICAgKiB0aGUgb2Zmc2V0IGZyb20gb25lIGNlbGwgb2YgdGhlIGdyaWQgdG8gdGhlIG5leHQgaW4gdGhlIHNlcXVlbmNlIGFuZCwgaW4gY2FzZSB0aGUgc2VxdWVuY2Ugc3BhbnMgb3ZlciBtb3JlIHRoYW4gb25lIHJvdyBvciBjb2x1bW4sXHJcbiAgICAgKiB0aGUgb2Zmc2V0IHRvIG1vdmUgdGhlIHN0YXJ0IHJlY3RhbmdsZSB3aGVuIHRoZSBtYXJnaW4gb2YgdGhlIHRleHR1cmUgaXMgcmVhY2hlZCBhbmQgd3JhcHBpbmcgb2NjdXJzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2VuZXJhdGVCeUdyaWQoX3N0YXJ0UmVjdDogxpIuUmVjdGFuZ2xlLCBfZnJhbWVzOiBudW1iZXIsIF9yZXNvbHV0aW9uUXVhZDogbnVtYmVyLCBfb3JpZ2luOiDGki5PUklHSU4yRCwgX29mZnNldE5leHQ6IMaSLlZlY3RvcjIsIF9vZmZzZXRXcmFwOiDGki5WZWN0b3IyID0gxpIuVmVjdG9yMi5aRVJPKCkpOiB2b2lkIHtcclxuICAgICAgbGV0IGltZzogVGV4SW1hZ2VTb3VyY2UgPSB0aGlzLnNwcml0ZXNoZWV0LnRleHR1cmUudGV4SW1hZ2VTb3VyY2U7XHJcbiAgICAgIGxldCByZWN0SW1hZ2U6IMaSLlJlY3RhbmdsZSA9IG5ldyDGki5SZWN0YW5nbGUoMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcclxuICAgICAgbGV0IHJlY3Q6IMaSLlJlY3RhbmdsZSA9IF9zdGFydFJlY3QuY2xvbmU7XHJcbiAgICAgIGxldCByZWN0czogxpIuUmVjdGFuZ2xlW10gPSBbXTtcclxuICAgICAgd2hpbGUgKF9mcmFtZXMtLSkge1xyXG4gICAgICAgIHJlY3RzLnB1c2gocmVjdC5jbG9uZSk7XHJcbiAgICAgICAgcmVjdC5wb3NpdGlvbi5hZGQoX29mZnNldE5leHQpO1xyXG5cclxuICAgICAgICBpZiAocmVjdEltYWdlLmNvdmVycyhyZWN0KSlcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBfc3RhcnRSZWN0LnBvc2l0aW9uLmFkZChfb2Zmc2V0V3JhcCk7XHJcbiAgICAgICAgcmVjdCA9IF9zdGFydFJlY3QuY2xvbmU7XHJcbiAgICAgICAgaWYgKCFyZWN0SW1hZ2UuY292ZXJzKHJlY3QpKVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlY3RzLmZvckVhY2goKF9yZWN0OiDGki5SZWN0YW5nbGUpID0+IMaSLkRlYnVnLmxvZyhfcmVjdC50b1N0cmluZygpKSk7XHJcbiAgICAgIHRoaXMuZ2VuZXJhdGUocmVjdHMsIF9yZXNvbHV0aW9uUXVhZCwgX29yaWdpbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVGcmFtZShfbmFtZTogc3RyaW5nLCBfZnJhbWluZzogxpIuRnJhbWluZ1NjYWxlZCwgX3JlY3Q6IMaSLlJlY3RhbmdsZSwgX3Jlc29sdXRpb25RdWFkOiBudW1iZXIsIF9vcmlnaW46IMaSLk9SSUdJTjJEKTogU3ByaXRlRnJhbWUge1xyXG4gICAgICBsZXQgaW1nOiBUZXhJbWFnZVNvdXJjZSA9IHRoaXMuc3ByaXRlc2hlZXQudGV4dHVyZS50ZXhJbWFnZVNvdXJjZTtcclxuICAgICAgbGV0IHJlY3RUZXh0dXJlOiDGki5SZWN0YW5nbGUgPSBuZXcgxpIuUmVjdGFuZ2xlKDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICAgIGxldCBmcmFtZTogU3ByaXRlRnJhbWUgPSBuZXcgU3ByaXRlRnJhbWUoKTtcclxuXHJcbiAgICAgIGZyYW1lLnJlY3RUZXh0dXJlID0gX2ZyYW1pbmcuZ2V0UmVjdChfcmVjdCk7XHJcbiAgICAgIGZyYW1lLnJlY3RUZXh0dXJlLnBvc2l0aW9uID0gX2ZyYW1pbmcuZ2V0UG9pbnQoX3JlY3QucG9zaXRpb24sIHJlY3RUZXh0dXJlKTtcclxuXHJcbiAgICAgIGxldCByZWN0UXVhZDogxpIuUmVjdGFuZ2xlID0gbmV3IMaSLlJlY3RhbmdsZSgwLCAwLCBfcmVjdC53aWR0aCAvIF9yZXNvbHV0aW9uUXVhZCwgX3JlY3QuaGVpZ2h0IC8gX3Jlc29sdXRpb25RdWFkLCBfb3JpZ2luKTtcclxuICAgICAgZnJhbWUubXR4UGl2b3QgPSDGki5NYXRyaXg0eDQuSURFTlRJVFkoKTtcclxuICAgICAgZnJhbWUubXR4UGl2b3QudHJhbnNsYXRlKG5ldyDGki5WZWN0b3IzKHJlY3RRdWFkLnBvc2l0aW9uLnggKyByZWN0UXVhZC5zaXplLnggLyAyLCAtcmVjdFF1YWQucG9zaXRpb24ueSAtIHJlY3RRdWFkLnNpemUueSAvIDIsIDApKTtcclxuICAgICAgZnJhbWUubXR4UGl2b3Quc2NhbGVYKHJlY3RRdWFkLnNpemUueCk7XHJcbiAgICAgIGZyYW1lLm10eFBpdm90LnNjYWxlWShyZWN0UXVhZC5zaXplLnkpO1xyXG4gICAgICAvLyDGki5EZWJ1Zy5sb2cocmVjdFF1YWQudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICBmcmFtZS5tdHhUZXh0dXJlID0gxpIuTWF0cml4M3gzLklERU5USVRZKCk7XHJcbiAgICAgIGZyYW1lLm10eFRleHR1cmUudHJhbnNsYXRlKGZyYW1lLnJlY3RUZXh0dXJlLnBvc2l0aW9uKTtcclxuICAgICAgZnJhbWUubXR4VGV4dHVyZS5zY2FsZShmcmFtZS5yZWN0VGV4dHVyZS5zaXplKTtcclxuXHJcbiAgICAgIHJldHVybiBmcmFtZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBcclxuICBleHBvcnQgY2xhc3MgQ29tcG9uZW50U3RhdGVNYWNoaW5lPFN0YXRlPiBleHRlbmRzIMaSLkNvbXBvbmVudFNjcmlwdCBpbXBsZW1lbnRzIFN0YXRlTWFjaGluZTxTdGF0ZT4ge1xyXG4gICAgcHVibGljIHN0YXRlQ3VycmVudDogU3RhdGU7XHJcbiAgICBwdWJsaWMgc3RhdGVOZXh0OiBTdGF0ZTtcclxuICAgIHB1YmxpYyBpbnN0cnVjdGlvbnM6IFN0YXRlTWFjaGluZUluc3RydWN0aW9uczxTdGF0ZT47XHJcblxyXG4gICAgcHVibGljIHRyYW5zaXQoX25leHQ6IFN0YXRlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLnRyYW5zaXQodGhpcy5zdGF0ZUN1cnJlbnQsIF9uZXh0LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWN0KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmluc3RydWN0aW9ucy5hY3QodGhpcy5zdGF0ZUN1cnJlbnQsIHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8qKlxyXG4gKiBTdGF0ZSBtYWNoaW5lIG9mZmVycyBhIHN0cnVjdHVyZSBhbmQgZnVuZGFtZW50YWwgZnVuY3Rpb25hbGl0eSBmb3Igc3RhdGUgbWFjaGluZXNcclxuICogPFN0YXRlPiBzaG91bGQgYmUgYW4gZW51bSBkZWZpbmluZyB0aGUgdmFyaW91cyBzdGF0ZXMgb2YgdGhlIG1hY2hpbmVcclxuICovXHJcblxyXG5uYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIC8qKiBGb3JtYXQgb2YgbWV0aG9kcyB0byBiZSB1c2VkIGFzIHRyYW5zaXRpb25zIG9yIGFjdGlvbnMgKi9cclxuICB0eXBlIFN0YXRlTWFjaGluZU1ldGhvZDxTdGF0ZT4gPSAoX21hY2hpbmU6IFN0YXRlTWFjaGluZTxTdGF0ZT4pID0+IHZvaWQ7XHJcbiAgLyoqIFR5cGUgZm9yIG1hcHMgYXNzb2NpYXRpbmcgYSBzdGF0ZSB0byBhIG1ldGhvZCAqL1xyXG4gIHR5cGUgU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZDxTdGF0ZT4gPSBNYXA8U3RhdGUsIFN0YXRlTWFjaGluZU1ldGhvZDxTdGF0ZT4+O1xyXG4gIC8qKiBJbnRlcmZhY2UgbWFwcGluZyBhIHN0YXRlIHRvIG9uZSBhY3Rpb24gbXVsdGlwbGUgdHJhbnNpdGlvbnMgKi9cclxuICBpbnRlcmZhY2UgU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+IHtcclxuICAgIGFjdGlvbjogU3RhdGVNYWNoaW5lTWV0aG9kPFN0YXRlPjtcclxuICAgIHRyYW5zaXRpb25zOiBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kPFN0YXRlPjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvcmUgZnVuY3Rpb25hbGl0eSBvZiB0aGUgc3RhdGUgbWFjaGluZSwgaG9sZGluZyBzb2xlbHkgdGhlIGN1cnJlbnQgc3RhdGUgYW5kLCB3aGlsZSBpbiB0cmFuc2l0aW9uLCB0aGUgbmV4dCBzdGF0ZSxcclxuICAgKiB0aGUgaW5zdHJ1Y3Rpb25zIGZvciB0aGUgbWFjaGluZSBhbmQgY29tZm9ydCBtZXRob2RzIHRvIHRyYW5zaXQgYW5kIGFjdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgU3RhdGVNYWNoaW5lPFN0YXRlPiB7XHJcbiAgICBwdWJsaWMgc3RhdGVDdXJyZW50OiBTdGF0ZTtcclxuICAgIHB1YmxpYyBzdGF0ZU5leHQ6IFN0YXRlO1xyXG4gICAgcHVibGljIGluc3RydWN0aW9uczogU3RhdGVNYWNoaW5lSW5zdHJ1Y3Rpb25zPFN0YXRlPjtcclxuXHJcbiAgICBwdWJsaWMgdHJhbnNpdChfbmV4dDogU3RhdGUpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbnN0cnVjdGlvbnMudHJhbnNpdCh0aGlzLnN0YXRlQ3VycmVudCwgX25leHQsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3QoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLmFjdCh0aGlzLnN0YXRlQ3VycmVudCwgdGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgb2YgaW5zdHJ1Y3Rpb25zIGZvciBhIHN0YXRlIG1hY2hpbmUuIFRoZSBzZXQga2VlcHMgYWxsIG1ldGhvZHMgZm9yIGRlZGljYXRlZCBhY3Rpb25zIGRlZmluZWQgZm9yIHRoZSBzdGF0ZXNcclxuICAgKiBhbmQgYWxsIGRlZGljYXRlZCBtZXRob2RzIGRlZmluZWQgZm9yIHRyYW5zaXRpb25zIHRvIG90aGVyIHN0YXRlcywgYXMgd2VsbCBhcyBkZWZhdWx0IG1ldGhvZHMuXHJcbiAgICogSW5zdHJ1Y3Rpb25zIGV4aXN0IGluZGVwZW5kZW50bHkgZnJvbSBTdGF0ZU1hY2hpbmVzLiBBIHN0YXRlbWFjaGluZSBpbnN0YW5jZSBpcyBwYXNzZWQgYXMgcGFyYW1ldGVyIHRvIHRoZSBpbnN0cnVjdGlvbiBzZXQuXHJcbiAgICogTXVsdGlwbGUgc3RhdGVtYWNoaW5lLWluc3RhbmNlcyBjYW4gdGh1cyB1c2UgdGhlIHNhbWUgaW5zdHJ1Y3Rpb24gc2V0IGFuZCBkaWZmZXJlbnQgaW5zdHJ1Y3Rpb24gc2V0cyBjb3VsZCBvcGVyYXRlIG9uIHRoZSBzYW1lIHN0YXRlbWFjaGluZS5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgU3RhdGVNYWNoaW5lSW5zdHJ1Y3Rpb25zPFN0YXRlPiBleHRlbmRzIE1hcDxTdGF0ZSwgU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+PiB7XHJcbiAgICAvKiogRGVmaW5lIGRlZGljYXRlZCB0cmFuc2l0aW9uIG1ldGhvZCB0byB0cmFuc2l0IGZyb20gb25lIHN0YXRlIHRvIGFub3RoZXIqL1xyXG4gICAgcHVibGljIHNldFRyYW5zaXRpb24oX2N1cnJlbnQ6IFN0YXRlLCBfbmV4dDogU3RhdGUsIF90cmFuc2l0aW9uOiBTdGF0ZU1hY2hpbmVNZXRob2Q8U3RhdGU+KTogdm9pZCB7XHJcbiAgICAgIGxldCBhY3RpdmU6IFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPiA9IHRoaXMuZ2V0U3RhdGVNZXRob2RzKF9jdXJyZW50KTtcclxuICAgICAgYWN0aXZlLnRyYW5zaXRpb25zLnNldChfbmV4dCwgX3RyYW5zaXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBEZWZpbmUgZGVkaWNhdGVkIGFjdGlvbiBtZXRob2QgZm9yIGEgc3RhdGUgKi9cclxuICAgIHB1YmxpYyBzZXRBY3Rpb24oX2N1cnJlbnQ6IFN0YXRlLCBfYWN0aW9uOiBTdGF0ZU1hY2hpbmVNZXRob2Q8U3RhdGU+KTogdm9pZCB7XHJcbiAgICAgIGxldCBhY3RpdmU6IFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPiA9IHRoaXMuZ2V0U3RhdGVNZXRob2RzKF9jdXJyZW50KTtcclxuICAgICAgYWN0aXZlLmFjdGlvbiA9IF9hY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIERlZmF1bHQgdHJhbnNpdGlvbiBtZXRob2QgdG8gaW52b2tlIGlmIG5vIGRlZGljYXRlZCB0cmFuc2l0aW9uIGV4aXN0cywgc2hvdWxkIGJlIG92ZXJyaWRlbiBpbiBzdWJjbGFzcyAqL1xyXG4gICAgcHVibGljIHRyYW5zaXREZWZhdWx0KF9tYWNoaW5lOiBTdGF0ZU1hY2hpbmU8U3RhdGU+KTogdm9pZCB7XHJcbiAgICAgIC8vXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBEZWZhdWx0IGFjdGlvbiBtZXRob2QgdG8gaW52b2tlIGlmIG5vIGRlZGljYXRlZCBhY3Rpb24gZXhpc3RzLCBzaG91bGQgYmUgb3ZlcnJpZGVuIGluIHN1YmNsYXNzICovXHJcbiAgICBwdWJsaWMgYWN0RGVmYXVsdChfbWFjaGluZTogU3RhdGVNYWNoaW5lPFN0YXRlPik6IHZvaWQge1xyXG4gICAgICAvL1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBJbnZva2UgYSBkZWRpY2F0ZWQgdHJhbnNpdGlvbiBtZXRob2QgaWYgZm91bmQgZm9yIHRoZSBjdXJyZW50IGFuZCB0aGUgbmV4dCBzdGF0ZSwgb3IgdGhlIGRlZmF1bHQgbWV0aG9kICovXHJcbiAgICBwdWJsaWMgdHJhbnNpdChfY3VycmVudDogU3RhdGUsIF9uZXh0OiBTdGF0ZSwgX21hY2hpbmU6IFN0YXRlTWFjaGluZTxTdGF0ZT4pOiB2b2lkIHtcclxuICAgICAgX21hY2hpbmUuc3RhdGVOZXh0ID0gX25leHQ7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGFjdGl2ZTogU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+ID0gdGhpcy5nZXQoX2N1cnJlbnQpO1xyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uOiBTdGF0ZU1hY2hpbmVNZXRob2Q8U3RhdGU+ID0gYWN0aXZlLnRyYW5zaXRpb25zLmdldChfbmV4dCk7XHJcbiAgICAgICAgdHJhbnNpdGlvbihfbWFjaGluZSk7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyhfZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy50cmFuc2l0RGVmYXVsdChfbWFjaGluZSk7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgX21hY2hpbmUuc3RhdGVDdXJyZW50ID0gX25leHQ7XHJcbiAgICAgICAgX21hY2hpbmUuc3RhdGVOZXh0ID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEludm9rZSB0aGUgZGVkaWNhdGVkIGFjdGlvbiBtZXRob2QgaWYgZm91bmQgZm9yIHRoZSBjdXJyZW50IHN0YXRlLCBvciB0aGUgZGVmYXVsdCBtZXRob2QgKi9cclxuICAgIHB1YmxpYyBhY3QoX2N1cnJlbnQ6IFN0YXRlLCBfbWFjaGluZTogU3RhdGVNYWNoaW5lPFN0YXRlPik6IHZvaWQge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCBhY3RpdmU6IFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPiA9IHRoaXMuZ2V0KF9jdXJyZW50KTtcclxuICAgICAgICBhY3RpdmUuYWN0aW9uKF9tYWNoaW5lKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKF9lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB0aGlzLmFjdERlZmF1bHQoX21hY2hpbmUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEZpbmQgdGhlIGluc3RydWN0aW9ucyBkZWRpY2F0ZWQgZm9yIHRoZSBjdXJyZW50IHN0YXRlIG9yIGNyZWF0ZSBhbiBlbXB0eSBzZXQgZm9yIGl0ICovXHJcbiAgICBwcml2YXRlIGdldFN0YXRlTWV0aG9kcyhfY3VycmVudDogU3RhdGUpOiBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kczxTdGF0ZT4ge1xyXG4gICAgICBsZXQgYWN0aXZlOiBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kczxTdGF0ZT4gPSB0aGlzLmdldChfY3VycmVudCk7XHJcbiAgICAgIGlmICghYWN0aXZlKSB7XHJcbiAgICAgICAgYWN0aXZlID0geyBhY3Rpb246IG51bGwsIHRyYW5zaXRpb25zOiBuZXcgTWFwKCkgfTtcclxuICAgICAgICB0aGlzLnNldChfY3VycmVudCwgYWN0aXZlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYWN0aXZlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBBbGxvd3MgdG8gdHJhbnNsYXRlLCByb3RhdGUgYW5kIHNjYWxlIG1hdHJpY2VzIHZpc3VhbGx5IGJ5IGRyYWdnaW5nIHdpdGggYSBwb2ludGVyLiBcclxuICAgKiBJbnN0YWxscyBwb2ludGVyIGV2ZW50IGxpc3RlbmVycyBvbiB0aGUgZ2l2ZW4ge0BsaW5rIMaSLlZpZXdwb3J0fXMgY2FudmFzIG9uIGNvbnN0cnVjdGlvbi4gXHJcbiAgICogVXNlIHtAbGluayBhZGRMaXN0ZW5lcnN9L3tAbGluayByZW1vdmVMaXN0ZW5lcnN9IHRvIGhhbmRsZSB0aGUgaW5zdGFsbGF0aW9uIG1hbnVhbGx5LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1hdG9yIHtcclxuICAgIHB1YmxpYyByZWFkb25seSB2aWV3cG9ydDogxpIuVmlld3BvcnQ7XHJcblxyXG4gICAgcHVibGljIG1vZGU6IFwibm9uZVwiIHwgXCJ0cmFuc2xhdGVcIiB8IFwicm90YXRlXCIgfCBcInNjYWxlXCIgPSBcInRyYW5zbGF0ZVwiO1xyXG4gICAgcHVibGljIHNwYWNlOiBcImxvY2FsXCIgfCBcIndvcmxkXCIgPSBcIndvcmxkXCI7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWQ6IFwieFwiIHwgXCJ5XCIgfCBcInpcIiB8IFwieHlcIiB8IFwieHpcIiB8IFwieXpcIiB8IFwieHl6XCI7XHJcblxyXG4gICAgcHVibGljIHNuYXBBbmdsZTogbnVtYmVyID0gMTU7IC8vIDE1IGRlZ3JlZVxyXG4gICAgcHVibGljIHNuYXBEaXN0YW5jZTogbnVtYmVyID0gMC4xOyAvLyAwLjEgdW5pdHNcclxuICAgIHB1YmxpYyBzbmFwU2NhbGU6IG51bWJlciA9IDAuMTsgLy8gMTAlXHJcblxyXG4gICAgcHVibGljIGNvbG9ycyA9IHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICBiYXNlOiB7XHJcbiAgICAgICAgeDogxpIuQ29sb3IuQ1NTKFwicmVkXCIpLFxyXG4gICAgICAgIHk6IMaSLkNvbG9yLkNTUyhcImxpbWVncmVlblwiKSxcclxuICAgICAgICB6OiDGki5Db2xvci5DU1MoXCJibHVlXCIpLFxyXG4gICAgICAgIHh5ejogxpIuQ29sb3IuQ1NTKFwiZ2FpbnNib3JvXCIpXHJcbiAgICAgIH0sXHJcbiAgICAgIGxpdGU6IHtcclxuICAgICAgICB4OiDGki5Db2xvci5DU1MoXCJzYWxtb25cIiksXHJcbiAgICAgICAgeTogxpIuQ29sb3IuQ1NTKFwibGlnaHRncmVlblwiKSxcclxuICAgICAgICB6OiDGki5Db2xvci5DU1MoXCJjb3JuZmxvd2VyYmx1ZVwiKSxcclxuICAgICAgICB4eXo6IMaSLkNvbG9yLkNTUyhcImdob3N0d2hpdGVcIilcclxuICAgICAgfSxcclxuICAgICAgdHJhbnNwYXJlbnQ6IHtcclxuICAgICAgICB4OiDGki5Db2xvci5DU1MoXCJzYWxtb25cIiwgMC42NiksXHJcbiAgICAgICAgeTogxpIuQ29sb3IuQ1NTKFwibGlnaHRncmVlblwiLCAwLjY2KSxcclxuICAgICAgICB6OiDGki5Db2xvci5DU1MoXCJjb3JuZmxvd2VyYmx1ZVwiLCAwLjY2KVxyXG4gICAgICB9LFxyXG4gICAgICBwbGFuZToge1xyXG4gICAgICAgIHh5OiDGki5Db2xvci5DU1MoXCJibHVlXCIsIDAuNSksXHJcbiAgICAgICAgeHo6IMaSLkNvbG9yLkNTUyhcImxpbWVncmVlblwiLCAwLjUpLFxyXG4gICAgICAgIHl6OiDGki5Db2xvci5DU1MoXCJyZWRcIiwgMC41KVxyXG4gICAgICB9LFxyXG4gICAgICBwbGFuZUxpdGU6IHtcclxuICAgICAgICB4eTogxpIuQ29sb3IuQ1NTKFwiY29ybmZsb3dlcmJsdWVcIiwgMC41KSxcclxuICAgICAgICB4ejogxpIuQ29sb3IuQ1NTKFwibGlnaHRncmVlblwiLCAwLjUpLFxyXG4gICAgICAgIHl6OiDGki5Db2xvci5DU1MoXCJzYWxtb25cIiwgMC41KVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICN1bmRvOiAoKCkgPT4gdm9pZClbXSA9IFtdOyAvLyBzdGFjayBvZiBmdW5jdGlvbnMgdG8gdW5kbyB0aGUgbGFzdCB0cmFuc2Zvcm1hdGlvblxyXG5cclxuICAgICNtdHhMb2NhbDogxpIuTWF0cml4NHg0OyAvLyBsb2NhbCBtYXRyaXggb2YgdGhlIG9iamVjdCB0byBiZSB0cmFuc2Zvcm1lZFxyXG4gICAgI210eFdvcmxkOiDGki5NYXRyaXg0eDQ7IC8vIHdvcmxkIG1hdHJpeCBvZiB0aGUgb2JqZWN0IHRvIGJlIHRyYW5zZm9ybWVkXHJcblxyXG4gICAgI210eExvY2FsQmFzZTogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LklERU5USVRZKCk7IC8vIGxvY2FsIG1hdHJpeCBpbiBhIHN0YXRlIGJlZm9yZSBhIHRyYW5zZm9ybWF0aW9uIHN0YXJ0c1xyXG4gICAgI210eFdvcmxkQmFzZTogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LklERU5USVRZKCk7IC8vIHdvcmxkIG1hdHJpeCBpbiBhIHN0YXRlIGJlZm9yZSBhIHRyYW5zZm9ybWF0aW9uIHN0YXJ0c1xyXG4gICAgXHJcbiAgICAjbm9ybWFsOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5aRVJPKCk7IC8vIHRoZSBub3JtYWwgb2YgdGhlIHBsYW5lIHdpdGggd2hpY2ggdGhlIG1vdXNlIHJheSBjb2xsaWRlc1xyXG4gICAgI29mZnNldDogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWkVSTygpOyAvLyBvZmZlc3QgdmVjdG9yIHBvaW50aW5nIGZyb20gdGhlIHdvcmxkIHBvc2l0aW9uIG9mIHRoZSBvYmplY3QgdG8gd2hlcmUgdGhlIG1vdXNlIHJheSBjb2xsaWRlZCB3aXRoIHRoZSBwbGFuZSBvbiBwb2ludGVyIGRvd25cclxuICAgICNkaXJlY3Rpb246IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlpFUk8oKTsgLy8gZGlyZWN0aW9uIHZlY3RvciBwb2ludGluZyBmcm9tIHRoZSB3b3JsZCBwb3NpdGlvbiBvZiB0aGUgb2JqZWN0IHRvIHdoZXJlIHRoZSBtb3VzZSByYXkgY29sbGlkZXMgd2l0aCB0aGUgcGxhbmUgb24gcG9pbnRlciBtb3ZlXHJcblxyXG4gICAgI2lzVHJhbnNmb3JtaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgI3RvcnVzOiDGki5NZXNoVG9ydXM7XHJcbiAgICAjdG9ydXNQaWNrOiDGki5NZXNoVG9ydXM7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF92aWV3cG9ydDogxpIuVmlld3BvcnQpIHtcclxuICAgICAgdGhpcy52aWV3cG9ydCA9IF92aWV3cG9ydDtcclxuICAgICAgdGhpcy5hZGRMaXN0ZW5lcnMoKTtcclxuICAgICAgdGhpcy4jdG9ydXMgPSBuZXcgxpIuTWVzaFRvcnVzKFwiVG9ydXNcIiwgODAsIDAuNzUsIDYwLCA4KTsgLy8gODAgbG9naWNhbCBwaXhlbCByaW5nIHJhZGl1cywgMC43NSBsb2dpY2FsIHBpeGVsIHR1YmUgcmFkaXVzXHJcbiAgICAgIHRoaXMuI3RvcnVzUGljayA9IG5ldyDGki5NZXNoVG9ydXMoXCJUb3J1c1BpY2tcIiwgODAsIDUsIDYwLCA4KTtcclxuICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKHRoaXMuI3RvcnVzKTtcclxuICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKHRoaXMuI3RvcnVzUGljayk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBtdHhMb2NhbChfbXR4OiDGki5NYXRyaXg0eDQpIHtcclxuICAgICAgdGhpcy4jbXR4TG9jYWwgPSBfbXR4O1xyXG4gICAgICBpZiAodGhpcy4jbXR4TG9jYWwpXHJcbiAgICAgICAgdGhpcy4jbXR4TG9jYWxCYXNlLmNvcHkoX210eCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBtdHhXb3JsZChfbXR4OiDGki5NYXRyaXg0eDQpIHtcclxuICAgICAgdGhpcy4jbXR4V29ybGQgPSBfbXR4O1xyXG4gICAgICBpZiAodGhpcy4jbXR4V29ybGQpXHJcbiAgICAgICAgdGhpcy4jbXR4V29ybGRCYXNlLmNvcHkoX210eCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgY2FtZXJhKCk6IMaSLkNvbXBvbmVudENhbWVyYSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdwb3J0LmNhbWVyYTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBwb2ludGVyIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgdmlld3BvcnQgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRMaXN0ZW5lcnMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLmhuZFBvaW50ZXJEb3duKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMuaG5kUG9pbnRlck1vdmUpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJsZWF2ZVwiLCB0aGlzLmhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9FTkQsIHRoaXMuaG5kUmVuZGVyRW5kKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgcG9pbnRlciBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdmlld3BvcnQgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVMaXN0ZW5lcnMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLmhuZFBvaW50ZXJEb3duKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMuaG5kUG9pbnRlck1vdmUpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJsZWF2ZVwiLCB0aGlzLmhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5yZW1vdmVFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9FTkQsIHRoaXMuaG5kUmVuZGVyRW5kKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmRvIHRoZSBsYXN0IHRyYW5zZm9ybWF0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1bmRvKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy4jaXNUcmFuc2Zvcm1pbmcpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy4jdW5kby5wb3AoKT8uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgdW5kbyBzdGFja1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXJVbmRvKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLiN1bmRvLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXdHaXptb3MoX2NtcENhbWVyYTogxpIuQ29tcG9uZW50Q2FtZXJhLCBfcGlja2luZzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICBpZiAoIXRoaXMuI210eExvY2FsIHx8ICF0aGlzLiNtdHhXb3JsZClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAodGhpcy5zcGFjZSA9PSBcImxvY2FsXCIgJiYgKHRoaXMuI210eFdvcmxkLnNjYWxpbmcueCA9PSAwIHx8IHRoaXMuI210eFdvcmxkLnNjYWxpbmcueSA9PSAwIHx8IHRoaXMuI210eFdvcmxkLnNjYWxpbmcueiA9PSAwKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCB3b3JsZDJQaXhlbDogbnVtYmVyID0gX2NtcENhbWVyYS5nZXRXb3JsZFRvUGl4ZWxTY2FsZSh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbik7XHJcblxyXG4gICAgICBjb25zdCB0cmFuc2xhdGVBcnJvd1dpZHRoOiBudW1iZXIgPSB3b3JsZDJQaXhlbCAqIChfcGlja2luZyA/IDEwIDogMSk7XHJcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZUFycm93TGVuZ3RoOiBudW1iZXIgPSB3b3JsZDJQaXhlbCAqIChfcGlja2luZyA/IDkwIDogODApO1xyXG4gICAgICBjb25zdCB0cmFuc2xhdGVBcnJvd1NpemU6IG51bWJlciA9IHdvcmxkMlBpeGVsICogMTQ7XHJcblxyXG4gICAgICBjb25zdCBzY2FsZUFycm93V2lkdGg6IG51bWJlciA9IHdvcmxkMlBpeGVsICogKF9waWNraW5nID8gMTAgOiAxKTtcclxuICAgICAgY29uc3Qgc2NhbGVBcnJvd0xlbmd0aDogbnVtYmVyID0gd29ybGQyUGl4ZWwgKiAoX3BpY2tpbmcgPyA4MyA6IDczKTtcclxuICAgICAgY29uc3Qgc2NhbGVBcnJvd1NpemU6IG51bWJlciA9IHdvcmxkMlBpeGVsICogNztcclxuICAgICAgY29uc3Qgc2NhbGVDdWJlU2l6ZTogbnVtYmVyID0gd29ybGQyUGl4ZWwgKiAoX3BpY2tpbmcgPyAyMCA6IDEwKTtcclxuXHJcbiAgICAgIGNvbnN0IGNsckF4ZXM6IFJlY29yZDxcInhcIiB8IFwieVwiIHwgXCJ6XCIsIMaSLkNvbG9yPiA9IHtcclxuICAgICAgICB4OiB0aGlzLnNlbGVjdGVkID09IFwieFwiICYmICF0aGlzLiNpc1RyYW5zZm9ybWluZyA/IHRoaXMuY29sb3JzLmxpdGUueCA6IHRoaXMuY29sb3JzLmJhc2UueCxcclxuICAgICAgICB5OiB0aGlzLnNlbGVjdGVkID09IFwieVwiICYmICF0aGlzLiNpc1RyYW5zZm9ybWluZyA/IHRoaXMuY29sb3JzLmxpdGUueSA6IHRoaXMuY29sb3JzLmJhc2UueSxcclxuICAgICAgICB6OiB0aGlzLnNlbGVjdGVkID09IFwielwiICYmICF0aGlzLiNpc1RyYW5zZm9ybWluZyA/IHRoaXMuY29sb3JzLmxpdGUueiA6IHRoaXMuY29sb3JzLmJhc2UuelxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgY2xyUGxhbmVzOiBSZWNvcmQ8XCJ4eVwiIHwgXCJ4elwiIHwgXCJ5elwiLCDGki5Db2xvcj4gPSB7XHJcbiAgICAgICAgeHk6IHRoaXMuc2VsZWN0ZWQgPT0gXCJ4eVwiICYmICF0aGlzLiNpc1RyYW5zZm9ybWluZyA/IHRoaXMuY29sb3JzLnBsYW5lTGl0ZS54eSA6IHRoaXMuY29sb3JzLnBsYW5lLnh5LFxyXG4gICAgICAgIHh6OiB0aGlzLnNlbGVjdGVkID09IFwieHpcIiAmJiAhdGhpcy4jaXNUcmFuc2Zvcm1pbmcgPyB0aGlzLmNvbG9ycy5wbGFuZUxpdGUueHogOiB0aGlzLmNvbG9ycy5wbGFuZS54eixcclxuICAgICAgICB5ejogdGhpcy5zZWxlY3RlZCA9PSBcInl6XCIgJiYgIXRoaXMuI2lzVHJhbnNmb3JtaW5nID8gdGhpcy5jb2xvcnMucGxhbmVMaXRlLnl6IDogdGhpcy5jb2xvcnMucGxhbmUueXpcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGF4ZXM6IFJlY29yZDxcInhcIiB8IFwieVwiIHwgXCJ6XCIsIMaSLlZlY3RvcjM+ID0ge1xyXG4gICAgICAgIHg6IHRoaXMuc3BhY2UgPT0gXCJ3b3JsZFwiID8gxpIuVmVjdG9yMy5YKCkgOiB0aGlzLiNtdHhXb3JsZC5yaWdodCxcclxuICAgICAgICB5OiB0aGlzLnNwYWNlID09IFwid29ybGRcIiA/IMaSLlZlY3RvcjMuWSgpIDogdGhpcy4jbXR4V29ybGQudXAsXHJcbiAgICAgICAgejogdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlooKSA6IHRoaXMuI210eFdvcmxkLmZvcndhcmRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IG5vcm1hbHM6IFJlY29yZDxcInhcIiB8IFwieVwiIHwgXCJ6XCIsIMaSLlZlY3RvcjM+ID0ge1xyXG4gICAgICAgIHg6IHRoaXMuc3BhY2UgPT0gXCJ3b3JsZFwiID8gxpIuVmVjdG9yMy5aKCkgOiB0aGlzLiNtdHhXb3JsZC5mb3J3YXJkLFxyXG4gICAgICAgIHk6IHRoaXMuc3BhY2UgPT0gXCJ3b3JsZFwiID8gxpIuVmVjdG9yMy5YKCkgOiB0aGlzLiNtdHhXb3JsZC5yaWdodCxcclxuICAgICAgICB6OiB0aGlzLnNwYWNlID09IFwid29ybGRcIiA/IMaSLlZlY3RvcjMuWSgpIDogdGhpcy4jbXR4V29ybGQudXBcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IG10eFdvcmxkTm9ybWFsaXplZDogxpIuTWF0cml4NHg0ID0gdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5NYXRyaXg0eDQuQ09NUE9TSVRJT04odGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24pIDogdGhpcy4jbXR4V29ybGQuY2xvbmU7XHJcbiAgICAgIG10eFdvcmxkTm9ybWFsaXplZC5zY2FsZShtdHhXb3JsZE5vcm1hbGl6ZWQuc2NhbGluZy5tYXAoX3ZhbHVlID0+IDEgLyBfdmFsdWUpKTtcclxuXHJcbiAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XHJcbiAgICAgICAgY2FzZSBcInRyYW5zbGF0ZVwiOlxyXG4gICAgICAgICAgLy8gZHJhdyB0aGUgYXhlc1xyXG4gICAgICAgICAgZm9yIChjb25zdCBheGlzIG9mIFtcInhcIiwgXCJ5XCIsIFwielwiXSBhcyBjb25zdClcclxuICAgICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgY2xyQXhlc1theGlzXSwgYXhlc1theGlzXSwgbm9ybWFsc1theGlzXSwgdHJhbnNsYXRlQXJyb3dMZW5ndGgsIHRyYW5zbGF0ZUFycm93V2lkdGgsIHRyYW5zbGF0ZUFycm93U2l6ZSwgxpIuTWVzaFB5cmFtaWQsIDApO1xyXG5cclxuICAgICAgICAgIC8vIGRyYXcgdGhlIHBsYW5lc1xyXG4gICAgICAgICAgZm9yIChjb25zdCBbYXhpcywgcGxhbmVdIG9mIFtbXCJ6XCIsIFwieHlcIl0sIFtcInlcIiwgXCJ4elwiXSwgW1wieFwiLCBcInl6XCJdXSBhcyBjb25zdCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy4jaXNUcmFuc2Zvcm1pbmcgJiYgdGhpcy5zZWxlY3RlZCAhPSBwbGFuZSlcclxuICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG10eFF1YWQ6IMaSLk1hdHJpeDR4NCA9IG10eFdvcmxkTm9ybWFsaXplZC5jbG9uZTtcclxuICAgICAgICAgICAgaWYgKGF4aXMgPT0gXCJ4XCIpXHJcbiAgICAgICAgICAgICAgbXR4UXVhZC5yb3RhdGVZKC05MCk7XHJcbiAgICAgICAgICAgIGlmIChheGlzID09IFwieVwiKVxyXG4gICAgICAgICAgICAgIG10eFF1YWQucm90YXRlWCg5MCk7XHJcblxyXG4gICAgICAgICAgICBtdHhRdWFkLnRyYW5zbGF0ZShuZXcgxpIuVmVjdG9yMyh3b3JsZDJQaXhlbCAqIDIwLCB3b3JsZDJQaXhlbCAqIDIwLCAwKSk7IC8vIG1vdmUgMjAgcHhcclxuICAgICAgICAgICAgbXR4UXVhZC5zY2FsZSjGki5WZWN0b3IzLk9ORSh3b3JsZDJQaXhlbCAqIChfcGlja2luZyA/IDIwIDogMTApKSk7IC8vIHNjYWxlIHRvIHNpemUgb2YgMjAgb3IgMTAgcHhcclxuICAgICAgICAgICAgxpIuR2l6bW9zLmRyYXdTcHJpdGUobXR4UXVhZCwgY2xyUGxhbmVzW3BsYW5lXSwgX3BpY2tpbmcgPyAwIDogdW5kZWZpbmVkKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBkcmF3IGFmdGVyaW1hZ2VzXHJcbiAgICAgICAgICBpZiAodGhpcy4jaXNUcmFuc2Zvcm1pbmcpIHtcclxuICAgICAgICAgICAgY29uc3Qgd29ybGQyUGl4ZWxCYXNlOiBudW1iZXIgPSBfY21wQ2FtZXJhLmdldFdvcmxkVG9QaXhlbFNjYWxlKHRoaXMuI210eFdvcmxkQmFzZS50cmFuc2xhdGlvbik7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgc2VsZWN0ZWQgb2YgdGhpcy5zZWxlY3RlZCkgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgIMaSLkdpem1vcy5kcmF3QXJyb3codGhpcy4jbXR4V29ybGRCYXNlLnRyYW5zbGF0aW9uLCB0aGlzLmNvbG9ycy50cmFuc3BhcmVudFtzZWxlY3RlZF0sIGF4ZXNbc2VsZWN0ZWRdLCBub3JtYWxzW3NlbGVjdGVkXSwgd29ybGQyUGl4ZWxCYXNlICogODAsIHdvcmxkMlBpeGVsQmFzZSAqIDEsIHdvcmxkMlBpeGVsQmFzZSAqIDE0LCDGki5NZXNoUHlyYW1pZCwgMCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInJvdGF0ZVwiOlxyXG4gICAgICAgICAgaWYgKHRoaXMuI2lzVHJhbnNmb3JtaW5nICYmICh0aGlzLnNlbGVjdGVkID09IFwieFwiIHx8IHRoaXMuc2VsZWN0ZWQgPT0gXCJ5XCIgfHwgdGhpcy5zZWxlY3RlZCA9PSBcInpcIikpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Q2lyY2xlKHRoaXMuI3RvcnVzLCB0aGlzLmNvbG9ycy5iYXNlW3RoaXMuc2VsZWN0ZWRdLCBheGVzW3RoaXMuc2VsZWN0ZWRdLCBub3JtYWxzW3RoaXMuc2VsZWN0ZWRdLCB3b3JsZDJQaXhlbCwgMCk7XHJcbiAgICAgICAgICAgIMaSLkdpem1vcy5kcmF3QXJyb3codGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMuY29sb3JzLmJhc2VbdGhpcy5zZWxlY3RlZF0sIHRoaXMuI2RpcmVjdGlvbiwgYXhlc1t0aGlzLnNlbGVjdGVkXSwgdHJhbnNsYXRlQXJyb3dMZW5ndGgsIHRyYW5zbGF0ZUFycm93V2lkdGgsIHRyYW5zbGF0ZUFycm93U2l6ZSwgxpIuTWVzaFB5cmFtaWQsIDApO1xyXG4gICAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCB0aGlzLmNvbG9ycy50cmFuc3BhcmVudFt0aGlzLnNlbGVjdGVkXSwgdGhpcy4jb2Zmc2V0LCBheGVzW3RoaXMuc2VsZWN0ZWRdLCB0cmFuc2xhdGVBcnJvd0xlbmd0aCwgdHJhbnNsYXRlQXJyb3dXaWR0aCwgdHJhbnNsYXRlQXJyb3dTaXplLCDGki5NZXNoUHlyYW1pZCwgMCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIGRyYXcgYW4gaW52aXNpYmxlIHF1YWQgdG8gb2NjbHVkZSB0aGUgdG9yaVxyXG4gICAgICAgICAgY29uc3QgbXR4UXVhZDogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LkNPTVBPU0lUSU9OKHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uKTtcclxuICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbjogxpIuVmVjdG9yMyA9IF9jbXBDYW1lcmEubXR4V29ybGQuZm9yd2FyZC5uZWdhdGUoKTtcclxuICAgICAgICAgIG10eFF1YWQuc2NhbGluZyA9IMaSLlZlY3RvcjMuT05FKHRyYW5zbGF0ZUFycm93TGVuZ3RoICogMik7XHJcbiAgICAgICAgICBtdHhRdWFkLmxvb2tJbihkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLnNldENvbG9yV3JpdGVNYXNrKGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgIMaSLkdpem1vcy5kcmF3UXVhZChtdHhRdWFkLCB0aGlzLmNvbG9ycy5iYXNlLngsIDApOyAvLyBjb2xvciBkb2Vzbid0IG1hdHRlclxyXG4gICAgICAgICAgxpIuUmVuZGVyLnNldENvbG9yV3JpdGVNYXNrKHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICAgIC8vIGRyYXcgdGhlIHRvcmlcclxuICAgICAgICAgIGxldCB0b3J1czogxpIuTWVzaFRvcnVzID0gX3BpY2tpbmcgPyB0aGlzLiN0b3J1c1BpY2sgOiB0aGlzLiN0b3J1cztcclxuXHJcbiAgICAgICAgICBmb3IgKGNvbnN0IGF4aXMgb2YgW1wieFwiLCBcInlcIiwgXCJ6XCJdIGFzIGNvbnN0KVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdDaXJjbGUodG9ydXMsIGNsckF4ZXNbYXhpc10sIGF4ZXNbYXhpc10sIG5vcm1hbHNbYXhpc10sIHdvcmxkMlBpeGVsLCAwKTtcclxuXHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZU11bHRpcGxlKG10eFF1YWQsIGRpcmVjdGlvbik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwic2NhbGVcIjpcclxuICAgICAgICAgIGZvciAoY29uc3QgYXhpcyBvZiBbXCJ4XCIsIFwieVwiLCBcInpcIl0gYXMgY29uc3QpIHtcclxuICAgICAgICAgICAgbGV0IGZhY3RvcjogbnVtYmVyID0gdGhpcy4jbXR4TG9jYWwuc2NhbGluZ1theGlzXSAvIHRoaXMuI210eExvY2FsQmFzZS5zY2FsaW5nW2F4aXNdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZSA9PSBcImxvY2FsXCIpXHJcbiAgICAgICAgICAgICAgZmFjdG9yID0gTWF0aC5hYnMoZmFjdG9yKTtcclxuICAgICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgY2xyQXhlc1theGlzXSwgYXhlc1theGlzXSwgbm9ybWFsc1theGlzXSwgc2NhbGVBcnJvd0xlbmd0aCAqIGZhY3Rvciwgc2NhbGVBcnJvd1dpZHRoLCBzY2FsZUFycm93U2l6ZSwgxpIuTWVzaEN1YmUsIDApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IG10eEN1YmU6IMaSLk1hdHJpeDR4NCA9IG10eFdvcmxkTm9ybWFsaXplZC5jbG9uZTtcclxuICAgICAgICAgIG10eEN1YmUuc2NhbGUobXR4Q3ViZS5zY2FsaW5nLnNldChzY2FsZUN1YmVTaXplLCBzY2FsZUN1YmVTaXplLCBzY2FsZUN1YmVTaXplKSk7XHJcbiAgICAgICAgICDGki5HaXptb3MuZHJhd0N1YmUobXR4Q3ViZSwgdGhpcy5zZWxlY3RlZCA9PSBcInh5elwiID8gdGhpcy5jb2xvcnMubGl0ZS54eXogOiB0aGlzLmNvbG9ycy5iYXNlLnh5eiwgMSk7XHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShtdHhDdWJlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShtdHhXb3JsZE5vcm1hbGl6ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlckRvd24gPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmNhbWVyYSB8fCAhdGhpcy52aWV3cG9ydCB8fCAhdGhpcy5zZWxlY3RlZCB8fCAhdGhpcy4jbXR4TG9jYWwgfHwgIXRoaXMuI210eFdvcmxkKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuI210eExvY2FsQmFzZS5jb3B5KHRoaXMuI210eExvY2FsKTtcclxuICAgICAgdGhpcy4jbXR4V29ybGRCYXNlLmNvcHkodGhpcy4jbXR4V29ybGQpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQgPT0gXCJ4XCIgfHwgdGhpcy5zZWxlY3RlZCA9PSBcInlcIiB8fCB0aGlzLnNlbGVjdGVkID09IFwielwiKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PSBcInJvdGF0ZVwiKSB7XHJcbiAgICAgICAgICB0aGlzLiNub3JtYWwuY29weSh0aGlzLmdldEF4aXModGhpcy5zZWxlY3RlZCkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBtdHhOb3JtYWw6IMaSLk1hdHJpeDR4NCA9IMaSLk1hdHJpeDR4NC5MT09LX0FUKHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCB0aGlzLmNhbWVyYS5tdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy5nZXRBeGlzKHRoaXMuc2VsZWN0ZWQpLCB0cnVlKTtcclxuICAgICAgICAgIHRoaXMuI25vcm1hbC5jb3B5KG10eE5vcm1hbC5mb3J3YXJkKTsgLy8gbm9ybWFsIG9mIHRoZSBwbGFuZSB0aGUgbW91c2UgcmF5IHdpbGwgY29sbGlkZSB3aXRoXHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShtdHhOb3JtYWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkID09IFwieHl6XCIpIHtcclxuICAgICAgICB0aGlzLiNub3JtYWwuY29weSh0aGlzLmNhbWVyYS5tdHhXb3JsZC5mb3J3YXJkLm5lZ2F0ZSgpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBheGlzOiBzdHJpbmcgPSBcInh5elwiLnJlcGxhY2UodGhpcy5zZWxlY3RlZFswXSwgXCJcIikucmVwbGFjZSh0aGlzLnNlbGVjdGVkWzFdLCBcIlwiKTtcclxuICAgICAgICB0aGlzLiNub3JtYWwuY29weSh0aGlzLmdldEF4aXMoPFwieFwiIHwgXCJ5XCIgfCBcInpcIj5heGlzKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHBvaW50OiDGki5WZWN0b3IzID0gdGhpcy5nZXRQb2ludDNEKF9ldmVudCk7XHJcbiAgICAgIHRoaXMuI29mZnNldC5jb3B5KHBvaW50LnN1YnRyYWN0KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uKSk7XHJcblxyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShwb2ludCk7XHJcblxyXG4gICAgICAvLyBjcmVhdGUgdW5kbyBmdW5jdGlvblxyXG4gICAgICBjb25zdCBtdHhMb2NhbDogxpIuTWF0cml4NHg0ID0gdGhpcy4jbXR4TG9jYWw7XHJcbiAgICAgIGNvbnN0IG11dGF0b3JMb2NhbDogxpIuTXV0YXRvciA9IG10eExvY2FsLmdldE11dGF0b3IoKTtcclxuICAgICAgbGV0IHVuZG86ICgpID0+IHZvaWQgPSAoKSA9PiB7XHJcbiAgICAgICAgbXR4TG9jYWwubXV0YXRlKG11dGF0b3JMb2NhbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuI210eExvY2FsID09IG10eExvY2FsKVxyXG4gICAgICAgICAgdGhpcy4jbXR4TG9jYWxCYXNlLmNvcHkobXR4TG9jYWwpO1xyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLiN1bmRvLnB1c2godW5kbyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlck1vdmUgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy4jaXNUcmFuc2Zvcm1pbmcgPSBmYWxzZTtcclxuICAgICAgLy8gdGhpcy52aWV3cG9ydC5jYW52YXMuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LmJ1dHRvbnMgIT0gMSkge1xyXG4gICAgICAgIGNvbnN0IHBvaW50OiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgICBjb25zdCBwaWNrOiDGki5QaWNrID0gxpIuUGlja2VyLnBpY2tDYW1lcmEoW3RoaXNdLCB0aGlzLmNhbWVyYSwgdGhpcy52aWV3cG9ydC5wb2ludENsaWVudFRvUHJvamVjdGlvbihwb2ludCkpWzBdO1xyXG5cclxuICAgICAgICBpZiAocGljaz8uY29sb3IuciA+IDAuOCAmJiBwaWNrPy5jb2xvci5nID4gMC44ICYmIHBpY2s/LmNvbG9yLmIgPiAwLjgpXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gXCJ4eXpcIjtcclxuICAgICAgICBlbHNlIGlmIChwaWNrPy5jb2xvci5iID4gMC44ICYmIHBpY2s/LmNvbG9yLmEgPCAxKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFwieHlcIjtcclxuICAgICAgICBlbHNlIGlmIChwaWNrPy5jb2xvci5nID4gMC44ICYmIHBpY2s/LmNvbG9yLmEgPCAxKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFwieHpcIjtcclxuICAgICAgICBlbHNlIGlmIChwaWNrPy5jb2xvci5yID4gMC44ICYmIHBpY2s/LmNvbG9yLmEgPCAxKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFwieXpcIjtcclxuICAgICAgICBlbHNlIGlmIChwaWNrPy5jb2xvci5yID4gMC44KVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFwieFwiO1xyXG4gICAgICAgIGVsc2UgaWYgKHBpY2s/LmNvbG9yLmcgPiAwLjgpXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gXCJ5XCI7XHJcbiAgICAgICAgZWxzZSBpZiAocGljaz8uY29sb3IuYiA+IDAuOClcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBcInpcIjtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHJcbiAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmUocG9pbnQpO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5jYW1lcmEgfHwgIXRoaXMudmlld3BvcnQgfHwgIXRoaXMuc2VsZWN0ZWQgfHwgIXRoaXMuI210eExvY2FsIHx8ICF0aGlzLiNtdHhXb3JsZClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBjb25zdCBpc1NuYXBwaW5nOiBib29sZWFuID0gxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLkNUUkxfTEVGVCwgxpIuS0VZQk9BUkRfQ09ERS5DVFJMX1JJR0hUXSk7XHJcblxyXG4gICAgICB0aGlzLiNpc1RyYW5zZm9ybWluZyA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLiNkaXJlY3Rpb24uY29weSh0aGlzLmdldFBvaW50M0QoX2V2ZW50KS5zdWJ0cmFjdCh0aGlzLiNtdHhXb3JsZEJhc2UudHJhbnNsYXRpb24pKTtcclxuICAgICAgdGhpcy4jbXR4TG9jYWwuY29weSh0aGlzLiNtdHhMb2NhbEJhc2UpOyAvLyByZXNldFxyXG5cclxuICAgICAgbGV0IGF4aXM6IMaSLlZlY3RvcjM7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkID09IFwieFwiIHx8IHRoaXMuc2VsZWN0ZWQgPT0gXCJ5XCIgfHwgdGhpcy5zZWxlY3RlZCA9PSBcInpcIilcclxuICAgICAgICBheGlzID0gdGhpcy5nZXRBeGlzKHRoaXMuc2VsZWN0ZWQpO1xyXG5cclxuICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcclxuICAgICAgICBjYXNlIFwidHJhbnNsYXRlXCI6XHJcbiAgICAgICAgICBjb25zdCBtdHhXb3JsZEludmVyc2U6IMaSLk1hdHJpeDR4NCA9IHRoaXMuI210eFdvcmxkQmFzZS5jbG9uZS5pbnZlcnQoKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgdHJhbnNsYXRpb246IMaSLlZlY3RvcjMgPSB0aGlzLnNlbGVjdGVkLmxlbmd0aCA9PSAxID8gxpIuVmVjdG9yMy5QUk9KRUNUSU9OKHRoaXMuI2RpcmVjdGlvbiwgYXhpcykgOiB0aGlzLiNkaXJlY3Rpb24uY2xvbmU7XHJcbiAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbk9mZnNldDogxpIuVmVjdG9yMyA9IHRoaXMuc2VsZWN0ZWQubGVuZ3RoID09IDEgPyDGki5WZWN0b3IzLlBST0pFQ1RJT04odGhpcy4jb2Zmc2V0LCBheGlzKSA6IHRoaXMuI29mZnNldC5jbG9uZTtcclxuXHJcbiAgICAgICAgICB0cmFuc2xhdGlvbi5zdWJ0cmFjdCh0cmFuc2xhdGlvbk9mZnNldCk7XHJcblxyXG4gICAgICAgICAgaWYgKGlzU25hcHBpbmcpXHJcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uLmFwcGx5KChfdmFsdWU6IG51bWJlcikgPT4gxpIuQ2FsYy5zbmFwKF92YWx1ZSwgdGhpcy5zbmFwRGlzdGFuY2UpKTtcclxuXHJcbiAgICAgICAgICB0cmFuc2xhdGlvbi50cmFuc2Zvcm0obXR4V29ybGRJbnZlcnNlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgdGhpcy4jbXR4TG9jYWwudHJhbnNsYXRlKHRyYW5zbGF0aW9uKTtcclxuXHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZU11bHRpcGxlKG10eFdvcmxkSW52ZXJzZSwgdHJhbnNsYXRpb24sIHRyYW5zbGF0aW9uT2Zmc2V0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJyb3RhdGVcIjpcclxuICAgICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gxpIuVmVjdG9yMy5BTkdMRSh0aGlzLiNvZmZzZXQsIHRoaXMuI2RpcmVjdGlvbik7XHJcblxyXG4gICAgICAgICAgaWYgKGlzU25hcHBpbmcpXHJcbiAgICAgICAgICAgIGFuZ2xlID0gxpIuQ2FsYy5zbmFwKGFuZ2xlLCB0aGlzLnNuYXBBbmdsZSk7XHJcblxyXG4gICAgICAgICAgY29uc3QgY3Jvc3M6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLkNST1NTKHRoaXMuI29mZnNldCwgdGhpcy4jZGlyZWN0aW9uKTtcclxuICAgICAgICAgIGlmICjGki5WZWN0b3IzLkRPVChheGlzLCBjcm9zcykgPCAwKVxyXG4gICAgICAgICAgICBhbmdsZSA9IC1hbmdsZTtcclxuXHJcbiAgICAgICAgICBjb25zdCBxUm90YXRpb246IMaSLlF1YXRlcm5pb24gPSDGki5RdWF0ZXJuaW9uLlJPVEFUSU9OKGF4aXMsIGFuZ2xlKTtcclxuXHJcbiAgICAgICAgICBpZiAoaXNTbmFwcGluZykgeyAvLyByb3RhdGUgb2Zmc2V0IGludG8gc25hcHBlZCBkaXJlY3Rpb25cclxuICAgICAgICAgICAgdGhpcy4jZGlyZWN0aW9uLmNvcHkodGhpcy4jb2Zmc2V0KTtcclxuICAgICAgICAgICAgdGhpcy4jZGlyZWN0aW9uLnRyYW5zZm9ybShxUm90YXRpb24pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IG10eExvY2FsSW52ZXJzZTogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LklOVkVSU0UodGhpcy4jbXR4TG9jYWxCYXNlKTtcclxuICAgICAgICAgIGNvbnN0IG10eFBhcmVudFdvcmxkOiDGki5NYXRyaXg0eDQgPSDGki5NYXRyaXg0eDQuUFJPRFVDVCh0aGlzLiNtdHhXb3JsZEJhc2UsIG10eExvY2FsSW52ZXJzZSk7XHJcblxyXG4gICAgICAgICAgY29uc3QgcVBhcmVudFdvcmxkOiDGki5RdWF0ZXJuaW9uID0gbXR4UGFyZW50V29ybGQucXVhdGVybmlvbjtcclxuICAgICAgICAgIGNvbnN0IHFQYXJlbnRXb3JsZEludmVyc2U6IMaSLlF1YXRlcm5pb24gPSDGki5RdWF0ZXJuaW9uLklOVkVSU0UobXR4UGFyZW50V29ybGQucXVhdGVybmlvbik7XHJcblxyXG4gICAgICAgICAgcVJvdGF0aW9uLm11bHRpcGx5KHFQYXJlbnRXb3JsZEludmVyc2UsIHRydWUpO1xyXG4gICAgICAgICAgcVJvdGF0aW9uLm11bHRpcGx5KHFQYXJlbnRXb3JsZCk7XHJcbiAgICAgICAgICBxUm90YXRpb24ubXVsdGlwbHkodGhpcy4jbXR4TG9jYWxCYXNlLnF1YXRlcm5pb24pO1xyXG5cclxuICAgICAgICAgIHRoaXMuI210eExvY2FsLnF1YXRlcm5pb24gPSBxUm90YXRpb247XHJcblxyXG4gICAgICAgICAgLy8gY29uc3QgbXR4TG9jYWw6IMaSLk1hdHJpeDR4NCA9IHRoaXMuI210eExvY2FsQmFzZS5jbG9uZTtcclxuICAgICAgICAgIC8vIGNvbnN0IG10eFJvdGF0aW9uOiDGki5NYXRyaXg0eDQgPSDGki5NYXRyaXg0eDQuUk9UQVRJT04ocVJvdGF0aW9uKTtcclxuXHJcbiAgICAgICAgICAvLyAvLyBsb2NhbFJvdGF0aW9uID0gd29ybGRJbnZlcnNlICogd29ybGRSb3RhdGlvbiAqIHdvcmxkXHJcbiAgICAgICAgICAvLyBtdHhSb3RhdGlvbi5tdWx0aXBseSjGki5NYXRyaXg0eDQuSU5WRVJTRSh0aGlzLiNtdHhXb3JsZEJhc2UpLCB0cnVlKTtcclxuICAgICAgICAgIC8vIG10eFJvdGF0aW9uLm11bHRpcGx5KHRoaXMuI210eFdvcmxkQmFzZSk7XHJcblxyXG4gICAgICAgICAgLy8gbXR4TG9jYWwubXVsdGlwbHkobXR4Um90YXRpb24pO1xyXG4gICAgICAgICAgLy8gLy8gcmVzdG9yZSBzY2FsaW5nIGRpcmVjdGlvbnNcclxuICAgICAgICAgIC8vIG10eExvY2FsLnNjYWxpbmcgPSBtdHhMb2NhbC5zY2FsaW5nLmFwcGx5KChfdmFsdWUsIF9pbmRleCwgX2NvbXBvbmVudCkgPT4gX3ZhbHVlICogTWF0aC5zaWduKHRoaXMuI210eExvY2FsQmFzZS5zY2FsaW5nW19jb21wb25lbnRdKSk7XHJcblxyXG4gICAgICAgICAgLy8gdGhpcy4jbXR4TG9jYWwucXVhdGVybmlvbiA9IG10eExvY2FsLnF1YXRlcm5pb247XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwic2NhbGVcIjpcclxuICAgICAgICAgIGxldCBzY2FsZTogbnVtYmVyID0gdGhpcy5jYW1lcmEuZ2V0V29ybGRUb1BpeGVsU2NhbGUodGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24pO1xyXG4gICAgICAgICAgbGV0IGxlbmd0aEFycm93OiBudW1iZXIgPSBzY2FsZSAqIDgwOyAvLyBUT0RPOiBzYXZlIHRoaXMgc29tZXdoZXJlXHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZCA9PSBcInh5elwiKVxyXG4gICAgICAgICAgICBheGlzID0gdGhpcy5jYW1lcmEubXR4V29ybGQucmlnaHQubmVnYXRlKCk7XHJcblxyXG4gICAgICAgICAgbGV0IG9mZnNldDogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuUFJPSkVDVElPTih0aGlzLiNvZmZzZXQsIGF4aXMpO1xyXG4gICAgICAgICAgbGV0IGRpcmVjdGlvbjogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuUFJPSkVDVElPTih0aGlzLiNkaXJlY3Rpb24sIGF4aXMpO1xyXG4gICAgICAgICAgbGV0IHNpZ25PZmZzZXQ6IG51bWJlciA9IE1hdGguc2lnbijGki5WZWN0b3IzLkRPVChheGlzLCBvZmZzZXQpKTtcclxuICAgICAgICAgIGxldCBzaWduRGlyZWN0aW9uOiBudW1iZXIgPSBNYXRoLnNpZ24oxpIuVmVjdG9yMy5ET1QoYXhpcywgZGlyZWN0aW9uKSk7XHJcblxyXG4gICAgICAgICAgbGV0IGZhY3RvcjogbnVtYmVyID0gKCgoc2lnbkRpcmVjdGlvbiAqIGRpcmVjdGlvbi5tYWduaXR1ZGUpIC0gKHNpZ25PZmZzZXQgKiBvZmZzZXQubWFnbml0dWRlKSkgLyBsZW5ndGhBcnJvdykgKyAxO1xyXG5cclxuICAgICAgICAgIGlmIChpc1NuYXBwaW5nKVxyXG4gICAgICAgICAgICBmYWN0b3IgPSDGki5DYWxjLnNuYXAoZmFjdG9yLCB0aGlzLnNuYXBTY2FsZSk7XHJcblxyXG4gICAgICAgICAgY29uc3QgbXR4U2NhbGluZzogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LklERU5USVRZKCk7XHJcblxyXG4gICAgICAgICAgZm9yIChjb25zdCBzZWxlY3RlZCBvZiA8KFwieFwiIHwgXCJ5XCIgfCBcInpcIilbXT48xpIuR2VuZXJhbD50aGlzLnNlbGVjdGVkKVxyXG4gICAgICAgICAgICBtdHhTY2FsaW5nLnNjYWxpbmdbc2VsZWN0ZWRdID0gZmFjdG9yO1xyXG5cclxuICAgICAgICAgIG10eFNjYWxpbmcuc2NhbGluZyA9IG10eFNjYWxpbmcuc2NhbGluZztcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5zcGFjZSA9PSBcIndvcmxkXCIpIHsgLy8gcm90YXRpb25JbnZlcnNlICogc2NhbGluZyAqIHJvdGF0aW9uXHJcbiAgICAgICAgICAgIGNvbnN0IHJvdGF0aW9uSW52ZXJzZTogxpIuUXVhdGVybmlvbiA9IHRoaXMuI210eFdvcmxkQmFzZS5xdWF0ZXJuaW9uLmNsb25lLmludmVydCgpO1xyXG4gICAgICAgICAgICBtdHhTY2FsaW5nLnJvdGF0ZShyb3RhdGlvbkludmVyc2UsIHRydWUpO1xyXG4gICAgICAgICAgICBtdHhTY2FsaW5nLnJvdGF0ZSh0aGlzLiNtdHhXb3JsZEJhc2UucXVhdGVybmlvbik7XHJcbiAgICAgICAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKHJvdGF0aW9uSW52ZXJzZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgbXR4U2NhbGluZy5tdWx0aXBseSh0aGlzLiNtdHhMb2NhbCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgLy8gcmVzdG9yZSBzY2FsaW5nIGRpcmVjdGlvbnNcclxuICAgICAgICAgIG10eFNjYWxpbmcuc2NhbGluZy5hcHBseSgoX3ZhbHVlLCBfaW5kZXgsIF9jb21wb25lbnQpID0+IF92YWx1ZSAqIE1hdGguc2lnbih0aGlzLiNtdHhMb2NhbC5zY2FsaW5nW19jb21wb25lbnRdKSk7XHJcblxyXG4gICAgICAgICAgZm9yIChjb25zdCBzZWxlY3RlZCBvZiA8KFwieFwiIHwgXCJ5XCIgfCBcInpcIilbXT48xpIuR2VuZXJhbD50aGlzLnNlbGVjdGVkKVxyXG4gICAgICAgICAgICBtdHhTY2FsaW5nLnNjYWxpbmdbc2VsZWN0ZWRdICo9IE1hdGguc2lnbihmYWN0b3IpO1xyXG5cclxuICAgICAgICAgIHRoaXMuI210eExvY2FsLnNjYWxpbmcgPSBtdHhTY2FsaW5nLnNjYWxpbmc7XHJcblxyXG4gICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZShtdHhTY2FsaW5nKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYXhpcylcclxuICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShheGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLiNtdHhMb2NhbClcclxuICAgICAgICB0aGlzLiNtdHhMb2NhbEJhc2UuY29weSh0aGlzLiNtdHhMb2NhbCk7XHJcbiAgICAgIGlmICh0aGlzLiNtdHhXb3JsZClcclxuICAgICAgICB0aGlzLiNtdHhXb3JsZEJhc2UuY29weSh0aGlzLiNtdHhXb3JsZCk7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkKVxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICBpZiAodGhpcy4jaXNUcmFuc2Zvcm1pbmcpXHJcbiAgICAgICAgdGhpcy4jaXNUcmFuc2Zvcm1pbmcgPSBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW5kZXJFbmQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIMaSLlJlbmRlci5jbGVhcih1bmRlZmluZWQsIGZhbHNlLCB0cnVlKTsgLy8gY2xlYXIgZGVwdGggYnVmZmVyXHJcbiAgICAgIMaSLkdpem1vcy5kcmF3KFt0aGlzXSwgdGhpcy52aWV3cG9ydC5jYW1lcmEpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGRyYXdDaXJjbGUoX3RvcnVzOiDGki5NZXNoVG9ydXMsIF9jb2xvcjogxpIuQ29sb3IsIF9kaXJlY3Rpb246IMaSLlZlY3RvcjMsIF91cDogxpIuVmVjdG9yMywgX3dvcmxkMlBpeGVsOiBudW1iZXIsIF9hbHBoYU9jY2x1ZGVkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgY29uc3QgbXR4V29ybGQ6IMaSLk1hdHJpeDR4NCA9IMaSLk1hdHJpeDR4NC5DT01QT1NJVElPTih0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbik7XHJcbiAgICAgIG10eFdvcmxkLnNjYWxpbmcuc2V0KF93b3JsZDJQaXhlbCwgX3dvcmxkMlBpeGVsLCBfd29ybGQyUGl4ZWwpO1xyXG4gICAgICBtdHhXb3JsZC5zY2FsaW5nID0gbXR4V29ybGQuc2NhbGluZztcclxuICAgICAgbXR4V29ybGQubG9va0luKF9kaXJlY3Rpb24sIF91cCk7IC8vIGxvb2tJbiBvcmllbnRhdGVzIHRoZSB6LWF4aXMgYnV0IHRoZSB0b3J1c2UgbGF5cyBvbiB0aGUgeHotcGxhbmUgKGZhY2luZyBpbiB5LWRpcmVjdGlvbiksXHJcbiAgICAgIG10eFdvcmxkLnJvdGF0ZVgoOTApOyAgICAgICAgICAgICAvLyB0aHVzIHdlIHJvdGF0ZSB0aGUgdG9ydXMgc28gdGhlIGNpcmNsZSBmYWNlcyBpbiBfZGlyZWN0aW9uXHJcbiAgICAgIMaSLkdpem1vcy5kcmF3TWVzaChfdG9ydXMsIG10eFdvcmxkLCBfY29sb3IsIF9hbHBoYU9jY2x1ZGVkKTtcclxuICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZShtdHhXb3JsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRQb2ludDNEKF9ldmVudDogUG9pbnRlckV2ZW50KTogxpIuVmVjdG9yMyB7XHJcbiAgICAgIGNvbnN0IHBvaW50MkQ6IMaSLlZlY3RvcjIgPSDGki5SZWN5Y2xlci5yZXVzZSjGki5WZWN0b3IyKS5zZXQoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgY29uc3QgcmF5OiDGki5SYXkgPSB0aGlzLnZpZXdwb3J0LmdldFJheUZyb21DbGllbnQocG9pbnQyRCk7XHJcbiAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKHBvaW50MkQpO1xyXG5cclxuICAgICAgcmV0dXJuIHJheS5pbnRlcnNlY3RQbGFuZSh0aGlzLiNtdHhXb3JsZEJhc2UudHJhbnNsYXRpb24sIHRoaXMuI25vcm1hbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRBeGlzKF9heGlzOiBcInhcIiB8IFwieVwiIHwgXCJ6XCIpOiDGki5WZWN0b3IzIHtcclxuICAgICAgaWYgKHRoaXMuc3BhY2UgPT0gXCJ3b3JsZFwiKSB7XHJcbiAgICAgICAgc3dpdGNoIChfYXhpcykge1xyXG4gICAgICAgICAgY2FzZSBcInhcIjogcmV0dXJuIMaSLlZlY3RvcjMuWCgpO1xyXG4gICAgICAgICAgY2FzZSBcInlcIjogcmV0dXJuIMaSLlZlY3RvcjMuWSgpO1xyXG4gICAgICAgICAgY2FzZSBcInpcIjogcmV0dXJuIMaSLlZlY3RvcjMuWigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2l0Y2ggKF9heGlzKSB7XHJcbiAgICAgICAgICBjYXNlIFwieFwiOiByZXR1cm4gdGhpcy4jbXR4V29ybGRCYXNlLnJpZ2h0O1xyXG4gICAgICAgICAgY2FzZSBcInlcIjogcmV0dXJuIHRoaXMuI210eFdvcmxkQmFzZS51cDtcclxuICAgICAgICAgIGNhc2UgXCJ6XCI6IHJldHVybiB0aGlzLiNtdHhXb3JsZEJhc2UuZm9yd2FyZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdwb3J0IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKF9icmFuY2g6IMaSLk5vZGUpOiDGki5WaWV3cG9ydCB7XHJcbiAgICAgIGxldCBjbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IG5ldyDGki5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgICAgY21wQ2FtZXJhLm10eFBpdm90LnRyYW5zbGF0ZSjGki5WZWN0b3IzLlooNCkpO1xyXG4gICAgICBjbXBDYW1lcmEubXR4UGl2b3Qucm90YXRlWSgxODApO1xyXG5cclxuICAgICAgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBDYW52YXMuY3JlYXRlKCk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuXHJcbiAgICAgIGxldCB2aWV3cG9ydDogxpIuVmlld3BvcnQgPSBuZXcgxpIuVmlld3BvcnQoKTtcclxuICAgICAgdmlld3BvcnQuaW5pdGlhbGl6ZShcIsaSQWlkLVZpZXdwb3J0XCIsIF9icmFuY2gsIGNtcENhbWVyYSwgY2FudmFzKTtcclxuICAgICAgcmV0dXJuIHZpZXdwb3J0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZXhwYW5kQ2FtZXJhVG9JbnRlcmFjdGl2ZU9yYml0KF92aWV3cG9ydDogxpIuVmlld3BvcnQsIF9zaG93Rm9jdXM6IGJvb2xlYW4gPSB0cnVlLCBfc3BlZWRDYW1lcmFSb3RhdGlvbjogbnVtYmVyID0gMSwgX3NwZWVkQ2FtZXJhVHJhbnNsYXRpb246IG51bWJlciA9IDAuMDEsIF9zcGVlZENhbWVyYURpc3RhbmNlOiBudW1iZXIgPSAwLjAwMSwgX3JlZHJhdzogKCkgPT4gdm9pZCA9ICgpID0+IF92aWV3cG9ydC5kcmF3KCksIF90cmFuc2xhdGVPblBpY2s6ICgpID0+IGJvb2xlYW4gPSAoKSA9PiB0cnVlKTogQ2FtZXJhT3JiaXQge1xyXG4gICAgICAvLyBfdmlld3BvcnQuc2V0Rm9jdXModHJ1ZSk7XHJcbiAgICAgIC8vIF92aWV3cG9ydC5hY3RpdmF0ZVBvaW50ZXJFdmVudCjGki5FVkVOVF9QT0lOVEVSLkRPV04sIHRydWUpO1xyXG4gICAgICAvLyBfdmlld3BvcnQuYWN0aXZhdGVQb2ludGVyRXZlbnQoxpIuRVZFTlRfUE9JTlRFUi5VUCwgdHJ1ZSk7XHJcbiAgICAgIC8vIF92aWV3cG9ydC5hY3RpdmF0ZVBvaW50ZXJFdmVudCjGki5FVkVOVF9QT0lOVEVSLk1PVkUsIHRydWUpO1xyXG4gICAgICAvLyBfdmlld3BvcnQuYWN0aXZhdGVXaGVlbEV2ZW50KMaSLkVWRU5UX1dIRUVMLldIRUVMLCB0cnVlKTtcclxuICAgICAgX3ZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIGhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIF92aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIGhuZFBvaW50ZXJEb3duKTtcclxuICAgICAgX3ZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgaG5kUG9pbnRlck1vdmUpO1xyXG4gICAgICBfdmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybGVhdmVcIiwgaG5kUG9pbnRlclVwKTtcclxuICAgICAgX3ZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmNhbmNlbFwiLCBobmRQb2ludGVyVXApO1xyXG4gICAgICBfdmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCBobmRXaGVlbE1vdmUpO1xyXG5cclxuICAgICAgY29uc3QgZmFjdG9yUGFuOiBudW1iZXIgPSAxIC8gNTAwO1xyXG4gICAgICBjb25zdCBmYWN0b3JGbHk6IG51bWJlciA9IDEgLyAyMDtcclxuICAgICAgY29uc3QgZmFjdG9yWm9vbTogbnVtYmVyID0gMSAvIDM7XHJcbiAgICAgIGNvbnN0IGZhY3Rvclpvb21Ub3VjaDogbnVtYmVyID0gMi41O1xyXG5cclxuICAgICAgY29uc3QgZG91YmxlVGFwVGhyZXNob2xkID0geyB0aW1lOiAzMDAsIGRpc3RhbmNlOiAzMCAqKiAyIH07IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgY29uc3QgcGluY2hUaHJlc2hvbGQ6IG51bWJlciA9IDcwOyAvLyBtYXggaG9yaXpvbnRhbCBkaXN0YW5jZSBiZXR3ZWVuIHR3byB0b3VjaGVzIHRvIGJlIHJlY29nbml6ZWQgYXMgcGluY2hcclxuXHJcbiAgICAgIGxldCBmbHlTcGVlZDogbnVtYmVyID0gMC4zO1xyXG4gICAgICBsZXQgZmx5QWNjZWxlcmF0ZWQ6IG51bWJlciA9IDEwO1xyXG4gICAgICBsZXQgdGltZXI6IMaSLlRpbWVyID0gbmV3IMaSLlRpbWVyKMaSLlRpbWUuZ2FtZSwgMjAsIDAsIGhuZFRpbWVyKTtcclxuICAgICAgbGV0IGNudEZseTogxpIuQ29udHJvbCA9IG5ldyDGki5Db250cm9sKFwiRmx5XCIsIGZseVNwZWVkKTtcclxuICAgICAgY250Rmx5LnNldERlbGF5KDUwMCk7XHJcbiAgICAgIGxldCBmbHlpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgY29uc29sZS5sb2codGltZXIpO1xyXG5cclxuICAgICAgbGV0IHRvdWNoU3RhdGU6IFwib3JiaXRcIiB8IFwiZmx5XCIgfCBcInpvb21cIjtcclxuXHJcbiAgICAgIGxldCBjbnRNb3VzZUhvcml6b250YWw6IMaSLkNvbnRyb2wgPSBuZXcgxpIuQ29udHJvbChcIk1vdXNlSG9yaXpvbnRhbFwiLCAtMSk7XHJcbiAgICAgIGxldCBjbnRNb3VzZVZlcnRpY2FsOiDGki5Db250cm9sID0gbmV3IMaSLkNvbnRyb2woXCJNb3VzZVZlcnRpY2FsXCIsIC0xKTtcclxuXHJcbiAgICAgIC8vIGNhbWVyYSBzZXR1cFxyXG4gICAgICBsZXQgY2FtZXJhOiBDYW1lcmFPcmJpdE1vdmluZ0ZvY3VzO1xyXG4gICAgICBjYW1lcmEgPSBuZXcgQ2FtZXJhT3JiaXRNb3ZpbmdGb2N1cyhfdmlld3BvcnQuY2FtZXJhLCA1LCA4NSwgMC4wMSwgMTAwMCk7XHJcbiAgICAgIC8vVE9ETzogcmVtb3ZlIHRoZSBmb2xsb3dpbmcgbGluZSwgY2FtZXJhIG11c3Qgbm90IGJlIG1hbmlwdWxhdGVkIGJ1dCBzaG91bGQgYWxyZWFkeSBiZSBzZXQgdXAgd2hlbiBjYWxsaW5nIHRoaXMgbWV0aG9kXHJcbiAgICAgIF92aWV3cG9ydC5jYW1lcmEucHJvamVjdENlbnRyYWwoX3ZpZXdwb3J0LmNhbWVyYS5nZXRBc3BlY3QoKSwgX3ZpZXdwb3J0LmNhbWVyYS5nZXRGaWVsZE9mVmlldygpLCBfdmlld3BvcnQuY2FtZXJhLmdldERpcmVjdGlvbigpLCAwLjAxLCAxMDAwKTtcclxuXHJcbiAgICAgIC8vIHlzZXQgdXAgYXhpcyB0byBjb250cm9sXHJcbiAgICAgIGNhbWVyYS5heGlzUm90YXRlWC5hZGRDb250cm9sKGNudE1vdXNlVmVydGljYWwpO1xyXG4gICAgICBjYW1lcmEuYXhpc1JvdGF0ZVguc2V0RmFjdG9yKF9zcGVlZENhbWVyYVJvdGF0aW9uKTtcclxuXHJcbiAgICAgIGNhbWVyYS5heGlzUm90YXRlWS5hZGRDb250cm9sKGNudE1vdXNlSG9yaXpvbnRhbCk7XHJcbiAgICAgIGNhbWVyYS5heGlzUm90YXRlWS5zZXRGYWN0b3IoX3NwZWVkQ2FtZXJhUm90YXRpb24pO1xyXG4gICAgICAvLyBfdmlld3BvcnQuZ2V0QnJhbmNoKCkuYWRkQ2hpbGQoY2FtZXJhKTtcclxuXHJcbiAgICAgIGxldCBmb2N1czogxpIuTm9kZTtcclxuICAgICAgaWYgKF9zaG93Rm9jdXMpIHtcclxuICAgICAgICBmb2N1cyA9IG5ldyBOb2RlQ29vcmRpbmF0ZVN5c3RlbShcIkZvY3VzXCIpO1xyXG4gICAgICAgIGZvY3VzLmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50VHJhbnNmb3JtKCkpO1xyXG4gICAgICAgIF92aWV3cG9ydC5nZXRCcmFuY2goKS5hZGRDaGlsZChmb2N1cyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGFjdGl2ZVBvaW50ZXJzOiBNYXA8bnVtYmVyLCBQb2ludGVyRXZlbnQ+ID0gbmV3IE1hcCgpO1xyXG4gICAgICBsZXQgcHJldlBvaW50ZXI6IFBvaW50ZXJFdmVudDtcclxuICAgICAgbGV0IHByZXZEaXN0YW5jZTogbnVtYmVyO1xyXG5cclxuICAgICAgcmVkcmF3KCk7XHJcbiAgICAgIHJldHVybiBjYW1lcmE7XHJcblxyXG4gICAgICBmdW5jdGlvbiBobmRQb2ludGVyTW92ZShfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghX2V2ZW50LmJ1dHRvbnMpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGFjdGl2ZVBvaW50ZXJzLnNldChfZXZlbnQucG9pbnRlcklkLCBfZXZlbnQpO1xyXG5cclxuICAgICAgICBsZXQgcG9zQ2FtZXJhOiDGki5WZWN0b3IzID0gY2FtZXJhLm5vZGVDYW1lcmEubXR4V29ybGQudHJhbnNsYXRpb24uY2xvbmU7XHJcblxyXG4gICAgICAgIC8vIG9yYml0XHJcbiAgICAgICAgaWYgKChfZXZlbnQuYnV0dG9ucyA9PSA0ICYmICEoX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50LmFsdEtleSB8fCBfZXZlbnQuc2hpZnRLZXkpKSB8fCAoX2V2ZW50LmJ1dHRvbnMgPT0gMSAmJiBfZXZlbnQuYWx0S2V5KSB8fCB0b3VjaFN0YXRlID09IFwib3JiaXRcIikge1xyXG4gICAgICAgICAgY250TW91c2VIb3Jpem9udGFsLnNldElucHV0KF9ldmVudC5tb3ZlbWVudFgpO1xyXG4gICAgICAgICAgY250TW91c2VWZXJ0aWNhbC5zZXRJbnB1dChfZXZlbnQubW92ZW1lbnRZKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZseVxyXG4gICAgICAgIGlmICgoX2V2ZW50LmJ1dHRvbnMgPT0gMiAmJiAhX2V2ZW50LmFsdEtleSkgfHwgdG91Y2hTdGF0ZSA9PSBcImZseVwiKSB7XHJcbiAgICAgICAgICBjbnRNb3VzZUhvcml6b250YWwuc2V0SW5wdXQoX2V2ZW50Lm1vdmVtZW50WCAqIGZhY3RvckZseSk7XHJcbiAgICAgICAgICBjbnRNb3VzZVZlcnRpY2FsLnNldElucHV0KF9ldmVudC5tb3ZlbWVudFkgKiBmYWN0b3JGbHkpO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLnByZXBhcmUoY2FtZXJhKTtcclxuICAgICAgICAgIGxldCBvZmZzZXQ6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLkRJRkZFUkVOQ0UocG9zQ2FtZXJhLCBjYW1lcmEubm9kZUNhbWVyYS5tdHhXb3JsZC50cmFuc2xhdGlvbik7XHJcbiAgICAgICAgICBjYW1lcmEubXR4TG9jYWwudHJhbnNsYXRlKG9mZnNldCwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gem9vbVxyXG4gICAgICAgIGlmICgoX2V2ZW50LmJ1dHRvbnMgPT0gNCAmJiBfZXZlbnQuY3RybEtleSkgfHwgKF9ldmVudC5idXR0b25zID09IDIgJiYgX2V2ZW50LmFsdEtleSkpXHJcbiAgICAgICAgICB6b29tKF9ldmVudC5tb3ZlbWVudFggKiBmYWN0b3Jab29tKTtcclxuXHJcbiAgICAgICAgLy8gcGluY2ggem9vbVxyXG4gICAgICAgIGlmICh0b3VjaFN0YXRlID09IFwiem9vbVwiKSB7XHJcbiAgICAgICAgICBjb25zdCBpdGVyYXRvcjogSXRlcmFibGVJdGVyYXRvcjxQb2ludGVyRXZlbnQ+ID0gYWN0aXZlUG9pbnRlcnMudmFsdWVzKCk7XHJcbiAgICAgICAgICBjb25zdCBkaXN0YW5jZTogbnVtYmVyID0gTWF0aC5hYnMoaXRlcmF0b3IubmV4dCgpLnZhbHVlLm9mZnNldFkgLSBpdGVyYXRvci5uZXh0KCkudmFsdWUub2Zmc2V0WSk7XHJcbiAgICAgICAgICBpZiAocHJldkRpc3RhbmNlKVxyXG4gICAgICAgICAgICB6b29tKChwcmV2RGlzdGFuY2UgLSBkaXN0YW5jZSkgKiBmYWN0b3Jab29tVG91Y2gpO1xyXG5cclxuICAgICAgICAgIHByZXZEaXN0YW5jZSA9IGRpc3RhbmNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcGFuIFxyXG4gICAgICAgIGlmIChfZXZlbnQuYnV0dG9ucyA9PSA0ICYmIChfZXZlbnQuYWx0S2V5IHx8IF9ldmVudC5zaGlmdEtleSkpIHtcclxuICAgICAgICAgIGNhbWVyYS50cmFuc2xhdGVYKC1fZXZlbnQubW92ZW1lbnRYICogY2FtZXJhLmRpc3RhbmNlICogZmFjdG9yUGFuKTtcclxuICAgICAgICAgIGNhbWVyYS50cmFuc2xhdGVZKF9ldmVudC5tb3ZlbWVudFkgKiBjYW1lcmEuZGlzdGFuY2UgKiBmYWN0b3JQYW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVkcmF3KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhuZFRpbWVyKF9ldmVudDogxpIuRXZlbnRUaW1lcik6IHZvaWQge1xyXG4gICAgICAgIGlmICghZmx5aW5nKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGNudEZseS5zZXRGYWN0b3IoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlNISUZUX0xFRlRdKSA/IGZseUFjY2VsZXJhdGVkIDogZmx5U3BlZWQpO1xyXG4gICAgICAgIGNudEZseS5zZXRJbnB1dCjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuVywgxpIuS0VZQk9BUkRfQ09ERS5BLCDGki5LRVlCT0FSRF9DT0RFLlMsIMaSLktFWUJPQVJEX0NPREUuRCwgxpIuS0VZQk9BUkRfQ09ERS5RLCDGki5LRVlCT0FSRF9DT0RFLkVdKSA/IDEgOiAwKTtcclxuXHJcbiAgICAgICAgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5XXSkpXHJcbiAgICAgICAgICBjYW1lcmEudHJhbnNsYXRlWigtY250Rmx5LmdldE91dHB1dCgpKTtcclxuICAgICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuU10pKVxyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVooY250Rmx5LmdldE91dHB1dCgpKTtcclxuICAgICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuQV0pKVxyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVgoLWNudEZseS5nZXRPdXRwdXQoKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLkRdKSlcclxuICAgICAgICAgIGNhbWVyYS50cmFuc2xhdGVYKGNudEZseS5nZXRPdXRwdXQoKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlFdKSlcclxuICAgICAgICAgIGNhbWVyYS50cmFuc2xhdGVZKC1jbnRGbHkuZ2V0T3V0cHV0KCkpO1xyXG4gICAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5FXSkpXHJcbiAgICAgICAgICBjYW1lcmEudHJhbnNsYXRlWShjbnRGbHkuZ2V0T3V0cHV0KCkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICByZWRyYXcoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaG5kUG9pbnRlckRvd24oX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBhY3RpdmVQb2ludGVycy5zZXQoX2V2ZW50LnBvaW50ZXJJZCwgX2V2ZW50KTtcclxuXHJcbiAgICAgICAgZmx5aW5nID0gKF9ldmVudC5idXR0b25zID09IDIgJiYgIV9ldmVudC5hbHRLZXkpO1xyXG5cclxuICAgICAgICBpZiAoX2V2ZW50LnBvaW50ZXJUeXBlID09IFwidG91Y2hcIikge1xyXG4gICAgICAgICAgdG91Y2hTdGF0ZSA9IFwib3JiaXRcIjtcclxuXHJcbiAgICAgICAgICBpZiAoYWN0aXZlUG9pbnRlcnMuc2l6ZSA9PSAyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZXJhdG9yOiBJdGVyYWJsZUl0ZXJhdG9yPFBvaW50ZXJFdmVudD4gPSBhY3RpdmVQb2ludGVycy52YWx1ZXMoKTtcclxuICAgICAgICAgICAgY29uc3QgZGlzdGFuY2U6IG51bWJlciA9IE1hdGguYWJzKGl0ZXJhdG9yLm5leHQoKS52YWx1ZS5vZmZzZXRYIC0gaXRlcmF0b3IubmV4dCgpLnZhbHVlLm9mZnNldFgpO1xyXG4gICAgICAgICAgICB0b3VjaFN0YXRlID0gZGlzdGFuY2UgPCBwaW5jaFRocmVzaG9sZCA/IFwiem9vbVwiIDogXCJmbHlcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRvdWJsZVRhcDogYm9vbGVhbiA9IGFjdGl2ZVBvaW50ZXJzLnNpemUgPT0gMSAmJlxyXG4gICAgICAgICAgKF9ldmVudC50aW1lU3RhbXAgLSAocHJldlBvaW50ZXI/LnRpbWVTdGFtcCA/PyAwKSA8IGRvdWJsZVRhcFRocmVzaG9sZC50aW1lKSAmJlxyXG4gICAgICAgICAgKHByZXZQb2ludGVyPy5vZmZzZXRYIC0gX2V2ZW50Lm9mZnNldFggPz8gMCkgKiogMiArIChwcmV2UG9pbnRlcj8ub2Zmc2V0WSAtIF9ldmVudC5vZmZzZXRZID8/IDApICoqIDIgPCBkb3VibGVUYXBUaHJlc2hvbGQuZGlzdGFuY2U7XHJcblxyXG4gICAgICAgIHByZXZQb2ludGVyID0gZG91YmxlVGFwID8gbnVsbCA6IF9ldmVudDtcclxuXHJcbiAgICAgICAgaWYgKF9ldmVudC5idXR0b24gIT0gMCB8fCBfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQuYWx0S2V5IHx8IF9ldmVudC5zaGlmdEtleSB8fCAoX2V2ZW50LnBvaW50ZXJUeXBlID09IFwidG91Y2hcIiAmJiAhZG91YmxlVGFwKSlcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdG91Y2hTdGF0ZSA9IG51bGw7XHJcblxyXG4gICAgICAgIGxldCBwb3M6IMaSLlZlY3RvcjIgPSBuZXcgxpIuVmVjdG9yMihfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgIGxldCBwaWNrczogxpIuUGlja1tdID0gxpIuUGlja2VyLnBpY2tWaWV3cG9ydChfdmlld3BvcnQsIHBvcyk7XHJcbiAgICAgICAgaWYgKHBpY2tzLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vIHBpY2tzLnNvcnQoKF9hOiDGki5QaWNrLCBfYjogxpIuUGljaykgPT4gKF9hLnpCdWZmZXIgPCBfYi56QnVmZmVyICYmIF9hLmdpem1vKSA/IC0xIDogMSk7XHJcbiAgICAgICAgcGlja3Muc29ydCgoX2EsIF9iKSA9PiB7XHJcbiAgICAgICAgICBpZiAoX2EuZ2l6bW8gJiYgIV9iLmdpem1vKVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICBpZiAoIV9hLmdpem1vICYmIF9iLmdpem1vKVxyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgIC8vIElmIGJvdGggcGlja3MgaGF2ZSBhIGdpem1vIHByb3BlcnR5IG9yIGlmIG5laXRoZXIgZG9lcywgcHJpb3JpdGl6ZSBiYXNlZCBvbiB6QnVmZmVyIHZhbHVlXHJcbiAgICAgICAgICByZXR1cm4gX2EuekJ1ZmZlciAtIF9iLnpCdWZmZXI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGxldCBwb3NDYW1lcmE6IMaSLlZlY3RvcjMgPSBjYW1lcmEubm9kZUNhbWVyYS5tdHhXb3JsZC50cmFuc2xhdGlvbjtcclxuICAgICAgICAvLyBjYW1lcmEubXR4TG9jYWwudHJhbnNsYXRpb24gPSBwaWNrc1swXS5wb3NXb3JsZDtcclxuICAgICAgICAvLyAvLyDGki5SZW5kZXIucHJlcGFyZShjYW1lcmEpO1xyXG4gICAgICAgIC8vIGNhbWVyYS5wb3NpdGlvbkNhbWVyYShwb3NDYW1lcmEpO1xyXG4gICAgICAgIC8vIGlmICghKHBpY2tzWzBdLmdpem1vIGluc3RhbmNlb2YgQ29tcG9uZW50VHJhbnNsYXRvcikpXHJcbiAgICAgICAgaWYgKF90cmFuc2xhdGVPblBpY2soKSlcclxuICAgICAgICAgIGNhbWVyYS5tdHhMb2NhbC50cmFuc2xhdGlvbiA9IHBpY2tzWzBdLnBvc1dvcmxkO1xyXG4gICAgICAgIHJlZHJhdygpO1xyXG5cclxuICAgICAgICBfdmlld3BvcnQuY2FudmFzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwicGlja1wiLCB7IGRldGFpbDogcGlja3NbMF0sIGJ1YmJsZXM6IHRydWUgfSkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBobmRQb2ludGVyVXAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBhY3RpdmVQb2ludGVycy5kZWxldGUoX2V2ZW50LnBvaW50ZXJJZCk7XHJcbiAgICAgICAgaWYgKGFjdGl2ZVBvaW50ZXJzLnNpemUgPCAyKVxyXG4gICAgICAgICAgcHJldkRpc3RhbmNlID0gMDtcclxuXHJcbiAgICAgICAgdG91Y2hTdGF0ZSA9IG51bGw7XHJcbiAgICAgICAgZmx5aW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhuZFdoZWVsTW92ZShfZXZlbnQ6IFdoZWVsRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICB6b29tKF9ldmVudC5kZWx0YVkpO1xyXG4gICAgICAgIHJlZHJhdygpO1xyXG4gICAgICB9XHJcbiAgICAgIGZ1bmN0aW9uIHpvb20oX2RlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjYW1lcmEuZGlzdGFuY2UgKj0gMSArIF9kZWx0YSAqIF9zcGVlZENhbWVyYURpc3RhbmNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiByZWRyYXcoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGZvY3VzKVxyXG4gICAgICAgICAgZm9jdXMubXR4TG9jYWwudHJhbnNsYXRpb24gPSBjYW1lcmEubXR4TG9jYWwudHJhbnNsYXRpb247XHJcbiAgICAgICAgxpIuUmVuZGVyLnByZXBhcmUoY2FtZXJhKTtcclxuICAgICAgICBfcmVkcmF3KCk7XHJcbiAgICAgICAgLy8gX3ZpZXdwb3J0LmRyYXcoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSJdfQ==