/**处理地图上的事件 */

import { tween, _decorator } from "cc";
import { GameEvent } from "../../../Constant/GameEvent";
import { GameMap } from "../Map/GameMap";
import { Hero } from "../Map/Actor/Hero";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { MapCollisionSystem } from "./MapCollisionSystem";

export class GameEventSystem {
    private eventInfo: any = null;
    private chatStep: number = 0;
    private appearStep: number = 0;
    private disappearStep: number = 0;
    private moveStep: number = 0;
    private step: number = 0;
    private map: GameMap = null!;
    private globalConfig: any = null;
    private hero: Hero = null!;
    private collisionSystem: MapCollisionSystem = null!;

    init(collisionSystem: MapCollisionSystem, map: GameMap, hero: Hero, eventId: number | string) {
        this.eventInfo = GameManager.DATA.getJsonElement("event", eventId);
        this.map = map;
        this.hero = hero;
        this.globalConfig = GameManager.DATA.getJson("global");
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
                    //this.map.collision(this.map.indexToTile(this.eventInfo.do));
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
            NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
        }
    }
    private chat() {
        GameManager.UI.showDialog("ChatDialog", this.eventInfo.chat[this.chatStep++], () => {
            this.execute();
        }).then((control: any) => {
            //control.node.position = this.map.dialogPos;
        });
    }

    private move() {
        let moveData = this.eventInfo.move[this.moveStep++];
        let movePath = moveData.path;
        for (let layer in movePath) {
            //moveinfo 格式[0, 38, 5]第一个延时，第二个当前坐标，第三个终点坐标
            let move = movePath[layer];
            //行走类型判断
            this.map.astarMoveType = layer;
            move.forEach((moveInfo) => {
                let path = CommonAstar.getPath(this.map, this.map.indexToTile(moveInfo[1]), this.map.indexToTile(moveInfo[2]));
                if (path) {
                    let element = this.map.getElement(moveInfo[1], layer);
                    let moveFunc = () => {
                        element.movePath(this.map.changePathCoord(path), moveData.speed).then(() => {
                            this.map.changeElementInfo(moveInfo[1], moveInfo[2], layer, element);
                        });
                    };
                    if (moveInfo[0] != 0) {
                        tween(element.node).delay(moveInfo[0]).call(moveFunc).start();
                    } else {
                        tween(element.node).call(moveFunc).start();
                    }
                }
            });
        }
        this.map.scheduleOnce(() => {
            this.execute();
        }, moveData.interval * moveData.speed * this.globalConfig.npcSpeed + 0.05);
    }

    private specialMove() {
        let info = this.eventInfo.specialMove;
        if (info.type == "spawn") {
            let actions: any = [];
            for (let actionName in info) {
                switch (actionName) {
                    case "move":
                        {
                            let tile = this.map.getTile(info[actionName].to);
                            actions.push(tween().to(info.interval, { position: this.map.getPositionAt(tile) }));
                        }
                        break;
                    case "fadeOut":
                        {
                            actions.push(tween().to(info.interval, {}));
                        }
                        break;
                }
            }
            if (info.move) {
                info.move.from.forEach((index: number) => {
                    // let element = this.map.getElement(index, "monster");
                    // tween(element.node)
                    //     .parallel(actions)
                    //     .call(() => {
                    //         this.map.removeElement(index, "monster");
                    //     })
                    //     .start();
                });
            }
            this.map.scheduleOnce(() => {
                this.execute();
            }, info.interval);
        }
    }

    getAppearClassName(layer: string) {
        if (layer == "wall") {
            return "door1006_0";
        } else {
            return layer.charAt(0).toUpperCase() + layer.slice(1);
        }
    }

    private appear() {
        let appearInfo = this.eventInfo.appear[this.appearStep++];
        if (appearInfo.delay) {
            for (let layer in appearInfo.layer) {
                let layerInfo = appearInfo.layer[layer];
                let className = this.getAppearClassName(layer);
                for (let i = 0; i < layerInfo.length; i++) {
                    let element = this.map.addElement(layerInfo[i][0], layer, className, layerInfo[i][1]);
                    element.node.active = false;
                    tween(element.node)
                        .delay(appearInfo.delay[i])
                        .call(() => {
                            element.node.active = true;
                            element.add();
                        })
                        .start();
                }
            }
        } else {
            for (let layer in appearInfo.layer) {
                let layerInfo = appearInfo.layer[layer];
                let className = this.getAppearClassName(layer);
                layerInfo.forEach((elementInfo) => {
                    let element = this.map.addElement(elementInfo[0], layer, className, elementInfo[1]);
                    element.add();
                });
            }
        }
        this.map.scheduleOnce(() => {
            this.execute();
        }, appearInfo.interval);
    }

    private disappear() {
        let info = this.eventInfo.disappear[this.disappearStep++];
        for (let layer in info) {
            info[layer].forEach((index) => {
                this.map.removeElement(index, layer);
            });
        }
        this.execute();
    }

    private beAttack(info: any) {
        if (info.hero) {
            this.hero.magicLight(info.hero);
        } else if (info.monster) {
            let monster = this.map.getElement(info.monster, "monster");
            monster.beAttack();
        }
        this.map.scheduleOnce(() => {
            this.execute();
        }, this.globalConfig.fadeInterval + 0.05);
    }

    private sceneAppear() {
        let info = this.eventInfo.sceneAppear;
        //NotifyCenter.emit(GameEvent.SCENE_APPEAR, info[0], this.map.indexToTile(info[1]));
        this.hero.weak();
        //NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
        // NotifyCenter.emit(GameEvent.REFRESH_EQUIP);
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
