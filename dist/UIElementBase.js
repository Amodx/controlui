import { UIElementActivedEvent, UIElementDeActivedEvent, UIElementReadyEvent, UINextElementEvent, UIUpdateEvent, } from "./UI.event";
import { UIScreen } from "./UI.elements";
export class UIElementBase extends HTMLElement {
    get layoutId() {
        return Number(this.getAttribute("layout-id"));
    }
    set layoutId(active) {
        this.setAttribute("layout-id", String(active));
    }
    get active() {
        return Boolean(Number(this.dataset["active"]));
    }
    set active(active) {
        this.dataset["active"] = String(active ? 1 : 0);
    }
    _uiParent;
    get parent() {
        return this._uiParent;
    }
    get isActive() {
        return this.active;
    }
    screen;
    uiElement = true;
    constructor() {
        super();
        Object.defineProperty(this, "id", {
            get: () => this.dataset["id"] || "",
            set: (value) => (this.dataset["id"] = value),
        });
        Object.defineProperty(this, "onuiupdate", {
            set: (value) => typeof value == "function" && this.addOnUIUpdate(value),
        });
        Object.defineProperty(this, "onnextelement", {
            set: (value) => typeof value == "function" && this.addOnNextElement(value),
        });
        Object.defineProperty(this, "onactived", {
            set: (value) => typeof value == "function" && this.addOnActived(value),
        });
        Object.defineProperty(this, "ondeactived", {
            set: (value) => typeof value == "function" && this.addOnDeActived(value),
        });
        Object.defineProperty(this, "onready", {
            set: (value) => typeof value == "function" && this.addOnReady(value),
        });
    }
    activate() {
        this.active = true;
        this.dispatchEvent(new UIElementActivedEvent(this));
    }
    deactivate() {
        this.active = false;
        this.dispatchEvent(new UIElementDeActivedEvent(this));
    }
    onready;
    addOnReady(listener) {
        this.addEventListener(UIElementReadyEvent.Event, listener);
    }
    removeOnReady(listener) {
        this.removeEventListener(UIElementReadyEvent.Event, listener);
    }
    onuiupdate;
    addOnUIUpdate(listener) {
        this.addEventListener(UIUpdateEvent.Event, listener);
    }
    removeOnUIUpdate(listener) {
        this.removeEventListener(UIUpdateEvent.Event, listener);
    }
    onnextelement;
    addOnNextElement(listener) {
        this.addEventListener(UINextElementEvent.Event, listener);
    }
    removeOnNextElement(listener) {
        this.removeEventListener(UINextElementEvent.Event, listener);
    }
    onactived;
    addOnActived(listener) {
        this.addEventListener(UIElementActivedEvent.Event, listener);
    }
    removeOnActived(listener) {
        this.removeEventListener(UIElementActivedEvent.Event, listener);
    }
    ondeactived;
    addOnDeActived(listener) {
        this.addEventListener(UIElementDeActivedEvent.Event, listener);
    }
    removeOnDeActived(listener) {
        this.removeEventListener(UIElementDeActivedEvent.Event, listener);
    }
    nextElement(direction, onDone = (nextElm) => { }) {
        this.parent.dispatchEvent(new UINextElementEvent(direction, this.parent, onDone));
    }
    findContext() {
        let element = this;
        while (element) {
            if (element instanceof UIScreen) {
                this._uiParent = element;
                break;
            }
            if (element.uiElement && element != this) {
                this._uiParent = element;
                element = element.screen;
                break;
            }
            element = element.parentElement;
        }
        if (!element || !(element instanceof UIScreen)) {
            console.warn(this, this.id, element);
            throw new Error(`UI element must be inside a ui screen `);
        }
        this.screen = element;
    }
}
