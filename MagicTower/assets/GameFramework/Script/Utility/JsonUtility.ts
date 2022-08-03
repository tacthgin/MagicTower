import { GameFrameworkError } from "../Base/GameFrameworkError";
import { SystemUtility } from "./SystemUtility";

/**
 * Json工具类
 */
export class JsonUtility {
    /** 缓存json文件 */
    private readonly _cacheJsonMap: Map<string, object> = null!;
    /** 根据特定的json字段来缓存json元素 */
    private readonly _cacheJsonKeyMap: Map<string, Map<string, Map<string | number, object>>> = null!;
    /** 系统工具类 */
    private _systemUtility: SystemUtility = null!;

    constructor() {
        this._cacheJsonMap = new Map<string, object>();
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
     * @param json json资源
     */
    addJson(name: string, json: object) {
        this._cacheJsonMap.set(name, json);
    }

    /**
     * 从本地文件夹动态获取json
     * @param name json名字
     * @param clone 是否克隆json
     * @returns json对象
     */
    getJson<T extends object>(name: string, clone: boolean = false): T | null {
        let json = this._cacheJsonMap.get(name);
        if (json) {
            return (clone ? this._systemUtility.clone(json) : json) as T;
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
            this._cacheJsonKeyMap.set(name, jsonCache);
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
            jsonCache.set(jsonKey, keyCache);
            let values: any[] = [];
            for (let id in json) {
                let jsonObject = (json as any)[id];
                values.length = 0;
                for (let i = 0; i < keyArray.length; i++) {
                    values.push(jsonObject[keyArray[i]]);
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
            if (keys.length == 1) {
                return keys[0];
            } else {
                let result = "";
                keys.forEach((key) => {
                    result += `_${key}`;
                });
                return result;
            }
        }

        return keys;
    }
}
