import CanvasManager from "../CanvasManager";
import { DataCellType } from "../data/FTDataUtils";
import { VisibleRangeType, MinMaxValuesType, RenderDataType } from "../Chart";
import Mapping from "../Mapping";

import DrawablePlane from "../utils/DrawablePlane";

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
    renderData: RenderDataType,
    drawablePlane: DrawablePlane
  ): void {
    throw new Error("Method not implemented.");
  }
}

export default Series;
