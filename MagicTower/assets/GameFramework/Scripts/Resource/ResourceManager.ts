import { Asset, AssetManager, assetManager, resources } from "cc";
import { GameFrameworkEntry } from "../Base/GameFrameworkEntry";
import { GameFrameworkError } from "../Base/GameFrameworkError";
import { GameFrameworkModule } from "../Base/GameFrameworkModule";
import { GameFrameworkLog } from "../Base/Log/GameFrameworkLog";
import { ResourcePathHelp } from "./ResourcePathHelp";
import { IResourceLoader } from "./IResourceLoader";
import { IResourceLoaderHelp } from "./IResourceLoaderHelp";
import { IResourceManager, OptionBundle, OptionExt } from "./IResourceManager";
import { IResourcePathHelp } from "./IResourcePathHelp";
import { ResourceLoader } from "./ResourceLoader";
import { Constructor } from "../Base/DataStruct/Constructor";
import { ResourceProgressCallback, ResourceCompleteCallback } from "./ResourceCallback";

@GameFrameworkEntry.registerModule("ResourceManager")
export class ResourceManager extends GameFrameworkModule implements IResourceManager {
    private _resourceLoaders: Map<string, ResourceLoader> = null!;
    private _remoteAssets: Map<string, Asset> = null!;
    private _resourceHelpPath: IResourcePathHelp = null!;
    private readonly _bundleRegExp: RegExp = /^\$\w+\//;
    private _internaleResourceLoaderName: string = null!;

    constructor() {
        super();
        this._resourceLoaders = new Map<string, ResourceLoader>();
        this._remoteAssets = new Map<string, Asset>();
        this._resourceHelpPath = new ResourcePathHelp();
        this.setInternalResourceLoader();
    }

    update(elapseSeconds: number): void {}

    shutDown(): void {
        this._resourceLoaders.clear();
        this._remoteAssets.clear();
    }

    loadBundle(bundleNameOrUrl: string, options?: OptionBundle): Promise<IResourceLoader | null> {
        return new Promise<IResourceLoader | null>((resolve) => {
            let bundleName = this.getBundleName(bundleNameOrUrl);
            let resourceLoader = this.getResourceLoader(bundleName);
            if (resourceLoader) {
                resolve(resourceLoader);
            } else {
                assetManager.loadBundle(bundleNameOrUrl, options || null, (err: Error | null, data: AssetManager.Bundle) => {
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

    loadAsset<T extends Asset>(path: string, assetType?: Constructor<T>): Promise<T | null> {
        let resourceLoaderInfo = this.internalGetBundle(path);
        return resourceLoaderInfo.resourceLoader.loadAsset(resourceLoaderInfo.path, assetType);
    }

    loadAssetWithCallback<T extends Asset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T> | null): Promise<boolean> {
        let resourceLoaderInfo = this.internalGetBundle(path);
        return resourceLoaderInfo.resourceLoader.loadAssetWithCallback(resourceLoaderInfo.path, assetType, onProgress, onComplete);
    }

    loadDir<T extends Asset>(path: string, assetType?: Constructor<T>): Promise<boolean> {
        let resourceLoaderInfo = this.internalGetBundle(path);
        return resourceLoaderInfo.resourceLoader.loadDir(resourceLoaderInfo.path, assetType);
    }

    loadDirWithCallback<T extends Asset>(path: string, assetType?: Constructor<T>, onProgress?: ResourceProgressCallback | null, onComplete?: ResourceCompleteCallback<T[]> | null): Promise<boolean> {
        let resourceLoaderInfo = this.internalGetBundle(path);
        return resourceLoaderInfo.resourceLoader.loadDirWithCallback(resourceLoaderInfo.path, assetType, onProgress, onComplete);
    }

    loadRemote(url: string, options?: OptionExt): Promise<Asset | null> {
        return new Promise((resolve) => {
            let asset = this.getRemoteAsset(url);
            if (asset) {
                resolve(asset);
            } else {
                assetManager.loadRemote(url, options || null, (err: Error | null, data: Asset) => {
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

    getAsset<T extends Asset>(path: string, assetType?: Constructor<T>): T | null {
        throw new Error("Method not implemented.");
    }

    getRemoteAsset(url: string): Asset | null {
        if (!url) {
            throw new GameFrameworkError("url is invalid");
        }
        return this._remoteAssets.get(url) || null;
    }

    releaseAsset(asset: Asset): void {
        if (!asset) {
            throw new GameFrameworkError("asset is invalid");
        }
        assetManager.releaseAsset(asset);
    }

    releaseDir(path: string): void {
        throw new Error("Method not implemented.");
    }

    private setInternalResourceLoader(): void {
        this._internaleResourceLoaderName = "resources";

        if (this.getResourceLoader(this._internaleResourceLoaderName)) {
            throw new GameFrameworkError("internal resource loader already set");
        }
        this.createResourceLoader(this._internaleResourceLoaderName, resources);
    }

    private createResourceLoader(name: string, bundle: IResourceLoaderHelp): void {
        let resourceLoader = this._resourceLoaders.get(name);
        if (resourceLoader) {
            throw new GameFrameworkError(`has exist resource loader ${name}`);
        }
        resourceLoader = new ResourceLoader(bundle, this._resourceHelpPath, this);
        this._resourceLoaders.set(name, resourceLoader);
    }

    private getBundleName(bundleNameOrUrl: string): string {
        if (bundleNameOrUrl.startsWith("http")) {
            return bundleNameOrUrl.substring(bundleNameOrUrl.lastIndexOf("/") + 1);
        }
        return bundleNameOrUrl;
    }

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
