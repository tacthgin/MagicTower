import { Node, Tween, tween, UIOpacity, UITransform, v2, v3, Vec3 } from "cc";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { UIFactory } from "../../../../GameFramework/Scripts/Application/UI/UIFactory";
import { GameFrameworkError } from "../../../../GameFramework/Scripts/Base/GameFrameworkError";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { AstarFactory } from "../../../../GameFramework/Scripts/ToolLibary/Astar/AstarFactory";
import { IAstar } from "../../../../GameFramework/Scripts/ToolLibary/Astar/IAstar";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { Monster } from "../../../Model/MapModel/Data/Elements/Monster";
import { LevelData, MAGIC_DAMAGE_LEVEL } from "../../../Model/MapModel/Data/LevelData";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { GameEvent } from "../../Event/GameEvent";
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

const CAN_MOVE_TILES: Readonly<string[]> = ["prop", "stair"];

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

    awake(): void {
        this._heroModel = GameApp.getModel(HeroModel);
        GameApp.EventManager.subscribe(GameEvent.COLLISION_COMPLETE, this.onCollisionComplete, this);
    }

    clear(): void {
        this._astarMoveType = AstarMoveType.NONE;
        this._astar = null;
        this._gameMap = null!;
        this._levelData = null!;
        GameApp.EventManager.unsubscribeTarget(this);
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
                let canEndMove = this.canMoveTile(endTile);
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
                UIFactory.showToast("勇士迷路了");
            }
        }
    }

    async move(layerName: string, src: number, dst: number, speed: number, delay: number, callback: Function | null = null) {
        let tile = this._gameMap.getTile(src);
        let newTile = this._gameMap.getTile(dst);
        let gid = this._gameMap.getTileGIDAt(layerName, tile);
        if (gid) {
            let tileTiled = this._gameMap.getTiledTileAt(layerName, tile, true);
            if (tileTiled) {
                this.setAstarMoveType(LAYER_TO_MOVE[layerName]);
                let path = this.getPath(tile, newTile);
                if (path.length > 0) {
                    let action = this.getMoveAction(this.changePathCoord(path), speed, () => {
                        this._gameMap.setTileGIDAt(layerName, tile, 0);
                        this._gameMap.setTiledTileAt(layerName, tile, null);
                        this._gameMap.setTileGIDAt(layerName, newTile, gid);
                        this._levelData.move(layerName, src, dst, gid!);
                        callback && callback();
                    });
                    tween(tileTiled.node).delay(delay).then(action).start();
                } else {
                    GameFrameworkLog.error(`${tile} to ${newTile} element move path error`);
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
                    let tile = this._gameMap.getTile(index);
                    let tileTiled = this._gameMap.getTiledTileAt("monster", tile);
                    if (tileTiled) {
                        this.excuteMoveSpawnAction(tileTiled.node, info, index, () => {
                            this._gameMap.setTileGIDAt("monster", tile, 0);
                        });
                    }
                });
            }
        }
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

    private getMoveAction(path: Vec3[], speed: number, callback: Function | null) {
        let moveActions: Tween<Node>[] = [];
        for (let i = 0; i < path.length; i++) {
            moveActions.push(tween().to(speed, { position: path[i] }));
        }
        moveActions.push(
            tween().call(() => {
                callback && callback();
            })
        );

        return tween().sequence(...moveActions);
    }

    private excuteMoveSpawnAction(node: Node, info: any, tileIndex: number, callback: Function) {
        let moveAction: Tween<unknown> = null!;
        let fadeAction: Tween<unknown> = null!;
        for (let actionName in info) {
            switch (actionName) {
                case "move":
                    {
                        moveAction = tween().to(info.interval, { position: this._gameMap.getPositionAt(this._gameMap.getTile(tileIndex)) });
                    }
                    break;
                case "fadeOut":
                    {
                        fadeAction = tween().to(info.interval, { opacity: 0 });
                    }
                    break;
            }
        }
        tween(node).then(moveAction).start();
        let uiOpacity: UIOpacity = node.getComponent(UIOpacity)!;
        tween(uiOpacity)
            .then(fadeAction)
            .set({
                opacity: 255,
            })
            .call(callback)
            .start();
    }

    /**
     * 是否终点tile可以移动
     * @param tile tile坐标
     */
    private canMoveTile(tile: IVec2) {
        let index = this._gameMap.getTileIndex(tile);
        let monster = this._levelData.getLayerElement<Monster>("monster", index);
        if (monster) {
            let monsterInfo = monster.monsterInfo;
            return CalculateSystem.canHeroAttack(this._heroModel, monsterInfo, !monsterInfo.firstAttack);
        } else {
            let tileInfo = this._gameMap.getTileInfo(tile);
            if (!tileInfo) {
                return true;
            }

            if (tileInfo.layerName == "floor") {
                return this.canHeroMove(index);
            } else {
                return CAN_MOVE_TILES.includes(tileInfo.layerName);
            }
        }
    }

    private canPassWizard(index: number): boolean {
        if (this._levelData.level >= MAGIC_DAMAGE_LEVEL && !this._heroModel.equipedDivineShield()) {
            let wizardDamage = this._levelData.getWizardDamage(index);
            if (wizardDamage) {
                return this._heroModel.getAttr(HeroAttr.HP) > wizardDamage.damage;
            }
        }

        return true;
    }

    private canHeroMove(index: number): boolean {
        if (!this.canPassWizard(index)) {
            return false;
        }

        if (this._levelData.inBigMonster(index)) {
            return false;
        }

        return true;
    }

    private check(tile: IVec2): boolean {
        let tileInfo = this._gameMap!.getTileInfo(tile);
        if (!tileInfo) {
            return true;
        }

        let layerName = tileInfo.layerName;

        switch (this._astarMoveType) {
            case AstarMoveType.HERO:
                {
                    let notEnd = tile.x != this._endTile.x || tile.y != this._endTile.y;
                    if (layerName == "floor") {
                        let index = this._gameMap.getTileIndex(tile);
                        if (notEnd) {
                            let monster = this._levelData.getLayerElement<Monster>("monster", index);
                            if (monster) {
                                return false;
                            }
                        } else {
                            return this.canHeroMove(index);
                        }
                    } else if (notEnd) {
                        return layerName == "prop";
                    }
                }
                break;
            case AstarMoveType.MONSTER: {
                let heroTile = this._hero.heroTile;
                if (tile.x == heroTile.x && tile.y == heroTile.y) {
                    return false;
                }
                return layerName == "floor" || layerName == "monster" || layerName == "stair";
            }
            default:
                break;
        }

        return true;
    }

    private changePathCoord(path: IVec2[]): Vec3[] {
        let newPath: Vec3[] = [];
        let position = null;
        //tiletiled 运行动作坐标调整
        let width = (this._gameMap.width - 1) * 32 * 0.5;
        let height = (this._gameMap.height - 1) * 32 * 0.5;
        for (let i = 0; i < path.length; i++) {
            position = this._gameMap.getPositionAt(path[i])!;
            newPath.push(v3(position.x + width, position.y + height));
        }
        return newPath;
    }
}
