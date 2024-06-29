import CanvasManager from "../CanvasManager";
import { MinMaxValuesType, RenderDataType, VisibleRangeType } from "../Chart";
import { DataCellType } from "../data/FTDataUtils";
import Mapping from "../Mapping";
import Series from "./Series";

import { OHLCBarType } from "../CanvasManager";
import DrawablePlane from "../utils/DrawablePlane";

interface IndexedDataCellType extends DataCellType {
  [key: string]: any;
}

class OHLCSeries extends Series {
  private config: {
    axisYPandings: number;
    candlestickWidth: number;
  };

  constructor(name: string, mapping: Mapping) {
    super(name, mapping);

    this.config = {
      axisYPandings: 0.1,
      candlestickWidth: 0.8,
    };
  }

  render(
    canvasManager: CanvasManager,
    renderData: RenderDataType,
    drawablePlane: DrawablePlane
  ): void {
    const { data, minMaxValues, visibleRange } = renderData;

    // Calc values
    const maxAxisValue = minMaxValues.max[
      this.mapping.getKey("high")
    ] as number;
    const minAxisValue = minMaxValues.min[this.mapping.getKey("low")] as number;

    const segmentWidth = drawablePlane.width / visibleRange.length;
    const availableHeight =
      drawablePlane.height -
      drawablePlane.height * this.config.axisYPandings * 2;
    const topOffset = drawablePlane.height * this.config.axisYPandings;
    const priceRatio = availableHeight / (maxAxisValue - minAxisValue);

    const getSegmentXPosition = (index: number) =>
      -(visibleRange.fromIndex * segmentWidth - index * segmentWidth);

    const priceToY = (price: number) =>
      topOffset + (maxAxisValue - price) * priceRatio;

    // Bars indexes
    const firstIndex = Math.trunc(Math.max(0, visibleRange.fromIndex));
    const lastIndex = Math.ceil(
      Math.min(data.length - 1, visibleRange.fromIndex + visibleRange.length)
    );

    if (!data[firstIndex] || !data[lastIndex]) return;

    for (let i = firstIndex; i <= lastIndex; i++) {
      const bar = data[i] as IndexedDataCellType;

      const isRasing =
        bar[this.mapping.getKey("close")] > bar[this.mapping.getKey("open")];
      const barType =
        bar[this.mapping.getKey("close")] == bar[this.mapping.getKey("open")]
          ? OHLCBarType.Neutral
          : isRasing
          ? OHLCBarType.Rising
          : OHLCBarType.Falling;

      let x =
        getSegmentXPosition(i) +
        (segmentWidth * (1 - this.config.candlestickWidth)) / 2;
      let y = priceToY(bar[this.mapping.getKey("high")]);
      let w = segmentWidth * this.config.candlestickWidth;
      let h =
        Math.abs(
          bar[this.mapping.getKey("close")] - bar[this.mapping.getKey("open")]
        ) * priceRatio;
      let H =
        Math.abs(
          bar[this.mapping.getKey("high")] - bar[this.mapping.getKey("low")]
        ) * priceRatio;
      let rectTopPosition = isRasing
        ? priceToY(bar[this.mapping.getKey("close")])
        : priceToY(bar[this.mapping.getKey("open")]);

      canvasManager.drawOhlcBar({ x, y, w, h, H, rectTopPosition, barType });
    }
  }
}

export default OHLCSeries;
