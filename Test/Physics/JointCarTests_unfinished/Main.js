// /<reference types="../../../../Distribution/FudgeCore.js"/>
var Turorials_FUDGEPhysics_Lesson1;
// /<reference types="../../../../Distribution/FudgeCore.js"/>
(function (Turorials_FUDGEPhysics_Lesson1) {
    var f = FudgeCore;
    //GOALS: Learning how to define shpes to create a not predefined collider shape.
    //Built a simple physics car with wheel colliders (different approach than a raycast car (default))
    //Fudge Basic Variables
    window.addEventListener("load", init);
    const app = document.querySelector("canvas"); // The html element where the scene is drawn to
    let viewPort; // The scene visualization
    let hierarchy; // You're object scene tree
    //Physical Objects
    let bodies = new Array(); // Array of all physical objects in the scene to have a quick reference
    let carBody;
    //Setting Variables
    let materialPlayer = new f.Material("Player", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.7, 0.5, 0.35, 1)));
    let speedChange = 5;
    //Car Settings / Joints
    let frontSuspensionRight;
    let frontSuspensionLeft;
    let backSuspensionRight;
    let backSuspensionLeft;
    let wheelJointFrontRight;
    let wheelJointFrontLeft;
    let wheelJointBackRight;
    let wheelJointBackLeft;
    let maxAngle = 30;
    let currentAngle = 0;
    //Function to initialize the Fudge Scene with a camera, light, viewport and PHYSCIAL Objects
    function init(_event) {
        hierarchy = new f.Node("Scene"); //create the root Node where every object is parented to. Should never be changed
        //#region PHYSICS
        //For this demo we want a higher accuracy since semi-real car physics are very delicate to calculate (thats why normally a raycast car is used for approximation)
        //OimoPhysics which is integrated in Fudge is using a correctionAlgorithm on solver iterations instead of fully recalculate physics too often, 
        //so you can crank the number of solver iterations higher than with most engines. But Oimo is in general less accurate.
        // f.Physics.setSolverIterations(1000);
        f.Physics.settings.defaultRestitution = 0.15;
        f.Physics.settings.defaultFriction = 0.95;
        f.Physics.settings.solverIterations = 500;
        //f.Physics.settings.defaultConstraintSolverType = 1; //Use most accurate joint solving, slower but needed for complex things like cars
        //Experiment with defaultConstraintSolverType and defaultCorrectionAlgorithm
        //PHYSICS 
        //Creating a physically static ground plane for our physics playground. A simple scaled cube but with physics type set to static
        bodies[0] = createCompleteNode("Ground", new f.Material("Ground", f.ShaderFlat, new f.CoatRemissive(new f.Color(0.2, 0.2, 0.2, 1))), new f.MeshCube(), 0, f.BODY_TYPE.STATIC, f.COLLISION_GROUP.GROUP_2);
        bodies[0].mtxLocal.scale(new f.Vector3(25, 0.3, 25)); //Scale the body with it's standard ComponentTransform
        //bodies[0].mtxLocal.rotateX(4, true); //Give it a slight rotation so the physical objects are sliding, always from left when it's after a scaling
        hierarchy.appendChild(bodies[0]); //Add the node to the scene by adding it to the scene-root
        //A car is basically wheels on a suspension. A suspension is a prismatic spring and a wheel is on a revolute joint.
        //But the joints, wheels need to be very well placed, could not get it done even in unity with this setup. 
        //(Unity has wheelcolliders and things to make it easier), so different setup would be done there
        settingUpCar();
        //#endregion PHYSICS
        //Standard Fudge Scene Initialization - Creating a directional light, a camera and initialize the viewport
        let cmpLight = new f.ComponentLight(f.LIGHT_TYPE.DIRECTIONAL, f.Color.CSS("WHITE"));
        cmpLight.mtxPivot.lookAt(new f.Vector3(0.5, -1, -0.8)); //Set light direction
        hierarchy.addComponent(cmpLight);
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.clrBackground = f.Color.CSS("GREY");
        cmpCamera.mtxPivot.translate(new f.Vector3(17, 4, 17)); //Move camera far back so the whole scene is visible
        cmpCamera.mtxPivot.lookAt(f.Vector3.ZERO()); //Set the camera matrix so that it looks at the center of the scene
        viewPort = new f.Viewport(); //Creating a viewport that is rendered onto the html canvas element
        viewPort.initialize("Viewport", hierarchy, cmpCamera, app); //initialize the viewport with the root node, camera and canvas
        document.addEventListener("keypress", hndKey); //Adding a listener for keypress handling
        //PHYSICS - Start using physics by telling the physics the scene root object. Physics will recalculate every transform and initialize
        f.Physics.adjustTransforms(hierarchy);
        viewPort.physicsDebugMode = f.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        //Important start the game loop after starting physics, so physics can use the current transform before it's first iteration
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update); //Tell the game loop to call the update function on each frame
        f.Loop.start(); //Stard the game loop
    }
    //Function to animate/update the Fudge scene, commonly known as gameloop
    function update() {
        //PHYSICS - Simulate physical changes each frame, parameter to set time between frames
        f.Physics.simulate(f.Loop.timeFrameReal / 1000);
        viewPort.draw(); // Draw the current Fudge Scene to the canvas
    }
    // Function to quickly create a node with multiple needed FudgeComponents, including a physics component
    function createCompleteNode(_name, _material, _mesh, _mass, _physicsType, _group = f.COLLISION_GROUP.DEFAULT, _colType = f.COLLIDER_TYPE.CUBE, _convexMesh = null) {
        let node = new f.Node(_name);
        let cmpMesh = new f.ComponentMesh(_mesh);
        let cmpMaterial = new f.ComponentMaterial(_material);
        let cmpTransform = new f.ComponentTransform();
        let cmpRigidbody = new f.ComponentRigidbody(_mass, _physicsType, _colType, _group, null, _convexMesh); //add a Float32 Array of points to the rb constructor to create a convex collider
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);
        node.addComponent(cmpRigidbody);
        return node;
    }
    function settingUpCar() {
        //Setting up visuals
        //Best practice to place the main body and place every suspension and wheel locally to the body. Not in this tutorial to make it more clear
        //CarBody
        bodies[12] = createCompleteNode("Car_Base", materialPlayer, new f.MeshCube(), 500, f.BODY_TYPE.DYNAMIC);
        carBody = bodies[12].getComponent(f.ComponentRigidbody);
        bodies[12].mtxLocal.translate(new f.Vector3(0, 2.5, 0));
        bodies[12].mtxLocal.scale(new f.Vector3(1, 0.5, 2));
        hierarchy.appendChild(bodies[12]);
        //CarWheels - Important to balance the car out correctly
        bodies[13] = createCompleteNode("Car_WheelRight_Front", materialPlayer, new f.MeshCube(), 5, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.DEFAULT, f.COLLIDER_TYPE.CYLINDER);
        bodies[13].mtxLocal.translate(new f.Vector3(1, 1.50, -0.75));
        bodies[13].mtxLocal.scale(new f.Vector3(0.5, 0.85, 0.85)); //Wheels the as a cylinder use the x, for the height of the cylinder, y for the diameter and z is just for the f.MeshCube to scale.
        bodies[13].mtxLocal.rotateZ(90, false);
        hierarchy.appendChild(bodies[13]);
        bodies[14] = createCompleteNode("Car_WheelRight_Back", materialPlayer, new f.MeshCube(), 5, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.DEFAULT, f.COLLIDER_TYPE.CYLINDER);
        bodies[14].mtxLocal.translate(new f.Vector3(1, 1.50, 0.75));
        bodies[14].mtxLocal.scale(new f.Vector3(0.5, 0.85, 0.85));
        bodies[14].mtxLocal.rotateZ(90, false);
        hierarchy.appendChild(bodies[14]);
        bodies[15] = createCompleteNode("Car_WheelLeft_Front", materialPlayer, new f.MeshCube(), 5, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.DEFAULT, f.COLLIDER_TYPE.CYLINDER);
        bodies[15].mtxLocal.translate(new f.Vector3(-1, 1.50, -0.75));
        bodies[15].mtxLocal.scale(new f.Vector3(0.5, 0.85, 0.85));
        bodies[15].mtxLocal.rotateZ(90, false);
        hierarchy.appendChild(bodies[15]);
        bodies[16] = createCompleteNode("Car_WheelLeft_Back", materialPlayer, new f.MeshCube(), 5, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.DEFAULT, f.COLLIDER_TYPE.CYLINDER);
        bodies[16].mtxLocal.translate(new f.Vector3(-1, 1.50, 0.75));
        bodies[16].mtxLocal.scale(new f.Vector3(0.5, 0.85, 0.85));
        bodies[16].mtxLocal.rotateZ(90, false);
        hierarchy.appendChild(bodies[16]);
        //SuspensionHolders
        bodies[17] = createCompleteNode("Car_HolderRight_Front", materialPlayer, new f.MeshCube(), 20, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_4);
        bodies[17].getComponent(f.ComponentRigidbody).collisionMask = f.COLLISION_GROUP.GROUP_4;
        bodies[17].mtxLocal.translate(new f.Vector3(0.4, 1.5, -0.75));
        bodies[17].mtxLocal.scale(new f.Vector3(0.5, 0.5, 0.5));
        hierarchy.appendChild(bodies[17]);
        bodies[18] = createCompleteNode("Car_HolderRight_Back", materialPlayer, new f.MeshCube(), 20, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_4);
        bodies[18].getComponent(f.ComponentRigidbody).collisionMask = f.COLLISION_GROUP.GROUP_4;
        bodies[18].mtxLocal.translate(new f.Vector3(0.4, 1.5, 0.75));
        bodies[18].mtxLocal.scale(new f.Vector3(0.5, 0.5, 0.5));
        hierarchy.appendChild(bodies[18]);
        bodies[19] = createCompleteNode("Car_HolderLeft_Front", materialPlayer, new f.MeshCube(), 20, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_4);
        bodies[19].getComponent(f.ComponentRigidbody).collisionMask = f.COLLISION_GROUP.GROUP_4;
        bodies[19].mtxLocal.translate(new f.Vector3(-0.4, 1.5, -0.75));
        bodies[19].mtxLocal.scale(new f.Vector3(0.5, 0.5, 0.5));
        hierarchy.appendChild(bodies[19]);
        bodies[20] = createCompleteNode("Car_HolderLeft_Back", materialPlayer, new f.MeshCube(), 20, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_4);
        bodies[20].getComponent(f.ComponentRigidbody).collisionMask = f.COLLISION_GROUP.GROUP_4;
        bodies[20].mtxLocal.translate(new f.Vector3(-0.4, 1.5, 0.75));
        bodies[20].mtxLocal.scale(new f.Vector3(0.5, 0.5, 0.5));
        hierarchy.appendChild(bodies[20]);
        //Connecting them with joints
        //Sliding, Prismatic, Spring Joint between the body and the suspension
        //In -Y-Axis positioned where the holder is located locally to the car_base
        frontSuspensionRight = new f.JointCylindrical(carBody, bodies[17].getComponent(f.ComponentRigidbody), new f.Vector3(0, -1, 0), new f.Vector3(0.50, -1, -0.75));
        carBody.node.addComponent(frontSuspensionRight);
        frontSuspensionRight.springDamping = 100;
        frontSuspensionRight.springFrequency = 2;
        frontSuspensionRight.maxMotor = 0;
        frontSuspensionRight.minMotor = 0;
        frontSuspensionRight.maxRotor = 0;
        frontSuspensionRight.minRotor = 0;
        frontSuspensionRight.internalCollision = true;
        frontSuspensionLeft = new f.JointCylindrical(carBody, bodies[19].getComponent(f.ComponentRigidbody), new f.Vector3(0, -1, 0), new f.Vector3(-0.50, -1, -0.75));
        carBody.node.addComponent(frontSuspensionLeft);
        frontSuspensionLeft.springDamping = 100;
        frontSuspensionLeft.springFrequency = 2;
        frontSuspensionLeft.maxMotor = 0;
        frontSuspensionLeft.minMotor = 0;
        frontSuspensionLeft.maxRotor = 0;
        frontSuspensionLeft.minRotor = 0;
        frontSuspensionLeft.internalCollision = true;
        backSuspensionLeft = new f.JointCylindrical(carBody, bodies[20].getComponent(f.ComponentRigidbody), new f.Vector3(0, -1, 0), new f.Vector3(-0.50, -1, 0.75));
        carBody.node.addComponent(backSuspensionLeft);
        backSuspensionLeft.springDamping = 100;
        backSuspensionLeft.springFrequency = 2;
        backSuspensionLeft.maxMotor = 0;
        backSuspensionLeft.minMotor = 0;
        backSuspensionLeft.maxRotor = 0;
        backSuspensionLeft.minRotor = 0;
        backSuspensionLeft.internalCollision = true;
        backSuspensionRight = new f.JointCylindrical(carBody, bodies[18].getComponent(f.ComponentRigidbody), new f.Vector3(0, -1, 0), new f.Vector3(0.50, -1, 0.75));
        carBody.node.addComponent(backSuspensionRight);
        backSuspensionRight.springDamping = 100;
        backSuspensionRight.springFrequency = 2;
        backSuspensionRight.maxMotor = 0;
        backSuspensionRight.minMotor = 0;
        backSuspensionRight.maxRotor = 0;
        backSuspensionRight.minRotor = 0;
        backSuspensionRight.internalCollision = true;
        //Connect Wheels to suspension - Hinge (revolute) joints that can rotate 360° in X-Axis but not move
        wheelJointFrontRight = new f.JointRevolute(bodies[17].getComponent(f.ComponentRigidbody), bodies[13].getComponent(f.ComponentRigidbody), new f.Vector3(-1, 0, 0));
        bodies[17].addComponent(wheelJointFrontRight);
        wheelJointFrontLeft = new f.JointRevolute(bodies[19].getComponent(f.ComponentRigidbody), bodies[15].getComponent(f.ComponentRigidbody), new f.Vector3(-1, 0, 0));
        bodies[19].addComponent(wheelJointFrontLeft);
        wheelJointBackRight = new f.JointRevolute(bodies[18].getComponent(f.ComponentRigidbody), bodies[14].getComponent(f.ComponentRigidbody), new f.Vector3(-1, 0, 0));
        bodies[18].addComponent(wheelJointBackRight);
        wheelJointBackLeft = new f.JointRevolute(bodies[20].getComponent(f.ComponentRigidbody), bodies[16].getComponent(f.ComponentRigidbody), new f.Vector3(-1, 0, 0));
        bodies[20].addComponent(wheelJointBackLeft);
        // wheelJointFrontRight.motorSpeed = -5;
        wheelJointFrontRight.motorTorque = 5000;
        // wheelJointFrontLeft.motorSpeed = -5;
        wheelJointFrontLeft.motorTorque = 5000;
        // wheelJoint_backR.motorSpeed = -5;
        // wheelJoint_backR.motorTorque = 50;
        // wheelJoint_backL.motorSpeed = -5;
        // wheelJoint_backL.motorTorque = 50;
    }
    // Event Function handling keyboard input
    function hndKey(_event) {
        if (_event.code == f.KEYBOARD_CODE.A) { //Steering the wheels by giving them a new angle limit so they are fixed on this angle
            frontSuspensionLeft.maxRotor = currentAngle < maxAngle ? currentAngle++ : currentAngle;
            frontSuspensionLeft.minRotor = currentAngle < maxAngle ? currentAngle++ : currentAngle;
            frontSuspensionRight.maxRotor = currentAngle < maxAngle ? currentAngle++ : currentAngle;
            frontSuspensionRight.minRotor = currentAngle < maxAngle ? currentAngle++ : currentAngle;
            console.log(frontSuspensionLeft.maxRotor);
            console.log(frontSuspensionLeft.minRotor);
        }
        if (_event.code == f.KEYBOARD_CODE.W) {
            carBody.applyForce(new f.Vector3(0, 10, 0));
            wheelJointFrontRight.motorSpeed += speedChange;
            wheelJointFrontLeft.motorSpeed += speedChange;
        }
        if (_event.code == f.KEYBOARD_CODE.S) {
            wheelJointFrontRight.motorSpeed -= speedChange;
            wheelJointFrontLeft.motorSpeed -= speedChange;
        }
        if (_event.code == f.KEYBOARD_CODE.D) {
            frontSuspensionLeft.maxRotor = currentAngle > -maxAngle ? currentAngle-- : currentAngle;
            frontSuspensionLeft.minRotor = currentAngle > -maxAngle ? currentAngle-- : currentAngle;
            frontSuspensionRight.maxRotor = currentAngle > -maxAngle ? currentAngle-- : currentAngle;
            frontSuspensionRight.minRotor = currentAngle > -maxAngle ? currentAngle-- : currentAngle;
        }
        if (_event.code == f.KEYBOARD_CODE.T) {
            viewPort.physicsDebugMode = viewPort.physicsDebugMode == f.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER ? f.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY : f.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
            frontSuspensionRight.maxMotor = 0;
        }
        if (_event.code == f.KEYBOARD_CODE.X) {
            f.Time.game.setScale(f.Time.game.getScale() === 1 ? 0 : 1);
        }
    }
})(Turorials_FUDGEPhysics_Lesson1 || (Turorials_FUDGEPhysics_Lesson1 = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOERBQThEO0FBQzlELElBQVUsOEJBQThCLENBK1F2QztBQWhSRCw4REFBOEQ7QUFDOUQsV0FBVSw4QkFBOEI7SUFDdEMsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBRXJCLGdGQUFnRjtJQUNoRixtR0FBbUc7SUFFbkcsdUJBQXVCO0lBQ3ZCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEMsTUFBTSxHQUFHLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywrQ0FBK0M7SUFDaEgsSUFBSSxRQUFvQixDQUFDLENBQUMsMEJBQTBCO0lBQ3BELElBQUksU0FBaUIsQ0FBQyxDQUFDLDJCQUEyQjtJQUdsRCxrQkFBa0I7SUFDbEIsSUFBSSxNQUFNLEdBQWEsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLHVFQUF1RTtJQUMzRyxJQUFJLE9BQTZCLENBQUM7SUFFbEMsbUJBQW1CO0lBQ25CLElBQUksY0FBYyxHQUFlLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3SCxJQUFJLFdBQVcsR0FBVyxDQUFDLENBQUM7SUFFNUIsdUJBQXVCO0lBQ3ZCLElBQUksb0JBQXdDLENBQUM7SUFDN0MsSUFBSSxtQkFBdUMsQ0FBQztJQUM1QyxJQUFJLG1CQUF1QyxDQUFDO0lBQzVDLElBQUksa0JBQXNDLENBQUM7SUFDM0MsSUFBSSxvQkFBcUMsQ0FBQztJQUMxQyxJQUFJLG1CQUFvQyxDQUFDO0lBQ3pDLElBQUksbUJBQW9D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