import { ElementChildren } from "@amodx/elm";
import { UIContainerBase } from "./UIContainerBase";
import { UIElementBase } from "./UIElementBase";
import { UIUpdateTypes } from "./UI.types";
export interface UIElement {
}
export declare class UIElement extends UIElementBase {
    onmount: (elm: UIElement) => void | Promise<void>;
    onunmount: (elm: UIElement) => void | Promise<void>;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export declare class UIModal extends UIElementBase {
    onmount: (elm: UIModal) => void | Promise<void>;
    onunmount: (elm: UIModal) => void | Promise<void>;
    uiRoot: UIRootElement;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export declare class UIContainer extends UIContainerBase {
    constructor();
    onmount: (elm: UIContainer) => void | Promise<void>;
    onunmount: (elm: UIContainer) => void | Promise<void>;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export declare class UIRootElement extends HTMLElement {
    get active(): boolean;
    set active(active: boolean);
    observer: MutationObserver;
    childrenMap: UIElementBase[];
    constructor();
    private _updating;
    setUpdating(updating: boolean): void;
    isUpdating(): boolean;
    onmount: (elm: UIRootElement) => void | Promise<void>;
    onunmount: (elm: UIRootElement) => void | Promise<void>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    dispatchUpdate(update: UIUpdateTypes): boolean | undefined;
    travsereAddChildren(element: Element): void;
    processChildren(element: Element): true | undefined;
}
export declare class UIScreen extends UIContainerBase {
    uiRoot: UIRootElement;
    observer: MutationObserver;
    get active(): boolean;
    set active(active: boolean);
    constructor();
    render?: (screen: UIScreen) => ElementChildren;
    onEnter?: () => Promise<any> | any;
    onExit?: () => Promise<any> | any;
    afterRender?: () => Promise<any> | void;
    onmount: (elm: UIScreen) => void | Promise<void>;
    onunmount: (elm: UIScreen) => void | Promise<void>;
    uiScreen: true;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export declare class UIScreens extends HTMLElement {
    uiRoot: UIRootElement;
    screens: Map<string, UIScreen>;
    activeScreen: UIScreen;
    beforeUpdate?: (elm: UIScreens) => Promise<any>;
    afterUpdate?: (elm: UIScreens) => Promise<any>;
    onmount: (elm: UIScreens) => void | Promise<void>;
    onunmount: (elm: UIScreens) => void | Promise<void>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    enterScreen(id: string): Promise<void>;
    private travsereAddChildren;
    private processAddChild;
}
