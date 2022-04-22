import { IPlatform } from "./IPlatform";

/**
 * 平台管理器接口
 */
export interface IPlatformManager {
    initalize(): void;
    getPlatform<T extends IPlatform>(): T;
}
