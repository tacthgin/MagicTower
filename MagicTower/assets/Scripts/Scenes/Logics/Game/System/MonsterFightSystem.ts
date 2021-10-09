import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { GameEvent } from "../../../Constant/GameEvent";
import { Monster } from "../../../Data/CustomData/Element";
import { GameMap } from "../Map/GameMap";
import { Hero } from "../Map/Actor/Hero";
import { CalculateSystem } from "./CalculateSystem";

const ATTACK_INTERVAL = 0.1;

export class MonsterFightSystem {
    private map: GameMap = null!;
    private hero: Hero = null!;
    private monster: Monster = null!;

    init(gameMap: GameMap, hero: Hero, monster: Monster) {
        this.hero = hero;
        this.map = gameMap;
        this.monster = monster;
        return this;
    }

    /**
     *
     * @param magic 是否后续还有魔法伤害
     */
    execute(magic: boolean) {
        let heroData = this.hero.heroData;
        let monsterInfo = this.monster.monsterInfo;
        let count = CalculateSystem.getHeroAttackCount(heroData, monsterInfo);
        let damageInfo = CalculateSystem.perAttackDamage(heroData, monsterInfo);
        //谁先攻击 0英雄先攻击
        let i = monsterInfo.firstAttack ? 1 : 0;
        let scheduleCount = i == 0 ? count * 2 - 1 : count * 2;
        //先贴图怪物信息
        NotifyCenter.emit(GameEvent.MONSTER_FIGHT, monsterInfo);
        this.map.schedule(
            () => {
                if (i % 2 == 0) {
                    this.hero.showAttack(true);
                    this.monster.hurt(damageInfo.monsterDamage);
                    NotifyCenter.emit(GameEvent.MONSTER_FIGHT, monsterInfo);
                } else {
                    this.hero.showAttack(false);
                    //怪物死了
                    if (monsterInfo.hp == 0) {
                        NotifyCenter.emit(GameEvent.MONSTER_DIE, this.monster, magic);
                    } else {
                        this.hero.hurt(damageInfo.heroDamage);
                    }
                }
                ++i;
            },
            ATTACK_INTERVAL,
            scheduleCount
        );
        return false;
    }
}
