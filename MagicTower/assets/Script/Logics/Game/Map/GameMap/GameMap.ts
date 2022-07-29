import { director, js, math, size, TiledLayer, TiledMap, TiledMapAsset, TiledTile, v2, Vec2, _decorator } from "cc";
import { GameFrameworkError } from "../../../../../GameFramework/Script/Base/GameFrameworkError";
import { IVec2 } from "../../../../../GameFramework/Script/Base/GameStruct/IVec2";
import { GameFrameworkLog } from "../../../../../GameFramework/Script/Base/Log/GameFrameworkLog";
import { LevelData } from "../../../../Model/MapModel/Data/LevelData";
import { CheckType, IGameMap } from "./IGameMap";

const { ccclass } = _decorator;

const MAP_ANIMATION_INTERVAL = 0.1;

@ccclass("GameMap")
export class GameMap extends TiledMap implements IGameMap {
    /**动画tile */
    private animationTiles: any = {};
    /** 单双计数 */
    private animationCount: number = 0;
    private gameSize: math.Size = null!;
    private gidToSpriteNameMap: { [key: number]: string } = {};
    private spriteNameToGidMap: { [key: string]: number } = {};
    private checkDelegate: CheckType | null = null;

    get width(): number {
        return this.getMapSize().width;
    }

    get height(): number {
        return this.getMapSize().height;
    }

    init(tiledMapAsset: TiledMapAsset | null) {
        if (!tiledMapAsset || !tiledMapAsset.isValid) {
            GameFrameworkLog.error(`${tiledMapAsset ? tiledMapAsset.name : "空的资源"}不合法`);
            return;
        }
        this.tmxAsset = tiledMapAsset;
        this.gameSize = size(this._mapSize.width * this._tileSize.width, this._mapSize.height * this._tileSize.height);
        this._tilesets.forEach((tilesetInfo) => {
            this.gidToSpriteNameMap[tilesetInfo.firstGid] = tilesetInfo.sourceImage!.name;
            this.spriteNameToGidMap[tilesetInfo.sourceImage!.name] = tilesetInfo.firstGid;
        });
    }

    /** tile索引 */
    getTileIndex(tile: IVec2): number {
        return Math.floor(tile.y) * this.getMapSize().width + Math.floor(tile.x);
    }

    /** 索引转到tile */
    getTile(index: number): IVec2 {
        let size = this.getMapSize();
        return new Vec2(index % size.width, Math.floor(index / size.width));
    }

    /** cocos坐标转换为屏幕坐标 */
    toScreen(position: IVec2): IVec2 {
        return v2(this.gameSize.width * 0.5 + position.x, this.gameSize.height * 0.5 - position.y);
    }

    /** cocos坐标转换为tile坐标 */
    toTile(position: IVec2): IVec2 {
        position = this.toScreen(position);
        return v2(Math.floor(position.x / this._tileSize.width), Math.floor(position.y / this._tileSize.height));
    }

    getPositionAt(tile: IVec2): IVec2 | null {
        let layers = this.getLayers();
        if (layers[0]) {
            /** 只能获取gl坐标 */
            let position = layers[0].getPositionAt(tile)!;
            //转换为格子中心的cocos坐标
            position.x -= (this.gameSize.width - this._tileSize.width) * 0.5;
            position.y -= (this.gameSize.height - this._tileSize.height) * 0.5;
            return position;
        } else {
            return null;
        }
    }

    getTileInfo(tile: IVec2, layerName?: string) {
        let layer: TiledLayer | null = null;
        let selectGid: number = 0;
        if (layerName) {
            layer = this.getLayer(layerName);
        } else {
            this.getLayers().forEach((tiledLayer) => {
                let gid = tiledLayer.getTileGIDAt(tile.x, tile.y);
                if (gid) {
                    layer = tiledLayer;
                    selectGid = gid;
                }
            });
        }

        if (layer) {
            let spriteName = this.gidToSpriteNameMap[selectGid];
            return {
                layerName: layer.getLayerName(),
                spriteName: spriteName,
            };
        }

        return null;
    }

    setTileGIDAt(layerName: string, tile: IVec2, gid: number | null) {
        if (gid == null) return;
        let layer = this.getLayer(layerName);
        if (layer) {
            if (layer.getTileGIDAt(tile.x, tile.y) != gid) {
                if (gid != 0) {
                    if (layerName in this.animationTiles) {
                        gid += this.animationCount;
                    }
                }
                layer.setTileGIDAt(gid, tile.x, tile.y);
                layer.markForUpdateRenderData(true);
                this.updateAnimationTiles(layerName, tile, gid);
            }
        } else {
            GameFrameworkLog.error(`找不到layer:${layerName}`);
        }
    }

    getTileGIDAt(layerName: string, tile: IVec2) {
        let layer = this.getLayer(layerName);
        if (layer) {
            let gid = layer.getTileGIDAt(tile.x, tile.y);
            if (gid && layerName in this.animationTiles) {
                gid -= this.animationCount;
                return gid;
            }
        }
        return null;
    }

    getTiledTileAt(layerName: string, tile: IVec2, forceCreate?: boolean) {
        let layer = this.getLayer(layerName);
        if (layer) {
            return layer.getTiledTileAt(tile.x, tile.y, forceCreate);
        }

        return null;
    }

    setTiledTileAt(layerName: string, tile: IVec2, tiledTile: TiledTile | null) {
        let layer = this.getLayer(layerName);
        if (layer) {
            return layer.setTiledTileAt(tile.x, tile.y, tiledTile);
        }

        return null;
    }

    getLayersProperties() {
        let layers = this.getLayers();
        let layersProperties = {} as { [key: string]: any };
        let properties = null;
        layers.forEach((layer) => {
            properties = layer.getProperties();
            if (properties) {
                layersProperties[layer.getLayerName()] = properties;
            }
        });

        return layersProperties;
    }

    getLayersTiles(layerName: string) {
        let layer = this.getLayer(layerName);
        return layer ? layer.tiles : null;
    }

    getGidByName(name: string) {
        return this.spriteNameToGidMap[name] || null;
    }

    getNameByGid(gid: number) {
        return this.gidToSpriteNameMap[gid] || null;
    }

    /** 开启tile动画 */
    openTileAnimation(layerNames: string[]) {
        this.animationTiles = this.getAnimationTiles(layerNames);
        if (this.canOpenTileAnimation()) {
            this.schedule(this.tilesAnimationTimer, MAP_ANIMATION_INTERVAL);
        }
    }

    /**
     * 打开地图动画定时器
     */
    openTileAnimationTimer() {
        if (this.canOpenTileAnimation() && !director.getScheduler().isScheduled(this.tilesAnimationTimer, this)) {
            this.schedule(this.tilesAnimationTimer, MAP_ANIMATION_INTERVAL);
        }
    }

    /**
     * 停止地图动画定时器
     */
    stopTileAnimationTimer() {
        this.unschedule(this.tilesAnimationTimer);
    }

    loadLevelData(levelData: LevelData) {
        for (let layerName in levelData.appearTile) {
            let appearInfo = levelData.appearTile[layerName];
            for (let index in appearInfo) {
                this.setTileGIDAt(layerName, this.getTile(parseInt(index)), appearInfo[index]);
            }
        }

        for (let layerName in levelData.disappearTile) {
            let disappearInfo: number[] = levelData.disappearTile[layerName];
            disappearInfo.forEach((index) => {
                this.setTileGIDAt(layerName, this.getTile(index), 0);
            });
        }
    }

    check(position: IVec2): boolean {
        if (!this.checkDelegate) {
            throw new GameFrameworkError("check delegate is invalid");
        }
        return this.checkDelegate(position);
    }

    setCheckDelegate(callbackfn: CheckType) {
        this.checkDelegate = callbackfn;
    }

    forEachLayer(layerName: string, callbackfn: (gid: number, index: number) => void, thisArg?: any) {
        let tiles = this.getLayersTiles(layerName);
        if (tiles) {
            tiles.forEach((value: number, index: number) => {
                if (value != 0) {
                    callbackfn.call(thisArg, value, index);
                }
            });
            return true;
        }

        return false;
    }

    private updateAnimationTiles(layerName: string, tile: IVec2, gid: number) {
        let animationTiles = this.animationTiles[layerName];

        if (animationTiles) {
            let index = this.getTileIndex(tile);
            if (gid == 0) {
                if (animationTiles[index]) {
                    delete animationTiles[index];
                }
            } else {
                animationTiles[index] = gid;
            }
            if (this.canOpenTileAnimation()) {
                if (!director.getScheduler().isScheduled(this.tilesAnimationTimer, this)) {
                    this.schedule(this.tilesAnimationTimer, MAP_ANIMATION_INTERVAL);
                }
            } else {
                this.unschedule(this.tilesAnimationTimer);
            }
        }
    }

    private getAnimationTiles(layerNames: string[]) {
        let tiles: { [key: string]: any } = {};
        for (let i = 0; i < layerNames.length; i++) {
            let layer = this.getLayer(layerNames[i]);
            if (!layer) {
                continue;
            }
            let gidInfos: { [key: number]: number } = {};
            let gid = 0;
            for (let j = 0; j < layer.tiles.length; j++) {
                gid = layer.tiles[j];
                if (gid != 0) {
                    gidInfos[j] = gid;
                }
            }
            tiles[layerNames[i]] = gidInfos;
        }

        return tiles;
    }

    private canOpenTileAnimation() {
        for (let layerName in this.animationTiles) {
            if (!js.isEmptyObject(this.animationTiles[layerName])) {
                return true;
            }
        }

        return false;
    }

    private tilesAnimationTimer(dt: number) {
        this.animationCount = 1 - this.animationCount;
        let gidDiff = this.animationCount == 1 ? 1 : -1;
        let size = this.getMapSize();
        let tileIndex = 0;
        for (let layerName in this.animationTiles) {
            for (let index in this.animationTiles[layerName]) {
                tileIndex = parseInt(index);
                let layer = this.getLayer(layerName);
                this.animationTiles[layerName][index] += gidDiff;
                layer?.setTileGIDAt(this.animationTiles[layerName][index], tileIndex % size.width, Math.floor(tileIndex / size.width));
                layer?.markForUpdateRenderData(true);
            }
        }
    }
}
