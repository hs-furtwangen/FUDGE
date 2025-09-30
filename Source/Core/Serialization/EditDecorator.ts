namespace FudgeCore {

  export interface EditDecoratorOptions {
    order?: number;
  }

  /**
   * Decorator to mark properties of a class for mutation and serialization.
   * See {@link mutate} and {@link serialize} decorators for more information.
   * 
   * **Example:**
   * ```typescript
   * import f = FudgeCore;
   * import edit = f.edit;
   *
   * export class MyScript extends f.ComponentScript {
   *   public static readonly iSubclass: number = f.Component.registerSubclass(MyScript);
   *
   *   @edit(String) // display and serialize a string
   *   public info: string;
   *
   *   @edit(f.Vector3) // display and serialize a vector
   *   public position: f.Vector3 = new f.Vector3(1, 2, 3);
   *
   *   @edit(f.Material) // display a material selector inside the editor and enable drag & drop to reference a material from the project. Serialize the material by referencing it in the project.
   *   public resource: f.Material;
   *
   *   @edit(f.Node) // display a node selector inside the editor and enable drag & drop to reference a node from the hierarchy. Serialize the node by its path in the hierarchy.
   *   public reference: f.Node;
   *
   *   #size: number = 1;
   *
   *   @edit(Number) // display and serialize a number
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
   * @author Jonas Plotzky, HFU, 2025
   */
  // primitive type
  export function edit<T extends Number | String | Boolean>(_type: (abstract new (...args: General[]) => T)): (_value: unknown, _context: ClassPropertyContext<object, T | T[]>) => void;
  // object type
  export function edit<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyContext<T extends Node ? Node extends T ? Component : object : object, T | T[]>) => void;
  // enum type
  export function edit<T extends Number | String, E extends Record<keyof E, T>>(_type: E): (_value: unknown, _context: ClassPropertyContext<object, T | T[]>) => void;

  export function edit(_type: Function | Record<string, unknown>): (_value: unknown, _context: ClassPropertyContext<General, General>) => void {
    return editFactory(_type, false);
  }

  /**
   * Decorator to mark function properties (typeof `_type`) of a class for mutation and serialization.
   * See {@link mutateFunction} and {@link serializeFunction} decorators for more information.
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
  export function editFunction<T extends Function>(_type: T): (_value: unknown, _context: ClassPropertyContext<object, T | T[]>) => void {
    return editFactory(_type, true);
  }

  /**
   * Decorator to mark {@link SerializableResource resource} properties of a class for nested mutation and serialization. 
   * See {@link mutateNested} and {@link serializeNested} for more information.
   *
   * **Example:**
   * ```typescript
   * import f = FudgeCore;
   * import edit = f.edit;
   * import editNested = f.editNested;
   *
   * export class MyScript extends f.ComponentScript {
   *   public static readonly iSubclass: number = f.Component.registerSubclass(MyScript);
   *
   *   @edit(f.Material)
   *   public material: f.Material;
   *
   *   @editNested(f.Material)
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
  export function editNested<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyContext<object, T | T[]>) => void {
    return editFactory(_type, false, true);
  }

  // export function editReconstruct<T, C extends abstract new (...args: General[]) => T>(_type: C): (_value: unknown, _context: ClassPropertyContext<object, T | T[]>) => void {
  //   return editFactory(_type, false, true, true);
  // }

  function editFactory(_type: Function | Record<string, unknown>, _function?: boolean, _nested?: boolean, _reconstruct?: boolean): (_value: unknown, _context: ClassPropertyContext) => void {
    return (_value, _context) => {
      serializeFactory(_type, _function, _nested, _reconstruct)(_value, _context);
      mutateFactory(_type, _function, _nested)(_value, _context);
    };
  }

}