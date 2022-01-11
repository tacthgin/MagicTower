import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { GameFrameworkError } from "../../../../GameFramework/Scripts/Base/GameFrameworkError";
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
    private attackCount: number = 0;
    private heroFirst: boolean = false;
    private damageInfo: {
        heroDamage: number;
        monsterDamage: number;
    } = null!;
    private attackInterval: number = 0;
    private fightAfterMagic: boolean = false;

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
        this.fightAfterMagic = magic;
        let heroModel = this.hero.heroModel;
        let monsterInfo = this.monster.monsterInfo;
        let count = CalculateSystem.getHeroAttackCount(heroModel, monsterInfo);
        this.damageInfo = CalculateSystem.perAttackDamage(heroModel, monsterInfo);
        //谁先攻击 0英雄先攻击
        this.heroFirst = !!monsterInfo.firstAttack;
        this.attackCount = this.heroFirst ? count * 2 : count * 2 + 1;
        //先贴图怪物信息
        GameApp.EventManager.fireNow(this, MonsterFightEventArgs.create(this.monster.monsterInfo));
        return false;
    }

    update(elapseSeconds: number): void {
        if (this.attackCount > 0) {
            this.attackInterval += elapseSeconds;
            if (this.attackInterval > ATTACK_INTERVAL) {
                this.attackInterval -= ATTACK_INTERVAL;
                if (this.heroFirst) {
                    this.hero.showAttack(true);
                    this.monster.hurt(this.damageInfo.monsterDamage);
                    GameApp.EventManager.fireNow(this, MonsterFightEventArgs.create(this.monster.monsterInfo));
                } else {
                    this.hero.showAttack(false);
                    //怪物死了
                    if (this.monster.monsterInfo.hp == 0) {
                        GameApp.EventManager.fireNow(this, MonsterDieEventArgs.create(this.monster, this.fightAfterMagic));
                    } else {
                        this.hero.hurt(this.damageInfo.heroDamage);
                    }
                }

                this.heroFirst = !this.heroFirst;
                --this.attackCount;
            }
        }
    }

    clear(): void {
        this.hero = null!;
        this.monster = null!;
        this.damageInfo = null!;
        this.attackCount = 0;
        this.heroFirst = false;
        this.attackInterval = 0;
        this.fightAfterMagic = false;
    }
}
