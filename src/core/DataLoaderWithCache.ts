import DataLoader from "./DataLoader";
import FTDataUtils, { DataCellType, ChunkType } from "./FTDataUtils";

export default class DataLoaderWithCache extends DataLoader {
  private cache: Map<string, ChunkType[]> = new Map();
  private static instanceWithCache: DataLoaderWithCache;

  constructor(url: string) {
    super(url);

    if (DataLoaderWithCache.instanceWithCache) {
      return DataLoaderWithCache.instanceWithCache;
    }

    DataLoaderWithCache.instanceWithCache = this;
  }

  public getCacheKey(symbol: string, interval: number): string {
    return `${symbol}_${interval}`;
  }

  private mergeData(
    existingData: ChunkType[],
    newData: ChunkType[]
  ): ChunkType[] {
    return FTDataUtils.mergeData(existingData, newData);
  }

  async fetchAndCacheData<RequestParams>(
    cacheKey: string,
    requestParams: RequestParams
  ): Promise<ChunkType[]> {
    const rawData: ChunkType[] = await this.fetchData(requestParams);
    const data = rawData.flatMap((chunk) =>
      FTDataUtils.adjustTimestamps(chunk)
    );

    if (!this.cache.has(cacheKey)) {
      this.cache.set(cacheKey, []);
    }

    const cachedData = this.cache.get(cacheKey)!;
    const mergedData = this.mergeData(cachedData, data);
    this.cache.set(cacheKey, mergedData);

    return mergedData;
  }

  // async getData(request: DataRequest): Promise<DataCellType[]> {
  //   const cacheKey = this.getCacheKey(request.symbol, request.interval);
  //   if (this.cache.has(cacheKey)) {
  //     return this.cache.get(cacheKey)!;
  //   }

  //   return await this.fetchAndCacheData(request);
  // }

  removeData(symbol: string, interval: number): void {
    const cacheKey = this.getCacheKey(symbol, interval);
    if (this.cache.has(cacheKey)) {
      this.cache.delete(cacheKey);
    }
  }
}
