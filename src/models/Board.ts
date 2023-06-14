import { Cell } from "./Cell";
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
      this.cells[i] = row;
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

  addShipRandomly() {
    this.initCells();

    const getRandomCoordinates = (length: number, isVertical: boolean) => {
      const max = isVertical ? 10 - length : 10;
      const row = Math.floor(Math.random() * max);
      const col = Math.floor(Math.random() * 10);
      return { row, col };
    };

    const isCollision = (
      row: number,
      col: number,
      length: number,
      isVertical: boolean
    ) => {
      const directions = [
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: -1, dy: -1 },
        { dx: -1, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: 1, dy: 1 },
      ];

      for (let i = 0; i < directions.length; i++) {
        const dx = directions[i].dx;
        const dy = directions[i].dy;
        let newRow = row;
        let newCol = col;

        for (let j = 0; j < length; j++) {
          newRow += dx;
          newCol += dy;

          if (
            newRow >= 0 &&
            newRow < this.cells.length &&
            newCol >= 0 &&
            newCol < this.cells[0].length &&
            this.cells[newRow][newCol]?.mark instanceof Ship
          ) {
            return true;
          }
        }
      }

      const lastRow = isVertical ? row + length - 1 : row;
      const lastCol = isVertical ? col : col + length - 1;
      if (
        lastRow < this.cells.length &&
        lastCol < this.cells[0].length &&
        this.cells[lastRow][lastCol]?.mark instanceof Ship
      ) {
        return true;
      }

      for (let i = 4; i < directions.length; i++) {
        const dx = directions[i].dx;
        const dy = directions[i].dy;
        const diagonalRow = lastRow + dx;
        const diagonalCol = lastCol + dy;

        if (
          diagonalRow >= 0 &&
          diagonalRow < this.cells.length &&
          diagonalCol >= 0 &&
          diagonalCol < this.cells[0].length &&
          this.cells[diagonalRow][diagonalCol]?.mark instanceof Ship
        ) {
          return true;
        }
      }

      return false;
    };

    const checkBoundaries = (
      row: number,
      col: number,
      length: number,
      isVertical: boolean
    ) => {
      if (isVertical && row + length > this.cells.length) {
        return false;
      }
      if (!isVertical && col + length > this.cells[0].length) {
        return false;
      }

      return true;
    };
    const placeShipsRandomly = () => {
      const ships = [
        { length: 4, count: 1 },
        { length: 3, count: 2 },
        { length: 2, count: 3 },
        { length: 1, count: 4 },
      ];

      ships.forEach((ship) => {
        for (let i = 0; i < ship.count; i++) {
          let isVertical;
          let coordinates, row, col;

          do {
            isVertical = Math.random() < 0.5;
            coordinates = getRandomCoordinates(ship.length, isVertical);
            row = coordinates.row;
            col = coordinates.col;
          } while (
            isCollision(row, col, ship.length, isVertical) ||
            !checkBoundaries(row, col, ship.length, isVertical)
          );

          const endRow = isVertical ? row + ship.length : row + 1;
          const endCol = isVertical ? col + 1 : col + ship.length;

          for (let j = row; j < endRow; j++) {
            for (let k = col; k < endCol; k++) {
              this.addShip(k, j);
            }
          }
        }
      });
    };
    placeShipsRandomly();
  }
  addMiss(x: number, y: number) {
    new Miss(this.getCells(x, y));
  }
  addDamage(x: number, y: number) {
    new Damage(this.getCells(x, y));
  }
}
