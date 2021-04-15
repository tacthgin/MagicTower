import { _decorator, Component, Label, NodePool } from "cc";
const { ccclass, property } = _decorator;

import { ElementManager } from "../Game/ElementManager";
import Monster from "../Game/Elements/Monster";
import CalculateSystem from "../Game/System/CalculateSystem";
import { DataManager } from "../../Managers/DataManager";

@ccclass("MonsterHandBookItem")
export default class MonsterHandBookItem extends Component {
    @property(Label)
    private labels: Label[] = [];
    @property(Label)
    private monsterName: Label | null = null;
    @property(Label)
    private damageLabel: Label | null = null;
    private pool: NodePool | null = null;
    private monsterNode = null;
    reuse(pool) {
        //this.pool = pool;
    }
    init(monster: Monster) {
        //let monsterInfo = monster.monsterInfo;
        //this.monsterNode = ElementManager.getElement("Monster");
        //this.monsterNode.position = cc.v3(-120, -20);
        //this.monsterNode.parent = this.node;
        //this.monsterNode.getComponent("Monster").init(monsterInfo.id);
        //this.labels[0].string = monsterInfo.hp;
        //this.labels[1].string = monsterInfo.attack;
        //this.labels[2].string = monsterInfo.defence;
        //this.labels[3].string = monsterInfo.gold;
        //this.monsterName.string = monsterInfo.name;
        //let heroInfo = DataManager.getCustomData("GameInfo").HeroInfo;
        //let damage = CalculateSystem.totalHeroDamage(heroInfo, monster.monsterInfo);
        //if (damage == 0) {
        //this.damageLabel.string = "无危险";
        //} else if (damage >= heroInfo.Hp) {
        //this.damageLabel.string = "不可攻击";
        //} else {
        //this.damageLabel.string = `损失${damage}血量`;
        //}
    }
    recyle() {
        //this.monsterNode.getComponent("Monster").remove(true);
        //this.pool.put(this.node);
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { ElementManager } from "../Game/ElementManager";
// import Monster from "../Game/Elements/Monster";
// import CalculateSystem from "../Game/System/CalculateSystem";
// import { DataManager } from "../../Managers/DataManager";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export default class MonsterHandBookItem extends cc.Component {
//     @property(cc.Label)
//     private labels: cc.Label[] = [];
//
//     @property(cc.Label)
//     private monsterName: cc.Label = null;
//
//     @property(cc.Label)
//     private damageLabel: cc.Label = null;
//
//     private pool: cc.NodePool = null;
//
//     private monsterNode = null;
//
//     reuse(pool) {
//         this.pool = pool;
//     }
//
//     init(monster: Monster) {
//         let monsterInfo = monster.monsterInfo;
//
//         this.monsterNode = ElementManager.getElement("Monster");
//         this.monsterNode.position = cc.v3(-120, -20);
//         this.monsterNode.parent = this.node;
//         this.monsterNode.getComponent("Monster").init(monsterInfo.id);
//
//         this.labels[0].string = monsterInfo.hp;
//         this.labels[1].string = monsterInfo.attack;
//         this.labels[2].string = monsterInfo.defence;
//         this.labels[3].string = monsterInfo.gold;
//
//         this.monsterName.string = monsterInfo.name;
//
//         let heroInfo = DataManager.getCustomData("GameInfo").HeroInfo;
//         let damage = CalculateSystem.totalHeroDamage(heroInfo, monster.monsterInfo);
//         if (damage == 0) {
//             this.damageLabel.string = "无危险";
//         } else if (damage >= heroInfo.Hp) {
//             this.damageLabel.string = "不可攻击";
//         } else {
//             this.damageLabel.string = `损失${damage}血量`;
//         }
//     }
//
//     recyle() {
//         this.monsterNode.getComponent("Monster").remove(true);
//         this.pool.put(this.node);
//     }
// }
