import { Mark } from "./Mark";

export class Miss extends Mark {
  constructor(cell: any) {
    super(cell);
    this.logo = "0";
    this.name = "miss";
    this.color = "miss";
  }
}
