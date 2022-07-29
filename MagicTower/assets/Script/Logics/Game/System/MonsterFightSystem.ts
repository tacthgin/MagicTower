import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { SoundFactory } from "../../../../GameFramework/Application/Sound/SoundFactory";
import { UIFactory } from "../../../../GameFramework/Application/UI/UIFactory";
import { GameFrameworkError } from "../../../../GameFramework/Script/Base/GameFrameworkError";
import { CommandManager } from "../../../../GameFramework/Script/MVC/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Script/MVC/Command/SystemBase";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { DoorState } from "../../../Model/MapModel/Data/Elements/Door";
import { Monster } from "../../../Model/MapModel/Data/Elements/Monster";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { MonsterDieEventArgs } from "../../Event/MonsterDieEventArgs";
import { MonsterFightEventArgs } from "../../Event/MonsterFightEventArgs";
import { DisappearCommand } from "../Command/DisappearCommand";
import { Hero } from "../Map/Hero/Hero";
import { CalculateSystem } from "./CalculateSystem";

const ATTACK_INTERVAL = 0.1;

@CommandManager.registerSystem("MonsterFightSystem", true)
export class MonsterFightSystem extends SystemBase {
    private hero: Hero = null!;
    private monster: Monster = null!;
    private levelData: LevelData = null!;

    initliaze(hero: Hero, monster: Monster, levelData: LevelData) {
        this.hero = hero;
        this.monster = monster;
        this.levelData = levelData;
    }

    execute() {
        if (!this.hero || !this.monster) {
            throw new GameFrameworkError("you must initliaze monster fight system");
        }

        let heroModel = GameApp.getModel(HeroModel);
        let monsterInfo = this.monster.monsterInfo;
        if (!CalculateSystem.canHeroAttack(heroModel, monsterInfo)) {
            UIFactory.showToast(`你打不过${monsterInfo.name}`);
            return true;
        }

        let count = CalculateSystem.getHeroAttackCount(heroModel, monsterInfo);
        let damageInfo = CalculateSystem.perAttackDamage(heroModel, monsterInfo);
        //谁先攻击 0英雄先攻击
        let heroFirst = !monsterInfo.firstAttack;
        let attackCount = heroFirst ? count * 2 : count * 2 + 1;
        //先贴图怪物信息
        GameApp.EventManager.fireNow(this, MonsterFightEventArgs.create(monsterInfo));
        this.schedule(
            () => {
                if (heroFirst) {
                    SoundFactory.playEffectSound("Sound/attack");
                    this.hero.showAttack(true);
                    this.monster.hurt(damageInfo.monsterDamage);
                    GameApp.EventManager.fireNow(this, MonsterFightEventArgs.create(monsterInfo));
                } else {
                    this.hero.showAttack(false);
                    //怪物死了
                    if (monsterInfo.hp == 0) {
                        this.monsterDie(this.monster);
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
        this.hero = null!;
        this.monster = null!;
        this.levelData = null!;
    }

    private monsterDie(monster: Monster) {
        let heroModel = GameApp.getModel(HeroModel);
        heroModel.earnGold(monster.monsterInfo.gold);

        GameApp.CommandManager.createCommand(DisappearCommand).execute("monster", monster.index);

        let doors = this.levelData.triggerMonsterDoor(monster.index);
        if (doors) {
            doors.forEach((door) => {
                GameApp.CommandManager.createCommand(DisappearCommand).execute("door", door.index);
            });
        }

        this.levelData.triggerDoorEvent(DoorState.MONSTER_EVENT, monster.index);

        let magicGuardIndex = null;
        if (monster.isMagicGuard()) {
            magicGuardIndex = monster.index;
        }

        let eventId = this.levelData.triggerMonsterEvent(monster.index);

        if (!eventId) {
            eventId = monster.monsterInfo.eventId;
        }

        GameApp.EventManager.fireNow(this, MonsterDieEventArgs.create(magicGuardIndex, eventId));
    }
}
