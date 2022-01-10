import { Utility } from "../../../../../GameFramework/Scripts/Utility/Utility";
import { Element } from "./Element";

export enum DoorType {
    YELLOW = 1001,
    BLUE,
    RED,
    WALL = 1006,
}

export enum DoorState {
    NONE,
    PASSIVE,
    APPEAR,
    HIDE,
    CONDITION,
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

    static parse(propertiesInfo: any, data: any = null): any {
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
                    let doorJson = Utility.Json.getJsonKeyCache("door", "spriteId", name) as any;
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
                                break;
                        }
                        doorInfos[propertiesValue] = door;
                    }
                    break;
            }
        }
        return doorInfos;
    }
}
