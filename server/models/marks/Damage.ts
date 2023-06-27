import { Cell } from "../Cell";
import { Mark } from "./Mark";

export class Damage extends Mark {
  constructor(cell: Cell) {
    super(cell);
    this.logo = "x";
    this.name = "damage";
    this.color = "damage";
  }
}
