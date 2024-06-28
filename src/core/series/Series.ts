import CanvasManager from "../CanvasManager";
import { DataCellType } from "../FTDataUtils";
import { VisibleRangeType, MinMaxValuesType } from "../Chart";
import Mapping from "../Mapping";

class Series {
  private _name: string;
  protected mapping: Mapping;

  constructor(name: string, mapping: Mapping) {
    this._name = name;
    this.mapping = mapping;
  }

  get name() {
    return this._name;
  }

  render(
    canvasManager: CanvasManager,
    data: DataCellType[],
    visibleRange: VisibleRangeType,
    minMaxValues: MinMaxValuesType
  ): void {
    throw new Error("Method not implemented.");
  }
}

export default Series;
