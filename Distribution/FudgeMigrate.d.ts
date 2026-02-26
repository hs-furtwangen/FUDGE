declare namespace FudgeMigrate {
    import ƒ = FudgeCore;
    import Serialization = ƒ.Serialization;
    import Serializable = ƒ.Serializable;
    import General = ƒ.General;
    type MigrateFunction = (this: Serializable, _serialization: ƒ.Serialization) => Serialization;
    function register(_class: abstract new (..._params: General[]) => Serializable, _migrate: MigrateFunction): void;
}
declare namespace FudgeCore {
    /**
     * @deprecated Use ComponentAnimation instead of ComponentAnimator. Exists only for backwards compatibility. Will be removed in future versions.
     */
    class ComponentAnimator extends ComponentAnimation {
    }
}
