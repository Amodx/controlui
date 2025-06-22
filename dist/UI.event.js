export class UIUpdateEvent extends Event {
    type;
    origin;
    static Event = "ui-update";
    constructor(type, origin) {
        super(UIUpdateEvent.Event);
        this.type = type;
        this.origin = origin;
    }
    clone(origin = this.origin) {
        return new UIUpdateEvent(this.type, origin);
    }
    _propagate = true;
    isPropagating() {
        return this._propagate;
    }
    stopPropagation() {
        this._propagate = false;
    }
}
export class UINextElementEvent extends Event {
    direction;
    origin;
    onDone;
    static Event = "ui-next-element";
    constructor(direction, origin, onDone) {
        super(UINextElementEvent.Event);
        this.direction = direction;
        this.origin = origin;
        this.onDone = onDone;
    }
    clone(origin = this.origin) {
        return new UINextElementEvent(this.direction, origin, this.onDone);
    }
    _propagate = true;
    isPropagating() {
        return this._propagate;
    }
    stopPropagation() {
        this._propagate = false;
    }
}
export class UIElementActivedEvent extends Event {
    target;
    static Event = "ui-element-actived";
    constructor(target) {
        super(UIElementActivedEvent.Event);
        this.target = target;
    }
}
export class UIElementDeActivedEvent extends Event {
    target;
    static Event = "ui-element-deactived";
    constructor(target) {
        super(UIElementDeActivedEvent.Event);
        this.target = target;
    }
}
export class UIElementReadyEvent extends Event {
    target;
    static Event = "ui-ready-event";
    constructor(target) {
        super(UIElementReadyEvent.Event);
        this.target = target;
    }
}
