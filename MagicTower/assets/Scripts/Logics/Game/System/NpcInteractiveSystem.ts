import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { HeroAttr } from "../../../Model/HeroModel/HeroAttr";
import { HeroModel } from "../../../Model/HeroModel/HeroModel";
import { Npc } from "../../../Model/MapModel/Data/Elements/Npc";
import { MapCollisionSystem } from "./MapCollisionSystem";

@CommandManager.register("NpcInteractiveSystem")
export class NpcInteractiveSystem extends SystemBase {
    private npc: Npc = null!;
    private heroModel: HeroModel = null!;
    private mapCollisionSystem: MapCollisionSystem = null!;

    initliaze(npc: Npc, mapCollisionSystem: MapCollisionSystem) {
        this.npc = npc;
        this.mapCollisionSystem = mapCollisionSystem;
        this.heroModel = GameApp.getModel(HeroModel);
    }

    execute() {
        if (this.npc.canTrade()) {
            //物品交易
            // this.map.showDialog("RewardDialog", this.npc, (accept: boolean) => {
            //     if (accept) {
            //         this.npcTrade();
            //         this.interactiveComplete();
            //         this.npc.nextTalk();
            //     }
            //     GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
            // });
        } else {
            let info = this.npc.talk();
            this.npc.nextTalk();
            if (typeof info.index != "string") {
                this.heroModel.recordTalk(parseInt(this.npc.npcInfo.id), info.index);
            }

            let npcInfo = this.npc.npcInfo;
            // this.map.showDialog("ChatDialog", info.talk, () => {
            //     //小偷
            //     if (npcInfo.type == 1) {
            //         //如果有事件聊天
            //         if (npcInfo.eventTalk) {
            //             GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
            //         } else {
            //             this.npcMove();
            //         }
            //     } else {
            //         this.interactiveComplete();
            //         GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
            //     }
            // });
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
                //GameManager.getInstance().showToast("你的钱不够");
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
                //GameManager.getInstance().showToast("物品数量不够");
            }
        } else if (npcPropInfo.prop) {
            for (let i = 0; i < npcPropInfo.prop.length; i += 2) {
                this.heroModel.addProp(npcPropInfo.prop[i], 0, npcPropInfo.prop[i + 1]);
            }
        }
    }
    private npcMove() {
        // let wallIndex = this.npc.getWallIndex();
        // let delay = 0;
        // if (wallIndex) {
        //     delay = 0.2;
        //     this.map.removeElement(wallIndex, "door");
        // }
        // let moveIndex = this.npc.move();
        // let npcInfo = this.npc.npcInfo;
        // if (moveIndex) {
        //     let path = CommonAstar.getPath(this.map, this.map.indexToTile(this.index), this.map.indexToTile(moveIndex));
        //     if (path) {
        //         tween(this.npc.node)
        //             .delay(delay)
        //             .call(() => {
        //                 this.npc.movePath(this.map.changePathCoord(path)).then((resolve) => {
        //                     if (this.npc.moveEnd()) {
        //                         this.map.removeElement(this.index, "npc");
        //                         if (npcInfo.event) {
        //                             this.map.eventCollision(npcInfo.event);
        //                         }
        //                     } else {
        //                         //转移小偷位置
        //                         this.map.changeElementInfo(this.index, moveIndex, "npc", this.npc);
        //                     }
        //                     GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
        //                 });
        //             })
        //             .start();
        //     }
        // } else if (npcInfo.event) {
        //     this.map.eventCollision(npcInfo.event);
        //     GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
        // }
    }

    private interactiveComplete() {
        // if (this.npc.talkEnd()) {
        //     this.map.removeElement(this.index, "npc");
        // }
    }

    clear(): void {
        this.npc = null!;
        this.heroModel = null!;
        this.mapCollisionSystem = null!;
    }
}
