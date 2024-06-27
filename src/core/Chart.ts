import CanvasManager from "./CanvasManager";

// TODO one interface for all project!
interface DataCell {
  time: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class Chart {
  private canvas: HTMLCanvasElement;
  private canvasManager: CanvasManager;
  // TODO change any to proper type
  private data: DataCell[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasManager = new CanvasManager(this.canvas);
  }

  // TODO change any to proper type
  loadData(data: any) {
    console.log(data);
    this.data = data;
    this.render();
  }

  render() {
    this.canvasManager.clear();
    const barWidth = 5;
    let xPos = 0;

    this.data.forEach((cell) => {
      const color = cell.close >= cell.open ? "green" : "red";
      const height = Math.abs(cell.close - cell.open);
      const y = Math.min(cell.open, cell.close);

      this.canvasManager.drawBar(xPos, y, barWidth, height, color);
      xPos += barWidth + 1; // add space between bars
    });
  }

  destroy() {
    // TODO
  }
}

export default Chart;
