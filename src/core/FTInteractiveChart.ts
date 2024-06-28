import InteractiveChart from "./InteractiveChart";
import DataLoaderWithCache from "./DataLoaderWithCache";
import Mapping from "./Mapping.ts";

import { RequestParams } from "./FTDataUtils";
import { SeriesType } from "./series";

class FTInteractiveChart extends InteractiveChart {
  private symbol: string;
  private dataLoader: DataLoaderWithCache;

  private priceMapping: Mapping;
  private volumeMapping: Mapping;

  constructor(canvas: HTMLCanvasElement, symbol: string) {
    super(canvas);

    this.dataLoader = new DataLoaderWithCache(
      "https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&UseMessagePack=false&"
    );

    this.symbol = symbol;

    this.priceMapping = new Mapping("Price", {
      high: "High",
      low: "Low",
      open: "Open",
      close: "Close",
    });

    this.volumeMapping = new Mapping("Volume", {
      volume: "TickVolume",
    });

    this.init();
  }

  private async init() {
    // const data = await this.dataLoader.fetchAndCacheData<RequestParams>(
    //   this.dataLoader.getCacheKey(this.symbol, 1),
    //   {
    //     Symbol: this.symbol,
    //     Timeframe: 1,
    //     Start: 0,
    //     End: 999,
    //   }
    // );

    const plot = this.createPlot();

    plot.addSeries("price", SeriesType.OHLC, this.priceMapping);
    plot.addSeries("volume", SeriesType.Column, this.volumeMapping);

    // this.loadData(data);
    this.loadData([
      {
        Bars: [
          {
            Time: 0,
            Open: 0.70427,
            High: 0.70457,
            Low: 0.70427,
            Close: 0.70457,
            TickVolume: 88800002,
          },
          {
            Time: 60,
            Open: 0.70468,
            High: 0.7048,
            Low: 0.70468,
            Close: 0.70473,
            TickVolume: 142800001,
          },
          {
            Time: 120,
            Open: 0.70468,
            High: 0.70469,
            Low: 0.70464,
            Close: 0.70468,
            TickVolume: 96299999,
          },
          {
            Time: 180,
            Open: 0.70464,
            High: 0.70468,
            Low: 0.70464,
            Close: 0.70468,
            TickVolume: 93299999,
          },
          {
            Time: 240,
            Open: 0.70471,
            High: 0.70471,
            Low: 0.70463,
            Close: 0.70471,
            TickVolume: 48800000,
          },
          {
            Time: 300,
            Open: 0.70473,
            High: 0.70476,
            Low: 0.70463,
            Close: 0.70476,
            TickVolume: 194699998,
          },
          {
            Time: 360,
            Open: 0.70475,
            High: 0.70483,
            Low: 0.70474,
            Close: 0.7048,
            TickVolume: 135000001,
          },
        ],
      },
    ]);
  }

  render() {
    this.canvasManager.clear();

    for (const plot of this.plots) {
      plot.render(this.data, this.visibleRange, this.calculateMinMaxValues());
    }

    return;
  }
}

export default FTInteractiveChart;
