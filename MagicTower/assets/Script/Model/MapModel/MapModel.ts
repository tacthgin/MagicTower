import { IVec2 } from "cc";
import { GameFrameworkLog } from "../../../GameFramework/Script/Base/Log/GameFrameworkLog";
import { ModelBase } from "../../../GameFramework/Script/MVC/Model/ModelBase";
import { ModelManager } from "../../../GameFramework/Script/MVC/Model/ModelManager";
import { Utility } from "../../../GameFramework/Script/Utility/Utility";
import { StairType } from "./Data/Elements/Stair";
import { LevelData } from "./Data/LevelData";
import { LevelTempData } from "./Data/LevelTempData";
import { MapJumpLevelEventArgs, MapSwitchLevelEventArgs } from "./MapModelEventArgs";

@ModelManager.registerModel("MapModel")
export class MapModel extends ModelBase {
    private readonly MIN_LEVEL: number = 0;
    private readonly MAX_LEVEL: number = 50;
    @ModelBase.saveMark
    private currentLevel: number = 1;
    @ModelBase.saveMark
    private maps: { [key: number | string]: LevelData } = {};
    /** 跨层事件缓存 */
    @ModelBase.saveMark
    private _levelEventCache: { [level: number | string]: number } = {};

    private levelTempDatas: { [key: number | string]: LevelTempData } = {};

    set level(value) {
        this.currentLevel = value;
    }

    get level() {
        return this.currentLevel;
    }

    canSwitchLevel(diff: number, useFeather: boolean = false): boolean {
        let minLevel = useFeather ? this.MIN_LEVEL : 1;
        let level = this.level + diff;
        return level >= minLevel && level <= this.MAX_LEVEL;
    }

    canReachLevel(diff: number): boolean {
        let level = this.level + diff;
        return !!this.maps[level];
    }

    setLevelDiff(diff: number): void {
        let newLevel = this.currentLevel + diff;
        if (newLevel > this.MAX_LEVEL || newLevel < this.MIN_LEVEL) {
            GameFrameworkLog.error(`level${newLevel}不合法`);
            return;
        }
        let currentLevel = this.currentLevel;
        this.currentLevel = newLevel;
        //如果是上去的，英雄站到下楼梯的旁边
        this.fire(MapSwitchLevelEventArgs.create(currentLevel, diff > 0 ? StairType.Down : StairType.UP));
    }

    jumpLevel(level: number, heroTile: IVec2) {
        let currentLevel = this.currentLevel;
        this.currentLevel = level;
        this.fire(MapJumpLevelEventArgs.create(currentLevel, heroTile));
    }

    getCurrentLevelData(): LevelData {
        return this.maps[this.currentLevel];
    }

    getLevelData(level: number): LevelData {
        return this.maps[level] || null;
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
        this.maps[level] = levelData;
        this.levelTempDatas[level] = new LevelTempData(level, levelData, data);
        return levelData;
    }

    onLoad(info: any = null) {
        this.clearData();
        if (info) {
            this.currentLevel = info.currentLevel;
            for (let level in info.maps) {
                this.maps[level] = new LevelData(parseInt(level));
                this.maps[level].load(info.maps[level]);
            }
        }

        this.useTestLoad();
    }

    /**
     * 添加跨层事件
     * @param level 需要发生事件的层
     * @param eventId 事件id
     */
    addLevelEvent(level: number | string, eventId: number) {
        this._levelEventCache[level] = eventId;
    }

    /**
     * 获取并移除跨层事件
     * @returns 事件id
     */
    removeLevelEvent(level: number): number | null {
        let eventId = this._levelEventCache[level];
        if (eventId) {
            delete this._levelEventCache[level];
            return eventId;
        } else {
            return null;
        }
    }

    private clearData() {
        this.currentLevel = 1;
        this.maps = {};
    }

    private useTestLoad() {
        let useTestload = Utility.Json.getJsonElement("global", "useTestLoad");
        if (useTestload) {
            let testLoadData: any = Utility.Json.getJsonElement("global", "testLoad");
            if (testLoadData) {
                this.loadData(testLoadData.map);
            } else {
                GameFrameworkLog.error("hero model test laod data is null");
            }
        }
    }
}
