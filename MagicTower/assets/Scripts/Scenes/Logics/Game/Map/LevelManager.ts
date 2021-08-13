import { Component, instantiate, Node, Prefab, TiledMapAsset, Touch, Tween, TweenSystem, UITransform, v2, v3, Vec2, _decorator } from "cc";
import { Astar } from "../../../../Framework/Lib/AI/Astar";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { GameEvent } from "../../../Constant/GameEvent";
import { MapData, StairType } from "../../../Data/CustomData/MapData";
import { MapCollisionSystem } from "../System/MapCollisionSystem";
import { AstarMoveType, GameMap } from "./GameMap";
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
    private collisionSystem: MapCollisionSystem = new MapCollisionSystem();

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        NotifyCenter.on(GameEvent.COLLISION_COMPLETE, this.collisionComplete, this);
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
            let currentMap: GameMap | null = this.getCurrentMap();
            if (!currentMap) {
                console.error("当前移动没有地图");
                return;
            }
            let localPos = this.node.getComponent(UITransform)?.convertToNodeSpaceAR(v3(touchPos.x, touchPos.y));
            let endTile = currentMap.toTile(v2(localPos?.x, localPos?.y));
            //还原英雄行走;
            currentMap.astarMoveType = AstarMoveType.HERO;
            let path = this.astar.getPath(currentMap, this.hero.heroData.get("position"), endTile);
            if (path) {
                this.printPath(path);
                let canEndMove = this.collisionSystem.canEndTileMove(endTile);
                if (!canEndMove) {
                    path.pop();
                }
                let moveComplete = () => {
                    if (!canEndMove) {
                        this.hero.toward(endTile);
                    }
                    this.heroMoving = !this.collisionSystem.collision(endTile);
                };
                this.heroMoving = true;
                if (path.length == 0) {
                    moveComplete();
                } else {
                    this.hero.movePath(path, (tile: Vec2, end: boolean) => {
                        if (end) {
                            moveComplete();
                        } else if (!this.collisionSystem.collision(tile)) {
                            //碰到区块处理事件停止;
                            Tween.stopAllByTarget(this.hero.node);
                            this.hero.stand();
                            return true;
                        }
                        return false;
                    });
                }
                NotifyCenter.emit(GameEvent.MOVE_PATH);
            } else {
                GameManager.UI.showToast("路径错误");
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
        return this.getCurrentMap() != null && !this.heroMoving;
    }

    /** 碰撞结束 */
    private collisionComplete() {
        this.heroMoving = false;
    }
}
