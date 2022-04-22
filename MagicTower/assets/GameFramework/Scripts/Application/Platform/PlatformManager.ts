import { IPlatform } from "./IPlatform";
import { IPlatformManager } from "./IPlatformManager";

/**
 * 第三方平台管理器
 */
export class PlatformManager implements IPlatformManager {
    private _platform: IPlatform = null!;
    /**
     * 初始化平台
     */
    initalize() {}

    getPlatform<T extends IPlatform>(): T {
        throw new Error("Method not implemented.");
    }

    private createPlatform() {
        
    }
}
