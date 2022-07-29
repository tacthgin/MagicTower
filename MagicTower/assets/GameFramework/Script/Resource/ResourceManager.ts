import { Constructor } from "../Base/DataStruct/Constructor";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { GameFrameworkLog } from "../Base/Log/GameFrameworkLog";
import { IAsset } from "./Asset/IAsset";
import { IAssetManager, ResourceCompleteCallback, ResourceProgressCallback } from "./Asset/IAssetManager";
import { OptionBundle, OptionExt } from "./Asset/IOption";
import { IHotUpdateHelper } from "./IHotUpdateHelper";
import { IResourceLoader } from "./IResourceLoader";
import { IResourceLoaderHelper } from "./IResourceLoaderHelper";
import { IResourceManager } from "./IResourceManager";
import { IResourcePathHelper } from "./IResourcePathHelper";
import { ResourceLoader } from "./ResourceLoader";

@GameFrameworkEntry.registerModule("ResourceManager")
export class ResourceManager extends GameFrameworkModule implements IResourceManager {
    private readonly _resourceLoaders: Map<string, ResourceLoader> = null!;
    private readonly _remoteAssets: Map<string, IAsset> = null!;
    private _assetManager: IAssetManager | null = null;
    private _resourcePathHelper: IResourcePathHelper | null = null;
    private _hotUpdateHelper: IHotUpdateHelper | null = null;
    private readonly _bundleRegExp: RegExp = /^\$\w+\//;
    private _internaleResourceLoaderName: string = "";

    constructor() {
        super();
        this._resourceLoaders = new Map<string, ResourceLoader>();
        this._remoteAssets = new Map<string, IAsset>();
    }

    setHotUpdateHelper(hotUpdateHelper: IHotUpdateHelper): void {
        this._hotUpdateHelper = hotUpdateHelper;
    }

    update(elapseSeconds: number): void {}

    shutDown(): void {
        this._resourceLoaders.clear();
        this._remoteAssets.clear();
        this._assetManager = null;
        this._resourcePathHelper = null;
        this._hotUpdateHelper = null;
    }

    /**
     * 设置内置的资源加载器
     * @param resourceLoaderHelper 资源加载辅助器
     */
    setInternalResourceLoader(resourceLoaderHelper: IResourceLoaderHelper): void {
        this._internaleResourceLoaderName = resourceLoaderHelper.name;

        if (this.getResourceLoader(this._internaleResourceLoaderName)) {
            throw new GameFrameworkError("internal resource loader already set");
        }
        this.createResourceLoader(this._internaleResourceLoaderName, resourceLoaderHelper);
    }

    /**
     * 设置资源管理器
     * @param assetManager 资源管理器
     */
    setAssetManager(assetManager: IAssetManager): void {
        this._assetManager = assetManager;
    }

    /**
     * 设置资源路径辅助器
     * @param resourcePathHelper 资源路径辅助器
     */
    setResourcePathHelper(resourcePathHelper: IResourcePathHelper): void {
        this._resourcePathHelper = resourcePathHelper;
    }

    loadBundle(bundleNameOrUrl: string, options?: OptionBundle): Promise<IResourceLoader | null> {
        return new Promise<IResourceLoader | null>((resolve) => {
            let bundleName = this.getBundleName(bundleNameOrUrl);
            let resourceLoader = this.getResourceLoader(bundleName);
            if (resourceLoader) {
                resolve(resourceLoader);
            } else {
                if (!this._assetManager) {
                    throw new GameFrameworkError("you must set asset manager first");
                }
                this._assetManager.loadBundle(bundleNameOrUrl, options || null, (err: Error | null, data: IResourceLoaderHelper) => {
                    if (err) {
                        GameFrameworkLog.error(err);
                        resolve(null);
                    } else {
                        this.createResourceLoader(bundleName, data);
                        resolve(this.getResourceLoader(bundleName));
                    }
                });
            }
        });
    }

    getResourceLoader(name: string): IResourceLoader | null {
        let resourceLoader = this._resourceLoaders.get(name);
        return resourceLoader || null;
    }

    loadAsset<T extends IAsset>(path: string, assetType?: Constructor<T>): Promise<T | null> {
        let resourceLoaderInfo = this.internalGetBundle(path);
        return resourceLoaderInfo.resourceLoader.loadAsset(resourceLoaderInfo.path, assetType);
    }

    loadAssetWithCallback<T extends IAsset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T> | null): Promise<boolean> {
        let resourceLoaderInfo = this.internalGetBundle(path);
        return resourceLoaderInfo.resourceLoader.loadAssetWithCallback(resourceLoaderInfo.path, assetType, onProgress, onComplete);
    }

    loadDir<T extends IAsset>(path: string, assetType?: Constructor<T>): Promise<boolean> {
        let resourceLoaderInfo = this.internalGetBundle(path);
        return resourceLoaderInfo.resourceLoader.loadDir(resourceLoaderInfo.path, assetType);
    }

    loadDirWithCallback<T extends IAsset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T[]> | null): Promise<boolean> {
        let resourceLoaderInfo = this.internalGetBundle(path);
        return resourceLoaderInfo.resourceLoader.loadDirWithCallback(resourceLoaderInfo.path, assetType, onProgress, onComplete);
    }

    loadRemote(url: string, options?: OptionExt): Promise<IAsset | null> {
        return new Promise((resolve) => {
            let asset = this.getRemoteAsset(url);
            if (asset) {
                resolve(asset);
            } else {
                if (!this._assetManager) {
                    throw new GameFrameworkError("you must set asset manager first");
                }

                this._assetManager.loadRemote(url, options || null, (err: Error | null, data: IAsset) => {
                    if (err) {
                        GameFrameworkLog.error(err);
                        resolve(null);
                    } else {
                        this._remoteAssets.set(url, data);
                        resolve(data);
                    }
                });
            }
        });
    }

    getAsset<T extends IAsset>(path: string, assetType?: Constructor<T>): T | null {
        let resourceLoaderInfo = this.internalGetBundle(path);
        return resourceLoaderInfo.resourceLoader.getAsset(resourceLoaderInfo.path, assetType);
    }

    getRemoteAsset(url: string): IAsset | null {
        if (!url) {
            throw new GameFrameworkError("url is invalid");
        }
        return this._remoteAssets.get(url) || null;
    }

    releaseAsset(asset: IAsset): void {
        if (!this._assetManager) {
            throw new GameFrameworkError("you must set asset manager first");
        }

        if (!asset) {
            throw new GameFrameworkError("asset is invalid");
        }
        this._assetManager.releaseAsset(asset);
    }

    releaseDir(path: string): void {
        let resourceLoaderInfo = this.internalGetBundle(path);
        resourceLoaderInfo.resourceLoader.releaseDir(resourceLoaderInfo.path);
    }

    startHotUpdate(manifestUrl: string): void {
        if (!this._hotUpdateHelper) {
            throw new GameFrameworkError("you must set hot update helper first");
        }
        this._hotUpdateHelper.startHotUpdate(manifestUrl);
    }

    setHotUpdateCallback(
        failCallback: (errorMessage: string) => void,
        completeCallback: (restart: boolean) => void,
        fileProgressCallback: ((progress: number, current: number, total: number) => void) | null = null,
        bytesProgressCallback: ((progress: number, current: number, total: number) => void) | null = null
    ): void {
        if (!this._hotUpdateHelper) {
            throw new GameFrameworkError("you must set hot update helper first");
        }
        this._hotUpdateHelper.setHotUpdateCallback(failCallback, completeCallback, fileProgressCallback, bytesProgressCallback);
    }

    retry(): void {
        if (!this._hotUpdateHelper) {
            throw new GameFrameworkError("you must set hot update helper first");
        }
        this._hotUpdateHelper.retry();
    }

    /**
     * 创建资源加载器
     * @param name 资源加载器名称
     * @param bundle 资源加载器
     */
    private createResourceLoader(name: string, bundle: IResourceLoaderHelper): void {
        let resourceLoader = this._resourceLoaders.get(name);
        if (resourceLoader) {
            throw new GameFrameworkError(`has exist resource loader ${name}`);
        }

        if (!this._resourcePathHelper) {
            throw new GameFrameworkError("you must set resource path help first");
        }

        resourceLoader = new ResourceLoader(bundle, this._resourcePathHelper, this);
        this._resourceLoaders.set(name, resourceLoader);
    }

    /**
     * 获取资源加载器名称
     * @param bundleNameOrUrl 资源加载器名称或者url
     * @returns
     */
    private getBundleName(bundleNameOrUrl: string): string {
        if (bundleNameOrUrl.startsWith("http")) {
            return bundleNameOrUrl.substring(bundleNameOrUrl.lastIndexOf("/") + 1);
        }
        return bundleNameOrUrl;
    }

    /**
     * 根据路径获取资源加载器名称
     * @param path 路径
     * @returns 获取的资源加载器名称和新的路径
     */
    private internalGetBundleName(path: string): { bundleName: string; path: string } | null {
        if (!path) {
            throw new GameFrameworkError("path is invalid");
        }
        let matchResult = path.match(this._bundleRegExp);
        if (matchResult) {
            return {
                bundleName: matchResult[0].slice(1, matchResult[0].length - 1),
                path: path.slice(matchResult[0].length),
            };
        }

        return null;
    }

    /**
     * 根据路径获取资源加载器
     * @param path 路径
     * @returns 资源加载器和新的路径
     */
    private internalGetBundle(path: string): { resourceLoader: IResourceLoader; path: string } {
        let bundleInfo = this.internalGetBundleName(path);
        let bundleName = this._internaleResourceLoaderName;
        if (bundleInfo) {
            bundleName = bundleInfo.bundleName;
            path = bundleInfo.path;
        }
        let resourceLoader = this.getResourceLoader(bundleName);
        if (!resourceLoader) {
            throw new GameFrameworkError(`${bundleName} resource loader has not exist`);
        }

        return { resourceLoader: resourceLoader, path: path };
    }
}
