var RenderRendering;
(function (RenderRendering) {
    var ƒ = FudgeCore;
    let map = new ƒ.FramingComplex();
    let frame = new ƒ.Rectangle(0, 0, 100, 100);
    let uiMap;
    /*  let crc2: CanvasRenderingContext2D; */
    window.addEventListener("load", init);
    function init() {
        /*  let canvas: HTMLCanvasElement = document.querySelector("canvas");
         crc2 = canvas.getContext("2d"); */
        let menu = document.querySelector("div[name=menu]");
        uiMap = new UI.FramingComplex();
        menu.appendChild(uiMap);
        uiMap.addEventListener("input", hndChange);
        uiMap.set({ Anchor: map.margin, Border: map.padding });
        let uiRectangle = new UI.Rectangle("Frame");
        uiRectangle.addEventListener("input", hndChange);
        menu.appendChild(uiRectangle);
        uiRectangle.set(frame);
        uiMap.set({ Result: map.getRect(frame) });
    }
    function hndChange(_event) {
        let target = _event.currentTarget;
        setValues(target);
    }
    function setValues(_uiSet) {
        let type = _uiSet.constructor.name;
        if (type == "Rectangle") {
            frame = _uiSet.get();
        }
        else {
            let value = _uiSet.get();
            for (let key in value) {
                switch (key) {
                    case "Margin":
                        map.margin = value[key];
                        break;
                    case "Padding":
                        map.padding = value[key];
                        break;
                    case "Result":
                        break;
                    default:
                        throw (new Error("Invalid name: " + _uiSet.name));
                }
            }
        }
        uiMap.set({ Result: map.getRect(frame) });
        /*  drawRect(map.getRect(frame)); */
    }
    /*  function drawRect(_rect: ƒ.Rectangle): void {
         crc2.clearRect(0, 0, crc2.canvas.width, crc2.canvas.height)
         crc2.strokeRect(_rect.position.x, _rect.position.y, _rect.size.x, _rect.size.y);
     } */
})(RenderRendering || (RenderRendering = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFwUmVjdGFuZ2xlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1hcFJlY3RhbmdsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBVSxlQUFlLENBc0V4QjtBQXRFRCxXQUFVLGVBQWU7SUFDckIsSUFBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLElBQUksR0FBRyxHQUFxQixJQUFJLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUVuRCxJQUFJLEtBQUssR0FBZ0IsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELElBQUksS0FBd0IsQ0FBQztJQUM5QiwwQ0FBMEM7SUFFekMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUV0QyxTQUFTLElBQUk7UUFFVjsyQ0FDbUM7UUFFbEMsSUFBSSxJQUFJLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVwRSxLQUFLLEdBQUcsSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFdkQsSUFBSSxXQUFXLEdBQWlCLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxRCxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV2QixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTlDLENBQUM7SUFFRCxTQUFTLFNBQVMsQ0FBQyxNQUFhO1FBQzVCLElBQUksTUFBTSxHQUE2QixNQUFNLENBQUMsYUFBYSxDQUFDO1FBRTVELFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV0QixDQUFDO0lBRUQsU0FBUyxTQUFTLENBQUMsTUFBbUI7UUFDbEMsSUFBSSxJQUFJLEdBQVcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDM0MsSUFBSSxJQUFJLElBQUksV0FBVyxFQUFFLENBQUM7WUFDdEIsS0FBSyxHQUFnQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdEMsQ0FBQzthQUNJLENBQUM7WUFDRixJQUFJLEtBQUssR0FBTyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFN0IsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFFcEIsUUFBUSxHQUFHLEVBQUUsQ0FBQztvQkFDVixLQUFLLFFBQVE7d0JBQ1QsR0FBRyxDQUFDLE1BQU0sR0FBYSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2xDLE1BQU07b0JBQ1YsS0FBSyxTQUFTO3dCQUNWLEdBQUcsQ0FBQyxPQUFPLEdBQWEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNuQyxNQUFNO29CQUNWLEtBQUssUUFBUTt3QkFDVCxNQUFNO29CQUNWO3dCQUNJLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDMUQsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQyxvQ0FBb0M7SUFDdkMsQ0FBQztJQUVGOzs7U0FHSztBQUNSLENBQUMsRUF0RVMsZUFBZSxLQUFmLGVBQWUsUUFzRXhCIn0=