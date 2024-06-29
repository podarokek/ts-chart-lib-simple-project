import InteractiveChart from "./InteractiveChart";
import DataLoaderWithCache from "./data/DataLoaderWithCache";
import Mapping from "./Mapping.ts";

import { RequestParams } from "./data/FTDataUtils.ts";
import { SeriesType } from "./series";

class FTInteractiveChart extends InteractiveChart {
  private symbol: string;
  private dataLoader: DataLoaderWithCache;

  private priceMapping: Mapping;
  private volumeMapping: Mapping;

  private waitingForData: boolean;

  constructor(canvas: HTMLCanvasElement, symbol: string) {
    super(canvas);

    console.log(this);

    this.dataLoader = DataLoaderWithCache.getInstance(
      "https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&UseMessagePack=false&"
    );

    this.symbol = symbol;

    this.priceMapping = new Mapping("Price", {
      high: "High",
      low: "Low",
      open: "Open",
      close: "Close",
      dt: "Time",
    });

    this.volumeMapping = new Mapping("Volume", {
      volume: "TickVolume",
    });

    this.waitingForData = false;

    this.init();
  }

  private async init() {
    // Load first data
    this.waitingForData = true;
    const data = await this.dataLoader.fetchAndCacheData<RequestParams>(
      this.dataLoader.getCacheKey(this.symbol, 1),
      {
        Symbol: this.symbol,
        Timeframe: 1,
        // Start: 0,
        // End: 999,
      }
    );

    const plot = this.createPlot(this.priceMapping);

    plot.addSeries("price", SeriesType.OHLC, this.priceMapping);
    plot.addSeries("volume", SeriesType.Column, this.volumeMapping);

    this.loadData(data);
    this.waitingForData = false;
    this.moveVisibleRangeToEnd();

    this.on("preload", (side: string) => {
      if (side === "left") {
        this.loadMoreData();
      }
    });
  }

  public async loadMoreData() {
    if (this.waitingForData) return;

    this.waitingForData = true;
    const data = await this.dataLoader.fetchAndCacheMoreData<RequestParams>(
      this.dataLoader.getCacheKey(this.symbol, 1),
      {
        Symbol: this.symbol,
        Timeframe: 1,
      }
    );

    this.loadData(data);
    this.waitingForData = false;
  }

  public moveVisibleRangeToEnd() {
    this.visibleRange.fromIndex = this.data.length - this.visibleRange.length;
    this.render();
  }

  public destroy(): void {
    // this.dataLoader.destroy();
    super.destroy();
  }
}

export default FTInteractiveChart;
