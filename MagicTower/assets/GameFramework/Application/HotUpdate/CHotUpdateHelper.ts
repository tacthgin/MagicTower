import { GameFrameworkError } from "../../Script/Base/GameFrameworkError";
import { GameFrameworkLog } from "../../Script/Base/Log/GameFrameworkLog";
import { IHotUpdateHelper } from "../../Script/Resource/IHotUpdateHelper";
import { ISaveManager } from "../../Script/Save/ISaveManager";
import { IPlatformManager } from "../Platform/IPlatformManager";

export class CHotUpdateHelper implements IHotUpdateHelper {
    private _assetManager: jsb.AssetsManager = null!;
    private _platformManager: IPlatformManager | null = null;
    private _saveManager: ISaveManager = null!;
    private _failCallback: ((errorMessage: string) => void) | null = null;
    private _completeCallback: ((restart: boolean) => void) | null = null;
    private _fileProgressCallback: ((progress: number, current: number, total: number) => void) | null = null;
    private _bytesProgressCallback: ((progress: number, current: number, total: number) => void) | null = null;
    private _updating: boolean = false;
    private _canRetry: boolean = false;
    private _manifestUrl: string = "";

    /**
     * 设置平台管理器
     * @param platformManager 平台管理器
     */
    setPlatformManager(platformManager: IPlatformManager) {
        this._platformManager = platformManager;
    }

    /**
     * 设置存储管理器
     * @param saveManager 存储管理器
     */
    setSaveManager(saveManager: ISaveManager) {
        this._saveManager = saveManager;
    }

    startHotUpdate(manifestUrl: string): void {
        if (!manifestUrl || !this._platformManager || !this._platformManager.isNativePlatform()) {
            //没有平台或者不是原生平台跳过热更新
            this.updateComplete(false);
            return;
        }

        if (!this._saveManager) {
            throw new GameFrameworkError("you must set save manager first");
        }

        this.initHotUpdate(manifestUrl);
        this.checkUpdate();
    }

    setHotUpdateCallback(
        failCallback: (errorMessage: string) => void,
        completeCallback: (testart: boolean) => void,
        bytesProgressCallback: ((progress: number, current: number, total: number) => void) | null = null,
        fileProgressCallback: ((progress: number, current: number, total: number) => void) | null = null
    ): void {
        this._failCallback = failCallback;
        this._completeCallback = completeCallback;
        this._fileProgressCallback = fileProgressCallback;
        this._bytesProgressCallback = bytesProgressCallback;
    }

    retry(): void {
        if (!this._updating && this._canRetry) {
            this._canRetry = false;

            GameFrameworkLog.log("Retry failed Assets...");
            this._assetManager.downloadFailedAssets();
        }
    }

    private initHotUpdate(manifestUrl: string): void {
        if (this._assetManager) return;
        this._manifestUrl = manifestUrl;
        let storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "blackjack-remote-asset";
        GameFrameworkLog.log(`storage path for remote asset : ${storagePath}`);
        this._assetManager = new jsb.AssetsManager("", storagePath, this.versionCompareHandle);
        this._assetManager.setVerifyCallback((path: string, asset: any) => {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            let compressed = asset.compressed;
            // Retrieve the correct md5 value.
            let expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            let relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            let size = asset.size;
            if (compressed) {
                GameFrameworkLog.log("Verification passed : " + relativePath);
            } else {
                GameFrameworkLog.log("Verification passed : " + relativePath + " (" + expectedMD5 + ")");
            }

            return true;
        });
    }

    private checkUpdate(): void {
        if (this._updating) {
            GameFrameworkLog.log("checking or updating");
            return;
        }

        if (this._assetManager.getState() === jsb.AssetsManager.State.UNINITED) {
            this._assetManager.loadLocalManifest(this._manifestUrl);
        }

        if (!this._assetManager.getLocalManifest() || !this._assetManager.getLocalManifest().isLoaded()) {
            GameFrameworkLog.log("failed to load local manifest");
            return;
        }

        this._assetManager.setEventCallback(this.checkCallback.bind(this));
        this._assetManager.checkUpdate();
        this._updating = true;
    }

    private checkCallback(event: any) {
        let canUpdate = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                GameFrameworkLog.log("no local manifest file found, hot update skipped");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                GameFrameworkLog.log("fail to download manifest file, hot update skipped");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                GameFrameworkLog.log("already up to date with the latest remote version");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                GameFrameworkLog.log(`new version found, please try to update.(${Math.ceil(this._assetManager.getTotalBytes() / 1024)}kb)`);
                canUpdate = true;
                break;
            default:
                return;
        }

        if (canUpdate) {
            this._assetManager.setEventCallback(null!);
            this._updating = false;
            this.hotUpdate();
        } else {
            this.updateComplete(false);
        }
    }

    private hotUpdate() {
        if (this._updating) return;

        this._assetManager.setEventCallback(this.updateCallback.bind(this));
        if (this._assetManager.getState() === jsb.AssetsManager.State.UNINITED) {
            this._assetManager.loadLocalManifest(this._manifestUrl);
        }

        this._assetManager.update();
        this._updating = true;
    }

    private updateCallback(event: any) {
        let needRestart = false;
        let failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                GameFrameworkLog.log("No local manifest file found, hot update skipped.");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this._fileProgressCallback && this._fileProgressCallback(event.getPercentByFile(), event.getDownloadedFiles(), event.getTotalFiles());
                this._bytesProgressCallback && this._bytesProgressCallback(event.getPercent(), event.getDownloadedBytes(), event.getTotalBytes());

                let msg = event.getMessage();
                if (msg) {
                    GameFrameworkLog.log("Updated file: " + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                GameFrameworkLog.log("Fail to download manifest file, hot update skipped.");
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                GameFrameworkLog.log("Already up to date with the latest remote version.");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                GameFrameworkLog.log("Update finished. " + event.getMessage());
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                GameFrameworkLog.log("Update failed. " + event.getMessage());
                this._updating = false;
                this._canRetry = true;
                this._failCallback && this._failCallback(event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                GameFrameworkLog.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                GameFrameworkLog.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this.updateComplete(false);
        }

        if (needRestart) {
            this._assetManager.setEventCallback(null!);
            // Prepend the manifest's search path
            let searchPaths = jsb.fileUtils.getSearchPaths();
            let newPaths = this._assetManager.getLocalManifest().getSearchPaths();
            GameFrameworkLog.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            this._saveManager.setString("HotUpdateSearchPaths", JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            this.updateComplete(true);
        }
    }

    /**
     * 版本比较
     * @param versionA a版本
     * @param versionB b版本
     * @returns
     */
    private versionCompareHandle(versionA: string, versionB: string): number {
        GameFrameworkLog.log("JS Custom Version Compare: version A is " + versionA + ", version B is " + versionB);
        let va = versionA.split(".");
        let vb = versionB.split(".");
        for (let i = 0; i < va.length; ++i) {
            let a = parseInt(va[i]);
            let b = parseInt(vb[i] || "0");
            if (a === b) {
                continue;
            } else {
                return a - b;
            }
        }

        return vb.length > vb.length ? -1 : 0;
    }

    private updateComplete(restart: boolean): void {
        this._updating = false;
        if (this._assetManager) {
            this._assetManager.setEventCallback(null!);
        }
        this._completeCallback && this._completeCallback(restart);
    }
}
