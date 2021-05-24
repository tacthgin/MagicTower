import { Component, instantiate, Node, Prefab, TiledMapAsset, Touch, v3, Vec2, _decorator } from "cc";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { GameEvent } from "../../../Constant/GameEvent";
import { MapData, StairType } from "../../../Data/CustomData/MapData";
import { Astar } from "../AI/Astar";
import { GameMap } from "./GameMap";
import { Hero } from "./Hero";
const { ccclass, type } = _decorator;

@ccclass("LevelManager")
export class LevelManager extends Component {
    /** 地图层 */
    @type(Node)
    private layer: Node = null!;
    /** 地图预设 */
    @type(Prefab)
    private mapPrefab: Prefab = null!;
    /** 英雄预设 */
    @type(Prefab)
    private heroPrefab: Prefab = null!;

    private maps: any = {};
    /** 勇士 */
    private hero: Hero = null!;
    /** 勇士正在移动中 */
    private heroMoving: boolean = false;
    /** 地图数据 */
    private mapData: MapData = null!;
    /** 触摸id */
    private touchId: number | null = null;
    private astar: Astar = new Astar();

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        // NotifyCenter.on(GameEvent.COLLISION_COMPLETE, this.collisionComplete, this);
        NotifyCenter.on(GameEvent.SWITCH_LEVEl, this.switchLevel, this);
        // NotifyCenter.on(GameEvent.SCENE_APPEAR, this.sceneAppear, this);
        // NotifyCenter.on(GameEvent.USE_PROP, this.useProp, this);
        this.mapData = GameManager.DATA.getData(MapData)!;
    }

    start() {
        this.loadArchive();
    }

    private onTouchStart(event: Touch) {
        if (this.touchId != null && this.touchId != event.getID()) {
            return;
        }
        this.touchId = event.getID();
        //处理多点触摸;
        //this.moveHero(event.getLocation());
    }

    private onTouchEnd(event: Touch) {
        if (event.getID() == this.touchId) {
            this.touchId = null;
        }
    }

    private loadArchive() {
        let currentLevel = this.mapData.level;
        let gameMap = this.createMap(currentLevel);
        let levelData = this.mapData.getLevelData(currentLevel);
        if (levelData) {
            gameMap.loadLevelData(levelData);
        } else {
            this.mapData.createLevelData(currentLevel, gameMap.getLayersProperties());
        }
        this.showHero();
    }

    private createMap(level: number): GameMap {
        if (!this.maps[level]) {
            let mapNode = instantiate(this.mapPrefab);
            mapNode.position = v3(0, 0, 0);
            mapNode.parent = this.layer;
            let gameMap = mapNode.getComponent(GameMap)!;
            gameMap.init(GameManager.RESOURCE.getAsset(TiledMapAsset, `${level}`));
            this.maps[level] = gameMap;
        }
        return this.maps[level];
    }

    private getCurrentMap(): GameMap | null {
        return this.maps[this.mapData.level] || null;
    }

    private switchLevel(type: StairType) {
        // let levelData = this.mapData.getLevelData(currentLevel);
        // let stair = levelData.getStair(type)
        // let levelDiff = type == StairType.Down ? -stair.levelDiff : stair.levelDiff
        // let newLevel = currentLevel
        // if (this.maps[])
    }

    private showHero(tile: Vec2 | null = null) {
        if (!this.hero) {
            let heroNode = instantiate(this.heroPrefab);
            this.hero = heroNode.getComponent(Hero)!;
        }
        let map = this.maps[this.mapData.level];
        this.hero.node.parent = map.node;
        this.hero.init(map);
    }

    private moveHero(touchPos: Vec2) {
        if (this.canHeroMove()) {
            let currentMap = this.getCurrentMap()!;
            if (currentMap) {
                console.error("当前移动没有地图");
                return;
            }
            let endTile = currentMap.nodeSpaceARToTile(this.node.convertToNodeSpaceAR(touchPos));
            //还原英雄行走;
            currentMap.astarMoveType = "hero";
            let path = this.astar.getPath(currentMap, this.hero.HeroData.Position, endTile);
            if (path) {
                this.printPath(path);
                let canEndMove = currentMap.canEndTileMove(endTile);
                if (!canEndMove) {
                    path.pop();
                }
                let moveComplete = () => {
                    if (!canEndMove) {
                        this.hero.toward(endTile);
                    }
                    this.heroMoving = !currentMap.collision(endTile);
                };
                this.heroMoving = true;
                if (path.length == 0) {
                    moveComplete();
                } else {
                    this.hero.movePath(path, (tile: Vec2, end: boolean) => {
                        if (end) {
                            moveComplete();
                        } else if (!currentMap.collision(tile)) {
                            //碰到区块处理事件停止;
                            this.hero.node.stopAllActions();
                            this.hero.stand();
                            return true;
                        }
                        return false;
                    });
                }
                NotifyCenter.emit(GameEvent.MOVE_PATH);
            } else {
                GameManager.UI.showToast(ToastString.ERROR_PARH);
            }
        }
    }
    private printPath(path: Vec2[]) {
        path.forEach((element) => {
            console.log(element.x, element.y);
        });
        console.log("********************");
    }
    private canHeroMove() {
        return currentMap != null && !this.heroMoving;
    }
    /** 碰撞结束 */
    private collisionComplete() {
        this.heroMoving = false;
    }

    // getSwitchLevel(stair: Stair) {
    //     let symbol = stair.stairType == "up" ? 1 : -1;
    //     return this.level + symbol * stair.levelDiff;
    // }
    // switchLevelHero(stairType: string) {
    //     if (this.showMap()) {
    //         let standIndex = currentMap.getStair(stairType).standIndex;
    //         this.showHero(currentMap.indexToTile(standIndex));
    //     }
    // }
    // private switchLevel(stair: Stair) {
    //     this.level = this.getSwitchLevel(stair);
    //     //上了楼，勇士站在下楼梯的旁边
    //     this.switchLevelHero(stair.stairType == "up" ? "down" : "up");
    // }
    // private sceneAppear(level: number, tile: Vec2) {
    //     this.node.opacity = 255;
    //     this.level = level;
    //     this.showMap();
    //     this.showHero(tile);
    // }
    // switchLevelTip(swtichType: string) {
    //     let tip = null;
    //     if (swtichType == "down" && this.level == 1) {
    //         tip = "你已经到最下面一层了";
    //     } else if (swtichType == "up" && this.level == 50) {
    //         tip = "你已经到最上面一层了";
    //     }
    //     if (tip) {
    //         GameManager.UI.showToast(tip);
    //         return true;
    //     }
    //     return false;
    // }
    // private useProp(propInfo: any, extraInfo: any) {
    //     if (!currentMap) return;
    //     switch (propInfo.type) {
    //         case 7:
    //             currentMap.showDialog("MonsterHandBook", currentMap.getMonsters());
    //             break;
    //         case 8:
    //             currentMap.showDialog("RecordBook");
    //             break;
    //         case 9:
    //             {
    //                 //飞行魔杖
    //                 if (currentMap.isHeroNextToStair()) {
    //                     if (this.switchLevelTip(extraInfo)) {
    //                         return;
    //                     }
    //                     let stair = currentMap.getStair(extraInfo);
    //                     if (this.maps[this.getSwitchLevel(stair)]) {
    //                         this.switchLevel(stair);
    //                     }
    //                 } else {
    //                     GameManager.UI.showToast("在楼梯旁边才可以使用");
    //                 }
    //             }
    //             break;
    //         case 10:
    //             {
    //                 if (currentMap.removeHeroFaceWall()) {
    //                     this.consumptionProp(propInfo);
    //                 }
    //             }
    //             break;
    //         case 11:
    //             {
    //                 if (currentMap.removeAllWalls()) {
    //                     this.consumptionProp(propInfo);
    //                 }
    //             }
    //             break;
    //         case 12:
    //             {
    //                 currentMap.removeLava();
    //             }
    //             break;
    //         case 13:
    //             {
    //                 if (currentMap.bomb()) {
    //                     this.consumptionProp(propInfo);
    //                 }
    //             }
    //             break;
    //         case 14:
    //             {
    //                 if (currentMap.removeYellowDoors()) {
    //                     this.consumptionProp(propInfo);
    //                 }
    //             }
    //             break;
    //         case 15:
    //             {
    //                 this.hero.HeroData.Hp += this.hero.HeroData.Attack + this.hero.HeroData.Defence;
    //                 NotifyCenter.emit(GameEvent.HERO_ATTR_CHANGED);
    //                 this.consumptionProp(propInfo);
    //             }
    //             break;
    //         case 18:
    //             {
    //                 if (this.switchLevelTip(propInfo.value == 1 ? "up" : "down")) {
    //                     return;
    //                 }
    //                 this.level = this.level + propInfo.value;
    //                 this.switchLevelHero(propInfo.value == 1 ? "down" : "up");
    //                 this.consumptionProp(propInfo);
    //             }
    //             break;
    //         case 19:
    //             {
    //                 //中心对称飞行棋
    //                 if (currentMap.centrosymmetricFly()) {
    //                     this.consumptionProp(propInfo);
    //                 }
    //             }
    //             break;
    //     }
    // }
    // consumptionProp(propInfo) {
    //     if (!propInfo.permanent) {
    //         this.hero.HeroData.addProp(propInfo.id, -1);
    //         NotifyCenter.emit(GameEvent.REFRESH_PROP, propInfo, -1);
    //     }
    // }
    // getMap(level: number): GameMap {
    //     return this.maps[level];
    // }
}
