import { raw } from "@amodx/elm";
import { UIContainerBase } from "./UIContainerBase";
import { UIElementBase } from "./UIElementBase";
import { UIUpdateEvent } from "./UI.event";
export class UIElement extends UIElementBase {
    onmount;
    onunmount;
    connectedCallback() {
        this.findContext();
        if (this.onmount)
            this.onmount(this);
    }
    disconnectedCallback() {
        if (this.onunmount)
            this.onunmount(this);
    }
}
customElements.define("ui-elm", UIElement);
export class UIModal extends UIElementBase {
    onmount;
    onunmount;
    uiRoot;
    connectedCallback() {
        let element = this;
        while (element) {
            if (element instanceof UIRootElement) {
                this.uiRoot = element;
                break;
            }
            element = element.parentElement;
        }
        if (!element || !(element instanceof UIRootElement)) {
            console.warn(this, this.id, element);
            throw new Error(`UI modal must be inside a ui root `);
        }
        if (this.onmount)
            this.onmount(this);
    }
    disconnectedCallback() {
        if (this.onunmount)
            this.onunmount(this);
    }
}
customElements.define("ui-modal", UIModal);
export class UIContainer extends UIContainerBase {
    constructor() {
        super();
        this.addOnNextElement((event) => {
            if (!this.active)
                return;
            if (this._layout) {
                this.nextElement(event.direction, event.onDone);
            }
            else {
                if (event.isPropagating() && this.parent) {
                    this.parent.dispatchEvent(event.clone(this));
                }
            }
        });
    }
    onmount;
    onunmount;
    connectedCallback() {
        if (this.defaultActiveLayoutId == null) {
            this.defaultActiveLayoutId = this.activeLayoutId;
        }
        if (this._layout)
            this._layout.index = [0, 0];
        this.findContext();
        this.travsereAddChildren(this);
        if (this.onmount)
            this.onmount(this);
        this.sendReady();
    }
    disconnectedCallback() {
        if (this.onunmount)
            this.onunmount(this);
    }
}
customElements.define("ui-container", UIContainer);
export class UIRootElement extends HTMLElement {
    get active() {
        return Boolean(Number(this.dataset["active"]));
    }
    set active(active) {
        this.dataset["active"] = String(active ? 1 : 0);
    }
    observer;
    childrenMap = new Map();
    constructor() {
        super();
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    this.childrenMap.clear();
                    this.travsereAddChildren(this);
                }
            });
        });
        this.observer.observe(this, { childList: true });
    }
    _updating = false;
    setUpdating(updating) {
        this._updating = updating;
    }
    isUpdating() {
        return this._updating;
    }
    onmount;
    onunmount;
    connectedCallback() {
        this.travsereAddChildren(this);
        if (this.onmount)
            this.onmount(this);
    }
    disconnectedCallback() {
        this.observer.disconnect();
        if (this.onunmount)
            this.onunmount(this);
    }
    dispatchUpdate(update) {
        if (this.isUpdating())
            return false;
        if (!this.active)
            return;
        const event = new UIUpdateEvent(update, this);
        for (const [key, uiElm] of this.childrenMap) {
            if (!uiElm.active)
                continue;
            event.origin = uiElm;
            uiElm.dispatchEvent(event.clone(uiElm));
        }
        return true;
    }
    travsereAddChildren(element) {
        for (const child of element.children) {
            this.processChildren(child);
        }
    }
    processChildren(element) {
        if (element.uiElement) {
            this.childrenMap.set(element.id, element);
            return true;
        }
        this.travsereAddChildren(element);
    }
}
customElements.define("ui-root", UIRootElement);
export class UIScreen extends UIContainerBase {
    uiRoot;
    observer;
    get active() {
        return Boolean(Number(this.dataset["active"]));
    }
    set active(active) {
        this.dataset["active"] = String(active ? 1 : 0);
    }
    constructor() {
        super();
        this.addOnNextElement((event) => {
            if (!this.active)
                return;
            if (this._layout) {
                this.nextElement(event.direction, event.onDone);
            }
            else {
                if (event.isPropagating() && this.parent) {
                    this.parent.dispatchEvent(event.clone(this));
                }
            }
        });
    }
    render;
    onEnter;
    onExit;
    afterRender;
    onmount;
    onunmount;
    uiScreen = true;
    connectedCallback() {
        if (this.defaultActiveLayoutId == null) {
            this.defaultActiveLayoutId = this.activeLayoutId;
        }
        if (this._layout)
            this._layout.index = [0, 0];
        this.activeLayoutId = this.defaultActiveLayoutId;
        this.findContext();
        this.travsereAddChildren(this);
        if (this.onmount)
            this.onmount(this);
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    this.childrenMap.clear();
                    this.travsereAddChildren(this);
                    this.sendReady();
                }
            });
        });
        this.observer.observe(this, { childList: true });
        this.sendReady();
    }
    disconnectedCallback() {
        this.observer.disconnect();
        if (this.onunmount)
            this.onunmount(this);
    }
}
customElements.define("ui-screen", UIScreen);
export class UIScreens extends HTMLElement {
    uiRoot;
    screens = new Map();
    activeScreen;
    beforeUpdate;
    afterUpdate;
    onmount;
    onunmount;
    connectedCallback() {
        this.travsereAddChildren(this);
        if (this.onmount)
            this.onmount(this);
    }
    disconnectedCallback() {
        if (this.onunmount)
            this.onunmount(this);
    }
    async enterScreen(id) {
        this.uiRoot.setUpdating(true);
        const screen = this.screens.get(id);
        if (!screen)
            throw new Error(`Screen with id ${id} does not exist`);
        if (this.beforeUpdate)
            await this.beforeUpdate(this);
        if (this.activeScreen?.onExit) {
            await this.activeScreen.onExit();
        }
        if (this.activeScreen) {
            this.activeScreen.innerHTML = "";
            this.appendChild(this.activeScreen);
            this.activeScreen.active = false;
        }
        this.activeScreen = screen;
        screen.innerHTML = "";
        if (!screen.render)
            throw new Error(`Screen with id ${screen.id} does not exist`);
        screen.uiRoot = this.uiRoot;
        this.uiRoot.appendChild(screen);
        raw(screen, {}, await screen.render(screen));
        screen.active = true;
        if (screen.onEnter)
            await screen.onEnter();
        if (this.afterUpdate)
            await this.afterUpdate(this);
        this.uiRoot.setUpdating(false);
    }
    travsereAddChildren(element) {
        Array.from(element.children).forEach((child) => {
            this.processAddChild(child);
        });
    }
    processAddChild(element) {
        if (element.uiScreen) {
            this.screens.set(element.id, element);
        }
        if (element instanceof DocumentFragment) {
            this.travsereAddChildren(element);
        }
    }
}
customElements.define("ui-screens", UIScreens);
