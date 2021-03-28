import { _decorator } from "cc";
import HeroInfo from "../../Data/HeroInfo";
import { Util } from "../../../Util/Util";

export default class CalculateSystem {
    /**
     * 勇士能否攻击怪物
     * @param heroInfo 勇士数据
     * @param monsterInfo 怪物数据
     * @param heroFirstAttack 勇士先攻击
     */
    static canHeroAttack(heroInfo: HeroInfo, monsterInfo: any, heroFirstAttack: boolean = true) {
        //let heroAttackCount = this.getHeroAttackCount(heroInfo, monsterInfo);
        //if (heroAttackCount == 0) {
        //return false;
        //}
        //let monsterAttackCount = this.getMonsterAttackCount(heroInfo, monsterInfo);
        //if (monsterAttackCount == 0) {
        //return true;
        //}
        //if (heroAttackCount == monsterAttackCount) {
        //return heroFirstAttack;
        //}
        //return heroAttackCount < monsterAttackCount;
    }
    /**
     * 怪物打死勇士的攻击次数
     * @param heroInfo 勇士数据
     * @param monsterInfo 怪物数据
     */
    static getMonsterAttackCount(heroInfo: HeroInfo, monsterInfo: any) {
        //如果怪物攻击力小于勇士防御，攻击次数无意义
        //if (monsterInfo.attack <= heroInfo.Defence) {
        //return 0;
        //}
        //return Math.ceil(heroInfo.Hp / (monsterInfo.attack - heroInfo.Defence));
    }
    /**
     * 勇士打死怪物的攻击次数
     * @param heroInfo 勇士数据
     * @param monsterInfo 怪物数据
     */
    static getHeroAttackCount(heroInfo: HeroInfo, monsterInfo: any) {
        //let attack = this.getHeroAttack(heroInfo, monsterInfo);
        //如果勇士攻击力小于怪物防御，攻击次数无意义
        //if (attack <= monsterInfo.defence) {
        //return 0;
        //}
        //return Math.ceil(monsterInfo.hp / (attack - monsterInfo.defence));
    }
    static getHeroAttack(heroInfo: HeroInfo, monsterInfo: any) {
        //return monsterInfo.extraDamage && heroInfo.getProp(monsterInfo.extraDamage) ? heroInfo.Attack * 2 : heroInfo.Attack;
    }
    /**
     * 怪物和勇士一次伤害值
     * @param heroInfo 勇士数据
     * @param monsterInfo 怪物数据
     */
    static perAttackDamage(heroInfo: HeroInfo, monsterInfo: any) {
        //let attack = this.getHeroAttack(heroInfo, monsterInfo);
        //return {
        //heroDamage: Util.clamp(monsterInfo.attack - heroInfo.Defence, 0, Number.MAX_VALUE),
        //monsterDamage: Util.clamp(attack - monsterInfo.defence, 0, Number.MAX_VALUE)
        //};
    }
    /**
     * 获取总共英雄受到的伤害
     * @param heroInfo
     * @param monsterInfo
     */
    static totalHeroDamage(heroInfo: HeroInfo, monsterInfo: any) {
        //let damage = CalculateSystem.perAttackDamage(heroInfo, monsterInfo);
        //return CalculateSystem.getMonsterAttackCount(heroInfo, monsterInfo) * damage.heroDamage;
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import HeroInfo from "../../../Data/HeroInfo";
// import { Util } from "../../../Util/Util";
//
// export default class CalculateSystem {
//     /**
//      * 勇士能否攻击怪物
//      * @param heroInfo 勇士数据
//      * @param monsterInfo 怪物数据
//      * @param heroFirstAttack 勇士先攻击
//      */
//     static canHeroAttack(heroInfo: HeroInfo, monsterInfo: any, heroFirstAttack: boolean = true) {
//         let heroAttackCount = this.getHeroAttackCount(heroInfo, monsterInfo);
//         if (heroAttackCount == 0) {
//             return false;
//         }
//
//         let monsterAttackCount = this.getMonsterAttackCount(heroInfo, monsterInfo);
//         if (monsterAttackCount == 0) {
//             return true;
//         }
//
//         if (heroAttackCount == monsterAttackCount) {
//             return heroFirstAttack;
//         }
//
//         return heroAttackCount < monsterAttackCount;
//     }
//
//     /**
//      * 怪物打死勇士的攻击次数
//      * @param heroInfo 勇士数据
//      * @param monsterInfo 怪物数据
//      */
//     static getMonsterAttackCount(heroInfo: HeroInfo, monsterInfo: any) {
//         //如果怪物攻击力小于勇士防御，攻击次数无意义
//         if (monsterInfo.attack <= heroInfo.Defence) {
//             return 0;
//         }
//         return Math.ceil(heroInfo.Hp / (monsterInfo.attack - heroInfo.Defence));
//     }
//
//     /**
//      * 勇士打死怪物的攻击次数
//      * @param heroInfo 勇士数据
//      * @param monsterInfo 怪物数据
//      */
//     static getHeroAttackCount(heroInfo: HeroInfo, monsterInfo: any) {
//         let attack = this.getHeroAttack(heroInfo, monsterInfo);
//         //如果勇士攻击力小于怪物防御，攻击次数无意义
//         if (attack <= monsterInfo.defence) {
//             return 0;
//         }
//
//         return Math.ceil(monsterInfo.hp / (attack - monsterInfo.defence));
//     }
//
//     static getHeroAttack(heroInfo: HeroInfo, monsterInfo: any) {
//         return monsterInfo.extraDamage && heroInfo.getProp(monsterInfo.extraDamage) ? heroInfo.Attack * 2 : heroInfo.Attack;
//     }
//
//     /**
//      * 怪物和勇士一次伤害值
//      * @param heroInfo 勇士数据
//      * @param monsterInfo 怪物数据
//      */
//     static perAttackDamage(heroInfo: HeroInfo, monsterInfo: any) {
//         let attack = this.getHeroAttack(heroInfo, monsterInfo);
//         return {
//             heroDamage: Util.clamp(monsterInfo.attack - heroInfo.Defence, 0, Number.MAX_VALUE),
//             monsterDamage: Util.clamp(attack - monsterInfo.defence, 0, Number.MAX_VALUE)
//         };
//     }
//
//     /**
//      * 获取总共英雄受到的伤害
//      * @param heroInfo
//      * @param monsterInfo
//      */
//     static totalHeroDamage(heroInfo: HeroInfo, monsterInfo: any) {
//         let damage = CalculateSystem.perAttackDamage(heroInfo, monsterInfo);
//         return CalculateSystem.getMonsterAttackCount(heroInfo, monsterInfo) * damage.heroDamage;
//     }
// }
