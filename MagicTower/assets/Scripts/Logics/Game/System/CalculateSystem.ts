// import { _decorator } from "cc";
// import { Util } from "../../../../Framework/Util/Util";
// import { HeroAttr, HeroModel } from "../../../Data/CustomData/HeroModel";

// export class CalculateSystem {
//     /**
//      * 勇士能否攻击怪物
//      * @param HeroModel 勇士数据
//      * @param monsterInfo 怪物数据
//      * @param heroFirstAttack 勇士先攻击
//      */
//     static canHeroAttack(HeroModel: HeroModel, monsterInfo: any, heroFirstAttack: boolean = true) {
//         let heroAttackCount = this.getHeroAttackCount(HeroModel, monsterInfo);
//         if (heroAttackCount == 0) {
//             return false;
//         }
//         let monsterAttackCount = this.getMonsterAttackCount(HeroModel, monsterInfo);
//         if (monsterAttackCount == 0) {
//             return true;
//         }
//         if (heroAttackCount == monsterAttackCount) {
//             return heroFirstAttack;
//         }
//         return heroAttackCount < monsterAttackCount;
//     }

//     /**
//      * 怪物打死勇士的攻击次数
//      * @param HeroModel 勇士数据
//      * @param monsterInfo 怪物数据
//      */
//     static getMonsterAttackCount(HeroModel: HeroModel, monsterInfo: any) {
//         //如果怪物攻击力小于勇士防御，攻击次数无意义
//         if (monsterInfo.attack <= HeroModel.getAttr(HeroAttr.DEFENCE)) {
//             return 0;
//         }
//         return Math.ceil(HeroModel.getAttr(HeroAttr.HP) / (monsterInfo.attack - HeroModel.getAttr(HeroAttr.DEFENCE)));
//     }

//     /**
//      * 勇士打死怪物的攻击次数
//      * @param HeroModel 勇士数据
//      * @param monsterInfo 怪物数据
//      */
//     static getHeroAttackCount(HeroModel: HeroModel, monsterInfo: any) {
//         let attack = this.getHeroAttack(HeroModel, monsterInfo);
//         //如果勇士攻击力小于怪物防御，攻击次数无意义
//         if (attack <= monsterInfo.defence) {
//             return 0;
//         }
//         return Math.ceil(monsterInfo.hp / (attack - monsterInfo.defence));
//     }

//     static getHeroAttack(HeroModel: HeroModel, monsterInfo: any) {
//         return monsterInfo.extraDamage && HeroModel.getPropNum(monsterInfo.extraDamage) ? HeroModel.getAttr(HeroAttr.ATTACK) * 2 : HeroModel.getAttr(HeroAttr.ATTACK);
//     }

//     /**
//      * 怪物和勇士一次伤害值
//      * @param HeroModel 勇士数据
//      * @param monsterInfo 怪物数据
//      */
//     static perAttackDamage(HeroModel: HeroModel, monsterInfo: any) {
//         let attack = this.getHeroAttack(HeroModel, monsterInfo);
//         return {
//             heroDamage: Util.clamp(monsterInfo.attack - HeroModel.getAttr(HeroAttr.DEFENCE), 0, Number.MAX_VALUE),
//             monsterDamage: Util.clamp(attack - monsterInfo.defence, 0, Number.MAX_VALUE),
//         };
//     }

//     /**
//      * 获取总共英雄受到的伤害
//      * @param HeroModel
//      * @param monsterInfo
//      */
//     static totalHeroDamage(HeroModel: HeroModel, monsterInfo: any) {
//         let damage = CalculateSystem.perAttackDamage(HeroModel, monsterInfo);
//         return CalculateSystem.getMonsterAttackCount(HeroModel, monsterInfo) * damage.heroDamage;
//     }
// }
