import { director, js, TiledMap, TiledMapAsset, Vec2, _decorator } from "cc";
import { LevelData } from "../../../Data/CustomData/MapData";
import { Astar, AstarMap } from "../AI/Astar";

const { ccclass } = _decorator;

const MAP_ANIMATION_INTERVAL = 0.02;

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
    private levelData: LevelData = null;

    public set astarMoveType(value: AstarMoveType) {
        this._astarMoveType = value;
    }

    start() {
        this.openTileAnimation(["obstacle", "monster", "npc"]);
    }

    init(tiledMapAsset: TiledMapAsset) {
        if (!tiledMapAsset.isValid) {
            console.error(`${tiledMapAsset.name}不合法`);
            return;
        }
        this.tmxAsset = tiledMapAsset;
    }

    /** tile索引 */
    getTileIndex(pos: Vec2) {
        return Math.floor(pos.y) * this.getMapSize().width + Math.floor(pos.x);
    }

    getTile(index: number) {
        let size = this.getMapSize();
        return new Vec2(index % size.width, Math.floor(index / size.width));
    }

    getPositionAt(tile: Vec2) {
        let layers = this.getLayers();
        if (layers[0]) {
            return layers[0].getPositionAt(tile);
        } else {
            return null;
        }
    }

    getTileInfo(tile: Vec2, layerName?: string) {
        let layer = null;
        if (layerName) {
            layer = this.getLayer(layerName);
        } else {
            this.getLayers().forEach((tiledLayer) => {
                if (tiledLayer.getTileGIDAt(tile.x, tile.y) != 0) {
                    layer = tiledLayer;
                }
            });
        }

        if (!layer) {
            return {
                layerName: layer.getLayerName(),
                spriteFrame: layer.getTexture(this.getTileIndex(tile)),
            };
        }

        return null;
    }

    setTileGIDAt(layerName: string, tile: Vec2, gid: number) {
        let layer = this.getLayer(layerName);
        if (layer) {
            if (layer.getTileGIDAt(tile.x, tile.y) != gid) {
                if (layerName in this.animationTiles) {
                    gid += this.animationCount;
                }
                layer.setTileGIDAt(gid, tile.x, tile.y);
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

    getLayersProperties(): any {
        let layers = this.getLayers();
        let layersProperties = {};
        let properties = null;
        layers.forEach((layer) => {
            properties = layer.getProperties();
            if (properties) {
                layersProperties[layer.getLayerName()] = properties;
            }
        });

        return layersProperties;
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
        let tiles = {};
        for (let i = 0; i < layerNames.length; i++) {
            let layer = this.getLayer(layerNames[i]);
            if (!layer) {
                continue;
            }
            let gidInfos = {};
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
                this.getLayer(layerName).setTileGIDAt(this.animationTiles[layerName][index] + gidDiff, tileIndex % size.width, Math.floor(tileIndex / size.width));
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
                    if (!this.levelData.canHeroMove(tile)) return false;

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
