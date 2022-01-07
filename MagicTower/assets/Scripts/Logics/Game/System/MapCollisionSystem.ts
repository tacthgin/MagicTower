import { math, Tween, tween, UIOpacity, UITransform, v2, v3, Vec2, Vec3 } from "cc";
import { CommonAstar } from "../../../../Framework/Lib/Custom/Astar";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { GameEvent } from "../../../Constant/GameEvent";
import { Door, DoorState, DoorType, Element, Monster, Npc, Stair, StairType } from "../../../Data/CustomData/Element";
import { HeroAttr, HeroModel, PropType } from "../../../Data/CustomData/HeroModel";
import { LevelData } from "../../../Data/CustomData/LevelData";
import { MapData } from "../../../Data/CustomData/MapData";
import { ShopData } from "../../../Data/CustomData/ShopData";
import { ElementNode } from "../Elements/ElementNode";
import { Hero } from "../Map/Actor/Hero";
import { AstarMoveType, GameMap } from "../Map/GameMap";
import { CalculateSystem } from "./CalculateSystem";
import { GameEventSystem } from "./GameEventSystem";
import { MonsterFightSystem } from "./MonsterFightSystem";
import { NpcInteractiveSystem } from "./NpcInteractiveSystem";

const LAYER_TO_MOVE: Readonly<{ [key: string]: AstarMoveType }> = {
    npc: AstarMoveType.MONSTER,
    monster: AstarMoveType.MONSTER,
};

/** 在楼梯旁的index差值 */
const INDEX_DIFFS: Readonly<number[]> = [1, 11];

/** 地块4个方向 */
const DIRECTION_INDEX_DIFFS: Readonly<{ [key: string]: Vec2 }> = {
    "-1": v2(1, 0),
    "1": v2(-1, 0),
    "-11": v2(0, -1),
    "11": v2(0, 1),
};

/** 英雄面朝方向上，右，下，左 */
let HERO_FACE_DIRECTION: Readonly<number[]> = [-11, 1, 11, -1];

export class MapCollisionSystem {
    private gameMap: GameMap = null!;
    private hero: Hero = null!;
    private HeroModel: HeroModel = null!;
    private levelData: LevelData = null!;
    private canEndMoveTiles: Readonly<string[]> = ["prop", "stair"];
    private monsterFightSystem: MonsterFightSystem = new MonsterFightSystem();
    private npcInteractiveSystem: NpcInteractiveSystem = new NpcInteractiveSystem();
    private gameEventSystem: GameEventSystem = new GameEventSystem();
    private levelEvent: any = {};
    private dialogPos: Vec3 = null!;

    init(gameMap: GameMap, hero: Hero) {
        this.gameMap = gameMap;
        this.hero = hero;
        this.HeroModel = hero.HeroModel;
        let mapData = GameManager.DATA.getData(MapData)!;
        this.levelData = mapData.getCurrentLevelData();
        this.registerEvent();
        if (!this.dialogPos) {
            this.dialogPos = this.gameMap.getComponent(UITransform)?.convertToWorldSpaceAR(Vec3.ZERO)!;
        }
    }

    private registerEvent() {
        if (!NotifyCenter.hasEventListener(GameEvent.MONSTER_DIE, this.onMonsterDie, this)) {
            NotifyCenter.on(GameEvent.MONSTER_DIE, this.onMonsterDie, this);
        }
    }

    private onMonsterDie(monster: Monster, magic: boolean) {
        //幸运金币
        let ratio = this.HeroModel.getPropNum(PropType.LUCKY_GOLD) ? 2 : 1;
        this.HeroModel.setAttrDiff(HeroAttr.GOLD, monster.monsterInfo.gold * ratio);
        this.disappear("monster", monster.index);
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

    private getTileOrIndex(tileOrIndex: Vec2 | number) {
        let tile: Vec2 | null = null;
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

    appear(layerName: string, tileOrIndex: Vec2 | number, id: number, record: boolean = true) {
        let json = Utility.Json.getJsonElement(layerName, id) as any;
        if (json) {
            let { index, tile } = this.getTileOrIndex(tileOrIndex);
            let gid = this.gameMap.getGidByName(`${json.spriteId}_0`);
            if (gid) {
                this.gameMap.setTileGIDAt(layerName, tile, gid);
                record && this.levelData.setAppear(layerName, index, gid);
            } else {
                console.error("appear gid 找不到");
            }
        } else {
            console.error("appear error id:", id);
        }
    }

    disappear(layerName: string, tileOrIndex: Vec2 | number, record: boolean = true) {
        let { index, tile } = this.getTileOrIndex(tileOrIndex);
        this.gameMap.setTileGIDAt(layerName, tile, 0);
        record && this.levelData.setDisappear(layerName, index);
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
            console.error("move gid 找不到");
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
        return await GameManager.POOL.createPoolNode(`Prefabs/Elements/ElementNode`);
    }

    private async createDoorAnimation(id: number | string, tile: Vec2, reverse: boolean, callback: Function | null = null) {
        let name = reverse ? "DoorAnimationReverseNode" : "DoorAnimationNode";
        let node = await GameManager.POOL.createPoolNode(`Prefabs/Elements/${name}`);
        if (node) {
            let position = this.gameMap.getPositionAt(tile);
            node.position = v3(position?.x, position?.y);
            node.parent = this.gameMap.node;
            (node.getComponent(name) as any).init(`door${id}`, callback);
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
                return GameManager.DATA.getJsonParser(layerName)?.getJsonElementByKey("spriteId", name);
            default:
                return null;
        }
    }

    /**
     * 英雄和地图元素的交互
     * @param tile 交互坐标
     * @returns true表示交互结束，false表示交互正在进行
     */
    collision(tile: Vec2) {
        let { layerName, spriteName } = this.gameMap.getTileInfo(tile);
        if (!layerName) return true;
        let jsonData = this.getJsonData(layerName, spriteName);
        switch (layerName) {
            case "prop":
                {
                    GameManager.AUDIO.playEffect("eat");
                    this.HeroModel.addProp(jsonData.id, this.levelData.level);
                    this.disappear(layerName, tile);
                }
                return true;
            case "door":
                //这里只处理可见的门逻辑
                return this.doorCollision(tile, layerName);
            case "stair":
                let stair = this.levelData.getStair(spriteName == "stair_down" ? StairType.Down : StairType.UP);
                if (stair) {
                    let mapData = GameManager.DATA.getData(MapData)!;
                    mapData.setLevelDiff(stair.levelDiff);
                    return true;
                }
                break;
            case "monster":
                {
                    if (!CalculateSystem.canHeroAttack(this.HeroModel, jsonData, !jsonData.firstAttack)) {
                        GameManager.UI.showToast(`你打不过${jsonData.name}`);
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

    private doorCollision(tile: Vec2, layerName: string) {
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
            if (keyID && this.HeroModel.getPropNum(keyID) > 0) {
                this.HeroModel.addProp(keyID, 1, -1);
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
        //if (keyId && this.HeroModel.getPropNum(keyId) > 0) {
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
     * 是否终点tile可以移动
     * @param tile tile坐标
     */
    canEndTileMove(tile: Vec2) {
        let { layerName, spriteName } = this.gameMap.getTileInfo(tile);
        switch (layerName) {
            case "floor":
                if (this.levelData.level >= 40) {
                    return this.HeroModel.getAttr(HeroAttr.HP) > this.getWizardMagicDamage(this.gameMap.getTileIndex(tile));
                }
                return true;
            case "monster":
                let jsonData = this.getJsonData(layerName, spriteName);
                return CalculateSystem.canHeroAttack(this.HeroModel, jsonData, !jsonData.firstAttack);
        }
        return this.canEndMoveTiles.includes(layerName!);
    }

    /** 勇士在楼梯旁边 */
    isHeroNextToStair() {
        let stairs: Stair[] = this.levelData.getLayerInfo("stairs");
        if (stairs) {
            stairs.forEach((stair) => {
                let diff = Math.abs(stair.index - this.gameMap.getTileIndex(this.HeroModel.getPosition()));
                if (INDEX_DIFFS.indexOf(diff) != -1) {
                    return true;
                }
            });
        }
        return false;
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

    private changePathCoord(path: Vec2[]) {
        for (let i = 0; i < path.length; i++) {
            path[i] = this.gameMap.getPositionAt(path[i])!;
        }
        return path;
    }

    private gotoShop() {
        let shopData = GameManager.DATA.getData(ShopData)!;
        shopData.level = this.levelData.level;
        GameManager.UI.showDialog("ShopDialog", shopData, this.HeroModel.getAttr(HeroAttr.GOLD), (attr: string) => {
            switch (attr) {
                case "hp":
                    this.HeroModel.setAttrDiff(HeroAttr.HP, shopData.hp);
                    break;
                case "attack":
                    this.HeroModel.setAttrDiff(HeroAttr.ATTACK, shopData.attack);
                    break;
                case "defence":
                    this.HeroModel.setAttrDiff(HeroAttr.DEFENCE, shopData.defence);
                    break;
                default:
                    break;
            }
            if (attr != "no") {
                this.HeroModel.setAttrDiff(HeroAttr.GOLD, shopData.buy());
            }
            this.elementActionComplete();
        }).then((control: any) => {
            //control.node.position = this._dialogPos;
        });
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
        //if (!this.HeroModel.equipedDivineShield()) {
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
        if (!this.HeroModel.equipedDivineShield()) {
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

        //if (!this.HeroModel.equipedDivineShield()) {
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
        //if (this.HeroModel.Hp <= wizardDamage) {
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

    removeHeroFaceWall() {
        //let HeroModel = this.HeroModel;
        //let direction = HeroModel.Direction;
        //let index = this.tileToIndex(HeroModel.Position) + HERO_FACE_DIRECTION[direction];
        //let element = this.getElement(index, "wall");
        //if (element && element.isWall()) {
        //this.removeElement(index, "wall");
        //return true;
        //}
        //return false;
    }
    removeAllWalls() {
        //let wallLayer = this.layers["wall"];
        //let length = Object.keys(wallLayer).length;
        //for (let index in wallLayer) {
        //if (wallLayer[index].isWall()) {
        //this.removeElement(index, "wall");
        //}
        //}
        //return length > 0;
    }
    removeLava() {
        //let heroIndex = this.tileToIndex(this.HeroModel.Position);
        //HERO_FACE_DIRECTION.forEach((diff) => {
        //let index = heroIndex + diff;
        //let element = this.getElement(index, "wall");
        //if (element && element.isLava()) {
        //this.removeElement(index, "wall");
        //}
        //});
    }

    bomb() {
        //let heroIndex = this.tileToIndex(this.HeroModel.Position);
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
    removeYellowDoors() {
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
    centrosymmetricFly() {
        //let tile = this.HeroModel.Position;
        //let newTile = cc.v2(this.mapData.column - tile.x - 1, this.mapData.row - tile.y - 1);
        //if (this.getElement(this.tileToIndex(newTile)) == null) {
        //this.hero.location(newTile);
        //return true;
        //}
        //return false;
    }

    // getSwitchLevel(stair: Stair) {
    //     let symbol = stair.stairType == "up" ? 1 : -1;
    //     return this.level + symbol * stair.levelDiff;
    // }
    // switchLevelHero(stairType: string) {
    //     if (this.showMap()) {
    //         let standIndex = currentMap.getStair(stairType).standIndex;
    //         this.showHero(currentMap.indexToTile(standIndex));
    //     }
    // }
    // private switchLevel(stair: Stair) {
    //     this.level = this.getSwitchLevel(stair);
    //     //上了楼，勇士站在下楼梯的旁边
    //     this.switchLevelHero(stair.stairType == "up" ? "down" : "up");
    // }

    // switchLevelTip(swtichType: string) {
    //     let tip = null;
    //     if (swtichType == "down" && this.level == 1) {
    //         tip = "你已经到最下面一层了";
    //     } else if (swtichType == "up" && this.level == 50) {
    //         tip = "你已经到最上面一层了";
    //     }
    //     if (tip) {
    //         GameManager.UI.showToast(tip);
    //         return true;
    //     }
    //     return false;
    // }

    useProp(propInfo: any, extraInfo: any) {
        switch (propInfo.type) {
            case 7:
                //currentMap.showDialog("MonsterHandBook", currentMap.getMonsters());
                break;
            case 8:
                //currentMap.showDialog("RecordBook");
                break;
            case PropType.FLYING_WAND:
                {
                    //飞行魔杖
                    // if (this.isHeroNextToStair()) {
                    //     if (this.switchLevelTip(extraInfo)) {
                    //         return;
                    //     }
                    //     let stair = currentMap.getStair(extraInfo);
                    //     if (this.maps[this.getSwitchLevel(stair)]) {
                    //         this.switchLevel(stair);
                    //     }
                    // } else {
                    //     GameManager.UI.showToast("在楼梯旁边才可以使用");
                    // }
                }
                break;
            case 10:
                {
                    // if (currentMap.removeHeroFaceWall()) {
                    //     this.consumptionProp(propInfo);
                    // }
                }
                break;
            case 11:
                {
                    // if (currentMap.removeAllWalls()) {
                    //     this.consumptionProp(propInfo);
                    // }
                }
                break;
            case 12:
                {
                    // currentMap.removeLava();
                }
                break;
            case 13:
                {
                    // if (currentMap.bomb()) {
                    //     this.consumptionProp(propInfo);
                    // }
                }
                break;
            case 14:
                {
                    // if (currentMap.removeYellowDoors()) {
                    //     this.consumptionProp(propInfo);
                    // }
                }
                break;
            case 15:
                {
                    // this.HeroModel.Hp += this.HeroModel.Attack + this.HeroModel.Defence;
                    // NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
                    // this.consumptionProp(propInfo);
                }
                break;
            case 18:
                {
                    // if (this.switchLevelTip(propInfo.value == 1 ? "up" : "down")) {
                    //     return;
                    // }
                    // this.level = this.level + propInfo.value;
                    // this.switchLevelHero(propInfo.value == 1 ? "down" : "up");
                    // this.consumptionProp(propInfo);
                }
                break;
            case 19:
                {
                    //中心对称飞行棋
                    // if (currentMap.centrosymmetricFly()) {
                    //     this.consumptionProp(propInfo);
                    // }
                }
                break;
        }
    }

    // consumptionProp(propInfo: any) {
    //     if (!propInfo.permanent) {
    //         this.HeroModel.addProp(propInfo.id, -1);
    //         NotifyCenter.emit(GameEvent.REFRESH_PROP, propInfo, -1);
    //     }
    // }
}
