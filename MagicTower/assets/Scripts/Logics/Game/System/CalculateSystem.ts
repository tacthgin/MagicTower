import { math } from "cc";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";

export class CalculateSystem {
    /**
     * 勇士能否攻击怪物
     * @param heroModel 勇士数据
     * @param monsterInfo 怪物数据
     * @param heroFirstAttack 勇士先攻击
     */
    static canHeroAttack(heroModel: HeroModel, monsterInfo: any, heroFirstAttack: boolean = true) {
        let heroAttackCount = this.getHeroAttackCount(heroModel, monsterInfo);
        if (heroAttackCount == 0) {
            return false;
        }
        let monsterAttackCount = this.getMonsterAttackCount(heroModel, monsterInfo);
        if (monsterAttackCount == 0) {
            return true;
        }
        if (heroAttackCount == monsterAttackCount) {
            return heroFirstAttack;
        }
        return heroAttackCount < monsterAttackCount;
    }

    /**
     * 怪物打死勇士的攻击次数
     * @param heroModel 勇士数据
     * @param monsterInfo 怪物数据
     */
    static getMonsterAttackCount(heroModel: HeroModel, monsterInfo: any) {
        //如果怪物攻击力小于勇士防御，攻击次数无意义
        if (monsterInfo.attack <= heroModel.getAttr(HeroAttr.DEFENCE)) {
            return 0;
        }
        return Math.ceil(heroModel.getAttr(HeroAttr.HP) / (monsterInfo.attack - heroModel.getAttr(HeroAttr.DEFENCE)));
    }

    /**
     * 勇士打死怪物的攻击次数
     * @param heroModel 勇士数据
     * @param monsterInfo 怪物数据
     */
    static getHeroAttackCount(heroModel: HeroModel, monsterInfo: any) {
        let attack = this.getHeroAttack(heroModel, monsterInfo);
        //如果勇士攻击力小于怪物防御，攻击次数无意义
        if (attack <= monsterInfo.defence) {
            return 0;
        }
        return Math.ceil(monsterInfo.hp / (attack - monsterInfo.defence));
    }

    static getHeroAttack(heroModel: HeroModel, monsterInfo: any) {
        return monsterInfo.extraDamage && heroModel.getPropNum(monsterInfo.extraDamage) ? heroModel.getAttr(HeroAttr.ATTACK) * 2 : heroModel.getAttr(HeroAttr.ATTACK);
    }

    /**
     * 怪物和勇士一次伤害值
     * @param heroModel 勇士数据
     * @param monsterInfo 怪物数据
     */
    static perAttackDamage(heroModel: HeroModel, monsterInfo: any) {
        let attack = this.getHeroAttack(heroModel, monsterInfo);
        return {
            heroDamage: math.clamp(monsterInfo.attack - heroModel.getAttr(HeroAttr.DEFENCE), 0, Number.MAX_VALUE),
            monsterDamage: math.clamp(attack - monsterInfo.defence, 0, Number.MAX_VALUE),
        };
    }

    /**
     * 获取总共英雄受到的伤害
     * @param heroModel
     * @param monsterInfo
     */
    static totalHeroDamage(heroModel: HeroModel, monsterInfo: any) {
        let damage = CalculateSystem.perAttackDamage(heroModel, monsterInfo);
        return CalculateSystem.getMonsterAttackCount(heroModel, monsterInfo) * damage.heroDamage;
    }
}
