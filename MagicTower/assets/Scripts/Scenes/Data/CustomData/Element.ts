import { BaseLoadData } from "../../../Framework/Base/BaseData";
import { GameManager } from "../../../Framework/Managers/GameManager";

export class Element extends BaseLoadData {
    protected _gid: number = 0;
    protected _id: number = 0;
    protected _index: number = 0;

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

    set index(value: number) {
        this._index = value;
    }

    /** tile index */
    get index() {
        return this._index;
    }
}

export enum DoorType {
    YELLOW = 1001,
    BLUE,
    RED,
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
    private _condition: any = null;

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

    set condition(value: any) {
        this._condition = value;
    }

    /** 事件门条件 */
    get condition() {
        return this._condition;
    }

    canWallOpen() {
        return this._doorState == DoorState.NONE && this._id == DoorType.WALL;
    }

    isKeyDoor() {
        return this._id <= DoorType.RED;
    }

    static isYellow(id: number) {
        return id == DoorType.YELLOW;
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

export class Monster extends Element {
    private _monsterInfo: any = null;

    set id(value: number) {
        this._id = value;
        this._monsterInfo = GameManager.DATA.getJsonElement("monster", this._id, true);
    }

    get monsterInfo() {
        return this._monsterInfo;
    }

    get firstAttack(): boolean {
        return this._monsterInfo.firstAttack;
    }

    get boss(): boolean {
        return this._monsterInfo.boss;
    }

    hurt(damage: number) {
        this._monsterInfo.hp -= damage;
        if (this._monsterInfo.hp < 0) {
            this._monsterInfo.hp = 0;
        }
        return this._monsterInfo.hp == 0;
    }

    weak(ratio: number) {
        this._monsterInfo.attack *= ratio;
        this._monsterInfo.defence *= ratio;
        this._monsterInfo.hp *= ratio;
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
