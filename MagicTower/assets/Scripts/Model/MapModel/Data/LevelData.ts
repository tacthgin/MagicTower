import { GameApp } from "../../../../GameFramework/Scripts/Application/GameApp";
import { LoadBase } from "../../../../GameFramework/Scripts/Application/Model/LoadBase";
import { MapModel } from "../MapModel";
import { MapAddElementEventArgs } from "../MapModelEventArgs";
import { Door, DoorState, DoorType } from "./Elements/Door";
import { Element } from "./Elements/Element";
import { EventInfo } from "./Elements/EventInfo";
import { Monster } from "./Elements/Monster";
import { Npc } from "./Elements/Npc";
import { ParserFactory } from "./Elements/ParserFactory";
import { Stair, StairType } from "./Elements/Stair";

const CLASS_MAP: any = {
    door: Door,
    stair: Stair,
    event: EventInfo,
    npc: Npc,
    monster: Monster,
};

const DISAPPEAR_LAYER_FILTER: Readonly<string[]> = ["event"];

export class LevelData extends LoadBase {
    //层
    private _level: number = 0;
    /** 出现的tile */
    private _appearTile: any = {};
    /** 消失的tile */
    private _disappearTile: any = {};
    /** 层元素信息 */
    private _layerInfo: { [layerName: string]: any } = {};

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

    private emitEvent(layerName: string, index: number, info: any = null) {
        GameApp.getModel(MapModel).fireNow(MapAddElementEventArgs.create(this._level, layerName, index, info));
    }

    load(info: any) {
        this.loadData(info);
        for (let layerName in this._layerInfo) {
            let layerInfo = this._layerInfo[layerName];
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

    loadProperties(properties: any, data: { tiles: { [key: string]: number[] }; parseGid: Function }) {
        let propertiesInfo = null;

        for (let layerName in properties) {
            propertiesInfo = properties[layerName];
            let result = ParserFactory.parse(layerName, propertiesInfo, data.tiles[layerName], data.parseGid);
            if (result) {
                this._layerInfo = result;
            }
        }
    }

    setAppear(layerName: string, index: number, gid: number = 0) {
        if (gid != 0) {
            if (!this._appearTile[layerName]) {
                this._appearTile[layerName] = {};
            }
            this._appearTile[layerName][index] = gid;
        }
    }

    setDisappear(layerName: string, index: number) {
        if (DISAPPEAR_LAYER_FILTER.indexOf(layerName) != -1) {
            if (!this._disappearTile[layerName]) {
                this._disappearTile[layerName] = [];
            }
            this._disappearTile[layerName].push(index);
        }
        this.deleteLayerElement(layerName, index);
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

        this.moveLayerElement(layerName, src, dst);
    }

    canHeroMove(index: number) {
        //if ((this.monsterInfo.bigMonster && this.monsterInfo.bigMonster.indexOf(index) != -1) || this.hero.HeroModel.Hp <= this.getWizardMagicDamage(index)) return false;
        return true;
    }

    getLayerElement<T extends Element>(layerName: string, index: number | string): T | null {
        let layerInfo = this.getLayerInfo(layerName);
        return layerInfo ? layerInfo.elements[index] : null;
    }

    getLayerElementWithoutName(index: number | string) {
        for (let layerName in this._layerInfo) {
            if (this._layerInfo[layerName][index]) {
                return {
                    layerName: layerName,
                    element: this._layerInfo[layerName][index] as Element,
                };
            }
        }

        return null;
    }

    getStair(stairType: StairType): Stair | null {
        let layerInfo = this.getLayerInfo("stair");
        if (layerInfo) {
            let elements = layerInfo.elements;
            for (let index in elements) {
                if (elements[index].id == stairType) {
                    return elements[index] || null;
                }
            }
        }

        return null;
    }

    hasDoorInfo(): boolean {
        return this.getLayerInfo("door") != null;
    }

    getDoorInfo(doorState: DoorState, index: number = -1): Door | null {
        switch (doorState) {
            case DoorState.NONE:
            case DoorState.PASSIVE:
                if (index !== -1) {
                    return this.getLayerElement("door", index);
                }
                break;
            case DoorState.APPEAR_EVENT:
            case DoorState.DISAPPEAR_EVENT: {
                let layerInfo = this.getLayerInfo("door");
                if (layerInfo) {
                    let doorInfo = layerInfo["event"];
                    if (doorInfo && doorInfo.doorState == doorState) {
                        return doorInfo;
                    }
                }
            }
        }

        return null;
    }

    /**
     * 通过消灭的怪物位置，来获取怪物守卫的门
     * @param destoryMonsterIndex 消灭的怪物位置索引
     */
    removeMonsterDoor(destoryMonsterIndex: number): Array<Door> | null {
        let layerInfo = this.getLayerInfo("door");
        if (layerInfo) {
            let monsterDoors: Map<Array<number>, Array<Door>> = layerInfo["monster"];
            if (monsterDoors) {
                let index = 0;
                for (let pair of monsterDoors) {
                    index = pair[0].indexOf(destoryMonsterIndex);
                    if (index != -1) {
                        pair[0].splice(index, 1);
                        if (pair[0].length == 0) {
                            monsterDoors.delete(pair[0]);
                            return pair[1];
                        }
                        break;
                    }
                }
            }
        }

        return null;
    }

    /**
     * 添加怪物门结构
     * @param monsterDoorInfo 怪物们的数据
     */
    addMonsterDoor(monsterDoorInfo: { [doorIndexes: string]: number[] }): void {
        let layerInfo = this.getLayerInfo("door");
        if (!layerInfo) {
            layerInfo["door"] = {};
        }

        let monsterDoors: Map<Array<number>, Array<Door>> = layerInfo["monster"];
        if (!monsterDoors) {
            monsterDoors = new Map<Array<number>, Array<Door>>();
        }

        for (let doorIndexes in monsterDoorInfo) {
            let doors: Array<Door> = new Array<Door>();
            doorIndexes.split(",").forEach((index) => {
                let newIndex = parseInt(index);
                let door = new Door();
                door.id = DoorType.MONSTER;
                door.index = newIndex;
                doors.push(door);
            });
            monsterDoors.set(monsterDoorInfo[doorIndexes], doors);
        }
    }

    /**
     * 消灭的怪物，来获取消灭怪物的事件
     * @param destoryMonsterIndex 消灭的怪物位置索引
     * @returns 事件ID
     */
    removeMonsterEvent(destoryMonsterIndex: number): number | null {
        let layerInfo = this.getLayerInfo("monster");
        if (layerInfo) {
            let monsterEvents: Map<Array<number>, number> = layerInfo["monster"];
            if (monsterEvents) {
                let index = 0;
                for (let pair of monsterEvents) {
                    index = pair[0].indexOf(destoryMonsterIndex);
                    if (index != -1) {
                        pair[0].splice(index, 1);
                        if (pair[0].length == 0) {
                            monsterEvents.delete(pair[0]);
                            return pair[1];
                        }
                        break;
                    }
                }
            }
        }

        return null;
    }

    private getLayerInfo(layerName: string) {
        return this._layerInfo[layerName] || null;
    }

    /**
     * 移动元素数据
     * @param layerName 层名
     * @param src 原始位置索引
     * @param dst 目标位置索引
     */
    private moveLayerElement(layerName: string, src: number, dst: number) {
        let layerInfo = this.getLayerInfo(layerName);
        if (layerInfo) {
            let element = layerInfo[src];
            if (element) {
                delete layerInfo[src];
                element.index = dst;
                layerInfo[dst] = element;
            }
        }
    }

    private deleteLayerElement(layerName: string, index: number) {
        let layerInfo = this.getLayerInfo(layerName);
        if (layerInfo && layerInfo[index]) {
            delete layerInfo[index];
        }
    }

    getWizardMagicDamage(index: number): number {
        return 0;
    }
}
