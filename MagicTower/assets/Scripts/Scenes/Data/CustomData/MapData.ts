import { BaseData } from "../../../Framework/Base/BaseData";
import { Fn } from "../../../Framework/Util/Fn";

/** 地图存档 */
@Fn.registerClass("MapData")
export class MapData extends BaseData {
    private currentLevel: number = 1;

    private maps: any = {};

    set level(value) {
        this.currentLevel = value;
    }

    get level() {
        return this.currentLevel;
    }

    getLevelInfo(level: number) {
        if (!this.maps[level]) {
            this.maps[level] = new LevelData();
        }
        return this.maps[level];
    }

    load(info: any = null) {
        if (info) {
            this.currentLevel = info.currentLevel;
            for (let level in info.maps) {
                this.maps[level] = new LevelData();
                this.maps[level].load(info.maps[level]);
            }
        }
    }
}

export class LevelData {
    private levelInfo: any = {};

    loadInfo(info: any) {
        this.levelInfo = info;
    }

    setAppear(layerName: string, index: number, info: any = null) {
        if (!this.levelInfo[layerName]) {
            this.levelInfo[layerName] = {
                appear: {},
            };
        }
        this.levelInfo["appear"][index] = info || 1;
    }

    setDisappear(layerName: string, index: number, info: any = null) {
        if (!this.levelInfo[layerName]) {
            this.levelInfo[layerName] = {
                disappear: {},
            };
        }
        this.levelInfo["disappear"][index] = info || 1;
    }
}
