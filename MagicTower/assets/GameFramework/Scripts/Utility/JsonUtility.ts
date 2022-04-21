import { GameFrameworkError } from "../Base/GameFrameworkError";
import { SystemUtility } from "./SystemUtility";

interface JsonAsset {
    json: object | null;
}

/**
 * Json工具类
 */
export class JsonUtility {
    /** 缓存json文件 */
    private readonly _cacheJsonMap: Map<string, JsonAsset> = null!;
    /** 根据特定的json字段来缓存json元素 */
    private readonly _cacheJsonKeyMap: Map<string, Map<string, Map<string | number, object>>> = null!;
    /** 系统工具类 */
    private _systemUtility: SystemUtility = null!;

    constructor() {
        this._cacheJsonMap = new Map<string, JsonAsset>();
        this._cacheJsonKeyMap = new Map<string, Map<string, Map<string | number, object>>>();
    }

    /**
     * 设置系统工具类
     * @param systemUtility
     */
    setSystemUtility(systemUtility: SystemUtility): void {
        this._systemUtility = systemUtility;
    }

    /**
     * 添加json资源
     * @param name 资源名字
     * @param jsonAsset json资源
     */
    addJson(name: string, jsonAsset: JsonAsset) {
        this._cacheJsonMap.set(name, jsonAsset);
    }

    /**
     * 从本地文件夹动态获取json
     * @param name json名字
     * @param clone 是否克隆json
     * @returns json对象
     */
    getJson<T extends object>(name: string, clone: boolean = false): T | null {
        let jsonAsset = this._cacheJsonMap.get(name);
        if (jsonAsset) {
            let json: any = clone ? this._systemUtility.clone(jsonAsset.json) : jsonAsset.json;
            return json;
        } else {
            throw new GameFrameworkError(`can't find json ${name}`);
        }
    }

    /**
     * 从本地文件夹动态获取json元素
     * @param name json名字
     * @param elementName json元素名字
     * @param clone 是否克隆json元素
     * @returns json元素
     */
    getJsonElement<T extends Object>(name: string, elementName: number | string, clone: boolean = false): T | null {
        let json = this.getJson<any>(name);
        if (json) {
            let member = json[elementName];
            if (member) {
                return clone ? this._systemUtility.clone(member) : member;
            }
            return null;
        } else {
            throw new GameFrameworkError(`can't find json ${name}`);
        }
    }

    /**
     * 根据json元素名字的值索引json元素
     * @param name json名字
     * @param keys json元素名字或者数组
     * @param value json元素的值或者数组
     * @returns json元素
     */
    getJsonKeyCache<T extends object>(name: string, key: string | string[], value: number | string | any[]): T | null {
        let json = this.getJson<any>(name);
        if (json) {
            let keyCache = this.internalGetJsonKeyCache(json, name, key);
            return (keyCache.get(this.combine(value)) as T) || null;
        } else {
            throw new GameFrameworkError(`can't find json ${name}`);
        }
    }

    /**
     * 内部获得json的key缓存
     * @param json json对象
     * @param name json名字作为key
     * @param keys json元素名字或者数组
     * @returns json的key缓存
     */
    private internalGetJsonKeyCache(json: object, name: string, keys: string | string[]): Map<number | string, object> {
        let jsonCache = this._cacheJsonKeyMap.get(name);
        if (!jsonCache) {
            jsonCache = new Map<string, Map<string | number, object>>();
        }

        let keyArray: string[] | null = null;
        let jsonKey: string | null = null;
        if (typeof keys === "string") {
            keyArray = [keys];
            jsonKey = keys;
        } else {
            keyArray = keys;
            jsonKey = this.combine(keys) as string;
        }

        let keyCache = jsonCache.get(jsonKey);
        if (!keyCache) {
            keyCache = new Map<string | number, object>();
            let values: any[] = [];
            for (let id in json) {
                let jsonObject = (json as any)[id];
                values.length = 0;
                for (let i = 0; i < keys.length; i++) {
                    values.push(jsonObject[keys[i]]);
                }
                if (values.length > 0) {
                    keyCache.set(this.combine(values), jsonObject);
                }
            }
        }

        return keyCache;
    }

    private combine(keys: number | string | any[]) {
        if (keys instanceof Array) {
            let result = "";
            keys.forEach((key) => {
                result += `_${key}`;
            });
            return result;
        }

        return keys;
    }
}
