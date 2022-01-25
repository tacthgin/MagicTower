import { Tween, tween, UIOpacity, UITransform, v2, v3, Vec2, Vec3, Node } from "cc";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { PropType } from "../../../Model/HeroModel/Prop";
import { Door, DoorState } from "../../../Model/MapModel/Data/Elements/Door";
import { Monster } from "../../../Model/MapModel/Data/Elements/Monster";
import { Stair, StairType } from "../../../Model/MapModel/Data/Elements/Stair";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { MapModel } from "../../../Model/MapModel/MapModel";
import { ShopModel } from "../../../Model/ShopModel/ShopModel";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { MonsterDieEventArgs } from "../../Event/MonsterDieEventArgs";
import { UsePropEventArgs } from "../../Event/UsePropEventArgs";
import { DoorAnimationNode } from "../Elements/DoorAnimaitonNode";
import { DoorAnimationReverseNode } from "../Elements/DoorAnimaitonReverseNode";
import { ElementNode } from "../Elements/ElementNode";
import { IGameMap } from "../Map/GameMap/IGameMap";
import { Hero } from "../Map/Hero/Hero";
import { CalculateSystem } from "./CalculateSystem";
import { GameEventSystem } from "./GameEventSystem";
import { MonsterFightSystem } from "./MonsterFightSystem";
import { AstarMoveType, MoveSystem } from "./MoveSystem";
import { NpcInteractiveSystem } from "./NpcInteractiveSystem";
import { UsePropSystem } from "./UsePropSystem";

/** 地块4个方向 */
const DIRECTION_INDEX_DIFFS: Readonly<{ [key: string]: Vec2 }> = {
    "-1": v2(1, 0),
    "1": v2(-1, 0),
    "-11": v2(0, -1),
    "11": v2(0, 1),
};

@CommandManager.register("MapCollisionSystem")
export class MapCollisionSystem extends SystemBase {
    private gameMap: IGameMap = null!;
    private hero: Hero = null!;
    private heroModel: HeroModel = null!;
    private mapModel: MapModel = null!;
    private levelData: LevelData = null!;

    private monsterFightSystem: MonsterFightSystem = null!;
    private npcInteractiveSystem: NpcInteractiveSystem = null!;
    private gameEventSystem: GameEventSystem = null!;
    private moveSystem: MoveSystem = null!;
    private usePropSystem: UsePropSystem = null!;
    private levelEvent: any = {};
    private dialogPos: Vec3 = null!;
    private canHeroMoving: boolean = true;

    constructor() {
        super();
        this.registerEvent();
        this.monsterFightSystem = GameApp.CommandManager.createSystem(MonsterFightSystem);
        this.npcInteractiveSystem = GameApp.CommandManager.createSystem(NpcInteractiveSystem);
        this.gameEventSystem = GameApp.CommandManager.createSystem(GameEventSystem);
        this.moveSystem = GameApp.CommandManager.createSystem(MoveSystem);
        this.usePropSystem = GameApp.CommandManager.createSystem(UsePropSystem);

        this.heroModel = GameApp.getModel(HeroModel);
        this.mapModel = GameApp.getModel(MapModel);
    }

    initliaze(gameMap: IGameMap, hero: Hero) {
        this.gameMap = gameMap;
        this.hero = hero;
        this.levelData = this.mapModel.getCurrentLevelData();
        this.moveSystem.initliaze(this.gameMap, this.levelData);
    }

    private registerEvent() {
        let eventManager = GameApp.EventManager;
        eventManager.subscribe(GameEvent.MONSTER_DIE, this.onMonsterDie, this);
        eventManager.subscribe(GameEvent.COLLISION_COMPLETE, this.onCollisionComplete, this);
        eventManager.subscribe(GameEvent.USE_PROP, this.onUseProp, this);
    }

    private onMonsterDie(sender: object, eventArgs: MonsterDieEventArgs) {
        //幸运金币
        let ratio = this.heroModel.getPropNum(PropType.LUCKY_GOLD) ? 2 : 1;
        this.heroModel.setAttrDiff(HeroAttr.GOLD, eventArgs.monster.monsterInfo.gold * ratio);
        this.disappear("monster", eventArgs.monster.index);
        this.elementActionComplete();
        //this.removeMonsterDoor();
        //this.monsterEventTrigger(index);
        //this.removeMagicHurt(index, monster);
        // if (monster.monsterInfo.big) {
        //     this.monsterInfo.bigMonster = null;
        // }
        // if (this.doorInfo.monsterCondition) {
        //     let doorIndex = this.doorInfo.monsterCondition[index];
        //     if (doorIndex) {
        //         let door = this.getElement(doorIndex, "door");
        //         if (door) {
        //             door.condition = null;
        //         }
        //     }
        //     delete this.doorInfo.monsterCondition[index];
        // }
        // if (monster.monsterInfo.eventID) {
        //     this.eventCollision(monster.monsterInfo.eventID);
        // } else if (this.gameEventSystem && !this.gameEventSystem.executeComplete()) {
        //     this.gameEventSystem.execute();
        // } else if (magic) {
        //     this.floorCollision(index);
        // } else {
        //     this.elementActionComplete();
        // }
    }

    private onCollisionComplete() {
        this.canHeroMoving = true;
    }

    private onUseProp(sender: object, eventArgs: UsePropEventArgs) {
        this.usePropSystem.useProp(eventArgs.propInfo, eventArgs.extraInfo);
    }

    private getTileOrIndex(tileOrIndex: IVec2 | number) {
        let tile: IVec2 = null!;
        let index: number = -1;
        if (typeof tileOrIndex == "number") {
            tile = this.gameMap.getTile(tileOrIndex);
            index = tileOrIndex;
        } else {
            tile = tileOrIndex;
            index = this.gameMap.getTileIndex(tileOrIndex);
        }

        return { tile: tile, index: index };
    }

    appear(layerName: string, tileOrIndex: IVec2 | number, id: number, record: boolean = true) {
        let json = Utility.Json.getJsonElement(layerName, id) as any;
        if (json) {
            let { index, tile } = this.getTileOrIndex(tileOrIndex);
            let gid = this.gameMap.getGidByName(`${json.spriteId}_0`);
            if (gid) {
                this.gameMap.setTileGIDAt(layerName, tile, gid);
                record && this.levelData.setAppear(layerName, index, gid);
            } else {
                GameFrameworkLog.error("appear gid 找不到");
            }
        } else {
            GameFrameworkLog.error("appear error id:", id);
        }
    }

    disappear(layerName: string, tileOrIndex: IVec2 | number, record: boolean = true) {
        let { index, tile } = this.getTileOrIndex(tileOrIndex);
        if (tile) {
            this.gameMap.setTileGIDAt(layerName, tile, 0);
        }
        record && this.levelData.setDisappear(layerName, index);
    }

    moveHero(position: IVec2) {
        if (this.canHeroMoving) {
            let localPos = (this.gameMap as any).node.getComponent(UITransform)?.convertToNodeSpaceAR(v3(position.x, position.y));
            let endTile = this.gameMap.toTile(v2(localPos?.x, localPos?.y));
            this.moveSystem.setAstarMoveType(AstarMoveType.HERO);
            let path = this.moveSystem.getPath(this.hero.heroTile, endTile);
            if (path) {
                let canEndMove = this.moveSystem.canEndTileMove(endTile);
                if (!canEndMove) {
                    path.pop();
                }

                this.hero.movePath(path, (tile: IVec2, end: boolean) => {
                    if (end) {
                        if (!canEndMove) {
                            this.hero.toward(endTile);
                        } else {
                            this.hero.toward();
                        }
                        let tile = canEndMove ? endTile : path[path.length - 1];
                        if (tile) {
                            this.heroModel.setPosition(tile, this.hero.heroDirection);
                        }
                        this.collision(endTile);
                        this.hero.stand();
                    } else if (!this.collision(tile)) {
                        this.hero.stand();
                        return true;
                    }
                    return false;
                });
                GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.MOVE_PATH));
            } else {
                //GameManager.UI.showToast("无效路径");
            }
        }
    }

    async move(layerName: string, src: number, dst: number, speed: number, delay: number) {
        let tile = this.gameMap.getTile(src);
        let gid = this.gameMap.getTileGIDAt(layerName, tile);
        if (gid) {
            let element = await this.createElement();
            if (element) {
                this.levelData.move(layerName, src, dst, gid);
                this.gameMap.setTileGIDAt(layerName, tile, 0);
                let path = CommonAstar.getPath(this.gameMap, this.gameMap.getTile(src), this.gameMap.getTile(dst));
                if (path) {
                    let moveFunc = () => {
                        element?.getComponent(ElementNode)?.movePath(this.changePathCoord(path!), speed);
                    };
                    if (delay != 0) {
                        tween(element).delay(delay).call(moveFunc).start();
                    } else {
                        tween(element).call(moveFunc).start();
                    }
                }
            }
        } else {
            GameFrameworkLog.error("move gid 找不到");
        }
    }

    specialMove(info: any) {
        if (info.type == "spawn") {
            let moveAction: Tween<unknown> = null!;
            let fadeAction: Tween<unknown> = null!;
            for (let actionName in info) {
                switch (actionName) {
                    case "move":
                        {
                            let tile = this.gameMap.getTile(info[actionName].to);
                            moveAction = tween().to(info.interval, { position: this.gameMap.getPositionAt(tile) });
                        }
                        break;
                    case "fadeOut":
                        {
                            fadeAction = tween().to(info.interval, { opacity: 0 });
                        }
                        break;
                }
            }
            if (info.move) {
                info.move.from.forEach(async (index: number) => {
                    this.gameMap.setTileGIDAt("monster", this.gameMap.getTile(index), 0);
                    let element = await this.createElement();
                    if (element) {
                        tween(element).then(moveAction).start();
                        tween(element.getComponent(UIOpacity)).then(fadeAction).start();
                    }
                });
            }
        }
    }

    private async createElement() {
        return (await GameApp.NodePoolManager.createNodeWithPath(ElementNode, `Prefabs/Elements/ElementNode`)) as Node;
    }

    private async createDoorAnimation(id: number | string, tile: IVec2, reverse: boolean, callback: Function | null = null) {
        let name = reverse ? "DoorAnimationReverseNode" : "DoorAnimationNode";
        let constructor = reverse ? DoorAnimationReverseNode : DoorAnimationNode;
        let node = (await GameApp.NodePoolManager.createNodeWithPath(constructor, `Prefabs/Elements/${name}`)) as Node;
        if (node) {
            let position = this.gameMap.getPositionAt(tile);
            if (position) {
                node.position = v3(position?.x, position?.y);
                node.parent = (this.gameMap as any).node;
                node.getComponent(constructor)?.init(`door${id}`, callback);
            }
        }
    }

    /** 根据图片名字获取json数据 */
    private getJsonData(layerName: string, spriteFrameName: string | null | undefined) {
        if (!spriteFrameName) return null;
        let name = spriteFrameName.split("_")[0];
        switch (layerName) {
            case "prop":
            case "monster":
            case "door":
                return Utility.Json.getJsonKeyCache(layerName, "spriteId", name);
            default:
                return null;
        }
    }

    /**
     * 英雄和地图元素的交互
     * @param tile 交互坐标
     * @returns true表示交互结束，false表示交互正在进行
     */
    collision(tile: IVec2) {
        let { layerName, spriteName } = this.gameMap.getTileInfo(tile);
        if (!layerName) return true;
        let jsonData = this.getJsonData(layerName, spriteName) as any;
        switch (layerName) {
            case "prop":
                {
                    GameApp.SoundManager.playSound("Sound/eat");
                    this.heroModel.addProp(jsonData.id, this.levelData.level);
                    this.disappear(layerName, tile);
                }
                return true;
            case "door":
                //这里只处理可见的门逻辑
                return this.doorCollision(tile, layerName);
            case "stair":
                let stair = this.levelData.getStair(spriteName == "stair_down" ? StairType.Down : StairType.UP);
                if (stair) {
                    this.mapModel.setLevelDiff(stair.levelDiff);
                    return true;
                }
                break;
            case "monster":
                {
                    if (!CalculateSystem.canHeroAttack(this.heroModel, jsonData, !jsonData.firstAttack)) {
                        //GameManager.UI.showToast(`你打不过${jsonData.name}`);
                        return true;
                    }
                    let monster = new Monster();
                    monster.id = parseInt(jsonData.id);
                    monster.index = this.gameMap.getTileIndex(tile);
                    this.monsterFightSystem.init(this.gameMap, this.hero, monster).execute(/*this.haveMagicHurt(index)*/ false);
                }
                break;
            case "npc":
                let npc = new Npc();
                this.npcInteractiveSystem.init(this.gameMap, this.hero, npc);
                break;
            case "building":
                this.gotoShop();
                break;
            case "event":
                this.eventCollision(tile);
                break;
            case "floor":
                return this.floorCollision(tile);
            default:
                return true;
        }
        return false;
    }

    private doorCollision(tile: IVec2, layerName: string) {
        let tileIndex = this.gameMap.getTileIndex(tile);

        let doorInfo: Door = this.levelData.getLayerElement(layerName, tileIndex);
        if (!doorInfo) {
            return true;
        }

        let openDoor = () => {
            this.createDoorAnimation(doorInfo.id, tile, false, () => {
                NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
            });
            this.levelData.deleteLayerElement(layerName, tileIndex);
            this.gameMap.setTileGIDAt(layerName, tile, 0);
        };

        if (doorInfo.canWallOpen()) {
            openDoor();
        } else if (doorInfo.isKeyDoor()) {
            let keyID = GameManager.DATA.getJsonParser("prop")?.getJsonElementByKey("value", doorInfo.id).id;
            if (keyID && this.heroModel.getPropNum(keyID) > 0) {
                this.heroModel.addProp(keyID, 1, -1);
                openDoor();
                let eventInfo = this.levelData.getLayerInfo(layerName)["event"];
                if (eventInfo && eventInfo.doorState == DoorState.DISAPPEAR_EVENT) {
                    let existCondition = eventInfo.condition[0];
                    if (existCondition) {
                        let index = existCondition.indexOf(tileIndex);
                        if (index != -1) {
                            eventInfo.condition[0] = null;
                        } else {
                            let disappearCondition: number[] = eventInfo.condition[1];
                            index = disappearCondition.indexOf(tileIndex);
                            if (index != -1) {
                                disappearCondition.splice(index, 1);
                                if (disappearCondition.length == 0) {
                                    this.eventCollision(eventInfo.value);
                                }
                            }
                        }
                    }
                }
            }
        }

        return true;

        //if (element.canWallOpen()) {
        //墙门
        //this.removeElement(index, "door");
        //return false;
        //} else if (element.appear) {
        //if (!element.node.active) {
        //隐藏的墙门
        //element.add();
        //门事件
        //if (this.doorInfo.appearEventDoor) {
        //for (let eventID in this.doorInfo.appearEventDoor) {
        //let indexs = this.doorInfo.appearEventDoor[eventID];
        //indexs.splice(indexs.indexOf(index), 1);
        //if (indexs.length != 0) {
        //this.eventCollision(eventID);
        //}
        //}
        //}
        //}
        //return true;
        //} else if (!element.hide && !element.passive) {
        //let keyId = this.propParser.getKeyByDoor(element.id);
        //if (keyId && this.heroModel.getPropNum(keyId) > 0) {
        //this.hero.removeProp(keyId);
        //this.removeElement(index, "door");
        //this.disappearDoorEventTrigger(index);
        //SoundManager.playEffect("door");
        //return false;
        //} else {
        //GameManager.getInstance().showToast("你无法打开这个门");
        //}
        //}
        //return true;
    }

    private invisibleDoorCollision(tile: Vec2) {
        let layerName = "door";
        let doorLayerInfo = this.levelData.getLayerInfo(layerName);
        if (!doorLayerInfo) {
            return true;
        }
        let tileIndex = this.gameMap.getTileIndex(tile);

        let eventInfo: Door = doorLayerInfo["event"];
        if (eventInfo && eventInfo.doorState == DoorState.APPEAR_EVENT) {
            //墙门出现事件
            this.createDoorAnimation(DoorType.WALL, tile, false, () => {
                this.gameMap.setTileGIDAt(layerName, tile, this.gameMap.getGidByName(`door${DoorType.WALL}`));
            });

            let condition: number[] = eventInfo.condition;
            let index = condition.indexOf(tileIndex);
            if (index != -1) {
                condition.splice(index, 1);
            }
            this.levelData.saveMapData();
            if (condition.length == 0) {
                this.eventCollision(eventInfo.value);
            }
        } else {
            let doorInfo: Door = this.levelData.getLayerElement(layerName, tileIndex);
            if (doorInfo && doorInfo.doorState == DoorState.APPEAR) {
                this.createDoorAnimation(doorInfo.id, tile, true, () => {
                    this.gameMap.setTileGIDAt(layerName, tile, doorInfo.gid);
                    NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
                });
            }
        }

        return false;
    }

    show() {
        //跨层事件
        //let eventID = this.eventInfo.get(this.mapData.level);
        //if (eventID) {
        //this.excuteEvent(eventID);
        //this.eventInfo.clear(this.mapData.level);
        //}
    }

    private parseDoor(layerName: string, info: any) {
        //info.tile.forEach((elementInfo) => {
        //this.addElement(elementInfo[0], layerName, "Door", elementInfo[1]).node.zIndex = 2;
        //});
        //if (info.passive) {
        //info.passive.forEach((index) => {
        //this.getElement(index, layerName).passive = true;
        //});
        //}
        //if (info.appear) {
        //info.appear.forEach((index) => {
        //this.getElement(index, layerName).appear = true;
        //});
        //}
        //if (info.hide) {
        //this.getElement(info.hide, layerName).hide = true;
        //}
        //if (info.monsterCondition) {
        //for (let doorIndex in info.monsterCondition) {
        //this.getElement(doorIndex, layerName).condition = info.monsterCondition[doorIndex];
        //this.doorInfo.monsterCondition = {};
        //this.doorInfo.monsterCondition[info.monsterCondition[doorIndex]] = doorIndex;
        //}
        //}
        //this.doorInfo.monsterDoor = Util.clone(info.monster);
        //this.doorInfo.appearEventDoor = Util.clone(info.appearEvent);
        //this.doorInfo.disappearEventDoor = Util.clone(info.disappearEvent);
    }
    private parseMonster(layerName: string, info: any) {
        //if (!info) return;
        //if (info.tile) {
        //info.tile.forEach((elementInfo) => {
        //let element = this.addElement(elementInfo[0], layerName, "Monster", elementInfo[1]);
        //element.node.zIndex = 1;
        //if (element.monsterInfo.big) {
        //this.monsterInfo.bigMonster = element.monsterInfo.big;
        //}
        //});
        //}
        //if (info.monsterEvent) {
        //this.monsterInfo.monsterEvent = Util.clone(info.monsterEvent);
        //}
        //if (info.firstAttack) {
        //info.firstAttack.forEach((index) => {
        //this.getElement(index, layerName).firstAttack = true;
        //});
        //}
        //if (info.monsterMove) {
        //info.monsterMove.forEach((index) => {
        //this.getElement(index, layerName).monsterMove = true;
        //});
        //}
    }

    private parseDamage(info: any) {
        //魔法警卫
        //this.monsterInfo.magicHurt.magic = {};
        //for (let index in info) {
        //this.monsterInfo.magicHurt.magic[index] = info[index];
        //}
    }
    /**
     * 获取巫师周围伤害地块index
     * @param index
     */
    private getMagicHurtIndexs(index: number) {
        //let indexs = [];
        //for (let diff in DIRECTION_INDEX_DIFFS) {
        //let coord = this.indexToTile(index).add(DIRECTION_INDEX_DIFFS[diff]);
        //if (this.inBoundary(coord)) {
        //let { tileType } = this.getTileLayer(coord);
        //if (tileType == "floor" || tileType == "door") {
        //indexs.push(index + parseInt(diff));
        //}
        //}
        //}
        //return indexs;
    }
    private parseMagicHurt() {
        //解析巫师的伤害tile
        //let layer = this.layers["monster"];
        //let targetIndexs = Object.keys(layer).filter((index: string) => {
        //let magicAttack = layer[index].monsterInfo.magicAttack;
        //if (magicAttack) {
        //return magicAttack >= 1;
        //}
        //return false;
        //});
        //let wizard = {};
        //if (targetIndexs.length > 0) {
        //targetIndexs.forEach((index) => {
        //let indexs = this.getMagicHurtIndexs(parseInt(index));
        //indexs.forEach((hurtIndex) => {
        //if (!wizard[hurtIndex]) {
        //wizard[hurtIndex] = [];
        //}
        //wizard[hurtIndex].push(parseInt(index));
        //});
        //});
        //}
        //this.monsterInfo.magicHurt.wizard = wizard;
    }

    /**
     * 地图上转移元素
     * @param srcIndex 原始位置
     * @param dstIndex 目标位置
     * @param layerName 层名
     * @param control 元素控制器
     */
    changeElementInfo(srcIndex: number, dstIndex: number, layerName: string, control: any) {
        //this.removeElement(srcIndex, layerName, false);
        //let layer = this.layers[layerName];
        //if (layer) {
        //layer[dstIndex] = control;
        //}
    }

    private removeMonsterDoor() {
        //if (!this.doorInfo.monsterDoor) return;
        //let monsterIndexs = null;
        //let needDeletesIndexs = [];
        //let clearFlag = false;
        //for (let index in this.doorInfo.monsterDoor) {
        //monsterIndexs = index.split(",");
        //clearFlag = true;
        //for (let i = 0; i < monsterIndexs.length; i++) {
        //if (this.layers["monster"][monsterIndexs[i]]) {
        //clearFlag = false;
        //break;
        //}
        //}
        //if (clearFlag) {
        //needDeletesIndexs.push(index);
        //}
        //}
        //if (needDeletesIndexs.length > 0) {
        //SoundManager.playEffect("door");
        //}
        //needDeletesIndexs.forEach((index) => {
        //this.doorInfo.monsterDoor[index].forEach((doorIndex) => {
        //this.removeElement(doorIndex, "door");
        //});
        //delete this.doorInfo.monsterDoor[index];
        //});
    }
    private monsterEventTrigger(monsterIndex: number) {
        //if (!this.monsterInfo.monsterEvent) return;
        //let id = null;
        //for (let eventID in this.monsterInfo.monsterEvent) {
        //let eventInfo = this.monsterInfo.monsterEvent[eventID];
        //let index = eventInfo.tile.indexOf(monsterIndex);
        //if (index != -1) {
        //eventInfo.tile.splice(index, 1);
        //if (eventInfo.tile.length == 0) {
        //if (eventInfo.condition) {
        //let exist = true;
        //for (let i = 0; i < eventInfo.condition.length; i++) {
        //if (!this.getElement(eventInfo.condition[i], "monster")) {
        //exist = false;
        //break;
        //}
        //}
        //if (exist) {
        //id = eventID;
        //}
        //} else {
        //id = eventID;
        //}
        //}
        //}
        //if (this.monsterInfo.monsterEvent[eventID].length == 0) {
        //}
        //}
        //if (id != null) {
        //this.monsterInfo.monsterEvent = null;
        //this.eventCollision(id);
        //}
    }
    private removeMagicHurt(index: number, monster: Monster) {
        //let magicHurt = monster.monsterInfo.magicAttack;
        //if (magicHurt) {
        //if (magicHurt < 1) {
        //for (let tileIndex in this.monsterInfo.magicHurt.magic) {
        //if (this.monsterInfo.magicHurt.magic[tileIndex].indexOf(index) != -1) {
        //delete this.monsterInfo.magicHurt.magic[tileIndex];
        //}
        //}
        //} else {
        //this.parseMagicHurt();
        //}
        //}
    }

    private disappearDoorEventTrigger(index: number) {
        //for (let eventID in this.doorInfo.disappearEventDoor) {
        //let info = this.doorInfo.disappearEventDoor[eventID];
        //if (info.condition.indexOf(index) != -1) {
        //delete this.doorInfo.disappearEventDoor[eventID];
        //} else {
        //let disappearIndex = info.tile.indexOf(index);
        //if (disappearIndex != -1) {
        //info.tile.splice(disappearIndex, 1);
        //if (info.tile.length == 0) {
        //delete this.doorInfo.disappearEventDoor[eventID];
        //this.eventCollision(eventID);
        //}
        //}
        //}
        //}
    }

    private changePathCoord(path: IVec2[]) {
        for (let i = 0; i < path.length; i++) {
            path[i] = this.gameMap.getPositionAt(path[i])!;
        }
        return path;
    }

    private gotoShop() {
        let shopModel = GameApp.getModel(ShopModel);
        shopModel.level = this.levelData.level;
        // GameManager.UI.showDialog("ShopDialog", shopModel, this.heroModel.getAttr(HeroAttr.GOLD), (attr: string) => {
        //     switch (attr) {
        //         case "hp":
        //             this.heroModel.setAttrDiff(HeroAttr.HP, shopModel.hp);
        //             break;
        //         case "attack":
        //             this.heroModel.setAttrDiff(HeroAttr.ATTACK, shopModel.attack);
        //             break;
        //         case "defence":
        //             this.heroModel.setAttrDiff(HeroAttr.DEFENCE, shopModel.defence);
        //             break;
        //         default:
        //             break;
        //     }
        //     if (attr != "no") {
        //         this.heroModel.setAttrDiff(HeroAttr.GOLD, shopModel.buy());
        //     }
        //     this.elementActionComplete();
        // }).then((control: any) => {
        //     //control.node.position = this._dialogPos;
        // });
    }

    private eventCollision(eventID: number | string | Vec2) {
        let id: number | string | null = null;
        if (eventID instanceof Vec2) {
            let index = this.gameMap.getTileIndex(eventID);
            let eventInfo = this.levelData.getLayerInfo("event");
            if (eventInfo) {
                let event: Element = eventInfo[index];
                if (event) {
                    id = event.id;
                }
            }
        } else {
            id = eventID;
        }

        if (id) {
            let eventInfo = Utility.Json.getJsonElement("event", id) as any;
            if (!eventInfo.save || eventInfo.save == this.levelData.level) {
                this.gameEventSystem.init(this, this.gameMap, this.hero, id).execute();
                return false;
            } else {
                this.levelEvent[eventInfo.save] = id;
            }
        }
        return true;
    }

    haveMagicHurt(index: number) {
        //let magic = false;
        //if (!this.heroModel.equipedDivineShield()) {
        //if (this.monsterInfo.magicHurt.wizard) {
        //magic = this.monsterInfo.magicHurt.wizard[index] != undefined;
        //}
        //if (!magic && this.monsterInfo.magicHurt.magic) {
        //magic = this.monsterInfo.magicHurt.magic[index] != undefined;
        //}
        //}
        //return magic;
    }

    /** 获取巫师的魔法伤害 */
    getWizardMagicDamage(index: number) {
        let totalDamage = 0;
        if (!this.heroModel.equipedDivineShield()) {
            // if (this.monsterInfo.magicHurt.wizard) {
            //     let hurtInfo = this.monsterInfo.magicHurt.wizard[index];
            //     if (hurtInfo) {
            //         hurtInfo.forEach((monsterIndex) => {
            //             let element = this.getElement(monsterIndex, "monster");
            //             totalDamage += element.monsterInfo.magicAttack;
            //         });
            //     }
            // }
        }
        return totalDamage;
    }

    private floorCollision(tile: Vec2) {
        if (!this.invisibleDoorCollision(tile)) {
            return false;
        }

        //if (!this.heroModel.equipedDivineShield()) {
        //if (this.monsterInfo.magicHurt.magic) {
        //如果通过魔法守卫中间
        //let hurtInfo = this.monsterInfo.magicHurt.magic[index];
        //if (hurtInfo) {
        //let element = this.getElement(hurtInfo[0], "monster");
        //this.hero.magicDamage(hurtInfo, element.monsterInfo.magicAttack);
        //return false;
        //}
        //}
        //if (this.monsterInfo.magicHurt.wizard) {
        //let wizardDamage = this.getWizardMagicDamage(index);
        //if (this.heroModel.Hp <= wizardDamage) {
        //GameManager.getInstance().showToast("不能过去，你将被巫师杀死！");
        //return true;
        //}
        //如果通过巫师的空地
        //let hurtInfo = this.monsterInfo.magicHurt.wizard[index];
        //if (hurtInfo) {
        //this.hero.magicDamage(hurtInfo, wizardDamage);
        //let monster = this.getElement(hurtInfo[0], "monster");
        //if (monster && monster.monsterMove) {
        //let diff = index - hurtInfo[0];
        //let newIndex = hurtInfo[0] - diff;
        //cc.log(newIndex, this.maxIndex);
        //if (newIndex >= 0 && newIndex <= this.maxIndex && !this.getElement(newIndex)) {
        //monster.move(DIRECTION_INDEX_DIFFS[`${diff}`].mul(this.mapData.tileWidth), () => {
        //this.changeElementInfo(hurtInfo[0], newIndex, "monster", monster);
        //this.parseMagicHurt();
        //});
        //}
        //}
        //return false;
        //}
        //}
        //}
        return true;
    }

    clearGameEventSystem() {
        //this.gameEventSystem = null;
    }

    private elementActionComplete() {
        NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
    }

    getMonsters() {
        //let layer = this.layers["monster"];
        //let monsters = {};
        //for (let index in layer) {
        //let monster = layer[index];
        //monsters[monster.monsterInfo.id] = monster;
        //}
        //return Object.keys(monsters)
        //.map((id) => {
        //return monsters[id];
        //})
        //.sort((l, r) => {
        //return parseInt(l.id) - parseInt(r.id);
        //});
    }

    clear(): void {
        GameApp.EventManager.unsubscribeTarget(this);
        GameApp.CommandManager.destroySystem(this.monsterFightSystem);
        GameApp.CommandManager.destroySystem(this.npcInteractiveSystem);
        GameApp.CommandManager.destroySystem(this.gameEventSystem);
        GameApp.CommandManager.destroySystem(this.moveSystem);
    }
}
