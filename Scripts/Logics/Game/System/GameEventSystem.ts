// /**处理地图上的事件 */

// import { tween } from "cc";
// import { GameManager } from "../../../../Framework/Managers/GameManager";
// import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
// import { GameEvent } from "../../../Constant/GameEvent";
// import { Hero } from "../Map/Actor/Hero";
// import { GameMap } from "../Map/GameMap";
// import { MapCollisionSystem } from "./MapCollisionSystem";

// export class GameEventSystem {
//     private eventInfo: any = null;
//     private chatStep: number = 0;
//     private appearStep: number = 0;
//     private disappearStep: number = 0;
//     private moveStep: number = 0;
//     private step: number = 0;
//     private map: GameMap = null!;
//     private globalConfig: any = null;
//     private hero: Hero = null!;
//     private collisionSystem: MapCollisionSystem = null!;

//     init(collisionSystem: MapCollisionSystem, map: GameMap, hero: Hero, eventId: number | string) {
//         this.eventInfo = GameManager.DATA.getJsonElement("event", eventId);
//         this.map = map;
//         this.hero = hero;
//         this.globalConfig = GameManager.DATA.getJson("global");
//         this.collisionSystem = collisionSystem;
//         // if (this.eventInfo.monsterDoor) {
//         // this.map.monsterDoor = this.eventInfo.monsterDoor;
//         // }
//         return this;
//     }

//     executeComplete() {
//         return this.step >= this.eventInfo.step.length;
//     }

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
//                     this.collisionSystem.collision(this.map.getTile(this.eventInfo.do));
//                     break;
//                 case "show":
//                     //this.map.getElement(this.eventInfo.show).add();
//                     this.execute();
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
//                     //this.map.getElement(this.eventInfo.weak[0], "monster").weak(this.eventInfo.weak[1]);
//                     break;
//             }
//         } else {
//             //this.map.clearGameEventSystem();
//             NotifyCenter.emit(GameEvent.COLLISION_COMPLETE);
//         }
//     }

//     private scheduleExecute(interval: number) {
//         this.map.scheduleOnce(this.execute.bind(this), interval);
//     }

//     private chat() {
//         GameManager.UI.showDialog("ChatDialog", this.eventInfo.chat[this.chatStep++], () => {
//             this.execute();
//         }).then((control: any) => {
//             //control.node.position = this.map.dialogPos;
//         });
//     }

//     private move() {
//         let moveData = this.eventInfo.move[this.moveStep++];
//         let movePath = moveData.path;
//         for (let layer in movePath) {
//             //moveinfo 格式[0, 38, 5]第一个延时，第二个当前坐标，第三个终点坐标
//             let move = movePath[layer];
//             move.forEach((moveInfo: number[]) => {
//                 this.collisionSystem.move(layer, moveInfo[1], moveInfo[2], moveData.speed, moveInfo[0]);
//             });
//         }

//         this.scheduleExecute(moveData.interval * moveData.speed * this.globalConfig.npcSpeed + 0.05);
//     }

//     private specialMove() {
//         let info = this.eventInfo.specialMove;
//         this.collisionSystem.specialMove(info);
//         this.scheduleExecute(info.interval);
//     }

//     private appear() {
//         let appearInfo = this.eventInfo.appear[this.appearStep++];
//         if (appearInfo.delay) {
//             for (let layer in appearInfo.layer) {
//                 let layerInfo = appearInfo.layer[layer];
//                 for (let i = 0; i < layerInfo.length; i++) {
//                     this.map.scheduleOnce(() => {
//                         this.collisionSystem.appear(layer, layerInfo[i][0], layerInfo[i][1]);
//                     }, appearInfo.delay[i]);
//                 }
//             }
//         } else {
//             for (let layer in appearInfo.layer) {
//                 let layerInfo = appearInfo.layer[layer];
//                 layerInfo.forEach((elementInfo: number[]) => {
//                     this.collisionSystem.appear(layer, elementInfo[0], elementInfo[1]);
//                 });
//             }
//         }

//         this.scheduleExecute(appearInfo.interval);
//     }

//     private disappear() {
//         let info = this.eventInfo.disappear[this.disappearStep++];
//         for (let layer in info) {
//             info[layer].forEach((index: number) => {
//                 this.collisionSystem.disappear(layer, index);
//             });
//         }
//         this.execute();
//     }

//     private beAttack(info: any) {
//         if (info.hero) {
//             this.hero.magicLight(info.hero);
//         } else if (info.monster) {
//             // let monster = this.map.getElement(info.monster, "monster");
//             // monster.beAttack();
//         }

//         this.scheduleExecute(this.globalConfig.fadeInterval + 0.05);
//     }

//     private sceneAppear() {
//         let info = this.eventInfo.sceneAppear;
//         this.hero.weak();
//         NotifyCenter.emit(GameEvent.SCENE_APPEAR, info[0], this.map.getTile(info[1]));
//         this.execute();
//     }

//     private sceneDisappear() {
//         tween(this.map.node!.parent!.parent)
//             .to(1, { opacity: 0 })
//             .call(() => {
//                 this.execute();
//             })
//             .start();
//     }

//     clearNpcEvent() {
//         //this.map.getElement(this.eventInfo.clearNpcEvent, "npc").clearEvent();
//         this.execute();
//     }
// }
