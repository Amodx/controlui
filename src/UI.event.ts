import { UIUpdateDirections, UIUpdateTypes } from "./UI.types";
import type { UIElementBase } from "./UIElementBase";
import { UIContainerBase } from "./UIContainerBase";
export class UIUpdateEvent extends Event {
  static Event = "ui-update";
  constructor(public type: UIUpdateTypes, public origin: UIElementBase) {
    super(UIUpdateEvent.Event);
  }
  clone(origin: UIElementBase = this.origin) {
    return new UIUpdateEvent(this.type, origin);
  }
  private _propagate = true;
  isPropagating() {
    return this._propagate;
  }
  stopPropagation(): void {
    this._propagate = false;
  }
}
export class UINextElementEvent extends Event {
  static Event = "ui-next-element";
  constructor(
    public direction: UIUpdateDirections,
    public origin: UIContainerBase,
    public onDone: (nextElm: boolean) => void
  ) {
    super(UINextElementEvent.Event);
  }
  clone(origin: UIContainerBase = this.origin) {
    return new UINextElementEvent(this.direction, origin, this.onDone);
  }
  private _propagate = true;
  isPropagating() {
    return this._propagate;
  }
  stopPropagation(): void {
    this._propagate = false;
  }
}
export class UIElementActivedEvent extends Event {
  static Event = "ui-element-actived";
  constructor(public target: UIElementBase) {
    super(UIElementActivedEvent.Event);
  }

}
export class UIElementDeActivedEvent extends Event {
  static Event = "ui-element-deactived";
  constructor(public target: UIElementBase) {
    super(UIElementDeActivedEvent.Event);
  }

}
export class UIElementReadyEvent extends Event {
  static Event = "ui-ready-event";
  constructor(public target: UIElementBase) {
    super(UIElementReadyEvent.Event);
  }

}
