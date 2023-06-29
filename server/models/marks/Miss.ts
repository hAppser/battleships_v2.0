import { IMark, ICell } from "../interfaces/interfaces";

export class Miss implements IMark {
  cell: ICell;
  logo: string | null;
  color: string | null;
  id: number;
  name: string;

  constructor(cell: ICell) {
    this.cell = cell;
    this.cell.mark = this;
    this.logo = "0";
    this.name = "miss";
    this.color = "miss";
    this.id = Math.random();
  }
}
