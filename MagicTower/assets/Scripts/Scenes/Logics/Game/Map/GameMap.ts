import { director, js, math, size, TiledLayer, TiledMap, TiledMapAsset, v2, Vec2, _decorator } from "cc";
import { AstarMap } from "../../../../Framework/Lib/Custom/Astar";
import { LevelData } from "../../../Data/CustomData/MapData";

const { ccclass } = _decorator;

const MAP_ANIMATION_INTERVAL = 0.1;

export enum AstarMoveType {
    HERO,
    MONSTER,
}

@ccclass("GameMap")
export class GameMap extends TiledMap implements AstarMap {
    /**动画tile */
    private animationTiles: any = {};
    /** 单双计数 */
    private animationCount: number = 0;
    /** a*行走方式 */
    private _astarMoveType: AstarMoveType = AstarMoveType.HERO;
    private levelData: LevelData | null = null;
    private gameSize: math.Size = null!;
    private gidToSpriteFrameMap: { [key: number]: string } = {};
    private spriteFrameToGidMap: { [key: string]: number } = {};

    public set astarMoveType(value: AstarMoveType) {
        this._astarMoveType = value;
    }

    start() {
        this.openTileAnimation(["obstacle", "monster", "npc"]);
    }

    init(tiledMapAsset: TiledMapAsset | null) {
        if (!tiledMapAsset || !tiledMapAsset.isValid) {
            console.error(`${tiledMapAsset ? tiledMapAsset.name : "空的资源"}不合法`);
            return;
        }
        this.tmxAsset = tiledMapAsset;
        this.gameSize = size(this._mapSize.width * this._tileSize.width, this._mapSize.height * this._tileSize.height);
        this._tilesets.forEach((tilesetInfo) => {
            this.gidToSpriteFrameMap[tilesetInfo.firstGid] = tilesetInfo.sourceImage!.name;
            this.spriteFrameToGidMap[tilesetInfo.sourceImage!.name] = tilesetInfo.firstGid;
        });
    }

    /** tile索引 */
    getTileIndex(tile: Vec2) {
        return Math.floor(tile.y) * this.getMapSize().width + Math.floor(tile.x);
    }

    /** 索引转到tile */
    getTile(index: number) {
        let size = this.getMapSize();
        return new Vec2(index % size.width, Math.floor(index / size.width));
    }

    /** cocos坐标转换为屏幕坐标 */
    toScreen(position: Vec2) {
        return v2(this.gameSize.width * 0.5 + position.x, this.gameSize.height * 0.5 - position.y);
    }

    /** cocos坐标转换为tile坐标 */
    toTile(position: Vec2) {
        position = this.toScreen(position);
        return v2(Math.floor(position.x / this._tileSize.width), Math.floor(position.y / this._tileSize.height));
    }

    getPositionAt(tile: Vec2) {
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

    getTileInfo(tile: Vec2, layerName?: string) {
        console.log(tile);
        let layer: TiledLayer | null = null;
        let gid: number | null = 0;
        if (layerName) {
            layer = this.getLayer(layerName);
        } else {
            this.getLayers().forEach((tiledLayer) => {
                gid = tiledLayer.getTileGIDAt(tile.x, tile.y);
                if (gid && gid != 0) {
                    layer = tiledLayer;
                }
            });
        }

        if (layer) {
            let spriteName = this.gidToSpriteFrameMap[gid];
            return {
                layerName: layer.getLayerName(),
                spriteName: spriteName,
            };
        }

        return { layerName: null, spriteFrame: null };
    }

    setTileGIDAt(layerName: string, tile: Vec2, gid: number | null) {
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
            console.error(`找不到layer:${layerName}`);
        }
    }

    getTileGIDAt(layerName: string, tile: Vec2) {
        let layer = this.getLayer(layerName);
        return layer ? layer.getTileGIDAt(tile.x, tile.y) : null;
    }

    getSrcTileGIDAt(layerName: string, tile: Vec2) {
        let gid = this.getTileGIDAt(layerName, tile);
        if (gid != null && layerName in this.animationTiles) {
            return gid - this.animationCount;
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

    getGidByName(name: string) {
        return this.spriteFrameToGidMap[name] || null;
    }

    private updateAnimationTiles(layerName: string, tile: Vec2, gid: number) {
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
        let tiles = {} as { [key: string]: any };
        for (let i = 0; i < layerNames.length; i++) {
            let layer = this.getLayer(layerNames[i]);
            if (!layer) {
                continue;
            }
            let gidInfos = {} as { [key: number]: number };
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

    /** 开启tile动画 */
    openTileAnimation(layerNames: string[]) {
        this.animationTiles = this.getAnimationTiles(layerNames);
        if (this.canOpenTileAnimation()) {
            this.schedule(this.tilesAnimationTimer, MAP_ANIMATION_INTERVAL);
        }
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

    loadLevelData(levelData: LevelData) {
        for (let layerName in levelData.appearTile) {
            let appearInfo = levelData.appearTile[layerName];
            for (let index in appearInfo) {
                this.setTileGIDAt(layerName, this.getTile(parseInt(index)), appearInfo[index]);
            }
        }

        for (let layerName in levelData.disappearTile) {
            let disappearInfo = levelData.disappearTile[layerName];
            for (let index in disappearInfo) {
                this.setTileGIDAt(layerName, this.getTile(parseInt(index)), 0);
            }
        }
        this.levelData = levelData;
    }

    isEmpty(tile: Vec2, endTile: Vec2): boolean {
        let { layerName } = this.getTileInfo(tile);
        switch (this._astarMoveType) {
            case AstarMoveType.HERO:
                {
                    if (!this.levelData?.canHeroMove(tile)) return false;

                    if (!tile.equals(endTile)) {
                        //中途过程遇到事件也可以走
                        return layerName == "floor" || layerName == "event" || layerName == "prop";
                    }
                }
                break;
            case AstarMoveType.MONSTER: {
                return layerName == "floor" || layerName == "monster" || layerName == "event" || layerName == "stair";
            }
            default:
                break;
        }

        return true;
    }
}
