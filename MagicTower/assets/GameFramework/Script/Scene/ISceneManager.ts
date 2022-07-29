import { ISceneHelper } from "./ISceneHelper";

/**
 * 场景管理器接口
 */
export interface ISceneManager {
    /**
     * 设置场景辅助器
     * @param sceneHelper
     */
    setSceneHelper(sceneHelper: ISceneHelper): void;

    /**
     * 获取场景
     */
    getScene<T extends object>(): T | null;

    /**
     * 加载场景
     * @param sceneName 要加载的场景名字
     * @param onLaunchedCallback 加载成功回调
     * @param onUnloadedCallback 未加载成功回调
     */
    loadScene(sceneName: string, onLaunchedCallback?: Function, onUnloadedCallback?: Function): boolean;

    /**
     * 预加载场景
     * @param sceneName
     * @param onProgressCallback
     * @param onLoadedCallback
     */
    preloadScene(sceneName: string, onProgressCallback?: (completedCount: number, totalCount: number, item: any) => void, onLoadedCallback?: (error: Error | null, sceneAsset?: object) => void): void;
}
