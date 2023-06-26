import { Mark } from "./Mark";
import { Cell } from "../Cell";

export class Ship extends Mark {
  decks: Cell[] = [];
  hits: number = 0;

  constructor(cells: Cell[]) {
    super(cells[0]);
    this.logo = null;
    this.name = "ship";
    this.color = "ship";
    this.decks = cells;
  }

  isDestroyed() {
    return this.hits === this.decks.length;
  }
}
