import { IResourceLoaderHelper } from "../IResourceLoaderHelper";
import { IAsset } from "./IAsset";
import { OptionBundle, OptionExt } from "./IOption";
import { IRequestItem } from "./IRequestItem";

/**
 * 资源加载完成回调类型
 */
export type ResourceCompleteCallback<T> = (err: Error | null, data: T) => void;

/**
 * 资源加载进度回调类型
 */
export type ResourceProgressCallback = (finished: number, total: number, item?: IRequestItem) => void;

/**
 * 资源管理器接口
 */
export interface IAssetManager {
    /**
     * 加载远程资源
     * @param url 远程资源url
     * @param options 选项参数
     * @param onComplete 加载完成回调
     */
    loadRemote<T extends IAsset>(url: string, options: OptionExt | null, onComplete?: ResourceCompleteCallback<T> | null): void;

    /**
     * 加载bundle
     * @param nameOrUrl bundle名字或者链接
     * @param options bundle选项参数
     * @param onComplete 加载完成回调
     */
    loadBundle(nameOrUrl: string, options: OptionBundle | null, onComplete?: ResourceCompleteCallback<IResourceLoaderHelper> | null): void;

    /**
     * 释放资源
     * @param asset
     */
    releaseAsset(asset: IAsset): void;
}
