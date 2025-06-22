import {
  UIElementActivedEvent,
  UIElementDeActivedEvent,
  UIElementReadyEvent,
  UINextElementEvent,
  UIUpdateEvent,
} from "./UI.event";
import { UIUpdateDirections } from "./UI.types";
import { UIScreen } from "./UI.elements";
import { UIContainerBase } from "./UIContainerBase";
export abstract class UIElementBase extends HTMLElement {
  get layoutId() {
    return Number(this.getAttribute("layout-id"));
  }
  set layoutId(active: number) {
    this.setAttribute("layout-id", String(active));
  }
  get active() {
    return Boolean(Number(this.dataset["active"]));
  }
  set active(active: boolean) {
    this.dataset["active"] = String(active ? 1 : 0);
  }
  private _uiParent: UIContainerBase;
  get parent(): UIContainerBase {
    return this._uiParent;
  }

  get isActive() {
    return this.active;
  }

  screen: UIScreen;
  uiElement: true = true;

  constructor() {
    super();

    Object.defineProperty(this, "id", {
      get: () => this.dataset["id"] || "",
      set: (value: any) => (this.dataset["id"] = value),
    });

    Object.defineProperty(this, "onuiupdate", {
      set: (value) => typeof value == "function" && this.addOnUIUpdate(value),
    });
    Object.defineProperty(this, "onnextelement", {
      set: (value) =>
        typeof value == "function" && this.addOnNextElement(value),
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
    this.dispatchEvent(new UIElementActivedEvent(this))
  }
  deactivate() {
    this.active = false;
    this.dispatchEvent(new UIElementDeActivedEvent(this))
  }

  onready: (event: UIElementReadyEvent) => void;
  addOnReady(listener: (event: UIElementReadyEvent) => void): void {
    this.addEventListener(UIElementReadyEvent.Event, listener as EventListener);
  }
  removeOnReady(listener: Function): void {
    this.removeEventListener(
      UIElementReadyEvent.Event,
      listener as EventListener
    );
  }

  onuiupdate: (event: UIUpdateEvent) => void;
  addOnUIUpdate(listener: (event: UIUpdateEvent) => void): void {
    this.addEventListener(UIUpdateEvent.Event, listener as EventListener);
  }
  removeOnUIUpdate(listener: Function): void {
    this.removeEventListener(UIUpdateEvent.Event, listener as EventListener);
  }

  onnextelement: (event: UINextElementEvent) => void;
  addOnNextElement(listener: (event: UINextElementEvent) => void): void {
    this.addEventListener(UINextElementEvent.Event, listener as EventListener);
  }
  removeOnNextElement(listener: Function): void {
    this.removeEventListener(
      UINextElementEvent.Event,
      listener as EventListener
    );
  }

  onactived: (event: UIElementActivedEvent) => void;
  addOnActived(listener: (event: UIElementActivedEvent) => void): void {
    this.addEventListener(
      UIElementActivedEvent.Event,
      listener as EventListener
    );
  }
  removeOnActived(listener: Function): void {
    this.removeEventListener(
      UIElementActivedEvent.Event,
      listener as EventListener
    );
  }

  ondeactived: (event: UIElementDeActivedEvent) => void;
  addOnDeActived(listener: (event: UIElementDeActivedEvent) => void): void {
    this.addEventListener(
      UIElementDeActivedEvent.Event,
      listener as EventListener
    );
  }
  removeOnDeActived(listener: Function): void {
    this.removeEventListener(
      UIElementDeActivedEvent.Event,
      listener as EventListener
    );
  }

  nextElement(
    direction: UIUpdateDirections,
    onDone = (nextElm: boolean) => {}
  ) {
    this.parent.dispatchEvent(
      new UINextElementEvent(direction, this.parent, onDone)
    );
  }

  findContext() {
    let element: UIScreen | HTMLElement | null = this;
    while (element) {
      if (element instanceof UIScreen) {
        this._uiParent = element;
        break;
      }
      if ((element as UIContainerBase).uiElement && element != this) {
        this._uiParent = element as UIContainerBase;
        element = (element as UIContainerBase).screen;
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
