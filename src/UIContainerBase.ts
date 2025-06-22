import {
  UIElementActivedEvent,
  UIElementDeActivedEvent,
  UIElementReadyEvent,
  UINextElementEvent,
} from "./UI.event";
import { UIUpdateDirections, UIUpdateTypes } from "./UI.types";
import { UIElementBase } from "./UIElementBase";
import { UILayout, UILayoutArray } from "./UILayout";
export class UIContainerBase extends UIElementBase {
  childrenMap = new Map<number, UIElementBase>();

  get layout() {
    return JSON.parse(this.getAttribute("layout") || "[]");
  }
  set layout(layout: UILayoutArray) {
    this.setAttribute("layout", JSON.stringify(layout));
    this._layout = new UILayout(layout);
  }

  _activeLayoutId: number | null = null;
  get activeLayoutId() {
    return this._activeLayoutId;
  }
  set activeLayoutId(layout: number | null) {
    this.setAttribute("active-layout-id", String(layout));
    this._activeLayoutId = layout;
  }
  get defaultActiveLayoutId() {
    return Number(this.getAttribute("default-active-layout-id"));
  }
  set defaultActiveLayoutId(layout: number | null) {
    this.setAttribute("default-active-layout-id", String(layout));
  }

  _layout: UILayout;
  constructor() {
    super();

    this.addOnUIUpdate((event) => {
      if (!this.active) return;
      for (const [key, uiElm] of this.childrenMap) {
        if (!uiElm.active) continue;
        uiElm.dispatchEvent(event.clone(this));
      }
    });
  }


  getElement(id: number) {
    return this.childrenMap.get(id);
  }

  sendReady() {
    for (const [key, element] of this.childrenMap) {
      element.dispatchEvent(new UIElementReadyEvent(element));
    }
  }
  
  travsereAddChildren(element: Element) {
    for (const child of element.children) {
      this.processChildren(child);
    }
  }

  processChildren(element: Element) {
    if ((element as UIElementBase).uiElement) {
      this.childrenMap.set(
        (element as UIElementBase).layoutId,
        element as UIElementBase
      );
      if ((element as UIElementBase).layoutId == this.activeLayoutId) {
        (element as UIElementBase).active = true;
      }

      return true;
    }
    this.travsereAddChildren(element);
  }

  nextElement(
    direction: UIUpdateDirections,
    onDone = (nextElm: boolean) => {}
  ) {
    if (this._layout) {
      let oldIndex = this._layout.activeLayoutId;
      this._layout.update(direction);
      const activeIndex = this._layout.activeLayoutId;
      if (oldIndex == activeIndex) return onDone(false);
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
    } else {
      this.dispatchEvent(new UINextElementEvent(direction, this, onDone));
      return false;
    }
  }
}
