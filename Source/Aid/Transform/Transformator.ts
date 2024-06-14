namespace FudgeAid {
  import ƒ = FudgeCore;

  export class Transformator {
    public viewport: ƒ.Viewport;

    public mode: "translate" | "rotate" | "scale" = "translate";
    public space: "local" | "world" = "world";
    public selected: "x" | "y" | "z";

    public mtxLocal: ƒ.Matrix4x4;
    public mtxWorld: ƒ.Matrix4x4;

    private mtxLocalBase: ƒ.Matrix4x4 = ƒ.Matrix4x4.IDENTITY();
    private mtxWorldBase: ƒ.Matrix4x4 = ƒ.Matrix4x4.IDENTITY();

    private readonly offset: ƒ.Vector3 = ƒ.Vector3.ZERO();
    private readonly direction: ƒ.Vector3 = ƒ.Vector3.ZERO();
    private scale: number;

    private isPicking: boolean = false;
    private isTransforming: boolean = false;

    private colors = { // eslint-disable-line
      x: ƒ.Color.CSS("red"),
      y: ƒ.Color.CSS("limegreen"),
      z: ƒ.Color.CSS("blue"),
      origin: ƒ.Color.CSS("gray", 0.7)
    };

    private colorsLight = { // eslint-disable-line
      x: ƒ.Color.CSS("salmon"),
      y: ƒ.Color.CSS("lightgreen"),
      z: ƒ.Color.CSS("cornflowerblue")
    };

    private axes = { // eslint-disable-line
      x: ƒ.Vector3.X(1),
      y: ƒ.Vector3.Y(1),
      z: ƒ.Vector3.Z(1)
    };

    private normals = { // eslint-disable-line
      x: this.axes.z,
      y: this.axes.x,
      z: this.axes.x
    };

    private readonly normal: ƒ.Vector3 = ƒ.Vector3.ZERO();

    private torus: ƒ.MeshTorus;
    private torusPick: ƒ.MeshTorus;

    public constructor(_viewport: ƒ.Viewport) {
      this.viewport = _viewport;
      this.addListeners();
      this.torus = new ƒ.MeshTorus("Torus", 0.5 - 0.0005, 0.005, 60, 8);
      this.torusPick = new ƒ.MeshTorus("TorusPick", 0.5 - 0.003, 0.03, 60, 8);
      ƒ.Project.deregister(this.torus);
      ƒ.Project.deregister(this.torusPick);
    }

    private get camera(): ƒ.ComponentCamera {
      return this.viewport.camera;
    }

    public drawGizmos(_cmpCamera: ƒ.ComponentCamera): void {
      if (!this.mtxLocal)
        return;

      let scale: number = _cmpCamera.getWorldToPixelScale(this.mtxWorld.translation);
      let widthArrow: number = scale * (this.isPicking ? 10 : 1); // 10 or 1 pixel wide;
      let lengthArrow: number;
      let sizeHead: number;

      if (this.isTransforming) {
        const mtx: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.mtxWorld.translation);
        const line: ƒ.Vector3[] = [] = [ƒ.Vector3.Z(-1000), ƒ.Vector3.Z(1000)];

        ƒ.Gizmos.drawLines(line, mtx.lookIn(this.axes[this.selected], this.normals[this.selected]), this.colorsLight[this.selected], 1);
        ƒ.Recycler.storeMultiple(mtx, line[0], line[1]);
      }

      let clrX: ƒ.Color = this.selected == "x" && !this.isTransforming ? this.colorsLight[this.selected] : this.colors.x;
      let clrY: ƒ.Color = this.selected == "y" && !this.isTransforming ? this.colorsLight[this.selected] : this.colors.y;
      let clrZ: ƒ.Color = this.selected == "z" && !this.isTransforming ? this.colorsLight[this.selected] : this.colors.z;
      switch (this.mode) {
        case "translate":
          lengthArrow = scale * (this.isPicking ? 90 : 80); // 80 pixels long
          sizeHead = scale * 12; // 12 pixels wide
          ƒ.Gizmos.drawArrow(this.mtxWorld.translation, clrX, this.axes.x, this.normals.x, lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
          ƒ.Gizmos.drawArrow(this.mtxWorld.translation, clrY, this.axes.y, this.normals.y, lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
          ƒ.Gizmos.drawArrow(this.mtxWorld.translation, clrZ, this.axes.z, this.normals.z, lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
          if (this.isTransforming) {
            let scaleOrigin: number = _cmpCamera.getWorldToPixelScale(this.mtxWorldBase.translation);
            ƒ.Gizmos.drawArrow(this.mtxWorldBase.translation, this.colors.origin, this.axes[this.selected], this.normals[this.selected], scaleOrigin * 80, scaleOrigin * 1, scaleOrigin * 12, ƒ.MeshPyramid, 1);
          }
          // ƒ.Gizmos.drawArrow(this.mtxWorld.translation, ƒ.Color.CSS("magenta"), this.normal, this.axes[this.selected], lengthArrow, widthArrow, sizeHead, ƒ.MeshPyramid, 1);

          break;
        case "rotate":
          let radius: number = scale * 80; // 80 pixels radius
          sizeHead = scale * 12;

          if (this.isTransforming) {
            this.drawCircle(this.colors[this.selected], this.axes[this.selected], this.normals[this.selected], radius, 1);
            ƒ.Gizmos.drawArrow(this.mtxWorld.translation, this.colors.origin, this.offset, this.axes[this.selected], radius, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
            // ƒ.Gizmos.drawArrow(this.mtxWorld.translation, this.colorsLight[this.selected], this.move, this.axes[this.selected], this.move.magnitude, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
            ƒ.Gizmos.drawArrow(this.mtxWorld.translation, this.colors[this.selected], this.direction, this.axes[this.selected], radius, widthArrow, sizeHead, ƒ.MeshPyramid, 1);
            break;
          }

          // draw an invisible quad to occlude the tori
          const mtxQuad: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.mtxWorld.translation);
          const direction: ƒ.Vector3 = _cmpCamera.mtxWorld.forward.negate();
          mtxQuad.scaling = ƒ.Vector3.ONE(radius * 2);
          mtxQuad.lookIn(direction);
          ƒ.Recycler.storeMultiple(mtxQuad, direction);

          ƒ.Render.setDepthFunction(ƒ.DEPTH_FUNCTION.ALWAYS);
          ƒ.Render.setColorWriteMask(false, false, false, false);
          ƒ.Gizmos.drawQuad(mtxQuad, this.colors.x); // color doesn't matter
          ƒ.Render.setColorWriteMask(true, true, true, true);
          ƒ.Render.setDepthFunction(ƒ.DEPTH_FUNCTION.LESS);

          // draw the tori
          this.drawCircle(clrX, this.axes.x, this.normals.x, radius, 0);
          this.drawCircle(clrY, this.axes.y, this.normals.y, radius, 0);
          this.drawCircle(clrZ, this.axes.z, this.normals.z, radius, 0);

          break;
        case "scale":
          lengthArrow = scale * (this.isPicking ? 84 : 74);
          sizeHead = scale * 6;

          if (this.isTransforming) {
            // ƒ.Gizmos.drawArrow(this.mtxWorld.translation, this.colorsLight[this.selected], this.direction, this.normals[this.selected], this.direction.magnitude, widthArrow, sizeHead, ƒ.MeshCube, 1);
            ƒ.Gizmos.drawArrow(this.mtxWorld.translation, this.colors[this.selected], this.axes[this.selected], this.normals[this.selected], lengthArrow * this.scale, widthArrow, sizeHead, ƒ.MeshCube, 1);
            ƒ.Gizmos.drawArrow(this.mtxWorld.translation, this.colors.origin, this.axes[this.selected], this.normals[this.selected], lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
            break;
          }

          ƒ.Gizmos.drawArrow(this.mtxWorld.translation, clrX, this.axes.x, this.normals.x, lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
          ƒ.Gizmos.drawArrow(this.mtxWorld.translation, clrY, this.axes.y, this.normals.y, lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
          ƒ.Gizmos.drawArrow(this.mtxWorld.translation, clrZ, this.axes.z, this.normals.z, lengthArrow, widthArrow, sizeHead, ƒ.MeshCube, 1);
          break;
      }
    }

    private hndPointerDown = (_event: PointerEvent): void => {
      if (!this.camera || !this.viewport || !this.selected)
        return;

      this.mtxLocalBase.copy(this.mtxLocal);
      this.mtxWorldBase.copy(this.mtxWorld);

      const mtxNormal: ƒ.Matrix4x4 = ƒ.Matrix4x4.LOOK_AT(this.mtxWorld.translation, this.camera.mtxWorld.translation, this.axes[this.selected], true);
      this.normal.copy(mtxNormal.forward);

      const point: ƒ.Vector3 = this.getPoint3D(_event);
      this.offset.copy(point.subtract(this.mtxWorld.translation));

      ƒ.Recycler.storeMultiple(mtxNormal, point);
    };

    private hndPointerMove = (_event: PointerEvent): void => {
      this.isTransforming = false;
      this.viewport.canvas.style.cursor = "default";

      if (_event.buttons != 1) {
        let point: ƒ.Vector2 = new ƒ.Vector2(_event.offsetX, _event.offsetY);
        this.isPicking = true;
        let pick: ƒ.Pick = ƒ.Picker.pickCamera([this], this.camera, this.viewport.pointClientToProjection(point))[0];
        this.isPicking = false;

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

        return;
      }

      if (this.selected) {
        this.isTransforming = true;
        this.viewport.canvas.style.cursor = "grabbing";

        const point: ƒ.Vector3 = this.getPoint3D(_event);
        this.direction.copy(point.subtract(this.mtxWorldBase.translation));
        ƒ.Recycler.store(point);
        this.mtxLocal.copy(this.mtxLocalBase);

        switch (this.mode) {
          case "translate":
            let mtxWorldInvserse: ƒ.Matrix4x4 = this.mtxWorldBase.clone.invert();
            let translation: ƒ.Vector3 = this.direction.clone.project(this.axes[this.selected]);
            let translationOffset: ƒ.Vector3 = this.offset.clone.project(this.axes[this.selected]);
            translation.subtract(translationOffset);
            translation.transform(mtxWorldInvserse, false);

            this.mtxLocal.translate(translation);
            break;
          case "rotate":
            let quaternionInverse: ƒ.Quaternion = this.mtxWorldBase.quaternion.clone.invert();

            let offset: ƒ.Vector3 = this.offset.clone.transform(quaternionInverse);
            let direction: ƒ.Vector3 = this.direction.clone.transform(quaternionInverse);
            let angle: number = ƒ.Vector3.ANGLE(offset, direction);

            let axis: ƒ.Vector3 = this.axes[this.selected].clone.transform(quaternionInverse);

            // Determine the direction of rotation
            let cross: ƒ.Vector3 = ƒ.Vector3.CROSS(offset, direction);
            if (ƒ.Vector3.DOT(axis, cross) < 0)
              angle = -angle;

            let rotation: ƒ.Quaternion = ƒ.Quaternion.ROTATION(axis, angle);

            this.mtxLocal.rotate(rotation);
            break;
          case "scale":
            let offse: ƒ.Vector3 = this.offset.clone;
            let directio: ƒ.Vector3 = this.direction.clone;
            let axi: ƒ.Vector3 = this.axes[this.selected].clone;

            let sign: number = Math.sign(ƒ.Vector3.DOT(axi, directio));

            this.scale = sign * directio.magnitude / offse.magnitude;
            let scaling: ƒ.Vector3 = ƒ.Vector3.ONE();
            scaling[this.selected] = this.scale;

            let mtxScaling: ƒ.Matrix4x4 = ƒ.Matrix4x4.SCALING(scaling);

            if (this.space == "world") {
              let rotationInverse: ƒ.Quaternion = this.mtxWorldBase.quaternion.clone.invert();
              mtxScaling.rotate(rotationInverse, true);
              mtxScaling.rotate(this.mtxWorldBase.quaternion);
            }

            this.mtxLocal.scale(mtxScaling.scaling);
            break;
        }
      }
    };

    private hndPointerUp = (_event: PointerEvent): void => {
      if (this.space == "local") {
        this.axes.x = this.mtxWorld.right;
        this.axes.y = this.mtxWorld.up;
        this.axes.z = this.mtxWorld.forward;
        this.normals.x = this.axes.z;
        this.normals.y = this.axes.x;
        this.normals.z = this.axes.x;
      } else {
        this.axes.x = ƒ.Vector3.X(1);
        this.axes.y = ƒ.Vector3.Y(1);
        this.axes.z = ƒ.Vector3.Z(1);
        this.normals.x = this.axes.z;
        this.normals.y = this.axes.x;
        this.normals.z = this.axes.x;
      }
      this.selected = null;
      this.isTransforming = false;
    };

    private hndRenderEnd = (): void => {
      this.drawGizmos(this.viewport.camera);
    };

    private addListeners = (): void => {
      this.viewport.canvas.addEventListener("pointerdown", this.hndPointerDown);
      this.viewport.canvas.addEventListener("pointermove", this.hndPointerMove);
      this.viewport.canvas.addEventListener("pointerup", this.hndPointerUp);
      this.viewport.canvas.addEventListener("pointerleave", this.hndPointerUp);
      this.viewport.canvas.addEventListener("pointercancel", this.hndPointerUp);
      this.viewport.addEventListener(ƒ.EVENT.RENDER_END, this.hndRenderEnd);
    };

    private removeListeners = (): void => {
      this.viewport.canvas.removeEventListener("pointerdown", this.hndPointerDown);
      this.viewport.canvas.removeEventListener("pointermove", this.hndPointerMove);
      this.viewport.canvas.removeEventListener("pointerup", this.hndPointerUp);
      this.viewport.canvas.removeEventListener("pointerleave", this.hndPointerUp);
      this.viewport.canvas.removeEventListener("pointercancel", this.hndPointerUp);
      this.viewport.removeEventListener(ƒ.EVENT.RENDER_END, this.hndRenderEnd);
    };

    private drawCircle(_color: ƒ.Color, _direction: ƒ.Vector3, _up: ƒ.Vector3, _radius: number, _alphaOccluded: number): void {
      let mtxWorld: ƒ.Matrix4x4 = this.mtxWorld.clone;
      let scale: ƒ.Vector3 = ƒ.Recycler.reuse(ƒ.Vector3).set(_radius * 2, _radius * 2, _radius * 2);

      mtxWorld.scaling = scale;
      mtxWorld.lookIn(_direction, _up); // lookIn orientates the z-axis but the toruse lays on the xz-plane (facing in y-direction),
      mtxWorld.rotateX(90);             // thus we rotate the torus so the circle faces in _direction
      // ƒ.Gizmos.drawMesh(this.torusPick, mtxWorld, ƒ.Color.CSS("magenta"), _alphaOccluded);
      ƒ.Gizmos.drawMesh(this.isPicking ? this.torusPick : this.torus, mtxWorld, _color, _alphaOccluded);

      // TODO: cleanup
    }

    private getPoint3D(_event: PointerEvent): ƒ.Vector3 {
      const point2D: ƒ.Vector2 = ƒ.Recycler.reuse(ƒ.Vector2).set(_event.offsetX, _event.offsetY);
      const ray: ƒ.Ray = this.viewport.getRayFromClient(point2D);
      const normal: ƒ.Vector3 = this.mode == "rotate" ? this.axes[this.selected] : this.normal;

      return ray.intersectPlane(this.mtxWorldBase.translation, normal);
    }


  }
}
