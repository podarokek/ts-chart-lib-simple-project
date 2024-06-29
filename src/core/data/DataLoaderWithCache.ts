import DataLoader from "./DataLoader";
import FTDataUtils, { DataCellType, ChunkType } from "../data/FTDataUtils";

const MAX_RIGHT_DATA_SIDE = 59113;
// через недостатню кількість даних про рест інтерфейс змущений взяти
// за основу це число як останнє можливе значення End в запиті на дані

export default class DataLoaderWithCache extends DataLoader {
  private cache: Map<string, ChunkType[]> = new Map();
  private cacheMeta: Map<string, { lastFromValue: number }> = new Map();
  private static instanceWithCache: DataLoaderWithCache;
  public random: number;

  public requestStep: number = 1000;

  private constructor(url: string) {
    super(url);
    this.random = Math.random();
  }

  public static getInstance(url: string): DataLoaderWithCache {
    if (!DataLoaderWithCache.instanceWithCache) {
      DataLoaderWithCache.instanceWithCache = new DataLoaderWithCache(url);
    }
    return DataLoaderWithCache.instanceWithCache;
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

  public async fetchAndCacheData<RequestParams>(
    cacheKey: string,
    requestParams: RequestParams
  ): Promise<ChunkType[]> {
    console.log(
      "fetchAndCacheData",
      cacheKey,
      requestParams,
      this.cache.has(cacheKey)
    );
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    return await this._fetchAndCacheData(cacheKey, requestParams);
  }

  public async fetchAndCacheMoreData<RequestParams>(
    cacheKey: string,
    requestParams: RequestParams
  ): Promise<ChunkType[]> {
    return await this._fetchAndCacheData(cacheKey, requestParams);
  }

  private async _fetchAndCacheData<RequestParams>(
    cacheKey: string,
    requestParams: RequestParams
  ): Promise<ChunkType[]> {
    let fromValue, toValue;
    if (this.cacheMeta.has(cacheKey)) {
      toValue = this.cacheMeta.get(cacheKey)!.lastFromValue - 1;
      fromValue = toValue - this.requestStep;
    } else {
      toValue = MAX_RIGHT_DATA_SIDE;
      fromValue = MAX_RIGHT_DATA_SIDE - this.requestStep;
    }

    this.cacheMeta.set(cacheKey, { lastFromValue: fromValue });

    const rawData: ChunkType[] = await this.fetchData({
      ...requestParams,
      Start: fromValue,
      End: toValue,
    });
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

  removeData(symbol: string, interval: number): void {
    const cacheKey = this.getCacheKey(symbol, interval);
    if (this.cache.has(cacheKey)) {
      this.cache.delete(cacheKey);
    }
  }
}

console.log(DataLoaderWithCache);
