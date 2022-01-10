import { ModelEventArgs } from "../../../GameFramework/Scripts/Application/Model/ModelEventArgs";
import { ReferencePool } from "../../../GameFramework/Scripts/Base/ReferencePool/ReferencePool";
import { StairType } from "./Data/Elements/Stair";
import { MapEvent } from "./MapEvent";

export class MapAddElementEventArgs extends ModelEventArgs {
    private _level: number = 0;
    private _layerName: string = "";
    private _index: number = 0;
    private _info: any = null;

    get id(): number {
        return MapEvent.ADD_ELEMENT;
    }

    get level(): number {
        return this._level;
    }

    get layerName(): string {
        return this._layerName;
    }

    get index(): number {
        return this._index;
    }

    get info(): any {
        return this._info;
    }

    static create(level: number, layerName: string, index: number, info: any): MapAddElementEventArgs {
        let addElementEventArgs = ReferencePool.acquire(MapAddElementEventArgs);
        addElementEventArgs._level = level;
        addElementEventArgs._layerName = layerName;
        addElementEventArgs._index = index;
        addElementEventArgs._info = info;
        return addElementEventArgs;
    }

    clear(): void {
        this._level = 0;
        this._layerName = "";
        this._index = 0;
        this._info = null;
    }
}

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
