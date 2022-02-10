import { IVec2 } from "../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class MoveEventArgs extends GameEventArgs {
    private _collisionTile: IVec2 = null!;

    get id(): number {
        return GameEvent.COMMAND_COLLISION;
    }

    get collisionTile(): IVec2 {
        return this._collisionTile;
    }

    static create(collisionTile: IVec2): MoveEventArgs {
        let moveEventArgs = ReferencePool.acquire(MoveEventArgs);
        moveEventArgs._collisionTile = collisionTile;
        return moveEventArgs;
    }

    clear(): void {
        this._collisionTile = null!;
    }
}
