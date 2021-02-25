import { _decorator } from "cc";

const { ccclass } = _decorator;

@ccclass("JsonParser")
export default class JsonParser {
    protected nativeAsset: object = null;

    parseJson(jsonAsset: object) {
        this.nativeAsset = jsonAsset;
    }

    /**
     * 得到json数据
     * @param clone 默认为false，如果你需要操作json元素，clone一份
     */
    getJson(clone: boolean = false) {
        return clone ? this.clone(this.nativeAsset) : this.nativeAsset;
    }

    /**
     * 得到json元素
     * @param key 元素的index或key
     * @param clone 返回一个副本，不要直接操作json原本
     */
    getJsonElement(key: string | number, clone: boolean = false) {
        let info = this.nativeAsset[key];
        return clone ? this.clone(info) : info;
    }

    private clone(json: object): object {
        if (null == json || "object" != typeof json) return json;

        // Handle Date
        if (json instanceof Date) {
            let copy = new Date();
            copy.setTime(json.getTime());
            return copy;
        }

        // Handle Array
        if (json instanceof Array) {
            let copy = [];
            for (let i = 0, len = json.length; i < len; ++i) {
                copy[i] = this.clone(json[i]);
            }
            return copy;
        }

        // Handle Object
        if (json instanceof Object) {
            let copy: any = {};
            for (let attr in json) {
                if (json.hasOwnProperty(attr)) copy[attr] = this.clone(json[attr]);
            }

            return copy;
        }

        return null;
    }
}
