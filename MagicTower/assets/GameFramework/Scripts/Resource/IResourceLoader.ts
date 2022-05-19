import { Constructor } from "../Base/DataStruct/Constructor";
import { IAsset } from "./Asset/IAsset";
import { ResourceCompleteCallback, ResourceProgressCallback } from "./Asset/IAssetManager";

/**
 * 资源加载器接口，基于bundle实现
 */
export interface IResourceLoader {
    /**
     * 资源加载器名称
     */
    readonly name: string;

    /**
     * 使用Promise加载单一资源
     * @param path 资源路径
     * @param assetType 资源类型
     * @returns 需要加载的资源
     */
    loadAsset<T extends IAsset>(path: string, assetType?: Constructor<T>): Promise<T | null>;

    /**
     * 使用回调方式加载单一资源
     * @param path 资源路径
     * @param assetType 资源类型
     * @param onProgress 资源加载进度回调
     * @param onComplete 资源加载完成回调
     * @returns 是否加载成功
     */
    loadAssetWithCallback<T extends IAsset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T> | null): Promise<boolean>;

    /**
     * 加载文件夹资源
     * @param path 文件夹路径
     * @param assetType 资源类型
     * @returns 是否加载成功
     */
    loadDir<T extends IAsset>(path: string, assetType?: Constructor<T>): Promise<boolean>;

    /**
     * 使用回调方式加载文件夹资源
     * @param path 文件夹路径
     * @param assetType 资源类型
     * @param onProgress 资源加载进度回调
     * @param onComplete 资源加载完成回调
     * @returns 是否加载成功
     */
    loadDirWithCallback<T extends IAsset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T[]> | null): Promise<boolean>;

    /**
     * 获取已经缓存的资源
     * @param path 资源路径
     * @param assetType 资源类型
     * @returns 资源
     */
    getAsset<T extends IAsset>(path: string, assetType?: Constructor<T>): T | null;

    /**
     * 释放文件夹资源
     * @param path 文件夹路径
     */
    releaseDir(path: string): void;
}
