import { Constructor } from "../Base/DataStruct/Constructor";
import { IAsset } from "./Asset/IAsset";
import { ResourceCompleteCallback, ResourceProgressCallback } from "./Asset/IAssetManager";

/**
 * 辅助资源加载器，由于cocos自己封装了一套，所以用cocos引擎的
 */
export interface IResourceLoaderHelper {
    /**
     * 辅助资源加载器名称
     */
    readonly name: string;

    /**
     * 加载单一资源
     * @param path 路径
     * @param type 资源类型
     * @param onProgress 资源加载进度回调
     * @param onComplete 资源完成加载回调
     */
    load<T extends IAsset>(path: string, type: Constructor<T> | null, onProgress: ResourceProgressCallback | null, onComplete: ResourceCompleteCallback<T> | null): void;

    /**
     * 加载文件夹资源
     * @param path 文件夹路径
     * @param type 资源类型
     * @param onProgress 资源加载进度回调
     * @param onComplete 资源完成加载回调
     */
    loadDir<T extends IAsset>(path: string, type: Constructor<T> | null, onProgress: ResourceProgressCallback | null, onComplete: ResourceCompleteCallback<T[]> | null): void;

    /**
     * 获取已加载的资源
     * @param path 路径
     * @param type 资源类型
     */
    get<T extends IAsset>(path: string, type?: Constructor<T> | null): T | null;
}
