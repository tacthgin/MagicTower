import { Vec2 } from "cc";
import { BaseData, BaseLoadData } from "../../../Framework/Base/BaseData";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { Fn } from "../../../Framework/Util/Fn";
import { Door, Element, Stair } from "./Element";

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

export enum StairType {
    UP,
    Down,
}

export class LevelData extends BaseLoadData {
    private _level: number = 0;
    /** 出现的tile */
    private _appearTile: any = {};
    /** 消失的tile */
    private _disappearTile: any = {};
    /** 层元素信息 */
    private layerInfo: any = {};

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
        mapData?.emit(MapEvent.ADD_ELEMENT, this._level, layerName, index, info);
    }

    load(info: any) {
        this.loadData(info);
    }

    loadProperties(properties: any) {
        let propertiesInfo = null;
        for (let layerName in properties) {
            propertiesInfo = properties[layerName];
            switch (layerName) {
                case "door":
                    let doorInfos: any = {};
                    for (let key in propertiesInfo) {
                        switch (key) {
                            case "passive":
                            case "appear":
                                propertiesInfo[key].forEach((index: number) => {
                                    let door = new Door();
                                    (door as any)[key] = true;
                                    doorInfos[index] = door;
                                });
                                break;
                            case "hide":
                                {
                                    let door = new Door();
                                    door.hide = true;
                                    doorInfos[propertiesInfo[key]] = door;
                                }
                                break;
                            case "monsterCondtion":
                                {
                                    let indexes: string[] = (propertiesInfo[key] as string).split(":");
                                    let door = new Door();
                                    door.condition = true;
                                    doorInfos[indexes[0]] = door;
                                }
                                break;
                        }
                    }
                    this.layerInfo[layerName] = doorInfos;
                    break;
                case "stair":
                    let stairs: Stair[] = [];
                    let location = propertiesInfo["location"].split(",");
                    for (let i = 0; i < 2; i++) {
                        if (location[i] != "0") {
                            let stair = new Stair();
                            if (location[i + 2]) {
                                stair.levelDiff = parseInt(location[i + 2]);
                            }
                            stair.standLocation = parseInt(location[i]);
                            stairs[i] = stair;
                        }
                    }
                    if (propertiesInfo["hide"]) {
                        stairs[0].hide = true;
                    }
                    this.layerInfo[layerName] = stairs;
                    break;
                case "monster":
                    break;
                case "event":
                    let eventInfo: { [key: string]: Element } = {};
                    for (let index in propertiesInfo) {
                        let element = new Element();
                        element.id = parseInt(propertiesInfo[index]);
                        eventInfo[index] = element;
                    }
                    break;
            }
        }
    }

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

    getStair(type: StairType) {
        return this.layerInfo["stair"][type] || null;
    }
}
