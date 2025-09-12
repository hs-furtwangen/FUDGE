namespace FudgeCore {
  export namespace Experimental {
    export namespace Edit {
      export interface Mutable {
        readonly isMutable: true;
        mutator(): Mutator;
        mutate(_mutator: Mutator, _dispatchMutate?: boolean): Promise<Mutable> | Mutable;
      }

      export function isMutable(_object: Object): _object is Mutable {
        return (_object && (<Mutable>_object).isMutable);
      }

      export interface Serializable {
        readonly isSerializable: true;
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable> | Serializable;
      }

      export function isSerializable(_object: Object): _object is Serializable {
        return (_object && (<Serializable>_object).isSerializable);
      }

      export interface SerializableResource extends Serializable {
        readonly isSerializableResource: true;
        idResource: string;
        name: string;
      }

      export function isSerializableResource(_object: Object): _object is SerializableResource {
        return (_object && (<SerializableResource>_object).isSerializableResource);
      }

      export function mutatorFromDecorations(_instance: object, _out: Mutator = {}): Mutator {
        const references: ReadonlySet<string> = Mutator.references(_instance);
        for (const key of Mutator.keys(_instance)) {
          const value: unknown = _instance[key];
          if (!references.has(key) && isMutable(value))
            _out[key] = value.mutator();
          else if (!references.has(key) && (value instanceof MutableArray || value instanceof Mutable))
            _out[key] = value.getMutator();
          else if (Array.isArray(value)) 
            _out[key] = mutatorFromArray(value);
          else
            _out[key] = value;
        }

        return _out;
      }

      function mutatorFromArray(_array: unknown[]): Mutator {
        const mutator: Mutator = new Array(_array.length);
        for (let i: number = 0; i < _array.length; i++) {
          const element: unknown = _array[i];
          if (isMutable(element))
            mutator[i] = element.mutator();
          else if (element instanceof MutableArray || element instanceof Mutable)
            mutator[i] = element.getMutator();
          else if (Array.isArray(element))
            mutator[i] = mutatorFromArray(element);
          else
            mutator[i] = element;
        }

        return mutator;
      }

      export async function mutateDecorations<T extends object>(_instance: T, _mutator: Mutator): Promise<T> {
        const references: ReadonlySet<string> = Mutator.references(_instance);
        for (const key of Mutator.keys(_instance)) {
          const mutant: unknown = Reflect.get(_instance, key);
          const value: unknown = _mutator[key];

          if (value != null && !references.has(key) && isMutable(mutant) || (mutant instanceof MutableArray || mutant instanceof Mutable))
            await mutant.mutate(value);
          else if (Array.isArray(mutant) && Array.isArray(value))
            await mutateArray(mutant, value);
          else
            Reflect.set(_instance, key, value);
        }

        return _instance;
      }

      async function mutateArray(_array: unknown[], _mutator: Mutator): Promise<void> {
        for (let i: number = 0; i < _array.length; i++) {
          const element: unknown = _array[i];
          const value: unknown = _mutator[i];
          if (value != null && isMutable(element) || (element instanceof MutableArray || element instanceof Mutable))
            await element.mutate(value);
          else if (Array.isArray(element) && Array.isArray(value))
            await mutateArray(element, value);
          else
            _array[i] = value;
        }
      }

      /**
       * Base class for all editable objects. Implements {@link Mutable} and {@link Serializable} by using the serialization and mutator decorators.
       */
      export abstract class Editable extends EventTargetUnified implements Mutable, Serializable {
        public get isMutable(): true {
          return true;
        }

        public get isSerializable(): true {
          return true;
        }

        public serialize(): Serialization {
          return serializeDecorations(this);
        }

        public deserialize(_serialization: Serialization): Promise<Editable> | Editable;
        public deserialize(_serialization: Serialization): Promise<Editable> {
          return deserializeDecorations(this, _serialization);
        }

        public mutator(): Mutator {
          return mutatorFromDecorations(this);
        }

        public mutate(_mutator: Mutator, _dispatchMutate?: boolean): Promise<Editable> | Editable;
        public mutate(_mutator: Mutator): Promise<Editable> {
          return mutateDecorations(this, _mutator);
        }
      }

      /**
       * Base class for all resources. Implements {@link SerializableResource}.
       */
      export abstract class Resource extends Editable implements SerializableResource {
        /** subclasses get a iSubclass number for identification */
        public static readonly iSubclass: number;
        /** refers back to this class from any subclass e.g. in order to find compatible other resources */
        public static readonly baseClass: typeof Resource = Resource;
        /** list of all the subclasses derived from this class, if they registered properly */
        public static readonly subclasses: typeof Resource[] = [];

        public idResource: string;
        public name: string;

        protected static registerSubclass(_subclass: typeof Resource): number { return this.subclasses.push(_subclass) - 1; }

        public get isSerializableResource(): true {
          return true;
        }
      }

      export abstract class Component extends Editable {
        /** subclasses get a iSubclass number for identification */
        public static readonly iSubclass: number;
        /** refers back to this class from any subclass e.g. in order to find compatible other resources */
        public static readonly baseClass: typeof Component = Component;
        /** list of all the subclasses derived from this class, if they registered properly*/
        public static readonly subclasses: typeof Component[] = [];

        protected static registerSubclass(_subclass: typeof Component): number { return this.subclasses.push(_subclass) - 1; }
      }

      export class Node extends EventTargetUnified implements Serializable {
        public get isSerializable(): true {
          return true;
        }

        public serialize(): Serialization {
          throw new Error("Method not implemented.");
        }

        public async deserialize(_serialization: Serialization): Promise<Serializable> {
          throw new Error("Method not implemented.");
        }
      }

      export class Graph extends Node implements SerializableResource {
        public idResource: string;
        public name: string;

        public get isSerializableResource(): true {
          return true;
        }
      }
    }
  }
}