import { GameFrameworkMap } from "../Container/GameFrameworkMap";
import { GameFrameworkError } from "../GameFrameworkError";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { BaseEventArgs } from "./BaseEventArgs";
import { Event } from "./Event";
import { EventHandler, EventHandlerTarget } from "./EventHandler";
import { EventPoolMode } from "./EventPoolMode";

/**
 * 事件池，目前只适用于单线程中
 */
export class EventPool<T extends BaseEventArgs> {
    private readonly _eventHandlers: GameFrameworkMap<number, EventHandlerTarget<T>> = null!;
    private readonly _targetHandlers: GameFrameworkMap<object, EventHandlerTarget<T>> = null!;
    private readonly _events: Array<Event<T>> = null!;
    private readonly _eventPoolMode: EventPoolMode = EventPoolMode.DEFAULT;

    constructor(mode: EventPoolMode = EventPoolMode.DEFAULT) {
        this._eventHandlers = new GameFrameworkMap<number, EventHandlerTarget<T>>();
        this._targetHandlers = new GameFrameworkMap<object, EventHandlerTarget<T>>();
        this._events = new Array<Event<T>>();
        this._eventPoolMode = mode;
    }

    update(elapseSeconds: number): void {
        if (this._events.length > 0) {
            let event: Event<T> = this._events.pop()!;
            this.handleEvent(event.sender, event.eventArgs);
            ReferencePool.release(event);
        }
    }

    shutDown() {
        this._eventHandlers.clear();
        this._targetHandlers.clear();
        this._events.length = 0;
    }

    clear() {
        this._events.length = 0;
    }

    subscribe(id: number, eventHandler: EventHandler<T>, thisArg?: any): void {
        if (!eventHandler) {
            throw new GameFrameworkError("eventHandler is invalid");
        }
        let eventHandleTarget = EventHandlerTarget.create(id, thisArg, eventHandler);
        this._eventHandlers.set(id, eventHandleTarget);
        if (thisArg) {
            this._targetHandlers.set(thisArg, eventHandleTarget);
        }
    }

    unsubscribe(id: number, eventHandler: EventHandler<T>, thisArg?: any): void {
        if (!eventHandler) {
            throw new GameFrameworkError("eventHandler is invalid");
        }
        let eventHandleTargetList = this._eventHandlers.get(id);
        if (eventHandleTargetList) {
            let node = eventHandleTargetList.find((eventTargetHandle: EventHandlerTarget<T>) => {
                return eventTargetHandle.handler === eventHandler && eventTargetHandle.target === thisArg;
            });
            if (node) {
                eventHandleTargetList.remove(node);
                this._targetHandlers.delete(node.value.target, node.value);
                this.releaseEventHandleTarget(node.value);
            }
        }
    }

    unsubscribeTarget(target: object): void {
        let eventHandleTargetList = this._targetHandlers.get(target);
        if (eventHandleTargetList) {
            eventHandleTargetList.forEach((eventTarget: EventHandlerTarget<T>) => {
                this._eventHandlers.delete(eventTarget.id, eventTarget);
                this.releaseEventHandleTarget(eventTarget);
            });
            this._targetHandlers.delete(target);
        }
    }

    check(id: number, eventHandler: EventHandler<T>, thisArg?: any): boolean {
        if (!eventHandler) {
            throw new GameFrameworkError("eventHandler is invalid");
        }

        let eventHandleTargetList = this._eventHandlers.get(id);
        if (eventHandleTargetList) {
            let node = eventHandleTargetList.find((eventTargetHandle: EventHandlerTarget<T>) => {
                return eventTargetHandle.handler === eventHandler && eventTargetHandle.target === thisArg;
            });
            return node != null;
        }
        return false;
    }

    /**
     * 延迟一帧发送事件
     * @param sender 事件宿主
     * @param eventArgs 事件参数
     */
    fire(sender: object, eventArgs: T): void {
        if (!eventArgs) {
            throw new GameFrameworkError("event args is invalid");
        }
        let event = Event.create(sender, eventArgs);
        this._events.splice(0, 0, event);
    }

    fireNow(sender: object, eventArgs: T): void {
        if (!eventArgs) {
            throw new GameFrameworkError("event args is invalid");
        }
        this.handleEvent(sender, eventArgs);
    }

    private handleEvent(sender: object, e: T): void {
        let eventHandleTargetList = this._eventHandlers.get(e.id);
        if (eventHandleTargetList) {
            eventHandleTargetList.forEach((eventTarget: EventHandlerTarget<T>) => {
                eventTarget.handler.call(eventTarget.target, sender, e);
            });
        } else if (this._eventPoolMode !== EventPoolMode.ALLOW_NO_HANDLER) {
            throw new GameFrameworkError(`event id:${e.id} has not event handler`);
        }

        ReferencePool.release(e);
    }

    private releaseEventHandleTarget(eventHandleTarget: EventHandlerTarget<T>): void {
        ReferencePool.release(eventHandleTarget);
    }
}
