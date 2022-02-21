import { v2, Vec2, Vec3 } from "cc";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { UIFactory } from "../../../../GameFramework/Scripts/Application/UI/UIFactory";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { PropType } from "../../../Model/HeroModel/Prop";
import { Element } from "../../../Model/MapModel/Data/Elements/Element";
import { EventInfo } from "../../../Model/MapModel/Data/Elements/EventInfo";
import { Monster, MonsterInfo } from "../../../Model/MapModel/Data/Elements/Monster";
import { Npc, NpcInfo } from "../../../Model/MapModel/Data/Elements/Npc";
import { StairType } from "../../../Model/MapModel/Data/Elements/Stair";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { MapModel } from "../../../Model/MapModel/MapModel";
import { ShopModel } from "../../../Model/ShopModel/ShopModel";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { DisappearOrAppearEventArgs } from "../../Event/DisappearOrAppearEventArgs";
import { EventCollisionEventArgs } from "../../Event/EventCollisionEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { MonsterDieEventArgs } from "../../Event/MonsterDieEventArgs";
import { ElementFactory } from "../Map/ElementFactory";
import { IGameMap } from "../Map/GameMap/IGameMap";
import { Hero } from "../Map/Hero/Hero";
import { CalculateSystem } from "./CalculateSystem";
import { DoorSystem } from "./DoorSystem";
import { GameEventSystem } from "./GameEventSystem";
import { MonsterFightSystem } from "./MonsterFightSystem";
import { MoveSystem } from "./MoveSystem";
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
    private doorSystem: DoorSystem = null!;
    private levelEvent: any = {};
    private dialogPos: Vec3 = null!;

    awake(): void {
        this.monsterFightSystem = GameApp.CommandManager.createSystem(MonsterFightSystem);
        this.npcInteractiveSystem = GameApp.CommandManager.createSystem(NpcInteractiveSystem);
        this.gameEventSystem = GameApp.CommandManager.createSystem(GameEventSystem);
        this.moveSystem = GameApp.CommandManager.createSystem(MoveSystem);
        this.usePropSystem = GameApp.CommandManager.createSystem(UsePropSystem);
        this.doorSystem = GameApp.CommandManager.createSystem(DoorSystem);

        this.heroModel = GameApp.getModel(HeroModel);
        this.mapModel = GameApp.getModel(MapModel);

        this.registerEvent();
        ElementFactory.initliaze();
    }

    initliaze(gameMap: IGameMap, hero: Hero) {
        this.gameMap = gameMap;
        this.hero = hero;
        this.levelData = this.mapModel.getCurrentLevelData();
        this.moveSystem.initliaze(this.gameMap, this.levelData, hero);
        this.doorSystem.initliaze(this.gameMap, this.levelData);
        this.usePropSystem.initliaze(this.gameMap);
    }

    moveHero(position: IVec2) {
        this.moveSystem.moveHero(position, this.collision.bind(this));
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
                if (jsonData) {
                    this.eatProp(layerName, tile, jsonData.id);
                    return true;
                } else {
                    GameFrameworkLog.error("prop json is not exist");
                }
                break;
            case "door":
                //这里只处理可见的门逻辑
                return this.doorSystem.doorCollision(tile, layerName);
            case "stair":
                return this.goStair(spriteName!);
            case "monster":
                if (jsonData) {
                    return this.fightMonster(jsonData, tile);
                } else {
                    GameFrameworkLog.error("monster json is not exist");
                }
                break;
            case "npc":
                if (jsonData) {
                    return this.interactiveNpc(jsonData, tile);
                } else {
                    GameFrameworkLog.error("npc json is not exist");
                }
                break;
            case "building":
                this.gotoShop();
                break;
            case "floor":
                return this.floorCollision(tile);
            default:
                return true;
        }
        return false;
    }

    private registerEvent() {
        let eventManager = GameApp.EventManager;
        eventManager.subscribe(GameEvent.MONSTER_DIE, this.onMonsterDie, this);
        eventManager.subscribe(GameEvent.COMMAND_APPEAR, this.onCommandAppear, this);
        eventManager.subscribe(GameEvent.COMMAND_DISAPPEAR, this.onCommandDisappear, this);
        eventManager.subscribe(GameEvent.COMMAND_EVENT, this.onCommandEvent, this);
    }

    private onMonsterDie(sender: object, eventArgs: MonsterDieEventArgs) {
        //幸运金币
        let ratio = this.heroModel.getPropNum(PropType.LUCKY_GOLD) ? 2 : 1;
        this.heroModel.setAttrDiff(HeroAttr.GOLD, eventArgs.monster.monsterInfo.gold * ratio);
        this.disappear("monster", eventArgs.monster.index);
        ElementFactory.releaseElementData(eventArgs.monster);
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

    private onCommandAppear(sender: object, eventArgs: DisappearOrAppearEventArgs) {
        this.appear(eventArgs.layerName, eventArgs.tileOrIndex, eventArgs.elementId, eventArgs.record);
    }

    private onCommandDisappear(sender: object, eventArgs: DisappearOrAppearEventArgs) {
        this.disappear(eventArgs.layerName, eventArgs.tileOrIndex, eventArgs.record);
    }

    private onCommandEvent(sender: object, eventArgs: EventCollisionEventArgs) {
        this.eventCollision(eventArgs.eventIdOrTile);
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

    private appear(layerName: string, tileOrIndex: IVec2 | number, id: number, record: boolean = true) {
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

    private disappear(layerName: string, tileOrIndex: IVec2 | number, record: boolean = true) {
        let { index, tile } = this.getTileOrIndex(tileOrIndex);
        if (tile) {
            this.gameMap.setTileGIDAt(layerName, tile, 0);
        }
        record && this.levelData.setDisappear(layerName, index);
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

    private eatProp(layerName: string, tile: IVec2, id: number) {
        GameApp.SoundManager.playSound("Sound/eat");
        this.heroModel.addProp(id, this.levelData.level);
        this.disappear(layerName, tile);
    }

    private goStair(spriteName: string) {
        let stair = this.levelData.getStair(spriteName == "stair_down" ? StairType.Down : StairType.UP);
        if (stair) {
            this.mapModel.setLevelDiff(stair.levelDiff);
            return true;
        }

        return false;
    }

    private fightMonster(monsterJson: MonsterInfo, tile: IVec2) {
        if (!CalculateSystem.canHeroAttack(this.heroModel, monsterJson, !monsterJson.firstAttack)) {
            UIFactory.showToast(`你打不过${monsterJson.name}`);
            return true;
        }

        let monster = ElementFactory.createElementData(Monster, "monster");
        monster.id = parseInt(monsterJson.id);
        monster.index = this.gameMap.getTileIndex(tile);
        this.monsterFightSystem.initliaze(this.hero, monster);
        this.monsterFightSystem.execute(/*this.haveMagicHurt(index)*/ false);
        return false;
    }

    private interactiveNpc(npcJson: NpcInfo, tile: IVec2) {
        let npc = ElementFactory.createElementData(Npc, "npc");
        npc.id = parseInt(npcJson.id);
        npc.index = this.gameMap.getTileIndex(tile);
        this.npcInteractiveSystem.initliaze(npc, this);
        this.npcInteractiveSystem.execute();
        return false;
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

    eventCollision(eventID: number | string | IVec2) {
        let id: number | string | null = null;
        if (typeof eventID == "number" || typeof eventID == "string") {
            id = eventID;
        } else {
            let index = this.gameMap.getTileIndex(eventID);
            let eventInfo = this.levelData.getLayerInfo("event");
            if (eventInfo) {
                let event: Element = eventInfo[index];
                if (event) {
                    id = event.id;
                }
            }
        }

        if (id) {
            let eventInfo = Utility.Json.getJsonElement("event", id) as any;
            if (!eventInfo.save || eventInfo.save == this.levelData.level) {
                this.gameEventSystem.initliaze(this.gameMap, id, this.levelData);
                this.gameEventSystem.execute();
                return false;
            } else {
                this.levelEvent[eventInfo.save] = id;
            }
        }
        return true;
    }

    show() {
        //跨层事件
        //let eventID = this.eventInfo.get(this.mapData.level);
        //if (eventID) {
        //this.excuteEvent(eventID);
        //this.eventInfo.clear(this.mapData.level);
        //}
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

    private floorCollision(tile: IVec2) {
        let eventInfo = this.levelData.getLayerElement<EventInfo>("event", this.gameMap.getTileIndex(tile));
        if (eventInfo) {
            return this.eventCollision(tile);
        }

        if (!this.doorSystem.invisibleDoorCollision(tile)) {
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
        GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
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
        GameApp.CommandManager.destroySystem(this.doorSystem);
        ElementFactory.clear();
    }
}
