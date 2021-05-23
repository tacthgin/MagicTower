import { Asset, assetManager, AudioClip, JsonAsset, Prefab, resources, SpriteFrame, TiledMapAsset } from "cc";
import { BaseEvent } from "../Base/BaseContant";
import { Fn } from "../Util/Fn";
import { NotifyCenter } from "./NotifyCenter";

export enum ResourceType {
    JSON = "Json",
    SPRITE = "Sprite",
    AUIDO = "Audio",
    TILED_MAP = "TiledMap",
}

/** resources资源加载管理 */
export class ResourceManager {
    /** 所有类型资源 */
    private assets: any = {};
    /** 预加载资源 */
    private resourcePromises: Promise<any>[] = [];
    private resourceAssetConfig: Readonly<any> = {
        [ResourceType.JSON]: JsonAsset,
        [ResourceType.SPRITE]: SpriteFrame,
        [ResourceType.AUIDO]: AudioClip,
        [ResourceType.TILED_MAP]: TiledMapAsset,
    };
    /** 预加载资源完成个数 */
    private resourceCompleteCount: number = 0;
    /** 预加载预设 */
    private preloadPrefabs: any = {};

    init() {
        // for (let type in ResourceType) {
        //     this.resourcePromises.push(this.createResourcePromise((ResourceType as any)[type]));
        // }
        this.resourcePromises.push(this.createResourcePromise(ResourceType.TILED_MAP));
        return this;
    }

    loadResources() {
        this.resourceCompleteCount = 0;
        if (this.resourcePromises.length > 0) {
            Promise.all(this.resourcePromises)
                .then((results) => {
                    NotifyCenter.emit(BaseEvent.ALL_RESOURCES_LOAD_SUCCESS);
                })
                .catch((type: ResourceType) => {
                    console.error(`加载资源类型${type}失败`);
                    NotifyCenter.emit(BaseEvent.ALL_RESOURCES_LOAD_FAILED);
                });
        }
    }

    private createResourcePromise(type: string) {
        return new Promise((resolve, reject) => {
            if (resources.get(type)) {
                resolve(type);
            } else {
                let now = Date.now();
                resources.loadDir(
                    type,
                    this.resourceAssetConfig[type],
                    (finished: number, total: number) => {
                        this.onProgress(type, finished / total);
                    },
                    (err, assets) => {
                        if (err) {
                            console.error(err);
                            reject(type);
                            return;
                        }
                        console.log(`加载${type}资源: ${Date.now() - now}ms`);
                        this.setAssets(type, assets);
                        resolve(type);
                        NotifyCenter.emit(BaseEvent.RESOURCE_COMPLETE, type);
                    }
                );
            }
        });
    }

    private setAssets(type: string, assets: Asset[]) {
        let data: any = {};
        if (type != ResourceType.JSON) {
            assets.forEach((asset) => {
                let assetInfo: any = resources.getAssetInfo(asset._uuid);
                data[assetInfo.path] = asset;
            });
            this.assets[type] = data;
        } else {
            assets.forEach((asset: any) => {
                data[asset.name] = asset.json;
            });
            this.assets[type] = data;
        }
        ++this.resourceCompleteCount;
    }

    private onProgress(type: string, progress: number) {
        //console.log(this.resourceCompleteCount, progress);
        progress = this.resourceCompleteCount / this.resourcePromises.length + (1 / this.resourcePromises.length) * progress;
        NotifyCenter.emit(BaseEvent.RESOURCE_PROGRESS, type, progress);
    }

    releaseResDir(type: ResourceType) {
        let assets = this.assets[type];
        if (assets) {
            assets.forEach((asset: Asset) => {
                assetManager.releaseAsset(asset);
            });
        }
    }

    getAssets(type: ResourceType): any {
        return this.assets[type] || null;
    }

    getAsset<T extends Asset>(type: ResourceType | Fn.Constructor<T>, path: string): T | null {
        let asset = null;
        if (typeof type == "string") {
            asset = this.assets[type][`${type}/${path}`];
        } else {
            for (let typeName in this.resourceAssetConfig) {
                if (this.resourceAssetConfig[typeName] == type) {
                    asset = this.assets[typeName][`${typeName}/${path}`];
                    break;
                }
            }
        }

        if (!asset) {
            console.warn("找不到资源", path);
            return null;
        }

        return asset;
    }

    getSpriteFrame(path: string): SpriteFrame | null {
        return this.getAsset(ResourceType.SPRITE, path);
    }

    loadPrefab(path: string): Promise<Prefab | null> {
        return new Promise((resolve) => {
            resources.load(path, Prefab, (err, prefab: Prefab) => {
                if (err) {
                    console.error(err);
                    resolve(null);
                }
                resolve(prefab);
            });
        });
    }

    loadPrefabDir(path: string) {
        return new Promise((resolve, reject) => {
            if (resources.get(path)) {
                resolve(path);
            } else {
                resources.loadDir(path, Prefab, (err, assets) => {
                    if (err) {
                        console.error(err);
                        reject("加载预设失败");
                        return;
                    }
                    resolve(path);
                    assets.forEach((asset) => {
                        this.preloadPrefabs[asset.name] = asset;
                    });
                });
            }
        });
    }

    getPrefab(name: string): Prefab {
        return this.preloadPrefabs[name] || null;
    }
}
