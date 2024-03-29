import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { UIFactory } from "../../../../GameFramework/Application/UI/UIFactory";
import { CommandManager } from "../../../../GameFramework/Script/MVC/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Script/MVC/Command/SystemBase";
import { Utility } from "../../../../GameFramework/Script/Utility/Utility";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { Door } from "../../../Model/MapModel/Data/Elements/Door";
import { Npc } from "../../../Model/MapModel/Data/Elements/Npc";
import { LevelData } from "../../../Model/MapModel/Data/LevelData";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { DisappearOrAppearState } from "../../Event/DisappearOrAppearEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { DisappearCommand } from "../Command/DisappearCommand";
import { EventCollisionCommand } from "../Command/EventCollisionCommand";
import { MoveCommand } from "../Command/MoveCommand";

@CommandManager.registerSystem("NpcInteractiveSystem")
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
                        this.npc.nextTalk();
                        this.interactiveComplete();
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
                    switch (npcInfo.type) {
                        case 1:
                            //小偷
                            //如果有事件聊天
                            if (npcInfo.eventTalk) {
                                GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
                            } else {
                                this.npcMove();
                            }
                            break;
                        case 5:
                            //公主
                            if (npcInfo.event) {
                                GameApp.CommandManager.createCommand(EventCollisionCommand).execute(npcInfo.event);
                                this.npc.clearEvent();
                            }
                            break;
                        default:
                            this.interactiveComplete();
                            GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
                            break;
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
        if (wallIndex) {
            let door = this.levelData.getLayerElement<Door>("door", wallIndex);
            if (door) {
                GameApp.CommandManager.createCommand(DisappearCommand).execute("door", wallIndex, DisappearOrAppearState.ALL, this.npcMoveDetail.bind(this));
                return;
            }
        }

        this.npcMoveDetail();
    }

    private npcMoveDetail() {
        let moveIndex = this.npc.move();
        let npcInfo = this.npc.npcInfo;
        if (moveIndex) {
            let npcSpeed = Utility.Json.getJsonElement("global", "npcSpeed") as number;
            GameApp.CommandManager.createCommand(MoveCommand).execute("npc", this.npc.index, moveIndex, npcSpeed, 0, () => {
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
            GameApp.CommandManager.createCommand(DisappearCommand).execute("npc", this.npc.index);
            GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
        }
    }

    private interactiveComplete() {
        if (this.npc.talkEnd()) {
            GameApp.CommandManager.createCommand(DisappearCommand).execute("npc", this.npc.index);
        }
    }
}
