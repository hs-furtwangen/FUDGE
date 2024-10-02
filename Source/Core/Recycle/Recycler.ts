namespace FudgeCore {

  /**
   * Interface to be implemented by objects that can be recycled, i.e. to avoid garbage collection by reusing the object instead of replacing it with a new one.
   */
  export interface Recycable {
    /**
     * Recycles the object for the next reuse by setting its properties to their default states.
     */
    recycle(): void;
  }

  /**
   * Keeps a depot of objects that have been marked for reuse, sorted by type.  
   * Using {@link Recycler} reduces load on the carbage collector and thus supports smooth performance.
   * @author Jirka Dell'Oro-Friedl, HFU, 2021
   * @link https://github.com/hs-furtwangen/FUDGE/wiki/Recycler
   */
  export abstract class Recycler {
    private static depot: { [type: string]: RecycableArray<Object> } = {};

    /**
     * Fetches an object of the requested type from the depot, calls its recycle-method and returns it.
     * If the depot for that type is empty it returns a new object of the requested type.
     * @param _t The class identifier of the desired object
     */
    public static get<T extends Recycable | RecycableArray<T> | Object>(_t: new () => T): T {
      let key: string = _t.name;
      let instances: RecycableArray<Object> = Recycler.depot[key];
      if (instances && instances.length > 0) {
        let instance: T = <T>instances.pop();
        (<Recycable>instance).recycle?.();
        return instance;
      } else
        return new _t();
    }

    /**
     * Fetches an object of the requested type from the depot and returns it. ⚠️**DOES NOT** call its recycle-method.
     * Faster than {@link Recycler.get}, but should be used with caution.
     */
    public static reuse<T extends Object>(_t: new () => T): T {
      return <T>Recycler.depot[_t.name]?.pop() ?? new _t();
    }

    /**
     * Stores the object in the depot for later recycling. Users are responsible for throwing in objects that are about to loose scope and are not referenced by any other
     * @param _instance
     */
    public static store(_instance: Object): void {
      // let key: string = _instance.constructor.name;
      // //Debug.log(key);
      // let instances: RecycableArray<Object> = RecyclerNew.depot[key] || new RecycableArray<Object>();
      // instances.push(_instance);
      // RecyclerNew.depot[key] = instances;
      // Debug.log(`ObjectManager.depot[${key}]: ${ObjectManager.depot[key].length}`);
      //Debug.log(this.depot);
      (Recycler.depot[_instance.constructor.name] ??= new RecycableArray<Object>()).push(_instance);
    }

    /**
     * Stores the provided objects using the {@link Recycler.store} method
     */
    public static storeMultiple(..._instances: Object[]): void { // TODO: maybe make this the default store method
      for (const instance of _instances)
        Recycler.store(instance);
    }

    /**
     * Emptys the depot of a given type, leaving the objects for the garbage collector. May result in a short stall when many objects were in
     * @param _t
     */
    public static dump<T>(_t: new () => T): void {
      Recycler.depot[_t.name] = new RecycableArray<Object>();
    }

    /**
     * Emptys all depots, leaving all objects to the garbage collector. May result in a short stall when many objects were in
     */
    public static dumpAll(): void {
      Recycler.depot = {};
    }
  }
}