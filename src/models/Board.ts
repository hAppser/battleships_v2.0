import { Cell } from "./Cell";
import { Damage } from "./marks/Damage";
import { Miss } from "./marks/Miss";
import { Ship } from "./marks/Ship";

export class Board {
  cells: Cell[][] = [];

  constructor() {
    this.initCells();
  }

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

  directions = [
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: -1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: 1, dy: 1 },
  ];
  basicComprehension(newRow: number, newCol: number) {
    return (
      newRow >= 0 &&
      newRow < this.cells.length &&
      newCol >= 0 &&
      newCol < this.cells[0].length
    );
  }

  getCells(x: number, y: number) {
    return this.cells[y][x];
  }

  addShip(x: number, y: number, length: number) {
    const decks: Cell[] = [];
    for (let i = 0; i < length; i++) {
      decks.push(this.getCells(x + i, y));
    }
    const ship = new Ship(decks);
    decks.forEach((cell) => {
      cell.mark = ship;
    });
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
      const hasAdjacentShip = (row: number, col: number) => {
        for (const direction of this.directions) {
          const newRow = row + direction.dy;
          const newCol = col + direction.dx;
          if (this.basicComprehension(newRow, newCol)) {
            const cell = this.cells[newRow][newCol];
            if (cell.mark instanceof Ship) {
              return true;
            }
          }
        }
        return false;
      };
      for (let i = 0; i < length; i++) {
        const newRow = isVertical ? row + i : row;
        const newCol = isVertical ? col : col + i;
        if (this.basicComprehension(newRow, newCol)) {
          const cell = this.cells[newRow][newCol];
          if (cell.mark instanceof Ship || hasAdjacentShip(newRow, newCol)) {
            return true;
          }
        } else {
          return true;
        }
      }
      if (isVertical && row + length > this.cells.length) {
        return true;
      }
      if (!isVertical && col + length > this.cells[0].length) {
        return true;
      }

      return false;
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
          } while (isCollision(row, col, ship.length, isVertical));

          const decks: Cell[] = [];
          const endRow = isVertical ? row + ship.length : row + 1;
          const endCol = isVertical ? col + 1 : col + ship.length;

          for (let j = row; j < endRow; j++) {
            for (let k = col; k < endCol; k++) {
              const cell = this.getCells(k, j);
              decks.push(cell);
            }
          }

          const newShip = new Ship(decks);
          decks.forEach((cell) => {
            cell.mark = newShip;
          });
        }
      });
    };

    placeShipsRandomly();
  }

  addMiss(x: number, y: number) {
    const cell = this.getCells(x, y);
    if (
      !(cell.mark instanceof Ship) &&
      !(cell.mark instanceof Damage) &&
      !(cell.mark instanceof Miss)
    ) {
      cell.mark = new Miss(cell);
    }
  }

  addDamage(x: number, y: number) {
    const cell = this.getCells(x, y);
    if (cell.mark instanceof Ship) {
      const ship = cell.mark;
      ship.hits++;
      cell.mark = new Damage(cell);
      if (ship.isDestroyed()) {
        ship.decks.forEach((deck) => {
          const { x, y } = deck;
          this.directions.forEach((direction) => {
            const newRow = y + direction.dy;
            const newCol = x + direction.dx;

            if (this.basicComprehension(newRow, newCol)) {
              const adjacentCell = this.getCells(newCol, newRow);
              if (!(adjacentCell.mark instanceof Ship)) {
                this.addMiss(newCol, newRow);
              }
            }
          });
        });
      }
    }
    cell.mark = new Damage(cell);
  }
}
