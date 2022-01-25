import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { LoadBase } from "../../../../GameFramework/Scripts/Application/Model/LoadBase";
import { MapModel } from "../MapModel";
import { MapAddElementEventArgs } from "../MapModelEventArgs";
import { Door } from "./Elements/Door";
import { EventInfo } from "./Elements/EventInfo";
import { Stair, StairType } from "./Elements/Stair";

const CLASS_MAP: any = {
    door: Door,
    stair: Stair,
    event: EventInfo,
};

export class LevelData extends LoadBase {
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
        GameApp.getModel(MapModel).save();
    }

    private emitEvent(layerName: string, index: number, info: any = null) {
        GameApp.getModel(MapModel).fireNow(MapAddElementEventArgs.create(this._level, layerName, index, info));
    }

    load(info: any) {
        this.loadData(info);
        for (let layerName in this.layerInfo) {
            let layerInfo = this.layerInfo[layerName];
            for (let key in layerInfo) {
                let constructor = CLASS_MAP[key];
                if (constructor) {
                    for (let key in layerInfo) {
                        let element = new constructor();
                        layerInfo[key] = element.load(layerInfo[key]);
                    }
                }
            }
        }
        return this;
    }

    loadProperties(properties: any, data: { tiles: { [key: string]: number[] }; parseGid: Function } | null = null) {
        let propertiesInfo = null;

        let parsers: { [key: string]: Function } = {
            door: Door.parse,
            stair: Stair.parse,
            event: EventInfo.parse,
        };
        for (let layerName in properties) {
            let func = parsers[layerName];
            if (func) {
                propertiesInfo = properties[layerName];
                let tilesData = data ? data.tiles[layerName] : null;
                let praseGidFn = data ? data.parseGid : null;
                func.call(this, propertiesInfo, tilesData, praseGidFn);
            }
        }
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

    move(layerName: string, src: number, dst: number, gid: number) {
        if (!this._appearTile[layerName]) {
            this._appearTile[layerName] = {};
        }
        let tiles = this._appearTile[layerName];
        if (tiles[src]) {
            delete tiles[src];
        }
        tiles[dst] = gid;
        this.saveMapData();
    }

    canHeroMove(index: number) {
        //if ((this.monsterInfo.bigMonster && this.monsterInfo.bigMonster.indexOf(index) != -1) || this.hero.HeroModel.Hp <= this.getWizardMagicDamage(index)) return false;
        return true;
    }

    getStair(type: StairType): Stair | null {
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

    getWizardMagicDamage(index: number): number {
        return 0;
    }
}
