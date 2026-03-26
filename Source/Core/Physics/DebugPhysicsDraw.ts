///<reference path="../Render/WebGLObjectUniformBuffer.ts"/>
///<reference path="../Render/WebGLCoatUniformBuffer.ts"/>

namespace FudgeCore {
  /** Internal class for holding data about physics debug vertices.*/
  export class PhysicsDebugVertexBuffer {
    public gl: WebGL2RenderingContext;
    public numVertices: number = 0;
    public attribs: Array<PhysicsDebugVertexAttribute>;
    public indices: Array<number>;
    public offsets: Array<number>;
    public stride: number;
    public buffer: WebGLBuffer;
    public dataLength: number;

    /** Setup the rendering context for this buffer and create the actual buffer for this context. */
    public constructor(_renderingContext: WebGL2RenderingContext) {
      this.gl = _renderingContext;
      this.buffer = this.gl.createBuffer();
    }

    /** Fill the bound buffer with data. Used at buffer initialization */
    public setData(_array: Array<number>): void {
      if (this.attribs == null) throw "set attributes first";
      this.numVertices = _array.length / (this.stride / 4);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(_array), this.gl.DYNAMIC_DRAW);
      //not necessary an in webgl2 anymore to rebind the same last buffer (which is achieved by giving a null buffer), after buffer is changed. Removed it on all other occasions
      // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null); 
    }

    /** Set Shader Attributes informations by getting their position in the shader, setting the offset, stride and size. For later use in the binding process */
    public setAttribs(_attribs: Array<PhysicsDebugVertexAttribute>): void {
      this.attribs = _attribs;
      this.offsets = [];
      this.stride = 0;
      let n: number = _attribs.length;
      for (let i: number = 0; i < n; i++) {
        this.offsets.push(this.stride);
        this.stride += _attribs[i].float32Count * Float32Array.BYTES_PER_ELEMENT; // 32bit float Bytes are a constant of 4
      }
    }

    /** Enable a attribute in a shader for this context, */
    public bindAttribs(): void {
      if (this.indices == null) throw "indices are not loaded";
      let n: number = this.attribs.length;
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer); //making the buffer of this class the current buffer
      for (let i: number = 0; i < n; i++) {
        this.gl.enableVertexAttribArray(this.indices[i]); //enable the Attribute
        this.gl.vertexAttribPointer(this.indices[i], this.attribs[i].float32Count, this.gl.FLOAT, false, this.stride, this.offsets[i]); //creates a pointer and structure for this attribute
      }
    }
  }

  /** Internal class for holding data about PhysicsDebugVertexBuffers */
  export class PhysicsDebugIndexBuffer {
    public gl: WebGL2RenderingContext;
    public buffer: WebGLBuffer;
    public count: number;

    /** Setup the rendering context for this buffer and create the actual buffer for this context. */
    public constructor(_renderingContext: WebGL2RenderingContext) {
      this.gl = _renderingContext;
      this.buffer = this.gl.createBuffer();
    }

    /** Fill the bound buffer with data amount. Used at buffer initialization */
    public setData(_array: Array<number>): void {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(_array), this.gl.DYNAMIC_DRAW);
      this.count = _array.length;
    }

    /** The actual DrawCall for physicsDebugDraw Buffers. This is where the information from the debug is actually drawn. */
    public draw(_mode: number = this.gl.TRIANGLES, _count: number = -1): void {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
      this.gl.drawElements(_mode, _count >= 0 ? _count : this.count, this.gl.UNSIGNED_SHORT, 0);
    }
  }

  /** Internal class for managing data about webGL Attributes */
  export class PhysicsDebugVertexAttribute {
    public float32Count: number;
    public name: string;

    public constructor(_float32Count: number, _name: string) {
      this.name = _name;
      this.float32Count = _float32Count;
    }
  }

  /** Internal Class used to draw debugInformations about the physics simulation onto the renderContext. No user interaction needed. 
   * @author Marko Fehrenbach, HFU 2020 //Based on OimoPhysics Haxe DebugDrawDemo 
   */
  export class PhysicsDebugDraw extends RenderWebGL {
    public oimoDebugDraw: OIMO.DebugDraw; //the original physics engine debugDraw class receiving calls from the oimoPhysics.World, and providing informations in form of points/lines/triangles what the physics world looks like
    public style: OIMO.DebugDrawStyle; //colors of the debug informations, unchanged in FUDGE integration, basically coloring things like sleeping/active rb's differently, joints white and such. No need to have users change anything.
    public gl: WebGL2RenderingContext;

    //Buffers for points/lines/triangles. Index Buffer for the amount of drawCalls and Vertex Buffer for the informations
    public pointVBO: PhysicsDebugVertexBuffer;
    public pointIBO: PhysicsDebugIndexBuffer;

    public lineVBO: PhysicsDebugVertexBuffer;
    public lineIBO: PhysicsDebugIndexBuffer;

    public triVBO: PhysicsDebugVertexBuffer;
    public triIBO: PhysicsDebugIndexBuffer;

    public pointData: Array<number>;
    public pointIboData: Array<number>;
    public numPointData: number;

    public lineData: Array<number>;
    public lineIboData: Array<number>;
    public numLineData: number;

    public triData: Array<number>;
    public triIboData: Array<number>;
    public numTriData: number;

    #objectUniformBuffer: WebGLObjectUniformBuffer;
    #coatUniformBuffer: WebGLCoatUniformBuffer;

    /** Creating the debug for physics in FUDGE. Tell it to draw only wireframe objects, since FUDGE is handling rendering of the objects besides physics. 
     * Override OimoPhysics Functions with own rendering. Initialize buffers and connect them with the context for later use. */
    public constructor() {
      super();

      this.style = new OIMO.DebugDrawStyle();
      this.oimoDebugDraw = new OIMO.DebugDraw();
      this.oimoDebugDraw.wireframe = true; //Triangle Rendering is handled by FUDGE so, only the physics lines/points need to be rendered, although triangle is still implemented

      this.gl = RenderWebGL.getRenderingContext();
      this.initializeOverride();

      this.initializeBuffers();
    }

    private get objectUniformBuffer(): WebGLObjectUniformBuffer {
      if (!this.#objectUniformBuffer) {
        this.#objectUniformBuffer = new WebGLObjectUniformBuffer(1);
        this.#objectUniformBuffer.write(0, Matrix4x4.IDENTITY(), undefined, Color.CSS("white"));
        this.#objectUniformBuffer.update();
      }
      return this.#objectUniformBuffer;
    }

    private get coatUniformBuffer(): WebGLCoatUniformBuffer {
      if (!this.#coatUniformBuffer) {
        this.#coatUniformBuffer = new WebGLCoatUniformBuffer(1);
        this.#coatUniformBuffer.write(0, Color.CSS("white"), 1, 1, 1, 0, 0.01);
        this.#coatUniformBuffer.update();
      }
      return this.#coatUniformBuffer;
    }

    /** Receive the current DebugMode from the physics settings and set the OimoPhysics.DebugDraw booleans to show only certain informations.
     * Needed since some debug informations exclude others, and can't be drawn at the same time, by OimoPhysics. And for users it provides more readability
     * to debug only what they need and is commonly debugged.
     */
    public setDebugMode(_mode: PHYSICS_DEBUGMODE = PHYSICS_DEBUGMODE.NONE): void {
      // eslint-disable-next-line
      let draw = { drawAabbs: false, drawBases: false, drawBvh: false, drawContactBases: false, drawContacts: false, drawJointLimits: false, drawJoints: false, drawPairs: false, drawShapes: false };

      switch (_mode) {
        case PHYSICS_DEBUGMODE.COLLIDERS: //Colliders and Bases
          draw.drawBases = draw.drawShapes = true;
          break;
        case PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER: //Colliders and joints
          draw.drawJoints = draw.drawJointLimits = draw.drawShapes = true;
          break;
        case PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY: //Physics Objects only, shows same as Collider / Joints but also hiding every other fudge object
          draw.drawBases = draw.drawJointLimits = draw.drawJoints = draw.drawShapes = true;
          break;
        case PHYSICS_DEBUGMODE.CONTACTS: //Contacts
          draw.drawBases = draw.drawContactBases = draw.drawContacts = draw.drawPairs = draw.drawShapes = true;
          break;
        case PHYSICS_DEBUGMODE.BOUNDING_BOXES: //Bounding Box / Broadphase Bvh / Bases
          draw.drawAabbs = draw.drawBases = draw.drawBvh = true;
          break;
      }
      Object.assign(this.oimoDebugDraw, draw);
    }

    /** Creating the empty render buffers. Defining the attributes used in shaders.
     * Needs to create empty buffers to already have them ready to draw later on, linking is only possible with existing buffers. */
    public initializeBuffers(): void {
      let attribs: Array<PhysicsDebugVertexAttribute> = [
        new PhysicsDebugVertexAttribute(3, "a_vctPosition"),
        new PhysicsDebugVertexAttribute(3, "a_vctNormal"),
        new PhysicsDebugVertexAttribute(3, "a_vctColor")
      ];

      const attribIndices: Array<number> = [SHADER_ATTRIBUTE.POSITION, SHADER_ATTRIBUTE.NORMAL, SHADER_ATTRIBUTE.COLOR];

      this.pointVBO = new PhysicsDebugVertexBuffer(this.gl);
      this.pointIBO = new PhysicsDebugIndexBuffer(this.gl);
      this.pointVBO.setAttribs(attribs);
      this.pointVBO.indices = attribIndices;
      this.lineVBO = new PhysicsDebugVertexBuffer(this.gl);
      this.lineIBO = new PhysicsDebugIndexBuffer(this.gl);
      this.lineVBO.setAttribs(attribs);
      this.lineVBO.indices = attribIndices;
      this.triVBO = new PhysicsDebugVertexBuffer(this.gl);
      this.triIBO = new PhysicsDebugIndexBuffer(this.gl);
      this.triVBO.setAttribs(attribs);
      this.triVBO.indices = attribIndices;

      this.clearBuffers();
    }

    /** Before OimoPhysics.world is filling the debug. Make sure the buffers are reset. Also receiving the debugMode from settings and updating the current projection for the vertexShader. */
    public clearBuffers(): void {
      this.gl.lineWidth(2.0); //Does not affect anything because lineWidth is currently only supported by Microsoft Edge and FUDGE is optimized for Chrome

      this.pointData = []; //Resetting the data to be filled again
      this.lineData = [];
      this.triData = [];

      this.numPointData = 0; //Resetting the amount of data calls
      this.numLineData = 0;
      this.numTriData = 0;
    }

    /** After OimoPhysics.world filled the debug. Rendering calls. Setting this program to be used by the FUDGE rendering context. And draw each updated buffer and resetting them. */
    public drawBuffers(): void {
      ShaderLit.useProgram();
      this.objectUniformBuffer.use(0);
      this.coatUniformBuffer.use(0);

      this.gl.bindVertexArray(null);
      if (this.numPointData > 0) {
        this.pointIboData = [];  //Buffer size matching to whats needed
        for (let i: number = 0; i < this.numPointData; i++) {
          this.pointIboData.push(i);
        }
        this.pointIBO.setData(this.pointIboData); //Set Index buffer to correct size
        this.pointVBO.setData(this.pointData); //Set Vertex Buffer to current Data
        this.pointVBO.bindAttribs();
        this.pointIBO.draw(this.gl.POINTS, this.numPointData); //The actual draw call for each index in ibo
        this.numPointData = 0;
      }
      if (this.numLineData > 0) {
        this.lineIboData = [];
        for (let i: number = 0; i < this.numLineData; i++) {
          this.lineIboData.push(i * 2);
          this.lineIboData.push(i * 2 + 1);
        }
        this.lineIBO.setData(this.lineIboData);
        this.lineVBO.setData(this.lineData);
        this.lineVBO.bindAttribs();
        this.lineIBO.draw(this.gl.LINES, this.numLineData * 2);
        this.numLineData = 0;
      }
      if (this.numTriData > 0) {
        this.triIboData = [];
        for (let i: number = 0; i < this.numTriData; i++) {
          this.triIboData.push(i * 3);
          this.triIboData.push(i * 3 + 1);
          this.triIboData.push(i * 3 + 2);
        }
        this.triIBO.setData(this.triIboData);
        this.triVBO.setData(this.triData);
        this.triVBO.bindAttribs();
        this.triIBO.draw(this.gl.TRIANGLES, this.numTriData * 3);
        this.numTriData = 0;
      }
    }

    /** Drawing the ray into the debugDraw Call. By using the overwritten line rendering functions and drawing a point (pointSize defined in the shader) at the end of the ray. */
    public debugRay(_origin: Vector3, _end: Vector3, _color: Color): void {
      this.oimoDebugDraw.line(new OIMO.Vec3(_origin.x, _origin.y, _origin.z), new OIMO.Vec3(_end.x, _end.y, _end.z), new OIMO.Vec3(_color.r, _color.g, _color.b));
      this.oimoDebugDraw.point(new OIMO.Vec3(_end.x, _end.y, _end.z), new OIMO.Vec3(_color.r, _color.g, _color.b));
    }

    /** Overriding the existing functions from OimoPhysics.DebugDraw without actually inherit from the class, to avoid compiler problems. 
     * Overriding them to receive debugInformations in the format the physic engine provides them but handling the rendering in the fudge context. */
    private initializeOverride(): void {
      //Override point/line/triangle functions of OimoPhysics which are used to draw wireframes of objects, lines of raycasts or triangles when the objects are rendered by the physics not FUDGE (unused)

      OIMO.DebugDraw.prototype.point = function (_v: OIMO.Vec3, _color: OIMO.Vec3): void {
        let debugWrapper: PhysicsDebugDraw = Physics.debugDraw; //Get the custom physics debug class to have access to the data.
        if (Physics.mainCam != null) { //only act when there is a camera that is rendering
          let data: Array<Number> = debugWrapper.pointData; //get the already written buffer informations
          data.push(_v.x, _v.y, _v.z); //Coordinates of the point
          data.push(0, 0, 0); //Point Normals - Empty since it's not a polygon
          data.push(_color.x, _color.y, _color.z); //Color of the point
          debugWrapper.numPointData++;
        }
      };

      OIMO.DebugDraw.prototype.line = function (_v1: OIMO.Vec3, _v2: OIMO.Vec3, _color: OIMO.Vec3): void {
        let debugWrapper: PhysicsDebugDraw = Physics.debugDraw;
        if (Physics.mainCam != null) {
          let data: Array<number> = debugWrapper.lineData;
          data.push(_v1.x, _v1.y, _v1.z); //Point 1 Coordinates
          data.push(0, 0, 0); //P1 Normals - Empty since it's not a polygon
          data.push(_color.x, _color.y, _color.z); //P1 Color
          data.push(_v2.x, _v2.y, _v2.z); //Point 2 Coordinates
          data.push(0, 0, 0);
          data.push(_color.x, _color.y, _color.z);
          debugWrapper.numLineData++;
        }
      };

      OIMO.DebugDraw.prototype.triangle = function (_v1: OIMO.Vec3, _v2: OIMO.Vec3, _v3: OIMO.Vec3, _n1: OIMO.Vec3, _n2: OIMO.Vec3, _n3: OIMO.Vec3, _color: OIMO.Vec3): void {
        let debugWrapper: PhysicsDebugDraw = Physics.debugDraw;
        if (Physics.mainCam != null) {
          let data: Array<number> = debugWrapper.triData;
          data.push(_v1.x, _v1.y, _v1.z);
          data.push(_n1.x, _n1.y, _n1.z);
          data.push(_color.x, _color.y, _color.z);
          data.push(_v2.x, _v2.y, _v2.z);
          data.push(_n2.x, _n2.y, _n2.z);
          data.push(_color.x, _color.y, _color.z);
          data.push(_v3.x, _v3.y, _v3.z);
          data.push(_n3.x, _n3.y, _n3.z);
          data.push(_color.x, _color.y, _color.z);
          debugWrapper.numTriData++;
        }
      };
    }
  }
}