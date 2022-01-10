import { Element } from "./Element";

export enum StairType {
    UP,
    Down,
}

export class Stair extends Element {
    private _standLocation: number = 0;
    private _levelDiff: number = 1;
    private _hide: boolean = false;

    set standLocation(value: number) {
        this._standLocation = value;
    }

    /** 楼梯旁站立的坐标索引 */
    get standLocation() {
        return this._standLocation;
    }

    set levelDiff(value: number) {
        this._levelDiff = value;
    }

    /** 跳转的等级差 */
    get levelDiff() {
        return this._levelDiff;
    }

    set hide(value: boolean) {
        this._hide = value;
    }

    /** 隐藏的楼梯 */
    get hide() {
        return this._hide;
    }

    static parse(propertiesInfo: any, data: any) {
        let tileIndexes: number[] = [];
        if (data) {
            let tiles: number[] = data.tiles;
            let parseGid = data.parseGid;
            for (let i = 0; i < tiles.length; i++) {
                if (tiles[i] == 0) {
                    continue;
                }

                let name = parseGid(tiles[i]);
                if (name) {
                    name = name.split("_")[1];
                    tileIndexes[name == "up" ? StairType.UP : StairType.Down] = i;
                }
            }
        }
        let stairs: Stair[] = [];
        let location = propertiesInfo["location"].split(",");
        for (let i = 0; i < 2; i++) {
            if (location[i] != "0") {
                let stair = new Stair();
                if (location[i + 2]) {
                    stair.levelDiff = parseInt(location[i + 2]);
                }
                stair.standLocation = parseInt(location[i]);
                stair.index = tileIndexes[i];
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
}
