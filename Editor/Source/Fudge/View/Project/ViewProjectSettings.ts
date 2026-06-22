namespace Fudge {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;

  /**
   * List the scripts loaded
   * @author Jonas Plotzky, HFU, 2026
   */
  export class ViewProjectSettings extends View { // TODO: serialize the settings
    private settings: object;

    public constructor(_container: ComponentContainer, _state: ViewState) {
      super(_container, _state);

      this.settings = ƒ.ProjectSettings.getMutable();
      const domElement: HTMLDivElement = ƒui.Generator.createInterfaceFromFlatMutable(this.settings);
      new ControllerDetail(this.settings, domElement, this);

      this.dom.appendChild(domElement);
    }

  }
}