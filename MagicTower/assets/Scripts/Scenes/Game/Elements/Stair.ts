import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { ElementManager } from "../ElementManager";
import MapElement from "./MapElement";

@ccclass('Stair')
export default class Stair extends MapElement {
    private _standIndex: number = 0;
    private _stairType: string = null;
    private _levelDiff: number = 1;
    public _hide: boolean = false;
    public set hide(value) {
        //this._hide = value;
    }
    public get hide() {
        //return this._hide;
    }
    public get standIndex() {
        //return this._standIndex;
    }
    public get stairType() {
        //return this._stairType;
    }
    public get levelDiff() {
        //return this._levelDiff;
    }
    add() {
        //this._hide = false;
        //this.node.active = true;
    }
    init(name: string, standIndex) {
        //this._levelDiff = standIndex[1] || 1;
        //this._stairType = name;
        //this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`stair_${name}`);
        //this._standIndex = standIndex[0];
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { ElementManager } from "../ElementManager";
// import MapElement from "./MapElement";
// 
// const { ccclass } = cc._decorator;
// 
// @ccclass
// export default class Stair extends MapElement {
//     private _standIndex: number = 0;
// 
//     private _stairType: string = null;
// 
//     private _levelDiff: number = 1;
// 
//     public _hide: boolean = false;
// 
//     public set hide(value) {
//         this._hide = value;
//     }
// 
//     public get hide() {
//         return this._hide;
//     }
// 
//     public get standIndex() {
//         return this._standIndex;
//     }
// 
//     public get stairType() {
//         return this._stairType;
//     }
// 
//     public get levelDiff() {
//         return this._levelDiff;
//     }
// 
//     add() {
//         this._hide = false;
//         this.node.active = true;
//     }
// 
//     init(name: string, standIndex) {
//         this._levelDiff = standIndex[1] || 1;
//         this._stairType = name;
//         this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(`stair_${name}`);
//         this._standIndex = standIndex[0];
//     }
// }
