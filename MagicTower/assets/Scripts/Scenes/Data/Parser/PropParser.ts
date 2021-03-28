import { _decorator } from "cc";
import JsonParser from "../../../Frame/Base/JsonParser";

const { ccclass } = _decorator;

const KEY_TYPE = 1;

@ccclass("PropParser")
export default class PropParser extends JsonParser {
    private doorToId: any = {};

    parseJson(jsonAsset: object) {
        super.parseJson(jsonAsset);
        let info = null;
        for (let key in jsonAsset) {
            info = jsonAsset[key];
            if (info.type == KEY_TYPE) {
                this.doorToId[info.value] = info.id;
            }
        }
    }

    getKeyByDoor(doorId: number) {
        return this.doorToId[doorId] || null;
    }
}
