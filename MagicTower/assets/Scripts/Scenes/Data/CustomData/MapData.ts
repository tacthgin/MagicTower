import { BaseData } from "../../../Framework/Base/BaseData";
import { Fn } from "../../../Framework/Util/Fn";
import { StairType } from "./Element";
import { LevelData } from "./levelData";

export enum MapEvent {
    ADD_ELEMENT,
    REMOVE_ELELEMENT,
    SWITCH_LEVEL,
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

    setLevelDiff(diff: number) {
        let newLevel = this.data.currentLevel + diff;
        if (newLevel > 50 || newLevel < 0) {
            console.error(`level${newLevel}不合法`);
            return;
        }
        let currentLevel = this.data.currentLevel;
        this.data.currentLevel = newLevel;
        //如果是上去的，英雄站到下楼梯的旁边
        this.emit(MapEvent.SWITCH_LEVEL, currentLevel, diff > 0 ? StairType.Down : StairType.UP);
    }

    getCurrentLevelData(): LevelData {
        return this.data.maps[this.data.currentLevel];
    }

    getLevelData(level: number): LevelData {
        return this.data.maps[level] || null;
    }

    /**
     * 创建层数据
     * @param level 层等级
     * @param properties 层地图属性
     * @param data 额外数据
     * @returns 层数据
     */
    createLevelData(level: number, properties: any, data: any = null) {
        let levelData = new LevelData(level);
        levelData.loadProperties(properties, data);
        this.data.maps[level] = levelData;
        return levelData;
    }

    load(info: any = null) {
        if (info) {
            this.data.currentLevel = info.currentLevel;
            for (let level in info.maps) {
                this.data.maps[level] = new LevelData(parseInt(level));
                this.data.maps[level].load(info.maps[level]);
            }
        }
    }
}
