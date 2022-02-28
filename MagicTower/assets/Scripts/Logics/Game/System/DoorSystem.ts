import { Node, v3 } from "cc";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { GameFrameworkError } from "../../../../GameFramework/Scripts/Base/GameFrameworkError";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { PropInfo } from "../../../Model/HeroModel/Prop";
import { Door, DoorState, DoorType } from "../../../Model/MapModel/Data/Elements/Door";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { DoorOpenEventArgs } from "../../Event/DoorOpenEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { AppearCommand } from "../Command/AppearCommand";
import { DisappearCommand } from "../Command/DisappearCommand";
import { EventCollisionCommand } from "../Command/EventCollisionCommand";
import { DoorAnimationNode } from "../Elements/DoorAnimaitonNode";
import { DoorAnimationReverseNode } from "../Elements/DoorAnimaitonReverseNode";
import { IGameMap } from "../Map/GameMap/IGameMap";

@CommandManager.register("DoorSystem")
export class DoorSystem extends SystemBase {
    private gameMap: IGameMap = null!;
    private levelData: LevelData = null!;

    awake(): void {
        GameApp.NodePoolManager.createNodePool(DoorAnimationNode);
        GameApp.NodePoolManager.createNodePool(DoorAnimationReverseNode);
        GameApp.EventManager.subscribe(GameEvent.OPEN_DOOR, this.onOpenDoor, this);
    }

    clear(): void {
        super.clear();
        GameApp.NodePoolManager.destroyNodePool(DoorAnimationNode);
        GameApp.NodePoolManager.destroyNodePool(DoorAnimationReverseNode);
    }

    initliaze(gameMap: IGameMap, levelData: LevelData) {
        this.gameMap = gameMap;
        this.levelData = levelData;
    }

    /**
     * 门碰撞处理
     * @param tile 门位置
     * @param layerName 层名
     * @returns 是否该格子可走
     */
    doorCollision(doorInfo: Door) {
        if (doorInfo.isKeyDoor()) {
            //正常的钥匙门
            let propJson = Utility.Json.getJsonKeyCache<PropInfo>("prop", "value", doorInfo.id);
            if (!propJson) {
                throw new GameFrameworkError("prop json is invaild");
            }
            let keyID = parseInt(propJson.id);
            let heroModel = GameApp.getModel(HeroModel);
            if (keyID && heroModel.getPropNum(keyID) > 0) {
                heroModel.addProp(keyID, 1, -1);
                this.openDoor(doorInfo, () => {
                    let eventId = this.levelData.triggerDoorEvent(DoorState.DISAPPEAR_EVENT, doorInfo.index);
                    if (eventId) {
                        GameApp.CommandManager.createCommand(EventCollisionCommand).execute(eventId);
                    } else {
                        GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
                    }
                });
            }
        } else if (doorInfo.canWallOpen()) {
            //可以开的墙门
            this.openDoor(doorInfo);
        } else if (doorInfo.doorState == DoorState.APPEAR) {
            //隐藏的墙门
            this.closeDoor(doorInfo, () => {
                let eventId = this.levelData.triggerDoorEvent(DoorState.APPEAR_EVENT, doorInfo.index);
                if (eventId) {
                    GameApp.CommandManager.createCommand(EventCollisionCommand).execute(eventId);
                } else {
                    GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
                }
            });
        }

        return false;
    }

    private onOpenDoor(sender: object, eventArgs: DoorOpenEventArgs) {
        let doors = eventArgs.doors;
        doors.forEach((door) => {
            this.openDoor(door);
        });
    }

    private async openDoor(door: Door, callback: Function | null = null) {
        let tile = this.gameMap.getTile(door.index);
        await this.createDoorAnimation(door.id, tile, false, () => {
            if (callback) {
                callback();
            } else {
                GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
            }
        });
        GameApp.CommandManager.createCommand(DisappearCommand).execute("door", tile);
    }

    private async closeDoor(door: Door, callback: Function | null = null) {
        let tile = this.gameMap.getTile(door.index);
        await this.createDoorAnimation(door.id, tile, true, () => {
            GameApp.CommandManager.createCommand(AppearCommand).execute("door", tile, door.id);
            if (callback) {
                callback();
            } else {
                GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
            }
        });
    }

    private async createDoorAnimation(id: number | string, tile: IVec2, reverse: boolean, callback: Function | null = null) {
        let name = reverse ? "DoorAnimationReverseNode" : "DoorAnimationNode";
        let constructor = reverse ? DoorAnimationReverseNode : DoorAnimationNode;
        let node = (await GameApp.NodePoolManager.createNodeWithPath(constructor, `Prefab/Elements/${name}`)) as Node;
        if (node) {
            let position = this.gameMap.getPositionAt(tile);
            if (position) {
                node.position = v3(position.x, position.y);
                node.parent = this.gameMap.node;
                node.getComponent(constructor)?.init(`door${id}`, callback);
            }
        }
    }
}
