import { GameFrameworkError } from "../GameFrameworkError";
import { LinkedListNode } from "../GameFrameworkLinkedList";
import { GameFrameworkMap } from "../GameFrameworkMap";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { BaseEventArgs } from "./BaseEventArgs";
import { Event } from "./Event";
import { EventHandle, EventHandleTarget } from "./EventHandle";

export class EventPool<T extends BaseEventArgs> {
    private readonly _eventHandles: GameFrameworkMap<number, EventHandleTarget<T>> = null!;
    private readonly _targetHandles: GameFrameworkMap<object, EventHandleTarget<T>> = null!;
    private readonly _events: Array<Event<T>> = null!;

    constructor() {
        this._eventHandles = new GameFrameworkMap<number, EventHandleTarget<T>>();
        this._targetHandles = new GameFrameworkMap<object, EventHandleTarget<T>>();
        this._events = new Array<Event<T>>();
    }

    update(elapseSeconds: number): void {
        if (this._events.length > 0) {
            let event: Event<T> = this._events.pop()!;
            this.handleEvent(event.sender, event.eventArgs);
            ReferencePool.release(event);
        }
    }

    shutDown() {
        this._eventHandles.clear();
        this._targetHandles.clear();
        this._events.length = 0;
    }

    clear() {
        this._events.length = 0;
    }

    subscribe(id: number, eventHandle: EventHandle<T>, thisArg?: any): void {
        if (!eventHandle) {
            throw new GameFrameworkError("eventHandle is invalid");
        }
        let eventHandleTarget = EventHandleTarget.create(id, thisArg, eventHandle);
        this._eventHandles.set(id, eventHandleTarget);
        if (thisArg) {
            this._targetHandles.set(thisArg, eventHandleTarget);
        }
    }

    unsubscribe(id: number, eventHandle: EventHandle<T>, thisArg?: any): void {
        if (!eventHandle) {
            throw new GameFrameworkError("eventHandle is invalid");
        }
        let eventHandleTargetList = this._eventHandles.get(id);
        if (eventHandleTargetList) {
            let node = eventHandleTargetList.find((eventTargetHandle: EventHandleTarget<T>) => {
                return eventTargetHandle.handle === eventHandle && eventTargetHandle.target === thisArg;
            });
            if (node) {
                eventHandleTargetList.remove(node);
                this._targetHandles.delete(node.value.target, node.value);
                this.releaseEventHandleTarget(node.value);
            }
        }
    }

    unsubscribeTarget(target: object): void {
        let eventHandleTargetList = this._targetHandles.get(target);
        if (eventHandleTargetList) {
            eventHandleTargetList.forEach((eventTarget: EventHandleTarget<T>) => {
                this._eventHandles.delete(eventTarget.id, eventTarget);
                this.releaseEventHandleTarget(eventTarget);
            });
            this._targetHandles.delete(target);
        }
    }

    check(id: number, eventHandle: EventHandle<T>, thisArg?: any): boolean {
        if (!eventHandle) {
            throw new GameFrameworkError("eventHandle is invalid");
        }

        let eventHandleTargetList = this._eventHandles.get(id);
        if (eventHandleTargetList) {
            let node = eventHandleTargetList.find((eventTargetHandle: EventHandleTarget<T>) => {
                return eventTargetHandle.handle == eventHandle && eventTargetHandle.target == thisArg;
            });
            return node != null;
        }
        return false;
    }

    fire(sender: object, e: T): void {
        if (!e) {
            throw new GameFrameworkError("event is invalid");
        }
        let event = Event.create(sender, e);
        this._events.splice(0, 0, event);
    }

    fireNow(sender: object, e: T): void {
        if (!e) {
            throw new GameFrameworkError("event is invalid");
        }
        this.handleEvent(sender, e);
    }

    private handleEvent(sender: object, e: T): void {
        let eventHandleTargetList = this._eventHandles.get(e.id);
        if (eventHandleTargetList) {
            eventHandleTargetList.forEach((eventTarget: EventHandleTarget<T>) => {
                eventTarget.handle.call(eventTarget.target, sender, e);
            });
        } else {
            throw new GameFrameworkError(`event id:${e.id} has not event handle`);
        }

        ReferencePool.release(e);
    }

    private releaseEventHandleTarget(eventHandleTarget: EventHandleTarget<T>): void {
        ReferencePool.release(eventHandleTarget);
    }
}
