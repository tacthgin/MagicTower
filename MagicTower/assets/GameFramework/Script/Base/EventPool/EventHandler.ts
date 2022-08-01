import { IRerference } from "../ReferencePool/IRerference";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { BaseEventArgs } from "./BaseEventArgs";

export type EventHandler<T extends BaseEventArgs> = (sender: object, eventArgs: T) => void;

export class EventHandlerTarget<T extends BaseEventArgs> implements IRerference {
    private _id: number = null!;
    private _target: object = null!;
    private _handler: EventHandler<T> = null!;

    get id(): number {
        return this._id;
    }

    get target(): object {
        return this._target;
    }

    get handler(): EventHandler<T> {
        return this._handler;
    }

    static create<T extends BaseEventArgs>(id: number, target: object, handler: EventHandler<T>): EventHandlerTarget<T> {
        let eventHandleTarget = ReferencePool.acquire<EventHandlerTarget<T>>(EventHandlerTarget);
        eventHandleTarget._id = id;
        eventHandleTarget._target = target;
        eventHandleTarget._handler = handler;
        return eventHandleTarget;
    }

    clear(): void {
        this._id = null!;
        this._target = null!;
        this._handler = null!;
    }
}
