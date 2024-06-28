class CanvasManager {
  private canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBar(x: number, y: number, width: number, height: number, color: string) {
    console.log("drawBar", x, y, width, height, color);
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
    console.log("drawBar done", this.context);
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }
}

export default CanvasManager;
