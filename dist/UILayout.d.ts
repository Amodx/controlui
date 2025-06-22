import { UIUpdateDirections } from "./UI.types";
export type UILayoutArray = number[][];
export declare class UILayout {
    layout: UILayoutArray;
    index: [number, number];
    get activeLayoutId(): number;
    constructor(layout: UILayoutArray);
    update(directions: UIUpdateDirections): boolean;
}
