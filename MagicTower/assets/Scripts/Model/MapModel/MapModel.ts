import { ModelBase } from "../../../GameFramework/Scripts/Application/Model/ModelBase";
import { ModelContainer } from "../../../GameFramework/Scripts/Application/Model/ModelContainer";
import { StairType } from "./Data/Elements/Stair";
import { LevelData } from "./Data/LevelData";
import { LevelTempData } from "./Data/LevelTempData";
import { MapSwitchLevelEventArgs } from "./MapModelEventArgs";

@ModelContainer.registerModel("MapModel")
export class MapModel extends ModelBase {
    protected data: any = {
        currentLevel: 1,
        maps: {},
    };

    private levelTempDatas: { [key: number]: LevelTempData } = {};

    set level(value) {
        this.data.currentLevel = value;
    }

    get level() {
        return this.data.currentLevel;
    }

    setLevelDiff(diff: number) {
        let newLevel = this.data.currentLevel + diff;
        if (newLevel > 50 || newLevel < 0) {
            GameFrameworkLog.error(`level${newLevel}不合法`);
            return;
        }
        let currentLevel = this.data.currentLevel;
        this.data.currentLevel = newLevel;
        //如果是上去的，英雄站到下楼梯的旁边
        this.fireNow(MapSwitchLevelEventArgs.create(currentLevel, diff > 0 ? StairType.Down : StairType.UP));
    }

    getCurrentLevelData(): LevelData {
        return this.data.maps[this.data.currentLevel];
    }

    getLevelData(level: number): LevelData {
        return this.data.maps[level] || null;
    }

    getLevelTempData(level: number): LevelTempData {
        return this.levelTempDatas[level] || null;
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
        this.levelTempDatas[level] = new LevelTempData(level, levelData, data);
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
