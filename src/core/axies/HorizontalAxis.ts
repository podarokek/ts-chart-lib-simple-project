import CanvasManager from "../CanvasManager";
import { MinMaxValuesType, RenderDataType } from "../Chart";
import Mapping from "../Mapping";
import { DataCellType } from "../data/FTDataUtils";
import DrawablePlane from "../utils/DrawablePlane";
import Axis from "./Axis";

interface IndexedDataCellType {
  [key: string]: any;
}

class HorizontalAxis extends Axis {
  constructor(mapping: Mapping) {
    super(mapping);
  }

  render(
    renderData: RenderDataType,
    drawablePlaneForGrid: DrawablePlane,
    drawablePlane: DrawablePlane,
    canvasManager: CanvasManager
  ): void {
    if (
      renderData.visibleRange.fromDataIndex === null ||
      renderData.visibleRange.toDataIndex === null
    )
      return;

    const { min, max } = this.getMinMaxTime(renderData);
    const step = this.calculateTimeStep(min, max, 8);

    const labels = this.createTimeLabels(
      renderData.data,
      step,
      renderData.visibleRange.fromDataIndex,
      renderData.visibleRange.toDataIndex
    );

    labels.forEach((label) => {
      const text = new Date(label.time).toISOString().substr(11, 8);
      const textWidth = canvasManager.context.measureText(text).width;

      const segmentWidth = drawablePlane.width / renderData.visibleRange.length;
      let x =
        this.convertIndexToPixelX(label.index, drawablePlane, renderData) +
        segmentWidth / 2;

      let textAlign = "center" as CanvasTextAlign;

      if (x - textWidth / 2 < 0) {
        x = 0;
        textAlign = "start";
      } else if (x + textWidth / 2 > drawablePlane.width) {
        x = drawablePlane.x + drawablePlane.width;
        textAlign = "end";
      }

      // Draw grid
      canvasManager.drawLine(
        x,
        drawablePlaneForGrid.y,
        x,
        drawablePlaneForGrid.y + drawablePlaneForGrid.height,
        this.config.gridColor
      );

      // Draw label
      canvasManager.drawText(
        x,
        drawablePlane.y + drawablePlane.height / 2,
        text,
        this.config.fontColor,
        textAlign,
        "middle" as CanvasTextBaseline
      );
    });
  }

  convertIndexToPixelX(
    index: number,
    drawablePlane: DrawablePlane,
    renderData: RenderDataType
  ): number {
    const segmentWidth = drawablePlane.width / renderData.visibleRange.length;
    return (
      -(renderData.visibleRange.fromIndex * segmentWidth) + index * segmentWidth
    );
  }

  createTimeLabels(
    data: DataCellType[],
    step: number,
    startIndex: number,
    endIndex: number
  ): { time: number; index: number }[] {
    const labels = [];

    for (let i = startIndex; i <= endIndex; i++) {
      const dt = (data[i] as IndexedDataCellType)[this.mapping.mapping["dt"]];

      if (dt % step !== 0) continue;

      if (labels.length === 0) {
        labels.push({
          time: dt,
          index: i,
        });

        continue;
      }

      if (labels[labels.length - 1].time < dt)
        labels.push({
          time: dt,
          index: i,
        });
    }

    return labels;
  }

  getMinMaxTime(renderData: RenderDataType): {
    min: number;
    max: number;
  } {
    const { data, visibleRange } = renderData;

    const from = visibleRange.fromDataIndex as number;
    const to = visibleRange.toDataIndex as number;

    return {
      min: (data[from] as IndexedDataCellType)[this.mapping.mapping["dt"]],
      max: (data[to] as IndexedDataCellType)[this.mapping.mapping["dt"]],
    };
  }

  calculateTimeStep(min: number, max: number, maxLabels: number): number {
    const range = max - min;
    const roughStep = range / maxLabels / 1000;
    const stepSizes = [1, 5, 10, 30, 60, 300, 600, 1800, 3600, 86400]; // секунды, минуты, часы, дни
    let step = stepSizes[0];

    for (let i = 0; i < stepSizes.length; i++) {
      if (roughStep <= stepSizes[i]) {
        step = stepSizes[i];
        break;
      }
    }

    return step * 1000;
  }
}

export default HorizontalAxis;
