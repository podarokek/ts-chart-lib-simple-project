import CanvasManager from "./CanvasManager";
import { VisibleRangeType, MinMaxValuesType, RenderDataType } from "./Chart";
import { DataCellType } from "./data/FTDataUtils.ts";

import HorizontalAxis from "./axies/HorizontalAxis";
import VerticalAxis from "./axies/VerticalAxis";

import DrawablePlane from "./utils/DrawablePlane";

import Mapping from "./Mapping";

import {
  Series,
  OHLCSeries,
  ColumnSeries,
  SeriesType,
} from "./series/index.ts";

class Plot {
  private canvasManager: CanvasManager;
  private mapping: Mapping;
  private series: { [key: string]: Series };
  private xAxis: HorizontalAxis;
  private yAxis: VerticalAxis;
  private config: {
    xAxis: {
      height: number;
    };
    yAxis: {
      width: number;
    };
  };

  constructor(canvasManager: CanvasManager, mapping: Mapping) {
    this.canvasManager = canvasManager;
    this.series = {};
    this.mapping = mapping;
    this.xAxis = new HorizontalAxis(mapping);
    this.yAxis = new VerticalAxis(mapping);

    this.config = {
      xAxis: {
        height: 30,
      },
      yAxis: {
        width: 70,
      },
    };
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

  getDrawablePlanes() {
    // TODO переделать
    return {
      series: new DrawablePlane(
        0,
        0,
        this.canvasManager.width - this.config.yAxis.width,
        this.canvasManager.height - this.config.xAxis.height
      ),
      xAxis: new DrawablePlane(
        0,
        this.canvasManager.height - this.config.xAxis.height,
        this.canvasManager.width - this.config.yAxis.width,
        this.config.xAxis.height
      ),
      yAxis: new DrawablePlane(
        this.canvasManager.width - this.config.yAxis.width,
        0,
        this.config.yAxis.width,
        this.canvasManager.height - this.config.xAxis.height
      ),
    };
  }

  render(renderData: RenderDataType) {
    const drawablePlanes = this.getDrawablePlanes();

    // Render X Axis
    this.canvasManager.clip(drawablePlanes.xAxis);
    this.xAxis.render(
      renderData,
      drawablePlanes.series,
      drawablePlanes.xAxis,
      this.canvasManager
    );
    this.canvasManager.restore();

    // Render Y Axis
    this.canvasManager.clip(drawablePlanes.yAxis);
    this.yAxis.render(
      renderData,
      drawablePlanes.series,
      drawablePlanes.yAxis,
      this.canvasManager
    );
    this.canvasManager.restore();

    // Render Series
    this.canvasManager.clip(drawablePlanes.series);

    for (const key in this.series) {
      // TODO continue only if series is not in visible range not data
      if (
        renderData.visibleRange.fromIndex === null ||
        renderData.visibleRange.length === null
      )
        break;

      this.series[key].render(
        this.canvasManager,
        renderData,
        drawablePlanes.series
      );
    }

    this.canvasManager.restore();
  }
}

export default Plot;
