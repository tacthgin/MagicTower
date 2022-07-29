import { js } from "cc";
import { LoadBase } from "../../../../GameFramework/Script/MVC/Model/LoadBase";
import { Door, DoorState, DoorType } from "./Elements/Door";
import { Element } from "./Elements/Element";
import { EventInfo } from "./Elements/EventInfo";
import { Monster, MonsterEvent } from "./Elements/Monster";
import { Npc } from "./Elements/Npc";
import { DIRECTION_INDEX_DIFFS, ParserFactory } from "./Elements/ParserFactory";
import { Stair, StairType } from "./Elements/Stair";

const CLASS_MAP: any = {
    door: Door,
    stair: Stair,
    event: EventInfo,
    npc: Npc,
    monster: Monster,
};

const DISAPPEAR_LAYER_FILTER: Readonly<string[]> = ["event"];

export const MAGIC_DAMAGE_LEVEL: number = 40;

export class LevelData extends LoadBase {
    //层
    private _level: number = 0;
    /** 出现的tile */
    private _appearTile: any = {};
    /** 消失的tile */
    private _disappearTile: any = {};
    /** 层元素信息 */
    private _layerInfo: { [layerName: string]: any } = {};

    private _tempAddMagicGuards: { [index: number | string]: any } | null = null;

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

    load(info: any) {
        this.loadData(info);
        for (let layerName in this._layerInfo) {
            let elements = this._layerInfo[layerName].elements;
            let constructor = CLASS_MAP[layerName];
            if (constructor) {
                for (let index in elements) {
                    if (constructor) {
                        let element = new constructor();
                        elements[index] = element.load(elements[index]);
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
                this._layerInfo[layerName] = result;
                if (result.hide) {
                    for (let index in result.hide) {
                        this.setDisappear(layerName, parseInt(index), false);
                    }
                }
            }
        }
    }

    setAppear(layerName: string, index: number, gid: number = 0, id: number = 0) {
        if (gid != 0) {
            if (!this._appearTile[layerName]) {
                this._appearTile[layerName] = {};
            }
            this._appearTile[layerName][index] = gid;
        }

        if (id) {
            this.addLayerElement(layerName, index, gid, id);
        }
    }

    setDisappear(layerName: string, index: number, deleteElement: boolean = true) {
        if (DISAPPEAR_LAYER_FILTER.indexOf(layerName) == -1) {
            if (!this._disappearTile[layerName]) {
                this._disappearTile[layerName] = [];
            }
            this._disappearTile[layerName].push(index);
        }

        if (deleteElement) {
            this.deleteLayerElement(layerName, index);
        }
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

    getLayerElement<T extends Element>(layerName: string, index: number | string): T | null {
        let elements = this.getLayerElements(layerName);
        return elements ? elements[index] : null;
    }

    getLayerElementWithoutName(index: number | string) {
        let element = null;
        for (let layerName in this._layerInfo) {
            element = this.getLayerElement(layerName, index);
            if (element) {
                return {
                    layerName: layerName,
                    element: element as Element,
                };
            }
        }

        return null;
    }

    /**
     * 删除掉隐藏的tile
     * @param layerName 层名
     * @param index 索引位置
     * @returns tile的gid
     */
    deleteHide(layerName: string, index: number): number | null {
        let disappear = this._disappearTile[layerName];
        if (disappear) {
            let disappearIndex = disappear.indexOf(index);
            if (disappearIndex != -1) {
                disappear.splice(disappearIndex, 1);
                let layerInfo = this.getLayerInfo(layerName);
                if (layerInfo && layerInfo.hide) {
                    let gid = layerInfo.hide[index];
                    let element = layerInfo.elements[index];
                    element.hide = false;
                    delete layerInfo.hide[index];
                    if (js.isEmptyObject(layerInfo.hide)) {
                        layerInfo.hide = null;
                    }
                    return gid;
                }
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

    getMonsters(): Monster[] {
        let layerInfo = this.getLayerInfo("monster");
        let monsters: Monster[] = [];
        if (layerInfo && layerInfo.elements) {
            let tempMonsters: { [id: number]: Monster } = {};
            for (let index in layerInfo.elements) {
                let monster = layerInfo.elements[index];
                if (!monster.hide) {
                    tempMonsters[monster.id] = monster;
                }
            }

            for (let id in tempMonsters) {
                monsters.push(tempMonsters[id]);
            }
        }

        return monsters;
    }

    hasDoorInfo(): boolean {
        return this.getLayerInfo("door") != null;
    }

    /**
     * 触发门事件
     * @param doorState 门事件的状态类型
     * @param triggerIndex 触发事件的地块索引
     * @returns 事件id
     */
    triggerDoorEvent(doorState: DoorState, triggerIndex: number): number | null {
        let layerInfo = this.getLayerInfo("door");
        if (layerInfo && layerInfo.event) {
            let eventInfo = layerInfo.event[doorState];
            if (eventInfo) {
                switch (doorState) {
                    case DoorState.APPEAR_EVENT:
                        {
                            let map: Map<Array<number>, number> = eventInfo;
                            for (let pair of map) {
                                let index = pair[0].indexOf(triggerIndex);
                                if (index != -1) {
                                    pair[0].splice(index, 1);
                                    if (pair[0].length == 0) {
                                        let eventId = pair[1];
                                        delete layerInfo.event[doorState];
                                        return eventId;
                                    }
                                }
                            }
                        }
                        break;
                    case DoorState.DISAPPEAR_EVENT:
                        let conditions = eventInfo;
                        if (conditions[0].indexOf(triggerIndex) != -1) {
                            delete layerInfo.event[doorState];
                        } else {
                            let index = conditions[2].indexOf(triggerIndex);
                            if (index != -1) {
                                conditions[2].splice(index, 1);
                                if (conditions[2].length == 0) {
                                    return conditions[1];
                                }
                            }
                        }
                        break;
                    case DoorState.MONSTER_EVENT:
                        {
                            let conditions = eventInfo;
                            let monsterIndex = conditions[1];
                            if (monsterIndex == triggerIndex) {
                                let door = this.getLayerElement<Door>("door", conditions[0]);
                                if (door) {
                                    door.normal();
                                }
                            }
                        }
                        break;
                    case DoorState.WALL_SHOW_EVENT:
                        return eventInfo;
                }
            }
        }

        return null;
    }

    /**
     * 消灭怪物触发怪物事件
     * @param triggerIndex 触发的地块索引
     * @returns 事件id
     */
    triggerMonsterEvent(triggerIndex: number): number | null {
        let layerInfo = this.getLayerInfo("monster");
        if (layerInfo && layerInfo.event) {
            for (let key in layerInfo.event) {
                let eventType = parseInt(key);
                switch (eventType) {
                    case MonsterEvent.NORMAL:
                        {
                            let monsterEventInfo = layerInfo.event[eventType] as Map<Array<number>, number>;
                            let index = 0;
                            for (let pair of monsterEventInfo) {
                                index = pair[0].indexOf(triggerIndex);
                                if (index != -1) {
                                    pair[0].splice(index, 1);
                                    if (pair[0].length == 0) {
                                        let eventId = pair[1];
                                        monsterEventInfo.delete(pair[0]);
                                        if (monsterEventInfo.size == 0) {
                                            delete layerInfo.event[eventType];
                                        }
                                        return eventId;
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                    case MonsterEvent.DOUBLE:
                        {
                            let monsterEventInfo = layerInfo.event[eventType];
                            let existConditions = monsterEventInfo[2];
                            if (existConditions.indexOf(triggerIndex) != -1) {
                                delete layerInfo.event[eventType];
                                return null;
                            } else {
                                let destroyConditions = monsterEventInfo[1];
                                let index = destroyConditions.indexOf(triggerIndex);
                                if (index != -1) {
                                    destroyConditions.splice(index, 1);
                                    if (destroyConditions.length == 0) {
                                        let eventId = monsterEventInfo[0];
                                        delete layerInfo.event[eventType];
                                        return eventId;
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                }
            }
        }

        return null;
    }

    /**
     * 通过消灭的怪物位置，来获取怪物守卫的门
     * @param destroyMonsterIndex 消灭的怪物位置索引
     */
    triggerMonsterDoor(destroyMonsterIndex: number): Array<Door> | null {
        let layerInfo = this.getLayerInfo("door");
        if (layerInfo) {
            let monsterDoors: Map<Array<number>, Array<Door>> = layerInfo["monsterDoors"];
            if (monsterDoors) {
                let index = 0;
                for (let pair of monsterDoors) {
                    index = pair[0].indexOf(destroyMonsterIndex);
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

        let monsterDoors: Map<Array<number>, Array<Door>> = layerInfo["monsterDoors"];
        if (!monsterDoors) {
            layerInfo["monsterDoors"] = monsterDoors = new Map<Array<number>, Array<Door>>();
        }

        for (let monsterIndexesString in monsterDoorInfo) {
            let doors: Array<Door> = new Array<Door>();
            let monsterIndexes = monsterIndexesString.split(",").map((value) => {
                return parseInt(value);
            });

            let doorIndexes = monsterDoorInfo[monsterIndexesString];
            doorIndexes.forEach((index) => {
                let door = new Door();
                door.id = DoorType.MONSTER;
                door.index = index;
                doors.push(door);
                layerInfo.elements[index] = door;
            });
            monsterDoors.set(monsterIndexes, doors);
        }
    }

    /**
     * 获取当前地块的巫师伤害
     * @param index 地块索引
     * @returns 巫师伤害
     */
    getWizardDamage(index: number) {
        let layerInfo = this.getLayerInfo("monster");
        if (layerInfo) {
            let wizardDamages: Map<number, number[]> = layerInfo.wizardDamages;
            if (wizardDamages.size > 0) {
                let wizardIndexes = wizardDamages.get(index);
                if (wizardIndexes) {
                    let damage = 0;
                    let damageIndexes: number[] = [];
                    wizardIndexes.forEach((wizardIndex) => {
                        let monster: Monster = layerInfo.elements[wizardIndex];
                        if (monster && !monster.hide && monster.monsterInfo.magicAttack) {
                            damage += monster.monsterInfo.magicAttack;
                            damageIndexes.push(wizardIndex);
                        }
                    });
                    return { damage: damage, indexes: damageIndexes };
                }
            }
        }
        return null;
    }

    /**
     * 获取当前地块的魔法警卫伤害
     * @param index 地块索引
     * @returns 魔法警卫伤害
     */
    getMagicGuardDamage(index: number) {
        let layerInfo = this.getLayerInfo("monster");
        if (layerInfo) {
            let magicGuardDamges: Map<number, number[]> = layerInfo.magicGuardDamges;
            if (magicGuardDamges.size > 0) {
                let magicGuardIndexes = magicGuardDamges.get(index);
                if (magicGuardIndexes) {
                    let damage = 0;
                    let monster: Monster = layerInfo.elements[magicGuardIndexes[0]];
                    if (monster && monster.monsterInfo.magicAttack) {
                        damage += monster.monsterInfo.magicAttack;
                    }
                    return { damage: damage, indexes: magicGuardIndexes };
                }
            }
        }
        return null;
    }

    /**
     * 是否在大怪物的范围
     * @param index 需要行走地块的索引
     * @returns 是否在大怪物的范围
     */
    inBigMonster(index: number): boolean {
        let layerInfo = this.getLayerInfo("monster");
        if (layerInfo && layerInfo.bigMonster) {
            return layerInfo.bigMonster[index];
        }
        return false;
    }

    /**
     * 获取层数据
     * @param layerName 层名
     * @returns 层数据根据parsefactory返回数据为准
     */
    private getLayerInfo(layerName: string) {
        return this._layerInfo[layerName] || null;
    }

    /**
     * 获取层元素数据
     * @param layerName
     * @returns
     */
    private getLayerElements(layerName: string) {
        let layerInfo = this._layerInfo[layerName];
        if (layerInfo) {
            return layerInfo.elements;
        }
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
            let element = layerInfo.elements[src];
            if (element) {
                if (layerName == "monster") {
                    this.moveWizard(element, dst);
                }
                delete layerInfo.elements[src];
                element.index = dst;
                layerInfo.elements[dst] = element;
            }
        }
    }

    private addLayerElement(layerName: string, index: number, gid: number, id: number) {
        let constructor = CLASS_MAP[layerName];
        if (!constructor) {
            return;
        }

        let layerInfo = this.getLayerInfo(layerName);
        if (!layerInfo) {
            layerInfo = this._layerInfo[layerName] = {};
            layerInfo.elements = {};
        }

        let element = new constructor();
        element.id = id;
        element.gid = gid;
        element.index = index;
        layerInfo.elements[index] = element;

        if (layerName == "monster") {
            this.addMagicGuards(element);
        }
    }

    /**
     * 删除层元素
     * @param layerName 层名
     * @param index 元素地块索引
     */
    private deleteLayerElement(layerName: string, index: number) {
        let layerInfo = this.getLayerInfo(layerName);
        if (layerInfo) {
            let element = layerInfo.elements[index];
            if (element) {
                if (layerName == "monster") {
                    this.removeWizardOrMagicGuards(element);
                }
                delete layerInfo.elements[index];
            } else if (layerName == "monster" && layerInfo.bigMonster) {
                this.removeBigMonster(index);
            }
        }
    }

    private removeWizardOrMagicGuards(monster: Monster) {
        let layerInfo = this.getLayerInfo("monster");
        if (monster.isWizard()) {
            let damages = layerInfo.wizardDamages;
            DIRECTION_INDEX_DIFFS.forEach((offset) => {
                let damageIndex = offset + monster.index;
                let monsterIndexes = damages.get(damageIndex);
                if (monsterIndexes) {
                    let monsterIndex = monsterIndexes.indexOf(monster.index);
                    if (monsterIndex != -1) {
                        monsterIndexes.splice(monsterIndex, 1);
                        if (monsterIndexes.length == 0) {
                            damages.delete(damageIndex);
                        }
                    }
                }
            });
        } else if (monster.isMagicGuard()) {
            let damages = layerInfo.magicGuardDamges;
            DIRECTION_INDEX_DIFFS.forEach((offset) => {
                let damageIndex = offset + monster.index;
                let monsterIndexes = damages.get(damageIndex);
                if (monsterIndexes && monsterIndexes.indexOf(monster.index) != -1) {
                    damages.delete(damageIndex);
                }
            });
        }
    }

    private removeBigMonster(monsterIndex: number) {
        let layerInfo = this.getLayerInfo("monster");
        let monster = layerInfo.elements[monsterIndex + 1];
        if (monster) {
            delete layerInfo.elements[monsterIndex + 1];
            layerInfo.bigMonster = null;
        }
    }

    private moveWizard(monster: Monster, newIndex: number) {
        if (monster.isWizard()) {
            this.removeWizardOrMagicGuards(monster);
            let wizardDamages = this.getLayerInfo("monster").wizardDamages;
            ParserFactory.parseWizardDamage(wizardDamages, newIndex);
        }
    }

    private addMagicGuards(monster: Monster) {
        if (monster.isMagicGuard()) {
            let layerInfo = this.getLayerInfo("monster");
            if (layerInfo) {
                if (!this._tempAddMagicGuards) {
                    this._tempAddMagicGuards = {};
                }
                let damages = layerInfo.magicGuardDamges;
                if (!damages) {
                    damages = layerInfo.magicGuardDamages = new Map<number, number[]>();
                }
                ParserFactory.addMagicGuardsDamage(damages, this._tempAddMagicGuards, monster);
                this._tempAddMagicGuards[monster.index] = monster.index;
            }
        }
    }
}
