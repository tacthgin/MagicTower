/**处理地图上的事件 */

import { tween } from "cc";
import { CommandManager } from "../../../../GameFramework/Scripts/Application/Command/CommandManager";
import { SystemBase } from "../../../../GameFramework/Scripts/Application/Command/SystemBase";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { Utility } from "../../../../GameFramework/Scripts/Utility/Utility";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { SceneAppearEventArgs } from "../../Event/SceneAppearEventArgs";
import { MapCollisionSystem } from "./MapCollisionSystem";

@CommandManager.register("GameEventSystem")
export class GameEventSystem extends SystemBase {
    private eventInfo: any = null;
    private chatStep: number = 0;
    private appearStep: number = 0;
    private disappearStep: number = 0;
    private moveStep: number = 0;
    private step: number = 0;
    private globalConfig: any = null;
    private collisionSystem: MapCollisionSystem = null!;

    init(collisionSystem: MapCollisionSystem, eventId: number | string) {
        this.eventInfo = Utility.Json.getJsonElement("event", eventId);
        this.globalConfig = Utility.Json.getJson("global");
        this.collisionSystem = collisionSystem;
        // if (this.eventInfo.monsterDoor) {
        // this.map.monsterDoor = this.eventInfo.monsterDoor;
        // }
        return this;
    }

    executeComplete() {
        return this.step >= this.eventInfo.step.length;
    }

    execute() {
        if (this.step < this.eventInfo.step.length) {
            let stepName = this.eventInfo.step[this.step++];
            switch (stepName) {
                case "chat":
                    this.chat();
                    break;
                case "move":
                    this.move();
                    break;
                case "specialMove":
                    this.specialMove();
                    break;
                case "disappear":
                    this.disappear();
                    break;
                case "do":
                    this.collisionSystem.collision(this.map.getTile(this.eventInfo.do));
                    break;
                case "show":
                    //this.map.getElement(this.eventInfo.show).add();
                    this.execute();
                case "appear":
                    this.appear();
                    break;
                case "beAttack":
                    this.beAttack(this.eventInfo.beAttack);
                    break;
                case "sceneDisappear":
                    this.sceneDisappear();
                    break;
                case "sceneAppear":
                    this.sceneAppear();
                    break;
                case "clearNpcEvent":
                    this.clearNpcEvent();
                    break;
                case "weak":
                    //this.map.getElement(this.eventInfo.weak[0], "monster").weak(this.eventInfo.weak[1]);
                    break;
            }
        } else {
            //this.map.clearGameEventSystem();
            GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
        }
    }

    private chat() {
        // GameManager.UI.showDialog("ChatDialog", this.eventInfo.chat[this.chatStep++], () => {
        //     this.execute();
        // }).then((control: any) => {
        //     //control.node.position = this.map.dialogPos;
        // });
    }

    private move() {
        let moveData = this.eventInfo.move[this.moveStep++];
        let movePath = moveData.path;
        for (let layer in movePath) {
            //moveinfo 格式[0, 38, 5]第一个延时，第二个当前坐标，第三个终点坐标
            let move = movePath[layer];
            move.forEach((moveInfo: number[]) => {
                this.collisionSystem.move(layer, moveInfo[1], moveInfo[2], moveData.speed, moveInfo[0]);
            });
        }
        this.scheduleOnce(this.execute, moveData.interval * moveData.speed * this.globalConfig.npcSpeed + 0.05);
    }

    private specialMove() {
        let info = this.eventInfo.specialMove;
        this.collisionSystem.specialMove(info);
        this.scheduleOnce(this.execute, info.interval);
    }

    private appear() {
        let appearInfo = this.eventInfo.appear[this.appearStep++];
        if (appearInfo.delay) {
            for (let layer in appearInfo.layer) {
                let layerInfo = appearInfo.layer[layer];
                for (let i = 0; i < layerInfo.length; i++) {
                    this.map.scheduleOnce(() => {
                        this.collisionSystem.appear(layer, layerInfo[i][0], layerInfo[i][1]);
                    }, appearInfo.delay[i]);
                }
            }
        } else {
            for (let layer in appearInfo.layer) {
                let layerInfo = appearInfo.layer[layer];
                layerInfo.forEach((elementInfo: number[]) => {
                    this.collisionSystem.appear(layer, elementInfo[0], elementInfo[1]);
                });
            }
        }

        this.scheduleOnce(this.execute, appearInfo.interval);
    }

    private disappear() {
        let info = this.eventInfo.disappear[this.disappearStep++];
        for (let layer in info) {
            info[layer].forEach((index: number) => {
                this.collisionSystem.disappear(layer, index);
            });
        }
        this.execute();
    }

    private beAttack(info: any) {
        if (info.hero) {
            this.hero.magicLight(info.hero);
        } else if (info.monster) {
            // let monster = this.map.getElement(info.monster, "monster");
            // monster.beAttack();
        }

        this.scheduleOnce(this.execute, this.globalConfig.fadeInterval + 0.05);
    }

    private sceneAppear() {
        let info = this.eventInfo.sceneAppear;
        this.hero.weak();
        GameApp.EventManager.fireNow(this, SceneAppearEventArgs.create(info[0], this.map.getTile(info[1])));
        this.execute();
    }

    private sceneDisappear() {
        tween(this.map.node!.parent!.parent)
            .to(1, { opacity: 0 })
            .call(() => {
                this.execute();
            })
            .start();
    }

    clearNpcEvent() {
        //this.map.getElement(this.eventInfo.clearNpcEvent, "npc").clearEvent();
        this.execute();
    }
}
