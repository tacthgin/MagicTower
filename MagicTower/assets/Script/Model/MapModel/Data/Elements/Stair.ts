import { Element } from "./Element";

export enum StairType {
    UP,
    Down,
}

export class Stair extends Element {
    private _standLocation: number = 0;
    private _levelDiff: number = 1;

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
}
