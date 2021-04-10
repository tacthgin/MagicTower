import { _decorator } from "cc";
import { Fn } from "../Util/Fn";

const { ccclass } = _decorator;

@ccclass("JsonParser")
export class JsonParser {
    protected nativeAsset: object = null;

    parseJson(jsonAsset: object) {
        this.nativeAsset = jsonAsset;
    }

    /**
     * 得到json数据
     * @param clone 默认为false，如果你需要操作json元素，clone一份
     */
    getJson(clone: boolean = false) {
        return clone ? Fn.clone(this.nativeAsset) : this.nativeAsset;
    }

    /**
     * 得到json元素
     * @param key 元素的index或key
     * @param clone 返回一个副本，不要直接操作json原本
     */
    getJsonElement(key: string | number, clone: boolean = false) {
        let info = this.nativeAsset[key];
        return clone ? Fn.clone(info) : info;
    }
}
