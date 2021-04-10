import { Node, _decorator } from "cc";
import { BaseDialog } from "../../Frame/Base/BaseDialog";
import Monster from "../Game/Elements/Monster";
const { ccclass, property } = _decorator;

@ccclass("MonsterHandBook")
export default class MonsterHandBook extends BaseDialog {
    @property(Node)
    content: Node | null = null;
    init(monsters: Monster[]) {
        //for (let i = 0; i < monsters.length; i++) {
        //let item = ElementManager.getElement("MonsterHandBookItem");
        //item.position = cc.v3(0, -i * 42);
        //item.parent = this.content;
        //item.getComponent("MonsterHandBookItem").init(monsters[i]);
        //}
    }
    close() {
        //this.content.children.forEach(item => {
        //item.getComponent("MonsterHandBookItem").recyle();
        //});
        //super.close();
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import {BaseDialog} from "./BaseDialog";
// import Monster from "../Game/Elements/Monster";
// import { ElementManager } from "../Game/ElementManager";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export default class MonsterHandBook extends BaseDialog {
//     @property(cc.Node)
//     content: cc.Node = null;
//
//     init(monsters: Monster[]) {
//         for (let i = 0; i < monsters.length; i++) {
//             let item = ElementManager.getElement("MonsterHandBookItem");
//             item.position = cc.v3(0, -i * 42);
//             item.parent = this.content;
//             item.getComponent("MonsterHandBookItem").init(monsters[i]);
//         }
//     }
//
//     close() {
//         this.content.children.forEach(item => {
//             item.getComponent("MonsterHandBookItem").recyle();
//         });
//         super.close();
//     }
// }
