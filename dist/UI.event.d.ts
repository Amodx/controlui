import { UIUpdateDirections, UIUpdateTypes } from "./UI.types";
import type { UIElementBase } from "./UIElementBase";
import { UIContainerBase } from "./UIContainerBase";
export declare class UIUpdateEvent extends Event {
    type: UIUpdateTypes;
    origin: UIElementBase;
    static Event: string;
    constructor(type: UIUpdateTypes, origin: UIElementBase);
    clone(origin?: UIElementBase): UIUpdateEvent;
    private _propagate;
    isPropagating(): boolean;
    stopPropagation(): void;
}
export declare class UINextElementEvent extends Event {
    direction: UIUpdateDirections;
    origin: UIContainerBase;
    onDone: (nextElm: boolean) => void;
    static Event: string;
    constructor(direction: UIUpdateDirections, origin: UIContainerBase, onDone: (nextElm: boolean) => void);
    clone(origin?: UIContainerBase): UINextElementEvent;
    private _propagate;
    isPropagating(): boolean;
    stopPropagation(): void;
}
export declare class UIElementActivedEvent extends Event {
    target: UIElementBase;
    static Event: string;
    constructor(target: UIElementBase);
}
export declare class UIElementDeActivedEvent extends Event {
    target: UIElementBase;
    static Event: string;
    constructor(target: UIElementBase);
}
export declare class UIElementReadyEvent extends Event {
    target: UIElementBase;
    static Event: string;
    constructor(target: UIElementBase);
}
