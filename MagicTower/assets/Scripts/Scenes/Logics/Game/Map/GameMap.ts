import { js, TiledMap, TiledMapAsset, Vec2, _decorator } from "cc";
const { ccclass } = _decorator;

@ccclass("GameMap")
export class GameMap extends TiledMap {
    /**动画tile */
    private animationTiles: any = {};
    /** 单双计数 */
    private animationCount: number = 0;

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

    setTileGIDAt(layerName: string, tile: Vec2, gid: number) {
        let layer = this.getLayer(layerName);
        if (layer) {
            if (layer.getTileGIDAt(tile.x, tile.y) != gid) {
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
        }
    }

    private getAnimationTiles(layerNames: string[], selectGids: number[][]) {
        let tiles = {};
        for (let i = 0; i < layerNames.length; i++) {
            let layer = this.getLayer(layerNames[i]);
            if (!layer) {
                continue;
            }
            let gidInfos = {};
            let selects = selectGids[i];
            let gid = 0;
            let selectFunc = null;
            if (selects && selects.length > 0) {
                selectFunc = (gid: number) => {
                    return gid != 0 && selects.indexOf(gid) != -1;
                };
            } else {
                selectFunc = (gid: number) => {
                    return gid != 0;
                };
            }
            for (let j = 0; j < layer.tiles.length; j++) {
                gid = layer.tiles[j];
                if (selectFunc(gid)) {
                    gidInfos[j] = gid;
                }
            }
            if (!js.isEmptyObject(gidInfos)) {
                tiles[layerNames[i]] = gidInfos;
            }
        }

        return tiles;
    }

    /** 开启tile动画 */
    openTileAnimation(layerNames: string[], selectGids: number[][], interval: number = 0.02) {
        this.animationTiles = this.getAnimationTiles(layerNames, selectGids);
        if (!js.isEmptyObject(this.animationTiles)) {
            this.schedule(this.tilesAnimationTimer, interval);
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
                this.getLayer(layerName).setTileGIDAt(
                    this.animationTiles[layerName][index] + gidDiff,
                    tileIndex % size.width,
                    Math.floor(tileIndex / size.width)
                );
            }
        }
    }
}
