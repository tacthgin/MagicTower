import { GameFrameworkError } from "../../../../../GameFramework/Scripts/Base/GameFrameworkError";
import { Utility } from "../../../../../GameFramework/Scripts/Utility/Utility";
import { Door, DoorState } from "./Door";
import { EventInfo } from "./EventInfo";
import { Monster } from "./Monster";
import { Npc } from "./Npc";
import { Stair, StairType } from "./Stair";

export class ParserFactory {
    private static parserMap: { [layerName: string]: Function } = {
        stair: this.parseStair,
        door: this.parseDoor,
        monster: this.parseMonster,
        npc: this.parseNpc,
        event: this.parseEvent,
    };

    static parse(layerName: string, propertiesInfo: any, tiles: number[], parseGidFn: Function) {
        let func = this.parserMap[layerName];
        return func ? func(propertiesInfo, tiles, parseGidFn) : null;
    }

    private static parseStair(propertiesInfo: any, tiles: number[], parseGidFn: Function) {
        let stairs: { [index: number | string]: Stair } = {};
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i] == 0) {
                continue;
            }

            let name = parseGidFn(tiles[i]);
            if (name) {
                name = name.split("_")[1];
                let stair = new Stair();
                if (name == "up") {
                    stair.id = StairType.UP;
                    stair.levelDiff = 1;
                } else {
                    stair.id = StairType.Down;
                    stair.levelDiff = -1;
                }
                stair.gid = tiles[i];
                stair.index = i;
                stairs[i] = stair;
            }
        }

        let location = propertiesInfo["location"].split(",");
        for (let index in stairs) {
            let stair = stairs[index];
            if (location[stair.id] != "0") {
                stair.standLocation = location[stair.id];
                if (location[stair.id + 2]) {
                    stair.levelDiff = parseInt(location[stair.id + 2]);
                }
            }
        }

        let hideIndex = propertiesInfo["hide"];
        let hideInfo: { [index: number | string]: number } | null = null;
        if (hideIndex) {
            stairs[hideIndex].hide = true;
            hideInfo = {};
            hideInfo[hideIndex] = stairs[hideIndex].gid;
        }

        return { elements: stairs, hide: hideInfo };
    }

    private static packageDoor(door: Door | undefined, doorState: DoorState): Door {
        if (door) {
            door.doorState = doorState;
            return door;
        } else {
            throw new GameFrameworkError("door map edit invalid");
        }
    }

    private static parseDoor(propertiesInfo: any, tiles: number[], parseGidFn: Function) {
        let doors: { [index: number | string]: Door } = {};
        let propertiesValue: string = null!;
        let condition: number[] = [];
        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i] == 0) {
                continue;
            }
            condition.push(i);
            let name = parseGidFn(tiles[i]);
            if (name) {
                name = name.split("_")[0];
                let doorJson = Utility.Json.getJsonKeyCache<any>("door", "spriteId", name);
                if (doorJson) {
                    let door = new Door();
                    door.id = parseInt(doorJson.id);
                    door.gid = tiles[i];
                    door.index = i;
                    doors[i] = door;
                }
            }
        }

        let hideInfo: { [index: number | string]: number } | null = null;
        let event: any = {};
        let monsterDoors: Map<Array<number>, Array<Door>> | null = null;
        for (let key in propertiesInfo) {
            propertiesValue = propertiesInfo[key];
            switch (key) {
                case "passive":
                    {
                        doors[propertiesValue] = this.packageDoor(doors[propertiesValue], DoorState.PASSIVE);
                    }
                    break;
                case "appear":
                case "hide":
                case "appearEvent":
                    {
                        if (!hideInfo) {
                            hideInfo = {};
                        }

                        if (key == "appearEvent") {
                            let map = new Map<Array<number>, number>();
                            let indexes: number[] = [];
                            for (let index in doors) {
                                doors[index] = this.packageDoor(doors[index], DoorState.APPEAR);
                                indexes.push(parseInt(index));
                            }
                            map.set(indexes, parseInt(propertiesValue));
                            event[DoorState.APPEAR_EVENT] = map;
                        } else {
                            let door = doors[propertiesValue];
                            doors[propertiesValue] = this.packageDoor(door, key == "appear" ? DoorState.APPEAR : DoorState.HIDE);
                            hideInfo[door.index] = door.gid;
                        }
                    }
                    break;
                case "disappearEvent":
                    {
                        let conditions: any = propertiesValue.split(":");
                        conditions[0] = conditions[0].map((index: string) => {
                            return parseInt(index);
                        });

                        conditions[1] = parseInt(conditions[1]);

                        conditions[2] = conditions[2].map((index: string) => {
                            return parseInt(index);
                        });

                        event[DoorState.DISAPPEAR_EVENT] = conditions;
                    }
                    break;
                case "monsterCondition":
                    let conditions: any = propertiesValue.split(":");
                    event[DoorState.MONSTER_EVENT] = conditions;
                    break;
                default:
                    {
                        //怪物门 监狱门
                        monsterDoors = new Map<Array<number>, Array<Door>>();
                        let monsterIndexes: number[] = (propertiesValue as string).split(",").map((value) => {
                            return parseInt(value);
                        });

                        let doorIndexes = key.split(",");
                        let openDoors: Door[] = [];
                        doorIndexes.forEach((value: string) => {
                            openDoors.push(doors[value]);
                        });

                        monsterDoors.set(monsterIndexes, openDoors);
                    }
                    break;
            }
        }
        return { elements: doors, event: event, monsterDoors: monsterDoors };
    }

    private static parseMonster(propertiesInfo: any, tiles: number[], parseGidFn: Function) {
        let monsters: { [index: number | string]: Monster } = {};

        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i] == 0) {
                continue;
            }
            let name = parseGidFn(tiles[i]);
            if (name) {
                name = name.split("_")[0];
                let monsterJson = Utility.Json.getJsonKeyCache<any>("monster", "spriteId", name);
                if (monsterJson) {
                    let monster = new Monster();
                    monster.gid = tiles[i];
                    monster.id = parseInt(monsterJson.id);
                    monster.index = i;
                    monsters[i] = monster;
                }
            }
        }

        let propertiesValue: string = null!;
        let event: any = {};
        for (let key in propertiesInfo) {
            propertiesValue = propertiesInfo[key];
            switch (key) {
                case "monsterEvent":
                    {
                        let infos = propertiesValue.split(":");
                        let monsterEvents = new Map<Array<number>, number>();
                        monsterEvents.set(
                            infos[1].split(",").map((value) => {
                                return parseInt(value);
                            }),
                            parseInt(infos[0])
                        );
                        event = monsterEvents;
                    }
                    break;
                case "firstAttack":
                    {
                        let monsterIndexes = propertiesValue.split(",");
                        monsterIndexes.forEach((index) => {
                            let monster: Monster = monsters[index];
                            if (monster) {
                                monster.firstAttack = true;
                            }
                        });
                    }
                    break;
                case "monsterMove":
                    {
                        let monsterIndexes = propertiesValue.split(",");
                        monsterIndexes.forEach((index) => {
                            let monster: Monster = monsters[index];
                            if (monster) {
                                monster.monsterMove = true;
                            }
                        });
                    }
                    break;
            }
        }
        return { elements: monsters, event: event };
    }

    private static parseNpc(propertiesInfo: any, tiles: number[], parseGidFn: Function): any {
        let npcInfos: { [index: number | string]: Npc } = {};
        for (let key in propertiesInfo) {
            let npc = new Npc();
            npc.id = parseInt(propertiesInfo[key]);
            npc.index = parseInt(key);
            npcInfos[key] = npc;
        }
        return { elements: npcInfos };
    }

    private static parseEvent(propertiesInfo: any, tiles: number[], parseGidFn: Function) {
        let eventInfo: { [index: number | string]: EventInfo } = {};
        for (let index in propertiesInfo) {
            let element = new EventInfo();
            element.id = parseInt(propertiesInfo[index]);
            element.index = parseInt(index);
            eventInfo[index] = element;
        }
        return eventInfo;
    }
}
