var ClientTest;
(function (ClientTest) {
    var ƒ = FudgeCore;
    var ƒClient = FudgeNet.FudgeClient;
    ƒ.Debug.setFilter(ƒ.DebugConsole, ƒ.DEBUG_FILTER.ALL);
    let idRoom;
    // Create a FudgeClient for this browser tab
    let client = new ƒClient();
    // keep a list of known clients, updated with information from the server
    let clientsKnown = {};
    window.addEventListener("load", start);
    async function start(_event) {
        document.forms[0].querySelector("button#connect").addEventListener("click", connectToServer);
        document.forms[0].querySelector("button#rename").addEventListener("click", rename);
        document.forms[0].querySelector("button#mesh").addEventListener("click", structurePeers);
        document.forms[0].querySelector("button#host").addEventListener("click", structurePeers);
        document.forms[0].querySelector("button#disconnect").addEventListener("click", structurePeers);
        document.forms[0].querySelector("fieldset#rooms").addEventListener("click", hndRoom);
        document.forms[0].querySelector("button#reset").addEventListener("click", structurePeers);
        document.forms[1].querySelector("fieldset").addEventListener("click", sendMessage);
        createTable();
    }
    function hndRoom(_event) {
        if (!(_event.target instanceof HTMLButtonElement))
            return;
        let command = _event.target.textContent;
        switch (command) {
            case "Get":
                client.dispatch({ command: FudgeNet.COMMAND.ROOM_GET_IDS, route: FudgeNet.ROUTE.SERVER });
                break;
            case "Create":
                client.dispatch({ command: FudgeNet.COMMAND.ROOM_CREATE, route: FudgeNet.ROUTE.SERVER });
                break;
            case "Join":
                let idRoom = document.forms[0].querySelector("fieldset#rooms>input").value;
                console.log("Enter", idRoom);
                client.dispatch({ command: FudgeNet.COMMAND.ROOM_ENTER, route: FudgeNet.ROUTE.SERVER, content: { room: idRoom } });
                break;
                break;
        }
    }
    async function connectToServer(_event) {
        let domServer = document.forms[0].querySelector("input[name=server");
        try {
            // connect to a server with the given url
            client.connectToServer(domServer.value);
            await delay(1000);
            // document.forms[0].querySelector("button#login").removeAttribute("disabled");
            document.forms[0].querySelector("button#mesh").removeAttribute("disabled");
            document.forms[0].querySelector("button#host").removeAttribute("disabled");
            document.forms[0].querySelector("input#id").value = client.id;
            // install an event listener to be called when a message comes in
            client.addEventListener(FudgeNet.EVENT.MESSAGE_RECEIVED, receiveMessage);
        }
        catch (_error) {
            console.log(_error);
            console.log("Make sure, FudgeServer is running and accessable");
        }
    }
    async function rename(_event) {
        let domProposeName = document.forms[0].querySelector("input[name=proposal]");
        let domName = document.forms[0].querySelector("input[name=name]");
        domName.value = domProposeName.value;
        // associate a readable name with this client id
        client.loginToServer(domName.value);
    }
    async function receiveMessage(_event) {
        if (_event instanceof MessageEvent) {
            let message = JSON.parse(_event.data);
            if (message.command != FudgeNet.COMMAND.SERVER_HEARTBEAT && message.command != FudgeNet.COMMAND.CLIENT_HEARTBEAT)
                showMessage(message);
            switch (message.command) {
                case FudgeNet.COMMAND.SERVER_HEARTBEAT:
                    if (client.name == undefined)
                        proposeName();
                    updateTable();
                    // on each server heartbeat, dispatch this clients heartbeat
                    client.dispatch({ idRoom: idRoom, command: FudgeNet.COMMAND.CLIENT_HEARTBEAT });
                    break;
                case FudgeNet.COMMAND.CLIENT_HEARTBEAT:
                    let span = document.querySelector(`#${message.idSource} span`);
                    blink(span);
                    break;
                    break;
                case FudgeNet.COMMAND.DISCONNECT_PEERS:
                    client.disconnectPeers();
                    break;
                case FudgeNet.COMMAND.ROOM_GET_IDS:
                    document.forms[0].querySelector("fieldset#rooms>textarea").value = message.content.rooms.toString();
                    break;
                case FudgeNet.COMMAND.ROOM_CREATE:
                    console.log("Created room", message.content.room);
                case FudgeNet.COMMAND.ROOM_ENTER:
                    client.dispatch({ command: FudgeNet.COMMAND.ROOM_GET_IDS, route: FudgeNet.ROUTE.SERVER });
                    break;
                default:
                    break;
            }
            return;
        }
        else
            console.table(_event);
    }
    function delay(_milisec) {
        return new Promise(resolve => {
            setTimeout(() => { resolve(); }, _milisec);
        });
    }
    function proposeName() {
        // search for a free number i to use for the proposal of the name "Client" + i
        let domProposeName = document.forms[0].querySelector("input[name=proposal");
        if (document.activeElement == domProposeName)
            return; // don't interfere when user's at the element
        let i = 0;
        for (; Object.values(client.clientsInfoFromServer).find(_info => _info.name == "Client-" + i); i++)
            ;
        domProposeName.value = "Client-" + i;
    }
    function createTable() {
        let table = document.querySelector("table");
        let html = `<tr><th>&nbsp;</th><th>name</th><th>id</th><th>data</th><th>signal</th><th>connection</th><th>gather</th><th>ice</th></tr>`;
        html += `<tr><td><span>0</span></td><td>Server</td><td>&nbsp;</td><td>&nbsp;</td></tr>`;
        table.innerHTML = html;
    }
    function updateTable() {
        let table = document.querySelector("table");
        let span = document.querySelector(`td>span`); // first cell is server blinker
        blink(span);
        for (let id in clientsKnown)
            if (!client.clientsInfoFromServer[id])
                deleteRow(id);
        // each client keeps information about all clients
        clientsKnown = client.clientsInfoFromServer;
        for (let id in clientsKnown) {
            let name = clientsKnown[id].name;
            let isHost = clientsKnown[id].isHost;
            let peer = client.peers[id];
            let row = table.querySelector(`#${id}`);
            if (row) {
                row.querySelector("td[name=name]").textContent = name + (isHost ? " (HOST)" : "");
                row.querySelector("td[name=data]").textContent = peer?.dataChannel?.readyState;
                row.querySelector("td[name=signal]").textContent = peer?.signalingState;
                row.querySelector("td[name=connection]").textContent = peer?.connectionState;
                row.querySelector("td[name=gather]").textContent = peer?.iceGatheringState;
                row.querySelector("td[name=ice]").textContent = peer?.iceConnectionState;
            }
            else {
                row = document.createElement("tr");
                table.appendChild(row);
                let html;
                html = `<tr id="${id}"><td><span>0</span></td><td name="name">${name}</td><td name="id">${id}</td>`;
                html += `<td name="data"></td>`;
                html += `<td name="signal"></td>`;
                html += `<td name="connection"></td>`;
                html += `<td name="gather"></td>`;
                html += `<td name="ice"></td></tr>`;
                row.outerHTML = html;
            }
        }
    }
    function deleteRow(_id) {
        let table = document.querySelector("table");
        let row = table.querySelector(`tr#${_id}`);
        table.removeChild(row.parentElement);
    }
    function blink(_span) {
        let newSpan = document.createElement("span");
        newSpan.textContent = (parseInt(_span.textContent) + 1).toString().padStart(3, "0");
        _span.parentElement.replaceChild(newSpan, _span);
    }
    function structurePeers(_event) {
        let button = _event.target;
        switch (button.textContent) {
            case "create mesh":
                // creates an RTC-Mesh, where all clients are directly connected to one another
                client.createMesh();
                break;
            case "become host":
                // creates a host structure, where all other clients are connected to this client but not to each other
                client.becomeHost();
                break;
            case "disconnect":
                client.disconnectPeers();
                break;
            default:
                // send a command to dismiss all RTC-connections
                client.dispatch({ idRoom: idRoom, command: FudgeNet.COMMAND.DISCONNECT_PEERS, route: FudgeNet.ROUTE.VIA_SERVER });
        }
    }
    function sendMessage(_event) {
        let formdata = new FormData(document.forms[1]);
        let protocol = formdata.get("protocol").toString();
        let message = formdata.get("message").toString();
        let ws = protocol == "ws";
        let receiver = formdata.get("receiver").toString();
        switch (_event.target.id) {
            //TODO insert idRoom in dispatch
            case "sendServer":
                // send the message to the server only
                client.dispatch({ idRoom: idRoom, route: FudgeNet.ROUTE.SERVER, content: { text: message } });
                break;
            case "sendHost":
                // send the message to the host via RTC or TCP
                client.dispatch({ idRoom: idRoom, route: ws ? FudgeNet.ROUTE.VIA_SERVER_HOST : FudgeNet.ROUTE.HOST, content: { text: message } });
                break;
            case "sendAll":
                // send the message to all clients (no target specified) via RTC (no route specified) or TCP (route = via server)
                client.dispatch({ idRoom: idRoom, route: ws ? FudgeNet.ROUTE.VIA_SERVER : undefined, content: { text: message } });
                break;
            case "sendClient":
                // send the message to a specific client (target specified) via RTC (no route specified) or TCP (route = via server)
                client.dispatch({ idRoom: idRoom, route: ws ? FudgeNet.ROUTE.VIA_SERVER : undefined, idTarget: receiver, content: { text: message } });
                break;
        }
    }
    function showMessage(_message) {
        console.table(_message);
        if (_message.command)
            return;
        let received = document.forms[1].querySelector("textarea#received");
        let line = (_message.route || "toPeer") + " > " + _message.idSource + "(" + clientsKnown[_message.idSource].name + "):" + JSON.stringify(_message.content);
        received.value = line + "\n" + received.value;
    }
})(ClientTest || (ClientTest = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsVUFBVSxDQWlQbkI7QUFqUEQsV0FBVSxVQUFVO0lBQ2xCLElBQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFPLE9BQU8sR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RCxJQUFJLE1BQWMsQ0FBQztJQUVuQiw0Q0FBNEM7SUFDNUMsSUFBSSxNQUFNLEdBQVksSUFBSSxPQUFPLEVBQUUsQ0FBQztJQUNwQyx5RUFBeUU7SUFDekUsSUFBSSxZQUFZLEdBQTJELEVBQUUsQ0FBQztJQUU5RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRXZDLEtBQUssVUFBVSxLQUFLLENBQUMsTUFBYTtRQUNoQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztRQUM3RixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkYsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3pGLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxj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