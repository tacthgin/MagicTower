import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { GameFrameworkLog } from "../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { PropInfo, PropType } from "../../../Model/HeroModel/Prop";
import { Stair, StairType } from "../../../Model/MapModel/Data/Elements/Stair";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { MapModel } from "../../../Model/MapModel/MapModel";
import { IGameMap } from "../Map/GameMap/IGameMap";
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
                        if (this.switchLevelTip(extraInfo)) {
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
                    // if (currentMap.bomb()) {
                    //     this.consumptionProp(propInfo);
                    // }
                }
                break;
            case PropType.MAGIC_KEY:
                {
                    // if (currentMap.removeYellowDoors()) {
                    //     this.consumptionProp(propInfo);
                    // }
                }
                break;
            case PropType.HOLY_WATER:
                {
                    // this.heroModel.Hp += this.heroModel.Attack + this.heroModel.Defence;
                    // this.consumptionProp(propInfo);
                }
                break;
            case PropType.FEATHER:
                {
                    // if (this.switchLevelTip(propInfo.value == 1 ? "up" : "down")) {
                    //     return;
                    // }
                    // this.level = this.level + propInfo.value;
                    // this.switchLevelHero(propInfo.value == 1 ? "down" : "up");
                    // this.consumptionProp(propInfo);
                }
                break;
            case PropType.CENTER_FEATHER:
                {
                    //中心对称飞行棋
                    // if (currentMap.centrosymmetricFly()) {
                    //     this.consumptionProp(propInfo);
                    // }
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

    private switchLevelTip(swtichType: string) {
        let tip = null;
        if (swtichType == "down" && this.mapModel.level == 1) {
            tip = "你已经到最下面一层了";
        } else if (swtichType == "up" && this.mapModel.level == 50) {
            tip = "你已经到最上面一层了";
        }
        if (tip) {
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
     * 炸药
     */
    private bomb() {
        //let heroIndex = this.tileToIndex(this.heroModel.Position);
        //let remove = false;
        //HERO_FACE_DIRECTION.forEach((diff) => {
        //let index = heroIndex + diff;
        //let element = this.getElement(index, "monster");
        //if (element && !element.isBoss()) {
        //this.removeElement(index, "monster");
        //remove = true;
        //}
        //});
        //return remove;
    }

    private removeYellowDoors() {
        //let doorLayer = this.layers["door"];
        //let remove = false;
        //for (let index in doorLayer) {
        //if (doorLayer[index].isYellow()) {
        //this.removeElement(index, "door");
        //remove = true;
        //}
        //}
        //return remove;
    }

    private centrosymmetricFly() {
        //let tile = this.heroModel.Position;
        //let newTile = cc.v2(this.mapData.column - tile.x - 1, this.mapData.row - tile.y - 1);
        //if (this.getElement(this.tileToIndex(newTile)) == null) {
        //this.hero.location(newTile);
        //return true;
        //}
        //return false;
    }
}
