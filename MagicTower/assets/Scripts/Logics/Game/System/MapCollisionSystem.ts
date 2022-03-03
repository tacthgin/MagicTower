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
import { DisappearOrAppearEventArgs } from "../../Event/DisappearOrAppearEventArgs";
import { EventCollisionEventArgs } from "../../Event/EventCollisionEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { MoveEventArgs } from "../../Event/MoveEventArgs";
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
    private damageSystem: DamageSystem = null!;

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
        this.usePropSystem.initliaze(this.gameMap);
        this.damageSystem.initliaze(this.gameMap, this.hero, this.levelData);
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
        let layerInfo = this.levelData.getLayerElementWithoutName(index);
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
                case "event":
                    return this.eventCollision(tile);
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
                        return this.damageSystem.damageCollision(index);
                    default:
                        GameFrameworkLog.error(`${tileInfo.layerName} does not handle function`);
                        break;
                }
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
}
