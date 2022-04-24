import { sys } from "cc";
import { PlatformType } from "../PlatformType";
import { IPlatformHelper } from "./IPlatformHelper";

/**
 * cocos平台辅助器
 */
export class CPlatformHelp implements IPlatformHelper {
    getPlatformType(): PlatformType {
        let platformType = PlatformType.NONE;
        switch (sys.platform) {
            case "WIN32":
                break;
            case "ANDROID":
                platformType = PlatformType.ANDROID;
                break;
            case "IOS":
                platformType = PlatformType.IOS;
                break;
            case "WECHAT_GAME":
                platformType = PlatformType.WX;
                break;
        }

        return platformType;
    }
}
