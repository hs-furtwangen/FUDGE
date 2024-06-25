namespace FudgeAid {
  import ƒ = FudgeCore;

  /**
   * Allows to translate, rotate and scale matrices visually by dragging with a pointer. 
   * Installs pointer event listeners on the given {@link ƒ.Viewport}s canvas on construction. 
   * Use {@link addListeners}/{@link removeListeners} to handle the installation manually.
   */
  export class Transformator {
    public readonly viewport: ƒ.Viewport;

    public mode: "translate" | "rotate" | "scale" = "translate";
    public space: "local" | "world" = "world";
    public selected: "x" | "y" | "z" | "xyz";

    public snapAngle: number = 15; // 15 degree
    public snapDistance: number = 0.1; // 0.1 units
    public snapScale: number = 0.1; // 10%

    #undo: (() => void)[] = []; // stack of functions to undo the last transformation

    #mtxLocal: ƒ.Matrix4x4; // local matrix of the object to be transformed
    #mtxWorld: ƒ.Matrix4x4; // world matrix of the object to be transformed

    #mtxLocalBase: ƒ.Matrix4x4 = ƒ.Matrix4x4.IDENTITY(); // local matrix in a state before a transformation starts
    #mtxWorldBase: ƒ.Matrix4x4 = ƒ.Matrix4x4.IDENTITY(); // world matrix in a state before a transformation starts

    #offset: ƒ.Vector3 = ƒ.Vector3.ZERO(); // offest vector pointing from the world position of the object to where the mouse ray collided with the plane on pointer down
    #direction: ƒ.Vector3 = ƒ.Vector3.ZERO(); // driection vector pointing from the world position of the object to where the mouse ray collides with the plane (pointer move)
    #scaleFactor: number; // current scale factor of the scaling transformation

    #isTransforming: boolean = false;

    #axes = { // eslint-disable-line
      x: () => this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorldBase.right,
      y: () => this.space == "world" ? ƒ.Vector3.Y() : this.#mtxWorldBase.up,
      z: () => this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorldBase.forward
    };

    #normals = { // eslint-disable-line
      x: () => this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorldBase.forward,
      y: () => this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorldBase.right,
      z: () => this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorldBase.right
    };

    #normal: ƒ.Vector3 = ƒ.Vector3.ZERO();

    #colors = { // eslint-disable-line
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
      }
    };

    #torus: ƒ.MeshTorus;
    #torusPick: ƒ.MeshTorus;

    public constructor(_viewport: ƒ.Viewport) {
      this.viewport = _viewport;
      this.addListeners();
      this.#torus = new ƒ.MeshTorus("Torus", 0.5 - 0.0005, 0.005, 60, 8);
      this.#torusPick = new ƒ.MeshTorus("TorusPick", 0.5 - 0.003, 0.03, 60, 8);
      ƒ.Project.deregister(this.#torus);
      ƒ.Project.deregister(this.#torusPick);
    }

    public set mtxLocal(_mtx: ƒ.Matrix4x4) {
      this.#mtxLocal = _mtx;
      if (this.#mtxLocal)
        this.#mtxLocalBase.copy(_mtx);
    }

    public set mtxWorld(_mtx: ƒ.Matrix4x4) {
      this.#mtxWorld = _mtx;
      if (this.#mtxWorld)
        this.#mtxWorldBase.copy(_mtx);
    }

    private get camera(): ƒ.ComponentCamera {
      return this.viewport.camera;
    }

    /**
     * Add pointer event listeners to the viewport canvas
     */
    public addListeners = (): void => {
      this.viewport.canvas.addEventListener("pointerdown", this.hndPointerDown);
      this.viewport.canvas.addEventListener("pointermove", this.hndPointerMove);
      this.viewport.canvas.addEventListener("pointerup", this.hndPointerUp);
      this.viewport.canvas.addEventListener("pointerleave", this.hndPointerUp);
      this.viewport.canvas.addEventListener("pointercancel", this.hndPointerUp);
      this.viewport.addEventListener(ƒ.EVENT.RENDER_END, this.hndRenderEnd);
    };

    /**
     * Remove pointer event listeners from the viewport canvas
     */
    public removeListeners = (): void => {
      this.viewport.canvas.removeEventListener("pointerdown", this.hndPointerDown);
      this.viewport.canvas.removeEventListener("pointermove", this.hndPointerMove);
      this.viewport.canvas.removeEventListener("pointerup", this.hndPointerUp);
      this.viewport.canvas.removeEventListener("pointerleave", this.hndPointerUp);
      this.viewport.canvas.removeEventListener("pointercancel", this.hndPointerUp);
      this.viewport.removeEventListener(ƒ.EVENT.RENDER_END, this.hndRenderEnd);
    };

    /**
     * Undo the last transformation
     */
    public undo(): void {
      if (this.#isTransforming)
        return;

      this.#undo.pop()?.();
    }

    /**
     * Clear the undo stack
     */
    public clearUndo(): void {
      this.#undo.length = 0;
    }

    public drawGizmos(_cmpCamera: ƒ.ComponentCamera): void {
      if (!this.#mtxLocal || !this.#mtxWorld)
        return;

      const isPicking: boolean = _cmpCamera != this.camera; // if the camera is not the viewports, it must be the picking camera

      let scale: number = _cmpCamera.getWorldToPixelScale(this.#mtxWorld.translation);
      let widthArrow: number = scale * (isPicking ? 10 : 1); // 10 or 1 pixel wide;
      let lengthArrow: number;
      let sizeHead: number;

      // if (this.#isTransforming) {
      //   const mtx: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
      //   const line: ƒ.Vector3[] = [] = [ƒ.Vector3.Z(-1000), ƒ.Vector3.Z(1000)];

      //   for (const selected of <("x" | "y" | "z")[]><ƒ.General>this.selected)
      //     ƒ.Gizmos.drawLines(line, mtx.lookIn(this.#axes[selected](), this.#normals[selected]()), this.#colorsLite[selected], 1);

      //   ƒ.Recycler.storeMultiple(mtx, line[0], line[1]);
      // }

      let clrX: ƒ.Color = this.selected == "x" && !this.#isTransforming ? this.#colors.lite.x : this.#colors.base.x;
      let clrY: ƒ.Color = this.selected == "y" && !this.#isTransforming ? this.#colors.lite.y : this.#colors.base.y;
      let clrZ: ƒ.Color = this.selected == "z" && !this.#isTransforming ? this.#colors.lite.z : this.#colors.base.z;
      switch (this.mode) {
        case "translate":
          lengthArrow = scale * (isPicking ? 90 : 80); // 80 pixels long
          sizeHead = scale * 12; // 12 pixels wide
          ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrX, this.#axes.x(), this.#normals.x(), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
          ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrY, this.#axes.y(), this.#normals.y(), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
          ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrZ, this.#axes.z(), this.#normals.z(), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
          if (this.#isTransforming && (this.selected == "x" || this.selected == "y" || this.selected == "z")) {
            let scaleOrigin: number = _cmpCamera.getWorldToPixelScale(this.#mtxWorldBase.translation);
            ƒ.Gizmos.drawArrow(this.#mtxWorldBase.translation, this.#colors.transparent[this.selected], this.#axes[this.selected](), this.#normals[this.selected](), scaleOrigin * 80, scaleOrigin * 1, scaleOrigin * 12, ƒ.MeshPyramid, 1);
            // ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, ƒ.Color.CSS("magenta"), this.#normal, this.#axes[this.selected](), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
          }

          break;
        case "rotate":
          let radius: number = scale * 80; // 80 pixels radius
          sizeHead = scale * 12;

          if (this.#isTransforming && (this.selected == "x" || this.selected == "y" || this.selected == "z")) {
            this.drawCircle(this.#torus, this.#colors.base[this.selected], this.#axes[this.selected](), this.#normals[this.selected](), radius, 1);
            // ƒ.Gizmos.drawArrow(this.mtxWorld.translation, this.colorsLight[this.selected], this.move, this.axes[this.selected], this.move.magnitude, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors.base[this.selected], this.#direction, this.#axes[this.selected](), radius, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors.transparent[this.selected], this.#offset, this.#axes[this.selected](), radius, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
            break;
          }

          // draw an invisible quad to occlude the tori
          const mtxQuad: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
          const direction: ƒ.Vector3 = _cmpCamera.mtxWorld.forward.negate();
          mtxQuad.scaling = ƒ.Vector3.ONE(radius * 2);
          mtxQuad.lookIn(direction);

          ƒ.Render.setDepthFunction(ƒ.DEPTH_FUNCTION.ALWAYS);
          ƒ.Render.setColorWriteMask(false, false, false, false);
          ƒ.Gizmos.drawQuad(mtxQuad, this.#colors.base.x); // color doesn't matter
          ƒ.Render.setColorWriteMask(true, true, true, true);
          ƒ.Render.setDepthFunction(ƒ.DEPTH_FUNCTION.LESS);

          // draw the tori
          let torus: ƒ.MeshTorus = isPicking ? this.#torusPick : this.#torus;
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
            for (const selected of <("x" | "y" | "z")[]><ƒ.General>this.selected) {
              ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors.base[selected], this.#axes[selected](), this.#normals[selected](), lengthArrow * this.#scaleFactor, widthArrow, sizeHead, ƒ.MeshCube, 1);
              ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors.transparent[selected], this.#axes[selected](), this.#normals[selected](), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
            }

            break;
          }

          ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrX, this.#axes.x(), this.#normals.x(), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
          ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrY, this.#axes.y(), this.#normals.y(), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
          ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrZ, this.#axes.z(), this.#normals.z(), lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);

          const mtxCube: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
          mtxCube.scaling = ƒ.Vector3.ONE((isPicking ? 20 : 10) * scale);
          ƒ.Gizmos.drawCube(mtxCube, this.selected == "xyz" ? this.#colors.lite.xyz : this.#colors.base.xyz, 1);
          // ƒ.Recycler.store(mtxCube);
          break;
      }
    }

    private hndPointerDown = (_event: PointerEvent): void => {
      if (!this.camera || !this.viewport || !this.selected || !this.#mtxLocal || !this.#mtxWorld)
        return;

      this.#mtxLocalBase.copy(this.#mtxLocal);
      this.#mtxWorldBase.copy(this.#mtxWorld);

      if (this.selected == "x" || this.selected == "y" || this.selected == "z") {
        if (this.mode == "rotate") {
          this.#normal.copy(this.#axes[this.selected]());
        } else {
          const mtxNormal: ƒ.Matrix4x4 = ƒ.Matrix4x4.LOOK_AT(this.#mtxWorld.translation, this.camera.mtxWorld.translation, this.#axes[this.selected](), true);
          this.#normal.copy(mtxNormal.forward); // normal of the plane the mouse ray will collide with
          ƒ.Recycler.store(mtxNormal);
        }
      } else if (this.selected == "xyz") {
        this.#normal.copy(this.camera.mtxWorld.forward.negate());
      }

      const point: ƒ.Vector3 = this.getPoint3D(_event);
      this.#offset.copy(point.subtract(this.#mtxWorld.translation));

      ƒ.Recycler.store(point);

      // create undo function
      const mtxLocal: ƒ.Matrix4x4 = this.#mtxLocal;
      const mutatorLocal: ƒ.Mutator = mtxLocal.getMutator();
      const mtxWorld: ƒ.Matrix4x4 = this.#mtxWorld;
      const mutatorWorld: ƒ.Mutator = mtxWorld.getMutator();
      let undo: () => void = () => {
        mtxLocal.mutate(mutatorLocal);
        mtxWorld.mutate(mutatorWorld);
        if (this.#mtxLocal == mtxLocal)
          this.#mtxLocalBase.copy(mtxLocal);
        if (this.#mtxWorld == mtxWorld)
          this.#mtxWorldBase.copy(mtxWorld);
      };
      this.#undo.push(undo);
    };

    private hndPointerMove = (_event: PointerEvent): void => {
      this.#isTransforming = false;
      this.viewport.canvas.style.cursor = "default";

      if (_event.buttons != 1) {
        const point: ƒ.Vector2 = new ƒ.Vector2(_event.offsetX, _event.offsetY);
        const pick: ƒ.Pick = ƒ.Picker.pickCamera([this], this.camera, this.viewport.pointClientToProjection(point))[0];

        if (pick?.color.equals(this.#colors.base.x) || pick?.color.equals(this.#colors.lite.x))
          this.selected = "x";
        else if (pick?.color.equals(this.#colors.base.y) || pick?.color.equals(this.#colors.lite.y))
          this.selected = "y";
        else if (pick?.color.equals(this.#colors.base.z) || pick?.color.equals(this.#colors.lite.z))
          this.selected = "z";
        else if (pick?.color.equals(this.#colors.base.xyz) || pick?.color.equals(this.#colors.lite.xyz))
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

      const isSnapping: boolean = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.CTRL_LEFT, ƒ.KEYBOARD_CODE.CTRL_RIGHT]);

      this.#isTransforming = true;
      this.viewport.canvas.style.cursor = "grabbing";

      this.#direction.copy(this.getPoint3D(_event).subtract(this.#mtxWorldBase.translation));
      this.#mtxLocal.copy(this.#mtxLocalBase); // reset

      let axis: ƒ.Vector3;
      if (this.selected.length == 1)
        axis = this.#axes[<"x" | "y" | "z">this.selected]();

      switch (this.mode) {
        case "translate":
          const mtxWorldInvserse: ƒ.Matrix4x4 = this.#mtxWorldBase.clone.invert();
          const translation: ƒ.Vector3 = ƒ.Vector3.PROJECTION(this.#direction, axis);
          const translationOffset: ƒ.Vector3 = ƒ.Vector3.PROJECTION(this.#offset, axis);

          translation.subtract(translationOffset);

          if (isSnapping)
            translation.apply((_value: number) => ƒ.Calc.snap(_value, this.snapDistance));

          translation.transform(mtxWorldInvserse, false);

          this.#mtxLocal.translate(translation);

          ƒ.Recycler.storeMultiple(mtxWorldInvserse, translation, translationOffset);
          break;
        case "rotate":
          const rotationInverse: ƒ.Quaternion = this.#mtxWorldBase.quaternion.clone.invert();

          // rotate vectors into local space, this seems to be the most reliable way
          const offsetLocal: ƒ.Vector3 = this.#offset.clone.transform(rotationInverse);
          const directionLocal: ƒ.Vector3 = this.#direction.clone.transform(rotationInverse);
          const axisLocal: ƒ.Vector3 = axis.clone.transform(rotationInverse);

          let angle: number = ƒ.Vector3.ANGLE(offsetLocal, directionLocal);

          if (isSnapping)
            angle = ƒ.Calc.snap(angle, this.snapAngle);

          // Determine the direction of rotation
          const cross: ƒ.Vector3 = ƒ.Vector3.CROSS(offsetLocal, directionLocal);
          if (ƒ.Vector3.DOT(axisLocal, cross) < 0)
            angle = -angle;

          const rotation: ƒ.Quaternion = ƒ.Quaternion.ROTATION(axisLocal, angle);

          if (isSnapping) {
            const directionSnapped: ƒ.Vector3 = offsetLocal
              .transform(rotation) // rotate offset into snapped direction
              .transform(this.#mtxWorldBase.quaternion); // rotate snapped direction back into world space
            this.#direction.copy(directionSnapped);
          }

          this.#mtxLocal.quaternion = this.#mtxLocal.quaternion.multiply(rotation); // only affect rotation, ignore scaling

          ƒ.Recycler.storeMultiple(rotationInverse, offsetLocal, directionLocal, axisLocal, cross, rotation);
          break;
        case "scale":
          let scale: number = this.camera.getWorldToPixelScale(this.#mtxWorld.translation);
          let lengthArrow: number = scale * 80; // TODO: save this somewhere
          if (this.selected == "xyz")
            axis = this.camera.mtxWorld.right.negate();

          let offset: ƒ.Vector3 = ƒ.Vector3.PROJECTION(this.#offset, axis);
          let direction: ƒ.Vector3 = ƒ.Vector3.PROJECTION(this.#direction, axis);
          let signOffset: number = Math.sign(ƒ.Vector3.DOT(axis, offset));
          let signDirection: number = Math.sign(ƒ.Vector3.DOT(axis, direction));

          this.#scaleFactor = (((signDirection * direction.magnitude) - (signOffset * offset.magnitude)) / lengthArrow) + 1;


          if (isSnapping)
            this.#scaleFactor = ƒ.Calc.snap(this.#scaleFactor, this.snapScale);

          const vctScaling: ƒ.Vector3 = ƒ.Vector3.ONE();
          for (const selected of <("x" | "y" | "z")[]><ƒ.General>this.selected)
            vctScaling[selected] = this.#scaleFactor;

          const mtxScaling: ƒ.Matrix4x4 = ƒ.Matrix4x4.SCALING(vctScaling);

          if (this.space == "world") { // rotationInverse * scaling * rotation
            const rotationInverse: ƒ.Quaternion = this.#mtxWorldBase.quaternion.clone.invert();
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

    private hndPointerUp = (): void => {
      if (this.#mtxLocal)
        this.#mtxLocalBase.copy(this.#mtxLocal);
      if (this.#mtxWorld)
        this.#mtxWorldBase.copy(this.#mtxWorld);
      if (this.selected)
        this.selected = null;
      if (this.#isTransforming)
        this.#isTransforming = false;
    };

    private hndRenderEnd = (): void => {
      this.drawGizmos(this.viewport.camera);
    };

    private drawCircle(_torus: ƒ.MeshTorus, _color: ƒ.Color, _direction: ƒ.Vector3, _up: ƒ.Vector3, _radius: number, _alphaOccluded: number): void {
      const mtxWorld: ƒ.Matrix4x4 = this.#mtxWorld.clone;
      const vctScaling: ƒ.Vector3 = ƒ.Recycler.reuse(ƒ.Vector3).set(_radius * 2, _radius * 2, _radius * 2);

      mtxWorld.scaling = vctScaling;
      mtxWorld.lookIn(_direction, _up); // lookIn orientates the z-axis but the toruse lays on the xz-plane (facing in y-direction),
      mtxWorld.rotateX(90);             // thus we rotate the torus so the circle faces in _direction
      // ƒ.Gizmos.drawMesh(this.torusPick, mtxWorld, ƒ.Color.CSS("magenta"), _alphaOccluded);
      ƒ.Gizmos.drawMesh(_torus, mtxWorld, _color, _alphaOccluded);

      ƒ.Recycler.storeMultiple(mtxWorld, vctScaling);
    }

    private getPoint3D(_event: PointerEvent): ƒ.Vector3 {
      const point2D: ƒ.Vector2 = ƒ.Recycler.reuse(ƒ.Vector2).set(_event.offsetX, _event.offsetY);
      const ray: ƒ.Ray = this.viewport.getRayFromClient(point2D);

      ƒ.Recycler.store(point2D);
      return ray.intersectPlane(this.#mtxWorldBase.translation, this.#normal);
    }
  }
}