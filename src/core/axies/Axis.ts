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
      fontColor: "#000000",
      valueForChangingBaseLine: 5,
      gridColor: "#00000022",
    };
  }

  public formatLabel(label: string | number): string {
    return label.toString();
  }
}

export default Axis;
