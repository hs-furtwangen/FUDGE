
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
    public static canvas: HTMLCanvasElement;
    public static context: CanvasRenderingContext2D;

    public static measurements: { [key: string]: PerformanceMeasurement } = {};

    static #width: number = 100;
    static #longestString: number = 0;
    static #height: number = 0;
    static #framesToAverage: number = 60;

    static {
      window.addEventListener("load", () => {
        const display: HTMLCanvasElement = document.createElement("canvas");
        display.width = this.#width;
        display.height = this.#height;
        display.style.cssText = `font-family: Consolas, "Courier New", monospace;
        font-weight: bold;
        color: yellow;
        text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;
        margin: 0;
        background: rgba(0, 0, 0, 0.7);
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1000;
        pointer-events: none;`;
        const context: CanvasRenderingContext2D = display.getContext("2d");

        Reflect.set(context, "text", "context");
        PerformanceMonitor.canvas = display;
        PerformanceMonitor.context = context;
        document.body.appendChild(display);
      });
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

        this.resize(this.#width, this.#height + 15);
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
          measurement.frameTimeAvg = ((this.#framesToAverage - 1) * measurement.frameTimeAvg + frameTotal) / this.#framesToAverage;
          measurement.callsPerFrame = measurement.calls;
        }
      }

      const context: CanvasRenderingContext2D = PerformanceMonitor.context;
      context.clearRect(0, 0, this.#width, this.#height);

      let x: number = 5;
      let y: number = 14;
      for (let key in PerformanceMonitor.measurements) {
        const length: number = key.length;
        if (length > PerformanceMonitor.#longestString) {
          PerformanceMonitor.#longestString = length;
          PerformanceMonitor.resize(length * 8 + 45, PerformanceMonitor.#height);
        }

        let measurement: PerformanceMeasurement = PerformanceMonitor.measurements[key];
        context.fillText(key, x, y);
        context.fillText(measurement.frameTimeAvg.toFixed(3), x + PerformanceMonitor.#longestString * 8, y);
        y += 14;
      }
    }

    private static resize(_width: number, _height: number): void {
      this.#width = _width;
      this.#height = _height;
      this.canvas.width = _width;
      this.canvas.height = _height;
      this.context.fillStyle = "Yellow";
      this.context.font = "14px Consolas, 'Courier New', monospace";
    }
  }
}
