class Mapping {
  private _name: string;
  private _mapping: { [key: string]: string };

  constructor(name: string, mapping: { [key: string]: string }) {
    this._name = name;
    this._mapping = mapping;
  }

  getKey(value: string): string {
    return this._mapping[value];
  }

  get name() {
    return this._name;
  }

  get mapping() {
    return this._mapping;
  }
}

export default Mapping;
