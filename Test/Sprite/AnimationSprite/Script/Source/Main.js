var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxNQUFNLENBbUJmO0FBbkJELFdBQVUsTUFBTTtJQUNkLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBRS9DLElBQUksUUFBb0IsQ0FBQztJQUN6QixRQUFRLENBQUMsZ0JBQWdCLENBQUMsNEJBQTRCLEVBQWlCLEtBQUssQ0FBQyxDQUFDO0lBRTlFLFNBQVMsS0FBSyxDQUFDLE1BQW1CO1FBQ2hDLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRXpCLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLHVDQUFxQixNQUFNLENBQUMsQ0FBQztRQUNwRCw2SEFBNkg7SUFDL0gsQ0FBQztJQUVELFNBQVMsTUFBTSxDQUFDLE1BQWE7UUFDM0IsNERBQTREO1FBQzVELFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0FBQ0gsQ0FBQyxFQW5CUyxNQUFNLEtBQU4sTUFBTSxRQW1CZiJ9