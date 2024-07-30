var UI;
(function (UI) {
    var ƒ = FudgeCore;
    class FieldSet extends HTMLFieldSetElement {
        constructor(_name = "FieldSet") {
            super();
            this.name = _name;
            let legend = document.createElement("legend");
            legend.textContent = this.name;
            this.appendChild(legend);
        }
        get() {
            for (let key in this.values) {
                let input = this.querySelector("#" + key);
                this.values[key] = Number(input.value);
            }
            return this.values;
        }
        set(_values) {
            for (let key in _values) {
                let input = this.querySelector("#" + key);
                if (input)
                    input.value = String(_values[key]);
            }
        }
        disable(_config) {
            for (let key in _config) {
                let input = this.querySelector("#" + key);
                input.disabled = _config[key];
            }
        }
    }
    UI.FieldSet = FieldSet;
    class Stepper extends HTMLSpanElement {
        constructor(_label = "Stepper", params = {}) {
            super();
            this.textContent = _label + " ";
            let stepper = document.createElement("input");
            stepper.name = _label;
            stepper.type = "number";
            stepper.id = _label;
            stepper.step = String(params.step) || "1";
            this.appendChild(stepper);
        }
    }
    UI.Stepper = Stepper;
    class Border extends FieldSet {
        constructor(_name = "Border", _step = 1) {
            super(_name);
            this.values = { left: 0, right: 0, top: 0, bottom: 0 };
            this.appendChild(new Stepper("left", { step: _step }));
            this.appendChild(new Stepper("top", { step: _step }));
            this.appendChild(new Stepper("right", { step: _step }));
            this.appendChild(new Stepper("bottom", { step: _step }));
        }
    }
    UI.Border = Border;
    class Rectangle extends FieldSet {
        constructor(_name = "Rectangle") {
            super(_name);
            this.values = { x: 0, y: 0, width: 0, height: 0 };
            this.appendChild(new Stepper("x", { step: 10 }));
            this.appendChild(new Stepper("y", { step: 10 }));
            this.appendChild(new Stepper("width", { step: 10 }));
            this.appendChild(new Stepper("height", { step: 10 }));
        }
        set(_rect) {
            let values = { x: _rect.x, y: _rect.y, width: _rect.width, height: _rect.height };
            super.set(values);
        }
        get() {
            // tslint:disable no-any
            let _rect = super.get();
            return new ƒ.Rectangle(_rect.x, _rect.y, _rect.width, _rect.height);
        }
        appendButton(_label) {
            let button = document.createElement("button");
            button.textContent = _label;
            this.appendChild(button);
        }
        appendCheckbox(_label) {
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = true;
            this.appendChild(checkbox);
        }
        isLocked() {
            let checkbox = this.querySelector("[type=checkbox]");
            return !checkbox.checked;
        }
        disableAll(_disable) {
            super.disable({ x: true, y: true, width: true, height: true });
        }
    }
    UI.Rectangle = Rectangle;
    class Camera extends FieldSet {
        constructor(_name = "Camera") {
            super(_name);
            this.values = { aspect: 0, fieldOfView: 0, near: 0, far: 0 };
            this.appendChild(new Stepper("fieldOfView", { min: 5, max: 100, step: 5, value: 45 }));
            this.appendChild(new Stepper("aspect", { min: 0.1, max: 10, step: 0.1, value: 1 }));
            this.appendChild(new Stepper("near", { min: 0.01, max: 10, step: 0.01, value: 1 }));
            this.appendChild(new Stepper("far", { min: 1, max: 1000, step: 0.5, value: 10 }));
        }
    }
    UI.Camera = Camera;
    class Point extends FieldSet {
        constructor(_name = "Point") {
            super(_name);
            this.values = { x: 0, y: 0 };
            this.appendChild(new Stepper("x", { value: 0 }));
            this.appendChild(new Stepper("y", { value: 0 }));
            super.disable({ x: true, y: true });
        }
    }
    UI.Point = Point;
    class FramingScaled extends FieldSet {
        constructor(_name = "FramingScaled") {
            super(_name);
            this.values = { normWidth: 1, normHeight: 1 };
            this.result = new Rectangle("Result");
            this.result.disableAll(true);
            this.appendChild(this.result);
            this.appendChild(new Stepper("normWidth", { step: 0.1, value: 1 }));
            this.appendChild(new Stepper("normHeight", { step: 0.1, value: 1 }));
        }
        set(_values) {
            if (_values["Result"])
                this.result.set(_values["Result"]);
            else
                super.set(_values);
        }
    }
    UI.FramingScaled = FramingScaled;
    class FramingComplex extends FieldSet {
        constructor(_name = "FramingComplex") {
            super(_name);
            this.values = { Result: {}, Padding: {}, Margin: {} };
            let result = new Rectangle("Result");
            result.disableAll(true);
            this.appendChild(result);
            this.appendChild(new Border("Padding", 1));
            this.appendChild(new Border("Margin", 0.1));
        }
        get() {
            for (let child of this.children) {
                let fieldSet = child;
                let name = fieldSet.name;
                if (!this.values[name])
                    continue;
                this.values[name] = fieldSet.get();
            }
            return this.values;
        }
        set(_values) {
            for (let child of this.children) {
                let fieldSet = child;
                let name = fieldSet.name;
                if (!_values[name])
                    continue;
                fieldSet.set(_values[name]);
            }
        }
    }
    UI.FramingComplex = FramingComplex;
    class FPS extends HTMLSpanElement {
        constructor() {
            super();
            this.update = () => {
                this.innerText = "FPS: " + ƒ.Loop.fpsRealAverage.toFixed(0);
            };
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
    }
    UI.FPS = FPS;
    class Time extends HTMLSpanElement {
        constructor() {
            super();
            this.update = () => {
                this.innerText = "Time: " + this.get();
            };
            this.get = () => {
                return ƒ.Time.game.get().toFixed(0);
            };
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
    }
    UI.Time = Time;
    customElements.define("ui-stepper", Stepper, { extends: "span" });
    customElements.define("ui-framingcomplex", FramingComplex, { extends: "fieldset" });
    customElements.define("ui-scale", FramingScaled, { extends: "fieldset" });
    customElements.define("ui-rectangle", Rectangle, { extends: "fieldset" });
    customElements.define("ui-border", Border, { extends: "fieldset" });
    customElements.define("ui-camera", Camera, { extends: "fieldset" });
    customElements.define("ui-point", Point, { extends: "fieldset" });
    customElements.define("ui-fieldset", FieldSet, { extends: "fieldset" });
    customElements.define("ui-fps", FPS, { extends: "span" });
    customElements.define("ui-time", Time, { extends: "span" });
})(UI || (UI = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJVSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLEVBQUUsQ0F5Tlg7QUF6TkQsV0FBVSxFQUFFO0lBQ1YsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBS3JCLE1BQWEsUUFBUyxTQUFRLG1CQUFtQjtRQUUvQyxZQUFtQixRQUFnQixVQUFVO1lBQzNDLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxNQUFNLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUVNLEdBQUc7WUFDUixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDNUIsSUFBSSxLQUFLLEdBQXFCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixDQUFDO1FBRU0sR0FBRyxDQUFDLE9BQVc7WUFDcEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxLQUFLLEdBQXFCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJLEtBQUs7b0JBQ1AsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdkMsQ0FBQztRQUNI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