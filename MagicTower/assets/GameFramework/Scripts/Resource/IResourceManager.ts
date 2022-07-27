import { Constructor } from "../Base/DataStruct/Constructor";
import { IAsset } from "./Asset/IAsset";
import { IAssetManager, ResourceCompleteCallback, ResourceProgressCallback } from "./Asset/IAssetManager";
import { OptionBundle, OptionExt } from "./Asset/IOption";
import { IHotUpdateHelper } from "./IHotUpdateHelper";
import { IResourceLoader } from "./IResourceLoader";
import { IResourceLoaderHelper } from "./IResourceLoaderHelper";
import { IResourcePathHelper } from "./IResourcePathHelper";

/**
 * 资源管理
 */
export interface IResourceManager {
    /**
     * 设置内置的资源加载器
     * @param resourceLoaderHelper 资源加载辅助器
     */
    setInternalResourceLoader(resourceLoaderHelper: IResourceLoaderHelper): void;

    /**
     * 设置资源管理器
     * @param assetManager 资源管理器
     */
    setAssetManager(assetManager: IAssetManager): void;

    /**
     * 设置资源路径辅助器
     * @param resourcePathHelper 资源路径辅助器
     */
    setResourcePathHelper(resourcePathHelper: IResourcePathHelper): void;

    /**
     * 设置热更新辅助器
     * @param hotUpdateHelper 热更新辅助器
     */
    setHotUpdateHelper(hotUpdateHelper: IHotUpdateHelper): void;

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
     * 加载远程资源
     * @param url 远程资源url
     * @param options 远程资源附加扩展名
     * @returns 加载的远程资源
     */
    loadRemote(url: string, options?: OptionExt): Promise<IAsset | null>;

    /**
     * 获取已经缓存的资源
     * @param path 资源路径
     * @param assetType 资源类型
     * @returns 资源
     */
    getAsset<T extends IAsset>(path: string, assetType?: Constructor<T>): T | null;

    /**
     * 获取远程资源
     * @param url 远程资源url
     * @returns 远程资源
     */
    getRemoteAsset(url: string): IAsset | null;

    /**
     * 释放资源，有依赖的资源可能不会释放
     * @param asset
     */
    releaseAsset(asset: IAsset): void;

    /**
     * 释放文件夹资源
     * @param path 文件夹路径
     */
    releaseDir(path: string): void;

    /**
     * 开始热更新
     * @param manifestUrl 热更链接
     */
    startHotUpdate(manifestUrl: string): void;

    /**
     * 设置热更回调
     * @param failCallback 更新失败回调
     * @param completeCallback 更新完成回调
     * @param checkCompleteCallback 如果有更新，检查更新完毕回调
     * @param bytesProgressCallback 字节数热更进度回调
     * @param fileProgressCallback 文件热更进度回调
     */
    setHotUpdateCallback(
        failCallback: (errorMessage: string) => void,
        completeCallback: (restart: boolean) => void,
        checkCompleteCallback?: () => void,
        bytesProgressCallback?: ((progress: number, current: number, total: number) => void) | null,
        fileProgressCallback?: ((progress: number, current: number, total: number) => void) | null
    ): void;

    /**
     * 重新下载热更资源
     */
    retry(): void;
}
