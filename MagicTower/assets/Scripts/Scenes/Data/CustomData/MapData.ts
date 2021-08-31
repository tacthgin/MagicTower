import { Vec2 } from "cc";
import { BaseData, BaseLoadData } from "../../../Framework/Base/BaseData";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { Fn } from "../../../Framework/Util/Fn";
import { Door, DoorState, Element, Stair, StairType } from "./Element";

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

    createLevelData(level: number, properties: any) {
        let levelData = new LevelData();
        levelData.level = level;
        levelData.loadProperties(properties);
        this.data.maps[level] = levelData;
        return levelData;
    }

    getElement(layerName: string, tile: Vec2) {
        let levelData = this.data.maps[this.data.currentLevel];
        if (levelData) {
        }
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
                    this.parseDoor(propertiesInfo);
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

    private parseDoor(propertiesInfo: any) {
        let doorInfos: any = {};
        let propertiesValue: string = null!;
        for (let key in propertiesInfo) {
            propertiesValue = propertiesInfo[key];
            switch (key) {
                case "monsterCondtion":
                    {
                        let indexes: string[] = (propertiesValue as string).split(":");
                        let door = new Door();
                        door.doorState = DoorState.CONDITION;
                        door.value = parseInt(indexes[1]);
                        doorInfos[indexes[0]] = door;
                    }
                    break;
                case "appearEvent":
                    {
                        let door = new Door();
                        door.doorState = DoorState.APPEAR_EVENT;
                        //事件id
                        door.value = parseInt(propertiesValue);
                        doorInfos["event"] = door;
                    }
                    break;
                case "disappearEvent":
                    {
                        let infos = propertiesValue.split(":");
                        let data = {
                            doorTiles: infos[0].split(",").map((tile) => {
                                return parseInt(tile);
                            }),
                            eventID: parseInt(infos[1]),
                            monsterTiles: infos[2].split(",").map((tile) => {
                                return parseInt(tile);
                            }),
                        };
                        let door = new Door();
                        door.doorState = DoorState.DISAPPEAR_EVENT;
                        door.value = data;
                        doorInfos["event"] = door;
                    }
                    break;
                default:
                    {
                        let door = new Door();
                        switch (key) {
                            case "passive":
                                door.doorState = DoorState.PASSIVE;
                                break;
                            case "appear":
                                door.doorState = DoorState.APPEAR;
                            case "hide":
                                door.doorState = DoorState.HIDE;
                                break;
                        }
                        doorInfos[propertiesValue] = door;
                    }
                    break;
            }
        }
        this.layerInfo["door"] = doorInfos;
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

    getStair(type: StairType): Stair {
        return this.layerInfo["stair"][type] || null;
    }
}
