import Chart from "./Chart";

class InteractiveChart extends Chart {
  public config: {
    onScrollFactor: number;
    minVisibleRangeLength: number;
  };

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.config = {
      onScrollFactor: 0.1,
      minVisibleRangeLength: 10,
    };

    this.addEventListeners();
  }

  private addEventListeners() {
    this.canvasManager.canvas.addEventListener(
      "wheel",
      this.onScroll.bind(this)
    );
    this.canvasManager.canvas.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this)
    );
  }

  private onScroll(event: WheelEvent) {
    event.preventDefault();
    const delta =
      event.deltaY > 0
        ? 1 + this.config.onScrollFactor
        : 1 - this.config.onScrollFactor;

    const boundingRect = this.canvasManager.canvas.getBoundingClientRect();
    const positionPercent =
      (event.clientX - boundingRect.x) / this.canvasManager.width;

    const newVisibleRangeLength =
      this.visibleRange.length * delta < this.config.minVisibleRangeLength
        ? this.config.minVisibleRangeLength
        : this.visibleRange.length * delta;

    this.visibleRange.fromIndex +=
      (this.visibleRange.length - newVisibleRangeLength) * positionPercent;
    this.visibleRange.length = newVisibleRangeLength;

    const { fromDataIndex, toDataIndex } = this.getVisibleRangeDataIndexes();
    this.visibleRange.fromDataIndex = fromDataIndex;
    this.visibleRange.toDataIndex = toDataIndex;

    this.render();
  }

  private onMouseDown(event: MouseEvent) {
    let startX = event.clientX;
    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;

      startX = moveEvent.clientX;
      this.visibleRange.fromIndex -=
        deltaX / (this.canvasManager.width / this.visibleRange.length);

      this.render();
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }
}

export default InteractiveChart;
