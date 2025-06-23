namespace FudgeCore {
  /**
    * Abstract class serving as a base for interface-like pure abstract classes that work with the "instanceof"-operator. 
    * 
    * **Usage**:
    * * Create a pure abstract class that extends {@link Implementable} that will serve as your interface. Specify the required attributes and methods within it as abstract. 
    * * Use your abstract class via the `implements` keyword exactly how you would use a regular `interface`.
    * * Decorate the class that implements your abstract class using the static `YOUR_ABSTRACT_CLASS`.{@link register} method.
    * * Now you can use the `instanceof`-operator with your abstract class.
    * 
    * **Example**:
    * ```typescript
    * import ƒ = FudgeCore;
    * 
    * abstract class MyInterface extends ƒ.Implementable {
    *   public abstract myAttribute: string;
    *   public abstract myMethod(): void;
    * }
    * 
    * @MyInterface.register
    * class MyClass implements MyInterface {
    *   public myAttribute: string;
    *   public myMethod(): void {}
    * }
    * 
    * let myInstance: MyInterface = new MyClass();
    * console.log(myInstance instanceof MyInterface); // true
    * console.log(MyClass.prototype instanceof MyInterface); // true
    * ```
    */
  export abstract class Implementable {
    public static register<T extends typeof Implementable>(this: T, _class: abstract new (...args: General[]) => InstanceType<T>, _context: ClassDecoratorContext): void {
      let meta: Metadata = _context.metadata;
      if (!Object.hasOwn(meta, "implements"))
        meta.implements = new Set(meta.implements);

      let implement: General = this;
      while (implement != Implementable) {
        meta.implements.add(implement);
        implement = Object.getPrototypeOf(implement);
      }
    }

    public static [Symbol.hasInstance](_instance: unknown): boolean {
      let meta: Metadata = _instance.constructor[Symbol.metadata];
      return meta?.implements?.has(this);
    }
  }
}