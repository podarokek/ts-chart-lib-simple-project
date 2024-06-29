import { RequestParams } from "../data/FTDataUtils";

// TODO one interface for all project!
interface DataCell {
  time: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

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

  async fetchData(params: any): Promise<any> {
    console.log("FETCH", this.url, params);
    const response = await fetch(
      this.url + DataLoader.UrlParamsToString(params)
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  }
}

export default DataLoader;
