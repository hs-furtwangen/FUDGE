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
            origin: ƒ.Color.CSS("dimgray", 0.75)
        };
        #colorsLight = {
            x: ƒ.Color.CSS("salmon"),
            y: ƒ.Color.CSS("lightgreen"),
            z: ƒ.Color.CSS("cornflowerblue")
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
        addListeners = () => {
            this.viewport.canvas.addEventListener("pointerdown", this.hndPointerDown);
            this.viewport.canvas.addEventListener("pointermove", this.hndPointerMove);
            this.viewport.canvas.addEventListener("pointerup", this.hndPointerUp);
            this.viewport.canvas.addEventListener("pointerleave", this.hndPointerUp);
            this.viewport.canvas.addEventListener("pointercancel", this.hndPointerUp);
            this.viewport.addEventListener("renderEnd" /* ƒ.EVENT.RENDER_END */, this.hndRenderEnd);
        };
        removeListeners = () => {
            this.viewport.canvas.removeEventListener("pointerdown", this.hndPointerDown);
            this.viewport.canvas.removeEventListener("pointermove", this.hndPointerMove);
            this.viewport.canvas.removeEventListener("pointerup", this.hndPointerUp);
            this.viewport.canvas.removeEventListener("pointerleave", this.hndPointerUp);
            this.viewport.canvas.removeEventListener("pointercancel", this.hndPointerUp);
            this.viewport.removeEventListener("renderEnd" /* ƒ.EVENT.RENDER_END */, this.hndRenderEnd);
        };
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
                ƒ.Gizmos.drawLines(line, mtx.lookIn(this.#axes[this.selected](), this.#normals[this.selected]()), this.#colorsLight[this.selected], 1);
                ƒ.Recycler.storeMultiple(mtx, line[0], line[1]);
            }
            let clrX = this.selected == "x" && !this.#isTransforming ? this.#colorsLight[this.selected] : this.#colors.x;
            let clrY = this.selected == "y" && !this.#isTransforming ? this.#colorsLight[this.selected] : this.#colors.y;
            let clrZ = this.selected == "z" && !this.#isTransforming ? this.#colorsLight[this.selected] : this.#colors.z;
            switch (this.mode) {
                case "translate":
                    lengthArrow = scale * (isPicking ? 90 : 80); // 80 pixels long
                    sizeHead = scale * 12; // 12 pixels wide
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrX, this.#axes.x(), this.#normals.x(), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrY, this.#axes.y(), this.#normals.y(), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrZ, this.#axes.z(), this.#normals.z(), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                    if (this.#isTransforming) {
                        let scaleOrigin = _cmpCamera.getWorldToPixelScale(this.#mtxWorldBase.translation);
                        ƒ.Gizmos.drawArrow(this.#mtxWorldBase.translation, this.#colors.origin, this.#axes[this.selected](), this.#normals[this.selected](), scaleOrigin * 80, scaleOrigin * 1, scaleOrigin * 12, ƒ.MeshPyramid, 1);
                    }
                    // ƒ.Gizmos.drawArrow(this.mtxWorld.translation, ƒ.Color.CSS("magenta"), this.normal, this.axes[this.selected], lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
                    break;
                case "rotate":
                    let radius = scale * 80; // 80 pixels radius
                    sizeHead = scale * 12;
                    if (this.#isTransforming) {
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
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors[this.selected], this.#axes[this.selected](), this.#normals[this.selected](), lengthArrow * this.#scaleFactor, widthArrow, sizeHead, ƒ.MeshCube, 1);
                        ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors.origin, this.#axes[this.selected](), this.#normals[this.selected](), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
                        break;
                    }
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrX, this.#axes.x(), this.#normals.x(), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrY, this.#axes.y(), this.#normals.y(), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
                    ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrZ, this.#axes.z(), this.#normals.z(), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
                    break;
            }
        }
        hndPointerDown = (_event) => {
            if (!this.camera || !this.viewport || !this.selected || !this.#mtxLocal || !this.#mtxWorld)
                return;
            this.#mtxLocalBase.copy(this.#mtxLocal);
            this.#mtxWorldBase.copy(this.#mtxWorld);
            const mtxNormal = ƒ.Matrix4x4.LOOK_AT(this.#mtxWorld.translation, this.camera.mtxWorld.translation, this.#axes[this.selected](), true);
            this.#normal.copy(mtxNormal.forward); // normal of the plane the mouse ray will collide with
            const point = this.getPoint3D(_event);
            this.#offset.copy(point.subtract(this.#mtxWorld.translation));
            ƒ.Recycler.storeMultiple(mtxNormal, point);
        };
        hndPointerMove = (_event) => {
            this.#isTransforming = false;
            this.viewport.canvas.style.cursor = "default";
            if (_event.buttons != 1) {
                const point = new ƒ.Vector2(_event.offsetX, _event.offsetY);
                const pick = ƒ.Picker.pickCamera([this], this.camera, this.viewport.pointClientToProjection(point))[0];
                if (pick?.color.r > 0.7)
                    this.selected = "x";
                else if (pick?.color.g > 0.7)
                    this.selected = "y";
                else if (pick?.color.b > 0.7)
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
            this.#isTransforming = true;
            this.viewport.canvas.style.cursor = "grabbing";
            this.#direction.copy(this.getPoint3D(_event).subtract(this.#mtxWorldBase.translation));
            this.#mtxLocal.copy(this.#mtxLocalBase); // reset
            const axis = this.#axes[this.selected]();
            switch (this.mode) {
                case "translate":
                    const mtxWorldInvserse = this.#mtxWorldBase.clone.invert();
                    const translation = ƒ.Vector3.PROJECTION(this.#direction, axis);
                    const translationOffset = ƒ.Vector3.PROJECTION(this.#offset, axis);
                    translation.subtract(translationOffset);
                    translation.transform(mtxWorldInvserse, false);
                    this.#mtxLocal.translate(translation);
                    ƒ.Recycler.storeMultiple(mtxWorldInvserse, translation, translationOffset);
                    break;
                case "rotate":
                    const rotationInverse = this.#mtxWorldBase.quaternion.clone.invert();
                    // rotate vectors into local space
                    const offsetLocal = this.#offset.clone.transform(rotationInverse);
                    const directionLocal = this.#direction.clone.transform(rotationInverse);
                    const axisLocal = axis.transform(rotationInverse);
                    let angle = ƒ.Vector3.ANGLE(offsetLocal, directionLocal);
                    // Determine the direction of rotation
                    const cross = ƒ.Vector3.CROSS(offsetLocal, directionLocal);
                    if (ƒ.Vector3.DOT(axisLocal, cross) < 0)
                        angle = -angle;
                    const rotation = ƒ.Quaternion.ROTATION(axisLocal, angle);
                    this.#mtxLocal.rotate(rotation);
                    ƒ.Recycler.storeMultiple(rotationInverse, offsetLocal, directionLocal, axisLocal, cross, rotation);
                    break;
                case "scale":
                    this.#scaleFactor = Math.sign(ƒ.Vector3.DOT(axis, this.#direction)) * this.#direction.magnitude / this.#offset.magnitude;
                    const vctScaling = ƒ.Vector3.ONE();
                    vctScaling[this.selected] = this.#scaleFactor;
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
        };
        hndPointerUp = (_event) => {
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
            const normal = this.mode == "rotate" ? this.#axes[this.selected]() : this.#normal;
            ƒ.Recycler.store(point2D);
            return ray.intersectPlane(this.#mtxWorldBase.translation, normal);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVkZ2VBaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9Tb3VyY2UvQWlkL1JlZmVyZW5jZXMudHMiLCIuLi9Tb3VyY2UvQWlkL0FyaXRobWV0aWMvQXJpdGgudHMiLCIuLi9Tb3VyY2UvQWlkL0FyaXRobWV0aWMvQXJpdGhCaXNlY3Rpb24udHMiLCIuLi9Tb3VyY2UvQWlkL0NhbWVyYS9DYW1lcmFPcmJpdC50cyIsIi4uL1NvdXJjZS9BaWQvQ2FtZXJhL0NhbWVyYU9yYml0TW92aW5nRm9jdXMudHMiLCIuLi9Tb3VyY2UvQWlkL0NhbnZhcy9DYW52YXMudHMiLCIuLi9Tb3VyY2UvQWlkL0dlb21ldHJ5L05vZGUudHMiLCIuLi9Tb3VyY2UvQWlkL0dlb21ldHJ5L05vZGVBcnJvdy50cyIsIi4uL1NvdXJjZS9BaWQvR2VvbWV0cnkvTm9kZUNvb3JkaW5hdGVTeXN0ZW0udHMiLCIuLi9Tb3VyY2UvQWlkL0xpZ2h0L05vZGVMaWdodFNldHVwLnRzIiwiLi4vU291cmNlL0FpZC9TcHJpdGUvTm9kZVNwcml0ZS50cyIsIi4uL1NvdXJjZS9BaWQvU3ByaXRlL1Nwcml0ZVNoZWV0QW5pbWF0aW9uLnRzIiwiLi4vU291cmNlL0FpZC9TdGF0ZU1hY2hpbmUvQ29tcG9uZW50U3RhdGVNYWNoaW5lLnRzIiwiLi4vU291cmNlL0FpZC9TdGF0ZU1hY2hpbmUvU3RhdGVNYWNoaW5lLnRzIiwiLi4vU291cmNlL0FpZC9UcmFuc2Zvcm0vVHJhbnNmb3JtYXRvci50cyIsIi4uL1NvdXJjZS9BaWQvVmlld3BvcnQvVmlld3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBEQUEwRDtBQUMxRCxJQUFVLFFBQVEsQ0FFakI7QUFIRCwwREFBMEQ7QUFDMUQsV0FBVSxRQUFRO0lBQ2hCLFNBQVMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkQsQ0FBQyxFQUZTLFFBQVEsS0FBUixRQUFRLFFBRWpCO0FDSEQsSUFB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LENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNwRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVySyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO3FCQUNwQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztxQkFDbkMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25ELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztxQkFDcEMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25ELE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7cUJBQ25D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QUcsb0JBQW9CLENBQUM7WUFDdkQsQ0FBQztZQUVELFNBQVMsTUFBTTtnQkFDYixJQUFJLEtBQUs7b0JBQ1AsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7Z0JBQzNELENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QixPQUFPLEVBQUUsQ0FBQztnQkFDVixvQkFBb0I7WUFDdEIsQ0FBQztRQUNILENBQUM7S0FDRjtJQTlOWSxpQkFBUSxXQThOcEIsQ0FBQTtBQUNILENBQUMsRUFsT1MsUUFBUSxLQUFSLFFBQVEsUUFrT2pCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi9EaXN0cmlidXRpb24vRnVkZ2VDb3JlLmQudHNcIi8+XHJcbm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgRnVkZ2VDb3JlLlNlcmlhbGl6ZXIucmVnaXN0ZXJOYW1lc3BhY2UoRnVkZ2VBaWQpO1xyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICAvKipcclxuICAgKiBBYnN0cmFjdCBjbGFzcyBzdXBwb3J0aW5nIHZlcnNpb3VzIGFyaXRobWV0aWNhbCBoZWxwZXIgZnVuY3Rpb25zXHJcbiAgICovXHJcbiAgZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFyaXRoIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgb25lIG9mIHRoZSB2YWx1ZXMgcGFzc2VkIGluLCBlaXRoZXIgX3ZhbHVlIGlmIHdpdGhpbiBfbWluIGFuZCBfbWF4IG9yIHRoZSBib3VuZGFyeSBiZWluZyBleGNlZWRlZCBieSBfdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjbGFtcDxUPihfdmFsdWU6IFQsIF9taW46IFQsIF9tYXg6IFQsIF9pc1NtYWxsZXI6IChfdmFsdWUxOiBULCBfdmFsdWUyOiBUKSA9PiBib29sZWFuID0gKF92YWx1ZTE6IFQsIF92YWx1ZTI6IFQpID0+IHsgcmV0dXJuIF92YWx1ZTEgPCBfdmFsdWUyOyB9KTogVCB7XHJcbiAgICAgIGlmIChfaXNTbWFsbGVyKF92YWx1ZSwgX21pbikpIHJldHVybiBfbWluO1xyXG4gICAgICBpZiAoX2lzU21hbGxlcihfbWF4LCBfdmFsdWUpKSByZXR1cm4gX21heDtcclxuICAgICAgcmV0dXJuIF92YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIC8qKlxyXG4gICAqIFdpdGhpbiBhIGdpdmVuIHByZWNpc2lvbiwgYW4gb2JqZWN0IG9mIHRoaXMgY2xhc3MgZmluZHMgdGhlIHBhcmFtZXRlciB2YWx1ZSBhdCB3aGljaCBhIGdpdmVuIGZ1bmN0aW9uIFxyXG4gICAqIHN3aXRjaGVzIGl0cyBib29sZWFuIHJldHVybiB2YWx1ZSB1c2luZyBpbnRlcnZhbCBzcGxpdHRpbmcgKGJpc2VjdGlvbikuIFxyXG4gICAqIFBhc3MgdGhlIHR5cGUgb2YgdGhlIHBhcmFtZXRlciBhbmQgdGhlIHR5cGUgdGhlIHByZWNpc2lvbiBpcyBtZWFzdXJlZCBpbi5cclxuICAgKi9cclxuICBleHBvcnQgY2xhc3MgQXJpdGhCaXNlY3Rpb248UGFyYW1ldGVyLCBFcHNpbG9uPiB7XHJcbiAgICAvKiogVGhlIGxlZnQgYm9yZGVyIG9mIHRoZSBpbnRlcnZhbCBmb3VuZCAqL1xyXG4gICAgcHVibGljIGxlZnQ6IFBhcmFtZXRlcjtcclxuICAgIC8qKiBUaGUgcmlnaHQgYm9yZGVyIG9mIHRoZSBpbnRlcnZhbCBmb3VuZCAqL1xyXG4gICAgcHVibGljIHJpZ2h0OiBQYXJhbWV0ZXI7XHJcbiAgICAvKiogVGhlIGZ1bmN0aW9uIHZhbHVlIGF0IHRoZSBsZWZ0IGJvcmRlciBvZiB0aGUgaW50ZXJ2YWwgZm91bmQgKi9cclxuICAgIHB1YmxpYyBsZWZ0VmFsdWU6IGJvb2xlYW47XHJcbiAgICAvKiogVGhlIGZ1bmN0aW9uIHZhbHVlIGF0IHRoZSByaWdodCBib3JkZXIgb2YgdGhlIGludGVydmFsIGZvdW5kICovXHJcbiAgICBwdWJsaWMgcmlnaHRWYWx1ZTogYm9vbGVhbjtcclxuXHJcbiAgICBwcml2YXRlIGZ1bmN0aW9uOiAoX3Q6IFBhcmFtZXRlcikgPT4gYm9vbGVhbjtcclxuICAgIHByaXZhdGUgZGl2aWRlOiAoX2xlZnQ6IFBhcmFtZXRlciwgX3JpZ2h0OiBQYXJhbWV0ZXIpID0+IFBhcmFtZXRlcjtcclxuICAgIHByaXZhdGUgaXNTbWFsbGVyOiAoX2xlZnQ6IFBhcmFtZXRlciwgX3JpZ2h0OiBQYXJhbWV0ZXIsIF9lcHNpbG9uOiBFcHNpbG9uKSA9PiBib29sZWFuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIG5ldyBTb2x2ZXJcclxuICAgICAqIEBwYXJhbSBfZnVuY3Rpb24gQSBmdW5jdGlvbiB0aGF0IHRha2VzIGFuIGFyZ3VtZW50IG9mIHRoZSBnZW5lcmljIHR5cGUgPFBhcmFtZXRlcj4gYW5kIHJldHVybnMgYSBib29sZWFuIHZhbHVlLlxyXG4gICAgICogQHBhcmFtIF9kaXZpZGUgQSBmdW5jdGlvbiBzcGxpdHRpbmcgdGhlIGludGVydmFsIHRvIGZpbmQgYSBwYXJhbWV0ZXIgZm9yIHRoZSBuZXh0IGl0ZXJhdGlvbiwgbWF5IHNpbXBseSBiZSB0aGUgYXJpdGhtZXRpYyBtZWFuXHJcbiAgICAgKiBAcGFyYW0gX2lzU21hbGxlciBBIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyBhIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgYm9yZGVycyBvZiB0aGUgY3VycmVudCBpbnRlcnZhbCBhbmQgY29tcGFyZXMgdGhpcyB0byB0aGUgZ2l2ZW4gcHJlY2lzaW9uIFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgX2Z1bmN0aW9uOiAoX3Q6IFBhcmFtZXRlcikgPT4gYm9vbGVhbixcclxuICAgICAgX2RpdmlkZTogKF9sZWZ0OiBQYXJhbWV0ZXIsIF9yaWdodDogUGFyYW1ldGVyKSA9PiBQYXJhbWV0ZXIsXHJcbiAgICAgIF9pc1NtYWxsZXI6IChfbGVmdDogUGFyYW1ldGVyLCBfcmlnaHQ6IFBhcmFtZXRlciwgX2Vwc2lsb246IEVwc2lsb24pID0+IGJvb2xlYW4pIHtcclxuICAgICAgdGhpcy5mdW5jdGlvbiA9IF9mdW5jdGlvbjtcclxuICAgICAgdGhpcy5kaXZpZGUgPSBfZGl2aWRlO1xyXG4gICAgICB0aGlzLmlzU21hbGxlciA9IF9pc1NtYWxsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kcyBhIHNvbHV0aW9uIHdpdGggdGhlIGdpdmVuIHByZWNpc2lvbiBpbiB0aGUgZ2l2ZW4gaW50ZXJ2YWwgdXNpbmcgdGhlIGZ1bmN0aW9ucyB0aGlzIFNvbHZlciB3YXMgY29uc3RydWN0ZWQgd2l0aC5cclxuICAgICAqIEFmdGVyIHRoZSBtZXRob2QgcmV0dXJucywgZmluZCB0aGUgZGF0YSBpbiB0aGlzIG9iamVjdHMgcHJvcGVydGllcy5cclxuICAgICAqIEBwYXJhbSBfbGVmdCBUaGUgcGFyYW1ldGVyIG9uIG9uZSBzaWRlIG9mIHRoZSBpbnRlcnZhbC5cclxuICAgICAqIEBwYXJhbSBfcmlnaHQgVGhlIHBhcmFtZXRlciBvbiB0aGUgb3RoZXIgc2lkZSwgbWF5IGJlIFwic21hbGxlclwiIHRoYW4gW1tfbGVmdF1dLlxyXG4gICAgICogQHBhcmFtIF9lcHNpbG9uIFRoZSBkZXNpcmVkIHByZWNpc2lvbiBvZiB0aGUgc29sdXRpb24uXHJcbiAgICAgKiBAcGFyYW0gX2xlZnRWYWx1ZSBUaGUgdmFsdWUgb24gdGhlIGxlZnQgc2lkZSBvZiB0aGUgaW50ZXJ2YWwsIG9taXQgaWYgeWV0IHVua25vd24gb3IgcGFzcyBpbiBpZiBrbm93biBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLlxyXG4gICAgICogQHBhcmFtIF9yaWdodFZhbHVlIFRoZSB2YWx1ZSBvbiB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgaW50ZXJ2YWwsIG9taXQgaWYgeWV0IHVua25vd24gb3IgcGFzcyBpbiBpZiBrbm93biBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLlxyXG4gICAgICogQHRocm93cyBFcnJvciBpZiBib3RoIHNpZGVzIG9mIHRoZSBpbnRlcnZhbCByZXR1cm4gdGhlIHNhbWUgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzb2x2ZShfbGVmdDogUGFyYW1ldGVyLCBfcmlnaHQ6IFBhcmFtZXRlciwgX2Vwc2lsb246IEVwc2lsb24sIF9sZWZ0VmFsdWU6IGJvb2xlYW4gPSB1bmRlZmluZWQsIF9yaWdodFZhbHVlOiBib29sZWFuID0gdW5kZWZpbmVkKTogdm9pZCB7XHJcbiAgICAgIHRoaXMubGVmdCA9IF9sZWZ0O1xyXG4gICAgICB0aGlzLmxlZnRWYWx1ZSA9IF9sZWZ0VmFsdWUgfHwgdGhpcy5mdW5jdGlvbihfbGVmdCk7XHJcbiAgICAgIHRoaXMucmlnaHQgPSBfcmlnaHQ7XHJcbiAgICAgIHRoaXMucmlnaHRWYWx1ZSA9IF9yaWdodFZhbHVlIHx8IHRoaXMuZnVuY3Rpb24oX3JpZ2h0KTtcclxuXHJcbiAgICAgIGlmICh0aGlzLmlzU21hbGxlcihfbGVmdCwgX3JpZ2h0LCBfZXBzaWxvbikpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKHRoaXMubGVmdFZhbHVlID09IHRoaXMucmlnaHRWYWx1ZSlcclxuICAgICAgICB0aHJvdyhuZXcgRXJyb3IoXCJJbnRlcnZhbCBzb2x2ZXIgY2FuJ3Qgb3BlcmF0ZSB3aXRoIGlkZW50aWNhbCBmdW5jdGlvbiB2YWx1ZXMgb24gYm90aCBzaWRlcyBvZiB0aGUgaW50ZXJ2YWxcIikpO1xyXG5cclxuICAgICAgbGV0IGJldHdlZW46IFBhcmFtZXRlciA9IHRoaXMuZGl2aWRlKF9sZWZ0LCBfcmlnaHQpO1xyXG4gICAgICBsZXQgYmV0d2VlblZhbHVlOiBib29sZWFuID0gdGhpcy5mdW5jdGlvbihiZXR3ZWVuKTtcclxuICAgICAgaWYgKGJldHdlZW5WYWx1ZSA9PSB0aGlzLmxlZnRWYWx1ZSlcclxuICAgICAgICB0aGlzLnNvbHZlKGJldHdlZW4sIHRoaXMucmlnaHQsIF9lcHNpbG9uLCBiZXR3ZWVuVmFsdWUsIHRoaXMucmlnaHRWYWx1ZSk7XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aGlzLnNvbHZlKHRoaXMubGVmdCwgYmV0d2VlbiwgX2Vwc2lsb24sIHRoaXMubGVmdFZhbHVlLCBiZXR3ZWVuVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICBsZXQgb3V0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICBvdXQgKz0gYGxlZnQ6ICR7dGhpcy5sZWZ0LnRvU3RyaW5nKCl9IC0+ICR7dGhpcy5sZWZ0VmFsdWV9YDtcclxuICAgICAgb3V0ICs9IFwiXFxuXCI7XHJcbiAgICAgIG91dCArPSBgcmlnaHQ6ICR7dGhpcy5yaWdodC50b1N0cmluZygpfSAtPiAke3RoaXMucmlnaHRWYWx1ZX1gO1xyXG4gICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgQ2FtZXJhT3JiaXQgZXh0ZW5kcyDGki5Ob2RlIHtcclxuICAgIHB1YmxpYyByZWFkb25seSBheGlzUm90YXRlWDogxpIuQXhpcyA9IG5ldyDGki5BeGlzKFwiUm90YXRlWFwiLCAxLCDGki5DT05UUk9MX1RZUEUuUFJPUE9SVElPTkFMKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBheGlzUm90YXRlWTogxpIuQXhpcyA9IG5ldyDGki5BeGlzKFwiUm90YXRlWVwiLCAxLCDGki5DT05UUk9MX1RZUEUuUFJPUE9SVElPTkFMKTtcclxuICAgIHB1YmxpYyByZWFkb25seSBheGlzRGlzdGFuY2U6IMaSLkF4aXMgPSBuZXcgxpIuQXhpcyhcIkRpc3RhbmNlXCIsIDEsIMaSLkNPTlRST0xfVFlQRS5QUk9QT1JUSU9OQUwpO1xyXG5cclxuICAgIHB1YmxpYyBtaW5EaXN0YW5jZTogbnVtYmVyO1xyXG4gICAgcHVibGljIG1heERpc3RhbmNlOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgdHJhbnNsYXRvcjogxpIuTm9kZTtcclxuICAgIHByb3RlY3RlZCByb3RhdG9yWDogxpIuTm9kZTtcclxuICAgIHByaXZhdGUgbWF4Um90WDogbnVtYmVyO1xyXG5cclxuXHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSwgX2Rpc3RhbmNlU3RhcnQ6IG51bWJlciA9IDIsIF9tYXhSb3RYOiBudW1iZXIgPSA3NSwgX21pbkRpc3RhbmNlOiBudW1iZXIgPSAxLCBfbWF4RGlzdGFuY2U6IG51bWJlciA9IDEwKSB7XHJcbiAgICAgIHN1cGVyKFwiQ2FtZXJhT3JiaXRcIik7XHJcblxyXG4gICAgICB0aGlzLm1heFJvdFggPSBNYXRoLm1pbihfbWF4Um90WCwgODkpO1xyXG4gICAgICB0aGlzLm1pbkRpc3RhbmNlID0gX21pbkRpc3RhbmNlO1xyXG4gICAgICB0aGlzLm1heERpc3RhbmNlID0gX21heERpc3RhbmNlO1xyXG5cclxuICAgICAgbGV0IGNtcFRyYW5zZm9ybTogxpIuQ29tcG9uZW50VHJhbnNmb3JtID0gbmV3IMaSLkNvbXBvbmVudFRyYW5zZm9ybSgpO1xyXG4gICAgICB0aGlzLmFkZENvbXBvbmVudChjbXBUcmFuc2Zvcm0pO1xyXG5cclxuICAgICAgdGhpcy5yb3RhdG9yWCA9IG5ldyDGki5Ob2RlKFwiQ2FtZXJhUm90YXRpb25YXCIpO1xyXG4gICAgICB0aGlzLnJvdGF0b3JYLmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50VHJhbnNmb3JtKCkpO1xyXG4gICAgICB0aGlzLmFkZENoaWxkKHRoaXMucm90YXRvclgpO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0b3IgPSBuZXcgxpIuTm9kZShcIkNhbWVyYVRyYW5zbGF0ZVwiKTtcclxuICAgICAgdGhpcy50cmFuc2xhdG9yLmFkZENvbXBvbmVudChuZXcgxpIuQ29tcG9uZW50VHJhbnNmb3JtKCkpO1xyXG4gICAgICB0aGlzLnRyYW5zbGF0b3IubXR4TG9jYWwucm90YXRlWSgxODApO1xyXG4gICAgICB0aGlzLnJvdGF0b3JYLmFkZENoaWxkKHRoaXMudHJhbnNsYXRvcik7XHJcblxyXG4gICAgICB0aGlzLnRyYW5zbGF0b3IuYWRkQ29tcG9uZW50KF9jbXBDYW1lcmEpO1xyXG4gICAgICB0aGlzLmRpc3RhbmNlID0gX2Rpc3RhbmNlU3RhcnQ7XHJcblxyXG4gICAgICB0aGlzLmF4aXNSb3RhdGVYLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlRfQ09OVFJPTC5PVVRQVVQsIHRoaXMuaG5kQXhpc091dHB1dCk7XHJcbiAgICAgIHRoaXMuYXhpc1JvdGF0ZVkuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVF9DT05UUk9MLk9VVFBVVCwgdGhpcy5obmRBeGlzT3V0cHV0KTtcclxuICAgICAgdGhpcy5heGlzRGlzdGFuY2UuYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVF9DT05UUk9MLk9VVFBVVCwgdGhpcy5obmRBeGlzT3V0cHV0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGNtcENhbWVyYSgpOiDGki5Db21wb25lbnRDYW1lcmEge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yLmdldENvbXBvbmVudCjGki5Db21wb25lbnRDYW1lcmEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbm9kZUNhbWVyYSgpOiDGki5Ob2RlIHtcclxuICAgICAgcmV0dXJuIHRoaXMudHJhbnNsYXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGRpc3RhbmNlKF9kaXN0YW5jZTogbnVtYmVyKSB7XHJcbiAgICAgIGxldCBuZXdEaXN0YW5jZTogbnVtYmVyID0gTWF0aC5taW4odGhpcy5tYXhEaXN0YW5jZSwgTWF0aC5tYXgodGhpcy5taW5EaXN0YW5jZSwgX2Rpc3RhbmNlKSk7XHJcbiAgICAgIHRoaXMudHJhbnNsYXRvci5tdHhMb2NhbC50cmFuc2xhdGlvbiA9IMaSLlZlY3RvcjMuWihuZXdEaXN0YW5jZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBkaXN0YW5jZSgpOiBudW1iZXIge1xyXG4gICAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yLm10eExvY2FsLnRyYW5zbGF0aW9uLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCByb3RhdGlvblkoX2FuZ2xlOiBudW1iZXIpIHtcclxuICAgICAgdGhpcy5tdHhMb2NhbC5yb3RhdGlvbiA9IMaSLlZlY3RvcjMuWShfYW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcm90YXRpb25ZKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLm10eExvY2FsLnJvdGF0aW9uLnk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCByb3RhdGlvblgoX2FuZ2xlOiBudW1iZXIpIHtcclxuICAgICAgX2FuZ2xlID0gTWF0aC5taW4oTWF0aC5tYXgoLXRoaXMubWF4Um90WCwgX2FuZ2xlKSwgdGhpcy5tYXhSb3RYKTtcclxuICAgICAgdGhpcy5yb3RhdG9yWC5tdHhMb2NhbC5yb3RhdGlvbiA9IMaSLlZlY3RvcjMuWChfYW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcm90YXRpb25YKCk6IG51bWJlciB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJvdGF0b3JYLm10eExvY2FsLnJvdGF0aW9uLng7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJvdGF0ZVkoX2RlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5tdHhMb2NhbC5yb3RhdGVZKF9kZWx0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJvdGF0ZVgoX2RlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5yb3RhdGlvblggPSB0aGlzLnJvdGF0b3JYLm10eExvY2FsLnJvdGF0aW9uLnggKyBfZGVsdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2V0IHBvc2l0aW9uIG9mIGNhbWVyYSBjb21wb25lbnQgcmVsYXRpdmUgdG8gdGhlIGNlbnRlciBvZiBvcmJpdFxyXG4gICAgcHVibGljIHBvc2l0aW9uQ2FtZXJhKF9wb3NXb3JsZDogxpIuVmVjdG9yMyk6IHZvaWQge1xyXG4gICAgICBsZXQgZGlmZmVyZW5jZTogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuRElGRkVSRU5DRShfcG9zV29ybGQsIHRoaXMubXR4V29ybGQudHJhbnNsYXRpb24pO1xyXG4gICAgICBsZXQgZ2VvOiDGki5HZW8zID0gZGlmZmVyZW5jZS5nZW87XHJcbiAgICAgIHRoaXMucm90YXRpb25ZID0gZ2VvLmxvbmdpdHVkZTtcclxuICAgICAgdGhpcy5yb3RhdGlvblggPSAtZ2VvLmxhdGl0dWRlO1xyXG4gICAgICB0aGlzLmRpc3RhbmNlID0gZ2VvLm1hZ25pdHVkZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIGhuZEF4aXNPdXRwdXQ6IEV2ZW50TGlzdGVuZXIgPSAoX2V2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsZXQgb3V0cHV0OiBudW1iZXIgPSAoPEN1c3RvbUV2ZW50Pl9ldmVudCkuZGV0YWlsLm91dHB1dDtcclxuICAgICAgc3dpdGNoICgoPMaSLkF4aXM+X2V2ZW50LnRhcmdldCkubmFtZSkge1xyXG4gICAgICAgIGNhc2UgXCJSb3RhdGVYXCI6XHJcbiAgICAgICAgICB0aGlzLnJvdGF0ZVgob3V0cHV0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJSb3RhdGVZXCI6XHJcbiAgICAgICAgICB0aGlzLnJvdGF0ZVkob3V0cHV0KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJEaXN0YW5jZVwiOlxyXG4gICAgICAgICAgdGhpcy5kaXN0YW5jZSArPSBvdXRwdXQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgZXhwb3J0IGNsYXNzIENhbWVyYU9yYml0TW92aW5nRm9jdXMgZXh0ZW5kcyBDYW1lcmFPcmJpdCB7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXhpc1RyYW5zbGF0ZVg6IMaSLkF4aXMgPSBuZXcgxpIuQXhpcyhcIlRyYW5zbGF0ZVhcIiwgMSwgxpIuQ09OVFJPTF9UWVBFLlBST1BPUlRJT05BTCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXhpc1RyYW5zbGF0ZVk6IMaSLkF4aXMgPSBuZXcgxpIuQXhpcyhcIlRyYW5zbGF0ZVlcIiwgMSwgxpIuQ09OVFJPTF9UWVBFLlBST1BPUlRJT05BTCk7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXhpc1RyYW5zbGF0ZVo6IMaSLkF4aXMgPSBuZXcgxpIuQXhpcyhcIlRyYW5zbGF0ZVpcIiwgMSwgxpIuQ09OVFJPTF9UWVBFLlBST1BPUlRJT05BTCk7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9jbXBDYW1lcmE6IMaSLkNvbXBvbmVudENhbWVyYSwgX2Rpc3RhbmNlU3RhcnQ6IG51bWJlciA9IDUsIF9tYXhSb3RYOiBudW1iZXIgPSA4NSwgX21pbkRpc3RhbmNlOiBudW1iZXIgPSAwLCBfbWF4RGlzdGFuY2U6IG51bWJlciA9IEluZmluaXR5KSB7XHJcbiAgICAgIHN1cGVyKF9jbXBDYW1lcmEsIF9kaXN0YW5jZVN0YXJ0LCBfbWF4Um90WCwgX21pbkRpc3RhbmNlLCBfbWF4RGlzdGFuY2UpO1xyXG4gICAgICB0aGlzLm5hbWUgPSBcIkNhbWVyYU9yYml0TW92aW5nRm9jdXNcIjtcclxuXHJcbiAgICAgIHRoaXMuYXhpc1RyYW5zbGF0ZVguYWRkRXZlbnRMaXN0ZW5lcijGki5FVkVOVF9DT05UUk9MLk9VVFBVVCwgdGhpcy5obmRBeGlzT3V0cHV0KTtcclxuICAgICAgdGhpcy5heGlzVHJhbnNsYXRlWS5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5UX0NPTlRST0wuT1VUUFVULCB0aGlzLmhuZEF4aXNPdXRwdXQpO1xyXG4gICAgICB0aGlzLmF4aXNUcmFuc2xhdGVaLmFkZEV2ZW50TGlzdGVuZXIoxpIuRVZFTlRfQ09OVFJPTC5PVVRQVVQsIHRoaXMuaG5kQXhpc091dHB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zbGF0ZVgoX2RlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5tdHhMb2NhbC50cmFuc2xhdGVYKF9kZWx0YSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyB0cmFuc2xhdGVZKF9kZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGxldCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMyA9IHRoaXMucm90YXRvclgubXR4V29ybGQuZ2V0WSgpO1xyXG4gICAgICB0cmFuc2xhdGlvbi5ub3JtYWxpemUoX2RlbHRhKTtcclxuICAgICAgdGhpcy5tdHhMb2NhbC50cmFuc2xhdGUodHJhbnNsYXRpb24sIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlWihfZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAvLyB0aGlzLm10eExvY2FsLnRyYW5zbGF0ZVooX2RlbHRhKTtcclxuICAgICAgbGV0IHRyYW5zbGF0aW9uOiDGki5WZWN0b3IzID0gdGhpcy5yb3RhdG9yWC5tdHhXb3JsZC5nZXRaKCk7XHJcbiAgICAgIHRyYW5zbGF0aW9uLm5vcm1hbGl6ZShfZGVsdGEpO1xyXG4gICAgICB0aGlzLm10eExvY2FsLnRyYW5zbGF0ZSh0cmFuc2xhdGlvbiwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBobmRBeGlzT3V0cHV0OiBFdmVudExpc3RlbmVyID0gKF9ldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGV0IG91dHB1dDogbnVtYmVyID0gKDxDdXN0b21FdmVudD5fZXZlbnQpLmRldGFpbC5vdXRwdXQ7XHJcbiAgICAgIHN3aXRjaCAoKDzGki5BeGlzPl9ldmVudC50YXJnZXQpLm5hbWUpIHtcclxuICAgICAgICBjYXNlIFwiVHJhbnNsYXRlWFwiOlxyXG4gICAgICAgICAgdGhpcy50cmFuc2xhdGVYKG91dHB1dCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiVHJhbnNsYXRlWVwiOlxyXG4gICAgICAgICAgdGhpcy50cmFuc2xhdGVZKG91dHB1dCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwiVHJhbnNsYXRlWlwiOlxyXG4gICAgICAgICAgdGhpcy50cmFuc2xhdGVaKG91dHB1dCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGV4cG9ydCBlbnVtIElNQUdFX1JFTkRFUklORyB7XHJcbiAgICBBVVRPID0gXCJhdXRvXCIsXHJcbiAgICBTTU9PVEggPSBcInNtb290aFwiLFxyXG4gICAgSElHSF9RVUFMSVRZID0gXCJoaWdoLXF1YWxpdHlcIixcclxuICAgIENSSVNQX0VER0VTID0gXCJjcmlzcC1lZGdlc1wiLFxyXG4gICAgUElYRUxBVEVEID0gXCJwaXhlbGF0ZWRcIlxyXG4gIH1cclxuICAvKipcclxuICAgKiBBZGRzIGNvbWZvcnQgbWV0aG9kcyB0byBjcmVhdGUgYSByZW5kZXIgY2FudmFzXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIENhbnZhcyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShfZmlsbFBhcmVudDogYm9vbGVhbiA9IHRydWUsIF9pbWFnZVJlbmRlcmluZzogSU1BR0VfUkVOREVSSU5HID0gSU1BR0VfUkVOREVSSU5HLkFVVE8sIF93aWR0aDogbnVtYmVyID0gODAwLCBfaGVpZ2h0OiBudW1iZXIgPSA2MDApOiBIVE1MQ2FudmFzRWxlbWVudCB7XHJcbiAgICAgIGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgIGNhbnZhcy5pZCA9IFwiRlVER0VcIjtcclxuICAgICAgbGV0IHN0eWxlOiBDU1NTdHlsZURlY2xhcmF0aW9uID0gY2FudmFzLnN0eWxlO1xyXG4gICAgICBzdHlsZS5pbWFnZVJlbmRlcmluZyA9IF9pbWFnZVJlbmRlcmluZztcclxuICAgICAgc3R5bGUud2lkdGggPSBfd2lkdGggKyBcInB4XCI7XHJcbiAgICAgIHN0eWxlLmhlaWdodCA9IF9oZWlnaHQgKyBcInB4XCI7XHJcbiAgICAgIHN0eWxlLm1hcmdpbkJvdHRvbSA9IFwiLTAuMjVlbVwiO1xyXG4gICAgICBcclxuICAgICAgaWYgKF9maWxsUGFyZW50KSB7XHJcbiAgICAgICAgc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBzdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2FudmFzO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgTm9kZSBleHRlbmRzIMaSLk5vZGUge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX25hbWU6IHN0cmluZyA9IE5vZGUuZ2V0TmV4dE5hbWUoKSwgX3RyYW5zZm9ybT86IMaSLk1hdHJpeDR4NCwgX21hdGVyaWFsPzogxpIuTWF0ZXJpYWwsIF9tZXNoPzogxpIuTWVzaCkge1xyXG4gICAgICBzdXBlcihfbmFtZSk7XHJcbiAgICAgIGlmIChfdHJhbnNmb3JtKVxyXG4gICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRUcmFuc2Zvcm0oX3RyYW5zZm9ybSkpO1xyXG4gICAgICBpZiAoX21hdGVyaWFsKVxyXG4gICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNYXRlcmlhbChfbWF0ZXJpYWwpKTtcclxuICAgICAgaWYgKF9tZXNoKVxyXG4gICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KG5ldyDGki5Db21wb25lbnRNZXNoKF9tZXNoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0TmV4dE5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgcmV0dXJuIFwixpJBaWROb2RlX1wiICsgTm9kZS5jb3VudCsrO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbXR4TWVzaFBpdm90KCk6IMaSLk1hdHJpeDR4NCB7XHJcbiAgICAgIGxldCBjbXBNZXNoOiDGki5Db21wb25lbnRNZXNoID0gdGhpcy5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50TWVzaCk7XHJcbiAgICAgIHJldHVybiBjbXBNZXNoID8gY21wTWVzaC5tdHhQaXZvdCA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFzeW5jIGRlc2VyaWFsaXplKF9zZXJpYWxpemF0aW9uOiDGki5TZXJpYWxpemF0aW9uKTogUHJvbWlzZTzGki5TZXJpYWxpemFibGU+IHtcclxuICAgICAgLy8gUXVpY2sgYW5kIG1heWJlIGhhY2t5IHNvbHV0aW9uLiBDcmVhdGVkIG5vZGUgaXMgY29tcGxldGVseSBkaXNtaXNzZWQgYW5kIGEgcmVjcmVhdGlvbiBvZiB0aGUgYmFzZWNsYXNzIGdldHMgcmV0dXJuLiBPdGhlcndpc2UsIGNvbXBvbmVudHMgd2lsbCBiZSBkb3VibGVkLi4uXHJcbiAgICAgIGxldCBub2RlOiDGki5Ob2RlID0gbmV3IMaSLk5vZGUoX3NlcmlhbGl6YXRpb24ubmFtZSk7XHJcbiAgICAgIGF3YWl0IG5vZGUuZGVzZXJpYWxpemUoX3NlcmlhbGl6YXRpb24pO1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhub2RlKTtcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG5cclxuICBleHBvcnQgY2xhc3MgTm9kZUFycm93IGV4dGVuZHMgTm9kZSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpbnRlcm5hbFJlc291cmNlczogTWFwPHN0cmluZywgxpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+ID0gTm9kZUFycm93LmNyZWF0ZUludGVybmFsUmVzb3VyY2VzKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoX25hbWU6IHN0cmluZywgX2NvbG9yOiDGki5Db2xvcikge1xyXG4gICAgICBzdXBlcihfbmFtZSwgxpIuTWF0cml4NHg0LklERU5USVRZKCkpO1xyXG5cclxuICAgICAgbGV0IHNoYWZ0OiBOb2RlID0gbmV3IE5vZGUoX25hbWUgKyBcIlNoYWZ0XCIsIMaSLk1hdHJpeDR4NC5JREVOVElUWSgpLCA8xpIuTWF0ZXJpYWw+Tm9kZUFycm93LmludGVybmFsUmVzb3VyY2VzLmdldChcIk1hdGVyaWFsXCIpLCA8xpIuTWVzaD5Ob2RlQXJyb3cuaW50ZXJuYWxSZXNvdXJjZXMuZ2V0KFwiU2hhZnRcIikpO1xyXG4gICAgICBsZXQgaGVhZDogTm9kZSA9IG5ldyBOb2RlKF9uYW1lICsgXCJIZWFkXCIsIMaSLk1hdHJpeDR4NC5JREVOVElUWSgpLCA8xpIuTWF0ZXJpYWw+Tm9kZUFycm93LmludGVybmFsUmVzb3VyY2VzLmdldChcIk1hdGVyaWFsXCIpLCA8xpIuTWVzaD5Ob2RlQXJyb3cuaW50ZXJuYWxSZXNvdXJjZXMuZ2V0KFwiSGVhZFwiKSk7XHJcbiAgICAgIHNoYWZ0Lm10eExvY2FsLnNjYWxlKG5ldyDGki5WZWN0b3IzKDAuMDEsIDAuMDEsIDEpKTtcclxuICAgICAgaGVhZC5tdHhMb2NhbC50cmFuc2xhdGVaKDAuNSk7XHJcbiAgICAgIGhlYWQubXR4TG9jYWwuc2NhbGUobmV3IMaSLlZlY3RvcjMoMC4wNSwgMC4wNSwgMC4xKSk7XHJcbiAgICAgIGhlYWQubXR4TG9jYWwucm90YXRlWCg5MCk7XHJcblxyXG4gICAgICBzaGFmdC5nZXRDb21wb25lbnQoxpIuQ29tcG9uZW50TWF0ZXJpYWwpLmNsclByaW1hcnkgPSBfY29sb3I7XHJcbiAgICAgIGhlYWQuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudE1hdGVyaWFsKS5jbHJQcmltYXJ5ID0gX2NvbG9yO1xyXG5cclxuICAgICAgdGhpcy5hZGRDaGlsZChzaGFmdCk7XHJcbiAgICAgIHRoaXMuYWRkQ2hpbGQoaGVhZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlSW50ZXJuYWxSZXNvdXJjZXMoKTogTWFwPHN0cmluZywgxpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+IHtcclxuICAgICAgbGV0IG1hcDogTWFwPHN0cmluZywgxpIuU2VyaWFsaXphYmxlUmVzb3VyY2U+ID0gbmV3IE1hcCgpO1xyXG4gICAgICBtYXAuc2V0KFwiU2hhZnRcIiwgbmV3IMaSLk1lc2hDdWJlKFwiQXJyb3dTaGFmdFwiKSk7XHJcbiAgICAgIG1hcC5zZXQoXCJIZWFkXCIsIG5ldyDGki5NZXNoUHlyYW1pZChcIkFycm93SGVhZFwiKSk7XHJcbiAgICAgIGxldCBjb2F0OiDGki5Db2F0Q29sb3JlZCA9IG5ldyDGki5Db2F0Q29sb3JlZCjGki5Db2xvci5DU1MoXCJ3aGl0ZVwiKSk7XHJcbiAgICAgIG1hcC5zZXQoXCJNYXRlcmlhbFwiLCBuZXcgxpIuTWF0ZXJpYWwoXCJBcnJvd1wiLCDGki5TaGFkZXJMaXQsIGNvYXQpKTtcclxuXHJcbiAgICAgIG1hcC5mb3JFYWNoKChfcmVzb3VyY2UpID0+IMaSLlByb2plY3QuZGVyZWdpc3RlcihfcmVzb3VyY2UpKTtcclxuICAgICAgcmV0dXJuIG1hcDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGNvbG9yKF9jb2xvcjogxpIuQ29sb3IpIHtcclxuICAgICAgZm9yIChsZXQgY2hpbGQgb2YgdGhpcy5nZXRDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgY2hpbGQuZ2V0Q29tcG9uZW50KMaSLkNvbXBvbmVudE1hdGVyaWFsKS5jbHJQcmltYXJ5LmNvcHkoX2NvbG9yKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICBleHBvcnQgY2xhc3MgTm9kZUNvb3JkaW5hdGVTeXN0ZW0gZXh0ZW5kcyBOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcgPSBcIkNvb3JkaW5hdGVTeXN0ZW1cIiwgX3RyYW5zZm9ybT86IMaSLk1hdHJpeDR4NCkge1xyXG4gICAgICBzdXBlcihfbmFtZSwgX3RyYW5zZm9ybSk7XHJcbiAgICAgIGxldCBhcnJvd1JlZDogxpIuTm9kZSA9IG5ldyBOb2RlQXJyb3coXCJBcnJvd1JlZFwiLCBuZXcgxpIuQ29sb3IoMSwgMCwgMCwgMSkpO1xyXG4gICAgICBsZXQgYXJyb3dHcmVlbjogxpIuTm9kZSA9IG5ldyBOb2RlQXJyb3coXCJBcnJvd0dyZWVuXCIsIG5ldyDGki5Db2xvcigwLCAxLCAwLCAxKSk7XHJcbiAgICAgIGxldCBhcnJvd0JsdWU6IMaSLk5vZGUgPSBuZXcgTm9kZUFycm93KFwiQXJyb3dCbHVlXCIsIG5ldyDGki5Db2xvcigwLCAwLCAxLCAxKSk7XHJcblxyXG4gICAgICBhcnJvd1JlZC5tdHhMb2NhbC5yb3RhdGVZKDkwKTtcclxuICAgICAgYXJyb3dHcmVlbi5tdHhMb2NhbC5yb3RhdGVYKC05MCk7XHJcblxyXG4gICAgICB0aGlzLmFkZENoaWxkKGFycm93UmVkKTtcclxuICAgICAgdGhpcy5hZGRDaGlsZChhcnJvd0dyZWVuKTtcclxuICAgICAgdGhpcy5hZGRDaGlsZChhcnJvd0JsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG5cclxuICAvKipcclxuICAgKiBBZGRzIGEgbGlnaHQgc2V0dXAgdG8gdGhlIG5vZGUgZ2l2ZW4sIGNvbnNpc3Rpbmcgb2YgYW4gYW1iaWVudCBsaWdodCwgYSBkaXJlY3Rpb25hbCBrZXkgbGlnaHQgYW5kIGEgZGlyZWN0aW9uYWwgYmFjayBsaWdodC5cclxuICAgKiBFeGVwdCBvZiB0aGUgbm9kZSB0byBiZWNvbWUgdGhlIGNvbnRhaW5lciwgYWxsIHBhcmFtZXRlcnMgYXJlIG9wdGlvbmFsIGFuZCBwcm92aWRlZCBkZWZhdWx0IHZhbHVlcyBmb3IgZ2VuZXJhbCBwdXJwb3NlLiBcclxuICAgKi9cclxuICBleHBvcnQgZnVuY3Rpb24gYWRkU3RhbmRhcmRMaWdodENvbXBvbmVudHMoXHJcbiAgICBfbm9kZTogxpIuTm9kZSxcclxuICAgIF9jbHJBbWJpZW50OiDGki5Db2xvciA9IG5ldyDGki5Db2xvcigwLjIsIDAuMiwgMC4yKSwgX2NscktleTogxpIuQ29sb3IgPSBuZXcgxpIuQ29sb3IoMC45LCAwLjksIDAuOSksIF9jbHJCYWNrOiDGki5Db2xvciA9IG5ldyDGki5Db2xvcigwLjYsIDAuNiwgMC42KSxcclxuICAgIF9wb3NLZXk6IMaSLlZlY3RvcjMgPSBuZXcgxpIuVmVjdG9yMyg0LCAxMiwgOCksIF9wb3NCYWNrOiDGki5WZWN0b3IzID0gbmV3IMaSLlZlY3RvcjMoLTEsIC0wLjUsIC0zKVxyXG4gICk6IHZvaWQge1xyXG4gICAgbGV0IGtleTogxpIuQ29tcG9uZW50TGlnaHQgPSBuZXcgxpIuQ29tcG9uZW50TGlnaHQobmV3IMaSLkxpZ2h0RGlyZWN0aW9uYWwoX2NscktleSkpO1xyXG4gICAga2V5Lm10eFBpdm90LnRyYW5zbGF0ZShfcG9zS2V5KTtcclxuICAgIGtleS5tdHhQaXZvdC5sb29rQXQoxpIuVmVjdG9yMy5aRVJPKCkpO1xyXG5cclxuICAgIGxldCBiYWNrOiDGki5Db21wb25lbnRMaWdodCA9IG5ldyDGki5Db21wb25lbnRMaWdodChuZXcgxpIuTGlnaHREaXJlY3Rpb25hbChfY2xyQmFjaykpO1xyXG4gICAgYmFjay5tdHhQaXZvdC50cmFuc2xhdGUoX3Bvc0JhY2spO1xyXG4gICAgYmFjay5tdHhQaXZvdC5sb29rQXQoxpIuVmVjdG9yMy5aRVJPKCkpO1xyXG5cclxuICAgIGxldCBhbWJpZW50OiDGki5Db21wb25lbnRMaWdodCA9IG5ldyDGki5Db21wb25lbnRMaWdodChuZXcgxpIuTGlnaHRBbWJpZW50KF9jbHJBbWJpZW50KSk7XHJcblxyXG4gICAgX25vZGUuYWRkQ29tcG9uZW50KGtleSk7XHJcbiAgICBfbm9kZS5hZGRDb21wb25lbnQoYmFjayk7XHJcbiAgICBfbm9kZS5hZGRDb21wb25lbnQoYW1iaWVudCk7XHJcbiAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXMgdGhlIGFuaW1hdGlvbiBjeWNsZSBvZiBhIHNwcml0ZSBvbiBhIFtbTm9kZV1dXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIE5vZGVTcHJpdGUgZXh0ZW5kcyDGki5Ob2RlIHtcclxuICAgIHByaXZhdGUgc3RhdGljIG1lc2g6IMaSLk1lc2hTcHJpdGUgPSBOb2RlU3ByaXRlLmNyZWF0ZUludGVybmFsUmVzb3VyY2UoKTtcclxuICAgIHB1YmxpYyBmcmFtZXJhdGU6IG51bWJlciA9IDEyOyAvLyBhbmltYXRpb24gZnJhbWVzIHBlciBzZWNvbmQsIHNpbmdsZSBmcmFtZXMgY2FuIGJlIHNob3J0ZXIgb3IgbG9uZ2VyIGJhc2VkIG9uIHRoZWlyIHRpbWVzY2FsZVxyXG5cclxuICAgIHByaXZhdGUgY21wTWVzaDogxpIuQ29tcG9uZW50TWVzaDtcclxuICAgIHByaXZhdGUgY21wTWF0ZXJpYWw6IMaSLkNvbXBvbmVudE1hdGVyaWFsO1xyXG4gICAgcHJpdmF0ZSBhbmltYXRpb246IFNwcml0ZVNoZWV0QW5pbWF0aW9uO1xyXG4gICAgcHJpdmF0ZSBmcmFtZUN1cnJlbnQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGRpcmVjdGlvbjogbnVtYmVyID0gMTtcclxuICAgIHByaXZhdGUgdGltZXI6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoX25hbWU6IHN0cmluZykge1xyXG4gICAgICBzdXBlcihfbmFtZSk7XHJcblxyXG4gICAgICB0aGlzLmNtcE1lc2ggPSBuZXcgxpIuQ29tcG9uZW50TWVzaChOb2RlU3ByaXRlLm1lc2gpO1xyXG4gICAgICAvLyBEZWZpbmUgY29hdCBmcm9tIHRoZSBTcHJpdGVTaGVldCB0byB1c2Ugd2hlbiByZW5kZXJpbmdcclxuICAgICAgdGhpcy5jbXBNYXRlcmlhbCA9IG5ldyDGki5Db21wb25lbnRNYXRlcmlhbChuZXcgxpIuTWF0ZXJpYWwoX25hbWUsIMaSLlNoYWRlckxpdFRleHR1cmVkLCBudWxsKSk7XHJcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KHRoaXMuY21wTWVzaCk7XHJcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KHRoaXMuY21wTWF0ZXJpYWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGNyZWF0ZUludGVybmFsUmVzb3VyY2UoKTogxpIuTWVzaFNwcml0ZSB7XHJcbiAgICAgIGxldCBtZXNoOiDGki5NZXNoU3ByaXRlID0gbmV3IMaSLk1lc2hTcHJpdGUoXCJTcHJpdGVcIik7XHJcbiAgICAgIMaSLlByb2plY3QuZGVyZWdpc3RlcihtZXNoKTtcclxuICAgICAgcmV0dXJuIG1lc2g7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyB0aGUgbnVtYmVyIG9mIHRoZSBjdXJyZW50IGZyYW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgZ2V0Q3VycmVudEZyYW1lKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmZyYW1lQ3VycmVudDsgfSAvL1RvRG86IHNlZSBpZiBnZXRmcmFtZUN1cnJlbnQgaXMgcHJvYmxlbWF0aWNcclxuXHJcbiAgICBwdWJsaWMgc2V0QW5pbWF0aW9uKF9hbmltYXRpb246IFNwcml0ZVNoZWV0QW5pbWF0aW9uKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuYW5pbWF0aW9uID0gX2FuaW1hdGlvbjtcclxuICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKCk7XHJcbiAgICAgIHRoaXMuc2hvd0ZyYW1lKDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdG9wQW5pbWF0aW9uKCk6IHZvaWQge1xyXG4gICAgICBpZiAodGhpcy50aW1lcilcclxuICAgICAgICDGki5UaW1lLmdhbWUuZGVsZXRlVGltZXIodGhpcy50aW1lcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG93IGEgc3BlY2lmaWMgZnJhbWUgb2YgdGhlIHNlcXVlbmNlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93RnJhbWUoX2luZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKCk7XHJcbiAgICAgIGxldCBzcHJpdGVGcmFtZTogU3ByaXRlRnJhbWUgPSB0aGlzLmFuaW1hdGlvbi5mcmFtZXNbX2luZGV4XTtcclxuICAgICAgdGhpcy5jbXBNZXNoLm10eFBpdm90ID0gc3ByaXRlRnJhbWUubXR4UGl2b3Q7XHJcbiAgICAgIHRoaXMuY21wTWF0ZXJpYWwubXR4UGl2b3QgPSBzcHJpdGVGcmFtZS5tdHhUZXh0dXJlO1xyXG4gICAgICB0aGlzLmNtcE1hdGVyaWFsLm1hdGVyaWFsLmNvYXQgPSB0aGlzLmFuaW1hdGlvbi5zcHJpdGVzaGVldDtcclxuICAgICAgdGhpcy5mcmFtZUN1cnJlbnQgPSBfaW5kZXg7XHJcbiAgICAgIHRoaXMudGltZXIgPSDGki5UaW1lLmdhbWUuc2V0VGltZXIoc3ByaXRlRnJhbWUudGltZVNjYWxlICogMTAwMCAvIHRoaXMuZnJhbWVyYXRlLCAxLCB0aGlzLnNob3dGcmFtZU5leHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2hvdyB0aGUgbmV4dCBmcmFtZSBvZiB0aGUgc2VxdWVuY2Ugb3Igc3RhcnQgYW5ldyB3aGVuIHRoZSBlbmQgb3IgdGhlIHN0YXJ0IHdhcyByZWFjaGVkLCBhY2NvcmRpbmcgdG8gdGhlIGRpcmVjdGlvbiBvZiBwbGF5aW5nXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93RnJhbWVOZXh0ID0gKF9ldmVudDogxpIuRXZlbnRUaW1lcik6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmZyYW1lQ3VycmVudCA9ICh0aGlzLmZyYW1lQ3VycmVudCArIHRoaXMuZGlyZWN0aW9uICsgdGhpcy5hbmltYXRpb24uZnJhbWVzLmxlbmd0aCkgJSB0aGlzLmFuaW1hdGlvbi5mcmFtZXMubGVuZ3RoO1xyXG4gICAgICB0aGlzLnNob3dGcmFtZSh0aGlzLmZyYW1lQ3VycmVudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgZGlyZWN0aW9uIGZvciBhbmltYXRpb24gcGxheWJhY2ssIG5lZ2F0aXYgbnVtYmVycyBtYWtlIGl0IHBsYXkgYmFja3dhcmRzLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0RnJhbWVEaXJlY3Rpb24oX2RpcmVjdGlvbjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gTWF0aC5mbG9vcihfZGlyZWN0aW9uKTtcclxuICAgIH1cclxuICB9XHJcbn0iLCJuYW1lc3BhY2UgRnVkZ2VBaWQge1xyXG4gIGltcG9ydCDGkiA9IEZ1ZGdlQ29yZTtcclxuXHJcbiAgLyoqXHJcbiAgICogRGVzY3JpYmVzIGEgc2luZ2xlIGZyYW1lIG9mIGEgc3ByaXRlIGFuaW1hdGlvblxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBTcHJpdGVGcmFtZSB7XHJcbiAgICBwdWJsaWMgcmVjdFRleHR1cmU6IMaSLlJlY3RhbmdsZTtcclxuICAgIHB1YmxpYyBtdHhQaXZvdDogxpIuTWF0cml4NHg0O1xyXG4gICAgcHVibGljIG10eFRleHR1cmU6IMaSLk1hdHJpeDN4MztcclxuICAgIHB1YmxpYyB0aW1lU2NhbGU6IG51bWJlcjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnZlbmllbmNlIGZvciBjcmVhdGluZyBhIFtbQ29hdFRleHR1cmVdXSB0byB1c2UgYXMgc3ByaXRlc2hlZXRcclxuICAgKi9cclxuICBleHBvcnQgZnVuY3Rpb24gY3JlYXRlU3ByaXRlU2hlZXQoX25hbWU6IHN0cmluZywgX2ltYWdlOiBIVE1MSW1hZ2VFbGVtZW50KTogxpIuQ29hdFRleHR1cmVkIHtcclxuICAgIGxldCBjb2F0OiDGki5Db2F0VGV4dHVyZWQgPSBuZXcgxpIuQ29hdFRleHR1cmVkKCk7XHJcbiAgICBsZXQgdGV4dHVyZTogxpIuVGV4dHVyZUltYWdlID0gbmV3IMaSLlRleHR1cmVJbWFnZSgpO1xyXG4gICAgdGV4dHVyZS5pbWFnZSA9IF9pbWFnZTtcclxuICAgIGNvYXQudGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgICByZXR1cm4gY29hdDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhvbGRzIFNwcml0ZVNoZWV0QW5pbWF0aW9ucyBpbiBhbiBhc3NvY2lhdGl2ZSBoaWVyYXJjaGljYWwgYXJyYXlcclxuICAgKi9cclxuICBleHBvcnQgaW50ZXJmYWNlIFNwcml0ZVNoZWV0QW5pbWF0aW9ucyB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBTcHJpdGVTaGVldEFuaW1hdGlvbiB8IFNwcml0ZVNoZWV0QW5pbWF0aW9ucztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXMgYSBzZXJpZXMgb2YgW1tTcHJpdGVGcmFtZV1dcyB0byBiZSBtYXBwZWQgb250byBhIFtbTWVzaFNwcml0ZV1dXHJcbiAgICogQ29udGFpbnMgdGhlIFtbTWVzaFNwcml0ZV1dLCB0aGUgW1tNYXRlcmlhbF1dIGFuZCB0aGUgc3ByaXRlc2hlZXQtdGV4dHVyZVxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBTcHJpdGVTaGVldEFuaW1hdGlvbiB7XHJcbiAgICBwdWJsaWMgZnJhbWVzOiBTcHJpdGVGcmFtZVtdID0gW107XHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHNwcml0ZXNoZWV0OiDGki5Db2F0VGV4dHVyZWQ7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKF9uYW1lOiBzdHJpbmcsIF9zcHJpdGVzaGVldDogxpIuQ29hdFRleHR1cmVkKSB7XHJcbiAgICAgIHRoaXMubmFtZSA9IF9uYW1lO1xyXG4gICAgICB0aGlzLnNwcml0ZXNoZWV0ID0gX3Nwcml0ZXNoZWV0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3RvcmVzIGEgc2VyaWVzIG9mIGZyYW1lcyBpbiB0aGlzIFtbU3ByaXRlXV0sIGNhbGN1bGF0aW5nIHRoZSBtYXRyaWNlcyB0byB1c2UgaW4gdGhlIGNvbXBvbmVudHMgb2YgYSBbW05vZGVTcHJpdGVdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2VuZXJhdGUoX3JlY3RzOiDGki5SZWN0YW5nbGVbXSwgX3Jlc29sdXRpb25RdWFkOiBudW1iZXIsIF9vcmlnaW46IMaSLk9SSUdJTjJEKTogdm9pZCB7XHJcbiAgICAgIGxldCBpbWc6IFRleEltYWdlU291cmNlID0gdGhpcy5zcHJpdGVzaGVldC50ZXh0dXJlLnRleEltYWdlU291cmNlO1xyXG4gICAgICB0aGlzLmZyYW1lcyA9IFtdO1xyXG4gICAgICBsZXQgZnJhbWluZzogxpIuRnJhbWluZ1NjYWxlZCA9IG5ldyDGki5GcmFtaW5nU2NhbGVkKCk7XHJcbiAgICAgIGZyYW1pbmcuc2V0U2NhbGUoMSAvIGltZy53aWR0aCwgMSAvIGltZy5oZWlnaHQpO1xyXG5cclxuICAgICAgbGV0IGNvdW50OiBudW1iZXIgPSAwO1xyXG4gICAgICBmb3IgKGxldCByZWN0IG9mIF9yZWN0cykge1xyXG4gICAgICAgIGxldCBmcmFtZTogU3ByaXRlRnJhbWUgPSB0aGlzLmNyZWF0ZUZyYW1lKHRoaXMubmFtZSArIGAke2NvdW50fWAsIGZyYW1pbmcsIHJlY3QsIF9yZXNvbHV0aW9uUXVhZCwgX29yaWdpbik7XHJcbiAgICAgICAgZnJhbWUudGltZVNjYWxlID0gMTtcclxuICAgICAgICB0aGlzLmZyYW1lcy5wdXNoKGZyYW1lKTtcclxuXHJcbiAgICAgICAgY291bnQrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHNwcml0ZSBmcmFtZXMgdXNpbmcgYSBncmlkIG9uIHRoZSBzcHJpdGVzaGVldCBkZWZpbmVkIGJ5IGEgcmVjdGFuZ2xlIHRvIHN0YXJ0IHdpdGgsIHRoZSBudW1iZXIgb2YgZnJhbWVzLCBcclxuICAgICAqIHRoZSByZXNvbHV0aW9uIHdoaWNoIGRldGVybWluZXMgdGhlIHNpemUgb2YgdGhlIHNwcml0ZXMgbWVzaCBiYXNlZCBvbiB0aGUgbnVtYmVyIG9mIHBpeGVscyBvZiB0aGUgdGV4dHVyZSBmcmFtZSxcclxuICAgICAqIHRoZSBvZmZzZXQgZnJvbSBvbmUgY2VsbCBvZiB0aGUgZ3JpZCB0byB0aGUgbmV4dCBpbiB0aGUgc2VxdWVuY2UgYW5kLCBpbiBjYXNlIHRoZSBzZXF1ZW5jZSBzcGFucyBvdmVyIG1vcmUgdGhhbiBvbmUgcm93IG9yIGNvbHVtbixcclxuICAgICAqIHRoZSBvZmZzZXQgdG8gbW92ZSB0aGUgc3RhcnQgcmVjdGFuZ2xlIHdoZW4gdGhlIG1hcmdpbiBvZiB0aGUgdGV4dHVyZSBpcyByZWFjaGVkIGFuZCB3cmFwcGluZyBvY2N1cnMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZW5lcmF0ZUJ5R3JpZChfc3RhcnRSZWN0OiDGki5SZWN0YW5nbGUsIF9mcmFtZXM6IG51bWJlciwgX3Jlc29sdXRpb25RdWFkOiBudW1iZXIsIF9vcmlnaW46IMaSLk9SSUdJTjJELCBfb2Zmc2V0TmV4dDogxpIuVmVjdG9yMiwgX29mZnNldFdyYXA6IMaSLlZlY3RvcjIgPSDGki5WZWN0b3IyLlpFUk8oKSk6IHZvaWQge1xyXG4gICAgICBsZXQgaW1nOiBUZXhJbWFnZVNvdXJjZSA9IHRoaXMuc3ByaXRlc2hlZXQudGV4dHVyZS50ZXhJbWFnZVNvdXJjZTtcclxuICAgICAgbGV0IHJlY3RJbWFnZTogxpIuUmVjdGFuZ2xlID0gbmV3IMaSLlJlY3RhbmdsZSgwLCAwLCBpbWcud2lkdGgsIGltZy5oZWlnaHQpO1xyXG4gICAgICBsZXQgcmVjdDogxpIuUmVjdGFuZ2xlID0gX3N0YXJ0UmVjdC5jbG9uZTtcclxuICAgICAgbGV0IHJlY3RzOiDGki5SZWN0YW5nbGVbXSA9IFtdO1xyXG4gICAgICB3aGlsZSAoX2ZyYW1lcy0tKSB7XHJcbiAgICAgICAgcmVjdHMucHVzaChyZWN0LmNsb25lKTtcclxuICAgICAgICByZWN0LnBvc2l0aW9uLmFkZChfb2Zmc2V0TmV4dCk7XHJcblxyXG4gICAgICAgIGlmIChyZWN0SW1hZ2UuY292ZXJzKHJlY3QpKVxyXG4gICAgICAgICAgY29udGludWU7XHJcblxyXG4gICAgICAgIF9zdGFydFJlY3QucG9zaXRpb24uYWRkKF9vZmZzZXRXcmFwKTtcclxuICAgICAgICByZWN0ID0gX3N0YXJ0UmVjdC5jbG9uZTtcclxuICAgICAgICBpZiAoIXJlY3RJbWFnZS5jb3ZlcnMocmVjdCkpXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVjdHMuZm9yRWFjaCgoX3JlY3Q6IMaSLlJlY3RhbmdsZSkgPT4gxpIuRGVidWcubG9nKF9yZWN0LnRvU3RyaW5nKCkpKTtcclxuICAgICAgdGhpcy5nZW5lcmF0ZShyZWN0cywgX3Jlc29sdXRpb25RdWFkLCBfb3JpZ2luKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZUZyYW1lKF9uYW1lOiBzdHJpbmcsIF9mcmFtaW5nOiDGki5GcmFtaW5nU2NhbGVkLCBfcmVjdDogxpIuUmVjdGFuZ2xlLCBfcmVzb2x1dGlvblF1YWQ6IG51bWJlciwgX29yaWdpbjogxpIuT1JJR0lOMkQpOiBTcHJpdGVGcmFtZSB7XHJcbiAgICAgIGxldCBpbWc6IFRleEltYWdlU291cmNlID0gdGhpcy5zcHJpdGVzaGVldC50ZXh0dXJlLnRleEltYWdlU291cmNlO1xyXG4gICAgICBsZXQgcmVjdFRleHR1cmU6IMaSLlJlY3RhbmdsZSA9IG5ldyDGki5SZWN0YW5nbGUoMCwgMCwgaW1nLndpZHRoLCBpbWcuaGVpZ2h0KTtcclxuICAgICAgbGV0IGZyYW1lOiBTcHJpdGVGcmFtZSA9IG5ldyBTcHJpdGVGcmFtZSgpO1xyXG5cclxuICAgICAgZnJhbWUucmVjdFRleHR1cmUgPSBfZnJhbWluZy5nZXRSZWN0KF9yZWN0KTtcclxuICAgICAgZnJhbWUucmVjdFRleHR1cmUucG9zaXRpb24gPSBfZnJhbWluZy5nZXRQb2ludChfcmVjdC5wb3NpdGlvbiwgcmVjdFRleHR1cmUpO1xyXG5cclxuICAgICAgbGV0IHJlY3RRdWFkOiDGki5SZWN0YW5nbGUgPSBuZXcgxpIuUmVjdGFuZ2xlKDAsIDAsIF9yZWN0LndpZHRoIC8gX3Jlc29sdXRpb25RdWFkLCBfcmVjdC5oZWlnaHQgLyBfcmVzb2x1dGlvblF1YWQsIF9vcmlnaW4pO1xyXG4gICAgICBmcmFtZS5tdHhQaXZvdCA9IMaSLk1hdHJpeDR4NC5JREVOVElUWSgpO1xyXG4gICAgICBmcmFtZS5tdHhQaXZvdC50cmFuc2xhdGUobmV3IMaSLlZlY3RvcjMocmVjdFF1YWQucG9zaXRpb24ueCArIHJlY3RRdWFkLnNpemUueCAvIDIsIC1yZWN0UXVhZC5wb3NpdGlvbi55IC0gcmVjdFF1YWQuc2l6ZS55IC8gMiwgMCkpO1xyXG4gICAgICBmcmFtZS5tdHhQaXZvdC5zY2FsZVgocmVjdFF1YWQuc2l6ZS54KTtcclxuICAgICAgZnJhbWUubXR4UGl2b3Quc2NhbGVZKHJlY3RRdWFkLnNpemUueSk7XHJcbiAgICAgIC8vIMaSLkRlYnVnLmxvZyhyZWN0UXVhZC50b1N0cmluZygpKTtcclxuXHJcbiAgICAgIGZyYW1lLm10eFRleHR1cmUgPSDGki5NYXRyaXgzeDMuSURFTlRJVFkoKTtcclxuICAgICAgZnJhbWUubXR4VGV4dHVyZS50cmFuc2xhdGUoZnJhbWUucmVjdFRleHR1cmUucG9zaXRpb24pO1xyXG4gICAgICBmcmFtZS5tdHhUZXh0dXJlLnNjYWxlKGZyYW1lLnJlY3RUZXh0dXJlLnNpemUpO1xyXG5cclxuICAgICAgcmV0dXJuIGZyYW1lO1xyXG4gICAgfVxyXG4gIH1cclxufSIsIm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgaW1wb3J0IMaSID0gRnVkZ2VDb3JlO1xyXG4gIFxyXG4gIGV4cG9ydCBjbGFzcyBDb21wb25lbnRTdGF0ZU1hY2hpbmU8U3RhdGU+IGV4dGVuZHMgxpIuQ29tcG9uZW50U2NyaXB0IGltcGxlbWVudHMgU3RhdGVNYWNoaW5lPFN0YXRlPiB7XHJcbiAgICBwdWJsaWMgc3RhdGVDdXJyZW50OiBTdGF0ZTtcclxuICAgIHB1YmxpYyBzdGF0ZU5leHQ6IFN0YXRlO1xyXG4gICAgcHVibGljIGluc3RydWN0aW9uczogU3RhdGVNYWNoaW5lSW5zdHJ1Y3Rpb25zPFN0YXRlPjtcclxuXHJcbiAgICBwdWJsaWMgdHJhbnNpdChfbmV4dDogU3RhdGUpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbnN0cnVjdGlvbnMudHJhbnNpdCh0aGlzLnN0YXRlQ3VycmVudCwgX25leHQsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3QoKTogdm9pZCB7XHJcbiAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLmFjdCh0aGlzLnN0YXRlQ3VycmVudCwgdGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiLyoqXHJcbiAqIFN0YXRlIG1hY2hpbmUgb2ZmZXJzIGEgc3RydWN0dXJlIGFuZCBmdW5kYW1lbnRhbCBmdW5jdGlvbmFsaXR5IGZvciBzdGF0ZSBtYWNoaW5lc1xyXG4gKiA8U3RhdGU+IHNob3VsZCBiZSBhbiBlbnVtIGRlZmluaW5nIHRoZSB2YXJpb3VzIHN0YXRlcyBvZiB0aGUgbWFjaGluZVxyXG4gKi9cclxuXHJcbm5hbWVzcGFjZSBGdWRnZUFpZCB7XHJcbiAgLyoqIEZvcm1hdCBvZiBtZXRob2RzIHRvIGJlIHVzZWQgYXMgdHJhbnNpdGlvbnMgb3IgYWN0aW9ucyAqL1xyXG4gIHR5cGUgU3RhdGVNYWNoaW5lTWV0aG9kPFN0YXRlPiA9IChfbWFjaGluZTogU3RhdGVNYWNoaW5lPFN0YXRlPikgPT4gdm9pZDtcclxuICAvKiogVHlwZSBmb3IgbWFwcyBhc3NvY2lhdGluZyBhIHN0YXRlIHRvIGEgbWV0aG9kICovXHJcbiAgdHlwZSBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kPFN0YXRlPiA9IE1hcDxTdGF0ZSwgU3RhdGVNYWNoaW5lTWV0aG9kPFN0YXRlPj47XHJcbiAgLyoqIEludGVyZmFjZSBtYXBwaW5nIGEgc3RhdGUgdG8gb25lIGFjdGlvbiBtdWx0aXBsZSB0cmFuc2l0aW9ucyAqL1xyXG4gIGludGVyZmFjZSBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kczxTdGF0ZT4ge1xyXG4gICAgYWN0aW9uOiBTdGF0ZU1hY2hpbmVNZXRob2Q8U3RhdGU+O1xyXG4gICAgdHJhbnNpdGlvbnM6IFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2Q8U3RhdGU+O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29yZSBmdW5jdGlvbmFsaXR5IG9mIHRoZSBzdGF0ZSBtYWNoaW5lLCBob2xkaW5nIHNvbGVseSB0aGUgY3VycmVudCBzdGF0ZSBhbmQsIHdoaWxlIGluIHRyYW5zaXRpb24sIHRoZSBuZXh0IHN0YXRlLFxyXG4gICAqIHRoZSBpbnN0cnVjdGlvbnMgZm9yIHRoZSBtYWNoaW5lIGFuZCBjb21mb3J0IG1ldGhvZHMgdG8gdHJhbnNpdCBhbmQgYWN0LlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBTdGF0ZU1hY2hpbmU8U3RhdGU+IHtcclxuICAgIHB1YmxpYyBzdGF0ZUN1cnJlbnQ6IFN0YXRlO1xyXG4gICAgcHVibGljIHN0YXRlTmV4dDogU3RhdGU7XHJcbiAgICBwdWJsaWMgaW5zdHJ1Y3Rpb25zOiBTdGF0ZU1hY2hpbmVJbnN0cnVjdGlvbnM8U3RhdGU+O1xyXG5cclxuICAgIHB1YmxpYyB0cmFuc2l0KF9uZXh0OiBTdGF0ZSk6IHZvaWQge1xyXG4gICAgICB0aGlzLmluc3RydWN0aW9ucy50cmFuc2l0KHRoaXMuc3RhdGVDdXJyZW50LCBfbmV4dCwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdCgpOiB2b2lkIHtcclxuICAgICAgdGhpcy5pbnN0cnVjdGlvbnMuYWN0KHRoaXMuc3RhdGVDdXJyZW50LCB0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCBvZiBpbnN0cnVjdGlvbnMgZm9yIGEgc3RhdGUgbWFjaGluZS4gVGhlIHNldCBrZWVwcyBhbGwgbWV0aG9kcyBmb3IgZGVkaWNhdGVkIGFjdGlvbnMgZGVmaW5lZCBmb3IgdGhlIHN0YXRlc1xyXG4gICAqIGFuZCBhbGwgZGVkaWNhdGVkIG1ldGhvZHMgZGVmaW5lZCBmb3IgdHJhbnNpdGlvbnMgdG8gb3RoZXIgc3RhdGVzLCBhcyB3ZWxsIGFzIGRlZmF1bHQgbWV0aG9kcy5cclxuICAgKiBJbnN0cnVjdGlvbnMgZXhpc3QgaW5kZXBlbmRlbnRseSBmcm9tIFN0YXRlTWFjaGluZXMuIEEgc3RhdGVtYWNoaW5lIGluc3RhbmNlIGlzIHBhc3NlZCBhcyBwYXJhbWV0ZXIgdG8gdGhlIGluc3RydWN0aW9uIHNldC5cclxuICAgKiBNdWx0aXBsZSBzdGF0ZW1hY2hpbmUtaW5zdGFuY2VzIGNhbiB0aHVzIHVzZSB0aGUgc2FtZSBpbnN0cnVjdGlvbiBzZXQgYW5kIGRpZmZlcmVudCBpbnN0cnVjdGlvbiBzZXRzIGNvdWxkIG9wZXJhdGUgb24gdGhlIHNhbWUgc3RhdGVtYWNoaW5lLlxyXG4gICAqL1xyXG4gIGV4cG9ydCBjbGFzcyBTdGF0ZU1hY2hpbmVJbnN0cnVjdGlvbnM8U3RhdGU+IGV4dGVuZHMgTWFwPFN0YXRlLCBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kczxTdGF0ZT4+IHtcclxuICAgIC8qKiBEZWZpbmUgZGVkaWNhdGVkIHRyYW5zaXRpb24gbWV0aG9kIHRvIHRyYW5zaXQgZnJvbSBvbmUgc3RhdGUgdG8gYW5vdGhlciovXHJcbiAgICBwdWJsaWMgc2V0VHJhbnNpdGlvbihfY3VycmVudDogU3RhdGUsIF9uZXh0OiBTdGF0ZSwgX3RyYW5zaXRpb246IFN0YXRlTWFjaGluZU1ldGhvZDxTdGF0ZT4pOiB2b2lkIHtcclxuICAgICAgbGV0IGFjdGl2ZTogU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+ID0gdGhpcy5nZXRTdGF0ZU1ldGhvZHMoX2N1cnJlbnQpO1xyXG4gICAgICBhY3RpdmUudHJhbnNpdGlvbnMuc2V0KF9uZXh0LCBfdHJhbnNpdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIERlZmluZSBkZWRpY2F0ZWQgYWN0aW9uIG1ldGhvZCBmb3IgYSBzdGF0ZSAqL1xyXG4gICAgcHVibGljIHNldEFjdGlvbihfY3VycmVudDogU3RhdGUsIF9hY3Rpb246IFN0YXRlTWFjaGluZU1ldGhvZDxTdGF0ZT4pOiB2b2lkIHtcclxuICAgICAgbGV0IGFjdGl2ZTogU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+ID0gdGhpcy5nZXRTdGF0ZU1ldGhvZHMoX2N1cnJlbnQpO1xyXG4gICAgICBhY3RpdmUuYWN0aW9uID0gX2FjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKiogRGVmYXVsdCB0cmFuc2l0aW9uIG1ldGhvZCB0byBpbnZva2UgaWYgbm8gZGVkaWNhdGVkIHRyYW5zaXRpb24gZXhpc3RzLCBzaG91bGQgYmUgb3ZlcnJpZGVuIGluIHN1YmNsYXNzICovXHJcbiAgICBwdWJsaWMgdHJhbnNpdERlZmF1bHQoX21hY2hpbmU6IFN0YXRlTWFjaGluZTxTdGF0ZT4pOiB2b2lkIHtcclxuICAgICAgLy9cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqIERlZmF1bHQgYWN0aW9uIG1ldGhvZCB0byBpbnZva2UgaWYgbm8gZGVkaWNhdGVkIGFjdGlvbiBleGlzdHMsIHNob3VsZCBiZSBvdmVycmlkZW4gaW4gc3ViY2xhc3MgKi9cclxuICAgIHB1YmxpYyBhY3REZWZhdWx0KF9tYWNoaW5lOiBTdGF0ZU1hY2hpbmU8U3RhdGU+KTogdm9pZCB7XHJcbiAgICAgIC8vXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEludm9rZSBhIGRlZGljYXRlZCB0cmFuc2l0aW9uIG1ldGhvZCBpZiBmb3VuZCBmb3IgdGhlIGN1cnJlbnQgYW5kIHRoZSBuZXh0IHN0YXRlLCBvciB0aGUgZGVmYXVsdCBtZXRob2QgKi9cclxuICAgIHB1YmxpYyB0cmFuc2l0KF9jdXJyZW50OiBTdGF0ZSwgX25leHQ6IFN0YXRlLCBfbWFjaGluZTogU3RhdGVNYWNoaW5lPFN0YXRlPik6IHZvaWQge1xyXG4gICAgICBfbWFjaGluZS5zdGF0ZU5leHQgPSBfbmV4dDtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsZXQgYWN0aXZlOiBTdGF0ZU1hY2hpbmVNYXBTdGF0ZVRvTWV0aG9kczxTdGF0ZT4gPSB0aGlzLmdldChfY3VycmVudCk7XHJcbiAgICAgICAgbGV0IHRyYW5zaXRpb246IFN0YXRlTWFjaGluZU1ldGhvZDxTdGF0ZT4gPSBhY3RpdmUudHJhbnNpdGlvbnMuZ2V0KF9uZXh0KTtcclxuICAgICAgICB0cmFuc2l0aW9uKF9tYWNoaW5lKTtcclxuICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKF9lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICB0aGlzLnRyYW5zaXREZWZhdWx0KF9tYWNoaW5lKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBfbWFjaGluZS5zdGF0ZUN1cnJlbnQgPSBfbmV4dDtcclxuICAgICAgICBfbWFjaGluZS5zdGF0ZU5leHQgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogSW52b2tlIHRoZSBkZWRpY2F0ZWQgYWN0aW9uIG1ldGhvZCBpZiBmb3VuZCBmb3IgdGhlIGN1cnJlbnQgc3RhdGUsIG9yIHRoZSBkZWZhdWx0IG1ldGhvZCAqL1xyXG4gICAgcHVibGljIGFjdChfY3VycmVudDogU3RhdGUsIF9tYWNoaW5lOiBTdGF0ZU1hY2hpbmU8U3RhdGU+KTogdm9pZCB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbGV0IGFjdGl2ZTogU3RhdGVNYWNoaW5lTWFwU3RhdGVUb01ldGhvZHM8U3RhdGU+ID0gdGhpcy5nZXQoX2N1cnJlbnQpO1xyXG4gICAgICAgIGFjdGl2ZS5hY3Rpb24oX21hY2hpbmUpO1xyXG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmluZm8oX2Vycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMuYWN0RGVmYXVsdChfbWFjaGluZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiogRmluZCB0aGUgaW5zdHJ1Y3Rpb25zIGRlZGljYXRlZCBmb3IgdGhlIGN1cnJlbnQgc3RhdGUgb3IgY3JlYXRlIGFuIGVtcHR5IHNldCBmb3IgaXQgKi9cclxuICAgIHByaXZhdGUgZ2V0U3RhdGVNZXRob2RzKF9jdXJyZW50OiBTdGF0ZSk6IFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPiB7XHJcbiAgICAgIGxldCBhY3RpdmU6IFN0YXRlTWFjaGluZU1hcFN0YXRlVG9NZXRob2RzPFN0YXRlPiA9IHRoaXMuZ2V0KF9jdXJyZW50KTtcclxuICAgICAgaWYgKCFhY3RpdmUpIHtcclxuICAgICAgICBhY3RpdmUgPSB7IGFjdGlvbjogbnVsbCwgdHJhbnNpdGlvbnM6IG5ldyBNYXAoKSB9O1xyXG4gICAgICAgIHRoaXMuc2V0KF9jdXJyZW50LCBhY3RpdmUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBhY3RpdmU7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEFsbG93cyB0byB0cmFuc2xhdGUsIHJvdGF0ZSBhbmQgc2NhbGUgbWF0cmljZXMgdmlzdWFsbHkgYnkgZHJhZ2dpbmcgd2l0aCBhIHBvaW50ZXIuIFxyXG4gICAqIEluc3RhbGxzIHBvaW50ZXIgZXZlbnQgbGlzdGVuZXJzIG9uIHRoZSBnaXZlbiB7QGxpbmsgxpIuVmlld3BvcnR9cyBjYW52YXMgb24gY29uc3RydWN0aW9uLiBcclxuICAgKiBVc2Uge0BsaW5rIGFkZExpc3RlbmVyc30ve0BsaW5rIHJlbW92ZUxpc3RlbmVyc30gdG8gaGFuZGxlIHRoZSBpbnN0YWxsYXRpb24gbWFudWFsbHkuXHJcbiAgICovXHJcbiAgZXhwb3J0IGNsYXNzIFRyYW5zZm9ybWF0b3Ige1xyXG4gICAgcHVibGljIHJlYWRvbmx5IHZpZXdwb3J0OiDGki5WaWV3cG9ydDtcclxuXHJcbiAgICBwdWJsaWMgbW9kZTogXCJ0cmFuc2xhdGVcIiB8IFwicm90YXRlXCIgfCBcInNjYWxlXCIgPSBcInRyYW5zbGF0ZVwiO1xyXG4gICAgcHVibGljIHNwYWNlOiBcImxvY2FsXCIgfCBcIndvcmxkXCIgPSBcIndvcmxkXCI7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWQ6IFwieFwiIHwgXCJ5XCIgfCBcInpcIjtcclxuXHJcbiAgICAjbXR4TG9jYWw6IMaSLk1hdHJpeDR4NDsgLy8gbG9jYWwgbWF0cml4IG9mIHRoZSBvYmplY3QgdG8gYmUgdHJhbnNmb3JtZWRcclxuICAgICNtdHhXb3JsZDogxpIuTWF0cml4NHg0OyAvLyB3b3JsZCBtYXRyaXggb2YgdGhlIG9iamVjdCB0byBiZSB0cmFuc2Zvcm1lZFxyXG5cclxuICAgICNtdHhMb2NhbEJhc2U6IMaSLk1hdHJpeDR4NCA9IMaSLk1hdHJpeDR4NC5JREVOVElUWSgpOyAvLyBsb2NhbCBtYXRyaXggaW4gYSBzdGF0ZSBiZWZvcmUgYSB0cmFuc2Zvcm1hdGlvbiBzdGFydHNcclxuICAgICNtdHhXb3JsZEJhc2U6IMaSLk1hdHJpeDR4NCA9IMaSLk1hdHJpeDR4NC5JREVOVElUWSgpOyAvLyB3b3JsZCBtYXRyaXggaW4gYSBzdGF0ZSBiZWZvcmUgYSB0cmFuc2Zvcm1hdGlvbiBzdGFydHNcclxuXHJcbiAgICAjb2Zmc2V0OiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5aRVJPKCk7IC8vIG9mZmVzdCB2ZWN0b3IgcG9pbnRpbmcgZnJvbSB0aGUgd29ybGQgcG9zaXRpb24gb2YgdGhlIG9iamVjdCB0byB3aGVyZSB0aGUgbW91c2UgcmF5IGNvbGxpZGVkIHdpdGggdGhlIHBsYW5lIG9uIHBvaW50ZXIgZG93blxyXG4gICAgI2RpcmVjdGlvbjogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuWkVSTygpOyAvLyBkcmllY3Rpb24gdmVjdG9yIHBvaW50aW5nIGZyb20gdGhlIHdvcmxkIHBvc2l0aW9uIG9mIHRoZSBvYmplY3QgdG8gd2hlcmUgdGhlIG1vdXNlIHJheSBjb2xsaWRlcyB3aXRoIHRoZSBwbGFuZSAocG9pbnRlciBtb3ZlKVxyXG4gICAgI3NjYWxlRmFjdG9yOiBudW1iZXI7IC8vIGN1cnJlbnQgc2NhbGUgZmFjdG9yIG9mIHRoZSBzY2FsaW5nIHRyYW5zZm9ybWF0aW9uXHJcblxyXG4gICAgI2lzVHJhbnNmb3JtaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgI2F4ZXMgPSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgeDogKCkgPT4gdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlgoKSA6IHRoaXMuI210eFdvcmxkQmFzZS5yaWdodCxcclxuICAgICAgeTogKCkgPT4gdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlkoKSA6IHRoaXMuI210eFdvcmxkQmFzZS51cCxcclxuICAgICAgejogKCkgPT4gdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlooKSA6IHRoaXMuI210eFdvcmxkQmFzZS5mb3J3YXJkXHJcbiAgICB9O1xyXG5cclxuICAgICNub3JtYWxzID0geyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIHg6ICgpID0+IHRoaXMuc3BhY2UgPT0gXCJ3b3JsZFwiID8gxpIuVmVjdG9yMy5aKCkgOiB0aGlzLiNtdHhXb3JsZEJhc2UuZm9yd2FyZCxcclxuICAgICAgeTogKCkgPT4gdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlgoKSA6IHRoaXMuI210eFdvcmxkQmFzZS5yaWdodCxcclxuICAgICAgejogKCkgPT4gdGhpcy5zcGFjZSA9PSBcIndvcmxkXCIgPyDGki5WZWN0b3IzLlgoKSA6IHRoaXMuI210eFdvcmxkQmFzZS5yaWdodFxyXG4gICAgfTtcclxuXHJcbiAgICAjbm9ybWFsOiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5aRVJPKCk7XHJcblxyXG4gICAgI2NvbG9ycyA9IHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICB4OiDGki5Db2xvci5DU1MoXCJyZWRcIiksXHJcbiAgICAgIHk6IMaSLkNvbG9yLkNTUyhcImxpbWVncmVlblwiKSxcclxuICAgICAgejogxpIuQ29sb3IuQ1NTKFwiYmx1ZVwiKSxcclxuICAgICAgb3JpZ2luOiDGki5Db2xvci5DU1MoXCJkaW1ncmF5XCIsIDAuNzUpXHJcbiAgICB9O1xyXG5cclxuICAgICNjb2xvcnNMaWdodCA9IHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICB4OiDGki5Db2xvci5DU1MoXCJzYWxtb25cIiksXHJcbiAgICAgIHk6IMaSLkNvbG9yLkNTUyhcImxpZ2h0Z3JlZW5cIiksXHJcbiAgICAgIHo6IMaSLkNvbG9yLkNTUyhcImNvcm5mbG93ZXJibHVlXCIpXHJcbiAgICB9O1xyXG5cclxuICAgICN0b3J1czogxpIuTWVzaFRvcnVzO1xyXG4gICAgI3RvcnVzUGljazogxpIuTWVzaFRvcnVzO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihfdmlld3BvcnQ6IMaSLlZpZXdwb3J0KSB7XHJcbiAgICAgIHRoaXMudmlld3BvcnQgPSBfdmlld3BvcnQ7XHJcbiAgICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XHJcbiAgICAgIHRoaXMuI3RvcnVzID0gbmV3IMaSLk1lc2hUb3J1cyhcIlRvcnVzXCIsIDAuNSAtIDAuMDAwNSwgMC4wMDUsIDYwLCA4KTtcclxuICAgICAgdGhpcy4jdG9ydXNQaWNrID0gbmV3IMaSLk1lc2hUb3J1cyhcIlRvcnVzUGlja1wiLCAwLjUgLSAwLjAwMywgMC4wMywgNjAsIDgpO1xyXG4gICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIodGhpcy4jdG9ydXMpO1xyXG4gICAgICDGki5Qcm9qZWN0LmRlcmVnaXN0ZXIodGhpcy4jdG9ydXNQaWNrKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IG10eExvY2FsKF9tdHg6IMaSLk1hdHJpeDR4NCkge1xyXG4gICAgICB0aGlzLiNtdHhMb2NhbCA9IF9tdHg7XHJcbiAgICAgIGlmICh0aGlzLiNtdHhMb2NhbClcclxuICAgICAgICB0aGlzLiNtdHhMb2NhbEJhc2UuY29weShfbXR4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IG10eFdvcmxkKF9tdHg6IMaSLk1hdHJpeDR4NCkge1xyXG4gICAgICB0aGlzLiNtdHhXb3JsZCA9IF9tdHg7XHJcbiAgICAgIGlmICh0aGlzLiNtdHhXb3JsZClcclxuICAgICAgICB0aGlzLiNtdHhXb3JsZEJhc2UuY29weShfbXR4KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBjYW1lcmEoKTogxpIuQ29tcG9uZW50Q2FtZXJhIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld3BvcnQuY2FtZXJhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRMaXN0ZW5lcnMgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLmhuZFBvaW50ZXJEb3duKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMuaG5kUG9pbnRlck1vdmUpO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJsZWF2ZVwiLCB0aGlzLmhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5hZGRFdmVudExpc3RlbmVyKMaSLkVWRU5ULlJFTkRFUl9FTkQsIHRoaXMuaG5kUmVuZGVyRW5kKTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHJlbW92ZUxpc3RlbmVycyA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMuaG5kUG9pbnRlckRvd24pO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5obmRQb2ludGVyTW92ZSk7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcmxlYXZlXCIsIHRoaXMuaG5kUG9pbnRlclVwKTtcclxuICAgICAgdGhpcy52aWV3cG9ydC5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgdGhpcy5obmRQb2ludGVyVXApO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LnJlbW92ZUV2ZW50TGlzdGVuZXIoxpIuRVZFTlQuUkVOREVSX0VORCwgdGhpcy5obmRSZW5kZXJFbmQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZHJhd0dpem1vcyhfY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEpOiB2b2lkIHtcclxuICAgICAgaWYgKCF0aGlzLiNtdHhMb2NhbCB8fCAhdGhpcy4jbXR4V29ybGQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgY29uc3QgaXNQaWNraW5nOiBib29sZWFuID0gX2NtcENhbWVyYSAhPSB0aGlzLmNhbWVyYTsgLy8gaWYgdGhlIGNhbWVyYSBpcyBub3QgdGhlIHZpZXdwb3J0cywgaXQgbXVzdCBiZSB0aGUgcGlja2luZyBjYW1lcmFcclxuXHJcbiAgICAgIGxldCBzY2FsZTogbnVtYmVyID0gX2NtcENhbWVyYS5nZXRXb3JsZFRvUGl4ZWxTY2FsZSh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbik7XHJcbiAgICAgIGxldCB3aWR0aEFycm93OiBudW1iZXIgPSBzY2FsZSAqIChpc1BpY2tpbmcgPyAxMCA6IDEpOyAvLyAxMCBvciAxIHBpeGVsIHdpZGU7XHJcbiAgICAgIGxldCBsZW5ndGhBcnJvdzogbnVtYmVyO1xyXG4gICAgICBsZXQgc2l6ZUhlYWQ6IG51bWJlcjtcclxuXHJcbiAgICAgIGlmICh0aGlzLiNpc1RyYW5zZm9ybWluZykge1xyXG4gICAgICAgIGNvbnN0IG10eDogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LkNPTVBPU0lUSU9OKHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uKTtcclxuICAgICAgICBjb25zdCBsaW5lOiDGki5WZWN0b3IzW10gPSBbXSA9IFvGki5WZWN0b3IzLlooLTEwMDApLCDGki5WZWN0b3IzLlooMTAwMCldO1xyXG5cclxuICAgICAgICDGki5HaXptb3MuZHJhd0xpbmVzKGxpbmUsIG10eC5sb29rSW4odGhpcy4jYXhlc1t0aGlzLnNlbGVjdGVkXSgpLCB0aGlzLiNub3JtYWxzW3RoaXMuc2VsZWN0ZWRdKCkpLCB0aGlzLiNjb2xvcnNMaWdodFt0aGlzLnNlbGVjdGVkXSwgMSk7XHJcbiAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZShtdHgsIGxpbmVbMF0sIGxpbmVbMV0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgY2xyWDogxpIuQ29sb3IgPSB0aGlzLnNlbGVjdGVkID09IFwieFwiICYmICF0aGlzLiNpc1RyYW5zZm9ybWluZyA/IHRoaXMuI2NvbG9yc0xpZ2h0W3RoaXMuc2VsZWN0ZWRdIDogdGhpcy4jY29sb3JzLng7XHJcbiAgICAgIGxldCBjbHJZOiDGki5Db2xvciA9IHRoaXMuc2VsZWN0ZWQgPT0gXCJ5XCIgJiYgIXRoaXMuI2lzVHJhbnNmb3JtaW5nID8gdGhpcy4jY29sb3JzTGlnaHRbdGhpcy5zZWxlY3RlZF0gOiB0aGlzLiNjb2xvcnMueTtcclxuICAgICAgbGV0IGNsclo6IMaSLkNvbG9yID0gdGhpcy5zZWxlY3RlZCA9PSBcInpcIiAmJiAhdGhpcy4jaXNUcmFuc2Zvcm1pbmcgPyB0aGlzLiNjb2xvcnNMaWdodFt0aGlzLnNlbGVjdGVkXSA6IHRoaXMuI2NvbG9ycy56O1xyXG4gICAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xyXG4gICAgICAgIGNhc2UgXCJ0cmFuc2xhdGVcIjpcclxuICAgICAgICAgIGxlbmd0aEFycm93ID0gc2NhbGUgKiAoaXNQaWNraW5nID8gOTAgOiA4MCk7IC8vIDgwIHBpeGVscyBsb25nXHJcbiAgICAgICAgICBzaXplSGVhZCA9IHNjYWxlICogMTI7IC8vIDEyIHBpeGVscyB3aWRlXHJcbiAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCBjbHJYLCB0aGlzLiNheGVzLngoKSwgdGhpcy4jbm9ybWFscy54KCksIGxlbmd0aEFycm93LCB3aWR0aEFycm93LCBzaXplSGVhZCwgxpIuTWVzaFB5cmFtaWQsIDEpO1xyXG4gICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgY2xyWSwgdGhpcy4jYXhlcy55KCksIHRoaXMuI25vcm1hbHMueSgpLCBsZW5ndGhBcnJvdywgd2lkdGhBcnJvdywgc2l6ZUhlYWQsIMaSLk1lc2hQeXJhbWlkLCAxKTtcclxuICAgICAgICAgIMaSLkdpem1vcy5kcmF3QXJyb3codGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24sIGNsclosIHRoaXMuI2F4ZXMueigpLCB0aGlzLiNub3JtYWxzLnooKSwgbGVuZ3RoQXJyb3csIHdpZHRoQXJyb3csIHNpemVIZWFkLCDGki5NZXNoUHlyYW1pZCwgMSk7XHJcbiAgICAgICAgICBpZiAodGhpcy4jaXNUcmFuc2Zvcm1pbmcpIHtcclxuICAgICAgICAgICAgbGV0IHNjYWxlT3JpZ2luOiBudW1iZXIgPSBfY21wQ2FtZXJhLmdldFdvcmxkVG9QaXhlbFNjYWxlKHRoaXMuI210eFdvcmxkQmFzZS50cmFuc2xhdGlvbik7XHJcbiAgICAgICAgICAgIMaSLkdpem1vcy5kcmF3QXJyb3codGhpcy4jbXR4V29ybGRCYXNlLnRyYW5zbGF0aW9uLCB0aGlzLiNjb2xvcnMub3JpZ2luLCB0aGlzLiNheGVzW3RoaXMuc2VsZWN0ZWRdKCksIHRoaXMuI25vcm1hbHNbdGhpcy5zZWxlY3RlZF0oKSwgc2NhbGVPcmlnaW4gKiA4MCwgc2NhbGVPcmlnaW4gKiAxLCBzY2FsZU9yaWdpbiAqIDEyLCDGki5NZXNoUHlyYW1pZCwgMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMubXR4V29ybGQudHJhbnNsYXRpb24sIMaSLkNvbG9yLkNTUyhcIm1hZ2VudGFcIiksIHRoaXMubm9ybWFsLCB0aGlzLmF4ZXNbdGhpcy5zZWxlY3RlZF0sIGxlbmd0aEFycm93LCB3aWR0aEFycm93LCBzaXplSGVhZCwgxpIuTWVzaFB5cmFtaWQsIDEpO1xyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJyb3RhdGVcIjpcclxuICAgICAgICAgIGxldCByYWRpdXM6IG51bWJlciA9IHNjYWxlICogODA7IC8vIDgwIHBpeGVscyByYWRpdXNcclxuICAgICAgICAgIHNpemVIZWFkID0gc2NhbGUgKiAxMjtcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy4jaXNUcmFuc2Zvcm1pbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Q2lyY2xlKHRoaXMuI3RvcnVzLCB0aGlzLiNjb2xvcnNbdGhpcy5zZWxlY3RlZF0sIHRoaXMuI2F4ZXNbdGhpcy5zZWxlY3RlZF0oKSwgdGhpcy4jbm9ybWFsc1t0aGlzLnNlbGVjdGVkXSgpLCByYWRpdXMsIDEpO1xyXG4gICAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCB0aGlzLiNjb2xvcnMub3JpZ2luLCB0aGlzLiNvZmZzZXQsIHRoaXMuI2F4ZXNbdGhpcy5zZWxlY3RlZF0oKSwgcmFkaXVzLCB3aWR0aEFycm93LCBzaXplSGVhZCwgxpIuTWVzaFB5cmFtaWQsIDEpO1xyXG4gICAgICAgICAgICAvLyDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMubXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMuY29sb3JzTGlnaHRbdGhpcy5zZWxlY3RlZF0sIHRoaXMubW92ZSwgdGhpcy5heGVzW3RoaXMuc2VsZWN0ZWRdLCB0aGlzLm1vdmUubWFnbml0dWRlLCB3aWR0aEFycm93LCBzaXplSGVhZCwgxpIuTWVzaFB5cmFtaWQsIDEpO1xyXG4gICAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCB0aGlzLiNjb2xvcnNbdGhpcy5zZWxlY3RlZF0sIHRoaXMuI2RpcmVjdGlvbiwgdGhpcy4jYXhlc1t0aGlzLnNlbGVjdGVkXSgpLCByYWRpdXMsIHdpZHRoQXJyb3csIHNpemVIZWFkLCDGki5NZXNoUHlyYW1pZCwgMSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIGRyYXcgYW4gaW52aXNpYmxlIHF1YWQgdG8gb2NjbHVkZSB0aGUgdG9yaVxyXG4gICAgICAgICAgY29uc3QgbXR4UXVhZDogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LkNPTVBPU0lUSU9OKHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uKTtcclxuICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbjogxpIuVmVjdG9yMyA9IF9jbXBDYW1lcmEubXR4V29ybGQuZm9yd2FyZC5uZWdhdGUoKTtcclxuICAgICAgICAgIG10eFF1YWQuc2NhbGluZyA9IMaSLlZlY3RvcjMuT05FKHJhZGl1cyAqIDIpO1xyXG4gICAgICAgICAgbXR4UXVhZC5sb29rSW4oZGlyZWN0aW9uKTtcclxuXHJcbiAgICAgICAgICDGki5SZW5kZXIuc2V0RGVwdGhGdW5jdGlvbijGki5ERVBUSF9GVU5DVElPTi5BTFdBWVMpO1xyXG4gICAgICAgICAgxpIuUmVuZGVyLnNldENvbG9yV3JpdGVNYXNrKGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgIMaSLkdpem1vcy5kcmF3UXVhZChtdHhRdWFkLCB0aGlzLiNjb2xvcnMub3JpZ2luKTsgLy8gY29sb3IgZG9lc24ndCBtYXR0ZXJcclxuICAgICAgICAgIMaSLlJlbmRlci5zZXRDb2xvcldyaXRlTWFzayh0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgIMaSLlJlbmRlci5zZXREZXB0aEZ1bmN0aW9uKMaSLkRFUFRIX0ZVTkNUSU9OLkxFU1MpO1xyXG5cclxuICAgICAgICAgIC8vIGRyYXcgdGhlIHRvcmlcclxuICAgICAgICAgIGxldCB0b3J1czogxpIuTWVzaFRvcnVzID0gaXNQaWNraW5nID8gdGhpcy4jdG9ydXNQaWNrIDogdGhpcy4jdG9ydXM7XHJcbiAgICAgICAgICB0aGlzLmRyYXdDaXJjbGUodG9ydXMsIGNsclgsIHRoaXMuI2F4ZXMueCgpLCB0aGlzLiNub3JtYWxzLngoKSwgcmFkaXVzLCAwKTtcclxuICAgICAgICAgIHRoaXMuZHJhd0NpcmNsZSh0b3J1cywgY2xyWSwgdGhpcy4jYXhlcy55KCksIHRoaXMuI25vcm1hbHMueSgpLCByYWRpdXMsIDApO1xyXG4gICAgICAgICAgdGhpcy5kcmF3Q2lyY2xlKHRvcnVzLCBjbHJaLCB0aGlzLiNheGVzLnooKSwgdGhpcy4jbm9ybWFscy56KCksIHJhZGl1cywgMCk7XHJcblxyXG4gICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZShtdHhRdWFkLCBkaXJlY3Rpb24pO1xyXG5cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgXCJzY2FsZVwiOlxyXG4gICAgICAgICAgbGVuZ3RoQXJyb3cgPSBzY2FsZSAqIChpc1BpY2tpbmcgPyA4NCA6IDc0KTtcclxuICAgICAgICAgIHNpemVIZWFkID0gc2NhbGUgKiA2O1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLiNpc1RyYW5zZm9ybWluZykge1xyXG4gICAgICAgICAgICAvLyDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMubXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMuY29sb3JzTGlnaHRbdGhpcy5zZWxlY3RlZF0sIHRoaXMuZGlyZWN0aW9uLCB0aGlzLm5vcm1hbHNbdGhpcy5zZWxlY3RlZF0sIHRoaXMuZGlyZWN0aW9uLm1hZ25pdHVkZSwgd2lkdGhBcnJvdywgc2l6ZUhlYWQsIMaSLk1lc2hDdWJlLCAxKTtcclxuICAgICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy4jY29sb3JzW3RoaXMuc2VsZWN0ZWRdLCB0aGlzLiNheGVzW3RoaXMuc2VsZWN0ZWRdKCksIHRoaXMuI25vcm1hbHNbdGhpcy5zZWxlY3RlZF0oKSwgbGVuZ3RoQXJyb3cgKiB0aGlzLiNzY2FsZUZhY3Rvciwgd2lkdGhBcnJvdywgc2l6ZUhlYWQsIMaSLk1lc2hDdWJlLCAxKTtcclxuICAgICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy4jY29sb3JzLm9yaWdpbiwgdGhpcy4jYXhlc1t0aGlzLnNlbGVjdGVkXSgpLCB0aGlzLiNub3JtYWxzW3RoaXMuc2VsZWN0ZWRdKCksIGxlbmd0aEFycm93LCB3aWR0aEFycm93LCBzaXplSGVhZCwgxpIuTWVzaEN1YmUsIDEpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICDGki5HaXptb3MuZHJhd0Fycm93KHRoaXMuI210eFdvcmxkLnRyYW5zbGF0aW9uLCBjbHJYLCB0aGlzLiNheGVzLngoKSwgdGhpcy4jbm9ybWFscy54KCksIGxlbmd0aEFycm93LCB3aWR0aEFycm93LCBzaXplSGVhZCwgxpIuTWVzaEN1YmUsIDEpO1xyXG4gICAgICAgICAgxpIuR2l6bW9zLmRyYXdBcnJvdyh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgY2xyWSwgdGhpcy4jYXhlcy55KCksIHRoaXMuI25vcm1hbHMueSgpLCBsZW5ndGhBcnJvdywgd2lkdGhBcnJvdywgc2l6ZUhlYWQsIMaSLk1lc2hDdWJlLCAxKTtcclxuICAgICAgICAgIMaSLkdpem1vcy5kcmF3QXJyb3codGhpcy4jbXR4V29ybGQudHJhbnNsYXRpb24sIGNsclosIHRoaXMuI2F4ZXMueigpLCB0aGlzLiNub3JtYWxzLnooKSwgbGVuZ3RoQXJyb3csIHdpZHRoQXJyb3csIHNpemVIZWFkLCDGki5NZXNoQ3ViZSwgMSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaG5kUG9pbnRlckRvd24gPSAoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmNhbWVyYSB8fCAhdGhpcy52aWV3cG9ydCB8fCAhdGhpcy5zZWxlY3RlZCB8fCAhdGhpcy4jbXR4TG9jYWwgfHwgIXRoaXMuI210eFdvcmxkKVxyXG4gICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgIHRoaXMuI210eExvY2FsQmFzZS5jb3B5KHRoaXMuI210eExvY2FsKTtcclxuICAgICAgdGhpcy4jbXR4V29ybGRCYXNlLmNvcHkodGhpcy4jbXR4V29ybGQpO1xyXG5cclxuICAgICAgY29uc3QgbXR4Tm9ybWFsOiDGki5NYXRyaXg0eDQgPSDGki5NYXRyaXg0eDQuTE9PS19BVCh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbiwgdGhpcy5jYW1lcmEubXR4V29ybGQudHJhbnNsYXRpb24sIHRoaXMuI2F4ZXNbdGhpcy5zZWxlY3RlZF0oKSwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuI25vcm1hbC5jb3B5KG10eE5vcm1hbC5mb3J3YXJkKTsgLy8gbm9ybWFsIG9mIHRoZSBwbGFuZSB0aGUgbW91c2UgcmF5IHdpbGwgY29sbGlkZSB3aXRoXHJcblxyXG4gICAgICBjb25zdCBwb2ludDogxpIuVmVjdG9yMyA9IHRoaXMuZ2V0UG9pbnQzRChfZXZlbnQpO1xyXG4gICAgICB0aGlzLiNvZmZzZXQuY29weShwb2ludC5zdWJ0cmFjdCh0aGlzLiNtdHhXb3JsZC50cmFuc2xhdGlvbikpO1xyXG5cclxuICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZShtdHhOb3JtYWwsIHBvaW50KTtcclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBobmRQb2ludGVyTW92ZSA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLiNpc1RyYW5zZm9ybWluZyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcclxuXHJcbiAgICAgIGlmIChfZXZlbnQuYnV0dG9ucyAhPSAxKSB7XHJcbiAgICAgICAgY29uc3QgcG9pbnQ6IMaSLlZlY3RvcjIgPSBuZXcgxpIuVmVjdG9yMihfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpO1xyXG4gICAgICAgIGNvbnN0IHBpY2s6IMaSLlBpY2sgPSDGki5QaWNrZXIucGlja0NhbWVyYShbdGhpc10sIHRoaXMuY2FtZXJhLCB0aGlzLnZpZXdwb3J0LnBvaW50Q2xpZW50VG9Qcm9qZWN0aW9uKHBvaW50KSlbMF07XHJcblxyXG4gICAgICAgIGlmIChwaWNrPy5jb2xvci5yID4gMC43KVxyXG4gICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IFwieFwiO1xyXG4gICAgICAgIGVsc2UgaWYgKHBpY2s/LmNvbG9yLmcgPiAwLjcpXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gXCJ5XCI7XHJcbiAgICAgICAgZWxzZSBpZiAocGljaz8uY29sb3IuYiA+IDAuNylcclxuICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBcInpcIjtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpXHJcbiAgICAgICAgICB0aGlzLnZpZXdwb3J0LmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcImdyYWJcIjtcclxuXHJcbiAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmUocG9pbnQpO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5jYW1lcmEgfHwgIXRoaXMudmlld3BvcnQgfHwgIXRoaXMuc2VsZWN0ZWQgfHwgIXRoaXMuI210eExvY2FsIHx8ICF0aGlzLiNtdHhXb3JsZClcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICB0aGlzLiNpc1RyYW5zZm9ybWluZyA9IHRydWU7XHJcbiAgICAgIHRoaXMudmlld3BvcnQuY2FudmFzLnN0eWxlLmN1cnNvciA9IFwiZ3JhYmJpbmdcIjtcclxuXHJcbiAgICAgIHRoaXMuI2RpcmVjdGlvbi5jb3B5KHRoaXMuZ2V0UG9pbnQzRChfZXZlbnQpLnN1YnRyYWN0KHRoaXMuI210eFdvcmxkQmFzZS50cmFuc2xhdGlvbikpO1xyXG4gICAgICB0aGlzLiNtdHhMb2NhbC5jb3B5KHRoaXMuI210eExvY2FsQmFzZSk7IC8vIHJlc2V0XHJcblxyXG4gICAgICBjb25zdCBheGlzOiDGki5WZWN0b3IzID0gdGhpcy4jYXhlc1t0aGlzLnNlbGVjdGVkXSgpO1xyXG5cclxuICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcclxuICAgICAgICBjYXNlIFwidHJhbnNsYXRlXCI6XHJcbiAgICAgICAgICBjb25zdCBtdHhXb3JsZEludnNlcnNlOiDGki5NYXRyaXg0eDQgPSB0aGlzLiNtdHhXb3JsZEJhc2UuY2xvbmUuaW52ZXJ0KCk7XHJcbiAgICAgICAgICBjb25zdCB0cmFuc2xhdGlvbjogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuUFJPSkVDVElPTih0aGlzLiNkaXJlY3Rpb24sIGF4aXMpO1xyXG4gICAgICAgICAgY29uc3QgdHJhbnNsYXRpb25PZmZzZXQ6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLlBST0pFQ1RJT04odGhpcy4jb2Zmc2V0LCBheGlzKTtcclxuICAgICAgICAgIHRyYW5zbGF0aW9uLnN1YnRyYWN0KHRyYW5zbGF0aW9uT2Zmc2V0KTtcclxuICAgICAgICAgIHRyYW5zbGF0aW9uLnRyYW5zZm9ybShtdHhXb3JsZEludnNlcnNlLCBmYWxzZSk7XHJcblxyXG4gICAgICAgICAgdGhpcy4jbXR4TG9jYWwudHJhbnNsYXRlKHRyYW5zbGF0aW9uKTtcclxuXHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZU11bHRpcGxlKG10eFdvcmxkSW52c2Vyc2UsIHRyYW5zbGF0aW9uLCB0cmFuc2xhdGlvbk9mZnNldCk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwicm90YXRlXCI6XHJcbiAgICAgICAgICBjb25zdCByb3RhdGlvbkludmVyc2U6IMaSLlF1YXRlcm5pb24gPSB0aGlzLiNtdHhXb3JsZEJhc2UucXVhdGVybmlvbi5jbG9uZS5pbnZlcnQoKTtcclxuXHJcbiAgICAgICAgICAvLyByb3RhdGUgdmVjdG9ycyBpbnRvIGxvY2FsIHNwYWNlXHJcbiAgICAgICAgICBjb25zdCBvZmZzZXRMb2NhbDogxpIuVmVjdG9yMyA9IHRoaXMuI29mZnNldC5jbG9uZS50cmFuc2Zvcm0ocm90YXRpb25JbnZlcnNlKTtcclxuICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbkxvY2FsOiDGki5WZWN0b3IzID0gdGhpcy4jZGlyZWN0aW9uLmNsb25lLnRyYW5zZm9ybShyb3RhdGlvbkludmVyc2UpO1xyXG4gICAgICAgICAgY29uc3QgYXhpc0xvY2FsOiDGki5WZWN0b3IzID0gYXhpcy50cmFuc2Zvcm0ocm90YXRpb25JbnZlcnNlKTtcclxuXHJcbiAgICAgICAgICBsZXQgYW5nbGU6IG51bWJlciA9IMaSLlZlY3RvcjMuQU5HTEUob2Zmc2V0TG9jYWwsIGRpcmVjdGlvbkxvY2FsKTtcclxuXHJcbiAgICAgICAgICAvLyBEZXRlcm1pbmUgdGhlIGRpcmVjdGlvbiBvZiByb3RhdGlvblxyXG4gICAgICAgICAgY29uc3QgY3Jvc3M6IMaSLlZlY3RvcjMgPSDGki5WZWN0b3IzLkNST1NTKG9mZnNldExvY2FsLCBkaXJlY3Rpb25Mb2NhbCk7XHJcbiAgICAgICAgICBpZiAoxpIuVmVjdG9yMy5ET1QoYXhpc0xvY2FsLCBjcm9zcykgPCAwKVxyXG4gICAgICAgICAgICBhbmdsZSA9IC1hbmdsZTtcclxuXHJcbiAgICAgICAgICBjb25zdCByb3RhdGlvbjogxpIuUXVhdGVybmlvbiA9IMaSLlF1YXRlcm5pb24uUk9UQVRJT04oYXhpc0xvY2FsLCBhbmdsZSk7XHJcblxyXG4gICAgICAgICAgdGhpcy4jbXR4TG9jYWwucm90YXRlKHJvdGF0aW9uKTtcclxuXHJcbiAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZU11bHRpcGxlKHJvdGF0aW9uSW52ZXJzZSwgb2Zmc2V0TG9jYWwsIGRpcmVjdGlvbkxvY2FsLCBheGlzTG9jYWwsIGNyb3NzLCByb3RhdGlvbik7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIFwic2NhbGVcIjpcclxuICAgICAgICAgIHRoaXMuI3NjYWxlRmFjdG9yID0gTWF0aC5zaWduKMaSLlZlY3RvcjMuRE9UKGF4aXMsIHRoaXMuI2RpcmVjdGlvbikpICogdGhpcy4jZGlyZWN0aW9uLm1hZ25pdHVkZSAvIHRoaXMuI29mZnNldC5tYWduaXR1ZGU7XHJcblxyXG4gICAgICAgICAgY29uc3QgdmN0U2NhbGluZzogxpIuVmVjdG9yMyA9IMaSLlZlY3RvcjMuT05FKCk7XHJcbiAgICAgICAgICB2Y3RTY2FsaW5nW3RoaXMuc2VsZWN0ZWRdID0gdGhpcy4jc2NhbGVGYWN0b3I7XHJcblxyXG4gICAgICAgICAgY29uc3QgbXR4U2NhbGluZzogxpIuTWF0cml4NHg0ID0gxpIuTWF0cml4NHg0LlNDQUxJTkcodmN0U2NhbGluZyk7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMuc3BhY2UgPT0gXCJ3b3JsZFwiKSB7IC8vIHJvdGF0aW9uSW52ZXJzZSAqIHNjYWxpbmcgKiByb3RhdGlvblxyXG4gICAgICAgICAgICBjb25zdCByb3RhdGlvbkludmVyc2U6IMaSLlF1YXRlcm5pb24gPSB0aGlzLiNtdHhXb3JsZEJhc2UucXVhdGVybmlvbi5jbG9uZS5pbnZlcnQoKTtcclxuICAgICAgICAgICAgbXR4U2NhbGluZy5yb3RhdGUocm90YXRpb25JbnZlcnNlLCB0cnVlKTtcclxuICAgICAgICAgICAgbXR4U2NhbGluZy5yb3RhdGUodGhpcy4jbXR4V29ybGRCYXNlLnF1YXRlcm5pb24pO1xyXG4gICAgICAgICAgICDGki5SZWN5Y2xlci5zdG9yZShyb3RhdGlvbkludmVyc2UpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuI210eExvY2FsLnNjYWxlKG10eFNjYWxpbmcuc2NhbGluZyk7XHJcblxyXG4gICAgICAgICAgxpIuUmVjeWNsZXIuc3RvcmVNdWx0aXBsZSh2Y3RTY2FsaW5nLCBtdHhTY2FsaW5nKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGhuZFBvaW50ZXJVcCA9IChfZXZlbnQ6IFBvaW50ZXJFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBpZiAodGhpcy4jbXR4TG9jYWwpXHJcbiAgICAgICAgdGhpcy4jbXR4TG9jYWxCYXNlLmNvcHkodGhpcy4jbXR4TG9jYWwpO1xyXG4gICAgICBpZiAodGhpcy4jbXR4V29ybGQpXHJcbiAgICAgICAgdGhpcy4jbXR4V29ybGRCYXNlLmNvcHkodGhpcy4jbXR4V29ybGQpO1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZClcclxuICAgICAgICB0aGlzLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgaWYgKHRoaXMuI2lzVHJhbnNmb3JtaW5nKVxyXG4gICAgICAgIHRoaXMuI2lzVHJhbnNmb3JtaW5nID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaG5kUmVuZGVyRW5kID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICB0aGlzLmRyYXdHaXptb3ModGhpcy52aWV3cG9ydC5jYW1lcmEpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGRyYXdDaXJjbGUoX3RvcnVzOiDGki5NZXNoVG9ydXMsIF9jb2xvcjogxpIuQ29sb3IsIF9kaXJlY3Rpb246IMaSLlZlY3RvcjMsIF91cDogxpIuVmVjdG9yMywgX3JhZGl1czogbnVtYmVyLCBfYWxwaGFPY2NsdWRlZDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgIGNvbnN0IG10eFdvcmxkOiDGki5NYXRyaXg0eDQgPSB0aGlzLiNtdHhXb3JsZC5jbG9uZTtcclxuICAgICAgY29uc3QgdmN0U2NhbGluZzogxpIuVmVjdG9yMyA9IMaSLlJlY3ljbGVyLnJldXNlKMaSLlZlY3RvcjMpLnNldChfcmFkaXVzICogMiwgX3JhZGl1cyAqIDIsIF9yYWRpdXMgKiAyKTtcclxuXHJcbiAgICAgIG10eFdvcmxkLnNjYWxpbmcgPSB2Y3RTY2FsaW5nO1xyXG4gICAgICBtdHhXb3JsZC5sb29rSW4oX2RpcmVjdGlvbiwgX3VwKTsgLy8gbG9va0luIG9yaWVudGF0ZXMgdGhlIHotYXhpcyBidXQgdGhlIHRvcnVzZSBsYXlzIG9uIHRoZSB4ei1wbGFuZSAoZmFjaW5nIGluIHktZGlyZWN0aW9uKSxcclxuICAgICAgbXR4V29ybGQucm90YXRlWCg5MCk7ICAgICAgICAgICAgIC8vIHRodXMgd2Ugcm90YXRlIHRoZSB0b3J1cyBzbyB0aGUgY2lyY2xlIGZhY2VzIGluIF9kaXJlY3Rpb25cclxuICAgICAgLy8gxpIuR2l6bW9zLmRyYXdNZXNoKHRoaXMudG9ydXNQaWNrLCBtdHhXb3JsZCwgxpIuQ29sb3IuQ1NTKFwibWFnZW50YVwiKSwgX2FscGhhT2NjbHVkZWQpO1xyXG4gICAgICDGki5HaXptb3MuZHJhd01lc2goX3RvcnVzLCBtdHhXb3JsZCwgX2NvbG9yLCBfYWxwaGFPY2NsdWRlZCk7XHJcblxyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZU11bHRpcGxlKG10eFdvcmxkLCB2Y3RTY2FsaW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFBvaW50M0QoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiDGki5WZWN0b3IzIHtcclxuICAgICAgY29uc3QgcG9pbnQyRDogxpIuVmVjdG9yMiA9IMaSLlJlY3ljbGVyLnJldXNlKMaSLlZlY3RvcjIpLnNldChfZXZlbnQub2Zmc2V0WCwgX2V2ZW50Lm9mZnNldFkpO1xyXG4gICAgICBjb25zdCByYXk6IMaSLlJheSA9IHRoaXMudmlld3BvcnQuZ2V0UmF5RnJvbUNsaWVudChwb2ludDJEKTtcclxuICAgICAgY29uc3Qgbm9ybWFsOiDGki5WZWN0b3IzID0gdGhpcy5tb2RlID09IFwicm90YXRlXCIgPyB0aGlzLiNheGVzW3RoaXMuc2VsZWN0ZWRdKCkgOiB0aGlzLiNub3JtYWw7XHJcblxyXG4gICAgICDGki5SZWN5Y2xlci5zdG9yZShwb2ludDJEKTtcclxuICAgICAgcmV0dXJuIHJheS5pbnRlcnNlY3RQbGFuZSh0aGlzLiNtdHhXb3JsZEJhc2UudHJhbnNsYXRpb24sIG5vcm1hbCk7XHJcbiAgICB9XHJcbiAgfVxyXG59IiwibmFtZXNwYWNlIEZ1ZGdlQWlkIHtcclxuICBpbXBvcnQgxpIgPSBGdWRnZUNvcmU7XHJcblxyXG4gIGV4cG9ydCBjbGFzcyBWaWV3cG9ydCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZShfYnJhbmNoOiDGki5Ob2RlKTogxpIuVmlld3BvcnQge1xyXG4gICAgICBsZXQgY21wQ2FtZXJhOiDGki5Db21wb25lbnRDYW1lcmEgPSBuZXcgxpIuQ29tcG9uZW50Q2FtZXJhKCk7XHJcbiAgICAgIGNtcENhbWVyYS5tdHhQaXZvdC50cmFuc2xhdGUoxpIuVmVjdG9yMy5aKDQpKTtcclxuICAgICAgY21wQ2FtZXJhLm10eFBpdm90LnJvdGF0ZVkoMTgwKTtcclxuXHJcbiAgICAgIGxldCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50ID0gQ2FudmFzLmNyZWF0ZSgpO1xyXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XHJcblxyXG4gICAgICBsZXQgdmlld3BvcnQ6IMaSLlZpZXdwb3J0ID0gbmV3IMaSLlZpZXdwb3J0KCk7XHJcbiAgICAgIHZpZXdwb3J0LmluaXRpYWxpemUoXCLGkkFpZC1WaWV3cG9ydFwiLCBfYnJhbmNoLCBjbXBDYW1lcmEsIGNhbnZhcyk7XHJcbiAgICAgIHJldHVybiB2aWV3cG9ydDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGV4cGFuZENhbWVyYVRvSW50ZXJhY3RpdmVPcmJpdChfdmlld3BvcnQ6IMaSLlZpZXdwb3J0LCBfc2hvd0ZvY3VzOiBib29sZWFuID0gdHJ1ZSwgX3NwZWVkQ2FtZXJhUm90YXRpb246IG51bWJlciA9IDEsIF9zcGVlZENhbWVyYVRyYW5zbGF0aW9uOiBudW1iZXIgPSAwLjAxLCBfc3BlZWRDYW1lcmFEaXN0YW5jZTogbnVtYmVyID0gMC4wMDEsIF9yZWRyYXc6ICgpID0+IHZvaWQgPSAoKSA9PiBfdmlld3BvcnQuZHJhdygpLCBfdHJhbnNsYXRlT25QaWNrOiAoKSA9PiBib29sZWFuID0gKCkgPT4gdHJ1ZSk6IENhbWVyYU9yYml0IHtcclxuICAgICAgLy8gX3ZpZXdwb3J0LnNldEZvY3VzKHRydWUpO1xyXG4gICAgICAvLyBfdmlld3BvcnQuYWN0aXZhdGVQb2ludGVyRXZlbnQoxpIuRVZFTlRfUE9JTlRFUi5ET1dOLCB0cnVlKTtcclxuICAgICAgLy8gX3ZpZXdwb3J0LmFjdGl2YXRlUG9pbnRlckV2ZW50KMaSLkVWRU5UX1BPSU5URVIuVVAsIHRydWUpO1xyXG4gICAgICAvLyBfdmlld3BvcnQuYWN0aXZhdGVQb2ludGVyRXZlbnQoxpIuRVZFTlRfUE9JTlRFUi5NT1ZFLCB0cnVlKTtcclxuICAgICAgLy8gX3ZpZXdwb3J0LmFjdGl2YXRlV2hlZWxFdmVudCjGki5FVkVOVF9XSEVFTC5XSEVFTCwgdHJ1ZSk7XHJcbiAgICAgIF92aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCBobmRQb2ludGVyVXApO1xyXG4gICAgICBfdmlld3BvcnQuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCBobmRQb2ludGVyRG93bik7XHJcbiAgICAgIF92aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIGhuZFBvaW50ZXJNb3ZlKTtcclxuICAgICAgX3ZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmxlYXZlXCIsIGhuZFBvaW50ZXJVcCk7XHJcbiAgICAgIF92aWV3cG9ydC5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgaG5kUG9pbnRlclVwKTtcclxuICAgICAgX3ZpZXdwb3J0LmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgaG5kV2hlZWxNb3ZlKTtcclxuXHJcbiAgICAgIGNvbnN0IGZhY3RvclBhbjogbnVtYmVyID0gMSAvIDUwMDtcclxuICAgICAgY29uc3QgZmFjdG9yRmx5OiBudW1iZXIgPSAxIC8gMjA7XHJcbiAgICAgIGNvbnN0IGZhY3Rvclpvb206IG51bWJlciA9IDEgLyAzO1xyXG4gICAgICBjb25zdCBmYWN0b3Jab29tVG91Y2g6IG51bWJlciA9IDIuNTtcclxuXHJcbiAgICAgIGNvbnN0IGRvdWJsZVRhcFRocmVzaG9sZCA9IHsgdGltZTogMzAwLCBkaXN0YW5jZTogMzAgKiogMiB9OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIGNvbnN0IHBpbmNoVGhyZXNob2xkOiBudW1iZXIgPSA3MDsgLy8gbWF4IGhvcml6b250YWwgZGlzdGFuY2UgYmV0d2VlbiB0d28gdG91Y2hlcyB0byBiZSByZWNvZ25pemVkIGFzIHBpbmNoXHJcblxyXG4gICAgICBsZXQgZmx5U3BlZWQ6IG51bWJlciA9IDAuMztcclxuICAgICAgbGV0IGZseUFjY2VsZXJhdGVkOiBudW1iZXIgPSAxMDtcclxuICAgICAgbGV0IHRpbWVyOiDGki5UaW1lciA9IG5ldyDGki5UaW1lcijGki5UaW1lLmdhbWUsIDIwLCAwLCBobmRUaW1lcik7XHJcbiAgICAgIGxldCBjbnRGbHk6IMaSLkNvbnRyb2wgPSBuZXcgxpIuQ29udHJvbChcIkZseVwiLCBmbHlTcGVlZCk7XHJcbiAgICAgIGNudEZseS5zZXREZWxheSg1MDApO1xyXG4gICAgICBsZXQgZmx5aW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRpbWVyKTtcclxuXHJcbiAgICAgIGxldCB0b3VjaFN0YXRlOiBcIm9yYml0XCIgfCBcImZseVwiIHwgXCJ6b29tXCI7XHJcblxyXG4gICAgICBsZXQgY250TW91c2VIb3Jpem9udGFsOiDGki5Db250cm9sID0gbmV3IMaSLkNvbnRyb2woXCJNb3VzZUhvcml6b250YWxcIiwgLTEpO1xyXG4gICAgICBsZXQgY250TW91c2VWZXJ0aWNhbDogxpIuQ29udHJvbCA9IG5ldyDGki5Db250cm9sKFwiTW91c2VWZXJ0aWNhbFwiLCAtMSk7XHJcblxyXG4gICAgICAvLyBjYW1lcmEgc2V0dXBcclxuICAgICAgbGV0IGNhbWVyYTogQ2FtZXJhT3JiaXRNb3ZpbmdGb2N1cztcclxuICAgICAgY2FtZXJhID0gbmV3IENhbWVyYU9yYml0TW92aW5nRm9jdXMoX3ZpZXdwb3J0LmNhbWVyYSwgNSwgODUsIDAuMDEsIDEwMDApO1xyXG4gICAgICAvL1RPRE86IHJlbW92ZSB0aGUgZm9sbG93aW5nIGxpbmUsIGNhbWVyYSBtdXN0IG5vdCBiZSBtYW5pcHVsYXRlZCBidXQgc2hvdWxkIGFscmVhZHkgYmUgc2V0IHVwIHdoZW4gY2FsbGluZyB0aGlzIG1ldGhvZFxyXG4gICAgICBfdmlld3BvcnQuY2FtZXJhLnByb2plY3RDZW50cmFsKF92aWV3cG9ydC5jYW1lcmEuZ2V0QXNwZWN0KCksIF92aWV3cG9ydC5jYW1lcmEuZ2V0RmllbGRPZlZpZXcoKSwgX3ZpZXdwb3J0LmNhbWVyYS5nZXREaXJlY3Rpb24oKSwgMC4wMSwgMTAwMCk7XHJcblxyXG4gICAgICAvLyB5c2V0IHVwIGF4aXMgdG8gY29udHJvbFxyXG4gICAgICBjYW1lcmEuYXhpc1JvdGF0ZVguYWRkQ29udHJvbChjbnRNb3VzZVZlcnRpY2FsKTtcclxuICAgICAgY2FtZXJhLmF4aXNSb3RhdGVYLnNldEZhY3Rvcihfc3BlZWRDYW1lcmFSb3RhdGlvbik7XHJcblxyXG4gICAgICBjYW1lcmEuYXhpc1JvdGF0ZVkuYWRkQ29udHJvbChjbnRNb3VzZUhvcml6b250YWwpO1xyXG4gICAgICBjYW1lcmEuYXhpc1JvdGF0ZVkuc2V0RmFjdG9yKF9zcGVlZENhbWVyYVJvdGF0aW9uKTtcclxuICAgICAgLy8gX3ZpZXdwb3J0LmdldEJyYW5jaCgpLmFkZENoaWxkKGNhbWVyYSk7XHJcblxyXG4gICAgICBsZXQgZm9jdXM6IMaSLk5vZGU7XHJcbiAgICAgIGlmIChfc2hvd0ZvY3VzKSB7XHJcbiAgICAgICAgZm9jdXMgPSBuZXcgTm9kZUNvb3JkaW5hdGVTeXN0ZW0oXCJGb2N1c1wiKTtcclxuICAgICAgICBmb2N1cy5hZGRDb21wb25lbnQobmV3IMaSLkNvbXBvbmVudFRyYW5zZm9ybSgpKTtcclxuICAgICAgICBfdmlld3BvcnQuZ2V0QnJhbmNoKCkuYWRkQ2hpbGQoZm9jdXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBhY3RpdmVQb2ludGVyczogTWFwPG51bWJlciwgUG9pbnRlckV2ZW50PiA9IG5ldyBNYXAoKTtcclxuICAgICAgbGV0IHByZXZQb2ludGVyOiBQb2ludGVyRXZlbnQ7XHJcbiAgICAgIGxldCBwcmV2RGlzdGFuY2U6IG51bWJlcjtcclxuXHJcbiAgICAgIHJlZHJhdygpO1xyXG4gICAgICByZXR1cm4gY2FtZXJhO1xyXG5cclxuICAgICAgZnVuY3Rpb24gaG5kUG9pbnRlck1vdmUoX2V2ZW50OiBQb2ludGVyRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIV9ldmVudC5idXR0b25zKVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBhY3RpdmVQb2ludGVycy5zZXQoX2V2ZW50LnBvaW50ZXJJZCwgX2V2ZW50KTtcclxuXHJcbiAgICAgICAgbGV0IHBvc0NhbWVyYTogxpIuVmVjdG9yMyA9IGNhbWVyYS5ub2RlQ2FtZXJhLm10eFdvcmxkLnRyYW5zbGF0aW9uLmNsb25lO1xyXG5cclxuICAgICAgICAvLyBvcmJpdFxyXG4gICAgICAgIGlmICgoX2V2ZW50LmJ1dHRvbnMgPT0gNCAmJiAhKF9ldmVudC5jdHJsS2V5IHx8IF9ldmVudC5hbHRLZXkgfHwgX2V2ZW50LnNoaWZ0S2V5KSkgfHwgKF9ldmVudC5idXR0b25zID09IDEgJiYgX2V2ZW50LmFsdEtleSkgfHwgdG91Y2hTdGF0ZSA9PSBcIm9yYml0XCIpIHtcclxuICAgICAgICAgIGNudE1vdXNlSG9yaXpvbnRhbC5zZXRJbnB1dChfZXZlbnQubW92ZW1lbnRYKTtcclxuICAgICAgICAgIGNudE1vdXNlVmVydGljYWwuc2V0SW5wdXQoX2V2ZW50Lm1vdmVtZW50WSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmbHlcclxuICAgICAgICBpZiAoKF9ldmVudC5idXR0b25zID09IDIgJiYgIV9ldmVudC5hbHRLZXkpIHx8IHRvdWNoU3RhdGUgPT0gXCJmbHlcIikge1xyXG4gICAgICAgICAgY250TW91c2VIb3Jpem9udGFsLnNldElucHV0KF9ldmVudC5tb3ZlbWVudFggKiBmYWN0b3JGbHkpO1xyXG4gICAgICAgICAgY250TW91c2VWZXJ0aWNhbC5zZXRJbnB1dChfZXZlbnQubW92ZW1lbnRZICogZmFjdG9yRmx5KTtcclxuICAgICAgICAgIMaSLlJlbmRlci5wcmVwYXJlKGNhbWVyYSk7XHJcbiAgICAgICAgICBsZXQgb2Zmc2V0OiDGki5WZWN0b3IzID0gxpIuVmVjdG9yMy5ESUZGRVJFTkNFKHBvc0NhbWVyYSwgY2FtZXJhLm5vZGVDYW1lcmEubXR4V29ybGQudHJhbnNsYXRpb24pO1xyXG4gICAgICAgICAgY2FtZXJhLm10eExvY2FsLnRyYW5zbGF0ZShvZmZzZXQsIGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHpvb21cclxuICAgICAgICBpZiAoKF9ldmVudC5idXR0b25zID09IDQgJiYgX2V2ZW50LmN0cmxLZXkpIHx8IChfZXZlbnQuYnV0dG9ucyA9PSAyICYmIF9ldmVudC5hbHRLZXkpKVxyXG4gICAgICAgICAgem9vbShfZXZlbnQubW92ZW1lbnRYICogZmFjdG9yWm9vbSk7XHJcblxyXG4gICAgICAgIC8vIHBpbmNoIHpvb21cclxuICAgICAgICBpZiAodG91Y2hTdGF0ZSA9PSBcInpvb21cIikge1xyXG4gICAgICAgICAgY29uc3QgaXRlcmF0b3I6IEl0ZXJhYmxlSXRlcmF0b3I8UG9pbnRlckV2ZW50PiA9IGFjdGl2ZVBvaW50ZXJzLnZhbHVlcygpO1xyXG4gICAgICAgICAgY29uc3QgZGlzdGFuY2U6IG51bWJlciA9IE1hdGguYWJzKGl0ZXJhdG9yLm5leHQoKS52YWx1ZS5vZmZzZXRZIC0gaXRlcmF0b3IubmV4dCgpLnZhbHVlLm9mZnNldFkpO1xyXG4gICAgICAgICAgaWYgKHByZXZEaXN0YW5jZSlcclxuICAgICAgICAgICAgem9vbSgocHJldkRpc3RhbmNlIC0gZGlzdGFuY2UpICogZmFjdG9yWm9vbVRvdWNoKTtcclxuXHJcbiAgICAgICAgICBwcmV2RGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHBhbiBcclxuICAgICAgICBpZiAoX2V2ZW50LmJ1dHRvbnMgPT0gNCAmJiAoX2V2ZW50LmFsdEtleSB8fCBfZXZlbnQuc2hpZnRLZXkpKSB7XHJcbiAgICAgICAgICBjYW1lcmEudHJhbnNsYXRlWCgtX2V2ZW50Lm1vdmVtZW50WCAqIGNhbWVyYS5kaXN0YW5jZSAqIGZhY3RvclBhbik7XHJcbiAgICAgICAgICBjYW1lcmEudHJhbnNsYXRlWShfZXZlbnQubW92ZW1lbnRZICogY2FtZXJhLmRpc3RhbmNlICogZmFjdG9yUGFuKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlZHJhdygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBobmRUaW1lcihfZXZlbnQ6IMaSLkV2ZW50VGltZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWZseWluZylcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjbnRGbHkuc2V0RmFjdG9yKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5TSElGVF9MRUZUXSkgPyBmbHlBY2NlbGVyYXRlZCA6IGZseVNwZWVkKTtcclxuICAgICAgICBjbnRGbHkuc2V0SW5wdXQoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlcsIMaSLktFWUJPQVJEX0NPREUuQSwgxpIuS0VZQk9BUkRfQ09ERS5TLCDGki5LRVlCT0FSRF9DT0RFLkQsIMaSLktFWUJPQVJEX0NPREUuUSwgxpIuS0VZQk9BUkRfQ09ERS5FXSkgPyAxIDogMCk7XHJcblxyXG4gICAgICAgIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuV10pKVxyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVooLWNudEZseS5nZXRPdXRwdXQoKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLlNdKSlcclxuICAgICAgICAgIGNhbWVyYS50cmFuc2xhdGVaKGNudEZseS5nZXRPdXRwdXQoKSk7XHJcbiAgICAgICAgZWxzZSBpZiAoxpIuS2V5Ym9hcmQuaXNQcmVzc2VkT25lKFvGki5LRVlCT0FSRF9DT0RFLkFdKSlcclxuICAgICAgICAgIGNhbWVyYS50cmFuc2xhdGVYKC1jbnRGbHkuZ2V0T3V0cHV0KCkpO1xyXG4gICAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5EXSkpXHJcbiAgICAgICAgICBjYW1lcmEudHJhbnNsYXRlWChjbnRGbHkuZ2V0T3V0cHV0KCkpO1xyXG4gICAgICAgIGVsc2UgaWYgKMaSLktleWJvYXJkLmlzUHJlc3NlZE9uZShbxpIuS0VZQk9BUkRfQ09ERS5RXSkpXHJcbiAgICAgICAgICBjYW1lcmEudHJhbnNsYXRlWSgtY250Rmx5LmdldE91dHB1dCgpKTtcclxuICAgICAgICBlbHNlIGlmICjGki5LZXlib2FyZC5pc1ByZXNzZWRPbmUoW8aSLktFWUJPQVJEX0NPREUuRV0pKVxyXG4gICAgICAgICAgY2FtZXJhLnRyYW5zbGF0ZVkoY250Rmx5LmdldE91dHB1dCgpKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgcmVkcmF3KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGhuZFBvaW50ZXJEb3duKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgYWN0aXZlUG9pbnRlcnMuc2V0KF9ldmVudC5wb2ludGVySWQsIF9ldmVudCk7XHJcblxyXG4gICAgICAgIGZseWluZyA9IChfZXZlbnQuYnV0dG9ucyA9PSAyICYmICFfZXZlbnQuYWx0S2V5KTtcclxuXHJcbiAgICAgICAgaWYgKF9ldmVudC5wb2ludGVyVHlwZSA9PSBcInRvdWNoXCIpIHtcclxuICAgICAgICAgIHRvdWNoU3RhdGUgPSBcIm9yYml0XCI7XHJcblxyXG4gICAgICAgICAgaWYgKGFjdGl2ZVBvaW50ZXJzLnNpemUgPT0gMikge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVyYXRvcjogSXRlcmFibGVJdGVyYXRvcjxQb2ludGVyRXZlbnQ+ID0gYWN0aXZlUG9pbnRlcnMudmFsdWVzKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlOiBudW1iZXIgPSBNYXRoLmFicyhpdGVyYXRvci5uZXh0KCkudmFsdWUub2Zmc2V0WCAtIGl0ZXJhdG9yLm5leHQoKS52YWx1ZS5vZmZzZXRYKTtcclxuICAgICAgICAgICAgdG91Y2hTdGF0ZSA9IGRpc3RhbmNlIDwgcGluY2hUaHJlc2hvbGQgPyBcInpvb21cIiA6IFwiZmx5XCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkb3VibGVUYXA6IGJvb2xlYW4gPSBhY3RpdmVQb2ludGVycy5zaXplID09IDEgJiZcclxuICAgICAgICAgIChfZXZlbnQudGltZVN0YW1wIC0gKHByZXZQb2ludGVyPy50aW1lU3RhbXAgPz8gMCkgPCBkb3VibGVUYXBUaHJlc2hvbGQudGltZSkgJiZcclxuICAgICAgICAgIChwcmV2UG9pbnRlcj8ub2Zmc2V0WCAtIF9ldmVudC5vZmZzZXRYID8/IDApICoqIDIgKyAocHJldlBvaW50ZXI/Lm9mZnNldFkgLSBfZXZlbnQub2Zmc2V0WSA/PyAwKSAqKiAyIDwgZG91YmxlVGFwVGhyZXNob2xkLmRpc3RhbmNlO1xyXG5cclxuICAgICAgICBwcmV2UG9pbnRlciA9IGRvdWJsZVRhcCA/IG51bGwgOiBfZXZlbnQ7XHJcblxyXG4gICAgICAgIGlmIChfZXZlbnQuYnV0dG9uICE9IDAgfHwgX2V2ZW50LmN0cmxLZXkgfHwgX2V2ZW50LmFsdEtleSB8fCBfZXZlbnQuc2hpZnRLZXkgfHwgKF9ldmVudC5wb2ludGVyVHlwZSA9PSBcInRvdWNoXCIgJiYgIWRvdWJsZVRhcCkpXHJcbiAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRvdWNoU3RhdGUgPSBudWxsO1xyXG5cclxuICAgICAgICBsZXQgcG9zOiDGki5WZWN0b3IyID0gbmV3IMaSLlZlY3RvcjIoX2V2ZW50Lm9mZnNldFgsIF9ldmVudC5vZmZzZXRZKTtcclxuICAgICAgICBsZXQgcGlja3M6IMaSLlBpY2tbXSA9IMaSLlBpY2tlci5waWNrVmlld3BvcnQoX3ZpZXdwb3J0LCBwb3MpO1xyXG4gICAgICAgIGlmIChwaWNrcy5sZW5ndGggPT0gMClcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvLyBwaWNrcy5zb3J0KChfYTogxpIuUGljaywgX2I6IMaSLlBpY2spID0+IChfYS56QnVmZmVyIDwgX2IuekJ1ZmZlciAmJiBfYS5naXptbykgPyAtMSA6IDEpO1xyXG4gICAgICAgIHBpY2tzLnNvcnQoKF9hLCBfYikgPT4ge1xyXG4gICAgICAgICAgaWYgKF9hLmdpem1vICYmICFfYi5naXptbylcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgaWYgKCFfYS5naXptbyAmJiBfYi5naXptbylcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAvLyBJZiBib3RoIHBpY2tzIGhhdmUgYSBnaXptbyBwcm9wZXJ0eSBvciBpZiBuZWl0aGVyIGRvZXMsIHByaW9yaXRpemUgYmFzZWQgb24gekJ1ZmZlciB2YWx1ZVxyXG4gICAgICAgICAgcmV0dXJuIF9hLnpCdWZmZXIgLSBfYi56QnVmZmVyO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBsZXQgcG9zQ2FtZXJhOiDGki5WZWN0b3IzID0gY2FtZXJhLm5vZGVDYW1lcmEubXR4V29ybGQudHJhbnNsYXRpb247XHJcbiAgICAgICAgLy8gY2FtZXJhLm10eExvY2FsLnRyYW5zbGF0aW9uID0gcGlja3NbMF0ucG9zV29ybGQ7XHJcbiAgICAgICAgLy8gLy8gxpIuUmVuZGVyLnByZXBhcmUoY2FtZXJhKTtcclxuICAgICAgICAvLyBjYW1lcmEucG9zaXRpb25DYW1lcmEocG9zQ2FtZXJhKTtcclxuICAgICAgICAvLyBpZiAoIShwaWNrc1swXS5naXptbyBpbnN0YW5jZW9mIENvbXBvbmVudFRyYW5zbGF0b3IpKVxyXG4gICAgICAgIGlmIChfdHJhbnNsYXRlT25QaWNrKCkpXHJcbiAgICAgICAgICBjYW1lcmEubXR4TG9jYWwudHJhbnNsYXRpb24gPSBwaWNrc1swXS5wb3NXb3JsZDtcclxuICAgICAgICByZWRyYXcoKTtcclxuXHJcbiAgICAgICAgX3ZpZXdwb3J0LmNhbnZhcy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcInBpY2tcIiwgeyBkZXRhaWw6IHBpY2tzWzBdLCBidWJibGVzOiB0cnVlIH0pKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaG5kUG9pbnRlclVwKF9ldmVudDogUG9pbnRlckV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgYWN0aXZlUG9pbnRlcnMuZGVsZXRlKF9ldmVudC5wb2ludGVySWQpO1xyXG4gICAgICAgIGlmIChhY3RpdmVQb2ludGVycy5zaXplIDwgMilcclxuICAgICAgICAgIHByZXZEaXN0YW5jZSA9IDA7XHJcblxyXG4gICAgICAgIHRvdWNoU3RhdGUgPSBudWxsO1xyXG4gICAgICAgIGZseWluZyA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBobmRXaGVlbE1vdmUoX2V2ZW50OiBXaGVlbEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgem9vbShfZXZlbnQuZGVsdGFZKTtcclxuICAgICAgICByZWRyYXcoKTtcclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiB6b29tKF9kZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY2FtZXJhLmRpc3RhbmNlICo9IDEgKyBfZGVsdGEgKiBfc3BlZWRDYW1lcmFEaXN0YW5jZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gcmVkcmF3KCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChmb2N1cylcclxuICAgICAgICAgIGZvY3VzLm10eExvY2FsLnRyYW5zbGF0aW9uID0gY2FtZXJhLm10eExvY2FsLnRyYW5zbGF0aW9uO1xyXG4gICAgICAgIMaSLlJlbmRlci5wcmVwYXJlKGNhbWVyYSk7XHJcbiAgICAgICAgX3JlZHJhdygpO1xyXG4gICAgICAgIC8vIF92aWV3cG9ydC5kcmF3KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iXX0=