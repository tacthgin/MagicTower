import { _decorator, Component, Label, NodePool } from "cc";
import { BasePoolNode } from "../../Framework/Base/BasePoolNode";
import { GameManager } from "../../Framework/Managers/GameManager";
import { HeroData } from "../Data/CustomData/HeroData";
import Monster from "../Game/Elements/Monster";

const { ccclass, property } = _decorator;

@ccclass("MonsterHandBookItem")
export class MonsterHandBookItem extends BasePoolNode {
    @property(Label)
    private labels: Label[] = [];

    @property(Label)
    private monsterName: Label | null = null;

    @property(Label)
    private damageLabel: Label | null = null;

    private monsterNode: any = null;

    init(monster: Monster) {
        let monsterInfo = monster.monsterInfo;
        this.monsterNode = GameManager.POOL.createPreloadPrefabNode("Monster");
        // this.monsterNode.position = cc.v3(-120, -20);
        // this.monsterNode.parent = this.node;
        // this.monsterNode.getComponent("Monster").init(monsterInfo.id);

        // this.labels[0].string = monsterInfo.hp;
        // this.labels[1].string = monsterInfo.attack;
        // this.labels[2].string = monsterInfo.defence;
        // this.labels[3].string = monsterInfo.gold;
        // this.monsterName.string = monsterInfo.name;
        // let heroData = GameManager.DATA.getData(HeroData);
        // let damage = CalculateSystem.totalHeroDamage(heroData, monster.monsterInfo);
        // if (damage == 0) {
        //     this.damageLabel.string = "无危险";
        // } else if (damage >= heroData.Hp) {
        //     this.damageLabel.string = "不可攻击";
        // } else {
        //     this.damageLabel.string = `损失${damage}血量`;
        // }
    }

    remove() {
        this.monsterNode.getComponent(Monster).remove();
        super.remove();
    }
}
