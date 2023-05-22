export class Cell {
  board: any;
  x: number;
  y: number;
  mark: any;
  id: number;
  constructor(board: any, x: number, y: number, mark: any) {
    this.x = x;
    this.y = y;
    this.board = board;
    this.mark = mark;
    this.id = Math.random();
  }
}
