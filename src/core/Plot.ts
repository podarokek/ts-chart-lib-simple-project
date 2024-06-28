import CanvasManager from "./CanvasManager";
import { VisibleRangeType, MinMaxValuesType } from "./Chart";
import { DataCellType } from "./FTDataUtils";

import Mapping from "./Mapping";

import {
  Series,
  OHLCSeries,
  ColumnSeries,
  SeriesType,
} from "./series/index.ts";

class Plot {
  private canvasManager: CanvasManager;
  private series: { [key: string]: Series };

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.series = {};
  }

  addSeries(name: string, type: SeriesType, mapping: Mapping) {
    switch (type) {
      case SeriesType.OHLC:
        this.series[name] = new OHLCSeries(name, mapping);
        break;
      case SeriesType.Column:
        this.series[name] = new ColumnSeries(name, mapping);
        break;
      default:
        throw new Error(`Unsupported series type: ${type}`);
    }
  }

  render(
    data: DataCellType[],
    visibleRange: VisibleRangeType,
    minMaxValues: MinMaxValuesType
  ) {
    for (const key in this.series) {
      this.series[key].render(
        this.canvasManager,
        data,
        visibleRange,
        minMaxValues
      );
    }
  }
}

export default Plot;
