import { Component, instantiate, Node, Prefab, TiledMapAsset, Touch, UITransform, v2, v3, Vec2, _decorator } from "cc";
import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Scripts/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { MapEvent } from "../../../Model/MapModel/MapEvent";
import { MapModel } from "../../../Model/MapModel/MapModel";
import { MapSwitchLevelEventArgs } from "../../../Model/MapModel/MapModelEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { SceneAppearEventArgs } from "../../Event/SceneAppearEventArgs";
import { MapCollisionSystem } from "../System/MapCollisionSystem";
import { MoveSystem } from "../System/MoveSystem";
import { GameMap } from "./GameMap/GameMap";
import { Hero } from "./Hero/Hero";

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
    private mapModel: MapModel = null!;
    /** 触摸id */
    private touchId: number | null = null;
    private collisionSystem: MapCollisionSystem = null!;
    private moveSystem: MoveSystem = null!;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.mapModel = GameApp.getModel(MapModel)!;
        this.mapModel.subscribe(MapEvent.SWITCH_LEVEL, this.onSwitchLevel, this);

        let eventManager = GameApp.EventManager;
        eventManager.subscribe(GameEvent.SCENE_APPEAR, this.onSceneAppear, this);

        this.collisionSystem = GameApp.CommandManager.createSystem(MapCollisionSystem);
        this.moveSystem = GameApp.CommandManager.createSystem(MoveSystem);
    }

    onDestroy() {
        this.mapModel.unsubscribeTarget(this);
        GameApp.EventManager.unsubscribeTarget(this);
    }

    start() {
        this.loadArchive();
    }

    private onTouchStart(event: Touch) {
        if (this.touchId != null && this.touchId != event.getID()) {
            return;
        }
        this.touchId = event.getID();
        this.moveHero(event.getUILocation());
    }

    private onTouchEnd(event: Touch) {
        if (event.getID() == this.touchId) {
            this.touchId = null;
        }
    }

    private loadArchive() {
        let currentLevel = this.mapModel.level;
        this.createMap(currentLevel);
        this.showHero();
    }

    private createMap(level: number): GameMap {
        if (!this.maps[level]) {
            let mapNode = instantiate(this.mapPrefab);
            mapNode.position = v3(0, 0, 0);
            mapNode.parent = this.layer;
            let gameMap = mapNode.getComponent(GameMap)!;
            gameMap.init(GameApp.ResourceManager.getAsset(`TiledMap/${level}`, TiledMapAsset));
            this.maps[level] = gameMap;

            let levelData = this.mapModel.getLevelData(level);
            if (!levelData) {
                let selectLayers = ["door", "stair", "monster"];
                let selectTiles: { [key: string]: number[] | null } = {};
                selectLayers.forEach((layerName) => {
                    selectTiles[layerName] = gameMap.getLayersTiles(layerName);
                });
                levelData = this.mapModel.createLevelData(level, gameMap.getLayersProperties(), {
                    tiles: selectTiles,
                    parseGid: gameMap.getNameByGid.bind(gameMap),
                });
            }
            gameMap.loadLevelData(levelData);
        }
        return this.maps[level];
    }

    private getCurrentMap(): GameMap | null {
        return this.maps[this.mapModel.level] || null;
    }

    private onSwitchLevel(sender: object, eventArgs: MapSwitchLevelEventArgs) {
        this.maps[eventArgs.level].node.active = false;
        let newMap = this.createMap(this.mapModel.level);
        newMap.node.active = true;
        let levelData = this.mapModel.getCurrentLevelData();
        this.showHero(newMap.getTile(levelData.getStair(eventArgs.stairType)!.standLocation));
    }

    private onSceneAppear(sender: object, eventArgs: SceneAppearEventArgs) {
        this.maps[this.mapModel.level].node.active = false;
        this.mapModel.level = eventArgs.level;
        let newMap = this.createMap(this.mapModel.level);
        newMap.node.active = true;
        this.showHero(eventArgs.tile);
    }

    private showHero(tile: IVec2 | null = null) {
        if (!this.hero) {
            let heroNode = instantiate(this.heroPrefab);
            this.hero = heroNode.getComponent(Hero)!;
        }
        let map = this.maps[this.mapModel.level];
        this.hero.node.parent = map.node;
        this.hero.init(map, tile);
    }

    private moveHero(touchPos: Vec2) {
        let currentMap: GameMap | null = this.getCurrentMap();
        if (!currentMap) {
            GameFrameworkLog.error("当前移动没有地图");
            return;
        }
        if (!this.hero.heroMoving) {
            let localPos = currentMap.node.getComponent(UITransform)?.convertToNodeSpaceAR(v3(touchPos.x, touchPos.y));
            let endTile = currentMap.toTile(v2(localPos?.x, localPos?.y));
            let path = this.moveSystem.getPath(this.hero.heroTile, endTile);

            if (path) {
                let canEndMove = this.collisionSystem.canEndTileMove(endTile);
                if (!canEndMove) {
                    path.pop();
                }
                this.hero.autoMove(path, canEndMove, endTile, (tile: Vec2) => {
                    return this.collisionSystem.collision(tile);
                });
            } else {
                //GameManager.UI.showToast("无效路径");
            }
        }
    }

    /** 碰撞结束 */
    private collisionComplete() {
        this.hero.heroMoving = false;
    }
}
