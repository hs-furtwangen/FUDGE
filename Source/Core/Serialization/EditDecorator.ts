namespace FudgeCore {

  export interface EditDecoratorOptions {
    order?: number;
  }

  /**
   * Decorator to mark properties of a class for nested mutation and serialization.
   * See {@link mutate} and {@link serialize} decorators for more information.
   * 
   * **⚠️ Warning:** Do not use with {@link SerializableResource} unless you manually deregister them from the project. 
   * Otherwise, they will automatically register themselves when deserialized, potentially causing ID conflicts.
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
   * 
   * **Example Nested Resource:**
   * ```typescript
   * import f = FudgeCore;
   *
   * export class MyScript extends f.ComponentScript {
   *   public static readonly iSubclass: number = f.Component.registerSubclass(MyScript);
   *
   *   @f.editReference(f.Material) // edit and serialize a reference to a material in the project
   *   public material: f.Material;
   *
   *   @f.edit(f.Material) // edit and serialize nested
   *   public nestedMaterial: f.Material;
   *
   *   public constructor() {
   *     super();
   *     this.nestedMaterial = new f.Material("NestedMaterial", f.ShaderPhong);
   *     
   *     // ⚠️ important: deregister nested resource, otherwise it will double duty as resource!
   *     f.Project.deregister(this.nestedMaterial);
   * 
   *     // remove properties that are not needed
   *     delete this.nestedMaterial.idResource;
   *     delete this.nestedMaterial.name;
   *   }
   * }
   * ```
   * 
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
   * Decorator to mark function properties (typeof `_type`) of a class for mutation and serialization.
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

  // /**
  //  * Decorator to mark properties of a class for reference-based mutation and serialization.
  //  * See {@link mutateReference} and {@link serializeReference} decorators for more information.
  //  * 
  //  * **Example:**
  //  * ```typescript
  //  * import f = FudgeCore;
  //  *
  //  * export class MyScript extends f.ComponentScript {
  //  *   public static readonly iSubclass: number = f.Component.registerSubclass(MyScript);
  //  *
  //  *   @f.editReference(f.Material) // edit and serialize a reference to a material in the project
  //  *   public resource: f.Material;
  //  *
  //  *   @f.editReference(f.Node) // edit and serialize a reference to a node in the hierarchy
  //  *   public reference: f.Node;
  //  * }
  //  * ```
  //  * 
  //  * @author Jonas Plotzky, HFU, 2025
  //  */
  // export function editReference<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyDecoratorContext<T extends Node ? Node extends T ? Component : object : object, T>) => void;
  // export function editReference<T, C extends abstract new (...args: General[]) => T>(_collectionType: typeof Array, _valueType: C): (_value: unknown, _context: ClassPropertyDecoratorContext<T extends Node ? Node extends T ? Component : object : object, T[]>) => void;

  // export function editReference(_typePrimary: General, _typeSecondary?: General): (_value: unknown, _context: ClassPropertyDecoratorContext) => void {
  //   return editFactory(_typePrimary, _typeSecondary, false, true);
  // }

  /**
   * Decorator to mark properties of a class for nested mutation and serialization with type information and polymorphic reconstruction.
   * See {@link serializableReconstruct} for more information.
   * 
   * **⚠️ Warning:** Do not use with {@link SerializableResource}s unless you manually deregister them from the project.
   * Resources reconstructed this way will automatically register themselves, potentially causing ID conflicts.
   *
   * **Example:**
   * ```typescript
   * import f = FudgeCore;
   *
   * export class MySpecialScriptA extends f.ComponentScript {}
   * export class MySpecialScriptB extends f.ComponentScript {}
   *
   * export class MyScript extends f.ComponentScript {
   *   public static readonly iSubclass: number = f.Component.registerSubclass(MyScript);
   * 
   *   @f.editReconstruct(f.ComponentScript) // serialize with type information
   *   public myReconstruct: f.ComponentScript;
   * }
   * ```
   * 
   * @author Jonas Plotzky, HFU, 2025
   */
  export function editReconstruct<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyDecoratorContext<object, T>) => void;
  export function editReconstruct<T, C extends abstract new (...args: General[]) => T>(_collectionType: typeof Array, _valueType: C): (_value: unknown, _context: ClassPropertyDecoratorContext<object, T[]>) => void;

  export function editReconstruct(_typePrimary: General, _typeSecondary?: General): (_value: unknown, _context: ClassPropertyDecoratorContext) => void {
    return editFactory(_typePrimary, _typeSecondary, false, true);
  }

  function editFactory(_typePrimary: Function | Record<string, unknown> | typeof Array, _typeSecondary?: Function | Record<string, unknown>, _function?: boolean, _reconstruct?: boolean): (_value: unknown, _context: ClassPropertyDecoratorContext) => void {
    return (_value, _context) => {
      serializeFactory(_typePrimary, _typeSecondary, _function, _reconstruct)(_value, _context);
      mutateFactory(_typePrimary, _typeSecondary, _function)(_value, _context);
    };
  }

}