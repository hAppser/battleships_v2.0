import { Cell } from "../Cell";
import { Mark } from "./Mark";

export class Miss extends Mark {
  constructor(cell: Cell) {
    super(cell);
    this.logo = "0";
    this.name = "miss";
    this.color = "miss";
  }
}
