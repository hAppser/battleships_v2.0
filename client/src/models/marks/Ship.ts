import { IMark, ICell } from "../interfaces/interfaces";

export class Ship implements IMark {
  cell: ICell;
  logo: string | null;
  color: string | null;
  id: number;
  name: string;
  decks: ICell[] = [];
  hits: number = 0;

  constructor(cells: ICell[]) {
    this.cell = cells[0];
    this.cell.mark = this;
    this.logo = null;
    this.name = "ship";
    this.color = "ship";
    this.decks = cells;
    this.id = Math.random();
  }

  isDestroyed() {
    return this.hits === this.decks.length;
  }
}
