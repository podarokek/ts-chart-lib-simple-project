import CanvasManager from "../CanvasManager";
import { RenderDataType } from "../Chart";
import Mapping from "../Mapping";
import DrawablePlane from "../utils/DrawablePlane";
import Axis from "./Axis";

class VerticalAxis extends Axis {
  constructor(mapping: Mapping) {
    super(mapping);
  }

  private calculatePriceStep(
    min: number,
    max: number,
    maxLabels: number
  ): number {
    const range = max - min;
    const roughStep = range / maxLabels;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const refinedStep = Math.ceil(roughStep / magnitude) * magnitude;
    return refinedStep;
  }

  private createPriceLabels(min: number, max: number, step: number): number[] {
    const labels = [];
    for (
      let price = Math.ceil(min / step) * step;
      price <= max;
      price += step
    ) {
      labels.push(price);
    }
    return labels;
  }

  render(
    renderData: RenderDataType,
    drawablePlaneForGrid: DrawablePlane,
    drawablePlane: DrawablePlane,
    canvasManager: CanvasManager
  ): void {
    if (!renderData.minMaxValues || !renderData.visibleRange) return;

    const min = renderData.minMaxValues.min[this.mapping.getKey("low")];
    const max = renderData.minMaxValues.max[this.mapping.getKey("high")];

    if (min == null || max == null) return;

    const step = this.calculatePriceStep(min, max, 5);
    const labels = this.createPriceLabels(min, max, step);

    const priceToY = (price: number) => {
      return (
        drawablePlane.height -
        ((price - min) / (max - min)) * drawablePlane.height
      );
    };

    // canvasManager.clip(drawablePlane);
    labels.forEach((label) => {
      const y = priceToY(label);

      // Draw grid
      canvasManager.drawLine(
        drawablePlaneForGrid.x,
        y,
        drawablePlaneForGrid.x + drawablePlaneForGrid.width,
        y,
        this.config.gridColor
      );

      // Draw label
      let baseLine;

      if (y - this.config.valueForChangingBaseLine < drawablePlane.y)
        baseLine = "top";
      else if (
        y + this.config.valueForChangingBaseLine >
        drawablePlane.y + drawablePlane.height
      )
        baseLine = "bottom";
      else baseLine = "middle";

      canvasManager.drawText(
        drawablePlane.x,
        y,
        this.formatLabel(label),
        this.config.fontColor,
        "left",
        baseLine as CanvasTextBaseline
      );
    });
    // canvasManager.restore();
  }

  public formatLabel(label: number): string {
    return label.toFixed(4).toString();
  }
}

export default VerticalAxis;
