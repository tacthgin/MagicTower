import { Node, TiledUserNodeData, Tween, tween, UIOpacity, UITransform, v2, v3, Vec3 } from "cc";
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
import { Door, DoorState } from "../../../Model/MapModel/Data/Elements/Door";
import { Monster } from "../../../Model/MapModel/Data/Elements/Monster";
import { LevelData, MAGIC_DAMAGE_LEVEL } from "../../../Model/MapModel/Data/LevelData";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { DisappearCommand } from "../Command/DisappearCommand";
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

const CAN_MOVE_TILES_END: Readonly<string[]> = ["prop", "stair"];
const CAN_MOVE_TILES: Readonly<string[]> = ["prop"];

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
    private _coordOffset: IVec2 = null!;

    awake(): void {
        this._heroModel = GameApp.getModel(HeroModel);
        GameApp.EventManager.subscribe(GameEvent.COLLISION_COMPLETE, this.onCollisionComplete, this);
    }

    clear(): void {
        this._astarMoveType = AstarMoveType.NONE;
        this._astar = null;
        this._gameMap = null!;
        this._levelData = null!;
        this._endTile = null!;
        this._heroModel = null!;
        this._hero = null!;
        this._canHeroMoving = true;
        this._coordOffset = null!;

        GameApp.EventManager.unsubscribeTarget(this);
    }

    initliaze(gameMap: IGameMap, levelData: LevelData, hero: Hero) {
        this._gameMap = gameMap;
        this._gameMap.setCheckDelegate(this.check.bind(this));
        this._levelData = levelData;
        this._hero = hero;
        this._coordOffset = { x: (this._gameMap.width - 1) * 32 * 0.5, y: (this._gameMap.height - 1) * 32 * 0.5 };

        if (!this._astar) {
            this._astar = AstarFactory.createCrossAstar(this._gameMap);
        } else {
            this._astar.setAstarMap(this._gameMap);
        }
    }

    moveHero(position: IVec2, collisionFunc: (tile: IVec2) => boolean) {
        if (this._canHeroMoving) {
            let localPos = this._gameMap.node.getComponent(UITransform)?.convertToNodeSpaceAR(v3(position.x, position.y));
            if (!localPos) {
                return;
            }
            let endTile = this._gameMap.toTile(v2(localPos.x, localPos.y));
            if (this._hero.heroTile.equals(v2(endTile.x, endTile.y))) return;

            this.setAstarMoveType(AstarMoveType.HERO);
            let path = this.getPath(this._hero.heroTile, endTile);

            if (path.length == 0) {
                UIFactory.showToast("勇士迷路了");
            } else {
                let endTile: IVec2 = path[path.length - 1];
                let isRemoveEnd = !this.canMoveTile(endTile, true);
                if (isRemoveEnd) {
                    //终点是否可走，不能走就去掉终点
                    path.pop();
                }

                if (path.length == 0) {
                    this.setCanHeroMoving(collisionFunc(endTile));
                    this.moveEnd(endTile);
                } else {
                    let stop = false;
                    this._hero.movePath(
                        path,
                        (tile: IVec2, end: boolean) => {
                            stop = !collisionFunc(tile);
                            if (stop || end) {
                                //当前格子不能走后结束
                                this.setCanHeroMoving(!stop);
                                this.moveEnd(tile);
                            }

                            return stop;
                        },
                        () => {
                            if (isRemoveEnd && !stop) {
                                //如果是终点，并且没停止，碰撞真正的终点
                                this.setCanHeroMoving(collisionFunc(endTile));
                                this.moveEnd(endTile);
                            }
                        }
                    );
                }

                GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.MOVE_PATH));
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
                    let tileTiled = this._gameMap.getTiledTileAt("monster", tile, true);
                    if (tileTiled) {
                        this.excuteMoveSpawnAction(tileTiled.node, info, info.move.to, () => {
                            GameApp.CommandManager.createCommand(DisappearCommand).execute("monster", tile);
                            this._gameMap.setTiledTileAt("monster", tile, null);
                        });
                    }
                });
            }
        }
    }

    private moveEnd(tile: IVec2) {
        this._hero.toward(tile);
        this._hero.stand();
        this._heroModel.setPosition(tile, this._hero.heroDirection);
    }

    private onCollisionComplete() {
        this.setCanHeroMoving(true);
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
        for (let actionName in info) {
            switch (actionName) {
                case "move":
                    {
                        let position = this.changeTileTiledCoord(this._gameMap.getPositionAt(this._gameMap.getTile(tileIndex))!);
                        tween(node).to(info.interval, { position: position }).start();
                    }
                    break;
                case "fadeOut":
                    {
                        let uiOpacity: UIOpacity | null = node.getComponent(UIOpacity);
                        if (!uiOpacity) {
                            uiOpacity = node.addComponent(UIOpacity);
                        }
                        tween(uiOpacity).to(info.interval, { opacity: 0 }).call(callback).start();
                    }
                    break;
            }
        }
    }

    /**
     * 路径途中和终点行走判断
     * @param tile tile坐标
     * @param isEnd 是否路径终点
     */
    private canMoveTile(tile: IVec2, isEnd: boolean) {
        let index = this._gameMap.getTileIndex(tile);
        let tileInfo = this._gameMap.getTileInfo(tile);
        if (!tileInfo) {
            return true;
        }

        switch (tileInfo.layerName) {
            case "monster":
                if (!isEnd) {
                    //如果行走中绕过怪物
                    return false;
                } else {
                    let monster = this._levelData.getLayerElement<Monster>("monster", index);
                    if (monster) {
                        let monsterInfo = monster.monsterInfo;
                        return CalculateSystem.canHeroAttack(this._heroModel, monsterInfo, !monsterInfo.firstAttack);
                    } else {
                        throw new GameFrameworkError("move monster error");
                    }
                }
            case "floor":
                return this.canHeroMove(index);
            default:
                let tiles = isEnd ? CAN_MOVE_TILES_END : CAN_MOVE_TILES;
                return tiles.includes(tileInfo.layerName);
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

        let door = this._levelData.getLayerElement<Door>("door", index);
        if (door && door.doorState == DoorState.APPEAR) {
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
                    if (this.equal(tile, this._endTile)) {
                        //寻路的时候，默认终点可以走
                        return true;
                    }
                    let result = this.canMoveTile(tile, false);
                    return result;
                }
                break;
            case AstarMoveType.MONSTER: {
                if (!this.equal(tile, this._endTile) && this.equal(tile, this._hero.heroTile)) {
                    //不是终点，不能走英雄的格子
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

        for (let i = 0; i < path.length; i++) {
            position = this._gameMap.getPositionAt(path[i])!;
            newPath.push(this.changeTileTiledCoord(position));
        }
        return newPath;
    }

    private changeTileTiledCoord(coord: IVec2) {
        //tiletiled 运行动作坐标调整
        return v3(coord.x + this._coordOffset.x, coord.y + this._coordOffset.y);
    }

    private equal(left: IVec2, right: IVec2) {
        return left.x == right.x && left.y == right.y;
    }

    private setCanHeroMoving(canMove: boolean) {
        this._canHeroMoving = canMove;
    }
}
