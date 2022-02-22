import { Tween, tween, UITransform, v2, v3, Node, UIOpacity } from "cc";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { UIFactory } from "../../../../GameFramework/Scripts/Application/UI/UIFactory";
import { GameFrameworkError } from "../../../../GameFramework/Scripts/Base/GameFrameworkError";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { AstarFactory } from "../../../../GameFramework/Scripts/ToolLibary/Astar/AstarFactory";
import { IAstar } from "../../../../GameFramework/Scripts/ToolLibary/Astar/IAstar";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { MonsterInfo } from "../../../Model/MapModel/Data/Elements/Monster";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { ElementNode } from "../Elements/ElementNode";
import { IGameMap } from "../Map/GameMap/IGameMap";
import { Hero } from "../Map/Hero/Hero";
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
    private _hero: Hero = null!;
    private _canHeroMoving: boolean = true;
    private static canEndMoveTiles: Readonly<string[]> = ["prop", "stair"];

    awake(): void {
        this._heroModel = GameApp.getModel(HeroModel);
        GameApp.EventManager.subscribe(GameEvent.COLLISION_COMPLETE, this.onCollisionComplete, this);
        GameApp.NodePoolManager.createNodePool(ElementNode);
    }

    initliaze(gameMap: IGameMap, levelData: LevelData, hero: Hero) {
        this._gameMap = gameMap;
        this._gameMap.setCheckDelegate(this.check.bind(this));
        this._levelData = levelData;
        this._hero = hero;

        if (!this._astar) {
            this._astar = AstarFactory.createCrossAstar(this._gameMap);
        } else {
            this._astar.setAstarMap(this._gameMap);
        }
    }

    moveHero(position: IVec2, collisionFunc: (tile: IVec2) => boolean) {
        if (this._canHeroMoving) {
            let localPos = (this._gameMap as any).node.getComponent(UITransform)?.convertToNodeSpaceAR(v3(position.x, position.y));
            let endTile = this._gameMap.toTile(v2(localPos?.x, localPos?.y));
            if (this._hero.heroTile.equals(v2(endTile.x, endTile.y))) return;
            this.setAstarMoveType(AstarMoveType.HERO);
            let path = this.getPath(this._hero.heroTile, endTile);
            if (path.length > 0) {
                this._canHeroMoving = false;
                let canEndMove = this.canEndTileMove(endTile);
                if (!canEndMove) {
                    path.pop();
                }

                let moveComplete = () => {
                    if (!canEndMove) {
                        this._hero.toward(endTile);
                    } else {
                        this._hero.toward();
                    }
                    let tile = canEndMove ? endTile : path[path.length - 1];
                    if (tile) {
                        this._heroModel.setPosition(tile, this._hero.heroDirection);
                    }
                    this._canHeroMoving = collisionFunc(endTile);
                    this._hero.stand();
                };

                if (path.length > 0) {
                    this._hero.movePath(path, (tile: IVec2, end: boolean) => {
                        if (end) {
                            moveComplete();
                        } else if (!collisionFunc(tile)) {
                            this._hero.stand();
                            return true;
                        }
                        return false;
                    });
                } else {
                    moveComplete();
                }

                GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.MOVE_PATH));
            } else {
                UIFactory.showToast("勇士找不到路");
            }
        }
    }

    async move(layerName: string, src: number, dst: number, speed: number, delay: number, callback: Function | null = null) {
        let tile = this._gameMap.getTile(src);
        let gid = this._gameMap.getTileGIDAt(layerName, tile);
        if (gid) {
            let element = await this.createElement();
            if (element) {
                element.parent = this._gameMap.node;
                let position = this._gameMap.getPositionAt(this._gameMap.getTile(src))!;
                element.position = v3(position.x, position.y);
                //取元素数据
                let elementData = this._levelData.getLayerElement(layerName, src);
                if (elementData) {
                    element.getComponent(ElementNode)?.init(layerName, elementData.id);
                }

                this._levelData.move(layerName, src, dst, gid);
                this._gameMap.setTileGIDAt(layerName, tile, 0);
                this.setAstarMoveType(LAYER_TO_MOVE[layerName]);
                let path = this.getPath(this._gameMap.getTile(src), this._gameMap.getTile(dst));
                if (path && path.length > 0) {
                    let moveFunc = () => {
                        element.getComponent(ElementNode)?.movePath(this.changePathCoord(path), speed, () => {
                            this._gameMap.setTileGIDAt(layerName, this._gameMap.getTile(dst), gid);
                            callback && callback();
                        });
                    };
                    if (delay != 0) {
                        tween(element).delay(0.2).call(moveFunc).start();
                    } else {
                        moveFunc();
                    }
                } else {
                    GameFrameworkLog.error("element move path error");
                }
            }
        } else {
            GameFrameworkLog.error("move gid 找不到");
        }
    }

    specialMove(info: any) {
        if (info.type == "spawn") {
            if (info.move) {
                info.move.from.forEach(async (index: number) => {
                    this._gameMap.setTileGIDAt("monster", this._gameMap.getTile(index), 0);
                    let element = await this.createElement();
                    if (element) {
                        element.getComponent(ElementNode)?.moveSpwan(info, (tileIndex: number) => {
                            return this._gameMap.getPositionAt(this._gameMap.getTile(tileIndex));
                        });
                    }
                });
            }
        }
    }

    clear(): void {
        this._astarMoveType = AstarMoveType.NONE;
        this._astar = null;
        this._gameMap = null!;
        this._levelData = null!;
        GameApp.EventManager.unsubscribeTarget(this);
        GameApp.NodePoolManager.destroyNodePool(ElementNode);
    }

    private onCollisionComplete() {
        this._canHeroMoving = true;
    }

    private setAstarMoveType(astarMoveType: AstarMoveType) {
        this._astarMoveType = astarMoveType;
    }

    private getPath(beginTile: IVec2, endTile: IVec2) {
        if (!this._gameMap || !this._levelData || !this._astar) {
            throw new GameFrameworkError("you must set game map first");
        }

        if (this._astarMoveType === AstarMoveType.NONE) {
            throw new GameFrameworkError("you must set astar move type first");
        }

        this._endTile = endTile;
        return this._astar.makePath(beginTile, endTile);
    }

    /**
     * 是否终点tile可以移动
     * @param tile tile坐标
     */
    private canEndTileMove(tile: IVec2) {
        let { layerName, spriteName } = this._gameMap.getTileInfo(tile);
        switch (layerName) {
            case "floor":
                if (this._levelData.level >= 40) {
                    return this._heroModel.getAttr(HeroAttr.HP) > this.getWizardMagicDamage(this._gameMap.getTileIndex(tile));
                }
                return true;
            case "monster":
                if (spriteName) {
                    let name = spriteName.split("_")[0];
                    let monsterInfo = Utility.Json.getJsonKeyCache(layerName, "spriteId", name) as MonsterInfo;
                    if (monsterInfo) {
                        return CalculateSystem.canHeroAttack(this._heroModel, monsterInfo, !monsterInfo.firstAttack);
                    } else {
                        return true;
                    }
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

    private changePathCoord(path: IVec2[]) {
        for (let i = 0; i < path.length; i++) {
            path[i] = this._gameMap.getPositionAt(path[i])!;
        }
        return path;
    }

    private async createElement() {
        return (await GameApp.NodePoolManager.createNodeWithPath(ElementNode, `Prefab/Elements/ElementNode`)) as Node;
    }
}
