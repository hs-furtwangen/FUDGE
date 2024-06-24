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
        /** The left border of the interval found */
        left;
        /** The right border of the interval found */
        right;
        /** The function value at the left border of the interval found */
        leftValue;
        /** The function value at the right border of the interval found */
        rightValue;
        function;
        divide;
        isSmaller;
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
        axisRotateX = new ƒ.Axis("RotateX", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
        axisRotateY = new ƒ.Axis("RotateY", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
        axisDistance = new ƒ.Axis("Distance", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
        minDistance;
        maxDistance;
        translator;
        rotatorX;
        maxRotX;
        constructor(_cmpCamera, _distanceStart = 2, _maxRotX = 75, _minDistance = 1, _maxDistance = 10) {
            super("CameraOrbit");
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
        hndAxisOutput = (_event) => {
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
    }
    FudgeAid.CameraOrbit = CameraOrbit;
})(FudgeAid || (FudgeAid = {}));
var FudgeAid;
(function (FudgeAid) {
    var ƒ = FudgeCore;
    class CameraOrbitMovingFocus extends FudgeAid.CameraOrbit {
        axisTranslateX = new ƒ.Axis("TranslateX", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
        axisTranslateY = new ƒ.Axis("TranslateY", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
        axisTranslateZ = new ƒ.Axis("TranslateZ", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
        constructor(_cmpCamera, _distanceStart = 5, _maxRotX = 85, _minDistance = 0, _maxDistance = Infinity) {
            super(_cmpCamera, _distanceStart, _maxRotX, _minDistance, _maxDistance);
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
        hndAxisOutput = (_event) => {
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
        static count = 0;
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
        static internalResources = NodeArrow.createInternalResources();
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
        static mesh = NodeSprite.createInternalResource();
        framerate = 12; // animation frames per second, single frames can be shorter or longer based on their timescale
        cmpMesh;
        cmpMaterial;
        animation;
        frameCurrent = 0;
        direction = 1;
        timer;
        constructor(_name) {
            super(_name);
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
         * Show the next frame of the sequence or start anew when the end or the start was reached, according to the direction of playing
         */
        showFrameNext = (_event) => {
            this.frameCurrent = (this.frameCurrent + this.direction + this.animation.frames.length) % this.animation.frames.length;
            this.showFrame(this.frameCurrent);
        };
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
        rectTexture;
        mtxPivot;
        mtxTexture;
        timeScale;
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
        frames = [];
        name;
        spritesheet;
        constructor(_name, _spritesheet) {
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
        stateCurrent;
        stateNext;
        instructions;
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
        stateCurrent;
        stateNext;
        instructions;
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
        viewport;
        mode = "translate";
        space = "world";
        selected;
        snapAngle = 15; // 15 degree
        snapDistance = 0.1; // 0.1 units
        snapScale = 0.1; // 10%
        #undo = []; // stack of functions to undo the last transformation
        #mtxLocal; // local matrix of the object to be transformed
        #mtxWorld; // world matrix of the object to be transformed
        #mtxLocalBase = ƒ.Matrix4x4.IDENTITY(); // local matrix in a state before a transformation starts
        #mtxWorldBase = ƒ.Matrix4x4.IDENTITY(); // world matrix in a state before a transformation starts
        #offset = ƒ.Vector3.ZERO(); // offest vector pointing from the world position of the object to where the mouse ray collided with the plane on pointer down
        #direction = ƒ.Vector3.ZERO(); // driection vector pointing from the world position of the object to where the mouse ray collides with the plane (pointer move)
        #scaleFactor; // current scale factor of the scaling transformation
        #isTransforming = false;
        #axes = {
            x: () => this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorldBase.right,
            y: () => this.space == "world" ? ƒ.Vector3.Y() : this.#mtxWorldBase.up,
            z: () => this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorldBase.forward
        };
        #normals = {
            x: () => this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorldBase.forward,
            y: () => this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorldBase.right,
            z: () => this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorldBase.right
        };
        #normal = ƒ.Vector3.ZERO();
        #colors = {
            x: ƒ.Color.CSS("red"),
            y: ƒ.Color.CSS("limegreen"),
            z: ƒ.Color.CSS("blue"),
            origin: ƒ.Color.CSS("dimgray", 0.75),
            xyz: ƒ.Color.CSS("gainsboro")
        };
        #colorsLite = {
            x: ƒ.Color.CSS("salmon"),
            y: ƒ.Color.CSS("lightgreen"),
            z: ƒ.Color.CSS("cornflowerblue"),
            xyz: ƒ.Color.CSS("ghostwhite")
        };
        #torus;
        #torusPick;
        constructor(_viewport) {
            this.viewport = _viewport;
            this.addListeners();
            this.#torus = new ƒ.MeshTorus("Torus", 0.5 - 0.0005, 0.005, 60, 8);
            this.#torusPick = new ƒ.MeshTorus("TorusPick", 0.5 - 0.003, 0.03, 60, 8);
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
         * Add pointer event listeners to the viewport canvas
         */
        addListeners = () => {
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
        removeListeners = () => {
            this.viewport.canvas.removeEventListener("pointerdown", this.hndPointerDown);
            this.viewport.canvas.removeEventListener("pointermove", this.hndPointerMove);
            this.viewport.canvas.removeEventListener("pointerup", this.hndPointerUp);
            this.viewport.canvas.removeEventListener("pointerleave", this.hndPointerUp);
            this.viewport.canvas.removeEventListener("pointercancel", this.hndPointerUp);
            this.viewport.removeEventListener("renderEnd" /* ƒ.EVENT.RENDER_END */, this.hndRenderEnd);
        };
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
        drawGizmos(_cmpCamera) {
            if (!this.#mtxLocal || !this.#mtxWorld)
                return;
            const isPicking = _cmpCamera != this.camera; // if the camera is not the viewports, it must be the picking camera
            let scale = _cmpCamera.getWorldToPixelScale(this.#mtxWorld.translation);
            let widthArrow = scale * (isPicking ? 10 : 1); // 10 or 1 pixel wide;
            let lengthArrow;
            let sizeHead;
            if (this.#isTransforming) {
                const mtx = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
                const line = [] = [ƒ.Vector3.Z(-1000), ƒ.Vector3.Z(1000)];
                for (const selected of this.selected)
                    ƒ.Gizmos.drawLines(line, mtx.lookIn(this.#axes[selected](), this.#normals[selected]()), this.#colorsLite[selected], 1);
                ƒ.Recycler.storeMultiple(mtx, line[0], line[1]);
            }
            let clrX = this.selected == "x" && !this.#isTransforming ? this.#colorsLite.x : this.#colors.x;
            let clrY = this.selected == "y" && !this.#isTransforming ? this.#colorsLite.y : this.#colors.y;
            let clrZ = this.selected == "z" && !this.#isTransforming ? this.#colorsLite.z : this.#colors.z;
            switch (this.mode) {
                case "translate":
                    lengthArrow = scale * (isPicking ? 90 : 80); // 80 pixels long
                    sizeHead = scale * 12; // 12 pixels wide
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrX, this.#axes.x(), this.#normals.x(), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrY, this.#axes.y(), this.#normals.y(), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrZ, this.#axes.z(), this.#normals.z(), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                    if (this.#isTransforming && (this.selected == "x" || this.selected == "y" || this.selected == "z")) {
                        let scaleOrigin = _cmpCamera.getWorldToPixelScale(this.#mtxWorldBase.translation);
                        ƒ.Gizmos.drawArrow(this.#mtxWorldBase.translation, this.#colors.origin, this.#axes[this.selected](), this.#normals[this.selected](), scaleOrigin * 80, scaleOrigin * 1, scaleOrigin * 12, ƒ.MeshPyramid, 1);
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, ƒ.Color.CSS("magenta"), this.#normal, this.#axes[this.selected](), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                    }
                    break;
                case "rotate":
                    let radius = scale * 80; // 80 pixels radius
                    sizeHead = scale * 12;
                    if (this.#isTransforming && (this.selected == "x" || this.selected == "y" || this.selected == "z")) {
                        this.drawCircle(this.#torus, this.#colors[this.selected], this.#axes[this.selected](), this.#normals[this.selected](), radius, 1);
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors.origin, this.#offset, this.#axes[this.selected](), radius, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                        // ƒ.Gizmos.drawArrow(this.mtxWorld.translation, this.colorsLight[this.selected], this.move, this.axes[this.selected], this.move.magnitude, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors[this.selected], this.#direction, this.#axes[this.selected](), radius, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                        break;
                    }
                    // draw an invisible quad to occlude the tori
                    const mtxQuad = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
                    const direction = _cmpCamera.mtxWorld.forward.negate();
                    mtxQuad.scaling = ƒ.Vector3.ONE(radius * 2);
                    mtxQuad.lookIn(direction);
                    ƒ.Render.setDepthFunction(ƒ.DEPTH_FUNCTION.ALWAYS);
                    ƒ.Render.setColorWriteMask(false, false, false, false);
                    ƒ.Gizmos.drawQuad(mtxQuad, this.#colors.origin); // color doesn't matter
                    ƒ.Render.setColorWriteMask(true, true, true, true);
                    ƒ.Render.setDepthFunction(ƒ.DEPTH_FUNCTION.LESS);
                    // draw the tori
                    let torus = isPicking ? this.#torusPick : this.#torus;
                    this.drawCircle(torus, clrX, this.#axes.x(), this.#normals.x(), radius, 0);
                    this.drawCircle(torus, clrY, this.#axes.y(), this.#normals.y(), radius, 0);
                    this.drawCircle(torus, clrZ, this.#axes.z(), this.#normals.z(), radius, 0);
                    ƒ.Recycler.storeMultiple(mtxQuad, direction);
                    break;
                case "scale":
                    lengthArrow = scale * (isPicking ? 84 : 74);
                    sizeHead = scale * 6;
                    if (this.#isTransforming) {
                        // ƒ.Gizmos.drawArrow(this.mtxWorld.translation, this.colorsLight[this.selected], this.direction, this.normals[this.selected], this.direction.magnitude, widthArrow, sizeHead, ƒ.MeshCube, 1);
                        for (const selected of this.selected) {
                            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors[selected], this.#axes[selected](), this.#normals[selected](), lengthArrow * this.#scaleFactor, widthArrow, sizeHead, ƒ.MeshCube, 1);
                            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors.origin, this.#axes[selected](), this.#normals[selected](), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
                        }
                        break;
                    }
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrX, this.#axes.x(), this.#normals.x(), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrY, this.#axes.y(), this.#normals.y(), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrZ, this.#axes.z(), this.#normals.z(), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
                    const mtxCube = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
                    mtxCube.scaling = ƒ.Vector3.ONE((isPicking ? 20 : 10) * scale);
                    ƒ.Gizmos.drawCube(mtxCube, this.selected == "xyz" ? this.#colorsLite.xyz : this.#colors.xyz, 1);
                    // ƒ.Recycler.store(mtxCube);
                    break;
            }
        }
        hndPointerDown = (_event) => {
            if (!this.camera || !this.viewport || !this.selected || !this.#mtxLocal || !this.#mtxWorld)
                return;
            this.#mtxLocalBase.copy(this.#mtxLocal);
            this.#mtxWorldBase.copy(this.#mtxWorld);
            if (this.selected == "x" || this.selected == "y" || this.selected == "z") {
                if (this.mode == "rotate") {
                    this.#normal.copy(this.#axes[this.selected]());
                }
                else {
                    const mtxNormal = ƒ.Matrix4x4.LOOK_AT(this.#mtxWorld.translation, this.camera.mtxWorld.translation, this.#axes[this.selected](), true);
                    this.#normal.copy(mtxNormal.forward); // normal of the plane the mouse ray will collide with
                    ƒ.Recycler.store(mtxNormal);
                }
            }
            else if (this.selected == "xyz") {
                this.#normal.copy(this.camera.mtxWorld.forward.negate());
            }
            const point = this.getPoint3D(_event);
            this.#offset.copy(point.subtract(this.#mtxWorld.translation));
            ƒ.Recycler.store(point);
            // create undo function
            const mtxLocal = this.#mtxLocal;
            const mutatorLocal = mtxLocal.getMutator();
            const mtxWorld = this.#mtxWorld;
            const mutatorWorld = mtxWorld.getMutator();
            let undo = () => {
                mtxLocal.mutate(mutatorLocal);
                mtxWorld.mutate(mutatorWorld);
                if (this.#mtxLocal == mtxLocal)
                    this.#mtxLocalBase.copy(mtxLocal);
                if (this.#mtxWorld == mtxWorld)
                    this.#mtxWorldBase.copy(mtxWorld);
            };
            this.#undo.push(undo);
        };
        hndPointerMove = (_event) => {
            this.#isTransforming = false;
            this.viewport.canvas.style.cursor = "default";
            if (_event.buttons != 1) {
                const point = new ƒ.Vector2(_event.offsetX, _event.offsetY);
                const pick = ƒ.Picker.pickCamera([this], this.camera, this.viewport.pointClientToProjection(point))[0];
                if (pick?.color.equals(this.#colors.x) || pick?.color.equals(this.#colorsLite.x))
                    this.selected = "x";
                else if (pick?.color.equals(this.#colors.y) || pick?.color.equals(this.#colorsLite.y))
                    this.selected = "y";
                else if (pick?.color.equals(this.#colors.z) || pick?.color.equals(this.#colorsLite.z))
                    this.selected = "z";
                else if (pick?.color.equals(this.#colors.xyz) || pick?.color.equals(this.#colorsLite.xyz))
                    this.selected = "xyz";
                else
                    this.selected = null;
                if (this.selected)
                    this.viewport.canvas.style.cursor = "grab";
                ƒ.Recycler.store(point);
                return;
            }
            if (!this.camera || !this.viewport || !this.selected || !this.#mtxLocal || !this.#mtxWorld)
                return;
            const isSnapping = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.CTRL_LEFT, ƒ.KEYBOARD_CODE.CTRL_RIGHT]);
            this.#isTransforming = true;
            this.viewport.canvas.style.cursor = "grabbing";
            this.#direction.copy(this.getPoint3D(_event).subtract(this.#mtxWorldBase.translation));
            this.#mtxLocal.copy(this.#mtxLocalBase); // reset
            let axis;
            if (this.selected.length == 1)
                axis = this.#axes[this.selected]();
            switch (this.mode) {
                case "translate":
                    const mtxWorldInvserse = this.#mtxWorldBase.clone.invert();
                    const translation = ƒ.Vector3.PROJECTION(this.#direction, axis);
                    const translationOffset = ƒ.Vector3.PROJECTION(this.#offset, axis);
                    translation.subtract(translationOffset);
                    if (isSnapping)
                        translation.apply((_value) => ƒ.Calc.snap(_value, this.snapDistance));
                    translation.transform(mtxWorldInvserse, false);
                    this.#mtxLocal.translate(translation);
                    ƒ.Recycler.storeMultiple(mtxWorldInvserse, translation, translationOffset);
                    break;
                case "rotate":
                    const rotationInverse = this.#mtxWorldBase.quaternion.clone.invert();
                    // rotate vectors into local space, this seems to be the most reliable way
                    const offsetLocal = this.#offset.clone.transform(rotationInverse);
                    const directionLocal = this.#direction.clone.transform(rotationInverse);
                    const axisLocal = axis.clone.transform(rotationInverse);
                    let angle = ƒ.Vector3.ANGLE(offsetLocal, directionLocal);
                    if (isSnapping)
                        angle = ƒ.Calc.snap(angle, this.snapAngle);
                    // Determine the direction of rotation
                    const cross = ƒ.Vector3.CROSS(offsetLocal, directionLocal);
                    if (ƒ.Vector3.DOT(axisLocal, cross) < 0)
                        angle = -angle;
                    const rotation = ƒ.Quaternion.ROTATION(axisLocal, angle);
                    if (isSnapping) {
                        const directionSnapped = offsetLocal
                            .transform(rotation) // rotate offset into snapped direction
                            .transform(this.#mtxWorldBase.quaternion); // rotate snapped direction back into world space
                        this.#direction.copy(directionSnapped);
                    }
                    this.#mtxLocal.quaternion = this.#mtxLocal.quaternion.multiply(rotation); // only affect rotation, ignore scaling
                    ƒ.Recycler.storeMultiple(rotationInverse, offsetLocal, directionLocal, axisLocal, cross, rotation);
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
                    this.#scaleFactor = (((signDirection * direction.magnitude) - (signOffset * offset.magnitude)) / lengthArrow) + 1;
                    if (isSnapping)
                        this.#scaleFactor = ƒ.Calc.snap(this.#scaleFactor, this.snapScale);
                    const vctScaling = ƒ.Vector3.ONE();
                    for (const selected of this.selected)
                        vctScaling[selected] = this.#scaleFactor;
                    const mtxScaling = ƒ.Matrix4x4.SCALING(vctScaling);
                    if (this.space == "world") { // rotationInverse * scaling * rotation
                        const rotationInverse = this.#mtxWorldBase.quaternion.clone.invert();
                        mtxScaling.rotate(rotationInverse, true);
                        mtxScaling.rotate(this.#mtxWorldBase.quaternion);
                        ƒ.Recycler.store(rotationInverse);
                    }
                    this.#mtxLocal.scale(mtxScaling.scaling);
                    ƒ.Recycler.storeMultiple(vctScaling, mtxScaling);
                    break;
            }
            ƒ.Recycler.store(axis);
        };
        hndPointerUp = () => {
            if (this.#mtxLocal)
                this.#mtxLocalBase.copy(this.#mtxLocal);
            if (this.#mtxWorld)
                this.#mtxWorldBase.copy(this.#mtxWorld);
            if (this.selected)
                this.selected = null;
            if (this.#isTransforming)
                this.#isTransforming = false;
        };
        hndRenderEnd = () => {
            this.drawGizmos(this.viewport.camera);
        };
        drawCircle(_torus, _color, _direction, _up, _radius, _alphaOccluded) {
            const mtxWorld = this.#mtxWorld.clone;
            const vctScaling = ƒ.Recycler.reuse(ƒ.Vector3).set(_radius * 2, _radius * 2, _radius * 2);
            mtxWorld.scaling = vctScaling;
            mtxWorld.lookIn(_direction, _up); // lookIn orientates the z-axis but the toruse lays on the xz-plane (facing in y-direction),
            mtxWorld.rotateX(90); // thus we rotate the torus so the circle faces in _direction
            // ƒ.Gizmos.drawMesh(this.torusPick, mtxWorld, ƒ.Color.CSS("magenta"), _alphaOccluded);
            ƒ.Gizmos.drawMesh(_torus, mtxWorld, _color, _alphaOccluded);
            ƒ.Recycler.storeMultiple(mtxWorld, vctScaling);
        }
        getPoint3D(_event) {
            const point2D = ƒ.Recycler.reuse(ƒ.Vector2).set(_event.offsetX, _event.offsetY);
            const ray = this.viewport.getRayFromClient(point2D);
            ƒ.Recycler.store(point2D);
            return ray.intersectPlane(this.#mtxWorldBase.translation, this.#normal);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VBaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9Tb3VyY2UvQWlkL1JlZmVyZW5jZXMudHMiLCIuLi9Tb3VyY2UvQWlkL0FyaXRobWV0aWMvQXJpdGgudHMiLCIuLi9Tb3VyY2UvQWlkL0FyaXRobWV0aWMvQXJpdGhCaXNlY3Rpb24udHMiLCIuLi9Tb3VyY2UvQWlkL0NhbWVyYS9DYW1lcmFPcmJpdC50cyIsIi4uL1NvdXJjZS9BaWQvQ2FtZXJhL0NhbWVyYU9yYml0TW92aW5nRm9jdXMudHMiLCIuLi9Tb3VyY2UvQWlkL0NhbnZhcy9DYW52YXMudHMiLCIuLi9Tb3VyY2UvQWlkL0dlb21ldHJ5L05vZGUudHMiLCIuLi9Tb3VyY2UvQWlkL0dlb21ldHJ5L05vZGVBcnJvdy50cyIsIi4uL1NvdXJjZS9BaWQvR2VvbWV0cnkvTm9kZUNvb3JkaW5hdGVTeXN0ZW0udHMiLCIuLi9Tb3VyY2UvQWlkL0xpZ2h0L05vZGVMaWdodFNldHVwLnRzIiwiLi4vU291cmNlL0FpZC9TcHJpdGUvTm9kZVNwcml0ZS50cyIsIi4uL1NvdXJjZS9BaWQvU3ByaXRlL1Nwcml0ZVNoZWV0QW5pbWF0aW9uLnRzIiwiLi4vU291cmNlL0FpZC9TdGF0ZU1hY2hpbmUvQ29tcG9uZW50U3RhdGVNYWNoaW5lLnRzIiwiLi4vU291cmNlL0FpZC9TdGF0ZU1hY2hpbmUvU3RhdGVNYWNoaW5lLnRzIiwiLi4vU291cmNlL0FpZC9UcmFuc2Zvcm0vVHJhbnNmb3JtYXRvci50cyIsIi4uL1NvdXJjZS9BaWQvVmlld3BvcnQvVmlld3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDtBQUMxRCxJQUFVLFFBQVEsQ0FFakI7QUFIRCwwREFBMEQ7QUFDMUQsV0FBVSxRQUFRO0lBQ2hCLFNBQVMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkQsQ0FBQyxFQUZTLFFBQVEsS0FBUixRQUFRLFFBRWpCO0FDSEQsSUFB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QUM7d0JBRUQsTUFBTTtvQkFDUixDQUFDO29CQUVELENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDMUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMxSSxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRTFJLE1BQU0sT0FBTyxHQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNqRixPQUFPLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO29CQUMvRCxDQUFDLENBQUMsTUFB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YnV0aW9uL0Z1ZGdlQ29yZS5kLnRzXCIvPlxyXG5uYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIEZ1ZGdlQ29yZS5TZXJpYWxpemVyLnJlZ2lzdGVyTmFtZXNwYWNlKEZ1ZGdlQWlkKTtcclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgLyoqXHJcbiAgICogQWJzdHJhY3QgY2xhc3Mgc3VwcG9ydGluZyB2ZXJzaW91cyBhcml0aG1ldGljYWwgaGVscGVyIGZ1bmN0aW9uc1xyXG4gICAqL1xyXG4gIGV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBcml0aCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIG9uZSBvZiB0aGUgdmFsdWVzIHBhc3NlZCBpbiwgZWl0aGVyIF92YWx1ZSBpZiB3aXRoaW4gX21pbiBhbmQgX21heCBvciB0aGUgYm91bmRhcnkgYmVpbmcgZXhjZWVkZWQgYnkgX3ZhbHVlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY2xhbXA8VD4oX3ZhbHVlOiBULCBfbWluOiBULCBfbWF4OiBULCBfaXNTbWFsbGVyOiAoX3ZhbHVlMTogVCwgX3ZhbHVlMjogVCkgPT4gYm9vbGVhbiA9IChfdmFsdWUxOiBULCBfdmFsdWUyOiBUKSA9PiB7IHJldHVybiBfdmFsdWUxIDwgX3ZhbHVlMjsgfSk6IFQge1xyXG4gICAgICBpZiAoX2lzU21hbGxlcihfdmFsdWUsIF9taW4pKSByZXR1cm4gX21pbjtcclxuICAgICAgaWYgKF9pc1NtYWxsZXIoX21heCwgX3ZhbHVlKSkgcmV0dXJuIF9tYXg7XHJcbiAgICAgIHJldHVybiBfdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICAvKipcclxuICAgKiBXaXRoaW4gYSBnaXZlbiBwcmVjaXNpb24sIGFuIG9iamVjdCBvZiB0aGlzIGNsYXNzIGZpbmRzIHRoZSBwYXJhbWV0ZXIgdmFsdWUgYXQgd2hpY2ggYSBnaXZlbiBmdW5jdGlvbiBcclxuICAgKiBzd2l0Y2hlcyBpdHMgYm9vbGVhbiByZXR1cm4gdmFsdWUgdXNpbmcgaW50ZXJ2YWwgc3BsaXR0aW5nIChiaXNlY3Rpb24pLiBcclxuICAgKiBQYXNzIHRoZSB0eXBlIG9mIHRoZSBwYXJhbWV0ZXIgYW5kIHRoZSB0eXBlIHRoZSBwcmVjaXNpb24gaXMgbWVhc3VyZWQgaW4uXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIEFyaXRoQmlzZWN0aW9uPFBhcmFtZXRlciwgRXBzaWxvbj4ge1xyXG4gICAgLyoqIFRoZSBsZWZ0IGJvcmRlciBvZiB0aGUgaW50ZXJ2YWwgZm91bmQgKi9cclxuICAgIHB1YmxpYyBsZWZ0OiBQYXJhbWV0ZXI7XHJcbiAgICAvKiogVGhlIHJpZ2h0IGJvcmRlciBvZiB0aGUgaW50ZXJ2YWwgZm91bmQgKi9cclxuICAgIHB1YmxpYyByaWdodDogUGFyYW1ldGVyO1xyXG4gICAgLyoqIFRoZSBmdW5jdGlvbiB2YWx1ZSBhdCB0aGUgbGVmdCBib3JkZXIgb2YgdGhlIGludGVydmFsIGZvdW5kICovXHJcbiAgICBwdWJsaWMgbGVmdFZhbHVlOiBib29sZWFuO1xyXG4gICAgLyoqIFRoZSBmdW5jdGlvbiB2YWx1ZSBhdCB0aGUgcmlnaHQgYm9yZGVyIG9mIHRoZSBpbnRlcnZhbCBmb3VuZCAqL1xyXG4gICAgcHVibGljIHJpZ2h0VmFsdWU6IGJvb2xlYW47XHJcblxyXG4gICAgcHJpdmF0ZSBmdW5jdGlvbjogKF90OiBQYXJhbWV0ZXIpID0+IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIGRpdmlkZTogKF9sZWZ0OiBQYXJhbWV0ZXIsIF9yaWdodDogUGFyYW1ldGVyKSA9PiBQYXJhbWV0ZXI7XHJcbiAgICBwcml2YXRlIGlzU21hbGxlcjogKF9sZWZ0OiBQYXJhbWV0ZXIsIF9yaWdodDogUGFyYW1ldGVyLCBfZXBzaWxvbjogRXBzaWxvbikgPT4gYm9vbGVhbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBuZXcgU29sdmVyXHJcbiAgICAgKiBAcGFyYW0gX2Z1bmN0aW9uIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhbiBhcmd1bWVudCBvZiB0aGUgZ2VuZXJpYyB0eXBlIDxQYXJhbWV0ZXI+IGFuZCByZXR1cm5zIGEgYm9vbGVhbiB2YWx1ZS5cclxuICAgICAqIEBwYXJhbSBfZGl2aWRlIEEgZnVuY3Rpb24gc3BsaXR0aW5nIHRoZSBpbnRlcnZhbCB0byBmaW5kIGEgcGFyYW1ldGVyIGZvciB0aGUgbmV4dCBpdGVyYXRpb24sIG1heSBzaW1wbHkgYmUgdGhlIGFyaXRobWV0aWMgbWVhblxyXG4gICAgICogQHBhcmFtIF9pc1NtYWxsZXIgQSBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgYSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGJvcmRlcnMgb2YgdGhlIGN1cnJlbnQgaW50ZXJ2YWwgYW5kIGNvbXBhcmVzIHRoaXMgdG8gdGhlIGdpdmVuIHByZWNpc2lvbiBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgIF9mdW5jdGlvbjogKF90OiBQYXJhbWV0ZXIpID0+IGJvb2xlYW4sXHJcbiAgICAgIF9kaXZpZGU6IChfbGVmdDogUGFyYW1ldGVyLCBfcmlnaHQ6IFBhcmFtZXRlcikgPT4gUGFyYW1ldGVyLFxyXG4gICAgICBfaXNTbWFsbGVyOiAoX2xlZnQ6IFBhcmFtZXRlciwgX3JpZ2h0OiBQYXJhbWV0ZXIsIF9lcHNpbG9uOiBFcHNpbG9uKSA9PiBib29sZWFuKSB7XHJcbiAgICAgIHRoaXMuZnVuY3Rpb24gPSBfZnVuY3Rpb247XHJcbiAgICAgIHRoaXMuZGl2aWRlID0gX2RpdmlkZTtcclxuICAgICAgdGhpcy5pc1NtYWxsZXIgPSBfaXNTbWFsbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmluZHMgYSBzb2x1dGlvbiB3aXRoIHRoZSBnaXZlbiBwcmVjaXNpb24gaW4gdGhlIGdpdmVuIGludGVydmFsIHVzaW5nIHRoZSBmdW5jdGlvbnMgdGhpcyBTb2x2ZXIgd2FzIGNvbnN0cnVjdGVkIHdpdGguXHJcbiAgICAgKiBBZnRlciB0aGUgbWV0aG9kIHJldHVybnMsIGZpbmQgdGhlIGRhdGEgaW4gdGhpcyBvYmplY3RzIHByb3BlcnRpZXMuXHJcbiAgICAgKiBAcGFyYW0gX2xlZnQgVGhlIHBhcmFtZXRlciBvbiBvbmUgc2lkZSBvZiB0aGUgaW50ZXJ2YWwuXHJcbiAgICAgKiBAcGFyYW0gX3JpZ2h0IFRoZSBwYXJhbWV0ZXIgb24gdGhlIG90aGVyIHNpZGUsIG1heSBiZSBcInNtYWxsZXJcIiB0aGFuIFtbX2xlZnRdXS5cclxuICAgICAqIEBwYXJhbSBfZXBzaWxvbiBUaGUgZGVzaXJlZCBwcmVjaXNpb24gb2YgdGhlIHNvbHV0aW9uLlxyXG4gICAgICogQHBhcmFtIF9sZWZ0VmFsdWUgVGhlIHZhbHVlIG9uIHRoZSBsZWZ0IHNpZGUgb2YgdGhlIGludGVydmFsLCBvbWl0IGlmIHlldCB1bmtub3duIG9yIHBhc3MgaW4gaWYga25vd24gZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cclxuICAgICAqIEBwYXJhbSBfcmlnaHRWYWx1ZSBUaGUgdmFsdWUgb24gdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIGludGVydmFsLCBvbWl0IGlmIHlldCB1bmtub3duIG9yIHBhc3MgaW4gaWYga25vd24gZm9yIGJldHRlciBwZXJmb3JtYW5jZS5cclxuICAgICAqIEB0aHJvd3MgRXJyb3IgaWYgYm90aCBzaWRlcyBvZiB0aGUgaW50ZXJ2YWwgcmV0dXJuIHRoZSBzYW1lIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc29sdmUoX2xlZnQ6IFBhcmFtZXRlciwgX3JpZ2h0OiBQYXJhbWV0ZXIsIF9lcHNpbG9uOiBFcHNpbG9uLCBfbGVmdFZhbHVlOiBib29sZWFuID0gdW5kZWZpbmVkLCBfcmlnaHRWYWx1ZTogYm9vbGVhbiA9IHVuZGVmaW5lZCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmxlZnQgPSBfbGVmdDtcclxuICAgICAgdGhpcy5sZWZ0VmFsdWUgPSBfbGVmdFZhbHVlIHx8IHRoaXMuZnVuY3Rpb24oX2xlZnQpO1xyXG4gICAgICB0aGlzLnJpZ2h0ID0gX3JpZ2h0O1xyXG4gICAgICB0aGlzLnJpZ2h0VmFsdWUgPSBfcmlnaHRWYWx1ZSB8fCB0aGlzLmZ1bmN0aW9uKF9yaWdodCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5pc1NtYWxsZXIoX2xlZnQsIF9yaWdodCwgX2Vwc2lsb24pKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGlmICh0aGlzLmxlZnRWYWx1ZSA9PSB0aGlzLnJpZ2h0VmFsdWUpXHJcbiAgICAgICAgdGhyb3cobmV3IEVycm9yKFwiSW50ZXJ2YWwgc29sdmVyIGNhbid0IG9wZXJhdGUgd2l0aCBpZGVudGljYWwgZnVuY3Rpb24gdmFsdWVzIG9uIGJvdGggc2lkZXMgb2YgdGhlIGludGVydmFsXCIpKTtcclxuXHJcbiAgICAgIGxldCBiZXR3ZWVuOiBQYXJhbWV0ZXIgPSB0aGlzLmRpdmlkZShfbGVmdCwgX3JpZ2h0KTtcclxuICAgICAgbGV0IGJldHdlZW5WYWx1ZTogYm9vbGVhbiA9IHRoaXMuZnVuY3Rpb24oYmV0d2Vlbik7XHJcbiAgICAgIGlmIChiZXR3ZWVuVmFsdWUgPT0gdGhpcy5sZWZ0VmFsdWUpXHJcbiAgICAgICAgdGhpcy5zb2x2ZShiZXR3ZWVuLCB0aGlzLnJpZ2h0LCBfZXBzaWxvbiwgYmV0d2VlblZhbHVlLCB0aGlzLnJpZ2h0VmFsdWUpO1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhpcy5zb2x2ZSh0aGlzLmxlZnQsIGJldHdlZW4sIF9lcHNpbG9uLCB0aGlzLmxlZnRWYWx1ZSwgYmV0d2VlblZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgbGV0IG91dDogc3RyaW5nID0gXCJcIjtcclxuICAgICAgb3V0ICs9IGBsZWZ0OiAke3RoaXMubGVmdC50b1N0cmluZygpfSAtPiAke3RoaXMubGVmdFZhbHVlfWA7XHJcbiAgICAgIG91dCArPSBcIlxcblwiO1xyXG4gICAgICBvdXQgKz0gYHJpZ2h0OiAke3RoaXMucmlnaHQudG9TdHJpbmcoKX0gLT4gJHt0aGlzLnJpZ2h0VmFsdWV9YDtcclxuICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENhbWVyYU9yYml0IGV4dGVuZHMgxpIuTm9kZSB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXhpc1JvdGF0ZVg6IMaSLkF4aXMgPSBuZXcgxpIuQXhpcyhcIlJvdGF0ZVhcIiwgMSwgxpIuQ09OVFJPTF9UWVBFLlBST1BPUlRJT05BTCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXhpc1JvdGF0ZVk6IMaSLkF4aXMgPSBuZXcgxpIuQXhpcyhcIlJvdGF0ZVlcIiwgMSwgxpIuQ09OVFJPTF9UWVBFLlBST1BPUlRJT05BTCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXhpc0Rpc3RhbmNlOiDGki5BeGlzID0gbmV3IMaSLkF4aXMoXCJEaXN0YW5jZVwiLCAxLCDGki5DT05UUk9MX1RZUEUuUFJPUE9SVElPTkFMKTtcclxuXHJcbiAgICBwdWJsaWMgbWluRGlzdGFuY2U6IG51bWJlcjtcclxuICAgIHB1YmxpYyBtYXhEaXN0YW5jZTogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIHRyYW5zbGF0b3I6IMaSLk5vZGU7XHJcbiAgICBwcm90ZWN0ZWQgcm90YXRvclg6IMaSLk5vZGU7XHJcbiAgICBwcml2YXRlIG1heFJvdFg6IG51bWJlcjtcclxuXHJcblxyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEsIF9kaXN0YW5jZVN0YXJ0OiBudW1iZXIgPSAyLCBfbWF4Um90WDogbnVtYmVyID0gNzUsIF9taW5EaXN0YW5jZTogbnVtYmVyID0gMSwgX21heERpc3RhbmNlOiBudW1iZXIgPSAxMCkge1xyXG4gICAgICBzdXBlcihcIkNhbWVyYU9yYml0XCIpO1xyXG5cclxuICAgICAgdGhpcy5tYXhSb3RYID0gTWF0aC5taW4oX21heFJvdFgsIDg5KTtcclxuICAgICAgdGhpcy5taW5EaXN0YW5jZSA9IF9taW5EaXN0YW5jZTtcclxuICAgICAgdGhpcy5tYXhEaXN0YW5jZSA9IF9tYXhEaXN0YW5jZTtcclxuXHJcbiAgICAgIGxldCBjbXBUcmFuc2Zvcm06IMaSLkNvbXBvbmVudFRyYW5zZm9ybSA9IG5ldyDGki5Db21wb25lbnRUcmFuc2Zvcm0oKTtcclxuICAgICAgdGhpcy5hZGRDb21wb25lbnQoY21wVHJhbnNmb3JtKTtcclxuXHJcbiAgICAgIHRoaXMucm90YXRvclggPSBuZXcgxpIuTm9kZShcIkNhbWVyYVJvdGF0aW9uWFwiKTtcclxuICAgICAgdGhpcy5yb3RhdG9yWC5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudFRyYW5zZm9ybSgpKTtcclxuICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLnJvdGF0b3JYKTtcclxuICAgICAgdGhpcy50cmFuc2xhdG9yID0gbmV3IMaSLk5vZGUoXCJDYW1lcmFUcmFuc2xhdGVcIik7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRvci5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudFRyYW5zZm9ybSgpKTtcclxuICAgICAgdGhpcy50cmFuc2xhdG9yLm10eExvY2FsLnJvdGF0ZVkoMTgwKTtcclxuICAgICAgdGhpcy5yb3RhdG9yWC5hZGRDaGlsZCh0aGlzLnRyYW5zbGF0b3IpO1xyXG5cclxuICAgICAgdGhpcy50cmFuc2xhdG9yLmFkZENvbXBvbmVudChfY21wQ2FtZXJhKTtcclxuICAgICAgdGhpcy5kaXN0YW5jZSA9IF9kaXN0YW5jZVN0YXJ0O1xyXG5cclxuICAgICAgdGhpcy5heGlzUm90YXRlWC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5UX0NPTlRST0wuT1VUUFVULCB0aGlzLmhuZEF4aXNPdXRwdXQpO1xyXG4gICAgICB0aGlzLmF4aXNSb3RhdGVZLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlRfQ09OVFJPTC5PVVRQVVQsIHRoaXMuaG5kQXhpc091dHB1dCk7XHJcbiAgICAgIHRoaXMuYXhpc0Rpc3RhbmNlLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlRfQ09OVFJPTC5PVVRQVVQsIHRoaXMuaG5kQXhpc091dHB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBjbXBDYW1lcmEoKTogxpIuQ29tcG9uZW50Q2FtZXJhIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRvci5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50Q2FtZXJhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG5vZGVDYW1lcmEoKTogxpIuTm9kZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBkaXN0YW5jZShfZGlzdGFuY2U6IG51bWJlcikge1xyXG4gICAgICBsZXQgbmV3RGlzdGFuY2U6IG51bWJlciA9IE1hdGgubWluKHRoaXMubWF4RGlzdGFuY2UsIE1hdGgubWF4KHRoaXMubWluRGlzdGFuY2UsIF9kaXN0YW5jZSkpO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0b3IubXR4TG9jYWwudHJhbnNsYXRpb24gPSDGki5WZWN0b3IzLloobmV3RGlzdGFuY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZGlzdGFuY2UoKTogbnVtYmVyIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRvci5tdHhMb2NhbC50cmFuc2xhdGlvbi56O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb25ZKF9hbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgIHRoaXMubXR4TG9jYWwucm90YXRpb24gPSDGki5WZWN0b3IzLlkoX2FuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJvdGF0aW9uWSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5tdHhMb2NhbC5yb3RhdGlvbi55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb25YKF9hbmdsZTogbnVtYmVyKSB7XHJcbiAgICAgIF9hbmdsZSA9IE1hdGgubWluKE1hdGgubWF4KC10aGlzLm1heFJvdFgsIF9hbmdsZSksIHRoaXMubWF4Um90WCk7XHJcbiAgICAgIHRoaXMucm90YXRvclgubXR4TG9jYWwucm90YXRpb24gPSDGki5WZWN0b3IzLlgoX2FuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHJvdGF0aW9uWCgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy5yb3RhdG9yWC5tdHhMb2NhbC5yb3RhdGlvbi54O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGVZKF9kZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXR4TG9jYWwucm90YXRlWShfZGVsdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByb3RhdGVYKF9kZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMucm90YXRpb25YID0gdGhpcy5yb3RhdG9yWC5tdHhMb2NhbC5yb3RhdGlvbi54ICsgX2RlbHRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNldCBwb3NpdGlvbiBvZiBjYW1lcmEgY29tcG9uZW50IHJlbGF0aXZlIHRvIHRoZSBjZW50ZXIgb2Ygb3JiaXRcclxuICAgIHB1YmxpYyBwb3NpdGlvbkNhbWVyYShfcG9zV29ybGQ6IMaSLlZlY3RvcjMpOiB2b2lkIHtcclxuICAgICAgbGV0IGRpZmZlcmVuY2U6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLkRJRkZFUkVOQ0UoX3Bvc1dvcmxkLCB0aGlzLm10eFdvcmxkLnRyYW5zbGF0aW9uKTtcclxuICAgICAgbGV0IGdlbzogxpIuR2VvMyA9IGRpZmZlcmVuY2UuZ2VvO1xyXG4gICAgICB0aGlzLnJvdGF0aW9uWSA9IGdlby5sb25naXR1ZGU7XHJcbiAgICAgIHRoaXMucm90YXRpb25YID0gLWdlby5sYXRpdHVkZTtcclxuICAgICAgdGhpcy5kaXN0YW5jZSA9IGdlby5tYWduaXR1ZGU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBobmRBeGlzT3V0cHV0OiBFdmVudExpc3RlbmVyID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IG91dHB1dDogbnVtYmVyID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbC5vdXRwdXQ7XHJcbiAgICAgIHN3aXRjaCAoKDzGki5BeGlzPl9ldmVudC50YXJnZXQpLm5hbWUpIHtcclxuICAgICAgICBjYXNlIFwiUm90YXRlWFwiOlxyXG4gICAgICAgICAgdGhpcy5yb3RhdGVYKG91dHB1dCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiUm90YXRlWVwiOlxyXG4gICAgICAgICAgdGhpcy5yb3RhdGVZKG91dHB1dCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiRGlzdGFuY2VcIjpcclxuICAgICAgICAgIHRoaXMuZGlzdGFuY2UgKz0gb3V0cHV0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBDYW1lcmFPcmJpdE1vdmluZ0ZvY3VzIGV4dGVuZHMgQ2FtZXJhT3JiaXQge1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF4aXNUcmFuc2xhdGVYOiDGki5BeGlzID0gbmV3IMaSLkF4aXMoXCJUcmFuc2xhdGVYXCIsIDEsIMaSLkNPTlRST0xfVFlQRS5QUk9QT1JUSU9OQUwpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF4aXNUcmFuc2xhdGVZOiDGki5BeGlzID0gbmV3IMaSLkF4aXMoXCJUcmFuc2xhdGVZXCIsIDEsIMaSLkNPTlRST0xfVFlQRS5QUk9QT1JUSU9OQUwpO1xyXG4gICAgcHVibGljIHJlYWRvbmx5IGF4aXNUcmFuc2xhdGVaOiDGki5BeGlzID0gbmV3IMaSLkF4aXMoXCJUcmFuc2xhdGVaXCIsIDEsIMaSLkNPTlRST0xfVFlQRS5QUk9QT1JUSU9OQUwpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEsIF9kaXN0YW5jZVN0YXJ0OiBudW1iZXIgPSA1LCBfbWF4Um90WDogbnVtYmVyID0gODUsIF9taW5EaXN0YW5jZTogbnVtYmVyID0gMCwgX21heERpc3RhbmNlOiBudW1iZXIgPSBJbmZpbml0eSkge1xyXG4gICAgICBzdXBlcihfY21wQ2FtZXJhLCBfZGlzdGFuY2VTdGFydCwgX21heFJvdFgsIF9taW5EaXN0YW5jZSwgX21heERpc3RhbmNlKTtcclxuICAgICAgdGhpcy5uYW1lID0gXCJDYW1lcmFPcmJpdE1vdmluZ0ZvY3VzXCI7XHJcblxyXG4gICAgICB0aGlzLmF4aXNUcmFuc2xhdGVYLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlRfQ09OVFJPTC5PVVRQVVQsIHRoaXMuaG5kQXhpc091dHB1dCk7XHJcbiAgICAgIHRoaXMuYXhpc1RyYW5zbGF0ZVkuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVF9DT05UUk9MLk9VVFBVVCwgdGhpcy5obmRBeGlzT3V0cHV0KTtcclxuICAgICAgdGhpcy5heGlzVHJhbnNsYXRlWi5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5UX0NPTlRST0wuT1VUUFVULCB0aGlzLmhuZEF4aXNPdXRwdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2xhdGVYKF9kZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMubXR4TG9jYWwudHJhbnNsYXRlWChfZGVsdGEpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlWShfZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICBsZXQgdHJhbnNsYXRpb246IMaSLlZlY3RvcjMgPSB0aGlzLnJvdGF0b3JYLm10eFdvcmxkLmdldFkoKTtcclxuICAgICAgdHJhbnNsYXRpb24ubm9ybWFsaXplKF9kZWx0YSk7XHJcbiAgICAgIHRoaXMubXR4TG9jYWwudHJhbnNsYXRlKHRyYW5zbGF0aW9uLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zbGF0ZVooX2RlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgLy8gdGhpcy5tdHhMb2NhbC50cmFuc2xhdGVaKF9kZWx0YSk7XHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMyA9IHRoaXMucm90YXRvclgubXR4V29ybGQuZ2V0WigpO1xyXG4gICAgICB0cmFuc2xhdGlvbi5ub3JtYWxpemUoX2RlbHRhKTtcclxuICAgICAgdGhpcy5tdHhMb2NhbC50cmFuc2xhdGUodHJhbnNsYXRpb24sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaG5kQXhpc091dHB1dDogRXZlbnRMaXN0ZW5lciA9IChfZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxldCBvdXRwdXQ6IG51bWJlciA9ICg8Q3VzdG9tRXZlbnQ+X2V2ZW50KS5kZXRhaWwub3V0cHV0O1xyXG4gICAgICBzd2l0Y2ggKCg8xpIuQXhpcz5fZXZlbnQudGFyZ2V0KS5uYW1lKSB7XHJcbiAgICAgICAgY2FzZSBcIlRyYW5zbGF0ZVhcIjpcclxuICAgICAgICAgIHRoaXMudHJhbnNsYXRlWChvdXRwdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIlRyYW5zbGF0ZVlcIjpcclxuICAgICAgICAgIHRoaXMudHJhbnNsYXRlWShvdXRwdXQpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcIlRyYW5zbGF0ZVpcIjpcclxuICAgICAgICAgIHRoaXMudHJhbnNsYXRlWihvdXRwdXQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBleHBvcnQgZW51bSBJTUFHRV9SRU5ERVJJTkcge1xyXG4gICAgQVVUTyA9IFwiYXV0b1wiLFxyXG4gICAgU01PT1RIID0gXCJzbW9vdGhcIixcclxuICAgIEhJR0hfUVVBTElUWSA9IFwiaGlnaC1xdWFsaXR5XCIsXHJcbiAgICBDUklTUF9FREdFUyA9IFwiY3Jpc3AtZWRnZXNcIixcclxuICAgIFBJWEVMQVRFRCA9IFwicGl4ZWxhdGVkXCJcclxuICB9XHJcbiAgLyoqXHJcbiAgICogQWRkcyBjb21mb3J0IG1ldGhvZHMgdG8gY3JlYXRlIGEgcmVuZGVyIGNhbnZhc1xyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBDYW52YXMge1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoX2ZpbGxQYXJlbnQ6IGJvb2xlYW4gPSB0cnVlLCBfaW1hZ2VSZW5kZXJpbmc6IElNQUdFX1JFTkRFUklORyA9IElNQUdFX1JFTkRFUklORy5BVVRPLCBfd2lkdGg6IG51bWJlciA9IDgwMCwgX2hlaWdodDogbnVtYmVyID0gNjAwKTogSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgICBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICBjYW52YXMuaWQgPSBcIkZVREdFXCI7XHJcbiAgICAgIGxldCBzdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbiA9IGNhbnZhcy5zdHlsZTtcclxuICAgICAgc3R5bGUuaW1hZ2VSZW5kZXJpbmcgPSBfaW1hZ2VSZW5kZXJpbmc7XHJcbiAgICAgIHN0eWxlLndpZHRoID0gX3dpZHRoICsgXCJweFwiO1xyXG4gICAgICBzdHlsZS5oZWlnaHQgPSBfaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICBzdHlsZS5tYXJnaW5Cb3R0b20gPSBcIi0wLjI1ZW1cIjtcclxuICAgICAgXHJcbiAgICAgIGlmIChfZmlsbFBhcmVudCkge1xyXG4gICAgICAgIHN0eWxlLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNhbnZhcztcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIE5vZGUgZXh0ZW5kcyDGki5Ob2RlIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGNvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcgPSBOb2RlLmdldE5leHROYW1lKCksIF90cmFuc2Zvcm0/OiDGki5NYXRyaXg0eDQsIF9tYXRlcmlhbD86IMaSLk1hdGVyaWFsLCBfbWVzaD86IMaSLk1lc2gpIHtcclxuICAgICAgc3VwZXIoX25hbWUpO1xyXG4gICAgICBpZiAoX3RyYW5zZm9ybSlcclxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50VHJhbnNmb3JtKF90cmFuc2Zvcm0pKTtcclxuICAgICAgaWYgKF9tYXRlcmlhbClcclxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50TWF0ZXJpYWwoX21hdGVyaWFsKSk7XHJcbiAgICAgIGlmIChfbWVzaClcclxuICAgICAgICB0aGlzLmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50TWVzaChfbWVzaCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldE5leHROYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgIHJldHVybiBcIsaSQWlkTm9kZV9cIiArIE5vZGUuY291bnQrKztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG10eE1lc2hQaXZvdCgpOiDGki5NYXRyaXg0eDQge1xyXG4gICAgICBsZXQgY21wTWVzaDogxpIuQ29tcG9uZW50TWVzaCA9IHRoaXMuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudE1lc2gpO1xyXG4gICAgICByZXR1cm4gY21wTWVzaCA/IGNtcE1lc2gubXR4UGl2b3QgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBkZXNlcmlhbGl6ZShfc2VyaWFsaXphdGlvbjogxpIuU2VyaWFsaXphdGlvbik6IFByb21pc2U8xpIuU2VyaWFsaXphYmxlPiB7XHJcbiAgICAgIC8vIFF1aWNrIGFuZCBtYXliZSBoYWNreSBzb2x1dGlvbi4gQ3JlYXRlZCBub2RlIGlzIGNvbXBsZXRlbHkgZGlzbWlzc2VkIGFuZCBhIHJlY3JlYXRpb24gb2YgdGhlIGJhc2VjbGFzcyBnZXRzIHJldHVybi4gT3RoZXJ3aXNlLCBjb21wb25lbnRzIHdpbGwgYmUgZG91YmxlZC4uLlxyXG4gICAgICBsZXQgbm9kZTogxpIuTm9kZSA9IG5ldyDGki5Ob2RlKF9zZXJpYWxpemF0aW9uLm5hbWUpO1xyXG4gICAgICBhd2FpdCBub2RlLmRlc2VyaWFsaXplKF9zZXJpYWxpemF0aW9uKTtcclxuICAgICAgLy8gY29uc29sZS5sb2cobm9kZSk7XHJcbiAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuXHJcbiAgZXhwb3J0IGNsYXNzIE5vZGVBcnJvdyBleHRlbmRzIE5vZGUge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaW50ZXJuYWxSZXNvdXJjZXM6IE1hcDxzdHJpbmcsIMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPiA9IE5vZGVBcnJvdy5jcmVhdGVJbnRlcm5hbFJlc291cmNlcygpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcsIF9jb2xvcjogxpIuQ29sb3IpIHtcclxuICAgICAgc3VwZXIoX25hbWUsIMaSLk1hdHJpeDR4NC5JREVOVElUWSgpKTtcclxuXHJcbiAgICAgIGxldCBzaGFmdDogTm9kZSA9IG5ldyBOb2RlKF9uYW1lICsgXCJTaGFmdFwiLCDGki5NYXRyaXg0eDQuSURFTlRJVFkoKSwgPMaSLk1hdGVyaWFsPk5vZGVBcnJvdy5pbnRlcm5hbFJlc291cmNlcy5nZXQoXCJNYXRlcmlhbFwiKSwgPMaSLk1lc2g+Tm9kZUFycm93LmludGVybmFsUmVzb3VyY2VzLmdldChcIlNoYWZ0XCIpKTtcclxuICAgICAgbGV0IGhlYWQ6IE5vZGUgPSBuZXcgTm9kZShfbmFtZSArIFwiSGVhZFwiLCDGki5NYXRyaXg0eDQuSURFTlRJVFkoKSwgPMaSLk1hdGVyaWFsPk5vZGVBcnJvdy5pbnRlcm5hbFJlc291cmNlcy5nZXQoXCJNYXRlcmlhbFwiKSwgPMaSLk1lc2g+Tm9kZUFycm93LmludGVybmFsUmVzb3VyY2VzLmdldChcIkhlYWRcIikpO1xyXG4gICAgICBzaGFmdC5tdHhMb2NhbC5zY2FsZShuZXcgxpIuVmVjdG9yMygwLjAxLCAwLjAxLCAxKSk7XHJcbiAgICAgIGhlYWQubXR4TG9jYWwudHJhbnNsYXRlWigwLjUpO1xyXG4gICAgICBoZWFkLm10eExvY2FsLnNjYWxlKG5ldyDGki5WZWN0b3IzKDAuMDUsIDAuMDUsIDAuMSkpO1xyXG4gICAgICBoZWFkLm10eExvY2FsLnJvdGF0ZVgoOTApO1xyXG5cclxuICAgICAgc2hhZnQuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudE1hdGVyaWFsKS5jbHJQcmltYXJ5ID0gX2NvbG9yO1xyXG4gICAgICBoZWFkLmdldENvbXBvbmVudCjGki5Db21wb25lbnRNYXRlcmlhbCkuY2xyUHJpbWFyeSA9IF9jb2xvcjtcclxuXHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQoc2hhZnQpO1xyXG4gICAgICB0aGlzLmFkZENoaWxkKGhlYWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZUludGVybmFsUmVzb3VyY2VzKCk6IE1hcDxzdHJpbmcsIMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPiB7XHJcbiAgICAgIGxldCBtYXA6IE1hcDxzdHJpbmcsIMaSLlNlcmlhbGl6YWJsZVJlc291cmNlPiA9IG5ldyBNYXAoKTtcclxuICAgICAgbWFwLnNldChcIlNoYWZ0XCIsIG5ldyDGki5NZXNoQ3ViZShcIkFycm93U2hhZnRcIikpO1xyXG4gICAgICBtYXAuc2V0KFwiSGVhZFwiLCBuZXcgxpIuTWVzaFB5cmFtaWQoXCJBcnJvd0hlYWRcIikpO1xyXG4gICAgICBsZXQgY29hdDogxpIuQ29hdENvbG9yZWQgPSBuZXcgxpIuQ29hdENvbG9yZWQoxpIuQ29sb3IuQ1NTKFwid2hpdGVcIikpO1xyXG4gICAgICBtYXAuc2V0KFwiTWF0ZXJpYWxcIiwgbmV3IMaSLk1hdGVyaWFsKFwiQXJyb3dcIiwgxpIuU2hhZGVyTGl0LCBjb2F0KSk7XHJcblxyXG4gICAgICBtYXAuZm9yRWFjaCgoX3Jlc291cmNlKSA9PiDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIoX3Jlc291cmNlKSk7XHJcbiAgICAgIHJldHVybiBtYXA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjb2xvcihfY29sb3I6IMaSLkNvbG9yKSB7XHJcbiAgICAgIGZvciAobGV0IGNoaWxkIG9mIHRoaXMuZ2V0Q2hpbGRyZW4oKSkge1xyXG4gICAgICAgIGNoaWxkLmdldENvbXBvbmVudCjGki5Db21wb25lbnRNYXRlcmlhbCkuY2xyUHJpbWFyeS5jb3B5KF9jb2xvcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIE5vZGVDb29yZGluYXRlU3lzdGVtIGV4dGVuZHMgTm9kZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihfbmFtZTogc3RyaW5nID0gXCJDb29yZGluYXRlU3lzdGVtXCIsIF90cmFuc2Zvcm0/OiDGki5NYXRyaXg0eDQpIHtcclxuICAgICAgc3VwZXIoX25hbWUsIF90cmFuc2Zvcm0pO1xyXG4gICAgICBsZXQgYXJyb3dSZWQ6IMaSLk5vZGUgPSBuZXcgTm9kZUFycm93KFwiQXJyb3dSZWRcIiwgbmV3IMaSLkNvbG9yKDEsIDAsIDAsIDEpKTtcclxuICAgICAgbGV0IGFycm93R3JlZW46IMaSLk5vZGUgPSBuZXcgTm9kZUFycm93KFwiQXJyb3dHcmVlblwiLCBuZXcgxpIuQ29sb3IoMCwgMSwgMCwgMSkpO1xyXG4gICAgICBsZXQgYXJyb3dCbHVlOiDGki5Ob2RlID0gbmV3IE5vZGVBcnJvdyhcIkFycm93Qmx1ZVwiLCBuZXcgxpIuQ29sb3IoMCwgMCwgMSwgMSkpO1xyXG5cclxuICAgICAgYXJyb3dSZWQubXR4TG9jYWwucm90YXRlWSg5MCk7XHJcbiAgICAgIGFycm93R3JlZW4ubXR4TG9jYWwucm90YXRlWCgtOTApO1xyXG5cclxuICAgICAgdGhpcy5hZGRDaGlsZChhcnJvd1JlZCk7XHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQoYXJyb3dHcmVlbik7XHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQoYXJyb3dCbHVlKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhIGxpZ2h0IHNldHVwIHRvIHRoZSBub2RlIGdpdmVuLCBjb25zaXN0aW5nIG9mIGFuIGFtYmllbnQgbGlnaHQsIGEgZGlyZWN0aW9uYWwga2V5IGxpZ2h0IGFuZCBhIGRpcmVjdGlvbmFsIGJhY2sgbGlnaHQuXHJcbiAgICogRXhlcHQgb2YgdGhlIG5vZGUgdG8gYmVjb21lIHRoZSBjb250YWluZXIsIGFsbCBwYXJhbWV0ZXJzIGFyZSBvcHRpb25hbCBhbmQgcHJvdmlkZWQgZGVmYXVsdCB2YWx1ZXMgZm9yIGdlbmVyYWwgcHVycG9zZS4gXHJcbiAgICovXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIGFkZFN0YW5kYXJkTGlnaHRDb21wb25lbnRzKFxyXG4gICAgX25vZGU6IMaSLk5vZGUsXHJcbiAgICBfY2xyQW1iaWVudDogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoMC4yLCAwLjIsIDAuMiksIF9jbHJLZXk6IMaSLkNvbG9yID0gbmV3IMaSLkNvbG9yKDAuOSwgMC45LCAwLjkpLCBfY2xyQmFjazogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoMC42LCAwLjYsIDAuNiksXHJcbiAgICBfcG9zS2V5OiDGki5WZWN0b3IzID0gbmV3IMaSLlZlY3RvcjMoNCwgMTIsIDgpLCBfcG9zQmFjazogxpIuVmVjdG9yMyA9IG5ldyDGki5WZWN0b3IzKC0xLCAtMC41LCAtMylcclxuICApOiB2b2lkIHtcclxuICAgIGxldCBrZXk6IMaSLkNvbXBvbmVudExpZ2h0ID0gbmV3IMaSLkNvbXBvbmVudExpZ2h0KG5ldyDGki5MaWdodERpcmVjdGlvbmFsKF9jbHJLZXkpKTtcclxuICAgIGtleS5tdHhQaXZvdC50cmFuc2xhdGUoX3Bvc0tleSk7XHJcbiAgICBrZXkubXR4UGl2b3QubG9va0F0KMaSLlZlY3RvcjMuWkVSTygpKTtcclxuXHJcbiAgICBsZXQgYmFjazogxpIuQ29tcG9uZW50TGlnaHQgPSBuZXcgxpIuQ29tcG9uZW50TGlnaHQobmV3IMaSLkxpZ2h0RGlyZWN0aW9uYWwoX2NsckJhY2spKTtcclxuICAgIGJhY2subXR4UGl2b3QudHJhbnNsYXRlKF9wb3NCYWNrKTtcclxuICAgIGJhY2subXR4UGl2b3QubG9va0F0KMaSLlZlY3RvcjMuWkVSTygpKTtcclxuXHJcbiAgICBsZXQgYW1iaWVudDogxpIuQ29tcG9uZW50TGlnaHQgPSBuZXcgxpIuQ29tcG9uZW50TGlnaHQobmV3IMaSLkxpZ2h0QW1iaWVudChfY2xyQW1iaWVudCkpO1xyXG5cclxuICAgIF9ub2RlLmFkZENvbXBvbmVudChrZXkpO1xyXG4gICAgX25vZGUuYWRkQ29tcG9uZW50KGJhY2spO1xyXG4gICAgX25vZGUuYWRkQ29tcG9uZW50KGFtYmllbnQpO1xyXG4gIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICAvKipcclxuICAgKiBIYW5kbGVzIHRoZSBhbmltYXRpb24gY3ljbGUgb2YgYSBzcHJpdGUgb24gYSBbW05vZGVdXVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBOb2RlU3ByaXRlIGV4dGVuZHMgxpIuTm9kZSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtZXNoOiDGki5NZXNoU3ByaXRlID0gTm9kZVNwcml0ZS5jcmVhdGVJbnRlcm5hbFJlc291cmNlKCk7XHJcbiAgICBwdWJsaWMgZnJhbWVyYXRlOiBudW1iZXIgPSAxMjsgLy8gYW5pbWF0aW9uIGZyYW1lcyBwZXIgc2Vjb25kLCBzaW5nbGUgZnJhbWVzIGNhbiBiZSBzaG9ydGVyIG9yIGxvbmdlciBiYXNlZCBvbiB0aGVpciB0aW1lc2NhbGVcclxuXHJcbiAgICBwcml2YXRlIGNtcE1lc2g6IMaSLkNvbXBvbmVudE1lc2g7XHJcbiAgICBwcml2YXRlIGNtcE1hdGVyaWFsOiDGki5Db21wb25lbnRNYXRlcmlhbDtcclxuICAgIHByaXZhdGUgYW5pbWF0aW9uOiBTcHJpdGVTaGVldEFuaW1hdGlvbjtcclxuICAgIHByaXZhdGUgZnJhbWVDdXJyZW50OiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBkaXJlY3Rpb246IG51bWJlciA9IDE7XHJcbiAgICBwcml2YXRlIHRpbWVyOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcpIHtcclxuICAgICAgc3VwZXIoX25hbWUpO1xyXG5cclxuICAgICAgdGhpcy5jbXBNZXNoID0gbmV3IMaSLkNvbXBvbmVudE1lc2goTm9kZVNwcml0ZS5tZXNoKTtcclxuICAgICAgLy8gRGVmaW5lIGNvYXQgZnJvbSB0aGUgU3ByaXRlU2hlZXQgdG8gdXNlIHdoZW4gcmVuZGVyaW5nXHJcbiAgICAgIHRoaXMuY21wTWF0ZXJpYWwgPSBuZXcgxpIuQ29tcG9uZW50TWF0ZXJpYWwobmV3IMaSLk1hdGVyaWFsKF9uYW1lLCDGki5TaGFkZXJMaXRUZXh0dXJlZCwgbnVsbCkpO1xyXG4gICAgICB0aGlzLmFkZENvbXBvbmVudCh0aGlzLmNtcE1lc2gpO1xyXG4gICAgICB0aGlzLmFkZENvbXBvbmVudCh0aGlzLmNtcE1hdGVyaWFsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBjcmVhdGVJbnRlcm5hbFJlc291cmNlKCk6IMaSLk1lc2hTcHJpdGUge1xyXG4gICAgICBsZXQgbWVzaDogxpIuTWVzaFNwcml0ZSA9IG5ldyDGki5NZXNoU3ByaXRlKFwiU3ByaXRlXCIpO1xyXG4gICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIobWVzaCk7XHJcbiAgICAgIHJldHVybiBtZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMgdGhlIG51bWJlciBvZiB0aGUgY3VycmVudCBmcmFtZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGdldEN1cnJlbnRGcmFtZSgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5mcmFtZUN1cnJlbnQ7IH0gLy9Ub0RvOiBzZWUgaWYgZ2V0ZnJhbWVDdXJyZW50IGlzIHByb2JsZW1hdGljXHJcblxyXG4gICAgcHVibGljIHNldEFuaW1hdGlvbihfYW5pbWF0aW9uOiBTcHJpdGVTaGVldEFuaW1hdGlvbik6IHZvaWQge1xyXG4gICAgICB0aGlzLmFuaW1hdGlvbiA9IF9hbmltYXRpb247XHJcbiAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbigpO1xyXG4gICAgICB0aGlzLnNob3dGcmFtZSgwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RvcEFuaW1hdGlvbigpOiB2b2lkIHtcclxuICAgICAgaWYgKHRoaXMudGltZXIpXHJcbiAgICAgICAgxpIuVGltZS5nYW1lLmRlbGV0ZVRpbWVyKHRoaXMudGltZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvdyBhIHNwZWNpZmljIGZyYW1lIG9mIHRoZSBzZXF1ZW5jZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvd0ZyYW1lKF9pbmRleDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbigpO1xyXG4gICAgICBsZXQgc3ByaXRlRnJhbWU6IFNwcml0ZUZyYW1lID0gdGhpcy5hbmltYXRpb24uZnJhbWVzW19pbmRleF07XHJcbiAgICAgIHRoaXMuY21wTWVzaC5tdHhQaXZvdCA9IHNwcml0ZUZyYW1lLm10eFBpdm90O1xyXG4gICAgICB0aGlzLmNtcE1hdGVyaWFsLm10eFBpdm90ID0gc3ByaXRlRnJhbWUubXR4VGV4dHVyZTtcclxuICAgICAgdGhpcy5jbXBNYXRlcmlhbC5tYXRlcmlhbC5jb2F0ID0gdGhpcy5hbmltYXRpb24uc3ByaXRlc2hlZXQ7XHJcbiAgICAgIHRoaXMuZnJhbWVDdXJyZW50ID0gX2luZGV4O1xyXG4gICAgICB0aGlzLnRpbWVyID0gxpIuVGltZS5nYW1lLnNldFRpbWVyKHNwcml0ZUZyYW1lLnRpbWVTY2FsZSAqIDEwMDAgLyB0aGlzLmZyYW1lcmF0ZSwgMSwgdGhpcy5zaG93RnJhbWVOZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3cgdGhlIG5leHQgZnJhbWUgb2YgdGhlIHNlcXVlbmNlIG9yIHN0YXJ0IGFuZXcgd2hlbiB0aGUgZW5kIG9yIHRoZSBzdGFydCB3YXMgcmVhY2hlZCwgYWNjb3JkaW5nIHRvIHRoZSBkaXJlY3Rpb24gb2YgcGxheWluZ1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvd0ZyYW1lTmV4dCA9IChfZXZlbnQ6IMaSLkV2ZW50VGltZXIpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy5mcmFtZUN1cnJlbnQgPSAodGhpcy5mcmFtZUN1cnJlbnQgKyB0aGlzLmRpcmVjdGlvbiArIHRoaXMuYW5pbWF0aW9uLmZyYW1lcy5sZW5ndGgpICUgdGhpcy5hbmltYXRpb24uZnJhbWVzLmxlbmd0aDtcclxuICAgICAgdGhpcy5zaG93RnJhbWUodGhpcy5mcmFtZUN1cnJlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhlIGRpcmVjdGlvbiBmb3IgYW5pbWF0aW9uIHBsYXliYWNrLCBuZWdhdGl2IG51bWJlcnMgbWFrZSBpdCBwbGF5IGJhY2t3YXJkcy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEZyYW1lRGlyZWN0aW9uKF9kaXJlY3Rpb246IG51bWJlcik6IHZvaWQge1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IE1hdGguZmxvb3IoX2RpcmVjdGlvbik7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIERlc2NyaWJlcyBhIHNpbmdsZSBmcmFtZSBvZiBhIHNwcml0ZSBhbmltYXRpb25cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgU3ByaXRlRnJhbWUge1xyXG4gICAgcHVibGljIHJlY3RUZXh0dXJlOiDGki5SZWN0YW5nbGU7XHJcbiAgICBwdWJsaWMgbXR4UGl2b3Q6IMaSLk1hdHJpeDR4NDtcclxuICAgIHB1YmxpYyBtdHhUZXh0dXJlOiDGki5NYXRyaXgzeDM7XHJcbiAgICBwdWJsaWMgdGltZVNjYWxlOiBudW1iZXI7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb252ZW5pZW5jZSBmb3IgY3JlYXRpbmcgYSBbW0NvYXRUZXh0dXJlXV0gdG8gdXNlIGFzIHNwcml0ZXNoZWV0XHJcbiAgICovXHJcbiAgZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNwcml0ZVNoZWV0KF9uYW1lOiBzdHJpbmcsIF9pbWFnZTogSFRNTEltYWdlRWxlbWVudCk6IMaSLkNvYXRUZXh0dXJlZCB7XHJcbiAgICBsZXQgY29hdDogxpIuQ29hdFRleHR1cmVkID0gbmV3IMaSLkNvYXRUZXh0dXJlZCgpO1xyXG4gICAgbGV0IHRleHR1cmU6IMaSLlRleHR1cmVJbWFnZSA9IG5ldyDGki5UZXh0dXJlSW1hZ2UoKTtcclxuICAgIHRleHR1cmUuaW1hZ2UgPSBfaW1hZ2U7XHJcbiAgICBjb2F0LnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gICAgcmV0dXJuIGNvYXQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIb2xkcyBTcHJpdGVTaGVldEFuaW1hdGlvbnMgaW4gYW4gYXNzb2NpYXRpdmUgaGllcmFyY2hpY2FsIGFycmF5XHJcbiAgICovXHJcbiAgZXhwb3J0IGludGVyZmFjZSBTcHJpdGVTaGVldEFuaW1hdGlvbnMge1xyXG4gICAgW2tleTogc3RyaW5nXTogU3ByaXRlU2hlZXRBbmltYXRpb24gfCBTcHJpdGVTaGVldEFuaW1hdGlvbnM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVzIGEgc2VyaWVzIG9mIFtbU3ByaXRlRnJhbWVdXXMgdG8gYmUgbWFwcGVkIG9udG8gYSBbW01lc2hTcHJpdGVdXVxyXG4gICAqIENvbnRhaW5zIHRoZSBbW01lc2hTcHJpdGVdXSwgdGhlIFtbTWF0ZXJpYWxdXSBhbmQgdGhlIHNwcml0ZXNoZWV0LXRleHR1cmVcclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgU3ByaXRlU2hlZXRBbmltYXRpb24ge1xyXG4gICAgcHVibGljIGZyYW1lczogU3ByaXRlRnJhbWVbXSA9IFtdO1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBzcHJpdGVzaGVldDogxpIuQ29hdFRleHR1cmVkO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihfbmFtZTogc3RyaW5nLCBfc3ByaXRlc2hlZXQ6IMaSLkNvYXRUZXh0dXJlZCkge1xyXG4gICAgICB0aGlzLm5hbWUgPSBfbmFtZTtcclxuICAgICAgdGhpcy5zcHJpdGVzaGVldCA9IF9zcHJpdGVzaGVldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN0b3JlcyBhIHNlcmllcyBvZiBmcmFtZXMgaW4gdGhpcyBbW1Nwcml0ZV1dLCBjYWxjdWxhdGluZyB0aGUgbWF0cmljZXMgdG8gdXNlIGluIHRoZSBjb21wb25lbnRzIG9mIGEgW1tOb2RlU3ByaXRlXV1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdlbmVyYXRlKF9yZWN0czogxpIuUmVjdGFuZ2xlW10sIF9yZXNvbHV0aW9uUXVhZDogbnVtYmVyLCBfb3JpZ2luOiDGki5PUklHSU4yRCk6IHZvaWQge1xyXG4gICAgICBsZXQgaW1nOiBUZXhJbWFnZVNvdXJjZSA9IHRoaXMuc3ByaXRlc2hlZXQudGV4dHVyZS50ZXhJbWFnZVNvdXJjZTtcclxuICAgICAgdGhpcy5mcmFtZXMgPSBbXTtcclxuICAgICAgbGV0IGZyYW1pbmc6IMaSLkZyYW1pbmdTY2FsZWQgPSBuZXcgxpIuRnJhbWluZ1NjYWxlZCgpO1xyXG4gICAgICBmcmFtaW5nLnNldFNjYWxlKDEgLyBpbWcud2lkdGgsIDEgLyBpbWcuaGVpZ2h0KTtcclxuXHJcbiAgICAgIGxldCBjb3VudDogbnVtYmVyID0gMDtcclxuICAgICAgZm9yIChsZXQgcmVjdCBvZiBfcmVjdHMpIHtcclxuICAgICAgICBsZXQgZnJhbWU6IFNwcml0ZUZyYW1lID0gdGhpcy5jcmVhdGVGcmFtZSh0aGlzLm5hbWUgKyBgJHtjb3VudH1gLCBmcmFtaW5nLCByZWN0LCBfcmVzb2x1dGlvblF1YWQsIF9vcmlnaW4pO1xyXG4gICAgICAgIGZyYW1lLnRpbWVTY2FsZSA9IDE7XHJcbiAgICAgICAgdGhpcy5mcmFtZXMucHVzaChmcmFtZSk7XHJcblxyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBzcHJpdGUgZnJhbWVzIHVzaW5nIGEgZ3JpZCBvbiB0aGUgc3ByaXRlc2hlZXQgZGVmaW5lZCBieSBhIHJlY3RhbmdsZSB0byBzdGFydCB3aXRoLCB0aGUgbnVtYmVyIG9mIGZyYW1lcywgXHJcbiAgICAgKiB0aGUgcmVzb2x1dGlvbiB3aGljaCBkZXRlcm1pbmVzIHRoZSBzaXplIG9mIHRoZSBzcHJpdGVzIG1lc2ggYmFzZWQgb24gdGhlIG51bWJlciBvZiBwaXhlbHMgb2YgdGhlIHRleHR1cmUgZnJhbWUsXHJcbiAgICAgKiB0aGUgb2Zmc2V0IGZyb20gb25lIGNlbGwgb2YgdGhlIGdyaWQgdG8gdGhlIG5leHQgaW4gdGhlIHNlcXVlbmNlIGFuZCwgaW4gY2FzZSB0aGUgc2VxdWVuY2Ugc3BhbnMgb3ZlciBtb3JlIHRoYW4gb25lIHJvdyBvciBjb2x1bW4sXHJcbiAgICAgKiB0aGUgb2Zmc2V0IHRvIG1vdmUgdGhlIHN0YXJ0IHJlY3RhbmdsZSB3aGVuIHRoZSBtYXJnaW4gb2YgdGhlIHRleHR1cmUgaXMgcmVhY2hlZCBhbmQgd3JhcHBpbmcgb2NjdXJzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2VuZXJhdGVCeUdyaWQoX3N0YXJ0UmVjdDogxpIuUmVjdGFuZ2xlLCBfZnJhbWVzOiBudW1iZXIsIF9yZXNvbHV0aW9uUXVhZDogbnVtYmVyLCBfb3JpZ2luOiDGki5PUklHSU4yRCwgX29mZnNldE5leHQ6IMaSLlZlY3RvcjIsIF9vZmZzZXRXcmFwOiDGki5WZWN0b3IyID0gxpIuVmVjdG9yMi5aRVJPKCkpOiB2b2lkIHtcclxuICAgICAgbGV0IGltZzogVGV4SW1hZ2VTb3VyY2UgPSB0aGlzLnNwcml0ZXNoZWV0LnRleHR1cmUudGV4SW1hZ2VTb3VyY2U7XHJcbiAgICAgIGxldCByZWN0SW1hZ2U6IMaSLlJlY3RhbmdsZSA9IG5ldyDGki5SZWN0YW5nbGUoMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcclxuICAgICAgbGV0IHJlY3Q6IMaSLlJlY3RhbmdsZSA9IF9zdGFydFJlY3QuY2xvbmU7XHJcbiAgICAgIGxldCByZWN0czogxpIuUmVjdGFuZ2xlW10gPSBbXTtcclxuICAgICAgd2hpbGUgKF9mcmFtZXMtLSkge1xyXG4gICAgICAgIHJlY3RzLnB1c2gocmVjdC5jbG9uZSk7XHJcbiAgICAgICAgcmVjdC5wb3NpdGlvbi5hZGQoX29mZnNldE5leHQpO1xyXG5cclxuICAgICAgICBpZiAocmVjdEltYWdlLmNvdmVycyhyZWN0KSlcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICBfc3RhcnRSZWN0LnBvc2l0aW9uLmFkZChfb2Zmc2V0V3JhcCk7XHJcbiAgICAgICAgcmVjdCA9IF9zdGFydFJlY3QuY2xvbmU7XHJcbiAgICAgICAgaWYgKCFyZWN0SW1hZ2UuY292ZXJzKHJlY3QpKVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlY3RzLmZvckVhY2goKF9yZWN0OiDGki5SZWN0YW5nbGUpID0+IMaSLkRlYnVnLmxvZyhfcmVjdC50b1N0cmluZygpKSk7XHJcbiAgICAgIHRoaXMuZ2VuZXJhdGUocmVjdHMsIF9yZXNvbHV0aW9uUXVhZCwgX29yaWdpbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVGcmFtZShfbmFtZTogc3RyaW5nLCBfZnJhbWluZzogxpIuRnJhbWluZ1NjYWxlZCwgX3JlY3Q6IMaSLlJlY3RhbmdsZSwgX3Jlc29sdXRpb25RdWFkOiBudW1iZXIsIF9vcmlnaW46IMaSLk9SSUdJTjJEKTogU3ByaXRlRnJhbWUge1xyXG4gICAgICBsZXQgaW1nOiBUZXhJbWFnZVNvdXJjZSA9IHRoaXMuc3ByaXRlc2hlZXQudGV4dHVyZS50ZXhJbWFnZVNvdXJjZTtcclxuICAgICAgbGV0IHJlY3RUZXh0dXJlOiDGki5SZWN0YW5nbGUgPSBuZXcgxpIuUmVjdGFuZ2xlKDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCk7XHJcbiAgICAgIGxldCBmcmFtZTogU3ByaXRlRnJhbWUgPSBuZXcgU3ByaXRlRnJhbWUoKTtcclxuXHJcbiAgICAgIGZyYW1lLnJlY3RUZXh0dXJlID0gX2ZyYW1pbmcuZ2V0UmVjdChfcmVjdCk7XHJcbiAgICAgIGZyYW1lLnJlY3RUZXh0dXJlLnBvc2l0aW9uID0gX2ZyYW1pbmcuZ2V0UG9pbnQoX3JlY3QucG9zaXRpb24sIHJlY3RUZXh0dXJlKTtcclxuXHJcbiAgICAgIGxldCByZWN0UXVhZDogxpIuUmVjdGFuZ2xlID0gbmV3IMaSLlJlY3RhbmdsZSgwLCAwLCBfcmVjdC53aWR0aCAvIF9yZXNvbHV0aW9uUXVhZCwgX3JlY3QuaGVpZ2h0IC8gX3Jlc29sdXRpb25RdWFkLCBfb3JpZ2luKTtcclxuICAgICAgZnJhbWUubXR4UGl2b3QgPSDGki5NYXRyaXg0eDQuSURFTlRJVFkoKTtcclxuICAgICAgZnJhbWUubXR4UGl2b3QudHJhbnNsYXRlKG5ldyDGki5WZWN0b3IzKHJlY3RRdWFkLnBvc2l0aW9uLnggKyByZWN0UXVhZC5zaXplLnggLyAyLCAtcmVjdFF1YWQucG9zaXRpb24ueSAtIHJlY3RRdWFkLnNpemUueSAvIDIsIDApKTtcclxuICAgICAgZnJhbWUubXR4UGl2b3Quc2NhbGVYKHJlY3RRdWFkLnNpemUueCk7XHJcbiAgICAgIGZyYW1lLm10eFBpdm90LnNjYWxlWShyZWN0UXVhZC5zaXplLnkpO1xyXG4gICAgICAvLyDGki5EZWJ1Zy5sb2cocmVjdFF1YWQudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICBmcmFtZS5tdHhUZXh0dXJlID0gxpIuTWF0cml4M3gzLklERU5USVRZKCk7XHJcbiAgICAgIGZyYW1lLm10eFRleHR1cmUudHJhbnNsYXRlKGZyYW1lLnJlY3RUZXh0dXJlLnBvc2l0aW9uKTtcclxuICAgICAgZnJhbWUubXR4VGV4dHVyZS5zY2FsZShmcmFtZS5yZWN0VGV4dHVyZS5zaXplKTtcclxuXHJcbiAgICAgIHJldHVybiBmcmFtZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuICBcclxuICBleHBvcnQgY2xhc3MgQ29tcG9uZW50U3RhdGVNYWNoaW5lPFN0YXRlPiBleHRlbmRzIMaSLkNvbXBvbmVudFNjcmlwdCBpbXBsZW1lbnRzIFN0YXRlTWFjaGluZTxTdGF0ZT4ge1xyXG4gICAgcHVibGljIHN0YXRlQ3VycmVudDogU3RhdGU7XHJcbiAgICBwdWJsaWMgc3RhdGVOZXh0OiBTdGF0ZTtcclxuICAgIHB1YmxpYyBpbnN0cnVjdGlvbnM6IFN0YXRlTWFjaGluZUluc3RydWN0aW9uczxTdGF0ZT47XHJcblxyXG4gICAgcHVibGljIHRyYW5zaXQoX25leHQ6IFN0YXRlKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLnRyYW5zaXQodGhpcy5zdGF0ZUN1cnJlbnQsIF9uZXh0LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWN0KCk6IHZvaWQge1xyXG4gICAgICB0aGlzLmluc3RydWN0aW9ucy5hY3QodGhpcy5zdGF0ZUN1cnJlbnQsIHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIi8qKlxyXG4gKiBTdGF0ZSBtYWNoaW5lIG9mZmVycyBhIHN0cnVjdHVyZSBhbmQgZnVuZGFtZW50YWwgZnVuY3Rpb25hbGl0eSBmb3Igc3RhdGUgbWFjaGluZXNcclxuICogPFN0YXRlPiBzaG91bGQgYmUgYW4gZW51bSBkZWZpbmluZyB0aGUgdmFyaW91cyBzdGF0ZXMgb2YgdGhlIG1hY2hpbmVcclxuICovXHJcblxyXG5uYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIC8qKiBGb3JtYXQgb2YgbWV0aG9kcyB0byBiZSB1c2VkIGFzIHRyYW5zaXRpb25zIG9yIGFjdGlvbnMgKi9cclxuICB0eXBlIFN0YXRlTWFjaGluZU1ldGhvZDxTdGF0ZT4gPSAoX21hY2hpbmU6IFN0YXRlTWFjaGluZTxTdGF0ZT4pID0+IHZvaWQ7XHJcbiAgLyoqIFR5cGUgZm9yIG1hcHMgYXNzb2NpYXRpbmcgYSBzdGF0ZSB0byBhIG1ldGhvZCAqL1xyXG4gIHR5cGUgU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZDxTdGF0ZT4gPSBNYXA8U3RhdGUsIFN0YXRlTWFjaGluZU1ldGhvZDxTdGF0ZT4+O1xyXG4gIC8qKiBJbnRlcmZhY2UgbWFwcGluZyBhIHN0YXRlIHRvIG9uZSBhY3Rpb24gbXVsdGlwbGUgdHJhbnNpdGlvbnMgKi9cclxuICBpbnRlcmZhY2UgU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+IHtcclxuICAgIGFjdGlvbjogU3RhdGVNYWNoaW5lTWV0aG9kPFN0YXRlPjtcclxuICAgIHRyYW5zaXRpb25zOiBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kPFN0YXRlPjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvcmUgZnVuY3Rpb25hbGl0eSBvZiB0aGUgc3RhdGUgbWFjaGluZSwgaG9sZGluZyBzb2xlbHkgdGhlIGN1cnJlbnQgc3RhdGUgYW5kLCB3aGlsZSBpbiB0cmFuc2l0aW9uLCB0aGUgbmV4dCBzdGF0ZSxcclxuICAgKiB0aGUgaW5zdHJ1Y3Rpb25zIGZvciB0aGUgbWFjaGluZSBhbmQgY29tZm9ydCBtZXRob2RzIHRvIHRyYW5zaXQgYW5kIGFjdC5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgU3RhdGVNYWNoaW5lPFN0YXRlPiB7XHJcbiAgICBwdWJsaWMgc3RhdGVDdXJyZW50OiBTdGF0ZTtcclxuICAgIHB1YmxpYyBzdGF0ZU5leHQ6IFN0YXRlO1xyXG4gICAgcHVibGljIGluc3RydWN0aW9uczogU3RhdGVNYWNoaW5lSW5zdHJ1Y3Rpb25zPFN0YXRlPjtcclxuXHJcbiAgICBwdWJsaWMgdHJhbnNpdChfbmV4dDogU3RhdGUpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbnN0cnVjdGlvbnMudHJhbnNpdCh0aGlzLnN0YXRlQ3VycmVudCwgX25leHQsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3QoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLmFjdCh0aGlzLnN0YXRlQ3VycmVudCwgdGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgb2YgaW5zdHJ1Y3Rpb25zIGZvciBhIHN0YXRlIG1hY2hpbmUuIFRoZSBzZXQga2VlcHMgYWxsIG1ldGhvZHMgZm9yIGRlZGljYXRlZCBhY3Rpb25zIGRlZmluZWQgZm9yIHRoZSBzdGF0ZXNcclxuICAgKiBhbmQgYWxsIGRlZGljYXRlZCBtZXRob2RzIGRlZmluZWQgZm9yIHRyYW5zaXRpb25zIHRvIG90aGVyIHN0YXRlcywgYXMgd2VsbCBhcyBkZWZhdWx0IG1ldGhvZHMuXHJcbiAgICogSW5zdHJ1Y3Rpb25zIGV4aXN0IGluZGVwZW5kZW50bHkgZnJvbSBTdGF0ZU1hY2hpbmVzLiBBIHN0YXRlbWFjaGluZSBpbnN0YW5jZSBpcyBwYXNzZWQgYXMgcGFyYW1ldGVyIHRvIHRoZSBpbnN0cnVjdGlvbiBzZXQuXHJcbiAgICogTXVsdGlwbGUgc3RhdGVtYWNoaW5lLWluc3RhbmNlcyBjYW4gdGh1cyB1c2UgdGhlIHNhbWUgaW5zdHJ1Y3Rpb24gc2V0IGFuZCBkaWZmZXJlbnQgaW5zdHJ1Y3Rpb24gc2V0cyBjb3VsZCBvcGVyYXRlIG9uIHRoZSBzYW1lIHN0YXRlbWFjaGluZS5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgU3RhdGVNYWNoaW5lSW5zdHJ1Y3Rpb25zPFN0YXRlPiBleHRlbmRzIE1hcDxTdGF0ZSwgU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+PiB7XHJcbiAgICAvKiogRGVmaW5lIGRlZGljYXRlZCB0cmFuc2l0aW9uIG1ldGhvZCB0byB0cmFuc2l0IGZyb20gb25lIHN0YXRlIHRvIGFub3RoZXIqL1xyXG4gICAgcHVibGljIHNldFRyYW5zaXRpb24oX2N1cnJlbnQ6IFN0YXRlLCBfbmV4dDogU3RhdGUsIF90cmFuc2l0aW9uOiBTdGF0ZU1hY2hpbmVNZXRob2Q8U3RhdGU+KTogdm9pZCB7XHJcbiAgICAgIGxldCBhY3RpdmU6IFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPiA9IHRoaXMuZ2V0U3RhdGVNZXRob2RzKF9jdXJyZW50KTtcclxuICAgICAgYWN0aXZlLnRyYW5zaXRpb25zLnNldChfbmV4dCwgX3RyYW5zaXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBEZWZpbmUgZGVkaWNhdGVkIGFjdGlvbiBtZXRob2QgZm9yIGEgc3RhdGUgKi9cclxuICAgIHB1YmxpYyBzZXRBY3Rpb24oX2N1cnJlbnQ6IFN0YXRlLCBfYWN0aW9uOiBTdGF0ZU1hY2hpbmVNZXRob2Q8U3RhdGU+KTogdm9pZCB7XHJcbiAgICAgIGxldCBhY3RpdmU6IFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPiA9IHRoaXMuZ2V0U3RhdGVNZXRob2RzKF9jdXJyZW50KTtcclxuICAgICAgYWN0aXZlLmFjdGlvbiA9IF9hY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIERlZmF1bHQgdHJhbnNpdGlvbiBtZXRob2QgdG8gaW52b2tlIGlmIG5vIGRlZGljYXRlZCB0cmFuc2l0aW9uIGV4aXN0cywgc2hvdWxkIGJlIG92ZXJyaWRlbiBpbiBzdWJjbGFzcyAqL1xyXG4gICAgcHVibGljIHRyYW5zaXREZWZhdWx0KF9tYWNoaW5lOiBTdGF0ZU1hY2hpbmU8U3RhdGU+KTogdm9pZCB7XHJcbiAgICAgIC8vXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKiBEZWZhdWx0IGFjdGlvbiBtZXRob2QgdG8gaW52b2tlIGlmIG5vIGRlZGljYXRlZCBhY3Rpb24gZXhpc3RzLCBzaG91bGQgYmUgb3ZlcnJpZGVuIGluIHN1YmNsYXNzICovXHJcbiAgICBwdWJsaWMgYWN0RGVmYXVsdChfbWFjaGluZTogU3RhdGVNYWNoaW5lPFN0YXRlPik6IHZvaWQge1xyXG4gICAgICAvL1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBJbnZva2UgYSBkZWRpY2F0ZWQgdHJhbnNpdGlvbiBtZXRob2QgaWYgZm91bmQgZm9yIHRoZSBjdXJyZW50IGFuZCB0aGUgbmV4dCBzdGF0ZSwgb3IgdGhlIGRlZmF1bHQgbWV0aG9kICovXHJcbiAgICBwdWJsaWMgdHJhbnNpdChfY3VycmVudDogU3RhdGUsIF9uZXh0OiBTdGF0ZSwgX21hY2hpbmU6IFN0YXRlTWFjaGluZTxTdGF0ZT4pOiB2b2lkIHtcclxuICAgICAgX21hY2hpbmUuc3RhdGVOZXh0ID0gX25leHQ7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGFjdGl2ZTogU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+ID0gdGhpcy5nZXQoX2N1cnJlbnQpO1xyXG4gICAgICAgIGxldCB0cmFuc2l0aW9uOiBTdGF0ZU1hY2hpbmVNZXRob2Q8U3RhdGU+ID0gYWN0aXZlLnRyYW5zaXRpb25zLmdldChfbmV4dCk7XHJcbiAgICAgICAgdHJhbnNpdGlvbihfbWFjaGluZSk7XHJcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xyXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyhfZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy50cmFuc2l0RGVmYXVsdChfbWFjaGluZSk7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgX21hY2hpbmUuc3RhdGVDdXJyZW50ID0gX25leHQ7XHJcbiAgICAgICAgX21hY2hpbmUuc3RhdGVOZXh0ID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEludm9rZSB0aGUgZGVkaWNhdGVkIGFjdGlvbiBtZXRob2QgaWYgZm91bmQgZm9yIHRoZSBjdXJyZW50IHN0YXRlLCBvciB0aGUgZGVmYXVsdCBtZXRob2QgKi9cclxuICAgIHB1YmxpYyBhY3QoX2N1cnJlbnQ6IFN0YXRlLCBfbWFjaGluZTogU3RhdGVNYWNoaW5lPFN0YXRlPik6IHZvaWQge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGxldCBhY3RpdmU6IFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPiA9IHRoaXMuZ2V0KF9jdXJyZW50KTtcclxuICAgICAgICBhY3RpdmUuYWN0aW9uKF9tYWNoaW5lKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKF9lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB0aGlzLmFjdERlZmF1bHQoX21hY2hpbmUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEZpbmQgdGhlIGluc3RydWN0aW9ucyBkZWRpY2F0ZWQgZm9yIHRoZSBjdXJyZW50IHN0YXRlIG9yIGNyZWF0ZSBhbiBlbXB0eSBzZXQgZm9yIGl0ICovXHJcbiAgICBwcml2YXRlIGdldFN0YXRlTWV0aG9kcyhfY3VycmVudDogU3RhdGUpOiBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kczxTdGF0ZT4ge1xyXG4gICAgICBsZXQgYWN0aXZlOiBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kczxTdGF0ZT4gPSB0aGlzLmdldChfY3VycmVudCk7XHJcbiAgICAgIGlmICghYWN0aXZlKSB7XHJcbiAgICAgICAgYWN0aXZlID0geyBhY3Rpb246IG51bGwsIHRyYW5zaXRpb25zOiBuZXcgTWFwKCkgfTtcclxuICAgICAgICB0aGlzLnNldChfY3VycmVudCwgYWN0aXZlKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYWN0aXZlO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBBbGxvd3MgdG8gdHJhbnNsYXRlLCByb3RhdGUgYW5kIHNjYWxlIG1hdHJpY2VzIHZpc3VhbGx5IGJ5IGRyYWdnaW5nIHdpdGggYSBwb2ludGVyLiBcclxuICAgKiBJbnN0YWxscyBwb2ludGVyIGV2ZW50IGxpc3RlbmVycyBvbiB0aGUgZ2l2ZW4ge0BsaW5rIMaSLlZpZXdwb3J0fXMgY2FudmFzIG9uIGNvbnN0cnVjdGlvbi4gXHJcbiAgICogVXNlIHtAbGluayBhZGRMaXN0ZW5lcnN9L3tAbGluayByZW1vdmVMaXN0ZW5lcnN9IHRvIGhhbmRsZSB0aGUgaW5zdGFsbGF0aW9uIG1hbnVhbGx5LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1hdG9yIHtcclxuICAgIHB1YmxpYyByZWFkb25seSB2aWV3cG9ydDogxpIuVmlld3BvcnQ7XHJcblxyXG4gICAgcHVibGljIG1vZGU6IFwidHJhbnNsYXRlXCIgfCBcInJvdGF0ZVwiIHwgXCJzY2FsZVwiID0gXCJ0cmFuc2xhdGVcIjtcclxuICAgIHB1YmxpYyBzcGFjZTogXCJsb2NhbFwiIHwgXCJ3b3JsZFwiID0gXCJ3b3JsZFwiO1xyXG4gICAgcHVibGljIHNlbGVjdGVkOiBcInhcIiB8IFwieVwiIHwgXCJ6XCIgfCBcInh5elwiO1xyXG5cclxuICAgIHB1YmxpYyBzbmFwQW5nbGU6IG51bWJlciA9IDE1OyAvLyAxNSBkZWdyZWVcclxuICAgIHB1YmxpYyBzbmFwRGlzdGFuY2U6IG51bWJlciA9IDAuMTsgLy8gMC4xIHVuaXRzXHJcbiAgICBwdWJsaWMgc25hcFNjYWxlOiBudW1iZXIgPSAwLjE7IC8vIDEwJVxyXG5cclxuICAgICN1bmRvOiAoKCkgPT4gdm9pZClbXSA9IFtdOyAvLyBzdGFjayBvZiBmdW5jdGlvbnMgdG8gdW5kbyB0aGUgbGFzdCB0cmFuc2Zvcm1hdGlvblxyXG5cclxuICAgICNtdHhMb2NhbDogxpIuTWF0cml4NHg0OyAvLyBsb2NhbCBtYXRyaXggb2YgdGhlIG9iamVjdCB0byBiZSB0cmFuc2Zvcm1lZFxyXG4gICAgI210eFdvcmxkOiDGki5NYXRyaXg0eDQ7IC8vIHdvcmxkIG1hdHJpeCBvZiB0aGUgb2JqZWN0IHRvIGJlIHRyYW5zZm9ybWVkXHJcblxyXG4gICAgI210eExvY2FsQmFzZTogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LklERU5USVRZKCk7IC8vIGxvY2FsIG1hdHJpeCBpbiBhIHN0YXRlIGJlZm9yZSBhIHRyYW5zZm9ybWF0aW9uIHN0YXJ0c1xyXG4gICAgI210eFdvcmxkQmFzZTogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LklERU5USVRZKCk7IC8vIHdvcmxkIG1hdHJpeCBpbiBhIHN0YXRlIGJlZm9yZSBhIHRyYW5zZm9ybWF0aW9uIHN0YXJ0c1xyXG5cclxuICAgICNvZmZzZXQ6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlpFUk8oKTsgLy8gb2ZmZXN0IHZlY3RvciBwb2ludGluZyBmcm9tIHRoZSB3b3JsZCBwb3NpdGlvbiBvZiB0aGUgb2JqZWN0IHRvIHdoZXJlIHRoZSBtb3VzZSByYXkgY29sbGlkZWQgd2l0aCB0aGUgcGxhbmUgb24gcG9pbnRlciBkb3duXHJcbiAgICAjZGlyZWN0aW9uOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5aRVJPKCk7IC8vIGRyaWVjdGlvbiB2ZWN0b3IgcG9pbnRpbmcgZnJvbSB0aGUgd29ybGQgcG9zaXRpb24gb2YgdGhlIG9iamVjdCB0byB3aGVyZSB0aGUgbW91c2UgcmF5IGNvbGxpZGVzIHdpdGggdGhlIHBsYW5lIChwb2ludGVyIG1vdmUpXHJcbiAgICAjc2NhbGVGYWN0b3I6IG51bWJlcjsgLy8gY3VycmVudCBzY2FsZSBmYWN0b3Igb2YgdGhlIHNjYWxpbmcgdHJhbnNmb3JtYXRpb25cclxuXHJcbiAgICAjaXNUcmFuc2Zvcm1pbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAjYXhlcyA9IHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICB4OiAoKSA9PiB0aGlzLnNwYWNlID09IFwid29ybGRcIiA/IMaSLlZlY3RvcjMuWCgpIDogdGhpcy4jbXR4V29ybGRCYXNlLnJpZ2h0LFxyXG4gICAgICB5OiAoKSA9PiB0aGlzLnNwYWNlID09IFwid29ybGRcIiA/IMaSLlZlY3RvcjMuWSgpIDogdGhpcy4jbXR4V29ybGRCYXNlLnVwLFxyXG4gICAgICB6OiAoKSA9PiB0aGlzLnNwYWNlID09IFwid29ybGRcIiA/IMaSLlZlY3RvcjMuWigpIDogdGhpcy4jbXR4V29ybGRCYXNlLmZvcndhcmRcclxuICAgIH07XHJcblxyXG4gICAgI25vcm1hbHMgPSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgeDogKCkgPT4gdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlooKSA6IHRoaXMuI210eFdvcmxkQmFzZS5mb3J3YXJkLFxyXG4gICAgICB5OiAoKSA9PiB0aGlzLnNwYWNlID09IFwid29ybGRcIiA/IMaSLlZlY3RvcjMuWCgpIDogdGhpcy4jbXR4V29ybGRCYXNlLnJpZ2h0LFxyXG4gICAgICB6OiAoKSA9PiB0aGlzLnNwYWNlID09IFwid29ybGRcIiA/IMaSLlZlY3RvcjMuWCgpIDogdGhpcy4jbXR4V29ybGRCYXNlLnJpZ2h0XHJcbiAgICB9O1xyXG5cclxuICAgICNub3JtYWw6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlpFUk8oKTtcclxuXHJcbiAgICAjY29sb3JzID0geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIHg6IMaSLkNvbG9yLkNTUyhcInJlZFwiKSxcclxuICAgICAgeTogxpIuQ29sb3IuQ1NTKFwibGltZWdyZWVuXCIpLFxyXG4gICAgICB6OiDGki5Db2xvci5DU1MoXCJibHVlXCIpLFxyXG4gICAgICBvcmlnaW46IMaSLkNvbG9yLkNTUyhcImRpbWdyYXlcIiwgMC43NSksXHJcbiAgICAgIHh5ejogxpIuQ29sb3IuQ1NTKFwiZ2FpbnNib3JvXCIpXHJcbiAgICB9O1xyXG5cclxuICAgICNjb2xvcnNMaXRlID0geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIHg6IMaSLkNvbG9yLkNTUyhcInNhbG1vblwiKSxcclxuICAgICAgeTogxpIuQ29sb3IuQ1NTKFwibGlnaHRncmVlblwiKSxcclxuICAgICAgejogxpIuQ29sb3IuQ1NTKFwiY29ybmZsb3dlcmJsdWVcIiksXHJcbiAgICAgIHh5ejogxpIuQ29sb3IuQ1NTKFwiZ2hvc3R3aGl0ZVwiKVxyXG4gICAgfTtcclxuXHJcbiAgICAjdG9ydXM6IMaSLk1lc2hUb3J1cztcclxuICAgICN0b3J1c1BpY2s6IMaSLk1lc2hUb3J1cztcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX3ZpZXdwb3J0OiDGki5WaWV3cG9ydCkge1xyXG4gICAgICB0aGlzLnZpZXdwb3J0ID0gX3ZpZXdwb3J0O1xyXG4gICAgICB0aGlzLmFkZExpc3RlbmVycygpO1xyXG4gICAgICB0aGlzLiN0b3J1cyA9IG5ldyDGki5NZXNoVG9ydXMoXCJUb3J1c1wiLCAwLjUgLSAwLjAwMDUsIDAuMDA1LCA2MCwgOCk7XHJcbiAgICAgIHRoaXMuI3RvcnVzUGljayA9IG5ldyDGki5NZXNoVG9ydXMoXCJUb3J1c1BpY2tcIiwgMC41IC0gMC4wMDMsIDAuMDMsIDYwLCA4KTtcclxuICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKHRoaXMuI3RvcnVzKTtcclxuICAgICAgxpIuUHJvamVjdC5kZXJlZ2lzdGVyKHRoaXMuI3RvcnVzUGljayk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBtdHhMb2NhbChfbXR4OiDGki5NYXRyaXg0eDQpIHtcclxuICAgICAgdGhpcy4jbXR4TG9jYWwgPSBfbXR4O1xyXG4gICAgICBpZiAodGhpcy4jbXR4TG9jYWwpXHJcbiAgICAgICAgdGhpcy4jbXR4TG9jYWxCYXNlLmNvcHkoX210eCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBtdHhXb3JsZChfbXR4OiDGki5NYXRyaXg0eDQpIHtcclxuICAgICAgdGhpcy4jbXR4V29ybGQgPSBfbXR4O1xyXG4gICAgICBpZiAodGhpcy4jbXR4V29ybGQpXHJcbiAgICAgICAgdGhpcy4jbXR4V29ybGRCYXNlLmNvcHkoX210eCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgY2FtZXJhKCk6IMaSLkNvbXBvbmVudENhbWVyYSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdwb3J0LmNhbWVyYTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBwb2ludGVyIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgdmlld3BvcnQgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRMaXN0ZW5lcnMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLmhuZFBvaW50ZXJEb3duKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMuaG5kUG9pbnRlck1vdmUpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJsZWF2ZVwiLCB0aGlzLmhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9FTkQsIHRoaXMuaG5kUmVuZGVyRW5kKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgcG9pbnRlciBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdmlld3BvcnQgY2FudmFzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVMaXN0ZW5lcnMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLmhuZFBvaW50ZXJEb3duKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMuaG5kUG9pbnRlck1vdmUpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJsZWF2ZVwiLCB0aGlzLmhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5yZW1vdmVFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9FTkQsIHRoaXMuaG5kUmVuZGVyRW5kKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbmRvIHRoZSBsYXN0IHRyYW5zZm9ybWF0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1bmRvKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy4jaXNUcmFuc2Zvcm1pbmcpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy4jdW5kby5wb3AoKT8uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgdW5kbyBzdGFja1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXJVbmRvKCk6IHZvaWQge1xyXG4gICAgICB0aGlzLiN1bmRvLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRyYXdHaXptb3MoX2NtcENhbWVyYTogxpIuQ29tcG9uZW50Q2FtZXJhKTogdm9pZCB7XHJcbiAgICAgIGlmICghdGhpcy4jbXR4TG9jYWwgfHwgIXRoaXMuI210eFdvcmxkKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IGlzUGlja2luZzogYm9vbGVhbiA9IF9jbXBDYW1lcmEgIT0gdGhpcy5jYW1lcmE7IC8vIGlmIHRoZSBjYW1lcmEgaXMgbm90IHRoZSB2aWV3cG9ydHMsIGl0IG11c3QgYmUgdGhlIHBpY2tpbmcgY2FtZXJhXHJcblxyXG4gICAgICBsZXQgc2NhbGU6IG51bWJlciA9IF9jbXBDYW1lcmEuZ2V0V29ybGRUb1BpeGVsU2NhbGUodGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24pO1xyXG4gICAgICBsZXQgd2lkdGhBcnJvdzogbnVtYmVyID0gc2NhbGUgKiAoaXNQaWNraW5nID8gMTAgOiAxKTsgLy8gMTAgb3IgMSBwaXhlbCB3aWRlO1xyXG4gICAgICBsZXQgbGVuZ3RoQXJyb3c6IG51bWJlcjtcclxuICAgICAgbGV0IHNpemVIZWFkOiBudW1iZXI7XHJcblxyXG4gICAgICBpZiAodGhpcy4jaXNUcmFuc2Zvcm1pbmcpIHtcclxuICAgICAgICBjb25zdCBtdHg6IMaSLk1hdHJpeDR4NCA9IMaSLk1hdHJpeDR4NC5DT01QT1NJVElPTih0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbik7XHJcbiAgICAgICAgY29uc3QgbGluZTogxpIuVmVjdG9yM1tdID0gW10gPSBbxpIuVmVjdG9yMy5aKC0xMDAwKSwgxpIuVmVjdG9yMy5aKDEwMDApXTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RlZCBvZiA8KFwieFwiIHwgXCJ5XCIgfCBcInpcIilbXT48xpIuR2VuZXJhbD50aGlzLnNlbGVjdGVkKVxyXG4gICAgICAgICAgxpIuR2l6bW9zLmRyYXdMaW5lcyhsaW5lLCBtdHgubG9va0luKHRoaXMuI2F4ZXNbc2VsZWN0ZWRdKCksIHRoaXMuI25vcm1hbHNbc2VsZWN0ZWRdKCkpLCB0aGlzLiNjb2xvcnNMaXRlW3NlbGVjdGVkXSwgMSk7XHJcblxyXG4gICAgICAgIMaSLlJlY3ljbGVyLnN0b3JlTXVsdGlwbGUobXR4LCBsaW5lWzBdLCBsaW5lWzFdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGNsclg6IMaSLkNvbG9yID0gdGhpcy5zZWxlY3RlZCA9PSBcInhcIiAmJiAhdGhpcy4jaXNUcmFuc2Zvcm1pbmcgPyB0aGlzLiNjb2xvcnNMaXRlLnggOiB0aGlzLiNjb2xvcnMueDtcclxuICAgICAgbGV0IGNsclk6IMaSLkNvbG9yID0gdGhpcy5zZWxlY3RlZCA9PSBcInlcIiAmJiAhdGhpcy4jaXNUcmFuc2Zvcm1pbmcgPyB0aGlzLiNjb2xvcnNMaXRlLnkgOiB0aGlzLiNjb2xvcnMueTtcclxuICAgICAgbGV0IGNsclo6IMaSLkNvbG9yID0gdGhpcy5zZWxlY3RlZCA9PSBcInpcIiAmJiAhdGhpcy4jaXNUcmFuc2Zvcm1pbmcgPyB0aGlzLiNjb2xvcnNMaXRlLnogOiB0aGlzLiNjb2xvcnMuejtcclxuICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcclxuICAgICAgICBjYXNlIFwidHJhbnNsYXRlXCI6XHJcbiAgICAgICAgICBsZW5ndGhBcnJvdyA9IHNjYWxlICogKGlzUGlja2luZyA/IDkwIDogODApOyAvLyA4MCBwaXhlbHMgbG9uZ1xyXG4gICAgICAgICAgc2l6ZUhlYWQgPSBzY2FsZSAqIDEyOyAvLyAxMiBwaXhlbHMgd2lkZVxyXG4gICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgY2xyWCwgdGhpcy4jYXhlcy54KCksIHRoaXMuI25vcm1hbHMueCgpLCBsZW5ndGhBcnJvdywgd2lkdGhBcnJvdywgc2l6ZUhlYWQsIMaSLk1lc2hQeXJhbWlkLCAxKTtcclxuICAgICAgICAgIMaSLkdpem1vcy5kcmF3QXJyb3codGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24sIGNsclksIHRoaXMuI2F4ZXMueSgpLCB0aGlzLiNub3JtYWxzLnkoKSwgbGVuZ3RoQXJyb3csIHdpZHRoQXJyb3csIHNpemVIZWFkLCDGki5NZXNoUHlyYW1pZCwgMSk7XHJcbiAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCBjbHJaLCB0aGlzLiNheGVzLnooKSwgdGhpcy4jbm9ybWFscy56KCksIGxlbmd0aEFycm93LCB3aWR0aEFycm93LCBzaXplSGVhZCwgxpIuTWVzaFB5cmFtaWQsIDEpO1xyXG4gICAgICAgICAgaWYgKHRoaXMuI2lzVHJhbnNmb3JtaW5nICYmICh0aGlzLnNlbGVjdGVkID09IFwieFwiIHx8IHRoaXMuc2VsZWN0ZWQgPT0gXCJ5XCIgfHwgdGhpcy5zZWxlY3RlZCA9PSBcInpcIikpIHtcclxuICAgICAgICAgICAgbGV0IHNjYWxlT3JpZ2luOiBudW1iZXIgPSBfY21wQ2FtZXJhLmdldFdvcmxkVG9QaXhlbFNjYWxlKHRoaXMuI210eFdvcmxkQmFzZS50cmFuc2xhdGlvbik7XHJcbiAgICAgICAgICAgIMaSLkdpem1vcy5kcmF3QXJyb3codGhpcy4jbXR4V29ybGRCYXNlLnRyYW5zbGF0aW9uLCB0aGlzLiNjb2xvcnMub3JpZ2luLCB0aGlzLiNheGVzW3RoaXMuc2VsZWN0ZWRdKCksIHRoaXMuI25vcm1hbHNbdGhpcy5zZWxlY3RlZF0oKSwgc2NhbGVPcmlnaW4gKiA4MCwgc2NhbGVPcmlnaW4gKiAxLCBzY2FsZU9yaWdpbiAqIDEyLCDGki5NZXNoUHlyYW1pZCwgMSk7XHJcbiAgICAgICAgICAgIMaSLkdpem1vcy5kcmF3QXJyb3codGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24sIMaSLkNvbG9yLkNTUyhcIm1hZ2VudGFcIiksIHRoaXMuI25vcm1hbCwgdGhpcy4jYXhlc1t0aGlzLnNlbGVjdGVkXSgpLCBsZW5ndGhBcnJvdywgd2lkdGhBcnJvdywgc2l6ZUhlYWQsIMaSLk1lc2hQeXJhbWlkLCAxKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicm90YXRlXCI6XHJcbiAgICAgICAgICBsZXQgcmFkaXVzOiBudW1iZXIgPSBzY2FsZSAqIDgwOyAvLyA4MCBwaXhlbHMgcmFkaXVzXHJcbiAgICAgICAgICBzaXplSGVhZCA9IHNjYWxlICogMTI7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuI2lzVHJhbnNmb3JtaW5nICYmICh0aGlzLnNlbGVjdGVkID09IFwieFwiIHx8IHRoaXMuc2VsZWN0ZWQgPT0gXCJ5XCIgfHwgdGhpcy5zZWxlY3RlZCA9PSBcInpcIikpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Q2lyY2xlKHRoaXMuI3RvcnVzLCB0aGlzLiNjb2xvcnNbdGhpcy5zZWxlY3RlZF0sIHRoaXMuI2F4ZXNbdGhpcy5zZWxlY3RlZF0oKSwgdGhpcy4jbm9ybWFsc1t0aGlzLnNlbGVjdGVkXSgpLCByYWRpdXMsIDEpO1xyXG4gICAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCB0aGlzLiNjb2xvcnMub3JpZ2luLCB0aGlzLiNvZmZzZXQsIHRoaXMuI2F4ZXNbdGhpcy5zZWxlY3RlZF0oKSwgcmFkaXVzLCB3aWR0aEFycm93LCBzaXplSGVhZCwgxpIuTWVzaFB5cmFtaWQsIDEpO1xyXG4gICAgICAgICAgICAvLyDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMubXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMuY29sb3JzTGlnaHRbdGhpcy5zZWxlY3RlZF0sIHRoaXMubW92ZSwgdGhpcy5heGVzW3RoaXMuc2VsZWN0ZWRdLCB0aGlzLm1vdmUubWFnbml0dWRlLCB3aWR0aEFycm93LCBzaXplSGVhZCwgxpIuTWVzaFB5cmFtaWQsIDEpO1xyXG4gICAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCB0aGlzLiNjb2xvcnNbdGhpcy5zZWxlY3RlZF0sIHRoaXMuI2RpcmVjdGlvbiwgdGhpcy4jYXhlc1t0aGlzLnNlbGVjdGVkXSgpLCByYWRpdXMsIHdpZHRoQXJyb3csIHNpemVIZWFkLCDGki5NZXNoUHlyYW1pZCwgMSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIGRyYXcgYW4gaW52aXNpYmxlIHF1YWQgdG8gb2NjbHVkZSB0aGUgdG9yaVxyXG4gICAgICAgICAgY29uc3QgbXR4UXVhZDogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LkNPTVBPU0lUSU9OKHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uKTtcclxuICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbjogxpIuVmVjdG9yMyA9IF9jbXBDYW1lcmEubXR4V29ybGQuZm9yd2FyZC5uZWdhdGUoKTtcclxuICAgICAgICAgIG10eFF1YWQuc2NhbGluZyA9IMaSLlZlY3RvcjMuT05FKHJhZGl1cyAqIDIpO1xyXG4gICAgICAgICAgbXR4UXVhZC5sb29rSW4oZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgICAgICDGki5SZW5kZXIuc2V0RGVwdGhGdW5jdGlvbijGki5ERVBUSF9GVU5DVElPTi5BTFdBWVMpO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLnNldENvbG9yV3JpdGVNYXNrKGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgIMaSLkdpem1vcy5kcmF3UXVhZChtdHhRdWFkLCB0aGlzLiNjb2xvcnMub3JpZ2luKTsgLy8gY29sb3IgZG9lc24ndCBtYXR0ZXJcclxuICAgICAgICAgIMaSLlJlbmRlci5zZXRDb2xvcldyaXRlTWFzayh0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgIMaSLlJlbmRlci5zZXREZXB0aEZ1bmN0aW9uKMaSLkRFUFRIX0ZVTkNUSU9OLkxFU1MpO1xyXG5cclxuICAgICAgICAgIC8vIGRyYXcgdGhlIHRvcmlcclxuICAgICAgICAgIGxldCB0b3J1czogxpIuTWVzaFRvcnVzID0gaXNQaWNraW5nID8gdGhpcy4jdG9ydXNQaWNrIDogdGhpcy4jdG9ydXM7XHJcbiAgICAgICAgICB0aGlzLmRyYXdDaXJjbGUodG9ydXMsIGNsclgsIHRoaXMuI2F4ZXMueCgpLCB0aGlzLiNub3JtYWxzLngoKSwgcmFkaXVzLCAwKTtcclxuICAgICAgICAgIHRoaXMuZHJhd0NpcmNsZSh0b3J1cywgY2xyWSwgdGhpcy4jYXhlcy55KCksIHRoaXMuI25vcm1hbHMueSgpLCByYWRpdXMsIDApO1xyXG4gICAgICAgICAgdGhpcy5kcmF3Q2lyY2xlKHRvcnVzLCBjbHJaLCB0aGlzLiNheGVzLnooKSwgdGhpcy4jbm9ybWFscy56KCksIHJhZGl1cywgMCk7XHJcblxyXG4gICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZShtdHhRdWFkLCBkaXJlY3Rpb24pO1xyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzY2FsZVwiOlxyXG4gICAgICAgICAgbGVuZ3RoQXJyb3cgPSBzY2FsZSAqIChpc1BpY2tpbmcgPyA4NCA6IDc0KTtcclxuICAgICAgICAgIHNpemVIZWFkID0gc2NhbGUgKiA2O1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLiNpc1RyYW5zZm9ybWluZykge1xyXG4gICAgICAgICAgICAvLyDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMubXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMuY29sb3JzTGlnaHRbdGhpcy5zZWxlY3RlZF0sIHRoaXMuZGlyZWN0aW9uLCB0aGlzLm5vcm1hbHNbdGhpcy5zZWxlY3RlZF0sIHRoaXMuZGlyZWN0aW9uLm1hZ25pdHVkZSwgd2lkdGhBcnJvdywgc2l6ZUhlYWQsIMaSLk1lc2hDdWJlLCAxKTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBzZWxlY3RlZCBvZiA8KFwieFwiIHwgXCJ5XCIgfCBcInpcIilbXT48xpIuR2VuZXJhbD50aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy4jY29sb3JzW3NlbGVjdGVkXSwgdGhpcy4jYXhlc1tzZWxlY3RlZF0oKSwgdGhpcy4jbm9ybWFsc1tzZWxlY3RlZF0oKSwgbGVuZ3RoQXJyb3cgKiB0aGlzLiNzY2FsZUZhY3Rvciwgd2lkdGhBcnJvdywgc2l6ZUhlYWQsIMaSLk1lc2hDdWJlLCAxKTtcclxuICAgICAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCB0aGlzLiNjb2xvcnMub3JpZ2luLCB0aGlzLiNheGVzW3NlbGVjdGVkXSgpLCB0aGlzLiNub3JtYWxzW3NlbGVjdGVkXSgpLCBsZW5ndGhBcnJvdywgd2lkdGhBcnJvdywgc2l6ZUhlYWQsIMaSLk1lc2hDdWJlLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgY2xyWCwgdGhpcy4jYXhlcy54KCksIHRoaXMuI25vcm1hbHMueCgpLCBsZW5ndGhBcnJvdywgd2lkdGhBcnJvdywgc2l6ZUhlYWQsIMaSLk1lc2hDdWJlLCAxKTtcclxuICAgICAgICAgIMaSLkdpem1vcy5kcmF3QXJyb3codGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24sIGNsclksIHRoaXMuI2F4ZXMueSgpLCB0aGlzLiNub3JtYWxzLnkoKSwgbGVuZ3RoQXJyb3csIHdpZHRoQXJyb3csIHNpemVIZWFkLCDGki5NZXNoQ3ViZSwgMSk7XHJcbiAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCBjbHJaLCB0aGlzLiNheGVzLnooKSwgdGhpcy4jbm9ybWFscy56KCksIGxlbmd0aEFycm93LCB3aWR0aEFycm93LCBzaXplSGVhZCwgxpIuTWVzaEN1YmUsIDEpO1xyXG5cclxuICAgICAgICAgIGNvbnN0IG10eEN1YmU6IMaSLk1hdHJpeDR4NCA9IMaSLk1hdHJpeDR4NC5DT01QT1NJVElPTih0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbik7XHJcbiAgICAgICAgICBtdHhDdWJlLnNjYWxpbmcgPSDGki5WZWN0b3IzLk9ORSgoaXNQaWNraW5nID8gMjAgOiAxMCkgKiBzY2FsZSk7XHJcbiAgICAgICAgICDGki5HaXptb3MuZHJhd0N1YmUobXR4Q3ViZSwgdGhpcy5zZWxlY3RlZCA9PSBcInh5elwiID8gdGhpcy4jY29sb3JzTGl0ZS54eXogOiB0aGlzLiNjb2xvcnMueHl6LCAxKTtcclxuICAgICAgICAgIC8vIMaSLlJlY3ljbGVyLnN0b3JlKG10eEN1YmUpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJEb3duID0gKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICghdGhpcy5jYW1lcmEgfHwgIXRoaXMudmlld3BvcnQgfHwgIXRoaXMuc2VsZWN0ZWQgfHwgIXRoaXMuI210eExvY2FsIHx8ICF0aGlzLiNtdHhXb3JsZClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLiNtdHhMb2NhbEJhc2UuY29weSh0aGlzLiNtdHhMb2NhbCk7XHJcbiAgICAgIHRoaXMuI210eFdvcmxkQmFzZS5jb3B5KHRoaXMuI210eFdvcmxkKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkID09IFwieFwiIHx8IHRoaXMuc2VsZWN0ZWQgPT0gXCJ5XCIgfHwgdGhpcy5zZWxlY3RlZCA9PSBcInpcIikge1xyXG4gICAgICAgIGlmICh0aGlzLm1vZGUgPT0gXCJyb3RhdGVcIikge1xyXG4gICAgICAgICAgdGhpcy4jbm9ybWFsLmNvcHkodGhpcy4jYXhlc1t0aGlzLnNlbGVjdGVkXSgpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgbXR4Tm9ybWFsOiDGki5NYXRyaXg0eDQgPSDGki5NYXRyaXg0eDQuTE9PS19BVCh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy5jYW1lcmEubXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMuI2F4ZXNbdGhpcy5zZWxlY3RlZF0oKSwgdHJ1ZSk7XHJcbiAgICAgICAgICB0aGlzLiNub3JtYWwuY29weShtdHhOb3JtYWwuZm9yd2FyZCk7IC8vIG5vcm1hbCBvZiB0aGUgcGxhbmUgdGhlIG1vdXNlIHJheSB3aWxsIGNvbGxpZGUgd2l0aFxyXG4gICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmUobXR4Tm9ybWFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RlZCA9PSBcInh5elwiKSB7XHJcbiAgICAgICAgdGhpcy4jbm9ybWFsLmNvcHkodGhpcy5jYW1lcmEubXR4V29ybGQuZm9yd2FyZC5uZWdhdGUoKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHBvaW50OiDGki5WZWN0b3IzID0gdGhpcy5nZXRQb2ludDNEKF9ldmVudCk7XHJcbiAgICAgIHRoaXMuI29mZnNldC5jb3B5KHBvaW50LnN1YnRyYWN0KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uKSk7XHJcblxyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShwb2ludCk7XHJcblxyXG4gICAgICAvLyBjcmVhdGUgdW5kbyBmdW5jdGlvblxyXG4gICAgICBjb25zdCBtdHhMb2NhbDogxpIuTWF0cml4NHg0ID0gdGhpcy4jbXR4TG9jYWw7XHJcbiAgICAgIGNvbnN0IG11dGF0b3JMb2NhbDogxpIuTXV0YXRvciA9IG10eExvY2FsLmdldE11dGF0b3IoKTtcclxuICAgICAgY29uc3QgbXR4V29ybGQ6IMaSLk1hdHJpeDR4NCA9IHRoaXMuI210eFdvcmxkO1xyXG4gICAgICBjb25zdCBtdXRhdG9yV29ybGQ6IMaSLk11dGF0b3IgPSBtdHhXb3JsZC5nZXRNdXRhdG9yKCk7XHJcbiAgICAgIGxldCB1bmRvOiAoKSA9PiB2b2lkID0gKCkgPT4ge1xyXG4gICAgICAgIG10eExvY2FsLm11dGF0ZShtdXRhdG9yTG9jYWwpO1xyXG4gICAgICAgIG10eFdvcmxkLm11dGF0ZShtdXRhdG9yV29ybGQpO1xyXG4gICAgICAgIGlmICh0aGlzLiNtdHhMb2NhbCA9PSBtdHhMb2NhbClcclxuICAgICAgICAgIHRoaXMuI210eExvY2FsQmFzZS5jb3B5KG10eExvY2FsKTtcclxuICAgICAgICBpZiAodGhpcy4jbXR4V29ybGQgPT0gbXR4V29ybGQpXHJcbiAgICAgICAgICB0aGlzLiNtdHhXb3JsZEJhc2UuY29weShtdHhXb3JsZCk7XHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMuI3VuZG8ucHVzaCh1bmRvKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZSA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLiNpc1RyYW5zZm9ybWluZyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuYnV0dG9ucyAhPSAxKSB7XHJcbiAgICAgICAgY29uc3QgcG9pbnQ6IMaSLlZlY3RvcjIgPSBuZXcgxpIuVmVjdG9yMihfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgIGNvbnN0IHBpY2s6IMaSLlBpY2sgPSDGki5QaWNrZXIucGlja0NhbWVyYShbdGhpc10sIHRoaXMuY2FtZXJhLCB0aGlzLnZpZXdwb3J0LnBvaW50Q2xpZW50VG9Qcm9qZWN0aW9uKHBvaW50KSlbMF07XHJcblxyXG4gICAgICAgIGlmIChwaWNrPy5jb2xvci5lcXVhbHModGhpcy4jY29sb3JzLngpIHx8IHBpY2s/LmNvbG9yLmVxdWFscyh0aGlzLiNjb2xvcnNMaXRlLngpKVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFwieFwiO1xyXG4gICAgICAgIGVsc2UgaWYgKHBpY2s/LmNvbG9yLmVxdWFscyh0aGlzLiNjb2xvcnMueSkgfHwgcGljaz8uY29sb3IuZXF1YWxzKHRoaXMuI2NvbG9yc0xpdGUueSkpXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gXCJ5XCI7XHJcbiAgICAgICAgZWxzZSBpZiAocGljaz8uY29sb3IuZXF1YWxzKHRoaXMuI2NvbG9ycy56KSB8fCBwaWNrPy5jb2xvci5lcXVhbHModGhpcy4jY29sb3JzTGl0ZS56KSlcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBcInpcIjtcclxuICAgICAgICBlbHNlIGlmIChwaWNrPy5jb2xvci5lcXVhbHModGhpcy4jY29sb3JzLnh5eikgfHwgcGljaz8uY29sb3IuZXF1YWxzKHRoaXMuI2NvbG9yc0xpdGUueHl6KSlcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBcInh5elwiO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZClcclxuICAgICAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLnN0eWxlLmN1cnNvciA9IFwiZ3JhYlwiO1xyXG5cclxuICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShwb2ludCk7XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLmNhbWVyYSB8fCAhdGhpcy52aWV3cG9ydCB8fCAhdGhpcy5zZWxlY3RlZCB8fCAhdGhpcy4jbXR4TG9jYWwgfHwgIXRoaXMuI210eFdvcmxkKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IGlzU25hcHBpbmc6IGJvb2xlYW4gPSDGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuQ1RSTF9MRUZULCDGki5LRVlCT0FSRF9DT0RFLkNUUkxfUklHSFRdKTtcclxuXHJcbiAgICAgIHRoaXMuI2lzVHJhbnNmb3JtaW5nID0gdHJ1ZTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMuc3R5bGUuY3Vyc29yID0gXCJncmFiYmluZ1wiO1xyXG5cclxuICAgICAgdGhpcy4jZGlyZWN0aW9uLmNvcHkodGhpcy5nZXRQb2ludDNEKF9ldmVudCkuc3VidHJhY3QodGhpcy4jbXR4V29ybGRCYXNlLnRyYW5zbGF0aW9uKSk7XHJcbiAgICAgIHRoaXMuI210eExvY2FsLmNvcHkodGhpcy4jbXR4TG9jYWxCYXNlKTsgLy8gcmVzZXRcclxuXHJcbiAgICAgIGxldCBheGlzOiDGki5WZWN0b3IzO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZC5sZW5ndGggPT0gMSlcclxuICAgICAgICBheGlzID0gdGhpcy4jYXhlc1s8XCJ4XCIgfCBcInlcIiB8IFwielwiPnRoaXMuc2VsZWN0ZWRdKCk7XHJcblxyXG4gICAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xyXG4gICAgICAgIGNhc2UgXCJ0cmFuc2xhdGVcIjpcclxuICAgICAgICAgIGNvbnN0IG10eFdvcmxkSW52c2Vyc2U6IMaSLk1hdHJpeDR4NCA9IHRoaXMuI210eFdvcmxkQmFzZS5jbG9uZS5pbnZlcnQoKTtcclxuICAgICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5QUk9KRUNUSU9OKHRoaXMuI2RpcmVjdGlvbiwgYXhpcyk7XHJcbiAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbk9mZnNldDogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuUFJPSkVDVElPTih0aGlzLiNvZmZzZXQsIGF4aXMpO1xyXG5cclxuICAgICAgICAgIHRyYW5zbGF0aW9uLnN1YnRyYWN0KHRyYW5zbGF0aW9uT2Zmc2V0KTtcclxuXHJcbiAgICAgICAgICBpZiAoaXNTbmFwcGluZylcclxuICAgICAgICAgICAgdHJhbnNsYXRpb24uYXBwbHkoKF92YWx1ZTogbnVtYmVyKSA9PiDGki5DYWxjLnNuYXAoX3ZhbHVlLCB0aGlzLnNuYXBEaXN0YW5jZSkpO1xyXG5cclxuICAgICAgICAgIHRyYW5zbGF0aW9uLnRyYW5zZm9ybShtdHhXb3JsZEludnNlcnNlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgdGhpcy4jbXR4TG9jYWwudHJhbnNsYXRlKHRyYW5zbGF0aW9uKTtcclxuXHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZU11bHRpcGxlKG10eFdvcmxkSW52c2Vyc2UsIHRyYW5zbGF0aW9uLCB0cmFuc2xhdGlvbk9mZnNldCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicm90YXRlXCI6XHJcbiAgICAgICAgICBjb25zdCByb3RhdGlvbkludmVyc2U6IMaSLlF1YXRlcm5pb24gPSB0aGlzLiNtdHhXb3JsZEJhc2UucXVhdGVybmlvbi5jbG9uZS5pbnZlcnQoKTtcclxuXHJcbiAgICAgICAgICAvLyByb3RhdGUgdmVjdG9ycyBpbnRvIGxvY2FsIHNwYWNlLCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBtb3N0IHJlbGlhYmxlIHdheVxyXG4gICAgICAgICAgY29uc3Qgb2Zmc2V0TG9jYWw6IMaSLlZlY3RvcjMgPSB0aGlzLiNvZmZzZXQuY2xvbmUudHJhbnNmb3JtKHJvdGF0aW9uSW52ZXJzZSk7XHJcbiAgICAgICAgICBjb25zdCBkaXJlY3Rpb25Mb2NhbDogxpIuVmVjdG9yMyA9IHRoaXMuI2RpcmVjdGlvbi5jbG9uZS50cmFuc2Zvcm0ocm90YXRpb25JbnZlcnNlKTtcclxuICAgICAgICAgIGNvbnN0IGF4aXNMb2NhbDogxpIuVmVjdG9yMyA9IGF4aXMuY2xvbmUudHJhbnNmb3JtKHJvdGF0aW9uSW52ZXJzZSk7XHJcblxyXG4gICAgICAgICAgbGV0IGFuZ2xlOiBudW1iZXIgPSDGki5WZWN0b3IzLkFOR0xFKG9mZnNldExvY2FsLCBkaXJlY3Rpb25Mb2NhbCk7XHJcblxyXG4gICAgICAgICAgaWYgKGlzU25hcHBpbmcpXHJcbiAgICAgICAgICAgIGFuZ2xlID0gxpIuQ2FsYy5zbmFwKGFuZ2xlLCB0aGlzLnNuYXBBbmdsZSk7XHJcblxyXG4gICAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBkaXJlY3Rpb24gb2Ygcm90YXRpb25cclxuICAgICAgICAgIGNvbnN0IGNyb3NzOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5DUk9TUyhvZmZzZXRMb2NhbCwgZGlyZWN0aW9uTG9jYWwpO1xyXG4gICAgICAgICAgaWYgKMaSLlZlY3RvcjMuRE9UKGF4aXNMb2NhbCwgY3Jvc3MpIDwgMClcclxuICAgICAgICAgICAgYW5nbGUgPSAtYW5nbGU7XHJcblxyXG4gICAgICAgICAgY29uc3Qgcm90YXRpb246IMaSLlF1YXRlcm5pb24gPSDGki5RdWF0ZXJuaW9uLlJPVEFUSU9OKGF4aXNMb2NhbCwgYW5nbGUpO1xyXG5cclxuICAgICAgICAgIGlmIChpc1NuYXBwaW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvblNuYXBwZWQ6IMaSLlZlY3RvcjMgPSBvZmZzZXRMb2NhbFxyXG4gICAgICAgICAgICAgIC50cmFuc2Zvcm0ocm90YXRpb24pIC8vIHJvdGF0ZSBvZmZzZXQgaW50byBzbmFwcGVkIGRpcmVjdGlvblxyXG4gICAgICAgICAgICAgIC50cmFuc2Zvcm0odGhpcy4jbXR4V29ybGRCYXNlLnF1YXRlcm5pb24pOyAvLyByb3RhdGUgc25hcHBlZCBkaXJlY3Rpb24gYmFjayBpbnRvIHdvcmxkIHNwYWNlXHJcbiAgICAgICAgICAgIHRoaXMuI2RpcmVjdGlvbi5jb3B5KGRpcmVjdGlvblNuYXBwZWQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuI210eExvY2FsLnF1YXRlcm5pb24gPSB0aGlzLiNtdHhMb2NhbC5xdWF0ZXJuaW9uLm11bHRpcGx5KHJvdGF0aW9uKTsgLy8gb25seSBhZmZlY3Qgcm90YXRpb24sIGlnbm9yZSBzY2FsaW5nXHJcblxyXG4gICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZShyb3RhdGlvbkludmVyc2UsIG9mZnNldExvY2FsLCBkaXJlY3Rpb25Mb2NhbCwgYXhpc0xvY2FsLCBjcm9zcywgcm90YXRpb24pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBcInNjYWxlXCI6XHJcbiAgICAgICAgICBsZXQgc2NhbGU6IG51bWJlciA9IHRoaXMuY2FtZXJhLmdldFdvcmxkVG9QaXhlbFNjYWxlKHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uKTtcclxuICAgICAgICAgIGxldCBsZW5ndGhBcnJvdzogbnVtYmVyID0gc2NhbGUgKiA4MDsgLy8gVE9ETzogc2F2ZSB0aGlzIHNvbWV3aGVyZVxyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQgPT0gXCJ4eXpcIikgXHJcbiAgICAgICAgICAgIGF4aXMgPSB0aGlzLmNhbWVyYS5tdHhXb3JsZC5yaWdodC5uZWdhdGUoKTtcclxuXHJcbiAgICAgICAgICBsZXQgb2Zmc2V0OiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5QUk9KRUNUSU9OKHRoaXMuI29mZnNldCwgYXhpcyk7XHJcbiAgICAgICAgICBsZXQgZGlyZWN0aW9uOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5QUk9KRUNUSU9OKHRoaXMuI2RpcmVjdGlvbiwgYXhpcyk7XHJcbiAgICAgICAgICBsZXQgc2lnbk9mZnNldDogbnVtYmVyID0gTWF0aC5zaWduKMaSLlZlY3RvcjMuRE9UKGF4aXMsIG9mZnNldCkpO1xyXG4gICAgICAgICAgbGV0IHNpZ25EaXJlY3Rpb246IG51bWJlciA9IE1hdGguc2lnbijGki5WZWN0b3IzLkRPVChheGlzLCBkaXJlY3Rpb24pKTtcclxuXHJcbiAgICAgICAgICB0aGlzLiNzY2FsZUZhY3RvciA9ICgoKHNpZ25EaXJlY3Rpb24gKiBkaXJlY3Rpb24ubWFnbml0dWRlKSAtIChzaWduT2Zmc2V0ICogb2Zmc2V0Lm1hZ25pdHVkZSkpIC8gbGVuZ3RoQXJyb3cpICsgMTtcclxuXHJcblxyXG4gICAgICAgICAgaWYgKGlzU25hcHBpbmcpXHJcbiAgICAgICAgICAgIHRoaXMuI3NjYWxlRmFjdG9yID0gxpIuQ2FsYy5zbmFwKHRoaXMuI3NjYWxlRmFjdG9yLCB0aGlzLnNuYXBTY2FsZSk7XHJcblxyXG4gICAgICAgICAgY29uc3QgdmN0U2NhbGluZzogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuT05FKCk7XHJcbiAgICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkIG9mIDwoXCJ4XCIgfCBcInlcIiB8IFwielwiKVtdPjzGki5HZW5lcmFsPnRoaXMuc2VsZWN0ZWQpXHJcbiAgICAgICAgICAgIHZjdFNjYWxpbmdbc2VsZWN0ZWRdID0gdGhpcy4jc2NhbGVGYWN0b3I7XHJcblxyXG4gICAgICAgICAgY29uc3QgbXR4U2NhbGluZzogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LlNDQUxJTkcodmN0U2NhbGluZyk7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuc3BhY2UgPT0gXCJ3b3JsZFwiKSB7IC8vIHJvdGF0aW9uSW52ZXJzZSAqIHNjYWxpbmcgKiByb3RhdGlvblxyXG4gICAgICAgICAgICBjb25zdCByb3RhdGlvbkludmVyc2U6IMaSLlF1YXRlcm5pb24gPSB0aGlzLiNtdHhXb3JsZEJhc2UucXVhdGVybmlvbi5jbG9uZS5pbnZlcnQoKTtcclxuICAgICAgICAgICAgbXR4U2NhbGluZy5yb3RhdGUocm90YXRpb25JbnZlcnNlLCB0cnVlKTtcclxuICAgICAgICAgICAgbXR4U2NhbGluZy5yb3RhdGUodGhpcy4jbXR4V29ybGRCYXNlLnF1YXRlcm5pb24pO1xyXG4gICAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShyb3RhdGlvbkludmVyc2UpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuI210eExvY2FsLnNjYWxlKG10eFNjYWxpbmcuc2NhbGluZyk7XHJcblxyXG4gICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZSh2Y3RTY2FsaW5nLCBtdHhTY2FsaW5nKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShheGlzKTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyVXAgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIGlmICh0aGlzLiNtdHhMb2NhbClcclxuICAgICAgICB0aGlzLiNtdHhMb2NhbEJhc2UuY29weSh0aGlzLiNtdHhMb2NhbCk7XHJcbiAgICAgIGlmICh0aGlzLiNtdHhXb3JsZClcclxuICAgICAgICB0aGlzLiNtdHhXb3JsZEJhc2UuY29weSh0aGlzLiNtdHhXb3JsZCk7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkKVxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICBpZiAodGhpcy4jaXNUcmFuc2Zvcm1pbmcpXHJcbiAgICAgICAgdGhpcy4jaXNUcmFuc2Zvcm1pbmcgPSBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRSZW5kZXJFbmQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMuZHJhd0dpem1vcyh0aGlzLnZpZXdwb3J0LmNhbWVyYSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZHJhd0NpcmNsZShfdG9ydXM6IMaSLk1lc2hUb3J1cywgX2NvbG9yOiDGki5Db2xvciwgX2RpcmVjdGlvbjogxpIuVmVjdG9yMywgX3VwOiDGki5WZWN0b3IzLCBfcmFkaXVzOiBudW1iZXIsIF9hbHBoYU9jY2x1ZGVkOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgY29uc3QgbXR4V29ybGQ6IMaSLk1hdHJpeDR4NCA9IHRoaXMuI210eFdvcmxkLmNsb25lO1xyXG4gICAgICBjb25zdCB2Y3RTY2FsaW5nOiDGki5WZWN0b3IzID0gxpIuUmVjeWNsZXIucmV1c2UoxpIuVmVjdG9yMykuc2V0KF9yYWRpdXMgKiAyLCBfcmFkaXVzICogMiwgX3JhZGl1cyAqIDIpO1xyXG5cclxuICAgICAgbXR4V29ybGQuc2NhbGluZyA9IHZjdFNjYWxpbmc7XHJcbiAgICAgIG10eFdvcmxkLmxvb2tJbihfZGlyZWN0aW9uLCBfdXApOyAvLyBsb29rSW4gb3JpZW50YXRlcyB0aGUgei1heGlzIGJ1dCB0aGUgdG9ydXNlIGxheXMgb24gdGhlIHh6LXBsYW5lIChmYWNpbmcgaW4geS1kaXJlY3Rpb24pLFxyXG4gICAgICBtdHhXb3JsZC5yb3RhdGVYKDkwKTsgICAgICAgICAgICAgLy8gdGh1cyB3ZSByb3RhdGUgdGhlIHRvcnVzIHNvIHRoZSBjaXJjbGUgZmFjZXMgaW4gX2RpcmVjdGlvblxyXG4gICAgICAvLyDGki5HaXptb3MuZHJhd01lc2godGhpcy50b3J1c1BpY2ssIG10eFdvcmxkLCDGki5Db2xvci5DU1MoXCJtYWdlbnRhXCIpLCBfYWxwaGFPY2NsdWRlZCk7XHJcbiAgICAgIMaSLkdpem1vcy5kcmF3TWVzaChfdG9ydXMsIG10eFdvcmxkLCBfY29sb3IsIF9hbHBoYU9jY2x1ZGVkKTtcclxuXHJcbiAgICAgIMaSLlJlY3ljbGVyLnN0b3JlTXVsdGlwbGUobXR4V29ybGQsIHZjdFNjYWxpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UG9pbnQzRChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IMaSLlZlY3RvcjMge1xyXG4gICAgICBjb25zdCBwb2ludDJEOiDGki5WZWN0b3IyID0gxpIuUmVjeWNsZXIucmV1c2UoxpIuVmVjdG9yMikuc2V0KF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgIGNvbnN0IHJheTogxpIuUmF5ID0gdGhpcy52aWV3cG9ydC5nZXRSYXlGcm9tQ2xpZW50KHBvaW50MkQpO1xyXG5cclxuICAgICAgxpIuUmVjeWNsZXIuc3RvcmUocG9pbnQyRCk7XHJcbiAgICAgIHJldHVybiByYXkuaW50ZXJzZWN0UGxhbmUodGhpcy4jbXR4V29ybGRCYXNlLnRyYW5zbGF0aW9uLCB0aGlzLiNub3JtYWwpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgVmlld3BvcnQge1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUoX2JyYW5jaDogxpIuTm9kZSk6IMaSLlZpZXdwb3J0IHtcclxuICAgICAgbGV0IGNtcENhbWVyYTogxpIuQ29tcG9uZW50Q2FtZXJhID0gbmV3IMaSLkNvbXBvbmVudENhbWVyYSgpO1xyXG4gICAgICBjbXBDYW1lcmEubXR4UGl2b3QudHJhbnNsYXRlKMaSLlZlY3RvcjMuWig0KSk7XHJcbiAgICAgIGNtcENhbWVyYS5tdHhQaXZvdC5yb3RhdGVZKDE4MCk7XHJcblxyXG4gICAgICBsZXQgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IENhbnZhcy5jcmVhdGUoKTtcclxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjYW52YXMpO1xyXG5cclxuICAgICAgbGV0IHZpZXdwb3J0OiDGki5WaWV3cG9ydCA9IG5ldyDGki5WaWV3cG9ydCgpO1xyXG4gICAgICB2aWV3cG9ydC5pbml0aWFsaXplKFwixpJBaWQtVmlld3BvcnRcIiwgX2JyYW5jaCwgY21wQ2FtZXJhLCBjYW52YXMpO1xyXG4gICAgICByZXR1cm4gdmlld3BvcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBleHBhbmRDYW1lcmFUb0ludGVyYWN0aXZlT3JiaXQoX3ZpZXdwb3J0OiDGki5WaWV3cG9ydCwgX3Nob3dGb2N1czogYm9vbGVhbiA9IHRydWUsIF9zcGVlZENhbWVyYVJvdGF0aW9uOiBudW1iZXIgPSAxLCBfc3BlZWRDYW1lcmFUcmFuc2xhdGlvbjogbnVtYmVyID0gMC4wMSwgX3NwZWVkQ2FtZXJhRGlzdGFuY2U6IG51bWJlciA9IDAuMDAxLCBfcmVkcmF3OiAoKSA9PiB2b2lkID0gKCkgPT4gX3ZpZXdwb3J0LmRyYXcoKSwgX3RyYW5zbGF0ZU9uUGljazogKCkgPT4gYm9vbGVhbiA9ICgpID0+IHRydWUpOiBDYW1lcmFPcmJpdCB7XHJcbiAgICAgIC8vIF92aWV3cG9ydC5zZXRGb2N1cyh0cnVlKTtcclxuICAgICAgLy8gX3ZpZXdwb3J0LmFjdGl2YXRlUG9pbnRlckV2ZW50KMaSLkVWRU5UX1BPSU5URVIuRE9XTiwgdHJ1ZSk7XHJcbiAgICAgIC8vIF92aWV3cG9ydC5hY3RpdmF0ZVBvaW50ZXJFdmVudCjGki5FVkVOVF9QT0lOVEVSLlVQLCB0cnVlKTtcclxuICAgICAgLy8gX3ZpZXdwb3J0LmFjdGl2YXRlUG9pbnRlckV2ZW50KMaSLkVWRU5UX1BPSU5URVIuTU9WRSwgdHJ1ZSk7XHJcbiAgICAgIC8vIF92aWV3cG9ydC5hY3RpdmF0ZVdoZWVsRXZlbnQoxpIuRVZFTlRfV0hFRUwuV0hFRUwsIHRydWUpO1xyXG4gICAgICBfdmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgaG5kUG9pbnRlclVwKTtcclxuICAgICAgX3ZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgaG5kUG9pbnRlckRvd24pO1xyXG4gICAgICBfdmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCBobmRQb2ludGVyTW92ZSk7XHJcbiAgICAgIF92aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJsZWF2ZVwiLCBobmRQb2ludGVyVXApO1xyXG4gICAgICBfdmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsIGhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIF92aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcIndoZWVsXCIsIGhuZFdoZWVsTW92ZSk7XHJcblxyXG4gICAgICBjb25zdCBmYWN0b3JQYW46IG51bWJlciA9IDEgLyA1MDA7XHJcbiAgICAgIGNvbnN0IGZhY3RvckZseTogbnVtYmVyID0gMSAvIDIwO1xyXG4gICAgICBjb25zdCBmYWN0b3Jab29tOiBudW1iZXIgPSAxIC8gMztcclxuICAgICAgY29uc3QgZmFjdG9yWm9vbVRvdWNoOiBudW1iZXIgPSAyLjU7XHJcblxyXG4gICAgICBjb25zdCBkb3VibGVUYXBUaHJlc2hvbGQgPSB7IHRpbWU6IDMwMCwgZGlzdGFuY2U6IDMwICoqIDIgfTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICBjb25zdCBwaW5jaFRocmVzaG9sZDogbnVtYmVyID0gNzA7IC8vIG1heCBob3Jpem9udGFsIGRpc3RhbmNlIGJldHdlZW4gdHdvIHRvdWNoZXMgdG8gYmUgcmVjb2duaXplZCBhcyBwaW5jaFxyXG5cclxuICAgICAgbGV0IGZseVNwZWVkOiBudW1iZXIgPSAwLjM7XHJcbiAgICAgIGxldCBmbHlBY2NlbGVyYXRlZDogbnVtYmVyID0gMTA7XHJcbiAgICAgIGxldCB0aW1lcjogxpIuVGltZXIgPSBuZXcgxpIuVGltZXIoxpIuVGltZS5nYW1lLCAyMCwgMCwgaG5kVGltZXIpO1xyXG4gICAgICBsZXQgY250Rmx5OiDGki5Db250cm9sID0gbmV3IMaSLkNvbnRyb2woXCJGbHlcIiwgZmx5U3BlZWQpO1xyXG4gICAgICBjbnRGbHkuc2V0RGVsYXkoNTAwKTtcclxuICAgICAgbGV0IGZseWluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICBjb25zb2xlLmxvZyh0aW1lcik7XHJcblxyXG4gICAgICBsZXQgdG91Y2hTdGF0ZTogXCJvcmJpdFwiIHwgXCJmbHlcIiB8IFwiem9vbVwiO1xyXG5cclxuICAgICAgbGV0IGNudE1vdXNlSG9yaXpvbnRhbDogxpIuQ29udHJvbCA9IG5ldyDGki5Db250cm9sKFwiTW91c2VIb3Jpem9udGFsXCIsIC0xKTtcclxuICAgICAgbGV0IGNudE1vdXNlVmVydGljYWw6IMaSLkNvbnRyb2wgPSBuZXcgxpIuQ29udHJvbChcIk1vdXNlVmVydGljYWxcIiwgLTEpO1xyXG5cclxuICAgICAgLy8gY2FtZXJhIHNldHVwXHJcbiAgICAgIGxldCBjYW1lcmE6IENhbWVyYU9yYml0TW92aW5nRm9jdXM7XHJcbiAgICAgIGNhbWVyYSA9IG5ldyBDYW1lcmFPcmJpdE1vdmluZ0ZvY3VzKF92aWV3cG9ydC5jYW1lcmEsIDUsIDg1LCAwLjAxLCAxMDAwKTtcclxuICAgICAgLy9UT0RPOiByZW1vdmUgdGhlIGZvbGxvd2luZyBsaW5lLCBjYW1lcmEgbXVzdCBub3QgYmUgbWFuaXB1bGF0ZWQgYnV0IHNob3VsZCBhbHJlYWR5IGJlIHNldCB1cCB3aGVuIGNhbGxpbmcgdGhpcyBtZXRob2RcclxuICAgICAgX3ZpZXdwb3J0LmNhbWVyYS5wcm9qZWN0Q2VudHJhbChfdmlld3BvcnQuY2FtZXJhLmdldEFzcGVjdCgpLCBfdmlld3BvcnQuY2FtZXJhLmdldEZpZWxkT2ZWaWV3KCksIF92aWV3cG9ydC5jYW1lcmEuZ2V0RGlyZWN0aW9uKCksIDAuMDEsIDEwMDApO1xyXG5cclxuICAgICAgLy8geXNldCB1cCBheGlzIHRvIGNvbnRyb2xcclxuICAgICAgY2FtZXJhLmF4aXNSb3RhdGVYLmFkZENvbnRyb2woY250TW91c2VWZXJ0aWNhbCk7XHJcbiAgICAgIGNhbWVyYS5heGlzUm90YXRlWC5zZXRGYWN0b3IoX3NwZWVkQ2FtZXJhUm90YXRpb24pO1xyXG5cclxuICAgICAgY2FtZXJhLmF4aXNSb3RhdGVZLmFkZENvbnRyb2woY250TW91c2VIb3Jpem9udGFsKTtcclxuICAgICAgY2FtZXJhLmF4aXNSb3RhdGVZLnNldEZhY3Rvcihfc3BlZWRDYW1lcmFSb3RhdGlvbik7XHJcbiAgICAgIC8vIF92aWV3cG9ydC5nZXRCcmFuY2goKS5hZGRDaGlsZChjYW1lcmEpO1xyXG5cclxuICAgICAgbGV0IGZvY3VzOiDGki5Ob2RlO1xyXG4gICAgICBpZiAoX3Nob3dGb2N1cykge1xyXG4gICAgICAgIGZvY3VzID0gbmV3IE5vZGVDb29yZGluYXRlU3lzdGVtKFwiRm9jdXNcIik7XHJcbiAgICAgICAgZm9jdXMuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRUcmFuc2Zvcm0oKSk7XHJcbiAgICAgICAgX3ZpZXdwb3J0LmdldEJyYW5jaCgpLmFkZENoaWxkKGZvY3VzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgYWN0aXZlUG9pbnRlcnM6IE1hcDxudW1iZXIsIFBvaW50ZXJFdmVudD4gPSBuZXcgTWFwKCk7XHJcbiAgICAgIGxldCBwcmV2UG9pbnRlcjogUG9pbnRlckV2ZW50O1xyXG4gICAgICBsZXQgcHJldkRpc3RhbmNlOiBudW1iZXI7XHJcblxyXG4gICAgICByZWRyYXcoKTtcclxuICAgICAgcmV0dXJuIGNhbWVyYTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhuZFBvaW50ZXJNb3ZlKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFfZXZlbnQuYnV0dG9ucylcclxuICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgYWN0aXZlUG9pbnRlcnMuc2V0KF9ldmVudC5wb2ludGVySWQsIF9ldmVudCk7XHJcblxyXG4gICAgICAgIGxldCBwb3NDYW1lcmE6IMaSLlZlY3RvcjMgPSBjYW1lcmEubm9kZUNhbWVyYS5tdHhXb3JsZC50cmFuc2xhdGlvbi5jbG9uZTtcclxuXHJcbiAgICAgICAgLy8gb3JiaXRcclxuICAgICAgICBpZiAoKF9ldmVudC5idXR0b25zID09IDQgJiYgIShfZXZlbnQuY3RybEtleSB8fCBfZXZlbnQuYWx0S2V5IHx8IF9ldmVudC5zaGlmdEtleSkpIHx8IChfZXZlbnQuYnV0dG9ucyA9PSAxICYmIF9ldmVudC5hbHRLZXkpIHx8IHRvdWNoU3RhdGUgPT0gXCJvcmJpdFwiKSB7XHJcbiAgICAgICAgICBjbnRNb3VzZUhvcml6b250YWwuc2V0SW5wdXQoX2V2ZW50Lm1vdmVtZW50WCk7XHJcbiAgICAgICAgICBjbnRNb3VzZVZlcnRpY2FsLnNldElucHV0KF9ldmVudC5tb3ZlbWVudFkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmx5XHJcbiAgICAgICAgaWYgKChfZXZlbnQuYnV0dG9ucyA9PSAyICYmICFfZXZlbnQuYWx0S2V5KSB8fCB0b3VjaFN0YXRlID09IFwiZmx5XCIpIHtcclxuICAgICAgICAgIGNudE1vdXNlSG9yaXpvbnRhbC5zZXRJbnB1dChfZXZlbnQubW92ZW1lbnRYICogZmFjdG9yRmx5KTtcclxuICAgICAgICAgIGNudE1vdXNlVmVydGljYWwuc2V0SW5wdXQoX2V2ZW50Lm1vdmVtZW50WSAqIGZhY3RvckZseSk7XHJcbiAgICAgICAgICDGki5SZW5kZXIucHJlcGFyZShjYW1lcmEpO1xyXG4gICAgICAgICAgbGV0IG9mZnNldDogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuRElGRkVSRU5DRShwb3NDYW1lcmEsIGNhbWVyYS5ub2RlQ2FtZXJhLm10eFdvcmxkLnRyYW5zbGF0aW9uKTtcclxuICAgICAgICAgIGNhbWVyYS5tdHhMb2NhbC50cmFuc2xhdGUob2Zmc2V0LCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB6b29tXHJcbiAgICAgICAgaWYgKChfZXZlbnQuYnV0dG9ucyA9PSA0ICYmIF9ldmVudC5jdHJsS2V5KSB8fCAoX2V2ZW50LmJ1dHRvbnMgPT0gMiAmJiBfZXZlbnQuYWx0S2V5KSlcclxuICAgICAgICAgIHpvb20oX2V2ZW50Lm1vdmVtZW50WCAqIGZhY3Rvclpvb20pO1xyXG5cclxuICAgICAgICAvLyBwaW5jaCB6b29tXHJcbiAgICAgICAgaWYgKHRvdWNoU3RhdGUgPT0gXCJ6b29tXCIpIHtcclxuICAgICAgICAgIGNvbnN0IGl0ZXJhdG9yOiBJdGVyYWJsZUl0ZXJhdG9yPFBvaW50ZXJFdmVudD4gPSBhY3RpdmVQb2ludGVycy52YWx1ZXMoKTtcclxuICAgICAgICAgIGNvbnN0IGRpc3RhbmNlOiBudW1iZXIgPSBNYXRoLmFicyhpdGVyYXRvci5uZXh0KCkudmFsdWUub2Zmc2V0WSAtIGl0ZXJhdG9yLm5leHQoKS52YWx1ZS5vZmZzZXRZKTtcclxuICAgICAgICAgIGlmIChwcmV2RGlzdGFuY2UpXHJcbiAgICAgICAgICAgIHpvb20oKHByZXZEaXN0YW5jZSAtIGRpc3RhbmNlKSAqIGZhY3Rvclpvb21Ub3VjaCk7XHJcblxyXG4gICAgICAgICAgcHJldkRpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBwYW4gXHJcbiAgICAgICAgaWYgKF9ldmVudC5idXR0b25zID09IDQgJiYgKF9ldmVudC5hbHRLZXkgfHwgX2V2ZW50LnNoaWZ0S2V5KSkge1xyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVgoLV9ldmVudC5tb3ZlbWVudFggKiBjYW1lcmEuZGlzdGFuY2UgKiBmYWN0b3JQYW4pO1xyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVkoX2V2ZW50Lm1vdmVtZW50WSAqIGNhbWVyYS5kaXN0YW5jZSAqIGZhY3RvclBhbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZWRyYXcoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaG5kVGltZXIoX2V2ZW50OiDGki5FdmVudFRpbWVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFmbHlpbmcpXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgY250Rmx5LnNldEZhY3RvcijGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuU0hJRlRfTEVGVF0pID8gZmx5QWNjZWxlcmF0ZWQgOiBmbHlTcGVlZCk7XHJcbiAgICAgICAgY250Rmx5LnNldElucHV0KMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5XLCDGki5LRVlCT0FSRF9DT0RFLkEsIMaSLktFWUJPQVJEX0NPREUuUywgxpIuS0VZQk9BUkRfQ09ERS5ELCDGki5LRVlCT0FSRF9DT0RFLlEsIMaSLktFWUJPQVJEX0NPREUuRV0pID8gMSA6IDApO1xyXG5cclxuICAgICAgICBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlddKSlcclxuICAgICAgICAgIGNhbWVyYS50cmFuc2xhdGVaKC1jbnRGbHkuZ2V0T3V0cHV0KCkpO1xyXG4gICAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5TXSkpXHJcbiAgICAgICAgICBjYW1lcmEudHJhbnNsYXRlWihjbnRGbHkuZ2V0T3V0cHV0KCkpO1xyXG4gICAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5BXSkpXHJcbiAgICAgICAgICBjYW1lcmEudHJhbnNsYXRlWCgtY250Rmx5LmdldE91dHB1dCgpKTtcclxuICAgICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuRF0pKVxyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVgoY250Rmx5LmdldE91dHB1dCgpKTtcclxuICAgICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuUV0pKVxyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVkoLWNudEZseS5nZXRPdXRwdXQoKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLkVdKSlcclxuICAgICAgICAgIGNhbWVyYS50cmFuc2xhdGVZKGNudEZseS5nZXRPdXRwdXQoKSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHJlZHJhdygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBobmRQb2ludGVyRG93bihfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGFjdGl2ZVBvaW50ZXJzLnNldChfZXZlbnQucG9pbnRlcklkLCBfZXZlbnQpO1xyXG5cclxuICAgICAgICBmbHlpbmcgPSAoX2V2ZW50LmJ1dHRvbnMgPT0gMiAmJiAhX2V2ZW50LmFsdEtleSk7XHJcblxyXG4gICAgICAgIGlmIChfZXZlbnQucG9pbnRlclR5cGUgPT0gXCJ0b3VjaFwiKSB7XHJcbiAgICAgICAgICB0b3VjaFN0YXRlID0gXCJvcmJpdFwiO1xyXG5cclxuICAgICAgICAgIGlmIChhY3RpdmVQb2ludGVycy5zaXplID09IDIpIHtcclxuICAgICAgICAgICAgY29uc3QgaXRlcmF0b3I6IEl0ZXJhYmxlSXRlcmF0b3I8UG9pbnRlckV2ZW50PiA9IGFjdGl2ZVBvaW50ZXJzLnZhbHVlcygpO1xyXG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZTogbnVtYmVyID0gTWF0aC5hYnMoaXRlcmF0b3IubmV4dCgpLnZhbHVlLm9mZnNldFggLSBpdGVyYXRvci5uZXh0KCkudmFsdWUub2Zmc2V0WCk7XHJcbiAgICAgICAgICAgIHRvdWNoU3RhdGUgPSBkaXN0YW5jZSA8IHBpbmNoVGhyZXNob2xkID8gXCJ6b29tXCIgOiBcImZseVwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZG91YmxlVGFwOiBib29sZWFuID0gYWN0aXZlUG9pbnRlcnMuc2l6ZSA9PSAxICYmXHJcbiAgICAgICAgICAoX2V2ZW50LnRpbWVTdGFtcCAtIChwcmV2UG9pbnRlcj8udGltZVN0YW1wID8/IDApIDwgZG91YmxlVGFwVGhyZXNob2xkLnRpbWUpICYmXHJcbiAgICAgICAgICAocHJldlBvaW50ZXI/Lm9mZnNldFggLSBfZXZlbnQub2Zmc2V0WCA/PyAwKSAqKiAyICsgKHByZXZQb2ludGVyPy5vZmZzZXRZIC0gX2V2ZW50Lm9mZnNldFkgPz8gMCkgKiogMiA8IGRvdWJsZVRhcFRocmVzaG9sZC5kaXN0YW5jZTtcclxuXHJcbiAgICAgICAgcHJldlBvaW50ZXIgPSBkb3VibGVUYXAgPyBudWxsIDogX2V2ZW50O1xyXG5cclxuICAgICAgICBpZiAoX2V2ZW50LmJ1dHRvbiAhPSAwIHx8IF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5hbHRLZXkgfHwgX2V2ZW50LnNoaWZ0S2V5IHx8IChfZXZlbnQucG9pbnRlclR5cGUgPT0gXCJ0b3VjaFwiICYmICFkb3VibGVUYXApKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0b3VjaFN0YXRlID0gbnVsbDtcclxuXHJcbiAgICAgICAgbGV0IHBvczogxpIuVmVjdG9yMiA9IG5ldyDGki5WZWN0b3IyKF9ldmVudC5vZmZzZXRYLCBfZXZlbnQub2Zmc2V0WSk7XHJcbiAgICAgICAgbGV0IHBpY2tzOiDGki5QaWNrW10gPSDGki5QaWNrZXIucGlja1ZpZXdwb3J0KF92aWV3cG9ydCwgcG9zKTtcclxuICAgICAgICBpZiAocGlja3MubGVuZ3RoID09IDApXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gcGlja3Muc29ydCgoX2E6IMaSLlBpY2ssIF9iOiDGki5QaWNrKSA9PiAoX2EuekJ1ZmZlciA8IF9iLnpCdWZmZXIgJiYgX2EuZ2l6bW8pID8gLTEgOiAxKTtcclxuICAgICAgICBwaWNrcy5zb3J0KChfYSwgX2IpID0+IHtcclxuICAgICAgICAgIGlmIChfYS5naXptbyAmJiAhX2IuZ2l6bW8pXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgIGlmICghX2EuZ2l6bW8gJiYgX2IuZ2l6bW8pXHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgLy8gSWYgYm90aCBwaWNrcyBoYXZlIGEgZ2l6bW8gcHJvcGVydHkgb3IgaWYgbmVpdGhlciBkb2VzLCBwcmlvcml0aXplIGJhc2VkIG9uIHpCdWZmZXIgdmFsdWVcclxuICAgICAgICAgIHJldHVybiBfYS56QnVmZmVyIC0gX2IuekJ1ZmZlcjtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbGV0IHBvc0NhbWVyYTogxpIuVmVjdG9yMyA9IGNhbWVyYS5ub2RlQ2FtZXJhLm10eFdvcmxkLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgIC8vIGNhbWVyYS5tdHhMb2NhbC50cmFuc2xhdGlvbiA9IHBpY2tzWzBdLnBvc1dvcmxkO1xyXG4gICAgICAgIC8vIC8vIMaSLlJlbmRlci5wcmVwYXJlKGNhbWVyYSk7XHJcbiAgICAgICAgLy8gY2FtZXJhLnBvc2l0aW9uQ2FtZXJhKHBvc0NhbWVyYSk7XHJcbiAgICAgICAgLy8gaWYgKCEocGlja3NbMF0uZ2l6bW8gaW5zdGFuY2VvZiBDb21wb25lbnRUcmFuc2xhdG9yKSlcclxuICAgICAgICBpZiAoX3RyYW5zbGF0ZU9uUGljaygpKVxyXG4gICAgICAgICAgY2FtZXJhLm10eExvY2FsLnRyYW5zbGF0aW9uID0gcGlja3NbMF0ucG9zV29ybGQ7XHJcbiAgICAgICAgcmVkcmF3KCk7XHJcblxyXG4gICAgICAgIF92aWV3cG9ydC5jYW52YXMuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJwaWNrXCIsIHsgZGV0YWlsOiBwaWNrc1swXSwgYnViYmxlczogdHJ1ZSB9KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhuZFBvaW50ZXJVcChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGFjdGl2ZVBvaW50ZXJzLmRlbGV0ZShfZXZlbnQucG9pbnRlcklkKTtcclxuICAgICAgICBpZiAoYWN0aXZlUG9pbnRlcnMuc2l6ZSA8IDIpXHJcbiAgICAgICAgICBwcmV2RGlzdGFuY2UgPSAwO1xyXG5cclxuICAgICAgICB0b3VjaFN0YXRlID0gbnVsbDtcclxuICAgICAgICBmbHlpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaG5kV2hlZWxNb3ZlKF9ldmVudDogV2hlZWxFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIHpvb20oX2V2ZW50LmRlbHRhWSk7XHJcbiAgICAgICAgcmVkcmF3KCk7XHJcbiAgICAgIH1cclxuICAgICAgZnVuY3Rpb24gem9vbShfZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNhbWVyYS5kaXN0YW5jZSAqPSAxICsgX2RlbHRhICogX3NwZWVkQ2FtZXJhRGlzdGFuY2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHJlZHJhdygpOiB2b2lkIHtcclxuICAgICAgICBpZiAoZm9jdXMpXHJcbiAgICAgICAgICBmb2N1cy5tdHhMb2NhbC50cmFuc2xhdGlvbiA9IGNhbWVyYS5tdHhMb2NhbC50cmFuc2xhdGlvbjtcclxuICAgICAgICDGki5SZW5kZXIucHJlcGFyZShjYW1lcmEpO1xyXG4gICAgICAgIF9yZWRyYXcoKTtcclxuICAgICAgICAvLyBfdmlld3BvcnQuZHJhdygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59Il19