import { PlatformBase } from "../PlatformBase";
import { IAndroidPlatfrom } from "./IAndroidPlatform";

/**
 * 安卓平台
 */
export class AndroidPlatform extends PlatformBase implements IAndroidPlatfrom {
    initalize(): void {
        throw new Error("Method not implemented.");
    }
}
