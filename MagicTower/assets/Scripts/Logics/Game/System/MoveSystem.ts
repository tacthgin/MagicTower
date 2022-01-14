import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { GameFrameworkError } from "../../../../GameFramework/Scripts/Base/GameFrameworkError";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { AstarFactory } from "../../../../GameFramework/Scripts/ToolLibary/Astar/AstarFactory";
import { IAstar } from "../../../../GameFramework/Scripts/ToolLibary/Astar/IAstar";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { IGameMap } from "../Map/GameMap/IGameMap";
import { CalculateSystem } from "./CalculateSystem";

export enum AstarMoveType {
    NONE,
    HERO,
    MONSTER,
}

const LAYER_TO_MOVE: Readonly<{ [key: string]: AstarMoveType }> = {
    npc: AstarMoveType.MONSTER,
    monster: AstarMoveType.MONSTER,
};

@CommandManager.register("MoveSystem")
export class MoveSystem extends SystemBase {
    private _astarMoveType: AstarMoveType = AstarMoveType.NONE;
    private _astar: IAstar | null = null;
    private _gameMap: IGameMap = null!;
    private _levelData: LevelData = null!;
    private _endTile: IVec2 = null!;
    private _heroModel: HeroModel = null!;
    private static canEndMoveTiles: Readonly<string[]> = ["prop", "stair"];

    constructor() {
        super();
        this._heroModel = GameApp.getModel(HeroModel);
    }

    initliaze(gameMap: IGameMap, levelData: LevelData) {
        this._gameMap = gameMap;
        this._gameMap.setCheckDelegate(this.check.bind(this));
        this._levelData = levelData;
        if (!this._astar) {
            this._astar = AstarFactory.createCrossAstar(this._gameMap);
        } else {
            this._astar.setAstarMap(this._gameMap);
        }
    }

    setAstarMoveType(astarMoveType: AstarMoveType) {
        this._astarMoveType = astarMoveType;
    }

    getPath(beginTile: IVec2, endTile: IVec2) {
        if (!this._gameMap || !this._levelData || !this._astar) {
            throw new GameFrameworkError("you must set game map first");
        }

        if (this._astarMoveType === AstarMoveType.NONE) {
            throw new GameFrameworkError("you must set astar move type first");
        }

        this._endTile = endTile;
        return this._astar.makePath(beginTile, endTile);
    }

    clear(): void {
        this._astarMoveType = AstarMoveType.NONE;
        this._astar = null;
        this._gameMap = null!;
        this._levelData = null!;
    }

    /**
     * 是否终点tile可以移动
     * @param tile tile坐标
     */
    canEndTileMove(tile: IVec2) {
        let { layerName, spriteName } = this._gameMap.getTileInfo(tile);
        switch (layerName) {
            case "floor":
                if (this._levelData.level >= 40) {
                    return this._heroModel.getAttr(HeroAttr.HP) > this.getWizardMagicDamage(this._gameMap.getTileIndex(tile));
                }
                return true;
            case "monster":
                if (spriteName) {
                    let jsonData = Utility.Json.getJsonKeyCache(layerName, spriteName);
                    return CalculateSystem.canHeroAttack(this._heroModel, jsonData, !jsonData.firstAttack);
                } else {
                    throw new GameFrameworkError("move to monster invailid");
                }
        }
        return MoveSystem.canEndMoveTiles.includes(layerName!);
    }

    private getWizardMagicDamage(index: number): number {
        if (this._heroModel.equipedDivineShield()) {
            return 0;
        }
        return this._levelData.getWizardMagicDamage(index);
    }

    private check(tile: IVec2): boolean {
        let { layerName } = this._gameMap!.getTileInfo(tile);

        switch (this._astarMoveType) {
            case AstarMoveType.HERO:
                {
                    if (!this._levelData?.canHeroMove(this._gameMap!.getTileIndex(tile))) return false;

                    if (tile.x != this._endTile.x || tile.y != this._endTile.y) {
                        //中途过程遇到事件也可以走
                        return layerName == "floor" || layerName == "event" || layerName == "prop";
                    }
                }
                break;
            case AstarMoveType.MONSTER: {
                return layerName == "floor" || layerName == "monster" || layerName == "event" || layerName == "stair";
            }
            default:
                break;
        }

        return true;
    }
}
