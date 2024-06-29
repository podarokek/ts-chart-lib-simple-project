import CanvasManager from "../CanvasManager";
import Series from "./Series";
import { DataCellType } from "../data/FTDataUtils";
import { VisibleRangeType, MinMaxValuesType, RenderDataType } from "../Chart";
import Mapping from "../Mapping";
import DrawablePlane from "../utils/DrawablePlane";

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
    renderData: RenderDataType,
    drawablePlane: DrawablePlane
  ): void {
    const { data, minMaxValues, visibleRange } = renderData;

    // Calc values
    const maxAxisValue = minMaxValues.max[
      this.mapping.mapping["volume"]
    ] as number;
    const minAxisValue = minMaxValues.min[
      this.mapping.mapping["volume"]
    ] as number;

    const segmentWidth = drawablePlane.width / visibleRange.length;
    const availableHeight = drawablePlane.height * this.config.seriesHeight;
    const topOffset = drawablePlane.height * (1 - this.config.seriesHeight);
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

      let x =
        getSegmentXPosition(i) +
        (segmentWidth * (1 - this.config.candlestickWidth)) / 2;
      let y = priceToY(bar[this.mapping.mapping["volume"]]);
      let w = segmentWidth * this.config.candlestickWidth;
      let h = drawablePlane.height - y;

      canvasManager.drawColumnBar({ x, y, w, h });
    }
  }
}

export default ColumnSeries;
