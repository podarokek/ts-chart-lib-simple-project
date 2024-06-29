import Mapping from "../Mapping";

class Axis {
  protected mapping: Mapping;
  public config: {
    fontSize: number;
    fontColor: string;
    valueForChangingBaseLine: number;
    gridColor: string;
  };

  constructor(mapping: Mapping) {
    this.mapping = mapping;
    this.config = {
      fontSize: 12,
      fontColor: "#7c868e",
      valueForChangingBaseLine: 5,
      // gridColor: "#00000022",
      gridColor: "#d6d6d6",
    };
  }

  public formatLabel(label: string | number): string {
    return label.toString();
  }
}

export default Axis;
