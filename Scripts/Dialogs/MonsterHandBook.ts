// import { Node, _decorator } from "cc";
// import { BaseDialog } from "../../Framework/Base/BaseDialog";
// import { Monster } from "../Data/CustomData/Element";
// import { MonsterHandBookItem } from "./MonsterHandBookItem";

// const { ccclass, property } = _decorator;

// @ccclass("MonsterHandBook")
// export class MonsterHandBook extends BaseDialog {
//     @property(Node)
//     private content: Node = null!;

//     onDisable() {
//         this.content.children.forEach((item) => {
//             item.getComponent(MonsterHandBookItem)?.remove();
//         });
//     }

//     init(monsters: Monster[]) {
//         //for (let i = 0; i < monsters.length; i++) {
//         //let item = ElementManager.getElement("MonsterHandBookItem");
//         //item.position = cc.v3(0, -i * 42);
//         //item.parent = this.content;
//         //item.getComponent("MonsterHandBookItem").init(monsters[i]);
//         //}
//     }
// }
