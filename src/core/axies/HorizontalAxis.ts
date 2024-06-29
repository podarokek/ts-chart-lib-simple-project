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
    console.log("RENDER X AXIS");
    console.log(renderData.visibleRange, drawablePlane);

    if (
      renderData.visibleRange.fromDataIndex === null ||
      renderData.visibleRange.toDataIndex === null
    )
      return;

    const { min, max } = this.getMinMaxTime(renderData);
    console.log({ min, max });

    const step = this.calculateTimeStep(min, max, 6);
    console.log({ step });

    const labels = this.createTimeLabels(min, max, step);
    console.log({ labels });

    labels.forEach((label) => {
      // const x = drawablePlane.width * ((label - min) / (max - min));
      // canvasManager.drawLine(
      //   drawablePlane.x + x,
      //   drawablePlane.y,
      //   drawablePlane.x + x,
      //   drawablePlane.y + drawablePlane.height,
      //   "black"
      // );

      const text = new Date(label).toISOString().substr(11, 8);
      const textWidth = canvasManager.context.measureText(text).width;
      let x = drawablePlane.width * ((label - min) / (max - min));

      let textAlign = "center" as CanvasTextAlign;

      if (x - textWidth / 2 < 0) {
        x = textWidth / 2;
        textAlign = "start";
      } else if (x + textWidth / 2 > drawablePlane.width) {
        x = drawablePlane.width - textWidth / 2;
        textAlign = "end";
      }

      canvasManager.drawText(
        x,
        drawablePlane.y + drawablePlane.height / 2,
        text,
        "black",
        textAlign,
        "middle" as CanvasTextBaseline
      );
    });
  }

  createTimeLabels(min: number, max: number, step: number): number[] {
    const labels = [];
    for (let time = Math.ceil(min / step) * step; time <= max; time += step) {
      labels.push(time);
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
