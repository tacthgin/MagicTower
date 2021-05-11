import { BaseData } from "../../../Framework/Base/BaseData";
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

export class LevelData {
    private levelInfo: any = {};

    private emitEvent(layerName: string, index: number, info: any = null) {
        let mapData = GameManager.DATA.getData(MapData);
        mapData.emit(MapEvent.ADD_ELEMENT, this.levelInfo.level, layerName, index, info);
    }

    loadInfo(info: any) {
        this.levelInfo = info;
    }

    setLevel(level: number) {
        this.levelInfo.level = level;
    }

    setAppear(layerName: string, index: number, info: any = null) {
        if (!this.levelInfo[layerName]) {
            this.levelInfo[layerName] = {
                appear: {},
            };
        }
        let appearInfo = this.levelInfo[layerName].appear;
        appearInfo[index] = info || 1;
        this.emitEvent(layerName, index, info);
    }

    setDisappear(layerName: string, index: number, info: any = null) {
        if (!this.levelInfo[layerName]) {
            this.levelInfo[layerName] = {
                disappear: {},
            };
        }
        let disappearInfo = this.levelInfo[layerName].disappear;
        disappearInfo[index] = info || 1;
        this.emitEvent(layerName, index, info);
    }
}
