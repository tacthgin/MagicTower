import { AssetManager } from "cc";

/**
 * 资源加载进度回调类型
 */
export type ResourceProgressCallback = (finished: number, total: number, item: AssetManager.RequestItem) => void;

/**
 * 资源加载完成回调类型
 */
export type ResourceCompleteCallback<T> = (err: Error | null, data: T) => void;
