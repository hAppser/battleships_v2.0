export interface IMark {
  cell: ICell;
  logo: string | null;
  color: string | null;
  id: number;
  name: string;
}

export interface ICell {
  board?: IBoard;
  x: number;
  y: number;
  mark: IMark | null;
  id: string;
}

export interface IBoard {
  cells: ICell[][];

  initCells(): void;
  getCopyBoard(): IBoard;
  basicComprehension(newRow: number, newCol: number): boolean;
  getCells(x: number, y: number): ICell;
  addShip(x: number, y: number, length: number): void;
  addShipRandomly(): void;
  addMiss(x: number, y: number): void;
  addDamage(x: number, y: number): void;
}
