var TestInstructions;
(function (TestInstructions) {
    // TODO: extend with form for comment. POST with automatically collected data to https://api.github.com/repos/JirkaDellOro/FUDGE/issues https://api.github.com/repos/hs-furtwangen/FUDGE/issues
    // see: https://developer.github.com/v3/issues/#create-an-issue
    let dialog;
    let closeButton;
    let instructions;
    function display(_instructions, _open = true) {
        instructions = _instructions;
        dialog = document.createElement("dialog");
        dialogPolyfill.registerDialog(dialog);
        dialog.innerHTML += "<small>Press Ctrl+F1 to toggle this dialog</small>";
        window.addEventListener("keyup", handleKeypress);
        for (let key in _instructions) {
            let content = _instructions[key];
            switch (key) {
                case "Name":
                    document.title = content + "|Test";
                    dialog.innerHTML += "<h1>" + content + "</h1";
                    break;
                default:
                    let fieldset = document.createElement("fieldset");
                    let legend = document.createElement("legend");
                    legend.textContent = key;
                    let ul = document.createElement("ul");
                    ul.id = key;
                    for (let element of content)
                        ul.innerHTML += "<li class='dialog'>" + element + "</h1>";
                    fieldset.className = "dialog";
                    ul.className = "dialog";
                    legend.className = "dialog";
                    fieldset.appendChild(legend);
                    fieldset.appendChild(ul);
                    dialog.appendChild(fieldset);
                    break;
            }
            document.body.appendChild(dialog);
            dialog.style.zIndex = "100";
            if (_open)
                //@ts-ignore
                dialog.show();
        }
        dialog.className = "dialog";
        closeButton = document.createElement("div");
        closeButton.classList.add("dialog-button");
        closeButton.innerHTML = `<div class="a"></div><div class="b"></div><div class="c"></div>`;
        document.body.appendChild(closeButton);
        closeButton.classList.add("open");
        closeButton.addEventListener("click", toggleDialog);
        let viewportMeta = document.createElement("meta");
        viewportMeta.name = "viewport";
        viewportMeta.content = "width=device-width, initial-scale=1.0";
        // viewportMeta.outerHTML = `<meta name="viewport" content=>`;
        document.head.appendChild(viewportMeta);
    }
    TestInstructions.display = display;
    function handleKeypress(_event) {
        if (_event.code == "F1" && _event.ctrlKey)
            toggleDialog();
    }
    function toggleDialog() {
        //@ts-ignore
        if (dialog.open) {
            //@ts-ignore
            dialog.close();
            closeButton.classList.remove("open");
        }
        else {
            //@ts-ignore
            dialog.show();
            closeButton.classList.add("open");
        }
    }
    function get(_key) {
        return dialog.querySelector("ul#" + _key);
    }
    TestInstructions.get = get;
})(TestInstructions || (TestInstructions = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdEluc3RydWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlRlc3RJbnN0cnVjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxnQkFBZ0IsQ0F1RnpCO0FBdkZELFdBQVUsZ0JBQWdCO0lBQ3hCLCtMQUErTDtJQUMvTCwrREFBK0Q7SUFNL0QsSUFBSSxNQUF5QixDQUFDO0lBQzlCLElBQUksV0FBMkIsQ0FBQztJQUNoQyxJQUFJLFlBQW9CLENBQUM7SUFFekIsU0FBZ0IsT0FBTyxDQUFDLGFBQXFCLEVBQUUsUUFBaUIsSUFBSTtRQUNsRSxZQUFZLEdBQUcsYUFBYSxDQUFDO1FBQzdCLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEMsTUFBTSxDQUFDLFNBQVMsSUFBSSxvREFBb0QsQ0FBQztRQUN6RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRWpELEtBQUssSUFBSSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7WUFDOUIsSUFBSSxPQUFPLEdBQXNCLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwRCxRQUFRLEdBQUcsRUFBRSxDQUFDO2dCQUNaLEtBQUssTUFBTTtvQkFDVCxRQUFRLENBQUMsS0FBSyxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUM7b0JBQ25DLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7b0JBQzlDLE1BQU07Z0JBQ1I7b0JBQ0UsSUFBSSxRQUFRLEdBQXdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3ZFLElBQUksTUFBTSxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNqRSxNQUFNLENBQUMsV0FBVyxHQUFHLEdBQUcs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