import { IBoard, ICell, IMark } from "./interfaces/interfaces";

export class Cell implements ICell {
  board?: IBoard;
  x: number;
  y: number;
  mark: IMark | null;
  id: string;
  constructor(board: IBoard, x: number, y: number, mark: IMark | null) {
    this.x = x;
    this.y = y;
    this.board = board;
    this.mark = mark;
    this.id = `${this.x}_${this.y}`;
  }
}
