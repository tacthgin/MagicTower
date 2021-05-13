import { Vec2 } from "cc";
import { BaseData, BaseLoadData } from "../../../Framework/Base/BaseData";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { Fn } from "../../../Framework/Util/Fn";

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
        this.data.currentLevel += diff;
        if (this.data.currentLevel > 50 || this.data.currentLevel < 0) {
            console.error(`level${this.data.currentLevel}不合法`);
            return;
        }
        this.emit(MapEvent.SWITCH_LEVEL);
    }

    getLevelData(level: number): LevelData {
        return this.data.maps[level] || null;
    }

    createLevelData(level: number, properties: any) {
        let levelData = new LevelData();
        levelData.level = level;
        levelData.loadProperties(properties);
        this.data.maps[level] = levelData;
    }

    getElement(tile: Vec2, gid: number) {}

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
    private _level: number = 0;
    /** 出现的tile */
    private _appearTile: any = {};
    /** 消失的tile */
    private _disappearTile: any = {};

    public set level(value: number) {
        this._level = value;
    }

    public get level() {
        return this._level;
    }

    public get appearTile() {
        return this._appearTile;
    }

    public get disappearTile() {
        return this._disappearTile;
    }

    private emitEvent(layerName: string, index: number, info: any = null) {
        let mapData = GameManager.DATA.getData(MapData);
        mapData.emit(MapEvent.ADD_ELEMENT, this._level, layerName, index, info);
    }

    load(info: any) {
        this.loadData(info);
    }

    loadProperties(properties: any) {}

    setAppear(layerName: string, index: number, gid: number) {
        if (!this._appearTile[layerName]) {
            this._appearTile[layerName] = {};
        }
        this._appearTile[layerName][index] = gid;
    }

    setDisappear(layerName: string, index: number) {
        if (!this._disappearTile[layerName]) {
            this._disappearTile[layerName] = [];
        }
        this._disappearTile[layerName].push(index);
    }

    canHeroMove(tile: Vec2) {
        //if ((this.monsterInfo.bigMonster && this.monsterInfo.bigMonster.indexOf(index) != -1) || this.hero.HeroData.Hp <= this.getWizardMagicDamage(index)) return false;
        return true;
    }
}
