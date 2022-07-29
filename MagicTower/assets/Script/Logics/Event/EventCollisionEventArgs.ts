import { IVec2 } from "../../../GameFramework/Script/Base/GameStruct/IVec2";
import { ReferencePool } from "../../../GameFramework/Script/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Script/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class EventCollisionEventArgs extends GameEventArgs {
    private _eventIdOrTile: number | string | IVec2 = null!;

    get id(): number {
        return GameEvent.COMMAND_EVENT;
    }

    get eventIdOrTile(): number | string | IVec2 {
        return this._eventIdOrTile;
    }

    static create(eventIdOrTile: number | string | IVec2): EventCollisionEventArgs {
        let eventCollisionEventArgs = ReferencePool.acquire(EventCollisionEventArgs);
        eventCollisionEventArgs._eventIdOrTile = eventIdOrTile;
        return eventCollisionEventArgs;
    }

    clear(): void {
        this._eventIdOrTile = null!;
    }
}
