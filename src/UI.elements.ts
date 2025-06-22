import { ElementChildren, raw } from "@amodx/elm";
import { UIContainerBase } from "./UIContainerBase";
import { UIElementBase } from "./UIElementBase";
import { UIUpdateEvent } from "./UI.event";
import { UIUpdateTypes } from "./UI.types";
export interface UIElement {}

export class UIElement extends UIElementBase {
  onmount: (elm: UIElement) => void | Promise<void>;
  onunmount: (elm: UIElement) => void | Promise<void>;

  connectedCallback() {
    this.findContext();
    if (this.onmount) this.onmount(this);
  }

  disconnectedCallback() {
    if (this.onunmount) this.onunmount(this);
  }
}

customElements.define("ui-elm", UIElement);

export class UIModal extends UIElementBase {
  onmount: (elm: UIModal) => void | Promise<void>;
  onunmount: (elm: UIModal) => void | Promise<void>;
  uiRoot: UIRootElement;
  connectedCallback() {
    let element: UIRootElement | HTMLElement | null = this;
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
    if (this.onmount) this.onmount(this);
  }

  disconnectedCallback() {
    if (this.onunmount) this.onunmount(this);
  }
}

customElements.define("ui-modal", UIModal);

export class UIContainer extends UIContainerBase {
  constructor() {
    super();
    this.addOnNextElement((event) => {
      if (!this.active) return;
      if (this._layout) {
        this.nextElement(event.direction, event.onDone);
      } else {
        if (event.isPropagating() && this.parent) {
          this.parent.dispatchEvent(event.clone(this));
        }
      }
    });
  }

  onmount: (elm: UIContainer) => void | Promise<void>;
  onunmount: (elm: UIContainer) => void | Promise<void>;

  connectedCallback() {
    if (this.defaultActiveLayoutId == null) {
      this.defaultActiveLayoutId = this.activeLayoutId;
    }
    if (this._layout) this._layout.index = [0, 0];
    this.findContext();
    this.travsereAddChildren(this);
    if (this.onmount) this.onmount(this);
    this.sendReady();
  }

  disconnectedCallback() {
    if (this.onunmount) this.onunmount(this);
  }
}

customElements.define("ui-container", UIContainer);

export class UIRootElement extends HTMLElement {
  get active() {
    return Boolean(Number(this.dataset["active"]));
  }
  set active(active: boolean) {
    this.dataset["active"] = String(active ? 1 : 0);
  }
  observer: MutationObserver;
  childrenMap = new Map<string, UIElementBase>();

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

  private _updating = false;
  setUpdating(updating: boolean) {
    this._updating = updating;
  }
  isUpdating() {
    return this._updating;
  }

  onmount: (elm: UIRootElement) => void | Promise<void>;
  onunmount: (elm: UIRootElement) => void | Promise<void>;

  connectedCallback() {
    this.travsereAddChildren(this);
    if (this.onmount) this.onmount(this);
  }

  disconnectedCallback() {
    this.observer.disconnect();
    if (this.onunmount) this.onunmount(this);
  }

  dispatchUpdate(update: UIUpdateTypes) {
    if (this.isUpdating()) return false;
    if (!this.active) return;
    const event = new UIUpdateEvent(update, this as any);
    for (const [key, uiElm] of this.childrenMap) {
      if (!uiElm.active) continue;
      event.origin = uiElm;
      uiElm.dispatchEvent(event.clone(uiElm));
    }
    return true;
  }

  travsereAddChildren(element: Element) {
    for (const child of element.children) {
      this.processChildren(child);
    }
  }

  processChildren(element: Element) {
    if ((element as UIElementBase).uiElement) {
      this.childrenMap.set(element.id, element as UIElementBase);
      return true;
    }
    this.travsereAddChildren(element);
  }
}

customElements.define("ui-root", UIRootElement);

export class UIScreen extends UIContainerBase {
  uiRoot: UIRootElement;
  observer: MutationObserver;
  get active() {
    return Boolean(Number(this.dataset["active"]));
  }
  set active(active: boolean) {
    this.dataset["active"] = String(active ? 1 : 0);
  }

  constructor() {
    super();

    this.addOnNextElement((event) => {
      if (!this.active) return;
      if (this._layout) {
        this.nextElement(event.direction, event.onDone);
      } else {
        if (event.isPropagating() && this.parent) {
          this.parent.dispatchEvent(event.clone(this));
        }
      }
    });
  }

  render?: (screen: UIScreen) => ElementChildren;
  onEnter?: () => Promise<any> | any;
  onExit?: () => Promise<any> | any;
  afterRender?: () => Promise<any> | void;

  onmount: (elm: UIScreen) => void | Promise<void>;
  onunmount: (elm: UIScreen) => void | Promise<void>;

  uiScreen: true = true;

  connectedCallback() {
    if (this.defaultActiveLayoutId == null) {
      this.defaultActiveLayoutId = this.activeLayoutId;
    }
    if (this._layout) this._layout.index = [0, 0];
    this.activeLayoutId = this.defaultActiveLayoutId;
    this.findContext();
    this.travsereAddChildren(this);
    if (this.onmount) this.onmount(this);
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
    if (this.onunmount) this.onunmount(this);
  }
}

customElements.define("ui-screen", UIScreen);

export class UIScreens extends HTMLElement {
  uiRoot: UIRootElement;
  screens = new Map<string, UIScreen>();
  activeScreen: UIScreen;

  beforeUpdate?: (elm: UIScreens) => Promise<any>;
  afterUpdate?: (elm: UIScreens) => Promise<any>;

  onmount: (elm: UIScreens) => void | Promise<void>;
  onunmount: (elm: UIScreens) => void | Promise<void>;

  connectedCallback() {
    this.travsereAddChildren(this);
    if (this.onmount) this.onmount(this);
  }
  disconnectedCallback() {
    if (this.onunmount) this.onunmount(this);
  }
  async enterScreen(id: string) {
    this.uiRoot.setUpdating(true);

    const screen = this.screens.get(id);
    if (!screen) throw new Error(`Screen with id ${id} does not exist`);
    if (this.beforeUpdate) await this.beforeUpdate(this);
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
    if (screen.onEnter) await screen.onEnter();
    if (this.afterUpdate) await this.afterUpdate(this);

    this.uiRoot.setUpdating(false);
  }

  private travsereAddChildren(element: Element) {
    Array.from(element.children).forEach((child) => {
      this.processAddChild(child);
    });
  }

  private processAddChild(element: Element) {
    if ((element as UIScreen).uiScreen) {
      this.screens.set(element.id, element as UIScreen);
    }
    if (element instanceof DocumentFragment) {
      this.travsereAddChildren(element);
    }
  }
}

customElements.define("ui-screens", UIScreens);
