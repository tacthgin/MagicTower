import { BaseLoadData } from "../../../Framework/Base/BaseData";

class Element extends BaseLoadData {
    private _gid: number = 0;

    set gid(value: number) {
        this._gid = value;
    }

    /** tile唯一id */
    get gid() {
        return this._gid;
    }
}

export class Door extends Element {
    private _passive: boolean = false;
    private _appear: boolean = false;
    private _hide: boolean = false;

    set passive(value: boolean) {
        this._passive = value;
    }

    /** 被动的墙 */
    get passive() {
        return this._passive;
    }

    set appear(value: boolean) {
        this._appear = value;
    }

    /** 点击出现的墙 */
    get appear() {
        return this._appear;
    }

    set hide(value: boolean) {
        this._hide = value;
    }

    /** 隐藏的墙 */
    get hide() {
        return this._hide;
    }
}

export class Stair extends Element {
    /** 楼梯旁站立的坐标索引 */
    private _standLocation: number = 0;
    /** 跳转的等级差 */
    private _levelDiff: number = 1;
    /** 隐藏的楼梯 */
    private _hide: boolean = false;
}
