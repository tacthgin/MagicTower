import { GameFrameworkLog } from "../../../../../GameFramework/Scripts/Base/Log/GameFrameworkLog";
import { Utility } from "../../../../../GameFramework/Scripts/Utility/Utility";
import { Element } from "./Element";

export enum DoorType {
    YELLOW = 1001,
    BLUE,
    RED,
    PRISON,
    MONSTER,
    WALL,
}

export enum DoorState {
    NONE,
    /** 被动门，一般是被动的墙门 */
    PASSIVE,
    /** 出现的门 */
    APPEAR,
    HIDE,
    /** 怪物守卫的门 */
    MONSTER,
    APPEAR_EVENT,
    DISAPPEAR_EVENT,
}

export class Door extends Element {
    private _doorState: DoorState = DoorState.NONE;
    private _value: any = null;
    private _condition: any = null;

    set doorState(value: DoorState) {
        this._doorState = value;
    }

    get doorState() {
        return this._doorState;
    }

    set value(value: any) {
        this._value = value;
    }

    get value() {
        return this._value;
    }

    set condition(value: any) {
        this._condition = value;
    }

    /** 事件门条件 */
    get condition() {
        return this._condition;
    }

    canWallOpen() {
        return this._doorState == DoorState.NONE && this._id == DoorType.WALL;
    }

    isKeyDoor() {
        return this._id <= DoorType.RED;
    }

    static isYellow(id: number) {
        return id == DoorType.YELLOW;
    }

    static parse(propertiesInfo: any, tiles: number[] | null = null, parseGidFn: Function | null = null): any {
        let doorInfos: any = {};
        let propertiesValue: string = null!;
        let condition: number[] = [];
        if (tiles && parseGidFn) {
            for (let i = 0; i < tiles.length; i++) {
                if (tiles[i] == 0) {
                    continue;
                }
                condition.push(i);
                let name = parseGidFn(tiles[i]);
                if (name) {
                    name = name.split("_")[0];
                    let doorJson = Utility.Json.getJsonKeyCache("door", "spriteId", name) as any;
                    if (doorJson) {
                        let door = new Door();
                        door.id = parseInt(doorJson.id);
                        door.index = i;
                        doorInfos[i] = door;
                    }
                }
            }
        }
        for (let key in propertiesInfo) {
            propertiesValue = propertiesInfo[key];
            switch (key) {
                case "passive":
                    {
                        let door = doorInfos[propertiesValue];
                        if (door) {
                            door.doorState = DoorState.PASSIVE;
                        } else {
                            GameFrameworkLog.error("map door edit error");
                        }
                    }
                    break;
                case "appear":
                case "hide":
                    {
                        let door = new Door();
                        door.doorState = key == "appear" ? DoorState.APPEAR : DoorState.HIDE;
                        let index = parseInt(propertiesValue);
                        door.gid = tiles![index];
                        door.index = index;
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
                        door.index = parseInt(key);
                        doorInfos["event"] = door;
                    }
                    break;
                case "monsterCondition":
                    break;
                default:
                    {
                        //怪物门 监狱门
                        let monsterDoors: Map<Array<number>, Array<Door>> = doorInfos["monster"];
                        if (!monsterDoors) {
                            monsterDoors = doorInfos["monster"] = new Map<Array<number>, Array<Door>>();
                        }
                        let monsterIndexes: number[] = (propertiesValue as string).split(",").map((value) => {
                            return parseInt(value);
                        });

                        let doorIndexes = key.split(",");
                        let doors: Door[] = [];
                        doorIndexes.forEach((value) => {
                            doors.push(doorInfos[value]);
                        });

                        monsterDoors.set(monsterIndexes, doors);
                    }
                    break;
            }
        }
        return doorInfos;
    }
}
