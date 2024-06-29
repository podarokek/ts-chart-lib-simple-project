export interface DataCellType {
  Time: number;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  TickVolume: number;
}

export interface ChunkType {
  ChunkStart: number;
  Bars: DataCellType[];
}

export interface RequestParams {
  Symbol: string;
  Timeframe: number;
  Start: number;
  End: number;
}

class FTDataUtils {
  static adjustTimestamps(chunk: ChunkType): ChunkType {
    return {
      ChunkStart: chunk.ChunkStart,
      Bars: chunk.Bars.map((bar) => ({
        Time: (chunk.ChunkStart + bar.Time) * 1000,
        Open: bar.Open,
        High: bar.High,
        Low: bar.Low,
        Close: bar.Close,
        TickVolume: bar.TickVolume,
      })),
    };
  }
  static mergeData(
    existingData: ChunkType[],
    newData: ChunkType[]
  ): ChunkType[] {
    const dataMap = new Map<number, ChunkType>();

    // Add existing data to the map
    existingData.forEach((chunk) => {
      dataMap.set(chunk.ChunkStart, chunk);
    });

    // Add new data to the map (overwrites duplicates)
    newData.forEach((chunk) => {
      dataMap.set(chunk.ChunkStart, chunk);
    });

    // Convert map back to array and sort by time
    return Array.from(dataMap.values()).sort(
      (a, b) => a.ChunkStart - b.ChunkStart
    );
  }
}

export default FTDataUtils;
