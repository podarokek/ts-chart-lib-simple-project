import CanvasManager from "./CanvasManager";
import Plot from "./Plot";

import { DataCellType } from "./FTDataUtils";

export interface VisibleRangeType {
  length: number;
  fromIndex: number;
}

export interface MinMaxValuesType {
  max: { [key: string]: number };
  min: { [key: string]: number };
}

class Chart {
  protected canvas: HTMLCanvasElement;
  protected canvasManager: CanvasManager;

  protected plots: Plot[];

  protected data: DataCellType[] = [];

  protected visibleRange: VisibleRangeType;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasManager = new CanvasManager(this.canvas);

    this.visibleRange = {
      length: 10,
      fromIndex: 0,
    };

    this.plots = [];
  }

  // TODO change any to proper type
  loadData(data: any) {
    this.data = data[0].Bars;
    this.render();
  }

  createPlot() {
    const plot = new Plot(this.canvasManager);
    this.plots.push(plot);
    return plot;
  }

  render() {
    this.canvasManager.clear();

    for (const plot of this.plots) {
      plot.render(this.data, this.visibleRange, this.calculateMinMaxValues());
    }

    return;
  }

  protected findMinMaxValuesForKey(key: string): [number, number] {
    const firstIndex = Math.max(0, this.visibleRange.fromIndex);
    const lastIndex = Math.min(
      this.data.length,
      this.visibleRange.fromIndex + this.visibleRange.length
    );

    const min = Math.min(
      ...this.data
        .slice(firstIndex, lastIndex)
        .map((d: DataCellType) => (d as any)[key])
    );
    const max = Math.max(
      ...this.data
        .slice(firstIndex, lastIndex)
        .map((d: DataCellType) => (d as any)[key])
    );

    return [min, max];
  }

  public calculateMinMaxValues(keys?: string[]): MinMaxValuesType {
    if (!this.data.length) return { max: {}, min: {} };

    if (!keys) {
      keys = Object.keys(this.data[0]);
    }

    return keys.reduce(
      (acc: MinMaxValuesType, key: string) => {
        const [min, max] = this.findMinMaxValuesForKey(key);
        acc.min[key] = min;
        acc.max[key] = max;
        return acc;
      },
      {
        min: {},
        max: {},
      }
    );
  }

  destroy() {
    // TODO
  }
}

export default Chart;
