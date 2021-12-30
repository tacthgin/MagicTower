// import { _decorator, Label, Node } from "cc";
// const { ccclass, property } = _decorator;

// import { BaseDialog } from "../../Framework/Base/BaseDialog";
// import Npc from "../Logics/Game/Elements/Npc";

// @ccclass("RewardDialog")
// export class RewardDialog extends BaseDialog {
//     @property(Label)
//     content: Label | null = null;
//     @property(Node)
//     thanksNode: Node | null = null;
//     @property(Label)
//     thanksLabel: Label | null = null;
//     @property(Node)
//     bussinessNode: Node | null = null;
//     private callback: (apt: boolean) => void = null;
//     private npc: Npc = null;
//     init(element: Npc, callback: (apt: boolean) => void) {
//         //this.clickBgClose = false;
//         //this.npc = element;
//         //this.content.string = element.talk().talk;
//         //this.callback = callback;
//         //this.thanksNode.active = element.onceStep;
//         //this.bussinessNode.active = !element.onceStep;
//         //this.thanksLabel.string = element.npcInfo.type == 2 ? "谢谢" : "我太需要了";
//     }
//     onNextBtnClick() {
//         //this.callback && this.callback(false);
//         //this.close();
//     }
//     onAptBtnClick() {
//         //this.callback && this.callback(true);
//         //this.close();
//     }
// }

// /**
//  * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
//  */
// // import {BaseDialog} from "./BaseDialog";
// // import Npc from "../Game/Elements/Npc";
// // import { DataManager } from "../../Managers/DataManager";
// //
// // const { ccclass, property } = cc._decorator;
// //
// // @ccclass
// // export class RewardDialog extends BaseDialog {
// //     @property(cc.Label)
// //     content: cc.Label = null;
// //
// //     @property(cc.Node)
// //     thanksNode: cc.Node = null;
// //
// //     @property(cc.Label)
// //     thanksLabel: cc.Label = null;
// //
// //     @property(cc.Node)
// //     bussinessNode: cc.Node = null;
// //
// //     private callback: (accept: boolean) => void = null;
// //
// //     private npc: Npc = null;
// //
// //     init(element: Npc, callback: (accept: boolean) => void) {
// //         this.clickBgClose = false;
// //
// //         this.npc = element;
// //         this.content.string = element.talk().talk;
// //         this.callback = callback;
// //         this.thanksNode.active = element.onceStep;
// //         this.bussinessNode.active = !element.onceStep;
// //
// //         this.thanksLabel.string = element.npcInfo.type == 2 ? "谢谢" : "我太需要了";
// //     }
// //
// //     onNextBtnClick() {
// //         this.callback && this.callback(false);
// //         this.close();
// //     }
// //
// //     onAcceptBtnClick() {
// //         this.callback && this.callback(true);
// //         this.close();
// //     }
// // }
