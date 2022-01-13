import { Asset } from "cc";
import { Constructor } from "../Base/DataStruct/Constructor";
import { IResourceLoader } from "./IResourceLoader";
import { ResourceCompleteCallback, ResourceProgressCallback } from "./ResourceCallback";

export interface OptionExt {
    ext?: string;
}

export interface OptionBundle {
    version?: string;
    scriptAsyncLoading?: boolean;
}

/**
 * 资源管理
 */
export interface IResourceManager {
    /**
     * 加载bundle，返回bundle的资源加载器
     * @param bundleNameOrUrl bundle名字或者url
     * @param options bundle附加选项
     * @returns 加载的资源加载器
     */
    loadBundle(bundleNameOrUrl: string, options?: OptionBundle): Promise<IResourceLoader | null>;

    /**
     * 获取资源加载器
     * @param name
     * @returns 资源加载器
     */
    getResourceLoader(name: string): IResourceLoader | null;

    /**
     * 使用Promise加载单一资源
     * @param path 资源路径
     * @param assetType 资源类型
     * @returns 需要加载的资源
     */
    loadAsset<T extends Asset>(path: string, assetType?: Constructor<T>): Promise<T | null>;

    /**
     * 使用回调方式加载单一资源
     * @param path 资源路径
     * @param assetType 资源类型
     * @param onProgress 资源加载进度回调
     * @param onComplete 资源加载完成回调
     * @returns 是否加载成功
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
     * @returns 是否加载成功
     */
    loadDirWithCallback<T extends Asset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T[]> | null): Promise<boolean>;

    /**
     * 加载远程资源
     * @param url 远程资源url
     * @param options 远程资源附加扩展名
     * @returns 加载的远程资源
     */
    loadRemote(url: string, options?: OptionExt): Promise<Asset | null>;

    /**
     * 获取已经缓存的资源
     * @param path 资源路径
     * @param assetType 资源类型
     * @returns 资源
     */
    getAsset<T extends Asset>(path: string, assetType?: Constructor<T>): T | null;

    /**
     * 获取远程资源
     * @param url 远程资源url
     * @returns 远程资源
     */
    getRemoteAsset(url: string): Asset | null;

    /**
     * 释放资源，有依赖的资源可能不会释放
     * @param asset
     */
    releaseAsset(asset: Asset): void;

    /**
     * 释放文件夹资源
     * @param path 文件夹路径
     */
    releaseDir(path: string): void;
}
