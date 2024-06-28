import Series from "./Series";
import OHLCSeries from "./OHLCSeries";
import ColumnSeries from "./ColumnSeries";

export enum SeriesType {
  OHLC = "ohlc",
  Column = "column",
}

export { Series, OHLCSeries, ColumnSeries };
