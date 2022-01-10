import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class UsePropEventArgs extends GameEventArgs {
    private _id: number = -1;
    private _propInfo: any = null;
    private _extraInfo: any = null;

    get id(): number {
        return GameEvent.USE_PROP;
    }

    get extraInfo(): any {
        return this._extraInfo;
    }

    get propInfo(): any {
        return this._propInfo;
    }

    static create(propInfo: any, extraInfo: any): UsePropEventArgs {
        let usePropEventArgs = ReferencePool.acquire(UsePropEventArgs);
        usePropEventArgs._propInfo = propInfo;
        usePropEventArgs._extraInfo = extraInfo;
        return usePropEventArgs;
    }

    clear(): void {
        this._id = -1;
        this._propInfo = null;
        this._extraInfo = null;
    }
}
