// import { Label, _decorator } from "cc";
// import { BaseDialog } from "../../Framework/Base/BaseDialog";
// import { GameManager } from "../../Framework/Managers/GameManager";
// import { HeroAttr, HeroModel } from "../Data/CustomData/HeroModel";
// import { ShopData } from "../Data/CustomData/ShopData";

// const { ccclass, property } = _decorator;

// @ccclass("ShopDialog")
// export class ShopDialog extends BaseDialog {
//     @property(Label)
//     content: Label = null!;

//     @property(Label)
//     attr: Label[] = [];

//     private callback: ((attr: string) => void) | null = null;

//     private isGoldEnough: boolean = true;

//     init(callback: (attr: string) => void) {
//         let shopData = GameManager.DATA.getData(ShopData)!;
//         this.content.string = `你若给我 ${shopData.needGold} 个金币，\n我就替你提升以下一种能力。`;
//         this.attr[0].string = `生命力 + ${shopData.hp}`;
//         this.attr[1].string = `攻击力 + ${shopData.attack}`;
//         this.attr[2].string = `防御力 + ${shopData.defence}`;
//         this.callback = callback;
//         let heroGold = GameManager.DATA.getData(HeroModel)!.getAttr(HeroAttr.GOLD);
//         this.isGoldEnough = shopData.needGold <= heroGold;
//     }

//     onBtnClick(event: any, customEventData: string) {
//         if (customEventData != "no") {
//             if (this.isGoldEnough) {
//                 this.callback && this.callback(customEventData);
//             } else {
//                 GameManager.UI.showToast("穷鬼还想买东西");
//                 return;
//             }
//         } else {
//             this.callback && this.callback(customEventData);
//         }
//         this.close();
//     }
// }
