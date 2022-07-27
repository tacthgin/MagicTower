import { IVec2 } from "cc";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { ModelEventArgs } from "../../../GameFramework/Scripts/MVC/Model/ModelEventArgs";
import { StairType } from "./Data/Elements/Stair";
import { MapEvent } from "./MapEvent";

export class MapSwitchLevelEventArgs extends ModelEventArgs {
    private _level: number = 0;
    private _stairType: StairType = StairType.UP;

    get id(): number {
        return MapEvent.SWITCH_LEVEL;
    }

    get level(): number {
        return this._level;
    }

    get stairType(): StairType {
        return this._stairType;
    }

    static create(level: number, stairType: StairType): MapSwitchLevelEventArgs {
        let swtichLevelEventArgs = ReferencePool.acquire(MapSwitchLevelEventArgs);
        swtichLevelEventArgs._level = level;
        swtichLevelEventArgs._stairType = stairType;
        return swtichLevelEventArgs;
    }

    clear(): void {
        this._level = 0;
        this._stairType = StairType.UP;
    }
}

export class MapJumpLevelEventArgs extends ModelEventArgs {
    private _level: number = 0;
    private _heroTile: IVec2 = null!;

    get id(): number {
        return MapEvent.JUMP_LEVEL;
    }

    get level(): number {
        return this._level;
    }

    get heroTile(): IVec2 {
        return this._heroTile;
    }

    static create(level: number, heroTile: IVec2): MapJumpLevelEventArgs {
        let jumpLevelEventArgs = ReferencePool.acquire(MapJumpLevelEventArgs);
        jumpLevelEventArgs._level = level;
        jumpLevelEventArgs._heroTile = heroTile;
        return jumpLevelEventArgs;
    }

    clear(): void {
        this._level = 0;
        this._heroTile = null!;
    }
}
