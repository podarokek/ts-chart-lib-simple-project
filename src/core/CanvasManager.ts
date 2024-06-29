import DrawablePlane from "./utils/DrawablePlane";

export enum OHLCBarType {
  Rising,
  Falling,
  Neutral,
}

export interface DrawOhlcBarParams {
  x: number;
  y: number;
  w: number;
  h: number;
  H: number;
  rectTopPosition: number;
  barType: OHLCBarType;
}

export interface DrawColumnBarParams {
  x: number;
  y: number;
  w: number;
  h: number;
}

class CanvasManager {
  private _canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public config: {
    raiseColor: string;
    fallColor: string;
    volumeColor: string;
  };

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    this.context = canvas.getContext("2d")!;

    this.config = {
      raiseColor: "#b1cf8f",
      fallColor: "#f09e9e",
      volumeColor: "#e9e9e9",
    };

    this.adjustCanvasForHighDPI();
  }

  adjustCanvasForHighDPI(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.context.scale(dpr, dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  clear() {
    this.context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  drawOhlcBar({ x, y, w, h, H, rectTopPosition, barType }: DrawOhlcBarParams) {
    const color =
      barType === OHLCBarType.Falling
        ? this.config.fallColor
        : this.config.raiseColor;
    const middleX = x + w / 2;

    if (barType === OHLCBarType.Rising || barType === OHLCBarType.Falling) {
      this.context.beginPath();
      this.context.lineWidth = 1;
      this.context.strokeStyle = color;
      this.context.moveTo(middleX, y);
      this.context.lineTo(middleX, y + H);
      this.context.stroke();

      this.context.fillStyle = color;
      this.context.fillRect(x, rectTopPosition, w, h);
    } else {
      // Close = Open
      this.context.beginPath();
      this.context.lineWidth = 1;
      this.context.strokeStyle = color;
      this.context.moveTo(middleX, y);
      this.context.lineTo(middleX, y + H);
      this.context.stroke();

      this.context.beginPath();
      this.context.lineWidth = 1;
      this.context.strokeStyle = color;
      this.context.moveTo(x, rectTopPosition);
      this.context.lineTo(x + w, rectTopPosition);
      this.context.stroke();
    }
  }

  drawColumnBar({ x, y, w, h }: DrawColumnBarParams) {
    this.context.fillStyle = this.config.volumeColor;
    this.context.fillRect(x, y, w, h);
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, color: string) {
    this.context.beginPath();
    this.context.lineWidth = 1;
    this.context.strokeStyle = color;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  drawText(
    x: number,
    y: number,
    text: string,
    color: string = "black",
    textAlign: CanvasTextAlign = "left",
    textBaseline: CanvasTextBaseline = "bottom"
  ) {
    this.context.fillStyle = color;
    this.context.font = "16px Arial";
    this.context.textAlign = textAlign;
    this.context.textBaseline = textBaseline;
    this.context.fillText(text, x, y);
  }

  public clip(drawablePlane: DrawablePlane) {
    this.context.save();
    this.context.beginPath();
    this.context.rect(
      drawablePlane.x,
      drawablePlane.y,
      drawablePlane.width,
      drawablePlane.height
    );
    this.context.clip();
  }

  public restore() {
    this.context.restore();
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

  get canvas() {
    return this._canvas;
  }
}

export default CanvasManager;
