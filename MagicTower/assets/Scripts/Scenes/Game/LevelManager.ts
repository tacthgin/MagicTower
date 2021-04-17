import { _decorator, Component, Node, Touch, Vec2 } from "cc";
const { ccclass, property } = _decorator;

import { ElementManager } from "./ElementManager";
import Hero from "./Hero";
import { Astar } from "./Astar";
import { DataManager } from "../../Managers/DataManager";
import GameInfo from "../Data/GameInfo";
import { GameManager } from "../../Managers/GameManager";
import { ToastString } from "../Constant/ToastString";
import { NotifyCenter } from "../../Managers/NotifyCenter";
import { GameEvent } from "../Constant/GameEvent";
import Stair from "./Elements/Stair";
import { GameMap } from "./Map/GameMap";

@ccclass("LevelManager")
export class LevelManager extends Component {
    @property(Node)
    private layer: Node | null = null;
    private static _instance: LevelManager = null;
    static get instance() {
        //return LevelManager._instance;
    }
    /** 当前层数 */
    private level: number = 1;
    private maps: any = {};
    /** 当前地图 */
    private currentMap: GameMap = null;
    /** 勇士 */
    private hero: Hero = null;
    /** 勇士正在移动中 */
    private heroMoving: boolean = false;
    /** 地图数据 */
    private mapInfo: any = null;
    /** 游戏存档数据 */
    private gameInfo: GameInfo = null;
    /** 触摸id */
    private touchId: number = null;
    private astar: Astar = new Astar();
    onLoad() {
        //if (!LevelManager._instance) {
        //LevelManager._instance = this;
        //} else {
        //this.node.destroy();
        //}
        //this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        //this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        //this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        //this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        //NotifyCenter.on(GameEvent.COLLISION_COMPLETE, this.collisionComplete, this);
        //NotifyCenter.on(GameEvent.SWITCH_LEVEl, this.switchLevel, this);
        //NotifyCenter.on(GameEvent.SCENE_APPEAR, this.sceneAppear, this);
        //NotifyCenter.on(GameEvent.USE_PROP, this.useProp, this);
        //this.mapInfo = DataManager.getJson("map");
        //this.gameInfo = DataManager.getCustomData("GameInfo");
        //更新下无障碍a*地图
        //this.loadArchive();
    }
    onTouchStart(event: Touch) {
        //if (this.touchId != null && this.touchId != event.getID()) {
        //return;
        //}
        //this.touchId = event.getID(); //处理多点触摸
        //this.moveHero(event.getLocation());
    }
    onTouchMove(event: Touch) {
        //if (event.getID() != this.touchId) return;
    }
    onTouchEnd(event: Touch) {
        //if (event.getID() == this.touchId) {
        //this.touchId = null;
        //}
    }
    private loadArchive() {
        //this.level = this.gameInfo.MapInfo.level;
        //this.showMap();
        //this.showHero();
        //NotifyCenter.emit(GameEvent.REFRESH_ARCHIVE);
    }
    private createMap(level: number) {
        //if (!this.maps[level]) {
        //let map = new cc.Node();
        //map.parent = this.layer;
        //let mapComponent = map.addComponent(GameMap);
        //mapComponent.init(this.mapInfo[level], this.gameInfo.MapInfo.getLevelInfo(level));
        //this.maps[level] = mapComponent;
        //}
        //return this.maps[level];
    }
    private showMap() {
        //let newMap = this.createMap(this.level);
        //if (!newMap) return null;
        //if (this.currentMap) this.currentMap.node.active = false;
        //this.currentMap = newMap;
        //this.currentMap.node.active = true;
        //this.currentMap.show();
        //NotifyCenter.emit(GameEvent.REFRESH_LEVEL, this.level);
        //return this.currentMap;
    }
    private showHero(tile: Vec2 | null = null) {
        //if (!this.hero) {
        //let hero = ElementManager.getElement("Hero");
        //this.hero = hero.getComponent("Hero");
        //}
        //this.hero.node.parent = this.currentMap.node;
        //this.hero.init(this.currentMap, tile);
        //this.currentMap.setHero(this.hero);
    }
    private moveHero(touchPos: Vec2) {
        //if (this.canHeroMove()) {
        //let endTile = this.currentMap.nodeSpaceARToTile(this.node.convertToNodeSpaceAR(touchPos));
        //还原英雄行走
        //this.currentMap.astarMoveType = "hero";
        //let path = this.astar.getPath(this.currentMap, this.hero.HeroInfo.Position, endTile);
        //if (path) {
        //this.printPath(path);
        //let canEndMove = this.currentMap.canEndTileMove(endTile);
        //if (!canEndMove) {
        //path.pop();
        //}
        //let moveComplete = () => {
        //if (!canEndMove) {
        //this.hero.toward(endTile);
        //}
        //this.heroMoving = !this.currentMap.collision(endTile);
        //};
        //this.heroMoving = true;
        //if (path.length == 0) {
        //moveComplete();
        //} else {
        //this.hero.movePath(path, (tile: cc.Vec2, end: boolean) => {
        //if (end) {
        //moveComplete();
        //} else if (!this.currentMap.collision(tile)) {
        //碰到区块处理事件停止
        //this.hero.node.stopAllActions();
        //this.hero.stand();
        //return true;
        //}
        //return false;
        //});
        //}
        //NotifyCenter.emit(GameEvent.MOVE_PATH);
        //} else {
        //GameManager.getInstance().showToast(ToastString.ERROR_PARH);
        //}
        //}
    }
    private printPath(path) {
        //path.forEach(element => {
        //cc.log(element.x, element.y);
        //});
        //cc.log("********************");
    }
    private canHeroMove() {
        //return this.currentMap != null && !this.heroMoving;
    }
    /** 碰撞结束 */
    private collisionComplete() {
        //this.heroMoving = false;
    }
    getSwitchLevel(stair: Stair) {
        //let symbol = stair.stairType == "up" ? 1 : -1;
        //return this.level + symbol * stair.levelDiff;
    }
    switchLevelHero(stairType: string) {
        //if (this.showMap()) {
        //let standIndex = this.currentMap.getStair(stairType).standIndex;
        //this.showHero(this.currentMap.indexToTile(standIndex));
        //}
    }
    private switchLevel(stair: Stair) {
        //this.level = this.getSwitchLevel(stair);
        //上了楼，勇士站在下楼梯的旁边
        //this.switchLevelHero(stair.stairType == "up" ? "down" : "up");
    }
    private sceneAppear(level: number, tile: Vec2) {
        //this.node.opacity = 255;
        //this.level = level;
        //this.showMap();
        //this.showHero(tile);
    }
    switchLevelTip(swtichType: string) {
        //let tip = null;
        //if (swtichType == "down" && this.level == 1) {
        //tip = "你已经到最下面一层了";
        //} else if (swtichType == "up" && this.level == 50) {
        //tip = "你已经到最上面一层了";
        //}
        //if (tip) {
        //GameManager.getInstance().showToast(tip);
        //return true;
        //}
        //return false;
    }
    private useProp(propInfo: any, extraInfo: any) {
        //if (!this.currentMap) return;
        //switch (propInfo.type) {
        //case 7:
        //this.currentMap.showDialog("MonsterHandBook", this.currentMap.getMonsters());
        //break;
        //case 8:
        //this.currentMap.showDialog("RecordBook");
        //break;
        //case 9:
        //{
        //飞行魔杖
        //if (this.currentMap.isHeroNextToStair()) {
        //if (this.switchLevelTip(extraInfo)) {
        //return;
        //}
        //let stair = this.currentMap.getStair(extraInfo);
        //if (this.maps[this.getSwitchLevel(stair)]) {
        //this.switchLevel(stair);
        //}
        //} else {
        //GameManager.getInstance().showToast("在楼梯旁边才可以使用");
        //}
        //}
        //break;
        //case 10:
        //{
        //if (this.currentMap.removeHeroFaceWall()) {
        //this.consumptionProp(propInfo);
        //}
        //}
        //break;
        //case 11:
        //{
        //if (this.currentMap.removeAllWalls()) {
        //this.consumptionProp(propInfo);
        //}
        //}
        //break;
        //case 12:
        //{
        //this.currentMap.removeLava();
        //}
        //break;
        //case 13:
        //{
        //if (this.currentMap.bomb()) {
        //this.consumptionProp(propInfo);
        //}
        //}
        //break;
        //case 14:
        //{
        //if (this.currentMap.removeYellowDoors()) {
        //this.consumptionProp(propInfo);
        //}
        //}
        //break;
        //case 15:
        //{
        //this.hero.HeroInfo.Hp += this.hero.HeroInfo.Attack + this.hero.HeroInfo.Defence;
        //NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
        //this.consumptionProp(propInfo);
        //}
        //break;
        //case 18:
        //{
        //if (this.switchLevelTip(propInfo.value == 1 ? "up" : "down")) {
        //return;
        //}
        //this.level = this.level + propInfo.value;
        //this.switchLevelHero(propInfo.value == 1 ? "down" : "up");
        //this.consumptionProp(propInfo);
        //}
        //break;
        //case 19:
        //{
        //中心对称飞行棋
        //if (this.currentMap.centrosymmetricFly()) {
        //this.consumptionProp(propInfo);
        //}
        //}
        //break;
        //}
    }
    consumptionProp(propInfo) {
        //if (!propInfo.permanent) {
        //this.hero.HeroInfo.addProp(propInfo.id, -1);
        //NotifyCenter.emit(GameEvent.REFRESH_PROP, propInfo, -1);
        //}
    }
    getMap(level: number): GameMap {
        //return this.maps[level] || null;
    }
}

/**
 * Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually
 */
// import { ElementManager } from "./ElementManager";
// import Hero from "./Hero";
// import { Astar } from "./Astar";
// import { DataManager } from "../../Managers/DataManager";
// import GameInfo from "../../Data/GameInfo";
// import { GameManager } from "../../Managers/GameManager";
// import { ToastString } from "../../Constant/ToastString";
// import { NotifyCenter } from "../../Managers/NotifyCenter";
// import { GameEvent } from "../../Constant/GameEvent";
// import Stair from "./Elements/Stair";
// import { GameMap } from "./Map/GameMap";
//
// const { ccclass, property } = cc._decorator;
//
// @ccclass
// export class LevelManager extends cc.Component {
//     @property(cc.Node)
//     private layer: cc.Node = null;
//
//     private static _instance: LevelManager = null;
//
//     static get instance() {
//         return LevelManager._instance;
//     }
//
//     /** 当前层数 */
//     private level: number = 1;
//
//     private maps: any = {};
//
//     /** 当前地图 */
//     private currentMap: GameMap = null;
//
//     /** 勇士 */
//     private hero: Hero = null;
//
//     /** 勇士正在移动中 */
//     private heroMoving: boolean = false;
//
//     /** 地图数据 */
//     private mapInfo: any = null;
//
//     /** 游戏存档数据 */
//     private gameInfo: GameInfo = null;
//
//     /** 触摸id */
//     private touchId: number = null;
//
//     private astar: Astar = new Astar();
//
//     onLoad() {
//         if (!LevelManager._instance) {
//             LevelManager._instance = this;
//         } else {
//             this.node.destroy();
//         }
//
//         this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
//         this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
//         this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
//         this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
//
//         NotifyCenter.on(GameEvent.COLLISION_COMPLETE, this.collisionComplete, this);
//         NotifyCenter.on(GameEvent.SWITCH_LEVEl, this.switchLevel, this);
//         NotifyCenter.on(GameEvent.SCENE_APPEAR, this.sceneAppear, this);
//         NotifyCenter.on(GameEvent.USE_PROP, this.useProp, this);
//
//         this.mapInfo = DataManager.getJson("map");
//         this.gameInfo = DataManager.getCustomData("GameInfo");
//         //更新下无障碍a*地图
//         this.loadArchive();
//     }
//
//     onTouchStart(event: cc.Touch) {
//         if (this.touchId != null && this.touchId != event.getID()) {
//             return;
//         }
//
//         this.touchId = event.getID(); //处理多点触摸
//         this.moveHero(event.getLocation());
//     }
//
//     onTouchMove(event: cc.Touch) {
//         if (event.getID() != this.touchId) return;
//     }
//
//     onTouchEnd(event: cc.Touch) {
//         if (event.getID() == this.touchId) {
//             this.touchId = null;
//         }
//     }
//
//     private loadArchive() {
//         this.level = this.gameInfo.MapInfo.level;
//         this.showMap();
//         this.showHero();
//         NotifyCenter.emit(GameEvent.REFRESH_ARCHIVE);
//     }
//
//     private createMap(level: number) {
//         if (!this.maps[level]) {
//             let map = new cc.Node();
//             map.parent = this.layer;
//             let mapComponent = map.addComponent(GameMap);
//             mapComponent.init(this.mapInfo[level], this.gameInfo.MapInfo.getLevelInfo(level));
//             this.maps[level] = mapComponent;
//         }
//
//         return this.maps[level];
//     }
//
//     private showMap() {
//         let newMap = this.createMap(this.level);
//         if (!newMap) return null;
//
//         if (this.currentMap) this.currentMap.node.active = false;
//         this.currentMap = newMap;
//
//         this.currentMap.node.active = true;
//         this.currentMap.show();
//         NotifyCenter.emit(GameEvent.REFRESH_LEVEL, this.level);
//         return this.currentMap;
//     }
//
//     private showHero(tile: cc.Vec2 = null) {
//         if (!this.hero) {
//             let hero = ElementManager.getElement("Hero");
//             this.hero = hero.getComponent("Hero");
//         }
//         this.hero.node.parent = this.currentMap.node;
//         this.hero.init(this.currentMap, tile);
//         this.currentMap.setHero(this.hero);
//     }
//
//     private moveHero(touchPos: cc.Vec2) {
//         if (this.canHeroMove()) {
//             let endTile = this.currentMap.nodeSpaceARToTile(this.node.convertToNodeSpaceAR(touchPos));
//             //还原英雄行走
//             this.currentMap.astarMoveType = "hero";
//             let path = this.astar.getPath(this.currentMap, this.hero.HeroInfo.Position, endTile);
//             if (path) {
//                 //this.printPath(path);
//                 let canEndMove = this.currentMap.canEndTileMove(endTile);
//                 if (!canEndMove) {
//                     path.pop();
//                 }
//
//                 let moveComplete = () => {
//                     if (!canEndMove) {
//                         this.hero.toward(endTile);
//                     }
//                     this.heroMoving = !this.currentMap.collision(endTile);
//                 };
//
//                 this.heroMoving = true;
//                 if (path.length == 0) {
//                     moveComplete();
//                 } else {
//                     this.hero.movePath(path, (tile: cc.Vec2, end: boolean) => {
//                         if (end) {
//                             moveComplete();
//                         } else if (!this.currentMap.collision(tile)) {
//                             //碰到区块处理事件停止
//                             this.hero.node.stopAllActions();
//                             this.hero.stand();
//                             return true;
//                         }
//                         return false;
//                     });
//                 }
//
//                 NotifyCenter.emit(GameEvent.MOVE_PATH);
//             } else {
//                 GameManager.getInstance().showToast(ToastString.ERROR_PARH);
//             }
//         }
//     }
//
//     private printPath(path) {
//         path.forEach(element => {
//             cc.log(element.x, element.y);
//         });
//         cc.log("********************");
//     }
//
//     private canHeroMove() {
//         return this.currentMap != null && !this.heroMoving;
//     }
//
//     /** 碰撞结束 */
//     private collisionComplete() {
//         this.heroMoving = false;
//     }
//
//     getSwitchLevel(stair: Stair) {
//         let symbol = stair.stairType == "up" ? 1 : -1;
//         return this.level + symbol * stair.levelDiff;
//     }
//
//     switchLevelHero(stairType: string) {
//         if (this.showMap()) {
//             let standIndex = this.currentMap.getStair(stairType).standIndex;
//             this.showHero(this.currentMap.indexToTile(standIndex));
//         }
//     }
//
//     private switchLevel(stair: Stair) {
//         this.level = this.getSwitchLevel(stair);
//         //上了楼，勇士站在下楼梯的旁边
//         this.switchLevelHero(stair.stairType == "up" ? "down" : "up");
//     }
//
//     private sceneAppear(level: number, tile: cc.Vec2) {
//         this.node.opacity = 255;
//         this.level = level;
//         this.showMap();
//         this.showHero(tile);
//     }
//
//     switchLevelTip(swtichType: string) {
//         let tip = null;
//         if (swtichType == "down" && this.level == 1) {
//             tip = "你已经到最下面一层了";
//         } else if (swtichType == "up" && this.level == 50) {
//             tip = "你已经到最上面一层了";
//         }
//
//         if (tip) {
//             GameManager.getInstance().showToast(tip);
//             return true;
//         }
//         return false;
//     }
//
//     private useProp(propInfo: any, extraInfo: any) {
//         if (!this.currentMap) return;
//         switch (propInfo.type) {
//             case 7:
//                 this.currentMap.showDialog("MonsterHandBook", this.currentMap.getMonsters());
//                 break;
//             case 8:
//                 this.currentMap.showDialog("RecordBook");
//                 break;
//             case 9:
//                 {
//                     //飞行魔杖
//                     if (this.currentMap.isHeroNextToStair()) {
//                         if (this.switchLevelTip(extraInfo)) {
//                             return;
//                         }
//
//                         let stair = this.currentMap.getStair(extraInfo);
//                         if (this.maps[this.getSwitchLevel(stair)]) {
//                             this.switchLevel(stair);
//                         }
//                     } else {
//                         GameManager.getInstance().showToast("在楼梯旁边才可以使用");
//                     }
//                 }
//                 break;
//             case 10:
//                 {
//                     if (this.currentMap.removeHeroFaceWall()) {
//                         this.consumptionProp(propInfo);
//                     }
//                 }
//                 break;
//             case 11:
//                 {
//                     if (this.currentMap.removeAllWalls()) {
//                         this.consumptionProp(propInfo);
//                     }
//                 }
//                 break;
//             case 12:
//                 {
//                     this.currentMap.removeLava();
//                 }
//                 break;
//             case 13:
//                 {
//                     if (this.currentMap.bomb()) {
//                         this.consumptionProp(propInfo);
//                     }
//                 }
//                 break;
//             case 14:
//                 {
//                     if (this.currentMap.removeYellowDoors()) {
//                         this.consumptionProp(propInfo);
//                     }
//                 }
//                 break;
//             case 15:
//                 {
//                     this.hero.HeroInfo.Hp += this.hero.HeroInfo.Attack + this.hero.HeroInfo.Defence;
//                     NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
//                     this.consumptionProp(propInfo);
//                 }
//                 break;
//             case 18:
//                 {
//                     if (this.switchLevelTip(propInfo.value == 1 ? "up" : "down")) {
//                         return;
//                     }
//                     this.level = this.level + propInfo.value;
//                     this.switchLevelHero(propInfo.value == 1 ? "down" : "up");
//                     this.consumptionProp(propInfo);
//                 }
//                 break;
//             case 19:
//                 {
//                     //中心对称飞行棋
//                     if (this.currentMap.centrosymmetricFly()) {
//                         this.consumptionProp(propInfo);
//                     }
//                 }
//                 break;
//         }
//     }
//
//     consumptionProp(propInfo) {
//         if (!propInfo.permanent) {
//             this.hero.HeroInfo.addProp(propInfo.id, -1);
//             NotifyCenter.emit(GameEvent.REFRESH_PROP, propInfo, -1);
//         }
//     }
//
//     getMap(level: number): GameMap {
//         return this.maps[level] || null;
//     }
// }
