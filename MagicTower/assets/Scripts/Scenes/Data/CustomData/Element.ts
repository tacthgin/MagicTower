import { BaseLoadData } from "../../../Framework/Base/BaseData";

export class Element extends BaseLoadData {
    protected _gid: number = 0;
    protected _id: number = 0;

    set gid(value: number) {
        this._gid = value;
    }

    /** tile唯一id */
    get gid() {
        return this._gid;
    }

    set id(value: number) {
        this._id = value;
    }

    /** 唯一id */
    get id() {
        return this._id;
    }
}

export enum DoorType {
    YELLOW = 1001,
    WALL = 1006,
}

export enum DoorState {
    NONE,
    PASSIVE,
    APPEAR,
    HIDE,
    CONDITION,
    APPEAR_EVENT,
    DISAPPEAR_EVENT,
}

export class Door extends Element {
    private _doorState: DoorState = DoorState.NONE;
    private _value: any = null;

    static cantOpenConditionArray: Readonly<DoorState[]> = [DoorState.PASSIVE, DoorState.APPEAR, DoorState.CONDITION];

    set doorState(value: DoorState) {
        this._doorState = value;
    }

    get doorState() {
        return this._doorState;
    }

    set value(value: any) {
        this._value = value;
    }

    get value() {
        return this._value;
    }

    canWallOpen() {
        return !Door.cantOpenConditionArray.includes(this._doorState) && this._id == DoorType.WALL;
    }

    isYellow() {
        return this._id == DoorType.YELLOW;
    }
}

export enum StairType {
    UP,
    Down,
}

export class Stair extends Element {
    private _standLocation: number = 0;
    private _levelDiff: number = 1;
    private _hide: boolean = false;

    set standLocation(value: number) {
        this._standLocation = value;
    }

    /** 楼梯旁站立的坐标索引 */
    get standLocation() {
        return this._standLocation;
    }

    set levelDiff(value: number) {
        this._levelDiff = value;
    }

    /** 跳转的等级差 */
    get levelDiff() {
        return this._levelDiff;
    }

    set hide(value: boolean) {
        this._hide = value;
    }

    /** 隐藏的楼梯 */
    get hide() {
        return this._hide;
    }
}

export class EventInfo extends Element {
    private _monsters: string[] | null = null;

    set monsters(value: string[]) {
        this._monsters = value;
    }

    get mosnters() {
        return this._monsters;
    }
}
