import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { Monster } from "../../../Model/MapModel/Data/Elements/Monster";
import { LevelData, MAGIC_DAMAGE_LEVEL } from "../../../Model/MapModel/Data/LevelData";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { MoveCommand } from "../Command/MoveCommand";
import { IGameMap } from "../Map/GameMap/IGameMap";
import { Hero } from "../Map/Hero/Hero";

@CommandManager.register("DamageSystem")
export class DamageSystem extends SystemBase {
    private gameMap: IGameMap = null!;
    private levelData: LevelData = null!;
    private hero: Hero = null!;

    awake(): void {}

    clear(): void {
        this.gameMap = null!;
        this.levelData = null!;
        this.hero = null!;
    }

    initliaze(gameMap: IGameMap, hero: Hero, levelData: LevelData) {
        this.gameMap = gameMap;
        this.hero = hero;
        this.levelData = levelData;
    }

    damageCollision(index: number): boolean {
        if (this.levelData.level < MAGIC_DAMAGE_LEVEL) {
            return true;
        }
        let heroModel = GameApp.getModel(HeroModel);

        if (heroModel.equipedDivineShield()) {
            return true;
        }

        let hurtIndexes: number[] | null = null;
        let wizardDamgeInfo = this.levelData.getWizardDamage(index);
        if (wizardDamgeInfo) {
            heroModel.setAttrDiff(HeroAttr.HP, -wizardDamgeInfo.damage);
            hurtIndexes = wizardDamgeInfo.indexes;
            //巫师行走
            this.monsterMove(index, hurtIndexes);
        }

        let magicGuardDamageInfo = this.levelData.getWizardDamage(index);
        if (magicGuardDamageInfo) {
            heroModel.setAttr(HeroAttr.HP, Math.ceil(heroModel.getAttr(HeroAttr.HP) * magicGuardDamageInfo.damage));
            hurtIndexes = magicGuardDamageInfo.indexes;
        }

        if (hurtIndexes) {
            //受到魔法伤害
            this.hero.magicDamage(hurtIndexes);
            this.scheduleOnce(() => {
                GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
            }, 0.5);
            return false;
        }

        return true;
    }

    private monsterMove(heroIndex: number, monsterIndexes: number[]) {
        monsterIndexes.forEach((monsterIndex) => {
            let mosnter = this.levelData.getLayerElement<Monster>("monster", monsterIndex);
            if (mosnter && mosnter.monsterMove) {
                let newIndex = 2 * monsterIndex - heroIndex;
                let tileInfo = this.gameMap.getTileInfo(this.gameMap.getTile(newIndex));
                if (tileInfo && tileInfo.layerName == "floor") {
                    GameApp.CommandManager.createCommand(MoveCommand).execute("monster", monsterIndex, newIndex, 0.2, 0);
                }
            }
        });
    }
}
