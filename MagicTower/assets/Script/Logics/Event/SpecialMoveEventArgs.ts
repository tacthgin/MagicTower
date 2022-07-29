import { ReferencePool } from "../../../GameFramework/Script/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Script/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class SpecialMoveEventArgs extends GameEventArgs {
    private _specialMoveInfo: any = null;

    get id(): number {
        return GameEvent.COMMAND_SPECIAL_MOVE;
    }

    get specialMoveInfo(): any {
        return this._specialMoveInfo;
    }

    static create(specialMoveInfo: any): SpecialMoveEventArgs {
        let specialMoveEventArgs = ReferencePool.acquire(SpecialMoveEventArgs);
        specialMoveEventArgs._specialMoveInfo = specialMoveInfo;
        return specialMoveEventArgs;
    }

    clear(): void {
        this._specialMoveInfo = null;
    }
}
