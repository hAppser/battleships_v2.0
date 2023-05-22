import { Cell } from "./cell";
export class Board {
  cells: Cell[][] = [];
  initCells() {
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(new Cell(this, j, i, null));
      }

      this.cells.push(row);
    }
  }
}
