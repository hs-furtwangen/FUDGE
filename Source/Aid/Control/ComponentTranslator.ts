namespace FudgeAid {
  import ƒ = FudgeCore;

  export class ComponentTranslator extends ƒ.Component {
    public viewport: ƒ.Viewport;

    public selected: "x" | "y" | "z";
    private normal: ƒ.Vector3;
    private origin: ƒ.Vector3;
    private offset: ƒ.Vector3;
    private pick: ƒ.Pick;

    private isPicking: boolean = false;

    private meshPyramid: ƒ.MeshPyramid = new ƒ.MeshPyramid();

    public constructor(_viewport: ƒ.Viewport) {
      super();
      this.viewport = _viewport;
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addListeners);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.removeListeners);
    }

    private get camera(): ƒ.ComponentCamera {
      return this.viewport.camera;
    }

    public activate(_on: boolean): void {
      super.activate(_on);
      if (_on)
        this.addListeners();
      else
        this.removeListeners();
    }

    public drawGizmos(): void {
      let posWorld: ƒ.Vector3 = this.node.mtxWorld.translation;
      let scale: number = ƒ.Gizmos.camera.getWorldToPixelScale(posWorld);
      let width: number = scale * 1; // 1 pixel wide
      let length: number = scale * 100; // 100 pixels long
      if (this.isPicking) { // scale up for picking
        width *= 10;
        length *= 1.1;
      }

      let color: ƒ.Color = ƒ.Recycler.reuse(ƒ.Color);
      const right: ƒ.Vector3 = ƒ.Vector3.X(1); // this.node.mtxWorld.right;
      const up: ƒ.Vector3 = ƒ.Vector3.Y(1); // this.node.mtxWorld.up;
      const forward: ƒ.Vector3 = ƒ.Vector3.Z(1); // this.node.mtxWorld.forward;
      this.drawArrow(color.setCSS(this.selected == "x" ? "salmon" : "red"), right, up, posWorld, length, width);
      this.drawArrow(color.setCSS(this.selected == "y" ? "palegreen" : "lime"), up, right, posWorld, length, width);
      this.drawArrow(color.setCSS(this.selected == "z" ? "cornflowerblue" :"blue"), forward, up, posWorld, length, width);

      ƒ.Recycler.storeMultiple(up, forward, right, color);
    }

    public hndPointerDown = (_event: PointerEvent): void => {
      if (!this.camera || !this.viewport || !this.node || !this.selected)
        return;

      switch (this.selected) {
        case "x":
          this.normal = ƒ.Vector3.Z(1);
          break;
        case "y":
          this.normal = this.node.mtxWorld.clone
            .lookAt(this.camera.mtxWorld.translation, ƒ.Vector3.Y(1), true)
            .forward;
          break;
        case "z":
          this.normal = ƒ.Vector3.X(1);
          break;
      }

      this.origin = this.node.mtxWorld.translation.clone;
      this.offset = ƒ.Vector3.DIFFERENCE(this.origin, this.pick.posWorld);
    };

    public hndPointerMove = (_event: PointerEvent): void => {
      if (_event.buttons == 0) {
        let point: ƒ.Vector2 = new ƒ.Vector2(_event.offsetX, _event.offsetY);
        this.isPicking = true;
        this.pick = ƒ.Picker
          .pickCamera([this.node], this.camera, this.viewport.pointClientToProjection(point), true, this.viewport.gizmosFilter)
          .find(_pick => _pick.gizmo == this);
        this.isPicking = false;

        if (!this.pick) {
          this.selected = null;
          return;
        }

        if (this.pick.color.r > 0.9)
          this.selected = "x";
        else if (this.pick.color.g > 0.9)
          this.selected = "y";
        else if (this.pick.color.b > 0.9)
          this.selected = "z";

        return;
      }

      if (this.selected) {
        let ray: ƒ.Ray = this.viewport.getRayFromClient(new ƒ.Vector2(_event.offsetX, _event.offsetY));
        let point: ƒ.Vector3 = ray.intersectPlane(this.origin, this.normal);
        point.add(this.offset);
        if (this.selected != "x")
          point.x = this.node.mtxWorld.translation.x;

        if (this.selected != "y")
          point.y = this.node.mtxWorld.translation.y;

        if (this.selected != "z")
          point.z = this.node.mtxWorld.translation.z;

        point.transform(this.node.getParent().mtxWorldInverse);

        this.node.mtxLocal.translation = point;

        return;
      }
    };

    public hndPointerUp = (_event: PointerEvent): void => {
      this.selected = null;
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

    private drawArrow(_color: ƒ.Color, _direction: ƒ.Vector3, _up: ƒ.Vector3, _start: ƒ.Vector3, _length: number, _width: number): void {
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
      ƒ.Gizmos.drawMesh(this.meshPyramid, mtxWorld, _color, 1);
    }
  }
}
