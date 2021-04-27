import { Sprite, _decorator } from "cc";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { MapElement } from "./Base/MapElement";
const { ccclass } = _decorator;

@ccclass("Stair")
export class Stair extends MapElement {
    private _standIndex: number = 0;
    private _stairType: string = null;
    private _levelDiff: number = 1;
    public _hide: boolean = false;

    public set hide(value) {
        this._hide = value;
    }

    public get hide() {
        return this._hide;
    }

    public get standIndex() {
        return this._standIndex;
    }

    public get stairType() {
        return this._stairType;
    }

    public get levelDiff() {
        return this._levelDiff;
    }

    add() {
        this._hide = false;
        this.node.active = true;
    }

    init(name: string, standIndex: number[]) {
        this._levelDiff = standIndex[1] || 1;
        this._stairType = name;
        this.getComponent(Sprite).spriteFrame = GameManager.RESOURCE.getSpriteFrame(`stair_${name}`);
        this._standIndex = standIndex[0];
    }
}
