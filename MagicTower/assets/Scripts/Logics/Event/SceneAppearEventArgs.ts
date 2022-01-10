import { Vec2 } from "cc";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { GameEventArgs } from "../../../GameFramework/Scripts/Event/GameEventArgs";
import { GameEvent } from "./GameEvent";

export class SceneAppearEventArgs extends GameEventArgs {
    private _level: number = 0;
    private _tile: Vec2 = Vec2.ZERO;

    get id(): number {
        return GameEvent.SCENE_APPEAR;
    }

    get level(): number {
        return this._level;
    }

    get tile(): Vec2 {
        return this._tile;
    }

    static create(level: number, tile: Vec2): SceneAppearEventArgs {
        let sceneAppearEventArgs = ReferencePool.acquire(SceneAppearEventArgs);
        sceneAppearEventArgs._level = level;
        sceneAppearEventArgs._tile = tile;
        return sceneAppearEventArgs;
    }

    clear(): void {
        this._level = 0;
        this._tile = Vec2.ZERO;
    }
}
