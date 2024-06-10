namespace FudgeAid {
  import ƒ = FudgeCore;

  export class ComponentTransformator {
    public viewport: ƒ.Viewport;

    public mode: "translate" | "rotate" | "scale" = "translate";
    public selected: "x" | "y" | "z";

    public mtxLocal: ƒ.Matrix4x4;

    public mtxWorld: ƒ.Matrix4x4;
    public mtxParent: ƒ.Matrix4x4;

    private readonly origin: ƒ.Vector3 = ƒ.Vector3.ZERO();
    private offset: ƒ.Vector3;

    private readonly rotation: ƒ.Quaternion = ƒ.Quaternion.IDENTITY();

    private direction: ƒ.Vector3;
    private scale: number;
    private readonly scaling: ƒ.Vector3 = ƒ.Vector3.ONE();

    private mtxOriginal: ƒ.Matrix4x4 = ƒ.Matrix4x4.IDENTITY();

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
    private quad: ƒ.MeshQuad;

    public constructor(_viewport: ƒ.Viewport) {
      this.viewport = _viewport;
      this.addListeners();
      this.torus = new ƒ.MeshTorus("Torus", 0.5 - 0.0005, 0.005, 60, 8);
      this.torusPick = new ƒ.MeshTorus("TorusPick", 0.5 - 0.003, 0.03, 60, 8);
      this.quad = new ƒ.MeshQuad();
      ƒ.Project.deregister(this.torus);
      ƒ.Project.deregister(this.torusPick);
      ƒ.Project.deregister(this.quad);
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
            let scaleOrigin: number = _cmpCamera.getWorldToPixelScale(this.origin);
            ƒ.Gizmos.drawArrow(this.origin, this.colors.origin, this.axes[this.selected], this.normals[this.selected], scaleOrigin * 80, scaleOrigin * 1, scaleOrigin * 12, ƒ.MeshPyramid, 1);
          }

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

          let mtx: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.mtxWorld.translation);
          let direction: ƒ.Vector3 = _cmpCamera.mtxWorld.forward.negate();
          mtx.scaling = ƒ.Vector3.ONE(radius * 2);
          mtx.lookIn(direction);

          // draw an invisible quad to occlude the tori
          ƒ.Render.setDepthFunction(ƒ.DEPTH_FUNCTION.ALWAYS);
          ƒ.Render.setColorWriteMask(false, false, false, false);
          ƒ.Gizmos.drawMesh(this.quad, mtx, this.colors.x); // color doesn't matter
          ƒ.Render.setColorWriteMask(true, true, true, true);
          ƒ.Render.setDepthFunction(ƒ.DEPTH_FUNCTION.LESS);

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

      if (this.mode == "rotate")
        this.rotation.copy(this.mtxWorld.quaternion);

      if (this.mode == "scale")
        this.scaling.copy(this.mtxWorld.scaling);

      if (this.selected == "y") {
        const mtx: ƒ.Matrix4x4 = ƒ.Matrix4x4.LOOK_AT(this.origin, this.camera.mtxWorld.translation, this.axes.y, true);
        this.normal.copy(mtx.forward);
        ƒ.Recycler.store(mtx);
      } else
        this.normal.copy(this.normals[this.selected]);

      this.origin.copy(this.mtxWorld.translation);
      this.offset = ƒ.Vector3.DIFFERENCE(this.getPoint3D(_event), this.origin); // TODO: maybe project to axis
      this.mtxOriginal.copy(this.mtxWorld);
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
        let point: ƒ.Vector3 = this.getPoint3D(_event);
        this.isTransforming = true;
        this.viewport.canvas.style.cursor = "grabbing";

        this.direction = ƒ.Vector3.DIFFERENCE(point, this.origin);

        switch (this.mode) {
          case "translate":
            point.subtract(this.offset);
            if (this.selected != "x")
              point.x = this.mtxWorld.translation.x;

            if (this.selected != "y")
              point.y = this.mtxWorld.translation.y;

            if (this.selected != "z")
              point.z = this.mtxWorld.translation.z;

            if (this.mtxParent)
              point.transform(this.mtxParent);

            this.mtxLocal.translation = point;
            break;
          case "rotate":
            let direction: ƒ.Vector3 = ƒ.Vector3.NORMALIZATION(this.direction);
            let angle: number = ƒ.Vector3.ANGLE(this.offset, direction);

            // Determine the direction of rotation
            let cross: ƒ.Vector3 = ƒ.Vector3.CROSS(this.offset, direction);
            if (ƒ.Vector3.DOT(this.axes[this.selected], cross) < 0)
              angle = -angle;

            let rotation: ƒ.Quaternion = this.rotation.clone;
            rotation.rotate(this.axes[this.selected], angle, true);

            if (this.mtxParent) 
              rotation.multiply(this.mtxParent.quaternion, true);

            this.mtxLocal.rotation = rotation;
            break;
          case "scale":
            let mtxScaling: ƒ.Matrix4x4 = this.mtxOriginal.clone;
            let scaling: ƒ.Vector3 = ƒ.Vector3.ONE();
            let sign: number = Math.sign(ƒ.Vector3.DOT(this.axes[this.selected], this.direction));
            this.scale = sign * this.direction.magnitude / this.offset.magnitude;
            scaling[this.selected] = this.scale;
            mtxScaling.scale(scaling, true);

            if (this.mtxParent)
              mtxScaling.multiply(this.mtxParent, true);

            this.mtxLocal.scaling = mtxScaling.scaling;

            break;
        }
      }
    };

    private hndPointerUp = (_event: PointerEvent): void => {
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

      return ray.intersectPlane(this.origin, normal);
    }
  }
}
