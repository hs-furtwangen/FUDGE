namespace FudgeAid {
  import ƒ = FudgeCore;

  export class ComponentTransformator extends ƒ.Component {
    public viewport: ƒ.Viewport;

    public mode: "translate" | "rotate" | "scale" = "translate";
    public selected: "x" | "y" | "z";

    private origin: ƒ.Vector3;
    private offset: ƒ.Vector3;

    private direction: ƒ.Vector3;
    private rotation: ƒ.Quaternion;

    private isPicking: boolean = false;
    private isTransforming: boolean = false;

    private colors = { // eslint-disable-line
      x: ƒ.Color.CSS("red"),
      y: ƒ.Color.CSS("limegreen"),
      z: ƒ.Color.CSS("blue")
    };

    private colorsLight = { // eslint-disable-line
      x: ƒ.Color.CSS("salmon"),
      y: ƒ.Color.CSS("lightgreen"),
      z: ƒ.Color.CSS("cornflowerblue")
    };

    private axis = { // eslint-disable-line
      x: ƒ.Vector3.X(1),
      y: ƒ.Vector3.Y(1),
      z: ƒ.Vector3.Z(1)
    };

    private normal = { // eslint-disable-line
      x: this.axis.z,
      y: this.axis.x,
      z: this.axis.x
    };

    private pyramid: ƒ.MeshPyramid = new ƒ.MeshPyramid();
    private torus: ƒ.MeshTorus = new ƒ.MeshTorus("Circle", 0.005, 60, 8);
    private torusPick: ƒ.MeshTorus = new ƒ.MeshTorus("Circle", 0.02, 25, 25);
    private quad: ƒ.MeshQuad = new ƒ.MeshQuad();

    public constructor(_viewport: ƒ.Viewport) {
      super();
      this.viewport = _viewport;
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addListeners);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.removeListeners);
    }

    private get camera(): ƒ.ComponentCamera {
      return this.viewport.camera;
    }

    private get mtxWorld(): ƒ.Matrix4x4 {
      return this.node.mtxWorld;
    }

    private get mtxLocal(): ƒ.Matrix4x4 {
      return this.node.mtxLocal;
    }

    public activate(_on: boolean): void {
      super.activate(_on);
      if (_on)
        this.addListeners();
      else
        this.removeListeners();
    }

    public drawGizmos(): void {
      let scale: number = ƒ.Gizmos.camera.getWorldToPixelScale(this.node.mtxWorld.translation);
      let width: number = scale * 1; // 1 pixel wide
      let length: number = scale * 100; // 100 pixels long
      if (this.isPicking) { // scale up for picking
        width *= 10;
        length *= 1.1;
      }

      if (this.isTransforming) {
        const mtx: ƒ.Matrix4x4 = ƒ.Matrix4x4.COMPOSITION(this.mtxWorld.translation);
        const line: ƒ.Vector3[] = [] = [new ƒ.Vector3(0, 0, -1000), new ƒ.Vector3(0, 0, 1000)];

        ƒ.Gizmos.drawLines(line, mtx.lookIn(this.axis[this.selected], this.normal[this.selected]), this.colorsLight[this.selected], 1);
        ƒ.Recycler.storeMultiple(mtx, line);
      }

      let clrX: ƒ.Color = this.selected == "x" && !this.isTransforming ? this.colorsLight[this.selected] : this.colors["x"];
      let clrY: ƒ.Color = this.selected == "y" && !this.isTransforming ? this.colorsLight[this.selected] : this.colors["y"];
      let clrZ: ƒ.Color = this.selected == "z" && !this.isTransforming ? this.colorsLight[this.selected] : this.colors["z"];
      switch (this.mode) {
        case "translate":
          this.drawArrow(clrX, this.axis.x, this.normal.x, length, width);
          this.drawArrow(clrY, this.axis.y, this.normal.y, length, width);
          this.drawArrow(clrZ, this.axis.z, this.normal.z, length, width);
          break;
        case "rotate":
          let radius: number = scale * 350;

          if (!this.isTransforming || this.selected == "x")
            this.drawCircle(clrX, this.axis.y, this.axis.x, radius, 1);
          if (!this.isTransforming || this.selected == "y")
            this.drawCircle(clrY, this.axis.x, this.axis.y, radius, 1);
          if (!this.isTransforming || this.selected == "z")
            this.drawCircle(clrZ, this.axis.y, this.axis.z, radius, 1);

          if (this.isTransforming && !this.isPicking) {
            this.drawArrow(this.colorsLight[this.selected], this.offset, this.axis[this.selected], this.offset.magnitude, width);
            this.drawArrow(this.colors[this.selected], this.direction, this.axis[this.selected], this.offset.magnitude, width);
          }
          break;
        case "scale":
          break;
      }

    }

    public hndPointerDown = (_event: PointerEvent): void => {
      if (!this.camera || !this.viewport || !this.node || !this.selected)
        return;

      if (this.mode == "rotate")
        this.rotation = this.mtxWorld.quaternion.clone;

      this.origin = this.mtxWorld.translation.clone;
      this.offset = ƒ.Vector3.DIFFERENCE(this.getPoint(_event), this.origin);
    };

    public hndPointerMove = (_event: PointerEvent): void => {
      this.isTransforming = false;
      this.viewport.canvas.style.cursor = "default";

      if (_event.buttons == 0) {
        let point: ƒ.Vector2 = new ƒ.Vector2(_event.offsetX, _event.offsetY);
        this.isPicking = true;
        let pick: ƒ.Pick = ƒ.Picker
          .pickCamera([this.node], this.camera, this.viewport.pointClientToProjection(point), true, this.viewport.gizmosFilter)
          .find(_pick => _pick.gizmo == this);
        this.isPicking = false;

        if (!pick) {
          this.selected = null;
          return;
        }

        this.viewport.canvas.style.cursor = "grab";

        if (pick.color.r > 0.7)
          this.selected = "x";
        else if (pick.color.g > 0.7)
          this.selected = "y";
        else if (pick.color.b > 0.7)
          this.selected = "z";

        return;
      }

      if (this.selected) {
        let point: ƒ.Vector3 = this.getPoint(_event);
        let parent: ƒ.Node = this.node.getParent();
        this.isTransforming = true;
        this.viewport.canvas.style.cursor = "grabbing";

        switch (this.mode) {
          case "translate":
            point.subtract(this.offset);
            if (this.selected != "x")
              point.x = this.mtxWorld.translation.x;

            if (this.selected != "y")
              point.y = this.mtxWorld.translation.y;

            if (this.selected != "z")
              point.z = this.mtxWorld.translation.z;

            if (parent)
              point.transform(parent.mtxWorldInverse);

            this.mtxLocal.translation = point;

            break;
          case "rotate":
            this.direction = ƒ.Vector3.DIFFERENCE(point, this.mtxWorld.translation).normalize();
            let angle: number = ƒ.Vector3.ANGLE(this.offset, this.direction);

            // Determine the direction of rotation
            let cross: ƒ.Vector3 = ƒ.Vector3.CROSS(this.offset, this.direction);
            if (ƒ.Vector3.DOT(cross, this.axis[this.selected]) < 0)
              angle = -angle;

            let rotation: ƒ.Quaternion = this.rotation.clone;
            rotation.rotate(this.axis[this.selected], angle, true);

            if (parent) {
              let invserse: ƒ.Quaternion = parent.mtxWorld.quaternion.clone.invert();
              rotation.multiply(invserse, true);
            }

            this.node.mtxLocal.rotation = rotation;
            break;
          case "scale":
            break;
        }
      }
    };

    public hndPointerUp = (_event: PointerEvent): void => {
      this.selected = null;
      this.isTransforming = false;
    };

    private addListeners = (): void => {
      this.viewport.canvas.addEventListener("pointerdown", this.hndPointerDown);
      this.viewport.canvas.addEventListener("pointermove", this.hndPointerMove);
      this.viewport.canvas.addEventListener("pointerup", this.hndPointerUp);
      this.viewport.canvas.addEventListener("pointerleave", this.hndPointerUp);
      this.viewport.canvas.addEventListener("pointercancel", this.hndPointerUp);
    };

    private removeListeners = (): void => {
      this.viewport.canvas.removeEventListener("pointerdown", this.hndPointerDown);
      this.viewport.canvas.removeEventListener("pointermove", this.hndPointerMove);
      this.viewport.canvas.removeEventListener("pointerup", this.hndPointerUp);
      this.viewport.canvas.addEventListener("pointerleave", this.hndPointerUp);
      this.viewport.canvas.addEventListener("pointercancel", this.hndPointerUp);
    };

    private drawArrow(_color: ƒ.Color, _direction: ƒ.Vector3, _up: ƒ.Vector3, _length: number, _width: number): void {
      const lengthShaft: number = _length * 0.85;
      const lengthHead: number = _length * 0.15;
      const widthHead: number = _length * 0.075;

      let scale: ƒ.Vector3 = ƒ.Recycler.reuse(ƒ.Vector3).set(_width, _width, lengthShaft);
      let mtxWorld: ƒ.Matrix4x4 = this.node.mtxWorld.clone;
      mtxWorld.scaling = scale;
      mtxWorld.lookIn(_direction, _up);
      mtxWorld.translateZ(0.5);
      ƒ.Gizmos.drawCube(mtxWorld, _color, 1);

      scale.set(widthHead, lengthHead, widthHead);
      mtxWorld.copy(this.node.mtxWorld);
      mtxWorld.scaling = scale;
      mtxWorld.lookIn(_up, _direction);
      mtxWorld.translateY(lengthShaft / lengthHead);
      ƒ.Gizmos.drawMesh(this.pyramid, mtxWorld, _color, 1);

      // TODO: cleanup
    }

    private drawCircle(_color: ƒ.Color, _direction: ƒ.Vector3, _up: ƒ.Vector3, _radius: number, _alphaOccluded?: number): void {
      let mtxWorld: ƒ.Matrix4x4 = this.node.mtxWorld.clone;
      let scale: ƒ.Vector3 = ƒ.Recycler.reuse(ƒ.Vector3).set(_radius, _radius, _radius);

      mtxWorld.scaling = scale;
      mtxWorld.lookIn(_direction, _up);
      // ƒ.Gizmos.drawMesh(this.torusPick, mtxWorld, ƒ.Color.CSS("magenta"), 1);
      ƒ.Gizmos.drawMesh(this.isPicking ? this.torusPick : this.torus, mtxWorld, _color, _alphaOccluded);

      // TODO: cleanup
    }

    private getPoint(_event: PointerEvent): ƒ.Vector3 {
      const point2D: ƒ.Vector2 = ƒ.Recycler.reuse(ƒ.Vector2).set(_event.offsetX, _event.offsetY);
      const ray: ƒ.Ray = this.viewport.getRayFromClient(point2D);
      let normal: ƒ.Vector3 = this.axis[this.selected];
      if (this.mode == "translate")
        normal = this.normal[this.selected];

      return ray.intersectPlane(this.origin, normal);
    }
  }
}
