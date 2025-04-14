var AudioGraph;
(function (AudioGraph) {
    var ƒ = FudgeCore;
    window.addEventListener("click", start);
    let nodes = [];
    let nodeControlled;
    async function start(_event) {
        window.removeEventListener("click", start);
        window.addEventListener("keydown", handleKeydown);
        let audioMario = new ƒ.Audio("Sound/mario_piano.mp3");
        let audioTrancy = new ƒ.Audio("Sound/trancyvania.mp3");
        let audioHypno = new ƒ.Audio("Sound/hypnotic.mp3");
        // await audioHypno.asyncLoad("Sound/hypnotic.mp3");
        for (let i = 0; i < 10; i++)
            nodes.push(new ƒ.Node("Node" + i));
        let cmpAudio = new ƒ.ComponentAudio(audioHypno, true, true);
        cmpAudio.mtxPivot.translateX(2);
        nodes[0].addComponent(cmpAudio);
        cmpAudio = new ƒ.ComponentAudio(audioTrancy, true, true);
        cmpAudio.mtxPivot.translateX(-2);
        nodes[1].addComponent(cmpAudio);
        cmpAudio = new ƒ.ComponentAudio(audioMario, true, true);
        cmpAudio.mtxPivot.translateX(0);
        nodes[2].addComponent(cmpAudio);
        nodeControlled = nodes[0];
        ƒ.AudioManager.default.listenTo(nodes[0]);
        log();
    }
    function log() {
        ƒ.Debug.group(`Listening to ${ƒ.AudioManager.default.getGraphListeningTo().name}, controlling ${nodeControlled.name}`);
        for (let node of nodes) {
            let out = `node: ${node.name}`;
            if (node.getParent())
                out += ` [child of ${node.getParent().name}]`;
            let cmpAudioList = node.getComponents(ƒ.ComponentAudio);
            for (let cmpAudio of cmpAudioList)
                out += ` | ComponentAudio is active: ${cmpAudio.isActive}, listened: ${cmpAudio.isListened}, attached: ${cmpAudio.isAttached}`;
            ƒ.Debug.log(out);
        }
        ƒ.Debug.groupEnd();
    }
    function handleKeydown(_event) {
        let cmpAudio = nodeControlled.getComponent(ƒ.ComponentAudio);
        if (_event.code >= ƒ.KEYBOARD_CODE.ZERO && _event.code <= ƒ.KEYBOARD_CODE.NINE)
            nodeControlled = nodes[_event.keyCode - 48];
        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.A:
                if (cmpAudio) {
                    cmpAudio.activate(!cmpAudio.isActive);
                    // cmpAudio.play(cmpAudio.isActive);
                }
                break;
            case ƒ.KEYBOARD_CODE.P:
                let parent = parseInt(prompt("Enter the number of the node that will become the parent", "0"));
                if (parent < 0 || parent > 9)
                    throw (new Error("Index out of bounds"));
                nodes[parent].addChild(nodeControlled);
                break;
            case ƒ.KEYBOARD_CODE.C:
                if (!cmpAudio)
                    throw (new Error("No ComponentAudio attached"));
                let container = parseInt(prompt("Enter the number of the node the component attaches to", "0"));
                if (container < 0 || container > 9)
                    throw (new Error("Index out of bounds"));
                nodes[container].addComponent(cmpAudio);
                break;
            case ƒ.KEYBOARD_CODE.L:
                ƒ.AudioManager.default.listenTo(nodeControlled);
                break;
            case ƒ.KEYBOARD_CODE.U:
                ƒ.AudioManager.default.update();
                break;
        }
        log();
    }
})(AudioGraph || (AudioGraph = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQnJhbmNoTWl4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQnJhbmNoTWl4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsVUFBVSxDQXNGbkI7QUF0RkQsV0FBVSxVQUFVO0lBQ2xCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLElBQUksS0FBSyxHQUFhLEVBQUUsQ0FBQztJQUN6QixJQUFJLGNBQXNCLENBQUM7SUFHM0IsS0FBSyxVQUFVLEtBQUssQ0FBQyxNQUFhO1FBQ2hDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNsRCxJQUFJLFVBQVUsR0FBWSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUMvRCxJQUFJLFdBQVcsR0FBWSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUNoRSxJQUFJLFVBQVUsR0FBWSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM1RCxvREFBb0Q7UUFHcEQsS0FBSyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFckMsSUFBSSxRQUFRLEdBQXFCLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlFLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hD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