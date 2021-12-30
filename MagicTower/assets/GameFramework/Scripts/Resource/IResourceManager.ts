import { Asset } from "cc";
import { IResourceLoader } from "./IResourceLoader";

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
     * 内置的动态resources加载
     */
    readonly internalResourceLoader: IResourceLoader;

    /**
     * 加载bundle，返回bundle的资源加载器
     * @param bundleNameOrUrl bundle名字或者url
     * @param options bundle附加选项
     */
    loadBundle(bundleNameOrUrl: string, options?: OptionBundle): Promise<IResourceLoader | null>;

    /**
     * 获取资源加载器
     * @param name
     */
    getResourceLoader(name: string): IResourceLoader | null;

    /**
     * 加载远程资源
     * @param url 远程资源url
     * @param options 远程资源附加扩展名
     */
    loadRemote(url: string, options?: OptionExt): Promise<Asset | null>;

    /**
     * 获取远程资源
     * @param url 远程资源url
     */
    getRemoteAsset(url: string): Asset | null;

    /**
     * 释放资源，有依赖的资源可能不会释放
     * @param asset
     */
    releaseAsset(asset: Asset): void;
}
