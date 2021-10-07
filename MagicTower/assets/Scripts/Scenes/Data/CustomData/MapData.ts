import { Vec2 } from "cc";
import { BaseData, BaseLoadData } from "../../../Framework/Base/BaseData";
import { GameManager } from "../../../Framework/Managers/GameManager";
import { Fn } from "../../../Framework/Util/Fn";
import { Door, DoorState, DoorType, Element, EventInfo, Stair, StairType } from "./Element";

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

export class LevelData extends BaseLoadData {
    //层
    private _level: number = 0;
    /** 出现的tile */
    private _appearTile: any = {};
    /** 消失的tile */
    private _disappearTile: any = {};
    /** 层元素信息 */
    private layerInfo: any = {};

    public get level() {
        return this._level;
    }

    public get appearTile() {
        return this._appearTile;
    }

    public get disappearTile() {
        return this._disappearTile;
    }

    constructor(level: number) {
        super();
        this._level = level;
    }

    saveMapData() {
        // GameManager.DATA.getData(MapData)?.save();
    }

    private emitEvent(layerName: string, index: number, info: any = null) {
        let mapData = GameManager.DATA.getData(MapData);
        mapData?.emit(MapEvent.ADD_ELEMENT, this._level, layerName, index, info);
    }

    load(info: any) {
        this.loadData(info);
        for (let layerName in this.layerInfo) {
            let layerInfo = this.layerInfo[layerName];
            switch (layerName) {
                case "door":
                    for (let key in layerInfo) {
                        let door = new Door();
                        layerInfo[key] = door.load(layerInfo[key]);
                    }
                    break;
                case "stair":
                    for (let i = 0; i < layerInfo.length; i++) {
                        let stair = new Stair();
                        layerInfo[i] = stair.load(layerInfo[i]);
                    }
                    break;
            }
        }
        return this;
    }

    loadProperties(properties: any, data: any = null) {
        let propertiesInfo = null;

        let parsers: { [key: string]: Function } = {
            door: this.parseDoor,
            stair: this.parseStair,
            event: this.parseEvent,
        };
        for (let layerName in properties) {
            let func = parsers[layerName];
            if (func) {
                propertiesInfo = properties[layerName];
                let tilesData = data ? data[layerName] : null;
                func.call(this, propertiesInfo, tilesData);
            } else {
                console.error("没有层属性:", layerName);
            }
        }
    }

    private parseDoor(propertiesInfo: any, data: any = null) {
        let doorInfos: any = {};
        let propertiesValue: string = null!;
        let condition: number[] = [];
        if (data) {
            let tiles: number[] = data.tiles;
            let parseGid = data.parseGid;
            for (let i = 0; i < tiles.length; i++) {
                if (tiles[i] == 0) {
                    continue;
                }
                condition.push(i);
                let name = parseGid(tiles[i]);
                if (name) {
                    name = name.split("_")[0];
                    let doorJson = GameManager.DATA.getJsonParser("door")?.getJsonElementByKey("spriteId", name);
                    if (doorJson && (doorJson.id <= DoorType.RED || doorJson.id == DoorType.WALL)) {
                        let door = new Door();
                        door.id = doorJson.id;
                        doorInfos[i] = door;
                    }
                }
            }
        }
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
                        door.condition = condition;
                        doorInfos["event"] = door;
                    }
                    break;
                case "disappearEvent":
                    {
                        let infos = propertiesValue.split(":");
                        let condition = [
                            infos[0].split(",").map((tile) => {
                                return parseInt(tile);
                            }),
                            infos[2].split(",").map((tile) => {
                                return parseInt(tile);
                            }),
                        ];
                        let door = new Door();
                        door.doorState = DoorState.DISAPPEAR_EVENT;
                        door.condition = condition;
                        door.value = parseInt(infos[1]);
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
                            case "hide":
                                door.doorState = key == "appear" ? DoorState.APPEAR : DoorState.HIDE;
                                let index = parseInt(propertiesValue);
                                door.gid = data.tiles[index];
                                this.setDisappear("door", index);
                                break;
                        }
                        doorInfos[propertiesValue] = door;
                    }
                    break;
            }
        }
        return doorInfos;
    }

    private parseStair(propertiesInfo: any) {
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
        if (stairs[1]) {
            stairs[1].levelDiff *= -1;
        }

        return stairs;
    }

    private parseEvent(propertiesInfo: any) {
        let eventInfo: { [key: string]: EventInfo } = {};
        for (let index in propertiesInfo) {
            let element = new EventInfo();
            element.id = parseInt(propertiesInfo[index]);
            eventInfo[index] = element;
        }
        return eventInfo;
    }

    setAppear(layerName: string, index: number, gid: number) {
        if (!this._appearTile[layerName]) {
            this._appearTile[layerName] = {};
        }
        this._appearTile[layerName][index] = gid;
        this.saveMapData();
    }

    setDisappear(layerName: string, index: number) {
        if (!this._disappearTile[layerName]) {
            this._disappearTile[layerName] = [];
        }
        this._disappearTile[layerName].push(index);
        this.saveMapData();
    }

    canHeroMove(tile: Vec2) {
        //if ((this.monsterInfo.bigMonster && this.monsterInfo.bigMonster.indexOf(index) != -1) || this.hero.HeroData.Hp <= this.getWizardMagicDamage(index)) return false;
        return true;
    }

    getStair(type: StairType): Stair {
        return this.layerInfo["stair"][type] || null;
    }

    getLayerInfo(layerName: string) {
        return this.layerInfo[layerName] || null;
    }

    getLayerElement(layerName: string, index: number | string) {
        let layerInfo = this.getLayerInfo(layerName);
        return layerInfo ? layerInfo[index] : null;
    }

    deleteLayerElement(layerName: string, index: number) {
        let layerInfo = this.getLayerInfo(layerName);
        if (layerInfo && layerInfo[index]) {
            delete layerInfo[index];
            this.setDisappear(layerName, index);
        }
    }
}
