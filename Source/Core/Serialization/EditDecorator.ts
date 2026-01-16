namespace FudgeCore {

  export interface EditDecoratorOptions {
    order?: number;
  }

  /**
   * Decorator to mark properties of a class for decoration based mutation and serialization.
   * See {@link mutate} and {@link serialize} decorators for more information.
   * 
   * **Example:**
   * ```typescript
   * import f = FudgeCore;
   *
   * export class MyScript extends f.ComponentScript {
   *   public static readonly iSubclass: number = f.Component.registerSubclass(MyScript);
   *
   *   @f.edit(String) // edit and serialize a string
   *   public info: string;
   *
   *   @f.edit(f.Vector3) // edit and serialize a vector
   *   public position: f.Vector3 = new f.Vector3(1, 2, 3);
   *
   *   #size: number = 1;
   *
   *   @f.edit(Number) // edit and serialize a number
   *   public get size(): number {
   *     return this.#size;
   *   }
   *
   *   // define a setter to allow writing to size, or omit it to leave the property read-only
   *   public set size(_size: number) {
   *     this.#size = _size;
   *   }
   * }
   * ```
   * @author Jonas Plotzky, HFU, 2025
   */
  // primitive type
  export function edit<T extends String | Number | Boolean, P>(_type: abstract new (...args: General[]) => T): WrapperToPrimitve<T> extends P ? ((_value: unknown, _context: ClassPropertyDecoratorContext<object, P>) => void) : never;
  // primitive type array
  export function edit<T extends String | Number | Boolean, P>(_collectionType: typeof Array, _valueType: abstract new (...args: General[]) => T): WrapperToPrimitve<T> extends P ? ((_value: unknown, _context: ClassPropertyDecoratorContext<object, P[]>) => void) : never;

  // object type
  export function edit<T extends P, P>(_type: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, P>) => void;
  // object type array
  export function edit<T extends P, P>(_collectionType: typeof Array, _valueType: abstract new (...args: General[]) => T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, P[]>) => void;

  // enum type
  export function edit<E extends Record<keyof E, P>, P extends Number | String>(_type: E): (_value: unknown, _context: ClassPropertyDecoratorContext<object, P>) => void;
  // enum type array
  export function edit<E extends Record<keyof E, P>, P extends Number | String>(_collectionType: typeof Array, _valueType: E): (_value: unknown, _context: ClassPropertyDecoratorContext<object, P[]>) => void;

  export function edit(_typePrimary: General, _typeSecondary?: General): (_value: unknown, _context: ClassPropertyDecoratorContext<General, General>) => void {
    return editFactory(_typePrimary, _typeSecondary, false);
  }

  /**
   * Decorator to mark callable properties (functions, typeof `_type`) of a class for mutation and serialization.
   * See {@link mutateFunction} and {@link serializeF} decorators for more information.
   * 
   * **Example:**
   * ```typescript
   * import f = FudgeCore;
   * import editFunction = f.editFunction;
   *
   * export class MyClass {
   *   public static subclasses: typeof MyClass[] = [];
   * }
   *
   * export class MySubClassA extends MyClass { }
   * export class MySubClassB extends MyClass { }
   * MyClass.subclasses.push(MySubClassA, MySubClassB); // add subclasses
   *
   * export class MyScript extends f.ComponentScript {
   *   public static readonly iSubclass: number = f.Component.registerSubclass(MyScript);
   *   
   *   @editFunction(MyClass)
   *   public myClass: typeof MyClass;
   * }
   * ```
   * 
   * @author Jonas Plotzky, HFU, 2025
   */
  export function editFunction<T extends Function>(_type: T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, T>) => void;
  export function editFunction<T extends Function>(_collectionType: typeof Array, _valueType: T): (_value: unknown, _context: ClassPropertyDecoratorContext<object, T[]>) => void;

  export function editFunction(_typePrimary: General, _typeSecondary?: General): (_value: unknown, _context: ClassPropertyDecoratorContext) => void {
    return editFactory(_typePrimary, _typeSecondary, true);
  }

  function editFactory(_typePrimary: Function | Record<string, unknown> | typeof Array, _typeSecondary?: Function | Record<string, unknown>, _function?: boolean): (_value: unknown, _context: ClassPropertyDecoratorContext) => void {
    return (_value, _context) => {
      serializeFactory(_typePrimary, _typeSecondary, _function)(_value, _context);
      mutateFactory(_typePrimary, _typeSecondary, _function)(_value, _context);
    };
  }
}