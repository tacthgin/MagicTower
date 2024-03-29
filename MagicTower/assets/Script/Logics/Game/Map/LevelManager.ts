import { Component, instantiate, Node, Prefab, TiledMapAsset, Touch, tween, UIOpacity, v3, Vec2, _decorator } from "cc";
import { GameApp } from "../../../../GameFramework/Application/GameApp";
import { IVec2 } from "../../../../GameFramework/Script/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../../GameFramework/Script/Base/Log/GameFrameworkLog";
import { Stair } from "../../../Model/MapModel/Data/Elements/Stair";
import { MapEvent } from "../../../Model/MapModel/MapEvent";
import { MapModel } from "../../../Model/MapModel/MapModel";
import { MapJumpLevelEventArgs, MapSwitchLevelEventArgs } from "../../../Model/MapModel/MapModelEventArgs";
import { SaveEvent } from "../../../Model/SaveModel/SaveEvent";
import { SaveModel } from "../../../Model/SaveModel/SaveModel";
import { LoadArchiveEventArgs } from "../../../Model/SaveModel/SaveModelEventArgs";
import { CommonEventArgs } from "../../Event/CommonEventArgs";
import { GameEvent } from "../../Event/GameEvent";
import { SceneAppearEventArgs } from "../../Event/SceneAppearEventArgs";
import { MapCollisionSystem } from "../System/MapCollisionSystem";
import { GameMap } from "./GameMap/GameMap";
import { Hero } from "./Hero/Hero";

const { ccclass, type } = _decorator;

@ccclass("LevelManager")
export class LevelManager extends Component {
    /** 地图层 */
    @type(Node)
    private mapLayer: Node = null!;
    /** 英雄层 */
    @type(Node)
    private heroLayer: Node = null!;
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
    /** 地图主逻辑系统 */
    private collisionSystem: MapCollisionSystem = null!;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        this.mapModel = GameApp.getModel(MapModel);
        this.mapModel.subscribe(MapEvent.SWITCH_LEVEL, this.onSwitchLevel, this);
        this.mapModel.subscribe(MapEvent.JUMP_LEVEL, this.onJumpLevel, this);

        let saveModel = GameApp.getModel(SaveModel);
        saveModel.subscribe(SaveEvent.LOAD_ARCHIVE, this.onLoadArchive, this);

        let eventManager = GameApp.EventManager;
        eventManager.subscribe(GameEvent.SCENE_APPEAR, this.onSceneAppear, this);
        eventManager.subscribe(GameEvent.SCENE_DISAPPEAR, this.onSceneDisappear, this);

        this.collisionSystem = GameApp.CommandManager.createSystem(MapCollisionSystem);
    }

    onDestroy() {
        this.mapModel.unsubscribeTarget(this);
        GameApp.EventManager.unsubscribeTarget(this);
        GameApp.CommandManager.destroySystem(this.collisionSystem);
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
        GameApp.getModel(SaveModel).loadArchive();
    }

    private createMap(level: number): GameMap {
        if (!this.maps[level]) {
            let mapNode = instantiate(this.mapPrefab);
            mapNode.position = v3(0, 0, 0);
            mapNode.parent = this.mapLayer;
            let gameMap = mapNode.getComponent(GameMap)!;
            gameMap.init(GameApp.ResourceManager.getAsset(`TiledMap/${level}`, TiledMapAsset));
            this.maps[level] = gameMap;

            let levelData = this.mapModel.getLevelData(level);
            if (!levelData) {
                let selectLayers = ["door", "stair", "monster", "npc", "prop"];
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
            gameMap.openTileAnimation(["building", "monster", "npc", "lava"]);
        }
        return this.maps[level];
    }

    private getCurrentMap(): GameMap | null {
        return this.maps[this.mapModel.level] || null;
    }

    private onLoadArchive(sender: object, event: LoadArchiveEventArgs) {
        this.clearMap();
        let currentLevel = this.mapModel.level;
        this.createMap(currentLevel);
        this.showHero();
    }

    private onSwitchLevel(sender: object, eventArgs: MapSwitchLevelEventArgs) {
        this.maps[eventArgs.level].node.active = false;
        let newMap = this.createMap(this.mapModel.level);
        newMap.node.active = true;
        let levelData = this.mapModel.getCurrentLevelData();
        this.showHero(newMap.getTile(levelData.getStair(eventArgs.stairType)!.standLocation));
        GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
    }

    private onJumpLevel(sender: object, eventArgs: MapJumpLevelEventArgs) {
        this.maps[eventArgs.level].node.active = false;
        let newMap = this.createMap(this.mapModel.level);
        newMap.node.active = true;
        this.showHero(eventArgs.heroTile);
        GameApp.EventManager.fireNow(this, CommonEventArgs.create(GameEvent.COLLISION_COMPLETE));
    }

    private onSceneAppear(sender: object, eventArgs: SceneAppearEventArgs) {
        this.mapModel.level = eventArgs.level;
        let newMap = this.createMap(this.mapModel.level);
        newMap.node.active = true;
        this.heroLayer.getComponent(UIOpacity)!.opacity = 255;
        this.showHero(eventArgs.tile);
    }

    private onSceneDisappear(sender: object, eventArgs: CommonEventArgs) {
        let gameMap = this.getCurrentMap();
        if (gameMap) {
            gameMap.node.active = false;
            tween(this.heroLayer.getComponent(UIOpacity)).to(1, { opacity: 0 }).start();
        }
    }

    private showHero(tile: IVec2 | null = null) {
        if (!this.hero) {
            let heroNode = instantiate(this.heroPrefab);
            this.hero = heroNode.getComponent(Hero)!;
        }
        let map = this.maps[this.mapModel.level];
        this.hero.node.parent = this.heroLayer;
        this.hero.init(map, tile);
        this.collisionSystem.initliaze(map, this.hero);
    }

    private moveHero(touchPos: Vec2) {
        let currentMap: GameMap | null = this.getCurrentMap();
        if (!currentMap) {
            GameFrameworkLog.error("当前移动没有地图");
            return;
        }
        this.collisionSystem.moveHero(touchPos);
    }

    private clearMap() {
        for (let level in this.maps) {
            this.maps[level].destroy();
        }
        this.maps = {};
    }
}
