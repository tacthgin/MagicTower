import { Asset, assetManager, AudioClip, JsonAsset, Prefab, resources, SpriteFrame } from "cc";
import { BaseEvent } from "../Constant/BaseEvent";
import { Fn } from "../Util/Fn";
import { NotifyCenter } from "./NotifyCenter";

export enum ResourceType {
    JSON = "Json",
    SPRITE = "Sprite",
    AUIDO = "Audio",
}

export class ResourceManager {
    /** 所有类型资源 */
    private assets: any = {};
    private resourcePromises: Promise<any>[] = [];
    private resourceAssetConfig: any = {
        [ResourceType.JSON]: JsonAsset,
        [ResourceType.SPRITE]: SpriteFrame,
        [ResourceType.AUIDO]: AudioClip,
    };

    init() {
        for (let type in ResourceType) {
            this.resourcePromises.push(this.createResourcePromise(ResourceType[type]));
        }
        return this;
    }

    loadResources() {
        if (this.resourcePromises.length > 0) {
            Promise.all(this.resourcePromises)
                .then((results) => {
                    NotifyCenter.emit(BaseEvent.ALL_RESOURCES_LOAD_SUCCESS);
                })
                .catch((type: ResourceType) => {
                    console.error(`加载资源类型${type}失败`);
                    BaseEvent.ALL_RESOURCES_LOAD_FAILED;
                });
        }
    }

    private createResourcePromise(type: string) {
        return new Promise((resolve, reject) => {
            if (resources.get(type)) {
                resolve(type);
            } else {
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
                        this.setAssets(type, assets);
                        resolve(type);
                    }
                );
            }
        });
    }

    private setAssets(type: string, assets: Asset[]) {
        let data = {};
        if (type != ResourceType.JSON) {
            assets.forEach((asset) => {
                let assetInfo: any = resources.getAssetInfo(asset._uuid);
                data[assetInfo.path] = asset;
            });
            this.assets[type] = data;
        } else {
            assets.forEach((asset) => {
                data[asset.name] = asset;
            });
            this.assets[type] = data;
        }
    }

    private onProgress(type: string, progress: number) {
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

    getAsset<T extends Asset>(type: ResourceType | Fn.Constructor<T>, path: string): T {
        if (typeof type == "string") {
            return this.assets[type][`${type}/${path}`] || null;
        } else {
            for (let typeName in this.resourceAssetConfig) {
                if (this.resourceAssetConfig[typeName] instanceof type) {
                    return this.assets[typeName][`${typeName}/${path}`] || null;
                }
            }
        }

        return null;
    }
}
