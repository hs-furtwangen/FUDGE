
namespace FudgeCore {
  export interface PerformanceMeasurement {
    start?: number;
    frameTimeMin: number;
    frameTimeMax: number;
    frameTimeAvg: number;
    callsPerFrame: number;

    time: number;
    calls: number;
  }

  export class PerformanceMonitor {
    public static display: HTMLPreElement;
    static {
      window.addEventListener("load", () => PerformanceMonitor.display = document.body.appendChild(new PerformanceDisplay()));
    }

    public static measurements: { [key: string]: PerformanceMeasurement } = {};

    private static readonly framesToAverage: number = 60;

    public static measure(_name?: string): Function {
      return (_value: General, _context: ClassMethodDecoratorContext | ClassGetterDecoratorContext | ClassFieldDecoratorContext) => {
        const name: string = _name ?? _context.name.toString();
        if (_context.kind === "method" || _context.kind === "getter") {
          return function (this: General, ..._args: General[]) {
            PerformanceMonitor.startMeasure(name);
            const result: General = _value.call(this, ..._args);
            PerformanceMonitor.endMeasure(name);
            return result;
          };
        }
        if (_context.kind === "field") {
          return function (this: General, _initialValue: General) {
            if (typeof _initialValue != "function")
              return _initialValue;

            const replacement: General = function (this: General, ..._args: General[]) {
              PerformanceMonitor.startMeasure(name);
              const result: General = _initialValue.call(this, ..._args);
              PerformanceMonitor.endMeasure(name);
              return result;
            };

            return replacement;
          };
        }

        return null;
      };
    }

    public static startMeasure(_label: string): void {
      if (!this.measurements[_label]) {
        this.measurements[_label] = {
          frameTimeMin: Number.MAX_VALUE,
          frameTimeMax: -Number.MAX_VALUE,
          frameTimeAvg: 0,
          callsPerFrame: 0,
          time: 0,
          calls: 0
        };
      }
      this.measurements[_label].start = performance.now();
    }

    public static endMeasure(_label: string): number {
      const measurement: PerformanceMeasurement = this.measurements[_label];
      if (!measurement?.start) return 0;

      const duration: number = performance.now() - measurement.start;
      measurement.time += duration;
      measurement.calls++;

      return duration;
    }

    public static startFrame(): void {
      PerformanceMonitor.startMeasure("Frame");
      for (const label in this.measurements) {
        this.measurements[label].time = 0;
        this.measurements[label].calls = 0;
      }
    }

    public static endFrame(): void {
      PerformanceMonitor.endMeasure("Frame");
      for (const label in this.measurements) {
        const measurement: PerformanceMeasurement = this.measurements[label];
        if (measurement.calls > 0) {
          const frameTotal: number = measurement.time;
          measurement.frameTimeMin = Math.min(measurement.frameTimeMin, frameTotal);
          measurement.frameTimeMax = Math.max(measurement.frameTimeMax, frameTotal);
          measurement.frameTimeAvg = ((this.framesToAverage - 1) * measurement.frameTimeAvg + frameTotal) / this.framesToAverage;
          measurement.callsPerFrame = measurement.calls;
        }
      }
    }
  }

  export class PerformanceDisplay extends HTMLPreElement {
    public constructor() {
      super();
      this.style.cssText = `
      font-family: Consolas, "Courier New", monospace;
      font-weight: bold;
      color: yellow;
      text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;
      padding: 0.2rem;
      margin: 0;
      background: rgba(0, 0, 0, 0.7);
      width: min-content;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1000;
      pointer-events: none;`;
      Loop.addEventListener(EVENT.LOOP_FRAME, this.update);
    }

    public update = (): void => {
      let longestString: number = Object.keys(PerformanceMonitor.measurements).reduce((_a, _b) => _a.length > _b.length ? _a : _b).length;

      let text: string = `${"Performance Monitor".padEnd(longestString)} |  time  |  calls\n`;
      for (let key in PerformanceMonitor.measurements) {
        let measurement: PerformanceMeasurement = PerformanceMonitor.measurements[key];
        let avg: string = measurement.frameTimeAvg.toFixed(1).padStart(4);
        let calls: string = measurement.callsPerFrame.toString().padStart(3);
        text += `${key.padEnd(longestString)} | ${avg}ms | ${calls}cpf\n`;
      }

      this.textContent = text;
    };
  }

  customElements.define("ui-performance", PerformanceDisplay, { extends: "pre" });
}
