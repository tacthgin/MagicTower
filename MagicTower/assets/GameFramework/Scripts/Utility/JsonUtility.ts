import { JsonAsset } from "cc";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { IResourceManager } from "../Resource/IResourceManager";
import { SystemUtility } from "./SystemUtility";

/**
 * Json工具类
 */
export class JsonUtility {
    private _resourceManger: IResourceManager = null!;
    private _jsonDirPath: string = "";
    private readonly _cacheJsonKeyMap: Map<string, Map<string, Map<number | string, object>>> = null!;
    private _systemUtility: SystemUtility = null!;

    constructor() {
        this._cacheJsonKeyMap = new Map<string, Map<string, Map<number | string, object>>>();
    }

    /**
     * 设置资源管理器
     * @param resourceManger
     */
    setResourceManager(resourceManger: IResourceManager): void {
        this._resourceManger = resourceManger;
    }

    /**
     * 设置系统工具类
     * @param systemUtility
     */
    setSystemUtility(systemUtility: SystemUtility): void {
        this._systemUtility = systemUtility;
    }

    /**
     * 设置json文件夹路径
     * @param path
     */
    setJsonDirPath(path: string) {
        this._jsonDirPath = path;
    }

    /**
     * 从本地文件夹动态获取json
     * @param path json路径，不需要根json文件夹
     * @param clone 是否克隆json
     * @returns json对象
     */
    getJson(path: string, clone: boolean = false): object | null {
        let jsonAsset = this._resourceManger.internalResourceLoader.getAsset(this._jsonDirPath ? `${this._jsonDirPath}/${path}` : path, JsonAsset);
        if (jsonAsset) {
            return clone ? this._systemUtility.clone(jsonAsset.json) || null : jsonAsset.json;
        } else {
            throw new GameFrameworkError(`can't find json ${path}`);
        }
    }

    /**
     * 从本地文件夹动态获取json元素
     * @param path json路径，不需要根json文件夹
     * @param elementName json元素名字
     * @param clone 是否克隆json元素
     * @returns json元素
     */
    getJsonElement(path: string, elementName: string, clone: boolean = false): Object | null {
        let json = this.getJson(path);
        if (json) {
            let member = (json as any)[elementName];
            if (member) {
                return clone ? this._systemUtility.clone(member) : member;
            }
            return null;
        } else {
            throw new GameFrameworkError(`can't find json ${path}`);
        }
    }

    /**
     * 根据json元素名字的值索引json元素
     * @param path json路径，不需要根json文件夹
     * @param key json元素名字
     * @param value json元素的值
     * @returns json元素
     */
    getJsonKeyCache(path: string, key: string, value: number | string): object | null {
        let json: any = this.getJson(path);
        if (json) {
            let keyCache = this.internalGetJsonKeyCache(json, path, key);
            return keyCache.get(value) || null;
        } else {
            throw new GameFrameworkError(`can't find json ${path}`);
        }
    }

    /**
     * 内部获得json的key缓存
     * @param json
     * @param path
     * @param key
     * @returns
     */
    private internalGetJsonKeyCache(json: object, path: string, key: string): Map<number | string, object> {
        let jsonCache = this._cacheJsonKeyMap.get(path);
        if (!jsonCache) {
            jsonCache = new Map<string, Map<number | string, object>>();
        }
        let keyCache = jsonCache.get(key);
        if (!keyCache) {
            keyCache = new Map<number | string, object>();
            for (let id in json) {
                let jsonObject = (json as any)[id];
                let value = jsonObject[key];
                keyCache.set(value, jsonObject);
            }
        }

        return keyCache;
    }
}
