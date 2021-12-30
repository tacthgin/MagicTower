import { IRerference } from "../ReferencePool/IRerference";
import { ReferencePool } from "../ReferencePool/ReferencePool";

export type EventHandle<T> = (sender: object, e: T) => void;

export class EventHandleTarget<T> implements IRerference {
    private _id: number | null = null;
    private _target: object | null = null;
    private _handle: EventHandle<T> | null = null;

    get id(): number {
        return this._id!;
    }

    get target(): object {
        return this._target!;
    }

    get handle(): EventHandle<T> {
        return this._handle!;
    }

    static create<T>(id: number, target: object, handle: EventHandle<T>): EventHandleTarget<T> {
        let eventHandleTarget: EventHandleTarget<T> = ReferencePool.acquire<EventHandleTarget<T>>(EventHandleTarget);
        eventHandleTarget._id = id;
        eventHandleTarget._target = target;
        eventHandleTarget._handle = handle;
        return eventHandleTarget;
    }

    clear(): void {
        this._id = null;
        this._target = null;
        this._handle = null;
    }
}
