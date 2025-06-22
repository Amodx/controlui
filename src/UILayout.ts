import { UIUpdateDirections } from "./UI.types";

export type UILayoutArray = number[][];

export class UILayout {
  public index: [number, number] = [0, 0];

  get activeLayoutId() {
    return this.layout[this.index[0]][this.index[1]];
  }

  constructor(public layout: UILayoutArray) {}

  update(directions: UIUpdateDirections) {
    const [row, col] = this.index;
    switch (directions) {
      case "up":
        if (row > 0) {
          this.index = [row - 1, col];
          return true;
        }
        break;
      case "down":
        if (row < this.layout.length - 1) {
          this.index = [row + 1, col];
          return true;
        }
        break;
      case "left":
        if (col > 0) {
          this.index = [row, col - 1];
          return true;
        }
        break;
      case "right":
        if (col < this.layout[row].length - 1) {
          this.index = [row, col + 1];
          return true;
        }
        break;
      default:
        throw new Error("Invalid direction");
    }
    return false;
  }
}
