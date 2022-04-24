import { AndroidPlatform } from "./Android/AndroidPlatform";
import { IOSPlatform } from "./IOS/IOSPlatform";
import { IPlatform } from "./IPlatform";
import { IPlatformHelper } from "./IPlatformHelper";
import { IPlatformManager } from "./IPlatformManager";
import { PlatformType } from "./PlatformType";
import { WXPlatform } from "./WX/WXPlatform";

/**
 * 第三方平台管理器
 */
export class PlatformManager implements IPlatformManager {
    private _platform: IPlatform | null = null;
    private _platformType: PlatformType = PlatformType.NONE;
    private _platformHelper: IPlatformHelper | null = null;

    initalize(platformHelper: IPlatformHelper) {
        this._platformHelper = platformHelper;
        this._platformType = this._platformHelper.getPlatformType();
        if (!this._platform) {
            this.createPlatform();
            this.getPlatform().initalize();
        }
    }

    getPlatform<T extends IPlatform>(): T {
        if (this._platform) {
            return this._platform as T;
        } else {
            throw new Error("platform does not exist");
        }
    }

    private createPlatform(): void {
        switch (this._platformType) {
            case PlatformType.ANDROID:
                this._platform = new AndroidPlatform(this._platformType);
                break;
            case PlatformType.IOS:
                this._platform = new IOSPlatform(this._platformType);
                break;
            case PlatformType.WX:
                this._platform = new WXPlatform(this._platformType);
                break;
            default:
                this._platform = null;
                break;
        }
    }
}
