import CanvasManager from "../CanvasManager";
import { MinMaxValuesType, VisibleRangeType } from "../Chart";
import { DataCellType } from "../FTDataUtils";
import Mapping from "../Mapping";
import Series from "./Series";

interface IndexedDataCellType extends DataCellType {
  [key: string]: any;
}

class OHLCSeries extends Series {
  constructor(name: string, mapping: Mapping) {
    super(name, mapping);
  }

  render(
    canvasManager: CanvasManager,
    data: DataCellType[],
    visibleRange: VisibleRangeType,
    minMaxValues: MinMaxValuesType
  ): void {
    console.log("TODO OHLC", data, canvasManager, visibleRange, minMaxValues);
    // TODO
    const ctx = canvasManager.context;

    const config = {
      axisYPandings: 0,
      candlestickWidth: 0.8,
    };

    const segmentWidth = canvasManager.width / visibleRange.length;

    const getSegmentXPosition = (index: number) =>
      -(visibleRange.fromIndex * segmentWidth - index * segmentWidth);

    const availableHeight =
      canvasManager.height - canvasManager.height * config.axisYPandings * 2;
    const topOffset = canvasManager.height * config.axisYPandings;

    const maxAxisValue = minMaxValues.max[this.mapping.mapping["high"]];
    const minAxisValue = minMaxValues.min[this.mapping.mapping["low"]];
    const priceToPixel = availableHeight / (maxAxisValue - minAxisValue);
    const priceToY = (price: number) =>
      topOffset + (maxAxisValue - price) * priceToPixel;

    const firstIndex = Math.max(0, visibleRange.fromIndex);
    const lastIndex = Math.min(
      data.length,
      visibleRange.fromIndex + visibleRange.length
    );

    for (let i = firstIndex; i < lastIndex; i++) {
      const bar = data[i] as IndexedDataCellType;
      console.log(bar);
      console.log(priceToY(bar[this.mapping.mapping["high"]]));
      console.log(getSegmentXPosition(i));

      const middleX = getSegmentXPosition(i) + segmentWidth / 2;
      const leftOffset =
        getSegmentXPosition(i) +
        (segmentWidth * (1 - config.candlestickWidth)) / 2;
      let topRectPos, rectHeight;

      if (
        bar[this.mapping.mapping["close"]] > bar[this.mapping.mapping["open"]]
      ) {
        // Green candle
        topRectPos = priceToY(bar[this.mapping.mapping["close"]]);
        rectHeight =
          (bar[this.mapping.mapping["close"]] -
            bar[this.mapping.mapping["open"]]) *
          priceToPixel;

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#b1cf8f";
        ctx.moveTo(middleX, priceToY(bar[this.mapping.mapping["high"]]));
        ctx.lineTo(middleX, priceToY(bar[this.mapping.mapping["low"]]));
        ctx.stroke();

        ctx.fillStyle = "#b1cf8f";
        ctx.fillRect(
          leftOffset,
          topRectPos,
          segmentWidth * config.candlestickWidth,
          rectHeight
        );
      } else if (
        bar[this.mapping.mapping["close"]] < bar[this.mapping.mapping["open"]]
      ) {
        // Red candle
        topRectPos = priceToY(bar[this.mapping.mapping["open"]]);
        rectHeight = priceToY(bar[this.mapping.mapping["close"]]) - topRectPos;

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#f09e9e";
        ctx.moveTo(middleX, priceToY(bar[this.mapping.mapping["high"]]));
        ctx.lineTo(middleX, priceToY(bar[this.mapping.mapping["low"]]));
        ctx.stroke();

        ctx.fillStyle = "#f09e9e";
        ctx.fillRect(
          leftOffset,
          topRectPos,
          segmentWidth * config.candlestickWidth,
          rectHeight
        );
      } else {
        // Close = Open
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#b1cf8f";
        ctx.moveTo(middleX, priceToY(bar[this.mapping.mapping["high"]]));
        ctx.lineTo(middleX, priceToY(bar[this.mapping.mapping["low"]]));
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#b1cf8f";
        ctx.moveTo(leftOffset, priceToY(bar[this.mapping.mapping["close"]]));
        ctx.lineTo(
          leftOffset + segmentWidth * config.candlestickWidth,
          priceToY(bar[this.mapping.mapping["close"]])
        );
        ctx.stroke();
      }
    }

    // throw new Error("Method not implemented.");
    // console.log("TODO OHLC");

    // console.log(data);

    // console.log(canvasManager);

    // console.log(minMaxValues, this.mapping.mapping["high"], this.mapping);
    // console.log(minMaxValues.max[this.mapping.mapping["high"]]);
    // console.log(minMaxValues.min[this.mapping.mapping["low"]]);
    // const barWidth = canvasManager.width / visibleRange.length;

    // const end = Math.min(
    //   data.length - 1,
    //   Math.ceil(data.length - visibleRange.rightOffset)
    // );
    // const start = Math.max(0, end - visibleRange.length);

    // const visibleBarsLength = end - start + 1;

    // const leftRowsOffset = (visibleRange.length - visibleBarsLength) * barWidth;

    // console.log("start", start, "end", end);

    // const ctx = canvasManager.context;

    // // Calculate scales
    // const priceScale =
    //   canvasManager.height /
    //   (minMaxValues.max[this.mapping.mapping["high"]] -
    //     minMaxValues.min[this.mapping.mapping["low"]]);

    // console.log(
    //   "priceScale",
    //   canvasManager.height,
    //   minMaxValues.max[this.mapping.mapping["high"]],
    //   minMaxValues.min[this.mapping.mapping["low"]]
    // );

    // // Function to map price to y-coordinate
    // const priceToY = (price: number) => {
    //   console.log(
    //     "priceToY",
    //     canvasManager.height,
    //     price,
    //     minMaxValues.min[this.mapping.mapping["low"]],
    //     priceScale
    //   );

    //   return (
    //     canvasManager.height -
    //     (price - minMaxValues.min[this.mapping.mapping["low"]]) * priceScale
    //   );
    // };

    // // Function to map index to x-coordinate
    // const indexToX = (index: number) =>
    //   (index - start) * barWidth + leftRowsOffset;
    // // const indexToX = (index: number) => (index - start) * barWidth;

    // // Loop through visible data and draw each bar
    // for (let i = start; i < end && i < data.length; i++) {
    //   const bar = data[i] as IndexedDataCellType;
    //   console.log(bar);
    //   const x = indexToX(i);
    //   const openY = priceToY(bar[this.mapping.mapping["open"]]);
    //   const highY = priceToY(bar[this.mapping.mapping["high"]]);
    //   const lowY = priceToY(bar[this.mapping.mapping["low"]]);
    //   const closeY = priceToY(bar[this.mapping.mapping["close"]]);

    //   // Set color based on bar direction
    //   if (
    //     bar[this.mapping.mapping["close"]] >= bar[this.mapping.mapping["open"]]
    //   ) {
    //     ctx.fillStyle = "green"; // Up bar
    //     ctx.strokeStyle = "green";
    //   } else {
    //     ctx.fillStyle = "red"; // Down bar
    //     ctx.strokeStyle = "red";
    //   }

    //   // Draw the high-low line
    //   ctx.beginPath();
    //   ctx.moveTo(x + barWidth / 2, highY);
    //   console.log("move to ", x + barWidth / 2, highY);
    //   ctx.lineTo(x + barWidth / 2, lowY);
    //   console.log("line to ", x + barWidth / 2, lowY);
    //   ctx.stroke();

    //   // Draw the open-close rectangle
    //   ctx.fillRect(
    //     x,
    //     Math.min(openY, closeY),
    //     barWidth,
    //     Math.abs(openY - closeY)
    //   );
    //   console.log(
    //     x,
    //     Math.min(openY, closeY),
    //     barWidth,
    //     Math.abs(openY - closeY)
    //   );
    // }
  }
}

export default OHLCSeries;
