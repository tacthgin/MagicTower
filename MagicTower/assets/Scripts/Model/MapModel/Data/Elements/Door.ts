import { Element } from "./Element";

export enum DoorType {
    YELLOW = 1001,
    BLUE,
    RED,
    PRISON,
    MONSTER,
    WALL,
}

export enum DoorState {
    /** 正常的门 */
    NORMAL,
    /** 被动门，一般是被动的墙门 */
    PASSIVE,
    /** 默认隐藏的门，点击会出现 */
    APPEAR,
    /** 默认隐藏的门 */
    HIDE,
    /** 怪物守卫的门 */
    MONSTER,
    /** 所有门出现后触发事件 */
    APPEAR_EVENT,
    /** 门消失后触发事件 */
    DISAPPEAR_EVENT,
    /** 怪物死后，门可以打开 */
    MONSTER_EVENT,
}

export class Door extends Element {
    private _doorState: DoorState = DoorState.NORMAL;

    set doorState(value: DoorState) {
        this._doorState = value;
    }

    get doorState() {
        return this._doorState;
    }

    canWallOpen() {
        return this._doorState == DoorState.NORMAL && this._id == DoorType.WALL;
    }

    isKeyDoor() {
        return this._id <= DoorType.RED;
    }

    isYellow() {
        return this._id == DoorType.YELLOW;
    }
}
