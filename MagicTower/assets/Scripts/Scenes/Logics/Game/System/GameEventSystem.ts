/**处理地图上的事件 */

import { _decorator } from "cc";
import { GameEvent } from "../../../Constant/GameEvent";
import { GameMap } from "../Map/GameMap";
import { Hero } from "../Map/Actor/Hero";

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

    init(eventId: number | string, map: GameMap, hero: Hero) {
        //this.eventInfo = GameManager.DATA.getJsonElement("event", eventId);
        //this.map = map;
        //this.hero = hero;
        //this.globalConfig = GameManager.DATA.getJson("global");
        //if (this.eventInfo.monsterDoor) {
        //this.map.monsterDoor = this.eventInfo.monsterDoor;
        //}
        //return this;
    }
    executeComplete() {
        //return this.step >= this.eventInfo.step.length;
    }
    execute() {
        //if (this.step < this.eventInfo.step.length) {
        //let stepName = this.eventInfo.step[this.step++];
        //switch (stepName) {
        //case "chat":
        //this.chat();
        //break;
        //case "move":
        //this.move();
        //break;
        //case "specialMove":
        //this.specialMove();
        //break;
        //case "disappear":
        //this.disappear();
        //break;
        //case "do":
        //this.map.collision(this.map.indexToTile(this.eventInfo.do));
        //break;
        //case "show":
        //this.map.getElement(this.eventInfo.show).add();
        //return this.execute();
        //case "appear":
        //this.appear();
        //break;
        //case "beAttack":
        //this.beAttack(this.eventInfo.beAttack);
        //break;
        //case "sceneDisappear":
        //this.sceneDisappear();
        //break;
        //case "sceneAppear":
        //this.sceneAppear();
        //break;
        //case "clearNpcEvent":
        //this.clearNpcEvent();
        //break;
        //case "weak":
        //this.map.getElement(this.eventInfo.weak[0], "monster").weak(this.eventInfo.weak[1]);
        //break;
        //}
        //} else {
        //this.map.clearGameEventSystem();
        //NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
        //}
    }
    private chat() {
        //GameManager.getInstance()
        //.showDialog("ChatDialog", this.eventInfo.chat[this.chatStep++], () => {
        //return this.execute();
        //})
        //.then((control: any) => {
        //control.node.position = this.map.dialogPos;
        //});
    }
    private move() {
        //let moveData = this.eventInfo.move[this.moveStep++];
        //let movePath = moveData.path;
        //for (let layer in movePath) {
        //moveinfo 格式[0, 38, 5]第一个延时，第二个当前坐标，第三个终点坐标
        //let move = movePath[layer];
        //行走类型判断
        //this.map.astarMoveType = layer;
        //move.forEach((moveInfo) => {
        //let path = CommonAstar.getPath(this.map, this.map.indexToTile(moveInfo[1]), this.map.indexToTile(moveInfo[2]));
        //if (path) {
        //let element = this.map.getElement(moveInfo[1], layer);
        //let moveFunc = () => {
        //element.movePath(this.map.changePathCoord(path), moveData.speed).then(() => {
        //this.map.changeElementInfo(moveInfo[1], moveInfo[2], layer, element);
        //});
        //};
        //if (moveInfo[0] != 0) {
        //cc.tween(element.node).delay(moveInfo[0]).call(moveFunc).start();
        //} else {
        //cc.tween(element.node).call(moveFunc).start();
        //}
        //}
        //});
        //}
        //this.map.scheduleOnce(() => {
        //return this.execute();
        //}, moveData.interval * moveData.speed * this.globalConfig.npcSpeed + 0.05);
    }
    private specialMove() {
        //let info = this.eventInfo.specialMove;
        //if (info.type == "spawn") {
        //let actions = [];
        //for (let actionName in info) {
        //switch (actionName) {
        //case "move":
        //{
        //actions.push(cc.moveTo(info.interval, this.map.indexToNodeSpaceAR(info[actionName].to)));
        //}
        //break;
        //case "fadeOut":
        //{
        //actions.push(cc.fadeOut(info.interval));
        //}
        //break;
        //}
        //}
        //if (info.move) {
        //info.move.from.forEach((index) => {
        //let element = this.map.getElement(index, "monster");
        //cc.tween(element.node)
        //.parallel(actions)
        //.call(() => {
        //this.map.removeElement(index, "monster");
        //})
        //.start();
        //});
        //}
        //this.map.scheduleOnce(() => {
        //return this.execute();
        //}, info.interval);
        //}
    }
    getAppearClassName(layer: string) {
        //if (layer == "wall") {
        //return "door1006_0";
        //} else {
        //return layer.charAt(0).toUpperCase() + layer.slice(1);
        //}
    }
    private appear() {
        //let appearInfo = this.eventInfo.appear[this.appearStep++];
        //if (appearInfo.delay) {
        //for (let layer in appearInfo.layer) {
        //let layerInfo = appearInfo.layer[layer];
        //let className = this.getAppearClassName(layer);
        //for (let i = 0; i < layerInfo.length; i++) {
        //let element = this.map.addElement(layerInfo[i][0], layer, className, layerInfo[i][1]);
        //element.node.active = false;
        //cc.tween(element.node)
        //.delay(appearInfo.delay[i])
        //.call(() => {
        //element.node.active = true;
        //element.add();
        //})
        //.start();
        //}
        //}
        //} else {
        //for (let layer in appearInfo.layer) {
        //let layerInfo = appearInfo.layer[layer];
        //let className = this.getAppearClassName(layer);
        //layerInfo.forEach((elementInfo) => {
        //let element = this.map.addElement(elementInfo[0], layer, className, elementInfo[1]);
        //element.add();
        //});
        //}
        //}
        //this.map.scheduleOnce(() => {
        //return this.execute();
        //}, appearInfo.interval);
    }
    private disappear() {
        //let info = this.eventInfo.disappear[this.disappearStep++];
        //for (let layer in info) {
        //info[layer].forEach((index) => {
        //this.map.removeElement(index, layer);
        //});
        //}
        //return this.execute();
    }
    private beAttack(info: any) {
        //if (info.hero) {
        //this.hero.magicLight(info.hero);
        //} else if (info.monster) {
        //let monster = this.map.getElement(info.monster, "monster");
        //monster.beAttack();
        //}
        //this.map.scheduleOnce(() => {
        //return this.execute();
        //}, this.globalConfig.fadeInterval + 0.05);
    }
    private sceneAppear() {
        //let info = this.eventInfo.sceneAppear;
        //NotifyCenter.emit(GameEvent.SCENE_APPEAR, info[0], this.map.indexToTile(info[1]));
        //this.hero.weak();
        //NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
        //NotifyCenter.emit(GameEvent.REFRESH_EQUIP);
        //return this.execute();
    }
    private sceneDisappear() {
        //cc.tween(this.map.node.parent.parent)
        //.to(1, { opacity: 0 })
        //.call(() => {
        //this.execute();
        //})
        //.start();
    }
    clearNpcEvent() {
        //this.map.getElement(this.eventInfo.clearNpcEvent, "npc").clearEvent();
        //return this.execute();
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { DataManager } from "../../../Managers/DataManager";
// import { GameManager } from "../../../Managers/GameManager";
// import { NotifyCenter } from "../../../Managers/NotifyCenter";
// import { GameEvent } from "../../../Constant/GameEvent";
// import Hero from "../Hero";
// import { CommonAstar } from "../Astar";
// import { GameMap } from "../Map/GameMap";
//
// /**处理地图上的事件 */
// export class GameEventSystem {
//     private eventInfo: any = null;
//
//     private chatStep: number = 0;
//
//     private appearStep: number = 0;
//
//     private disappearStep: number = 0;
//
//     private moveStep: number = 0;
//
//     private step: number = 0;
//
//     private map: GameMap = null;
//
//     private globalConfig: any = null;
//
//     private hero: Hero = null;
//
//     init(eventId: number | string, map: GameMap, hero: Hero) {
//         this.eventInfo = GameManager.DATA.getJsonElement("event", eventId);
//         this.map = map;
//         this.hero = hero;
//         this.globalConfig = GameManager.DATA.getJson("global");
//
//         if (this.eventInfo.monsterDoor) {
//             this.map.monsterDoor = this.eventInfo.monsterDoor;
//         }
//
//         return this;
//     }
//
//     executeComplete() {
//         return this.step >= this.eventInfo.step.length;
//     }
//
//     execute() {
//         if (this.step < this.eventInfo.step.length) {
//             let stepName = this.eventInfo.step[this.step++];
//             switch (stepName) {
//                 case "chat":
//                     this.chat();
//                     break;
//                 case "move":
//                     this.move();
//                     break;
//                 case "specialMove":
//                     this.specialMove();
//                     break;
//                 case "disappear":
//                     this.disappear();
//                     break;
//                 case "do":
//                     this.map.collision(this.map.indexToTile(this.eventInfo.do));
//                     break;
//                 case "show":
//                     this.map.getElement(this.eventInfo.show).add();
//                     return this.execute();
//                 case "appear":
//                     this.appear();
//                     break;
//                 case "beAttack":
//                     this.beAttack(this.eventInfo.beAttack);
//                     break;
//                 case "sceneDisappear":
//                     this.sceneDisappear();
//                     break;
//                 case "sceneAppear":
//                     this.sceneAppear();
//                     break;
//                 case "clearNpcEvent":
//                     this.clearNpcEvent();
//                     break;
//                 case "weak":
//                     this.map.getElement(this.eventInfo.weak[0], "monster").weak(this.eventInfo.weak[1]);
//                     break;
//             }
//         } else {
//             this.map.clearGameEventSystem();
//             NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
//         }
//     }
//
//     private chat() {
//         GameManager.getInstance()
//             .showDialog("ChatDialog", this.eventInfo.chat[this.chatStep++], () => {
//                 return this.execute();
//             })
//             .then((control: any) => {
//                 control.node.position = this.map.dialogPos;
//             });
//     }
//
//     private move() {
//         let moveData = this.eventInfo.move[this.moveStep++];
//         let movePath = moveData.path;
//         for (let layer in movePath) {
//             //moveinfo 格式[0, 38, 5]第一个延时，第二个当前坐标，第三个终点坐标
//             let move = movePath[layer];
//             //行走类型判断
//             this.map.astarMoveType = layer;
//             move.forEach((moveInfo) => {
//                 let path = CommonAstar.getPath(this.map, this.map.indexToTile(moveInfo[1]), this.map.indexToTile(moveInfo[2]));
//                 if (path) {
//                     let element = this.map.getElement(moveInfo[1], layer);
//                     let moveFunc = () => {
//                         element.movePath(this.map.changePathCoord(path), moveData.speed).then(() => {
//                             this.map.changeElementInfo(moveInfo[1], moveInfo[2], layer, element);
//                         });
//                     };
//                     if (moveInfo[0] != 0) {
//                         cc.tween(element.node).delay(moveInfo[0]).call(moveFunc).start();
//                     } else {
//                         cc.tween(element.node).call(moveFunc).start();
//                     }
//                 }
//             });
//         }
//         this.map.scheduleOnce(() => {
//             return this.execute();
//         }, moveData.interval * moveData.speed * this.globalConfig.npcSpeed + 0.05);
//     }
//
//     private specialMove() {
//         let info = this.eventInfo.specialMove;
//         if (info.type == "spawn") {
//             let actions = [];
//             for (let actionName in info) {
//                 switch (actionName) {
//                     case "move":
//                         {
//                             actions.push(cc.moveTo(info.interval, this.map.indexToNodeSpaceAR(info[actionName].to)));
//                         }
//                         break;
//                     case "fadeOut":
//                         {
//                             actions.push(cc.fadeOut(info.interval));
//                         }
//                         break;
//                 }
//             }
//
//             if (info.move) {
//                 info.move.from.forEach((index) => {
//                     let element = this.map.getElement(index, "monster");
//                     cc.tween(element.node)
//                         .parallel(actions)
//                         .call(() => {
//                             this.map.removeElement(index, "monster");
//                         })
//                         .start();
//                 });
//             }
//
//             this.map.scheduleOnce(() => {
//                 return this.execute();
//             }, info.interval);
//         }
//     }
//
//     getAppearClassName(layer) {
//         if (layer == "wall") {
//             return "door1006_0";
//         } else {
//             return layer.charAt(0).toUpperCase() + layer.slice(1);
//         }
//     }
//
//     private appear() {
//         let appearInfo = this.eventInfo.appear[this.appearStep++];
//
//         if (appearInfo.delay) {
//             for (let layer in appearInfo.layer) {
//                 let layerInfo = appearInfo.layer[layer];
//                 let className = this.getAppearClassName(layer);
//                 for (let i = 0; i < layerInfo.length; i++) {
//                     let element = this.map.addElement(layerInfo[i][0], layer, className, layerInfo[i][1]);
//                     element.node.active = false;
//                     cc.tween(element.node)
//                         .delay(appearInfo.delay[i])
//                         .call(() => {
//                             element.node.active = true;
//                             element.add();
//                         })
//                         .start();
//                 }
//             }
//         } else {
//             for (let layer in appearInfo.layer) {
//                 let layerInfo = appearInfo.layer[layer];
//                 let className = this.getAppearClassName(layer);
//                 layerInfo.forEach((elementInfo) => {
//                     let element = this.map.addElement(elementInfo[0], layer, className, elementInfo[1]);
//                     element.add();
//                 });
//             }
//         }
//
//         this.map.scheduleOnce(() => {
//             return this.execute();
//         }, appearInfo.interval);
//     }
//
//     private disappear() {
//         let info = this.eventInfo.disappear[this.disappearStep++];
//         for (let layer in info) {
//             info[layer].forEach((index) => {
//                 this.map.removeElement(index, layer);
//             });
//         }
//         return this.execute();
//     }
//
//     private beAttack(info: any) {
//         if (info.hero) {
//             this.hero.magicLight(info.hero);
//         } else if (info.monster) {
//             let monster = this.map.getElement(info.monster, "monster");
//             monster.beAttack();
//         }
//
//         this.map.scheduleOnce(() => {
//             return this.execute();
//         }, this.globalConfig.fadeInterval + 0.05);
//     }
//
//     private sceneAppear() {
//         let info = this.eventInfo.sceneAppear;
//         NotifyCenter.emit(GameEvent.SCENE_APPEAR, info[0], this.map.indexToTile(info[1]));
//         this.hero.weak();
//
//         NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
//         NotifyCenter.emit(GameEvent.REFRESH_EQUIP);
//         return this.execute();
//     }
//
//     private sceneDisappear() {
//         cc.tween(this.map.node.parent.parent)
//             .to(1, { opacity: 0 })
//             .call(() => {
//                 this.execute();
//             })
//             .start();
//     }
//
//     clearNpcEvent() {
//         this.map.getElement(this.eventInfo.clearNpcEvent, "npc").clearEvent();
//         return this.execute();
//     }
// }
