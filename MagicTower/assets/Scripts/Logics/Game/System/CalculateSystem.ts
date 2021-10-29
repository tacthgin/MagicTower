import { _decorator } from "cc";
import { Util } from "../../../../Framework/Util/Util";
import { HeroAttr, HeroData } from "../../../Data/CustomData/HeroData";

export class CalculateSystem {
    /**
     * 勇士能否攻击怪物
     * @param heroData 勇士数据
     * @param monsterInfo 怪物数据
     * @param heroFirstAttack 勇士先攻击
     */
    static canHeroAttack(heroData: HeroData, monsterInfo: any, heroFirstAttack: boolean = true) {
        let heroAttackCount = this.getHeroAttackCount(heroData, monsterInfo);
        if (heroAttackCount == 0) {
            return false;
        }
        let monsterAttackCount = this.getMonsterAttackCount(heroData, monsterInfo);
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
     * @param heroData 勇士数据
     * @param monsterInfo 怪物数据
     */
    static getMonsterAttackCount(heroData: HeroData, monsterInfo: any) {
        //如果怪物攻击力小于勇士防御，攻击次数无意义
        if (monsterInfo.attack <= heroData.getAttr(HeroAttr.DEFENCE)) {
            return 0;
        }
        return Math.ceil(heroData.getAttr(HeroAttr.HP) / (monsterInfo.attack - heroData.getAttr(HeroAttr.DEFENCE)));
    }

    /**
     * 勇士打死怪物的攻击次数
     * @param heroData 勇士数据
     * @param monsterInfo 怪物数据
     */
    static getHeroAttackCount(heroData: HeroData, monsterInfo: any) {
        let attack = this.getHeroAttack(heroData, monsterInfo);
        //如果勇士攻击力小于怪物防御，攻击次数无意义
        if (attack <= monsterInfo.defence) {
            return 0;
        }
        return Math.ceil(monsterInfo.hp / (attack - monsterInfo.defence));
    }

    static getHeroAttack(heroData: HeroData, monsterInfo: any) {
        return monsterInfo.extraDamage && heroData.getPropNum(monsterInfo.extraDamage) ? heroData.getAttr(HeroAttr.ATTACK) * 2 : heroData.getAttr(HeroAttr.ATTACK);
    }

    /**
     * 怪物和勇士一次伤害值
     * @param heroData 勇士数据
     * @param monsterInfo 怪物数据
     */
    static perAttackDamage(heroData: HeroData, monsterInfo: any) {
        let attack = this.getHeroAttack(heroData, monsterInfo);
        return {
            heroDamage: Util.clamp(monsterInfo.attack - heroData.getAttr(HeroAttr.DEFENCE), 0, Number.MAX_VALUE),
            monsterDamage: Util.clamp(attack - monsterInfo.defence, 0, Number.MAX_VALUE),
        };
    }

    /**
     * 获取总共英雄受到的伤害
     * @param heroData
     * @param monsterInfo
     */
    static totalHeroDamage(heroData: HeroData, monsterInfo: any) {
        let damage = CalculateSystem.perAttackDamage(heroData, monsterInfo);
        return CalculateSystem.getMonsterAttackCount(heroData, monsterInfo) * damage.heroDamage;
    }
}
