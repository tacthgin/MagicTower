import { IRerference } from "../ReferencePool/IRerference";
import { ReferencePool } from "../ReferencePool/ReferencePool";
import { BaseEventArgs } from "./BaseEventArgs";

export class Event<T extends BaseEventArgs> implements IRerference {
    private _sender: object | null = null;
    private _eventArgs: T | null = null;

    get sender(): object {
        return this._sender!;
    }

    get eventArgs(): T {
        return this._eventArgs!;
    }

    static create<T extends BaseEventArgs>(sender: object, eventArgs: T): Event<T> {
        let eventNode: Event<T> = ReferencePool.acquire<Event<T>>(Event);
        eventNode._sender = sender;
        eventNode._eventArgs = eventArgs;
        return eventNode;
    }

    clear(): void {
        this._sender = null;
        this._eventArgs = null;
    }
}
