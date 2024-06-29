import Events from "../core/utils/Events";

import CanvasManager from "./CanvasManager";
import Mapping from "./Mapping";
import Plot from "./Plot";

import { DataCellType } from "./data/FTDataUtils";

export interface VisibleRangeType {
  length: number;
  fromIndex: number;
  fromDataIndex: number | null;
  toDataIndex: number | null;
}

export interface MinMaxValuesType {
  max: { [key: string]: number | null };
  min: { [key: string]: number | null };
}

export interface RenderDataType {
  data: DataCellType[];
  visibleRange: VisibleRangeType;
  minMaxValues: MinMaxValuesType;
}

class Chart extends Events {
  protected canvas: HTMLCanvasElement;
  protected canvasManager: CanvasManager;

  protected plots: Plot[];

  protected data: DataCellType[] = [];

  protected visibleRange: VisibleRangeType;

  constructor(canvas: HTMLCanvasElement) {
    super();

    this.canvas = canvas;
    this.canvasManager = new CanvasManager(this.canvas);

    this.visibleRange = {
      length: 50,
      fromIndex: 0,
      fromDataIndex: null,
      toDataIndex: null,
    };

    this.plots = [];
  }

  // TODO change any to proper type
  loadData(data: any) {
    this.data = data[0].Bars;
    this.render();
  }

  createPlot(mapping: Mapping) {
    const plot = new Plot(this.canvasManager, mapping);
    this.plots.push(plot);
    return plot;
  }

  getRenderData() {
    return {
      data: this.data,
      visibleRange: this.visibleRange,
      minMaxValues: this.calculateMinMaxValues(),
    };
  }

  render() {
    this.canvasManager.clear();

    this.updateVisibleRangeData();

    for (const plot of this.plots) {
      plot.render(this.getRenderData());
    }

    return;
  }

  protected updateVisibleRangeData() {
    const { fromDataIndex, toDataIndex } = this.getVisibleRangeDataIndexes();

    this.visibleRange.fromDataIndex = fromDataIndex;
    this.visibleRange.toDataIndex = toDataIndex;
  }

  public getVisibleRangeDataIndexes(): {
    fromDataIndex: number | null;
    toDataIndex: number | null;
  } {
    if (this.visibleRange.fromIndex + this.visibleRange.length <= 0) {
      return { fromDataIndex: null, toDataIndex: null };
    }

    if (this.visibleRange.fromIndex >= this.data.length) {
      return { fromDataIndex: null, toDataIndex: null };
    }

    return {
      fromDataIndex: Math.trunc(Math.max(0, this.visibleRange.fromIndex)),
      toDataIndex: Math.ceil(
        Math.min(
          this.data.length - 1,
          this.visibleRange.fromIndex + this.visibleRange.length
        )
      ),
    };
  }

  protected findMinMaxValuesForKey(
    key: string
  ): [number | null, number | null] {
    const { fromDataIndex, toDataIndex } = this.getVisibleRangeDataIndexes();

    if (fromDataIndex === null || toDataIndex === null) {
      return [null, null];
    }

    const min = Math.min(
      ...this.data
        .slice(fromDataIndex, toDataIndex)
        .map((d: DataCellType) => (d as any)[key])
    );
    const max = Math.max(
      ...this.data
        .slice(fromDataIndex, toDataIndex)
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
