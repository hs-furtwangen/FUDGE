///<reference path="../Recycle/Recycler.ts"/>
///<reference path="Vector2.ts"/>

namespace FudgeCore {
  /**
   * Defines the origin of a rectangle
   */
  export enum ORIGIN2D {
    TOPLEFT = 0x00,
    TOPCENTER = 0x01,
    TOPRIGHT = 0x02,
    CENTERLEFT = 0x10,
    CENTER = 0x11,
    CENTERRIGHT = 0x12,
    BOTTOMLEFT = 0x20,
    BOTTOMCENTER = 0x21,
    BOTTOMRIGHT = 0x22
  }

  /**
   * Defines a rectangle with position and size and add comfortable methods to it
   * @author Jirka Dell'Oro-Friedl, HFU, 2019
   */
  export class Rectangle extends Mutable implements Recycable {
    public position: Vector2 = Recycler.get(Vector2);
    public size: Vector2 = Recycler.get(Vector2);

    public constructor(_x: number = 0, _y: number = 0, _width: number = 1, _height: number = 1, _origin: ORIGIN2D = ORIGIN2D.TOPLEFT) {
      super();
      this.setPositionAndSize(_x, _y, _width, _height, _origin);
    }

    /**
     * Returns a new rectangle created with the given parameters.
     * @param _out Optional rectangle to store the result in.
     */
    public static GET(_x: number = 0, _y: number = 0, _width: number = 1, _height: number = 1, _origin: ORIGIN2D = ORIGIN2D.TOPLEFT, _out: Rectangle = Recycler.reuse(Rectangle)): Rectangle {
      return _out.setPositionAndSize(_x, _y, _width, _height, _origin);
    }

    public get x(): number {
      return this.position.x;
    }

    public set x(_x: number) {
      this.position.x = _x;
    }

    public get y(): number {
      return this.position.y;
    }

    public set y(_y: number) {
      this.position.y = _y;
    }

    public get width(): number {
      return this.size.x;
    }

    public set width(_width: number) {
      this.size.x = _width;
    }

    public get height(): number {
      return this.size.y;
    }

    public set height(_height: number) {
      this.size.y = _height;
    }

    /**
     * Get/set the leftmost expansion, respecting also negative values of width
     */
    public get left(): number {
      if (this.size.x > 0)
        return this.position.x;
      return (this.position.x + this.size.x);
    }

    public set left(_value: number) {
      this.size.x = this.right - _value;
      this.position.x = _value;
    }

    /**
     * Get/set the topmost expansion, respecting also negative values of height
     */
    public get top(): number {
      if (this.size.y > 0)
        return this.position.y;
      return (this.position.y + this.size.y);
    }

    public set top(_value: number) {
      this.size.y = this.bottom - _value;
      this.position.y = _value;
    }

    /**
     * Get/set the rightmost expansion, respecting also negative values of width
     */
    public get right(): number {
      if (this.size.x > 0)
        return (this.position.x + this.size.x);
      return this.position.x;
    }

    public set right(_value: number) {
      this.size.x = this.position.x + _value;
    }

    /**
     * Get/set the lowest expansion, respecting also negative values of height
     */
    public get bottom(): number {
      if (this.size.y > 0)
        return (this.position.y + this.size.y);
      return this.position.y;
    }

    public set bottom(_value: number) {
      this.size.y = this.position.y + _value;
    }

    public get clone(): Rectangle {
      return Recycler.reuse(Rectangle).copy(this);
    }

    public recycle(): void {
      this.setPositionAndSize();
    }

    /**
     * Returns true if this rectangle is equal to the given rectagnle within the given tolerance.
     */
    public equals(_compare: Rectangle, _tolerance: number = Number.EPSILON): boolean {
      return Math.abs(this.x - _compare.x) <= _tolerance &&
        Math.abs(this.y - _compare.y) <= _tolerance &&
        Math.abs(this.width - _compare.width) <= _tolerance &&
        Math.abs(this.height - _compare.height) <= _tolerance;
    }

    /**
     * Set this rectangle to the values given by the rectangle provided.
     * @returns A reference to this rectangle.
     */
    public copy(_rect: Rectangle): Rectangle {
      return this.setPositionAndSize(_rect.x, _rect.y, _rect.width, _rect.height);
    }

    /**
     * Sets the position and size of the rectangle according to the given parameters.
     * @param _origin The origin of the rectangle. The default is {@link ORIGIN2D.TOPLEFT}.
     * @returns A reference to this rectangle.
     * @deprecated Use {@link set} instead.
     */
    public setPositionAndSize(_x: number = 0, _y: number = 0, _width: number = 1, _height: number = 1, _origin: ORIGIN2D = ORIGIN2D.TOPLEFT): Rectangle {
      return this.set(_x, _y, _width, _height, _origin);
    }

    /**
     * Sets the position and size of the rectangle according to the given parameters.
     * @param _origin The origin of the rectangle. The default is {@link ORIGIN2D.TOPLEFT}.
     * @returns A reference to this rectangle.
     */
    public set(_x: number = 0, _y: number = 0, _width: number = 1, _height: number = 1, _origin: ORIGIN2D = ORIGIN2D.TOPLEFT): Rectangle {
      this.size.set(_width, _height);
      switch (_origin & 0x03) {
        case 0x00: this.position.x = _x; break;
        case 0x01: this.position.x = _x - _width / 2; break;
        case 0x02: this.position.x = _x - _width; break;
      }
      switch (_origin & 0x30) {
        case 0x00: this.position.y = _y; break;
        case 0x10: this.position.y = _y - _height / 2; break;
        case 0x20: this.position.y = _y - _height; break;
      }
      return this;
    }

    /**
     * Transforms the given point from this rectangles space to the target rectangles space.
     * @param _out Optional vector to store the result in.
     */
    public pointToRect(_point: Vector2, _target: Rectangle, _out: Vector2 = Recycler.reuse(Vector2)): Vector2 {
      _out.copy(_point);
      _out.subtract(this.position);
      _out.x *= _target.width / this.width;
      _out.y *= _target.height / this.height;
      _out.add(_target.position);
      return _out;
    }

    /**
     * Returns true if the given point is inside of this rectangle or on the border.
     */
    public isInside(_point: Vector2): boolean {
      return (_point.x >= this.left && _point.x <= this.right && _point.y >= this.top && _point.y <= this.bottom);
    }

    /**
     * Returns true if this rectangle collides with the given rectangle.
     */
    public collides(_rect: Rectangle): boolean {
      if (this.left > _rect.right) return false;
      if (this.right < _rect.left) return false;
      if (this.top > _rect.bottom) return false;
      if (this.bottom < _rect.top) return false;
      return true;
    }

    /**
     * Returns true if this rectangle completely encloses the given rectangle.
     */
    public covers(_rect: Rectangle): boolean {
      if (this.left > _rect.left) return false;
      if (this.right < _rect.right) return false;
      if (this.top > _rect.top) return false;
      if (this.bottom < _rect.bottom) return false;
      return true;
    }

    /**
     * Returns the rectangle created by the intersection of this and the given rectangle or null, if they don't collide.
     * @param _out Optional rectangle to store the result in.
     */
    public getIntersection(_rect: Rectangle, _out: Rectangle = Recycler.reuse(Rectangle)): Rectangle {
      if (!this.collides(_rect))
        return null;

      _out.x = Math.max(this.left, _rect.left);
      _out.y = Math.max(this.top, _rect.top);
      _out.width = Math.min(this.right, _rect.right) - _out.x;
      _out.height = Math.min(this.bottom, _rect.bottom) - _out.y;

      return _out;
    }

    /**
     * Creates a string representation of this rectangle.
     */
    public toString(): string {
      return `ƒ.Rectangle(position:${this.position.toString()}, size:${this.size.toString()}, left:${this.left.toPrecision(5)}, top:${this.top.toPrecision(5)}, right:${this.right.toPrecision(5)}, bottom:${this.bottom.toPrecision(5)})`;
    }

    protected reduceMutator(_mutator: Mutator): void {/* */ }
  }
}