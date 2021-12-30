import { BaseEventArgs } from "../Base/EventPool/BaseEventArgs";
import { ReferencePool } from "../Base/ReferencePool/ReferencePool";

export class UIEventArgs extends BaseEventArgs {
    private _id: number = -1;

    get id(): number {
        return this._id;
    }

    static create(id: number): UIEventArgs {
        let uiEventArgs = ReferencePool.acquire(UIEventArgs);
        uiEventArgs._id = id;
        return uiEventArgs;
    }

    clear(): void {
        this._id = -1;
    }
}
