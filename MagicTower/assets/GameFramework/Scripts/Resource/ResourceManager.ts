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

@GameFrameworkEntry.registerModule("ResourceManager")
export class ResourceManager extends GameFrameworkModule implements IResourceManager {
    private _resourceLoaders: Map<string, ResourceLoader> = null!;
    private _remoteAssets: Map<string, Asset> = null!;
    private _resourceHelpPath: IResourcePathHelp = null!;

    constructor() {
        super();
        this._resourceLoaders = new Map<string, ResourceLoader>();
        this._remoteAssets = new Map<string, Asset>();
        this._resourceHelpPath = new ResourcePathHelp();
        this.createResourceLoader("resources", resources);
    }

    get internalResourceLoader(): IResourceLoader {
        return this.getResourceLoader("resources")!;
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
}
