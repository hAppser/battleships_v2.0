import { Mark } from "./Mark";

export class Damage extends Mark {
  constructor(cell: any) {
    super(cell);
    this.logo = "x";
    this.name = "damage";
    this.color = "damage";
  }
}
