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
}

export class Door extends Element {
    private _doorState: DoorState = DoorState.NONE;
    private _passive: boolean = false;
    private _appear: boolean = false;
    private _hide: boolean = false;
    private _condition: boolean = false;

    set passive(value: boolean) {
        this._passive = value;
        this._doorState = DoorState.PASSIVE;
    }

    /** 被动的墙 */
    get passive() {
        return this._passive;
    }

    set appear(value: boolean) {
        this._appear = value;
        this._doorState = DoorState.APPEAR;
    }

    /** 点击出现的墙 */
    get appear() {
        return this._appear;
    }

    set hide(value: boolean) {
        this._hide = value;
        this._doorState = DoorState.HIDE;
    }

    /** 隐藏的墙 */
    get hide() {
        return this._hide;
    }

    set condition(value: boolean) {
        this._condition = value;
        this._doorState = DoorState.CONDITION;
    }

    /** 开门条件 */
    get condition() {
        return this._condition;
    }

    canWallOpen() {
        return !this._passive && this._id == DoorType.WALL && !this._appear && !this._condition;
    }

    isYellow() {
        return this._id == DoorType.YELLOW;
    }
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
