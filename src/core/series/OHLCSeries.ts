import CanvasManager from "../CanvasManager";
import { MinMaxValuesType, VisibleRangeType } from "../Chart";
import { DataCellType } from "../FTDataUtils";
import Mapping from "../Mapping";
import Series from "./Series";

import { OHLCBarType } from "../CanvasManager";

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
    data: DataCellType[],
    visibleRange: VisibleRangeType,
    minMaxValues: MinMaxValuesType
  ): void {
    // Calc values
    const maxAxisValue = minMaxValues.max[this.mapping.mapping["high"]];
    const minAxisValue = minMaxValues.min[this.mapping.mapping["low"]];
    const segmentWidth = canvasManager.width / visibleRange.length;
    const availableHeight =
      canvasManager.height -
      canvasManager.height * this.config.axisYPandings * 2;
    const topOffset = canvasManager.height * this.config.axisYPandings;
    const priceRatio = availableHeight / (maxAxisValue - minAxisValue);

    const getSegmentXPosition = (index: number) =>
      -(visibleRange.fromIndex * segmentWidth - index * segmentWidth);

    const priceToY = (price: number) =>
      topOffset + (maxAxisValue - price) * priceRatio;

    // Bars indexes
    const firstIndex = Math.max(0, visibleRange.fromIndex);
    const lastIndex = Math.min(
      data.length,
      visibleRange.fromIndex + visibleRange.length
    );

    for (let i = firstIndex; i < lastIndex; i++) {
      const bar = data[i] as IndexedDataCellType;

      const isRasing =
        bar[this.mapping.mapping["close"]] > bar[this.mapping.mapping["open"]];
      const barType =
        bar[this.mapping.mapping["close"]] == bar[this.mapping.mapping["open"]]
          ? OHLCBarType.Neutral
          : isRasing
          ? OHLCBarType.Rising
          : OHLCBarType.Falling;

      let x =
        getSegmentXPosition(i) +
        (segmentWidth * (1 - this.config.candlestickWidth)) / 2;
      let y = priceToY(bar[this.mapping.mapping["high"]]);
      let w = segmentWidth * this.config.candlestickWidth;
      let h =
        Math.abs(
          bar[this.mapping.mapping["close"]] - bar[this.mapping.mapping["open"]]
        ) * priceRatio;
      let H =
        Math.abs(
          bar[this.mapping.mapping["high"]] - bar[this.mapping.mapping["low"]]
        ) * priceRatio;
      let rectTopPosition = isRasing
        ? priceToY(bar[this.mapping.mapping["close"]])
        : priceToY(bar[this.mapping.mapping["open"]]);

      canvasManager.drawOhlcBar({ x, y, w, h, H, rectTopPosition, barType });
    }
  }
}

export default OHLCSeries;
