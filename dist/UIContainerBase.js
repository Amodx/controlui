import { UIElementReadyEvent, UINextElementEvent, } from "./UI.event";
import { UIElementBase } from "./UIElementBase";
import { UILayout } from "./UILayout";
export class UIContainerBase extends UIElementBase {
    childrenMap = new Map();
    get layout() {
        return JSON.parse(this.getAttribute("layout") || "[]");
    }
    set layout(layout) {
        this.setAttribute("layout", JSON.stringify(layout));
        this._layout = new UILayout(layout);
    }
    _activeLayoutId = null;
    get activeLayoutId() {
        return this._activeLayoutId;
    }
    set activeLayoutId(layout) {
        this.setAttribute("active-layout-id", String(layout));
        this._activeLayoutId = layout;
    }
    get defaultActiveLayoutId() {
        return Number(this.getAttribute("default-active-layout-id"));
    }
    set defaultActiveLayoutId(layout) {
        this.setAttribute("default-active-layout-id", String(layout));
    }
    _layout;
    constructor() {
        super();
        this.addOnUIUpdate((event) => {
            if (!this.active)
                return;
            for (const [key, uiElm] of this.childrenMap) {
                if (!uiElm.active)
                    continue;
                uiElm.dispatchEvent(event.clone(this));
            }
        });
    }
    getElement(id) {
        return this.childrenMap.get(id);
    }
    sendReady() {
        for (const [key, element] of this.childrenMap) {
            element.dispatchEvent(new UIElementReadyEvent(element));
        }
    }
    travsereAddChildren(element) {
        for (const child of element.children) {
            this.processChildren(child);
        }
    }
    processChildren(element) {
        if (element.uiElement) {
            this.childrenMap.set(element.layoutId, element);
            if (element.layoutId == this.activeLayoutId) {
                element.active = true;
            }
            return true;
        }
        this.travsereAddChildren(element);
    }
    nextElement(direction, onDone = (nextElm) => { }) {
        if (this._layout) {
            let oldIndex = this._layout.activeLayoutId;
            this._layout.update(direction);
            const activeIndex = this._layout.activeLayoutId;
            if (oldIndex == activeIndex)
                return onDone(false);
            for (const [key, child] of this.childrenMap) {
                if (key == oldIndex) {
                    child.deactivate();
                }
                if (key == activeIndex) {
                    child.activate();
                }
            }
            this.activeLayoutId = activeIndex;
            onDone(true);
            return true;
        }
        else {
            this.dispatchEvent(new UINextElementEvent(direction, this, onDone));
            return false;
        }
    }
}
