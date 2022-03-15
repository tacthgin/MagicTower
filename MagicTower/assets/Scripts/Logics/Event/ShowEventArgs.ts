import { IVec2 } from "../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class ShowEventArgs extends GameEventArgs {
    private _tileOrIndex: IVec2 | number = null!;

    get id(): number {
        return GameEvent.COMMAND_SHOW;
    }

    get tileOrIndex(): IVec2 | number {
        return this._tileOrIndex;
    }

    static create(tileOrIndex: IVec2 | number): ShowEventArgs {
        let showEventArgs = ReferencePool.acquire(ShowEventArgs);
        showEventArgs._tileOrIndex = tileOrIndex;
        return showEventArgs;
    }

    clear(): void {
        this._tileOrIndex = null!;
    }
}
