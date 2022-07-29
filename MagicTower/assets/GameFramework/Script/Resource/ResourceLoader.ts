import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkLog } from "../Base/Log/GameFrameworkLog";
import { IAsset } from "./Asset/IAsset";
import { ResourceCompleteCallback, ResourceProgressCallback } from "./Asset/IAssetManager";
import { IRequestItem } from "./Asset/IRequestItem";
import { IResourceLoader } from "./IResourceLoader";
import { IResourceLoaderHelper } from "./IResourceLoaderHelper";
import { IResourceManager } from "./IResourceManager";
import { IResourcePathHelper } from "./IResourcePathHelper";

/**
 * 资源加载器
 */
export class ResourceLoader implements IResourceLoader {
    private _resourceLoaderHelper: IResourceLoaderHelper = null!;
    private _resourcePathHelper: IResourcePathHelper = null!;
    private _cachedDirs: Map<string, Array<IAsset>> = null!;
    private _resourceManger: IResourceManager = null!;

    get name(): string {
        return this._resourceLoaderHelper.name;
    }

    constructor(resourceLoaderHelper: IResourceLoaderHelper, resourcePathHelper: IResourcePathHelper, resourceManager: IResourceManager) {
        this._resourceLoaderHelper = resourceLoaderHelper;
        this._resourcePathHelper = resourcePathHelper;
        this._resourceManger = resourceManager;
        this._cachedDirs = new Map<string, Array<IAsset>>();
    }

    shutDown(): void {
        this._cachedDirs.clear();
    }

    loadAsset<T extends IAsset>(path: string, assetType?: Constructor<T>): Promise<T | null> {
        return new Promise<T | null>((resolve) => {
            path = this._resourcePathHelper.getPath(path, assetType);
            let asset = this._resourceLoaderHelper.get(path, assetType);
            if (asset) {
                resolve(asset);
            } else {
                this._resourceLoaderHelper.load(path, assetType || null, null, (err: Error | null, data: T) => {
                    if (err) {
                        GameFrameworkLog.error(err.message);
                        resolve(null);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }

    loadAssetWithCallback<T extends IAsset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T> | null): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            path = this._resourcePathHelper.getPath(path, assetType);
            let asset = this._resourceLoaderHelper.get(path, assetType);
            if (asset) {
                onComplete && onComplete(null, asset);
                resolve(true);
            } else {
                this._resourceLoaderHelper.load(
                    path,
                    assetType || null,
                    (finished: number, total: number, item?: IRequestItem) => {
                        onProgress && onProgress(finished, total, item);
                    },
                    (err: Error | null, data: T) => {
                        onComplete && onComplete(err, data);
                        resolve(true);
                    }
                );
            }
        });
    }

    loadDir<T extends IAsset>(path: string, assetType?: Constructor<T>): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let result = this._cachedDirs.get(path);
            if (result) {
                resolve(true);
            } else {
                this._resourceLoaderHelper.loadDir(path, assetType || null, null, (err: Error | null, data: T[]) => {
                    if (err) {
                        GameFrameworkLog.error(err.message);
                        resolve(false);
                    } else {
                        this._cachedDirs.set(path, data);
                        resolve(true);
                    }
                });
            }
        });
    }

    loadDirWithCallback<T extends IAsset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T[]> | null): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let result = this._cachedDirs.get(path);
            if (result) {
                resolve(true);
            } else {
                this._resourceLoaderHelper.loadDir(
                    path,
                    assetType || null,
                    (finished: number, total: number, item?: IRequestItem) => {
                        onProgress && onProgress(finished, total, item);
                    },
                    (err: Error | null, data: T[]) => {
                        if (!err) {
                            this._cachedDirs.set(path, data);
                        }
                        onComplete && onComplete(err, data);
                        resolve(!!err);
                    }
                );
            }
        });
    }

    getAsset<T extends IAsset>(path: string, assetType?: Constructor<T>): T | null {
        path = this._resourcePathHelper.getPath(path, assetType);
        return this._resourceLoaderHelper.get(path, assetType);
    }

    releaseDir(path: string): void {
        let assets = this._cachedDirs.get(path);
        if (assets) {
            assets.forEach((asset) => {
                this._resourceManger.releaseAsset(asset);
            });
            this._cachedDirs.delete(path);
        }
    }
}
