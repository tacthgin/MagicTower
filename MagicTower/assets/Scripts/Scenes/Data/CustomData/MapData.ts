import { BaseData, BaseLoadData } from "../../../Framework/Base/BaseData";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { Fn } from "../../../Framework/Util/Fn";

export enum MapEvent {
    ADD_ELEMENT,
    REMOVE_ELELEMENT,
}

/** 地图存档 */
@Fn.registerClass("MapData")
export class MapData extends BaseData {
    protected data: any = {
        currentLevel: 1,
        maps: {},
    };

    set level(value) {
        this.data.currentLevel = value;
    }

    get level() {
        return this.data.currentLevel;
    }

    getLevelData(level: number): LevelData {
        return this.data.maps[level] || null;
    }

    load(info: any = null) {
        if (info) {
            this.data.currentLevel = info.currentLevel;
            for (let level in info.maps) {
                this.data.maps[level] = new LevelData();
                this.data.maps[level].load(info.maps[level]);
            }
        }
    }
}

export class LevelData extends BaseLoadData {
    private level: number = 0;
    /** 出现的tile */
    private appearTile: any = {};
    /** 消失的tile */
    private disappearTile: any = {};

    private emitEvent(layerName: string, index: number, info: any = null) {
        let mapData = GameManager.DATA.getData(MapData);
        mapData.emit(MapEvent.ADD_ELEMENT, this.level, layerName, index, info);
    }

    load(info: any) {
        this.loadData(info);
    }

    setLevel(level: number) {
        this.level = level;
    }

    setAppear(layerName: string, index: number, gid: number) {
        if (!this.appearTile[layerName]) {
            this.appearTile[layerName] = {};
        }
        this.appearTile[layerName][index] = gid;
    }

    setDisappear(layerName: string, index: number) {
        if (!this.disappearTile[layerName]) {
            this.disappearTile[layerName] = [];
        }
        this.disappearTile[layerName].push(index);
    }
}
