var StateMachine;
(function (StateMachine) {
    let JOB;
    (function (JOB) {
        JOB[JOB["IDLE"] = 0] = "IDLE";
        JOB[JOB["PATROL"] = 1] = "PATROL";
        JOB[JOB["CHASE"] = 2] = "CHASE";
    })(JOB || (JOB = {}));
    var ƒAid = FudgeAid;
    window.addEventListener("load", start);
    /**
     * Instruction set to be used by StateMachine and ComponentStateMachine for this test.
     * In production code, the instructions are most likely defined within the state machines.
     */
    class GuardInstructions {
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = GuardInstructions.transitDefault;
            setup.actDefault = GuardInstructions.actDefault;
            setup.setTransition(JOB.CHASE, JOB.CHASE, this.transit);
            setup.setAction(JOB.CHASE, this.act);
            return setup;
        }
        static transitDefault(_machine) {
            log(_machine, `Default Transition   ${JOB[_machine.stateCurrent]} -> ${JOB[_machine.stateNext]}`);
        }
        static async actDefault(_machine) {
            log(_machine, `Default Action       ${JOB[_machine.stateCurrent]}`);
            await new Promise(resolve => window.setTimeout(resolve, 1000));
            let random = Math.floor(Math.random() * Object.keys(JOB).length / 2);
            _machine.transit(JOB[JOB[random]]);
            _machine.act();
        }
        static transit(_machine) {
            log(_machine, `Special Transition ! ${JOB[_machine.stateCurrent]} -> ${JOB[_machine.stateNext]}`);
        }
        static async act(_machine) {
            log(_machine, `Special Action     ! ${JOB[_machine.stateCurrent]}`);
            GuardInstructions.actDefault(_machine);
        }
    }
    class Guard extends ƒAid.StateMachine {
        static { this.instructions = GuardInstructions.get(); }
        constructor() {
            super();
            this.instructions = Guard.instructions;
        }
    }
    class ComponentGuard extends ƒAid.ComponentStateMachine {
        static { this.instructions = GuardInstructions.get(); }
        constructor() {
            super();
            this.instructions = ComponentGuard.instructions;
        }
    }
    function start() {
        let guard = new Guard();
        guard.act();
        let cmpGuard = new ComponentGuard();
        cmpGuard.act();
    }
    function log(_machine, _message) {
        let textarea = document.querySelector(`textarea#${_machine.constructor.name}`);
        textarea.value += _message + "\n";
        textarea.scrollTop = textarea.scrollHeight;
    }
})(StateMachine || (StateMachine = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxZQUFZLENBNkVyQjtBQTdFRCxXQUFVLFlBQVk7SUFDcEIsSUFBSyxHQUVKO0lBRkQsV0FBSyxHQUFHO1FBQ04sNkJBQUksQ0FBQTtRQUFFLGlDQUFNLENBQUE7UUFBRSwrQkFBSyxDQUFBO0lBQ3JCLENBQUMsRUFGSSxHQUFHLEtBQUgsR0FBRyxRQUVQO0lBRUQsSUFBTyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBRXZCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFdkM7OztPQUdHO0lBQ0gsTUFBTSxpQkFBaUI7UUFDZCxNQUFNLENBQUMsR0FBRztZQUNmLElBQUksS0FBSyxHQUF1QyxJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1lBQ3BGLEtBQUssQ0FBQyxjQUFjLEdBQUcsaUJBQWlCLENBQUMsY0FBYyxDQUFDO1lBQ3hELEtBQUssQ0FBQyxVQUFVLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFDO1lBQ2hELEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4RCxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVPLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBc0I7WUFDbEQsR0FBRyxDQUFDLFFBQVEsRUFBRSx3QkFBd0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRyxDQUFDO1FBRU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxV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