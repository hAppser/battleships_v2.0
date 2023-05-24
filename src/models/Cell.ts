export class Cell {
  board: any;
  x: number;
  y: number;
  mark: any;
  id: number | string;
  constructor(board: any, x: number, y: number, mark: any) {
    this.x = x;
    this.y = y;
    this.board = board;
    this.mark = mark;
    this.id = `${this.x}-${this.y}`;
  }
}
