namespace FudgeCore {
  /**
   * Filters synchronization between a graph instance and the graph it is connected to. If active, no synchronization occurs.
   * Maybe more finegrained in the future...
   * @authors Jirka Dell'Oro-Friedl, HFU, 2022
   * @link https://github.com/hs-furtwangen/FUDGE/wiki/Component
   */
  export class ComponentGraphFilter extends Component {
    public static readonly iSubclass: number = Component.registerSubclass(ComponentGraphFilter);
  }
}