import { IVec2 } from "../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class CollisionEventArgs extends GameEventArgs {
    private _collisionTile: IVec2 = null!;

    get id(): number {
        return GameEvent.COMMAND_COLLISION;
    }

    get collisionTile(): IVec2 {
        return this._collisionTile;
    }

    static create(collisionTile: IVec2): CollisionEventArgs {
        let collisionEventArgs = ReferencePool.acquire(CollisionEventArgs);
        collisionEventArgs._collisionTile = collisionTile;
        return collisionEventArgs;
    }

    clear(): void {
        this._collisionTile = null!;
    }
}
