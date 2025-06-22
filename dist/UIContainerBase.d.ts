import { UIUpdateDirections } from "./UI.types";
import { UIElementBase } from "./UIElementBase";
import { UILayout, UILayoutArray } from "./UILayout";
export declare class UIContainerBase extends UIElementBase {
    childrenMap: Map<number, UIElementBase>;
    get layout(): UILayoutArray;
    set layout(layout: UILayoutArray);
    _activeLayoutId: number | null;
    get activeLayoutId(): number | null;
    set activeLayoutId(layout: number | null);
    get defaultActiveLayoutId(): number | null;
    set defaultActiveLayoutId(layout: number | null);
    _layout: UILayout;
    constructor();
    getElement(id: number): UIElementBase | undefined;
    sendReady(): void;
    travsereAddChildren(element: Element): void;
    processChildren(element: Element): true | undefined;
    nextElement(direction: UIUpdateDirections, onDone?: (nextElm: boolean) => void): boolean | void;
}
