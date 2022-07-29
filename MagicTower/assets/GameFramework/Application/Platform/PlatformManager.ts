import { GameFrameworkError } from "../../Script/Base/GameFrameworkError";
import { IPlatformHelper } from "./Helper/IPlatformHelper";
import { IPlatformManager } from "./IPlatformManager";
import { AndroidPlatform } from "./Platform/Android/AndroidPlatform";
import { IOSPlatform } from "./Platform/IOS/IOSPlatform";
import { INativePlatform, IPlatform, IWebPlatform } from "./Platform/IPlatform";
import { Win32Platform } from "./Platform/Win32/Win32Platform";
import { WXPlatform } from "./Platform/WX/WXPlatform";
import { PlatformType } from "./PlatformType";

/**
 * 第三方平台管理器
 */
export class PlatformManager implements IPlatformManager {
    private _platform: IPlatform | null = null;
    private _platformType: PlatformType = PlatformType.NONE;
    private _platformHelper: IPlatformHelper | null = null;

    get platformType(): PlatformType {
        return this._platformType;
    }

    get NativePlatform(): INativePlatform {
        switch (this._platformType) {
            case PlatformType.ANDROID:
            case PlatformType.IOS:
                return this.getPlatform();
            default:
                throw new GameFrameworkError("native platform does not exist");
        }
    }

    get WebPlatform(): IWebPlatform {
        switch (this._platformType) {
            case PlatformType.WX:
                return this.getPlatform();
            default:
                throw new GameFrameworkError("web platform does not exist");
        }
    }

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
            throw new GameFrameworkError("platform does not exist");
        }
    }

    isNativePlatform(): boolean {
        return this._platformType == PlatformType.IOS || this._platformType == PlatformType.ANDROID;
    }

    private createPlatform(): void {
        switch (this._platformType) {
            case PlatformType.WIN32:
                this._platform = new Win32Platform(this._platformType);
                break;
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
