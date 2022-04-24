import { PlatformType } from "./PlatformType";

/**
 * 平台接口
 */
export interface IPlatform {
    initalize(): void;

    /**
     * 是否当前平台
     * @param platformType 平台类型
     * @returns 平台类型符合当前平台
     */
    isPlatform(platformType: PlatformType): boolean;
}
