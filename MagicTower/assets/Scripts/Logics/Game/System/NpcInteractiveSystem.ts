import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { UIFactory } from "../../../../GameFramework/Scripts/Application/UI/UIFactory";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { Door, DoorState } from "../../../Model/MapModel/Data/Elements/Door";
import { Npc } from "../../../Model/MapModel/Data/Elements/Npc";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { CollisionCommand } from "../Command/CollisionCommand";
import { DisappearCommand } from "../Command/DisappearCommand";
import { EventCollisionCommand } from "../Command/EventCollisionCommand";
import { MoveCommand } from "../Command/MoveCommand";

@CommandManager.register("NpcInteractiveSystem")
export class NpcInteractiveSystem extends SystemBase {
    private npc: Npc = null!;
    private heroModel: HeroModel = null!;
    private levelData: LevelData = null!;

    clear(): void {
        this.npc = null!;
        this.heroModel = null!;
        this.levelData = null!;
    }

    initliaze(npc: Npc, levelData: LevelData) {
        this.npc = npc;
        this.heroModel = GameApp.getModel(HeroModel);
        this.levelData = levelData;
    }

    execute() {
        if (this.npc.canTrade()) {
            //物品交易
            UIFactory.showDialog("Prefab/Dialogs/RewardDialog", {
                element: this.npc,
                callback: (accept: boolean) => {
                    if (accept) {
                        this.npcTrade();
                        this.interactiveComplete();
                        this.npc.nextTalk();
                    }
                    GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
                },
            });
        } else {
            let info = this.npc.talk();
            this.npc.nextTalk();
            if (typeof info.index != "string") {
                this.heroModel.recordTalk(parseInt(this.npc.npcInfo.id), info.index);
            }

            let npcInfo = this.npc.npcInfo;
            UIFactory.showDialog("Prefab/Dialogs/ChatDialog", {
                content: info.talk,
                endCallback: () => {
                    //小偷
                    if (npcInfo.type == 1) {
                        //如果有事件聊天
                        if (npcInfo.eventTalk) {
                            GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
                        } else {
                            this.npcMove();
                        }
                    } else {
                        this.interactiveComplete();
                        GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
                    }
                },
            });
        }
    }

    private npcTrade() {
        let npcPropInfo = this.npc.npcInfo.value;
        this.heroModel.setAttrDiff(HeroAttr.GOLD, npcPropInfo.gold || 0);
        if (npcPropInfo.attack) {
            this.heroModel.setAttrDiff(HeroAttr.ATTACK, npcPropInfo.attack >= 1 ? npcPropInfo.attack : this.heroModel.getAttr(HeroAttr.ATTACK) * npcPropInfo.attack);
        }
        if (npcPropInfo.defence) {
            this.heroModel.setAttrDiff(HeroAttr.DEFENCE, npcPropInfo.defence >= 1 ? npcPropInfo.defence : this.heroModel.getAttr(HeroAttr.DEFENCE) * npcPropInfo.defence);
        }
        //商人交易
        if (npcPropInfo.propGold) {
            if (this.heroModel.getAttr(HeroAttr.GOLD) + npcPropInfo.propGold < 0) {
                UIFactory.showToast("你的钱不够");
                return;
            }
            this.heroModel.setAttrDiff(HeroAttr.HP, npcPropInfo.hp || 0);
            let tradeSuccess = true;
            if (npcPropInfo.prop) {
                for (let i = 0; i < npcPropInfo.prop.length; i += 2) {
                    //如果没有物品就不能卖
                    if (npcPropInfo.prop[i + 1] < 0 && this.heroModel.getPropNum(npcPropInfo.prop[i]) <= 0) {
                        tradeSuccess = false;
                        continue;
                    }
                    this.heroModel.addProp(npcPropInfo.prop[i], 0, npcPropInfo.prop[i + 1]);
                }
            }
            if (tradeSuccess) {
                this.heroModel.setAttrDiff(HeroAttr.GOLD, npcPropInfo.propGold || 0);
                this.npc.consumeProp();
            } else {
                UIFactory.showToast("物品数量不够");
            }
        } else if (npcPropInfo.prop) {
            for (let i = 0; i < npcPropInfo.prop.length; i += 2) {
                this.heroModel.addProp(npcPropInfo.prop[i], 0, npcPropInfo.prop[i + 1]);
            }
        }
    }
    private npcMove() {
        let wallIndex = this.npc.getWallIndex();
        let delay = 0;
        if (wallIndex) {
            delay = 0.2;
            let door = this.levelData.getLayerElement<Door>("door", wallIndex);
            if (door) {
                door.normal();
                GameApp.CommandManager.createCommand(CollisionCommand).execute(wallIndex);
            }
        }

        let moveIndex = this.npc.move();
        let npcInfo = this.npc.npcInfo;
        if (moveIndex) {
            let npcSpeed = Utility.Json.getJsonElement("global", "npcSpeed") as number;
            GameApp.CommandManager.createCommand(MoveCommand).execute("npc", this.npc.index, moveIndex, npcSpeed, delay, () => {
                if (this.npc.moveEnd()) {
                    GameApp.CommandManager.createCommand(DisappearCommand).execute("npc", moveIndex!);
                    if (npcInfo.event) {
                        GameApp.CommandManager.createCommand(EventCollisionCommand).execute(npcInfo.event);
                        return;
                    }
                }
                GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
            });
        } else if (npcInfo.event) {
            GameApp.CommandManager.createCommand(EventCollisionCommand).execute(npcInfo.event);
            GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
        }
    }

    private interactiveComplete() {
        if (this.npc.talkEnd()) {
            GameApp.CommandManager.createCommand(DisappearCommand).execute("npc", this.npc.index);
        }
    }
}
