import { _decorator } from "cc";
const { ccclass } = _decorator;

import { DataManager } from "../../../Managers/DataManager";
import { ElementManager } from "../ElementManager";
import MapElement from "./MapElement";

@ccclass("Prop")
export class Prop extends MapElement {
    private _propInfo: any = null;
    get id() {
        //return this._propInfo.id;
    }
    get propInfo() {
        //return this._propInfo;
    }
    init(id: number) {
        //this._propInfo = DataManager.getJsonElement("prop", id);
        //this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(this._propInfo.spriteId);
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { DataManager } from "../../../Managers/DataManager";
// import { ElementManager } from "../ElementManager";
// import MapElement from "./MapElement";
//
// const { ccclass } = cc._decorator;
//
// @ccclass
// export class Prop extends MapElement {
//     private _propInfo: any = null;
//
//     get id() {
//         return this._propInfo.id;
//     }
//
//     get propInfo() {
//         return this._propInfo;
//     }
//
//     init(id: number) {
//         this._propInfo = DataManager.getJsonElement("prop", id);
//
//         this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(this._propInfo.spriteId);
//     }
// }
