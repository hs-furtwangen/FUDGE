///<reference path="../DataController.ts"/>
namespace FudgeUserInterface {
  /**
   * Subclass this to create a broker between your data and a [[Table]] to display and manipulate it.
   * The [[Table]] doesn't know how your data is structured and how to handle it, the controller implements the methods needed
   */
  export abstract class TableController<T> extends DataController<T> {
    
    /** Retrieve a string to create a label for the table item representing the object (appears not to be called yet)  */
    public abstract getLabel(_object: T): string;

    /** Return false if renaming of object is not possibile, or true if the object was renamed */
    public abstract rename(_object: T, _new: string): Promise<boolean>;

    /** 
     * Return a list of TABLE-objects describing the head-titles and according properties
     */
    public abstract getHead(): TABLE[];

    /**
     * Sort data by given key and direction
     */
    public abstract sort(_data: T[], _key: string, _direction: number): void;
  }
}
