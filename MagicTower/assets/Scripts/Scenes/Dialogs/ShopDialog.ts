import { Button, Label, _decorator } from "cc";
import BaseDialog from "../../Frame/Base/BaseDialog";
import ShopInfo from "../Data/ShopInfo";
const { ccclass, property } = _decorator;

@ccclass("ShopDialog")
export default class ShopDialog extends BaseDialog {
    @property(Label)
    content: Label | null = null;
    @property(Label)
    attr: Label[] = [];
    private callback: (attr: string) => void = null;
    private isGoldEnough: boolean = true;
    init(shopInfo: ShopInfo, heroGold: number, callback: (attr: string) => void) {
        //this.clickBgClose = false;
        //this.content.string = `你若给我 ${shopInfo.needGold} 个金币，\n我就替你提升以下一种能力。`;
        //this.attr[0].string = `生命力 + ${shopInfo.hp}`;
        //this.attr[1].string = `攻击力 + ${shopInfo.attackValue}`;
        //this.attr[2].string = `防御力 + ${shopInfo.defenceValue}`;
        //this.callback = callback;
        //this.isGoldEnough = shopInfo.needGold <= heroGold;
    }
    onBtnClick(button: Button, customEventData: string) {
        //if (customEventData != "no") {
        //if (this.isGoldEnough) {
        //this.callback && this.callback(customEventData);
        //} else {
        //GameManager.getInstance().showToast("穷鬼还想买东西");
        //return;
        //}
        //} else {
        //this.callback && this.callback(customEventData);
        //}
        //this.close();
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import BaseDialog from "./BaseDialog";
// import Npc from "../Game/Elements/Npc";
// import { NotifyCenter } from "../../Managers/NotifyCenter";
// import { GameEvent } from "../../Constant/GameEvent";
// import ShopInfo from "../../Data/ShopInfo";
// import { GameManager } from "../../Managers/GameManager";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export default class ShopDialog extends BaseDialog {
//     @property(cc.Label)
//     content: cc.Label = null;
//
//     @property(cc.Label)
//     attr: cc.Label[] = [];
//
//     private callback: (attr: string) => void = null;
//
//     private isGoldEnough: boolean = true;
//
//     init(shopInfo: ShopInfo, heroGold: number, callback: (attr: string) => void) {
//         this.clickBgClose = false;
//
//         this.content.string = `你若给我 ${shopInfo.needGold} 个金币，\n我就替你提升以下一种能力。`;
//
//         this.attr[0].string = `生命力 + ${shopInfo.hp}`;
//         this.attr[1].string = `攻击力 + ${shopInfo.attackValue}`;
//         this.attr[2].string = `防御力 + ${shopInfo.defenceValue}`;
//
//         this.callback = callback;
//         this.isGoldEnough = shopInfo.needGold <= heroGold;
//     }
//
//     onBtnClick(button: cc.Button, customEventData: string) {
//         if (customEventData != "no") {
//             if (this.isGoldEnough) {
//                 this.callback && this.callback(customEventData);
//             } else {
//                 GameManager.getInstance().showToast("穷鬼还想买东西");
//                 return;
//             }
//         } else {
//             this.callback && this.callback(customEventData);
//         }
//
//         this.close();
//     }
// }
