import InteractiveChart from "./InteractiveChart";
import DataLoaderWithCache from "./DataLoaderWithCache";
import { RequestParams } from "./FTDataUtils";

class FTInteractiveChart extends InteractiveChart {
  private symbol: string;
  private dataLoader: DataLoaderWithCache;

  constructor(canvas: HTMLCanvasElement, symbol: string) {
    super(canvas);

    this.dataLoader = new DataLoaderWithCache(
      "https://beta.forextester.com/data/api/Metadata/bars/chunked?Broker=Advanced&UseMessagePack=false&"
    );

    this.symbol = symbol;

    this.init();
  }

  private async init() {
    this.loadData(
      await this.dataLoader.fetchAndCacheData<RequestParams>(
        this.dataLoader.getCacheKey(this.symbol, 1),
        {
          Symbol: this.symbol,
          Timeframe: 1,
          Start: 0,
          End: 999,
        }
      )
    );
  }
}

export default FTInteractiveChart;
