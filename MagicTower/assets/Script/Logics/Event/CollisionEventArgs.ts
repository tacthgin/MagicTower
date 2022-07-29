import { IVec2 } from "../../../GameFramework/Script/Base/GameStruct/IVec2";
import { ReferencePool } from "../../../GameFramework/Script/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Script/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class CollisionEventArgs extends GameEventArgs {
    private _collisionTileOrIndex: number | IVec2 = null!;

    get id(): number {
        return GameEvent.COMMAND_COLLISION;
    }

    get collisionTileOrIndex(): IVec2 | number {
        return this._collisionTileOrIndex;
    }

    static create(collisionTile: IVec2 | number): CollisionEventArgs {
        let collisionEventArgs = ReferencePool.acquire(CollisionEventArgs);
        collisionEventArgs._collisionTileOrIndex = collisionTile;
        return collisionEventArgs;
    }

    clear(): void {
        this._collisionTileOrIndex = null!;
    }
}
