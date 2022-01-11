import { Vec2 } from "cc";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameFrameworkError } from "../../../../GameFramework/Scripts/Base/GameFrameworkError";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { AstarFactory } from "../../../../GameFramework/Scripts/ToolLibary/Astar/AstarFactory";
import { IAstar } from "../../../../GameFramework/Scripts/ToolLibary/Astar/IAstar";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { IGameMap } from "../Map/GameMap/IGameMap";

export enum AstarMoveType {
    NONE,
    HERO,
    MONSTER,
}

@CommandManager.register("MoveSystem")
export class MoveSystem extends SystemBase {
    private _astarMoveType: AstarMoveType = AstarMoveType.NONE;
    private _astar: IAstar | null = null;
    private _gameMap: IGameMap | null = null;
    private _levelData: LevelData | null = null;
    private _endTile: Vec2 = null!;

    constructor() {
        super();
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

    getPath(beginTile: Vec2, endTile: Vec2) {
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
        this._gameMap = null;
        this._levelData = null;
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
