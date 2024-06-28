import CanvasManager from "../CanvasManager";
import Series from "./Series";
import { DataCellType } from "../FTDataUtils";
import { VisibleRangeType, MinMaxValuesType } from "../Chart";
import Mapping from "../Mapping";

interface IndexedDataCellType extends DataCellType {
  [key: string]: any;
}

class ColumnSeries extends Series {
  private config: {
    seriesHeight: number;
    candlestickWidth: number;
  };

  constructor(name: string, mapping: Mapping) {
    super(name, mapping);

    this.config = {
      seriesHeight: 0.3,
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
    const maxAxisValue = minMaxValues.max[this.mapping.mapping["volume"]];
    const minAxisValue = minMaxValues.min[this.mapping.mapping["volume"]];
    const segmentWidth = canvasManager.width / visibleRange.length;
    const availableHeight = canvasManager.height * this.config.seriesHeight;
    const topOffset = canvasManager.height * (1 - this.config.seriesHeight);
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

      let x =
        getSegmentXPosition(i) +
        (segmentWidth * (1 - this.config.candlestickWidth)) / 2;
      let y = priceToY(bar[this.mapping.mapping["volume"]]);
      let w = segmentWidth * this.config.candlestickWidth;
      let h = bar[this.mapping.mapping["volume"]] * priceRatio;

      canvasManager.drawColumnBar({ x, y, w, h });
    }
  }
}

export default ColumnSeries;
