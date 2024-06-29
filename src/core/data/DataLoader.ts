import { RequestParams } from "../data/FTDataUtils";

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
