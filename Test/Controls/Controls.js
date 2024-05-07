var Controls;
(function (Controls) {
    var ƒ = FudgeCore;
    window.addEventListener("DOMContentLoaded", init);
    let controlProportional = new ƒ.Control("Proportional", 1, 0 /* ƒ.CONTROL_TYPE.PROPORTIONAL */);
    let controlIntegral = new ƒ.Control("Integral", 0.1, 1 /* ƒ.CONTROL_TYPE.INTEGRAL */);
    let controlDifferential = new ƒ.Control("Differential", 2, 2 /* ƒ.CONTROL_TYPE.DIFFERENTIAL */);
    let input;
    let output;
    let mode;
    let rateDispatchOutput = 20;
    function init(_event) {
        input = document.querySelector("fieldset#Input");
        output = document.querySelector("fieldset#Output");
        mode = document.querySelector("fieldset#Mode");
        setup();
        document.addEventListener("keydown", hndKey);
        document.addEventListener("keyup", hndKey);
        input.addEventListener("input", hndControlInput);
        mode.addEventListener("input", hndModeInput);
        update();
    }
    function setup() {
        let number = { min: "-2", max: "2", step: "0.1", value: "0.1" };
        let slider = { min: "-1", max: "1", step: "0.01", value: "0" };
        let keyboard = createFieldset("Keys A-|D+", true, number, slider, true);
        input.appendChild(keyboard);
        let absolute = createFieldset("Absolute", false, number, slider);
        input.appendChild(absolute);
        number.value = "1";
        let relative = createFieldset("Relative", false, number, slider);
        input.appendChild(relative);
        relative.setAttribute("oldValue", "0");
        let proportional = createFieldset("Proportional", true, number, slider);
        addDelayStepper(proportional);
        output.appendChild(proportional);
        number.value = "0.1";
        let integral = createFieldset("Integral", true, number, slider);
        addDelayStepper(integral);
        output.appendChild(integral);
        number.value = "2";
        let differential = createFieldset("Differential", true, number, slider);
        addDelayStepper(differential);
        output.appendChild(differential);
        controlProportional.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, function (_event) { hndControlOutput(_event, proportional); });
        controlIntegral.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, function (_event) { hndControlOutput(_event, integral); });
        controlDifferential.addEventListener("output" /* ƒ.EVENT_CONTROL.OUTPUT */, function (_event) { hndControlOutput(_event, differential); });
        proportional.addEventListener("input", function (_event) { hndControlParameters(_event, controlProportional); });
        integral.addEventListener("input", function (_event) { hndControlParameters(_event, controlIntegral); });
        differential.addEventListener("input", function (_event) { hndControlParameters(_event, controlDifferential); });
    }
    function createFieldset(_name, _readonly, _stepper, _slider, _nometer = false) {
        let fieldset = document.createElement("fieldset");
        fieldset.id = _name;
        let legend = document.createElement("legend");
        legend.innerHTML = `<strong>${_name}</strong>Factor: `;
        legend.append(createInputElement("number", _stepper));
        legend.innerHTML += " | Value: [<output>0</output>]";
        if (_readonly && !_nometer)
            legend.innerHTML += " | <meter></meter";
        fieldset.appendChild(legend);
        let slider = createInputElement("range", _slider);
        slider.disabled = _readonly;
        fieldset.append(slider);
        return fieldset;
    }
    function addDelayStepper(_fieldset) {
        _fieldset.querySelector("legend").innerHTML += ` | Delay <input type="number" min="0", max="1000" step="50" value="0" name="Delay"/>`;
    }
    function createInputElement(_type, _parameter) {
        let input = document.createElement("input");
        input.type = _type;
        input.min = _parameter.min;
        input.max = _parameter.max;
        input.step = _parameter.step;
        input.value = _parameter.value;
        input.setAttribute("value", _parameter.value);
        return input;
    }
    function hndKey(_event) {
        if (_event.repeat)
            return;
        if (_event.code != ƒ.KEYBOARD_CODE.A && _event.code != ƒ.KEYBOARD_CODE.D)
            return;
        /* // TODO: integrate sophisticated key handling
    
        let value: number = (_event.code == ƒ.KEYBOARD_CODE.A) ? -1 : 1;
        if (_event.type == "keyup")
          value = 0; */
        let value = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.A])
            + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.D]));
        let slider = document.querySelector("input[type=range");
        slider.value = value.toString();
        slider.dispatchEvent(new InputEvent("input", { bubbles: true }));
    }
    function updateFieldsetOutput(_slider) {
        let fieldset = _slider.parentElement;
        let factor = parseFloat(fieldset.querySelector("input").value);
        let value = parseFloat(_slider.value);
        if (fieldset.id == "Relative") {
            let old = parseFloat(fieldset.getAttribute("oldValue"));
            let relative = value - old;
            fieldset.setAttribute("oldValue", value.toString());
            value = relative;
        }
        value *= factor;
        fieldset.querySelector("output").textContent = format(value);
        return value;
    }
    function hndModeInput(_event) {
        let target = document.querySelector("input#Polling");
        rateDispatchOutput = 100;
        if (target.checked) {
            rateDispatchOutput = 0;
            update();
        }
        controlProportional.setRateDispatchOutput(rateDispatchOutput);
        controlDifferential.setRateDispatchOutput(rateDispatchOutput);
        controlIntegral.setRateDispatchOutput(rateDispatchOutput);
    }
    function hndControlInput(_event) {
        let target = _event.target;
        if (target.type != "range")
            return;
        let value = updateFieldsetOutput(target);
        controlProportional.setInput(value);
        controlDifferential.setInput(value);
        controlIntegral.setInput(value);
        let signals = document.querySelector("textarea");
        signals.textContent += target.parentElement.id + ": " + format(value) + "\n";
        signals.scrollTop = signals.scrollHeight;
    }
    function hndControlParameters(_event, _control) {
        let target = _event.target;
        let fieldset = _event.currentTarget;
        let value = parseFloat(target.value);
        if (target.name == "Delay")
            _control.setDelay(value);
        else
            _control.setFactor(value);
    }
    function hndControlOutput(_event, _fieldset) {
        let control = _event.target;
        let slider = _fieldset.querySelector("input[type=range]");
        let value;
        if (_event.detail)
            value = _event.detail.output;
        else
            value = control.getOutput();
        slider.value = value.toString();
        slider.parentElement.querySelector("output").textContent = format(value);
        updateMeter(_fieldset);
    }
    function update() {
        updateMeter(document);
        controlProportional.dispatchEvent(new Event("output" /* ƒ.EVENT_CONTROL.OUTPUT */));
        controlDifferential.dispatchEvent(new Event("output" /* ƒ.EVENT_CONTROL.OUTPUT */));
        controlIntegral.dispatchEvent(new Event("output" /* ƒ.EVENT_CONTROL.OUTPUT */));
        let target = document.querySelector("input#Polling");
        if (target.checked)
            window.setTimeout(update, 10);
    }
    function updateMeter(_ancestor) {
        let meter = _ancestor.querySelector("meter");
        meter.value = (meter.value + 0.01) % 1;
    }
    function format(_value) {
        return _value.toFixed(4).padStart(7, "+");
    }
})(Controls || (Controls = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJvbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb250cm9scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLFFBQVEsQ0FnTmpCO0FBaE5ELFdBQVUsUUFBUTtJQUNoQixJQUFPLENBQUMsR0FBRyxTQUFTLENBQUM7SUFFckIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2xELElBQUksbUJBQW1CLEdBQWMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLHNDQUE4QixDQUFDO0lBQ25HLElBQUksZUFBZSxHQUFjLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxrQ0FBMEIsQ0FBQztJQUN6RixJQUFJLG1CQUFtQixHQUFjLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxzQ0FBOEIsQ0FBQztJQUVuRyxJQUFJLEtBQTBCLENBQUM7SUFDL0IsSUFBSSxNQUEyQixDQUFDO0lBQ2hDLElBQUksSUFBeUIsQ0FBQztJQUM5QixJQUFJLGtCQUFrQixHQUFXLEVBQUUsQ0FBQztJQUlwQyxTQUFTLElBQUksQ0FBQyxNQUFhO1FBQ3pCLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakQsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNuRCxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUUvQyxLQUFLLEVBQUUsQ0FBQztRQUVSLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0MsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FB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