import { Board } from "./Board";
import { Mark } from "./marks/Mark";

export class Cell {
  board: Board;
  x: number;
  y: number;
  mark: Mark | null;
  id: string;
  constructor(board: Board, x: number, y: number, mark: Mark | null) {
    this.x = x;
    this.y = y;
    this.board = board;
    this.mark = mark;
    this.id = `${this.x}_${this.y}`;
  }
}
