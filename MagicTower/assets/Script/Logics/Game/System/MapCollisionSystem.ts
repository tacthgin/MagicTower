import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { UIFactory } from "../../../../GameFramework/Application/UI/UIFactory";
import { IVec2 } from "../../../../GameFramework/Script/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../../GameFramework/Script/Base/Log/GameFrameworkLog";
import { CommandManager } from "../../../../GameFramework/Script/MVC/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Script/MVC/Command/SystemBase";
import { Utility } from "../../../../GameFramework/Script/Utility/Utility";
import { Door } from "../../../Model/MapModel/Data/Elements/Door";
import { Element } from "../../../Model/MapModel/Data/Elements/Element";
import { EventInfo } from "../../../Model/MapModel/Data/Elements/EventInfo";
import { Monster } from "../../../Model/MapModel/Data/Elements/Monster";
import { Npc } from "../../../Model/MapModel/Data/Elements/Npc";
import { Stair } from "../../../Model/MapModel/Data/Elements/Stair";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { MapModel } from "../../../Model/MapModel/MapModel";
import { CollisionEventArgs } from "../../Event/CollisionEventArgs";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { DisappearOrAppearEventArgs, DisappearOrAppearState } from "../../Event/DisappearOrAppearEventArgs";
import { EventCollisionEventArgs } from "../../Event/EventCollisionEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { MonsterDieEventArgs } from "../../Event/MonsterDieEventArgs";
import { MoveEventArgs } from "../../Event/MoveEventArgs";
import { ShowEventArgs } from "../../Event/ShowEventArgs";
import { SpecialMoveEventArgs } from "../../Event/SpecialMoveEventArgs";
import { IGameMap } from "../Map/GameMap/IGameMap";
import { Hero } from "../Map/Hero/Hero";
import { DamageSystem } from "./DamageSystem";
import { DoorSystem } from "./DoorSystem";
import { GameEventSystem } from "./GameEventSystem";
import { MonsterFightSystem } from "./MonsterFightSystem";
import { MoveSystem } from "./MoveSystem";
import { NpcInteractiveSystem } from "./NpcInteractiveSystem";
import { UsePropSystem } from "./UsePropSystem";

@CommandManager.registerSystem("MapCollisionSystem", true)
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
    private damageSystem: DamageSystem = null!;

    constructor() {
        super();
    }

    awake(): void {
        this.monsterFightSystem = GameApp.CommandManager.createSystem(MonsterFightSystem);
        this.npcInteractiveSystem = GameApp.CommandManager.createSystem(NpcInteractiveSystem);
        this.gameEventSystem = GameApp.CommandManager.createSystem(GameEventSystem);
        this.moveSystem = GameApp.CommandManager.createSystem(MoveSystem);
        this.usePropSystem = GameApp.CommandManager.createSystem(UsePropSystem);
        this.doorSystem = GameApp.CommandManager.createSystem(DoorSystem);
        this.damageSystem = GameApp.CommandManager.createSystem(DamageSystem);

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
        GameApp.CommandManager.destroySystem(this.damageSystem);

        this.gameMap = null!;
        this.hero = null!;
        this.mapModel = null!;
        this.levelData = null!;

        this.monsterFightSystem = null!;
        this.npcInteractiveSystem = null!;
        this.gameEventSystem = null!;
        this.moveSystem = null!;
        this.usePropSystem = null!;
        this.doorSystem = null!;
        this.damageSystem = null!;
    }

    initliaze(gameMap: IGameMap, hero: Hero) {
        this.gameMap = gameMap;
        this.hero = hero;
        this.levelData = this.mapModel.getCurrentLevelData();
        this.moveSystem.initliaze(this.gameMap, this.levelData, hero);
        this.doorSystem.initliaze(this.gameMap, this.levelData);
        this.usePropSystem.initliaze(this.gameMap, this.hero);
        this.damageSystem.initliaze(this.gameMap, this.hero, this.levelData);

        this.triggerLevelEvent();
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
        let index = this.gameMap.getTileIndex(tile);
        let tileInfo = this.gameMap.getTileInfo(tile);

        if (tileInfo) {
            let layerName = tileInfo.layerName;
            switch (layerName) {
                case "prop":
                    return this.usePropSystem.eatProp(layerName, tile, tileInfo.spriteName);
                case "building":
                    UIFactory.showDialog("Prefab/Dialogs/ShopDialog", this.levelData.level);
                    return false;
                default:
                    {
                        let element: Element | null = null;
                        if (layerName != "floor") {
                            element = this.levelData.getLayerElement(layerName, index);
                        } else {
                            //如果是地板的话
                            let layerInfo = this.levelData.getLayerElementWithoutName(index);
                            if (layerInfo) {
                                layerName = layerInfo.layerName;
                                element = layerInfo.element;
                            } else {
                                //剩下的是地板
                                return this.damageSystem.damageCollision(index);
                            }
                        }

                        if (element) {
                            if (element.hide) {
                                return true;
                            }
                            switch (layerName) {
                                case "door": {
                                    return this.doorSystem.doorCollision(element as Door);
                                }
                                case "monster": {
                                    this.monsterFightSystem.initliaze(this.hero, element as Monster, this.levelData);
                                    return this.monsterFightSystem.execute();
                                }
                                case "stair":
                                    {
                                        this.mapModel.setLevelDiff((element as Stair).levelDiff);
                                    }
                                    return false;
                                case "npc":
                                    this.npcInteractiveSystem.initliaze(element as Npc, this.levelData);
                                    this.npcInteractiveSystem.execute();
                                    return false;
                                case "event":
                                    return this.eventCollision(tile);
                                default:
                                    break;
                            }
                        }
                    }
                    break;
            }
        }

        return true;
    }

    private registerEvent() {
        let eventManager = GameApp.EventManager;
        eventManager.subscribe(GameEvent.COMMAND_APPEAR, this.onCommandAppear, this);
        eventManager.subscribe(GameEvent.COMMAND_DISAPPEAR, this.onCommandDisappear, this);
        eventManager.subscribe(GameEvent.COMMAND_EVENT, this.onCommandEvent, this);
        eventManager.subscribe(GameEvent.COMMAND_MOVE, this.onCommandMove, this);
        eventManager.subscribe(GameEvent.COMMAND_SPECIAL_MOVE, this.onCommandSpecialMove, this);
        eventManager.subscribe(GameEvent.COMMAND_COLLISION, this.onCommandCollision, this);
        eventManager.subscribe(GameEvent.COMMAND_SHOW, this.onCommandShow, this);
        eventManager.subscribe(GameEvent.MONSTER_DIE, this.onMonsterDie, this);
    }

    private onCommandAppear(sender: object, eventArgs: DisappearOrAppearEventArgs) {
        this.appear(eventArgs.layerName, eventArgs.tileOrIndex, eventArgs.state, eventArgs.elementId, eventArgs.callback);
    }

    private onCommandDisappear(sender: object, eventArgs: DisappearOrAppearEventArgs) {
        this.disappear(eventArgs.layerName, eventArgs.tileOrIndex, eventArgs.state, eventArgs.callback);
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
        let canMove = this.collision(tile);
        if (canMove) {
            GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
        }
    }

    private onCommandShow(sender: object, eventArgs: ShowEventArgs) {
        let index: number | null = null;
        if (typeof eventArgs.tileOrIndex == "number") {
            index = eventArgs.tileOrIndex;
        } else {
            index = this.gameMap.getTileIndex(eventArgs.tileOrIndex);
        }

        let elementInfo = this.levelData.getLayerElementWithoutName(index);
        if (elementInfo) {
            this.appear(elementInfo.layerName, elementInfo.element.index, DisappearOrAppearState.ALL, elementInfo.element.id);
        } else {
            GameFrameworkLog.error(`${index} show not exist`);
        }
    }

    private onMonsterDie(sender: object, eventArgs: MonsterDieEventArgs) {
        let collisionComplete = true;
        if (eventArgs.eventId != null) {
            //怪物事件
            this.eventCollision(eventArgs.eventId);
            collisionComplete = false;
        } else if (!this.gameEventSystem.getEventCompleteFlag()) {
            //事件进行中怪物死亡，继续执行事件
            this.gameEventSystem.execute();
            collisionComplete = false;
        }

        let magicGuardCollisionComplete = true;
        if (eventArgs.magicGuardIndex != null) {
            //收到魔法警卫伤害
            magicGuardCollisionComplete = this.collision(this.gameMap.getTile(eventArgs.magicGuardIndex));
        }

        if (collisionComplete || magicGuardCollisionComplete) {
            GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
        }
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

    private getGidBySpriteId(layerName: string, spriteId: string): number | null {
        let name = spriteId;
        if (parseInt(spriteId) == 133) {
            //懒得做动态了，对真魔王做个硬编码写死
            spriteId = "132";
        }
        switch (layerName) {
            case "npc":
            case "monster":
            case "door":
            case "wall":
                name = `${spriteId}_0`;
                break;
        }

        return this.gameMap.getGidByName(name);
    }

    private appear(layerName: string, tileOrIndex: IVec2 | number, state: DisappearOrAppearState, id: number, callback: Function | null = null) {
        let { index, tile } = this.getTileOrIndex(tileOrIndex);

        switch (layerName) {
            case "event":
                this.levelData.setAppear(layerName, index, 0, id);
                break;
            case "stair":
                {
                    let gid = this.levelData.deleteHide(layerName, index);
                    if (gid != null) {
                        this.gameMap.setTileGIDAt(layerName, tile, gid);
                    }
                }
                break;
            case "wall":
                {
                    let gid = this.getGidBySpriteId(layerName, "door1006");
                    if (gid) {
                        this.gameMap.setTileGIDAt(layerName, tile, gid);
                    }
                }
                break;
            default:
                let json = Utility.Json.getJsonElement<any>(layerName, id);
                if (json) {
                    let gid = this.getGidBySpriteId(layerName, json.spriteId);
                    if (gid) {
                        if (layerName == "door") {
                            let door = this.levelData.getLayerElement<Door>("door", index);
                            if (door) {
                                this.doorSystem.closeDoor(door, () => {
                                    this.gameMap.setTileGIDAt(layerName, tile, gid);
                                    this.levelData.setAppear(layerName, index, gid!);
                                    if (callback) {
                                        callback();
                                    } else {
                                        GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
                                    }
                                });
                            }
                        } else {
                            this.gameMap.setTileGIDAt(layerName, tile, gid);
                            this.levelData.setAppear(layerName, index, gid, id);
                        }
                    } else {
                        GameFrameworkLog.error("appear gid 找不到");
                    }
                } else {
                    GameFrameworkLog.error("appear error id:", id);
                }
                break;
        }
    }

    private disappear(layerName: string, tileOrIndex: IVec2 | number, state: DisappearOrAppearState, callback: Function | null) {
        let { index, tile } = this.getTileOrIndex(tileOrIndex);

        if (state == DisappearOrAppearState.ALL || state == DisappearOrAppearState.VIEW) {
            if (layerName == "door") {
                let door = this.levelData.getLayerElement<Door>("door", index);
                if (door) {
                    this.doorSystem.openDoor(door, callback);
                }
                this.scheduleOnce(() => {
                    this.gameMap.setTileGIDAt(layerName, tile, 0);
                }, 0);
            } else {
                this.gameMap.setTileGIDAt(layerName, tile, 0);
            }
        }

        if (state == DisappearOrAppearState.ALL || state == DisappearOrAppearState.MODEL) {
            this.levelData.setDisappear(layerName, index);
        }
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
            let canMove = this.gameEventSystem.execute();
            if (canMove) {
                GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
            }
            return canMove;
        }

        return true;
    }

    /**
     * 跨层事件
     */
    triggerLevelEvent() {
        let eventId = this.mapModel.removeLevelEvent(this.levelData.level);
        if (eventId) {
            this.eventCollision(eventId);
        }
    }
}
