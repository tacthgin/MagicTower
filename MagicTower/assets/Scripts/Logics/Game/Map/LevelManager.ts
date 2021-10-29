import { Component, instantiate, Node, Prefab, TiledMapAsset, Touch, UITransform, v2, v3, Vec2, _decorator } from "cc";
import { GameManager } from "../../../../Framework/Managers/GameManager";
import { NotifyCenter } from "../../../../Framework/Managers/NotifyCenter";
import { GameEvent } from "../../../Constant/GameEvent";
import { StairType } from "../../../Data/CustomData/Element";
import { MapData, MapEvent } from "../../../Data/CustomData/MapData";
import { AstarMoveType, GameMap } from "./GameMap";
import { Hero } from "./Actor/Hero";
import { MapCollisionSystem } from "../System/MapCollisionSystem";
import { CommonAstar } from "../../../../Framework/Lib/Custom/Astar";
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

    private maps: { [key: number]: GameMap } = {};
    /** 勇士 */
    private hero: Hero = null!;
    /** 地图数据 */
    private mapData: MapData = null!;
    /** 触摸id */
    private touchId: number | null = null;
    private collisionSystem: MapCollisionSystem = new MapCollisionSystem();

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.mapData = GameManager.DATA.getData(MapData)!;

        this.mapData.on(MapEvent.SWITCH_LEVEL, this.onSwitchLevel, this);
        NotifyCenter.on(GameEvent.COLLISION_COMPLETE, this.collisionComplete, this);
        NotifyCenter.on(GameEvent.SCENE_APPEAR, this.onSceneAppear, this);
        NotifyCenter.on(GameEvent.USE_PROP, this.onUseProp, this);
    }

    start() {
        this.loadArchive();
    }

    private onTouchStart(event: Touch) {
        if (this.touchId != null && this.touchId != event.getID()) {
            return;
        }
        this.touchId = event.getID();
        //console.log(event.getLocation(), event.getUILocation());
        //处理多点触摸;
        this.moveHero(event.getUILocation());
    }

    private onTouchEnd(event: Touch) {
        if (event.getID() == this.touchId) {
            this.touchId = null;
        }
    }

    private loadArchive() {
        let currentLevel = this.mapData.level;
        this.createMap(currentLevel);
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

            let levelData = this.mapData.getLevelData(level);
            if (!levelData) {
                let selectLayers = ["door", "stair", "monster"];
                let selectTiles: { [key: string]: number[] | null } = {};
                selectLayers.forEach((layerName) => {
                    selectTiles[layerName] = gameMap.getLayersTiles(layerName);
                });
                levelData = this.mapData.createLevelData(level, gameMap.getLayersProperties(), {
                    tiles: selectTiles,
                    parseGid: gameMap.getNameByGid.bind(gameMap),
                });
            }
            gameMap.loadLevelData(levelData);
        }
        return this.maps[level];
    }

    private getCurrentMap(): GameMap | null {
        return this.maps[this.mapData.level] || null;
    }

    private onSwitchLevel(oldLevel: number, type: StairType) {
        this.maps[oldLevel].node.active = false;
        let newMap = this.createMap(this.mapData.level);
        newMap.node.active = true;
        let levelData = this.mapData.getCurrentLevelData();
        this.showHero(newMap.getTile(levelData.getStair(type)!.standLocation));
    }

    private onUseProp(propInfo: any, extraInfo: any) {
        this.collisionSystem.useProp(propInfo, extraInfo);
    }

    private onSceneAppear(level: number, tile: Vec2) {
        this.maps[this.mapData.level].node.active = false;
        this.mapData.level = level;
        let newMap = this.createMap(this.mapData.level);
        newMap.node.active = true;
        this.showHero(tile);
    }

    private showHero(tile: Vec2 | null = null) {
        if (!this.hero) {
            let heroNode = instantiate(this.heroPrefab);
            this.hero = heroNode.getComponent(Hero)!;
        }
        let map = this.maps[this.mapData.level];
        this.hero.node.parent = map.node;
        this.hero.init(map, tile);
    }

    private moveHero(touchPos: Vec2) {
        let currentMap: GameMap | null = this.getCurrentMap();
        if (!currentMap) {
            console.error("当前移动没有地图");
            return;
        }
        if (!this.hero.heroMoving) {
            let localPos = currentMap.node.getComponent(UITransform)?.convertToNodeSpaceAR(v3(touchPos.x, touchPos.y));
            let endTile = currentMap.toTile(v2(localPos?.x, localPos?.y));
            currentMap.astarMoveType = AstarMoveType.HERO;
            let path = CommonAstar.getPath(currentMap, this.hero.heroTile, endTile);
            if (path) {
                let canEndMove = this.collisionSystem.canEndTileMove(endTile);
                if (!canEndMove) {
                    path.pop();
                }
                this.hero.autoMove(path, canEndMove, endTile, (tile: Vec2) => {
                    return this.collisionSystem.collision(tile);
                });
            } else {
                GameManager.UI.showToast("无效路径");
            }
        }
    }

    private printPath(path: Vec2[]) {
        path.forEach((element) => {
            console.log(element.x, element.y);
        });
        console.log("************************");
    }

    /** 碰撞结束 */
    private collisionComplete() {
        this.hero.heroMoving = false;
    }
}
