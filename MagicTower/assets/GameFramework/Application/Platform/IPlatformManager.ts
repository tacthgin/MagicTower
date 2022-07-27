import { IPlatformHelper } from "./Helper/IPlatformHelper";
import { INativePlatform, IPlatform, IWebPlatform } from "./Platform/IPlatform";
import { PlatformType } from "./PlatformType";

/**
 * 平台管理器接口
 */
export interface IPlatformManager {
    /**
     * 获取平台类型
     */
    readonly platformType: PlatformType;

    /**
     * 原生平台
     */
    readonly NativePlatform: INativePlatform;

    /**
     * 获取小游戏平台
     */
    readonly WebPlatform: IWebPlatform;

    /**
     * 平台管理器初始化
     * @param platformHelper 平台辅助器
     */
    initalize(platformHelper: IPlatformHelper): void;

    /**
     * 是否原生平台
     * @returns 是否原生平台
     */
    isNativePlatform(): boolean;

    /**
     * 获取当前平台
     * @returns 当前平台
     */
    getPlatform<T extends IPlatform>(): T;
}
