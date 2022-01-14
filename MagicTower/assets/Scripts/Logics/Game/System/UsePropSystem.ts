import { v2 } from "cc";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { GameFrameworkLog } from "../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { PropInfo, PropType } from "../../../Model/HeroModel/Prop";
import { Door } from "../../../Model/MapModel/Data/Elements/Door";
import { Monster } from "../../../Model/MapModel/Data/Elements/Monster";
import { Stair, StairType } from "../../../Model/MapModel/Data/Elements/Stair";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { MapModel } from "../../../Model/MapModel/MapModel";
import { IGameMap } from "../Map/GameMap/IGameMap";
import { Hero } from "../Map/Hero/Hero";
import { MapCollisionSystem } from "./MapCollisionSystem";

/** 在楼梯旁的index差值 */
const INDEX_DIFFS: Readonly<number[]> = [1, 11];

/** 英雄面朝方向上，右，下，左 */
const HERO_FACE_DIRECTION: Readonly<number[]> = [-11, 1, 11, -1];

@CommandManager.register("UsePropSystem")
export class UsePropSystem extends SystemBase {
    private heroModel: HeroModel = null!;
    private mapModel: MapModel = null!;
    private levelData: LevelData = null!;
    private gameMap: IGameMap = null!;
    private hero: Hero = null!;
    private mapCollisionSystem: MapCollisionSystem = null!;

    initliaze(gameMap: IGameMap) {
        this.heroModel = GameApp.getModel(HeroModel);
        this.mapModel = GameApp.getModel(MapModel);
        this.levelData = this.mapModel.getCurrentLevelData();
        this.gameMap = gameMap;
    }

    clear(): void {
        this.heroModel = null!;
    }

    useProp(propInfo: PropInfo, extraInfo: string) {
        switch (propInfo.type) {
            case PropType.MONSTER_HAND_BOOK:
                //currentMap.showDialog("MonsterHandBook", currentMap.getMonsters());
                break;
            case PropType.RECORD_BOOK:
                //currentMap.showDialog("RecordBook");
                break;
            case PropType.FLYING_WAND:
                {
                    if (this.isHeroNextToStair()) {
                        if (this.switchLevelTip(extraInfo == "up" ? 1 : -1)) {
                            return;
                        }
                        let stairType = extraInfo == "up" ? StairType.UP : StairType.Down;
                        let stair = this.levelData.getStair(stairType);
                        if (stair) {
                            this.mapModel.setLevelDiff(stair.levelDiff);
                        } else {
                            GameFrameworkLog.error("传送法杖找不到楼梯");
                        }
                    } else {
                        //GameManager.UI.showToast("在楼梯旁边才可以使用");
                    }
                }
                break;
            case PropType.PICKAXE:
                {
                    if (this.removeHeroFaceWall()) {
                        this.consumptionProp(propInfo);
                    }
                }
                break;
            case PropType.EARTHQUAKE_SCROLL:
                {
                    if (this.removeAllWalls()) {
                        this.consumptionProp(propInfo);
                    }
                }
                break;
            case PropType.ICE_MAGIC:
                {
                    this.removeLava();
                }
                break;
            case PropType.BOMB:
                {
                    if (this.bomb()) {
                        this.consumptionProp(propInfo);
                    }
                }
                break;
            case PropType.MAGIC_KEY:
                {
                    if (this.removeYellowDoors()) {
                        this.consumptionProp(propInfo);
                    }
                }
                break;
            case PropType.HOLY_WATER:
                {
                    this.heroModel.setAttrDiff(HeroAttr.HP, this.heroModel.getAttr(HeroAttr.ATTACK) + this.heroModel.getAttr(HeroAttr.DEFENCE));
                    this.consumptionProp(propInfo);
                }
                break;
            case PropType.FEATHER:
                {
                    if (this.switchLevelTip(propInfo.value, true)) {
                        return;
                    }
                    this.mapModel.setLevelDiff(propInfo.value);
                }
                break;
            case PropType.CENTER_FEATHER:
                {
                    if (this.centrosymmetricFly()) {
                        this.consumptionProp(propInfo);
                    }
                }
                break;
        }
    }

    /** 勇士在楼梯旁边 */
    private isHeroNextToStair(): boolean {
        let stairs: Stair[] = this.levelData.getLayerInfo("stairs");
        if (stairs) {
            stairs.forEach((stair) => {
                let diff = Math.abs(stair.index - this.gameMap.getTileIndex(this.heroModel.getPosition()));
                if (INDEX_DIFFS.indexOf(diff) != -1) {
                    return true;
                }
            });
        }
        return false;
    }

    private switchLevelTip(diff: number, useFeather: boolean = false) {
        let tip = diff == -1 ? "你已经到最下面一层了" : "你已经到最上面一层了";
        if (this.mapModel.canSwitchLevel(diff, useFeather)) {
            //GameManager.UI.showToast(tip);
            return true;
        }
        return false;
    }

    /**
     * 消耗掉道具
     * @param propInfo 道具信息
     */
    private consumptionProp(propInfo: PropInfo) {
        if (!propInfo.permanent) {
            this.heroModel.addProp(parseInt(propInfo.id), -1);
        }
    }

    /**
     * 移除面向英雄的墙
     * @returns 是否移除成功
     */
    private removeHeroFaceWall(): boolean {
        let direction = this.heroModel.getDireciton();
        let index = this.gameMap.getTileIndex(this.heroModel.getPosition()) + HERO_FACE_DIRECTION[direction];
        let wallGid = this.gameMap.getTileGIDAt("wall", this.gameMap.getTile(index));
        if (wallGid) {
            this.mapCollisionSystem.disappear("wall", index);
            return true;
        }
        return false;
    }

    /**
     * 移除所有的墙
     * @returns 是否移除成功
     */
    private removeAllWalls(): boolean {
        return this.gameMap.forEachLayer("wall", (gid, index) => {
            this.mapCollisionSystem.disappear("wall", index);
        });
    }

    /**
     * 移除岩浆
     */
    private removeLava() {
        let heroIndex = this.gameMap.getTileIndex(this.heroModel.getPosition());
        HERO_FACE_DIRECTION.forEach((diff) => {
            let index = heroIndex + diff;
            let wallGid = this.gameMap.getTileGIDAt("lava", this.gameMap.getTile(index));
            if (wallGid) {
                this.mapCollisionSystem.disappear("lava", index);
            }
        });
    }

    /**
     * 炸药，炸死怪物
     * @returns 是否移除成功
     */
    private bomb(): boolean {
        let heroIndex = this.gameMap.getTileIndex(this.heroModel.getPosition());
        let isRemove = false;
        HERO_FACE_DIRECTION.forEach((diff) => {
            let index = heroIndex + diff;
            let element: Monster = this.levelData.getLayerElement("monster", index);
            if (element && !element.boss) {
                this.mapCollisionSystem.disappear("monster", index);
                isRemove = true;
            }
        });
        return isRemove;
    }

    /**
     * 移除整个地图所有的黄色门
     * @returns 是否移除成功
     */
    private removeYellowDoors(): boolean {
        let isRemove = false;
        this.gameMap.forEachLayer("door", (gid, index) => {
            let door: Door = this.levelData.getLayerElement("door", index);
            if (door && Door.isYellow(door.id)) {
                this.mapCollisionSystem.disappear("door", index);
                isRemove = true;
            }
        });
        return isRemove;
    }

    /**
     * 中心对称飞行
     * @returns 是否飞行成功
     */
    private centrosymmetricFly(): boolean {
        let tile = this.heroModel.getPosition();
        let newTile = v2(this.gameMap.width - tile.x - 1, this.gameMap.height - tile.y - 1);
        if (this.gameMap.getTileInfo(newTile) == null) {
            this.hero.location(newTile);
            return true;
        }
        return false;
    }
}