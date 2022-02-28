import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { UIFactory } from "../../../../GameFramework/Scripts/Application/UI/UIFactory";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { Door } from "../../../Model/MapModel/Data/Elements/Door";
import { EventInfo } from "../../../Model/MapModel/Data/Elements/EventInfo";
import { Monster } from "../../../Model/MapModel/Data/Elements/Monster";
import { Npc } from "../../../Model/MapModel/Data/Elements/Npc";
import { Stair } from "../../../Model/MapModel/Data/Elements/Stair";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { MapModel } from "../../../Model/MapModel/MapModel";
import { CollisionEventArgs } from "../../Event/CollisionEventArgs";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { DisappearOrAppearEventArgs } from "../../Event/DisappearOrAppearEventArgs";
import { EventCollisionEventArgs } from "../../Event/EventCollisionEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { MonsterDieEventArgs } from "../../Event/MonsterDieEventArgs";
import { MoveEventArgs } from "../../Event/MoveEventArgs";
import { SpecialMoveEventArgs } from "../../Event/SpecialMoveEventArgs";
import { IGameMap } from "../Map/GameMap/IGameMap";
import { Hero } from "../Map/Hero/Hero";
import { DoorSystem } from "./DoorSystem";
import { GameEventSystem } from "./GameEventSystem";
import { MonsterFightSystem } from "./MonsterFightSystem";
import { MoveSystem } from "./MoveSystem";
import { NpcInteractiveSystem } from "./NpcInteractiveSystem";
import { UsePropSystem } from "./UsePropSystem";

@CommandManager.register("MapCollisionSystem")
export class MapCollisionSystem extends SystemBase {
    private gameMap: IGameMap = null!;
    private hero: Hero = null!;
    private mapModel: MapModel = null!;
    private levelData: LevelData = null!;

    private monsterFightSystem: MonsterFightSystem = null!;
    private npcInteractiveSystem: NpcInteractiveSystem = null!;
    private gameEventSystem: GameEventSystem = null!;
    private moveSystem: MoveSystem = null!;
    private usePropSystem: UsePropSystem = null!;
    private doorSystem: DoorSystem = null!;

    awake(): void {
        this.monsterFightSystem = GameApp.CommandManager.createSystem(MonsterFightSystem);
        this.npcInteractiveSystem = GameApp.CommandManager.createSystem(NpcInteractiveSystem);
        this.gameEventSystem = GameApp.CommandManager.createSystem(GameEventSystem);
        this.moveSystem = GameApp.CommandManager.createSystem(MoveSystem);
        this.usePropSystem = GameApp.CommandManager.createSystem(UsePropSystem);
        this.doorSystem = GameApp.CommandManager.createSystem(DoorSystem);

        this.mapModel = GameApp.getModel(MapModel);

        this.registerEvent();
    }

    clear(): void {
        GameApp.EventManager.unsubscribeTarget(this);
        GameApp.CommandManager.destroySystem(this.monsterFightSystem);
        GameApp.CommandManager.destroySystem(this.npcInteractiveSystem);
        GameApp.CommandManager.destroySystem(this.gameEventSystem);
        GameApp.CommandManager.destroySystem(this.moveSystem);
        GameApp.CommandManager.destroySystem(this.usePropSystem);
        GameApp.CommandManager.destroySystem(this.doorSystem);
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
        let layerInfo = this.levelData.getLayerElementWithoutName(this.gameMap.getTileIndex(tile));
        if (layerInfo) {
            switch (layerInfo.layerName) {
                case "door": {
                    let door = layerInfo.element as Door;
                    if (!door.hide) {
                        return this.doorSystem.doorCollision(door);
                    } else {
                        return true;
                    }
                }
                case "monster":
                    this.monsterFightSystem.initliaze(this.hero, layerInfo.element as Monster, this.levelData);
                    return this.monsterFightSystem.execute();
                case "stair":
                    {
                        let stair = layerInfo.element as Stair;
                        if (!stair.hide) {
                            this.mapModel.setLevelDiff(stair.levelDiff);
                        }
                    }
                    return true;
                case "npc":
                    this.npcInteractiveSystem.initliaze(layerInfo.element as Npc, this.levelData);
                    this.npcInteractiveSystem.execute();
                    return false;
                default:
                    GameFrameworkLog.error(`${layerInfo.layerName} does not handle function`);
                    break;
            }
        } else {
            let tileInfo = this.gameMap.getTileInfo(tile);
            if (tileInfo) {
                switch (tileInfo.layerName) {
                    case "prop":
                        return this.usePropSystem.eatProp(tileInfo.layerName, tile, tileInfo.spriteName);
                    case "building":
                        UIFactory.showDialog("Prefab/Dialogs/ShopDialog", this.levelData.level);
                        return false;
                    case "floor":
                        return this.floorCollision(tile);
                }
            }

            GameFrameworkLog.error(`unknown layer does not handle function`);
        }

        return true;
    }

    private registerEvent() {
        let eventManager = GameApp.EventManager;
        eventManager.subscribe(GameEvent.MONSTER_DIE, this.onMonsterDie, this);
        eventManager.subscribe(GameEvent.COMMAND_APPEAR, this.onCommandAppear, this);
        eventManager.subscribe(GameEvent.COMMAND_DISAPPEAR, this.onCommandDisappear, this);
        eventManager.subscribe(GameEvent.COMMAND_EVENT, this.onCommandEvent, this);
        eventManager.subscribe(GameEvent.COMMAND_MOVE, this.onCommandMove, this);
        eventManager.subscribe(GameEvent.COMMAND_SPECIAL_MOVE, this.onCommandSpecialMove, this);
        eventManager.subscribe(GameEvent.COMMAND_COLLISION, this.onCommandCollision, this);
    }

    private onMonsterDie(sender: object, eventArgs: MonsterDieEventArgs) {
        this.elementActionComplete();
        //this.removeMagicHurt(index, monster);
        // if (monster.monsterInfo.big) {
        //     this.monsterInfo.bigMonster = null;
        // }

        //if (this.gameEventSystem && !this.gameEventSystem.executeComplete()) {
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

    private onCommandMove(sender: object, eventArgs: MoveEventArgs) {
        this.moveSystem.move(eventArgs.layerName, eventArgs.src, eventArgs.dst, eventArgs.speed, eventArgs.delay, eventArgs.moveCompleteCallback);
    }

    private onCommandSpecialMove(sender: object, eventArgs: SpecialMoveEventArgs) {
        this.moveSystem.specialMove(eventArgs.specialMoveInfo);
    }

    private onCommandCollision(sender: object, eventArgs: CollisionEventArgs) {
        let tile: IVec2 | null = null;
        if (typeof eventArgs.collisionTileOrIndex == "number") {
            tile = this.gameMap.getTile(eventArgs.collisionTileOrIndex);
        } else {
            tile = eventArgs.collisionTileOrIndex;
        }
        this.collision(tile);
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

    private eventCollision(eventID: number | string | IVec2) {
        let eventIdOrEventInfo: number | string | EventInfo | null = null;
        if (typeof eventID == "number" || typeof eventID == "string") {
            eventIdOrEventInfo = eventID;
        } else {
            let index = this.gameMap.getTileIndex(eventID);
            let eventInfo = this.levelData.getLayerElement<EventInfo>("event", index);
            if (eventInfo) {
                eventIdOrEventInfo = eventInfo;
            }
        }

        if (eventIdOrEventInfo) {
            this.gameEventSystem.initliaze(this.gameMap, this.hero, eventIdOrEventInfo, this.levelData);
            this.gameEventSystem.execute();
            return false;
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
        // if (!this.heroModel.equipedDivineShield()) {
        //     // if (this.monsterInfo.magicHurt.wizard) {
        //     //     let hurtInfo = this.monsterInfo.magicHurt.wizard[index];
        //     //     if (hurtInfo) {
        //     //         hurtInfo.forEach((monsterIndex) => {
        //     //             let element = this.getElement(monsterIndex, "monster");
        //     //             totalDamage += element.monsterInfo.magicAttack;
        //     //         });
        //     //     }
        //     // }
        // }
        return totalDamage;
    }

    private floorCollision(tile: IVec2) {
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
}
