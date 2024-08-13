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
    public selected: "x" | "y" | "z" | "xy" | "xz" | "yz" | "xyz";

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
    // #scaleFactor: number; // current scale factor of the scaling transformation

    #isTransforming: boolean = false;

    #axes: Record<"x" | "y" | "z", () => ƒ.Vector3> = {
      x: () => this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorldBase.right,
      y: () => this.space == "world" ? ƒ.Vector3.Y() : this.#mtxWorldBase.up,
      z: () => this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorldBase.forward
    };

    #normals: Record<"x" | "y" | "z", () => ƒ.Vector3> = {
      x: () => this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorldBase.forward,
      y: () => this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorldBase.right,
      z: () => this.space == "world" ? ƒ.Vector3.Y() : this.#mtxWorldBase.up
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
      const world2Pixel: number = _cmpCamera.getWorldToPixelScale(this.#mtxWorld.translation);

      const pyramidArrowWidth: number = world2Pixel * (isPicking ? 10 : 1);
      const pyramidArrowLength: number = world2Pixel * (isPicking ? 90 : 80);
      const pyramidArrowSize: number = world2Pixel * 14;

      const circleRadius: number = world2Pixel * 80; // 80 pixels radius

      const cubeArrowWidth: number = world2Pixel * (isPicking ? 10 : 1);
      const cubeArrowLength: number = world2Pixel * (isPicking ? 83 : 73);
      const cubeArrowHead: number = world2Pixel * 7;
      const cubeSize: number = world2Pixel * (isPicking ? 20 : 10);

      const clrAxes: Record<"x" | "y" | "z", ƒ.Color> = {
        x: this.selected == "x" && !this.#isTransforming ? this.#colors.lite.x : this.#colors.base.x,
        y: this.selected == "y" && !this.#isTransforming ? this.#colors.lite.y : this.#colors.base.y,
        z: this.selected == "z" && !this.#isTransforming ? this.#colors.lite.z : this.#colors.base.z
      };

      const clrPlanes: Record<"xy" | "xz" | "yz", ƒ.Color> = {
        xy: this.selected == "xy" && !this.#isTransforming ? this.#colors.planeLite.xy : this.#colors.plane.xy,
        xz: this.selected == "xz" && !this.#isTransforming ? this.#colors.planeLite.xz : this.#colors.plane.xz,
        yz: this.selected == "yz" && !this.#isTransforming ? this.#colors.planeLite.yz : this.#colors.plane.yz
      };

      switch (this.mode) {
        case "translate":

          // draw the axes
          for (const axis of ["x", "y", "z"] as const)
            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrAxes[axis], this.#axes[axis](), this.#normals[axis](), pyramidArrowLength, pyramidArrowWidth, pyramidArrowSize, ƒ.MeshPyramid, 1);

          // draw the planes
          for (const [axis, plane] of [["z", "xy"], ["y", "xz"], ["x", "yz"]] as const) {
            if (this.#isTransforming && this.selected != plane)
              continue;

            const mtxWorld: ƒ.Matrix4x4 = ƒ.Matrix4x4.LOOK_IN(this.#mtxWorld.translation, this.#axes[axis](), this.#normals[axis]());
            mtxWorld.translate(new ƒ.Vector3(world2Pixel * 20, world2Pixel * 20, 0)); // move 20 px
            mtxWorld.scaling = ƒ.Vector3.ONE(world2Pixel * (isPicking ? 20 : 10)); // scale to size of 20 or 10 px          
            ƒ.Gizmos.drawSprite(mtxWorld, clrPlanes[plane], 1);
          }

          // draw afterimages
          if (this.#isTransforming) {
            const world2PixelBase: number = _cmpCamera.getWorldToPixelScale(this.#mtxWorldBase.translation);
            for (const selected of this.selected)  //@ts-ignore
              ƒ.Gizmos.drawArrow(this.#mtxWorldBase.translation, this.#colors.transparent[selected], this.#axes[selected](), this.#normals[selected](), world2PixelBase * 80, world2PixelBase * 1, world2PixelBase * 14, ƒ.MeshPyramid, 1);
            // ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, ƒ.Color.CSS("magenta"), this.#normal, this.#axes[this.selected](), lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
          }

          break;
        case "rotate":
          if (this.#isTransforming && (this.selected == "x" || this.selected == "y" || this.selected == "z")) {
            this.drawCircle(this.#torus, this.#colors.base[this.selected], this.#axes[this.selected](), this.#normals[this.selected](), circleRadius, 1);
            // ƒ.Gizmos.drawArrow(this.mtxWorld.translation, this.colorsLight[this.selected], this.move, this.axes[this.selected], this.move.magnitude, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors.base[this.selected], this.#direction, this.#axes[this.selected](), circleRadius, pyramidArrowWidth, pyramidArrowSize, ƒ.MeshPyramid, 1);
            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.#colors.transparent[this.selected], this.#offset, this.#axes[this.selected](), circleRadius, pyramidArrowWidth, pyramidArrowSize, ƒ.MeshPyramid, 1);

            break;
          }

          // draw an invisible quad to occlude the tori
          const mtxQuad: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
          const direction: ƒ.Vector3 = _cmpCamera.mtxWorld.forward.negate();
          mtxQuad.scaling = ƒ.Vector3.ONE(circleRadius * 2);
          mtxQuad.lookIn(direction);

          ƒ.Render.setDepthFunction(ƒ.DEPTH_FUNCTION.ALWAYS);
          ƒ.Render.setColorWriteMask(false, false, false, false);
          ƒ.Gizmos.drawQuad(mtxQuad, this.#colors.base.x, 0); // color doesn't matter
          ƒ.Render.setColorWriteMask(true, true, true, true);
          ƒ.Render.setDepthFunction(ƒ.DEPTH_FUNCTION.LESS);

          // draw the tori
          let torus: ƒ.MeshTorus = isPicking ? this.#torusPick : this.#torus;
          this.drawCircle(torus, clrAxes.x, this.#axes.x(), this.#normals.x(), circleRadius, 0);
          this.drawCircle(torus, clrAxes.y, this.#axes.y(), this.#normals.y(), circleRadius, 0);
          this.drawCircle(torus, clrAxes.z, this.#axes.z(), this.#normals.z(), circleRadius, 0);

          ƒ.Recycler.storeMultiple(mtxQuad, direction);

          break;
        case "scale":
          for (const axis of ["x", "y", "z"] as const) {
            const factor: number = this.#mtxLocal.scaling[axis] / this.#mtxLocalBase.scaling[axis];
            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrAxes[axis], this.#axes[axis](), this.#normals[axis](), cubeArrowLength * factor, cubeArrowWidth, cubeArrowHead, ƒ.MeshCube, 1);
          }

          const mtxCube: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation, this.space == "local" ? this.#mtxWorld.rotation : null);
          mtxCube.scaling = mtxCube.scaling.set(cubeSize, cubeSize, cubeSize);
          ƒ.Gizmos.drawCube(mtxCube, this.selected == "xyz" ? this.#colors.lite.xyz : this.#colors.base.xyz, 1);
          ƒ.Recycler.store(mtxCube);
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
      } else {
        switch (this.selected) {
          case "xy":
            this.#normal.copy(this.#axes.z());
            break;
          case "xz":
            this.#normal.copy(this.#axes.y());
            break;
          case "yz":
            this.#normal.copy(this.#axes.x());
            break;
        }
      }

      const point: ƒ.Vector3 = this.getPoint3D(_event);
      this.#offset.copy(point.subtract(this.#mtxWorld.translation));

      ƒ.Recycler.store(point);

      // create undo function
      const mtxLocal: ƒ.Matrix4x4 = this.#mtxLocal;
      const mutatorLocal: ƒ.Mutator = mtxLocal.getMutator();
      // const mtxWorld: ƒ.Matrix4x4 = this.#mtxWorld;
      // const mutatorWorld: ƒ.Mutator = mtxWorld.getMutator();
      let undo: () => void = () => {
        mtxLocal.mutate(mutatorLocal);
        // mtxWorld.mutate(mutatorWorld);
        if (this.#mtxLocal == mtxLocal)
          this.#mtxLocalBase.copy(mtxLocal);
        // TODO: find a way to copy the world matrix after it has been recalculated...
        // if (this.#mtxWorld == mtxWorld)
        //   this.#mtxWorldBase.copy(mtxWorld);
      };
      this.#undo.push(undo);
    };

    private hndPointerMove = (_event: PointerEvent): void => {
      this.#isTransforming = false;
      // this.viewport.canvas.style.cursor = "default";

      if (_event.buttons != 1) {
        const point: ƒ.Vector2 = new ƒ.Vector2(_event.offsetX, _event.offsetY);
        const pick: ƒ.Pick = ƒ.Picker.pickCamera([this], this.camera, this.viewport.pointClientToProjection(point))[0];

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

      const isSnapping: boolean = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.CTRL_LEFT, ƒ.KEYBOARD_CODE.CTRL_RIGHT]);

      this.#isTransforming = true;

      this.#direction.copy(this.getPoint3D(_event).subtract(this.#mtxWorldBase.translation));
      this.#mtxLocal.copy(this.#mtxLocalBase); // reset

      let axis: ƒ.Vector3;
      if (this.selected == "x" || this.selected == "y" || this.selected == "z")
        axis = this.#axes[this.selected]();

      switch (this.mode) {
        case "translate":
          const mtxWorldInverse: ƒ.Matrix4x4 = this.#mtxWorldBase.clone.invert();

          const translation: ƒ.Vector3 = this.selected.length == 1 ? ƒ.Vector3.PROJECTION(this.#direction, axis) : this.#direction.clone;
          const translationOffset: ƒ.Vector3 = this.selected.length == 1 ? ƒ.Vector3.PROJECTION(this.#offset, axis) : this.#offset.clone;

          translation.subtract(translationOffset);

          if (isSnapping)
            translation.apply((_value: number) => ƒ.Calc.snap(_value, this.snapDistance));

          translation.transform(mtxWorldInverse, false);

          this.#mtxLocal.translate(translation);

          ƒ.Recycler.storeMultiple(mtxWorldInverse, translation, translationOffset);
          break;
        case "rotate":
          let angle: number = ƒ.Vector3.ANGLE(this.#offset, this.#direction);

          if (isSnapping)
            angle = ƒ.Calc.snap(angle, this.snapAngle);

          const cross: ƒ.Vector3 = ƒ.Vector3.CROSS(this.#offset, this.#direction);
          if (ƒ.Vector3.DOT(axis, cross) < 0)
            angle = -angle;

          const rotationWorld: ƒ.Quaternion = ƒ.Quaternion.ROTATION(axis, angle);

          if (isSnapping) { // rotate offset into snapped direction
            this.#direction.copy(this.#offset);
            this.#direction.transform(rotationWorld); 
          }

          const mtxLocal: ƒ.Matrix4x4 = this.#mtxLocalBase.clone;
          const mtxRotation: ƒ.Matrix4x4 = ƒ.Matrix4x4.ROTATION(rotationWorld);

          // localRotation = worldInverse * worldRotation * world
          mtxRotation.multiply(ƒ.Matrix4x4.INVERSE(this.#mtxWorldBase), true);
          mtxRotation.multiply(this.#mtxWorldBase);

          mtxLocal.multiply(mtxRotation);
          // restore scaling directions
          mtxLocal.scaling = mtxLocal.scaling.apply((_value, _index, _component) => _value * Math.sign(this.#mtxLocalBase.scaling[_component]));

          this.#mtxLocal.quaternion = mtxLocal.quaternion;
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

          let factor: number = (((signDirection * direction.magnitude) - (signOffset * offset.magnitude)) / lengthArrow) + 1;

          if (isSnapping)
            factor = ƒ.Calc.snap(factor, this.snapScale);

          const mtxScaling: ƒ.Matrix4x4 = ƒ.Matrix4x4.IDENTITY();

          for (const selected of <("x" | "y" | "z")[]><ƒ.General>this.selected)
            mtxScaling.scaling[selected] = factor;

          mtxScaling.scaling = mtxScaling.scaling;

          if (this.space == "world") { // rotationInverse * scaling * rotation
            const rotationInverse: ƒ.Quaternion = this.#mtxWorldBase.quaternion.clone.invert();
            mtxScaling.rotate(rotationInverse, true);
            mtxScaling.rotate(this.#mtxWorldBase.quaternion);
            ƒ.Recycler.store(rotationInverse);

          }
          mtxScaling.multiply(this.#mtxLocal, true);

          // restore scaling directions
          mtxScaling.scaling.apply((_value, _index, _component) => _value * Math.sign(this.#mtxLocal.scaling[_component]));

          for (const selected of <("x" | "y" | "z")[]><ƒ.General>this.selected)
            mtxScaling.scaling[selected] *= Math.sign(factor);

          this.#mtxLocal.scaling = mtxScaling.scaling;

          ƒ.Recycler.storeMultiple(mtxScaling);
          break;
      }

      if (axis)
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
      ƒ.Gizmos.draw([this], this.viewport.camera);
      // this.drawGizmos(this.viewport.camera);
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