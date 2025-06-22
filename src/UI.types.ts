export type UIUpdateDirections = "up" | "down" | "left" | "right";

export type UIUpdateTypes = UIUpdateDirections | "enter" | "exit";

export interface UIUpdatable {
   onUserInput(direction: UIUpdateTypes, ...args: any): Promise<any> | any;
}
