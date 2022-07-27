import { PlatformType } from "../PlatformType";

/**
 * 平台辅助器
 */
export interface IPlatformHelper {
    /**
     * 获取平台类型
     */
    getPlatformType(): PlatformType;
}
