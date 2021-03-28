import { _decorator, Component } from "cc";
const { ccclass, property } = _decorator;

import { ElementManager } from "../ElementManager";
import { NotifyCenter } from "../../../Managers/NotifyCenter";
import { GameEvent } from "../../Constant/GameEvent";

@ccclass("PropButton")
export default class PropButton extends Component {
    private propInfo: any = null;
    start() {}
    init(propInfo: any) {
        //this.propInfo = propInfo;
        //this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(propInfo.spriteId);
    }
    onPropButtonClick() {
        //let info = null;
        //if (this.propInfo.type == 9) {
        //info = this.node.getChildByName("label").getComponent(cc.Label).string == "上" ? "up" : "down";
        //}
        //NotifyCenter.emit(GameEvent.USE_PROP, this.propInfo, info);
    }
    setNum(num: number) {
        //let label = this.node.getChildByName("label");
        //if (num > 1) {
        //label.getComponent(cc.Label).string = num.toString();
        //label.active = true;
        //} else {
        //label.active = false;
        //}
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { ElementManager } from "../ElementManager";
// import { NotifyCenter } from "../../../Managers/NotifyCenter";
// import { GameEvent } from "../../../Constant/GameEvent";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export default class PropButton extends cc.Component {
//     private propInfo: any = null;
//
//     start() {}
//
//     init(propInfo: any) {
//         this.propInfo = propInfo;
//         this.getComponent(cc.Sprite).spriteFrame = ElementManager.getSpriteFrame(propInfo.spriteId);
//     }
//
//     onPropButtonClick() {
//         let info = null;
//         if (this.propInfo.type == 9) {
//             info = this.node.getChildByName("label").getComponent(cc.Label).string == "上" ? "up" : "down";
//         }
//         NotifyCenter.emit(GameEvent.USE_PROP, this.propInfo, info);
//     }
//
//     setNum(num: number) {
//         let label = this.node.getChildByName("label");
//         if (num > 1) {
//             label.getComponent(cc.Label).string = num.toString();
//             label.active = true;
//         } else {
//             label.active = false;
//         }
//     }
// }
