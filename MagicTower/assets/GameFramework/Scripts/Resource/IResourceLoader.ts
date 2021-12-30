import { Asset } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { ResourceCompleteCallback, ResourceProgressCallback } from "./ResourceCallback";

/**
 * 资源加载器，基于bundle实现
 */
export interface IResourceLoader {
    /**
     * 使用Promise加载单一资源
     * @param path 资源路径
     * @param assetType 资源类型
     */
    loadAsset<T extends Asset>(path: string, assetType?: Constructor<T>): Promise<T | null>;

    /**
     * 使用回调方式加载单一资源
     * @param path 资源路径
     * @param assetType 资源类型
     * @param onProgress 资源加载进度回调
     * @param onComplete 资源加载完成回调
     */
    loadAssetWithCallback<T extends Asset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T> | null): Promise<boolean>;

    /**
     * 加载文件夹资源
     * @param path 文件夹路径
     * @param assetType 资源类型
     * @returns 是否加载成功
     */
    loadDir<T extends Asset>(path: string, assetType?: Constructor<T>): Promise<boolean>;

    /**
     * 使用回调方式加载文件夹资源
     * @param path 文件夹路径
     * @param assetType 资源类型
     * @param onProgress 资源加载进度回调
     * @param onComplete 资源加载完成回调
     */
    loadDirWithCallback<T extends Asset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T[]> | null): Promise<boolean>;

    /**
     * 获取已经缓存的资源
     * @param path 资源路径
     * @param assetType 资源类型
     */
    getAsset<T extends Asset>(path: string, assetType?: Constructor<T>): T | null;

    /**
     * 释放文件夹资源
     * @param path 文件夹路径
     */
    releaseDir(path: string): void;
}
