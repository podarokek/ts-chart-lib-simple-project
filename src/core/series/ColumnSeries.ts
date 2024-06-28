import CanvasManager from "../CanvasManager";
import Series from "./Series";
import { DataCellType } from "../FTDataUtils";
import { VisibleRangeType, MinMaxValuesType } from "../Chart";
import Mapping from "../Mapping";

interface IndexedDataCellType extends DataCellType {
  [key: string]: any;
}

class ColumnSeries extends Series {
  constructor(name: string, mapping: Mapping) {
    super(name, mapping);
  }

  render(
    canvasManager: CanvasManager,
    data: DataCellType[],
    visibleRange: VisibleRangeType,
    minMaxValues: MinMaxValuesType
  ): void {
    console.log("RENDER COLUMN SERIES");
  }
}

export default ColumnSeries;
