namespace FudgeAid {
  import ƒ = FudgeCore;

  // TODO: Think about the Transformator and its usage in the Editor (separation of concerns). 
  // Maybe the transformator should be part of the editor after all and handle components directly instead of only matrices.
  // That way no hacky event dispatching/handling would be needed, as instead the transformator could handle everything internally.
  /**
   * Allows to translate, rotate and scale matrices visually by dragging with a pointer. 
   * Installs pointer event listeners on the given {@link ƒ.Viewport}s canvas on construction. 
   * Use {@link addListeners}/{@link removeListeners} to handle the installation manually.
   */
  export class Transformator {
    public readonly viewport: ƒ.Viewport;

    public mode: "none" | "translate" | "rotate" | "scale" = "translate";
    public space: "local" | "world" = "world";
    public selected: "x" | "y" | "z" | "xy" | "xz" | "yz" | "xyz";

    public snapAngle: number = 15; // 15 degree
    public snapDistance: number = 0.1; // 0.1 units
    public snapScale: number = 0.1; // 10%

    public colors = { // eslint-disable-line
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

    #mtxLocal: ƒ.Matrix4x4; // local matrix of the object to be transformed
    #mtxWorld: ƒ.Matrix4x4; // world matrix of the object to be transformed

    #mtxLocalBase: ƒ.Matrix4x4 = ƒ.Matrix4x4.IDENTITY(); // local matrix in a state before a transformation starts
    #mtxWorldBase: ƒ.Matrix4x4 = ƒ.Matrix4x4.IDENTITY(); // world matrix in a state before a transformation starts
    
    /** The normal vector of the plane with which the mouse ray collides */
    #normalCollisionPlane: ƒ.Vector3 = ƒ.Vector3.ZERO();
    /** The vector pointing from the world position to the pointer hit on pointer down. Not normalized - magnitude represents distance. */
    #vctPointerDown: ƒ.Vector3 = ƒ.Vector3.ZERO();
    /** The vector pointing from the world position to the pointer hit on pointer move. Not normalized - magnitude represents distance. */
    #vctPointerMove: ƒ.Vector3 = ƒ.Vector3.ZERO();

    #isTransforming: boolean = false;
    #startTransform: boolean = false;

    #torus: ƒ.MeshTorus;
    #torusPick: ƒ.MeshTorus;

    public constructor(_viewport: ƒ.Viewport) {
      this.viewport = _viewport;
      this.addListeners();
      this.#torus = new ƒ.MeshTorus("Torus", 80, 0.75, 60, 8); // 80 logical pixel ring radius, 0.75 logical pixel tube radius
      this.#torusPick = new ƒ.MeshTorus("TorusPick", 80, 5, 60, 8);
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

    public drawGizmos(_cmpCamera: ƒ.ComponentCamera, _picking: boolean): void {
      if (!this.#mtxLocal || !this.#mtxWorld)
        return;

      if (this.space == "local" && (this.#mtxWorld.scaling.x == 0 || this.#mtxWorld.scaling.y == 0 || this.#mtxWorld.scaling.z == 0))
        return;

      const world2Pixel: number = _cmpCamera.getWorldToPixelScale(this.#mtxWorld.translation);

      const translateArrowWidth: number = world2Pixel * (_picking ? 10 : 1);
      const translateArrowLength: number = world2Pixel * (_picking ? 90 : 80);
      const translateArrowSize: number = world2Pixel * 14;

      const scaleArrowWidth: number = world2Pixel * (_picking ? 10 : 1);
      const scaleArrowLength: number = world2Pixel * (_picking ? 83 : 73);
      const scaleArrowSize: number = world2Pixel * 7;
      const scaleCubeSize: number = world2Pixel * (_picking ? 20 : 10);

      const clrAxes: Record<"x" | "y" | "z", ƒ.Color> = {
        x: this.selected == "x" && !this.#isTransforming ? this.colors.lite.x : this.colors.base.x,
        y: this.selected == "y" && !this.#isTransforming ? this.colors.lite.y : this.colors.base.y,
        z: this.selected == "z" && !this.#isTransforming ? this.colors.lite.z : this.colors.base.z
      };

      const clrPlanes: Record<"xy" | "xz" | "yz", ƒ.Color> = {
        xy: this.selected == "xy" && !this.#isTransforming ? this.colors.planeLite.xy : this.colors.plane.xy,
        xz: this.selected == "xz" && !this.#isTransforming ? this.colors.planeLite.xz : this.colors.plane.xz,
        yz: this.selected == "yz" && !this.#isTransforming ? this.colors.planeLite.yz : this.colors.plane.yz
      };

      const axes: Record<"x" | "y" | "z", ƒ.Vector3> = {
        x: this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorld.getRight(),
        y: this.space == "world" ? ƒ.Vector3.Y() : this.#mtxWorld.getUp(),
        z: this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorld.getForward()
      };

      const normals: Record<"x" | "y" | "z", ƒ.Vector3> = {
        x: this.space == "world" ? ƒ.Vector3.Z() : this.#mtxWorld.getForward(),
        y: this.space == "world" ? ƒ.Vector3.X() : this.#mtxWorld.getRight(),
        z: this.space == "world" ? ƒ.Vector3.Y() : this.#mtxWorld.getUp()
      };

      const mtxWorldNormalized: ƒ.Matrix4x4 = this.space == "world" ? ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation) : this.#mtxWorld.clone;
      mtxWorldNormalized.scale(mtxWorldNormalized.scaling.map(_value => 1 / _value));



      switch (this.mode) {
        case "translate":
          // draw the axes
          for (const axis of ["x", "y", "z"] as const)
            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrAxes[axis], axes[axis], normals[axis], translateArrowLength, translateArrowWidth, translateArrowSize, ƒ.MeshPyramid, 0);

          // draw the planes
          for (const [axis, plane] of [["z", "xy"], ["y", "xz"], ["x", "yz"]] as const) {
            if (this.#isTransforming && this.selected != plane)
              continue;

            const mtxQuad: ƒ.Matrix4x4 = mtxWorldNormalized.clone;
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
            const world2PixelBase: number = _cmpCamera.getWorldToPixelScale(this.#mtxWorldBase.translation);
            for (const selected of this.selected)  //@ts-ignore
              ƒ.Gizmos.drawArrow(this.#mtxWorldBase.translation, this.colors.transparent[selected], axes[selected], normals[selected], world2PixelBase * 80, world2PixelBase * 1, world2PixelBase * 14, ƒ.MeshPyramid, 0);
          }

          break;
        case "rotate":
          if (this.#isTransforming && (this.selected == "x" || this.selected == "y" || this.selected == "z")) {
            const directionPointerMove: ƒ.Vector3 = ƒ.Vector3.NORMALIZATION(this.#vctPointerMove);
            const directionPointerDown: ƒ.Vector3 = ƒ.Vector3.NORMALIZATION(this.#vctPointerDown);
            this.drawCircle(this.#torus, this.colors.base[this.selected], axes[this.selected], normals[this.selected], world2Pixel, 0);
            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.colors.base[this.selected], directionPointerMove, axes[this.selected], translateArrowLength, translateArrowWidth, translateArrowSize, ƒ.MeshPyramid, 0);
            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, this.colors.transparent[this.selected], directionPointerDown, axes[this.selected], translateArrowLength, translateArrowWidth, translateArrowSize, ƒ.MeshPyramid, 0);
            ƒ.Recycler.store(directionPointerMove);
            ƒ.Recycler.store(directionPointerDown);
            break;
          }

          // draw an invisible quad to occlude the tori
          const mtxQuad: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
          const direction: ƒ.Vector3 = _cmpCamera.mtxWorld.getForward().negate();
          mtxQuad.scaling = ƒ.Vector3.ONE(translateArrowLength * 2);
          mtxQuad.lookIn(direction);
          ƒ.Render.setColorWriteMask(false, false, false, false);
          ƒ.Gizmos.drawQuad(mtxQuad, this.colors.base.x, 0); // color doesn't matter
          ƒ.Render.setColorWriteMask(true, true, true, true);

          // draw the tori
          let torus: ƒ.MeshTorus = _picking ? this.#torusPick : this.#torus;

          for (const axis of ["x", "y", "z"] as const)
            this.drawCircle(torus, clrAxes[axis], axes[axis], normals[axis], world2Pixel, 0);

          ƒ.Recycler.store(mtxQuad);
          ƒ.Recycler.store(direction);
          break;
        case "scale":
          for (const axis of ["x", "y", "z"] as const) {
            let factor: number = this.#mtxLocal.scaling[axis] / this.#mtxLocalBase.scaling[axis];
            if (this.space == "local")
              factor = Math.abs(factor);
            ƒ.Gizmos.drawArrow(this.#mtxWorld.translation, clrAxes[axis], axes[axis], normals[axis], scaleArrowLength * factor, scaleArrowWidth, scaleArrowSize, ƒ.MeshCube, 0);
          }

          const mtxCube: ƒ.Matrix4x4 = mtxWorldNormalized.clone;
          mtxCube.scale(mtxCube.scaling.set(scaleCubeSize, scaleCubeSize, scaleCubeSize));
          ƒ.Gizmos.drawCube(mtxCube, this.selected == "xyz" ? this.colors.lite.xyz : this.colors.base.xyz, 1);
          ƒ.Recycler.store(mtxCube);
          break;
      }

      ƒ.Recycler.store(mtxWorldNormalized);
    }

    private hndPointerDown = (_event: PointerEvent): void => {
      if (!this.camera || !this.viewport || !this.selected || !this.#mtxLocal || !this.#mtxWorld)
        return;

      this.viewport.canvas.style.cursor = "grabbing";

      this.#mtxLocalBase.copy(this.#mtxLocal);
      this.#mtxWorldBase.copy(this.#mtxWorld);

      if (this.selected == "x" || this.selected == "y" || this.selected == "z") {
        if (this.mode == "rotate") {
          this.#normalCollisionPlane.copy(this.getAxis(this.selected));
        } else {
          const mtxNormal: ƒ.Matrix4x4 = ƒ.Matrix4x4.LOOK_AT(this.#mtxWorld.translation, this.camera.mtxWorld.translation, this.getAxis(this.selected), true);
          this.#normalCollisionPlane.copy(mtxNormal.getForward()); // normal of the plane the mouse ray will collide with
          ƒ.Recycler.store(mtxNormal);
        }
      } else if (this.selected == "xyz") {
        this.#normalCollisionPlane.copy(this.camera.mtxWorld.getForward().negate());
      } else {
        const axis: string = "xyz".replace(this.selected[0], "").replace(this.selected[1], "");
        this.#normalCollisionPlane.copy(this.getAxis(<"x" | "y" | "z">axis));
      }

      const point: ƒ.Vector3 = this.getPoint3D(_event);
      ƒ.Vector3.DIFFERENCE(point, this.#mtxWorld.translation, this.#vctPointerDown);
      this.#vctPointerMove.copy(this.#vctPointerDown);

      ƒ.Recycler.store(point);

      this.#startTransform = true;
    };

    private hndPointerMove = (_event: PointerEvent): void => {
      this.#isTransforming = false;
      this.viewport.canvas.style.cursor = "default";

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

        if (this.selected)
          this.viewport.canvas.style.cursor = "grab";

        ƒ.Recycler.store(point);

        return;
      }

      if (!this.camera || !this.viewport || !this.selected || !this.#mtxLocal || !this.#mtxWorld)
        return;

      this.viewport.canvas.style.cursor = "grabbing";

      const isSnapping: boolean = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.CTRL_LEFT, ƒ.KEYBOARD_CODE.CTRL_RIGHT]);

      this.#isTransforming = true;
      if (this.#startTransform == true) {
        this.#startTransform = false;
        this.viewport.canvas.dispatchEvent(new Event("startTransform", { bubbles: true }));
      }

      ƒ.Vector3.DIFFERENCE(this.getPoint3D(_event), this.#mtxWorldBase.translation, this.#vctPointerMove);
      this.#mtxLocal.copy(this.#mtxLocalBase); // reset

      let axis: ƒ.Vector3;
      if (this.selected == "x" || this.selected == "y" || this.selected == "z")
        axis = this.getAxis(this.selected);

      const mtxWorldInverse: ƒ.Matrix4x4 = this.#mtxWorldBase.clone.invert();
      switch (this.mode) {
        case "translate":
          const translation: ƒ.Vector3 = this.selected.length == 1 ? ƒ.Vector3.PROJECTION(this.#vctPointerMove, axis) : this.#vctPointerMove.clone;
          const translationPointerDown: ƒ.Vector3 = this.selected.length == 1 ? ƒ.Vector3.PROJECTION(this.#vctPointerDown, axis) : this.#vctPointerDown.clone;

          translation.subtract(translationPointerDown);

          if (isSnapping)
            translation.apply((_value: number) => ƒ.Calc.snap(_value, this.snapDistance));

          translation.transform(mtxWorldInverse, false);

          this.#mtxLocal.translate(translation);
          // restore scaling directions
          this.#mtxLocal.scaling = this.#mtxLocal.scaling.apply((_value, _index, _component) => _value * Math.sign(this.#mtxLocalBase.scaling[_component]));
          
          ƒ.Recycler.store(mtxWorldInverse);
          ƒ.Recycler.store(translation);
          ƒ.Recycler.store(translationPointerDown);

          break;
        case "rotate":
          let angle: number = ƒ.Vector3.ANGLE(this.#vctPointerDown, this.#vctPointerMove);

          if (isSnapping)
            angle = ƒ.Calc.snap(angle, this.snapAngle);

          const cross: ƒ.Vector3 = ƒ.Vector3.CROSS(this.#vctPointerDown, this.#vctPointerMove);
          if (ƒ.Vector3.DOT(axis, cross) < 0)
            angle = -angle;

          // const qRotation: ƒ.Quaternion = ƒ.Quaternion.ROTATION_AXIS_ANGLE(axis, angle);
          const mtxRotation: ƒ.Matrix4x4 = ƒ.Matrix4x4.ROTATION_AXIS_ANGLE(axis, angle);

          if (isSnapping) { // rotate directionPointerDown into snapped direction
            this.#vctPointerMove.copy(this.#vctPointerDown);
            this.#vctPointerMove.transform(mtxRotation);
          }

          const mtxLocalInverse: ƒ.Matrix4x4 = ƒ.Matrix4x4.INVERSE(this.#mtxLocalBase);
          const mtxParentWorld: ƒ.Matrix4x4 = ƒ.Matrix4x4.PRODUCT(this.#mtxWorldBase, mtxLocalInverse);
          const mtxParentWorldInverse: ƒ.Matrix4x4 = mtxParentWorld.clone.invert();

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
          let scale: number = this.camera.getWorldToPixelScale(this.#mtxWorld.translation);
          let lengthArrow: number = scale * 80; // TODO: save this somewhere
          if (this.selected == "xyz")
            axis = this.camera.mtxWorld.getRight().negate();

          let offset: ƒ.Vector3 = ƒ.Vector3.PROJECTION(this.#vctPointerDown, axis);
          let direction: ƒ.Vector3 = ƒ.Vector3.PROJECTION(this.#vctPointerMove, axis);
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

          ƒ.Recycler.store(mtxScaling);
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
      if (this.#isTransforming) {
        this.#isTransforming = false;
        this.viewport.canvas.dispatchEvent(new Event("endTransform", { bubbles: true }));
      }
      this.#startTransform = false;
    };

    private hndRenderEnd = (): void => {
      ƒ.Render.clear(undefined, false, true); // clear depth buffer
      ƒ.Gizmos.draw([this], this.viewport.camera);
    };

    private drawCircle(_torus: ƒ.MeshTorus, _color: ƒ.Color, _direction: ƒ.Vector3, _up: ƒ.Vector3, _world2Pixel: number, _alphaOccluded: number): void {
      const mtxWorld: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.#mtxWorld.translation);
      mtxWorld.scaling.set(_world2Pixel, _world2Pixel, _world2Pixel);
      mtxWorld.scaling = mtxWorld.scaling;
      mtxWorld.lookIn(_direction, _up); // lookIn orientates the z-axis but the toruse lays on the xz-plane (facing in y-direction),
      mtxWorld.rotateX(90);             // thus we rotate the torus so the circle faces in _direction
      ƒ.Gizmos.drawMesh(_torus, mtxWorld, _color, _alphaOccluded);
      ƒ.Recycler.store(mtxWorld);
    }

    private getPoint3D(_event: PointerEvent): ƒ.Vector3 {
      const point2D: ƒ.Vector2 = ƒ.Recycler.reuse(ƒ.Vector2).set(_event.offsetX, _event.offsetY);
      const ray: ƒ.Ray = this.viewport.getRayFromClient(point2D);
      ƒ.Recycler.store(point2D);

      return ray.intersectPlane(this.#mtxWorldBase.translation, this.#normalCollisionPlane);
    }

    private getAxis(_axis: "x" | "y" | "z"): ƒ.Vector3 {
      if (this.space == "world") {
        switch (_axis) {
          case "x": return ƒ.Vector3.X();
          case "y": return ƒ.Vector3.Y();
          case "z": return ƒ.Vector3.Z();
        }
      } else {
        switch (_axis) {
          case "x": return this.#mtxWorldBase.getRight();
          case "y": return this.#mtxWorldBase.getUp();
          case "z": return this.#mtxWorldBase.getForward();
        }
      }
    }
  }
}