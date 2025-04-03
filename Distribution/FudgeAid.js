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
    // TODO: Think about the Transformator and its usage in the Editor (separation of concerns). 
    // Maybe the transformator should be part of the editor after all and handle components directly instead of only matrices.
    // That way no hacky event dispatching/handling would be needed, as instead the transformator could handle everything internally.
    /**
     * Allows to translate, rotate and scale matrices visually by dragging with a pointer.
     * Installs pointer event listeners on the given {@link ƒ.Viewport}s canvas on construction.
     * Use {@link addListeners}/{@link removeListeners} to handle the installation manually.
     */
    class Transformator {
        #mtxLocal; // local matrix of the object to be transformed
        #mtxWorld; // world matrix of the object to be transformed
        #mtxLocalBase; // local matrix in a state before a transformation starts
        #mtxWorldBase; // world matrix in a state before a transformation starts
        /** The normal vector of the plane with which the mouse ray collides */
        #normalCollisionPlane;
        /** The vector pointing from the world position to the pointer hit on pointer down. Not normalized - magnitude represents distance. */
        #vctPointerDown;
        /** The vector pointing from the world position to the pointer hit on pointer move. Not normalized - magnitude represents distance. */
        #vctPointerMove;
        #isTransforming;
        #startTransform;
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
            this.#mtxLocalBase = ƒ.Matrix4x4.IDENTITY(); // local matrix in a state before a transformation starts
            this.#mtxWorldBase = ƒ.Matrix4x4.IDENTITY(); // world matrix in a state before a transformation starts
            /** The normal vector of the plane with which the mouse ray collides */
            this.#normalCollisionPlane = ƒ.Vector3.ZERO();
            /** The vector pointing from the world position to the pointer hit on pointer down. Not normalized - magnitude represents distance. */
            this.#vctPointerDown = ƒ.Vector3.ZERO();
            /** The vector pointing from the world position to the pointer hit on pointer move. Not normalized - magnitude represents distance. */
            this.#vctPointerMove = ƒ.Vector3.ZERO();
            this.#isTransforming = false;
            this.#startTransform = false;
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
                this.viewport.canvas.style.cursor = "grabbing";
                this.#mtxLocalBase.copy(this.#mtxLocal);
                this.#mtxWorldBase.copy(this.#mtxWorld);
                if (this.selected == "x" || this.selected == "y" || this.selected == "z") {
                    if (this.mode == "rotate") {
                        this.#normalCollisionPlane.copy(this.getAxis(this.selected));
                    }
                    else {
                        const mtxNormal = ƒ.Matrix4x4.LOOK_AT(this.#mtxWorld.translation, this.camera.mtxWorld.translation, this.getAxis(this.selected), true);
                        this.#normalCollisionPlane.copy(mtxNormal.getForward()); // normal of the plane the mouse ray will collide with
                        ƒ.Recycler.store(mtxNormal);
                    }
                }
                else if (this.selected == "xyz") {
                    this.#normalCollisionPlane.copy(this.camera.mtxWorld.getForward().negate());
                }
                else {
                    const axis = "xyz".replace(this.selected[0], "").replace(this.selected[1], "");
                    this.#normalCollisionPlane.copy(this.getAxis(axis));
                }
                const point = this.getPoint3D(_event);
                ƒ.Vector3.DIFFERENCE(point, this.#mtxWorld.translation, this.#vctPointerDown);
                this.#vctPointerMove.copy(this.#vctPointerDown);
                ƒ.Recycler.store(point);
                this.#startTransform = true;
            };
            this.hndPointerMove = (_event) => {
                this.#isTransforming = false;
                this.viewport.canvas.style.cursor = "default";
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
                    if (this.selected)
                        this.viewport.canvas.style.cursor = "grab";
                    ƒ.Recycler.store(point);
                    return;
                }
                if (!this.camera || !this.viewport || !this.selected || !this.#mtxLocal || !this.#mtxWorld)
                    return;
                this.viewport.canvas.style.cursor = "grabbing";
                const isSnapping = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.CTRL_LEFT, ƒ.KEYBOARD_CODE.CTRL_RIGHT]);
                this.#isTransforming = true;
                if (this.#startTransform == true) {
                    this.#startTransform = false;
                    this.viewport.canvas.dispatchEvent(new Event("startTransform", { bubbles: true }));
                }
                ƒ.Vector3.DIFFERENCE(this.getPoint3D(_event), this.#mtxWorldBase.translation, this.#vctPointerMove);
                this.#mtxLocal.copy(this.#mtxLocalBase); // reset
                let axis;
                if (this.selected == "x" || this.selected == "y" || this.selected == "z")
                    axis = this.getAxis(this.selected);
                const mtxWorldInverse = this.#mtxWorldBase.clone.invert();
                switch (this.mode) {
                    case "translate":
                        const translation = this.selected.length == 1 ? ƒ.Vector3.PROJECTION(this.#vctPointerMove, axis) : this.#vctPointerMove.clone;
                        const translationPointerDown = this.selected.length == 1 ? ƒ.Vector3.PROJECTION(this.#vctPointerDown, axis) : this.#vctPointerDown.clone;
                        translation.subtract(translationPointerDown);
                        if (isSnapping)
                            translation.apply((_value) => ƒ.Calc.snap(_value, this.snapDistance));
                        translation.transform(mtxWorldInverse, false);
                        this.#mtxLocal.translate(translation);
                        // restore scaling directions
                        this.#mtxLocal.scaling = this.#mtxLocal.scaling.apply((_value, _index, _component) => _value * Math.sign(this.#mtxLocalBase.scaling[_component]));
                        ƒ.Recycler.store(mtxWorldInverse);
                        ƒ.Recycler.store(translation);
                        ƒ.Recycler.store(translationPointerDown);
                        break;
                    case "rotate":
                        let angle = ƒ.Vector3.ANGLE(this.#vctPointerDown, this.#vctPointerMove);
                        if (isSnapping)
                            angle = ƒ.Calc.snap(angle, this.snapAngle);
                        const cross = ƒ.Vector3.CROSS(this.#vctPointerDown, this.#vctPointerMove);
                        if (ƒ.Vector3.DOT(axis, cross) < 0)
                            angle = -angle;
                        // const qRotation: ƒ.Quaternion = ƒ.Quaternion.ROTATION_AXIS_ANGLE(axis, angle);
                        const mtxRotation = ƒ.Matrix4x4.ROTATION_AXIS_ANGLE(axis, angle);
                        if (isSnapping) { // rotate directionPointerDown into snapped direction
                            this.#vctPointerMove.copy(this.#vctPointerDown);
                            this.#vctPointerMove.transform(mtxRotation);
                        }
                        const mtxLocalInverse = ƒ.Matrix4x4.INVERSE(this.#mtxLocalBase);
                        const mtxParentWorld = ƒ.Matrix4x4.PRODUCT(this.#mtxWorldBase, mtxLocalInverse);
                        const mtxParentWorldInverse = mtxParentWorld.clone.invert();
                        // mtxLocal = mtxParentWorldInverse * mtxRotation * mtxParentWorld * mtxLocal
                        mtxRotation.premultiply(mtxParentWorldInverse);
                        mtxRotation.multiply(mtxParentWorld);
                        mtxRotation.multiply(this.#mtxLocalBase);
                        // restore scaling directions
                        mtxRotation.scaling = mtxRotation.scaling.apply((_value, _index, _component) => _value * Math.sign(this.#mtxLocalBase.scaling[_component]));
                        this.#mtxLocal.compose(this.#mtxLocal.translation, mtxRotation.rotation, mtxRotation.scaling);
                        ƒ.Recycler.store(cross);
                        ƒ.Recycler.store(mtxRotation);
                        ƒ.Recycler.store(mtxLocalInverse);
                        ƒ.Recycler.store(mtxParentWorld);
                        ƒ.Recycler.store(mtxParentWorldInverse);
                        // const qParentWorld: ƒ.Quaternion = mtxParentWorld.quaternion;
                        // const qParentWorldInverse: ƒ.Quaternion = ƒ.Quaternion.INVERSE(mtxParentWorld.quaternion);
                        // qRotation.multiply(qParentWorldInverse, true);
                        // qRotation.multiply(qParentWorld);
                        // qRotation.multiply(this.#mtxLocalBase.quaternion);
                        // this.#mtxLocal.quaternion = qRotation;
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
                            axis = this.camera.mtxWorld.getRight().negate();
                        let offset = ƒ.Vector3.PROJECTION(this.#vctPointerDown, axis);
                        let direction = ƒ.Vector3.PROJECTION(this.#vctPointerMove, axis);
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
                        ƒ.Recycler.store(mtxScaling);
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
                if (this.#isTransforming) {
                    this.#isTransforming = false;
                    this.viewport.canvas.dispatchEvent(new Event("endTransform", { bubbles: true }));
                }
                this.#startTransform = false;
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
                x: this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorld.getRight(),
                y: this.space == "world" ? ƒ.Vector3.Y() : this.#mtxWorld.getUp(),
                z: this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorld.getForward()
            };
            const normals = {
                x: this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorld.getForward(),
                y: this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorld.getRight(),
                z: this.space == "world" ? ƒ.Vector3.Y() : this.#mtxWorld.getUp()
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
                        const directionPointerMove = ƒ.Vector3.NORMALIZATION(this.#vctPointerMove);
                        const directionPointerDown = ƒ.Vector3.NORMALIZATION(this.#vctPointerDown);
                        this.drawCircle(this.#torus, this.colors.base[this.selected], axes[this.selected], normals[this.selected], world2Pixel, 0);
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.colors.base[this.selected], directionPointerMove, axes[this.selected], translateArrowLength, translateArrowWidth, translateArrowSize, ƒ.MeshPyramid, 0);
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.colors.transparent[this.selected], directionPointerDown, axes[this.selected], translateArrowLength, translateArrowWidth, translateArrowSize, ƒ.MeshPyramid, 0);
                        ƒ.Recycler.store(directionPointerMove);
                        ƒ.Recycler.store(directionPointerDown);
                        break;
                    }
                    // draw an invisible quad to occlude the tori
                    const mtxQuad = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
                    const direction = _cmpCamera.mtxWorld.getForward().negate();
                    mtxQuad.scaling = ƒ.Vector3.ONE(translateArrowLength * 2);
                    mtxQuad.lookIn(direction);
                    ƒ.Render.setColorWriteMask(false, false, false, false);
                    ƒ.Gizmos.drawQuad(mtxQuad, this.colors.base.x, 0); // color doesn't matter
                    ƒ.Render.setColorWriteMask(true, true, true, true);
                    // draw the tori
                    let torus = _picking ? this.#torusPick : this.#torus;
                    for (const axis of ["x", "y", "z"])
                        this.drawCircle(torus, clrAxes[axis], axes[axis], normals[axis], world2Pixel, 0);
                    ƒ.Recycler.store(mtxQuad);
                    ƒ.Recycler.store(direction);
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
            ƒ.Recycler.store(mtxWorld);
        }
        getPoint3D(_event) {
            const point2D = ƒ.Recycler.reuse(ƒ.Vector2).set(_event.offsetX, _event.offsetY);
            const ray = this.viewport.getRayFromClient(point2D);
            ƒ.Recycler.store(point2D);
            return ray.intersectPlane(this.#mtxWorldBase.translation, this.#normalCollisionPlane);
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
                    case "x": return this.#mtxWorldBase.getRight();
                    case "y": return this.#mtxWorldBase.getUp();
                    case "z": return this.#mtxWorldBase.getForward();
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
            ƒ.Debug.fudge("FudgeAid viewport timer: " + timer);
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
                    (prevPointer?.offsetX - _event.offsetX || 0) ** 2 + (prevPointer?.offsetY - _event.offsetY || 0) ** 2 < doubleTapThreshold.distance;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VBaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9Tb3VyY2UvQWlkL1JlZmVyZW5jZXMudHMiLCIuLi9Tb3VyY2UvQWlkL0FyaXRobWV0aWMvQXJpdGgudHMiLCIuLi9Tb3VyY2UvQWlkL0FyaXRobWV0aWMvQXJpdGhCaXNlY3Rpb24udHMiLCIuLi9Tb3VyY2UvQWlkL0NhbWVyYS9DYW1lcmFPcmJpdC50cyIsIi4uL1NvdXJjZS9BaWQvQ2FtZXJhL0NhbWVyYU9yYml0TW92aW5nRm9jdXMudHMiLCIuLi9Tb3VyY2UvQWlkL0NhbnZhcy9DYW52YXMudHMiLCIuLi9Tb3VyY2UvQWlkL0dlb21ldHJ5L05vZGUudHMiLCIuLi9Tb3VyY2UvQWlkL0dlb21ldHJ5L05vZGVBcnJvdy50cyIsIi4uL1NvdXJjZS9BaWQvR2VvbWV0cnkvTm9kZUNvb3JkaW5hdGVTeXN0ZW0udHMiLCIuLi9Tb3VyY2UvQWlkL0xpZ2h0L05vZGVMaWdodFNldHVwLnRzIiwiLi4vU291cmNlL0FpZC9TcHJpdGUvTm9kZVNwcml0ZS50cyIsIi4uL1NvdXJjZS9BaWQvU3ByaXRlL1Nwcml0ZVNoZWV0QW5pbWF0aW9uLnRzIiwiLi4vU291cmNlL0FpZC9TdGF0ZU1hY2hpbmUvQ29tcG9uZW50U3RhdGVNYWNoaW5lLnRzIiwiLi4vU291cmNlL0FpZC9TdGF0ZU1hY2hpbmUvU3RhdGVNYWNoaW5lLnRzIiwiLi4vU291cmNlL0FpZC9UcmFuc2Zvcm0vVHJhbnNmb3JtYXRvci50cyIsIi4uL1NvdXJjZS9BaWQvVmlld3BvcnQvVmlld3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDtBQUMxRCxJQUFVLFFBQVEsQ0FFakI7QUFIRCwwREFBMEQ7QUFDMUQsV0FBVSxRQUFRO0lBQ2hCLFNBQVMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkQsQ0FBQyxFQUZTLFFBQVEsS0FBUixRQUFRLFFBRWpCO0FDSEQsSUFBVSxRQUFRLENBZWpCO0FBZkQsV0FBVSxRQUFRO0lBQ2hCOztPQUVHO0lBQ0gsTUFBc0IsS0FBSztRQUV6Qjs7V0FFRztRQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUksTUFBUyxFQUFFLElBQU8sRUFBRSxJQUFPLEVBQUUsYUFBa0QsQ0FBQyxPQUFVLEVBQUUsT0FBVSxFQUFFLEVBQUUsR0FBRyxPQUFPLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzdKLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFDMUMsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQztZQUMxQyxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO0tBQ0Y7SUFWcUIsY0FBSyxRQVUxQixDQUFBO0FBQ0gsQ0FBQyxFQWZTLFFBQVEsS0FBUixRQUFRLFFBZWpCO0FDZkQsSUFBVSxRQUFRLENBeUVqQjtBQXpFRCxXQUFVLFFBQVE7SUFDaEI7Ozs7T0FJRztJQUNILE1BQWEsY0FBYztRQWN6Qjs7Ozs7V0FLRztRQUNILFlBQ0UsU0FBcUMsRUFDckMsT0FBMkQsRUFDM0QsVUFBK0U7WUFDL0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7WUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7WUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7UUFDOUIsQ0FBQztRQUVEOzs7Ozs7Ozs7V0FTRztRQUNJLEtBQUssQ0FBQyxLQUFnQixFQUFFLE1BQWlCLEVBQUUsUUFBaUIsRUFBRSxhQUFzQixTQUFTLEVBQUUsY0FBdUIsU0FBUztZQUNwSSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFdkQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDO2dCQUN6QyxPQUFPO1lBRVQsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVO2dCQUNuQyxNQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsNEZBQTRGLENBQUMsQ0FBQyxDQUFDO1lBRWpILElBQUksT0FBTyxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3BELElBQUksWUFBWSxHQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbkQsSUFBSSxZQUFZLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7O2dCQUV6RSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFFTSxRQUFRO1lBQ2IsSUFBSSxHQUFHLEdBQVcsRUFBRSxDQUFDO1lBQ3JCLEdBQUcsSUFBSSxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzVELEdBQUcsSUFBSSxJQUFJLENBQUM7WUFDWixHQUFHLElBQUksVUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUMvRCxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUM7S0FDRjtJQWxFWSx1QkFBYyxpQkFrRTFCLENBQUE7QUFDSCxDQUFDLEVBekVTLFFBQVEsS0FBUixRQUFRLFFBeUVqQjtBQ3pFRCxJQUFVLFFBQVEsQ0E0R2pCO0FBNUdELFdBQVUsUUFBUTtJQUNoQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckIsTUFBYSxXQUFZLFNBQVEsQ0FBQyxDQUFDLElBQUk7UUFhckMsWUFBbUIsVUFBNkIsRUFBRSxpQkFBeUIsQ0FBQyxFQUFFLFdBQW1CLEVBQUUsRUFBRSxlQUF1QixDQUFDLEVBQUUsZUFBdUIsRUFBRTtZQUN0SixLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7WUFiUCxnQkFBVyxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxzQ0FBOEIsQ0FBQztZQUM1RSxnQkFBVyxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxzQ0FBOEIsQ0FBQztZQUM1RSxpQkFBWSxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxzQ0FBOEIsQ0FBQztZQXdGdkYsa0JBQWEsR0FBa0IsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDNUQsSUFBSSxNQUFNLEdBQXlCLE1BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUN6RCxRQUFpQixNQUFNLENBQUMsTUFBTyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNyQyxLQUFLLFNBQVM7d0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDckIsTUFBTTtvQkFDUixLQUFLLFNBQVM7d0JBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDckIsTUFBTTtvQkFDUixLQUFLLFVBQVU7d0JBQ2IsSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUM7Z0JBQzVCLENBQUM7WUFDSCxDQUFDLENBQUE7WUF2RkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztZQUNoQyxJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztZQUVoQyxJQUFJLFlBQVksR0FBeUIsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUNwRSxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRWhDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUM7WUFFL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0Isd0NBQXlCLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQix3Q0FBeUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlFLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLHdDQUF5QixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakYsQ0FBQztRQUVELElBQVcsU0FBUztZQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRUQsSUFBVyxVQUFVO1lBQ25CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QixDQUFDO1FBRUQsSUFBVyxRQUFRLENBQUMsU0FBaUI7WUFDbkMsSUFBSSxXQUFXLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzVGLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsRSxDQUFDO1FBRUQsSUFBVyxRQUFRO1lBQ2pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNoRCxDQUFDO1FBRUQsSUFBVyxTQUFTLENBQUMsTUFBYztZQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBRUQsSUFBVyxTQUFTO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCxJQUFXLFNBQVMsQ0FBQyxNQUFjO1lBQ2pDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVELElBQVcsU0FBUztZQUNsQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUVNLE9BQU8sQ0FBQyxNQUFjO1lBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7UUFFTSxPQUFPLENBQUMsTUFBYztZQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzlELENBQUM7UUFFRCxtRUFBbUU7UUFDNUQsY0FBYyxDQUFDLFNBQW9CO1lBQ3hDLElBQUksVUFBVSxHQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZGLElBQUksR0FBRyxHQUFXLFVBQVUsQ0FBQyxHQUFHLENBQUM7WUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO1lBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUNoQyxDQUFDO0tBZ0JGO0lBeEdZLG9CQUFXLGNBd0d2QixDQUFBO0FBQ0gsQ0FBQyxFQTVHUyxRQUFRLEtBQVIsUUFBUSxRQTRHakI7QUM1R0QsSUFBVSxRQUFRLENBZ0RqQjtBQWhERCxXQUFVLFFBQVE7SUFDaEIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBRXJCLE1BQWEsc0JBQXVCLFNBQVEsU0FBQSxXQUFXO1FBS3JELFlBQW1CLFVBQTZCLEVBQUUsaUJBQXlCLENBQUMsRUFBRSxXQUFtQixFQUFFLEVBQUUsZUFBdUIsQ0FBQyxFQUFFLGVBQXVCLFFBQVE7WUFDNUosS0FBSyxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztZQUwxRCxtQkFBYyxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxzQ0FBOEIsQ0FBQztZQUNsRixtQkFBYyxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxzQ0FBOEIsQ0FBQztZQUNsRixtQkFBYyxHQUFXLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxzQ0FBOEIsQ0FBQztZQTRCM0Ysa0JBQWEsR0FBa0IsQ0FBQyxNQUFhLEVBQVEsRUFBRTtnQkFDNUQsSUFBSSxNQUFNLEdBQXlCLE1BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUN6RCxRQUFpQixNQUFNLENBQUMsTUFBTyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNyQyxLQUFLLFlBQVk7d0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDeEIsTUFBTTtvQkFDUixLQUFLLFlBQVk7d0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDeEIsTUFBTTtvQkFDUixLQUFLLFlBQVk7d0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDNUIsQ0FBQztZQUNILENBQUMsQ0FBQTtZQXBDQyxJQUFJLENBQUMsSUFBSSxHQUFHLHdCQUF3QixDQUFDO1lBRXJDLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLHdDQUF5QixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDakYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0Isd0NBQXlCLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNqRixJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQix3Q0FBeUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25GLENBQUM7UUFFTSxVQUFVLENBQUMsTUFBYztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxDQUFDO1FBRU0sVUFBVSxDQUFDLE1BQWM7WUFDOUIsSUFBSSxXQUFXLEdBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0QsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUVNLFVBQVUsQ0FBQyxNQUFjO1lBQzlCLG9DQUFvQztZQUNwQyxJQUFJLFdBQVcsR0FBYyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUMzRCxXQUFXLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QyxDQUFDO0tBZUY7SUE1Q1ksK0JBQXNCLHlCQTRDbEMsQ0FBQTtBQUNILENBQUMsRUFoRFMsUUFBUSxLQUFSLFFBQVEsUUFnRGpCO0FDaERELElBQVUsUUFBUSxDQTRCakI7QUE1QkQsV0FBVSxRQUFRO0lBQ2hCLElBQVksZUFNWDtJQU5ELFdBQVksZUFBZTtRQUN6QixnQ0FBYSxDQUFBO1FBQ2Isb0NBQWlCLENBQUE7UUFDakIsZ0RBQTZCLENBQUE7UUFDN0IsOENBQTJCLENBQUE7UUFDM0IsMENBQXVCLENBQUE7SUFDekIsQ0FBQyxFQU5XLGVBQWUsR0FBZix3QkFBZSxLQUFmLHdCQUFlLFFBTTFCO0lBQ0Q7O09BRUc7SUFDSCxNQUFhLE1BQU07UUFDVixNQUFNLENBQUMsTUFBTSxDQUFDLGNBQXVCLElBQUksRUFBRSxrQkFBbUMsZUFBZSxDQUFDLElBQUksRUFBRSxTQUFpQixHQUFHLEVBQUUsVUFBa0IsR0FBRztZQUNwSixJQUFJLE1BQU0sR0FBeUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwRixNQUFNLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQztZQUNwQixJQUFJLEtBQUssR0FBd0IsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUM5QyxLQUFLLENBQUMsY0FBYyxHQUFHLGVBQWUsQ0FBQztZQUN2QyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDNUIsS0FBSyxDQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQzlCLEtBQUssQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1lBRS9CLElBQUksV0FBVyxFQUFFLENBQUM7Z0JBQ2hCLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO2dCQUNyQixLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUN4QixDQUFDO1lBQ0QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztLQUNGO0lBaEJZLGVBQU0sU0FnQmxCLENBQUE7QUFDSCxDQUFDLEVBNUJTLFFBQVEsS0FBUixRQUFRLFFBNEJqQjtBQzVCRCxJQUFVLFFBQVEsQ0FpQ2pCO0FBakNELFdBQVUsUUFBUTtJQUNoQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckIsTUFBYSxJQUFLLFNBQVEsQ0FBQyxDQUFDLElBQUk7aUJBQ2YsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUVqQyxZQUFZLFFBQWdCLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxVQUF3QixFQUFFLFNBQXNCLEVBQUUsS0FBYztZQUM5RyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDYixJQUFJLFVBQVU7Z0JBQ1osSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzFELElBQUksU0FBUztnQkFDWCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxLQUFLO2dCQUNQLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUVPLE1BQU0sQ0FBQyxXQUFXO1lBQ3hCLE9BQU8sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwQyxDQUFDO1FBRUQsSUFBVyxZQUFZO1lBQ3JCLElBQUksT0FBTyxHQUFvQixJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNsRSxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzNDLENBQUM7UUFFTSxLQUFLLENBQUMsV0FBVyxDQUFDLGNBQStCO1lBQ3RELCtKQUErSjtZQUMvSixJQUFJLElBQUksR0FBVyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25ELE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN2QyxxQkFBcUI7WUFDckIsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDOztJQTVCVSxhQUFJLE9BNkJoQixDQUFBO0FBQ0gsQ0FBQyxFQWpDUyxRQUFRLEtBQVIsUUFBUSxRQWlDakI7QUNqQ0QsSUFBVSxRQUFRLENBeUNqQjtBQXpDRCxXQUFVLFFBQVE7SUFDaEIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBR3JCLE1BQWEsU0FBVSxTQUFRLFNBQUEsSUFBSTtpQkFDbEIsc0JBQWlCLEdBQXdDLFNBQVMsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBRTVHLFlBQVksS0FBYSxFQUFFLE1BQWU7WUFDeEMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFckMsSUFBSSxLQUFLLEdBQVMsSUFBSSxTQUFBLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQWMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBVSxTQUFTLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDL0ssSUFBSSxJQUFJLEdBQVMsSUFBSSxTQUFBLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQWMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBVSxTQUFTLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDNUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRTFCLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztZQUM1RCxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7WUFFM0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RCLENBQUM7UUFFTyxNQUFNLENBQUMsdUJBQXVCO1lBQ3BDLElBQUksR0FBRyxHQUF3QyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ3pELEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQy9DLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQUksSUFBSSxHQUFrQixJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNsRSxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUVoRSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQzVELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUVELElBQVcsS0FBSyxDQUFDLE1BQWU7WUFDOUIsS0FBSyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztnQkFDckMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2xFLENBQUM7UUFDSCxDQUFDOztJQW5DVSxrQkFBUyxZQW9DckIsQ0FBQTtBQUNILENBQUMsRUF6Q1MsUUFBUSxLQUFSLFFBQVEsUUF5Q2pCO0FDekNELElBQVUsUUFBUSxDQWtCakI7QUFsQkQsV0FBVSxRQUFRO0lBQ2hCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUVyQixNQUFhLG9CQUFxQixTQUFRLFNBQUEsSUFBSTtRQUM1QyxZQUFZLFFBQWdCLGtCQUFrQixFQUFFLFVBQXdCO1lBQ3RFLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDekIsSUFBSSxRQUFRLEdBQVcsSUFBSSxTQUFBLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUUsSUFBSSxVQUFVLEdBQVcsSUFBSSxTQUFBLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUUsSUFBSSxTQUFTLEdBQVcsSUFBSSxTQUFBLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFNUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUIsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVqQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQixDQUFDO0tBQ0Y7SUFkWSw2QkFBb0IsdUJBY2hDLENBQUE7QUFDSCxDQUFDLEVBbEJTLFFBQVEsS0FBUixRQUFRLFFBa0JqQjtBQ2xCRCxJQUFVLFFBQVEsQ0EwQmpCO0FBMUJELFdBQVUsUUFBUTtJQUNoQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckI7OztPQUdHO0lBQ0gsU0FBZ0IsMEJBQTBCLENBQ3hDLEtBQWEsRUFDYixjQUF1QixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxVQUFtQixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxXQUFvQixJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFDaEosVUFBcUIsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsV0FBc0IsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRS9GLElBQUksR0FBRyxHQUFxQixJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNsRixHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFFdEMsSUFBSSxJQUFJLEdBQXFCLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3BGLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUV2QyxJQUFJLE9BQU8sR0FBcUIsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBRXRGLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFsQmUsbUNBQTBCLDZCQWtCekMsQ0FBQTtBQUNILENBQUMsRUExQlMsUUFBUSxLQUFSLFFBQVEsUUEwQmpCO0FDMUJELElBQVUsUUFBUSxDQTRFakI7QUE1RUQsV0FBVSxRQUFRO0lBQ2hCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQjs7T0FFRztJQUNILE1BQWEsVUFBVyxTQUFRLENBQUMsQ0FBQyxJQUFJO2lCQUNyQixTQUFJLEdBQWlCLFVBQVUsQ0FBQyxzQkFBc0IsRUFBRSxBQUFwRCxDQUFxRDtRQVV4RSxZQUFtQixLQUFhO1lBQzlCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQVZSLGNBQVMsR0FBVyxFQUFFLENBQUMsQ0FBQywrRkFBK0Y7WUFLdEgsaUJBQVksR0FBVyxDQUFDLENBQUM7WUFDekIsY0FBUyxHQUFXLENBQUMsQ0FBQztZQWdEOUI7O2VBRUc7WUFDSSxrQkFBYSxHQUFHLENBQUMsTUFBb0IsRUFBUSxFQUFFO2dCQUNwRCxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDdkgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDO1lBaERBLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRCx5REFBeUQ7WUFDekQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzdGLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFFTyxNQUFNLENBQUMsc0JBQXNCO1lBQ25DLElBQUksSUFBSSxHQUFpQixJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFXLGVBQWUsS0FBYSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsNkNBQTZDO1FBRXpHLFlBQVksQ0FBQyxVQUFnQztZQUNsRCxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztZQUM1QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixDQUFDO1FBRU0sYUFBYTtZQUNsQixJQUFJLElBQUksQ0FBQyxLQUFLO2dCQUNaLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOztXQUVHO1FBQ0ksU0FBUyxDQUFDLE1BQWM7WUFDN0IsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksV0FBVyxHQUFnQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1lBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUM7WUFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBQzVELElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO1lBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRyxDQUFDO1FBVUQ7O1dBRUc7UUFDSSxpQkFBaUIsQ0FBQyxVQUFrQjtZQUN6QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUMsQ0FBQzs7SUFyRVUsbUJBQVUsYUFzRXRCLENBQUE7QUFDSCxDQUFDLEVBNUVTLFFBQVEsS0FBUixRQUFRLFFBNEVqQjtBQzVFRCxJQUFVLFFBQVEsQ0FrSGpCO0FBbEhELFdBQVUsUUFBUTtJQUNoQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckI7O09BRUc7SUFDSCxNQUFhLFdBQVc7S0FLdkI7SUFMWSxvQkFBVyxjQUt2QixDQUFBO0lBRUQ7O09BRUc7SUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxLQUFhLEVBQUUsTUFBd0I7UUFDdkUsSUFBSSxJQUFJLEdBQW1CLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2hELElBQUksT0FBTyxHQUFtQixJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNuRCxPQUFPLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFOZSwwQkFBaUIsb0JBTWhDLENBQUE7SUFTRDs7O09BR0c7SUFDSCxNQUFhLG9CQUFvQjtRQUsvQixZQUFtQixLQUFhLEVBQUUsWUFBNEI7WUFKdkQsV0FBTSxHQUFrQixFQUFFLENBQUM7WUFLaEMsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUM7UUFDbEMsQ0FBQztRQUVEOztXQUVHO1FBQ0ksUUFBUSxDQUFDLE1BQXFCLEVBQUUsZUFBdUIsRUFBRSxPQUFtQjtZQUNqRixJQUFJLEdBQUcsR0FBbUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksT0FBTyxHQUFvQixJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyRCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFaEQsSUFBSSxLQUFLLEdBQVcsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFLENBQUM7Z0JBQ3hCLElBQUksS0FBSyxHQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDM0csS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUV4QixLQUFLLEVBQUUsQ0FBQztZQUNWLENBQUM7UUFDSCxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSSxjQUFjLENBQUMsVUFBdUIsRUFBRSxPQUFlLEVBQUUsZUFBdUIsRUFBRSxPQUFtQixFQUFFLFdBQXNCLEVBQUUsY0FBeUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7WUFDN0ssSUFBSSxHQUFHLEdBQW1CLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUNsRSxJQUFJLFNBQVMsR0FBZ0IsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUUsSUFBSSxJQUFJLEdBQWdCLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDekMsSUFBSSxLQUFLLEdBQWtCLEVBQUUsQ0FBQztZQUM5QixPQUFPLE9BQU8sRUFBRSxFQUFFLENBQUM7Z0JBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFFL0IsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDeEIsU0FBUztnQkFFWCxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDckMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDekIsTUFBTTtZQUNWLENBQUM7WUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakQsQ0FBQztRQUVPLFdBQVcsQ0FBQyxLQUFhLEVBQUUsUUFBeUIsRUFBRSxLQUFrQixFQUFFLGVBQXVCLEVBQUUsT0FBbUI7WUFDNUgsSUFBSSxHQUFHLEdBQW1CLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztZQUNsRSxJQUFJLFdBQVcsR0FBZ0IsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUUsSUFBSSxLQUFLLEdBQWdCLElBQUksV0FBVyxFQUFFLENBQUM7WUFFM0MsS0FBSyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUU1RSxJQUFJLFFBQVEsR0FBZ0IsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssR0FBRyxlQUFlLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDMUgsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3hDLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsb0NBQW9DO1lBRXBDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFNB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QkFDekIsWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFFbkIsVUFBVSxHQUFHLElBQUksQ0FBQztnQkFDbEIsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUNqQixDQUFDO1lBRUQsU0FBUyxZQUFZLENBQUMsTUFBa0I7Z0JBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BCLE1BQU0sRUFBRSxDQUFDO1lBQ1gsQ0FBQztZQUNELFNBQVMsSUFBSSxDQUFDLE1BQWM7Z0JBQzFCLE1BQU0sQ0FBQyxRQUFRLElBQUksQ0FBQyxHQUFHLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQztZQUN2RCxDQUFDO1lBRUQsU0FBUyxNQUFNO2dCQUNiLElBQUksS0FBSztvQkFDUCxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztnQkFDM0QsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pCLE9BQU8sRUFBRSxDQUFDO2dCQUNWLG9CQUFvQjtZQUN0QixDQUFDO1FBQ0gsQ0FBQztLQUNGO0lBOU5ZLGlCQUFRLFdBOE5wQixDQUFBO0FBQ0gsQ0FBQyxFQWxPUyxRQUFRLEtBQVIsUUFBUSxRQWtPakIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyAvIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0Rpc3RyaWJ1dGlvbi9GdWRnZUNvcmUuZC50c1wiLz5cclxubmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBGdWRnZUNvcmUuU2VyaWFsaXplci5yZWdpc3Rlck5hbWVzcGFjZShGdWRnZUFpZCk7XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIC8qKlxyXG4gICAqIEFic3RyYWN0IGNsYXNzIHN1cHBvcnRpbmcgdmVyc2lvdXMgYXJpdGhtZXRpY2FsIGhlbHBlciBmdW5jdGlvbnNcclxuICAgKi9cclxuICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQXJpdGgge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBvbmUgb2YgdGhlIHZhbHVlcyBwYXNzZWQgaW4sIGVpdGhlciBfdmFsdWUgaWYgd2l0aGluIF9taW4gYW5kIF9tYXggb3IgdGhlIGJvdW5kYXJ5IGJlaW5nIGV4Y2VlZGVkIGJ5IF92YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNsYW1wPFQ+KF92YWx1ZTogVCwgX21pbjogVCwgX21heDogVCwgX2lzU21hbGxlcjogKF92YWx1ZTE6IFQsIF92YWx1ZTI6IFQpID0+IGJvb2xlYW4gPSAoX3ZhbHVlMTogVCwgX3ZhbHVlMjogVCkgPT4geyByZXR1cm4gX3ZhbHVlMSA8IF92YWx1ZTI7IH0pOiBUIHtcclxuICAgICAgaWYgKF9pc1NtYWxsZXIoX3ZhbHVlLCBfbWluKSkgcmV0dXJuIF9taW47XHJcbiAgICAgIGlmIChfaXNTbWFsbGVyKF9tYXgsIF92YWx1ZSkpIHJldHVybiBfbWF4O1xyXG4gICAgICByZXR1cm4gX3ZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgLyoqXHJcbiAgICogV2l0aGluIGEgZ2l2ZW4gcHJlY2lzaW9uLCBhbiBvYmplY3Qgb2YgdGhpcyBjbGFzcyBmaW5kcyB0aGUgcGFyYW1ldGVyIHZhbHVlIGF0IHdoaWNoIGEgZ2l2ZW4gZnVuY3Rpb24gXHJcbiAgICogc3dpdGNoZXMgaXRzIGJvb2xlYW4gcmV0dXJuIHZhbHVlIHVzaW5nIGludGVydmFsIHNwbGl0dGluZyAoYmlzZWN0aW9uKS4gXHJcbiAgICogUGFzcyB0aGUgdHlwZSBvZiB0aGUgcGFyYW1ldGVyIGFuZCB0aGUgdHlwZSB0aGUgcHJlY2lzaW9uIGlzIG1lYXN1cmVkIGluLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBBcml0aEJpc2VjdGlvbjxQYXJhbWV0ZXIsIEVwc2lsb24+IHtcclxuICAgIC8qKiBUaGUgbGVmdCBib3JkZXIgb2YgdGhlIGludGVydmFsIGZvdW5kICovXHJcbiAgICBwdWJsaWMgbGVmdDogUGFyYW1ldGVyO1xyXG4gICAgLyoqIFRoZSByaWdodCBib3JkZXIgb2YgdGhlIGludGVydmFsIGZvdW5kICovXHJcbiAgICBwdWJsaWMgcmlnaHQ6IFBhcmFtZXRlcjtcclxuICAgIC8qKiBUaGUgZnVuY3Rpb24gdmFsdWUgYXQgdGhlIGxlZnQgYm9yZGVyIG9mIHRoZSBpbnRlcnZhbCBmb3VuZCAqL1xyXG4gICAgcHVibGljIGxlZnRWYWx1ZTogYm9vbGVhbjtcclxuICAgIC8qKiBUaGUgZnVuY3Rpb24gdmFsdWUgYXQgdGhlIHJpZ2h0IGJvcmRlciBvZiB0aGUgaW50ZXJ2YWwgZm91bmQgKi9cclxuICAgIHB1YmxpYyByaWdodFZhbHVlOiBib29sZWFuO1xyXG5cclxuICAgIHByaXZhdGUgZnVuY3Rpb246IChfdDogUGFyYW1ldGVyKSA9PiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBkaXZpZGU6IChfbGVmdDogUGFyYW1ldGVyLCBfcmlnaHQ6IFBhcmFtZXRlcikgPT4gUGFyYW1ldGVyO1xyXG4gICAgcHJpdmF0ZSBpc1NtYWxsZXI6IChfbGVmdDogUGFyYW1ldGVyLCBfcmlnaHQ6IFBhcmFtZXRlciwgX2Vwc2lsb246IEVwc2lsb24pID0+IGJvb2xlYW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgbmV3IFNvbHZlclxyXG4gICAgICogQHBhcmFtIF9mdW5jdGlvbiBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYW4gYXJndW1lbnQgb2YgdGhlIGdlbmVyaWMgdHlwZSA8UGFyYW1ldGVyPiBhbmQgcmV0dXJucyBhIGJvb2xlYW4gdmFsdWUuXHJcbiAgICAgKiBAcGFyYW0gX2RpdmlkZSBBIGZ1bmN0aW9uIHNwbGl0dGluZyB0aGUgaW50ZXJ2YWwgdG8gZmluZCBhIHBhcmFtZXRlciBmb3IgdGhlIG5leHQgaXRlcmF0aW9uLCBtYXkgc2ltcGx5IGJlIHRoZSBhcml0aG1ldGljIG1lYW5cclxuICAgICAqIEBwYXJhbSBfaXNTbWFsbGVyIEEgZnVuY3Rpb24gdGhhdCBkZXRlcm1pbmVzIGEgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBib3JkZXJzIG9mIHRoZSBjdXJyZW50IGludGVydmFsIGFuZCBjb21wYXJlcyB0aGlzIHRvIHRoZSBnaXZlbiBwcmVjaXNpb24gXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICBfZnVuY3Rpb246IChfdDogUGFyYW1ldGVyKSA9PiBib29sZWFuLFxyXG4gICAgICBfZGl2aWRlOiAoX2xlZnQ6IFBhcmFtZXRlciwgX3JpZ2h0OiBQYXJhbWV0ZXIpID0+IFBhcmFtZXRlcixcclxuICAgICAgX2lzU21hbGxlcjogKF9sZWZ0OiBQYXJhbWV0ZXIsIF9yaWdodDogUGFyYW1ldGVyLCBfZXBzaWxvbjogRXBzaWxvbikgPT4gYm9vbGVhbikge1xyXG4gICAgICB0aGlzLmZ1bmN0aW9uID0gX2Z1bmN0aW9uO1xyXG4gICAgICB0aGlzLmRpdmlkZSA9IF9kaXZpZGU7XHJcbiAgICAgIHRoaXMuaXNTbWFsbGVyID0gX2lzU21hbGxlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpbmRzIGEgc29sdXRpb24gd2l0aCB0aGUgZ2l2ZW4gcHJlY2lzaW9uIGluIHRoZSBnaXZlbiBpbnRlcnZhbCB1c2luZyB0aGUgZnVuY3Rpb25zIHRoaXMgU29sdmVyIHdhcyBjb25zdHJ1Y3RlZCB3aXRoLlxyXG4gICAgICogQWZ0ZXIgdGhlIG1ldGhvZCByZXR1cm5zLCBmaW5kIHRoZSBkYXRhIGluIHRoaXMgb2JqZWN0cyBwcm9wZXJ0aWVzLlxyXG4gICAgICogQHBhcmFtIF9sZWZ0IFRoZSBwYXJhbWV0ZXIgb24gb25lIHNpZGUgb2YgdGhlIGludGVydmFsLlxyXG4gICAgICogQHBhcmFtIF9yaWdodCBUaGUgcGFyYW1ldGVyIG9uIHRoZSBvdGhlciBzaWRlLCBtYXkgYmUgXCJzbWFsbGVyXCIgdGhhbiBbW19sZWZ0XV0uXHJcbiAgICAgKiBAcGFyYW0gX2Vwc2lsb24gVGhlIGRlc2lyZWQgcHJlY2lzaW9uIG9mIHRoZSBzb2x1dGlvbi5cclxuICAgICAqIEBwYXJhbSBfbGVmdFZhbHVlIFRoZSB2YWx1ZSBvbiB0aGUgbGVmdCBzaWRlIG9mIHRoZSBpbnRlcnZhbCwgb21pdCBpZiB5ZXQgdW5rbm93biBvciBwYXNzIGluIGlmIGtub3duIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuXHJcbiAgICAgKiBAcGFyYW0gX3JpZ2h0VmFsdWUgVGhlIHZhbHVlIG9uIHRoZSByaWdodCBzaWRlIG9mIHRoZSBpbnRlcnZhbCwgb21pdCBpZiB5ZXQgdW5rbm93biBvciBwYXNzIGluIGlmIGtub3duIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UuXHJcbiAgICAgKiBAdGhyb3dzIEVycm9yIGlmIGJvdGggc2lkZXMgb2YgdGhlIGludGVydmFsIHJldHVybiB0aGUgc2FtZSB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNvbHZlKF9sZWZ0OiBQYXJhbWV0ZXIsIF9yaWdodDogUGFyYW1ldGVyLCBfZXBzaWxvbjogRXBzaWxvbiwgX2xlZnRWYWx1ZTogYm9vbGVhbiA9IHVuZGVmaW5lZCwgX3JpZ2h0VmFsdWU6IGJvb2xlYW4gPSB1bmRlZmluZWQpOiB2b2lkIHtcclxuICAgICAgdGhpcy5sZWZ0ID0gX2xlZnQ7XHJcbiAgICAgIHRoaXMubGVmdFZhbHVlID0gX2xlZnRWYWx1ZSB8fCB0aGlzLmZ1bmN0aW9uKF9sZWZ0KTtcclxuICAgICAgdGhpcy5yaWdodCA9IF9yaWdodDtcclxuICAgICAgdGhpcy5yaWdodFZhbHVlID0gX3JpZ2h0VmFsdWUgfHwgdGhpcy5mdW5jdGlvbihfcmlnaHQpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuaXNTbWFsbGVyKF9sZWZ0LCBfcmlnaHQsIF9lcHNpbG9uKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICBpZiAodGhpcy5sZWZ0VmFsdWUgPT0gdGhpcy5yaWdodFZhbHVlKVxyXG4gICAgICAgIHRocm93KG5ldyBFcnJvcihcIkludGVydmFsIHNvbHZlciBjYW4ndCBvcGVyYXRlIHdpdGggaWRlbnRpY2FsIGZ1bmN0aW9uIHZhbHVlcyBvbiBib3RoIHNpZGVzIG9mIHRoZSBpbnRlcnZhbFwiKSk7XHJcblxyXG4gICAgICBsZXQgYmV0d2VlbjogUGFyYW1ldGVyID0gdGhpcy5kaXZpZGUoX2xlZnQsIF9yaWdodCk7XHJcbiAgICAgIGxldCBiZXR3ZWVuVmFsdWU6IGJvb2xlYW4gPSB0aGlzLmZ1bmN0aW9uKGJldHdlZW4pO1xyXG4gICAgICBpZiAoYmV0d2VlblZhbHVlID09IHRoaXMubGVmdFZhbHVlKVxyXG4gICAgICAgIHRoaXMuc29sdmUoYmV0d2VlbiwgdGhpcy5yaWdodCwgX2Vwc2lsb24sIGJldHdlZW5WYWx1ZSwgdGhpcy5yaWdodFZhbHVlKTtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoaXMuc29sdmUodGhpcy5sZWZ0LCBiZXR3ZWVuLCBfZXBzaWxvbiwgdGhpcy5sZWZ0VmFsdWUsIGJldHdlZW5WYWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgIGxldCBvdXQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgIG91dCArPSBgbGVmdDogJHt0aGlzLmxlZnQudG9TdHJpbmcoKX0gLT4gJHt0aGlzLmxlZnRWYWx1ZX1gO1xyXG4gICAgICBvdXQgKz0gXCJcXG5cIjtcclxuICAgICAgb3V0ICs9IGByaWdodDogJHt0aGlzLnJpZ2h0LnRvU3RyaW5nKCl9IC0+ICR7dGhpcy5yaWdodFZhbHVlfWA7XHJcbiAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDYW1lcmFPcmJpdCBleHRlbmRzIMaSLk5vZGUge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF4aXNSb3RhdGVYOiDGki5BeGlzID0gbmV3IMaSLkF4aXMoXCJSb3RhdGVYXCIsIDEsIMaSLkNPTlRST0xfVFlQRS5QUk9QT1JUSU9OQUwpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF4aXNSb3RhdGVZOiDGki5BeGlzID0gbmV3IMaSLkF4aXMoXCJSb3RhdGVZXCIsIDEsIMaSLkNPTlRST0xfVFlQRS5QUk9QT1JUSU9OQUwpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF4aXNEaXN0YW5jZTogxpIuQXhpcyA9IG5ldyDGki5BeGlzKFwiRGlzdGFuY2VcIiwgMSwgxpIuQ09OVFJPTF9UWVBFLlBST1BPUlRJT05BTCk7XHJcblxyXG4gICAgcHVibGljIG1pbkRpc3RhbmNlOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgbWF4RGlzdGFuY2U6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCB0cmFuc2xhdG9yOiDGki5Ob2RlO1xyXG4gICAgcHJvdGVjdGVkIHJvdGF0b3JYOiDGki5Ob2RlO1xyXG4gICAgcHJpdmF0ZSBtYXhSb3RYOiBudW1iZXI7XHJcblxyXG5cclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NtcENhbWVyYTogxpIuQ29tcG9uZW50Q2FtZXJhLCBfZGlzdGFuY2VTdGFydDogbnVtYmVyID0gMiwgX21heFJvdFg6IG51bWJlciA9IDc1LCBfbWluRGlzdGFuY2U6IG51bWJlciA9IDEsIF9tYXhEaXN0YW5jZTogbnVtYmVyID0gMTApIHtcclxuICAgICAgc3VwZXIoXCJDYW1lcmFPcmJpdFwiKTtcclxuXHJcbiAgICAgIHRoaXMubWF4Um90WCA9IE1hdGgubWluKF9tYXhSb3RYLCA4OSk7XHJcbiAgICAgIHRoaXMubWluRGlzdGFuY2UgPSBfbWluRGlzdGFuY2U7XHJcbiAgICAgIHRoaXMubWF4RGlzdGFuY2UgPSBfbWF4RGlzdGFuY2U7XHJcblxyXG4gICAgICBsZXQgY21wVHJhbnNmb3JtOiDGki5Db21wb25lbnRUcmFuc2Zvcm0gPSBuZXcgxpIuQ29tcG9uZW50VHJhbnNmb3JtKCk7XHJcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KGNtcFRyYW5zZm9ybSk7XHJcblxyXG4gICAgICB0aGlzLnJvdGF0b3JYID0gbmV3IMaSLk5vZGUoXCJDYW1lcmFSb3RhdGlvblhcIik7XHJcbiAgICAgIHRoaXMucm90YXRvclguYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRUcmFuc2Zvcm0oKSk7XHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5yb3RhdG9yWCk7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRvciA9IG5ldyDGki5Ob2RlKFwiQ2FtZXJhVHJhbnNsYXRlXCIpO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0b3IuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRUcmFuc2Zvcm0oKSk7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRvci5tdHhMb2NhbC5yb3RhdGVZKDE4MCk7XHJcbiAgICAgIHRoaXMucm90YXRvclguYWRkQ2hpbGQodGhpcy50cmFuc2xhdG9yKTtcclxuXHJcbiAgICAgIHRoaXMudHJhbnNsYXRvci5hZGRDb21wb25lbnQoX2NtcENhbWVyYSk7XHJcbiAgICAgIHRoaXMuZGlzdGFuY2UgPSBfZGlzdGFuY2VTdGFydDtcclxuXHJcbiAgICAgIHRoaXMuYXhpc1JvdGF0ZVguYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVF9DT05UUk9MLk9VVFBVVCwgdGhpcy5obmRBeGlzT3V0cHV0KTtcclxuICAgICAgdGhpcy5heGlzUm90YXRlWS5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5UX0NPTlRST0wuT1VUUFVULCB0aGlzLmhuZEF4aXNPdXRwdXQpO1xyXG4gICAgICB0aGlzLmF4aXNEaXN0YW5jZS5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5UX0NPTlRST0wuT1VUUFVULCB0aGlzLmhuZEF4aXNPdXRwdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgY21wQ2FtZXJhKCk6IMaSLkNvbXBvbmVudENhbWVyYSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3IuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudENhbWVyYSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBub2RlQ2FtZXJhKCk6IMaSLk5vZGUge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZGlzdGFuY2UoX2Rpc3RhbmNlOiBudW1iZXIpIHtcclxuICAgICAgbGV0IG5ld0Rpc3RhbmNlOiBudW1iZXIgPSBNYXRoLm1pbih0aGlzLm1heERpc3RhbmNlLCBNYXRoLm1heCh0aGlzLm1pbkRpc3RhbmNlLCBfZGlzdGFuY2UpKTtcclxuICAgICAgdGhpcy50cmFuc2xhdG9yLm10eExvY2FsLnRyYW5zbGF0aW9uID0gxpIuVmVjdG9yMy5aKG5ld0Rpc3RhbmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGRpc3RhbmNlKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3IubXR4TG9jYWwudHJhbnNsYXRpb24uejtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHJvdGF0aW9uWShfYW5nbGU6IG51bWJlcikge1xyXG4gICAgICB0aGlzLm10eExvY2FsLnJvdGF0aW9uID0gxpIuVmVjdG9yMy5ZKF9hbmdsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByb3RhdGlvblkoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMubXR4TG9jYWwucm90YXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHJvdGF0aW9uWChfYW5nbGU6IG51bWJlcikge1xyXG4gICAgICBfYW5nbGUgPSBNYXRoLm1pbihNYXRoLm1heCgtdGhpcy5tYXhSb3RYLCBfYW5nbGUpLCB0aGlzLm1heFJvdFgpO1xyXG4gICAgICB0aGlzLnJvdGF0b3JYLm10eExvY2FsLnJvdGF0aW9uID0gxpIuVmVjdG9yMy5YKF9hbmdsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCByb3RhdGlvblgoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMucm90YXRvclgubXR4TG9jYWwucm90YXRpb24ueDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcm90YXRlWShfZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICB0aGlzLm10eExvY2FsLnJvdGF0ZVkoX2RlbHRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcm90YXRlWChfZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICB0aGlzLnJvdGF0aW9uWCA9IHRoaXMucm90YXRvclgubXR4TG9jYWwucm90YXRpb24ueCArIF9kZWx0YTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzZXQgcG9zaXRpb24gb2YgY2FtZXJhIGNvbXBvbmVudCByZWxhdGl2ZSB0byB0aGUgY2VudGVyIG9mIG9yYml0XHJcbiAgICBwdWJsaWMgcG9zaXRpb25DYW1lcmEoX3Bvc1dvcmxkOiDGki5WZWN0b3IzKTogdm9pZCB7XHJcbiAgICAgIGxldCBkaWZmZXJlbmNlOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5ESUZGRVJFTkNFKF9wb3NXb3JsZCwgdGhpcy5tdHhXb3JsZC50cmFuc2xhdGlvbik7XHJcbiAgICAgIGxldCBnZW86IMaSLkdlbzMgPSBkaWZmZXJlbmNlLmdlbztcclxuICAgICAgdGhpcy5yb3RhdGlvblkgPSBnZW8ubG9uZ2l0dWRlO1xyXG4gICAgICB0aGlzLnJvdGF0aW9uWCA9IC1nZW8ubGF0aXR1ZGU7XHJcbiAgICAgIHRoaXMuZGlzdGFuY2UgPSBnZW8ubWFnbml0dWRlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgaG5kQXhpc091dHB1dDogRXZlbnRMaXN0ZW5lciA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBvdXRwdXQ6IG51bWJlciA9ICg8Q3VzdG9tRXZlbnQ+X2V2ZW50KS5kZXRhaWwub3V0cHV0O1xyXG4gICAgICBzd2l0Y2ggKCg8xpIuQXhpcz5fZXZlbnQudGFyZ2V0KS5uYW1lKSB7XHJcbiAgICAgICAgY2FzZSBcIlJvdGF0ZVhcIjpcclxuICAgICAgICAgIHRoaXMucm90YXRlWChvdXRwdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIlJvdGF0ZVlcIjpcclxuICAgICAgICAgIHRoaXMucm90YXRlWShvdXRwdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIkRpc3RhbmNlXCI6XHJcbiAgICAgICAgICB0aGlzLmRpc3RhbmNlICs9IG91dHB1dDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ2FtZXJhT3JiaXRNb3ZpbmdGb2N1cyBleHRlbmRzIENhbWVyYU9yYml0IHtcclxuICAgIHB1YmxpYyByZWFkb25seSBheGlzVHJhbnNsYXRlWDogxpIuQXhpcyA9IG5ldyDGki5BeGlzKFwiVHJhbnNsYXRlWFwiLCAxLCDGki5DT05UUk9MX1RZUEUuUFJPUE9SVElPTkFMKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBheGlzVHJhbnNsYXRlWTogxpIuQXhpcyA9IG5ldyDGki5BeGlzKFwiVHJhbnNsYXRlWVwiLCAxLCDGki5DT05UUk9MX1RZUEUuUFJPUE9SVElPTkFMKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBheGlzVHJhbnNsYXRlWjogxpIuQXhpcyA9IG5ldyDGki5BeGlzKFwiVHJhbnNsYXRlWlwiLCAxLCDGki5DT05UUk9MX1RZUEUuUFJPUE9SVElPTkFMKTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX2NtcENhbWVyYTogxpIuQ29tcG9uZW50Q2FtZXJhLCBfZGlzdGFuY2VTdGFydDogbnVtYmVyID0gNSwgX21heFJvdFg6IG51bWJlciA9IDg1LCBfbWluRGlzdGFuY2U6IG51bWJlciA9IDAsIF9tYXhEaXN0YW5jZTogbnVtYmVyID0gSW5maW5pdHkpIHtcclxuICAgICAgc3VwZXIoX2NtcENhbWVyYSwgX2Rpc3RhbmNlU3RhcnQsIF9tYXhSb3RYLCBfbWluRGlzdGFuY2UsIF9tYXhEaXN0YW5jZSk7XHJcbiAgICAgIHRoaXMubmFtZSA9IFwiQ2FtZXJhT3JiaXRNb3ZpbmdGb2N1c1wiO1xyXG5cclxuICAgICAgdGhpcy5heGlzVHJhbnNsYXRlWC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5UX0NPTlRST0wuT1VUUFVULCB0aGlzLmhuZEF4aXNPdXRwdXQpO1xyXG4gICAgICB0aGlzLmF4aXNUcmFuc2xhdGVZLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlRfQ09OVFJPTC5PVVRQVVQsIHRoaXMuaG5kQXhpc091dHB1dCk7XHJcbiAgICAgIHRoaXMuYXhpc1RyYW5zbGF0ZVouYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVF9DT05UUk9MLk9VVFBVVCwgdGhpcy5obmRBeGlzT3V0cHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlWChfZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICB0aGlzLm10eExvY2FsLnRyYW5zbGF0ZVgoX2RlbHRhKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHRyYW5zbGF0ZVkoX2RlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgbGV0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IzID0gdGhpcy5yb3RhdG9yWC5tdHhXb3JsZC5nZXRZKCk7XHJcbiAgICAgIHRyYW5zbGF0aW9uLm5vcm1hbGl6ZShfZGVsdGEpO1xyXG4gICAgICB0aGlzLm10eExvY2FsLnRyYW5zbGF0ZSh0cmFuc2xhdGlvbiwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2xhdGVaKF9kZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIC8vIHRoaXMubXR4TG9jYWwudHJhbnNsYXRlWihfZGVsdGEpO1xyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjMgPSB0aGlzLnJvdGF0b3JYLm10eFdvcmxkLmdldFooKTtcclxuICAgICAgdHJhbnNsYXRpb24ubm9ybWFsaXplKF9kZWx0YSk7XHJcbiAgICAgIHRoaXMubXR4TG9jYWwudHJhbnNsYXRlKHRyYW5zbGF0aW9uLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhuZEF4aXNPdXRwdXQ6IEV2ZW50TGlzdGVuZXIgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgb3V0cHV0OiBudW1iZXIgPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsLm91dHB1dDtcclxuICAgICAgc3dpdGNoICgoPMaSLkF4aXM+X2V2ZW50LnRhcmdldCkubmFtZSkge1xyXG4gICAgICAgIGNhc2UgXCJUcmFuc2xhdGVYXCI6XHJcbiAgICAgICAgICB0aGlzLnRyYW5zbGF0ZVgob3V0cHV0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJUcmFuc2xhdGVZXCI6XHJcbiAgICAgICAgICB0aGlzLnRyYW5zbGF0ZVkob3V0cHV0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJUcmFuc2xhdGVaXCI6XHJcbiAgICAgICAgICB0aGlzLnRyYW5zbGF0ZVoob3V0cHV0KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgZXhwb3J0IGVudW0gSU1BR0VfUkVOREVSSU5HIHtcclxuICAgIEFVVE8gPSBcImF1dG9cIixcclxuICAgIFNNT09USCA9IFwic21vb3RoXCIsXHJcbiAgICBISUdIX1FVQUxJVFkgPSBcImhpZ2gtcXVhbGl0eVwiLFxyXG4gICAgQ1JJU1BfRURHRVMgPSBcImNyaXNwLWVkZ2VzXCIsXHJcbiAgICBQSVhFTEFURUQgPSBcInBpeGVsYXRlZFwiXHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIEFkZHMgY29tZm9ydCBtZXRob2RzIHRvIGNyZWF0ZSBhIHJlbmRlciBjYW52YXNcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQ2FudmFzIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKF9maWxsUGFyZW50OiBib29sZWFuID0gdHJ1ZSwgX2ltYWdlUmVuZGVyaW5nOiBJTUFHRV9SRU5ERVJJTkcgPSBJTUFHRV9SRU5ERVJJTkcuQVVUTywgX3dpZHRoOiBudW1iZXIgPSA4MDAsIF9oZWlnaHQ6IG51bWJlciA9IDYwMCk6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgICAgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgY2FudmFzLmlkID0gXCJGVURHRVwiO1xyXG4gICAgICBsZXQgc3R5bGU6IENTU1N0eWxlRGVjbGFyYXRpb24gPSBjYW52YXMuc3R5bGU7XHJcbiAgICAgIHN0eWxlLmltYWdlUmVuZGVyaW5nID0gX2ltYWdlUmVuZGVyaW5nO1xyXG4gICAgICBzdHlsZS53aWR0aCA9IF93aWR0aCArIFwicHhcIjtcclxuICAgICAgc3R5bGUuaGVpZ2h0ID0gX2hlaWdodCArIFwicHhcIjtcclxuICAgICAgc3R5bGUubWFyZ2luQm90dG9tID0gXCItMC4yNWVtXCI7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoX2ZpbGxQYXJlbnQpIHtcclxuICAgICAgICBzdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIHN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjYW52YXM7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBOb2RlIGV4dGVuZHMgxpIuTm9kZSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb3VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfbmFtZTogc3RyaW5nID0gTm9kZS5nZXROZXh0TmFtZSgpLCBfdHJhbnNmb3JtPzogxpIuTWF0cml4NHg0LCBfbWF0ZXJpYWw/OiDGki5NYXRlcmlhbCwgX21lc2g/OiDGki5NZXNoKSB7XHJcbiAgICAgIHN1cGVyKF9uYW1lKTtcclxuICAgICAgaWYgKF90cmFuc2Zvcm0pXHJcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudFRyYW5zZm9ybShfdHJhbnNmb3JtKSk7XHJcbiAgICAgIGlmIChfbWF0ZXJpYWwpXHJcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1hdGVyaWFsKF9tYXRlcmlhbCkpO1xyXG4gICAgICBpZiAoX21lc2gpXHJcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudE1lc2goX21lc2gpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXROZXh0TmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICByZXR1cm4gXCLGkkFpZE5vZGVfXCIgKyBOb2RlLmNvdW50Kys7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBtdHhNZXNoUGl2b3QoKTogxpIuTWF0cml4NHg0IHtcclxuICAgICAgbGV0IGNtcE1lc2g6IMaSLkNvbXBvbmVudE1lc2ggPSB0aGlzLmdldENvbXBvbmVudCjGki5Db21wb25lbnRNZXNoKTtcclxuICAgICAgcmV0dXJuIGNtcE1lc2ggPyBjbXBNZXNoLm10eFBpdm90IDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXN5bmMgZGVzZXJpYWxpemUoX3NlcmlhbGl6YXRpb246IMaSLlNlcmlhbGl6YXRpb24pOiBQcm9taXNlPMaSLlNlcmlhbGl6YWJsZT4ge1xyXG4gICAgICAvLyBRdWljayBhbmQgbWF5YmUgaGFja3kgc29sdXRpb24uIENyZWF0ZWQgbm9kZSBpcyBjb21wbGV0ZWx5IGRpc21pc3NlZCBhbmQgYSByZWNyZWF0aW9uIG9mIHRoZSBiYXNlY2xhc3MgZ2V0cyByZXR1cm4uIE90aGVyd2lzZSwgY29tcG9uZW50cyB3aWxsIGJlIGRvdWJsZWQuLi5cclxuICAgICAgbGV0IG5vZGU6IMaSLk5vZGUgPSBuZXcgxpIuTm9kZShfc2VyaWFsaXphdGlvbi5uYW1lKTtcclxuICAgICAgYXdhaXQgbm9kZS5kZXNlcmlhbGl6ZShfc2VyaWFsaXphdGlvbik7XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKG5vZGUpO1xyXG4gICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcblxyXG4gIGV4cG9ydCBjbGFzcyBOb2RlQXJyb3cgZXh0ZW5kcyBOb2RlIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGludGVybmFsUmVzb3VyY2VzOiBNYXA8c3RyaW5nLCDGki5TZXJpYWxpemFibGVSZXNvdXJjZT4gPSBOb2RlQXJyb3cuY3JlYXRlSW50ZXJuYWxSZXNvdXJjZXMoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihfbmFtZTogc3RyaW5nLCBfY29sb3I6IMaSLkNvbG9yKSB7XHJcbiAgICAgIHN1cGVyKF9uYW1lLCDGki5NYXRyaXg0eDQuSURFTlRJVFkoKSk7XHJcblxyXG4gICAgICBsZXQgc2hhZnQ6IE5vZGUgPSBuZXcgTm9kZShfbmFtZSArIFwiU2hhZnRcIiwgxpIuTWF0cml4NHg0LklERU5USVRZKCksIDzGki5NYXRlcmlhbD5Ob2RlQXJyb3cuaW50ZXJuYWxSZXNvdXJjZXMuZ2V0KFwiTWF0ZXJpYWxcIiksIDzGki5NZXNoPk5vZGVBcnJvdy5pbnRlcm5hbFJlc291cmNlcy5nZXQoXCJTaGFmdFwiKSk7XHJcbiAgICAgIGxldCBoZWFkOiBOb2RlID0gbmV3IE5vZGUoX25hbWUgKyBcIkhlYWRcIiwgxpIuTWF0cml4NHg0LklERU5USVRZKCksIDzGki5NYXRlcmlhbD5Ob2RlQXJyb3cuaW50ZXJuYWxSZXNvdXJjZXMuZ2V0KFwiTWF0ZXJpYWxcIiksIDzGki5NZXNoPk5vZGVBcnJvdy5pbnRlcm5hbFJlc291cmNlcy5nZXQoXCJIZWFkXCIpKTtcclxuICAgICAgc2hhZnQubXR4TG9jYWwuc2NhbGUobmV3IMaSLlZlY3RvcjMoMC4wMSwgMC4wMSwgMSkpO1xyXG4gICAgICBoZWFkLm10eExvY2FsLnRyYW5zbGF0ZVooMC41KTtcclxuICAgICAgaGVhZC5tdHhMb2NhbC5zY2FsZShuZXcgxpIuVmVjdG9yMygwLjA1LCAwLjA1LCAwLjEpKTtcclxuICAgICAgaGVhZC5tdHhMb2NhbC5yb3RhdGVYKDkwKTtcclxuXHJcbiAgICAgIHNoYWZ0LmdldENvbXBvbmVudCjGki5Db21wb25lbnRNYXRlcmlhbCkuY2xyUHJpbWFyeSA9IF9jb2xvcjtcclxuICAgICAgaGVhZC5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50TWF0ZXJpYWwpLmNsclByaW1hcnkgPSBfY29sb3I7XHJcblxyXG4gICAgICB0aGlzLmFkZENoaWxkKHNoYWZ0KTtcclxuICAgICAgdGhpcy5hZGRDaGlsZChoZWFkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVJbnRlcm5hbFJlc291cmNlcygpOiBNYXA8c3RyaW5nLCDGki5TZXJpYWxpemFibGVSZXNvdXJjZT4ge1xyXG4gICAgICBsZXQgbWFwOiBNYXA8c3RyaW5nLCDGki5TZXJpYWxpemFibGVSZXNvdXJjZT4gPSBuZXcgTWFwKCk7XHJcbiAgICAgIG1hcC5zZXQoXCJTaGFmdFwiLCBuZXcgxpIuTWVzaEN1YmUoXCJBcnJvd1NoYWZ0XCIpKTtcclxuICAgICAgbWFwLnNldChcIkhlYWRcIiwgbmV3IMaSLk1lc2hQeXJhbWlkKFwiQXJyb3dIZWFkXCIpKTtcclxuICAgICAgbGV0IGNvYXQ6IMaSLkNvYXRDb2xvcmVkID0gbmV3IMaSLkNvYXRDb2xvcmVkKMaSLkNvbG9yLkNTUyhcIndoaXRlXCIpKTtcclxuICAgICAgbWFwLnNldChcIk1hdGVyaWFsXCIsIG5ldyDGki5NYXRlcmlhbChcIkFycm93XCIsIMaSLlNoYWRlckxpdCwgY29hdCkpO1xyXG5cclxuICAgICAgbWFwLmZvckVhY2goKF9yZXNvdXJjZSkgPT4gxpIuUHJvamVjdC5kZXJlZ2lzdGVyKF9yZXNvdXJjZSkpO1xyXG4gICAgICByZXR1cm4gbWFwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY29sb3IoX2NvbG9yOiDGki5Db2xvcikge1xyXG4gICAgICBmb3IgKGxldCBjaGlsZCBvZiB0aGlzLmdldENoaWxkcmVuKCkpIHtcclxuICAgICAgICBjaGlsZC5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50TWF0ZXJpYWwpLmNsclByaW1hcnkuY29weShfY29sb3IpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBOb2RlQ29vcmRpbmF0ZVN5c3RlbSBleHRlbmRzIE5vZGUge1xyXG4gICAgY29uc3RydWN0b3IoX25hbWU6IHN0cmluZyA9IFwiQ29vcmRpbmF0ZVN5c3RlbVwiLCBfdHJhbnNmb3JtPzogxpIuTWF0cml4NHg0KSB7XHJcbiAgICAgIHN1cGVyKF9uYW1lLCBfdHJhbnNmb3JtKTtcclxuICAgICAgbGV0IGFycm93UmVkOiDGki5Ob2RlID0gbmV3IE5vZGVBcnJvdyhcIkFycm93UmVkXCIsIG5ldyDGki5Db2xvcigxLCAwLCAwLCAxKSk7XHJcbiAgICAgIGxldCBhcnJvd0dyZWVuOiDGki5Ob2RlID0gbmV3IE5vZGVBcnJvdyhcIkFycm93R3JlZW5cIiwgbmV3IMaSLkNvbG9yKDAsIDEsIDAsIDEpKTtcclxuICAgICAgbGV0IGFycm93Qmx1ZTogxpIuTm9kZSA9IG5ldyBOb2RlQXJyb3coXCJBcnJvd0JsdWVcIiwgbmV3IMaSLkNvbG9yKDAsIDAsIDEsIDEpKTtcclxuXHJcbiAgICAgIGFycm93UmVkLm10eExvY2FsLnJvdGF0ZVkoOTApO1xyXG4gICAgICBhcnJvd0dyZWVuLm10eExvY2FsLnJvdGF0ZVgoLTkwKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQoYXJyb3dSZWQpO1xyXG4gICAgICB0aGlzLmFkZENoaWxkKGFycm93R3JlZW4pO1xyXG4gICAgICB0aGlzLmFkZENoaWxkKGFycm93Qmx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEFkZHMgYSBsaWdodCBzZXR1cCB0byB0aGUgbm9kZSBnaXZlbiwgY29uc2lzdGluZyBvZiBhbiBhbWJpZW50IGxpZ2h0LCBhIGRpcmVjdGlvbmFsIGtleSBsaWdodCBhbmQgYSBkaXJlY3Rpb25hbCBiYWNrIGxpZ2h0LlxyXG4gICAqIEV4ZXB0IG9mIHRoZSBub2RlIHRvIGJlY29tZSB0aGUgY29udGFpbmVyLCBhbGwgcGFyYW1ldGVycyBhcmUgb3B0aW9uYWwgYW5kIHByb3ZpZGVkIGRlZmF1bHQgdmFsdWVzIGZvciBnZW5lcmFsIHB1cnBvc2UuIFxyXG4gICAqL1xyXG4gIGV4cG9ydCBmdW5jdGlvbiBhZGRTdGFuZGFyZExpZ2h0Q29tcG9uZW50cyhcclxuICAgIF9ub2RlOiDGki5Ob2RlLFxyXG4gICAgX2NsckFtYmllbnQ6IMaSLkNvbG9yID0gbmV3IMaSLkNvbG9yKDAuMiwgMC4yLCAwLjIpLCBfY2xyS2V5OiDGki5Db2xvciA9IG5ldyDGki5Db2xvcigwLjksIDAuOSwgMC45KSwgX2NsckJhY2s6IMaSLkNvbG9yID0gbmV3IMaSLkNvbG9yKDAuNiwgMC42LCAwLjYpLFxyXG4gICAgX3Bvc0tleTogxpIuVmVjdG9yMyA9IG5ldyDGki5WZWN0b3IzKDQsIDEyLCA4KSwgX3Bvc0JhY2s6IMaSLlZlY3RvcjMgPSBuZXcgxpIuVmVjdG9yMygtMSwgLTAuNSwgLTMpXHJcbiAgKTogdm9pZCB7XHJcbiAgICBsZXQga2V5OiDGki5Db21wb25lbnRMaWdodCA9IG5ldyDGki5Db21wb25lbnRMaWdodChuZXcgxpIuTGlnaHREaXJlY3Rpb25hbChfY2xyS2V5KSk7XHJcbiAgICBrZXkubXR4UGl2b3QudHJhbnNsYXRlKF9wb3NLZXkpO1xyXG4gICAga2V5Lm10eFBpdm90Lmxvb2tBdCjGki5WZWN0b3IzLlpFUk8oKSk7XHJcblxyXG4gICAgbGV0IGJhY2s6IMaSLkNvbXBvbmVudExpZ2h0ID0gbmV3IMaSLkNvbXBvbmVudExpZ2h0KG5ldyDGki5MaWdodERpcmVjdGlvbmFsKF9jbHJCYWNrKSk7XHJcbiAgICBiYWNrLm10eFBpdm90LnRyYW5zbGF0ZShfcG9zQmFjayk7XHJcbiAgICBiYWNrLm10eFBpdm90Lmxvb2tBdCjGki5WZWN0b3IzLlpFUk8oKSk7XHJcblxyXG4gICAgbGV0IGFtYmllbnQ6IMaSLkNvbXBvbmVudExpZ2h0ID0gbmV3IMaSLkNvbXBvbmVudExpZ2h0KG5ldyDGki5MaWdodEFtYmllbnQoX2NsckFtYmllbnQpKTtcclxuXHJcbiAgICBfbm9kZS5hZGRDb21wb25lbnQoa2V5KTtcclxuICAgIF9ub2RlLmFkZENvbXBvbmVudChiYWNrKTtcclxuICAgIF9ub2RlLmFkZENvbXBvbmVudChhbWJpZW50KTtcclxuICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyB0aGUgYW5pbWF0aW9uIGN5Y2xlIG9mIGEgc3ByaXRlIG9uIGEgW1tOb2RlXV1cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgTm9kZVNwcml0ZSBleHRlbmRzIMaSLk5vZGUge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWVzaDogxpIuTWVzaFNwcml0ZSA9IE5vZGVTcHJpdGUuY3JlYXRlSW50ZXJuYWxSZXNvdXJjZSgpO1xyXG4gICAgcHVibGljIGZyYW1lcmF0ZTogbnVtYmVyID0gMTI7IC8vIGFuaW1hdGlvbiBmcmFtZXMgcGVyIHNlY29uZCwgc2luZ2xlIGZyYW1lcyBjYW4gYmUgc2hvcnRlciBvciBsb25nZXIgYmFzZWQgb24gdGhlaXIgdGltZXNjYWxlXHJcblxyXG4gICAgcHJpdmF0ZSBjbXBNZXNoOiDGki5Db21wb25lbnRNZXNoO1xyXG4gICAgcHJpdmF0ZSBjbXBNYXRlcmlhbDogxpIuQ29tcG9uZW50TWF0ZXJpYWw7XHJcbiAgICBwcml2YXRlIGFuaW1hdGlvbjogU3ByaXRlU2hlZXRBbmltYXRpb247XHJcbiAgICBwcml2YXRlIGZyYW1lQ3VycmVudDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgZGlyZWN0aW9uOiBudW1iZXIgPSAxO1xyXG4gICAgcHJpdmF0ZSB0aW1lcjogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgIHN1cGVyKF9uYW1lKTtcclxuXHJcbiAgICAgIHRoaXMuY21wTWVzaCA9IG5ldyDGki5Db21wb25lbnRNZXNoKE5vZGVTcHJpdGUubWVzaCk7XHJcbiAgICAgIC8vIERlZmluZSBjb2F0IGZyb20gdGhlIFNwcml0ZVNoZWV0IHRvIHVzZSB3aGVuIHJlbmRlcmluZ1xyXG4gICAgICB0aGlzLmNtcE1hdGVyaWFsID0gbmV3IMaSLkNvbXBvbmVudE1hdGVyaWFsKG5ldyDGki5NYXRlcmlhbChfbmFtZSwgxpIuU2hhZGVyTGl0VGV4dHVyZWQsIG51bGwpKTtcclxuICAgICAgdGhpcy5hZGRDb21wb25lbnQodGhpcy5jbXBNZXNoKTtcclxuICAgICAgdGhpcy5hZGRDb21wb25lbnQodGhpcy5jbXBNYXRlcmlhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlSW50ZXJuYWxSZXNvdXJjZSgpOiDGki5NZXNoU3ByaXRlIHtcclxuICAgICAgbGV0IG1lc2g6IMaSLk1lc2hTcHJpdGUgPSBuZXcgxpIuTWVzaFNwcml0ZShcIlNwcml0ZVwiKTtcclxuICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKG1lc2gpO1xyXG4gICAgICByZXR1cm4gbWVzaDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHRoZSBudW1iZXIgb2YgdGhlIGN1cnJlbnQgZnJhbWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBnZXRDdXJyZW50RnJhbWUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuZnJhbWVDdXJyZW50OyB9IC8vVG9Ebzogc2VlIGlmIGdldGZyYW1lQ3VycmVudCBpcyBwcm9ibGVtYXRpY1xyXG5cclxuICAgIHB1YmxpYyBzZXRBbmltYXRpb24oX2FuaW1hdGlvbjogU3ByaXRlU2hlZXRBbmltYXRpb24pOiB2b2lkIHtcclxuICAgICAgdGhpcy5hbmltYXRpb24gPSBfYW5pbWF0aW9uO1xyXG4gICAgICB0aGlzLnN0b3BBbmltYXRpb24oKTtcclxuICAgICAgdGhpcy5zaG93RnJhbWUoMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0b3BBbmltYXRpb24oKTogdm9pZCB7XHJcbiAgICAgIGlmICh0aGlzLnRpbWVyKVxyXG4gICAgICAgIMaSLlRpbWUuZ2FtZS5kZWxldGVUaW1lcih0aGlzLnRpbWVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgYSBzcGVjaWZpYyBmcmFtZSBvZiB0aGUgc2VxdWVuY2VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dGcmFtZShfaW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICB0aGlzLnN0b3BBbmltYXRpb24oKTtcclxuICAgICAgbGV0IHNwcml0ZUZyYW1lOiBTcHJpdGVGcmFtZSA9IHRoaXMuYW5pbWF0aW9uLmZyYW1lc1tfaW5kZXhdO1xyXG4gICAgICB0aGlzLmNtcE1lc2gubXR4UGl2b3QgPSBzcHJpdGVGcmFtZS5tdHhQaXZvdDtcclxuICAgICAgdGhpcy5jbXBNYXRlcmlhbC5tdHhQaXZvdCA9IHNwcml0ZUZyYW1lLm10eFRleHR1cmU7XHJcbiAgICAgIHRoaXMuY21wTWF0ZXJpYWwubWF0ZXJpYWwuY29hdCA9IHRoaXMuYW5pbWF0aW9uLnNwcml0ZXNoZWV0O1xyXG4gICAgICB0aGlzLmZyYW1lQ3VycmVudCA9IF9pbmRleDtcclxuICAgICAgdGhpcy50aW1lciA9IMaSLlRpbWUuZ2FtZS5zZXRUaW1lcihzcHJpdGVGcmFtZS50aW1lU2NhbGUgKiAxMDAwIC8gdGhpcy5mcmFtZXJhdGUsIDEsIHRoaXMuc2hvd0ZyYW1lTmV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG93IHRoZSBuZXh0IGZyYW1lIG9mIHRoZSBzZXF1ZW5jZSBvciBzdGFydCBhbmV3IHdoZW4gdGhlIGVuZCBvciB0aGUgc3RhcnQgd2FzIHJlYWNoZWQsIGFjY29yZGluZyB0byB0aGUgZGlyZWN0aW9uIG9mIHBsYXlpbmdcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dGcmFtZU5leHQgPSAoX2V2ZW50OiDGki5FdmVudFRpbWVyKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuZnJhbWVDdXJyZW50ID0gKHRoaXMuZnJhbWVDdXJyZW50ICsgdGhpcy5kaXJlY3Rpb24gKyB0aGlzLmFuaW1hdGlvbi5mcmFtZXMubGVuZ3RoKSAlIHRoaXMuYW5pbWF0aW9uLmZyYW1lcy5sZW5ndGg7XHJcbiAgICAgIHRoaXMuc2hvd0ZyYW1lKHRoaXMuZnJhbWVDdXJyZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBkaXJlY3Rpb24gZm9yIGFuaW1hdGlvbiBwbGF5YmFjaywgbmVnYXRpdiBudW1iZXJzIG1ha2UgaXQgcGxheSBiYWNrd2FyZHMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRGcmFtZURpcmVjdGlvbihfZGlyZWN0aW9uOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5kaXJlY3Rpb24gPSBNYXRoLmZsb29yKF9kaXJlY3Rpb24pO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBEZXNjcmliZXMgYSBzaW5nbGUgZnJhbWUgb2YgYSBzcHJpdGUgYW5pbWF0aW9uXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFNwcml0ZUZyYW1lIHtcclxuICAgIHB1YmxpYyByZWN0VGV4dHVyZTogxpIuUmVjdGFuZ2xlO1xyXG4gICAgcHVibGljIG10eFBpdm90OiDGki5NYXRyaXg0eDQ7XHJcbiAgICBwdWJsaWMgbXR4VGV4dHVyZTogxpIuTWF0cml4M3gzO1xyXG4gICAgcHVibGljIHRpbWVTY2FsZTogbnVtYmVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29udmVuaWVuY2UgZm9yIGNyZWF0aW5nIGEgW1tDb2F0VGV4dHVyZV1dIHRvIHVzZSBhcyBzcHJpdGVzaGVldFxyXG4gICAqL1xyXG4gIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTcHJpdGVTaGVldChfbmFtZTogc3RyaW5nLCBfaW1hZ2U6IEhUTUxJbWFnZUVsZW1lbnQpOiDGki5Db2F0VGV4dHVyZWQge1xyXG4gICAgbGV0IGNvYXQ6IMaSLkNvYXRUZXh0dXJlZCA9IG5ldyDGki5Db2F0VGV4dHVyZWQoKTtcclxuICAgIGxldCB0ZXh0dXJlOiDGki5UZXh0dXJlSW1hZ2UgPSBuZXcgxpIuVGV4dHVyZUltYWdlKCk7XHJcbiAgICB0ZXh0dXJlLmltYWdlID0gX2ltYWdlO1xyXG4gICAgY29hdC50ZXh0dXJlID0gdGV4dHVyZTtcclxuICAgIHJldHVybiBjb2F0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSG9sZHMgU3ByaXRlU2hlZXRBbmltYXRpb25zIGluIGFuIGFzc29jaWF0aXZlIGhpZXJhcmNoaWNhbCBhcnJheVxyXG4gICAqL1xyXG4gIGV4cG9ydCBpbnRlcmZhY2UgU3ByaXRlU2hlZXRBbmltYXRpb25zIHtcclxuICAgIFtrZXk6IHN0cmluZ106IFNwcml0ZVNoZWV0QW5pbWF0aW9uIHwgU3ByaXRlU2hlZXRBbmltYXRpb25zO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlcyBhIHNlcmllcyBvZiBbW1Nwcml0ZUZyYW1lXV1zIHRvIGJlIG1hcHBlZCBvbnRvIGEgW1tNZXNoU3ByaXRlXV1cclxuICAgKiBDb250YWlucyB0aGUgW1tNZXNoU3ByaXRlXV0sIHRoZSBbW01hdGVyaWFsXV0gYW5kIHRoZSBzcHJpdGVzaGVldC10ZXh0dXJlXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFNwcml0ZVNoZWV0QW5pbWF0aW9uIHtcclxuICAgIHB1YmxpYyBmcmFtZXM6IFNwcml0ZUZyYW1lW10gPSBbXTtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc3ByaXRlc2hlZXQ6IMaSLkNvYXRUZXh0dXJlZDtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX25hbWU6IHN0cmluZywgX3Nwcml0ZXNoZWV0OiDGki5Db2F0VGV4dHVyZWQpIHtcclxuICAgICAgdGhpcy5uYW1lID0gX25hbWU7XHJcbiAgICAgIHRoaXMuc3ByaXRlc2hlZXQgPSBfc3ByaXRlc2hlZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9yZXMgYSBzZXJpZXMgb2YgZnJhbWVzIGluIHRoaXMgW1tTcHJpdGVdXSwgY2FsY3VsYXRpbmcgdGhlIG1hdHJpY2VzIHRvIHVzZSBpbiB0aGUgY29tcG9uZW50cyBvZiBhIFtbTm9kZVNwcml0ZV1dXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZW5lcmF0ZShfcmVjdHM6IMaSLlJlY3RhbmdsZVtdLCBfcmVzb2x1dGlvblF1YWQ6IG51bWJlciwgX29yaWdpbjogxpIuT1JJR0lOMkQpOiB2b2lkIHtcclxuICAgICAgbGV0IGltZzogVGV4SW1hZ2VTb3VyY2UgPSB0aGlzLnNwcml0ZXNoZWV0LnRleHR1cmUudGV4SW1hZ2VTb3VyY2U7XHJcbiAgICAgIHRoaXMuZnJhbWVzID0gW107XHJcbiAgICAgIGxldCBmcmFtaW5nOiDGki5GcmFtaW5nU2NhbGVkID0gbmV3IMaSLkZyYW1pbmdTY2FsZWQoKTtcclxuICAgICAgZnJhbWluZy5zZXRTY2FsZSgxIC8gaW1nLndpZHRoLCAxIC8gaW1nLmhlaWdodCk7XHJcblxyXG4gICAgICBsZXQgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICAgIGZvciAobGV0IHJlY3Qgb2YgX3JlY3RzKSB7XHJcbiAgICAgICAgbGV0IGZyYW1lOiBTcHJpdGVGcmFtZSA9IHRoaXMuY3JlYXRlRnJhbWUodGhpcy5uYW1lICsgYCR7Y291bnR9YCwgZnJhbWluZywgcmVjdCwgX3Jlc29sdXRpb25RdWFkLCBfb3JpZ2luKTtcclxuICAgICAgICBmcmFtZS50aW1lU2NhbGUgPSAxO1xyXG4gICAgICAgIHRoaXMuZnJhbWVzLnB1c2goZnJhbWUpO1xyXG5cclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgc3ByaXRlIGZyYW1lcyB1c2luZyBhIGdyaWQgb24gdGhlIHNwcml0ZXNoZWV0IGRlZmluZWQgYnkgYSByZWN0YW5nbGUgdG8gc3RhcnQgd2l0aCwgdGhlIG51bWJlciBvZiBmcmFtZXMsIFxyXG4gICAgICogdGhlIHJlc29sdXRpb24gd2hpY2ggZGV0ZXJtaW5lcyB0aGUgc2l6ZSBvZiB0aGUgc3ByaXRlcyBtZXNoIGJhc2VkIG9uIHRoZSBudW1iZXIgb2YgcGl4ZWxzIG9mIHRoZSB0ZXh0dXJlIGZyYW1lLFxyXG4gICAgICogdGhlIG9mZnNldCBmcm9tIG9uZSBjZWxsIG9mIHRoZSBncmlkIHRvIHRoZSBuZXh0IGluIHRoZSBzZXF1ZW5jZSBhbmQsIGluIGNhc2UgdGhlIHNlcXVlbmNlIHNwYW5zIG92ZXIgbW9yZSB0aGFuIG9uZSByb3cgb3IgY29sdW1uLFxyXG4gICAgICogdGhlIG9mZnNldCB0byBtb3ZlIHRoZSBzdGFydCByZWN0YW5nbGUgd2hlbiB0aGUgbWFyZ2luIG9mIHRoZSB0ZXh0dXJlIGlzIHJlYWNoZWQgYW5kIHdyYXBwaW5nIG9jY3Vycy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdlbmVyYXRlQnlHcmlkKF9zdGFydFJlY3Q6IMaSLlJlY3RhbmdsZSwgX2ZyYW1lczogbnVtYmVyLCBfcmVzb2x1dGlvblF1YWQ6IG51bWJlciwgX29yaWdpbjogxpIuT1JJR0lOMkQsIF9vZmZzZXROZXh0OiDGki5WZWN0b3IyLCBfb2Zmc2V0V3JhcDogxpIuVmVjdG9yMiA9IMaSLlZlY3RvcjIuWkVSTygpKTogdm9pZCB7XHJcbiAgICAgIGxldCBpbWc6IFRleEltYWdlU291cmNlID0gdGhpcy5zcHJpdGVzaGVldC50ZXh0dXJlLnRleEltYWdlU291cmNlO1xyXG4gICAgICBsZXQgcmVjdEltYWdlOiDGki5SZWN0YW5nbGUgPSBuZXcgxpIuUmVjdGFuZ2xlKDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICAgIGxldCByZWN0OiDGki5SZWN0YW5nbGUgPSBfc3RhcnRSZWN0LmNsb25lO1xyXG4gICAgICBsZXQgcmVjdHM6IMaSLlJlY3RhbmdsZVtdID0gW107XHJcbiAgICAgIHdoaWxlIChfZnJhbWVzLS0pIHtcclxuICAgICAgICByZWN0cy5wdXNoKHJlY3QuY2xvbmUpO1xyXG4gICAgICAgIHJlY3QucG9zaXRpb24uYWRkKF9vZmZzZXROZXh0KTtcclxuXHJcbiAgICAgICAgaWYgKHJlY3RJbWFnZS5jb3ZlcnMocmVjdCkpXHJcbiAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgX3N0YXJ0UmVjdC5wb3NpdGlvbi5hZGQoX29mZnNldFdyYXApO1xyXG4gICAgICAgIHJlY3QgPSBfc3RhcnRSZWN0LmNsb25lO1xyXG4gICAgICAgIGlmICghcmVjdEltYWdlLmNvdmVycyhyZWN0KSlcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZWN0cy5mb3JFYWNoKChfcmVjdDogxpIuUmVjdGFuZ2xlKSA9PiDGki5EZWJ1Zy5sb2coX3JlY3QudG9TdHJpbmcoKSkpO1xyXG4gICAgICB0aGlzLmdlbmVyYXRlKHJlY3RzLCBfcmVzb2x1dGlvblF1YWQsIF9vcmlnaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlRnJhbWUoX25hbWU6IHN0cmluZywgX2ZyYW1pbmc6IMaSLkZyYW1pbmdTY2FsZWQsIF9yZWN0OiDGki5SZWN0YW5nbGUsIF9yZXNvbHV0aW9uUXVhZDogbnVtYmVyLCBfb3JpZ2luOiDGki5PUklHSU4yRCk6IFNwcml0ZUZyYW1lIHtcclxuICAgICAgbGV0IGltZzogVGV4SW1hZ2VTb3VyY2UgPSB0aGlzLnNwcml0ZXNoZWV0LnRleHR1cmUudGV4SW1hZ2VTb3VyY2U7XHJcbiAgICAgIGxldCByZWN0VGV4dHVyZTogxpIuUmVjdGFuZ2xlID0gbmV3IMaSLlJlY3RhbmdsZSgwLCAwLCBpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xyXG4gICAgICBsZXQgZnJhbWU6IFNwcml0ZUZyYW1lID0gbmV3IFNwcml0ZUZyYW1lKCk7XHJcblxyXG4gICAgICBmcmFtZS5yZWN0VGV4dHVyZSA9IF9mcmFtaW5nLmdldFJlY3QoX3JlY3QpO1xyXG4gICAgICBmcmFtZS5yZWN0VGV4dHVyZS5wb3NpdGlvbiA9IF9mcmFtaW5nLmdldFBvaW50KF9yZWN0LnBvc2l0aW9uLCByZWN0VGV4dHVyZSk7XHJcblxyXG4gICAgICBsZXQgcmVjdFF1YWQ6IMaSLlJlY3RhbmdsZSA9IG5ldyDGki5SZWN0YW5nbGUoMCwgMCwgX3JlY3Qud2lkdGggLyBfcmVzb2x1dGlvblF1YWQsIF9yZWN0LmhlaWdodCAvIF9yZXNvbHV0aW9uUXVhZCwgX29yaWdpbik7XHJcbiAgICAgIGZyYW1lLm10eFBpdm90ID0gxpIuTWF0cml4NHg0LklERU5USVRZKCk7XHJcbiAgICAgIGZyYW1lLm10eFBpdm90LnRyYW5zbGF0ZShuZXcgxpIuVmVjdG9yMyhyZWN0UXVhZC5wb3NpdGlvbi54ICsgcmVjdFF1YWQuc2l6ZS54IC8gMiwgLXJlY3RRdWFkLnBvc2l0aW9uLnkgLSByZWN0UXVhZC5zaXplLnkgLyAyLCAwKSk7XHJcbiAgICAgIGZyYW1lLm10eFBpdm90LnNjYWxlWChyZWN0UXVhZC5zaXplLngpO1xyXG4gICAgICBmcmFtZS5tdHhQaXZvdC5zY2FsZVkocmVjdFF1YWQuc2l6ZS55KTtcclxuICAgICAgLy8gxpIuRGVidWcubG9nKHJlY3RRdWFkLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgZnJhbWUubXR4VGV4dHVyZSA9IMaSLk1hdHJpeDN4My5JREVOVElUWSgpO1xyXG4gICAgICBmcmFtZS5tdHhUZXh0dXJlLnRyYW5zbGF0ZShmcmFtZS5yZWN0VGV4dHVyZS5wb3NpdGlvbik7XHJcbiAgICAgIGZyYW1lLm10eFRleHR1cmUuc2NhbGUoZnJhbWUucmVjdFRleHR1cmUuc2l6ZSk7XHJcblxyXG4gICAgICByZXR1cm4gZnJhbWU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcbiAgXHJcbiAgZXhwb3J0IGNsYXNzIENvbXBvbmVudFN0YXRlTWFjaGluZTxTdGF0ZT4gZXh0ZW5kcyDGki5Db21wb25lbnRTY3JpcHQgaW1wbGVtZW50cyBTdGF0ZU1hY2hpbmU8U3RhdGU+IHtcclxuICAgIHB1YmxpYyBzdGF0ZUN1cnJlbnQ6IFN0YXRlO1xyXG4gICAgcHVibGljIHN0YXRlTmV4dDogU3RhdGU7XHJcbiAgICBwdWJsaWMgaW5zdHJ1Y3Rpb25zOiBTdGF0ZU1hY2hpbmVJbnN0cnVjdGlvbnM8U3RhdGU+O1xyXG5cclxuICAgIHB1YmxpYyB0cmFuc2l0KF9uZXh0OiBTdGF0ZSk6IHZvaWQge1xyXG4gICAgICB0aGlzLmluc3RydWN0aW9ucy50cmFuc2l0KHRoaXMuc3RhdGVDdXJyZW50LCBfbmV4dCwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbnN0cnVjdGlvbnMuYWN0KHRoaXMuc3RhdGVDdXJyZW50LCB0aGlzKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCIvKipcclxuICogU3RhdGUgbWFjaGluZSBvZmZlcnMgYSBzdHJ1Y3R1cmUgYW5kIGZ1bmRhbWVudGFsIGZ1bmN0aW9uYWxpdHkgZm9yIHN0YXRlIG1hY2hpbmVzXHJcbiAqIDxTdGF0ZT4gc2hvdWxkIGJlIGFuIGVudW0gZGVmaW5pbmcgdGhlIHZhcmlvdXMgc3RhdGVzIG9mIHRoZSBtYWNoaW5lXHJcbiAqL1xyXG5cclxubmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICAvKiogRm9ybWF0IG9mIG1ldGhvZHMgdG8gYmUgdXNlZCBhcyB0cmFuc2l0aW9ucyBvciBhY3Rpb25zICovXHJcbiAgdHlwZSBTdGF0ZU1hY2hpbmVNZXRob2Q8U3RhdGU+ID0gKF9tYWNoaW5lOiBTdGF0ZU1hY2hpbmU8U3RhdGU+KSA9PiB2b2lkO1xyXG4gIC8qKiBUeXBlIGZvciBtYXBzIGFzc29jaWF0aW5nIGEgc3RhdGUgdG8gYSBtZXRob2QgKi9cclxuICB0eXBlIFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2Q8U3RhdGU+ID0gTWFwPFN0YXRlLCBTdGF0ZU1hY2hpbmVNZXRob2Q8U3RhdGU+PjtcclxuICAvKiogSW50ZXJmYWNlIG1hcHBpbmcgYSBzdGF0ZSB0byBvbmUgYWN0aW9uIG11bHRpcGxlIHRyYW5zaXRpb25zICovXHJcbiAgaW50ZXJmYWNlIFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPiB7XHJcbiAgICBhY3Rpb246IFN0YXRlTWFjaGluZU1ldGhvZDxTdGF0ZT47XHJcbiAgICB0cmFuc2l0aW9uczogU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZDxTdGF0ZT47XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb3JlIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIHN0YXRlIG1hY2hpbmUsIGhvbGRpbmcgc29sZWx5IHRoZSBjdXJyZW50IHN0YXRlIGFuZCwgd2hpbGUgaW4gdHJhbnNpdGlvbiwgdGhlIG5leHQgc3RhdGUsXHJcbiAgICogdGhlIGluc3RydWN0aW9ucyBmb3IgdGhlIG1hY2hpbmUgYW5kIGNvbWZvcnQgbWV0aG9kcyB0byB0cmFuc2l0IGFuZCBhY3QuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFN0YXRlTWFjaGluZTxTdGF0ZT4ge1xyXG4gICAgcHVibGljIHN0YXRlQ3VycmVudDogU3RhdGU7XHJcbiAgICBwdWJsaWMgc3RhdGVOZXh0OiBTdGF0ZTtcclxuICAgIHB1YmxpYyBpbnN0cnVjdGlvbnM6IFN0YXRlTWFjaGluZUluc3RydWN0aW9uczxTdGF0ZT47XHJcblxyXG4gICAgcHVibGljIHRyYW5zaXQoX25leHQ6IFN0YXRlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLnRyYW5zaXQodGhpcy5zdGF0ZUN1cnJlbnQsIF9uZXh0LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWN0KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmluc3RydWN0aW9ucy5hY3QodGhpcy5zdGF0ZUN1cnJlbnQsIHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0IG9mIGluc3RydWN0aW9ucyBmb3IgYSBzdGF0ZSBtYWNoaW5lLiBUaGUgc2V0IGtlZXBzIGFsbCBtZXRob2RzIGZvciBkZWRpY2F0ZWQgYWN0aW9ucyBkZWZpbmVkIGZvciB0aGUgc3RhdGVzXHJcbiAgICogYW5kIGFsbCBkZWRpY2F0ZWQgbWV0aG9kcyBkZWZpbmVkIGZvciB0cmFuc2l0aW9ucyB0byBvdGhlciBzdGF0ZXMsIGFzIHdlbGwgYXMgZGVmYXVsdCBtZXRob2RzLlxyXG4gICAqIEluc3RydWN0aW9ucyBleGlzdCBpbmRlcGVuZGVudGx5IGZyb20gU3RhdGVNYWNoaW5lcy4gQSBzdGF0ZW1hY2hpbmUgaW5zdGFuY2UgaXMgcGFzc2VkIGFzIHBhcmFtZXRlciB0byB0aGUgaW5zdHJ1Y3Rpb24gc2V0LlxyXG4gICAqIE11bHRpcGxlIHN0YXRlbWFjaGluZS1pbnN0YW5jZXMgY2FuIHRodXMgdXNlIHRoZSBzYW1lIGluc3RydWN0aW9uIHNldCBhbmQgZGlmZmVyZW50IGluc3RydWN0aW9uIHNldHMgY291bGQgb3BlcmF0ZSBvbiB0aGUgc2FtZSBzdGF0ZW1hY2hpbmUuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFN0YXRlTWFjaGluZUluc3RydWN0aW9uczxTdGF0ZT4gZXh0ZW5kcyBNYXA8U3RhdGUsIFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPj4ge1xyXG4gICAgLyoqIERlZmluZSBkZWRpY2F0ZWQgdHJhbnNpdGlvbiBtZXRob2QgdG8gdHJhbnNpdCBmcm9tIG9uZSBzdGF0ZSB0byBhbm90aGVyKi9cclxuICAgIHB1YmxpYyBzZXRUcmFuc2l0aW9uKF9jdXJyZW50OiBTdGF0ZSwgX25leHQ6IFN0YXRlLCBfdHJhbnNpdGlvbjogU3RhdGVNYWNoaW5lTWV0aG9kPFN0YXRlPik6IHZvaWQge1xyXG4gICAgICBsZXQgYWN0aXZlOiBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kczxTdGF0ZT4gPSB0aGlzLmdldFN0YXRlTWV0aG9kcyhfY3VycmVudCk7XHJcbiAgICAgIGFjdGl2ZS50cmFuc2l0aW9ucy5zZXQoX25leHQsIF90cmFuc2l0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogRGVmaW5lIGRlZGljYXRlZCBhY3Rpb24gbWV0aG9kIGZvciBhIHN0YXRlICovXHJcbiAgICBwdWJsaWMgc2V0QWN0aW9uKF9jdXJyZW50OiBTdGF0ZSwgX2FjdGlvbjogU3RhdGVNYWNoaW5lTWV0aG9kPFN0YXRlPik6IHZvaWQge1xyXG4gICAgICBsZXQgYWN0aXZlOiBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kczxTdGF0ZT4gPSB0aGlzLmdldFN0YXRlTWV0aG9kcyhfY3VycmVudCk7XHJcbiAgICAgIGFjdGl2ZS5hY3Rpb24gPSBfYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBEZWZhdWx0IHRyYW5zaXRpb24gbWV0aG9kIHRvIGludm9rZSBpZiBubyBkZWRpY2F0ZWQgdHJhbnNpdGlvbiBleGlzdHMsIHNob3VsZCBiZSBvdmVycmlkZW4gaW4gc3ViY2xhc3MgKi9cclxuICAgIHB1YmxpYyB0cmFuc2l0RGVmYXVsdChfbWFjaGluZTogU3RhdGVNYWNoaW5lPFN0YXRlPik6IHZvaWQge1xyXG4gICAgICAvL1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKiogRGVmYXVsdCBhY3Rpb24gbWV0aG9kIHRvIGludm9rZSBpZiBubyBkZWRpY2F0ZWQgYWN0aW9uIGV4aXN0cywgc2hvdWxkIGJlIG92ZXJyaWRlbiBpbiBzdWJjbGFzcyAqL1xyXG4gICAgcHVibGljIGFjdERlZmF1bHQoX21hY2hpbmU6IFN0YXRlTWFjaGluZTxTdGF0ZT4pOiB2b2lkIHtcclxuICAgICAgLy9cclxuICAgIH1cclxuXHJcbiAgICAvKiogSW52b2tlIGEgZGVkaWNhdGVkIHRyYW5zaXRpb24gbWV0aG9kIGlmIGZvdW5kIGZvciB0aGUgY3VycmVudCBhbmQgdGhlIG5leHQgc3RhdGUsIG9yIHRoZSBkZWZhdWx0IG1ldGhvZCAqL1xyXG4gICAgcHVibGljIHRyYW5zaXQoX2N1cnJlbnQ6IFN0YXRlLCBfbmV4dDogU3RhdGUsIF9tYWNoaW5lOiBTdGF0ZU1hY2hpbmU8U3RhdGU+KTogdm9pZCB7XHJcbiAgICAgIF9tYWNoaW5lLnN0YXRlTmV4dCA9IF9uZXh0O1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCBhY3RpdmU6IFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPiA9IHRoaXMuZ2V0KF9jdXJyZW50KTtcclxuICAgICAgICBsZXQgdHJhbnNpdGlvbjogU3RhdGVNYWNoaW5lTWV0aG9kPFN0YXRlPiA9IGFjdGl2ZS50cmFuc2l0aW9ucy5nZXQoX25leHQpO1xyXG4gICAgICAgIHRyYW5zaXRpb24oX21hY2hpbmUpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmluZm8oX2Vycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMudHJhbnNpdERlZmF1bHQoX21hY2hpbmUpO1xyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIF9tYWNoaW5lLnN0YXRlQ3VycmVudCA9IF9uZXh0O1xyXG4gICAgICAgIF9tYWNoaW5lLnN0YXRlTmV4dCA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBJbnZva2UgdGhlIGRlZGljYXRlZCBhY3Rpb24gbWV0aG9kIGlmIGZvdW5kIGZvciB0aGUgY3VycmVudCBzdGF0ZSwgb3IgdGhlIGRlZmF1bHQgbWV0aG9kICovXHJcbiAgICBwdWJsaWMgYWN0KF9jdXJyZW50OiBTdGF0ZSwgX21hY2hpbmU6IFN0YXRlTWFjaGluZTxTdGF0ZT4pOiB2b2lkIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgYWN0aXZlOiBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kczxTdGF0ZT4gPSB0aGlzLmdldChfY3VycmVudCk7XHJcbiAgICAgICAgYWN0aXZlLmFjdGlvbihfbWFjaGluZSk7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyhfZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5hY3REZWZhdWx0KF9tYWNoaW5lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBGaW5kIHRoZSBpbnN0cnVjdGlvbnMgZGVkaWNhdGVkIGZvciB0aGUgY3VycmVudCBzdGF0ZSBvciBjcmVhdGUgYW4gZW1wdHkgc2V0IGZvciBpdCAqL1xyXG4gICAgcHJpdmF0ZSBnZXRTdGF0ZU1ldGhvZHMoX2N1cnJlbnQ6IFN0YXRlKTogU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+IHtcclxuICAgICAgbGV0IGFjdGl2ZTogU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+ID0gdGhpcy5nZXQoX2N1cnJlbnQpO1xyXG4gICAgICBpZiAoIWFjdGl2ZSkge1xyXG4gICAgICAgIGFjdGl2ZSA9IHsgYWN0aW9uOiBudWxsLCB0cmFuc2l0aW9uczogbmV3IE1hcCgpIH07XHJcbiAgICAgICAgdGhpcy5zZXQoX2N1cnJlbnQsIGFjdGl2ZSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGFjdGl2ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLy8gVE9ETzogVGhpbmsgYWJvdXQgdGhlIFRyYW5zZm9ybWF0b3IgYW5kIGl0cyB1c2FnZSBpbiB0aGUgRWRpdG9yIChzZXBhcmF0aW9uIG9mIGNvbmNlcm5zKS4gXHJcbiAgLy8gTWF5YmUgdGhlIHRyYW5zZm9ybWF0b3Igc2hvdWxkIGJlIHBhcnQgb2YgdGhlIGVkaXRvciBhZnRlciBhbGwgYW5kIGhhbmRsZSBjb21wb25lbnRzIGRpcmVjdGx5IGluc3RlYWQgb2Ygb25seSBtYXRyaWNlcy5cclxuICAvLyBUaGF0IHdheSBubyBoYWNreSBldmVudCBkaXNwYXRjaGluZy9oYW5kbGluZyB3b3VsZCBiZSBuZWVkZWQsIGFzIGluc3RlYWQgdGhlIHRyYW5zZm9ybWF0b3IgY291bGQgaGFuZGxlIGV2ZXJ5dGhpbmcgaW50ZXJuYWxseS5cclxuICAvKipcclxuICAgKiBBbGxvd3MgdG8gdHJhbnNsYXRlLCByb3RhdGUgYW5kIHNjYWxlIG1hdHJpY2VzIHZpc3VhbGx5IGJ5IGRyYWdnaW5nIHdpdGggYSBwb2ludGVyLiBcclxuICAgKiBJbnN0YWxscyBwb2ludGVyIGV2ZW50IGxpc3RlbmVycyBvbiB0aGUgZ2l2ZW4ge0BsaW5rIMaSLlZpZXdwb3J0fXMgY2FudmFzIG9uIGNvbnN0cnVjdGlvbi4gXHJcbiAgICogVXNlIHtAbGluayBhZGRMaXN0ZW5lcnN9L3tAbGluayByZW1vdmVMaXN0ZW5lcnN9IHRvIGhhbmRsZSB0aGUgaW5zdGFsbGF0aW9uIG1hbnVhbGx5LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1hdG9yIHtcclxuICAgIHB1YmxpYyByZWFkb25seSB2aWV3cG9ydDogxpIuVmlld3BvcnQ7XHJcblxyXG4gICAgcHVibGljIG1vZGU6IFwibm9uZVwiIHwgXCJ0cmFuc2xhdGVcIiB8IFwicm90YXRlXCIgfCBcInNjYWxlXCIgPSBcInRyYW5zbGF0ZVwiO1xyXG4gICAgcHVibGljIHNwYWNlOiBcImxvY2FsXCIgfCBcIndvcmxkXCIgPSBcIndvcmxkXCI7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWQ6IFwieFwiIHwgXCJ5XCIgfCBcInpcIiB8IFwieHlcIiB8IFwieHpcIiB8IFwieXpcIiB8IFwieHl6XCI7XHJcblxyXG4gICAgcHVibGljIHNuYXBBbmdsZTogbnVtYmVyID0gMTU7IC8vIDE1IGRlZ3JlZVxyXG4gICAgcHVibGljIHNuYXBEaXN0YW5jZTogbnVtYmVyID0gMC4xOyAvLyAwLjEgdW5pdHNcclxuICAgIHB1YmxpYyBzbmFwU2NhbGU6IG51bWJlciA9IDAuMTsgLy8gMTAlXHJcblxyXG4gICAgcHVibGljIGNvbG9ycyA9IHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICBiYXNlOiB7XHJcbiAgICAgICAgeDogxpIuQ29sb3IuQ1NTKFwicmVkXCIpLFxyXG4gICAgICAgIHk6IMaSLkNvbG9yLkNTUyhcImxpbWVncmVlblwiKSxcclxuICAgICAgICB6OiDGki5Db2xvci5DU1MoXCJibHVlXCIpLFxyXG4gICAgICAgIHh5ejogxpIuQ29sb3IuQ1NTKFwiZ2FpbnNib3JvXCIpXHJcbiAgICAgIH0sXHJcbiAgICAgIGxpdGU6IHtcclxuICAgICAgICB4OiDGki5Db2xvci5DU1MoXCJzYWxtb25cIiksXHJcbiAgICAgICAgeTogxpIuQ29sb3IuQ1NTKFwibGlnaHRncmVlblwiKSxcclxuICAgICAgICB6OiDGki5Db2xvci5DU1MoXCJjb3JuZmxvd2VyYmx1ZVwiKSxcclxuICAgICAgICB4eXo6IMaSLkNvbG9yLkNTUyhcImdob3N0d2hpdGVcIilcclxuICAgICAgfSxcclxuICAgICAgdHJhbnNwYXJlbnQ6IHtcclxuICAgICAgICB4OiDGki5Db2xvci5DU1MoXCJzYWxtb25cIiwgMC42NiksXHJcbiAgICAgICAgeTogxpIuQ29sb3IuQ1NTKFwibGlnaHRncmVlblwiLCAwLjY2KSxcclxuICAgICAgICB6OiDGki5Db2xvci5DU1MoXCJjb3JuZmxvd2VyYmx1ZVwiLCAwLjY2KVxyXG4gICAgICB9LFxyXG4gICAgICBwbGFuZToge1xyXG4gICAgICAgIHh5OiDGki5Db2xvci5DU1MoXCJibHVlXCIsIDAuNSksXHJcbiAgICAgICAgeHo6IMaSLkNvbG9yLkNTUyhcImxpbWVncmVlblwiLCAwLjUpLFxyXG4gICAgICAgIHl6OiDGki5Db2xvci5DU1MoXCJyZWRcIiwgMC41KVxyXG4gICAgICB9LFxyXG4gICAgICBwbGFuZUxpdGU6IHtcclxuICAgICAgICB4eTogxpIuQ29sb3IuQ1NTKFwiY29ybmZsb3dlcmJsdWVcIiwgMC41KSxcclxuICAgICAgICB4ejogxpIuQ29sb3IuQ1NTKFwibGlnaHRncmVlblwiLCAwLjUpLFxyXG4gICAgICAgIHl6OiDGki5Db2xvci5DU1MoXCJzYWxtb25cIiwgMC41KVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICNtdHhMb2NhbDogxpIuTWF0cml4NHg0OyAvLyBsb2NhbCBtYXRyaXggb2YgdGhlIG9iamVjdCB0byBiZSB0cmFuc2Zvcm1lZFxyXG4gICAgI210eFdvcmxkOiDGki5NYXRyaXg0eDQ7IC8vIHdvcmxkIG1hdHJpeCBvZiB0aGUgb2JqZWN0IHRvIGJlIHRyYW5zZm9ybWVkXHJcblxyXG4gICAgI210eExvY2FsQmFzZTogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LklERU5USVRZKCk7IC8vIGxvY2FsIG1hdHJpeCBpbiBhIHN0YXRlIGJlZm9yZSBhIHRyYW5zZm9ybWF0aW9uIHN0YXJ0c1xyXG4gICAgI210eFdvcmxkQmFzZTogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LklERU5USVRZKCk7IC8vIHdvcmxkIG1hdHJpeCBpbiBhIHN0YXRlIGJlZm9yZSBhIHRyYW5zZm9ybWF0aW9uIHN0YXJ0c1xyXG4gICAgXHJcbiAgICAvKiogVGhlIG5vcm1hbCB2ZWN0b3Igb2YgdGhlIHBsYW5lIHdpdGggd2hpY2ggdGhlIG1vdXNlIHJheSBjb2xsaWRlcyAqL1xyXG4gICAgI25vcm1hbENvbGxpc2lvblBsYW5lOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5aRVJPKCk7XHJcbiAgICAvKiogVGhlIHZlY3RvciBwb2ludGluZyBmcm9tIHRoZSB3b3JsZCBwb3NpdGlvbiB0byB0aGUgcG9pbnRlciBoaXQgb24gcG9pbnRlciBkb3duLiBOb3Qgbm9ybWFsaXplZCAtIG1hZ25pdHVkZSByZXByZXNlbnRzIGRpc3RhbmNlLiAqL1xyXG4gICAgI3ZjdFBvaW50ZXJEb3duOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5aRVJPKCk7XHJcbiAgICAvKiogVGhlIHZlY3RvciBwb2ludGluZyBmcm9tIHRoZSB3b3JsZCBwb3NpdGlvbiB0byB0aGUgcG9pbnRlciBoaXQgb24gcG9pbnRlciBtb3ZlLiBOb3Qgbm9ybWFsaXplZCAtIG1hZ25pdHVkZSByZXByZXNlbnRzIGRpc3RhbmNlLiAqL1xyXG4gICAgI3ZjdFBvaW50ZXJNb3ZlOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5aRVJPKCk7XHJcblxyXG4gICAgI2lzVHJhbnNmb3JtaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAjc3RhcnRUcmFuc2Zvcm06IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAjdG9ydXM6IMaSLk1lc2hUb3J1cztcclxuICAgICN0b3J1c1BpY2s6IMaSLk1lc2hUb3J1cztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX3ZpZXdwb3J0OiDGki5WaWV3cG9ydCkge1xyXG4gICAgICB0aGlzLnZpZXdwb3J0ID0gX3ZpZXdwb3J0O1xyXG4gICAgICB0aGlzLmFkZExpc3RlbmVycygpO1xyXG4gICAgICB0aGlzLiN0b3J1cyA9IG5ldyDGki5NZXNoVG9ydXMoXCJUb3J1c1wiLCA4MCwgMC43NSwgNjAsIDgpOyAvLyA4MCBsb2dpY2FsIHBpeGVsIHJpbmcgcmFkaXVzLCAwLjc1IGxvZ2ljYWwgcGl4ZWwgdHViZSByYWRpdXNcclxuICAgICAgdGhpcy4jdG9ydXNQaWNrID0gbmV3IMaSLk1lc2hUb3J1cyhcIlRvcnVzUGlja1wiLCA4MCwgNSwgNjAsIDgpO1xyXG4gICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIodGhpcy4jdG9ydXMpO1xyXG4gICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIodGhpcy4jdG9ydXNQaWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IG10eExvY2FsKF9tdHg6IMaSLk1hdHJpeDR4NCkge1xyXG4gICAgICB0aGlzLiNtdHhMb2NhbCA9IF9tdHg7XHJcbiAgICAgIGlmICh0aGlzLiNtdHhMb2NhbClcclxuICAgICAgICB0aGlzLiNtdHhMb2NhbEJhc2UuY29weShfbXR4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IG10eFdvcmxkKF9tdHg6IMaSLk1hdHJpeDR4NCkge1xyXG4gICAgICB0aGlzLiNtdHhXb3JsZCA9IF9tdHg7XHJcbiAgICAgIGlmICh0aGlzLiNtdHhXb3JsZClcclxuICAgICAgICB0aGlzLiNtdHhXb3JsZEJhc2UuY29weShfbXR4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBjYW1lcmEoKTogxpIuQ29tcG9uZW50Q2FtZXJhIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld3BvcnQuY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHBvaW50ZXIgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSB2aWV3cG9ydCBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZExpc3RlbmVycyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMuaG5kUG9pbnRlckRvd24pO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5obmRQb2ludGVyTW92ZSk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmxlYXZlXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX0VORCwgdGhpcy5obmRSZW5kZXJFbmQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBwb2ludGVyIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB2aWV3cG9ydCBjYW52YXNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUxpc3RlbmVycyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMuaG5kUG9pbnRlckRvd24pO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5obmRQb2ludGVyTW92ZSk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcmxlYXZlXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnJlbW92ZUV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX0VORCwgdGhpcy5obmRSZW5kZXJFbmQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZHJhd0dpem1vcyhfY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEsIF9waWNraW5nOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy4jbXR4TG9jYWwgfHwgIXRoaXMuI210eFdvcmxkKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmICh0aGlzLnNwYWNlID09IFwibG9jYWxcIiAmJiAodGhpcy4jbXR4V29ybGQuc2NhbGluZy54ID09IDAgfHwgdGhpcy4jbXR4V29ybGQuc2NhbGluZy55ID09IDAgfHwgdGhpcy4jbXR4V29ybGQuc2NhbGluZy56ID09IDApKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHdvcmxkMlBpeGVsOiBudW1iZXIgPSBfY21wQ2FtZXJhLmdldFdvcmxkVG9QaXhlbFNjYWxlKHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uKTtcclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZUFycm93V2lkdGg6IG51bWJlciA9IHdvcmxkMlBpeGVsICogKF9waWNraW5nID8gMTAgOiAxKTtcclxuICAgICAgY29uc3QgdHJhbnNsYXRlQXJyb3dMZW5ndGg6IG51bWJlciA9IHdvcmxkMlBpeGVsICogKF9waWNraW5nID8gOTAgOiA4MCk7XHJcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZUFycm93U2l6ZTogbnVtYmVyID0gd29ybGQyUGl4ZWwgKiAxNDtcclxuXHJcbiAgICAgIGNvbnN0IHNjYWxlQXJyb3dXaWR0aDogbnVtYmVyID0gd29ybGQyUGl4ZWwgKiAoX3BpY2tpbmcgPyAxMCA6IDEpO1xyXG4gICAgICBjb25zdCBzY2FsZUFycm93TGVuZ3RoOiBudW1iZXIgPSB3b3JsZDJQaXhlbCAqIChfcGlja2luZyA/IDgzIDogNzMpO1xyXG4gICAgICBjb25zdCBzY2FsZUFycm93U2l6ZTogbnVtYmVyID0gd29ybGQyUGl4ZWwgKiA3O1xyXG4gICAgICBjb25zdCBzY2FsZUN1YmVTaXplOiBudW1iZXIgPSB3b3JsZDJQaXhlbCAqIChfcGlja2luZyA/IDIwIDogMTApO1xyXG5cclxuICAgICAgY29uc3QgY2xyQXhlczogUmVjb3JkPFwieFwiIHwgXCJ5XCIgfCBcInpcIiwgxpIuQ29sb3I+ID0ge1xyXG4gICAgICAgIHg6IHRoaXMuc2VsZWN0ZWQgPT0gXCJ4XCIgJiYgIXRoaXMuI2lzVHJhbnNmb3JtaW5nID8gdGhpcy5jb2xvcnMubGl0ZS54IDogdGhpcy5jb2xvcnMuYmFzZS54LFxyXG4gICAgICAgIHk6IHRoaXMuc2VsZWN0ZWQgPT0gXCJ5XCIgJiYgIXRoaXMuI2lzVHJhbnNmb3JtaW5nID8gdGhpcy5jb2xvcnMubGl0ZS55IDogdGhpcy5jb2xvcnMuYmFzZS55LFxyXG4gICAgICAgIHo6IHRoaXMuc2VsZWN0ZWQgPT0gXCJ6XCIgJiYgIXRoaXMuI2lzVHJhbnNmb3JtaW5nID8gdGhpcy5jb2xvcnMubGl0ZS56IDogdGhpcy5jb2xvcnMuYmFzZS56XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBjbHJQbGFuZXM6IFJlY29yZDxcInh5XCIgfCBcInh6XCIgfCBcInl6XCIsIMaSLkNvbG9yPiA9IHtcclxuICAgICAgICB4eTogdGhpcy5zZWxlY3RlZCA9PSBcInh5XCIgJiYgIXRoaXMuI2lzVHJhbnNmb3JtaW5nID8gdGhpcy5jb2xvcnMucGxhbmVMaXRlLnh5IDogdGhpcy5jb2xvcnMucGxhbmUueHksXHJcbiAgICAgICAgeHo6IHRoaXMuc2VsZWN0ZWQgPT0gXCJ4elwiICYmICF0aGlzLiNpc1RyYW5zZm9ybWluZyA/IHRoaXMuY29sb3JzLnBsYW5lTGl0ZS54eiA6IHRoaXMuY29sb3JzLnBsYW5lLnh6LFxyXG4gICAgICAgIHl6OiB0aGlzLnNlbGVjdGVkID09IFwieXpcIiAmJiAhdGhpcy4jaXNUcmFuc2Zvcm1pbmcgPyB0aGlzLmNvbG9ycy5wbGFuZUxpdGUueXogOiB0aGlzLmNvbG9ycy5wbGFuZS55elxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgYXhlczogUmVjb3JkPFwieFwiIHwgXCJ5XCIgfCBcInpcIiwgxpIuVmVjdG9yMz4gPSB7XHJcbiAgICAgICAgeDogdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlgoKSA6IHRoaXMuI210eFdvcmxkLmdldFJpZ2h0KCksXHJcbiAgICAgICAgeTogdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlkoKSA6IHRoaXMuI210eFdvcmxkLmdldFVwKCksXHJcbiAgICAgICAgejogdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlooKSA6IHRoaXMuI210eFdvcmxkLmdldEZvcndhcmQoKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3Qgbm9ybWFsczogUmVjb3JkPFwieFwiIHwgXCJ5XCIgfCBcInpcIiwgxpIuVmVjdG9yMz4gPSB7XHJcbiAgICAgICAgeDogdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlooKSA6IHRoaXMuI210eFdvcmxkLmdldEZvcndhcmQoKSxcclxuICAgICAgICB5OiB0aGlzLnNwYWNlID09IFwid29ybGRcIiA/IMaSLlZlY3RvcjMuWCgpIDogdGhpcy4jbXR4V29ybGQuZ2V0UmlnaHQoKSxcclxuICAgICAgICB6OiB0aGlzLnNwYWNlID09IFwid29ybGRcIiA/IMaSLlZlY3RvcjMuWSgpIDogdGhpcy4jbXR4V29ybGQuZ2V0VXAoKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgbXR4V29ybGROb3JtYWxpemVkOiDGki5NYXRyaXg0eDQgPSB0aGlzLnNwYWNlID09IFwid29ybGRcIiA/IMaSLk1hdHJpeDR4NC5DT01QT1NJVElPTih0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbikgOiB0aGlzLiNtdHhXb3JsZC5jbG9uZTtcclxuICAgICAgbXR4V29ybGROb3JtYWxpemVkLnNjYWxlKG10eFdvcmxkTm9ybWFsaXplZC5zY2FsaW5nLm1hcChfdmFsdWUgPT4gMSAvIF92YWx1ZSkpO1xyXG5cclxuXHJcblxyXG4gICAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xyXG4gICAgICAgIGNhc2UgXCJ0cmFuc2xhdGVcIjpcclxuICAgICAgICAgIC8vIGRyYXcgdGhlIGF4ZXNcclxuICAgICAgICAgIGZvciAoY29uc3QgYXhpcyBvZiBbXCJ4XCIsIFwieVwiLCBcInpcIl0gYXMgY29uc3QpXHJcbiAgICAgICAgICAgIMaSLkdpem1vcy5kcmF3QXJyb3codGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24sIGNsckF4ZXNbYXhpc10sIGF4ZXNbYXhpc10sIG5vcm1hbHNbYXhpc10sIHRyYW5zbGF0ZUFycm93TGVuZ3RoLCB0cmFuc2xhdGVBcnJvd1dpZHRoLCB0cmFuc2xhdGVBcnJvd1NpemUsIMaSLk1lc2hQeXJhbWlkLCAwKTtcclxuXHJcbiAgICAgICAgICAvLyBkcmF3IHRoZSBwbGFuZXNcclxuICAgICAgICAgIGZvciAoY29uc3QgW2F4aXMsIHBsYW5lXSBvZiBbW1wielwiLCBcInh5XCJdLCBbXCJ5XCIsIFwieHpcIl0sIFtcInhcIiwgXCJ5elwiXV0gYXMgY29uc3QpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuI2lzVHJhbnNmb3JtaW5nICYmIHRoaXMuc2VsZWN0ZWQgIT0gcGxhbmUpXHJcbiAgICAgICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtdHhRdWFkOiDGki5NYXRyaXg0eDQgPSBtdHhXb3JsZE5vcm1hbGl6ZWQuY2xvbmU7XHJcbiAgICAgICAgICAgIGlmIChheGlzID09IFwieFwiKVxyXG4gICAgICAgICAgICAgIG10eFF1YWQucm90YXRlWSgtOTApO1xyXG4gICAgICAgICAgICBpZiAoYXhpcyA9PSBcInlcIilcclxuICAgICAgICAgICAgICBtdHhRdWFkLnJvdGF0ZVgoOTApO1xyXG5cclxuICAgICAgICAgICAgbXR4UXVhZC50cmFuc2xhdGUobmV3IMaSLlZlY3RvcjMod29ybGQyUGl4ZWwgKiAyMCwgd29ybGQyUGl4ZWwgKiAyMCwgMCkpOyAvLyBtb3ZlIDIwIHB4XHJcbiAgICAgICAgICAgIG10eFF1YWQuc2NhbGUoxpIuVmVjdG9yMy5PTkUod29ybGQyUGl4ZWwgKiAoX3BpY2tpbmcgPyAyMCA6IDEwKSkpOyAvLyBzY2FsZSB0byBzaXplIG9mIDIwIG9yIDEwIHB4XHJcbiAgICAgICAgICAgIMaSLkdpem1vcy5kcmF3U3ByaXRlKG10eFF1YWQsIGNsclBsYW5lc1twbGFuZV0sIF9waWNraW5nID8gMCA6IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gZHJhdyBhZnRlcmltYWdlc1xyXG4gICAgICAgICAgaWYgKHRoaXMuI2lzVHJhbnNmb3JtaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdvcmxkMlBpeGVsQmFzZTogbnVtYmVyID0gX2NtcENhbWVyYS5nZXRXb3JsZFRvUGl4ZWxTY2FsZSh0aGlzLiNtdHhXb3JsZEJhc2UudHJhbnNsYXRpb24pO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkIG9mIHRoaXMuc2VsZWN0ZWQpICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkQmFzZS50cmFuc2xhdGlvbiwgdGhpcy5jb2xvcnMudHJhbnNwYXJlbnRbc2VsZWN0ZWRdLCBheGVzW3NlbGVjdGVkXSwgbm9ybWFsc1tzZWxlY3RlZF0sIHdvcmxkMlBpeGVsQmFzZSAqIDgwLCB3b3JsZDJQaXhlbEJhc2UgKiAxLCB3b3JsZDJQaXhlbEJhc2UgKiAxNCwgxpIuTWVzaFB5cmFtaWQsIDApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJyb3RhdGVcIjpcclxuICAgICAgICAgIGlmICh0aGlzLiNpc1RyYW5zZm9ybWluZyAmJiAodGhpcy5zZWxlY3RlZCA9PSBcInhcIiB8fCB0aGlzLnNlbGVjdGVkID09IFwieVwiIHx8IHRoaXMuc2VsZWN0ZWQgPT0gXCJ6XCIpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvblBvaW50ZXJNb3ZlOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5OT1JNQUxJWkFUSU9OKHRoaXMuI3ZjdFBvaW50ZXJNb3ZlKTtcclxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uUG9pbnRlckRvd246IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLk5PUk1BTElaQVRJT04odGhpcy4jdmN0UG9pbnRlckRvd24pO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdDaXJjbGUodGhpcy4jdG9ydXMsIHRoaXMuY29sb3JzLmJhc2VbdGhpcy5zZWxlY3RlZF0sIGF4ZXNbdGhpcy5zZWxlY3RlZF0sIG5vcm1hbHNbdGhpcy5zZWxlY3RlZF0sIHdvcmxkMlBpeGVsLCAwKTtcclxuICAgICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy5jb2xvcnMuYmFzZVt0aGlzLnNlbGVjdGVkXSwgZGlyZWN0aW9uUG9pbnRlck1vdmUsIGF4ZXNbdGhpcy5zZWxlY3RlZF0sIHRyYW5zbGF0ZUFycm93TGVuZ3RoLCB0cmFuc2xhdGVBcnJvd1dpZHRoLCB0cmFuc2xhdGVBcnJvd1NpemUsIMaSLk1lc2hQeXJhbWlkLCAwKTtcclxuICAgICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy5jb2xvcnMudHJhbnNwYXJlbnRbdGhpcy5zZWxlY3RlZF0sIGRpcmVjdGlvblBvaW50ZXJEb3duLCBheGVzW3RoaXMuc2VsZWN0ZWRdLCB0cmFuc2xhdGVBcnJvd0xlbmd0aCwgdHJhbnNsYXRlQXJyb3dXaWR0aCwgdHJhbnNsYXRlQXJyb3dTaXplLCDGki5NZXNoUHlyYW1pZCwgMCk7XHJcbiAgICAgICAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKGRpcmVjdGlvblBvaW50ZXJNb3ZlKTtcclxuICAgICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmUoZGlyZWN0aW9uUG9pbnRlckRvd24pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBkcmF3IGFuIGludmlzaWJsZSBxdWFkIHRvIG9jY2x1ZGUgdGhlIHRvcmlcclxuICAgICAgICAgIGNvbnN0IG10eFF1YWQ6IMaSLk1hdHJpeDR4NCA9IMaSLk1hdHJpeDR4NC5DT01QT1NJVElPTih0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbik7XHJcbiAgICAgICAgICBjb25zdCBkaXJlY3Rpb246IMaSLlZlY3RvcjMgPSBfY21wQ2FtZXJhLm10eFdvcmxkLmdldEZvcndhcmQoKS5uZWdhdGUoKTtcclxuICAgICAgICAgIG10eFF1YWQuc2NhbGluZyA9IMaSLlZlY3RvcjMuT05FKHRyYW5zbGF0ZUFycm93TGVuZ3RoICogMik7XHJcbiAgICAgICAgICBtdHhRdWFkLmxvb2tJbihkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLnNldENvbG9yV3JpdGVNYXNrKGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgIMaSLkdpem1vcy5kcmF3UXVhZChtdHhRdWFkLCB0aGlzLmNvbG9ycy5iYXNlLngsIDApOyAvLyBjb2xvciBkb2Vzbid0IG1hdHRlclxyXG4gICAgICAgICAgxpIuUmVuZGVyLnNldENvbG9yV3JpdGVNYXNrKHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICAgIC8vIGRyYXcgdGhlIHRvcmlcclxuICAgICAgICAgIGxldCB0b3J1czogxpIuTWVzaFRvcnVzID0gX3BpY2tpbmcgPyB0aGlzLiN0b3J1c1BpY2sgOiB0aGlzLiN0b3J1cztcclxuXHJcbiAgICAgICAgICBmb3IgKGNvbnN0IGF4aXMgb2YgW1wieFwiLCBcInlcIiwgXCJ6XCJdIGFzIGNvbnN0KVxyXG4gICAgICAgICAgICB0aGlzLmRyYXdDaXJjbGUodG9ydXMsIGNsckF4ZXNbYXhpc10sIGF4ZXNbYXhpc10sIG5vcm1hbHNbYXhpc10sIHdvcmxkMlBpeGVsLCAwKTtcclxuXHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShtdHhRdWFkKTtcclxuICAgICAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKGRpcmVjdGlvbik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwic2NhbGVcIjpcclxuICAgICAgICAgIGZvciAoY29uc3QgYXhpcyBvZiBbXCJ4XCIsIFwieVwiLCBcInpcIl0gYXMgY29uc3QpIHtcclxuICAgICAgICAgICAgbGV0IGZhY3RvcjogbnVtYmVyID0gdGhpcy4jbXR4TG9jYWwuc2NhbGluZ1theGlzXSAvIHRoaXMuI210eExvY2FsQmFzZS5zY2FsaW5nW2F4aXNdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zcGFjZSA9PSBcImxvY2FsXCIpXHJcbiAgICAgICAgICAgICAgZmFjdG9yID0gTWF0aC5hYnMoZmFjdG9yKTtcclxuICAgICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgY2xyQXhlc1theGlzXSwgYXhlc1theGlzXSwgbm9ybWFsc1theGlzXSwgc2NhbGVBcnJvd0xlbmd0aCAqIGZhY3Rvciwgc2NhbGVBcnJvd1dpZHRoLCBzY2FsZUFycm93U2l6ZSwgxpIuTWVzaEN1YmUsIDApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IG10eEN1YmU6IMaSLk1hdHJpeDR4NCA9IG10eFdvcmxkTm9ybWFsaXplZC5jbG9uZTtcclxuICAgICAgICAgIG10eEN1YmUuc2NhbGUobXR4Q3ViZS5zY2FsaW5nLnNldChzY2FsZUN1YmVTaXplLCBzY2FsZUN1YmVTaXplLCBzY2FsZUN1YmVTaXplKSk7XHJcbiAgICAgICAgICDGki5HaXptb3MuZHJhd0N1YmUobXR4Q3ViZSwgdGhpcy5zZWxlY3RlZCA9PSBcInh5elwiID8gdGhpcy5jb2xvcnMubGl0ZS54eXogOiB0aGlzLmNvbG9ycy5iYXNlLnh5eiwgMSk7XHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShtdHhDdWJlKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShtdHhXb3JsZE5vcm1hbGl6ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlckRvd24gPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmNhbWVyYSB8fCAhdGhpcy52aWV3cG9ydCB8fCAhdGhpcy5zZWxlY3RlZCB8fCAhdGhpcy4jbXR4TG9jYWwgfHwgIXRoaXMuI210eFdvcmxkKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLnN0eWxlLmN1cnNvciA9IFwiZ3JhYmJpbmdcIjtcclxuXHJcbiAgICAgIHRoaXMuI210eExvY2FsQmFzZS5jb3B5KHRoaXMuI210eExvY2FsKTtcclxuICAgICAgdGhpcy4jbXR4V29ybGRCYXNlLmNvcHkodGhpcy4jbXR4V29ybGQpO1xyXG5cclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQgPT0gXCJ4XCIgfHwgdGhpcy5zZWxlY3RlZCA9PSBcInlcIiB8fCB0aGlzLnNlbGVjdGVkID09IFwielwiKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kZSA9PSBcInJvdGF0ZVwiKSB7XHJcbiAgICAgICAgICB0aGlzLiNub3JtYWxDb2xsaXNpb25QbGFuZS5jb3B5KHRoaXMuZ2V0QXhpcyh0aGlzLnNlbGVjdGVkKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IG10eE5vcm1hbDogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LkxPT0tfQVQodGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMuY2FtZXJhLm10eFdvcmxkLnRyYW5zbGF0aW9uLCB0aGlzLmdldEF4aXModGhpcy5zZWxlY3RlZCksIHRydWUpO1xyXG4gICAgICAgICAgdGhpcy4jbm9ybWFsQ29sbGlzaW9uUGxhbmUuY29weShtdHhOb3JtYWwuZ2V0Rm9yd2FyZCgpKTsgLy8gbm9ybWFsIG9mIHRoZSBwbGFuZSB0aGUgbW91c2UgcmF5IHdpbGwgY29sbGlkZSB3aXRoXHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShtdHhOb3JtYWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkID09IFwieHl6XCIpIHtcclxuICAgICAgICB0aGlzLiNub3JtYWxDb2xsaXNpb25QbGFuZS5jb3B5KHRoaXMuY2FtZXJhLm10eFdvcmxkLmdldEZvcndhcmQoKS5uZWdhdGUoKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgYXhpczogc3RyaW5nID0gXCJ4eXpcIi5yZXBsYWNlKHRoaXMuc2VsZWN0ZWRbMF0sIFwiXCIpLnJlcGxhY2UodGhpcy5zZWxlY3RlZFsxXSwgXCJcIik7XHJcbiAgICAgICAgdGhpcy4jbm9ybWFsQ29sbGlzaW9uUGxhbmUuY29weSh0aGlzLmdldEF4aXMoPFwieFwiIHwgXCJ5XCIgfCBcInpcIj5heGlzKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHBvaW50OiDGki5WZWN0b3IzID0gdGhpcy5nZXRQb2ludDNEKF9ldmVudCk7XHJcbiAgICAgIMaSLlZlY3RvcjMuRElGRkVSRU5DRShwb2ludCwgdGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMuI3ZjdFBvaW50ZXJEb3duKTtcclxuICAgICAgdGhpcy4jdmN0UG9pbnRlck1vdmUuY29weSh0aGlzLiN2Y3RQb2ludGVyRG93bik7XHJcblxyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShwb2ludCk7XHJcblxyXG4gICAgICB0aGlzLiNzdGFydFRyYW5zZm9ybSA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlck1vdmUgPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy4jaXNUcmFuc2Zvcm1pbmcgPSBmYWxzZTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XHJcblxyXG4gICAgICBpZiAoX2V2ZW50LmJ1dHRvbnMgIT0gMSkge1xyXG4gICAgICAgIGNvbnN0IHBvaW50OiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgICBjb25zdCBwaWNrOiDGki5QaWNrID0gxpIuUGlja2VyLnBpY2tDYW1lcmEoW3RoaXNdLCB0aGlzLmNhbWVyYSwgdGhpcy52aWV3cG9ydC5wb2ludENsaWVudFRvUHJvamVjdGlvbihwb2ludCkpWzBdO1xyXG5cclxuICAgICAgICBpZiAocGljaz8uY29sb3IuciA+IDAuOCAmJiBwaWNrPy5jb2xvci5nID4gMC44ICYmIHBpY2s/LmNvbG9yLmIgPiAwLjgpXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gXCJ4eXpcIjtcclxuICAgICAgICBlbHNlIGlmIChwaWNrPy5jb2xvci5iID4gMC44ICYmIHBpY2s/LmNvbG9yLmEgPCAxKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFwieHlcIjtcclxuICAgICAgICBlbHNlIGlmIChwaWNrPy5jb2xvci5nID4gMC44ICYmIHBpY2s/LmNvbG9yLmEgPCAxKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFwieHpcIjtcclxuICAgICAgICBlbHNlIGlmIChwaWNrPy5jb2xvci5yID4gMC44ICYmIHBpY2s/LmNvbG9yLmEgPCAxKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFwieXpcIjtcclxuICAgICAgICBlbHNlIGlmIChwaWNrPy5jb2xvci5yID4gMC44KVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFwieFwiO1xyXG4gICAgICAgIGVsc2UgaWYgKHBpY2s/LmNvbG9yLmcgPiAwLjgpXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gXCJ5XCI7XHJcbiAgICAgICAgZWxzZSBpZiAocGljaz8uY29sb3IuYiA+IDAuOClcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBcInpcIjtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpXHJcbiAgICAgICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImdyYWJcIjtcclxuXHJcbiAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmUocG9pbnQpO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5jYW1lcmEgfHwgIXRoaXMudmlld3BvcnQgfHwgIXRoaXMuc2VsZWN0ZWQgfHwgIXRoaXMuI210eExvY2FsIHx8ICF0aGlzLiNtdHhXb3JsZClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImdyYWJiaW5nXCI7XHJcblxyXG4gICAgICBjb25zdCBpc1NuYXBwaW5nOiBib29sZWFuID0gxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLkNUUkxfTEVGVCwgxpIuS0VZQk9BUkRfQ09ERS5DVFJMX1JJR0hUXSk7XHJcblxyXG4gICAgICB0aGlzLiNpc1RyYW5zZm9ybWluZyA9IHRydWU7XHJcbiAgICAgIGlmICh0aGlzLiNzdGFydFRyYW5zZm9ybSA9PSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy4jc3RhcnRUcmFuc2Zvcm0gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInN0YXJ0VHJhbnNmb3JtXCIsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIMaSLlZlY3RvcjMuRElGRkVSRU5DRSh0aGlzLmdldFBvaW50M0QoX2V2ZW50KSwgdGhpcy4jbXR4V29ybGRCYXNlLnRyYW5zbGF0aW9uLCB0aGlzLiN2Y3RQb2ludGVyTW92ZSk7XHJcbiAgICAgIHRoaXMuI210eExvY2FsLmNvcHkodGhpcy4jbXR4TG9jYWxCYXNlKTsgLy8gcmVzZXRcclxuXHJcbiAgICAgIGxldCBheGlzOiDGki5WZWN0b3IzO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZCA9PSBcInhcIiB8fCB0aGlzLnNlbGVjdGVkID09IFwieVwiIHx8IHRoaXMuc2VsZWN0ZWQgPT0gXCJ6XCIpXHJcbiAgICAgICAgYXhpcyA9IHRoaXMuZ2V0QXhpcyh0aGlzLnNlbGVjdGVkKTtcclxuXHJcbiAgICAgIGNvbnN0IG10eFdvcmxkSW52ZXJzZTogxpIuTWF0cml4NHg0ID0gdGhpcy4jbXR4V29ybGRCYXNlLmNsb25lLmludmVydCgpO1xyXG4gICAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xyXG4gICAgICAgIGNhc2UgXCJ0cmFuc2xhdGVcIjpcclxuICAgICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IzID0gdGhpcy5zZWxlY3RlZC5sZW5ndGggPT0gMSA/IMaSLlZlY3RvcjMuUFJPSkVDVElPTih0aGlzLiN2Y3RQb2ludGVyTW92ZSwgYXhpcykgOiB0aGlzLiN2Y3RQb2ludGVyTW92ZS5jbG9uZTtcclxuICAgICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uUG9pbnRlckRvd246IMaSLlZlY3RvcjMgPSB0aGlzLnNlbGVjdGVkLmxlbmd0aCA9PSAxID8gxpIuVmVjdG9yMy5QUk9KRUNUSU9OKHRoaXMuI3ZjdFBvaW50ZXJEb3duLCBheGlzKSA6IHRoaXMuI3ZjdFBvaW50ZXJEb3duLmNsb25lO1xyXG5cclxuICAgICAgICAgIHRyYW5zbGF0aW9uLnN1YnRyYWN0KHRyYW5zbGF0aW9uUG9pbnRlckRvd24pO1xyXG5cclxuICAgICAgICAgIGlmIChpc1NuYXBwaW5nKVxyXG4gICAgICAgICAgICB0cmFuc2xhdGlvbi5hcHBseSgoX3ZhbHVlOiBudW1iZXIpID0+IMaSLkNhbGMuc25hcChfdmFsdWUsIHRoaXMuc25hcERpc3RhbmNlKSk7XHJcblxyXG4gICAgICAgICAgdHJhbnNsYXRpb24udHJhbnNmb3JtKG10eFdvcmxkSW52ZXJzZSwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgIHRoaXMuI210eExvY2FsLnRyYW5zbGF0ZSh0cmFuc2xhdGlvbik7XHJcbiAgICAgICAgICAvLyByZXN0b3JlIHNjYWxpbmcgZGlyZWN0aW9uc1xyXG4gICAgICAgICAgdGhpcy4jbXR4TG9jYWwuc2NhbGluZyA9IHRoaXMuI210eExvY2FsLnNjYWxpbmcuYXBwbHkoKF92YWx1ZSwgX2luZGV4LCBfY29tcG9uZW50KSA9PiBfdmFsdWUgKiBNYXRoLnNpZ24odGhpcy4jbXR4TG9jYWxCYXNlLnNjYWxpbmdbX2NvbXBvbmVudF0pKTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmUobXR4V29ybGRJbnZlcnNlKTtcclxuICAgICAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKHRyYW5zbGF0aW9uKTtcclxuICAgICAgICAgIMaSLlJlY3ljbGVyLnN0b3JlKHRyYW5zbGF0aW9uUG9pbnRlckRvd24pO1xyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJyb3RhdGVcIjpcclxuICAgICAgICAgIGxldCBhbmdsZTogbnVtYmVyID0gxpIuVmVjdG9yMy5BTkdMRSh0aGlzLiN2Y3RQb2ludGVyRG93biwgdGhpcy4jdmN0UG9pbnRlck1vdmUpO1xyXG5cclxuICAgICAgICAgIGlmIChpc1NuYXBwaW5nKVxyXG4gICAgICAgICAgICBhbmdsZSA9IMaSLkNhbGMuc25hcChhbmdsZSwgdGhpcy5zbmFwQW5nbGUpO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGNyb3NzOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5DUk9TUyh0aGlzLiN2Y3RQb2ludGVyRG93biwgdGhpcy4jdmN0UG9pbnRlck1vdmUpO1xyXG4gICAgICAgICAgaWYgKMaSLlZlY3RvcjMuRE9UKGF4aXMsIGNyb3NzKSA8IDApXHJcbiAgICAgICAgICAgIGFuZ2xlID0gLWFuZ2xlO1xyXG5cclxuICAgICAgICAgIC8vIGNvbnN0IHFSb3RhdGlvbjogxpIuUXVhdGVybmlvbiA9IMaSLlF1YXRlcm5pb24uUk9UQVRJT05fQVhJU19BTkdMRShheGlzLCBhbmdsZSk7XHJcbiAgICAgICAgICBjb25zdCBtdHhSb3RhdGlvbjogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LlJPVEFUSU9OX0FYSVNfQU5HTEUoYXhpcywgYW5nbGUpO1xyXG5cclxuICAgICAgICAgIGlmIChpc1NuYXBwaW5nKSB7IC8vIHJvdGF0ZSBkaXJlY3Rpb25Qb2ludGVyRG93biBpbnRvIHNuYXBwZWQgZGlyZWN0aW9uXHJcbiAgICAgICAgICAgIHRoaXMuI3ZjdFBvaW50ZXJNb3ZlLmNvcHkodGhpcy4jdmN0UG9pbnRlckRvd24pO1xyXG4gICAgICAgICAgICB0aGlzLiN2Y3RQb2ludGVyTW92ZS50cmFuc2Zvcm0obXR4Um90YXRpb24pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IG10eExvY2FsSW52ZXJzZTogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LklOVkVSU0UodGhpcy4jbXR4TG9jYWxCYXNlKTtcclxuICAgICAgICAgIGNvbnN0IG10eFBhcmVudFdvcmxkOiDGki5NYXRyaXg0eDQgPSDGki5NYXRyaXg0eDQuUFJPRFVDVCh0aGlzLiNtdHhXb3JsZEJhc2UsIG10eExvY2FsSW52ZXJzZSk7XHJcbiAgICAgICAgICBjb25zdCBtdHhQYXJlbnRXb3JsZEludmVyc2U6IMaSLk1hdHJpeDR4NCA9IG10eFBhcmVudFdvcmxkLmNsb25lLmludmVydCgpO1xyXG5cclxuICAgICAgICAgIC8vIG10eExvY2FsID0gbXR4UGFyZW50V29ybGRJbnZlcnNlICogbXR4Um90YXRpb24gKiBtdHhQYXJlbnRXb3JsZCAqIG10eExvY2FsXHJcbiAgICAgICAgICBtdHhSb3RhdGlvbi5wcmVtdWx0aXBseShtdHhQYXJlbnRXb3JsZEludmVyc2UpO1xyXG4gICAgICAgICAgbXR4Um90YXRpb24ubXVsdGlwbHkobXR4UGFyZW50V29ybGQpO1xyXG4gICAgICAgICAgbXR4Um90YXRpb24ubXVsdGlwbHkodGhpcy4jbXR4TG9jYWxCYXNlKTtcclxuICAgICAgICAgIC8vIHJlc3RvcmUgc2NhbGluZyBkaXJlY3Rpb25zXHJcbiAgICAgICAgICBtdHhSb3RhdGlvbi5zY2FsaW5nID0gbXR4Um90YXRpb24uc2NhbGluZy5hcHBseSgoX3ZhbHVlLCBfaW5kZXgsIF9jb21wb25lbnQpID0+IF92YWx1ZSAqIE1hdGguc2lnbih0aGlzLiNtdHhMb2NhbEJhc2Uuc2NhbGluZ1tfY29tcG9uZW50XSkpO1xyXG5cclxuICAgICAgICAgIHRoaXMuI210eExvY2FsLmNvbXBvc2UodGhpcy4jbXR4TG9jYWwudHJhbnNsYXRpb24sIG10eFJvdGF0aW9uLnJvdGF0aW9uLCBtdHhSb3RhdGlvbi5zY2FsaW5nKTtcclxuXHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShjcm9zcyk7XHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShtdHhSb3RhdGlvbik7XHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShtdHhMb2NhbEludmVyc2UpO1xyXG4gICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmUobXR4UGFyZW50V29ybGQpO1xyXG4gICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmUobXR4UGFyZW50V29ybGRJbnZlcnNlKTtcclxuXHJcbiAgICAgICAgICAvLyBjb25zdCBxUGFyZW50V29ybGQ6IMaSLlF1YXRlcm5pb24gPSBtdHhQYXJlbnRXb3JsZC5xdWF0ZXJuaW9uO1xyXG4gICAgICAgICAgLy8gY29uc3QgcVBhcmVudFdvcmxkSW52ZXJzZTogxpIuUXVhdGVybmlvbiA9IMaSLlF1YXRlcm5pb24uSU5WRVJTRShtdHhQYXJlbnRXb3JsZC5xdWF0ZXJuaW9uKTtcclxuXHJcbiAgICAgICAgICAvLyBxUm90YXRpb24ubXVsdGlwbHkocVBhcmVudFdvcmxkSW52ZXJzZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAvLyBxUm90YXRpb24ubXVsdGlwbHkocVBhcmVudFdvcmxkKTtcclxuICAgICAgICAgIC8vIHFSb3RhdGlvbi5tdWx0aXBseSh0aGlzLiNtdHhMb2NhbEJhc2UucXVhdGVybmlvbik7XHJcblxyXG4gICAgICAgICAgLy8gdGhpcy4jbXR4TG9jYWwucXVhdGVybmlvbiA9IHFSb3RhdGlvbjtcclxuXHJcbiAgICAgICAgICAvLyBjb25zdCBtdHhMb2NhbDogxpIuTWF0cml4NHg0ID0gdGhpcy4jbXR4TG9jYWxCYXNlLmNsb25lO1xyXG4gICAgICAgICAgLy8gY29uc3QgbXR4Um90YXRpb246IMaSLk1hdHJpeDR4NCA9IMaSLk1hdHJpeDR4NC5ST1RBVElPTihxUm90YXRpb24pO1xyXG5cclxuICAgICAgICAgIC8vIC8vIGxvY2FsUm90YXRpb24gPSB3b3JsZEludmVyc2UgKiB3b3JsZFJvdGF0aW9uICogd29ybGRcclxuICAgICAgICAgIC8vIG10eFJvdGF0aW9uLm11bHRpcGx5KMaSLk1hdHJpeDR4NC5JTlZFUlNFKHRoaXMuI210eFdvcmxkQmFzZSksIHRydWUpO1xyXG4gICAgICAgICAgLy8gbXR4Um90YXRpb24ubXVsdGlwbHkodGhpcy4jbXR4V29ybGRCYXNlKTtcclxuXHJcbiAgICAgICAgICAvLyBtdHhMb2NhbC5tdWx0aXBseShtdHhSb3RhdGlvbik7XHJcbiAgICAgICAgICAvLyAvLyByZXN0b3JlIHNjYWxpbmcgZGlyZWN0aW9uc1xyXG4gICAgICAgICAgLy8gbXR4TG9jYWwuc2NhbGluZyA9IG10eExvY2FsLnNjYWxpbmcuYXBwbHkoKF92YWx1ZSwgX2luZGV4LCBfY29tcG9uZW50KSA9PiBfdmFsdWUgKiBNYXRoLnNpZ24odGhpcy4jbXR4TG9jYWxCYXNlLnNjYWxpbmdbX2NvbXBvbmVudF0pKTtcclxuXHJcbiAgICAgICAgICAvLyB0aGlzLiNtdHhMb2NhbC5xdWF0ZXJuaW9uID0gbXR4TG9jYWwucXVhdGVybmlvbjtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzY2FsZVwiOlxyXG4gICAgICAgICAgbGV0IHNjYWxlOiBudW1iZXIgPSB0aGlzLmNhbWVyYS5nZXRXb3JsZFRvUGl4ZWxTY2FsZSh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbik7XHJcbiAgICAgICAgICBsZXQgbGVuZ3RoQXJyb3c6IG51bWJlciA9IHNjYWxlICogODA7IC8vIFRPRE86IHNhdmUgdGhpcyBzb21ld2hlcmVcclxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkID09IFwieHl6XCIpXHJcbiAgICAgICAgICAgIGF4aXMgPSB0aGlzLmNhbWVyYS5tdHhXb3JsZC5nZXRSaWdodCgpLm5lZ2F0ZSgpO1xyXG5cclxuICAgICAgICAgIGxldCBvZmZzZXQ6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlBST0pFQ1RJT04odGhpcy4jdmN0UG9pbnRlckRvd24sIGF4aXMpO1xyXG4gICAgICAgICAgbGV0IGRpcmVjdGlvbjogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuUFJPSkVDVElPTih0aGlzLiN2Y3RQb2ludGVyTW92ZSwgYXhpcyk7XHJcbiAgICAgICAgICBsZXQgc2lnbk9mZnNldDogbnVtYmVyID0gTWF0aC5zaWduKMaSLlZlY3RvcjMuRE9UKGF4aXMsIG9mZnNldCkpO1xyXG4gICAgICAgICAgbGV0IHNpZ25EaXJlY3Rpb246IG51bWJlciA9IE1hdGguc2lnbijGki5WZWN0b3IzLkRPVChheGlzLCBkaXJlY3Rpb24pKTtcclxuXHJcbiAgICAgICAgICBsZXQgZmFjdG9yOiBudW1iZXIgPSAoKChzaWduRGlyZWN0aW9uICogZGlyZWN0aW9uLm1hZ25pdHVkZSkgLSAoc2lnbk9mZnNldCAqIG9mZnNldC5tYWduaXR1ZGUpKSAvIGxlbmd0aEFycm93KSArIDE7XHJcblxyXG4gICAgICAgICAgaWYgKGlzU25hcHBpbmcpXHJcbiAgICAgICAgICAgIGZhY3RvciA9IMaSLkNhbGMuc25hcChmYWN0b3IsIHRoaXMuc25hcFNjYWxlKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBtdHhTY2FsaW5nOiDGki5NYXRyaXg0eDQgPSDGki5NYXRyaXg0eDQuSURFTlRJVFkoKTtcclxuXHJcbiAgICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkIG9mIDwoXCJ4XCIgfCBcInlcIiB8IFwielwiKVtdPjzGki5HZW5lcmFsPnRoaXMuc2VsZWN0ZWQpXHJcbiAgICAgICAgICAgIG10eFNjYWxpbmcuc2NhbGluZ1tzZWxlY3RlZF0gPSBmYWN0b3I7XHJcblxyXG4gICAgICAgICAgbXR4U2NhbGluZy5zY2FsaW5nID0gbXR4U2NhbGluZy5zY2FsaW5nO1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLnNwYWNlID09IFwid29ybGRcIikgeyAvLyByb3RhdGlvbkludmVyc2UgKiBzY2FsaW5nICogcm90YXRpb25cclxuICAgICAgICAgICAgY29uc3Qgcm90YXRpb25JbnZlcnNlOiDGki5RdWF0ZXJuaW9uID0gdGhpcy4jbXR4V29ybGRCYXNlLnF1YXRlcm5pb24uY2xvbmUuaW52ZXJ0KCk7XHJcbiAgICAgICAgICAgIG10eFNjYWxpbmcucm90YXRlKHJvdGF0aW9uSW52ZXJzZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG10eFNjYWxpbmcucm90YXRlKHRoaXMuI210eFdvcmxkQmFzZS5xdWF0ZXJuaW9uKTtcclxuICAgICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmUocm90YXRpb25JbnZlcnNlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBtdHhTY2FsaW5nLm11bHRpcGx5KHRoaXMuI210eExvY2FsLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAvLyByZXN0b3JlIHNjYWxpbmcgZGlyZWN0aW9uc1xyXG4gICAgICAgICAgbXR4U2NhbGluZy5zY2FsaW5nLmFwcGx5KChfdmFsdWUsIF9pbmRleCwgX2NvbXBvbmVudCkgPT4gX3ZhbHVlICogTWF0aC5zaWduKHRoaXMuI210eExvY2FsLnNjYWxpbmdbX2NvbXBvbmVudF0pKTtcclxuXHJcbiAgICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkIG9mIDwoXCJ4XCIgfCBcInlcIiB8IFwielwiKVtdPjzGki5HZW5lcmFsPnRoaXMuc2VsZWN0ZWQpXHJcbiAgICAgICAgICAgIG10eFNjYWxpbmcuc2NhbGluZ1tzZWxlY3RlZF0gKj0gTWF0aC5zaWduKGZhY3Rvcik7XHJcblxyXG4gICAgICAgICAgdGhpcy4jbXR4TG9jYWwuc2NhbGluZyA9IG10eFNjYWxpbmcuc2NhbGluZztcclxuXHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShtdHhTY2FsaW5nKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYXhpcylcclxuICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShheGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLiNtdHhMb2NhbClcclxuICAgICAgICB0aGlzLiNtdHhMb2NhbEJhc2UuY29weSh0aGlzLiNtdHhMb2NhbCk7XHJcbiAgICAgIGlmICh0aGlzLiNtdHhXb3JsZClcclxuICAgICAgICB0aGlzLiNtdHhXb3JsZEJhc2UuY29weSh0aGlzLiNtdHhXb3JsZCk7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkKVxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICBpZiAodGhpcy4jaXNUcmFuc2Zvcm1pbmcpIHtcclxuICAgICAgICB0aGlzLiNpc1RyYW5zZm9ybWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiZW5kVHJhbnNmb3JtXCIsIHsgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy4jc3RhcnRUcmFuc2Zvcm0gPSBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW5kZXJFbmQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIMaSLlJlbmRlci5jbGVhcih1bmRlZmluZWQsIGZhbHNlLCB0cnVlKTsgLy8gY2xlYXIgZGVwdGggYnVmZmVyXHJcbiAgICAgIMaSLkdpem1vcy5kcmF3KFt0aGlzXSwgdGhpcy52aWV3cG9ydC5jYW1lcmEpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGRyYXdDaXJjbGUoX3RvcnVzOiDGki5NZXNoVG9ydXMsIF9jb2xvcjogxpIuQ29sb3IsIF9kaXJlY3Rpb246IMaSLlZlY3RvcjMsIF91cDogxpIuVmVjdG9yMywgX3dvcmxkMlBpeGVsOiBudW1iZXIsIF9hbHBoYU9jY2x1ZGVkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgY29uc3QgbXR4V29ybGQ6IMaSLk1hdHJpeDR4NCA9IMaSLk1hdHJpeDR4NC5DT01QT1NJVElPTih0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbik7XHJcbiAgICAgIG10eFdvcmxkLnNjYWxpbmcuc2V0KF93b3JsZDJQaXhlbCwgX3dvcmxkMlBpeGVsLCBfd29ybGQyUGl4ZWwpO1xyXG4gICAgICBtdHhXb3JsZC5zY2FsaW5nID0gbXR4V29ybGQuc2NhbGluZztcclxuICAgICAgbXR4V29ybGQubG9va0luKF9kaXJlY3Rpb24sIF91cCk7IC8vIGxvb2tJbiBvcmllbnRhdGVzIHRoZSB6LWF4aXMgYnV0IHRoZSB0b3J1c2UgbGF5cyBvbiB0aGUgeHotcGxhbmUgKGZhY2luZyBpbiB5LWRpcmVjdGlvbiksXHJcbiAgICAgIG10eFdvcmxkLnJvdGF0ZVgoOTApOyAgICAgICAgICAgICAvLyB0aHVzIHdlIHJvdGF0ZSB0aGUgdG9ydXMgc28gdGhlIGNpcmNsZSBmYWNlcyBpbiBfZGlyZWN0aW9uXHJcbiAgICAgIMaSLkdpem1vcy5kcmF3TWVzaChfdG9ydXMsIG10eFdvcmxkLCBfY29sb3IsIF9hbHBoYU9jY2x1ZGVkKTtcclxuICAgICAgxpIuUmVjeWNsZXIuc3RvcmUobXR4V29ybGQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UG9pbnQzRChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IMaSLlZlY3RvcjMge1xyXG4gICAgICBjb25zdCBwb2ludDJEOiDGki5WZWN0b3IyID0gxpIuUmVjeWNsZXIucmV1c2UoxpIuVmVjdG9yMikuc2V0KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgIGNvbnN0IHJheTogxpIuUmF5ID0gdGhpcy52aWV3cG9ydC5nZXRSYXlGcm9tQ2xpZW50KHBvaW50MkQpO1xyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShwb2ludDJEKTtcclxuXHJcbiAgICAgIHJldHVybiByYXkuaW50ZXJzZWN0UGxhbmUodGhpcy4jbXR4V29ybGRCYXNlLnRyYW5zbGF0aW9uLCB0aGlzLiNub3JtYWxDb2xsaXNpb25QbGFuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRBeGlzKF9heGlzOiBcInhcIiB8IFwieVwiIHwgXCJ6XCIpOiDGki5WZWN0b3IzIHtcclxuICAgICAgaWYgKHRoaXMuc3BhY2UgPT0gXCJ3b3JsZFwiKSB7XHJcbiAgICAgICAgc3dpdGNoIChfYXhpcykge1xyXG4gICAgICAgICAgY2FzZSBcInhcIjogcmV0dXJuIMaSLlZlY3RvcjMuWCgpO1xyXG4gICAgICAgICAgY2FzZSBcInlcIjogcmV0dXJuIMaSLlZlY3RvcjMuWSgpO1xyXG4gICAgICAgICAgY2FzZSBcInpcIjogcmV0dXJuIMaSLlZlY3RvcjMuWigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzd2l0Y2ggKF9heGlzKSB7XHJcbiAgICAgICAgICBjYXNlIFwieFwiOiByZXR1cm4gdGhpcy4jbXR4V29ybGRCYXNlLmdldFJpZ2h0KCk7XHJcbiAgICAgICAgICBjYXNlIFwieVwiOiByZXR1cm4gdGhpcy4jbXR4V29ybGRCYXNlLmdldFVwKCk7XHJcbiAgICAgICAgICBjYXNlIFwielwiOiByZXR1cm4gdGhpcy4jbXR4V29ybGRCYXNlLmdldEZvcndhcmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIFZpZXdwb3J0IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlKF9icmFuY2g6IMaSLk5vZGUpOiDGki5WaWV3cG9ydCB7XHJcbiAgICAgIGxldCBjbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSA9IG5ldyDGki5Db21wb25lbnRDYW1lcmEoKTtcclxuICAgICAgY21wQ2FtZXJhLm10eFBpdm90LnRyYW5zbGF0ZSjGki5WZWN0b3IzLlooNCkpO1xyXG4gICAgICBjbXBDYW1lcmEubXR4UGl2b3Qucm90YXRlWSgxODApO1xyXG5cclxuICAgICAgbGV0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBDYW52YXMuY3JlYXRlKCk7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuXHJcbiAgICAgIGxldCB2aWV3cG9ydDogxpIuVmlld3BvcnQgPSBuZXcgxpIuVmlld3BvcnQoKTtcclxuICAgICAgdmlld3BvcnQuaW5pdGlhbGl6ZShcIsaSQWlkLVZpZXdwb3J0XCIsIF9icmFuY2gsIGNtcENhbWVyYSwgY2FudmFzKTtcclxuICAgICAgcmV0dXJuIHZpZXdwb3J0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZXhwYW5kQ2FtZXJhVG9JbnRlcmFjdGl2ZU9yYml0KF92aWV3cG9ydDogxpIuVmlld3BvcnQsIF9zaG93Rm9jdXM6IGJvb2xlYW4gPSB0cnVlLCBfc3BlZWRDYW1lcmFSb3RhdGlvbjogbnVtYmVyID0gMSwgX3NwZWVkQ2FtZXJhVHJhbnNsYXRpb246IG51bWJlciA9IDAuMDEsIF9zcGVlZENhbWVyYURpc3RhbmNlOiBudW1iZXIgPSAwLjAwMSwgX3JlZHJhdzogKCkgPT4gdm9pZCA9ICgpID0+IF92aWV3cG9ydC5kcmF3KCksIF90cmFuc2xhdGVPblBpY2s6ICgpID0+IGJvb2xlYW4gPSAoKSA9PiB0cnVlKTogQ2FtZXJhT3JiaXQge1xyXG4gICAgICAvLyBfdmlld3BvcnQuc2V0Rm9jdXModHJ1ZSk7XHJcbiAgICAgIC8vIF92aWV3cG9ydC5hY3RpdmF0ZVBvaW50ZXJFdmVudCjGki5FVkVOVF9QT0lOVEVSLkRPV04sIHRydWUpO1xyXG4gICAgICAvLyBfdmlld3BvcnQuYWN0aXZhdGVQb2ludGVyRXZlbnQoxpIuRVZFTlRfUE9JTlRFUi5VUCwgdHJ1ZSk7XHJcbiAgICAgIC8vIF92aWV3cG9ydC5hY3RpdmF0ZVBvaW50ZXJFdmVudCjGki5FVkVOVF9QT0lOVEVSLk1PVkUsIHRydWUpO1xyXG4gICAgICAvLyBfdmlld3BvcnQuYWN0aXZhdGVXaGVlbEV2ZW50KMaSLkVWRU5UX1dIRUVMLldIRUVMLCB0cnVlKTtcclxuICAgICAgX3ZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIGhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIF92aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIGhuZFBvaW50ZXJEb3duKTtcclxuICAgICAgX3ZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgaG5kUG9pbnRlck1vdmUpO1xyXG4gICAgICBfdmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybGVhdmVcIiwgaG5kUG9pbnRlclVwKTtcclxuICAgICAgX3ZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmNhbmNlbFwiLCBobmRQb2ludGVyVXApO1xyXG4gICAgICBfdmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJ3aGVlbFwiLCBobmRXaGVlbE1vdmUpO1xyXG5cclxuICAgICAgY29uc3QgZmFjdG9yUGFuOiBudW1iZXIgPSAxIC8gNTAwO1xyXG4gICAgICBjb25zdCBmYWN0b3JGbHk6IG51bWJlciA9IDEgLyAyMDtcclxuICAgICAgY29uc3QgZmFjdG9yWm9vbTogbnVtYmVyID0gMSAvIDM7XHJcbiAgICAgIGNvbnN0IGZhY3Rvclpvb21Ub3VjaDogbnVtYmVyID0gMi41O1xyXG5cclxuICAgICAgY29uc3QgZG91YmxlVGFwVGhyZXNob2xkID0geyB0aW1lOiAzMDAsIGRpc3RhbmNlOiAzMCAqKiAyIH07IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgY29uc3QgcGluY2hUaHJlc2hvbGQ6IG51bWJlciA9IDcwOyAvLyBtYXggaG9yaXpvbnRhbCBkaXN0YW5jZSBiZXR3ZWVuIHR3byB0b3VjaGVzIHRvIGJlIHJlY29nbml6ZWQgYXMgcGluY2hcclxuXHJcbiAgICAgIGxldCBmbHlTcGVlZDogbnVtYmVyID0gMC4zO1xyXG4gICAgICBsZXQgZmx5QWNjZWxlcmF0ZWQ6IG51bWJlciA9IDEwO1xyXG4gICAgICBsZXQgdGltZXI6IMaSLlRpbWVyID0gbmV3IMaSLlRpbWVyKMaSLlRpbWUuZ2FtZSwgMjAsIDAsIGhuZFRpbWVyKTtcclxuICAgICAgbGV0IGNudEZseTogxpIuQ29udHJvbCA9IG5ldyDGki5Db250cm9sKFwiRmx5XCIsIGZseVNwZWVkKTtcclxuICAgICAgY250Rmx5LnNldERlbGF5KDUwMCk7XHJcbiAgICAgIGxldCBmbHlpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgxpIuRGVidWcuZnVkZ2UoXCJGdWRnZUFpZCB2aWV3cG9ydCB0aW1lcjogXCIgKyB0aW1lcik7XHJcblxyXG4gICAgICBsZXQgdG91Y2hTdGF0ZTogXCJvcmJpdFwiIHwgXCJmbHlcIiB8IFwiem9vbVwiO1xyXG5cclxuICAgICAgbGV0IGNudE1vdXNlSG9yaXpvbnRhbDogxpIuQ29udHJvbCA9IG5ldyDGki5Db250cm9sKFwiTW91c2VIb3Jpem9udGFsXCIsIC0xKTtcclxuICAgICAgbGV0IGNudE1vdXNlVmVydGljYWw6IMaSLkNvbnRyb2wgPSBuZXcgxpIuQ29udHJvbChcIk1vdXNlVmVydGljYWxcIiwgLTEpO1xyXG5cclxuICAgICAgLy8gY2FtZXJhIHNldHVwXHJcbiAgICAgIGxldCBjYW1lcmE6IENhbWVyYU9yYml0TW92aW5nRm9jdXM7XHJcbiAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmFPcmJpdE1vdmluZ0ZvY3VzKF92aWV3cG9ydC5jYW1lcmEsIDUsIDg1LCAwLjAxLCAxMDAwKTtcclxuICAgICAgLy9UT0RPOiByZW1vdmUgdGhlIGZvbGxvd2luZyBsaW5lLCBjYW1lcmEgbXVzdCBub3QgYmUgbWFuaXB1bGF0ZWQgYnV0IHNob3VsZCBhbHJlYWR5IGJlIHNldCB1cCB3aGVuIGNhbGxpbmcgdGhpcyBtZXRob2RcclxuICAgICAgX3ZpZXdwb3J0LmNhbWVyYS5wcm9qZWN0Q2VudHJhbChfdmlld3BvcnQuY2FtZXJhLmdldEFzcGVjdCgpLCBfdmlld3BvcnQuY2FtZXJhLmdldEZpZWxkT2ZWaWV3KCksIF92aWV3cG9ydC5jYW1lcmEuZ2V0RGlyZWN0aW9uKCksIDAuMDEsIDEwMDApO1xyXG5cclxuICAgICAgLy8geXNldCB1cCBheGlzIHRvIGNvbnRyb2xcclxuICAgICAgY2FtZXJhLmF4aXNSb3RhdGVYLmFkZENvbnRyb2woY250TW91c2VWZXJ0aWNhbCk7XHJcbiAgICAgIGNhbWVyYS5heGlzUm90YXRlWC5zZXRGYWN0b3IoX3NwZWVkQ2FtZXJhUm90YXRpb24pO1xyXG5cclxuICAgICAgY2FtZXJhLmF4aXNSb3RhdGVZLmFkZENvbnRyb2woY250TW91c2VIb3Jpem9udGFsKTtcclxuICAgICAgY2FtZXJhLmF4aXNSb3RhdGVZLnNldEZhY3Rvcihfc3BlZWRDYW1lcmFSb3RhdGlvbik7XHJcbiAgICAgIC8vIF92aWV3cG9ydC5nZXRCcmFuY2goKS5hZGRDaGlsZChjYW1lcmEpO1xyXG5cclxuICAgICAgbGV0IGZvY3VzOiDGki5Ob2RlO1xyXG4gICAgICBpZiAoX3Nob3dGb2N1cykge1xyXG4gICAgICAgIGZvY3VzID0gbmV3IE5vZGVDb29yZGluYXRlU3lzdGVtKFwiRm9jdXNcIik7XHJcbiAgICAgICAgZm9jdXMuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRUcmFuc2Zvcm0oKSk7XHJcbiAgICAgICAgX3ZpZXdwb3J0LmdldEJyYW5jaCgpLmFkZENoaWxkKGZvY3VzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgYWN0aXZlUG9pbnRlcnM6IE1hcDxudW1iZXIsIFBvaW50ZXJFdmVudD4gPSBuZXcgTWFwKCk7XHJcbiAgICAgIGxldCBwcmV2UG9pbnRlcjogUG9pbnRlckV2ZW50O1xyXG4gICAgICBsZXQgcHJldkRpc3RhbmNlOiBudW1iZXI7XHJcblxyXG4gICAgICByZWRyYXcoKTtcclxuICAgICAgcmV0dXJuIGNhbWVyYTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhuZFBvaW50ZXJNb3ZlKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFfZXZlbnQuYnV0dG9ucylcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgYWN0aXZlUG9pbnRlcnMuc2V0KF9ldmVudC5wb2ludGVySWQsIF9ldmVudCk7XHJcblxyXG4gICAgICAgIGxldCBwb3NDYW1lcmE6IMaSLlZlY3RvcjMgPSBjYW1lcmEubm9kZUNhbWVyYS5tdHhXb3JsZC50cmFuc2xhdGlvbi5jbG9uZTtcclxuXHJcbiAgICAgICAgLy8gb3JiaXRcclxuICAgICAgICBpZiAoKF9ldmVudC5idXR0b25zID09IDQgJiYgIShfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQuYWx0S2V5IHx8IF9ldmVudC5zaGlmdEtleSkpIHx8IChfZXZlbnQuYnV0dG9ucyA9PSAxICYmIF9ldmVudC5hbHRLZXkpIHx8IHRvdWNoU3RhdGUgPT0gXCJvcmJpdFwiKSB7XHJcbiAgICAgICAgICBjbnRNb3VzZUhvcml6b250YWwuc2V0SW5wdXQoX2V2ZW50Lm1vdmVtZW50WCk7XHJcbiAgICAgICAgICBjbnRNb3VzZVZlcnRpY2FsLnNldElucHV0KF9ldmVudC5tb3ZlbWVudFkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmx5XHJcbiAgICAgICAgaWYgKChfZXZlbnQuYnV0dG9ucyA9PSAyICYmICFfZXZlbnQuYWx0S2V5KSB8fCB0b3VjaFN0YXRlID09IFwiZmx5XCIpIHtcclxuICAgICAgICAgIGNudE1vdXNlSG9yaXpvbnRhbC5zZXRJbnB1dChfZXZlbnQubW92ZW1lbnRYICogZmFjdG9yRmx5KTtcclxuICAgICAgICAgIGNudE1vdXNlVmVydGljYWwuc2V0SW5wdXQoX2V2ZW50Lm1vdmVtZW50WSAqIGZhY3RvckZseSk7XHJcbiAgICAgICAgICDGki5SZW5kZXIucHJlcGFyZShjYW1lcmEpO1xyXG4gICAgICAgICAgbGV0IG9mZnNldDogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuRElGRkVSRU5DRShwb3NDYW1lcmEsIGNhbWVyYS5ub2RlQ2FtZXJhLm10eFdvcmxkLnRyYW5zbGF0aW9uKTtcclxuICAgICAgICAgIGNhbWVyYS5tdHhMb2NhbC50cmFuc2xhdGUob2Zmc2V0LCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB6b29tXHJcbiAgICAgICAgaWYgKChfZXZlbnQuYnV0dG9ucyA9PSA0ICYmIF9ldmVudC5jdHJsS2V5KSB8fCAoX2V2ZW50LmJ1dHRvbnMgPT0gMiAmJiBfZXZlbnQuYWx0S2V5KSlcclxuICAgICAgICAgIHpvb20oX2V2ZW50Lm1vdmVtZW50WCAqIGZhY3Rvclpvb20pO1xyXG5cclxuICAgICAgICAvLyBwaW5jaCB6b29tXHJcbiAgICAgICAgaWYgKHRvdWNoU3RhdGUgPT0gXCJ6b29tXCIpIHtcclxuICAgICAgICAgIGNvbnN0IGl0ZXJhdG9yOiBJdGVyYWJsZUl0ZXJhdG9yPFBvaW50ZXJFdmVudD4gPSBhY3RpdmVQb2ludGVycy52YWx1ZXMoKTtcclxuICAgICAgICAgIGNvbnN0IGRpc3RhbmNlOiBudW1iZXIgPSBNYXRoLmFicyhpdGVyYXRvci5uZXh0KCkudmFsdWUub2Zmc2V0WSAtIGl0ZXJhdG9yLm5leHQoKS52YWx1ZS5vZmZzZXRZKTtcclxuICAgICAgICAgIGlmIChwcmV2RGlzdGFuY2UpXHJcbiAgICAgICAgICAgIHpvb20oKHByZXZEaXN0YW5jZSAtIGRpc3RhbmNlKSAqIGZhY3Rvclpvb21Ub3VjaCk7XHJcblxyXG4gICAgICAgICAgcHJldkRpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBwYW4gXHJcbiAgICAgICAgaWYgKF9ldmVudC5idXR0b25zID09IDQgJiYgKF9ldmVudC5hbHRLZXkgfHwgX2V2ZW50LnNoaWZ0S2V5KSkge1xyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVgoLV9ldmVudC5tb3ZlbWVudFggKiBjYW1lcmEuZGlzdGFuY2UgKiBmYWN0b3JQYW4pO1xyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVkoX2V2ZW50Lm1vdmVtZW50WSAqIGNhbWVyYS5kaXN0YW5jZSAqIGZhY3RvclBhbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWRyYXcoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaG5kVGltZXIoX2V2ZW50OiDGki5FdmVudFRpbWVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFmbHlpbmcpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY250Rmx5LnNldEZhY3RvcijGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuU0hJRlRfTEVGVF0pID8gZmx5QWNjZWxlcmF0ZWQgOiBmbHlTcGVlZCk7XHJcbiAgICAgICAgY250Rmx5LnNldElucHV0KMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5XLCDGki5LRVlCT0FSRF9DT0RFLkEsIMaSLktFWUJPQVJEX0NPREUuUywgxpIuS0VZQk9BUkRfQ09ERS5ELCDGki5LRVlCT0FSRF9DT0RFLlEsIMaSLktFWUJPQVJEX0NPREUuRV0pID8gMSA6IDApO1xyXG5cclxuICAgICAgICBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlddKSlcclxuICAgICAgICAgIGNhbWVyYS50cmFuc2xhdGVaKC1jbnRGbHkuZ2V0T3V0cHV0KCkpO1xyXG4gICAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5TXSkpXHJcbiAgICAgICAgICBjYW1lcmEudHJhbnNsYXRlWihjbnRGbHkuZ2V0T3V0cHV0KCkpO1xyXG4gICAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5BXSkpXHJcbiAgICAgICAgICBjYW1lcmEudHJhbnNsYXRlWCgtY250Rmx5LmdldE91dHB1dCgpKTtcclxuICAgICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuRF0pKVxyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVgoY250Rmx5LmdldE91dHB1dCgpKTtcclxuICAgICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuUV0pKVxyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVkoLWNudEZseS5nZXRPdXRwdXQoKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLkVdKSlcclxuICAgICAgICAgIGNhbWVyYS50cmFuc2xhdGVZKGNudEZseS5nZXRPdXRwdXQoKSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHJlZHJhdygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBobmRQb2ludGVyRG93bihfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGFjdGl2ZVBvaW50ZXJzLnNldChfZXZlbnQucG9pbnRlcklkLCBfZXZlbnQpO1xyXG5cclxuICAgICAgICBmbHlpbmcgPSAoX2V2ZW50LmJ1dHRvbnMgPT0gMiAmJiAhX2V2ZW50LmFsdEtleSk7XHJcblxyXG4gICAgICAgIGlmIChfZXZlbnQucG9pbnRlclR5cGUgPT0gXCJ0b3VjaFwiKSB7XHJcbiAgICAgICAgICB0b3VjaFN0YXRlID0gXCJvcmJpdFwiO1xyXG5cclxuICAgICAgICAgIGlmIChhY3RpdmVQb2ludGVycy5zaXplID09IDIpIHtcclxuICAgICAgICAgICAgY29uc3QgaXRlcmF0b3I6IEl0ZXJhYmxlSXRlcmF0b3I8UG9pbnRlckV2ZW50PiA9IGFjdGl2ZVBvaW50ZXJzLnZhbHVlcygpO1xyXG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZTogbnVtYmVyID0gTWF0aC5hYnMoaXRlcmF0b3IubmV4dCgpLnZhbHVlLm9mZnNldFggLSBpdGVyYXRvci5uZXh0KCkudmFsdWUub2Zmc2V0WCk7XHJcbiAgICAgICAgICAgIHRvdWNoU3RhdGUgPSBkaXN0YW5jZSA8IHBpbmNoVGhyZXNob2xkID8gXCJ6b29tXCIgOiBcImZseVwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZG91YmxlVGFwOiBib29sZWFuID0gYWN0aXZlUG9pbnRlcnMuc2l6ZSA9PSAxICYmXHJcbiAgICAgICAgICAoX2V2ZW50LnRpbWVTdGFtcCAtIChwcmV2UG9pbnRlcj8udGltZVN0YW1wID8/IDApIDwgZG91YmxlVGFwVGhyZXNob2xkLnRpbWUpICYmXHJcbiAgICAgICAgICAocHJldlBvaW50ZXI/Lm9mZnNldFggLSBfZXZlbnQub2Zmc2V0WCB8fCAwKSAqKiAyICsgKHByZXZQb2ludGVyPy5vZmZzZXRZIC0gX2V2ZW50Lm9mZnNldFkgfHwgMCkgKiogMiA8IGRvdWJsZVRhcFRocmVzaG9sZC5kaXN0YW5jZTtcclxuXHJcbiAgICAgICAgcHJldlBvaW50ZXIgPSBkb3VibGVUYXAgPyBudWxsIDogX2V2ZW50O1xyXG5cclxuICAgICAgICBpZiAoX2V2ZW50LmJ1dHRvbiAhPSAwIHx8IF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5hbHRLZXkgfHwgX2V2ZW50LnNoaWZ0S2V5IHx8IChfZXZlbnQucG9pbnRlclR5cGUgPT0gXCJ0b3VjaFwiICYmICFkb3VibGVUYXApKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0b3VjaFN0YXRlID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IHBvczogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgbGV0IHBpY2tzOiDGki5QaWNrW10gPSDGki5QaWNrZXIucGlja1ZpZXdwb3J0KF92aWV3cG9ydCwgcG9zKTtcclxuICAgICAgICBpZiAocGlja3MubGVuZ3RoID09IDApXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gcGlja3Muc29ydCgoX2E6IMaSLlBpY2ssIF9iOiDGki5QaWNrKSA9PiAoX2EuekJ1ZmZlciA8IF9iLnpCdWZmZXIgJiYgX2EuZ2l6bW8pID8gLTEgOiAxKTtcclxuICAgICAgICBwaWNrcy5zb3J0KChfYSwgX2IpID0+IHtcclxuICAgICAgICAgIGlmIChfYS5naXptbyAmJiAhX2IuZ2l6bW8pXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgIGlmICghX2EuZ2l6bW8gJiYgX2IuZ2l6bW8pXHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgLy8gSWYgYm90aCBwaWNrcyBoYXZlIGEgZ2l6bW8gcHJvcGVydHkgb3IgaWYgbmVpdGhlciBkb2VzLCBwcmlvcml0aXplIGJhc2VkIG9uIHpCdWZmZXIgdmFsdWVcclxuICAgICAgICAgIHJldHVybiBfYS56QnVmZmVyIC0gX2IuekJ1ZmZlcjtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbGV0IHBvc0NhbWVyYTogxpIuVmVjdG9yMyA9IGNhbWVyYS5ub2RlQ2FtZXJhLm10eFdvcmxkLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgIC8vIGNhbWVyYS5tdHhMb2NhbC50cmFuc2xhdGlvbiA9IHBpY2tzWzBdLnBvc1dvcmxkO1xyXG4gICAgICAgIC8vIC8vIMaSLlJlbmRlci5wcmVwYXJlKGNhbWVyYSk7XHJcbiAgICAgICAgLy8gY2FtZXJhLnBvc2l0aW9uQ2FtZXJhKHBvc0NhbWVyYSk7XHJcbiAgICAgICAgLy8gaWYgKCEocGlja3NbMF0uZ2l6bW8gaW5zdGFuY2VvZiBDb21wb25lbnRUcmFuc2xhdG9yKSlcclxuICAgICAgICBpZiAoX3RyYW5zbGF0ZU9uUGljaygpKVxyXG4gICAgICAgICAgY2FtZXJhLm10eExvY2FsLnRyYW5zbGF0aW9uID0gcGlja3NbMF0ucG9zV29ybGQ7XHJcbiAgICAgICAgcmVkcmF3KCk7XHJcblxyXG4gICAgICAgIF92aWV3cG9ydC5jYW52YXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJwaWNrXCIsIHsgZGV0YWlsOiBwaWNrc1swXSwgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhuZFBvaW50ZXJVcChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGFjdGl2ZVBvaW50ZXJzLmRlbGV0ZShfZXZlbnQucG9pbnRlcklkKTtcclxuICAgICAgICBpZiAoYWN0aXZlUG9pbnRlcnMuc2l6ZSA8IDIpXHJcbiAgICAgICAgICBwcmV2RGlzdGFuY2UgPSAwO1xyXG5cclxuICAgICAgICB0b3VjaFN0YXRlID0gbnVsbDtcclxuICAgICAgICBmbHlpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaG5kV2hlZWxNb3ZlKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIHpvb20oX2V2ZW50LmRlbHRhWSk7XHJcbiAgICAgICAgcmVkcmF3KCk7XHJcbiAgICAgIH1cclxuICAgICAgZnVuY3Rpb24gem9vbShfZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNhbWVyYS5kaXN0YW5jZSAqPSAxICsgX2RlbHRhICogX3NwZWVkQ2FtZXJhRGlzdGFuY2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlZHJhdygpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm9jdXMpXHJcbiAgICAgICAgICBmb2N1cy5tdHhMb2NhbC50cmFuc2xhdGlvbiA9IGNhbWVyYS5tdHhMb2NhbC50cmFuc2xhdGlvbjtcclxuICAgICAgICDGki5SZW5kZXIucHJlcGFyZShjYW1lcmEpO1xyXG4gICAgICAgIF9yZWRyYXcoKTtcclxuICAgICAgICAvLyBfdmlld3BvcnQuZHJhdygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59Il19