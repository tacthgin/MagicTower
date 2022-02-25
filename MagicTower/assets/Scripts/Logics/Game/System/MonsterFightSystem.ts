import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { GameFrameworkError } from "../../../../GameFramework/Scripts/Base/GameFrameworkError";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { PropType } from "../../../Model/HeroModel/Prop";
import { Monster } from "../../../Model/MapModel/Data/Elements/Monster";
import { MonsterDieEventArgs } from "../../Event/MonsterDieEventArgs";
import { MonsterFightEventArgs } from "../../Event/MonsterFightEventArgs";
import { Hero } from "../Map/Hero/Hero";
import { CalculateSystem } from "./CalculateSystem";

const ATTACK_INTERVAL = 0.1;

@CommandManager.register("MonsterFightSystem")
export class MonsterFightSystem extends SystemBase {
    private hero: Hero = null!;
    private monster: Monster = null!;

    initliaze(hero: Hero, monster: Monster) {
        this.hero = hero;
        this.monster = monster;
    }

    /**
     * 执行事件
     * @param magic 是否后续还有魔法伤害
     */
    execute(magic: boolean) {
        if (!this.hero || !this.monster) {
            throw new GameFrameworkError("you must initliaze monster fight system");
        }

        let heroModel = GameApp.getModel(HeroModel);
        let monsterInfo = this.monster.monsterInfo;
        let count = CalculateSystem.getHeroAttackCount(heroModel, monsterInfo);
        let damageInfo = CalculateSystem.perAttackDamage(heroModel, monsterInfo);
        //谁先攻击 0英雄先攻击
        let heroFirst = !monsterInfo.firstAttack;
        let attackCount = heroFirst ? count * 2 : count * 2 + 1;
        //先贴图怪物信息
        GameApp.EventManager.fireNow(this, MonsterFightEventArgs.create(this.monster.monsterInfo));
        this.schedule(
            () => {
                if (heroFirst) {
                    this.hero.showAttack(true);
                    this.monster.hurt(damageInfo.monsterDamage);
                    GameApp.EventManager.fireNow(this, MonsterFightEventArgs.create(this.monster.monsterInfo));
                } else {
                    this.hero.showAttack(false);
                    //怪物死了
                    if (this.monster.monsterInfo.hp == 0) {
                        this.monsterDie(this.monster);
                        GameApp.EventManager.fireNow(this, MonsterDieEventArgs.create(this.monster, magic));
                    } else {
                        heroModel.setAttrDiff(HeroAttr.HP, -damageInfo.heroDamage);
                    }
                }

                heroFirst = !heroFirst;
            },
            ATTACK_INTERVAL,
            attackCount
        );
        return false;
    }

    clear(): void {
        super.clear();
        this.hero = null!;
        this.monster = null!;
    }

    private monsterDie(monster: Monster) {
        let heroModel = GameApp.getModel(HeroModel);
        heroModel.earnGold(monster.monsterInfo.gold);
    }
}
