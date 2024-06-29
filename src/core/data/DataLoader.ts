import { RequestParams } from "../core/FTDataUtil";

// TODO one interface for all project!
interface DataCell {
  time: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type ParamsType = Record<string, string | number>;

class DataLoader {
  private url: string = "";
  private static instance: DataLoader;

  constructor(url: string) {
    if (DataLoader.instance) {
      return DataLoader.instance;
    }
    DataLoader.instance = this;
    this.url = url;
  }

  static UrlParamsToString(params: RequestParams): string {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }

  async fetchData(params: RequestParams): Promise<any> {
    const response = await fetch(
      this.url + DataLoader.UrlParamsToString(params)
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  }

  // processData<ChunkType>(data: ChunkType[]): ChunkType[] {
  //   // const chunkStart = data.ChunkStart;
  //   return data.map((chunk: ChunkType) => ({
  //     chunkStart: chunk.chunkStart,
  //     Bars: chunk.Bars.map((bar: any) => ({
  //       time: new Date((chunk.chunkStart + bar.Time) * 1000),
  //       open: bar.Open,
  //       high: bar.High,
  //       low: bar.Low,
  //       close: bar.Close,
  //       volume: bar.TickVolume,
  //     })),
  //   }));
  // }
}

export default DataLoader;