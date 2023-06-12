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

      this.cells.push(row);
    }
  }
  getNewBoard() {
    const newBoard = new Board();
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(new Cell(this, j, i, null));
      }

      newBoard.cells.push(row);
    }
    return newBoard;
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

  addShipRandomly(x: number, y: number) {
    const getRandomCoordinates = (length: number, isVertical: boolean) => {
      const max = isVertical ? 10 - length : 10;
      const row = Math.floor(Math.random() * max);
      const col = Math.floor(Math.random() * 10);
      return { row, col };
    };
    // Сделать проверку по длине (как-то добавлять length, пока не придумал как)

    //Если корабль горизонтальный, то проверять у 1-го все, кроме правого, а у последнего все, кроме левого
    // Если корабль вертикальный, то проверять у 1-го все, кроме нижнего, а у последнего все, кроме верхнего
    const isCollision = (
      row: number,
      col: number,
      length: number,
      isVertical: boolean
    ) => {
      const directions = [
        { dx: -1, dy: 0 }, // Верх
        { dx: 1, dy: 0 }, // Низ
        { dx: 0, dy: -1 }, // Лево
        { dx: 0, dy: 1 }, // Право
        { dx: -1, dy: -1 }, // Верхний левый угол
        { dx: -1, dy: 1 }, // Верхний правый угол
        { dx: 1, dy: -1 }, // Нижний левый угол
        { dx: 1, dy: 1 }, // Нижний правый угол
      ];

      for (let i = 0; i < directions.length; i++) {
        const dx = directions[i].dx;
        const dy = directions[i].dy;
        const newRow = row + dx;
        const newCol = col + dy;

        if (
          newRow >= 0 &&
          newRow < this.cells.length &&
          newCol >= 0 &&
          newCol < this.cells[0].length &&
          this.cells[newRow][newCol]?.mark === Ship
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
      if (isVertical) {
        if (row + length > this.cells.length) {
          return false; // Корабль выходит за пределы поля по вертикали
        }
      } else {
        if (col + length > this.cells[0].length) {
          return false; // Корабль выходит за пределы поля по горизонтали
        }
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
          let isVertical = Math.random() < 0.5;
          let coordinates, row, col;
          do {
            coordinates = getRandomCoordinates(ship.length, isVertical);
            row = coordinates.row;
            col = coordinates.col;
          } while (
            isCollision(row, col, ship.length, isVertical) ||
            !checkBoundaries(row, col, ship.length, isVertical)
          );

          const endRow = isVertical ? row + ship.length : row + 1;
          const endCol = isVertical ? col + 1 : col + ship.length;
          console.log(row, col, endRow, endCol, isVertical);

          for (let j = row; j < endRow; j++) {
            for (let k = col; k < endCol; k++) {
              new Ship(this.getCells(j, k));
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
