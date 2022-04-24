import { IPlatform } from "./IPlatform";
import { IPlatformHelper } from "./IPlatformHelper";
import { PlatformType } from "./PlatformType";

/**
 * 平台管理器接口
 */
export interface IPlatformManager {
    /**
     * 平台管理器初始化
     * @param platformHelper 平台辅助器
     */
    initalize(platformHelper: IPlatformHelper): void;

    /**
     * 获取当前平台
     * @returns 当前平台
     */
    getPlatform<T extends IPlatform>(): T;
}
