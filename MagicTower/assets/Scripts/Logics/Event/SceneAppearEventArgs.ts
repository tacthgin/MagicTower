import { IVec2 } from "../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class SceneAppearEventArgs extends GameEventArgs {
    private _level: number = 0;
    private _tile: IVec2 | null = null;

    get id(): number {
        return GameEvent.SCENE_APPEAR;
    }

    get level(): number {
        return this._level;
    }

    get tile(): IVec2 {
        return this._tile!;
    }

    static create(level: number, tile: IVec2): SceneAppearEventArgs {
        let sceneAppearEventArgs = ReferencePool.acquire(SceneAppearEventArgs);
        sceneAppearEventArgs._level = level;
        sceneAppearEventArgs._tile = tile;
        return sceneAppearEventArgs;
    }

    clear(): void {
        this._level = 0;
        this._tile = null;
    }
}
