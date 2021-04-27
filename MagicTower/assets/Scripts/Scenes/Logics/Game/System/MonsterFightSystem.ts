import { _decorator } from "cc";
import Monster from "../Elements/Monster";
import { GameMap } from "../Map/GameMap";
import Hero from "../Map/Hero";
import CalculateSystem from "./CalculateSystem";
import { NotifyCenter } from "../../../Managers/NotifyCenter";
import { GameEvent } from "../../../Constant/GameEvent";
import { DataManager } from "../../../Managers/DataManager";

export class MonsterFightSystem {
    private monster: Monster = null;
    private map: GameMap = null;
    private hero: Hero = null;
    /** npc tile index */
    private index: number = 0;
    private globalConfig: any = null;
    init(tileIndex: number, monster: Monster, map: GameMap, hero: Hero) {
        //this.monster = monster;
        //this.hero = hero;
        //this.map = map;
        //this.index = tileIndex;
        //this.globalConfig = GameManager.DATA.getJson("global");
        //return this;
    }
    /**
     *
     * @param magic 是否后续还有模仿伤害
     */
    execute(magic: boolean) {
        //let count = CalculateSystem.getHeroAttackCount(this.hero.HeroData, this.monster.monsterInfo);
        //let damageInfo = CalculateSystem.perAttackDamage(this.hero.HeroData, this.monster.monsterInfo);
        //谁先攻击 0英雄先攻击
        //let i = this.monster.firstAttack ? 1 : 0;
        //let scheduleCount = i == 0 ? count * 2 - 1 : count * 2;
        //先贴图怪物信息
        //NotifyCenter.emit(GameEvent.MONSTER_FIGHT, this.monster.monsterInfo);
        //this.map.schedule(
        //() => {
        //if (i % 2 == 0) {
        //this.hero.showAttack(true);
        //this.monster.hurt(damageInfo.monsterDamage);
        //} else {
        //this.hero.showAttack(false);
        //怪物死了
        //if (this.monster.monsterInfo.hp == 0) {
        //NotifyCenter.emit(GameEvent.MONSTER_DIE, this.monster, this.index, magic);
        //} else {
        //this.hero.hurt(damageInfo.heroDamage);
        //}
        //}
        //++i;
        //NotifyCenter.emit(GameEvent.MONSTER_FIGHT, this.monster.monsterInfo);
        //},
        //this.globalConfig.attackInterval,
        //scheduleCount
        //);
        //return false;
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import Monster from "../Elements/Monster";
// import { GameMap } from "../Map/GameMap";
// import Hero from "../Hero";
// import CalculateSystem from "./CalculateSystem";
// import { NotifyCenter } from "../../../Managers/NotifyCenter";
// import { GameEvent } from "../../../Constant/GameEvent";
// import { DataManager } from "../../../Managers/DataManager";
//
// export class MonsterFightSystem {
//     private monster: Monster = null;
//     private map: GameMap = null;
//     private hero: Hero = null;
//     /** npc tile index */
//     private index: number = 0;
//
//     private globalConfig: any = null;
//
//     init(tileIndex: number, monster: Monster, map: GameMap, hero: Hero) {
//         this.monster = monster;
//         this.hero = hero;
//         this.map = map;
//         this.index = tileIndex;
//         this.globalConfig = GameManager.DATA.getJson("global");
//         return this;
//     }
//
//     /**
//      *
//      * @param magic 是否后续还有模仿伤害
//      */
//     execute(magic: boolean) {
//         let count = CalculateSystem.getHeroAttackCount(this.hero.HeroData, this.monster.monsterInfo);
//         let damageInfo = CalculateSystem.perAttackDamage(this.hero.HeroData, this.monster.monsterInfo);
//
//         //谁先攻击 0英雄先攻击
//         let i = this.monster.firstAttack ? 1 : 0;
//         let scheduleCount = i == 0 ? count * 2 - 1 : count * 2;
//
//         //先贴图怪物信息
//         NotifyCenter.emit(GameEvent.MONSTER_FIGHT, this.monster.monsterInfo);
//         this.map.schedule(
//             () => {
//                 if (i % 2 == 0) {
//                     this.hero.showAttack(true);
//                     this.monster.hurt(damageInfo.monsterDamage);
//                 } else {
//                     this.hero.showAttack(false);
//                     //怪物死了
//                     if (this.monster.monsterInfo.hp == 0) {
//                         NotifyCenter.emit(GameEvent.MONSTER_DIE, this.monster, this.index, magic);
//                     } else {
//                         this.hero.hurt(damageInfo.heroDamage);
//                     }
//                 }
//                 ++i;
//                 NotifyCenter.emit(GameEvent.MONSTER_FIGHT, this.monster.monsterInfo);
//             },
//             this.globalConfig.attackInterval,
//             scheduleCount
//         );
//         return false;
//     }
// }
