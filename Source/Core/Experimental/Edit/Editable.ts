namespace FudgeCore {
  export namespace Experimental {
    export namespace Edit {
      // #region Contracts
      export interface Mutable {
        mutator(): Mutator;
        mutate(_mutator: Mutator, _dispatchMutate?: boolean): Promise<Mutable> | Mutable;
      }

      export function isMutable(_object: Object): _object is Mutable {
        return (_object && Reflect.has(_object, "mutator") && Reflect.has(_object, "mutate"));
      }

      export interface Serializable {
        serialize(): Serialization;
        deserialize(_serialization: Serialization): Promise<Serializable> | Serializable;
      }

      export function isSerializable(_object: Object): _object is Serializable {
        return (_object && Reflect.has(_object, "serialize") && Reflect.has(_object, "deserialize"));
      }

      /**
       * Interface for resources, identified by a unique id and a human readable name. Extends {@link Serializable}.
       * Resource constructors should be parameterless and need to be registered using {@link registerResourceClass} to appear in the resource list of the editor.
       */
      export interface Resource extends Serializable {
        idResource: string;
        name: string;
      }

      export function isResource(_object: Object): _object is Resource {
        return (_object && Reflect.has(_object, "idResource") && Reflect.has(_object, "name"));
      }
      // #endregion


      //
      export function registerComponentClass(_class: () => Component) {
        return;
      }

      export function registerResourceClass(_class: () => Resource) {
        return;
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

      // #region Base
      /**
       * Optional base class for all editable objects. Implements {@link Mutable} and {@link Serializable} by using the {@link serialize serialization} and {@link type mutator} decorator systems. Extends {@link EventTargetUnified} for event handling.
       * Use this class if you want to implement {@link Mutable} and {@link Serializable} without writing boilerplate code. Copy the implementation to your class if you are unable to extend this class.
       */
      export abstract class Editable extends EventTargetUnified implements Mutable, Serializable {
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

      // #endregion

      export abstract class Component extends Editable {
      }



      export class Node extends EventTargetUnified implements Serializable {
        public serialize(): Serialization {
          throw new Error("Method not implemented.");
        }

        public async deserialize(_serialization: Serialization): Promise<Serializable> {
          throw new Error("Method not implemented.");
        }
      }

      export class Graph extends Node implements Resource {
        public idResource: string;
        public name: string;
      }
    }
  }
}