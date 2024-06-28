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
  private canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public config: {
    raiseColor: string;
    fallColor: string;
    volumeColor: string;
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;

    this.config = {
      raiseColor: "#b1cf8f",
      fallColor: "#f09e9e",
      volumeColor: "#e9e9e9",
    };
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }
}

export default CanvasManager;
