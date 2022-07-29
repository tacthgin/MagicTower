import { ReferencePool } from "../../../GameFramework/Script/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Script/Event/GameEventArgs";
import { PropInfo } from "../../Model/HeroModel/Prop";
import { GameEvent } from "./GameEvent";

export class UsePropEventArgs extends GameEventArgs {
    private _propInfo: PropInfo = null!;
    private _extraInfo: string = null!;

    get id(): number {
        return GameEvent.USE_PROP;
    }

    get extraInfo(): string {
        return this._extraInfo;
    }

    get propInfo(): PropInfo {
        return this._propInfo;
    }

    static create(propInfo: PropInfo, extraInfo: string): UsePropEventArgs {
        let usePropEventArgs = ReferencePool.acquire(UsePropEventArgs);
        usePropEventArgs._propInfo = propInfo;
        usePropEventArgs._extraInfo = extraInfo;
        return usePropEventArgs;
    }

    clear(): void {
        this._propInfo = null!;
        this._extraInfo = null!;
    }
}
