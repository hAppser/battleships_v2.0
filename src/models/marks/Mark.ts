export class Mark {
  cell: any;
  logo: any;
  color: any;
  id: number;
  name: string;
  constructor(cell: any) {
    this.cell = cell;
    this.cell.mark = this;
    this.logo = null;
    this.color = null;
    this.id = Math.random();
    this.name = "";
  }
}
