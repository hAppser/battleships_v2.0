import { Cell } from "./cell";
import { Damage } from "./marks/Damage";
import { Miss } from "./marks/Miss";
import { Ship } from "./marks/Ship";
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
  getCopyBoard() {
    const newBoard = new Board();
    newBoard.cells = this.cells;
    return newBoard;
  }

  getCells(x: number, y: number) {
    return this.cells[y][x];
  }

  addShip(x: number, y: number) {
    new Ship(this.getCells(x, y));
  }
  addMiss(x: number, y: number) {
    new Miss(this.getCells(x, y));
  }
  addDamage(x: number, y: number) {
    new Damage(this.getCells(x, y));
  }
}
